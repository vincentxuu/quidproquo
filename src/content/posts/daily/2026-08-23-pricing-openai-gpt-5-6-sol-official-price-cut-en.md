---
title: "Pricing Watch | OpenAI Cuts GPT-5.6 Sol Official Prices by 20-33%"
date: 2026-08-23
category: daily
type: digest
tags: [ai-agent, pricing, daily, openai]
lang: en
description: "On 8/21, OpenAI cut the official standard rates for its flagship GPT-5.6 Sol — input from $5 to $4 (↓20%), output from $30 to $20 (↓33%). Promotional pricing runs at least through 2026-11-21. This time it's the vendor itself, not a platform discount."
tldr: "OpenAI officially lowered GPT-5.6 Sol standard rates from $5.00/$30.00 to $4.00/$20.00 per million tokens (input/output; input ↓20%, output ↓33%), effective 2026-08-21, promotional period at least through 11/21. This is OpenAI's own price cut — not an OpenRouter/Cloudflare-style platform promo (see previous post). The two now stack: OpenRouter's 50% discount applies on top of the new $4/$20 base, yielding $2.00/$10.00."
series:
  name: "AI Pricing Watch"
  order: 4
---

> 🌏 [中文版](/posts/daily/2026-08-23-pricing-openai-gpt-5-6-sol-official-price-cut)

## Summary of Changes

Just yesterday we documented OpenRouter and Cloudflare AI Gateway offering platform-side 50% promotions on GPT-5.6 Sol while OpenAI's own standard rates stayed at $5/$30. Then on the same day (8/21), OpenAI made its own move — cutting Sol's official standard rates from $5.00/$30.00 to $4.00/$20.00, a 20% reduction on input and 33% on output. This is a change to OpenAI's own pricing table, not a middleman subsidizing traffic. Reuters quoted OpenAI attributing the cut directly to competitive pressure from Anthropic and Chinese models. After the cut, OpenRouter's existing 50% promo automatically stacks on the new official price, bringing the effective cost via OpenRouter down to $2.00/$10.00.

## Before & After

| Item | Old (OpenAI Official) | New (OpenAI Official) | Change | Effective |
|---|---|---|---|---|
| GPT-5.6 Sol Input (short context) | $5.00/1M tokens | $4.00/1M tokens | ↓20% | 2026-08-21 |
| GPT-5.6 Sol Output (short context) | $30.00/1M tokens | $20.00/1M tokens | ↓33% | 2026-08-21 |
| Cached Input (short context) | $0.50/1M tokens | $0.40/1M tokens | ↓20% | 2026-08-21 |
| Cache Writes (short context) | $6.25/1M tokens | $5.00/1M tokens | ↓20% | 2026-08-21 |
| Input (long context, >272K tokens) | $10.00/1M tokens | $8.00/1M tokens | ↓20% | 2026-08-21 |
| Output (long context, >272K tokens) | $45.00/1M tokens | $30.00/1M tokens | ↓33% | 2026-08-21 |

## Cost Estimate

**Scenario**: An agent handling 10,000 customer service conversations per day (average 1,500 input tokens + 500 output tokens each), calling the OpenAI API directly (no BYOK, no platform-managed discounts).

| | Old Pricing ($5/$30) | New Pricing ($4/$20) | Monthly Savings |
|---|---|---|---|
| Input cost/month (450M tokens) | $2,250 | $1,800 | $450 |
| Output cost/month (150M tokens) | $4,500 | $3,000 | $1,500 |
| **Total** | **$6,750/mo** | **$4,800/mo** | **$1,950 (↓29%)** |

## Impact on Developers & Enterprises

### Who Benefits Most

Teams calling the OpenAI API directly — without routing through OpenRouter/Cloudflare or similar third-party gateways — are seeing a real reduction in official standard pricing for the first time. Yesterday's platform promos only applied to Unified Billing / non-BYOK traffic; this official cut applies to all developers regardless of billing path. Output-heavy agent workloads benefit the most since the output reduction (33%) exceeds input (20%), consistent with the 7/30 Terra/Luna price cuts — OpenAI continues to concentrate reductions on the output side.

### Competitive Landscape

Post-cut output pricing for major models (USD/1M tokens, standard tier):

| Model | Output | Notes |
|---|---|---|
| GPT-5.6 Luna | $1.20 | OpenAI permanent cut 7/30 |
| Claude Sonnet 5 | $10.00 | Promo price through 8/31; reverts to $15.00 on 9/1 |
| **GPT-5.6 Terra** | **$12.00** | Post-7/30 cut price |
| **GPT-5.6 Sol (new)** | **$20.00** | 8/21 official cut |
| Claude Opus 5 | $25.00 | — |
| Claude Fable 5 | $50.00 | Anthropic's most expensive flagship tier |

This cut compresses the Sol-to-Terra output price gap from 2.5x ($30 vs $12) to under 1.7x ($20 vs $12), significantly narrowing the pricing distinction between flagship and mid-tier models. At the same time, Sol's output price now sits squarely between Anthropic's two models (Opus 5 at $25 and Sonnet 5 at $10), inserting itself directly into Anthropic's pricing band — exactly the competitive response to Anthropic and Chinese models that OpenAI acknowledged in the Reuters report.

### Action Items

- If you call the OpenAI API directly for Sol: no code changes needed. The new pricing applies automatically from 8/21. Re-run your monthly cost projections — expect the biggest savings on the output side.
- If you're already using OpenRouter/Cloudflare AI Gateway promos: verify that the real-time quotes you see reflect the new official base price. OpenRouter currently shows post-50% prices of $2.00/$10.00 (down from $2.50/$15.00 during the earlier promo-only period — effectively a double discount).
- If you previously chose Terra over Sol due to cost: the Sol-to-Terra gap has narrowed to about 1.7x. It's worth re-evaluating whether Sol's reasoning capability gains justify the premium, especially with this promotional period running at least through 11/21 — a nearly three-month window to validate.

## Expiration Notice

⏰ **Promo expiration**: OpenAI's official page states "at least through 2026-11-21" (approximately three months from 8/21). After that, Sol's standard price may revert to $5.00/$30.00 or the promo may be extended — the official page only commits to a minimum end date with no guidance on what happens after. Recommend re-checking before November.

## Takeaway

Over the past week, third-party gateways (OpenRouter, Cloudflare) discounted Sol ahead of OpenAI, and now OpenAI has followed with its own official cut. This confirms that "middlemen cut first to test the water, vendor follows" isn't coincidence — it's a price-signal propagation chain: gateway discounts revealed the market's actual willingness to pay for Sol, and OpenAI responded by writing the reduction into its own pricing table. For anyone tracking AI pricing, gateway-level promotions are themselves a leading indicator of official price moves — worth reading as part of the same story rather than logging as separate events.

## References

- [Pricing | OpenAI API](https://developers.openai.com/api/docs/pricing)
- [Changelog | OpenAI API](https://developers.openai.com/api/docs/changelog)
- [OpenAI cuts developer pricing for frontier GPT-5.6 Sol model by more than 20% — Reuters](https://www.reuters.com/technology/openai-cuts-developer-pricing-frontier-gpt-56-sol-model-by-more-than-20-2026-08-21)
- [Amazon Bedrock announces reduced pricing for OpenAI GPT-5.6 Sol — AWS](https://aws.amazon.com/about-aws/whats-new/2026/08/bedrock-openai-gpt-56-sol-reduced-pricing)
- [GPT-5.6 Sol - API Pricing & Benchmarks | OpenRouter](https://openrouter.ai/openai/gpt-5.6-sol)
