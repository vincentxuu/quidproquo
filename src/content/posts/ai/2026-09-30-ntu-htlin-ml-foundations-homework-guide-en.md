---
title: "Hsuan-Tien Lin's ML Foundations Homework Guide: What Fall 2024 HW0–HW5 Practice and Need, Plus Fall 2026 hw0/hw1"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, machine-learning, learning-theory, ai-course, course-guide, homework]
lang: en
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 17
tldr: "Fall 2024 had six Foundations assignments. HW0 is 20 multiple-choice math prerequisite questions. HW1–HW5 each have 12 problems plus a bonus: Q1–4 are auto-graded, Q5–12 are graded by TAs, the programming problems use rcv1, cpusmall, and mnist from the LIBSVM datasets site, and HW5 uses LIBLINEAR. HW1 and HW2 each include a problem where you argue with a ChatGPT-style answer. Fall 2026 has released hw0 and hw1: hw1 is now 16 multiple-choice problems with 4 secretly chosen for TA grading, and the data is the course's own hw1_train.dat. The new policy allows AI tools and vibe coding, but AI-generated code needs block-by-block comments in your own words. Neither semester publishes official solutions."
description: "A problem-by-problem guide to Fall 2024 HW0–HW5 for Hsuan-Tien Lin's Machine Learning Foundations (NTU): release and due dates, matching lectures, what each problem practices, datasets and tools for the programming problems (LIBSVM datasets, LIBLINEAR), and grading format; how Fall 2026 hw0/hw1 differ, and both semesters' AI policies. No solutions, only ways to check your own work."
draft: false
glossary:
  - term: "LIBSVM datasets"
    aliases: ["LIBSVM data sets", "libsvmtools datasets"]
    definition: "A public dataset page maintained by Chih-Jen Lin's lab at NTU. Files use LIBSVM's sparse format: the first number on each line is the label, and the rest are index:value pairs."
    context: "The rcv1, cpusmall, and mnist data in Hsuan-Tien Lin's Fall 2024 Foundations homework all come from here."
    links:
      - label: "LIBSVM Data"
        url: "https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/"
  - term: "gold medal"
    aliases: ["late half-day"]
    definition: "One of four penalty-free late days, each worth half a day (12 hours), that Hsuan-Tien Lin's courses give every student. They can be spent on one assignment or spread out. Without them, late work loses 10% per 12 hours."
    context: "Defined in the Fall 2024 and Fall 2026 policy.pdf."
    links:
      - label: "Fall 2026 policy"
        url: "https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/policy.pdf"
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide)

