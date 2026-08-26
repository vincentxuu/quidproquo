---
title: "Pricing Watch | GPT-5.6 Sol Half-Price on Both OpenRouter and Cloudflare Through 9/18"
date: 2026-08-22
category: daily
tags: [ai-agent, pricing, daily, openai]
lang: en
description: "OpenRouter and Cloudflare AI Gateway both slashed GPT-5.6 Sol pricing by 50% ($5/$30 down to $2.50/$15 per million tokens) — non-BYOK traffic only, running through 2026-09-18"
tldr: "GPT-5.6 Sol standard rates through OpenRouter and Cloudflare AI Gateway drop from $5.00/$30.00 to $2.50/$15.00 per million tokens (input/output, -50%); Flex goes as low as $1.25/$7.50. Promo runs through 2026-09-18. Discount applies only to platform-managed billing (Unified Billing / non-BYOK) traffic — OpenAI's own API pricing is unchanged."
series:
  name: "AI Pricing Watch"
  order: 3
---

> 🌏 [中文版](/posts/daily/2026-08-22-pricing-gpt-5-6-sol-openrouter-cloudflare-discount)

## Change Summary

Within the past three days, two independent inference routing platforms — OpenRouter and Cloudflare AI Gateway — rolled out near-simultaneous 50% discounts on OpenAI's flagship GPT-5.6 Sol model, cutting standard rates from $5.00/$30.00 to $2.50/$15.00 per million tokens (input/output). The Flex tier drops as low as $1.25/$7.50. This is not an OpenAI price cut — calling the OpenAI API directly still costs $5/$30 — but rather two intermediary platforms subsidizing traffic independently, with highly overlapping timing (OpenRouter announced 8/17, Cloudflare followed 8/20). Both promos expire 9/18. The discount applies only to platform-managed billing (non-BYOK) traffic. Notably, OpenRouter's price cut landed right in the middle of Stripe's $7B+ acquisition of OpenRouter — the timing itself is a signal.

## Before & After

| Item | Old Price (OpenAI Standard) | New Price (OpenRouter/Cloudflare, non-BYOK) | Change | Effective | Expires |
|---|---|---|---|---|---|
| GPT-5.6 Sol Input (Standard) | $5.00/1M tokens | $2.50/1M tokens | -50% | 2026-08-17 (OpenRouter) / 8-20 (Cloudflare) | 2026-09-18 |
| GPT-5.6 Sol Output (Standard) | $30.00/1M tokens | $15.00/1M tokens | -50% | Same | 2026-09-18 |
| Cache Read | $0.50/1M tokens | $0.25/1M tokens | -50% | Same | 2026-09-18 |
| Flex/Batch Input | $2.50/1M tokens | $1.25/1M tokens | -50% | 2026-08-17 (OpenRouter) | 2026-09-18 |
| Flex/Batch Output | $15.00/1M tokens | $7.50/1M tokens | -50% | 2026-08-17 (OpenRouter) | 2026-09-18 |

OpenAI's own developer platform (developers.openai.com) still lists GPT-5.6 Sol at $5.00/$30.00 during the same period — this price cut is entirely at the third-party routing layer.

## Cost Estimate

**Scenario**: An agent handling 10,000 customer service conversations per day (averaging 1,500 input tokens + 500 output tokens each), routed through OpenRouter or Cloudflare AI Gateway's Unified Billing on GPT-5.6 Sol standard tier.

| | Old Pricing ($5/$30) | New Pricing ($2.50/$15, promo period) | Monthly Savings |
|---|---|---|---|
| Input cost/month (450M tokens) | $2,250 | $1,125 | $1,125 |
| Output cost/month (150M tokens) | $4,500 | $2,250 | $2,250 |
| **Total** | **$6,750/mo** | **$3,375/mo** | **$3,375 (-50%)** |

## Impact on Developers & Enterprises

### Who Benefits Most

Teams calling Sol through OpenRouter or Cloudflare AI Gateway using platform-managed billing (not BYOK) benefit directly — especially teams that had been routing heavy workloads to Terra/Luna because Sol's pricing was too steep. There's now a one-month window to get flagship reasoning quality at mid-tier pricing. Batch/Flex workloads (data labeling, offline summarization) benefit the most, since the Flex tier is already half-price and stacking the promo brings it to one-quarter of the original standard rate ($1.25/$7.50 vs. standard $5/$30).

### Competitive Landscape Impact

Major model output pricing during the promo period (USD/1M tokens, standard tier only):

| Model | Output | Notes |
|---|---|---|
| GPT-5.6 Luna | $1.20 | OpenAI permanent cut 7/30 |
| Grok 4.6 | $6.00 | — |
| Claude Sonnet 5 | $10.00 | Moved to permanent pricing 8/10 |
| **GPT-5.6 Sol (OpenRouter/Cloudflare promo)** | **$15.00** | Through 9/18 only, non-BYOK traffic only |
| GPT-5.6 Terra | $12.00 | Actually cheaper than discounted Sol during promo — rankings scrambled |
| GPT-5.6 Sol (OpenAI direct / BYOK) | $30.00 | Standard price unchanged |

The promo creates a rare pricing anomaly: mid-tier GPT-5.6 Terra ($12.00) is barely cheaper than discounted flagship Sol ($15.00), yet the two have a noticeable reasoning capability gap. During this window, Sol's price-performance temporarily leapfrogs Terra within the same product family — something that can only happen through platform promos, never on OpenAI's own price sheet.

### Action Items

- If you already call Sol through OpenRouter or Cloudflare AI Gateway without BYOK: verify your billing is on platform-managed (Unified Billing / non-BYOK). The discount applies automatically — no code changes needed.
- If you currently use BYOK or call the OpenAI API directly: this 50% off doesn't apply to you; pricing stays at $5/$30. To capture the discount, you'd need to evaluate switching to platform-managed billing (trading away the flexibility and direct negotiation leverage of BYOK).
- If you have large Batch/Flex workloads: now is the time to lock in volume — $1.25/$7.50 only lasts through 9/18, after which it reverts to $2.50/$15 (standard Flex half-price). Factor this window into your batch scheduling.

## Expiration Notice

⏰ **Promo expires**: 2026-09-18. After expiration, GPT-5.6 Sol rates on OpenRouter/Cloudflare are expected to revert to standard pricing (Input $5.00, Output $30.00, Flex $2.50/$15.00). OpenAI's own API rates were never changed.

## Takeaway

The interesting part of this news isn't "a price cut" — it's where the price cut happened. Not on the model provider's (OpenAI's) pricing page, but on two independent inference routing platforms, making nearly identical moves within three days. Tracking model pricing used to mean watching one vendor's page; now the same model can carry different prices across the vendor, cloud gateways, and routing marketplaces, each shifting independently over time. "How much does this model cost?" is no longer a single question — it's a function of which call path you use. Teams maintaining cost comparison models now need to treat the call path as yet another tracked variable.

## References

- [GPT-5.6 Sol - API Pricing & Benchmarks | OpenRouter](https://openrouter.ai/openai/gpt-5.6-sol)
- [OpenRouter Halves Price on OpenAI's GPT-5.6 Sol Through September 18 — AI Insiders](https://aiinsiders.net/article/openrouter-halves-price-on-openais-gpt-56-sol-through)
- [Unified Billing Discount for GPT-5.6 Sol Model — Cloudflare AI Gateway Changelog](https://cloudninjas.ca/ai/unified-billing-discount-for-gpt-5-6-sol-model/)
- [Pricing | OpenAI API](https://developers.openai.com/api/docs/pricing)
