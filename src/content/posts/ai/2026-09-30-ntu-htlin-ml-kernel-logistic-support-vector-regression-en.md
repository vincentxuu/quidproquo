---
title: "Hsuan-Tien Lin's ML Techniques T5–T6: Kernel Logistic Regression and Support Vector Regression — the SVM Is a Regularized Model"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, svm, kernel-methods, logistic-regression, kernel-regression]
lang: en
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 11
tldr: "Lecture 5 of Machine Learning Techniques rewrites the soft-margin SVM in unconstrained form: ½wᵀw plus C times the total hinge error. That is an L2-regularized model, and a larger C means weaker regularization. The hinge error and logistic regression's cross-entropy are both convex upper bounds of the 0/1 error, so the SVM approximates L2-regularized logistic regression. For probability outputs, you can use Platt's two-level learning, running logistic regression on top of SVM scores, or use the representer theorem to do kernel logistic regression directly. Lecture 6 uses the same theorem to get the closed form β = (λI + K)⁻¹y for kernel ridge regression, but β is dense; switching to the ε-insensitive tube error gives SVR with sparse coefficients. Fall 2026 does not schedule these two lectures."
description: "A guide to Lectures 5 (Kernel Logistic Regression) and 6 (Support Vector Regression) of Hsuan-Tien Lin's NTU course Machine Learning Techniques: the unconstrained form of the soft-margin SVM and the hinge error, SVM versus logistic regression, Platt's probabilistic SVM, the representer theorem and kernel logistic regression, kernel ridge regression, LSSVM, tube regression, the SVR primal and dual, and the map of kernel models; with the scheduling differences between two semesters and Fall 2024 HW6 Q3."
draft: false
glossary:
  - term: "hinge error"
    aliases: ["hinge loss"]
    definition: "err(s, y) = max(1 − ys, 0). The error the soft-margin SVM uses once rewritten in unconstrained form; a convex upper bound of the 0/1 error."
    context: "Techniques T5 uses it to connect the SVM back to regularized models."
  - term: "representer theorem"
    definition: "For any L2-regularized linear model, the optimal w* can be written as a linear combination Σ βₙzₙ of the transformed training points, so every such model can be kernelized."
    context: "Techniques T5–T6 use it to derive kernel logistic regression and kernel ridge regression."
  - term: "ε-insensitive error"
    aliases: ["epsilon-insensitive error", "tube error"]
    definition: "err(y, s) = max(0, |s − y| − ε): predictions inside a tube of width ε count as no error; beyond it, the error is the distance to the tube."
    context: "Techniques T6 uses it to derive support vector regression (SVR) with sparse coefficients."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-logistic-support-vector-regression)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

