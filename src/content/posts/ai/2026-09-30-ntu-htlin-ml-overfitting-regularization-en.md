---
title: "Hazard of Overfitting: How Noise, Data Size, and Model Complexity Combine | NTU Hsuan-Tien Lin Machine Learning Foundations Lecture 13"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, overfitting, learning-theory]
lang: en
math: true
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 13
tldr: "Overfitting is the process in which switching to a more powerful model lowers E_in but raises E_out. This lecture runs experiments with two learners, one who only knows polynomials up to order 2 and one who knows them up to order 10, and arrives at four causes: too little data, too much stochastic noise, too much deterministic noise (a target that is too complex), and excessive model power. It also explains why data with no noise at all can still be overfit. For remedies it covers data cleaning, pruning, and virtual examples first; regularization and validation are left to the next two lectures."
description: "A guide to Lecture 13 of NTU Hsuan-Tien Lin's Machine Learning Foundations, Hazard of Overfitting: the difference between bad generalization and overfitting, the experiments with 2nd-order and 10th-order polynomial learners, learning curves, stochastic and deterministic noise, the four causes, data cleaning and virtual examples, with three examples worked by hand and all four Fun Time questions explained."
draft: false
glossary:
  - term: "overfitting"
    aliases: ["overfit"]
    definition: "The process in which switching to a more powerful model (a larger VC dimension) makes E_in lower and E_out higher. It describes the consequence of the act of switching models, not the state of a single hypothesis."
    context: "Foundations Lecture 13 defines it separately from bad generalization, which is the state of low E_in and high E_out."
  - term: "deterministic noise"
    definition: "When the target function f is not in the hypothesis set H, the gap between f and the best hypothesis h* in H. It affects learning like stochastic noise, but it depends on H and is fixed for a given x."
    context: "Foundations Lecture 13 uses it to explain why overfitting happens even without noise."
  - term: "stochastic noise"
    definition: "A random perturbation added to the label; the experiments in this lecture use Gaussian noise with variance σ². Measuring the same x repeatedly gives different values."
    context: "Foundations Lecture 13 contrasts it with deterministic noise."
  - term: "virtual example"
    aliases: ["data hinting"]
    definition: "A new example manufactured from the data at hand using what is known about the problem, for instance by slightly shifting or rotating a handwritten digit. It is not drawn independently from the original distribution."
    context: "Foundations Lecture 13 calls the practice of adding virtual examples data hinting."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization)

**Video status: Videos included.** This article is written from the official MOOC handout [13_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/13_handout.pdf) and transcripts of this lecture's four official videos, with formulas and numbers following the handout. The transcripts are machine transcripts made for this article (Whisper), not official captions, and no human has proofread them. The videos are taught in Mandarin; the slides are in English. Each section opens with its official video and the approximate time ranges. Page numbers refer to the number at the lower right of each slide (0/22 to 22/22), and wherever the text says "in the lecture" it is paraphrasing what is said in the video.

This is Foundations Lecture 13 in [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en). The Roadmap on page 1 of the handout divides Foundations into four questions. The first three (when can machines learn, why can they learn, how can they learn) ended with the previous lecture, and this one starts answering the fourth: How Can Machines Learn **Better**? The summary of the previous lecture, [Foundations Lecture 12: Nonlinear Transformation](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-12-nonlinear-transformation-en), on that same page is: a nonlinear feature transform plus a linear model gives a nonlinear model, at the price of model complexity. This lecture starts from that price and looks at the trouble it causes.

There are three prerequisites: the figure from [Foundations Lecture 7: The VC Dimension](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error-en) in which $E_{\text{in}}$ falls as the VC dimension grows while $E_{\text{out}}$ falls and then rises; the least-squares solution and the learning curves from [Foundations Lecture 9: Linear Regression](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression-en); and the polynomial transform and nested hypothesis sets $\mathcal{H}_0 \subset \mathcal{H}_1 \subset \mathcal{H}_2 \subset \cdots$ from the previous lecture. Basic manipulation of expectations and variances is also used.

After reading, you should be able to tell bad generalization apart from overfitting, say which figure in the handout shows each of the four causes of overfitting, compute how large the deterministic noise is for a simple target function, and judge whether a virtual example has been added correctly. This lecture is light on formulas and heavy on experiments, so this article adds three small examples that can be worked by hand, each computing once a phenomenon the handout presents as a figure.

## What overfitting is: E_in goes down, E_out goes up

```youtube
url: https://www.youtube.com/watch?v=BA76U3JBDdE
title: Hazard of Overfitting :: What is Overfitting? @ Machine Learning Foundations (機器學習基石)
```

(Video 00:19–01:10 reviews the previous lecture, 01:10–03:18 is the five-point example, 03:18–06:38 separates bad generalization, overfitting, and underfitting, 06:38–10:01 is the driving analogy, and Fun Time follows.)

### Five points fit with a 4th-order polynomial

The example on page 2 of the handout is small. It is a one-dimensional regression problem, $x \in \mathbb{R}$, with only $N = 5$ examples. The target function $f$ is a 2nd-order polynomial, and the label is $y_n = f(x_n)$ plus very small noise. The learner does not know the target is 2nd order and picks a 4th-order polynomial: following the previous lecture, apply the 4th-order feature transform $\boldsymbol{\Phi}(x) = (1, x, x^2, x^3, x^4)$ and then run linear regression in $\mathcal{Z}$-space.

The handout says this yields a unique solution passing all 5 examples, so $E_{\text{in}}(g) = 0$. This article fills in the reason. A 4th-order polynomial has 5 coefficients $w_0, \dots, w_4$, and passing through 5 points means 5 equations:

$$
w_0 + w_1 x_n + w_2 x_n^2 + w_3 x_n^3 + w_4 x_n^4 = y_n, \qquad n = 1, \dots, 5
$$

That is 5 unknowns and 5 linear equations. As long as the 5 values $x_n$ are pairwise distinct, the coefficient matrix of this system (each row is $\boldsymbol{\Phi}(x_n)^\top$, which makes it the data matrix of linear regression) is invertible, and there is exactly one solution. That solution makes every residual 0. Squared error cannot go below 0, so it is the one linear regression finds.

The problem shows in the figure: the right side of the slide draws the target curve in blue and $g$ in red. One of the 5 points is on the left and the other 4 are in the right half. To pass through every point, the red curve arches high in the middle where there is no data and then drops steeply at the right end, far from the blue curve. $E_{\text{in}} = 0$, yet $E_{\text{out}}$ is huge. In the lecture, Lin says the red curve looks nothing like the blue curve we want most.

The handout calls this situation bad generalization: low $E_{\text{in}}$, high $E_{\text{out}}$. In the lecture, Lin describes it as being unable to extend what has been learned to new cases: the 5 points that were seen are handled very well, and anything beyond them is not. This agrees with the VC bound, which says $E_{\text{in}}$ and $E_{\text{out}}$ can be far apart when the VC dimension is too large.

### Bad generalization is a state, overfitting is a process

Page 3 brings back the figure from Foundations Lecture 7. The horizontal axis is the VC dimension $d_{\text{VC}}$, and the three curves are the in-sample error, which keeps falling; the model complexity, which keeps rising; and the out-of-sample error, which falls and then rises. The point where $E_{\text{out}}$ is lowest is written $d_{\text{VC}}^*$. On this figure the handout defines three things:

| Name | The handout's definition | What it describes |
|---|---|---|
| Bad generalization | Take $d_{\text{VC}} = 1126$ for learning: $E_{\text{out}} - E_{\text{in}}$ is large | The state at one point |
| Overfitting | Switch from $d_{\text{VC}}^*$ to $d_{\text{VC}} = 1126$: $E_{\text{in}}$ ↓, $E_{\text{out}}$ ↑ | The process of moving right |
| Underfitting | Switch from $d_{\text{VC}}^*$ to $d_{\text{VC}} = 1$: $E_{\text{in}}$ ↑, $E_{\text{out}}$ ↑ | The process of moving left |

