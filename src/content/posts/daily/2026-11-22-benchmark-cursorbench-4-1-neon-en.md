---
title: "Benchmark Watch | CursorBench Goes Official on 4.1: Gemini 4 Neon Confirmed #1, Carbon Drops to Second"
date: 2026-11-22
category: daily
type: digest
tags: [ai-agent, benchmark, daily, gemini, cursorbench]
lang: en
description: "BenchLM's officially tracked CursorBench board switched from version 4.0 to 4.1 on 11-20, with Gemini 4 Neon topping it at 65.4% (Extra High) — confirming the exact number that was still an unverified vendor claim two days ago. The former #1, Gemini 4 Carbon, drops to second (61.5%)."
tldr: "BenchLM's officially tracked CursorBench board switched from version 4.0 to 4.1 on 11-20, and Gemini 4 Neon now tops it at 65.4% (Extra High effort), displacing former #1 Gemini 4 Carbon (now 61.5%). Two days ago, this series flagged that same 65.4% figure as an unverified vendor self-report; it's now an independently confirmed entry on the benchmark owner's own board. SWE-bench Verified, Arena Agent, and Artificial Analysis's Coding Agent Index all held steady with no change."
series:
  name: "AI Benchmark Watch"
  order: 12
---

> :globe: [中文版](/posts/daily/2026-11-22-benchmark-cursorbench-4-1-neon)

## Summary

Two entries ago, on 11-20, this series noted that Gemini 4 Neon claimed a 65.4% score on CursorBench 4.1 — but flagged it as unverified, since BenchLM's officially tracked board was still on CursorBench 4.0, where Neon hadn't even appeared yet. Today's scan found that BenchLM switched its official "current" version from 4.0 to 4.1 on 11-20, and that same 65.4% is now an independently confirmed entry on the benchmark owner's own board. The former #1, Gemini 4 Carbon, drops from 4.0's 60.4% to an official #2 on 4.1 (61.5%). SWE-bench Verified, the Arena Agent leaderboard, and Artificial Analysis's Coding Agent Index all matched the previous snapshot bit-for-bit — no change.

## Ranking Changes

### CursorBench 4.1 (BenchLM's officially tracked board) — 2026-11-22

