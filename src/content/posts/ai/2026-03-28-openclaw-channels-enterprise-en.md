---
title: "OpenClaw Enterprise Channels: Slack, Teams, Google Chat & Matrix"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, slack, microsoft-teams, google-chat, matrix, enterprise]
lang: en
tldr: "Slack has the most complete enterprise features (native streaming, slash commands). Teams requires Azure Bot setup. Matrix supports E2EE encryption."
description: "OpenClaw enterprise communication platform integrations: Slack (Socket/HTTP Mode), Microsoft Teams, Google Chat, and Matrix (with E2EE)."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-channels-enterprise)

Enterprise environments typically use Slack, Microsoft Teams, or self-hosted Matrix. This article covers the setup methods and characteristics of each channel.

## Slack

OpenClaw has the most complete support for Slack, with two connection modes.

### Socket Mode (Default)

1. Enable Socket Mode in the Slack App settings
2. Create an App Token (`xapp-...`, scope: `connections:write`)
3. Install the app and obtain the Bot Token (`xoxb-...`)
4. Configure both tokens and subscribe to bot events
5. Start the Gateway

### HTTP Mode

1. Set `mode: "http"`
2. Obtain the Signing Secret
3. Configure the webhook path (default: `/slack/events`)
4. Register Events/Interactivity/Slash commands URLs in Slack

### Key Features

**Native Streaming:** After enabling Slack's Agents and AI Apps feature, native streaming is supported (`partial` (default) / `block` / `progress` / `off`).

**Native Slash Commands:** Set `commands.native: true`, then register the corresponding commands in Slack. Note: `/status` is reserved by Slack; use `/agentstatus` instead.

**Interactive Replies:** When enabled, the agent can use Slack buttons and select menus.

### Access Control

DM: pairing / allowlist / open / disabled.
Channel: open / allowlist / disabled; mention required by default.

### Troubleshooting

Channel access issue check order: policy → allowlist → mention → user restrictions.
DM issues: `dm.enabled` → policy → pairing approvals.
Diagnostics: `openclaw channels status --probe` + `openclaw doctor`.

## Microsoft Teams

Teams is a **plugin** that requires separate installation.

```bash
openclaw plugins install @openclaw/msteams
```

### Setup

Three Azure Bot credentials are required: App ID, App Password, and Tenant ID.

Workflow: Create Azure Bot resource → Set messaging endpoint → Enable Teams channel → Configure OpenClaw.

### Features

| Feature | Support |
|---|---|
| DM | ✅ |
| Group chat | ✅ |
| Channel | ✅ |
| File attachments | ✅ (personal conversations) |
| Adaptive Cards | ✅ (polls, formatted content) |
| Message history | ✅ (configurable limit) |

### Access Control

DM defaults to pairing. Group/Channel defaults to allowlist. It's recommended to use stable Teams/Channel IDs rather than mutable display names.

### Limitations

- Webhook timeout restrictions
- File sending in channels and groups requires SharePoint integration + Graph API permissions
- Downloading hosted images requires additional Microsoft Graph permissions

## Google Chat

HTTP webhook integration with relatively simple setup. Configuration details are in `docs/channels/googlechat.md`.

## Matrix

Matrix is a plugin with the most complete security features -- including end-to-end encryption (E2EE).

```bash
openclaw plugins install @openclaw/matrix
```

### Authentication Methods

**Token-based (Recommended):**

```json5
{
  channels: {
    matrix: {
      enabled: true,
      homeserver: "https://matrix.example.org",
      accessToken: "syt_xxx",
      dm: { policy: "pairing" }
    }
  }
}
```

**Password-based:** `homeserver` + `userId` + `password` + `deviceName`.

### E2EE Encryption

```json5
{ encryption: true }
```

Management commands:

```bash
openclaw matrix verify status           # Check verification status
openclaw matrix verify bootstrap        # Set up cross-signing
openclaw matrix verify backup status    # Backup status
openclaw matrix verify backup restore   # Restore encrypted messages
openclaw matrix devices list            # List devices
openclaw matrix devices prune-stale     # Remove stale devices
```

"Verified" requires cross-signing (your identity signs it), not just local trust.

### Thread Support

| Mode | Behavior |
|---|---|
| `off` | Replies at top-level |
| `inbound` | Uses threads only when receiving threaded messages |
| `always` | Group replies always use threads |

### Multiple Accounts

```json5
{
  matrix: {
    defaultAccount: "assistant",
    accounts: {
      assistant: { /* config */ },
      alerts: { /* config */ }
    }
  }
}
```

### Bot-to-Bot Communication

By default, messages from other OpenClaw Matrix accounts are ignored (preventing self-reply loops). Set `allowBots: "mentions"` to allow agents to interact via mentions.

### Other Features

Reactions, Polls, Location sharing, media attachments, DM status repair (`openclaw matrix direct repair`), and private/LAN homeserver support.

## Feishu

A plugin channel designed for Chinese enterprise environments. Configuration is in `docs/channels/feishu.md`.

## Enterprise Channel Comparison

| | Slack | Teams | Matrix | Google Chat |
|---|---|---|---|---|
| Installation | Built-in | Plugin | Plugin | Built-in |
| Connection Mode | Socket / HTTP | Azure Bot | SDK | Webhook |
| DM | ✅ | ✅ | ✅ | ✅ |
| Group/Channel | ✅ | ✅ | ✅ (Room) | ✅ |
| Thread | ✅ | ✅ | ✅ | ❌ |
| E2EE | ❌ | ❌ | ✅ | ❌ |
| Native Streaming | ✅ | ❌ | ❌ | ❌ |
| Interactive | ✅ | Adaptive Cards | Reactions/Polls | ❌ |
| Multiple Accounts | ✅ | ✅ | ✅ | ✅ |

## Summary

Slack is the most feature-complete enterprise channel -- it has native streaming, slash commands, and interactive replies. Teams is more complex to set up but covers the Microsoft ecosystem. Matrix is ideal for teams that value privacy and self-hosting, with E2EE as its exclusive advantage.

## References

This article is compiled from the following OpenClaw source documents:

- [docs/channels/slack.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/slack.md) — Slack setup
- [docs/channels/msteams.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/msteams.md) — Microsoft Teams setup
- [docs/channels/googlechat.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/googlechat.md) — Google Chat setup
- [docs/channels/matrix.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/matrix.md) — Matrix setup
- [docs/channels/feishu.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/feishu.md) — Feishu setup
