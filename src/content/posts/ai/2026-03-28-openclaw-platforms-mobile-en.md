---
title: "OpenClaw Mobile Platforms: iOS and Android"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, ios, android, mobile, node, canvas, camera, voice-wake]
lang: en
tldr: "OpenClaw's iOS and Android apps are not Gateways — they are Nodes, turning your phone's camera, screen, location, and voice into sensory extensions for AI agents."
description: "OpenClaw iOS and Android Node roles, pairing flow, Canvas/Camera/Voice capabilities, and limitations."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-platforms-mobile)

OpenClaw's mobile apps are not what you might expect — they don't run a Gateway. Instead, they connect to a Gateway as **Nodes**. The Gateway runs on your computer or server, while the phone exposes its hardware capabilities (camera, screen, location, microphone) for AI agents to use.

## The Role of a Node

```
Gateway (computer / VPS)
    ↕ WebSocket
Phone Node (iOS / Android)
    ↕
Camera, Canvas, Location, Voice, SMS...
```

A Node is a peripheral device, not a Gateway. Messages enter from a chat app to the Gateway, and the Gateway routes tool calls requiring phone hardware to the paired Node.

## iOS

Currently in **internal preview** stage.

### Connection Methods

Three discovery methods:

| Method | Scenario |
|---|---|
| Bonjour (local network) | Gateway and iPhone on the same network |
| Tailscale DNS-SD | Cross-network, but both on the same tailnet |
| Manual host/port entry | Any situation |

### Pairing Flow

1. Start the Gateway
2. In the iOS app settings, discover or manually enter the Gateway
3. Approve the pairing in the Gateway CLI:

```bash
openclaw devices list
openclaw devices approve <requestId>
```

### Features

**Canvas** — Renders interactive content via WKWebView. The Gateway serves an HTTP endpoint at `/__openclaw__/canvas/`, which can navigate to custom URLs, execute JavaScript, and take screenshots.

**Camera** — Front and rear camera photo capture and video recording (JPEG / MP4).

**Voice Wake** — Wake word activation plus continuous voice mode.

**Location** — GPS positioning.

### Push Notification Architecture

The iOS version uses a relay-backed push system instead of storing APNs tokens directly on the Gateway. This is designed to:
- Prevent distribution of production certificates to user deployments
- Ensure the relay only accepts officially released Apple builds
- Allow Gateways to send push notifications only to their own paired devices
- Maintain encrypted delegation between the app, relay, and Gateway

### Limitations

- Media commands require the app to be in the foreground (iOS background execution restrictions)
- Keychain tokens may be lost after reinstalling the app, requiring re-pairing
- Missing Canvas host configuration will cause Canvas loading failures

## Android

Source code is open, but **not yet publicly released**. You can build it yourself with Java 17 + Android SDK.

### Connection Methods

Discovers the Gateway via mDNS/NSD, or manually enter the WebSocket URL (`ws://<host>:18789`).

### Pairing Flow

Similar to iOS: connect via Setup Code or manual mode, then approve in the Gateway CLI.

```bash
openclaw devices list
openclaw devices approve <requestId>
```

### Features

Android offers richer functionality than iOS because Android's permission model is more open:

**Chat** — Message history, sending messages, push update subscriptions.

**Canvas / Camera** — HTML/CSS/JS editing, JPEG screenshots, MP4 recording.

**Voice** — Microphone control, transcription, TTS playback (ElevenLabs or system TTS fallback).

**Device Commands (Android exclusive):**

| Command | Function |
|---|---|
| `device.notifications` | Read notifications |
| `device.contacts` | Read contacts |
| `device.calendar` | Read calendar |
| `device.callLogs` | Read call logs |
| `device.sms` | Send SMS |
| `device.motion` | Motion sensors |
| `device.status` | Device status |

### Eight-Step Setup Flow

1. Enable verbose logging on the Gateway
2. (Optional) Verify discovery with dns-sd
3. Connect the Android app (Setup Code or manual)
4. Approve pairing in the Gateway CLI
5. Verify connection (`openclaw nodes status`)
6. Test chat functionality
7. Test Canvas / Camera
8. Test Voice and device commands

## iOS vs Android Feature Comparison

| Feature | iOS | Android |
|---|---|---|
| Canvas | ✅ WKWebView | ✅ WebView |
| Camera (photo) | ✅ | ✅ |
| Camera (video) | ✅ | ✅ |
| Location | ✅ | ✅ |
| Voice Wake | ✅ | ✅ |
| Voice / TTS | ✅ | ✅ |
| Push notifications | ✅ relay-backed | ✅ |
| SMS sending | ❌ | ✅ |
| Contacts / Calendar | ❌ | ✅ |
| Call logs | ❌ | ✅ |
| Notification reading | ❌ | ✅ |
| Motion sensors | ❌ | ✅ |
| Public release | Internal preview | Unreleased (self-build) |

## Telegram Pairing (Recommended for iOS)

If you use Telegram, the simplest iOS pairing method is through the `device-pair` plugin:

1. Send `/pair` to the bot on Telegram
2. The bot replies with setup instructions and a setup code
3. iOS app → Settings → Gateway, paste the setup code
4. Back in Telegram: `/pair pending` to confirm and approve

The setup code is a base64-encoded JSON containing the Gateway WebSocket URL and a short-lived bootstrap token.

## Overall

In OpenClaw, the phone is not "just another chat interface" — it is a sensory extension for AI agents. The Gateway thinks in the cloud or on your computer, while the phone provides real-world inputs like camera, location, and screen. Android can do more thanks to its more open permission model (read notifications, send SMS, access calendar). iOS, on the other hand, has a more rigorous security architecture for push notifications.

## References

This article is compiled from the following OpenClaw source documents:

- [docs/platforms/index.md](https://github.com/openclaw/openclaw/blob/main/docs/platforms/index.md) — Platform overview
- [docs/platforms/ios.md](https://github.com/openclaw/openclaw/blob/main/docs/platforms/ios.md) — iOS platform
- [docs/platforms/android.md](https://github.com/openclaw/openclaw/blob/main/docs/platforms/android.md) — Android platform
- [docs/nodes/index.md](https://github.com/openclaw/openclaw/blob/main/docs/nodes/index.md) — Nodes overview
- [docs/nodes/camera.md](https://github.com/openclaw/openclaw/blob/main/docs/nodes/camera.md) — Camera features
- [docs/nodes/audio.md](https://github.com/openclaw/openclaw/blob/main/docs/nodes/audio.md) — Audio features
- [docs/nodes/voicewake.md](https://github.com/openclaw/openclaw/blob/main/docs/nodes/voicewake.md) — Voice Wake features
- [docs/nodes/location-command.md](https://github.com/openclaw/openclaw/blob/main/docs/nodes/location-command.md) — Location features
- [docs/channels/pairing.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/pairing.md) — Pairing mechanism (Telegram pairing)
