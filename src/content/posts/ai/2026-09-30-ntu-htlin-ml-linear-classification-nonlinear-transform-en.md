---
title: "Linear Models for Classification: Three Error Functions, SGD, and Multiclass | NTU Hsuan-Tien Lin Machine Learning Foundations Lecture 11"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, classification, sgd, logistic-regression]
lang: en
math: true
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 11
tldr: "PLA, linear regression, and logistic regression all start by computing the score s = wᵀx, and all three errors can be written as functions of ys. The squared error and the cross-entropy rescaled to log₂ both sit above the 0/1 error, so making the regression E_in small also gives a guarantee on the classification E_out. Next, replacing the average over N examples in the gradient with one randomly drawn example gives SGD at O(1) per step. Finally, OVA (K classifiers, take the highest score) and OVO (K(K−1)/2 classifiers, vote) assemble binary classifiers into a multiclass classifier."
description: "A guide to Lecture 11 of NTU Hsuan-Tien Lin's Machine Learning Foundations, Linear Models for Classification: rewriting three error functions in terms of ys, the scaled cross-entropy upper bound and how it connects to the VC bound, stochastic gradient descent and its relation to PLA, and the OVA and OVO multiclass decompositions, with all four Fun Time questions explained and the three models and SGD worked through on five data points."
draft: false
glossary:
  - term: "scaled cross-entropy"
    aliases: ["err_SCE", "scaled ce"]
    definition: "The cross-entropy error with ln replaced by log₂, that is, divided by ln 2: log₂(1 + exp(−ys)). It equals exactly 1 at ys = 0 and is never smaller than the 0/1 error for any ys."
    context: "Foundations Lecture 11 uses it as an upper bound of the 0/1 error to show that logistic regression can be used for classification."
  - term: "stochastic gradient descent"
    aliases: ["SGD"]
    definition: "At each step, draw one example at random and update w using the gradient of the error on that example alone. The expectation of this stochastic gradient equals the true gradient, and the cost of each step does not depend on the number of examples N."
    context: "Foundations Lecture 11 uses it to cut the per-step cost of logistic regression from O(N) to O(1)."
  - term: "OVA decomposition"
    aliases: ["one-versus-all", "OVA"]
    definition: "Split K-class classification into K binary problems of the form \"class k or not\", train a soft classifier (such as logistic regression) on each, and predict the class with the highest score."
    context: "The first multiclass meta-algorithm in Foundations Lecture 11."
  - term: "OVO decomposition"
    aliases: ["one-versus-one", "OVO"]
    definition: "For every pair of classes (k, ℓ), train a binary classifier on the data of those two classes only, K(K−1)/2 classifiers in total, and at prediction time let all the classifiers vote to pick the \"tournament champion\"."
    context: "The second multiclass meta-algorithm in Foundations Lecture 11, used to ease the class imbalance of OVA."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-htlin-ml-linear-classification-nonlinear-transform)

**Video status: Videos included.** This article is written from the official MOOC handout [11_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/11_handout.pdf) and transcripts of this lecture's four official videos, with formulas following the handout. The transcripts are machine transcripts made for this article (Whisper), not official captions, and no human has proofread them. The videos are taught in Mandarin; the slides are in English. Each section opens with its official video and the approximate time ranges. Page numbers refer to the number at the lower right of each slide (0/25 to 25/25), and wherever the text says "in the lecture" it is paraphrasing what is said in the video.

This is Foundations Lecture 11 in [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en). The Roadmap on page 1 of the handout places it under the third of the four big questions, "How Can Machines Learn?". The previous lecture, [Foundations Lecture 10: Logistic Regression](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-10-logistic-regression-en), takes up a single line on that page: gradient descent on cross-entropy error to get good logistic hypothesis. By this point Foundations has taught three linear models: PLA and pocket for classification, linear regression with its closed-form solution, and logistic regression solved by gradient descent. In the lecture, Lin opens by saying that this lecture first brings these three models together and then extends them to more complicated classification problems.

The whole lecture answers three questions:

1. Linear regression and logistic regression are far easier to solve than classification with the 0/1 error. Can we borrow them for binary classification?
2. Every step of logistic regression sweeps through all $N$ examples. Can it look at just one example per step, as PLA does?
3. When there are more than two classes, how do we use the binary classification tools we have?

The prerequisites are the correction rule and pocket from [Foundations Lecture 2: Perceptrons and PLA](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm-en), the VC bound from [Foundations Lecture 7: The VC Dimension](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error-en), the squared error and closed-form solution from [Foundations Lecture 9: Linear Regression](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression-en), and the cross-entropy error and its gradient from the previous lecture. After reading, you should be able to rewrite the three errors as functions of $ys$ on your own and prove which ones are upper bounds of the 0/1 error, derive the SGD update rule and say how it differs from PLA, compute the OVA and OVO predictions for a test point by hand, and estimate the training cost of each decomposition.

## Can regression be used for classification: three errors on one plot

