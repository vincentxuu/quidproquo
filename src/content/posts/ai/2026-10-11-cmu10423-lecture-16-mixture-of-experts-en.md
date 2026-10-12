---
title: "Mixture of Experts: Separating Capacity from Active Computation | CMU 10-423 Lecture 16"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 24
draft: false
description: "A complete worked example and answered variations for Mixture of Experts: Separating Capacity from Active Computation."
---

> 🌏 [中文版](/posts/ai/2026-10-11-cmu10423-lecture-16-mixture-of-experts)

**Video status: recordings require login or course authorization.** [Sources](#course-video-sources)

This guide follows [CMU 10-423](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 public slides. Worked examples are original teaching additions.

## A token need not use every expert

Mixture of Experts (MoE) replaces selected dense feed-forward layers with multiple experts and a router that selects a few per token. Total capacity grows while active computation remains limited. Review [Transformers](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa-en) and [scaling](/posts/ai/2026-10-11-cmu10423-lecture-15b-scaling-laws-en). We will calculate top-2 routing and distinguish total parameters, active parameters, and load.

[Switch Transformer](https://arxiv.org/abs/2101.03961) exemplifies top-1 routing; other systems use top-2 or more. Experts are trainable networks, and the router scores them from the token state. They are not necessarily predefined “math” and “English” specialists.

## An original four-expert example

Four experts each have one million parameters, plus two million shared parameters. Total capacity is six million. Top-2 activates roughly four million parameters per token including the shared part. Different tokens can select different experts, so a batch can use all four. This count is not exact FLOPs: routing, communication, and shared attention still cost work.

Router probabilities [0.5,0.3,0.15,0.05] select experts one and two. Renormalizing selected weights gives [0.625,0.375]. For output coordinates two and minus two, the combination is 0.5. Without renormalization it is 0.4. State the gating convention; top-2 does not uniquely specify the formula.

## Load is part of the design

Suppose four tokens all choose experts one and two. Eight assignments distribute as [4,4,0,0]. With capacity two per expert, four assignments exceed capacity. Depending on the architecture, overflow can be dropped, rerouted, or handled differently. One method's overflow rule is not universal.

Balancing losses and router regularization discourage overloaded experts and unused capacity. They do not guarantee perfectly uniform batches or interpretable specialization. Track task quality, assignment counts, overflow, and communication alongside the auxiliary objective.

## Multi-GPU execution adds communication

Expert parallelism places experts on different devices, dispatches token states to them, and returns outputs. Sparse computation can save expert FLOPs while all-to-all traffic and imbalance reduce the speed benefit. All expert weights still need storage; low active counts do not make the whole model fit into correspondingly small memory.

Dense/MoE comparisons should report total parameters, active FLOPs, data, wall time, and quality. Latency, throughput, and training cost are separate measurements, all conditioned on hardware and batches.

## Check your understanding

Top-1 gives roughly three million active parameters here, while total capacity stays six million. Four tokens selecting distinct experts yield [1,1,1,1]; all selecting the first yield [4,0,0,0]. Equal active counts do not imply equal execution efficiency. Adding a fifth expert without changing top-k leaves selected expert count unchanged but increases storage and router size. Continue to [distributed training](/posts/ai/2026-10-11-cmu10423-lecture-17-distributed-training-en).

## Course video sources

The [official Spring 2026 course site](https://www.cs.cmu.edu/~mgormley/courses/10423/) directs recordings to SCS Panopto. On 2026-10-12, anonymous retrieval returned an unloaded folder and a sign-in prompt, without playable classroom content. This establishes an access limit, not the absence of recordings. This guide uses public slides and linked primary papers; examples are original teaching additions, not a transcript. [Official recording folder](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22).

## References

- [CMU 10-423 Spring 2026 Lecture 16 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture16-moe.pdf)
- [Primary paper](https://arxiv.org/abs/2101.03961)
- [Official schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
