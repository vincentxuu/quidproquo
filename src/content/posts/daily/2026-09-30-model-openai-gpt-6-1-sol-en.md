---
title: "Model Card: GPT-6.1 Sol"
date: 2026-09-30
category: daily
type: digest
tags: [ai-agent, model-release, daily, openai, model-family-gpt]
lang: en
description: "OpenAI launched GPT-6.1 Sol at DevDay 2026 — near-flagship-Astra performance at a fifth of the price, with cached-input pricing cut in half to $0.10"
tldr: "GPT-6.1 Sol (`gpt-6.1-sol`): launched at DevDay on 2026-09-29, 1,050,000-token context window (max input 922,000, max output 128,000, same as GPT-6 Sol); standard pricing unchanged at $2.00 input / $10.00 output, but cached input is halved again from GPT-6 Sol's $0.20 to $0.10 (95% below standard input); matches GPT-6 Astra on DeepSWE v1.1 at roughly 1/5 of Astra's cost, beating GPT-6 Sol's best score by 6.4 points; beats Claude Opus 5.5 on AutomationBench at medium effort by 2.2 points at about 1/3 the cost; in the same week OpenAI shelved a flagship upgrade, GPT-6.1 Astra, over safety concerns and did not release it"
series:
  name: "AI Model Tracker"
  order: 35
glossary:
  - term: "GPT"
    def: "OpenAI's large language model family; Sol is the mid-priced tier below flagship Astra, aimed at everyday complex work"
---

> 🌏 [中文版](/posts/daily/2026-09-30-model-openai-gpt-6-1-sol)

## Model Details