1126 is just the number this course habitually uses for "some very large number". The footer of the page sums up the difference: bad generalization is low $E_{\text{in}}$, high $E_{\text{out}}$; overfitting is low**er** $E_{\text{in}}$, high**er** $E_{\text{out}}$. The extra "er" says that two models are being compared.

In the lecture, Lin explains the names this way: fitting means doing well on $E_{\text{in}}$. Overfitting is fitting done well, but overdone, so that $E_{\text{out}}$ gets worse instead; the slide colors the "over" and the "fitting" of the word differently for exactly this reason. Underfitting is not fitting well enough. Lin adds an assessment: underfitting is the easier one to handle, since enlarging the VC dimension usually works and the nonlinear transform of the previous lecture is the tool for it; overfitting is very common and not easy to solve, which is why this lecture is devoted to it.

### The driving analogy: three causes

Page 4 puts two figures side by side: a good fit on the left (the red curve almost coincides with the blue one) and overfit on the right (the wild red curve from page 2). In the lecture, Lin says overfitting is the process of going from the left one to the right one, and the result is the state of bad generalization on the right. The handout then uses a car accident as an analogy for the causes of overfitting:

| Learning | Driving |
|---|---|
| overfit | commit a car accident |
| use excessive $d_{\text{VC}}$ | "drive too fast" |
| noise | bumpy road |
| limited data size $N$ | limited observations about road condition |

In the lecture, Lin first states that this is only an analogy to aid understanding and not every detail matches, then explains it row by row:

- **Driving too fast.** Pressing the accelerator too hard corresponds to using too much of the power of model complexity. In the example the target is 2nd order, yet a 4th-order polynomial was used.
- **A bumpy road.** A little noise was added to the data. A bumpy road taken at speed easily leads to an accident.
- **Not knowing the road.** If the data points were densely packed, the data would tell the red curve it cannot arch up wherever it tries to, and the wild curve of page 2 would not appear. The example Lin gives: someone who knows the road well knows where the potholes are and steers around them, so the car can still go fast.

It takes all three together to be dangerous: limited knowledge of the road, a bumpy road, and an insistence on driving fast. The footer previews that the next section looks closely at two of them, noise and data size.

### Numerical example: three points, three models

The following is an example made up for this article, not from the slides. It shrinks the setup of page 2 to a size that can be worked by hand: the target is a 1st-order function, there are 3 examples, and the candidate models are $\mathcal{H}_0$ (constants), $\mathcal{H}_1$ (lines), and $\mathcal{H}_2$ (parabolas).

**Setup.** The target is $f(x) = x$. $x$ is uniform on $[-1, 1]$, but the 3 examples drawn all happen to fall in the right half:

| $n$ | $x_n$ | $f(x_n)$ | Noise | $y_n$ |
|---|---|---|---|---|
| 1 | $0$ | $0$ | $+0.1$ | $0.1$ |
| 2 | $0.5$ | $0.5$ | $-0.1$ | $0.4$ |
| 3 | $1$ | $1$ | $+0.1$ | $1.1$ |

$E_{\text{in}}$ is the mean squared error on the 3 examples. To keep the arithmetic doable by hand, $E_{\text{out}}$ is defined as the squared difference between $g$ and the target $f$ averaged over $[-1,1]$, $E_{\text{out}}(g) = \mathbb{E}_x\big[(g(x) - f(x))^2\big]$; computing it against the noisy $y$ instead would add the same constant to all three models and leave the comparison unchanged. A few moments of the uniform distribution on $[-1,1]$ are used again and again below: $\mathbb{E}[x] = \mathbb{E}[x^3] = 0$, $\mathbb{E}[x^2] = \frac{1}{3}$, $\mathbb{E}[x^4] = \frac{1}{5}$.

**$\mathcal{H}_0$: a constant.** The least-squares constant is the mean of $y$, $g_0(x) = \frac{0.1 + 0.4 + 1.1}{3} = \frac{8}{15} \approx 0.533$.

$$
E_{\text{in}}(g_0) = \frac{(0.1 - 0.533)^2 + (0.4 - 0.533)^2 + (1.1 - 0.533)^2}{3} = \frac{79}{450} \approx 0.176
$$

$$
E_{\text{out}}(g_0) = \mathbb{E}\Big[\Big(\frac{8}{15} - x\Big)^2\Big] = \frac{64}{225} + \frac{1}{3} = \frac{139}{225} \approx 0.618
$$

**$\mathcal{H}_1$: a line.** $\bar{x} = 0.5$ and $\bar{y} = \frac{8}{15}$. The slope is $\sum (x_n - \bar{x})(y_n - \bar{y}) \big/ \sum (x_n - \bar{x})^2$. The denominator is $0.25 + 0 + 0.25 = 0.5$. In the numerator the middle example has $x_n - \bar{x} = 0$, which leaves $(-0.5)(0.1 - \bar{y}) + (0.5)(1.1 - \bar{y}) = 0.5 \times (1.1 - 0.1) = 0.5$. The slope is 1 and the intercept is $\bar{y} - 1 \times \bar{x} = \frac{1}{30}$:

$$
g_1(x) = \frac{1}{30} + x
$$

The three residuals are $0.1 - \frac{1}{30} = \frac{1}{15}$, $0.4 - \frac{8}{15} = -\frac{2}{15}$, and $1.1 - \frac{31}{30} = \frac{1}{15}$, so

$$
E_{\text{in}}(g_1) = \frac{1}{3} \cdot \frac{1 + 4 + 1}{225} = \frac{2}{225} \approx 0.0089, \qquad E_{\text{out}}(g_1) = \mathbb{E}\Big[\Big(\frac{1}{30}\Big)^2\Big] = \frac{1}{900} \approx 0.0011
$$

**$\mathcal{H}_2$: a parabola.** With 3 coefficients and 3 points there is, as in the handout's example, a unique solution, and it passes through every point. Let $g_2(x) = a + bx + cx^2$. Substituting $x = 0$ gives $a = 0.1$; substituting $x = 0.5$ gives $\frac{b}{2} + \frac{c}{4} = 0.3$; substituting $x = 1$ gives $b + c = 1$. The last two equations give $b = 0.2$ and $c = 0.8$:

$$
g_2(x) = 0.1 + 0.2x + 0.8x^2, \qquad E_{\text{in}}(g_2) = 0
$$

Its difference from the target is $g_2(x) - f(x) = 0.1 - 0.8x + 0.8x^2$. After squaring and expanding, the odd-order terms have expectation 0 and only the even-order terms remain:

$$
E_{\text{out}}(g_2) = 0.01 + (0.64 + 0.16)\,\mathbb{E}[x^2] + 0.64\,\mathbb{E}[x^4] = 0.01 + \frac{0.8}{3} + \frac{0.64}{5} = \frac{607}{1500} \approx 0.405
$$

Here $0.64x^2$ comes from $(-0.8x)^2$ and $0.16x^2$ comes from $2 \times 0.1 \times 0.8x^2$.

**Results.**

| Model | $g$ | $E_{\text{in}}$ | $E_{\text{out}}$ |
|---|---|---|---|
| $\mathcal{H}_0$ | $0.533$ | $0.176$ | $0.618$ |
| $\mathcal{H}_1$ | $0.033 + x$ | $0.0089$ | $0.0011$ |
| $\mathcal{H}_2$ | $0.1 + 0.2x + 0.8x^2$ | $0$ | $0.405$ |

**What this means.** Each of the three terms has a place in this table. The lowest $E_{\text{out}}$ belongs to $\mathcal{H}_1$, whose position corresponds to $d_{\text{VC}}^*$ in the figure on page 3. Switching from $\mathcal{H}_1$ to $\mathcal{H}_2$, $E_{\text{in}}$ drops from 0.0089 to 0 and $E_{\text{out}}$ rises from 0.0011 to 0.405, more than three hundred times larger; this is overfitting. Switching from $\mathcal{H}_1$ to $\mathcal{H}_0$, both errors rise; this is underfitting. Looking at the single hypothesis $g_2$ alone, $E_{\text{in}} = 0$ and $E_{\text{out}} = 0.405$; this is bad generalization.

