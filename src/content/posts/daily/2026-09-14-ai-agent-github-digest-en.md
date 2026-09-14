---
title: "AI Agent GitHub Digest — 2026-09-14"
date: 2026-09-14
category: daily
tags: [ai-agent, github, open-source, daily, developer-tools, model-inference, agent-skills]
lang: en
description: "colibri squeezes 2.8T MoE models onto consumer GPUs in pure C, alibaba open-sources its code review agent, OpenMontage wraps full video production into agent skills — today's GitHub trending is pushing toward 'every vertical gets its own agent'"
tldr: "JustVugg/colibri uses memory tiering across storage/RAM/VRAM to run 744B–2.8T MoE models on consumer hardware in pure C; tech-leads-club/agent-skills wants to get supply-chain verification for agent skills sorted out before they become the next npm trust problem; alphaXiv/OpenResearch turns Claude Code / Codex into experiment-running researchers with git-native reproducibility; calesthio/OpenMontage wraps 12 production pipelines, 100+ tools, and 700+ agent skill files into a full video production framework; alibaba/open-code-review open-sources their hybrid 'rule engine + LLM agent' code review tool; Claude Code v2.1.269 raises the Workflow tool's concurrent agent cap to 256"
series:
  name: "AI Agent GitHub Digest"
  order: 30
---

## Today's Highlights

Today's trending runs on two parallel tracks: on one side, agents are pushing into increasingly specialized verticals — OpenMontage wraps an entire video post-production pipeline into agent skills, Alibaba puts its "rule engine + LLM agent" hybrid code review system on GitHub, and OpenResearch turns coding agents like Claude Code and Codex into experiment-running researchers. On the other side, there's the infrastructure work that makes all of this cheaper and safer to run — colibri uses pure C to squeeze 2.8T-parameter MoE models onto consumer GPUs, and tech-leads-club wants to establish supply-chain verification for agent skills before the trust problem becomes unmanageable.

## Trending Repos

### JustVugg/colibri ⭐ 29,375 (+960)

