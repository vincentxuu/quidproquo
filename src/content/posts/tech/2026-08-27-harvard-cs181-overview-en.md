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

> ⚠️ **Edition**: 2026 is primary from the [CS181 2026 site](https://harvard-ml-courses.github.io/cs181-web/) and [s26 homeworks](https://github.com/harvard-ml-courses/cs181-s26-homeworks); 2025/2024/2023 are compared via `cs181-web-2025/2024/2023` and `cs181-s25/s24/s23-homeworks`. The [Google Sheet schedule](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ) embedded on the 2026 site can be exported anonymously (checked 2026-09-29). This series uses **homework numbers as weeks** and the schedule's lecture order within each homework.

## TL;DR

- **Can I self-study?** [CS181 2026](https://harvard-ml-courses.github.io/cs181-web/) is **A3** (`hw0-6` + notes + sections + [textbook](https://github.com/harvard-ml-courses/cs181-textbook), `all learning will be in-person` with no public recordings; Gradescope/Ed require enrollment), as rated in the [Harvard AI/ML Course Map](/posts/learning/2026-08-22-harvard-ai-ml-course-map-en).
- **How to follow**: Do the [HW0 readiness check](/posts/tech/2026-08-27-harvard-cs181-hw0-linear-algebra-review-en) first (`due 2026-02-02`, 4%), patch the weakest of the four problems, then follow `hw1→hw6`. The series has 16 posts (order 0–15), including midterm and final checkpoints; see "Posts in this series" below.
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

Based on the `\duedate` and problem titles in each `s26 homeworks` `.tex` file (all checked 2026-09-29):

- **HW0 Modeling Linear Trends** (`due 2026-02-02`) — four-in-one review
- **HW1 Regression** (`due 2026-02-13`) — four problems: kNN & Kernels / Geometric Least Squares / Basis Regression / Probabilistic View & Regularization, `earth_temperature_sampled_train/test.csv` (800k-year ice core)
- **HW2 Classification and Bias-Variance** (`due 2026-02-27`) — Bias-Variance & Uncertainty / MLE in classification / Classifying Loan Applicants / GD & Regularization
- **HW3** (`due 2026-03-23`) — Kernels & Feature Maps / Neural Networks / Neural Scaling Laws
- **HW4** (`due 2026-04-03`) — Understanding the Transformer / Autoencoders / Decision Trees, Random Forests & Mixture of Experts
- **HW5** (`due 2026-04-19`; the schedule originally said Apr 17) — Contrastive Learning / GANs / K-Means & HAC / PCA
- **HW6 Sequential Models and Decision Making** (`due 2026-05-01`) — HMM / Policy & Value Iteration / Reinforcement Learning / Autoregressive Models / Embedded Ethics
- **Exams**: the schedule lists the Midterm on `Mar 10` (in class) and the Final Exam on `May 9, 2pm`

2025's `hw3 Bayesian` / `hw4 SVM` / `hw5 EM` are useful for comparison; the missing `practical` (Kaggle-style) lives in `cs181-s25-homeworks/practical` and `cs181-s19-practicals`.

## Materials and the weekly clock

- **Textbook**: [cs181-textbook](https://github.com/harvard-ml-courses/cs181-textbook) (senior thesis, `370 stars`, 13 chapters, `Textbook.pdf 3.59 MB`)
- **Sections**: syllabus says `flipped classroom, section cycle restarts each Tuesday, solutions will be posted`. The old `cs181-section` repo only has `s17-19`, but the 2026 site hosts S0–S10 handouts and solution PDFs under `static/sec00`–`sec10`, and the posts cite them directly.
- **Schedule and slides**: the Google Sheet schedule embedded on the 2026 site exports anonymously as CSV (Week 0–14 lectures, sections, homework release and due dates). Its lecture cells link to 2026 slide PDFs on Google Drive; those links are dropped from the CSV and only show up in the xlsx export. **This series uses homework numbers as weeks, not calendar weeks**.
- **Submission**: two Gradescope entries per homework (`writeup PDF with assigned pages` + `LaTeX/code`), per [homework page](https://harvard-ml-courses.github.io/cs181-web/homework).

## Posts in this series

| order | Post | Covers |
|---|---|---|
| 0 | This overview | four-year comparison, access level |
| 1 | [HW0: readiness check](/posts/tech/2026-08-27-harvard-cs181-hw0-linear-algebra-review-en) | hw0 |
| 2 | [HW1: regression](/posts/tech/2026-08-27-harvard-cs181-hw1-regression-en) | hw1 |
| 3 | [HW2: classification and bias-variance](/posts/tech/2026-09-29-harvard-cs181-hw2-classification-bias-variance-en) | hw2 |
| 4 | [HW3: kernels, neural networks, scaling laws](/posts/tech/2026-09-29-harvard-cs181-hw3-kernels-neural-networks-scaling-en) | hw3 |
| 5 | [Midterm checkpoint: auditing HW0–HW3](/posts/tech/2026-09-29-harvard-cs181-midterm-checkpoint-en) | midterm |
| 6 | [HW4 (Part 1): Transformers](/posts/tech/2026-09-29-harvard-cs181-hw4-transformer-en) | hw4 P1 |
| 7 | [HW4 (Part 2): autoencoders and VAEs](/posts/tech/2026-09-29-harvard-cs181-hw4-autoencoder-vae-en) | hw4 P2 |
| 8 | [HW4 (Part 3): trees, random forests, MoE](/posts/tech/2026-09-29-harvard-cs181-hw4-trees-forests-moe-en) | hw4 P3 |
| 9 | [HW5 (Part 1): K-means, HAC, PCA](/posts/tech/2026-09-29-harvard-cs181-hw5-clustering-pca-en) | hw5 P3–4 |
| 10 | [HW5 (Part 2): SimCLR and GANs](/posts/tech/2026-09-29-harvard-cs181-hw5-contrastive-gans-en) | hw5 P1–2 |
| 11 | [HW6 (Part 1): autoregressive decoding, KV cache, speculative decoding](/posts/tech/2026-09-29-harvard-cs181-hw6-autoregressive-decoding-en) | hw6 P4 |
| 12 | [HW6 (Part 2): HMMs and the Kalman filter](/posts/tech/2026-09-29-harvard-cs181-hw6-hmm-kalman-en) | hw6 P1 |
| 13 | [HW6 (Part 3): policy and value iteration](/posts/tech/2026-09-29-harvard-cs181-hw6-mdp-planning-en) | hw6 P2 |
| 14 | [HW6 (Part 4): Q-learning and Embedded EthiCS](/posts/tech/2026-09-29-harvard-cs181-hw6-q-learning-ethics-en) | hw6 P3, P5 |
| 15 | [Final checkpoint and series wrap-up](/posts/tech/2026-09-29-harvard-cs181-final-checkpoint-en) | final |

Suggested path: read this overview to decide whether to follow the 2026 main line → do HW0 and patch prerequisites → follow the posts in order; each maps to one `hw*_release.tex/pdf/ipynb + data` plus that week's section. HW4–HW6 are split into several posts following the schedule's lecture order. For CS182 see the [CS182 historical disclaimer](/posts/learning/2026-08-22-harvard-ai-ml-course-map-en) (2026/2025 are A0, only F22 22-lecture is writable).

### Current limits and unreleased parts

- **No current-term recordings** (syllabus: all learning in-person); the schedule's W13 Embedded EthiCS says "see recording" but gives no public link (A0).
- **No homework solutions**; Gradescope/Ed require enrollment. Sections do have solution PDFs.
- The scribe notes are from 2024; the midterm/final review and midterm practice headers say 2025.
- The site's `homework` page is stale (lists only HW0); use the s26 repo and the schedule for the 2026 homework list.
- CS1810 is a spring course and is not offered in Fall 2026; a comparison will follow once Spring 2027 materials are up.

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

## Update log

- **2026-09-29**: Expanded the series to orders 0–15, added "Posts in this series" and a limits list; filled in HW1–HW6 due dates, problems, and exam dates from the 2026 schedule and each `.tex`; corrected the old claims that the Google Sheet schedule was deleted and that 2026 sections were not public.
