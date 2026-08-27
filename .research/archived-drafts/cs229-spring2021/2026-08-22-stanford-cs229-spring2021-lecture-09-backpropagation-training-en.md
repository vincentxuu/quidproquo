---
title: "Stanford CS229 Spring 2021 Lecture 9: How Backpropagation Sends One Loss Through Every Layer"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, stanford, neural-networks, backpropagation]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 10
tldr: "Backpropagation is not another optimizer. It applies the chain rule backward through a computation graph and reuses each layer's error signal to obtain all parameter gradients. Activations, initialization, and momentum determine how stably those gradients travel and are used."
description: "A reading of Stanford CS229 Spring 2021 Lecture 9: backpropagation, the chain rule, ReLU, Xavier and He initialization, vanishing and exploding gradients, and momentum."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-spring2021-lecture-09-backpropagation-training)

This is post 10 in [Reading Stanford CS229](/en/series/stanford-cs229), covering **Stanford CS229, Spring 2021, Lecture 9**. The course schedule dates it April 26, 2021, under the official title **Neural Networks 2. Backpropagation.** This article uses the Spring 2021 Live Lecture Notes and the shared Deep Learning notes. The recording was not used as a source.

Lecture 8 defined the forward pass: each layer applies an affine transformation and then an activation. Lecture 9 reverses the question. Once a scalar loss has been computed, how can the model obtain gradients for every `W` and `b` efficiently? The answer is to propagate shared intermediate derivatives backward through the same computation graph.

## Backpropagation is dynamic programming for the chain rule

For layer `l`,

```text
z^[l] = W^[l]a^[l-1] + b^[l]
a^[l] = g^[l](z^[l])
```

Define the backward signal

```text
δ^[l] = ∂L / ∂z^[l]
```

Once `δ^[l+1]` is known, the chain rule gives

```text
δ^[l] = (W^[l+1])ᵀδ^[l+1] ⊙ g'^[l](z^[l])
```

where `⊙` denotes elementwise multiplication. The parameter gradients then follow:

```text
∂L/∂W^[l] = δ^[l](a^[l-1])ᵀ
∂L/∂b^[l] = δ^[l]
```

Efficiency comes from reuse. Once computed, `δ^[l]` serves the weights, biases, and the gradient for the preceding layer. The algorithm does not retrace the entire chain rule separately for every parameter. Storing forward intermediates and reusing them in reverse resembles dynamic programming on a computation graph.

## Why a logistic output simplifies the gradient

For a sigmoid output paired with binary cross-entropy, the fractions in the derivative cancel and leave

```text
δ^[L] = a^[L] - y
```

This is not a property of every arbitrary loss. It comes from this particular pairing of sigmoid and cross-entropy. The output error can then be multiplied by weight matrices and activation derivatives to propagate backward one layer at a time.

For a mini-batch, the per-example outer products become matrix products and gradients are averaged across examples. Vectorization does not alter the chain rule; it groups the same operation over several examples.

## Activations shape the gradient channel

Sigmoid saturates when `|z|` is large, making its derivative close to zero. Repeated multiplication across layers can then shrink early-layer gradients rapidly. Tanh is centered around zero but also saturates. ReLU,

```text
g(z) = max(0,z)
```

has derivative one on the positive side and can reduce part of the shrinkage problem. Its derivative is zero on the negative side, which can also stop a unit from updating. The notes present ReLU as a common improvement, not a guarantee that eliminates all training difficulties.

More generally, each layer multiplies by weights and activation derivatives. Their product may approach zero or grow rapidly. These are vanishing and exploding gradients. Both concern signal scale across many layers, not merely one unusual point on the loss surface.

## What Xavier and He initialization control

Suppose a unit receives `n_in` roughly independent inputs. Weights that are too large amplify activation or gradient variance layer after layer; weights that are too small shrink it. The notes motivate initialization scales tied to fan-in:

```text
Var(w) ≈ 1 / n_in       # Xavier, commonly paired with tanh
Var(w) ≈ 2 / n_in       # He, commonly paired with ReLU
```

These ratios preserve signal scale under simplified independence assumptions. They are not convergence proofs for arbitrary architectures. Their role is to avoid starting with badly distorted scales; the data distribution, depth, activations, and optimizer still matter.

Weights also cannot all start at the same value. Units with identical inputs and initial weights receive identical gradients and continue learning the same function. Random initialization breaks this symmetry.

## How momentum smooths an update direction

Ordinary gradient descent updates directly from the current gradient. Momentum maintains a moving average:

```text
v_t = βv_{t-1} + (1-β)g_t
θ_t = θ_{t-1} - ηv_t
```

Consistent gradient directions accumulate. Directions that oscillate from step to step are damped by averaging. Momentum does not change the derivatives computed by backpropagation; it changes how the optimizer uses them. Keeping gradient computation separate from parameter updating is an important conceptual boundary.

The public notes list gradient descent, SGD, mini-batch training, and momentum without establishing a single convergence ranking across all settings. This article does not impose one.

## Limits of the lecture

The handwritten notes derive backpropagation for a small fully connected network. They do not cover automatic differentiation frameworks, numerical-stability techniques, normalization, residual connections, or adaptive optimizers. Nor do they prove that a nonconvex neural network reaches a global optimum. The supported claims concern gradient computation and scale intuition, not a full deep-learning engineering manual.

Backpropagation guarantees only that derivatives follow the computation graph and chain rule. A misspecified model, inappropriate loss, or biased dataset can still produce perfectly correct gradients. Correct differentiation does not imply correct modeling.

## Where Lecture 9 sits in the eighteen-lecture path

Lecture 8 established forward computation; Lecture 9 adds backward computation and training stability, completing the two-lecture neural-network block. Lecture 10 shifts from one training run to model selection: how much a learning procedure changes with a new training set, and how regularization trades bias against variance.

A gradient check makes the scope concrete. On a tiny network, approximate one weight's derivative by finite differences and compare it with backpropagation. This tests whether the implementation matches the calculus. It does not test whether the model fits the task, which is precisely the boundary of this lecture.

### Beyond the lecture

Plot the average scale of activations and gradients at every layer under weights that are too large, too small, Xavier-scaled, and He-scaled. Do not inspect only the final loss. Layerwise curves show where signals begin to vanish or explode and turn initialization advice into an observable mechanism.

## References

- [Stanford CS229 Spring 2021 syllabus](https://cs229.stanford.edu/syllabus-spring2021.html)
- [Lecture 9 Live Lecture Notes](https://cs229.stanford.edu/notes2021spring/notes2021spring/lecture9_live.pdf)
- [Deep Learning notes](https://cs229.stanford.edu/notes2020fall/notes2020fall/deep_learning_notes.pdf)
