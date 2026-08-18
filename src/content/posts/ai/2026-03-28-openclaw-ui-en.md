---
title: "OpenClaw UI: A New Rail Lets You Ask What a Session Is Doing Without Interrupting It"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, control-ui, webchat, tui, pairing, session-observer]
lang: en
series:
  name: "Reading the OpenClaw Docs"
  order: 30
tldr: "The Control UI gained a session rail: it uses a utility model to produce a run digest and attaches a read-only companion thread, so you can ask what a session is doing without entering or interrupting the main agent run. Its contents never enter chat.history."
description: "The current state of OpenClaw's Control UI: the session rail and companion thread, the two gates of authentication and device pairing, recovering a lost gateway token, and why privilege upgrades are never a silent reconnect."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-ui)

The Control UI is a small **Vite + Lit** single-page app served by the Gateway at `http://<host>:18789/` by default, speaking **directly to the Gateway WebSocket on the same port**.

Two things are worth covering: **the new session rail**, and **the two gates you pass to get in.**

## The session rail: asking "how's it going" without interrupting

The most interesting addition since March.

While you watch a running session, the Gateway shows **the model's latest safe preamble immediately** as the session headline. When a utility model is available, it can **replace that headline with a richer compact status digest** once enough activity accumulates.

Chat carries the result in a **session rail**: a compact pill showing the live digest, and an expanded view showing **the assessment, plan progress, pull requests, elapsed time, and a read-only companion thread**.

Behavioral details: the rail **can expand once** when a run becomes stuck or needs input; done or failed runs keep a frozen "finished" time based on the final digest; on wide panes the expanded rail docks as a 400px right column, while narrower and mobile layouts get an overlay.

### The companion's boundaries are stated clearly

The companion answers questions about the selected session and its project **without entering or interrupting the main agent run.** Each part of this is worth reading:

- On the first question, the Gateway **lazily loads a bounded visible snapshot** of the selected session before starting the utility model
- If history is temporarily unavailable, **the question stays visible with Retry** rather than being treated as an empty session
- The companion has **read-only access** to the target session's history/search and agent workspace
- Its bounded thread is **held in Gateway memory**, restored when you switch sessions, and cleared by the rail's trash button, a session reset, Gateway restart, or idle expiry
- **It never enters `chat.history`**, and private reference context is not stored as operator dialogue

Type `/btw <question>` or `/side <question>` in the main composer to open the rail and ask there. Highlighting text in a message offers **More details** (ask the companion immediately) and **Ask in side chat** (open the rail with a quoted draft).

**Session observation is enabled by default.** Safe preamble headlines **do not require** a utility model; the utility model only owns richer assessments and terminal summaries. Turn it off or adjust it in **Settings → Appearance → Sidebar**, which also shows the resolved small model and its provenance; the config equivalents are `gateway.controlUi.sessionObserver: false` and `agents.defaults.utilityModel: ""`.

The problem this rail solves is universal: **a long-running agent leaves you unsure what it is doing, and the only way to look is to interrupt it.** Routing around that dilemma with a read-only companion is an interface design worth learning from.

## Two gates: authenticate, then pair

Getting into the Control UI means passing two gates, in a fixed order: **Gateway auth runs before device pairing.**

**Gate one: Gateway authentication**, supplied during the WebSocket handshake via `connect.params.auth.token`, `connect.params.auth.password`, Tailscale Serve identity headers (with `gateway.auth.allowTailscale: true`), or trusted-proxy identity headers.

**One rule to remember**: **a direct loopback connection does not bypass token or password auth.** The dashboard settings panel keeps a token for the current browser tab session and gateway URL; **passwords are not persisted.**

**Gate two: device pairing.** Connecting from a new browser or device usually requires a one-time approval, presenting as `disconnected (1008): pairing required`.

```bash
openclaw devices list
openclaw devices approve <requestId>
```

