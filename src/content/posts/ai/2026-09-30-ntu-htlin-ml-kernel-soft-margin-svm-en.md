---
title: "Hsuan-Tien Lin's ML Techniques T3–T4: Kernel Trick and Soft-Margin SVM — Computing an Infinite-Dimensional Classifier and Keeping It from Overfitting"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, svm, kernel-methods]
lang: en
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 10
tldr: "Lecture 3 of Machine Learning Techniques merges \"feature transform + inner product\" into a single kernel function K(x, x′). Training and prediction in the dual SVM only need K, so d̃ can be infinite: the Gaussian kernel corresponds to an infinite-dimensional transform. Lecture 4 admits the SVM can still overfit and introduces violations ξₙ and a parameter C, giving the soft-margin SVM. Its dual differs from the hard-margin one in exactly one way: αₙ gets an upper bound C. The value of αₙ sorts the data into non-SVs, free SVs, and bounded SVs, and the fraction #SV/N upper-bounds the leave-one-out error, a cheap way to rule out dangerous (C, γ)."
description: "A guide to Lectures 3 (Kernel SVM) and 4 (Soft-Margin SVM) of Hsuan-Tien Lin's NTU course Machine Learning Techniques: how the kernel trick cuts an O(d̃) inner product to O(d), the (γ, ζ, Q) of the polynomial kernel, the infinite-dimensional transform behind the Gaussian kernel, trade-offs among three kernels and Mercer's condition; the soft-margin primal and dual, computing b from a free SV, the physical meaning of αₙ, and model selection by cross validation and #SV. Includes the matching Fall 2024 HW6 problems."
draft: false
glossary:
  - term: "kernel trick"
    definition: "Merging a feature transform Φ and an inner product into one function K(x, x′) = Φ(x)ᵀΦ(x′), and computing K directly without mapping x into the high-dimensional space. Algorithms that only use inner products, such as the dual SVM, then no longer depend on the transformed dimension d̃."
    context: "The topic of Techniques T3."
  - term: "Mercer's condition"
    definition: "The necessary and sufficient condition for a function to be a valid kernel: it is symmetric, and the kernel matrix built from any set of data points is positive semi-definite."
    context: "T3 uses it to show that not every similarity measure is a valid kernel."
  - term: "bounded SV"
    aliases: ["bounded support vector"]
    definition: "A support vector with αₙ = C in the soft-margin SVM; its ξₙ equals how far it violates the fat boundary. By contrast, a free SV with 0 < αₙ < C lies exactly on the fat boundary."
    context: "T4 uses the value of αₙ to sort training points into three groups."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

