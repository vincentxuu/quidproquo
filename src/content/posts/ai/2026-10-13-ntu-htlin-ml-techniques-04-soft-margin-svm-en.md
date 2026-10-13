---
title: "Soft-Margin SVM: Allowing Mistakes and Choosing C | NTU Hsuan-Tien Lin Machine Learning Techniques Lecture 4"
date: 2026-10-13
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, svm, model-selection, cross-validation]
lang: en
math: true
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 21
tldr: "Hard-margin SVM insists on separating the data perfectly, so it fits noise. This lecture gives every point a violation ξₙ and uses the parameter C to trade margin width against total violation, which yields soft-margin SVM; its dual differs from the hard-margin dual only in that αₙ gains the upper bound C. The value of αₙ sorts the data into non-support vectors, free SVs, and bounded SVs, and b is computed from a free SV; C and γ are chosen by cross-validation, and the fraction of support vectors #SV/N is an upper bound on the leave-one-out error."
description: "A guide to Lecture 4 of NTU Hsuan-Tien Lin's Machine Learning Techniques, Soft-Margin Support Vector Machine: the violation ξₙ and the parameter C, the full derivation of the soft-margin dual, computing b from a free SV, the three cases of αₙ, and model selection with cross-validation and the number of support vectors, with a six-point example worked by hand."
draft: false
glossary:
  - term: "soft-margin SVM"
    aliases: ["soft-margin support vector machine"]
    definition: "An SVM that lets some data violate the fat boundary: every point gets a violation ξₙ, and the problem minimizes ½wᵀw + C·Σξₙ."
    context: "The topic of Techniques Lecture 4; it still has a solution when the data cannot be separated perfectly."
  - term: "margin violation"
    aliases: ["ξₙ"]
    definition: "How far yₙ(wᵀzₙ + b) of the n-th point falls short of 1; if it does not fall short, the violation is 0. A value above 1 means the point is misclassified."
    context: "Soft-margin SVM penalizes the sum of the violations, not the number of misclassified points."
  - term: "free SV"
    aliases: ["free support vector"]
    definition: "A support vector with 0 < αₙ < C in soft-margin SVM. Its ξₙ = 0, and it lies exactly on the fat boundary."
    context: "Techniques Lecture 4 uses it to compute the unique b."
  - term: "bounded SV"
    aliases: ["bounded support vector"]
    definition: "A support vector with αₙ = C in soft-margin SVM; its ξₙ equals the amount by which it violates the fat boundary."
    context: "Techniques Lecture 4 uses the value of αₙ to sort the training points into three kinds; only bounded SVs can be misclassified."
---

> 🌏 [中文版](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-04-soft-margin-svm)

**Video status: Videos included.** This article is written from the official MOOC handout [204_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/204_handout.pdf) and transcripts of this lecture's four official videos, with formulas following the handout. The transcripts are machine transcripts made for this article (Whisper), not official captions, and no human has proofread them. The videos are taught in Mandarin; the slides are in English. Each section opens with its official video and the approximate time ranges. Page numbers refer to the number at the lower right of each slide (0/22 to 22/22), and wherever the text says "in the lecture" it is paraphrasing what is said in the video.

This is Techniques Lecture 4 in [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en). The Roadmap on page 1 of the handout divides Techniques into three ways of handling features, and this lecture is still in the first, Embedding Numerous Features: Kernel Models. The same page sums up the previous lecture, [Techniques Lecture 3: Kernel SVM](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm-en), this way: the kernel is a shortcut to (transform + inner product), so the SVM no longer depends on the transformed dimension $\tilde{d}$ and can range from simple linear models all the way to the infinite-dimensional Gaussian kernel. The previous lecture left a warning when it covered the Gaussian kernel: SVM can still overfit. This lecture deals with exactly that.

