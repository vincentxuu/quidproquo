---
title: "Benchmark Watch | Gemini 4 Neon's Debut: Third on Arena Agent, Tops Artificial Analysis's Coding Agent Index"
date: 2026-11-20
category: daily
type: digest
tags: [ai-agent, benchmark, daily, gemini, arena]
lang: en
description: "Google's Gemini 4 Neon, released 11-18, debuts straight into the top three of the Arena Agent leaderboard, statistically tied with #2 Claude Opus 5.5, and edges ahead on Artificial Analysis's Coding Agent Index — but the officially tracked CursorBench 4.0 leaderboard still has Gemini 4 Carbon at #1, with Neon not yet listed"
tldr: "Gemini 4 Neon ($3/$15 pricing, released 11-18) debuts straight at #3 on the Arena Agent leaderboard (18.41%), statistically tied with #2 Claude Opus 5.5 (18.63%) since their confidence intervals fully overlap. It edges to #1 on Artificial Analysis's Coding Agent Index at 59 points, barely ahead of Claude Code running Fable 5.2 or Opus 5.5 at 58. But the officially tracked CursorBench 4.0 leaderboard still crowns Gemini 4 Carbon at 60.4%, with Neon not yet listed — Google's own claimed CursorBench 4.1 score of 65.4% remains unverified by an independent source."
series:
  name: "AI Benchmark Watch"
  order: 11
---

> 🌏 [中文版](/posts/daily/2026-11-20-benchmark-gemini-4-neon)

## Summary

Google released Gemini 4 Neon on 11-18, and it debuted straight into the top three of the Arena Agent leaderboard, pushing the previous #3, Gemini 4 Carbon, down to #4. The gap to #2 Claude Opus 5.5 is just 0.22 percentage points, and their confidence intervals fully overlap — statistically a tie. The same batch of data shows Neon edging to #1 on Artificial Analysis's Coding Agent Index, again by a razor-thin margin. On the officially tracked CursorBench 4.0 leaderboard, though, Neon hasn't been added yet — the winner there is still Gemini 4 Carbon. Taken together, these five leaderboards describe a familiar pattern: a new model storms every chart at once, without winning any of them cleanly.

## Ranking Changes

### Arena Agent Leaderboard — 2026-11-18 (official publish date)

| Rank | Model | Score | 95% CI | 11-15 Score (Rank) | Change |
|---|---|---|---|---|---|
| 🥇 | Claude Fable 5.2 (Max) | 27.42% | [24.46%, 30.38%] | 28.61% (1) | — |
| 🥈 | Claude Opus 5.5 (Max) | 18.63% | [16.60%, 20.65%] | 18.19% (2) | — |
| 🥉 | Gemini 4 Neon (High) | 18.41% | [15.90%, 20.93%] | New entry | 🆕 |
| 4 | Gemini 4 Carbon (High) | 16.10% | [15.41%, 16.79%] | 16.45% (3) | ↓1 |
| 5 | Claude Sonnet 5.5 (Max) | 15.56% | [12.66%, 18.46%] | 15.29% (4) | ↓1 |

Source: [Arena Leaderboard Dataset](https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset) (`agent` subset, `latest` split) · Official publish date: 2026-11-18 · Fetched: 2026-11-20 · 11-15 figures from this routine's internal snapshot

### Gemini 4 Neon's Debut Scorecard — Cross-Leaderboard Comparison (compiled 2026-11-20)

