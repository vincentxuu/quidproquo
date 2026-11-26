---
title: "Model Card: NVIDIA Nemotron-Labs-Sigma"
date: 2026-11-23
category: daily
type: digest
tags: [ai-agent, model-release, daily, nvidia, model-family-nemotron]
lang: en
description: "NVIDIA released Nemotron-Labs-Sigma, the first large-scale continuous diffusion language model family (3B/8B, 14 checkpoints). It moves text generation into a 16-dimensional continuous space, trading for controllable few-step distillation and self-speculative decoding speedups."
tldr: "Nemotron-Labs-Sigma: released 2026-11-12, 14 checkpoints across 3B and 8B sizes, open under the NVIDIA Nemotron Open Model License (commercial use allowed). Base context is 4,096 tokens, Instruct is 8,192 tokens; there's no official API — it requires a self-hosted CUDA GPU. The 8B base averages 71.16 on a 6-task suite, edging out the prior discrete-diffusion model NLD-8B's 70.22. An 8-step distilled checkpoint still holds 70.34, and self-speculative decoding runs 3.46x faster than pure autoregressive decoding on an NVIDIA GB200 (4.20x peak). The point isn't the scores — it's that a continuous space finally lets diffusion language models be reliably distilled and steered."
series:
  name: "AI Model Tracker"
  order: 80
glossary:
  - term: "continuous diffusion language model"
    def: "A language model that denoises in a low-dimensional continuous embedding space rather than a discrete token category space, making few-step distillation and trajectory steering easier than with traditional discrete diffusion models (e.g. LLaDA, Dream)"
  - term: "NFE (Number of Function Evaluations)"
    def: "The number of times a diffusion model calls its denoising network to generate one block; fewer calls mean faster generation but can cost quality"
---

> :globe: [中文版](/posts/daily/2026-11-23-model-nvidia-nemotron-labs-sigma)

## Model Info

