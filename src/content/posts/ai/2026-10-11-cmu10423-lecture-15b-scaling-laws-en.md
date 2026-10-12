---
title: "Scaling Laws: Allocating a Fixed Compute Budget | CMU 10-423 Lecture 15"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 23
draft: false
description: "A complete worked example and answered variations for Scaling Laws: Allocating a Fixed Compute Budget."
---

> 🌏 [中文版](/posts/ai/2026-10-11-cmu10423-lecture-15b-scaling-laws)

**Video status: recordings require login or course authorization.** [Sources](#course-video-sources)

This guide follows [CMU 10-423](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 public slides. Worked examples are original teaching additions.

## Parameters and data are different resources

A scaling law is an empirical relationship among model size, data, and loss under specified training conditions. It helps plan experiments but does not guarantee that more parameters improve every task. Review [training objectives](/posts/ai/2026-10-11-cmu10423-lecture-03-training-decoding-en). We will compare configurations at fixed compute and identify the assumptions.

An illustrative fit is L(N,D)=L∞+A/N^a+B/D^b. N denotes parameters and D training tokens. Coefficients are measured, and changing tokenizer, architecture, optimization, or data distribution can change the relationship. Constants from one study are not universal.

## Calculate a fixed-budget example

These invented coefficients and units are for teaching. Approximate compute as C=6ND. A budget of 2400 implies ND=400. Let L=1+4/√N+4/√D. Configuration A uses N=40, D=10 and gives L≈2.8974. Configuration B uses N=20, D=20 and gives L≈2.7889. Under this model, a smaller model wins through a more balanced allocation.

Substitute D=400/N: increasing N forces D down. Symmetric coefficients make N=D=20 optimal here, but real exponents and coefficients need not be symmetric. C≈6ND is a rough dense-Transformer training estimate that omits some attention, communication, and implementation costs. It is not an inference-cost formula.

## Read empirical conclusions in context

[Kaplan et al.](https://arxiv.org/abs/2001.08361) and [Chinchilla](https://arxiv.org/abs/2203.15556) both study compute allocation but use different experimental configurations and reach different optimal allocations. Chinchilla shows that some contemporary large models could benefit from smaller models trained on more tokens at fixed training compute. It does not imply that small models always win or that any added data is useful.

Repeating low-quality data differs from adding diverse relevant data. Deduplication, filtering, and mixture composition change the learning signal. Repeated tokens are not automatically independent new information. Evaluation contamination can also create apparent gains unrelated to generalization.

## Training-optimal is not serving-optimal

A model trained once and served many times has an objective that includes inference cost. Additional training of a smaller model may lower later serving cost, but that requires assumptions about request volume, latency, and hardware. Training-compute optimality does not automatically minimize product cost.

For a small study, fix data and tokenizer, measure several N/D configurations, and record compute, validation loss, and convergence. Hold out some configurations from fitting. Two points can compare alternatives but cannot establish a general power law.

## Check your understanding

N=10, D=40 gives the same loss as configuration A because the invented formula is symmetric. Increasing the coefficient on the data term favors more D, but the optimum must be recalculated. A benchmark gain without a clean validation-loss change calls for checking evaluation and distribution before claiming a scaling result. Continue to [MoE](/posts/ai/2026-10-11-cmu10423-lecture-16-mixture-of-experts-en), which separates capacity from per-token computation.

## Course video sources

The [official Spring 2026 course site](https://www.cs.cmu.edu/~mgormley/courses/10423/) directs recordings to SCS Panopto. On 2026-10-12, anonymous retrieval returned an unloaded folder and a sign-in prompt, without playable classroom content. This establishes an access limit, not the absence of recordings. This guide uses public slides and linked primary papers; examples are original teaching additions, not a transcript. [Official recording folder](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22).

## References

- [CMU 10-423 Spring 2026 Lecture 15 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture15-querying-scaling.pdf)
- [Primary paper](https://arxiv.org/abs/2203.15556)
- [Official schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