```youtube
url: https://www.youtube.com/watch?v=qXfDVHVzI38
title: Linear Models for Classification :: Binary Classification @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–03:08 reviews the three linear models, 03:08–09:38 rewrites the errors as functions of $ys$, 09:38–14:26 draws the error curves on one plot, 14:26–17:52 covers the theoretical implication of the upper bound, 17:52–20:55 discusses how to choose in practice, and Fun Time follows.)

### Three models share one score

Page 2 of the handout puts the three models side by side. All of them first compute the same linear score $s = \mathbf{w}^\top\mathbf{x}$; they differ in what they do with it afterwards:

| | Linear classification | Linear regression | Logistic regression |
|---|---|---|---|
| Hypothesis | $h(\mathbf{x}) = \text{sign}(s)$ | $h(\mathbf{x}) = s$ | $h(\mathbf{x}) = \theta(s)$ |
| Error chosen in the handout | 0/1 (plausible) | squared (friendly) | cross-entropy (plausible) |
| Nature of $E_{\text{in}}(\mathbf{w})$ | discrete, NP-hard to solve | quadratic convex, closed-form solution | smooth convex, gradient descent |

"Plausible" and "friendly" are terms from [Foundations Lecture 8: Noise and Error Measures](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-08-noise-and-error-en): the first means the error can be justified, the second means it is easy to optimize.

The question at the bottom of this page is: can linear regression or logistic regression help linear classification? In the lecture, Lin sets it up this way: optimizing linear classification is hard, while the other two models make $E_{\text{in}}$ small much more easily, so can we borrow them as substitutes for classification. The borrowing is direct: restrict the labels to $y \in \{-1, +1\}$ and run regression as usual. In the lecture, Lin says that the data logistic regression receives is already the same as binary classification data; for linear regression, $-1$ and $+1$ are just two particular real numbers, so it can use the data directly too.

The question is whether doing so makes sense. To answer it, we first have to compare the three errors on the same axis.

### Writing all three errors as functions of ys

In the lecture, Lin describes what page 3 does as unifying the error functions of the three models. Computing the error used to take two steps: compute $h(\mathbf{x})$ from the score, then compare $h(\mathbf{x})$ with $y$. Now the first step is folded into the error function, which is written directly as a function $\text{err}(s, y)$ of the score $s$ and the label $y$.

**0/1 error.** Substitute $h(\mathbf{x}) = \text{sign}(s)$:

$$
\text{err}_{0/1}(s, y) = \llbracket \text{sign}(s) \ne y \rrbracket = \llbracket \text{sign}(ys) \ne 1 \rrbracket
$$

The second equality uses $y \in \{-1, +1\}$. When $y = +1$, $ys = s$ and the two conditions are identical; when $y = -1$, $ys = -s$, and "$\text{sign}(s) \ne -1$" and "$\text{sign}(-s) \ne 1$" are also the same statement. In the lecture, Lin describes this as quietly multiplying $y$ in.

**Squared error.** Substitute $h(\mathbf{x}) = s$, then multiply by $y^2 = 1$:

$$
\text{err}_{\text{SQR}}(s, y) = (s - y)^2 = y^2(s - y)^2 = (ys - y^2)^2 = (ys - 1)^2
$$

**Cross-entropy error.** The previous lecture derived the pointwise error of logistic regression as $-\ln h(y\mathbf{x})$. Substitute $h(y\mathbf{x}) = \theta(y\mathbf{w}^\top\mathbf{x}) = \theta(ys)$ and $\theta(u) = \frac{1}{1 + e^{-u}}$:

$$
\text{err}_{\text{CE}}(s, y) = -\ln\frac{1}{1 + \exp(-ys)} = \ln\big(1 + \exp(-ys)\big)
$$

This one already contained $ys$; the first two were rewritten to line up with it.

Only one quantity, $ys$, is left in the three formulas. The handout calls it the classification correctness score, and in the lecture Lin takes it apart: $s$ is the score, and multiplying by $y$ asks whether the score is correct with respect to $y$. A positive $ys$ means the sign of the score matches the label, so the point is classified correctly; a larger $ys$ means it is correct and farther from the boundary; a negative $ys$ means it is misclassified.

### The shapes of the four curves

Page 4 puts $ys$ on the horizontal axis and the error on the vertical axis, and overlays the curves across four builds of the slide: first 0/1, then the squared error is added, then cross-entropy, and the last build swaps the cross-entropy line for the scaled cross-entropy, so the plot never shows more than three lines at once. The scaled cross-entropy replaces $\ln$ with $\log_2$:

$$
\text{err}_{\text{SCE}}(s, y) = \log_2\big(1 + \exp(-ys)\big) = \frac{1}{\ln 2}\,\text{err}_{\text{CE}}(s, y)
$$

Here is the content of the plot as numbers (computed for this article, rounded to four decimal places):

| $ys$ | $\text{err}_{0/1}$ | $\text{err}_{\text{SQR}}$ | $\text{err}_{\text{CE}}$ | $\text{err}_{\text{SCE}}$ |
|---|---|---|---|---|
| $-3$ | 1 | 16 | 3.0486 | 4.3982 |
| $-2$ | 1 | 9 | 2.1269 | 3.0685 |
| $-1$ | 1 | 4 | 1.3133 | 1.8946 |
| $-0.5$ | 1 | 2.25 | 0.9741 | 1.4053 |
| $0$ | 1 | 1 | 0.6931 | 1 |
| $0.5$ | 0 | 0.25 | 0.4741 | 0.6839 |
| $1$ | 0 | 0 | 0.3133 | 0.4519 |
| $2$ | 0 | 1 | 0.1269 | 0.1831 |
| $3$ | 0 | 4 | 0.0486 | 0.0701 |

The handout has one comment for each of the four lines. Here they are with the explanations from the lecture:

- **0/1**: 1 when $ys \le 0$ and 0 otherwise, a step.
- **Squared**: a parabola with its vertex at $ys = 1$. It is large when $ys \ll 1$, which agrees with the intuition for classification; in the lecture, Lin says an error function is a way of deducting points, and a bigger mistake should cost more. But it is also large when $ys \gg 1$, which the handout labels over-charge. Pointing at the right side of the plot, Lin says that this is the region the 0/1 error considers very good (correctly classified with a high score), yet forcing linear regression onto it treats those points as very bad. The $ys = 3$ row of the table shows exactly this: the 0/1 error is 0 and the squared error is 4. Still, whenever the squared error on an example is small, $ys$ is near 1 and the 0/1 error must be 0, so the handout writes small $\text{err}_{\text{SQR}}$ → small $\text{err}_{0/1}$, with the arrow pointing one way only.
- **Cross-entropy**: a smooth curve that decreases monotonically in $ys$, approaching 0 when $ys$ is large and climbing higher and higher as $ys$ gets very negative. The handout writes small $\text{err}_{\text{CE}}$ ↔ small $\text{err}_{0/1}$, with the arrow pointing both ways. In the lecture, Lin is guarded about the reverse direction and only says it also holds from a certain point of view. An addition in this article on what that reservation means: when the 0/1 error is 0 we have $ys > 0$, so the cross-entropy must be less than $\ln 2 \approx 0.693$; it is bounded, but nothing guarantees it is close to 0.
- **Scaled cross-entropy**: in the lecture, Lin explains why the base is changed. At $ys = 0$, $\log_2(1 + e^0) = \log_2 2 = 1$, so the curve just touches the top of the 0/1 step; the whole line therefore sits above the 0/1 error, and the handout calls it a proper upper bound of 0/1. From the optimization point of view it is only a division by the constant $\ln 2$, and the location of the minimum does not change.

The conclusion at the bottom of the page: an upper bound is useful for designing the algorithmic error $\widehat{\text{err}}$. $\widehat{\text{err}}$ is notation from Foundations Lecture 8 for the error the algorithm actually optimizes, which need not equal the one the application really cares about.

**An addition in this article: proofs of the two upper bounds.** The handout argues from the plot; here are the formulas. There are two cases:

- $ys \le 0$: the 0/1 error is 1. In the squared error $(ys - 1)^2$, we have $ys - 1 \le -1$, so the square is at least 1. In the scaled cross-entropy, $\exp(-ys) \ge 1$, so $\log_2(1 + \exp(-ys)) \ge \log_2 2 = 1$.
- $ys > 0$: the 0/1 error is 0, and neither of the other two is negative.

So the squared error and the scaled cross-entropy are no smaller than the 0/1 error at every $ys$. The unscaled cross-entropy cannot manage this: at $ys = 0$ it is only $\ln 2 \approx 0.693$, less than 1. Solving $\ln(1 + e^{-ys}) < 1$ gives $ys > -\ln(e - 1) \approx -0.541$, so on the stretch $-0.541 < ys \le 0$ the cross-entropy is below the 0/1 error.

### How the upper bound connects to the VC bound

Page 5 turns the pointwise inequality into a guarantee on $E_{\text{out}}$. It starts from the following, which holds for every $ys$:

$$
\text{err}_{0/1}(s, y) \le \text{err}_{\text{SCE}}(s, y) = \frac{1}{\ln 2}\,\text{err}_{\text{CE}}(s, y)
$$

$E_{\text{in}}$ is the average error over $N$ examples; every example satisfies this inequality, so it still holds after averaging. $E_{\text{out}}$ is the expectation over the whole distribution, which Lin describes in the lecture as an average over infinitely many examples, so the same reasoning applies. With a superscript marking which error is being measured:

$$
E_{\text{in}}^{0/1}(\mathbf{w}) \le E_{\text{in}}^{\text{SCE}}(\mathbf{w}) = \frac{1}{\ln 2}E_{\text{in}}^{\text{CE}}(\mathbf{w}), \qquad E_{\text{out}}^{0/1}(\mathbf{w}) \le E_{\text{out}}^{\text{SCE}}(\mathbf{w}) = \frac{1}{\ln 2}E_{\text{out}}^{\text{CE}}(\mathbf{w})
$$

The handout then gives two routes, both leading to the same conclusion.

**The left route: VC on 0/1.** First apply the VC bound from Foundations Lecture 7, which is about the 0/1 error, with $\Omega^{0/1}$ as the model complexity term; then replace $E_{\text{in}}^{0/1}$ with its upper bound:

$$
E_{\text{out}}^{0/1}(\mathbf{w}) \le E_{\text{in}}^{0/1}(\mathbf{w}) + \Omega^{0/1} \le \frac{1}{\ln 2}E_{\text{in}}^{\text{CE}}(\mathbf{w}) + \Omega^{0/1}
$$

**The right route: VC-Reg on CE.** First replace $E_{\text{out}}^{0/1}$ with its cross-entropy upper bound, then apply the regression version of the VC bound to the real-valued cross-entropy error:

$$
E_{\text{out}}^{0/1}(\mathbf{w}) \le \frac{1}{\ln 2}E_{\text{out}}^{\text{CE}}(\mathbf{w}) \le \frac{1}{\ln 2}E_{\text{in}}^{\text{CE}}(\mathbf{w}) + \frac{1}{\ln 2}\Omega^{\text{CE}}
$$

In the lecture, Lin admits that the bound used on the right was never actually taught in this course; if you trust that this kind of derivation is sound, you get this line. Everything on the left route has been taught.

The right-hand side of both routes is "the cross-entropy $E_{\text{in}}$ plus a complexity term". The handout's conclusion sits in the yellow box: small $E_{\text{in}}^{\text{CE}}(\mathbf{w})$ ⟹ small $E_{\text{out}}^{0/1}(\mathbf{w})$, so logistic regression can be used for linear classification. Lin goes on to say that swapping the cross-entropy for the squared error also works, because the squared error is likewise an upper bound of the 0/1 error, only a looser one; that is why the yellow box lists the two side by side as logistic/linear reg.

An addition in this article: the squared-error version needs no division by $\ln 2$, and the left route reads $E_{\text{out}}^{0/1}(\mathbf{w}) \le E_{\text{in}}^{\text{SQR}}(\mathbf{w}) + \Omega^{0/1}$. Also keep in mind that all of these are upper bounds. When $E_{\text{in}}^{\text{CE}} = 0.3$, $E_{\text{in}}^{0/1} \le 0.3 / \ln 2 \approx 0.433$, and the guarantee says something; when $E_{\text{in}}^{\text{CE}} = 0.8$ the upper bound is 1.154, larger than the maximum value 1 of the 0/1 error, which guarantees nothing. The upper bound is useful only once the cross-entropy has really been pushed down.

### Choosing among the three models in practice

Page 6 first writes the approach as two steps, which the handout calls regression for classification:

1. Run logistic or linear regression on the data $\mathcal{D}$ with $y_n \in \{-1, +1\}$ to get $\mathbf{w}_{\text{REG}}$.
2. Return $g(\mathbf{x}) = \text{sign}(\mathbf{w}_{\text{REG}}^\top\mathbf{x})$.

Then comes a three-column comparison:

| | PLA | Linear regression | Logistic regression |
|---|---|---|---|
| Pros | efficient, with a strong guarantee, if the data is linearly separable | "easiest" optimization | "easy" optimization |
| Cons | works only if linearly separable, otherwise needing the pocket heuristic | loose bound of $\text{err}_{0/1}$ for large $\lvert ys \rvert$ | loose bound of $\text{err}_{0/1}$ for very negative $ys$ |

To see how loose "loose" is, go back to the earlier table: at $ys = -3$ the 0/1 error is 1, the scaled cross-entropy is 4.40, and the squared error is 16; at $ys = 3$ the 0/1 error is 0, the scaled cross-entropy is 0.07, yet the squared error is 4. Logistic regression is loose only on the badly misclassified side, while linear regression is loose on both sides. Lin's comment on PLA in the lecture: it does well only when the data is linearly separable, and if you do not know whether the data is linearly separable you have to use pocket, which reduces the advantage.

The bottom of the page gives two practical suggestions:

- **Linear regression is sometimes used to set $\mathbf{w}_0$.** In the lecture, Lin says PLA, pocket, and logistic regression all need a starting point, which so far has been the zero vector or a random value. Linear regression is computed in one step; its bound is too loose for it to serve as the answer directly, but taking its solution as $\mathbf{w}_0$ and continuing to optimize from there is common practice.
- **Logistic regression is often preferred over pocket.** Lin's reason in the lecture is that the two spend about the same effort per iteration, and logistic regression has the better optimization properties, so in practice most people use logistic regression for binary classification.

### Numerical example: one data set, three w, each winning on one error

What follows is an example made up for this article, not from the slides; the numbers were verified with Python. It reuses the five patients from the guide to Foundations Lecture 10: $x_1$ is the standardized score of some lab test, $y = +1$ means the patient later had a heart attack, and $\mathbf{x} = (1, x_1)$. The five examples are, in order, $(x_1, y) = (-2, -1)$, $(-1, -1)$, $(0, +1)$, $(1, -1)$, $(2, +1)$. This data set is not linearly separable; even the best threshold misclassifies one example.

**Linear regression.** Use the closed-form solution from Foundations Lecture 9. The mean of $x_1$ is 0, so $w_0$ is just the mean of $y$, $-0.2$, and $w_1 = \frac{\sum_n x_{n,1}y_n}{\sum_n x_{n,1}^2} = \frac{2 + 1 + 0 - 1 + 2}{10} = 0.4$, giving $\mathbf{w}_{\text{LIN}} = (-0.2, 0.4)$.

**Logistic regression.** Running gradient descent to the bottom of the valley in the previous lecture gave $\mathbf{w}_{\text{LOG}} \approx (-0.6227, 1.0904)$.

**Looking at the 0/1 error directly.** Put the threshold at $x_1 = -0.5$, that is, $\mathbf{w} = (0.5, 1)$, and only example 4 is misclassified.

Taking $\mathbf{w}_{\text{LIN}}$ as the example, here is every row computed:

| $n$ | $x_1$ | $y_n$ | $s = \mathbf{w}_{\text{LIN}}^\top\mathbf{x}_n$ | $y_ns$ | $\text{err}_{0/1}$ | $\text{err}_{\text{SQR}}$ | $\text{err}_{\text{SCE}}$ |
|---|---|---|---|---|---|---|---|
| 1 | $-2$ | $-1$ | $-1.0$ | $1.0$ | 0 | 0 | 0.4519 |
| 2 | $-1$ | $-1$ | $-0.6$ | $0.6$ | 0 | 0.16 | 0.6312 |
| 3 | $0$ | $+1$ | $-0.2$ | $-0.2$ | 1 | 1.44 | 1.1515 |
| 4 | $1$ | $-1$ | $0.2$ | $-0.2$ | 1 | 1.44 | 1.1515 |
| 5 | $2$ | $+1$ | $0.6$ | $0.6$ | 0 | 0.16 | 0.6312 |

In every row the squared error and the scaled cross-entropy are no smaller than the 0/1 error, and the same holds for the averages: $E_{\text{in}}^{0/1} = 0.4$, $E_{\text{in}}^{\text{SQR}} = 0.64$, $E_{\text{in}}^{\text{SCE}} = 0.8034$. The four kinds of $E_{\text{in}}$ for the three $\mathbf{w}$ are collected below:

| $\mathbf{w}$ | $E_{\text{in}}^{0/1}$ | $E_{\text{in}}^{\text{SQR}}$ | $E_{\text{in}}^{\text{CE}}$ | $E_{\text{in}}^{\text{SCE}}$ |
|---|---|---|---|---|
| $\mathbf{w}_{\text{LIN}} = (-0.2, 0.4)$ | 0.4 | **0.64** | 0.5569 | 0.8034 |
| $\mathbf{w}_{\text{LOG}} \approx (-0.6227, 1.0904)$ | 0.4 | 1.7720 | **0.4844** | 0.6988 |
| $(0.5, 1)$ | **0.2** | 1.85 | 0.5860 | 0.8454 |

**What this result means.**

- Every row satisfies $E_{\text{in}}^{0/1} \le E_{\text{in}}^{\text{SQR}}$ and $E_{\text{in}}^{0/1} \le E_{\text{in}}^{\text{SCE}}$, so the inequalities on page 5 hold on this data set.
- Each of the three $\mathbf{w}$ is the smallest on one error. Linear regression and logistic regression put the threshold near $x_1 = 0.5$ and $0.571$ and misclassify examples 3 and 4; the line with the smallest 0/1 error misclassifies only one example, yet its squared error and cross-entropy are larger, because example 4 has $ys = -1.5$ and both regression errors penalize it heavily.
- So regression for classification gives a guarantee, not the optimal solution: push the upper bound down and the 0/1 error will not exceed it, but nothing guarantees it reaches its minimum. This is also why the handout says linear regression is suited to supplying $\mathbf{w}_0$, to be handed on to pocket or logistic regression.
- In the logistic regression row the squared error is as high as 1.77, and its largest term comes from example 1: $ys = 2.80$, classified very correctly, yet the squared error is 3.25. This is the over-charge the handout mentions.

### Fun Time: which one is not an upper bound of the 0/1 error

**Question (page 7):** Following the definition in the lecture, which of the following is not always greater than or equal to $\text{err}_{0/1}(y, s)$ when $y \in \{-1, +1\}$?

1. $\text{err}_{0/1}(y, s)$
2. $\text{err}_{\text{SQR}}(y, s)$
3. $\text{err}_{\text{CE}}(y, s)$
4. $\text{err}_{\text{SCE}}(y, s)$

**Answer: 3.** The handout's answer only says "Too simple, uh?" and notes that $\text{err}_{0/1}$ is surely an upper bound of itself, so choice 1 is wrong. Choices 2 and 4 are upper bounds; the proof is in the addition under "The shapes of the four curves". The counterexample for choice 3 is $ys = 0$: the cross-entropy is $\ln 2 \approx 0.693$ and the 0/1 error is 1. In the lecture, Lin explains that the plot shows the cross-entropy does not really sit above the 0/1 error, and it does so only after one rescaling.

## Logistic regression that looks at one example per step: stochastic gradient descent

```youtube
url: https://www.youtube.com/watch?v=9HL3YvmrovQ
title: Linear Models for Classification :: Stochastic Grad. Descent @ Machine Learning Foundations (機器學習基石)
```

(Video 00:01–01:39 compares the per-iteration cost of the two iterative methods, 01:39–04:12 gives the idea of the stochastic gradient, 04:12–06:27 covers the pros and cons of SGD and the update rule, 06:27–08:37 compares it with PLA, 08:37–10:30 gives two rules of thumb, and Fun Time follows.)

### Two iterative schemes whose per-iteration costs differ by a factor of N

Page 8 puts PLA and logistic regression into one framework. Both are iterative optimization: for $t = 0, 1, \dots$, repeat

$$
\mathbf{w}_{t+1} \leftarrow \mathbf{w}_t + \eta\mathbf{v}
$$

and when stopping, return the last $\mathbf{w}$ as $g$. The difference is how much data each iteration looks at:

| | PLA | Logistic regression (pocket too) |
|---|---|---|
| How each iteration decides $\mathbf{w}_{t+1}$ | pick one $(\mathbf{x}_n, y_n)$ and decide by that one example | check the whole $\mathcal{D}$ and decide by all examples |
| Time per iteration | $O(1)$ | $O(N)$ |

The lower left of this page shows one frame of the PLA demonstration from the Foundations Lecture 2 handout (the one labelled update: 2): a misclassified point corrects $\mathbf{w}_t$ into $\mathbf{w}_{t+1}$. In the lecture, Lin says that whether there are a thousand examples or ten thousand, PLA looks at only one of them per iteration; logistic regression has to compute every point's contribution to the gradient and average them in each iteration, so for now it is as slow as pocket, because pocket also has to look through all $N$ examples in each iteration to know whether to replace the $\hat{\mathbf{w}}$ in its pocket. The page ends with the question: can we have logistic regression with $O(1)$ time per iteration?

### Viewing the average as an expectation

Page 9 first writes out the update rule from the previous lecture:

$$
\mathbf{w}_{t+1} \leftarrow \mathbf{w}_t + \eta\underbrace{\frac{1}{N}\sum_{n=1}^{N}\theta\big(-y_n\mathbf{w}_t^\top\mathbf{x}_n\big)\big(y_n\mathbf{x}_n\big)}_{-\nabla E_{\text{in}}(\mathbf{w}_t)}
$$

We want the update direction $\mathbf{v}$ to be close to $-\nabla E_{\text{in}}(\mathbf{w}_t)$, because the previous lecture's derivation showed that it is a good direction when $\eta$ is small enough; but we also want to compute it from a single $(\mathbf{x}_n, y_n)$. The obstacle is the $\frac{1}{N}\sum_{n=1}^{N}$ in front.

The handout's technique is to view it as an expectation: draw one $n$ uniformly at random from $1$ to $N$, so that each $n$ is drawn with probability $\frac{1}{N}$. Call the gradient of the error on a single example, $\nabla_{\mathbf{w}}\,\text{err}(\mathbf{w}, \mathbf{x}_n, y_n)$, the stochastic gradient. Its expectation is

$$
\mathop{\mathcal{E}}_{\text{random } n}\nabla_{\mathbf{w}}\,\text{err}(\mathbf{w}, \mathbf{x}_n, y_n) = \sum_{n=1}^{N}\frac{1}{N}\nabla_{\mathbf{w}}\,\text{err}(\mathbf{w}, \mathbf{x}_n, y_n) = \nabla_{\mathbf{w}}\Big(\frac{1}{N}\sum_{n=1}^{N}\text{err}(\mathbf{w}, \mathbf{x}_n, y_n)\Big) = \nabla_{\mathbf{w}}E_{\text{in}}(\mathbf{w})
$$

The first equality is the definition of expectation, the second swaps the gradient with the sum (a finite sum can be differentiated term by term), and the third is the definition of $E_{\text{in}}$. The two middle steps are added by this article; the handout writes only the two ends.

In the lecture, Lin explains it through sampling: you have ten thousand numbers to average and do not want to add them all up properly, so you draw a few at random, average those, and use that as an estimate. Here the idea is simply taken to the extreme, drawing only one.

### SGD: the stochastic gradient is the true gradient plus zero-mean noise

The first line of page 10 says the same thing another way:

$$
\text{stochastic gradient} = \text{true gradient} + \text{zero-mean ‘noise’ directions}
$$

Lin's analogy in the lecture is being drunk: you mean to walk in the direction of the gradient, and because of the random sampling one step veers a little left and the next a little right, but in expectation you head roughly where you intended.

Stochastic gradient descent (SGD) replaces the true gradient with the stochastic gradient. The handout lists four points:

- **Idea**: replace the true gradient by the stochastic gradient.
- **Justification**: after enough steps, average true gradient ≈ average stochastic gradient. In the lecture, Lin says the reasoning resembles ordinary sampling.
- **Pros**: simple, and cheaper to compute. Useful for big data, and also for online learning. Lin recalls the setting from [Foundations Lecture 3: Types of Learning](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-03-types-of-learning-en): if the data arrives one example at a time anyway, this method applies directly.
- **Cons**: less stable in nature. Lin adds in the lecture that it is even less stable when $\eta$ is too large: after taking a step, you do not know whether you have landed somewhere lower or higher.

The error of logistic regression on a single example is $\text{err}(\mathbf{w}, \mathbf{x}_n, y_n) = \ln(1 + \exp(-y_n\mathbf{w}^\top\mathbf{x}_n))$. The previous lecture computed its gradient with the chain rule: $\theta(-y_n\mathbf{w}^\top\mathbf{x}_n)(-y_n\mathbf{x}_n)$. So the SGD version of logistic regression just drops the $\frac{1}{N}\sum$ from the original update rule:

$$
\mathbf{w}_{t+1} \leftarrow \mathbf{w}_t + \eta\underbrace{\theta\big(-y_n\mathbf{w}_t^\top\mathbf{x}_n\big)\big(y_n\mathbf{x}_n\big)}_{-\nabla\text{err}(\mathbf{w}_t, \mathbf{x}_n, y_n)}
$$

The handout draws a smiley next to the formula: looks familiar?

### Side by side with PLA: a soft PLA

Page 11 stacks the two update rules:

$$
\begin{aligned}
\text{SGD logistic regression:}\quad & \mathbf{w}_{t+1} \leftarrow \mathbf{w}_t + \eta \cdot \theta\big(-y_n\mathbf{w}_t^\top\mathbf{x}_n\big)\big(y_n\mathbf{x}_n\big) \\
\text{PLA:}\quad & \mathbf{w}_{t+1} \leftarrow \mathbf{w}_t + 1 \cdot \llbracket y_n \ne \text{sign}(\mathbf{w}_t^\top\mathbf{x}_n) \rrbracket\big(y_n\mathbf{x}_n\big)
\end{aligned}
$$

Both correct in the direction of $y_n\mathbf{x}_n$, and only the coefficient in front differs. PLA's coefficient is 0 or 1: it updates only on a mistake and stays put when the point is correct. The coefficient of SGD logistic regression is $\theta(-y_n\mathbf{w}_t^\top\mathbf{x}_n)$, a continuous value between 0 and 1. The handout's two conclusions:

- **SGD logistic regression ≈ "soft" PLA.** In the lecture, Lin explains that it looks at how wrong the point is: a bigger mistake gets a bigger update, a smaller mistake a smaller one.
- **PLA ≈ SGD logistic regression with $\eta = 1$ when $\mathbf{w}_t^\top\mathbf{x}_n$ is large.** Lin explains that when the absolute value of the score is large, $\theta$ is either very close to 0 or very close to 1. This article separates the two cases: when the point is correct, $y_ns$ is a large positive number, $\theta(-y_ns) \approx 0$, and there is almost no update; when it is wrong, $y_ns$ is very negative, $\theta(-y_ns) \approx 1$, and the update is almost exactly $y_n\mathbf{x}_n$. That is precisely how PLA behaves.

The same page has two practical rules of thumb:

- **Stopping condition?** Stop when $t$ is large enough. In the lecture, Lin explains why we do not check the gradient: gradient descent can look at whether the true gradient is near zero, but SGD exists to save the effort of computing the true gradient, and computing it now would throw away what was just saved. So most people simply run long enough and then trust that they are near the bottom of the valley; Lin stresses that this is only a belief, and running long enough does not guarantee reaching the bottom.
- **$\eta$?** Use 0.1 when $\mathbf{x}$ is in a proper range. Lin calls this a little secret from experience and says not to ask how it was calculated; a later lecture covers how to choose $\eta$ as a parameter. Lin also mentions a personal habit of using 0.1126, and that values around 0.1 generally do well.

### Numerical example: stochastic gradients on the five patients

What follows is an example made up for this article, not from the slides; the numbers were verified with Python. The data is still the five patients from above, with $\eta = 0.1$.

**The five stochastic gradients at $\mathbf{w}_0 = (0, 0)$.** Every example has score 0 and $\theta(0) = 0.5$, so the update direction (the negative stochastic gradient) when example $n$ is drawn is $0.5\,y_n\mathbf{x}_n$:

| Drawn $n$ | $(x_1, y_n)$ | Negative stochastic gradient $0.5\,y_n\mathbf{x}_n$ | Noise after subtracting the mean |
|---|---|---|---|
| 1 | $(-2, -1)$ | $(-0.5, 1.0)$ | $(-0.4, 0.6)$ |
| 2 | $(-1, -1)$ | $(-0.5, 0.5)$ | $(-0.4, 0.1)$ |
| 3 | $(0, +1)$ | $(0.5, 0)$ | $(0.6, -0.4)$ |
| 4 | $(1, -1)$ | $(-0.5, -0.5)$ | $(-0.4, -0.9)$ |
| 5 | $(2, +1)$ | $(0.5, 1.0)$ | $(0.6, 0.6)$ |

The mean of the five directions is $(-0.1, 0.4)$, exactly the $-\nabla E_{\text{in}}(\mathbf{w}_0)$ computed in the previous lecture. The noise in the rightmost column sums to $(0, 0)$, which is what "zero-mean" means. But no single example equals the true gradient: when example 4 is drawn, the $w_1$ direction is even opposite to the true gradient.

**Three steps in a row.** Suppose examples 5, 4, and 3 are drawn in that order:

| Step | Drawn | $s = \mathbf{w}_t^\top\mathbf{x}_n$ | $\theta(-y_ns)$ | $\mathbf{w}_{t+1}$ after the update | $E_{\text{in}}(\mathbf{w}_{t+1})$ |
|---|---|---|---|---|---|
| 1 | example 5 | $0$ | 0.5 | $(0.05, 0.1)$ | 0.6610 |
| 2 | example 4 | $0.15$ | 0.5374 | $(-0.0037, 0.0463)$ | 0.6748 |
| 3 | example 3 | $-0.0037$ | 0.5009 | $(0.0464, 0.0463)$ | 0.6801 |

How step 2 is computed: $\mathbf{w}_1 = (0.05, 0.1)$; example 4 has $\mathbf{x} = (1, 1)$ and $y = -1$, the score is $0.15$, $\theta(0.15) = 0.5374$, and $\mathbf{w}_2 = (0.05, 0.1) + 0.1 \times 0.5374 \times (-1)(1, 1) = (-0.0037, 0.0463)$.

$E_{\text{in}}$ at the starting point is $\ln 2 \approx 0.6931$. Step 1 lowers it to 0.6610, but steps 2 and 3 raise it twice in a row. Gradient descent in the previous lecture, starting from the same point, had $E_{\text{in}}$ of 0.6766, 0.6615, and 0.6479 over three steps, decreasing every time. The handout's "less stable" is visible here: each step answers only for the example that was drawn, and the overall $E_{\text{in}}$ may get worse.

**Running longer.** With Python's `random.seed(1126)`, drawing one example per step with `random.randrange(5)`, for ten thousand steps:

| Step $t$ | $\mathbf{w}_t$ | $E_{\text{in}}(\mathbf{w}_t)$ |
|---|---|---|
| 10 | $(0.0061, 0.3254)$ | 0.5897 |
| 100 | $(-0.5823, 0.9337)$ | 0.4872 |
| 1,000 | $(-0.5859, 0.9496)$ | 0.4866 |
| 10,000 | $(-0.7702, 1.1346)$ | 0.4859 |

The bottom of the valley is $\mathbf{w} \approx (-0.6227, 1.0904)$ with $E_{\text{in}} \approx 0.4844$. SGD gets near the bottom in a hundred steps and then does not stay there: over the last thousand steps $E_{\text{in}}$ moves back and forth between 0.4844 and 0.5582, and $w_0$ wanders between $-1.29$ and $-0.31$. The reason is that although the true gradient at the bottom is zero, the stochastic gradient of a single example is not, so every step still pushes away from the bottom. What "run long enough and stop" actually yields is a $\mathbf{w}$ wandering near the bottom like this.

Comparing cost: 100 steps of SGD compute only 100 single-example gradients and reach $E_{\text{in}}$ of 0.4872; gradient descent, with the same 100 single-example gradients, can take only 20 steps and reaches $E_{\text{in}}$ of 0.5365. This is the result for one random seed and five examples; another seed gives different numbers, so it cannot be taken as a general conclusion.

**One step compared with PLA.** Start from $\mathbf{w}_{\text{LIN}} = (-0.2, 0.4)$ (that is, follow the handout's suggestion and use the linear regression solution as $\mathbf{w}_0$):

| Drawn | $y_ns$ | SGD coefficient $\theta(-y_ns)$ | After the SGD update ($\eta = 0.1$) | After the PLA update |
|---|---|---|---|---|
| example 4 (wrong) | $-0.2$ | 0.5498 | $(-0.255, 0.345)$ | $(-1.2, -0.6)$ |
| example 1 (correct) | $1.0$ | 0.2689 | $(-0.2269, 0.4538)$ | unchanged, $(-0.2, 0.4)$ |

On the correctly classified example 1, SGD still updates, just with a smaller coefficient; PLA does not move at all. Now scale $\mathbf{w}$ up to $(-6, 11)$: example 1 has $y_ns = 28$ and a coefficient of $7 \times 10^{-13}$, effectively no update; the misclassified example 3 has $y_ns = -6$ and a coefficient of 0.9975; the misclassified example 4 has $y_ns = -5$ and a coefficient of 0.9933. The coefficients are almost down to 0 and 1, like PLA's indicator function, which is the handout's line "PLA ≈ SGD logistic regression when $\mathbf{w}_t^\top\mathbf{x}_n$ large".

### Fun Time: the SGD direction for linear regression

**Question (page 12):** Consider applying SGD on linear regression for big data. What is the update direction when using the negative stochastic gradient?

1. $\mathbf{x}_n$
2. $y_n\mathbf{x}_n$
3. $2(\mathbf{w}_t^\top\mathbf{x}_n - y_n)\mathbf{x}_n$
4. $2(y_n - \mathbf{w}_t^\top\mathbf{x}_n)\mathbf{x}_n$

**Answer: 4.** The error of linear regression on a single example is $\text{err}(\mathbf{w}, \mathbf{x}_n, y_n) = (\mathbf{w}^\top\mathbf{x}_n - y_n)^2$. By the chain rule, differentiating the outer square gives $2(\mathbf{w}^\top\mathbf{x}_n - y_n)$ and differentiating the inner $\mathbf{w}^\top\mathbf{x}_n$ with respect to $\mathbf{w}$ gives $\mathbf{x}_n$, so the gradient is $2(\mathbf{w}^\top\mathbf{x}_n - y_n)\mathbf{x}_n$. The update direction is the negative gradient, and swapping the order inside the parentheses gives choice 4.

Choice 3 is the gradient itself without the minus sign; following it makes $E_{\text{in}}$ larger. Choice 2 is the correction direction of PLA and logistic regression, with no residual magnitude. Choice 1 does not even use the label.

The handout's answer adds a physical interpretation: the correction is proportional to the residual $y_n - \mathbf{w}_t^\top\mathbf{x}_n$. In the lecture, Lin says this too is an update in the direction of $\mathbf{x}_n$, and the bigger the mistake (the farther $y_n$ is from the current score) the bigger the update. Lin also explains why one would want to do this: when the data is too large to compute the solution in one shot with the pseudo-inverse, SGD can be used instead.

A check for this article: on the five patients, take an arbitrary $\mathbf{w} = (0.3, -0.2)$; the mean of the five $2(\mathbf{w}^\top\mathbf{x}_n - y_n)\mathbf{x}_n$ is $(1.0, -2.4)$, the same as what the Foundations Lecture 9 formula $\nabla E_{\text{in}}(\mathbf{w}) = \frac{2}{N}(X^\top X\mathbf{w} - X^\top\mathbf{y})$ gives.

## From yes/no questions to multiple choice: OVA, one class at a time

```youtube
url: https://www.youtube.com/watch?v=wnM435PDHGY
title: Linear Models for Classification :: Multiclass via Logistic @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–01:18 poses the multiclass problem, 01:18–03:12 separates one class at a time, 03:12–05:59 covers the trouble with combining four binary classifiers, 05:59–09:38 switches to soft classifiers, 09:38–13:30 covers the OVA algorithm and its pros and cons, and Fun Time follows.)

