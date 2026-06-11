---
title: "OpenClaw Nodes Deep Dive: Mobile Devices and Remote Hosts"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, nodes, ios, android, macos, camera, canvas, location, sms]
lang: en
tldr: "Nodes are peripheral devices for the Gateway -- iOS/Android provide camera/location/notifications, macOS provides Canvas/system.run, and Node Host enables remote exec on other machines."
description: "Complete guide to OpenClaw Nodes: device pairing, Canvas/Camera/Location/SMS commands, Node Host remote execution, and Android personal data access."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-nodes-deep)

A Node is a peripheral device connected to the Gateway, providing capabilities the Gateway itself lacks -- camera, screen, location, notifications, and even remote command execution.

## Node Fundamentals

- A Node is a **peripheral**, not a Gateway -- it doesn't run the gateway service
- Connects to the Gateway via WebSocket (same port)
- Requires device pairing for authentication
- Messages are processed at the Gateway; the Node only provides capabilities

### Pairing

```bash
openclaw devices list               # List devices awaiting pairing
openclaw devices approve <requestId> # Approve
openclaw devices reject <requestId>  # Reject
openclaw nodes status                # Check node status
```

## Node Types

### iOS (Internal Preview)

Provides Camera, Canvas, Location, and Voice Wake capabilities. The easiest pairing method is through Telegram: send `/pair` to the bot, then paste the setup code into the iOS app.

### Android (Source Available)

The most capable Node -- in addition to Camera/Canvas/Location, it also offers:

| Command Family | Capabilities |
|---|---|
| `device.*` | status, info, permissions, health |
| `notifications.*` | list, actions |
| `photos.latest` | Recent photos |
| `contacts.*` | search, add |
| `calendar.*` | events, add |
| `callLog.search` | Call log search |
| `sms.*` | search, send (requires SMS permission) |
| `motion.*` | activity, pedometer |

### macOS Node Mode

The macOS menu bar app can function as a Node, providing Canvas and `system.run`.

### Headless Node Host

A UI-less node that runs on a remote machine, providing `system.run` and `system.which`.

## Canvas Commands

```bash
# Screenshot
openclaw nodes canvas snapshot --node <id> --format png

# Control
openclaw nodes canvas present --node <id> --target https://example.com
openclaw nodes canvas hide --node <id>
openclaw nodes canvas navigate https://example.com --node <id>
openclaw nodes canvas eval --node <id> --js "document.title"

# A2UI (JSONL push)
openclaw nodes canvas a2ui push --node <id> --text "Hello"
openclaw nodes canvas a2ui reset --node <id>
```

The Node must be in the foreground to use `canvas.*` and `camera.*`.

## Camera Commands

```bash
# Take photos
openclaw nodes camera list --node <id>
openclaw nodes camera snap --node <id>                    # Default: captures from both front and rear cameras
openclaw nodes camera snap --node <id> --facing front     # Front camera only

# Record video
openclaw nodes camera clip --node <id> --duration 10s
openclaw nodes camera clip --node <id> --duration 3000 --no-audio
```

Limitations:
- Maximum recording duration is 60 seconds
- Android requires CAMERA/RECORD_AUDIO permissions
- Background calls return `NODE_BACKGROUND_UNAVAILABLE`

## Screen Recording

```bash
openclaw nodes screen record --node <id> --duration 10s --fps 10
openclaw nodes screen record --node <id> --duration 10s --no-audio
```

## Location

```bash
openclaw nodes location get --node <id>
openclaw nodes location get --node <id> --accuracy precise --max-age 15000
```

- Disabled by default
- Returns lat/lon, accuracy (in meters), and timestamp
- "Always" access requires system-level permission

## Node Host (Remote Execution)

When the Gateway runs on one machine but you need exec on another -- use Node Host.

### Starting

```bash
# Foreground
openclaw node run --host <gateway-host> --port 18789 --display-name "Build Node"

# Via SSH tunnel (when bound to loopback)
ssh -N -L 18790:127.0.0.1:18789 user@gateway-host
OPENCLAW_GATEWAY_TOKEN="<token>" openclaw node run --host 127.0.0.1 --port 18790

# Install as a service
openclaw node install --host <gateway-host> --port 18789 --display-name "Build Node"
```

### Configuring exec to Target a Node

```bash
openclaw config set tools.exec.host node
openclaw config set tools.exec.security allowlist
openclaw config set tools.exec.node "<id-or-name>"
```

Or per-session:
```
/exec host=node security=allowlist node=Build-Node
```

### Allowlist

```bash
openclaw approvals allowlist add --node <id> "/usr/bin/uname"
openclaw approvals allowlist add --node <id> "/usr/bin/sw_vers"
```

Approvals are bound to specific request contexts. If a command involves local files, OpenClaw binds that file to the approval -- if the file changes, execution is denied.

## System Commands

```bash
openclaw nodes run --node <id> -- echo "Hello from node"
openclaw nodes notify --node <id> --title "Ping" --body "Gateway ready"
```

`system.run` returns stdout/stderr/exit code.

## The Big Picture

Nodes let OpenClaw go beyond plain text chat -- your phone becomes the agent's eyes (Camera) and hands (SMS, Contacts), while remote hosts become the agent's compute resources (Node Host). All interactions are routed through the Gateway, and approvals ensure security.

## References

This article is compiled from the following OpenClaw source documents:

- [docs/nodes/index.md](https://github.com/openclaw/openclaw/blob/main/docs/nodes/index.md) -- Nodes overview
- [docs/nodes/camera.md](https://github.com/openclaw/openclaw/blob/main/docs/nodes/camera.md) -- Camera commands
- [docs/nodes/audio.md](https://github.com/openclaw/openclaw/blob/main/docs/nodes/audio.md) -- Audio commands
- [docs/nodes/voicewake.md](https://github.com/openclaw/openclaw/blob/main/docs/nodes/voicewake.md) -- Voice Wake
- [docs/nodes/location-command.md](https://github.com/openclaw/openclaw/blob/main/docs/nodes/location-command.md) -- Location commands
- [docs/nodes/troubleshooting.md](https://github.com/openclaw/openclaw/blob/main/docs/nodes/troubleshooting.md) -- Nodes troubleshooting
- [docs/platforms/ios.md](https://github.com/openclaw/openclaw/blob/main/docs/platforms/ios.md) -- iOS
- [docs/platforms/android.md](https://github.com/openclaw/openclaw/blob/main/docs/platforms/android.md) -- Android
- [docs/cli/node.md](https://github.com/openclaw/openclaw/blob/main/docs/cli/node.md) -- Node CLI
