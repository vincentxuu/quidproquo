---
title: "Linear Regression: The Pseudo-Inverse Solution in One Step | NTU Hsuan-Tien Lin Machine Learning Foundations Lecture 9"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, linear-regression]
lang: en
math: true
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 9
tldr: "Linear regression writes the squared error as (1/N)‖Xw − y‖², sets the gradient to zero, and gets w_LIN = X†y with no iteration. The hat matrix H = XX† projects y onto the space spanned by the columns of X, and trace(I − H) = N − (d+1), which gives average E_in = σ²(1 − (d+1)/N) and average E_out = σ²(1 + (d+1)/N). Squared error is also an upper bound on the 0/1 error, so w_LIN can be used for binary classification too."
description: "A guide to Lecture 9, Linear Regression, of Hsuan-Tien Lin's Machine Learning Foundations (NTU): the linear regression hypothesis and squared error, the matrix form of E_in and its gradient, the pseudo-inverse solution, the geometry of the hat matrix and the learning curve, and why regression can be used for binary classification. All four Fun Time questions are explained one by one, and the whole algorithm is worked by hand on data from four customers."
draft: false
glossary:
  - term: "pseudo-inverse"
    aliases: ["pseudoinverse", "X†"]
    definition: "The X† in the linear regression solution w_LIN = X†y. When XᵀX is invertible it equals (XᵀX)⁻¹Xᵀ; when it is not, X† can still be defined in other ways and gives one of the many optimal solutions."
    context: "Foundations Lecture 9 recommends using an existing, numerically stable pseudo-inverse routine instead of computing (XᵀX)⁻¹Xᵀ yourself."
    links:
      - label: "Lecture 9 handout"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/09_handout.pdf"
  - term: "hat matrix"
    aliases: ["H = XX†"]
    definition: "The matrix H = XX† that turns the label vector y into the prediction vector ŷ in linear regression. Geometrically it projects y onto the space spanned by the columns of X. The name comes from putting a hat on y to make ŷ."
    context: "Foundations Lecture 9 uses trace(I − H) = N − (d+1) to derive the average E_in and average E_out of linear regression."
    links:
      - label: "Lecture 9 handout"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/09_handout.pdf"
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression)

**Video status: Videos included.** This article is written from the official MOOC handout [09_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/09_handout.pdf) and transcripts of this lecture's four official videos, with formulas following the handout. The transcripts are machine transcripts made for this article (Whisper), not official captions, and no human has proofread them. The videos are taught in Mandarin; the slides are in English. Each section opens with its official video and the approximate time ranges. Page numbers refer to the number at the lower right of each slide (0/23 to 23/23), and wherever the text says "in the lecture", it is paraphrasing what is said in the videos.

This is Foundations Lecture 9 in [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en). On the Roadmap on page 1 of the handout, this lecture begins the third of the four big questions: How Can Machines Learn? The conclusion of the previous question takes up one line on the same page: learning can happen as long as there is a target distribution $P(y \mid \mathbf{x})$ and $E_{\text{in}}$ can be made low with respect to the chosen error measure err. That is the conclusion of [Foundations Lecture 8: Noise and Error Measures](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-08-noise-and-error-en). The lecture opens with one more remark: the VC bound, proved with so much effort for binary classification, carries over to other error measures and to noisy settings, regression included, so attention can now go to how the algorithm is designed.

The prerequisites are matrix multiplication, transposes, inverses, partial derivatives, and, from earlier lectures, $E_{\text{in}}$, $E_{\text{out}}$, and the perceptron hypothesis $\text{sign}(\mathbf{w}^\top\mathbf{x})$. After reading, you should be able to write $E_{\text{in}}$ in matrix form on your own, derive the gradient, solve for $\mathbf{w}_{\text{LIN}}$, and run the whole algorithm by hand on a small data set; to say what the hat matrix does and where the two learning-curve formulas come from; and to explain why the regression solution can be used directly for classification.

## The output changes from "approve or not" to "how much credit"

```youtube
url: https://www.youtube.com/watch?v=qGzjYrLV-4Y
title: Linear Regression :: Linear Regression Problem @ Machine Learning Foundations (機器學習基石)
```

(Video 00:18–02:05 sets up the problem, 02:05–04:01 covers the hypothesis, 04:01–06:41 the illustration and residuals, 06:41–09:10 the error measure, and Fun Time follows.)

### The credit limit problem

The running example in earlier lectures was a bank deciding whether to issue a credit card, with only two possible outputs. Page 2 of the handout changes it to the Credit Limit Problem: for the same customer (23 years old, female, annual salary NTD 1,000,000, 1 year in residence, 0.5 year in job, current debt 200,000), the bank now has to decide how large a limit to give, and the answer on the slide reads 100,000. In the lecture, Lin explains that this is no longer a yes/no question: this customer might get NTD 100,000 and another might get NTD 80,000.

The learning flow diagram is the same as before: the unknown target function $f$ (the ideal credit limit formula), the training examples $\mathcal{D}$ (historical records in the bank), the hypothesis set $\mathcal{H}$, the algorithm $\mathcal{A}$, and the final $g \approx f$. The only difference is written at the bottom of the page:

$$
\mathcal{Y} = \mathbb{R} \quad\Longrightarrow\quad \text{regression}
$$

The output space is all of the real numbers, and problems of this kind are called regression. The lecture adds a side note: a credit limit can only be positive, since a bank does not hand out a negative limit, but it is more convenient to take a wider view of the output space and treat it as all of the reals.

### The hypothesis: a perceptron without the sign

Page 3 picks the simplest hypothesis. Write the customer's features as $\mathbf{x} = (x_0, x_1, \dots, x_d)$, where $x_0$ is the constant term added by convention, and approximate the desired credit limit with a weighted sum:

$$
y \approx \sum_{i=0}^{d} w_i x_i, \qquad h(\mathbf{x}) = \mathbf{w}^\top\mathbf{x}
$$

The handout's note is "like perceptron, but without the sign". The perceptron ([Foundations Lecture 2: Perceptrons and PLA](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm-en)) computes the score $\mathbf{w}^\top\mathbf{x}$ and then takes its sign to answer circle or cross; linear regression computes the score and outputs it as is, because the score is already a real number.

Page 4 uses two figures to show what this hypothesis looks like:

| | Left figure: $\mathbf{x} = (x) \in \mathbb{R}$ | Right figure: $\mathbf{x} = (x_1, x_2) \in \mathbb{R}^2$ |
|---|---|---|
| Axes | Horizontal axis $x$, vertical axis $y$ | The base plane is $x_1$, $x_2$, the height is $y$ |
| Data points | A cloud of circles in the plane | A cloud of circles in space |
| Hypothesis | A blue line | A blue plane |
| Red segments | The vertical distance from each point to the line | The vertical distance from each point to the plane |

The lecture points out that this differs from the earlier figures: a classification figure draws only the plane of $\mathbf{x}$ and uses circles and crosses for $y$; here $y$ takes an axis of its own and every data point is drawn as a circle. The red segments are called residuals, and in the lecture Lin refers to them as the "remainder": the part that is still unexplained after the hypothesis has made its prediction. The handout sums up the job of linear regression in one line: find lines/hyperplanes with small residuals.

### The error measure: squared error

Whether the residuals are small needs a way of measuring. Page 5 uses the squared error, which the handout calls the popular/historical error measure:

$$
\text{err}(\hat{y}, y) = (\hat{y} - y)^2
$$

In the lecture, Lin says linear regression is a problem the statistics community has studied for a long time, and the squared error is the measure traditionally used most. Plugged into the framework of the previous lecture, the in-sample and out-of-sample errors are

$$
E_{\text{in}}(\mathbf{w}) = \frac{1}{N}\sum_{n=1}^{N}\big(\underbrace{h(\mathbf{x}_n)}_{\mathbf{w}^\top\mathbf{x}_n} - y_n\big)^2, \qquad E_{\text{out}}(\mathbf{w}) = \mathop{\mathcal{E}}_{(\mathbf{x}, y)\sim P}\big(\mathbf{w}^\top\mathbf{x} - y\big)^2
$$

Two details of notation are both addressed in the lecture. First, each $\mathbf{w}$ corresponds to one $h$, so the handout writes $E_{\text{in}}(\mathbf{w})$ directly rather than $E_{\text{in}}(h)$, which keeps later formulas a little simpler. Second, the expectation in $E_{\text{out}}$ is taken over $(\mathbf{x}, y)$ together: we are already in the noisy setting of the previous lecture, where $\mathbf{x}$ and $y$ are drawn jointly from one distribution.

This article adds a small example to show what squaring does (the numbers are made up for this article, not from the slides). Work in units of NTD 10,000: predict 9 when the actual value is 10, and the error is $1$; predict 12 when the actual value is 8, and the error is $16$. The gap is 4 times larger and the error is 16 times larger, so the squared error cares especially about points that are far off. This property comes back in the last section, when regression is used for classification.

The last line of this page is "next: how to minimize $E_{\text{in}}(\mathbf{w})$?". In the lecture, Lin explains that if you believe the derivation of the VC bound, and believe it extends to other problems, then this is the only thing left to do.

### Fun Time: which feature should get a positive weight

**Question (page 6):** Consider using the linear regression hypothesis $h(\mathbf{x}) = \mathbf{w}^\top\mathbf{x}$ to predict the credit limit of customers. Which feature below shall have a positive weight in a good hypothesis for the task?

1. birth month
2. monthly income
3. current debt
4. number of credit cards owned

**Answer: 2.** The handout's explanation: customers with higher monthly income should naturally be given a higher credit limit, which is captured by the positive weight. A positive $w_i$ means that each one-unit increase in $x_i$ raises the predicted limit by $w_i$.

The handout does not explain the other options; what follows is this article's reasoning. Birth month has no visible relation to the ability to repay, so a good hypothesis gives it a weight close to 0. The more current debt, the less room there is to borrow more, so the reasonable weight is negative. The direction for the number of credit cards is unclear: holding many cards may mean good credit, or it may mean a lot has already been borrowed, and nothing in this question says it has to be positive.

## Set the gradient to zero and solve for the best w in one step

