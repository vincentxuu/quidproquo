---
title: "Stanford CS109 Lecture 20 | Logistic Regression: Derive the gradient from Bernoulli likelihood"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, machine-learning]
lang: en
series:
  name: "Reading Stanford CS109"
  order: 21
tldr: "Logistic regression turns a linear score into a Bernoulli probability with sigmoid; the gradient xⱼ(y-ŷ) follows directly from the log-likelihood chain rule."
description: "A problem-by-problem guide to Stanford CS109 Summer 2026 Lecture 20: sigmoid, decision boundaries, log-likelihood, gradient ascent, and MAP priors."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs109-lecture-20-logistic-regression)

This is article 21 in [Reading Stanford CS109](/series/stanford-cs109), covering **Summer 2026 Lecture 20: Logistic Regression** (Jul 28), taught by Chris Gregg. It follows the official [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture20-Worksheet.pdf), [answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture20-AnswerKey.pdf), [LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture20-LLMPrompts.pdf), and reader.

The lecture remains **L2**. The three-page worksheet has P1–P6 plus an optional MAP challenge. The four-page key omits only the P5 pset7 code solution and fully answers the challenge. The guide has six concepts across three pages. Current slides are unavailable and video is Canvas-gated.

## P1: Poisson MLE warm-up

The counts `[3,1,4,2,5]` sum to 15:

```text
LL(λ) = -nλ + (Σxᵢ)ln λ + constant
dLL/dλ = -n + Σxᵢ/λ = 0
λ̂ = Σxᵢ/n = 3
```

`-Σln(xᵢ!)` is constant in `λ`; it shifts the objective vertically without moving its argmax.

## P2: Sigmoid, prediction, and decision boundary

For `θ=[-1,2,0.5]`, prepend `x₀=1`. At `(x₁,x₂)=(1,2)`:

```text
z = θᵀx = -1 + 2(1) + 0.5(2) = 2
ŷ = σ(2) = 0.8808
```

The 0.5 threshold predicts class 1. Since `σ` is increasing and `σ(0)=0.5`, thresholding probability at 0.5 equals thresholding `z` at 0. The undecided set is `-1+2x₁+0.5x₂=0`, or `x₂=2-4x₁`: a decision-boundary line, and a hyperplane in higher dimensions. A zero weight removes a feature from the score; a large negative weight is strong evidence against `Y=1`.

## P3: One gradient-ascent step

For `([1,1,0],1)` and `([1,0,1],0)` at `θ=0`, both predictions are 0.5:

```text
LL = 2ln(0.5) ≈ -1.386
∇LL = [0.5,0.5,0] + [-0.5,0,-0.5]
     = [0,0.5,-0.5]
```

With `η=1`, the new `θ=[0,0.5,-0.5]`. Predictions become 0.6225 and 0.3775, so each observed label has probability 0.6225 and `LL_new=2ln(0.6225)≈-0.948`, a gain of about 0.438. Equal opposite residuals cancel the intercept gradient.

## P4: Where the gradient comes from

The assumption is `Y|X=x ~ Bern(ŷ)`, with `ŷ=σ(θᵀx)`:

```text
P(Y=y|x) = ŷʸ(1-ŷ)^(1-y)
LL = yln ŷ + (1-y)ln(1-ŷ)

∂LL/∂ŷ = (y-ŷ)/(ŷ(1-ŷ))
∂ŷ/∂θⱼ = ŷ(1-ŷ)xⱼ
∂LL/∂θⱼ = xⱼ(y-ŷ)
```

The sigmoid factors cancel. Across data, sum `xⱼ⁽ⁱ⁾(y⁽ⁱ⁾-σ(θᵀx⁽ⁱ⁾))`. The residual supplies direction and magnitude; `xⱼ` assigns feature j its credit or blame.

## P5: Logistic Regression code

Pset7 specifies `η=0.0001`, 1,000 steps, and 100% test accuracy on data where `y=x₁`. The worksheet asks for batch pseudocode:

```text
repeat training steps:
    reset gradient accumulator
    for each example:
        compute ŷ
        for each parameter:
            gradient[j] += x[j](y-ŷ)
    update every θ[j] after all examples
```

Reset once per outer iteration and update after the examples loop. The public key withholds the requested weight under pset policy, so this article does not invent a run result.

## P6: Conceptual rapid fire

- Logs prevent product underflow, turn products into sums, and preserve argmax.
- Linear regression can leave `[0,1]` and assumes the wrong real-valued noise story; logistic regression models a conditional Bernoulli probability.
- If `Y` and `Xᵢ` are independent, expect `θᵢ≈0`, though finite samples need not produce exactly zero.
- An added feature that is always zero changes neither predictions nor training; its gradient is zero.
- To model `x₁x₂`, append it as a feature and learn its weight with the unchanged gradient.

## Optional challenge: Gaussian prior and MAP

For `P(Y=1|x)=σ(θx)` with `θ~N(0,1)`, density at 0 is `e²≈7.389` times density at 2. Dropping the Bayes denominator and taking logs gives:

```text
θ_MAP = argmaxθ [log f(θ) + Σᵢlog f(yᵢ|θ)]
gradient = -θ + Σᵢxᵢ[yᵢ-σ(θxᵢ)]
```

The extra `-θ` pulls the parameter toward zero: Gaussian-prior MAP produces L2 regularization or weight decay. It matters most with little data.

## Guide unit: Assumption and training objective

A binary supervised datapoint has features `x` and `y∈{0,1}`. The model outputs a probability; thresholding produces a class:

```text
P(Y=1|X=x) = σ(θᵀx)
LL(θ) = Σᵢ[yᵢlog ŷᵢ + (1-yᵢ)log(1-ŷᵢ)]
```

Machine learning calls the negative objective binary cross-entropy loss. The log-likelihood is concave in `θ`, so properly configured gradient ascent reaches the global optimum.

## How to use the LLM Learning Guide

Work through its six concepts: classification setup, sigmoid, logistic assumption, log-likelihood, gradient derivation, and training loop. Attempt each Test me first. Ask the model to catch confusion between probability `ŷ` and a thresholded class, then debug pseudocode with a misplaced accumulator reset or update.

## Material boundaries

- The worksheet has P1–P6 plus a challenge; the four-page key omits only P5 and answers the challenge.
- The three-page guide contains six concepts and no extra numbered unit.
- Current slides are unavailable and video is Canvas-gated; only public artifacts are used.

## References

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 20 page](https://web.stanford.edu/class/cs109/lectures/20-LogisticRegression)
- [Lecture 20 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture20-Worksheet.pdf)
- [Lecture 20 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture20-AnswerKey.pdf)
- [Lecture 20 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture20-LLMPrompts.pdf)
- [Probability for Computer Science reader](https://probabilitycoders.stanford.edu/spr26)
