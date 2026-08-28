---
title: "Harvard CS181 HW0: Do These 4 Problems First — They Tell You What to Patch"
date: 2026-08-27
category: tech
tags: [harvard, cs181, machine-learning, linear-algebra, calculus, probability, linear-regression, python]
lang: en
series:
  name: "Harvard CS181 Weekly Guides"
  order: 1
additionalSeries:
  - name: "Global AI and CS Course Map"
    order: 96
type: guide
tldr: "HW0 checks CS181 prerequisites in four problems — y=Xw solvability, optimizing an objective, reasoning about randomness, and OLS in Python. The problem that slows you down most is the gap to patch before HW1."
description: "A weekly guide to Harvard CS1810 Spring 2026 HW0 (due 2026-02-02, with Spring 2025 as fallback): linear trends, calculus, probability, and a coding OLS exercise, plus how to use one problem to decide whether to postpone."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-27-harvard-cs181-hw0-linear-algebra-review)

> ⚠️ **Edition**: This guide tracks [CS1810 Spring 2026 HW0](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw0) (`hw0.tex`, due 2026-02-02) with [Spring 2025 HW0](https://github.com/harvard-ml-courses/cs181-s25-homeworks/tree/main/hw0) as fallback. Prerequisites and grading are from the [CS181 2026 site](https://harvard-ml-courses.github.io/cs181-web/) and [CS181 2025 site](https://harvard-ml-courses.github.io/cs181-web-2025/).

## TL;DR

HW0 is graded for completeness (4%, [2026 syllabus](https://harvard-ml-courses.github.io/cs181-web/syllabus)), but it is the only dedicated prerequisite screen. Four problems map to the textbook prerequisites — linear algebra, calculus, probability, and Python — and the slowest problem predicts what to patch before HW1's ice-core regression.

## Why HW0 deserves its own post

The [CS1810 Spring 2026 syllabus](https://github.com/harvard-ml-courses/cs181-web/blob/main/syllabus.html) sets `due February 2` and warns `During the term, the staff will be prioritizing support for new material... it might be prudent to postpone`. In other words, HW0 lets you decide in shopping week whether to delay a semester, not after HW1.

In the [Harvard AI/ML Course Map](/posts/learning/2026-08-22-harvard-ai-ml-course-map-en) taxonomy, CS181 is **A3** (`hw0-6` all in [s26 homeworks](https://github.com/harvard-ml-courses/cs181-s26-homeworks), `all learning will be in-person` with no public recordings). The closed loop starts at `data/hw0.ipynb + hw0.tex`. The 2025 edition ([s25 homeworks](https://github.com/harvard-ml-courses/cs181-s25-homeworks)) is the same for HW0, plus a `practical`.

## How to submit (don't lose points on format)

Every assignment has **two Gradescope entries** — one for the `writeup PDF (assign pages per question)` and one for `LaTeX + code (.py/.ipynb/.tex)`, the latter only checked for honor-code cases ([CS181 homework page](https://harvard-ml-courses.github.io/cs181-web/homework)). For self-study, `git clone https://github.com/harvard-ml-courses/cs181-s26-homeworks.git && git pull` is the official workflow (`s26 README`).

## What the four problems test (2026 main, 2025对照)

### Problem 1: Modeling Linear Trends — Linear Algebra

Given `D={(x1,y1),(x2,y2)}`, line `y=w0+w1 x`.

1. Solve `w0,w1` by substitution
2. Rewrite as `y=Xw` with `y,w∈R^2, X∈R^{2×2}` and describe `X,y,w`
3. Unique solution iff `X invertible (det≠0) ↔ x1≠x2`, then `w=X^{-1}y`
4. Compare matrix vs substitution and state the matrix advantage
5. For `N>2`, `X∈R^{N×2}` is not square — `w=X^{-1}y` no longer applies (overdetermined, needs least squares)
6. Pick `x1≠x2` and compute `w` in Python from `X,y`

**Guide**: Two points make the matrix form look like notation; a million points make it matter (batched ops, geometry, OLS). If Q3 is slow, patch with [MML Book Part I §2-3](https://mml-book.github.io/) before HW1.

### Problem 2: Optimizing Objectives — Calculus

The second `problem` in `hw0.tex` checks derivatives, first-order conditions, and what `∇f=0` means geometrically. This is the prerequisite for HW1's loss landscapes.

### Problem 3: Reasoning about Randomness — Probability

The third `problem` returns to [STAT 110](https://statistics.fas.harvard.edu/stat110/home) level: random variables, expectation, variance, Bayes. It is the foundation for later `Bayesian Methods` (2025 HW3) and `Inference in Graphical Models` (2025 HW6). See [CS181 textbook / GenerativeModels](https://github.com/harvard-ml-courses/cs181-textbook/tree/master/GenerativeModels) and STAT 110.

### Problem 4: Implementing Linear Regression — Code

Role-playing `Steve the TF live demo`, fit a `line of best fit` via OLS (not a perfect fit). `data` has two columns (x, y). You fix `X`'s shape (one column of ones for the intercept + one column `x`) and explain why `y.shape` has no second dimension (`y` is 1D, `X` is 2D). This is the first `theory + code` pairing; HW1 reuses the same `X,y` on 800k years of ice-core temperatures (`earth_temperature_sampled_train/test.csv`, Jouzel et al. 2007).

## A 90-minute check you can do tonight

1. Clone `s26` and open `hw0/hw0.ipynb`; get `X.shape / y.shape` to print
2. Write the `X invertible ↔ x1≠x2` condition by hand, then verify with random points
3. Score each problem (smooth / slow but solved / needed lookup / blocked) — **the slowest is your week-1 patch** (linear algebra → MML Book, probability → STAT 110, code → CS50x Python)

## Where it leads

After HW0, [HW1 Regression](/posts/tech/2026-08-27-harvard-cs181-hw0-linear-algebra-review-en) (ice-core), HW2 Classification, HW3 Neural Networks and Kernels, HW4 Transformers, HW5 Clustering/PCA, and HW6 Sequential Models are new material rather than remediation. The 2025 `practical` (Kaggle-style) is the capstone if you want more after HW6; 2026 has no practical, so use the 2025 version.

## References

- [CS1810 Spring 2026 course website](https://harvard-ml-courses.github.io/cs181-web/)
- [CS1810 Spring 2026 syllabus (GitHub)](https://github.com/harvard-ml-courses/cs181-web/blob/main/syllabus.html)
- [CS1810 Spring 2026 HW0 (hw0.tex, due 2026-02-02)](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw0)
- [CS1810 Spring 2025 course website](https://harvard-ml-courses.github.io/cs181-web-2025/)
- [CS1810 Spring 2025 HW0](https://github.com/harvard-ml-courses/cs181-s25-homeworks/tree/main/hw0)
- [CS181 textbook (senior thesis, 13 chapters)](https://github.com/harvard-ml-courses/cs181-textbook)
- [Harvard AI/ML Course Map — CS181/CS182 editions](https://quidproquo.cc/posts/learning/2026-08-22-harvard-ai-ml-course-map-en)
- [Global AI and CS Course Map](https://quidproquo.cc/posts/learning/2026-08-21-global-ai-cs-course-map-en)
- [MML Book Part I](https://mml-book.github.io/)
