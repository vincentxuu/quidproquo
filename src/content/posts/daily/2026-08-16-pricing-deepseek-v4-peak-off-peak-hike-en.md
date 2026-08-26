---
title: "Pricing Watch｜DeepSeek V4 Hikes Prices Across the Board, Peak Hours Up to 1,100%"
date: 2026-08-16
category: daily
tags: [ai-agent, pricing, daily, deepseek]
lang: en
description: "DeepSeek raised API pricing for V4-Pro / V4-Flash on 8/16 16:00 UTC and introduced peak/off-peak dual-rate billing. Peak Output prices rose 355%-371%, while Cache Hit Input surged up to 1,114% during peak hours, ending nearly a year of aggressive low-price strategy."
tldr: "DeepSeek V4-Pro peak Output jumped from $0.87 to $3.96/1M tokens (↑355%), V4-Flash from $0.28 to $1.32 (↑371%), effective 2026-08-16 16:00 UTC. Off-peak rates are half of peak (peak hours: 01:00-04:00 and 06:00-10:00 UTC). Post-hike prices still undercut GPT-5.6 and Claude, but the low-cost moat has narrowed significantly."
series:
  name: "AI Pricing Watch"
  order: 1
---

> 🌏 [中文版](/posts/daily/2026-08-16-pricing-deepseek-v4-peak-off-peak-hike)

## Change Summary

Alongside the GA release of V4-Pro, DeepSeek announced a sweeping price increase across the entire V4 API lineup and introduced peak/off-peak dual-rate billing for the first time — the most significant price hike since it adopted its low-price strategy in 2025. The most dramatic line item: V4-Pro Cache Hit Input during peak hours went from $0.003625 to $0.044/1M tokens, a 1,114% increase — the figure behind the "prices up over 1,100%" headlines. But what actually hits most applications' budgets is Output pricing, which rose 355% (V4-Pro) to 371% (V4-Flash). Even after the hike, DeepSeek remains cheaper than GPT-5.6 and Claude, but the narrative of "Chinese models at near-zero cost" is officially over.

## Before & After Comparison

| Item | Old Price (Flat Rate) | New: Off-Peak | New: Peak | Peak Increase | Effective Date |
|---|---|---|---|---|---|
| V4-Pro Input (Cache Miss) | $0.435/1M | $0.66/1M | $1.32/1M | ↑203% | 2026-08-16 16:00 UTC |
| V4-Pro Output | $0.87/1M | $1.98/1M | $3.96/1M | ↑355% | 2026-08-16 16:00 UTC |
| V4-Pro Input (Cache Hit) | $0.003625/1M | $0.022/1M | $0.044/1M | ↑1,114% | 2026-08-16 16:00 UTC |
| V4-Flash Input (Cache Miss) | $0.14/1M | $0.22/1M | $0.44/1M | ↑214% | 2026-08-16 16:00 UTC |
| V4-Flash Output | $0.28/1M | $0.66/1M | $1.32/1M | ↑371% | 2026-08-16 16:00 UTC |
| V4-Flash Input (Cache Hit) | $0.0028/1M | $0.007/1M | $0.014/1M | ↑400% | 2026-08-16 16:00 UTC |

Off-peak rates are fixed at 50% of peak. Peak hours are **01:00–04:00 and 06:00–10:00 UTC**; all other hours are off-peak.

## Cost Estimate

**Scenario**: An Agent handling 10,000 customer service conversations per day (averaging 1,500 input tokens + 500 output tokens each, no caching), running on DeepSeek V4-Pro.

| | Old Pricing | New Pricing (All Peak) | New Pricing (All Off-Peak) |
|---|---|---|---|
| Input Cost/Month (450M tokens) | $195.75 | $594.00 | $297.00 |
| Output Cost/Month (150M tokens) | $130.50 | $594.00 | $297.00 |
| **Total** | **$326.25** | **$1,188.00 (↑264%)** | **$594.00 (↑82%)** |

