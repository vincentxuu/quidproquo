---
title: "CMU 07-280 Lecture 7: Linear Regression and the Normal Equation"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cmu, ai-course, linear-regression, machine-learning, linear-algebra]
lang: en
series:
  name: "Reading CMU 07-280"
  order: 7
tldr: "Lecture 7 applies ERM to linear functions and squared loss, moves from a one-dimensional slope to `argmin ||y-Xθ||²`, and derives the normal equation when `XᵀX` is invertible."
description: "A complete reading of CMU 07-280 Spring 2026 Linear Regression: the hypothesis class, squared loss, scalar closed form, design matrices, normal equations, and invertibility."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cmu-07280-lecture-07-linear-regression)

This is **CMU 07-280 Spring 2026 Lecture 7: Linear Regression**. Lecture 5's ERM is solved end to end: choose linear hypotheses, choose squared loss, stack the data into a matrix, and derive a closed-form optimum.

## Official materials and reading scope

I read the complete [Linear Regression lecture notes](https://www.cs.cmu.edu/~07280/lectures/07_280_lecture_notes_Linear_Regression.pdf), [Optimization and Linear Regression pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Optimization_and_Linear_Regression.pdf), [Recitation 4](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec4.pdf) and [solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec4_sol.pdf), and checked [HW4](https://www.cs.cmu.edu/~07280/assignments/hw4_blank.pdf). No lecture recording is public.

## The inherited question: what ERM becomes for a linear hypothesis class

Start with `X=R, Y=R`, and let the hypothesis class contain all lines:

```text
h_(ω,b)(x) = xω+b
```

With squared loss, ERM finds `ω,b` minimizing average squared residual. To isolate the core argument, the notes first set `b=0` and fit a line through the origin, then generalize to multiple dimensions and an intercept.

## Full conceptual path: from a scalar to the design matrix

In the one-dimensional, through-origin case:

```text
J(ω) = (1/N) Σ (y(i)-x(i)ω)²
```

Expanding or differentiating yields:

```text
ω* = Σ x(i)y(i) / Σ x(i)²
```

In multiple dimensions, absorb the intercept into a constant-one feature and write `hθ(x)=xᵀθ`. Stack each `x(i)ᵀ` into a design matrix `X` and labels into `y`:

```text
J(θ) = ||y-Xθ||²
     = yᵀy - 2θᵀXᵀy + θᵀXᵀXθ
```

Setting the gradient to zero gives the normal equations:

```text
XᵀXθ = Xᵀy
```

If `XᵀX` is invertible:

```text
θ* = (XᵀX)^-1 Xᵀy
```

The notes explicitly warn against writing `θ=X^-1y`: `X` is usually not square and may not be invertible. Even though `XᵀX` is square, linearly dependent features make it singular. The closed form carries an invertibility assumption.

## A reproducible derivation: fitting two points through the origin

Use `(x,y)={(1,2),(2,3)}`:

```text
Σxy = 1·2 + 2·3 = 8
Σx² = 1² + 2² = 5
ω* = 8/5 = 1.6
```

The model `h(x)=1.6x` predicts 1.6 and 3.2. Squared errors are `0.4²` and `(-0.2)²`, for a mean of 0.1.

Verify by differentiation:

```text
J(ω)=[(2-ω)²+(3-2ω)²]/2
dJ/dω=5ω-8
```

Setting the derivative to zero again gives `ω=8/5`. This is the same minimum that gradient descent will approach iteratively in Lecture 8. Linear regression is special here because it can also be solved directly.

## Recitation and homework connection

Recitation 4 builds scalar, vector, and matrix derivatives, then derives the gradient and closed form from `J(θ)=||Xθ-y||²`. Its solution keeps every matrix shape aligned, a more durable skill than memorizing the normal equation.

HW4 asks students to expand a concrete dataset's objective into a polynomial, write partial derivatives, and design datasets with specified numbers of optimal solutions. Later parts derive weighted least squares and multi-output regression. The task checks whether the formula can be rebuilt from an objective rather than applied in one fixed form.

## Further comparison: closed forms and numerical solutions have different roles

The normal equation gives an analytic answer and makes the geometry visible. Forming and inverting a large `XᵀX`, however, can be expensive and numerically delicate. Lecture 8 turns to gradient optimization not because linear regression became unsolvable, but because the course needs a method that extends to models without closed forms.

Both routes optimize the same `J(θ)`. A closed form solves one equation; gradient descent repeatedly follows local slope.

## What to do tonight

1. Compute `Σxy/Σx²` for three one-dimensional points and verify it by differentiation.
2. Write a design matrix with an intercept column and label the shapes of `X`, `θ`, and `y`.
3. Construct a matrix with two identical feature columns and explain why `XᵀX` is singular.

## References

- [CMU 07-280 Spring 2026 Linear Regression lecture notes](https://www.cs.cmu.edu/~07280/lectures/07_280_lecture_notes_Linear_Regression.pdf)
- [07-280 Optimization and Linear Regression pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Optimization_and_Linear_Regression.pdf)
- [07-280 Spring 2026 Recitation 4](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec4.pdf)
- [Recitation 4 solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec4_sol.pdf)
- [07-280 Spring 2026 Homework 4](https://www.cs.cmu.edu/~07280/assignments/hw4_blank.pdf)