### A four-class problem

Page 13 changes the problem: the output space is $\mathcal{Y} = \{\square, \Diamond, \triangle, \star\}$, four classes: squares, diamonds, triangles, and stars. In the figure the squares are at the upper right, the diamonds at the upper left, the triangles at the lower left, and the stars at the lower right. In the lecture, Lin describes the change as going from yes/no questions to multiple-choice questions, and recalls Foundations Lecture 3: multiclass classification shows up everywhere in practice, especially in recognition problems such as vision and audio.

What this section and the next will do is written at the bottom of the page: use the tools for circle-and-cross classification on classifying the four symbols.

### One yes/no question at a time

Page 14 asks about only one class at a time. First ask "square or not?": treat the squares as circles and the other three classes as crosses, and you have a binary classification problem whose solution is a line cutting off the upper-right corner. Lin compares it to answering a multiple-choice question: with four choices and no idea which to pick, you first judge "is it the first choice, or not". Doing the same for diamonds, triangles, and stars gives four binary classifiers.

Page 15 overlays the results of the four classifiers. In the lecture, Lin describes three kinds of regions:

- **Regions where exactly one classifier says "yes".** For example, around the upper-right corner only the square classifier says circle and the other three say cross. These regions are unambiguous.
- **Regions where two classifiers both say "yes".** For example, in the band between the squares and the diamonds, both classifiers claim the point as theirs.
- **The region where all four classifiers say "no".** In the very middle of the figure, no classifier claims the point.

