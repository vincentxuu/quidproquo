---
title: "CMU 07-280 Lecture 12: How Backpropagation Reuses the Chain Rule"
date: 2026-08-22
category: ai
tags: [cmu, ai-course, machine-learning, backpropagation, neural-network]
lang: en
series:
  name: "Reading CMU 07-280"
  order: 12
type: deep-dive
tldr: "Lecture 12 treats a network as a computation graph: the forward pass stores intermediates, the backward pass propagates upstream gradients, and local linear, activation, and softmax rules compute every parameter gradient efficiently."
description: "A detailed reading of CMU 07-280 Spring 2026 Lecture 12: universal approximation, computation graphs, vectorized backpropagation, and the softmax-cross-entropy gradient."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cmu-07280-lecture-12-backpropagation)

Spring 2026 officially called Lecture 12 **Neural Networks (cont.)**, dated February 19. This article foregrounds backpropagation because it is the public slide deck's main technical subject. Fall 2026 renamed the lecture, but the edition and sources here remain Spring 2026. No public lecture-by-lecture recording exists.

## Official material and scope

The sources are the [Lecture 12 slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec12_Neural_Networks_II.pdf), [Neural Networks pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Neural_Networks.pdf), [Recitation 6 solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec6_sol.pdf), and [HW6](https://www.cs.cmu.edu/~07280/assignments/hw6_blank.pdf). The slides begin with universal approximation and then develop scalar and matrix backpropagation. This reading does not misstate the theorem as “every network is easy to train.”

## The inherited problem: representation does not compute its own gradients

Lecture 11 defined a multilayer network. Expanding a separate chain rule for each weight repeatedly recomputes shared derivative paths. Backpropagation's central idea is dynamic programming: a node aggregates gradients from downstream once, then distributes the result to its inputs and parameters.

The universal approximation theorem says that a network of suitable width can approximate a broad family of functions. It does not guarantee generalization from finite data, successful gradient-descent optimization, or a small required network. Expressiveness and trainability are distinct.

## Complete conceptual path: forward values and backward sensitivities

For a linear layer `z=Wa+b`, if backward receives `δz=∂J/∂z`, its local rules are

```text
∂J/∂a = Wᵀ δz
∂J/∂W = δz aᵀ
∂J/∂b = δz
```

The first passes sensitivity to the previous layer; the other two create parameter gradients. For element-wise sigmoid,

```text
δz = δa ⊙ a ⊙ (1-a)
```

ReLU passes gradients where its pre-activation is positive and blocks them where it is negative. The forward pass must therefore save `a` or `z` for use by local backward rules.

Softmax alone has a dense Jacobian, but combining it with cross-entropy simplifies the logits gradient to

```text
∂J/∂z = ŷ - y
```

This has the same structure as Lecture 9's logistic gradient: predicted probability minus the true one-hot target. HW6 derives the result because a fused implementation avoids materializing a `K×K` Jacobian.

## Reproducible derivation: one backward pass through a linear model

Let

```text
x=[2,1]ᵀ, W=[3,-1], b=0
z=Wx=5, J=(z-y)², y=4
```

Start at the loss: `∂J/∂z=2(z-y)=2`. Apply the local linear rule:

```text
∂J/∂W = 2 xᵀ = [4,2]
∂J/∂b = 2
∂J/∂x = Wᵀ 2 = [6,-2]ᵀ
```

The example is tiny but complete. If another layer preceded it, `∂J/∂x` would not update the data; it would become that earlier layer's upstream gradient.

## Recitation and homework connection

Recitation 6 computes two weight derivatives in a concrete `2→2→1` network, requiring every link in the chain expression. HW6 then vectorizes the same operations: gradients for a linear layer's input, weights, and bias; sigmoid's Hadamard product; and softmax-cross-entropy's `ŷ-y`.

This is the closest public assignment in this part of the course to implementing primitive autograd operations. The written PDF still lacks the complete autograder and staff feedback, so an anonymous learner should add finite-difference gradient checks.

## Extension: backpropagation is not gradient descent

Backpropagation computes `∇θJ`; gradient descent decides how to use it to update `θ`. One is efficient differentiation, the other an optimization rule. SGD, momentum, and Adam can all consume gradients produced by backpropagation. Keeping them separate helps identify whether a failure lies in derivatives, learning rate, or optimizer state.

The next lecture pauses model derivations and asks a higher-level question: even if an objective can be optimized efficiently, does it represent what people actually want?

## What to do tonight

Implement `linear_forward` and `linear_backward`, then check one weight by central difference: `(J(w+ε)-J(w-ε))/(2ε)`. Require analytic and numerical gradients to meet a tolerance before adding sigmoid. Finally, verify on one three-class example that the softmax-cross-entropy gradient with respect to logits is `ŷ-y`.

## References

- [CMU 07-280 Spring 2026 Lecture 12 slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec12_Neural_Networks_II.pdf)
- [Neural Networks pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Neural_Networks.pdf)
- [Recitation 6 solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec6_sol.pdf)
- [HW6: Backpropagation in Neural Network Layers](https://www.cs.cmu.edu/~07280/assignments/hw6_blank.pdf)
