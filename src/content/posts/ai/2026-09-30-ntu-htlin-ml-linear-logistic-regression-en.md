---
title: "Hsuan-Tien Lin's ML Foundations L9–L10: From the Closed-Form Solution of Linear Regression to Gradient Descent for Logistic Regression"
date: 2026-09-30
category: ai
type: guide
tags: [ntu, machine-learning, linear-regression, logistic-regression, ai-course, course-guide]
lang: en
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 5
tldr: "Linear regression writes squared error as (1/N)‖Xw − y‖², sets the gradient to zero, and gets w_LIN = X†y in one step. The hat matrix H = XX† projects y onto the column space of X, which shows that on average E_out − E_in ≈ 2(d+1)/N. Logistic regression estimates P(+1|x) with θ(wᵀx); maximum likelihood turns into the cross-entropy error ln(1 + exp(−y wᵀx)). It has no closed-form solution, so you walk downhill along −∇E_in step by step. That is gradient descent."
description: "A guide to Lectures 9–10 of Hsuan-Tien Lin's Machine Learning Foundations (NTU): the linear regression hypothesis and squared error, the matrix form and its gradient, the pseudo-inverse solution, the geometry of the hat matrix and the learning curve, and using regression for classification; then soft binary classification, the logistic function, deriving cross-entropy from likelihood, the gradient, and gradient descent with a fixed learning rate. Includes the Fall 2024 slide differences, the HW3 cpusmall learning-curve experiments and HW4 Q1."
draft: false
glossary:
  - term: "pseudo-inverse"
    aliases: ["X†", "Moore–Penrose inverse"]
    definition: "The X† in the linear regression solution w_LIN = X†y. When X^T X is invertible it equals (X^T X)^{-1} X^T; when it is not, X† can still be defined in other ways and gives one of the many optimal solutions."
    context: "Lin recommends a well-implemented, numerically stable pseudo-inverse routine over computing (X^T X)^{-1} yourself."
    links:
      - label: "L9 slides"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/09_handout.pdf"
  - term: "hat matrix"
    aliases: ["H = XX†"]
    definition: "The matrix H = XX† that turns the label vector y into the prediction vector ŷ in linear regression. Geometrically it projects y onto the column space of X. The name comes from putting a hat on y to make ŷ."
    context: "Lecture 9 of Hsuan-Tien Lin's Machine Learning Foundations uses trace(I − H) = N − (d+1) to derive the average generalization error of linear regression."
    links:
      - label: "L9 slides"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/09_handout.pdf"
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression)

