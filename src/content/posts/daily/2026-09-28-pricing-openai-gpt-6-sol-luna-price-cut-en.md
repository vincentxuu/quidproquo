---
title: "Pricing Watch | OpenAI Ships GPT-6 Sol and Luna, Cutting API Prices Another 50% Off GPT-5.6's Promo Rate"
date: 2026-09-28
category: daily
lang: en
type: digest
tags: [ai-agent, pricing, daily, openai]
description: "OpenAI's official pricing page confirms GPT-6 Sol and Luna launched 2026-09-22 at prices 50%+ below GPT-5.6 Sol/Luna's promotional rate — and that promo rate itself is only guaranteed through 2026-11-21."
tldr: "OpenAI's launch post and pricing page confirm GPT-6 Sol input dropped from $4.00 to $2.00/1M tokens (-50%), output from $20.00 to $10.00 (-50%); GPT-6 Luna input dropped from $0.20 to $0.10 (-50%), output from $1.20 to $0.50 (-58%), effective 2026-09-22. The baseline for the cut is GPT-5.6's promotional pricing, not its list price — and OpenAI's own pricing page notes that GPT-5.6 Sol's promo rate is only guaranteed through 2026-11-21. That means GPT-6 Sol's new $2/$10 is the real long-term number to compare against, not the promo it's being measured against."
series:
  name: "AI Pricing Watch"
  order: 12
---

> 🌏 [中文版](/posts/daily/2026-09-28-pricing-openai-gpt-6-sol-luna-price-cut)

## Summary of Changes

Nineteen days after GPT-6 Astra, OpenAI filled out the rest of the family on 2026-09-22 with two cheaper siblings: GPT-6 Sol and GPT-6 Luna. The launch post is explicit that these aren't scaled-down Astras — they're trained with the same methods, compressing Astra-level capability into smaller, cheaper models, with API prices cut another 50%+ versus GPT-5.6 Sol/Luna's promotional pricing. The detail worth catching is the baseline itself: OpenAI's own pricing page notes that "GPT-5.6 Sol's promotional pricing is available at least through November 21, 2026" — so this cut is measured against a rate that already had an expiration date. GPT-6 Sol's $2/$10 is the number that's actually meant to stick around.

## Before & After

| Item | Old (GPT-5.6) | New (GPT-6) | Change | Effective |
|---|---|---|---|---|
| Sol Input | $4.00/1M tokens | $2.00/1M tokens | -50% | 2026-09-22 |
| Sol Output | $20.00/1M tokens | $10.00/1M tokens | -50% | 2026-09-22 |
| Sol Cached Input | $0.40/1M tokens | $0.20/1M tokens | -50% | 2026-09-22 |
| Sol Batch Input | $2.00/1M tokens | $1.00/1M tokens | -50% | 2026-09-22 |
| Sol Batch Output | $10.00/1M tokens | $5.00/1M tokens | -50% | 2026-09-22 |
| Luna Input | $0.20/1M tokens | $0.10/1M tokens | -50% | 2026-09-22 |
| Luna Output | $1.20/1M tokens | $0.50/1M tokens | -58% | 2026-09-22 |
| Luna Cached Input | $0.02/1M tokens | $0.01/1M tokens | -50% | 2026-09-22 |

Luna's output cut (58%) actually runs deeper than the "50% cheaper" line in OpenAI's own announcement, which is a rounded headline number — the pricing page's actual figures are $1.20 → $0.50. Input and cached input are the two line items that land exactly at 50%.

## Cost Estimate

**Scenario**: An agent handling 10,000 customer-support conversations a day (averaging 1,500 input tokens + 500 output tokens per conversation), moving from GPT-5.6 Sol to GPT-6 Sol.

| | GPT-5.6 Sol | GPT-6 Sol | Monthly savings |
|---|---|---|---|
| Input cost/month (15M tokens/day) | $1,800 | $900 | $900 |
| Output cost/month (5M tokens/day) | $3,000 | $1,500 | $1,500 |
| **Total** | **$4,800/month** | **$2,400/month** | **$2,400 (-50%)** |

