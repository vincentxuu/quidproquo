---
title: "CMU 07-280 Lecture 9: Logistic Regression as Probability Estimation"
date: 2026-08-22
category: ai
tags: [cmu, ai-course, machine-learning, logistic-regression, classification]
lang: en
series:
  name: "Reading CMU 07-280"
  order: 9
type: deep-dive
tldr: "Lecture 9 models P(y=1|x) with a sigmoid instead of directly predicting 0 or 1, learns parameters with cross-entropy and convex optimization, and extends naturally to softmax regression."
description: "A detailed reading of CMU 07-280 Spring 2026 Lecture 9: probabilistic classification, cross-entropy, sigmoid gradients, convexity, and softmax regression."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cmu-07280-lecture-09-logistic-regression)

This is Lecture 9 of CMU 07-280 Spring 2026, officially titled **Logistic Regression** and dated February 10, 2026. It connects linear regression and optimization to classification by estimating the probability of an event rather than making an immediate hard decision. No lecture-by-lecture public recording exists, so this reading uses only the public lecture document, pre-reading, Recitation 5, and homework prompts.

## Official material and scope

The primary sources are the [official Lecture 9 PDF](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec9_Logistic_Regression.pdf) and the [Feature Engineering & Logistic Regression pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Feature_Eng_and_Logistic_Reg.pdf). The [Recitation 5 solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec5_sol.pdf) checks the binary and multiclass formulas, while HW5 connects the same ideas to optimization experiments. Fall 2026 schedule wording is not used.

## The inherited problem: why a line cannot directly predict zero or one

Lecture 8 established how gradient descent changes parameters. Classification adds a modeling problem: nearby or even identical inputs may produce both successes and failures. The lecture uses LLM task success as its example. If tasks at one difficulty level succeed half the time, either hard label is wrong half the time. The useful target is `P(y=1|x)`.

A linear score `z=θᵀx` is unbounded, while a probability must lie in `[0,1]`. The sigmoid supplies the map:

```text
p̂ = σ(z) = 1 / (1 + exp(-z))
```

At `z=0`, the estimate is 0.5. Positive scores move it toward one and negative scores toward zero. The boundary is still `θᵀx=0`, so logistic regression remains linear in the original feature space.

## Complete conceptual path: probability, loss, gradient, and convexity

Producing a probability requires a loss that punishes misplaced confidence. Binary cross-entropy is

```text
ℓ(p̂,y) = -y log(p̂) - (1-y) log(1-p̂)
```

When the label is one, moving from 0.6 to 0.9 lowers the loss; confidently reporting 0.001 makes it enormous. The objective therefore preserves information that classification accuracy discards: how certain the model was.

Combining sigmoid with cross-entropy simplifies the per-example gradient to

```text
∇θJ(i)(θ) = (p̂(i) - y(i)) x(i)
```

The scalar `p̂-y` is a probability residual, while `x` decides which parameter directions receive that error. An overestimate gives a positive residual, so gradient descent lowers the corresponding score. The official material also emphasizes that the logistic empirical risk is convex in `θ`. Local minima are therefore global minima, giving GD and SGD a well-defined target.

For K classes, one weight vector is assigned to every class and softmax jointly normalizes their scores:

```text
P(y=k|x) = exp(θkᵀx) / Σj exp(θjᵀx)
```

This is not K unrelated sigmoids. The shared denominator forces probabilities to sum to one and couples changes across classes.

## Reproducible mini-example: how one point moves the weights

Let `x=[1,2]`, `θ=[0,0]`, and `y=1`. The initial score is zero, hence `p̂=0.5`. The gradient is

```text
(0.5-1)[1,2] = [-0.5,-1]
```

With learning rate `α=0.1`,

```text
θ ← θ - α∇J = [0.05,0.1]
```

The new score is `0.25`, producing `p̂≈0.562`. One update has moved the positive example in the correct direction. Recompute with `y=0` and the direction reverses. This tiny calculation is a better check of sign conventions than memorizing the formula.

## Recitation and homework connection

Recitation 5 reduces binary softmax to sigmoid and shows that the two class parameter vectors influence probability through their difference. HW5 asks students to compare convergence among gradient-descent models and to contrast the computational cost of closed-form weighted regression with one gradient iteration. The point is broader than a logistic formula: representation and optimization jointly determine practical training.

An anonymous learner can redo the derivations and small experiments. The full notebook, Gradescope autograder, and staff feedback are not all public, so public PDFs do not equal the complete enrolled experience.

## Extension: logistic versus linear regression

Both models begin with `θᵀx` and can use gradient descent. Their observation models differ. Linear regression treats the target as a continuous value with Gaussian noise; logistic regression treats the label as a Bernoulli outcome. Lecture 16 will recover both objectives from maximum likelihood.

Lecture 10 addresses the next limitation: the boundary remains linear in the original features. Feature transforms add expressive power, but a larger feature space also makes overfitting easier, which is why feature engineering and regularization appear together.

## What to do tonight

Take three two-dimensional examples and perform two SGD updates from `θ=0`. For each step, write down `z`, `p̂`, cross-entropy, `(p̂-y)x`, and the new `θ`. Flip one label and identify which gradient component changes most. Then add an `x1²` feature to prepare for Lecture 10.

## References

- [CMU 07-280 Spring 2026 Lecture 9: Logistic Regression](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec9_Logistic_Regression.pdf)
- [Feature Engineering & Logistic Regression pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Feature_Eng_and_Logistic_Reg.pdf)
- [Recitation 5 solution: Logistic Regression & Regularization](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec5_sol.pdf)
- [HW5 written component](https://www.cs.cmu.edu/~07280/assignments/hw5_blank.pdf)
