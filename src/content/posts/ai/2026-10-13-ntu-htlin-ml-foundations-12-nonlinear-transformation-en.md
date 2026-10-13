---
title: "Nonlinear Transformation: The Price of Curved Boundaries | NTU Hsuan-Tien Lin Machine Learning Foundations Lecture 12"
date: 2026-10-13
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, feature-engineering, classification, learning-theory]
lang: en
math: true
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 12
tldr: "When no straight line separates the data, you do not need to redesign the algorithm: use a feature transform Φ to turn x into z, run a linear model in Z-space as usual, and the line in Z-space is a quadratic or higher-order curve in X-space. The Q-th order polynomial transform raises the dimension to d̃ = C(Q+d, d) − 1, and computation, storage, and the VC dimension (at most d̃+1) all grow with it, so the lecture concludes that you should try the linear model first and move to higher orders only when it is not enough."
description: "A guide to Lecture 12 of NTU Hsuan-Tien Lin's Machine Learning Foundations, Nonlinear Transformation: quadratic hypotheses and Z-space, the three steps of the nonlinear transform, the dimension formula of the polynomial transform and its VC dimension upper bound, why the transform must not be chosen after looking at the data, structured hypothesis sets and trying the linear model first, with PLA in Z-space worked by hand on seven points."
draft: false
glossary:
  - term: "feature transform"
    aliases: ["nonlinear transform", "Φ"]
    definition: "A function that replaces the raw input x with another set of features z = Φ(x). The transform itself may be nonlinear; running a linear model on z after the transform gives a nonlinear boundary when viewed back in x."
    context: "Foundations Lecture 12 uses Φ(x) = (1, x₁², x₂²) to turn a circular boundary into a line."
    links:
      - label: "Foundations Lecture 12 handout"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/12_handout.pdf"
  - term: "Z-space"
    aliases: ["Z space", "Z world"]
    definition: "The space where z = Φ(x) lives after the feature transform. The handout writes the weights in this space as w̃ and its dimension as d̃, using the tilde to tell them apart from w and d in X-space."
    context: "Foundations Lecture 12 runs PLA, linear regression, or logistic regression in Z-space."
  - term: "Q-th order polynomial transform"
    aliases: ["polynomial transform", "Φ_Q"]
    definition: "The vector made of all monomials of degree 0 through Q formed from d input variables. Without the constant term it has d̃ = C(Q+d, d) − 1 dimensions, which is O(Q^d) for fixed d."
    context: "Foundations Lecture 12 uses it to work out what the transform costs in computation, storage, and model complexity."
  - term: "structured hypothesis sets"
    aliases: ["nested hypothesis sets"]
    definition: "A chain of hypothesis sets, each containing the previous one: H₀ ⊂ H₁ ⊂ H₂ ⊂ …. Moving outward, the VC dimension never decreases and the lowest achievable E_in never increases."
    context: "Foundations Lecture 12 gets this structure from the recursive definition of the polynomial transform and uses it to recommend trying H₁ first."
---

> 🌏 [中文版](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-12-nonlinear-transformation)

**Video status: Videos included.** This article is written from the official MOOC handout [12_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/12_handout.pdf) and transcripts of this lecture's four official videos, with formulas following the handout. The transcripts are machine transcripts made for this article (Whisper), not official captions, and no human has proofread them. The videos are taught in Mandarin; the slides are in English. Each section opens with its official video and the approximate time ranges. Page numbers refer to the number at the lower right of each slide (0/22 to 22/22), and wherever the text says "in the lecture" it is paraphrasing what is said in the video.

This is Foundations Lecture 12 in [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en). The Roadmap on page 1 of the handout divides Foundations into four questions, and this is the last lecture under the third one, "How Can Machines Learn?". The previous lecture, [Foundations Lecture 11: Linear Models for Classification](/posts/ai/2026-09-30-ntu-htlin-ml-linear-classification-nonlinear-transform-en), is summarized on the same page: binary classification via (logistic) regression; multiclass via OVA/OVO decomposition. Up to that point, the three models PLA, linear regression, and logistic regression can only compute a linear score $s = \mathbf{w}^\top\mathbf{x}$. This lecture answers the question of whether those three models are still usable when no line separates the data at all.

The prerequisites are [PLA from Foundations Lecture 2](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm-en) (the update rule $\mathbf{w} \leftarrow \mathbf{w} + y_n\mathbf{x}_n$), [the VC dimension from Foundations Lecture 7](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error-en) ($d_{\text{VC}} = d + 1$ for the $d$-dimensional perceptron, and how to read $E_{\text{out}} \le E_{\text{in}} + \Omega$), plus conic sections and counting from high school. After reading, you should be able to write a quadratic curve as a weight vector in Z-space, work through every step of "transform, then run PLA" by hand on a small data set, compute the dimension of the $Q$-th order polynomial transform, and explain why choosing the transform after looking at the data voids the VC guarantee.

## What to do when no line separates the data: turning a circular boundary into a line in Z-space

```youtube
url: https://www.youtube.com/watch?v=8pQ06pku1xA
title: Nonlinear Transformation :: Quadratic Hypotheses @ Machine Learning Foundations (機器學習基石)
```

(Video 00:17–02:30 reviews linear hypotheses and their limit, 02:30–04:59 covers circular separable data, 04:59–11:21 renames the coefficients and the inputs, 11:21–17:29 looks at the curve each of five weight vectors draws, 17:29–22:58 covers the general quadratic hypothesis set, and Fun Time follows.)

### What linear hypotheses offer and where they stop

Page 2 of the handout arranges the linear hypotheses seen so far into two columns. The left column is what they look like: visually a 'line'-like boundary, mathematically linear scores $s = \mathbf{w}^\top\mathbf{x}$. The right column is their limit: theoretically $d_{\text{VC}}$ is under control, which is good; practically, on some $\mathcal{D}$, $E_{\text{in}}$ is large for every line. The figure in the right column shows a cluster of circles (○) in the middle with crosses (×) scattered around them, and no straight line separates the two.

In the lecture, Lin connects the two facts as cause and effect: because the model's complexity is under control, $E_{\text{in}}$ and $E_{\text{out}}$ do not drift far apart; but for exactly the same reason, there will be data that no line cuts well. Then $E_{\text{in}}$ is large, $E_{\text{out}}$ is close to it and therefore also large, and nothing has been learned. The goal of the lecture is written at the bottom of page 2: how to break the limit of linear hypotheses.

### Circular separable

Page 3 draws the same data again, this time with a circle added. The handout says this data is not linear separable but is circular separable: a circle of radius $\sqrt{0.6}$ centered at the origin separates it, and the corresponding hypothesis is

$$
h_{\text{SEP}}(\mathbf{x}) = \text{sign}\left(-x_1^2 - x_2^2 + 0.6\right)
$$

$x_1^2 + x_2^2$ is the squared distance from the point to the origin. In the lecture, Lin reads the hypothesis this way: compare that squared distance with 0.6, say circle when it is smaller than 0.6, and say cross when it is larger.

Since circular separable data exists, one direct idea is to redo everything learned so far: a circular PLA, a circular regression, a circular logistic regression. That is the question at the bottom of the page (re-derive Circular-PLA, Circular-Regression, blahblah … all over again?). In the lecture, Lin answers on the students' behalf: that is too hard, since every algorithm would have to be gone through again to find where the line must become a circle. So what comes next is a systematic method that does not require redesigning the algorithms one by one.

### Renaming the coefficients and the inputs

Page 4 does only one thing: it gives names. Split $h_{\text{SEP}}$ into its three terms and write each as "a coefficient times a quantity that depends on the input":

$$
h(\mathbf{x}) = \text{sign}\Big(\underbrace{0.6}_{\tilde{w}_0} \cdot \underbrace{1}_{z_0} + \underbrace{(-1)}_{\tilde{w}_1} \cdot \underbrace{x_1^2}_{z_1} + \underbrace{(-1)}_{\tilde{w}_2} \cdot \underbrace{x_2^2}_{z_2}\Big) = \text{sign}\left(\tilde{\mathbf{w}}^\top\mathbf{z}\right)
$$

The lecture goes through this one step at a time. The three numbers 0.6, $-1$, and $-1$ determine what the hypothesis does, for example whether it is a circle of radius $\sqrt{0.6}$ or of radius $\sqrt{0.8}$; they play the same role as the weights of a linear hypothesis, so they are called $w_0, w_1, w_2$. Previously $w_1$ was paired with $x_1$, and now it is paired with $x_1^2$; to make that visible, $x_1^2$ is called $z_1$ and $x_2^2$ is called $z_2$, and the constant term gets a $z_0 = 1$ by analogy with the old $x_0 = 1$. Once that is written out, the expression differs from the linear world's $w_0x_0 + w_1x_1 + w_2x_2$ only in that $x$ has become $z$. To keep the new weights from being confused with the original ones, a tilde is placed above them; Lin nicknames it the little earthworm, a reminder that this is the $\mathbf{w}$ of the Z world. (Lin also says up front that the written form will be $\tilde{\mathbf{w}}$, but when speaking it is simpler to just say $\mathbf{w}$.)

With the names in place, the same thing can be seen from another angle. Square each of the two components of every point $\mathbf{x} = (x_1, x_2)$ and plot the result on another figure whose coordinates are $(z_1, z_2)$. The handout writes this operation as

