---
title: "The H2 2026 Harness War: Five Frameworks Rewriting at Once — How to Make Sense of It"
date: 2026-08-22
category: ai
type: deep-dive
tags: [harness-engineering, coding-agent, omp, pi, opencode, deepseek, claude-code, open-source]
lang: en
series:
  name: "Agent CLI 選型指南"
  order: 27
tldr: "In August 2026, OMP 2 rewrites entirely in Rust, Pi v2 swaps its engine, Opencode 2 replaces three layers at once, DeepSeek Harness launches from scratch, and Claude Code keeps iterating — five coding agents moving simultaneously. This article lays them side by side, not to rank them, but to identify three distinct architectural approaches and one shared direction."
description: "The five-way competition in H2 2026 coding agent frameworks: full Rust rewrite, minimalist upgrade, runtime migration, plugin kernel, continuous iteration. Three architectural approaches and one shared direction."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-harness-competition-h2-2026-landscape)

August 2026 has too many things happening at once:

- [OMP 2](/posts/tech/2026-08-22-omp-2-rust-rewrite-coding-harness-en) goes from Pi fork to fully independent Rust codebase, ~41 crates
- [Pi v2](/posts/tech/2026-08-22-pi-v2-agent-harness-api-stable-en) promotes AgentHarness v2 API to stable, swaps to CBOR + Unix sockets underneath
- [Opencode 2](/posts/tech/2026-08-22-opencode-2-electron-rewrite-coding-agent-en) replaces Bun with Node, Tauri with Electron, rebuilds the entire API
- [DeepSeek Harness](/posts/tech/2026-08-22-deepseek-harness-dsh-plugin-kernel-en) launches from scratch with a Cordis plugin kernel, 184K stars in 9 days
- Claude Code continues iterating with Extension API, hooks, and MCP integration

Each already has its own [in-depth article](/tags/harness-engineering). This piece won't repeat individual analyses — it puts them side by side to see what each is betting on, what each gave up, and what assumptions each makes about the future of harness design.

## The Numbers

As of 2026-08-22:

