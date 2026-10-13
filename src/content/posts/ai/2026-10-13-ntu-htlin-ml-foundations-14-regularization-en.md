---
title: "Regularization: How Weight Decay Constrains a Model | NTU Hsuan-Tien Lin Machine Learning Foundations Lecture 14"
date: 2026-10-13
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, regularization, learning-theory]
lang: en
math: true
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 14
tldr: "Stepping back from a 10th-order polynomial to a 2nd-order one is the same as adding a constraint to the 10th-order problem. Once the constraint is softened to ‖w‖² ≤ C, the negative gradient of E_in at the optimal solution must be parallel to w, which gives w_REG = (ZᵀZ + λI)⁻¹Zᵀy and is the same as minimizing E_aug = E_in + (λ/N)wᵀw. That is weight decay. A larger λ means a smaller equivalent C and a smaller effective VC dimension d_EFF; switching to L1 gives sparse solutions instead."
description: "A guide to Lecture 14 of NTU Hsuan-Tien Lin's Machine Learning Foundations, Regularization: the regularized hypothesis set H(C), the geometric derivation of the Lagrange multiplier, the closed-form solution of ridge regression, augmented error and weight decay, Legendre polynomials, the effective VC dimension, and the L1 and L2 regularizers, with every step worked by hand on three data points."
draft: false
glossary:
  - term: "augmented error"
    aliases: ["E_aug"]
    definition: "E_aug(w) = E_in(w) + (λ/N)Ω(w). Minimizing this unconstrained objective is equivalent to minimizing E_in under the constraint for some C."
    context: "Foundations Lecture 14 writes weight decay as minimizing the augmented error."
  - term: "weight decay"
    aliases: ["weight-decay regularization", "L2 regularization"]
    definition: "Regularization that adds (λ/N)wᵀw to E_in. The larger λ is, the more it prefers a short w."
    context: "The main subject of Foundations Lecture 14; paired with linear regression it is called ridge regression in statistics."
  - term: "effective VC dimension"
    aliases: ["d_EFF"]
    definition: "The model complexity that counts both the hypothesis set H and how the algorithm A chooses within it, written d_EFF(H, A) in the handout. When the algorithm regularizes, it is smaller than d_VC(H)."
    context: "Foundations Lecture 14 uses it to explain why regularization helps generalization."
  - term: "regularizer"
    aliases: ["Ω(w)"]
    definition: "The function added to E_in that measures how complex a single hypothesis w is. Common choices are L2 (Σw_q²) and L1 (Σ|w_q|)."
    context: "The last section of Foundations Lecture 14 discusses how to choose it."
---

> 🌏 [中文版](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-14-regularization)

**Video status: Videos included.** This article is written from the official MOOC handout [14_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/14_handout.pdf) and transcripts of this lecture's four official videos, with formulas following the handout. The transcripts are machine transcripts made for this article (Whisper), not official captions, and no human has proofread them. The videos are taught in Mandarin; the slides are in English. Each section opens with its official video and the approximate time ranges. Page numbers refer to the number at the lower right of each slide (0/22 to 22/22), and wherever the text says "in the lecture" it is paraphrasing what is said in the video.

This is Foundations Lecture 14 in [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en). The Roadmap on page 1 of the handout divides Foundations into four questions, and this lecture belongs to the fourth, How Can Machines Learn Better? The previous lecture, [Foundations Lecture 13: Hazard of Overfitting](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization-en), is down to one line on that page: overfitting happens with excessive power, stochastic/deterministic noise, and limited data. That lecture compared the remedies to driving, and the one called "putting on the brakes" is this lecture's subject, regularization.

There are four prerequisites: the matrix form and the gradient from [Foundations Lecture 9: Linear Regression](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression-en), the polynomial transform and the nested hypothesis sets from [Foundations Lecture 12: Nonlinear Transformation](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-12-nonlinear-transformation-en), the VC bound from [Foundations Lecture 7: The VC Dimension](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error-en), and inner products and perpendicularity of vectors. You do not need to have studied Lagrange multipliers; this lecture explains them with geometry.

After reading, you should be able to go from the constraint $\mathbf{w}^\top\mathbf{w} \le C$ to the closed-form solution $\mathbf{w}_{\text{REG}} = (\mathrm{Z}^\top\mathrm{Z} + \lambda\mathrm{I})^{-1}\mathrm{Z}^\top\mathbf{y}$ on your own, compute the solution for different values of $\lambda$ by hand on a small data set, and explain how $\lambda$, $C$, and the effective VC dimension move together, and why L1 gives sparse solutions.

Here is the whole derivation of the lecture first:

1. **Step back to a lower-order polynomial**: this is the same as adding a constraint to the higher-order problem.
2. **Soften the constraint**: from "these particular coefficients are 0" to "at most this many are nonzero", and then to "the sum of squared coefficients is at most $C$".
3. **Geometric condition**: at the optimal solution, the negative gradient of $E_{\text{in}}$ is parallel to $\mathbf{w}$, with the ratio set by $\lambda$.
4. **Solve for a given $\lambda$**: solve one linear equation and get a closed-form solution.
5. **Switch to an unconstrained problem**: minimize the augmented error.
6. **Connect back to VC theory**: regularization makes the effective VC dimension smaller.
7. **Switch to other regularizers**: L1, symmetry, and how large $\lambda$ should be.

## Writing "step back to a lower-order polynomial" as a constraint: the regularized hypothesis set

```youtube
url: https://www.youtube.com/watch?v=Sno7I5slFUA
title: Regularization :: Regularized Hypothesis Set @ Machine Learning Foundations (機器學習基石)
```

(Video 00:17–03:53 reviews the previous lecture and gives the idea of regularization, 03:53–08:54 writes stepping back as a constraint, 08:54–14:18 covers the looser constraint, 14:18–18:37 covers the softer constraint, and Fun Time follows.)

### The goal: get from the right figure to the left one

Page 2 of the handout shows two figures. The horizontal axis is $x$ and the vertical axis is $y$; each figure has five data points, a blue target function, and a red fit.

| | Right figure (overfit) | Left figure (regularized fit) |
|---|---|---|
| Red curve and the data | Passes through every point; $E_{\text{in}}$ is very low | Does not pass through every point |
| Shape of the red curve | Swings widely up and down between the points | Smooth |
| Red curve and blue curve | Far apart; $E_{\text{out}}$ is large | Almost on top of each other |

The right figure is the overfitting from the previous lecture. In the lecture, Lin says it is what you get when you fit a small amount of data with a polynomial of order four or higher, and that the left figure comes from a lower-order polynomial. So the job is to "step back" from the hypothesis set of high-order polynomials to a low-order one. The handout writes the idea as step back from $\mathcal{H}_{10}$ to $\mathcal{H}_2$, and next to it draws the nested rings from Foundations Lecture 12: $\mathcal{H}_0 \subset \mathcal{H}_1 \subset \mathcal{H}_2 \subset \mathcal{H}_3 \subset \cdots$.

The handout also says where the name comes from: regularization comes from function approximation for ill-posed problems. The explanation in the lecture is that ill-posed means too many functions satisfy the conditions, so you do not know which one to pick and have to narrow the range first. Regression is this kind of problem too: the data is only finitely many points, and a great many functions pass through them.

### Stepping back is adding a constraint

Page 3 of the handout uses a one-dimensional input $x \in \mathbb{R}$ with the $Q$-th order polynomial transform as the example:

$$
\boldsymbol{\Phi}_Q(x) = \big(1, x, x^2, \dots, x^Q\big)
$$

Linear regression follows the transform. Under the earlier notation, the weights in the transformed space should be written $\tilde{\mathbf{w}}$. On this page the handout announces that $\tilde{\mathbf{w}}$ will simply be written $\mathbf{w}$; the reason given in the lecture is to avoid having a crowd of little worms flying around in the formulas. This article follows the handout: from here on $\mathbf{w}$ is the weight vector after the transform, and the transformed data is written $\mathbf{z}_n = \boldsymbol{\Phi}(x_n)$.

The hypotheses in the two hypothesis sets look like this:

$$
\begin{aligned}
\mathcal{H}_{10}:\quad & w_0 + w_1 x + w_2 x^2 + w_3 x^3 + \dots + w_{10} x^{10} \\
\mathcal{H}_{2}:\quad & w_0 + w_1 x + w_2 x^2
\end{aligned}
$$

Set $w_3$ through $w_{10}$ to 0 in a hypothesis of $\mathcal{H}_{10}$ and what remains is a hypothesis of $\mathcal{H}_2$. The handout writes it this way: $\mathcal{H}_2 = \mathcal{H}_{10}$ AND "constraint that $w_3 = w_4 = \dots = w_{10} = 0$". So step back = constraint.

Page 4 turns this sentence into optimization problems. On both sides $\mathbf{w}$ is an 11-dimensional vector (the handout writes $\mathbb{R}^{10+1}$):

$$
\text{regression with } \mathcal{H}_{10}:\quad \min_{\mathbf{w} \in \mathbb{R}^{10+1}} E_{\text{in}}(\mathbf{w})
$$

$$
\text{regression with } \mathcal{H}_{2}:\quad \min_{\mathbf{w} \in \mathbb{R}^{10+1}} E_{\text{in}}(\mathbf{w}) \quad \text{s.t.} \quad w_3 = w_4 = \dots = w_{10} = 0
$$

The way the lecture puts it: the problem on the left accepts every 11-dimensional vector, while the problem on the right does not even look at vectors that fail the condition and searches for the best one only among those that satisfy it.

At the bottom of the page the handout asks a question on the students' behalf: why don't you just use $\mathbf{w} \in \mathbb{R}^{2+1}$? If you want a 2nd-order polynomial, three coefficients are enough, so why take the detour? The answer in the lecture is that this step is taken to widen the view. Once the problem is written as "a big set plus a constraint", you can adjust the constraint, and the later derivation becomes easier.

### Looser: only say how many coefficients are 0

The constraint of $\mathcal{H}_2$ says which eight coefficients are 0. Page 5 loosens it: require only that at least eight are 0, whichever eight they are. At least eight equal to 0 means at most three not equal to 0:

