---
title: "MIT 6.7960 L07: Scaling Rules for Optimization — Spectral View, Feature Learning, Hyperparameter Transfer"
date: 2026-10-15
category: tech
tags:
  - mit-67960
  - deep-learning
  - optimization
  - scaling
  - maximal-update-parameterization
  - fall-2024
lang: en
description: "MIT 6.7960 Fall 2024 OCW Lecture 7 (Jeremy Bernstein): a spectral/geometric view of neural-net optimization, the feature-learning vs lazy-training divide, hyperparameter transfer across width/depth (μP), and optimization scaling laws such as the critical batch size."
tldr: "Optimization is not an isolated numerical problem: view SGD spectrally, the magnitude of weight updates determines feature learning; Maximal Update Parameterization transfers LR/init across width, and the critical batch size sets the marginal return of trading compute for convergence."
draft: false
series:
  name: "MIT 6.7960 導讀 (Fall 2024 OCW)"
  order: 9
additionalSeries:
  - "Global AI/CS Course Map"
---

> 🌏 [中文版](/posts/tech/2026-10-15-mit-67960-l07-scaling-rules-optimization)

> **Source version**: based on **MIT 6.7960 Fall 2024 OCW**. Videos, slides, and assignments are public at [MIT OCW](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/). This lecture is taught by **Jeremy Bernstein**; the required reading is his note *Steepest Descent*.

---

## Why devote a whole lecture to "scaling rules for optimization"

L03 covered SGD / Adam, L04 covered regularization, L06 covered CNN architectures. All of them implicitly assume one thing: **the network is small enough and the hyperparameters are easy enough to tune**. The moment you push width from 256 to 8192 or depth from 12 to 100 layers, a learning rate that worked perfectly suddenly explodes or dies.

The central claim of Lecture 7 is that **optimization behavior changes systematically with network scale, and that change is predictable and transferable**. You do not need to re-run a grid search for every new width — once you understand the underlying "scaling laws", you can lift the hyperparameters straight from a small network onto a large one.

## A spectral view of neural computation

The most illuminating part of this lecture is reframing the entire forward/backward pass as the **spectrum (eigenvalue distribution) of matrices at work**.

Consider a linear layer `y = Wx`. The singular-value distribution of `W` decides whether the layer amplifies certain directions or squashes everything. When you chain many `W`s in a deep net, if every layer's singular values exceed 1 the signal grows exponentially (exploding); if they are all below 1 it decays exponentially (vanishing). Good initialization (Xavier / Kaiming) is essentially keeping each layer's spectral radius near 1 so the signal propagates stably through depth.

Flip this to optimization: an SGD update `ΔW = -η · g` is a step in parameter space along the gradient. The *direction* of the gradient is set by the loss surface, but the *step size* `η` and the *scale* of `g` shift dramatically with network width. That is exactly why a fixed `η` breaks the instant width changes.

## Feature learning vs lazy training

This lecture surfaces a divide that is often overlooked:

- **Lazy training**: after initialization the network function barely moves; weights only微调 near their starting point. Infinite-width NTK-limit networks are exactly this. The upside is clean theory; the downside is that no "features" are learned — it is essentially just linearly recombining a fixed basis.
- **Feature learning**: the magnitude of each update is large enough that the network genuinely rewires its internal representations into something useful for the task. This is where deep learning's real power lives.

The decisive variable is the **per-update magnitude (update scale)**. If `η` is too small or gradients are over-scaled, the net collapses into the lazy regime; with the right update magnitude you enter the feature-learning regime. That turns "how do I set the learning rate" from folklore into a principled question.

## Hyperparameter transfer: Maximal Update Parameterization (μP)

This is the most practically useful takeaway of the lecture. Yang et al. (2022), **Maximal Update Parameterization**, prove that there exists a parameterization under which **in the infinite-width limit, the update magnitude of every layer stays finite and independent of width**.

The intuition:

- In standard parameterization, a weight `W ∈ R^{d×d}` initialized with variance `1/d` has its per-update absolute magnitude scale with `d`.
- μP instead scales the input side by `1/d_in` and the output side by `1` (rather than the standard `1/d_in` on both sides), so the *scale of the weight update* stays constant as width changes.

The payoff: **hyperparameters — learning rate, initialization, and scaling factors — tuned on a small network (say width 256) transfer almost unchanged to a width-8192 network, with virtually no retuning**. For teams training foundation models this is a massive time saver: do the expensive search once on a small net, then extrapolate linearly.

A minimal PyTorch sketch of μP scaling:

```python
import torch
import torch.nn as nn

class LinearMUP(nn.Module):
    def __init__(self, in_features, out_features, use_mup=True):
        super().__init__()
        self.weight = nn.Parameter(torch.empty(out_features, in_features))
        # μP: std ~ 1/in_features (input-side scaling); standard PyTorch default is 1/fan_avg
        std = (1.0 / in_features) if use_mup else (1.0 / ((in_features + out_features) / 2)) ** 0.5
        nn.init.normal_(self.weight, 0.0, std)
        self.scale = in_features if use_mup else 1.0  # compensate with 1/in at forward

    def forward(self, x):
        return (self.weight @ x.T).T / self.scale
```

The point is not the snippet itself but the philosophy it expresses: **parameterization decides how hyperparameters scale with size**. If you want transferable hyperparameters, design the right parameterization.

## Optimization scaling laws: the critical batch size

The other law comes from McCandlish et al. (2018), *An Empirical Model of Large-Batch Training*. They found that, for a fixed compute budget, there is a **critical batch size `B_crit`**:

- When `batch size < B_crit`: growing the batch roughly linearly accelerates convergence (trade parallelism for time).
- When `batch size > B_crit`: marginal returns collapse; pushing the batch larger just wastes compute, because you are forced into a larger learning rate and the optimizer starts striding in the wrong direction on a flatter loss basin.

The practical implication is blunt: do not blindly max out the batch size. Estimate your `B_crit` (usually extrapolable from small-batch experiments), set the batch near that critical value, and spend the remaining compute on more experiments or a bigger model — instead of making one training run merely *look* faster.

## Why this matters in practice

This lecture ties three scattered ideas into one story:

1. **Initialization / learning rate are not isolated hyperparameters** — they couple with width and depth.
2. **Feature learning needs sufficient update magnitude**; too little and you fall into the lazy regime, especially in large models.
3. **Scaling is predictable**: μP handles width transfer, the critical batch size handles compute allocation.

The most direct engineering lesson: the next time you scale from 100M to 10B parameters, tune hyperparameters with μP on a small net first, then extrapolate linearly — rather than launching a fresh grid search.

## References
- MIT 6.7960 OCW (Fall 2024): [course home](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)
- Jeremy Bernstein, *Steepest Descent* (required note): [author page](https://www.jeremybernstein.com/)
- Yang et al., *Tensor Programs V: Tuning Large Neural Networks via Zero-Shot Hyperparameter Transfer* (μP), 2022: [arXiv:2203.03466](https://arxiv.org/abs/2203.03466)
- McCandlish et al., *An Empirical Model of Large-Batch Training*, 2018: [arXiv:1812.06162](https://arxiv.org/abs/1812.06162)
- Kaplan et al., *Scaling Laws for Neural Language Models*, 2020: [arXiv:2001.08361](https://arxiv.org/abs/2001.08361)

