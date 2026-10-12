---
title: "Q-Former: Bridging Frozen Models with Learned Queries | CMU 10-423 Lecture 15"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 21
draft: false
description: "A complete worked example and answered variations for Q-Former: Bridging Frozen Models with Learned Queries."
---

> 🌏 [中文版](/posts/ai/2026-10-11-cmu10423-lecture-15a-qformer)

**Video status: recordings require login or course authorization.** [Sources](#course-video-sources)

This guide follows [CMU 10-423](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 public slides. Worked examples are original teaching additions.

## Identify the direction of the bridge

[BLIP-2](https://arxiv.org/abs/2301.12597) connects a frozen image encoder to a frozen LLM through Q-Former. [Assignment 4](/posts/ai/2026-09-30-cmu10423-hw4-qformer-text-to-image-en) instead reads text representations and conditions a DiT. The querying idea is related, but the input/output direction differs. Review [VLMs](/posts/ai/2026-10-11-cmu10423-lecture-13-vision-language-en) and [cross-attention](/posts/ai/2026-10-11-cmu10423-lecture-14-cross-attention-dit-en). We will trace both paths and identify trainable components.

Queries are learned vectors, not the user's natural-language question. A fixed q queries can read m source tokens through cross-attention and exchange information through self-attention. This creates a fixed-size interface, not a lossless representation. Query count, width, and objectives determine the bottleneck.

## Two queries read an image

An original example starts with four width-six visual features. Two width-four queries read them through projections, producing a 2×4 output. A further projection to LLM width eight creates a 2×8 visual prefix. Output count follows the queries rather than the four source patches.

For one value coordinate [2,0,0,6], let query weights be [0.7,0.1,0.1,0.1] and [0.1,0.1,0.1,0.7]. Readouts are two and 4.4. Queries can extract different information, but this does not establish that they necessarily specialize in specific corners. Their learned division of labor requires evaluation.

## BLIP-2 has two training stages

Stage one trains Q-Former against a frozen image encoder with image–text contrastive learning, matching, and image-grounded text generation. Different objectives use different masks to regulate interaction between text and queries; do not assume every objective uses unrestricted bidirectional attention.

Stage two projects query outputs into a prefix for a frozen LLM and trains image-conditioned language generation. Q-Former and the connecting projection remain trainable. The frozen LLM usually still participates in differentiation with respect to its inputs so the prefix receives learning signals.

## Assignment 4 reverses the direction

In HW4, GPT-2 provides text features. Queries read them, and the resulting representation connects to DiT's conditioning interface for image generation. This is text→queries→image generation, rather than image→queries→language answers. BLIP-2's stage-one objectives are not automatically the assignment's losses; use the actual denoising specification.

The bridge includes learned queries, attention layers, and projections. Query count alone does not establish its parameter cost. Count all trainable parameters and test whether removing or shuffling conditions damages the relevant capability.

## Check your understanding

Increasing source tokens from four to sixteen leaves the query output 2×4, while the attention weight matrix changes from 2×4 to 2×16. Identical query weights produce identical readouts; more queries do not automatically capture more useful information. Falling answer loss with a gradient-free projector may reflect compensation elsewhere, so inspect both the gradient path and freeze settings. Continue with the [HW4 test](/posts/ai/2026-09-30-cmu10423-hw4-qformer-text-to-image-en).

## Course video sources

The [official Spring 2026 course site](https://www.cs.cmu.edu/~mgormley/courses/10423/) directs recordings to SCS Panopto. On 2026-10-12, anonymous retrieval returned an unloaded folder and a sign-in prompt, without playable classroom content. This establishes an access limit, not the absence of recordings. This guide uses public slides and linked primary papers; examples are original teaching additions, not a transcript. [Official recording folder](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22).

## References

- [CMU 10-423 Spring 2026 Lecture 15 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture15-querying-scaling.pdf)
- [Primary paper](https://arxiv.org/abs/2301.12597)
- [Official schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