$$
\mathcal{H}_2' \equiv \Big\{ \mathbf{w} \in \mathbb{R}^{10+1} \ \text{while} \ \ge 8 \text{ of } w_q = 0 \Big\}, \qquad \min_{\mathbf{w} \in \mathbb{R}^{10+1}} E_{\text{in}}(\mathbf{w}) \quad \text{s.t.} \quad \sum_{q=0}^{10} \llbracket w_q \ne 0 \rrbracket \le 3
$$

$\llbracket \cdot \rrbracket$ is 1 when the condition holds and 0 when it does not, so the sum counts the nonzero coefficients. The handout lists how this set relates to the other two:

- $\mathcal{H}_2 \subset \mathcal{H}_2'$: more flexible than $\mathcal{H}_2$. Every $\mathbf{w}$ that satisfies "$w_3$ through $w_{10}$ are all 0" also satisfies "at least eight are 0".
- $\mathcal{H}_2' \subset \mathcal{H}_{10}$: less risky than $\mathcal{H}_{10}$. In the lecture, Lin says it is not as all-encompassing as $\mathcal{H}_{10}$, so it may overfit less easily.

An example added in this article: $0.5 + 2x^5 - x^9$ has only three nonzero coefficients, so it is in $\mathcal{H}_2'$ but not in $\mathcal{H}_2$.

A hypothesis like this, with most coefficients equal to 0, is called a sparse hypothesis. The lecture mentions its benefit: when predicting later you only compute the three nonzero terms and add them up, instead of computing every term.

The bad news is at the bottom of the page: minimizing $E_{\text{in}}$ over $\mathcal{H}_2'$ is NP-hard. The intuition given in the lecture is that the $\llbracket \cdot \rrbracket$ in the constraint is a discrete function. [Foundations Lecture 2: Perceptrons and PLA](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm-en) first ran into it in the perceptron's 0/1 error, and it was already clear then that functions of this kind are hard to optimize. This article adds one number to give a feel for it: just choosing "which three coefficients may be nonzero" out of 11 has $\binom{11}{3} = 165$ possibilities, and once the dimension grows, trying them one by one is not feasible.

### Softer: the sum of squared coefficients is at most C

Page 6 switches to a constraint that is easy to handle. The old one counted how many coefficients are nonzero. The new one measures how large the coefficients are: add up the square of every coefficient and require the total to be at most an upper limit $C$ fixed in advance:

$$
\mathcal{H}(C) \equiv \Big\{ \mathbf{w} \in \mathbb{R}^{10+1} \ \text{while} \ \lVert\mathbf{w}\rVert^2 \le C \Big\}, \qquad \min_{\mathbf{w} \in \mathbb{R}^{10+1}} E_{\text{in}}(\mathbf{w}) \quad \text{s.t.} \quad \sum_{q=0}^{10} w_q^2 \le C
$$

The thinking in the lecture: a coefficient that is 0 or very close to 0 has a small square, and a coefficient that is not 0 has a large one. So the sum of squares can serve as a continuous version of "how many are nonzero", and it avoids the discrete function. $C$ can be a number like 13, 15, or 11.7.

The handout says two things about $\mathcal{H}(C)$.

**First, it overlaps with $\mathcal{H}_2'$ but is not exactly the same.** The three 11-dimensional vectors $\mathbf{w}$ below are examples made up for this article, not from the slides, with $C = 1$:

| $\mathbf{w}$ | Nonzero count | $\lVert\mathbf{w}\rVert^2$ | In $\mathcal{H}_2'$? | In $\mathcal{H}(1)$? |
|---|---|---|---|---|
| $(0.5, 0.5, 0, \dots, 0)$ | 2 | $0.5$ | Yes | Yes |
| $(3, 0, 0, \dots, 0)$ | 1 | $9$ | Yes | No |
| $(0.1, 0.1, \dots, 0.1)$ | 11 | $11 \times 0.01 = 0.11$ | No | Yes |

The third row is the case described in the lecture: a hypothesis whose coefficients are all small but none of them 0 is in $\mathcal{H}(C)$ and not in $\mathcal{H}_2'$.

**Second, it forms a nested structure as $C$ varies.** The handout calls it a soft and smooth structure over $C \ge 0$:

$$
\mathcal{H}(0) \subset \mathcal{H}(1.126) \subset \dots \subset \mathcal{H}(1126) \subset \dots \subset \mathcal{H}(\infty) = \mathcal{H}_{10}
$$

$\mathcal{H}_0, \mathcal{H}_1, \mathcal{H}_2, \dots$ offer only 11 levels to choose from, while $C$ is a real number; in the lecture, Lin says this amounts to infinitely many hypothesis sets lined up by the size of $C$. $C = \infty$ means no constraint, which is the original $\mathcal{H}_{10}$; at the other end, $\mathcal{H}(0)$ contains the single hypothesis $\mathbf{w} = \mathbf{0}$.

The handout calls $\mathcal{H}(C)$ the regularized hypothesis set and writes the optimal solution found in it as $\mathbf{w}_{\text{REG}}$. The conclusion of this section: a regularized hypothesis set is the original hypothesis set plus a constraint.

### Fun Time: which one is not in H(1)

**Question (page 7):** For $Q \ge 1$, which of the following hypothesis (weight vector $\mathbf{w} \in \mathbb{R}^{Q+1}$) is not in the regularized hypothesis set $\mathcal{H}(1)$?

1. $\mathbf{w}^\top = [0, 0, \dots, 0]$
2. $\mathbf{w}^\top = [1, 0, \dots, 0]$
3. $\mathbf{w}^\top = [1, 1, \dots, 1]$
4. $\mathbf{w}^\top = \Big[\sqrt{\tfrac{1}{Q+1}}, \sqrt{\tfrac{1}{Q+1}}, \dots, \sqrt{\tfrac{1}{Q+1}}\Big]$

**Answer: 3.** Compute $\lVert\mathbf{w}\rVert^2$ for each choice and compare it with 1:

- Choice 1: $0 \le 1$, so it is in the set.
- Choice 2: $1^2 = 1 \le 1$, exactly on the boundary, which still counts as in the set.
- Choice 3: the sum of squares of $Q + 1$ ones is $Q + 1$. Because $Q \ge 1$, this number is at least 2, which exceeds 1, so it is not in the set.
- Choice 4: $Q + 1$ copies of $\frac{1}{Q+1}$ add up to exactly 1, on the boundary and also in the set.

The question says $Q \ge 1$ for a reason: when $Q = 0$, choice 3 has a single component, its sum of squares is 1, and it is in $\mathcal{H}(1)$. Choices 2 and 4 have the same length; one puts all the length on a single coefficient and the other spreads it evenly over all of them. $\mathcal{H}(C)$ does not care how the length is distributed, and that is also where it differs from $\mathcal{H}_2'$.

## Solving the constrained problem: Lagrange multipliers, augmented error, and weight decay