```youtube
url: https://www.youtube.com/watch?v=2LfdSCdcg1g
title: Linear Regression :: Linear Regression Algorithm @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–05:00 writes $E_{\text{in}}$ in matrix form, 05:00–08:01 explains convexity and the zero gradient, 08:01–12:52 computes the gradient, 12:52–17:35 solves the equation and introduces the pseudo-inverse, 17:35–18:51 gives the complete algorithm, and Fun Time follows.)

### Writing E_in in matrix form

The formula for $E_{\text{in}}$ carries a running index $n$. Page 7 packs it into matrices in four steps, and in the lecture Lin says the only purpose is to make the notation cleaner later.

**Step 1: swap the order of the inner product.** $\mathbf{w}^\top\mathbf{x}_n$ is the inner product of two vectors, and an inner product is commutative, so it equals $\mathbf{x}_n^\top\mathbf{w}$:

$$
E_{\text{in}}(\mathbf{w}) = \frac{1}{N}\sum_{n=1}^{N}\big(\mathbf{w}^\top\mathbf{x}_n - y_n\big)^2 = \frac{1}{N}\sum_{n=1}^{N}\big(\mathbf{x}_n^\top\mathbf{w} - y_n\big)^2
$$

**Step 2: a sum of squares is the squared length of a vector.** Stack the $N$ quantities being squared into an $N$-dimensional vector; its squared length is the sum of the squares of its components:

$$
E_{\text{in}}(\mathbf{w}) = \frac{1}{N}\left\lVert \begin{bmatrix} \mathbf{x}_1^\top\mathbf{w} - y_1 \\ \mathbf{x}_2^\top\mathbf{w} - y_2 \\ \vdots \\ \mathbf{x}_N^\top\mathbf{w} - y_N \end{bmatrix} \right\rVert^2
$$

**Step 3: factor out the common $\mathbf{w}$.** Every row contains $\mathbf{w}$. Stack $\mathbf{x}_1^\top, \dots, \mathbf{x}_N^\top$ row by row into a matrix and $y_1, \dots, y_N$ into a vector. The lecture's picture is that the originally "tall" vector $\mathbf{x}_n$ lies down to become a row.

$$
E_{\text{in}}(\mathbf{w}) = \frac{1}{N}\left\lVert \begin{bmatrix} \text{---}\ \mathbf{x}_1^\top\ \text{---} \\ \text{---}\ \mathbf{x}_2^\top\ \text{---} \\ \vdots \\ \text{---}\ \mathbf{x}_N^\top\ \text{---} \end{bmatrix}\mathbf{w} - \begin{bmatrix} y_1 \\ y_2 \\ \vdots \\ y_N \end{bmatrix} \right\rVert^2
$$

**Step 4: give them names.** Call the matrix $\mathrm{X}$ and the vector $\mathbf{y}$:

$$
E_{\text{in}}(\mathbf{w}) = \frac{1}{N}\lVert \mathrm{X}\mathbf{w} - \mathbf{y} \rVert^2
$$

The handout marks the sizes underneath: $\mathrm{X}$ is $N \times (d+1)$, one row per example and one column per feature; $\mathbf{w}$ is $(d+1) \times 1$; $\mathbf{y}$ is $N \times 1$. $\mathrm{X}$ and $\mathbf{y}$ are both given by the data, so the only thing in the formula that can move is $\mathbf{w}$.

### The condition at the lowest point: zero gradient

Page 8 first states three properties of the function $E_{\text{in}}(\mathbf{w})$: continuous, differentiable, convex. For convexity the lecture gives only a physical picture: the function looks like a valley, like a bowl, and the left side of the slide draws exactly that, a curve opening upward with $\mathbf{w}$ on the horizontal axis and a black dot at the lowest point.

What characterizes the bottom of the bowl? The lecture uses a ball: at the bottom of the valley, the ball cannot roll down in any direction. Each component of the gradient is the slope of the function along one direction, so the gradient at the bottom must be the zero vector:

$$
\nabla E_{\text{in}}(\mathbf{w}) \equiv \begin{bmatrix} \dfrac{\partial E_{\text{in}}}{\partial w_0}(\mathbf{w}) \\ \dfrac{\partial E_{\text{in}}}{\partial w_1}(\mathbf{w}) \\ \vdots \\ \dfrac{\partial E_{\text{in}}}{\partial w_d}(\mathbf{w}) \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \\ \vdots \\ 0 \end{bmatrix}
$$

The handout writes this as the necessary condition of the 'best' $\mathbf{w}$, with the note: not possible to 'roll down'. The task therefore becomes: find $\mathbf{w}_{\text{LIN}}$ such that $\nabla E_{\text{in}}(\mathbf{w}_{\text{LIN}}) = \mathbf{0}$. The lecture makes a point of explaining the subscript: LIN stands for linear regression and has nothing to do with the lecturer's surname.

This article adds two points. First, the handout only says this is a necessary condition; for a convex function, a point with zero gradient is always a lowest point, so the $\mathbf{w}_{\text{LIN}}$ we solve for really is the optimal solution. The lecture says no rigorous proof is given here. Second, why it is convex: for any direction $\mathbf{v}$, $\mathbf{v}^\top\mathrm{X}^\top\mathrm{X}\mathbf{v} = \lVert\mathrm{X}\mathbf{v}\rVert^2 \ge 0$, so the quadratic term always curves upward.

### Computing the gradient: one variable first, then a vector

Page 9 begins by expanding the squared length. $\lVert\mathbf{a}\rVert^2 = \mathbf{a}^\top\mathbf{a}$, so

$$
\lVert\mathrm{X}\mathbf{w} - \mathbf{y}\rVert^2 = (\mathrm{X}\mathbf{w} - \mathbf{y})^\top(\mathrm{X}\mathbf{w} - \mathbf{y}) = \mathbf{w}^\top\mathrm{X}^\top\mathrm{X}\mathbf{w} - \mathbf{w}^\top\mathrm{X}^\top\mathbf{y} - \mathbf{y}^\top\mathrm{X}\mathbf{w} + \mathbf{y}^\top\mathbf{y}
$$

The two middle terms are both scalars and are transposes of each other, so they are equal and combine into $-2\mathbf{w}^\top\mathrm{X}^\top\mathbf{y}$. In the lecture, Lin compares this to the $-2ab$ in the expansion of $(a - b)^2$. The handout gives temporary names to the three quantities determined by the data:

$$
E_{\text{in}}(\mathbf{w}) = \frac{1}{N}\Big(\mathbf{w}^\top\underbrace{\mathrm{X}^\top\mathrm{X}}_{\mathrm{A}}\mathbf{w} - 2\mathbf{w}^\top\underbrace{\mathrm{X}^\top\mathbf{y}}_{\mathbf{b}} + \underbrace{\mathbf{y}^\top\mathbf{y}}_{c}\Big)
$$

$\mathrm{A}$ is a $(d+1) \times (d+1)$ matrix, $\mathbf{b}$ is a $d+1$-dimensional vector, and $c$ is a number. The three terms are quadratic, linear, and constant in $\mathbf{w}$.

In the lecture, Lin says many people get nervous at this point, feeling they never learned vector calculus properly. The handout's approach is to look at the case of a single $w$ first and then match it to the vector case:

| | One $w$ only | Vector $\mathbf{w}$ |
|---|---|---|
| $E_{\text{in}}$ | $\frac{1}{N}(aw^2 - 2bw + c)$ | $\frac{1}{N}(\mathbf{w}^\top\mathrm{A}\mathbf{w} - 2\mathbf{w}^\top\mathbf{b} + c)$ |
| $\nabla E_{\text{in}}$ | $\frac{1}{N}(2aw - 2b)$ | $\frac{1}{N}(2\mathrm{A}\mathbf{w} - 2\mathbf{b})$ |
| Handout's note | simple! | similar (derived by definition) |

The left side is the high-school derivative of a quadratic in one variable. The right side looks identical, except that $a$ becomes a matrix and $b$ becomes a vector. The handout writes "derived by definition" and lists no steps; the lecture says working it out from the definition gives the result, and that the derivation uses the fact that $\mathrm{A}$ is a symmetric matrix. The derivation below is an addition in this article, done from the definition.

Take the partial derivative with respect to the $k$-th component $w_k$. In the linear term $\mathbf{w}^\top\mathbf{b} = \sum_i w_i b_i$, only the $i = k$ term contains $w_k$, and its derivative is $b_k$. In the quadratic term $\mathbf{w}^\top\mathrm{A}\mathbf{w} = \sum_i\sum_j w_i A_{ij} w_j$, $w_k$ appears in the terms with $i = k$ and also in the terms with $j = k$:

$$
\frac{\partial}{\partial w_k}\sum_{i}\sum_{j} w_i A_{ij} w_j = \sum_{j} A_{kj} w_j + \sum_{i} w_i A_{ik} = (\mathrm{A}\mathbf{w})_k + (\mathrm{A}^\top\mathbf{w})_k
$$

(The term with $i = j = k$ is $A_{kk}w_k^2$, whose derivative is $2A_{kk}w_k$; it appears exactly once in each of the two sums, so nothing is counted twice.) The transpose of $\mathrm{A} = \mathrm{X}^\top\mathrm{X}$ is $(\mathrm{X}^\top\mathrm{X})^\top = \mathrm{X}^\top\mathrm{X}$, so it is symmetric, which gives $(\mathrm{A}^\top\mathbf{w})_k = (\mathrm{A}\mathbf{w})_k$, and the partial derivative of the quadratic term is $2(\mathrm{A}\mathbf{w})_k$. Stack $k = 0, 1, \dots, d$ and put $\mathrm{A}$ and $\mathbf{b}$ back in their original form:

$$
\nabla E_{\text{in}}(\mathbf{w}) = \frac{1}{N}(2\mathrm{A}\mathbf{w} - 2\mathbf{b}) = \frac{2}{N}\big(\mathrm{X}^\top\mathrm{X}\mathbf{w} - \mathrm{X}^\top\mathbf{y}\big)
$$

### Solving the equation: the pseudo-inverse

Page 10 sets the gradient to zero:

$$
\frac{2}{N}\big(\mathrm{X}^\top\mathrm{X}\mathbf{w} - \mathrm{X}^\top\mathbf{y}\big) = \mathbf{0} \quad\Longleftrightarrow\quad \mathrm{X}^\top\mathrm{X}\mathbf{w} = \mathrm{X}^\top\mathbf{y}
$$

$\mathrm{X}^\top\mathrm{X}$ and $\mathrm{X}^\top\mathbf{y}$ can both be computed, the only unknown is $\mathbf{w}$, and every unknown appears to the first power. In the lecture, Lin says this is simply a system of linear equations. Two cases follow.

**Invertible $\mathrm{X}^\top\mathrm{X}$.** The handout writes: easy! unique solution. Multiply both sides on the left by the inverse:

$$
\mathbf{w}_{\text{LIN}} = \underbrace{\big(\mathrm{X}^\top\mathrm{X}\big)^{-1}\mathrm{X}^\top}_{\text{pseudo-inverse } \mathrm{X}^\dagger}\,\mathbf{y}
$$

The block $(\mathrm{X}^\top\mathrm{X})^{-1}\mathrm{X}^\top$ has a name, the pseudo-inverse, written $\mathrm{X}^\dagger$. In the lecture, Lin explains why it is called a "fake" inverse: if $\mathrm{X}$ were square and had an inverse, this block would simplify to $\mathrm{X}^{-1}$; when $\mathrm{X}$ is not square, it still behaves much like an inverse. This article adds a property you can check right away: $\mathrm{X}^\dagger\mathrm{X} = (\mathrm{X}^\top\mathrm{X})^{-1}\mathrm{X}^\top\mathrm{X} = \mathrm{I}$, so multiplying on the left gives the identity matrix.

The handout says this case is often the case because $N \gg d + 1$. The lecture's explanation is that $\mathrm{X}^\top\mathrm{X}$ is only $(d+1) \times (d+1)$, the number of examples $N$ is usually much larger than $d$, and the matrix has enough degrees of freedom, so it is invertible most of the time. This article makes that statement more concrete: if $\mathrm{X}^\top\mathrm{X}\mathbf{v} = \mathbf{0}$, then $\mathbf{v}^\top\mathrm{X}^\top\mathrm{X}\mathbf{v} = \lVert\mathrm{X}\mathbf{v}\rVert^2 = 0$, which means $\mathrm{X}\mathbf{v} = \mathbf{0}$. So $\mathrm{X}^\top\mathrm{X}$ fails to be invertible only when some feature happens to be an exact linear combination of the other features on all $N$ examples. The more data there is, the harder it is for that coincidence to occur.

**Singular $\mathrm{X}^\top\mathrm{X}$.** The handout writes "many optimal solutions": the equation has many solutions, and each of them is optimal. In this case $\mathrm{X}^\dagger$ is defined in other ways, and $\mathbf{w}_{\text{LIN}} = \mathrm{X}^\dagger\mathbf{y}$ is still one of the solutions. In the lecture, Lin says the details of the definition are in linear algebra textbooks, and most numerical software already implements it.

Both cases are written as the same formula:

$$
\mathbf{w}_{\text{LIN}} = \mathrm{X}^\dagger\mathbf{y}
$$

The practical suggestion on this page sits in a yellow box: use a well-implemented $\dagger$ routine instead of computing $(\mathrm{X}^\top\mathrm{X})^{-1}\mathrm{X}^\top$ yourself, for numerical stability when the matrix is almost-singular. The lecture mentions one more benefit: you do not have to decide for yourself whether the matrix is invertible.

### The complete algorithm

Page 11 wraps the whole thing into three steps:

1. From the data $\mathcal{D}$, construct the input matrix $\mathrm{X}$ ($N \times (d+1)$) and the output vector $\mathbf{y}$ ($N \times 1$).
2. Calculate the pseudo-inverse $\mathrm{X}^\dagger$ ($(d+1) \times N$).
3. Return $\mathbf{w}_{\text{LIN}} = \mathrm{X}^\dagger\mathbf{y}$ ($(d+1) \times 1$).

The handout's verdict is: simple and efficient with good $\dagger$ routine. In the lecture, Lin says the first step takes almost no work, since it only puts the inputs and outputs of the data in separate places; and that some people have only met regression in one or two dimensions, whereas the derivation here uses vectors and matrices throughout, so the same procedure works in any number of dimensions.

### Numerical example: four customers, the whole algorithm by hand

The following is an example made up for this article, not from the slides. There are four customers, the only feature is annual income (in units of NTD 1 million), and the quantity to predict is the credit limit (in units of NTD 100,000):

| Customer | Annual income $x$ (NTD million) | Credit limit $y$ (NTD 100,000) |
|---|---|---|
| 1 | 1 | 2 |
| 2 | 2 | 3 |
| 3 | 3 | 5 |
| 4 | 4 | 6 |

**Step 1: build $\mathrm{X}$ and $\mathbf{y}$.** Prepend $x_0 = 1$ to every example. Here $N = 4$ and $d = 1$:

$$
\mathrm{X} = \begin{bmatrix} 1 & 1 \\ 1 & 2 \\ 1 & 3 \\ 1 & 4 \end{bmatrix}, \qquad \mathbf{y} = \begin{bmatrix} 2 \\ 3 \\ 5 \\ 6 \end{bmatrix}
$$

**Step 2: compute $\mathrm{A}$, $\mathbf{b}$, $c$.** The entries of $\mathrm{A}$ are $\sum 1 = 4$, $\sum x_n = 10$, and $\sum x_n^2 = 1 + 4 + 9 + 16 = 30$; the two components of $\mathbf{b}$ are $\sum y_n = 16$ and $\sum x_n y_n = 2 + 6 + 15 + 24 = 47$; $c = 4 + 9 + 25 + 36 = 74$.

$$
\mathrm{A} = \mathrm{X}^\top\mathrm{X} = \begin{bmatrix} 4 & 10 \\ 10 & 30 \end{bmatrix}, \qquad \mathbf{b} = \mathrm{X}^\top\mathbf{y} = \begin{bmatrix} 16 \\ 47 \end{bmatrix}, \qquad c = 74
$$

**Step 3: solve $\mathrm{A}\mathbf{w} = \mathbf{b}$.** That is, $4w_0 + 10w_1 = 16$ and $10w_0 + 30w_1 = 47$. The determinant of $\mathrm{A}$ is $4 \times 30 - 10 \times 10 = 20$, which is not 0, so the matrix is invertible:

$$
\mathrm{A}^{-1} = \frac{1}{20}\begin{bmatrix} 30 & -10 \\ -10 & 4 \end{bmatrix}, \qquad \mathbf{w}_{\text{LIN}} = \mathrm{A}^{-1}\mathbf{b} = \frac{1}{20}\begin{bmatrix} 30 \times 16 - 10 \times 47 \\ -10 \times 16 + 4 \times 47 \end{bmatrix} = \frac{1}{20}\begin{bmatrix} 10 \\ 28 \end{bmatrix} = \begin{bmatrix} 0.5 \\ 1.4 \end{bmatrix}
$$

If you follow the algorithm and compute the pseudo-inverse first, it is a $2 \times 4$ matrix whose $n$-th column is $\mathrm{A}^{-1}$ times $(1, x_n)$:

$$
\mathrm{X}^\dagger = \mathrm{A}^{-1}\mathrm{X}^\top = \frac{1}{20}\begin{bmatrix} 20 & 10 & 0 & -10 \\ -6 & -2 & 2 & 6 \end{bmatrix}
$$

Multiply by $\mathbf{y}$: the first row gives $\frac{1}{20}(40 + 30 + 0 - 60) = 0.5$ and the second row gives $\frac{1}{20}(-12 - 6 + 10 + 36) = 1.4$, the same as above.

**Step 4: look at the result.** The hypothesis is $h(x) = 0.5 + 1.4x$.

| Customer | $y_n$ | $\hat{y}_n = 0.5 + 1.4x_n$ | Residual $y_n - \hat{y}_n$ | Squared residual |
|---|---|---|---|---|
| 1 | 2 | 1.9 | 0.1 | 0.01 |
| 2 | 3 | 3.3 | −0.3 | 0.09 |
| 3 | 5 | 4.7 | 0.3 | 0.09 |
| 4 | 6 | 6.1 | −0.1 | 0.01 |

$$
E_{\text{in}}(\mathbf{w}_{\text{LIN}}) = \frac{0.01 + 0.09 + 0.09 + 0.01}{4} = 0.05
$$

Compute it once more with the formula in $\mathrm{A}$, $\mathbf{b}$, $c$: $\mathbf{w}^\top\mathrm{A}\mathbf{w} = 73.8$, $2\mathbf{w}^\top\mathbf{b} = 147.6$, and $\frac{1}{4}(73.8 - 147.6 + 74) = 0.05$, which agrees.

**What this result means.** $w_1 = 1.4$ means that each additional NTD 1 million of annual income raises the predicted limit by NTD 140,000; $w_0 = 0.5$ is a base limit of NTD 50,000. The unit of $E_{\text{in}} = 0.05$ is "(NTD 100,000) squared"; its square root is about 0.224, so on average the prediction is off from the actual value by a little over NTD 20,000. Comparing against a few other choices of $\mathbf{w}$ shows that the one with zero gradient is indeed the lowest:

| $\mathbf{w} = (w_0, w_1)$ | $E_{\text{in}}(\mathbf{w})$ | $\nabla E_{\text{in}}(\mathbf{w}) = \frac{2}{4}(\mathrm{A}\mathbf{w} - \mathbf{b})$ |
|---|---|---|
| $(0, 0)$ | $18.5$ | $(-8, -23.5)$ |
| $(1, 1)$ | $0.5$ | $(-1, -3.5)$ |
| $(0, 1.5)$ | $0.125$ | $(-0.5, -1)$ |
| $(0.5, 1.4)$ | $0.05$ | $(0, 0)$ |

**The singular case.** Add one redundant feature: $x_2 = 2x_1$ (the same annual income, now in units of NTD 500,000). The third column of $\mathrm{X}$ is twice the second, and the determinant of $\mathrm{X}^\top\mathrm{X}$ is 0. Now $h(\mathbf{x}) = w_0 + (w_1 + 2w_2)x_1$, and as long as $w_0 = 0.5$ and $w_1 + 2w_2 = 1.4$, the predictions are exactly the same as before and $E_{\text{in}}$ is 0.05 in every case. $(0.5, 1.4, 0)$, $(0.5, 0, 0.7)$, and $(0.5, 3.4, -1)$ are all optimal solutions, which is what the handout means by many optimal solutions.

Running it in NumPy: `np.linalg.inv(X.T @ X)` raises a `Singular matrix` error outright; `np.linalg.pinv(X) @ y` returns $(0.5, 0.28, 0.56)$, which satisfies $0.28 + 2 \times 0.56 = 1.4$ and is one of that whole line of optimal solutions. The squared lengths of the four solutions are $2.21$, $0.74$, $12.81$, and $0.642$, and pinv gives the shortest one. This is a property of the Moore-Penrose pseudo-inverse; the handout does not mention it, and it is an addition in this article.

### Fun Time: the matrix formula for the prediction vector

**Question (page 12):** After getting $\mathbf{w}_{\text{LIN}}$, we can calculate the predictions $\hat{y}_n = \mathbf{w}_{\text{LIN}}^\top\mathbf{x}_n$. If all $\hat{y}_n$ are collected in a vector $\hat{\mathbf{y}}$ similar to how we form $\mathbf{y}$, what is its matrix formula?

1. $\mathbf{y}$
2. $\mathrm{X}\mathrm{X}^\top\mathbf{y}$
3. $\mathrm{X}\mathrm{X}^\dagger\mathbf{y}$
4. $\mathrm{X}\mathrm{X}^\dagger\mathrm{X}\mathrm{X}^\top\mathbf{y}$

**Answer: 3.** The handout's solution: $\hat{\mathbf{y}} = \mathrm{X}\mathbf{w}_{\text{LIN}}$, and substituting $\mathbf{w}_{\text{LIN}} = \mathrm{X}^\dagger\mathbf{y}$ gives $\mathrm{X}\mathrm{X}^\dagger\mathbf{y}$. The $n$-th component of $\mathrm{X}\mathbf{w}$ is $\mathbf{x}_n^\top\mathbf{w}$, which is exactly the prediction for the $n$-th example.

The analysis of the other options is this article's. Option 1 says the predictions hit every label exactly, which is true only when all residuals are 0; in the four-customer example, $\hat{\mathbf{y}} = (1.9, 3.3, 4.7, 6.1)$ is not equal to $\mathbf{y}$. Option 2 wrongly replaces $\mathrm{X}^\dagger$ with $\mathrm{X}^\top$, dropping $(\mathrm{X}^\top\mathrm{X})^{-1}$; on the same example it comes out as $(63, 110, 157, 204)$. Option 4, because $\mathrm{X}\mathrm{X}^\dagger\mathrm{X} = \mathrm{X}(\mathrm{X}^\dagger\mathrm{X}) = \mathrm{X}$, simplifies to the same formula as option 2.

After giving the answer, the lecture adds a reminder: only one matrix, $\mathrm{X}\mathrm{X}^\dagger$, stands between $\mathbf{y}$ and $\hat{\mathbf{y}}$, and the analysis in the next section uses it throughout.

## Does it count as learning without step-by-step improvement: the hat matrix and the learning curve

```youtube
url: https://www.youtube.com/watch?v=lj2jK1FSwgo
title: Linear Regression :: Generalization Issue @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–03:50 discusses whether this counts as learning, 03:50–08:25 covers the average $E_{\text{in}}$ and the hat matrix, 08:25–12:45 the geometric picture and the trace, 12:45–16:52 the noise argument and $E_{\text{out}}$, 16:52–19:12 the learning curve, and Fun Time follows.)

