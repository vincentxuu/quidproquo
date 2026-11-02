---
title: "Pricing Watch | Mistral Large 4's Open-Ended Sale Becomes the Permanent Price: $0.70/$2.10"
date: 2026-11-03
category: daily
lang: en
type: digest
tags: [ai-agent, pricing, daily, mistral]
description: "The same day Mistral open-weighted Large 4, it turned the no-end-date launch sale into the standing price: $0.70 input / $2.10 output per 1M tokens — only 2-3% above the sale rate, and nearly half the original list price of $1.36/$4.18"
tldr: "On 2026-10-29, the same day it open-weighted Large 4, Mistral set what had been a 50%-off, no-end-date launch sale as the official list price: $0.70 input / $0.07 cached input / $2.10 output per 1M tokens, down 48.5%/50%/49.8% from the pre-sale list price of $1.36/$0.14/$4.18 — but only 2.9%/0%/0.5% above the original sale rate. This site flagged the undated sale on 10/10 as a risk the vendor was quietly shifting onto developers. Three weeks later, Mistral kept the sale price instead of letting it vanish."
series:
  name: "AI Pricing Watch"
  order: 31
---

> 🌏 [中文版](/posts/daily/2026-11-03-pricing-mistral-large-4-permanent-price)

## Summary

When Mistral put flagship model Large 4 into public preview on 2026-10-06, the model card quoted a list price of $1.36 input / $4.18 output per 1M tokens, but the actual billing on Studio and OpenRouter ran a flat 50% off — $0.68 input / $2.09 output — with no end date published anywhere (see [10/10 Pricing Watch](/posts/daily/2026-10-10-pricing-mistral-large-4-launch-sale-en)). Three weeks later, on 2026-10-29, Mistral's [open-weight release announcement](https://mistral.ai/news/mistral-large-4-oss/) settled the question with one line: "Starting today, Mistral Large 4 is priced at $0.70 input / M, $0.07 cached input / M, and $2.10 output / M tokens." No "limited time," no "promo" label — this is now the standing rate. Run the math and the new price sits only 2-3% above the original sale, which means Mistral chose to keep the 50%-off rate permanently rather than let the "when does this bill double" risk that developers were quietly carrying actually land. The timing isn't a coincidence: the price change and the open-weight release landed on the same day. Once a model's weights are downloadable, the hosted API price has to track the marginal cost of self-hosting — a vendor can no longer lure developers in at a sale rate and then quietly walk it back up.

## Before/After

| Item | Pre-sale list price (10/6–10/28) | Sale price (10/6–10/28, no end date) | New permanent price (from 10/29) | Change vs. list price | Effective date |
|---|---|---|---|---|---|
| Input | $1.36/1M tokens | $0.68/1M tokens | $0.70/1M tokens | ↓48.5% | 2026-10-29 |
| Cached Input | $0.14/1M tokens | $0.07/1M tokens | $0.07/1M tokens | ↓50% | 2026-10-29 |
| Output | $4.18/1M tokens | $2.09/1M tokens | $2.10/1M tokens | ↓49.8% | 2026-10-29 |

The new permanent price is nearly identical to the sale price: input is only $0.02 higher (+2.9%), output only $0.01 higher (+0.5%), and cached input didn't move at all. The official announcement and model card now show only the new permanent price — the original $1.36/$4.18 list price has been removed from the docs. Mistral still hasn't published a separate batch rate for Large 4; third-party tracking shows no batch figure listed as of this writing.

## Cost Simulation

**Scenario**: An agent handling 10,000 customer-support conversations per day, averaging 1,500 input tokens + 500 output tokens per conversation — the same scenario used in the 10/10 article, for direct comparison.

| | Pre-sale list price | Sale price (10/6–10/28) | New permanent price (from 10/29) | Monthly savings vs. list price |
|---|---|---|---|---|
| Input cost/month (450M tokens) | $612.00 | $306.00 | $315.00 | $297.00 |
| Output cost/month (150M tokens) | $627.00 | $313.50 | $315.00 | $312.00 |
| **Total** | **$1,239.00** | **$619.50** | **$630.00** | **$609.00 (↓49.1%)** |

The number that matters is $630.00 vs. $619.50: a team that was already piloting on the sale price back in October sees its bill go up by just $10.50/month (+1.7%) under the new permanent rate — and no longer has to worry about a promo ending. Against the original list price, the $609/month saved (49.1%) is now a durable discount, not a sale that could be clawed back at any time.

## Impact for Developers and Enterprises

### Who benefits most