| Leaderboard | Neon's Rank | Neon's Score | Current Leader | Leader's Score | Data Provenance |
|---|---|---|---|---|---|
| Arena Agent Index | 🥉 Third (statistically tied with #2) | 18.41% | Claude Fable 5.2 (Max) | 27.42% | Independent third party (Arena's own blind voting) |
| Vals Index | 🥈 Second | 70.87% | Claude Fable 5.2 | 71.31% | Independent third party (private test set) |
| Artificial Analysis Coding Agent Index | 🥇 First | 59 points | (Neon itself) | 59 points | Independent third party, but this site couldn't scrape the original page this time — figures relayed via [officechai.com](https://officechai.com/ai/gemini-4-neon-places-second-on-vals-index-and-arena-agent-index-ahead-of-opus-5-5-tops-cursor-bench-outright/) |
| CursorBench (officially tracked 4.0) | Not listed | — | Gemini 4 Carbon (High) | 60.4% | Independent third party; BenchLM hasn't added Neon yet |
| CursorBench 4.1 (Google's own claim) | 🥇 First (self-reported) | 65.4% | — | — | ⚠️ Vendor self-test; the official CursorBench version (4.0) hasn't independently verified this figure |

SWE-bench Verified's top five scores and ranks are identical to last time (79.2 / 79.2 / 78.8 / 77.4 / 76.8, with the top two tied and a three-way tie for fifth) — no change. CursorBench 4.0 ([via BenchLM](https://benchlm.ai/benchmarks/cursorbench), dated 2026-11-19) has the same top three as last time (Gemini 4 Carbon 60.4% / Claude Fable 5.2 60.0% / Claude Opus 5.5 57.8%); Gemini 4 Neon hasn't appeared yet on this 21-model board. Artificial Analysis's `/agents/coding-agents` page was re-tried with `render=always` this time, but still returned only chart headings with no scrapable data table (a JS-rendered chart, not a table) — the same known blocker as before.

## What This Shake-Up Means

### The technical angle

Gemini 4 Neon is Google's "fast reasoning" model, positioned between Gemini 4 Carbon and Gemini 4 Hydrogen, released 11-18 at $3/$15 pricing — cheaper than Carbon but pricier than Hydrogen ($1.50/$7.50). Interestingly, it isn't winning by being "stronger than Carbon" outright; instead it lands just behind Fable 5.2 or Opus 5.5 on nearly every board while staying cheaper and faster than both. [OfficeChai's reporting](https://officechai.com/ai/gemini-4-neon-places-second-on-vals-index-and-arena-agent-index-ahead-of-opus-5-5-tops-cursor-bench-outright/) notes Neon's per-test cost on the Vals Index is $7.40, under a third of Opus 5.5's, and it finishes a test run in about 31 minutes versus Sonnet 5.5's roughly 90. Artificial Analysis separately measured Neon's output speed at about 110 tokens/second, nearly double Carbon's 57. That's a different story from several earlier entries in this series, where new models won by brute-force scale or training method — Neon's story is closer to "closing in on the top at a much lower cost."

### The methodology angle

⚠️ These numbers need to be read in layers. Arena Agent and the Vals Index are both independent blind evaluations run by Arena and Vals themselves, so they carry more weight. But Neon's sample size (session_count 5,696) is noticeably smaller than #2 Opus 5.5's (14,920), which gives it the widest confidence interval among the top five ([15.90%, 20.93%], a 5.03-point span) — one that fully contains Opus 5.5's interval. The rank gap between them is statistically indistinguishable, even though coverage describing them as "#2" and "#3" makes it sound settled; in reality it's a tie, with Opus 5.5 ahead by only 0.22 points on point estimates. The Artificial Analysis Coding Agent Index's 59-vs-58 is an equally razor-thin margin, and this site still couldn't pull the raw numbers directly from Artificial Analysis's own site (the JS chart blocker persists) — relying on a third-party relay for those figures, which discounts their reliability further. The number to be most wary of is CursorBench 4.1's 65.4%: that's **Google's own benchmark table**, not an independent test from Cursor or BenchLM. BenchLM is still tracking CursorBench 4.0, where Neon hasn't even been added yet — so that 65.4% is currently nothing more than a vendor's self-reported number, unverified by anyone outside Google.

### The industry angle

Looking at all five leaderboards together, the notable part isn't "how many firsts did Neon win" — it's that Neon landed near the top of multiple boards at once **without cleanly winning any single one**, by trading on lower cost and higher speed. For teams evaluating model line-ups, this "close to the top everywhere, no obvious weak spot" positioning may be more practically useful than being the outright #1 on one chart — especially when the actual #1 (Fable 5.2 or Carbon) costs far more to run. But it's also a caution: when the same model gets called "#2," "#3," and "tops the chart" across five different write-ups, it's easy to get pulled toward the most eye-catching number (CursorBench 4.1's 65.4%) — which happens to be the one figure that hasn't been independently verified. When tracking a new model's debut across several boards, the "number the vendor announced itself" and the "number an independent third party actually measured" need to be kept separate, not treated the same just because one article lumped them together.

## Today's Takeaway

Earlier entries in this series usually recorded a new model landing at a clean, unambiguous rank on a single leaderboard. This time Neon shows up on five leaderboards at once, but not one of those ranks is clean — either the confidence intervals overlap too much to tell ranks apart, or the number is a vendor self-test or a secondhand relay. That's a reminder that "good news reported simultaneously across multiple leaderboards" should itself raise a flag: when a company claims a high rank in five places at the same time is exactly when checking each number's provenance individually matters most, not a reason to take all five at face value just because there are so many of them.

## References

- [Arena Leaderboard Dataset — Hugging Face](https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset)
- [Gemini 4 Neon Places Second On Vals Index And Arena Agent Index Ahead Of Opus 5.5, Tops Cursor Bench Outright — OfficeChai](https://officechai.com/ai/gemini-4-neon-places-second-on-vals-index-and-arena-agent-index-ahead-of-opus-5-5-tops-cursor-bench-outright/)
- [CursorBench — Cursor](https://cursor.com/cursorbench)
- [CursorBench Leaderboard & Scores — BenchLM](https://benchlm.ai/benchmarks/cursorbench)
- [AI Coding Agent Benchmarks & Leaderboard — Artificial Analysis](https://artificialanalysis.ai/agents/coding-agents)
- [SWE-bench leaderboards data — GitHub](https://github.com/SWE-bench/swe-bench.github.io/blob/master/data/leaderboards.json)
- [Benchmark Watch | Arena Agent and CursorBench Shake Up in the Same Week](/posts/daily/2026-11-13-benchmark-arena-cursorbench-fable-5-2-en)
