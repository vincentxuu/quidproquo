---
title: "Pricing Watch | Claude Opus 4.5 Retires Jan 22 — Opus 5.5 Is 20% Cheaper on Paper, Maybe Not in Practice"
date: 2026-11-28
category: daily
type: digest
lang: en
tags: [ai-agent, pricing, daily, anthropic]
description: "Anthropic retires Claude Opus 4.5 (claude-opus-4-5-20251101) on 2027-01-22 and points developers to Claude Opus 5.5, priced 20% lower with cache reads down 60% — but a new tokenizer can push uncached workloads past the break-even point and into a higher bill."
tldr: "Claude Opus 4.5 stops responding on the Claude API, AWS, and Microsoft Foundry on 2027-01-22, with no grace period. The recommended replacement, Claude Opus 5.5, cuts list price 20% (input $5→$4, output $25→$20 per 1M tokens) and cache reads 60% ($0.50→$0.20). But Opus 5.5's new tokenizer produces up to 35% more tokens for the same text, and that range straddles the exact break-even point this 20% cut implies — so uncached workloads can end up paying more, not less."
series:
  name: "AI Pricing Watch"
  order: 42
---

> :globe: [中文版](/posts/daily/2026-11-28-pricing-anthropic-claude-opus-4-5-retirement)

## What Changed

Anthropic announced it on 2026-11-23, effective 2027-01-22: Claude Opus 4.5 (`claude-opus-4-5-20251101`, plus its alias `claude-opus-4-5`) retires from the Claude API, Claude Platform on AWS, Microsoft Foundry, and Claude Models on Google Cloud (Anthropic managed), with requests failing outright after that date. The named replacement, Claude Opus 5.5, cuts list price 20% across input, output, cache writes, and batch, with cache reads down 60% — on the surface, the cleanest "retirement that pays for itself" Anthropic has announced in months. But Anthropic's own migration guide states Opus 5.5's new tokenizer generates 1x to 1.35x as many tokens for the same text, and the math behind a 20% price cut puts the break-even point exactly at 1.25x — meaning the official range for how much more text turns into tokens straddles the line between a real discount and a disguised price hike, and nobody finds out which side they landed on until the invoice arrives.

## Price Comparison

| Item | Old (Opus 4.5) | New (Opus 5.5) | Change | Retirement date |
|---|---|---|---|---|
| Input | $5.00/1M tokens | $4.00/1M tokens | ↓20% | 2027-01-22 |
| Output | $25.00/1M tokens | $20.00/1M tokens | ↓20% | 2027-01-22 |
| 5-minute cache write | $6.25/1M tokens | $5.00/1M tokens | ↓20% | 2027-01-22 |
| 1-hour cache write | $10.00/1M tokens | $8.00/1M tokens | ↓20% | 2027-01-22 |
| Cache read (hit) | $0.50/1M tokens | $0.20/1M tokens | ↓60% | 2027-01-22 |
| Batch input | $2.50/1M tokens | $2.00/1M tokens | ↓20% | 2027-01-22 |
| Batch output | $12.50/1M tokens | $10.00/1M tokens | ↓20% | 2027-01-22 |

## Cost Math

**Scenario**: An agent handling 10,000 complex reasoning calls a day (1,500 input + 500 output tokens each, no caching), still running on `claude-opus-4-5-20251101`. That's roughly 450M input tokens and 150M output tokens a month. Anthropic's migration guide gives a tokenizer range of 1x to 1.35x, so the table below plots three points along it:

| | Old price (Opus 4.5) | Opus 5.5, flat tokens (1.0x) | Opus 5.5, +20% tokens (1.2x) | Opus 5.5, +35% tokens (1.35x, official ceiling) |
|---|---|---|---|---|
| Input cost/month | $2,250 | $1,800 | $2,160 | $2,430 |
| Output cost/month | $3,750 | $3,000 | $3,600 | $4,050 |
| **Total** | **$6,000/month** | **$4,800 (↓20%)** | **$5,760 (↓4%)** | **$6,480 (↑8%)** |

