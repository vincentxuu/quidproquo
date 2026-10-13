---
title: "Dual SVM: Escaping Feature Dimension with Lagrange Duality | NTU Hsuan-Tien Lin Machine Learning Techniques Lecture 2"
date: 2026-10-13
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, svm, optimization]
lang: en
math: true
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 19
tldr: "The primal hard-margin SVM has d̃+1 variables, so it stops being solvable once the feature dimension gets large. This lecture uses Lagrange duality to trade it for a quadratic program with only N variables and N+1 constraints, then uses the KKT conditions to recover w and b from α; only the support vectors, the points with α greater than 0, affect the answer. The dual's matrix still contains d̃-dimensional inner products, so the feature dimension is not really gone until the next lecture."
description: "A guide to Lecture 2 of NTU Hsuan-Tien Lin's Machine Learning Techniques, Dual Support Vector Machine: the Lagrange function, weak and strong duality, the derivation that eliminates b and w, the dual quadratic program, the KKT conditions, and support vectors, with the dual problem for four points solved completely by hand."
draft: false
glossary:
  - term: "Lagrange dual problem"
    aliases: ["dual problem"]
    definition: "The problem you get by swapping the Lagrange function's \"max over the multipliers first, then min over the original variables\" into \"min first, then max\". Its optimal value never exceeds the optimal value of the primal problem."
    context: "Techniques Lecture 2 uses it to replace the SVM's variables (b, w) with N values αₙ."
  - term: "KKT conditions"
    aliases: ["Karush-Kuhn-Tucker conditions"]
    definition: "A set of conditions that must hold when the primal and dual problems reach their optimal solutions together: primal feasible, dual feasible, dual-inner optimal, and complementary slackness. For a convex QP such as the SVM they are also sufficient."
    context: "Techniques Lecture 2 uses KKT to recover w and b from the dual solution α."
  - term: "complementary slackness"
    definition: "The fourth KKT condition: for every n, at least one of αₙ and 1 − yₙ(wᵀzₙ + b) is 0."
    context: "It gives \"a point with αₙ greater than 0 must lie on the fat boundary\", and it is what b is computed from."
  - term: "support vector"
    aliases: ["SV"]
    definition: "A training point whose αₙ is greater than 0 in the dual solution. Such points always lie on the fat boundary, and they alone are enough to compute w and b."
    context: "The source of the name SVM; Techniques Lecture 2 separates \"candidate points on the boundary\" from \"points with αₙ greater than 0\"."
---

> 🌏 [中文版](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-02-dual-svm)

**Video status: Videos included.** This article is written from the official MOOC handout [202_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/202_handout.pdf) and transcripts of the four official videos, with formulas following the handout. The transcripts are machine transcripts made for this article (Whisper), not official captions, and no human has proofread them. The videos are taught in Mandarin; the slides are in English. Each section opens with its official video and the approximate time ranges. Page numbers refer to the number at the lower right of each slide (0/23 to 23/23), and wherever the text says "in the lecture" it is paraphrasing what is said in the video.

This is Techniques Lecture 2 in [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en). The Roadmap on page 1 of the handout divides Techniques into three ways of handling features, and this lecture belongs to the first, Embedding Numerous Features: Kernel Models. The conclusion of the previous lecture, [Techniques Lecture 1: Linear SVM](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm-en), takes up a single line on that page: linear SVM is more robust and solvable with quadratic programming (QP). This lecture deals with what the previous one left open: after a high-dimensional feature transform, that QP has too many variables to solve.

The prerequisites are the standard hard-margin SVM problem and the `QP(Q, p, A, c)` notation from the previous lecture, partial derivatives, and vector inner products. [Foundations Lecture 14: Regularization](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-14-regularization-en) used Lagrange multipliers once; remembering it makes things smoother, but you can follow along without it. After reading, you should be able to derive the dual problem from the primal one step by step on your own, write down the four KKT conditions, compute $\boldsymbol{\alpha}$, $\mathbf{w}$, and $b$ by hand for a small data set, and say which points are support vectors.

The derivation in this lecture runs in a straight line. Here is the whole picture first:

1. **Primal SVM**: the variables are $b$ and $\mathbf{w}$.
2. **Lagrange function**: hide the constraints inside a max.
3. **Swap min and max**: strong duality guarantees the answer does not change.
4. **Partial derivative with respect to $b$**: eliminate $b$.
5. **Partial derivative with respect to $\mathbf{w}$**: eliminate $\mathbf{w}$.
6. **Dual QP**: the only variables left are $\boldsymbol{\alpha}$.
7. **KKT conditions**: recover $\mathbf{w}$ and $b$ from $\boldsymbol{\alpha}$.

## Why solve a different problem: the primal SVM's variable count is tied to the feature dimension

