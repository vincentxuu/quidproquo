---
title: "Efficient Inference: FlashAttention, KV Caches, and Speculative Decoding | CMU 10-423 Lecture 18"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 26
draft: false
description: "A complete worked example and answered variations for Efficient Inference: FlashAttention, KV Caches, and Speculative Decoding."
---

> 🌏 [中文版](/posts/ai/2026-10-11-cmu10423-lecture-18-efficient-inference)

**Video status: recordings require login or course authorization.** [Sources](#course-video-sources)

This guide follows [CMU 10-423](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 public slides. Worked examples are original teaching additions.

## Three methods address different costs

[FlashAttention](https://arxiv.org/abs/2205.14135) reduces attention memory traffic. KV caching avoids recomputing historical keys and values. [Speculative decoding](https://arxiv.org/abs/2211.17192) uses a cheap draft model to propose tokens for target-model verification. Review [attention](/posts/ai/2026-10-11-cmu10423-lecture-02-causal-attention-en) and [decoding](/posts/ai/2026-10-11-cmu10423-lecture-03-training-decoding-en). We will calculate blockwise normalization and acceptance probabilities.

Ordinary attention materializes n² score/weight pairs. FlashAttention tiles computation into fast local memory and maintains online normalization without writing the full matrix to HBM. It computes exact attention mathematically, subject to floating-point differences. It is not sparse attention and does not eliminate all quadratic arithmetic.

## Blockwise readout preserves the answer

Our original one-query example has logits [0,log 3] and values [2,6], giving full-softmax output five. After the first block, running maximum m=0, denominator l=1, and unnormalized weighted sum o=2. The second block changes the maximum to log 3. Rescale old accumulators by exp(−log 3)=1/3: l'=1/3+1=4/3 and o'=2/3+6=20/3. Their ratio is five.

Updating the maximum requires rescaling both accumulators. Normalizing each block independently and simply combining outputs is incorrect. Real kernels add tiling, parallel scheduling, and backward strategies to this online-normalization principle.

## Prefill, decode, and cache memory

Prefill processes the prompt; decode adds tokens step by step. Cached K/V let each new query read history without recomputing historical projections. For an original configuration with two layers, four KV heads, head dimension eight, length ten, and FP16, cache bytes are 2×2×4×8×10×2=2560, excluding other tensors. Doubling length doubles this cache.

GQA reduces KV-head count rather than context length. [PagedAttention](https://arxiv.org/abs/2309.06180) addresses allocation, sharing, and fragmentation, a different problem from FlashAttention's IO. Decode bottlenecks depend on batches, models, and hardware.

## Why draft proposals require correction

Use an original two-token vocabulary a/b. Target p=[0.6,0.4], draft q=[0.8,0.2]. A draft a is accepted with min(1,p(a)/q(a))=0.75; b is always accepted. Accepted masses are 0.6 and 0.2, leaving rejection mass 0.2.

After rejection, sample from normalized max(p−q,0). Here only b has positive residual, so all rejected mass becomes b. Final output probabilities are [0.6,0.4], matching the target. Resampling from q after rejection would break correction. This is the ideal sampling argument; greedy variants use different verification rules.

## Check your understanding

Identical draft and target distributions accept all proposals, but speed still depends on draft cost and verification overhead. For q=[0.2,0.8], acceptance rates are one for a and 0.5 for b; rejected mass goes to a, again recovering p. Temperature/top-p processing must be reflected in the actual p/q distributions, not replaced with raw-logit probabilities. Verify distributional or greedy equivalence alongside latency and throughput. Continue to [long context](/posts/ai/2026-10-11-cmu10423-lecture-19-long-context-en).

## Course video sources

The [official Spring 2026 course site](https://www.cs.cmu.edu/~mgormley/courses/10423/) directs recordings to SCS Panopto. On 2026-10-12, anonymous retrieval returned an unloaded folder and a sign-in prompt, without playable classroom content. This establishes an access limit, not the absence of recordings. This guide uses public slides and linked primary papers; examples are original teaching additions, not a transcript. [Official recording folder](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22).

## References

- [CMU 10-423 Spring 2026 Lecture 18 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture18-efficient.pdf)
- [Primary paper](https://arxiv.org/abs/2211.17192)
- [Official schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
