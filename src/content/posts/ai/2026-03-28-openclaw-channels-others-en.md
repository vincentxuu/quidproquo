---
title: "OpenClaw Other Channels: Signal, iMessage, LINE, IRC, Nostr, and More"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, signal, imessage, bluebubbles, line, irc, nostr, twitch, zalo]
lang: en
tldr: "Signal uses signal-cli for privacy, iMessage is best via BlueBubbles, LINE uses webhooks, IRC/Nostr/Twitch each have their own character."
description: "OpenClaw niche channel setup guide: Signal, iMessage/BlueBubbles, LINE, IRC, Nostr, Twitch, Zalo, and more."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-channels-others)

Beyond the big three and the four enterprise channels, OpenClaw supports a whole bunch of other channels. Some focus on privacy (Signal), some target specific markets (LINE, Zalo), and some are decentralized protocols (Nostr, Matrix). This post covers them all.

## Signal

Privacy-oriented, integrated via `signal-cli` (an external CLI tool) using HTTP JSON-RPC + SSE communication.

### Two Setup Paths

**Path A (QR Linking):** Link to an existing Signal account.
```bash
signal-cli link -n "OpenClaw"
# Scan QR code with Signal app
```

**Path B (SMS Registration):** Register a dedicated number, requiring captcha + SMS verification. This is the recommended approach — it avoids conflicts with personal accounts.

### Configuration

Minimal configuration: bot phone number (E.164 format), CLI path, DM policy, and allowFrom.

### Operational Details

| Item | Value |
|---|---|
| Message chunking | 4000 characters |
| Media limit | 8 MB |
| Group history | 50 messages |
| Typing / Read receipt | ✅ (DM) |
| Reactions | ✅ emoji |

### Self-Chat Protection

When using a personal account, the bot ignores its own messages to prevent loops.

### Daemon Mode

You can have OpenClaw automatically spawn signal-cli, or connect to an externally managed daemon.

## iMessage

### Legacy (imsg CLI)

Legacy system using the `imsg` CLI + JSON-RPC. **New deployments should use BlueBubbles.**

Requirements: macOS + Messages app signed in + Full Disk Access + Automation permissions.

For remote deployment, you can point `cliPath` to an SSH wrapper script that connects to a Mac running Messages.

### BlueBubbles (Recommended)

Uses the BlueBubbles macOS server's REST API with full feature support. This is OpenClaw's recommended iMessage path.

Configuration is in `docs/channels/bluebubbles.md`.

### iMessage General Limitations

- Only works on macOS (directly or remotely)
- Mentions have no native metadata; detected via regex pattern
- Multi-account support with per-account overrides

## LINE

Plugin channel using the Messaging API webhook.

```bash
openclaw plugins install @openclaw/line
```

### Setup

1. Create a LINE Developers account
2. Create a Messaging API channel
3. Obtain the Channel Access Token + Channel Secret
4. Enable webhook, pointing the URL to `https://gateway-host/line/webhook`
5. Configure OpenClaw

### Security

LINE's signature verification is body-dependent (HMAC over raw body). OpenClaw performs body size and timeout checks before verification.

### Features

| Supported | Not Supported |
|---|---|
| DM | Reactions |
| Group | Thread |
| Media (10 MB) | |
| Flex messages | |
| Template messages | |
| Quick replies | |
| Location | |

Message chunking at 5000 characters. Markdown is converted to Flex cards. Multi-account uses separate webhook paths.

## IRC

Built-in channel, a classic. Has pairing controls. Configuration in `docs/channels/irc.md`.

## Nostr

Plugin channel, a decentralized protocol. Configuration in `docs/channels/nostr.md`.

## Twitch

Plugin channel, live chat integration. Configuration in `docs/channels/twitch.md`.

## Zalo

Plugin channel, Vietnam's largest messaging platform. Two versions available:
- `zalo` — Official Account API
- `zalouser` — Personal account API

Configuration in `docs/channels/zalo.md` and `docs/channels/zalouser.md`.

## Other Plugin Channels

| Channel | Description |
|---|---|
| Mattermost | Open-source Slack alternative |
| Nextcloud Talk | Nextcloud's messaging feature |
| Synology Chat | Built-in chat for Synology NAS |
| Tlon | Urbit-based messaging |
| Voice Call | Voice call integration |
| WeChat | WeChat (community-maintained) |

## Feature Comparison Across All Channels

| Channel | Install | DM | Group | Media | Streaming | Thread | Encryption |
|---|---|---|---|---|---|---|---|
| WhatsApp | Plugin | ✅ | ✅ | 50MB | ❌ | ❌ | ✅ (E2EE) |
| Telegram | Built-in | ✅ | ✅ | ✅ | ✅ | Forum | ❌ |
| Discord | Built-in | ✅ | Guild | ✅ | ✅ | ✅ | ❌ |
| Slack | Built-in | ✅ | Channel | ✅ | ✅ Native | ✅ | ❌ |
| Signal | Built-in | ✅ | ✅ | 8MB | ❌ | ❌ | ✅ (E2EE) |
| iMessage | Built-in/BB | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ (E2EE) |
| Matrix | Plugin | ✅ | Room | ✅ | ❌ | ✅ | ✅ (E2EE) |
| Teams | Plugin | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| LINE | Plugin | ✅ | ✅ | 10MB | ❌ | ❌ | ❌ |
| IRC | Built-in | ✅ | Channel | ❌ | ❌ | ❌ | ❌ |

## Overall

OpenClaw's channel selection is unreasonably broad — from the most mainstream WhatsApp to the decentralized Nostr. Most people only need 1-3 channels. The selection criteria is simple: connect whichever platform your friends and colleagues are on.

## References

This post is compiled from the following OpenClaw source documents:

- [docs/channels/signal.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/signal.md) — Signal setup
- [docs/channels/imessage.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/imessage.md) — iMessage (legacy)
- [docs/channels/bluebubbles.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/bluebubbles.md) — BlueBubbles (recommended iMessage)
- [docs/channels/line.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/line.md) — LINE
- [docs/channels/irc.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/irc.md) — IRC
- [docs/channels/nostr.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/nostr.md) — Nostr
- [docs/channels/twitch.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/twitch.md) — Twitch
- [docs/channels/zalo.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/zalo.md) — Zalo
- [docs/channels/zalouser.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/zalouser.md) — Zalo User
- [docs/channels/mattermost.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/mattermost.md) — Mattermost
- [docs/channels/nextcloud-talk.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/nextcloud-talk.md) — Nextcloud Talk
- [docs/channels/synology-chat.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/synology-chat.md) — Synology Chat
- [docs/channels/tlon.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/tlon.md) — Tlon
