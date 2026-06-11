---
title: "OpenClaw Desktop Platforms: macOS, Linux, and Windows"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, macos, linux, windows, wsl2, systemd, launchd]
lang: en
tldr: "OpenClaw has a menu bar app on macOS, runs as a systemd service on Linux, and recommends WSL2 on Windows. Here are the differences and considerations across all three platforms."
description: "Installation differences, service management, Node capabilities, and limitations of OpenClaw across macOS, Linux, and Windows desktop platforms."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-platforms-desktop)

OpenClaw's core is TypeScript, and Node.js is the recommended runtime (Bun is not recommended for Gateway due to compatibility issues with WhatsApp and Telegram). However, the experience differs significantly across the three desktop platforms. This post summarizes each platform's characteristics.

## macOS

macOS offers the most complete OpenClaw experience, with a dedicated menu bar companion app.

### Menu Bar App

It's more than just a Gateway launcher — it is itself a **Node** that exposes macOS system capabilities to AI agents:

- **Canvas** — screenshots, navigation, JavaScript execution, A2UI push
- **Camera** — front/rear camera photos, video clips
- **Screen Recording** — MP4 recording
- **system.run** — execute commands on macOS (with an approval mechanism)
- **Notifications** — native notifications

### Operating Modes

**Local Mode (default):** Connects to the local Gateway, or automatically starts a launchd service.

**Remote Mode:** Connects to a remote Gateway (via SSH/Tailscale) while starting a local node host, allowing the remote Gateway to call your Mac's camera, canvas, and other capabilities.

### Security and Exec Approvals

`system.run` execution is controlled by `~/.openclaw/exec-approvals.json`, supporting allowlists, per-invocation approval, and filtering of dangerous environment variables.

### Deep Links

Registers the `openclaw://` URL scheme, which can carry parameters like `message` and `sessionKey`, suitable for automation scenarios.

### Notes

- The state directory `~/.openclaw` should not be placed in an iCloud sync path
- Gateway service is managed via launchd (LaunchAgent)

## Linux

Linux fully supports the Gateway but has no dedicated companion app (community development is underway).

### Service Management

The default is **systemd user service**. Three installation options:

```bash
openclaw onboard --install-daemon
openclaw gateway install
openclaw configure
```

For shared or always-on scenarios, you can switch to a system service:

```ini
# Create a systemd service unit
[Unit]
Description=OpenClaw Gateway

[Service]
ExecStart=/usr/bin/openclaw gateway
Restart=always
RestartSec=2

[Install]
WantedBy=default.target
```

### Quick VPS Setup

```bash
# Install Node 24
# npm i -g openclaw@latest
# openclaw onboard --install-daemon
# SSH tunnel to access Control UI locally
ssh -L 18789:127.0.0.1:18789 user@your-vps
```

### Diagnostics

`openclaw doctor` can check for configuration issues and perform automatic migrations.

## Windows

Windows supports two paths: WSL2 (recommended) and native Windows.

### WSL2 (Recommended)

WSL2 provides a full Linux environment where the CLI, Gateway, and all tools run inside Linux — the most stable path.

Installation is the same as Linux.

**LAN Access Note:** WSL uses a virtual network, so accessing it from the LAN requires port forwarding — forwarding a Windows port to the WSL IP. The WSL IP may change after a restart.

**Pre-login Startup (Headless):**
1. Enable WSL user service persistence
2. Install the gateway user service
3. Use a Windows Scheduled Task to automatically start WSL

### Native Windows

Functionality is continuously improving, but it remains a secondary path.

**Available:** Installation (PowerShell script), basic CLI commands, local agent/provider.

**Limitations:**
- Onboarding defaults to connecting to a local Gateway; otherwise requires `--skip-health`
- Service installation first attempts Windows Scheduled Task, falling back to the Startup folder on failure
- `schtasks` aborts quickly when unresponsive instead of hanging
- No companion app (planned)

## Service Management Comparison

| Platform | Service Mechanism | Command |
|---|---|---|
| macOS | launchd (LaunchAgent) | `launchctl` |
| Linux | systemd user service | `systemctl --user` |
| Windows (WSL2) | systemd (inside WSL) | `systemctl --user` |
| Windows (Native) | Scheduled Task or Startup | `schtasks` |

## Node Capability Comparison

| Feature | macOS App | Linux | Windows |
|---|---|---|---|
| Gateway | ✅ | ✅ | ✅ (WSL2) / ⚠️ (Native) |
| Canvas | ✅ | ❌ | ❌ |
| Camera | ✅ | ❌ | ❌ |
| Screen Recording | ✅ | ❌ | ❌ |
| system.run | ✅ | ✅ (CLI) | ✅ (WSL2) |
| Companion App | ✅ Menu Bar | ❌ In Development | ❌ Planned |
| Deep Links | ✅ `openclaw://` | ❌ | ❌ |

## Overall Summary

macOS provides the most complete experience with its companion app and Node capabilities. Linux is the most stable for running the Gateway and is ideal for server deployments. For Windows, WSL2 is the way to go — native support is still improving. If you want to deploy the Gateway remotely on Linux, you can pair it with a macOS or iOS Node, leveraging the best of both worlds.

## References

This post is compiled from the following OpenClaw source documents:

- [docs/platforms/index.md](https://github.com/openclaw/openclaw/blob/main/docs/platforms/index.md) — Platform overview
- [docs/platforms/macos.md](https://github.com/openclaw/openclaw/blob/main/docs/platforms/macos.md) — macOS platform
- [docs/platforms/linux.md](https://github.com/openclaw/openclaw/blob/main/docs/platforms/linux.md) — Linux platform
- [docs/platforms/windows.md](https://github.com/openclaw/openclaw/blob/main/docs/platforms/windows.md) — Windows platform
- [docs/platforms/mac/](https://github.com/openclaw/openclaw/tree/main/docs/platforms/mac) — macOS App subdirectory
