---
title: "Model Card | Qwen-Image-2.1"
date: 2026-09-20
category: daily
type: digest
tags: [ai-agent, model-release, daily, qwen, model-family-qwen-image]
lang: en
description: "Alibaba's Qwen team open-sourced Qwen-Image-2.1 — a 7B visual generator with native transparent-image (RGBA) generation and editing plus up to 10 reference images; its self-reported Qwen-Image-Bench score of 60.28 edges out Nano Banana 2.0 and GPT Image 1.5"
tldr: "Qwen-Image-2.1 (Alibaba Qwen): open-sourced 2026-09-20, a 7B visual generation module (32-layer single-stream DiT) plus a Qwen3-VL 8B encoder, keeping the same 7B class as predecessor 2.0 but adding native transparent-image generation (64-channel RGBA VAE) and multi-image editing with up to 10 reference images; Qwen's own Qwen-Image-Bench score is 60.28, ahead of Nano Banana 2.0 (59.82) and GPT Image 1.5 (59.65) ⚠️ self-reported, not independently reproduced; the SGLang team independently verified a single-sample RGBA PSNR of 60.69 dB; licensed under the Qwen Research License Agreement, non-commercial only, with no official hosted API pricing; for agent development it can remove a separate background-removal/compositing step, making it a fit for e-commerce asset generation and multi-scene storyboard workflows"
series:
  name: "AI Model Tracker"
  order: 27
glossary:
  - term: "Qwen-Image"
    def: "Alibaba's Qwen image generation and editing model series — a 20B model debuted in August 2025, then shifted to a lighter 7B design starting in February 2026"
  - term: "RGBA"
    def: "Red-Green-Blue-Alpha: an extra transparency (alpha) channel beyond the color channels, letting an image have partially or fully transparent regions for easier compositing"
---

> 🌏 [中文版](/posts/daily/2026-09-20-model-qwen-image-2-1)

## Model Info

