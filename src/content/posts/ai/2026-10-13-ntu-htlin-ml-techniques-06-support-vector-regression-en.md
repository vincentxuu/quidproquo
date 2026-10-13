---
title: "Support Vector Regression: Kernels and Sparse Solutions for Regression | NTU Hsuan-Tien Lin Machine Learning Techniques Lecture 6"
date: 2026-10-13
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, svm, kernel-methods, kernel-regression]
lang: en
math: true
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 23
tldr: "The representer theorem turns ridge regression into a problem in β, which gives kernel ridge regression the analytic solution β = (λI + K)⁻¹y, but almost none of the N values βₙ are 0. Replace the squared error with the ε-insensitive tube error, write the problem as a QP along the soft-margin SVM route, take the dual, and you get support vector regression (SVR): the dual has 2N variables, and every point strictly inside the tube has βₙ equal to 0."
description: "A guide to Lecture 6 of NTU Hsuan-Tien Lin's Machine Learning Techniques, Support Vector Regression: the analytic solution of kernel ridge regression, the dense coefficients of LSSVM, tube regression, the full derivation of the SVR primal and dual problems, where sparsity comes from, and the map of linear and kernel models, with examples worked by hand and explanations of the four Fun Time questions."
draft: false
glossary:
  - term: "representer theorem"
    definition: "The optimal solution w* of every L2-regularized linear model can be written as a linear combination Σ βₙzₙ of the transformed training data zₙ, so every such model can be kernelized."
    context: "Proved in Techniques Lecture 5; Lecture 6 uses it to turn ridge regression into kernel ridge regression."
  - term: "kernel ridge regression"
    aliases: ["KRR"]
    definition: "The regression model you get by substituting w = Σ βₙzₙ into ridge regression and solving for β instead. Its analytic solution is β = (λI + K)⁻¹y."
    context: "The first result of Techniques Lecture 6; the coefficients β are dense, and the model is called LSSVM when it is used for classification."
  - term: "ε-insensitive error"
    aliases: ["epsilon-insensitive error", "tube error"]
    definition: "err(y, s) = max(0, |s − y| − ε): a gap between prediction and target of at most ε counts as no error, and beyond that only the excess distance counts."
    context: "Techniques Lecture 6 uses it in place of the squared error to derive support vector regression, whose coefficients are sparse."
  - term: "Support Vector Regression"
    aliases: ["SVR"]
    definition: "The regression model that minimizes ½wᵀw plus C times the sum of the tube violations. Its dual is a QP similar to the SVM dual, and only points on the tube wall or outside the tube have nonzero coefficients."
    context: "The main subject of Techniques Lecture 6, and the last model in the kernel-model part of the course."
---

> 🌏 [中文版](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-06-support-vector-regression)

**Video status: Videos included.** This article is written from the official MOOC handout [206_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/206_handout.pdf) and transcripts of this lecture's four official videos, with formulas following the handout. The transcripts are machine transcripts made for this article (Whisper), not official captions, and no human has proofread them. The videos are taught in Mandarin; the slides are in English. Each section opens with its official video and the approximate time ranges. Page numbers refer to the number at the lower right of each slide (0/23 to 23/23), and wherever the text says "in the lecture" it is paraphrasing what is said in the video.

This is Techniques Lecture 6 in [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en). The Roadmap on page 1 of the handout divides Techniques into three ways of handling features, and this is the last lecture of the first, Embedding Numerous Features: Kernel Models. The same page summarizes the previous lecture, [Techniques Lecture 5: Kernel Logistic Regression](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-logistic-support-vector-regression-en), this way: two-level learning for SVM-like sparse model for soft classification, or using representer theorem with regularized logistic error for dense model. This lecture carries the same tools over to regression: when the output is a real number, how do you use a kernel, and how do you keep the coefficients sparse.

There are four prerequisites: the analytic solution from [Foundations Lecture 9: Linear Regression](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression-en), ridge regression from [Foundations Lecture 14: Regularization](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-14-regularization-en), the dual derivation from [Techniques Lecture 4: Soft-Margin SVM](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-04-soft-margin-svm-en), and the representer theorem from the previous lecture. After reading, you should be able to derive the analytic solution of kernel ridge regression on your own, go from the tube error all the way to the SVR dual, use complementary slackness to explain which points have a coefficient of 0, and compute both models' coefficients by hand for three data points to compare them.

Here is the route of the whole lecture first:

1. **Kernel ridge regression**: substitute $\mathbf{w} = \sum_n \beta_n\mathbf{z}_n$ into ridge regression and solve for $\boldsymbol{\beta}$.
2. **Spot the problem**: $\boldsymbol{\beta}$ is dense, so prediction needs every training point.
3. **Change the error**: replace the squared error with the tube error.
4. **SVR primal**: rewrite it as a QP the way soft-margin SVM was written.
5. **SVR dual**: get rid of the feature dimension, and get sparsity from complementary slackness.
6. **Summary**: lay out the linear and kernel models from Foundations and the first six Techniques lectures on one map.

## Putting a kernel on ridge regression: is the analytic solution still there

```youtube
url: https://www.youtube.com/watch?v=5uUob0VX83Y
title: Support Vector Regression :: Kernel Ridge Regression @ Machine Learning Techniques (機器學習技法)
```

(Video 00:19–01:58 reviews the previous lecture and the representer theorem, 01:58–08:49 rewrites the problem in terms of $\boldsymbol{\beta}$, 08:49–14:36 solves it, 14:36–16:49 compares linear with kernel, and Fun Time follows.)

### Starting from the representer theorem

Page 2 of the handout first recalls the previous lecture's conclusion. For any L2-regularized linear model

$$
\min_{\mathbf{w}}\ \frac{\lambda}{N}\mathbf{w}^\top\mathbf{w} + \frac{1}{N}\sum_{n=1}^{N}\text{err}(y_n, \mathbf{w}^\top\mathbf{z}_n)
$$

the optimal solution can be written as $\mathbf{w}_* = \sum_{n=1}^{N}\beta_n\mathbf{z}_n$, so every such model can be kernelized. The previous lecture set err to the cross-entropy of logistic regression. This lecture sets it to the squared error of regression, $\text{err}(y, \mathbf{w}^\top\mathbf{z}) = (y - \mathbf{w}^\top\mathbf{z})^2$, which is the ridge regression taught in Foundations.

Ridge regression had an analytic solution in Foundations; in the lecture, Lin describes it as a solution that reaches the answer in a single step. The question at the bottom of this page of the handout is: analytic solution for kernel ridge regression?

### Replacing w with β

Page 3 simply substitutes. Since the optimal $\mathbf{w}$ must be a linear combination of the $\mathbf{z}_n$, the handout says that without loss of generality we can solve for the optimal $\boldsymbol{\beta}$ instead. Substitute $\mathbf{w} = \sum_m \beta_m\mathbf{z}_m$ term by term:

**The regularization term.** Each of the two $\mathbf{w}$ brings its own sum. In the lecture, Lin points out that the first sum comes from the $\mathbf{w}$ in front and the second from the $\mathbf{w}$ behind:

$$
\mathbf{w}^\top\mathbf{w} = \Big(\sum_{n=1}^{N}\beta_n\mathbf{z}_n\Big)^\top\Big(\sum_{m=1}^{N}\beta_m\mathbf{z}_m\Big) = \sum_{n=1}^{N}\sum_{m=1}^{N}\beta_n\beta_m\,\mathbf{z}_n^\top\mathbf{z}_m = \sum_{n=1}^{N}\sum_{m=1}^{N}\beta_n\beta_m K(\mathbf{x}_n, \mathbf{x}_m)
$$

The last step is the kernel trick: $\mathbf{z}_n^\top\mathbf{z}_m$ becomes $K(\mathbf{x}_n, \mathbf{x}_m)$, and $\mathbf{z}$ never has to be computed.

**The score inside the error term.** The prediction for the $n$-th data point is

$$
\mathbf{w}^\top\mathbf{z}_n = \sum_{m=1}^{N}\beta_m\,\mathbf{z}_m^\top\mathbf{z}_n = \sum_{m=1}^{N}\beta_m K(\mathbf{x}_n, \mathbf{x}_m)
$$

Together they give the formula on the handout:

$$
\min_{\boldsymbol{\beta}}\ \frac{\lambda}{N}\sum_{n=1}^{N}\sum_{m=1}^{N}\beta_n\beta_m K(\mathbf{x}_n, \mathbf{x}_m) + \frac{1}{N}\sum_{n=1}^{N}\Big(y_n - \sum_{m=1}^{N}\beta_m K(\mathbf{x}_n, \mathbf{x}_m)\Big)^2
$$

The handout annotates each of the two terms: the first is regularization of $\boldsymbol{\beta}$ on $K$-based regularizer, and the second is linear regression of $\boldsymbol{\beta}$ on $K$-based features. The lecture's explanation is the same one given for kernel logistic regression in the previous lecture: this problem can also be seen as a linear model in $\boldsymbol{\beta}$, where the data are first transformed by the kernel (the new features of the $n$-th data point are its kernel values with every training point), and the regularization term is a special version that depends on $K$.

