---
title: "OpenClaw UI: Control UI, TUI, and Web Chat"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, control-ui, tui, web-chat, dashboard, terminal]
lang: en
tldr: "Control UI is a browser dashboard (http://127.0.0.1:18789), TUI is a terminal interactive interface, and Web Chat is a WebSocket real-time chat."
description: "The three user interfaces of OpenClaw: Control UI browser dashboard, TUI terminal interface, and Web Chat real-time messaging."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-ui)

OpenClaw offers multiple interaction methods — from a browser dashboard to a terminal interface, from WebSocket chat to messaging platform channels.

## Control UI (Browser Dashboard)

`http://127.0.0.1:18789` — the management interface built into the Gateway.

### Features

| Section | Function |
|---|---|
| Dashboard | System status overview |
| Sessions | Session list, conversation history |
| Channels | Channel status, connection management |
| Models | Model status, authentication status |
| Agents | Agent list, configuration |
| Nodes | Node status, pairing management |
| Config | Configuration editor (requires `commands.config` enabled) |
| Chat | Built-in Web Chat |

### Access Control

- No authentication needed when bound to loopback
- Token or password required for non-loopback access
- Tailscale Serve can use Tailscale identity
- Trusted Proxy can delegate to a reverse proxy

### Configuration

```json5
{
  gateway: {
    controlUi: {
      enabled: true,
      basePath: "/"
    }
  }
}
```

## Web Chat

Real-time chat built into the Control UI, running over WebSocket.

### Highlights

- Real-time streaming responses
- Thinking level selector
- Media attachment support
- Tool call visualization
- Session switching

### Thinking Selector

The Web Chat thinking selector maps to the levels stored in the session. Selecting a new level only affects the next message (`thinkingOnce`); after sending, it reverts to the session default. To permanently change the session default, use the `/think:<level>` directive.

## TUI (Terminal Interface)

The interactive mode of the CLI.

```bash
openclaw chat                    # Start interactive session
openclaw chat --agent work       # Specify an agent
openclaw chat --session isolated # Isolated session
```

### Highlights

- Real-time streaming in the terminal
- Supports all slash commands
- Supports all directives
- Background execution monitoring

## WebChat Channel

In addition to the Web Chat built into the Control UI, OpenClaw also offers WebChat as a standalone channel, running over WebSocket with support for pairing and access control.

## macOS Menu Bar App

The macOS menu bar app can serve as:
- A Gateway control panel
- A Node (providing Canvas/Camera)
- A Skills management UI

### Skills UI

Within the macOS app:
- Browse available skills
- Enable/disable skills
- Install skills (brew/npm/go/download)
- Configure skill API keys

## CLI Operations

```bash
openclaw health                  # Check Gateway health
openclaw channels status         # Channel status
openclaw models status           # Model status
openclaw nodes status            # Node status
openclaw doctor                  # Full diagnostic
openclaw doctor --fix            # Attempt repairs
```

## Summary

OpenClaw's UI covers different usage scenarios: Control UI is ideal for management and monitoring, Web Chat is great for quick testing, TUI suits terminal users, and the macOS App enables desktop integration. All interfaces connect to the same Gateway with fully synchronized state.

## References

This article is compiled from the following OpenClaw source documents:

- [docs/ui/control-ui.md](https://github.com/openclaw/openclaw/blob/main/docs/ui/control-ui.md) — Control UI
- [docs/ui/tui.md](https://github.com/openclaw/openclaw/blob/main/docs/ui/tui.md) — TUI
- [docs/ui/index.md](https://github.com/openclaw/openclaw/blob/main/docs/ui/index.md) — UI Overview
- [docs/channels/webchat.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/webchat.md) — WebChat Channel
- [docs/platforms/macos.md](https://github.com/openclaw/openclaw/blob/main/docs/platforms/macos.md) — macOS App
