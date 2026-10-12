---
title: "Scaling and MoE: Compute Budgets and Conditional Computation | CMU 10-423 Topic Guide"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, scaling-laws, mixture-of-experts, moe, llm, training-data]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 41
tldr: "Scaling laws study model and data allocation under a budget. MoE increases expert capacity while activating selected experts. The former concerns allocation and empirical models; the latter concerns architecture and routing. Both deserve separate checks."
description: "Scaling laws study model and data allocation under a budget. MoE increases expert capacity while activating selected experts. The former concerns allocation and empirical models; the latter concerns architecture and routing. Both deserve separate checks."
draft: false
glossary:
  - term: "active parameters"
    aliases: ["active params"]
    definition: "In an MoE model, the parameters the router selects and actually uses to process a token. Active parameters, including selected experts and shared components, give a rough proxy for per-token arithmetic. Actual FLOPs also depend on attention and routing, while communication affects speed. Total parameters are a starting point for weight storage; memory also depends on precision, sharding, and caches."
    context: "The L16 slides use Mixtral (2 of 8 experts) and OLMoE (8 of 64 experts) to show the difference."
  - term: "router z-loss"
    aliases: ["z-loss", "Router Z-loss"]
    definition: "A regularizer added to the MoE training objective that penalizes large router logits to stabilize training."
    context: "The L16 slides follow OLMoE and add it to the total loss alongside the load-balance loss."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-scaling-laws-moe)

**Video status: recordings require login or course authorization.** [Recording source](#course-video-sources)

Scaling laws study model and data allocation under a budget. MoE increases expert capacity while activating selected experts. The former concerns allocation and empirical models; the latter concerns architecture and routing. Both deserve separate checks.

## Choose a lesson

- [Model/data allocation](/posts/ai/2026-10-11-cmu10423-lecture-15-qformer-scaling-laws-en): work through its mechanism, example, and answer criteria.
- [MoE routing](/posts/ai/2026-10-11-cmu10423-lecture-16-mixture-of-experts-en): work through its mechanism, example, and answer criteria.
- [Distributed training](/posts/ai/2026-10-11-cmu10423-lecture-17-distributed-training-en): work through its mechanism, example, and answer criteria.

The [course map](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en) lists the core path. This page is a topic guide, not an additional lecture. Choose the question you need to answer and follow its lesson.

## A worked comparison

Teaching budget example: use the simplified relation C∝N×D for relative comparisons. A has N=10 and D=20; B has N=20 and D=10. Both products equal 200, but equal budgets do not imply equal losses. Separately, a four-expert MoE with 100 toy parameters per expert and top-2 routing activates 200 expert parameters out of 400 total, excluding shared layers, routing, and communication. These two values of 200 have different units and cannot establish equal compute.

## Check your understanding

Does changing top-2 to top-1 halve total expert capacity?

<details>
<summary>Answer and criterion</summary>

No. Total expert parameters remain 400; activated expert parameters fall to 100 in this example. Quality, load balance, and communication still require evaluation.

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
- [Course schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html) — L15 and L16 dates, Quiz 4/5 coverage
- [Lecture 15 slides: Querying Transformer + Scaling Laws](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture15-querying-scaling.pdf)
- [Lecture 16 slides: Mixture of Experts](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture16-moe.pdf), [inked version](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture16-moe-ink.pdf)
- [Lecture 18 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture18-efficient.pdf) — exam covers L1–L15
- [Spring 2026 practice exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf), [solutions](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf)
- [Kaplan et al. 2020: Scaling Laws for Neural Language Models](https://arxiv.org/abs/2001.08361)
- [Hoffmann et al. 2022: Training Compute-Optimal Large Language Models](https://arxiv.org/abs/2203.15556)
- [Gunasekar et al. 2023: Textbooks Are All You Need](https://arxiv.org/abs/2306.11644)
- [Li et al. 2023: Textbooks Are All You Need II: phi-1.5 technical report](https://arxiv.org/abs/2309.05463)
- [Goyal et al. 2024: Scaling Laws for Data Filtering](https://arxiv.org/abs/2404.07177)
- [Cai et al. 2024: A Survey on Mixture of Experts in Large Language Models](https://arxiv.org/abs/2407.06204)
- [Muennighoff et al. 2024: OLMoE: Open Mixture-of-Experts Language Models](https://arxiv.org/abs/2409.02060)
- [Jiang et al. 2024: Mixtral of Experts](https://arxiv.org/abs/2401.04088)
- [Clark et al. 2022: Unified Scaling Laws for Routed Language Models (ICML)](https://proceedings.mlr.press/v162/clark22a.html)
