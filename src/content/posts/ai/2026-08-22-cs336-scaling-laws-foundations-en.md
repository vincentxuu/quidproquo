---
title: "CS336 Lecture 9: Scaling Laws Are Extrapolation Tools, Not Crystal Balls"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs336, scaling-laws, llm, training, evaluation]
lang: en
series:
  name: "Reading Stanford CS336"
  order: 10
tldr: "Lecture 9 begins with log-log linear relationships between data and error, then uses scaling laws to compare architectures, optimizers, batches, and model-data allocations. The Chinchilla dispute shows how fitting methods, observed ranges, and deployment objectives change the answer."
description: "A guide to Stanford CS336 Spring 2026 Lecture 9: data scaling, power laws, critical batch size, μP, IsoFLOPs, and Kaplan versus Chinchilla compute-optimal scaling."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs336-scaling-laws-foundations)

This post covers **CS336 Spring 2026 Lecture 9: Scaling laws**, taught by Tatsunori Hashimoto on April 27, 2026. Its primary source is the official [`lecture_09.pdf`](https://github.com/stanford-cs336/lectures/blob/main/lecture_09.pdf).

Discovering that a model is too large, data too scarce, or the learning rate wrong during the final run wastes an irreversible budget. Scaling laws use a set of smaller experiments to establish simple, testable relationships and predict an expensive region. They are not guaranteed laws of the future but tools for experimental design and uncertainty management.

## Why power laws appear as straight lines

Many learning curves express error as a power law of dataset size. They become approximately linear on a log-log plot. The slope represents marginal returns from more data; the offset captures broad differences in quality, distribution, or method.

Monotonic decrease alone does not imply a power law. The lecture uses mean estimation and nonparametric learning to show how statistical convergence naturally produces polynomial rates. Similar neural-network behavior may relate to intrinsic data dimension, but that remains an explanatory framework rather than a complete cause.

## Data is more than a token count

Data composition can change the curve's offset, and distribution shift can make its slope fail downstream. Repeated examples have diminishing value, so selection and mixture policies should change with training scale when data is finite.

This is where blind extrapolation breaks. A scaling curve is measured under a particular distribution, tokenizer, architecture, optimizer, and training recipe. Change one and old coefficients may no longer apply. The curve also describes an achievable trend; engineering failures can always do worse.

## Scaling laws can eliminate architecture choices early

Comparing Transformers with LSTMs does not require training both at GPT-3 scale. Fit curves from several smaller points and inspect slopes and crossovers. Optimizers, depth-to-width choices, and head configurations can be tested for whether their effect persists with scale.

Some hyperparameters transfer from small models and others do not. μP-like methods choose a parameterization intended to keep settings such as the best learning rate stable as width changes. Critical batch size identifies where larger batches stop reducing steps efficiently relative to the additional examples processed.

MoE also shows that “parameter count” has multiple meanings. Total parameters, active parameters, and compute no longer move together, so dense-model parameter fits do not transfer directly.

## Compute-optimal scaling chooses both N and D

At fixed training compute `C`, model parameters `N` and data tokens `D` admit many allocations. A small model trained on more data and a large model trained on less can consume similar FLOPs. Compute-optimal scaling seeks the lowest loss at fixed `C`.

Kaplan and Chinchilla produced different allocations, and the lecture uses them to illustrate methodology. Common approaches include taking minima across all training curves, sweeping model sizes at fixed FLOP budgets through IsoFLOPs, or jointly fitting a grid over `(N, D)`. Data range, schedules, and fitting details alter exponents; the original Chinchilla joint fit was later challenged through data reconstruction and reanalysis.

Do not copy a universal tokens-per-parameter constant. Preserve runs, loss definitions, compute accounting, fitted equations, and residuals, and verify that the target region remains supported by observations.

## Training-optimal is not deployment-optimal

Chinchilla asks for minimum loss under fixed training compute. A product also pays for extensive inference over its lifetime. A smaller model trained on more tokens may be suboptimal for training alone while reducing serving latency and cost. Distillation, quantization, and hardware constraints also change the objective.

Write the objective before the scaling experiment: does it count only pretraining or expected inference tokens too? Does it optimize validation loss, downstream score, or wall-clock time? Without an objective function, “compute-optimal” is incomplete.

## A reproducible scaling experiment

Choose several model sizes and token budgets while fixing tokenizer, data mixture, and optimizer recipe. Save actual FLOPs and validation loss for every point. Plot log-log curves, fit a power law, and inspect residuals. Hold out the largest point from fitting and use it to test extrapolation. If that holdout misses badly, do not extend the curve into a more expensive region.

Lecture 9's value is not a permanent exponent. It turns “we think scaling will work” into a prediction that smaller experiments can falsify.

## Material fidelity

This lecture has a Spring 2026 schedule entry and a complete official PDF. This guide covers data scaling, model engineering, and compute-optimal scaling without importing Lecture 11's practical material early.

## References

- [CS336 Spring 2026 course and schedule](https://cs336.stanford.edu/)
- [Lecture 9 official slides](https://github.com/stanford-cs336/lectures/blob/main/lecture_09.pdf)
- [Scaling Laws for Neural Language Models](https://arxiv.org/abs/2001.08361)
- [Training Compute-Optimal Large Language Models](https://arxiv.org/abs/2203.15556)