```youtube
url: https://www.youtube.com/watch?v=VUp-17l03lk
title: Dual Support Vector Machine :: Motivation of Dual SVM @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–01:09 reviews the previous lecture, 01:09–05:38 gives the motivation, 05:38–08:16 revisits Lagrange multipliers, 08:16–15:20 covers the Lagrange function, and Fun Time follows.)

### Where the primal problem gets stuck

The previous lecture replaced $\mathbf{x}_n$ with the transformed $\mathbf{z}_n = \boldsymbol{\Phi}(\mathbf{x}_n)$ and got the non-linear hard-margin SVM (page 2 of the handout). Write the dimension of $\mathbf{z}_n$ as $\tilde{d}$:

$$
\min_{b,\mathbf{w}} \ \frac{1}{2}\mathbf{w}^\top\mathbf{w} \qquad \text{subject to} \quad y_n(\mathbf{w}^\top\mathbf{z}_n + b) \ge 1,\quad n = 1, 2, \dots, N
$$

This QP has $\tilde{d}+1$ variables ($b$ plus the $\tilde{d}$ components of $\mathbf{w}$) and $N$ constraints. The handout says the combination we want is "not many" boundaries, thanks to the large margin, and at the same time a sophisticated boundary, thanks to the feature transform. The trouble is that a sophisticated boundary needs a large $\tilde{d}$, and the QP's variable count grows with it; the handout adds one more question: what if $\tilde{d}$ is infinite? In the lecture, Lin calls this a crazy idea: an optimization problem with infinitely many variables looks impossible to solve for now, and this lecture and the next are about finding the mechanism that makes it possible. So the goal of this lecture fits in one line: SVM without dependence on $\tilde{d}$.

Page 3 lists the plan as a comparison:

| | Original SVM | 'Equivalent' SVM |
|---|---|---|
| Type | convex QP | convex QP |
| Variables | $\tilde{d}+1$ | $N$ |
| Constraints | $N$ | $N+1$ |

On the right, the numbers of variables and constraints depend only on the data size $N$. In the lecture, Lin explains that whether you transform the data into a ten-thousand-dimensional space or a twenty-thousand-dimensional one, these two numbers stay the same. The problem on the right comes from a certain dual problem of the original one; in the lecture he describes the two problems as twins that correspond to each other.

The same page has a red warning box, "Warning: Heavy Math!!!!!!": the handout introduces only the necessary math, without rigor, and simply 'claims' results whose details are unnecessary, the way Foundations 'claimed' Hoeffding. In the lecture he adds that fairly deep optimization theory lies behind these results, and anyone who wants every step should turn to an optimization textbook. This article fills in the algebra the handout skips, but it does not prove strong duality either.

### The tool: treating Lagrange multipliers as unknowns

Page 4 first looks back at Foundations Lecture 14. Regularization can be written in two equivalent ways: the constrained $\min_{\mathbf{w}} E_{\text{in}}(\mathbf{w})$ subject to $\mathbf{w}^\top\mathbf{w} \le C$, and the unconstrained $\min_{\mathbf{w}} E_{\text{aug}}(\mathbf{w}) = E_{\text{in}}(\mathbf{w}) + \frac{\lambda}{N}\mathbf{w}^\top\mathbf{w}$. What connects them is the condition the optimal solution must satisfy, $\nabla E_{\text{in}}(\mathbf{w}) + \frac{2\lambda}{N}\mathbf{w} = \mathbf{0}$: every $C$ corresponds to some $\lambda \ge 0$, and that $\lambda$ is the Lagrange multiplier.

The two lectures use the multiplier in opposite ways. Regularization treats $\lambda$ as a given parameter: in the lecture, Lin puts it this way: the user was supposed to give us $C$, and we ask for $\lambda$ directly instead, which makes the problem easy to solve. Dual SVM treats the multipliers as unknowns to solve for. The SVM has $N$ constraints, so there are $N$ multipliers, one per constraint.

### The Lagrange function: constraints hidden in the max

Page 5 of the handout crosses out the multiplier symbol $\lambda_n$ and writes $\alpha_n$ instead. In the lecture, Lin explains that the SVM literature conventionally calls these multipliers $\alpha$, so he follows it. The Lagrange function is the objective plus each constraint multiplied by its own multiplier:

$$
\mathcal{L}(b, \mathbf{w}, \boldsymbol{\alpha}) = \underbrace{\frac{1}{2}\mathbf{w}^\top\mathbf{w}}_{\text{objective}} + \sum_{n=1}^{N} \alpha_n \underbrace{\big(1 - y_n(\mathbf{w}^\top\mathbf{z}_n + b)\big)}_{\text{constraint}}
$$

Rearranging the constraint $y_n(\mathbf{w}^\top\mathbf{z}_n + b) \ge 1$ gives $1 - y_n(\mathbf{w}^\top\mathbf{z}_n + b) \le 0$, and the parenthesis holds exactly this quantity that "should be at most 0". The handout then claims:

$$
\text{SVM} \equiv \min_{b,\mathbf{w}} \Big( \max_{\text{all } \alpha_n \ge 0} \mathcal{L}(b, \mathbf{w}, \boldsymbol{\alpha}) \Big)
$$

In the lecture, Lin describes this two-level expression as a scoring process: for each $(b, \mathbf{w})$ that comes in, tune $\boldsymbol{\alpha}$ to make $\mathcal{L}$ as large as possible, and that maximum is the score of this $(b, \mathbf{w})$; once every $(b, \mathbf{w})$ has been scored, pick the one with the lowest score. What the score is depends on whether this $(b, \mathbf{w})$ is a "bad" one or a "good" one:

- **$(b, \mathbf{w})$ violates some constraint.** The parenthesis of that constraint is positive. The larger you make the corresponding $\alpha_n$, the larger $\mathcal{L}$ gets, so the max is $\infty$.
- **$(b, \mathbf{w})$ satisfies every constraint.** Every parenthesis is at most 0, so after multiplying by $\alpha_n \ge 0$ every term is at most 0. The only way to maximize the sum is to make every term 0, and the max is $\frac{1}{2}\mathbf{w}^\top\mathbf{w}$.

So the function the outer min faces is $\infty$ wherever a constraint is violated and $\frac{1}{2}\mathbf{w}^\top\mathbf{w}$ wherever all of them are satisfied. The min never picks $\infty$, so the result is the same thing as the original "minimize $\frac{1}{2}\mathbf{w}^\top\mathbf{w}$ over the feasible region". In the handout's words: constraints now hidden in max. Seen from the level of $(b, \mathbf{w})$, there are no constraints left to watch; in the lecture, Lin says the original constraints tied our hands, and their absence is what later lets us take partial derivatives with respect to $b$ and $\mathbf{w}$ directly.

An addition in this article: $\alpha_n \ge 0$ is necessary here. If negative $\alpha_n$ were allowed, a feasible $(b, \mathbf{w})$ with even one negative parenthesis could push the max to $\infty$ through a negative times a negative, and the argument above would fail.

### Fun Time: the Lagrange function of two points

**Question (page 6):** Consider two transformed examples $(\mathbf{z}_1, +1)$ and $(\mathbf{z}_2, -1)$ with $\mathbf{z}_1 = \mathbf{z}$ and $\mathbf{z}_2 = -\mathbf{z}$. What is the Lagrange function $\mathcal{L}(b, \mathbf{w}, \boldsymbol{\alpha})$ of hard-margin SVM?

1. $\frac{1}{2}\mathbf{w}^\top\mathbf{w} + \alpha_1(1 + \mathbf{w}^\top\mathbf{z} + b) + \alpha_2(1 + \mathbf{w}^\top\mathbf{z} + b)$
2. $\frac{1}{2}\mathbf{w}^\top\mathbf{w} + \alpha_1(1 - \mathbf{w}^\top\mathbf{z} - b) + \alpha_2(1 - \mathbf{w}^\top\mathbf{z} + b)$
3. $\frac{1}{2}\mathbf{w}^\top\mathbf{w} + \alpha_1(1 + \mathbf{w}^\top\mathbf{z} + b) + \alpha_2(1 + \mathbf{w}^\top\mathbf{z} - b)$
4. $\frac{1}{2}\mathbf{w}^\top\mathbf{w} + \alpha_1(1 - \mathbf{w}^\top\mathbf{z} - b) + \alpha_2(1 - \mathbf{w}^\top\mathbf{z} - b)$

**Answer: 2.** The handout only says "By definition"; here is the substitution. For the first example, $y_1 = +1$ and $\mathbf{z}_1 = \mathbf{z}$, so the parenthesis is $1 - (\mathbf{w}^\top\mathbf{z} + b) = 1 - \mathbf{w}^\top\mathbf{z} - b$. For the second, $y_2 = -1$ and $\mathbf{z}_2 = -\mathbf{z}$, so the parenthesis is $1 - (-1)(-\mathbf{w}^\top\mathbf{z} + b) = 1 - \mathbf{w}^\top\mathbf{z} + b$. The two minus signs keep the sign in front of $\mathbf{w}^\top\mathbf{z}$ negative and turn the sign in front of $b$ positive.

Each of the other choices corresponds to a different data set: choice 1 is both examples being $(\mathbf{z}, -1)$, choice 4 is both being $(\mathbf{z}, +1)$, and choice 3 swaps the two labels into $(\mathbf{z}, -1)$ and $(-\mathbf{z}, +1)$. These two points come back in the Fun Time of the third section.

## Swapping min and max, then eliminating b and w

```youtube
url: https://www.youtube.com/watch?v=Yhwtvbzg9Fw
title: Dual Support Vector Machine :: Largange Dual SVM @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–02:36 is weak duality, 02:36–05:35 strong duality, 05:35–09:48 eliminating $b$, 09:48–14:20 eliminating $\mathbf{w}$, 14:20–17:45 the KKT conditions, and Fun Time follows. The YouTube title of this video spells Lagrange as Largange; the spelling on the handout is correct.)

### Weak duality: swapping gives a lower bound

The problem is now $\min_{b,\mathbf{w}} \max_{\boldsymbol{\alpha}} \mathcal{L}$. The outer variables are still $(b, \mathbf{w})$, so $\tilde{d}$ is still there. Page 7 swaps the order of min and max in two steps.

**Step one.** Fix any $\boldsymbol{\alpha}'$ with every $\alpha'_n \ge 0$. For any $(b, \mathbf{w})$, the max picks the largest value over all $\boldsymbol{\alpha}$, so it is certainly no smaller than the value at one particular choice:

