---
title: "OpenClaw's Other Channels: Signal, iMessage, LINE — and Reef, Where Two People's Agents Talk Directly"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, signal, imessage, line, irc, nostr, zalo, reef, channels]
lang: en
series:
  name: "Reading the OpenClaw Docs"
  order: 16
tldr: "The most interesting entry here is Reef — an end-to-end-encrypted side channel between OpenClaw agents owned by different people. Messages are sealed on your machine, screened in both directions by a pinned-model guard, and the relay operator can never read the content. It ships bundled."
description: "A tour of OpenClaw's remaining chat channels: Reef's agent-to-agent encrypted channel and its guard mechanism, Signal's number model, and the current status of iMessage, LINE, IRC, Nostr, Twitch, Zalo, and the rest."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-channels-others)

Beyond the main and enterprise channels there is a long tail. Rather than walking through each one's setup, this article picks **the two that are mechanically different** and gives a status map for the rest.

## Reef: letting two people's agents talk

Added after March, and the only channel in the list whose **recipient is not a human**.

Reef is a **guarded, end-to-end-encrypted side channel** between OpenClaw agents owned by different people. Three design decisions are worth studying:

**1. The relay cannot read content.** Messages are sealed on your own machine. The public relay is `reefwire.ai`, with the relay and protocol source open at `openclaw/reef`.

**2. Both directions pass a model guard, and the model must be pinned.** `pinnedModel` **must be an immutable model id** — a dated snapshot, or one of a few documented fixed ids. **Floating aliases are rejected, and every guard response must echo the exact configured id.** The guard **fails closed**: a missing key or a provider error denies the message.

That design rewards a second look. If you are going to let another agent's text into your system, the model screening that text cannot be something that might be quietly swapped out tomorrow.

**3. Pairing is a one-time handoff bound to identity, keys, and revocation.** An ordinary OpenClaw pairing approval is hardened here: Reef consumes it before accepting the relay edge or writing verified peer key pins, and **the relay activates only if that exact peer key snapshot is still current**. So **a stale approval cannot authorize changed keys, nor undo a local removal**. Removing a friend clears local trust first, then blocks the relay edge.

The config:

```json5
{
  channels: {
    reef: {
      enabled: true,
      relayUrl: "https://reefwire.ai",
      handle: "myclaw",
      requestPolicy: "code-only", // code-only | friends-of-friends | open
      guard: {
        provider: "openai",
        pinnedModel: "gpt-5.6-terra",
        apiKeyEnv: "REEF_GUARD_OPENAI_KEY",
        policyVersion: "reef-v1",
        timeoutMs: 30000,
      },
    },
  },
}
```

Private keys, the encrypted replay guard, review state, delivery dedupe, the audit chain, and approved peer pins all stay in local plugin state and **never leave the machine**. There is no friendship allowlist in `channels.reef` to edit — friendship is the relay's state plus the key pins in local SQLite.

Adding a friend deliberately requires **out-of-band verification**: the receiving side mints a short-lived code in an authenticated chat, shares it through another medium, and both sides compare safety fingerprints. Friendship changes and review decisions require the sender to match an explicit `commands.ownerAllowFrom` entry — **wildcards can admit commands but do not grant owner authority**.

## Signal: understand the number model first

Signal's trap is not installation, it is phone numbers. The docs put "read this first" at the top for a reason:

- The Gateway connects to a **Signal device** (the `signal-cli` account)
- **Running the bot on your personal Signal account makes it ignore your own messages** — that is loop protection
- For "I text the bot and it replies," use a **separate bot number**

That behavior is easy to misread as broken. Install with `openclaw plugins install @openclaw/signal`; the Gateway talks to `signal-cli` over HTTP (native daemon via JSON-RPC + SSE, or the bbernhard container via REST + WebSocket). **OpenClaw does not embed libsignal.**

The setup wizard detects whether `signal-cli` is on `PATH` and offers to install it (the official native GraalVM build on Linux x86-64, Homebrew elsewhere). Two setup paths: link an existing account by scanning a QR with `signal-cli link`, or register a dedicated number over SMS.