All three causes are present too. The noise is only $\pm 0.1$, but the parabola takes it seriously in order to pass through every point and learns a curvature $0.8x^2$ that does not actually exist. There are only 3 examples and all are in the right half, so not one of them can tell the parabola that it must not bend upward in the left half: at $x = -1$, $g_2(-1) = 0.1 - 0.2 + 0.8 = 0.7$ while the target is $-1$, a gap of 1.7. The line has not seen the left half either, but it has only two coefficients, and noise of $\pm 0.1$ merely shifts the whole line by $\frac{1}{30}$.

### Fun Time: which situation is least prone to overfitting

**Question (page 5):** Based on our discussion, for data of fixed size, which of the following situation is relatively of the lowest risk of overfitting?

1. small noise, fitting from small $d_{\text{VC}}$ to median $d_{\text{VC}}$
2. small noise, fitting from small $d_{\text{VC}}$ to large $d_{\text{VC}}$
3. large noise, fitting from small $d_{\text{VC}}$ to median $d_{\text{VC}}$
4. large noise, fitting from small $d_{\text{VC}}$ to large $d_{\text{VC}}$

**Answer: 1.** The handout's reference answer is: two causes of overfitting are noise and excessive $d_{\text{VC}}$, so if both are relatively "under control", the risk of overfitting is smaller. The question fixes the data size first, which leaves two of the three causes to compare. Choices 1 and 2 have the same noise, and 2 raises $d_{\text{VC}}$ by more; choices 1 and 3 have the same $d_{\text{VC}}$, and 3 has larger noise; choice 4 is worse than 1 on both counts. In driving terms, 1 is a smoother road with only a small increase in speed.

The question asks about "relative" risk. Choice 1 can overfit as well: in the three-point example above the noise was small and the order went only from 1 to 2.

## Noise and data size: why the learner who knows 10th-order polynomials loses to the one who only knows 2nd-order

