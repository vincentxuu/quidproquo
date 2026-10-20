---
title: "Model Card: Muse Spark Open"
date: 2026-10-16
category: daily
type: digest
tags: [ai-agent, model-release, daily, meta, model-family-muse-spark]
lang: en
description: "Meta's first open-weight flagship: an 816B/42B MoE with 1M context that tops agentic benchmarks on Meta's own table, but trails GLM 5.3 and Kimi K3 on raw intelligence"
tldr: "Muse Spark Open: weights released 2026-10-15, an 816B total / 42B active MoE with a native multimodal Perception Encoder and a 1,048,576-token context window. Third-party API pricing is $1.25 input / $4.25 output per 1M tokens ($0.15 cached input) — identical to the closed Muse Spark 1.2 from two months earlier. In Meta's own comparison table, Muse Spark Open tops every listed model on JobBench (61.8) and MCP-Atlas (89.2), but scores only 39 on the AA Intelligence Index, behind GLM 5.3 (45) and Kimi K3 (44). It's also the first model of its size to run fully on two Apple M5 Ultra Mac Studios via MLX."
series:
  name: "AI Model Tracker"
  order: 48
glossary:
  - term: "Muse Spark Open"
    def: "Meta Superintelligence Labs' open-weight flagship released October 15, 2026 — 816B total parameters, 42B active, the first large Muse-family model to ship with public weights"
  - term: "Artificial Analysis Intelligence Index"
    def: "A composite intelligence score computed by third-party evaluator Artificial Analysis across many benchmarks; the question set and model pool are continuously recalibrated, so scores from different time periods are not directly comparable"
---

> 🌏 [中文版](/posts/daily/2026-10-16-model-meta-muse-spark-open)

## Model Info