### Writing it with matrices

A double sum is awkward to differentiate, so the handout switches to matrices. Let $\mathrm{K}$ be the $N \times N$ kernel matrix whose $(n, m)$ entry is $K(\mathbf{x}_n, \mathbf{x}_m)$.

- The double sum is $\boldsymbol{\beta}^\top\mathrm{K}\boldsymbol{\beta}$. The lecture's example: take a $\beta_3$ from the front and a $\beta_5$ from the back, and the coefficient multiplying them is row 3, column 5 of $\mathrm{K}$.
- $\sum_m \beta_m K(\mathbf{x}_n, \mathbf{x}_m)$ is the $n$-th component of the vector $\mathrm{K}\boldsymbol{\beta}$, so the sum of squares is $\lVert\mathbf{y} - \mathrm{K}\boldsymbol{\beta}\rVert^2$. In the lecture, Lin notes that this is the same move as in Foundations' derivation of linear regression, where a sum of squares was written as the squared length of a vector.

Expand the squared length:

$$
\lVert\mathbf{y} - \mathrm{K}\boldsymbol{\beta}\rVert^2 = (\mathbf{y} - \mathrm{K}\boldsymbol{\beta})^\top(\mathbf{y} - \mathrm{K}\boldsymbol{\beta}) = \boldsymbol{\beta}^\top\mathrm{K}^\top\mathrm{K}\boldsymbol{\beta} - 2\boldsymbol{\beta}^\top\mathrm{K}^\top\mathbf{y} + \mathbf{y}^\top\mathbf{y}
$$

The cross term can be written as $\mathbf{y}^\top\mathrm{K}\boldsymbol{\beta}$ or as $\boldsymbol{\beta}^\top\mathrm{K}^\top\mathbf{y}$. They are the same number, and in the lecture Lin says it makes no difference which order you write it in. The whole objective is

$$
E_{\text{aug}}(\boldsymbol{\beta}) = \frac{\lambda}{N}\boldsymbol{\beta}^\top\mathrm{K}\boldsymbol{\beta} + \frac{1}{N}\Big(\boldsymbol{\beta}^\top\mathrm{K}^\top\mathrm{K}\boldsymbol{\beta} - 2\boldsymbol{\beta}^\top\mathrm{K}^\top\mathbf{y} + \mathbf{y}^\top\mathbf{y}\Big)
$$

The handout names this model **kernel ridge regression**: use representer theorem for kernel trick on ridge regression.

### Solving for β

$E_{\text{aug}}$ is quadratic in $\boldsymbol{\beta}$ and has no constraints, so the approach is to find where the gradient is 0 (page 4). Differentiate the three terms separately:

- The gradient of $\boldsymbol{\beta}^\top\mathrm{K}\boldsymbol{\beta}$ is $2\mathrm{K}\boldsymbol{\beta}$. The lecture uses a single-variable analogy: the derivative of $\frac{1}{2}ax^2$ with respect to $x$ is $ax$, with $\mathrm{K}$ playing the role of $a$ and $\boldsymbol{\beta}$ the role of $x$. An addition in this article: this rule needs the matrix in the middle to be symmetric, and $\mathrm{K}$ is, because $K(\mathbf{x}_n, \mathbf{x}_m) = \mathbf{z}_n^\top\mathbf{z}_m = K(\mathbf{x}_m, \mathbf{x}_n)$.
- $\boldsymbol{\beta}^\top\mathrm{K}^\top\mathrm{K}\boldsymbol{\beta}$ is also quadratic, the $\mathrm{K}^\top\mathrm{K}$ in the middle is symmetric as well, and the gradient is $2\mathrm{K}^\top\mathrm{K}\boldsymbol{\beta}$.
- $-2\boldsymbol{\beta}^\top\mathrm{K}^\top\mathbf{y}$ is linear, and its gradient is the coefficient $-2\mathrm{K}^\top\mathbf{y}$. The constant term $\mathbf{y}^\top\mathbf{y}$ has gradient 0.

Together:

$$
\nabla E_{\text{aug}}(\boldsymbol{\beta}) = \frac{2}{N}\Big(\lambda\mathrm{K}^\top\mathrm{I}\boldsymbol{\beta} + \mathrm{K}^\top\mathrm{K}\boldsymbol{\beta} - \mathrm{K}^\top\mathbf{y}\Big) = \frac{2}{N}\mathrm{K}^\top\Big((\lambda\mathrm{I} + \mathrm{K})\boldsymbol{\beta} - \mathbf{y}\Big)
$$

The first term was originally $\lambda\mathrm{K}\boldsymbol{\beta}$, and the handout writes it as $\lambda\mathrm{K}^\top\mathrm{I}\boldsymbol{\beta}$. In the lecture, Lin explains that two things were quietly slipped in: $\mathrm{K}$ is symmetric, so adding a transpose changes nothing; and inserting an identity matrix $\mathrm{I}$ changes nothing either. The purpose is to make all three terms start with $\mathrm{K}^\top$ so that it can be factored out.

One way to make the gradient $\mathbf{0}$ is to make the vector inside the parentheses $\mathbf{0}$:

$$
(\lambda\mathrm{I} + \mathrm{K})\boldsymbol{\beta} = \mathbf{y} \quad\Longrightarrow\quad \boldsymbol{\beta} = (\lambda\mathrm{I} + \mathrm{K})^{-1}\mathbf{y}
$$

The handout says two things about this solution.

**The inverse always exists.** It does whenever $\lambda > 0$, because $\mathrm{K}$ is positive semi-definite, which is Mercer's condition from [Techniques Lecture 3: Kernel SVM](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm-en). The lecture puts it this way: a valid kernel gives a positive semi-definite $\mathrm{K}$, and adding a nonzero $\lambda$ on the diagonal makes it invertible for sure. This article fills in the step in between: for any nonzero vector $\mathbf{v}$,

$$
\mathbf{v}^\top(\lambda\mathrm{I} + \mathrm{K})\mathbf{v} = \lambda\lVert\mathbf{v}\rVert^2 + \mathbf{v}^\top\mathrm{K}\mathbf{v} \ \ge\ \lambda\lVert\mathbf{v}\rVert^2 \ >\ 0
$$

so $(\lambda\mathrm{I} + \mathrm{K})\mathbf{v}$ cannot be $\mathbf{0}$, and the matrix is invertible.

**The cost is $O(N^3)$.** The matrix to invert is $N \times N$, and it is dense. The lecture gives the same reason as for $Q_D$ in the dual SVM lecture: most kernel values are not 0, unless two vectors happen to be orthogonal.

Two additions in this article. First, why the point where the gradient is 0 is a minimum: $\boldsymbol{\beta}^\top\mathrm{K}\boldsymbol{\beta} \ge 0$ and $\lVert\mathbf{y} - \mathrm{K}\boldsymbol{\beta}\rVert^2$ are both upward-opening quadratic functions, their sum is still convex, and a point with zero gradient is the global minimum. Second, the handout's wording is one analytic solution. When $\mathrm{K}$ is not invertible, other $\boldsymbol{\beta}$ also make the gradient 0: add to the solution any $\mathbf{v}$ that satisfies $\mathrm{K}\mathbf{v} = \mathbf{0}$. But $\lVert\sum_n v_n\mathbf{z}_n\rVert^2 = \mathbf{v}^\top\mathrm{K}\mathbf{v} = 0$, so all these $\boldsymbol{\beta}$ correspond to exactly the same $\mathbf{w}$, and whichever one you pick gives the same model.

The handout's conclusion on this page: can now do non-linear regression 'easily'. In the lecture, Lin adds that non-linear regression used to mean a feature transform followed by linear regression; now there is a second route, solving the regression problem hidden in the $\mathcal{Z}$ space directly through the kernel.

### Numerical example: a quadratic kernel on three points

What follows is an example made up for this article, not from the slides. Three one-dimensional data points:

| $n$ | $x_n$ | $y_n$ |
|---|---|---|
| 1 | $-1$ | $1$ |
| 2 | $0$ | $0$ |
| 3 | $1$ | $1$ |

The kernel is the second-order polynomial from Techniques Lecture 3, $K(x, x') = (1 + xx')^2$, with $\lambda = 1$.

**Step 1: compute $\mathrm{K}$.** For example $K(x_1, x_1) = (1 + 1)^2 = 4$, $K(x_1, x_2) = (1 + 0)^2 = 1$, and $K(x_1, x_3) = (1 - 1)^2 = 0$:

$$
\mathrm{K} = \begin{bmatrix} 4 & 1 & 0 \\ 1 & 1 & 1 \\ 0 & 1 & 4 \end{bmatrix}, \qquad \lambda\mathrm{I} + \mathrm{K} = \begin{bmatrix} 5 & 1 & 0 \\ 1 & 2 & 1 \\ 0 & 1 & 5 \end{bmatrix}
$$

