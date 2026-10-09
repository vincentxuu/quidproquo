---
title: "Pricing Watch | Mistral Large 4 Launches at 50% Off, $0.68/$2.09, No End Date"
date: 2026-10-10
category: daily
lang: en
type: digest
tags: [ai-agent, pricing, daily, mistral]
description: "Mistral's new flagship Large 4 entered public preview on 10/6 at an API sale price of $0.68 input / $2.09 output per 1M tokens — half the listed $1.36/$4.18 rate, with no announced end date"
tldr: "Mistral put Large 4 (Le Chonk) into public preview on 2026-10-06. The official announcement and model card both list $1.36 input / $4.18 output per 1M tokens (cached input $0.14), but the actual billing page runs a straight 50% launch sale: $0.68 input / $2.09 output (cached $0.07). No end date is published anywhere. This is the second time this series has caught the same move — Gemini 4 Argon did it on 9/30. Weights and a named license are still due by end of month."
series:
  name: "AI Pricing Watch"
  order: 21
---

> 🌏 [中文版](/posts/daily/2026-10-10-pricing-mistral-large-4-launch-sale)

## Summary

When Mistral put its new flagship Large 4 into public preview on 2026-10-06, the announcement post and model card both quote the list price — $1.36 input, $4.18 output per 1M tokens — but what Mistral Studio and OpenRouter actually charge is half that: $0.68 input, $2.09 output, tagged "50% off" with no end date attached anywhere. This isn't a one-off. Gemini 4 Argon, launched on 9/30, ran the exact same play: a launch price that makes the new model look cheap, with no countdown attached, which quietly shifts the risk of "how long does this price hold" onto whoever is budgeting against it. Given that Large 4 is positioned around cybersecurity work and its weights won't ship until end of month, this sale reads like a push to get developers testing the hosted API before the open-weight release lands.

## Before/After

| Item | Sale price (now) | Standard price (after promo ends) | Change | Effective date |
|---|---|---|---|---|
| Input | $0.68/1M tokens | $1.36/1M tokens | ↑100% | Not announced (no end date) |
| Output | $2.09/1M tokens | $4.18/1M tokens | ↑100% | Not announced (no end date) |
| Cached Input (holds at 10% of input) | $0.07/1M tokens | $0.14/1M tokens | ↑100% | Not announced (no end date) |

The announcement text and model card only show the list price, $1.36/$4.18. The sale price only shows up on Mistral Studio's actual billing screen and OpenRouter's "50% off" tag — neither states when the discount ends. That's the opposite of what OpenAI did with the GPT-5.6 Sol promo on 9/28, which explicitly guaranteed its rate "through 2026-11-21" (see [09-28 Pricing Watch](/en/posts/daily/2026-09-28-pricing-openai-gpt-6-sol-luna-price-cut-en)).

## Cost Simulation

**Scenario**: An agent handling 10,000 customer-support conversations per day, averaging 1,500 input tokens + 500 output tokens per conversation.

| | Sale price | Standard price | Monthly difference |
|---|---|---|---|
| Input cost/month (450M tokens) | $306.00 | $612.00 | $306.00 |
| Output cost/month (150M tokens) | $313.50 | $627.00 | $313.50 |
| **Total** | **$619.50/month** | **$1,239.00/month** | **$619.50 (↑100%)** |

Because the sale applies a flat 50% discount across input, output, and cache, the bill's internal structure doesn't shift when the promo ends — the whole invoice just doubles overnight. A team that signs a long-term contract or bakes Large 4 into a production cost model at the sale price should expect that doubling to arrive without warning.

## Impact for Developers and Enterprises

### Who benefits most

Teams still in the evaluation phase — not yet in production — get the most out of this. Running a POC or testing the cybersecurity and legal-agent use cases Mistral is pitching Large 4 for costs half the standard rate right now. But with weights still unreleased and the license not even named yet, anyone looking to lock Large 4 into long-term architecture should treat this purely as an API trial, not a basis for production pricing.

### Competitive landscape

Lining Large 4 up against models in the same mid-tier open/open-weight price band (USD per 1M tokens):

| Model | Input | Output | Note |
|---|---|---|---|
| Mistral Large 3 (predecessor) | $0.50 | $1.50 | Fully open, Apache 2.0, weights already downloadable |
| DeepSeek V4 Pro (off-peak) | $0.66 | $1.98 | Off-peak discount rate |
| **Mistral Large 4 (sale)** | **$0.68** | **$2.09** | Weights not released, API preview only |
| DeepSeek V4 Pro (peak) | $1.32 | $3.96 | Peak-hours standard rate |
| **Mistral Large 4 (standard)** | **$1.36** | **$4.18** | List price once the promo ends |
| GLM 5.3 (Mistral-hosted) | $1.40 | $4.40 | Chinese open model on the same platform, no promo risk |

The thing worth flagging: the sale price lands Large 4 right between DeepSeek V4 Pro's two tiers, looking competitive with same-class open models. But the moment the standard rate kicks in, Large 4 ends up pricier than GLM 5.3 — the open-weight model Mistral itself hosts on the same platform. Once the promo ends, Large 4 loses its price edge in this band and has to lean on cybersecurity capability alone to justify staying.

### Action items

- If you're evaluating Large 4 but not yet in production: fine to test at the sale price, but budget against the standard $1.36/$4.18 rate — don't assume the sale survives until your actual rollout
- If you're already running Mistral Large 3 (Apache 2.0, weights already available): no urgency to switch now — Large 4's weights and license terms are still unresolved; revisit migration cost once those details land at end of month
- If you're choosing in this price band and care about cost stability: GLM 5.3 (Mistral-hosted) already sits close to Large 4's standard rate without the "doubles when the promo ends" risk, making it the safer pick for teams that need predictable costs
- Treat "promo with no end date" itself as a vendor-risk line item in your evaluation — this is the second time this series has caught the exact same pattern (the first was Gemini 4 Argon on 9/30), worth assuming it's becoming standard practice rather than a one-off

## Time-Sensitive Notice

⏰ **Promo end date**: Not announced. Neither Mistral Studio's billing page nor OpenRouter's "50% off" tag carries a deadline. Third-party trackers (Artificial Analysis, OpenRouter) that checked in the days after launch likewise found no published end date. Anyone budgeting against this model right now should run the numbers at both the sale price and the standard price.

## Today's Takeaway

Catching Gemini 4 Argon's "no end date" promo last time felt like a one-off quirk from one vendor. Seeing Mistral run almost the identical move on Large 4 — list price in the announcement, a quiet 50%-off billing page with no explanation and no deadline — suggests this is turning into a standard launch tactic rather than a coincidence. For anyone tracking pricing, the first move on a new model announcement should be checking whether the actual billing page matches the number in the press release, not assuming the two are the same.

## References

- [Mistral: Introducing Mistral Large 4](https://mistral.ai/news/mistral-large-4)
- [OpenRouter: Mistral Large 4 API Pricing & Providers](https://openrouter.ai/mistralai/mistral-large-4-0)
- [Artificial Analysis: Mistral Large 4 Preview — Intelligence, Performance & Price Analysis](https://artificialanalysis.ai/models/mistral-large-4)
- [This site's earlier coverage: Mistral Large 4 model card](/en/posts/daily/2026-10-07-model-mistral-large-4-en)
- [This site's earlier coverage: Gemini 4 Argon's no-end-date promo](/en/posts/daily/2026-10-04-pricing-google-gemini-4-argon-intro-pricing-en)