This is part 5 of the [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en) series, following [VC Dimension, Noise and Error Measures](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error-en). It covers Lecture 9, Linear Regression, and Lecture 10, Logistic Regression, from [Machine Learning Foundations](https://www.csie.ntu.edu.tw/~htlin/mooc/). This is where the course reaches its third big question: "How Can Machines Learn?"

The previous post ended with this: the error an algorithm actually optimizes, êrr, should be either plausible or friendly. This post gives two friendly examples. Squared error has a closed-form solution. Cross-entropy does not, but it is smooth enough for gradient descent.

Official materials used:

- MOOC slides [09_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/09_handout.pdf) and [10_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/10_handout.pdf); Fall 2024 versions [09u](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/09u_handout.pdf) and [10u](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/10u_handout.pdf).
- Videos 34–41 of the [Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf). Lectures are in Mandarin; slides are in English.
- Textbook [Learning from Data](http://amlbook.com) (LFD): 3.2 for L9 and 3.3 for L10, per the [Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/).
- Practice: the regression problems and cpusmall experiments in [Fall 2024 HW3](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf), and Q1 of [Fall 2024 HW4](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf).

**Access level**: videos and slides alone are A2. With the Fall 2024 homework PDFs and the public LIBSVM data sets it reaches A3, but there are no official solutions and grading is for enrolled students only. The grading scale is defined in the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en).

**Version differences**: the Fall 2024 09u slides have only three sections; the MOOC section Linear Regression for Binary Classification is gone, and the Fall 2024 L11 slides (11u) open with Linear Models for Binary Classification. This post still covers the MOOC section. The [Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) schedules L9–L10 for W5 (10/07); as of 2026-09-30 that week's 09u slides are not yet public.

## Course video sources

These course video sources were already documented in this article. Playback has not been reverified for each video; no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=qGzjYrLV-4Y
title: Linear Regression Problem
```

```youtube
url: https://www.youtube.com/watch?v=2LfdSCdcg1g
title: Linear Regression Algorithm
```

Original videos: [Linear Regression Problem](https://www.youtube.com/watch?v=qGzjYrLV-4Y)、[Linear Regression Algorithm](https://www.youtube.com/watch?v=2LfdSCdcg1g)、[Generalization Issue](https://www.youtube.com/watch?v=lj2jK1FSwgo)、[Linear Regression for Binary Classification](https://www.youtube.com/watch?v=tF1HTirYbtc)、[Logistic Regression Problem](https://www.youtube.com/watch?v=4rPupwSdAac)、[Logistic Regression Error](https://www.youtube.com/watch?v=Uw62i3-Tr4Q)、[Gradient of Logistic Regression Error](https://www.youtube.com/watch?v=IZttt_v5tSw)、[Gradient Descent](https://www.youtube.com/watch?v=X9NTihvSdjw)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

## Part 1: Linear regression

### The problem: real-valued output

Slides 2–5 change the credit card question from "approve or not" to "how large a credit limit". The output space is Y = ℝ, which makes it regression. The hypothesis is almost a perceptron, minus the sign:

h(x) = w<sup>T</sup>x

The goal is a line or hyperplane with small residuals, measured by squared error: E<sub>in</sub>(w) = (1/N) Σ (w<sup>T</sup>x<sub>n</sub> − y<sub>n</sub>)².

### The algorithm: one step

Stack the N examples into an N × (d+1) matrix X and an N-vector y. Then (slide 7):

E<sub>in</sub>(w) = (1/N) ‖Xw − y‖²

It is continuous, differentiable and convex, so the optimum is where the gradient is zero (slide 8). Expanding and differentiating (slide 9):

∇E<sub>in</sub>(w) = (2/N) (X<sup>T</sup>Xw − X<sup>T</sup>y)

Setting this to zero (slide 10):

- If X<sup>T</sup>X is **invertible**, the unique solution is w<sub>LIN</sub> = (X<sup>T</sup>X)<sup>−1</sup>X<sup>T</sup>y. Since N is usually much larger than d + 1, this is the common case.
- If X<sup>T</sup>X is **singular**, there are many optimal solutions, and defining X† in other ways still gives one of them.

Both cases fold into **w<sub>LIN</sub> = X†y**, where X† is the pseudo-inverse. The slide's practical advice: when the matrix is nearly singular, use a well-implemented † routine rather than computing (X<sup>T</sup>X)<sup>−1</sup>X<sup>T</sup> yourself. It is more numerically stable.

The whole algorithm is three steps (slide 11): build X and y, compute X†, return X†y.

### Is this really "learning"?

Slide 13 argues both sides. No: it is a closed-form solution, instant, with no step-by-step improvement of E<sub>in</sub>. Yes: E<sub>in</sub> is optimal, finite d<sub>VC</sub> guarantees E<sub>out</sub> as well, and pseudo-inverse routines iterate internally anyway. The verdict: **if E<sub>out</sub>(w<sub>LIN</sub>) is good, learning happened**.

### The hat matrix: a guarantee simpler than VC

The prediction vector is ŷ = Xw<sub>LIN</sub> = XX†y. Slide 14 calls H = XX† the **hat matrix** because it puts a hat on y to make ŷ.

Geometrically (slide 15), ŷ must lie in the span of the columns of X. For y − ŷ to be as short as possible, y − ŷ must be perpendicular to that span. So H **projects y onto the column space of X**, and I − H turns y into the residual perpendicular to it. The slide leaves a question: why is trace(I − H) = N − (d + 1)?

Suppose y is some ideal f(X) in the span plus noise with per-dimension level σ². I − H wipes out the ideal part and acts only on the noise, which gives (slide 16):

- average E<sub>in</sub> = σ² · (1 − (d+1)/N)
- average E<sub>out</sub> = σ² · (1 + (d+1)/N) (the slide notes this derivation is more complicated)

These two expressions are the **learning curve** of linear regression (slide 17). As N goes to infinity, both converge to the noise level σ². The expected generalization error is 2(d+1)/N, similar in shape to the worst-case VC guarantee.

A quiz on slide 18 lists properties of H: it is symmetric, H² = H (projecting twice is the same as once), and (I − H)² = I − H. All three follow from the physical meaning of projection.

<details>
<summary>Using linear regression for classification (MOOC slides 19–22; not in the Fall 2024 version)</summary>

{−1, +1} is a subset of ℝ, so you can run linear regression directly on classification data and return sign(w<sub>LIN</sub><sup>T</sup>x). Linear classification is NP-hard in general, while linear regression has an efficient closed form.

Why does this make sense? For y ∈ {−1, +1}, the 0/1 error ⟦sign(w<sup>T</sup>x) ≠ y⟧ never exceeds the squared error (w<sup>T</sup>x − y)². Feed that into the VC bound: classification E<sub>out</sub> ≤ classification E<sub>in</sub> + … ≤ regression E<sub>in</sub> + …. You trade a tighter bound for efficiency.

The slides recommend w<sub>LIN</sub> as a useful baseline classifier, or as the initial vector for PLA or pocket. A quiz on slide 22 lists three upper bounds on 0/1 error, exp(−y w<sup>T</sup>x), max(0, 1 − y w<sup>T</sup>x) and log₂(1 + exp(−y w<sup>T</sup>x)), and teases that one of them stars in the next lecture.

</details>

**Try this**: in NumPy, generate random data with N = 100 and d = 5. Compare `np.linalg.pinv(X) @ y` with `inv(X.T @ X) @ X.T @ y`. Then make one column exactly twice another so X<sup>T</sup>X becomes singular, and see which one breaks.

## Part 2: Logistic regression

### The problem: we want a probability

Slides 2–4 switch to heart attack prediction. Hard classification asks "will it happen?", with ideal target sign(P(+1|x) − ½). A doctor would rather hear "80% risk". Then the target is f(x) = P(+1|x) ∈ [0, 1], which the course calls **soft binary classification**.

The catch is the data. We never see each patient's true probability, only a ○ or × drawn from P(y|x). The data looks exactly like hard classification data; only the target function differs.

### The logistic hypothesis

Compute a weighted risk score s = w<sup>T</sup>x, then squash it into [0, 1] with the logistic function (slides 5–6):

θ(s) = 1 / (1 + e<sup>−s</sup>), with θ(−∞) = 0, θ(0) = ½, θ(∞) = 1

It is smooth, monotonic and S-shaped (a sigmoid). Logistic regression approximates P(+1|x) with h(x) = θ(w<sup>T</sup>x).

Slide 8 lines up three linear models. They compute the same score s = w<sup>T</sup>x and differ only in how they treat the output and which error they use.

| | linear classification | linear regression | logistic regression |
|---|---|---|---|
| h(x) | sign(s) | s | θ(s) |
| error | 0/1 (plausible) | squared (friendly) | ? |

### From likelihood to cross-entropy

What error should logistic regression use? Slides 9–11 go through maximum likelihood:

1. If h ≈ f, the probability that h generates this data (its likelihood) should be close to the probability that f generates it, and f usually generates the data in hand with high probability. So pick the h with the largest likelihood.
2. The logistic function is symmetric: 1 − θ(s) = θ(−s). So whether a label is ○ or ×, each example's probability can be written h(y<sub>n</sub>x<sub>n</sub>), and the likelihood is proportional to Π θ(y<sub>n</sub>w<sup>T</sup>x<sub>n</sub>).
3. Take the log, negate, divide by N, and maximizing becomes minimizing:

E<sub>in</sub>(w) = (1/N) Σ ln(1 + exp(−y<sub>n</sub>w<sup>T</sup>x<sub>n</sub>))

Each term err(w, x, y) = ln(1 + exp(−y w<sup>T</sup>x)) is the **cross-entropy error**. The quiz on slide 12 asks you to plot it against the score s. It is always above 0, below ln 2 when the prediction is right, at least ln 2 when it is wrong, and it has no upper bound.

### The gradient, and why there is no closed form

E<sub>in</sub> is continuous, twice differentiable and convex (slide 13), so again we look for a zero gradient. The chain rule gives (slide 14):

∇E<sub>in</sub>(w) = (1/N) Σ θ(−y<sub>n</sub>w<sup>T</sup>x<sub>n</sub>) · (−y<sub>n</sub>x<sub>n</sub>)

This is a weighted sum of −y<sub>n</sub>x<sub>n</sub>, with weights θ(−y<sub>n</sub>w<sup>T</sup>x<sub>n</sub>). Slide 15 asks when it can be zero. Either every θ is 0, which only happens when the data is linearly separable and every y<sub>n</sub>w<sup>T</sup>x<sub>n</sub> is far above 0, or the weighted terms cancel exactly, which is a nonlinear equation in w. **No closed-form solution.**

The quiz on slide 17 explains the weights. Since θ is monotonic, the example with the smallest y<sub>n</sub>w<sup>T</sup>x<sub>n</sub>, the one that is most badly wrong, contributes most to the gradient.

### Gradient descent

Without a closed form, go back to the spirit of PLA: start from some w₀ and repeat w<sub>t+1</sub> ← w<sub>t</sub> + ηv (slide 16). In PLA, v comes from correcting a mistake. With a smooth E<sub>in</sub>, you can pick a v that rolls the ball downhill.

The derivation takes three steps (slides 18–22):

1. Greedily search over unit-length v for the one that minimizes E<sub>in</sub>(w<sub>t</sub> + ηv). This is as hard as the original problem.
2. For small η, use a Taylor expansion as a linear approximation: E<sub>in</sub>(w<sub>t</sub> + ηv) ≈ E<sub>in</sub>(w<sub>t</sub>) + ηv<sup>T</sup>∇E<sub>in</sub>(w<sub>t</sub>). The best v is the opposite of the gradient, −∇E<sub>in</sub>/‖∇E<sub>in</sub>‖.
3. Too small an η is slow; too large is unstable. The slides suggest making the step proportional to ‖∇E<sub>in</sub>‖. The norms cancel, and you get **gradient descent with a fixed learning rate**: w<sub>t+1</sub> ← w<sub>t</sub> − η∇E<sub>in</sub>(w<sub>t</sub>).

The full logistic regression algorithm (slide 23): initialize w₀, then repeatedly compute the gradient and update, until the gradient is close to zero or you have run enough iterations. Each iteration costs about the same as one pocket iteration.

The quiz on slide 24: with w₀ = 0 and η = 0.1, and since θ(0) = ½, the first step gives w₁ = 0.05 · (1/N) Σ y<sub>n</sub>x<sub>n</sub>. One step from the zero vector lands on a scaled average of y<sub>n</sub>x<sub>n</sub>.

**Try this**: write the update in ten lines of NumPy, run it on separable 2D data, and plot E<sub>in</sub> against the iteration count. Then multiply η by ten and see whether the curve starts to oscillate.

## Video list

L9 Linear Regression:

- [Linear Regression Problem](https://www.youtube.com/watch?v=qGzjYrLV-4Y)
- [Linear Regression Algorithm](https://www.youtube.com/watch?v=2LfdSCdcg1g)
- [Generalization Issue](https://www.youtube.com/watch?v=lj2jK1FSwgo)
- [Linear Regression for Binary Classification](https://www.youtube.com/watch?v=tF1HTirYbtc)

L10 Logistic Regression:

- [Logistic Regression Problem](https://www.youtube.com/watch?v=4rPupwSdAac)
- [Logistic Regression Error](https://www.youtube.com/watch?v=Uw62i3-Tr4Q)
- [Gradient of Logistic Regression Error](https://www.youtube.com/watch?v=IZttt_v5tSw)
- [Gradient Descent](https://www.youtube.com/watch?v=X9NTihvSdjw)

## Practice: Fall 2024 HW3 and HW4 Q1

Problems in [HW3](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf) (released 2024-10-07, due 10/21) that match this post:

- **Q2**: the optimal w<sub>lin</sub> for 1D linear regression h(x) = wx without x₀.
- **Q3**: which operation on X (scaling a row, scaling a column, multiplying everything by 2, adding columns to the first column) can change the hat matrix H.
- **Q4**: the likelihood of an estimate for samples drawn uniformly from [θ, 1].
- **Q8**: change every x₀ from 1 to 1126, rerun linear regression, and prove that the old and new solutions differ by a diagonal matrix D.
- **Q9**: switch to a different sigmoid hypothesis, follow the logistic regression steps to derive the new E<sub>in</sub>, and find its gradient.
- **Q10–12 (coding)**: use the [cpusmall_scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/regression/cpusmall_scale) data set from the LIBSVM site (8192 examples, 12 features). Q10 runs linear regression 1126 times with N = 32 and plots (E<sub>in</sub>, E<sub>out</sub>). Q11 averages 16 runs for each N = 25, 50, …, 2000 and plots learning curves. Q12 repeats Q11 with only the first 2 features and compares.

[HW4](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf) (released 2024-10-21, due 11/04):

- **Q1**: after mapping labels from {−1, +1} to {0, 1}, which expression is equivalent to the in-class cross-entropy? The problem also notes that the name "cross-entropy" comes from the p log q + (1 − p) log(1 − q) form.
- Extension: **Q5** derives Newton's method from a second-order Taylor expansion and asks you to apply it to the cross-entropy of logistic regression, a natural step up from gradient descent.

**Try this**: compare the shape of your Q11 learning curves with σ²(1 ± (d+1)/N) from the hat matrix section. With no official solutions, cross-check w<sub>lin</sub> against scikit-learn's `LinearRegression` or `np.linalg.lstsq`.

## Next

The next post, [Linear Models for Classification, SGD, Multiclass and Nonlinear Transforms](/posts/ai/2026-09-30-ntu-htlin-ml-linear-classification-nonlinear-transform-en), puts this post's three linear models on one error plot, turns gradient descent into stochastic gradient descent (SGD), and uses feature transforms to escape "straight lines only".

Further reading: the Stanford CS229 chapter guides on [linear regression](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-01-linear-regression-en) and [logistic regression](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-02-classification-logistic-regression-en); Stanford CS109 on [maximum likelihood estimation](/posts/learning/2026-08-22-stanford-cs109-lecture-19-maximum-likelihood-estimation-en) and [logistic regression](/posts/learning/2026-08-22-stanford-cs109-lecture-20-logistic-regression-en) covers the same ground from a probability course.

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [Machine Learning Foundations / Techniques MOOC page (Hsuan-Tien Lin)](https://www.csie.ntu.edu.tw/~htlin/mooc/)
- [L9 Linear Regression slides](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/09_handout.pdf)
- [L10 Logistic Regression slides](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/10_handout.pdf)
- [Fall 2024 L9 slides (09u)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/09u_handout.pdf)
- [Fall 2024 L10 slides (10u)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/10u_handout.pdf)
- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf) (lectures in Mandarin, slides in English)
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/)
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/)
- [Fall 2024 Homework 3](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf)
- [Fall 2024 Homework 4](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf)
- [LIBSVM Data: cpusmall_scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/regression/cpusmall_scale)
- [Learning from Data textbook](http://amlbook.com)
- [MOOC slide errata](https://www.csie.ntu.edu.tw/~htlin/mooc/errata.php)
