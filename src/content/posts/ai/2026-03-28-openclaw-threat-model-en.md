---
title: "OpenClaw's Threat Model: It Starts by Telling You What It Does Not Protect"
date: 2026-03-28
type: deep-dive
category: ai
tags: [openclaw, security, threat-model, prompt-injection, mitre-atlas, formal-verification]
lang: en
series:
  name: "Reading the OpenClaw Docs"
  order: 18
tldr: "OpenClaw's security docs open by stating the scope: this is a personal-assistant trust model, one gateway per trusted operator. It explicitly is not a security boundary for mutually adversarial users sharing one agent — and a 'not vulnerabilities by design' list pins that down."
description: "OpenClaw's threat model: the scope and limits of the personal-assistant trust model, the security audit's check categories and triage order, common misreads in the trust boundary matrix, and the list of things that are not vulnerabilities by design."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-threat-model)

Most security documentation tells you what it defends. OpenClaw's security page gives the most prominent position to the opposite — **what it explicitly does not protect**. That choice is worth reading on its own.

## Scope: the personal-assistant trust model

At the top of the page is a boxed statement:

> **Personal assistant trust model.** This guidance assumes one trusted operator boundary per gateway (single-user, personal-assistant model). OpenClaw **is not** a hostile multi-tenant security boundary for multiple adversarial users sharing one agent or gateway.

The lines that follow are concrete:

- **Supported**: one user/trust boundary per gateway (prefer one OS user, host, or VPS per boundary)
- **Not supported**: one shared gateway/agent used by mutually untrusted users
- **Adversarial-user isolation needs separate gateways**, ideally separate OS users or hosts
- If several untrusted users can message one tool-enabled agent, **they share that agent's delegated tool authority**
- **If someone can modify Gateway host state or config (`~/.openclaw`, including `openclaw.json`), treat them as a trusted operator**
- Inside one Gateway, authenticated operator access is **a trusted control-plane role, not a per-user tenant role**
- **`sessionKey` (session IDs and labels) is a routing selector, not an authorization token**

For hosting multiple users or organizations, the official answer is **one isolated Gateway cell per tenant**, not a shared Gateway.

This is a mature posture: rather than claiming a single-user system can survive multi-tenancy, draw the boundary clearly so operators know where they stand.

## `openclaw security audit`

Run it after any config change, and before exposing network surfaces:

```bash
openclaw security audit
openclaw security audit --deep    # attempts a live Gateway probe
openclaw security audit --fix     # apply safe remediations
openclaw security audit --json
```

`--fix` is **deliberately narrow**: it flips open group policies to allowlists and tightens state/config/include-file permissions (`600` files, `700` dirs), using ACL resets instead of POSIX `chmod` on Windows. It will not make judgment calls for you.

The audit covers **inbound access** (can strangers trigger the bot), **tool blast radius** (could prompt injection become shell/file/network actions), **exec filesystem and approval drift**, **network exposure** (bind/auth, Tailscale Serve/Funnel, weak tokens), **browser control exposure**, **local disk hygiene**, **plugins loading without an allowlist**, plus **policy drift** and **runtime expectation drift**.

Every finding carries a structured `checkId` (e.g. `gateway.bind_no_auth`, `tools.exec.security_full_configured`), with prefixes that let you filter by surface: `fs.*`, `gateway.*`, `hooks.*`/`browser.*`/`sandbox.*`/`tools.exec.*`, `plugins.*`/`skills.*`, `security.exposure.*`.

One annotation stands out: **`security="full"` on its own is a broad posture warning, not proof of a bug** — it is the chosen default for trusted personal-assistant setups, to be tightened only when your threat model needs approval or allowlist guardrails. Documentation willing to say that is more useful than documentation that flags everything red.

### Triage order

When the audit returns a pile of findings, the docs give an explicit order:

1. **Anything "open" plus tools enabled** — lock down DMs and groups first (pairing/allowlists), then tighten tool policy and sandboxing
2. **Public network exposure** (LAN bind, Funnel, missing auth) — fix immediately
3. **Browser control remote exposure** — treat it like operator access: tailnet-only, deliberate node pairing, never public
4. **Permissions** — state/config/credentials/auth must not be group- or world-readable
5. **Plugins** — load only what you explicitly trust
6. **Model choice** — prefer modern, instruction-hardened models for any bot with tools

The logic is blast radius first rather than severity score first: an agent that strangers can trigger and that holds tools is far more dangerous than an inelegant setting nobody can reach.

## A hardened baseline in 60 seconds

