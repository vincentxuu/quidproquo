---
title: "Pricing Watch | Claude Fable 5.2 Replaces 5.1, API Rates Drop 20%"
date: 2026-11-13
category: daily
type: digest
lang: en
tags: [ai-agent, pricing, daily, anthropic]
description: "Anthropic shipped Claude Fable 5.2 on 2026-11-09, replacing Fable 5.1. Input, output, cache, and batch rates all drop 20% across the board — one of Anthropic's largest flagship-model price cuts in recent memory"
tldr: "Claude Fable 5.2 went live on 2026-11-09, replacing Fable 5.1. Input drops from $10 to $8/1M tokens and output from $50 to $40/1M tokens — both a flat 20% cut, with cache-read and batch rates falling the same 20%. The old Fable 5.1 model ID still works but keeps its old price; you have to manually switch to claude-fable-5-2 to get the new rate."
series:
  name: "AI Pricing Watch"
  order: 34
---

> 🌏 [中文版](/posts/daily/2026-11-13-pricing-anthropic-claude-fable-5-2-price-cut)

## Summary

On 2026-11-09, Anthropic shipped [Claude Fable 5.2 and Claude Mythos 5.2](https://www.anthropic.com/claude-fable-and-mythos-5-2), replacing Fable 5.1 after just two months on the market. The headline here isn't new capability — it's price. Input drops from $10 to $8/1M tokens and output from $50 to $40/1M tokens, a flat 20% cut on both. Cache-read and Batch API rates fall the same 20%. That's an unusually clean "every rate drops together" move for an Anthropic flagship generation change, and the old `claude-fable-5-1` model ID hasn't been retired and isn't auto-rerouted — anyone who doesn't manually switch model IDs keeps paying the old price. The discount doesn't happen to you automatically.

## Before / After

| Item | Old (Claude Fable 5.1) | New (Claude Fable 5.2) | Change | Effective |
|---|---|---|---|---|
| Input | $10.00/1M tokens | $8.00/1M tokens | ↓20% | 2026-11-09 |
| Output | $50.00/1M tokens | $40.00/1M tokens | ↓20% | 2026-11-09 |
| Cache Read | $0.25/1M tokens (2.5% of input) | $0.20/1M tokens (2.5% of input) | ↓20% | 2026-11-09 |
| Batch API Input | $5.00/1M tokens | $4.00/1M tokens | ↓20% | 2026-11-09 |
| Batch API Output | $25.00/1M tokens | $20.00/1M tokens | ↓20% | 2026-11-09 |

(The Fable line's cache-read multiplier already dropped from the standard 10% to 2.5% back at Fable 5.1 — 5.2 keeps that same multiplier, just on top of a lower base rate. Fast mode is still 2x standard on both generations; Fable 5.2 fast mode runs $16/$80.)

## Cost Math

**Scenario**: a team running 500 complex agentic tasks a day, using Fable as the orchestrator (20,000 input tokens + 5,000 output tokens per task on average)

| | Fable 5.1 (old) | Fable 5.2 (new) | Monthly savings |
|---|---|---|---|
| Input cost/mo (300M tokens) | $3,000 | $2,400 | $600 |
| Output cost/mo (75M tokens) | $3,750 | $3,000 | $750 |
| **Total** | **$6,750/mo** | **$5,400/mo** | **$1,350 (↓20%)** |

Because the input and output cuts are both exactly 20%, this math doesn't depend on your input/output ratio — whether your workload is input-heavy or output-heavy, switching to Fable 5.2 saves a flat 20%. That's unusual; most price cuts have asymmetric input/output discounts, so you'd normally need to run your own token ratio before knowing your real savings.

## Impact on Developers/Enterprises

### Who benefits most

Teams using Fable as an orchestrator benefit most directly — Anthropic's own launch post positions Fable 5.2 explicitly for "planning the work and handing simpler tasks to smaller models," a pattern that tends to run high volume and high call frequency, so a flat 20% cut shows up directly on the monthly bill. Teams that had been hesitant to use Fable 5.1 for heavy reasoning work because it was priced the same as GPT-6 Astra ($10/$50) now have a reason to revisit that call, since the gap has widened.

### Competitive landscape

Flagship model pricing after the cut (input / output, USD/1M tokens):

| Model | Input | Output | Note |
|---|---|---|---|
| GPT-6 Astra | $10.00 | $50.00 | Currently the most expensive frontier model |
| Claude Fable 5.1 (superseded, old callers still pay this) | $10.00 | $50.00 | Was priced level with GPT-6 Astra before retirement |
| **Claude Fable 5.2 (new)** | **$8.00** | **$40.00** | This cut; now 20% below GPT-6 Astra for the first time |
| Claude Opus 5.5 | $4.00 | $20.00 | Exactly half of Fable 5.2 |
| Gemini 4 Argon (reverts 2026-12-01) | $4.00 | $20.00 | Promo price $2/$10 through 11/30 |
| GPT-6.1 Sol | $2.00 | $10.00 | — |
| Claude Sonnet 5.5 | $2.00 | $10.00 | — |

This cut means Fable 5.2 is no longer tied for most expensive flagship model — it now sits a clean 20% below GPT-6 Astra, and it also makes Claude's own internal price ladder more consistent: Fable 5.2 ($8/$40) is now exactly 2x Opus 5.5 ($4/$20), a tidier ratio than Fable 5.1's roughly 2.5x premium over Opus 5.5.

### Action items

- If your code has `claude-fable-5-1` hardcoded as a model ID: the discount doesn't happen automatically — Anthropic hasn't rerouted the old ID, so you need to manually switch to `claude-fable-5-2` to get the new price
- If you run Fable through the Batch API: the batch rate also dropped to $4/$20, stacking on top of the existing 50% batch discount — effectively standard price × 0.5 × 0.8
- If you previously picked GPT-6 Astra over Fable 5.1 because they were priced the same: Fable 5.2 is now 20% cheaper, worth re-running your eval comparison
- If you use Fable as an advisor (where Haiku/Sonnet/Opus consults it on hard problems): call volume there is usually lower, so the absolute dollar savings from a 20% cut are modest — prioritize migrating orchestrator workloads first

## Today's Takeaway

The thing worth remembering here isn't how much the price dropped — it's that the discount doesn't happen on its own. Anthropic didn't reroute the old `claude-fable-5-1` ID to the new model; both IDs coexist, each at its own price. That's the opposite of the pattern we've covered in past "model retirement = automatic price cut" stories, where the vendor routed traffic to a cheaper replacement and callers got the discount for free. Here, if you don't change the model ID string yourself, you keep paying the old price no matter how cheap the new model gets. Tracking a price change means checking not just "how much cheaper," but "do I have to do something myself to actually get it."

## References

- [Anthropic: Introducing Claude Fable 5.2 and Claude Mythos 5.2 (official launch post, 2026-11-09)](https://www.anthropic.com/claude-fable-and-mythos-5-2)
- [Anthropic: Claude Fable 5.2 Overview (official model page, full rate card)](https://platform.claude.com/docs/en/models/fable-5-2/overview)
- [Anthropic: Models overview (official model overview, Fable 5.1/5.2 old vs. new rates)](https://platform.claude.com/docs/en/models/overview)
- [Anthropic: Pricing (official pricing page, cache/batch/fast-mode rate formulas)](https://platform.claude.com/docs/en/about-claude/pricing)
- [VentureBeat: Anthropic releases Claude Fable 5.2 and Mythos 5.2, pairing new record-high benchmarks with 20% API cost reduction](https://venturebeat.com/technology/anthropic-releases-claude-fable-5-2-and-mythos-5-2-pairing-new-record-high-benchmarks-with-20-api-cost-reduction)
- [mlq.ai: Anthropic launches Claude Fable 5.2 and Mythos 5.2 with a 20% price cut as its IPO nears](https://mlq.ai/news/anthropic-launches-claude-fable-5-2-and-mythos-5-2-with-a-20-price-cut-as-its-ipo-nears/)