On the Gateway host, **`openclaw dashboard` is the preferred owner path**: it opens a **short-lived, single-use pairing link** and leaves that exact signed browser with a durable administrator credential. Opening a fresh link in the same browser also repairs a previously limited credential, and **another browser profile cannot inherit or replay the grant.**

## Recovering a lost token

An easy situation to land in, and one you will get stuck on without having read the docs:

**If the Gateway starts in token mode without a configured token, it generates an ephemeral runtime token for that process. That token is not written to config, so it cannot be recovered** — and a loopback browser without it is rejected.

Recovery:

```bash
openclaw doctor --generate-gateway-token
# restart the Gateway
openclaw gateway auth-token --show   # in an interactive terminal
# paste the output into Control UI settings
```

## Privilege upgrades are never silent

This design deserves highlighting:

> Switching an **already-paired** browser from read access to write/admin access through ordinary stored or shared credentials is treated as **an approval upgrade, not a silent reconnect**: OpenClaw **keeps the old approval active, blocks the broader reconnect, and asks you to approve the new scope set explicitly.**

The narrow exception is a **fresh owner handoff issued on the Gateway host** by `openclaw dashboard` or graphical onboarding — and it **can upgrade only the same signed browser that redeems that one-time handoff.**

When a connected Control UI reports limited access, click **Request admin** in the access banner; the banner can also collapse into a persistent **Limited access** chip.

"Escalation requires re-approval" is a basic principle that many systems quietly compromise for the sake of UX. This one picked the other side.

## Other interfaces

**WebChat** has no separate HTTP port — the SwiftUI chat UI connects directly to the Gateway WebSocket, going through the same SSH or Tailscale tunnel as other clients in remote setups.

**The TUI** is the terminal interface, and the **canvas host** is served by the Gateway's HTTP server on the same port (`/__openclaw__/canvas/` for agent-editable HTML/CSS/JS and `/__openclaw__/a2ui/` for the A2UI host).

## One Windows-specific gotcha

**On native Windows LAN binds, Windows Firewall or organization-managed Group Policy can block the advertised LAN URL even when `127.0.0.1` works on the Gateway host.**

Run `openclaw gateway status --deep` on the Windows host; it reports likely-blocked ports, profile mismatches, and **local firewall rules that policy may ignore.**

## The big picture

The standout in this round is the session rail — it turns "observe a running agent" from "interrupt it" into "ask the read-only companion next to it," with an explicit guarantee that those exchanges never pollute the main conversation's history.

For getting in, remember two things: **authentication and pairing are separate gates and loopback is not exempt from auth**, and **escalation always requires explicit re-approval.**

## Changelog

- 2026-08-18: Substantially revised against the current official docs. Added: **the session rail and read-only companion thread** (immediate safe-preamble headlines, utility-model digests, `/btw` and `/side` entry points, More details and Ask in side chat from highlighted text, read-only access, Gateway-memory storage with its clearing triggers, never entering `chat.history`, and how to disable via `gateway.controlUi.sessionObserver` and `utilityModel`), **authentication and device pairing as separate gates with loopback not exempt**, `openclaw dashboard`'s short-lived single-use pairing link that cannot be replayed across browsers, **the full recovery path for a lost gateway token** (the ephemeral runtime token being unrecoverable), **privilege upgrades treated as approval upgrades rather than silent reconnects** with the narrow owner-handoff exception, the canvas host paths, and diagnosing blocked Windows LAN binds with `gateway status --deep`.

## References

This article draws on the following official OpenClaw documentation:

- [Control UI](https://docs.openclaw.ai/web/control-ui) — the session rail, auth, pairing, access upgrades
- [WebChat](https://docs.openclaw.ai/web/webchat), [TUI](https://docs.openclaw.ai/web/tui) — the other interfaces
- [Gateway architecture](https://docs.openclaw.ai/concepts/architecture) — the canvas host and protocol
- [Node pairing](https://docs.openclaw.ai/gateway/pairing) — the pairing lifecycle
- [Windows](https://docs.openclaw.ai/platforms/windows) — firewall troubleshooting for LAN binds
