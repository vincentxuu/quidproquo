---
title: "Pricing Watch | OpenAI Shuts Down o1, GPT-4, and GPT-3.5-turbo — 12 Legacy Models Gone in One Batch"
date: 2026-10-21
category: daily
type: digest
lang: en
tags: [ai-agent, pricing, daily, openai]
description: "OpenAI retires o1, o1-pro, o3-mini, o4-mini, GPT-4, GPT-4 Turbo, and GPT-3.5-turbo from the API on 2026-10-23, routing all of them through the deprecations page to the GPT-5.6 line."
tldr: "OpenAI's deprecations page lists 12 legacy models shutting down on 2026-10-23. Migrating o1 to GPT-5.6 Sol cuts input from $15 to $4 (-73%) and output from $60 to $20 (-67%) — but o3-mini and o4-mini land on the same or a similar replacement at 1.8x to 3.6x their old price. Any code still calling these model IDs starts failing in three days."
series:
  name: "AI Pricing Watch"
  order: 26
---

> 🌏 [中文版](/posts/daily/2026-10-21-pricing-openai-o1-gpt4-legacy-sunset)

## Summary

OpenAI's API deprecations page, announced back in April, takes effect on October 23, 2026: four reasoning models — o1, o1-pro, o3-mini, and o4-mini — along with the GPT-4 and GPT-3.5-turbo families and GPT Image 1, twelve model IDs in total, go dark on the same day. This isn't a gradual slowdown or a soft warning window — it's a hard cutoff. Any request still pointed at one of these model IDs will simply get an API error. Lay the official pricing table next to the deprecations list and the economics of this migration turn out to be wildly uneven: the most expensive model in the batch, o1, gets a steep price cut on its recommended replacement, while the cheapest ones, o3-mini and o4-mini, land on the same target model at more than triple their old price.

## Before & After

| Item | Old | New (official replacement) | Change | Effective |
|---|---|---|---|---|
| o1 Input | $15.00/1M tokens | $4.00/1M tokens (GPT-5.6 Sol) | ↓73% | 2026-10-23 |
| o1 Output | $60.00/1M tokens | $20.00/1M tokens (GPT-5.6 Sol) | ↓67% | 2026-10-23 |
| o1 Cached Input | $7.50/1M tokens | $0.40/1M tokens (GPT-5.6 Sol) | ↓95% | 2026-10-23 |
| o1-pro Input | $150.00/1M tokens | $4.00/1M tokens (GPT-5.6 Sol, reasoning.mode: pro) | ↓97% | 2026-10-23 |
| o1-pro Output | $600.00/1M tokens | $20.00/1M tokens (GPT-5.6 Sol, reasoning.mode: pro) | ↓97% | 2026-10-23 |
| o3-mini Input | $1.10/1M tokens | $4.00/1M tokens (GPT-5.6 Sol) | ↑264% | 2026-10-23 |
| o3-mini Output | $4.40/1M tokens | $20.00/1M tokens (GPT-5.6 Sol) | ↑355% | 2026-10-23 |
| o4-mini Input | $1.10/1M tokens | $2.00/1M tokens (GPT-5.6 Terra) | ↑82% | 2026-10-23 |
| o4-mini Output | $4.40/1M tokens | $12.00/1M tokens (GPT-5.6 Terra) | ↑173% | 2026-10-23 |
| GPT-4 Turbo Input | $10.00/1M tokens | $4.00/1M tokens (GPT-5.6 Sol) | ↓60% | 2026-10-23 |
| GPT-4 Turbo Output | $30.00/1M tokens | $20.00/1M tokens (GPT-5.6 Sol) | ↓33% | 2026-10-23 |
| GPT-3.5-turbo Input | $0.50/1M tokens | $2.00/1M tokens (GPT-5.6 Terra) | ↑300% | 2026-10-23 |
| GPT-3.5-turbo Output | $1.50/1M tokens | $12.00/1M tokens (GPT-5.6 Terra) | ↑700% | 2026-10-23 |

## Cost Math

**Scenario**: a classification agent running 10,000 requests a day for routing decisions, currently on o3-mini (averaging 800 input + 300 output tokens per call)

