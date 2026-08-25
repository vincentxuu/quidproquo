---
title: "Learning Agent Design from Mature Coding Agents: Series Overview — Reading Five Codebases to Build My Own"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 1
tags: [coding-agent, agent-loop, harness-engineering, rivumi, open-source]
lang: en
tldr: "I'm building my own Python coding agent called rivumi. This series dissects the source code of five mature projects — pi, oh-my-pi, opencode, codex, and claude-code — topic by topic. Every post follows a fixed five-part structure: design problem → how five projects do it → rivumi's choice → academic grounding → improvement roadmap, with evidence cited at file#symbol level."
description: "Overview of the coding agent design series: why I'm building rivumi, what each of the five reference projects (pi, oh-my-pi, opencode, codex, claude-code) actually is, and how to read the 36-post two-part series and its evidence standard."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-design-series-overview)

For the past six months I've been writing my own coding agent called **rivumi**. I got stuck far more often than expected: how should the agent loop terminate, how fine-grained should approvals be, how do you resume a session after a crash, how do you stop a small model from emitting garbage diffs? Every time I designed something from scratch, two weeks later I'd discover some open-source project had already stepped on the same landmine.

So I inverted the process: read five mature codebases first, then decide how rivumi does it. The findings piled up faster than I could use them, so they became a series. This post is the overview — three things it needs to answer: what problem rivumi solves, who the five reference projects are, and how to read this series.

## Why write your own coding agent

There are already plenty of coding CLIs on the market. There is only one reason to write another: nobody sells the combination of capabilities you want.

What I want is a **Python-first** agent that works as an interactive daily CLI, and switches to a bounded, auditable headless mode for CI and, eventually, Cloudflare execution. It sounds simple, but that sentence hides a pile of design decisions — how tightly should the workspace be isolated, who signs off before a patch lands, does a failed verification count as failure, and how much code changes when you swap model APIs.

rivumi deliberately splits into two parallel runtime paths:

1. **The native harness**: we own the loop, approvals, sessions, tools, verification gate, and model API adapters.
2. **External CLI runtimes**: explicitly selected external coding CLIs (pi, omp, opencode, codex) act as backends. They run their own loops but share rivumi's conversation UI, workspace safety, patch audit, and verification boundary.

The key discipline: one path is never disguised as the other. An external CLI is an external CLI; we never pretend it's our native implementation. That discipline itself is something I learned only after reading other people's source code.

## Who the five reference projects are

All five exist as shallow clones on my machine. The descriptions below were written after actually looking at their top-level structure — not copied from landing pages.

### pi (badlogic/pi-mono)

A TypeScript monorepo that takes a minimalist approach. `packages/` splits into `agent` (the loop), `ai` (the provider layer), `coding-agent`, `tui`, `protocol`, `server`, `session-backends`, `telemetry`, and `evals`. Its value is its smallness: the entire loop is one exported function at `pi-mono/packages/agent/src/agent-loop.ts#agentLoop` — the perfect textbook for reading a "minimum viable agent". rivumi's provider table derives from the definitions in `packages/ai`.

### omp (can1357/oh-my-pi)

A fork of pi, then loaded with extras. The TS `packages/` tree gains things pi doesn't have: `snapcompact` (context compaction), `mnemopi` (cross-session memory), `hashline` (hash-anchored line editing), `catalog` (model database), `metaharness` (experiment infrastructure), and `collab-web` (multiplayer collaboration). Hot paths get Rust crates underneath: `pi-shell`, `pi-walker`, `pi-ast`. For any given question, look at pi's minimal answer first, then see what omp added and why — the two-generation evolution is itself a design document.

### opencode (sst/opencode)

TypeScript, at a completely different scale. The engine lives in `packages/core` (session, config, provider, credential), wrapped by thirty-plus packages: `cli`, `tui`, `desktop`, `server`, `sdk`, `plugin`, `codemode` (tool calls compiled into batched program execution), `containers`, and more. If you want to see what an agent project looks like after it grows into a platform, look here.

