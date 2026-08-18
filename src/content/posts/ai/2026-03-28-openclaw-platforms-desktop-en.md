---
title: "OpenClaw Desktop Platforms: Windows Now Has a Native Hub, and Node Is Non-Negotiable"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, macos, linux, windows, wsl2, windows-hub, platforms]
lang: en
series:
  name: "Reading the OpenClaw Docs"
  order: 4
tldr: "Node is the required runtime because the canonical state store uses node:sqlite — Bun is only for installing dependencies. Windows changed the most: there is now a native Windows Hub companion app that installs without administrator privileges and can provision its own app-owned WSL distro for the Gateway."
description: "OpenClaw support across macOS, Linux, and Windows: the hard Node runtime requirement, Windows Hub's three roles, choosing among the three Windows paths, and the service install targets per OS."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-platforms-desktop)

OpenClaw core is TypeScript, and one hard requirement comes first:

> **Node is the required runtime** because the canonical state store uses `node:sqlite`. Bun remains available for dependency installation and package scripts.

So Bun is the package manager here, not the runtime — consistent with what the installation article said.

## Windows: pick one of three paths

Windows changed most this cycle, and now offers three distinctly different uses:

| Path | Best for | Notes |
|---|---|---|
| **Windows Hub** | Wanting a desktop app | Native WinUI app with setup, tray status, chat, diagnostics, and Windows node capabilities |
| **Native PowerShell install** | Terminal-first | Installs the CLI and Gateway directly |
| **WSL2** | The most Linux-compatible Gateway runtime | Best compatibility |

### Windows Hub deserves its own section

It is a native WinUI companion app for Windows 10 20H2+ and Windows 11 that **installs without administrator privileges**, shipping signed x64 and ARM64 installers.

One release-cadence detail matters: **Windows Hub publishes independently from the OpenClaw CLI and Gateway.** Regular stable releases mirror a pinned, release-validated Hub build, **but that mirror can lag a newer standalone Hub release.**

What it includes: tray status and launch-at-login, **first-run setup for a local app-owned WSL Gateway**, connection settings for local/remote/SSH-tunneled Gateways, a native chat window plus access to the browser Control UI, Command Center diagnostics covering sessions, usage, channels, nodes, pairing, and repair commands, plus **Windows node mode** and **local MCP server mode**.

On first launch the fastest path is **Set up locally**, which provisions an **app-owned `OpenClawGateway` WSL distro**, installs the Gateway inside it, and pairs the app. The docs note explicitly: **this does not export or mutate your existing Ubuntu distro.**

### The Hub's three roles compose

| Node mode | MCP server | Behavior |
|---|---|---|
| off | off | Operator-only desktop app |
| on | off | Gateway-connected Windows node |
| off | on | Local MCP server only |
| on | on | Gateway node plus local MCP server |

**Local MCP mode** has a specific purpose: exposing the same Windows-native capability registry as a loopback MCP server, so **local MCP clients like Claude Desktop, Claude Code, and Cursor can drive Windows capabilities without a running OpenClaw Gateway.**

Node mode covers Canvas, Screen, Camera, System (including `system.run`), Device, and Talk command families — but **the Gateway only forwards commands the node declares and server policy allows.** Privacy-sensitive commands such as `screen.record`, `camera.snap`, and `camera.clip` need explicit `gateway.nodes.commands.allow` opt-in.

## macOS and Linux

**macOS** has a menu bar app that can also run in **node mode** — connecting to the Gateway's WS server as one node and adding native Canvas, camera, screen, notification, and computer-control commands to the node-host command surface.

**One thing not to do**: **do not start a second CLI node on that Mac.** The app already runs the matching CLI node-host runtime as an internal worker and **remains the sole Gateway connection and node identity.**

**Linux** companion apps are **planned**, but **the Gateway is fully supported today**.

## Service install: four ways, three targets

Four supported paths to installing the Gateway service:

```bash
openclaw onboard --install-daemon   # wizard (recommended)
openclaw gateway install            # direct
openclaw configure                  # select Gateway service
openclaw doctor                     # offers to install or fix the service
```

The target depends on the OS:

| OS | Target |
|---|---|
| macOS | LaunchAgent (`ai.openclaw.gateway`, or `ai.openclaw.<profile>` for a named profile) |
| Linux / WSL2 | systemd user service (`openclaw-gateway[-<profile>].service`) |
| Native Windows | **Scheduled Task** (`OpenClaw Gateway`), **falling back to a per-user Startup-folder login item if task creation is denied** |

A Windows implementation detail worth knowing: the task keeps the **readable `gateway.cmd` script** in the state dir but launches it through a generated **`gateway.vbs` WScript wrapper**, so **the background Gateway does not open a visible console window.**

## One Windows-specific gotcha

The Control UI article covers this too, but flag it here: **on native Windows LAN binds, Windows Firewall or organization-managed Group Policy can still block the advertised LAN URL even when `127.0.0.1` works on the Gateway host.**

Diagnose on the Windows host with:

```powershell
openclaw gateway status --deep
```

It reports likely-blocked ports, profile mismatches, and **local firewall rules that policy may ignore.**

## The big picture

Choosing a desktop platform now really answers **"do you want an app or a terminal"**: Windows Hub and the macOS menu bar app give you tray status, native chat, and node capabilities; the PowerShell or CLI install gives you direct Gateway control; WSL2 gives you the closest thing to a Linux runtime.

Whichever you pick, Node is required — a constraint imposed by `node:sqlite`, not a preference.

## Changelog

- 2026-08-18: Substantially revised against the current official docs. Added: **Node as the required runtime (because of `node:sqlite`) with Bun limited to dependency installation**, **the native Windows Hub companion app** (WinUI, no admin required, signed x64/ARM64, published independently with a possibly lagging mirror, and able to provision an app-owned `OpenClawGateway` WSL distro without touching an existing Ubuntu), **the Hub's composable node and local-MCP modes** plus the opt-in requirement for privacy-sensitive commands, the three Windows paths, the macOS menu bar app's node mode and the "do not start a second CLI node" warning, Linux companion apps still being planned while the Gateway is fully supported, **the four service install methods and three OS targets** (including the `gateway.vbs` wrapper avoiding a console window and the Startup-folder fallback), and diagnosing blocked Windows LAN binds with `gateway status --deep`.

## References

This article draws on the following official OpenClaw documentation:

- [Platforms](https://docs.openclaw.ai/platforms/) — platform support and service install targets
- [Windows](https://docs.openclaw.ai/platforms/windows) — Windows Hub, native CLI, WSL2, node mode
- [macOS](https://docs.openclaw.ai/platforms/macos) — the menu bar app
- [Linux](https://docs.openclaw.ai/platforms/linux) — running the Gateway on Linux
- [Nodes](https://docs.openclaw.ai/nodes/) — node command policy and pairing
