---
title: "Deep Learning: Modules, Backpropagation, and Vectorization"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, stanford, machine-learning, deep-learning, backpropagation]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 8
tldr: "Chapter 7 decomposes neural networks into composable modules and uses backpropagation and vectorization to explain how deep models can be trained efficiently."
description: "A guided reading of Chapter 7 of the 2026 Stanford CS229 notes: MLPs, modern modules, backpropagation, mini-batch SGD, and vectorization."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-07-deep-learning)

This article reads Chapter 7, “Deep learning,” on printed pages 80–113 of the [2026 CS229 main notes](https://cs229.stanford.edu/main_notes.pdf). It is a **chapter-by-chapter reading of the 2026 notes**, not a reconstruction of a quarter's deep-learning recordings.

## From fixed features to learned representations

Earlier models are mostly linear in their parameters. Even when a kernel implies complicated features, the feature map is selected rather than learned end to end. Neural networks replace that model with \(\bar h_\theta(x)\), nonlinear in both inputs and parameters. Regression uses its output directly; binary and multiclass classification treat outputs as logits and apply sigmoid or softmax with the corresponding negative log-likelihood.

Training still minimizes average loss. Mini-batch SGD samples \(B\) examples, averages their gradients, and exploits hardware parallelism. Deep learning has not discarded the earlier vocabulary of losses and gradients; it has replaced \(h_\theta\) with a much more complex differentiable function.

## Nonlinearity is necessary for useful depth

A fully connected layer computes \(z=Wx+b\), followed elementwise by an activation. An MLP repeats

\[
a^{[k]}=\sigma(W^{[k]}a^{[k-1]}+b^{[k]}).
\]

If \(\sigma\) is the identity, several linear layers collapse into one matrix and depth adds no expressive power. ReLU, GELU, and SiLU/Swish prevent that collapse. The notes also explain why sigmoid and tanh are now less common as standalone hidden activations: both saturate and have vanishing derivatives at their extremes.

Writing the penultimate layer as \(\phi_\beta(x)\) makes the connection to Chapter 5 explicit: the output is \(W\phi_\beta(x)+b\). Kernel methods fix or implicitly specify \(\phi\); deep learning optimizes the parameters of \(\phi_\beta\) from data as well.

## Modern networks are compositions of modules

The chapter goes beyond MLPs. A simplified residual block adds its input back to a transformed path. Layer normalization standardizes coordinates within one activation vector, then applies learnable scale and offset; the notes also introduce RMSNorm. One- and two-dimensional convolutions reduce cost through locality and parameter sharing.

Each module encodes assumptions. Convolution favors local shared structure, normalization changes scaling properties, and residual connections preserve a direct information path. They are architectural inductive biases, not decorations guaranteed to improve every problem.

## Backpropagation composes local linear maps in reverse

For a scalar-output computation graph built from differentiable modules, backpropagation computes gradients in time of the same order as forward evaluation. Each module receives an upstream derivative, applies a local backward function to obtain its input derivative, and also computes gradients for its parameters.

For \(Wz+b\), the input gradient is \(W^Tv\), the weight gradient is \(vz^T\), and the bias gradient is \(v\). The reverse pass begins with derivative one at the scalar loss. Intermediate forward activations are needed during backward computation, so efficiency includes memory as well as arithmetic.

## Vectorizing across examples

The notes place examples in columns, while common software puts the batch on dimension zero, with one example per row. Thus a paper expression like \(WX+b\) often becomes \(XW+b\) in code. Broadcasting repeats the bias across examples. Failing to state the dimension convention is a frequent source of errors in handwritten backpropagation.

## Limits and the next chapter

Expressive power does not guarantee easy optimization, generalization, or interpretability. Architecture, initialization, learning rate, batch size, and data scale all matter, while the nonconvex objective lacks the clean guarantees of Chapter 1's quadratic loss.

This chapter reuses Chapter 2's classification losses and extends Chapter 5's representation perspective. Chapter 8 turns to generalization and regularization: why a model with tiny training loss can still perform poorly on unseen data.

## Self-study exercise

Using only matrix operations, implement a two-layer MLP with a ReLU hidden layer and binary logistic loss. Write forward and backward passes, check every parameter gradient with finite differences, and then convert the per-example version into batch-first vectorized code. Verify that both versions produce matching gradients.

## References

- [CS229 Lecture Notes (2026-08-18), Chapter 7: Deep learning](https://cs229.stanford.edu/main_notes.pdf)
- [PyTorch Autograd mechanics](https://docs.pytorch.org/docs/stable/notes/autograd.html)
