---
title: "Stanford CS109 Lecture 23 | Midterm 2 Practice: Review is not formula copying; identify the random object, unknown quantity, and data-generating story first."
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: en
series:
  name: "Reading Stanford CS109"
  order: 24
tldr: "Review is not formula copying; identify the random object, unknown quantity, and data-generating story first."
description: "A lecture-by-lecture guide to Stanford CS109 Summer 2026 Lecture 23, covering connecting the CLT, bootstrap, entropy, and MLE into a problem-solving workflow with explicit source gaps."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs109-lecture-23-midterm-two-practice)

This is article 24 in [Reading Stanford CS109](/series/stanford-cs109), covering **Stanford CS109, Summer 2026, Lecture 23** (Aug 3). The canonical schedule title is **Midterm 2 Practice**, taught by Chris Gregg. This guide stays within the verifiable scope of the [official schedule](https://web.stanford.edu/class/cs109/schedule.html), [lecture page](https://web.stanford.edu/class/cs109/schedule.html), and [course reader](https://probabilitycoders.stanford.edu/spr26).

Material fidelity is **L1**. schedule 明列此講; navbar 無 Lecture 23，無公開錄影與完整投影片. This article therefore explains what the public artifacts support; it does not present inaccessible recordings as lecture quotations.

## What problem does this lecture solve?

The lecture centers on connecting the CLT, bootstrap, entropy, and MLE into a problem-solving workflow. Its one-sentence takeaway is: **複習不是重抄公式，而是先辨認題目中的隨機對象、未知量與資料生成方式。**

Probability problems often go wrong before calculation begins. Ask what the random experiment is, what outcomes look like, what is known, and what remains unknown. Only then select a formula. That order distinguishes CS109 from a formula sheet: the course trains you to turn prose into a model someone else can inspect.

## Core representation

The key expression is:

```text
model → quantity → estimator → uncertainty → decision
```

An equation is a compressed model. Every symbol must map back to the question: which sample space defines the probability, what the condition rules out, and which values a sum or integral ranges over. If you cannot explain both sides in one plain sentence, do not substitute numbers yet.

A dependable workflow is:

1. Define events or random variables and their ranges.
2. State assumptions, especially independence and identical distribution.
3. Write the general expression before inserting data.
4. Check bounds, units, and limiting cases.

## A reusable solution framework

Start with a one-sentence generative story: how could the observations have arisen? Define an observed quantity `X` and the target `Y`. If new information arrives, represent it as a condition rather than an intuitive correction at the end.

Run two checks. A **structural check** asks whether dependent events were treated as independent or unordered outcomes were counted repeatedly. A **numerical check** asks how the model behaves near a boundary. Both checks usually matter more than another decimal place.

Finally translate the result back to the setting. `0.2` is incomplete: it may be an event probability, error rate, posterior belief, or decision threshold. Those labels permit different conclusions.

## Common mistakes

The first mistake is selecting a distribution from a familiar keyword. A distribution follows from a generative assumption; it is not triggered by vocabulary. The second is treating an expectation as a promise about one trial. The third is stopping after obtaining a number without checking whether the assumptions support the original question.

A recurring cross-lecture trap is confusing belief after observing data with the probability of data under a fixed parameter. Inference, MLE, and classifier comparison repeatedly force these two directions apart.

## Try it yourself

Choose a binary event you care about, such as whether a service times out. Define success and failure, then add one condition such as whether traffic exceeds a threshold. Before calculating, draw a two-level tree and label every edge with its conditional probability. Apply the lecture expression only afterward, then simulate repeated trials to compare long-run frequency with the result.

The goal is not a pretty number. It is to locate every assumption in the model. If simulation and calculation disagree, inspect event definitions, conditioning direction, and sampling first.

---

## Extension: formulas as challengeable models

The minimum standard for knowing a formula is substituting values. A stronger standard is naming the conditions under which it fails. When reading an experiment or model evaluation, ask where the sample came from, whether missing populations change the base rate, whether observations are independent, and whether the metric matches real decision costs.

These questions reach beyond statistics class. A/B tests, reliability analysis, recommenders, and generative models all use probability to compress uncertainty. CS109 teaches how to keep that compression reversible and inspectable.

## Material gaps

- schedule 明列此講.
- navbar 無 Lecture 23，無公開錄影與完整投影片.
- This article does not use search snippets or inaccessible Canvas material, and it does not invent classroom examples.

## References

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 23: Midterm 2 Practice](https://web.stanford.edu/class/cs109/schedule.html)
- [Probability for Computer Science course reader](https://probabilitycoders.stanford.edu/spr26)
