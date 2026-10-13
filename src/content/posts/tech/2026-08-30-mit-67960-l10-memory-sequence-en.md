---
title: "Memory and Sequence Modeling — RNNs, LSTMs, and Vanishing/Exploding Gradients | MIT 6.7960 Lecture 10"
date: 2026-08-30
category: tech
type: guide
tags:
  - mit-67960
  - deep-learning
  - rnn
  - lstm
  - sequence-modeling
  - fall-2024
lang: en
description: "MIT 6.7960 Fall 2024 OCW Lecture 10 (Sara Beery): why sequence data needs memory, how the vanilla RNN recurrence causes vanishing/exploding gradients, and how LSTM/GRU gating solves long-range dependency."
tldr: "RNNs propagate hidden states through time; gradient products can shrink or grow. LSTM gates control cell-state retention and updates, improving long-range signal flow without guaranteeing stability. Self-attention shortens paths between positions, while dense attention still has quadratic sequence-length cost."
draft: false
series:
  name: "Reading MIT 6.7960"
  order: 15
---

> 🌏 [中文版](/posts/tech/2026-08-30-mit-67960-l10-memory-sequence)

**Video status: Videos included.** [Source details](#course-video-sources)

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

BPTT propagates gradients through a product of recurrence Jacobians `∂h_t / ∂h_{t-1}`, which also include tanh derivatives. First consider a simplified fixed scalar Jacobian:

- Multiply by **0.5** each step: after 20 steps the factor is `0.5^20 ≈ 9.54×10⁻⁷`, nearly erasing the early signal.
- Multiply by **2** each step: after 20 steps the factor is `2^20 = 1,048,576`, greatly amplifying it.

Calculate both factors for 10 steps before checking: `0.5^10≈0.000977` and `2^10=1024`. This multiplication exercise is created for the guide. Real RNN Jacobians change with the state, and matrix-product growth depends on directions, singular values and nonlinear saturation. A single step's eigenvalues alone do not determine all training behavior.

Vanishing gradient is the more common pain: the model only captures short-range dependency, and long-range context effectively disappears. Exploding gradient can be simply blocked with **gradient clipping** (capping the gradient norm).

## LSTM / GRU: decoupling memory from update via gating

The key insight of LSTM (Long Short-Term Memory) is: **do not let every time step unconditionally overwrite the hidden state**. It introduces a set of "gates" to control information flow:

- **Forget gate**: how much of the previous cell state to keep.
- **Input gate**: how much of the current input to write into the cell state.
- **Output gate**: which part of the cell state to emit as `h_t`.

The crucial piece is the **additive cell-state path `c_t`**. When the forget gate is near 1, information and gradients can survive longer along that path, reducing the need to repeatedly traverse the same recurrent transform. Gate values, other gradient paths and training conditions can still shrink or amplify signals; LSTM does not guarantee freedom from gradient problems. GRU simplifies state handling with update/reset gates, usually with fewer parameters; its effectiveness remains task-dependent.

PyTorch ships it natively:

```python
import torch
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

Dense self-attention in the Transformer (see L08) directly connects any two visible positions within one layer, shortening information paths and allowing parallel processing. Constant path length is a property of the graph, not the total computation for a sequence: dense attention still compares O(n²) position pairs. Removing temporal recurrence does not guarantee that all gradient or long-range reasoning problems disappear. These properties help explain the prevalence of attention in modern text models.

But the RNN family did not vanish: in **online / streaming, low-latency, memory-constrained** settings (edge devices, real-time speech) they still hold ground thanks to their constant-memory advantage.

## Why this matters in practice

- With RNNs, **gradient clipping is almost mandatory** or explosions are likely.
- Need long-range dependency but want a lightweight model → prefer **LSTM/GRU** over vanilla RNN.
- If the task is "read the whole passage then answer" (e.g., document understanding), **attention is the more natural choice** — don't force an RNN.

## Inspect repeated multiplication in a scalar recurrence

This is an invented teaching example, not a lecturer experiment or official assignment solution.

To isolate repeated multiplication, this invented example uses linear scalar h_t=a h_{t-1}, without tanh, input, or gates. With h₀=1 and a=0.5, h₁=0.5,h₂=0.25,h₃=0.125; the derivative with respect to the initial state is also a³=0.125. For a=2, the three-step derivative is 8.

**Check and answer:** For a=1, what is the three-step derivative? One. Real RNN Jacobians include activation derivatives and vary with state; this simplification does not let one eigenvalue diagnose every training case or guarantee gates prevent all decay.

## Course video sources
Rechecked against the live MIT OCW Fall 2024 gallery on 2026-10-10: the lecture number matches and the video is public and embeddable. Lecture numbering and topics follow OCW.

```youtube
url: https://www.youtube.com/watch?v=IiHknRHA-Gk
title: MIT 6.7960 Fall 2024 — Lec 10. Architectures: Memory
```

Original videos: [MIT 6.7960 Fall 2024 — Lec 10. Architectures: Memory](https://www.youtube.com/watch?v=IiHknRHA-Gk)

Course and recording entries:

- [MIT OCW — Lec 10. Architectures: Memory](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/resources/mit6_7960f24_lec10_mp4/)
- [MIT 6.7960 Fall 2024 — official lecture video gallery](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/video_galleries/lecture-videos/)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): read the Lec 10 transcript (Sara Beery, 1:13:28): the video covers RNN memory and recurrence (about 15%–40%), vanishing/exploding gradients (about 42%–48%), LSTM and gating (about 43%–56%) and attention in the later part (about 78%–86%), matching the article; GRU does not appear in the transcript, so the GRU material is this site's supplement.

## Update Log


- 2026-10-11: Added an invented worked example and comprehension check, preserving source limits and assignment scope.
- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Live-checked the official course page: lecture numbers and recording links match and the videos are public, so the status is now “Videos included.”
- 2026-10-10: Checked the video content against its transcript. The video topic matches the article; noted that GRU is not in the transcript.

## References
- MIT 6.7960 OCW (Fall 2024): [course home](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)
- Hochreiter & Schmidhuber, *Long Short-Term Memory*, 1997: [JKU original PDF](https://www.bioinf.jku.at/publications/older/2604.pdf)
- Cho et al., *Learning Phrase Representations using RNN Encoder–Decoder (GRU)*, 2014: [arXiv:1406.1078](https://arxiv.org/abs/1406.1078)
- Chris Olah, *Understanding LSTM Networks* (classic illustrated guide): [colah.github.io](https://colah.github.io/posts/2015-08-Understanding-LSTMs/)