$$
\max_{\text{all } \alpha_n \ge 0} \mathcal{L}(b, \mathbf{w}, \boldsymbol{\alpha}) \ \ge\ \mathcal{L}(b, \mathbf{w}, \boldsymbol{\alpha}')
$$

The handout's note is max ≥ any. The left side is no smaller than the right side at every $(b, \mathbf{w})$, so the minimum of the left side is also no smaller than the minimum of the right side (at the left side's minimizer the right side's value already does not exceed it, and the right side's minimum can only be smaller):

$$
\min_{b,\mathbf{w}} \Big( \max_{\text{all } \alpha_n \ge 0} \mathcal{L}(b, \mathbf{w}, \boldsymbol{\alpha}) \Big) \ \ge\ \min_{b,\mathbf{w}} \mathcal{L}(b, \mathbf{w}, \boldsymbol{\alpha}')
$$

**Step two.** The inequality above holds for every $\boldsymbol{\alpha}'$, so it also holds for the one that makes the right side largest. The handout's note is best is one of any:

$$
\min_{b,\mathbf{w}} \Big( \max_{\text{all } \alpha_n \ge 0} \mathcal{L}(b, \mathbf{w}, \boldsymbol{\alpha}) \Big) \ \ge\ \underbrace{\max_{\text{all } \alpha'_n \ge 0} \Big( \min_{b,\mathbf{w}} \mathcal{L}(b, \mathbf{w}, \boldsymbol{\alpha}') \Big)}_{\text{Lagrange dual problem}}
$$

The right side is the Lagrange dual problem. The prime on $\boldsymbol{\alpha}'$ is only notation and is dropped from here on. Setting the math aside, the one-sentence version from the lecture is that the dual problem is what you get by swapping the two actions min and max. Every $\boldsymbol{\alpha}'$ gives the original problem a lower bound, and the dual problem looks for the highest of those lower bounds; solving the dual gives a lower limit on the primal's optimal value, not necessarily the optimal value itself. This '≥' is called weak duality, and it holds for any optimization problem. In the lecture, Lin calls the relation a weak one because all it tells you is which side is above and which is below.

### Strong duality: when equality holds

A lower bound alone is not enough; we want the same answer. Page 8 claims: when equality holds it is called strong duality, and a QP has strong duality as long as three conditions are met, which the handout calls constraint qualification:

- convex primal.
- feasible primal. For the SVM, this means the data is linearly separable in the space after the $\boldsymbol{\Phi}$ transform.
- linear constraints.

The SVM satisfies all three, so there exists a $(b, \mathbf{w}, \boldsymbol{\alpha})$ that is optimal for both sides at once, which the handout calls a primal-dual optimal solution. In the lecture, Lin spends only one sentence on the third condition: the constraints of a QP are linear to begin with. So the first two are the ones that really need checking. The handout does not prove this step, and neither does this article.

What strong duality buys is permission to solve the problem on the right instead. Why is the right side better? In the lecture, Lin explains that the optimization over $(b, \mathbf{w})$ now sits in the inner level, is the first thing to be done, and has no constraints at all. Unconstrained optimization is something we handle better, just as in gradient descent the ball may roll in any direction.

### Eliminating b: the partial derivative with respect to b

The inner level of the dual problem is $\min_{b,\mathbf{w}} \mathcal{L}$ with no constraints on $(b, \mathbf{w})$, so the partial derivatives are 0 at the minimum (page 9); in the lecture, Lin explains that the optimal solution has to be at the bottom of the valley, where the gradient is 0. First separate out the part of $\mathcal{L}$ that contains $b$:

$$
\mathcal{L}(b, \mathbf{w}, \boldsymbol{\alpha}) = \frac{1}{2}\mathbf{w}^\top\mathbf{w} + \sum_{n=1}^{N}\alpha_n\big(1 - y_n\mathbf{w}^\top\mathbf{z}_n\big) - b\sum_{n=1}^{N}\alpha_n y_n
$$

Take the partial derivative with respect to $b$:

$$
\frac{\partial \mathcal{L}}{\partial b} = -\sum_{n=1}^{N}\alpha_n y_n = 0
$$

The handout says there is no loss of optimality if we solve with the constraint $\sum_n \alpha_n y_n = 0$ added. The reason given in the lecture: adding an arbitrary constraint might change the optimal solution, but this one will not, because the optimal solution has to satisfy it anyway. This article adds one more way to see it: $\mathcal{L}$ is linear in $b$, with coefficient $-\sum_n \alpha_n y_n$. Whenever this coefficient is not 0, pushing $b$ to infinity in the right direction makes the inner min $-\infty$. The outer level is looking for a maximum and will not choose an $\boldsymbol{\alpha}$ that makes the inner level $-\infty$, so only $\boldsymbol{\alpha}$ with $\sum_n \alpha_n y_n = 0$ need to be considered.

With this constraint added, the coefficient of the $b$ term is 0 and the whole term vanishes. In the lecture, Lin is blunt about it: $b$ is always going to be multiplied by 0, so why keep writing it; cross it out.

$$
\max_{\text{all } \alpha_n \ge 0,\ \sum y_n\alpha_n = 0} \bigg( \min_{\mathbf{w}}\ \frac{1}{2}\mathbf{w}^\top\mathbf{w} + \sum_{n=1}^{N}\alpha_n\big(1 - y_n\mathbf{w}^\top\mathbf{z}_n\big) \bigg)
$$

The price is that $b$ can no longer be found in the dual problem. At this point in the lecture Lin asks on the students' behalf how we make predictions once $b$ is gone; the answer waits until $\boldsymbol{\alpha}$ has been solved, in the third section.

### Eliminating w: the partial derivative with respect to w

Next take the partial derivative with respect to the $i$-th component of $\mathbf{w}$ (page 10). Differentiating $\frac{1}{2}\mathbf{w}^\top\mathbf{w} = \frac{1}{2}\sum_i w_i^2$ gives $w_i$; differentiating $\mathbf{w}^\top\mathbf{z}_n = \sum_i w_i z_{n,i}$ gives $z_{n,i}$:

$$
\frac{\partial \mathcal{L}}{\partial w_i} = w_i - \sum_{n=1}^{N}\alpha_n y_n z_{n,i} = 0
$$

Every component looks the same, so in vector form this is

$$
\mathbf{w} = \sum_{n=1}^{N}\alpha_n y_n \mathbf{z}_n
$$

The inner level is an upward-opening quadratic in $\mathbf{w}$, so the point where the partial derivatives are 0 is the minimum. Before substituting it back, tidy up the summation term:

$$
\sum_{n=1}^{N}\alpha_n\big(1 - y_n\mathbf{w}^\top\mathbf{z}_n\big) = \sum_{n=1}^{N}\alpha_n - \mathbf{w}^\top\Big(\sum_{n=1}^{N}\alpha_n y_n\mathbf{z}_n\Big) = \sum_{n=1}^{N}\alpha_n - \mathbf{w}^\top\mathbf{w}
$$

The last equality just replaces the parenthesis with $\mathbf{w}$. The inner minimum is therefore

$$
\frac{1}{2}\mathbf{w}^\top\mathbf{w} + \sum_{n=1}^{N}\alpha_n - \mathbf{w}^\top\mathbf{w} = -\frac{1}{2}\mathbf{w}^\top\mathbf{w} + \sum_{n=1}^{N}\alpha_n = -\frac{1}{2}\Big\lVert\sum_{n=1}^{N}\alpha_n y_n\mathbf{z}_n\Big\rVert^2 + \sum_{n=1}^{N}\alpha_n
$$

The coefficients of the two $\mathbf{w}^\top\mathbf{w}$ terms add up to $\frac{1}{2} - 1 = -\frac{1}{2}$. The slide colors the substituted $\mathbf{w}$ purple, and in the lecture Lin explains this is a reminder that it is now a quantity computed from $\boldsymbol{\alpha}$. The inner min is done, so the min can simply be dropped from the expression, and the remaining problem contains only $\boldsymbol{\alpha}$:

$$
\max_{\text{all } \alpha_n \ge 0,\ \sum y_n\alpha_n = 0}\ -\frac{1}{2}\Big\lVert\sum_{n=1}^{N}\alpha_n y_n\mathbf{z}_n\Big\rVert^2 + \sum_{n=1}^{N}\alpha_n
$$

The handout also lists $\mathbf{w} = \sum\alpha_n y_n\mathbf{z}_n$ under the max. It specifies how $\mathbf{w}$ is determined by $\boldsymbol{\alpha}$ and places no restriction on $\boldsymbol{\alpha}$ itself, so it is dropped when the problem is written in standard form in the next section.

### KKT conditions: four things an optimal solution must satisfy

Page 11 collects the conditions used along the way. KKT is an acronym of the surnames of three researchers in optimization. If $(b, \mathbf{w}, \boldsymbol{\alpha})$ is primal-dual optimal, then:

1. **Primal feasible:** $y_n(\mathbf{w}^\top\mathbf{z}_n + b) \ge 1$. These are the constraints of the primal problem.
2. **Dual feasible:** $\alpha_n \ge 0$. These are the constraints of the dual problem.
3. **Dual-inner optimal:** $\sum_n y_n\alpha_n = 0$, and $\mathbf{w} = \sum_n \alpha_n y_n\mathbf{z}_n$. These are the results of the two partial derivatives just taken.
4. **Primal-inner optimal:** $\alpha_n\big(1 - y_n(\mathbf{w}^\top\mathbf{z}_n + b)\big) = 0$, for every $n$.

In the lecture, Lin says the first two go without saying: something that fails a side's own constraints cannot be called a solution of that side.

For the fourth, the handout writes only "at optimal all 'Lagrange terms' disappear". Going back to the argument in the first section makes it clear: a feasible $(b, \mathbf{w})$ makes every term $\alpha_n(\dots)$ at most 0, and for the inner max to reach $\frac{1}{2}\mathbf{w}^\top\mathbf{w}$, every term has to be exactly 0. When a product of two numbers is 0, at least one of them is 0: either $\alpha_n = 0$, or the point makes $y_n(\mathbf{w}^\top\mathbf{z}_n + b) = 1$ exactly. Page 16 gives this condition a name, complementary slackness.

In the lecture, Lin gives it a memorable analogy: $\alpha_n$ and the quantity in the parenthesis are like Harry Potter and Voldemort, and at least one of the two has to die (equal 0); both may die, but both cannot live. For the rest of the lecture he keeps calling this one the Harry Potter condition.

Together the four are the Karush-Kuhn-Tucker (KKT) conditions. The handout says they are necessary for optimality and, here, sufficient as well. Sufficient means that once you find a $(b, \mathbf{w}, \boldsymbol{\alpha})$ that satisfies all four, it is the optimal solution, with no need to compare it against other candidates. The numerical example below relies on this.

### Fun Time: KKT for a one-variable problem

**Question (page 12):** For a single variable $w$, consider minimizing $\frac{1}{2}w^2$ subject to two linear constraints $w \ge 1$ and $w \le 3$. The Lagrange function is $\mathcal{L}(w, \boldsymbol{\alpha}) = \frac{1}{2}w^2 + \alpha_1(1 - w) + \alpha_2(w - 3)$. Which of the following equations that contain $\boldsymbol{\alpha}$ are among the KKT conditions of the optimization problem?

1. $\alpha_1 \ge 0$ and $\alpha_2 \ge 0$
2. $w = \alpha_1 - \alpha_2$
3. $\alpha_1(1 - w) = 0$ and $\alpha_2(w - 3) = 0$
4. all of the above

**Answer: 4.** The handout's answer matches each of the three choices to one condition: choice 1 contains the dual-feasible constraints, choice 2 the dual-inner-optimal constraints, and choice 3 the primal-inner-optimal constraints, which is the Harry Potter condition from the lecture. Choice 2 comes from differentiating with respect to $w$: $\frac{\partial\mathcal{L}}{\partial w} = w - \alpha_1 + \alpha_2 = 0$.

An addition in this article: this problem can be solved outright as a check. Within $1 \le w \le 3$, $\frac{1}{2}w^2$ is better the smaller $w$ is, so $w = 1$. Since $w - 3 = -2 \ne 0$, choice 3 forces $\alpha_2 = 0$; choice 2 then gives $\alpha_1 = w = 1$. Check everything: $\alpha_1 = 1 \ge 0$, $\alpha_2 = 0 \ge 0$, $1 = 1 - 0$, $1 \times (1 - 1) = 0$, $0 \times (1 - 3) = 0$, and all of them hold. The constraint that actually pins down the optimal solution, $w \ge 1$, gets a positive multiplier, and the inactive $w \le 3$ gets a multiplier of 0. This is the same phenomenon as "only points on the boundary can have a positive $\alpha_n$" in the SVM.

## Handing the dual to QP, then recovering w and b from α

