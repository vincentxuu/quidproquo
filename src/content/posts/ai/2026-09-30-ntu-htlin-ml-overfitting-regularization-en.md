---
title: "Hsuan-Tien Lin's ML Foundations L13–L14: Overfitting and Regularization"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, regularization, learning-theory]
lang: en
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 7
tldr: "Lecture 13 of ML Foundations defines overfitting as 'lower E_in but higher E_out' and uses experiments to find four causes: too little data, stochastic noise, an overly complex target (deterministic noise), and excessive model power. Lecture 14's remedy is regularization. It rewrites 'step back to H₂' as the constraint ‖w‖² ≤ C, then uses a Lagrange multiplier to turn it into minimizing E_in + (λ/N)wᵀw, which is weight decay. Back in VC theory, regularization shrinks the effective VC dimension d_EFF, and L1 buys sparse solutions. Practice problems: Fall 2024 HW4 Q8–9 and HW5 Q1, Q5–6, Q10."
description: "A guide to Lectures 13–14 of Hsuan-Tien Lin's Machine Learning Foundations (NTU): defining overfitting and underfitting, the 2nd-order vs 10th-order learner experiments, stochastic vs deterministic noise, data cleaning and virtual examples; regularized hypothesis sets, weight decay and augmented error, Legendre polynomials, regularization and effective VC dimension, L1 vs L2 and choosing λ, mapped to LFD 4.0–4.2 and Fall 2024 HW4 and HW5."
draft: false
glossary:
  - term: "deterministic noise"
    definition: "When the target function f is not in the hypothesis set H, the gap between f and the best hypothesis h* in H. It affects learning like stochastic noise, but it depends on H and is fixed for a given x."
    context: "Lecture 13 of Hsuan-Tien Lin's ML Foundations uses it to explain why overfitting happens even without noise."
  - term: "augmented error"
    aliases: ["E_aug"]
    definition: "E_aug(w) = E_in(w) + (λ/N)Ω(w). Minimizing this unconstrained objective effectively minimizes E_in under some constraint C."
    context: "Lecture 14 of Hsuan-Tien Lin's ML Foundations writes weight decay as minimizing the augmented error."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

