---
title: "Model Card｜Tencent Hy4 Preview"
date: 2026-08-29
category: daily
type: digest
tags: [ai-agent, model-release, daily, tencent, model-family-hunyuan]
lang: en
description: "Tencent Hunyuan open-sources Hy4 preview — a 770B/49B-active MoE flagship with 1M context that, for the first time, lets the model participate in optimizing its own training and inference, lifting end-to-end throughput 31.8%"
tldr: "Tencent Hy4 preview: 770B total / 49B active parameters (MoE, 78 layers), 1,048,576-token context window; API pricing $0.834 input / $2.501 output per 1M tokens (cache hit $0.042); Apache 2.0 open weights on HuggingFace; a 163-engineer blind eval scores it 2.99/4.00, just ahead of GLM-5.3 (2.92) and Kimi K3 (2.94); third-party aggregator BenchLM scores it 79.2/100, ranked #7 of 228 models; Tencent discloses for the first time that the model helped optimize its own training pipeline and inference system, lifting throughput 31.8%"
series:
  name: "AI Model Tracker"
  order: 9
glossary:
  - term: "Hunyuan"
    def: "Tencent's large language model family; the Hy series (Hy3, Hy4, etc.) is its latest generation of open-source flagship models"
---

> 🌏 [中文版](/posts/daily/2026-08-29-model-tencent-hy4-preview)

## Model Information

