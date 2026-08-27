---
title: "Stanford CS229 Spring 2021 Lecture 10: The Real Tradeoff Behind Bias, Variance, and Regularization"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, stanford, bias-variance, regularization]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 11
tldr: "Expected test error under squared loss separates into irreducible noise, bias squared, and variance. Regularization accepts some additional bias to reduce variance; ridge regression raises curvature in small-eigenvalue directions, stabilizing the solution without guaranteeing better accuracy on every task."
description: "A reading of Stanford CS229 Spring 2021 Lecture 10: bias-variance decomposition, L2 regularization, ridge regression, underdetermined linear models, and implicit regularization from gradient descent."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-spring2021-lecture-10-bias-variance-regularization)

This is post 11 in [Reading Stanford CS229](/en/series/stanford-cs229), covering **Stanford CS229, Spring 2021, Lecture 10**. The course schedule dates it April 28, 2021, under the official title **Bias - Variance. Regularization. Feature / Model selection.** This article uses the Spring 2021 Live Lecture Notes, the Regularization and Model Selection notes, and two bias-variance addenda. The recording was not used as a source.

The first nine lectures mostly fix a model and ask how it learns. Lecture 10 restores randomness to the picture: if the training set changes, how much does the predictor produced by the same procedure change? Bias-variance decomposition is useful not merely because it labels a model as high-bias or high-variance, but because it separates distinct sources of test error.

## From underfitting and overfitting to a decomposition

A low-degree polynomial may be unable to represent the true relationship and underfit. A high-degree polynomial may follow the training points closely but change sharply with another sample and overfit. Training error commonly falls with complexity, while test error may first fall and then rise.

The notes formalize this intuition under squared loss. Suppose

```text
y = h₀(x) + ε,    E[ε]=0, Var(ε)=σ²
```

The training set `S` is random, and the learning procedure returns `h_S`. Define the prediction averaged across training sets:

```text
h_avg(x) = E_S[h_S(x)]
```

At a fixed test point, expected squared error decomposes as

```text
E[(h_S(x)-y)²]
= σ²
+ (h_avg(x)-h₀(x))²
+ E[(h_S(x)-h_avg(x))²]
```

The three terms are irreducible noise, squared bias, and variance. Cross terms vanish because the noise has mean zero and `h_avg` is the average over training sets. The derivation depends on squared loss and the stated data-generating assumptions; it should not be transferred to every metric without qualification.

## Why regularization often lowers variance

Add an L2 penalty to linear regression:

```text
min_θ ||Xθ-y||² + λ||θ||²
```

The closed-form solution is

```text
θ_λ = (XᵀX + λI)⁻¹Xᵀy
```

When `XᵀX` has very small eigenvalues in some directions, ordinary least squares amplifies data perturbations along those directions. Adding `λI` raises every eigenvalue by `λ`, reducing the inverse's sensitivity to small-eigenvalue directions. The estimate generally becomes more stable and variance falls; shrinking parameters toward zero may also increase bias.

The value `λ` is a hyperparameter controlling this tradeoff, not a model parameter chosen by minimizing the same training loss. The notes point to held-out validation or cross-validation. Repeatedly tuning `λ` on the test set and then reporting that same score would no longer provide an untouched estimate.

## Why an underdetermined model has many solutions

Modern models often have more parameters than sample constraints. If `XᵀX` is rank-deficient, the ordinary normal equation has no unique solution. A vector in the null space of `X` can be added to one solution without changing its training predictions.

Ridge regression uses `λ||θ||²` to select a controlled solution. The notes also give an implicit-regularization example. Starting gradient descent from `θ₀=0`, every update lies in the column space of `Xᵀ`, so the iterates do not acquire an arbitrary null-space component. In an interpolating linear setting, that path favors the minimum-norm solution.

The conclusion has explicit assumptions: linear least squares, zero initialization, and the corresponding gradient-descent dynamics. It cannot be promoted directly into a theorem that gradient descent always finds the best regularized solution in every deep model.

## Explicit versus implicit regularization

Explicit regularization changes the objective directly, as in adding `λ||θ||²`. Implicit regularization comes from the algorithm and initialization. Even when all interpolating solutions have identical training loss, an optimization path may prefer one class of solutions.

Both ask the same question: when training data do not uniquely determine a predictor, what else selects the solution? The explicit case writes the preference into the objective. The implicit case requires analyzing update dynamics. Final training error alone cannot reveal the choice.

## Limits of the lecture

The public notes derive the clean decomposition under squared loss. Classification does not inherit the same simple algebraic form. They also mark double descent as bonus material rather than building a theory that covers every modern overparameterized model. This article therefore does not present the classical U-shaped curve as a universal law.

Stronger regularization is not always better. A very large `λ` drives the model toward zero and raises bias. Regularization addresses sensitivity to the training sample; it does not automatically repair a mistaken label definition, distribution shift, or missing features.

## Where Lecture 10 sits in the eighteen-lecture path

Lectures 8 and 9 explained how neural networks compute and train. Lecture 10 supplies language for model complexity and stability. It also marks the transition from supervised to unsupervised learning. Lecture 11 removes labels and asks how structure and latent variables can be inferred from the data itself.

For a concrete experiment, fix a true quadratic function, draw many small training sets, and fit linear, quadratic, and high-degree polynomials. Plot both the average prediction at each `x` and the spread around that average. Bias and variance then become two observable quantities rather than labels on one schematic curve.

## Beyond the lecture

For a linear model, sort the eigenvalues of `XᵀX` and compare `1/(s_i+λ)` for several values of `λ`. This directly shows how ridge suppresses the originally unstable directions. Inspecting test error after that mechanism makes the effect of regularization clearer than tuning a list of values blindly.

## References

- [Stanford CS229 Spring 2021 syllabus](https://cs229.stanford.edu/syllabus-spring2021.html)
- [Lecture 10 Live Lecture Notes](https://cs229.stanford.edu/notes2021spring/notes2021spring/lecture10_live.pdf)
- [Regularization and Model Selection notes](https://cs229.stanford.edu/notes2020fall/notes2020fall/cs229-notes5.pdf)
- [Bias-Variance calculations addendum](https://cs229.stanford.edu/notes2020fall/notes2020fall/addendum_bias_variance.pdf)
- [Bias-Variance and Error Analysis addendum](https://cs229.stanford.edu/notes2020fall/notes2020fall/error-analysis.pdf)
