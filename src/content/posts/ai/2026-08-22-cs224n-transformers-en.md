---
title: "CS224N Lecture 5: From Recurrence to the Transformer"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224n, transformer, self-attention, nlp, stanford]
lang: en
series:
  name: "Reading Stanford CS224N"
  order: 6
tldr: "Lecture 5 moves from the long-range and sequential bottlenecks of RNNs to self-attention and the Transformer. It shortens information paths and enables parallel computation, at the price of quadratic attention and separately encoded position."
description: "A lecture-by-lecture reading of CS224N Winter 2026 Lecture 5: attention, self-attention, the Transformer architecture, results, and limitations."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs224n-transformers)

The [official CS224N Winter 2026 schedule](https://web.stanford.edu/class/cs224n/) places lecture 5 on January 20, 2026, but does not name a lecturer; this article therefore attributes it only to the course staff. The [official deck](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture05-transformers.pdf) finishes vanishing gradients and machine translation, then moves from recurrence to attention, self-attention, the complete Transformer, and finally results, drawbacks, and variants. It is the quarter's architectural dividing line: later lectures on pretraining, post-training, agents, and reasoning assume this material.

## Why leave recurrence

An RNN computes hidden states in time order, and information between positions travels step by step. Gated RNNs alleviate gradient problems, but positions within a sentence remain difficult to parallelize. Machine translation also requires a decoder to focus on different source regions at different output steps; one fixed source vector is insufficient.

Attention's first answer is to expose all encoder states to every decoder step. The decoder scores those states, normalizes the scores, and takes a weighted sum. This creates soft alignment and gives information a shorter route.

## Three roles in self-attention

Self-attention projects one sequence into queries, keys, and values. A query represents what the current position seeks; keys index what positions offer; values carry the content to mix. Scaled dot-product attention scores query–key similarity, divides by a dimensional scale, applies softmax, and weights the values.

One head learns one mixing scheme. Multi-head attention learns several projected interactions in parallel, concatenates them, and applies another linear projection. This does not guarantee that each head corresponds to a human-named grammatical relation, but it expands the types of interaction one layer can represent.

## How a Transformer block is assembled

A [Transformer](https://arxiv.org/abs/1706.03762) block contains more than attention: it also has a position-wise feed-forward network, residual connections, and [layer normalization](https://arxiv.org/abs/1607.06450). Residual paths give information and gradients a direct route; the feed-forward layer applies the same nonlinear transformation at every position.

Self-attention alone does not know token order: jointly permuting input positions permutes the outputs. The model therefore needs positional representations. A decoder-only language model also needs a causal mask so a position cannot inspect future tokens during training.

## What it gains and what it pays

The Transformer provides short position-to-position paths, parallel processing over sequence positions, and an architecture that scales readily with model and data size. Standard self-attention, however, creates a score matrix quadratic in sequence length, consuming memory and computation on long contexts. Position is no longer implicit in recurrence and must be designed explicitly. Attention weights are also not a complete explanation of model behavior.

The agenda ends with variants. The useful question is not which names to memorize but which cost each variant changes: sparse or local attention reduces long-sequence work, alternative position schemes change extrapolation, and encoder-only, decoder-only, and encoder–decoder forms support different learning and generation settings.

## From encoder–decoder attention to self-attention

Translation attention lets each decoder state score all encoder states. Self-attention applies the same query–key–value mechanism within one sequence, reducing position-to-position path length without recurrence.

## Scaled dot-product attention

\[
\mathrm{Attention}(Q,K,V)=\mathrm{softmax}\left(\frac{QK^T}{\sqrt{d_k}}+M\right)V.
\]

Scaling prevents large dot products from saturating softmax; the mask controls visible positions. Inspect score shapes, row sums, mask broadcasting, and softmax axes on a tiny example before batching.

## Multi-head attention

Heads use distinct projections and concatenate their outputs; they are not duplicate copies. Visual patterns are hypotheses rather than causal explanations.

## Position-wise feed-forward layers

The position-wise MLP supplies nonlinear feature transformation, while residual paths and layer normalization stabilize deep composition.

## Position is an additional signal

Self-attention without position is permutation equivariant. Position representations encode order; causal masks separately prevent future access.

## Encoders, decoders, and encoder–decoders

Encoders use bidirectional context, decoders use causal context, and encoder–decoders add cross-attention from targets to sources. Choose by drawing which inputs each output is allowed to see.

## Where quadratic cost comes from

The (n\times n) score matrix gives standard attention quadratic sequence cost. Local or sparse attention changes connectivity, linear variants approximate or rearrange computation, and FlashAttention keeps exact attention while reducing memory traffic. Compare quality, length, wall time, memory, and hardware rather than labels alone.

## Assignment 3 as an architecture test

The public assignment proves copying behavior, single-head limits, and permutation equivariance before implementing a decoder-only Transformer. Test causal masking, attention sums, shapes, residual blocks, tiny-set overfitting, and deterministic generation bottom-up. Its pytest snapshots isolate failures by component.

## Material gap

Winter 2026 recordings are not public. This article covers all six agenda sections in the deck but does not treat the 2019 or Spring 2024 recordings as this lecture's spoken content. Live explanations and classroom questions cannot be confirmed from public material.

## References

- [Official CS224N Winter 2026 course page](https://web.stanford.edu/class/cs224n/)
- [Lecture 5 Attention and Transformers slides](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture05-transformers.pdf)
- [Attention Is All You Need](https://arxiv.org/abs/1706.03762)
- [Layer Normalization](https://arxiv.org/abs/1607.06450)
