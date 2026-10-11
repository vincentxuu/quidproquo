---
title: "Model Card: Iris-3B"
date: 2026-10-12
category: daily
type: digest
tags: [ai-agent, model-release, daily, speridlabs, model-family-speridlabs]
lang: en
description: "Sperid Labs open-sources Iris-3B — a 3B diffusion model that skips the VAE and outputs pixels directly, matching Qwen-Image on text-to-image, but the paper openly admits depth estimation and image restoration didn't show the expected downstream edge"
tldr: "Iris-3B: published by Sperid Labs on 2026-10-07 (arXiv 2610.09450), a 3B-parameter pixel-space diffusion transformer plus a frozen 4B Qwen3-VL-4B-Instruct text encoder, generating pixels directly with no VAE or latent space; GenEval 0.798 and DPG-Bench 86.52 (both at 1024px), matching Qwen-Image on OneIG-EN; but after fine-tuning, monocular depth estimation (AbsRel 0.071) only ties the latent FLUX.2 Klein model, which still uses a VAE, and 4x image restoration (LPIPS 0.292/PSNR 20.68) fails to beat it — the paper itself admits it found no significant downstream advantage from the pixel-space generative prior; weights and training code are fully open under Apache 2.0"
series:
  name: "AI Model Tracker"
  order: 45
glossary:
  - term: "VAE (Variational Autoencoder)"
    def: "The compression/decoding module most mainstream diffusion models (Stable Diffusion, FLUX, etc.) use to squeeze a high-resolution image into a low-dimensional \"latent space\" before generation and decode it back to pixels afterward — it cuts compute cost substantially but loses some detail in the process"
---

> 🌏 [中文版](/posts/daily/2026-10-12-model-speridlabs-iris-3b)

## Model Info

