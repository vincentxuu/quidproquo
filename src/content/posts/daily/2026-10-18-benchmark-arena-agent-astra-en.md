---
title: "Benchmark Shift | Arena Agent Leaderboard: GPT-6 Astra Breaks Into the Top Three After Four Batches Stuck Below It, GPT-6.1 Sol Falls From a Three-Batch Hold on Second to Fourth"
date: 2026-10-18
category: daily
type: digest
tags: [ai-agent, benchmark, daily, arena]
lang: en
description: "Arena Agent leaderboard, 10-16 batch: GPT-6 Astra (Max) hits 14.13%, ending three straight batches stuck at 4th or 5th, and breaks into the top three for the first time; GPT-6.1 Sol (Max), which had held second for three straight batches, drops to fourth as its score falls from 14.78% to 13.60%"
tldr: "Arena Agent leaderboard published 10-16: Claude Opus 5.5 (Max) stays first at 18.88%; GPT-6 Astra (Max) breaks into second at 14.13% after three straight batches stuck at 4th or 5th; GPT-6.1 Sol (Max) ends a three-batch hold on second, dropping to fourth (14.78%→13.60%). The top six's 95% confidence intervals still overlap heavily, but Astra's score rose across four straight batches and Sol's long stable run just ended — a multi-batch positional shift like this is worth more than a single batch's rank jump."
series:
  name: "AI Benchmark Watch"
  order: 7
---

> 🌏 [繁體中文版](/posts/daily/2026-10-18-benchmark-arena-agent-astra)

## Shift Summary

The Arena Agent leaderboard published a new batch on 2026-10-16: GPT-6 Astra (Max) broke into the top three at 14.13%, ending three straight batches (10-12, 10-13, 10-14) stuck at fourth or fifth. The model it displaced was GPT-6.1 Sol (Max), which had held second for three straight batches — its score fell from 14.78% last batch to 13.60%, dropping it to fourth. First place, Claude Opus 5.5 (Max), held and even pulled further ahead at 18.88%. Unlike the last shift (the 4th/5th swap between 10-13 and 10-14), this one breaks a position each model had held stable for three consecutive batches — not a single batch's random wobble.

## Ranking Changes

### Arena Agent Leaderboard — 2026-10-16 (official release)

| Rank | Model | Score | 95% CI | 10-14 score (rank) | Change |
|---|---|---|---|---|---|
| 🥇 | Claude Opus 5.5 (Max) | 18.88% | [16.14%, 21.61%] | 17.18% (1) | — |
| 🥈 | GPT-6 Astra (Max) | 14.13% | [11.83%, 16.43%] | 13.69% (5) | ↑3 |
| 🥉 | Claude Fable 5.1 (Max) | 14.03% | [12.04%, 16.03%] | 14.12% (3) | — |
| 4 | GPT-6.1 Sol (Max) | 13.60% | [11.70%, 15.51%] | 14.78% (2) | ↓2 |
| 5 | Gemini 4 Argon (High) | 13.23% | [11.90%, 14.56%] | 13.73% (4) | ↓1 |
| 6 | Claude Sonnet 5.5 (Max) | 12.99% | [9.86%, 16.11%] | — | new to top 10 |
| 7 | GPT-6 Sol (Max) | 10.31% | [8.21%, 12.41%] | — | — |

Source: [Arena Leaderboard Dataset](https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset) (`agent` subset, `latest` split) · official release date: 2026-10-16 · fetched: 2026-10-18 · 10-14 figures from the [previous Benchmark Shift post](/posts/daily/2026-10-15-benchmark-arena-agent-fable-5-1-en) and the standing snapshot

SWE-bench Verified's top five scores and ranks are unchanged from last time (79.2/79.2/78.8/77.4/76.8, with a two-way tie at first and a three-way tie at fifth). The MorphLLM Leaderboard (`morphllm.com/leaderboard`) still returns a 429 Vercel Security Checkpoint. Artificial Analysis moved its agentic evaluation page from the old URL (`/models/capabilities/agentic`) to `/agents/coding-agents`, but the data is still chart-rendered with no extractable text table — both remain the known blockers tracked under Q-023, with no new workaround found this time.