For the same workload, simply shifting traffic to off-peak hours saves $594/month — more than the old total bill. This change makes "when you call the API" as important a cost decision as "which model you call."

## Impact on Developers & Enterprises

### Who Benefits Most

Nobody "benefits" from a price hike in the short term, but **teams that can schedule non-real-time tasks into off-peak windows** are least affected. Batch summarization, data cleaning, offline eval runs — anything that doesn't need instant responses can move to off-peak and nearly halve the increase. Conversely, real-time customer service and chatbot traffic that can't be scheduled will absorb the full 355%+ hike during peak hours.

### Competitive Landscape Impact

Post-hike Output pricing rankings (USD/1M tokens) for major models:

| Model | Output | Notes |
|---|---|---|
| GPT-5.6 Luna | $1.20 | OpenAI cut 80% on 7/30 |
| **DeepSeek V4-Flash (Off-Peak)** | **$1.98** | Still among the cheapest frontier-class options at off-peak |
| **DeepSeek V4-Pro (Off-Peak)** | **$1.98** | — |
| **DeepSeek V4-Flash (Peak)** | **$1.32** | Note: Peak Flash Output is cheaper than off-peak Pro — scheduling matters more than model selection |
| Claude Haiku 4.5 | $4.00 | Cheapest high-capability model (Western providers) |
| **DeepSeek V4-Pro (Peak)** | **$3.96** | First time approaching Claude Haiku 4.5 post-hike |
| GPT-5.6 Terra | $12.00 | — |
| Claude Sonnet 5 | $10.00 (promo thru 8/31) / $15.00 (from 9/1) | — |

Even after the hike, DeepSeek's peak prices land near Claude Haiku 4.5, and off-peak prices remain well below all major Western models — this adjustment narrowed the gap without flipping the rankings.

### Recommended Actions

- If your workload tolerates latency (batch processing, summarization, offline RAG index builds): shift scheduling outside the 01:00–04:00 / 06:00–10:00 UTC peak windows for an automatic 50% discount.
- If you're running real-time customer service or conversational Agents: re-run your cost projections at peak prices. The 355%-371% increase may make the DeepSeek vs. Claude Haiku 4.5 spread negligible — worth re-evaluating quality and latency before deciding whether to switch.
- If your system relies heavily on prompt caching: note that Cache Hit Input saw the largest hike (up to 1,114% at peak). The assumption that cache hits are "practically free" needs revisiting — don't estimate total cost based on Output increases alone.

## Takeaway

The media headline "prices up over 1,100%" refers to V4-Pro peak-hour Cache Hit Input — the smallest, least commonly factored line item in total cost. The increase most applications actually feel (Output, 355%-371%) is far less dramatic than the headline number. When reading pricing news, always verify "which line item increased" first — headlines tend to pick the cell with the smallest absolute value and the most eye-catching percentage.

## References

- [DeepSeek-V4-Pro GA Release](https://api-docs.deepseek.com/news/news260813/)
- [Models & Pricing | DeepSeek API Docs](https://api-docs.deepseek.com/quick_start/pricing)
- [DeepSeek raises some V4 prices by more than 10x as AI demand strains capacity - InfoWorld](https://www.infoworld.com/article/4209439/deepseek-raises-some-v4-prices-by-more-than-10x-as-ai-demand-strains-capacity.html)
- [DeepSeek Increases Prices for AI Services by Multiple Times - Bloomberg (via Yahoo Finance)](https://finance.yahoo.com/technology/ai/articles/deepseek-increases-prices-ai-services-125256361.html)
- [DeepSeek Launches V4-Pro and Raises API Prices by as Much as 1,100% - Caixin Global](https://www.caixinglobal.com/2026-08-14/deepseek-launches-v4-pro-and-raises-api-prices-by-as-much-as-1100-102473919.html)
- [DeepSeek's AI Models Are About To Cost Four Times More - Engadget](https://www.engadget.com/2236912/deepseek-ai-models-get-four-times-pricier/)