**Video status: Official entry or recording index only.** [Source details](#course-video-sources)

This is part 17 of the [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en) series. The first 16 parts walked through the MOOC lecture by lecture. This one goes back over the homework for the [Machine Learning Foundations](https://www.csie.ntu.edu.tw/~htlin/mooc/) half of the course.

**The homework baseline is Fall 2024.** The reason is simple: the [Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) is finished and every PDF for HW0–HW7 is public, while [Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) is in week 4 and has only released hw0 and hw1. The last section compares those two.

**Access level: A3, except for grading.** You can get the problems and the data yourself. What is missing:

1. **No official solutions.** Neither semester's course page or homework pages have a solution file.
2. **Grading is for enrolled students only.** Homework goes to Gradescope, and discussion happens on Discord and NTU COOL (course 40495 in Fall 2024, 63348 in Fall 2026), all of which need enrollment or an NTU account.

So this post **gives no answers**. It covers what each problem practices, what data it needs, and how to check your own results. The access levels are defined in the [Global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en).

## Course video sources

No dedicated public lecture recording was verified for this article. Use the official course entry for recordings and materials.

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)
- [Foundations: official free YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [Techniques: official free YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)

On 2026-10-10 the official MOOC page and both playlists were checked live: the playlists hold lecture videos only, with no walkthrough video for the homework this post covers (the problems are PDFs on the NTU course pages).

Checked: 2026-10-10.

## What the homework looks like

### The Fall 2024 format

Each PDF states its rules up front. HW1–HW5 share this format:

- **200 points plus 20 bonus points**: 12 problems plus 1 bonus.
- **Q1–Q4 are auto-graded**, 10 points each; you pick answers on Gradescope.
- **Q5–Q12 are TA-graded**, 20 points each; you upload scanned or printed solutions. Programming problems also need a screenshot of the first page of your code as proof you wrote it.
- **Q13 is the bonus**, also TA-graded.
- Solutions may be written in English or Chinese, in any programming language.
- Starting with HW5, a trial "clarity bonus" lets a TA add up to 2 points per problem for answers that are correct and exceptionally clear.

HW0 is different: 20 multiple-choice questions at 2 points each for 40 points total. You only pick answers on Gradescope; no written solutions.

Assignments often get a "red correction" after release, a version with fixes marked in red, and the filename then carries `_red`. HW1–HW4 all had one; HW5 did not.

### The two semesters' policies

Late rules are the same in both: late work loses 10% per 12 hours (or fraction thereof), and every student gets four **gold medals**, each covering half a day.

The real differences are around AI and software packages:

| | [Fall 2024 policy](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/policy.pdf) | [Fall 2026 policy](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/policy.pdf) |
|---|---|---|
| AI tools | Books, notes, and Internet resources (including, but not limited to, chatGPT) may be consulted but not copied | AI tools may assist, but you may not submit their output directly as your own; you are strongly encouraged to save prompts and interaction logs as evidence if originality is questioned |
| Sharing | Lending or borrowing solutions or code counts as dishonesty | Same, and **AI interaction logs** are named explicitly |
| Packages | No "sophisticated packages"; check with the TAs first | Any platform, language, or package, including (vibe) coding tools; but if generative AI wrote your code, you **must add block-by-block comments in your own words** explaining its logic |
| Submission | Auto-graded plus TA-graded | Multiple-choice answers are auto-graded, and you also upload derivations and source code; answers without derivations and programming answers without source code get zero |

Section 4 of the Fall 2026 policy is titled "Collaboration, Open-Book, and Open-AI," with a footnote: "not the company."

**Try this:** if you are self-studying, follow the Fall 2026 rules. Let AI help write code, but comment every block in your own words. Any block you cannot explain is a part you have not understood yet.

## Overview

| Assignment | Released → due (2024) | Lectures | Programming data |
|---|---|---|---|
| [HW0](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/hw0.pdf) | 09/02 → 10/07 | Math prerequisites | None |
| [HW1](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw1/hw1_red.pdf) | 09/09 → 10/07 | L1–L3 | LIBSVM `rcv1_train.binary` |
| [HW2](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw2/hw2_red.pdf) | 09/23 → 10/07 | L4–L7 | Generated by your own code |
| [HW3](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf) | 10/07 → 10/21 | L6–L10 | LIBSVM `cpusmall_scale` |
| [HW4](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf) | 10/21 → 11/04 | L10–L14 | `cpusmall_scale` |
| [HW5](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw5/hw5.pdf) | 11/04 → 11/18 | L13–L16, plus one Techniques T1 problem | LIBSVM `mnist.scale`, with LIBLINEAR |

HW0, HW1, and HW2 were all due on 10/07, so the first five weeks really meant writing three assignments at once. All datasets are on the [LIBSVM Data](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/) page and were still downloadable on 2026-09-30.

## HW0: a prerequisite self-check

The 20 questions fall into three blocks: combinatorics and probability (Q1–6), linear algebra (Q7–13), and calculus and optimization (Q14–20). They cover a recurrence for binomial coefficients, conditional probability, sample variance, matrix inverses and eigenvalues, SVD and the pseudo-inverse, positive semi-definite matrices, the distance between hyperplanes, the chain rule, gradients, minimizing a quadratic form, and Lagrange multipliers with equality and inequality constraints (Q19–20).

The picks are deliberate. The pseudo-inverse returns in L9's linear regression, hyperplane distance is the margin in Techniques T1, and Lagrange multipliers are where T2's dual SVM starts.

**Try this:** give yourself one hour. Every question can be checked with numpy or sympy, for example `np.linalg.inv`, `np.linalg.eigvals`, or `sympy.diff`. If you miss more than five, brush up on linear algebra and calculus before starting L1.

## HW1: PLA and types of learning (L1–L3)

- **Q1**: which task is best suited for machine learning (the criteria from L1).
- **Q2–4**: properties of PLA. Q2 asks for w<sub>0</sub> after every example is used exactly once; Q3 and Q4 ask how the bound on the number of updates from slide 19 of L2 changes if inputs are halved or normalized.
- **Q5–6**: ask any ChatGPT-like agent two questions ("what is a possible application of active learning?" and "can machine learning be used to predict earthquakes?"), list its answers, and argue in 10–20 English sentences, "as if you are the boss of the agent," whether you agree. The problem notes that the TAs are more used to being persuaded by humans than machines.
- **Q7–8**: whether PLA's result is equivalent when x<sub>0</sub> changes from 1 to 2, or when every input is multiplied by 3; prove or disprove.
- **Q9**: an online PLA for detecting hateful articles; derive an upper bound on the number of mistakes (the online setting from L3).
- **Q10–12 (programming)**: download `rcv1_train.binary` and take the first 200 lines, with x ∈ ℝ<sup>47205</sup>. Implement a PLA that picks random examples and stops after 5N consecutive correct checks. Repeat 1000 times and plot a histogram of update counts (Q10); overlay the 1000 curves of ‖w<sub>t</sub>‖ (Q11); then switch to a variant that keeps correcting the same example until it is right, and compare (Q12).
- **Q13 (bonus)**: a PLA variant guaranteed to classify the updated example correctly; prove it halts on linearly separable data.

**How to check:** the final w<sub>PLA</sub> from Q10–12 should reach E<sub>in</sub> = 0 on the 200 examples. Compute it once to confirm your code works. For Q3 and Q4, compute R and ρ directly on the data and compare the bound with actual update counts.

## HW2: feasibility, growth functions, and decision stumps (L4–L7)

- **Q1, Q3**: growth functions of two restricted perceptrons (slopes limited to ±1; lines forced through a given point).
- **Q2, Q6, Q7**: sampling from multiple bins. Draw 5 cards from each of 16 independent bags, versus 5 tickets from one bag of four linked ticket types, and compare the chance that some number comes up all green. The hint spells it out: each number is a hypothesis.
- **Q4**: the tightest VC dimension bound for a set of 6211 fixed perceptrons (L7).
- **Q5**: the problem links a shared ChatGPT answer to "if the first N − 1 terms of an integer sequence come from a degree-N polynomial, can you predict the next term?" You argue for or against it as the agent's boss. This ties to L4's "learning is impossible?"
- **Q8**: M slot machines; use one-sided Hoeffding plus a union bound to prove a confidence bound that holds for every machine at every time step simultaneously. The hint notes this is the core of the upper-confidence-bound algorithm for multi-armed bandits.
- **Q9**: the VC dimension of all symmetric boolean functions.
- **Q10–12 (programming)**: decision stumps. Q10 proves a formula for E<sub>out</sub> under a given noise model; Q11 runs 2000 trials with N = 12 and 15% noise and plots (E<sub>in</sub>, E<sub>out</sub>); Q12 repeats with a randomly chosen hypothesis.
- **Q13 (bonus)**: an upper bound on the VC dimension of multi-dimensional decision stumps.

**How to check:** the probabilities in Q2, Q6, and Q7 can all be verified with a Monte Carlo simulation; 100,000 draws is plenty. For Q11, compute E<sub>out</sub> with the formula from Q10, then estimate it independently with many test points to confirm the formula.

## HW3: VC dimension, noise, and linear regression (L6–L10)

- **Q1, Q5**: comparing d<sub>VC</sub> values, and whether d<sub>VC</sub>(H<sub>1</sub> ∪ H<sub>2</sub>) ≤ d<sub>VC</sub>(H<sub>1</sub>) + d<sub>VC</sub>(H<sub>2</sub>) holds.
- **Q2–3, Q8**: linear regression. The 1-D solution without an intercept, which operations on X change the hat matrix, and how the solution changes when x<sub>0</sub> goes from 1 to 1126.
- **Q4, Q9**: maximum likelihood. The likelihood for a uniform distribution on [θ, 1], and the logistic regression gradient re-derived for a different sigmoid.
- **Q6–7**: noise and error from L8. The target threshold under a supermarket-style asymmetric error (a false negative costs 10 times a false positive), and an inequality between the two definitions of E<sub>out</sub>.
- **Q10–12 (programming)**: `cpusmall_scale` has 8192 examples. Sample N = 32 and run linear regression 1126 times, plotting (E<sub>in</sub>, E<sub>out</sub>); plot learning curves for N from 25 to 2000; repeat using only the first 2 features.
- **Q13 (bonus)**: prove a lower bound on B(N, k) to complete L6's equality. The problem itself notes that this belongs to the "optional" L6.

**How to check:** w<sub>lin</sub> from `np.linalg.pinv` should match sklearn's `LinearRegression().fit(X, y)` (watch how each handles the intercept). Compare the shape of your learning curves with the plots in the L9 slides.

## HW4: logistic regression, multiclass, and nonlinear transforms (L10–L14)

- **Q1**: the equivalent form of cross-entropy error when labels are {0, 1}.
- **Q2–3**: error functions and SGD. Which error a PLA variant that updates on all misclassified examples at once is doing gradient descent on, and the SGD direction for an asymmetric squared error where overestimates are worse.
- **Q4**: what linear regression returns after a transform with one indicator feature per training example (the problem suggests thinking about E<sub>in</sub> and E<sub>out</sub> too).
- **Q5**: Newton's method for logistic regression, writing the Hessian as XᵀDX.
- **Q6–7**: the SGD update for multinomial logistic regression, and how it relates to ordinary logistic regression when K = 2 (L11 multiclass).
- **Q8**: fit f(x) = 1 − 2x² with linear regression on two points; find E<sub>D</sub>(|E<sub>in</sub>(g) − E<sub>out</sub>(g)|).
- **Q9**: virtual examples from L13. Generate virtual examples by adding Gaussian noise to inputs; the form of E(X<sub>h</sub>ᵀX<sub>h</sub>) points straight at L14's regularization.
- **Q10–12 (programming)**: `cpusmall_scale` again, with N = 64. Q10 compares SGD (η = 0.01, 100,000 iterations) against the closed-form solution; Q11–12 apply a homogeneous third-order polynomial transform and measure how much E<sub>in</sub> improves and how E<sub>out</sub> changes, 1126 times each.
- **Q13 (bonus)**: whether a "multiplicative" hypothesis set has a larger VC dimension than linear hypotheses.

**How to check:** the SGD curves in Q10 should approach the two horizontal lines from the closed-form solution. If they do not, your step size or gradient is wrong. Check Q5's Hessian numerically with finite differences.

## HW5: regularization, validation, and three principles (L13–L16)

- **Q1**: which regularizer additive smoothing is equivalent to.
- **Q2, Q7–8**: validation. An upper bound on the leave-one-out error of a decision stump; the expected validation error when estimating a mean from the first N − K examples; and a proof relating E<sub>loocv</sub> to E<sub>in</sub> for the averaging algorithm.
- **Q3**: an extension of slide 6 in L16. How low decision stumps can push E<sub>in</sub> on random labels; the problem notes the link to Rademacher complexity.
- **Q4**: hard-margin SVM on three 1-D points after a polynomial transform; find the margin. This already reaches Techniques T1 (Fall 2024 covered 201u and 202u in week 9).
- **Q5–6**: regularization. Certain virtual examples are equivalent to weighted L2 regularization; write the L2-regularized solution using a second-order Taylor expansion.
- **Q9**: when a classifier's class balance shifts at test time, at what point is it only as good as always guessing +1?
- **Q10–12 (programming)**: take digits 2 and 6 from `mnist.scale` as a binary problem and use [LIBLINEAR](https://www.csie.ntu.edu.tw/~cjlin/liblinear/) with `-s 6` (L1-regularized logistic regression). Choose λ between 10<sup>−2</sup> and 10<sup>3</sup>: by E<sub>in</sub> in Q10, by a validation split with 8000 sub-training examples in Q11, and by 3-fold CV in Q12, repeating each 1126 times and comparing the E<sub>out</sub> distributions. You are expected to read the README to work out how LIBLINEAR's C maps to the λ from class.
- **Q13 (bonus)**: the coordinate descent update for the elastic net.

**How to check:** for Q10–12, compare against sklearn's `LogisticRegression(penalty="l1", solver="liblinear")`, which runs LIBLINEAR underneath. The three ways of choosing λ should give progressively tighter E<sub>out</sub> distributions, which is exactly the effect L15 wants you to see.

## Fall 2026: what changed in hw0 and hw1

[hw0](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/hw0.pdf) was released on 2026-09-10; on 09/22 the course page announced an extension, and it is now due 10/21. Like Fall 2024 it has 20 questions for 40 points, split into combinatorics and probability (Q1–6), linear algebra (Q7–14), and calculus and optimization (Q15–20), and at least the first question is new.

[hw1](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/hw1.pdf) was released on 09/23, also due 10/21, and its [homework page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/) includes the data file `hw1_train.dat`. Per the course plan, hw0, hw1, and hw2 are all due on the same day, 10/21.

How it differs from Fall 2024 HW1:

| | Fall 2024 HW1 | Fall 2026 hw1 |
|---|---|---|
| Problems and points | 12 plus a bonus, 200 + 20 points | 16 problems, 240 points |
| Grading | Q1–4 auto-graded, Q5–12 all TA-graded | Every problem is multiple choice (10 points); 4 secretly chosen problems also get TA grading on the logic and clarity of the explanation (20 points each) |
| Scope | L1–L3 | L1–L4: basic ML judgment, PLA (including multiclass PLA), classifying a learning problem (predicting Taiwan's rain map), feasibility (off-training-set error, the Hoeffding sample size for a Monte Carlo estimate of π, BAD data, a dice version of multi-bin sampling) |
| Programming data | First 200 lines of `rcv1_train.binary` | The course's own `hw1_train.dat`, N = 256, x ∈ ℝ<sup>12</sup> |
| PLA experiments | Stop after 5N; sign(0) is −1 | Stop after 2N; sign(0) is +1. Asks for the share of runs with E<sub>in</sub> = 0, the median number of updates, the median ‖w<sub>PLA</sub>‖, and update counts after halving the inputs or setting x<sub>0</sub> to 0.5 or 0 |
| ChatGPT problems | Yes (Q5–6) | No |
| Code submission | Screenshot of the first page of code | Problems marked (*) take source code or a zip without data, stated to be for plagiarism detection and dispute resolution |

hw2 onward are scheduled to appear from 10/07; none was public as of 2026-09-30.

**Try this:** if you want to keep pace with Fall 2026, start with hw1 Q11–16. The data is only 256 examples, so 1000 runs fit in one evening. Put the median update counts for "halved inputs," "x<sub>0</sub> = 0.5," and "x<sub>0</sub> = 0" side by side, then compare them with the proofs in Fall 2024 HW1 Q7–8, and you will see what those proofs are saying.

## A self-check list when there are no solutions

1. **Simulate numerical problems first**: Monte Carlo for probabilities, many repeated trials for expectations. If your formula is far from the simulation, the derivation is wrong.
2. **Find a second implementation for programming problems**: numpy's closed form against sklearn, your SGD against the closed form, your L1 logistic regression against LIBLINEAR.
3. **Check gradients with finite differences**: compare (E(w + εe<sub>i</sub>) − E(w − εe<sub>i</sub>)) / 2ε with your derived gradient, component by component.
4. **Test proofs on small cases**: work an N = 2, d = 1 example by hand to confirm the claim, then write the general proof.

## Next

The Techniques homework, HW6 and HW7, and the final project (predicting wins in a fictional baseball league, HTMLB) are in the next post, [Techniques Homework and the Final Project](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project-en). The previous post is [T16 Finale and the modern deep learning supplement](/posts/ai/2026-09-30-ntu-htlin-ml-finale-modern-deep-learning-en).

Lecture guides matching each assignment: [L1–L3](/posts/ai/2026-09-30-ntu-htlin-ml-learning-problem-perceptron-en), [L4](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning-en), [L5–L6](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function-en), [L7–L8](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error-en), [L9–L10](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression-en), [L11–L12](/posts/ai/2026-09-30-ntu-htlin-ml-linear-classification-nonlinear-transform-en), [L13–L14](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization-en), [L15–L16](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles-en).

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The official playlists hold lecture videos only, no homework walkthrough; status unchanged.

## References

- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)
- [Fall 2024 policy](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/policy.pdf)
- [Fall 2024 Homework 0](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/hw0.pdf)
- [Fall 2024 Homework 1](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw1/hw1_red.pdf)
- [Fall 2024 Homework 2](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw2/hw2_red.pdf)
- [Fall 2024 Homework 3](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf)
- [Fall 2024 Homework 4](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf)
- [Fall 2024 Homework 5](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw5/hw5.pdf)
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)
- [Fall 2026 policy](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/policy.pdf)
- [Fall 2026 Homework 0](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/hw0.pdf)
- [Fall 2026 Homework 1 page (hw1.pdf, hw1_train.dat)](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/)
- [LIBSVM Data: Classification, Regression, and Multi-label](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/)
- [LIBLINEAR](https://www.csie.ntu.edu.tw/~cjlin/liblinear/)
- [Machine Learning Foundations / Techniques MOOC page (Hsuan-Tien Lin)](https://www.csie.ntu.edu.tw/~htlin/mooc/) (lectures in Mandarin)
