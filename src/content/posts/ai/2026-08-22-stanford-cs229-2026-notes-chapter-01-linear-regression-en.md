---
title: "Linear Regression: From LMS to Locally Weighted Regression"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, stanford, machine-learning, linear-regression, self-study]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 2
tldr: "Linear regression is more than a best-fit line: Chapter 1 connects squared loss to gradient descent, normal equations, maximum likelihood, and locally weighted regression."
description: "A guided reading of Chapter 1 of the 2026 Stanford CS229 notes: LMS, normal equations, probabilistic interpretation, and locally weighted regression."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-01-linear-regression)

This article reads Chapter 1, “Linear regression,” on printed pages 9–20 of the [2026 CS229 main notes](https://cs229.stanford.edu/main_notes.pdf). It is a **chapter-by-chapter reading of the 2026 notes**, not a reconstruction of any quarter's recordings or lecture schedule.

## Why the notes begin with linear regression

CS229 uses linear regression to establish the language reused throughout the course: hypotheses, losses, optimization, statistical assumptions, and the distinction between parametric and nonparametric learning. The model is \(h_\theta(x)=\theta^T x\), with the intercept absorbed into a feature fixed at one.

The objective is

\[
J(\theta)=\frac12\sum_{i=1}^n(h_\theta(x^{(i)})-y^{(i)})^2.
\]

The factor \(1/2\) does not alter the minimizer; it merely cancels a factor of two after differentiation. The point is to turn an objective into an executable learning rule.

## LMS: one gradient, two execution models

For one example, differentiation gives

\[
\theta_j\leftarrow\theta_j+\alpha(y^{(i)}-h_\theta(x^{(i)}))x_j^{(i)}.
\]

Batch gradient descent computes each step from the entire dataset. Stochastic gradient descent updates after each example. Batch directions are stable but expensive; SGD obtains a noisy direction cheaply and moves more often. With a fixed learning rate, SGD may continue oscillating around the optimum, while a decreasing rate can support more precise convergence.

Squared loss is a convex quadratic, so this problem has no bad local minima. Convexity does not rescue an excessive learning rate, however: oversized steps can still diverge.

## Normal equations and the probabilistic interpretation

Stacking examples into a design matrix \(X\) and setting the gradient to zero yields

\[
X^TX\theta=X^Ty,
\qquad
\theta=(X^TX)^{-1}X^Ty.
\]

The second expression assumes \(X^TX\) is invertible. Duplicate features, too few observations, or high dimensionality can violate that assumption. Numerical solvers are also preferable to explicitly forming the inverse.

The chapter then assumes independent Gaussian errors with constant variance: \(y^{(i)}=\theta^Tx^{(i)}+\epsilon^{(i)}\). Under that model, maximizing likelihood is exactly equivalent to minimizing squared error. This does not assert that real errors must be Gaussian; it identifies the probability model under which least squares is maximum likelihood.

## Locally weighted regression

Locally weighted regression gives observations near a query \(x\) more influence, for example

\[
w^{(i)}=\exp\left(-\frac{\|x^{(i)}-x\|_2^2}{2\tau^2}\right),
\]

and minimizes a weighted squared error. A large bandwidth \(\tau\) approaches a global fit; a small one follows local structure but is more sensitive to noise. This is nonparametric learning: prediction still needs the stored training data rather than only a fixed-size parameter vector.

## Assumptions, limits, and the next chapters

A linear model assumes the conditional mean can be represented linearly in the chosen features. Squared loss also gives outliers disproportionate influence. Local weighting adds flexibility at the price of query-time computation and bandwidth selection.

Chapter 2 keeps a linear score but replaces continuous outputs with class probabilities and logistic likelihood. Chapter 3 will then show that linear and logistic regression are both instances of generalized linear models.

## Self-study exercise

On one one-dimensional dataset, implement batch gradient descent, SGD, the normal equations, and locally weighted regression with three bandwidths. Plot every fitted curve, compare mean squared errors, and test whether fixed-rate SGD keeps oscillating while a decaying rate settles.

## References

- [CS229 Lecture Notes (2026-08-18), Chapter 1: Linear regression](https://cs229.stanford.edu/main_notes.pdf)
- [Stanford CS229 course site](https://cs229.stanford.edu/)