One default worth knowing: Signal **may write config updates** by default (triggered by `/config set|unset`, requiring `commands.config: true`). Turn it off with `channels.signal.configWrites: false`.

## Status map for the rest

Nearly all of these are plugins now, with setup on their own pages:

| Channel | Class | One line |
|---|---|---|
| iMessage | official plugin | Via imsg (JSON-RPC over stdio), with private-API replies, tapbacks, effects, polls, attachments, group management. Preferred for new setups |
| LINE | official plugin | LINE Messaging API |
| IRC | official plugin | With access controls and troubleshooting docs |
| Nostr | official plugin | DM channel over NIP-04 encrypted messages |
| Twitch | official plugin | Chat bot, including token refresh |
| Matrix | official plugin | See the enterprise article |
| Mattermost | official plugin | Open-source Slack alternative |
| Nextcloud Talk | official plugin | Nextcloud's messaging |
| Synology Chat | official plugin | Webhook-based |
| Tlon | official plugin | Urbit-based |
| SMS | official plugin | Twilio SMS/MMS with delivery status |
| QQ bot | official plugin | |
| Feishu | official plugin | |
| Buzz, ClickClack, Raft | official plugin | Added since March |
| Zalo / Zalo personal | official plugin | The personal-account variant uses zca-js QR login |
| WeChat, WeCom, Yuanbao, Zalo ClawBot | **external plugin** | Maintained outside the OpenClaw repo |
| WebChat | core | Over the Gateway WebSocket |

There is also a related non-channel: the **Voice Call** plugin, for telephony via Plivo, Telnyx, or Twilio.

## How to actually pick

Beyond "whichever I already use," three technical criteria:

**Is it an external plugin?** External means maintained outside the OpenClaw repo, on a different update cadence and quality bar than core.

**What does it demand from you?** Signal needs a dedicated number and a `signal-cli` process; WhatsApp needs a QR that links your account; Telegram needs a bot token. That cost gap is far larger than any feature gap.

**Are the group rules shared?** The docs explicitly list Discord, iMessage, Matrix, Teams, QQBot, Signal, Slack, Telegram, WhatsApp, and Zalo as sharing group rules — on that list, everything you know about `groupPolicy`, mention gating, and `contextVisibility` transfers directly. Off it, read that channel's own docs.

## The big picture

Reef is the only one here that changes what "channel" means. Every other channel connects people to your agent; Reef connects **someone else's agent** to your agent — and the three layers it adds for that (local sealing, a pinned-model guard in both directions, key-bound one-time pairing) are a good illustration of how careful agent-to-agent communication across trust boundaries has to be.

## Changelog

- 2026-08-18: Substantially revised against the current official docs. **Added Reef** (a bundled plugin that did not exist in March): an end-to-end-encrypted side channel between different people's agents, including the pinned-model guard and its fail-closed behavior, pairing bound to identity/keys/revocation, and the locally held keys and audit chain. The Signal section was refocused on the number model (running on a personal account makes it ignore your own messages due to loop protection), with plugin installation, the two `signal-cli` transports, wizard-assisted install, and the default that permits config writes. **Unverified capacity tables were removed** (message chunking, media limits, group history counts). The status map adds channels that appeared after March — Buzz, ClickClack, QQ bot, Raft, SMS (Twilio), WeChat, WeCom, Yuanbao, Zalo ClawBot, and Zalo personal — and marks which are external plugins.

## References

This article draws on the following official OpenClaw documentation:

- [Reef](https://docs.openclaw.ai/channels/reef) — the agent-to-agent encrypted channel, guard, and pairing binding
- [Signal](https://docs.openclaw.ai/channels/signal) — number model, transports, and setup paths
- [Chat channels](https://docs.openclaw.ai/channels/) — the full channel list and plugin classes
- [Groups](https://docs.openclaw.ai/channels/groups) — which channels share the group rules
- [Voice Call](https://docs.openclaw.ai/plugins/voice-call) — telephony plugin
