---
title: "Hsuan-Tien Lin's ML Foundations L11–L12: Linear Classification, SGD, Multiclass, and Nonlinear Transforms"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, classification, optimization, feature-engineering]
lang: en
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 6
tldr: "Lecture 11 of ML Foundations compares PLA, linear regression, and logistic regression on the same score s = wᵀx. The three differ only in their error functions, and scaled cross-entropy upper-bounds the 0/1 error, so both regressions can do classification. The lecture then turns logistic regression into SGD by computing the gradient on one random example, and builds multiclass classifiers from binary ones with OVA and OVO. Lecture 12 uses a feature transform Φ to turn a circular boundary into a line in Z-space. The price is that computation and d_vc both grow with the dimension, so the advice is: try a linear model first. Practice problems are in Fall 2024 HW4."
description: "A guide to Lectures 11–12 of Hsuan-Tien Lin's Machine Learning Foundations (NTU): comparing the error functions of three linear models and the upper-bound argument, stochastic gradient descent and its link to PLA, OVA and OVO multiclass decomposition, quadratic hypotheses and Z-space transforms, the computational and model-complexity price of polynomial transforms, nested hypothesis sets and 'linear model first', mapped to LFD 3.3–3.4 and Fall 2024 HW4."
draft: false
glossary:
  - term: "OVA decomposition"
    aliases: ["one-versus-all"]
    definition: "Split a K-class problem into K binary problems of the form 'class k or not', train a soft classifier such as logistic regression for each, and predict the class with the highest score."
    context: "The first multiclass meta-algorithm in Lecture 11 of Hsuan-Tien Lin's ML Foundations."
  - term: "OVO decomposition"
    aliases: ["one-versus-one"]
    definition: "Train one binary classifier for each pair of classes (k, ℓ) using only those two classes' data, K(K−1)/2 in total, then let them vote and pick the tournament champion."
    context: "The second multiclass meta-algorithm in Lecture 11, used to ease OVA's class imbalance."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-htlin-ml-linear-classification-nonlinear-transform)