**Step 2: solve $(\lambda\mathrm{I} + \mathrm{K})\boldsymbol{\beta} = \mathbf{y}$.** The three equations are $5\beta_1 + \beta_2 = 1$, $\beta_1 + 2\beta_2 + \beta_3 = 0$, and $\beta_2 + 5\beta_3 = 1$. Subtracting the third from the first gives $\beta_1 = \beta_3$; substituting into the second gives $\beta_2 = -\beta_1$; substituting back into the first gives $4\beta_1 = 1$:

$$
\boldsymbol{\beta} = \Big(\frac{1}{4},\ -\frac{1}{4},\ \frac{1}{4}\Big)
$$

**Step 3: write out $g$.** Use the conclusion of this section's Fun Time, $g(x) = \sum_n \beta_n K(x_n, x)$:

$$
g(x) = \frac{1}{4}(1 - x)^2 - \frac{1}{4}\cdot 1 + \frac{1}{4}(1 + x)^2 = \frac{1}{4} + \frac{1}{2}x^2
$$

**What this result means.** The three points actually lie on $y = x^2$, yet what is learned is $\frac{1}{4} + \frac{1}{2}x^2$, which predicts $0.75$, $0.25$, $0.75$ at the three training points. The gap comes from regularization: $\lambda = 1$ is heavy for three data points and flattens the curve. Also, none of the three $\beta_n$ is 0.

