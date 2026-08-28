---
title: "MIT 6.7960 L10: Memory and Sequence Modeling — RNNs, LSTMs, and Vanishing/Exploding Gradients"
date: 2026-11-05
category: tech
tags:
  - mit-67960
  - deep-learning
  - rnn
  - lstm
  - sequence-modeling
  - fall-2024
lang: en
description: "MIT 6.7960 Fall 2024 OCW Lecture 10 (Sara Beery): why sequence data needs memory, how the vanilla RNN recurrence causes vanishing/exploding gradients, and how LSTM/GRU gating solves long-range dependency."
tldr: "An RNN compresses the past into a hidden state, but recurrence makes gradients multiply over time — they either vanish or explode; LSTM decouples 'memory' from 'update' via input/forget/output gates so long-range information flows stably. Attention later replaced it because it reaches any history in O(1)."
draft: false
series:
  name: "MIT 6.7960 導讀 (Fall 2024 OCW)"
  order: 12
additionalSeries:
  - name: "Global AI/CS Course Map"
    order: 18
---

> 🌏 [中文版](/posts/tech/2026-11-05-mit-67960-l10-memory-sequence)

> **Source version**: based on **MIT 6.7960 Fall 2024 OCW**. Videos, slides, and assignments are public at [MIT OCW](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/). This lecture is taught by **Sara Beery**; the required reading is the *RNNs* note and *RNN Stability Analysis / LSTMs*.

---

## Why sequences need "memory"

Earlier architectures (MLP, CNN) process each input independently, with no notion of "time". But speech, text, and sensor streams are data whose meaning at step t heavily depends on prior context. To model such dependency the network needs a **state that persists across time**.

## The vanilla RNN and recurrence

The most intuitive design passes a hidden state forward:

```
h_t = tanh(W h_{t-1} + U x_t + b)
y_t = V h_t
```

`h_t` is the "memory": it compresses the information of `x_1 … x_t`. Training uses **BPTT (Backpropagation Through Time)** — unroll the network and backpropagate as if it were a very deep feed-forward net.

## Vanishing / exploding gradients: the cost of recurrence

The problem is in BPTT's chain rule. To update `W`, the gradient must travel `T` steps backward in time, and at each step it multiplies by the recurrence Jacobian `∂h_t / ∂h_{t-1}`. The eigenvalues of that matrix decide everything:

- Eigenvalues **< 1**: after T multiplications they approach 0 → **vanishing gradient**; early time steps learn nothing.
- Eigenvalues **> 1**: after T multiplications they blow up → **exploding gradient**; loss diverges.

Vanishing gradient is the more common pain: the model only captures short-range dependency, and long-range context effectively disappears. Exploding gradient can be simply blocked with **gradient clipping** (capping the gradient norm).

## LSTM / GRU: decoupling memory from update via gating

The key insight of LSTM (Long Short-Term Memory) is: **do not let every time step unconditionally overwrite the hidden state**. It introduces a set of "gates" to control information flow:

- **Forget gate**: how much of the previous cell state to keep.
- **Input gate**: how much of the current input to write into the cell state.
- **Output gate**: which part of the cell state to emit as `h_t`.

The crucial piece is the **cell state `c_t` "highway"**: information can flow along `c_t` across many time steps almost unchanged (constant error carousel), so long-range gradients are no longer crushed by repeated multiplication — that is exactly how it defeats vanishing gradients. GRU simplifies the gates into update/reset gates; fewer parameters, comparable effect.

PyTorch ships it natively:

```python
import torch.nn as nn

model = nn.LSTM(
    input_size=64,
    hidden_size=128,
    num_layers=2,
    batch_first=True,
)

x = torch.randn(16, 50, 64)  # (batch, seq_len, features)
out, (h_n, c_n) = model(x)   # out: output at every time step
```

## Why attention later replaced it

RNN/LSTM have a structural weakness: **to reach information from step 1, you must pass through every intermediate state** (sequential, O(n) path). This makes them hard to parallelize and still bounds long-range dependency by path length.

The Transformer (see L08) uses attention to let any two time steps see each other in **O(1)**, parallel-friendly and free of recurrence's gradient problem. That is why, after 2018, sequence tasks — especially LLMs — almost entirely moved to attention architectures.

But the RNN family did not vanish: in **online / streaming, low-latency, memory-constrained** settings (edge devices, real-time speech) they still hold ground thanks to their constant-memory advantage.

## Why this matters in practice

- With RNNs, **gradient clipping is almost mandatory** or explosions are likely.
- Need long-range dependency but want a lightweight model → prefer **LSTM/GRU** over vanilla RNN.
- If the task is "read the whole passage then answer" (e.g., document understanding), **attention is the more natural choice** — don't force an RNN.

## References
- MIT 6.7960 OCW (Fall 2024): [course home](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)
- Hochreiter & Schmidhuber, *Long Short-Term Memory*, 1997: [JKU original PDF](https://www.bioinf.jku.at/publications/older/2604.pdf)
- Cho et al., *Learning Phrase Representations using RNN Encoder–Decoder (GRU)*, 2014: [arXiv:1406.1078](https://arxiv.org/abs/1406.1078)
- Chris Olah, *Understanding LSTM Networks* (classic illustrated guide): [colah.github.io](https://colah.github.io/posts/2015-08-Understanding-LSTMs/)