### An algorithm that gets there in one step

The lecture begins by asking the question on the students' behalf: is this really machine learning? The algorithm computes the answer all at once, as if it reached the top in a single step, and no learning process is visible. Page 13 sets the two sides next to each other:

| No! | Yes! |
|---|---|
| The solution is analytic (closed-form), 'instantaneous' | Good $E_{\text{in}}$? Yes, optimal |
| Not improving $E_{\text{in}}$ nor $E_{\text{out}}$ iteratively | Good $E_{\text{out}}$? Yes, finite $d_{\text{VC}}$ like perceptrons |
| | Improving iteratively? Somewhat, within an iterative pseudo-inverse routine |

The second row on the right rests on [Foundations Lecture 7: The VC Dimension](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error-en): the $d_{\text{VC}}$ of $d$-dimensional perceptrons is $d + 1$, which is finite. In the lecture, Lin says the model has only $d + 1$ variables, and with enough data a good $E_{\text{in}}$ carries over into a good $E_{\text{out}}$. For the third row, the handout says the pseudo-inverse routine is iterative inside; the example in the lecture is Gaussian elimination for computing an inverse, which is itself a loop, and if you laid out the intermediate steps you would see $E_{\text{in}}$ getting better step by step as well. The routine is just packaged so well that you do not see it.

