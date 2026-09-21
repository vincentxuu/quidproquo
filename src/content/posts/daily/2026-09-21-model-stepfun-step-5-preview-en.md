---
title: "Model Card | Step 5 Preview"
date: 2026-09-21
category: daily
type: digest
tags: [ai-agent, model-release, daily, stepfun, model-family-stepfun]
lang: en
description: "China's StepFun, one of the country's 'AI Tigers,' released its flagship Step 5 Preview — a 600B/27B-active MoE with a 1M-token context that scores 44 on the Artificial Analysis Intelligence Index (tying Kimi K3) at roughly a tenth of frontier-model task cost"
tldr: "Step 5 Preview (StepFun): API launched 2026-09-20, open weights due 2026-10-15; a 600B-total, 27B-active sparse MoE with a 92-layer narrow-deep Transformer, 1M-token context, and text/image/video input; API pricing is $1.00 input (cache hit $0.05) / $2.70 output per 1M tokens; scores 44 on the independent Artificial Analysis Intelligence Index, on par with Kimi K3 and Grok 4.6 but behind Claude Opus 5 (51) and the tied GPT-6 Astra / Claude Fable 5.1 (53); its cost per task runs about 42% below Gemini 3.8 Flash at a comparable score; for agent development it's a mid-tier option offering near-frontier intelligence at a fraction of the cost, suited to long-horizon research agents and financial analysis"
series:
  name: "AI Model Tracker"
  order: 28
glossary:
  - term: "StepFun"
    def: "A Shanghai-based Chinese foundation-model startup founded in April 2023, one of China's so-called 'AI Tigers,' with 38 foundation models released to date"
  - term: "Artificial Analysis Intelligence Index"
    def: "A composite intelligence score computed by the independent evaluator Artificial Analysis across multiple benchmarks, commonly used to compare models across vendors"
---

> 🌏 [中文版](/posts/daily/2026-09-21-model-stepfun-step-5-preview)

## Model Info

