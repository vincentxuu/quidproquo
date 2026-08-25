---
title: "Muse Code: Meta's First Coding Agent, Trading Training Rights for a 20x Discount"
date: 2026-08-24
category: tech
type: deep-dive
tags: [muse-code, coding-agent, cli, meta, ai-tools, harness-engineering, llm-pricing]
lang: en
series:
  name: "Agent CLI 選型指南"
  order: 28
tldr: "In August 2026, Meta Superintelligence Labs released Muse Code beta. Closed-source static binary, Muse Spark 1.2 model, parallel persistent sub-agents with worktree isolation. The biggest controversy is pricing: Standard at $1.25/$4.25 per M tokens, or Contributor at $0.10/$0.20 — 20x cheaper, but your code enters Meta's training pipeline."
description: "Meta Muse Code technical architecture: Muse Spark 1.2 model co-trained with harness, persistent sub-agents, worktree isolation, event log crash recovery, and the Contributor pricing training-rights trade-off."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-24-muse-code-meta-coding-agent)

On August 5, 2026, Meta Superintelligence Labs released [Muse Code](https://musecodes.io) in early beta — Meta's first terminal-native coding agent. The team is led by Alexandr Wang (Meta's Chief AI Officer, former Scale AI founder).

Muse Code has several interesting technical design choices. But what's discussed most isn't the technology — it's the pricing model: you can pay standard rates, or let Meta train on your code for a 20x discount.

## Technical Architecture

### Static Binary

Muse Code ships as a single statically-linked binary (`muse`), with no Node.js, Python, or Homebrew dependency. Implementation language undisclosed.

```bash
curl -fsSL https://dev.meta.ai/install.sh | bash
```

Installs to `~/.local/bin/muse` with built-in auto-updates (checks hourly; `MUSE_NO_AUTO_UPDATE=1` to disable). Supports macOS and Linux (x86_64 / arm64); Windows requires WSL2.

### Append-Only Event Log

Muse Code records every session operation as an append-only event log, enabling crash recovery and session resumption:

```bash
muse resume
```

After a crash or manual interruption, sessions can continue from their last state. This aligns with [OMP 2](/posts/tech/2026-08-22-omp-2-rust-rewrite-coding-harness-en)'s content-addressed blob storage + append-only transcripts and [Pi v2](/posts/tech/2026-08-22-pi-v2-agent-harness-api-stable-en)'s lane-based durable sessions — [session durability](/posts/ai/2026-08-22-harness-competition-h2-2026-landscape-en) is becoming a shared evolutionary direction across all harnesses.

### Persistent Sub-Agents + Worktree Isolation

Muse Code's sub-agents are persistent — they survive across subtasks within a session, not recreated each time. Write-capable sub-agents execute in isolated git worktrees, leaving the user's working directory untouched.

This design choice is notable: most coding agents' sub-agents are ephemeral. Persistent sub-agents mean they can accumulate context, but also mean more complex lifecycle management.

## Model: Muse Spark 1.2

Muse Spark 1.2 is Meta's proprietary coding-focused model, distinguished by being **co-trained with the agent harness** — model behavior and agent goals are optimized as one unit, rather than training the model first and fitting the agent loop after.

Parameter count is undisclosed. Community-observed throughput on OpenRouter (~150-180 tok/s) suggests it may be smaller than frontier framing implies.

Meta separately released [Muse Glimmer 30B](https://huggingface.co/meta-llama) (29.6B dense, distilled from Spark, Apache 2.0, 131K context), but this isn't the model Muse Code uses by default.

### Benchmarks (Meta's own evaluation, not independently verified)

| Benchmark | Muse Spark 1.2 | Opus 5 (Claude Code) | GPT-5.6 Terra (Codex) |
|---|---|---|---|
| Terminal-Bench 2.1 | 82.9% | **86.7%** | 81.8% |
| DeepSWE 1.1 | 59.3% | **65.0%** | 64.8% |
| Meta Internal | 70.6% | **79.4%** | 65.4% |

Meta acknowledges trailing Opus 5 on all disclosed benchmarks. Muse Code's differentiation isn't quality — it's price.

## Pricing: Trading Training Rights for Discounts

| Plan | Input | Cached Input | Output |
|---|---|---|---|
| **Standard** | $1.25/M tokens | $0.15/M | $4.25/M |
| **Contributor** | $0.10/M tokens | $0.002/M | $0.20/M |

The Contributor plan is up to 20x cheaper, but **explicitly grants Meta rights to train on your prompts and completions**.

This is Muse Code's biggest controversy. For individual developers working on open-source projects, Contributor pricing is very attractive. For enterprise users, code entering Meta's training pipeline is a direct compliance risk. There's no granular opt-out within the Contributor plan — it's all-or-nothing.

This pricing model is unique in the coding agent space. Claude Code, [Antigravity CLI](/posts/tech/2026-08-24-antigravity-cli-gemini-replacement-google-en), and other commercial tools keep pricing and training data rights separate. Muse Code bundles them together.

## Risks

**Beta is beta.** Community reports quality issues — refactors leaving dead code, restructuring that's shallow.

**Benchmarks not independently verified.** The table above is Meta's own evaluation, not on official leaderboards. Comparisons cherry-picked GPT-5.6 Terra rather than higher-tier models.

**Closed-source binary + auto-updates.** You can't audit the `muse` binary's behavior, and it auto-updates hourly by default. After [Grok Build's privacy incident](/posts/tech/2026-08-24-grok-build-xai-privacy-incident-en), trust costs for closed-source coding agents are higher.

**Muse Spark 1.2 weights not open-sourced.** Zuckerberg announced open-sourcing plans on August 10, but only the distilled Glimmer 30B is Apache 2.0 so far.

## Comparison with Other Coding Agents

| | Muse Code | Claude Code | Antigravity CLI | dsh |
|---|---|---|---|---|
| Open source | Closed | Closed | Closed | MIT |
| Model | Muse Spark 1.2 | Claude | Multi-model | Bring your own |
| Sub-agents | Persistent + worktree | Single session | Built-in orchestrator | Cordis plugin |
| Pricing feature | Training rights for discount | Subscription | Quota-based | Bring API key |
| Session durability | Event log + resume | Yes | Unknown | Swappable plugin |

## Overall

Muse Code's technical architecture has noteworthy choices — persistent sub-agents, event log crash recovery, model and harness co-training. These aren't common in other agents.

But it faces two core problems: quality is still catching up (Meta's own benchmarks trail Claude Code by 4-9 points), and the trust cost of its pricing model. The Contributor plan's 20x discount is tempting, but "trading code for a discount" is a tough sell in enterprise compliance reviews.

In the [H2 2026 harness competition](/posts/ai/2026-08-22-harness-competition-h2-2026-landscape-en), Muse Code represents the trend of model makers entering the agent space directly — not just providing APIs for others to build harnesses, but building the harness themselves. Google's [Antigravity CLI](/posts/tech/2026-08-24-antigravity-cli-gemini-replacement-google-en) and xAI's [Grok Build](/posts/tech/2026-08-24-grok-build-xai-privacy-incident-en) are the same direction.

## References

- [Muse Code official website](https://musecodes.io)
- [Muse Code documentation](https://dev.meta.ai/docs/muse-code/)
- [Muse Glimmer 30B (Hugging Face)](https://huggingface.co/meta-llama)
- Internal: [OMP 2: From Pi Fork to Full Rust Rewrite](/posts/tech/2026-08-22-omp-2-rust-rewrite-coding-harness-en) (in Chinese)
- Internal: [Pi v2: AgentHarness API Goes Stable](/posts/tech/2026-08-22-pi-v2-agent-harness-api-stable-en) (in Chinese)
- Internal: [DeepSeek Harness (dsh): Everything is a Plugin](/posts/tech/2026-08-22-deepseek-harness-dsh-plugin-kernel-en) (in Chinese)
- Internal: [The H2 2026 Harness War](/posts/ai/2026-08-22-harness-competition-h2-2026-landscape-en) (in Chinese)
