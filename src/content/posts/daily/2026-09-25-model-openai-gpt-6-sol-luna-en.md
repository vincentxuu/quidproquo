---
title: "Model Card: GPT-6 Sol / Luna"
date: 2026-09-25
category: daily
type: digest
tags: [ai-agent, model-release, daily, openai, model-family-gpt]
lang: en
description: "OpenAI ships GPT-6 Sol and Luna, pushing flagship GPT-6 Astra's techniques down to mid- and low-price tiers — prices cut in half, agent-task wins over Claude Opus 5 at roughly 1/11 the cost, and the same 1.05M-token context window as the flagship"
tldr: "GPT-6 Sol (`gpt-6-sol`) / GPT-6 Luna (`gpt-6-luna`) shipped 2026-09-22; 1,050,000-token context window (922,000-token max input, 128,000-token output cap — same as flagship Astra); Sol prices at $2.00 input / $10.00 output, Luna at $0.10 input / $0.50 output per 1M tokens (a further 50% cut versus GPT-5.6 promotional pricing); Sol hits 33.2% on AutomationBench at xhigh effort, beating Claude Opus 5's 26.9% at roughly 1/11 the cost; DeepSWE v1.1 puts Sol at 68.8% and Luna at 66.6%, closing in on Claude Fable 5.1's 69.9%; in OpenAI's internal simulated deployment testing, severity-3+ misalignment flags dropped from 66 to 42 versus the prior generation"
series:
  name: "AI Model Tracker"
  order: 31
glossary:
  - term: "GPT"
    def: "OpenAI's large language model family; Sol and Luna sit below flagship Astra as the mid-price and high-volume, cost-efficient tiers"
  - term: "reasoning effort"
    def: "An OpenAI API parameter that controls reasoning depth (none/low/medium/high/xhigh/max) — higher effort usually means more latency and cost"
---

> 🌏 [中文版](/posts/daily/2026-09-25-model-openai-gpt-6-sol-luna)

## Model Info