> **Version note**: This post is based on the Lecture 13 and Lecture 14 slides of the [Machine Learning Foundations MOOC](https://www.csie.ntu.edu.tw/~htlin/mooc/) ([13_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/13_handout.pdf), [14_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/14_handout.pdf)) and videos 50–57 of the [YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf) (lectures in Mandarin, slides in English). Practice problems come from [HW4](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/) and [HW5](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw5/) of [Machine Learning, Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/). Everything was checked against the official materials on 2026-09-30. Access level: the MOOC alone is **A2**; with the Fall 2024 homework it is **A3 (minus the grading chain)**. There are no official solutions.

**Series**: previous: [Linear Classification, SGD, Multiclass, and Nonlinear Transforms](/posts/ai/2026-09-30-ntu-htlin-ml-linear-classification-nonlinear-transform-en) | next: [Validation and the Three Learning Principles](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles-en) | [Series overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en)

The nonlinear transforms in the [previous post](/posts/ai/2026-09-30-ntu-htlin-ml-linear-classification-nonlinear-transform-en) gave linear models a lot of power, and the L12 summary teased the next lecture as "the dark side of the force". Lecture 13 opens the last part of the course, "How Can Machines Learn Better?". It first asks what happens when that power is overused, then offers the first remedy.

After reading, you should be able to name the four causes of overfitting, say how deterministic noise differs from ordinary noise, derive the weight-decay objective from a constraint, and explain what regularization corresponds to in VC theory.

## Course video sources

These course video sources were already documented in this article. Playback has not been reverified for each video; no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=BA76U3JBDdE
title: What is Overfitting?
```

```youtube
url: https://www.youtube.com/watch?v=6bfcLhHhgs0
title: The Role of Noise and Data Size
```

Original videos: [What is Overfitting?](https://www.youtube.com/watch?v=BA76U3JBDdE)、[The Role of Noise and Data Size](https://www.youtube.com/watch?v=6bfcLhHhgs0)、[Deterministic Noise](https://www.youtube.com/watch?v=c_208kUQEis)、[Dealing with Overfitting](https://www.youtube.com/watch?v=r3bX1k7tcjc)、[Regularized Hypothesis Set](https://www.youtube.com/watch?v=Sno7I5slFUA)、[Weight Decay Regularization](https://www.youtube.com/watch?v=idWnPdW9znM)、[Regularization and VC Theory](https://www.youtube.com/watch?v=15JB2o4VUeY)、[General Regularizers](https://www.youtube.com/watch?v=PeQeKeeGu3A)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

## Course materials

| Lecture | YouTube sections (playlist number) | Slides | LFD sections |
|---|---|---|---|
| L13 Hazard of Overfitting | [What is Overfitting?](https://www.youtube.com/watch?v=BA76U3JBDdE) (50), [The Role of Noise and Data Size](https://www.youtube.com/watch?v=6bfcLhHhgs0) (51), [Deterministic Noise](https://www.youtube.com/watch?v=c_208kUQEis) (52), [Dealing with Overfitting](https://www.youtube.com/watch?v=r3bX1k7tcjc) (53) | [13_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/13_handout.pdf) | 4.0, 4.1 |
| L14 Regularization | [Regularized Hypothesis Set](https://www.youtube.com/watch?v=Sno7I5slFUA) (54), [Weight Decay Regularization](https://www.youtube.com/watch?v=idWnPdW9znM) (55), [Regularization and VC Theory](https://www.youtube.com/watch?v=15JB2o4VUeY) (56), [General Regularizers](https://www.youtube.com/watch?v=PeQeKeeGu3A) (57) | [14_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/14_handout.pdf) | 4.2 |

LFD sections follow the Fall 2024 and Fall 2026 course pages. Fall 2024 covered these lectures in W7 (10/14), linking to [13u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/13u_handout.pdf) and [14u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/14u_handout.pdf). [Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) schedules them for W7 (10/21); as of today those slide links still return 404.

## L13: where overfitting comes from

### Bad generalization is not the same as overfitting

The opening example is tiny. The target is a 2nd-order polynomial. Take N = 5 points with very small noise, apply a 4th-order polynomial transform, and run linear regression. The unique solution passes through all five points, so E_in = 0, yet E_out is huge.

The slides define the terms separately:

- **Bad generalization**: low E_in, high E_out. It describes the state of one g.
- **Overfitting**: as d_vc moves up from the best point d*_vc, E_in goes down but E_out goes up. It describes the process of switching models.
- **Underfitting**: moving d_vc down to 1 makes both E_in and E_out go up.

A driving analogy explains the causes. Using excessive d_vc is driving too fast. Noise is a bumpy road. Limited data is limited observation of the road. The result is a crash.

### The irony of two learners

The second section runs two experiments. In one, the target is a 10th-order polynomial plus noise. In the other, it's a 50th-order polynomial with no noise at all. Two learners choose: O picks the best g₁₀ in H₁₀, R picks the best g₂ in H₂.

| Target | g₂ E_in / E_out | g₁₀ E_in / E_out |
|---|---|---|
| 10th order + noise | 0.050 / 0.127 | 0.034 / 9.00 |
| 50th order, noiseless | 0.029 / 0.120 | 0.00001 / 7680 |

Both overfit. The first irony: even when both learners know the target is 10th order, R gives up fitting power and wins by a wide margin on E_out. The slides explain it with learning curves. As N → ∞, H₁₀ reaches a lower E_out, but for small N its generalization error is far larger, so R always wins.

The second experiment is more interesting. There's no noise, yet R still wins. The slides' answer: the complexity of the target itself acts like noise.

### Deterministic noise

The third section turns that observation into an experiment. Data is y = f(x) + ε, where f is a polynomial of order Q_f and ε is Gaussian noise with variance σ². The overfit measure is E_out(g₁₀) − E_out(g₂). Two heat maps show σ² vs N (Q_f fixed at 20) and Q_f vs N (σ² fixed at 0.1). They look almost the same.

From this, the slides list four causes of serious overfitting:

1. Less data (smaller N)
2. More stochastic noise
3. More deterministic noise, meaning a more complex target
4. Excessive model power

Deterministic noise is defined as the gap between f and the best h* in H when f is not in H. It acts like stochastic noise, and the slides compare it to a pseudo-random number generator in computer science. It differs in two ways: it depends on H, and it is fixed for a given x. The slides add a bit of teaching philosophy: when teaching a kid, maybe don't use examples from a complicated target function.

### Ways to deal with overfitting

The last section returns to the driving analogy and pairs each fix:

| Driving | Learning |
|---|---|
| Drive slowly | Start from a simple model |
| Use more accurate road information | Data cleaning / pruning |
| Exploit more road information | Data hinting |
| Put on the brakes | Regularization (L14) |
| Monitor the dashboard | Validation (L15) |

Data cleaning corrects labels that look wrong; data pruning removes those examples. The slides say it "possibly helps, but effect varies". Data hinting adds virtual examples, for example by shifting or rotating handwritten digits. The slides warn that these examples are not drawn i.i.d. from P(x, y).

## L14: regularization, or stepping back in math

### From a hard constraint to a soft one

L14 starts with a question: how do you "step back" from H₁₀ to H₂? For a Q-th order polynomial transform plus linear regression, H₂ is just H₁₀ with the constraint w₃ = … = w₁₀ = 0.

The constraint is then loosened step by step:

1. **H₂**: w₃ through w₁₀ are all zero.
2. **H₂′**: at least 8 of the w_q are zero, i.e. Σ⟦w_q ≠ 0⟧ ≤ 3. More flexible than H₂ and less risky than H₁₀, but it's a sparse hypothesis set and solving it is NP-hard.
3. **H(C)**: Σ w_q² ≤ C. It overlaps with H₂′ but isn't the same, and it forms a smooth nested structure over C: H(0) ⊂ H(1.126) ⊂ … ⊂ H(∞) = H₁₀.

The best solution in H(C) is called w_REG.

### Weight decay and the augmented error

Geometrically, wᵀw ≤ C means w must lie inside a ball of radius √C. The slides argue from gradient directions. At the optimum w_REG, if −∇E_in is not parallel to the normal vector w of the sphere, you could still slide along the sphere and lower E_in. So the optimum must satisfy −∇E_in(w_REG) ∝ w_REG. In other words, there is some λ > 0 such that

∇E_in(w_REG) + (2λ/N)·w_REG = 0

Solving this is equivalent to minimizing an unconstrained objective:

E_aug(w) = E_in(w) + (λ/N)·wᵀw

This is the augmented error. Minimizing E_aug for a given λ has the same effect as constrained minimization under some C. The slides call + (λ/N)wᵀw weight-decay regularization: a larger λ prefers a shorter w and effectively means a smaller C.

The four plots on slide 11 are the most memorable image in the lecture. λ = 0 overfits. λ = 0.0001 is already much better. λ = 0.01 is close to the target. λ = 1 underfits. The caption: "a little regularization goes a long way".

One implementation detail: for x ∈ [−1, 1], x^q gets very small for large q, so it needs a large w_q to matter, and weight decay penalizes it unfairly. The slides suggest using orthonormal Legendre polynomials as the transform instead.

### Regularization and VC theory

The third section connects regularization back to the second part of the course. Two facts sit side by side:

- Constrained minimization of E_in comes with a VC guarantee: E_out(w) ≤ E_in(w) + Ω(H(C)).
- Minimizing E_aug is equivalent to constrained minimization under some C, so you get that guarantee indirectly, without actually being confined to H(C).

Another view puts E_aug next to the VC bound. In E_aug = E_in + (λ/N)Ω(w), the term Ω(w) measures the complexity of a single hypothesis. In the VC bound, Ω(H) measures the complexity of the whole hypothesis set. If the first represents the second well, E_aug is a better proxy for E_out than E_in is.

From this the slides define the **effective VC dimension** d_EFF(H, A). d_vc(H) = d̃ + 1 is large because every w is "considered" during minimization. But only some H(C) is actually needed. When the algorithm A is regularized, d_EFF is small. The Fun Time quiz here asks what happens to d_EFF as λ grows. It shrinks.

### General regularizers

The last section sorts choices of Ω(w) into three kinds. It points out that this is the same logic as choosing an error measure in [L8](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error-en):

- **Target-dependent**: use known properties of the target. If you prefer even functions, use a symmetry regularizer that penalizes only odd-order terms.
- **Plausible**: push toward smoother or simpler, because both kinds of noise are non-smooth. L1 (sparsity) belongs here.
- **Friendly**: easy to optimize. L2 (weight decay) belongs here.

If you pick a bad one, don't worry too much; λ can hold it down.

Slide 19 compares L1 and L2:

| | L2: Σ w_q² | L1: Σ \|w_q\| |
|---|---|---|
| Convex | yes | yes |
| Differentiable | everywhere | not everywhere |
| Benefit | easy to optimize | sparse solutions |

The slides' conclusion: L1 is useful when you need a sparse solution.

As for choosing λ, the two plots on slide 20 show that more noise calls for more regularization, for both stochastic and deterministic noise. But you don't know the noise level in advance, so you need validation, the subject of the next lecture.

## Related problems in the Fall 2024 homework

[HW4](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf) (released 2024-10-21, due 11/04) and [HW5](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw5/hw5.pdf) (released 11/04, due 11/18) each have 12 problems plus a bonus. Q1–4 are auto-graded; Q5–12 are graded by TAs. Problems related to this post:

| Homework | Problem | Content | Maps to |
|---|---|---|---|
| HW4 | Q8 | Target f(x) = 1 − 2x², approximated by lines h(x) = w₀ + w₁x; do linear regression on just two examples and find E_D(\|E_in(g) − E_out(g)\|) | L13: the case where f is not in H |
| HW4 | Q9 | Explicitly "In Lecture 13": generate virtual examples by adding Gaussian noise to the inputs and derive the form of E(X_hᵀX_h); the note points out its link to the matrix inverted in regularized linear regression | L13 data hinting → L14 |
| HW5 | Q1 | Write additive smoothing as an estimation problem with a regularizer and find Ω(w₀) | L14 general regularizers |
| HW5 | Q5 | Prove that linear regression with a specific set of virtual examples has the same solution as weighted L2 regularization | L13–L14 |
| HW5 | Q6 | Under a second-order Taylor approximation of E_in, express the L2-regularized solution in terms of λ, N, the Hessian, and w* | L14 weight decay |
| HW5 | Q10 | Use LIBLINEAR (`-s 6`) to run L1-regularized logistic regression on the 2-vs-6 subproblem of mnist.scale, pick λ by E_in, repeat 1126 times, and plot histograms of E_out and the number of non-zero weights | L14 L1 and sparsity; also recalls L11's OVO |
| HW5 | Q13 (bonus) | Closed-form coordinate descent update for the elastic net | L14 L1 + L2 |

The dataset [mnist.scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/multiclass/mnist.scale.bz2) and the tool [LIBLINEAR](https://www.csie.ntu.edu.tw/~cjlin/liblinear/) are both public. HW5 Q10 asks you to read the README yourself to figure out how LIBLINEAR's C relates to the λ from class. That step is part of the exercise.

HW5 Q10 deliberately selects λ by E_in. Q11 and Q12 then select with a validation set and 3-fold CV, and ask you to compare the three E_out distributions. Those two are covered in the [next post](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles-en).

Without official solutions, here's a self-check. In Q10, selecting λ by E_in usually lands on the smaller candidates, because weaker regularization makes E_in easier to push down. If your runs overwhelmingly pick the largest λ, check the direction of your C-to-λ conversion first.

## How to study this part

1. Before watching video 51, guess who wins each experiment, then check the table above.
2. While watching video 52, write down the four causes of overfitting and pair each with an example you've seen at work.
3. While watching video 55, derive E_aug from wᵀw ≤ C yourself. The key step is "the gradient is parallel to the normal vector".
4. Do HW5 Q10 and watch L1 make the weights sparse with your own eyes.

One thing to try tonight: take any linear model you have, sweep the L2 coefficient up from 0, multiplying by 100 each time, and plot training and validation error on one chart. See whether the four plots from slide 11 show up on your data.

## Further reading

- Other takes on the same topic: [CS229 notes chapter 9: regularization and model selection](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-09-regularization-model-selection-en), [Why do ridge, lasso, and weight decay make models steadier?](/posts/learning/2026-08-29-im-stat-regularization-en)
- Regularization in deep learning: [MIT 6.7960: Regularization](/posts/tech/2026-09-17-mit-67960-regularization-en)
- ML Techniques revisits SVMs from the regularization angle: [Kernel Logistic Regression and Support Vector Regression](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-logistic-support-vector-regression-en)
- Homework overview: [Foundations homework guide](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [Machine Learning Foundations / Techniques MOOC page](https://www.csie.ntu.edu.tw/~htlin/mooc/) — section titles and slide downloads for every lecture
- [Lecture 13: Hazard of Overfitting (handout)](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/13_handout.pdf) — definitions, the two-learner numbers, four causes, deterministic noise, data cleaning and hinting
- [Lecture 14: Regularization (handout)](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/14_handout.pdf) — H(C), the Lagrange derivation, augmented error, Legendre polynomials, d_EFF, L1/L2, λ and noise
- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf) — videos 50–57 (in Mandarin)
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) — W7 schedule and LFD sections
- [Fall 2024 Homework 4](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf) — Q8–9
- [Fall 2024 Homework 5](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw5/hw5.pdf) — Q1, Q5–6, Q10, Q13
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) — W7 (10/21) schedule
- [LIBLINEAR](https://www.csie.ntu.edu.tw/~cjlin/liblinear/) and [LIBSVM datasets: mnist.scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/multiclass/mnist.scale.bz2) — tool and data for the HW5 coding problems
- [Learning from Data (AMLbook)](http://amlbook.com) — textbook sections 4.0–4.2
