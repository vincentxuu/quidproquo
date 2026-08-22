---
title: "Clustering and k-Means: A First Alternating-Optimization Algorithm"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, unsupervised-learning, clustering, k-means]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 11
tldr: "Chapter 10 introduces unsupervised learning through k-means: alternating updates make distortion non-increasing and numerically convergent, but do not guarantee a global optimum."
description: "A reading of Chapter 10 in the 2026 CS229 notes: k-means assignment and centroid updates, the distortion objective, coordinate descent, initialization, and local-optimum limits."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-10-clustering-k-means)

This is a chapter-by-chapter reading of Chapter 10, printed pages 147–149, in the 2026 [CS229 Lecture Notes](https://cs229.stanford.edu/main_notes.pdf). It follows the official notes and is **not a reconstruction of any quarter's recordings**. The chapter is only three pages long, and its purpose is precise: understand k-means as alternating optimization and state exactly what its convergence guarantee means.

Chapters 8 and 9 studied generalization and model selection with labeled data. Chapter 10 begins unsupervised learning. Given only $x^{(1)},\ldots,x^{(n)}$ and no targets $y$, the task is to organize the observations into $k$ internally cohesive groups.

## The algorithm alternates hard assignments and means

k-means initializes centers $\mu_1,\ldots,\mu_k$ and repeatedly performs two updates:

$$
c^{(i)}\leftarrow \arg\min_j\|x^{(i)}-\mu_j\|_2,
$$

$$
\mu_j\leftarrow
\frac{\sum_i \mathbf 1\{c^{(i)}=j\}x^{(i)}}
{\sum_i \mathbf 1\{c^{(i)}=j\}}.
$$

The first step assigns every example to exactly one nearest center. The second moves each center to the arithmetic mean of its assigned points. That mean is not arbitrary: under squared Euclidean distance, it is the point that minimizes within-cluster squared distances for fixed assignments.

## Distortion places both updates under one objective

Define

$$
J(c,\mu)=\sum_{i=1}^n\|x^{(i)}-\mu_{c^{(i)}}\|_2^2.
$$

With centers fixed, nearest-center assignments minimize $J$. With assignments fixed, the group means minimize $J$. K-means is therefore coordinate descent over $c$ and $\mu$. Every step leaves distortion unchanged or lowers it, so the value of $J$ converges.

That guarantee is narrow. Convergence of $J$ does not show that clusters have semantic meaning or that the global minimum was found. The notes mention a theoretical possibility of cycling among assignments with identical objective values; in practice, sensitivity to local optima and initialization is the more common concern.

## The distance function hides geometric assumptions

k-means favors clusters that are roughly spherical around a mean and comparable in scale. Feature units directly affect Euclidean distance, so one large-scale coordinate can dominate every assignment unless preprocessing reflects the problem's intended geometry. Outliers can also pull arithmetic means strongly.

$k$ must be chosen in advance. Distortion naturally decreases as $k$ grows, so training distortion alone cannot justify increasing $k$ without limit. An implementation must also handle empty clusters, whose centroid update has a zero denominator; the chapter's compact formula does not cover that engineering case.

## Initialization and restarts

One simple initialization chooses $k$ training examples as the initial centers. Because the objective is non-convex, different starts can end at different local solutions. The notes recommend several random restarts followed by choosing the run with the lowest distortion. This reduces the chance of a poor local solution but does not prove global optimality.

## Connections to adjacent chapters

Chapter 9 selected among candidate models using validation data. Chapter 10 assumes $k$ is already fixed and focuses on alternating assignments and parameters. Chapter 11 replaces each hard assignment with posterior probabilities under a Gaussian mixture and uses the ELBO to explain why general EM monotonically improves likelihood.

## Self-study exercise

Create two two-dimensional datasets: three similarly sized circular clusters and two elongated, overlapping crescent shapes. Run k-means from ten random initializations on each dataset. Record final distortion and inspect the assignments. Ask whether the lowest-distortion result always matches the grouping you intended.

## References

- [CS229 Lecture Notes (2026), Chapter 10: k-means assignments and centroid updates](https://cs229.stanford.edu/main_notes.pdf#page=148)
- [CS229 Lecture Notes (2026), Chapter 10: Distortion and coordinate descent](https://cs229.stanford.edu/main_notes.pdf#page=149)
- [CS229 Lecture Notes (2026), Chapter 10: Local optima and random restarts](https://cs229.stanford.edu/main_notes.pdf#page=150)
