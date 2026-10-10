---
title: "CS189 Spring 2026 Lec 13 & 15: Convergence, Momentum, Adam, SGD"
date: 2026-09-29
category: learning
tags: [berkeley, cs189, machine-learning, open-course, gradient-descent, optimization]
lang: en
type: guide
difficulty: 進階
series:
  name: "Reading Berkeley CS189"
  order: 8
tldr: "CS189 Spring 2026 covers gradient descent in two lectures. Lec 13 derives the learning-rate limit and the condition number from the Hessian's eigenvalues, then moves through momentum, learning-rate schedules, AdaGrad/RMSProp/Adam, and mini-batch SGD. In Lec 15, Dimakis walks through the same material again, starting from a gradient computed by hand on a small data table. Both slide decks, the recordings, Lec 13's handwritten notes, and Discussions 6 and 7 (with solutions) are all publicly accessible."
description: "Guide to Berkeley CS189 Spring 2026 Lectures 13 and 15: convergence conditions for gradient descent, condition number, momentum, learning-rate schedules, Adam, SGD and batch size, plus what Discussions 6–7 cover and the matching Fall 2026 lectures."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-13-15-gradient-descent-optimizers)

**Video status: Videos included.** [Source details](#course-video-sources)

This guide follows the public materials of [CS189 Spring 2026](https://eecs189.org/sp26/) (Jennifer Listgarten / Alex Dimakis). The series starts at the [Berkeley CS189 overview](/en/posts/learning/2026-08-22-berkeley-cs189-spring-2025-overview-en).

The earlier lectures on linear and logistic regression were about *what* to minimize. Starting with Lec 13, the course asks *how* to minimize it. The answer is gradient descent: take a small step against the gradient and repeat until convergence. These two lectures deal with three questions. How big can a step be before training diverges? What do you do when the landscape is flat or badly skewed? And what if the dataset is too large to compute a full gradient at every step?

On the schedule, Lec 13 (3/3) and Lec 15 (3/10) sit on either side of Lec 14 (MLE/MAP). This series combines the two optimization lectures into one post and covers Lec 14 in the [next one](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-14-16-mle-map-bias-variance-entropy-en).

## Course video sources

The official Spring 2026 schedule and the official YouTube playlist (Spring 2026 Lectures, 25 videos) were checked live on 2026-10-10; the lecture recordings embedded here are listed there. No unverified timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=1EAoNdjsOZw
title: Lecture 13 recording: Conv. + Momentum + Adam + Stochastic Gradient Descent
```

```youtube
url: https://www.youtube.com/watch?v=6zV_GGgUa0Y
title: Lecture 15 recording: Learning with Gradient Descent
```

Original videos: [Lecture 13 recording: Conv. + Momentum + Adam + Stochastic Gradient Descent](https://www.youtube.com/watch?v=1EAoNdjsOZw)、[Lecture 15 recording: Learning with Gradient Descent](https://www.youtube.com/watch?v=6zV_GGgUa0Y)

Course and recording entries:

- [Official course and recording entry](https://eecs189.org/sp26/)
- [CS189 Spring 2026 Lectures — official YouTube playlist (25 videos)](https://www.youtube.com/playlist?list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE)

Checked: 2026-10-10.

## Where the materials are

| Lecture | Official title | Materials | Assigned Bishop reading |
|---|---|---|---|
| Lec 13 (3/3) | Convergence + Momentum + Adam + Stochastic Gradient Descent | [Notes folder](https://drive.google.com/drive/folders/1FEQYDjdSckr1DRVQ06day94rTZtcB0ls): `lec13.pdf` plus three handwritten pages (`.heic`); [recording](https://www.youtube.com/watch?v=1EAoNdjsOZw) | 7.1–7.3 (error surfaces, batch/SGD/mini-batch, momentum, learning rate schedules, RMSProp and Adam), Appendix A.4 (eigenvectors) |
| Lec 15 (3/10) | Learning with Gradient Descent | [Notes folder](https://drive.google.com/drive/folders/1Ei_AOgIkLNUFI6JZyoDfWG-_VEm7Xg-1): `lec15.pdf` (62 pages); [recording](https://www.youtube.com/watch?v=6zV_GGgUa0Y) | Same as above |
| Discussion 6 | — | [PDF](https://drive.google.com/file/d/1FFNxd-TEkK53m8s-eHfN9V6xXsoSqMHa/view), [Solutions](https://drive.google.com/file/d/1gfUeWtTRnIXlj_H8pnL3BSl4THOriQQG/view), [Walkthrough](https://youtube.com/playlist?list=PL-ysCubq-Sa-JYWlXIx1NaT7fp5djA_gc) | — |
| Discussion 7 | — | [PDF](https://drive.google.com/file/d/1SloZ3iTpq9qEJ-0uWhQtcdT0fhZh5VVH/view), [Solutions](https://drive.google.com/file/d/16jrdhv1s9cgvaU76tTZdVFIA_zE1sgWf/view), [Walkthrough](https://youtube.com/playlist?list=PL-ysCubq-Sa-ueQ6jkjrrr-qiTlBmv0zd) | — |

I opened every link in this table without logging in on 2026-09-29. On this site's [A0–A3 scale](/en/posts/learning/2026-08-21-global-ai-cs-course-map-en), this stretch of the course is A3: slides, recordings, and discussions with solutions are all available. What you can't get is the in-class Slido Q&A, and the "demo notebook" the slides refer to, which isn't in the Notes folders.

Two small details. The first page of `lec13.pdf` says "Lecture 12", but the content matches the Lec 13 topic on the schedule, so it looks like reused slides with an old header. And the second half of `lec15.pdf` largely repeats `lec13.pdf`: the Hessian, momentum, Adam, and SGD sections are nearly identical. What's new is the hand-worked example Dimakis opens with. If you're short on time, read Lec 13 in full and only the opening of Lec 15.

## Lec 13 handwritten notes: where gradient descent comes from

The first of the three handwritten pages is headed "CS 189 Notes, March 3, Lect 13". It sets up the regression training loss `L = Σ (f(xᵢ) − yᵢ)²` from a housing dataset (square footage, bedrooms, bathrooms → price), with the goal of minimizing it over the weights.

The second page derives gradient descent as a small optimization problem. At the current point `x_t`, approximate the function with its first-order Taylor expansion, and add a penalty `(1/2η)‖x − x_t‖²` so the next step doesn't wander far from `x_t`. Set the gradient of this approximation to zero and you get `x_{t+1} = x_t − η∇f(x_t)`. This view is worth keeping: the learning rate η expresses how much you trust the linear approximation.

## Convergence: why the learning rate has a ceiling

The core derivation in `lec13.pdf` has four steps:

1. **Quadratic approximation.** Near a minimum `w*`, expand the error surface to second order. The gradient term vanishes at the minimum, leaving only the Hessian `H` term.
2. **Switch to eigenvector coordinates.** Eigendecompose `H` and let `αᵢ = (w − w*)ᵀuᵢ`. The error then splits into independent directions, `½ Σ λᵢ αᵢ²`. All eigenvalues positive means a minimum, all negative a maximum, mixed signs a saddle point. The contours are ellipses whose axes align with the eigenvectors.
3. **Each direction converges on its own.** In direction i, gradient descent updates `αᵢ ← (1 − ηλᵢ) αᵢ`, so after τ steps you have `(1 − ηλᵢ)^τ αᵢ⁽⁰⁾`. Convergence requires `|1 − ηλᵢ| < 1` in every direction. When `1 − ηλᵢ` goes negative, the iterates oscillate.
4. **Learning-rate ceiling and condition number.** The steepest direction sets the ceiling, `η < 2/λ_max`. The flattest direction converges slowest, at a rate limited by `λ_min/λ_max`, the reciprocal of the condition number. The larger the condition number (the more skewed the landscape), the slower gradient descent gets.

<details>
<summary>Why Appendix A.4 (eigenvectors) is on the reading list</summary>

The change of coordinates in step 2 relies on the fact that a symmetric matrix has a complete set of orthonormal eigenvectors with real eigenvalues. The slides mark `(w − w*)ᵀH(w − w*) = Σ αᵢ² λᵢ` with "Show it!", and the derivation needs only the definition of an eigenvector plus orthonormality. It's the only piece of linear algebra you may need to review for Lec 13.

</details>

The derivation also explains a practical effect. When features have very different scales (say, square footage next to bedroom count), the Hessian's eigenvalues can differ by orders of magnitude, and gradient descent becomes slow and jittery. Standardizing the features directly improves the condition number.

## Momentum and learning-rate schedules

The slides name two failure modes of gradient descent: it crawls when the surface is flat, and it zigzags when the surface is narrow and steep. Momentum adds μ times the previous update `Δw⁽τ⁻¹⁾` to the current step, so components that keep pointing the same way build up speed.

The slides use two series to explain the effect:

- **Flat directions:** the gradient is roughly constant, the accumulated updates form a geometric series, and the effective learning rate grows.
- **Steep directions:** the gradient alternates in sign, the accumulated updates form an alternating series that partly cancels, and the effective learning rate shrinks.

Next come learning-rate schedules: start with large steps to move fast, then shrink them to guarantee convergence. The slides list four: linear, power-law (marked as the most common), exponential, and cosine (marked as common for LLMs).

## AdaGrad, RMSProp, Adam

All three give each dimension its own learning rate:

| Method | How the slides describe it |
|---|---|
| AdaGrad | Shrinks the learning rate using a running sum of squared gradients, so high-curvature (large-gradient) dimensions take smaller steps; the slides note it was developed at UC Berkeley |
| RMSProp | Replaces the running sum with an exponentially weighted average, focusing on recent gradients; β is typically 0.9 |
| Adam | RMSProp plus momentum; the slides call it "probably the most widely used gradient descent update" |

The slides then return to the batch gradient descent pseudocode and mark the update line as the place where Adam would be implemented. In other words, Adam doesn't change the skeleton of the algorithm, only the update step.

## SGD, mini-batches, and batch size

The last section is about compute cost. With N data points in D dimensions, each batch gradient step costs `O(ND)`. The slides' argument: the training error is already just an empirical estimate of the test error, and the error on a single point is also an estimate, only a noisy one. So you can compute the gradient on one randomly sampled point (SGD) at `O(D)` per step, or on B points (mini-batch) at `O(BD)`. In practice you shuffle the data and sweep through it in order, and one full pass is an epoch. With B = 1, mini-batch is the same as SGD, and both usually go by the name SGD.

For choosing the batch size, the slides lay out the tradeoff:

- **Larger batches:** better gradient estimates, and they use hardware parallelism fully.
- **Smaller batches:** cheaper steps, so you take more of them, and the extra randomness can help escape local minima.
- **Common practice:** increase the batch size until the hardware is saturated, and scale the learning rate in proportion to the batch size.

## Lec 15: the same ideas on a small example

The cover of `lec15.pdf` reads "Plus Momentum, SGD, MiniBatch SGD and Adagrad/Adam", with Bishop Chapter 7 as the reading. It opens with an exercise from Dimakis: a depth-1 linear model with parameters `θ = {w1, w2, b}` and a small table of x1, x2, y values. You do three things in order:

1. Compute the prediction f(x) for each row.
2. Write down the loss J.
3. Compute the gradient ("the gradient is a vector; the first coordinate is dJ/dw1") and move the model against it.

The slides put "Training = Learning = Fitting = Optimizing" on one line to stress that in this course these words all mean the same thing. The rest of the deck returns to Lec 13's convergence analysis and optimizers. If the eigenvalue derivation in Lec 13 feels too abstract, work the small table from the start of Lec 15 by hand first, then go back to the derivation.

## What Discussions 6 and 7 practice

After opening both worksheets, here is how the problems line up with the lectures:

- **Discussion 6** (same week as Lec 13) actually wraps up logistic regression. It asks you to show that the log-odds are linear in x, to show that maximizing the likelihood is equivalent to minimizing cross-entropy, and to work through the likelihood ratio test (the Neyman–Pearson lemma, including the form of the test in the Gaussian case). This extends the [previous post on Lec 11–12](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-11-12-classification-logistic-en) and sets up the cross-entropy discussion in Lec 16.
- **Discussion 7** (same week as Lec 15) opens with gradient descent itself. For over-parameterized least squares with d > n, starting from θ₀ = 0, show that the gradient descent limit is the minimum Euclidean norm solution, `Xᵀ(XXᵀ)⁻¹y`. The second problem shows that the area under the ROC curve equals the probability that a random positive example scores higher than a random negative one.

Spend real time on the first problem of Discussion 7. It shows that gradient descent doesn't just find *a* solution; it prefers a particular one. That idea comes back later when the course discusses generalization and double descent.

## Matching Fall 2026 lectures

In [Fall 2026](https://eecs189.org/fa26/) (Norouzi / Gonzalez), the matching material is Lecture 10 "Gradient Descent (1)" and Lecture 11 "Gradient Descent (2)", scheduled for 9/29 and 10/1 and followed by a Gradient Descent discussion.

## Further reading

- Another treatment of the same material: [CMU 11-785 on gradient descent](/en/posts/ai/2026-08-22-cmu-11785-04-gradient-descent-en), [loss surfaces and momentum](/en/posts/ai/2026-08-22-cmu-11785-06-loss-surfaces-momentum-en), [SGD and second-order methods](/en/posts/ai/2026-08-22-cmu-11785-07-sgd-second-order-en), [optimizers and regularization](/en/posts/ai/2026-08-22-cmu-11785-08-optimizers-regularization-en)
- Classic ML for comparison: [Stanford CS229 guide](/en/posts/ai/2026-08-21-stanford-cs229-machine-learning-en)

Previous: [Lec 11–12: classification and logistic regression](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-11-12-classification-logistic-en). Next: [Lec 14 & 16: MLE vs MAP, bias-variance, entropy and KL](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-14-16-mle-map-bias-variance-entropy-en).

## Things you can do tonight

1. Open the small data table at the start of `lec15.pdf`, compute the gradient by hand and take one update step. Make sure you can write down dJ/dw1.
2. Take a 2D quadratic (for example the slides' `(w0 − 1)² + (w1 − 2)² + 1`), multiply the coefficient in one direction by 100, run gradient descent in NumPy, and find the smallest η that makes it diverge. Compare it with `2/λ_max`.
3. Do the first problem of Discussion 7 before watching its walkthrough.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The official Spring 2026 schedule and YouTube playlist were checked live and list the embedded lecture recordings, so the status is now Videos included.

## References

- [CS189 Spring 2026 homepage and schedule](https://eecs189.org/sp26/)
- [CS189 Spring 2026 syllabus](https://eecs189.org/sp26/syllabus/)
- [Lecture 13 Notes folder (lec13.pdf, handwritten notes)](https://drive.google.com/drive/folders/1FEQYDjdSckr1DRVQ06day94rTZtcB0ls)
- [Lecture 13 recording: Conv. + Momentum + Adam + Stochastic Gradient Descent](https://www.youtube.com/watch?v=1EAoNdjsOZw)
- [Lecture 15 Notes folder (lec15.pdf)](https://drive.google.com/drive/folders/1Ei_AOgIkLNUFI6JZyoDfWG-_VEm7Xg-1)
- [Lecture 15 recording: Learning with Gradient Descent](https://www.youtube.com/watch?v=6zV_GGgUa0Y)
- [Discussion 6 PDF](https://drive.google.com/file/d/1FFNxd-TEkK53m8s-eHfN9V6xXsoSqMHa/view) / [Solutions](https://drive.google.com/file/d/1gfUeWtTRnIXlj_H8pnL3BSl4THOriQQG/view)
- [Discussion 7 PDF](https://drive.google.com/file/d/1SloZ3iTpq9qEJ-0uWhQtcdT0fhZh5VVH/view) / [Solutions](https://drive.google.com/file/d/16jrdhv1s9cgvaU76tTZdVFIA_zE1sgWf/view)
- [CS189 Spring 2026 lecture playlist](https://www.youtube.com/playlist?list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE)
- [CS189 Fall 2026 schedule](https://eecs189.org/fa26/)
