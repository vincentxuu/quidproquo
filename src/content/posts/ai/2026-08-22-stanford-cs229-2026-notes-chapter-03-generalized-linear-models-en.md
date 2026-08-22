---
title: "Generalized Linear Models: Unifying Regression and Classification"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, stanford, machine-learning, generalized-linear-models, exponential-family]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 4
tldr: "Chapter 3 uses exponential families, natural parameters, and link functions to place least squares and logistic regression inside one modeling template."
description: "A guided reading of Chapter 3 of the 2026 Stanford CS229 notes: exponential families, natural parameters, link functions, and GLMs."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-03-generalized-linear-models)

This article reads Chapter 3, “Generalized linear models,” on printed pages 30–34 of the [2026 CS229 main notes](https://cs229.stanford.edu/main_notes.pdf). It is a **chapter-by-chapter reading of the 2026 notes**, not a reconstruction of one quarter's recordings.

## Two algorithms are instances of one template

The first two chapters appear to handle unrelated output types, but both make the same move: choose an exponential-family conditional distribution for the output, then make its natural parameter a linear function of the input.

An exponential-family distribution has the form

\[
p(y;\eta)=b(y)\exp(\eta^TT(y)-a(\eta)).
\]

Here \(T(y)\) is the sufficient statistic, \(\eta\) the natural parameter, and \(a(\eta)\) the log-partition term that normalizes the distribution. Gaussian, Bernoulli, multinomial, and Poisson distributions all fit this form.

## The three GLM choices

A generalized linear model assumes:

1. Given \(x\), the output \(y\) follows an exponential-family distribution.
2. The model predicts \(E[T(y)\mid x]\).
3. The natural parameter satisfies \(\eta=\theta^Tx\), with one linear predictor per natural parameter when necessary.

The map from \(\eta\) to the mean is the response function; its inverse is commonly called the link function. A sigmoid is therefore not an arbitrary final wrapper. It follows from the relationship between a Bernoulli mean and its natural parameter.

## Gaussian gives linear regression; Bernoulli gives sigmoid

A Gaussian with fixed variance can be rearranged into exponential-family form. The notes set \(\sigma^2=1\), under which the natural parameter equals the mean. Setting \(\eta=\theta^Tx\) therefore makes the conditional mean \(\theta^Tx\), recovering ordinary linear regression; another fixed variance rescales the natural parameter.

For a Bernoulli distribution, the natural parameter is the log-odds:

\[
\eta=\log\frac{\phi}{1-\phi}.
\]

Solving for \(\phi\) gives \(1/(1+e^{-\eta})\). Substituting \(\eta=\theta^Tx\) produces logistic regression. Applying the same construction to the multinomial distribution yields softmax.

## What the framework does not decide for you

A GLM does not guarantee that the chosen output distribution is correct or that the natural parameter is truly linear in the features. The equation \(\eta=\theta^Tx\) is a modeling choice, not a theorem forced by the exponential family. Overdispersion, excess zeros, dependent observations, or an unsuitable link can all create mismatch.

The model is also conditional: it describes \(y\mid x\) but not the distribution of \(x\). Chapter 4's GDA and Naive Bayes take the generative route and model \(p(x\mid y)\) together with \(p(y)\). This chapter's role is to turn Chapters 1 and 2 into a reusable design recipe.

## Self-study exercise

Choose a count-data problem. Assume \(y\mid x\) is Poisson, write the distribution in exponential-family form, identify the relationship between its natural parameter and conditional mean, and derive the response function under \(\eta=\theta^Tx\). Then name two reasons the Poisson assumption might fail on your data.

## References

- [CS229 Lecture Notes (2026-08-18), Chapter 3: Generalized linear models](https://cs229.stanford.edu/main_notes.pdf)
- [Stanford CS229 course site](https://cs229.stanford.edu/)
