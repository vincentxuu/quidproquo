---
title: "Model Card: Tencent Hy4 flash"
date: 2026-11-19
category: daily
type: digest
tags: [ai-agent, model-release, daily, tencent, model-family-hunyuan]
lang: en
description: "Tencent Hunyuan open-sources Hy4 flash — 224B total / 12B active parameters, 1M context, and WorkIndex task cost at 1/8 of DeepSeek-V4.1-Flash-1017 and 1/20 of its own flagship Hy4"
tldr: "Hy4 flash (`tencent/Hy4-flash`): 224B total parameters (including 64B Engram), 12B active parameters, 1M context, open-sourced 2026-11-17 under the Tencent Hy License; official pricing is $0.070 input / $0.281 output / $0.003 cache per 1M tokens; WorkIndex task quality (42.1) edges out the prior Hy4 Preview (39.7), but per-task cost is just 1/13 of Hy4 Preview, 1/20 of flagship Hy4, and 1/8 of DeepSeek-V4.1-Flash-1017; blind-test user satisfaction (2.79/4) is close to Claude Haiku 5.5 (2.81/4) at roughly 1/18 the cost"
series:
  name: "AI Model Tracker"
  order: 76
glossary:
  - term: "Engram"
    def: "A lookup-table embedding module in Hy4 flash that retrieves bigram/trigram representations via hashing — it adds no attention compute but accounts for a large share of stored parameters"
---

> 🌏 [中文版](/posts/daily/2026-11-19-model-tencent-hy4-flash)

## Model Info

