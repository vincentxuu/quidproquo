---
title: "Pricing Watch: GPT-6.2 Astra Drops 20%, Lands Exactly on Claude Fable 5.2's Price"
date: 2026-11-20
category: daily
type: digest
tags: [ai-agent, pricing, daily, openai, anthropic]
lang: en
description: "OpenAI's GPT-6.2 Astra cuts input/output rates 20% and cached input 60%; the new $8/$40 price matches Claude Fable 5.2/Mythos 5.2, launched eight days earlier"
tldr: "GPT-6.2 Astra (released 2026-11-17) drops input from $10 to $8 (-20%), output from $50 to $40 (-20%), and cached input from $1.00 to $0.40 (-60%). GPT-6.2 Sol holds steady at $2/$10. The cut puts Astra at exactly the same price as Claude Fable 5.2/Mythos 5.2 ($8/$40), released nine days earlier — the first time the two labs' flagship models have landed on the same number."
series:
  name: "AI Pricing Watch"
  order: 38
---

> :globe: [中文版](/posts/daily/2026-11-20-pricing-openai-gpt-6-2-astra-sol-cut)

## What changed

OpenAI released GPT-6.2 Astra and GPT-6.2 Sol on November 17. Sol's price didn't move — it carries over GPT-6.1 Sol's $2/$10 — but the flagship Astra got cut across the board: input and output each fell 20%, and cached input fell further, down 60%. This isn't a time-boxed promotion; OpenAI's pricing page simply replaced the old GPT-6 Astra ($10/$50) with the new GPT-6.2 Astra ($8/$40), no expiry date attached. What actually matters is where that number lands: $8/$40 is exactly the price Anthropic set for Claude Fable 5.2 and Mythos 5.2 when it shipped them nine days earlier, on November 9. For the first time, the two companies' flagship models carry identical list prices — and it happened the same week Anthropic was heading into its IPO.

## Before and after

| Item | Old (GPT-6 Astra, priced since Sep 3) | New (GPT-6.2 Astra) | Change | Effective |
|---|---|---|---|---|
| Input | $10.00/1M tokens | $8.00/1M tokens | -20% | 2026-11-17 |
| Output | $50.00/1M tokens | $40.00/1M tokens | -20% | 2026-11-17 |
| Cached Input | $1.00/1M tokens | $0.40/1M tokens | -60% | 2026-11-17 |
| Batch Input | $5.00/1M tokens | $4.00/1M tokens | -20% | 2026-11-17 |
| Batch Output | $25.00/1M tokens | $20.00/1M tokens | -20% | 2026-11-17 |
| GPT-6.2 Sol Input (for reference) | $2.00/1M tokens (= GPT-6.1 Sol) | $2.00/1M tokens | unchanged | 2026-11-17 |

```diagram
title: GPT-6.2 Astra's price cut, new price as a share of old
desc: GPT-6.2 Astra's input and output both fall to 80% of the old GPT-6 Astra price, and cached input falls to 40%. GPT-6.2 Sol, released the same day, stays at 100% of its prior price — no change at all.
caption: Calculation: new price ÷ old price × 100. Astra input 8÷10×100=80, output 40÷50×100=80, cached input 0.4÷1.0×100=40; Sol input 2÷2×100=100 (unchanged). Baseline y=300 maps to 0, top y=60 maps to 100, k=2.4 units/px. Source: OpenAI's official pricing page (effective 2026-11-17).
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">New price as % of old (100 = unchanged)</text>
  <line class="dg-grid" x1="72" y1="180" x2="612" y2="180"/>
  <line class="dg-grid" x1="72" y1="60" x2="612" y2="60"/>
  <text class="dg-small" x="64" y="60" text-anchor="end" dominant-baseline="central">100</text>
  <text class="dg-small" x="64" y="180" text-anchor="end" dominant-baseline="central">50</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>

  <g class="dg-c-muted">
    <rect class="dg-bar dg-bar--soft" x="110" y="108" width="64" height="192"/>
    <rect class="dg-bar dg-bar--soft" x="230" y="108" width="64" height="192"/>
    <rect class="dg-bar dg-bar--soft" x="470" y="60" width="64" height="240"/>
  </g>
  <rect class="dg-bar dg-c-accent" x="350" y="204" width="64" height="96"/>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <text class="dg-sub" x="142" y="98" text-anchor="middle" dominant-baseline="central">80</text>
  <text class="dg-sub" x="262" y="98" text-anchor="middle" dominant-baseline="central">80</text>
  <text class="dg-label dg-text--accent" x="382" y="194" text-anchor="middle" dominant-baseline="central">40</text>
  <text class="dg-sub" x="502" y="50" text-anchor="middle" dominant-baseline="central">100</text>

  <text class="dg-sub" x="142" y="320" text-anchor="middle" dominant-baseline="central">Astra Input</text>
  <text class="dg-sub" x="262" y="320" text-anchor="middle" dominant-baseline="central">Astra Output</text>
  <text class="dg-label dg-text--accent" x="382" y="320" text-anchor="middle" dominant-baseline="central">Astra Cache</text>
  <text class="dg-sub" x="502" y="320" text-anchor="middle" dominant-baseline="central">Sol Input</text>
</svg>
```

