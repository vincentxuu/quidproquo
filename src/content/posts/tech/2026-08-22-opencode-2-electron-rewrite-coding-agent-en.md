---
title: "Opencode 2: The Cost of Swapping Bun for Node, Tauri for Electron, and Rebuilding the Entire API"
date: 2026-08-22
category: tech
type: deep-dive
tags: [opencode, coding-agent, cli, open-source, ai-tools, harness-engineering, electron]
lang: en
series:
  name: "Choosing an Agent CLI"
  order: 25
tldr: "Opencode 2 is a major rewrite led by Anomaly (Dax Raad). Runtime migrated from Bun to Node.js (memory issues), desktop from Tauri to Electron (WebKit perf and Node integration), v1 API intentionally incompatible. New: multi-tab parallel sessions, persistent backend service, HTTP API and CLI integration. The current CLI package is @opencode/cli and the command remains opencode. Built-in free models are available alongside paid Console and Go options."
description: "Opencode 2's technical reasons for migrating from Bun/Tauri to Node.js/Electron, three API breaking points, multi-tab parallel session architecture, cross-tool skill portability, and the tradeoffs in installation, free models, and migration."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-opencode-2-electron-rewrite-coding-agent)

The [March article](/posts/tech/2026-03-31-opencode-ai-terminal-coding-agent-en) concluded that opencode was a full-featured coding agent built in TypeScript — dual agent mode (Build / Plan), 75+ model support, MIT license.

OpenCode 2 changes the runtime, desktop shell, and backend architecture while retaining the open-source, multi-model direction.

This article focuses on OpenCode 2's move from Bun/Tauri to Node.js/Electron and the integration options enabled by a persistent backend. For installation today, use the V2 entry point: the npm package is `@opencode/cli`, and the command is `opencode`. V1 and V2 share that default command name; the early beta's separate `opencode2` command is no longer a basis for side-by-side installation.
## Why Rewrite

### Bun → Node.js

Opencode v1 used Bun as its runtime. Bun's selling points were fast startup and a built-in bundler/test runner, but v1's production problem was **memory**.

For agents that run for long periods, read files, and call tools repeatedly, runtime tradeoffs extend beyond startup speed to garbage collection, debugging, and package compatibility. Node.js's V8 and native-addon ecosystem provide a different set of operational tools from Bun.

V2 also keeps a service running in the background, reducing the need to restart the backend each time a frontend opens. Long-session stability is therefore more useful to evaluate than a single cold start.

### Tauri → Electron

Opencode v1's desktop app used Tauri. Tauri's selling points were small binaries and a Rust backend, but v1's problem was **WebKit**.

Tauri uses WebKitGTK on Linux and WKWebView on macOS. Neither engine matches Chromium's DevTools support, and WebKitGTK's performance on Linux has persistent issues — complex UI rendering and scrolling often stutter. More practically, the Node.js integration: v2's backend is entirely Node.js, making Tauri's Rust backend a redundant intermediate layer.

Electron adds download and memory costs. Whether they are worthwhile depends on your need for the desktop interface and its integration features; CLI users do not need the entire desktop shell.

## API Redesign: Three Breaking Points

v2's API is **intentionally incompatible** with v1. Not "renamed a few methods" incompatible — "entire model redesigned" incompatible.

### 1. Session Model

v1's session was a linear message array. v2 supports **multi-tab parallel sessions** — a single opencode instance can run multiple sessions simultaneously, each in its own tab, sharing the same workspace context but with independent agent state.

This solves v1's most common complaint: while you're working with the agent on one thing, another task has to wait. v2 lets you talk to different agents simultaneously, and because workspace context is shared, files changed in one tab are immediately visible in another.

### 2. Persistent Backend Service

v1 was frontend-driven — each opencode launch was a new process, gone when closed. v2 has a **persistent backend service** running in the background:

- The agent loop runs in the backend; the frontend (TUI or Electron) is just a client
- Close the UI and reopen it — the session is still there
- Multiple clients can connect to the same backend simultaneously

This architecture parallels Pi v2's direction (both pursuing session durability and remote access) but takes a different implementation path — Pi uses CBOR + Unix sockets, opencode 2 uses an **HTTP API**.

### 3. HTTP API and CLI Integration

A persistent service also lets other programs control OpenCode. V2 provides `opencode run` for noninteractive tasks and `opencode api` for server API calls, so integration does not require forking the project.

```bash
opencode run "Summarize this project's TODOs"
opencode api GET /api/session
```

