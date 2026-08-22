---
title: "CMU 07-280 Lecture 8: Gradient Descent, SGD, and Learning Rate"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cmu, ai-course, optimization, gradient-descent, machine-learning]
lang: en
series:
  name: "Reading CMU 07-280"
  order: 8
tldr: "Lecture 8 moves from a one-dimensional parabola to vector gradients and compares batch GD, SGD, and mini-batches; the learning rate determines whether updates converge, oscillate, or diverge."
description: "A complete reading of CMU 07-280 Spring 2026 Optimization: gradients, learning rate, stopping criteria, the linear-regression gradient, local minima, batch GD, SGD, and mini-batches."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cmu-07280-lecture-08-optimization)

This is **CMU 07-280 Spring 2026 Lecture 8: Optimization**. Lecture 7 had a normal equation for linear regression. This lecture deliberately returns to the objective's shape and builds an update rule that still works when no closed form exists. It is also the direct foundation for later neural networks and backpropagation.

## Official materials and reading scope

I read the complete [Optimization lecture notes](https://www.cs.cmu.edu/~07280/lectures/07_280_lecture_notes.pdf), [Optimization and Linear Regression pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Optimization_and_Linear_Regression.pdf), [Recitation 4](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec4.pdf) and [solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec4_sol.pdf), and checked [HW4](https://www.cs.cmu.edu/~07280/assignments/hw4_blank.pdf). No lecture recording is public.

## The inherited question: how to find an argmin without an inverse or closed form

For a one-dimensional objective `J(ω)`, the derivative is normally positive to the right of a minimum and negative to its left. Starting at any `ω(0)`, moving against the derivative can reduce `J`:

```text
ω(t) = ω(t-1) - α dJ/dω
```

`α` is the learning rate or step size. Stopping rules can watch for small loss improvement, a small gradient, almost no parameter motion, or exhausted compute. These are not equivalent: parameters may barely move because optimization converged or because the step is too small.

## Full conceptual path: from gradients to data sampling

For vector parameters `θ∈R^d`, all partial derivatives form the gradient `∇θJ(θ)`. If `J(θ)=θᵀv`, its gradient is `v`. If `J(θ)=θᵀAθ`, the gradient is `(A+Aᵀ)θ`. Vector gradient descent is:

```text
θ(t) = θ(t-1) - α ∇J(θ(t-1))
```

Linear regression's `J(θ)=||y-Xθ||²` has gradient `-2Xᵀy+2XᵀXθ`; setting it to zero recovers the normal equation. General models may have no solvable closed form, yet gradient descent can still seek a low point. For a nonconvex function, it is not guaranteed to find the global optimum and can stop at a local minimum.

For ERM, **batch GD** uses all `N` examples for each gradient. Its direction is stable, but an update can be expensive. **SGD** uniformly samples one example per update. The gradient is noisy but cheap. **Mini-batch GD** uses `K` examples with `1<K<N`, balancing vectorized computation, memory, and noise.

## A reproducible derivation: four learning rates over three steps

Let `J(ω)=ω²` and `ω(0)=1`. Since the derivative is `2ω`:

```text
ω(t) = (1-2α)ω(t-1)
```

After three steps:

| `α` | multiplier | `ω(3)` | behavior |
|---:|---:|---:|---|
| 0.25 | 0.5 | 0.125 | stable approach to zero |
| 0.5 | 0 | 0 | reaches the minimum in one step |
| 1 | -1 | -1 | oscillates between ±1 |
| 2 | -3 | -27 | rapidly diverges in magnitude |

“The gradient points uphill” does not imply that every step against it goes downhill. Direction and distance must both be chosen. The notes mention a decaying schedule such as `αt=1/√t` and more advanced adaptive methods, but do not develop those algorithms here.

## Recitation and homework connection

Recitation 4's matrix-calculus work is a prerequisite for this lecture. If the shape of `∇θJ` is wrong, syntactically valid code still follows the wrong objective. Its solution derives the gradient and closed form from `J(θ)=(Xθ-y)ᵀ(Xθ-y)`, directly bridging Lectures 7 and 8.

HW4 asks for partial derivatives of a concrete linear-regression objective and extends them to weighted least squares. It does not yet require an SGD implementation, but it tests whether a changed objective can be translated into the correct update direction. The PDF is public; official grading feedback is not.

## Further comparison: SGD noise is not merely a defect

A batch gradient is the exact average direction for the dataset. SGD is a random estimate. One update is less stable, but under a fixed compute budget it can update sooner and continue on datasets too large for full passes at every step. Mini-batches are not just a vague compromise; they are a standard computational unit on modern hardware.

The lecture claims only that SGD is noisy but fast. It does not prove that noise improves generalization or necessarily escapes local minima. Those claims require additional assumptions and evidence and should not be inferred from these notes.

## What to do tonight

1. Recompute the four updates for `J(ω)=ω²` and plot each iterate on the parabola.
2. Compute one batch gradient for two linear-regression examples, then each single-example gradient.
3. Write one stopping criterion and a case in which it gives a false sense of convergence.

## References

- [CMU 07-280 Spring 2026 Optimization lecture notes](https://www.cs.cmu.edu/~07280/lectures/07_280_lecture_notes.pdf)
- [07-280 Optimization and Linear Regression pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Optimization_and_Linear_Regression.pdf)
- [07-280 Spring 2026 Recitation 4](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec4.pdf)
- [Recitation 4 solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec4_sol.pdf)
- [07-280 Spring 2026 Homework 4](https://www.cs.cmu.edu/~07280/assignments/hw4_blank.pdf)
