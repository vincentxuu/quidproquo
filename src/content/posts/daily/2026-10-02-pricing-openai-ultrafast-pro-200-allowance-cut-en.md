---
title: "Pricing Watch | OpenAI Adds a 6x Ultrafast Speed Tier, Halves Pro 200's Usage Allowance"
date: 2026-10-02
category: daily
lang: en
type: digest
tags: [ai-agent, pricing, daily, openai]
description: "At DevDay 2026, OpenAI added an Ultrafast speed tier to the GPT-6 Astra API at 6x standard price, while cutting ChatGPT Pro 200's Codex/Work usage allowance in half and launching a new $500 Pro 500 plan."
tldr: "On 2026-09-29, OpenAI's DevDay added an Ultrafast speed tier to the GPT-6 Astra API: input/output priced at 6x Standard (short context: $60/$300 per 1M tokens) in exchange for up to 6x faster generation via the API and 8x in Codex. In the same announcement, ChatGPT Pro 200's Codex/Work usage allowance dropped from 20x Plus to 10x Plus — existing subscribers keep their old allowance until 2026-10-29, then receive a one-time $2,500 usage credit that expires 2026-12-31. The new Pro 500 plan ($500/month, 25x Plus usage) is now the only subscription tier that includes Ultrafast."
series:
  name: "AI Pricing Watch"
  order: 14
---

> 🌏 [中文版](/posts/daily/2026-10-02-pricing-openai-ultrafast-pro-200-allowance-cut)

## Summary of Changes

OpenAI made two pricing moves in opposite directions at the same DevDay 2026 event: on one hand, GPT-6.1 Sol matches flagship-level performance at a fifth of the cost (see the [09-30 model card](/posts/daily/2026-09-30-model-openai-gpt-6-1-sol)); on the other, the flagship GPT-6 Astra got a new "pay for speed" tier, Ultrafast, priced at six times standard. At the same event, ChatGPT Pro 200's Codex/Work usage allowance was cut in half, and the new Pro 500 plan ($500/month) is the only tier that bundles this new speed tier. OpenAI is effectively turning "how fast" into a third dimension of pricing, alongside "how smart" and "how cheap" — and for teams running Codex heavily, this update shifts a chunk of what used to be included in Pro 200 onto a pricier new tier.

## Before & After

| Item | Old | New | Change | Effective |
|---|---|---|---|---|
| GPT-6 Astra API Input (short context) | No such tier (Fast tier: $20.00/1M) | Ultrafast: $60.00/1M tokens | New tier, 6x Standard | 2026-09-29 |
| GPT-6 Astra API Output (short context) | No such tier (Fast tier: $100.00/1M) | Ultrafast: $300.00/1M tokens | New tier, 6x Standard | 2026-09-29 |
| GPT-6.1 Sol API Input (short context) | No Fast tier (Standard only: $2.00/1M) | Fast: $4.00/1M tokens | New tier, 2x Standard | 2026-09-29 |
| GPT-6.1 Sol API Output (short context) | No Fast tier (Standard only: $10.00/1M) | Fast: $20.00/1M tokens | New tier, 2x Standard | 2026-09-29 |
| ChatGPT Pro 200: Codex/ChatGPT Work usage cap | 20x Plus usage | 10x Plus usage | -50% | Existing subscribers: 2026-10-30; new subscriptions: immediate |
| ChatGPT Pro 500 (new plan) | Did not exist | $500/month, 25x Plus usage + Ultrafast included | New plan | 2026-09-29 |

Astra's Ultrafast tier claims up to 6x faster generation via the API and up to 8x in Codex (300 tokens/second); usage draws from the plan's included allowance first, then from the credit balance. OpenAI says GPT-6.1 Sol's Ultrafast tier is "coming soon" — for now it's Astra-only.

## Cost Estimate

**Scenario**: A team running agentic coding tasks on GPT-6 Astra via the API, processing 5 million input tokens + 2 million output tokens per day (short context), moving all traffic from Standard to Ultrafast.

| | Standard | Ultrafast | Monthly increase |
|---|---|---|---|
| Input cost/month | $1,500 | $9,000 | $7,500 |
| Output cost/month | $3,000 | $18,000 | $15,000 |
| **Total** | **$4,500/month** | **$27,000/month (+500%)** | **$22,500** |