| Field | Value |
|---|---|
| Model ID | `gpt-6.1-sol` |
| Vendor | OpenAI |
| Parameters | Undisclosed |
| Context Window | 1,050,000 tokens (max input 922,000 tokens, max output 128,000 tokens) |
| Input pricing (USD/1M tokens) | $2.00 (cached $0.10, cache write $2.50) |
| Output pricing (USD/1M tokens) | $10.00 |
| Open source | No |
| Release date | 2026-09-29 |
| Official announcement | [OpenAI: Introducing GPT-6.1 Sol](https://openai.com/index/introducing-gpt-6-1-sol/) |
| Family | GPT-6.x (GPT-6 Sol/Luna released 2026-09-22; flagship GPT-6 Astra released 2026-09-03; a flagship upgrade, GPT-6.1 Astra, was shelved the same week and never shipped) |

## Highlights

- Cached-input pricing is cut in half again, from GPT-6 Sol's $0.20 to $0.10 per 1M tokens — 95% below standard input pricing — meaningfully lowering the cost of agents that repeatedly re-send long context across tool-call turns
- On DeepSWE v1.1 (real-codebase software engineering tasks), it matches GPT-6 Astra's performance at roughly one-fifth of Astra's cost, while beating GPT-6 Sol's best score by 6.4 points, at a lower reasoning effort
- On AutomationBench at medium reasoning effort, it scores 2.2 points above Claude Opus 5.5 at about one-third of the cost, and 4.8 points above GPT-6 Sol at the same setting
- At low reasoning effort, the factual-error rate drops from GPT-6 Sol's 11.4% to 7.7% (about a 32% reduction), and stays within 1.9 points of Astra across tested effort settings at under one-fifth of Astra's cost

## Benchmark Results

| Benchmark | Score | Predecessor (GPT-6 Sol) | Best competitor |
|---|---|---|---|
| Terminal-Bench Science 0.1 (max effort, avg. cost/task) | $5.47/task | OpenAI reports "more than double the score at less than half the cost"; exact prior average not disclosed | Claude Opus 5.5 $23.21/task; GPT-6 Astra $23.80/task (Astra still leads on accuracy at 68.1%, still recommended for the hardest research tasks) |
| DeepSWE v1.1 (agentic software engineering) | Matches Astra (at ~1/5 of Astra's cost) | 68.8% (see the 2026-09-25 model card) | Matches GPT-6 Astra (Astra's exact score not given in this announcement) |
| AutomationBench (medium effort) | +2.2pp over Opus 5.5 (at ~1/3 the cost) | +4.8pp over GPT-6 Sol at the same setting | Claude Opus 5.5 (medium effort; exact score not disclosed) |
| OSWorld 2.0 offline set (max effort) | +7pp over GPT-6 Sol (at under half the cost) | 60.5% (xhigh effort, see the 2026-09-25 model card) | 2.1pp behind GPT-6 Astra (at roughly 1/7 of Astra's cost) |
| Factual-error rate (low effort, lower is better) | 7.7% | 11.4% | Within 1.9pp of GPT-6 Astra (Astra costs 5x+ more) |

⚠️ All figures are OpenAI's own benchmarking under vendor-chosen reasoning-effort settings and competitor comparisons, pending independent reproduction. Most rows are the relative gaps OpenAI published, not both models' absolute scores — Astra's and Opus 5.5's exact numbers weren't fully disclosed in this announcement.

## Versus the Predecessor and Competitors

Compared with GPT-6 Sol, released just a week earlier, this isn't a repositioning — it's the same price tier getting meaningfully stronger: +6.4 points on DeepSWE v1.1, +7 points on OSWorld 2.0, and roughly a 30% drop in factual-error rate, with most of the gains showing up at lower reasoning effort (i.e., the same task now costs less compute for a better result). Standard API pricing ($2 input / $10 output) is unchanged; the one real change is cached input dropping from $0.20 to $0.10 — which matters more for agents than the benchmark deltas do, since agents typically re-send the same system prompt and long context across many tool-call turns.

Against Claude, Sol edges out Opus 5.5 by 2.2 points on AutomationBench at medium effort, at about a third of the cost; on Terminal-Bench Science 0.1 it costs $5.47/task versus Opus 5.5's $23.21 — over 4x cheaper. But this is a "tie or slight win, big cost advantage" story, not a new ceiling: OpenAI's own announcement concedes that GPT-6 Astra still leads all tested models on Terminal-Bench Science 0.1 at 68.1%.

The timing is the more interesting signal: OpenAI shelved a flagship upgrade, GPT-6.1 Astra, earlier the same week — citing internal safety standards — and brought GPT-6.1 Sol to DevDay as the week's headline release instead. There's no new top-of-scale score here; OpenAI chose to invest in closing the gap to its existing flagship at lower cost rather than pushing the ceiling higher.

## Implications for Agent Development

This release continues GPT-6 Sol/Luna's cost-efficiency strategy, but the cached-input cut to $0.10 is specifically aimed at agent workloads.

- If you're building multi-turn tool-calling agents that repeatedly reuse the same system prompt or long context: $0.10 cached input makes repeated re-sends nearly free — worth re-running the unit-economics on any existing pipeline
- If you're building coding agents or need near-flagship quality on a tight budget: matching Astra on DeepSWE v1.1 at one-fifth the cost makes this the strongest reason yet to test replacing an older Sol deployment
- Not a fit: workloads that need top-tier scientific reasoning — Astra's 68.1% on Terminal-Bench Science 0.1 is still the ceiling, and the Sol line hasn't closed that gap
- Concrete suggestion: watch for the upcoming GPT-6.1 Sol Ultrafast tier (up to 8x faster token generation in Codex) — worth prioritizing for latency-sensitive interactive workflows like tab completion and live diff suggestions

## Today's Takeaway

Shelving a flagship upgrade in the same week it invested in a mid-tier model's caching economics and reliability suggests OpenAI is currently more focused on shifting the cost-performance curve within an existing price tier than on rushing out a new top score. A pricing tweak as unglamorous as halved cached-input cost can matter more to the real cost of a long-running agent pipeline than the percentage-point gaps on a benchmark table.

## References

- [OpenAI: Introducing GPT-6.1 Sol](https://openai.com/index/introducing-gpt-6-1-sol/)
- [OpenAI API Docs: GPT-6.1 Sol model details](https://developers.openai.com/api/docs/models/gpt-6.1-sol)
- [OpenAI Deployment Safety: Addendum to GPT-6 Astra System Card — GPT-6.1 Sol](https://deploymentsafety.openai.com/gpt-6-1-sol)
- [TheNextWeb: OpenAI releases GPT-6.1 Sol at a fifth of GPT-6 Astra's token prices](https://thenextweb.com/news/openai-gpt-6-1-sol-price-astra-devday)
- [Neowin: OpenAI launches GPT-6.1 Sol with near-Astra performance at one-fifth the price](https://www.neowin.net/news/openai-launches-gpt-61-sol-with-near-astra-performance-at-one-fifth-the-price/)
- [DataCamp: GPT-6.1 Sol: Features, Benchmarks, Pricing, and Access](https://www.datacamp.com/blog/gpt-6-1-sol)
