---
title: "Generalization: Bias–Variance, Double Descent, and Sample Complexity"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, generalization, bias-variance, learning-theory]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 9
tldr: "Chapter 8 decomposes test MSE into irreducible noise, squared bias, and variance, then uses uniform convergence and VC dimension to explain when training performance transfers to new data. Double descent shows why parameter count is not a universal measure of complexity."
description: "A reading of Chapter 8 in the 2026 CS229 notes: bias–variance decomposition, model-wise and sample-wise double descent, Hoeffding bounds, uniform convergence, sample complexity, and VC dimension."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-08-generalization)

This is a chapter-by-chapter reading of Chapter 8, printed pages 115–136, in the 2026 [CS229 Lecture Notes](https://cs229.stanford.edu/main_notes.pdf) by Tengyu Ma and Andrew Ng. It is **not a reconstruction of any quarter's recordings or lecture schedule**. The aim is to preserve the chapter's line of argument, not reproduce every proof.

The first seven chapters explain how models learn. Chapter 8 asks the harder question: why can a model with tiny training error still fail on new data? That question moves the course from algorithms into generalization and learning theory.

## Decomposing test error into bias and variance

The chapter builds intuition with polynomial regression. A linear model cannot express a genuinely quadratic relationship, so it remains wrong even with unlimited data: high bias. A fifth-degree polynomial can interpolate a small training set, yet change wildly when the dataset changes: high variance. Bias is an expressive limitation of the model family; variance is sensitivity to the randomness of a finite sample.

For a fixed test input $x$, let $y=h^*(x)+\xi$ with noise variance $\sigma^2$, and let $\hat h_S$ be the predictor trained on dataset $S$. Define the hypothetical average predictor $h_{avg}(x)=\mathbb E_S[\hat h_S(x)]$. Then

$$
\operatorname{MSE}(x)=\sigma^2+
\bigl(h^*(x)-h_{avg}(x)\bigr)^2+
\mathbb E_S\bigl[(h_{avg}(x)-\hat h_S(x))^2\bigr].
$$

The terms are irreducible noise, squared bias, and variance. The operational lesson matters more than the labels: address bias by increasing useful expressiveness; address variance with more data, stronger regularization, or a smaller effective model class. This clean identity is specific to squared-error regression. The notes explicitly warn that classification has no equally agreed-upon decomposition.

## Double descent revises the classical U-shaped curve

The classical story says that test error first falls as bias decreases, then rises as variance takes over. Chapter 8 adds the double-descent pattern seen in modern models. Error may peak near the interpolation threshold, where the model first becomes large enough to fit the training set perfectly, and then fall again in the overparameterized regime.

This does not imply that making a model larger always helps. The notes connect the peak near $n\approx d$ to shortcomings of the learning procedure and show that well-tuned regularization can mitigate both model-wise and sample-wise double descent. They also note that parameter count may be the wrong horizontal axis: in a linear example, plotting error against the learned model's norm produces a relationship closer to the classical picture. The question is effective complexity, which Chapter 9 makes operational.

## From training error to uniform convergence

Learning theory places classifiers in a hypothesis class $H$. Training error $\hat\epsilon(h)$ is the observed error rate; generalization error $\epsilon(h)$ is the probability of error on a fresh example from the same distribution. Hoeffding's inequality controls the gap for one fixed hypothesis. Applying a union bound to finite $H$ controls every hypothesis at once:

$$
\Pr\!\left(\exists h\in H:
|\epsilon(h)-\hat\epsilon(h)|>\gamma\right)
\le 2|H|e^{-2\gamma^2n}.
$$

This is uniform convergence. The number of samples needed grows only logarithmically with $|H|$. It also lets us show that the empirical-risk minimizer $\hat h$ has generalization error close to the best member $h^*$ of the class.

## Infinite classes and VC dimension

Real-valued parameterizations contain infinitely many hypotheses, so counting $|H|$ fails. VC dimension instead asks for the largest set of points on which $H$ can realize every binary labeling. Because this shattering capacity belongs to the function class, it avoids being fooled by redundant parameterizations of the same classifiers.

The Vapnik result presented in the notes says that finite VC dimension $D$ implies uniform convergence. With accuracy and confidence fixed, the required number of samples scales roughly linearly with $D$. This is a directional guarantee, not a promise that every modern non-ERM training pipeline has the same constants or a tight practical bound.

## Assumptions, limits, and the handoff to Chapter 9

The theory mainly assumes iid training examples, the same train and test distribution, and a procedure centered on empirical risk minimization. Domain shift, dependent time series, selection bias, or algorithms far from ERM require different arguments. VC bounds are also often qualitative safeguards rather than precise forecasts of test performance.

The chapter follows deep learning by separating successful optimization from successful generalization. Chapter 9 turns that diagnosis into controls: explicit penalties, optimizer-induced preferences, and validation-based model selection.

## Self-study exercise

Generate several noisy datasets from the same quadratic function. Fit linear, quadratic, and fifth-degree polynomials to each dataset. Compare average test error and plot all fitted curves. The average displacement from the truth reflects bias; variation among curves trained on different samples reveals variance.

## References

- [CS229 Lecture Notes (2026), Chapter 8.1: Bias–variance tradeoff](https://cs229.stanford.edu/main_notes.pdf#page=118)
- [CS229 Lecture Notes (2026), Chapter 8.2: Double descent](https://cs229.stanford.edu/main_notes.pdf#page=124)
- [CS229 Lecture Notes (2026), Chapter 8.3: Sample complexity and VC dimension](https://cs229.stanford.edu/main_notes.pdf#page=129)
