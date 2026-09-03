---
title: "Model Card | Gemini 3.7 Flash"
date: 2026-08-16
category: daily
type: digest
tags: [ai-agent, model-release, daily, google]
lang: en
description: "Google releases Gemini 3.7 Flash — same pricing as 3.6 Flash, DeepSWE v1.1 jumps from 48.6% to 65.3%, targeting enterprise-grade agentic coding and long-running automation"
tldr: "Gemini 3.7 Flash (API ID: gemini-3.7-flash): 1M input / 64k output context, input $0.75, output $3.75 per 1M tokens (promotional pricing through 2026-12-31, reverting to $1.50 / $7.50 — same as predecessor 3.6 Flash); DeepSWE v1.1 65.3% (prev 48.6%), AutomationBench 30.4% (prev 17.0%), FrontierCode 1.1 43.6%; beats Claude Sonnet 5 and GPT-5.6 Terra on multiple agentic/enterprise automation benchmarks"
series:
  name: "AI Model Tracker"
  order: 1
---

> 🌏 [中文版](/posts/daily/2026-08-16-model-google-gemini-3-7-flash)

## Model Info

| Field | Value |
|---|---|
| Model ID | `gemini-3.7-flash` |
| Provider | Google (Google DeepMind) |
| Parameters | Undisclosed |
| Context Window | 1,000,000 tokens (input) / 64,000 tokens (output) |
| Input Pricing (USD/1M tokens) | $0.75 (promotional, through 2026-12-31; reverts to $1.50) |
| Output Pricing (USD/1M tokens) | $3.75 (promotional, through 2026-12-31; reverts to $7.50) |
| Open Source | No |
| Release Date | 2026-08-13 |
| Official Announcement | [Google Blog](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-3-7-flash/) |

## Key Capabilities

- DeepSWE v1.1 (long-horizon software engineering benchmark) hits 65.3%, up 16.7 percentage points from Gemini 3.6 Flash's 48.6%
- AutomationBench (enterprise workflow automation, private test set) jumps from 17.0% to 30.4%, nearly doubling
- FrontierCode 1.1 (production code quality) rises from 34.4% to 43.6%, the most notable improvement among same-generation models
- New native computer use tool mode — OSWorld-2.0 (agentic computer operation) improves from 33.8% to 47.9%
- Supports function calling, search-as-a-tool, and computer use as three tool use modes, accessible via Gemini App, Google Antigravity, Gemini Enterprise Agent Platform, and other interfaces

## Benchmark Results

| Benchmark | Gemini 3.7 Flash | Previous (3.6 Flash) | Best Competitor |
|---|---|---|---|
| DeepSWE v1.1 (long-horizon SWE) | 65.3% | 48.6% | GPT-5.6 Terra 69.6% |
| FrontierCode 1.1 (production code quality) | 43.6% | 34.4% | Claude Sonnet 5 42.7% |
| Terminal-bench 2.1 (agentic terminal ops) | 85.8% | 78.0% | GPT-5.6 Terra 87.4% |
| AutomationBench (enterprise workflow automation) | 30.4% | 17.0% | GPT-5.6 Terra 23.6% |
| GDM-MRCR v2 (128k long context) | 97.0% | 91.8% | GPT-5.6 Terra 93.5% |
| HLE-Verified (cross-domain expert reasoning) | 53.6% | 51.2% | GPT-5.6 Terra 51.1% |

⚠️ These are Google's internally reported evaluation results (including cross-vendor model comparisons), not third-party reproductions published by each vendor. Actual performance may vary depending on evaluation setup.

## Comparison with Predecessor & Competitors

Compared to Gemini 3.6 Flash, the biggest leap isn't in code generation itself but in "enterprise automation" and "long-horizon agent tasks": AutomationBench nearly doubles (17.0% → 30.4%), and DeepSWE v1.1 opens a 16.7 percentage point gap, indicating significantly improved reliability in multi-step, sustained-execution enterprise scenarios.

Against competitors, Gemini 3.7 Flash leads Claude Sonnet 5 and GPT-5.6 Terra on FrontierCode, AutomationBench, GDM-MRCR, and HLE-Verified, but still trails GPT-5.6 Terra by roughly 2–4 percentage points on DeepSWE v1.1 and Terminal-bench 2.1 — the two pure code/terminal benchmarks. On the knowledge-work side, GDPVal-AA (Elo 1525) also falls below Claude Sonnet 5 (1598) and Muse Spark 1.2 (1628).

Pricing stays at the 3.6 Flash promotional rate of $0.75/$3.75 per 1M tokens — effectively a hidden price cut given the capability jump. Compared to Claude Sonnet 5 at $2.00/$10.00 and GPT-5.6 Terra at $2.00/$12.00, Gemini 3.7 Flash's input price is ~63% cheaper and output price ~63–69% cheaper. Browser Use's hands-on testing also reports that switching to 3.7 Flash lowers end-to-end agent cost by an additional 35% (from higher prompt cache hit rates and fewer tool call errors, not token unit price changes).

## Implications for Agent Development

The native computer use tool mode plus OSWorld-2.0 jumping from 33.8% to 47.9% is the most direct impact on agent architecture — previously, Flash-tier models clearly lagged behind Pro/frontier models in "operating real desktop/browser environments," and 3.7 Flash significantly narrows that gap.

- If you're building a coding agent or SWE agent: DeepSWE 65.3% + Terminal-bench 2.1 85.8% means you can run near-frontier code/terminal automation at Flash pricing, dramatically reducing long-running batch costs
- If you're building enterprise workflow automation (contract review, report generation, multi-step form processing): AutomationBench 30.4% (nearly 2x predecessor) combined with 1M input context makes it well-suited for long-document-driven enterprise process agents
- Not ideal for: scenarios requiring the highest-precision knowledge work judgment (e.g., legal/financial due diligence) — Claude Sonnet 5 (Elo 1598) and Muse Spark 1.2 (Elo 1628) still lead 3.7 Flash (Elo 1525) on GDPVal-AA; pair with a frontier-tier model or human review for these tasks

## Takeaway

The default assumption used to be that "Flash-tier" models trade capability for speed and cost, with agentic ability clearly trailing same-generation Pro/frontier models. But Gemini 3.7 Flash's official evals show it beating Claude Sonnet 5 and GPT-5.6 Terra — models priced 2–3x higher — on AutomationBench, FrontierCode, GDM-MRCR, and HLE-Verified. The "Flash vs Pro" divide is shifting from "capability gap" to "context ceiling and latency tradeoff," especially in enterprise automation scenarios that demand heavy long-running execution.

## References

- [Gemini 3.7 Flash: our most intelligent workhorse model — Google Blog](https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-3-7-flash/)
- [Gemini 3.7 Flash — Google DeepMind (benchmarks & model info)](https://deepmind.google/models/gemini/flash/)
- [Gemini 3.7 Flash Model Card — Google DeepMind](https://deepmind.google/models/model-cards/gemini-3-7-flash/)
- [Gemini Developer API pricing — Google AI for Developers](https://ai.google.dev/gemini-api/docs/pricing)
- [Models | Gemini API — Google AI for Developers](https://ai.google.dev/gemini-api/docs/models)