```youtube
url: https://www.youtube.com/watch?v=qGk0p7K07Mc
title: Dual Support Vector Machine :: Solving Dual SVM @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–02:23 writes the standard form, 02:23–07:22 maps it to the QP solver, 07:22–10:20 discusses special solvers, 10:20–13:45 recovers $\mathbf{w}$ and $b$ from $\boldsymbol{\alpha}$, and Fun Time follows.)

### Writing it in standard form

Page 13 makes two purely cosmetic changes. First, expand the squared norm into a double sum:

$$
\Big\lVert\sum_{n=1}^{N}\alpha_n y_n\mathbf{z}_n\Big\rVert^2 = \Big(\sum_{n=1}^{N}\alpha_n y_n\mathbf{z}_n\Big)^\top\Big(\sum_{m=1}^{N}\alpha_m y_m\mathbf{z}_m\Big) = \sum_{n=1}^{N}\sum_{m=1}^{N}\alpha_n\alpha_m y_n y_m \mathbf{z}_n^\top\mathbf{z}_m
$$

Second, multiply the whole objective by $-1$ so that the max becomes a min. In the lecture, Lin contrasts this in passing with the earlier time a max was turned into a min by taking a reciprocal, which only works when the quantity being optimized is positive; here a minus sign is added instead. The result is what the handout calls the standard hard-margin SVM dual:

$$
\begin{aligned}
\min_{\boldsymbol{\alpha}}\quad & \frac{1}{2}\sum_{n=1}^{N}\sum_{m=1}^{N}\alpha_n\alpha_m y_n y_m \mathbf{z}_n^\top\mathbf{z}_m - \sum_{n=1}^{N}\alpha_n \\
\text{subject to}\quad & \sum_{n=1}^{N} y_n\alpha_n = 0; \\
& \alpha_n \ge 0,\quad n = 1, 2, \dots, N
\end{aligned}
$$

The variables are the $N$ values $\alpha_n$, and the constraints are one equality plus the $N$ constraints $\alpha_n \ge 0$, $N+1$ in total. What page 3 promised has been delivered. The $\mathbf{w} = \sum\alpha_n y_n\mathbf{z}_n$ that used to sit under the max is gone; the account given in the lecture is that it only describes the relation between $\boldsymbol{\alpha}$ and $\mathbf{w}$, and since we now want to concentrate on solving for $\boldsymbol{\alpha}$, we set it aside for the moment.

The equality has an intuitive reading, also given in the lecture: move the terms with $y_n = +1$ and those with $y_n = -1$ to opposite sides, and it says that the sum of $\alpha_n$ over the positive examples (the points drawn as circles on the slides) must equal the sum of $\alpha_n$ over the negative examples (the points drawn as crosses).

### Mapping to the QP solver's inputs

The QP solver from the previous lecture takes the format $\min_{\mathbf{u}} \frac{1}{2}\mathbf{u}^\top Q\mathbf{u} + \mathbf{p}^\top\mathbf{u}$ subject to $\mathbf{a}_i^\top\mathbf{u} \ge c_i$. Page 14 matches the dual problem to it term by term, with the variable $\mathbf{u}$ now being $\boldsymbol{\alpha}$:

| QP input | What dual SVM fills in | Where it comes from |
|---|---|---|
| The $(n, m)$ entry of $Q$ | $q_{n,m} = y_n y_m \mathbf{z}_n^\top\mathbf{z}_m$ | coefficients of the double sum |
| $\mathbf{p}$ | $-\mathbf{1}_N$ ($N$ copies of $-1$) | $-\sum_n \alpha_n$ |
| $\mathbf{a}_{\ge} = \mathbf{y}$, $c_{\ge} = 0$ | $\mathbf{y}^\top\boldsymbol{\alpha} \ge 0$ | one half of the equality |
| $\mathbf{a}_{\le} = -\mathbf{y}$, $c_{\le} = 0$ | $-\mathbf{y}^\top\boldsymbol{\alpha} \ge 0$ | the other half of the equality |
| $\mathbf{a}_n$ = $n$-th unit direction, $c_n = 0$ | $\alpha_n \ge 0$ | the $N$ lower bounds |

This format accepts only '≥', so the equality $\mathbf{y}^\top\boldsymbol{\alpha} = 0$ has to be split into two inequalities pointing in opposite directions. A note at the bottom of the page says many solvers treat equality and bound constraints specially for numerical stability. The advice in the lecture is that the split above is only a generic illustration; in real use, first read the documentation of the QP program you have, which most likely lets you specify equalities and bounds directly, and then just put the coefficients in the right places.

An addition in this article, on something the handout labels "(convex)" without explaining. For any $\boldsymbol{\alpha}$, $\boldsymbol{\alpha}^\top Q\boldsymbol{\alpha} = \lVert\sum_n \alpha_n y_n\mathbf{z}_n\rVert^2 \ge 0$, so $Q$ is positive semi-definite, the objective is convex, and what the QP solver finds is the global optimum.

### In practice, use a special solver

Page 15 writes this matrix as $Q_D$ (D for dual) and points out two difficulties:

- $q_{n,m} = y_n y_m\mathbf{z}_n^\top\mathbf{z}_m$ is often non-zero (the inner product is 0 only when the two vectors happen to be perpendicular), so $Q_D$ is a dense matrix. In the lecture, Lin compares it with the previous lecture: the primal problem's $Q$ contains an identity matrix, with values only on the diagonal and 0 everywhere else.
- The handout's number is that with $N = 30{,}000$, a dense $Q_D$ takes more than 3G of memory. What Lin says in the lecture is that even if you use the symmetry and store only half, it still takes more than 3G. This article's check: $30{,}000^2 = 9 \times 10^8$ entries, half of that is $4.5 \times 10^8$, and at 8 bytes per double-precision floating-point number the total is 3.6 GB.

So with a lot of data you need a solver written specifically for the SVM: one that does not store the whole $Q_D$ (the approach mentioned in the lecture is to compute only the entries that are needed, when they are needed) and that properly exploits the special structure of the one equality and the $N$ lower bounds. The handout's conclusion is that it is usually better to use a special solver in practice. In the lecture, Lin puts it more strongly: hand this problem to a general-purpose program as an ordinary QP and it may take forever to solve.

### Recovering w and b from α

After the solver returns the optimal $\boldsymbol{\alpha}$, it still has to be converted back into $(b, \mathbf{w})$ before we can predict; in the lecture, Lin says $\boldsymbol{\alpha}$ is only an intermediate product. Page 16 uses the KKT conditions:

**$\mathbf{w}$:** use the third condition directly, $\mathbf{w} = \sum_n \alpha_n y_n\mathbf{z}_n$.

**$b$:** the third condition does not contain $b$. The first condition (primal feasible) gives $b$ only a range: points with $y_n = +1$ require $b \ge 1 - \mathbf{w}^\top\mathbf{z}_n$, and points with $y_n = -1$ require $b \le -1 - \mathbf{w}^\top\mathbf{z}_n$. An equality has to come from the fourth condition. As soon as we find one point with $\alpha_n > 0$ (Harry Potter lives, so Voldemort has to die), complementary slackness forces

$$
1 - y_n(\mathbf{w}^\top\mathbf{z}_n + b) = 0 \quad\Longrightarrow\quad y_n(\mathbf{w}^\top\mathbf{z}_n + b) = 1
$$

Multiply both sides by $y_n$; since $y_n^2 = 1$, this gives $\mathbf{w}^\top\mathbf{z}_n + b = y_n$, that is,

$$
b = y_n - \mathbf{w}^\top\mathbf{z}_n
$$

A reminder from the lecture: mathematically, every point with $\alpha_n > 0$ yields the same $b$; with a real solver, numerical error makes different points yield slightly different values of $b$.

$y_n(\mathbf{w}^\top\mathbf{z}_n + b) = 1$ is exactly what the previous lecture called being on the fat boundary. So complementary slackness also has a geometric reading, which the handout puts at the bottom of the page: a point with $\alpha_n > 0$ must be on the fat boundary, and it is a support vector (SV).

An addition in this article: is a point with $\alpha_n > 0$ guaranteed to exist? If every $\alpha_n$ were 0, the third condition would give $\mathbf{w} = \mathbf{0}$, and the first would become $y_n b \ge 1$ for every $n$. When the data contains both positive and negative examples, $b \ge 1$ and $-b \ge 1$ cannot both hold, so the optimal solution always has at least one positive $\alpha_n$.

### A numerical example: solving the dual for four points

The calculation below was done for this article and is not on the slides. The data is the four points whose primal problem the previous lecture's handout solved by hand (page 17 of that handout). The figure on page 18 of this lecture's handout shows the same data, but the handout does not list the dual solution. No feature transform is used here, so $\mathbf{z}_n = \mathbf{x}_n$.

| $n$ | $\mathbf{z}_n$ | $y_n$ |
|---|---|---|
| 1 | $(0, 0)$ | $-1$ |
| 2 | $(2, 2)$ | $-1$ |
| 3 | $(2, 0)$ | $+1$ |
| 4 | $(3, 0)$ | $+1$ |

**Step 1: compute $Q_D$.** For example, $q_{2,3} = y_2 y_3\,\mathbf{z}_2^\top\mathbf{z}_3 = (-1)(+1)(2 \times 2 + 2 \times 0) = -4$. All of the entries:

$$
Q_D = \begin{bmatrix} 0 & 0 & 0 & 0 \\ 0 & 8 & -4 & -6 \\ 0 & -4 & 4 & 6 \\ 0 & -6 & 6 & 9 \end{bmatrix}
$$

The first row and first column are all 0 because $\mathbf{z}_1$ is the origin, whose inner product with anything is 0.

**Step 2: write out the dual problem.** The constraints are $-\alpha_1 - \alpha_2 + \alpha_3 + \alpha_4 = 0$ and the four $\alpha_n \ge 0$. Expanding the objective directly from $Q_D$ produces six cross terms; it is cleaner to start from $\mathbf{w} = \sum_n \alpha_n y_n\mathbf{z}_n$, because the quadratic term is just $\frac{1}{2}\lVert\mathbf{w}\rVert^2$:

$$
\mathbf{w} = -\alpha_1(0,0) - \alpha_2(2,2) + \alpha_3(2,0) + \alpha_4(3,0) = (2\alpha_3 + 3\alpha_4 - 2\alpha_2,\ -2\alpha_2)
$$

**Step 3: use the equality to eliminate one variable.** The equality gives $\alpha_3 = \alpha_1 + \alpha_2 - \alpha_4$. Substituting, the first component of $\mathbf{w}$ becomes $2\alpha_1 + 2\alpha_2 - 2\alpha_4 + 3\alpha_4 - 2\alpha_2 = 2\alpha_1 + \alpha_4$, and $\sum_n \alpha_n = (\alpha_1 + \alpha_2) + (\alpha_3 + \alpha_4) = 2\alpha_1 + 2\alpha_2$. The objective becomes

$$
\frac{1}{2}\Big[(2\alpha_1 + \alpha_4)^2 + (2\alpha_2)^2\Big] - 2\alpha_1 - 2\alpha_2 = \underbrace{\big(2\alpha_2^2 - 2\alpha_2\big)}_{\text{only } \alpha_2} + \underbrace{\Big(\frac{1}{2}(2\alpha_1 + \alpha_4)^2 - 2\alpha_1\Big)}_{\alpha_1 \text{ and } \alpha_4}
$$

**Step 4: minimize the two pieces separately.**

- The first piece, $2\alpha_2^2 - 2\alpha_2$: the derivative gives $4\alpha_2 - 2 = 0$, so $\alpha_2 = \frac{1}{2}$ and the value is $-\frac{1}{2}$.
- The second piece: let $u = 2\alpha_1 + \alpha_4$, so $2\alpha_1 = u - \alpha_4$ and this piece equals $\frac{1}{2}u^2 - u + \alpha_4$. Since $\alpha_4 \ge 0$ and it can only increase the value, $\alpha_4 = 0$. That leaves $\frac{1}{2}u^2 - u$, whose derivative gives $u - 1 = 0$, so $u = 1$, that is, $\alpha_1 = \frac{1}{2}$, and the value is $-\frac{1}{2}$.

Going back, $\alpha_3 = \frac{1}{2} + \frac{1}{2} - 0 = 1$, which does not violate $\alpha_3 \ge 0$. The dual solution is

$$
\boldsymbol{\alpha} = \Big(\frac{1}{2},\ \frac{1}{2},\ 1,\ 0\Big),\qquad \text{objective} = -\frac{1}{2} - \frac{1}{2} = -1
$$

**Step 5: recover $\mathbf{w}$ and $b$.**

$$
\mathbf{w} = -\frac{1}{2}(0,0) - \frac{1}{2}(2,2) + 1 \cdot (2,0) + 0 \cdot (3,0) = (1, -1)
$$

The circles-and-crosses reading of the equality checks out too: $\alpha_1 + \alpha_2 = 1$ for the negative examples and $\alpha_3 + \alpha_4 = 1$ for the positive ones. Compute $b$ from any point with $\alpha_n > 0$: point 1 gives $b = -1 - 0 = -1$; point 2 gives $b = -1 - (2 - 2) = -1$; point 3 gives $b = 1 - 2 = -1$. All three points give the same $b = -1$.

**Step 6: check KKT.**

| $n$ | $\alpha_n$ | $y_n(\mathbf{w}^\top\mathbf{z}_n + b)$ | On the fat boundary? | $\alpha_n \times (1 - \text{column to the left})$ |
|---|---|---|---|---|
| 1 | $\frac{1}{2}$ | $(-1)(0 - 1) = 1$ | Yes | $0$ |
| 2 | $\frac{1}{2}$ | $(-1)(2 - 2 - 1) = 1$ | Yes | $0$ |
| 3 | $1$ | $(+1)(2 - 0 - 1) = 1$ | Yes | $0$ |
| 4 | $0$ | $(+1)(3 - 0 - 1) = 2$ | No | $0$ |

All four conditions hold: the third column is at least 1 for every point, no $\alpha_n$ is negative, $\sum_n y_n\alpha_n = -\frac{1}{2} - \frac{1}{2} + 1 + 0 = 0$, and the last column is all 0.

**What this result means.** The classifier is $g_{\text{SVM}}(\mathbf{x}) = \text{sign}(x_1 - x_2 - 1)$, the same as the answer $(w_1, w_2, b) = (1, -1, -1)$ that the previous lecture's handout got by solving the primal directly, and the margin is $1/\lVert\mathbf{w}\rVert = 1/\sqrt{2} \approx 0.707$, the number marked on the figure on page 18. The support vectors are points 1, 2, and 3; point 4 is farther from the boundary and has $\alpha_4 = 0$, and if you remove it from the data, the result of every step above stays the same.

Strong duality is visible as well. Written as a max, the dual's optimal value is $-(-1) = 1$, and the primal's optimal value is $\frac{1}{2}\mathbf{w}^\top\mathbf{w} = \frac{1}{2}(1 + 1) = 1$; the two are equal. Other feasible $\boldsymbol{\alpha}$ give only lower bounds that are worse:

| Feasible $\boldsymbol{\alpha}$ | $-\frac{1}{2}\lVert\sum_n\alpha_n y_n\mathbf{z}_n\rVert^2 + \sum_n\alpha_n$ | Compared with the primal optimum 1 |
|---|---|---|
| $(0, 0, 0, 0)$ | $0$ | lower |
| $(\frac{1}{4}, \frac{1}{4}, \frac{1}{2}, 0)$ | $-\frac{1}{4} + 1 = \frac{3}{4}$ | lower |
| $(\frac{1}{2}, \frac{1}{2}, \frac{1}{2}, \frac{1}{2})$ | $-\frac{13}{8} + 2 = \frac{3}{8}$ | lower |
| $(\frac{1}{2}, \frac{1}{2}, 1, 0)$ | $-1 + 2 = 1$ | equal |

In the third row, $\mathbf{w} = -\frac{1}{2}(2,2) + \frac{1}{2}(2,0) + \frac{1}{2}(3,0) = (\frac{3}{2}, -1)$ and $\frac{1}{2}\lVert\mathbf{w}\rVert^2 = \frac{13}{8}$; you can work out the other rows the same way. Handing the same $Q_D$, $\mathbf{p} = -\mathbf{1}_4$, and constraints to a numerical QP solver (for example cvxopt in Python) also returns $\boldsymbol{\alpha} = (0.5, 0.5, 1, 0)$ with objective value $-1$, in agreement with the hand calculation.

### Fun Time: two symmetric points, what is b

**Question (page 17):** Take the two examples from the first section's Fun Time, $(\mathbf{z}, +1)$ and $(-\mathbf{z}, -1)$. After solving the dual problem of hard-margin SVM, assume that the optimal $\alpha_1$ and $\alpha_2$ are both strictly positive. What is the optimal $b$?

1. $-1$
2. $0$
3. $1$
4. not certain with the descriptions above

**Answer: 2.** Both $\alpha$ are positive, so either point can be used to compute $b$. The first point: $b = y_1 - \mathbf{w}^\top\mathbf{z}_1 = +1 - \mathbf{w}^\top\mathbf{z}$. The second point: $b = y_2 - \mathbf{w}^\top\mathbf{z}_2 = -1 + \mathbf{w}^\top\mathbf{z}$. Adding the two gives $2b = 0$, so $b = 0$; subtracting them gives $\mathbf{w}^\top\mathbf{z} = 1$. The reason given in the lecture is a single sentence: because of symmetry. The two points are symmetric about the origin, so the fattest separating line passes through the origin as well.

Choices 1 and 3 each satisfy only one of the two equations. Choice 4 is wrong because the two equations are already enough to determine $b$, without knowing what $\mathbf{z}$ is.

An addition in this article: even $\boldsymbol{\alpha}$ can be solved. The equality constraint $\alpha_1 - \alpha_2 = 0$ gives $\alpha_1 = \alpha_2 = \alpha$, so $\mathbf{w} = \alpha\mathbf{z} - \alpha(-\mathbf{z}) = 2\alpha\mathbf{z}$. Substituting into $\mathbf{w}^\top\mathbf{z} = 1$ gives $\alpha = \frac{1}{2\lVert\mathbf{z}\rVert^2}$. With $\mathbf{z} = (1, 2)$ as an example, $\alpha_1 = \alpha_2 = \frac{1}{10}$, $\mathbf{w} = (\frac{1}{5}, \frac{2}{5})$, $b = 0$, and $y_n(\mathbf{w}^\top\mathbf{z}_n + b)$ is 1 for both points. The farther apart the two points are, the smaller $\alpha$ is. As long as $\mathbf{z} \ne \mathbf{0}$, both $\alpha$ are always positive, so the assumption in the question holds automatically.

## What the dual solution reveals: support vectors, and the feature dimension we haven't escaped

```youtube
url: https://www.youtube.com/watch?v=agmmQh702aA
title: Dual Support Vector Machine :: Messages behind Dual SVM @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–03:17 is support vectors, 03:17–05:43 the comparison with PLA, 05:43–07:31 the comparison of the two forms, 07:31–09:13 what remains unsolved, followed by Fun Time and the summary.)

