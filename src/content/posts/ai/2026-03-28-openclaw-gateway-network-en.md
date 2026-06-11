---
title: "OpenClaw Gateway (Part 2): Remote Access, Tailscale, and Multi-Gateway"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, gateway, remote-access, tailscale, ssh-tunnel, multi-gateway]
lang: en
tldr: "Gateway binds to loopback by default. Use SSH tunnel or Tailscale Serve/Funnel for remote access; multiple Gateways can distribute load."
description: "Remote access methods for OpenClaw Gateway (SSH Tunnel, Tailscale Serve/Funnel), TLS/HSTS configuration, and multi-Gateway architecture."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-gateway-network)

Gateway binds to loopback (127.0.0.1:18789) by default. This post covers how to securely access it remotely, as well as multi-Gateway architecture.

## Three Deployment Modes

### Mode 1: Always-on Gateway (VPS / Home Server)

Gateway runs on an always-on machine, accessed via Tailscale or SSH. Your laptop can sleep at any time.

### Mode 2: Desktop + Remote Laptop

Desktop runs the Gateway; laptop connects using Remote over SSH mode (the macOS app manages this automatically).

### Mode 3: Local Gateway + Remote Access

Gateway runs on your laptop, securely exposed via SSH tunnel or Tailscale Serve.

## SSH Tunnel

The simplest remote access method:

```bash
ssh -N -L 18789:127.0.0.1:18789 user@host
```

This allows local CLI commands like `openclaw health` to transparently connect to the remote Gateway.

## Tailscale Integration

OpenClaw can automatically configure Tailscale Serve or Funnel.

### Three Modes

| Mode | Scope | Description |
|---|---|---|
| `serve` | Within tailnet | Via `tailscale serve`; Gateway stays on loopback |
| `funnel` | Public internet | Via `tailscale funnel`; requires a shared password |
| `off` (default) | — | No Tailscale automation |

### Tailnet-only (Serve)

```json5
{
  gateway: {
    bind: "loopback",
    tailscale: { mode: "serve" },
  }
}
```

Access: `https://<magicdns>/`

### Serve + Tailscale Auth

When `gateway.auth.allowTailscale: true`, the Control UI can authenticate using Tailscale identity headers without requiring a token or password.

OpenClaw's verification process:
1. Confirm the request originates from loopback
2. Check for Tailscale's `x-forwarded-for`, `x-forwarded-proto`, `x-forwarded-host` headers
3. Resolve identity using `tailscale whois`
4. Match against headers

**Note:** HTTP API endpoints (`/v1/*`, `/tools/invoke`) still require token/password authentication.

### Public (Funnel + Password)

```json5
{
  gateway: {
    bind: "loopback",
    tailscale: { mode: "funnel" },
    auth: { mode: "password", password: "replace-me" },
  }
}
```

Funnel refuses to start without a password to prevent public exposure. It's recommended to use the `OPENCLAW_GATEWAY_PASSWORD` environment variable.

### Direct Tailnet Binding

Instead of using Serve/Funnel, bind directly to a Tailnet IP:

```json5
{
  gateway: {
    bind: "tailnet",
    auth: { mode: "token", token: "your-token" },
  }
}
```

**Note:** Loopback is not available in this mode.

### Tailscale Prerequisites

- Serve requires HTTPS enabled on the tailnet
- Funnel requires Tailscale v1.38.3+, MagicDNS, HTTPS, and the funnel node attribute
- Funnel only supports ports 443, 8443, and 10000
- Funnel on macOS requires the open-source Tailscale app

### CLI

```bash
openclaw gateway --tailscale serve
openclaw gateway --tailscale funnel --auth password
```

## Remote Browser Control

When the Gateway is on one machine and the browser on another: run a **node host** on the browser machine, with both on the same tailnet. The Gateway will proxy browser operations to the node.

## Security Principles

- **Loopback by default** — always the safest starting point
- Use SSH or Tailscale for access; never expose directly
- Plaintext `ws://` is restricted to loopback only
- Non-loopback binding requires token or password
- `gateway.tailscale.resetOnExit` can restore Tailscale settings on shutdown

## Multi-Gateway Architecture

For large deployments, you can run multiple Gateway instances, each responsible for different channels or agent groups. Configuration details are in the gateway-related documentation.

## Gateway API

The Gateway provides an HTTP API for programmatic interaction:

- `/v1/*` — Core API endpoints
- `/tools/invoke` — Tool invocation
- `/api/channels/*` — Channel operations
- WebSocket — Real-time communication

Token/password authentication is required.

## Summary

OpenClaw Gateway's network design follows a "secure by default, explicit exposure" philosophy. Loopback is the starting point, SSH tunnel is the simplest option, Tailscale Serve is the most convenient, and Funnel is for public access. Multiple Gateways enable scaling.

## References

This post is compiled from the following OpenClaw source documents:

- [docs/gateway/remote.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/remote.md) — Remote access
- [docs/gateway/tailscale.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/tailscale.md) — Tailscale integration
- [docs/gateway/security.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/security.md) — Gateway security
- [docs/gateway/api.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/api.md) — Gateway API
- [docs/gateway/multi-gateway.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/multi-gateway.md) — Multi-Gateway
