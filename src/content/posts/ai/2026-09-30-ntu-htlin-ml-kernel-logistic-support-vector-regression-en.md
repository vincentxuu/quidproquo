---
title: "Kernel Logistic Regression: The SVM Is a Regularized Model | NTU Hsuan-Tien Lin Machine Learning Techniques Lecture 5"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, svm, kernel-methods, logistic-regression]
lang: en
math: true
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 22
tldr: "The ξₙ of the soft-margin SVM can be written directly as max(1 − yₙ(wᵀzₙ + b), 0), which turns the whole problem into ½wᵀw plus C times the sum of hinge errors: an L2-regularized model in which C corresponds to 1/(2λ). The hinge error and logistic regression's cross-entropy are both convex upper bounds of the 0/1 error, so the SVM approximates L2-regularized logistic regression. There are two routes to probability outputs: Platt's two-level learning learns only two extra numbers, A and B; the representer theorem guarantees that the optimal w is a linear combination of the zₙ, so kernel logistic regression can be done directly in the Z space, at the price that the N coefficients βₙ are usually all nonzero."
description: "A guide to Lecture 5 of NTU Hsuan-Tien Lin's Machine Learning Techniques, Kernel Logistic Regression: the unconstrained form of the soft-margin SVM, the hinge error compared with cross-entropy, Platt's probabilistic SVM, the proof of the representer theorem, and kernel logistic regression, with every step computed on six points."
draft: false
glossary:
  - term: "hinge error"
    aliases: ["hinge loss"]
    definition: "err(s, y) = max(1 − ys, 0). The error the soft-margin SVM uses once it is rewritten in unconstrained form; a convex upper bound of the 0/1 error."
    context: "Techniques Lecture 5 uses it to connect the SVM back to the regularized models of Foundations."
  - term: "probabilistic SVM"
    aliases: ["Platt's model", "Platt scaling"]
    definition: "Run the SVM first to get a score, then use a logistic regression with only two variables, A and B, to scale and shift the score into a probability: g(x) = θ(A·(SVM score) + B)."
    context: "Techniques Lecture 5 calls it two-level learning."
  - term: "representer theorem"
    definition: "The optimal solution w* of every L2-regularized linear model can be written as a linear combination Σ βₙzₙ of the transformed training data zₙ, so every such model can be kernelized."
    context: "Techniques Lecture 5 uses it to derive kernel logistic regression, and Lecture 6 uses it again to derive kernel ridge regression."
  - term: "kernel logistic regression"
    aliases: ["KLR"]
    definition: "Substitute w = Σ βₙzₙ into L2-regularized logistic regression and optimize over the N coefficients βₙ with no constraints; only kernel values appear in the formula."
    context: "The Kernel Logistic Regression section of Techniques Lecture 5; the coefficients βₙ are usually all nonzero."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-logistic-support-vector-regression)

**Video status: Videos included.** This article is written from the official MOOC handout [205_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/205_handout.pdf) and transcripts of the four official videos, with formulas following the handout. The transcripts are machine transcripts made for this article (Whisper), not official captions, and no human has proofread them. The videos are taught in Mandarin; the slides are in English. Each section opens with its official video and the approximate time ranges. Page numbers refer to the number at the lower right of each slide (0/20 to 20/20), and wherever the text says "in the lecture" it is paraphrasing what is said in the video.

This is Techniques Lecture 5 in [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en). The Roadmap on page 1 of the handout divides Techniques into three ways of handling features, and this lecture is still inside the first, Embedding Numerous Features: Kernel Models. The same page summarizes the previous lecture, [Techniques Lecture 4: Soft-Margin SVM](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-04-soft-margin-svm-en), this way: allow some margin violations $\xi_n$ while penalizing them by $C$, which is equivalent to upper-bounding the dual problem's $\alpha_n$ by $C$.

With the previous lecture, the SVM itself is complete. This lecture turns in a different direction: the SVM only answers circle or cross, while [Foundations Lecture 10: Logistic Regression](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-10-logistic-regression-en) answers how probable it is that a point is a circle. Lin opens the lecture by saying that it will look at what methods come out of combining logistic regression with kernels. The four sections do four things in order:

1. Rewrite the soft-margin SVM in a form with no constraints and recognize it as L2 regularization.
2. Compare the error the SVM uses with the error logistic regression uses, and explain why the two models are close.
3. Use that closeness to make the SVM output probabilities (Platt's two-level learning).
4. Prove the representer theorem and do logistic regression directly in the kernel's Z space.

The prerequisites are the primal and dual soft-margin SVM problems from the previous lecture, the kernel trick from [Techniques Lecture 3: Kernel SVM](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm-en), logistic regression and gradient descent from Foundations Lecture 10, and L2 regularization from [Foundations Lecture 14: Regularization](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-14-regularization-en). After reading, you should be able to write the soft-margin SVM in unconstrained form and state how $C$ corresponds to $\lambda$, explain why the hinge error and cross-entropy look alike at the two ends, build a probabilistic SVM in three steps, prove the representer theorem yourself, and write down the expression that kernel logistic regression minimizes.

The whole article shares one set of six one-dimensional data points made up for this article (they are not in the handout). Every section computes on them once, and all the numbers were checked in Python. NTU's on-campus course did not schedule this lecture in full in either semester; how it maps is covered in "Exercises and corresponding reading" at the end.

## Folding ξ into the objective: the soft-margin SVM is L2 regularization

```youtube
url: https://www.youtube.com/watch?v=Bc8bg5ZkRdk
title: Kernel Logistic Regression :: Soft-Margin SVM as Regularized @ Machine Learning Techniques (機器學習技法)
```

(In the video, 00:18–03:20 reviews the first four lectures and introduces two software packages, 03:20–07:06 writes $\xi_n$ as a max, 07:06–10:00 compares it with regularization, 10:00–12:42 places the SVM among regularized models, and Fun Time follows.)

### The four problems from the first four lectures

Page 2 of the handout gathers the first four lectures into one table. $Q$ is the matrix from Techniques Lecture 2, with entries $q_{n,m} = y_n y_m \mathbf{z}_n^\top\mathbf{z}_m$; from Techniques Lecture 3 on, the inner product is computed with a kernel.

| | primal | dual |
|---|---|---|
| hard-margin | $\min_{b,\mathbf{w}} \frac{1}{2}\mathbf{w}^\top\mathbf{w}$, subject to $y_n(\mathbf{w}^\top\mathbf{z}_n + b) \ge 1$ | $\min_{\boldsymbol{\alpha}} \frac{1}{2}\boldsymbol{\alpha}^\top Q\boldsymbol{\alpha} - \mathbf{1}^\top\boldsymbol{\alpha}$, subject to $\mathbf{y}^\top\boldsymbol{\alpha} = 0$ and $0 \le \alpha_n$ |
| soft-margin | $\min_{b,\mathbf{w},\boldsymbol{\xi}} \frac{1}{2}\mathbf{w}^\top\mathbf{w} + C\sum_n \xi_n$, subject to $y_n(\mathbf{w}^\top\mathbf{z}_n + b) \ge 1 - \xi_n$ and $\xi_n \ge 0$ | the same objective, subject to $\mathbf{y}^\top\boldsymbol{\alpha} = 0$ and $0 \le \alpha_n \le C$ |

The two dual problems differ only in whether $\alpha_n$ has the upper bound $C$. The bottom of the page says soft-margin preferred in practice, with [LIBLINEAR](https://www.csie.ntu.edu.tw/~cjlin/liblinear/) for the linear case and [LIBSVM](https://www.csie.ntu.edu.tw/~cjlin/libsvm/) for the non-linear case. In the lecture, Lin adds that few people really use hard-margin in practice; that both open-source packages come from the lab of Professor Chih-Jen Lin at NTU and are used by many people around the world; and that the SVM LIBLINEAR solves differs slightly from the form taught in this course, though it does not perform much differently.

### ξ does not have to be a variable

Page 3 goes back to the primal soft-margin problem:

$$
\min_{b,\mathbf{w},\boldsymbol{\xi}} \ \frac{1}{2}\mathbf{w}^\top\mathbf{w} + C\sum_{n=1}^{N}\xi_n \qquad \text{subject to} \quad y_n(\mathbf{w}^\top\mathbf{z}_n + b) \ge 1 - \xi_n,\quad \xi_n \ge 0
$$

The figure at the upper right of this page draws a fat boundary with one point inside it, labeled violation. The handout says that on any $(b, \mathbf{w})$, $\xi_n$ is exactly that point's margin violation:

$$
\xi_n = \max\big(1 - y_n(\mathbf{w}^\top\mathbf{z}_n + b),\ 0\big)
$$

In the lecture, Lin goes through two cases. When a point violates the fat boundary, $\xi_n$ records how far $y_n$ times the score falls short of the 1 we want, which is $1 - y_n(\mathbf{w}^\top\mathbf{z}_n + b)$, a positive number. When a point does not violate, $\xi_n$ records 0, and in that case $1 - y_n(\mathbf{w}^\top\mathbf{z}_n + b)$ is at most 0. Both cases are "the larger of two numbers", so they are written as one max.

The handout does not say why $\xi_n$ must take this value, so this article fills it in. Fix $(b, \mathbf{w})$ first and look only at $\boldsymbol{\xi}$:

- The only part of the objective that involves $\boldsymbol{\xi}$ is $C\sum_n \xi_n$. Since $C > 0$, every $\xi_n$ should be as small as possible.
- Each constraint governs just one $\xi_n$: it has to satisfy both $\xi_n \ge 1 - y_n(\mathbf{w}^\top\mathbf{z}_n + b)$ and $\xi_n \ge 0$.
- A number that is no smaller than two given numbers can be at best the larger of the two, which is the max above.

So "minimize over $(b, \mathbf{w}, \boldsymbol{\xi})$ together" can be done in two levels: the inner level minimizes over $\boldsymbol{\xi}$, whose answer we already know, and after substituting it back the outer level has only $(b, \mathbf{w})$ left, with all the constraints used up. The handout calls the result the unconstrained form of the soft-margin SVM:

$$
\min_{b,\mathbf{w}} \ \frac{1}{2}\mathbf{w}^\top\mathbf{w} + C\sum_{n=1}^{N}\max\big(1 - y_n(\mathbf{w}^\top\mathbf{z}_n + b),\ 0\big)
$$

In the lecture, Lin explains that $\xi_n$ is no longer a variable but a result computed from $b$ and $\mathbf{w}$; when optimizing, you only move $b$ and $\mathbf{w}$ around and see which pair is best.

### Side by side with L2 regularization from Foundations

Next to this expression, page 4 asks familiar? and then sets two expressions side by side:

$$
\underbrace{\min \ \frac{1}{2}\mathbf{w}^\top\mathbf{w} + C\sum \widehat{\mathrm{err}}}_{\text{soft-margin SVM}} \qquad\qquad \underbrace{\min \ \frac{\lambda}{N}\mathbf{w}^\top\mathbf{w} + \frac{1}{N}\sum \mathrm{err}}_{\text{L2 regularization}}
$$

The right-hand side is the augmented error from Foundations Lecture 14: one term handles the length of $\mathbf{w}$, the other handles the error. The left-hand side has exactly the same structure. The handout lists three differences: with shorter $\mathbf{w}$, another parameter, and special err.

- **A shorter $\mathbf{w}$**: in the lecture, Lin explains that the SVM separates $w_0$ out and writes it as $b$, so the regularized $\mathbf{w}$ has one component fewer and $b$ is not penalized.
- **Another parameter**: it uses $C$, not $\lambda$.
- **A special error**: $\widehat{\mathrm{err}}$ is the max from a moment ago. The hat marks it as the surrogate error the algorithm uses; the section "How similar the hinge error is to logistic regression's error" looks at it closely.

How do the two parameters convert? The handout gives only the conclusion, in the solution to this section's Fun Time; the conversion itself is an addition in this article. Multiply the whole right-hand expression by the positive number $\frac{N}{2\lambda}$, which does not move the location of the minimum:

$$
\frac{N}{2\lambda}\Big(\frac{\lambda}{N}\mathbf{w}^\top\mathbf{w} + \frac{1}{N}\sum \mathrm{err}\Big) = \frac{1}{2}\mathbf{w}^\top\mathbf{w} + \frac{1}{2\lambda}\sum \mathrm{err}
$$

Matching it term by term with the left-hand side, $C$ corresponds to $\frac{1}{2\lambda}$. The larger $C$ is, the smaller $\lambda$ is and the weaker the regularization. This also fits how the previous lecture read $C$: a large $C$ means caring more about the violations and accepting a narrower boundary (a longer $\mathbf{w}$) in exchange.

### Why the earlier lectures didn't solve this form directly

If the SVM is just a regularized model, why not introduce it that way from the start? The lower part of page 4 gives two reasons:

- **not QP, no (?) kernel trick**: in the lecture, Lin says this new problem looks at first as if it has no constraints, but it is also not "a quadratic objective with linear constraints"; everything has been packed into the expression being minimized. It is not a quadratic program, so the duality and kernels derived earlier for QP are not so easy to apply.
- **$\max(\cdot, 0)$ not differentiable, harder to solve**: a function that takes the max of two numbers has points where it cannot be differentiated, and optimizing it directly is not easy.

So, as Lin explains in the lecture, the earlier lectures followed the quadratic programming route and derived everything from hard-margin onward. An addition in this article: the handout puts a question mark in front of kernel trick, and that question mark is not answered until the section "Logistic regression directly in the Z space: the representer theorem", which proves that every L2-regularized linear model can use kernels.

### Where the SVM sits among regularized models

The table on page 5 lines up four models:

| model | minimize | constraint |
|---|---|---|
| regularization by constraint | $E_{\text{in}}$ | $\mathbf{w}^\top\mathbf{w} \le C$ |
| hard-margin SVM | $\mathbf{w}^\top\mathbf{w}$ | $E_{\text{in}} = 0$ [and more] |
| L2 regularization | $\frac{\lambda}{N}\mathbf{w}^\top\mathbf{w} + E_{\text{in}}$ | none |
| soft-margin SVM | $\frac{1}{2}\mathbf{w}^\top\mathbf{w} + CN\widehat{E}_{\text{in}}$ | none |

The first two rows are "one thing as the objective, the other as the constraint", and the two swap the roles: the first row looks for the smallest $E_{\text{in}}$ among the $\mathbf{w}$ of limited length; the hard-margin SVM looks for the shortest $\mathbf{w}$ among those with $E_{\text{in}} = 0$. About the and more in brackets, Lin says in the lecture only that it actually adds more conditions; an addition in this article: hard-margin asks not just for separation but for every point to satisfy $y_n(\mathbf{w}^\top\mathbf{z}_n + b) \ge 1$. The last two rows move the constraint into the objective, giving a sum of two terms. In the fourth row $\widehat{E}_{\text{in}} = \frac{1}{N}\sum_n \widehat{\mathrm{err}}$, and multiplying it by $N$ gives the total error.

The handout reads three statements off this table:

- large margin ⟺ fewer hyperplanes ⟺ L2 regularization of short $\mathbf{w}$. Asking for a fat boundary leaves fewer hyperplanes to choose from, which is the same thing as asking for a short $\mathbf{w}$.
- soft margin ⟺ special $\widehat{\mathrm{err}}$. Allowing violations and penalizing them amounts to choosing a special error.
- larger $C$ or $C$ ⟺ smaller $\lambda$ ⟺ less regularization. There are two $C$'s here, and the slide tells them apart by color: the $C$ in the first row is the upper bound on the length of $\mathbf{w}$, and the $C$ in the fourth row is the penalty on the violations. In the lecture, Lin says that whichever $C$ it is, making it larger corresponds to a smaller $\lambda$.

Why spend a section on this change of view? The handout's answer is that viewing the SVM as a regularized model allows extending and connecting it to other learning models. In the lecture, Lin is more specific: the plan is to extend the SVM to logistic regression and to general regression problems, and seeing these connections clearly first is what shows how the extension should be done.

### Numerical example: six points, two values of C

What follows is an example made up for this article, not from the slides. Six one-dimensional points, with no feature transform ($z_n = x_n$), so $w$ is a single number:

| $n$ | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| $x_n$ | $-2$ | $-1$ | $0$ | $1$ | $2$ | $3$ |
| $y_n$ | $-1$ | $-1$ | $+1$ | $-1$ | $+1$ | $+1$ |

The left side is mostly negative examples and the right side mostly positive, but the labels of points 3 and 4 stand on the wrong side, so no threshold separates the data cleanly. The hard-margin SVM has no solution on this data; only soft-margin can be used.

**First, see that $\xi_n$ is computed.** Take an arbitrary $(b, w) = (-\frac{1}{2}, 1)$, so the score is $s_n = x_n - \frac{1}{2}$. The six values of $y_n s_n$ are, in order, $2.5, 1.5, -0.5, -0.5, 1.5, 2.5$, so $\xi_n = \max(1 - y_n s_n, 0)$ is, in order, $0, 0, 1.5, 1.5, 0, 0$. Nothing has to be solved; the formula gives them. With $C = 1$ the objective value is $\frac{1}{2}(1)^2 + 1 \times 3 = 3.5$.

**Then find the optimal solution.** This data has a symmetry: replace every point $(x, y)$ with $(1 - x, -y)$ and the six points map back onto the same data set (for example, $(-2, -1)$ becomes $(3, +1)$). For any $(b, w)$, replacing it with $(-w - b, w)$ gives the same $y s$ on the mirrored points, so the two have the same objective value. The objective is convex ($\frac{1}{2}w^2$ is convex, and each max is the larger of two linear functions, which is also convex), so averaging two equally good solutions cannot make things worse, and the average is $(-\frac{w}{2}, w)$. It is therefore enough to consider $b = -\frac{w}{2}$, that is, classifiers whose boundary is at $x = \frac{1}{2}$. Then $y_n s_n$ is, in order, $2.5w, 1.5w, -0.5w, -0.5w, 1.5w, 2.5w$, and the problem is left with one variable (when $w < 0$ the four outer points all violate, the six violations sum to more than 6, and the objective value is larger than at $w = 0$, so that case can be ignored):

$$
f(w) = \frac{1}{2}w^2 + 2C\Big[\max(1 - 2.5w,\ 0) + \max(1 - 1.5w,\ 0) + (1 + 0.5w)\Big], \qquad w \ge 0
$$

The two max terms have their kinks at $w = 0.4$ and $w = \frac{2}{3}$, so look at three pieces:

| range of $w$ | $f(w)$ | $f'(w)$ |
|---|---|---|
| $0 \le w \le 0.4$ | $\frac{1}{2}w^2 + 2C(3 - 3.5w)$ | $w - 7C$ |
| $0.4 \le w \le \frac{2}{3}$ | $\frac{1}{2}w^2 + 2C(2 - w)$ | $w - 2C$ |
| $w \ge \frac{2}{3}$ | $\frac{1}{2}w^2 + 2C(1 + 0.5w)$ | $w + C$ |

- **$C = 1$**: the slopes of the first two pieces, $w - 7$ and $w - 2$, are both negative, and the slope of the third piece is positive, so the lowest point is at the kink $w = \frac{2}{3}$, with $b = -\frac{1}{3}$ and $f = \frac{2}{9} + \frac{8}{3} = \frac{26}{9} \approx 2.889$.
- **$C = 0.1$**: the slope of the first piece, $w - 0.7$, is negative, and the slope of the second piece, $w - 0.2$, is positive for $w \ge 0.4$, so the lowest point is at the kink $w = 0.4$, with $b = -0.2$ and $f = 0.08 + 0.32 = 0.4$.

Both optimal solutions land on a kink where the function cannot be differentiated. The derivative does not exist there, so "set the derivative to 0" does not work, and this is what the handout means by harder to solve. Here is the $C = 1$ solution point by point:

| $n$ | $x_n$ | $y_n$ | $s_n = \frac{2}{3}x_n - \frac{1}{3}$ | $y_n s_n$ | $\xi_n$ |
|---|---|---|---|---|---|
| 1 | $-2$ | $-1$ | $-\frac{5}{3}$ | $\frac{5}{3}$ | $0$ |
| 2 | $-1$ | $-1$ | $-1$ | $1$ | $0$ |
| 3 | $0$ | $+1$ | $-\frac{1}{3}$ | $-\frac{1}{3}$ | $\frac{4}{3}$ |
| 4 | $1$ | $-1$ | $\frac{1}{3}$ | $-\frac{1}{3}$ | $\frac{4}{3}$ |
| 5 | $2$ | $+1$ | $1$ | $1$ | $0$ |
| 6 | $3$ | $+1$ | $\frac{5}{3}$ | $\frac{5}{3}$ | $0$ |

Points 2 and 5 sit exactly on the fat boundary, points 3 and 4 violate, and points 1 and 6 are outside the boundary. Putting the objective values of several $(b, w)$ together:

| $(b, w)$ | $\sum_n \xi_n$ | objective value with $C = 1$ | objective value with $C = 0.1$ |
|---|---|---|---|
| $(0, 0)$ | $6$ | $6$ | $0.6$ |
| $(-0.2, 0.4)$ | $3.2$ | $3.28$ | $0.4$ (minimum) |
| $(-\frac{1}{3}, \frac{2}{3})$ | $\frac{8}{3}$ | $2.889$ (minimum) | $0.489$ |
| $(-\frac{1}{2}, 1)$ | $3$ | $3.5$ | $0.8$ |
| $(-1, 2)$ | $4$ | $6$ | $2.4$ |

**What this result means.** $C = 1$ corresponds to $\lambda = \frac{1}{2C} = 0.5$; the solution is $w = \frac{2}{3}$ and the half-width of the fat boundary is $\frac{1}{w} = 1.5$, running from $x = -1$ to $x = 2$. $C = 0.1$ corresponds to $\lambda = 5$, ten times as much regularization; the solution becomes $w = 0.4$, a shorter $w$, with half-width $2.5$, running from $x = -2$ to $x = 3$, and the total violation rises from $\frac{8}{3}$ to $3.2$. A small $C$ is a large $\lambda$: it accepts somewhat more violation to keep $w$ short. This article also solved the original problem with $\xi_n$ and the constraints by numerical optimization (SciPy's SLSQP) and ran a grid search on the unconstrained form over the $(b, w)$ plane; both gave the solutions above.

### Fun Time: what a larger C means

**Question (page 6):** When viewing soft-margin SVM as regularized model, a larger $C$ corresponds to

1. a larger $\lambda$, that is, stronger regularization
2. a smaller $\lambda$, that is, stronger regularization
3. a larger $\lambda$, that is, weaker regularization
4. a smaller $\lambda$, that is, weaker regularization

**Answer: 4.** The handout's solution compares the two formulations on page 4, where $C$ corresponds to $\frac{1}{2\lambda}$; the derivation is the earlier step of multiplying by $\frac{N}{2\lambda}$. $C$ and $\lambda$ are inversely proportional, so a large $C$ means a small $\lambda$; $\lambda$ multiplies $\mathbf{w}^\top\mathbf{w}$, a small $\lambda$ penalizes a long $\mathbf{w}$ lightly, and the regularization is weak. Choices 1 and 3 get the direction between $C$ and $\lambda$ backwards; choice 2 gets the direction right but calls a small $\lambda$ stronger regularization. The example above is an instance: as $C$ rises from $0.1$ to $1$, $\lambda$ falls from $5$ to $0.5$ and $w$ lengthens from $0.4$ to $\frac{2}{3}$.

## How similar the hinge error is to logistic regression's error

```youtube
url: https://www.youtube.com/watch?v=5K44AgZvcDk
title: Kernel Logistic Regression :: SVM versus Logistic Regression @ Machine Learning Techniques (機器學習技法)
```

(In the video, 00:00–03:15 plots the SVM's error, 03:15–06:33 compares it with logistic regression's error, 06:33–08:34 covers the three linear models for classification, 08:34–09:32 raises the question in the opposite direction, and Fun Time follows.)

### The error the SVM uses: hinge

The $\widehat{\mathrm{err}}$ in the unconstrained form depends only on $y$ times the score. Page 7 follows the approach of [Foundations Lecture 11: Linear Models for Classification](/posts/ai/2026-09-30-ntu-htlin-ml-linear-classification-nonlinear-transform-en): let the linear score be $s = \mathbf{w}^\top\mathbf{z}_n + b$, put $ys$ on the horizontal axis and the error on the vertical axis, and plot the errors to compare them:

$$
\mathrm{err}_{0/1}(s, y) = \llbracket ys \le 0 \rrbracket, \qquad \widehat{\mathrm{err}}_{\text{SVM}}(s, y) = \max(1 - ys,\ 0)
$$

In the figure the 0/1 error is a step: 1 when $ys \le 0$ and 0 when $ys > 0$. The SVM's error is two line segments: for $ys < 1$ it is the line $1 - ys$ with slope $-1$, and for $ys \ge 1$ it lies flat at 0. In the lecture, Lin gives two numbers: at $ys = 0.4$ the score is still $0.6$ short of 1, so the violation recorded is $0.6$; at $ys = -10$ it is $11$.

The handout says $\widehat{\mathrm{err}}_{\text{SVM}}$ is an upper bound of $\mathrm{err}_{0/1}$, and two cases confirm it:

- $ys \le 0$: $1 - ys \ge 1$, so the hinge is at least 1, while the 0/1 error is 1.
- $ys > 0$: the result of the max is never negative, so the hinge is at least 0, while the 0/1 error is 0.

This error is often called the hinge error measure. In the lecture, Lin says it looks much like the thing that joins two door panels. The handout also stresses that it is a convex upper bound. This article adds the reason: $1 - ys$ and $0$ are both linear functions of $ys$, and the larger of two linear functions is a convex function. In the lecture, Lin says convexity gives it good properties to use in optimization.

The handout calls $\widehat{\mathrm{err}}_{\text{SVM}}$ an algorithmic error measure, an error the algorithm uses because it is easier to solve. In the lecture, Lin recalls what Foundations did: with an upper bound of the 0/1 error in hand, you can make the upper bound small and so indirectly do well on the 0/1 error. The SVM does the same thing.

### Logistic regression's error is another upper bound

Page 8 adds logistic regression's error to the same figure. The cross-entropy error used in Foundations is $\ln(1 + \exp(-ys))$; the one used here is the version converted to base 2, which the handout calls scaled cross-entropy:

$$
\mathrm{err}_{\text{SCE}}(s, y) = \log_2\big(1 + \exp(-ys)\big)
$$

In the lecture, Lin says only that this is a technical detail and that the change of base needs care. This article fills in the reason: at $ys = 0$, $\ln(1 + e^0) = \ln 2 \approx 0.693$, which is smaller than the 0/1 error's 1, so the natural-log version is not an upper bound near there. After dividing by $\ln 2$, the value at $ys = 0$ is exactly 1. To confirm that it is an upper bound:

- $ys \le 0$: $\exp(-ys) \ge 1$, so $\log_2(1 + \exp(-ys)) \ge \log_2 2 = 1$.
- $ys > 0$: $1 + \exp(-ys) > 1$, so the logarithm is positive, greater than 0.

In the figure it is a smooth curve lying above the step.

### Behavior at the two ends

Below the figure the handout gives a small table comparing the behavior as $ys$ goes to either end:

| | $ys \to -\infty$ | $ys \to +\infty$ |
|---|---|---|
| $\widehat{\mathrm{err}}_{\text{SVM}}(s, y)$ | $\approx -ys$ | $= 0$ |
| $(\ln 2)\cdot\mathrm{err}_{\text{SCE}}(s, y)$ | $\approx -ys$ | $\approx 0$ |

Multiplying the second row by $\ln 2$ changes the base back to the natural log: $(\ln 2)\cdot\mathrm{err}_{\text{SCE}} = \ln(1 + \exp(-ys))$. The reason for each of the four cells:

- hinge, $ys \to +\infty$: it is 0 once $ys \ge 1$, an exact equality.
- hinge, $ys \to -\infty$: the value is $1 - ys$. In the lecture, Lin explains that when $-ys$ is very large, that 1 is negligible.
- cross-entropy, $ys \to +\infty$: $\exp(-ys) \to 0$ and $\ln(1 + 0) = 0$; it approaches 0 without ever reaching it.
- cross-entropy, $ys \to -\infty$: let $t = -ys$, with $t$ very large. $\ln(1 + e^{t}) = \ln\big(e^{t}(1 + e^{-t})\big) = t + \ln(1 + e^{-t})$, and the last term goes to 0, so the whole thing is approximately $t = -ys$. In the lecture, Lin puts it as the log and the exponential almost cancelling each other, because that 1 becomes negligible.

At the end where a point is badly wrong, both errors grow linearly with $-ys$; at the end where a point is confidently right, both are (almost) 0; the difference is concentrated in the middle. The handout therefore concludes:

$$
\text{SVM} \approx \text{L2-regularized logistic regression}
$$

In the lecture, Lin splits this statement into two halves: the SVM's objective has the term for the length of $\mathbf{w}$, so it resembles L2 regularization; and the error it uses is close to logistic regression's.

### Numerical example: three errors side by side

The table below was computed for this article. The last column is the natural-log version, for comparison with the small table above.

| $ys$ | $\mathrm{err}_{0/1}$ | hinge | $\mathrm{err}_{\text{SCE}}$ | $\ln(1 + e^{-ys})$ |
|---|---|---|---|---|
| $-3$ | $1$ | $4$ | $4.398$ | $3.049$ |
| $-1$ | $1$ | $2$ | $1.895$ | $1.313$ |
| $-\frac{1}{3}$ | $1$ | $1.333$ | $1.260$ | $0.874$ |
| $0$ | $1$ | $1$ | $1$ | $0.693$ |
| $0.5$ | $0$ | $0.5$ | $0.684$ | $0.474$ |
| $1$ | $0$ | $0$ | $0.452$ | $0.313$ |
| $\frac{5}{3}$ | $0$ | $0$ | $0.250$ | $0.173$ |
| $3$ | $0$ | $0$ | $0.070$ | $0.049$ |

In every row the hinge and $\mathrm{err}_{\text{SCE}}$ are no smaller than the 0/1 error. The last column is below 1 at $ys = 0$ and $ys = -\frac{1}{3}$, so it is not an upper bound, and the change of base exists to fix that. At $ys = -3$ the last column is $3.049$, already close to $-ys = 3$; at $ys = 3$ it is $0.049$, close to 0. The biggest difference between the two errors comes after $ys \ge 1$: the hinge is exactly 0, while cross-entropy keeps a small positive value. In "The price: the β are usually nonzero" this difference turns into the difference of whether a coefficient is 0.

Applied to the six points and the $C = 1$ SVM solution (where $y_n s_n$ is $\frac{5}{3}, 1, -\frac{1}{3}, -\frac{1}{3}, 1, \frac{5}{3}$): the 0/1 errors sum to 2 (points 3 and 4 are misclassified), the hinge errors sum to $\frac{8}{3} \approx 2.667$, and the $\mathrm{err}_{\text{SCE}}$ values sum to $3.924$. Both upper bounds are larger than 2.

Now check "regularized logistic regression ≈ SVM" directly. Replace the hinge in the unconstrained form with $\ln(1 + \exp(-ys))$, leave everything else alone, and keep $C$ at 1:

$$
\min_{b, w} \ \frac{1}{2}w^2 + \sum_{n=1}^{6}\ln\big(1 + \exp(-y_n(w x_n + b))\big)
$$

This problem is differentiable everywhere. Solved numerically (BFGS) for this article, it gives $w \approx 0.767$ and $b \approx -0.384$, with the boundary at $x = 0.5$. The SVM solution is $w = \frac{2}{3} \approx 0.667$ and $b = -\frac{1}{3}$, with the boundary also at $x = 0.5$. The two have the same direction and boundary location, and the size of $w$ differs by about 15%. On this example the two models do give very close classifiers, but not the same one.

### Three linear models for classification

Page 9 lines up the linear models seen so far that can do binary classification:

| | PLA | soft-margin SVM | regularized logistic regression for classification |
|---|---|---|---|
| approach | minimize $\mathrm{err}_{0/1}$ specially | minimize regularized $\widehat{\mathrm{err}}_{\text{SVM}}$ by QP | minimize regularized $\mathrm{err}_{\text{SCE}}$ by GD, SGD, and so on |
| pros | efficient if linearly separable | "easy" optimization and theoretical guarantee | "easy" optimization and regularization guard |
| cons | works only if linearly separable, otherwise needing pocket | loose bound of $\mathrm{err}_{0/1}$ for very negative $ys$ | loose bound of $\mathrm{err}_{0/1}$ for very negative $ys$ |

In the lecture, Lin goes through it column by column. PLA attacks the 0/1 error directly, but that is only manageable when the data is linearly separable. Logistic regression's function is smooth, so optimization is relatively easy, and adding L2 regularization gives some protection on model complexity. The SVM's theoretical guarantee comes from its derivation from the fat boundary. The shared weakness of the last two is that what they optimize is only an upper bound of the 0/1 error. "Loose" can be read off the earlier table: a point with $ys = -3$ counts as just 1 under the 0/1 error and as 4 under the hinge, so one badly wrong point is penalized heavily.

The bottom of the page has two lines. The first is regularized LogReg ⟹ approximate SVM: solving regularized logistic regression nearly solves the SVM. The second goes the other way, with a question mark after it: SVM ⟹ approximate LogReg (?). In the lecture, Lin says this is where expectations get overturned: what logistic regression originally wants is a probability, not circle or cross. Can what you get from solving an SVM also serve as some measure of the probability that each point is a circle? The section "Making the SVM output probabilities" answers that.

### Fun Time: when the upper bound is tight

**Question (page 10):** We know that $\widehat{\mathrm{err}}_{\text{SVM}}(s, y)$ is an upper bound of $\mathrm{err}_{0/1}(s, y)$. When is the upper bound tight? That is, when is $\widehat{\mathrm{err}}_{\text{SVM}}(s, y) = \mathrm{err}_{0/1}(s, y)$?

1. $ys \ge 0$
2. $ys \le 0$
3. $ys \ge 1$
4. $ys \le 1$

**Answer: 3.** The handout's solution says that plotting the figure shows it: the two are equal if and only if $ys \ge 1$, in which case both evaluate to 0; in the lecture, Lin describes that stretch as the two lines lying on top of each other. Checking piece by piece:

- $ys \ge 1$: the 0/1 error is 0 and the hinge is $\max(1 - ys, 0) = 0$; they are equal.
- $0 < ys < 1$: the 0/1 error is 0 and the hinge is $1 - ys > 0$; they are not equal. Choices 1 and 4 both include this stretch, so they are wrong.
- $ys < 0$: the 0/1 error is 1 and the hinge is $1 - ys > 1$; they are not equal. Choices 2 and 4 both include this stretch, so they are wrong.

This article adds one small point: under page 7's definition $\mathrm{err}_{0/1} = \llbracket ys \le 0 \rrbracket$, when $ys$ is exactly 0 the 0/1 error is 1 and the hinge is $\max(1 - 0, 0) = 1$, so apart from the stretch $ys \ge 1$ the two are also equal at the isolated point $ys = 0$ (in the figure on page 7, the hinge's sloped line passes exactly through the corner of the step at $ys = 0$, height 1). This does not change the answer to the multiple-choice question: of the four choices, only choice 3 describes a range on which the two are equal everywhere.

## Making the SVM output probabilities: run the SVM first, then learn two numbers

```youtube
url: https://www.youtube.com/watch?v=pNfvZYH5iFg
title: Kernel Logistic Regression :: SVM for Soft Binary @ Machine Learning Techniques (機器學習技法)
```

(In the video, 00:00–02:30 covers two naive ideas, 02:30–06:15 the two-level learning model, 06:15–08:14 Platt's three steps, 08:14–08:59 explains that this is only an approximate solution, and Fun Time follows.)

### Two naive ideas, each missing one side

Soft binary classification wants a probability value between 0 and 1. Page 11 first lists two simple ideas.

**Naïve Idea 1.** Run SVM and get $(b_{\text{SVM}}, \mathbf{w}_{\text{SVM}})$, apply the logistic function $\theta(s) = \frac{1}{1 + e^{-s}}$ from Foundations Lecture 10 directly, and return

$$
g(\mathbf{x}) = \theta\big(\mathbf{w}_{\text{SVM}}^\top\mathbf{x} + b_{\text{SVM}}\big)
$$

The handout's comment is that this makes direct use of the similarity between the two models and works reasonably well, but has no LogReg flavor. In the lecture, Lin says this approach usually performs decently in practice; its weakness is that almost none of the maximum likelihood that logistic regression was derived from gets used.

**Naïve Idea 2.** Run SVM, use $(b_{\text{SVM}}, \mathbf{w}_{\text{SVM}})$ as the starting point $\mathbf{w}_0$ of logistic regression, run logistic regression, and return the logistic regression solution. The handout's comment is that this is not really "easier" than the original logistic regression, and SVM flavor (kernel?) lost. In the lecture, Lin explains that logistic regression is a convex problem and usually has a unique solution, so wherever you start you end up at about the same solution; that is the same as not using the SVM at all and running logistic regression directly, and this approach also has no way to tap the non-linear power of kernel SVM.

The handout's conclusion: want flavors from both sides.

### Two-level learning: the SVM sets the direction, logistic regression sets the scale

The model proposed on page 12 is

$$
g(\mathbf{x}) = \theta\Big(A\cdot\big(\mathbf{w}_{\text{SVM}}^\top\boldsymbol{\Phi}(\mathbf{x}) + b_{\text{SVM}}\big) + B\Big)
$$

Inside the parentheses is the score the SVM computes. In the lecture, Lin explains that two more degrees of freedom are given on top of this score: $A$ is scaling and $B$ is shifting.

- **SVM flavor**: the direction of the hyperplane is fixed by $\mathbf{w}_{\text{SVM}}$, so the kernel applies as before. In the lecture, Lin explains it geometrically: the SVM finds the normal vector of the separating line, and the normal vector does not move. Duality, kernels, and the rest of the SVM's tools can all be used, because the first step is the SVM exactly as it was.
- **LogReg flavor**: fine-tune with $A$ and $B$ so that the result matches maximum likelihood.

The handout attaches two expectations: often $A > 0$ if $\mathbf{w}_{\text{SVM}}$ is reasonably good, and often $B \approx 0$ if $b_{\text{SVM}}$ is reasonably good. In the lecture, Lin explains that $A$ below 0 would mean the direction is reversed, which would mean the SVM had been doing nonsense from the start; and $B$ will be very close to 0 but not necessarily exactly 0, because there is a degree of freedom to adjust.

How are $A$ and $B$ learned? Apply the cross-entropy error from Foundations Lecture 10, with $\mathbf{w}_{\text{SVM}}$ and $b_{\text{SVM}}$ already fixed numbers:

$$
\min_{A, B} \ \frac{1}{N}\sum_{n=1}^{N}\log\bigg(1 + \exp\Big(-y_n\big(A\cdot\underbrace{(\mathbf{w}_{\text{SVM}}^\top\boldsymbol{\Phi}(\mathbf{x}_n) + b_{\text{SVM}})}_{\Phi_{\text{SVM}}(\mathbf{x}_n)} + B\big)\Big)\bigg)
$$

Under the score the handout writes $\Phi_{\text{SVM}}(\mathbf{x}_n)$. In the lecture, Lin steps back to a higher view: this score can be treated as a special transform that the SVM hands you, turning a multi-dimensional $\mathbf{x}$ into a single number. The second stage only solves a logistic regression with one-dimensional data and two variables. The handout calls the whole thing two-level learning: LogReg on SVM-transformed data.

### Platt's probabilistic SVM

Page 13 writes it as three steps under the heading Platt's Model of Probabilistic SVM for Soft Binary Classification. In the lecture, Lin says the method was proposed by a person named John Platt, so it is generally called Platt's model, and it is very widely used in the SVM field.

1. Run SVM on $\mathcal{D}$ to get $(b_{\text{SVM}}, \mathbf{w}_{\text{SVM}})$ or the equivalent $\boldsymbol{\alpha}$, and transform every point to $z'_n = \mathbf{w}_{\text{SVM}}^\top\boldsymbol{\Phi}(\mathbf{x}_n) + b_{\text{SVM}}$.
2. Run logistic regression on $\{(z'_n, y_n)\}_{n=1}^{N}$ to get $(A, B)$.
3. Return $g(\mathbf{x}) = \theta\big(A\cdot(\mathbf{w}_{\text{SVM}}^\top\boldsymbol{\Phi}(\mathbf{x}) + b_{\text{SVM}}) + B\big)$.

The handout adds a line of gray text to each of the first two steps: the actual model performs step 1 in a more complicated manner; the actual model adds some special regularization in step 2. In the lecture, Lin does not go into the details, saying only that a little regularization is added to make the problem less prone to overfitting, and mentioning that packages such as LIBSVM include this method.

This page has two more key points:

- **The probabilistic SVM's boundary is not necessarily the same as the original SVM's, because of $B$.** $g(\mathbf{x}) = \frac{1}{2}$ happens where $A\cdot(\text{score}) + B = 0$, that is, where the score equals $-\frac{B}{A}$; the SVM's boundary is where the score equals 0. When $B \ne 0$ the two come apart. In the lecture, Lin says that after the shift it is not necessarily the same as the SVM, but it may match what maximum likelihood asks for better.
- **How to solve step 2: GD, SGD, or better, because there are only two variables.** In the lecture, Lin says even simpler methods can be used.

The bottom of the page states where this section stands and the question to answer next: kernel SVM ⟹ approx. LogReg in $\mathcal{Z}$-space; exact LogReg in $\mathcal{Z}$-space? In the lecture, Lin is clear about it: doing this does not really solve logistic regression in the Z space. It only finds a fairly good solution by relying on the SVM plus the fine-tuning of $A$ and $B$, and that is not the best logistic regression solution in the Z space.

### Numerical example: fitting A and B to the SVM scores of the six points

What follows is an example made up for this article. It reuses the earlier $C = 1$ SVM solution, $w_{\text{SVM}} = \frac{2}{3}$ and $b_{\text{SVM}} = -\frac{1}{3}$.

**Step one: transform.** $z'_n = \frac{2}{3}x_n - \frac{1}{3}$; the six values are $-\frac{5}{3}, -1, -\frac{1}{3}, \frac{1}{3}, 1, \frac{5}{3}$, and the labels are still $-1, -1, +1, -1, +1, +1$.

**Step two: logistic regression with two variables.** The quantity to minimize is $E(A, B) = \frac{1}{6}\sum_n \ln(1 + \exp(-y_n(A z'_n + B)))$. Differentiating $\ln(1 + e^{-yu})$ with respect to $u$ gives $-y\,\theta(-yu)$, and the chain rule then gives:

$$
\frac{\partial E}{\partial A} = \frac{1}{N}\sum_{n=1}^{N}\theta\big(-y_n(A z'_n + B)\big)\,(-y_n z'_n), \qquad \frac{\partial E}{\partial B} = \frac{1}{N}\sum_{n=1}^{N}\theta\big(-y_n(A z'_n + B)\big)\,(-y_n)
$$

This is the same expression as the gradient in Foundations Lecture 10, only with the "features" replaced by $(z'_n, 1)$. Start gradient descent from the position of Naïve Idea 1, $(A, B) = (1, 0)$. In the first step the six values of $\theta(-y_n z'_n)$ are $0.159, 0.269, 0.583, 0.583, 0.269, 0.159$ and the corresponding $-y_n z'_n$ are $-\frac{5}{3}, -1, \frac{1}{3}, \frac{1}{3}, -1, -\frac{5}{3}$, so

$$
\frac{\partial E}{\partial A} = \frac{1}{6}\cdot 2\big(0.159\cdot(-\tfrac{5}{3}) + 0.269\cdot(-1) + 0.583\cdot\tfrac{1}{3}\big) \approx -0.113
$$

and the six terms in $\frac{\partial E}{\partial B}$ cancel in pairs (points 1 and 6 have the same $\theta$ and opposite signs of $-y_n$, and so do the other two pairs), giving 0. With learning rate 1, $A$ moves from $1$ to $1.113$ and $B$ stays at 0. After 116 such steps in total, both partial derivatives are below $10^{-6}$ in absolute value, and the descent stops at

$$
A \approx 1.821, \qquad B = 0
$$

$B$ is exactly 0 because this data set is symmetric; in general it will not come out so neatly. $A > 0$ and $B \approx 0$ agree with what the handout expects.

**Step three: output probabilities.**

| $x_n$ | $y_n$ | SVM score $z'_n$ | Naïve Idea 1: $\theta(z'_n)$ | probabilistic SVM: $\theta(1.821\,z'_n)$ |
|---|---|---|---|---|
| $-2$ | $-1$ | $-1.667$ | $0.159$ | $0.046$ |
| $-1$ | $-1$ | $-1$ | $0.269$ | $0.139$ |
| $0$ | $+1$ | $-0.333$ | $0.417$ | $0.353$ |
| $1$ | $-1$ | $0.333$ | $0.583$ | $0.647$ |
| $2$ | $+1$ | $1$ | $0.731$ | $0.861$ |
| $3$ | $+1$ | $1.667$ | $0.841$ | $0.954$ |

**What this result means.** The two approaches give the same ordering and the same boundary; they differ in scale. For the leftmost point, Naïve Idea 1 only dares to say "the probability of being positive is 0.159", while the probabilistic SVM says 0.046. The average cross-entropy error drops from $0.453$ ($A = 1$) to $0.413$ ($A = 1.821$), and the latter matches maximum likelihood better. This article's reading: the scale of the SVM score is set by "points on the fat boundary score exactly ±1", a scale that has nothing to do with probability, so $A$ is needed to rescale it.

The data in this example is one-dimensional, so $A z'_n + B$ already covers every linear function of $x$, and the second stage is in fact the same as running unregularized logistic regression directly on $x$. When the data is multi-dimensional, the direction of $\mathbf{w}_{\text{SVM}}$ stays fixed and only two numbers can be adjusted; that is when two-level learning and full logistic regression differ.

**A case where $B$ is not 0.** Add a seventh point $(x, y) = (4, +1)$. Its $y s = \frac{2}{3}\cdot 4 - \frac{1}{3} = \frac{7}{3} \ge 1$, so its hinge error is 0. The new objective equals the old one plus this point's hinge; it is nowhere smaller than the old one, and at the old optimal solution the two are equal, so the SVM solution does not change at all and the boundary stays at $x = 0.5$. The logistic regression step does change: solving again on seven points gives $A \approx 1.876$ and $B \approx 0.016$. The position of probability $\frac{1}{2}$ moves to the score $-\frac{B}{A} \approx -0.0085$, which in terms of $x$ is $0.487$, slightly off the SVM boundary $0.5$. $B$ is very close to 0 but not 0, which is what the handout means when it says the two boundaries are not necessarily the same. It also shows the difference between the two errors: a point outside the boundary has no effect at all on the hinge, and still a small effect on cross-entropy.

### Fun Time: plugging in the kernel score

**Question (page 14):** Recall that the score $\mathbf{w}_{\text{SVM}}^\top\boldsymbol{\Phi}(\mathbf{x}) + b_{\text{SVM}} = \sum_{\text{SV}}\alpha_n y_n K(\mathbf{x}_n, \mathbf{x}) + b_{\text{SVM}}$ for the kernel SVM. When coupling the kernel SVM with $(A, B)$ to form a probabilistic SVM, which of the following is the resulting $g(\mathbf{x})$?

1. $\theta\big(\sum_{\text{SV}} B\alpha_n y_n K(\mathbf{x}_n, \mathbf{x}) + b_{\text{SVM}}\big)$
2. $\theta\big(\sum_{\text{SV}} B\alpha_n y_n K(\mathbf{x}_n, \mathbf{x}) + Bb_{\text{SVM}} + A\big)$
3. $\theta\big(\sum_{\text{SV}} A\alpha_n y_n K(\mathbf{x}_n, \mathbf{x}) + b_{\text{SVM}}\big)$
4. $\theta\big(\sum_{\text{SV}} A\alpha_n y_n K(\mathbf{x}_n, \mathbf{x}) + Ab_{\text{SVM}} + B\big)$

**Answer: 4.** The handout says only to plug the kernel formula of the score into $g(\mathbf{x})$. Substituting and multiplying $A$ through:

$$
A\cdot\Big(\sum_{\text{SV}}\alpha_n y_n K(\mathbf{x}_n, \mathbf{x}) + b_{\text{SVM}}\Big) + B = \sum_{\text{SV}} A\alpha_n y_n K(\mathbf{x}_n, \mathbf{x}) + Ab_{\text{SVM}} + B
$$

$A$ multiplies the whole score, including $b_{\text{SVM}}$; $B$ is added on the outside. Choice 3 forgets to multiply $b_{\text{SVM}}$ by $A$ and has no $B$. Choice 2 swaps the roles of $A$ and $B$. Choice 1 makes both mistakes. This question also shows that prediction does not need $\mathbf{w}_{\text{SVM}}$ itself: it needs only the support vectors' $\alpha_n$, the kernel, and the three numbers $A$, $B$, and $b_{\text{SVM}}$.

## Logistic regression directly in the Z space: the representer theorem

```youtube
url: https://www.youtube.com/watch?v=AbaIkcQUQuo
title: Kernel Logistic Regression :: Kernel Logistic Regression @ Machine Learning Techniques (機器學習技法)
```

(In the video, 00:00–03:05 finds the key behind the kernel trick, 03:05–08:23 covers the representer theorem and its proof, 08:23–10:57 derives kernel logistic regression, 10:57–13:49 gives another view, 13:49–14:27 discusses the coefficients not being sparse, and Fun Time and the summary follow.)

### What the kernel trick relies on

The probabilistic SVM is only an approximation. In the lecture, Lin picks up the question left at the end of the probabilistic SVM: the goal now is to really do logistic regression in the Z space, not an approximate solution. The trouble is that the SVM's kernel came from the dual of a QP, while logistic regression's expression has a log and an exponential in it and is not a quadratic program at all, so that road is closed.

So we have to go back and ask why the kernel trick works. Lin's analysis in the lecture: the kernel trick replaces the inner product in the Z space with a function that is easy to compute in the X space; inner products are computed during training, and prediction also needs the inner product of $\mathbf{w}$ and $\mathbf{z}$. Only if $\mathbf{w}$ can be written as a linear combination of the $\mathbf{z}_n$ already seen can the inner product at prediction time be replaced by a kernel. Page 15 writes this as one line:

$$
\mathbf{w}_* = \sum_{n=1}^{N}\beta_n\mathbf{z}_n \quad\Longrightarrow\quad \mathbf{w}_*^\top\mathbf{z} = \sum_{n=1}^{N}\beta_n\mathbf{z}_n^\top\mathbf{z} = \sum_{n=1}^{N}\beta_n K(\mathbf{x}_n, \mathbf{x})
$$

The handout then lists three examples already seen, in all of which $\mathbf{w}$ is written as $\sum_{n}(\alpha_n y_n)\mathbf{z}_n$:

| model | where $\alpha_n$ comes from |
|---|---|
| SVM | the dual solutions |
| PLA | the number of times example $n$ was used for a mistake correction |
| logistic regression by SGD | the total SGD moves accumulated on example $n$ |

The third can be verified directly (the verification below is an addition in this article). SGD for logistic regression picks one example at a time, and the update is $\mathbf{w} \leftarrow \mathbf{w} + \eta\,\theta(-y_n\mathbf{w}^\top\mathbf{z}_n)\,(y_n\mathbf{z}_n)$. Starting from $\mathbf{w} = \mathbf{0}$, every step adds some positive number times $y_n\mathbf{z}_n$, so no matter how many steps are taken, $\mathbf{w}$ is a linear combination of the $y_n\mathbf{z}_n$, and the coefficient of example $n$ is the sum of that $\eta\,\theta(\cdot)$ over the times it was picked. [Techniques Lecture 2: Dual SVM](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-02-dual-svm-en) already called this phenomenon $\mathbf{w}$ being represented by data.

All three examples hold, but each for its own reason, and the last two are about the $\mathbf{w}$ an algorithm happens to produce. The handout asks the more general question: when can the optimal $\mathbf{w}_*$ always be represented by the $\mathbf{z}_n$?

### The representer theorem and its proof

The claim on page 16: for any L2-regularized linear model

$$
\min_{\mathbf{w}} \ \frac{\lambda}{N}\mathbf{w}^\top\mathbf{w} + \frac{1}{N}\sum_{n=1}^{N}\mathrm{err}(y_n, \mathbf{w}^\top\mathbf{z}_n)
$$

the optimal solution satisfies $\mathbf{w}_* = \sum_{n=1}^{N}\beta_n\mathbf{z}_n$. What "linear model" means here, Lin says in the lecture, is that the error is computed only through the score $\mathbf{w}^\top\mathbf{z}_n$; err can be whatever function you like. In the lecture, Lin says the result is all-encompassing: the ridge regression and the L2-regularized logistic regression covered in Foundations are both inside it.

The proof is by contradiction. The handout has only four lines, and every step is filled in below.

**Step one: split the optimal solution into two parts.** Let $\mathbf{w}_* = \mathbf{w}_{\parallel} + \mathbf{w}_{\perp}$, where $\mathbf{w}_{\parallel} \in \text{span}(\mathbf{z}_n)$ is some linear combination of $\mathbf{z}_1, \dots, \mathbf{z}_N$, and $\mathbf{w}_{\perp} \perp \text{span}(\mathbf{z}_n)$ is perpendicular to every $\mathbf{z}_n$. This is the decomposition from linear algebra that projects a vector onto a subspace, and every vector can be split this way. In the lecture, Lin likens $\mathbf{w}_{\perp}$ to a remainder: what is left after removing the part the $\mathbf{z}_n$ can span. What we want to prove is $\mathbf{w}_{\perp} = \mathbf{0}$.

**Step two: suppose $\mathbf{w}_{\perp} \ne \mathbf{0}$ and compare $\mathbf{w}_{\parallel}$ with $\mathbf{w}_*$.**

On the error term the two are the same. For every $n$,

$$
\mathbf{w}_*^\top\mathbf{z}_n = (\mathbf{w}_{\parallel} + \mathbf{w}_{\perp})^\top\mathbf{z}_n = \mathbf{w}_{\parallel}^\top\mathbf{z}_n + \underbrace{\mathbf{w}_{\perp}^\top\mathbf{z}_n}_{=\,0} = \mathbf{w}_{\parallel}^\top\mathbf{z}_n
$$

$\mathbf{w}_{\perp}$ is perpendicular to every $\mathbf{z}_n$, so the inner product is 0. The scores are the same, so $\mathrm{err}(y_n, \cdot)$ is the same, and so is the sum of the $N$ terms.

On the regularization term, $\mathbf{w}_{\parallel}$ is smaller:

$$
\mathbf{w}_*^\top\mathbf{w}_* = \mathbf{w}_{\parallel}^\top\mathbf{w}_{\parallel} + 2\,\mathbf{w}_{\parallel}^\top\mathbf{w}_{\perp} + \mathbf{w}_{\perp}^\top\mathbf{w}_{\perp} > \mathbf{w}_{\parallel}^\top\mathbf{w}_{\parallel}
$$

The cross term is 0, because $\mathbf{w}_{\parallel}$ is a linear combination of the $\mathbf{z}_n$ and $\mathbf{w}_{\perp}$ is perpendicular to every $\mathbf{z}_n$. $\mathbf{w}_{\perp}^\top\mathbf{w}_{\perp}$ is the squared length of $\mathbf{w}_{\perp}$, which is strictly greater than 0 when $\mathbf{w}_{\perp} \ne \mathbf{0}$.

**Step three: contradiction.** $\mathbf{w}_{\parallel}$ has the same error term as $\mathbf{w}_*$ and a strictly smaller regularization term, so its whole objective value is lower than that of $\mathbf{w}_*$. But $\mathbf{w}_*$ is the optimal solution. On the slide $\mathbf{w}_*$ is black and $\mathbf{w}_{\parallel}$ is red, and in the lecture Lin says the red one beats the black one, like someone scoring higher than the top-ranked student when there is no rank 0. So the assumption fails, $\mathbf{w}_{\perp} = \mathbf{0}$, and $\mathbf{w}_* = \mathbf{w}_{\parallel}$ is a linear combination of the $\mathbf{z}_n$.

In the lecture, Lin says this proof goes around in circles a little and that the conclusion is what matters. The handout writes the conclusion at the bottom of the page in these words, any L2-regularized linear model can be kernelized!

This article adds three points, all read off the proof:

- The proof needs $\lambda > 0$. With $\lambda = 0$ the regularization term is gone, and the argument above only shows that $\mathbf{w}_{\parallel}$ is as good as $\mathbf{w}_*$, which yields no contradiction.
- The proof uses only two things: the error looks only at $\mathbf{w}^\top\mathbf{z}_n$, and the regularization term is $\mathbf{w}^\top\mathbf{w}$. The second is used in "the squared length splits into the sum of the squares of two perpendicular components", a property only L2 has.
- The score on this page of the handout has no $b$. If a separate, unregularized $b$ is added, the score is $\mathbf{w}^\top\mathbf{z}_n + b$, replacing $\mathbf{w}_*$ with $\mathbf{w}_{\parallel}$ still leaves the score unchanged, and the same proof goes through.

**A small example (made up for this article).** The Z space is two-dimensional, with only two examples $\mathbf{z}_1 = (1, 1)$ and $\mathbf{z}_2 = (3, 3)$, which span only the direction $(1, 1)$. Take $\mathbf{w} = (2, 0)$ and split it into $\mathbf{w}_{\parallel} = (1, 1)$ and $\mathbf{w}_{\perp} = (1, -1)$. Scores: $\mathbf{w}^\top\mathbf{z}_1 = 2$ and $\mathbf{w}^\top\mathbf{z}_2 = 6$; $\mathbf{w}_{\parallel}^\top\mathbf{z}_1 = 2$ and $\mathbf{w}_{\parallel}^\top\mathbf{z}_2 = 6$, exactly the same, so whichever err is used, the two have the same error. Squared lengths: $\mathbf{w}^\top\mathbf{w} = 4$ and $\mathbf{w}_{\parallel}^\top\mathbf{w}_{\parallel} = 2$, and the missing 2 is exactly $\mathbf{w}_{\perp}^\top\mathbf{w}_{\perp}$. $(2, 0)$ cannot be the optimal solution, because $(1, 1)$ is always better.

### Applying it to logistic regression: replacing w with β

Page 17 applies the theorem to L2-regularized logistic regression:

$$
\min_{\mathbf{w}} \ \frac{\lambda}{N}\mathbf{w}^\top\mathbf{w} + \frac{1}{N}\sum_{n=1}^{N}\log\Big(1 + \exp\big(-y_n\mathbf{w}^\top\mathbf{z}_n\big)\Big)
$$

The optimal solution must be $\mathbf{w}_* = \sum_n \beta_n\mathbf{z}_n$, so the handout says that without loss of generality we can solve for the optimal $\boldsymbol{\beta}$ instead. In the lecture, Lin explains that since the solution must have this form, there is no need to find that long $\mathbf{w}$; concentrate on finding the coefficients of the linear combination. The substitution happens in two places (the inner sum uses $m$ to keep it apart from the outer $n$):

$$
\mathbf{w}^\top\mathbf{w} = \Big(\sum_{n=1}^{N}\beta_n\mathbf{z}_n\Big)^\top\Big(\sum_{m=1}^{N}\beta_m\mathbf{z}_m\Big) = \sum_{n=1}^{N}\sum_{m=1}^{N}\beta_n\beta_m\,\mathbf{z}_n^\top\mathbf{z}_m = \sum_{n=1}^{N}\sum_{m=1}^{N}\beta_n\beta_m K(\mathbf{x}_n, \mathbf{x}_m)
$$

$$
\mathbf{w}^\top\mathbf{z}_n = \Big(\sum_{m=1}^{N}\beta_m\mathbf{z}_m\Big)^\top\mathbf{z}_n = \sum_{m=1}^{N}\beta_m\,\mathbf{z}_m^\top\mathbf{z}_n = \sum_{m=1}^{N}\beta_m K(\mathbf{x}_m, \mathbf{x}_n)
$$

Replacing the inner product with the kernel in both places gives kernel logistic regression (KLR):

$$
\min_{\boldsymbol{\beta}} \ \frac{\lambda}{N}\sum_{n=1}^{N}\sum_{m=1}^{N}\beta_n\beta_m K(\mathbf{x}_n, \mathbf{x}_m) + \frac{1}{N}\sum_{n=1}^{N}\log\bigg(1 + \exp\Big(-y_n\sum_{m=1}^{N}\beta_m K(\mathbf{x}_m, \mathbf{x}_n)\Big)\bigg)
$$

The variables are the $N$ coefficients $\beta_n$. In the lecture, Lin stresses that this number equals the amount of data and no longer has anything to do with the dimension of the Z space. How is it solved? The handout writes GD/SGD/... for unconstrained optimization: it has no constraints at all, so the methods learned in Foundations all work. In the lecture, Lin contrasts two ways of obtaining coefficients: the SVM's $\boldsymbol{\alpha}$ is solved through a special dual problem, while KLR's $\boldsymbol{\beta}$ is optimized directly after the substitution. Prediction uses the line from page 15:

$$
g(\mathbf{x}) = \theta\Big(\sum_{n=1}^{N}\beta_n K(\mathbf{x}_n, \mathbf{x})\Big)
$$

This article fills in the gradient that gradient descent needs. Write the kernel matrix as $\mathrm{K}$ ($\mathrm{K}_{nm} = K(\mathbf{x}_n, \mathbf{x}_m)$, symmetric), so the score of point $n$ is $s_n = \sum_m \beta_m \mathrm{K}_{mn}$. The partial derivative with respect to $\beta_k$:

$$
\frac{\partial}{\partial\beta_k} = \frac{2\lambda}{N}\sum_{m=1}^{N}\mathrm{K}_{km}\beta_m - \frac{1}{N}\sum_{n=1}^{N}\mathrm{K}_{kn}\,y_n\,\theta(-y_n s_n) = \frac{1}{N}\sum_{n=1}^{N}\mathrm{K}_{kn}\Big(2\lambda\beta_n - y_n\,\theta(-y_n s_n)\Big)
$$

The first term comes from the derivative $2\mathrm{K}\boldsymbol{\beta}$ of the quadratic form $\boldsymbol{\beta}^\top\mathrm{K}\boldsymbol{\beta}$; the second is the same derivative as in "Numerical example: fitting A and B to the SVM scores of the six points", multiplied by one more factor $\frac{\partial s_n}{\partial\beta_k} = \mathrm{K}_{kn}$.

### Another view: a linear model of β

Page 18 reads the same expression from another angle. Lin's lead-in in the lecture: suppose nobody had told you about the long detour through the Z space and you just looked at this expression. What would you see?

- $\sum_{m}\beta_m K(\mathbf{x}_m, \mathbf{x}_n)$ is the inner product between $\boldsymbol{\beta}$ and a vector, namely $\big(K(\mathbf{x}_1, \mathbf{x}_n), K(\mathbf{x}_2, \mathbf{x}_n), \dots, K(\mathbf{x}_N, \mathbf{x}_n)\big)$. In other words, the kernel is doing a transform: it replaces $\mathbf{x}_n$ with its similarities to each of the $N$ training points (in the lecture, Lin reminds us that a kernel is a kind of similarity). $\boldsymbol{\beta}$ plays the role of the weights $\mathbf{w}$ in this $N$-dimensional space.
- $\sum_n\sum_m \beta_n\beta_m K(\mathbf{x}_n, \mathbf{x}_m) = \boldsymbol{\beta}^\top\mathrm{K}\boldsymbol{\beta}$ is a special regularizer. In the lecture, Lin says the regularizer we are used to is the inner product of $\boldsymbol{\beta}$ with itself, and now there is an extra $\mathrm{K}$ in the middle.

So KLR can be read in two ways, which the handout puts side by side:

| | a linear model of | transform | regularizer |
|---|---|---|---|
| reading 1 | $\boldsymbol{\beta}$ | the kernel itself as the transform | kernel regularizer $\boldsymbol{\beta}^\top\mathrm{K}\boldsymbol{\beta}$ |
| reading 2 | $\mathbf{w}$ | the embedded-in-kernel transform $\boldsymbol{\Phi}$ | L2 regularizer $\mathbf{w}^\top\mathbf{w}$ |

The handout adds the line similar for SVM. In the lecture, Lin takes the SVM with a Gaussian kernel as the example: its result is a linear combination of a bunch of Gaussians, which can be seen as a linear model on those Gaussian transforms, or as a linear model in an infinite-dimensional Z space.

### The price: the β are usually nonzero

The page ends with a warning box: unlike coefficients $\alpha_n$ in SVM, coefficients $\beta_n$ in KLR often non-zero! In the lecture, Lin explains that for the SVM, the $\alpha_n$ of the points outside the fat boundary are all 0 and only the support vectors are nonzero, while most of the $\beta_n$ that KLR produces are nonzero. On whether the solution has many zeros (sparsity), the two are very different. In the summary Lin calls it a price: with many nonzero $\beta_n$, more has to be paid in computation. This article adds where that price lands: predicting a new point requires one kernel evaluation for every training point with $\beta_n \ne 0$.

The handout does not say why, so this article offers an explanation using the gradient above. The gradient is 0 at the optimal solution. When $\mathrm{K}$ is invertible (for example, a Gaussian kernel on pairwise distinct data points), a zero gradient forces every term in the parentheses to be 0:

$$
\beta_n = \frac{1}{2\lambda}\,y_n\,\theta(-y_n s_n)
$$

The value of $\theta$ is always between 0 and 1 and is never exactly 0, so every $\beta_n$ is nonzero. For a point with a very large $y_n s_n$ (a point classified very correctly), $\theta(-y_n s_n)$ is very small and $\beta_n$ is close to 0 but not 0. This is exactly the difference seen in the table of "Numerical example: three errors side by side": cross-entropy is still positive and still has a slope after $ys \ge 1$, so every point keeps contributing; the hinge is flat after $ys > 1$, those points have no effect on the solution, and their $\alpha_n$ is 0.

### Numerical example: kernel logistic regression on six points

What follows is an example made up for this article. The same six points, with the Gaussian kernel from Techniques Lecture 3 and $\gamma = 1$: $K(x, x') = \exp(-(x - x')^2)$. $\lambda = 0.5$, corresponding to the earlier $C = 1$.

**The kernel matrix.** Points at distance 1 give $e^{-1} \approx 0.368$, at distance 2 give $e^{-4} \approx 0.018$, at distance 3 give $e^{-9} \approx 0.0001$, and anything farther rounds to 0:

$$
\mathrm{K} \approx \begin{bmatrix} 1 & 0.368 & 0.018 & 0.000 & 0.000 & 0.000 \\ 0.368 & 1 & 0.368 & 0.018 & 0.000 & 0.000 \\ 0.018 & 0.368 & 1 & 0.368 & 0.018 & 0.000 \\ 0.000 & 0.018 & 0.368 & 1 & 0.368 & 0.018 \\ 0.000 & 0.000 & 0.018 & 0.368 & 1 & 0.368 \\ 0.000 & 0.000 & 0.000 & 0.018 & 0.368 & 1 \end{bmatrix}
$$

**Solving for $\boldsymbol{\beta}$.** Start from $\boldsymbol{\beta} = \mathbf{0}$ and run gradient descent with the gradient above (solving once more with BFGS gives the same result):

| $n$ | $x_n$ | $y_n$ | $\beta_n$ | score $s_n = \sum_m \beta_m \mathrm{K}_{mn}$ | $g(x_n) = \theta(s_n)$ |
|---|---|---|---|---|---|
| 1 | $-2$ | $-1$ | $-0.374$ | $-0.515$ | $0.374$ |
| 2 | $-1$ | $-1$ | $-0.406$ | $-0.381$ | $0.406$ |
| 3 | $0$ | $+1$ | $0.464$ | $0.145$ | $0.536$ |
| 4 | $1$ | $-1$ | $-0.464$ | $-0.145$ | $0.464$ |
| 5 | $2$ | $+1$ | $0.406$ | $0.381$ | $0.594$ |
| 6 | $3$ | $+1$ | $0.374$ | $0.515$ | $0.626$ |

Checking one of the scores: $s_1 = 1\cdot(-0.374) + 0.368\cdot(-0.406) + 0.018\cdot 0.464 + \dots \approx -0.374 - 0.149 + 0.008 = -0.515$. Checking $\beta_n = \frac{1}{2\lambda}y_n\theta(-y_n s_n)$ as well: with $\lambda = 0.5$ the factor is 1, $\beta_1 = -\theta(-0.515) = -0.374$, and $\beta_3 = +\theta(-0.145) = 0.464$; both match.

**What this result means.**

- None of the six $\beta_n$ is 0; even points 1 and 6, farthest from the boundary, have $\pm 0.374$. For the linear SVM with the same $C = 1$, the dual solution is $\boldsymbol{\alpha} = (0, \frac{5}{9}, 1, 1, \frac{5}{9}, 0)$: points 3 and 4, which violate the boundary, hit the upper bound $C$; points 2 and 5, on the boundary, are between 0 and $C$; points 1 and 6, outside the boundary, are 0. (Check: $\sum_n \alpha_n y_n x_n = \frac{5}{9} + 0 - 1 + \frac{10}{9} = \frac{2}{3} = w$ and $\sum_n \alpha_n y_n = -\frac{5}{9} + 1 - 1 + \frac{5}{9} = 0$.)
- These two sets of coefficients use different kernels, so the comparison is not a fair one. For a fair one, go back to the linear regularized logistic regression with $C = 1$ in "Numerical example: three errors side by side" ($w \approx 0.767$, $b \approx -0.384$). Its zero gradient gives $w = \sum_n \theta(-y_n s_n)\,y_n x_n$, and the six coefficients $\theta(-y_n s_n)$ are $0.128, 0.240, 0.595, 0.595, 0.240, 0.128$. Same data, same linear model, same $C$: the SVM's coefficients include two zeros, and logistic regression's six are all nonzero.
- It also has to be said plainly that the SVM's sparsity is not guaranteed. Solving the SVM dual on these six points with the same Gaussian kernel and $C = 1$, this article gets $\boldsymbol{\alpha} \approx (0.650, 1, 1, 1, 1, 0.650)$: all six points are support vectors. With so little data and so narrow a kernel, no point falls outside the fat boundary. The difference is that the SVM's $\alpha_n$ can be 0, and whenever a point falls outside the fat boundary its $\alpha_n$ is 0; KLR's $\beta_n$, by the formula above, is never 0.
- The Gaussian kernel gives the model flexibility: the signs of all six scores agree with the labels, so points 3 and 4 are classified correctly too, which a one-dimensional linear model cannot do. The probabilities all stay near $0.5$ because the regularization at $\lambda = 0.5$ is strong. Lowering $\lambda$ to $0.05$ (corresponding to $C = 10$) turns $\boldsymbol{\beta}$ into $(-1.272, -1.912, 2.682, -2.682, 1.912, 1.272)$ and the six probabilities into $0.127, 0.191, 0.732, 0.268, 0.809, 0.873$. A small $\lambda$ means weak regularization, larger coefficients, and a model more confident about the training data, consistent with the conclusion of the section "Folding ξ into the objective".
- Predicting a new point uses all six training points. Take $x = 1.5$: its kernel values with the six points are $(0.000, 0.002, 0.105, 0.779, 0.779, 0.105)$, the score is the inner product of this vector with $\boldsymbol{\beta}$, about $0.042$, and $g(1.5) = \theta(0.042) \approx 0.511$. This six-dimensional vector is the transformed data described in "Another view".

### Fun Time: the dimension of the space for the linear model of β

**Question (page 19):** When viewing KLR as linear model of $\boldsymbol{\beta}$ (with the kernel as the transform, together with the kernel regularizer), what is the dimension of the Z space that the linear model operates on?

1. $d$, the dimension of the original X space
2. $N$, the number of training examples
3. $\tilde{d}$, the dimension of some feature transform $\boldsymbol{\Phi}(\mathbf{x})$ that is embedded within the kernel
4. $\lambda$, the regularization parameter

**Answer: 2.** The handout's solution: for any $\mathbf{x}$, the transformed data is $\big(K(\mathbf{x}_1, \mathbf{x}), K(\mathbf{x}_2, \mathbf{x}), \dots, K(\mathbf{x}_N, \mathbf{x})\big)$, which is $N$-dimensional. In the lecture, Lin restates the question one more way: how many parameters does this linear model have? The answer is the same, the $N$ coefficients $\beta_n$. In the six-point example every $x$ is turned into a six-dimensional vector, and $\boldsymbol{\beta}$ is six-dimensional too.

Choice 1 is the dimension before the transform (1 in the example). Choice 3 is the dimension of reading 2: when KLR is viewed as a linear model of $\mathbf{w}$, $\mathbf{w}$ lives in a $\tilde{d}$-dimensional space, and for the Gaussian kernel $\tilde{d}$ is infinite. The question asks about reading 1. Choice 4 is the value of a parameter, not a dimension.

The Summary on page 20 reduces each of the four sections to one line: the soft-margin SVM is L2-regularization with hinge error measure; it approximates L2-regularized logistic regression; for soft binary classification, the common approach is two-level learning; kernel logistic regression is the representer theorem applied to L2-regularized logistic regression. The preview of the next lecture is kernel models for regression.

## Self-check

**1. Using the same six points, take $(b, w) = (-\frac{3}{2}, 1)$. Compute the six $\xi_n$ and the objective value of the unconstrained form with $C = 1$. Is it better or worse than $(-\frac{1}{3}, \frac{2}{3})$?**

Answer: the scores $s_n = x_n - 1.5$ are, in order, $-3.5, -2.5, -1.5, -0.5, 0.5, 1.5$; $y_n s_n$ is $3.5, 2.5, -1.5, 0.5, 0.5, 1.5$; and $\xi_n = \max(1 - y_n s_n, 0)$ is $0, 0, 2.5, 0.5, 0.5, 0$, which sums to $3.5$. The objective value is $\frac{1}{2}(1)^2 + 3.5 = 4$, worse than the optimal solution's $\frac{26}{9} \approx 2.889$. Note that points 4 and 5 are classified correctly ($y_n s_n > 0$) and their $\xi_n$ is still positive: the hinge penalizes "not exceeding 1", not just "misclassified".

**2. An L2-regularized model uses $\lambda = 0.125$. What is $C$ when it is written the SVM way? To make $\mathbf{w}$ shorter, should $C$ be raised or lowered?**

Answer: $C = \frac{1}{2\lambda} = \frac{1}{0.25} = 4$. A shorter $\mathbf{w}$ means stronger regularization, so $\lambda$ should be raised and $C$ lowered.

**3. On what range of $ys$ is $\ln(1 + \exp(-ys))$, without the change of base, smaller than the 0/1 error? What does this show?**

Answer: for $ys > 0$ the 0/1 error is 0, and nothing is smaller than that. For $ys \le 0$ the 0/1 error is 1, and $\ln(1 + e^{-ys}) < 1$ is equivalent to $e^{-ys} < e - 1$, that is, $ys > -\ln(e - 1) \approx -0.541$. So on the stretch $-0.541 < ys \le 0$ it is smaller than the 0/1 error and is not an upper bound. After dividing by $\ln 2$ to change to base 2, the value at $ys = 0$ goes from $0.693$ to 1, and only then does the whole curve lie above the 0/1 error. Criterion: you should be able to point out that the problem is near $ys = 0$ and work out that $\ln 2 < 1$.

**4. A probabilistic SVM has learned $A = 2$ and $B = -1$, and the SVM underneath is the one from the six-point example, $w_{\text{SVM}} = \frac{2}{3}$ and $b_{\text{SVM}} = -\frac{1}{3}$. At which $x$ does it put the probability at exactly $\frac{1}{2}$? What is $g(2)$?**

Answer: $A\cdot s + B = 0$ gives the score $s = \frac{1}{2}$; $\frac{2}{3}x - \frac{1}{3} = \frac{1}{2}$ gives $x = 1.25$, which differs from the SVM boundary $x = 0.5$, and that is the effect of $B \ne 0$. The score at $x = 2$ is 1, so $g(2) = \theta(2\cdot 1 - 1) = \theta(1) \approx 0.731$.

**5. The Z space is two-dimensional, with $\mathbf{z}_1 = (1, 2)$ and $\mathbf{z}_2 = (2, 4)$. Someone claims that the optimal solution of some L2-regularized linear model ($\lambda > 0$) is $\mathbf{w} = (3, 1)$. Use the proof of the representer theorem to show that this is impossible, and find a better $\mathbf{w}$.**

Answer: the two $\mathbf{z}_n$ span only the direction $(1, 2)$. Project $\mathbf{w}$ onto it: $\mathbf{w}_{\parallel} = \frac{(3, 1)\cdot(1, 2)}{(1, 2)\cdot(1, 2)}(1, 2) = \frac{5}{5}(1, 2) = (1, 2)$ and $\mathbf{w}_{\perp} = (3, 1) - (1, 2) = (2, -1)$, whose inner product with $(1, 2)$ is $2 - 2 = 0$. $\mathbf{w}_{\parallel}$ has the same scores as $\mathbf{w}$ (5 on $\mathbf{z}_1$ for both, 10 on $\mathbf{z}_2$ for both), so the error is the same; $\mathbf{w}^\top\mathbf{w} = 10$ and $\mathbf{w}_{\parallel}^\top\mathbf{w}_{\parallel} = 5$, so the regularization term is smaller. Hence $(1, 2)$ is better than $(3, 1)$, and $(3, 1)$ cannot be the optimal solution. Extension: the $\boldsymbol{\beta}$ in $(1, 2) = \beta_1\mathbf{z}_1 + \beta_2\mathbf{z}_2$ is not unique ($(1, 0)$ and $(0, \frac{1}{2})$ both work), because the two $\mathbf{z}_n$ are linearly dependent; the theorem guarantees that a $\boldsymbol{\beta}$ exists, not that it is unique.

## Exercises and corresponding reading

**Corresponding weeks in the two semesters.** NTU's on-campus course did not schedule this lecture in full, so this article can only follow the MOOC handout and videos. The [Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) taught [205u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/205u_handout.pdf) in W11 (11/11) under the changed title SVM for Soft Binary Classification; its Summary lists only the first three sections of this lecture, without the Kernel Logistic Regression section, and the same week goes straight on to blending and bagging. The [Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) finishes kernels and soft-margin SVM in W10 and moves directly into blending, bagging, and AdaBoost in W11 (11/18), without scheduling this lecture. These are the results of a check on 2026-09-30. If you only want to keep pace with the NTU classroom, the first three sections are what matter; if you want the full picture of kernel models, the representer theorem section is the foundation for the next lecture.

**Homework.** This lecture has no public homework of its own. Q3 of [Fall 2024 HW6](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf) (released 2024-11-18, due 12-02) touches a related topic; it is an auto-graded multiple-choice problem with no official solution. It changes the soft-margin SVM's violation penalty from $\sum_n \xi_n$ to $\sum_n \xi_n^2$ (squared hinge), gives the dual problem, and asks how to compute the optimal $\boldsymbol{\xi}^*$ once $\boldsymbol{\alpha}^*$ has been solved. The problem practices the dual derivation of the previous lecture and also this lecture's view that "ξ does not have to be a variable": $\xi_n$ is the error, and changing how it is penalized is changing the error function. A suggestion: derive the dual from the Lagrange function yourself first and confirm it has the form the problem gives, then answer the question about $\boldsymbol{\xi}^*$; you can solve the primal and the dual separately with a small data set and a general-purpose QP package to verify your formula. The guide to the whole assignment is in [Techniques Homework and Final Project](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project-en).

**Hands-on.** Type in this article's six points yourself: use a grid search to find the minimum of the unconstrained form and confirm the solutions for $C = 1$ and $C = 0.1$; then write a two-variable gradient descent starting from $(A, B) = (1, 0)$ and confirm that it stops at $A \approx 1.821$. Both parts need only plain Python.

**Further reading.**

- Next to 205u, the Fall 2024 course page lists the further reading [A Note on Platt's Probabilistic Outputs for Support Vector Machines](http://www.csie.ntu.edu.tw/~htlin/paper/doc/plattprob.pdf) (Lin, Weng, Lin), which discusses exactly the "actual model" mentioned in the handout's two lines of gray text. This article did not read that paper page by page and does not cite its contents.
- [Chapter 5 of the CS229 main notes](https://cs229.stanford.edu/main_notes.pdf) derives kernel methods in a different way and can be compared with this lecture's representer theorem.
- [Caltech Learning from Data](https://work.caltech.edu/telecourse) is the English-language course for the same textbook.

**Next lecture.** [Techniques Lecture 6: Support Vector Regression](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-06-support-vector-regression-en) applies the representer theorem to regression, first obtaining kernel ridge regression, which has an analytic solution, and then dealing with the problem this lecture leaves behind: how to make the coefficients sparse the way the SVM's are.

## Course video sources

Original videos: [Soft-Margin SVM as Regularized Model](https://www.youtube.com/watch?v=Bc8bg5ZkRdk), [SVM versus Logistic Regression](https://www.youtube.com/watch?v=5K44AgZvcDk), [SVM for Soft Binary Classification](https://www.youtube.com/watch?v=pNfvZYH5iFg), [Kernel Logistic Regression](https://www.youtube.com/watch?v=AbaIkcQUQuo)

- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

Checked: 2026-10-13. The video IDs, titles, and lengths were taken from the official playlist that day; the videos have no caption track on YouTube, and what this article reports from the lecture comes from transcripts made for it. The first and third videos carry shortened titles on YouTube (Soft-Margin SVM as Regularized, SVM for Soft Binary); the section names in the handout are the full ones.

## Update Log

- 2026-10-10: Marked the video status and checked the recording sources and how they were obtained.
- 2026-10-10: Rechecked the video status. The embedded videos match the lecture in the official playlist.
- 2026-10-13: This article was originally combined with Techniques Lecture 6. It was changed to one article per lecture, now covers only Techniques Lecture 5, and was rewritten from the handout and the video transcripts.

## References

- [Techniques Lecture 5 handout 205_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/205_handout.pdf): the main basis of this article; the derivations, tables, and four Fun Time questions of the four sections all come from this handout.
- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2): the IDs and titles of the four videos; what this article reports as said "in the lecture" is paraphrased from machine transcripts of these four videos.
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/): the official entry for handouts and recordings.
- [Foundations Lecture 14 handout 14_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/14_handout.pdf): the augmented error of L2 regularization, which "Side by side with L2 regularization from Foundations" compares with the unconstrained form.
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/): the W11 schedule and the further-reading list.
- [Fall 2024's 205u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/205u_handout.pdf): the title and Summary of the on-campus version, used to show that it covers only the first three sections.
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/): confirms that this lecture is not scheduled in the course.
- [Fall 2024 Homework 6 (hw6_red.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf): the content of Q3.
- [Lin, Weng, Lin: A Note on Platt's Probabilistic Outputs for Support Vector Machines](http://www.csie.ntu.edu.tw/~htlin/paper/doc/plattprob.pdf): further reading listed on the Fall 2024 course page; this article only points out that it exists.
- [LIBSVM](https://www.csie.ntu.edu.tw/~cjlin/libsvm/): the non-linear SVM software named on page 2 of the handout.
- [LIBLINEAR](https://www.csie.ntu.edu.tw/~cjlin/liblinear/): the linear SVM software named on page 2 of the handout.
- [CS229 main notes main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf): further reading, the kernel methods of Chapter 5.
- [Caltech Learning from Data](https://work.caltech.edu/telecourse): further reading.
- [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques: Course Overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en): where this lecture sits in the whole course and the reading routes.