**Checking against ridge regression in the $\mathcal{Z}$ space.** The transform that goes with this kernel is $\boldsymbol{\Phi}(x) = (1, \sqrt{2}x, x^2)$, because $1 + 2xx' + x^2x'^2 = (1 + xx')^2$. Work back through $\mathbf{w} = \sum_n \beta_n\mathbf{z}_n$:

$$
\mathbf{w} = \frac{1}{4}(1, -\sqrt{2}, 1) - \frac{1}{4}(1, 0, 0) + \frac{1}{4}(1, \sqrt{2}, 1) = \Big(\frac{1}{4},\ 0,\ \frac{1}{2}\Big)
$$

$\mathbf{w}^\top\boldsymbol{\Phi}(x) = \frac{1}{4} + \frac{1}{2}x^2$, which agrees with the result above. Using the linear ridge regression formula $\mathbf{w} = (\lambda\mathrm{I} + \mathrm{Z}^\top\mathrm{Z})^{-1}\mathrm{Z}^\top\mathbf{y}$ directly in the $\mathcal{Z}$ space also gives $(0.25, 0, 0.5)$. The two routes solve the same problem and differ only in whether the matrix to invert is $\tilde{d} \times \tilde{d}$ or $N \times N$. This article ran the computation once with Python's `fractions` and once with numpy, and the results match.

### The trade-off between linear and kernel

Page 5 puts the two kinds of ridge regression side by side, each with a figure above it: on the same data, linear ridge regression on the left draws a straight line and kernel ridge regression on the right draws a curved one, and the vertical red segments from the data points to the line are the errors.

| | linear ridge regression | kernel ridge regression |
|---|---|---|
| Solution | $\mathbf{w} = (\lambda\mathrm{I} + \mathrm{X}^\top\mathrm{X})^{-1}\mathrm{X}^\top\mathbf{y}$ | $\boldsymbol{\beta} = (\lambda\mathrm{I} + \mathrm{K})^{-1}\mathbf{y}$ |
| Flexibility | more restricted | more flexible with $K$ |
| Training | $O(d^3 + d^2N)$ | $O(N^3)$ |
| Prediction | $O(d)$ | $O(N)$ |
| The handout's comment | efficient when $N \gg d$ | hard for big data |

In the linear column, $d^2N$ is the time to compute $\mathrm{X}^\top\mathrm{X}$ and $d^3$ is the time to invert a $d \times d$ matrix. The lecture's explanation: the linear $\mathbf{w}$ has length $d$, so prediction takes time $d$; with a kernel, both training and prediction are tied to the data size $N$, which makes the method a poor fit once the data get large. The lecture also connects back to something discussed in the earlier SVM lectures: besides efficiency, linear models have the advantage that model complexity is easier to control, and you switch to a kernel only when the problem is more complicated and you can afford the computation. The handout sums the page up in one line: linear versus kernel: trade-off between efficiency and flexibility.

### Fun Time: g after solving for β

**Question (page 6):** After getting the optimal $\boldsymbol{\beta}$ from kernel ridge regression based on some kernel function $K$, what is the resulting $g(\mathbf{x})$?

1. $\sum_{n=1}^{N}\beta_n K(\mathbf{x}_n, \mathbf{x})$
2. $\sum_{n=1}^{N} y_n\beta_n K(\mathbf{x}_n, \mathbf{x})$
3. $\sum_{n=1}^{N}\beta_n K(\mathbf{x}_n, \mathbf{x}) + \lambda$
4. $\sum_{n=1}^{N} y_n\beta_n K(\mathbf{x}_n, \mathbf{x}) + \lambda$

**Answer: 1.** The handout's solution joins two equations: the representer theorem gives $\mathbf{w} = \sum_n \beta_n\mathbf{z}_n$, and the regression output is $g(\mathbf{x}) = \mathbf{w}^\top\mathbf{z}$, so

$$
g(\mathbf{x}) = \Big(\sum_{n=1}^{N}\beta_n\mathbf{z}_n\Big)^\top\mathbf{z} = \sum_{n=1}^{N}\beta_n\,\mathbf{z}_n^\top\mathbf{z} = \sum_{n=1}^{N}\beta_n K(\mathbf{x}_n, \mathbf{x})
$$

Why the other choices are wrong is this article's explanation. Choice 2 has an extra $y_n$, which is the SVM form $\mathbf{w} = \sum_n \alpha_n y_n\mathbf{z}_n$; here the coefficient of the linear combination is $\beta_n$ itself, and the information in $y_n$ was already used up when solving $\boldsymbol{\beta} = (\lambda\mathrm{I} + \mathrm{K})^{-1}\mathbf{y}$. Choices 3 and 4 add $\lambda$. $\lambda$ only determines what $\boldsymbol{\beta}$ is during training and does not appear in the prediction formula; the model in this section has no separate constant term $b$ either. The numerical example above was computed with choice 1, and it matched the result in the $\mathcal{Z}$ space.

## A dense β is a problem: switching to the tube error and writing the SVR primal

```youtube
url: https://www.youtube.com/watch?v=rMTD31FFY3g
title: Support Vector Regression :: Support Vector Regression Primal @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–03:33 covers LSSVM and the dense $\boldsymbol{\beta}$, 03:33–07:35 the tube error, 07:35–09:25 the comparison with the squared error, 09:25–12:14 the rewrite that mimics SVM, 12:14–16:17 the introduction of violations, 16:17–18:04 the parameters and the size of the QP, and Fun Time follows.)

### LSSVM: similar boundary, many more support vectors

Foundations showed that linear regression can be used for classification. So can kernel ridge regression, and that use has a name: least-squares SVM (LSSVM). In the lecture, Lin explains that the words least-squares stress that it uses the squared error of regression.

Page 7 of the handout shows two figures on the same binary classification data, with soft-margin Gaussian SVM on the left and Gaussian LSSVM on the right, and the support vectors marked with boxes. The classification boundaries in the two figures are about the same. The difference is in the boxes: on the left only some of the points have one, and on the right almost every point does.

The reason lies in how $\boldsymbol{\beta}$ is computed. In the lecture, Lin points out that $\boldsymbol{\beta}$ comes out of a matrix inversion, and nothing in that makes some of its components come out exactly 0, so every data point is a support vector. The three-point example above is the same: none of the three $\beta_n$ is 0.

Many support vectors cost you at prediction time. In $g(\mathbf{x}) = \sum_n \beta_n K(\mathbf{x}_n, \mathbf{x})$, every nonzero $\beta_n$ needs one kernel evaluation. The handout writes slower prediction, dense $\boldsymbol{\beta}$ (BIG $g$), and in the lecture Lin calls such a $g$ bloated. The handout then sorts models into two groups:

- **Dense $\boldsymbol{\beta}$**: LSSVM, kernel logistic regression.
- **Sparse $\boldsymbol{\alpha}$**: the standard SVM, where most $\alpha_n$ are 0, a property given by the KKT conditions.

That fixes the goal of this section: do regression, but get a $\boldsymbol{\beta}$ as sparse as the standard SVM's.

### The tube error: a small miss is not an error

Page 8 of the handout changes the error function and calls the result **tube regression**. The figure draws a blue band (the tube) above and below the regression line:

- A data point inside the tube: no error.
- A data point outside the tube: the error is its distance to the edge of the tube.

In the lecture, Lin calls the tube a neutral zone: when the prediction is only slightly off the target, it counts as no error and costs nothing; only what goes beyond the neutral zone is charged, and only for the part that goes beyond. As a formula, with $s$ the predicted score and $y$ the target:

$$
\text{err}(y, s) = \max\big(0,\ \lvert s - y\rvert - \epsilon\big)
$$

- When $\lvert s - y\rvert \le \epsilon$, the second argument is at most 0 and the max is 0.
- When $\lvert s - y\rvert > \epsilon$, the second argument is positive and the error is $\lvert s - y\rvert - \epsilon$.

This error is usually called the **$\epsilon$-insensitive error**, with $\epsilon > 0$. The handout calls $\epsilon$ the vertical tube width; the lecture is more precise: $\epsilon$ is the distance tolerated above the line and also below it, so the whole neutral zone is $2\epsilon$ high.

The lecture also says why this form was chosen: the hinge error of soft-margin SVM has a max with 0 in it too, so the errors look alike, the rest of the derivation can follow the SVM one, and that is what gives a chance of getting an SVM-style sparse solution.

### Tube error versus squared error

The top of page 9 puts the figures for the two kinds of regression side by side: the left one has the blue tube and counts only the length of red line beyond the tube; the right one is the squared error, with no tube, and counts the square of the whole red length. In the lecture, Lin says the squared error is a bit like the case of a very, very narrow tube, except that the red length is then squared. The bottom of the page plots both errors against $s$ in one figure: the squared error is a parabola, while the tube error is flat near $y$ and a straight line of fixed slope on each side. The handout's conclusion is that the two are about the same when $\lvert s - y\rvert$ is small, and that the tube error is less affected by outliers. The lecture's explanation uses the word noise: far from the target the squared error grows quickly, and the model will change the whole line to accommodate a few far-off points; the tube error grows gently, so the problem is milder.

The table below was computed for this article, with $\epsilon = 0.5$, to show what each error is as the gap grows:

| $\lvert s - y\rvert$ | tube error | squared error |
|---|---|---|
| $0.2$ | $0$ | $0.04$ |
| $0.5$ | $0$ | $0.25$ |
| $1$ | $0.5$ | $1$ |
| $3$ | $2.5$ | $9$ |
| $10$ | $9.5$ | $100$ |

When the gap goes from 3 to 10, the tube error grows by 7 and the squared error by 91. A single far-off data point weighs much more under the squared error.

### Mimicking SVM: rewriting regularized tube regression

Page 10 first writes down L2-regularized tube regression:

$$
\min_{\mathbf{w}}\ \frac{\lambda}{N}\mathbf{w}^\top\mathbf{w} + \frac{1}{N}\sum_{n=1}^{N}\max\big(0,\ \lvert\mathbf{w}^\top\mathbf{z}_n - y_n\rvert - \epsilon\big)
$$

and then compares it with the standard SVM:

| | regularized tube regression | standard SVM |
|---|---|---|
| Form | $\min \frac{\lambda}{N}\mathbf{w}^\top\mathbf{w} + \frac{1}{N}\sum$ tube violation | $\min \frac{1}{2}\mathbf{w}^\top\mathbf{w} + C\sum$ margin violation |
| How to solve | unconstrained, but max not differentiable | not differentiable either, but QP |
| How to kernelize | representer theorem works, but no obvious sparsity | through the dual; KKT conditions bring sparsity |

The two "but"s on the left are the reasons not to solve it directly. The handout decides to mimic the standard SVM derivation. In the lecture, Lin says a few small things were done to make it look as much like SVM as possible: the parameter changes from $\lambda$ to the $C$ customary in SVM; a $\frac{1}{2}$ goes in front of $\mathbf{w}^\top\mathbf{w}$; and the constant term is pulled out of $\mathbf{w}$ and written as $b$. The result is

$$
\min_{b,\mathbf{w}}\ \frac{1}{2}\mathbf{w}^\top\mathbf{w} + C\sum_{n=1}^{N}\max\big(0,\ \lvert\mathbf{w}^\top\mathbf{z}_n + b - y_n\rvert - \epsilon\big)
$$

An addition in this article on how the two parameters relate: multiply the whole objective of the previous formula by $\frac{N}{2\lambda}$ (a positive number, so the location of the minimum does not change) and you get $\frac{1}{2}\mathbf{w}^\top\mathbf{w} + \frac{1}{2\lambda}\sum_n \max(\cdot)$, so $C$ corresponds to $\frac{1}{2\lambda}$. The larger $C$ is, the smaller $\lambda$ is and the weaker the regularization, which is the same conclusion the previous lecture reached when looking at soft-margin SVM.

### From max and absolute value to linear constraints

Page 11 turns it into a QP in two steps.

**Step 1: introduce $\xi_n$ the way SVM does.** Soft-margin SVM uses a variable $\xi_n$ to record how much each data point violates, and the same is done here:

$$
\begin{aligned}
\min_{b,\mathbf{w},\boldsymbol{\xi}}\quad & \frac{1}{2}\mathbf{w}^\top\mathbf{w} + C\sum_{n=1}^{N}\xi_n \\
\text{s.t.}\quad & \lvert\mathbf{w}^\top\mathbf{z}_n + b - y_n\rvert \le \epsilon + \xi_n, \qquad \xi_n \ge 0
\end{aligned}
$$

In the lecture, Lin explains that we want the gap between the score and $y_n$ to stay within $\epsilon$, and whatever goes beyond is charged as $\xi_n$. This article writes out why the two forms are equivalent: with $(b, \mathbf{w})$ fixed, the constraints require $\xi_n \ge \lvert\mathbf{w}^\top\mathbf{z}_n + b - y_n\rvert - \epsilon$ and also $\xi_n \ge 0$; the objective wants $\xi_n$ as small as possible, so the optimal $\xi_n$ is exactly the larger of these two lower bounds, which is $\max(0, \lvert\mathbf{w}^\top\mathbf{z}_n + b - y_n\rvert - \epsilon)$.

**Step 2: take the absolute value apart.** This is not a QP yet, because the absolute value in the constraint is not a linear operation. The absolute value stands for two cases: $y_n$ is above the score, or $y_n$ is below the score. The handout splits the one $\xi_n$ into two, with $\xi_n^{\wedge}$ recording the violation on the upper side (upper tube violation) and $\xi_n^{\vee}$ the violation on the lower side (lower tube violation):

$$
\begin{aligned}
\min_{b,\mathbf{w},\boldsymbol{\xi}^{\vee},\boldsymbol{\xi}^{\wedge}}\quad & \frac{1}{2}\mathbf{w}^\top\mathbf{w} + C\sum_{n=1}^{N}\big(\xi_n^{\vee} + \xi_n^{\wedge}\big) \\
\text{s.t.}\quad & -\epsilon - \xi_n^{\vee} \ \le\ y_n - \mathbf{w}^\top\mathbf{z}_n - b \ \le\ \epsilon + \xi_n^{\wedge} \\
& \xi_n^{\vee} \ge 0,\quad \xi_n^{\wedge} \ge 0
\end{aligned}
$$

The right-hand inequality handles the upper side: when $y_n$ is above the score by more than $\epsilon$, $\xi_n^{\wedge}$ has to make up the excess. The left-hand inequality handles the lower side. In the lecture, Lin walks through it on the figure: for a data point above the line, the length of red line beyond the blue tube is $\xi_n^{\wedge}$; for one below, the length beyond the tube is $\xi_n^{\vee}$. Add up the lengths of all the red lines, add the regularization term, and that is what gets minimized.

This is what the handout calls the standard Support Vector Regression (SVR) primal: minimize regularizer plus the upper tube violations and the lower violations. The objective is now quadratic in $\mathbf{w}$ plus linear in $\xi$, and every constraint is linear in $(b, \mathbf{w}, \xi)$, so it is a QP.

An addition in this article: the two violations of one data point are never both positive. $\xi_n^{\wedge} > 0$ needs $y_n$ to be above the score by more than $\epsilon$, and $\xi_n^{\vee} > 0$ needs $y_n$ to be below the score by more than $\epsilon$, and the two cannot happen together. So at the optimum $\xi_n^{\vee} + \xi_n^{\wedge}$ equals the original single $\xi_n$, and splitting it did not change the problem.

### Two parameters and the size of the QP

Page 12 sums up this QP:

- **Parameter $C$**: the trade-off of regularization and tube violation. The lecture compares it with SVM: SVM's $C$ sets whether you care more about making fewer mistakes or about a fatter margin; here it is whether you care more about smaller violations or about stronger regularization.
- **Parameter $\epsilon$**: the vertical tube width, that is, how tolerant to be. The handout makes a point of noting one more parameter to choose. In the lecture, Lin says this is where SVR differs noticeably from SVM: no matter what, SVR has one more parameter to pick than SVM.
- **Size**: the variables are one $b$, the $\tilde{d}$ components of $\mathbf{w}$, and two sets of $\xi$ with $N$ each, for $\tilde{d} + 1 + 2N$ in total. The constraints are $2N$ for the upper and lower sides of the tube plus $2N$ for $\xi \ge 0$, for $4N$ in total.

$\tilde{d}$ shows up in the variable count again. As in the SVM lectures, the next step is to move to the dual and use the kernel trick to remove $\tilde{d}$.

### Fun Time: computing the two violations

**Question (page 13):** Consider solving support vector regression with $\epsilon = 0.05$. At the optimal solution, assume that $\mathbf{w}^\top\mathbf{z}_1 + b = 1.234$ and $y_1 = 1.126$. What is $\xi_1^{\vee}$ and $\xi_1^{\wedge}$?

1. $\xi_1^{\vee} = 0.108$, $\xi_1^{\wedge} = 0.000$
2. $\xi_1^{\vee} = 0.000$, $\xi_1^{\wedge} = 0.108$
3. $\xi_1^{\vee} = 0.058$, $\xi_1^{\wedge} = 0.000$
4. $\xi_1^{\vee} = 0.000$, $\xi_1^{\wedge} = 0.058$

**Answer: 3.** First compute $y_1 - \mathbf{w}^\top\mathbf{z}_1 - b = 1.126 - 1.234 = -0.108$. The target is below the score, and by $0.108$, which is more than $\epsilon = 0.05$. The lower constraint $-\epsilon - \xi_1^{\vee} \le -0.108$ requires $\xi_1^{\vee} \ge 0.108 - 0.05 = 0.058$, and minimization makes it exactly $0.058$. The upper constraint $-0.108 \le 0.05 + \xi_1^{\wedge}$ already holds at $\xi_1^{\wedge} = 0$. The handout's solution says that when there is a lower tube violation on some example, trivially there is no upper tube violation.

The $0.108$ in choice 1 is the gap between score and target, forgetting to subtract the $0.05$ the tube tolerates for free. Choice 4 has the right number on the wrong side: $y_1$ is below the score, so the violation is against the lower tube wall. Choice 2 makes both mistakes.

## Taking the dual: escaping the feature dimension and seeing which points have β equal to 0

```youtube
url: https://www.youtube.com/watch?v=0ZIKMdSAJio
title: Support Vector Regression :: Support Vector Regression Dual @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–04:26 covers the Lagrange multipliers and a few KKT conditions, 04:26–09:25 compares the SVM and SVR duals, 09:25–12:38 covers sparsity, and Fun Time follows.)