```diagram
title: Opus 5.5 migration cost vs. tokenizer inflation
desc: Opus 5.5's monthly bill rises with the tokenizer inflation factor and crosses the pre-retirement Opus 4.5 bill at 1.25x, going higher than the old price beyond that point.
caption: Baseline: 10,000 calls/day, 1,500 input + 500 output tokens each, 450M input / 150M output tokens a month (no caching). Opus 5.5 monthly cost = 4,800 x tokenizer inflation factor; Opus 4.5's $6,000 monthly cost is fixed and unaffected by the new tokenizer, so the two lines meet at an inflation factor of 1.25x.
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">USD/month</text>
  <line class="dg-grid" x1="72" y1="163" x2="508" y2="163"/>
  <line class="dg-grid" x1="72" y1="231" x2="508" y2="231"/>
  <line class="dg-grid" x1="380" y1="58" x2="380" y2="300"/>
  <text class="dg-small" x="64" y="163" text-anchor="end" dominant-baseline="central">4,000</text>
  <text class="dg-small" x="64" y="231" text-anchor="end" dominant-baseline="central">2,000</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>
  <text class="dg-tag" x="380" y="48" text-anchor="middle" dominant-baseline="central">1.25x breaks even</text>
  <line class="dg-axis" x1="72" y1="300" x2="508" y2="300"/>

  <g class="dg-c-muted">
    <polyline class="dg-plot-line dg-plot-line--thin" points="80,94 500,94"/>
    <text class="dg-sub dg-text--series" x="512" y="104" dominant-baseline="central">Opus 4.5</text>
    <text class="dg-sub dg-text--series" x="512" y="124" dominant-baseline="central">$6,000</text>
  </g>
  <g class="dg-c-accent">
    <polyline class="dg-plot-line" points="80,135 140,127 200,119 260,111 320,103 380,94 440,86 500,78"/>
    <circle class="dg-point" cx="80" cy="135" r="4"/>
    <circle class="dg-point" cx="140" cy="127" r="4"/>
    <circle class="dg-point" cx="200" cy="119" r="4"/>
    <circle class="dg-point" cx="260" cy="111" r="4"/>
    <circle class="dg-point" cx="320" cy="103" r="4"/>
    <circle class="dg-point" cx="380" cy="94" r="4"/>
    <circle class="dg-point dg-point--hollow" cx="380" cy="94" r="7"/>
    <circle class="dg-point" cx="440" cy="86" r="4"/>
    <circle class="dg-point" cx="500" cy="78" r="4"/>
    <text class="dg-label dg-text--series" x="512" y="60" dominant-baseline="central">Opus 5.5</text>
    <text class="dg-sub dg-text--series" x="512" y="80" dominant-baseline="central">$6,480</text>
  </g>

  <text class="dg-small" x="80" y="320" text-anchor="middle" dominant-baseline="central">1.00x</text>
  <text class="dg-small" x="200" y="320" text-anchor="middle" dominant-baseline="central">1.10x</text>
  <text class="dg-small" x="320" y="320" text-anchor="middle" dominant-baseline="central">1.20x</text>
  <text class="dg-small" x="440" y="320" text-anchor="middle" dominant-baseline="central">1.30x</text>
  <text class="dg-small" x="500" y="320" text-anchor="middle" dominant-baseline="central">1.35x</text>
</svg>
```

The break-even point works out to exactly 1.25x tokenizer inflation: below that, the migration genuinely saves money; above it, the bill is higher than before retirement. The official ceiling of 1.35x already sits on the losing side, and this estimate excludes caching entirely — cache-heavy workloads look considerably better than this table, since cache reads are down 60%.

## Impact on Developers and Businesses

### Who benefits most

Workloads that repeatedly send long system prompts, tool definitions, or document context benefit the most clearly: the 60% cut to cache-read pricing is the single largest discount in this change, and it doesn't get eaten by the new tokenizer — Anthropic's stated inflation range only applies to uncached input and output tokens. Single-turn, uncached, long-output reasoning tasks carry the most risk — they're the closest match to the scenario above, and once tokenizer inflation passes 1.25x, the bill ends up higher than before retirement.

### Competitive landscape

Current standing-tier pricing across the major models (input/output, USD per 1M tokens, standard short-context rate):

