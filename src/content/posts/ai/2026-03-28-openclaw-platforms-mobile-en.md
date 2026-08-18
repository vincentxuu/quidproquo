---
title: "OpenClaw Mobile Platforms: Phones Are Peripherals, Not Gateways — and the Apple Watch Has Its Own Transport"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, ios, android, watchos, nodes, mobile, pairing]
lang: en
series:
  name: "Reading the OpenClaw Docs"
  order: 5
tldr: "The iOS and Android apps are nodes, not Gateways: they do not run the Gateway service, and Telegram or WhatsApp messages land on the Gateway rather than on the phone. The Apple Watch is the exception — because watchOS blocks generic low-level networking for ordinary apps, it uses signed HTTPS polling instead."
description: "Mobile device support in OpenClaw: what a node is, the pairing lifecycle and its timeouts, the three-tier approval scopes for capabilities, watchOS's dedicated transport, and operating from a phone via the Telegram Dashboard Mini App."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-platforms-mobile)

Mobile devices have exactly one role in OpenClaw: **node (peripheral)**.

## A phone is not a Gateway

The mental model to establish first:

> Nodes are **peripherals, not gateways**: they don't run the gateway service, and **channel messages (Telegram, WhatsApp, etc.) land on the gateway, not on nodes.**

In other words, the app on your phone never connects to Telegram itself. It connects to **your Gateway**, and lends the agent the capabilities only a phone has — camera, screen, location, notifications, Canvas.

A node is a companion device (macOS/iOS/watchOS/Android/headless) connecting to the Gateway with `role: "node"` and exposing a command surface through `node.invoke`: `canvas.*`, `camera.*`, `device.*`, `notifications.*`, `system.*`.

## Why watchOS is different

Most nodes use the **Gateway WebSocket on the operator port**. One exception exists, for a very concrete technical reason:

> The optional direct Apple Watch node uses **signed HTTPS polling on that same port** because **watchOS blocks generic low-level networking for ordinary apps.**

A clean example of a platform constraint dictating architecture — nobody preferred polling; the WebSocket path simply is not open to ordinary apps on watchOS.

The watch also takes a different approval path: **an admin-minted, short-lived node-only setup code** approves its **fixed low-risk command surface**, while **later capability expansion still requires normal approval.**

And an upgrade-order note: **the direct watchOS HTTPS transport requires the current protocol version** — update the watch app together with the Gateway before enabling direct mode.

## Pairing: two independent stores

The most confusable part of nodes, worth spelling out. **There are two pairing records governing different things:**

**Device pairing** — the node presents a signed device identity on connect, and the Gateway creates a device pairing request for `role: node`. **This governs transport authentication.**

```bash
openclaw devices list
openclaw devices approve <requestId>
openclaw nodes status
```

**The node pairing store** (`openclaw nodes pending/approve/reject/remove/rename`) is **a separate, gateway-owned store** tracking the node's approved command and capability surface across reconnects. The docs are explicit: **it does not gate transport authentication — device pairing does that.**

There is also a safety guarantee: **the device pairing record is the durable approved-role contract. Token rotation stays inside that contract; it cannot upgrade a paired node into a role that pairing approval never granted.**

### Pending request behavior

**Pending pairing requests expire 5 minutes after the device's last retry** — with a thoughtful touch: **a device that keeps reconnecting keeps its one pending request (and `requestId`) alive** instead of minting a new prompt every few minutes.

Conversely, if a node retries with **changed auth details (role, scopes, public key)**, **the prior pending request is superseded and a new `requestId` is created**, with clients receiving a `device.pair.resolved` event — so **re-run `openclaw devices list` before approving.**

## Approval scopes come in three tiers

A design worth studying: **the scope required to approve follows the commands the pending request declares.**

| What the request declares | Required scopes |
|---|---|
| No commands | `operator.pairing` |
| Non-exec node commands | `operator.pairing` + `operator.write` |
| `system.run` / `system.run.prepare` / `system.which` | `operator.pairing` + **`operator.admin`** |

Meaning **approving a phone that only wants the camera and approving a device that can run shell commands on your machine require different authority.** Far safer than a one-size-fits-all "pairing is pairing."

Removal has matching granularity: `openclaw nodes remove --node <id|name|ip>` on a device-backed node **revokes that device's `node` role in the paired-device store and disconnects its node-role sessions** — **a mixed-role device keeps its row and only loses the `node` role, while a node-only device row is deleted.** It also clears the matching entry from the node pairing store.

## Two ways to actually operate from a phone

**1. The mobile app as a node**: the phone supplies camera, location, notifications, and Canvas while the Gateway stays in the cloud or on a home machine. The cloud deployment article covered this combination — **state centralized, senses local.**

**2. The Telegram Dashboard Mini App**: type `/dashboard` in a DM with the bot to open the full Control UI as a Telegram WebApp. It requires `gateway.tailscale.mode` set to `serve` or `funnel`, and your numeric Telegram user ID in the effective `allowFrom` or `commands.ownerAllowFrom` — **wildcards and usernames do not count.**

The second path installs nothing; the cost is configuring Tailscale publishing first.

## Version skew: upgrade the Gateway first

Staged fleet upgrades have a prescribed order:

> **Upgrade the Gateway first, then upgrade each node.**

The Gateway WebSocket accepts authenticated node clients across an **N-1 protocol window** — the current v4 Gateway accepts v3 nodes when the connection declares both `role: "node"` and `client.mode: "node"`. **Operator and UI sessions must still use the current protocol.**

An N-1 node **remains visible and manageable** while being upgraded, with the Gateway logging `legacy node protocol accepted` plus an upgrade recommendation. Pairing, device authentication, command allowlists, and exec approvals **all still apply**, but **plugin-owned capabilities and commands stay hidden until the node upgrades.** Nodes older than N-1 need an out-of-band upgrade before reconnecting.

## The big picture

The mobile layer compresses to one line: **the phone lends capabilities, the Gateway keeps authority.**

The most instructive part is **the three-tier approval scoping** — it acknowledges that "pair a device" is not a single decision but depends on what that device is asking for. A phone reporting location and a machine wanting `system.run` were never the same threshold.

## Changelog

- 2026-08-18: Substantially revised against the current official docs. Added: **nodes as peripherals rather than gateways** (channel messages land on the Gateway), **watchOS's signed HTTPS polling transport** and the reason for it, the watch's short-lived node-only setup code and upgrade-order requirement, **device pairing and node pairing as two independent stores** (transport auth versus capability surface, with token rotation unable to upgrade a role), **the 5-minute pending expiry with keep-alive on retry** and supersession on changed auth details, **the three-tier approval scoping**, the differing removal behavior for mixed-role versus node-only devices, the Telegram Dashboard Mini App as an install-free phone path, and **the N-1 protocol window with the "Gateway first" upgrade order**.

## References

This article draws on the following official OpenClaw documentation:

- [Nodes](https://docs.openclaw.ai/nodes/) — pairing, capabilities, approval scopes, version skew
- [Node pairing](https://docs.openclaw.ai/gateway/pairing) — the full request/approve lifecycle
- [iOS](https://docs.openclaw.ai/platforms/ios), [Android](https://docs.openclaw.ai/platforms/android) — the platform apps
- [Telegram](https://docs.openclaw.ai/channels/telegram) — Dashboard Mini App prerequisites
- [Nodes troubleshooting](https://docs.openclaw.ai/nodes/troubleshooting) — the runbook
