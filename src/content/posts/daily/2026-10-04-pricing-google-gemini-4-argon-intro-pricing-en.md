---
title: "Pricing Watch | Gemini 4 Argon launches at $2/$10, doubles to $4/$20 after the promo — with no end date"
date: 2026-10-04
category: daily
type: digest
tags: [ai-agent, pricing, daily, google]
lang: en
description: "Google's own blog confirms it: Gemini 4 Argon's introductory API price is $2 input / $10 output per 1M tokens. After the promo ends, the standard price doubles to $4/$20 — and Google never said when that happens."
tldr: "Google announced Gemini 4 Argon on 2026-09-30 with an introductory API price of $2.00 input / $10.00 output per 1M tokens (cached input $0.10). Once the introductory period ends, the standard price doubles to $4.00/$20.00 (cached $0.20) — a 100% jump. The announcement only says the increase kicks in 'after the introductory period expires,' with no actual date, and Argon is currently limited to trusted cybersecurity partners with no timeline for general API access."
series:
  name: "AI Pricing Watch"
  order: 16
---

> 🌏 [中文版](/posts/daily/2026-10-04-pricing-google-gemini-4-argon-intro-pricing)

## What changed

Google announced Gemini 4 Argon on 2026-09-30. The pricing sits in the body of the post, but the number that matters most is buried in a footnote: an introductory price of $2 input / $10 output per 1M tokens, rising to $4/$20 once the introductory period ends — a flat 100% increase. This isn't a price cut or a price hike announcement. It's the standard "launch at half price, raise it later" playbook. What's unusual is that Google gave no indication of how long the introductory period lasts, so any team budgeting around Argon today is working inside a discount window with no visible countdown. It's also priced before it's even broadly available — Argon currently ships only to trusted cyber defenders through the Fairwind Program, with general developer access still unscheduled.

## Before and after

| Item | Introductory (now) | Standard (after promo ends) | Change | Effective date |
|---|---|---|---|---|
| Input | $2.00/1M tokens | $4.00/1M tokens | ↑100% | Not announced (no end date) |
| Output | $10.00/1M tokens | $20.00/1M tokens | ↑100% | Not announced (no end date) |
| Cached input (95% off input) | $0.10/1M tokens | $0.20/1M tokens | ↑100% | Not announced (no end date) |

Google's own footnote reads: "After the introductory period expires, the price of $4 per 1M input tokens and $20 per 1M output tokens will apply." No date, no window like "within a few months." That's the opposite of what OpenAI did the same week with GPT-5.6 Sol's promo price, which the pricing page states explicitly expires 2026-11-21 (see our [09-28 pricing watch](/en/posts/daily/2026-09-28-pricing-openai-gpt-6-sol-luna-price-cut-en)).

## Cost projection

**Scenario**: an agent handling 10,000 customer-service conversations per day, averaging 1,500 input tokens and 500 output tokens each. (Argon is currently restricted to cyber-defense partners, so this is a price comparison, not a claim that general teams can run this workload today.)

| | Introductory | Standard | Monthly difference |
|---|---|---|---|
| Input cost/month | $900 | $1,800 | $900 |
| Output cost/month | $1,500 | $3,000 | $1,500 |
| **Total** | **$2,400/month** | **$4,800/month** | **$2,400 (↑100%)** |

A team that signs a long-term contract or bakes Argon into production during the promo could see its bill double with no warning. That's the real difference between a promo with a stated end date and one without: the first lets you plan around a calendar; the second only lets you assume the price could change at any moment.

## Impact on developers and enterprises

### Who benefits most

Right now the only users who can actually claim the introductory price are the cyber-defense partners in the Fairwind Program — early collaborators Google recruited for testing, for whom the discount is mostly symbolic rather than a real cost factor. By the time Argon opens to general API customers and Google AI Ultra subscribers, the promo window may already be half over or finished, which means ordinary developers are the ones least likely to get the full discount period.

### Competitive landscape

Current pricing across major models (input/output, USD per 1M tokens):

| Model | Input | Output | Note |
|---|---|---|---|
| GPT-6 Luna | $0.10 | $0.50 | Cheapest high-capability model |
| Claude Haiku 4.5 | $1.00 | $5.00 | Anthropic's cheapest general-purpose model |
| GPT-6 Sol | $2.00 | $10.00 | Standard long-term price, no promo clock |
| Claude Sonnet 5.5 | $2.00 | $10.00 | Standard long-term price, no promo clock |
| **Gemini 4 Argon (introductory)** | **$2.00** | **$10.00** | Matches Sol/Sonnet 5.5 — but this is temporary |
| Claude Opus 5.5 | $4.00 | $20.00 | Standard long-term price |
| **Gemini 4 Argon (standard)** | **$4.00** | **$20.00** | Lands in the same tier as Opus 5.5 once the promo ends |
| GPT-6 Astra | $10.00 | $50.00 | Most expensive flagship |
| Fable 5.1 | $10.00 | $50.00 | Most expensive flagship |

The table's real story: Argon's introductory price sits exactly in the Sol/Sonnet 5.5 tier, while its standard price sits exactly in the Opus 5.5 tier. Google is effectively using the discount to make Argon look like a mid-tier model at launch, while the actual long-term price targets flagship-tier spend.

### What to do

- If you're a Fairwind Program partner: you can use the introductory price today, but budget next quarter's spend against the $4/$20 standard rate — don't assume the promo survives your next billing cycle.
- If you're waiting for general API access: hold off on baking Argon into your cost model until Google announces an end date or you actually get access. Any number you calculate now could be wrong by the time it matters.
- If you're choosing between Sonnet 5.5/GPT-6 Sol and Argon: the first two are confirmed long-term prices, while Argon's matching rate today is very likely to double later. Unless Argon's 1M-token output ceiling or cyber-defense capability is something you can't get elsewhere, don't base the decision on the introductory price alone.
- If your team needs predictable multi-year costs: treat "a promo with no end date" as its own risk item in vendor evaluation, separate from promos that come with a stated expiration.

## Timing alert

⏰ **Promo end date**: not announced. Google's footnote only states that the price changes "after the introductory period expires," with no time range given. Multiple independent write-ups (DataCamp, NeuralTrust, Artificial Analysis) checked the announcement in the days after launch and confirmed no end date appears anywhere in it. Anyone planning costs around Argon right now should budget for both the introductory and standard price, not just the one that's currently in effect.

## Today's takeaway

I used to assume every "introductory price" announcement came with an end date somewhere, even if it was buried. This is the first one I've tracked where the date simply isn't there — just a conditional future trigger ("once the promo ends"). That gives the vendor maximum flexibility to end the discount whenever it wants without breaking any stated commitment, but it shifts all the planning risk onto the customer. "Does this promo have an end date" should be a field you actively check on every pricing announcement, not something you assume exists.

## References

- [Google: Gemini 4 Argon: our next era of frontier intelligence](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-argon)
- [Yahoo Finance: Google's Gemini 4 Argon Closes the Pricing Triangle](https://finance.yahoo.com/technology/ai/articles/google-gemini-4-argon-closes-235954585.html)
- [DataCamp: Gemini 4 Argon: Features, Benchmarks, Pricing, and Access](https://www.datacamp.com/blog/gemini-4-argon)
