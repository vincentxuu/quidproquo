---
title: "Harvard CS181 Machine Learning: Your 2026 Roadmap Through 7 Homeworks (With a 4-Year Comparison)"
date: 2026-08-27
category: tech
tags: [harvard, cs181, machine-learning, learning-path, homework, practical, textbook]
lang: en
series:
  name: "Harvard CS181 Weekly Guides"
  order: 0
type: guide
tldr: "CS181 2026 is A3 with hw0–6 as the weekly clock (no public recordings); 2025 adds a practical, 2024 has two midterms, 2023 was taught by Weiwei Pan. Start with HW0, then follow hw1→hw6."
description: "A four-year comparison of Harvard CS1810 (2026/2025/2024/2023): instructors, prerequisites, grading, homework chain, textbook, and how this series uses homework numbers as weeks."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-27-harvard-cs181-overview)

> ⚠️ **Edition**: 2026 is primary from the [CS181 2026 site](https://harvard-ml-courses.github.io/cs181-web/) and [s26 homeworks](https://github.com/harvard-ml-courses/cs181-s26-homeworks); 2025/2024/2023 are对照 via `cs181-web-2025/2024/2023` and `cs181-s25/s24/s23-homeworks`. Google Sheet schedules are deleted/empty for all four years — this series uses **homework numbers as weeks**.

## TL;DR

- **Can I self-study?** [CS181 2026](https://harvard-ml-courses.github.io/cs181-web/) is **A3** (`hw0-6` + notes + sections + [textbook](https://github.com/harvard-ml-courses/cs181-textbook), `all learning will be in-person` with no public recordings; Gradescope/Ed require enrollment), as rated in the [Harvard AI/ML Course Map](/posts/learning/2026-08-22-harvard-ai-ml-course-map-en).
- **How to follow**: Do the [HW0 readiness check](/posts/tech/2026-08-27-harvard-cs181-hw0-linear-algebra-review-en) first (`due 2026-02-02`, 4%), patch the weakest of the four problems, then follow `hw1→hw6`; use the 2025 `practical` as the capstone backup.
- **Four-year delta**: 2025 adds `practical 6%`, 2024 has two midterms and no final, 2023 was solo-taught by Weiwei Pan.

## Four-year comparison (one table)

| Year | Site | Instructors | Grading | Homework dir (verified via `api.github.com`) | Note |
|---|---|---|---|---|---|
| **2026** | [cs181-web](https://harvard-ml-courses.github.io/cs181-web/) | Alvarez-Melis / Du + Head TFs Russell Li / Elvin Lo | [syllabus](https://harvard-ml-courses.github.io/cs181-web/syllabus): `hw0 4% + hw1-6 11% each + midterm 15% + final 15%` | [s26 homeworks](https://github.com/harvard-ml-courses/cs181-s26-homeworks): `hw0-6` 7 dirs | `hw6` = Sequential/MDP/RL + Autoregressive |
| **2025** | [cs181-web-2025](https://harvard-ml-courses.github.io/cs181-web-2025/) | Doshi-Velez / Alvarez-Melis + Preceptor Papon | `hw0 4% + hw1-6 10% each + practical 6% + midterm/final 15% each` | [s25 homeworks](https://github.com/harvard-ml-courses/cs181-s25-homeworks): `hw0-6 + practical` 8 dirs | hw3–5 reshuffle before |
| **2024** | [cs181-web-2024](https://harvard-ml-courses.github.io/cs181-web-2024/) | Doshi-Velez / Alvarez-Melis + Head TFs Badrinath/Cai | `hw0 4% + hw1-6 11% each + two midterms 15% each` (no final) | [s24 homeworks](https://github.com/harvard-ml-courses/cs181-s24-homeworks): `hw0-6` 7 dirs | Two-midterm year, `hw0 due Jan26,2024` |
| **2023** | [cs181-web-2023](https://harvard-ml-courses.github.io/cs181-web-2023/) | Weiwei Pan solo `TTh 2:15 SEC 1.321` | see `cs181-s23` practical grading | [s23 homeworks](https://github.com/harvard-ml-courses/cs181-s23-homeworks): `hw0-5 + practical1` | Only 6 hws, `T*_TestCases.py` naming |

## Prerequisites and the HW0 gate

Four years share the same prereqs ([syllabus](https://harvard-ml-courses.github.io/cs181-web/syllabus)): `beyond CS50 Python + STAT 110 + calculus + linear algebra (AM 22a / Math 21b)`, `STAT 111 / CS 51` not required. HW0 warns `During the term, the staff will be prioritizing support for new material... it might be prudent to postpone`. Use the [HW0 guide](/posts/tech/2026-08-27-harvard-cs181-hw0-linear-algebra-review-en): linear `y=Xw` (`x1≠x2 ↔ X invertible`), calculus, probability, and OLS code — the slowest problem is your week-1 patch ([MML Book](https://mml-book.github.io/), [STAT 110](https://statistics.fas.harvard.edu/stat110/home)).

## How the homework chain runs (2026 main)

Verified by reading `hw0/hw1/hw6` (30-80 lines) and `hw2-5` titles + Intro snippets from `s26 homeworks`:

- **HW0 Modeling Linear Trends** (`due 2026-02-02`) — four-in-one review
- **HW1 Regression** — NN/kernel/linear regression, `earth_temperature_sampled_train/test.csv` (800k-year ice core)
- **HW2 Classification and Bias-Variance** — plus uncertainty quantification
- **HW3 Neural Networks and Kernels** — kernel ridge → weighted sum, Section 4
- **HW4 Representation Learning, Transformers, Non-parametric** — `Attention(Q,K,V)=softmax(QK^T/√dk)V`, variance `1` after `/√dk`
- **HW5 Clustering, PCA, SSL** — cluster centers vs PCA images
- **HW6 Sequential Models and Decision Making** — Kalman, Gridworld `policy/value iteration`, Swingy Monkey Q-learning, autoregressive `KV cache / speculative decoding` (`due 2026-05-01`)

2025's `hw3 Bayesian` / `hw4 SVM` / `hw5 EM` are the对照; the missing `practical` (Kaggle-style) lives in `cs181-s25-homeworks/practical` and `cs181-s19-practicals`.

## Materials and the weekly clock

- **Textbook**: [cs181-textbook](https://github.com/harvard-ml-courses/cs181-textbook) (senior thesis, `370 stars`, 13 chapters, `Textbook.pdf 3.59 MB`)
- **Sections**: syllabus says `flipped classroom, section cycle restarts each Tuesday, solutions will be posted`, but `cs181-section` only has `s17-19` — 2025/2026 are not in version control; `schedule` only shows `S0 Math review`, Google Sheet deleted for four years — **this series uses homework numbers as weeks, not calendar weeks**.
- **Submission**: two Gradescope entries per homework (`writeup PDF with assigned pages` + `LaTeX/code`), per [homework page](https://harvard-ml-courses.github.io/cs181-web/homework).

## How to read this series

1. Read this overview to choose the 2026 main line
2. Do [HW0](/posts/tech/2026-08-27-harvard-cs181-hw0-linear-algebra-review-en) and patch prerequisites
3. Follow `HW1→HW6` weekly — each post maps to `hw*_release.tex/pdf/ipynb + data` and marks `2026/2025` deltas
4. Use the 2025 `practical` as the capstone; for CS182 see the [CS182 historical disclaimer](/posts/learning/2026-08-22-harvard-ai-ml-course-map-en) (2026/2025 are A0, only F22 22-lecture is writable)

## References

- [CS181 2026 course website](https://harvard-ml-courses.github.io/cs181-web/)
- [CS181 2026 syllabus](https://github.com/harvard-ml-courses/cs181-web/blob/main/syllabus.html)
- [CS181 s26 homeworks](https://github.com/harvard-ml-courses/cs181-s26-homeworks)
- [CS181 2025 course website](https://harvard-ml-courses.github.io/cs181-web-2025/)
- [CS181 s25 homeworks](https://github.com/harvard-ml-courses/cs181-s25-homeworks)
- [CS181 2024 course website](https://harvard-ml-courses.github.io/cs181-web-2024/)
- [CS181 s24 homeworks](https://github.com/harvard-ml-courses/cs181-s24-homeworks)
- [CS181 2023 course website](https://harvard-ml-courses.github.io/cs181-web-2023/)
- [CS181 s23 homeworks](https://github.com/harvard-ml-courses/cs181-s23-homeworks)
- [CS181 textbook](https://github.com/harvard-ml-courses/cs181-textbook)
- [Harvard AI/ML Course Map](https://quidproquo.cc/posts/learning/2026-08-22-harvard-ai-ml-course-map-en)
- [Global AI and CS Course Map](https://quidproquo.cc/posts/learning/2026-08-21-global-ai-cs-course-map-en)
- [MML Book](https://mml-book.github.io/)