Teams the 10/10 article told to treat the sale price as POC-only can now write Large 4 into their production cost model directly — the new permanent price is within 1.7% of the sale rate they were already budgeting against, so there's no need to re-run the numbers. With weights now open (Mistral Ecosystem Open-Weight license, a modified MIT license), enterprises with data-sovereignty requirements — the announcement cites European bank La Banque Postale as a case — also get a "test via API, self-host once committed" path instead of having to commit before the model was even open.

### Competitive landscape

Putting Large 4's old and new prices back into the same competitive table (USD per 1M tokens):

| Model | Input | Output | Note |
|---|---|---|---|
| Mistral Large 3 (predecessor) | $0.50 | $1.50 | Fully open, Apache 2.0 |
| DeepSeek V4 Pro (off-peak) | $0.66 | $1.98 | Off-peak discount rate |
| **Mistral Large 4 (new permanent price)** | **$0.70** | **$2.10** | Weights now open, no end date |
| DeepSeek V4 Pro (peak) | $1.32 | $3.96 | Peak-hours standard rate |
| GLM 5.3 (Mistral-hosted) | $1.40 | $4.40 | Chinese open model on the same platform |
| ~~Mistral Large 4 (pre-sale list price)~~ | ~~$1.36~~ | ~~$4.18~~ | Retired 10/29, no longer on the model card |

Large 4 jumped from the most expensive option in this price band to the second cheapest, trailing only its own predecessor, Large 3. Third-party pricing tracker [TokenCost](https://tokencost.app/blog/mistral-large-4-open-weights-price-cut) re-ran per-task cost using Artificial Analysis's Intelligence Index v5.0: Large 4 (medium reasoning) and GLM 5.3 (low) land on nearly the same score (23.1), but Large 4 costs 10% less. Push both to their top reasoning tiers and GLM 5.3 scores 5.7 points higher but costs $5.01 a task versus Large 4's high-mode $2.06. Step outside open-weight models, though, and the gap is still real: GPT-6.1 Terra scores 16 points higher for an eighth of the price, and Claude Haiku 5.5 beats it by 3.6 points at a lower cost. The price cut narrowed the gap with proprietary models — it didn't close it.

### Action items

- If you were piloting on the sale price back in October: no action needed. The new permanent price is only 1.7% above what you were already paying, and you can write that number straight into your budget
- If you're weighing whether to self-host an open-weight model: check TokenCost's per-task cost figures first ($2.06 at high reasoning vs. GLM 5.3's $5.01) — Large 4 is now the cheapest option at matching scores, but its output-token usage runs much higher than proprietary models like GPT-6.1 Terra, so your actual bill depends heavily on your task's average output length
- If raw per-token price is what you're optimizing for: [GPT-6.1 Terra ($1 input / $5 output)](https://aibusinessweekly.net/p/openai-api-pricing) and Claude Haiku 5.5 still lead on per-task cost; Large 4's edge is self-hostable weights and data residency, not the lowest sticker price

## Today's Takeaway

The 10/10 article treated the undated 50%-off sale as a red flag — developers were effectively absorbing the risk of "how long does this price hold" on the vendor's behalf. Three weeks later, the outcome ran the other way: instead of letting the sale quietly expire and doubling the bill, Mistral turned the sale price (with only a 2-3% bump) into the permanent list price, and announced it the same day it open-weighted the model. That points to a signal worth tracking that matters more than any single promo deadline: once a model's weights are about to go public and readers can work out the marginal cost of self-hosting themselves, the official API price has no choice but to track that line — otherwise the post-sale list price just pushes customers toward self-hosting or a competitor, and the vendor has no reason left to keep the business.

## References

- [Mistral: Mistral Large 4 open-weight release (official announcement, includes new permanent price)](https://mistral.ai/news/mistral-large-4-oss/)
- [Mistral docs: Mistral Large 4 model card](https://docs.mistral.ai/models/mistral-large-4-0)
- [TokenCost: Mistral Large 4 Price Cut, $0.70/$2.10, Open Weights (includes pre-sale list price, cost simulation)](https://tokencost.app/blog/mistral-large-4-open-weights-price-cut)
- [This site's earlier coverage, 10/10: Mistral Large 4 launches at 50% off, no end date](/posts/daily/2026-10-10-pricing-mistral-large-4-launch-sale-en)
- [AI Business Weekly: OpenAI API Pricing 2026 (current GPT-6.1 Terra/Sol/Luna rates)](https://aibusinessweekly.net/p/openai-api-pricing)