The handout's conclusion is: if $E_{\text{out}}(\mathbf{w}_{\text{LIN}})$ is good, learning 'happened'! The lecture uses an exam as the analogy: whether it studied in secret under the covers or read aloud to you step by step, if it does well on the final exam ($E_{\text{out}}$), learning took place in between.

### Another kind of guarantee: the average E_in

The VC bound can guarantee $E_{\text{out}}$. This section gives a different kind of guarantee, under the handout's title 'Simpler-than-VC' Guarantee. It is available because linear regression has an analytic solution and the formulas can be written down. The object of the analysis is the average of $E_{\text{in}}$ (page 14):

$$
\overline{E_{\text{in}}} = \mathop{\mathcal{E}}_{\mathcal{D}\sim P^N}\Big\{E_{\text{in}}(\mathbf{w}_{\text{LIN}} \text{ w.r.t. } \mathcal{D})\Big\} \ \overset{\text{to be shown}}{=}\ \text{noise level}\cdot\Big(1 - \frac{d+1}{N}\Big)
$$

The average is taken over data sets. The lecture reuses the earlier analogy: grab a handful of data from the bin and compute $E_{\text{in}}$ once, grab another handful and compute it again, and average over every handful you could possibly grab. The lecture also names the difference from VC: VC looks at an individual $E_{\text{in}}$, and this looks at the average. The noise level is the strength of the noise in the data, the part that, as the previous lecture said, even the best target function cannot get right.

First write down $E_{\text{in}}$ for a single data set. Use $\hat{\mathbf{y}} = \mathrm{X}\mathrm{X}^\dagger\mathbf{y}$ from the previous Fun Time:

$$
E_{\text{in}}(\mathbf{w}_{\text{LIN}}) = \frac{1}{N}\lVert\mathbf{y} - \hat{\mathbf{y}}\rVert^2 = \frac{1}{N}\lVert\mathbf{y} - \mathrm{X}\mathrm{X}^\dagger\mathbf{y}\rVert^2 = \frac{1}{N}\lVert(\mathrm{I} - \mathrm{X}\mathrm{X}^\dagger)\mathbf{y}\rVert^2
$$

The last step writes $\mathbf{y}$ as $\mathrm{I}\mathbf{y}$ and factors it out. The handout calls $\mathrm{X}\mathrm{X}^\dagger$ the hat matrix, written $\mathrm{H}$, for the reason printed on the slide: because it puts ∧ on $\mathbf{y}$. In the lecture, Lin says the name comes from the statistics community: multiply $\mathbf{y}$ by it and a hat grows on its head, turning it into $\hat{\mathbf{y}}$, which makes it easy to remember.

### The hat matrix is a projection

Page 15 draws a figure in $\mathbb{R}^N$. Note that this space has $N$ dimensions: $\mathbf{y} = (y_1, \dots, y_N)$ is one vector in it, with one axis per example, which is a different thing from the earlier figures whose axes were features. There are four things in the figure:

- **The pink region**: the space spanned by the $d + 1$ columns of $\mathrm{X}$ (span of $\mathrm{X}$). Each column is also an $N$-dimensional vector.
- **The purple $\mathbf{y}$**: starts at the origin and points at a slant out of the pink region.
- **The black $\hat{\mathbf{y}}$**: lies inside the pink region.
- **The green dashed line $\mathbf{y} - \hat{\mathbf{y}}$**: goes straight up from the tip of $\hat{\mathbf{y}}$ to the tip of $\mathbf{y}$.

The handout lists four statements. Taking them one at a time:

1. **$\hat{\mathbf{y}} = \mathrm{X}\mathbf{w}_{\text{LIN}}$ is within the span.** The lecture's explanation: $\mathrm{X}$ times any $\mathbf{w}$ takes the components of $\mathbf{w}$ as coefficients and forms a linear combination of the columns of $\mathrm{X}$, so the result always lands in the span. Different $\mathbf{w}$ correspond to different points in the span.
2. **$\mathbf{y} - \hat{\mathbf{y}}$ is to be smallest, so it is perpendicular to the span.** Linear regression wants $\lVert\mathbf{y} - \hat{\mathbf{y}}\rVert$ as small as possible, that is, the point in the span closest to $\mathbf{y}$. The closest point is the one directly below, the perpendicular projection.
3. **$\mathrm{H}$ projects $\mathbf{y}$ to $\hat{\mathbf{y}}$ in the span.**
4. **$\mathrm{I} - \mathrm{H}$ transforms $\mathbf{y}$ to $\mathbf{y} - \hat{\mathbf{y}}$, perpendicular to the span.** In the lecture, Lin describes this as taking the "remainder".

This article adds the algebraic version of statement 2. Being perpendicular to the span means having inner product 0 with every column of $\mathrm{X}$, which in matrix form is $\mathrm{X}^\top(\mathbf{y} - \hat{\mathbf{y}}) = \mathbf{0}$. Expand it: $\mathrm{X}^\top\mathbf{y} - \mathrm{X}^\top\mathrm{X}\mathbf{w}_{\text{LIN}} = \mathbf{0}$, which is exactly the equation obtained in the algorithm section by setting the gradient to zero. "The gradient is zero" and "the residual is perpendicular to the span" are two ways of stating the same condition. The four-customer example can be checked directly: the residual is $(0.1, -0.3, 0.3, -0.1)$, its inner product with the first column $(1, 1, 1, 1)$ is $0.1 - 0.3 + 0.3 - 0.1 = 0$, and its inner product with the second column $(1, 2, 3, 4)$ is $0.1 - 0.6 + 0.9 - 0.4 = 0$.

