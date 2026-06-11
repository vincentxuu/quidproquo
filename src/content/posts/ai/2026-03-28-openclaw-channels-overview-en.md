---
title: "OpenClaw Channels Overview: Pairing, Groups, and Routing"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, channels, pairing, groups, routing, broadcast]
lang: en
tldr: "OpenClaw supports 24+ channels running simultaneously, using Pairing to control who can chat, Group Policy to control group behavior, and Routing to decide which agent receives messages."
description: "An overview of OpenClaw channels, DM/Node Pairing mechanisms, group policies, routing rules, and Broadcast Groups."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-channels-overview)

OpenClaw's channel system lets you connect multiple chat platforms through a single Gateway. This post covers the cross-channel common mechanisms: Pairing, Groups, Routing, and Broadcast.

## Supported Channels

### Built-in Channels

| Channel | Highlights |
|---|---|
| WhatsApp | Most widely used, Baileys implementation, QR pairing |
| Telegram | Fastest setup, Bot API, supports forum topics |
| Discord | Bot API, supports server/channel/DM |
| Slack | Workspace app, Bolt SDK, Socket Mode or HTTP |
| Signal | signal-cli, privacy-oriented |
| Google Chat | HTTP webhook |
| IRC | Classic, has pairing control |
| WebChat | Gateway UI over WebSocket |

### Plugin Channels

BlueBubbles (iMessage), LINE, Matrix, Mattermost, Microsoft Teams, Feishu, Nextcloud Talk, Nostr, Synology Chat, Tlon, Twitch, Voice Call, WeChat, Zalo.

**All channels can run simultaneously.** Configure multiple channels, and OpenClaw routes by chat.

### Setup Speed Comparison

Telegram is the fastest (just grab a bot token). WhatsApp requires QR pairing and stores more state on disk. For iMessage, BlueBubbles is recommended.

## DM Pairing

When a channel uses the `pairing` policy, unknown senders receive a short code and their messages are held until you approve them.

### Pairing Code Specifications

- 8 uppercase letters (excluding easily confused characters like 0, O, 1, I)
- **Expires after 1 hour**
- Maximum 3 pending requests per channel; additional ones are ignored

### Approval

```bash
openclaw pairing list telegram
openclaw pairing approve telegram <CODE>
```

### Channels Supporting Pairing

All built-in + plugin channels support pairing: bluebubbles, discord, feishu, googlechat, imessage, irc, line, matrix, mattermost, msteams, nextcloud-talk, nostr, signal, slack, synology-chat, telegram, twitch, whatsapp, zalo, zalouser.

### State Storage

- Pending: `~/.openclaw/credentials/<channel>-pairing.json`
- Approved: `~/.openclaw/credentials/<channel>-allowFrom.json`

## Node Pairing

When a phone or other device connects to the Gateway as a Node, pairing is also required.

```bash
openclaw devices list
openclaw devices approve <requestId>
```

Telegram pairing (recommended for iOS): Send `/pair` to the bot, get the setup code, and paste it into the iOS app.

Node state is stored in `~/.openclaw/devices/`.

## DM Policy

Each channel's DM access is controlled by `dmPolicy`:

| Policy | Behavior |
|---|---|
| `pairing` (default) | Unknown users need a pairing code + approval |
| `allowlist` | Only users in the `allowFrom` list are allowed |
| `open` | Anyone can chat (requires `allowFrom: ["*"]`) |
| `disabled` | DMs are turned off |

## Group Policies

Groups have two layers of control: access to the group itself + who within the group can trigger the agent.

### Group Policy

| Policy | Behavior |
|---|---|
| `open` | Does not check allowlist, but mention gating still applies |
| `allowlist` (default) | Only configured groups are allowed |
| `disabled` | Blocks all groups |

### Mention Gating

Groups require @mention by default to trigger a response. You can use custom mention patterns (e.g., `@openclaw`, phone number), or disable it with `requireMention: false`.

Replying to a bot message also counts as an implicit mention (on platforms that support reply metadata).

### Group Session Isolation

Group session key format: `agent:<agentId>:<channel>:group:<id>`. Completely separate from DM sessions, enabling differentiated sandboxing -- DMs get full tool permissions, while groups have restricted tools.

### Per-Group Overrides

You can set different mention rules, sender allowlists, and tool restrictions for specific groups.

## Routing (Channel Routing)

Routing is **deterministic** -- replies are always sent back to the channel the message came from. The model does not choose the channel; configuration controls everything.

### Routing Priority Order

```
1. Exact peer match (exact DM/group)
2. Parent peer (thread inheritance)
3. Guild + roles (Discord)
4. Guild (Discord)
5. Team (Slack)
6. Account ID
7. Channel (any account)
8. Default agent fallback
```

Multiple conditions are ANDed -- all must match.

### Session Key Structure

| Type | Format |
|---|---|
| Direct | `agent:<agentId>:main` (or `direct:<peerId>`) |
| Group | `agent:<agentId>:<channel>:group:<id>` |
| Thread | Appends `:thread:<id>` or `:topic:<id>` |

## Broadcast Groups (Experimental)

Allows multiple agents to **process the same message simultaneously**. Currently only supports WhatsApp; Telegram/Discord/Slack support is planned.

### Use Cases

- **Specialized teams** -- code reviewer + doc generator + security auditor process simultaneously
- **Multilingual** -- language detection + per-language agents
- **QA** -- main agent answers + QA agent reviews

### Configuration

```json5
{
  broadcast: {
    "120363403215116621@g.us": ["alfred", "baerbel", "assistant3"]
  }
}
```

### Processing Strategies

| Strategy | Behavior |
|---|---|
| `parallel` (default) | All agents process simultaneously |
| `sequential` | Processed in order; the next agent starts only after the previous one finishes |

Each agent has a completely independent session, workspace, sandbox, and tool permissions. It is recommended to limit to 5-10 agents and use lighter models for simpler tasks.

## Summary

The core logic of OpenClaw's channel system:

1. **Pairing** controls "who can chat with the agent"
2. **Group Policy + Mention Gating** controls "how interactions work within groups"
3. **Routing** controls "which agent receives the message"
4. **Broadcast** enables "multiple agents to process the same message simultaneously"

These mechanisms are universal across all channels. The following three posts cover the specific configuration for each channel.

## References

This post is compiled from the following OpenClaw source documents:

- [docs/channels/index.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/index.md) -- Channel overview
- [docs/channels/pairing.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/pairing.md) -- Pairing mechanism
- [docs/channels/groups.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/groups.md) -- Group settings
- [docs/channels/group-messages.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/group-messages.md) -- Group messages
- [docs/channels/channel-routing.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/channel-routing.md) -- Routing mechanism
- [docs/channels/broadcast-groups.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/broadcast-groups.md) -- Broadcast Groups
- [docs/channels/location.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/location.md) -- Location feature
- [docs/channels/troubleshooting.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/troubleshooting.md) -- Channel troubleshooting
