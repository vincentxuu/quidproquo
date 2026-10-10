---
title: "Harvard CS181 Final Checkpoint and Series Wrap-up: Checklist, Practice Problems, and a Practical Backup"
date: 2026-09-29
category: tech
tags: [harvard, cs181, machine-learning, final-exam, practical, learning-path]
lang: en
series:
  name: "Harvard CS181 Weekly Guides"
  order: 15
type: guide
tldr: "The public materials for the CS181 2026 final (May 9) — the final checklist, 16 second-half practice problems, and a 66-page final review — are all 2025 versions. They cover Bayes nets and EM, which the 2026 schedule never lists, and skip Transformers, VAEs, GANs, and autoregressive models. Sort the checklist against the 2026 schedule into three buckets, cover the new topics with homework and sections, then do the 2025 practical for one end-to-end project."
description: "Final checkpoint for Harvard CS1810 Spring 2026: the final checklist's 11 topics mapped against the 2026 schedule, which of the 16 second-half practice problems to pick, how to use the 2025 final review, the 2025 Cable News Clips practical as a project backup, and where to go next (CS1820 and other course guides on this site)."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-09-29-harvard-cs181-final-checkpoint)

> ⚠️ **Version**: The 2026 final date and weekly topics come from the [course schedule (Google Sheet)](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ). The final-review materials live in [cs181-web's `static/`](https://github.com/harvard-ml-courses/cs181-web/tree/main/static), and on inspection they are all **2025 versions**: the final review is headed `CS 1810 Spring 2025`, and the other PDFs were generated in May–June 2025. Checked 2026-09-29.

## Course video sources

This article follows official notes, slides, or assignments. This check of the official public pages did not verify a public recording for the material covered here; it does not establish that no recording exists.

Course and recording entries:

- [harvard-cs181 — official course materials and recording index](https://harvard-ml-courses.github.io/cs181-web/syllabus)

## TL;DR

- **The exam**: The [CS181 2026](https://harvard-ml-courses.github.io/cs181-web/) final is on **Saturday, May 9, at 2pm** and is worth `15%`. The [syllabus](https://harvard-ml-courses.github.io/cs181-web/syllabus) says it is closed-book, with one 8.5×11 sheet of notes allowed (front and back).
- **The catch**: The public final checklist, practice problems, and review are all from 2025. Bayes nets and mixture models/EM have no matching lecture on the 2026 schedule, while the topics 2026 added — Transformers, VAEs, contrastive learning, GANs, autoregressive models — are not covered at all.
- **The fix**: Sort the checklist into three buckets: covered both years, 2025 only, and 2026 only. Test yourself on the new topics with the [s26 homework](https://github.com/harvard-ml-courses/cs181-s26-homeworks) and the section solutions. For one full project, use the [2025 practical](https://github.com/harvard-ml-courses/cs181-s25-homeworks/tree/main/practical).

## First: which year are your final materials from?

The first 14 posts in this series followed the [2026 hw0–hw6](/en/posts/tech/2026-08-27-harvard-cs181-overview-en) through the semester. This last post does two things: it checks the second half against the official materials, and it fills in the practical that 2026 dropped.

There are four final-related PDFs under the course site's `static/` folder. No HTML page links to them right now, so open them straight from the repo directory:

| File | Contents | Year evidence |
|---|---|---|
| [`final_checklist.pdf`](https://harvard-ml-courses.github.io/cs181-web/static/final_checklist/final_checklist.pdf) | 11 topics, each split into "items to know", "work through when given formulae", and "out of scope" | No year printed; PDF generated 2025-06 |
| [`final_practice.pdf`](https://harvard-ml-courses.github.io/cs181-web/static/final_practice/final_practice.pdf) (+[soln](https://harvard-ml-courses.github.io/cs181-web/static/final_practice/final_practice_soln.pdf)) | Titled `CS 1810 Second Half Practice Problems`, 16 problems | PDF generated 2025-05 |
| [`final_review_soln.pdf`](https://harvard-ml-courses.github.io/cs181-web/static/final_review/final_review_soln.pdf) | Review-session slides, 10 sections | Header `CS 1810 Spring 2025 Final Review Session` |

The checklist opens by saying it is not exhaustive. It tells you to review it alongside the textbook, sections, homework, and practice problems, and it stresses that the final tests conceptual and analytical understanding, not memorization. That warning matters even more in 2026, because the topics it lists no longer match what 2026 actually taught.

## The checklist's 11 topics mapped against the 2026 schedule

The left column follows the checklist's own order. The right columns map it to lectures and homework on the [2026 schedule](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ). The "Status" column is my own call based on lecture titles, not an official statement of exam scope.

| Checklist section | 2026 counterpart | Status |
|---|---|---|
| 1 Regression (incl. Bayesian linear regression, posterior predictive) | W1–2; [HW0](/en/posts/tech/2026-08-27-harvard-cs181-hw0-linear-algebra-review-en), [HW1](/en/posts/tech/2026-08-27-harvard-cs181-hw1-regression-en) | Both years; no separate Bayesian lecture on the 2026 schedule |
| 2 Classification (logistic, GD, perceptron, Naive Bayes) | W3; [HW2](/en/posts/tech/2026-09-29-harvard-cs181-hw2-classification-bias-variance-en) | Both years |
| 3 Neural Networks & Model Selection | W2, W4–5; [HW3](/en/posts/tech/2026-09-29-harvard-cs181-hw3-kernels-neural-networks-scaling-en) | Both years |
| 4 SVMs | W4 Richer Features, S4 Kernel methods; HW3 kernel problem | Partial: no SVM lecture title in 2026 |
| 5 Clustering (K-means, HAC) | W9; [HW5 clustering and PCA](/en/posts/tech/2026-09-29-harvard-cs181-hw5-clustering-pca-en) | Both years |
| 6 Mixture Models & Topic Models (EM) | No matching lecture; the HW4 VAE uses the ELBO | 2025 only |
| 7 Dimensionality reduction (PCA, SVD) | W9; HW5 | Both years |
| 8 Graphical models & Bayes nets | No matching lecture | 2025 only |
| 9 HMMs (forward-backward, Viterbi, Kalman) | W11; [HW6 HMM and Kalman](/en/posts/tech/2026-09-29-harvard-cs181-hw6-hmm-kalman-en) | Both years |
| 10 MDPs (VI, PI) | W12; [HW6 MDPs](/en/posts/tech/2026-09-29-harvard-cs181-hw6-mdp-planning-en) | Both years |
| 11 RL (SARSA, Q-learning) | W12–13; [HW6 Q-learning](/en/posts/tech/2026-09-29-harvard-cs181-hw6-q-learning-ethics-en) | Both years |

Going the other way, 2026 taught several topics the checklist never mentions: CNNs, autoencoders and VAEs ([HW4](/en/posts/tech/2026-09-29-harvard-cs181-hw4-autoencoder-vae-en)), [Transformers](/en/posts/tech/2026-09-29-harvard-cs181-hw4-transformer-en), [decision trees and random forests](/en/posts/tech/2026-09-29-harvard-cs181-hw4-trees-forests-moe-en), [contrastive learning and GANs](/en/posts/tech/2026-09-29-harvard-cs181-hw5-contrastive-gans-en), and [autoregressive models](/en/posts/tech/2026-09-29-harvard-cs181-hw6-autoregressive-decoding-en).

**How to use the table**:

- **The eight shared topics**: Go through each "items to know" bullet and explain it out loud. Anything you can't explain sends you back to the matching homework.
- **The two 2025-only topics**: Self-learners don't need to force these. The official materials don't say whether the 2026 final covers them. If you want the full ML map, Bayes nets and EM are each worth an evening.
- **The six 2026-only topics**: There is no official final practice for them. You have to use the homework and the 2026 section solutions, covered below.

The checklist also lists what is **out of scope**, such as the SVM dual and KKT derivations, second-order optimization methods, and recalling conjugacies from memory. You can skip those.

## Picking from the 16 practice problems

In order, the 16 `Second Half Practice Problems` are: HAC, Bayesian networks (two problems), MDP modeling (an elevator), an alternate reward function for MDPs, planning in MDPs (gridworld), reinforcement learning (SARSA), K-Means, HMMs, the mean of a mixture model, EM, PCA, PCA on transformed data, EM on multinomial data, a caterpillar MDP, and "Everything is a graphical model".

Grouped by the 2026 schedule:

- **Do first (taught in 2026)**: problems 1, 4–9, 12–13, and 15. The HAC problem has you draw min-linkage and max-linkage dendrograms. The gridworld problem needs one round of policy improvement. The SARSA problem has you compute three updates by hand. All three are "given the formula, work the steps" problems, which is the checklist's second tier.
- **Optional (2025 only)**: problems 2–3, 10–11, 14, and 16, mostly Bayes nets and EM.

**What you can do tonight**: Pick HAC, gridworld, and SARSA. Give yourself 60 minutes, write them out without the solutions, then check against the [soln](https://harvard-ml-courses.github.io/cs181-web/static/final_practice/final_practice_soln.pdf). For any problem you get stuck on, reread the matching homework guide.

## The 2025 final review: an index, not a textbook

The [final review](https://harvard-ml-courses.github.io/cs181-web/static/final_review/final_review_soln.pdf) runs 66 pages. Its outline has ten sections: Regression, Classification, Model Selection, Neural Networks, SVMs, Clustering and Mixture Models, PCA, Topic Models and Graphical Models, HMMs, and MDPs and RL. It goes one level deeper than the checklist, with a formula summary for each section, such as the two update steps of Lloyd's algorithm and the four HAC linkages (min, max, average, centroid).

Its best use is building the double-sided sheet you're allowed to bring into the exam. Copy down the formulas for the eight shared topics, then add the core equations from the 2026-only topics yourself, such as attention's √d_k scaling and the VAE reparameterization. The 2025 slides don't have those, so you have to pull them from the homework problems.

## New 2026 topics: check yourself with homework and sections

For the new topics the final materials skip, there are only two kinds of official practice:

1. **The homework itself**: [s26 homeworks](https://github.com/harvard-ml-courses/cs181-s26-homeworks) has no public solutions, but each problem is broken into fine-grained parts. Pick one part each from the hw4 Transformer problem, the hw5 SimCLR and GAN problems, and the hw6 autoregressive decoding problem, then redo them with your notes closed.
2. **The 2026 section solutions**: The [sections page](https://harvard-ml-courses.github.io/cs181-web/sections) says section notes and solutions are posted on the schedule. The files live under `static/secNN/` (for example, the [S10 solutions](https://harvard-ml-courses.github.io/cs181-web/static/sec10/sec10_soln.pdf), headed `Spring 2026`). S5 (NN training and architectures), S6 (Transformers, Autoencoders, Decision Trees), S7 (Unsupervised Learning), S8 (Generative Modeling Medley), S9 (Autoregressive Models and HMMs), and S10 (MDPs and RL) all have a `_soln.pdf`. They are the only materials for the new topics that come with answers.

Week 14 (April 28) lists `Practical DL / TBD` as its lecture topic. That is just a lecture title. The schedule doesn't link any assignment or notes to it.

## Practical backup: 2025's Cable News Clips

The 2026 grading is `hw0 4% + hw1–6 11% each + midterm 15% + final 15%`, with no practical. The [2025 edition](https://harvard-ml-courses.github.io/cs181-web-2025/) had a `practical 6%`. The homework is all pre-structured sub-problems. The practical was the only assignment where you choose the data processing, models, and tuning yourself, then defend those choices in a writeup. That makes it worth doing on your own.

Here is what the [2025 practical instructions](https://github.com/harvard-ml-courses/cs181-s25-homeworks/blob/main/practical/practical_instructions.pdf) (`Practical 2025: Classifying Cable News Clips`, originally due April 30, 2025, in groups of 2–3) ask for:

- **Task**: Predict which TV channel a news clip came from, using only the transcript text. The data was scraped from the Internet Archive's TV news archive, filtered for 2024 segments mentioning "ML" or "AI".
- **Split**: By time. January–October is `train.csv` and November–December is `val.csv`, to mimic a realistic prediction setting. The instructions warn that classes may be heavily imbalanced.
- **Part A**: Logistic regression on two text representations (e.g., `CountVectorizer`, `TfidfVectorizer`), with no tuning.
- **Part B1**: At least one untuned nonlinear model (random forest, kNN, NN, etc.), compared against Part A.
- **Part B2**: Hyperparameter search for at least two model classes, trying at least 5 values for at least one hyperparameter, with your validation strategy explained.
- **Writeup**: 3–4 pages. Section 4 asks you to reflect on eight components: data pipeline, model selection, tuning, bias-variance, evaluation metrics, domain-specific evaluation, design review, and deployment and ethics.
- **Bar**: Aim for at least 60% validation accuracy, though sound methods and writeup can still earn full credit without it. There is also an optional Part C (e.g., BERT, handling class imbalance) and a Kaggle extra-credit competition. `test.csv` comes without labels.

The data is in the repo's [`practical/data`](https://github.com/harvard-ml-courses/cs181-s25-homeworks/tree/main/practical/data). `train.csv` is about 22 MB, so you can clone and start right away. The Kaggle competition was part of the 2025 term, and I have not verified whether it still accepts submissions. For self-study, evaluate on `val.csv`.

**Suggested approach**: Set aside a weekend after final review. Work through Part A → B1 → B2 in order, and for the writeup answer only the eight Section 4 prompts, 2–4 sentences each. Those eight prompts amount to an applied review of the whole course.

## Where to go next

- **Harvard's next course**: The [Harvard AI/ML course map](/en/posts/learning/2026-08-22-harvard-ai-ml-course-map-en) explains that CS1820 (Planning and Learning Methods in AI) is not a sequel to CS1810. It approaches AI through search, planning, games, and uncertainty. When that post was checked, the Fall 2026 offering was only at **A0**, with no self-study materials.
- **A peer ML course from another angle**: [Berkeley CS189 Spring 2025](/en/posts/learning/2026-08-22-berkeley-cs189-spring-2025-overview-en) publishes its homework and past exams. [Stanford CS229](/en/posts/ai/2026-08-21-stanford-cs229-machine-learning-en) is heavier on derivations.
- **Toward deep learning and LLMs**: CS181 only opens the door on Transformers and autoregressive decoding. Continue with [Stanford CS224N](/en/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning-en).
- **Toward reinforcement learning**: hw6's MDPs and Q-learning are the starting point. [CMU 07-280](/en/posts/ai/2026-08-22-cmu-07280-course-overview-en) takes you all the way to AlphaZero.
- **Finding other courses**: The [global AI/CS course map](/en/posts/learning/2026-08-21-global-ai-cs-course-map-en) grades each course A0–A3 by how far you can self-study it.

## Series navigation

- Previous: [HW6 (4): Q-learning on Swingy Monkey + Embedded EthiCS](/en/posts/tech/2026-09-29-harvard-cs181-hw6-q-learning-ethics-en)
- Back to the start: [Harvard CS181 overview](/en/posts/tech/2026-08-27-harvard-cs181-overview-en)
- First-half counterpart: [Midterm checkpoint](/en/posts/tech/2026-09-29-harvard-cs181-midterm-checkpoint-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [Harvard CS181 2026 course homepage](https://harvard-ml-courses.github.io/cs181-web/)
- [CS181 2026 syllabus (grading, exam rules)](https://harvard-ml-courses.github.io/cs181-web/syllabus)
- [CS181 2026 schedule (Google Sheet; Week 14 and Final Exam May 9 2pm)](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ)
- [CS181 final checklist (PDF)](https://harvard-ml-courses.github.io/cs181-web/static/final_checklist/final_checklist.pdf)
- [CS 1810 Second Half Practice Problems (PDF)](https://harvard-ml-courses.github.io/cs181-web/static/final_practice/final_practice.pdf), [solutions](https://harvard-ml-courses.github.io/cs181-web/static/final_practice/final_practice_soln.pdf)
- [CS 1810 Spring 2025 Final Review Session solution slides (PDF)](https://harvard-ml-courses.github.io/cs181-web/static/final_review/final_review_soln.pdf)
- [CS181 2026 sections](https://harvard-ml-courses.github.io/cs181-web/sections), [example: S10 solutions (PDF)](https://harvard-ml-courses.github.io/cs181-web/static/sec10/sec10_soln.pdf)
- [cs181-s26-homeworks (GitHub)](https://github.com/harvard-ml-courses/cs181-s26-homeworks)
- [cs181-s25-homeworks practical (GitHub)](https://github.com/harvard-ml-courses/cs181-s25-homeworks/tree/main/practical), [Practical 2025 instructions (PDF)](https://github.com/harvard-ml-courses/cs181-s25-homeworks/blob/main/practical/practical_instructions.pdf)
- [CS181 2025 course site (practical worth 6%)](https://harvard-ml-courses.github.io/cs181-web-2025/)