### Why trace(I − H) is N − (d + 1)

Page 15 ends with one line: claim: $\text{trace}(\mathrm{I} - \mathrm{H}) = N - (d + 1)$. Why? :-) The trace is the sum of all the entries on the diagonal of a matrix. The lecture gives no proof, only the physical meaning, and asks everyone to write out the proof on their own: $\mathbf{y}$ originally has $N$ degrees of freedom in the $N$-dimensional space; the span it is projected onto has at most $d + 1$ dimensions; and what is left after taking the remainder has at most $N - (d + 1)$ degrees of freedom.

The proof below is an addition in this article and covers only the case where $\mathrm{X}^\top\mathrm{X}$ is invertible. It uses one property: the trace of a product of two matrices is unchanged when the order is swapped, $\text{trace}(\mathrm{P}\mathrm{Q}) = \text{trace}(\mathrm{Q}\mathrm{P})$, because both sides equal $\sum_i\sum_j P_{ij}Q_{ji}$. Take $\mathrm{P} = \mathrm{X}$ and $\mathrm{Q} = (\mathrm{X}^\top\mathrm{X})^{-1}\mathrm{X}^\top$:

$$
\text{trace}(\mathrm{H}) = \text{trace}\big(\mathrm{X}(\mathrm{X}^\top\mathrm{X})^{-1}\mathrm{X}^\top\big) = \text{trace}\big((\mathrm{X}^\top\mathrm{X})^{-1}\mathrm{X}^\top\mathrm{X}\big) = \text{trace}(\mathrm{I}_{d+1}) = d + 1
$$

After the swap, the large $N \times N$ matrix becomes the $(d+1) \times (d+1)$ identity matrix, which has $d + 1$ ones on its diagonal. Therefore

$$
\text{trace}(\mathrm{I} - \mathrm{H}) = \text{trace}(\mathrm{I}_N) - \text{trace}(\mathrm{H}) = N - (d + 1)
$$

In the four-customer example, the hat matrix is

$$
\mathrm{H} = \mathrm{X}\mathrm{X}^\dagger = \begin{bmatrix} 0.7 & 0.4 & 0.1 & -0.2 \\ 0.4 & 0.3 & 0.2 & 0.1 \\ 0.1 & 0.2 & 0.3 & 0.4 \\ -0.2 & 0.1 & 0.4 & 0.7 \end{bmatrix}
$$

The diagonal sums to $0.7 + 0.3 + 0.3 + 0.7 = 2 = d + 1$, and $\text{trace}(\mathrm{I} - \mathrm{H}) = 4 - 2 = 2$. Multiply the first row by $\mathbf{y} = (2, 3, 5, 6)$: $1.4 + 1.2 + 0.5 - 1.2 = 1.9$, which is $\hat{y}_1$.

### I − H turns noise into the residual

Page 16 is titled An Illustrative 'Proof', and the quotation marks are the handout's own. The lecture also says no complete proof will be given, only the main idea inside it. The figure has two more things than the previous page: a red label $f(\mathrm{X})$ inside the span, and a black dashed segment from $f(\mathrm{X})$ to $\mathbf{y}$ labeled noise.

**The assumption.** $\mathbf{y}$ comes from some ideal $f(\mathrm{X})$ plus noise, and $f(\mathrm{X})$ lies in the span:

$$
\mathbf{y} = f(\mathrm{X}) + \textbf{noise}, \qquad f(\mathrm{X}) \in \text{span}
$$

$f(\mathrm{X}) \in \text{span}$ means there is some $\mathbf{w}_f$ with $f(\mathrm{X}) = \mathrm{X}\mathbf{w}_f$, that is, the ideal target itself is linear.

**Step 1: $\mathrm{I} - \mathrm{H}$ wipes out $f(\mathrm{X})$.** A vector already in the span is unchanged by projection: $\mathrm{H}\mathrm{X}\mathbf{w}_f = \mathrm{X}(\mathrm{X}^\top\mathrm{X})^{-1}\mathrm{X}^\top\mathrm{X}\mathbf{w}_f = \mathrm{X}\mathbf{w}_f$. So $(\mathrm{I} - \mathrm{H})f(\mathrm{X}) = \mathbf{0}$, and

$$
\mathbf{y} - \hat{\mathbf{y}} = (\mathrm{I} - \mathrm{H})\mathbf{y} = (\mathrm{I} - \mathrm{H})f(\mathrm{X}) + (\mathrm{I} - \mathrm{H})\,\textbf{noise} = (\mathrm{I} - \mathrm{H})\,\textbf{noise}
$$

The lecture makes the same point from the figure: apply the remainder transform to the black dashed noise segment and you get the same green dashed line.

**Step 2: compute the average squared length.** The handout writes the result directly:

$$
E_{\text{in}}(\mathbf{w}_{\text{LIN}}) = \frac{1}{N}\lVert\mathbf{y} - \hat{\mathbf{y}}\rVert^2 = \frac{1}{N}\lVert(\mathrm{I} - \mathrm{H})\,\textbf{noise}\rVert^2 = \frac{1}{N}\big(N - (d+1)\big)\sigma^2
$$

About the noise, the handout only writes "per-dimension 'noise level' $\sigma^2$". The last equality actually holds only after averaging over the noise, and the lecture says so explicitly, describing it as the result of averaging over all the various messy noise. The calculation below is an addition in this article, and the assumption it needs is that the $N$ components of the noise, $\epsilon_1, \dots, \epsilon_N$, are independent of each other, all with mean 0 and all with variance $\sigma^2$.

Write $\mathrm{I} - \mathrm{H}$ as $\mathrm{M}$. $\mathrm{H}$ is symmetric and $\mathrm{H}^2 = \mathrm{H}$ (the Fun Time in this section verifies this), so $\mathrm{M}$ is symmetric too, and $\mathrm{M}^\top\mathrm{M} = \mathrm{M}^2 = \mathrm{I} - 2\mathrm{H} + \mathrm{H}^2 = \mathrm{M}$. Therefore

$$
\lVert\mathrm{M}\boldsymbol{\epsilon}\rVert^2 = \boldsymbol{\epsilon}^\top\mathrm{M}^\top\mathrm{M}\boldsymbol{\epsilon} = \boldsymbol{\epsilon}^\top\mathrm{M}\boldsymbol{\epsilon} = \sum_{i}\sum_{j} M_{ij}\,\epsilon_i\epsilon_j
$$

Take the expectation. When $i \ne j$, independence together with mean 0 gives $\mathcal{E}[\epsilon_i\epsilon_j] = 0$; when $i = j$, $\mathcal{E}[\epsilon_i^2] = \sigma^2$. Only the diagonal survives:

$$
\mathcal{E}\,\lVert\mathrm{M}\boldsymbol{\epsilon}\rVert^2 = \sigma^2\sum_{i} M_{ii} = \sigma^2\,\text{trace}(\mathrm{I} - \mathrm{H}) = \sigma^2\big(N - (d+1)\big)
$$

Divide by $N$:

$$
\overline{E_{\text{in}}} = \sigma^2\cdot\Big(1 - \frac{d+1}{N}\Big)
$$

In the lecture, Lin describes the trace as the "energy" of $\mathrm{I} - \mathrm{H}$: the noise starts with $\sigma^2$ in each of $N$ directions, and after passing through $\mathrm{I} - \mathrm{H}$ only $N - (d+1)$ shares of it remain.

**The formula for $E_{\text{out}}$.** The same page lists

$$
\overline{E_{\text{out}}} = \sigma^2\cdot\Big(1 + \frac{d+1}{N}\Big)
$$

The handout marks it "complicated!" and gives no derivation; the lecture says that it can be worked out in a similar way if you do the calculation seriously, only with more effort. What the lecture offers is intuition: $E_{\text{in}}$ is computed on the data we can see, and the fitted line leans a little toward the noise in this particular batch, which makes $E_{\text{in}}$ look a little better, and that is where subtracting $\frac{d+1}{N}$ comes from; $E_{\text{out}}$ looks at new data, the line has already leaned this way, and the noise in the new data may fall on the other side, so the two effects stack and the term is added.

This article adds a simplified version that can be computed in full. It corresponds to the remark in the lecture, made while discussing $E_{\text{out}}$, that it is "a bit like another $N$ points". Suppose the test data uses the same $\mathbf{x}_n$ and only redraws the noise, $\boldsymbol{\epsilon}'$, independent of the training noise $\boldsymbol{\epsilon}$. The new labels are $\mathbf{y}' = f(\mathrm{X}) + \boldsymbol{\epsilon}'$, the predictions are still $\hat{\mathbf{y}} = \mathrm{H}\mathbf{y} = f(\mathrm{X}) + \mathrm{H}\boldsymbol{\epsilon}$, and the difference between them is $\boldsymbol{\epsilon}' - \mathrm{H}\boldsymbol{\epsilon}$:

$$
\mathcal{E}\,\lVert\boldsymbol{\epsilon}' - \mathrm{H}\boldsymbol{\epsilon}\rVert^2 = \mathcal{E}\,\lVert\boldsymbol{\epsilon}'\rVert^2 + \mathcal{E}\,\lVert\mathrm{H}\boldsymbol{\epsilon}\rVert^2 = N\sigma^2 + \sigma^2\,\text{trace}(\mathrm{H}) = \sigma^2\big(N + (d+1)\big)
$$

The cross term has expectation 0 because the two batches of noise are independent and have mean 0; $\mathcal{E}\lVert\mathrm{H}\boldsymbol{\epsilon}\rVert^2$ is computed the same way as in the passage on $\mathrm{M}$ above. Dividing by $N$ gives $\sigma^2(1 + \frac{d+1}{N})$. Each of the two terms has its own source: $N\sigma^2$ is the new data's own noise, and $(d+1)\sigma^2$ is the price of $\mathbf{w}_{\text{LIN}}$ having been pulled off course by the old noise.

This article checks these three formulas with a NumPy simulation ($d = 2$, $\sigma^2 = 1$, features drawn from the standard normal distribution, a randomly drawn linear function as the target, and more than 40,000 repetitions for each $N$):

