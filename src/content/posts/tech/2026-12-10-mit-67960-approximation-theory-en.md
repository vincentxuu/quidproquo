---
title: "MIT 6.7960 Approximation Theory — Universal Approximation, Barron's Theorem, and Why Depth Matters"
date: 2026-08-30
category: tech
tags:
  - mit-67960
  - deep-learning
  - approximation-theory
  - universal-approximation
  - barron
  - fall-2024
lang: en
description: "MIT 6.7960 Fall 2024 OCW, Lecture 3 (Jeremy Bernstein): how well can a neural net approximate an arbitrary function? Universal approximation, how Barron's theorem escapes the curse of dimensionality, and why depth (not just width) is what gives deep nets their power."
tldr: "A single hidden layer can in principle approximate any continuous function (universal approximation), but width can blow up exponentially with dimension; Barron's theorem lets error decay as 1/sqrt(n) independent of dimension for a specific function class; and depth yields exponential width savings on compositional functions — that is the real reason deep beats shallow."
draft: false
series:
  name: "MIT 6.7960 導讀 (Fall 2024 OCW)"
  order: 3
additionalSeries:
  - name: "Global AI/CS Course Map"
    order: 23
---

> 🌏 [中文版](/posts/tech/2026-12-10-mit-67960-approximation-theory)

> **Source**: based on **MIT 6.7960 Fall 2024 OCW** (corresponds to OCW Lec 03). Videos, slides, and assignments are all open on [MIT OCW](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/). This lecture is taught by **Jeremy Bernstein**; optional reading includes *Deep Learning Theory Notes* (sections 2 and 5).

---

## The most fundamental question

Earlier lectures covered *how to train*; later ones cover *architectures*. This one steps back and asks a theory question: **how well can a neural network approximate the function we actually want?** This is not mathematical navel-gazing — it directly decides "is the network big enough, and should we go wider or deeper."

## Universal Approximation

The most famous result: **a single hidden layer with a nonlinear activation can approximate any continuous function on a compact set to arbitrary precision, provided the hidden layer is wide enough.**

Formally, for any continuous `f: K → R` (with `K` compact), there is a sufficiently wide

```
f̂(x) = Σ_{k=1}^{K} a_k · σ(w_kᵀ x + b_k)
```

such that `‖f − f̂‖` is arbitrarily small. This theorem (Cybenko 1989; Hornik 1991) is the theoretical basis for "neural nets can learn anything."

The catch is in **"provided it is wide enough"** — how wide exactly? That is the next point.

## Barron's Theorem: Escaping the Curse of Dimensionality

The universal approximation proof is *existential*; it does not tell you the required width `K`. Pessimistically, for general functions `K` can grow **exponentially with input dimension `d`** — the curse of dimensionality.

**Barron's theorem** offers a lifeline: it defines a class of "Barron functions" (functions whose Fourier spectrum decays like `1/|ω|²`, including many smooth functions) and proves that for these, a two-layer net achieves

```
E[‖f − f̂‖²] ≤ C / K
```

where `C` is **independent of the input dimension `d`**. In other words, on the Barron class the sample/width efficiency is `O(1/√K)`, **free of the dimension curse**. This explains why on many low-to-medium dimensional real problems shallow nets work surprisingly well.

## Why Depth Matters: Exponential Expressive Savings

If a single layer can in principle approximate anything, why do we always use **very deep** nets?

The answer: **for the same expressiveness, depth saves massively on width.** For certain functions (especially compositional, hierarchical ones), a shallow net needs **exponential width**, while a deep net needs only **polynomial width**. The classic example: a hierarchical function computable by an `O(n)`-wide, `O(1)`-deep net requires width `O(2ⁿ)` if forced into only two layers.

Results by Telgarsky and by Eldan & Shamir make this precise: depth is not a nice-to-have, it is a **qualitative change in expressive efficiency**. This also echoes L06 (modern CNNs) and later Transformers — the hierarchical representation from depth is something width alone cannot buy.

## A minimal experiment to feel it

Fit a 1D function with a two-layer net and watch how width drives the fit:

```python
import torch, torch.nn as nn, torch.optim as optim

f_true = lambda x: torch.sin(3*x) + 0.3*torch.cos(7*x)
model = nn.Sequential(nn.Linear(1, 64), nn.Tanh(), nn.Linear(64, 1))
opt = optim.Adam(model.parameters(), lr=1e-2)
x = torch.linspace(-3, 3, 200).unsqueeze(1)
y = f_true(x)
for _ in range(2000):
    opt.zero_grad(); loss = ((model(x)-y)**2).mean(); loss.backward(); opt.step()
print("final MSE:", loss.item())
```

Sweep the hidden width from 8 to 1024 and you will see the fit go from underfitting to silky smooth — that is the role of width in universal approximation. Note this is only 1D; once `d` is large and the function is outside the Barron class, the required width explodes, and **adding depth** beats adding width.

## Takeaways for practice

- **Width is not the only lever**: shallow nets suffice for low-dimensional, smooth problems; for high-dimensional, compositional structure, go deeper first.
- **Don't blindly widen**: an ultra-wide shallow net can approximate in theory but trains and generalizes poorly; deep nets carry an inductive bias that fits real data better.
- **Theory answers "why deep"**: not fashion, but expressive efficiency (this also ties back to L13's NTK view — the extremely-wide limit collapses into a linear kernel method).

## References

- MIT 6.7960 OCW (Fall 2024): [course home](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)
- Telgarsky, *The Expressive Power of Neural Networks's Depth*: [arXiv:1702.07811](https://arxiv.org/abs/1702.07811)
- Eldan & Shamir, *Benefits of Depth in Neural Networks*: [arXiv:1602.04485](https://arxiv.org/abs/1602.04485)
- Optional reading for this lecture, *Deep Learning Theory Notes* (see [OCW readings](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/pages/readings/))
