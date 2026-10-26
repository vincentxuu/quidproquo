---
title: "Model Card: GPT-6.1 Terra"
date: 2026-10-26
category: daily
type: digest
tags: [ai-agent, model-release, daily, openai, model-family-gpt]
lang: en
description: "OpenAI launched GPT-6.1 Terra — a cost-efficient tier built for computer use and visual reasoning, with standard pricing cut in half and Terminal-Bench 4.0 scores more than doubled"
tldr: "GPT-6.1 Terra (`gpt-6.1-terra`): launched 2026-10-26, 1,050,000-token context window; priced at $1.00 input / $5.00 output / $0.05 cached input per 1M tokens (half the standard rate of both GPT-5.6 Terra and GPT-6.1 Sol); Terminal-Bench 4.0 at max effort hits 50.3%, more than double the predecessor's 21.5%; Agents' Last Exam at medium effort scores 15 points above the predecessor at about 1/3 the cost, matching GPT-6 Astra at 1/10 the price; at max effort it's 3x more token-efficient than Claude Opus 5.5 at about 1/9 the cost per task; internal factual-error rate at low effort falls from the predecessor's 53.6% to 16.7%"
series:
  name: "AI Model Tracker"
  order: 59
glossary:
  - term: "GPT"
    def: "OpenAI's large language model family; Terra is the mid tier built for computer use and visual reasoning, emphasizing cost-efficiency"
---

> 🌏 [中文版](/posts/daily/2026-10-26-model-openai-gpt-6-1-terra)

## Model Details

