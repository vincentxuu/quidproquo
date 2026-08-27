---
title: "Stanford CS229 Lecture 6: Laplace Smoothing Fixes Zero Probabilities, Then Opens the Door to Kernels"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, stanford, naive-bayes, kernel-methods]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 7
tldr: "Lecture 6 uses Laplace smoothing to stop unseen events from zeroing a Naive Bayes score, distinguishes Bernoulli and multinomial text models, and introduces feature maps as the motivation for kernels."
description: "A reading of Stanford CS229 Spring 2021 Lecture 6: Naive Bayes, Laplace smoothing, text event models, and the transition from high-dimensional feature maps to kernel methods."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-spring2021-lecture-06-laplace-smoothing-kernels)

This is post 7 in [Reading Stanford CS229](/en/series/stanford-cs229), covering **Stanford CS229, Spring 2021, Lecture 6**. The lecture took place on April 14, 2021, under the official title **Naive Bayes, Laplace Smoothing.** This article uses the Spring 2021 live lecture notes and Section 2 of the shared Generative Algorithms notes assigned by the syllabus. The live notes also begin kernel methods after completing text event models; this article preserves that transition into the next lecture. The recording was not used.

The lecture's spine is that finite data must not turn “not observed” into “impossible.” Naive Bayes multiplies many conditional probabilities. One estimate of zero can collapse an entire class score. Laplace smoothing is therefore not a cosmetic adjustment; it leaves nonzero probability for events missing from a finite sample.

## How zero contaminates an entire prediction

Suppose a word appears in neither the spam nor non-spam training messages. Unsmoothed maximum likelihood gives:

```text
p(word appears | spam) = 0
p(word appears | non-spam) = 0
```

Naive Bayes constructs `p(x|y)` as a product of feature probabilities. A new message containing that word inserts zero into both products, and the posterior can become `0/0`. The data has not proved the event impossible. The finite training set simply has not observed it.

More generally, for a multinomial variable with `k` outcomes, the unsmoothed estimate is `count_j/n`. An outcome with zero count receives exact zero probability. In a product model, that local estimate becomes a global veto.

## Why add-one smoothing adds k to the denominator

Laplace smoothing replaces the estimate with:

```text
φ_j = (count_j + 1) / (n + k)
```

Each outcome receives one pseudo-count, so the denominator must increase by `k` to keep all `φ_j` summing to one. The adjustment guarantees nonzero probability for every known outcome while preserving a legal distribution.

In a binary word-presence model, each word has two outcomes—present and absent—so its denominator gains two. Those two counts are not one for spam and one for non-spam. They belong to the two outcomes of one Bernoulli variable.

Smoothing has limits. It moves estimates away from zero; it does not repair a poor vocabulary, label bias, or the conditional-independence assumption. Out-of-vocabulary terms still need an explicit representation such as `UNK`. Smoothing does not infer the semantics of a new word.

## What Bernoulli and multinomial event models count

The Bernoulli event model asks whether each vocabulary item appears in the message. Repeating a word five times still gives `x_j=1`. The multinomial event model represents a document as a sequence of word identities. Each position generates one vocabulary item, so repetition contributes repeatedly to the likelihood.

Their products look similar, but their random variables differ:

- Bernoulli: each vocabulary item is a binary presence event.
- Multinomial: each token position draws one item from a vocabulary distribution.

The shared product symbol does not make their parameters interchangeable. The choice depends on whether frequency is useful for the task. The multinomial model still treats positions as independent draws from the same class-conditional distribution; it does not model syntax or word order.

## Feature maps motivate the move to kernels

The live notes then rewrite a linear model as a linear predictor over a new representation `φ(x)`. Original attributes can be mapped to squared terms, interactions, or a much larger feature set. The model remains linear in `φ(x)` while forming a nonlinear boundary in the original `x` space.

The difficulty is that feature dimension `p` may become enormous. Explicitly creating every high-order term makes a gradient update scale with `p`. The notes establish a key observation: when parameters begin at zero and updates are linear combinations of training features, the parameter vector remains a linear combination of those feature vectors:

```text
θ = Σ_i β_i φ(x^(i))
```

Prediction and updates can therefore be rewritten through inner products `φ(x)ᵀφ(z)` between examples. Kernel methods take the next step: compute that similarity without explicitly constructing the high-dimensional `φ(x)`. These notes only open the door; Lecture 7 supplies the formal kernel definition and validity conditions.

## Where Lecture 6 sits in the eighteen-lecture path

Lecture 6 completes the first generative-classification arc: assumptions, estimates, the zero-probability repair, and text representations. It then moves the course from choosing a probability model to choosing a feature space. Lecture 7 develops kernels and SVMs. The two halves share one concern: represent complex data without an infeasible number of parameters or operations.

## Beyond the lecture

Hand-calculate Bernoulli and multinomial Naive Bayes on three short messages. Include one word absent from training, compute the unsmoothed result, and then add Laplace smoothing. Repeat a known word three times and identify the exact step where Bernoulli and multinomial scores diverge.

## References

- [Stanford CS229 Spring 2021 syllabus](https://cs229.stanford.edu/syllabus-spring2021.html)
- [Generative Algorithms notes, Section 2](https://cs229.stanford.edu/notes2020spring/cs229-notes2.pdf)
- [Spring 2021 Lecture 6 live notes](https://cs229.stanford.edu/notes2021spring/notes2021spring/lecture6_live.pdf)
