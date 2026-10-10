---
title: "CS224N Lecture 3: Matrix Calculus and Backpropagation"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224n, neural-network, backpropagation, nlp, stanford]
lang: en
series:
  name: "Reading Stanford CS224N"
  order: 4
tldr: "Lecture 3 decomposes neural-network training into computation graphs, local derivatives, and the chain rule: the forward pass computes a result; backprop accumulates gradients from the output so every parameter knows how to move."
description: "A lecture-by-lecture reading of CS224N Winter 2026 Lecture 3: neurons, matrix calculus, computation graphs, and backpropagation."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs224n-backprop-neural-nets)

**Video status: Related supplementary video included; the original lecture recording has not been verified.** [Source details](#course-video-sources)

The [official CS224N Winter 2026 schedule](https://web.stanford.edu/class/cs224n/) places lecture 3 on January 13, 2026, but does not name a lecturer; this article therefore attributes it only to the course staff. The [official deck](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture03-neuralnets.pdf) is titled Neural Network Foundations; its agenda reviews word-vector evaluation, introduces neural networks, and then covers matrix calculus and backpropagation. The purpose is not a generic deep-learning overview. It establishes the training language used by every later model.

## Course video sources

This article uses Winter 2026 materials. The Spring 2024 recording(s) below cover the same topic as supplementary material and are not Winter 2026 lecture recordings (Winter 2026 recordings are on Canvas behind sign-in, and the course says they are not open to non-enrolled students).

```youtube
url: https://www.youtube.com/watch?v=HnliVHU2g9U
title: Stanford CS224N: NLP with Deep Learning | Spring 2024 | Lecture 3 - Backpropagation, Neural Network
```

Original videos: [Stanford CS224N: NLP with Deep Learning | Spring 2024 | Lecture 3 - Backpropagation, Neural Network](https://www.youtube.com/watch?v=HnliVHU2g9U)

Course and recording entries:

- [CS224N Spring 2024 public recordings (supplementary)](https://www.youtube.com/playlist?list=PLoROMvodv4rOaMFbaqxPDoLWjDaRAdP9D)
- [Official course / lecture source](https://web.stanford.edu/class/cs224n/)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): what was checked is how the Spring 2024 video (taught by Manning, about 73 minutes) relates to this article, which is based on the Winter 2026 slides; it is not the 2026 classroom recording. The transcript covers neurons as small logistic units, matrix calculus and Jacobians, gradients having the same shape as the parameters (shapes, roughly 55 to 62%), the chain rule, computation graphs and the forward/backward pass (including accumulating gradients at branches), a PyTorch start and assignment two logistics, and manual gradient checking around 92%, matching the first half of this article. The transcript never mentions numerator layout, merging softmax with cross-entropy, the memory cost of backprop, optimizers or learning rates, so the corresponding sections rest on the Winter 2026 slides and this site's own additions, not on the video.

## From linear classifiers to neural networks

A linear model multiplies an input by weights and adds a bias. It learns a decision plane but cannot express a complex curved boundary with one layer. A neural network composes affine transformations with nonlinear functions, allowing hidden layers to learn features useful to the task.

In NLP, inputs often begin as word vectors. A model combines vectors into a hidden representation and produces class scores. The operational point is not that a neuron resembles a brain. It is that the function is differentiable: once a loss says how wrong the output is, we can calculate each parameter's contribution.

## In matrix calculus, track shapes first

The slides spend substantial time on vector and matrix derivatives. The most dependable implementation habit is not memorizing every identity but labelling shapes. Inputs, weights, hidden states, outputs, and the gradient of a parameter must have compatible dimensions.

Softmax normalizes scores into probabilities; cross-entropy selects the negative log probability of the correct class. Combined, their gradient with respect to logits becomes predicted probabilities minus the one-hot target. The same structure appeared in the word2vec objective.

## Backprop is dynamic programming on a computation graph

The [classic backpropagation paper](https://www.nature.com/articles/323533a0) gives the core pattern: the forward pass evaluates intermediate nodes and the loss, while the backward pass starts at the loss and applies the chain rule in reverse. When a node contributes through multiple paths, its gradient sums those contributions. The [CS231n backpropagation notes](https://cs231n.github.io/optimization-2/) provide an implementation-oriented derivation.

Thinking of this as dynamic programming is useful: shared intermediate derivatives are computed once and reused rather than symbolically re-expanding the whole expression for every parameter. Autodiff frameworks automate that process, but they cannot tell you that the loss is conceptually wrong, broadcasting changed the computation, or the graph was accidentally detached.

## A concrete understanding check

Hand-compute the forward pass and one parameter gradient for a tiny network, then compare with finite differences: perturb that parameter slightly in both directions and observe the loss change. Numerical gradients are too slow for training but excellent for checking. If the values disagree, inspect shapes, signs, averaging, and summation before blaming the framework.

## A complete two-layer forward path

For input (x), compute (z=Wx+b), apply ReLU, project hidden state to logits, then use softmax cross-entropy. Backward requires saved inputs and activations. Batch dimensions and legal-but-wrong broadcasting are common sources of silent errors, so annotate every shape.

## Matrix-calculus local rules

Given (z=Wx) and upstream gradient (g_z):

\[
\frac{\partial L}{\partial W}=g_zx^T,\qquad
\frac{\partial L}{\partial x}=W^Tg_z.
\]

Scalar gradients match their parameter shapes. Elementwise nonlinearities multiply by local derivatives without materializing full Jacobians.

## Branches, sharing, and accumulation

Gradients from multiple graph paths add. Residual connections provide an identity gradient route; shared RNN weights accumulate contributions across time; repeated embedding rows accumulate across examples. In-place operations can destroy values needed for local derivatives.

## Stable softmax cross-entropy

Log-sum-exp avoids overflow and underflow, while the combined derivative simplifies to (p-y). Sum versus mean reduction changes gradient scale. Framework defaults therefore matter when batch size changes.

## Compute, memory, and checking

Reverse-mode autodiff efficiently differentiates one scalar loss with many parameters but stores activations. Checkpointing trades recomputation for memory; mixed precision needs attention to underflow; gradients accumulate until explicitly cleared.

## Gradient checking in practice

Use centered finite differences on a few double-precision parameters with randomness disabled. Avoid nondifferentiable ReLU boundaries. Add sanity checks: overfit ten examples, expect initial loss near (log C), and verify zero learning rate leaves weights unchanged.

## Connection to Assignment 2

The public assignment moves from word2vec derivatives to a neural dependency parser. Start with shape tests, verify loss decreases on a tiny fixed batch, then train and perform error analysis. Backprop optimizes the supplied loss and data; persistent parser failures may expose missing representation or examples rather than an optimizer problem.

## An optimizer cannot repair the graph

SGD and Adam only consume gradients. Shifted targets, unmasked padding, or a sign error can still optimize smoothly toward the wrong objective. Verify forward logic and local derivatives before tuning, and preserve seeds, batches, initial losses, and gradient norms.

Require shape assertions, agreement between numerical and analytic gradients, and overfitting on ten examples. They test interfaces, derivatives, and the full loop.

## Material gap

Winter 2026 recordings are not public. This article covers the four agenda components in the deck but does not claim the complete board derivation or classroom questions. The deck's “Lecture Plan” mistakenly says Lecture 2; its filename, cover, and official schedule identify it as Lecture 3.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Switched to related supplementary video: embedded the Spring 2024 public recording on the same topic; the Winter 2026 original is behind sign-in and could not be verified.
- 2026-10-10: Checked the video content against its transcript. The 2024 video covers neurons, matrix calculus, shapes, computation graphs and gradient checking, matching the article's main line; softmax plus cross-entropy, memory cost and optimizers are not in the video and are marked as not video content.

## References

- [Official CS224N Winter 2026 course page](https://web.stanford.edu/class/cs224n/)
- [Lecture 3 Neural Network Foundations slides](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture03-neuralnets.pdf)
- [CS231n backpropagation notes](https://cs231n.github.io/optimization-2/)
- [Learning Representations by Back-propagating Errors](https://www.nature.com/articles/323533a0)
