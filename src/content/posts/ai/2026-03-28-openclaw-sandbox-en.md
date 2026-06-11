---
title: "OpenClaw Sandbox Mechanism: Docker, SSH, and OpenShell"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, sandbox, docker, ssh, openshell, security, tool-policy, elevated]
lang: en
tldr: "OpenClaw's sandbox has three layers of control: Sandbox determines where code runs (Docker/SSH/OpenShell), Tool Policy determines which tools are available, and Elevated is the host escape hatch for exec."
description: "A complete guide to OpenClaw's sandbox mechanism: three backends (Docker/SSH/OpenShell), three layers of control (Sandbox/Tool Policy/Elevated), workspace access modes, and security configuration."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-sandbox)

OpenClaw can run tool execution inside a sandbox, reducing the blast radius when the model "does something dumb." This post covers the three sandbox backends, the three layers of control, and how they relate to each other.

## Three-Layer Control Model

OpenClaw has three related but distinct security controls:

| Control | Function | Config Path |
|---|---|---|
| **Sandbox** | Determines **where tools run** | `agents.defaults.sandbox.*` |
| **Tool Policy** | Determines **which tools are available** | `tools.*` / `tools.sandbox.tools.*` |
| **Elevated** | **Host escape hatch** for exec | `tools.elevated.*` |

These three layers are independent. Tool Policy is a hard constraint -- even with a sandbox enabled, denied tools remain unusable. Elevated only affects `exec` and does not grant additional tools.

### Diagnostic Tool

```bash
openclaw sandbox explain
openclaw sandbox explain --session agent:main:main
openclaw sandbox explain --agent work
openclaw sandbox explain --json
```

This prints the effective sandbox mode, tool allow/deny lists, elevated gates, and where each setting originates from.

## Sandbox Mode

`agents.defaults.sandbox.mode` controls **when** the sandbox is activated:

| Mode | Behavior |
|---|---|
| `"off"` | No sandbox; everything runs on the host |
| `"non-main"` | Only non-main sessions enter the sandbox (groups and channels count as non-main) |
| `"all"` | All sessions enter the sandbox |

**Common misconception:** `"non-main"` checks `session.mainKey`, not the agent ID. Group/channel session keys are not `main`, so they get sandboxed.

## Sandbox Scope

`agents.defaults.sandbox.scope` controls the number of containers:

| Scope | Behavior |
|---|---|
| `"session"` | One container per session (default) |
| `"agent"` | One container per agent |
| `"shared"` | All sandboxed sessions share a single container |

## Three Backends

### Docker (Default)

Local containers with full isolation.

```json5
{
  agents: {
    defaults: {
      sandbox: {
        mode: "non-main",
        scope: "session",
        workspaceAccess: "none",
      }
    }
  }
}
```

Default image: `openclaw-sandbox:bookworm-slim`, built with `scripts/sandbox-setup.sh`. If you need additional tools (curl, jq, Node, Python), use `scripts/sandbox-common-setup.sh` to build `openclaw-sandbox-common:bookworm-slim`.

Security defaults:
- **Network is off by default** (`docker.network` defaults to `"none"`)
- `network: "host"` is blocked
- `network: "container:<id>"` is blocked by default (namespace join bypass risk); requires `dangerouslyAllowContainerNamespaceJoin: true` to enable

### SSH

Runs the sandbox on a remote SSH host.

```json5
{
  agents: {
    defaults: {
      sandbox: {
        mode: "all",
        backend: "ssh",
        ssh: {
          target: "user@gateway-host:22",
          workspaceRoot: "/tmp/openclaw-sandboxes",
          identityFile: "~/.ssh/id_ed25519",
        }
      }
    }
  }
}
```

SSH uses a **remote-primary model** -- the workspace is seeded from local to remote on first use, and all subsequent operations happen on the remote. `openclaw sandbox recreate` re-seeds the workspace.

Supported authentication credentials:
- Local files (`identityFile`, `certificateFile`, `knownHostsFile`)
- SecretRef / inline strings (`identityData`, `certificateData`, `knownHostsData`) -- written to `0600` temp files that are deleted when the SSH session ends
- When both are set, `*Data` takes priority

### OpenShell

Managed remote sandbox using the OpenShell plugin.

```json5
{
  agents: {
    defaults: {
      sandbox: {
        mode: "all",
        backend: "openshell",
      }
    }
  },
  plugins: {
    entries: {
      openshell: {
        enabled: true,
        config: {
          from: "openclaw",
          mode: "remote",  // mirror | remote
        }
      }
    }
  }
}
```

OpenShell has two workspace modes:

| Mode | Primary copy location | Sync behavior | Best for |
|---|---|---|---|
| `mirror` | Local | Bidirectional sync before and after each exec | Using the sandbox as a temporary execution environment |
| `remote` | Remote | Seeded once, no sync back | Using the sandbox as the primary workspace |

### Backend Comparison

| | Docker | SSH | OpenShell |
|---|---|---|---|
| Where it runs | Local container | Any SSH host | OpenShell managed |
| Setup | `sandbox-setup.sh` | SSH key + target host | OpenShell plugin |
| Workspace | Bind-mount or copy | Remote primary (seeded once) | mirror or remote |
| Browser sandbox | Yes | No | No (not yet supported) |
| Bind mount | `docker.binds` | N/A | N/A |

