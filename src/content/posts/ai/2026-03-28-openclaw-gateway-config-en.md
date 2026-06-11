---
title: "OpenClaw Gateway Part 1: Configuration System and Hot Reload"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, gateway, configuration, json5, hot-reload, openclaw-json]
lang: en
tldr: "openclaw.json uses JSON5 format with strict schema validation, supporting hybrid hot reload — safe changes apply instantly while critical changes trigger automatic restarts."
description: "OpenClaw Gateway's configuration system: JSON5 format, four configuration methods, strict schema validation, and Hybrid Hot Reload."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-gateway-config)

All OpenClaw behavior is controlled by a single configuration file. This post covers the design and usage of the configuration system.

## Configuration File

`~/.openclaw/openclaw.json`, in JSON5 format. Falls back to safe defaults when the file does not exist.

### Four Configuration Methods

| Method | Description |
|---|---|
| `openclaw onboard` | Interactive wizard, ideal for beginners |
| `openclaw config set` | Single-line CLI configuration |
| Control UI | Browser at `http://127.0.0.1:18789` |
| Edit file directly | Changes are auto-detected |

### Strict Validation

OpenClaw only accepts configurations that fully conform to the schema. Unknown keys, type errors, or invalid values cause the Gateway to refuse to start.

```bash
openclaw doctor      # Diagnose issues
openclaw doctor --fix  # Attempt auto-fix
```

### Minimal Configuration Example

```json5
{
  agents: {
    defaults: {
      workspace: "~/openclaw-workspace"
    }
  },
  channels: {
    whatsapp: {
      dmPolicy: "allowlist",
      allowFrom: ["+15551234567"]
    }
  }
}
```

## Main Configuration Sections

| Section | Covers |
|---|---|
| Channels | Channel connections, access control |
| Models | Model selection, failover |
| Agents | Workspace, sandbox, tools |
| Session | DM scope, lifecycle |
| Automation | Cron, heartbeat, webhook |
| Gateway | Binding, authentication, networking |
| Secrets | SecretRef provider |
| Skills | Loading, overrides |

## Hot Reload

Configuration changes are applied automatically without manual restarts.

### Hybrid Mode (Default)

| Type | Behavior |
|---|---|
| Safe changes | Instant hot apply (channel settings, models, tools, etc.) |
| Critical changes | Automatic restart (Gateway server settings) |

Most settings update without downtime. Only gateway server-related settings require a restart.

### Environment Variables

You can set environment variables in `~/.openclaw/.env`, which are read when the daemon starts.

```bash
# ~/.openclaw/.env
ANTHROPIC_API_KEY=sk-...
OPENCLAW_GATEWAY_TOKEN=my-token
```

`$OPENCLAW_STATE_DIR` can override the state directory location.

## Gateway Core Settings

### Binding

```json5
{
  gateway: {
    bind: "loopback",    // loopback | lan | tailnet | auto | custom
    port: 18789,         // default
  }
}
```

| Bind | Description |
|---|---|
| `loopback` | Only accessible from localhost (default, most secure) |
| `lan` | Accessible from local network |
| `tailnet` | Tailscale IP |
| `auto` | Prefers loopback |

### Authentication

Non-loopback bindings require authentication:

```json5
{
  gateway: {
    auth: {
      mode: "token",      // token | password | trusted-proxy
      token: "your-token"
    }
  }
}
```

Or use environment variables:
- `OPENCLAW_GATEWAY_TOKEN`
- `OPENCLAW_GATEWAY_PASSWORD`

### Control UI

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

## Configuration Tools

```bash
openclaw config get agents.defaults.workspace     # Read
openclaw config set channels.telegram.enabled true  # Set
openclaw config list                                # List all
openclaw config validate                            # Validate
```

## Summary

OpenClaw's configuration system has three key characteristics: JSON5 format makes configs readable and commentable, strict schema validation prevents misconfigurations, and Hybrid Hot Reload allows most changes to take effect without restarts.

## References

This post is compiled from the following OpenClaw source documents:

- [docs/gateway/configuration.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/configuration.md) — Configuration overview
- [docs/gateway/configuration-reference.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/configuration-reference.md) — Configuration reference
- [docs/gateway/configuration-examples.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/configuration-examples.md) — Configuration examples
- [docs/gateway/heartbeat.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/heartbeat.md) — Heartbeat configuration
- [docs/help.md](https://github.com/openclaw/openclaw/blob/main/docs/help.md) — Environment variables and .env
