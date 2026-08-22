---
title: "CMU 07-280 Stage Review II: Building AlexNet and GPT-2 as Working Systems"
date: 2026-08-22
category: ai
tags: [cmu, ai-course, alexnet, gpt-2, deep-learning]
lang: en
series:
  name: "Reading CMU 07-280"
  order: 26
type: deep-dive
tldr: "Stage II uses HW8 and HW11 to test whether representation, computation graphs, training, transfer, and generation actually connect, rather than treating CNNs and Transformers as diagrams to memorize."
description: "A synthesis of the AlexNet and GPT-2 pathways in CMU 07-280 Spring 2026, from CNNs and fine-tuning to tokenization, attention, and perplexity."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cmu-07280-stage-2-alexnet-gpt2)

One distinctive choice in 07-280 is that neural networks do not end with a two-layer MLP. Students continue by assembling two landmark systems: AlexNet in HW8 and GPT-2 in HW11. The point is not to reproduce historical leaderboard numbers. It is to turn feature learning, autograd, optimization, and generalization into programs that can fail.

This review checks the image and language stages together. It does not imply that public notebooks reproduce the enrolled experience; Gradescope, compute, staff help, and solution feedback remain part of the formal course. Independent learners can still reconstruct meaningful acceptance criteria from the public written specifications.

## AlexNet: placing spatial structure into representation

A fully connected layer does not privilege neighboring pixels. A CNN writes a spatial prior into the model with local receptive fields and shared kernels. One-dimensional convolution at a single output position can be written as:

```text
y[i] = Σ_k w[k] · x[i + k]
```

The same `w[k]` is reused across positions, so parameters do not scale directly with image width and height. Pooling or stride shrinks feature maps and buys some translation robustness. AlexNet stacks these parts with nonlinearities, normalization, and a classification head to create a trainable system.

The [HW8 written specification](https://www.cs.cmu.edu/~07280/assignments/hw8_blank.pdf) asks students to compare parameter counts across a scratch AlexNet, TorchVision AlexNet, and MobileNet, then inspect loss and accuracy under different dataset sizes. That tests more than layer-count trivia: a shared architecture name does not guarantee the same classifier head, input dimensions, or parameter count.

## Frozen and unfrozen are not merely two buttons

HW8 also compares frozen and unfrozen fine-tuning. A frozen backbone acts as a fixed feature function while only the new head learns; an unfrozen model sends gradients into more layers.

```text
frozen:   image → fixed backbone → trainable head → loss
unfrozen: image → trainable backbone → trainable head → loss
```

Freezing is cheaper and can reduce overfitting, but may not adapt to a distant target domain. Unfreezing raises adaptation capacity and the demands on data, memory, and learning-rate control. Dataset size, domain shift, and compute determine the useful update scope.

Reproduce the comparison with a small image dataset tonight. Hold the seed, split, epochs, and augmentation fixed; change only whether the backbone is frozen. Record trainable parameter count and epoch time alongside final accuracy so that any gain has an explicit cost.

## GPT-2: parallel conditional prediction over sequences

The GPT-2 stage first turns text into tokens, then represents token identity and position. Self-attention lets each position compare a query with keys and combine values:

```text
Attention(Q, K, V) = softmax(QKᵀ / √d_k) V
```

A causal mask prevents a position from reading future tokens, producing a next-token objective. Training can still process all positions in parallel; generation must append each sampled token and continue autoregressively.

The [HW11 written specification](https://www.cs.cmu.edu/~07280/assignments/hw11_blank.pdf) asks for training-loss and perplexity plots, then compares generation across prompts and temperatures. If average cross-entropy is `L`, perplexity is `exp(L)`. Lower perplexity means more probability on observed next tokens; it does not guarantee factual or useful text.

## Temperature changes sampling, not knowledge

Divide logits `z` by temperature `T` before softmax:

```text
p_i = exp(z_i / T) / Σ_j exp(z_j / T)
```

A lower `T` sharpens the distribution and usually stabilizes output; a higher value admits more tail tokens and variation. This control cannot add missing facts or repair a faulty representation. One generation from one prompt is too noisy to establish a model characteristic.

A better replication fixes four prompts, produces several samples per temperature, and records repetition, coherence breaks, format adherence, and obvious errors. It is not a complete LLM evaluation, but it preserves the observational discipline HW11 is designed to teach.

## The shared skeleton behind both assignments

AlexNet and GPT-2 use different inputs and layers, but impose the same experimental duties: check tensor shapes, make the forward pass traceable, confirm gradients reach intended parameters, establish a baseline, and change one variable at a time. Autograd computes derivatives; it does not detect data leakage, reversed masks, or a contaminated validation split.

The Stage II exit test is therefore not “both notebooks ran.” You should be able to reconstruct a forward pass from a tensor-shape table, explain why frozen parameters lack gradients, and connect a loss or perplexity curve to a concrete hypothesis. Only then has an architecture become a system.

## References

- [CMU 07-280 official course site and assignment table](https://www.cs.cmu.edu/~07280/)
- [CMU 07-280 syllabus](https://www.cs.cmu.edu/~07280/07280_syllabus_v1.pdf)
- [HW8: Building AlexNet](https://www.cs.cmu.edu/~07280/assignments/hw8_blank.pdf)
- [HW11: Building GPT-2](https://www.cs.cmu.edu/~07280/assignments/hw11_blank.pdf)
- [Neural Networks notes](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Neural_Networks.pdf)
- [CNN notes](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_CNNs.pdf)
