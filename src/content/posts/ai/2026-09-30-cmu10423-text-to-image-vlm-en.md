---
title: "Text-to-Image and VLMs: Generating Images versus Reading Them | CMU 10-423 Topic Guide"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, multimodal, text-to-image, latent-diffusion, vision-language-model, clip]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 44
tldr: "“Text plus images” does not specify the task. Text-to-image generation produces an image conditioned on text; a VLM may consume an image and produce an answer. Direction, output objective, and evaluation differ even when both use Transformers."
description: "“Text plus images” does not specify the task. Text-to-image generation produces an image conditioned on text; a VLM may consume an image and produce an answer. Direction, output objective, and evaluation differ even when both use Transformers."
draft: false
glossary:
  - term: "VQ-VAE"
    definition: "Vector-Quantized VAE: each vector the encoder outputs is replaced by its nearest neighbor in a codebook, turning an image into a sequence of discrete indices (image tokens) that a decoder turns back into an image."
    context: "L13 uses it to explain how a VLM can generate images as tokens."
  - term: "SigLIP"
    definition: "A CLIP variant that replaces the softmax in the contrastive loss with a pairwise sigmoid, so a large batch spread across machines doesn't need to exchange the full similarity matrix."
    context: "PaliGemma's image encoder."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-text-to-image-vlm)

**Video status: recordings require login or course authorization.** [Recording source](#course-video-sources)

“Text plus images” does not specify the task. Text-to-image generation produces an image conditioned on text; a VLM may consume an image and produce an answer. Direction, output objective, and evaluation differ even when both use Transformers.

## Choose a lesson

- [Text-conditioned generation](/posts/ai/2026-10-11-cmu10423-lecture-12b-latent-diffusion-en): work through its mechanism, example, and answer criteria.
- [Vision-language models](/posts/ai/2026-10-11-cmu10423-lecture-13-vision-language-en): work through its mechanism, example, and answer criteria.
- [Condition injection](/posts/ai/2026-10-11-cmu10423-lecture-14-cross-attention-dit-en): work through its mechanism, example, and answer criteria.

The [course map](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en) lists the core path. This page is a topic guide, not an additional lecture. Choose the question you need to answer and follow its lesson.

## A worked comparison

Teaching example: the prompt is “a red cup on a table.” A text-to-image system starts from a noisy latent, uses text conditioning, denoises, and decodes an image. A VLM starts with an existing picture, encodes visual features, bridges them into an LLM, and answers that the cup is red. The former needs image-content checks; the latter needs evidence that the answer is grounded in the supplied image. Replacing a red-cup input with a blue-cup image while holding the text fixed tests visual grounding, not image generation.

## Check your understanding

Does a VLM naming the right color prove it can generate that image?

<details>
<summary>Answer and criterion</summary>

No. Reading and generation use different output spaces and objectives. A multimodal system may support both, but each capability needs its own test.

</details>

## How to use this map

Before reading the answer, identify the inputs, what changes, and the outputs. Then complete the linked lesson’s variation. If two mechanisms seem identical, trace where their conditions or data paths diverge. This page checks relationships and boundaries; it does not replace the derivations, implementations, or evaluations in the individual lessons.

The source edition is Spring 2026. Teaching examples are not official assessments or reconstructed classroom speech. Recordings remain subject to course authorization.

## Course video sources

The [official Spring 2026 course site](https://www.cs.cmu.edu/~mgormley/courses/10423/) directs recordings to SCS Panopto. On 2026-10-12, the anonymous reader returned an unloaded folder and a sign-in prompt; it did not provide playable lecture content. This establishes an access limit, not the absence of recordings. This guide uses public written materials and provides no reconstructed classroom speech or original-audio transcript.

- [Official recording folder](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)

## Update Log

- 2026-10-11: Rebuilt the teaching scope, worked example, and self-check; retained the original URL and publication date.

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The login wall is confirmed (anonymous Panopto folder lists no videos and prompts sign-in); the official pages link no public YouTube version, so the status is unchanged.

## References

- [CMU 10-423/623/723 Generative AI (Spring 2026): home page](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Course schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html) — L12 (Feb 23), L13 (Feb 27), Quiz 4 coverage
- [Lecture 12 slides: DPO / Text-to-image / Latent diffusion](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture12-dpo-text2img.pdf)
- [Lecture 13 slides: Vision-language models](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture13-vlm.pdf) ([inked version](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture13-vlm-ink.pdf))
- [HW4 handout (hw4.zip)](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw4.zip) — written-section points
- [Bie et al. 2023: RenAIssance: A Survey into AI Text-to-Image Generation in the Era of Large Model](https://arxiv.org/abs/2309.00810) — source of the slides' timeline
- [Yu et al. 2022: Scaling Autoregressive Models for Content-Rich Text-to-Image Generation (Parti)](https://arxiv.org/abs/2206.10789)
- [Rombach et al. 2022: High-Resolution Image Synthesis with Latent Diffusion Models](https://arxiv.org/abs/2112.10752)
- [Radford et al. 2021: CLIP](https://arxiv.org/abs/2103.00020)
- [van den Oord et al. 2017: Neural Discrete Representation Learning (VQ-VAE)](https://arxiv.org/abs/1711.00937)
- [Beyer et al. 2024: PaliGemma](https://arxiv.org/abs/2407.07726)
- [Bai et al. 2023: Qwen-VL](https://arxiv.org/abs/2308.12966)
- [Liu et al. 2024: World Model on Million-Length Video And Language With Blockwise RingAttention (LWM)](https://arxiv.org/abs/2402.08268)
