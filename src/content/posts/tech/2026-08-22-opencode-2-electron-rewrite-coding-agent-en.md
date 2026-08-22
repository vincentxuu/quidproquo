---
title: "Opencode 2: The Cost of Swapping Bun for Node, Tauri for Electron, and Rebuilding the Entire API"
date: 2026-08-22
category: tech
type: deep-dive
tags: [opencode, coding-agent, cli, open-source, ai-tools, harness-engineering, electron]
lang: en
series:
  name: "Agent CLI 選型指南"
  order: 25
tldr: "Opencode 2 is a major rewrite led by Anomaly (Dax Raad). Runtime migrated from Bun to Node.js (memory issues), desktop from Tauri to Electron (WebKit perf and Node integration), v1 API intentionally incompatible. New: multi-tab parallel sessions, persistent backend service, HTTP API + SDK. Currently beta, stable estimated ~September 2026. ~200K stars."
description: "Opencode 2's technical reasons for migrating from Bun/Tauri to Node.js/Electron, three API breaking points, multi-tab parallel session architecture, cross-tool skill portability, and beta-stage risks."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-opencode-2-electron-rewrite-coding-agent)

The [March article](/posts/tech/2026-03-31-opencode-ai-terminal-coding-agent-en) concluded that opencode was a full-featured coding agent built in TypeScript — dual agent mode (Build / Plan), 75+ model support, MIT license.

Opencode 2 overturns every one of those technical choices.