### The formal definition of support vectors

The previous lecture said that the points on the fat boundary determine the fattest hyperplane and the other points are not needed, and it called the points on the boundary support vector candidates. Page 18 now gives the formal definition: only examples $(\mathbf{z}_n, y_n)$ with $\alpha_n > 0$ are called support vectors. On the slide, the word "(candidates)" is crossed out.

The relation between the two groups of points is

$$
\text{SV (positive } \alpha_n\text{)} \ \subseteq\ \text{SV candidates (on boundary)}
$$

Complementary slackness guarantees only one direction: a point with $\alpha_n > 0$ must be on the boundary. Conversely, a point on the boundary can have $\alpha_n$ equal to 0 (self-check question 2 has an example). In the lecture, Lin explains that there may be somewhat fewer support vectors than candidate points on the boundary, or just as many. The figure on page 18 shows the four points from above: the gray band is the fat boundary, the line in the middle is labeled $x_1 - x_2 - 1 = 0$, and the width is labeled 0.707; the three points $(0,0)$, $(2,2)$, and $(2,0)$ are drawn with boxes around them, and $(3,0)$ is not.

With this definition, both formulas for computing $\mathbf{w}$ and $b$ involve only the support vectors:

$$
\mathbf{w} = \sum_{n=1}^{N}\alpha_n y_n\mathbf{z}_n = \sum_{\text{SV}}\alpha_n y_n\mathbf{z}_n, \qquad b = y_n - \mathbf{w}^\top\mathbf{z}_n \ \text{ (with any SV)}
$$