$$
\mathbf{x} \in \mathcal{X} \ \overset{\boldsymbol{\Phi}}{\longmapsto}\ \mathbf{z} \in \mathcal{Z}
$$

and calls $\boldsymbol{\Phi}$ the (nonlinear) feature transform. In the lecture, the left side is called the X world and the right side the Z world. The figure on the right of page 4 is the transformed data: horizontal axis $z_1$, vertical axis $z_2$, the circles crowded into the lower left near the origin, the crosses toward the upper right, and a straight line from $(0, 0.6)$ to $(0.6, 0)$ separating the two groups. That line is $0.6 - z_1 - z_2 = 0$, which is the original circle.

This gives the first conclusion of the lecture:

$$
\{(\mathbf{x}_n, y_n)\}\ \text{circular separable} \ \Longrightarrow\ \{(\mathbf{z}_n, y_n)\}\ \text{linear separable}
$$

An addition in this article: the Z-space figure has one feature that is easy to miss. Neither $z_1 = x_1^2$ nor $z_2 = x_2^2$ can be negative, so whatever the data looks like in X-space, every transformed point lands in the first quadrant (axes included). This will be used shortly.

### Does the converse hold: a line in Z-space is not always a circle

The bottom of page 4 leaves a question: vice versa? If the transformed data is linear separable, does that mean the original data can be separated by a circle? Page 5 answers: not necessarily. First write the hypothesis in Z-space in full:

$$
(z_0, z_1, z_2) = \mathbf{z} = \boldsymbol{\Phi}(\mathbf{x}) = (1, x_1^2, x_2^2)
$$

$$
h(\mathbf{x}) = \tilde{h}(\mathbf{z}) = \text{sign}\left(\tilde{\mathbf{w}}^\top\boldsymbol{\Phi}(\mathbf{x})\right) = \text{sign}\left(\tilde{w}_0 + \tilde{w}_1 x_1^2 + \tilde{w}_2 x_2^2\right)
$$

To find out what a given $\tilde{\mathbf{w}}$ draws in X-space, the method taught in the lecture is to look for "where it switches": the points where the quantity inside the sign equals 0 form the boundary, and the signs of the coefficients then decide which side is the circle side. The handout lists five choices of $\tilde{\mathbf{w}} = (\tilde{w}_0, \tilde{w}_1, \tilde{w}_2)$; the table below writes out the boundary equation for each (the semi-axis lengths and the "which side is positive" entries in the last column are computed in this article with the same method):

| $\tilde{\mathbf{w}}$ | Boundary (inside of sign equals 0) | What the handout says | Where the output is $+1$ (circle) |
|---|---|---|---|
| $(0.6, -1, -1)$ | $x_1^2 + x_2^2 = 0.6$ | circle (◦ inside) | Inside the circle. Plug in the origin: $0.6 > 0$ |
| $(-0.6, +1, +1)$ | $x_1^2 + x_2^2 = 0.6$ | circle (◦ outside) | Outside the circle. Plug in the origin: $-0.6 < 0$ |
| $(0.6, -1, -2)$ | $x_1^2 + 2x_2^2 = 0.6$ | ellipse | Inside the ellipse. Semi-axis $\sqrt{0.6} \approx 0.775$ along $x_1$, semi-axis $\sqrt{0.3} \approx 0.548$ along $x_2$ |
| $(0.6, -1, +2)$ | $x_1^2 - 2x_2^2 = 0.6$ | hyperbola | The region between the two branches, the one containing the origin |
| $(0.6, +1, +2)$ | No solution | constant ◦ | Every point |

The first two are the same circle; the only difference is that the whole weight vector is multiplied by $-1$, which swaps inside and outside. The third doubles the coefficient of $x_2^2$, so the two axes have different lengths, and Lin points out that this is no longer the perfect circle from before but an ellipse. The fourth has one positive and one negative coefficient, which is the hyperbola from high school. The fifth is the most unusual: in the lecture, Lin imagines a student coming back to report that there is no place where the expression equals 0, because $0.6$ plus two quantities that cannot be negative is positive no matter what, so the output is always circle.

An addition in this article: the fifth case is even more direct in the Z-space picture. The whole line $0.6 + z_1 + 2z_2 = 0$ lies outside the first quadrant, while all transformed data lies inside it, so the line touches no data and every point is on the same side of it.

So different lines in Z-space can come back to X-space as a circle, an ellipse, a hyperbola, or a constant. The handout's conclusion is

$$
\text{lines in } \mathcal{Z}\text{-space} \iff \textbf{special} \text{ quadratic curves in } \mathcal{X}\text{-space}
$$

The handout prints the word special in red. In the lecture, Lin explains what is special about them: taking the circle as the example, its center is always at the origin. A circle centered anywhere else has first-order terms once expanded (they come from the shift), and $\boldsymbol{\Phi}(\mathbf{x}) = (1, x_1^2, x_2^2)$ has no $x_1$ or $x_2$ entry, so it cannot be represented. An addition in this article: likewise, without an $x_1x_2$ term there is no way to make a tilted ellipse; every curve this transform can draw is symmetric about both the $x_1$ axis and the $x_2$ axis.

### The general quadratic hypothesis set

To get every quadratic curve, the answer in the lecture is to put in every term needed to represent one: all the second-order terms, all the first-order terms, and the constant. Page 6 writes this 'bigger' Z-space as

$$
\boldsymbol{\Phi}_2(\mathbf{x}) = (1, x_1, x_2, x_1^2, x_1x_2, x_2^2)
$$

Now $\mathbf{z}$ has 6 components. Each perceptron in Z-space corresponds to one quadratic hypothesis in X-space, and the handout defines this hypothesis set as

$$
\mathcal{H}_{\boldsymbol{\Phi}_2} = \left\{h(\mathbf{x}) : h(\mathbf{x}) = \tilde{h}(\boldsymbol{\Phi}_2(\mathbf{x})) \text{ for some linear } \tilde{h} \text{ on } \mathcal{Z}\right\}
$$

In words: first send $\mathbf{x}$ to Z-space with $\boldsymbol{\Phi}_2$, then let some linear classifier $\tilde{h}$ in Z-space decide; collect every $h$ built this way and you have $\mathcal{H}_{\boldsymbol{\Phi}_2}$. The handout says it can implement all possible quadratic curve boundaries: circle, ellipse, rotated ellipse, hyperbola, parabola, and so on.

The handout's example is a tilted ellipse:

$$
2(x_1 + x_2 - 3)^2 + (x_1 - x_2 - 4)^2 = 1 \quad\Longleftarrow\quad \tilde{\mathbf{w}}^\top = [33, -20, -4, 3, 2, 3]
$$

The handout gives only the result, and in the lecture Lin computes the constant term and the two first-order terms aloud. Here is the full expansion. The first square:

$$
2(x_1 + x_2 - 3)^2 = 2x_1^2 + 4x_1x_2 + 2x_2^2 - 12x_1 - 12x_2 + 18
$$

The second square:

$$
(x_1 - x_2 - 4)^2 = x_1^2 - 2x_1x_2 + x_2^2 - 8x_1 + 8x_2 + 16
$$

Add the two and move the 1 from the right side to the left:

$$
\underbrace{(18 + 16 - 1)}_{33} + \underbrace{(-12 - 8)}_{-20}\,x_1 + \underbrace{(-12 + 8)}_{-4}\,x_2 + \underbrace{(2 + 1)}_{3}\,x_1^2 + \underbrace{(4 - 2)}_{2}\,x_1x_2 + \underbrace{(2 + 1)}_{3}\,x_2^2 = 0
$$

Arrange the coefficients in the order of $\boldsymbol{\Phi}_2$ (constant, $x_1$, $x_2$, $x_1^2$, $x_1x_2$, $x_2^2$) and you get $[33, -20, -4, 3, 2, 3]$. The three numbers computed in the lecture are the same: constant term $18 + 16 - 1 = 33$, coefficient of $x_1$ equal to $-12 - 8 = -20$, coefficient of $x_2$ equal to $-12 + 8 = -4$.

Two additions in this article. First, the center of this ellipse is where $x_1 + x_2 = 3$ and $x_1 - x_2 = 4$, that is, $(3.5, -0.5)$; plugging it into $\tilde{\mathbf{w}}^\top\boldsymbol{\Phi}_2(\mathbf{x})$ gives $-1$, so these weights output $-1$ inside the ellipse and $+1$ outside. To make the inside $+1$, multiply the whole vector by $-1$. Second, the coefficient 2 of $x_1x_2$ is not 0, which is exactly why the ellipse is tilted and also why $(1, x_1^2, x_2^2)$ cannot produce it.

The handout adds one last line: $\mathcal{H}_{\boldsymbol{\Phi}_2}$ also includes lines and constants as degenerate cases. The explanation in the lecture is that a line needs only the first three weights: set the weights of the three second-order terms to 0 and what remains, $\tilde{w}_0 + \tilde{w}_1x_1 + \tilde{w}_2x_2$, is the original linear hypothesis; the constant classifiers that always say circle or always say cross are in there too. So the quadratic hypothesis set contains the original linear hypothesis set. This containment becomes the main subject of the last section.

### Fun Time: the weights of a parabola

**Question (page 7):** Using the transform $\boldsymbol{\Phi}_2(\mathbf{x}) = (1, x_1, x_2, x_1^2, x_1x_2, x_2^2)$, which of the following weights $\tilde{\mathbf{w}}^\top$ in the Z-space implements the parabola $2x_1^2 + x_2 = 1$?