| Item | Value |
|---|---|
| Model ID | `step-5-preview` |
| Vendor | StepFun |
| Parameters | 600B total, 27B active (sparse MoE, roughly 4.5% of weights activated per token) |
| Context Window | 1,000,000 tokens (max output 64k tokens) |
| Input Pricing (USD/1M tokens) | $1.00 (cache miss) / $0.05 (cache hit) |
| Output Pricing (USD/1M tokens) | $2.70 (including reasoning tokens) |
| Open Source | No (API-only for now; StepFun says open weights will ship 2026-10-15) |
| Release Date | 2026-09-20 |
| Official Announcement | [StepFun: Step 5 Preview — Advancing the Pareto Frontier](https://www.stepfun.com/step-5-preview) |
| HuggingFace | Not yet available (weights unreleased, no HuggingFace page yet) |
| Family | StepFun Step series (Step-2, a hundred-billion-parameter MoE, July 2024 → Step 3.5 Flash → Step 3.7 Flash → Step 5 Preview, this release) |

## Capability Highlights

- Scores 44 on Artificial Analysis's independent Intelligence Index — on par with Kimi K3 and Grok 4.6 (high), just one point behind GLM-5.3 — while costing only $0.72 per task, about 42% less than Gemini 3.8 Flash (high, $1.24)
- Uses a 92-layer narrow-deep Transformer rather than a wider architecture, paired with MTP-3 speculative decoding, FP8 MoE, and KV-cache offload; StepFun reports more than a 3x end-to-end speedup in long-horizon RL training
- In a 24-hour long-horizon test, it optimized an MLA GPU kernel on an H100 to 508 TFLOPS, beating Claude Opus 5's 493 TFLOPS; in a separate test it lifted Qwen3-30B-A3B's AIME24 score from 53.3% to 60% through automated post-training, matching Claude Opus 5 while using fewer annotator tokens
- Coordinated 950 web fetches within a single agent action to assemble a climate-research dataset spanning 1,000 locations and 25 years (300,000 monthly records across 11 variables)

## Benchmark Results

| Benchmark | Step 5 Preview | Predecessor | Strongest Competitor |
|---|---|---|---|
| Artificial Analysis Intelligence Index | 44 (independent) | No direct predecessor (first Step 5-series model) | Claude Fable 5.1 / GPT-6 Astra, tied at 53 |
| DeepSWE v1.1 | 67.7% | No direct predecessor | Claude Opus 5 74.0%, GPT-6 Astra 74.1% |
| StepCodeBench (StepFun's own) | 49.0% | No direct predecessor | Claude Opus 5 63.9% |
| FrontierFinance | 66.4% | No direct predecessor | Claude Opus 5 69.7% |
| DRACO | 83.3% | No direct predecessor | Claude Opus 5 87.6% |

⚠️ Except for the Artificial Analysis Intelligence Index, every Step 5 Preview figure above is self-reported by StepFun, run at `high` reasoning effort while Claude Opus 5 / GPT-6 Astra ran at their respective `max` effort — not a strictly apples-to-apples comparison — and independent reproduction is still pending. The Artificial Analysis Intelligence Index is an independent third-party evaluation that also measured API output speed at about 99.8 tokens/second.

## Versus Predecessor / Competitors

Step 5 Preview is StepFun's first model under the "Step 5" label; its predecessors, Step 3.7 Flash and Step 3.5 Flash, sit in a different, mid-tier class, so there's no strict apples-to-apples predecessor score in the table above. Against same-tier competitors, Step 5 Preview trails Claude Opus 5 and GPT-6 Astra across coding and finance benchmarks (DeepSWE, StepCodeBench, FrontierFinance, DRACO) by roughly 5-14 percentage points, but on the broader Artificial Analysis Intelligence Index it's just one point behind GLM-5.3 and ties Kimi K3 and Grok 4.6.

The real differentiator is pricing strategy: StepFun is positioning Step 5 Preview as a "Pareto frontier" play — trading a bit of peak intelligence for a dramatically lower cost. Artificial Analysis estimates a per-task cost of just $0.72, under a tenth of Claude Fable 5.1's $7.63, and 42% below Gemini 3.8 Flash's $1.24. The trade-off is verbosity: the same evaluation run produced 160 million output tokens versus a 92-million median, eating into some of the per-token savings, and output speed (around 100 tokens/second) trails Gemini 3.8 Flash's 331 tokens/second by a wide margin.

## Implications for Agent Development

The 1M-token context window combined with native text/image/video input suits agent tasks that accumulate long-running context — StepFun's own climate-research demo coordinated 950 web fetches within a single agent action while maintaining state throughout. For tasks that need "sustained progress plus repeated tool calls," a long context directly reduces the need for an external memory or RAG layer.

- If you're building a long-horizon research agent (deep research, multi-round data gathering and synthesis): Step 5 Preview's 1M context and its ability to coordinate hundreds of tool calls within a single action make it a candidate for replacing complex "chunked-retrieval-plus-stitching" pipelines, especially when the task can tolerate somewhat higher latency and verbosity
- If you're building a financial-analysis agent: the FrontierFinance and FinStepBench results show StepFun specifically optimized for finance, with valuation, due-diligence, and deep-research tasks landing close to Claude Opus 5 at a fraction of the API cost
- Not a fit: real-time or low-latency interaction (output speed is only around 100 tokens/second, far slower than Gemini 3.8 Flash's 331 tokens/second); also not a fit if you need to self-host today, since open weights aren't due until 2026-10-15 — for now Step 5 Preview is only accessible through StepFun's API

## Today's Takeaway

Step 5 Preview's "narrow-deep" architecture choice — 92 layers, no widening — is a notable outlier. Most recent flagship-model races have leaned toward widening layers or adding more experts, while StepFun instead stacked more layers to gain longer multi-hop reasoning paths during long prefill. It's a reminder that when everyone is chasing the same benchmark leaderboard, the architectural path used to reach a given score can matter more than the score itself — because that path determines whether further gains are possible within the same cost structure.

## References

- [StepFun official announcement: Step 5 Preview — Advancing the Pareto Frontier](https://www.stepfun.com/step-5-preview)
- [StepFun official docs: Step 5 Preview model specs](https://platform.stepfun.ai/docs/en/guides/models/step-5-preview)
- [MarkTechPost: StepFun Launches Step 5 Preview: A 600B-Total, 27B-Active MoE Model With 1M Context for Long-Horizon Agentic Work](https://www.marktechpost.com/2026/09/20/stepfun-launches-step-5-preview/)
- [OfficeChai: China's StepFun Releases Step 5 Preview, Beats Gemini 3.8 Flash On Performance And Cost](https://officechai.com/ai/chinas-stepfun-releases-step-5-preview-beats-gemini-3-8-flash-on-performance-and-cost)
- [Artificial Analysis: Step 5 Preview model evaluation page](https://artificialanalysis.ai/models/step-5)
