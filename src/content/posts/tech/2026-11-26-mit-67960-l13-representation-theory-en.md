---
title: "MIT 6.7960 L13: Theory of Representation — Inductive Biases, Gaussian Processes, and the NN–GP Correspondence"
date: 2026-11-26
category: tech
tags:
  - mit-67960
  - deep-learning
  - representation-learning
  - gaussian-process
  - neural-tangent-kernel
  - fall-2024
lang: en
description: "MIT 6.7960 Fall 2024 OCW Lecture 13 (Jeremy Bernstein): how architecture's inductive bias decides the representation, why wide nets converge to a Gaussian process (NN–GP), and how the Neural Tangent Kernel (NTK) describes infinite-width training dynamics with a fixed kernel."
tldr: "Take a net to infinite width and its random-init output becomes a Gaussian process (NN–GP); its training dynamics freeze into the Neural Tangent Kernel (NTK). This theory analyzes nets and, in reverse, guides us to design the 'right inductive bias'."
draft: false
series:
  name: "MIT 6.7960 導讀 (Fall 2024 OCW)"
  order: 15
additionalSeries:
  - name: "Global AI/CS Course Map"
    order: 21
---

> 🌏 [中文版](/posts/tech/2026-11-26-mit-67960-l13-representation-theory)

> **Source version**: based on **MIT 6.7960 Fall 2024 OCW**. Videos, slides, and assignments are public at [MIT OCW](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/). This lecture is taught by **Jeremy Bernstein**; optional readings include *Kernel Methods for Deep Learning* and *Neural Networks as Gaussian Processes*.

---

## Inductive bias: the architecture "makes assumptions for you"

We have talked a lot about "how to learn representations", but this lecture steps back and asks: **what a representation looks like is largely decided by the architecture itself**. That is **inductive bias** — before seeing any data, the structure already prefers a certain class of functions.

- CNN's local connectivity + weight sharing assumes "spatial translation invariance, local correlation".
- RNN's recurrence assumes "one shared transition rule over time".
- Transformer's global attention assumes "any two positions may depend on each other".

So choosing an architecture is not aesthetics — it is **choosing which data structure you trust first**. This also explains why CNNs are data-efficient on images and Transformers have a higher ceiling on text: when inductive bias matches the data, you win at the starting line.

## Wide nets → Gaussian process (NN–GP)

Here is the beautiful theoretical result. Consider a **single hidden layer, extremely wide** network with randomly initialized weights:

```
f(x) = Σ_{k=1}^{K} a_k · φ(w_kᵀ x + b_k)     (K → ∞)
```

By the **central limit theorem**, as `K → ∞`, for any set of inputs `{x_1 … x_n}`, the network outputs `{f(x_1) … f(x_n)}` converge to a **multivariate Gaussian**. In other words: a randomly initialized infinite-width network *is* a **Gaussian Process (GP)**, whose kernel is determined by the activation and weight distribution. This is the **NN–GP (Neural Network – Gaussian Process) correspondence** (Neal 1994; Lee et al. 2018).

Intuitively: each wide hidden neuron is a "random feature"; summing them (with random weights) is averaging over many random features — and the more you average, the closer the distribution to Gaussian.

You can feel this with a tiny numpy snippet:

```python
import numpy as np

def nn_gp_sample(xs, K=200000, width=64):
    # each hidden unit makes a random projection then relu, averaged over K units
    rng = np.random.default_rng(0)
    out = np.zeros(len(xs))
    for _ in range(K):
        w = rng.normal(size=width)
        b = rng.normal()
        h = np.maximum(0, xs @ w + b)        # relu random feature
        a = rng.normal()                      # random output weight
        out += a * h
    return out / np.sqrt(K)                   # average → approaches Gaussian

xs = np.linspace(-3, 3, 50)
samples = np.stack([nn_gp_sample(xs) for _ in range(5)])
```

The five resulting function curves look like samples drawn from a smooth GP — exactly the NN–GP intuition.

## Training dynamics → the Neural Tangent Kernel (NTK)

NN–GP describes the **randomly initialized** network. What about after training? The **Neural Tangent Kernel (NTK, Jacot et al. 2018)** answers: in the infinite-width limit, the network's "function-space gradient" is governed by a **fixed, stationary kernel** `Θ`, and the entire training trajectory has a closed-form kernel-regression solution.

In other words: an infinite-width network's training **is equivalent to a fixed kernel method**. Two implications:

1. **It explains why extremely wide nets train easily**: the NTK is fixed and positive-definite, so gradient descent is guaranteed to converge.
2. **It also reveals the limit of ultra-wide nets**: because the kernel is fixed, the net degenerates into a "linear model" and cannot learn features (back to the lazy training regime from L07). This is exactly why **the real power of deep learning comes from the finite-width, feature-learning regime** — which NTK cannot describe.

## What this theory is good for in practice

Do not dismiss this as math gymnastics:

- **Bayesian uncertainty from NTK / NN–GP**: model output uncertainty without training.
- **Guide architecture design**: inductive bias decides the representation, so "think about data structure first, then pick architecture" is not empty talk.
- **Bound the gains of scaling**: as width → ∞, returns saturate (kernel freezes); to keep improving you need depth and feature learning, not blind widening.

## Why this matters in practice

This lecture closes several loose threads: **inductive bias decides the representation's shape (L13 itself), the infinite-width limit is theoretically analyzable but degenerate (NTK/NN–GP), and the real deep-learning power lives in the finite-width feature-learning regime (L07)**. Together they complete the picture of "why nets learn the way they do".

Next lecture (L14) turns to generative models: from density / energy models to GANs, autoregressive, and diffusion.

## References

- MIT 6.7960 OCW (Fall 2024): [course home](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)
- Lee et al., *Deep Neural Networks as Gaussian Processes*: [arXiv:1711.00165](https://arxiv.org/abs/1711.00165)
- Matthews et al., *Gaussian Process Behaviour of Wide Neural Networks*: [arXiv:1804.11271](https://arxiv.org/abs/1804.11271)
- Jacot et al., *Neural Tangent Kernel*: [arXiv:1806.07572](https://arxiv.org/abs/1806.07572)
