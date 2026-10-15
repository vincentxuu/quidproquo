---
title: "Benchmark Shift | Arena Agent Leaderboard: Claude Fable 5.1 Back in Third, GPT-6 Sol Drops From Third to Seventh in a Day"
date: 2026-10-15
category: daily
type: digest
tags: [ai-agent, benchmark, daily, arena]
lang: en
description: "Arena Agent leaderboard, 10-13 batch: the third spot changes hands again — Claude Fable 5.1 (Max) returns to third at 14.32% while GPT-6 Sol (Max), which had just entered the top three, falls to seventh; the top six's confidence intervals all overlap"
tldr: "Arena Agent leaderboard published 10-13: Claude Opus 5.5 (Max) stays first at 17.01%; GPT-6.1 Sol (Max) second at 15.05%; Claude Fable 5.1 (Max) climbs from sixth back to third (11.74%→14.32%); GPT-6 Sol (Max) falls from third to seventh (12.60%→10.51%). Three releases in one week, three changes in third place, and overlapping 95% confidence intervals across the top six — the ranks themselves shouldn't drive model selection."
series:
  name: "AI Benchmark Watch"
  order: 6
---

> 🌏 [繁體中文版](/posts/daily/2026-10-15-benchmark-arena-agent-fable-5-1)

## Shift Summary

The Arena Agent leaderboard published a new batch on 2026-10-13, and third place changed again: Claude Fable 5.1 (Max) climbed back from sixth to third, while GPT-6 Sol (Max), which had only just entered the top three in the 10-12 batch, fell to seventh. First place, Claude Opus 5.5 (Max), held, and GPT-6.1 Sol (Max) kept second. Across the 10-08, 10-12 and 10-13 releases, third place went Fable 5.1, GPT-6 Sol, Fable 5.1 — and that back-and-forth is itself the signal worth recording today.

## Ranking Changes

### Arena Agent Leaderboard — 2026-10-13 (official release)

| Rank | Model | Score | 95% CI | 10-12 score (rank) | Change |
|---|---|---|---|---|---|
| 🥇 | Claude Opus 5.5 (Max) | 17.01% | [13.50%, 20.53%] | 17.89% (1) | — |
| 🥈 | GPT-6.1 Sol (Max) | 15.05% | [12.95%, 17.16%] | 13.81% (2) | — |
| 🥉 | Claude Fable 5.1 (Max) | 14.32% | [12.28%, 16.37%] | 11.74% (6) | ↑3 |
| 4 | GPT-6 Astra (Max) | 13.69% | [11.35%, 16.03%] | 12.34% (5) | ↑1 |
| 5 | Gemini 4 Argon (High) | 13.59% | [12.01%, 15.17%] | 12.37% (4) | ↓1 |
| 6 | Claude Sonnet 5.5 (Max) | 13.00% | [9.83%, 16.16%] | 10.75% (7) | ↑1 |
| 7 | GPT-6 Sol (Max) | 10.51% | [8.21%, 12.82%] | 12.60% (3) | ↓4 |

Source: [Arena Leaderboard Dataset](https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset) (`agent` subset, `latest` split) · official release date: 2026-10-13 · fetched: 2026-10-15 · 10-12 figures from the [previous Benchmark Shift post](/posts/daily/2026-10-14-benchmark-arena-agent-gpt-6-sol-en)

SWE-bench Verified's top five scores and ranks are unchanged from last time (79.2/79.2/78.8/77.4/76.8).

## Analysis: What This Reshuffle Means

### Technical

The gaps are tighter than in the last batch: second through sixth all sit between 13.00% and 15.05%, a spread of just 2.05 points. First-place Opus 5.5 (Max) again has among the fewest samples, 6,025 sessions, while fifth-place Gemini 4 Argon (High) has 26,905 — more than four times as many. Low-sample models naturally swing between batches, and Fable 5.1 (16,212 sessions) and GPT-6 Sol (6,664 sessions) each moved more than 2 points in two days.

### Methodology

⚠️ Arena scores are relative win-rate scores, not Elo; across batches, only order and magnitude are meaningful.

The confidence intervals matter more: for second through sixth, the 95% CI lower bounds run from 9.83% to 12.95% and the upper bounds from 15.17% to 17.16%, overlapping heavily; even first place's lower bound of 13.50% falls inside every interval from second to sixth. Statistically, the order of these six models can't be distinguished. Third place changing three times in a week is exactly what random movement within overlapping intervals looks like, not models getting stronger or weaker.

### Industry

For teams choosing a model, this table tells you which models sit in the same tier, not who's number one. Prices within that tier vary a lot: Claude Opus 5.5 is $4/$20 per million tokens, GPT-6.1 Sol is $2/$10, and Gemini 4 Argon is $2/$10 through November 30 and [$4/$20 from December 1](https://ai.google.dev/gemini-api/docs/pricing). When scores can't be separated statistically, testing on your own tasks and comparing cost per task is more reliable than chasing leaderboard rank.

## Today's Takeaway

In the last post I read GPT-6 Sol's jump into the top three as "this batch happened to suit its strengths" — and a day later it fell back to seventh. That corrected how I read this board: on a leaderboard with overlapping confidence intervals, a single batch's rank jump doesn't need an explanation; a model holding the same position over several batches is what's worth explaining.

## References

- [Arena Leaderboard Dataset — Hugging Face](https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset)
- [Arena Leaderboard](https://lmarena.ai/leaderboard)
- [SWE-bench leaderboards data — GitHub](https://github.com/SWE-bench/swe-bench.github.io/blob/master/data/leaderboards.json)
- [Gemini API pricing — Google AI for Developers](https://ai.google.dev/gemini-api/docs/pricing)
- [Benchmark Shift | Arena Agent leaderboard: GPT-6 Sol enters the top three (10-12 batch)](/posts/daily/2026-10-14-benchmark-arena-agent-gpt-6-sol-en)