```youtube
url: https://www.youtube.com/watch?v=idWnPdW9znM
title: Regularization :: Weight Decay Regularization @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–01:57 writes the matrix form, 01:57–09:03 explains the Lagrange multiplier with geometry, 09:03–12:40 finds the closed-form solution for a given λ, 12:40–17:20 covers the augmented error, 17:20–19:39 looks at the results for different λ, 19:39–23:08 covers Legendre polynomials, and Fun Time follows.)

### First, the matrix form

Page 8 writes the problem with vectors and matrices. Stack the $N$ transformed data points $\mathbf{z}_n^\top$ row by row into a matrix $\mathrm{Z}$ and the labels into a vector $\mathbf{y}$. Foundations Lecture 9 derived $\sum_n (\mathbf{w}^\top\mathbf{z}_n - y_n)^2 = (\mathrm{Z}\mathbf{w} - \mathbf{y})^\top(\mathrm{Z}\mathbf{w} - \mathbf{y})$, and the handout writes "remember?" next to it. The $\sum_q w_q^2$ in the constraint is the inner product of $\mathbf{w}$ with itself:

$$
\min_{\mathbf{w} \in \mathbb{R}^{Q+1}} \ E_{\text{in}}(\mathbf{w}) = \frac{1}{N}(\mathrm{Z}\mathbf{w} - \mathbf{y})^\top(\mathrm{Z}\mathbf{w} - \mathbf{y}) \qquad \text{s.t.} \quad \mathbf{w}^\top\mathbf{w} \le C
$$

The constraint has a geometric meaning: a feasible $\mathbf{w}$ lies inside a ball centered at the origin with radius $\sqrt{C}$ (the handout writes hypersphere). Every $\mathbf{w}$ outside the ball is ruled out.

### Geometry: at the optimal solution, the negative gradient is parallel to w

Page 9 thinks about the problem with a two-dimensional figure. The figure has three things:

- **Blue ellipses**, labeled $E_{\text{in}} = \text{const.}$, are the contour lines of $E_{\text{in}}$. Their center is $\mathbf{w}_{\text{LIN}}$, the linear regression solution with no constraint. In the lecture, Lin says $E_{\text{in}}$ is like a valley whose bottom is at $\mathbf{w}_{\text{LIN}}$.
- **A red circle**, labeled $\mathbf{w}^\top\mathbf{w} = C$, is centered at the origin. A feasible solution has to be inside the circle.
- **A point $\mathbf{w}$ on the circle**, with three arrows drawn from it: the blue $-\nabla E_{\text{in}}$ points toward the side where the valley bottom is, the red normal points outward from the origin, and the green arrow runs along the tangent of the circle.

With no constraint, the gradient descent taught in [Foundations Lecture 10: Logistic Regression](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-10-logistic-regression-en) rolls down along $-\nabla E_{\text{in}}(\mathbf{w})$ all the way to $\mathbf{w}_{\text{LIN}}$. Now the ball is in the way. If $\mathbf{w}_{\text{LIN}}$ is already inside the ball, it is the answer and the constraint does nothing. In the lecture, Lin says that most of the time this is not the case: $\mathbf{w}_{\text{LIN}}$ is outside the ball, and the solution we want is then on the boundary of the ball.

This article adds the reason for the boundary: $E_{\text{in}}$ is a convex function. If the optimal solution were in the interior of the ball, you could move in every direction around it, yet no direction would make $E_{\text{in}}$ smaller, so it would be the bottom of the whole valley, $\mathbf{w}_{\text{LIN}}$, contradicting "$\mathbf{w}_{\text{LIN}}$ is outside the ball".

The next question is how to tell whether a given $\mathbf{w}$ on the sphere is the optimal solution. The handout does it in four steps:

1. **The decreasing direction** is $-\nabla E_{\text{in}}(\mathbf{w})$.
2. **The normal vector of the sphere** is $\mathbf{w}$ itself. The sphere is $\mathbf{w}^\top\mathbf{w} = C$, and the direction from the origin to a point on the sphere is perpendicular to the sphere there. Moving outward along this direction rolls out of the ball and violates the constraint; the directions perpendicular to it run along the sphere, and in the lecture, Lin says a small step that way still stays on the sphere.
3. **If $-\nabla E_{\text{in}}(\mathbf{w})$ and $\mathbf{w}$ are not parallel**, split $-\nabla E_{\text{in}}$ into a component along the normal vector and a component perpendicular to it. The latter is the green arrow in the figure, and it is not zero. Moving along the green arrow decreases $E_{\text{in}}$ without leaving the sphere. The handout's wording is can decrease $E_{\text{in}}(\mathbf{w})$ without violating the constraint. This $\mathbf{w}$ is not the optimal solution.
4. **So at the optimal solution $\mathbf{w}_{\text{REG}}$**, the green component must be zero, that is,

$$
-\nabla E_{\text{in}}(\mathbf{w}_{\text{REG}}) \ \propto\ \mathbf{w}_{\text{REG}}
$$

Two vectors are parallel when one equals the other times a number. The handout writes this ratio as $\frac{2\lambda}{N}$:

$$
\nabla E_{\text{in}}(\mathbf{w}_{\text{REG}}) + \frac{2\lambda}{N}\mathbf{w}_{\text{REG}} = \mathbf{0}
$$

In the lecture, Lin says the extra 2 and $N$ are there only to make the coming derivation convenient. $\lambda$ is called the Lagrange multiplier, an important tool for solving constrained optimization problems; the four steps above are its geometric meaning, and someone who has never studied it can understand it from this geometry. The handout states the goal as: find a Lagrange multiplier $\lambda > 0$ and $\mathbf{w}_{\text{REG}}$ such that this equation holds.

This article adds why $\lambda$ is positive. Rearranged, the equation reads $-\nabla E_{\text{in}} = \frac{2\lambda}{N}\mathbf{w}_{\text{REG}}$, and $\lambda > 0$ means the negative gradient points out of the ball: the valley bottom is outside the ball, so the downhill direction is outward. If the negative gradient pointed into the ball, one step inward would be feasible and would also decrease $E_{\text{in}}$, so that point would not be the optimal solution either.

### Someone tells you λ: solve one linear equation

The unknowns have gone from a single $\mathbf{w}$ to $\mathbf{w}$ plus $\lambda$, and in the lecture, Lin voices the complaint for the students: the problem seems to have become more complicated. Page 10 of the handout handles this by first assuming an oracle tells you $\lambda$ (in the lecture, a classmate who somehow knows everything). The only unknown left is then $\mathbf{w}_{\text{REG}}$.

Foundations Lecture 9 computed the gradient of linear regression: $\nabla E_{\text{in}}(\mathbf{w}) = \frac{2}{N}\big(\mathrm{Z}^\top\mathrm{Z}\mathbf{w} - \mathrm{Z}^\top\mathbf{y}\big)$. Substitute it into the parallel condition:

$$
\frac{2}{N}\big(\mathrm{Z}^\top\mathrm{Z}\mathbf{w}_{\text{REG}} - \mathrm{Z}^\top\mathbf{y}\big) + \frac{2\lambda}{N}\mathbf{w}_{\text{REG}} = \mathbf{0}
$$

Everything in the equation except $\mathbf{w}_{\text{REG}}$ is a known number, and $\mathbf{w}_{\text{REG}}$ appears only to the first power; the lecture stresses that this is a linear equation. Multiply both sides by $\frac{N}{2}$, and the 2 and $N$ added earlier cancel here:

$$
\mathrm{Z}^\top\mathrm{Z}\mathbf{w}_{\text{REG}} - \mathrm{Z}^\top\mathbf{y} + \lambda\mathbf{w}_{\text{REG}} = \mathbf{0}
$$

Write $\lambda\mathbf{w}_{\text{REG}}$ as $\lambda\mathrm{I}\mathbf{w}_{\text{REG}}$ ($\mathrm{I}$ is the identity matrix), combine the two terms that contain $\mathbf{w}_{\text{REG}}$, and move $\mathrm{Z}^\top\mathbf{y}$ to the right:

$$
\big(\mathrm{Z}^\top\mathrm{Z} + \lambda\mathrm{I}\big)\mathbf{w}_{\text{REG}} = \mathrm{Z}^\top\mathbf{y} \quad\Longrightarrow\quad \mathbf{w}_{\text{REG}} = \big(\mathrm{Z}^\top\mathrm{Z} + \lambda\mathrm{I}\big)^{-1}\mathrm{Z}^\top\mathbf{y}
$$

Compared with $\mathbf{w}_{\text{LIN}} = (\mathrm{Z}^\top\mathrm{Z})^{-1}\mathrm{Z}^\top\mathbf{y}$, the only addition is $\lambda\mathrm{I}$. The handout notes that this is called ridge regression in Statistics.

The last step uses an inverse matrix. Does it always exist? In the lecture, Lin says it always does when $\lambda > 0$: $\mathrm{Z}^\top\mathrm{Z}$ is positive semi-definite, adding a positive $\lambda\mathrm{I}$ makes it positive definite, and a positive definite matrix is always invertible. This article fills in the calculation behind that sentence. For every $\mathbf{v}$ that is not the zero vector:

$$
\mathbf{v}^\top\big(\mathrm{Z}^\top\mathrm{Z} + \lambda\mathrm{I}\big)\mathbf{v} = (\mathrm{Z}\mathbf{v})^\top(\mathrm{Z}\mathbf{v}) + \lambda\mathbf{v}^\top\mathbf{v} = \lVert\mathrm{Z}\mathbf{v}\rVert^2 + \lambda\lVert\mathbf{v}\rVert^2 > 0
$$

The first term is never negative, and the second is strictly greater than 0 when $\lambda > 0$. If the matrix were not invertible, it would send some nonzero $\mathbf{v}$ to the zero vector and the expression above would equal 0, a contradiction. The $\mathrm{Z}^\top\mathrm{Z}$ of Foundations Lecture 9 may fail to be invertible when there is too little data and then needs the pseudo-inverse; with $\lambda\mathrm{I}$ added that problem is gone, and the solution is unique.

### Another angle: minimizing the augmented error

The second version of page 10 reads the same equation in a different way. The starting point in the lecture: $E_{\text{in}}$ need not be that of linear regression. It could be that of logistic regression, where there is no closed-form solution, so how should this condition be read then?

We used to solve $\nabla E_{\text{in}}(\mathbf{w}) = \mathbf{0}$ because we wanted to minimize $E_{\text{in}}$. What we have to solve now is "the gradient plus some term equals zero", so look for a function whose gradient is exactly that whole left-hand side. In the lecture, Lin describes this as running differentiation backward into integration. The partial derivative of $\mathbf{w}^\top\mathbf{w} = \sum_q w_q^2$ with respect to $w_q$ is $2w_q$, so $\nabla(\mathbf{w}^\top\mathbf{w}) = 2\mathbf{w}$, and therefore

$$
\nabla\Big(E_{\text{in}}(\mathbf{w}) + \frac{\lambda}{N}\mathbf{w}^\top\mathbf{w}\Big) = \nabla E_{\text{in}}(\mathbf{w}) + \frac{2\lambda}{N}\mathbf{w}
$$

The right side is the left side of the parallel condition. So solving the parallel condition is the same as minimizing

$$
E_{\text{aug}}(\mathbf{w}) = E_{\text{in}}(\mathbf{w}) + \underbrace{\frac{\lambda}{N}\mathbf{w}^\top\mathbf{w}}_{\text{regularizer}}
$$

The extra term is called the regularizer and the whole function is called the augmented error, augmented meaning "with something added on". This new problem has no constraint at all; the lecture puts it as the original condition having moved inside the thing being minimized. The handout writes the procedure as:

$$
\mathbf{w}_{\text{REG}} \leftarrow \operatorname*{argmin}_{\mathbf{w}} E_{\text{aug}}(\mathbf{w}) \quad \text{for given } \lambda > 0 \text{ or } \lambda = 0
$$

$\lambda = 0$ is allowed too. The regularizer then disappears and we are back to the original problem of minimizing only $E_{\text{in}}$.

This also changes which parameter the user supplies. The way the lecture tells it: originally the user gives $C$ and we still have to find the $\lambda$ that corresponds to it; since every $C$ corresponds to some $\lambda$, we may as well ask the user for $\lambda$ directly. For the user, giving either one takes about the same effort, and for us, having $\lambda$ leaves just one unconstrained problem to solve. The conclusion at the bottom of the page is: minimizing unconstrained $E_{\text{aug}}$ effectively minimizes some $C$-constrained $E_{\text{in}}$.

This article adds a check that does not rely on the figure, to confirm that the converse also holds. Given $\lambda > 0$, let $\mathbf{w}_{\text{REG}}$ be the minimizer of $E_{\text{aug}}$ and take $C = \mathbf{w}_{\text{REG}}^\top\mathbf{w}_{\text{REG}}$. For every $\mathbf{w}$ that satisfies $\mathbf{w}^\top\mathbf{w} \le C$, rearranging $E_{\text{aug}}(\mathbf{w}) \ge E_{\text{aug}}(\mathbf{w}_{\text{REG}})$ gives

$$
E_{\text{in}}(\mathbf{w}) \ \ge\ E_{\text{in}}(\mathbf{w}_{\text{REG}}) + \frac{\lambda}{N}\big(C - \mathbf{w}^\top\mathbf{w}\big) \ \ge\ E_{\text{in}}(\mathbf{w}_{\text{REG}})
$$

The second inequality uses $C - \mathbf{w}^\top\mathbf{w} \ge 0$. So $\mathbf{w}_{\text{REG}}$ really is the one with the smallest $E_{\text{in}}$ in $\mathcal{H}(C)$.

### Numerical example: three data points, λ from 0 to 100

What follows is an example made up for this article, not from the slides. So that it can be drawn in the plane and matched against the figure on page 9, $\mathbf{w}$ has only two dimensions: no high-order transform, $\mathbf{z} = (1, x)$, and the hypothesis is the line $w_0 + w_1 x$. There are three data points:

| $n$ | $x_n$ | $\mathbf{z}_n$ | $y_n$ |
|---|---|---|---|
| 1 | $-1$ | $(1, -1)$ | $1$ |
| 2 | $0$ | $(1, 0)$ | $3$ |
| 3 | $1$ | $(1, 1)$ | $2$ |

**Step 1: compute the two matrices.**

$$
\mathrm{Z}^\top\mathrm{Z} = \begin{bmatrix} 1+1+1 & -1+0+1 \\ -1+0+1 & 1+0+1 \end{bmatrix} = \begin{bmatrix} 3 & 0 \\ 0 & 2 \end{bmatrix}, \qquad \mathrm{Z}^\top\mathbf{y} = \begin{bmatrix} 1+3+2 \\ -1+0+2 \end{bmatrix} = \begin{bmatrix} 6 \\ 1 \end{bmatrix}
$$

$x$ is symmetric about 0, so $\mathrm{Z}^\top\mathrm{Z}$ is a diagonal matrix and its inverse can be written down directly.

**Step 2: the solution without regularization.** $\mathbf{w}_{\text{LIN}} = (6/3,\ 1/2) = (2, \tfrac{1}{2})$. The three predictions are $1.5, 2, 2.5$, the errors are $0.5, -1, 0.5$, and $E_{\text{in}}(\mathbf{w}_{\text{LIN}}) = \frac{1}{3}(0.25 + 1 + 0.25) = \frac{1}{2}$. $\lVert\mathbf{w}_{\text{LIN}}\rVert^2 = 4 + \tfrac{1}{4} = \tfrac{17}{4} = 4.25$.

**Step 3: plug into the closed-form solution.** The diagonal of $\mathrm{Z}^\top\mathrm{Z} + \lambda\mathrm{I}$ is $3 + \lambda$ and $2 + \lambda$, so

$$
\mathbf{w}_{\text{REG}} = \Big(\frac{6}{3+\lambda},\ \frac{1}{2+\lambda}\Big)
$$

Take $\lambda = 1$: $\mathbf{w}_{\text{REG}} = (\tfrac{3}{2}, \tfrac{1}{3})$. The three predictions are $\tfrac{7}{6}, \tfrac{3}{2}, \tfrac{11}{6}$, and their differences from $y$ are $\tfrac{1}{6}, -\tfrac{3}{2}, -\tfrac{1}{6}$, so

$$
E_{\text{in}}(\mathbf{w}_{\text{REG}}) = \frac{1}{3}\Big(\frac{1}{36} + \frac{9}{4} + \frac{1}{36}\Big) = \frac{83}{108} \approx 0.769, \qquad \lVert\mathbf{w}_{\text{REG}}\rVert^2 = \frac{9}{4} + \frac{1}{9} = \frac{85}{36} \approx 2.361
$$

$E_{\text{in}}$ rises from $0.5$ to $0.769$, and the squared length of $\mathbf{w}$ falls from $4.25$ to $2.361$.

**Step 4: check the parallel condition.** At $\mathbf{w}_{\text{REG}} = (\tfrac{3}{2}, \tfrac{1}{3})$:

$$
\nabla E_{\text{in}} = \frac{2}{3}\left(\begin{bmatrix} 3 & 0 \\ 0 & 2 \end{bmatrix}\begin{bmatrix} 3/2 \\ 1/3 \end{bmatrix} - \begin{bmatrix} 6 \\ 1 \end{bmatrix}\right) = \frac{2}{3}\begin{bmatrix} -3/2 \\ -1/3 \end{bmatrix} = \begin{bmatrix} -1 \\ -2/9 \end{bmatrix}
$$

And $\frac{2\lambda}{N}\mathbf{w}_{\text{REG}} = \frac{2}{3}(\tfrac{3}{2}, \tfrac{1}{3}) = (1, \tfrac{2}{9})$. The two add up to the zero vector, and the negative gradient $(1, \tfrac{2}{9})$ points in the same direction as $\mathbf{w}_{\text{REG}}$.

**Step 5: compare with the constrained problem.** This $\mathbf{w}_{\text{REG}}$ lies on the circle with squared radius $C = \tfrac{85}{36}$. Take another point on the same circle, for example $\mathbf{w}_A = (\sqrt{85}/6,\ 0) \approx (1.537, 0)$:

- $E_{\text{in}}(\mathbf{w}_A) \approx 0.881$, higher than $0.769$.
- $-\nabla E_{\text{in}}(\mathbf{w}_A) = \frac{2}{3}\big(6 - 3 \times 1.537,\ 1 - 0\big) \approx (0.927, 0.667)$.
- The normal vector is the direction of $\mathbf{w}_A$, $(1, 0)$. Splitting the negative gradient, the component along the normal vector is $0.927$ and the component perpendicular to it is $(0, 0.667)$, which is not zero.

This $0.667$ is the green arrow in the figure on page 9: moving along the circle in the direction of increasing $w_1$ lowers $E_{\text{in}}$ further, and the green component vanishes only on reaching $(\tfrac{3}{2}, \tfrac{1}{3})$. For this article, a program cut this circle into two million points and computed $E_{\text{in}}$ at each one; the minimum $0.76852$ occurs at $(1.5000, 0.3333)$, in agreement with the closed-form solution.

**Step 6: sweep over $\lambda$.**

| $\lambda$ | $\mathbf{w}_{\text{REG}}$ | $\lVert\mathbf{w}_{\text{REG}}\rVert^2$ (the equivalent $C$) | $E_{\text{in}}$ | $E_{\text{aug}}$ |
|---|---|---|---|---|
| $0$ | $(2, 0.5)$ | $4.250$ | $0.500$ | $0.500$ |
| $0.1$ | $(1.935, 0.476)$ | $3.973$ | $0.505$ | $0.637$ |
| $1$ | $(1.5, 0.333)$ | $2.361$ | $0.769$ | $1.556$ |
| $3$ | $(1, 0.2)$ | $1.040$ | $1.560$ | $2.600$ |
| $10$ | $(0.462, 0.083)$ | $0.220$ | $2.983$ | $3.716$ |
| $100$ | $(0.058, 0.010)$ | $0.003$ | $4.431$ | $4.547$ |

**What this result means.** As $\lambda$ goes up, $\mathbf{w}_{\text{REG}}$ gets shorter and shorter, the equivalent $C$ gets smaller and smaller, and $E_{\text{in}}$ gets higher and higher. When $\lambda$ is very large, $\mathbf{w}$ is pressed close to the zero vector, the line becomes almost $y = 0$, and $E_{\text{in}}$ approaches $\frac{1}{3}(1 + 9 + 4) \approx 4.667$. $\lambda = 0.1$ raises $E_{\text{in}}$ by only $0.005$, while $\lambda = 10$ raises it by almost $2.5$. The two coefficients are also shrunk by different ratios: at $\lambda = 1$, $w_0$ is multiplied by $\frac{3}{4}$ and $w_1$ by $\frac{2}{3}$, so the direction with the smaller number on the diagonal of $\mathrm{Z}^\top\mathrm{Z}$ shrinks more.

In the other direction, a given $C$ also has its $\lambda$, but you have to solve the equation $\frac{36}{(3+\lambda)^2} + \frac{1}{(2+\lambda)^2} = C$: $C = 3$ corresponds to $\lambda \approx 0.556$, $C = 2$ to $\lambda \approx 1.341$, and $C = 1$ to $\lambda \approx 3.118$. When $C \ge 4.25$, $\mathbf{w}_{\text{LIN}}$ is already inside the circle and $\lambda = 0$. This equation has no simple formula for its solution and needs a numerical method. When the lecture says that a user who gives $C$ leaves us the extra work of finding the corresponding $\lambda$, this is the step it means.

If you want to recompute it yourself, the program below prints every row of the table above:

```python
import numpy as np

