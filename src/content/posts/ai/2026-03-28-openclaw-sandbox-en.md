---
title: "OpenClaw Sandboxing: Four Backends, Three Independent Switches, and Thinking You're Sandboxed When You Aren't"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, sandbox, docker, podman, ssh, openshell, security, tool-policy]
lang: en
series:
  name: "Reading the OpenClaw Docs"
  order: 17
tldr: "Sandboxing is governed by three independent settings: mode (when it applies), scope (how many containers), and backend (where it runs). The most common failure is an expectation gap — `tools.exec.host` now defaults to auto, so 'unset means sandboxed' is no longer true, and the security audit has a check specifically for it."
description: "A complete guide to OpenClaw sandboxing: the mode/scope/backend settings, capability differences across Docker, Podman, SSH, and OpenShell, the hardened Docker defaults, workspace access modes, and the Docker-out-of-Docker path trap."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-sandbox)

OpenClaw can run tool execution inside a sandbox to reduce blast radius. The docs are refreshingly honest about what that means:

> This is not a perfect security boundary, but it materially limits filesystem and process access when the model does something dumb.

**Sandboxing is off by default.** And one thing to internalize first: **the Gateway process always stays on the host** — only tool execution moves into the sandbox when enabled.

## Three independent settings

| Setting | Key | Values | Default |
|---|---|---|---|
| Mode | `agents.defaults.sandbox.mode` | `off`, `non-main`, `all` | `off` |
| Scope | `agents.defaults.sandbox.scope` | `agent`, `session`, `shared` | `agent` |
| Backend | `agents.defaults.sandbox.backend` | `docker`, `podman`, `ssh`, `openshell` | `docker` |

**Mode controls when it applies.** `non-main` sandboxes every session except the agent's main one — and there is a practical consequence: **the main session key is always `agent:<id>:main` and is not configurable**, while group and channel sessions use their own keys, so **they always count as non-main and always get sandboxed.**

**Scope controls how many environments exist.** `agent` is one container per agent, `session` one per session, `shared` one for all sandboxed sessions (per-agent docker/ssh/browser overrides are ignored under that scope).

**Backend controls where sandboxed tools run** — note that Podman is now its own first-class backend, not a Docker spelling variant.

## What is and is not sandboxed

**Inside**: tool execution (`exec`, `read`, `write`, `edit`, `apply_patch`, `process`) and the optional sandboxed browser.

**Outside**:

- **The Gateway process itself**
- Any tool explicitly allowed outside via `tools.elevated`. Elevated exec **bypasses sandboxing** and runs on the configured escape path (`gateway` by default, or `node` when the exec target is a node)
- **Native plugins** — they stay in-process with the Gateway and share its trust boundary

That last point deserves a pause: whether sandboxed sessions can use plugin and MCP tools depends on **both** normal tool policy and `tools.sandbox.tools` allowing them — but those tools still execute Gateway-side, not in the sandbox.

## Where it actually goes wrong: the expectation gap

This is the section to take away. `tools.exec.host` now defaults to **`auto`**, so the inference "I didn't set an exec host, therefore it runs in the sandbox" **no longer holds**.

The security audit has a whole category for this, called runtime expectation drift, which catches two cases specifically:

- Assuming implicit exec still means `sandbox` when `tools.exec.host` now defaults to `auto`
- Setting `tools.exec.host="sandbox"` while sandbox mode is off

A related one is policy drift: **sandbox Docker settings fully configured while sandbox mode is off** — the config looks complete and does nothing.

So after configuring a sandbox, run:

```bash
openclaw security audit
openclaw security audit --deep   # attempts a live Gateway probe
```

## What the four backends can do

| | Docker / Podman | SSH | OpenShell |
|---|---|---|---|
| Where it runs | Local container | Any SSH-accessible host | An OpenShell-managed sandbox |
| Workspace model | Bind-mount or copy | Remote-canonical (seed once) | `mirror` or `remote` |
| Network control | `docker.network` (**default: none**) | Depends on the remote host | Depends on OpenShell |
| Sandboxed browser | **Docker engine only** | Not supported | Not supported yet |
| Extra host folders | `docker.binds` with explicit `:ro`/`:rw` | Not as mounts; seed or copy | Not as mounts; use sync or remote files |
| Packages and runtimes | Bake an image, or `setupCommand` | Provision on the remote host | Include in the source image, or install if policy permits |

