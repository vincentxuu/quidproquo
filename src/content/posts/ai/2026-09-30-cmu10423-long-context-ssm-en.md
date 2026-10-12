---
title: "Long Context and SSMs: Different Ways to Retain History | CMU 10-423 Topic Guide"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, long-context, attention, state-space-model, mamba, flashattention]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 43
tldr: "Long-context evaluation asks whether a model can process, retrieve, and use distant information. An SSM specifies sequence processing through state updates. SSM efficiency does not establish reliable document retrieval, and a large attention window does not guarantee relevant evidence is used."
description: "Long-context evaluation asks whether a model can process, retrieve, and use distant information. An SSM specifies sequence processing through state updates. SSM efficiency does not establish reliable document retrieval, and a large attention window does not guarantee relevant evidence is used."
draft: false
glossary:
  - term: "Ring Attention"
    aliases: ["RingAttention"]
    definition: "Split a long sequence into blocks across devices. Each device computes attention for its own query block in blockwise fashion while passing key/value blocks to the next device around a ring, so the sequence length that fits in memory grows with the number of devices."
    context: "The centerpiece of the \"efficient full attention\" section of CMU 10-423 Lecture 19."
    links:
      - label: "Ring Attention (Liu et al., 2023)"
        url: "https://arxiv.org/abs/2310.01889"
  - term: "selective SSM"
    aliases: ["selective state space model"]
    definition: "The SSM variant used by Mamba: the parameters B and C and discretization step size Δ depend on the input at every time step instead of staying fixed. The cost is that the convolution kernel can no longer be precomputed, so it is implemented with a scan."
    context: "The key difference in the move from S4 to Mamba in CMU 10-423 Lecture 21."
    links:
      - label: "Mamba (Gu & Dao, 2023)"
        url: "https://arxiv.org/abs/2312.00752"
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-long-context-ssm)

**Video status: recordings require login or course authorization.** [Recording source](#course-video-sources)

Long-context evaluation asks whether a model can process, retrieve, and use distant information. An SSM specifies sequence processing through state updates. SSM efficiency does not establish reliable document retrieval, and a large attention window does not guarantee relevant evidence is used.

## Choose a lesson

- [Long context](/posts/ai/2026-10-11-cmu10423-lecture-19-long-context-en): work through its mechanism, example, and answer criteria.
- [State-space and hybrid models](/posts/ai/2026-10-11-cmu10423-lecture-21-state-space-models-en): work through its mechanism, example, and answer criteria.
- [Reasoning models](/posts/ai/2026-09-30-cmu10423-reasoning-models-en): work through its mechanism, example, and answer criteria.

The [course map](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en) lists the core path. This page is a topic guide, not an additional lecture. Choose the question you need to answer and follow its lesson.

## A worked comparison

Teaching SSM: h0=0, ht=0.5h(t−1)+xt, inputs [2,0,6,2], and output equal to state. The states are [2,1,6.5,5.25]. The first input contributes 2×0.5³=0.25 directly at step four. This decay follows our chosen coefficient, not every SSM. To evaluate document use, separately hold question and evidence fixed and move evidence between the beginning, middle, and end of a document.

## Check your understanding

If the first input changes from two to four, how much does the fourth state increase?

<details>
<summary>Answer and criterion</summary>

It increases by 2×0.5³=0.25, from 5.25 to 5.5. Computing state influence still does not replace an empirical text-retrieval test.

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

- [CMU 10-423/623/723 Generative AI (Spring 2026) course home page](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Course schedule (L19 and L21 dates and quiz coverage)](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
- [Lecture 19 slides: Long Context in LLMs](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture19-long.pdf)
- [Lecture 19 slides (inked)](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture19-long-ink.pdf)
- [Lecture 21 slides: State Space Models + Hybrid Models](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture21-ssm.pdf)
- [gkamradt/LLMTest_NeedleInAHaystack](https://github.com/gkamradt/LLMTest_NeedleInAHaystack)
- [Fu et al. 2024: Data Engineering for Scaling Language Models to 128K Context](https://arxiv.org/abs/2402.10171)
- [Bertsch et al. 2024: In-Context Learning with Long-Context Models: An In-Depth Exploration](https://arxiv.org/abs/2405.00200)
- [Child et al. 2019: Generating Long Sequences with Sparse Transformers](https://arxiv.org/abs/1904.10509)
- [Beltagy et al. 2020: Longformer: The Long-Document Transformer](https://arxiv.org/abs/2004.05150)
- [Ding et al. 2023: LongNet: Scaling Transformers to 1,000,000,000 Tokens](https://arxiv.org/abs/2307.02486)
- [Li et al. 2021: Sequence Parallelism: Long Sequence Training from System Perspective](https://arxiv.org/abs/2105.13120)
- [Liu & Abbeel 2023: Blockwise Parallel Transformer for Large Context Models](https://arxiv.org/abs/2305.19370)
- [Liu et al. 2023: Ring Attention with Blockwise Transformers for Near-Infinite Context](https://arxiv.org/abs/2310.01889)
- [Liu et al. 2024: World Model on Million-Length Video And Language With Blockwise RingAttention](https://arxiv.org/abs/2402.08268)
- [Hazy Research: The Annotated S4 blog series (source of slide figures)](https://hazyresearch.stanford.edu/blog/2022-01-14-s4-3)
- [Gu & Dao 2023: Mamba: Linear-Time Sequence Modeling with Selective State Spaces](https://arxiv.org/abs/2312.00752)
- [Yang et al. 2024: Gated Delta Networks: Improving Mamba2 with Delta Rule](https://arxiv.org/abs/2412.06464)
- [Lieber et al. 2024: Jamba: A Hybrid Transformer-Mamba Language Model](https://arxiv.org/abs/2403.19887)
- [NVIDIA 2025: Nemotron-H: A Family of Accurate and Efficient Hybrid Mamba-Transformer Models](https://arxiv.org/abs/2504.03624)
- [Qwen3-Next official blog post](https://qwen.ai/blog?id=4074cca80393150c248e508aa62983f9cb7d27cd)
- [Spring 2026 Practice Exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)
