---
title: "OpenClaw Gateway, Part 2: Binding, Auth, and That Credential Precedence Contract"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, gateway, remote-access, tailscale, ssh-tunnel, authentication, bonjour]
lang: en
series:
  name: "Reading the OpenClaw Docs"
  order: 27
tldr: "The Gateway binds to loopback by default, and binding anywhere else requires auth — that is enforced, not advised. Inside a detected container the effective default is auto, unless Tailscale serve/funnel is active, which always forces loopback."
description: "The network side of the OpenClaw Gateway: bind modes and port precedence, the auth requirement for non-loopback binds, SSH tunnels and Tailscale, remote mode config, the credential precedence contract, and multi-gateway plus Bonjour discovery."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-gateway-network)

One Gateway owns sessions, auth profiles, channels, and state; **everything else is a client** — including the macOS app's "node mode," which is just a node client over the Gateway WebSocket.

This article covers reaching it from outside, and the rules that will stop you along the way.

## Binding: loopback by default, auto in containers

The Gateway WebSocket binds to **loopback** by default on port `18789`. One exception is worth knowing: **inside a detected container environment the effective default is `auto`** (resolving to `0.0.0.0` for port forwarding) — unless Tailscale serve/funnel is active, which **always forces loopback**.

Port and bind resolution:

| Setting | Order |
|---|---|
| Port | `--port` → `OPENCLAW_GATEWAY_PORT` → `gateway.port` → `18789` |
| Bind mode | CLI/override → `gateway.bind` → `loopback` (`auto` in containers) |

A practical trap: **installed gateway services record the resolved `--port` in supervisor metadata.** So after changing `gateway.port`, run `openclaw doctor --fix` or `openclaw gateway install --force` so launchd/systemd/schtasks starts the process on the new port.

## Non-loopback binds require auth

This is enforced, not advised:

> **Non-loopback binds** (`lan`/`tailnet`/`custom`, or `auto` when loopback is unavailable) **must use Gateway auth**: token, password, or an identity-aware reverse proxy with `gateway.auth.mode: "trusted-proxy"`.

The CLI page puts it even more bluntly: **binding beyond loopback without auth is blocked.**

The transport has rules too: **plaintext `ws://` is accepted for loopback, private/LAN (RFC 1918), link-local, CGNAT, `.local`, and `.ts.net` hosts. Public remote hosts must use `wss://`.**

And an easy misunderstanding: `gateway.remote.token` / `.password` are **client credential sources — they do not configure server auth by themselves.**

## Three topologies

| Setup | Where the Gateway runs | Best for |
|---|---|---|
| Always-on in your tailnet | A persistent host (VPS or home server), reached via Tailscale or SSH | Laptops that sleep but need an always-on agent |
| Home desktop | The desktop; the laptop connects through the macOS app's remote mode | Keeping the agent on hardware that stays powered |
| Laptop | The laptop, exposed via SSH tunnel or Tailscale Serve (keep `bind: "loopback"`) | Single-machine setups |

For the first two, the docs recommend **keeping the loopback bind**, serving the Control UI over Tailscale Serve, or using a trusted LAN/Tailnet bind with `gateway.remote.transport: "direct"`. **The SSH tunnel is the fallback that works from any machine:**

```bash
ssh -N -L 18789:127.0.0.1:18789 user@gateway-host
```

With the tunnel up, `openclaw health` and `openclaw status --deep` reach the remote Gateway over `ws://127.0.0.1:18789`.

One safety design to remember: **`--url` never falls back to config or environment credentials.** Pass `--token` or `--password` explicitly, or the client sends nothing and the connection fails against a Gateway that requires auth.

## The credential precedence contract

This is the passage most worth copying down, because "why did it use that credential" is not something you can guess:

**Local mode defaults:**
- token: `gateway.auth.token` → `OPENCLAW_GATEWAY_TOKEN` → `gateway.remote.token` (the remote fallback applies only when the local token is unset)
- password: the same shape

**Remote mode defaults:**
- token: `gateway.remote.token` → `OPENCLAW_GATEWAY_TOKEN` → `gateway.auth.token`
- password: `OPENCLAW_GATEWAY_PASSWORD` → `gateway.remote.password` → `gateway.auth.password`

**URL override safety:** the CLI's `--url` never reuses implicit credentials; the `OPENCLAW_GATEWAY_URL` env var may use **environment credentials only**.

**The node-host local-mode exception:** environment credentials stay first and `gateway.remote.*` is ignored, because node commands target an explicit host and port.

And a SecretRef rule: remote startup, status, and wizard probes treat configured `gateway.remote.token` / `password` as **authoritative for that target**, considering ambient environment credentials only when neither is configured. **If a configured remote SecretRef cannot be resolved, the probe warns and does not fall back to environment credentials** — deliberate fail-closed behavior.

