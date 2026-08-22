---
title: "Generative Learning Algorithms: GDA, Naive Bayes, and Smoothing"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, stanford, machine-learning, generative-models, naive-bayes]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 5
tldr: "Chapter 4 models p(x|y) and p(y), using GDA, Naive Bayes, and Laplace smoothing to expose both the power and price of generative classification."
description: "A guided reading of Chapter 4 of the 2026 Stanford CS229 notes: GDA, Naive Bayes, event models, and Laplace smoothing."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-04-generative-learning-algorithms)

This article reads Chapter 4, “Generative learning algorithms,” on printed pages 35–48 of the [2026 CS229 main notes](https://cs229.stanford.edu/main_notes.pdf). It is a **chapter reading of the 2026 notes**, not a reconstruction of one quarter's recordings. The notes label Naive Bayes as optional reading, which is the appropriate weight to give that section.

## Discriminative and generative routes

Logistic regression learns \(p(y\mid x)\) directly. A generative classifier instead learns a class prior \(p(y)\) and class-conditional input model \(p(x\mid y)\), then applies Bayes' rule:

\[
p(y\mid x)=\frac{p(x\mid y)p(y)}{p(x)}.
\]

The denominator is shared across classes, so prediction only needs to maximize \(p(x\mid y)p(y)\). The model describes more of the data-generating process and consequently assumes more.

## GDA: shared covariance creates a linear boundary

Gaussian discriminant analysis assumes a Bernoulli class label and

\[
x\mid y=0\sim\mathcal N(\mu_0,\Sigma),\qquad
x\mid y=1\sim\mathcal N(\mu_1,\Sigma).
\]

Classes have different means but share a covariance matrix. Maximum-likelihood estimates are intuitive: \(\phi\) is the positive-class fraction, each \(\mu\) is its class sample mean, and \(\Sigma\) is the covariance pooled around the appropriate class means.

After applying Bayes' rule, \(p(y=1\mid x)\) has sigmoid form, giving GDA a linear boundary. The converse is false: a logistic posterior does not imply Gaussian class-conditionals with shared covariance. GDA can be statistically efficient when its stronger assumptions are close to reality and brittle when they are not.

## Naive Bayes trades dependence for estimability

For high-dimensional text, estimating every joint configuration of \(x\) is impossible. Naive Bayes assumes conditional independence given the class:

\[
p(x\mid y)=\prod_jp(x_j\mid y).
\]

That assumption is the “naive” part. It is rarely literally true, but it replaces an exponentially large joint table with one-dimensional probabilities estimated by counting. The Bernoulli event model records whether a word occurs; the multinomial event model treats a document as a sequence of word events and preserves repeated counts. They define different sample spaces and require different formulas.

## Laplace smoothing is essential

If a word never occurs in one training class, maximum likelihood assigns probability zero, making the probability of any document containing it zero. Add-one smoothing adds one to each count and adjusts the denominator by the number of possible outcomes. It introduces bias but prevents “unseen” from being treated as “impossible.”

## Limits and chapter connections

GDA is sensitive to Gaussian shape and shared covariance. Naive Bayes ignores feature dependence, and its probability values are often poorly calibrated. Products of many small probabilities should also be computed in log space to avoid numerical underflow.

This chapter contrasts with Chapter 3's conditional modeling. Chapter 5 takes a different route: it specifies no distribution for inputs and instead extends linear algorithms through similarity computations in a feature space.

## Self-study exercise

Train logistic regression and GDA on the same binary dataset, first with approximately Gaussian classes and then with skew or outliers. Separately, calculate Bernoulli Naive Bayes by hand for ten short documents and observe how one unseen word collapses a class probability without smoothing.

## References

- [CS229 Lecture Notes (2026-08-18), Chapter 4: Generative learning algorithms](https://cs229.stanford.edu/main_notes.pdf)
- [Stanford CS229 course site](https://cs229.stanford.edu/)
