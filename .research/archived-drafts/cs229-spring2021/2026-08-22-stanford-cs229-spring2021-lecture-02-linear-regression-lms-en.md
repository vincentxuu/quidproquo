---
title: "Stanford CS229 Lecture 2: From Linear Regression Error to LMS"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, stanford, linear-regression, gradient-descent]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 3
tldr: "Lecture 2 writes supervised learning as hθ(x)=θᵀx, defines a squared-error objective, and compares gradient descent, mini-batches, and the normal equation as routes to the same fit."
description: "A reading of Stanford CS229 Spring 2021 Lecture 2: the supervised-learning setup, linear regression, LMS, gradient descent, mini-batches, and the normal equation."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-spring2021-lecture-02-linear-regression-lms)

This is post 3 in [Reading Stanford CS229](/en/series/stanford-cs229), covering **Stanford CS229, Spring 2021, Lecture 2**. The lecture took place on March 31, 2021, under the official title **Supervised learning setup. LMS.** This article uses the Spring 2021 live lecture notes and Sections 1–3 of the shared Supervised Learning notes assigned by the syllabus. The recording was available only through Canvas and was not used as a source.

The lecture turns “learn to predict from examples” into three layers: define a hypothesis, define its error, then choose a way to reduce that error. Linear regression is not introduced because every real relation is a line. It is introduced because it connects a model, objective, and optimization procedure in one complete example.

## From a data table to a hypothesis

Let each input be `x ∈ R^d` and the parameter vector be `θ ∈ R^(d+1)`. After defining a constant feature `x₀=1`, the linear hypothesis becomes:

```text
hθ(x) = θᵀx
```

In the housing example, features can include floor area, bedrooms, and lot size. `θ_j` controls the linear contribution of feature `j`. The important benefit is a uniform vector representation: many features and the intercept all fit into one inner product.

## Squared error makes “good” optimizable

The notes measure the distance between predictions and labels with least squares:

```text
J(θ) = 1/2 Σ_i (hθ(x^(i)) - y^(i))²
```

The factor `1/2` only cancels a constant during differentiation; it does not move the minimum. Squaring charges both positive and negative errors and magnifies large residuals. The model seeks parameters with low total squared error across the training set rather than requiring every observation to be matched exactly.

That choice also sets a limitation. Squared error is sensitive to outliers. With heavy-tailed label noise, a few extreme observations can dominate the fit. Lecture 2 establishes a baseline; it does not claim that this loss matches every noise process.

## LMS follows the slope downhill

Gradient descent repeatedly differentiates the objective and moves parameters in the opposite direction:

```text
θ_j := θ_j - α ∂J(θ)/∂θ_j
```

For squared error, one example contributes a direction proportional to `(hθ(x)-y)x_j`. If a prediction is too high, the update moves in a direction that lowers it. Larger errors and larger feature values create a stronger push. The learning rate `α` controls the step: too large can overshoot; too small makes progress slow.

A full-batch update uses all training examples. Its direction is stable, but every step is expensive. The notes also introduce mini-batches, which estimate the gradient from `b` randomly selected examples. They trade a noisier direction for a cheaper step. This lecture provides no universal batch size; the practical instruction is to choose based on observed behavior.

## The normal equation is another solver, not another model

Linear least squares can also place all examples in a design matrix `X`. Its first-order condition is:

```text
XᵀX θ = Xᵀy
```

When the relevant matrix is invertible, this is commonly written as `θ=(XᵀX)⁻¹Xᵀy`. It finds the stationary point directly, without a learning rate or repeated updates. Gradient descent and the normal equation fit the same linear model to the same squared-error objective; they differ in how they solve it.

Direct linear algebra still depends on the feature count and numerical conditioning, and `XᵀX` need not be invertible. The formula should not be read as an instruction to construct an explicit inverse for every dataset. Lecture 2 establishes the closed-form route; an implementation must still use an appropriate numerical solver.

## Where Lecture 2 sits in the eighteen-lecture path

Lecture 2 establishes the grammar that CS229 repeatedly reuses: observations `(x,y)`, parameters `θ`, a hypothesis `hθ`, an objective `J`, and an update rule. Lecture 3 gives squared error a probabilistic interpretation and carries the same recipe into logistic regression. Even when the model later becomes a neural network, the course will still define a differentiable objective and search for better parameters.

## Beyond the lecture

Run full-batch and mini-batch updates on the same small dataset and record `J(θ)` after every step. Do not compare only final error. Plot update count against loss to see how a stable direction and a noisy direction trade per-step accuracy against per-step cost.

## References

- [Stanford CS229 Spring 2021 syllabus](https://cs229.stanford.edu/syllabus-spring2021.html)
- [Supervised Learning notes, Sections 1–3](https://cs229.stanford.edu/notes2020fall/notes2020fall/cs229-notes1.pdf)
- [Spring 2021 Lecture 2 live notes](https://cs229.stanford.edu/notes2021spring/notes2021spring/lecture2_draft.pdf)
