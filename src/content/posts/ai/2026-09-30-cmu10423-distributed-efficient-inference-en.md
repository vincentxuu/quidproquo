---
title: "Distributed Training and Efficient Inference: Locate the Cost | CMU 10-423 Topic Guide"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, distributed-training, parallelism, flashattention, pagedattention, speculative-decoding]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 47
tldr: "A model that does not fit on one GPU has a different problem from a model that fits but decodes slowly. Distributed strategies partition data, parameters, and states. FlashAttention improves attention memory traffic; KV caching avoids recomputing historical keys and values during decoding."
description: "A model that does not fit on one GPU has a different problem from a model that fits but decodes slowly. Distributed strategies partition data, parameters, and states. FlashAttention improves attention memory traffic; KV caching avoids recomputing historical keys and values during decoding."
draft: false
glossary:
  - term: "1F1B"
    aliases: ["one-forward-one-backward"]
    definition: "A pipeline-parallel schedule in which, at steady state, each GPU alternates one microbatch forward pass with one backward pass, cutting idle time in the pipeline."
    context: "The L17 slides use figures from PipeDream and Megatron-LM to explain 1F1B and pipeline flushes."
  - term: "online softmax"
    definition: "A softmax algorithm that updates the running maximum and normalizer in one sweep, cutting safe softmax's three memory passes to two and making it possible to compute softmax block by block."
    context: "L18 uses it to explain why attention can be tiled like matrix multiplication, which FlashAttention depends on."
    links:
      - label: "Milakov & Gimelshein 2018"
        url: "https://arxiv.org/abs/1805.02867"
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-distributed-efficient-inference)

**Video status: recordings require login or course authorization.** [Recording source](#course-video-sources)

A model that does not fit on one GPU has a different problem from a model that fits but decodes slowly. Distributed strategies partition data, parameters, and states. FlashAttention improves attention memory traffic; KV caching avoids recomputing historical keys and values during decoding.

## Choose a lesson

- [Multi-GPU training](/posts/ai/2026-10-11-cmu10423-lecture-17-distributed-training-en): work through its mechanism, example, and answer criteria.
- [FlashAttention and efficient decoding](/posts/ai/2026-10-11-cmu10423-lecture-18-efficient-inference-en): work through its mechanism, example, and answer criteria.

The [course map](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en) lists the core path. This page is a topic guide, not an additional lecture. Choose the question you need to answer and follow its lesson.

## A worked comparison

Teaching example: equal-sized local batches on two GPUs produce scalar gradients 2 and 6. Data-parallel averaging gives 4, and both replicas update with 4. Without communication they use different gradients and drift apart. During decoding, a KV cache retains historical keys and values and appends the next token. It does not average training gradients. More GPUs do not automatically remove large attention intermediates; partitioning and kernel behavior matter.

## Check your understanding

Can you average 2 and 6 directly if local batch sizes differ?

<details>
<summary>Answer and criterion</summary>

If these are local mean gradients, weight them by local sample counts to obtain the global mean. This condition is unrelated to inference caching.

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

- [CMU 10-423/623/723 Generative AI (Spring 2026) home page](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Course schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html) — L17 and L18 dates, Quiz 5 coverage
- [Lecture 17 slides: Distributed Training](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture17-distributed.pdf), [inked version](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture17-distributed-ink.pdf)
- [Lecture 18 slides: Efficient Attention (FlashAttention) & Efficient Decoding Strategies](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture18-efficient.pdf)
- [Shoeybi et al. 2019: Megatron-LM](https://arxiv.org/abs/1909.08053)
- [Harlap et al. 2018: PipeDream](https://arxiv.org/abs/1806.03377)
- [Narayanan et al. 2021: Efficient Large-Scale Language Model Training on GPU Clusters Using Megatron-LM](https://arxiv.org/abs/2104.04473)
- [Rajbhandari et al. 2019: ZeRO: Memory Optimizations Toward Training Trillion Parameter Models](https://arxiv.org/abs/1910.02054)
- [Li et al. 2021: TeraPipe: Token-Level Pipeline Parallelism](https://arxiv.org/abs/2102.07988)
- [Lepikhin et al. 2020: GShard](https://arxiv.org/abs/2006.16668)
- [Fedus et al. 2021: Switch Transformers](https://arxiv.org/abs/2101.03961)
- [Milakov & Gimelshein 2018: Online normalizer calculation for softmax](https://arxiv.org/abs/1805.02867)
- [Ivanov et al. 2020: Data Movement Is All You Need](https://arxiv.org/abs/2007.00072)
- [Dao et al. 2022: FlashAttention](https://arxiv.org/abs/2205.14135)
- [Dao 2023: FlashAttention-2](https://arxiv.org/abs/2307.08691)
- [Kwon et al. 2023: Efficient Memory Management for Large Language Model Serving with PagedAttention](https://arxiv.org/abs/2309.06180)