```youtube
url: https://www.youtube.com/watch?v=6bfcLhHhgs0
title: Hazard of Overfitting :: The Role of Noise and Data Size @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–02:22 sets up the two experiments, 02:22–05:29 looks at the results, 05:29–07:50 discusses the irony of two learners, 07:50–11:02 explains it with learning curves, 11:02–12:47 is the no-noise case, and Fun Time follows.)

### Two data sets, two learners

Page 6 builds two artificial data sets, both one-dimensional regression problems:

- **Left:** the target is a 10th-order polynomial and noise is added to the data. The black points in the figure sit a little away from the blue target curve.
- **Right:** the target is a 50th-order polynomial with no noise at all. The blue curve bends much more than the one on the left, and the black points all lie exactly on it.

Both figures contain only a dozen or so examples.

Then come two learners. In the lecture, Lin presents them as two students: one knows only polynomials up to order 2 and, after seeing the data, picks the best $g_2$ from $\mathcal{H}_2$ (the green curve in the figure); the other knows all polynomials up to order 10 and picks the best $g_{10}$ from $\mathcal{H}_{10}$ (the red curve). The question in the footer is: is there overfitting from $g_2$ to $g_{10}$?

### The result: both overfit

The numbers on page 7:

| Target | | $g_2 \in \mathcal{H}_2$ | $g_{10} \in \mathcal{H}_{10}$ |
|---|---|---|---|
| 10th order + noise | $E_{\text{in}}$ | $0.050$ | $0.034$ |
| | $E_{\text{out}}$ | $0.127$ | $9.00$ |
| 50th order, noiseless | $E_{\text{in}}$ | $0.029$ | $0.00001$ |
| | $E_{\text{out}}$ | $0.120$ | $7680$ |

In both experiments $E_{\text{in}}$ is lower for $g_{10}$. This is bound to happen, because $\mathcal{H}_2 \subset \mathcal{H}_{10}$: $\mathcal{H}_{10}$ contains $g_2$, and the best choice from a larger set cannot be worse than $g_2$. Lin puts it this way in the lecture: the red student knows more polynomials and has more choices, so naturally reaches a lower $E_{\text{in}}$.

$E_{\text{out}}$ goes the opposite way entirely. On the left $g_2$ has 0.127 and $g_{10}$ has 9.00, about 71 times as much; on the right $g_2$ has 0.120 and $g_{10}$ has 7680, a factor of 64,000. The red curves in the figures swing widely between the data points. For the right-hand one, Lin describes the red curve as low where the target is high and high where the target is low, nothing like the 50th-order target. $E_{\text{in}}$ falls and $E_{\text{out}}$ rises, so by definition both are overfitting; the footer reads both yes!

### The irony of the first experiment: concession for advantage

Page 8 names the two learners: O (Overfit) picks $g_{10}$ and R (Restrict) picks $g_2$. It then supposes both of them **know** that the target is a 10th-order polynomial.

Intuitively O should have the edge: the target is 10th order and O knows 10th-order polynomials. R does not even know 10th order; the handout says R "gives up" ability to fit. Lin is more direct in the lecture: asking a student who only knows 2nd order means giving up on perfection from the start, because no 2nd-order polynomial can match a 10th-order target perfectly. Yet R wins in $E_{\text{out}}$ by a lot.

The footer of the handout reads philosophy: concession for advantage?, and in the lecture Lin glosses it with a Chinese idiom about stepping back in order to move forward. Lin also gives an example about a boss: if your boss tells you this problem can probably be solved with a 10th-order polynomial, you will most likely go straight to a 10th-order model, and it will not occur to you that a 2nd-order one might do better. Knowing the target is 10th order and actually learning with 10th order does not necessarily work better.

### Explaining it with learning curves

Page 9 brings back the learning curves from Foundations Lecture 9. The horizontal axis is the data size $N$ and the vertical axis is the expected error, with one figure for $\mathcal{H}_2$ and one for $\mathcal{H}_{10}$. Here the handout writes $\overline{E_{\text{in}}}$ and $\overline{E_{\text{out}}}$ for averages over many data sets.

Lin goes over again what the two figures have in common:

- As $N \to \infty$, $E_{\text{in}}$ and $E_{\text{out}}$ converge to the same value.
- For finite $N$, $E_{\text{in}}$ is a bit below that value. The data is visible, so optimization pulls the curve toward the data points.
- $E_{\text{out}}$ is a bit above that value. A curve pulled toward the points it has seen drifts away at the points it has not; Lin says that if there is noise over there, the distance is in effect doubled.

Foundations Lecture 9 worked out how large this "bit" is for linear regression: with noise of level $\sigma^2$, the average $E_{\text{in}} = \sigma^2\big(1 - \frac{d+1}{N}\big)$ and the average $E_{\text{out}} = \sigma^2\big(1 + \frac{d+1}{N}\big)$, a difference of $\frac{2(d+1)}{N}\sigma^2$. $d + 1$ is the number of parameters, 3 for $\mathcal{H}_2$ and 11 for $\mathcal{H}_{10}$.

The two figures differ in two ways. First, they converge to different values: $\mathcal{H}_{10}$ contains the 10th-order target, so only the noise remains in the limit; $\mathcal{H}_2$ cannot represent the target, so its limit is higher. This is the handout's first bullet: $\mathcal{H}_{10}$ has lower $\overline{E_{\text{out}}}$ when $N \to \infty$. Second, the distance between $E_{\text{in}}$ and $E_{\text{out}}$ differs: $\mathcal{H}_{10}$ has large model complexity, so the two are pulled far apart. In the slide's figure for $\mathcal{H}_{10}$, $E_{\text{out}}$ shoots straight off the top of the plot where $N$ is small.

Both figures have a gray area on the left, the range of small $N$. Comparing the two figures within that range, $\mathcal{H}_{10}$ has lower $\overline{E_{\text{in}}}$ and higher $\overline{E_{\text{out}}}$. The handout writes gray area: O overfits!, and the conclusion is R always wins in $\overline{E_{\text{out}}}$ if $N$ small.

Lin's comment in the lecture is that this is a case of being too clever for one's own good: knowing too many hypotheses makes $E_{\text{in}}$ very good, and the exam ($E_{\text{out}}$) goes badly. The advice is not to split hairs when there is not enough data, and to explain the data with simple hypotheses; that is imperfect, yet may well work better.

### Numerical example: computing the gray area

The following is an example made up for this article, not from the slides. It is a scaled-down version of the first experiment: the target is inside O's hypothesis set, the data is noisy, and R cannot even represent the target.

**Setup.** The target is $f(x) = x$ and $y_n = x_n + \epsilon_n$, where the $\epsilon_n$ are mutually independent noise with mean 0 and variance $\sigma^2$. R uses $\mathcal{H}_0$ (constants) and O uses $\mathcal{H}_1$ (lines), both with least squares. So that the expectations can be worked out by hand, the $x_n$ are fixed at $N$ equally spaced points on $[-1, 1]$ (in the handout's experiment $x$ is drawn at random), which gives $\sum_n x_n = 0$; write $S = \sum_n x_n^2$. At test time $x$ is uniform on $[-1, 1]$ and $y = x + \epsilon$. In this example $E_{\text{out}}$ is computed against the noisy $y$, consistent with the learning curves of Foundations Lecture 9. The expectation is taken over the noise in the training data.

**R's $E_{\text{out}}$.** $g_R(x) = \bar{y}$. Because $\sum_n x_n = 0$, $\bar{y} = \bar{\epsilon}$, the mean of the training noise, whose variance is $\frac{\sigma^2}{N}$. The error at a test point is $y - g_R = x + \epsilon - \bar{\epsilon}$, three mutually independent terms each with mean 0, so the expected square is the sum of the three variances:

$$
\overline{E_{\text{out}}}(R) = \frac{1}{3} + \sigma^2 + \frac{\sigma^2}{N}
$$

$\frac{1}{3}$ is $\mathbb{E}[x^2]$, the price of R being unable to represent the slope, and no amount of data makes it go away.

**O's $E_{\text{out}}$.** When $\sum_n x_n = 0$, the least-squares line has intercept $\bar{y} = \bar{\epsilon}$ and slope

$$
\frac{\sum_n x_n y_n}{S} = \frac{\sum_n x_n (x_n + \epsilon_n)}{S} = 1 + \frac{\sum_n x_n \epsilon_n}{S}
$$

Write $u = \sum_n x_n \epsilon_n / S$; its mean is 0 and its variance is $\sum_n x_n^2 \sigma^2 / S^2 = \sigma^2 / S$. The error at a test point is $y - g_O = \epsilon - \bar{\epsilon} - ux$. The covariance of $\bar{\epsilon}$ and $u$ is proportional to $\sum_n x_n = 0$, so the cross term vanishes:

$$
\overline{E_{\text{out}}}(O) = \sigma^2 + \frac{\sigma^2}{N} + \frac{\sigma^2}{S}\,\mathbb{E}[x^2] = \sigma^2\Big(1 + \frac{1}{N} + \frac{1}{3S}\Big)
$$

The equally spaced points $x_n = -1 + \frac{2(n-1)}{N-1}$ have $S = \frac{N(N+1)}{3(N-1)}$ (for $N = 2$ the two points are $\pm 1$ and $S = 2$; for $N = 3$ they are $-1, 0, 1$ and $S = 2$; both agree). Substituting, $\frac{1}{N} + \frac{N-1}{N(N+1)} = \frac{2}{N+1}$:

$$
\overline{E_{\text{out}}}(O) = \sigma^2\Big(1 + \frac{2}{N+1}\Big)
$$

This looks almost the same as $\sigma^2\big(1 + \frac{d+1}{N}\big)$ from Foundations Lecture 9 (here $d + 1 = 2$).

**$E_{\text{in}}$.** O's average $E_{\text{in}}$ is $\sigma^2\big(1 - \frac{2}{N}\big)$, which is the formula from Lecture 9. R's residuals are $x_n + \epsilon_n - \bar{\epsilon}$, and its average $E_{\text{in}}$ is $\frac{S}{N} + \sigma^2\big(1 - \frac{1}{N}\big)$.

**Plugging in numbers.** Take $\sigma^2 = 4$, noise much larger than the signal:

| $N$ | R's $\overline{E_{\text{in}}}$ | R's $\overline{E_{\text{out}}}$ | O's $\overline{E_{\text{in}}}$ | O's $\overline{E_{\text{out}}}$ | Lower $E_{\text{out}}$ |
|---|---|---|---|---|---|
| 2 | 3.000 | 6.333 | 0.000 | 6.667 | R |
| 3 | 3.333 | 5.667 | 1.333 | 6.000 | R |
| 5 | 3.700 | 5.133 | 2.400 | 5.333 | R |
| 9 | 3.972 | 4.778 | 3.111 | 4.800 | R |
| 10 | 4.007 | 4.733 | 3.200 | 4.727 | O |
| 20 | 4.168 | 4.533 | 3.600 | 4.381 | O |
| 100 | 4.300 | 4.373 | 3.920 | 4.079 | O |
| $\infty$ | 4.333 | 4.333 | 4 | 4 | O |

**What this means.** In every row O's $E_{\text{in}}$ is lower than R's. For $N \le 9$ O's $E_{\text{out}}$ is higher, and these rows are the gray area in the handout's figure: switching from R to O, $E_{\text{in}}$ falls and $E_{\text{out}}$ rises. O wins only from $N \ge 10$ on, by a growing margin, and the limit is 4 against 4.333, matching the handout's statement that $\mathcal{H}_{10}$ has lower $E_{\text{out}}$ when $N \to \infty$.

The difference of the two $E_{\text{out}}$ curves is $\sigma^2\big(\frac{2}{N+1} - \frac{1}{N}\big) - \frac{1}{3} = \sigma^2 \frac{N-1}{N(N+1)} - \frac{1}{3}$. The first term is the extra noise O absorbs by learning one more thing, the slope; the second is the fixed price of R being unable to represent the target. The larger the noise or the smaller the data, the larger the first term and the wider the range where R wins; Self-check question 3 works out the low-noise case.

### The second experiment: no noise, and R still wins

Page 10 returns to the experiment with the 50th-order target and no noise. This time suppose both learners know there is no noise; R still wins.

In the lecture, Lin first voices the doubt: with noise, one can say $g_{10}$ went wrong by chasing the noise; now there is no noise, so why does $g_{10}$ still do badly? Lin then asks back, in the words on the handout: is there really no noise? Lin's answer is that there is, only of another kind. What is to be learned is very complex: that winding 50th-order curve is beyond a 10th-order polynomial and beyond a 2nd-order one too, and the gap that cannot be reached behaves like noise. The handout's wording is "target complexity" acts like noise. The section on deterministic noise turns this into an experiment.

### Fun Time: when R wins

**Question (page 11):** When having limited data, in which of the following case would learner R perform better than learner O?

1. limited data from a 10-th order target function with some noise
2. limited data from a 1126-th order target function with no noise
3. limited data from a 1126-th order target function with some noise
4. all of the above

**Answer: 4.** The handout's reference answer says that 1 and 2 were discussed, and that you should be able to "generalize" that R also wins in the more difficult case of 3. Choice 1 is the first experiment. Choice 2 replaces 50th order with 1126th order: the target is more complex, the part a 10th-order polynomial cannot reach is larger, and that noise-like thing only grows. Choice 3 is both at once: a complex target with stochastic noise added; O lost in 1 and 2 with one kind each, and stacking the two will not turn the result around.

The words "limited data" at the start of the question must not be dropped. In the numerical example above, O wins once $N \ge 10$.

## Deterministic noise: when the target is too complex, overfitting happens even without noise

```youtube
url: https://www.youtube.com/watch?v=c_208kUQEis
title: Hazard of Overfitting :: Deterministic Noise @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–03:41 covers the experimental design and the overfit measure, 03:41–06:18 looks at the two result figures, 06:18–09:43 covers the two kinds of noise and the four causes, 09:43–12:56 defines deterministic noise, and Fun Time follows.)

