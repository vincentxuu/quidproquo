---
title: "OpenClaw Channels Overview: 31 Channels, Nearly All Plugins — and Why 'Who Can Trigger' Is Not 'What the Model Sees'"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, channels, pairing, group-policy, routing, access-control]
lang: en
series:
  name: "Reading the OpenClaw Docs"
  order: 13
tldr: "OpenClaw supports 31 chat channels, but only WebChat lives in core — even Slack and WhatsApp are plugins you install. And group safety has two independent axes: allowlists govern who can trigger the agent, not which quotes and history the model sees. That second one is contextVisibility, and it defaults to wide open."
description: "An overview of OpenClaw's channel system: the plugin-based install model, DM and group policies, mention gating, the split between trigger authorization and context visibility, visibleReplies, and ambient room events."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-channels-overview)

OpenClaw can reach you on the chat apps you already use, each connecting through the Gateway. This article covers **the rules every channel shares**; the next three cover individual channels.

## Start with the install model: nearly everything is a plugin

This is the biggest change since March, and it should reset your deployment expectations. The docs now sort channels into four classes:

| Class | Meaning | Examples |
|---|---|---|
| Included in core | Nothing to install | WebChat |
| Bundled plugin | Ships with the core install | Telegram, Reef |
| Official plugin | One command, or installed on demand during onboarding / `channels add` | Slack, Discord, WhatsApp, Signal, iMessage, Teams… |
| External plugin | Maintained outside the OpenClaw repo | WeChat, WeCom, Yuanbao, Zalo ClawBot |

```bash
openclaw plugins install @openclaw/<channel>
```

**Installing requires a Gateway restart.** One more practical difference: WhatsApp is install-on-demand — onboarding can show the setup flow before the plugin package exists, and the Gateway only loads that external plugin once the channel is actually active.

So "31 supported channels" really means: core provides the channel **framework**, not 31 built-in implementations.

## DM policy

| Policy | Behavior |
|---|---|
| `pairing` (default on most channels) | Unknown senders need a pairing code plus approval |
| `allowlist` | Only senders in `allowFrom` |
| `open` | Anyone (requires an explicit `allowFrom: ["*"]`) |
| `disabled` | DMs off |

Two practical limits are worth remembering: **pairing requests expire after 1 hour, and pending requests are capped at 3 per account.** Approve from the Control UI under **Settings → Channels → DM access requests**, or from the CLI:

```bash
openclaw pairing list whatsapp
openclaw pairing approve whatsapp <CODE>
```