Z = np.array([[1, -1], [1, 0], [1, 1]], dtype=float)
y = np.array([1, 3, 2], dtype=float)
N = len(y)

for lam in [0, 0.1, 1, 3, 10, 100]:
    w = np.linalg.solve(Z.T @ Z + lam * np.eye(2), Z.T @ y)
    e_in = np.mean((Z @ w - y) ** 2)
    print(lam, w.round(3), round(w @ w, 3), round(e_in, 3), round(e_in + lam / N * (w @ w), 3))
```

### The four figures in the handout and the name weight decay

Page 11 goes back to the five data points from the start of the lecture and fits them with four different values of $\lambda$. The four figures, from left to right:

| $\lambda$ | What the red curve looks like | The handout's label |
|---|---|---|
| $0$ | Passes through every point and swings widely between them | overfitting |
| $0.0001$ | Smooth, almost on top of the blue target | |
| $0.01$ | Smooth, starting to move away from the target, not passing through every point | |
| $1$ | A very flat curve, far from the target | underfitting |

$\lambda = 0$ is the original result of minimizing only $E_{\text{in}}$. In the lecture, Lin says that adding as little as $0.0001$ already makes the red curve smooth and close to the blue one; when $\lambda$ is raised a lot the curve is still smooth but far from the blue one again, which is the underfitting from the previous lecture. The handout sums up the lesson in one sentence: a little regularization goes a long way. Lin says in the lecture that this borrows the saying "a little goes a long way", whose original meaning is that a little effort can accomplish a lot.

The handout then gives the method a name: it calls $+\frac{\lambda}{N}\mathbf{w}^\top\mathbf{w}$ weight-decay regularization and lists three equivalent things:

$$
\text{larger } \lambda \iff \text{prefer shorter } \mathbf{w} \iff \text{effectively smaller } C
$$

The explanation in the lecture is that $\lambda$ acts like a penalty on a long $\mathbf{w}$: the thing being minimized contains $\lambda$ times the squared length, so the longer $\mathbf{w}$ is, the more it is penalized. The name weight decay refers to making the weights smaller. The table in the numerical example above is an instance of these three things.

This article adds another reading of the name, using the gradient descent from Foundations Lecture 10. Run gradient descent on $E_{\text{aug}}$ and each step is

$$
\mathbf{w}_{t+1} = \mathbf{w}_t - \eta\Big(\nabla E_{\text{in}}(\mathbf{w}_t) + \frac{2\lambda}{N}\mathbf{w}_t\Big) = \Big(1 - \frac{2\eta\lambda}{N}\Big)\mathbf{w}_t - \eta\nabla E_{\text{in}}(\mathbf{w}_t)
$$

$\eta$ is the step size. As long as $\eta\lambda$ is positive and not too large, the number in the parentheses is between 0 and 1: every step first shrinks the old weights a little and then updates with the original gradient.

The bottom of the page has one more line: go with 'any' transform + linear model. In the lecture, Lin says this lecture uses the polynomial transform plus linear regression as its example, and the same regularization can also be paired with logistic regression or with other transforms. This article adds: paired with logistic regression there is no closed-form solution, and you can minimize $E_{\text{aug}}$ with the gradient descent formula above.

### One detail: Legendre polynomials

Page 12 explains a treatment behind those four figures. In the lecture, Lin says that to make the results look a bit better, a small trick was applied to the transform. Written out, the regularized problem is

$$
\min_{\mathbf{w} \in \mathbb{R}^{Q+1}} \ \frac{1}{N}\sum_{n=1}^{N}\big(\mathbf{w}^\top\boldsymbol{\Phi}(x_n) - y_n\big)^2 + \frac{\lambda}{N}\sum_{q=0}^{Q} w_q^2
$$

This page of the handout prints the index of the first sum as $n = 0$ to $N$. The data is numbered from the 1st point to the $N$-th, and page 8 writes the same sum with $n = 1$, so the formula above uses $n = 1$ to $N$.

If $\boldsymbol{\Phi}$ is the original polynomial transform $(1, x, x^2, \dots, x^Q)$ (the handout calls it the naïve polynomial transform) and $x_n$ lies in $[-1, +1]$, then $x_n^q$ is extremely small when $q$ is large. For example, at $x = 0.5$, $x^{10} \approx 0.001$. The handout's note reads: $x_n^q$ really small, needing large $w_q$. For a high-order term to affect the result it has to come with a very large coefficient, and large coefficients are exactly what regularization penalizes. In the lecture, Lin says this amounts to over-penalizing the high-order terms: the low-order part is tolerated a lot, while regularization comes down too hard on the high-order part. The lecture also mentions that numbers this small cause precision problems.

The handout's approach is to switch to another basis, which it calls the normalized polynomial transform:

$$
\boldsymbol{\Phi}(x) = \big(1, L_1(x), L_2(x), \dots, L_Q(x)\big)
$$

$L_q$ are the Legendre polynomials. The handout lists the formulas and graphs of the first five:

| | Formula |
|---|---|
| $L_1$ | $x$ |
| $L_2$ | $\frac{1}{2}(3x^2 - 1)$ |
| $L_3$ | $\frac{1}{2}(5x^3 - 3x)$ |
| $L_4$ | $\frac{1}{8}(35x^4 - 30x^2 + 3)$ |
| $L_5$ | $\frac{1}{8}(63x^5 - \cdots)$ |

$L_q$ is still a polynomial of order $q$, so the functions this basis can form are exactly the same as with the original $(1, x, \dots, x^Q)$. The hypothesis set has not changed; what changes is which set of coefficients represents the same function. The lecture describes it as a change of coordinates: the original coordinates are not perpendicular to one another, which is what causes trouble for regularization. If you think of functions as vectors with infinitely many dimensions, you can require their pairwise inner products to be 0, and the Legendre polynomials are what you get by orthogonalizing the original polynomials. In linear algebra this procedure is called Gram–Schmidt orthogonalization; that name is an addition in this article.

This article backs the passage with two calculations. Take the inner product of functions to be $\int_{-1}^{1} f(x)g(x)\,dx$:

- The original basis is not perpendicular: $\int_{-1}^{1} 1 \cdot x^2\,dx = \frac{2}{3}$ and $\int_{-1}^{1} x \cdot x^3\,dx = \frac{2}{5}$, neither of which is 0.
- The Legendre polynomials are pairwise perpendicular: for this article, $1, L_1, \dots, L_5$ were multiplied in pairs and integrated, and every pair of different ones gives 0.

The handout calls this basis 'orthonormal basis functions'. Computed directly from the formulas the handout lists, the inner product of each one with itself is $\int_{-1}^{1} L_q(x)^2\,dx = \frac{2}{2q+1}$ (for $q = 0$ to $5$, in order, $2, \frac{2}{3}, \frac{2}{5}, \frac{2}{7}, \frac{2}{9}, \frac{2}{11}$), which is not 1. So strictly speaking these formulas are orthogonal, and each still has to be multiplied by a constant to have unit length. This does not affect the point the handout is making: they are perpendicular to one another.

How much the same function is penalized under the two bases differs a great deal. Take $h(x) = L_4(x)$:

| Basis | Coefficients | $\sum_q w_q^2$ |
|---|---|---|
| Legendre | $w_4 = 1$, the rest 0 | $1$ |
| Original polynomials | $w_0 = \frac{3}{8}$, $w_2 = -\frac{30}{8}$, $w_4 = \frac{35}{8}$ | $\frac{9 + 900 + 1225}{64} \approx 33.3$ |

It is the same curve, but written in the original basis its weight decay penalty is 33 times as large. $L_5$ is more extreme, at $142$ to $1$. The advice in the lecture: this is only a supplementary detail, but remember that when you later do polynomial regression with regularization, Legendre polynomials will work better.

### Fun Time: when the regularized solution equals the original one

**Question (page 13):** When would $\mathbf{w}_{\text{REG}}$ equal $\mathbf{w}_{\text{LIN}}$?

1. $\lambda = 0$
2. $C = \infty$
3. $C \ge \lVert\mathbf{w}_{\text{LIN}}\rVert^2$
4. all of the above

**Answer: 4.** The handout says choices 1 and 2 shall be easy, and that choice 3 means there is effectively no constraint on $\mathbf{w}$.

- Choice 1: when $\lambda = 0$, $E_{\text{aug}} = E_{\text{in}}$, and the $\lambda\mathrm{I}$ in the closed-form solution disappears too, leaving $\mathbf{w}_{\text{LIN}}$. In the lecture, Lin says this is like covering up the regularizer.
- Choice 2: when $C = \infty$, $\mathcal{H}(\infty) = \mathcal{H}_{10}$ and there is no constraint.
- Choice 3: $C \ge \lVert\mathbf{w}_{\text{LIN}}\rVert^2$ says that $\mathbf{w}_{\text{LIN}}$ itself satisfies the constraint. It has the smallest $E_{\text{in}}$ among all $\mathbf{w}$ and it is feasible, so it is also the smallest among the feasible ones. The way the lecture puts it, the red ball is large enough to contain $\mathbf{w}_{\text{LIN}}$.

Choice 2 is in fact a special case of choice 3. Applied to the numerical example: $\lVert\mathbf{w}_{\text{LIN}}\rVert^2 = 4.25$, so $C = 5$ and $C = 100$ both give $(2, 0.5)$, and the corresponding $\lambda$ is 0 in both cases; the constraint starts to matter only when $C$ drops below $4.25$. The handout writes the range of $\lambda$ as "$\lambda > 0$ or $\lambda = 0$", and this shows why $\lambda = 0$ has to be included: a whole range of $C$ maps to the same $\lambda = 0$.

## What regularization corresponds to in VC theory: the effective VC dimension

```youtube
url: https://www.youtube.com/watch?v=15JB2o4VUeY
title: Regularization :: Regularization and VC Theory @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–01:52 covers the two formulations and the VC guarantee, 01:52–05:00 puts the augmented error and the VC bound side by side, 05:00–07:42 covers the effective VC dimension, and Fun Time follows.)