This is part 11 of [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en). It covers Lecture 5, Kernel Logistic Regression, and Lecture 6, Support Vector Regression, of [Machine Learning Techniques](https://www.csie.ntu.edu.tw/~htlin/mooc/). Together they close the first part of Techniques, "Embedding Numerous Features: Kernel Models".

**Sources**: the MOOC slides [205_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/205_handout.pdf) and [206_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/206_handout.pdf), videos 18–25 of the [Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2), the [Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) and its [205u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/205u_handout.pdf), the [Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/), and [Fall 2024 HW6](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf), all opened and checked on 2026-09-30.

## Course video sources

These course video sources were already documented in this article. Playback has not been reverified for each video; no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=Bc8bg5ZkRdk
title: T5-1
```

```youtube
url: https://www.youtube.com/watch?v=5K44AgZvcDk
title: T5-2
```

Original videos: [T5-1](https://www.youtube.com/watch?v=Bc8bg5ZkRdk)、[T5-2](https://www.youtube.com/watch?v=5K44AgZvcDk)、[T5-3](https://www.youtube.com/watch?v=pNfvZYH5iFg)、[T5-4](https://www.youtube.com/watch?v=AbaIkcQUQuo)、[T6-1](https://www.youtube.com/watch?v=5uUob0VX83Y)、[T6-2](https://www.youtube.com/watch?v=rMTD31FFY3g)、[T6-3](https://www.youtube.com/watch?v=0ZIKMdSAJio)、[T6-4](https://www.youtube.com/watch?v=9OBWkHnzr2k)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

## First: these two lectures are barely taught in the NTU classroom

Neither semester schedules these two lectures in full:

- **Fall 2024**: W11 (11/11) used `205u`, retitled "SVM for Soft Binary Classification". Its Summary lists only the first three sections of T5, without the Kernel Logistic Regression section. T6 is not scheduled. The same week moves on to blending and bagging.
- **Fall 2026**: after kernel and soft-margin SVM in W10, W11 (11/18) goes straight to blending, bagging, and AdaBoost. Neither T5 nor T6 is scheduled.

So this post relies on the MOOC materials only. The access level is **A2**: the slides and all 8 videos are free, but there is no dedicated public homework. Only Fall 2024 HW6 Q3 touches the topic, and it has no official solution. If you only want to follow the NTU classroom schedule, you can skip this post for now. If you want the full picture of kernel models, these two lectures are where the SVM reconnects with the linear models from Foundations.

## T5: Kernel logistic regression

### The SVM is a regularized model

The first section of T5 wraps up the previous four lectures in one table: hard and soft margins, each with a primal and a dual form, where the two duals differ only in whether αₙ has an upper bound C. The slide also names the practical tools: [LIBLINEAR](https://www.csie.ntu.edu.tw/~cjlin/liblinear/) for linear and [LIBSVM](https://www.csie.ntu.edu.tw/~cjlin/libsvm/) for nonlinear, with soft margins preferred in practice.

Then it looks at ξₙ from a new angle. For any (b, w), ξₙ is simply the margin violation: 1 − yₙ(wᵀzₙ + b) if the point violates the margin, 0 if not. Together that is max(1 − yₙ(wᵀzₙ + b), 0). Substituting back, the soft-margin SVM can be written without constraints:

```text
min_{b,w}  ½ wᵀw + C Σₙ max(1 − yₙ(wᵀzₙ + b), 0)
```

Lin asks "familiar?" here: this is the L2 regularization of [L14](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/14_handout.pdf), except that w excludes w₀, the parameter has a different name, and the error is a special ê_rr. Why not solve this form directly? Because it is not a QP, there is no obvious kernel trick, and max(·, 0) is not differentiable, which makes it harder to solve.

The comparison table on the slide:

| model | minimize | constraint |
|---|---|---|
| regularization by constraint | E_in | wᵀw ≤ C |
| hard-margin SVM | wᵀw | E_in = 0 (and more) |
| L2 regularization | (λ/N)wᵀw + E_in | — |
| soft-margin SVM | ½wᵀw + C N Ê_in | — |

Three takeaways: a large margin means fewer hyperplanes, which is L2 regularization toward a short w; a soft margin means a special error measure; and a larger C corresponds to a smaller λ, meaning less regularization. Viewing the SVM as a regularized model, the slide says, lets you extend it and connect it to other learning models.

### SVM versus logistic regression

Plot the errors against ys, where s = wᵀz + b:

- 0/1 error: a mistake whenever ys ≤ 0.
- The SVM's error: max(1 − ys, 0), usually called the **hinge error**, a convex upper bound of the 0/1 error.
- Scaled cross-entropy: log₂(1 + exp(−ys)), the other convex upper bound, used by logistic regression; see [part 5](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression-en).

As ys goes to −∞, both behave like −ys. As ys goes to +∞, the hinge error is 0 and the cross-entropy approaches 0. Hence the slide: **SVM ≈ L2-regularized logistic regression**.

Three linear models for binary classification:

| | PLA | soft-margin SVM | regularized logistic regression |
|---|---|---|---|
| how it is solved | minimize the 0/1 error directly | minimize the regularized hinge error by QP | minimize the regularized cross-entropy by GD/SGD |
| pros | efficient when linearly separable | easy optimization, theoretical guarantee | easy optimization, regularization guard |
| cons | only works when linearly separable, otherwise needs pocket | loose bound for very negative ys | loose bound for very negative ys |

Regularized logistic regression approximates the SVM. Can the SVM, in turn, approximate logistic regression? That is the next section.

### Probability outputs from an SVM: Platt's two-level learning

The goal is soft binary classification: outputting a probability. The slides first list two naive ideas. One is to feed the SVM score straight into θ, which is simple but has no logistic regression flavor. The other is to use the SVM solution as the starting point for logistic regression, which is no easier than running logistic regression directly, and loses the benefit of kernels.

The compromise is two-level learning:

```text
g(x) = θ(A · (w_SVMᵀΦ(x) + b_SVM) + B)
```

The SVM fixes the direction of the hyperplane, kernels included; logistic regression only learns a scale A and a shift B to match maximum likelihood. A is usually positive if w_SVM is reasonably good, and B is usually close to 0 if b_SVM is reasonably good.

This is **Platt's probabilistic SVM**, in three steps:

1. Run the SVM on D and turn each point into a 1D score z′ₙ = w_SVMᵀΦ(xₙ) + b_SVM. The slide notes that the actual model does this step in a more complicated way.
2. Run logistic regression on {(z′ₙ, yₙ)} to get (A, B). The slide notes that the actual model adds some special regularization here.
3. Return g(x) = θ(A · (w_SVMᵀΦ(x) + b_SVM) + B).

Because of B, the probabilistic SVM's classification boundary need not match the original SVM's. With only two variables, GD, SGD, or something better will do. Next to 205u, the Fall 2024 course page lists the suggested reading [A Note on Platt's Probabilistic Outputs for Support Vector Machines](http://www.csie.ntu.edu.tw/~htlin/paper/doc/plattprob.pdf) (Lin, Weng, and Lin), which addresses exactly those two "actual model" footnotes. I did not read that paper page by page for this post.

### The representer theorem and kernel logistic regression

Platt's method approximates logistic regression in Z-space. Can we do exact logistic regression in Z-space?

The kernel trick works because the optimal w can be written as Σ βₙzₙ, which lets wᵀz become Σ βₙK(xₙ, x). The SVM, PLA, and logistic regression trained by SGD all have this property. The question is when it is guaranteed.

The **representer theorem** on the slides says that for any L2-regularized linear model

```text
min_w  (λ/N) wᵀw + (1/N) Σₙ err(yₙ, wᵀzₙ)
```

the optimal solution is w* = Σ βₙzₙ. The proof is short. Split w* into a component w∥ in the span of the zₙ and a perpendicular component w⊥. Since w⊥ has zero inner product with every zₙ, the error is unchanged. But if w⊥ ≠ 0, w∥ has a smaller regularizer and is therefore better than w*, a contradiction. So **any L2-regularized linear model can be kernelized**.

Applied to L2-regularized logistic regression, you solve for β directly:

```text
min_β  (λ/N) Σₙ Σₘ βₙβₘ K(xₙ, xₘ) + (1/N) Σₙ log(1 + exp(−yₙ Σₘ βₘ K(xₘ, xₙ)))
```

This is unconstrained optimization, solvable by GD/SGD. The slides also offer another view: treat (K(x₁, x), …, K(x_N, x)) as an N-dimensional transform. KLR is then a linear model in that N-dimensional space, with βᵀKβ as the regularizer.

One final warning: **most of the SVM's αₙ are 0, but KLR's βₙ are usually all nonzero.** Every prediction needs a kernel evaluation against every training point, a cost that comes back in T6.

## T6: Support vector regression

### Kernel ridge regression

The representer theorem also covers regression. Ridge regression from Foundations uses the squared error and has a closed-form solution. What happens once it is kernelized?

Substituting w = Σ βₙzₙ into ridge regression, the objective becomes (λ/N)βᵀKβ plus (1/N)‖y − Kβ‖². Setting the gradient with respect to β to zero gives a closed form:

```text
β = (λI + K)⁻¹ y
```

For λ > 0 the inverse always exists, because K is positive semi-definite, which is Mercer's condition from [T3](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm-en). With simple dense matrix inversion, it takes O(N³) time.

| | linear ridge regression | kernel ridge regression |
|---|---|---|
| solution | w = (λI + XᵀX)⁻¹Xᵀy | β = (λI + K)⁻¹y |
| flexibility | more restricted | flexible through K |
| training | O(d³ + d²N) | O(N³) |
| prediction | O(d) | O(N) |
| suits | efficient when N is much larger than d | hard for big data |

The slide's conclusion: linear versus kernel is a trade-off between efficiency and flexibility.

### LSSVM: a dense β is a problem

Using kernel ridge regression directly for classification is called the **least-squares SVM (LSSVM)**. The slides compare a soft-margin Gaussian SVM with a Gaussian LSSVM: similar boundaries, but the LSSVM has many more support vectors, so prediction is slower and the model is bigger. KLR and LSSVM have dense β; the standard SVM has sparse α. The goal is sparse coefficients for regression too.

### Tube regression and the SVR primal

The trick is a different error. **Tube regression** draws a tube of width ε around the prediction: points inside the tube count as no error, and points outside are charged by their distance to the tube.

```text
err(y, s) = max(0, |s − y| − ε)
```

This is usually called the **ε-insensitive error**. It is close to the squared error when |s − y| is small, and less affected by outliers.

From here, the derivation copies the SVM route. First, write L2-regularized tube regression in SVM form: ½wᵀw plus C times the total tube violation, with b pulled out. Then split the absolute value into two linear constraints, one with an upper violation ξₙ^∧ and one with a lower violation ξₙ^∨:

```text
min_{b,w,ξ^∨,ξ^∧}  ½ wᵀw + C Σₙ (ξₙ^∨ + ξₙ^∧)
subject to  −ε − ξₙ^∨ ≤ yₙ − wᵀzₙ − b ≤ ε + ξₙ^∧
            ξₙ^∨ ≥ 0, ξₙ^∧ ≥ 0
```

This is the **SVR** primal. C trades off regularization against tube violations, and ε sets the vertical width of the tube, one more parameter to choose. It is a QP with d̃ + 1 + 2N variables and 4N constraints.

### The SVR dual and sparsity

Each wall of the tube gets a multiplier, αₙ^∧ and αₙ^∨. The KKT conditions give w = Σ (αₙ^∧ − αₙ^∨)zₙ, so let βₙ = αₙ^∧ − αₙ^∨; the derivative with respect to b gives Σ (αₙ^∧ − αₙ^∨) = 0. The rest follows T4. The resulting dual is a QP much like the SVM dual, solvable by a similar solver, with both sets of α between 0 and C.

Sparsity comes from complementary slackness. If a point lies strictly inside the tube, both ξ are 0, neither complementary slackness bracket is 0, so both α are 0 and βₙ = 0. **Only points on or outside the tube are support vectors.**

### The map of kernel models

The last section of T6 lays out the first six Techniques lectures and the Foundations linear models on one map:

| row | models | the slide's comment |
|---|---|---|
| 1 | PLA/pocket, linear SVR | less used due to worse performance |
| 2 | linear soft-margin SVM, linear ridge regression, regularized logistic regression | popular in LIBLINEAR |
| 3 | kernel ridge regression, kernel logistic regression | less used due to dense β |
| 4 | SVM, SVR, probabilistic SVM | popular in LIBSVM |

Available kernels include polynomial, Gaussian, or your own design (subject to Mercer's condition). The slides close with a line from Spider-Man: with great power comes great responsibility. Kernel models are powerful, and they overfit just the same.

**Try this**: on a regression data set, run scikit-learn's `KernelRidge` and `SVR` with the same RBF kernel. Compare test errors, then count the elements of `SVR`'s `support_` and the nonzero entries of `KernelRidge`'s `dual_coef_`. You will see T6's sparse-versus-dense point for yourself.

## Videos and slides

| Section | Video | Slides |
|---|---|---|
| Soft-Margin SVM as Regularized Model | [T5-1](https://www.youtube.com/watch?v=Bc8bg5ZkRdk) | 205 |
| SVM versus Logistic Regression | [T5-2](https://www.youtube.com/watch?v=5K44AgZvcDk) | 205 |
| SVM for Soft Binary Classification | [T5-3](https://www.youtube.com/watch?v=pNfvZYH5iFg) | 205 |
| Kernel Logistic Regression | [T5-4](https://www.youtube.com/watch?v=AbaIkcQUQuo) | 205 |
| Kernel Ridge Regression | [T6-1](https://www.youtube.com/watch?v=5uUob0VX83Y) | 206 |
| Support Vector Regression Primal | [T6-2](https://www.youtube.com/watch?v=rMTD31FFY3g) | 206 |
| Support Vector Regression Dual | [T6-3](https://www.youtube.com/watch?v=0ZIKMdSAJio) | 206 |
| Summary of Kernel Models | [T6-4](https://www.youtube.com/watch?v=9OBWkHnzr2k) | 206 |

## Practice: Fall 2024 HW6 Q3

Q3 of [HW6](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf) (released 2024-11-18, due 12-02) is an auto-graded multiple-choice problem. It changes the soft-margin SVM's violation penalty from Σ ξₙ to Σ ξₙ² (squared hinge), gives the resulting dual, and asks how to recover the optimal ξ* from the dual solution α*.

It exercises the dual derivation from T4, and also the core idea of T5: ξₙ is the error, and changing the penalty changes the error function. Derive the dual from the Lagrangian yourself first and confirm it matches the form given, then answer the ξ* question. There is no official solution. On a small data set, you can solve both the primal and the dual with a generic QP package (for example CVXPY) to verify your formula for ξ*.

For the other HW6 problems, see the table in the [previous post](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm-en); for the assignment as a whole, see the [Techniques homework guide](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project-en).

## Further reading

- The site's [CS229 2026 notes, chapter 5: kernel methods](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-05-kernel-methods-en): another derivation of kernelization.
- [Caltech Learning from Data](https://work.caltech.edu/telecourse): the English course on the same textbook.

Series navigation: previous, [Kernel trick and soft-margin SVM](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm-en) | next, [Blending, bagging, and AdaBoost](/posts/ai/2026-09-30-ntu-htlin-ml-blending-bagging-adaboost-en) | [series overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/) — outline and slides for all 16 Techniques lectures
- [Techniques Lecture 5: Kernel Logistic Regression (205_handout.pdf)](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/205_handout.pdf)
- [Techniques Lecture 6: Support Vector Regression (206_handout.pdf)](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/206_handout.pdf)
- [Foundations Lecture 14: Regularization (14_handout.pdf)](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/14_handout.pdf)
- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2) (in Mandarin)
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)
- [Fall 2024 Lecture 5: SVM for Soft Binary Classification (205u_handout.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/205u_handout.pdf)
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)
- [Fall 2024 Homework 6 (hw6_red.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf)
- [Lin, Weng, Lin: A Note on Platt's Probabilistic Outputs for Support Vector Machines](http://www.csie.ntu.edu.tw/~htlin/paper/doc/plattprob.pdf)
- [LIBSVM](https://www.csie.ntu.edu.tw/~cjlin/libsvm/)
- [LIBLINEAR](https://www.csie.ntu.edu.tw/~cjlin/liblinear/)