### A more detailed experiment

Page 12 writes how the data is generated as a formula with three adjustable quantities:

$$
y = f(x) + \epsilon, \qquad f(x) = \sum_{q=0}^{Q_f} \alpha_q x^q, \qquad \epsilon \sim \text{Gaussian}(0, \sigma^2)
$$

- **Noise level $\sigma^2$:** $\epsilon$ is Gaussian iid noise.
- **Target complexity $Q_f$:** the target is a polynomial of order $Q_f$. The two earlier experiments were $Q_f = 10$ and $Q_f = 50$.
- **Data size $N$.**

The handout says $f$ is drawn from the polynomials of order $Q_f$ by some "uniform" distribution, with uniform in quotes. In the lecture, Lin explains why this is not easy: if the $Q_f + 1$ coefficients are simply generated at random, the coefficient of the highest-order term is often tiny, so the resulting polynomial does not really bend that much and is a lower-order polynomial disguised as a 50th-order one. The generation process therefore needs some normalization first, to make sure most of what is drawn are "true" polynomials of order $Q_f$. The lecture does not give the details, and this article does not expand on them either.

Page 13 defines how overfitting is measured. There are again two learners, $g_2 \in \mathcal{H}_2$ and $g_{10} \in \mathcal{H}_{10}$. $E_{\text{in}}(g_{10}) \le E_{\text{in}}(g_2)$ holds for sure, so only $E_{\text{out}}$ needs to be looked at:

$$
\text{overfit measure} = E_{\text{out}}(g_{10}) - E_{\text{out}}(g_2)
$$

Positive and large means serious overfitting; negative means the 10th-order learner really did better.

### The two result figures

Page 14 has two figures that show the overfit measure by color, on a scale from $-0.2$ (dark blue) to $0.2$ (dark red) with 0 in the middle as green. The horizontal axis of both is the data size $N$, with ticks at 80, 100, and 120.

| | Left figure | Right figure |
|---|---|---|
| Vertical axis | Noise level $\sigma^2$ (ticks at 0, 1, 2) | Target complexity $Q_f$ (ticks from 0 to 100) |
| Fixed quantity | $Q_f = 20$ | $\sigma^2 = 0.1$ |
| Red (serious overfitting) | Upper left: large noise, little data | Upper left: complex target, little data |
| Blue ($g_{10}$ is better) | Lower right: small noise, much data | Lower right: not-so-complex target, much data |

In the left figure the red-blue boundary is a slanted band from lower left to upper right: the more data, the larger the noise it takes to overfit. Lin says in the lecture that this is no surprise, since large noise with little data was already shown to cause overfitting.

The right figure is more interesting. Its overall trend resembles the left one, and Lin's reading in the lecture is that a more complex target with too little data is no different from noise. Looked at closely, the boundaries of the two figures have different shapes: in the right figure, above a $Q_f$ of roughly 25, the red-blue boundary is nearly vertical, the whole left half is dark red, the upper right corner is light blue, and the darkest blue is at the lower right where $Q_f$ is between the low teens and the twenties. The right figure also has a feature the left one lacks: around a $Q_f$ of 10 there is a horizontal divide, and below it the left end, where data is scarce, is red and quickly turns dark blue toward the right; the thin strip closest to the horizontal axis is yellow-green all the way across (an overfit measure from around 0 to slightly above 0). In other words, even when the target is very simple the figure still has regions of overfitting. This strip is explained with the four causes below.

Under the two figures the handout writes ring a bell? and shows the course logo. These two figures are the two largest pieces (upper left and lower right, meeting in the middle) of the logo on the cover of every handout. In the lecture, Lin goes on to explain the two small cells as well: the lower left stands for the nonlinear transform and the upper right for linear learning.

### Two kinds of noise, four causes

Page 15 gives each figure a name. The left figure is the impact of $\sigma^2$, called stochastic noise. The right figure is the impact of $Q_f$, called deterministic noise. Lin explains the naming in the lecture: both have the effect of noise, one is generated at random and the other is fixed and can be computed.

The handout then lists four reasons of serious overfitting:

| Cause | Direction | Where it is in the figures |
|---|---|---|
| Data size $N$ | ↓ | The left side of both figures |
| Stochastic noise | ↑ | The top of the left figure |
| Deterministic noise | ↑ | The top of the right figure |
| Excessive power | ↑ | The strip at the very bottom of the right figure |

The fourth cause explains the bottom of the right figure. This experiment compares 2nd order with 10th order. When the target is below 10th order, the learner who knows 10th order is too strong; Lin says in the lecture that when that learner is given an easy problem and the data contains noise (the right figure fixes $\sigma^2 = 0.1$), the learner will fit that noise. This is the "drive too fast" row of the driving analogy, using excessive $d_{\text{VC}}$, a cause that was already known.

What Lin stresses in the lecture are the other three: as long as there is noise, or the target is more complex than you think, switching to a more complex model can overfit, especially when there is not enough data. The handout's conclusion is overfitting "easily" happens. Lin adds an analogy: using machine learning without knowing it well is like a child driving a big truck, and an accident comes easily.

### The definition of deterministic noise

Page 16 gives the definition. If $f \notin \mathcal{H}$, something of $f$ cannot be captured by any hypothesis in $\mathcal{H}$. Let $h^*$ be the best hypothesis in $\mathcal{H}$; deterministic noise is the difference between $h^*$ and $f$. In the slide's figure the blue curve is $f$, the red curve is $h^*$, and the gray area between them is the deterministic noise.

The handout says it acts like "stochastic noise", and that this is not new to CS: pseudo-random generator. Lin's explanation in the lecture is that the random numbers in a computer are not truly random but are computed by a very complicated function, so a deterministic function has been used to produce a random effect all along.

It differs from stochastic noise in two ways:

- **It depends on $\mathcal{H}$.** Lin says in the lecture that with a more complex hypothesis set the deterministic noise in theory gets smaller; the power grows as well, though, so things still get more dangerous.
- **It is fixed for a given $x$.** As Lin puts it in the lecture: draw $y$ many times for the same $x$ and the deterministic noise is the same every time, whereas the stochastic noise differs each time.

The footer is a line of educational philosophy: when teaching a kid, perhaps better not to use examples from a complicated target function. In the lecture, Lin illustrates it with teaching a daughter to count: a small child's hypothesis set is very simple, so when teaching her to count one, two, three, four, you would not bring up number theory or the completeness of the real numbers, nor mention that there are irrational numbers beyond the rationals; she has not learned the integers yet and has no need for anything that complicated. Not using overly complex examples when teaching a simple hypothesis set keeps the deterministic noise smaller.

### Numerical example: computing overfitting from noiseless data

The following is an example made up for this article, not from the slides. It corresponds to the second experiment: the data has no noise at all, and the target is outside both learners' hypothesis sets.

**Setup.** The target is $f(x) = x^2$, $x$ is uniform on $[-1, 1]$, and $y = x^2$ with no noise. There are only $N = 2$ examples, with $x_1$ and $x_2$ drawn independently. R uses $\mathcal{H}_0$ (constants) and O uses $\mathcal{H}_1$ (lines). $E_{\text{out}}(g) = \mathbb{E}_x[(g(x) - x^2)^2]$. Besides the earlier moments, $\text{Var}(x^2) = \mathbb{E}[x^4] - (\mathbb{E}[x^2])^2 = \frac{1}{5} - \frac{1}{9} = \frac{4}{45}$ is also used.

**Step 1: deterministic noise.** Find the best $h(x) = w_0 + w_1 x$ in $\mathcal{H}_1$, that is, minimize $\mathbb{E}[(x^2 - w_0 - w_1 x)^2]$. Differentiating with respect to $w_1$ gives $-2\,\mathbb{E}[x(x^2 - w_0 - w_1 x)] = 0$, or $\mathbb{E}[x^3] - w_0\mathbb{E}[x] - w_1\mathbb{E}[x^2] = 0$; the odd moments are all 0, so $w_1 = 0$. Differentiating with respect to $w_0$ gives $w_0 = \mathbb{E}[x^2] - w_1\mathbb{E}[x] = \frac{1}{3}$. The best line is horizontal:

