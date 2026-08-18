---
title: "OpenClaw Access Control: SecretRef Is Not Process Isolation — Here's What It Actually Solves"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, authentication, oauth, secrets, secretref, trusted-proxy, api-key]
lang: en
series:
  name: "Reading the OpenClaw Docs"
  order: 19
tldr: "SecretRefs keep credentials out of plaintext config, and the model-call chain sees process-local sentinels instead of the real value. But the docs say it plainly: this is not process isolation — the real value still exists in the same process's memory, and any plaintext file the agent can read bypasses the whole mechanism."
description: "Credential management in OpenClaw: the recommended path for model provider auth, the SecretRef runtime snapshot and sentinel mechanism, active-surface filtering and degradation semantics, and the real criteria for a completed migration."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-auth-secrets)

The Gateway manages two credential classes: **model provider authentication** and **access control for the Gateway itself**. This article covers the former and the shared secrets machinery beneath it — which grew a great deal after March.

(Gateway connection auth — token, password, trusted-proxy — belongs to configuration and remote access, covered in the Gateway article.)

## The most predictable path: an API key

For a long-lived gateway host the docs are direct: **an API key is the most predictable option**, with subscription and OAuth flows working when they match your provider account model.

The key must live **on the Gateway host** (the machine running `openclaw gateway`). If the gateway runs under systemd or launchd, the variable belongs in `~/.openclaw/.env` so the daemon can read it:

```bash
cat >> ~/.openclaw/.env <<'EOF'
<PROVIDER>_API_KEY=...
EOF
```

Then restart and verify:

```bash
openclaw models status
openclaw doctor
openclaw models status --check   # automation: exit 1 expired/missing, 2 expiring
openclaw models status --probe   # live probe
```

Two probe results are worth knowing how to read: if `auth.order.<provider>` omits a stored profile, the probe reports `excluded_by_auth_order` rather than trying it; and if auth exists but no probeable model resolves for that provider, it reports `status: no_model`.

## What Anthropic's Claude CLI reuse actually does

This path deserves its own explanation because it is nothing like copying a token:

```bash
claude auth login
claude auth status --text
openclaw models auth login --provider anthropic --method cli --set-default
```

At run time OpenClaw treats a reused Claude CLI login **as Claude's own credential**: it verifies the host's current `claude` login matches the selected profile's account, then lets the `claude` subprocess **authenticate natively**, so Claude keeps refreshing its own login during runs.

**OpenClaw never forwards a copied token on this path.** If the host login is missing or belongs to a different account, the run fails before spawn with the exact re-authentication commands.

## Where credentials live (this changed after March)

Auth profiles are now read from each agent's `openclaw-agent.sqlite`. Endpoint details (`baseUrl`, `api`, model ids, headers, timeouts) belong under `models.providers.<id>` in `openclaw.json` or `models.json`, **not in auth profiles**.

Older installs still holding `auth-profiles.json`, `auth-state.json`, or a flat `{ "openrouter": { "apiKey": "..." } }` shape should run `openclaw doctor --fix` to import into SQLite; doctor keeps timestamped backups next to the original JSON.

One more easy mistake: **external auth routes are not credentials.** Bedrock's `auth: "aws-sdk"` belongs in `auth.profiles.<name>.mode: "aws-sdk"` (config metadata) — do **not** write `type: "aws-sdk"` into the credential store.

## SecretRef: what it solves and what it does not

SecretRefs let supported credentials avoid plaintext in config, written as `{ source, provider, id }` across `env` / `file` / `exec` / `store` providers. **Plaintext still works; SecretRefs are opt-in per credential.**

But the docs are unusually clear about the boundary, and it is worth reading line by line:

> SecretRefs stop credentials from being persisted in config and generated model files, but **they are not a process-isolation boundary**. A plaintext credential left on disk in a path the agent can read is still readable via file or shell tools, bypassing API-level redaction.

In other words: `openclaw.json`, `.env`, retired auth-profile JSON archives, generated `agents/*/agent/models.json` — if the agent can read them, plaintext is still plaintext.

## Sentinels: the model-call chain does not see the real value

This is the most interesting piece of the implementation. For SecretRef-backed model provider credentials, OpenClaw mints an **opaque, process-local sentinel** during model-auth resolution.

So auth storage, stream options, SDK configuration, logs, error objects, and most runtime introspection see something like `oc-sent-v2..end` rather than the credential. Only the guarded fetch swaps sentinels for real values immediately before the request leaves the process.

Two design details are elegant:

- **Unknown sentinel-shaped values fail closed** — OpenClaw refuses to send the request rather than forwarding an unresolved sentinel to a provider
- Resolved secret values are **registered for exact-value log redaction** as defense in depth

And again, no overclaiming: **sentinels are not process isolation.** The real value still exists in same-process memory and appears at the final adapter boundary. Plain environment credentials not configured through SecretRefs sit outside the mechanism entirely.