1. $[-1, 2, 1, 0, 0, 0]$
2. $[0, 2, 1, 0, -1, 0]$
3. $[-1, 0, 1, 2, 0, 0]$
4. $[-1, 2, 0, 0, 0, 1]$

**Answer: 3.** Rearrange the equation into $-1 + x_2 + 2x_1^2 = 0$ and match it against the six positions of $\boldsymbol{\Phi}_2$: the constant coefficient is $-1$, $x_1$ does not appear so it is 0, the coefficient of $x_2$ is 1, the coefficient of $x_1^2$ is 2, and $x_1x_2$ and $x_2^2$ are both 0, which gives $[-1, 0, 1, 2, 0, 0]$. The handout's comment is that the question is too simple; the point is that the flexibility to implement arbitrary quadratic curves opens new possibilities for minimizing $E_{\text{in}}$.

Each of the other options is a different curve (worked out in this article):

- Option 1 is $-1 + 2x_1 + x_2 = 0$, a straight line. It puts the 2 in the $x_1$ position instead of the $x_1^2$ position.
- Option 2 is $2x_1 + x_2 - x_1x_2 = 0$, which rearranges to $(x_1 - 1)(x_2 - 2) = 2$, a hyperbola.
- Option 4 is $-1 + 2x_1 + x_2^2 = 0$, also a parabola, but the square falls on $x_2$ and it opens toward negative $x_1$, so it is not the one the question asks for.

Check: take the four points $(0, 1)$, $(1, -1)$, $(-2, -7)$, and $(\frac{1}{3}, \frac{7}{9})$ on the parabola; option 3 is the only one whose $\tilde{\mathbf{w}}^\top\boldsymbol{\Phi}_2(\mathbf{x})$ is 0 at all four.

## How to learn a good quadratic curve: transform, run a linear algorithm, plug back in