### Not confined to H(C), yet getting its guarantee

The second part of Foundations (Why Can Machines Learn?) ended with the VC bound: $E_{\text{out}}$ is no larger than $E_{\text{in}}$ plus a price for model complexity. This section asks how regularization relates to that theory.

Page 14 draws three boxes:

| Box | Content |
|---|---|
| Upper left: regularization by constrained minimization | $\min_{\mathbf{w}} E_{\text{in}}(\mathbf{w})$ s.t. $\mathbf{w}^\top\mathbf{w} \le C$ |
| Upper right: its VC guarantee | $E_{\text{out}}(\mathbf{w}) \le E_{\text{in}}(\mathbf{w}) + \Omega(\mathcal{H}(C))$ |
| Lower left: minimizing the augmented error | $\min_{\mathbf{w}} E_{\text{aug}}(\mathbf{w}) = E_{\text{in}}(\mathbf{w}) + \frac{\lambda}{N}\mathbf{w}^\top\mathbf{w}$ |

An arrow goes from the upper left to the upper right: if you really pick hypotheses only from $\mathcal{H}(C)$, the complexity in the VC bound is computed with that of $\mathcal{H}(C)$, which is smaller than that of the whole $\mathcal{H}$. Between the upper left and the lower left is a two-way arrow labeled $C$ equivalent to some $\lambda$, the conclusion of "Another angle: minimizing the augmented error" above.

What we actually do is the lower-left one. In the lecture, Lin calls this being lazy: set a $\lambda$ and solve, without going back to work out what $C$ it corresponds to. The handout's conclusion is: minimizing $E_{\text{aug}}$: indirectly getting VC guarantee without confining to $\mathcal{H}(C)$. The lecture explains what "indirectly" means: there is no constraint during optimization, so every $\mathbf{w}$ is under consideration, but each $\mathbf{w}$ carries an extra penalty that says which ones are liked and which are not; the $\mathbf{w}$ finally chosen falls in some $\mathcal{H}(C)$, and the guarantee in the upper right speaks about that $\mathcal{H}(C)$.

### Two Ωs: one measures a hypothesis, one measures a hypothesis set

Page 15 puts two formulas side by side:

$$
E_{\text{aug}}(\mathbf{w}) = E_{\text{in}}(\mathbf{w}) + \frac{\lambda}{N}\mathbf{w}^\top\mathbf{w} \qquad\qquad E_{\text{out}}(\mathbf{w}) \le E_{\text{in}}(\mathbf{w}) + \Omega(\mathcal{H})
$$

Both sides are $E_{\text{in}}$ plus a term, and the added terms are different:

- The regularizer $\mathbf{w}^\top\mathbf{w}$ measures how complex **a single hypothesis** is. The lecture thinks of it with polynomials: a high-order polynomial is wiggly and a low-order one is smooth, and this term speaks about how complex the curve represented by $\mathbf{w}$ is in itself.
- The $\Omega(\mathcal{H})$ of the VC bound measures how complex **the whole hypothesis set** is; the handout calls it the generalization price. In the lecture, Lin says it stands for how many choices there are.

