---
title: "Pricing Watch | DeepSeek Drops to Off-Peak Rates All Weekend — The Other Half of Last Week's Hike Story"
date: 2026-08-28
category: daily
tags: [ai-agent, pricing, daily, deepseek]
lang: en
description: "DeepSeek stopped charging peak-hour rates on weekends starting 8/23 — Saturdays and Sundays now bill entirely at off-peak rates. Just a week after hiking peak V4 pricing by 355%+, this is the other half of the story."
tldr: "Effective 2026-08-23 00:00 Beijing time, DeepSeek no longer distinguishes peak from off-peak hours on Saturdays and Sundays — the entire weekend now bills at the off-peak rate. Previously, weekends followed the same schedule as weekdays, with V4-Pro output costing $3.96/1M tokens during peak windows; now weekends are $1.98/1M all day. Weekday billing is unchanged. This lands just one week after the 8/16 peak-hour price hike (output up 355%-371%)."
series:
  name: "AI Pricing Watch"
  order: 6
---

> 🌏 [中文版](/posts/daily/2026-08-28-pricing-deepseek-v4-weekend-off-peak-discount)

## Summary

Last week we covered DeepSeek's peak-hour price hike across the V4 lineup (output up 355%-371%). This week DeepSeek adjusted again — but this time it's a half-step back. Starting 8/23, Saturdays and Sundays no longer distinguish between peak and off-peak hours: the entire weekend now bills at the off-peak rate. Before this change, weekends actually followed the exact same schedule as weekdays, so the peak windows (9:00-12:00 and 14:00-18:00 Beijing time) still charged peak rates even on weekends. This adjustment doesn't touch a single list price — it simply shrinks the definition of "peak hours" from "weekdays plus weekends" down to "weekdays only," which cuts the old weekend peak rate in half. DeepSeek's stated reason is to give developers more flexibility to schedule weekend workloads while helping the company balance compute capacity network-wide — which reads more like a load-shaping tool than a price-war move.

## Before / After

| Item (within old weekend peak window) | Old price | New price | Change | Effective |
|---|---|---|---|---|
| V4-Pro Output | $3.96/1M tokens | $1.98/1M tokens | ↓50% | 2026-08-23 00:00 (Beijing time) |
| V4-Pro Input (Cache Miss) | $1.32/1M tokens | $0.66/1M tokens | ↓50% | 2026-08-23 00:00 (Beijing time) |
| V4-Pro Input (Cache Hit) | $0.044/1M tokens | $0.022/1M tokens | ↓50% | 2026-08-23 00:00 (Beijing time) |
| V4-Flash Output | $1.32/1M tokens | $0.66/1M tokens | ↓50% | 2026-08-23 00:00 (Beijing time) |
| V4-Flash Input (Cache Miss) | $0.44/1M tokens | $0.22/1M tokens | ↓50% | 2026-08-23 00:00 (Beijing time) |
| V4-Flash Input (Cache Hit) | $0.014/1M tokens | $0.007/1M tokens | ↓50% | 2026-08-23 00:00 (Beijing time) |

Weekday billing is completely unchanged: peak hours (9:00-12:00 and 14:00-18:00 Beijing time) still cost twice the off-peak rate. The new rule's boundary isn't "time of day" but "day of week" — as long as it falls on a Saturday or Sunday (Beijing time), the entire day bills at the off-peak rate; charges incurred before the effective date still settle under the old rule.

## Cost Math

**Scenario**: A team runs a large batch summarization job every Saturday on V4-Pro (500M input tokens / cache miss + 200M output tokens), spanning the full day and necessarily overlapping the old peak window.

| | Old rule (weekend still charged peak) | New rule (weekend all off-peak) | Saved per run |
|---|---|---|---|
| Input cost/run | $660.00 | $330.00 | $330.00 |
| Output cost/run | $792.00 | $396.00 | $396.00 |
| **Total/run** | **$1,452.00** | **$726.00 (↓50%)** | **$726.00** |
| **Total/month (4 Saturdays)** | **$5,808.00** | **$2,904.00** | **$2,904.00** |

This deliberately assumes the entire batch job falls within the old peak window (the worst case) to show the maximum benefit; if a job was already scheduled in the old off-peak window, this change makes no difference to you at all. In other words, how much you benefit depends entirely on your scheduling habits, not on which model you use.

## Impact on Developers and Enterprises

