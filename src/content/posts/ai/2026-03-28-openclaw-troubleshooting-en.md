---
title: "OpenClaw Operations: Seven Commands for the First 60 Seconds, and 'It Feels Dumber' Is Usually Not the Model"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, troubleshooting, doctor, diagnostics, tool-profile, install-policy]
lang: en
series:
  name: "Reading the OpenClaw Docs"
  order: 31
tldr: "The official triage flow is seven commands and two minutes to a diagnosis. And the most common symptom — the assistant feeling limited or missing tools — is usually the tool profile: minimal allows only session_status, while coding is the default for new local configs."
description: "OpenClaw's troubleshooting runbook: the first-60-seconds command ladder and what each line should show, capability gaps caused by tool profiles, compatibility flags for local OpenAI-compatible backends, and recovering from install-policy fail-closed and file-ownership blocks."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-troubleshooting)

This is the article in the series most worth bookmarking — not because it is interesting, but because you will need it at 2 AM.

## The first 60 seconds: run these in order

The docs call it the "triage front door: 2 minutes to a diagnosis, then jump to the deep page."

```bash
openclaw status
openclaw status --all
openclaw gateway probe
openclaw gateway status
openclaw doctor
openclaw channels status --probe
openclaw logs --follow
```

What each should show:

| Command | Good output |
|---|---|
| `openclaw status` | Configured channels, no auth errors |
| `openclaw status --all` | A full, shareable report |
| `openclaw gateway probe` | `Reachable: yes`. `Capability: ...` is the auth level the probe **proved** |
| `openclaw gateway status` | `Runtime: running`, `Connectivity probe: ok`, a plausible `Capability`. Add `--require-rpc` to also require read-scope RPC proof |
| `openclaw doctor` | No blocking config or service errors |
| `openclaw channels status --probe` | Live per-account transport state when the gateway is reachable; config-only summaries when it is not |
| `openclaw logs --follow` | Steady activity, no repeating fatal errors |

One reading is worth flagging: **`Read probe: limited - missing scope: operator.read` is degraded diagnostics, not a connect failure.** Seeing it is no reason to start suspecting the network.

## The most common symptom: it feels dumber

> **Assistant feels limited or missing tools**

Easily misdiagnosed as "the model is bad," but the docs give it the first dedicated section and the answer is usually **the tool profile**:

| Profile | Scope |
|---|---|
| `minimal` | **Allows only `session_status`** |
| `messaging` | Narrow, for chat-only agents |
| `coding` | **The default for new local configs** (repo, file, shell, runtime work) |
| `full` | Removes profile restrictions; **limit to trusted operator-controlled agents** |

And **per-agent `agents.entries.*.tools` overrides narrow or expand the root profile** — so "the other agent on the same Gateway can do it" does not mean your config is fine.

Diagnose with `openclaw status` / `--all` / `doctor`, then after changing the profile, **restart or reload the Gateway and recheck with `openclaw status --all`.**

## Local OpenAI-compatible backend: works directly, fails through OpenClaw

A concrete escalation worth memorizing. The symptom: your self-hosted `/v1` backend answers direct `/v1/chat/completions` probes but fails on `openclaw infer model run` or normal agent turns.

In order:

1. The error mentions **`messages[].content` expecting a string** → set `models.providers.<id>.models[].compat.requiresStringContent: true`
2. **Still fails only on OpenClaw agent turns** → set `models.providers.<id>.models[].compat.supportsTools: false` and retry
3. **Tiny direct calls work but larger OpenClaw prompts crash the backend** → **that is an upstream model/server limit, not an OpenClaw bug**

The wording on the third step is refreshingly honest. Documentation willing to say "this is not our problem" instead of hedging actually helps the person debugging — **it stops you looking in the wrong place.**

## Three ways plugins get stuck

### 1. `package.json missing openclaw.extensions`

The plugin package uses a shape OpenClaw no longer accepts. Fix it in the plugin: add `openclaw.extensions` pointing at built runtime files (usually `./dist/index.js`), republish, and reinstall.