The lecture notes that the symbol is being overloaded here: the regularizer is written $\Omega(\mathbf{w})$ as well, and $\Omega$ is used for everything that is a complexity. The handout continues: if $\frac{\lambda}{N}\Omega(\mathbf{w})$ 'represents' $\Omega(\mathcal{H})$ well, then $E_{\text{aug}}$ is a better proxy of $E_{\text{out}}$ than $E_{\text{in}}$. The reason given in the lecture: a very complex polynomial should, in some sense, live in a very complex hypothesis set, so the two kinds of complexity are related.

The handout splits the benefit of minimizing $E_{\text{aug}}$ into two lines:

- (heuristically) operating with the better proxy: doing the work with a better stand-in.
- (technically) enjoying flexibility of whole $\mathcal{H}$: still free to choose within the whole $\mathcal{H}$.

The lecture states explicitly that the first line is a heuristic and not mathematics; it only compares where the two formulas look alike. This article adds a reminder as well: this does not say that $E_{\text{aug}}$ is an upper bound on $E_{\text{out}}$.

### How much is actually used: the effective VC dimension

Page 16 asks from another angle: when you regularize, how much of the price for model complexity do you actually pay? Write the problem in a general form, with the dimension after the transform written $\tilde{d}$:

$$
\min_{\mathbf{w} \in \mathbb{R}^{\tilde{d}+1}} E_{\text{aug}}(\mathbf{w}) = E_{\text{in}}(\mathbf{w}) + \frac{\lambda}{N}\Omega(\mathbf{w})
$$

The handout answers in three lines:

1. **Counted by the rules**: $d_{\text{VC}}(\mathcal{H}) = \tilde{d} + 1$. Every $\mathbf{w}$ is considered during minimization (the handout writes all considered), so the hypothesis set is the whole $\mathcal{H}$.
2. **What is actually needed** is only $\mathcal{H}(C)$, with the $C$ equivalent to $\lambda$. The way the lecture puts it: it looks like everything is considered, but only a few $\mathbf{w}$ end up near the valley bottom, the ones inside $\mathcal{H}(C)$.
3. **So** $d_{\text{VC}}(\mathcal{H}(C))$ is called the effective VC dimension and written $d_{\text{EFF}}(\mathcal{H}, \mathcal{A})$. $\mathcal{A}$ is the algorithm, which here is "minimize $E_{\text{aug}}$".

The point is that $d_{\text{EFF}}$ takes two arguments. Model complexity used to be measured by the hypothesis set alone; in the lecture, Lin says the hypothesis set and the algorithm now have to be looked at as one package, by how the algorithm chooses within the hypothesis set and how much of its power it actually uses. If the algorithm puts on the brakes in there (adding a regularizer is putting on the brakes), the VC dimension it uses may be smaller than that of the whole hypothesis set, and generalization may improve with it.

The handout's explanation of regularization is these three lines:

$$
d_{\text{VC}}(\mathcal{H}) \text{ large, while } d_{\text{EFF}}(\mathcal{H}, \mathcal{A}) \text{ small if } \mathcal{A} \text{ regularized}
$$

The lecture calls this a "conceptual" definition. The handout gives no formula for computing $d_{\text{EFF}}$, and no proof that the inequality still holds once it is substituted into the VC bound.

### Back to the three-point example

What follows is an addition in this article. In the earlier example $\mathcal{H}$ is all lines $w_0 + w_1 x$, and the price counted by the rules is fixed, independent of $\lambda$. The set actually used, however, shrinks with $\lambda$:

| $\lambda$ | The set containing the chosen $\mathbf{w}_{\text{REG}}$ |
|---|---|
| $0$ | $\mathcal{H}(4.25)$, in effect the whole $\mathcal{H}$ |
| $1$ | $\mathcal{H}(2.361)$ |
| $3$ | $\mathcal{H}(1.04)$ |
| $10$ | $\mathcal{H}(0.22)$ |

$\mathcal{H}(0.22) \subset \mathcal{H}(1.04) \subset \mathcal{H}(2.361) \subset \mathcal{H}(4.25)$, each smaller than the next. By $\mathcal{H}(0.22)$, the absolute value of the slope $w_1$ cannot exceed $\sqrt{0.22} \approx 0.47$, and the same holds for the intercept; all that can still be drawn is a small bunch of gentle lines close to $y = 0$. "All lines" and "this small bunch of lines" sit in the same $\mathcal{H}$, and what the handout is saying is that the complexity of the latter is the price actually paid.

The handout gives no number for $d_{\text{EFF}}$. Statistics has a separate, commonly used quantity for ridge regression called the effective degrees of freedom, defined as $\operatorname{tr}\big(\mathrm{Z}(\mathrm{Z}^\top\mathrm{Z} + \lambda\mathrm{I})^{-1}\mathrm{Z}^\top\big)$. It is not the same definition as the handout's $d_{\text{EFF}}$; it is borrowed here only to see that "the effective number of parameters decreases continuously". In this example it equals $\frac{3}{3+\lambda} + \frac{2}{2+\lambda}$: at $\lambda = 0$ it is 2, exactly the number of coefficients; at $\lambda = 1$ it is $\frac{17}{12} \approx 1.42$; at $\lambda = 3$ it is $0.9$; and at $\lambda = 10$ it is about $0.40$.

### Fun Time: what happens to the effective VC dimension as λ grows

**Question (page 17):** Consider the weight-decay regularization with regression. When increasing $\lambda$ in $\mathcal{A}$, what would happen with $d_{\text{EFF}}(\mathcal{H}, \mathcal{A})$?

1. $d_{\text{EFF}}$ ↑
2. $d_{\text{EFF}}$ ↓
3. $d_{\text{EFF}} = d_{\text{VC}}(\mathcal{H})$ and does not depend on $\lambda$
4. $d_{\text{EFF}} = 1126$ and does not depend on $\lambda$

**Answer: 2.** The handout's answer is a chain of equivalences:

$$
\text{larger } \lambda \iff \text{smaller } C \iff \text{smaller } \mathcal{H}(C) \iff \text{smaller } d_{\text{EFF}}
$$

The first relation was seen in the table that sweeps over $\lambda$ in the numerical example: as $\lambda$ goes from 0 to 10, the equivalent $C$ drops from $4.25$ to $0.22$. With a smaller $C$, $\mathcal{H}(C)$ is a smaller ball whose hypotheses are a part of the original ones; when a hypothesis set gets smaller, its VC dimension does not get larger.

Choice 1 has the direction backward. The $d_{\text{VC}}(\mathcal{H})$ in choice 3 is the number counted by the rules, and it really does not depend on $\lambda$, but it is not $d_{\text{EFF}}$; the two are equal only when $\lambda = 0$, with no regularization at all. The 1126 in choice 4 is a number this course often uses in examples ($\mathcal{H}(1126)$ is another one) and has no basis whatsoever.

## Other regularizers: three directions for choosing, L1 and L2, and how large λ should be