Workspace access is the same across all three: `none`, `ro`, `rw`.

## The Docker defaults are already hardened

Worth knowing the actual defaults, because they are stricter than most people would configure by hand:

- `network: "none"` (**no egress**)
- `readOnlyRoot: true`
- `capDrop: ["ALL"]`
- image: `openclaw-sandbox:bookworm-slim`

Containers are also created with **an init process and `no-new-privileges`**. With `workspaceAccess: "ro"`, the agent workspace is mounted read-only at `/agent` and writes are rejected, while configured tmpfs paths stay writable.

```json5
{
  agents: {
    defaults: {
      sandbox: {
        mode: "all",
        backend: "docker",
        scope: "session",
        workspaceAccess: "ro",
        docker: {
          image: "openclaw-sandbox:bookworm-slim",
          readOnlyRoot: true,
          tmpfs: ["/tmp", "/var/tmp", "/run"],
          network: "none",
          capDrop: ["ALL"],
        },
      },
    },
  },
}
```

For GPUs, set `docker.gpus` (`"all"` or `"device=GPU-uuid"`), which is passed to the engine's `--gpus` flag; **Podman needs 5.0 or newer.**

## Runtime identity now includes the workspace path

This one can startle you during an upgrade: **non-shared runtime identity now includes the resolved agent workspace path.**

The goal is to stop co-hosted workspaces that reuse the same agent or session keys from sharing Docker, browser, SSH, OpenShell, or plugin-provided sandbox state.

The cost is that the first use after upgrading **creates new runtimes and sandbox workspaces, and existing non-shared runtimes are not adopted** — the docs call this an intentional one-time reset. Old ones age out through prune settings or can be removed with `openclaw sandbox recreate`. (`shared` scope deliberately stays workspace-independent.)

## The Docker-out-of-Docker path trap

If you deploy the Gateway itself as a Docker container, it orchestrates **sibling** sandbox containers through the host's Docker socket. That creates a constraint that is very hard to reason out on your own:

**Config needs host paths, not the Gateway container's internal paths.** `openclaw.json`'s `workspace` must be the host's absolute path (e.g. `/home/user/.openclaw/workspaces`), because the Docker daemon resolves paths in the **host OS namespace**, not the Gateway's.

**And the Gateway container needs an identical volume map** (`-v /home/user/.openclaw:/home/user/.openclaw`), because the Gateway process also writes heartbeat and bridge files to that workspace path. Mismatched mappings surface as **`EACCES` when the Gateway writes its heartbeat** — a symptom that looks nothing like a path-mapping problem, which is exactly why it is worth remembering.

## The big picture

Sandboxing compresses to one sentence: **it shrinks the blast radius of the model doing something dumb, not the boundary against someone attacking you.** That is how the docs position it themselves.

In practice the highest-value action is not tightening every setting — it is **confirming that what you think is on is actually on**. The change of `tools.exec.host` to `auto` is a perfect illustration of behavior moving while your config sits still. After installing and after upgrading, run `openclaw security audit`.

## Changelog

- 2026-08-18: Substantially revised against the current official docs. **Backends went from three to four** — Podman is now its own first-class backend. **Added the most important section**: `tools.exec.host` now defaults to `auto`, so "unset means sandboxed" no longer holds, and the security audit has dedicated runtime-expectation-drift and policy-drift checks. Added: the actual hardened Docker defaults (network none, readOnlyRoot, capDrop ALL, init and no-new-privileges, `openclaw-sandbox:bookworm-slim`), the `docker.gpus` option and Podman 5.0 requirement, the one-time reset caused by folding the workspace path into non-shared runtime identity, the fact that native plugins share the Gateway's trust boundary in-process, and the Docker-out-of-Docker host-path constraint with its `EACCES` heartbeat symptom.

## References

This article draws on the following official OpenClaw documentation:

- [Sandboxing](https://docs.openclaw.ai/gateway/sandboxing) — mode/scope/backend, capability matrix, Docker defaults, DooD constraints
- [Security](https://docs.openclaw.ai/gateway/security) — audit checks and drift categories
- [Elevated Mode](https://docs.openclaw.ai/tools/elevated) — the sandbox escape path
- [Plugin execution model](https://docs.openclaw.ai/plugins/architecture) — where native plugins run