## Cost math

**Scenario**: a legal-document review agent running 500 high-complexity analysis tasks per day (averaging 5,000 input + 2,000 output tokens each, over 30 days)

| | Old price (GPT-6 Astra) | New price (GPT-6.2 Astra) | Monthly savings |
|---|---|---|---|
| Input cost/month | $750 | $600 | $150 |
| Output cost/month | $1,500 | $1,200 | $300 |
| **Total** | **$2,250/month** | **$1,800/month** | **$450 (-20%)** |

This doesn't account for caching at all. If a workload has large repeated system prompts or long documents — common in RAG setups — the 60% cut on cached input pushes real savings well above 20%. The $450 figure is the conservative, no-cache floor.

## Impact on developers and teams

### Who benefits most

Teams already running long-form writing, complex reasoning, or hard coding tasks on GPT-6 Astra get a straight 20% cut on upgrade — no prompt changes, no re-testing required. Teams that lean heavily on caching (fixed system prompts, repeated long-document Q&A) benefit even more, since the cached-input cut is three times deeper than the standard-input cut.

### Competitive landscape

Flagship model pricing after the cut (input / output, USD per 1M tokens):

| Model | Input | Output | Note |
|---|---|---|---|
| GPT-6.2 Sol | $2.00 | $10.00 | Same as GPT-6.1 Sol — this cut didn't touch it |
| Claude Sonnet 5.5 | $2.00 | $10.00 | — |
| Claude Opus 5.5 | $4.00 | $20.00 | — |
| **GPT-6.2 Astra (new)** | **$8.00** | **$40.00** | -20%, now priced identically to Claude Fable 5.2/Mythos 5.2 |
| Claude Fable 5.2 / Mythos 5.2 | $8.00 | $40.00 | Priced at launch on 2026-11-09, eight days before Anthropic's IPO |
| GPT-6 Astra (old) | $10.00 | $50.00 | Launch price from 2026-09-03; no longer the live rate as of Nov 17 |

OpenAI's cut moves Astra's list price directly into the slot Anthropic's flagship already occupied. For developers, that means choosing between Astra and Fable 5.2/Mythos 5.2 is no longer a price question — both cost the same. What's left is cache mechanics (Anthropic charges $10 for a 5-minute cache write and $16 for an hour; OpenAI charges $10 for 30 minutes and $20 for 12 hours, so which one wins depends on your conversation pattern) and actual output quality on your task.

### Recommendations

- If you're on GPT-6 Astra: upgrade to GPT-6.2 Astra for a straight 20% cut at equal capability, with no migration cost. If cached input is a large share of your usage, the real savings will be higher.
- If you're choosing between Claude Fable 5.2/Mythos 5.2 and GPT-6.2 Astra: price is no longer a deciding factor at $8/$40 on both sides. Run your own eval on output quality and latency, and check whether your conversation pattern fits OpenAI's or Anthropic's cache-write window better.
- If you only need mid-tier capacity: GPT-6.2 Sol stayed at $2/$10 this round. This cut doesn't apply to you — don't jump to a flagship tier four times the price just because "Astra got cheaper."

## Takeaway

OpenAI didn't play the "cheaper than the competition" card this time — it moved its own flagship price to match Anthropic's exactly. Tracking flagship pricing over the past six months shows a pattern: GPT-6 Astra launched more expensive than Claude's flagship, and now, after this cut, the two list prices sit on top of each other at $8/$40. Once two labs' top-tier models collide on the same number, the price itself stops carrying decision-relevant information — what's left to compare are the details you have to test yourself: caching rules, latency, long-context behavior. It's a reminder that every time a "price cut" headline appears, it's worth checking not just the percentage, but also whose price the new number just landed on.

## References

- [OpenAI: API Pricing (official pricing page, current GPT-6.2 Astra/Sol rates)](https://developers.openai.com/api/docs/pricing)
- [OpenAI GPT-6.2 Astra cuts API prices 20%, adds Sol model (betanews)](https://betanews.com/article/gpt-6-2-astra-api-pricing)
- [OpenAI Launches GPT-6.2 Astra and Sol with 20% Price Cut (Gate News)](https://gate.com/news/detail/openai-launches-gpt-62-astra-and-sol-with-20-price-cut-25725610)
- [GPT-6.2 Astra vs Claude Fable 5.2: $8 Price Parity (shattered.io)](https://shattered.io/gpt-6-2-astra-sol-anthropic-real-winner-8-dollar-price-parity)