## Tailscale and a stable HTTPS URL

To replace per-client SSH tunnels with a single private `wss://` endpoint while keeping the Gateway on loopback, the docs have a dedicated page: [Give your Gateway a stable HTTPS URL](https://docs.openclaw.ai/gateway/stable-https-url).

For Docker deployments: Serve/Funnel modes require the gateway to bind loopback next to `tailscaled`, which **bridge networking with published ports cannot satisfy** — run with `network_mode: host` and mount the host's `tailscaled` socket (`/var/run/tailscale`) plus the `tailscale` CLI into the container.

## Multiple gateways and discovery

**Only one Gateway should run per host** unless you intentionally run isolated profiles. Service labels reflect this: the default profile is `ai.openclaw.gateway`, named profiles are `ai.openclaw.<profile>`.

**Bonjour discovery**: `openclaw gateway discover` scans for `_openclaw-gw._tcp` beacons across multicast `local.` plus any configured wide-area DNS-SD domain. Only gateways with discovery enabled (the default) advertise.

Beacon TXT hints carry `role`, `transport`, `gatewayPort`, `tailnetDns`, `gatewayTls` and a certificate fingerprint. **`sshPort` and `cliPath` are published only in full discovery mode** (`discovery.mdns.mode: "full"`) — the `"minimal"` default omits them, and clients then default SSH targets to port 22.

## Operator commands

```bash
openclaw gateway status
openclaw gateway status --deep   # adds a system-level service scan
openclaw gateway restart
openclaw secrets reload
openclaw logs --follow
openclaw doctor
```

Two notes: **`--deep` is for extra service discovery** (LaunchDaemons, systemd system units, schtasks), **not a deeper RPC health probe.** And **use `openclaw gateway restart` for restarts — do not chain `stop` and `start` as a substitute.**

At the service level there is one more switch: `SIGUSR1` triggers an in-process restart when authorized, and `commands.restart` (enabled by default) gates externally-sent `SIGUSR1` — set it to `false` to block manual OS-signal restarts. **The agent-facing `gateway` tool is read-only**; agents request a restart through the human-approved `openclaw` delegation tool.

## Incidentally, the Gateway is itself an OpenAI-compatible endpoint

On the same multiplexed port as the WebSocket control/RPC, it also serves HTTP APIs: `/v1/models`, `/v1/embeddings`, `/v1/chat/completions`, `/v1/responses`, `/tools/invoke`, plus plugin HTTP routes, the Control UI, and hooks.

The docs call this "OpenClaw's highest-leverage compatibility surface" — meaning you can point another system at the whole Gateway as an OpenAI-compatible backend, with a full agent loop, tools, and sessions sitting behind it.

## The big picture

The network layer follows one line consistently: **closed by default, and every step toward open requires an explicit statement from you.** Loopback is the default, non-loopback forces auth, public hosts force TLS, `--url` inherits nothing, and an unresolvable remote SecretRef does not silently fall back to the environment.

That is also why the credential precedence contract is worth one careful read — when it "used a different credential than you expected," the answer is almost always in that ordering.

## Changelog

- 2026-08-18: Substantially revised against the current official docs. Added: the container-effective `auto` bind default (with Tailscale serve/funnel forcing loopback), the full port and bind resolution order, the need for `doctor --fix` or `gateway install --force` after changing `gateway.port`, **the enforced auth requirement for non-loopback binds** and the host whitelist for plaintext `ws://`, the three recommended topologies, **the complete credential precedence contract** (local and remote ordering, `--url` inheriting nothing, the node-host exception, and remote SecretRef failures not falling back to the environment), the `network_mode: host` requirement for Tailscale Serve under Docker, Bonjour discovery and how `discovery.mdns.mode` gates `sshPort`/`cliPath`, what `gateway status --deep` actually does, why stop+start is not a restart, `commands.restart` and the read-only agent-facing `gateway` tool, and the OpenAI-compatible endpoints served on the Gateway's multiplexed port.

## References

This article draws on the following official OpenClaw documentation:

- [Remote access](https://docs.openclaw.ai/gateway/remote) — topologies, SSH tunnels, remote mode, credential precedence
- [Gateway runbook](https://docs.openclaw.ai/gateway/) — bind and port resolution, operator commands, OpenAI-compatible endpoints
- [Gateway CLI](https://docs.openclaw.ai/cli/gateway) — startup guards, options, Bonjour discovery
- [Tailscale](https://docs.openclaw.ai/gateway/tailscale), [Stable HTTPS URL](https://docs.openclaw.ai/gateway/stable-https-url) — a private `wss://` endpoint
- [Multiple gateways](https://docs.openclaw.ai/gateway/multiple-gateways) — multiple instances and profile isolation