> **Version note**: This post is based on the Lecture 11 and Lecture 12 slides of the [Machine Learning Foundations MOOC](https://www.csie.ntu.edu.tw/~htlin/mooc/) ([11_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/11_handout.pdf), [12_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/12_handout.pdf)) and videos 42–49 of the [YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf) (lectures in Mandarin, slides in English). Practice problems come from [HW4](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/) of [Machine Learning, Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/). Everything was checked against the official materials on 2026-09-30. Access level: the MOOC alone is **A2**; with the Fall 2024 homework it is **A3 (minus the grading chain)**. There are no official solutions.

**Series**: previous: [Linear and Logistic Regression](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression-en) | next: [Overfitting and Regularization](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization-en) | [Series overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en)

By the end of Lecture 10, the third part of the course, "How Can Machines Learn?", has given you three linear models. PLA classifies. Linear regression has a closed-form solution. Logistic regression is solved by gradient descent. Lecture 11 asks how the three relate. Lecture 12 asks what happens when the data isn't linearly separable at all.

These two lectures close out the third part. After reading, you should be able to explain why regression can be used for classification, where the SGD update comes from, the two ways to split a multiclass problem, and how to count the price of a feature transform.

## Course materials

| Lecture | YouTube sections (playlist number) | Slides | LFD sections |
|---|---|---|---|
| L11 Linear Models for Classification | [Binary Classification](https://www.youtube.com/watch?v=qXfDVHVzI38) (42), [Stochastic Grad. Descent](https://www.youtube.com/watch?v=9HL3YvmrovQ) (43), [Multiclass via Logistic](https://www.youtube.com/watch?v=wnM435PDHGY) (44), [Multiclass via Binary](https://www.youtube.com/watch?v=vxnjOI_ASlw) (45) | [11_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/11_handout.pdf) | 3.3 |
| L12 Nonlinear Transformation | [Quadratic Hypotheses](https://www.youtube.com/watch?v=8pQ06pku1xA) (46), [Nonlinear Transform](https://www.youtube.com/watch?v=UHAn6Cuk8zk) (47), [Price of Nonlinear Transform](https://www.youtube.com/watch?v=Inxr-Yc1Aow) (48), [Structured Hypothesis Sets](https://www.youtube.com/watch?v=gcLmU3MC3bE) (49) | [12_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/12_handout.pdf) | 3.4 |

LFD sections follow the Fall 2024 and Fall 2026 course pages. Fall 2024 covered these two lectures in W6 (10/07), linking to [11u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/11u_handout.pdf) and [12u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/12u_handout.pdf). [Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) schedules them for W6 (10/14). As of today those two slide links still return 404; they go up after class.

## L11, part 1: three linear models that differ only in their error

Slide 2 draws all three models in one picture. Each computes a linear score s = wᵀx first; they differ in what comes after:

| Model | Hypothesis | Error | Optimization |
|---|---|---|---|
| Linear classification (PLA) | h(x) = sign(s) | 0/1 | discrete, NP-hard |
| Linear regression | h(x) = s | squared | quadratic convex, closed form |
| Logistic regression | h(x) = θ(s) | cross-entropy | smooth convex, gradient descent |

The key move is to rewrite all three errors as functions of ys. For y ∈ {−1, +1}, ys reads as a "classification correctness score": the larger, the more correct.

- err₀/₁ = ⟦sign(ys) ≠ 1⟧
- err_SQR = (ys − 1)²
- err_CE = ln(1 + exp(−ys))

Plot them together and the differences show. Squared error does sit above 0/1 when ys ≤ 1, but it also punishes hard when ys is much greater than 1. In effect it penalizes being "too right". Cross-entropy decreases monotonically in ys. Switch it to base 2, err_SCE = log₂(1 + exp(−ys)), and it becomes an upper bound on the 0/1 error.

Slide 5 spells out why the bound matters. Since err₀/₁ ≤ err_SCE = (1/ln 2)·err_CE, applying the VC bound caps the out-of-sample 0/1 error by the in-sample cross-entropy error plus a complexity term. So **making cross-entropy small also makes the 0/1 error small**, and logistic regression can do linear classification. Squared error upper-bounds 0/1 too, so linear regression works as well.

Slide 6 compares them for practical use:

- **PLA**: efficient with a strong guarantee when the data is linearly separable; otherwise you need the pocket heuristic.
- **Linear regression**: the easiest to optimize, but a loose bound where |ys| is large.
- **Logistic regression**: easy to optimize; the bound is loose only when ys is very negative.

The slides recommend using linear regression to initialize w₀ for PLA, pocket, or logistic regression. Between pocket and logistic regression, logistic regression is usually preferred.

## L11, part 2: SGD, and how it relates to PLA

PLA looks at one example per iteration, O(1) each. The logistic regression gradient descent from L10 sweeps all N examples, O(N) per iteration. Can logistic regression also run in O(1) per step?

The slides treat the (1/N)Σ in the gradient as an expectation over a uniformly random n. The gradient from one random example is then the true gradient plus zero-mean noise. After enough steps, the two average out to about the same thing. That is SGD. For logistic regression the update is:

w_{t+1} ← w_t + η · θ(−y_n w_tᵀx_n) · y_n x_n

The slides then put it next to PLA, whose update is w_{t+1} ← w_t + 1·⟦y_n ≠ sign(w_tᵀx_n)⟧·y_n x_n. Side by side, SGD logistic regression is a "soft PLA". The weight θ(−ys), between 0 and 1, replaces the hard "update only when wrong" indicator. When w_tᵀx_n is large, PLA is roughly SGD logistic regression with η = 1.

SGD is cheap, which suits big data and online learning, but it is less stable by nature. The slides give two rules of thumb: stop when t is large enough, and use η = 0.1 when x is in a proper range. The Fun Time quiz in this section also derives the SGD direction for linear regression: 2(y_n − w_tᵀx_n)x_n, which corrects w in proportion to the residual.

## L11, part 3: two ways to split a multiclass problem

Up to here, the course has only handled binary classification. The last two sections of L11 give two meta-algorithms that assemble binary classifiers into a K-class classifier.

**OVA (one-versus-all)**: for each class k, relabel the data as +1 if it's k and −1 otherwise, then run logistic regression to get w_[k]. Predict with argmax_k w_[k]ᵀx. The slides explain why a soft classifier like logistic regression is used here. If each binary classifier outputs only ±1, combining them runs into ties (slide 15 just says "but ties?"). Comparing the estimated P(k|x) and taking the largest avoids that.

- Pros: efficient, and works with any logistic-regression-like method.
- Cons: when K is large, every subproblem is badly imbalanced, one class against all the rest.
- Extension: multinomial ("coupled") logistic regression.

**OVO (one-versus-one)**: for each pair of classes (k, ℓ), train a binary classifier on just those two classes. At prediction time, all the classifiers vote for a tournament champion.

- Pros: each subproblem is smaller, more balanced, and stable; works with any binary classifier.
- Cons: O(K²) weight vectors to store, slower prediction, and more total training.

The Fun Time quiz on slide 24 works out the training cost. Suppose a binary classifier takes N³ seconds on N examples, and 10 classes each have N/10 examples. OVO trains 45 classifiers on 2N/10 examples each, about (9/25)N³ in total. The same algorithm under OVA takes 10N³. Smaller subproblems help most when the algorithm is superlinear.

## L12: nonlinear transforms and their price

### From a circular boundary to a line in Z-space

L12 starts with data that isn't linearly separable but can be separated by a circle: h_SEP(x) = sign(−x₁² − x₂² + 0.6). Do we have to re-derive a "circular PLA" and a "circular regression"?

No. Let z = Φ(x) = (1, x₁², x₂²). The circular boundary becomes a line sign(w̃ᵀz) in Z-space. The slides list what some choices of w̃ look like back in X-space: (0.6, −1, −1) is a circle, (0.6, −1, −2) an ellipse, (0.6, −1, +2) a hyperbola. With the full quadratic transform Φ₂(x) = (1, x₁, x₂, x₁², x₁x₂, x₂²), perceptrons in Z-space correspond to every quadratic curve in X-space. Lines and constants are included as degenerate cases.

The procedure has three steps:

1. Transform the data {(x_n, y_n)} into {(z_n = Φ(x_n), y_n)}.
2. Get w̃ in Z-space with your favorite linear algorithm A.
3. Return g(x) = sign(w̃ᵀΦ(x)).

The slides call this opening Pandora's box. Quadratic PLA, quadratic regression, cubic regression, any polynomial regression: all work the same way. And Φ doesn't have to be a polynomial. Slide 11 uses handwritten digits to make the point: going from raw pixels to concrete features like "average intensity" and "symmetry" is itself a transform, just one built on domain knowledge. L3 also used concrete features like symmetry when it discussed input spaces.

### Price 1: computation and storage

A Q-th order polynomial transform Φ_Q on d-dimensional input produces d̃ = C(Q+d, d) − 1 dimensions, which is O(Q^d). When Q is large, z and w̃ become hard to compute and store. The Fun Time quiz on slide 17 gives a concrete number: with d = 2 and Q = 50, d̃ = 1325.

### Price 2: model complexity

There are d̃ + 1 free parameters, and d_vc(H_Φ_Q) ≤ d̃ + 1. The larger Q is, the larger d_vc gets. This brings back the trade-off from the second part of the course. A large d̃ makes E_in easy to push down but makes it hard to guarantee that E_out stays close to E_in. A small d̃ does the reverse.

So can you plot the data first and pick Φ by eye? Slide 16 says no, for two reasons. First, you can't plot X = R¹⁰. Second, after looking at the data you might shrink Φ₂ to (1, x₁², x₂²), or even write sign(0.6 − x₁² − x₂²) directly. d_vc looks smaller, but your brain already made choices for the model, and that complexity never got counted. The slides conclude that for VC safety, Φ must be decided before peeking at the data. This theme returns as [data snooping in L16](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles-en).

### Nested hypothesis sets and "linear model first"

Polynomial transforms naturally form a nested chain: H₀ ⊂ H₁ ⊂ H₂ ⊂ …. Moving right, d_vc never decreases, the best E_in never increases, and E_out follows the familiar U-shaped curve.

So slide 20 advises: **try a linear model first**. Using H₁₁₂₆ to produce a very low E_in and impress your boss is a dangerous path of no return. Start with H₁. If its E_in is good enough, you're done. If not, move right, and all you've lost is some computation.

The lecture summary ends with "next: dark side of the force". The next post covers what happens when a transform is too powerful: overfitting.

## Related problems in Fall 2024 HW4

[HW4](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf) was released on 2024-10-21 and due 11/04. It has 12 problems plus a bonus. Q1–4 are auto-graded multiple choice; Q5–12 are graded by TAs. Problems related to this post:

| Problem | Content | Maps to |
|---|---|---|
| Q2 | A PLA variant that updates on all misclassified points at once: which pointwise error is it doing gradient descent on? | L11 error comparison |
| Q3 | An asymmetric squared error where over-estimates cost more than under-estimates: find the SGD update direction | L11 SGD |
| Q4 | Linear regression after "Dr. Transformer" one-hot encodes each training point | L12 price of transforms; the problem asks you to think about E_out |
| Q6–7 | Explicitly "In Lecture 11": derive the SGD direction for multinomial logistic regression, and relate its K = 2 solution to binary logistic regression | Extension of L11 OVA |
| Q10 | On cpusmall_scale with N = 64, implement SGD for linear regression (following pages 10 and 12 of Lecture 11), η = 0.01, 100,000 iterations, and compare with the closed-form solution | L11 SGD |
| Q11–12 | Apply a homogeneous Q = 3 polynomial transform to the same data and measure the E_in gain and the E_out change | L12 price of transforms |
| Q13 (bonus) | Prove or disprove that a multiplicative hypothesis set has a larger d_vc than linear hypotheses | L12 transforms and d_vc |

Q1 (cross-entropy, L10) and Q5 (Newton's method and the Hessian for logistic regression) belong with the [previous post](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression-en). Q8–9 belong to L13, covered in the [next post](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization-en). The coding problems use [cpusmall_scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/regression/cpusmall_scale) from the public LIBSVM datasets page, and each experiment is repeated 1126 times with different random seeds.

Without official solutions, you can self-check the coding problems. In Q10, the SGD curves should approach the horizontal lines of the closed-form solution. In Q11, the E_in difference can't be negative by definition (H₁ ⊂ H_Φ), so a negative value means a bug.

## How to study this part

1. Before watching video 42, plot the three errors on one ys axis yourself, then compare with slide 4.
2. While watching video 43, write the SGD logistic regression update and the PLA update on the same line. Make sure you can see θ(−ys) replacing the indicator.
3. Do HW4 Q10. It tests your SGD implementation and shows how many steps SGD needs to get near the closed-form solution.
4. For every Φ in L12, ask two questions: what is d̃, and was this Φ chosen after looking at the data?

One thing to try tonight: use d̃ = C(Q+d, d) − 1 to compute the dimension for d = 10 and Q = 2, 3, 5, and get a feel for how fast the price of polynomial transforms grows.

## Further reading

- Other takes on the same material: [CS229 notes chapter 2: classification and logistic regression](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-02-classification-logistic-regression-en), [Berkeley CS189 Lec 11–12: classification and logistic regression](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-11-12-classification-logistic-en)
- The trade-off between feature transforms and regularization: [CMU 07-280 Lecture 10: Feature Engineering and Regularization](/posts/ai/2026-08-22-cmu-07280-lecture-10-feature-engineering-regularization-en)
- ML Techniques hands the "high dimensions cost you" problem to SVMs and kernels: [Linear SVM and Dual SVM](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm-en)
- Homework overview: [Foundations homework guide](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide-en)

## References

- [Machine Learning Foundations / Techniques MOOC page](https://www.csie.ntu.edu.tw/~htlin/mooc/) — section titles and slide downloads for every lecture
- [Lecture 11: Linear Models for Classification (handout)](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/11_handout.pdf) — error comparison, upper-bound argument, SGD, OVA, OVO
- [Lecture 12: Nonlinear Transformation (handout)](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/12_handout.pdf) — quadratic hypotheses, transform steps, the two prices, nested hypothesis sets
- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf) — videos 42–49 (in Mandarin)
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) — W6 schedule and LFD sections
- [Fall 2024 Homework 4](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf) — problems and release/due dates
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) — W6 (10/14) schedule
- [LIBSVM datasets: cpusmall_scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/regression/cpusmall_scale) — data for the HW4 coding problems
- [Learning from Data (AMLbook)](http://amlbook.com) — textbook sections 3.3–3.4