| | Old (o3-mini) | New (GPT-5.6 Sol) | Monthly increase |
|---|---|---|---|
| Input cost/month | $264 | $960 | $696 |
| Output cost/month | $396 | $1,800 | $1,404 |
| **Total** | **$660/month** | **$2,760/month** | **$2,100 (+318%)** |

o3-mini is the deliberate pick here, because it's the easiest model in this batch to underestimate. OpenAI's deprecations page gives exactly one migration target — GPT-5.6 Sol — with no cheaper alternative offered alongside it. For lightweight workloads like classification or routing, following that recommendation verbatim more than triples the bill. The more sensible move is usually to test GPT-5.6 Terra or GPT-6 Luna against your own eval set first, rather than taking the "recommended replacement" column at face value.

## Impact on Developers and Enterprises

### Who benefits most

Teams running heavy reasoning workloads on o1 or o1-pro come out way ahead — o1-pro's output rate drops from $600/1M to $20/1M, a 97% cut unmatched anywhere else in this batch. The flip side: teams using o3-mini, o4-mini, or GPT-3.5-turbo for high-volume, low-cost classification or routing see their bill grow, not shrink, if they follow the official migration path as written.

### Competitive landscape

Where each migration path lands (input / output, USD per 1M tokens):

| Migration path | Old model | New model | New price |
|---|---|---|---|
| Reasoning flagship | o1 / o1-pro / o3-mini | GPT-5.6 Sol | $4.00 / $20.00 (promotional, through at least 2026-11-21) |
| Mid-tier | o4-mini / GPT-3.5-turbo | GPT-5.6 Terra | $2.00 / $12.00 |
| Legacy flagship | GPT-4 / GPT-4 Turbo | GPT-5.6 Sol | $4.00 / $20.00 |
| Image generation | GPT Image 1 | GPT Image 2.5 Sunburst/Flare | $8.00 / $30.00 (image output) |

Worth flagging: GPT-5.6 Sol is currently running on promotional pricing, with OpenAI committing only to "at least through November 21." Routing three structurally different legacy models — o1, o3-mini, and GPT-4 — onto the same promotional price stacks all of that risk on one expiring window; the real impact once the promo ends still needs to be recalculated separately.

### Recommended actions

- If you're on o1 or o1-pro: migrate to GPT-5.6 Sol directly — it's a net win on both price and capability. Do this first.
- If you're on o3-mini or o4-mini for lightweight classification or routing: benchmark GPT-6 Luna or GPT-5.6 Luna against your own eval set before migrating. They're very likely cheaper than the officially recommended Sol/Terra path, and you shouldn't inherit that recommendation blindly.
- If your code still calls specific model IDs like `gpt-4-0613`, `gpt-3.5-turbo-0125`, or `o1-2024-12-17` (rather than aliases): these will error out hard starting October 23 — not slow down, not warn. Audit now.
- If you monitor models via the `shutdown_date` field on `GET /v1/models`: it's already set to `2026-10-23` for this batch, and you can use it to automatically flag every affected call.

## Deadline Alert

⚠️ **Shutdown date**: 2026-10-23. o1, o1-pro, o3-mini, o4-mini, `gpt-4-0613`, `gpt-4-turbo-2024-04-09`, `gpt-4-1106-preview`, `gpt-4.1-nano`, `gpt-4o-2024-05-13`, `gpt-image-1`, and their fine-tuned variants are all removed from the API. Migration guide: [OpenAI Deprecations](https://developers.openai.com/api/docs/deprecations).

## Takeaway

The most counterintuitive part of this batch isn't that old models need replacing — it's that OpenAI's own "Recommended replacement" column flattens wildly different cost structures into the same answer. o1 drops 73% in price; o3-mini jumps 264%. Both official replacements say "gpt-5.6-sol." The deprecations page answers "which model still works," not "what happens to your bill when you switch" — those look like the same table but are actually two unrelated questions. Migrating off the recommended model ID without pricing it first is the easiest mistake to make in this round.

## References

- [OpenAI API Deprecations](https://developers.openai.com/api/docs/deprecations)
- [OpenAI API Pricing](https://developers.openai.com/api/docs/pricing)
- [OpenAI API Pricing 2026: GPT-6 Astra, GPT-6.1 Sol Cost Table - Value Add VC](https://valueaddvc.com/blog/openai-api-pricing-2026-gpt-4o-o3-and-gpt-5-cost-breakdown-for-developers)
