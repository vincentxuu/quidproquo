---
title: "MIT 6.5940 L18 Efficient Diffusion Models: Save on Steps, Resolution, and Compute per Step"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, ai-course, mit, diffusion, efficient-ml, quantization]
lang: en
series:
  name: "Reading MIT 6.5940"
  order: 21
tldr: "Diffusion is slow because one large network runs dozens to thousands of times, starting from pure noise. Lecture 18 first covers DDPM, conditioning, latent diffusion, SDEdit, and DreamBooth, then attacks the cost three ways: fewer steps (DDIM skips steps, progressive distillation halves the step count each round), less compute per step (DC-AE compresses images 64x, recomputing only the edited 1.7% region cuts MACs 8.2x, SVDQuant runs FLUX in 4-bit), and more devices (DistriFusion is up to 6.1x faster on 8 A100s)."
description: "A guide to Lecture 18 of MIT 6.5940 Fall 2024, Diffusion Model: DDPM's forward noising and reverse denoising, three ways to inject conditions and classifier-free guidance, latent diffusion with DC-AE and Sana, SDEdit and DreamBooth, then DDIM, progressive distillation, SIGE spatially sparse inference, SVDQuant 4-bit quantization, and DistriFusion multi-GPU parallelism."
draft: false
glossary:
  - term: "classifier-free guidance"
    aliases: ["CFG"]
    definition: "At every step, one diffusion model makes a conditional and an unconditional prediction and combines them as (ω+1)ε(x,t,c) − ωε(x,t). Larger ω follows the condition more closely at the cost of diversity. No separate classifier is needed, but compute per step doubles."
    context: "MIT 6.5940 Lecture 18 slides, pages 32–35."
  - term: "DDIM"
    aliases: ["Denoising Diffusion Implicit Models"]
    definition: "Keeps the model and loss trained by DDPM but swaps in a non-Markovian forward process, which makes sampling deterministic and lets you sample on a sub-sequence of timesteps (say, every 10th), cutting the step count sharply."
    context: "MIT 6.5940 Lecture 18 slides, pages 65–70; from Song et al., ICLR 2021."
  - term: "latent diffusion"
    aliases: ["LDM"]
    definition: "A pre-trained autoencoder first compresses the image into a smaller latent; diffusion adds and removes noise only in that latent, and the result is decoded back into an image. The Stable Diffusion family uses this design."
    context: "MIT 6.5940 Lecture 18 slides, pages 37–39; from Rombach et al., CVPR 2022."
---

> 🌏 [中文版](/posts/ai/2026-09-30-mit-65940-diffusion-efficiency)