| Field | Value |
|---|---|
| Model ID | `nvidia/Nemotron-Labs-Sigma-8B` (base) / `-8B-instruct` (instruct, the main entry point) / `-distill-8B-nfe{2,4,8,16}` (few-step distilled) / `-distill-spec-8B` (self-speculative); the 3B size ships the same four variants, for 14 checkpoints total across both sizes |
| Vendor | NVIDIA (Nemotron Labs, with Cornell University and Georgia Institute of Technology as research partners) |
| Parameters | 3B / 8B (Ministral-style decoder-only backbone: grouped-query attention, SwiGLU, rotary position embeddings) |
| Context Window | Base: 4,096 tokens; Instruct: 8,192 tokens (prompt plus generation) |
| Input price (USD/1M tokens) | No official API — open weights, self-hosted only |
| Output price (USD/1M tokens) | No official API — requires a CUDA GPU (Ampere, Lovelace, Hopper, or Blackwell) in bfloat16; CPU inference is not supported |
| Open source | Yes (NVIDIA Nemotron Open Model License, commercial and non-commercial use) |
| Release date | 2026-11-12 |
| Official announcement | [arXiv:2610.02665 — Large Language Continuous Diffusion Models](https://arxiv.org/abs/2610.02665) |
| Hugging Face | [nvidia/Nemotron-Labs-Sigma (collection, 14 checkpoints)](https://huggingface.co/collections/nvidia/nemotron-labs-sigma) |
| Family | Nemotron (NVIDIA's model family; the prior Nemotron Labs Dory line is autoregressive with speculative decoding, while Sigma is the family's first continuous diffusion language model line, extending the earlier discrete-diffusion model Nemotron-Labs-Diffusion / NLD) |

## Key Capabilities

- The paper calls it **the first large-scale (3B/8B) continuous diffusion language model family**: it denoises in a 16-dimensional continuous embedding space instead of a discrete token category space, addressing the trajectory-steering difficulty that discrete diffusion models like LLaDA and Dream face in high-dimensional categorical spaces
- **Block-parallel decoding** (default 64 tokens per block) with a **standard KV cache**: already-generated blocks are cached and reused, so only the current block needs repeated denoising — speed and quality trade off directly through the number of denoising steps (NFE)
- **Few-step distillation** (distribution matching) gives roughly 8x speedup on math and 4x on coding with almost no accuracy loss; the 8-step distilled 8B checkpoint (`distill-8B-nfe8`) still holds a 70.34 average, close to the 256-step teacher
- **Self-speculative decoding** (a diffusion head drafts a 32-token block, an autoregressive head verifies it) runs an average of 3.46x faster than pure autoregressive decoding on NVIDIA GB200 with SGLang, peaking at 4.20x (8B) / 3.18x (3B) — ahead of the discrete-diffusion predecessor NLD-8B's 3.04x

## Benchmark Performance

```diagram
title: 6-task average: continuous diffusion vs. discrete diffusion vs. autoregressive
desc: Nemotron-Labs-Sigma-8B base averages 71.16 on a 6-task suite, edging out the prior discrete diffusion model NLD-8B's 70.22 and the autoregressive baseline Qwen3-8B's 68.91.
caption: Figures from the official paper and Hugging Face model cards (NVIDIA's own benchmarks, as reported by Marktechpost); not yet independently replicated. Scale: baseline y=300, plot top y=60, domain 60-75, k=240/15=16, y = 300 - (score-60) * 16.
---
<svg viewBox="0 0 640 340">
  <text class="dg-small" x="64" y="32" dominant-baseline="central">Avg score</text>
  <line class="dg-grid" x1="72" y1="220" x2="612" y2="220"/>
  <line class="dg-grid" x1="72" y1="140" x2="612" y2="140"/>
  <text class="dg-small" x="64" y="220" text-anchor="end" dominant-baseline="central">65</text>
  <text class="dg-small" x="64" y="140" text-anchor="end" dominant-baseline="central">70</text>
  <text class="dg-small" x="64" y="300" text-anchor="end" dominant-baseline="central">60</text>

  <g class="dg-c-muted">
    <rect class="dg-bar dg-bar--soft" x="140" y="158.4" width="64" height="141.6"/>
    <rect class="dg-bar dg-bar--soft" x="480" y="140.0" width="64" height="160.0"/>
  </g>
  <rect class="dg-bar dg-c-accent" x="310" y="141.4" width="64" height="158.6"/>
  <line class="dg-axis" x1="72" y1="300" x2="612" y2="300"/>

  <text class="dg-sub" x="172" y="148" text-anchor="middle" dominant-baseline="central">68.91</text>
  <text class="dg-label dg-text--accent" x="342" y="131" text-anchor="middle" dominant-baseline="central">71.16</text>
  <text class="dg-sub" x="512" y="130" text-anchor="middle" dominant-baseline="central">70.22</text>

  <text class="dg-sub" x="172" y="320" text-anchor="middle" dominant-baseline="central">Qwen3-8B (AR)</text>
  <text class="dg-label dg-text--accent" x="342" y="320" text-anchor="middle" dominant-baseline="central">Sigma-8B (cont. diffusion)</text>
  <text class="dg-sub" x="512" y="320" text-anchor="middle" dominant-baseline="central">NLD-8B (discrete diff.)</text>
</svg>
```

| Metric | Sigma-8B (256-step DDPM) | 8-step distilled Sigma-8B | Prior NLD-8B (discrete diffusion) | AR baseline (Qwen3-8B) |
|---|---|---|---|---|
| 6-task average (GSM8K / Minerva / HumanEval / MBPP, etc.) | 71.16 | 70.34 | 70.22 | 68.91 |
| Instruct-variant 6-task average | 59.14 | — | 59.92 | — |
| GSM8K (Sigma-8B-instruct, 256 DDPM, official best) | 91.96 | — | — | — |
| AIME25 (Sigma-8B-instruct, same setup, weakest result) | 17.00 | — | — | — |
| Self-speculative decoding speedup vs. pure AR (GB200 + SGLang) | 3.46x (avg) / 4.20x (peak) | — | 3.04x | 1x (baseline) |

:warning: All figures above are from NVIDIA's own research team (the same numbers are relayed by the technical outlet Marktechpost); there is no independent third-party replication yet. The official recommended sampler settings are a 32-token block, 32 DDIM steps, guidance scale 3, and temperature 0.3 — scores shift under different sampling settings.

## Comparison with Predecessors and Competitors

Against its own family's predecessor, Sigma isn't just a rename — the computational space itself changed. NLD (Nemotron-Labs-Diffusion) denoises in a discrete token category space, like LLaDA and Dream; Sigma switches to a continuous 16-dimensional embedding space, making the denoising trajectory smooth and steerable by gradient. The base model's 6-task average of 71.16 is a small win over NLD-8B's 70.22. But the instruct variant actually trails: Sigma-8B-instruct's 59.14 falls short of NLD-8B-instruct's 59.92 — a sign that the continuous-space advantage seen in pretraining hasn't fully carried over to instruction tuning, a gap the paper doesn't gloss over.

Against the autoregressive baseline Qwen3-8B (68.91), Sigma-8B base is ahead by about 2.3 points — again not a blowout. Right now continuous diffusion's real selling point isn't crushing autoregressive accuracy; it's the structural speedups unique to the continuous space: 8x on math and 4x on coding from few-step distillation, and 3.46x from self-speculative decoding (ahead of NLD's 3.04x), because smooth trajectories degrade more gracefully at low step counts.

Pricing and go-to-market comparisons don't apply here — this is a research checkpoint. NVIDIA offers no hosted API, and no third-party inference platform has picked it up yet. The open license (NVIDIA Nemotron Open Model License) permits commercial use, but for now it only runs on self-hosted CUDA GPUs (Ampere or newer), with no quantized builds available.

## What This Means for Agent Development

The point of this release isn't "here's a new model you can drop into production" — it's that the diffusion-language-model speedup path has, for the first time, been systematically validated in a continuous space. Few-step distillation and self-speculative decoding both bear directly on agent-loop latency and throughput, not just accuracy numbers.

- **If you run high-concurrency, latency-sensitive tool-calling services with your own GPU infrastructure**: self-speculative decoding (a diffusion head drafting, an AR head verifying, with output that exactly matches greedy AR decoding) is worth tracking — it buys throughput with fewer forward passes, not by trading away correctness
- **If you're researching or evaluating the parallel-decoding path itself** — say, deciding whether to bet on diffusion LLMs over autoregressive ones — this paper is one of the few public sources that puts continuous and discrete diffusion head-to-head on the same benchmark suite
- **Not a good fit for**: any production deployment. A 4,096/8,192-token context window is far below the million-token context of today's flagship models, there's no official API, and there are no quantized or CPU-inference options yet. At this stage it's only practical for research teams with their own GPU clusters to evaluate

## Today's Takeaway

What's actually interesting about continuous diffusion language models isn't "diffusion models can write code too" — it's that it finally brings a trick image-diffusion models have used for years — gradient-based guidance and few-step distillation in a continuous space — systematically into text generation. Diffusion LLMs used to be pitched as an autoregressive alternative but got stuck because discrete token spaces can't be smoothly interpolated the way image pixels can. Sigma shows that once that constraint is lifted, few-step distillation (8x speedup) and self-speculative decoding (3.46x) actually work — which suggests the performance ceiling for diffusion language models may not be the algorithm itself, but the representation space it's built on.

## References

- [arXiv:2610.02665 — Large Language Continuous Diffusion Models (official paper, NVIDIA / Cornell / Georgia Tech)](https://arxiv.org/abs/2610.02665)
- [Hugging Face Collection: nvidia/Nemotron-Labs-Sigma (14 checkpoints)](https://huggingface.co/collections/nvidia/nemotron-labs-sigma)
- [Hugging Face model card: nvidia/Nemotron-Labs-Sigma-8B (base, architecture and license details)](https://huggingface.co/nvidia/Nemotron-Labs-Sigma-8B)
- [Hugging Face model card: nvidia/Nemotron-Labs-Sigma-8B-instruct (instruct variant, 8,192-token context)](https://huggingface.co/nvidia/Nemotron-Labs-Sigma-8B-instruct)
- [Marktechpost: NVIDIA AI Releases Nemotron-Labs-Sigma, A Continuous Diffusion Language Model With 14 Checkpoints At 3B/8B (benchmark figures compiled)](https://marktechpost.com/2026/11/20/nvidia-nemotron-labs-sigma-continuous-diffusion-language-model)