| $N$ | Average $E_{\text{in}}$: simulation / formula | Same $\mathbf{x}$, new noise: simulation / formula | Average $E_{\text{out}}$ with $\mathbf{x}$ redrawn too: simulation |
|---|---|---|---|
| 10 | 0.703 / 0.700 | 1.301 / 1.300 | about 1.47 |
| 20 | 0.849 / 0.850 | 1.147 / 1.150 | about 1.18 |
| 50 | 0.940 / 0.940 | 1.061 / 1.060 | about 1.06 |
| 100 | 0.971 / 0.970 | 1.031 / 1.030 | about 1.03 |

The first two columns match the formulas. Only the last column is the $E_{\text{out}}$ the handout defines (new $\mathbf{x}$ drawn from the distribution as well): when $N$ is small it is higher than $\sigma^2(1 + \frac{d+1}{N})$, 1.47 against 1.30 at $N = 10$, and from $N$ of 50 upward the two nearly coincide. So the simplified version above only shows where the "plus $\frac{d+1}{N}$" term comes from and cannot stand as a proof of the general case. This column is a simulation result of this article under this particular setting (normally distributed features), not content from the handout; the handout gives no derivation for the general case.

### The learning curve

Page 17 plots the two formulas, with the number of data points $N$ on the horizontal axis and Expected Error on the vertical axis:

- A horizontal line in the middle, at height $\sigma^2$.
- The red $\overline{E_{\text{out}}}$ comes down from very high and approaches the horizontal line.
- The blue $\overline{E_{\text{in}}}$ starts at the position marked $d + 1$ on the horizontal axis (where its value is $\sigma^2 \cdot 0 = 0$), rises, and approaches the horizontal line.

This figure is called the learning curve. The handout makes two points. First, both converge to $\sigma^2$ for $N \to \infty$. Second, the expected generalization error is $\frac{2(d+1)}{N}$, similar to the worst-case guarantee from VC. The lecture fills in how the two differ and how they are alike: VC describes the worst case and this describes the average; what they share is that both depend on the degrees of freedom $d + 1$ and both shrink as $N$ grows.

One detail to watch: subtracting the two formulas on the previous page gives the gap

$$
\overline{E_{\text{out}}} - \overline{E_{\text{in}}} = \sigma^2\cdot\frac{2(d+1)}{N}
$$

Both formulas on this page of the handout are multiplied by the noise level, but the line underneath reads "expected generalization error: $\frac{2(d+1)}{N}$", the summary on page 23 reads "$E_{\text{out}} - E_{\text{in}} \approx \frac{2(d+1)}{N}$ on average", and what is said aloud in the lecture is also roughly twice $\frac{d+1}{N}$; none of the three multiplies by the noise level. Going by the subtraction, there should be a factor of $\sigma^2$ in front; the two ways of writing it agree numerically only when $\sigma^2 = 1$. When plugging in numbers, use the version with $\sigma^2$, which is how self-check question 2 is computed.

The handout's conclusion is: linear regression (LinReg): learning 'happened'! In the lecture, Lin explains that when $N$ is large enough we are already doing about as well as the noise level allows, and if there is not too much noise, learning really did happen. The lecture also takes a stance: the mathematical details matter less, and what Lin hopes people remember is the geometric and physical meaning, namely that with only $N$ points, the line leans a little toward those $N$ points.

**Trying it on a scenario (made up for this article).** Suppose there are 12 features, so $d + 1 = 13$, which is the dimension of the cpusmall data set used in the exercises below:

| $N$ | $\overline{E_{\text{in}}}/\sigma^2$ | $\overline{E_{\text{out}}}/\sigma^2$ | Gap $/\sigma^2$ |
|---|---|---|---|
| 13 | 0 | 2 | 2 |
| 32 | 0.594 | 1.406 | 0.813 |
| 100 | 0.87 | 1.13 | 0.26 |
| 2,000 | 0.9935 | 1.0065 | 0.013 |

At $N = 32$, the error seen on the training data is only about 60% of the noise level while on new data it is 1.4 times the noise level, so looking at $E_{\text{in}}$ alone seriously overrates the model. At $N = 13$, $E_{\text{in}}$ is 0: with 13 unknowns and 13 examples every example can be hit exactly, yet the average $E_{\text{out}}$ is twice the noise level. To bring the gap below 5% of the noise level you need $\frac{26}{N} \le 0.05$, that is, $N \ge 520$. These numbers assume the target really is linear plus noise, which real data will not match exactly, so they are better used for comparing the shape of the curves.

### Fun Time: properties of the hat matrix

**Question (page 18):** Which of the following properties of $\mathrm{H}$ is not true?

1. $\mathrm{H}$ is symmetric
2. $\mathrm{H}^2 = \mathrm{H}$ (double projection = single one)
3. $(\mathrm{I} - \mathrm{H})^2 = \mathrm{I} - \mathrm{H}$ (double residual transform = single one)
4. none of the above (all three are true)

**Answer: 4.** The handout's solution only says that 2 and 3 can be concluded from their physical meanings. In the lecture, Lin explains: after projecting once you are already in that space, and projecting again changes nothing; a vector whose remainder has been taken once is already perpendicular to that space, and taking the remainder again gives the same vector. Symmetry can more or less be read off the formula. The lecture also says nobody is required to prove these.

This article verifies each of the three once, in the case where $\mathrm{X}^\top\mathrm{X}$ is invertible:

- Symmetry: $\mathrm{H}^\top = \big(\mathrm{X}(\mathrm{X}^\top\mathrm{X})^{-1}\mathrm{X}^\top\big)^\top = \mathrm{X}\big((\mathrm{X}^\top\mathrm{X})^{-1}\big)^\top\mathrm{X}^\top = \mathrm{H}$, because the inverse of a symmetric matrix is also symmetric.
- $\mathrm{H}^2 = \mathrm{X}(\mathrm{X}^\top\mathrm{X})^{-1}\underbrace{\mathrm{X}^\top\mathrm{X}(\mathrm{X}^\top\mathrm{X})^{-1}}_{\mathrm{I}}\mathrm{X}^\top = \mathrm{H}$.
- $(\mathrm{I} - \mathrm{H})^2 = \mathrm{I} - 2\mathrm{H} + \mathrm{H}^2 = \mathrm{I} - 2\mathrm{H} + \mathrm{H} = \mathrm{I} - \mathrm{H}$.

The $\mathrm{H}$ of the four customers is symmetric at a glance. The top-left entry of $\mathrm{H}^2$ is the inner product of the first row with itself: $0.49 + 0.16 + 0.01 + 0.04 = 0.7$, equal to the top-left entry of $\mathrm{H}$. Checking the whole matrix in NumPy, all three hold.

## What justifies using the regression solution for classification

