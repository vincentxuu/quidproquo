---
title: "MIT 6.7960 L08: Transformers — Tokens, Attention, Positional Codes, and How They Relate to MLPs/CNNs/GNNs"
date: 2026-08-30
category: tech
type: guide
tags:
  - mit-67960
  - deep-learning
  - transformer
  - attention
  - positional-encoding
  - fall-2024
lang: en
description: "MIT 6.7960 Fall 2024 OCW Lecture 8 (Phillip Isola): the three core ideas of Transformers (token, attention, positional code), and why they are really variants of the same message-passing family as MLPs, CNNs, and GNNs."
tldr: "A Transformer is not an architecture from nowhere: tokens discretize data, attention does soft aggregation, positional codes restore order. Seen next to MLPs/CNNs/GNNs, all of them are special cases of 'weighted aggregation over neighbors'."
draft: false
series:
  name: "MIT 6.7960 導讀 (Fall 2024 OCW)"
  order: 10
additionalSeries:
  - name: "Global AI/CS Course Map"
    order: 16
---

> 🌏 [中文版](/posts/tech/2026-10-22-mit-67960-l08-transformers)

> **Source version**: based on **MIT 6.7960 Fall 2024 OCW**. Videos, slides, and assignments are public at [MIT OCW](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/). This lecture is taught by **Phillip Isola**; the required reading is the *Transformers* note (examples are visual, but the architecture applies to any data).

---

## The three core ideas

Lecture 8 breaks the Transformer into three independent but interlocking ideas:

1. **Token**: slice the input into a set of discrete units (subwords for text, patches for images, time steps for sequences). Tokenization lets one architecture handle arbitrarily structured data.
2. **Attention**: each token "looks at" every other token and aggregates their information weighted by relevance. This is a soft, data-driven message aggregation — not the hard-coded local receptive field of a CNN.
3. **Positional code**: because attention itself is order-agnostic (shuffle the tokens and the attention output just permutes), you must explicitly inject "position" into the representation.

Together these yield an architecture that handles variable-length, arbitrarily structured input and models global dependencies.

## The math and intuition of attention

Scaled dot-product attention at its core:

```
Attention(Q, K, V) = softmax(Q Kᵀ / √d_k) V
```

- `Q` (query), `K` (key), `V` (value) are all linear projections of the input tokens.
- `Q Kᵀ` measures how well "what this token is looking for" matches "what that token offers" — a similarity score.
- `softmax` turns scores into a probability (normalized weights).
- Those weights do a weighted average over `V`, producing each token's output representation.

Multi-head attention simply projects `Q/K/V` into several subspaces, runs attention in each, then concatenates — letting the model attend to different kinds of dependency (syntax, semantics, distance, …) at once.

A minimal PyTorch implementation:

```python
import torch
import torch.nn.functional as F

def scaled_dot_product_attention(q, k, v):
    # q, k, v: (batch, seq_len, d_k)
    d_k = q.size(-1)
    scores = (q @ k.transpose(-2, -1)) / (d_k ** 0.5)
    weights = F.softmax(scores, dim=-1)
    return weights @ v, weights
```

## Positional encoding: restoring order

Pure attention is **permutation equivariant** — change the input order and the output merely reorders; the model itself has no notion of before/after. Three common fixes:

- **Sinusoidal (Vaswani original)**: position vectors from sine/cosine at varying frequencies, added to token embeddings. Benefit: extrapolates to sequences longer than seen in training.
- **Learned positional embedding**: simply learn a position lookup table. Simple, but does not naturally extrapolate.
- **RoPE (Rotary Position Embedding)**: encodes position into a rotation so that *relative* position shows up directly in the inner product — one of the主流 choices in today's LLMs.

The choice is fundamentally a trade-off between giving up extrapolation for expressive flexibility.

## Why it is family with MLP / CNN / GNN

The most illuminating point of this lecture: put the Transformer next to the architectures you already studied, and they are all special cases of **"weighted aggregation over neighbors (message passing)"** — differing only in *who counts as a neighbor* and *how weights are computed*:

- **MLP**: each neuron sees every neuron in its layer (fully connected = everyone is a neighbor); weights are fixed parameters.
- **CNN**: each pixel sees only its local 3×3 neighbors; weights are spatially shared convolution kernels.
- **GNN**: each node sees only graph-connected nodes; weights are decided by edges.
- **Transformer**: each token sees **all** tokens (global neighbors); weights are computed dynamically from the data itself (QK similarity).

So the Transformer does not "overturn" earlier architectures — it expands the neighbor set to global and turns static weights into dynamic, data-dependent ones. That also explains why it shines at long-range dependency (e.g., a pronoun at the end of a sentence referring to a noun at the start).

## Why this matters in practice

- **Do not mythologize the Transformer**: it is an architecture with very weak inductive bias (global attention assumes almost no structure), so its data efficiency is usually worse than CNNs (vision) or GNNs (graphs), yet its ceiling is highest when data is abundant.
- **Attention is not free**: the `O(n²)` sequence-length complexity means long sequences are VRAM-hungry. In practice mitigate with FlashAttention, sparse attention, or chunking long sequences.
- **Positional encoding is a hidden landmine**: if your task is order-sensitive (most are) and you forget positional codes, performance collapses.

## References
- MIT 6.7960 OCW (Fall 2024): [course home](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)
- Vaswani et al., *Attention Is All You Need*, 2017: [arXiv:1706.03762](https://arxiv.org/abs/1706.03762)
- Su et al., *RoFormer: Enhanced Transformer with Rotary Position Embedding (RoPE)*, 2021: [arXiv:2104.09864](https://arxiv.org/abs/2104.09864)
- Stanford CS224N lecture notes (attention): [course home](https://web.stanford.edu/class/cs224n/)

