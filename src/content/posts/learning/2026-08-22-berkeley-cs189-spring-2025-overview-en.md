---
title: "Berkeley CS189 Spring 2025 Overview: HW1–7 with Code and Data You Can Run, Plus What Fall 2026 Looks Like"
date: 2026-08-22
category: learning
tags: [berkeley, cs189, machine-learning, open-course, learning-path]
lang: en
type: guide
difficulty: 進階
series:
  name: "Reading Berkeley CS189"
  order: 1
tldr: "CS189 exists online in several terms. From post 2 onward this series uses Spring 2026 (eecs189.org/sp26, A3) as its base, walking through each lecture block and assignment; Spring 2025 (Shewchuk) is a different classic route with 25 lectures of notes, HW1–7 and past exams, but its official recordings sit behind a bCourses login; Fall 2026 is still in progress and serves only as a reference. This post is the series entry point and full table of contents."
description: "Entry point to the Berkeley CS189 series: how public the Spring 2025, Spring 2026 and Fall 2026 editions are, prerequisites, the Spring 2025 lecture and HW1–7 sequence, and the table of contents for all 18 posts."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-berkeley-cs189-spring-2025-overview)

[Berkeley CS189 Introduction to Machine Learning](https://people.eecs.berkeley.edu/~jrs/189s25/) is the math-heavy ML entry point at Berkeley. It does not follow [CS188 Spring 2026](https://inst.eecs.berkeley.edu/~cs188/sp26/); the two are parallel. The [Berkeley AI/ML Course Guide](/en/posts/learning/2026-08-21-berkeley-ai-ml-course-map-en) frames them as search/reasoning vs. statistical learning — this post makes CS189 executable.

**To self-study lecture by lecture with this series, use [Spring 2026](https://eecs189.org/sp26/); for the classic SVM / decision tree / PCA / boosting route, use Spring 2025; to see what next term looks like, watch Fall 2026.** Spring 2026 publishes lecture notes, 25 lecture videos, discussions with solutions, and the HW1–5 handouts, and this series uses it as the base from post 2 onward (see [Three Versions of CS189](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-course-map-en)). Spring 2025 at `people.eecs.berkeley.edu/~jrs/189s25/` keeps 25 lectures of notes, HW1–7, code/data and past exams (A3 in this site's [A0–A3 scale](https://quidproquo.cc/en/posts/learning/2026-08-21-global-ai-cs-course-map-en)); its official recordings are on bCourses and require a login. Fall 2026 at `eecs189.org/fa26` just published a 27-lecture calendar (`Lec01 Introduction + ML Problem Framing` to `Lec27 Closing`), but most decks and assignments are still TBD and the rotating `eecs189.org` domain 302s to the current term, so old URLs can 404.

## Course video sources

This is a course overview or resource map with no single corresponding lecture. Use the official course entries and playlists to find recordings.

Course and recording entries:

- [Official course and recording entry](https://eecs189.org/sp26/)

## How public is it

| Edition | Level | What an anonymous reader gets | Main gap |
|---|---|---|---|
| **CS189 Spring 2026** (`eecs189.org/sp26`) | **A3 (series base)** | 27-lecture schedule, lecture PDFs/notes, 25 lecture videos linked from the official site, Discussions 1–12 with solutions and walkthroughs, HW1–5 handouts (HW5 with solutions), midterm with solutions | Gradescope, hidden tests, Ed; HW1–4 solutions; final exam; Lec 1 recording |
| **CS189 Spring 2025** (`~jrs/189s25`) | **A3 (different route)** | 25 lectures of notes, the full `machlearn.pdf`, HW1–7, code/data (HW4 data on Kaggle), past exams, full syllabus | official recordings on bCourses need a login, only screen-only backup screencasts are public; Gradescope, Ed, hidden tests |
| **CS189 Fall 2026** (`eecs189.org/fa26`) | **A1→A2** | syllabus, 27-lecture calendar (Week 1–16) | most decks/videos/HW starters not yet released |

Both A3 editions earn the grade because the practice loop is closed: problem set + runnable code/data + past exams for self-checking. Fall 2026 is useful to see the arc — from the [Fall 2026 Schedule](https://eecs189.org/fa26/#schedule): `Data Tools / K-Means / KNN → Density Estimation / GMM → Linear Regression / Bias-Variance → Logistic Regression → Gradient Descent → Neural Networks → CNN / Transformers / LLM → Attention / MDP / RL → Post-training / Diffusion → Closing` — consistent with the canonical ML spine, but not a releasable self-study bundle yet.

## Prerequisites

Official: multivariable calculus, linear algebra, and [CS70](https://fa25.eecs70.org/) (or consent). An off-campus checklist:

1. Linear algebra: matrix products, eigenvalues, SVD geometry; read the normal equations for least squares and ridge.
2. Probability: conditional probability, expectation, MLE/MAP, bias-variance.
3. Implementation: Python + NumPy for vectorized code and gradient checks. If shaky, shore up with [CS61B Fall 2025](https://fa25.datastructur.es/) habits for data structures and testing.

CS189 does not list CS61B by number, but HW code assumes reproducible experiments, train/validation splits, and learning curves. Missing that hurts more than a missing course code.

## The Spring 2025 lecture sequence and HW1–7

Spring 2025 is Jonathan Shewchuk's edition, and its sequence differs from Spring 2026 and Fall 2026. Going by the lecture titles on the [189s25 course page](https://people.eecs.berkeley.edu/~jrs/189s25/), the 25 lectures fall into five blocks:

1. **Linear classifiers (Lec 1–5)**: classification and train/validation/test, perceptrons, gradient descent and SGD, hard- and soft-margin SVMs, ML abstractions and types of optimization problems.
2. **Decision theory and Gaussian models (Lec 6–9)**: the Bayes decision rule, generative vs. discriminative models, GDA (QDA/LDA) and MLE, eigendecomposition and anisotropic Gaussians.
3. **Regression (Lec 10–13)**: least squares, logistic regression with Newton's method, ROC curves, statistical justifications for regression, ridge and MAP.
4. **Trees and neural networks (Lec 14–19, 22–23)**: decision trees, bagging and random forests, backpropagation, vanishing gradients and ReLUs, CNNs, then data augmentation, regularization, batch normalization, ResNets and AdamW.
5. **Unsupervised learning and nearest neighbors (Lec 20–21, 24–25)**: PCA, SVD, k-means and hierarchical clustering, AdaBoost, kNN and k-d trees.

HW1–7 were due 1/29, 2/12, 2/26, 3/12, 4/3, 4/25 and 5/7. The course page lists each assignment's files and due date but does not label topics, so this post does not assign topic tags to each HW; open the written-part PDF to see what each one covers. Every HW ships problems plus locally runnable code/data. Off-campus readers miss the hidden Gradescope tests and staff feedback, so use past exams and your own validation curves instead.

SVMs, decision trees/random forests, PCA/SVD, boosting and k-d trees are covered only in Spring 2025. When the Spring 2026-based posts reach those topics, they point back here.

## Why not chase Fall 2026 directly

`eecs189.org` is a rotating site already 302ing to `/fa26`; prior term URLs can break after the switch (the [Berkeley guide](/en/posts/learning/2026-08-21-berkeley-ai-ml-course-map-en) documents 404s). Fall 2026 currently shows a full calendar with many `TBD` decks/HWs. Build the spine on Spring 2026, which has finished and has its materials in place (posts 2–18 of this series), use Fall 2026's 27-lecture order as a reference, and use Spring 2025 for the classic topics.

## Posts in this series

Spring 2026 has 27 lectures and 5 assignments; this series interleaves lecture blocks and assignments in the official order:

1. This post: series entry point and edition overview
2. [Three Versions of CS189: Spring 2026 as the Base, Spring 2025 as the Classic, Fall 2026 in Progress](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-course-map-en)
3. [Lec 1–3: ML Problem Framing, Data Tools, Terminology and Techniques](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-01-03-framing-data-mechanics-en)
4. [Lec 4–7: K-means, Probability Review, MLE, Multivariate Gaussians and GMMs](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-04-07-clustering-mle-gmm-en)
5. [Lec 7–10: Linear Regression, the Geometry of Least Squares, and Regularization](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-07-10-linear-regression-en)
6. [HW1 Guide: Linear Algebra / Calculus / Probability Warm-up + Fashion Coding](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-hw1-math-refresher-fashion-en)
7. [Lec 11–12: Classification, Generative Classifiers, Logistic Regression, and ROC](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-11-12-classification-logistic-en)
8. [Lec 13 & 15: Convergence, Momentum, Adam, SGD](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-13-15-gradient-descent-optimizers-en)
9. [Lec 14 & 16: MLE vs MAP, Bias-Variance, Entropy and KL, Plus a Midterm Self-Check](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-14-16-mle-map-bias-variance-entropy-en)
10. [HW2 Guide: Chatbot Arena Paper Questions, Regression, MLE/MAP, From GMMs to Flow Matching](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-hw2-regression-gmm-flow-matching-en)
11. [Lec 17–18: Depth, Universal Approximation, Activations, and Backpropagation](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-17-18-neural-networks-backprop-en)
12. [HW3 Guide: Autograd from Scratch (BearTensor), Newton's Method, and the Information Bottleneck](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-hw3-autograd-optimizers-en)
13. [Lec 19–20: Initialization, BatchNorm, CNNs, Early Stopping, and Double Descent](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-19-20-cnn-generalization-en)
14. [Lec 21–22: Transformers](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-21-22-transformers-en)
15. [HW4 Guide: ResNet/Transformer Paper Questions and Implementing CNN, ResNet, Transformer, DNABERT, and ConvNeXt](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-hw4-resnet-transformer-dnabert-en)
16. [Lec 23–24: LLM Training and Applications, Self-Supervised Learning](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-23-24-llm-training-ssl-en)
17. [Lec 25–27: AI for Protein Engineering, Agents and Environments, and Where to Go Next](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-25-27-protein-agents-closing-en)
18. [HW5 (Optional) Guide: InfoNCE for Biology, Diffusion Theory, LLM Fine-Tuning + Kaggle](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-hw5-ssl-diffusion-finetuning-en)

Still unavailable, and only noted as existing in the series: the Spring 2026 final exam and its solutions (the past-exam folder stops at the sp25/fa25 finals), official HW1–4 solutions, the Lec 26 guest lecture (no public materials), and the Lec 1 recording. Once Fall 2026 ends, the series will reassess whether to switch to it as the base.

## Tonight's starter

1. Read [Three Versions of CS189](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-course-map-en) and decide between the Spring 2026 main line and the Spring 2025 classic route.
2. On Spring 2026, open the [Lec 1–3 guide](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-01-03-framing-data-mechanics-en) and label each [HW1](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-hw1-math-refresher-fashion-en) warm-up problem as derivation, data analysis, or programming.
3. If the linear algebra or probability warm-ups stall you, patch fundamentals via CS70 notes or [CS61B](https://fa25.datastructur.es/) before jumping ahead.

## References

- [Berkeley CS189 Spring 2026 (eecs189.org/sp26, series base)](https://eecs189.org/sp26/)
- [Berkeley CS189 Spring 2025 (~jrs, classic route, A3)](https://people.eecs.berkeley.edu/~jrs/189s25/)
- [Berkeley CS189 Fall 2026 Schedule (eecs189.org/fa26)](https://eecs189.org/fa26/)
- [Berkeley AI/ML Course Guide: From CS61A to CS288](https://quidproquo.cc/en/posts/learning/2026-08-21-berkeley-ai-ml-course-map-en)
- [Berkeley CS188 Spring 2026 Overview](https://quidproquo.cc/en/posts/learning/2026-08-22-berkeley-cs188-sp26-overview-en)
- [Global AI/CS Course Map: A0–A3 Levels](https://quidproquo.cc/en/posts/learning/2026-08-21-global-ai-cs-course-map-en)
- [CS70 Fall 2025](https://fa25.eecs70.org/)
- [CS61B Fall 2025](https://fa25.datastructur.es/)
- [CSDIY — Berkeley CS189](https://csdiy.wiki/%E6%9C%BA%E5%99%A8%E5%AD%A6%E4%B9%A0/CS189/)

## Update log


- 2026-10-10: Added course video sources and recording access notes.
- 2026-09-29: Expanded the series to 18 posts with Spring 2026 as the base; added a "Posts in this series" table of contents and a list of unreleased parts; corrected the "HW1–7 route" section, which had presented the Spring 2026/Fall 2026 sequence as Spring 2025's HW topics, rewriting it from the lecture titles on the 189s25 course page and noting that Spring 2025 recordings need a bCourses login; added Spring 2026 to the access table; pointed the starter steps at the series posts.
