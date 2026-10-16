---
title: "Pricing Watch | Google Finally Sets an Expiry Date for Gemini 4 Argon's Promo Price — Nov 30 Deadline, Then a 100% Hike"
date: 2026-10-17
category: daily
type: digest
lang: en
tags: [ai-agent, pricing, daily, google]
description: "Google's official pricing page now gives a firm expiry date for the Gemini 4 Argon promo: November 30, 2026, after which input and output prices both double. The Gemini 3.8 Flash line gets the same treatment, with a December 31, 2026 cutoff."
tldr: "Google's pricing page now carries the expiry date that was missing before: the Gemini 4 Argon promo price (input $2.00, output $10.00 per million tokens) holds through 2026-11-30, then both double to $4.00 / $20.00 starting December 1. Gemini 3.8 Flash and the previous-generation Flash model keep their promo price ($0.75 / $3.75) through 2026-12-31, then double to $1.50 / $7.50 on January 1, 2027. Our October 4 report flagged that Argon's promo had no end date — Google has now filled that gap, and the hike lands exactly at the 100% the original footnote promised."
series:
  name: "AI Pricing Watch"
  order: 24
---

> 🌏 [中文版](/posts/daily/2026-10-17-pricing-google-gemini-argon-flash-promo-deadline)

## Summary

