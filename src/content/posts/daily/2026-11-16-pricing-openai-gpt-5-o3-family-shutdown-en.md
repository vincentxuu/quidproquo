---
title: "Pricing Watch｜OpenAI Retires GPT-5／o3 on Dec 11: Flagship and Pro Drop 85%+, Mini／Nano Jump 100%-300%"
date: 2026-11-16
category: daily
type: digest
tags: [ai-agent, pricing, daily, openai]
lang: en
description: "OpenAI's deprecations page lists gpt-5, gpt-5-mini, gpt-5-nano, gpt-5-pro, o3, and o3-pro as shutting down on 2026-12-11, each pointed at a GPT-6.1/GPT-6 replacement. The flagship and pro tiers get steep rate cuts, but the mini/nano replacements cost more."
tldr: "OpenAI is shutting down gpt-5, gpt-5-mini, gpt-5-nano, gpt-5-pro, o3, and o3-pro on 2026-12-11, routing them to the GPT-6.1/GPT-6 lineup. Official rates show gpt-5→gpt-6.1-sol and gpt-5-pro/o3-pro→gpt-6.1-sol (pro mode) cutting 60%-92%, but gpt-5-mini→gpt-6.1-terra raises input 300% and output 150% — this migration is a price hike at the mini tier."
series:
  name: "AI Pricing Watch"
  order: 37
---

> :globe: [中文版](/posts/daily/2026-11-16-pricing-openai-gpt-5-o3-family-shutdown)

## What changed

OpenAI's deprecations page has turned the notice it sent on June 11, 2026 into a firm shutdown date: December 11, 2026. `gpt-5`, `gpt-5-mini`, `gpt-5-nano`, `gpt-5-pro`, `o3`, and `o3-pro` are all going dark, right at the six-month minimum notice period for generally available models. This isn't one model retiring — it's the entire GPT-5 and o3 lineup closing out at once. OpenAI names a specific successor for each: `gpt-5`/`o3` moves to `gpt-6.1-sol`, `gpt-5-mini` moves to `gpt-6.1-terra`, `gpt-5-nano` moves to `gpt-6-luna`, and `gpt-5-pro`/`o3-pro` moves to `gpt-6.1-sol` with the Responses API's `reasoning.mode: pro` flag instead of a standalone pro model. Lining up the six old-to-new rate pairs reveals something uneven: the flagship tier (`gpt-5`→`gpt-6.1-sol`) and the pro tier (`gpt-5-pro`/`o3-pro`→the same `gpt-6.1-sol`) get steep rate cuts, while the mini tier (`gpt-5-mini`→`gpt-6.1-terra`) gets a steep rate increase — the same announcement is good news and bad news depending on which budget tier you're running on.

## Before and after

| Item | Before (until 2026-12-11) | After (recommended replacement) | Change | Effective |
|---|---|---|---|---|
| gpt-5 Input | $1.25/1M tokens | gpt-6.1-sol: $2.00/1M tokens | ↑60% | 2026-12-11 |
| gpt-5 Output | $10.00/1M tokens | gpt-6.1-sol: $10.00/1M tokens | flat | 2026-12-11 |
| gpt-5-mini Input | $0.25/1M tokens | gpt-6.1-terra: $1.00/1M tokens | ↑300% | 2026-12-11 |
| gpt-5-mini Output | $2.00/1M tokens | gpt-6.1-terra: $5.00/1M tokens | ↑150% | 2026-12-11 |
| gpt-5-nano Input | $0.05/1M tokens | gpt-6-luna: $0.10/1M tokens | ↑100% | 2026-12-11 |
| gpt-5-nano Output | $0.40/1M tokens | gpt-6-luna: $0.50/1M tokens | ↑25% | 2026-12-11 |
| gpt-5-pro Input | $15.00/1M tokens | gpt-6.1-sol (`reasoning.mode: pro`): $2.00/1M tokens | ↓87% | 2026-12-11 |
| gpt-5-pro Output | $120.00/1M tokens | gpt-6.1-sol (`reasoning.mode: pro`): $10.00/1M tokens | ↓92% | 2026-12-11 |
| o3 Input | $2.00/1M tokens | gpt-6.1-sol: $2.00/1M tokens | flat | 2026-12-11 |
| o3 Output | $8.00/1M tokens | gpt-6.1-sol: $10.00/1M tokens | ↑25% | 2026-12-11 |
| o3-pro Input | $20.00/1M tokens | gpt-6.1-sol (`reasoning.mode: pro`): $2.00/1M tokens | ↓90% | 2026-12-11 |
| o3-pro Output | $80.00/1M tokens | gpt-6.1-sol (`reasoning.mode: pro`): $10.00/1M tokens | ↓87.5% | 2026-12-11 |

The pro-tier cuts are a rate comparison, not a billing guarantee. `reasoning.mode: pro` turns what used to be a separately priced Pro model into extra thinking tokens on the same model. If your migrated workload needs a longer reasoning chain, it may burn through more tokens than before, so comparing per-token rates alone understates the real cost — test against your own tasks before counting on the full discount.

## Cost estimate

**Scenario**: a team running `gpt-5-mini` for high-volume text classification and extraction, 50,000 requests a day (averaging 800 input tokens + 200 output tokens each), over a 30-day month.

