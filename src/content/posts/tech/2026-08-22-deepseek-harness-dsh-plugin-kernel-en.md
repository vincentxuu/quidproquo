---
title: "DeepSeek Harness (dsh): A Coding Agent Framework That Takes Everything-is-a-Plugin All the Way"
date: 2026-08-22
category: tech
type: deep-dive
tags: [deepseek, coding-agent, cli, open-source, ai-tools, harness-engineering, plugin]
lang: en
series:
  name: "Choosing an Agent CLI"
  order: 26
tldr: "DeepSeek Harness (dsh) is DeepSeek's official open-source coding agent framework, released as a v0.1 developer preview on 2026-08-13, accumulating 184,000+ stars in 9 days. Its core is the Cordis plugin kernel — model adapters, tools, agent loop, and UI are all swappable plugins. Four runtime modes, with the ability to use Claude Code and Codex as sub-agents. Web UI first, no native CLI."
description: "DeepSeek Harness (dsh) Cordis plugin kernel architecture, four runtime modes, sub-agent integration, Web UI first strategy, and developer preview risks."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-deepseek-harness-dsh-plugin-kernel)

On August 13, 2026, the same day DeepSeek announced V4-Pro going live, it open-sourced its own coding agent framework — [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (the command is `dsh`). MIT license, TypeScript/Node.js, v0.1 developer preview.

It then accumulated 184,000+ stars in 9 days, shattering every GitHub star-velocity record: 22,000 stars in 1.5 hours, 50,000 in 12 hours, 100,000 in 2 days. The previous fastest to 20,000 stars was xAI's Grok-1 (about 1.2 days); DeepSeek-R1 took 5.7 days.

This article isn't about the star count mythology. It's about what dsh actually does differently from other coding agents.

## Cordis: Everything is a Plugin

The core of dsh isn't the agent loop, the tool system, or model integration — it's a plugin kernel called **Cordis**. Cordis has an academic paper titled "A Programming Paradigm for Spatiotemporal Composability," but you don't need to read it to understand the design:

**Every capability in dsh is a Cordis plugin.** Model adapters are plugins, tool registration is a plugin, the agent loop is a plugin, session storage is a plugin, the sandbox is a plugin, and the UI is a plugin. To swap out any layer, change the config file — no need to touch source code.

### Four Mechanisms of Cordis

**Context**: a hierarchical service registry. Each plugin registers itself with a stable namespaced key (`ctx.tools`, `ctx.llm`, `ctx.sessions`), and consumers don't need to `import` concrete implementations — they just pull from the context.

**Dependency injection**: plugins declare their requirements through the `inject` field. Cordis delays startup until all dependencies are satisfied. No manual load-order sorting needed.

**Event system** with four dispatch modes:

| Mode | Behavior |
|---|---|
| `emit` | Synchronous observation, no return value |
| `waterfall` | Wrap-around middleware — listeners receive `(...args, next)` and can proxy or short-circuit |
| `parallel` | Concurrent observation |
| `serial` | Sequential execution, accumulating results |

`waterfall` is the most important one — it lets any plugin intercept and modify another plugin's behavior without touching its source code. Tool call permission checks, model response filtering, and automatic session saving can all be implemented as waterfall listeners.

**Lifecycle management**: plugins register effects with `ctx.effect()` or `ctx.on()`, producing reversible registrations. Teardown reclaims them in reverse order — no leaked side effects during reload or dispose.

### Configuration and Profiles

Configuration uses `cordis.yml`, supporting `!!js` evaluation (limited to plugin settings and `disabled` fields). Secrets go through environment variables and `.env` files.

dsh uses **profiles** to manage different plugin compositions. Each profile directory has a `package.json` (whose `dsh.profile` field lists the bundle loading order) and a `cordis.patch.yml` (user-level overrides). `dsh --profile web --dump-config` prints the full effective config tree.

Two built-in profiles: `web` (full Web UI) and `headless` (server/automation use).

## Four Runtime Modes

dsh isn't a fixed-shape agent — it has four modes, each targeting different use cases:

| Mode | Purpose | Tool Set |
|---|---|---|
| **Standard** | Full coding agent | File system, shell, search, sub-agents, planning |
| **Code** | Generated SDK, single execution | All Standard tools, but the model writes a complete TypeScript program that calls tools through a generated SDK — one execution instead of multi-round trips |
| **Minimal** | Benchmarking | Only bash and a string-replace editor, for testing agent behavior in controlled environments |
| **Creator** | Meta mode / runtime composition | Standard plus runtime introspection and plugin experimentation, letting you test Cordis plugins in memory and compose new modes |

**Code mode** deserves a closer look. A typical coding agent workflow is: model calls a tool → waits for result → calls the next tool → waits again, each step a round trip. Code mode lets the model write a five-step task as a single program and run it at once. The efficiency difference on batch operations (renaming 20 files, modifying a hundred imports) is massive.

**Minimal mode** has an interesting design motivation — it's the tool DeepSeek itself uses for harness research. Given only bash and a bare-bones editor, it tests how different harness designs affect agent performance. This is an implicit acknowledgment: [harness design matters more than the model itself](/posts/ai/2026-08-10-model-component-harness-system), and DeepSeek is using its own framework to verify this.

**Creator mode** is for framework developers. You can inspect the current runtime composition, test new plugin combinations, and package them as new profiles — all from within dsh. No other coding agent has an equivalent — Claude Code, Codex CLI, and opencode are all "the agent is what the agent is." dsh lets you build agents inside the agent.

## Claude Code and Codex as Sub-agents

Under `packages/subagent/`, dsh has **subagent provider plugins** that can dispatch work to external agent binaries. Built-in providers currently include Claude Code and Codex.

The implementation invokes binaries on the user's `PATH`, disabled by default, requiring explicit opt-in.

dsh also has a **hook bridge** under `packages/hooks/` — it wires Claude Code and Codex `hooks.json` interfaces into Cordis, allowing existing hook configurations to be reused directly.

The positioning is clear: **dsh isn't trying to replace Claude Code — it's trying to sit on top of it.** A realistic 2026 deployment might look like: Claude Code stays in the editor as an interactive agent, while dsh runs on a server as a coordination layer, dispatching to different agents or models based on task requirements.

## Web UI First

dsh's primary interface is the **Web UI**:

```bash
npx @deepseek-ai/dsh web
# starts at http://127.0.0.1:3080
```

The repo once had a TUI package, but it was removed a week before the official release — this isn't "not done yet," it's a deliberate choice to prioritize Web.

There's also a headless mode for servers and automation:

```bash
pnpm dsh --profile headless "task description"
```

The repo has an `apps/cli` directory, but the release focus is clearly on Web. The community has already built [deepseek-harness-desktop](https://github.com/nichdel/deepseek-harness-desktop), wrapping the Web UI as a desktop app with Electron.

This choice is the opposite of other coding agents — Claude Code and Codex CLI are CLI-native, opencode and Pi are TUI-native, dsh is Web-native. The upside is that cross-platform support and remote access require no extra work; the trade-off is that local development latency can't match a native TUI.

## Technical Architecture

TypeScript, strict mode, ESM, pnpm. All packages named `@deepseek-ai/dsh-<name>`. Tests use Vitest with snapshot-based verification, requiring 100% coverage per file.

Repo structure:

| Directory | Contents |
|---|---|
| `packages/core` | Product API backbone: session, system-prompt, tools, agent, agent-loop |
| `packages/llm` | DeepSeek provider implementation |
| `packages/shell` | Bash and process execution |
| `packages/web` | Search and fetch providers |
| `packages/subagent` | Sub-agent dispatch (Claude Code / Codex bridge) |
| `packages/workflow` | Worker-thread provider |
| `packages/hooks` | Claude Code / Codex hook bridge |
| `vendor/` | Vendored Cordis source code |
| `python/` / `native/` | SDK and runtime components |

## Community Ecosystem

Within one week of launch, over 1,080 community plugins had appeared. Multiple community-maintained plugin directories (DSH Plugin Store, DeepseekPlugin.org, dsharness.io) emerged. Community plugins are discovered through GitHub's `dsh-plugin` topic tag.

This velocity is directly related to dsh's "Everything is a Plugin" design — the barrier to contributing a plugin is far lower than forking a monolithic agent. You don't need to understand the entire codebase; you just implement a Service interface, declare dependencies, and hook into the context.

## Developer Preview: Risks

dsh is explicitly labeled as a **developer preview**, with its AGENTS.md being quite direct:

> foundation over compatibility during its pre-release phase, with no external consumers yet, allowing free restructuring of packages and formats.

Several practical risks:

**APIs will break.** The v0.1.x API has no stability promise. Sessions use monotonic version numbers (`SCHEMA_VERSION`, `SESSION_FORMAT_VERSION`), but the formats themselves can change at any time.

**Cordis learning curve.** Waterfall, inject, effect — these concepts aren't hard individually, but their combined behavior is unintuitive. A plugin's waterfall listener can silently alter another plugin's behavior, making debugging difficult to trace.

**Web UI limitations.** Running an agent in a browser environment has inherent constraints — file access goes through HTTP, shell execution through WebSocket, with higher latency than a local TUI. Long session stability hasn't been validated at scale.

**Stars ≠ production validation.** Of those 184,000 stars, how many are DeepSeek brand halo and how many are developers actually using it — there's no data to tell.

## How It Differs from Other Coding Agents

The fundamental difference of dsh isn't in features but in positioning:

**Claude Code, Codex CLI, opencode, and Pi** are agents — they ship a complete coding workflow that you use or extend.

**dsh** is an agent framework — it provides the infrastructure for assembling agents, letting you swap out model adapters, tools, the agent loop, and the UI entirely. Claude Code's Extension API lets you add tools; dsh's Cordis lets you replace the agent loop itself.

This is also why it can use Claude Code and Codex as sub-agents — it's not competing on the same layer, but coordinating from a layer above.

From the perspective of [harness evolution](/posts/ai/2026-03-28-harness-engineering-evolution), dsh represents a new direction: **the harness itself should be composable.** Previous harness designs (Claude Code's hooks, Pi's Extensions, omp's Rust crates) all assumed the harness core structure is fixed, with extension happening at the edges. dsh makes no such assumption.

## Overall

DeepSeek Harness's "Everything is a Plugin" isn't just a slogan — the Cordis kernel genuinely makes every layer of the system swappable, and the four runtime modes demonstrate how many different shapes the same framework can take. Code mode's "model writes programs instead of calling tools" and Creator mode's "build agents inside the agent" are designs no other coding agent has.

But v0.1 is v0.1. APIs will break, the Web UI has latency, Cordis indirection makes debugging hard, and stars don't equal stability. If you need a reliable coding agent right now, Claude Code or opencode are still safer bets. If what you want is **a framework where you define the agent's shape yourself** — and you're willing to accept breaking changes, read Cordis docs, and work in a Web UI — dsh is currently the only open-source project seriously pursuing this.

The 1,080 community plugins in one week demonstrate at least one thing: "Everything is a Plugin" doesn't just lower the barrier to use — it lowers the barrier to contribute. That's worth a lot in open source ecosystems.

## References

- [deepseek-ai/deepseek-harness (GitHub)](https://github.com/deepseek-ai/deepseek-harness)
- [Cordis: A Programming Paradigm for Spatiotemporal Composability](https://github.com/cordiverse/cordis)
- [DeepSeek V4-Pro launch announcement](https://api-docs.deepseek.com/news/news0813)
- Internal: [The model is just a component — the harness is the system](/posts/ai/2026-08-10-model-component-harness-system) (in Chinese)
- Internal: [From Prompt to Harness: Three Evolutions of AI Engineering](/posts/ai/2026-03-28-harness-engineering-evolution) (in Chinese)
- Internal: [Security: prompt injection can only be damage-controlled at the harness layer](/posts/ai/2026-08-10-agent-security-harness-layer) (in Chinese)