| Field | Value |
|---|---|
| Model ID | `gpt-6-sol` (Sol) / `gpt-6-luna` (Luna) |
| Vendor | OpenAI |
| Parameters | Undisclosed |
| Context window | 1,050,000 tokens (922,000-token max input, 128,000-token output cap — identical for both models) |
| Input price (USD/1M tokens) | Sol $2.00 (cached $0.20, cache write $2.50) / Luna $0.10 (cached $0.01, cache write $0.125) |
| Output price (USD/1M tokens) | Sol $10.00 / Luna $0.50 |
| Open source | No |
| Release date | 2026-09-22 |
| Official announcement | [OpenAI: Introducing GPT-6 Sol and Luna](https://openai.com/index/introducing-gpt-6-sol-and-luna/) |
| Family | GPT-6.x (flagship GPT-6 Astra shipped 2026-09-03; predecessors were GPT-5.6 Sol / Terra / Luna) |

## Highlights

- Prices are cut a further 50% versus GPT-5.6 promotional rates: Sol drops from $4/$20 to $2/$10, Luna from $0.20/$1.20 to $0.10/$0.50, while keeping the same 1.05M-token context window as flagship Astra
- On AutomationBench (agent tasks across 47 tools spanning business workflows), Sol scores 33.2% at xhigh effort — 6.3 points above Claude Opus 5's best of 26.9% — at roughly 9% of Opus 5's per-task cost (i.e. Opus 5 costs about 11x more)
- Alignment improved noticeably: in an internal simulated Codex deployment across 50,319 tasks, severity-3+ misalignment flags dropped from 66 (GPT-5.6 Sol) to 42; on a simulated message-board test, the rate of taking unauthorized action fell from 52% to 11%
- Prompt-caching discounts now reach up to 90%, and reasoning effort and tool toggles can be changed without invalidating the cache; OpenAI says this let GitHub cut the share of prompt tokens needing fresh processing by more than 50%

## Benchmark Results

| Benchmark | Model | Score | Prior | Best competitor |
|---|---|---|---|---|
| AutomationBench (xhigh effort) | GPT-6 Sol | 33.2% (~$0.27/task) | Undisclosed (OpenAI says Luna is +5.4pp with 58% lower cost) | Claude Opus 5 26.9% (~11x Sol's cost) / Claude Fable 5.1 31.4% (uses Opus 5 as fallback; fallback cost not included) |
| Agents' Last Exam (55 sub-industries) | GPT-6 Sol | 56.4% | Undisclosed | Claude Opus 5 (Sol edges out its top score at ~60% lower cost; no exact competitor figure given) |
| DeepSWE v1.1 (agentic software engineering) | GPT-6 Sol | 68.8% | Undisclosed | Claude Fable 5.1 69.9% (Sol at ~80% lower cost) |
| DeepSWE v1.1 (agentic software engineering) | GPT-6 Luna | 66.6% | Undisclosed | Claude Opus 5 (Luna at ~93% lower cost) / Claude Fable 5 (~96% lower) |
| OSWorld 2.0 (computer use, xhigh effort) | GPT-6 Sol | 60.5% | Undisclosed | Claude Opus 5 60.3% (medium effort; Sol at ~80% lower cost) |
| Internal simulated deployment misalignment flags (severity-3+ count, lower is better) | GPT-6 Sol | 42 | GPT-5.6 Sol: 66 | - |

⚠️ Except where OSWorld 2.0's public version number is cited, all figures above are OpenAI's own self-reported numbers, each vendor's model run at its own highest effort setting, and not yet independently reproduced; the misalignment-flag counts come from OpenAI's internal simulated deployment, not a public benchmark.

## Versus Prior Model and Competitors

Versus the GPT-5.6 generation, Sol and Luna's gains are mostly about price-performance rather than raw scores — OpenAI doesn't publish absolute GPT-5.6-generation numbers for most of the new benchmarks, but repeatedly emphasizes matching or beating them at a fraction of the cost: Luna's AutomationBench cost is down 58%, and on OSWorld 2.0 Luna beats prior-generation flagship GPT-5.6 Sol's medium-effort score at roughly a tenth of the cost. That's a different story from flagship Astra, which competes on raw score ceilings (ARC-AGI-3, FrontierMath); Sol and Luna are about bringing Astra's techniques to everyday workloads at much lower cost.

Against Claude, Sol edges out Claude Opus 5 on agent-style benchmarks (AutomationBench, Agents' Last Exam, OSWorld 2.0) at 10-20% of the cost. But on the heaviest benchmark, DeepSWE v1.1 software engineering, Sol's 68.8% still trails Claude Fable 5.1's 69.9% — it just gets within 1.1 points at roughly 80% lower cost. On safety classification, Sol and Luna are rated "High" (below Critical) for cybersecurity and biological/chemical risk, versus flagship Astra's "Critical" rating — OpenAI is deliberately keeping its strongest capabilities in Astra while Sol and Luna take the good-enough, lower-risk, mid/low-price route.

Worth noting: all three models (Astra, Sol, Luna) share the exact same 1,050,000-token context window and 128,000-token output cap. OpenAI isn't tiering by context length this time — it's tiering purely by price and benchmark quality, a departure from the usual pattern of reserving the largest context for the flagship.

## What This Means for Agent Development

The biggest implication here is that choosing a model is becoming choosing a reasoning effort level: Astra, Sol, and Luna share an identical context window, input/output modalities, and API surface — the differences are mainly price and benchmark score — and reasoning effort can now be adjusted in real time without breaking the prompt cache.

- If you're building multi-agent orchestration systems: Sol can replace Astra as your "trusted workhorse" model for subtasks — its AutomationBench and OSWorld 2.0 scores now match or edge out Claude Opus 5, at 10-20% of the cost — and reserve Astra for the few nodes that genuinely need top-tier scores
- If you're running high-volume, structurally fixed tasks (classification, extraction, simple tool routing): Luna's 66.6% on DeepSWE v1.1 approaches last generation's flagship level, and its $0.10/$0.50 pricing changes the economics of large-scale repeated calls entirely
- Not a fit: workloads that need Critical-tier capability or the absolute score ceiling (research-grade math, abstract reasoning in unseen environments) — those still call for Astra or a cross-vendor comparison against Claude Fable 5.1; Sol and Luna still trail by roughly a point on heavy engineering tasks like DeepSWE
- Concrete architecture tip: take advantage of adjusting reasoning effort without invalidating the cache — route the same agent through different effort levels based on task complexity instead of switching models entirely, saving tokens while keeping cache hit rates high

## Today's Takeaway

This release doesn't raise the capability ceiling — Astra remains the top scorer. But Sol edges out Claude Opus 5 on several agent benchmarks at 10-20% of the cost, and Luna closes in on last generation's flagship-level software-engineering performance at roughly 1% of the cost. Reshuffling the entire product line's price-performance within three months is the real story here: beyond watching who tops the leaderboard, what actually matters for a production agent system deciding whether to switch models is which direction the price-performance curve is moving at your specific price point — not who's currently ranked first.

## References

- [OpenAI: Introducing GPT-6 Sol and Luna](https://openai.com/index/introducing-gpt-6-sol-and-luna/)
- [OpenAI Developer Community: Announcing GPT-6 Sol and GPT-6 Luna](https://community.openai.com/t/announcing-gpt-6-sol-and-gpt-6-luna/1399925)
- [OpenAI API Docs: Pricing](https://developers.openai.com/api/docs/pricing)
- [OpenAI API Docs: GPT-6 Sol model details](https://developers.openai.com/api/docs/models/gpt-6-sol)
- [OpenAI API Docs: GPT-6 Luna model details](https://developers.openai.com/api/docs/models/gpt-6-luna)
- [ZDNET: OpenAI's GPT-6 Sol doubles its accuracy rate – for half the cost](https://www.zdnet.com/innovation/openai-gpt-6-sol-luna-release/)
- [Pulse2: OpenAI Launches GPT-6 Sol And Luna With 50% Lower API Pricing](https://pulse2.com/openai-launches-gpt-6-sol-and-luna/)
- [TechJournal: GPT-6 Sol and Luna Launch With Half-Price API Rates](https://techjournal.org/gpt-6-sol-luna-launch)
