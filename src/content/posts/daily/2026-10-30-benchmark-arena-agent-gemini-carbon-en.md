---
title: "Benchmark Watch | Arena Agent Leaderboard: After Seven Days Stuck on the Same Batch, Gemini 4 Carbon Debuts at #2, Pushing Sonnet 5.5 to Third"
date: 2026-10-30
category: daily
type: digest
tags: [ai-agent, benchmark, daily, arena, gemini]
lang: en
description: "The Arena Agent leaderboard's official publish date finally moved from 10-23, where it had been stuck for seven straight days, to 10-28: Google's Gemini 4 Carbon (High), announced the same day and currently restricted to cyber-defender testers, debuts straight into second place at 16.04%, pushing Claude Sonnet 5.5 (Max) from second to third"
tldr: "New Arena Agent leaderboard batch (official publish date 2026-10-28, ending seven straight days stuck on the 10-23 batch): first place Claude Opus 5.5 (Max) holds at 20.94%; Google's Gemini 4 Carbon (High), announced on 10-28 and currently limited to cyber-defender testers, debuts straight into second place at 16.04%, pushing previously-second Claude Sonnet 5.5 (Max) to third (13.99%→13.84%); GPT-6 Astra (Max) falls hardest, from third to fifth (13.96%→12.96%), overtaken by Claude Fable 5.1 (Max), whose rank stays fourth but whose score dropped less (13.94%→13.35%). Carbon's 95% CI lower bound (15.04%) still sits above Sonnet's point estimate (13.84%) — one of the few rank gaps in this batch that actually holds up statistically."
series:
  name: "AI Benchmark Watch"
  order: 9
---

> 🌏 [中文版](/posts/daily/2026-10-30-benchmark-arena-agent-gemini-carbon)

## Summary

The Arena Agent leaderboard's official publish date moved from 2026-10-23 to 2026-10-28 — the first update after seven straight days stuck on the same batch. The biggest change in the new batch isn't first place (Claude Opus 5.5 (Max) holds steady); it's Gemini 4 Carbon (High), a Google DeepMind model announced that same day and currently open only to a small group of cyber-defender testers, debuting straight into second place. That pushes the previously-second Claude Sonnet 5.5 (Max) to third. GPT-6 Astra (Max), previously third, falls even further, to fifth — overtaken by Claude Fable 5.1 (Max), whose rank didn't move but whose score dropped by less.

## Ranking Changes

### Arena Agent Leaderboard — 2026-10-28 (official publish)

| Rank | Model | Score | 95% CI | 10-23 score (rank) | Change |
|---|---|---|---|---|---|
| 🥇 | Claude Opus 5.5 (Max) | 20.94% | [18.79%, 23.09%] | 20.77% (1) | — |
| 🥈 | Gemini 4 Carbon (High) | 16.04% | [15.04%, 17.04%] | New entry | 🆕 |
| 🥉 | Claude Sonnet 5.5 (Max) | 13.84% | [11.19%, 16.49%] | 13.99% (2) | ↓1 |
| 4 | Claude Fable 5.1 (Max) | 13.35% | [11.46%, 15.25%] | 13.94% (4) | — |
| 5 | GPT-6 Astra (Max) | 12.96% | [10.94%, 14.98%] | 13.96% (3) | ↓2 |
| 6 | GPT-6.1 Sol (Max) | 12.47% | [11.39%, 13.54%] | 13.64% (5) | ↓1 |
| 7 | Gemini 4 Argon (High) | 10.73% | [9.91%, 11.54%] | 11.75% (6) | ↓1 |

Source: [Arena Leaderboard Dataset](https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset) (`agent` subset, `latest` split) · Official publish date: 2026-10-28 · Retrieved: 2026-10-30 · 10-23 figures from [the previous Benchmark Watch piece](/posts/daily/2026-10-25-benchmark-arena-agent-sonnet-top3-en)

SWE-bench Verified's top five are byte-identical to last time (79.2 / 79.2 / 78.8 / 77.4 / 76.8, with a tie for first and a three-way tie for fifth) — no change. CursorBench's top five also match last time (Opus 5.5 Max 57.8% / Opus 5.5 Extra High 56.0% / Opus 5.5 High 56.0% / Sonnet 5.5 Max 55.5% / Sonnet 5.5 Extra High 53.1%), and its changelog's last entry is still the 10-07 pricing update. Artificial Analysis's `/agents/coding-agents` page still renders as charts with no extractable text table — the same known blocker (Q-023) as before; the AA Coding Agent Index was not re-verified this time.

