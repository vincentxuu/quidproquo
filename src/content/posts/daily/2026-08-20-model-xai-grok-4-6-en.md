---
title: "Model Card｜Grok 4.6"
date: 2026-08-20
category: daily
tags: [ai-agent, model-release, daily, xai]
lang: en
description: "xAI releases Grok 4.6 — built for long-running agents and visual/interactive tasks, tops GDPVal-AA v2 at 1753 Elo, pricing unchanged at $2/$6"
tldr: "Grok 4.6: 500K-token context window, $2 input / $6 output per 1M tokens (same as 4.5), AA Intelligence Index 61 (tied with GPT-5.6 Sol Max), GDPVal-AA v2 1753 Elo (highest overall), but DeepSWE and Terminal-Bench still trail GPT-5.6 Sol and Claude Fable 5"
series:
  name: "AI Model Tracker"
  order: 3
---

> 🌏 [中文版](/posts/daily/2026-08-20-model-xai-grok-4-6)

## Model Info

| Field | Value |
|---|---|
| Model ID | `grok-4.6` |
| Vendor | xAI |
| Parameters | Not disclosed |
| Context Window | 500,000 tokens |
| Input Pricing (USD/1M tokens) | $2.00 (< 200K prompt tokens) / $4.00 (≥ 200K) |
| Output Pricing (USD/1M tokens) | $6.00 (< 200K prompt tokens) / $12.00 (≥ 200K) |
| Open Source | No |
| Release Date | 2026-08-12 |
| Official Announcement | [xAI News](https://x.ai/news/grok-4-6) |

## Key Capabilities

- Terminal-Bench v3.0 jumped from 15.7% to 26% (+10.3pp) — a major leap in sustained terminal operation
- DeepSWE v1.1 rose from 54% to 65.9% (+11.9pp), showing stronger long-horizon code repair
- GDPVal-AA v2 (knowledge-work evaluation) hit 1753 Elo, surpassing Claude Fable 5 Max's 1741 — the highest publicly reported score
- On full-product prototype generation (visual/interactive projects), single-pass outputs now come with complete structure and visual language, with emerging self-testing and self-verification behavior

## Benchmark Results

| Benchmark | Score | Previous (Grok 4.5 High) | Best Competitor |
|---|---|---|---|
| AA Intelligence Index | 61 | 56 | Claude Fable 5 Max 62 |
| GDPVal-AA v2 | 1753 | 1526 | Claude Fable 5 Max 1741 |
| DeepSWE v1.1 | 65.9% | 54% | GPT-5.6 Sol Max 73% |
| Terminal-Bench v3.0 | 26% | 15.7% | GPT-5.6 Sol Max 34.6% |
| CursorBench v3.2 | 69.9% | 66.7% | Claude Fable 5 Max 70.5% |

⚠️ All figures above are from xAI's own testing or each vendor's published system cards/leaderboards. Competitor scores reflect self-reported bests and await independent reproduction.

## Comparison with Previous Generation and Competitors

Compared to Grok 4.5, Grok 4.6 shows the biggest gains in agentic coding and long-running task execution: Terminal-Bench v3.0 nearly doubled (15.7% → 26%), and DeepSWE v1.1 improved by almost 12 percentage points. xAI attributes this to longer supplementary training runs, regenerated SFT trajectories across reasoning-effort levels and agent harnesses using Grok 4.5, plus agentic RL training covering kernel optimization, web development, CAD, and other domains.

Against competitors, Grok 4.6's AA Intelligence Index score of 61 ties GPT-5.6 Sol Max and sits just 1 point below Claude Fable 5 Max's 62 — statistically even. But in coding-specific benchmarks, Grok 4.6 is not the leader: DeepSWE v1.1 trails GPT-5.6 Sol Max by 7.1pp, and Terminal-Bench v3.0 trails by 8.6pp. Where Grok 4.6 does lead is GDPVal-AA v2, a knowledge-work evaluation, where its 1753 Elo tops both Fable 5 Max and GPT-5.6 Sol Max.

Pricing stays at $2/$6 (under 200K tokens), identical to Grok 4.5 — performance gains with no price increase. Compared to Claude Fable 5's $10/$50, Grok 4.6 is 5x cheaper. However, its 500K-token context window is half the 1M tokens commonly offered by Fable 5, GPT-5.6 Sol, and other peers.

## What This Means for Agent Developers

Grok 4.6's training focused on "sustaining multi-step tasks" rather than simply pushing single-benchmark scores higher, which has direct implications for agent architectures that need long autonomous execution.

- If you're building a coding agent already integrated with Cursor or Grok Build: Grok 4.6 natively supports both toolchains and is starting to exhibit self-testing/verification behavior — good for "produce a complete prototype in one shot" long tasks without human confirmation at every step
- If you're building a knowledge-work agent (research, data analysis, report generation): the top GDPVal-AA v2 score is a signal worth evaluating as a replacement for GPT-5.6 Sol or Fable 5 in your pipeline, with significant token cost savings
- Not recommended for: pure hardcore coding scenarios (large repo refactoring, complex debugging) — DeepSWE and Terminal-Bench still lag GPT-5.6 Sol Max by double-digit percentages; also not ideal for ultra-long-context scenarios, as the 500K-token context window is small for this generation and may still require RAG for very large codebases or long documents

## Takeaway

Grok 4.6 tops the leaderboard on GDPVal-AA v2 (knowledge work) yet trails GPT-5.6 Sol and Fable 5 by double-digit percentage points on hardcore coding benchmarks like DeepSWE and Terminal-Bench. This signals that "knowledge-work agent" and "coding agent" evaluations are diverging into two distinct capability curves. A single composite index (like the AA Intelligence Index) is no longer sufficient — before choosing a model, you need to know which curve your agent scenario falls on.

## References

- [Introducing Grok 4.6 — xAI News](https://x.ai/news/grok-4-6)
- [Grok 4.6 — xAI Developer Docs](https://docs.x.ai/developers/models/grok-4.6)
- [Pricing — xAI Developer Docs](https://docs.x.ai/developers/pricing)
