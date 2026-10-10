---
title: "Hsuan-Tien Lin's ML Techniques Homework and Final Project: Fall 2024 HW6–HW7 and the HTMLB Win Prediction"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, homework, svm, ensemble]
lang: en
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 18
tldr: "The Techniques half of Fall 2024 has two homework sets and a final project, and all three PDFs are public. HW6 covers kernels, soft-margin SVM, and aggregation; its programming part uses LIBSVM on the 3-vs-7 subproblem of mnist.scale to count support vectors, compute margins, and run 128 validation rounds. HW7 covers bootstrap, impurity, AdaBoost, gradient boosting, and neural networks; its programming part is a 500-round AdaBoost-Stump on madelon. The final project is a fictional baseball league, HTMLB: predict home-team wins across two Kaggle stages and write an English report of at most seven pages that compares at least four methods. There are no official solutions. On 2026-09-30 both Kaggle pages returned 404 without login, so outside readers probably cannot get the HTMLB data and should reproduce the same splits on a public dataset instead."
description: "Guide to the Techniques-half assignments of Hsuan-Tien Lin's NTU Machine Learning, Fall 2024: HW6 (kernel perceptron, soft-margin SVM duals, one-class SVM, Gaussian kernel, decision-stump kernel, LIBSVM experiments on mnist.scale 3 vs 7), HW7 (bootstrap, impurity, AdaBoost weights, gradient boosting, tanh networks, AdaBoost-Stump on madelon), and the HTMLB final project's two stages, grading rules, and report requirements, plus a self-evaluation plan for when Kaggle is unavailable and a Fall 2026 comparison."
draft: false
glossary:
  - term: "HTMLB"
    aliases: ["Hyper Thrill Machine Learning Baseball"]
    definition: "The fictional baseball platform in Lin's Fall 2024 final project. Its pseudo data mimics the distribution of MLB historical games, and the task is predicting whether the home team wins."
    context: "Data source of the Fall 2024 final project."
  - term: "AdaBoost-Stump"
    aliases: ["AdaBoost with decision stumps"]
    definition: "AdaBoost with a decision stump (one feature, one threshold) as the base learner. Each round picks the stump with the lowest weighted error, then updates the example weights."
    context: "The implementation task in Fall 2024 HW7 Q10–12, tied to Techniques Lecture 208."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project)

**Video status: Official entry or recording index only.** [Source details](#course-video-sources)

This is part 18, the final post, of [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en). The previous post, the [Foundations homework guide](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide-en), covered HW0–HW5. This one covers the Techniques half: HW6, HW7, and the final project.

**Sources**: the [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) (footer: last updated 2025-01-17), the [HW6 problems](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf), the [HW7 problems](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf), the [final project handout](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/final/final.pdf), and the schedule on the [Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/). I downloaded or opened all of them on 2026-09-30. Problem statements come from the PDFs. The "which lecture does this practice" labels are mine, based on each problem's content and any lecture number the problem cites.

This post gives no solutions. For each problem it says what the problem practices, which post to read first, and how to check your own answer.

## Course video sources

No dedicated public lecture recording was verified for this article. Use the official course entry for recordings and materials.

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

## Access level and gaps

Under the grading in the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en), the MOOC plus the Fall 2024 homework PDFs reach **A3, minus the grading chain**:

| Item | Available outside NTU? | Notes |
|---|---|---|
| HW6, HW7, final project PDFs | Yes | Download from the `hw6/`, `hw7/`, `final/` subpages of the course page |
| HW6 data `mnist.scale` | Yes | Public file on [LIBSVM datasets](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/) |
| HW7 data `madelon`, `madelon.t` | Yes | Same site, binary section |
| Official solutions | No | Neither the course page nor the homework subpages link any |
| Gradescope autograding, TA grading | No | Enrolled students only |
| HTMLB data and Kaggle leaderboard | Unconfirmed, probably not | Both competition pages returned 404 without login on 2026-09-30; the PDF says the links only work after signing up through the course announcement |