In the last two kinds of regions there is no way to decide which class to predict. The handout leaves only one line on this page, "but ties? :-)", and the figure draws those regions as speckles.

### Switching to soft classifiers

The title of page 16 has one more word: One Class at a Time **Softly**. Lin's idea in the lecture is to stop answering only yes or no and answer how likely it is instead, which is exactly what logistic regression does. Run logistic regression once with squares as circles and the rest as crosses, and you get an estimate of $P(\square \mid \mathbf{x})$; the boundary that used to be a clean cut becomes a gradient in the figure, with darker color meaning higher likelihood and a blurry zone near the boundary where the probability is close to 0.5.

Run it once per class and there are four probability estimates. Page 17 combines them by picking the class with the highest estimated probability. The numbers Lin gives in the lecture: if the four classifiers answer 0.7, 0.2, 0.05, and 0.05, you of course pick the one with 0.7. As a formula:

$$
g(\mathbf{x}) = \mathop{\text{argmax}}_{k \in \mathcal{Y}}\ \theta\big(\mathbf{w}_{[k]}^\top\mathbf{x}\big)
$$

$\mathbf{w}_{[k]}$ is the weight vector of the classifier for class $k$. On the slide $\theta$ is in gray, and Lin explains why: the logistic function is monotonic, so a larger score means a larger probability and the outcome of the comparison does not change; at prediction time there is no need to actually compute $\theta$, and comparing the scores $\mathbf{w}_{[k]}^\top\mathbf{x}$ is enough.