### Who benefits most

Teams that had flexibility but not the bandwidth to fine-tune scheduling benefit the most. Previously, getting the off-peak rate on a weekend required satisfying two conditions at once — "scheduled on a weekend" and "avoiding the weekend's own peak window." Now only the first condition matters, removing one layer of scheduling logic. For batch summarization, data cleaning, offline evaluation, or fine-tuning preprocessing — work that was already going to be deferred anyway — this is effectively free extra discounted time. Real-time services that can't be pushed to the weekend (customer support, chatbots) get nothing from this change; their cost structure is exactly what it was after last week's hike.

### Competitive landscape

Leading models ranked by output pricing, with DeepSeek's new weekend rate added (USD/1M tokens):

| Model | Output | Note |
|---|---|---|
| GPT-5.6 Luna | $1.20 | Post-7/30 OpenAI cut |
| **DeepSeek V4-Flash (weekend / weekday off-peak)** | **$0.66** | Weekend and weekday off-peak now unified at one rate |
| **DeepSeek V4-Pro (weekend / weekday off-peak)** | **$1.98** | Same |
| DeepSeek V4-Flash (weekday peak) | $1.32 | Weekday rule unchanged |
| Claude Haiku 4.5 | $4.00 | Cheapest high-capability model (Western lab) |
| DeepSeek V4-Pro (weekday peak) | $3.96 | Weekday rule unchanged |
| GPT-5.6 Terra | $12.00 | — |
| Claude Sonnet 5 | $10.00 ($2/$10 made permanent on 8/11) | — |

This change doesn't touch a single list price, so it doesn't reshuffle the "cheapest model" ranking. What actually changes is the size of the window in which you can get the lowest rate — from roughly 119 hours a week (weekday off-peak hours) to roughly 167 hours (adding the full weekend), a jump from about 71% to about 99% of the week. For teams that lean heavily on DeepSeek for batch processing, off-peak coverage effectively extends to nearly the entire week.

### Recommendations

- If you have deferrable batch work (summarization, cleaning, offline evaluation, index rebuilding): prioritize scheduling it for the weekend — you no longer need to dodge the old peak window, so your scheduling logic can collapse to a simple "is_weekend" check.
- If you already schedule non-urgent work for weekday off-peak hours: this change doesn't directly touch your bill, but it's worth shifting some of that work to the weekend to free up weekday off-peak headroom for more time-sensitive tasks.
- If you're running real-time services: this change doesn't apply to you — you still need to reassess last week's hike (peak output up 355%+) and decide whether to switch models or lean harder on caching.

## Today's Takeaway

Last week's DeepSeek price-hike headlines all led with "up to 1,100%." This week's headlines flip to "weekend rates cut in half" — read separately, each looks like its own isolated event, but read together they form the complete story: DeepSeek first added a whole new dimension of pricing complexity with the peak/off-peak split, then a week later clawed part of it back with a blanket weekend exception. This rhythm — hike first, set the rule, then partially retreat via a carve-out — tells you more than the raw percentages do: a pricing change's real intent often only becomes clear once the vendor publishes its exceptions. This particular exception lines up neatly with "the days DeepSeek's own staff aren't working," echoing the speculation in several reports that peak hours may correspond to compute DeepSeek reserves for its own model training.

## References

- [DeepSeek Ends Weekend Peak Pricing for API Users From Today — Bloomberg](https://www.bloomberg.com/news/articles/2026-08-23/deepseek-ends-weekend-peak-pricing-for-api-users-from-today)
- [DeepSeek applies off-peak API pricing on weekends, slashing bills by half — The Standard](https://www.thestandard.com.hk/innovation/article/340702/DeepSeek-applies-off-peak-API-pricing-on-weekends-slashing-bills-by-half)
- [DeepSeek API to Apply Off-Peak Pricing All Weekend as Big-Model Price Hikes Signal Strong Compute Demand — BigGo Finance](https://finance.biggo.com/news/106a7229-706b-4f21-b435-9f56e3915b64)
- [DeepSeek API Billing Adjustment: Weekend Rates to Use Off-Peak Pricing All Day — Odaily](https://www.odaily.news/en/newsflash/511930)
- [定價追蹤｜DeepSeek V4 全面調漲，尖峰時段最高漲 1,100%](/posts/daily/2026-08-16-pricing-deepseek-v4-peak-off-peak-hike)