$$
h^*(x) = \frac{1}{3}, \qquad \text{deterministic noise} = f(x) - h^*(x) = x^2 - \frac{1}{3}
$$

Its mean square is $\text{Var}(x^2) = \frac{4}{45} \approx 0.089$. The best constant in $\mathcal{H}_0$ is also $\frac{1}{3}$, so in this example the two hypothesis sets have deterministic noise of the same size. It has a fixed value at every $x$: $-\frac{1}{3}$ at $x = 0$ and $\frac{2}{3}$ at $x = \pm 1$.

**Step 2: how R does.** $g_R = b = \frac{x_1^2 + x_2^2}{2}$. $b$ is the average of two independent copies of $x^2$, so $\mathbb{E}[b] = \frac{1}{3}$ and $\text{Var}(b) = \frac{1}{2} \cdot \frac{4}{45} = \frac{2}{45}$. Split $x^2 - b$ into $(x^2 - \frac{1}{3}) - (b - \frac{1}{3})$, two independent parts each with mean 0:

$$
\overline{E_{\text{out}}}(R) = \frac{4}{45} + \frac{2}{45} = \frac{2}{15} \approx 0.133
$$

$E_{\text{in}}$ is $\frac{(x_1^2 - b)^2 + (x_2^2 - b)^2}{2} = \frac{(x_1^2 - x_2^2)^2}{4}$, with expectation $\frac{2\,\text{Var}(x^2)}{4} = \frac{2}{45} \approx 0.044$.

**Step 3: how O does.** The line through $(x_1, x_1^2)$ and $(x_2, x_2^2)$ has slope $\frac{x_1^2 - x_2^2}{x_1 - x_2} = x_1 + x_2$, so

$$
g_O(x) = (x_1 + x_2)\,x - x_1 x_2, \qquad E_{\text{in}}(g_O) = 0
$$

Write $s = x_1 + x_2$ and $p = x_1 x_2$. $E_{\text{out}}(g_O) = \mathbb{E}_x[(x^2 - sx + p)^2]$, and after expanding, the odd-order terms vanish:

$$
E_{\text{out}}(g_O) = \mathbb{E}[x^4] + s^2\,\mathbb{E}[x^2] + p^2 + 2p\,\mathbb{E}[x^2] = \frac{1}{5} + \frac{s^2}{3} + p^2 + \frac{2p}{3}
$$

Now take the expectation over the data: $\mathbb{E}[s^2] = \mathbb{E}[x_1^2] + \mathbb{E}[x_2^2] = \frac{2}{3}$ (the cross term $2\,\mathbb{E}[x_1]\mathbb{E}[x_2] = 0$), $\mathbb{E}[p^2] = \mathbb{E}[x_1^2]\,\mathbb{E}[x_2^2] = \frac{1}{9}$, and $\mathbb{E}[p] = 0$:

$$
\overline{E_{\text{out}}}(O) = \frac{1}{5} + \frac{2}{9} + \frac{1}{9} = \frac{8}{15} \approx 0.533
$$

**Results.**

| Learner | Average $E_{\text{in}}$ | Average $E_{\text{out}}$ | Of which deterministic noise | The rest |
|---|---|---|---|---|
| R ($\mathcal{H}_0$) | $0.044$ | $\frac{2}{15} \approx 0.133$ | $\frac{4}{45}$ | $\frac{2}{45} \approx 0.044$ |
| O ($\mathcal{H}_1$) | $0$ | $\frac{8}{15} \approx 0.533$ | $\frac{4}{45}$ | $\frac{4}{9} \approx 0.444$ |

The overfit measure is $\frac{8}{15} - \frac{2}{15} = 0.4$, which is positive. In a simulation with 2 million random data sets, O's average $E_{\text{out}}$ is 0.5332 and R's is 0.1333, in agreement with the hand calculation; in about 97% of the data sets O is the worse one.

**What this means.** The data contains no stochastic noise whatsoever, and switching from R to O still makes $E_{\text{in}}$ fall (0.044 → 0) and $E_{\text{out}}$ rise (0.133 → 0.533). O's line passes perfectly through the two points every time. The $y$ values of those two points contain a component $x^2 - \frac{1}{3}$ that a line cannot represent, and O learns it as slope and intercept, so a different data set gives a different line. The column "The rest" is the error caused by this swaying with the data, and O's is ten times R's. Deterministic noise plays the same role here as the $\pm 0.1$ in the "three points, three models" example: both are things the model should not swallow whole.

This setup is close to Fall 2024 HW4 Q8 (the target there is $1 - 2x^2$, likewise fit with a line through two examples). This article uses a different target function and computes a different quantity; it is not a solution to that problem.

### Fun Time: the deterministic noise of sin(1126x)

**Question (page 17):** Consider the target function being $\sin(1126x)$ for $x \in [0, 2\pi]$. When $x$ is uniformly sampled from the range, and we use all possible linear hypotheses $h(x) = w \cdot x$ to approximate the target function with respect to the squared error, what is the level of deterministic noise for each $x$?

1. $\lvert \sin(1126x) \rvert$
2. $\lvert \sin(1126x) - x \rvert$
3. $\lvert \sin(1126x) + x \rvert$
4. $\lvert \sin(1126x) - 1126x \rvert$

**Answer: 1.** The handout's reference answer says you can try a few different $w$ and convince yourself that the best hypothesis is $h^*(x) = 0$, and that the deterministic noise is the difference between $f$ and $h^*$. Lin's reasoning in the lecture: the best one is the flat line, since tilting up or tilting down cannot follow the sine function; the flat line is 0, so the deterministic noise is the target function itself, and taking its level means adding the absolute value.

This article computes $w$. Minimizing $\mathbb{E}[(\sin(1126x) - wx)^2]$ and differentiating with respect to $w$ gives $w^* = \mathbb{E}[x\sin(1126x)] \big/ \mathbb{E}[x^2]$. The denominator is $\frac{1}{2\pi}\int_0^{2\pi} x^2\,dx = \frac{4\pi^2}{3}$. The numerator uses integration by parts; for an integer $k$:

$$
\int_0^{2\pi} x \sin(kx)\,dx = \Big[-\frac{x\cos(kx)}{k} + \frac{\sin(kx)}{k^2}\Big]_0^{2\pi} = -\frac{2\pi}{k}
$$

Dividing by $2\pi$ gives $\mathbb{E}[x\sin(1126x)] = -\frac{1}{1126}$. So

$$
w^* = -\frac{3}{4\pi^2 \times 1126} \approx -6.7 \times 10^{-5}
$$

The difference between this number and 0 shows up only in computation: over all of $[0, 2\pi]$, $\lvert w^* x \rvert$ is at most $4.2 \times 10^{-4}$, the mean squared error of $h^*$ is $0.49999994$, and that of $w = 0$ is $0.5$. This is what the handout means by $h^*(x) = 0$ and a deterministic noise of $\lvert \sin(1126x) \rvert$; among the four choices only choice 1 corresponds to this nearly flat line, so there is no doubt that the answer is 1. Intuitively, $\sin(1126x)$ goes through 1126 periods on $[0, 2\pi]$, the positive halves and negative halves cancel almost completely, and no slope can line up with it.

Each of the other choices corresponds to one specific $w$: choice 2 is $w = 1$, choice 3 is $w = -1$, and choice 4 is $w = 1126$. Numerical integration gives these mean squared errors: 0.5 for $w = 0$, about 13.66 for $w = \pm 1$, and about $1.67 \times 10^7$ for $w = 1126$. They are all far from the best hypothesis, so their difference from $f$ is not deterministic noise.

As in the example above, the best linear hypothesis in this question does (almost) nothing, and all of the target's variation becomes deterministic noise.

## Dealing with overfitting: start with the data