That 500% increase buys speed, not quality — OpenAI's announcement doesn't claim Ultrafast scores higher on any benchmark; it's the same model, just faster. The subscription math tells a similar story: Pro 200's old 20x Plus allowance is worth roughly $400 in Plus-equivalent terms (at $20/month); cut to 10x, it's worth about $200. Existing subscribers effectively lose half their monthly included usage, and OpenAI's one-time $2,500 credit — while it could cover roughly 12 months of that gap — is only valid for about 3 months before it expires.

## Impact on Developers & Enterprises

### Who Benefits Most

Ultrafast targets latency-sensitive, user-facing workloads where speed itself translates into business value — real-time code completion, or interactive agents that need to finish multiple tool-call rounds within a single conversation turn. For those cases, paying 5x more for 6-8x the speed is a reasonable trade. But most background, asynchronous agent work — code review, test generation, document cleanup — doesn't need real-time responses, and switching it to Ultrafast just means paying 500% more for nothing.

### Competitive Landscape

OpenAI didn't invent "pay for speed" — Google's Gemini API already has a Priority tier (roughly 1.8x standard price for priority processing) — but OpenAI's new markup is notably steeper:

| Vendor/Tier | Price multiplier | What it buys |
|---|---|---|
| Google Gemini Priority | 1.8x | Priority processing, not a guaranteed speedup |
| OpenAI GPT-6 Astra Fast (existing) | 2x | Up to 2.5x speed |
| **OpenAI GPT-6 Astra Ultrafast (new)** | **6x** | **Up to 6x via API, up to 8x in Codex (300 tokens/sec)** |

OpenAI now splits speed into three price bands (Standard/Fast/Ultrafast) instead of two, slicing "speed" more finely — and giving itself more room to charge for it. For anyone comparing rate cards across vendors, this means you can no longer just look at the input/output unit price; you need to check which speed tier that price actually belongs to.

### Action Items

- If you're running background batch work on Astra: stay on Standard. Ultrafast offers you nothing — it's purely extra cost.
- If you have a real-time, latency-critical use case: benchmark Ultrafast on a small slice of traffic first to confirm it actually hits the claimed 6-8x speedup before moving your whole pipeline over. Don't pay the 500% premium for a theoretical ceiling you never actually hit.
- If you're an existing Pro 200 subscriber: plan your workload around your current allowance before 10/29, and use the $2,500 credit before it expires on 12/31 — don't let it go to waste.
- If you're considering upgrading to Pro 500: calculate your actual Ultrafast usage needs first. For most teams, paying for Ultrafast on the API as needed is cheaper than committing to a flat $500/month subscription.

## Expiration Notice

⏰ **Existing Pro 200 allowance preserved until**: 2026-10-29. Starting 10/30, existing subscribers' Codex/ChatGPT Work usage cap drops from 20x Plus to the new, lower cap (10x Plus).
⏰ **One-time $2,500 usage credit expires**: 2026-12-31. Any unused credit from the downgrade is forfeited after this date — it does not roll over.

## Takeaway

It's easy to focus on GPT-6.1 Sol matching flagship performance at a fifth of the cost and miss that the same event also opened a "pay for speed" tier on the flagship model, priced six times higher. That's OpenAI making "how fast" a third pricing dimension alongside "how smart" and "how cheap." For agent developers, that means rate-card comparisons now need an extra column — not just input/output unit price, but which speed tier that price applies to — or you risk mistaking a Fast or Ultrafast quote for a normal Standard-tier cost.

## References

- [OpenAI: DevDay 2026 Recap](https://openai.com/index/devday-2026-recap)
- [Pricing | OpenAI API](https://developers.openai.com/api/docs/pricing)
- [About ChatGPT Pro tiers | OpenAI Help Center](https://help.openai.com/en/articles/9793128-about-chatgpt-pro-tiers)
- [TheNextWeb: OpenAI halves Pro 200 usage and launches a $500 ChatGPT plan at DevDay](https://thenextweb.com/news/openai-devday-pro-200-usage-cut-pro-500-plan)
- [VentureBeat: OpenAI's GPT-6.1 Sol offers Astra-like performance at 1/5th price. A new Ultrafast tier clocks at 300 tokens per second.](https://venturebeat.com/technology/openais-gpt-6-1-sol-offers-astra-like-performance-at-1-5th-price-a-new-ultrafast-tier-clocks-at-300-tokens-per-second)