| Item | Value |
|---|---|
| Model ID | No single official ID — each inference platform uses its own route name (e.g. OpenRouter's `meta/muse-spark-open`, Hugging Face's `meta-models/Muse-Spark-Open-816B-A42B`) |
| Vendor | Meta (Meta Superintelligence Labs) |
| Parameters | 816B total / 42B active (Mixture-of-Experts, 256 experts, 8 activated per token) |
| Context Window | 1,048,576 tokens |
| Input Pricing (USD/1M tokens) | $1.25 (cached input $0.15) |
| Output Pricing (USD/1M tokens) | $4.25 |
| Open Source | Yes (Muse Model License — a custom license requiring a separate agreement with Meta only for Model-as-a-Service businesses with aggregate annual revenue above $20M; everything else, including commercial use, is free) |
| Release Date | 2026-10-15 |
| Official Announcement | [Meta AI Research: Introducing Muse Spark Open](https://research.meta.ai/blog/muse-spark-open) |
| Hugging Face | [meta-models/Muse-Spark-Open-816B-A42B](https://huggingface.co/meta-models/Muse-Spark-Open-816B-A42B) |
| Family | Muse (previous closed flagship Muse Spark 1.2 → this generation's first open-weight release, Spark Open; Meta's closed frontier line Muse Wonder/Wonder Full shipped the same week) |

## Key Capabilities

- An 816B/42B MoE paired with a native multimodal Perception Encoder (1.8B parameters, handling text, image, video, and audio input) — Meta calls it "the most capable US open-weight model to date"
- In Meta's own comparison table, it tops every listed model — including closed-weight Kimi K3 and GLM 5.3 — on two agentic benchmarks: JobBench (61.8) and MCP-Atlas (89.2)
- The first model of its size to run entirely on two Apple M5 Ultra Mac Studios via MLX, using 1.2TB/s of memory bandwidth and a combined 1TB of unified memory to act as one machine
- Clear safety post-training gains: 99.2% refusal rate on Meta's internal cybersecurity jailbreak benchmark, 94.8% aggregated across PolyGuard/RedCode/CyberBench 2024 — far above Kimi K3's 75.5%/70.2% on the same table

## Benchmarks

| Benchmark | Muse Spark Open | Predecessor / Reference | Strongest Competitor (Meta's table) |
|---|---|---|---|
| AA Intelligence Index | 39 | Closed Muse Spark 1.2: 57 (⚠️ see caveat below — not directly comparable) | GLM 5.3: 45 |
| JobBench (agentic) | **61.8** | Not tested | Kimi K3: 54.3 (Muse Spark Open's own highest) |
| MCP-Atlas (agentic) | **89.2** | Not tested | Kimi K3: 82.3 (Muse Spark Open's own highest) |
| Terminal-Bench 2.1 | 76.4 | Closed Muse Spark 1.2's Terminal-Bench v2.1: 80% (different agent harness, reference only) | Kimi K3: 85.0 |
| StrongREJECT v2 (jailbreak test, lower is safer) | **0.5** | Not tested | Kimi K3: 66.6 |

⚠️ The AA Intelligence Index is continuously recalibrated by Artificial Analysis as its question set and model pool grow. Muse Spark 1.2's score of 57 (August 2026) and Muse Spark Open's 39 (October 2026) are separated by nearly two months and different question-set versions, so this is not a straightforward "18-point regression." All figures above are either Meta's own or Artificial Analysis's existing published scores; independent reproduction specific to Muse Spark Open is still pending.

## Compared to the Predecessor / Competitors

Muse Spark Open isn't simply "the next version" — it's the first time Meta has published weights for a large flagship model at all. Compared to the closed frontier line released the same week, Muse Wonder/Wonder Full (October 12, 1M context, $4/$20), the two serve different purposes: Wonder targets maximum intelligence, while Spark Open targets "open, downloadable, runs on your own hardware." The two also differ by roughly an order of magnitude in disclosed scale — Wonder's parameter count was never published, while Spark Open's 816B/42B is public.

Against other open-weight models, an AA Intelligence Index of 39 trails GLM 5.3 (45) and Kimi K3 (44), and even Qwen3.8-2.4T-A95B (40) — meaning it isn't the strongest open-weight model on raw single-task intelligence. But on agentic benchmarks it tops every model in Meta's own table, suggesting this generation's training emphasis was long-horizon agent execution rather than single-question accuracy. The safety gap is even more pronounced: cybersecurity jailbreak refusal rates of 99.2%/94.8% far exceed Kimi K3's 75.5%/70.2%, and a StrongREJECT v2 score of just 0.5 (lower is safer) sits well below the 62.9–86.4 range of the other models in the table.

On pricing, third-party platforms like Together AI and OpenRouter list it at $1.25 input / $4.25 output (cached input $0.15) — identical to the closed Muse Spark 1.2 from two months earlier. Meta carried the old closed product's rate card straight over to the open-weight release, so developers already on the Spark line pay nothing extra to switch.

## What This Means for Agent Development

If you're building agents that need self-hosted or on-premises deployment (data privacy, regulatory constraints): Muse Spark Open is currently the open-weight model with the highest agentic benchmark scores (topping JobBench and MCP-Atlas on Meta's own table), and the Muse Model License's commercial terms (a separate agreement is needed only above $20M in annual revenue) impose essentially no licensing burden on small-to-mid-size deployments.

If you're building long-horizon, multi-step coding agents: scores of 76.4 on Terminal-Bench 2.1 and 60 on DeepSWE 1.1 aren't the highest among open-weight models (Kimi K3 scores higher), but the model natively supports mainstream inference frameworks — SGLang, vLLM, TensorRT-LLM, llama.cpp — plus Meta's own Helion GPU kernel optimizations (1.03–3.95x speedups on NVIDIA/AMD), which lowers the bar for actually deploying it.

If you're chasing pure benchmark-accuracy use cases: an AA Intelligence Index of 39 trails GLM 5.3 and Kimi K3, so it isn't the first choice there; Meta itself recommends deploying it inside a broader system with guardrails rather than standalone.

Not a fit: consumer hardware. Even the NVFP4-quantized version needs 700GB of VRAM, and BF16 needs 2TB; the MLX path still requires two top-spec Mac Studios. The barrier for individual developers or small teams remains high.

## Today's Takeaway

An open-weight model's claim to being "the strongest" often only holds along a specific axis. Muse Spark Open tops Meta's own agentic benchmark table (JobBench/MCP-Atlas), yet its raw intelligence score (AA Intelligence Index 39) trails both GLM 5.3 and Kimi K3. When you see a claim like "the strongest open-weight model," check which dimension that claim is actually about before assuming it leads across the board.

## References

- [Meta AI Research: Introducing Muse Spark Open, The Most Capable US Open-Weight Model to Date](https://research.meta.ai/blog/muse-spark-open)
- [Hugging Face: meta-models/Muse-Spark-Open-816B-A42B model card](https://huggingface.co/meta-models/Muse-Spark-Open-816B-A42B)
- [Unite.AI: Meta's 816B-Parameter Muse Spark Open Weights Are Now Public](https://www.unite.ai/metas-816b-parameter-muse-spark-open-weights-are-now-public/)
- [VentureBeat: Meta unveils Muse Spark Open, the new top U.S. open weights model](https://venturebeat.com/technology/meta-unveils-muse-spark-open-the-new-top-u-s-open-weights-model-and-it-runs-on-two-paired-mac-desktops)
- [TechCrunch: Meta launches an open-weight AI model that runs on Macs](https://techcrunch.com/2026/10/15/meta-launches-an-open-weight-model-that-runs-on-macs/)
- [OpenRouter: Muse Spark Open API Pricing & Providers](https://openrouter.ai/meta/muse-spark-open)
- [quidproquo: Model Card — Muse Spark 1.2 (previous closed-weight version)](/posts/daily/2026-08-24-model-meta-muse-spark-1-2-en)