Terms with $\alpha_n = 0$ contribute nothing to the sum, so the first equality can sum over the SVs only. The handout sums up this page as: SVM learns the fattest hyperplane by identifying support vectors with the dual optimal solution. In the lecture, Lin describes the same thing from another angle: the SVM works like a filter that sorts the data into two kinds, where the support vectors are useful and the other points do not help in finding the fat boundary and can be ignored.

### w is a linear combination of the data: SVM and PLA side by side

Page 19 puts the SVM's $\mathbf{w}$ next to PLA from [Foundations Lecture 2: Perceptrons and PLA](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm-en):

| | How $\mathbf{w}$ is written | Where the coefficients come from |
|---|---|---|
| SVM | $\mathbf{w}_{\text{SVM}} = \sum_{n=1}^{N}\alpha_n(y_n\mathbf{z}_n)$ | the solution of the dual problem |
| PLA | $\mathbf{w}_{\text{PLA}} = \sum_{n=1}^{N}\beta_n(y_n\mathbf{z}_n)$ | the number of times example $n$ was used to correct a mistake |

PLA starts from $\mathbf{w} = \mathbf{0}$ and adds one $y_n\mathbf{z}_n$ every time it makes a mistake, so the final $\mathbf{w}$ is naturally a sum of integer multiples of these vectors. The handout points out that in both cases $\mathbf{w}$ is a linear combination of the $y_n\mathbf{z}_n$, and calls $\mathbf{w}$ 'represented' by data; the same is true of logistic regression and linear regression trained with gradient descent or stochastic gradient descent starting from $\mathbf{w}_0 = \mathbf{0}$, which is why Lin says in the lecture that the resemblance between SVM and PLA is not entirely a coincidence. What is special about the SVM is that it represents $\mathbf{w}$ by the support vectors only.

In the lecture, Lin also brings out a layer of this comparison that is worth thinking about: the two algorithms disagree about which data matters. The SVM considers the points near the boundary important, PLA considers the points that are frequently misclassified important, and each represents $\mathbf{w}$ with the points it considers important.

### Comparing the two forms

Page 20 sets the two forms of hard-margin SVM side by side. The dual column is written with matrices: $\min_{\boldsymbol{\alpha}} \frac{1}{2}\boldsymbol{\alpha}^\top Q_D\boldsymbol{\alpha} - \mathbf{1}^\top\boldsymbol{\alpha}$ subject to $\mathbf{y}^\top\boldsymbol{\alpha} = 0$ and $\alpha_n \ge 0$.

| | Primal | Dual |
|---|---|---|
| Variables | $\tilde{d}+1$ | $N$ |
| Constraints | $N$ | $N+1$, simple in form |
| Suitable when | $\tilde{d}+1$ small | $N$ small |
| Physical meaning | locate specially-scaled $(b, \mathbf{w})$ | locate SVs and their $\alpha_n$ |

Lin is more cautious in the lecture about the "suitable when $N$ small" cell: with too much data the dual is not easy to solve either, and the dual is used as a replacement only when the data is not large, or at least still solvable. Both eventually result in the same fattest hyperplane, and the classifier in both cases is $g_{\text{SVM}}(\mathbf{x}) = \text{sign}(\mathbf{w}^\top\boldsymbol{\Phi}(\mathbf{x}) + b)$.

### Not done yet: d̃ hides in the Q matrix

The title of page 21 is Are We Done Yet?. The dual problem has $N$ variables and $N+1$ constraints, with no $\tilde{d}$ in sight on the surface. But to hand the problem to a solver, we first have to compute every entry of $Q_D$,

$$
q_{n,m} = y_n y_m\,\mathbf{z}_n^\top\mathbf{z}_m
$$

$\mathbf{z}_n^\top\mathbf{z}_m$ is an inner product of two $\tilde{d}$-dimensional vectors; computed by definition, multiplying component by component and adding up, it costs $O(\tilde{d})$. The dependence on $\tilde{d}$ has moved from "the number of variables" to "the time to compute the matrix entries" and has not disappeared; in the lecture, Lin puts it as $\tilde{d}$ having gone into hiding where $Q_D$ is computed, and if $\tilde{d}$ is infinite, this takes infinitely many steps and never finishes.

The handout's conclusion is that there is no dependence on $\tilde{d}$ only if we avoid this naïve computation, which is the business of the next lecture. The "Escaping Feature Dimension" in this article's title is only half done in this lecture: the number of variables has escaped, the computation of inner products has not.

### Fun Time: how many points can be on the boundary

**Question (page 22):** Consider applying dual hard-margin SVM on $N = 5566$ examples and getting 1126 SVs. Which of the following can be the number of examples that are on the fat boundary, that is, SV candidates?

1. $0$
2. $1024$
3. $1234$
4. $9999$

**Answer: 3.** SVs are always on the fat boundary, and there cannot be more points on the boundary than there are examples, so

$$
1126 = \#\text{SV} \ \le\ \#\text{SV candidates} \ \le\ N = 5566
$$

Of the four choices, only 1234 falls in this range. 0 and 1024 are smaller than the number of support vectors, and 9999 is larger than the total number of examples.