| Model | Input | Output | Note |
|---|---|---|---|
| Claude Haiku 5.5 (≤100K) | $0.10 | $0.50 | Anthropic's cheapest active model |
| Claude Sonnet 5.5 | $2.00 | $10.00 | — |
| GPT-6.2 Sol | $2.00 | $10.00 | Matches Sonnet 5.5 exactly |
| Gemini 4 Carbon/Argon (promo price through Nov 30) | $2.00 | $10.00 | Doubles to $4/$20 starting Dec 1 (see [Nov 15 Pricing Watch](/posts/daily/2026-11-15-pricing-multi-vendor-pricing-changes-en)) |
| **Claude Opus 5.5 (recommended replacement)** | **$4.00** | **$20.00** | Matches Gemini 4 Carbon/Argon's post-Dec-1 price |
| Claude Opus 4.5 (retiring) | $5.00 | $25.00 | API calls fail outright starting 2027-01-22 |
| GPT-6.2 Astra | $8.00 | $40.00 | The most expensive major model right now |

Opus 5.5's $4/$20 landing spot lines up exactly with where Gemini 4 Carbon and Argon land once Google's price doubling takes effect on Dec 1 — Anthropic's repricing effectively stakes out the price tier Google is about to vacate, so both companies' flagship-tier models converge on the same number in December.

### What to do

- Still calling `claude-opus-4-5-20251101` or the `claude-opus-4-5` alias? You have until 2027-01-22 — about two months longer than the Sonnet 4.5 deadline (2026-11-30) — but requests fail outright with no grace period after that.
- Measure your actual prompts with Anthropic's token-counting endpoint first, to see which side of the 1.25x break-even point your workload lands on. Don't assume the headline 20% cut applies to your bill.
- Swapping the model ID alone isn't enough: assistant prefills return a 400 error on Opus 5.5, and manually setting `thinking`'s `budget_tokens` also returns a 400 error — switch to adaptive thinking with an `output_config` effort setting instead, and plan to drop `temperature`/`top_p`/`top_k` entirely.
- Prioritize migrating cache-heavy workloads (long system prompts, fixed tool definitions, repeated document context) first — these are close to guaranteed savings, since the 60% cache-read discount isn't affected by the new tokenizer.
- On Amazon Bedrock or Google Cloud (Google managed): the 2027-01-22 deadline only covers Anthropic's own platforms (Claude API, Claude Platform on AWS, Microsoft Foundry, Google Cloud Anthropic-managed). Bedrock and Google-managed Vertex AI haven't published their own Opus 4.5 retirement dates yet — don't assume they'll line up.

## Time-Sensitive Notice

:warning: **Retirement date**: 2027-01-22. `claude-opus-4-5-20251101` (and its alias `claude-opus-4-5`) stops responding on the Claude API, Claude Platform on AWS, Microsoft Foundry, and Claude Models on Google Cloud (Anthropic managed), with no grace period. Amazon Bedrock and Google Cloud (Google managed) run their own schedules, not yet published — check their model tables separately. Migration guide: [Claude Opus 5.5 Migration Guide](https://platform.claude.com/docs/en/models/opus-5-5/migration-guide).

## Takeaway

This is the third time this series has run into a list-price cut partly eaten by a new tokenizer — after [Sonnet 5.5's flat pricing at launch](/posts/daily/2026-09-30-pricing-anthropic-claude-sonnet-5-5-flat-pricing-en) and [Sonnet 4.5's 33% retirement discount](/posts/daily/2026-10-23-pricing-anthropic-claude-sonnet-4-5-retirement-en) — but it's the first time the pattern reduces to one exact line: a 20% price cut implies a break-even tokenizer inflation of 1.25x, and Anthropic's own published range (1x–1.35x) straddles that line on both sides. Which means this single announcement is simultaneously a genuine price cut and a disguised price hike, and which one applies to you depends on a number neither you nor Anthropic states as a single figure. An announcement whose honest answer is a range — and a range that happens to contain its own break-even point — might be what pricing notices for model generations look like from here on.

## References

- [Claude Platform Docs: Model deprecations](https://platform.claude.com/docs/en/about-claude/model-deprecations)
- [Claude Platform Docs: Model pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- [Data Studios: Claude Opus 4.5 retires January 22, 2027 — Opus 5.5 API prices and migration](https://www.datastudios.org/post/claude-opus-4-5-retires-january-22-2027-opus-5-5-migration-api-costs)