Google quietly added something to its [Gemini Developer API pricing page](https://ai.google.dev/gemini-api/docs/pricing) that wasn't there before: an actual expiry date. Our [October 4 report](/posts/daily/2026-10-04-pricing-google-gemini-4-argon-intro-pricing-en) pointed out that Gemini 4 Argon launched with a promo price and a one-line warning that prices would rise "after the introductory period expires" — with no date attached. Teams trying to budget around Argon were planning against a countdown that didn't exist. Two weeks later, Google published the date: the promo holds through November 30, 2026, and from December 1 input jumps from $2.00 to $4.00 per million tokens, output from $10.00 to $20.00 — exactly the 100% increase the original footnote implied. The same update set a December 31, 2026 cutoff for Gemini 3.8 Flash and the previous-generation Flash model, both doubling on January 1, 2027. Two different Flash generations sharing an identical promo price and identical expiry date is worth flagging on its own — it suggests one pricing policy applied across both rather than two separate decisions.

## Before and After

| Item | Promo price (now) | Standard price (after expiry) | Change | Effective date |
|---|---|---|---|---|
| Gemini 4 Argon Input | $2.00/1M tokens | $4.00/1M tokens | ↑100% | 2026-12-01 |
| Gemini 4 Argon Output | $10.00/1M tokens | $20.00/1M tokens | ↑100% | 2026-12-01 |
| Gemini 4 Argon Context Caching | $0.10/1M tokens | $0.20/1M tokens | ↑100% | 2026-12-01 |
| Gemini 4 Argon Batch Input | $1.00/1M tokens | $2.00/1M tokens | ↑100% | 2026-12-01 |
| Gemini 4 Argon Batch Output | $5.00/1M tokens | $10.00/1M tokens | ↑100% | 2026-12-01 |
| Gemini 3.8 Flash Input | $0.75/1M tokens | $1.50/1M tokens | ↑100% | 2027-01-01 |
| Gemini 3.8 Flash Output | $3.75/1M tokens | $7.50/1M tokens | ↑100% | 2027-01-01 |
| Gemini 3.8 Flash Context Caching | $0.075/1M tokens | $0.15/1M tokens | ↑100% | 2027-01-01 |
| Previous-gen Flash Input | $0.75/1M tokens | $1.50/1M tokens | ↑100% | 2027-01-01 |
| Previous-gen Flash Output | $3.75/1M tokens | $7.50/1M tokens | ↑100% | 2027-01-01 |

## Cost Projection

**Scenario**: An agent handling 10,000 customer-support conversations a day, averaging 1,500 input tokens and 500 output tokens each, run on Gemini 4 Argon and on Gemini 3.8 Flash.

| | Argon promo/month | Argon standard/month (from Dec 1) | Monthly increase |
|---|---|---|---|
| Input cost | $900 | $1,800 | $900 |
| Output cost | $1,500 | $3,000 | $1,500 |
| **Total** | **$2,400** | **$4,800** | **$2,400 (↑100%)** |

| | Flash promo/month | Flash standard/month (from Jan 1) | Monthly increase |
|---|---|---|---|
| Input cost | $337.5 | $675 | $337.5 |
| Output cost | $562.5 | $1,125 | $562.5 |
| **Total** | **$900** | **$1,800** | **$900 (↑100%)** |

## Impact on Developers and Businesses

### Who benefits most

Nobody benefits from a price hike — but teams who learn the deadline early come out ahead. Anyone who pencils these dates into their budget this month can stress-test costs before November 30 and December 31, then decide whether to lock in a long-term contract or Provisioned Throughput before the increase hits, instead of discovering a doubled bill in December.

### Competitive positioning

Gemini pricing after the hikes (input / output, USD per million tokens):

| Model | Promo price | Standard price | Note |
|---|---|---|---|
| Gemini 3.8 Flash / previous-gen Flash | $0.75 / $3.75 | $1.50 / $7.50 | From 2027-01-01 |
| Gemini 4 Argon | $2.00 / $10.00 | $4.00 / $20.00 | From 2026-12-01 |

Even after the hike, Argon's standard price ($4 / $20) sits between Claude Sonnet 5 ($4 / $10) and GPT-5 ($4 / $16) on input, but it's pricier than both on output. Google appears to be positioning Argon as "not the cheapest, but priced so promo-period users are already used to it."

### What to do

- If you're already running Argon through the Fairwind Program or a trusted-partner channel: rerun your cost model now — multiply by two for anything after November 30, don't wait for the invoice.
- If you're running high-volume lightweight work on Gemini 3.8 Flash or the previous-generation model: December 31 is your last window to lock in usage commitments. After that, both Flash generations cost the same, so there's no reason to stay on the older one.
- If your workload can tolerate latency in exchange for cost: Batch API pricing after the hike still puts Argon at $2 / $10 — half of Flash's standard rate — making it worth considering for large offline jobs.

## Timing Alert

⏰ **Gemini 4 Argon promo deadline**: 2026-11-30. Standard pricing of $4.00 / $20.00 (USD per million tokens) applies from December 1.
⏰ **Gemini 3.8 Flash / previous-gen Flash promo deadline**: 2026-12-31. Standard pricing of $1.50 / $7.50 (USD per million tokens) applies from January 1, 2027.

## Today's Takeaway

When we first covered Argon's pricing on October 4, the biggest red flag was the missing expiry date — and that ambiguity is itself a pricing tactic: hook developers with a low price before giving them anything to budget against. Two weeks later Google filled in the date, confirming the hike is exactly the 100% the footnote always implied. But the gap between those two announcements was exactly the window where teams grow their usage, so that by the time the price doubles, switching costs are already too high to walk away. Tracking *when* a vendor discloses its promo deadline may say more about their pricing playbook than tracking the size of the eventual hike.

## References

- [Gemini Developer API Pricing — Google AI for Developers](https://ai.google.dev/gemini-api/docs/pricing)
- [Google AI Studio Pricing (2026): Free, Paid Plans & Gemini API Costs](https://www.nocode.mba/articles/google-ai-studio-pricing)
- [Gemini Pricing 2026: Plans, API & Workspace Cost Guide](https://felloai.com/gemini-pricing/)
- [Oct 4 Pricing Watch: Gemini 4 Argon promo price $2/$10, doubling to $4/$20 after promo ends, but Google gave no expiry date](/posts/daily/2026-10-04-pricing-google-gemini-4-argon-intro-pricing-en)
