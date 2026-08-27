---
title: "Stanford CS229 Lecture 14: Turning Conflicting Rules into Training Labels with Weak Supervision"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, stanford, weak-supervision, snorkel]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 15
tldr: "Weak supervision encodes rules, existing classifiers, and knowledge bases as labeling functions. Their agreements and conflicts reveal source quality, allowing a label model to produce probabilistic training labels."
description: "A reading of Stanford CS229 Spring 2021 Lecture 14: programmatic labeling, label models, source dependence, and what can and cannot be learned without per-example ground truth."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-spring2021-lecture-14-weak-supervision)

This is post 15 in [Reading Stanford CS229](/en/series/stanford-cs229), covering **Stanford CS229, Spring 2021, Lecture 14**. The syllabus dates it May 12, 2021 and gives the official title **Weak supervised / unsupervised learning**. This article uses the Spring 2021 *Introduction to weak supervision* slides and the *ICA and weak supervision* draft. The Canvas recording was not used.

The lecture is not about accepting worse labels. It turns the process that creates labels into something a model can reason about. Rules, knowledge bases, existing classifiers, and crowd judgments already coexist in real systems. Weak supervision keeps those inexpensive sources while estimating their reliability and overlap.

## Labeling functions turn domain knowledge into programs

In medical named-entity recognition, one source might classify an all-uppercase span as a person, another might query a hospital list, and a third might call an existing classifier. Each becomes a labeling function that takes `x` and returns a class or abstains.

For `m` sources and `n` unlabeled examples, their outputs form a label matrix:

```text
Lᵢⱼ = output of labeling function j on example i
```

Conflicts and dependencies become visible in this matrix. Two rules built from the same dictionary are not independent evidence. A source that abstains often also cannot be judged only by its raw number of matches.

## How accuracy can be estimated without ground truth

The central intuition is to learn from overlaps. Treat the true label `Y` as latent and the labeling-function outputs as noisy observations. Across many examples, pairwise agreements and disagreements constrain a generative label model's estimates of source accuracy and dependence.

In a simplified binary setting with conditionally independent sources, the key moment has the form:

```text
E[λⱼ λₖ] ≈ E[λⱼY] · E[λₖY]
```

The left side is an observable pairwise agreement. The right side contains each source's relationship to the unobserved `Y`. This is the method-of-moments intuition: observable moments constrain latent parameters without revealing every true label.

After estimating source quality, the label model can output `P(Y | L)` rather than one hard vote. A downstream discriminative model trains on these probabilistic labels and retains uncertainty caused by conflicts.

## Why majority voting is not enough

Majority voting treats all sources as equally accurate and independent. Neither assumption is generally appropriate. One strong knowledge base can be more reliable than ten loose regexes, and ten variants of one pattern should not count as ten independent votes.

A label model can represent source behavior, but it cannot manufacture information. If every source shares the same blind spot and fails in the same direction, agreement alone cannot reveal that common error. Misspecified dependencies can likewise distort estimated accuracy.

## What each stage of the pipeline does

The lecture presents the Snorkel pipeline in three stages:

1. Users write labeling functions from rules, distant supervision, existing models, or crowd signals.
2. A label model combines conflicts and produces probabilistic labels.
3. An end model learns from raw features and those probabilistic labels.

The third stage matters operationally. Expensive or non-servable labeling functions need not run in production. They create training supervision; they do not have to remain inputs to the deployed model.

## Cheap supervision is not free supervision

- Labeling functions still require domain knowledge, debugging, and version control.
- Estimates depend on model assumptions; ignored correlation can count duplicated evidence multiple times.
- A better supervision pipeline does not guarantee that training data covers the deployment distribution.
- Without at least a small human-labeled validation set, product-level quality remains difficult to establish.

The medical and industrial examples show that this approach can support real systems. They do not prove that every task can eliminate manual labels. The defensible claim is narrower: when experts can write multiple imperfect but informative sources, programmatic labeling can extend their knowledge across large unlabeled datasets.

## Where Lecture 14 sits in the eighteen-lecture path

Lecture 13 treated an unobserved `z` as a latent variable in Factor Analysis. Lecture 14 similarly treats the true `Y` as latent in a supervision model. Both refuse to pretend a missing quantity is observed and instead infer it from available signals.

Lecture 15 follows a different route. Self-supervision constructs pretext tasks from the data itself rather than depending on human-authored labeling functions. Both reduce per-example annotation, but their supervision comes from different places.

## Beyond the lecture

Before implementing weak supervision, build a source inventory. Record each labeling function's dependencies, coverage, expected failure modes, and shared rules. This often exposes a set of supposedly diverse sources that all rest on one piece of evidence.

## References

- [Stanford CS229 Spring 2021 syllabus](https://cs229.stanford.edu/syllabus-spring2021.html)
- [Introduction to weak supervision slides](https://cs229.stanford.edu/notes2021spring/notes2021spring/WeakSupervise_229.pdf)
- [ICA and weak supervision draft](https://cs229.stanford.edu/notes2021spring/notes2021spring/ica_and_weak_supervision.pdf)
