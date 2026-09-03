---
title: "Benchmark Shift｜CursorBench: Claude Fable 5.1 Debuts at #1, Bumps Grok 4.6 to Third"
date: 2026-09-02
category: daily
type: digest
tags: [ai-agent, benchmark, daily, cursorbench, coding-agent]
lang: en
description: "Claude Fable 5.1 has no official Anthropic announcement yet, but it just parachuted straight into first and second place on CursorBench, pushing the previous leader Grok 4.6 Extra High down to third"
tldr: "CursorBench 3.2: Fable 5.1 Max hits 73.4% (previous leader Grok 4.6 Extra High was 70.8%) and debuts by taking both first and second place; Fable 5.1 Max beats the old leader by 2.6 points while costing only $9.64 per task, 44% cheaper than the prior Fable 5 Max at $17.32; Anthropic's own site still lists only Fable 5, with no official Fable 5.1 announcement"
series:
  name: "AI Benchmark Watch"
  order: 1
---

> 🌏 [中文版](/posts/daily/2026-09-02-benchmark-cursorbench)

## Summary

CursorBench — Cursor's own agentic-coding evaluation board — just had its biggest reshuffle since version 3.2: two entries labeled "Fable 5.1," Max (73.4%) and Extra High (72.8%), parachuted straight into first and second place, bumping the previous snapshot's (2026-08-31) leader Grok 4.6 Extra High (70.8%) down to third. Notably, Anthropic's own site and model documentation still list only Fable 5 as of this writing — no official Fable 5.1 announcement exists yet. This leaderboard entry arrived ahead of the official announcement.

## Ranking Changes

### CursorBench 3.2 — 2026-09-02

| Rank | Model/Config | Score | Previous | Change |
|---|---|---|---|---|
| 🥇 | Fable 5.1 Max | 73.4% | New entry | 🆕 |
| 🥈 | Fable 5.1 Extra High | 72.8% | New entry | 🆕 |
| 🥉 | Grok 4.6 Extra High | 70.8% | 70.8% (🥇) | ↓2 |
| 4 | Fable 5 Max | 70.5% | 70.5% (🥈) | ↓2 |
| 5 | Opus 5 Max | 70.0% | 70.0% (🥉) | ↓2 |

Source: [cursor.com/cursorbench](https://cursor.com/cursorbench) · Snapshot date: 2026-09-02

The scores for the former third-through-fifth place entries didn't change at all — they were simply pushed down by two new entries landing above them, not re-benchmarked.

## Analysis: What This Reshuffle Means

### Technical

The interesting part isn't how much Fable 5.1 won by — it's what it cost to win. CursorBench also publishes average cost per task: Fable 5.1 Max runs $9.64 per task, 44% cheaper than the prior Fable 5 Max's $17.32, using 30% fewer tokens (72,060 vs. 103,525) while still scoring 2.9 points higher (73.4% vs. 70.5%). Fable 5.1 Extra High is even more striking: $6.96 per task — over 60% cheaper than the old leader Fable 5 Max — while still outscoring it (72.8% vs. 70.5%). A same-generation point release (5 → 5.1) usually just nudges the score; getting both a score increase and a cost cut at the same time looks more like a training or routing change than simply throwing more compute at the problem.

### Methodology

⚠️ One caveat is worth flagging clearly: as of this writing, neither Anthropic's own site ([anthropic.com/claude/fable](https://www.anthropic.com/claude/fable)) nor its model docs ([platform.claude.com](https://platform.claude.com/docs/en/models/fable-5/introducing-claude-fable-5-and-claude-mythos-5)) list anything beyond `claude-fable-5` — there's no model card, pricing page, or official release announcement for Fable 5.1. The name comes entirely from community observation so far: a new model identifier spotted on Amazon Bedrock, early-access testing under the internal codenames "Melon" and "Marshmallow," and several tracker articles placing the release window between August 31 and early September. CursorBench is a third-party evaluation built and run by Cursor rather than the model vendor, which makes it more credible than a vendor self-report — but it's still currently the only public leaderboard showing this new version's score, with no second independent source cross-verifying it yet, and it can't be ruled out that this reflects an unfinalized early build.

### Industry

If "Fable 5.1" is accurate, it means Anthropic is signaling a new model through a third-party leaderboard before making any official announcement — the same pattern seen before Opus 5's official launch, when it first leaked under the EAP codename "Honeycomb." For teams currently running coding agents on Fable 5 Max, the practical takeaway from this shift may not be "should we switch models" but rather "the next point release of the same family might deliver a higher score at a lower cost." If the eventual official pricing holds, Fable 5.1 Extra High would match or beat Fable 5 Max at less than half the cost — which would directly change the cost/benefit calculus for model selection.

## Today's Insight

I used to assume a point release (5 → 5.1) mostly means a small score bump with pricing left unchanged. This CursorBench data suggests otherwise: a minor version update within the same model generation can cut cost and token usage while raising the score at the same time — beating the previous generation's most expensive configuration with a cheaper one. When judging whether a new version is worth switching to, checking the score alone isn't enough; cost per task and token usage per task matter too, or you'll underestimate how big a point release actually is.

## References

- [CursorBench — Cursor's official live leaderboard](https://cursor.com/cursorbench)
- [CursorBench methodology — Cursor Blog](https://cursor.com/blog/cursorbench)
- [Claude Fable — Anthropic's official page (lists only Fable 5 as of this writing)](https://www.anthropic.com/claude/fable)
- [Introducing Claude Fable 5 and Claude Mythos 5 — Anthropic model documentation](https://platform.claude.com/docs/en/models/fable-5/introducing-claude-fable-5-and-claude-mythos-5)
- [Claude Fable 5.1 & Opus 5.1: delayed until next week — OrcaRouter](https://www.orcarouter.ai/blog/claude-fable-5-1-opus-5-1-delay-leak)
- [Fable 5.1: Release Date, Rumors, and What We Actually Know — Cellcog](https://cellcog.ai/blog/fable-5-1-release-date)
