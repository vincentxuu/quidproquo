---
title: "Cross-Attention and DiT: How Conditions Enter a Denoiser | CMU 10-423 Lecture 14"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 20
draft: false
description: "A complete worked example and answered variations for Cross-Attention and DiT: How Conditions Enter a Denoiser."
---

> 🌏 [中文版](/posts/ai/2026-10-11-cmu10423-lecture-14-cross-attention-dit)

**Video status: recordings require login or course authorization.** [Sources](#course-video-sources)

This guide follows [CMU 10-423](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 public slides. Worked examples are original teaching additions.

## More than replacing a backbone

Text-to-image generation must connect words to positions being denoised. Review [attention](/posts/ai/2026-10-11-cmu10423-lecture-02-causal-attention-en) and [latent diffusion](/posts/ai/2026-10-11-cmu10423-lecture-12b-latent-diffusion-en). We will identify Q/K/V sources, calculate a readout, and separate DiT, CFG, and Prompt-to-Prompt.

Self-attention obtains Q/K/V from one sequence. Cross-attention obtains Q from the representation being updated and K/V from the condition it reads. Image latents can supply Q and text supplies K/V. The number of output positions follows Q, not the number of text tokens.

## One position reads two words

In an original one-dimensional head, √d=1. Let q=1, keys=[0,log 3], and values=[2,6]. Logits are [0,log 3], weights=[1/4,3/4], and output=5. Changing q to zero yields equal weights and output four. The text stays the same while the query changes how it is read.

This does not claim real models encode “red” and “bird” as single scalars. Multiple heads, projections, positions, and later layers add structure. An attention map can reveal associations but is not a complete causal explanation.

## DiT changes the backbone

[DiT](https://arxiv.org/abs/2212.09748) replaces a diffusion denoiser backbone with a Transformer over latent patches. Its conditioning designs include adaptive layer normalization. A Transformer backbone does not imply text cross-attention everywhere, and original class-conditioned DiT should be distinguished from text-conditioned extensions.

A toy 8×8×4 latent split into 2×2 patches gives sixteen tokens, each initially sixteen values before projection. Outputs are mapped back to patches and restored spatially. Using 4×4 patches gives four tokens, reducing full-attention pairs from 256 to sixteen. Patch information and projection sizes also change; this count alone says nothing about unchanged image quality.

## Two other control mechanisms

Using ε_guided=ε_uncond+s(ε_cond−ε_uncond), let unconditional prediction be two, conditional prediction one, and s=3. The guided result is −1; s=1 recovers the conditional prediction. Increasing guidance can reduce diversity or introduce distortions. Other sources use different parameter conventions, so define the formula first.

[Prompt-to-Prompt](https://arxiv.org/abs/2208.01626) controls cross-attention during prompt edits to preserve parts of the spatial arrangement. Changing a red bird to a blue bird can preserve bird-related attention while changing color conditioning. Token alignment, selected layers, and timesteps matter. This is not a guarantee that every pixel or background detail stays fixed, and it does not require retraining model weights.

## Check your understanding

Values [0,8] with the original weights produce six. Three text tokens still yield one output position for one query. In the CFG example, s=0 returns the unconditional prediction two. If an edited prompt tokenizes to a different length, blindly copying attention columns by index is invalid; map words and tokens appropriately. Continue to [Q-Former](/posts/ai/2026-10-11-cmu10423-lecture-15a-qformer-en), which uses a fixed set of queries to read a longer sequence.

## Course video sources

The [official Spring 2026 course site](https://www.cs.cmu.edu/~mgormley/courses/10423/) directs recordings to SCS Panopto. On 2026-10-12, anonymous retrieval returned an unloaded folder and a sign-in prompt, without playable classroom content. This establishes an access limit, not the absence of recordings. This guide uses public slides and linked primary papers; examples are original teaching additions, not a transcript. [Official recording folder](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22).

## References

- [CMU 10-423 Spring 2026 Lecture 14 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture14-ldm-dit-p2p.pdf)
- [Primary paper](https://arxiv.org/abs/2212.09748)
- [Official schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