The prerequisites are the whole derivation in [Techniques Lecture 2: Dual SVM](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-02-dual-svm-en) (the Lagrange function, the partial derivatives with respect to $b$ and $\mathbf{w}$, the KKT conditions, complementary slackness), the kernel function $K(\mathbf{x}, \mathbf{x}')$ from the previous lecture, and cross-validation from [Foundations Lecture 15: Validation](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles-en). After reading, you should be able to write down the soft-margin SVM primal problem and derive its dual on your own, say where the upper bound $C$ on $\alpha_n$ comes from, tell from a solved $\boldsymbol{\alpha}$ where each point lies and which points to compute $b$ from, and explain why the number of support vectors can serve as a safety check in model selection.

The four sections of this lecture answer four questions in order:

1. How to rewrite the problem when the data cannot be separated, or should not be forced apart.
2. What the dual problem looks like after the rewrite.
3. How to compute $b$ once $\boldsymbol{\alpha}$ is solved, and what the value of $\alpha_n$ means.
4. How to choose the extra parameter $C$ (and the kernel's parameters).

## Why allow mistakes: the cost of insisting on separation, the violation ξ, and the parameter C

```youtube
url: https://www.youtube.com/watch?v=K7ZcAYXuU_A
title: Soft-Margin Support Vector Machine :: Motivation and Primal @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–01:12 reviews the previous lecture, 01:12–03:00 covers what is wrong with hard-margin, 03:00–06:39 combines pocket with hard-margin, 06:39–08:54 covers the two problems with the combination, 08:54–13:50 covers the violation and the parameter $C$, and Fun Time follows.)

### What is wrong with hard-margin SVM

Page 2 of the handout splits the previous lecture's warning into two causes. SVM overfits partly because the transform $\boldsymbol{\Phi}$ is too powerful, and partly because hard-margin insists that the data be perfectly separable. On the first cause, Lin says in the lecture that some transforms are so powerful that even a large margin cannot rescue the result.

The page shows two figures drawn from the same data. The left one is labeled $\boldsymbol{\Phi}_1$: a straight line roughly separates the circles from the crosses, with a few points on the wrong side. The right one is labeled $\boldsymbol{\Phi}_4$: after a fourth-order polynomial transform, a boundary that winds back and forth classifies every point correctly. Lin's comment in the lecture is that the left figure looks like a reasonable hypothesis, one line and a few mistakes; if you insist on getting every circle and cross right, you end up with the right figure, and although its boundary is a large-margin one, it is not necessarily the most reasonable explanation of this data.

The handout puts the conclusion in one line: if always insisting on separable (which implies shatter), you have power to overfit to noise. In the lecture, Lin fills in the middle step: being able to separate the data perfectly no matter what combination of circles and crosses arrives is exactly the shatter of [Foundations Lecture 5: Training versus Testing](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function-en); a model that can produce every labeling takes in the noise as well.

### Combining pocket with hard-margin SVM

Page 3 of the handout is titled Give Up on Some Examples: we want to give up on some noisy examples. In the lecture, Lin looks back at how noise was handled before and finds pocket from [Foundations Lecture 2: Perceptrons and PLA](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm-en): when no line separates the data, look for the line with the fewest mistakes instead and let the points it gets wrong go. The two old methods side by side:

| | What it minimizes | Constraints |
|---|---|---|
| pocket | the number of misclassified points $\sum_{n=1}^{N} [\![ y_n \ne \text{sign}(\mathbf{w}^\top\mathbf{z}_n + b) ]\!]$ | none |
| hard-margin SVM | $\frac{1}{2}\mathbf{w}^\top\mathbf{w}$ | $y_n(\mathbf{w}^\top\mathbf{z}_n + b) \ge 1$ for every $n$ |

$[\![\cdot]\!]$ is notation used in Foundations: its value is 1 when the statement inside holds and 0 when it does not. The handout combines the two into one problem:

$$
\begin{aligned}
\min_{b,\mathbf{w}}\quad & \frac{1}{2}\mathbf{w}^\top\mathbf{w} + C\cdot\sum_{n=1}^{N} [\![ y_n \ne \text{sign}(\mathbf{w}^\top\mathbf{z}_n + b) ]\!] \\
\text{subject to}\quad & y_n(\mathbf{w}^\top\mathbf{z}_n + b) \ge 1 \quad \text{for correct } n \\
& y_n(\mathbf{w}^\top\mathbf{z}_n + b) \ge -\infty \quad \text{for incorrect } n
\end{aligned}
$$

Correctly classified points must stay far enough from the boundary, as before. Misclassified points are written as "greater than or equal to negative infinity", which Lin explains in the lecture as no condition at all: leave them alone. Relaxing the constraints is not enough. Lin points out that if mistakes cost nothing, the machine might as well get everything wrong, so the objective has to add the number of mistakes the way pocket does, and avoid mistakes wherever it can.

The objective now has two terms: one wants $\mathbf{w}$ short (a fat boundary), the other wants few mistakes, and the parameter $C$ sets their relative importance. In the handout's words, $C$: trade-off of large margin & noise tolerance. A large $C$ cares more about not making mistakes, and a small $C$ cares more about a wide margin for the points that are classified correctly. In the lecture, Lin calls this new problem the combination of hard-margin SVM and pocket.

### Two problems with the combination

Page 4 of the handout first merges the two constraints into one:

$$
y_n(\mathbf{w}^\top\mathbf{z}_n + b) \ge 1 - \infty\cdot[\![ y_n \ne \text{sign}(\mathbf{w}^\top\mathbf{z}_n + b) ]\!]
$$

The right-hand side is 1 for a correct point and negative infinity for an incorrect one. The page then lists two things wrong with this formulation.

**First, it is not a QP.** $[\![\cdot]\!]$ is a "right or wrong" Boolean operation, not a linear one. [Techniques Lecture 1: Linear SVM](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm-en) said that quadratic programming requires a quadratic objective and linear constraints; now both sides contain something that is neither linear nor quadratic. Lin says in the lecture that this means none of the machinery derived so far, the dual and the kernel, can be used. Lin also mentions that pocket itself is an NP-hard problem, and this combination is just as hard to solve.

**Second, it cannot tell small errors from large ones.** The handout writes small error (slightly away from fat boundary) and large error (a...w...a...y... from fat boundary). The numbers Lin gives in the lecture: one point that should be a circle has score $-0.001$, almost correct; another that should also be a circle has score $-1126$, very far from the boundary. In the formula above, each of these counts as just "one mistake".

### Recording margin violations instead: soft-margin SVM

The fix is to give every point one more variable $\xi_n \ge 0$ that records its margin violation. Lin's definition in the lecture: we want $y_n$ times the score to be at least 1, and $\xi_n$ records how far this point falls short of that 1. Short by a little is a small error; short by a lot is a large one. Then the thing being penalized changes from "how many are wrong" to "how much is violated in total", which the handout calls penalize with margin violation instead of error count:

$$
\begin{aligned}
\min_{b,\mathbf{w},\boldsymbol{\xi}}\quad & \frac{1}{2}\mathbf{w}^\top\mathbf{w} + C\cdot\sum_{n=1}^{N}\xi_n \\
\text{subject to}\quad & y_n(\mathbf{w}^\top\mathbf{z}_n + b) \ge 1 - \xi_n \ \text{ and } \ \xi_n \ge 0 \quad \text{for all } n
\end{aligned}
$$

This is soft-margin SVM. Lin explains the name in the lecture: the requirement on the margin is no longer hard, rigid and not open to change, but soft, allowing some violation. Both problems are taken care of:

- **The constraints are linear.** $y_n(\mathbf{w}^\top\mathbf{z}_n + b) \ge 1 - \xi_n$ is linear in $(b, \mathbf{w}, \xi_n)$, and so is $\xi_n \ge 0$.
- **The objective is quadratic.** As Lin puts it in the lecture, there was already a quadratic in $\mathbf{w}$; adding a linear term in $\xi_n$ gives a quadratic in $(\mathbf{w}, \boldsymbol{\xi})$. So it is still a QP.
- **Large and small errors can be told apart.** Lin says in the lecture that errors are no longer black or white; a gray zone is allowed, and large and small errors are each measured and then added up as the penalty.

The figure on page 5 of the handout draws a green fat boundary with one blue point inside the band, labeled violation, along with the segment from the point to the edge of the band. Lin says in the lecture that this point lies inside the fat boundary, so it is in violation, and its distance to the edge of the fat boundary is the amount of the violation. An addition in this article: strictly speaking, $\xi_n$ is measured in units of the score, and the geometric distance is $\xi_n / \lVert\mathbf{w}\rVert$; the two differ by a fixed factor.

The same page restates what the parameter $C$ means, now as trade-off of large margin & margin violation:

- **Large $C$:** want less margin violation. As Lin puts it in the lecture, better a thinner margin than places that violate it.
- **Small $C$:** want large margin. If many points violate it, so be it.

Finally, count the size of this QP. The variables are $b$, the $\tilde{d}$ components of $\mathbf{w}$, and the $N$ values $\xi_n$, for $\tilde{d}+1+N$ in total. There are two constraints per point, $2N$ in total; Lin says in the lecture that the extra $N$ are the $\xi_n \ge 0$, because a violation is recorded only when there is one and cannot be negative. The variable count still contains $\tilde{d}$, so the next step is the same as in the previous two lectures: derive the dual and get rid of $\tilde{d}$.

### Numerical example: six points that cannot be separated

The following is an example made up for this article, not from the slides; the next three sections keep using it. The data is one-dimensional with no feature transform, $z_n = x_n$:

| $n$ | $x_n$ | $y_n$ |
|---|---|---|
| 1 | $0$ | $-1$ |
| 2 | $3$ | $-1$ |
| 3 | $4$ | $+1$ |
| 4 | $6$ | $-1$ |
| 5 | $7$ | $+1$ |
| 6 | $10$ | $+1$ |

Roughly, negatives are on the left and positives on the right, but points 3 and 4 have swapped places: the positive is at 4 and the negative at 6.

**Hard-margin SVM has no solution.** Point 3 requires $4w + b \ge 1$ and point 4 requires $6w + b \le -1$; subtracting gives $2w \le -2$, that is, $w \le -1$. Point 2 requires $3w + b \le -1$ and point 5 requires $7w + b \ge 1$; subtracting gives $4w \ge 2$, that is, $w \ge \frac{1}{2}$. The two requirements contradict each other, so no $(b, w)$ satisfies all the constraints.

**How the soft-margin objective scores a candidate.** For a given $(b, w)$, each $\xi_n$ must satisfy $\xi_n \ge 1 - y_n(wx_n + b)$ and $\xi_n \ge 0$, and the objective wants it as small as possible, so $\xi_n$ takes the larger of the two lower bounds (this is also the point of this section's Fun Time). Work it out for four candidates:

| Candidate | $(w, b)$ | Boundary | Two edges of the fat boundary | $(\xi_1, \dots, \xi_6)$ | $\sum\xi_n$ | Misclassified |
|---|---|---|---|---|---|---|
| I | $(\frac{1}{2}, -\frac{5}{2})$ | $x = 5$ | $x = 3$, $x = 7$ | $(0, 0, \frac{3}{2}, \frac{3}{2}, 0, 0)$ | $3$ | 2 |
| II | $(1, -5)$ | $x = 5$ | $x = 4$, $x = 6$ | $(0, 0, 2, 2, 0, 0)$ | $4$ | 2 |
| III | $(\frac{1}{5}, -1)$ | $x = 5$ | $x = 0$, $x = 10$ | $(0, \frac{3}{5}, \frac{6}{5}, \frac{6}{5}, \frac{3}{5}, 0)$ | $\frac{18}{5}$ | 2 |
| IV | $(2, -7)$ | $x = 3.5$ | $x = 3$, $x = 4$ | $(0, 0, 0, 6, 0, 0)$ | $6$ | 1 |

Take point 3 under candidate I: $y_3(wx_3 + b) = (+1)(\frac{1}{2}\cdot 4 - \frac{5}{2}) = -\frac{1}{2}$, which is short of 1 by $1 - (-\frac{1}{2}) = \frac{3}{2}$, so $\xi_3 = \frac{3}{2}$. Point 2 under candidate III: $y_2(wx_2 + b) = (-1)(\frac{3}{5} - 1) = \frac{2}{5}$, correctly classified but inside the fat boundary, $\xi_2 = \frac{3}{5}$. A point whose violation is below 1 is still on the correct side; a point whose violation is above 1 has been misclassified.

Now compute $\frac{1}{2}w^2 + C\sum\xi_n$:

| Candidate | $\frac{1}{2}w^2$ | Objective at $C = 1$ | Objective at $C = \frac{1}{20}$ |
|---|---|---|---|
| I | $\frac{1}{8}$ | $\frac{1}{8} + 3 = 3.125$ | $\frac{1}{8} + \frac{3}{20} = 0.275$ |
| II | $\frac{1}{2}$ | $\frac{1}{2} + 4 = 4.5$ | $\frac{1}{2} + \frac{4}{20} = 0.7$ |
| III | $\frac{1}{50}$ | $\frac{1}{50} + \frac{18}{5} = 3.62$ | $\frac{1}{50} + \frac{18}{100} = 0.2$ |
| IV | $2$ | $2 + 6 = 8$ | $2 + \frac{6}{20} = 2.3$ |

**What this result means.**

- At $C = 1$ candidate I has the lowest objective, and at $C = \frac{1}{20}$ candidate III does. The half-width of III's fat boundary is $1/w = 5$, while I's is only 2; III's total violation $\frac{18}{5}$ is more than I's 3. A smaller $C$ buys a fatter boundary at the cost of more violation, the same direction page 5 of the handout describes. These two really are the optimal solutions in their respective settings: this article swept the objective over a grid with spacing $\frac{1}{40}$ in each of $w$ and $b$, and the later passages "Numerical example: the dual problem for the six points" and "Numerical example: b and KKT for the six points" confirm it with the dual solution and the KKT conditions.
- Candidate IV misclassifies only one point, the fewest mistakes possible on this data (with the positive at 4 and the negative at 6, a threshold that predicts negative on the left and positive on the right gets at least one of them wrong wherever it is placed; with positive on the left and negative on the right instead, the four points at the two ends would all be wrong). Yet under soft-margin SVM's scoring it is the worst at both values of $C$: its margin is very thin, and point 4 is very far from where the candidate wants it, $\xi_4 = 6$. Raising $C$ to 100 changes nothing: I is $\frac{1}{8} + 300$ and IV is $2 + 600$. Soft-margin SVM minimizes the sum of the violations, and that is a different goal from "the fewest misclassified points".
- Compare with the combination on page 3 of the handout, the one that counts mistakes: I's objective is $\frac{1}{8} + 2C$ and IV's is $2 + C$. At $C = 1$, I is better ($2.125$ versus $3$); at $C = 10$, IV is better ($20.125$ versus $12$). The two formulations pick different lines on the same data.
- Candidates I and II both have their boundary at $x = 5$; II's fat boundary is thinner, yet its violations are larger (2 versus $\frac{3}{2}$). The reason is that $\xi_n$ is measured in units of the score: the larger $w$ is, the larger the score difference that the same distance converts into.

### Fun Time: how large is the violation

**Question (page 6):** At the optimal solution of the soft-margin SVM primal problem, assume that $y_1(\mathbf{w}^\top\mathbf{z}_1 + b) = -10$. What is the corresponding $\xi_1$?

1. $1$
2. $11$
3. $21$
4. $31$

**Answer: 2.** The handout's answer: $\xi_1$ is simply $1 - y_1(\mathbf{w}^\top\mathbf{z}_1 + b)$ when $y_1(\mathbf{w}^\top\mathbf{z}_1 + b) \le 1$. Lin's version in the lecture is shorter: we want 1, we have $-10$, and the gap is 11.

To complete the reasoning: the constraints require $\xi_1 \ge 1 - (-10) = 11$ and $\xi_1 \ge 0$. The coefficient of $\xi_1$ in the objective is $C > 0$, and the optimal solution will not make it larger than necessary, so $\xi_1 = 11$. The general form is $\xi_n = \max\big(0,\ 1 - y_n(\mathbf{w}^\top\mathbf{z}_n + b)\big)$. Option 1 does not satisfy the constraint ($1 < 11$); options 3 and 4 satisfy it but pay an extra penalty of $10C$ and $20C$ for nothing, so they cannot be optimal.

## Deriving the dual: one more set of multipliers, and the result gains only an upper bound

```youtube
url: https://www.youtube.com/watch?v=fTHTqW5Uq4U
title: Soft-Margin Support Vector Machine :: Dual Problem @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–02:02 writes the Lagrange function, 02:02–04:55 eliminates $\xi_n$ and $\beta_n$, 04:55–06:10 covers the other simplifications, 06:10–07:10 covers the standard dual problem, and Fun Time follows.)

### Two sets of constraints, two sets of multipliers

The approach is exactly that of Techniques Lecture 2: write the Lagrange function first, with one multiplier for each constraint. There are now two sets of constraints (page 7 of the handout marks them in red and blue), so there are two sets of multipliers as well:

- $y_n(\mathbf{w}^\top\mathbf{z}_n + b) \ge 1 - \xi_n$ is paired with $\alpha_n$. Rearranged into the "less than or equal to 0" form, it is $1 - \xi_n - y_n(\mathbf{w}^\top\mathbf{z}_n + b) \le 0$.
- $\xi_n \ge 0$ is paired with $\beta_n$. Rearranged, it is $-\xi_n \le 0$.

In the lecture, Lin makes a point of watching the signs: every constraint has to be moved to the less-than-or-equal-to-0 side first. The Lagrange function is the objective plus "multiplier times its constraint":

$$
\mathcal{L}(b, \mathbf{w}, \boldsymbol{\xi}, \boldsymbol{\alpha}, \boldsymbol{\beta}) = \frac{1}{2}\mathbf{w}^\top\mathbf{w} + C\cdot\sum_{n=1}^{N}\xi_n + \sum_{n=1}^{N}\alpha_n\big(1 - \xi_n - y_n(\mathbf{w}^\top\mathbf{z}_n + b)\big) + \sum_{n=1}^{N}\beta_n(-\xi_n)
$$

The Lagrange dual problem to solve is

$$
\max_{\alpha_n \ge 0,\ \beta_n \ge 0}\ \Big( \min_{b,\mathbf{w},\boldsymbol{\xi}}\ \mathcal{L}(b, \mathbf{w}, \boldsymbol{\xi}, \boldsymbol{\alpha}, \boldsymbol{\beta}) \Big)
$$

An addition in this article: the handout simply writes "want: Lagrange dual" here and does not repeat why solving the dual instead is allowed. The reason is the same as in Techniques Lecture 2, and it needs the three conditions for strong duality: the primal is convex, the constraints are linear, and the primal is feasible. The first two hold at a glance. The third required separable data in the hard-margin case, but for soft-margin it always holds: take $\mathbf{w} = \mathbf{0}$, $b = 0$, and every $\xi_n = 1$, and all the constraints are satisfied. This is why page 12 of the handout says the soft-margin primal and dual are always solvable.

### Eliminating ξ and β first

The inner $\min$ puts no constraint on $(b, \mathbf{w}, \boldsymbol{\xi})$, so the partial derivatives are 0 at the minimum. Page 8 of the handout starts with the new variable $\xi_n$. One particular $\xi_n$ appears in three places in $\mathcal{L}$, and Lin finds them one by one in the lecture: $C\xi_n$ in the objective, $-\alpha_n\xi_n$ in the $\alpha_n$ term, and $-\beta_n\xi_n$ in the $\beta_n$ term. So

$$
\frac{\partial\mathcal{L}}{\partial\xi_n} = C - \alpha_n - \beta_n = 0
$$

That is, at the optimal solution $\alpha_n$ and $\beta_n$ add up to exactly $C$. The handout goes on to say there is no loss of optimality if solving with the implicit constraint $\beta_n = C - \alpha_n$, so $\beta_n$ can be replaced altogether. Before replacing it, confirm that the original requirements on the two sets of multipliers survive:

- $\alpha_n \ge 0$: unchanged.
- $\beta_n \ge 0$: becomes $C - \alpha_n \ge 0$, that is, $\alpha_n \le C$.

So requiring $0 \le \alpha_n \le C$ automatically makes $\beta_n$ greater than or equal to 0, and Lin says in the lecture that from here on $\beta$ never needs to be considered again. **This is where the upper bound $C$ on $\alpha_n$ comes from**: it is "$\beta_n$ cannot be negative" written another way.

An addition in this article, a way of seeing why adding this constraint loses no optimality. Collecting the terms of $\mathcal{L}$ that contain $\xi_n$ gives $(C - \alpha_n - \beta_n)\,\xi_n$, which is linear in $\xi_n$. Whenever the coefficient is not 0, the inner min can push $\xi_n$ off to infinity in the right direction and send $\mathcal{L}$ to $-\infty$. The outer level is looking for a maximum and will not pick such an $(\boldsymbol{\alpha}, \boldsymbol{\beta})$, so only the case where the coefficient is 0 needs to be considered. This is the same reasoning Techniques Lecture 2 used for $b$.

After substituting $\beta_n = C - \alpha_n$, the terms containing $\xi_n$ are

$$
\sum_{n=1}^{N}\big(C - \alpha_n - \beta_n\big)\,\xi_n = \sum_{n=1}^{N}\big(C - \alpha_n - (C - \alpha_n)\big)\,\xi_n = 0
$$

The slide crosses this whole term out. Lin says in the lecture that this elimination does two things: $\beta_n$ is gone and, more importantly, every $\xi_n$ is gone too, just as $b$ was eliminated in the hard-margin case. The remaining problem is

$$
\max_{0 \le \alpha_n \le C,\ \beta_n = C - \alpha_n}\ \bigg( \min_{b,\mathbf{w}}\ \frac{1}{2}\mathbf{w}^\top\mathbf{w} + \sum_{n=1}^{N}\alpha_n\big(1 - y_n(\mathbf{w}^\top\mathbf{z}_n + b)\big) \bigg)
$$

### The rest is identical to hard-margin

Page 9 of the handout writes "familiar? :-)" next to this expression. The inner problem in the parentheses is exactly the inner problem of hard-margin in Techniques Lecture 2; the only difference is the upper bound on $\alpha_n$ outside. Lin says in the lecture that these steps were all done two lectures ago, so the details are not redone, and anyone unsure should go back to Lecture 2. Here the steps are filled in.

**Partial derivative with respect to $b$.** The part of $\mathcal{L}$ containing $b$ is $-b\sum_n\alpha_n y_n$, so

$$
\frac{\partial\mathcal{L}}{\partial b} = -\sum_{n=1}^{N}\alpha_n y_n = 0
$$

Once the constraint $\sum_n\alpha_n y_n = 0$ is added, the term containing $b$ disappears.

**Partial derivative with respect to $\mathbf{w}$.** For the $i$-th component: differentiating $\frac{1}{2}\mathbf{w}^\top\mathbf{w}$ gives $w_i$, and differentiating $-\alpha_n y_n\mathbf{w}^\top\mathbf{z}_n$ gives $-\alpha_n y_n z_{n,i}$, so

$$
\frac{\partial\mathcal{L}}{\partial w_i} = w_i - \sum_{n=1}^{N}\alpha_n y_n z_{n,i} = 0 \quad\Longrightarrow\quad \mathbf{w} = \sum_{n=1}^{N}\alpha_n y_n\mathbf{z}_n
$$

**Substitute back.** The $b$ term is already gone, leaving $\sum_n\alpha_n(1 - y_n\mathbf{w}^\top\mathbf{z}_n) = \sum_n\alpha_n - \mathbf{w}^\top\big(\sum_n\alpha_n y_n\mathbf{z}_n\big) = \sum_n\alpha_n - \mathbf{w}^\top\mathbf{w}$, and the inner minimum is

$$
\frac{1}{2}\mathbf{w}^\top\mathbf{w} + \sum_{n=1}^{N}\alpha_n - \mathbf{w}^\top\mathbf{w} = -\frac{1}{2}\Big\lVert\sum_{n=1}^{N}\alpha_n y_n\mathbf{z}_n\Big\rVert^2 + \sum_{n=1}^{N}\alpha_n
$$

### The standard soft-margin dual

Expand the squared norm into a double sum, then multiply by $-1$ to turn the max into a min, and you have the standard soft-margin SVM dual on page 10 of the handout:

$$
\begin{aligned}
\min_{\boldsymbol{\alpha}}\quad & \frac{1}{2}\sum_{n=1}^{N}\sum_{m=1}^{N}\alpha_n\alpha_m y_n y_m\mathbf{z}_n^\top\mathbf{z}_m - \sum_{n=1}^{N}\alpha_n \\
\text{subject to}\quad & \sum_{n=1}^{N} y_n\alpha_n = 0; \\
& 0 \le \alpha_n \le C,\quad n = 1, 2, \dots, N
\end{aligned}
$$

Two more relations hold implicitly. They are not constraints on $\boldsymbol{\alpha}$, but they are used later: $\mathbf{w} = \sum_n\alpha_n y_n\mathbf{z}_n$, and $\beta_n = C - \alpha_n$.

Below the formula the handout writes: only difference to hard-margin: upper bound on $\alpha_n$. As Lin puts it in the lecture, if you can solve the hard-margin dual you can solve this one too; it is just that $\alpha$ is no longer unbounded. This is still a convex QP with $N$ variables; counting the constraints the way Lin does in the lecture, there is one equality, plus one lower bound 0 and one upper bound $C$ for each $\alpha_n$, for $2N + 1$ in total. Neither the number of variables nor the number of constraints depends on $\tilde{d}$, and $\mathbf{z}_n^\top\mathbf{z}_m$ can be replaced by a kernel as in the previous lecture.

Side by side with the primal:

| | Primal problem | Dual problem |
|---|---|---|
| Variables | $\tilde{d} + 1 + N$ | $N$ |
| Constraints | $2N$ | $2N + 1$ |
| Where $C$ appears | the coefficient of $\sum\xi_n$ in the objective | the upper bound on $\alpha_n$ |
| $\xi_n$ | a variable | eliminated, computed afterwards |

### Numerical example: the dual problem for the six points

Continue with the six points from earlier (an example made up for this article). In one dimension, $w = \sum_n\alpha_n y_n x_n$ is a single number:

$$
w(\boldsymbol{\alpha}) = -0\cdot\alpha_1 - 3\alpha_2 + 4\alpha_3 - 6\alpha_4 + 7\alpha_5 + 10\alpha_6
$$

The dual problem is to minimize $\frac{1}{2}w(\boldsymbol{\alpha})^2 - \sum_n\alpha_n$ subject to $-\alpha_1 - \alpha_2 + \alpha_3 - \alpha_4 + \alpha_5 + \alpha_6 = 0$ and $0 \le \alpha_n \le C$.

**First see what happens without the upper bound.** Take $\boldsymbol{\alpha} = (0, \frac{t}{2}, t, t, \frac{t}{2}, 0)$ with $t \ge 0$. The equality constraint: $-\frac{t}{2} + t - t + \frac{t}{2} = 0$, which holds. $w = -\frac{3t}{2} + 4t - 6t + \frac{7t}{2} = 0$. The objective is $0 - 3t$. The larger $t$ is, the lower the objective, with no lower bound. The hard-margin primal has no solution on this data, and in the dual that shows up as an objective that can fall without limit. With $\alpha_n \le C$ added, $t$ can go no higher than $C$, and this direction is blocked.

**Solve $C = 1$.** Solving a six-variable QP directly by hand is tedious, so the approach here is "guess the pattern, solve, then verify". Candidate I on the primal side suggests it: points 1 and 6 are far from the fat boundary, points 3 and 4 violate it, and points 2 and 5 sit exactly on its edges. Guess $\alpha_1 = \alpha_6 = 0$ and $\alpha_3 = \alpha_4 = 1$ (at the upper bound; why a violating point ends up at the upper bound is explained later, in the passage "The value of α sorts the data into three kinds"). The equality constraint becomes $-\alpha_2 + 1 - 1 + \alpha_5 = 0$, so $\alpha_2 = \alpha_5$; call it $a$. Then

$$
w = -3a + 4 - 6 + 7a = 4a - 2, \qquad \text{objective} = \frac{1}{2}(4a - 2)^2 - 2 - 2a
$$

Differentiate with respect to $a$: $4(4a - 2) - 2 = 16a - 10 = 0$, $a = \frac{5}{8}$, which lies between 0 and 1. So

$$
\boldsymbol{\alpha} = \Big(0,\ \frac{5}{8},\ 1,\ 1,\ \frac{5}{8},\ 0\Big), \qquad w = \frac{1}{2}, \qquad \text{objective} = \frac{1}{8} - \frac{13}{4} = -\frac{25}{8}
$$

**Verify that this really is optimal.** Written back in the max form of the dual, this $\boldsymbol{\alpha}$ has value $\frac{25}{8} = 3.125$. Weak duality from Techniques Lecture 2 says that the value given by a feasible $\boldsymbol{\alpha}$ never exceeds the optimal value of the primal; and candidate I, $(w, b) = (\frac{1}{2}, -\frac{5}{2})$, has a primal objective of exactly $3.125$ as well. A lower bound equals a value that is actually attained, so candidate I is the optimal solution of the primal, this $\boldsymbol{\alpha}$ is the optimal solution of the dual, and strong duality is visible in this example.

Note that $w$, computed from $\boldsymbol{\alpha}$, is $\frac{1}{2}$, which agrees with candidate I; $b$ has not appeared yet, because the dual problem does not contain it.

### Fun Time: C increases by 2, how does the dual change

**Question (page 11):** In the soft-margin SVM, assume that we want to increase the parameter $C$ by 2. How shall the corresponding dual problem be changed?

1. the upper bound of $\alpha_n$ shall be halved
2. the upper bound of $\alpha_n$ shall be decreased by 2
3. the upper bound of $\alpha_n$ shall be increased by 2
4. the upper bound of $\alpha_n$ shall be doubled

**Answer: 3.** The handout's answer: because $C$ is exactly the upper bound of $\alpha_n$, increasing $C$ by 2 in the primal problem is equivalent to increasing the upper bound by 2 in the dual problem. The example Lin gives in the lecture is $C$ going from 10 to 12, with the upper limit of $\alpha_n$ going from 10 to 12 as well.

From the derivation, the upper bound comes from $\beta_n = C - \alpha_n \ge 0$, where $C$ appears on the right-hand side untouched, neither multiplied nor divided, so whatever is added to it is added to the bound. Options 1 and 2 go in the wrong direction. Option 4 happens to be right only when $C$ goes from exactly 2 to 4. Neither the dual objective nor the equality constraint contains $C$, so they need no change.

## After solving for α: computing b, and what each point's α reveals

```youtube
url: https://www.youtube.com/watch?v=5z7ujI3YBBE
title: Soft-Margin Support Vector Machine :: Messages @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–01:55 covers the kernel soft-margin SVM algorithm, 01:55–05:47 computes $b$, 05:47–08:28 looks at Gaussian SVM with different $C$, 08:28–12:32 covers the physical meaning of $\alpha_n$, and Fun Time follows.)

### The kernel soft-margin SVM algorithm

Page 12 of the handout changes one thing in the previous lecture's kernel hard-margin SVM algorithm:

1. Compute $q_{n,m} = y_n y_m K(\mathbf{x}_n, \mathbf{x}_m)$, $\mathbf{p} = -\mathbf{1}_N$, and the $(A, \mathbf{c})$ that express three kinds of constraints: equality, lower-bound, and **upper-bound**.
2. $\boldsymbol{\alpha} \leftarrow \text{QP}(Q_D, \mathbf{p}, A, \mathbf{c})$.
3. $b \leftarrow\ ?$
4. Return the support vectors, their $\alpha_n$, and $b$. For a new $\mathbf{x}$,

$$
g_{\text{SVM}}(\mathbf{x}) = \text{sign}\Big(\sum_{\text{SV indices } n}\alpha_n y_n K(\mathbf{x}_n, \mathbf{x}) + b\Big)
$$

What step 1 adds is the set of upper-bound constraints, which Lin says in the lecture comes from the parameter $C$. An addition in this article: in the format of the QP solver from Techniques Lecture 1, which accepts only "$\ge$", the upper bound $\alpha_n \le C$ has to be written as $-\alpha_n \ge -C$.

The handout makes two remarks on this algorithm. It is almost the same as hard-margin; and it is more flexible, since the primal and dual are always solvable. As Lin puts it in the lecture: hard-margin has a solution only when the data is separable, which is no longer required, so you always get a solution, and $C$ lets you adjust whether you care more about a fat boundary or about fewer mistakes; soft-margin is the form of SVM more commonly used in practice. For the rest of this section, Lin simply calls soft-margin SVM "SVM" in the lecture.

The remaining question is step 3. The QP has changed and the KKT conditions have changed with it, so can $b$ still be computed the old way?

### Computing b takes a free SV

Start by listing complementary slackness. The rule from Techniques Lecture 2 is that for each constraint and its multiplier, at least one is 0 (in the lecture, Lin keeps the analogy that Harry Potter and Voldemort cannot both be alive). Hard-margin has just one condition:

$$
\alpha_n\big(1 - y_n(\mathbf{w}^\top\mathbf{z}_n + b)\big) = 0
$$

Soft-margin has two sets of constraints, so it has two (page 13 of the handout):

$$
\alpha_n\big(1 - \xi_n - y_n(\mathbf{w}^\top\mathbf{z}_n + b)\big) = 0, \qquad (C - \alpha_n)\,\xi_n = 0
$$

The second was originally $\beta_n\cdot(-\xi_n) = 0$. Lin explains in the lecture that $\beta_n$ is already known to be $C - \alpha_n$ and the minus sign does not affect "the product is 0", so it is written directly as $(C - \alpha_n)\xi_n = 0$.

Following the hard-margin approach, find a support vector $(\mathbf{z}_s, y_s)$ with $\alpha_s > 0$. The first condition forces the parenthesis to be 0:

$$
1 - \xi_s - y_s(\mathbf{w}^\top\mathbf{z}_s + b) = 0 \quad\Longrightarrow\quad y_s(\mathbf{w}^\top\mathbf{z}_s + b) = 1 - \xi_s
$$

Multiply both sides by $y_s$ ($y_s^2 = 1$): $\mathbf{w}^\top\mathbf{z}_s + b = y_s - y_s\xi_s$, so

$$
b = y_s - y_s\xi_s - \mathbf{w}^\top\mathbf{z}_s
$$

Compared with hard-margin there is one more term, $y_s\xi_s$. The trouble is that $\xi_s$ is a violation, and you need $b$ before you can compute it. Lin says in the lecture that this turns into a chicken-and-egg problem that never finishes.

The way out is to make that term 0. The second complementary slackness condition says that whenever $C - \alpha_s \ne 0$, that is, $\alpha_s < C$, we have $\xi_s = 0$. A support vector that also satisfies $0 < \alpha_s < C$ is called a **free SV**; Lin explains in the lecture that free means unconstrained, not tied down by $C$. For a free SV,

$$
b = y_s - \mathbf{w}^\top\mathbf{z}_s = y_s - \sum_{\text{SV indices } n}\alpha_n y_n K(\mathbf{x}_n, \mathbf{x}_s)
$$

This is the same formula as in hard-margin, and the inner product is still computed by the kernel. Lin says in the lecture that every free SV gives the same $b$.

What if there is no free SV? The handout has only one phrase, "range of $b$ otherwise". Lin adds in the lecture that this case is rare but does happen; then $b$ can only be bounded by a set of inequalities and may have more than one answer, and whichever $b$ satisfies all the KKT conditions will do. The lecture does not go into the details; the example below runs into this case once.

### Numerical example: b and KKT for the six points

(An example made up for this article, continuing with the six points.) At $C = 1$, $\boldsymbol{\alpha} = (0, \frac{5}{8}, 1, 1, \frac{5}{8}, 0)$ and $w = \frac{1}{2}$. The free SVs are points 2 and 5:

- Using point 2: $b = y_2 - wx_2 = -1 - \frac{3}{2} = -\frac{5}{2}$.
- Using point 5: $b = y_5 - wx_5 = 1 - \frac{7}{2} = -\frac{5}{2}$.

The two free SVs give the same $b$. If you mistakenly plug point 3, which has $\alpha_3 = C$, into the hard-margin formula, you get $b = 1 - 2 = -1$, which is wrong; the full formula $b = y_3 - y_3\xi_3 - wx_3 = 1 - \frac{3}{2} - 2 = -\frac{5}{2}$ is right, but it needs $\xi_3 = \frac{3}{2}$ to be known first.

With $b$ in hand, every point's $\xi_n = \max(0, 1 - y_n(wx_n + b))$ can be computed, and the two complementary slackness conditions can be checked point by point:

| $n$ | $x_n$ | $y_n$ | $\alpha_n$ | $y_n(wx_n + b)$ | $\xi_n$ | $\alpha_n(1 - \xi_n - y_n(wx_n + b))$ | $(C - \alpha_n)\xi_n$ | Kind |
|---|---|---|---|---|---|---|---|---|
| 1 | $0$ | $-1$ | $0$ | $\frac{5}{2}$ | $0$ | $0$ | $0$ | non-support vector |
| 2 | $3$ | $-1$ | $\frac{5}{8}$ | $1$ | $0$ | $0$ | $0$ | free SV |
| 3 | $4$ | $+1$ | $1$ | $-\frac{1}{2}$ | $\frac{3}{2}$ | $0$ | $0$ | bounded SV |
| 4 | $6$ | $-1$ | $1$ | $-\frac{1}{2}$ | $\frac{3}{2}$ | $0$ | $0$ | bounded SV |
| 5 | $7$ | $+1$ | $\frac{5}{8}$ | $1$ | $0$ | $0$ | $0$ | free SV |
| 6 | $10$ | $+1$ | $0$ | $\frac{5}{2}$ | $0$ | $0$ | $0$ | non-support vector |

The other conditions hold too: $\sum_n y_n\alpha_n = -\frac{5}{8} + 1 - 1 + \frac{5}{8} = 0$, every $\alpha_n$ lies between 0 and 1, and every point satisfies $y_n(wx_n + b) \ge 1 - \xi_n$. The classifier is $g(x) = \text{sign}(\frac{1}{2}x - \frac{5}{2})$, with its boundary at $x = 5$ and the fat boundary running from 3 to 7.

**Try a few other values of $C$.** The same approach (guess the pattern, solve, verify KKT; the numbers were separately checked by a program using exact fractions) gives:

| $C$ | $\boldsymbol{\alpha}$ | $w$ | Half-width of the fat boundary $1/w$ | $b$ | $\sum\xi_n$ | free SV | bounded SV |
|---|---|---|---|---|---|---|---|
| $\frac{1}{20}$ | $(\frac{1}{100}, \frac{1}{20}, \frac{1}{20}, \frac{1}{20}, \frac{1}{20}, \frac{1}{100})$ | $\frac{1}{5}$ | $5$ | $-1$ | $\frac{18}{5}$ | points 1, 6 | points 2, 3, 4, 5 |
| $\frac{1}{5}$ | $(0, \frac{1}{5}, \frac{1}{5}, \frac{1}{5}, \frac{1}{5}, 0)$ | $\frac{2}{5}$ | $\frac{5}{2}$ | $-\frac{11}{5}$ to $-\frac{9}{5}$ | $\frac{16}{5}$ | none | points 2, 3, 4, 5 |
| $1$ | $(0, \frac{5}{8}, 1, 1, \frac{5}{8}, 0)$ | $\frac{1}{2}$ | $2$ | $-\frac{5}{2}$ | $3$ | points 2, 5 | points 3, 4 |
| $100$ | $(0, \frac{401}{8}, 100, 100, \frac{401}{8}, 0)$ | $\frac{1}{2}$ | $2$ | $-\frac{5}{2}$ | $3$ | points 2, 5 | points 3, 4 |

Three things to read from this table:

- **As $C$ grows, the margin thins and the violation drops.** As $C$ goes from $\frac{1}{20}$ to 1, the half-width of the fat boundary shrinks from 5 to 2, the total violation falls from $\frac{18}{5}$ to 3, and the bounded SVs drop from four to two.
- **$C = \frac{1}{5}$ has no free SV.** Solving with the $C = 1$ pattern gives $a = \frac{C}{2} + \frac{1}{8} = \frac{9}{40}$, which exceeds the upper bound $\frac{1}{5}$, so points 2 and 5 hit the upper bound as well and all four support vectors are bounded. Now $b$ is constrained only by inequalities: point 2 is bounded and requires $y_2(wx_2 + b) \le 1$, that is, $-(\frac{6}{5} + b) \le 1$, $b \ge -\frac{11}{5}$; point 5 requires $\frac{14}{5} + b \le 1$, $b \le -\frac{9}{5}$. Every $b$ in this range has objective $\frac{18}{25}$, and every one is optimal. This is the handout's "range of $b$ otherwise".
- **As $C$ goes from 1 to 100, the classifier does not change.** Points 3 and 4 have swapped places and no line can rescue them, so a larger $C$ only makes $\alpha$ larger along with it. In this example, as long as $C \ge \frac{1}{4}$, $a = \frac{C}{2} + \frac{1}{8}$ stays within the upper bound, the solution is always $w = \frac{1}{2}$, $b = -\frac{5}{2}$, and raising $C$ further never produces a different classifier. The figures that come next in the handout use the Gaussian kernel, whose boundary can keep bending, and things are different there.

### Soft-margin Gaussian SVM with different C

Page 14 of the handout shows three figures for $C = 1$, $10$, and $100$, on the same data with the Gaussian kernel. In the lecture, Lin first explains how to read them: the black line is the boundary, with the blue region above it and the red region below; the gray area is the margin, that is, what the fat boundary in $\mathcal{Z}$ space looks like when mapped back to $\mathcal{X}$ space.

- **$C = 1$:** the boundary is gentle and the gray area is wide. Lin points out in the lecture that this figure has quite a few violations: some red points fall in the blue region (misclassified), and some blue points are on the correct side but inside the gray area.
- **$C = 10$:** the boundary starts to bend, the gray area narrows, and there are fewer violations. Lin picks out a blue point that was misclassified a moment ago and is now on the correct side, though still inside the gray area: a large error has become a small one.
- **$C = 100$:** the boundary is more convoluted still, and at the top of the figure it even closes off a small loop, which gets an isolated cross right as well.

The handout's note is large $C$ ⟹ less noise tolerance ⟹ 'overfit'?, and it writes once more warning: SVM can still overfit. Lin's question about the $C = 100$ figure in the lecture: does it need to be this complicated, and might that cross at the top be nothing but noise? If $C$ is not tuned well, soft-margin SVM does not tolerate noise enough and overfits all the same. So the handout concludes that soft-margin Gaussian SVM needs careful selection of $(\gamma, C)$; Lin adds in the lecture that the polynomial kernel has even more parameters to choose.

### The value of α sorts the data into three kinds

Page 15 of the handout is titled Physical Meaning of $\alpha_n$. The same two complementary slackness conditions give three cases according to the value of $\alpha_n$:

| Kind | $\alpha_n$ | What complementary slackness gives | $\xi_n$ | Position | Mark in the figure |
|---|---|---|---|---|---|
| non-support vector | $0$ | $C - \alpha_n = C \ne 0$, so the second condition forces $\xi_n = 0$ | $0$ | outside the fat boundary, a few exactly on its edge | none |
| free SV | $0 < \alpha_n < C$ | the second condition gives $\xi_n = 0$; the first gives $y_n(\mathbf{w}^\top\mathbf{z}_n + b) = 1$ | $0$ | exactly on the edge of the fat boundary | square |
| bounded SV | $C$ | $\alpha_n \ne 0$, so the first condition gives $\xi_n = 1 - y_n(\mathbf{w}^\top\mathbf{z}_n + b)$ | the violation amount | violating the fat boundary, a few exactly on its edge | triangle |

A note on each of the three rows:

- **Non-support vector.** $\xi_n = 0$ together with the primal constraint gives $y_n(\mathbf{w}^\top\mathbf{z}_n + b) \ge 1$, so there is no violation. The handout writes 'away from'/on fat boundary; Lin says in the lecture that most of these points are some distance away from the fat boundary and a very few fall exactly on its edge.
- **Free SV.** The handout writes on fat boundary, locates $b$. These are the points used to compute $b$.
- **Bounded SV.** $\xi_n$ records exactly how much this point violates. In the lecture, Lin divides violations into two kinds: a small violation does not cross the line in the middle and causes no classification error; a large violation crosses to the other side and is a serious error. Both kinds have $\alpha_n = C$. Lin also mentions that a very few points exactly on the edge can have $\alpha_n = C$ too, but in most cases seeing $\alpha_n = C$ tells you that the point violates the fat boundary.

This also answers the guess made in the earlier example: for a point with a violation ($\xi_n > 0$), the second complementary slackness condition forces $C - \alpha_n = 0$, so $\alpha_n$ must be at the upper bound.

The handout's conclusion is that $\alpha_n$ can be used for data analysis. As Lin puts it in the lecture, after running SVM you can look at the values of $\alpha$ and sort the points you have into three kinds: which may be noisy, which are helpful, and which hardly matter. In the six-point example, the points at the upper bound when $C = 1$ are exactly points 3 and 4, the ones that swapped places.

### Fun Time: estimating E_in from the number of support vectors

**Question (page 16):** For a data set of size 10000, after solving SVM, assume that there are 1126 support vectors, and 1000 of those support vectors are bounded. What is the possible range of $E_{\text{in}}(g_{\text{SVM}})$ in terms of 0/1 error?

1. $0.0000 \le E_{\text{in}}(g_{\text{SVM}}) \le 0.1000$
2. $0.1000 \le E_{\text{in}}(g_{\text{SVM}}) \le 0.1126$
3. $0.1126 \le E_{\text{in}}(g_{\text{SVM}}) \le 0.5000$
4. $0.1126 \le E_{\text{in}}(g_{\text{SVM}}) \le 1.0000$

**Answer: 1.** The handout's answer: the bounded support vectors are the only ones that could violate the fat boundary. A violation with $\xi_n \ge 1$ causes a 0/1 error; a violation with $\xi_n < 1$ does not. In the lecture, Lin argues from the best and worst cases: in the best case the 1000 bounded SVs all happen to lie exactly on the fat boundary and there is no error at all, $E_{\text{in}} = 0$; in the worst case all 1000 have crossed the boundary, $E_{\text{in}} = 1000 / 10000 = 0.1$.

Putting the reasoning together: non-support vectors and free SVs have $\xi_n = 0$, so $y_n \cdot \text{score} \ge 1 > 0$ and they are always classified correctly. The misclassified points can only be among the 1000 bounded SVs, so the upper limit is $0.1$. The lower limit is 0, because every bounded SV's $\xi_n$ can be below 1. Option 2 sets the lower limit to $0.1$, which amounts to assuming every bounded SV is misclassified, and also counts the 126 free SVs as possible errors. The lower limit $0.1126$ in options 3 and 4 assumes every support vector is misclassified, which is even further off.

In the six-point example, at $C = 1$ there are 2 bounded SVs and $E_{\text{in}} = \frac{2}{6}$, right at the upper limit; at $C = \frac{1}{20}$ there are 4 bounded SVs, of which points 2 and 5 have $\xi_n = \frac{3}{5} < 1$ and are not misclassified, so $E_{\text{in}}$ is still $\frac{2}{6}$, below the upper limit $\frac{4}{6}$.

## Choosing C and γ: cross-validation, and the bound given by the number of support vectors

```youtube
url: https://www.youtube.com/watch?v=ahogAa5Rnmc
title: Soft-Margin Support Vector Machine :: Model Selection @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–02:08 covers choosing parameters with cross-validation, 02:08–05:30 covers the relation between leave-one-out and the number of support vectors, 05:30–07:28 covers selection by the number of support vectors, 07:28–08:10 is Fun Time, and the summary follows.)

