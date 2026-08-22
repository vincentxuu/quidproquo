---
title: "CMU 07-280 Lecture 11: Building a Neural Network from Logistic Regression"
date: 2026-08-22
category: ai
tags: [cmu, ai-course, machine-learning, neural-network, representation-learning]
lang: en
series:
  name: "Reading CMU 07-280"
  order: 11
type: deep-dive
tldr: "Lecture 11 expands a logistic unit into a multilayer network: linear layers produce z, activations produce a, and multiple neurons jointly learn a feature transform trained through a final loss."
description: "A reading of CMU 07-280 Spring 2026 Lecture 11: neurons, activations, multilayer networks, parameter counting, forward passes, and scalar backpropagation."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cmu-07280-lecture-11-neural-networks)

Lecture 11, **Neural Networks**, took place on February 17, 2026. It does not introduce a neural network as an unrelated mysterious model. It stacks familiar linear and logistic operations: every neuron forms a weighted sum and applies an activation, while multiple neurons allow the feature transform itself to be learned. No lecture-by-lecture public recording exists, so this article uses the written material only.

## Official material and scope

The sources are the [Lecture 11 slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec11_Neural_Networks_I.pdf), [Neural Networks pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Neural_Networks.pdf), [Recitation 6 solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec6_sol.pdf), and HW6. The slides contain prompts for interactive activities but no public poll results; this reading does not fill blank slides with invented spoken answers.

## The inherited problem: what if φ(x) were learned from data?

Lecture 10 used human-specified polynomial features such as `φ(x)=[1,x,x²,…]`. That works in low dimensions, but images and language have no obvious exhaustive feature list. A neural network parameterizes the transform: early outputs become later features, and every layer adjusts for the final loss.

A single neuron is

```text
z = wᵀx + b
a = g(z)
```

Identity `g` gives a linear-regression unit, sigmoid gives a logistic unit, and a step resembles a perceptron. The novelty lies not in one neuron but in composing differentiable units.

## Complete conceptual path: z, a, layers, and learned representations

The course carefully separates `z` from `a`. The pre-activation `z` is the linear-layer output; `a=g(z)` is the representation passed forward. A two-hidden-unit regression network can be written

```text
z1 = W1 x + b1
a1 = ReLU(z1)
ŷ  = W2 a1 + b2
```

ReLU `max(0,z)` lets different neurons create different linear regions whose combination fits curved functions. Without nonlinear activations, any number of linear layers collapses into one matrix, so depth adds no expressiveness. Composition becomes useful only through nonlinearity.

Parameter counting follows tensor shape. A layer with `d_in` inputs and `d_out` outputs has

```text
d_out × d_in + d_out
```

learned values, including bias. Activations have no learned parameters. Miscounting activations as weights causes errors later in CNN and transformer architecture analysis.

Training remains empirical risk minimization. Regression may use squared error; classification commonly uses softmax cross-entropy. Gradient descent updates `W` and `b`, not the input, intermediate activations, or labels. Intermediate values participate in differentiation but are not model parameters.

## Reproducible mini-example: two ReLUs form a tent

For one-dimensional input, define

```text
a1 = ReLU(x)
a2 = ReLU(x-1)
ŷ  = a1 - 2a2
```

When `x<0`, both are zero. For `0≤x<1`, `ŷ=x`. For `x≥1`, `ŷ=x-2(x-1)=2-x`. Two ReLUs have produced a piecewise-linear function that rises and then falls. The learned “features” are not named columns; weights and biases decide where each region applies.

The model has two first-layer weights, two first-layer biases, two output weights, and one output bias: seven parameters. A parameter position still counts even if its current value happens to be zero.

## Recitation and homework connection

Recitation 6 provides a `2→2→1` network and asks students to compute `z1`, post-ReLU `a`, `z2`, the sigmoid output, loss, and parameter counts. That is this lecture's essential graph-reading skill: establish tensor shapes before calculating values.

HW6 then derives backward formulas for linear, sigmoid, and softmax-cross-entropy layers. That work belongs mainly to Lecture 12, but it also checks whether Lecture 11's forward notation is unambiguous. The public PDF supports manual work; the full autograder and feedback remain restricted.

## Extension: handcrafted features versus representation learning

Polynomial features fix a basis and learn only final weights. A neural network learns the basis as well. The cost is that the objective is generally nonconvex, parameters have symmetries, and outcomes are more sensitive to initialization and optimization. Added expressiveness makes Lecture 10's model-selection discipline more important, not obsolete.

Lecture 12 addresses the computational question. Expanding a separate chain rule for every parameter repeats the same derivatives. Backpropagation traverses the computation graph backward while reusing local results.

## What to do tonight

Draw a `2→3→2` network and label the shape of every `W`, `b`, `z`, and `a`. Count all parameters. Choose one two-dimensional input and small integer weights, then compute a complete forward pass. Finally, derive the loss gradient for one output-layer weight to prepare for Lecture 12.

## References

- [CMU 07-280 Spring 2026 Lecture 11 slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec11_Neural_Networks_I.pdf)
- [Neural Networks pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Neural_Networks.pdf)
- [Recitation 6 solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec6_sol.pdf)
- [HW6 written component](https://www.cs.cmu.edu/~07280/assignments/hw6_blank.pdf)