### 2. Install policy failing closed

The symptom: an update finishes but plugins are stale, disabled, or show `blocked by install policy`, `install policy failed closed`, or `Disabled "<plugin>" after plugin update failure`.

The cause is usually `security.installPolicy` rules written too rigidly. The docs list policy shapes **to avoid**:

- **Freezing OpenClaw-owned plugins to one exact old version** (allowing only `@openclaw/*@2026.5.3`, say)
- **Blocking by source kind alone** (every npm, network, or `request.mode: "update"` request)
- **Treating the policy command as optional** — with `security.installPolicy` enabled, **a missing, slow, unreadable, or permission-blocked policy executable fails closed**
- Approving versions **without checking the request's `openclawVersion`** against plugin candidate metadata

The reason behind it: **`@openclaw/*` plugin versions normally move with the OpenClaw release**, so an OpenClaw update can require a matching plugin update during post-update sync.

Recovery:

```bash
openclaw doctor --deep
openclaw plugins update --all
openclaw status --all
```

If the policy is intentionally strict, relax it for the trusted upgrade window, rerun the update, then restore it. If an update failure disabled a plugin, **inspect before re-enabling**:

```bash
openclaw plugins inspect <plugin-id> --runtime --json
openclaw plugins enable <plugin-id>
```

### 3. Suspicious file ownership

```text
blocked plugin candidate: suspicious ownership (... uid=1000, expected uid=0 or root)
plugin present but blocked
```

The plugin files are owned by a different Unix user than the loading process. **Do not remove the plugin config** — fix the ownership, or run OpenClaw as the user that owns the state directory.

Docker installs run as `node` (uid 1000), so repair the host bind mounts:

```bash
sudo chown -R 1000:1000 /path/to/openclaw-config /path/to/openclaw-workspace
openclaw doctor --fix
```

If you intentionally run as root, repair the managed plugin root instead:

```bash
sudo chown -R root:root /path/to/openclaw-config/npm
openclaw doctor --fix
```

## One specific model-side error

`HTTP 429: rate_limit_error: Extra usage is required for long context requests` — this is Anthropic requiring an extra-usage plan for long-context requests, with its own dedicated section upstream. It is not an ordinary rate limit, and changing your retry strategy will not help.

## The big picture

How this runbook is organized is itself worth learning from: **symptom first, not component first.** At 2 AM what you know is "it stopped answering," not "the Gateway's channel module has a problem."

The most useful entry is the tool-profile section — **when an agent "feels dumber," check what tools it is allowed to use before suspecting the model.** That lesson holds in any agent system.

## Changelog

- 2026-08-18: Substantially revised against the current official docs. Added: **the seven-command first-60-seconds ladder** with what each line should show (including `Read probe: limited` being degraded diagnostics rather than a connect failure, and `gateway status --require-rpc`), **the tool-profile diagnosis for "it feels dumber"** (`minimal` allowing only `session_status`, `coding` as the new local default, per-agent overrides changing the result), **the three-step compatibility escalation for local OpenAI-compatible backends** (with the third step explicitly identified as an upstream limit), **the three plugin failure modes** (missing `openclaw.extensions`, the four `security.installPolicy` shapes to avoid plus recovery steps, and ownership-blocked plugins with Docker and root fixes), and the Anthropic long-context 429.

## References

This article draws on the following official OpenClaw documentation:

- [General troubleshooting](https://docs.openclaw.ai/help/troubleshooting) — the symptom-first triage front door
- [Gateway troubleshooting](https://docs.openclaw.ai/gateway/troubleshooting) — deeper Gateway and model runbooks
- [Tool profiles](https://docs.openclaw.ai/gateway/config-tools) — the full profile and group table
- [Plugins](https://docs.openclaw.ai/tools/plugin) — install policy and ownership issues
- [Channel troubleshooting](https://docs.openclaw.ai/channels/troubleshooting) — per-channel diagnosis
