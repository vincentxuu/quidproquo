---
title: "Stanford CS229 Spring 2021 Lecture 8: Building a Neural Network from Logistic Regression"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, stanford, neural-networks, deep-learning]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 9
tldr: "A neural network repeatedly composes affine maps z=Wᵀa+b with nonlinear activations. Forward propagation defines the prediction, mini-batch gradient descent updates the parameters, and hidden units let the model learn intermediate representations jointly."
description: "A reading of Stanford CS229 Spring 2021 Lecture 8: mini-batch SGD, logistic regression, softmax, multilayer notation, and vectorized forward propagation."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-spring2021-lecture-08-neural-networks)

This is post 9 in [Reading Stanford CS229](/en/series/stanford-cs229), covering **Stanford CS229, Spring 2021, Lecture 8**. The course schedule dates it April 21, 2021, under the official title **Neural Networks 1.** This article uses the Spring 2021 Live Lecture Notes and the shared Deep Learning notes. The recording was not used as a source.

The lecture does not begin with a large modern architecture. It decomposes logistic regression into a linear computation and an activation, then stacks that pattern layer by layer. A neural network is not an unrelated mathematical species; it is a composition of familiar predictive units trained together as a computation graph.

## Keeping the optimization problem in view

For examples `{(xᵢ,yᵢ)}` and per-example loss `ℓ(hθ(xᵢ),yᵢ)`, empirical risk is

```text
J(θ) = (1/n) Σᵢ ℓ(hθ(xᵢ), yᵢ)
```

Full-batch gradient descent uses every example at each step. Stochastic gradient descent uses one, making each update cheap but noisy. Lecture 8 places a mini-batch between them: sample `B` examples, average their gradients, and update.

```text
g = (1/B) Σⱼ ∇θ ℓ(hθ(xⱼ), yⱼ)
θ ← θ - ηg
```

The notes emphasize that matrix operations over a batch are usually more efficient on available hardware than processing the same gradients sequentially. They do not claim that one batch size is universally optimal. Memory, throughput, and gradient noise remain tradeoffs.

## Logistic regression is already a neuron

Binary logistic regression computes

```text
z = wᵀx + b
a = σ(z)
```

The sigmoid maps the score into the interval from zero to one. Binary cross-entropy is

```text
L(a,y) = -y log a - (1-y) log(1-a)
```

Treat `wᵀx+b` as the linear component and `σ` as the activation, and logistic regression becomes a minimal neural unit. Lecture 8 then changes the question from detecting the presence of a cat to choosing among several animal categories.

For mutually exclusive classes, softmax normalizes class scores:

```text
aₖ = exp(zₖ) / Σⱼ exp(zⱼ)
```

With a one-hot label, cross-entropy selects `-log aᵧ` for the correct class. This formulation assumes that exactly one class applies. A multilabel problem needs a different output interpretation.

## What a hidden layer learns

A multilayer network feeds one layer's output into the next:

```text
z^[l] = W^[l] a^[l-1] + b^[l]
a^[l] = g^[l](z^[l])
```

The input is `a^[0]=x`; the final `a^[L]` is the prediction. Hidden units form new representations from the previous layer. In the house-price sketch, raw variables may combine into signals such as family size, location, or quality before reaching the output. Those labels are intuition, not a theorem that every trained unit acquires a clean human name.

Without nonlinear activations, stacked affine maps collapse into one:

```text
W₂(W₁x+b₁)+b₂ = W'x+b'
```

Depth alone is therefore insufficient. Nonlinearity allows the composition to represent functions beyond a single linear model. The notes introduce sigmoid, tanh, and ReLU, leaving their training behavior to Lecture 9.

## Vectorization is more than compact notation

Put a batch of `n` examples into the columns of `X`. A full layer can then be computed as

```text
Z^[l] = W^[l] A^[l-1] + b^[l]
A^[l] = g^[l](Z^[l])
```

The bias is broadcast across the batch dimension. This representation avoids rewriting the formula per example and lets implementations use efficient matrix multiplication. Shape checking becomes a direct debugging tool: if layer `l` has `n_l` units, `W^[l]` must map an `n_{l-1}`-dimensional input to an `n_l`-dimensional output.

Lecture 8 ends after defining forward propagation. It explains how `x` becomes `ŷ` and which loss should be minimized, but not yet how to compute every layer's gradient efficiently. That is the starting point of Lecture 9.

## Limits of the lecture

The public notes focus on fully connected networks. They do not develop convolution, attention, or the engineering details of very deep architectures. Nor do they guarantee that a hidden neuron learns a particular semantic concept. A hidden representation is a learned intermediate transformation; interpretability and generalization still depend on the data, objective, architecture, and optimization.

Mini-batch vectorization also does not solve optimization by itself. A nonconvex objective can have multiple stationary points, while batch size and learning rate alter the training path. Lecture 8 establishes a computational framework, not a convergence guarantee.

## Where Lecture 8 sits in the eighteen-lecture path

Lecture 7 fixed an implicit feature space by choosing a kernel. Lecture 8 lets multilayer parameters learn a representation jointly. Lecture 9 will traverse today's computation graph in reverse to compute derivatives, then address activations, initialization, vanishing or exploding gradients, and momentum.

For a concrete check, draw a two-layer network and label the matrix shape of every `W`, `b`, `z`, and `a`. Then compute one example's forward pass. A shape mismatch is usually evidence that the mapping between layers is still underspecified, not merely a missing transpose.

## Beyond the lecture

Implement the same forward pass once with an example loop and once with matrix operations. Verify that their outputs match before measuring larger batches. The exercise turns the claim that vectorization is faster into a testable implementation fact and makes broadcasting mistakes visible as concrete shape errors.

## References

- [Stanford CS229 Spring 2021 syllabus](https://cs229.stanford.edu/syllabus-spring2021.html)
- [Lecture 8 Live Lecture Notes](https://cs229.stanford.edu/notes2021spring/notes2021spring/lecture8_live.pdf)
- [Deep Learning notes](https://cs229.stanford.edu/notes2020fall/notes2020fall/deep_learning_notes.pdf)