```youtube
url: https://www.youtube.com/watch?v=r3bX1k7tcjc
title: Hazard of Overfitting :: Dealing with Overfitting @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–03:18 returns to the driving analogy and lists five remedies, 03:18–06:28 is data cleaning and pruning, 06:28–08:37 is data hinting, 08:37–09:40 is Fun Time, and the summary of the whole lecture follows.)

### Five remedies

Page 18 extends the driving analogy table of page 4 by five rows:

| Learning | Driving | Explanation in the lecture |
|---|---|---|
| start from simple model | drive slowly | Driving fast leads to a crash, so drive slower |
| data cleaning/pruning | use more accurate road information | The road information may be noisy; make it more accurate |
| data hinting | exploit more road information | When no more data can be collected, generate new data from the existing data or from what is known about the problem |
| regularization | put the brakes | You may drive fast, but brake at the right moments |
| validation | monitor the dashboard | Keep checking how well you are driving |

The first row was covered in the previous lecture, whose advice was to try $\mathcal{H}_1$ first. Regularization is left to [Foundations Lecture 14: Regularization](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-14-regularization-en), and validation to [Foundations Lecture 15: Validation](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles-en). This lecture only briefly covers the middle two rows.

The handout's comment is all very practical techniques to combat overfitting. Lin puts it more strongly in the lecture: these are the practical tools for doing machine learning well, sometimes they must be combined, and when one does not work you switch to another; these ways in which humans help the machine learn better are sometimes more important than the algorithm itself.

Setting this table against the four causes (this article's own summary): data cleaning and pruning deal with stochastic noise, data hinting deals with data size, and starting from a simple model and regularization deal with excessive power. Deterministic noise depends on the gap between the target and the hypothesis set, and no row corresponds to it directly.

### Data cleaning and pruning

Page 19 uses the handwritten digit example that appeared in [Foundations Lecture 3: Types of Learning](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-03-types-of-learning-en): telling 1 from 5, with each image turned into two concrete features and plotted on a plane. The blue circles are 1s, clustered at the top; the red crosses are 5s, spread across the bottom. One point labeled 5 lies at the upper left, right up against the cluster of circles. The slide pulls out its original image, which looks like nothing more than a horizontal stroke. Lin says in the lecture that no matter how you look at it you cannot see why it is a 5, and that calling it something closer to a 1 would be more plausible.

For how to "detect" such a point the handout lists a few clues, ending with an ellipsis to indicate there are others:

- It is too close to other ○, or too far from other ×.
- Learn a classifier first; that classifier gets this point wrong, and wrong by a wide margin.

Once detected there are two possible actions:

- **Data cleaning:** correct the label. Lin says in the lecture that you can also ask someone to label it again.
- **Data pruning:** remove the example and train on fewer but cleaner data.

The handout's comment is possibly helps, but effect varies. Lin explains two reasons in the lecture. First, the hard part is detection: there is no method guaranteed to tell which example is the bad one, and each approach has its trade-offs. Second, even when one is found the effect may be small: in this example there are very many blue points and red points, and whether that one mislabeled cross is corrected or not, dropped or not, may make little difference to the overall result of learning. On some problems a clear benefit does appear.

### Data hinting: supplementing the data with virtual examples

Page 20 stays with handwritten digits. The slide lays out images of dozens of digits, all slightly slanted or displaced. The handout's observation is that slightly shifted or rotated digits carry the same meaning. Lin's example in the lecture is writing a 3: rotate it a little and it is still a 3.

So when there is no more data at hand and you want to tell the computer this piece of knowledge, you can take the existing digits, shift and rotate them, and add the resulting new data for retraining. These new data are called virtual examples and the practice is called data hinting: giving the algorithm a few more hints.

The handout's comment is possibly helps, but watch out, with a specific reason: a virtual example is not drawn iid from $P(\mathbf{x}, y)$. Lin's explanation in the lecture is that all the earlier theory assumes $(\mathbf{x}_n, y_n)$ comes iid from some distribution, and these newly manufactured examples definitely do not come from there. Lin says the practice can be useful in particular applications, when it puts knowledge of the problem domain in, but the added data has to make sense and must not stray too far from the original; drift too far from the original distribution and you may learn to classify all the rotated ones correctly while getting the original ones wrong. Lin tosses in an example of rotating too far: a 6 rotated by 180 degrees becomes a 9.

### Fun Time: which virtual examples to add for a symmetric target

**Question (page 21):** Assume we know that $f(x)$ is symmetric for some 1D regression application. That is, $f(x) = f(-x)$. One possibility of using the knowledge is to consider symmetric hypotheses only. On the other hand, you can also generate virtual examples from the original data $\{(x_n, y_n)\}$ as hints. What virtual examples suit your needs best?

1. $\{(x_n, -y_n)\}$
2. $\{(-x_n, -y_n)\}$
3. $\{(-x_n, y_n)\}$
4. $\{(2x_n, 2y_n)\}$

**Answer: 3.** The handout's reference answer is: we want the virtual examples to encode the invariance when $x \to -x$. $y_n \approx f(x_n)$, and $f(-x_n) = f(x_n)$, so at the position $-x_n$ the reasonable label is $y_n$.

Each of the other choices expresses a different property, none of them the one the question gives. Choice 1 puts two opposite labels at the same $x_n$, which amounts to telling the algorithm that $f(x_n)$ is about 0. Choice 2 expresses $f(-x) = -f(x)$, an odd function. Choice 4 expresses $f(2x) = 2f(x)$, the kind of property a line through the origin has.

As an addition in this article, here is what these hints actually do. Fit a least-squares line $w_0 + w_1 x$ to $(x_n, y_n)$ and $(-x_n, y_n)$ together. In the combined data the mean of $x$ is 0, and

$$
\sum x\,y = \sum_n x_n y_n + \sum_n (-x_n)\,y_n = 0
$$

The numerator of the slope is 0, so $w_1 = 0$. With the hints added, the line automatically becomes a symmetric horizontal line, the same result as considering symmetric hypotheses only.

Apply this back to the deterministic noise example: the target $x^2$ happens to be symmetric. After getting the two examples, O adds $(-x_1, x_1^2)$ and $(-x_2, x_2^2)$, and the line fit to the four points is $g(x) = \frac{x_1^2 + x_2^2}{2}$, exactly R's answer, so the average $E_{\text{out}}$ drops from $\frac{8}{15}$ to $\frac{2}{15}$. In this example the mirrored points do not stray from the original distribution (although each is not independent of the example it came from), because the distribution of $x$ is itself symmetric and the target really is symmetric; if the question had an asymmetric distribution instead, the mirrored points would land where data originally rarely appears, and that is the situation the handout tells you to watch out for.

### Summary of this lecture

Page 22 condenses each of the four sections into one line: overfitting is lower $E_{\text{in}}$ but higher $E_{\text{out}}$; it happens easily; what $\mathcal{H}$ cannot capture acts like noise; the remedies are data cleaning, pruning, hinting, and more. Lin wraps up the lecture this way: the causes are noise, not enough data, and too much power, and a target that is too complex can also be seen as a kind of noise; what was covered today are simple approaches that start from the data, which may help and may not. The preview of the next lecture is putting the brakes with regularization, learning how to brake.

## Self-check

**1. Three models give these results on the same data: A ($E_{\text{in}} = 0.20$, $E_{\text{out}} = 0.25$), B ($0.10$, $0.15$), C ($0.01$, $0.90$), with complexity A < B < C. Which statements can be described with "bad generalization", "overfitting", and "underfitting"?**

Answer: C by itself is bad generalization ($E_{\text{in}}$ low, $E_{\text{out}}$ high, 0.89 apart). Switching from B to C is overfitting ($E_{\text{in}}$ 0.10 → 0.01, $E_{\text{out}}$ 0.15 → 0.90). Switching from B to A is underfitting (both rise). Criterion: overfitting and underfitting must state which model is switched to which; saying only "C overfits" mixes up a state with a process.

**2. The target is $f(x) = x^3$, $x$ is uniform on $[-1, 1]$, the hypothesis set is $h(x) = wx$, and the error is squared error. What is the best $w$? What is the mean square of the deterministic noise?**

Answer: $w^* = \mathbb{E}[x \cdot x^3] / \mathbb{E}[x^2] = \frac{1/5}{1/3} = \frac{3}{5}$. The deterministic noise is $x^3 - \frac{3}{5}x$, and its mean square is $\mathbb{E}[x^6] - 2 \cdot \frac{3}{5}\mathbb{E}[x^4] + \frac{9}{25}\mathbb{E}[x^2] = \frac{1}{7} - \frac{6}{25} + \frac{3}{25} = \frac{4}{175} \approx 0.023$. Here $h^*$ is not 0, unlike the $\sin(1126x)$ of Fun Time: part of $x^3$ can be captured by a line, and only what cannot be captured is deterministic noise.

**3. In the "computing the gray area" example, change the noise to $\sigma^2 = 1$. For which $N$ does R win? In general, how large must $\sigma^2$ be for R to have a chance of winning?**

Answer: the difference of the two $E_{\text{out}}$ curves is $\sigma^2\frac{N-1}{N(N+1)} - \frac{1}{3}$. $\frac{N-1}{N(N+1)}$ is $\frac{1}{6}$ at both $N = 2$ and $N = 3$, is $\frac{3}{20}$ at $N = 4$, and keeps shrinking after that, so its maximum is $\frac{1}{6}$. With $\sigma^2 = 1$ the difference is at most $\frac{1}{6} - \frac{1}{3} < 0$, so O wins at every $N \ge 2$ and there is no gray area. For R to win at some $N$, it takes $\frac{\sigma^2}{6} > \frac{1}{3}$, that is, $\sigma^2 > 2$. When the noise is small, no shortage of data produces overfitting; this is the "stochastic noise ↑" row of the four causes.

**4. The handout says deterministic noise depends on $\mathcal{H}$: the larger $\mathcal{H}$ is, the smaller the deterministic noise. Then why does switching from $\mathcal{H}_2$ to $\mathcal{H}_{10}$ overfit instead?**

Criterion: the answer has to separate two things. Deterministic noise is the difference between $h^*$ and $f$; as $\mathcal{H}$ grows the best $h^*$ gets closer to $f$, and this difference does shrink. But with limited data what is learned is not $h^*$, and a larger $\mathcal{H}$ has more degrees of freedom to fit the noise in the few examples at hand (both kinds of noise count), which is the "excessive power" cause. In the experiment with the 50th-order target, the 10th-order polynomial has smaller deterministic noise than the 2nd-order one, yet $E_{\text{out}}$ is 7680 against 0.120. Citing the learning curves or the "The rest" column of the noiseless example above is even better.

**5. For handwritten digit recognition, someone rotates every image by 180 degrees, keeps the labels, and adds the results to the training data as virtual examples. What is wrong?**

Answer: keeping the label presupposes that the transformation does not change the meaning. That holds for small rotations and fails for 180 degrees: a 6 becomes a 9. These virtual examples amount to injecting a batch of mislabeled data, that is, manufacturing stochastic noise yourself. Even if you pick digits that are unaffected (such as 0 and 8), upside-down digits almost never appear in normal data, so these points are far from $P(\mathbf{x}, y)$, which is the situation the handout's watch out line refers to.

## Exercises and corresponding reading

**Corresponding weeks in two semesters.** The [Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) puts this lecture and the next in the same week (W7, 10/14), and the slides for this lecture are [13u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/13u_handout.pdf). The [Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) schedules it in W7 (10/21); when checked on 2026-09-30 the slide link for that week was still a 404, so this article uses only the MOOC handout.

**Textbook.** Both course pages map this lecture to sections 4.0 and 4.1 of [Learning from Data](http://amlbook.com) (LFD).

**Homework.** The related problems are in Fall 2024 [HW4](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf) (released 2024-10-21, due 11-04) and [HW5](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw5/hw5.pdf) (released 11-04, due 11-18), neither with official solutions:

- **HW4 Q8**: the target is $f(x) = 1 - 2x^2$, approximated by a line $h(x) = w_0 + w_1 x$, with linear regression on just two examples; find $\mathbb{E}_{\mathcal{D}}(\lvert E_{\text{in}}(g) - E_{\text{out}}(g) \rvert)$. This is a case where $f$ is not in $\mathcal{H}$, and you can start the way this article's noiseless example does, writing $g$ in terms of $x_1$ and $x_2$ and then taking the expectation.
- **HW4 Q9**: the problem says "In Lecture 13" explicitly. It generates virtual examples by adding Gaussian noise to the inputs and asks for the form of $\mathbb{E}(X_h^\top X_h)$; a note in the problem points out its relation to the matrix that regularized linear regression inverts.
- **HW5 Q5**: prove that linear regression with certain virtual examples added has the same solution as a weighted L2 regularization. This problem connects this lecture's data hinting to the next lecture's regularization, so do it after reading the next lecture.

The guide to the homework as a whole is the [Foundations homework guide](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide-en).

**Hands-on.** Before watching the second video, guess for yourself who wins each of the two experiments, then compare with the table on page 7. While watching the third video, copy down the four causes and pair each with an example you have seen at work. To reproduce page 7 yourself, use numpy to generate a data set from a 10th-order polynomial plus noise, take a dozen or so examples, fit 2nd order and 10th order with `numpy.polyfit`, and compute $E_{\text{out}}$ on a few thousand separately drawn examples; the numbers will not match the handout (which does not publish that data set), but you should see the $E_{\text{out}}$ of $g_{10}$ far above that of $g_2$.

**Further reading.** Another way of telling the same story is the bias-variance decomposition; see [Stanford CS229 Lecture 6: Bias and Variance, Regularization, and Model Selection](/posts/ai/2026-10-12-stanford-cs229-lecture-06-bias-variance-regularization-en).

**Next lecture.** [Foundations Lecture 14: Regularization](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-14-regularization-en) handles "put the brakes" from the analogy table: how to learn in $\mathcal{H}_{10}$ without letting it use all of its power.

## Course video sources

Original videos: [What is Overfitting?](https://www.youtube.com/watch?v=BA76U3JBDdE), [The Role of Noise and Data Size](https://www.youtube.com/watch?v=6bfcLhHhgs0), [Deterministic Noise](https://www.youtube.com/watch?v=c_208kUQEis), [Dealing with Overfitting](https://www.youtube.com/watch?v=r3bX1k7tcjc)

- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [Official course and recordings portal](https://www.csie.ntu.edu.tw/~htlin/mooc/)

Checked: 2026-10-13. The video IDs, titles, and lengths were taken from the official playlist that day; the videos have no caption tracks on YouTube, and what this article reports from the lecture comes from transcripts made for it.

## Update Log

- 2026-10-13: Previously combined with Lecture 14 in one article; changed to one article per lecture and rewritten from the handout and the video transcripts.
- 2026-10-10: Marked the video status and checked the recording sources and how they were obtained.
- 2026-10-10: Rechecked the video status. The embedded videos match the lecture numbering of the official playlist.

## References

- [Foundations Lecture 13 handout 13_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/13_handout.pdf): the main basis of this article; the definitions in the four sections, the experimental numbers on page 7, the two result figures, the four causes, and the four Fun Time questions all come from this handout.
- [Foundations Lecture 9 handout 09_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/09_handout.pdf): the formulas for the linear regression learning curves (pages 16 and 17), used to explain the two learning curves on page 9.
- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf): this lecture is videos 50 to 53 of the playlist; what the text reports as said "in the lecture" is paraphrased from machine transcripts of these four videos.
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/): the official portal for handouts and recordings.
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/): the corresponding week, the 13u slides, and the LFD sections.
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/): the corresponding week and the LFD sections.
- [Fall 2024 Homework 4 (hw4_red.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf): the content of Q8 and Q9.
- [Fall 2024 Homework 5 (hw5.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw5/hw5.pdf): the content of Q5.
- [Learning from Data textbook site](http://amlbook.com): the source for sections 4.0 and 4.1.
- [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques: course overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en): where this lecture sits in the whole course and the reading routes.