## Homework format

HW6 and HW7 follow the same format as the Foundations homework:

- 200 points plus 20 bonus points each. Q1–4 are multiple choice, autograded, 10 points each. Q5–12 are human-graded, 20 points each. Q13 is the bonus.
- An experimental "clarity bonus": a TA can add up to 2 points per human-graded problem when an answer is correct and exceptionally clear.
- Answers must be in English. Any language or platform is allowed for code. Submit scans or printouts on Gradescope.
- Discussion is encouraged, but you write the final answer alone. Lending and borrowing solutions both count as honesty violations.

The Fall 2024 course page lists grading as 70% homework and 30% project (tentative), and teaching language as English.

## HW6: kernels, soft-margin SVM, and aggregation

HW6 was released 2024-11-18 and due 12-02. A red-ink correction followed on 11-22 (hence the filename `hw6_red.pdf`). The lectures that week covered AdaBoost, decision trees, random forests, and GBDT, but the problems mostly practice the earlier [kernel and soft-margin SVM](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm-en) material, plus some [blending](/posts/ai/2026-09-30-ntu-htlin-ml-blending-bagging-adaboost-en).

### Multiple-choice and proof problems

| Problem | What it practices | Read first |
|---|---|---|
| Q1 | Write the PLA weight as Σ αₙΦ(xₙ) and find the α update (kernel perceptron) | [Part 9](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm-en), [Part 10](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm-en) |
| Q2 | Every example is a bounded SV (αₙ = C), so b has many solutions; find the smallest | Part 10 |
| Q3 | Soft-margin SVM with squared hinge loss: recover ξ from the dual solution α | Part 10 |
| Q4 | Uniform blending of 5 classifiers with independent errors and E_out = 0.25 each; find E_out of G (cites page 7 of Lecture 207) | [Part 12](/posts/ai/2026-09-30-ntu-htlin-ml-blending-bagging-adaboost-en) |
| Q5 | "Dr. Threshold" forgot to separate b and fed [1, xₙ] into soft-margin SVM; prove or disprove the solution is unchanged | Parts 9, 10 |
| Q6 | Turn soft-margin SVM into one-class outlier detection by anchoring the origin as a hard negative; derive the dual in QP form | Parts 9, 10 |
| Q7 | With a large enough Gaussian γ, the classifier with α = 1 and b = 0 already reaches E_in = 0 | Part 10 |
| Q8 | Prove exp(2cos(x − x′) − 2) is a valid kernel | Part 10 |
| Q9 | Use decision stumps as the feature transform, derive the matching kernel, and prove it | Parts 10, 12 |
| Q13 (bonus) | Derive the dual of the soft-margin SVM dual and compare it with the primal; the problem includes a chatGPT answer for reference | Part 9 |

The hint in Q9 links to Lin's early paper [infkernel.pdf](https://www.csie.ntu.edu.tw/~htlin/paper/doc/infkernel.pdf), which builds kernels from perceptrons and decision trees. Read it if you want to know whether aggregation and SVMs can be combined.

**How to check yourself**:

- Q1: write a kernel perceptron and step through it alongside a plain PLA on the same data. Σ αₙΦ(xₙ) should equal w at every step.
- Q4: simulate 5 independently erring classifiers with majority voting for a few hundred thousand trials and compare the error rate with the options.
- Q8, Q9: sample random points, build the kernel matrix, and check that no eigenvalue is negative. This is a numerical sanity check, not a proof.

### Programming: 3 vs 7 on mnist.scale

