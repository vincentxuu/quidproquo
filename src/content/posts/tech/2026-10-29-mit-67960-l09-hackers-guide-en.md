---
title: "MIT 6.7960 L09: Hacker's Guide to Deep Learning — Practical Know-How to Make Nets Actually Obey"
date: 2026-10-29
category: tech
tags:
  - mit-67960
  - deep-learning
  - training-tricks
  - debugging
  - fall-2024
lang: en
description: "MIT 6.7960 Fall 2024 OCW Lecture 9 (Phillip Isola): turning deep-learning theory into results that actually train — data-first, overfit a mini-batch first, the LR/regularization trade-off, and a reproducible training recipe."
tldr: "Training neural nets is closer to engineering than magic: look at the data, overfit a mini-batch to prove capacity exists, then regularize back the generalization; learning rate is always the highest-leverage knob."
draft: false
series:
  name: "MIT 6.7960 導讀 (Fall 2024 OCW)"
  order: 11
additionalSeries:
  - name: "Global AI/CS Course Map"
    order: 17
---

> 🌏 [中文版](/posts/tech/2026-10-29-mit-67960-l09-hackers-guide)

> **Source version**: based on **MIT 6.7960 Fall 2024 OCW**. Videos, slides, and assignments are public at [MIT OCW](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/). This lecture is taught by **Phillip Isola**; references include *Recipes for Training Neural Networks* and Google's *Rules of ML*.

---

## What gap this lecture fills

Earlier lectures covered architectures, optimization, and regularization — all "correct knowledge", but none told you **what to do when the loss refuses to move for three days**. Lecture 9 is that "survival manual for practice".

The core mindset: **training neural networks is engineering, not alchemy**. It can be systematized, debugged, and reduced to a repeatable procedure.

## 1. Data first

The vast majority of "model doesn't work" problems trace back to data:

- **Look at the data yourself**: sample a few dozen examples, confirm labels are sane, no obvious mislabels, input ranges are normal.
- **Check train/val distribution**: if the validation set diverges from training, no model will generalize.
- **Build the simplest baseline**: a trivial rule (e.g., "always predict the majority class") gives you the accuracy floor to beat.

## 2. Overfit a mini-batch first

The most underrated step. Before any real training, **take a tiny number of samples (even one batch) and tune the model until it memorizes them (train loss → 0)**.

- If you can't: capacity too small, LR wrong, or a bug in data/forward pass. Fix this before talking about generalization.
- If you can: your pipeline is sound; what remains is just balancing capacity against regularization.

This single step eliminates ~80% of low-level errors (dimension mismatches, dead activations, vanishing gradients) within five minutes.

## 3. Learning rate: the highest-leverage knob

If you can tune only one hyperparameter, tune the learning rate. Practical guidance:

- **Sweep a range first** (e.g., 1e-1, 1e-2, 1e-3, 1e-4) to see which makes loss drop stably.
- **Use warmup + decay**: a small LR early avoids destroying random init, ramp up, then decay late.
- **When batch grows, LR usually grows too** (linear scaling rule: batch ×k → LR ≈ ×k, up to the critical batch size).

## 4. Regularization is "putting generalization back"

After overfitting the mini-batch proves capacity exists, regularize the generalization back:

- **Dropout**: randomly disable neurons during training, forcing redundant representations.
- **Weight decay (L2)**: penalize large weights, making the solution smoother.
- **Data augmentation**: synthesize data without changing label semantics — the cheapest regularization.
- **Early stopping**: stop when validation loss starts rising; effectively regularizing on "training steps".

The always-valid diagnostic is the **train/val loss gap**: large gap = overfitting (add regularization); high train loss itself = underfitting (add capacity or train longer).

## 5. A reproducible recipe

Turn the above into an order you follow every time:

1. Look at data, build a baseline.
2. Overfit a mini-batch, confirm the pipeline works.
3. Run on full data at medium capacity, tuning only the learning rate.
4. Inspect the train/val gap, decide between more regularization or more capacity.
5. Only then do "fine-tuning": activation choice, normalization style, architectural details.

Never start with the fanciest architecture plus a pile of tricks — that leaves you unable to tell which change actually helped.

## 6. Monitoring and a debugging checklist

When loss won't drop, check in this order:

- Is the LR too large (loss oscillates/diverges) or too small (flatlined)?
- Are inputs properly normalized (mean 0, variance 1)?
- Did a whole layer of activations die (all zero after ReLU)?
- Are gradients vanishing/exploding (check gradient norm)?
- Did the data pipeline corrupt labels or break shuffling?

## Why this matters in practice

The value of this lecture is not any single trick but **establishing a controllable experiment flow**. With a repeatable recipe, every failed experiment becomes diagnosable instead of "try a different random seed".

## References
- MIT 6.7960 OCW (Fall 2024): [course home](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)
- Andrej Karpathy, *A Recipe for Training Neural Networks*: [karpathy.github.io](https://karpathy.github.io/2019/04/25/recipe/)
- Google, *Rules of Machine Learning: Best Practices for ML Engineering*: [developers.google.com](https://developers.google.com/machine-learning/guides/rules-of-ml)
- Slav Ivanov, *37 Reasons why your neural network is not working*: [blog.slavv.com](https://blog.slavv.com/37-reasons-why-your-neural-network-is-not-working-TPwyE4xazNO)

