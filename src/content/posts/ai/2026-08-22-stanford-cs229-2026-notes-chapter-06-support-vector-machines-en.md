---
title: "Support Vector Machines: Margins, Duality, and SMO"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, stanford, machine-learning, svm, optimization]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 7
tldr: "Chapter 6 formalizes classification confidence as geometric margin, then builds an implementable SVM through Lagrange duality, kernels, and SMO."
description: "A guided reading of Chapter 6 of the 2026 Stanford CS229 notes: margins, SVM duality, soft margins, kernels, and SMO."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-06-support-vector-machines)

This article reads Chapter 6, “Support vector machines,” on printed pages 60–78 of the [2026 CS229 main notes](https://cs229.stanford.edu/main_notes.pdf). It is a **chapter-by-chapter reading of the 2026 notes**, not a reconstruction of any quarter's recordings.

## From correct classification to distance from the boundary

Two hyperplanes may classify every training point correctly while differing greatly in robustness. SVMs express that difference through margins. With \(y\in\{-1,1\}\) and score \(w^Tx+b\), an example's functional margin is

\[
\hat\gamma^{(i)}=y^{(i)}(w^Tx^{(i)}+b).
\]

A positive value means correct classification, and a larger value appears more confident. Yet multiplying both \(w\) and \(b\) by ten leaves the boundary unchanged while multiplying the functional margin by ten.

Dividing by \(\|w\|\) gives the geometric margin, which is invariant to common rescaling and corresponds to signed distance from the hyperplane. The dataset margin is the minimum over examples, so maximizing it protects the points nearest the boundary.

## Turning maximum margin into convex optimization

For linearly separable data, scaling freedom lets us set the smallest functional margin to one and solve

\[
\min_{w,b}\frac12\|w\|^2
\quad\text{s.t.}\quad
y^{(i)}(w^Tx^{(i)}+b)\ge1.
\]

This has a convex quadratic objective and linear constraints. Minimizing \(\|w\|\) maximizes geometric margin while eliminating the awkward normalization constraint.

## The dual opens the door to kernels

The notes introduce generalized Lagrangians, primal and dual problems, weak and strong duality, and KKT conditions. In the SVM dual, training data appear only through \(x^{(i)T}x^{(j)}\), so Chapter 5's kernel can replace every inner product.

The resulting weight vector is \(w=\sum_i\alpha_i y^{(i)}x^{(i)}\). Only examples with \(\alpha_i>0\) affect the boundary: the support vectors. The name is literal—the classifier is supported by points on or inside the margin rather than depending equally on every observation.

## Soft margins and the role of C

Real datasets are rarely perfectly separable. A soft-margin SVM introduces slack variables \(\xi_i\) and minimizes

\[
\min_{w,b,\xi}\frac12\|w\|^2+C\sum_i\xi_i
\quad\text{s.t.}\quad
y^{(i)}(w^Tx^{(i)}+b)\ge 1-\xi_i,\qquad \xi_i\ge0.
\]

A large \(C\) penalizes violations heavily and favors training fit; a small \(C\) tolerates more violations to obtain a wider margin. In the dual, the constraints become \(0\le\alpha_i\le C\).

## Why SMO updates two variables

Sequential minimal optimization updates two dual variables at a time. The equality constraint \(\sum_i\alpha_i y^{(i)}=0\) means changing only one variable would generally leave the feasible set. Once all other variables are fixed, the pair is tied by the equality, reducing the step to a one-dimensional quadratic problem whose solution is clipped to its feasible interval.

## Assumptions, limits, and the next chapter

Hard-margin SVM assumes separability. Soft margins are more practical but still require choosing \(C\), a kernel, and kernel hyperparameters. Kernel SVMs can struggle at large sample sizes because of Gram-matrix and quadratic-optimization costs, and calibrated probabilities are not a native output.

This chapter realizes Chapter 5's main kernel application and contrasts with Chapter 2: logistic regression optimizes likelihood and emits probabilities, while SVM optimizes margin. Chapter 7 moves to neural networks and learns nonlinear multilayer representations directly.

## Self-study exercise

On separable two-dimensional data, draw the maximum-margin line, both margin boundaries, and the support vectors. Add one outlier, fit soft-margin SVMs with three values of \(C\), and record how margin width, violations, and the number of support vectors change.

## References

- [CS229 Lecture Notes (2026-08-18), Chapter 6: Support vector machines](https://cs229.stanford.edu/main_notes.pdf)
- [John Platt, Sequential Minimal Optimization: A Fast Algorithm for Training Support Vector Machines](https://www.microsoft.com/en-us/research/publication/sequential-minimal-optimization-a-fast-algorithm-for-training-support-vector-machines/)