## Analysis: What This Reshuffle Means

### Technical

The notable thing here isn't a single batch's rank jump — it's two models each finishing out a multi-batch trajectory before crossing paths. GPT-6 Astra (Max)'s score across the 10-12 through 10-16 batches ran 12.34%→13.69%→13.69%→14.13%, never dropping, and it took three batches to climb from 4th/5th to second. GPT-6.1 Sol (Max), meanwhile, held second steadily across 10-12 through 10-14 (13.81%→15.05%→14.78%) before suddenly dropping to 13.60% and fourth this batch. One trajectory rising, one falling, crossing in this 10-16 batch.

### Methodology

⚠️ Arena's score is an IPS (inverse propensity score), not Elo; swings between batches should be read as order and magnitude only, not subtracted and interpreted as "how much it improved."

The confidence intervals still overlap: GPT-6 Astra's [11.83%, 16.43%] and GPT-6.1 Sol's [11.70%, 15.51%] sit almost entirely on top of each other, so statistically the order between these two still can't be distinguished. But what's worth noting this time isn't this batch's order — it's that the pattern of "holding the same position across three straight batches" just broke, in both directions. The lesson from the 10-15 post was that a single batch's rank jump doesn't need explaining, but a model holding the same position over several batches does — this is exactly that case: Sol's three-batch stable run ended, and so did Astra's three-batch holding pattern, in opposite directions. No official explanation from OpenAI or Arena turned up for this shift. The community has consistently positioned GPT-6.1 Sol as "Astra Lite" — approaching Astra's score at a much lower cost — and this rank swap doesn't change that positioning; it's more likely normal movement within an overlapping range that happened to hold its direction long enough to register.

### Industry

After this swap, the cost gap between the two matters more than the score gap. GPT-6 Astra (Max) averages 30K tokens per task and GPT-6.1 Sol (Max) averages 30.9K — nearly identical usage — but Astra's API price is $10/$50 per million tokens (input/output) against Sol's $2/$10, a 5x difference that flows straight through to task cost: $3.53 per task for Astra versus $0.71 for Sol. The score gap that buys is 14.13% versus 13.60%, 0.53 points, still inside overlapping confidence intervals. For teams choosing a model, this swap doesn't change the underlying conclusion: if a task doesn't need whatever extra capability Astra brings, Sol gets a statistically indistinguishable score at a fifth of the cost — still the more sensible default.

## Today's Takeaway

The 10-15 post wrote down "a position held across several batches is what's worth explaining" as a working rule, and this is a clean case of it: not single-batch noise, but two models crossing paths only after each finished out a three-batch stable run. Applying that rule also surfaced its limit — "stable for three batches" and "stable for thirty batches" shouldn't carry the same statistical weight, and I don't yet have a clear batch-count threshold for that. For now I'm just noting honestly that this is a multi-batch pattern, not single-batch noise, and leaving the threshold itself to be calibrated once more batches come in.

## References

- [Arena Leaderboard Dataset — Hugging Face](https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset)
- [Arena Leaderboard](https://arena.ai/leaderboard/agent)
- [SWE-bench leaderboards data — GitHub](https://github.com/SWE-bench/swe-bench.github.io/blob/master/data/leaderboards.json)
- [Introducing GPT-6.1 Sol — OpenAI](https://openai.com/index/introducing-gpt-6-1-sol/)
- [GPT-6 Astra — OpenAI](https://openai.com/index/gpt-6-astra/)
- [Benchmark Shift | Arena Agent Leaderboard: Claude Fable 5.1 back in third (10-13 batch)](/posts/daily/2026-10-15-benchmark-arena-agent-fable-5-1-en)