| Field | Value |
|---|---|
| Model ID | `Qwen/Qwen-Image-2.1` |
| Vendor | Alibaba Qwen (part of Alibaba Cloud) |
| Parameters | 7B visual generation module (32-layer single-stream DiT) + Qwen3-VL 8B text/vision encoder (predecessor Qwen-Image 1.0 was 20B) |
| Context Window | Not applicable (image generation model; native 2K resolution = 2048×2048, accepts up to 10 reference images) |
| Input Pricing (USD/1M tokens) | Not disclosed (open weights under the Qwen Research License Agreement, non-commercial use only; no official hosted API; commercial licensing requires separate arrangement with no published rate) |
| Output Pricing (USD/1M tokens) | Not disclosed (same as above) |
| Open Source | Yes (Qwen Research License Agreement, non-commercial use only; predecessors Qwen-Image 1.0/2.0 used Apache-2.0) |
| Release Date | 2026-09-20 |
| Official Announcement | [QwenLM/Qwen-Image-2.1 (GitHub)](https://github.com/QwenLM/Qwen-Image-2.1) |
| HuggingFace | [Qwen/Qwen-Image-2.1](https://huggingface.co/Qwen/Qwen-Image-2.1) |
| Family | Qwen-Image series (Qwen-Image 1.0, 20B, 2025-08 → Qwen-Image-2.0, 7B, 2026-02 → Qwen-Image-2.1, 7B, this release) |

## Capability Highlights

- Native transparent-image (RGBA) generation and editing: a 64-channel RGBA VAE with 16x spatial compression makes the alpha channel part of the latent space itself, rather than something added by a separate background-removal pass afterward. The SGLang team independently verified a single-sample RGBA PSNR of 60.69 dB, and transparent PNG generation plus FP8-quantized configurations both passed correctness checks.
- Accepts up to 10 reference images for multi-subject compositional editing in a single pass, with circle-marking, freehand painting, or a separate mask to specify local edit regions while preserving fidelity for portraits and products.
- Mixed-granularity attention: text still uses a token-level causal mask, while image content switches to a chunk-level mask paired with a prefix KV cache — reference images and instructions are cached after the first denoising step and reused across the rest, with the biggest efficiency gains showing up on multi-image inputs.
- The visual generation module stays at the same 7B class as predecessor 2.0 rather than scaling up, yet Qwen's own Qwen-Image-Bench score of 60.28 edges out Nano Banana 2.0 (59.82) and GPT Image 1.5 (59.65) ⚠️.

## Benchmark Results

| Benchmark | Score | Predecessor | Best Competitor |
|---|---|---|---|
| Qwen-Image-Bench total ⚠️ | 60.28 | Did not participate (2.1 is the first version to publish a score on this benchmark; no 2.0 figure exists) | Nano Banana 2.0 59.82 / GPT Image 1.5 59.65 |
| RGBA transparency correctness (SGLang independent verification, single sample PSNR) | 60.69 dB | Not applicable (2.0 had no native transparent-image generation) | Not applicable (most closed-source competitors' transparency is a post-processing API parameter rather than native latent-space output, so the same metric doesn't apply) |

⚠️ The Qwen-Image-Bench total is Qwen's own self-reported result; neither the scoring method nor the comparison set has been independently reproduced, and as of publication Qwen-Image-2.1 does not yet appear on any independent image-model leaderboard. The RGBA PSNR figure comes from a single-sample test the SGLang team ran to verify their own inference-framework integration was correct — the team itself stresses this is a correctness check, not a general quality benchmark. Because this card was written within 24 hours of release, these two data points are all the verifiable quantitative numbers currently available, fewer than a typical model card — and that gap is itself the most notable takeaway from today.

## Comparison with Predecessor and Competitors

Qwen-Image-2.0 already cut the visual generation module from the original Qwen-Image 1.0's 20B down to 7B back in February 2026, built around native 2K resolution; per a summary from tech outlet WaveSpeed, Qwen claimed at the time that 2.0 beat the larger FLUX.1-dev (12B) on DPG-Bench. Version 2.1 doesn't push parameters further — instead it turns the same 7B-class model into a unified generate-edit-transparency pipeline: RGBA assets that used to require an external background-removal service are now a native part of the model's latent-space output.

Against closed-source competitors, the transparency feature makes for an interesting side-by-side comparison right now. GPT Image 2 only gained transparent output in August 2026 through a new `background: "transparent"` API parameter — essentially "ask the service to remove the background for you." Qwen-Image-2.1 instead bakes the alpha channel directly into the denoising process inside a 64-channel VAE latent space — the model itself understands transparency. Both routes converged on the same capability within a month of each other, but stability and controllability aren't necessarily equivalent: right now the only evidence backing Qwen-Image-2.1's transparent output is SGLang's single-sample correctness test, not a large-scale quality evaluation.

Pricing takes two entirely different paths too: GPT Image 2 is billed per token (image input at $8.00/1M tokens, image output at $30.00/1M tokens), while Qwen-Image-2.1 is a free local download — but at the cost of the Qwen Research License Agreement explicitly excluding commercial use. That's a step back in licensing compared to Qwen-Image 1.0/2.0, which both shipped under Apache-2.0; teams that want to use it commercially now need to negotiate separate terms with Qwen.

## Implications for Agent Development

Native transparent-image generation is a real pipeline simplification for agents that automate visual asset production: the old three-step flow — generate an image, call a separate background-removal model, clean up the edges — can now theoretically collapse into a single model call, cutting the maintenance cost and latency of intermediate services. The mixed-granularity attention design with a prefix KV cache also means that in an interactive editing scenario — feed in a batch of reference images, then make several rounds of local edits — repeated inference is cheaper than re-encoding the entire reference batch every time.

- If you're building an e-commerce asset generation agent: native transparent output lets you directly produce product PNGs ready for compositing, eliminating a standalone background-removal/compositing microservice, and it pairs well with existing product photography for local swaps like backgrounds or accessories.
- If you're building content production that needs strong character consistency (comic panels, ad storyboards, narrative boards): editing with up to 10 reference images fits a long "character sheet → multi-scene storyboard" pipeline better than competitors that mostly accept only 1-2 reference images.
- Not a fit: scenarios that need commercially deliverable output — the Qwen Research License Agreement explicitly excludes commercial use, so shipping its output in a commercial project carries real compliance risk, and a closed-source API with clear commercial terms is the safer choice. It's also not a fit for production environments that need independently verified quality guarantees, since only the vendor's self-reported score exists so far, with no third-party reproduction.

## Today's Takeaway

The competition among image models is shifting from "how pretty is a single picture" to "how many steps does the workflow already handle." Qwen-Image-2.1 and GPT Image 2 took two completely different technical routes — native latent-space alpha versus a post-processing API parameter — to arrive at the same transparent-image capability within a month of each other. That shows "native" and "parameter wrapper" can land at the same visible outcome, while the underlying stability, controllability, and maintenance cost differ substantially. That kind of "same capability, different implementation route" comparison is worth an extra beat of thought when evaluating whether to adopt a new model — more so than just comparing parameter counts or benchmark scores.

## References

- [QwenLM/Qwen-Image-2.1 official GitHub README](https://github.com/QwenLM/Qwen-Image-2.1)
- [Qwen/Qwen-Image-2.1 HuggingFace model page](https://huggingface.co/Qwen/Qwen-Image-2.1)
- [Qwen's official X/Twitter announcement](https://x.com/Alibaba_Qwen/status/2101659302792679789)
- [Sina Finance: 拿下開源生圖第一，千問 Qwen-Image-2.1 把生圖捲出新高度 (includes the Qwen-Image-Bench chart) (in Mandarin)](https://finance.sina.com.cn/tech/roll/2026-09-20/doc-inisnwyr2387502.shtml)
- [OrcaRouter: Qwen-Image-2.1 vs GPT Image 2 comparison (pricing, licensing, SGLang verification details)](https://www.orcarouter.ai/blog/qwen-image-2-1-vs-gpt-image-2)
- [RuntimeWire: Alibaba previews Qwen-Image-2.1 for character-consistent storyboards](https://runtimewire.com/article/alibaba-qwen-image-2-1-character-storyboard-editing-preview)
- [WaveSpeed Blog: What to Expect from Qwen Image 2.0 (predecessor spec and DPG-Bench claim)](https://wavespeed.ai/blog/posts/blog-what-to-expect-from-qwen-image-2-0-ai-image-generation/)
- [arXiv 2605.28091: Qwen-Image-Bench (benchmark paper)](https://arxiv.org/abs/2605.28091)