```youtube
url: https://www.youtube.com/watch?v=UHAn6Cuk8zk
title: Nonlinear Transformation :: Nonlinear Transform @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–03:56 covers the three steps of the transform, 03:56–05:50 the two choices and Pandora's box, 05:50–08:36 explains that the feature transform is nothing new, and Fun Time follows.)

### Trading "find a good quadratic curve" for "find a good line"

The previous section established a correspondence between hypotheses. Page 8 pushes it one step further, with three rows side by side:

| Z-space | | X-space |
|---|---|---|
| perceptrons | $\iff$ | quadratic hypotheses |
| good perceptron | $\iff$ | good quadratic hypothesis |
| separating perceptron | $\iff$ | separating quadratic hypothesis |

The first row is the definition. The other two hold because the predictions on the same example are identical on both sides: $h(\mathbf{x}_n) = \tilde{h}(\mathbf{z}_n)$, so however many examples $h$ gets wrong on $\{(\mathbf{x}_n, y_n)\}$, $\tilde{h}$ gets the same number wrong on $\{(\mathbf{z}_n, y_n)\}$, and the two $E_{\text{in}}$ values are equal. In the lecture, Lin says that if "good" is taken to mean the smallest $E_{\text{in}}$, then finding a separating line in Z-space is the same as finding a separating quadratic curve in X-space.

The handout then organizes the problem into three lines:

- **want**: get good perceptron in Z-space.
- **known**: get good perceptron in X-space with data $\{(\mathbf{x}_n, y_n)\}$.
- **todo**: get good perceptron in Z-space with data $\{(\mathbf{z}_n = \boldsymbol{\Phi}_2(\mathbf{x}_n), y_n)\}$.

There is no new algorithm in the third line. An algorithm sees only the vectors and labels it is fed; feed it $\mathbf{z}_n$ in place of $\mathbf{x}_n$ and it looks for a line in Z-space.

### The three steps

Page 9 writes the procedure in three steps:

1. Transform original data $\{(\mathbf{x}_n, y_n)\}$ to $\{(\mathbf{z}_n = \boldsymbol{\Phi}(\mathbf{x}_n), y_n)\}$ by $\boldsymbol{\Phi}$.
2. Get a good perceptron $\tilde{\mathbf{w}}$ using $\{(\mathbf{z}_n, y_n)\}$ and your favorite linear classification algorithm $\mathcal{A}$.
3. Return $g(\mathbf{x}) = \text{sign}\left(\tilde{\mathbf{w}}^\top\boldsymbol{\Phi}(\mathbf{x})\right)$.

The same page has four figures arranged in a square. The upper left is the original data in X-space; an arrow to the right labeled $\boldsymbol{\Phi}$ leads to the Z-space data in the upper right; an arrow downward labeled $\mathcal{A}$ leads to the lower-right figure, Z-space with a line drawn and the regions colored; between the lower right and the lower left there are two arrows, one pointing left, labeled $\boldsymbol{\Phi}^{-1}$ and drawn in gray, and one pointing right, labeled $\boldsymbol{\Phi}$; the lower left is the circular boundary in X-space.

The handout does not explain the gray $\boldsymbol{\Phi}^{-1}$, and the lecture spends a good while on it. "Moving" the line in Z-space back to X-space to get a curve is only something we imagine; that inverse operation need not exist, because nothing guarantees that the map from $\mathbf{x}$ to $\mathbf{z}$ is one-to-one. What is actually done is always the arrow pointing right: take a point anywhere in X-space, send it to Z-space with $\boldsymbol{\Phi}$, see which side of the line it lands on to get red or blue, and paint that color back onto the point in X-space. Do this for every point and the lower-left figure appears. The formula in step 3, $g(\mathbf{x}) = \text{sign}(\tilde{\mathbf{w}}^\top\boldsymbol{\Phi}(\mathbf{x}))$, states exactly this order: first $\boldsymbol{\Phi}$, then the inner product, then the sign.

An addition in this article: $(1, x_1^2, x_2^2)$ is itself not one-to-one. $(2, 0)$ and $(-2, 0)$ both square to $(4, 0)$, so one point in Z-space corresponds to several points in X-space, and there is no inverse function. The numerical example below happens to contain such a pair.

### Numerical example: seven points, PLA in Z-space

What follows is an example made up for this article, not from the slides; the numbers were verified with Python (pure integer arithmetic). The data is seven points in X-space:

| $n$ | $\mathbf{x}_n$ | $y_n$ |
|---|---|---|
| 1 | $(0, 0)$ | $+1$ |
| 2 | $(1, 0)$ | $+1$ |
| 3 | $(0, -1)$ | $+1$ |
| 4 | $(2, 0)$ | $-1$ |
| 5 | $(-2, 0)$ | $-1$ |
| 6 | $(0, 2)$ | $-1$ |
| 7 | $(1, 2)$ | $-1$ |

**First confirm that a line cannot do it.** Suppose some line $\text{sign}(w_0 + w_1x_1 + w_2x_2)$ classifies all seven points correctly. Points 4 and 5 are negative, so $w_0 + 2w_1 < 0$ and $w_0 - 2w_1 < 0$. Adding the two gives $2w_0 < 0$. But point 1 is the origin, and classifying it correctly requires $w_0 > 0$, a contradiction. The reason is plain from the picture: the origin sits exactly midway between the two negative points 4 and 5. So this data is not linear separable, and the guarantee proved in [Foundations Lecture 2](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm-en) that PLA halts does not apply in X-space.

**Step 1: transform.** Use $\boldsymbol{\Phi}(\mathbf{x}) = (1, x_1^2, x_2^2)$:

| $n$ | $\mathbf{x}_n$ | $\mathbf{z}_n = (1, x_1^2, x_2^2)$ | $y_n$ |
|---|---|---|---|
| 1 | $(0, 0)$ | $(1, 0, 0)$ | $+1$ |
| 2 | $(1, 0)$ | $(1, 1, 0)$ | $+1$ |
| 3 | $(0, -1)$ | $(1, 0, 1)$ | $+1$ |
| 4 | $(2, 0)$ | $(1, 4, 0)$ | $-1$ |
| 5 | $(-2, 0)$ | $(1, 4, 0)$ | $-1$ |
| 6 | $(0, 2)$ | $(1, 0, 4)$ | $-1$ |
| 7 | $(1, 2)$ | $(1, 1, 4)$ | $-1$ |

Points 4 and 5 coincide in Z-space, which is the non-one-to-one behavior of $\boldsymbol{\Phi}$ mentioned above.

**Step 2: run PLA in Z-space.** Start from $\tilde{\mathbf{w}} = (0, 0, 0)$ and check the points in the order $n = 1, 2, \dots, 7$, starting over after each full pass; a score $\tilde{\mathbf{w}}^\top\mathbf{z}_n$ of exactly 0 counts as a mistake. On each misclassified point, correct with $\tilde{\mathbf{w}} \leftarrow \tilde{\mathbf{w}} + y_n\mathbf{z}_n$. The table lists only the checks that led to a correction:

| Correction number | Point checked | Score $\tilde{\mathbf{w}}^\top\mathbf{z}_n$ before the correction | $y_n$ | $\tilde{\mathbf{w}}$ after the correction |
|---|---|---|---|---|
| 1 | point 1 | $0$ | $+1$ | $(1, 0, 0)$ |
| 2 | point 4 | $1$ | $-1$ | $(0, -4, 0)$ |
| 3 | point 6 | $0$ | $-1$ | $(-1, -4, -4)$ |
| 4 | point 1 | $-1$ | $+1$ | $(0, -4, -4)$ |
| 5 | point 2 | $-4$ | $+1$ | $(1, -3, -4)$ |
| 6 | point 3 | $-3$ | $+1$ | $(2, -3, -3)$ |
| 7 | point 2 | $-1$ | $+1$ | $(3, -2, -3)$ |
| 8 | point 3 | $0$ | $+1$ | $(4, -2, -2)$ |

Take correction 2 as an example: at that moment $\tilde{\mathbf{w}} = (1, 0, 0)$, points 2 and 3 both score 1 and are correct; point 4 scores $1 \cdot 1 + 0 \cdot 4 + 0 \cdot 0 = 1$, so the prediction is $+1$ while the label is $-1$, and therefore $\tilde{\mathbf{w}} \leftarrow (1, 0, 0) - (1, 4, 0) = (0, -4, 0)$. After correction 8, the scores of the seven points are, in order, $4, 2, 2, -4, -4, -4, -6$; every sign agrees with its label, and PLA halts.

**Step 3: return $g$.**

$$
g(\mathbf{x}) = \text{sign}\left(4 - 2x_1^2 - 2x_2^2\right)
$$

The boundary is $x_1^2 + x_2^2 = 2$, a circle centered at the origin with radius $\sqrt{2} \approx 1.414$, with $+1$ inside. In Z-space it is the line $z_1 + z_2 = 2$.

**Predicting new points.** Follow the direction stressed in the lecture: transform first, then compute the score. For $\mathbf{x} = (-1, -0.5)$: $\mathbf{z} = (1, 1, 0.25)$, score $4 - 2 - 0.5 = 1.5$, prediction $+1$. For $\mathbf{x} = (1.5, 1)$: $\mathbf{z} = (1, 2.25, 1)$, score $4 - 4.5 - 2 = -2.5$, prediction $-1$.

**What this result means.** Not one line of the PLA code changed; it is just finding a plane over the three-dimensional $\mathbf{z}$ (or, ignoring $z_0$, which is always 1, a line in the $(z_1, z_2)$ plane). We did only two extra things: before training, replace each $\mathbf{x}_n$ with $\mathbf{z}_n$, and before predicting, replace the new $\mathbf{x}$ with $\mathbf{z}$ as well. That is how data that cannot be cut in X-space reaches $E_{\text{in}}$ equal to 0. This example comes back in the next two sections: the way it picked its transform is actually flawed, and the same data under a different transform learns a different curve.

### Two choices, and Pandora's box

The title of page 10 writes the method as a single formula: Nonlinear Model via Nonlinear $\boldsymbol{\Phi}$ + Linear Models. Two things in the pipeline are yours to decide:

- **feature transform $\boldsymbol{\Phi}$**: what kind of Z-space to transform into.
- **linear model $\mathcal{A}$**: the handout notes specifically, not just binary classification.

In the lecture, Lin expands on the second point: this lecture uses binary classification for the explanation, but the same method applies to linear regression, logistic regression, and even multiclass classification, because at its core it only moves to another space to do linear learning. In training you go to that space to find a line, and in testing you go to that space as well to read off the prediction.

The handout calls the consequence Pandora's box: you can now freely do quadratic PLA, quadratic regression, cubic regression, all the way to polynomial regression. As Lin puts it in the lecture, PLA, pocket, linear regression, and logistic regression, each paired with a quadratic transform, all become quadratic; making them cubic works too, and the flexibility of the algorithms goes up a great deal at once.

### The feature transform is nothing new

The figure on page 11 is about handwritten digits. The upper left shows rows of raw digit images; an arrow to the right labeled $\boldsymbol{\Phi}$ leads to a scatter plot with Average Intensity on the horizontal axis and Symmetry on the vertical axis, where the blue circles are the digit 1 and the red crosses are not 1; going down, $\mathcal{A}$ draws a separating line on that plot; the lower left has a few new digit images, framed in red or blue. The handout's caption is not new, not just polynomial: from raw (pixels) to concrete (intensity, symmetry), with domain knowledge written on the arrow in between.

In the lecture, Lin asks everyone to recall [Foundations Lecture 3](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-03-types-of-learning-en): features were divided there into concrete features, which have a specific physical meaning, and raw features, as originally collected, and it was said that raw signals can be organized into concrete features. In the digit recognition example the raw data is a $16 \times 16$ grayscale image, that is, a 256-dimensional vector; once it is reduced to two numbers, symmetry and "how many black cells are filled", it becomes a two-dimensional vector, and classification is done in two dimensions. Lin adds that the plot separates 1 from the other digits, which resembles the subproblem for class 1 in the one-versus-all decomposition from the previous lecture. Testing works the same way: for a newly written digit, compute these two features first and then decide whether it is a circle or a cross.

So this has been done before; the difference is where the transform comes from. The polynomial transform mechanically lists every term; symmetry and intensity were picked using a person's understanding of the problem. Both are a $\boldsymbol{\Phi}$, and the latter amounts to doing something nonlinear in pixel space.

At the bottom of the page the handout writes: the force, too good to be true? In the lecture, Lin explains that the force is the one from Star Wars, and that the feature transform is that powerful a force in machine learning, usable for many things. The question that follows is whether it comes at a price.

### Fun Time: how many dimensions the quadratic transform of a d-dimensional input has

**Question (page 12):** Consider the quadratic transform $\boldsymbol{\Phi}_2(\mathbf{x})$ for $\mathbf{x} \in \mathbb{R}^d$ instead of in $\mathbb{R}^2$. The transform should include all different quadratic, linear, and constant terms formed by $(x_1, x_2, \dots, x_d)$. What is the number of dimensions of $\mathbf{z} = \boldsymbol{\Phi}_2(\mathbf{x})$?

1. $d$
2. $\frac{d^2}{2} + \frac{3d}{2} + 1$
3. $d^2 + d + 1$
4. $2^d$

**Answer: 2.** The handout's solution counts the three kinds of terms separately:

- Quadratic terms: $\binom{d}{2} + d$ of them. The count in the lecture goes: pick two different variables out of $d$ and multiply them ($x_ix_j$, $i \ne j$), which gives $\binom{d}{2}$ ways; pick the same variable twice ($x_i^2$), which gives $d$ ways.
- Linear terms: $d$ of them.
- Constant term: 1.

Adding up:

$$
\binom{d}{2} + d + d + 1 = \frac{d(d-1)}{2} + 2d + 1 = \frac{d^2}{2} + \frac{3d}{2} + 1
$$

Check with $d = 2$: $2 + 3 + 1 = 6$, exactly the six terms of $(1, x_1, x_2, x_1^2, x_1x_2, x_2^2)$.

The other options (worked out in this article): option 1, $d$, does not even cover the original linear terms plus the constant. Option 3, $d^2 + d + 1$, treats $x_ix_j$ and $x_jx_i$ as two different terms, so it counts $d^2$ quadratic terms; at $d = 2$ it gives 7, one too many. Option 4, $2^d$, is 4 at $d = 2$ and does not match either.

In the lecture, Lin mentions that $d$ might be 10 or might be 100. Plugging into the formula (computed in this article): 66 dimensions at $d = 10$ and 5,151 dimensions at $d = 100$. With the quadratic transform alone, the dimension goes from 100 to more than five thousand, and this question is a warm-up for the next section.

## What the transform costs: dimension, VC dimension, and no peeking at the data

```youtube
url: https://www.youtube.com/watch?v=Inxr-Yc1Aow
title: Nonlinear Transformation :: Price of Nonlinear Transform @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–03:51 covers the computation and storage price, 03:51–05:58 the model complexity price, 05:58–08:00 the trade-off between the two questions, 08:00–14:29 the danger of choosing a transform by eye, and Fun Time follows.)

### How many dimensions the Q-th order polynomial transform has

Page 13 generalizes from second order to order $Q$. The $Q$-th order polynomial transform lists every term of degree 0 through $Q$:

$$
\boldsymbol{\Phi}_Q(\mathbf{x}) = \Big(1,\ \ x_1, x_2, \dots, x_d,\ \ x_1^2, x_1x_2, \dots, x_d^2,\ \ \dots,\ \ x_1^Q, x_1^{Q-1}x_2, \dots, x_d^Q\Big)
$$

The handout writes its length as $1 + \tilde{d}$: the 1 is the constant term (matching $\tilde{w}_0$), and $\tilde{d}$ counts the others. In the lecture, Lin says the 1 is set apart for the same reason $d + 1$ is written for linear models; the tilde over $d$ again marks a quantity in Z-space. The handout then gives

$$
1 + \tilde{d} = \binom{Q + d}{Q} = \binom{Q + d}{d} = O\left(Q^d\right)
$$

The handout accounts for this in a single line: it is the # ways of $\le Q$-combination from $d$ kinds with repetitions. In the lecture, Lin says this is combinations with repetition from high school counting and asks everyone to look it up. The step is filled in below (an addition in this article).

Every term has the form $x_1^{a_1}x_2^{a_2}\cdots x_d^{a_d}$, where each $a_i$ is a non-negative integer and the total degree satisfies $a_1 + a_2 + \dots + a_d \le Q$. One tuple $(a_1, \dots, a_d)$ corresponds to one term, so what has to be counted is the number of non-negative integer solutions of this inequality. Introduce one more variable $a_0 = Q - (a_1 + \dots + a_d)$, standing for the "unused degree", and the inequality becomes an equation:

