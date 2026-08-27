---
title: "Stanford CS229 Spring 2021 Lecture 7: Kernels and SVMs Hide High-Dimensional Features Inside Inner Products"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, stanford, kernel-methods, svm]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 8
tldr: "The kernel trick avoids constructing high-dimensional features explicitly: if an algorithm needs only K(x,z)=φ(x)ᵀφ(z), it can operate in feature space through kernel evaluations. An SVM then chooses a separating hyperplane by maximizing its geometric margin."
description: "A reading of Stanford CS229 Spring 2021 Lecture 7: feature maps, kernel matrices, the Mercer condition, maximum-margin SVMs, and the computational limits of kernel methods."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-spring2021-lecture-07-kernels-svm)

This is post 8 in [Reading Stanford CS229](/en/series/stanford-cs229), covering **Stanford CS229, Spring 2021, Lecture 7**. The course schedule dates it April 19, 2021, under the official title **Kernels. SVM.** This article uses the Spring 2021 Live Lecture Notes and the assigned shared notes. The recording is not public through the syllabus and was not used as a source.

The lecture follows one line of reasoning. First, rewrite a linear model so that it depends only on inner products between examples. Next, compute those inner products with a kernel rather than constructing the mapped features. Finally, apply the same representation to a maximum-margin classifier. The central question is not how high-dimensional the feature space is, but whether the algorithm needs anything beyond pairwise similarities.

## Moving from parameter space to example space

Let `x ∈ R^d` and map it to nonlinear features `φ(x) ∈ R^p`. When `p` is very large, a direct gradient update costs more as `p` grows. The notes instead change the parameter representation. If optimization starts at zero and every update is a linear combination of training features, then the parameter always has the form

```text
θ = Σᵢ βᵢ φ(xᵢ)
```

The score for a new input becomes

```text
θᵀφ(x) = Σᵢ βᵢ φ(xᵢ)ᵀφ(x)
```

Instead of storing `p` parameters, the model stores `n` coefficients. This is not a free speedup; it exchanges dependence on the number of features for dependence on the number of examples. It is attractive when `p ≫ n`, but a very large `n` creates its own bottleneck.

## What the kernel trick avoids

Define

```text
K(x,z) = φ(x)ᵀφ(z)
```

If `K` can be evaluated directly, training and prediction never need to construct `φ(x)`. The polynomial kernel

```text
K(x,z) = (xᵀz + 1)^q
```

corresponds to a feature map containing many lower-order interactions. Yet evaluating the kernel requires only an inner product in the original space, an addition, and a power. The high-dimensional features still define the model; the algorithm simply accesses them only through inner products.

The notes also present the Gaussian kernel:

```text
K(x,z) = exp(-||x-z||² / (2σ²))
```

It serves as a directly computable measure of local similarity rather than an explicitly listed finite polynomial map. The scale `σ` controls how quickly similarity decays with distance. Lecture 7 does not provide a complete selection procedure, so no fixed value should be treated as universal.

## Not every similarity function is a kernel

For the training set, define the kernel matrix

```text
Kᵢⱼ = K(xᵢ, xⱼ)
```

If `K(x,z)=φ(x)ᵀφ(z)`, then every vector `v` satisfies

```text
vᵀKv = ||Σᵢ vᵢφ(xᵢ)||² ≥ 0
```

The matrix must therefore be positive semidefinite. The notes state the stronger Mercer characterization: a symmetric function is a valid kernel when every finite Gram matrix it produces is positive semidefinite. This gives a mathematical test for a proposed kernel; looking vaguely like a similarity measure is not enough.

The computational limit is equally important. A full kernel matrix has `n²` entries. Constructing and storing it scale quadratically with the number of examples. Kernel methods avoid a potentially enormous `p` by accepting costs tied to `n`.

## Why an SVM maximizes the margin

For binary labels `yᵢ ∈ {-1,+1}`, the decision boundary is `wᵀx+b=0`. Correct classification alone leaves many feasible hyperplanes. An SVM adds a selection principle: maximize the distance of the closest training point from the boundary.

Scaling `(w,b)` together does not change the boundary, so impose the functional-margin normalization

```text
yᵢ(wᵀxᵢ+b) ≥ 1
```

At this scale, geometric margin is proportional to `1/||w||`. Maximizing it is equivalent to

```text
minimize   1/2 ||w||²
subject to yᵢ(wᵀxᵢ+b) ≥ 1
```

The notes then state that the optimum can be written as

```text
w = Σᵢ αᵢyᵢxᵢ,  αᵢ ≥ 0
```

Prediction therefore needs only terms of the form `xᵢᵀx`. Replacing them with `K(xᵢ,x)` yields a kernel SVM. Points with `αᵢ>0` are the support vectors; they are the examples that appear directly in the final expansion.

## What this lecture does not establish

The public handwritten notes use a linearly separable hard-margin SVM to build geometric intuition. They do not fully derive soft margins, slack variables, hinge loss, or dual optimization. They identify KKT conditions as the key to the sparse expansion without proving every condition step by step. This article therefore stays with the claims the notes support: the maximum-margin primal problem, the example-based representation of its solution, and the replacement of inner products by kernels.

Expressiveness also does not imply automatic generalization. Choosing a feature map, kernel family, and hyperparameters remains a modeling decision. Positive semidefiniteness proves that a function defines a valid inner-product structure; it does not prove that the structure fits a particular task.

## Where Lecture 7 sits in the eighteen-lecture path

Lectures 5 and 6 developed generative classifiers. Lecture 7 pushes discriminative linear models toward nonlinear boundaries. It also closes the first supervised-learning block. Lectures 8 and 9 turn to neural networks, where the representation itself is learned layer by layer rather than fixed through a chosen kernel.

To test your understanding, write `θ` as a linear combination of training features and expand `θᵀφ(x)`. If the final score contains only `βᵢ` and `K(xᵢ,x)`, you have located exactly where the kernel trick acts.

## Beyond the lecture

On one dataset, compare explicit quadratic features with a Gram matrix. The first cost grows mainly with the expanded feature dimension; the second grows mainly with the square of the sample count. Record memory use and the number of training-point evaluations required at prediction time, not just accuracy. Those measurements expose the cost of changing representations.

## References

- [Stanford CS229 Spring 2021 syllabus](https://cs229.stanford.edu/syllabus-spring2021.html)
- [Lecture 7 Live Lecture Notes](https://cs229.stanford.edu/notes2021spring/notes2021spring/lecture7_live.pdf)
- [Kernel Methods and Support Vector Machines notes](https://cs229.stanford.edu/notes2020fall/notes2020fall/cs229-notes3.pdf)
