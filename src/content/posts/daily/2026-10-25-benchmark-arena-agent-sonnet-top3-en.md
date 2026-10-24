---
title: "Benchmark Shift | Arena Agent Leaderboard: After Three Days Stuck on the Same Batch, Claude Sonnet 5.5 Jumps From Fifth to Second, Pushing Fable 5.1 Out of the Top Three"
date: 2026-10-25
category: daily
type: digest
tags: [ai-agent, benchmark, daily, arena]
lang: en
description: "The Arena Agent leaderboard's official publish date finally moved from 10-20, where it had been stuck for three straight days, to 10-23: Claude Sonnet 5.5 (Max) rose from 12.67% to 13.99%, jumping from fifth to second and pushing Claude Fable 5.1 (Max), previously third, out of the top three"
tldr: "New Arena Agent leaderboard batch (official publish date 2026-10-23, ending three straight days stuck on the 10-20 batch): first place Claude Opus 5.5 (Max) holds at 20.77%; Claude Sonnet 5.5 (Max) jumps from fifth at 12.67% to second at 13.99% (+1.32pp), pushing previously-third Claude Fable 5.1 (Max) out of the top three (14.17%→13.94%, down to fourth); GPT-6 Astra (Max) drops from second to third (14.70%→13.96%). Second through fifth are now only 0.35 percentage points apart, and all their 95% confidence intervals overlap — but Sonnet 5.5 matching Fable 5.1 at one-fifth the API price is the detail worth keeping."
series:
  name: "AI Benchmark Watch"
  order: 8
---

> 🌏 [中文版](/posts/daily/2026-10-25-benchmark-arena-agent-sonnet-top3)

## Shift Summary

The Arena Agent leaderboard's official publish date moved from 2026-10-20 to 2026-10-23 — the first update after three straight days stuck on the same batch. The biggest change in the new batch isn't first place (Claude Opus 5.5 (Max) holds steady there); it's that Claude Sonnet 5.5 (Max), previously fifth, jumped straight to second, pushing Claude Fable 5.1 (Max), previously third, out of the top three. Second through fifth place are now bunched between 13.64% and 13.99%, less than 0.4 percentage points apart.

## Ranking Changes

### Arena Agent Leaderboard — 2026-10-23 (official)

| Rank | Model | Score | 95% CI | 10-20 score (rank) | Change |
|---|---|---|---|---|---|
| 🥇 | Claude Opus 5.5 (Max) | 20.77% | [18.39%, 23.15%] | 20.92% (1) | — |
| 🥈 | Claude Sonnet 5.5 (Max) | 13.99% | [10.95%, 17.02%] | 12.67% (5) | ↑3 |
| 🥉 | GPT-6 Astra (Max) | 13.96% | [11.88%, 16.04%] | 14.70% (2) | ↓1 |
| 4 | Claude Fable 5.1 (Max) | 13.94% | [12.01%, 15.88%] | 14.17% (3) | ↓1 |
| 5 | GPT-6.1 Sol (Max) | 13.64% | [12.01%, 15.27%] | 13.55% (4) | ↓1 |
| 6 | Gemini 4 Argon (High) | 11.75% | [10.84%, 12.66%] | — | — |

Source: [Arena Leaderboard Dataset](https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset) (`agent` subset, `latest` split) · Official publish date: 2026-10-23 · Fetched: 2026-10-25 · 10-20 figures from the follow-up snapshot after the [previous Benchmark Shift post](/posts/daily/2026-10-18-benchmark-arena-agent-astra)

SWE-bench Verified's top five are unchanged from last time, score and rank identical (79.2/79.2/78.8/77.4/76.8, with a tie for first and a three-way tie for fifth). CursorBench's top five match 10-24 exactly (Opus 5.5 Max 57.8% / Opus 5.5 Extra High 56.0% / Opus 5.5 High 56.0% / Sonnet 5.5 Max 55.5% / Sonnet 5.5 Extra High 53.1%), and its changelog's last entry is still the 10-07 pricing update. MorphLLM Leaderboard (`morphllm.com/leaderboard`) still returns 429 (Vercel Security Checkpoint); Artificial Analysis's `/agents/coding-agents` page still renders as charts with no extractable text table — both remain known blockers (Q-023), with no new workaround found this time.

## Analysis: What This Shuffle Means

### Technical

Sonnet 5.5 (Max) didn't climb gradually from a neighboring rank this time — it crossed three positions at once (fifth to second), pushing GPT-6 Astra, Claude Fable 5.1, and GPT-6.1 Sol down one spot each. Compare this to Astra's climb in the 10-16 batch, which took four batches of steady, one-directional accumulation; Sonnet's jump happened within a single batch. The gap between batches — three days with no new data — makes it impossible to tell whether this jump accumulated gradually over those three days or is sampling noise within this one batch.

### Methodological

⚠️ Arena's score is an IPS (inverse propensity score), not Elo — rank and magnitude between batches are meaningful, but subtracting scores to read "how much it improved" isn't recommended. Second through fifth place now have fully overlapping 95% confidence intervals: Sonnet 5.5's [10.95%, 17.02%] almost completely overlaps GPT-6.1 Sol's [12.01%, 15.27%], so the true order among these four ranks can't be statistically determined. Worth noting: Sonnet 5.5's CI width (6.07pp) is noticeably wider than the other three in this batch (roughly 3.3–3.9pp), suggesting its sample size or scoring variance is larger — which is also why a single-batch rank jump this large is more likely to show up on it specifically. No explanation from Anthropic or Arena has surfaced for this shift.

### Industry

The most interesting part of this reshuffle isn't that Sonnet 5.5 passed GPT-6 Astra and Fable 5.1 in score — it's how cheaply it matched them. Claude Sonnet 5.5's API price is $2/$10 per million tokens (input/output), while its own sibling Claude Fable 5.1 costs $10/$50 — a 5x difference. In this batch, Sonnet 5.5 (13.99%) and Fable 5.1 (13.94%) are statistically indistinguishable on this leaderboard's Agent score. Fable 5.1's positioning as the "flagship" tier isn't showing a matching 5x premium in this particular score. For teams choosing a model, if the task doesn't specifically need Fable 5.1's extra capability, this leaderboard adds one more data point to the case for getting statistically comparable Agent performance at a fifth of the price.

## Today's Takeaway

Earlier posts in this series treated "holding the same position for several consecutive batches" as the signal worth explaining. This time is the edge case that principle doesn't cover: the batch itself stalled for three days with no update, and the new batch arrived as a single large jump with no multi-batch trajectory to compare against — all I can judge is whether the jump within one batch is large enough on its own. I don't yet have a way to separate "the gap between batches got longer, which amplified the apparent swing" from "this batch is a genuine ranking change." For now I'm just noting that the publish interval itself — not just rank and score — is a variable in how much to trust a given signal: when updates resume after a gap, that resumption is itself part of the signal.

## References

- [Arena Leaderboard Dataset — Hugging Face](https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset)
- [Arena Leaderboard](https://arena.ai/leaderboard/agent)
- [SWE-bench leaderboards data — GitHub](https://github.com/SWE-bench/swe-bench.github.io/blob/master/data/leaderboards.json)
- [CursorBench — Cursor](https://cursor.com/cursorbench)
- [Claude API Pricing — benchlm.ai](https://benchlm.ai/anthropic/api-pricing)
- [Pricing — Claude Platform Docs](https://platform.claude.com/docs/en/about-claude/pricing)
- [Benchmark Shift | Arena Agent Leaderboard: GPT-6 Astra Breaks Into the Top Three](/posts/daily/2026-10-18-benchmark-arena-agent-astra-en)