Keep these separate in your head: logging the channel in (WhatsApp's QR, for instance) links the account, and has nothing to do with approving whether a given person may talk to your agent.

## Groups are closed by default

The decision order for an inbound group message is spelled out clearly upstream:

```text
groupPolicy? disabled        -> drop
groupPolicy? allowlist       -> is this group allowed? no -> drop
requireMention? yes          -> was it mentioned? no -> store as context only
mention / reply / command / DM -> treat as a user request
always-on group chatter      -> user request, or a room event when configured
```

The defaults are **conservative**: `groupPolicy: "allowlist"` (group senders are blocked until allowlisted) and replies require a mention.

There is a mental model to adjust here: OpenClaw "lives" on your own messaging accounts rather than being a separate bot user. **If you are in a group, OpenClaw can see that group** — which makes closed-by-default a necessity rather than caution.

| Goal | Setting |
|---|---|
| Allow all groups but only reply on mentions | `groups: { "*": { requireMention: true } }` |
| Only specific groups | `groups: { "<id>": { ... } }` (no `"*"` key) |
| Only you can trigger in groups | `groupPolicy: "allowlist"` + `groupAllowFrom: ["+1555..."]` |
| Reuse one trusted sender set across channels | `groupAllowFrom: ["accessGroup:operators"]` |

## Two independent axes: who can trigger vs. what the model sees

This is the section worth taking away, and the design most often misread.

**Allowlists govern who can trigger the agent, not what the model sees.** By default OpenClaw keeps context as received — quoted messages, thread history, forwarded metadata all get injected into the model **even when they come from senders who are not allowlisted**.

To filter the context too, set `contextVisibility`:

| Mode | Behavior |
|---|---|
| `"all"` (default) | Keep supplemental context as received |
| `"allowlist"` | Only inject history/thread/quote/forwarded context from allowlisted senders |
| `"allowlist_quote"` | Same, but keep the explicitly quoted/replied-to message from any sender |

It can be set per channel, per account, or globally (`channels.defaults.contextVisibility`). Channels that fetch supplemental context (Discord, Feishu, iMessage, Matrix, Teams, QQBot, Signal, Slack, Telegram, WhatsApp) apply it when building inbound context, and **unknown policy combinations fail closed by omitting the context**.

If prompt injection is on your mind, this is a setting to make deliberately: the default lets anyone who can speak in a group put text into your model's context.

## Who decides whether the agent speaks

`messages.groupChat.visibleReplies` has two modes:

- **`"automatic"` (default)** — the final assistant text posts to the room
- **`"message_tool"`** — the model decides when to speak, and must call `message(action=send)` to do so

The second suits shared rooms but has a prerequisite: **a model that reliably follows tool-only delivery**. If the model misses the tool and returns substantive final text, OpenClaw keeps that text private instead of posting it — a safe failure direction, but it also means a weaker model just looks silent.

There is a guard: if the message tool is unavailable under the active tool policy, OpenClaw falls back to automatic rather than silently suppressing the response, and `openclaw doctor` warns about the mismatch.

This replaces the older pattern of forcing the model to answer `NO_REPLY` for lurk-mode turns. In tool-only mode, doing nothing visible simply means not calling the tool.

**Commands are the exception**: native slash commands and authorized text `/...` commands always reply visibly, regardless of `message_tool`.

## Ambient room events

A newer setting for agents that live permanently in a room:

```json5
{ messages: { groupChat: { unmentionedInbound: "room_event" } } }
```

The default is `"user_request"`. Switching to `room_event` turns **unmentioned group chatter into quiet room context instead of user requests** — the agent reads it but stays silent unless it calls the message tool. Mentions, commands, abort requests, and DMs remain user requests.

## Session keys

- Groups default to `agent:<agentId>:<channel>:group:<id>`; rooms and channels use `channel:<id>`
- Telegram forum topics append `:topic:<id>`, so **each topic gets its own session**
- Direct chats use the main session (`session.dmScope` defaults to `main`, collapsing DMs into the agent's main session)

## Two shared mechanisms

**Bot loop protection** — channels that accept bot-authored inbound messages can use shared loop protection so two bots do not reply to each other indefinitely.

**Access groups** — `accessGroup:<name>` lets you define a trusted sender set once and reuse it across channel allowlists.

## The big picture

The channel layer compresses into three sentences: **DM access is `allowFrom`, group access is `groupPolicy` plus allowlists, and whether to reply is mention gating.**

The fourth sentence is the one people miss: **all three govern triggering, not what the model sees.** Context visibility is a separate `contextVisibility` setting, and it defaults to wide open.

## Changelog

- 2026-08-18: Substantially revised against the current official docs. **Corrected the install model**: channels are now almost entirely plugins, split into core (WebChat only), bundled plugins (Telegram, Reef), official plugins (Slack, Discord, WhatsApp, and more), and external plugins, with a Gateway restart required after install; the channel list is now presented as 31 channels by class. Added: the 1-hour expiry and 3-per-account cap on pairing requests, where approvals live in the Control UI, the full group-message decision flow, **the split between trigger authorization and context visibility** (`contextVisibility` and its fail-closed behavior), the `visibleReplies` automatic/message_tool distinction (and how it replaced the old `NO_REPLY` pattern), ambient room events, bot loop protection, and access groups.

## References

This article draws on the following official OpenClaw documentation:

- [Chat channels](https://docs.openclaw.ai/channels/) — the channel list and plugin classes
- [Groups](https://docs.openclaw.ai/channels/groups) — group policy, mention gating, contextVisibility, visibleReplies
- [Ambient room events](https://docs.openclaw.ai/channels/ambient-room-events) — quiet context for always-on rooms
- [Access groups](https://docs.openclaw.ai/channels/access-groups) — reusable sender allowlists
- [Security](https://docs.openclaw.ai/gateway/security) — requester-scoped controls and prompt context