With this, both troublesome kinds of regions get an answer: where two classifiers say yes, compare whose score is higher; where all four say no, pick the one that "denies the least". The speckles in the figure disappear and the whole plane is divided into four pieces.

### The OVA algorithm

Page 18 writes the procedure above as One-Versus-All (OVA) Decomposition:

1. For each $k \in \mathcal{Y}$, obtain $\mathbf{w}_{[k]}$ by running logistic regression on this relabelled data:

$$
\mathcal{D}_{[k]} = \big\{(\mathbf{x}_n,\ y'_n = 2\llbracket y_n = k \rrbracket - 1)\big\}_{n=1}^{N}
$$

2. Return $g(\mathbf{x}) = \mathop{\text{argmax}}_{k \in \mathcal{Y}}\big(\mathbf{w}_{[k]}^\top\mathbf{x}\big)$.

$2\llbracket y_n = k \rrbracket - 1$ is just a way of writing the label as $\pm 1$: when $y_n$ is class $k$ the indicator is 1 and $y'_n = +1$; otherwise the indicator is 0 and $y'_n = -1$. $\mathbf{x}_n$ does not change at all, and all $N$ examples are still there. In the lecture, Lin explains the name as one class versus all the other classes, and the method as decomposing a multiclass problem into several binary classification problems.

The pros and cons listed in the handout, with the explanations from the lecture:

- **Pros: efficient.** It can be coupled with any logistic regression-like approaches. Lin states the condition more clearly in the lecture: a method fits in as long as it outputs a value between 0 and 1, or some other real number that can be compared.
- **Cons: often unbalanced $\mathcal{D}_{[k]}$ when $K$ is large.** Lin takes the case of 100 classes with about the same amount of data each: every subproblem has only 1% circles and 99% crosses, and a hypothesis that always guesses cross is 99% accurate. You might end up with a hundred hypotheses that all love guessing cross, and at prediction time you are merely picking the highest score among them, which need not perform well.
- **Extension: multinomial ("coupled") logistic regression.** Lin adds that OVA estimates its $K$ probabilities separately and does not require them to sum to 1; statistics has a more systematic multiclass extension that builds this condition in and may give better estimates. This course only mentions the name, and those interested can read about it on their own.

The handout's closing comment: OVA is a simple multiclass meta-algorithm to keep in your toolbox.

### Numerical example: four classes, three test points

What follows is an example made up for this article, not from the slides. The four classes are placed as in the handout's figure: squares at the upper right, diamonds at the upper left, triangles at the lower left, stars at the lower right, with $\mathbf{x} = (1, x_1, x_2)$. Suppose the four runs of logistic regression produced the four weight vectors below; these numbers were set by this article to keep the arithmetic easy and were not obtained by training:

| Class $k$ | $\mathbf{w}_{[k]}$ | Score $\mathbf{w}_{[k]}^\top\mathbf{x}$ |
|---|---|---|
| Square | $(-1, 1, 1)$ | $x_1 + x_2 - 1$ |
| Diamond | $(-1, -1, 1)$ | $-x_1 + x_2 - 1$ |
| Triangle | $(-1, -1, -1)$ | $-x_1 - x_2 - 1$ |
| Star | $(-1, 1, -1)$ | $x_1 - x_2 - 1$ |

Compute the four scores for each of three test points; the probability estimate after $\theta$ is in parentheses:

| Test point $(x_1, x_2)$ | Square | Diamond | Triangle | Star | How many say "yes" | Sum of the four probabilities |
|---|---|---|---|---|---|---|
| $(1.5, 1)$ | $1.5$ (0.818) | $-1.5$ (0.182) | $-3.5$ (0.029) | $-0.5$ (0.378) | 1 | 1.407 |
| $(0.2, 2)$ | $1.2$ (0.769) | $0.8$ (0.690) | $-3.2$ (0.039) | $-2.8$ (0.057) | 2 | 1.555 |
| $(0.2, 0.3)$ | $-0.5$ (0.378) | $-0.9$ (0.289) | $-1.5$ (0.182) | $-1.1$ (0.250) | 0 | 1.099 |

Taking the second point as an example: the square score is $0.2 + 2 - 1 = 1.2$ and $\theta(1.2) = 0.769$; the diamond score is $-0.2 + 2 - 1 = 0.8$ and $\theta(0.8) = 0.690$.

**What this result means.**

- If each classifier only answered yes or no (saying yes only when the score is above 0), the first point would be unambiguous; at the second point both square and diamond say yes, which is the tie on page 15; and no classifier claims the third point.
- After comparing scores, all three points are predicted as square. The second point is settled by $1.2 > 0.8$, and the third picks the one among four negative scores that is closest to 0.
- Comparing scores and comparing probabilities give the same result because $\theta$ is monotonic, so $\theta$ can be skipped at prediction time.
- The four probabilities sum to 1.407, 1.555, and 1.099, none of which is 1. This is what Lin says in the lecture: OVA estimates each class's probability separately and does not require the total to be 1.

Now look at the proportions in the training data. Suppose there are 8 training examples, 2 per class. $\mathcal{D}_{[\text{square}]}$ still has 8 examples, of which 2 are $+1$ and 6 are $-1$, a ratio of 1 to 3. With 100 classes and the same amount of data in each, the ratio is 1 to 99.

### Fun Time: how much training effort OVA takes

**Question (page 19):** Which of the following best describes the training effort of OVA decomposition based on logistic regression on some $K$-class classification data of size $N$?

1. learn $K$ logistic regression hypotheses, each from data of size $N/K$
2. learn $K$ logistic regression hypotheses, each from data of size $N\ln K$
3. learn $K$ logistic regression hypotheses, each from data of size $N$
4. learn $K$ logistic regression hypotheses, each from data of size $NK$

**Answer: 3.** In the definition of $\mathcal{D}_{[k]}$, $n$ runs from 1 to $N$; every example is there and only the label changes, so each subproblem has size $N$. Lin's explanation in the lecture: each example is not much different from the original, only its label has been swapped.

Choice 1 is the size you get by cutting the data up by class, but every OVA subproblem needs the other classes' data as crosses and cannot use only its own class. The $\ln K$ in choice 2 comes from nowhere. Choice 4 adds up the data of all $K$ subproblems rather than giving the size of each.

The handout's answer also notes that the $K$ subproblems are independent of one another and easy to run in parallel. In the lecture, Lin says that with many machines you can assign them to different machines.

## Letting classes fight in pairs: OVO and the tournament champion

```youtube
url: https://www.youtube.com/watch?v=vxnjOI_ASlw
title: Linear Models for Classification :: Multiclass via Binary @ Machine Learning Foundations (機器學習基石)
```

(Video 00:01–00:41 reviews the imbalance of OVA, 00:41–02:32 compares only two classes at a time, 02:32–06:16 combines six classifiers by voting, 06:16–08:58 covers the OVO algorithm and its pros and cons, 08:58–09:59 is Fun Time, and the summary of the whole lecture follows.)

### Where the imbalance comes from

The title of page 20 is Source of Unbalance: One versus **All**. Every OVA subproblem pits one class against all the rest, and Lin uses a fight as the analogy: one has to fight many, there are few circles and many crosses, and so it is unbalanced. The fix follows the analogy: one against many is unfair, so make it one on one. The handout puts it as: make binary classification problems more balanced by one versus **one**.

### Comparing only two classes at a time

Page 21 picks out only two classes to compare each time. Take "square or diamond?": squares are circles, diamonds are crosses, and the triangle and star data are marked nil and not used in this round. The solution is a line that divides the plane into a "more like a square" side and a "more like a diamond" side. In the lecture, Lin says that if the classes originally have roughly equal amounts of data, this binary classification problem will be balanced too.

Choosing two out of four classes can be done in $\binom{4}{2} = 6$ ways, and the handout's six figures are, in order: square versus diamond, square versus triangle, square versus star, diamond versus triangle, diamond versus star, triangle versus star.

### How six classifiers combine into one prediction

Page 22 combines the six classifiers. In the lecture, Lin first looks at the three classifiers that involve squares (the three trained with square data): in the region near the squares, all three give their vote to square, and from those three alone you know that area is probably square.

Then comes a baseball analogy: the four classes are like four baseball teams and the six classifiers are their round-robin, each game deciding which of two teams is better, and in the end you see who is the overall champion. Lin picks a test point on the figure, and the results of the six games are:

| Game | Winner |
|---|---|
| Square versus diamond | Square |
| Square versus triangle | Square |
| Square versus star | Square |
| Diamond versus triangle | Diamond |
| Diamond versus star | Star |
| Triangle versus star | Star |

Square wins three games, star wins two, diamond wins one, and triangle loses them all, so this point is predicted as square. Lin singles out the fourth game: the diamond-versus-triangle classifier was not trained with square data at all, yet it still takes a position on this point. Playing six games like this for every point gives the figure at the upper right of page 22 that divides the plane into four pieces. The handout's formula is

$$
g(\mathbf{x}) = \text{tournament champion}\big\{\mathbf{w}_{[k,\ell]}^\top\mathbf{x}\big\}
$$

with a note underneath, voting of classifiers: it can also be seen as the six classifiers casting votes.

### The OVO algorithm

Page 23 writes it as One-versus-one (OVO) Decomposition:

1. For each $(k, \ell) \in \mathcal{Y} \times \mathcal{Y}$, obtain $\mathbf{w}_{[k,\ell]}$ by running linear binary classification on this data:

$$
\mathcal{D}_{[k,\ell]} = \big\{(\mathbf{x}_n,\ y'_n = 2\llbracket y_n = k \rrbracket - 1) : y_n = k \text{ or } y_n = \ell\big\}
$$

2. Return $g(\mathbf{x}) = \text{tournament champion}\big\{\mathbf{w}_{[k,\ell]}^\top\mathbf{x}\big\}$.

Compared with OVA's $\mathcal{D}_{[k]}$, the label is written the same way (class $k$ is $+1$); the difference is the condition after the colon: only the data belonging to $k$ or $\ell$ is kept, and then whatever is not $k$ must be $\ell$ and is labelled $-1$.

The handout writes the range of $(k, \ell)$ as $\mathcal{Y} \times \mathcal{Y}$, which read literally is all ordered pairs. What Lin says aloud in the lecture is more precise: strictly speaking the number of classifiers is $K$ choose 2, that is, $\binom{K}{2} = \frac{K(K-1)}{2}$. $(\ell, k)$ and $(k, \ell)$ are the same game, and $(k, k)$ has no opponent.

The pros and cons listed in the handout, with the explanations from the lecture:

- **Pros: efficient, because of "smaller" training problems.** Lin first raises the question on the students' behalf: four classes already need six classifiers, so how is that efficient? The answer is that each classifier uses the data of only two classes, as if the rest were thrown away, so each problem solved is a smaller one.
- **Pros: stable.** Lin's explanation is that the tournament uses many different ways of classifying and then decides by vote, like a democratic mechanism.
- **Pros: can be coupled with any binary classification approaches.** In the lecture, Lin only says this point is the same as for OVA: very general. An addition in this article on the difference in wording between the two slides: the OVA page says logistic regression-like approaches, because OVA has to compare whose output is larger across classifiers, so the classifiers must output values that can be compared; OVO only needs each classifier to cast one vote, so step 1 on this page says linear binary classification, and PLA and pocket, which output only $\pm 1$, can be used too. The two section titles are divided the same way: this section is Multiclass via Binary Classification, the previous one via Logistic Regression.
- **Cons: uses $O(K^2)$ of the $\mathbf{w}_{[k,\ell]}$.** The handout lists three consequences: more space, slower prediction, more training. Lin takes four classes as the example: six $\mathbf{w}$ take six times the effort to store, and at prediction time all six scores must be computed before you know the winner; in training, if you want to run in parallel, you also need a few more machines.

Lin's overall assessment in the lecture is that when the number of classes is not very large, OVO is a simple and commonly used method. The handout's closing line pairs with the OVA page: another simple multiclass meta-algorithm to keep in your toolbox.

### Numerical example: the same test points with OVO

What follows is an example made up for this article, not from the slides. It keeps the four classes and their placement from the OVA example. The six pairwise classifiers are likewise set by this article and were not trained; $\mathbf{x} = (1, x_1, x_2)$, and a score above 0 gives the vote to the class named first:

| Classifier $[k, \ell]$ | $\mathbf{w}_{[k,\ell]}$ | Score | Meaning |
|---|---|---|---|
| Square versus diamond | $(0, 1, 0)$ | $x_1$ | right side is square |
| Square versus triangle | $(0, 1, 1)$ | $x_1 + x_2$ | upper right is square |
| Square versus star | $(0, 0, 1)$ | $x_2$ | upper side is square |
| Diamond versus triangle | $(0, 0, 1)$ | $x_2$ | upper side is diamond |
| Diamond versus star | $(0, -1, 1)$ | $-x_1 + x_2$ | upper left is diamond |
| Triangle versus star | $(0, -1, 0)$ | $-x_1$ | left side is triangle |

For $(0.2, 0.3)$, the point none of the four classifiers claimed in the OVA example, and for a new point $(-1.5, -0.5)$, play six games each:

| Game | Score at $(0.2, 0.3)$ | Winner | Score at $(-1.5, -0.5)$ | Winner |
|---|---|---|---|---|
| Square versus diamond | $0.2$ | Square | $-1.5$ | Diamond |
| Square versus triangle | $0.5$ | Square | $-2.0$ | Triangle |
| Square versus star | $0.3$ | Square | $-0.5$ | Star |
| Diamond versus triangle | $0.3$ | Diamond | $-0.5$ | Triangle |
| Diamond versus star | $0.1$ | Diamond | $1.0$ | Diamond |
| Triangle versus star | $-0.2$ | Star | $1.5$ | Triangle |

The vote count for the first point is square 3, diamond 2, star 1, triangle 0, so it is predicted as square; for the second point it is triangle 3, diamond 2, star 1, square 0, so it is predicted as triangle.

**What this result means.**

- A class plays at most $K - 1 = 3$ games; 3 votes means winning them all, which makes it the champion for certain. The champion at both points won all its games.
- In OVA no classifier said yes at $(0.2, 0.3)$, and only comparing scores could decide it; in OVO every game answers a two-way choice, the vote count decides, and the classifiers do not need to output probabilities.
- The proportions in the training data differ too. Keeping the assumption of 2 examples per class and 8 in total: each OVA subproblem has 8 examples at 2 to 6; each OVO subproblem has 4 examples at 2 to 2.

An addition in this article: the handout does not discuss equal vote counts in OVO, but they can happen. With three classes, if A beats B, B beats C, and C beats A, each class gets one vote, and a separate rule is needed to decide, for example comparing the sums of the scores.

### Fun Time: how much CPU time OVO takes

**Question (page 24):** Assume that some binary classification algorithm takes exactly $N^3$ CPU-seconds for data of size $N$. Also, for some 10-class multiclass classification problem, assume that there are $N/10$ examples for each class. Which of the following is the total CPU-seconds needed for OVO decomposition based on the binary classification algorithm?

1. $\frac{9}{200}N^3$
2. $\frac{9}{25}N^3$
3. $\frac{4}{5}N^3$
4. $N^3$

**Answer: 2.** Pairing up 10 classes gives $\binom{10}{2} = 45$ classifiers. Each uses the data of only two classes, of size $\frac{2N}{10} = \frac{N}{5}$, and takes $\big(\frac{N}{5}\big)^3 = \frac{N^3}{125}$ seconds. In total

$$
45 \times \frac{N^3}{125} = \frac{9}{25}N^3
$$

In choice 1, $\frac{9}{200} = 45 \times \frac{1}{1000}$, which mistakes the size of each subproblem for $\frac{N}{10}$ (counting only one class). Choice 4 is the time for running once on all the data, with no decomposition at all. Choice 3 does not match a sensible calculation of any kind.

The handout's answer computes OVA along the way: 10 classifiers, each using all $N$ examples, take $10N^3$ seconds, much worse than OVO. In the lecture, Lin says there is no getting around that.

An addition in this article: generalizing this question to $K$ classes with $N/K$ examples each shows where OVO saves. If the algorithm's time is $N^p$:

$$
\text{OVO:}\ \frac{K(K-1)}{2}\Big(\frac{2N}{K}\Big)^p, \qquad \text{OVA:}\ K \cdot N^p
$$

| Algorithm's time | OVO ($K = 10$) | OVA ($K = 10$) |
|---|---|---|
| $N$ | $9N$ | $10N$ |
| $N^2$ | $\frac{9}{5}N^2$ | $10N^2$ |
| $N^3$ | $\frac{9}{25}N^3$ | $10N^3$ |

If the algorithm runs in linear time the two are almost the same; the faster the time grows, the greater the benefit of smaller subproblems. This table counts training time only. At prediction time OVO computes 45 scores and OVA only 10, so the handout's "more space, slower prediction" is unaffected by this conclusion.

### The lecture in four lines

The summary on page 25 reduces each of the four sections to one line: three models useful in different ways; SGD follows the negative stochastic gradient; OVA predicts with the class of maximum estimated $P(k \mid \mathbf{x})$; OVO predicts the tournament champion. Wrapping up in the lecture, Lin says that every method introduced up to this lecture is linear, each with a $\mathbf{w}$ in its head that it combines with $\mathbf{x}$ to compute a score and then use; the next lecture moves from linear to nonlinear, producing classification boundaries that are quadratic and cubic curves. The preview on the handout is next: from linear to nonlinear.

## Self-check

**1. An example has $y = -1$ and the model computes the score $s = 0.4$. Compute the four errors and point out which one is smaller than the 0/1 error.**

Answer: $ys = -0.4$. The 0/1 error is 1 (misclassified); the squared error is $(-0.4 - 1)^2 = 1.96$; the cross-entropy is $\ln(1 + e^{0.4}) \approx 0.9130$; the scaled cross-entropy is $0.9130 / \ln 2 \approx 1.3172$. Only the cross-entropy is smaller than the 0/1 error, because $-0.4$ falls in the stretch $-0.541 < ys \le 0$.

**2. Some $\mathbf{w}$ has $E_{\text{in}}^{\text{CE}}$ equal to 0.3. What is its $E_{\text{in}}^{0/1}$ at most? What if $E_{\text{in}}^{\text{CE}}$ is 0.8? Also explain why "the $\mathbf{w}$ with the smallest cross-entropy" is not necessarily "the $\mathbf{w}$ with the smallest 0/1 error".**

Answer: $0.3 / \ln 2 \approx 0.433$; $0.8 / \ln 2 \approx 1.154$, which exceeds 1, so this upper bound provides no information. Criterion for the second part: you should say that the inequality only guarantees the 0/1 error does not exceed the upper bound and says nothing about the two having the same minimizer; better still if you can cite the five-patient example ($\mathbf{w}_{\text{LOG}}$ has 0/1 error 0.4, $(0.5, 1)$ has 0.2, yet the latter has the larger cross-entropy).

**3. $\mathbf{w}_t = (0, 1)$, the drawn example is $\mathbf{x}_n = (1, 2)$ with $y_n = -1$, and $\eta = 0.1$. Compute $\mathbf{w}_{t+1}$ for SGD logistic regression, then $\mathbf{w}_{t+1}$ for PLA.**

Answer: the score is $s = 2$ and $y_ns = -2$, a mistake. The SGD coefficient is $\theta(2) \approx 0.8808$, and $\mathbf{w}_{t+1} = (0, 1) + 0.1 \times 0.8808 \times (-1)(1, 2) = (-0.0881, 0.8238)$. PLA updates because of the mistake: $\mathbf{w}_{t+1} = (0, 1) + (-1)(1, 2) = (-1, -1)$. The two move in the same direction, and the SGD step is $0.1 \times 0.8808 \approx 0.088$ times the length of the PLA step.

**4. $K = 5$ classes, $N = 1{,}000$ examples, 200 per class. How many classifiers do OVA and OVO each train? How many examples does each subproblem have, and what is the positive-to-negative ratio? If the binary classification algorithm takes $N^2$ time, what is the total training time of each?**

Answer: OVA has 5 classifiers, each with 1,000 examples at a positive-to-negative ratio of 200 to 800, for a total time of $5N^2$. OVO has $\binom{5}{2} = 10$ classifiers, each with 400 examples at a ratio of 200 to 200; each takes $(0.4N)^2 = 0.16N^2$, for a total time of $1.6N^2$.

**5. Why can OVA skip computing $\theta$ at prediction time? Why do OVA's $K$ probability estimates not necessarily sum to 1? Why can OVO be paired with PLA while OVA is not suited to it?**

Criterion: the first part should mention that $\theta$ is monotonically increasing, so the ordering of the scores is the same as the ordering of the probabilities. The second part should say that the $K$ logistic regressions are trained independently, each on its own relabelled data, and no step requires the total to be 1; better still if you mention that multinomial logistic regression builds this condition in. The third part should say that each OVO classifier only needs to cast one vote (outputting $\pm 1$ is enough), whereas OVA has to compare whose output is largest among the $K$ classifiers, and outputs of only $\pm 1$ run into ties or points nobody claims.

## Exercises and corresponding reading

**How the two semesters line up.** The [Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) schedules Foundations Lectures 11 and 12 in the same week (W6, 10/07), and the slides for this lecture are [11u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/11u_handout.pdf). The [Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) schedules it in W6 (10/14); when checked on 2026-09-30, that week's slide link still returned 404. This article uses only the MOOC handout and does not compare the two versions page by page. This lecture's four videos are numbers 42 to 45 in the official playlist.

**Textbook.** Both course pages map this lecture to Section 3.3 of [Learning from Data](http://amlbook.com) (LFD).

**Homework.** The related problems are in [Fall 2024 HW4](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf) (released 2024-10-21, due 11-04, 12 problems plus 1 bonus; Q1–4 are auto-graded multiple-choice questions and Q5–12 are graded by the TAs), with no official solutions:

- **Q2**: a PLA variant that updates on all misclassified points together, and which pointwise error it amounts to running gradient descent on. It corresponds to this lecture's comparison of error functions and the "soft PLA".
- **Q3**: an asymmetric squared error in which overestimating is worse than underestimating; find the SGD update direction. The method is the same as in "Fun Time: the SGD direction for linear regression": write the single-example error first, then differentiate.
- **Q6–7**: the problems say "In Lecture 11" explicitly and ask you to derive the SGD direction of multinomial logistic regression, and how its solution relates to that of binary logistic regression when $K = 2$. This is the content of the "extension" on the OVA page.
- **Q10**: with the [cpusmall_scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/regression/cpusmall_scale) data (from the public LIBSVM datasets) and $N = 64$, implement SGD for linear regression (the problem specifies following pages 10 and 12 of Lecture 11) with $\eta = 0.01$ for 100,000 iterations and compare it with the closed-form solution; the experiment is to be repeated 1126 times with different random seeds. A way to check yourself: the SGD $E_{\text{in}}$ curve should approach the horizontal line of the closed-form solution.

In the same assignment, Q1 and Q5 belong to Foundations Lecture 10, Q4 and Q11–13 to Foundations Lecture 12, and Q8–9 to Foundations Lecture 13. The guide to the whole assignment is in the [Foundations homework guide](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide-en).

**Hands-on.** Three things directly reproduce this article's numbers: plot the three errors and the scaled cross-entropy on one $ys$ plot and compare it with page 4 of the handout; change the previous lecture's gradient descent to draw one example at random per step, plot $E_{\text{in}}$ against the step count on the five patients, and watch how it wanders near the bottom of the valley; write the update rules of SGD logistic regression and PLA on one line and confirm you can see $\theta(-ys)$ taking the place of the indicator function.

**Further reading.** Other treatments of the same material: [Stanford CS229 Lecture 3: Maximum Likelihood and Logistic Regression](/posts/ai/2026-10-12-stanford-cs229-lecture-03-probabilistic-view-logistic-regression-en), [Berkeley CS189 Lectures 11–12: classification and logistic regression](/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-11-12-classification-logistic-en).

**Next lecture.** [Foundations Lecture 12: Nonlinear Transformation](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-12-nonlinear-transformation-en) deals with the case this lecture leaves untouched: whether these linear models can still be used when no straight line separates the data well.

## Course video sources

Original videos: [Linear Models for Binary Classification](https://www.youtube.com/watch?v=qXfDVHVzI38), [Stochastic Gradient Descent](https://www.youtube.com/watch?v=9HL3YvmrovQ), [Multiclass via Logistic Regression](https://www.youtube.com/watch?v=wnM435PDHGY), [Multiclass via Binary Classification](https://www.youtube.com/watch?v=vxnjOI_ASlw)

- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

Checked: 2026-10-13. The video IDs, titles, and lengths were taken from the official playlist that day; the videos have no caption track on YouTube, and what this article reports from the lecture comes from transcripts made for it.

## Update Log

- 2026-10-10: Marked the video status and checked the recording sources and how they were obtained.
- 2026-10-10: Rechecked the video status. The embedded videos match the lecture numbering of the official playlist.
- 2026-10-13: This was originally one article together with Lecture 12 and is now one article per lecture. This article covers only Foundations Lecture 11 and was rewritten from the handout and the video transcripts.

## References

- [Foundations Lecture 11 handout, 11_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/11_handout.pdf): the main source for this article. The derivations in the four sections, the four Fun Time questions, and the figures on pages 4, 15, 17, and 22 all come from this handout.
- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf): the IDs and titles of the four videos; what the text reports as said "in the lecture" is paraphrased from machine transcripts of these four videos.
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/): the official entry for handouts and recordings.
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/): the corresponding week and LFD chapter.
- [Fall 2024 slides, 11u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/11u_handout.pdf): the corresponding Fall 2024 slides, not compared page by page in this article.
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/): the corresponding week.
- [Fall 2024 Homework 4 (hw4_red.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf): the content of Q2, Q3, Q6–7, and Q10, and the release and due dates.
- [LIBSVM datasets: cpusmall_scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/regression/cpusmall_scale): the data for HW4 Q10.
- [Learning from Data textbook website](http://amlbook.com): the source of Section 3.3.
- [Foundations Lecture 10: Logistic Regression](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-10-logistic-regression-en): the five-patient data, the gradient of the cross-entropy, and the gradient descent numbers come from this article.
- [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques: Course Overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en): where this lecture sits in the whole course and the reading routes.