The first command submits a model task and consumes the selected model's allowance; the second reads the server's session list. The HTTP API is marked experimental. Build custom clients against the current [V2 API documentation](https://opencode.ai/v2/docs/api), rather than copying SDK package names or imports from an early beta.

## Cross-Tool Skill Portability

Opencode 2 makes an ecosystem-level decision: **it reads the `.claude/skills/` directory**.

This means skill files you wrote for Claude Code will be automatically loaded and interpreted by opencode 2. It's not perfect compatibility — Claude Code's skill format has some fields opencode doesn't support — but the core concept of "a markdown file guiding agent behavior" is portable.

Conversely, opencode 2's own skills live in `.opencode/skills/`, in a nearly identical format. The message: **skills should be cross-tool assets, not a proprietary format locked to one agent**.

In the context of intensifying coding agent competition in H2 2026, this is a smart choice — it lowers switching costs, so users don't have to rewrite all their agent guidance when changing tools.

## Installation and Free Models

On macOS or Linux, use the official npm package:

```bash
npm install -g @opencode/cli
opencode --version
opencode
```

Check that the version starts with `2.`. Both V1 and V2 use `opencode`, so an older executable may still appear first in PATH. On Windows, download the CLI for your architecture from the [official V2 page](https://opencode.ai/v2/docs).

Inside OpenCode, enter `/models` to select a built-in free model. For example, Big Pickle's full ID is `opencode/big-pickle`, and its Input and Output prices are both Free in the official table. Check the [Console model table](https://opencode.ai/v2/docs/console/models): open-source software does not make every model free.

Free models have usage limits, and some are offered for a limited time. You do not need a Go subscription or prepaid credits for your first experiment. To use an external provider such as OpenRouter, configure it separately through `/connect`.

## Risks

**Match interfaces to the version.** Use the current V2 documentation for CLI commands, configuration fields, and APIs. Mixing early-beta packages and commands with current configuration is a common source of integration trouble.

**Electron tradeoffs.** The desktop application adds download and memory costs. If you only need a terminal, use the CLI; accessing free models does not require installing the desktop app.

**Check historical-data migration separately.** Updating the executable, provider settings, and session history are separate tasks. Preserve existing data before upgrading; a working command does not prove that every historical session has migrated.

**Model services and data policies.** OpenCode is open source, while Console offers pay-as-you-go access and Go provides subscriptions. Built-in free models have their own data terms: Big Pickle, for example, may use collected content to improve the model during its free period. Check the selected model's terms before submitting company code or private data.

## Comparison with Other Coding Agents

| | Opencode 2 | Claude Code | Pi v2 | dsh |
|---|---|---|---|---|
| Runtime | Node.js | Node.js | Node.js | Node.js |
| Desktop | Electron | None (IDE integration) | None | Web UI |
| Parallel sessions | Multi-tab | Single session | Single session | Single session |
| Backend architecture | Persistent service + HTTP API | In-process | Unix socket | Web server |
| Integration | HTTP API / CLI | Extension API | AgentHarness v2 | Cordis plugin |
| Skill portability | Reads .claude/skills/ | Native | Extensions | Plugin |

Opencode 2's biggest differentiator from other agents is the **parallel sessions + persistent backend** combination. Claude Code runs one session at a time, Pi likewise; opencode 2 lets you run multiple simultaneously.

## Overall

OpenCode 2's architectural tradeoffs fall into three areas: operating the runtime, choosing a desktop rendering engine, and defining the frontend/backend integration boundary. Relate those differences to your own workflow when evaluating an upgrade.

Multi-tab parallel sessions and the persistent backend are the real functional leaps — they transform opencode from "a CLI tool" into "an agent service that runs in the background." Cross-tool skill portability is a smart ecosystem-level choice.

If you need several frontends connected to one backend or want an agent inside your own workflow, the persistent service and HTTP API are worth exploring. To try AI for free, start with a built-in free model in the CLI, then add the desktop interface, external providers, or programmatic integration as needed.

For step-by-step setup, finding free models, and a first everyday prompt, read [How to use LLMs for free with OpenCode 2 and OpenRouter](/posts/ai/2026-11-01-free-llm-opencode2-openrouter-en).

## Update History

- 2026-11-01: Updated the V2 package and shared command name, removed outdated beta/stable forecasts and SDK imports, and added built-in free models, Console/Go, and data-policy distinctions.

## References

- [anomalyco/opencode (GitHub)](https://github.com/anomalyco/opencode)
- [opencode.ai official website](https://opencode.ai)
- [Anomaly (Dax Raad's company)](https://anomaly.co/)
- [OpenCode 2 installation and downloads](https://opencode.ai/v2/docs)
- [OpenCode 2 CLI and background service](https://opencode.ai/v2/docs/cli/)
- [OpenCode 2 CLI commands](https://opencode.ai/v2/docs/cli/commands)
- [OpenCode 2 models and privacy terms](https://opencode.ai/v2/docs/console/models)
- Internal: [Opencode: Open-Source AI Terminal Coding Agent](/posts/tech/2026-03-31-opencode-ai-terminal-coding-agent-en) (in Chinese)
- Internal: [From Prompt to Harness: Three Evolutions of AI Engineering](/posts/ai/2026-03-28-harness-engineering-evolution) (in Chinese)
- Internal: [The model is just a component — the harness is the system](/posts/ai/2026-08-10-model-component-harness-system) (in Chinese)