For incident response or compatibility troubleshooting, `OPENCLAW_SECRET_SENTINELS=off` disables sentinel minting — note that the kill switch does **not** disable exact-value redaction registration.

## Runtime model: snapshots, degradation, fail-closed

Secrets resolve **eagerly into an in-memory runtime snapshot during activation**, not lazily on request paths. The purpose is explicit: **keep secret-provider outages off hot request paths.**

Cold-start behavior is finely graded:

- A retryable SecretRef failure attributable to a mapped, isolatable non-Gateway owner (model providers, skills, media/TTS/cron providers, eligible auth profiles, per-agent memory, sandbox SSH, channel accounts, manifest-declared plugin routes) lets **the Gateway start anyway**, records that owner as configured-unavailable, and emits a redacted degradation warning
- **Gateway ingress auth, structurally invalid refs or resolved values, fail-closed owners, and refs whose owner is unmapped still fail startup**

On reload, each mapped owner validates independently, then **one atomic snapshot is published**. An eligible failed owner keeps its last-known-good value and becomes stale only when its ref identities, provider definitions, and complete non-secret contract are unchanged; a changed or new failure becomes cold. A strict failure rejects the reload entirely and preserves the active snapshot.

## Active-surface filtering

A very practical design: **SecretRefs are validated only on effectively active surfaces.**

Disabled channels and accounts, top-level channel credentials no enabled account inherits, disabled tool surfaces, and web-search provider keys not selected by `tools.web.search.provider` — unresolved refs there **do not block startup**, emitting only a non-fatal `SECRETS_REF_IGNORED_INACTIVE_SURFACE` diagnostic.

Sandbox SSH auth material is likewise active only when the effective sandbox backend is `ssh` and sandbox mode is not off. This avoids "I left an unused config block behind and now the whole Gateway won't start."

One precedence rule to remember: **active `gateway.auth.token` / `gateway.auth.password` SecretRefs stay authoritative over `OPENCLAW_GATEWAY_TOKEN` / `OPENCLAW_GATEWAY_PASSWORD`**; environment credentials are fallbacks only when the corresponding local config input is absent.

## When migration is actually complete

The docs define this as **a security migration gate, not a convenience helper**. All of these must hold:

1. Supported credentials use SecretRefs rather than plaintext values
2. Plaintext residue is scrubbed from `openclaw.json`, the SQLite auth-profile store, `.env`, and generated `models.json` files (retired auth JSON is doctor-owned migration input and is never rewritten by `secrets apply`)
3. `openclaw secrets audit --check` is clean
4. Any remaining unsupported or rotating credentials are protected by OS isolation, container isolation, or an external credential proxy

And one warning worth copying down: **SecretRefs do not make arbitrary readable files safe.** Backups, copied configs, old generated model catalogs, and unsupported credential classes remain production secrets until deleted, moved outside the agent trust boundary, or isolated separately.

## The big picture

The philosophy here matches the threat model article: **do the defensible part thoroughly, and say plainly what is not defended.**

SecretRefs plus sentinels genuinely remove plaintext from config files, logs, and SDK configuration — which solves the very real problem of credentials scattered across paths the agent can read. But at no point does the mechanism pretend to be process isolation, or to protect that backup you left on disk.

In practice there is one checkpoint: **is `openclaw secrets audit --check` clean?**

## Changelog

- 2026-08-18: Substantially revised against the current official docs. **Corrected where credentials live**: auth profiles now come from each agent's `openclaw-agent.sqlite`, with the old `auth-profiles.json` requiring `doctor --fix` to import. The SecretRef section was expanded to current behavior: **the sentinel mechanism** (process-local sentinels along the model-call chain, unknown sentinels failing closed, the `OPENCLAW_SECRET_SENTINELS=off` kill switch), the runtime snapshot with cold-start and reload degradation semantics, active-surface filtering and `SECRETS_REF_IGNORED_INACTIVE_SURFACE`, the precedence of `gateway.auth.*` SecretRefs over environment variables, and the four official criteria for a completed migration. Added how Anthropic's Claude CLI reuse actually works (account match verified, then native subprocess auth, never a forwarded token), the `excluded_by_auth_order` and `no_model` probe results, and that Bedrock's `aws-sdk` route belongs in config metadata rather than the credential store. The "SecretRefs are not process isolation" boundary is stated per the upstream text.

## References

This article draws on the following official OpenClaw documentation:

- [Authentication](https://docs.openclaw.ai/gateway/authentication) — provider auth, Claude CLI reuse, status checks, key rotation
- [Secrets management](https://docs.openclaw.ai/gateway/secrets) — the SecretRef contract, sentinels, runtime snapshot, active-surface filtering
- [OAuth](https://docs.openclaw.ai/concepts/oauth) — OAuth flow and storage layout
- [Trusted Proxy Auth](https://docs.openclaw.ai/gateway/trusted-proxy-auth) — delegating auth to a reverse proxy
- [Auth Credential Semantics](https://docs.openclaw.ai/auth-credential-semantics) — credential eligibility and reason codes