| | gpt-5-mini (current) | gpt-6.1-terra (replacement from Dec 11) | Monthly change |
|---|---|---|---|
| Input cost/month (1,200M tokens) | $300.00 | $1,200.00 | +$900.00 (↑300%) |
| Output cost/month (300M tokens) | $600.00 | $1,500.00 | +$900.00 (↑150%) |
| **Total** | **$900.00** | **$2,700.00** | **+$1,800.00 (↑200%)** |

This scale of classification/extraction work is exactly what the mini tier is usually used for, and the monthly bill triples. By contrast, if the same team also runs `gpt-5-pro` for a smaller volume of long-reasoning tasks (say, 500 requests a day, averaging 3,000 input + 2,000 output tokens), moving to `gpt-6.1-sol` (pro mode) at list price drops the monthly cost from $367.50 to $90.00, a 75% cut. One company, one announcement, two completely opposite outcomes depending on usage pattern.

## Impact on developers and enterprises

### Who benefits most

Teams running `gpt-5-pro` or `o3-pro` for deep reasoning and long-form report generation benefit the most — list prices drop more than 85%, and OpenAI has turned "Pro" from a gated, separately licensed model into a request parameter anyone can set. On the flip side, teams running `gpt-5-mini` for high-frequency, low-cost tasks (classification, routing, summarization/extraction) are the only losers in this announcement, and that happens to be the mini tier's single biggest use case.

### Competitive impact

The "budget tier" ranking after December 11 (input / output, USD per 1M tokens):

| Model | Input | Output | Note |
|---|---|---|---|
| GPT-6 Luna / Claude Haiku 5.5 (from) | $0.10 | $0.50 | gpt-5-nano's replacement, matches Haiku 5.5's floor tier |
| Gemini 3.5 Flash-Lite | $0.30 | $2.50 | not affected by this announcement |
| **GPT-6.1 Terra (from Dec 11)** | **$1.00** | **$5.00** | gpt-5-mini's replacement, now priced well outside "mini/nano" territory |
| GPT-6.1 Sol / Claude Sonnet 5.5 | $2.00 | $10.00 | gpt-5/o3's replacement, matches Sonnet 5.5 |

After the increase, `gpt-6.1-terra` ($1.00/$5.00) costs more than three times `gemini-3.5-flash-lite` ($0.30/$2.50). Teams that picked `gpt-5-mini` for its spot between nano-tier pricing and mid-tier quality now face a rate that's only half of the mid-tier model — the price-to-capability position that made the mini tier attractive is gone.

### Recommendations

- If you're running `gpt-5-mini` for high-volume, low-unit-cost tasks: benchmark both `gpt-6-luna` (the nano replacement, which only rises slightly) and `gemini-3.5-flash-lite` against your own data before defaulting to OpenAI's named replacement, `gpt-6.1-terra` — "recommended replacement" tracks capability, not price.
- If you're running `gpt-5-pro` or `o3-pro`: test `reasoning.mode: pro` on a small slice of traffic before December 11 to measure actual thinking-token usage on your workload; don't assume an 85% bill reduction just because the list price dropped that much.
- If you're running plain `gpt-5` or `o3`: moving to `gpt-6.1-sol` is roughly neutral-to-slightly-worse (input costs more, output is about flat), so weigh the migration effort, or consider `gpt-6.1-terra` as a downgrade option for part of your traffic — even after its price hike, it's still half the price of Sol.

## Time-sensitive note

:warning: **Shutdown date**: December 11, 2026. `gpt-5`, `gpt-5-mini`, `gpt-5-nano`, `gpt-5-pro`, `o3`, `o3-pro`, and every snapshot and fine-tune built on them will stop accepting requests. Migration guide: [GPT-6 migration guide](https://developers.openai.com/api/docs/guides/latest-model#gpt-6-astra-migration-quickstart).

## Today's takeaway

An "officially recommended replacement model" often gets read as an implicit promise that the price will be similar too — this announcement breaks that assumption. In the same table, the flagship and pro tiers drop 60%-92% while the mini tier rises 150%-300%, with no flag distinguishing which rows go up and which go down. When you're tracking pricing changes, a named replacement only tells you the vendor considers the two models comparable in capability — not in rate, especially at the low end, where it's easier for a vendor to retire an ultra-cheap old model and swap in a nominally equivalent but meaningfully pricier one. That kind of increase is easier to miss than a flagship-tier hike, because the total bill still looks like it belongs to "the cheap tier."

## References

- [OpenAI: Deprecations (official page — shutdown date and recommended replacements for gpt-5/gpt-5-mini/gpt-5-nano/gpt-5-pro/o3/o3-pro)](https://developers.openai.com/api/docs/deprecations)
- [OpenAI: API Pricing (official pricing page — current gpt-6.1-sol/gpt-6.1-terra/gpt-6-luna rates alongside legacy gpt-5/o3 rates)](https://developers.openai.com/api/docs/pricing)
- [Anthropic: Models overview (official model overview — current Claude Haiku 5.5/Sonnet 5.5 rates, for the competitive table)](https://platform.claude.com/docs/en/models/overview)
- [This series, Nov 4: Gemini 2.5 Pro/Flash gets a Developer API sunset date](/posts/daily/2026-11-04-pricing-google-gemini-2-5-pro-flash-developer-api-sunset-en)
- [tokencost.app: LLM API Price Changes, November 2026: The Dec 1 Cliff (2026-11-14, independent coverage of the same OpenAI December shutdown schedule)](https://tokencost.app/blog/llm-api-price-changes-november-2026)