Q10–12 use [mnist.scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/multiclass/mnist.scale.bz2) and keep only the "class 3 vs class 7" subproblem of one-versus-one decomposition. The problem recommends [LIBSVM](https://www.csie.ntu.edu.tw/~cjlin/libsvm/), because some QP packages cannot handle a problem this large. It stresses two things:

1. Tell the package **not** to scale the data automatically, or you have changed the kernel.
2. Check yourself that the package solves the soft-margin dual taught in class, with enough numerical precision. Reading the manual and finding the parameters that change the outcome is explicitly part of the work.

| Problem | Setup | Deliverable |
|---|---|---|
| Q10 | Polynomial kernel (1 + xₙᵀxₘ)^Q, C ∈ {0.1, 1, 10}, Q ∈ {2, 3, 4} | Table of support-vector counts for all 9 pairs, the pair with the fewest, and your observations |
| Q11 | Gaussian kernel, C ∈ {0.1, 1, 10}, γ ∈ {0.1, 1, 10} | Table of the margin 1/‖w‖ for all 9 pairs and the pair with the largest |
| Q12 | C = 1; each round, hold out 200 random examples for validation and pick γ ∈ {0.01, 0.1, 1, 10, 100} by 0/1 E_val (ties go to the smaller γ); repeat 128 times | Bar chart of how often each γ is selected, plus observations |

All three require a screenshot of the first page of your code or commands.

In Q11 you cannot compute the margin from w directly, because the Gaussian kernel's Φ is infinite-dimensional. Recover it from the dual solution: ‖w‖² = ΣₙΣₘ αₙαₘyₙyₘK(xₙ, xₘ), which is the kernel trick from [Part 10](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm-en). Validation for Q12 is covered in [Part 8](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles-en).

**How to check yourself**: run each setting once in LIBSVM and once in scikit-learn's `SVC` (which also wraps LIBSVM), then compare support-vector counts and dual coefficients. When they disagree, the usual suspects are the definition of γ, data scaling, or the stopping tolerance.

## HW7: bootstrap, trees, boosting, and neural networks

HW7 was released 2024-12-02 and due 12-16. It covers [blending and bagging](/posts/ai/2026-09-30-ntu-htlin-ml-blending-bagging-adaboost-en), [decision trees, random forests, and GBDT](/posts/ai/2026-09-30-ntu-htlin-ml-decision-tree-random-forest-gbdt-en), and [neural networks](/posts/ai/2026-09-30-ntu-htlin-ml-neural-network-deep-learning-en).

### Multiple-choice and proof problems

| Problem | What it practices | Read first |
|---|---|---|
| Q1 | Bootstrap from N = 1126: how many draws until the chance of at least one duplicate exceeds 70% | Part 12 |
| Q2 | After normalizing several impurity functions, which one matches the Gini index | Part 13 |
| Q3 | With 87% negatives and a constant g₁ = −1 in round one, the ratio of positive to negative weights in round two (the AdaBoost on page 17 of Lecture 208) | Part 12 |
| Q4 | 20 input units (including the constant x₀), 3 outputs, 50 hidden units in any number of layers: the maximum number of weights | Part 14 |
| Q5 | Uniform voting over 2M+1 classifiers: the tightest upper bound on E_out of G in terms of each E_out | Part 12 |
| Q6 | Prove AdaBoost's total weight satisfies U_{t+1}/U_t = 2√(εₜ(1 − εₜ)); the hint calls this the backbone of AdaBoost converging in O(log N) rounds | Parts 12, 13 (Lectures 208, 211) |
| Q7 | Gradient boosting paired with linear regression instead of trees: is the optimal α₁ equal to 1? | Part 13 |
| Q8 | After a steepest-step GBDT update, Σ(yₙ − sₙ)gₜ(xₙ) = 0 | Part 13 |
| Q9 | A one-hidden-layer tanh network with every initial weight at 0.5 keeps its first-layer weights symmetric | Part 14 |
| Q13 (bonus) | A quoted chatGPT answer claims a d-(d−1)-1 sign network can implement d-dimensional XOR; find where it diverges from the 2023 fall bonus problem and prove impossibility | Part 14 |

**How to check yourself**:

- Q1: this is a birthday-problem variant. Simulate bootstrap draws in a few lines, or compute 1 − Π(1 − k/N) directly, and compare with the options.
- Q3, Q6: write a minimal AdaBoost that prints the sum of uₙ each round and compare with the formula.
- Q8: run one GBDT round on any regression data and print the inner product of the residual vector with gₜ's outputs. It should be close to 0.
- Q9: build a tiny NumPy network with every weight at 0.5, train a few steps, and check whether weights in the same layer stay equal. The result also shows why practitioners initialize randomly.

### Programming: AdaBoost-Stump on madelon

Q10–12 ask you to implement the AdaBoost-Stump from Lecture 208. Train on [madelon](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/binary/madelon) and test on [madelon.t](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/binary/madelon.t). Run exactly T = 500 rounds with no early stopping.

The decision stump must reuse your own HW2 implementation, extended to multiple dimensions and example weights (the problem points to HW2 Problem 13). The simplest approach it suggests: find the best weighted stump in each dimension, then take the "best of the best" across dimensions. HW2 is covered in the [Foundations homework guide](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide-en).

| Problem | Plot |
|---|---|
| Q10 | E_in (0/1) of each gₜ and εₜ (the normalized weighted E_in) against t on one figure; include a screenshot of the first page of your AdaBoost-Stump code |
| Q11 | E_in and E_out of the cumulative classifier Gₜ against t |
| Q12 | Uₜ from Q6 and E_in(Gₜ) against t |

Q12 takes the Q6 proof to real data. If Uₜ drops as theory says, E_in(Gₜ) should be pushed down with it.

**How to check yourself**: scikit-learn's `AdaBoostClassifier` with `DecisionTreeClassifier(max_depth=1)` works as a reference, but its weight update may differ in detail from the lecture version, so compare the curve shapes, not exact numbers. A more reliable check: every chosen stump should have εₜ below 0.5, and after the weight update, the previous gₜ should have a weighted error of exactly 0.5 under the new weights. That is the point of AdaBoost's update.

## Final project: HTMLB win prediction

The final project was released 2024-10-16, with the report due 2024-12-23 13:00. It is worth 800 points, the same as four homework sets. At least 720 of those go to the report; the remaining 80 may depend on minor criteria such as competition results and workload.

### Task and data

The premise: you work at a "Game Prediction Company" that has no data contract with MLB or Fantasy Baseball, so your boss set up a fictional platform, "Hyper Thrill Machine Learning Baseball" (HTMLB), and collected data there. The data is synthetic, but the handout says it has been verified to share some distributional similarity with MLB historical games. The task is to predict **whether the home team wins**, a binary classification problem scored with 0/1 error.

| | Training data | Predict |
|---|---|---|
| Stage 1 | January–July, 2016–2023 | August–December of the same years |
| Stage 2 | Same | All 2024 games |

The gap between the two stages is itself a question. Stage 1 is the second half of seasons you have partly seen; stage 2 is an entirely new year. One of the comparison axes the report must cover is how stable each method is across the two stages.

External data is forbidden, including MLB and Fantasy Baseball data. Training and testing may use only the provided data.

### Competition rules

- Hosted on Kaggle. Teams have at most four members, and four is the default. Smaller teams are allowed only if they are "willing to be as good as a four-people team."
- Up to five submissions per team, per stage, per day. The leaderboard first scores about 50% of the test set (public). Before the deadline, each team picks two final submissions per stage, scored on the other 50% (private) after the competition closes.
- Submission deadline: 2024-12-15 23:59 (UTC+8), in time for the 12-16 award ceremony. The submission site stays open until the report deadline.
- Team sign-up closed 2024-10-28: fill in a form, then join through the link in the NTU COOL announcement (not the links in the PDF).
- Source code is not submitted but must be kept until 2025-01-31, in case graders ask for a live demo of training and submission.

### Report requirements

The report is the heaviest part of the project, and the handout says so itself:

- Study at least **four** machine learning approaches and compare them on accuracy, stability across the two stages, efficiency, scalability, interpretability, and so on.
- Recommend **one** approach and list its pros and cons.
- At most seven A4 pages, in English.
- The top grading criterion is **reproducibility**: describe preprocessing, the features you built, the approaches you tried (with references for anything not taught in class), and your experimental settings and parameters.
- Other criteria include clarity, strength of reasoning, correct use of ML techniques, team workload, and citations. Multi-person teams must explain how they split the work.
- The imagined audience is company executives who may not all have CS backgrounds. The handout suggests treating the TAs as the boss you need to convince.

Any algorithm and any package is allowed, including ones not taught in class, as long as the report cites them.

### Self-study without Kaggle

The HTMLB data lives only on Kaggle, and the competition pages do not open from outside, so outside readers probably cannot get the original data. You can still follow the spirit of the project:

1. **Pick a public binary classification dataset with timestamps.** LIBSVM datasets or any other public source works, as long as you can split by time.
2. **Split it the HTMLB way.** Train on the early part of each year, use the later part of the same years as a "stage 1 validation set," and keep the most recent full year untouched as a "stage 2 test set" that you open once, at the end.
3. **Imitate the public/private split.** Halve the stage 2 test set at random, tune only against one half, and look at the other half last. You will see what overfitting to a public leaderboard feels like.
4. **Compare at least four methods**, ideally spanning all three parts of Techniques: a kernel SVM, AdaBoost or GBDT, a random forest, and a neural network, with a linear model from Foundations as the baseline.
5. **Write the report to the handout's spec**: seven pages or fewer, in English, reproducibility first, ending with one recommended method and its pros and cons.

Without a leaderboard you cannot see where you would have ranked among enrolled students. But the report carries at least 720 of the 800 points, so the leaderboard was never the main event.

## Fall 2026 comparison

[Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) is in progress. Today is week 4, and neither the Techniques homework nor the final project has been released. The course page schedule (both final project dates are marked tentative):

| Item | Schedule |
|---|---|
| hw6 (the last one) | Released 12-02, due 12-23 |
| Final exam | 12-09 |
| Final project | Released 10-14, due 12-30 |

Fall 2026 grading is 30% homework, 30% exam, 40% project (tentative), and the course is taught in Mandarin, unlike Fall 2024. The problems themselves cannot be described yet. After the term ends in January 2027, this post will be rechecked to decide whether to switch the homework baseline to Fall 2026.

## Further reading

- [Caltech Learning from Data](https://work.caltech.edu/telecourse): Abu-Mostafa's English course on the same textbook, with its own homework sets.
- [Reading Stanford CS229](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en) on this site: another angle on SVMs, kernels, and boosting.

Series navigation: previous, [Foundations homework guide: Fall 2024 HW0–HW5](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide-en) | this is the last post; back to the [series overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) — announcements, weekly schedule, and grading split
- [Fall 2024 Homework 6 (hw6_red.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf)
- [Fall 2024 Homework 7 (hw7.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf)
- [Fall 2024 Final Project (final.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/final/final.pdf)
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/) — slides and videos for the 16 Techniques lectures (videos in Mandarin, slides in English)
- [LIBSVM](https://www.csie.ntu.edu.tw/~cjlin/libsvm/)
- [LIBSVM datasets: mnist.scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/multiclass/mnist.scale.bz2)
- [LIBSVM datasets: madelon](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/binary/madelon) and [madelon.t](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/binary/madelon.t)
- [infkernel.pdf](https://www.csie.ntu.edu.tw/~htlin/paper/doc/infkernel.pdf) — the paper linked from the HW6 Q9 hint
- [HTMLB Stage 1 Kaggle competition page](https://www.kaggle.com/competitions/html-2024-fall-final-project-stage-1) (returned 404 without login on 2026-09-30)
- [Caltech Learning from Data telecourse](https://work.caltech.edu/telecourse)
