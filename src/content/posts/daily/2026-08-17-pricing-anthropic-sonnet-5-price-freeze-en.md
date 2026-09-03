---
title: "Pricing Watch｜Claude Sonnet 5 Price Hike Canceled — $2/$10 Becomes Permanent"
date: 2026-08-17
category: daily
type: digest
tags: [ai-agent, pricing, daily, anthropic]
lang: en
description: "Anthropic cancels the planned 2026-09-01 price increase for Claude Sonnet 5 — the launch promo rate of $2/$10 per million tokens (input/output) is now the permanent standard price, sidestepping a 50% hike"
tldr: "Claude Sonnet 5 was set to jump from its promo price of $2/$10 to $3/$15 on 9/1. On 8/10 Anthropic updated its pricing page to confirm the increase 'will not happen' — $2/$10 is now the permanent price. For a workload of 300K customer-service conversations per month, that avoids a $1,200/month cost increase (↓33%), and means Sonnet 5 is now permanently cheaper than its predecessor Sonnet 4.6 ($3/$15)."
series:
  name: "AI Pricing Watch"
  order: 2
---

> 🌏 [中文版](/posts/daily/2026-08-17-pricing-anthropic-sonnet-5-price-freeze)

## What Changed

When Claude Sonnet 5 launched in June, Anthropic explicitly labeled the $2/$10 (per million tokens input/output) pricing as an "introductory offer" — set to expire on 8/31, with the standard rate of $3/$15 taking effect on 9/1, matching the current price of the previous-generation Sonnet 4.6. Anthropic has now updated its official pricing page to announce that this increase "will not happen": the promo price is now the permanent price. In a month dominated by price hikes elsewhere (DeepSeek raised rates across the board on 8/16, AI demand continues to strain supply), this is a rare move in the opposite direction — Anthropic chose to lock in pricing on its workhorse production model, effectively canceling a planned 33% increase and making the newer model permanently cheaper than its predecessor, breaking the assumption that "newer models should cost more."

## Before vs. After

| Item | Promo Price (current, now permanent) | Originally Planned 9/1 Standard Price (canceled) | Avoided Increase | Original Effective Date |
|---|---|---|---|---|
| Sonnet 5 Input | $2.00/1M tokens | $3.00/1M tokens | 50% | Originally 2026-09-01, canceled |
| Sonnet 5 Output | $10.00/1M tokens | $15.00/1M tokens | 50% | Originally 2026-09-01, canceled |
| Sonnet 5 Cache Hit Input | $0.20/1M tokens (0.1x) | No post-promo rate announced | Promo rate confirmed permanent | — |
| Sonnet 5 5m Cache Write | $2.50/1M tokens | No post-promo rate announced | Promo rate confirmed permanent | — |

## Cost Estimate

**Scenario**: An agent handling 10,000 customer-service conversations per day (averaging 1,500 input tokens + 500 output tokens each), assuming continued use of Sonnet 5 from September onward.

| | Originally Planned 9/1 (if hike proceeded) | Actual (after cancellation, price unchanged) | Savings |
|---|---|---|---|
| Input cost/month (450M tokens) | $1,350 | $900 | $450 |
| Output cost/month (150M tokens) | $2,250 | $1,500 | $750 |
| **Total** | **$3,600/month** | **$2,400/month** | **$1,200 (↓33%)** |

## Impact for Developers and Enterprises

### Who Benefits Most

Teams already running Sonnet 5 in production that had budgeted for the 50% September increase benefit most directly — no renegotiations needed, no pricing model adjustments, the savings just land. Teams that were holding off on scaling their Sonnet 5 deployments because of the upcoming price hike now have one fewer reason to wait.

### Competitive Landscape

Post-cancellation output pricing comparison for major models (USD/1M tokens):

| Model | Output | Notes |
|---|---|---|
| GPT-5.6 Luna | $1.20 | OpenAI 80% price cut on 7/30 |
| DeepSeek V4-Pro (off-peak) | $1.98 | Still one of the cheapest frontier options off-peak after 8/16 increase |
| Gemini 3.7 Flash (promo) | $3.75 | Promo until 2026-12-31, doubles to $7.50 after |
| Claude Haiku 4.5 | $5.00 | — |
| **Claude Sonnet 5** | **$10.00** | Permanent price, no 9/1 hike risk |
| GPT-5.6 Terra | $12.00 | — |
| Claude Sonnet 4.6 (previous gen) | $15.00 | Sonnet 5 now permanently 33% cheaper than its predecessor |
| Claude Opus 5 | $25.00 | — |

The most direct effect of the canceled hike is on Anthropic's own product line positioning: Sonnet 5 was supposed to converge to Sonnet 4.6's $15 output price in September. Instead, it stays permanently one-third cheaper than the previous generation — bundling "use the newer model" with "use the cheaper model" rather than forcing customers to choose between the two.

### Action Items

- If you're already running Sonnet 5 in production: no action needed — just delete the 9/1 price hike from your budget calendar.
- If you're still on Sonnet 4.6: the case for switching to Sonnet 5 is now stronger and more durable — it's not just a newer model, it's permanently 33% cheaper, and you no longer have to rush a decision before the 8/31 promo window closes.
- If you were delaying scale-up because of the planned September increase: that blocker is gone. You can build long-term architecture plans on the $2/$10 baseline.

## Takeaway

Most pricing news covers "what changed." But the real story here is "something that was scheduled to happen didn't" — a publicly announced price increase was canceled. On the surface, "nothing changed," but for budget planning purposes, this matters just as much as an actual price cut, because it eliminates a future cost that was already locked in and just hadn't taken effect yet. This kind of "non-event" announcement is especially easy to miss, because headlines track things that happen, not things that were supposed to happen but didn't.

## References

- [Pricing | Claude Platform Docs](https://platform.claude.com/docs/en/about-claude/pricing)
- [Claude Sonnet 5 Price Freeze: What It Means for Business - Enterprise DNA](https://enterprisedna.co/resources/news/anthropic-claude-sonnet-5-pricing-permanent-reversal-august-2026/)
- [LLM API Pricing 2026: Complete Guide to the Best Rates - Progressive Robot](https://www.progressiverobot.com/2026/08/13/llm-api-pricing-comparison-2026/)
