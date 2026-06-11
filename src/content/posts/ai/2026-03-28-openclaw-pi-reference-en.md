---
title: "OpenClaw Reference: Pi Integration & Configuration Reference"
date: 2026-03-28
type: deep-dive
category: ai
tags: [openclaw, pi, reference, configuration, features, architecture]
lang: en
tldr: "Pi is OpenClaw's embedded coding agent runtime; OpenClaw is Pi's Gateway shell. This configuration reference covers 16 top-level sections and 335 documents."
description: "OpenClaw and Pi integration architecture, complete feature list, and configuration quick reference."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-pi-reference)

OpenClaw's AI core is Pi (a coding agent runtime). OpenClaw handles channels, routing, and security, while Pi handles reasoning, tool execution, and memory. This article summarizes the relationship between the two and provides a configuration reference.

## Relationship Between OpenClaw and Pi

| Layer | Owner | Function |
|---|---|---|
| Gateway | OpenClaw | Channel management, routing, authentication, scheduling |
| Agent Runtime | Pi | Reasoning, tool execution, context management |
| Session | Co-managed | OpenClaw owns the session; Pi executes the agent loop |
| Memory | Pi | Markdown files, vector search |
| Compaction | Pi | Context window compression |
| Sandbox | Co-managed | OpenClaw manages containers; Pi executes inside them |

Pi's configuration is passed through OpenClaw's `agents.defaults` and `agents.list[]`.

## Complete Feature List

### Core

| Feature | Description |
|---|---|
| Multi-agent routing | Multiple agent routing (binding priority order) |
| Delegate architecture | 3-tier autonomous authorization |
| Agent loop | intake → context → inference → tool → stream |
| Block streaming | Chunking (minChars/maxChars) |
| 5 queue modes | steer/followup/collect/steer-backlog/interrupt |

### Models

| Feature | Description |
|---|---|
| 35+ providers | Anthropic/OpenAI/Google + local (Ollama/vLLM) |
| Auth profile rotation | Cooldown escalation |
| Model failover | Auth → Model → Thinking degradation |
| Prompt caching | cacheRetention (none/short/long) |
| Token tracking | 10 cost source types |

### Session & Memory

| Feature | Description |
|---|---|
| 4 DM scopes | main/per-peer/per-channel-peer/per-account-channel-peer |
| Identity links | Cross-platform same-person linking |
| Memory flush | Auto-write to disk before compaction |
| Vector search | BM25 + embedding hybrid search |
| Context Engine | Pluggable (ingest/assemble/compact/after-turn) |

### Security

| Feature | Description |
|---|---|
| 3 sandbox backends | Docker/SSH/OpenShell |
| 3 control layers | Sandbox/Tool Policy/Elevated |
| MITRE ATLAS threat model | 13 threat scenarios |
| TLA+ formal verification | 6+ security assertions |
| SecretRef | env/file/exec — three source types |

### Channels

| Feature | Description |
|---|---|
| 24+ channels | Running simultaneously |
| Pairing | 8-character code, 1-hour expiry |
| Broadcast Groups | Multiple agents processing concurrently |
| Channel routing | Deterministic reply to source |

### Tools

| Feature | Description |
|---|---|
| Browser | Managed profile + remote CDP |
| Exec | 3 security levels + approval |
| Skills | 6-tier priority + ClawHub |
| Sub-agent | Maximum 5 nesting levels |
| Lobster | Deterministic workflow runtime |
| TTS | 3 providers |
| PDF | Native + extraction |

### Automation

| Feature | Description |
|---|---|
| Cron | Precise scheduling + isolated sessions |
| Heartbeat | Periodic health checks |
| Webhook | External event triggers |
| Standing Orders | Persistent authorization programs |

### UI & Nodes

| Feature | Description |
|---|---|
| Control UI | Browser dashboard |
| TUI | Terminal interactive interface |
| Web Chat | WebSocket real-time chat |
| iOS/Android Node | Camera/Canvas/Location/SMS |
| Node Host | Remote exec |

## Configuration Structure Quick Reference

```json5
{
  agents: {           // Agent settings (defaults + list)
    defaults: {
      workspace: "",
      sandbox: {},
      heartbeat: {},
      compaction: {},
      models: {}
    },
    list: []
  },
  channels: {},       // Channel settings (per-channel)
  commands: {},       // Slash commands settings
  gateway: {          // Gateway settings
    bind: "",
    port: 0,
    auth: {},
    tailscale: {},
    controlUi: {}
  },
  hooks: {},          // Webhook settings
  mcp: {},            // MCP Server settings
  messages: {},       // Message settings (TTS, formatting)
  models: {},         // Model provider settings
  plugins: {},        // Plugin settings
  secrets: {},        // SecretRef provider settings
  session: {},        // Session settings (dmScope, maintenance)
  skills: {},         // Skills settings
  tools: {}           // Tool settings (exec, browser, web search)
}
```

## CLI Quick Reference

### Gateway

```bash
openclaw gateway              # Start Gateway
openclaw health               # Health check
openclaw doctor               # Diagnostics
openclaw doctor --fix         # Auto-fix
```

### Configuration

```bash
openclaw config get <path>    # Read
openclaw config set <path> <value>  # Set
openclaw config validate      # Validate
openclaw onboard              # Interactive setup
```

### Models

```bash
openclaw models status        # Auth status
openclaw models auth login    # Login
openclaw models auth setup-token  # Setup token
```

### Channels

```bash
openclaw channels status      # Channel status
openclaw channels login       # Channel login
openclaw channels add         # Add channel
openclaw pairing list         # Pairing list
openclaw pairing approve      # Approve pairing
```

### Automation

```bash
openclaw cron add             # Add cron
openclaw cron list            # List cron jobs
openclaw cron remove          # Remove cron
```

### Nodes

```bash
openclaw devices list         # List devices
openclaw devices approve      # Approve device
openclaw nodes status         # Node status
openclaw node run             # Start node host
```

### Sandbox

```bash
openclaw sandbox explain      # View settings
openclaw sandbox recreate     # Recreate sandbox
openclaw sandbox list         # List sandboxes
```

### Plugin

```bash
openclaw plugins install      # Install
openclaw plugins list         # List
openclaw plugins status       # Status
```

## Overall

This article serves as the reference index for the entire series. OpenClaw's feature coverage is extensive — from 24+ channels to 35+ model providers, from sandboxing to formal verification, from a Skills marketplace to a deterministic workflow engine. Most users will only need about 20% of these features, but knowing what's available is important.

## References

This article is compiled from the following OpenClaw source documents:

- [docs/reference/pi.md](https://github.com/openclaw/openclaw/blob/main/docs/reference/pi.md) — Pi integration
- [docs/concepts/features.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/features.md) — Feature list
- [docs/concepts/architecture.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/architecture.md) — Architecture
- [docs/gateway/configuration-reference.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/configuration-reference.md) — Configuration reference
- [docs/cli/index.md](https://github.com/openclaw/openclaw/blob/main/docs/cli/index.md) — CLI overview