```json5
{
  gateway: {
    mode: "local",
    bind: "loopback",
    auth: { mode: "token", token: "replace-with-long-random-token" },
  },
  session: { dmScope: "per-channel-peer" },
  tools: {
    profile: "messaging",
    deny: ["group:automation", "group:runtime", "group:fs", "sessions_spawn", "sessions_send"],
    fs: { workspaceOnly: true },
    exec: { security: "deny", ask: "always" },
    elevated: { enabled: false },
  },
  channels: {
    whatsapp: { dmPolicy: "pairing", groups: { "*": { requireMention: true } } },
  },
}
```

Keep the Gateway local-only, isolate DMs, and disable control-plane and runtime tools by default, then re-enable selectively per trusted agent.

There is also a baseline hardcoded into the product: **for chat-driven agent turns, non-owner senders cannot use the `cron` or `gateway` tools regardless of config.**

## Requester-scoped controls do not sanitize the prompt

This is the most honest — and most easily misread — passage in the whole page:

`tools.toolsBySender`, sender ownership, and owner-only tool inventories are evaluated against **the current turn's originating requester**. They **do not authenticate or sanitize other content in that prompt**, including quoted text, prior shared-room history, forwarded content, fetched content, attachments, or tool results.

Which means: **content from another person can influence an owner-triggered turn** whenever it lands in that turn's context.

The guidance is to treat these controls as **defense in depth that reduces a requester's direct capability, not as hostile multi-user isolation** — filter context with `contextVisibility`, restrict tools, sandbox the agent, and use separate gateways and OS users when participants are mutually adversarial.

## The trust boundary matrix: common misreads

There is a table dedicated to settling "is this a vulnerability" arguments. A representative selection:

| Boundary or control | What it is | Common misread |
|---|---|---|
| `gateway.auth` | Authenticates callers to gateway APIs | "It needs per-message signatures on every frame to be secure" |
| `sessionKey` | A routing key for context/session selection | "Session key is a user auth boundary" |
| Prompt/content guardrails | Reduce model abuse risk | "Prompt injection alone proves auth bypass" |
| `canvas.eval` / browser evaluate | An intentional operator capability when enabled | "Any JS eval primitive is automatically a vuln" |
| Local TUI `!` shell | Explicit operator-triggered local execution | "A local shell convenience command is remote injection" |
| Node pairing and node commands | Operator-level remote execution on paired devices | "Remote device control should be untrusted by default" |

## "Not vulnerabilities by design"

Finally there is a list of report classes that will not be treated as vulnerabilities:

- **Prompt-injection-only chains** with no policy, auth, or sandbox bypass
- Claims that assume **hostile multi-tenant operation** on one shared host or config
- Normal operator read paths (`sessions.list`, `sessions.preview`, `chat.history`) classified as IDOR in a shared-gateway setup
- **Localhost-only deployment findings** (for example missing HSTS on a loopback-only gateway)
- Signature findings for inbound paths that do not exist in this repo

The value of that list is not just noise reduction — it is **the trust model written in falsifiable form**. A system that cannot state what does not count as a vulnerability usually has not worked out where its boundaries are.

## The big picture

The most instructive thing about OpenClaw's threat model is not what it defends but that it **narrows its scope to something defensible**, then states the boundary concretely enough that operators can judge whether they need another layer.

In practice that becomes two habits: **run `openclaw security audit` after config changes**, and **when your users do not trust each other, do not try to solve it in configuration — split the gateway.**

## Changelog

- 2026-08-18: Substantially revised against the current official docs. **Reframed around the personal-assistant trust model** — the security page now opens by declaring one gateway per trusted operator boundary, explicitly rules out hostile multi-tenancy, and points multi-tenant deployments at one isolated cell per tenant. Added: the four forms of `openclaw security audit` and the deliberately narrow scope of `--fix`, the audit's coverage areas and `checkId` prefixes, the note that `security="full"` is a posture warning rather than a bug, the triage priority order, the 60-second hardened baseline, the built-in rule that non-owners cannot use `cron`/`gateway` tools, **the statement that requester-scoped controls do not sanitize prompt context**, the trust boundary matrix of common misreads, and the "not vulnerabilities by design" list.

## References

This article draws on the following official OpenClaw documentation:

- [Security](https://docs.openclaw.ai/gateway/security) — trust model scope, audit, triage order, boundary matrix, non-vulnerability list
- [Security audit checks](https://docs.openclaw.ai/gateway/security/audit-checks) — the full catalog with severity
- [Gateway exposure runbook](https://docs.openclaw.ai/gateway/security/exposure-runbook) — pre-flight before changing remote access
- [Multi-tenant hosting](https://docs.openclaw.ai/gateway/multi-tenant-hosting) — one cell per tenant
- [Formal Verification](https://docs.openclaw.ai/security/formal-verification) — formally verified security properties
