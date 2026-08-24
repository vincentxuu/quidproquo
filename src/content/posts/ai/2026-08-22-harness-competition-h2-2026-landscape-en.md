---
title: "The H2 2026 Harness War: Eight Frameworks Rewriting, Three Model Makers Entering, 110+ CLIs — How to Make Sense of It"
date: 2026-08-22
category: ai
type: deep-dive
tags: [harness-engineering, coding-agent, omp, pi, opencode, deepseek, claude-code, open-source, grok-build, muse-code, antigravity-cli, amp, codex-cli]
lang: en
series:
  name: "Agent CLI 選型指南"
  order: 30
tldr: "In August 2026, it's not just five frameworks moving. Beyond OMP 2, Pi v2, Opencode 2, dsh, and Claude Code, three model makers — Google (Antigravity CLI), Meta (Muse Code), and xAI (Grok Build) — are building coding agents directly. Add Amp, Cline 2.0, and the Codex CLI Rust rewrite, and eight-plus frameworks are undergoing architecture-level changes simultaneously. Factor in 110+ total CLI tools, and H2 2026 is a divergence period for harness methodology. This article analyzes four architectural approaches, one shared direction, and one emerging trust crisis."
description: "The eight-way competition in H2 2026 coding agent frameworks: full Rust rewrite, minimalist upgrade, plugin kernel, model maker builds the agent. Four architectural approaches, one shared direction, one trust crisis, 110+ CLIs."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-harness-competition-h2-2026-landscape)

August 2026 has too many things happening at once.

Independent frameworks are rewriting:

- [OMP 2](/posts/tech/2026-08-22-omp-2-rust-rewrite-coding-harness-en) goes from Pi fork to fully independent Rust codebase, ~41 crates
- [Pi v2](/posts/tech/2026-08-22-pi-v2-agent-harness-api-stable-en) promotes AgentHarness v2 API to stable, swaps to CBOR + Unix sockets underneath
- [Opencode 2](/posts/tech/2026-08-22-opencode-2-electron-rewrite-coding-agent-en) replaces Bun with Node, Tauri with Electron, rebuilds the entire API
- [DeepSeek Harness](/posts/tech/2026-08-22-deepseek-harness-dsh-plugin-kernel-en) launches from scratch with a Cordis plugin kernel, 184K stars in 9 days
- [Amp](/posts/tech/2026-08-19-amp-frontier-agent-en) ships Orbs (ephemeral VMs), event-driven architecture
- Claude Code continues iterating with Extension API, hooks, and MCP integration

Model makers are building agents directly:

- [Antigravity CLI](/posts/tech/2026-08-24-antigravity-cli-gemini-replacement-google-en): Google replaces [Gemini CLI](/posts/tech/2026-03-31-gemini-cli-google-terminal-agent-en) with a Go rewrite, closed source, 121 commands
- [Muse Code](/posts/tech/2026-08-24-muse-code-meta-coding-agent-en): Meta's first coding agent, Muse Spark 1.2 model co-trained with the harness
- [Grok Build](/posts/tech/2026-08-24-grok-build-xai-privacy-incident-en): xAI's Rust agent, 845K LOC, Arena Mode, open-sourced three days after a privacy incident broke

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
| [Antigravity CLI](https://cloud.google.com/products/antigravity) | Go | Closed source | Commercial | GA | Google |
| [Muse Code](https://musecodes.io) | Undisclosed | Closed source | Commercial | Early Beta | Meta |
| [Grok Build](https://github.com/xai-org/grok-build) | Rust | ~24.5K | Apache 2.0 | Public Beta | xAI |
| [Amp](https://ampcode.com) | TypeScript | Closed source | Commercial | GA | Sourcegraph |
| [Codex CLI](https://github.com/openai/codex) | Rust | 116K | Apache 2.0 | GA | OpenAI |
| [Cline](https://github.com/cline/cline) | TypeScript | 45K+ | Apache 2.0 | GA (SDK + CLI) | Cline |

Eleven frameworks with architecture-level changes. Six closed-source commercial, five open-source. Five use TypeScript, three use Rust, one uses Go, two undisclosed. Backed by eleven different organizations — three of which are model makers.

## Four Architectural Approaches

These frameworks fall into four distinct approaches — not a feature comparison, but different answers to "what should a harness look like."

### Approach One: Rewrite the Runtime to Depend on Nothing External

**Representative: OMP 2**

OMP 2's core claim: a coding agent shouldn't depend on what's installed on the user's machine. It shouldn't shell out to `rg`, shouldn't depend on the system's bash, shouldn't assume `node` is on PATH. The solution: compile everything into a single binary — custom bash engine, in-process coreutils, tree-sitter AST, even embedded CPython 3.14t.

[Grok Build](/posts/tech/2026-08-24-grok-build-xai-privacy-incident-en) also uses Rust, but with completely different motivations. OMP 2's ~41 crates are a ground-up modular architecture; Grok Build's 845K lines are a corporate monorepo slice that doesn't accept external contributions. Same language choice, two entirely different architectural intents.

The cost of this approach is **complexity**. The barrier to community participation in Rust is a tier higher than TypeScript. But OMP 2 solves a problem no other framework has addressed head-on: **cross-platform consistency**. The same binary behaves identically on macOS, Linux, and Windows.

### Approach Two: Keep the Core Small, Upgrade Foundational Quality

**Representatives: Pi v2, Claude Code**

Pi v2 and Claude Code take a similar path: no major changes to core functionality, but continuous improvement to foundational quality. Pi swaps sessions from in-memory objects to a lane-based durable model, changes the wire protocol from JSON to CBOR — but still has 4 tools, still explicitly refuses MCP and sub-agents in the README.

Claude Code follows the same pattern: hooks, Extension API, MCP integration are all incremental expansions; the core agent loop and tool system haven't undergone destructive rewrites.

This approach assumes: **the harness core structure is already right — what's needed is making the foundation solid, not reinventing it.** The upside is stability, predictability, and no relearning required. The cost: if the core assumption is wrong, correction is expensive — because the entire ecosystem is already built on the existing structure.

### Approach Three: The Harness Itself Should Be Composable

**Representatives: dsh, Opencode 2 (partially), Amp (partially)**

DeepSeek Harness's Cordis plugin kernel is this approach's most radical expression: model adapters, tools, agent loop, UI are all plugins, all swappable. You're not just adding features on top of a harness — you can replace every layer of the harness itself.

Opencode 2's persistent backend + HTTP API + SDK carries a similar spirit — it's not just an agent, it lets you use the agent as a building block embedded in your own system. [Amp](/posts/tech/2026-08-19-amp-frontier-agent-en)'s Orbs are another variant: abstracting the execution environment itself into ephemeral VMs, letting agents run in isolation — fail and discard.

This approach assumes: **nobody knows what the harness should ultimately look like, so every layer should be experimentable.** The upside is maximum flexibility; the cost is learning curve and debugging difficulty.

### Approach Four: Model Maker Builds the Agent

**Representatives: Antigravity CLI, Muse Code, Grok Build**

One of H2 2026's clearest trends: model makers are no longer just providing APIs — they're building complete coding agents.

[Antigravity CLI](/posts/tech/2026-08-24-antigravity-cli-gemini-replacement-google-en) is Google's closed-source Go rewrite, replacing the Apache 2.0 [Gemini CLI](/posts/tech/2026-03-31-gemini-cli-google-terminal-agent-en). It's not just a model wrapper — 121 commands, multi-agent orchestration, native OS sandbox. This is a complete development environment.

[Muse Code](/posts/tech/2026-08-24-muse-code-meta-coding-agent-en) co-trains model and harness — Muse Spark 1.2 isn't a model trained first with an agent loop fitted after; model behavior and agent goals are optimized as one unit. Persistent sub-agents + worktree isolation are also uncommon designs.

[Grok Build](/posts/tech/2026-08-24-grok-build-xai-privacy-incident-en) has 8 parallel sub-agents and Arena Mode (competing agents, pick the best). The highest concurrency among all current frameworks.

[Codex CLI](/posts/tech/2026-03-31-codex-cli-openai-coding-agent-en) was rewritten from TypeScript to Rust (mid-2025), 116K stars, also on the model-maker-builds-the-agent path.

This approach assumes: **model and harness should be vertically integrated.** Model makers own the model, own the distribution channel, own the user relationship — if the harness is competitive advantage, why let a third party build it?

The cost: users get locked into a single model ecosystem. Antigravity CLI defaults to Gemini only (though it supports Claude and GPT), Muse Code defaults to Muse Spark only, Grok Build defaults to Grok only. Independent frameworks like Pi, dsh, and Opencode natively support multiple models; model makers' agents natively favor their own.

## One Shared Direction: Session Durability

Regardless of approach, every framework currently being rewritten is doing the same thing: **making sessions outlive their processes.**

- OMP 2: content-addressed blob storage + append-only session transcripts
- Pi v2: lane-based v4 Session model with durable operations
- Opencode 2: persistent backend service — close the UI, reopen, session persists
- dsh: session storage is a Cordis plugin, swappable with different durability backends
- Muse Code: append-only event log, `muse resume` recovers from crashes
- Grok Build: each sub-agent in its own git worktree, plan/search/build pipeline

This isn't coincidence. When agent sessions evolve from "run 5 minutes to fix a bug" to "run 5 hours to build a feature," session durability becomes a requirement. [The model is just a component — the harness is the system](/posts/ai/2026-08-10-model-component-harness-system) — and a system can't lose all state from a single process interruption.

## A Trust Crisis

July–August 2026 saw three trust incidents in quick succession, each pointing to risks unique to coding agents:

**Grok Build silently uploaded entire repos.** On July 12, 2026, security researcher Cereblab published wire-level captures proving Grok Build was uploading entire Git repositories (including `.env`, SSH keys, commit history) to Google Cloud Storage without user knowledge. Upload traffic was 27,800 times conversation traffic. xAI open-sourced three days later, but the [exfiltration code remains in the binary](/posts/tech/2026-08-24-grok-build-xai-privacy-incident-en), disabled only by a server-side flag.

**Muse Code's Contributor pricing.** Meta bundles API pricing with training rights: Standard plan at $1.25/$4.25/M tokens, Contributor at $0.10/$0.20 — 20x cheaper, but [your code enters Meta's training pipeline](/posts/tech/2026-08-24-muse-code-meta-coding-agent-en). No granular opt-out, all-or-nothing.

**Antigravity CLI went from open to closed source.** Google replaced its 100K-star Apache 2.0 project Gemini CLI with the closed-source Antigravity CLI, giving only a [28-day transition](/posts/tech/2026-08-24-antigravity-cli-gemini-replacement-google-en). Simultaneously, the free tier was cut from ~1,000 to ~20 requests/day — a 98% reduction.

These aren't isolated incidents. They point to a structural issue: **coding agents have deeper access than any previous development tool.** They can read the entire codebase, view Git history, and touch `.env` and SSH keys. This trust surface is fundamentally different from a web app or IDE plugin.

Open source is the baseline for trust, but not a sufficient condition. Grok Build was open-sourced and the exfiltration code was still in it. The real question is: are you trusting the code, or the organization's policy decisions?

## 110+ CLIs Everywhere

The discussion above covers frameworks with architecture-level changes. But the August 2026 coding agent CLI landscape goes far beyond — the total count exceeds 110.

**Tier 1: Model-maker official CLIs.** Claude Code, [Antigravity CLI](/posts/tech/2026-08-24-antigravity-cli-gemini-replacement-google-en), [Muse Code](/posts/tech/2026-08-24-muse-code-meta-coding-agent-en), [Grok Build](/posts/tech/2026-08-24-grok-build-xai-privacy-incident-en), [Codex CLI](/posts/tech/2026-03-31-codex-cli-openai-coding-agent-en), Kimi Code CLI. Model makers building the harness themselves, bundling their own model, using distribution channels to push adoption.

**Tier 2: VC-backed independent tools.** [Pi](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness-en), [Opencode](/posts/tech/2026-03-31-opencode-ai-terminal-coding-agent-en), [dsh](/posts/tech/2026-08-22-deepseek-harness-dsh-plugin-kernel-en), [Amp](/posts/tech/2026-08-19-amp-frontier-agent-en), Cline, [Kiro](/posts/ai/2026-04-02-agent-cli-kiro-en), Devin. Company-backed, with a business model (or searching for one), mostly multi-model.

**Tier 3: Community rewrites and forks.** [Claw Code](/posts/ai/2026-04-05-claw-code-rust-claude-code-reimplementation-en) (Claude Code Rust clean-room rewrite, 172K+ stars), [OpenClaw](https://github.com/nicepkg/openclaw) (387K stars), [Hermes Agent](/posts/ai/2026-08-18-hermes-agent-terminal-backends-en) (235K stars), [OMP](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork-en). Impressive star counts, but maintenance patterns and quality vary widely — some are active community projects, others are "agent-managed museum exhibits" (high stars but lacking sustained human maintenance).

**Tier 4: Small and niche tools.** 100+ CLIs with under 5K stars, each solving specific problems — language-specific agents, IDE integrations, workflow automations. Most won't survive long-term, but a few may become the next Pi.

The significance of this number isn't "which should you try" — it's that demand for coding agents is real. 110+ tools existing simultaneously shows strong market pull. But consolidation hasn't happened yet.

## Ecosystem Fragmentation and Crossover

These frameworks aren't in pure competition.

**dsh can use Claude Code and Codex as sub-agents.** It's not competing on the same layer — it's coordinating from above. A real deployment might look like: Claude Code stays in the editor, dsh runs on a server dispatching tasks. Kiro's Crew autonomous orchestrator serves a similar role.

**Opencode 2 reads `.claude/skills/`.** This means switching from Claude Code to Opencode 2 doesn't require rewriting your skills. Skills are becoming cross-tool portable assets.

**Cline 2.0 extracted its SDK.** IDEs can embed any agent, not just Cline's own. This decouples "where the harness runs" from "which agent you use."

**OMP 2 and Pi will not reconverge.** OMP 2 is no longer a Pi fork — it's a fully independent Rust codebase. The two projects' technical directions are completely different, and users must choose one or the other.

**Model makers' agents don't interoperate.** Antigravity CLI won't use Claude, Muse Code won't use Gemini, Grok Build won't use GPT (unless through OpenRouter). Model makers' agents are inherently walled gardens. Independent frameworks (Pi, dsh, Opencode) are inherently open.

**The organization behind determines survival.** Earendil, Anomaly, Stencil Labs, DeepSeek, Google, Meta, xAI, Sourcegraph, OpenAI, Cline — ten different companies, ten different commercial pressures. MIT / Apache 2.0 licensing guarantees code freedom but not maintenance continuity.

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
├─ Custom agent shapes → dsh (dev preview)
│   Cordis plugin kernel, everything swappable, Web UI
│
├─ Highest parallelism → Grok Build (public beta)
│   8 parallel sub-agents, Arena Mode, mind the privacy risks
│
├─ Google ecosystem integration → Antigravity CLI
│   Closed source, Gemini-first, 121 commands
│
└─ Lowest cost (accepting training-rights trade) → Muse Code (early beta)
    Contributor plan 20x discount, quality still catching up
```

If you need production use right now, choose Claude Code or Pi v2 — both are stable, just in different directions (full-featured vs. minimal).

If you're willing to take beta / pre-release risk, pick the specific capability you need most — multi-session (Opencode 2), full Rust (OMP 2), everything-is-a-plugin (dsh).

If you're in a model maker's ecosystem, that maker's agent is the natural starting point — but be clear about what you're accepting (closed source, single-model bias, potential privacy risks).

## What to Watch Next

From the perspective of [harness evolution](/posts/ai/2026-03-28-harness-engineering-evolution), H2 2026 is **a divergence period for harness methodology**. Previously, everyone was on the same path — letting models use tools, adding context, building safety checks. Now the path forks:

- Whether to build the entire runtime yourself (OMP 2)
- Whether to make every harness layer swappable (dsh)
- Whether to turn the agent into a programmable service (Opencode 2)
- Whether to upgrade the foundation without changing positioning (Pi v2)
- Whether model makers should vertically integrate (Antigravity, Muse Code, Grok Build)

Beyond the approach debate, three structural questions will surface in the next six months:

**Trust standards.** The Grok Build privacy incident proved "open source" doesn't equal "safe." What trust mechanisms do coding agents need? Auditing, sandboxing, traffic monitoring, data retention policies — there's no industry consensus yet.

**Consolidation pressure.** 110+ CLIs can't all survive. Which get acquired, which stop maintenance, which find a niche — the consolidation period may begin in H1 2027.

**Skill portability.** `.claude/skills/` is already read by multiple frameworks. If the skill format becomes a de facto standard, switching costs between frameworks drop significantly — this works against model makers' walled-garden strategies.

These approaches won't produce clear winners immediately. What matters isn't who has the most stars in August 2026, but which approach produces the most reliable production deployments by mid-2027.

Stars measure attention, not quality. A framework with 184,000 stars and one with 26,000 may end up with the latter proving more reliable — we don't know yet.

The one thing that's certain: [harness design matters more than the model itself](/posts/ai/2026-08-10-model-component-harness-system). Eight frameworks rewriting simultaneously and three model makers entering at once shows every participant in this space agrees on that premise — the disagreement is only about "then how should the harness be built" and "who should build it."

## References

- Internal: [OMP 2: From Pi Fork to Full Rust Rewrite](/posts/tech/2026-08-22-omp-2-rust-rewrite-coding-harness-en) (in Chinese)
- Internal: [Pi v2: AgentHarness API Goes Stable](/posts/tech/2026-08-22-pi-v2-agent-harness-api-stable-en) (in Chinese)
- Internal: [Opencode 2: Bun to Node, Tauri to Electron](/posts/tech/2026-08-22-opencode-2-electron-rewrite-coding-agent-en) (in Chinese)
- Internal: [DeepSeek Harness (dsh): Everything is a Plugin](/posts/tech/2026-08-22-deepseek-harness-dsh-plugin-kernel-en) (in Chinese)
- Internal: [Antigravity CLI: Google Replaces Gemini CLI with Go Rewrite](/posts/tech/2026-08-24-antigravity-cli-gemini-replacement-google-en) (in Chinese)
- Internal: [Muse Code: Meta's First Coding Agent](/posts/tech/2026-08-24-muse-code-meta-coding-agent-en) (in Chinese)
- Internal: [Grok Build: xAI's Privacy Incident](/posts/tech/2026-08-24-grok-build-xai-privacy-incident-en) (in Chinese)
- Internal: [Amp: Sourcegraph's Frontier Agent](/posts/tech/2026-08-19-amp-frontier-agent-en) (in Chinese)
- Internal: [Codex CLI: OpenAI's Coding Agent](/posts/tech/2026-03-31-codex-cli-openai-coding-agent-en) (in Chinese)
- Internal: [Claw Code: Rust Reimplementation of Claude Code](/posts/ai/2026-04-05-claw-code-rust-claude-code-reimplementation-en) (in Chinese)
- Internal: [Hermes Agent: Terminal Backends](/posts/ai/2026-08-18-hermes-agent-terminal-backends-en) (in Chinese)
- Internal: [omp v1: The Batteries-Included Fork](/posts/tech/2026-08-19-omp-oh-my-pi-batteries-included-fork-en) (in Chinese)
- Internal: [Pi: A Minimalist Coding Harness](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness-en) (in Chinese)
- Internal: [Opencode: Open-Source AI Terminal Coding Agent](/posts/tech/2026-03-31-opencode-ai-terminal-coding-agent-en) (in Chinese)
- Internal: [Gemini CLI: Google's Terminal Agent](/posts/tech/2026-03-31-gemini-cli-google-terminal-agent-en) (in Chinese)
- Internal: [The model is just a component — the harness is the system](/posts/ai/2026-08-10-model-component-harness-system) (in Chinese)
- Internal: [From Prompt to Harness: Three Evolutions of AI Engineering](/posts/ai/2026-03-28-harness-engineering-evolution) (in Chinese)
- [OMP 2 (GitHub)](https://github.com/can1357/oh-my-pi)
- [Pi (GitHub)](https://github.com/earendil-works/pi)
- [Opencode (GitHub)](https://github.com/anomalyco/opencode)
- [DeepSeek Harness (GitHub)](https://github.com/deepseek-ai/deepseek-harness)
- [Grok Build (GitHub)](https://github.com/xai-org/grok-build)
- [Codex CLI (GitHub)](https://github.com/openai/codex)
- [Cereblab privacy research report](https://cereblab.com/research/grok-build-privacy)