### Two sets of Lagrange multipliers

The SVR primal has two sets of tube-wall constraints, and page 14 gives each a set of multipliers:

- $\alpha_n^{\wedge}$ goes with the upper constraint $y_n - \mathbf{w}^\top\mathbf{z}_n - b \le \epsilon + \xi_n^{\wedge}$.
- $\alpha_n^{\vee}$ goes with the lower constraint $-\epsilon - \xi_n^{\vee} \le y_n - \mathbf{w}^\top\mathbf{z}_n - b$.

$\xi_n^{\wedge} \ge 0$ and $\xi_n^{\vee} \ge 0$ should each get a set of multipliers too. In the lecture, Lin explains why the handout leaves them out: the soft-margin SVM derivation already showed that multipliers of this kind can all be expressed through $\alpha$ in the end, so only $\alpha$ is tracked.

On this page the handout lists only "Some of the KKT Conditions" and leaves the full derivation to the reader; the bottom of the page reads: standard dual can be derived using the same steps as Lecture 4. In the lecture, Lin says it is almost a repeat of everything done in Techniques Lecture 2 or Lecture 4, only with more variables, and encourages everyone to take a sheet of paper and spend ten to fifteen minutes writing it out. That sheet of paper is written out below; the results the handout lists are marked as such, and the remaining steps were filled in by this article following [Techniques Lecture 2: Dual SVM](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-02-dual-svm-en) and Techniques Lecture 4.

### Deriving the dual

