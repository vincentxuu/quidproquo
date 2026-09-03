---
title: "Model Card | Muse Spark 1.2"
date: 2026-08-24
category: daily
type: digest
tags: [ai-agent, model-release, daily, meta]
lang: en
description: "Meta releases Muse Spark 1.2 and its first code agent Muse Code — 1M context, pricing unchanged at $1.25/$4.25, GDPval-AA v2 Elo jumps 260 points"
tldr: "Muse Spark 1.2: 1M context window, input $1.25 / output $4.25 per 1M tokens (same as 1.1), AA Intelligence Index 57, GDPval-AA v2 Elo jumps 260 points to 1631 (5th overall), paired with Meta's first code agent Muse Code for long-running multi-agent collaboration"
series:
  name: "AI Model Tracker"
  order: 4
---

> 🌏 [中文版](/posts/daily/2026-08-24-model-meta-muse-spark-1-2)

## Model Information

| Item | Value |
|---|---|
| Model ID | `muse-spark-1.2` (standard) / `muse-spark-1.2-contributor` (training use) |
| Provider | Meta (Meta Superintelligence Labs) |
| Parameters | Undisclosed |
| Context Window | 1,048,576 tokens (~1M) |
| Input Pricing (USD/1M tokens) | $1.25 (standard) / $0.10 (contributor, Meta may use for training) |
| Output Pricing (USD/1M tokens) | $4.25 (standard) / $0.20 (contributor) |
| Open Source | No |
| Release Date | 2026-08-05 |
| Official Announcement | [Meta AI Developer Blog](https://developer.meta.com/ai/resources/blog/build-with-muse-code/) |

## Key Capabilities

- First release paired with Meta's own code agent "Muse Code" (beta), designed for long-running multi-agent collaboration: every sub-agent's trajectory, tool call, and steer/cancel action is observable and replayable
- GDPval-AA v2 (knowledge work evaluation) Elo jumps 260 points to 1631, ranking 5th among all models tested by Artificial Analysis, surpassing Claude Opus 4.8 Max at 1588
- Terminal-Bench v2.1 improves from 78% (1.1) to 80%; τ³-Banking (agentic tool use) from 25% to 27%
- No long-context surcharge: billing rate stays the same regardless of how much of the context window is used; prompt caching is enabled automatically with no extra setup

## Benchmark Results

| Benchmark | Score | Previous (Muse Spark 1.1) | Best Competitor |
|---|---|---|---|
| AA Intelligence Index | 57 | 51 | Claude Opus 5 Max 63.05 |
| GDPval-AA v2 (Elo) | 1631 | 1371 | Claude Opus 4.8 Max 1588 |
| Terminal-Bench v2.1 | 80% | 78% | No directly comparable figure provided |
| τ³-Banking | 27% | 25% | No directly comparable figure provided |

⚠️ AA Intelligence Index and GDPval-AA v2 scores come from independent testing by Artificial Analysis (Meta provided access before the official release). Terminal-Bench v2.1 and τ³-Banking scores are from Meta's official announcement and await independent reproduction.

## Comparison with Previous Generation and Competitors

Compared to Muse Spark 1.1, the biggest improvement is in knowledge-work agent tasks: GDPval-AA v2 Elo jumped from ~1371 to 1631, a 260-point gain. This benchmark tests how well a model uses shell access and web browsing to perform real knowledge-work tasks (e.g., preparing presentations, analyzing reports) and is considered by Artificial Analysis to be the most representative measure of general agentic performance. Terminal-Bench and τ³-Banking saw only modest 2pp gains, suggesting this generation's training focused heavily on knowledge-work scenarios rather than pure coding.

Against competitors, Muse Spark 1.2's AA Intelligence Index (57) still trails Claude Opus 5 Max (63.05), GPT-5.6 Sol Max (60.93), and Kimi K3 Max (59.70), and sits slightly below Qwen3.8 Max (58.08). However, in cost per Intelligence Index task, Muse Spark 1.2 comes in at just $0.40 — the cheapest among all models scoring 56 or above. The nearest competitor in the same score range, GPT-5.6 Terra Max ($0.51), costs 22% more.

Pricing remains at $1.25/$4.25, identical to Muse Spark 1.1, effectively an implicit price cut given the performance gains. But in practice, because 1.2's responses are longer (output token usage increased 78% on the same benchmark), the actual cost of running a full Intelligence Index suite rose 36.6% — the rate card didn't change, but the bill did.

## What This Means for Agent Developers

The real architectural signal here is Muse Code: this is the first time Meta has shipped a "model + agent product that runs the model" together, rather than just releasing an API endpoint. Muse Code emphasizes observability in multi-agent collaboration — every sub-agent trajectory, every tool call, every steer/cancel action can be replayed, which is critical for debugging multi-agent systems.

- If you're building knowledge-work agents (report generation, data analysis, presentation creation): the massive GDPval-AA v2 Elo improvement is a signal worth evaluating as a replacement in your pipeline, especially in budget-sensitive scenarios — it's the cheapest option in its score range
- If you're building multi-agent systems and struggling with debugging: Muse Code's event log (every sub-agent, every tool call replayable) addresses the common pain point of "something went wrong but you can't tell which step," worth studying for its observability design
- Not ideal for: pure hardcore coding scenarios — Terminal-Bench v2.1 only improved by 2pp, limited competitiveness against coding-focused models like GPT-5.6 Sol Max and Claude Opus 5 Max; also watch out for actual bills rising due to longer responses, even when the rate card hasn't changed

## Takeaway

Muse Spark 1.2's rate card is letter-for-letter identical to its predecessor, but because the model's responses grew 78% longer, the actual cost of running the same benchmark suite rose 36.6%. This is a reminder that "pricing unchanged" does not mean "costs unchanged" — when evaluating model upgrades, look at real-world token consumption, not just per-token rates.

## References

- [Meet Muse Spark 1.2 and Muse Code, the first coding agent from Meta — Meta AI Developer Blog](https://developer.meta.com/ai/resources/blog/build-with-muse-code/)
- [Muse Spark 1.2 — Meta for Developers](https://developer.meta.com/ai/models/muse-spark/)
- [Muse Spark 1.2: Improved Agentic Performance at Higher Cost per Task — Artificial Analysis](https://artificialanalysis.ai/articles/muse-spark-1-2)
- [Muse Spark 1.2 (xhigh) — Intelligence, Performance & Price Analysis — Artificial Analysis](https://artificialanalysis.ai/models/muse-spark-1-2)
- [Meta Muse Spark 1.2 pricing: the rate card that never changed — eesel AI](https://www.eesel.ai/blog/meta-muse-spark-12-pricing)