| Field | Value |
|---|---|
| Model ID | `tencent/Hy4-preview` (served alias `hy4-preview`) |
| Vendor | Tencent (Tencent Hunyuan) |
| Parameters | 770B total, 49B active (MoE, 78 layers; plus a native MTP layer with 10B total / 0.7B active parameters for speculative decoding) |
| Context Window | 1,048,576 tokens (1M) |
| Input Pricing (USD/1M tokens) | $0.834 |
| Output Pricing (USD/1M tokens) | $2.501 (cache hit $0.042) |
| Open Source | Yes (Apache License 2.0; an FP8-quantized `Hy4-preview-FP8` variant is also provided) |
| Release Date | 2026-08-28 |
| Official Announcement | [Tencent official press release](https://www.tencent.com/tencent-releases-and-open-sources-tencent-hy4-preview/) |
| HuggingFace | [tencent/Hy4-preview](https://huggingface.co/tencent/Hy4-preview) |
| Family | Tencent Hunyuan Hy series (Hy3 preview → Hy4 preview) |

## Key Capabilities

- Architecture blends ideas from both DeepSeek and GLM: the attention module uses Gated DeepSeek Sparse Attention (Gated DSA) with IndexCache for cross-layer sparse index reuse, and the residual pathway uses iHC (identity Hyper-Connections) to widen inter-layer information flow
- Edges out two major open-weight rivals in an internal blind eval: 163 engineers rated outputs on 203 engineering tasks, and Hy4 preview scored 2.99/4.00 on average, slightly ahead of GLM-5.3 (2.92) and Kimi K3 (2.94)
- First time the model has participated in its own development: Hy4 preview took part in automated optimization experiments for training methods, data strategy, evaluation frameworks, and low-level operators, forming an early recursive self-improvement loop
- The model autonomously analyzed and optimized its own inference system (operator fusion, communication optimization), lifting end-to-end throughput 31.8% over baseline, with consistent gains across context lengths and concurrency levels

## Benchmark Results

| Benchmark | Hy4 preview | Prior gen (Hy3 preview) | Reference |
|---|---|---|---|
| SWE-bench Pro | 65.7% | — | Claude Mythos 5: 80.3% (highest verified score BenchLM tracks) |
| Terminal-Bench 2.1 | 85.4% | 54.4% (Terminal-Bench 2.0 — different version, not directly comparable) | GLM-5.3: 88.2% |
| SWE-bench Multilingual | 82.9% | — | Claude Opus 5: 89.5% |
| GPQA Diamond | 92.3% | — | Sakana Fugu-Ultra: 95.5% |
| HLE (Humanity's Last Exam) | 55.4% | — | Claude Opus 5: 64.7% |

⚠️ The scores above come from Tencent's own Benchmark Appendix in the official Hy4-preview model card — self-reported. The "Reference" column and BenchLM's composite score (79.2/100, ranked #9/140 in Agentic at the 94th percentile, #11/146 in Coding at the 93rd percentile) come from a third-party aggregator and await independent reproduction. Hy3 preview's own self-reported numbers separately include SWE-bench Verified 74.4% and BrowseComp 67.1%, but Hy4 preview's public appendix reports SWE-bench Pro and Multilingual instead — two different subsets — so most metrics besides Terminal-Bench can't be lined up directly across generations.

## Comparison with Predecessor/Competitors

Compared with Hy3 preview (295B total / 21B active parameters, 256K context), Hy4 preview scales up on model size (770B/49B), context window (1M, a 4x jump), and training data volume all at once — Tencent calls it the largest generation-over-generation gain it has measured. What stands out more is the process itself: Hy3 preview was purely a training output, while Hy4 preview is the first to put "the model itself" inside the training and inference optimization loop — Tencent directly credits the 31.8% inference throughput gain to bottlenecks the model found and fixed on its own.

Against contemporary open-weight flagships, the internal blind-eval score of 2.99 only edges out GLM-5.3 (2.92) and Kimi K3 (2.94) by a margin within noise. BenchLM's third-party composite ranking places Hy4 preview in roughly the top 10% for both Agentic and Coding categories (94th/93rd percentile) — solidly first-tier open-weight, but not a clean sweep: GPQA Diamond's 92.3% still trails Sakana Fugu-Ultra's 95.5%. Pricing at $0.834 input / $2.501 output sits between the contemporaneous GLM-5.3 flagship ($1.40/$4.40) and its own Flash sibling GLM-5.3-Flash ($0.15/$0.50) — Hy4 preview is prioritizing scale and capability over the extreme cost-efficiency play GLM-5.3-Flash is making.

## Implications for Agent Development

Pairing a 1M-token context with Gated DSA sparse attention means, in principle, an entire mid-to-large codebase or a long agent session can fit into a single call, cutting down on the information fragmentation that chunking and retrieval introduce. The SWE-bench Pro/Multilingual scores suggest solid real-world software engineering competence with this setup, though not yet at the level of the closed frontier.

- If you're building long-horizon coding agents (large-repo comprehension, cross-file refactors, multilingual codebases): Hy4 preview's 1M context and Apache 2.0 open weights are worth putting on your evaluation shortlist, especially for teams that want to self-host and avoid single-vendor API lock-in
- If you're building office-automation or cross-document analysis agents: Tencent specifically calls out improvements in document/spreadsheet/presentation generation and financial analysis — a targeted optimization worth testing against your actual workflow
- Not a fit for: Tencent's own Known Limitations section admits the model "overthinks" and over-verifies its own work, which drags out latency; combined with this being an early preview release that Tencent says still has significant headroom, this isn't the pick yet for low-latency real-time responses or production settings with strict stability requirements — better to wait and watch the eventual full release

## Today's Takeaway

Tencent's disclosure that the model helped optimize its own training and inference pipeline is more worth noting than the raw benchmark scores. It's not just automated suggestions for training methods and evaluation frameworks — the model autonomously analyzed its own inference system's bottlenecks, applied operator fusion and communication optimizations, and the result was a quantified 31.8% throughput gain. That's "AI helping train the next AI" moving from a research paper's proof of concept into an actual production pipeline at a major lab — and the first company to put a concrete number on it publicly wasn't a Silicon Valley lab, it was Tencent.

## References

- [Tencent official press release: Tencent Releases and Open-Sources Tencent Hy4 preview](https://www.tencent.com/tencent-releases-and-open-sources-tencent-hy4-preview/)
- [HuggingFace model card: tencent/Hy4-preview](https://huggingface.co/tencent/Hy4-preview)
- [GitHub: Tencent-Hunyuan/Hy4-preview](https://github.com/Tencent-Hunyuan/Hy4-preview)
- [TechNode: Tencent open-sources Hy4 preview with 770B parameters and a 1M-token context](https://technode.com/2026/08/28/tencent-open-sources-hy4-preview-with-770b-parameters-and-a-1m-token-context/)
- [BenchLM.ai: Hy4 preview Benchmarks & Context](https://benchlm.ai/models/hy4-preview)
- [HuggingFace model card: tencent/Hy3-preview (prior-generation comparison)](https://huggingface.co/tencent/Hy3-preview)
- [Toolworthy: Tencent Hy3 / Hy4 Preview Review (source for Hy3's SWE-bench Verified and Terminal-Bench 2.0 scores)](https://www.toolworthy.ai/tool/tencent-hy)