| Field | Value |
|---|---|
| Model ID | `speridlabs/iris-3b` |
| Vendor | Sperid Labs |
| Parameters | 3B (pixel-space diffusion transformer) + a frozen 4B text encoder (Qwen3-VL-4B-Instruct) |
| Context Window | Not applicable (a pure image-generation / dense-prediction model, not a language model; default output is 1024×1024, about 1 megapixel) |
| Input Price (USD/1M tokens) | Not applicable (open weights, self-hosted only, no official hosted API; requires your own NVIDIA GPU/CUDA) |
| Output Price (USD/1M tokens) | Not applicable (same as above) |
| Open Source | Yes (Apache 2.0; the frozen text encoder, Qwen3-VL-4B-Instruct, carries over its own publisher's Apache 2.0 license) |
| Release Date | 2026-10-05 (HuggingFace weights published); the paper was submitted to arXiv on 2026-10-07 |
| Official Announcement | [arXiv 2610.09450](https://arxiv.org/abs/2610.09450) |
| HuggingFace | [speridlabs/iris-3b](https://huggingface.co/speridlabs/iris-3b) |
| Family | Sperid Labs's first public model (no predecessor) |

## Capability Highlights

- Skips the VAE and latent space entirely — the diffusion transformer outputs every pixel directly (each 16×16 patch is decoded back to pixels through a 4-block PiT pixel head); training runs through a 256→512→1024-pixel curriculum, 665K steps in total
- Text-to-image hits GenEval **0.798** and DPG-Bench **86.52** (both at 1024px, official evaluators), and matches Qwen-Image's overall OneIG-EN score (the paper doesn't name a specific competing version)
- Without any architecture change, the same backbone fine-tunes into a monocular depth estimator (AbsRel **0.071**, δ1 **0.946**, zero-shot mean over NYUv2/KITTI/ETH3D/ScanNet/DIODE, Marigold V2 protocol) and a 4x image restoration/upscaling model (LPIPS **0.292**, PSNR **20.68**, DIV2K validation set)
- Weights, training code, and the paper are all public (Apache 2.0); it also ships fine-tuned depth and upscaling checkpoints plus a HuggingFace Space demo you can try without a GPU

## Benchmark Results

| Benchmark | Iris-3B | Comparison | Result |
|---|---|---|---|
| GenEval (1024px) | 0.798 | — | Self-reported, official evaluators |
| DPG-Bench (1024px) | 86.52 | — | Self-reported, official evaluators |
| OneIG-EN (1024px) | Tied | Qwen-Image (version unspecified) | Self-reported, no specific score disclosed |
| Monocular depth AbsRel (5-dataset zero-shot mean) | 0.071 | Native latent FLUX.2 Klein (tied) / converted-to-pixel FLUX.2 Klein (trails Iris-3B) | Marigold V2 protocol |
| 4x restoration LPIPS/PSNR (DIV2K) | 0.292/20.68 | Native latent FLUX.2 Klein fine-tune (neither pixel-space version beats it) | Self-reported |

⚠️ All numbers above are self-reported by Sperid Labs; no independent third-party reproduction has surfaced yet. The paper's own headline finding is itself a negative result: dropping the VAE showed no significant advantage on either depth estimation or image restoration.

## Comparison with Predecessor/Competitors

This is Sperid Labs's first public release, so there's no predecessor to compare against — the comparisons come from the paper's own two control groups: a native latent model, FLUX.2 Klein base 4B, and that same FLUX.2 Klein converted into pixel space. Starting with text-to-image: tying Qwen-Image on OneIG-EN and posting respectable GenEval/DPG numbers shows that the first half of the hypothesis holds — dropping the VAE to output pixels directly doesn't cost you quality.

But the paper's real point — that a pixel-space model, free of the VAE's lossy compression, should have an edge on downstream tasks where fine detail matters — doesn't hold up. After fine-tuning, depth estimation only ties the latent (VAE-based) FLUX.2 Klein, and 4x image restoration doesn't even beat it. Converting an existing FLUX.2 Klein into pixel space (rather than pretraining from scratch like Iris-3B) performs even worse — neither route validated the original hypothesis.

Both sides are open-weight, self-hosted, with no official API, so the real comparison is hardware cost: Iris-3B needs an NVIDIA GPU with CUDA, about 12GB of weights just for text-to-image, with another 12GB each for the depth and upscaling checkpoints. Running 100 diffusion steps through a 3B model plus a 4B text encoder isn't light, and the authors don't give any inference-time or VRAM figures of their own.

## Implications for Agent Development

The biggest takeaway for agent developers here isn't "one more image model" — it's that this paper saves you a round of redundant validation. If you're weighing whether to swap your agent's vision-perception module for a VAE-free, pixel-space backbone — say, using a generative prior for depth estimation or image restoration — Sperid Labs has already run the controlled experiment and gotten a negative result, so you don't have to re-run the same test yourself.

- If you're building: a small, self-hosted image-generation agent that doesn't want closed-API billing (asset generation, prototype visualization) — Iris-3B is an Apache 2.0, 3B-parameter option that runs on a single data-center or high-end consumer GPU, and its OneIG-EN parity with Qwen-Image means the quality is usable
- If you're building: a pipeline that needs generation, depth, and restoration from one backbone without maintaining three separate architectures — Iris-3B demonstrates that "same architecture, separately fine-tuned" is a viable path
- Not a fit: any scenario betting that pixel space means better downstream vision performance — if your depth-estimation or image-restoration agent already runs a mature latent model (the FLUX family, DINOv2-style encoders), the paper gives you no reason to switch; also not a fit for low-latency interactive scenarios, since 100 diffusion steps plus downloading extra sub-models isn't a lightweight path

## Today's Takeaway

"A VAE is lossy compression, so removing it should buy you finer downstream detail" sounds like a reasonable assumption that barely needs testing — but Sperid Labs ran the actual controlled experiment (same data scale, same training steps, two different routes) and got "it works, but there's no edge." That's a reminder that architecturally "reasonable-sounding" assumptions are still just assumptions until someone runs the control. Choosing to publish a negative result honestly — instead of packaging "ties Qwen-Image on text-to-image" as a sweeping breakthrough — is itself worth noting more than the model's raw numbers.

## References

- [HuggingFace: speridlabs/iris-3b model card](https://huggingface.co/speridlabs/iris-3b)
- [arXiv 2610.09450: Iris-3B: Going Beyond the Latent with Pixel-Space Diffusion Training, Conversion and Fine-Tuning](https://arxiv.org/abs/2610.09450)
- [GitHub: speridlabs/iris-3b (training code)](https://github.com/speridlabs/iris-3b)
- [explainx.ai: Iris-3B deep dive (paper details and caveats)](https://explainx.ai/blog/sperid-iris-3b-pixel-space-image-model-no-vae-2026)
- [AI Weekly: SperidLabs Scales Iris-3B to 3B, Finds No Downstream Edge](https://aiweekly.co/alerts/speridlabs-scales-iris-3b-to-3b-finds-no-downstream-edge)
- [Sperid Labs official research page](https://speridlabs.com/research/iris)