This is part 10 of [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en). It covers Lecture 3, Kernel Support Vector Machine, and Lecture 4, Soft-Margin Support Vector Machine, of [Machine Learning Techniques](https://www.csie.ntu.edu.tw/~htlin/mooc/).

**Sources**: the MOOC slides [203_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/203_handout.pdf) and [204_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/204_handout.pdf), videos 10–17 of the [Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2), the [Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) and [Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) course pages, and [Fall 2024 HW6](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf), all opened and checked on 2026-09-30. The textbook sections are [LFD](http://amlbook.com) e-8.3 (kernels) and e-8.4 (soft margin), as listed on both course pages; I did not open the chapter itself.

Access level: the MOOC materials are **A2**. Adding the public Fall 2024 HW6 PDF, [LIBSVM](https://www.csie.ntu.edu.tw/~cjlin/libsvm/), and the MNIST data brings these two lectures to **A3 (minus grading)**: there are no official solutions, and Gradescope grading is for enrolled students only.

## Course video sources

These course video sources were already documented in this article. Playback has not been reverified for each video; no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=oOi7kqUTqxw
title: T3-1
```

```youtube
url: https://www.youtube.com/watch?v=Fb-WSBvsPak
title: T3-2
```

Original videos: [T3-1](https://www.youtube.com/watch?v=oOi7kqUTqxw)、[T3-2](https://www.youtube.com/watch?v=Fb-WSBvsPak)、[T3-3](https://www.youtube.com/watch?v=_-fIkbSBdF8)、[T3-4](https://www.youtube.com/watch?v=sacJmcs8TKE)、[T4-1](https://www.youtube.com/watch?v=K7ZcAYXuU_A)、[T4-2](https://www.youtube.com/watch?v=fTHTqW5Uq4U)、[T4-3](https://www.youtube.com/watch?v=5z7ujI3YBBE)、[T4-4](https://www.youtube.com/watch?v=ahogAa5Rnmc)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

## Where the last post stopped

The [previous post](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm-en) turned the hard-margin SVM into a dual problem with N variables and N + 1 constraints, which looks independent of the transformed dimension d̃. But the dual's quadratic coefficients q_{n,m} = yₙyₘzₙᵀzₘ are still d̃-dimensional inner products, O(d̃) each if computed naively. T3 solves that. T4 solves a different problem: even with a fat boundary, the hard-margin SVM can still overfit.

## T3: Kernel SVM

### Transform and inner product in one step

The slides demonstrate with the second-order polynomial transform Φ₂(x). For simplicity it includes both x₁x₂ and x₂x₁. Expanding Φ₂(x)ᵀΦ₂(x′) and regrouping gives:

```text
Φ₂(x)ᵀΦ₂(x′) = 1 + xᵀx′ + (xᵀx′)²
```

The right-hand side needs one d-dimensional inner product, so it takes O(d) time, with no need to expand into O(d²) dimensions first. This shortcut for "transform + inner product" is called a **kernel function**, written K_Φ(x, x′) ≡ Φ(x)ᵀΦ(x′).

Every place the dual SVM uses z can switch to K:

- Quadratic coefficients: q_{n,m} = yₙyₘK(xₙ, xₘ)
- Intercept: from any support vector (x_s, y_s), b = y_s − Σ αₙyₙK(xₙ, x_s)
- Prediction: g_SVM(x) = sign(Σ αₙyₙK(xₙ, x) + b)

The Kernel Hard-Margin SVM algorithm on the slides has four steps. Building Q takes O(N²) kernel evaluations, then you solve a QP with N variables, and computing b and predicting take only O(#SV) kernel evaluations. Neither training nor prediction ever touches w itself, so nothing depends on d̃.

### Polynomial kernels

Putting different coefficients in front of the terms of the same quadratic transform gives different kernels. The slides generalize to:

```text
K_Q(x, x′) = (ζ + γ xᵀx′)^Q,  γ > 0, ζ ≥ 0
```

These quadratic kernels have equal power, but a different inner product means different geometry, and the margin changes meaning with it. The slides show three plots with γ = 0.001, 1, and 1000: the boundaries differ, and so do the support vectors, and it is hard to say in advance which is better. **Changing the kernel changes the definition of the margin**, so choosing a kernel is model selection, just like choosing Φ.

With Q = 1, ζ = 0, γ = 1 you get the plain inner product, the **linear kernel**. Lin repeats his usual advice: linear first. Linear problems can often be solved efficiently in the primal.

### The Gaussian kernel: an infinite-dimensional transform

If all you need is a computable K, can Φ be infinite-dimensional? The slides use the 1D kernel K(x, x′) = exp(−(x − x′)²): split it into three exponentials, expand exp(2xx′) as a Taylor series, and it becomes an inner product of two infinite-dimensional vectors. The general form is:

```text
K(x, x′) = exp(−γ‖x − x′‖²),  γ > 0
```

This is the **Gaussian kernel**, also called the RBF kernel. Plugged into g_SVM, the predictor is a linear combination of Gaussians centered at the support vectors. The slide describes it as linear classification in an infinite-dimensional space, with generalization guarded by the large margin.

With a large γ, though, the Gaussians get sharp. In the three plots on the slides (γ = 1, 10, 100), the γ = 100 boundary wraps tightly around each point. The caption reads: **warning: SVM can still overfit :-(**.

### Trade-offs among the three kernels

| kernel | cons | pros |
|---|---|---|
| linear | restricted; data may not be separable | safe, fast (special primal solvers), w and support vectors are explainable |
| polynomial | numerical trouble for large Q (a base below 1 goes to 0, above 1 blows up); three parameters (γ, ζ, Q) are hard to select | more flexible than linear; Q directly controls the degree |
| Gaussian | no w to inspect; slower than linear; possibly too powerful | most powerful; bounded values, so fewer numerical problems than polynomial; only one parameter |

The slides conclude: linear for efficiency, Gaussian for power, and polynomial perhaps only for small Q.

### Designing your own kernel

A kernel is a special kind of similarity, but not every similarity is a kernel. The necessary and sufficient condition is **Mercer's condition**: K is symmetric, and the matrix K built from any data set (entries kᵢⱼ = K(xᵢ, xⱼ)) is always positive semi-definite, because it can be written as ZZᵀ. The slide's verdict: defining your own kernel is possible, but hard.

**Try this**: work the last Fun Time question on the slides. Use the two points x₁ = (1) and x₂ = (−1) to write out the 2×2 matrix for each of the four candidate kernels and see which one is not positive semi-definite. This is the cheapest way to sanity-check a custom kernel.

## T4: Soft-Margin SVM

### The problem with hard margins

The SVM overfits partly because Φ is powerful and partly because it insists on separating the data perfectly. Insisting on separability means being able to shatter, and that gives it the power to fit noise.

The slides start by combining two older methods. The pocket algorithm tolerates mistakes and minimizes their count. The hard-margin SVM wants a large margin but tolerates no mistakes. Combined: minimize ½wᵀw plus C times the number of mistakes, where correctly classified points still satisfy the margin constraint and misclassified points are left alone. **C controls the trade-off between a large margin and noise tolerance.**

That version has two problems. The mistake count is nonlinear, so it is no longer a QP. And it cannot tell "slightly off" from "badly wrong". The fix is to record each point's **margin violation** ξₙ, how far it crosses the fat boundary, and penalize the total violation instead of the number of mistakes:

```text
min_{b,w,ξ}  ½ wᵀw + C Σₙ ξₙ
subject to   yₙ(wᵀzₙ + b) ≥ 1 − ξₙ,  ξₙ ≥ 0
```

A large C means less tolerance for violations; a small C means you would rather have a fatter boundary. This is a QP with d̃ + 1 + N variables and 2N constraints.

### The dual: αₙ gets an upper bound C

The derivation is nearly identical to T2. This time there are two sets of multipliers: αₙ for the margin constraints and βₙ for ξₙ ≥ 0. Setting the derivative with respect to ξₙ to zero gives C − αₙ − βₙ = 0, so βₙ can be replaced by C − αₙ, which also yields 0 ≤ αₙ ≤ C; ξₙ drops out along the way. What remains is exactly the hard-margin inner problem. The result:

```text
min_α  ½ Σₙ Σₘ αₙαₘ yₙyₘ K(xₙ, xₘ) − Σₙ αₙ
subject to  Σₙ yₙαₙ = 0;  0 ≤ αₙ ≤ C
```

The only difference from the hard-margin dual is the upper bound C on αₙ. N variables, 2N + 1 constraints.

### Computing b

With hard margins, any support vector gives you b. With soft margins there are two complementary slackness conditions:

- αₙ(1 − ξₙ − yₙ(wᵀzₙ + b)) = 0
- (C − αₙ)ξₙ = 0

So you need a **free SV** (0 < α_s < C). The second condition forces ξ_s = 0, and the first then gives b = y_s − Σ αₙyₙK(xₙ, x_s). If there is no free SV at all, b is only pinned down to a range. Fall 2024 HW6 Q2 tests exactly this no-free-SV case.

### The physical meaning of αₙ

The same two conditions sort every training point into three groups:

| group | αₙ | ξₙ | location |
|---|---|---|---|
| non-SV | 0 | 0 | outside the fat boundary, or exactly on it |
| free SV | 0 < αₙ < C | 0 | exactly on the fat boundary; used to compute b |
| bounded SV | C | the violation | violating the fat boundary, or exactly on it |

The slides say αₙ can be used for data analysis: bounded SVs are points that may be misclassified or sit too close to the boundary. A 0/1 error only happens when ξₙ ≥ 1, so the fraction of bounded SVs upper-bounds E_in.

### Model selection

A Gaussian soft-margin SVM has at least two parameters, (C, γ), and the three plots on the slides (C = 1, 10, 100) show that a large C overfits too. How do you choose? The answer is validation from Foundations L15; see [part 8](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles-en).

- **Cross validation**: E_cv(C, γ) is not smooth in the parameters and is hard to optimize directly, so in practice you run V-fold CV on a few grid values. This is the most popular criterion.
- **#SV as a bound**: the slides claim E_loocv ≤ #SV / N. The reason: leaving out a non-SV leaves the remaining α optimal, so the leave-one-out model equals the original and that point's error is 0; a support vector's leave-one-out error is at most 1. It is only an upper bound, but it is cheap and can rule out dangerous parameter settings. The slides suggest using #SV as a safety check when computing E_cv takes too long.

**Try this**: with LIBSVM or scikit-learn's `SVC`, run a 3×3 grid over (C, γ) on any binary classification data set and record both the 5-fold CV error and #SV/N. Check whether the grid points with the largest #SV/N also have high CV error.

## Videos and slides

| Section | Video | Slides |
|---|---|---|
| Kernel Trick | [T3-1](https://www.youtube.com/watch?v=oOi7kqUTqxw) | 203 |
| Polynomial Kernel | [T3-2](https://www.youtube.com/watch?v=Fb-WSBvsPak) | 203 |
| Gaussian Kernel | [T3-3](https://www.youtube.com/watch?v=_-fIkbSBdF8) | 203 |
| Comparison of Kernels | [T3-4](https://www.youtube.com/watch?v=sacJmcs8TKE) | 203 |
| Motivation and Primal | [T4-1](https://www.youtube.com/watch?v=K7ZcAYXuU_A) | 204 |
| Dual Problem | [T4-2](https://www.youtube.com/watch?v=fTHTqW5Uq4U) | 204 |
| Messages | [T4-3](https://www.youtube.com/watch?v=5z7ujI3YBBE) | 204 |
| Model Selection | [T4-4](https://www.youtube.com/watch?v=ahogAa5Rnmc) | 204 |

## How the two semesters schedule it

- **Fall 2024**: W10 (11/04) covers kernel SVM and soft-margin SVM in the same week, with slides `203u` and `204u`.
- **Fall 2026**: scheduled for W10 (11/11), with LFD e-8.3 and e-8.4 listed. The `203u_handout.pdf` link returned 404 on 2026-09-30, so this post uses the MOOC version only.

## Practice: Fall 2024 HW6

[HW6](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf) was released 2024-11-18 and due 12-02. It has 12 problems plus 1 bonus; Q1–4 are auto-graded and the rest are graded by TAs. The problems related to this post:

| Problem | Topic | Maps to |
|---|---|---|
| Q1 | Apply the kernel trick to PLA: maintain α instead of w | T3 kernel trick; T2 "w represented by data" |
| Q2 | When every point is a bounded SV, what is the smallest b*? | T4 computing b |
| Q5 | Pad the constant 1 into xₙ and solve the soft-margin SVM: is the solution unchanged? | T1 pulling out b; T4 primal and dual |
| Q6 | A one-class SVM anchored at the origin: derive the dual | T4 dual derivation |
| Q7 | For large enough γ, the Gaussian-kernel ĥ achieves E_in = 0 | T3 Gaussian kernel |
| Q8 | Prove exp(2cos(x − x′) − 2) is a valid kernel | T3 Mercer's condition and the Gaussian kernel |
| Q10 | MNIST 3 vs 7, polynomial kernel: #SV for C ∈ {0.1, 1, 10} and Q ∈ {2, 3, 4} | T3 polynomial kernel; T4 |
| Q11 | Same data, Gaussian kernel with C and γ each in {0.1, 1, 10}: compute the margin 1/‖w‖ | T3, T4 |
| Q12 | Fix C = 1, randomly hold out 200 examples for validation to choose γ, repeat 128 times, plot the selection frequency | T4 model selection |

The data for the programming problems is [mnist.scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/multiclass/mnist.scale.bz2) from the LIBSVM site. The handout recommends LIBSVM and adds two warnings: do not let the package scale the data automatically, since that changes the effective kernel; and check for yourself that the package solves the dual formulation taught in class with enough numerical precision.

There are no official solutions. For Q10–Q12, cross-check #SV and the margin with two different packages (for example LIBSVM and scikit-learn's `SVC`, which is itself built on LIBSVM), and only write conclusions once the numbers agree.

## Further reading

- The site's [CS229 2026 notes, chapter 5: kernel methods](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-05-kernel-methods-en) and [chapter 6: support vector machines](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-06-support-vector-machines-en): the same ideas as written in the Stanford notes.
- [Caltech Learning from Data](https://work.caltech.edu/telecourse): the English course on the same textbook.

Series navigation: previous, [Linear SVM and dual SVM](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm-en) | next, [Kernel logistic regression and support vector regression](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-logistic-support-vector-regression-en) | [series overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/) — outline and slides for all 16 Techniques lectures
- [Techniques Lecture 3: Kernel Support Vector Machine (203_handout.pdf)](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/203_handout.pdf)
- [Techniques Lecture 4: Soft-Margin Support Vector Machine (204_handout.pdf)](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/204_handout.pdf)
- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2) (in Mandarin)
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)
- [Fall 2024 Homework 6 (hw6_red.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf)
- [LIBSVM](https://www.csie.ntu.edu.tw/~cjlin/libsvm/)
- [LIBSVM Data: mnist.scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/multiclass/mnist.scale.bz2)
- [Learning from Data textbook site](http://amlbook.com)
- [Caltech Learning from Data telecourse](https://work.caltech.edu/telecourse)