```youtube
url: https://www.youtube.com/watch?v=tF1HTirYbtc
title: Linear Regression :: for Binary Classification @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–02:51 compares the two problems and proposes the approach, 02:51–05:30 compares the two errors, 05:30–09:03 connects to the VC bound and the uses, 09:03–10:00 is Fun Time, and the summary of the whole lecture follows.)

### A lazy approach that looks workable

Page 19 puts the two linear models side by side:

| | Linear classification | Linear regression |
|---|---|---|
| Output space | $\mathcal{Y} = \{-1, +1\}$ | $\mathcal{Y} = \mathbb{R}$ |
| Hypothesis | $h(\mathbf{x}) = \text{sign}(\mathbf{w}^\top\mathbf{x})$ | $h(\mathbf{x}) = \mathbf{w}^\top\mathbf{x}$ |
| Error | $\text{err}(\hat{y}, y) = \llbracket\hat{y} \ne y\rrbracket$ | $\text{err}(\hat{y}, y) = (\hat{y} - y)^2$ |
| Solving | NP-hard to solve in general | Efficient analytic solution |

The handout then points out that $\{-1, +1\} \subset \mathbb{R}$. In the lecture, Lin puts it this way: $+1$ and $-1$ are just two special values in the vast sea of real numbers. That suggests an idea:

1. Run linear regression directly on the binary classification data $\mathcal{D}$, treating $y_n$ as the real numbers $\pm 1$.
2. Return $g(\mathbf{x}) = \text{sign}(\mathbf{w}_{\text{LIN}}^\top\mathbf{x})$.

The lecture explains the intuition: the $\mathbf{w}$ that regression finds will probably give values greater than 0 where the label is $+1$ and values less than 0 where it is $-1$; and unlike PLA or pocket, it does not have to run for a long time, oscillating back and forth, since in software such as MATLAB it is two or three lines. The handout calls this a heuristic and asks: but explanation of this heuristic? In the lecture, Lin says it sounds reasonable, but that does not yet make it a mathematical reason.

### The relation between the two errors

Both models first compute the score $\mathbf{w}^\top\mathbf{x}$ and differ only in how the error is computed afterward. Page 20 writes both errors as functions of the score:

$$
\text{err}_{0/1} = \llbracket\text{sign}(\mathbf{w}^\top\mathbf{x}) \ne y\rrbracket, \qquad \text{err}_{\text{sqr}} = (\mathbf{w}^\top\mathbf{x} - y)^2
$$

It then draws two figures with $\mathbf{w}^\top\mathbf{x}$ on the horizontal axis and the error on the vertical axis, the blue line being the 0/1 error and the red line the squared error:

| | Desired $y = +1$ | Desired $y = -1$ |
|---|---|---|
| Blue line (0/1) | 1 when the score is below 0, 0 when it is above 0, a single step | 1 when the score is above 0, 0 when it is below 0 |
| Red line (squared) | A parabola with its lowest point at score $= 1$, where the value is 0 | A parabola with its lowest point at score $= -1$ |
| Relation of the two lines | The red line lies above the blue line | The red line lies above the blue line |

The conclusion is written at the bottom of the page:

$$
\text{err}_{0/1} \le \text{err}_{\text{sqr}}
$$

The lecture calls this a proof by picture. This article adds the algebraic version. Let $s = \mathbf{w}^\top\mathbf{x}$. Because $y \in \{-1, +1\}$, $y^2 = 1$, so

$$
(s - y)^2 = y^2(s - y)^2 = (ys - y^2)^2 = (ys - 1)^2
$$

Look at the two cases separately. When the classification is correct, $\text{err}_{0/1} = 0$ and a square cannot be negative, so the inequality holds. When the classification is wrong, $s$ and $y$ have different signs, $ys \le 0$, so $ys - 1 \le -1$ and $(ys - 1)^2 \ge 1 = \text{err}_{0/1}$.

Plug in a few scores for $y = +1$:

| Score $s$ | $-2$ | $-0.5$ | $0.5$ | $1$ | $3$ |
|---|---|---|---|---|---|
| $\text{err}_{0/1}$ | 1 | 1 | 0 | 0 | 0 |
| $\text{err}_{\text{sqr}}$ | 9 | 2.25 | 0.25 | 0 | 4 |

The rightmost column is the right half of the parabola: a score of 3 is a completely correct classification, yet its squared error is 4. The squared error only registers how far the score is from 1, whichever side it is on.

### Connecting to the VC bound

Page 21 puts the inequality into the VC bound. For the same $\mathbf{w}$:

$$
\begin{aligned}
\text{classification } E_{\text{out}}(\mathbf{w}) \ &\overset{\text{VC}}{\le}\ \text{classification } E_{\text{in}}(\mathbf{w}) + \sqrt{\cdots\cdots} \\
&\le\ \text{regression } E_{\text{in}}(\mathbf{w}) + \sqrt{\cdots\cdots}
\end{aligned}
$$

The first line is the VC bound, and the square root holds the term containing $d_{\text{VC}}$. The second line uses the fact that the 0/1 error of every example is no larger than its squared error, and so the same is true after averaging. The lecture's conclusion: the classification $E_{\text{out}}$ is bounded by the regression $E_{\text{in}}$ plus the same complexity term, so working hard to make the regression $E_{\text{in}}$ small is also one way of making the classification $E_{\text{out}}$ good.

The handout says it once more in the language of the previous lecture: take $\text{err}_{\text{sqr}}$ as $\widehat{\text{err}}$, a (loose) upper bound used to approximate $\text{err}_{0/1}$. [Foundations Lecture 8: Noise and Error Measures](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-08-noise-and-error-en) said that the $\widehat{\text{err}}$ an algorithm actually optimizes can be chosen to be easy to solve, and this is an example. The price is stated in one line: trade bound tightness for efficiency.

The handout suggests two uses: $\mathbf{w}_{\text{LIN}}$ is a useful baseline classifier, or it can serve as the initial PLA/pocket vector. In the lecture, Lin says that in practice it often does not perform too badly; and if the bound seems too loose, you can take it as $\mathbf{w}_0$ and let PLA or pocket refine it from a decent starting point, which may need fewer corrections.

### Numerical example: when the regression classifier goes wrong

The following is an example made up for this article, not from the slides. Keep the $\mathrm{X}$ of the four customers and change the output to whether the card is approved: annual incomes 1 and 2 are labeled $-1$, 3 and 4 are labeled $+1$, so $\mathbf{y} = (-1, -1, +1, +1)$. $\mathrm{X}^\dagger$ was already computed earlier:

$$
\mathbf{w}_{\text{LIN}} = \mathrm{X}^\dagger\mathbf{y} = \frac{1}{20}\begin{bmatrix} -20 - 10 + 0 - 10 \\ 6 + 2 + 2 + 6 \end{bmatrix} = \begin{bmatrix} -2 \\ 0.8 \end{bmatrix}
$$

The four scores are $-1.2$, $-0.4$, $0.4$, and $1.2$, every sign is right, and the classification $E_{\text{in}}$ is 0. The squared errors are $0.04$, $0.36$, $0.36$, and $0.04$, and the regression $E_{\text{in}}$ is $0.2$. $0 \le 0.2$, so the upper bound holds; the boundary is at $-2 + 0.8x = 0$, that is, $x = 2.5$, exactly midway between the two groups.

Now add a fifth customer: annual income 12, labeled $+1$. The data is still linearly separable, and a boundary between 2 and 3 gets everything right. Recompute:

$$
\mathrm{A} = \begin{bmatrix} 5 & 22 \\ 22 & 174 \end{bmatrix}, \quad \mathbf{b} = \begin{bmatrix} 1 \\ 16 \end{bmatrix}, \quad \det\mathrm{A} = 386, \quad \mathbf{w}_{\text{LIN}} = \frac{1}{386}\begin{bmatrix} 174 - 352 \\ -22 + 80 \end{bmatrix} = \begin{bmatrix} -89/193 \\ 29/193 \end{bmatrix} \approx \begin{bmatrix} -0.461 \\ 0.150 \end{bmatrix}
$$

| Annual income $x$ | $y$ | Score $\mathbf{w}_{\text{LIN}}^\top\mathbf{x}$ | $\text{err}_{0/1}$ | $\text{err}_{\text{sqr}}$ |
|---|---|---|---|---|
| 1 | $-1$ | $-0.311$ | 0 | 0.475 |
| 2 | $-1$ | $-0.161$ | 0 | 0.705 |
| 3 | $+1$ | $-0.010$ | 1 | 1.021 |
| 4 | $+1$ | $0.140$ | 0 | 0.740 |
| 12 | $+1$ | $1.342$ | 0 | 0.117 |

The classification $E_{\text{in}}$ is $\frac{1}{5} = 0.2$ and the regression $E_{\text{in}}$ is $\frac{118}{193} \approx 0.611$. The upper bound still holds, but the regression classifier gets the customer with annual income 3 wrong, even though a line that classifies everything correctly clearly exists for this data.

**What this result means.** The cause is the right half of the parabola. The fifth customer is far from the boundary: if the slope of the line stayed at 0.8, that customer's score would be 7.6, with squared error $(7.6 - 1)^2 \approx 43.6$. To push down this one example, regression flattens the line, the boundary moves from 2.5 to about 3.07, and the customer with annual income 3 falls on the wrong side. This is what the handout means by loose: making the upper bound small does not guarantee that the 0/1 error we actually care about is minimized.

The second use the handout suggests shows its effect here. Run PLA from [Foundations Lecture 2: Perceptrons and PLA](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm-en) on these five examples (this article's procedure: each time, scan down from the first example for the first misclassified point, correct with $\mathbf{w} \leftarrow \mathbf{w} + y_n\mathbf{x}_n$, then go back to the first example and scan again; a score of exactly 0 counts as a mistake). The result: starting from the zero vector takes 23 corrections to get everything right, and starting from $\mathbf{w}_{\text{LIN}}$ takes 6. The counts depend on the order in which mistakes are looked for, and a different visiting scheme gives different numbers; this is an observation on one data set, not a guarantee.

### Fun Time: which functions are upper bounds of the 0/1 error

**Question (page 22):** Which of the following functions are upper bounds of the pointwise 0/1 error $\llbracket\text{sign}(\mathbf{w}^\top\mathbf{x}) \ne y\rrbracket$ for $y \in \{-1, +1\}$?

1. $\exp(-y\mathbf{w}^\top\mathbf{x})$
2. $\max(0,\ 1 - y\mathbf{w}^\top\mathbf{x})$
3. $\log_2\big(1 + \exp(-y\mathbf{w}^\top\mathbf{x})\big)$
4. all of the above

**Answer: 4.** The handout's solution is to plot the curves and you'll see; it adds that all three can be used for binary classification, that each connects to a very important algorithm in machine learning, and that one of them will be discussed in the next lecture.

This article adds a verification that needs no plot. Let $z = y\mathbf{w}^\top\mathbf{x}$; a correct classification is $z > 0$ and a wrong one is $z \le 0$. None of the three functions is ever negative, so the bound always holds when the classification is correct (0/1 error 0); all that needs checking is whether each is at least 1 when $z \le 0$:

- $\exp(-z)$: when $z \le 0$, $-z \ge 0$ and $\exp(-z) \ge \exp(0) = 1$.
- $\max(0, 1 - z)$: when $z \le 0$, $1 - z \ge 1$.
- $\log_2(1 + \exp(-z))$: when $z \le 0$, $1 + \exp(-z) \ge 2$, and after $\log_2$ it is at least 1.

| $z$ | $-2$ | $-1$ | $0$ | $1$ | $2$ |
|---|---|---|---|---|---|
| 0/1 error | 1 | 1 | 1 | 0 | 0 |
| $\exp(-z)$ | 7.389 | 2.718 | 1 | 0.368 | 0.135 |
| $\max(0, 1 - z)$ | 3 | 2 | 1 | 0 | 0 |
| $\log_2(1 + \exp(-z))$ | 3.069 | 1.895 | 1 | 0.452 | 0.183 |

The base 2 in the third function is there for a reason: with the natural logarithm, the value at $z = 0$ would be $\ln 2 \approx 0.693$, which is less than 1, and it would no longer be an upper bound. The one the handout promises for the next lecture is the third: the error function of [Foundations Lecture 10: Logistic Regression](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-10-logistic-regression-en) is $\ln(1 + \exp(-y\mathbf{w}^\top\mathbf{x}))$. Which algorithms the other two correspond to is not written in this handout; the lecture only says that after finishing this course and the one that follows (Machine Learning Techniques), you will have learned all three. What follows is an addition in this article, checked against the Techniques handouts: $\max(0, 1 - z)$ is written $\widehat{\text{err}}_{\text{SVM}}$ in the handout of [Techniques Lecture 5: Kernel Logistic Regression](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-logistic-support-vector-regression-en) and called the hinge error measure, the error that appears once soft-margin SVM is rewritten in unconstrained form; $\exp(-z)$ is written $\widehat{\text{err}}_{\text{ADA}}$ in the handout of [Techniques Lecture 11: Gradient Boosted Decision Trees](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-11-gradient-boosted-decision-tree-en) and called the exponential error measure, and that lecture explains that AdaBoost can be viewed as minimizing this error. Both handouts also note that these are upper bounds of $\text{err}_{0/1}$.

The summary on page 23 condenses each of the four sections into one line: use hyperplanes to approximate real values; analytic solution with pseudo-inverse; $E_{\text{out}} - E_{\text{in}} \approx \frac{2(d+1)}{N}$ on average; 0/1 error ≤ squared error. The preview at the bottom of the page is "binary classification, regression, and then?" In the lecture, Lin says the next lecture still uses a linear model but solves a different kind of problem.

## Self-check

**1. The hypothesis has no constant term, $h(x) = wx$, with a single parameter. The data is $(x, y) = (1, 1)$, $(2, 3)$, $(3, 7)$. Find $w_{\text{LIN}}$, the three predictions, and $E_{\text{in}}$.**

Answer: $\mathrm{X}$ has a single column $(1, 2, 3)$, $\mathrm{X}^\top\mathrm{X} = 1 + 4 + 9 = 14$, $\mathrm{X}^\top\mathbf{y} = 1 + 6 + 21 = 28$, and $w_{\text{LIN}} = \frac{28}{14} = 2$. The predictions are $(2, 4, 6)$, the residuals are $(-1, -1, 1)$, and $E_{\text{in}} = \frac{1 + 1 + 1}{3} = 1$. Check: the inner product of the residuals with $(1, 2, 3)$ is $-1 - 2 + 3 = 0$, so they are perpendicular. The general formula is $w_{\text{LIN}} = \frac{\sum x_n y_n}{\sum x_n^2}$.

**2. A regression problem has 4 features (5 weights in total with the constant term), noise level $\sigma^2 = 4$, and $N = 20$ examples. By the handout's two formulas, what are the average $E_{\text{in}}$, the average $E_{\text{out}}$, and the gap between them? How much data is needed to halve the gap?**

Answer: $\frac{d+1}{N} = \frac{5}{20} = 0.25$. The average $E_{\text{in}} = 4 \times 0.75 = 3$, the average $E_{\text{out}} = 4 \times 1.25 = 5$, and the gap is 2. The gap is $\sigma^2 \cdot \frac{2(d+1)}{N} = \frac{40}{N}$, and bringing it to 1 requires $N = 40$.

**3. When $N = d + 1$ and $\mathrm{X}$ is an invertible square matrix, what is $\mathrm{H}$? What is $E_{\text{in}}$? Is this consistent with the handout's formula? Can we say the learning went well in this case?**

Answer: when $\mathrm{X}$ is invertible, $\mathrm{X}^\dagger = (\mathrm{X}^\top\mathrm{X})^{-1}\mathrm{X}^\top = \mathrm{X}^{-1}(\mathrm{X}^\top)^{-1}\mathrm{X}^\top = \mathrm{X}^{-1}$, so $\mathrm{H} = \mathrm{X}\mathrm{X}^{-1} = \mathrm{I}$, $\hat{\mathbf{y}} = \mathbf{y}$, and $E_{\text{in}} = 0$. The formula gives $\sigma^2(1 - 1) = 0$, which is consistent; $\text{trace}(\mathrm{I} - \mathrm{H}) = 0$ matches as well. We cannot say the learning went well: the same pair of formulas gives an average $E_{\text{out}}$ of $2\sigma^2$, and $E_{\text{in}} = 0$ only because there are as many unknowns as examples, so even the noise has been fitted.

**4. Take $\hat{\mathbf{y}}$ as the new labels and run linear regression again on the same $\mathrm{X}$. What are the resulting weights and $E_{\text{in}}$? Which property of the hat matrix does this correspond to?**

Answer: the new weights are $\mathrm{X}^\dagger\hat{\mathbf{y}} = \mathrm{X}^\dagger\mathrm{X}\mathrm{X}^\dagger\mathbf{y} = \mathrm{X}^\dagger\mathbf{y} = \mathbf{w}_{\text{LIN}}$ (using $\mathrm{X}^\dagger\mathrm{X} = \mathrm{I}$), the same as before. The new predictions are $\mathrm{H}\hat{\mathbf{y}} = \mathrm{H}^2\mathbf{y} = \mathrm{H}\mathbf{y} = \hat{\mathbf{y}}$, identical to the new labels, so $E_{\text{in}} = 0$. The corresponding property is $\mathrm{H}^2 = \mathrm{H}$: $\hat{\mathbf{y}}$ is already in the span, and projecting it again does not move it.

**5. Use linear regression for binary classification. For one example with $y = +1$, three different $\mathbf{w}$ give it scores $0.9$, $3$, and $-0.5$. What are the 0/1 error and the squared error in each case? Which one does regression most want to fix? What does this show?**

Rubric: the three pairs are $(0, 0.01)$, $(0, 4)$, and $(1, 2.25)$. The largest squared error belongs to the score 3, a case that is classified completely correctly. The answer should say that the squared error penalizes "how far from $+1$", and a score that is too large is penalized too; so minimizing the regression $E_{\text{in}}$ may sacrifice points near the boundary in order to pull back correct points that are far away. This is where the upper bound is loose, and it is what happened in the five-customer example.

## Exercises and corresponding reading

**How the course versions line up.** On the [Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) the slides for this lecture are [09u](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/09u_handout.pdf), which has only three subsections and drops the MOOC version's Linear Regression for Binary Classification; Fall 2024's Lecture 11 (11u) in turn opens with Linear Models for Binary Classification. This article still follows the MOOC version and covers all four sections. The [Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) schedules Lectures 9 and 10 in W5 (10/07); when checked on 2026-09-30, that week's 09u slides were not yet public.

**Textbook.** According to the Fall 2024 course page, this lecture corresponds to Section 3.2 of [Learning from Data](http://amlbook.com) (LFD).

**How far self-study can go.** The videos and handouts are public; the Fall 2024 homework PDFs and the LIBSVM data sets are public too, so you can work the problems yourself, but there are no official solutions and grading is for enrolled students only.

**Homework.** The problems in [Fall 2024 HW3](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf) (released 2024-10-07, due 10-21) related to this lecture:

- **Q2**: one-dimensional linear regression without $x_0$, $h(x) = wx$; what is the optimal $w_{\text{lin}}$. Self-check question 1 is a numerical version of this form.
- **Q3**: which operation on $\mathrm{X}$ (scaling one row, scaling one column, multiplying everything by 2, adding several columns to the first column) may change the hat matrix $\mathrm{H}$. Hint: $\mathrm{H}$ is the projection onto the span, so first think about whether each operation changes the span.
- **Q8**: change $x_0$ of every example from 1 to 1126 and run linear regression again; prove that the new and old solutions differ by a diagonal matrix $\mathrm{D}$.
- **Q10–12 (programming)**: use the [cpusmall_scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/regression/cpusmall_scale) data set from the LIBSVM site (8,192 examples, 12 features). Q10 takes $N = 32$, runs linear regression 1,126 times, and draws a scatter plot of $(E_{\text{in}}, E_{\text{out}})$; Q11 averages 16 runs for each of $N = 25, 50, \dots, 2000$ and draws the learning curve; Q12 repeats this with only the first 2 features and compares with Q11.

**How to do them.** For the programming problems, first write `np.linalg.pinv(X) @ y` yourself, then cross-check the result with `np.linalg.lstsq` or scikit-learn's `LinearRegression`. Compare the shape of the learning curve from Q11 with the $d + 1 = 13$ table in the learning-curve section; Q12 has $d + 1 = 3$, so by the formula the gap is much smaller, but whether the horizontal line that $E_{\text{in}}$ and $E_{\text{out}}$ converge to gets higher is the thing worth looking at. You can also redo this article's singular experiment: generate random data with $N = 100$ and $d = 5$, compare `pinv` with computing `inv(X.T @ X) @ X.T @ y` yourself, then change one column into twice another column and see which one breaks. The guide to the whole assignment is in [Foundations Homework](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide-en).

**Further reading.** [Stanford CS229 Lecture 2: The Supervised Learning Setup and Linear Regression](/posts/ai/2026-10-12-stanford-cs229-lecture-02-supervised-learning-linear-regression-en) covers the same problem along two routes, gradient descent and the normal equation, and can be read alongside this lecture's treatment.

**Next lecture.** [Foundations Lecture 10: Logistic Regression](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-10-logistic-regression-en) changes the output to a probability and the error function to the third option of the last Fun Time. It has no analytic solution: the zero-gradient equation cannot be solved, so it has to switch to gradient descent, which walks downhill one step at a time.

## Course video sources

Original videos: [Linear Regression Problem](https://www.youtube.com/watch?v=qGzjYrLV-4Y), [Linear Regression Algorithm](https://www.youtube.com/watch?v=2LfdSCdcg1g), [Generalization Issue](https://www.youtube.com/watch?v=lj2jK1FSwgo), [Linear Regression for Binary Classification](https://www.youtube.com/watch?v=tF1HTirYbtc)

- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

Checked: 2026-10-13. The video IDs, titles, and lengths were taken from the official playlist that day; the videos have no caption track on YouTube, and what this article reports from the lecture comes from transcripts made for it.

## Update Log

- 2026-10-13: Previously combined with Lecture 10 in one article; changed to one article per lecture and rewritten from the handout and the video transcripts.
- 2026-10-10: Rechecked the video status. The embedded videos match the lectures in the official playlist.
- 2026-10-10: Marked the video status and verified the recording sources and how they were obtained.

## References

- [Foundations Lecture 9 handout, 09_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/09_handout.pdf): the main source for this article. The derivations in the four sections, the figures, and the four Fun Time questions all come from this handout.
- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf): the IDs and titles of the four videos; what the text reports as said "in the lecture" is paraphrased from machine transcripts of these four videos.
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/): the official entry for handouts and recordings.
- [Techniques Lecture 5 handout, 205_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/205_handout.pdf) and [Techniques Lecture 11 handout, 211_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/211_handout.pdf): the algorithms that the hinge error and the exponential error in the last Fun Time each correspond to.
- [Fall 2024 Lecture 9 slides (09u)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/09u_handout.pdf): the version difference, with only three subsections.
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/): the corresponding LFD section and the entry to the homework.
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/): the week this lecture falls in for Fall 2026.
- [Fall 2024 Homework 3 (hw3_red.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf): the content of Q2, Q3, Q8, and Q10–12.
- [LIBSVM Data: cpusmall_scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/regression/cpusmall_scale): the data set for the HW3 programming problems; this article uses its number of features as the learning-curve scenario.
- [Learning from Data textbook website](http://amlbook.com): the source of Section 3.2.
- [MOOC slide errata](https://www.csie.ntu.edu.tw/~htlin/mooc/errata.php): the official errata entry.
- [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques: Course Overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en): where this lecture sits in the whole course and the reading routes.