| Rank | Model | Score | CursorBench 4.0 rank (reference only — versions aren't directly comparable) | Change |
|---|---|---|---|---|
| 1 | Gemini 4 Neon (Extra High) | 65.4% | Not listed | NEW — now officially confirmed |
| 2 | Gemini 4 Carbon (High) | 61.5% | 1 (60.4%) | ↓1 |
| 3 | Gemini 4 Hydrogen (High) | 61.4% | 5 (54.3%) | ↑2 |
| 4 | Claude Fable 5.2 | 61.3% | 2 (60.0%) | ↓2 |
| 5 | Claude Opus 5.5 | 58.1% | 3 (57.8%) | ↓2 |

Source: [CursorBench — BenchLM](https://benchlm.ai/benchmarks/cursorbench) · CursorBench 4.1 released 2026-11-18, became BenchLM's official current version on 2026-11-20 · Snapshot date: 2026-11-22 · 4.0 and 4.1 use different task sets, so scores aren't directly comparable — only the direction of rank movement is informative

The other three steady-tracked leaderboards showed no change: SWE-bench Verified's top five scores and ranks (79.2% / 79.2% / 78.8% / 77.4% / 76.8%, with a tie for first and a three-way tie for fifth) matched the previous snapshot bit-for-bit. The Arena Agent leaderboard's official publish date is still 2026-11-18, and its top five (Claude Fable 5.2 27.42% / Claude Opus 5.5 18.63% / Gemini 4 Neon 18.41% / Gemini 4 Carbon 16.10% / Claude Sonnet 5.5 15.56%) were identical. Artificial Analysis's Coding Agent Index — cross-checked across four independent write-ups (orcarouter.ai, trendingtopics.eu, dev.to, and Google's own blog post), since the site's own data table still can't be scraped due to JS rendering — kept the same order: Gemini 4 Neon first (58.6–59 points), Claude Fable 5.2 and Opus 5.5 (via Claude Code) tied for second (58 points), and Gemini 4 Carbon third (54–55 points), with the gap within rounding error of the prior snapshot.

## What This Shake-Up Means

### The technical angle

CursorBench 4.1 revised the "instruction-following" tasks from 4.0 and extended the agent's execution time limit — it's a new task set, not a rerun of the same questions. So Neon's move on the new board is better read as "first to stake a claim on new tasks" than "beating Carbon" in any literal sense. Per [Cursor's own announcement](https://x.com/cursor_ai/status/2123198346802450926), Neon scores 63.7% at its default High effort tier, 6.4 points above Gemini 4 Hydrogen's 57.3%; the 65.4% shown on BenchLM's board is Neon's Extra High effort tier, since the board follows its usual convention of listing each model's highest published effort tier. [kingy.ai's breakdown](https://kingy.ai/blog/gemini-4-neon/) shows Neon's four effort tiers hitting clear diminishing returns: Low 45.5%/$1.26, Medium 57.7%/$3.07, High 63.7%/$6.54, Extra High 65.4%/$10.67 — the last step spends 63% more to gain just 1.7 points.

### The methodology angle

The most notable part of this shake-up isn't the score itself — it's the change in verification status. The 11-20 entry explicitly flagged CursorBench 4.1's 65.4% as "Google's own benchmark table, not an independent test from Cursor or BenchLM." That exact same number now appears on BenchLM's official CursorBench 4.1 board, meaning the benchmark owner itself has adopted and confirmed it. But what got confirmed is that the score is now recognized by the official board — not that it's comparable across versions. BenchLM's own version-comparison table explicitly notes that 4.0 and 4.1 scores "aren't comparable; only the direction of rank movement is a fair read," so Carbon's move from 60.4% to 61.5% isn't a regression — it's a new baseline on a different (or at least differently weighted) task set. Multiple independent write-ups, including [AlphaSignal](https://alphasignal.ai/news/google-s-gemini-4-neon-beats-carbon-on-coding-tasks-while-costing-23-less) and [TestingCatalog](https://www.testingcatalog.com/google-launches-gemini-4-neon-on-gemini-antigravity-and-apis/), cite the same 63.7%/65.4% figures and cross-confirm each other — a meaningfully stronger evidence base than relying on Google's own announcement alone, which was all that was available on 11-20.

### The industry angle

Compared with the 11-20 entry, what stands out here is the verification lag itself: a vendor-reported benchmark number took a full two days to go from "announced" to "adopted by the benchmark owner's official board." That gap is exactly when readers are most likely to be misled, since the vendor's own announcement is the only source available at that point. For teams tracking coding-agent model choices, this gives a concrete timing rule of thumb: when a vendor announces a new self-tested score, waiting 2–3 days to see whether an independent leaderboard adopts it is usually enough to separate marketing claims from verifiable results. It's also worth noting that Neon's debut on this new 4.1 board was a clean #1 from the start, rather than the ambiguous "statistically tied for second or third" rankings it held on Arena and Artificial Analysis back on 11-20 — consistent with Cursor's own framing of Neon as setting a "cost-performance frontier," since its edge shows up more clearly on Cursor's own real-world-flavored benchmark than on general-purpose leaderboards.

## Today's Takeaway

The 11-20 entry's lesson was to check each leaderboard's provenance separately when a vendor claims #1 on five boards at once. This follow-up adds a more concrete operating rule: when the same number flips from "vendor self-test" to "adopted by the benchmark owner" within just two days, that transition itself is worth logging on its own — not just folded into an updated score. When tracking benchmark shake-ups, who has confirmed a number matters more than what the number is.

## References

- [CursorBench — BenchLM](https://benchlm.ai/benchmarks/cursorbench)
- [CursorBench — Cursor's official page](https://cursor.com/cursorbench)
- [Cursor's official announcement — X](https://x.com/cursor_ai/status/2123198346802450926)
- [Gemini 4 Neon benchmarks, specs, pricing and comparisons — kingy.ai](https://kingy.ai/blog/gemini-4-neon/)
- [Google launches Gemini 4 Neon on Gemini Antigravity and APIs — TestingCatalog](https://www.testingcatalog.com/google-launches-gemini-4-neon-on-gemini-antigravity-and-apis/)
- [Google's Gemini 4 Neon Beats Carbon on Coding Tasks While Costing 23% Less — AlphaSignal](https://alphasignal.ai/news/google-s-gemini-4-neon-beats-carbon-on-coding-tasks-while-costing-23-less)
- [SWE-bench leaderboards data — GitHub](https://github.com/SWE-bench/swe-bench.github.io/blob/master/data/leaderboards.json)
- [Arena Leaderboard Dataset — Hugging Face](https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset)
- [AI Coding Agent Benchmarks & Leaderboard — Artificial Analysis](https://artificialanalysis.ai/agents/coding-agents)
- [Benchmark Watch | Gemini 4 Neon's Debut: Third on Arena Agent, Tops Artificial Analysis's Coding Agent Index](/posts/daily/2026-11-20-benchmark-gemini-4-neon-en)
