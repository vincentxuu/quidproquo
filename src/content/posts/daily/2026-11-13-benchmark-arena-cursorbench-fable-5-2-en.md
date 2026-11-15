---
title: "Benchmark Watch | Arena Agent and CursorBench Shake Up in the Same Week: Fable 5.2 Tops Arena, Carbon Steals CursorBench"
date: 2026-11-13
category: daily
type: digest
tags: [ai-agent, benchmark, daily, arena, cursorbench]
lang: en
description: "Claude Fable 5.2 debuts at #1 on the Arena Agent leaderboard with a commanding lead over Claude Opus 5.5, but on CursorBench, updated the same week, the winner is Gemini 4 Carbon — Fable 5.2 (Max) lands third"
tldr: "Arena Agent leaderboard (official publish date 2026-11-11, advancing from a batch stuck at 11-04 for seven days): Claude Fable 5.2 (Max) debuts straight at #1 with 30.35%; its 95% CI lower bound (26.42%) still clears former #1 Claude Opus 5.5 (Max)'s CI upper bound (21.54%), so the rank change holds up statistically. GPT-6 Astra (Max) drops out of the top five. The same week, CursorBench 4.0 crowns a different winner: Gemini 4 Carbon (High) at 60.4%, just 0.4 points ahead of Fable 5.2 (Max) at 60.0% — no published CI — while Fable 5.2 (Max) costs $32.79 per task, 3.6x Carbon (High)'s $9.22."
series:
  name: "AI Benchmark Watch"
  order: 10
---

> 🌏 [中文版](/posts/daily/2026-11-13-benchmark-arena-cursorbench-fable-5-2)

## Summary

Two of the most-cited coding agent leaderboards updated this week, and they crowned two different winners. The Arena Agent leaderboard's official publish date advanced from a seven-day-stuck batch of 2026-11-04 to 2026-11-11: Claude Fable 5.2 (Max), which Anthropic released on 11-09, debuted straight at #1 with 30.35%, pushing former leader Claude Opus 5.5 (Max) to second. The gap is large enough that the two models' 95% confidence intervals don't overlap at all — a rank change that actually holds up statistically, unlike several earlier entries in this series where the top ranks couldn't be told apart. But on CursorBench 4.0, also updated this week, the winner is Google's Gemini 4 Carbon (High) at 60.4%; Fable 5.2 (Max) lands third at 60.0%, just 0.4 points behind.

## Ranking Changes

### Arena Agent Leaderboard — 2026-11-11 (official publish)

| Rank | Model | Score | 95% CI | 11-04 score (rank) | Change |
|---|---|---|---|---|---|
| 🥇 | Claude Fable 5.2 (Max) | 30.35% | [26.42%, 34.28%] | New entry | 🆕 |
| 🥈 | Claude Opus 5.5 (Max) | 19.52% | [17.49%, 21.54%] | 20.14% (1) | ↓1 |
| 🥉 | Gemini 4 Carbon (High) | 16.98% | [16.29%, 17.66%] | 16.72% (2) | ↓1 |
| 4 | Claude Sonnet 5.5 (Max) | 15.95% | [13.13%, 18.77%] | 15.42% (3) | ↓1 |
| 5 | Claude Fable 5.1 (Max) | 14.82% | [12.76%, 16.88%] | 13.86% (5) | — |
| 6 | GPT-6 Astra (Max) | 14.54% | [12.52%, 16.55%] | 14.70% (4) | ↓2 |

Source: [Arena Leaderboard Dataset](https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset) (`agent` subset, `latest` split) · Official publish date: 2026-11-11 · Retrieved: 2026-11-13 · 11-04 figures come from this routine's internal snapshot (that batch matched the prior one and never cleared the publish threshold, so it was never written up as its own post)

### CursorBench 4.0 — 2026-11-13 (as scraped)

| Rank | Model | Score | Cost per task | Median output tokens | 11-08 score (rank) | Change |
|---|---|---|---|---|---|---|
| 🥇 | Gemini 4 Carbon (High) | 60.4% | $9.22 | 39,960 | New entry | 🆕 |
| 🥈 | Gemini 4 Carbon (Medium) | 60.1% | $8.49 | 37,067 | New entry | 🆕 |
| 🥉 | Claude Fable 5.2 (Max) | 60.0% | $32.79 | 352,794 | New entry | 🆕 |
| 4 | Gemini 4 Carbon (Low) | 58.6% | $11.89 | 42,663 | New entry | 🆕 |
| 5 | Claude Opus 5.5 (Max) | 57.8% | $13.43 | 218,363 | 57.8% (1) | ↓4 |