| Framework | Language | Stars | License | Status | Organization |
|---|---|---|---|---|---|
| [OMP 2](https://github.com/can1357/oh-my-pi) | Rust | 26.4K | MIT | Pre-release | Stencil Labs Inc. |
| [Pi v2](https://github.com/earendil-works/pi) | TypeScript | 95.4K | MIT | Stable (v0.84.0) | Earendil Inc. (PBC) |
| [Opencode 2](https://github.com/anomalyco/opencode) | TypeScript | ~200K | MIT | Beta | Anomaly |
| [dsh](https://github.com/deepseek-ai/deepseek-harness) | TypeScript | 184K+ | MIT | Dev Preview (v0.1) | DeepSeek |
| Claude Code | TypeScript | Closed source | Commercial | GA | Anthropic |

Five frameworks, four MIT open-source, one closed-source commercial. Four use TypeScript (or primarily TypeScript), one rewrites in Rust. All made major changes or first launches in 2026.

## Three Architectural Approaches

These five frameworks fall into three distinct approaches — not a feature comparison, but different answers to "what should a harness look like."

### Approach One: Rewrite the Runtime to Depend on Nothing External

**Representative: OMP 2**

OMP 2's core claim: a coding agent shouldn't depend on what's installed on the user's machine. It shouldn't shell out to `rg`, shouldn't depend on the system's bash, shouldn't assume `node` is on PATH. The solution: compile everything into a single binary — custom bash engine, in-process coreutils, tree-sitter AST, even embedded CPython 3.14t.

The cost of this approach is **complexity**. ~41 Rust crates, pinned nightly toolchain, edition 2024. Contributing code requires knowing Rust; debugging requires reading Rust. The barrier to community participation is a tier higher than TypeScript.

But it solves a problem no other framework has addressed head-on: **cross-platform consistency**. The same binary behaves identically on macOS, Linux, and Windows — no WSL, no coreutils installation, no shell-difference wrangling.

### Approach Two: Keep the Core Small, Upgrade Foundational Quality

**Representatives: Pi v2, Claude Code**

Pi v2 and Claude Code take a similar path: no major changes to core functionality, but continuous improvement to foundational quality. Pi swaps sessions from in-memory objects to a lane-based durable model, changes the wire protocol from JSON to CBOR — but still has 4 tools, still explicitly refuses MCP and sub-agents in the README.

Claude Code follows the same pattern: hooks, Extension API, MCP integration are all incremental expansions; the core agent loop and tool system haven't undergone destructive rewrites.

This approach assumes: **the harness core structure is already right — what's needed is making the foundation solid, not reinventing it.** The upside is stability, predictability, and no relearning required. The cost: if the core assumption is wrong, correction is expensive — because the entire ecosystem is already built on the existing structure.

### Approach Three: The Harness Itself Should Be Composable

**Representatives: dsh, Opencode 2 (partially)**

DeepSeek Harness's Cordis plugin kernel is this approach's most radical expression: model adapters, tools, agent loop, UI are all plugins, all swappable. You're not just adding features on top of a harness — you can replace every layer of the harness itself.

Opencode 2's persistent backend + HTTP API + SDK carries a similar spirit — it's not just an agent, it lets you use the agent as a building block embedded in your own system.

This approach assumes: **nobody knows what the harness should ultimately look like, so every layer should be experimentable.** The upside is maximum flexibility; the cost is learning curve (Cordis's waterfall + inject + effect combination) and debugging difficulty (more indirection layers, harder to trace).

## One Shared Direction: Session Durability

Every framework currently being rewritten is doing the same thing: **making sessions outlive their processes.**

- OMP 2: content-addressed blob storage + append-only session transcripts
- Pi v2: lane-based v4 Session model with durable operations
- Opencode 2: persistent backend service — close the UI, reopen, session persists
- dsh: session storage is a Cordis plugin, swappable with different durability backends

This isn't coincidence. When agent sessions evolve from "run 5 minutes to fix a bug" to "run 5 hours to build a feature," session durability becomes a requirement. [The model is just a component — the harness is the system](/posts/ai/2026-08-10-model-component-harness-system) — and a system can't lose all state from a single process interruption.

## Ecosystem Fragmentation and Crossover

Interestingly, these frameworks aren't in pure competition.

**dsh can use Claude Code and Codex as sub-agents.** It's not competing on the same layer — it's coordinating from above. A real deployment might look like: Claude Code stays in the editor, dsh runs on a server dispatching tasks.

**Opencode 2 reads `.claude/skills/`.** This means switching from Claude Code to opencode 2 doesn't require rewriting your skills. Skills are becoming cross-tool portable assets.

**OMP 2 and Pi will not reconverge.** OMP 2 is no longer a Pi fork — it's a fully independent Rust codebase. The two projects' technical directions are completely different, and users must choose one or the other.

**Earendil, Anomaly, Stencil Labs, DeepSeek** — four different companies, four different commercial pressures. MIT licensing guarantees code freedom but not maintenance continuity. Which framework survives long-term depends on whether its organization can find a sustainable business model.

## How to Choose

The decision isn't "which is best" — it's "what do you need."

```
What matters most to you?
│
├─ Stability and ecosystem → Claude Code
│   Closed source, Anthropic-backed, largest user base
│
├─ Readability and minimalism → Pi v2
│   4 tools, entire codebase readable, MIT
│
├─ Multi-session parallelism and SDK → Opencode 2 (beta)
│   Persistent backend, HTTP API, cross-tool skills
│
├─ Cross-platform consistency → OMP 2 (pre-release)
│   Full Rust, single binary, no system-tool dependencies
│
└─ Custom agent shapes → dsh (dev preview)
    Cordis plugin kernel, everything swappable, Web UI
```

If you need production use right now, choose Claude Code or Pi v2 — both are stable, just in different directions (full-featured vs. minimal).

If you're willing to take beta / pre-release risk, pick the specific capability you need most — multi-session (opencode 2), full Rust (omp 2), everything-is-a-plugin (dsh).

## What to Watch Next

From the perspective of [harness evolution](/posts/ai/2026-03-28-harness-engineering-evolution), H2 2026 is **a divergence period for harness methodology**. Previously, everyone was on the same path — letting models use tools, adding context, building safety checks. Now the path forks:

- Whether to build the entire runtime yourself (OMP 2)
- Whether to make every harness layer swappable (dsh)
- Whether to turn the agent into a programmable service (Opencode 2)
- Whether to upgrade the foundation without changing positioning (Pi v2)

These approaches won't produce clear winners immediately. What matters isn't who has the most stars in August 2026, but which approach produces the most reliable production deployments by mid-2027.

Stars measure attention, not quality. A framework with 184,000 stars and one with 26,000 may end up with the latter proving more reliable — we don't know yet.

The one thing that's certain: [harness design matters more than the model itself](/posts/ai/2026-08-10-model-component-harness-system). Five frameworks rewriting simultaneously shows every participant in this space agrees on that premise — the disagreement is only about "then how should the harness be built."

## References

- Internal: [OMP 2: From Pi Fork to Full Rust Rewrite](/posts/tech/2026-08-22-omp-2-rust-rewrite-coding-harness-en) (in Chinese)
- Internal: [Pi v2: AgentHarness API Goes Stable](/posts/tech/2026-08-22-pi-v2-agent-harness-api-stable-en) (in Chinese)
- Internal: [Opencode 2: Bun to Node, Tauri to Electron](/posts/tech/2026-08-22-opencode-2-electron-rewrite-coding-agent-en) (in Chinese)
- Internal: [DeepSeek Harness (dsh): Everything is a Plugin](/posts/tech/2026-08-22-deepseek-harness-dsh-plugin-kernel-en) (in Chinese)
- Internal: [omp v1: The Batteries-Included Fork](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork-en) (in Chinese)
- Internal: [Pi: A Minimalist Coding Harness](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness-en) (in Chinese)
- Internal: [Opencode: Open-Source AI Terminal Coding Agent](/posts/tech/2026-03-31-opencode-ai-terminal-coding-agent-en) (in Chinese)
- Internal: [The model is just a component — the harness is the system](/posts/ai/2026-08-10-model-component-harness-system) (in Chinese)
- Internal: [From Prompt to Harness: Three Evolutions of AI Engineering](/posts/ai/2026-03-28-harness-engineering-evolution) (in Chinese)
- [OMP 2 (GitHub)](https://github.com/can1357/oh-my-pi)
- [Pi (GitHub)](https://github.com/earendil-works/pi)
- [Opencode (GitHub)](https://github.com/anomalyco/opencode)
- [DeepSeek Harness (GitHub)](https://github.com/deepseek-ai/deepseek-harness)