**Video status: Videos included.** [Source details](#course-video-sources)

> **Version note**: This post is based on Lecture 18 (2024-11-07) of [MIT 6.5940 Fall 2024](https://hanlab.mit.edu/courses/2024-fall-65940). The main materials are [Lec18-Diffusion-Models.pdf](https://www.dropbox.com/scl/fi/f4end70haytw1nalboxp2/Lec18-Diffusion-Models.pdf?rlkey=emaxca812n2npb2rinq1nor64&st=ed3ziw4o&dl=0) (91 pages) and the [lecture recording](https://youtu.be/LXrqmQrscf0). Page numbers refer to PDF pages. Facts were checked against the official materials on 2026-09-30. Access level **A3**: slides and video are public; this lecture has no lab, so the only things out of reach are Canvas and Piazza.
>
> **Fall 2026 comparison**: The [F26 schedule](https://hanlab.mit.edu/courses/2026-fall-65940) splits Diffusion into two lectures (Part I on November 10, Part II on November 12) and drops the F24 GAN/Video/Point Cloud lecture. As of 2026-09-30, slides and video for both are still empty links.

**Series position**: Previous [Lectures 16–17: Efficient Vision Models — ViT, GANs, Video, and Point Clouds](/posts/ai/2026-09-30-mit-65940-efficient-vision-gan-video-pointcloud-en) | Next [Lectures 19–20: Distributed Training](/posts/ai/2026-09-30-mit-65940-distributed-training-en) | [Series overview](/posts/ai/2026-09-30-mit-65940-course-overview-en)

Picture yourself editing a photo with Stable Diffusion on a laptop. You only want to paint out a horse in the corner. When you hit generate, the model redraws the entire image from noise forty times, even though you touched less than 2% of the pixels. This lecture asks how much of that work is wasted.

The Lecture Plan on page 6 has three parts. Part one covers diffusion basics: DDPM, conditional generation, latent diffusion, image editing, personalization. Part two covers fast sampling: DDIM and distillation. Part three covers acceleration: sparsity, quantization, parallelism. You can find the first two parts in other courses. The third is almost entirely MIT HAN Lab's own research, and it is what this course adds.

## Course video sources
Rechecked against the live official course page on 2026-10-10: the lecture numbers and recording links match and the videos are public and embeddable.

```youtube
url: https://www.youtube.com/watch?v=LXrqmQrscf0
title: EfficientML.ai Lecture 18 - Diffusion Models (MIT 6.5940, Fall 2024)
```

Original videos: [EfficientML.ai Lecture 18 - Diffusion Models (MIT 6.5940, Fall 2024)](https://www.youtube.com/watch?v=LXrqmQrscf0)

Course and recording entries:

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)

Checked: 2026-10-10.

## Why it is slow: DDPM's two processes

Pages 9–18 cover [DDPM (Ho et al., NeurIPS 2020)](https://arxiv.org/abs/2006.11239). It has two processes running in opposite directions:

- **Forward process (fixed)**: add a little Gaussian noise to the data at each step until, by step T, it is close to pure noise.
- **Reverse process (learned)**: train a network to remove noise step by step and recover the data.

Training is cheap. Pages 14–15 derive a closed form for the forward process, so you can jump from x₀ to any xₜ in one shot. Each training step samples a random t, adds the matching noise, and asks the network to predict what noise was added, with an MSE loss (page 17).

Sampling is expensive. The sampling algorithm on page 18 is a loop counting down from T to 1, and **every step runs the full network**. Every acceleration method that follows goes after this loop: make it spin fewer times, make each spin cheaper, or have several GPUs spin it together.

<details>
<summary>The forward process in closed form (pages 14–15)</summary>

Each step is q(xₜ | xₜ₋₁) = 𝒩(xₜ; √(1−βₜ) xₜ₋₁, βₜI), where βₜ is a small predefined number that controls how fast noise is added.

Define αₜ = 1 − βₜ and ᾱₜ = α₁α₂…αₜ. Using the fact that the sum of two independent Gaussians is Gaussian and recursing, you get:

q(xₜ | x₀) = 𝒩(xₜ; √ᾱₜ x₀, (1 − ᾱₜ)I)

To sample, xₜ = √ᾱₜ x₀ + √(1 − ᾱₜ) ε with ε ~ 𝒩(0, I). βₜ is designed so ᾱ_T approaches 0, which makes x_T approximately standard Gaussian.
</details>

## Conditional generation: getting "cat" or a sentence into the network

Page 21 sorts conditions into three types, each with its own injection method:

| Condition type | Example | How it is injected (pages) |
|---|---|---|
| Scalar | class ID "cat" | encode and broadcast-add to the feature map (22), or use adaptive normalization to produce a scale and bias (23) |
| Text | "photo of a moon gate" | cross attention with the image as Q and text as K/V (24); SD3's joint attention (25); Black Forest Labs' single self attention (26) |
| Pixel-wise | semantic map, Canny edges | ControlNet: copy the downsampling stages to take the condition, and connect back through zero-initialized 1×1 convolutions (27–29) |

Once the condition is in, you still have to decide how strongly to follow it. Classifier guidance on pages 30–31 trains a separate classifier and adds its gradient during sampling. Raising ω from 1 to 10 drops FID from 33.0 to 12.0: better quality, less diversity. The downsides are that it only works for class conditions and needs an extra network.

[Classifier-free guidance (Ho & Salimans)](https://arxiv.org/abs/2207.12598) on pages 32–35 uses Bayes' rule to remove the classifier. The same model makes a conditional and an unconditional prediction, and the two are combined. It works for any condition type and needs no extra network. Next to the algorithm on page 34 the slide notes **double the FLOPs**: compute per step doubles. That is this course's angle; other courses usually discuss CFG only in terms of quality.

## Latent diffusion: shrink the image first

[Latent diffusion (Rombach et al., CVPR 2022)](https://arxiv.org/abs/2112.10752) on pages 37–39 is the first real efficiency move. A pre-trained VAE compresses the image into a smaller latent, diffusion runs only on the latent, and the result is decoded at the end. The slide sums it up as "simpler denoising, faster synthesis."

HAN Lab's next step is to compress much harder. [DC-AE](https://arxiv.org/abs/2410.10733) on pages 41–45 pushes spatial compression from SD-VAE's 8x to 64x. Page 42 is upfront about the difficulty: the higher the spatial compression, the harder the autoencoder is to train, and SD-VAE's reconstruction quality collapses at high ratios. DC-AE fixes this with two techniques: residual autoencoding, which adds shortcuts around the space-to-channel transform (page 43), and a three-phase decoupled high-resolution adaptation (page 44).

[Sana](https://arxiv.org/abs/2410.10629) on pages 46–50 puts the pieces together: DC-AE, a DiT with linear attention, and a small LLM as the text encoder. During training, several VLMs re-caption each image and captions are chosen by CLIP score (page 49). The step-by-step breakdown on page 50 is the slide worth studying:

| Added on top of the Sana baseline | Latency at 4096×4096 (A100) |
|---|---|
| Sana baseline | 469 s |
| + DC-AE | 41 s (11.4×) |
| + Linear DiT | 24 s |
| + Kernel fusion | 21 s |
| + Flow DPM-Solver | 9.6 s |

The reference point, Flux-dev, takes 1023 s, hence the 106x headline. At 1024×1024 the gap narrows to 25x (0.9 s vs 23.0 s). The biggest cut comes from the autoencoder, not the DiT itself.

## Editing and personalization: two applications that acceleration targets

[SDEdit](https://arxiv.org/abs/2108.01073) on pages 54–57 does stroke-based editing. It adds some noise to the image the user painted on, then runs the reverse process to get a natural-looking result. Keep this scenario in mind; SIGE later speeds up exactly this.

[DreamBooth](https://arxiv.org/abs/2208.12242) on pages 59–61 handles personalization. Given a few photos of a specific object and its class name, it fine-tunes a text-to-image model to learn a unique identifier (for example, "a [V] clock"), so you can place the object in any context. Page 61 names the limitation: **one fine-tuned model per subject**.

## Fewer steps: DDIM and progressive distillation

[DDIM (Song et al., ICLR 2021)](https://arxiv.org/abs/2010.02502) on pages 65–70 starts from an observation. DDPM training only uses two things: the diffusion kernel q(xₜ | x₀) and the noise-prediction loss. Could you swap in a **non-Markovian** forward process that keeps both, so the reverse process no longer has to go one step at a time?

You can. At each step DDIM estimates x̂₀ from the current xₜ, then computes x at the next timestep directly, which makes sampling deterministic (page 68). Since steps no longer have to be adjacent, you can walk a sub-sequence such as τ = [0, 10, 20, …, 1000] (page 69). The key point is that **no retraining is needed**; you take the DDPM model and swap the sampler. Page 70 adds why: DDPM's Gaussian reverse step only holds when βₜ is small, and DDIM does not rely on that assumption. The same page lists newer samplers such as DPM-Solver.

[Progressive distillation (Salimans & Ho, ICLR 2022)](https://arxiv.org/abs/2202.00512) on pages 72–73 goes a step further. Each round, a student learns to do two of the teacher's steps in one, and the student becomes the next round's teacher. The step count halves every round.

## Less compute per step: recompute only what changed

Back to the horse. The numbers on page 76: only 1.7% of the image is edited, yet vanilla Stable Diffusion still spends 1855G MACs per step for 40 steps. In the unedited regions, the feature maps barely change.

[SIGE (Li et al., NeurIPS 2022)](https://arxiv.org/abs/2211.02048) caches the original image's activations and recomputes only the blocks that changed, bringing each step down to 225G MACs, 8.2x less. Page 77 lists the implementation details: a tiling-based convolution that updates only active blocks, custom gather/scatter operations, and kernel fusion to cut overhead.

Fewer MACs do not guarantee lower latency, so page 78 measures real latency on an RTX 3090:

| Task | Edited area | MACs | Latency |
|---|---|---|---|
| Vanilla Stable Diffusion | — | 1855G | 369 ms |
| Inpainting | 11.6% | 514G (3.6×) | 95.0 ms (3.9×) |
| SDEdit editing | 2.9% | 353G (5.3×) | 76.4 ms (4.8×) |

This is the same lesson as [Lecture 3 on pruning](/posts/ai/2026-09-30-mit-65940-pruning-granularity-criteria-en): turning sparsity into speed takes dedicated kernels. Page 79 also shows an interactive demo on a MacBook Pro (M1 Pro GPU).

## Less compute per step: 4-bit diffusion

[SVDQuant](https://arxiv.org/abs/2411.05007) on pages 81–84 quantizes both weights and activations of a diffusion model to 4 bits. As with LLMs, the hard part is outliers. [Lecture 13 on LLM deployment](/posts/ai/2026-09-30-mit-65940-llm-deployment-en) covered SmoothQuant's idea of migrating activation outliers into the weights. Page 81 points out that after the migration, the weights become hard to quantize. SVDQuant adds one more step: an SVD splits off a low-rank branch (rank 32, kept in 16-bit) that absorbs the large weight values, and the remaining residual quantizes easily.

The low-rank branch adds memory traffic, so page 82 fuses it with the 4-bit compute into the same set of kernels. Page 83 reports a 3.5x speedup and 3.6x memory savings. Page 84 shows the quantized FLUX.1-dev still works with existing LoRA styles.

## More devices: DistriFusion

The last section (pages 86–90) tackles latency for a single high-resolution image. Timesteps depend on each other, so they cannot run in parallel. [Megatron-LM](https://arxiv.org/abs/2104.04473)-style tensor parallelism moves too much data because the activations are large (page 86).

[DistriFusion](https://arxiv.org/abs/2402.19481) splits the image into patches, one per GPU. The patches still need information from each other, and the key observation is that **inputs at adjacent timesteps are very similar** (page 87). So each GPU uses the previous step's activations for the cross-patch interaction, and communication becomes asynchronous, overlapped with compute (page 88).

The comparison on page 89 is convincing. The original takes 12.3 s on one GPU. Naively splitting into patches on 4 GPUs takes 3.14 s but draws duplicated subjects. DistriFusion on 4 GPUs takes 4.16 s (3.0x faster) without that artifact. Page 90, measured on A100s, shows higher resolutions use the GPUs better: at 3840×3840, 8 GPUs are up to 6.1x faster.

## What you can do after this lecture

- **Tonight**: take any diffusion pipeline you have, switch the scheduler to DDIM, cut the steps from 1000 to 50, and compare the output and time for the same seed. You will see firsthand that page 69's step skipping needs no retraining.
- Then set guidance scale to 1 (which turns CFG off) and check whether per-step time roughly halves. That is page 34's "double the FLOPs."
- For why diffusion can generate at all, plus flow matching and score matching theory, see the [MIT 6.S184 guide](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview-en). CFG is derived in [6.S184 Lecture 3b](/posts/ai/2026-09-30-mit-6s184-lecture-03b-classifier-free-guidance-en), and latent spaces and DiT are in [Lecture 4](/posts/ai/2026-09-30-mit-6s184-lecture-04-latent-spaces-architectures-en).

## Further reading

- An introductory take on diffusion: [CS231N Lecture 14: why adding and removing noise generates images](/posts/ai/2026-09-30-cs231n-generative-models-diffusion-en)
- The same outlier problem, solved for LLMs: [Lecture 13 on LLM deployment](/posts/ai/2026-09-30-mit-65940-llm-deployment-en), [Lecture 6 on PTQ and QAT](/posts/ai/2026-09-30-mit-65940-quantization-ptq-qat-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Live-checked the official course page: lecture numbers and recording links match and the videos are public, so the status is now “Videos included.”

## References

- [MIT 6.5940 Fall 2024 course page](https://hanlab.mit.edu/courses/2024-fall-65940) — Lecture 18 date, slides, and video links
- [MIT 6.5940 Fall 2026 course page](https://hanlab.mit.edu/courses/2026-fall-65940) — Diffusion split into Part I/II; materials not yet released
- [Lec18-Diffusion-Models.pdf (Fall 2024)](https://www.dropbox.com/scl/fi/f4end70haytw1nalboxp2/Lec18-Diffusion-Models.pdf?rlkey=emaxca812n2npb2rinq1nor64&st=ed3ziw4o&dl=0) — source of every page number and figure in this post
- [EfficientML.ai Lecture 18 - Diffusion Models (YouTube)](https://youtu.be/LXrqmQrscf0)
- [Ho et al., Denoising Diffusion Probabilistic Models (NeurIPS 2020)](https://arxiv.org/abs/2006.11239)
- [Ho & Salimans, Classifier-Free Diffusion Guidance](https://arxiv.org/abs/2207.12598)
- [Rombach et al., High-Resolution Image Synthesis with Latent Diffusion Models (CVPR 2022)](https://arxiv.org/abs/2112.10752)
- [Chen et al., DC-AE: Deep Compression Autoencoder for Efficient High-Resolution Diffusion Models](https://arxiv.org/abs/2410.10733)
- [Xie et al., Sana: Efficient High-Resolution Image Synthesis with Linear Diffusion Transformer](https://arxiv.org/abs/2410.10629)
- [Meng et al., SDEdit (ICLR 2022)](https://arxiv.org/abs/2108.01073)
- [Ruiz et al., DreamBooth](https://arxiv.org/abs/2208.12242)
- [Song et al., Denoising Diffusion Implicit Models (ICLR 2021)](https://arxiv.org/abs/2010.02502)
- [Salimans & Ho, Progressive Distillation for Fast Sampling of Diffusion Models (ICLR 2022)](https://arxiv.org/abs/2202.00512)
- [Li et al., Efficient Spatially Sparse Inference for Conditional GANs and Diffusion Models (NeurIPS 2022)](https://arxiv.org/abs/2211.02048) — SIGE
- [Li et al., SVDQuant: Absorbing Outliers by Low-Rank Components for 4-Bit Diffusion Models](https://arxiv.org/abs/2411.05007)
- [Li et al., DistriFusion: Distributed Parallel Inference for High-Resolution Diffusion Models](https://arxiv.org/abs/2402.19481)
- [Narayanan et al., Efficient Large-Scale Language Model Training on GPU Clusters Using Megatron-LM (SC 2021)](https://arxiv.org/abs/2104.04473)
