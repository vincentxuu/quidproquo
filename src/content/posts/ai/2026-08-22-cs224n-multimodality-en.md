---
title: "CS224N Lecture 17: An Official Reading Map for Multimodality"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224n, multimodal-ai, vision-language-model, foundation-model, stanford]
lang: en
series:
  name: "Reading Stanford CS224N"
  order: 18
tldr: "Lecture 17 is Luke Zettlemoyer's multimodality guest session, but the site publishes no slides or agenda. Its official readings establish three routes: visual reasoning workspaces, early-fusion token models, and text autoregression with image diffusion."
description: "A material-gap record and official reading map for CS224N Winter 2026 Lecture 17: Visual Sketchpad, Chameleon, Transfusion, and multimodal evaluation."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs224n-multimodality)

The [official CS224N Winter 2026 schedule](https://web.stanford.edu/class/cs224n/) confirms that the seventeenth regular unit took place on March 3, 2026, guest-taught by Luke Zettlemoyer under **Guest Lecture: Multimodality**. The course page publishes no current slides or agenda and lists four suggested plus seven optional readings. This article covers only the five public sources actually read and listed below; it does not present the other six as read or reconstruct the session.

## Vision as a reasoning workspace

[Visual Sketchpad](https://visualsketchpad.github.io/) puts drawing, marking, and visual tools inside a reasoning loop. The model can create an intermediate visual state and inspect it to continue reasoning. Unlike text-only chain of thought, this external workspace can carry spatial relationships.

Evaluation must separate tool capability from the model's decision about when to use it. A successful tool call does not imply reliable planning.

## One token stream for multiple modalities

[Chameleon](https://arxiv.org/abs/2405.09818) uses mixed-modal early fusion, placing text and image representations in one sequence for a single autoregressive model. [Mixture-of-Transformers](https://arxiv.org/abs/2411.04996) explores sparse modality-specialized parameters within a shared sequence architecture.

A unified interface reduces task-switching friction but does not prove that every modality should share identical representations or losses. Image compression, token count, and continuous detail change the cost structure.

## Different modalities can keep different objectives

[Transfusion](https://arxiv.org/abs/2408.11039) applies next-token prediction to discrete text and diffusion loss to continuous images in one model. It avoids forcing all images into discrete tokens, at the price of a more complex training and sampling pipeline.

The optional subset actually read here contains only [Multimodal RewardBench](https://arxiv.org/abs/2502.14191). It shows why multimodal evaluation should separate general capability from safety preference and test whether a reward model behaves consistently when text, images, or both carry the decisive signal. The other optional readings listed by the schedule are outside this article's summary scope.

## What can and cannot be confirmed

The date, speaker, title, and the fact that the official page lists eleven readings are confirmed. This article actually reads and summarizes the five sources in its reference list; the other six appear only in the schedule and support no content claim here. The actual agenda, architecture comparisons, live demonstrations, and conclusions are not confirmed. Reading-list order is not presented as teaching order. A slide-by-slide review should replace this map only if current slides are released.

## References

- [Official CS224N Winter 2026 course page](https://web.stanford.edu/class/cs224n/)
- [Visual Sketchpad](https://visualsketchpad.github.io/)
- [Chameleon](https://arxiv.org/abs/2405.09818)
- [Transfusion](https://arxiv.org/abs/2408.11039)
- [Mixture-of-Transformers](https://arxiv.org/abs/2411.04996)
- [Multimodal RewardBench](https://arxiv.org/abs/2502.14191)