The same math is even more striking on Luna: a lightweight agent running 500,000 intent-classification or data-cleanup calls a day (300 input + 50 output tokens each) drops from roughly $1,800/month on GPT-5.6 Luna to about $825 on GPT-6 Luna — a 54% cut. This scenario is output-heavy, so it captures more of Luna's 58% output reduction rather than the flatter 50% average.

## Impact on Developers & Enterprises

### Who Benefits Most

Agents with a high output-to-input ratio that don't need Astra-level reasoning depth stand to gain the most: coding agents producing long diffs, customer-support agents writing full replies, and batch classification/summarization jobs are all output-price-sensitive by nature. OpenAI's own post notes that internal coding-agent usage now runs a median of $600/day in token spend and $7,000/day at the 90th percentile — which explains why this round of cuts targets Sol and Luna rather than Astra: high-frequency, long-running agent workloads are where token pricing actually caps how much scale a team can afford.

### Competitive Landscape

Current flagship pricing (input/output, USD per 1M tokens, standard short-context tier):

| Model | Input | Output | Note |
|---|---|---|---|
| GPT-6 Luna | $0.10 | $0.50 | Cheapest member of the GPT-6 family post-cut |
| Claude Haiku 4.5 | $0.80 | $4.00 | Cheapest high-capability model |
| **GPT-6 Sol (new)** | **$2.00** | **$10.00** | Now well below most same-tier competitors |
| Claude Sonnet 5 | $4.00 | $10.00 | Ties GPT-6 Sol on output, double on input |
| GPT-6 Astra | $10.00 | $50.00 | Flagship tier, unchanged |
| Claude Opus 5 | $15.00 | $75.00 | Most expensive |

After the cut, GPT-6 Sol's output price ties Claude Sonnet 5's, but its input price is half of Sonnet 5's — a clear edge for input-heavy workloads like long-context work or large-scale document retrieval. OpenAI's launch post backs this with its own benchmarks (GPT-6 Sol at xhigh reportedly costs 9% of Claude Opus 5 at max on AutomationBench), but vendor-reported numbers like this tend to pick the comparison that flatters them most, so it's still worth running your own eval before switching.

### Action Items

- If you're running GPT-5.6 Sol in production: switching to GPT-6 Sol is close to a free upgrade — same API shape, half the price, and OpenAI's own benchmark numbers show improvements too. There's little reason not to migrate.
- If you were budgeting around GPT-5.6 Sol's promotional rate: note that OpenAI only guarantees that rate through 2026-11-21. Moving to GPT-6 Sol's $2/$10 locks in a price that's already lower than the promo, with no stated expiration.
- If your agent runs high volumes of lightweight classification or summarization: evaluate shifting traffic from older Luna versions or other vendors' mini-tier models to GPT-6 Luna — at $0.10-$0.50 input/output, it's one of the cheapest capable options among major vendors right now.

## Expiration Notice

⏰ **Promo expiration reminder**: GPT-5.6 Sol's promotional pricing is guaranteed by OpenAI only through **2026-11-21**, after which it may revert to a higher rate or change. If you're still on `gpt-5.6-sol` and haven't evaluated migration, get compatibility testing for GPT-6 Sol done before that date.

## Takeaway

Pricing-change tracking usually treats "new model ships" and "old model gets cheaper" as two separate events — but here OpenAI merged them into one announcement, anchoring the new model's price to "50% below the old model's promotional rate" rather than giving an independent number. That framing reads as a bigger cut and makes for a punchier headline, but the number actually worth remembering is that the old promo rate had an expiration date in the first place. Without checking that detail, it's easy to misread "50% below the promo price" as "an even bigger cut below the list price" — which isn't quite what happened.

## References

- [Introducing GPT-6 Sol and Luna | OpenAI](https://openai.com/index/introducing-gpt-6-sol-and-luna/)
- [Pricing | OpenAI API](https://developers.openai.com/api/docs/pricing)
- [GPT-6 Sol and Luna Are Out: Prices, Specs, Rumors Graded | CellCog](https://cellcog.ai/blog/gpt-6-sol-release-date/)
