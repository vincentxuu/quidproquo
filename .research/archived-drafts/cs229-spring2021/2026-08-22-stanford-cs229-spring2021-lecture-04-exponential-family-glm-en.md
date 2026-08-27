---
title: "Stanford CS229 Lecture 4: How the Exponential Family Unifies GLMs"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, stanford, exponential-family, generalized-linear-models]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 5
tldr: "Lecture 4 uses p(y;η)=b(y)exp(ηᵀT(y)-a(η)) to unify Gaussian, Bernoulli, and multinomial responses, then derives linear, logistic, and softmax regression through η=θᵀx."
description: "A reading of Stanford CS229 Spring 2021 Lecture 4: the exponential family, natural parameters, sufficient statistics, the GLM recipe, and softmax regression."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-spring2021-lecture-04-exponential-family-glm)

This is post 5 in [Reading Stanford CS229](/en/series/stanford-cs229), covering **Stanford CS229, Spring 2021, Lecture 4**. The lecture took place on April 7, 2021, under the official title **Dataset split; Exponential family. Generalized Linear Models.** This article uses the Spring 2021 live lecture notes and Sections 6, 8, and 9 of the shared Supervised Learning notes assigned by the syllabus. The recording was not used. The public notes do not develop dataset splitting, so this article does not add a splitting procedure unsupported by the source.

The lecture explains why linear and logistic regression look related. Their similarity is not accidental. Both follow the same generalized linear model recipe: choose a probability distribution suited to the response, then connect that distribution's natural parameter linearly to the input.

## The exponential family is a shared representation

A family of distributions belongs to the exponential family if it can be written as:

```text
p(y; η) = b(y) exp(ηᵀT(y) - a(η))
```

`η` is the natural parameter, `T(y)` the sufficient statistic, `b(y)` a base measure depending only on the observation, and `a(η)` the log-partition function. The final term normalizes the density or probability mass to one.

The value of the representation is not brevity. Its shared derivative properties support many response types. The notes list Bernoulli, Gaussian, multinomial, Poisson, gamma, exponential, beta, and Dirichlet distributions. They are not the same distribution; they share this structural form.

## The sigmoid is not an arbitrary S-shaped curve

The Bernoulli probability mass is:

```text
p(y; φ) = φ^y (1-φ)^(1-y)
```

Rearranging it into exponential-family form yields the natural parameter:

```text
η = log(φ / (1-φ))
```

Solving for `φ` gives:

```text
φ = 1 / (1 + e^(-η))
```

That is the sigmoid. Lecture 3 accepted it as a sensible choice. Lecture 4 supplies the structural reason: for a Bernoulli response with the canonical link, the sigmoid follows from the relation between the natural parameter and the mean.

A fixed-variance Gaussian also belongs to the exponential family, with `η=μ` and `T(y)=y`. Its natural parameter is the mean, so its response function is the identity. Linear regression needs no sigmoid because Gaussian and Bernoulli responses relate their means to natural parameters differently.

## The three choices in the GLM recipe

The shared notes reduce GLM construction to three points:

1. Given `x`, let `y` follow an exponential-family distribution.
2. Predict `E[T(y)|x]`; in the common case, `T(y)=y`.
3. Relate the natural parameter linearly to the input: `η=θᵀx`.

Choose a Gaussian response and `E[y|x]=μ=η`, producing `hθ(x)=θᵀx`. Choose a Bernoulli response and `E[y|x]=φ=sigmoid(η)`, producing logistic regression. “Linear” describes the natural parameter, not necessarily a straight-line relationship between the input and response mean.

The recipe has boundaries. The distribution family is a modeling decision, not an answer announced by the data, and `η=θᵀx` is also a design choice. Count data with substantial overdispersion or excess zeros may violate a simple Poisson model even though Poisson belongs to the exponential family.

## Softmax extends the construction to multiple classes

When `y` has `k` discrete classes, use a multinomial response. Give each class a linear score `θ_iᵀx`, then use softmax to turn the scores into probabilities summing to one:

```text
P(y=i|x;θ) = exp(θ_iᵀx) / Σ_j exp(θ_jᵀx)
```

Every probability depends on all class scores. Raising one score reallocates probability mass across the full set. The live notes express training through cross-entropy. If the true class is `i`, the single-example loss is `-log p̂_i`; greater confidence in the correct class lowers the loss.

The parameterization must also address redundancy. Adding the same constant to every class score leaves softmax probabilities unchanged. The shared notes set one reference class's parameter vector to zero to anchor the representation. This is an identifiability choice, not a claim that the reference class has no features.

## Where Lecture 4 sits in the eighteen-lecture path

Lecture 4 places the first three lectures' models in a common language. A new response type no longer requires inventing a loss from scratch; first ask about its distribution, natural parameter, expectation, and link. Lecture 5 changes a different modeling choice: instead of directly fitting `p(y|x)`, it models `p(x|y)` and `p(y)`.

## Beyond the lecture

Choose three targets: a continuous value, a binary value, and a nonnegative count. For each, write a candidate response distribution, the form of `E[y|x]`, and its legal range. If the model can output values outside that range, its link or distribution has not been connected correctly.

## References

- [Stanford CS229 Spring 2021 syllabus](https://cs229.stanford.edu/syllabus-spring2021.html)
- [Supervised Learning notes, Sections 6, 8, and 9](https://cs229.stanford.edu/notes2020fall/notes2020fall/cs229-notes1.pdf)
- [Spring 2021 Lecture 4 live notes](https://cs229.stanford.edu/notes2021spring/notes2021spring/lecture4_draft.pdf)