$$
a_0 + a_1 + a_2 + \dots + a_d = Q, \qquad a_i \ge 0
$$

This is the same as putting $Q$ identical balls into $d + 1$ boxes. Line up the $Q$ balls and $d$ dividers, $Q + d$ positions in all, and choose $d$ of them for the dividers: there are $\binom{Q+d}{d}$ ways; choosing the $Q$ positions for the balls instead writes it as $\binom{Q+d}{Q}$, and the two are equal.

Check with $d = 2$ and $Q = 2$: $\binom{4}{2} = 6$, matching the six terms of $\boldsymbol{\Phi}_2$. The $\frac{d^2}{2} + \frac{3d}{2} + 1$ from the previous Fun Time is a special case too, since $\binom{d+2}{2} = \frac{(d+2)(d+1)}{2}$.

As for $O(Q^d)$: in the lecture, Lin says to treat $d$ as a constant (it is fixed once the data is given) and look at the growth as $Q$ gets large. Write out the binomial coefficient,

$$
\binom{Q + d}{d} = \frac{(Q + d)(Q + d - 1)\cdots(Q + 1)}{d!}
$$

The numerator is a product of $d$ factors, each of first degree in $Q$, so the whole thing is a polynomial of degree $d$ in $Q$. A few numbers (computed in this article; $\tilde{d}$ is in parentheses):

| | $Q = 1$ | $Q = 2$ | $Q = 3$ | $Q = 5$ | $Q = 10$ |
|---|---|---|---|---|---|
| $d = 2$ | 3 (2) | 6 (5) | 10 (9) | 21 (20) | 66 (65) |
| $d = 10$ | 11 (10) | 66 (65) | 286 (285) | 3,003 (3,002) | 184,756 (184,755) |

### The first price: computation and storage

The handout's conclusion on page 13 is that $1 + \tilde{d}$ is the efforts needed for computing/storing $\mathbf{z} = \boldsymbol{\Phi}_Q(\mathbf{x})$ and $\tilde{\mathbf{w}}$; $Q$ large means difficult to compute/store.

In the lecture, the "efforts" are broken into several accounts:

- **Computing $\mathbf{z}$**: every example needs its $\mathbf{z}$ computed from $\mathbf{x}$. If $\mathbf{x}$ has 2 dimensions and $\mathbf{z}$ has 6, each example costs an effort of 6.
- **Computing $\tilde{\mathbf{w}}$**: whether you use pocket, linear regression, or logistic regression, every update costs at least $\tilde{d} + 1$; each PLA correction costs that much. Linear regression may be worse, since it has to handle a $(\tilde{d} + 1) \times (\tilde{d} + 1)$ matrix and invert it.
- **Storing $\tilde{\mathbf{w}}$**: after learning, $\tilde{\mathbf{w}}$ has to be kept in order to predict, and that takes space too.

Lin's conclusion in the lecture is that the transform is not free: when $Q$ is large, storing and updating a vector of ten or twenty thousand dimensions, or optimizing in a space that size, can all be hard.

### The second price: model complexity

The title of page 14 is Model Complexity Price. Look at the same $1 + \tilde{d} = O(Q^d)$ from another angle:

- The number of free parameters $\tilde{w}_i$ is $\tilde{d} + 1$, which the handout writes as $\approx d_{\text{VC}}(\mathcal{H}_{\boldsymbol{\Phi}_Q})$. This uses the rule of thumb from [Foundations Lecture 7](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error-en): $d_{\text{VC}}$ is roughly the number of free parameters.
- The handout then gives an inequality that holds for certain, $d_{\text{VC}}(\mathcal{H}_{\boldsymbol{\Phi}_Q}) \le \tilde{d} + 1$, and its reason takes only two lines. In the handout's words, any $\tilde{d} + 2$ inputs not shattered in $\mathcal{Z}$ $\Longrightarrow$ any $\tilde{d} + 2$ inputs not shattered in $\mathcal{X}$.

Here are those two lines expanded into a full argument:

1. The hypotheses in Z-space are $\tilde{d}$-dimensional perceptrons (plus the constant term). Foundations Lecture 7 proved that the $d$-dimensional perceptron has $d_{\text{VC}} = d + 1$, so no $\tilde{d} + 2$ points in Z-space can be shattered by perceptrons.
2. Now pick $\tilde{d} + 2$ arbitrary inputs $\mathbf{x}_1, \dots, \mathbf{x}_{\tilde{d}+2}$ in X-space; their transforms $\mathbf{z}_n = \boldsymbol{\Phi}_Q(\mathbf{x}_n)$ are $\tilde{d} + 2$ points in Z-space. By step 1, there must be some assignment of circles and crosses $(y_1, \dots, y_{\tilde{d}+2})$ that no $\tilde{\mathbf{w}}$ can produce on these $\mathbf{z}_n$.
3. Every hypothesis in $\mathcal{H}_{\boldsymbol{\Phi}_Q}$ has the form $h(\mathbf{x}) = \text{sign}(\tilde{\mathbf{w}}^\top\boldsymbol{\Phi}_Q(\mathbf{x}))$, and its output on $\mathbf{x}_n$ is the output of the corresponding perceptron on $\mathbf{z}_n$. So $\mathcal{H}_{\boldsymbol{\Phi}_Q}$ cannot produce that assignment on these $\mathbf{x}_n$ either.
4. No $\tilde{d} + 2$ points in X-space can be shattered, so by definition $d_{\text{VC}}(\mathcal{H}_{\boldsymbol{\Phi}_Q}) \le \tilde{d} + 1$.

In the lecture, Lin presents step 3 as a proof by contradiction: if the X-space side could shatter, taking those coefficients over to Z-space would shatter there too, which conflicts with a known fact. Lin also notes that the other direction (the lower bound) is harder to prove and is not covered in this course; it is enough to remember the upper bound. An addition in this article on why the reverse direction cannot simply be copied: to prove $d_{\text{VC}} \ge \tilde{d} + 1$ you would have to find $\tilde{d} + 1$ points in X-space that are shattered, but the transformed points can only land in the restricted range $\boldsymbol{\Phi}(\mathcal{X})$ and cannot be placed freely. A small example in which the upper bound is not attained: the input is one-dimensional, $\boldsymbol{\Phi}(x) = (1, x, 2x)$, $\tilde{d} = 2$, and the upper bound is 3; but $\tilde{w}_0 + \tilde{w}_1x + 2\tilde{w}_2x$ is only a one-dimensional perceptron, whose $d_{\text{VC}}$ is 2.

One spot to watch for in the video: the sentence that closes this segment sounds as if it says the price is at most $\tilde{d} + 2$. $\tilde{d} + 2$ is the "number of points that cannot be shattered" in the argument; the upper bound on $d_{\text{VC}}$ is the $\tilde{d} + 1$ written in the handout.

The handout's conclusion is $Q$ large $\Longrightarrow$ large $d_{\text{VC}}$. As Lin puts it in the lecture, the linear model was getting along fine with only $d + 1$ degrees of freedom, and now it has $\tilde{d} + 1$, which climbs quickly with $Q$.

### The two questions cannot both be satisfied

Page 15 shows two ways of separating the same data. The left figure uses $\boldsymbol{\Phi}_1$ (which is just the original $\mathbf{x}$): a slanted line splits the two groups, with a few circles and crosses on the wrong side. The right figure uses $\boldsymbol{\Phi}_4$: a winding fourth-order curve classifies every point correctly, $E_{\text{in}}(g) = 0$. The handout asks which one do you prefer, and comments: $\boldsymbol{\Phi}_1$ is 'visually' preferred; $\boldsymbol{\Phi}_4$ has $E_{\text{in}}$ equal to 0 but is overkill. In the lecture, Lin says most people would pick the left one; the right one forces even the points that look like outliers onto the correct side, which is going too far.

An addition in this article: $\boldsymbol{\Phi}_4$ for a two-dimensional input has $\binom{6}{2} = 15$ weights, while $\boldsymbol{\Phi}_1$ has only 3.

The handout ties this back to the two central questions left by the second question of Foundations:

1. Can we make sure that $E_{\text{out}}(g)$ is close enough to $E_{\text{in}}(g)$?
2. Can we make $E_{\text{in}}(g)$ small enough?

| $\tilde{d}$ ($Q$) | Question 1: $E_{\text{out}} \approx E_{\text{in}}$ | Question 2: $E_{\text{in}}$ small enough |
|---|---|---|
| higher | hard | easy |
| lower | easy | hard |

When $\tilde{d}$ is high, there are many hypotheses and the curve can bend, so $E_{\text{in}}$ is easy to make small, but $d_{\text{VC}}$ is large and the two errors may be far apart. When $\tilde{d}$ is low, it is the other way around. In the lecture, Lin says this is the most important trade-off in machine learning.

The $\Omega = \sqrt{\frac{8}{N}\ln\frac{4(2N)^{d_{\text{VC}}}}{\delta}}$ from Foundations Lecture 7 puts numbers on the Question 1 column (computed in this article, with $N = 10{,}000$, $\delta = 0.1$, and $d_{\text{VC}}$ taken at its upper bound):

| Transform (two-dimensional input) | Upper bound on $d_{\text{VC}}$ | $\Omega$ |
|---|---|---|
| $\boldsymbol{\Phi}_1$ | 3 | 0.163 |
| $\boldsymbol{\Phi}_2$ | 6 | 0.225 |
| $\boldsymbol{\Phi}_4$ | 15 | 0.349 |
| $\boldsymbol{\Phi}_{50}$ | 1,326 | 3.24 |

