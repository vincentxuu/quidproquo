---
title: "CMU 10-301 HW6: Learning Theory, MLE/MAP, and Fairness Metrics"
date: 2026-08-22
category: learning
tags: [cmu, machine-learning, learning-theory, ai-ethics]
lang: en
type: guide
difficulty: 深度
tldr: "HW6 combines generalization, MLE/MAP, probabilistic learning, fairness metrics, and social impact in one written assignment about assumptions and tradeoffs."
description: "Theory, estimation, and fairness analysis in CMU 10-301/601 Spring 2026 HW6."
series: { name: "Reading CMU 10-301 Machine Learning", order: 6 }
---
> 🌏 [中文版](/posts/learning/2026-08-22-cmu-10301-hw6-theory-ethics)

The PDF in the [official HW6 ZIP](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw6.zip) is titled **Homework 6: Learning Theory, MLE/MAP, Fairness Metrics, and Societal Impact**; the [coursework index](https://www.cs.cmu.edu/~mgormley/courses/10601/coursework.html) shortens this to Learning Theory and Ethics. It is entirely written. Sections cover learning theory, MLE/MAP, probabilistic learning, fairness metrics, societal impacts and unintended consequences, and society/ethics/ML. The ZIP includes a PDF, LaTeX template, fairness CSV, and figures, but no starter code or reference answers.

## One spine: why trust a model

Learning theory asks when a sample supports population claims. MLE and MAP expose the roles of data and priors. Fairness metrics ask how errors are distributed. None is a one-number verdict; assumptions, objectives, and affected groups come first.

## First check and completion

Open the [`fairness_dataset.csv` inside the ZIP](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw6.zip) and identify columns, groups, labels, and predictions before computing a metric. Completion means listing assumptions for every bound/estimator, reproducing fairness calculations from the CSV, and separating mathematically supported results from value judgments in societal-impact responses. There are no official answers to claim as verification.

## References
- [HW6 official bundle](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw6.zip)
- [Spring 2026 course home and policies](https://www.cs.cmu.edu/~mgormley/courses/10601/)
