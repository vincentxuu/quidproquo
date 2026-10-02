---
title: "Benchmark Shift｜Arena Agent Leaderboard: Claude Fable 5.1 Holds Onto First, Newly Released Opus 5.5 Only Takes Second"
date: 2026-10-02
category: daily
type: digest
tags: [ai-agent, benchmark, daily, chatbot-arena, agentic-coding]
lang: en
description: "Arena's (formerly LMSYS) Agent leaderboard data is finally verifiable again: Claude Fable 5.1 (Max) holds first at 14.55%, newly released Claude Opus 5.5 (High) takes second, GPT-6 Astra (Max) is third"
tldr: "Arena Agent leaderboard, published 2026-09-30: Claude Fable 5.1 (Max) 14.55% first, Claude Opus 5.5 (High) 13.78% second, GPT-6 Astra (Max) 12.18% third. Anthropic markets Opus 5.5 as 'performing close to Fable 5.1 at 40% lower cost,' but in this human-voted Agent category it still trails the flagship by about 0.8 points, and third-party measurements put its max-effort token usage at 4x GPT-6 Astra's. This post also documents a methodology breakthrough: switching to Arena's own historical dataset on Hugging Face (via the datasets-server API) to bypass a month-plus structural failure that had blocked rendering on swebench.com and arena.ai"
series:
  name: "AI Benchmark Watch"
  order: 2
---

> 🌏 [中文版](/posts/daily/2026-10-02-benchmark-arena-agent)

## Summary

Arena's (formerly LMSYS Chatbot Arena) Agent-category leaderboard — where humans vote on which model does a better job completing agentic tasks — published its latest snapshot on 2026-09-30: Claude Fable 5.1 (Max) holds first place at 14.55%, Claude Opus 5.5 (High), released just eight days earlier on September 22, sits in second at 13.78%, and GPT-6 Astra (Max) is third at 12.18%. That ordering has held steady for seven straight publishes, from 09-24 through 09-30, with only minor score drift. But compared with the last snapshot this site successfully verified — Claude Opus 5 (High), Opus 5 (Max), and Fable 5 (High), in that order — the entire top three has turned over. That old snapshot had been carried forward unchanged for over a month because of a tooling failure, and today is the first time it's been refreshed.

## What changed

### Arena Agent leaderboard — 2026-09-30 (official)

| Rank | Model | Score | 09-28 score | Change |
|---|---|---|---|---|
| 🥇 | Claude Fable 5.1 (Max) | 14.55% | 14.06% | — |
| 🥈 | Claude Opus 5.5 (High) | 13.78% | 11.84% | — |
| 🥉 | GPT-6 Astra (Max) | 12.18% | 10.36% | — |
| 4 | GPT-6 Sol (Max) | 10.65% | 8.80% | — |
| 5 | Claude Opus 5 (High) | 8.76% | 9.47% (🥉→4→5) | ↓ |

Source: [Arena Leaderboard Dataset](https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset) (`agent` subset, `latest` split) · Official publish date: 2026-09-30 · Fetched: 2026-10-02

### Compared with the last snapshot this site had verified

| Rank | Model | Score |
|---|---|---|
| 🥇 | Claude Opus 5 (High) | 12.99% |
| 🥈 | Claude Opus 5 (Max) | 12.73% |
| 🥉 | Claude Fable 5 (High) | 11.70% |

That old snapshot carries no precise date — Groundlane's rendering of `swebench.com`, `arena.ai`, and `morphllm.com` has failed every single day since 2026-09-03, so this site had no choice but to carry the same stale values forward each day (see the methodology section below). Tracing back through the newly discovered official dataset, Claude Fable 5.1 (Max) was already in first place by at least 09-24, and Claude Opus 5.5 (High) entered the top three on 09-27, five days after its release. In other words, this turnover happened at least a week ago — the detection tooling simply hadn't caught up until today.

## Analysis: what this reshuffle actually means

### Technical angle

