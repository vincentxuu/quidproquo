---
title: "Berkeley CS189 Spring 2025 Overview: HW1–7 with Code and Data You Can Run, Plus What Fall 2026 Looks Like"
date: 2026-08-22
category: learning
tags: [berkeley, cs189, machine-learning, open-course, learning-path]
lang: en
type: guide
difficulty: 進階
series:
  name: "Berkeley CS189 Spring 2025"
  order: 1
tldr: "Spring 2025 at people.eecs.berkeley.edu/~jrs/189s25 is the only A3 self-study edition with notes, videos, HW1–7, code/data and past exams; Fall 2026 at eecs189.org/fa26 has a 27-lecture schedule but most materials are not yet released and the rotating site can 404 old URLs."
description: "A complete self-study guide to Berkeley CS189 Spring 2025: what is public, prerequisites, HW1–7 route, Fall 2026 contrast, and what off-campus learners can and cannot get."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-berkeley-cs189-spring-2025-overview)

[Berkeley CS189 Introduction to Machine Learning](https://people.eecs.berkeley.edu/~jrs/189s25/) is the math-heavy ML entry point at Berkeley. It does not follow [CS188 Spring 2026](https://inst.eecs.berkeley.edu/~cs188/sp26/); the two are parallel. The [Berkeley AI/ML Course Guide](/en/posts/learning/2026-08-21-berkeley-ai-ml-course-map-en) frames them as search/reasoning vs. statistical learning — this post makes CS189 executable.

**Self-study now on Spring 2025; watch Fall 2026 for shape.** Spring 2025 at `people.eecs.berkeley.edu/~jrs/189s25/` keeps full notes, videos, HW1–7, code/data and past exams (A3 in this site's [A0–A3 scale](https://quidproquo.cc/en/posts/learning/2026-08-21-global-ai-cs-course-map-en)). Fall 2026 at `eecs189.org/fa26` just published a 27-lecture calendar (`Lec01 Introduction + ML Problem Framing` to `Lec27 Closing`), but most decks and assignments are still TBD and the rotating `eecs189.org` domain 302s to the current term, so old URLs can 404.

## How public is it

| Edition | Level | What an anonymous reader gets | Main gap |
|---|---|---|---|
| **CS189 Spring 2025** (`~jrs/189s25`) | **A3** | lecture notes, videos, HW1–7, code/data, past exams, full syllabus | Gradescope submission, Ed, staff feedback, hidden tests |
| **CS189 Fall 2026** (`eecs189.org/fa26`) | **A1→A2** | syllabus, 27-lecture calendar (Week 1–16) | most decks/videos/HW starters not yet released |

Spring 2025 earns A3 because the practice loop is closed: problem set + runnable code/data + past exams for self-checking. Fall 2026 is useful to see the arc — from the [Fall 2026 Schedule](https://eecs189.org/fa26/#schedule): `Data Tools / K-Means / KNN → Density Estimation / GMM → Linear Regression / Bias-Variance → Logistic Regression → Gradient Descent → Neural Networks → CNN / Transformers / LLM → Attention / MDP / RL → Post-training / Diffusion → Closing` — consistent with the canonical ML spine, but not a releasable self-study bundle yet.

## Prerequisites

Official: multivariable calculus, linear algebra, and [CS70](https://fa25.eecs70.org/) (or consent). An off-campus checklist:

1. Linear algebra: matrix products, eigenvalues, SVD geometry; read the normal equations for least squares and ridge.
2. Probability: conditional probability, expectation, MLE/MAP, bias-variance.
3. Implementation: Python + NumPy for vectorized code and gradient checks. If shaky, shore up with [CS61B Fall 2025](https://fa25.datastructur.es/) habits for data structures and testing.

CS189 does not list CS61B by number, but HW code assumes reproducible experiments, train/validation splits, and learning curves. Missing that hurts more than a missing course code.

## HW1–7 route (Spring 2025)

HW1–7 each have a PDF and paired code/data. Work in order: notes → video → discussion → HW → past exam:

1. **Data and distance**: K-Means, KNN, tooling; feature–distance–decision intuition.
2. **Probability and density**: density estimation, GMMs, EM.
3. **Linear models**: least squares, regularization, bias-variance, model selection.
4. **Classification**: logistic regression, LDA/QDA, SVM contrasts.
5. **Optimization**: gradient descent convergence and step sizes incl. stochastic/mini-batch.
6. **Non-linear & kernels**: kernel methods, feature maps, dual views of regularization.
7. **Deep models**: neural nets, CNN/Transformer/LLM and generative wrap-up (mirrors Fall 2026 `Lec12–Lec27`).

Each HW keeps the problem–code–data triangle runnable locally; what is missing is Berkeley's hidden Gradescope tests and staff feedback — substitute with past exams and your own validation curves.

## Why not chase Fall 2026 directly

`eecs189.org` is a rotating site already 302ing to `/fa26`; prior term URLs can break after the switch (the [Berkeley guide](/en/posts/learning/2026-08-21-berkeley-ai-ml-course-map-en) documents 404s). Fall 2026 currently shows a full calendar with many `TBD` decks/HWs. Use Spring 2025 as the spine and cross-check Fall 2026's 27-lecture order; when a new unit appears (e.g., `Post-training: Fine-tuning / LoRA / PEFT / Distillation`, `Diffusion`), backfill from the current term.

## Tonight's starter

1. Open [CS189 Spring 2025](https://people.eecs.berkeley.edu/~jrs/189s25/) HW1, don't code — label each problem as derivation, data analysis, or programming.
2. Cross-check [Fall 2026 Lec01–Lec03](https://eecs189.org/fa26/lecture/lec01) (`Introduction / Data Tools / Math Refresher`) to patch linear algebra or probability gaps.
3. If the NumPy part of HW1 runs within ten minutes, move to HW2; otherwise patch fundamentals via CS70 notes or [CS61B](https://fa25.datastructur.es/) before jumping ahead.

## References

- [Berkeley CS189 Spring 2025 (~jrs, canonical A3)](https://people.eecs.berkeley.edu/~jrs/189s25/)
- [Berkeley CS189 Fall 2026 Schedule (eecs189.org/fa26)](https://eecs189.org/fa26/)
- [Berkeley AI/ML Course Guide: From CS61A to CS288](https://quidproquo.cc/en/posts/learning/2026-08-21-berkeley-ai-ml-course-map-en)
- [Berkeley CS188 Spring 2026 Overview](https://quidproquo.cc/en/posts/learning/2026-08-22-berkeley-cs188-sp26-overview-en)
- [Global AI/CS Course Map: A0–A3 Levels](https://quidproquo.cc/en/posts/learning/2026-08-21-global-ai-cs-course-map-en)
- [CS70 Fall 2025](https://fa25.eecs70.org/)
- [CS61B Fall 2025](https://fa25.datastructur.es/)
- [CSDIY — Berkeley CS189](https://csdiy.wiki/%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0/CS189/)