## Workspace Access

`workspaceAccess` controls what the sandbox can see:

| Mode | Behavior |
|---|---|
| `"none"` (default) | Sees an isolated workspace under `~/.openclaw/sandboxes` |
| `"ro"` | Agent workspace mounted at `/agent` (read-only, write/edit disabled) |
| `"rw"` | Agent workspace mounted at `/workspace` (read-write) |

## Bind Mounts (Docker)

`docker.binds` mounts host directories into the container:

```json5
{
  sandbox: {
    docker: {
      binds: ["/home/user/source:/source:ro", "/var/data:/data:ro"]
    }
  }
}
```

**Security notes:**
- Binds **punch through** the sandbox filesystem -- whatever you mount becomes visible
- OpenClaw blocks dangerous sources: `docker.sock`, `/etc`, `/proc`, `/sys`, `/dev`
- Secret mounts should use `:ro`
- Global and per-agent binds are **merged** (not replaced)
- Under `scope: "shared"`, per-agent binds are ignored

## Tool Policy

Two layers of tool control:

**Global / Per-agent:**
- `tools.profile` -- base allowlist
- `tools.allow` / `tools.deny` -- global rules
- `tools.byProvider[provider].allow/deny` -- per-provider rules

**Sandbox-specific:**
- `tools.sandbox.tools.allow` / `tools.sandbox.tools.deny`

Rule: `deny` always wins. If `allow` is non-empty, everything else is treated as blocked.

### Tool Groups

Tool policy supports group shorthands:

| Group | Included tools |
|---|---|
| `group:runtime` | exec, bash, process |
| `group:fs` | read, write, edit, apply_patch |
| `group:sessions` | sessions_list, sessions_history, sessions_send, sessions_spawn, session_status |
| `group:memory` | memory_search, memory_get |
| `group:ui` | browser, canvas |
| `group:automation` | cron, gateway |
| `group:messaging` | message |
| `group:nodes` | nodes |
| `group:openclaw` | All built-in tools (excluding plugins) |

## Elevated: Host Escape Hatch

Elevated does **not** grant additional tools; it only affects `exec`:

- `/elevated on` -- exec inside the sandbox runs on the host instead (still requires approval)
- `/elevated full` -- skips exec approval
- When already on the host, elevated is a no-op

Gates:
- `tools.elevated.enabled` -- enable the feature
- `tools.elevated.allowFrom.<provider>` -- sender allowlist

**Note:** `/exec` and elevated are different. `/exec` only adjusts the per-session exec defaults and does not grant tool access.

## setupCommand

`setupCommand` runs once after the container is created (not on every exec):

```json5
{
  sandbox: {
    docker: {
      setupCommand: "apt-get update && apt-get install -y nodejs"
    }
  }
}
```

Common pitfalls:
- No network by default -- package installation will fail
- `readOnlyRoot: true` -- writes will fail
- Root privileges are needed to install packages
- Sandbox exec does not inherit the host's `process.env`

## Browser Sandbox

The Docker backend supports a dedicated browser sandbox container:

```bash
scripts/sandbox-browser-setup.sh
```

Features:
- Uses a dedicated Docker network (`openclaw-sandbox-browser`)
- CDP source range can be restricted (`browser.cdpSourceRange`)
- noVNC observation access is password-protected using short-lived token URLs
- Optional `allowHostControl` lets the sandbox session control the host browser

## Multi-Agent Overrides

Each agent can independently override sandbox and tool settings:

```json5
{
  agents: {
    list: [{
      id: "build",
      sandbox: { mode: "all", scope: "agent" },
      tools: { allow: ["group:runtime", "group:fs"] }
    }]
  }
}
```

## Common Issues

### "Tool X blocked by sandbox tool policy"

Fixes:
1. Disable the sandbox: `agents.defaults.sandbox.mode = "off"`
2. Or allow it inside the sandbox: add to `tools.sandbox.tools.allow`
3. Or remove it from `tools.sandbox.tools.deny`

### "I thought this was the main session -- why is it sandboxed?"

In `"non-main"` mode, group/channel keys are not main. Use `sandbox explain` to check the actual session key.

## Summary

OpenClaw's sandbox design follows a **defense-in-depth** approach:

1. **Sandbox** determines the execution environment (Docker/SSH/OpenShell)
2. **Tool Policy** determines available tools (deny always wins)
3. **Elevated** is the host escape hatch exclusively for exec

The three layers operate independently and do not replace each other. It is not a perfect security boundary, but it effectively limits the blast radius of model behavior.

## References

This post is compiled from the following OpenClaw source documents:

- [docs/gateway/sandboxing.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/sandboxing.md) -- Complete sandbox reference
- [docs/gateway/sandbox-vs-tool-policy-vs-elevated.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/sandbox-vs-tool-policy-vs-elevated.md) -- Three-layer control comparison
- [docs/gateway/openshell.md](https://github.com/openclaw/openclaw/blob/main/docs/gateway/openshell.md) -- OpenShell backend
- [docs/tools/elevated.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/elevated.md) -- Elevated Mode
- [docs/tools/multi-agent-sandbox-tools.md](https://github.com/openclaw/openclaw/blob/main/docs/tools/multi-agent-sandbox-tools.md) -- Multi-Agent sandbox and tools