## Analysis: What This Shuffle Means

### Technical angle

Gemini 4 Carbon is a next-generation frontier model Google DeepMind [officially announced](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/) on 10-28 — just two weeks after Gemini 4 Argon shipped. Arena's own account [posted the same day](https://x.com/arena/status/2115495002998751262) that Carbon landed #2 in Agent Arena, #1 in Text Arena, and #4 in WebDev Arena, placing on the Pareto frontier of all three at once. Debuting straight into second place isn't the gradual climb we've tracked in past posts (a single model nudging up a notch batch after batch) — it's a brand-new model entering with a high score in one shot, a fundamentally different kind of signal. Worth noting: Carbon's sample size (3.58M observations, 26,511 sessions) already exceeds first-place Opus 5.5's (2.02M observations, 13,584 sessions) — this isn't a small-sample fluke.

### Methodology angle

⚠️ These scores come from Arena's own IPS (inverse propensity score) blind-voting results, not a vendor self-test, which makes them more credible than a self-reported benchmark. But Carbon [isn't publicly available yet](https://arstechnica.com/ai/2026/10/google-announces-gemini-4-carbon-its-latest-frontier-ai-model-that-you-cant-use/) — it's limited to a small group of testers in Google's "Fairwind Program" for cyber defenders; developers, businesses, and ordinary consumers don't have access. That means the 26,511 sessions behind this score come from a tester population, not the general public, and the sample composition may not match how the model gets used once it's actually released. On confidence intervals: Carbon's 95% CI lower bound (15.04%) still sits above Sonnet 5.5's point estimate (13.84%) — Carbon's rank gap is one of the few in this batch that holds up statistically, even though the intervals technically overlap. By contrast, Sonnet 5.5, Fable 5.1, and Astra have CIs that overlap almost entirely; the true ordering of ranks 3 through 5 can't be statistically distinguished.

### Industry angle

The detail worth keeping here isn't that Carbon landed second — it's how cheaply it got there. Arena's own figures put Carbon's median cost per task in Agent Arena at $1.80, 72% lower than first-place Claude Opus 5.5 (Max). In other words: a model that isn't even publicly available yet, debuting into a statistically defensible second place, costs less than a third of what the current leader costs per task. If that cost structure holds once Carbon is generally available, it's a signal worth remembering for teams currently weighing model mixes. There's also a knock-on effect buried in the table: inserting Carbon at #2 didn't just push everyone below it down a slot — Astra's score drop (-1.00pp) was notably larger than Fable 5.1's (-0.59pp), which also flipped their relative order. A single new model entering the leaderboard moved more than just its own neighbors; it rearranged the pecking order underneath it too.

## Today's Takeaway

Every reshuffle we've tracked so far has been existing models overtaking each other. This one is a brand-new model dropping straight in — and the model that dropped in isn't even something I can use myself yet. That's a reminder that "the name on the leaderboard" and "the option actually available today" are two different things, especially for a release cadence like Carbon's: a narrow security-testing channel first, then a gradual widening. The leaderboard can reflect a new ranking weeks before real-world availability catches up. Tracking benchmarks like this isn't just about recording rank changes — it also means recording who can actually get their hands on the model behind that rank.

## References

- [Arena Leaderboard Dataset — Hugging Face](https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset)
- [Arena Leaderboard](https://arena.ai/leaderboard/agent)
- [Gemini 4 Carbon: our next frontier model — Google Blog](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/)
- [Arena.ai's official post on Gemini 4 Carbon's three-leaderboard debut — X](https://x.com/arena/status/2115495002998751262)
- [Google announces Gemini 4 Carbon, its latest frontier AI model that you can't use — Ars Technica](https://arstechnica.com/ai/2026/10/google-announces-gemini-4-carbon-its-latest-frontier-ai-model-that-you-cant-use/)
- [SWE-bench leaderboards data — GitHub](https://github.com/SWE-bench/swe-bench.github.io/blob/master/data/leaderboards.json)
- [CursorBench — Cursor](https://cursor.com/cursorbench)
- [Previous piece | Benchmark Watch: Arena Agent leaderboard, three-day-stuck batch finally advances, Claude Sonnet 5.5 jumps from fifth to second](/posts/daily/2026-10-25-benchmark-arena-agent-sonnet-top3-en)
