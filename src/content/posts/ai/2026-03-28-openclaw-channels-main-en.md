---
title: "OpenClaw Primary Channels: WhatsApp, Telegram, Discord"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, whatsapp, telegram, discord, channels]
lang: en
tldr: "WhatsApp uses QR pairing + Baileys, Telegram is the fastest to set up with a Bot Token, and Discord supports guild/thread/button interactive components."
description: "Complete setup guide for OpenClaw's three primary channels: WhatsApp QR pairing, Telegram Bot API, and Discord guild with interactive components."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-channels-main)

WhatsApp, Telegram, and Discord are the three most commonly used channels by OpenClaw users. Each has different setup procedures and distinctive features.

## WhatsApp

The most popular channel. Implemented via WhatsApp Web (Baileys), requiring QR pairing.

### Installation

WhatsApp is an on-demand plugin. It will automatically prompt for installation during `openclaw onboard` or `openclaw channels add --channel whatsapp`. You can also install manually:

```bash
openclaw plugins install @openclaw/whatsapp
```

### Configuration

```json5
{
  channels: {
    whatsapp: {
      dmPolicy: "allowlist",
      allowFrom: ["+15551234567"]  // E.164 format
    }
  }
}
```

### Account Linking

```bash
openclaw channels login --channel whatsapp
# Scan the QR code

# Multiple accounts
openclaw channels login --channel whatsapp --account work
```

### Access Control

**DM:** pairing (default) / allowlist / open / disabled. Phone numbers are automatically normalized to E.164 format.

**Groups:** Two layers — group allowlist + sender authorization. Can be set to open / allowlist / disabled.

**Mention:** Group replies require a bot mention or replying to a bot message. Within a session, you can switch using `/activation mention` or `/activation always`.

### Operational Details

| Item | Value |
|---|---|
| Message chunking | 4000 characters |
| Media limit | 50 MB (configurable) |
| Group history buffer | 50 messages (default) |
| Read receipt | On by default, can be disabled |
| Self-chat protection | Automatically enabled when the linked number is in the allowlist |

Credentials are stored at `~/.openclaw/credentials/whatsapp/<accountId>/creds.json`. Legacy paths are automatically migrated.

### Logout

```bash
openclaw channels logout --channel whatsapp [--account <id>]
```

## Telegram

The fastest channel to set up — just grab a bot token and you're good to go.

### Setup Steps

1. Find @BotFather on Telegram, run `/newbot`, and get the token
2. Configure the token: via config file or `TELEGRAM_BOT_TOKEN` environment variable
3. Set `channels.telegram.enabled: true`
4. Start the Gateway

### Access Control

DM policy has the same four options. Groups can be configured with `requireMention` and `groupAllowFrom`.

**Privacy Mode Note:** Bots can only see messages directed at them by default. To see all group messages, disable privacy mode with `/setprivacy` or give the bot admin permissions.

### Notable Features

| Feature | Description |
|---|---|
| Live streaming | Implemented via message editing |
| Inline keyboard | Enables button interactions |
| Forum topics | Each topic gets an independent session |
| Custom command menu | Configurable |
| Sticker | Supported |
| Reactions | Notifications configurable |
| Device pairing | Supports iOS app pairing |

### Communication Mode

Long polling (default) or Webhook.

## Discord

The richest interactive component support among all channels.

### Setup Steps

1. Create an Application + Bot in the Discord Developer Portal
2. Enable **Message Content Intent** (required) and **Server Members Intent** (recommended)
3. Generate OAuth2 permissions (basic messaging + file + embed)
4. Obtain the Bot token, Server ID, and User ID
5. Configure the token (environment variable)
6. Start the Gateway

### Guild Configuration

```json5
{
  channels: {
    discord: {
      guilds: {
        "<server-id>": {
          requireMention: true,
          historyLimit: 20
        }
      }
    }
  }
}
```

Supports per-guild and per-channel overrides.

### Interactive Components

Discord is the only channel that supports these:

| Component | Description |
|---|---|
| Button | Can set `allowedUsers` to restrict who can click |
| Dropdown menu | Selection dropdown |
| Modal form | Forms with up to 5 fields |
| File gallery | Media attachments |
| Reusable components | Multiple interactions until expiration |

### Access Control

**DM:** pairing / allowlist / open / disabled.

**Guild:** open / allowlist / disabled. Default is allowlist.

**Role-based routing:** Can route to different agents based on user role.

### Reply and Streaming

| Setting | Options |
|---|---|
| Reply mode | `off` (default) / `first` / `all` |
| Streaming | `off` / `partial` / `block` / `progress` |

Forum and thread support includes automatic thread creation with isolated sessions.

## Comparison

| | WhatsApp | Telegram | Discord |
|---|---|---|---|
| Setup difficulty | Medium (QR pairing) | Low (bot token) | Medium (Developer Portal) |
| DM support | ✅ | ✅ | ✅ |
| Group support | ✅ | ✅ | ✅ (Guild) |
| Interactive components | ❌ | Inline keyboard | Button/Dropdown/Modal |
| Live streaming | ❌ | ✅ (edit) | ✅ (edit) |
| Thread | ❌ | ✅ (Forum topics) | ✅ (Thread) |
| Media | ✅ 50MB | ✅ | ✅ |
| Multi-account | ✅ | ✅ | ✅ |
| Role routing | ❌ | ❌ | ✅ |

## Summary

For quick setup, choose Telegram. For chatting on-the-go from your phone, choose WhatsApp. For interactive components and role routing, choose Discord. All three can run simultaneously — the Gateway handles routing automatically.

## References

This article is compiled from the following OpenClaw source documents:

- [docs/channels/whatsapp.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/whatsapp.md) — WhatsApp setup
- [docs/channels/telegram.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/telegram.md) — Telegram setup
- [docs/channels/discord.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/discord.md) — Discord setup