**Write the Lagrange function.** Move each constraint into the form "some quantity $\le 0$", multiply it by its own multiplier, and add it to the objective. The multipliers for $\xi \ge 0$ are written $\gamma_n^{\wedge}$ and $\gamma_n^{\vee}$ (this notation is this article's own), and no multiplier is negative:

$$
\begin{aligned}
\mathcal{L} = {} & \frac{1}{2}\mathbf{w}^\top\mathbf{w} + C\sum_{n=1}^{N}\big(\xi_n^{\vee} + \xi_n^{\wedge}\big) \\
& + \sum_{n=1}^{N}\alpha_n^{\wedge}\big(y_n - \mathbf{w}^\top\mathbf{z}_n - b - \epsilon - \xi_n^{\wedge}\big) + \sum_{n=1}^{N}\alpha_n^{\vee}\big(\mathbf{w}^\top\mathbf{z}_n + b - y_n - \epsilon - \xi_n^{\vee}\big) \\
& - \sum_{n=1}^{N}\gamma_n^{\wedge}\xi_n^{\wedge} - \sum_{n=1}^{N}\gamma_n^{\vee}\xi_n^{\vee}
\end{aligned}
$$

As in Techniques Lecture 2, the primal problem equals $\min_{b,\mathbf{w},\xi}\max_{\alpha,\gamma \ge 0}\mathcal{L}$, strong duality lets the min and the max trade places, and the inner problem has no constraints on $(b, \mathbf{w}, \xi)$, so every partial derivative has to be 0.

**Partial derivatives with respect to $\xi_n^{\wedge}$ and $\xi_n^{\vee}$.**

$$
\frac{\partial\mathcal{L}}{\partial\xi_n^{\wedge}} = C - \alpha_n^{\wedge} - \gamma_n^{\wedge} = 0, \qquad \frac{\partial\mathcal{L}}{\partial\xi_n^{\vee}} = C - \alpha_n^{\vee} - \gamma_n^{\vee} = 0
$$

So $\gamma_n^{\wedge} = C - \alpha_n^{\wedge}$ and $\gamma_n^{\vee} = C - \alpha_n^{\vee}$, which is what the lecture means by expressing them through $\alpha$. $\gamma \ge 0$ then becomes $\alpha_n^{\wedge} \le C$ and $\alpha_n^{\vee} \le C$. Substituting $\gamma$ back, the coefficient of $\xi_n^{\wedge}$ in $\mathcal{L}$ is $C - \alpha_n^{\wedge} - \gamma_n^{\wedge} = 0$, likewise for $\xi_n^{\vee}$, and every term containing $\xi$ disappears.

**Partial derivative with respect to $b$.** The coefficient of $b$ is $-1$ in the $\alpha_n^{\wedge}$ term and $+1$ in the $\alpha_n^{\vee}$ term:

$$
\frac{\partial\mathcal{L}}{\partial b} = -\sum_{n=1}^{N}\alpha_n^{\wedge} + \sum_{n=1}^{N}\alpha_n^{\vee} = 0 \quad\Longrightarrow\quad \sum_{n=1}^{N}\big(\alpha_n^{\wedge} - \alpha_n^{\vee}\big) = 0
$$

This is the second condition listed on page 14 of the handout. With it, the terms containing $b$ disappear too.

**Partial derivative with respect to $\mathbf{w}$.**

$$
\frac{\partial\mathcal{L}}{\partial w_i} = w_i - \sum_{n=1}^{N}\alpha_n^{\wedge}z_{n,i} + \sum_{n=1}^{N}\alpha_n^{\vee}z_{n,i} = 0 \quad\Longrightarrow\quad \mathbf{w} = \sum_{n=1}^{N}\underbrace{\big(\alpha_n^{\wedge} - \alpha_n^{\vee}\big)}_{\beta_n}\mathbf{z}_n
$$

This is the first condition the handout lists. $\mathbf{w}$ is once again a linear combination of the $\mathbf{z}_n$, and the coefficient $\beta_n = \alpha_n^{\wedge} - \alpha_n^{\vee}$ is the SVR version of $\beta_n$. In the lecture, Lin points out that the $\mathbf{z}_n$ comes from differentiating the $\mathbf{w}^\top\mathbf{z}_n$ inside the constraints, much as in soft-margin SVM.

**Substitute back.** With $\xi$ and $b$ eliminated, what is left of $\mathcal{L}$ is

$$
\frac{1}{2}\mathbf{w}^\top\mathbf{w} - \mathbf{w}^\top\sum_{n=1}^{N}\big(\alpha_n^{\wedge} - \alpha_n^{\vee}\big)\mathbf{z}_n + \sum_{n=1}^{N}\alpha_n^{\wedge}(y_n - \epsilon) - \sum_{n=1}^{N}\alpha_n^{\vee}(y_n + \epsilon)
$$

The sum in the second term is $\mathbf{w}$ itself, so the first two terms combine into $-\frac{1}{2}\mathbf{w}^\top\mathbf{w}$. The dual problem takes the max over $\boldsymbol{\alpha}$:

$$
\max_{\boldsymbol{\alpha}^{\wedge},\boldsymbol{\alpha}^{\vee}}\ -\frac{1}{2}\Big\lVert\sum_{n=1}^{N}\big(\alpha_n^{\wedge} - \alpha_n^{\vee}\big)\mathbf{z}_n\Big\rVert^2 - \sum_{n=1}^{N}\Big((\epsilon - y_n)\alpha_n^{\wedge} + (\epsilon + y_n)\alpha_n^{\vee}\Big)
$$

Multiply by $-1$ to turn it into a min, expand the squared length into a double sum, replace the inner products with the kernel, and you have the SVR dual at the lower right of page 15 of the handout, where $k_{n,m}$ is shorthand for $K(\mathbf{x}_n, \mathbf{x}_m)$:

$$
\begin{aligned}
\min_{\boldsymbol{\alpha}^{\wedge},\boldsymbol{\alpha}^{\vee}}\quad & \frac{1}{2}\sum_{n=1}^{N}\sum_{m=1}^{N}\big(\alpha_n^{\wedge} - \alpha_n^{\vee}\big)\big(\alpha_m^{\wedge} - \alpha_m^{\vee}\big)k_{n,m} + \sum_{n=1}^{N}\Big((\epsilon - y_n)\cdot\alpha_n^{\wedge} + (\epsilon + y_n)\cdot\alpha_n^{\vee}\Big) \\
\text{s.t.}\quad & \sum_{n=1}^{N}1\cdot\big(\alpha_n^{\wedge} - \alpha_n^{\vee}\big) = 0 \\
& 0 \le \alpha_n^{\wedge} \le C,\quad 0 \le \alpha_n^{\vee} \le C
\end{aligned}
$$

Only kernel values remain in the formula, and $\tilde{d}$ is gone.

### Matching it up without re-deriving: SVM against SVR

The lecture does not go through that derivation. Instead it uses the four colors on page 15 to show that the shape of a dual problem can be traced. The slide lays out the primal and dual problems of soft-margin SVM and SVR in two columns, and things of the same color end up in the same place:

| What is in the primal | Where it goes in the dual | soft-margin SVM | SVR |
|---|---|---|---|
| The $\mathbf{z}_n$ multiplying $\mathbf{w}$ in the constraint (and its coefficient) | Coefficients of the quadratic term | $y_n y_m K(\mathbf{x}_n, \mathbf{x}_m)$ | $k_{n,m}$, with coefficients $\pm 1$ |
| The constant in the constraint | Coefficients of the linear term | $-1$ (from the 1 in $\ge 1 - \xi_n$) | $\epsilon - y_n$ and $\epsilon + y_n$ |
| Partial derivative with respect to $b$ | One equality | $\sum_n y_n\alpha_n = 0$ | $\sum_n 1\cdot(\alpha_n^{\wedge} - \alpha_n^{\vee}) = 0$ |
| $C\sum\xi$ and $\xi \ge 0$ | Upper bound on the multipliers | $0 \le \alpha_n \le C$ | $0 \le \alpha_n^{\wedge} \le C$, $0 \le \alpha_n^{\vee} \le C$ |

To make the correspondence visible, the slide writes the two SVR constraints as $1\cdot(y_n - \mathbf{w}^\top\mathbf{z}_n - b) \le \epsilon + \xi_n^{\wedge}$ and $1\cdot(\mathbf{w}^\top\mathbf{z}_n + b - y_n) \le \epsilon + \xi_n^{\vee}$, and that 1 stands where SVM's $y_n$ stands. In the lecture, Lin says that once you have these four colors down and know which coefficient goes where, you can write the dual from the primal.

The handout's conclusion on this page is: similar QP, solvable by similar solver. The lecture adds what this means in practice: the fast, good solvers designed for soft-margin SVM can be applied to SVR in a similar way.

### Sparsity: points inside the tube have β equal to 0

All this effort was to find out whether SVR has SVM's kind of sparsity. The tool on page 16 is complementary slackness. The two conditions listed on page 14 of the handout are

$$
\begin{aligned}
\alpha_n^{\wedge}\big(\epsilon + \xi_n^{\wedge} - y_n + \mathbf{w}^\top\mathbf{z}_n + b\big) &= 0 \\
\alpha_n^{\vee}\big(\epsilon + \xi_n^{\vee} + y_n - \mathbf{w}^\top\mathbf{z}_n - b\big) &= 0
\end{aligned}
$$

Each is a multiplier times the slack of its constraint, and at least one of the two is 0. The lecture for Techniques Lecture 2 compared this relationship to Harry Potter and Voldemort, who cannot both survive; this lecture does not bring up the two names again and only keeps the same way of speaking: if the parentheses survive, the multiplier has to die.

Take a data point strictly inside the tube, $\lvert\mathbf{w}^\top\mathbf{z}_n + b - y_n\rvert < \epsilon$. The handout's argument has four steps:

1. It has no violation at all, so $\xi_n^{\wedge} = 0$ and $\xi_n^{\vee} = 0$.
2. The two parentheses become $\epsilon - (y_n - \mathbf{w}^\top\mathbf{z}_n - b)$ and $\epsilon + (y_n - \mathbf{w}^\top\mathbf{z}_n - b)$. The absolute value of the gap is strictly less than $\epsilon$, so both parentheses are strictly greater than 0.
3. The parentheses are not 0, so complementary slackness forces $\alpha_n^{\wedge} = 0$ and $\alpha_n^{\vee} = 0$.
4. $\beta_n = \alpha_n^{\wedge} - \alpha_n^{\vee} = 0$.

This data point contributes nothing to $\mathbf{w}$. Put the other way, the support vectors with $\beta_n \ne 0$ can only be points on the tube wall or outside the tube (the handout: on or outside tube). The handout's conclusion is worded SVR: allows sparse $\boldsymbol{\beta}$. The more points there are inside the tube, the sparser $\boldsymbol{\beta}$ is.

This article adds three more things that follow directly from these conditions and are not written on the handout:

- **For points outside the tube, the multiplier hits $C$.** With an upper violation, $\xi_n^{\wedge} > 0$. The constraint $\xi_n^{\wedge} \ge 0$ has its own complementary slackness $\gamma_n^{\wedge}\xi_n^{\wedge} = 0$, so $\gamma_n^{\wedge} = 0$, which means $\alpha_n^{\wedge} = C$. A lower violation gives $\alpha_n^{\vee} = C$ in the same way.
- **The two multipliers of one data point are never both positive.** If both were positive, both parentheses would have to be 0; the two parentheses add up to $2\epsilon + \xi_n^{\wedge} + \xi_n^{\vee}$, which is always positive when $\epsilon > 0$, so they cannot both be 0. Hence $\beta_n$ is either $\alpha_n^{\wedge}$ or $-\alpha_n^{\vee}$, with magnitude between 0 and $C$.
- **How to compute $b$.** Find a data point with $0 < \alpha_n^{\wedge} < C$: $\alpha_n^{\wedge} < C$ means $\gamma_n^{\wedge} > 0$, so $\xi_n^{\wedge} = 0$; $\alpha_n^{\wedge} > 0$ means the parentheses are 0. Together they give $b = y_n - \mathbf{w}^\top\mathbf{z}_n - \epsilon$, and this data point sits exactly on the upper tube wall. A data point with $0 < \alpha_n^{\vee} < C$ gives $b = y_n - \mathbf{w}^\top\mathbf{z}_n + \epsilon$ instead. This is the same procedure as computing $b$ from a free support vector (a support vector with $0 < \alpha_n < C$) in Techniques Lecture 4.

The three kinds of position in one table:

| Position of the data point | Violations | Multipliers | $\beta_n$ |
|---|---|---|---|
| Strictly inside the tube | both 0 | both 0 | $0$ |
| Exactly on the upper wall / lower wall | both 0 | $0 \le \alpha_n^{\wedge} \le C$ / $0 \le \alpha_n^{\vee} \le C$ | between $0$ and $C$ / between $-C$ and $0$ |
| Above / below the tube | $\xi_n^{\wedge} > 0$ / $\xi_n^{\vee} > 0$ | $\alpha_n^{\wedge} = C$ / $\alpha_n^{\vee} = C$ | $C$ / $-C$ |

### Numerical example: SVR on three points, primal and dual both solved

What follows is an example made up for this article, not from the slides. Three one-dimensional data points lie on one straight line, with no feature transform ($z_n = x_n$, and the kernel is $K(x, x') = xx'$), and $\epsilon = 0.5$, $C = 1$:

| $n$ | $x_n$ | $y_n$ |
|---|---|---|
| 1 | $1$ | $1$ |
| 2 | $2$ | $2$ |
| 3 | $3$ | $3$ |

**Step 1: solve the primal.** Write $r_n = y_n - wx_n - b$. The upper violation of point 3 is at least $r_3 - \epsilon$, and the lower violation of point 1 is at least $-r_1 - \epsilon$, so the sum of the violations is at least

$$
(r_3 - \epsilon) + (-r_1 - \epsilon) = (3 - 3w - b) - (1 - w - b) - 2\epsilon = 1 - 2w
$$

Violations are never negative either, so the objective is at least $\frac{1}{2}w^2 + C\max(0, 1 - 2w)$, a lower bound that does not depend on $b$. For $w \ge \frac{1}{2}$ it is $\frac{1}{2}w^2$, smallest at $w = \frac{1}{2}$ with value $\frac{1}{8}$. For $w < \frac{1}{2}$ it is $\frac{1}{2}w^2 + 1 - 2w$, whose derivative is $w - 2 < 0$, so the smaller $w$ is the larger the value, and it is larger than $\frac{1}{8}$. The minimum of the lower bound is $\frac{1}{8}$, attained at $w = \frac{1}{2}$.

Next, confirm that this lower bound can be reached. $w = \frac{1}{2}$ with no violation at all needs $\lvert\frac{1}{2} + b - 1\rvert \le \frac{1}{2}$ for point 1 and $\lvert\frac{3}{2} + b - 3\rvert \le \frac{1}{2}$ for point 3, that is, $b \le 1$ and $b \ge 1$, so $b = 1$. The optimal solution is

$$
w = \frac{1}{2},\qquad b = 1,\qquad \text{all } \xi_n^{\vee} = \xi_n^{\wedge} = 0,\qquad \text{objective value} = \frac{1}{8}
$$

**Step 2: see where each data point is relative to the tube.**

| $n$ | score $wx_n + b$ | $r_n = y_n - $ score | Position |
|---|---|---|---|
| 1 | $1.5$ | $-0.5$ | exactly on the lower wall |
| 2 | $2$ | $0$ | strictly inside the tube |
| 3 | $2.5$ | $+0.5$ | exactly on the upper wall |

**Step 3: compute the multipliers from the KKT conditions.** Point 2 is strictly inside the tube, so both of its multipliers are 0. Point 1 is on the lower wall, and its upper parentheses are $\epsilon - r_1 = 1 \ne 0$, so $\alpha_1^{\wedge} = 0$ and only $\alpha_1^{\vee}$ can be positive. By the same reasoning, for point 3 only $\alpha_3^{\wedge}$ can be positive. Two equalities remain:

$$
\sum_n \big(\alpha_n^{\wedge} - \alpha_n^{\vee}\big) = \alpha_3^{\wedge} - \alpha_1^{\vee} = 0, \qquad w = \sum_n \big(\alpha_n^{\wedge} - \alpha_n^{\vee}\big)x_n = 3\alpha_3^{\wedge} - \alpha_1^{\vee} = \frac{1}{2}
$$

The solution is $\alpha_3^{\wedge} = \alpha_1^{\vee} = \frac{1}{4}$, both between 0 and $C = 1$. So

$$
\boldsymbol{\beta} = \Big(-\frac{1}{4},\ 0,\ \frac{1}{4}\Big), \qquad g(x) = \sum_n \beta_n K(x_n, x) + b = \Big(-\frac{1}{4}\cdot 1 + \frac{1}{4}\cdot 3\Big)x + 1 = \frac{1}{2}x + 1
$$

$b$ can also be computed with the formula added above: point 3 gives $b = 3 - 1.5 - 0.5 = 1$ and point 1 gives $b = 1 - 0.5 + 0.5 = 1$, which agree.

**Step 4: check the dual objective value.** The quadratic term is $\frac{1}{2}\lVert\sum_n\beta_n x_n\rVert^2 = \frac{1}{2}w^2 = \frac{1}{8}$. The linear term is $(\epsilon - y_3)\alpha_3^{\wedge} + (\epsilon + y_1)\alpha_1^{\vee} = (-2.5)(0.25) + (1.5)(0.25) = -\frac{1}{4}$. The total is $-\frac{1}{8}$, exactly the negative of the primal optimum $\frac{1}{8}$ (the dual was multiplied by $-1$ to be written as a min), so strong duality holds.

**What this result means.**

- Only two of the three data points are support vectors. The middle one has $\beta_2 = 0$ and is not needed for prediction.
- The data actually lie on $y = x$, yet SVR learns a line of slope $\frac{1}{2}$. The tube tolerates an error of $0.5$ and the regularization term prefers a small $w$, so it picks the flattest line that still just fits all three points inside the tube. When $\epsilon$ is chosen too large relative to the range of the data, the model comes out too flat, and that is the price of the extra parameter.
- Run kernel ridge regression on the same data (same kernel, $\lambda = 1$): $\mathrm{K} = \mathbf{x}\mathbf{x}^\top$, $\mathbf{y} = \mathbf{x}$, $\lVert\mathbf{x}\rVert^2 = 14$. Try $\boldsymbol{\beta} = c\,\mathbf{x}$: $(\mathrm{I} + \mathbf{x}\mathbf{x}^\top)c\,\mathbf{x} = c(1 + 14)\mathbf{x}$, and making it equal $\mathbf{x}$ means $c = \frac{1}{15}$, so $\boldsymbol{\beta} = (\frac{1}{15}, \frac{2}{15}, \frac{3}{15})$, none of them 0, and $g(x) = \frac{14}{15}x$. The difference between one sparse model and one dense model shows up already on three data points.

This article checked the numbers in Python: solving the primal and the dual separately with scipy's numerical optimization gives $w = 0.5$, $b = 1$, $\alpha_3^{\wedge} = \alpha_1^{\vee} = 0.25$, and objective values $0.125$ and $-0.125$; scikit-learn's `SVR(kernel='linear', C=1, epsilon=0.5)` reports data points 1 and 3 as the support vectors, with coefficients $-0.25$ and $0.25$ and intercept $1$.

### Fun Time: how many variables the SVR dual has

**Question (page 17):** What is the number of variables within the QP problem of SVR dual?

1. $\tilde{d} + 1$
2. $\tilde{d} + 1 + 2N$
3. $N$
4. $2N$

**Answer: 4.** The handout's solution: there are $N$ variables within $\boldsymbol{\alpha}^{\vee}$, and another $N$ in $\boldsymbol{\alpha}^{\wedge}$.

Each of the other choices is the answer to a different question (this article's comparison): $\tilde{d} + 1$ is the number of variables in the hard-margin SVM primal; $\tilde{d} + 1 + 2N$ is that of the SVR primal; $N$ is that of the SVM dual. The SVR dual has twice as many variables as the SVM dual because every data point has two tube walls, upper and lower.

## Six lectures of kernel models on one map

```youtube
url: https://www.youtube.com/watch?v=9OBWkHnzr2k
title: Support Vector Regression :: Summary of Kernel Models @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–02:25 is the map of linear models, 02:25–04:05 adds the kernel models, 04:05–05:47 discusses which ones are popular in practice, 05:47–06:44 is the power and responsibility of kernels, 06:44–07:20 is Fun Time, and the summary and the preview of the next lecture follow.)

### There are five linear models

Page 18 of the handout first organizes the linear models. Foundations taught three: PLA/pocket for classification, linear (ridge) regression for real-valued regression, and logistic regression for soft classification. Techniques added linear soft-margin SVM to the classification column, and this lecture adds linear SVR to the regression column. In the lecture, Lin explains the logic of the layout: models that solve the same kind of problem go in the same column.

### The full map once kernels are added

Page 19 grows two rows of kernel models underneath. The lecture's overall principle: as long as a linear model has regularization, it has a chance of being extended to a kernel. Together that makes four rows and three columns. The column names in the table below were added by this article following the lecture's explanation, and what is in the cells follows the handout:

| Row | Classification | Regression | Soft classification |
|---|---|---|---|
| 1 | PLA/pocket: minimize the 0/1 error in a special way | linear SVR: minimize the regularized tube error by QP | |
| 2 | linear soft-margin SVM: minimize the regularized hinge error by QP | linear ridge regression: minimize the regularized squared error analytically | regularized logistic regression: minimize the regularized cross-entropy by GD/SGD |
| 3 | | kernel ridge regression: kernelized linear ridge regression | kernel logistic regression: kernelized regularized logistic regression |
| 4 | SVM: minimize the SVM dual by QP | SVR: minimize the SVR dual by QP | probabilistic SVM: run logistic regression on SVM-transformed scores |

Row 3 relies on the representer theorem, and row 4 relies on the dual problem (probabilistic SVM is the two-level approach from the previous lecture).

### Which are popular and which are less used

Pages 18 to 20 of the handout have one comment for each of the four rows:

| Row | The handout's comment | The lecture's reason |
|---|---|---|
| 1 | less used due to worse performance | PLA/pocket cannot match soft-margin SVM, which handles data that are not linearly separable and is efficient to solve. When squared error is what matters, linear ridge regression usually does better than linear SVR |
| 2 | popular in [LIBLINEAR](https://www.csie.ntu.edu.tw/~cjlin/liblinear/) | These three models are the core of what LIBLINEAR implements, along with some variants |
| 3 | less used due to dense $\boldsymbol{\beta}$ | Prediction takes much more effort and there is no extra benefit. Many people pick SVR over kernel ridge regression, and probabilistic SVM over kernel logistic regression |
| 4 | popular in [LIBSVM](https://www.csie.ntu.edu.tw/~cjlin/libsvm/) | All three models are implemented in LIBSVM |

The lecture mentions that both packages were developed at NTU, and that LIBSVM is SVM software used by a great many people.

### With great power comes great responsibility

Page 21 wraps kernel models up in one statement: the possible kernels are polynomial, Gaussian, or your own design (which must satisfy Mercer's condition), and coupled with the five models in rows 3 and 4 they are a powerful extension of linear models. The handout then quotes a line from the film Spider-Man: with great power comes great responsibility.

The lecture spells the line out. The Gaussian kernel corresponds to an infinite-dimensional transform, which is a great deal of power; Foundations already warned, when discussing feature transforms, that this kind of power calls for care. The concrete responsibility is to choose parameters carefully and validate carefully, so that the power does not get misused on overfitting.

### Fun Time: which model is less used

**Question (page 22):** Which of the following model is less used in practice?

1. pocket
2. ridge regression
3. (linear or kernel) soft-margin SVM
4. regularized logistic regression

**Answer: 1.** The handout's solution is that the pocket algorithm generally does not perform better than linear soft-margin SVM, and hence is less used in practice. Checking against the map above: pocket is in row 1; ridge regression and regularized logistic regression are in row 2, popular in LIBLINEAR; soft-margin SVM has its linear version in row 2 and its kernel version in row 4, both among the popular rows.

The summary on page 23 gives each of the four sections one line: kernel ridge regression is the representer theorem on ridge regression; the SVR primal is to minimize regularized tube errors; the SVR dual is a QP similar to SVM dual; and kernel models come with great power and great responsibility. The preview of the next lecture is making cocktail from learning models, and the lecture's picture is mixing a cocktail or a blended fruit juice, combining the strengths of different methods.

## Self-check

**1. Two data points: $x_1 = -1$, $y_1 = -1$; $x_2 = 1$, $y_2 = 1$. Run kernel ridge regression with $K(x, x') = (1 + xx')^2$ and $\lambda = 1$, and find $\boldsymbol{\beta}$ and $g(x)$.**

Answer: $K(x_1, x_1) = K(x_2, x_2) = 4$ and $K(x_1, x_2) = 0$, so $\lambda\mathrm{I} + \mathrm{K}$ is a diagonal matrix with 5 on the diagonal, and $\boldsymbol{\beta} = (-\frac{1}{5}, \frac{1}{5})$. $g(x) = -\frac{1}{5}(1 - x)^2 + \frac{1}{5}(1 + x)^2 = \frac{4}{5}x$, which predicts $0.8$ at $x = 1$, smaller than the target $1$; that is the effect of regularization.

**2. $\epsilon = 0.2$. One data point has score $3.0$ and target $3.5$; another has score $3.0$ and target $2.9$. For each, what are $\xi^{\vee}$, $\xi^{\wedge}$, the tube error, and the squared error?**

Answer: for the first, $y - s = 0.5 > 0.2$ and the target is above the score, so $\xi^{\wedge} = 0.3$, $\xi^{\vee} = 0$, the tube error is $0.3$, and the squared error is $0.25$. For the second, $\lvert y - s\rvert = 0.1 \le 0.2$, so it is inside the tube, both violations and the tube error are 0, and the squared error is $0.01$.

**3. Why must a point strictly inside the tube have $\beta_n$ equal to 0? Must a point with $\beta_n \ne 0$ be outside the tube?**

Criteria: the first part has to use complementary slackness and say that a point inside the tube has both violations equal to 0 and both parentheses strictly greater than 0, so both multipliers are 0. The answer to the second part is no, not necessarily: a point exactly on the tube wall can also have a nonzero $\beta_n$. In this article's three-point example, both support vectors are on the tube wall and no point at all is outside the tube.

**4. In the three-point SVR example, change $C$ to $0.1$ (with $\epsilon$ still $0.5$). What are the optimal $w$ and the objective value? What about $\epsilon = 0$ and $C = 1$?**

Answer: reuse the example's lower bound $\frac{1}{2}w^2 + C\max(0, 1 - 2w)$. With $C = 0.1$, the derivative on the piece $w < \frac{1}{2}$ is $w - 2C = w - 0.2$, the minimum is at $w = 0.2$, and its value is $0.02 + 0.1 \times 0.6 = 0.08$, smaller than the $0.125$ of the no-violation solution. Once violations get cheaper, the model would rather let the first and last points stick out of the tube by $0.6$ in total in exchange for a flatter line; the multipliers of these two points both hit $C = 0.1$, and $w = 0.1 \times 3 - 0.1 \times 1 = 0.2$ checks out. Here $b$ is not unique: keeping point 3 on or above the upper wall, point 1 on or below the lower wall, and point 2 inside the tube needs $1.3 \le b \le 1.9$, and every $b$ in this range gives the same total violation $0.6$ and the same objective value. The reason is that no data point has a multiplier strictly between 0 and $C$, so the formula under "How to compute $b$" in the sparsity subsection has no point to use; the Techniques Lecture 4 handout says the same thing about soft-margin SVM: without a free support vector, you only get a range for $b$. With $\epsilon = 0$, the lower bound on the sum of violations becomes $2 - 2w$ and the lower bound on the objective is $\frac{1}{2}w^2 + \max(0, 2 - 2w)$: for $w < 1$ the derivative is $w - 2 < 0$, so the minimum is at $w = 1$, where $b = 0$, the objective value is $0.5$, and all three points lie on the line. When the tube has no width, SVR fits the data exactly. This article checked both answers with numerical optimization.

**5. $N = 10{,}000$ data points, and $\tilde{d} = 10^6$ after the feature transform. How many variables do the SVR primal and dual QPs each have? If you use kernel ridge regression instead, how large a matrix must be inverted?**

Answer: the primal has $\tilde{d} + 1 + 2N = 1{,}020{,}001$ variables and $4N = 40{,}000$ constraints. The dual has $2N = 20{,}000$ variables, independent of $\tilde{d}$. Kernel ridge regression has to invert a dense $10{,}000 \times 10{,}000$ matrix with $10^8$ entries, $O(N^3)$ is on the order of $10^{12}$, and almost none of the 10,000 values in the resulting $\boldsymbol{\beta}$ are 0.

## Exercises and corresponding reading

**Neither semester of the in-person course scheduled this lecture.** The [Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) covered a revised Lecture 5 (slides `205u`) in W11 (11/11) and went on to blending and bagging in the same week, with Lecture 6 not scheduled. The [Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) finished kernel and soft-margin SVM in W10 and went straight to blending, bagging, and AdaBoost in W11 (11/18), with neither Lecture 5 nor Lecture 6 scheduled. So for this lecture the MOOC handout and videos are the only references, and both are free and public. If you only want to keep pace with the in-person NTU course, you can skip this lecture for now; if you want the complete picture of kernel models, this lecture fills in the regression part.

**Homework.** No public homework problem corresponds to this lecture. For how the homework maps onto the other Techniques lectures, see [Techniques Homework and Final Project](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project-en).

**Hands-on.** Take a regression data set and run scikit-learn's `KernelRidge` and `SVR` once each with the same RBF kernel. Compare their test errors, then count how many elements `SVR`'s `support_` has and how many entries of `KernelRidge`'s `dual_coef_` are nonzero, and you will see this lecture's sparse versus dense on real data. Then turn `epsilon` up and down and watch how the number of support vectors changes.

**Further reading.** [Chapter 5 of the CS229 main notes](https://cs229.stanford.edu/main_notes.pdf) derives kernel methods in a different way; [Caltech Learning from Data](https://work.caltech.edu/telecourse) is the English-language course for the same textbook.

**Next lecture.** [Techniques Lecture 7: Blending and Bagging](/posts/ai/2026-09-30-ntu-htlin-ml-blending-bagging-adaboost-en) moves into the second family of techniques, Combining Predictive Features: Aggregation Models: when you have several models in hand, how do you put them together.

## Course video sources

Original videos: [Kernel Ridge Regression](https://www.youtube.com/watch?v=5uUob0VX83Y), [Support Vector Regression Primal](https://www.youtube.com/watch?v=rMTD31FFY3g), [Support Vector Regression Dual](https://www.youtube.com/watch?v=0ZIKMdSAJio), [Summary of Kernel Models](https://www.youtube.com/watch?v=9OBWkHnzr2k)

- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

Checked: 2026-10-13. The video IDs, titles, and lengths were taken from the official playlist that day; the videos have no caption track on YouTube, and what this article reports from the lecture comes from transcripts made for it.

## Update Log

- 2026-10-13: Changed to one article per lecture. This article covers only Techniques Lecture 6 and was rewritten from the handout and the video transcripts.

## References

- [Techniques Lecture 6 handout, 206_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/206_handout.pdf): the main source for this article. The derivations in the four sections, the four Fun Time questions, and the map of models all come from this handout.
- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2): the IDs and titles of the four videos; what the text reports as said "in the lecture" is paraphrased from machine transcripts of these four videos.
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/): the official entry for handouts and recordings.
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/): confirms that this lecture was not on the Fall 2024 course plan.
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/): confirms that this lecture was not on the Fall 2026 course plan.
- [LIBLINEAR](https://www.csie.ntu.edu.tw/~cjlin/liblinear/): the linear-model software mentioned for row 2 of the handout's map of models.
- [LIBSVM](https://www.csie.ntu.edu.tw/~cjlin/libsvm/): the kernel-model software mentioned for row 4 of the handout's map of models.
- [CS229 main notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf): further reading, the kernel methods in Chapter 5.
- [Caltech Learning from Data](https://work.caltech.edu/telecourse): further reading, the English-language course for the same textbook.
- [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques: Course Overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en): where this lecture sits in the whole course and the reading routes.