| Field | Value |
|---|---|
| Model ID | `gpt-6.1-terra` |
| Vendor | OpenAI |
| Parameters | Undisclosed |
| Context Window | 1,050,000 tokens |
| Input pricing (USD/1M tokens) | $1.00 (cached $0.05) |
| Output pricing (USD/1M tokens) | $5.00 |
| Open source | No |
| Release date | 2026-10-26 |
| Official announcement | [OpenAI: Introducing GPT-6.1 Terra](https://openai.com/index/introducing-gpt-6-1-terra/) |
| Family | GPT-6.1 (sibling GPT-6.1 Sol released 2026-09-29, $2 input/$10 output; flagship GPT-6 Astra at $10/$50; predecessor GPT-5.6 Terra at $2/$12) |

## Highlights

- On Agents' Last Exam (a hands-on computer-use benchmark) at medium effort, it scores 15 points above predecessor GPT-5.6 Terra at about 1/3 the cost, matching flagship GPT-6 Astra's score while costing just 1/10 as much per token
- At max effort, it's over 3x more token-efficient than Claude Opus 5.5 and costs 1/4 as much per token, pushing per-task cost down to roughly 1/9 of Opus 5.5's; it also completes tasks over 3x faster than GPT-6 Astra and GPT-6.1 Sol
- On Terminal-Bench 4.0 (command-line coding agent tasks) at max effort, it reaches 50.3%, more than double the predecessor's published 21.5%
- Internal factual-error rate at low effort drops from the predecessor's 53.6% to 16.7% (about a 37-point drop); at max effort it falls to 4.3%, now close to flagship GPT-6 Astra and GPT-6.1 Sol

## Benchmark Results

| Benchmark | Score | Predecessor (GPT-5.6 Terra) | Best competitor |
|---|---|---|---|
| Agents' Last Exam (medium effort) | +15pp over predecessor, at ~1/3 the cost | Baseline (absolute score not disclosed) | Matches GPT-6 Astra at 1/10 the cost |
| Terminal-Bench 4.0 (max effort) | 50.3% | 21.5% | No other model's score disclosed in this announcement |
| Internal factual-error rate (low effort, lower is better) | 16.7% | 53.6% | Competitor scores at this setting not disclosed |
| Internal factual-error rate (max effort, lower is better) | 4.3% | 22.3% (back-calculated from OpenAI's stated "18-point drop") | Close to GPT-6 Astra and GPT-6.1 Sol |
| Terminal-Bench-Science 0.1 (max effort) | Beats GPT-6.1 Sol at lower cost; within 5 points of Claude Opus 5.5 | Not provided in this announcement | Trails Claude Opus 5.5 by ~5 points, at under 1/5 the cost |

⚠️ All figures are OpenAI's own benchmarking under vendor-chosen reasoning-effort settings, pending independent reproduction. Most rows are the relative gaps OpenAI published rather than both models' absolute scores — exact numbers for GPT-5.6 Terra and competitors weren't fully disclosed in this announcement.

```diagram
title: GPT-6.1 Terra internal factual-error rate: predecessor vs. current
desc: GPT-6.1 Terra's factual-error rate drops sharply from predecessor GPT-5.6 Terra at both low effort and max effort reasoning settings.
caption: Source: OpenAI's own benchmark figures from its 2026-10-26 announcement. The max-effort predecessor baseline is back-calculated from the disclosed drop: 4.3% + 18 points = 22.3%. Coordinate conversion: baseline y=300, 4 units per percentage point (y = 300 − value × 4), axis starts at 0, domain 0–60.
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">Error rate (%)</text>
  <line class="dg-grid" x1="72" y1="140" x2="612" y2="140"/>
  <line class="dg-grid" x1="72" y1="220" x2="612" y2="220"/>
  <text class="dg-small" x="64" y="140" text-anchor="end" dominant-baseline="central">40</text>
  <text class="dg-small" x="64" y="220" text-anchor="end" dominant-baseline="central">20</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">0</text>

  <text class="dg-text--series" x="172" y="52" text-anchor="middle" dominant-baseline="central">GPT-5.6 Terra</text>
  <text class="dg-text--series dg-text--accent" x="244" y="52" text-anchor="middle" dominant-baseline="central">GPT-6.1 Terra</text>

  <rect class="dg-bar dg-c-s1" x="140" y="86" width="64" height="214"/>
  <rect class="dg-bar dg-c-accent" x="212" y="233" width="64" height="67"/>
  <rect class="dg-bar dg-c-s1" x="364" y="211" width="64" height="89"/>
  <rect class="dg-bar dg-c-accent" x="436" y="283" width="64" height="17"/>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <text class="dg-sub" x="172" y="76" text-anchor="middle" dominant-baseline="central">53.6%</text>
  <text class="dg-label dg-text--accent" x="244" y="223" text-anchor="middle" dominant-baseline="central">16.7%</text>
  <text class="dg-sub" x="396" y="201" text-anchor="middle" dominant-baseline="central">22.3%</text>
  <text class="dg-label dg-text--accent" x="468" y="273" text-anchor="middle" dominant-baseline="central">4.3%</text>

  <text class="dg-sub" x="208" y="320" text-anchor="middle" dominant-baseline="central">low effort</text>
  <text class="dg-sub" x="432" y="320" text-anchor="middle" dominant-baseline="central">max effort</text>
</svg>
```

## Versus the Predecessor and Competitors

Compared with GPT-5.6 Terra, standard pricing is cut in half outright: input drops from $2.00 to $1.00, output from $12.00 to $5.00 — a pricing strategy, not just a score bump. Scores didn't suffer for it: Terminal-Bench 4.0 more than doubled from 21.5% to 50.3%, and the low-effort factual-error rate dropped by roughly two-thirds. This generation of Terra gets both cheaper and stronger at the same time, rather than trading one for the other.

Against flagship GPT-6 Astra, Terra already matches Astra's score on Agents' Last Exam at just 1/10 the per-token price, and nearly matches both Astra and GPT-6.1 Sol on MMMU-Pro visual reasoning. That pushes OpenAI's own product line downward in price: computer-use precision that used to require the flagship tier is now within reach of a mid-priced model.

Against Claude Opus 5.5, Terra is 3x more token-efficient at max effort and costs 1/4 as much per token — multiplying out to roughly a 9x gap in per-task cost. But on Terminal-Bench-Science 0.1, the benchmark that leans hardest on scientific reasoning, Terra still trails Opus 5.5 by about 5 points. OpenAI itself isn't claiming this generation of Terra sets a new ceiling; the pitch is "good enough score, dramatically lower cost."

## Implications for Agent Development

This release centers on two capabilities — computer use and visual reasoning — aimed at agent scenarios that run high volumes of repetitive work without needing top-tier reasoning on any single task.

- If you're building agents that read screens, operate desktop apps, fill out forms, or edit video: Terra already beats the predecessor's best score on OSWorld 2.1 (multi-step desktop tasks) at medium effort, at lower cost — currently the best price-performance option for this kind of workload
- If you're running high-volume, budget-constrained pipelines (e.g., reading invoices and entering them into accounting software): standard pricing halved to $1 input / $5 output, plus $0.05 cached input, meaningfully lowers the cost of repetitive batch work
- If you're building coding agents: the more-than-doubled Terminal-Bench 4.0 score is worth re-evaluating against mid-complexity tasks currently routed to Sol or Astra — though OpenAI explicitly says the most complex coding tasks still call for GPT-6.1 Sol or GPT-6 Astra
- Not a fit: workloads that need top-tier scientific reasoning — Terra still trails Claude Opus 5.5 by about 5 points on Terminal-Bench-Science 0.1, a gap this release didn't close

## Today's Takeaway

This release doesn't challenge any score ceiling, yet it halves standard pricing and cuts the factual-error rate by more than two-thirds — suggesting OpenAI's current priority for its mid-priced tier isn't chasing a new record, but delivering flagship-grade computer-use capability at a tenth of the price. For agent developers, a release that holds scores flat while shifting the entire cost structure downward is often more worth recalculating your pipeline's unit economics over than a few extra points on a leaderboard.

## References

- [OpenAI: Introducing GPT-6.1 Terra](https://openai.com/index/introducing-gpt-6-1-terra/)
- [OpenAI Deployment Safety: GPT-6.1 Terra system card](https://deploymentsafety.openai.com/gpt-6-1-terra)
- [OpenRouter: GPT-6.1 Terra model page](https://openrouter.ai/openai/gpt-6.1-terra)
- [9to5Mac: OpenAI upgrades ChatGPT and Codex with new GPT-6.1 Terra model](https://9to5mac.com/2026/10/26/openai-upgrades-chatgpt-and-codex-with-new-gpt-6-1-terra-model)