### More parameters mean model selection

Page 17 of the handout shows a three-by-three grid: nine figures, all with the Gaussian kernel, each with a different $(C, \gamma)$. Lin explains in the lecture that the horizontal axis is different $C$ and the vertical axis is different $\gamma$. The nine boundaries differ a great deal: the top row bends sharply and the bottom row is close to straight lines. The handout says it is complicated even for $(C, \gamma)$ of Gaussian SVM, and there are more combinations if other kernels or parameters are included.

How to select? The handout writes a single word: validation. Lin says in the lecture that this is the only definite answer Foundations ever gave, and the simplest and most useful tool is validation.

### Selecting by cross-validation

Page 18 of the handout marks the cross-validation error $E_{\text{cv}}$ of each cell on the same grid:

| | Left | Middle | Right |
|---|---|---|---|
| Top row | $0.3500$ | $0.3250$ | $0.3250$ |
| Middle row | $0.2000$ | $0.2250$ | $0.2750$ |
| Bottom row | $0.1750$ | $0.2250$ | $0.2000$ |

The smallest is $0.1750$ in the lower-left corner, which the slide marks in orange. Lin points out in the lecture that the boundaries in the top row, the ones that look heavily overfit, do have larger $E_{\text{cv}}$.

The handout makes two points:

- $E_{\text{cv}}(C, \gamma)$ is a 'non-smooth' function of $(C, \gamma)$ and difficult to optimize directly. As Lin puts it in the lecture, each $(C, \gamma)$ you feed in gives back one value, but you cannot optimize over $C$ and $\gamma$ the way gradient descent would; usually all you can do is feed in a few different values and compare.
- So in practice you run $V$-fold cross-validation on a few grid values of $(C, \gamma)$ and pick the one with the smallest $E_{\text{cv}}$.