An error can be at most 1, so an $\Omega$ above 1 means the guarantee says nothing. The VC bound itself is very loose and the absolute size of these numbers should not be taken literally; what matters is the direction in which they move as $d_{\text{VC}}$ grows.

### The danger of choosing a transform by eye

So how should $Q$ be picked? The bottom of page 15 asks tentatively: visually, maybe? The judgment a moment ago that $\boldsymbol{\Phi}_1$ is better than $\boldsymbol{\Phi}_4$ relied on the eye. The title of page 16 answers directly: Danger of Visual Choices.

The first reason is written at the very top: can you really 'visualize' when $\mathcal{X} = \mathbb{R}^{10}$? The handout answers its own question: well, I can't. In the lecture, Lin adds that most data used in practice is high-dimensional, and deciding by sight is not easy.

The second reason is subtler: even in $\mathbb{R}^2$, where you can see, deciding by eye is a problem. The handout takes the circular separable data from the beginning and lists four increasingly "clever" choices:

| Choice | $\mathbf{z}$ | $d_{\text{VC}}$ marked in the handout |
|---|---|---|
| full $\boldsymbol{\Phi}_2$ | $(1, x_1, x_2, x_1^2, x_1x_2, x_2^2)$ | 6 |
| after visualizing | $(1, x_1^2, x_2^2)$ | 3 |
| better? | $(1, x_1^2 + x_2^2)$ | 2 |
| even better? | $\left(\text{sign}(0.6 - x_1^2 - x_2^2)\right)$ | The handout gives no number |

The lecture acts these four steps out as a dialogue. At first you honestly use the six-dimensional transform and pay a price of $d_{\text{VC}} = 6$. After looking at the plot you see there is no need for that much; three dimensions will do, at a price of 3. A cleverer student says: it is a perfect circle anyway, so the squared distance to the origin is all that is needed, and one special polynomial $x_1^2 + x_2^2$ is enough, at a price of 2. Finally the teacher steps in to do the "cleverest" thing: the transform does not have to be a polynomial, so just use the answer itself as the feature; $\mathbf{z}$ is down to one dimension, with no constant term even, and Lin says it then looks as though the price is only 1.

It sounds like a better and better deal, so where is the catch? The explanation in the lecture: during this process your brain did a round of computation and picked a transform that suits this particular data set. The VC argument originally says that the data is drawn from some distribution, and we work out the probability of drawing bad data that makes learning fail; that argument assumes the hypothesis set is fixed before the data is seen. If you look at the data first and then fix the transform, your brain has already done a round of learning, which Lin calls human learning and says is no longer machine learning. What you hand to the machine has already been shaped by your subjective choice, and the complexity price paid for that choice stays in your head without being counted.

The consequence is overestimation: you will believe you made $E_{\text{in}}$ very low with a very small $d_{\text{VC}}$. As Lin explains it, $d_{\text{VC}}$ looks small only because the VC dimension inside your head was left out; and people are clever enough to do many different classification tasks, so the brain's VC dimension is presumably rather large. The outcome Lin gives as an example: the machine appears to do very well, yet when it is used to invest in the stock market, it does badly no matter what.

The handout closes the page with two lines:

> careful about your brain's 'model complexity'

> for VC-safety, $\boldsymbol{\Phi}$ shall be decided without 'peeking' data

An addition in this article: the seven-point example above made exactly this mistake. I first laid out data with "positives inside, negatives outside, and centered at the origin", and then picked $(1, x_1^2, x_2^2)$, the transform that happens to fit it. On paper that is $d_{\text{VC}} = 3$ and $E_{\text{in}} = 0$, but the 3 does not account for the step of "look at the plot first, then pick the transform". If you do not look at the data beforehand and honestly use the full $\boldsymbol{\Phi}_2$, the same PLA (same starting point and checking order) halts after 7 corrections at $\tilde{\mathbf{w}} = (3, 0, -3, -2, 0, -3)$, whose boundary is $2x_1^2 + 3x_2^2 + 3x_2 = 3$, an ellipse centered at $(0, -0.5)$, also with $E_{\text{in}}$ equal to 0. The two curves agree completely on the seven training points but disagree on unseen ones: plugging $\mathbf{x} = (1.2, 0.5)$ into the circle's expression gives $4 - 2.88 - 0.5 = 0.62$, prediction $+1$; plugging it into the ellipse's expression gives $3 - 1.5 - 2.88 - 0.75 = -2.13$, prediction $-1$. Seven examples cannot tell which is right, and this is what the price of more degrees of freedom looks like in a small example.

This theme appears once more under the name data snooping in [Foundations Lecture 16: Three Learning Principles](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-16-three-learning-principles-en). After this lecture, whenever you meet a $\boldsymbol{\Phi}$ you can ask yourself two things: what is $\tilde{d}$? Was this $\boldsymbol{\Phi}$ decided only after looking at the data?

### Fun Time: the dimension when Q = 50

**Question (page 17):** Consider the $Q$-th order polynomial transform $\boldsymbol{\Phi}_Q(\mathbf{x})$ for $\mathbf{x} \in \mathbb{R}^2$. Recall that $\tilde{d} = \binom{Q+2}{2} - 1$. When $Q = 50$, what is the value of $\tilde{d}$?

1. 1126
2. 1325
3. 2651
4. 6211

**Answer: 2.** Substitute directly:

$$
\tilde{d} = \binom{52}{2} - 1 = \frac{52 \times 51}{2} - 1 = 1326 - 1 = 1325
$$

The handout's comment: it's just a simple calculation, but it shows you how $\tilde{d}$ becomes hundreds of times of $d = 2$ after the transform ($1325 / 2 \approx 662$).

The other options (worked out in this article): option 3, 2651, comes from forgetting to divide by 2, $52 \times 51 - 1 = 2651$. Option 1, 1126, and option 4, 6211, cannot be obtained from this formula; as far as this article can tell, 1126 is a number this course is fond of: the $\mathcal{H}_{1126}$ in the next section and the experiments "repeated 1126 times" in the later homework both use it.

In the lecture, Lin goes on to ask a practical question: the input was only two-dimensional and is now in a space of over a thousand dimensions, so does your amount of data hold up? In two dimensions twenty points may be enough; in a thousand dimensions twenty points are certainly not, and do you really have ten thousand points? An addition in this article: by the rule of thumb $N \approx 10\,d_{\text{VC}}$ from Foundations Lecture 7, the two-dimensional perceptron with $d_{\text{VC}} = 3$ needs about 30 examples; the upper bound on $d_{\text{VC}}$ for $\boldsymbol{\Phi}_{50}$ is 1326, so it needs about 13,000, which matches the order of magnitude mentioned in the lecture.

## Which transform to try first: structured hypothesis sets and the linear model first