### codex (openai/codex)

OpenAI's official CLI, with its core in `codex-rs/` — a Rust workspace with over a hundred crates: `core`, `tui`, `apply-patch`, `rollout` (session recording), `mcp-server`, `code-mode-*`, plus a full safety stack: `sandboxing` (`landlock.rs`, `bwrap.rs`, and friends), `linux-sandbox`, `windows-sandbox-rs`, `execpolicy`, `shell-escalation`, and `network-proxy`. For OS-level sandboxing and dangerous-command interception, it's the most complete public implementation out there.

### claude-code (decompiled source)

Honesty first: the official anthropics/claude-code repo only ships minified bundles; what I have locally is a community-decompiled/reconstructed v2.1.88 source tree. Under `src/`, the structure is startlingly legible: `query.ts`, `tools/`, `services/`, `context/`, `memdir/`, `skills/`, `hooks/`. Symbol names may differ from the original, and I'll flag that when citing. It's the only material where you can see the internal organs of a production-grade agent.

## How to read this series

Two parts, 36 posts total, all bilingual (Chinese and English).

**Part 1, "Implemented comparisons" (24 posts)**: topics rivumi has already shipped — the shape of the agent loop, workspace isolation, approval grading, verification gates, the ModelProvider abstraction, retry policies, subscription OAuth, external CLIs as backends, edit-tool trade-offs, sandboxing and remote execution, CLI ergonomics, and more. Each post is a head-to-head comparison of "how five projects do it vs how I did it", including where I got it wrong.

**Part 2, "Not yet implemented — an improvement roadmap" (12 posts)**: capabilities all five have and rivumi doesn't — context compaction, cross-session memory, dangerous-command interception, OS-level sandboxing, MCP integration, hooks/skills/plugins, subagents and worktree isolation, session recording and replay, telemetry and cost tracking, model catalog routing, LSP integration, and code mode. Each post ends with a concrete design draft for rivumi, not a wish list.

Every post follows the same five-part structure:

1. **The design question**: what is this really asking, and why is it hard.
2. **How five projects do it**: each reference project's solution, with source-level evidence.
3. **rivumi's choice**: what I chose and why it differs (or why I copied).
4. **Academic grounding**: what papers and technical reports like ReAct, SWE-agent, or Reflexion say, with inline links on first mention.
5. **Improvement roadmap**: can it be better? Concrete enough to start building.

## The evidence standard

Every claim in this series requires a **file#symbol citation**, in the form `codex-rs/sandboxing/src/landlock.rs#create_linux_sandbox_command_args_for_permission_profile` — file plus function or type name, never line numbers (clones update; line numbers drift). If I can't find it, I'll say so; fabrication is off-limits. Before writing any Part 2 topic, I'll grep all five codebases to confirm every citation location. And if a project simply doesn't implement something, that's a fact worth recording too.

One aside: this "research first, write second, evidence on disk" workflow is itself the series' methodology — I took the research-note process I use while developing rivumi and repurposed it as a writing process.

If you're building your own agent, or just want to know what Claude Code and Codex look like under the hood, this series is for you. The first substantive post starts with the agent loop — the foundation of everything else.

## References

- [badlogic/pi-mono](https://github.com/badlogic/pi-mono) — pi source code, TypeScript monorepo
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi) — omp source code, a fork of pi
- [sst/opencode](https://github.com/sst/opencode) — opencode source code
- [openai/codex](https://github.com/openai/codex) — Codex CLI source code, Rust workspace
- [anthropics/claude-code](https://github.com/anthropics/claude-code) — official Claude Code repo (ships minified bundles)
- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629) — the foundational paradigm for interleaving reasoning and acting
- [SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering](https://arxiv.org/abs/2405.15793) — how agent–computer interface design shapes performance
- [Reflexion: Language Agents with Verbal Reinforcement Learning](https://arxiv.org/abs/2303.11366) — self-reflection via verbal feedback as agent memory
