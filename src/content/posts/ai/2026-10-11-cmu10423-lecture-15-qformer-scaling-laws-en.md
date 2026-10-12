---
title: "Q-Former and Scaling Laws: Bridging Frozen Models, Allocating a Fixed Budget | CMU 10-423 Lecture 15"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 19
draft: false
description: "Trace Q-Former queries and two-stage training, then compute a model/data split under a fixed compute budget."
---

> 🌏 [中文版](/posts/ai/2026-10-11-cmu10423-lecture-15-qformer-scaling-laws)

**Video status: recordings require login or course authorization.** [Sources](#course-video-sources)

This guide follows [CMU 10-423](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 public slides. Worked examples are original teaching additions.

Lecture 15 has two halves. The first covers the Querying Transformer (Q-Former), which bridges two frozen models with a small set of learned queries. The second covers scaling laws: how to split a fixed compute budget between model size and data. The first half prepares you for [Assignment 4](/posts/ai/2026-09-30-cmu10423-hw4-qformer-text-to-image-en); the second leads into MoE, distributed training, and efficient inference in Lectures 16–18.

## Q-Former: Bridging Frozen Models with Learned Queries

### Identify the direction of the bridge

[BLIP-2](https://arxiv.org/abs/2301.12597) connects a frozen image encoder to a frozen LLM through Q-Former. [Assignment 4](/posts/ai/2026-09-30-cmu10423-hw4-qformer-text-to-image-en) instead reads text representations and conditions a DiT. The querying idea is related, but the input/output direction differs. Review [VLMs](/posts/ai/2026-10-11-cmu10423-lecture-13-vision-language-en) and [cross-attention](/posts/ai/2026-10-11-cmu10423-lecture-14-cross-attention-dit-en). We will trace both paths and identify trainable components.

Queries are learned vectors, not the user's natural-language question. A fixed q queries can read m source tokens through cross-attention and exchange information through self-attention. This creates a fixed-size interface, not a lossless representation. Query count, width, and objectives determine the bottleneck.

### Two queries read an image

An original example starts with four width-six visual features. Two width-four queries read them through projections, producing a 2×4 output. A further projection to LLM width eight creates a 2×8 visual prefix. Output count follows the queries rather than the four source patches.

For one value coordinate [2,0,0,6], let query weights be [0.7,0.1,0.1,0.1] and [0.1,0.1,0.1,0.7]. Readouts are two and 4.4. Queries can extract different information, but this does not establish that they necessarily specialize in specific corners. Their learned division of labor requires evaluation.

### BLIP-2 has two training stages

Stage one trains Q-Former against a frozen image encoder with image–text contrastive learning, matching, and image-grounded text generation. Different objectives use different masks to regulate interaction between text and queries; do not assume every objective uses unrestricted bidirectional attention.

Stage two projects query outputs into a prefix for a frozen LLM and trains image-conditioned language generation. Q-Former and the connecting projection remain trainable. The frozen LLM usually still participates in differentiation with respect to its inputs so the prefix receives learning signals.

### Assignment 4 reverses the direction

In HW4, GPT-2 provides text features. Queries read them, and the resulting representation connects to DiT's conditioning interface for image generation. This is text→queries→image generation, rather than image→queries→language answers. BLIP-2's stage-one objectives are not automatically the assignment's losses; use the actual denoising specification.

The bridge includes learned queries, attention layers, and projections. Query count alone does not establish its parameter cost. Count all trainable parameters and test whether removing or shuffling conditions damages the relevant capability.

### Check your understanding

Increasing source tokens from four to sixteen leaves the query output 2×4, while the attention weight matrix changes from 2×4 to 2×16. Identical query weights produce identical readouts; more queries do not automatically capture more useful information. Falling answer loss with a gradient-free projector may reflect compensation elsewhere, so inspect both the gradient path and freeze settings. After this lecture, continue with the [HW4 test](/posts/ai/2026-09-30-cmu10423-hw4-qformer-text-to-image-en).

## Scaling Laws: Allocating a Fixed Compute Budget

### Parameters and data are different resources

A scaling law is an empirical relationship among model size, data, and loss under specified training conditions. It helps plan experiments but does not guarantee that more parameters improve every task. Review [training objectives](/posts/ai/2026-10-11-cmu10423-lecture-03-training-decoding-en). We will compare configurations at fixed compute and identify the assumptions.

An illustrative fit is L(N,D)=L∞+A/N^a+B/D^b. N denotes parameters and D training tokens. Coefficients are measured, and changing tokenizer, architecture, optimization, or data distribution can change the relationship. Constants from one study are not universal.

### Calculate a fixed-budget example

These invented coefficients and units are for teaching. Approximate compute as C=6ND. A budget of 2400 implies ND=400. Let L=1+4/√N+4/√D. Configuration A uses N=40, D=10 and gives L≈2.8974. Configuration B uses N=20, D=20 and gives L≈2.7889. Under this model, a smaller model wins through a more balanced allocation.

Substitute D=400/N: increasing N forces D down. Symmetric coefficients make N=D=20 optimal here, but real exponents and coefficients need not be symmetric. C≈6ND is a rough dense-Transformer training estimate that omits some attention, communication, and implementation costs. It is not an inference-cost formula.

### Read empirical conclusions in context

[Kaplan et al.](https://arxiv.org/abs/2001.08361) and [Chinchilla](https://arxiv.org/abs/2203.15556) both study compute allocation but use different experimental configurations and reach different optimal allocations. Chinchilla shows that some contemporary large models could benefit from smaller models trained on more tokens at fixed training compute. It does not imply that small models always win or that any added data is useful.

Repeating low-quality data differs from adding diverse relevant data. Deduplication, filtering, and mixture composition change the learning signal. Repeated tokens are not automatically independent new information. Evaluation contamination can also create apparent gains unrelated to generalization.

### Training-optimal is not serving-optimal

A model trained once and served many times has an objective that includes inference cost. Additional training of a smaller model may lower later serving cost, but that requires assumptions about request volume, latency, and hardware. Training-compute optimality does not automatically minimize product cost.

For a small study, fix data and tokenizer, measure several N/D configurations, and record compute, validation loss, and convergence. Hold out some configurations from fitting. Two points can compare alternatives but cannot establish a general power law.

### Check your understanding

N=10, D=40 gives the same loss as configuration A because the invented formula is symmetric. Increasing the coefficient on the data term favors more D, but the optimum must be recalculated. A benchmark gain without a clean validation-loss change calls for checking evaluation and distribution before claiming a scaling result. Lecture 16 on [MoE](/posts/ai/2026-10-11-cmu10423-lecture-16-mixture-of-experts-en), which separates capacity from per-token computation.

## Course video sources

The [official Spring 2026 course site](https://www.cs.cmu.edu/~mgormley/courses/10423/) directs recordings to SCS Panopto. On 2026-10-12, anonymous retrieval returned an unloaded folder and a sign-in prompt, without playable classroom content. This establishes an access limit, not the absence of recordings. This guide uses public slides and linked primary papers; examples are original teaching additions, not a transcript. [Official recording folder](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22).

## References

- [CMU 10-423 Spring 2026 Lecture 15 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture15-querying-scaling.pdf)
- [Primary paper](https://arxiv.org/abs/2301.12597)
- [Official schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
- [Primary paper](https://arxiv.org/abs/2203.15556)