Source: [CursorBench](https://cursor.com/cursorbench) · Retrieved: 2026-11-13 · 11-08 figures come from this routine's internal snapshot (the top five then were all Opus 5.5 / Sonnet 5.5 effort tiers; the changelog's last entry was still the 10-07 pricing update)

SWE-bench Verified's top five scores and ranks are unchanged from last time (79.2 / 79.2 / 78.8 / 77.4 / 76.8, with a tie at #1-#2 and a three-way tie at #5) — no movement. Artificial Analysis's `/agents/coding-agents` page still renders client-side with no scrapeable text table, so the `aa_agentic_index` figure wasn't re-verified this round; `morphllm.com/leaderboard` returned a straight 404 this time (it was a 429 before), still unreachable.

## Analysis: What This Shakeup Means

### The technical angle

Both leaderboard shakeups trace back to the same wave of model launches: Anthropic shipped [Claude Fable 5.2 and Mythos 5.2](https://www.anthropic.com/claude-fable-and-mythos-5-2) on 11-09, while Google's Gemini 4 Carbon, previewed on 10-28, widened its rollout this week. Arena's own account [announced](https://x.com/arena/status/2120568144687460434) that Fable 5.2 (Max) took #1 in Agent Arena with a net improvement of +30.4%, about 1.6x the #2 model, drawn from 4.7k real agentic sessions — a figure that lines up exactly with the session_count (4,731) this site pulled directly from the Hugging Face dataset. What's notable, though, is that Anthropic itself [positions Fable 5.2](https://www.anthropic.com/claude/fable) for "the most ambitious, open-ended technical work," still recommending Opus 5.5 as the starting point for everyday coding. CursorBench 4.0, which specifically evaluates multi-file tasks pulled from real Cursor editor sessions — the day-to-day coding scenario — ranks Fable 5.2 (Max) only third there, overtaken by the cheaper Gemini 4 Carbon. The same model landing in completely different positions on "broad agentic task preference" versus "multi-file editing inside an IDE" is itself a technical signal: a model's strength isn't a single number — it depends on what kind of task the benchmark is sampling.

### The methodology angle

The credibility of Arena Agent's numbers this round is worth spelling out: Fable 5.2's sample size (session_count 4,731) is actually the smallest among the current top six (Opus 5.5 has 14,549, Carbon has 60,568, Sonnet 5.5 has 8,750), which is also why its confidence interval is the widest of the six ([26.42%, 34.28%], a 7.86-point span). But even with the widest interval, its lower bound (26.42%) still sits well above #2 Opus 5.5's upper bound (21.54%) — no overlap at all. That's different from several earlier entries in this series, where the top five's confidence intervals piled on top of each other and the true order couldn't be settled; this time the #1 change actually holds up statistically. ⚠️ CursorBench tells a different story: it's Cursor's own in-house evaluation (though it does score models from every vendor, not just its own product), and Cursor hasn't published confidence intervals or run-to-run variance. The gap between #1 (60.4%) and #3 (60.0%) is just 0.4 points, and each model's task sample is only 67 to 218 runs. Industry coverage — [AlphaSignal](https://alphasignal.ai/news/google-s-gemini-4-carbon-tops-cursor-s-coding-benchmark-at-half-the-price) among them — makes the same point: that 0.4-point gap "does not establish a decisive accuracy advantage." In other words, the CursorBench "win" is a far weaker claim than the Arena Agent one.

### The industry angle

The more important detail here isn't rank, it's the cost gap. On CursorBench, Fable 5.2 (Max) costs $32.79 per task (burning through 352,794 output tokens, the highest of the top five), while Gemini 4 Carbon (High) gets a score that's essentially tied — if not slightly ahead — for just $9.22: roughly the same (or better) IDE-editing performance at 28% of the cost. Multiple outlets ([the-decoder](https://the-decoder.com/gemini-4-carbon-arrives-just-in-time-to-feel-like-yesterdays-news-in-the-fastest-model-cycle-yet/), [Hermes AI](https://hermes-ai.net/news/google-s-gemini-4-carbon-tops-cursor-s-coding-benchmark-at-half-the-price/)) frame that cost advantage, not the 0.4-point score gap, as the real story — and note that part of Carbon's current pricing is a promotional rate running through the end of November, due to rise in December. Flip to Arena Agent, though, and Fable 5.2 isn't winning by a hair — it's winning by a statistically solid, enormous margin (30.35% versus 19.52%, nearly 1.6x). That suggests teams tackling complex, open-ended agentic work might find Fable 5.2's premium worth paying, while teams whose work is mostly multi-file editing inside an IDE may find Carbon's price advantage the deciding factor. This is a rare week where the two most-watched coding agent leaderboards crowned two completely different winners from the same wave of new models.

## Today's Takeaway

The shakeups this series has recorded before were usually rank changes within a single leaderboard. This time, two independent leaderboards gave two different answers, in the same week, to "which coding agent is strongest" — and both answers are backed by real data; neither methodology is obviously worse. It's a reminder that "model X tops leaderboard Y" is never something you can generalize from directly. The next question always has to be "which leaderboard, sampling which kind of task" — because the task distribution itself decides who wins.

## References

- [Arena Leaderboard Dataset — Hugging Face](https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset)
- [Arena.ai's announcement of Fable 5.2's Agent Arena ranking and net improvement — X](https://x.com/arena/status/2120568144687460434)
- [CursorBench — Cursor](https://cursor.com/cursorbench)
- [Introducing Claude Fable 5.2 and Claude Mythos 5.2 — Anthropic](https://www.anthropic.com/claude-fable-and-mythos-5-2)
- [Claude Fable 5.2 — Anthropic](https://www.anthropic.com/claude/fable)
- [Google's Gemini 4 Carbon Tops Cursor's Coding Benchmark at Half the Price — AlphaSignal](https://alphasignal.ai/news/google-s-gemini-4-carbon-tops-cursor-s-coding-benchmark-at-half-the-price)
- [Gemini 4 Carbon arrives just in time to feel like yesterday's news — The Decoder](https://the-decoder.com/gemini-4-carbon-arrives-just-in-time-to-feel-like-yesterdays-news-in-the-fastest-model-cycle-yet/)
- [SWE-bench leaderboards data — GitHub](https://github.com/SWE-bench/swe-bench.github.io/blob/master/data/leaderboards.json)
