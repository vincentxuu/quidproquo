---
title: "Condition Injection: The Roles of Attention, DiT, and Q-Former | CMU 10-423 Topic Guide"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, multimodal, attention, diffusion-transformer, diffusion-model, image-generation]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 45
tldr: "Cross-attention reads another representation, DiT is a diffusion-backbone choice, and Q-Former uses learned queries to extract or bridge information. They can coexist rather than being three competing products. The Lecture 14 lesson handles Prompt-to-Prompt and classifier-free guidance in detail."
description: "Cross-attention reads another representation, DiT is a diffusion-backbone choice, and Q-Former uses learned queries to extract or bridge information. They can coexist rather than being three competing products. The Lecture 14 lesson handles Prompt-to-Prompt and classifier-free guidance in detail."
draft: false
glossary:
  - term: "Q-Former"
    definition: "BLIP-2's Querying Transformer: a small set of learnable query vectors uses cross-attention to pull a fixed number of features out of a frozen image encoder and hands them to a frozen LLM."
    context: "The topic of L15 and the module HW4's programming part asks you to implement."
  - term: "Prompt-to-Prompt"
    definition: "An image-editing method by Hertz et al. (2022) that controls cross-attention while changing a prompt to preserve parts of the spatial layout. Results depend on token alignment, selected layers, and timesteps; unchanged pixels or backgrounds are not guaranteed."
    context: "L14 uses it to show what cross-attention weights are good for."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-cross-attention-dit-qformer)

**Video status: recordings require login or course authorization.** [Recording source](#course-video-sources)

Cross-attention reads another representation, DiT is a diffusion-backbone choice, and Q-Former uses learned queries to extract or bridge information. They can coexist rather than being three competing products. The Lecture 14 lesson handles Prompt-to-Prompt and classifier-free guidance in detail.

## Choose a lesson

- [Cross-attention and DiT](/posts/ai/2026-10-11-cmu10423-lecture-14-cross-attention-dit-en): work through its mechanism, example, and answer criteria.
- [Q-Former bridging](/posts/ai/2026-10-11-cmu10423-lecture-15a-qformer-en): work through its mechanism, example, and answer criteria.
- [Assignment 4](/posts/ai/2026-09-30-cmu10423-hw4-qformer-text-to-image-en): work through its mechanism, example, and answer criteria.

The [course map](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en) lists the core path. This page is a topic guide, not an additional lecture. Choose the question you need to answer and follow its lesson.

## A worked comparison

Teaching shapes: four image-latent positions, three text tokens, hidden width two. With image Q and text K/V, QKᵀ has shape 4×3; multiplying normalized weights by V of shape 3×2 produces 4×2. A Q-Former with two learned queries reading four image features instead uses a 2×4 attention map and produces 2×2. Query count determines output positions. BLIP-2 image-to-LLM flow and HW4 text-to-DiT flow are separate designs, not one concatenated pipeline.

## Check your understanding

If text length grows from three to five, do output positions grow from four to five?

<details>
<summary>Answer and criterion</summary>

No. The map becomes 4×5 and V becomes 5×2; output remains 4×2 because Q still has four positions.

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
- [Course schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html) — L14 (Mar 9), L15 (Mar 11), Quiz 4 coverage
- [Lecture 14 slides: Cross-Attention / Diffusion Transformer / Prompt-to-Prompt](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture14-ldm-dit-p2p.pdf) ([inked version](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture14-ldm-dit-p2p-ink.pdf))
- [Lecture 15 slides: Querying Transformer / Scaling Laws](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture15-querying-scaling.pdf)
- [HW4 handout (hw4.zip)](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw4.zip) — the GPT-2 / DiT / Q-Former setup in the programming part
- [Ho & Salimans 2022: Classifier-Free Diffusion Guidance](https://arxiv.org/abs/2207.12598)
- [Peebles & Xie 2022: Scalable Diffusion Models with Transformers (DiT)](https://arxiv.org/abs/2212.09748)
- [Hertz et al. 2022: Prompt-to-Prompt Image Editing with Cross Attention Control](https://arxiv.org/abs/2208.01626)
- [Avrahami et al. 2021: Blended Diffusion for Text-driven Editing of Natural Images](https://arxiv.org/abs/2111.14818)
- [Li et al. 2023: BLIP-2](https://arxiv.org/abs/2301.12597)
- [Pan et al. 2025: Transfer between Modalities with MetaQueries](https://arxiv.org/abs/2504.06256)
- [Jaegle et al. 2021: Perceiver IO](https://arxiv.org/abs/2107.14795)