[GitHub](https://github.com/JustVugg/colibri)　·　C　·　Apache-2.0

- **What it is**: A zero-dependency inference engine written in pure C that runs 744B to 2.8T-parameter frontier MoE models (GLM-5.3, Kimi K3, DeepSeek V4, etc.) on consumer-grade hardware.
- **Why it matters**: The core idea is treating VRAM, RAM, and disk as a single memory hierarchy — experts stream in from storage only when activated, so the full model never needs to sit in VRAM. The author is refreshingly upfront: "no speed SLA, but a hard semantic guarantee" — running out of memory only slows things down, it never silently drops precision or reroutes experts. For anyone using it as a research platform, that guarantee matters more than throughput numbers.
- **Tech stack**: Pure C + storage/RAM/VRAM memory tiering + `coli` CLI / web dashboard
- **Getting started**: Easy — `./coli chat` is one line, but getting reasonable speed on a 744B model still requires a decent multi-GPU setup.

---

### tech-leads-club/agent-skills ⭐ 5,538 (+215)

[GitHub](https://github.com/tech-leads-club/agent-skills)　·　TypeScript　·　Custom license

- **What it is**: A verified "skill registry" for AI coding agents like Antigravity, Claude Code, Cursor, and Copilot, where every skill goes through validation before being listed.
- **Why it matters**: Right now, installing an agent skill is essentially "copy a SKILL.md file into a folder" — replaying the early npm era of no signatures and no review. This project is trying to get supply-chain verification in place before skills become the npm of agents, rather than bolting it on after an incident.
- **Tech stack**: TypeScript + npm publishing + skill validation pipeline
- **Getting started**: Easy — npm install and write skills following the SKILL.md convention.

---

### alphaXiv/OpenResearch ⭐ 1,939 (+304)

[GitHub](https://github.com/alphaXiv/OpenResearch)　·　Rust　·　MIT

- **What it is**: A local-first "research agent workbench" that turns Claude Code, Codex, OpenCode, or Cursor into a researcher that reads literature, formulates hypotheses, runs experiments, and writes output.
- **Why it matters**: The interesting part isn't "another agent framework" — it's how reproducibility is baked in with a git-native approach. Each research direction gets its own git worktree, and every run maps to an immutable commit snapshot. The built-in autoresearch mode lets an agent complete a full loop: propose an idea, modify code, run the experiment, read results, decide the next step. Multiple directions can be explored in parallel, with an experiment tree preserving lineage.
- **Tech stack**: Rust + git worktree / experiment tree + Slurm / K8s / Ray / Modal remote compute
- **Getting started**: Medium — `orx up` runs locally, but connecting to remote GPUs or self-hosted compute requires setting up SSH and scheduling yourself.

---

### calesthio/OpenMontage ⭐ 58,268 (+383)

[GitHub](https://github.com/calesthio/OpenMontage)　·　Python　·　AGPL-3.0

- **What it is**: Billed as the first open-source "fully automated video production agent system" — 12 production pipelines, 100+ tools, and 700+ agent skill files packaged into a framework that turns a coding agent into a video production studio.
- **Why it matters**: Unlike AI video tools that animate a few static images and call it a day, this one builds real dynamic sequences from free stock libraries and open data, cuts them into a timeline, and renders the output — script, storyboard, asset generation, and final compositing all handled by agents, with humans only needing to describe what they want in natural language.
- **Tech stack**: Python + FFmpeg + Remotion + Stable Diffusion / Flux (images) + ElevenLabs (voice)
- **Getting started**: Medium — requires API keys for various generative services (image, voice, video models), but operation itself is through an agent conversational interface, no coding needed.

---

### alibaba/open-code-review ⭐ 23,168 (+438)

[GitHub](https://github.com/alibaba/open-code-review)　·　Go　·　Apache-2.0

- **What it is**: The open-source version of Alibaba's battle-tested code review tool, using a "deterministic rule engine + LLM agent" hybrid architecture to catch NPEs, thread-safety issues, XSS, SQL injection, and more, commenting at the line level.
- **Why it matters**: Pure LLM agent code review is unstable and often misses low-hanging bugs that rules can catch reliably. This project splits the work — "rules handle what rules can handle, agents handle what needs contextual understanding" — balancing speed with coverage. It also supports both OpenAI and Anthropic model backends, avoiding vendor lock-in.
- **Tech stack**: Go + multi-language rule engine + LLM agent (OpenAI / Anthropic compatible)
- **Getting started**: Medium — supports Windows / macOS / Linux and can integrate with Claude Code / Codex, but reaching "Alibaba-scale" results requires setting up rule sets and CI integration.

## Notable Releases

### Claude Code v2.1.269

[Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.269)

- **What changed**: New `claude plugin eval` runs a plugin's eval suite and produces a reproducible score report (JSON + HTML); new `/output-style [name]` to switch output styles, works across Remote Control and cloud/headless sessions; Bash tool now includes diffs in tool results when it modifies files (set `bashEditDiffEnabled`); new `CLAUDE_CODE_WORKFLOW_MAX_CONCURRENT_AGENTS` environment variable raises the Workflow tool's concurrent agent cap up to 256 for inference-heavy fan-out workloads.
- **Breaking changes**: None.
- **Impact**: If you're using Claude Code's Workflow tool for multi-agent parallel tasks, the previous concurrency cap may have been a bottleneck — upgrade and set the env var to raise it. If you're building or publishing plugins, `claude plugin eval` gives you quantitative scores before shipping, replacing manual testing.

## Today's Takeaway

I used to think "agent skills" were just a packaging-format competition between Claude Code and Cursor — who has the bigger marketplace wins. But tech-leads-club's "verify before listing" move reminded me that skills, as a new distribution unit, are replaying the early stages of the npm supply-chain trust problem — except this time, what's being distributed can directly control agent behavior. If a malicious skill gets through, the blast radius is larger than a compromised npm package, because the skill doesn't just run in a sandbox — it shapes what the agent decides to do next.

## References

- [JustVugg/colibri — GitHub](https://github.com/JustVugg/colibri)
- [tech-leads-club/agent-skills — GitHub](https://github.com/tech-leads-club/agent-skills)
- [alphaXiv/OpenResearch — GitHub](https://github.com/alphaXiv/OpenResearch)
- [calesthio/OpenMontage — GitHub](https://github.com/calesthio/OpenMontage)
- [alibaba/open-code-review — GitHub](https://github.com/alibaba/open-code-review)
- [GitHub Trending (daily, captured 2026-09-14)](https://github.com/trending?since=daily)
- [Claude Code v2.1.269 Release Notes](https://github.com/anthropics/claude-code/releases/tag/v2.1.269)