```youtube
url: https://www.youtube.com/watch?v=PeQeKeeGu3A
title: Regularization :: General Regularizers @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–05:18 covers the three directions for choosing a regularizer, 05:18–09:32 compares L2 and L1, 09:32–11:43 looks at the optimal λ, 11:43–12:19 is Fun Time, and the summary follows.)

### Three directions for choosing a regularizer

Everything so far has used $\mathbf{w}^\top\mathbf{w}$. Page 18 asks: if we switch to a more general $\Omega(\mathbf{w})$, what principles are there? The handout opens with: want: constraint in the 'direction' of target function. The way the lecture puts it, the best constraint would of course be knowing the target function directly, but in machine learning that is exactly what you do not know; one step back, if someone can tell you roughly which direction the good hypotheses lie in, narrowing the range toward there is also very good.

The handout lists three ways to choose:

| Choice | Meaning | The handout's example |
|---|---|---|
| target-dependent | If you know some properties of the target function, put them in | Symmetry regularizer $\sum_q \llbracket q \text{ is odd} \rrbracket\, w_q^2$ |
| plausible | Pick a direction you can convince yourself of: toward smoother or simpler hypotheses | Sparsity (L1) regularizer $\sum_q \lvert w_q \rvert$ |
| friendly | Easy to optimize | Weight-decay (L2) regularizer $\sum_q w_q^2$ |

**target-dependent.** The example in the lecture: if you believe the target is an even function or very close to one, press down only the coefficients of the odd powers, and let the coefficients of the even powers grow a bit. This article adds why this is right: an even function satisfies $h(x) = h(-x)$; in a polynomial, the even-power terms have this property and the odd-power terms change sign, so a polynomial that is an even function has only even-power terms.

**plausible.** Under this item the handout gives the reason on a gray background: stochastic/deterministic noise both non-smooth. The lecture ties it back to the previous lecture: regularization is used against overfitting, overfitting comes from noise, and both kinds of noise jump around and are not smooth; the target function should be smooth relative to the noise, so choose smooth hypotheses more often. L1 is covered in detail in the second half of this section, and in the lecture, Lin says it is fairly useful in practice.

**friendly.** Weight decay belongs to this class. In the lecture, Lin says it only adds a squared term, so the whole optimization problem stays about the same as the original.

What if you pick a bad regularizer? The handout writes: bad? no worries, guard by $\lambda$. The explanation in the lecture is that the regularizer is multiplied by $\lambda$, so as long as $\lambda = 0$ is among the candidates, the worst case is not using it at all. That is the last line of protection.

The bottom of the page has a comparison, and the handout asks "ringing a bell?" In the lecture, Lin says that when [Foundations Lecture 8: Noise and Error Measures](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-08-noise-and-error-en) chose an error measure there were three possibilities: the user tells us what they want, we pick one we can convince ourselves of, or we pick one that is easy to optimize. The two sides follow the same scheme:

| | Three ways to choose |
|---|---|
| Error measure | user-dependent, plausible, friendly |
| Regularizer | target-dependent, plausible, friendly |

The handout writes the augmented error as error $\widehat{\text{err}}$ + regularizer $\Omega$. Each of the two parts of $E_{\text{aug}}$ has three ways to be chosen, and in the lecture, Lin says these are three important aspects of designing a machine learning algorithm.

### L2 and L1: a circle and a diamond

Page 19 puts the two regularizers side by side, each with a geometric figure.

| | L2 regularizer | L1 regularizer |
|---|---|---|
| Formula | $\Omega(\mathbf{w}) = \sum_{q=0}^{Q} w_q^2 = \lVert\mathbf{w}\rVert_2^2$ | $\Omega(\mathbf{w}) = \sum_{q=0}^{Q} \lvert w_q \rvert = \lVert\mathbf{w}\rVert_1$ |
| Convexity | Convex | Convex |
| Differentiability | Differentiable everywhere | Not differentiable everywhere |
| Characteristic | Easy to optimize | Sparsity in solution |
| Shape of the constraint (two dimensions) | Circle $\mathbf{w}^\top\mathbf{w} = C$ | Diamond $\lVert\mathbf{w}\rVert_1 = C$ |

The left figure is the same as on page 9. The right figure replaces the red circle with a red diamond whose four vertices are on the coordinate axes. In the lecture, Lin says the graph of the absolute value function is pointed, with its point at $w_q = 0$, where it is not differentiable, so L1 is somewhat harder to solve than L2; it is still convex, though.

The $\mathbf{w}$ in the right figure is drawn on an edge of the diamond, not at a vertex. Whether it is the optimal solution is decided by the same check: is the negative gradient parallel to the normal vector of the boundary? The red arrow in the figure is labeled sign, and in the lecture, Lin says the direction perpendicular to this edge is the vector you get by taking the sign of each component of $\mathbf{w}$. An example added in this article: the edge where both components are positive is $w_0 + w_1 = C$, every point on it has signs $(+, +)$, and the normal vector is $(1, 1)$.

This is where the difference lies. This article spells it out a little more: every point on the circle has a different normal vector, so wherever $-\nabla E_{\text{in}}$ points, some point on the circle has a normal vector parallel to it. A whole edge of the diamond has only one normal vector, and $-\nabla E_{\text{in}}$ would have to point exactly in the direction $(1, 1)$, which rarely happens. The way the lecture puts it: on an edge, the negative gradient is usually not parallel to the normal vector, so there is always a green component pulling $\mathbf{w}$ along the edge, and it stops only at a vertex. A vertex is on a coordinate axis, which means some $w_q$ are 0. So the optimal solution with L1 often occurs at a vertex, and what you get is a sparse solution.

The handout's conclusion is L1 useful if needing sparse solution. The lecture uses a phone as the example: train a 1126-dimensional $\mathbf{w}$, and by the time the phone has computed every dimension its battery is gone; if only five of them are nonzero, the phone computes just five terms, which is faster and saves power.

### Comparing L1 and L2 on the same data

What follows is a calculation made up for this article, not from the slides, reusing the three data points from before. First complete the square in $E_{\text{in}}$. Expand directly:

$$
E_{\text{in}}(\mathbf{w}) = \frac{1}{3}\Big[(w_0 - w_1 - 1)^2 + (w_0 - 3)^2 + (w_0 + w_1 - 2)^2\Big] = \frac{1}{3}\Big[3w_0^2 + 2w_1^2 - 12w_0 - 2w_1 + 14\Big]
$$

Then complete the squares:

$$
E_{\text{in}}(\mathbf{w}) = \frac{1}{2} + \frac{1}{3}\Big[3(w_0 - 2)^2 + 2\big(w_1 - \tfrac{1}{2}\big)^2\Big]
$$

This is the valley: its bottom is at $\mathbf{w}_{\text{LIN}} = (2, \tfrac{1}{2})$ with height $\tfrac{1}{2}$, and the contour lines are ellipses. $w_0$ and $w_1$ have no cross term, so after adding the L1 regularizer $\frac{\lambda}{3}(\lvert w_0 \rvert + \lvert w_1 \rvert)$, the two coefficients can be minimized separately. Look at the $w_1$ part alone (multiplying by 3 does not move the minimizer):

$$
2\big(w_1 - \tfrac{1}{2}\big)^2 + \lambda\lvert w_1 \rvert
$$

- If the minimizer is at $w_1 > 0$, then $\lvert w_1 \rvert = w_1$ there, and differentiating gives $4(w_1 - \tfrac{1}{2}) + \lambda = 0$, so $w_1 = \tfrac{1}{2} - \tfrac{\lambda}{4}$. This answer counts only if it is positive, that is, if $\lambda < 2$.
- When $\lambda \ge 2$, the derivative on the $w_1 > 0$ part is always positive, so the value gets smaller toward 0; on the $w_1 < 0$ part both terms get smaller toward 0. The minimizer is at $w_1 = 0$.

The same goes for $w_0$: $w_0 = 2 - \tfrac{\lambda}{6}$, which becomes 0 only when $\lambda \ge 12$. Put next to the L2 solution $\big(\tfrac{6}{3+\lambda}, \tfrac{1}{2+\lambda}\big)$:

| $\lambda$ | L2 solution | L1 solution |
|---|---|---|
| $1$ | $(1.5, 0.333)$ | $(1.833, 0.25)$ |
| $3$ | $(1, 0.2)$ | $(1.5, 0)$ |
| $10$ | $(0.462, 0.083)$ | $(0.333, 0)$ |

L2 multiplies each coefficient by a ratio; however large $\lambda$ gets, the coefficient only gets closer and closer to 0 and is never exactly 0. L1 moves each coefficient toward 0 by a distance that does not depend on the size of the coefficient (here $w_0$ moves $\tfrac{\lambda}{6}$ and $w_1$ moves $\tfrac{\lambda}{4}$), so the already small $w_1$ is quickly moved to 0 and then stays there. At $\lambda = 3$ the L1 solution is $(1.5, 0)$, the hypothesis becomes the horizontal line $y = 1.5$, and the slope term is gone entirely. That is sparsity. For this article, the L1 minimizer at $\lambda = 2$ was also checked with a grid search; it lands at $(1.67, 0)$, in agreement with the formula's $(\tfrac{5}{3}, 0)$.

### How large λ should be: it depends on how much noise there is

Page 20 has two figures from experiments. The horizontal axis of both is $\lambda$ (0 to 2), the vertical axis is the expected $E_{\text{out}}$, and a dot marks the lowest position on each curve.

| | Three curves | Position of the lowest point |
|---|---|---|
| Left figure, stochastic noise | $\sigma^2 = 0$, $0.25$, $0.5$ | $\sigma^2 = 0$ is at $\lambda = 0$; the larger $\sigma^2$, the further right the lowest point |
| Right figure, deterministic noise | $Q_f = 15$, $30$, $100$ | $Q_f = 15$ is at $\lambda = 0$; the larger $Q_f$, the further right the lowest point |

(Reading the figures by eye, the lowest points for $\sigma^2 = 0.25$ and $Q_f = 30$ are both a little past $\lambda = 0.5$, and those for $\sigma^2 = 0.5$ and $Q_f = 100$ are just over $\lambda = 1$; the handout lists no numbers.)

$\sigma^2$ is the variance of the stochastic noise and $Q_f$ is the order of the target polynomial; both are notation from the previous lecture. The lecture explains that the right figure learns with a 15th-order polynomial, so the $Q_f = 15$ curve has no deterministic noise, $Q_f = 30$ has some, and $Q_f = 100$ has a lot.

The handout draws two conclusions:

- more noise ⟺ more regularization needed. The handout ties this back to the driving analogy of the previous lecture: more bumpy road ⟺ putting brakes more.
- noise unknown: how much noise there is cannot be known in advance, so it is important to make proper choices.

The way the lecture puts it, you have to pick the best one out of many values of $\lambda$ for regularization to do its job. How to pick is left to the next lecture, which the lecture previews as teaching not only how to choose $\lambda$ but also how to choose the transform $\boldsymbol{\Phi}$ and which linear model to use.

### Fun Time: a different penalty on every term

**Question (page 21):** Consider using a regularizer $\Omega(\mathbf{w}) = \sum_{q=0}^{Q} 2^q w_q^2$ to work with Legendre polynomial regression. Which kind of hypothesis does the regularizer prefer?

1. symmetric polynomials satisfying $h(x) = h(-x)$
2. low-dimensional polynomials
3. high-dimensional polynomials
4. no specific preference

**Answer: 2.** The handout's answer: there is a higher 'penalty' for higher-order terms, and hence the regularizer prefers low-dimensional polynomials. (The slide's low-dimensional and high-dimensional mean low-order and high-order polynomials.)

The multiplier in front of each $w_q^2$ is $2^q$: 1 for $q = 0$, 2 for $q = 1$, 32 for $q = 5$, and 1024 for $q = 10$. A coefficient of the same size costs 1024 times as much on $L_{10}$ as on the constant term. To keep $E_{\text{aug}}$ small, the cheapest thing to do is press the coefficients of the high-order terms very small, and the chosen hypothesis ends up close to a low-order polynomial. The way the lecture puts it, a very heavy regularization has been placed on the high-order part.

Choice 1 corresponds to the symmetry regularizer that penalizes only the odd-order terms; this question penalizes odd and even orders alike, so it has no preference for symmetry. Choice 3 has the direction backward. Choice 4 is wrong because the multiplier differs from term to term; there would be no preference only if they were all 1, and that is weight decay again. This article adds: the question demonstrates how to write a preference into $\Omega$. If you want low-order, simpler hypotheses, raise the multipliers on the high-order terms; in the classification on page 18 of the handout, moving toward simpler hypotheses belongs to the plausible class.

### The lecture in four sentences

The summary on page 22 reduces each of the four sections to one line:

1. Regularized Hypothesis Set: the original $\mathcal{H}$ plus a constraint.
2. Weight Decay Regularization: add $\frac{\lambda}{N}\mathbf{w}^\top\mathbf{w}$ in $E_{\text{aug}}$.
3. Regularization and VC Theory: regularization decreases $d_{\text{EFF}}$.
4. General Regularizers: target-dependent, plausible, or friendly.

The preview of the next lecture is choosing from the so-many models/parameters.

## Self-check

**1. Two data points: $x_1 = -1$, $y_1 = 0$; $x_2 = 1$, $y_2 = 2$. Do weight-decay linear regression with $\mathbf{z} = (1, x)$ and $\lambda = 2$. Compute $\mathbf{w}_{\text{REG}}$, $E_{\text{in}}$, and $E_{\text{aug}}$, and compare with $\lambda = 0$.**

Answer: $\mathrm{Z}^\top\mathrm{Z} = \begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix}$ and $\mathrm{Z}^\top\mathbf{y} = (2, 2)$. At $\lambda = 0$, $\mathbf{w}_{\text{LIN}} = (1, 1)$, the line $1 + x$ passes through both points, and $E_{\text{in}} = 0$. At $\lambda = 2$, $\mathbf{w}_{\text{REG}} = (\tfrac{2}{4}, \tfrac{2}{4}) = (\tfrac{1}{2}, \tfrac{1}{2})$, the two predictions are $0$ and $1$, and $E_{\text{in}} = \frac{1}{2}(0 + 1) = \frac{1}{2}$; $\mathbf{w}^\top\mathbf{w} = \frac{1}{2}$, and $E_{\text{aug}} = \frac{1}{2} + \frac{2}{2} \times \frac{1}{2} = 1$.

**2. Continuing from the previous question, the user gives $C$ instead of $\lambda$. What $\lambda$ corresponds to $C = \frac{8}{9}$? What about $C = 5$?**

Answer: $\mathbf{w}_{\text{REG}} = \frac{2}{2+\lambda}(1, 1)$, and its squared length is $\frac{8}{(2+\lambda)^2}$. Setting it equal to $\frac{8}{9}$ gives $(2 + \lambda)^2 = 9$, so $\lambda = 1$. $\lVert\mathbf{w}_{\text{LIN}}\rVert^2 = 2$, so $C = 5$ already contains $\mathbf{w}_{\text{LIN}}$ in the ball, the constraint does nothing, and $\lambda = 0$.

**3. Someone says: "When you minimize the augmented error, every w can be chosen, so the hypothesis set is still the whole H, the VC dimension is still d̃ + 1, and regularization does not help generalization." Which part of this is right, and where is the problem?**

Criterion: the answer should say that the first half is right, since $d_{\text{VC}}(\mathcal{H})$ really is $\tilde{d} + 1$; the problem is that it looks only at the hypothesis set and not at how the algorithm chooses. Once $\lambda$ is given, the chosen $\mathbf{w}$ falls in some $\mathcal{H}(C)$, and the handout uses $d_{\text{EFF}}(\mathcal{H}, \mathcal{A})$ for this complexity actually paid, which is smaller than $d_{\text{VC}}(\mathcal{H})$ and gets smaller as $\lambda$ gets larger. Better still if the answer adds that the handout gives only a conceptual definition and no formula.

**4. There is a single coefficient $w$. Minimize $(w - 0.3)^2 + w^2$ and $(w - 0.3)^2 + \lvert w \rvert$ separately. What do you get for each? What difference between L1 and L2 does this show?**

Answer: for the first, the derivative gives $2(w - 0.3) + 2w = 0$, so $w = 0.15$. For the second, when $w > 0$ the derivative is $2(w - 0.3) + 1 = 2w + 0.4$, always positive, so the value decreases toward 0; when $w < 0$ both terms decrease toward 0; the minimizer is $w = 0$. L2 shrinks $0.3$ to half but not to 0, and L1 gives 0 outright.

**5. Represent $h(x) = L_3(x) = \frac{1}{2}(5x^3 - 3x)$ in the Legendre basis and in the original polynomial basis. What is the weight decay $\sum_q w_q^2$ in each? How does this relate to "high powers of x are small"?**

Answer: in the Legendre basis only $w_3 = 1$, and the sum of squares is 1. In the original basis $w_1 = -\frac{3}{2}$ and $w_3 = \frac{5}{2}$, and the sum of squares is $\frac{9}{4} + \frac{25}{4} = 8.5$. For $x \in [-1, 1]$ the absolute value of $x^3$ is never larger than that of $x$, and over the middle stretch it is far smaller, so to make up a function value of the same size the high-order term needs a larger coefficient, and it is penalized more heavily as a result.

## Exercises and corresponding reading

**Correspondence across two semesters.** The [Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) schedules Foundations Lectures 13 and 14 in the same week (W7, 10/14), and the slides for this lecture are [14u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/14u_handout.pdf). The [Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) also places it in W7 (10/21); when checked on 2026-09-30 the slide link for that week was still a 404, so this article uses only the MOOC handout.

**Textbook.** Both course pages map this lecture to Section 4.2 of [Learning from Data](http://amlbook.com) (LFD).

**Homework.** None of the questions below has an official solution. [Fall 2024 HW4](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf) was released on 2024-10-21 and due on 11-04, and [HW5](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw5/hw5.pdf) was released on 11-04 and due on 11-18.

| Homework | Question | Content | Where it connects to this lecture |
|---|---|---|---|
| HW4 | Q9 | Generate virtual examples by adding Gaussian noise to the inputs and derive the form of the expected value of a matrix; a note in the question points out its relation to the matrix that regularized linear regression inverts | The data hinting of the previous lecture connects to this lecture's $\mathrm{Z}^\top\mathrm{Z} + \lambda\mathrm{I}$ |
| HW5 | Q1 | Write additive smoothing as an estimation problem with a regularizer and find $\Omega(w_0)$ | General regularizers |
| HW5 | Q5 | Prove that linear regression with particular virtual examples added has the same solution as a weighted L2 regularization | Derivation of the closed-form solution |
| HW5 | Q6 | Under the second-order Taylor approximation of $E_{\text{in}}$, find how the L2-regularized solution relates to $\lambda$, $N$, the Hessian, and $\mathbf{w}^*$ | The parallel condition and the closed-form solution |
| HW5 | Q10 | Use LIBLINEAR (`-s 6`) to run L1-regularized logistic regression on the 2-versus-6 subproblem of mnist.scale, choose $\lambda$ by $E_{\text{in}}$, repeat 1126 times, and plot histograms of $E_{\text{out}}$ and of the number of nonzero weights | L1 and sparse solutions |
| HW5 | Q13 (bonus) | The closed-form coordinate descent update for the elastic net | L1 plus L2 |

Q6 can be tried first on this article's three data points: the $E_{\text{in}}$ of linear regression is already a quadratic function, so the Taylor approximation has no error. The Hessian in this example is $\frac{2}{N}\mathrm{Z}^\top\mathrm{Z}$, with $2$ and $\tfrac{4}{3}$ on the diagonal, and $\mathbf{w}^* = (2, \tfrac{1}{2})$; substituting into the formula you derive should give $\big(\tfrac{6}{3+\lambda}, \tfrac{1}{2+\lambda}\big)$.

The data set [mnist.scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/multiclass/mnist.scale.bz2) and the tool [LIBLINEAR](https://www.csie.ntu.edu.tw/~cjlin/liblinear/) are both public. Q10 asks you to read the README yourself and work out how LIBLINEAR's parameter C converts to the $\lambda$ of the lecture, and that step is itself part of the exercise. With no official solution, you can check yourself this way: when $\lambda$ is chosen by $E_{\text{in}}$, the choice usually lands on one of the smaller values of $\lambda$ among the candidates, because the weaker the regularization, the easier it is to get $E_{\text{in}}$ low (this article's table shows the same thing); if your results overwhelmingly choose the largest $\lambda$, check the direction of the conversion first. Q10 deliberately chooses $\lambda$ by $E_{\text{in}}$; the following Q11 and Q12 switch to a validation set and 3-fold cross validation, and those two questions belong to the next lecture. The guide to the whole assignment is in the [Foundations homework guide](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide-en).

**Hands-on.** Take whichever linear model you have at hand, sweep the L2 coefficient upward from 0, multiplying by 100 each time, plot the training error and the validation error in the same figure, and see whether the change across the four figures on page 11 of the handout shows up again on your data.

**Further reading.** Other treatments of the same topic: [Stanford CS229 Lecture 6: Bias and Variance, Regularization, and Model Selection](/posts/ai/2026-10-12-stanford-cs229-lecture-06-bias-variance-regularization-en) and [Why Do Ridge, Lasso, and Weight Decay Make Models More Stable?](/posts/learning/2026-08-29-im-stat-regularization-en). For regularization in deep learning, see [MIT 6.7960: Regularization](/posts/tech/2026-08-30-mit-67960-regularization-en). Techniques comes back to this lecture twice: [Techniques Lecture 2: Dual SVM](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-02-dual-svm-en) turns the Lagrange multiplier from a given parameter into an unknown to solve for, and [Techniques Lecture 5: Kernel Logistic Regression](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-logistic-support-vector-regression-en) looks at the SVM again from the viewpoint of regularization.

**Next lecture.** [Foundations Lecture 15: Validation](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles-en) answers the question this lecture leaves open: the amount of noise is unknown, so how should $\lambda$ be chosen?

## Course video sources

Original videos: [Regularized Hypothesis Set](https://www.youtube.com/watch?v=Sno7I5slFUA), [Weight Decay Regularization](https://www.youtube.com/watch?v=idWnPdW9znM), [Regularization and VC Theory](https://www.youtube.com/watch?v=15JB2o4VUeY), [General Regularizers](https://www.youtube.com/watch?v=PeQeKeeGu3A)

- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

Checked: 2026-10-13. The video IDs, titles, and lengths were taken from the official playlist that day; the videos have no caption track on YouTube, and what this article reports from the lecture comes from transcripts made for it.

## Update Log

- 2026-10-13: The series now has one article per lecture; this lecture is a newly split-out article, written from the handout and the video transcripts.

## References

- [Foundations Lecture 14 handout, 14_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/14_handout.pdf): the main source for this article. The derivations in the four sections, the four Fun Time questions, and the figures on pages 2, 9, 11, 12, 19, and 20 all come from this handout.
- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf): the IDs and titles of the four videos; what the text reports as said "in the lecture" is paraphrased from machine transcripts of these four videos.
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/): the official entry for handouts and recordings.
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/): the corresponding week, the 14u slides, and the LFD chapter.
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/): the corresponding week and LFD chapter.
- [Fall 2024 Homework 4 (hw4_red.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf): the content of Q9.
- [Fall 2024 Homework 5 (hw5.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw5/hw5.pdf): the content of Q1, Q5, Q6, Q10, and Q13.
- [LIBLINEAR](https://www.csie.ntu.edu.tw/~cjlin/liblinear/) and [LIBSVM datasets: mnist.scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/multiclass/mnist.scale.bz2): the tool and data used in HW5 Q10.
- [Learning from Data textbook website](http://amlbook.com): the source of Section 4.2.
- [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques: Course Overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en): where this lecture sits in the whole course and the reading routes.
