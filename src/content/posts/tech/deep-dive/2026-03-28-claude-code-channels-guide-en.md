---
title: "Claude Code Channels: Push Events from Telegram, Discord, and iMessage into Your AI Dev Environment"
date: 2026-03-28
type: guide
category: tech
tags: [claude-code, channels, telegram, discord, imessage, webhooks, dx]
lang: en
tldr: "Channels pushes external events into a running Claude Code session — ask questions from your phone via Telegram, get notified of CI failures via webhook, or send commands through Discord. It's bidirectional: Claude reads the incoming event and replies back in the same channel. Currently in Research Preview."
description: "An introduction to Claude Code Channels: using the MCP protocol to push external events (Telegram, Discord, iMessage, custom webhooks) into a local session, so Claude can respond in real time even when you step away from the keyboard. Covers installation, security mechanisms, Enterprise controls, and comparisons with Remote Control, Web, and Slack."
draft: true
series:
  name: "Claude Code Automation Guide"
  order: 18
---

🌏 [中文版](/posts/tech/deep-dive/2026-03-28-claude-code-channels-guide)

<!-- TODO: Draft in progress -->
<!-- Reference: https://code.claude.com/docs/en/channels.md -->
<!-- Reference: https://code.claude.com/docs/en/channels-reference.md -->

## Planned Outline

### What Are Channels?
- Push external events into a running Claude Code session
- Built on the MCP server protocol
- Bidirectional: Claude reads events + replies in the same channel
- Currently in Research Preview; requires v2.1.80+

### Comparison with Other Features

| Feature | What It Does | Best For |
|---|---|---|
| Claude Code on the web | Run tasks in a cloud sandbox | Async, self-contained work |
| Claude in Slack | @Claude starts a web session | Kicking off tasks from team chat |
| MCP server | Claude actively queries external sources | On-demand reads from external systems |
| Remote Control | Drive a local session from your phone | Remotely controlling work in progress |
| **Channels** | Push external events into a session | Receiving and responding to external events in real time |

### Supported Channels

#### Telegram
- Create a bot via BotFather
- Install the plugin: `/plugin install telegram@claude-plugins-official`
- Configure the token: `/telegram:configure <token>`
- Start with: `claude --channels plugin:telegram@claude-plugins-official`
- Pair your account and configure the allowlist

#### Discord
- Create a Discord bot and enable the Message Content Intent
- Configure bot permissions
- Install the plugin and set the token
- Pair and configure security settings

#### iMessage (macOS only)
- No bot token required — reads directly from the Messages database
- Requires Full Disk Access permission
- Send a message to yourself to get started

### Security Mechanisms
- Sender allowlist: only approved IDs can push messages
- Pairing code mechanism
- Permission relay: channels can forward permission prompts
- `--channels` flag controls which channels are enabled per session

### Enterprise Controls
- `channelsEnabled`: master switch (disabled by default for Team/Enterprise)
- `allowedChannelPlugins`: restrict which channel plugins are available
- Pro/Max users are not restricted

### Building a Custom Channel
- Create your own Channel server
- Webhook receiver mode: receive events from CI, error trackers, deploy pipelines
- Use `--dangerously-load-development-channels` for testing

### Real-World Use Cases
- Ask Claude questions from your phone via Telegram while it operates on local files
- CI failures trigger a webhook push to the session; Claude automatically analyzes and fixes the issue
- Discord receives team commands; Claude executes them and replies with results

## References

- [Claude Code Overview — Platforms and Integrations](https://docs.anthropic.com/en/docs/claude-code/overview) — Official platform integration overview covering Channels' role in the broader ecosystem
- [Claude Code Remote Control](https://docs.anthropic.com/en/docs/claude-code/remote-control) — Documentation for Remote Control, a complementary mechanism for remotely driving local sessions
- [Telegram BotFather Documentation](https://core.telegram.org/bots#botfather) — Official guide to creating a Telegram Bot, the prerequisite for the Channels Telegram integration
- [Discord Developer Portal — Bot Setup](https://discord.com/developers/docs/intro) — Official docs for creating a Discord Bot and enabling the Message Content Intent
- [Claude Code MCP](https://docs.anthropic.com/en/docs/claude-code/mcp) — MCP server protocol reference; Channels is built on top of MCP
- [Claude Code Settings](https://docs.anthropic.com/en/docs/claude-code/settings) — Settings fields related to Channels: `channelsEnabled`, `allowedChannelPlugins`, etc.
- [Model Context Protocol Specification](https://modelcontextprotocol.io/introduction) — The official MCP spec; foundational reading for understanding Channels' underlying communication architecture
