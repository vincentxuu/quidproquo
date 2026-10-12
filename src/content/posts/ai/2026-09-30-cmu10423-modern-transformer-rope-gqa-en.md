---
title: "Modern Transformers: What Position Rotation and KV Sharing Change | CMU 10-423 Lecture 4"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, transformer, attention, pre-training, long-context]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 5
tldr: "Attention needs both order information and a manageable memory footprint during generation."
description: "A teaching guide based on public Spring 2026 materials: Modern Transformers: What Position Rotation and KV Sharing Change | CMU 10-423 Lecture 4"
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa)

**Video status: recordings require sign-in or course authorization.** This guide uses public slides and assignments; numerical examples are site-authored, not a lecture transcript.

Attention needs both order information and a manageable memory footprint during generation. This guide locates three modifications precisely: RoPE changes positional treatment of queries and keys, GQA shares keys and values, and local attention restricts visibility. The goal is to trace small vectors and cache sizes rather than describe everything as faster attention.

## Rotation makes a dot product depend on position difference

In one two-dimensional subspace, position m rotates a vector by mθ. R(mθ) preserves length but changes direction. A query at m and key at n have dot product qᵀR((n−m)θ)k because R(mθ)ᵀR(nθ)=R((n−m)θ). Their relative position enters the compatibility score.

For an original example, let θ=90° and q=k=[1,0]. The query at position 0 is [1,0], while the key at position 1 is [0,1], giving dot product zero. At the same position the product is one; separated by two positions it is negative one. Actual RoPE uses multiple frequencies across vector pairs, not a universal 90° angle.

Shift both positions by one: the vectors become [0,1] and [−1,0], whose product remains zero. This invariance requires consistent rotations and offsets. Rotating only Q, or assigning inconsistent offsets to Q and K, breaks the property. RoPE conventionally rotates Q/K, rather than requiring the same rotation of V.

RoPE is not simply adding a position index to an embedding. It also does not guarantee arbitrary context-length extrapolation; positions outside the training distribution may still fail.

## GQA reduces KV heads without removing query heads

In conventional multi-head attention, each query head has its own key/value head. GQA groups several query heads around a shared KV head, while each query still computes its own scores and weighted values. One KV head for all queries is MQA; equal query and KV head counts recover MHA.

Consider four query heads, dimension two per head, sequence length three, and batch one. MHA stores 24 elements for K and 24 for V, totaling 48. With two KV heads, GQA stores 12 each, totaling 24. At two bytes per element, this layer's KV cache shrinks from 96 to 48 bytes. These toy counts exclude weights, other activations, allocator overhead, and additional layers.

There are still four query outputs to concatenate. Reducing them to two changes the model dimension rather than implementing KV sharing. Permanently copying the stored KV cache back to four heads can produce correct arithmetic but defeat the intended storage reduction.

## Local attention restricts access

Causality excludes future positions. A local window additionally excludes distant past positions. If a window of two includes the current token, position three can access positions two and three, but not position one directly. Pair counts per layer fall from approximately T² to Tw. Earlier information may still travel through intermediate positions across layers.

Define window conventions explicitly. Some implementations count w previous tokens plus the current token; our example counts two in total. A boundary test without this convention is ambiguous. Local attention does not let every pair in a long document communicate directly in one layer.

## Architecture is distinct from the training stage

A RoPE/GQA architecture can be pretrained and later fine-tuned. GQA is not a fine-tuning data strategy. Lecture 3 separated parameter learning from token selection; this lesson changes the computation producing those distributions. When comparing architectures, also control data, model scale, and training budget rather than attribute every quality difference to a single named mechanism.

## Variations with answers

Keep four query heads and head dimension two, but use batch two, length five, and one KV head. K and V together contain 2×2×1×5×2=40 elements. Four KV heads would contain 160, so the theoretical cache size is one quarter. The query count remains four in both cases.

Move a query/key pair from positions 1 and 3 to 5 and 7. Does the ideal RoPE dot product change? No: both differences are two. This algebraic result is not a guarantee of equal model quality at unseen long positions.

Assignment 1 turns these distinctions into shape, mask, offset, and train/eval tests. Establish the correct data flow before interpreting GPU memory measurements.

[Previous](/posts/ai/2026-10-11-cmu10423-lecture-03-training-decoding-en) | [Next](/posts/ai/2026-09-30-cmu10423-hw1-mingpt-rope-gqa-en) | [Series overview](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en)

## Course Video Sources

The official recording index is on SCS Panopto. The anonymous folder view is unloaded and requests sign-in; this is an access limitation, not evidence that recordings do not exist. Original audio and subtitles require the appropriate course access.

- [Official Panopto recording index](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [Official course homepage](https://www.cs.cmu.edu/~mgormley/courses/10423/)

## References

- [Lecture 4 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture4-rope-gqa.pdf)
- [RoFormer](https://arxiv.org/abs/2104.09864)
- [GQA](https://arxiv.org/abs/2305.13245)
- [Longformer](https://arxiv.org/abs/2004.05150)
- [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
- [inked in-class version](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture4-rope-gqa-ink.pdf)
- [GQA](https://arxiv.org/pdf/2305.13245.pdf)
- [Longformer](https://arxiv.org/pdf/2004.05150.pdf)
- [RoFormer](https://arxiv.org/pdf/2104.09864.pdf)
- [ViT](https://arxiv.org/pdf/2010.11929.pdf)
- [Spring 2026 practice exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)
- [Lecture 5 slides (opening recap of modern Transformers)](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture5-cnn-vit.pdf)
- [HW1 handout (hw1.zip)](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw1.zip)