When Claude Opus 5.5 launched on 2026-09-22, Anthropic's own announcement claimed it "performs at the level of Claude Fable 5.1 on most work" while "costing 40% less to run" ([Opus 5.5 official page](https://www.anthropic.com/claude/opus)). But in this human-voted Agent category, Opus 5.5 (13.78%) still trails the flagship Fable 5.1 (14.55%) by about 0.8 percentage points — "performs at the level of" holds on the benchmark mix the vendor chose to cite, but a measurable gap persists once you move to human-judged agentic tasks. More notable: independent measurements put Opus 5.5's token usage at max reasoning effort around 119,000 tokens per task — 60% more than its predecessor Opus 5, and four times GPT-6 Astra's usage in the same release wave ([related coverage](https://www.youtube.com/watch?v=v96aXotv1K4)). "40% cheaper" is a list-price comparison, not a per-completed-task comparison, and the two don't necessarily line up.

### Methodology angle

⚠️ The score here isn't a classic Elo rating — it's Arena's own relative win-rate metric. Higher is better, but the number shifts slightly depending on which models happen to be in the comparison pool on a given day, so day-to-day score deltas for the same model shouldn't be read as precise percentage-point changes; only the ranking order and score magnitude are reliable signals.

The more important methodology note: this site's `daily-digest-benchmark` routine has failed to render `swebench.com`, `arena.ai`, and `morphllm.com` directly every single day for over a month straight since 2026-09-03 (hitting `OUTPUT_LIMIT`, `js_empty_document`, and a Vercel 429 security checkpoint, respectively). Today we finally found a workaround: Arena's own blog post from 2026-04-02 ([Arena Leaderboard Dataset](https://arena.ai/blog/arena-leaderboard-dataset)) announced that the entire history of every leaderboard had already been published as a structured Hugging Face dataset (`lmarena-ai/leaderboard-dataset`). Hugging Face's `datasets-server` REST API (`/rows`, `/splits`, `/size`) returns clean JSON directly, with no page rendering required at all. This is Arena's own first-party data, not a third-party aggregator's retelling, so its credibility matches the official leaderboard page itself. No equivalent structured export has been found yet for `swebench.com` or `morphllm.com` — rendering those still fails — so this post only confirms a shift on the Arena Agent leaderboard specifically.

### Industry angle

The bigger signal here isn't who's winning — it's how unsettled the "winning" still is. Fable 5.1's score only inched up from 09-24 to 09-30 (13.44% → 14.55%), while Opus 5.5's score nearly doubled over the same window (12.15% on 09-27 up to 13.78% on 09-30, dipping to 11.84% in between) — which tells you a freshly released model's position on a human-voted leaderboard is still swinging hard as the sample size grows. That's exactly why this site's screening rule requires watching for a stable trend before writing anything up, rather than reacting to a single day's snapshot. For teams weighing a move to Opus 5.5: if your workloads are routine agentic tasks where humans can't easily tell the difference, the price advantage is probably worth taking. But if your workloads are token-sensitive — long-running tasks, high concurrency — the measured 4x token usage could eat into the list-price discount, and it's worth running your own task mix before deciding either way.

## Today's takeaway

Vendor launch copy that says "performs close to the flagship, costs less" is usually stitching two separate claims together: "performs close to" typically means close on the benchmark mix the vendor chose to cite, and "costs less" typically means a list-price comparison. Opus 5.5 versus Fable 5.1 is a clean example of both claims fraying at the edges — there's still a measurable gap on this human-judged Agent category, and the actual token consumption measured by third parties (which drives real task cost) is messier than the list-price discount narrative suggests. When deciding whether switching models is worth it, it helps to separate "performance by which measure" from "cost by which definition" rather than taking the vendor's one-line summary at face value.

## References

- [Arena Leaderboard Dataset — Hugging Face (`lmarena-ai/leaderboard-dataset`, first-party data)](https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset)
- [Arena Leaderboard Dataset — official announcement](https://arena.ai/blog/arena-leaderboard-dataset)
- [Arena (formerly LMSYS) leaderboard homepage](https://arena.ai/?leaderboard)
- [Introducing Claude Opus 5.5 — Anthropic official page](https://www.anthropic.com/claude/opus)
- [Model Card｜Claude Opus 5.5](/en/posts/daily/2026-09-25-model-anthropic-claude-opus-5-5-en)
- [Model Card｜Claude Fable 5.1](/en/posts/daily/2026-09-07-model-anthropic-claude-fable-5-1-en)
- [Model Card｜GPT-6 Astra](/en/posts/daily/2026-09-06-model-openai-gpt-6-astra-en)
- [Anthropic Launches Claude Opus 5.5, Igniting New AI Model War with OpenAI — independent token-usage measurement](https://www.youtube.com/watch?v=v96aXotv1K4)