The handout's remark is that $E_{\text{cv}}$ is a very popular criterion for soft-margin SVM.

### The leave-one-out error never exceeds the fraction of support vectors

Page 19 of the handout first recalls that $E_{\text{loocv}}$ is $E_{\text{cv}}$ with $N$ folds: each time one example is held out for validation and the rest are used for training. It then claims a result special to SVM:

$$
E_{\text{loocv}} \le \frac{\#\text{SV}}{N}
$$

The numbers Lin gives in the lecture: with 100 support vectors among 10,000 examples, the leave-one-out error cannot exceed $100 / 10000 = 1\%$.

The proof has three steps.

**Step 1: remove a non-support vector, and the remaining $\boldsymbol{\alpha}$ is still optimal.** Suppose that in the optimal solution computed from all $N$ examples, the $N$-th has $\alpha_N = 0$. Remove $(\mathbf{x}_N, y_N)$ and solve the SVM with only the remaining $N - 1$ examples. The handout claims that $(\alpha_1, \alpha_2, \dots, \alpha_{N-1})$ is still optimal for this smaller problem, and hints that the key is to ask: what if there is a better one? In the lecture, Lin finishes the proof by contradiction: if the smaller problem had a better set of $N - 1$ values of $\alpha$, then adding the removed point back with $\alpha_N = 0$ would give a better solution to the original $N$-example problem, contradicting "the original one is already optimal".

This article fills in the checks that are skipped in between. The original $(\alpha_1, \dots, \alpha_{N-1})$ is feasible in the smaller problem and its objective value is unchanged, because the term with $\alpha_N = 0$ contributes nothing to the equality constraint $\sum_n y_n\alpha_n = 0$, to the double sum, or to $\sum_n\alpha_n$. Conversely, every feasible solution of the smaller problem, extended with $\alpha_N = 0$, is a feasible solution of the larger problem with the same objective value. So if the smaller problem had a solution with a lower objective, the larger problem would too, and that is where the contradiction comes from.

**Step 2: $g^- = g$.** Write $g^-$ for the classifier learned after removing that example. $\boldsymbol{\alpha}$ has not changed, so $\mathbf{w} = \sum_n\alpha_n y_n\mathbf{z}_n$ and the $b$ computed from a free SV have not changed either, and $g^-$ is the same as the original $g$. The handout writes this as SVM: $g^- = g$ when leaving out non-SV. Lin says in the lecture that this is the optimization-side explanation of the earlier observation about hard-margin (only SV needed, in the Techniques Lecture 2 handout): removing a non-support vector does not affect the fat boundary at all. The right side of page 19 also shows the figure with the four hard-margin points, annotated motivation from hard-margin SVM: only SVs needed.

An addition in this article: this step relies on two premises the handout does not state. One is that the smaller problem has only this one optimal $\boldsymbol{\alpha}$, or that the solver happens to return this one; the other is that $b$ is uniquely determined by a free SV. Without a free SV, $b$ is determined only up to a range, and removing a point means a few constraints fewer, so that range can only stay the same or widen, and $g^-$ is then not necessarily identical to $g$. Neither the handout nor the lecture deals with these corner cases, so these three steps are the main idea of the proof and not yet a rigorous proof covering every case.

**Step 3: compute the error point by point.** The contribution of the $n$-th example to $E_{\text{loocv}}$ is $e_n = \text{err}(g^-, (\mathbf{x}_n, y_n))$.

- Non-support vectors: $e_{\text{non-SV}} = \text{err}(g^-, \text{non-SV}) = \text{err}(g, \text{non-SV}) = 0$. The last equality holds because a non-support vector has $\xi_n = 0$, does not violate the fat boundary, and is always classified correctly by $g$.
- Support vectors: after removal $g^-$ may change, and the point may be classified correctly or incorrectly; all we know is $e_{\text{SV}} \le 1$.

Averaging,

$$
E_{\text{loocv}} = \frac{1}{N}\sum_{n=1}^{N} e_n \le \frac{1}{N}\big(0\cdot\#\text{non-SV} + 1\cdot\#\text{SV}\big) = \frac{\#\text{SV}}{N}
$$

The handout's summary is scaled #SV bounds leave-one-out CV error.

### Numerical example: leave-one-out on the six points

(An example made up for this article, continuing with the six points, $C = 1$.) There are 4 support vectors, so the upper bound is $\frac{4}{6}$. Actually remove each point in turn and re-solve with the remaining five:

| Point removed | Its kind in the full problem | Solution on the remaining five | Score on the removed point | $e_n$ |
|---|---|---|---|---|
| Point 1 ($x = 0$, $-1$) | non-support vector | $w = \frac{1}{2}$, $b = -\frac{5}{2}$, unchanged | $-\frac{5}{2}$, predicted $-1$ | $0$ |
| Point 2 ($x = 3$, $-1$) | free SV | $w = \frac{2}{7}$, $b = -1$ | $\frac{6}{7} - 1 = -\frac{1}{7}$, predicted $-1$ | $0$ |
| Point 3 ($x = 4$, $+1$) | bounded SV | $w = 1$, $b$ between $-7$ and $-6$ | between $-3$ and $-2$, predicted $-1$ | $1$ |
| Point 4 ($x = 6$, $-1$) | bounded SV | $w = 1$, $b$ between $-4$ and $-3$ | between $2$ and $3$, predicted $+1$ | $1$ |
| Point 5 ($x = 7$, $+1$) | free SV | $w = \frac{2}{7}$, $b = -\frac{13}{7}$ | $2 - \frac{13}{7} = \frac{1}{7}$, predicted $+1$ | $0$ |
| Point 6 ($x = 10$, $+1$) | non-support vector | $w = \frac{1}{2}$, $b = -\frac{5}{2}$, unchanged | $\frac{5}{2}$, predicted $+1$ | $0$ |

The row that removes point 2 can be checked by hand. What remains is $x = 0, 4, 6, 7, 10$: guess that $x = 0$ and $x = 7$ are free SVs, $x = 4$ and $x = 6$ are at the upper bound 1, and $x = 10$ is 0. The two free SVs give $0\cdot w + b = -1$ and $7w + b = 1$, so $b = -1$ and $w = \frac{2}{7}$. The equality constraint makes the $\alpha$ of the two free SVs equal; call it $a$: $w = 4 - 6 + 7a = \frac{2}{7}$, $a = \frac{16}{49}$, which is between 0 and 1. Then check the other three points: $x = 10$ has $y\cdot\text{score} = \frac{13}{7} \ge 1$; $x = 4$ has $\frac{1}{7} \le 1$; $x = 6$ has $-\frac{5}{7} \le 1$, each consistent with its kind.

The row that removes point 3 has no free SV: the remaining data becomes separable, but the hard-margin solution needs $\alpha = 2$, which exceeds the upper bound, so the two points $x = 6$ and $x = 7$ both sit at $C = 1$ and $b$ is determined only up to a range. Every $b$ in the range predicts $-1$ for $x = 4$, so $e_3 = 1$ is not in doubt.

**What this result means.** $E_{\text{loocv}} = \frac{0 + 0 + 1 + 1 + 0 + 0}{6} = \frac{2}{6}$, which indeed does not exceed $\frac{4}{6}$. Removing either of the two non-support vectors leaves the solution completely unchanged and contributes 0, in line with steps 1 and 2 of the proof. Removing each of the four support vectors does change the solution, but only two of them end up misclassified as a result, and the other two still contribute 0. The upper bound counts every support vector as "will be wrong", so it is usually looser than the actual $E_{\text{loocv}}$.

### Using the number of support vectors as a safety check

Page 20 of the handout relabels each cell of the same grid with its number of support vectors, nSV:

| | Left | Middle | Right |
|---|---|---|---|
| Top row | $38$ | $37$ | $37$ |
| Middle row | $27$ | $21$ | $17$ |
| Bottom row | $21$ | $18$ | $19$ |

Lin points out in the lecture that the three worse examples at the top have many support vectors and the simpler ones below have relatively few. The handout makes three points:

- $\text{nSV}(C, \gamma)$ is likewise a non-smooth function and difficult to optimize.
- It is just an upper bound! As Lin puts it in the lecture, we do not know what the actual leave-one-out error is and can only estimate an upper limit from the number of support vectors; optimizing the upper limit may only make the upper limit as good as possible, which does not mean making the true error as good as possible.
- So its use is to rule out dangerous models: look at nSV on a few grid values and rule out the ones with especially many support vectors.

This article compares the two tables: the smallest nSV is in the right cell of the middle row (17, marked in orange on the slide), whose $E_{\text{cv}}$ is $0.2750$, sixth smallest among the nine cells; the lower-left corner with the smallest $E_{\text{cv}}$ ($0.1750$) has nSV 21. Picking by nSV and picking by $E_{\text{cv}}$ choose different cells. On the other hand, the three top-row cells with the largest nSV (38, 37, 37) are also exactly the three cells with the largest $E_{\text{cv}}$. The two tables happen to demonstrate the handout's usage: nSV is for ruling out, not for making the final decision.

The handout's conclusion is that nSV is often used as a safety check if computing $E_{\text{cv}}$ is too time-consuming. Lin adds two points in the lecture: the number of support vectors is available as soon as training finishes, with no extra computation; and after ruling out the dangerous combinations, you can run cross-validation on the ones that remain to select more suitable parameters.

### Fun Time: which value cannot be the leave-one-out error

**Question (page 21):** For a data set of size 10000, after solving SVM on some parameters, assume that there are 1126 support vectors, and 1000 of those support vectors are bounded. Which of the following cannot be $E_{\text{loocv}}$ with those parameters?

1. $0.0000$
2. $0.0805$
3. $0.1111$
4. $0.5566$

**Answer: 4.** The handout's answer is one sentence: note that the upper bound of $E_{\text{loocv}}$ is $0.1126$. It comes from $\#\text{SV} / N = 1126 / 10000 = 0.1126$. The first three options do not exceed $0.1126$, so the upper bound cannot rule them out; $0.5566$ exceeds it and is impossible.

An addition in this article: this question uses the same numbers as the Fun Time "estimating E_in from the number of support vectors", yet the upper limit is different. The upper limit on $E_{\text{in}}$ is the fraction of bounded SVs, $0.1$, and the upper limit on $E_{\text{loocv}}$ is the fraction of all support vectors, $0.1126$. The difference lies in the free SVs: under $g$ they sit exactly on the fat boundary and are always classified correctly; but once a free SV is removed and the model retrained, $g^-$ may change, and there is no guarantee it still gets that point right. So the information "1000 of those support vectors are bounded" is not needed in this question.

### Summary of this lecture

Page 22 of the handout reduces each of the four sections to one line: the primal problem adds margin violations $\xi_n$; the dual problem upper-bounds $\alpha_n$ by $C$; bounded and free SVs can be used for data analysis; model selection uses cross-validation, or approximately nSV. Lin says in the lecture that, going from hard-margin through the dual and the kernel to soft-margin, these four lectures are a complete introduction to the most popular form, soft-margin SVM. The handout's preview of the next lecture is other kernel models for soft binary classification.

## Self-check

**1. The classifier is $g(\mathbf{x}) = \text{sign}(x_1 - x_2 - 1)$, that is, $\mathbf{w} = (1, -1)$ and $b = -1$. Four points: $(3, 1)$ labeled $+1$, $(2, \frac{1}{2})$ labeled $+1$, $(1, 1)$ labeled $+1$, and $(0, 2)$ labeled $-1$. What is each point's $\xi_n$? Which points violate the fat boundary, and which are misclassified?**

Answer: the values of $y_n(\mathbf{w}^\top\mathbf{x}_n + b)$ for the four points are $1$, $\frac{1}{2}$, $-1$, $3$ in order, so the $\xi_n$ are $0$, $\frac{1}{2}$, $2$, $0$ in order, summing to $\frac{5}{2}$. The second point violates the fat boundary but is not misclassified ($\xi < 1$); the third point violates it and is misclassified ($\xi > 1$); the first point is exactly on the edge; the fourth point is outside the fat boundary.

**2. Two one-dimensional examples: $x_1 = 1$ labeled $+1$ and $x_2 = -1$ labeled $-1$. Solve the soft-margin dual for $C = 1$ and for $C = \frac{1}{4}$, and find $\boldsymbol{\alpha}$, $w$, and $b$.**

Answer: the equality constraint gives $\alpha_1 = \alpha_2 = \alpha$, $w = \alpha\cdot 1 - \alpha\cdot(-1) = 2\alpha$, and the objective is $\frac{1}{2}(2\alpha)^2 - 2\alpha = 2\alpha^2 - 2\alpha$, whose minimum without an upper bound is at $\alpha = \frac{1}{2}$. At $C = 1$, $\frac{1}{2} < C$, both points are free SVs, $w = 1$, and $b = y_1 - wx_1 = 0$, the same as the hard-margin solution. At $C = \frac{1}{4}$, $\frac{1}{2}$ exceeds the upper bound and the objective is decreasing on $[0, \frac{1}{4}]$, so $\alpha = \frac{1}{4}$, both points are bounded SVs, and $w = \frac{1}{2}$. With no free SV, $b$ can only be pinned down to a range: $\xi_1 = 1 - (w + b) \ge 0$ gives $b \le \frac{1}{2}$, and $\xi_2 = 1 - (w - b) \ge 0$ gives $b \ge -\frac{1}{2}$. Within the range the primal objective is always $\frac{1}{8} + \frac{1}{4}(2 - 2w) = \frac{3}{8}$, which equals the dual's $\sum\alpha_n - \frac{1}{2}w^2 = \frac{1}{2} - \frac{1}{8} = \frac{3}{8}$.

**3. Explain in your own words: which step produces the constraint $\alpha_n \le C$? If some $\alpha_n > C$, what is the inner $\min_{b,\mathbf{w},\boldsymbol{\xi}}\mathcal{L}$?**

Criteria: the answer should mention that $\mathcal{L}$ is linear in $\xi_n$ with coefficient $C - \alpha_n - \beta_n$; setting the partial derivative with respect to $\xi_n$ to 0 gives $\beta_n = C - \alpha_n$, and $\beta_n \ge 0$ is exactly $\alpha_n \le C$. If $\alpha_n > C$, then because $\beta_n \ge 0$ the coefficient $C - \alpha_n - \beta_n$ must be negative, which pushes $\xi_n$ toward positive infinity; the inner min is $-\infty$, and the outer max will not choose it.

**4. With $C = 2$, solving the SVM gives $\alpha_n$ for 8 points, in order, $0, 0, 0, 0.4, 1.6, 2, 2, 2$. Which points can be used to compute $b$? What are the largest possible values of $E_{\text{in}}$ and $E_{\text{loocv}}$?**

Answer: points 4 and 5 are free SVs ($0 < \alpha_n < 2$) and can be used to compute $b$. The first three points are non-support vectors and the last three are bounded SVs. Only bounded SVs can be misclassified, so $E_{\text{in}} \le \frac{3}{8}$. There are 5 support vectors in total, so $E_{\text{loocv}} \le \frac{5}{8}$.

**5. In the two grids on pages 18 and 20 of the handout, the cell with the smallest nSV has $E_{\text{cv}}$ $0.2750$, and the cell with the smallest $E_{\text{cv}}$ has nSV 21. Someone claims: "just pick the parameters with the smallest nSV and skip cross-validation." What is wrong with this claim? How should nSV be used?**

Criteria: the answer should say that $\#\text{SV}/N$ is only an upper bound on $E_{\text{loocv}}$, that the smallest upper bound does not mean the smallest error, and that these two tables are a counterexample; nSV is for ruling out dangerous combinations with especially many support vectors (the top row's 38, 37, 37, for example), and the rest are then selected by cross-validation. Better still if it goes on to say "a support vector's contribution may be 0 or 1, and the upper bound counts them all as 1".

## Exercises and corresponding reading

**Hands-on.** Use [LIBSVM](https://www.csie.ntu.edu.tw/~cjlin/libsvm/) or scikit-learn's `SVC` to run a $3 \times 3$ grid of $(C, \gamma)$ on a binary classification data set of your choice, recording both the 5-fold cross-validation error and $\#\text{SV}/N$. See whether the grid points with the largest $\#\text{SV}/N$ also have high cross-validation error; then see whether the grid point that minimizes each is the same one. This is redoing the two tables on pages 18 and 20 of the handout yourself.

**The corresponding weeks in two semesters.** The [Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) puts kernel SVM and soft-margin SVM in the same week (W10, 11/04), and the slide code for this lecture is `204u`. The [Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) also puts them in W10 (11/11). This article uses only the MOOC version of the handout.

**Textbook.** Both course pages mark this week as e-8.3 and e-8.4 of [Learning from Data](http://amlbook.com) (LFD), with soft margin corresponding to e-8.4. e-Chapter 8 is an online chapter of LFD.

**Homework.** The questions related to this lecture in [Fall 2024 HW6](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf) (released 2024-11-18, due 12-02, 12 questions plus 1 bonus, no official solutions):

| Question | Topic | Where it connects to this lecture |
|---|---|---|
| Q2 | the smallest $b^*$ when all points are bounded SVs | computing $b$ takes a free SV; without one, $b$ is a range |
| Q5 | pad a constant 1 into $\mathbf{x}_n$ and solve soft-margin SVM again: is the solution unchanged | the primal and dual problems |
| Q6 | one-class SVM anchored at the origin: derive the dual | the four steps of the dual derivation |
| Q10 | MNIST 3 versus 7, polynomial kernel, the number of support vectors for $C \in \{0.1, 1, 10\}$ and $Q \in \{2, 3, 4\}$ | $C$ and nSV |
| Q11 | same data, Gaussian kernel, $C$ and $\gamma$ each in $\{0.1, 1, 10\}$, compute the margin $1/\lVert\mathbf{w}\rVert$ | Gaussian SVM with different $C$ |
| Q12 | fix $C = 1$, randomly draw 200 examples as validation data to choose $\gamma$, repeat 128 times and plot the frequencies | choosing parameters by validation |
| Q13 (bonus) | derive the dual of the soft-margin SVM dual problem and compare it with the primal | the dual derivation |

The data for the programming questions is [mnist.scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/multiclass/mnist.scale.bz2) from the LIBSVM website. The assignment recommends LIBSVM and gives two reminders: do not let the package scale the data automatically, or you have in effect changed the kernel; and confirm for yourself that the package solves the dual form from the lecture, with enough numerical precision. For Q10 to Q12 you can cross-check the number of support vectors and the margin with two packages (LIBSVM and scikit-learn's `SVC`, for example; the latter is also built on LIBSVM). Before doing Q2, work through the $C = \frac{1}{4}$ case of self-check question 2 yourself. The guide to the whole assignment is in [Techniques Homework and Final Project](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project-en).

**Further reading.** Chapter 6 of the [CS229 main notes](https://cs229.stanford.edu/main_notes.pdf) covers support vector machines in a different notation and can be read against this lecture. [Caltech Learning from Data](https://work.caltech.edu/telecourse) is the English-language course for the same textbook.

**Next lecture.** [Techniques Lecture 5: Kernel Logistic Regression](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-logistic-support-vector-regression-en) starts from this lecture's $\xi_n = \max(0, 1 - y_n(\mathbf{w}^\top\mathbf{z}_n + b))$ and rereads soft-margin SVM as a regularized model.

## Course video sources

Original videos: [Motivation and Primal Problem](https://www.youtube.com/watch?v=K7ZcAYXuU_A), [Dual Problem](https://www.youtube.com/watch?v=fTHTqW5Uq4U), [Messages behind Soft-Margin SVM](https://www.youtube.com/watch?v=5z7ujI3YBBE), [Model Selection](https://www.youtube.com/watch?v=ahogAa5Rnmc)

- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

Checked: 2026-10-13. The video IDs, titles, and lengths were taken from the official playlist on that day; the videos have no caption track on YouTube, and what this article reports from the lecture comes from transcripts made for it.

## Update Log

- 2026-10-13: Changed to one article per lecture. This article covers only Techniques Lecture 4 and was rewritten from the handout and the video transcripts.

## References

- [Techniques Lecture 4 handout, 204_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/204_handout.pdf): the main source for this article. The derivations in the four sections, the four Fun Time questions, and the numbers in the two grids on pages 18 and 20 all come from this handout.
- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2): the IDs and titles of the four videos; what the text reports as said "in the lecture" is paraphrased from machine transcripts of these four videos.
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/): the official entry for handouts and recordings.
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/): the corresponding week, the slide code, and the LFD chapter.
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/): the corresponding week and LFD chapter.
- [Fall 2024 Homework 6 (hw6_red.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf): the content of Q2, Q5, Q6, and Q10 to Q13, and the assignment's reminders.
- [LIBSVM](https://www.csie.ntu.edu.tw/~cjlin/libsvm/): the SVM package the assignment recommends, and the tool for the hands-on exercise.
- [LIBSVM Data: mnist.scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/multiclass/mnist.scale.bz2): the data for the HW6 programming questions.
- [Learning from Data textbook website](http://amlbook.com): the source of e-8.4.
- [CS229 main notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf): further reading, support vector machines in Chapter 6.
- [Caltech Learning from Data telecourse](https://work.caltech.edu/telecourse): further reading, the English-language course for the same textbook.
- [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques: Course Overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en): where this lecture sits in the whole course and the reading routes.