| Item | Value |
|---|---|
| Model ID | `tencent/Hy4-flash` (also `tencent/Hy4-flash-FP8` quantized, `tencent/Hy4-flash-base` pretrained) |
| Vendor | Tencent (Hunyuan / Hy team) |
| Parameters | 224B total (including 64B Engram lookup parameters), 12B active per token (11.3B text + 0.43B vision) |
| Context Window | 1,048,576 tokens (1M) |
| Input Price (USD/1M tokens) | $0.070 |
| Output Price (USD/1M tokens) | $0.281 (cache-hit input billed separately at $0.003/1M tokens) |
| Open Source | Yes (Tencent Hy License, custom terms) |
| Release Date | 2026-11-17 |
| Official Announcement | [Tencent via PR Newswire](https://www.prnewswire.co.uk/news-releases/tencent-launches-hy4-flash-to-power-high-speed-cost-efficient-ai-deployment-for-everyday-workflows-302941888.html) |
| HuggingFace | [tencent/Hy4-flash](https://huggingface.co/tencent/Hy4-flash) |
| Family | Tencent Hunyuan Hy series (the lightweight flash branch of flagship Hy4; preceded by Hy4 preview on 2026-08-29) |

## Key Capabilities

- **Three architectural changes built for efficiency over flagship Hy4**: sparse attention interleaved with sliding-window attention at a 1:3 ratio (hybrid attention), routed experts moved into a lower-dimensional latent space (LatentMoE, 16-of-512 routing), and a new Engram module that retrieves bigram/trigram representations via hashed lookups — together cutting KV cache size to 1/24 of Hy3 and 1/6 of Hy4
- **Cost efficiency is the selling point, not a higher intelligence ceiling**: on the internal WorkIndex suite (8 tasks spanning slide creation/editing, document editing, spreadsheet repair, audio/video processing), Hy4 flash scores 42.1 overall — only a slight edge over the prior Hy4 Preview's 39.7 — but at 1/13 the per-task cost of Hy4 Preview, 1/20 of flagship Hy4, and 1/8 of DeepSeek-V4.1-Flash-1017 (Max tier)
- **DFly2 speculative decoding**: a 5-layer, 0.85B-parameter draft model directly reuses the main model's KV cache and the indices its sparse attention already selected, so each draft token attends to at most 2,048 keys regardless of context length — paired with 4-bit quantization to push decoding past 150 tokens/s
- **Blind-test satisfaction close to Claude Haiku 5.5, at a fraction of the cost**: in a blind evaluation with 85 internal Tencent WorkBuddy users across 259 tasks, Hy4 flash scored 2.79/4 user satisfaction (Claude Haiku 5.5: 2.81/4) at a cost of RMB 0.26 per task versus RMB 4.73 for Claude Haiku 5.5

## Benchmark Results

| Benchmark | Hy4 flash | Prior/Flagship Hy4 | Best Competitor |
|---|---|---|---|
| WorkIndex (internal task composite) | 42.1 | Hy4 Preview 39.7 / flagship Hy4 51.4 | — |
| DeepSWE v1.1 | 64.6 | flagship Hy4 74.9 | — |
| Terminal-Bench 4.0 | 19.2 | flagship Hy4 44.4 | — |
| Blind-test user satisfaction (4-point scale) | 2.79 | — | Claude Haiku 5.5 — 2.81 |
| Per-task cost on WorkIndex (relative) | 1× | flagship Hy4 — 20× | DeepSeek-V4.1-Flash-1017 (Max tier) — 8× |

⚠️ All figures except the blind test are Tencent's own benchmarks; the DeepSWE and Terminal-Bench 4.0 numbers come from the official appendix charts and were cross-checked against two independent aggregator sites (LLMLearner, DataLearnerAI), but have not been independently reproduced.

## Comparison with Predecessor/Competitors

Against its own flagship Hy4, Hy4 flash clearly trails on long-horizon software-engineering tasks (Terminal-Bench 4.0: 19.2 vs. 44.4; ProgramBench: 16.0 vs. 30.0), and Tencent itself recommends routing complex coding work to flagship Hy4 instead. Hy4 flash is positioned purely for everyday work — deep search, document processing, slide generation, simple frontend demos, and computer use.

Against DeepSeek-V4.1-Flash-1017, the differentiation is purely cost: Hy4 flash's WorkIndex task cost is just 1/8 of DeepSeek's, but Tencent has not published a direct benchmark score comparison between the two models — only the cost multiplier. So "cheaper" is confirmed; "which is smarter" is not something this release answers.

The pricing strategy is blunt: Hy4 flash's official price is 1/12 (input), 1/9 (output), and 1/15 (cache) of flagship Hy4's, with a further 50% launch discount on Tencent Cloud TokenHub through 2026-11-30. This mirrors the "flagship sells intelligence, flash sells price" two-tier product strategy Qwen and DeepSeek have both run recently. The twist here is that Tencent counts the Engram lookup parameters toward "total parameters": 64B of the headline 224B figure does zero attention compute, so the real active-parameter count is only 12B — notably leaner than the raw parameter count suggests.

## Implications for Agent Development

Hy4 flash's DFly2 speculative decoding deserves attention on its own: the draft model directly reuses the main model's sparse-attention index selections (Index Share) rather than recomputing them, which means speculative decoding keeps its speedup in long-context scenarios without added overhead as context grows — a more practical engineering choice than simply scaling up the context window for agent tasks that need to read an entire repo or a long document.

- If you're building high-frequency, low-complexity agent tasks (form filling, document conversion, simple web actions): Hy4 flash's cost structure (1/20 of flagship, 1/8 of DeepSeek flash) makes it a reasonable "first-pass filter" model, escalating harder cases to a flagship model
- If you're building a long-horizon coding agent: Hy4 flash clearly loses to flagship Hy4 on both Terminal-Bench 4.0 and ProgramBench — don't make it your primary coding-agent model
- Not a fit: decisions that require independently verifiable, reproducible benchmark numbers — the Open Benchmarks section is chart-only with no official numeric table, so you're relying on third-party aggregators reading the charts back out

## Today's Takeaway

I used to treat "total parameter count" as a direct proxy for inference cost, but 64B of Hy4 flash's 224B is Engram — a lookup-table parameter type that does no attention compute, leaving only 12B active parameters. Going forward, for MoE/lookup-hybrid architectures, "total parameters" and "inference cost" need to be read as two separate numbers — reading only the headline parameter count will badly overestimate the real compute requirement.

## References

- [Tencent Launches Hy4 flash to Power High-Speed, Cost-Efficient AI Deployment for Everyday Workflows (official PR Newswire announcement, 2026-11-17)](https://www.prnewswire.co.uk/news-releases/tencent-launches-hy4-flash-to-power-high-speed-cost-efficient-ai-deployment-for-everyday-workflows-302941888.html)
- [tencent/Hy4-flash · Hugging Face (model card, architecture spec, benchmark appendix charts)](https://huggingface.co/tencent/Hy4-flash)
- [Tencent-Hunyuan/Hy4-flash · GitHub](https://github.com/Tencent-Hunyuan/Hy4-flash)
- [Hy4 Flash: Benchmarks, Pricing & Specs | LLMLearner (Open Agent Benchmarks figures reconstructed from charts)](https://llmlearner.com/models/hy4-flash)
