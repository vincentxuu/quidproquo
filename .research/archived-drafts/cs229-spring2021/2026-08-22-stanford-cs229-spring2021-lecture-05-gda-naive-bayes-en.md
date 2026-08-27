---
title: "Stanford CS229 Lecture 5: Generative Classification with GDA and Naive Bayes"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, stanford, gda, naive-bayes]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 6
tldr: "Lecture 5 moves from directly fitting p(y|x) to fitting p(x|y)p(y): GDA models continuous features with class Gaussians, while Naive Bayes uses conditional independence to control discrete-feature complexity."
description: "A reading of Stanford CS229 Spring 2021 Lecture 5: discriminative and generative learning, Gaussian discriminant analysis, shared covariance, and Naive Bayes."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-spring2021-lecture-05-gda-naive-bayes)

This is post 6 in [Reading Stanford CS229](/en/series/stanford-cs229), covering **Stanford CS229, Spring 2021, Lecture 5**. The lecture took place on April 12, 2021, under the official title **Gaussian discriminant analysis. Naive Bayes.** This article uses the Spring 2021 live lecture notes and Section 1 of the shared Generative Algorithms notes assigned by the syllabus. The recording was not used.

The lecture changes the question asked by a classifier. Logistic regression directly learns `p(y|x)`. A generative method first learns how each class produces features through `p(x|y)`, learns the class prior `p(y)`, and then uses Bayes' rule to recover the posterior needed for classification.

## Discriminative methods draw a boundary; generative methods describe both sides

Bayes' rule gives:

```text
p(y|x) = p(x|y)p(y) / p(x)
```

When the goal is only to choose the most probable class, `p(x)` is shared by every candidate `y`, so:

```text
argmax_y p(y|x) = argmax_y p(x|y)p(y)
```

A discriminative method can fit the boundary directly. A generative method separately describes the feature distribution of each class and asks which model makes a new observation more plausible. It learns more structure and must therefore make more assumptions.

## GDA: one center per class and one shared shape

Gaussian discriminant analysis (GDA) targets continuous features. Its binary model assumes:

```text
y ~ Bernoulli(φ)
x | y=0 ~ N(μ₀, Σ)
x | y=1 ~ N(μ₁, Σ)
```

The classes have different mean vectors `μ₀` and `μ₁` but share a covariance matrix `Σ`. Geometrically, their Gaussian contours have the same shape and orientation with different centers. Training estimates `φ` as the positive-class fraction, each `μ` as its class mean, and `Σ` from deviations around the corresponding class centers.

Prediction compares `p(x|y)p(y)`. Shared covariance makes the log posterior odds linear in `x`, producing a line or hyperplane as the decision boundary. The notes also show that GDA's `p(y=1|x)` has logistic form. The reverse does not hold: a logistic conditional does not imply class-conditional Gaussians with shared covariance.

## What does the stronger assumption buy?

When the Gaussian model for `p(x|y)` is approximately correct, GDA can use that structure and learn efficiently from fewer examples. When feature distributions are substantially non-Gaussian, logistic regression's weaker assumptions generally make it more robust.

This is not a ranking in which generative or discriminative learning always wins. The decision turns on whether the additional assumptions are credible. A generative model exchanges assumptions for data efficiency; misspecified assumptions also encode more incorrect structure.

## Naive Bayes: conditional independence avoids combinatorial explosion

Lecture 5 next turns to high-dimensional discrete features. A spam message can be represented by a dictionary-sized binary vector: `x_j=1` when word `j` appears. With `d` words, a full model of `p(x|y)` has to address `2^d` possible vectors, which is infeasible.

Naive Bayes assumes that features are conditionally independent given the class:

```text
p(x|y) = Π_j p(x_j|y)
```

This does not assert that words are independent overall or that real emails are generated one independent word at a time. It factors the joint distribution only after spam or non-spam status is known. The number of parameters falls from exponential size to roughly one occurrence probability per class and word.

The estimates have a direct counting interpretation: `p(x_j=1|y=1)` is the fraction of spam messages containing word `j`. Prediction multiplies the feature probabilities under each class and then multiplies by the prior. Lecture 6 addresses the product's clearest failure: a word absent from finite training data receives zero probability and can zero out the entire product.

## The model determines the data representation

GDA accepts continuous vectors and models covariance. The Naive Bayes example first turns email into a word-presence vector. Models do not operate on “raw data” without mediation; they depend on feature representation. Discretizing a continuous value permits Naive Bayes but loses within-bin information. Keeping it continuous for GDA incurs a Gaussian-shape assumption.

Choosing a model therefore also chooses how the data will be seen. No representation preserves every structure while introducing no assumptions.

## Where Lecture 5 sits in the eighteen-lecture path

Lecture 5 makes the course's first full switch between `p(y|x)` and `p(x|y)p(y)`. It turns Lecture 4's distributional modeling into a concrete classifier and previews the generative perspective used by later latent-variable methods. Lecture 6 completes Naive Bayes with smoothing and text event models before moving toward kernel methods.

## Beyond the lecture

For a binary continuous dataset, plot each class and inspect whether their scatter and covariance look roughly compatible before accepting GDA. For text, name two clearly related words and ask whether conditional independence is a useful computational approximation for the task or whether their co-occurrence structure is essential.

## References

- [Stanford CS229 Spring 2021 syllabus](https://cs229.stanford.edu/syllabus-spring2021.html)
- [Generative Algorithms notes, Section 1](https://cs229.stanford.edu/notes2020spring/cs229-notes2.pdf)
- [Spring 2021 Lecture 5 live notes](https://cs229.stanford.edu/notes2021spring/notes2021spring/lecture5_live.pdf)