```youtube
url: https://www.youtube.com/watch?v=gcLmU3MC3bE
title: Nonlinear Transformation :: Structured Hypothesis Sets @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–02:20 covers the recursive definition of the polynomial transform and the nested structure, 02:20–04:38 derives the two chains of inequalities for the VC dimension and E_in, 04:38–07:30 covers the linear model first, 07:30–08:02 is Fun Time, followed by the summary and a preview of the next lecture.)

### Polynomial transforms nest one inside another

Page 18 rewrites the polynomial transform recursively. The zeroth-order transform has only the constant, and each step up appends all terms of the new degree to the previous transform:

$$
\begin{aligned}
\boldsymbol{\Phi}_0(\mathbf{x}) &= \big(1\big) \\
\boldsymbol{\Phi}_1(\mathbf{x}) &= \big(\boldsymbol{\Phi}_0(\mathbf{x}),\ x_1, x_2, \dots, x_d\big) \\
\boldsymbol{\Phi}_2(\mathbf{x}) &= \big(\boldsymbol{\Phi}_1(\mathbf{x}),\ x_1^2, x_1x_2, \dots, x_d^2\big) \\
\boldsymbol{\Phi}_3(\mathbf{x}) &= \big(\boldsymbol{\Phi}_2(\mathbf{x}),\ x_1^3, x_1^2x_2, \dots, x_d^3\big) \\
&\ \ \vdots \\
\boldsymbol{\Phi}_Q(\mathbf{x}) &= \big(\boldsymbol{\Phi}_{Q-1}(\mathbf{x}),\ x_1^Q, x_1^{Q-1}x_2, \dots, x_d^Q\big)
\end{aligned}
$$

Every transform contains the one before it. In the lecture, Lin explains what this means for the hypothesis sets: when doing linear learning in the larger Z-space, you can always set the weights of the newly added dimensions to 0, and the resulting hypothesis is exactly what the previous transform could do. The statement in the earlier section that "lines are degenerate cases of quadratic hypotheses" rests on the same reason. Abbreviate the hypothesis set $\mathcal{H}_{\boldsymbol{\Phi}_i}$ of each transform as $\mathcal{H}_i$ and you get

$$
\mathcal{H}_0 \subset \mathcal{H}_1 \subset \mathcal{H}_2 \subset \mathcal{H}_3 \subset \dots \subset \mathcal{H}_Q
$$

The handout draws a set of ellipses, one inside another, with the innermost labeled $\mathcal{H}_0$ and then $\mathcal{H}_1$, $\mathcal{H}_2$, $\mathcal{H}_3$ going outward, and calls this one-inside-another relationship the structure of the hypothesis sets (structure: nested $\mathcal{H}_i$).

### Two chains of inequalities running in opposite directions

Page 19 lets $g_i = \text{argmin}_{h \in \mathcal{H}_i} E_{\text{in}}(h)$, the hypothesis with the lowest $E_{\text{in}}$ in $\mathcal{H}_i$, and writes three rows:

$$
\begin{array}{ccccccccc}
\mathcal{H}_0 & \subset & \mathcal{H}_1 & \subset & \mathcal{H}_2 & \subset & \mathcal{H}_3 & \subset & \dots \\
d_{\text{VC}}(\mathcal{H}_0) & \le & d_{\text{VC}}(\mathcal{H}_1) & \le & d_{\text{VC}}(\mathcal{H}_2) & \le & d_{\text{VC}}(\mathcal{H}_3) & \le & \dots \\
E_{\text{in}}(g_0) & \ge & E_{\text{in}}(g_1) & \ge & E_{\text{in}}(g_2) & \ge & E_{\text{in}}(g_3) & \ge & \dots
\end{array}
$$

The handout gives no reasons for the second and third rows; the lecture explains each in a short passage, summarized here.

**The VC dimension does not decrease.** $\mathcal{H}_i \subset \mathcal{H}_{i+1}$ means that $\mathcal{H}_{i+1}$ has every hypothesis of $\mathcal{H}_i$. If some $k$ points can be shattered by $\mathcal{H}_i$, each of the $2^k$ assignments is produced by some hypothesis in $\mathcal{H}_i$, and those hypotheses are all in $\mathcal{H}_{i+1}$ as well, so the same $k$ points are shattered by $\mathcal{H}_{i+1}$. The number of points that can be shattered can only go up or stay the same.

**The lowest E_in does not increase.** $g_i$ is itself a member of $\mathcal{H}_{i+1}$. $g_{i+1}$ is the one with the lowest $E_{\text{in}}$ in $\mathcal{H}_{i+1}$, and the list of candidates includes $g_i$, so $E_{\text{in}}(g_{i+1}) \le E_{\text{in}}(g_i)$. As Lin puts it in the lecture: there are more choices now, and a better one may turn up among the new ones; if not, you do at least as well as before.

**Applied to the seven points (computed in this article).** Using the earlier data, three positives and four negatives:

| Hypothesis set | What it can do | Lowest $E_{\text{in}}$ | How it is obtained |
|---|---|---|---|
| $\mathcal{H}_0$ | Constants: guess all $+1$ or all $-1$ | $\frac{3}{7}$ | Guessing all $-1$ gets 3 wrong, guessing all $+1$ gets 4 wrong |
| $\mathcal{H}_1$ | Lines | $\frac{1}{7}$ | Shown above that at least 1 is wrong; $\text{sign}(1.5 - x_1 - x_2)$ gets only point 5 wrong |
| $\mathcal{H}_2$ | Quadratic curves | $0$ | The circle PLA found above |
| $\mathcal{H}_3$ and beyond | Curves of third order and higher | $0$ | It is already 0 and cannot go lower |

$\frac{3}{7} \ge \frac{1}{7} \ge 0 \ge 0$, in agreement with the third row. Meanwhile the upper bounds on $d_{\text{VC}}$ are 1, 3, 6, 10: by $\mathcal{H}_3$ there are 10 weights, more than the 7 examples, and yet $E_{\text{in}}$ has not improved at all. Going right from $\mathcal{H}_2$, everything extra you pay is complexity.

The lower half of page 19 is the figure that appeared in Foundations Lecture 7, with $d_{\text{VC}}$ on the horizontal axis: the in-sample error curve goes down all the way, the model complexity curve goes up all the way, and the out-of-sample error curve falls and then rises, with the horizontal coordinate of its lowest point marked $d^*_{\text{VC}}$. The nested hypothesis sets, laid out from left to right, correspond exactly to the horizontal axis of this figure. Next to it the handout writes: use $\mathcal{H}_{1126}$ won't be good. The explanation in the lecture is that if you start out with a transform of order as high as 1126, you are already standing very far to the right on the curve; $E_{\text{in}}$ may be very low, but you have paid a large model complexity and $E_{\text{out}}$ will be very high.

One number added in this article: for $\boldsymbol{\Phi}_{1126}$ on a two-dimensional input, $\tilde{d} = \binom{1128}{2} - 1 = 635{,}627$.

### Linear model first

Page 20 writes the advice as two routes.

**Tempting sin:** use $\mathcal{H}_{1126}$ directly, and take the low $E_{\text{in}}(g_{1126})$ to fool your boss. The handout's comment is really? a dangerous path of no return. In the lecture, Lin says people who have just met the feature transform are especially prone to this: the data is all in your hands, you apply a high-dimensional transform, push $E_{\text{in}}$ down to 0, and go tell your boss it went very well, and a boss who is not paying close attention is fooled. But $E_{\text{in}}$ was never what we care about; it is only an intermediate product. Lin describes the path of no return this way: once $E_{\text{in}}$ is good and $E_{\text{out}}$ is very high, there is almost nothing left to do to fix it.

**Safe route:** $\mathcal{H}_1$ first.

- If $E_{\text{in}}(g_1)$ is good enough, the matter is settled (the handout writes live happily thereafter). $d_{\text{VC}}$ is small, $E_{\text{out}}$ is close to $E_{\text{in}}$, so $E_{\text{out}}$ is good too.
- Otherwise, move right of the curve, with nothing lost except 'wasted' computation.

The handout's closing line is linear model first: simple, efficient, safe, and workable. In the lecture, Lin goes through the four adjectives one by one: simple; efficient, because the dimension is small; safe; and the last is that quite often you will be surprised to find it does rather well. Lin makes a point of warning against assuming that a linear model must do badly; in many cases linear is a fairly good approximation for describing the world.

### Fun Time: VC dimensions of nested sets

**Question (page 21):** Consider two hypothesis sets, $\mathcal{H}_1$ and $\mathcal{H}_{1126}$, where $\mathcal{H}_1 \subset \mathcal{H}_{1126}$. Which of the following relationship between $d_{\text{VC}}(\mathcal{H}_1)$ and $d_{\text{VC}}(\mathcal{H}_{1126})$ is not possible?

1. $d_{\text{VC}}(\mathcal{H}_1) = d_{\text{VC}}(\mathcal{H}_{1126})$
2. $d_{\text{VC}}(\mathcal{H}_1) \ne d_{\text{VC}}(\mathcal{H}_{1126})$
3. $d_{\text{VC}}(\mathcal{H}_1) < d_{\text{VC}}(\mathcal{H}_{1126})$
4. $d_{\text{VC}}(\mathcal{H}_1) > d_{\text{VC}}(\mathcal{H}_{1126})$

**Answer: 4.** The handout's solution: every input combination that $\mathcal{H}_1$ shatters can be shattered by $\mathcal{H}_{1126}$, so $d_{\text{VC}}$ cannot decrease. This is the reason behind the chain of "$\le$" above.

The other three options can all happen (an addition in this article). The question gives only the containment and does not say the two sets come from polynomial transforms, so what it asks is: in general, when a small set sits inside a large one, what can happen?

- Option 3 (less than) and option 2 (not equal) are the common situation. For example, on a two-dimensional input lines have $d_{\text{VC}} = 3$ and quadratic curves have $d_{\text{VC}} = 6$ (the number on page 16 of the handout).
- Option 1 (equal) is possible too. The hypotheses the large set has beyond the small one do not necessarily help with shattering. One example: the one-dimensional positive ray $h(x) = \text{sign}(x - a)$ has $d_{\text{VC}} = 1$; add the single hypothesis "always output $-1$" and the set is larger, but the assignment "left $+1$, right $-1$" on two points $x_1 < x_2$ still cannot be produced, and $d_{\text{VC}}$ is still 1.

One spot to watch for in the video: the answer number spoken aloud in the lecture sounds like 3, but the explanation that immediately follows is that the greater-than case cannot happen, which is option 4 on the handout. Go by the handout's reference answer, 4.

### Summary of the lecture

Page 22 wraps each of the four sections into one line:

| Section | The handout's one line |
|---|---|
| Quadratic Hypotheses | linear hypotheses on quadratic-transformed data |
| Nonlinear Transform | happy linear modeling after $\mathcal{Z} = \boldsymbol{\Phi}(\mathcal{X})$ |
| Price of Nonlinear Transform | computation/storage/[model complexity] |
| Structured Hypothesis Sets | linear/simpler model first |

In the third line model complexity is set in square brackets. Lin's summary in the lecture likewise says that the most important price is the one paid in model complexity.

The preview at the bottom of the page is next: dark side of the force. In the lecture, Lin says the feature transform is the force and that this lecture has already touched some of its dark side; the next lecture takes on directly what harm it does to machine learning, and after that comes how to control it. On the Roadmap, the next lecture begins the fourth question, How Can Machines Learn Better?.

## Self-check

**1. Using $\boldsymbol{\Phi}_2(\mathbf{x}) = (1, x_1, x_2, x_1^2, x_1x_2, x_2^2)$, write a $\tilde{\mathbf{w}}$ whose boundary is the circle with center $(1, 2)$ and radius 2, with output $+1$ inside the circle. Why can $(1, x_1^2, x_2^2)$ not produce this circle?**

Answer: the inside is positive, so take $4 - (x_1 - 1)^2 - (x_2 - 2)^2 > 0$. Expand: $4 - x_1^2 + 2x_1 - 1 - x_2^2 + 4x_2 - 4 = -1 + 2x_1 + 4x_2 - x_1^2 - x_2^2$, so $\tilde{\mathbf{w}} = (-1, 2, 4, -1, 0, -1)$ (multiplying by a positive number is also correct). Check: the center $(1, 2)$ scores $-1 + 2 + 8 - 1 - 4 = 4 > 0$; the point $(3, 2)$ on the circle gives $-1 + 6 + 8 - 9 - 4 = 0$. The expansion has the two first-order terms $2x_1$ and $4x_2$, and $(1, x_1^2, x_2^2)$ has no positions for them.

**2. The input is 10-dimensional. What is $\tilde{d}$ for the polynomial transforms with $Q = 2$, $3$, and $5$? Using the rule of thumb $N \approx 10\,d_{\text{VC}}$ with $d_{\text{VC}}$ taken at its upper bound $\tilde{d} + 1$, roughly how many examples does each need?**

Answer: $1 + \tilde{d} = \binom{Q + 10}{10}$, which is $\binom{12}{10} = 66$, $\binom{13}{10} = 286$, and $\binom{15}{10} = 3003$ respectively, so $\tilde{d} = 65$, $285$, and $3002$. The amounts of data are about 660, 2,860, and 30,030 examples. Raising the order from 2 to 5 multiplies the data needed by about 45.

**3. Five one-dimensional examples: $x = -2, -1, 0, 1, 2$, with labels $-1, +1, +1, +1, -1$ in that order. Find $E_{\text{in}}(g_0)$ and $E_{\text{in}}(g_1)$, and find a hypothesis in $\mathcal{H}_2$ with $E_{\text{in}} = 0$ ($\boldsymbol{\Phi}_2(x) = (1, x, x^2)$).**

Answer: $\mathcal{H}_0$ can only guess one label for everything; guessing all $+1$ gets 2 wrong, so $E_{\text{in}}(g_0) = \frac{2}{5}$. $\mathcal{H}_1$ is the one-dimensional perceptron $\text{sign}(w_0 + w_1x)$: $x = 0$ lies exactly midway between the two negative points $\pm 2$, and just as in the seven-point example, adding $w_0 \pm 2w_1 < 0$ gives $w_0 < 0$, which contradicts $x = 0$ having to be positive, so at least 1 is wrong; $\text{sign}(1.5 - x)$ gets only $x = -2$ wrong, so $E_{\text{in}}(g_1) = \frac{1}{5}$. $\mathcal{H}_2$: take $\tilde{\mathbf{w}} = (2.5, 0, -1)$, that is, $\text{sign}(2.5 - x^2)$; the five scores are $-1.5, 1.5, 2.5, 1.5, -1.5$, all correct. $\frac{2}{5} \ge \frac{1}{5} \ge 0$.

**4. A colleague gets a two-dimensional data set, draws a scatter plot first, sees that the positive points form a ring-shaped cluster with the negative points outside it, and therefore trains with only $\mathbf{z} = (1, x_1^2 + x_2^2)$, gets $E_{\text{in}} = 0$, and writes in the report that "the model's VC dimension is only 2, so generalization is guaranteed". What is wrong with this claim? What would make it defensible?**

Criteria: the answer must point out that the transform was chosen after looking at the data, and that the selection process (picking this one out of all possible transforms) has a complexity of its own that is not counted in that 2, so the VC guarantee does not apply and the conclusion is too optimistic. A defensible approach is to decide the transform before looking at the data (for example, agree beforehand to use $\boldsymbol{\Phi}_2$ and accept the price of $d_{\text{VC}} = 6$), or to set aside a separate portion of data that took part in no decision and evaluate on it. Answering only "the VC dimension is computed wrong" without saying that the price is hidden in the human's choice is not complete.

**5. Which known result does the proof of $d_{\text{VC}}(\mathcal{H}_{\boldsymbol{\Phi}_Q}) \le \tilde{d} + 1$ use? Why does the same argument not give $\ge$ directly?**

Criteria: the answer must name "the $\tilde{d}$-dimensional perceptron cannot shatter a set of $\tilde{d} + 2$ points, whichever points they are" and "the output of $\mathcal{H}_{\boldsymbol{\Phi}_Q}$ on $\mathbf{x}_n$ equals the output of the perceptron on $\mathbf{z}_n$", so an assignment that cannot be produced in Z-space cannot be produced in X-space either. The reverse direction needs $\tilde{d} + 1$ points in X-space that are shattered, but their transforms can only land on $\boldsymbol{\Phi}(\mathcal{X})$ and cannot be placed freely; the set of points behind the perceptron's "there exist some $\tilde{d} + 1$ points that can be shattered" in Z-space need not be the transforms of some $\mathbf{x}$.

## Exercises and corresponding reading

**Corresponding weeks in the two semesters.** The [Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) puts Foundations Lectures 11 and 12 in the same week (W6, 10/07), and the slides for this lecture are [12u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/12u_handout.pdf). The [Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) schedules it in W6 (10/14); when checked on 2026-09-30, the slide link for that week still returned 404, so this article uses only the MOOC handout.

**Textbook.** Both course pages map this lecture to Section 3.4 of [Learning from Data](http://amlbook.com) (LFD).

**Homework.** The related problems are in [Fall 2024 HW4](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf) (released 2024-10-21, due 11-04, 12 problems plus 1 bonus), which has no official solutions:

| Problem | Content | Where it connects to this lecture |
|---|---|---|
| Q4 | Run linear regression after the "Dr. Transformer" transform, which one-hot encodes every training example; the problem prompts you to think about $E_{\text{out}}$ | The price of the transform: a very low $E_{\text{in}}$ does not mean anything was learned |
| Q11–12 | Apply the homogeneous polynomial transform with $Q = 3$ to the cpusmall_scale data and look at the gain in $E_{\text{in}}$ and the change in $E_{\text{out}}$ | The trade-off between the two questions, structured hypothesis sets |
| Q13 (bonus) | A hypothesis set in multiplicative form; prove or disprove that its $d_{\text{VC}}$ is larger than that of linear hypotheses | Transforms and $d_{\text{VC}}$ |

The [cpusmall_scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/regression/cpusmall_scale) data used in the programming problems comes from the public LIBSVM datasets page, and each experiment has to be repeated 1126 times with different random seeds. Q11 can be self-checked this way: the difference in $E_{\text{in}}$ cannot be negative by definition, because the linear hypotheses are contained in the transformed hypothesis set (the same reasoning as this lecture's chain of inequalities for $E_{\text{in}}$); a negative value means the implementation has a bug. The guide to the whole assignment is in [Foundations Homework](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide-en).

**Further reading.**

- The trade-off between feature transforms and regularization, as another course tells it: [CMU 07-280 Lecture 10: Trading Expressiveness for Stability with Features and Regularization](/posts/ai/2026-08-22-cmu-07280-lecture-10-feature-engineering-regularization-en).
- Techniques hands the problem that "a large dimension has a price" to SVM and kernels: [Techniques Lecture 1: Linear SVM](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm-en) and [Techniques Lecture 3: Kernel SVM](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm-en).

**Next lecture.** [Foundations Lecture 13: Hazard of Overfitting](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization-en) continues with the dark side of the force: what exactly happens when the transform is too powerful and $E_{\text{in}}$ is very low while $E_{\text{out}}$ is very high.

## Course video sources

Original videos: [Quadratic Hypotheses](https://www.youtube.com/watch?v=8pQ06pku1xA), [Nonlinear Transform](https://www.youtube.com/watch?v=UHAn6Cuk8zk), [Price of Nonlinear Transform](https://www.youtube.com/watch?v=Inxr-Yc1Aow), [Structured Hypothesis Sets](https://www.youtube.com/watch?v=gcLmU3MC3bE)

- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

Checked: 2026-10-13. The video IDs, titles, and lengths were taken from the official playlist that day; the videos have no caption track on YouTube, and what this article reports from the lecture comes from transcripts made for it.

## Update Log

- 2026-10-13: Changed to one article per lecture, rewritten from the handout and the video transcripts.

## References

- [Foundations Lecture 12 handout, 12_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/12_handout.pdf): the main source for this article. The content of the four sections, the four Fun Time questions, and the figures on each page all come from this handout.
- [Foundations Lecture 7 handout, 07_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/07_handout.pdf): the VC dimension of the $d$-dimensional perceptron, the formula for $\Omega$, and the rule of thumb $N \approx 10\,d_{\text{VC}}$, used in the calculations of the model complexity section.
- [Foundations Lecture 3 handout, 03_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/03_handout.pdf): the distinction between concrete features and raw features, and the $16 \times 16$ grayscale image example.
- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf): the IDs and titles of the four videos; what the text reports as said "in the lecture" is paraphrased from machine transcripts of these four videos.
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/): the official entry for handouts and recordings.
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/): the W6 schedule, the 12u slides, and the LFD section.
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/): the W6 (10/14) schedule.
- [Fall 2024 Homework 4 (hw4_red.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf): the content of Q4, Q11–12, and Q13, and the release and due dates.
- [LIBSVM datasets: cpusmall_scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/regression/cpusmall_scale): the data for the HW4 programming problems.
- [Learning from Data textbook website](http://amlbook.com): the source for Section 3.4.
- [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques: Course Overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en): where this lecture sits in the whole course and the reading routes.