In August 2026, [Anomaly](https://anomaly.co/) (Dax Raad's company) released opencode 2 beta. This isn't a natural evolution from v1.x — it's an intentional breaking change, with three foundational layers replaced simultaneously. The npm install name changed to `@opencode-ai/cli@beta`, and the binary from `opencode` to `opencode2`. Repo at [anomalyco/opencode](https://github.com/anomalyco/opencode), ~200,000 stars, still MIT.

## Why Rewrite

### Bun → Node.js

Opencode v1 used Bun as its runtime. Bun's selling points were fast startup and a built-in bundler/test runner, but v1's production problem was **memory**.

Bun's GC behavior differs from V8 — in long-running agent sessions, memory usage climbs steadily, and `Bun.gc()` timing is unpredictable. After several hundred rounds of tool calls, v1's RSS could spike to 2-3 GB. Node.js's V8 GC performs more stably under the same workload, and Node.js's ecosystem — particularly native addons and debug tools — is a tier more mature.

The startup speed gap does exist (Bun is ~100-200ms faster), but v2's architecture includes a **persistent backend service** (discussed below), and the agent doesn't cold-start frequently — so startup speed is no longer a bottleneck.

### Tauri → Electron

Opencode v1's desktop app used Tauri. Tauri's selling points were small binaries and a Rust backend, but v1's problem was **WebKit**.

Tauri uses WebKitGTK on Linux and WKWebView on macOS. Neither engine matches Chromium's DevTools support, and WebKitGTK's performance on Linux has persistent issues — complex UI rendering and scrolling often stutter. More practically, the Node.js integration: v2's backend is entirely Node.js, making Tauri's Rust backend a redundant intermediate layer.

Electron's downsides (large binary, high memory footprint) are real, but for a desktop app that's already running an LLM client, Electron's extra 100-200 MB is not the primary concern relative to the overall session memory usage.

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

### 3. HTTP API + SDK

v2 exposes a set of HTTP APIs plus a TypeScript SDK. You can use the SDK to control opencode from your own programs — open sessions, send commands, read responses.

This makes opencode usable as a building block embedded in other tools. Previously, integrating opencode meant forking it or shelling out to its CLI; now you can `import { OpenCode } from '@opencode-ai/sdk'` and operate programmatically.

## Cross-Tool Skill Portability

Opencode 2 makes an ecosystem-level decision: **it reads the `.claude/skills/` directory**.

This means skill files you wrote for Claude Code will be automatically loaded and interpreted by opencode 2. It's not perfect compatibility — Claude Code's skill format has some fields opencode doesn't support — but the core concept of "a markdown file guiding agent behavior" is portable.

Conversely, opencode 2's own skills live in `.opencode/skills/`, in a nearly identical format. The message: **skills should be cross-tool assets, not a proprietary format locked to one agent**.

In the context of intensifying coding agent competition in H2 2026, this is a smart choice — it lowers switching costs, so users don't have to rewrite all their agent guidance when changing tools.

## Installation and Current State

```bash
# npm install beta
npm install -g @opencode-ai/cli@beta

# or download the binary directly
# binary name is opencode2, no conflict with v1's opencode
```

Current status:

- **Beta**, not recommended for production
- v1 and v2 can be installed side by side (different binary names, different npm packages)
- Estimated stable timeline: **September 2026**
- Known issue: Electron desktop on certain Linux distros has GPU acceleration conflicts

## Risks

**Beta is beta.** The API is still changing, and SDK type definitions may shift. If you build on the SDK now, expect breakage.

**Electron baggage.** Electron's large binary (~150 MB) and idle memory footprint (~200 MB) are known issues. For users who "just want a CLI agent," this overhead is meaningless. v2's CLI mode doesn't require Electron, but using the desktop multi-tab experience means accepting it.

**No v1 → v2 migration path.** v2's session format is incompatible with v1, with no import tool. Session history accumulated in v1 won't automatically carry over to v2.

**Anomaly's business model.** Opencode is MIT, but Anomaly is a company. Opencode's sustainability depends on whether Anomaly can monetize opencode or related products. No signs of a paid tier or cloud hosting yet, but it can't be ruled out long-term.

## Comparison with Other Coding Agents

| | Opencode 2 | Claude Code | Pi v2 | dsh |
|---|---|---|---|---|
| Runtime | Node.js | Node.js | Node.js | Node.js |
| Desktop | Electron | None (IDE integration) | None | Web UI |
| Parallel sessions | Multi-tab | Single session | Single session | Single session |
| Backend architecture | Persistent service + HTTP API | In-process | Unix socket | Web server |
| SDK | TypeScript SDK | Extension API | AgentHarness v2 | Cordis plugin |
| Skill portability | Reads .claude/skills/ | Native | Extensions | Plugin |

Opencode 2's biggest differentiator from other agents is the **parallel sessions + persistent backend** combination. Claude Code runs one session at a time, Pi likewise; opencode 2 lets you run multiple simultaneously.

## Overall

Opencode 2's rewrite isn't a technical pursuit — it solves v1's real problems: Bun's memory, Tauri's WebKit, an unprogrammable API. Each substitution has a clear reason, each reason is verifiable.

Multi-tab parallel sessions and the persistent backend are the real functional leaps — they transform opencode from "a CLI tool" into "an agent service that runs in the background." Cross-tool skill portability is a smart ecosystem-level choice.

But beta is beta. APIs will change, Electron has baggage, v1 sessions don't carry over. If you need a stable coding agent now, v1 or Claude Code are safer bets. If what you want is **a coding agent with multi-session parallelism, programmability, and an SDK for integration** — and you're willing to bear beta risk — opencode 2 is the closest open-source option to that direction.

~200,000 stars and Anomaly's team size show it's not a side project. But stars and team don't equal stability — wait for the September stable release.

## References

- [anomalyco/opencode (GitHub)](https://github.com/anomalyco/opencode)
- [opencode.ai official website](https://opencode.ai)
- [Anomaly (Dax Raad's company)](https://anomaly.co/)
- [@opencode-ai/cli (npm)](https://www.npmjs.com/package/@opencode-ai/cli)
- Internal: [Opencode: Open-Source AI Terminal Coding Agent](/posts/tech/2026-03-31-opencode-ai-terminal-coding-agent-en) (in Chinese)
- Internal: [From Prompt to Harness: Three Evolutions of AI Engineering](/posts/ai/2026-03-28-harness-engineering-evolution) (in Chinese)
- Internal: [The model is just a component — the harness is the system](/posts/ai/2026-08-10-model-component-harness-system) (in Chinese)