The summary on page 23 condenses each of the four sections into a line: want to remove dependence on $\tilde{d}$; KKT conditions link primal/dual; another QP, better solved with special solver; SVs represent fattest hyperplane. The preview of the next lecture is computing inner product in $\mathbb{R}^{\tilde{d}}$ efficiently.

## Self-check

**1. Two two-dimensional examples: $\mathbf{z}_1 = (1, 1)$ with $y_1 = +1$, and $\mathbf{z}_2 = (0, 0)$ with $y_2 = -1$. Compute the dual solution $\boldsymbol{\alpha}$ by hand, then recover $\mathbf{w}$ and $b$.**

Answer: the equality constraint gives $\alpha_1 = \alpha_2 = \alpha$. Then $\mathbf{w} = \alpha(1,1) - \alpha(0,0) = (\alpha, \alpha)$, the objective is $\frac{1}{2}(2\alpha^2) - 2\alpha = \alpha^2 - 2\alpha$, and differentiating gives $\alpha = 1$. So $\boldsymbol{\alpha} = (1, 1)$ and $\mathbf{w} = (1, 1)$. Point 1 gives $b = 1 - 2 = -1$ and point 2 gives $b = -1 - 0 = -1$, which agree. For both points $y_n(\mathbf{w}^\top\mathbf{z}_n + b)$ is 1, and both are support vectors.

**2. Three examples: $(0, 0)$ labeled $-1$, $(2, 0)$ labeled $+1$, and $(2, 5)$ labeled $+1$. The optimal solution is $\mathbf{w} = (1, 0)$, $b = -1$. Which points are on the fat boundary? Which are support vectors?**

Answer: $y_n(\mathbf{w}^\top\mathbf{z}_n + b)$ for the three points is $(-1)(-1) = 1$, $2 - 1 = 1$, and $2 - 1 = 1$, so all three are on the fat boundary and all are SV candidates. Now use $\mathbf{w} = \sum_n \alpha_n y_n\mathbf{z}_n$: $(1, 0) = \alpha_2(2, 0) + \alpha_3(2, 5)$, where the second component requires $5\alpha_3 = 0$, so $\alpha_3 = 0$ and $\alpha_2 = \frac{1}{2}$, and the equality constraint gives $\alpha_1 = \frac{1}{2}$. Only the first two points are support vectors. $(2, 5)$ is on the boundary yet is not a support vector, which is why the "⊆" cannot be written as "=".

**3. Why does the constraint $\sum_n \alpha_n y_n = 0$ appear in the derivation? If some $\boldsymbol{\alpha}$ does not satisfy it, what is the inner $\min_{b,\mathbf{w}} \mathcal{L}$?**

Criteria: the answer should say that $\mathcal{L}$ is linear in $b$ with coefficient $-\sum_n \alpha_n y_n$; that when the coefficient is not 0, $b$ can make $\mathcal{L}$ arbitrarily small, so the inner min is $-\infty$; and that the outer max will not choose such an $\boldsymbol{\alpha}$, so adding the constraint does not change the answer while making the term containing $b$ vanish.

**4. In the four-point example, is $\boldsymbol{\alpha} = (1, 1, 2, 0)$ feasible? What lower bound does it give for the primal problem?**

Answer: $-1 - 1 + 2 + 0 = 0$ and no component is negative, so it is feasible. $\mathbf{w} = -(2, 2) + 2(2, 0) = (2, -2)$, $\frac{1}{2}\lVert\mathbf{w}\rVert^2 = 4$, $\sum_n \alpha_n = 4$, and the lower bound is $-4 + 4 = 0$. It is twice the optimal solution: the direction is right but it overshoots, and the lower bound of 0 it gives is worse than the optimal value 1.

**5. There are $N = 1{,}000$ examples and, after the feature transform, $\tilde{d} = 10^6$. How many variables do the primal and dual QPs each have? The dual is smaller, so where does it pay?**

Answer: the primal has $10^6 + 1$ variables and the dual has $1{,}000$. The cost is in preparing $Q_D$: it has $10^6$ entries, each needing one $10^6$-dimensional inner product, about $10^{12}$ multiplications in total when computed by definition (symmetry saves half). There are fewer variables, but $\tilde{d}$ still shows up in the amount of computation.

## Exercises and corresponding reading

**The corresponding week in two semesters.** The [Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) puts linear SVM and dual SVM in the same week (W9, 10/28), and the slide code for this lecture is `202u`. The [Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) also puts them in W9 (11/04), with the two lectures taught together. The Fall 2026 slides for that week were not yet online as of 2026-09-30, so this article uses only the MOOC handout.

**Textbook.** Both course pages map this lecture to e-8.2 of [Learning from Data](http://amlbook.com) (LFD). e-Chapter 8 is one of LFD's online chapters.

**Homework.** This lecture had no homework of its own in Fall 2024. The related problems are in [Fall 2024 HW6](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf) (released 2024-11-18, due 12-02), which has no official solutions:

- **Q1**: write PLA's $\mathbf{w}$ as $\sum_n \alpha_n\boldsymbol{\Phi}(\mathbf{x}_n)$ and ask how $\boldsymbol{\alpha}$ should be updated at each correction. This extends "$\mathbf{w}$ represented by data" from page 19. You can write this version of PLA yourself and compare it with ordinary PLA on the same data to see whether $\mathbf{w}$ agrees at every step.
- **Q13 (bonus)**: derive the dual of the soft-margin SVM dual problem and compare it with the primal. Get fluent with this lecture's four steps (write the Lagrange function, swap, take partial derivatives, substitute back) before attempting it.

The guide to the whole assignment is in [Techniques Homework and Final Project](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project-en).

**Further reading.** [Chapter 6 of the CS229 main notes](https://cs229.stanford.edu/main_notes.pdf) derives the SVM dual in a different way and can be read alongside this lecture's version.

**Next lecture.** [Techniques Lecture 3: Kernel SVM](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm-en) deals with the $\mathbf{z}_n^\top\mathbf{z}_m$ this lecture leaves behind: getting the inner product without computing the $\tilde{d}$-dimensional features.

## Course video sources

Original videos: [Motivation of Dual SVM](https://www.youtube.com/watch?v=VUp-17l03lk), [Lagrange Dual SVM](https://www.youtube.com/watch?v=Yhwtvbzg9Fw), [Solving Dual SVM](https://www.youtube.com/watch?v=qGk0p7K07Mc), [Messages behind Dual SVM](https://www.youtube.com/watch?v=agmmQh702aA)

- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

Checked: 2026-10-13. The video IDs, titles, and lengths were taken from the official playlist on 2026-10-13; the videos have no caption track on YouTube, and what this article reports from the lecture comes from transcripts made for it.

## Update Log

- 2026-10-13: Changed to one article per lecture. This article covers only Techniques Lecture 2 and was rewritten from the handout and the video transcripts.

## References

- [Techniques Lecture 2 handout, 202_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/202_handout.pdf): the main source for this article. The derivations in the four sections, the four Fun Time questions, and the figure on page 18 all come from this handout.
- [Techniques Lecture 1 handout, 201_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/201_handout.pdf): the four points used in the numerical example and the primal solution $(1, -1, -1)$ come from its page 17.
- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2): the IDs and titles of the four videos; what the text reports as said "in the lecture" is paraphrased from machine transcripts of these four videos.
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/): the official entry for handouts and recordings.
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/): the corresponding week and LFD chapter.
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/): the corresponding week and LFD chapter.
- [Fall 2024 Homework 6 (hw6_red.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf): the content of Q1 and Q13.
- [Learning from Data textbook website](http://amlbook.com): the source of e-8.2.
- [CS229 main notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf): further reading, the SVM dual derivation in Chapter 6.
- [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques: Course Overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en): where this lecture sits in the whole course and the reading routes.
