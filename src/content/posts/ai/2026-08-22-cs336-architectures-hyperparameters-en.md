---
title: "CS336 Lecture 3: Transformers Have Many Variants but Few Stable Defaults"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs336, transformer, llm, architecture, hyperparameters]
lang: en
series:
  name: "Reading Stanford CS336"
  order: 4
tldr: "Lecture 3 does not turn its survey of modern LLMs into a single best recipe. It finds a conservative consensus—pre-norm, RMSNorm, no biases, SwiGLU, and RoPE—plus a small set of deviations justified by inference cost or stability."
description: "A guide to Stanford CS336 Spring 2026 Lecture 3: normalization, activations, RoPE, model aspect ratios, vocabularies, regularization, QK norm, GQA/MQA, and local attention."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs336-architectures-hyperparameters)

This post covers **CS336 Spring 2026 Lecture 3: Architectures, hyperparameters**, taught by Tatsunori Hashimoto on April 6, 2026. Its primary source is the official [`lecture_03.pdf`](https://github.com/stanford-cs336/lectures/blob/main/lecture_03.pdf).

The lecture is deliberately titled “Everything You Didn't Want to Know.” Recent model papers expose a large number of architectural variants, but the useful question is not how to memorize every name. It is which choices have converged across models, which remain local tradeoffs, and which differ because scale or systems constraints differ.

## Start from a simplified modern Transformer

Compared with the original Transformer, the lecture's baseline is already a modern decoder-only design: normalization before each block, RoPE for position, and a gated feed-forward network. Every later comparison asks whether there is enough reason to deviate from this conservative starting point.

That method matters. Large architecture tables make every column look equally important. In practice, many major models share similar core ratios, while differences concentrate around inference cost, long context, stability, or hardware constraints.

## Normalization has the strongest consensus

Modern language models generally avoid placing normalization directly in the main residual signal path, most often through pre-norm. Relative to post-norm, it tends to improve gradient propagation and permit larger learning rates. Some newer models add another normalization without interrupting the residual path.

RMSNorm has also displaced full LayerNorm in many systems. It does not subtract a mean and has no bias, reducing operations and parameters. The lecture stresses that FLOPs alone do not explain its value: normalization is often constrained by data movement, so avoiding a read or write may matter more than removing a few arithmetic operations.

The same reasoning extends to biases. Many modern Transformers remove linear-layer biases. This does not prove that biases have no expressive value; it says their extra parameters and movement may not justify themselves around large matrix multiplications.

## Gating is the dominant activation direction

There are many names—ReLU, GeLU, Swish, and several GLU variants—but the clearest cross-model trend is gated feed-forward layers. SwiGLU-like structures use one branch for content and another as a gate, and repeatedly outperform non-gated alternatives under comparable budgets.

Parameter counts must be normalized before making that comparison. A conventional feed-forward layer often uses `d_ff = 4 × d_model`. A gated layer adds a projection, so implementations commonly reduce the ratio to about `8/3` to keep total parameters and compute similar. Holding `d_ff` fixed would confuse a larger model with a better activation.

## RoPE places relative position inside the inner product

Sinusoidal embeddings add a position vector to the token representation. RoPE rotates queries and keys according to position. The resulting inner product can depend on the difference between positions, allowing attention to express relative position naturally.

RoPE still has tradeoffs. Extending context runs outside the positional frequencies observed in training, motivating several scaling methods. The lecture's point is not to enumerate them all but to explain why RoPE is a conservative baseline: it embeds relative position in attention geometry without a fixed-length learned position table.

## The surprise in hyperparameters is conservatism

The slides compare feed-forward ratios, head dimensions, model aspect ratios, and vocabulary sizes across systems. Many models remain in a few familiar ranges: roughly four times model dimension for non-gated feed-forward layers and about `8/3` for gated ones; head dimensions often stay at a common scale; width-to-depth ratios do not drift arbitrarily.

Vocabulary varies more with language and product requirements. Monolingual models may use tens of thousands of tokens, while multilingual and production systems often exceed one hundred thousand. The tradeoff is the one from Lecture 1: larger vocabularies shorten sequences but expand embeddings and the output layer.

Pretraining regularization also differs from small-data supervised learning. Dropout is often zero when data is abundant. Weight decay can remain useful for optimization stability rather than only as a classical defense against overfitting.

## Stability and inference cost justify deviations

Softmax operations concentrate numerical risk. A z-loss can prevent output logits from drifting together; normalizing queries and keys can prevent excessive attention dot products; some models soft-cap logits.

Inference cost motivates MQA and GQA. Autoregressive decoding reads the KV cache for every new token. Reducing key/value heads lowers both capacity and bandwidth requirements. MQA keeps a single KV head and saves the most but can hurt quality. GQA lets groups of query heads share KV heads and is a common compromise.

Long context similarly motivates interleaving full attention with local or sliding-window attention. This does not claim local attention is universally superior. A small number of global layers preserve long-distance communication while the remaining layers avoid quadratic work.

## How to use the lecture for architecture decisions

Begin with a conservative baseline: pre-norm, RMSNorm, no biases, gated feed-forward, and RoPE. Deviate only in response to a measurable limitation such as KV-cache size, long-context cost, or unstable training logits. Compare alternatives at fixed parameter and compute budgets so that a larger model is not mistaken for a better component.

That is the lecture's practical conclusion. Architecture search is not the accumulation of every new component from recent papers. Use the existing consensus to reserve experiments for choices that can still change the outcome.

## Material fidelity

This lecture has a Spring 2026 schedule entry and a complete official PDF. This guide follows its architecture, hyperparameter, stability, and attention sections without filling gaps from another offering.

## References

- [CS336 Spring 2026 course and schedule](https://cs336.stanford.edu/)
- [Lecture 3 official slides](https://github.com/stanford-cs336/lectures/blob/main/lecture_03.pdf)
- [RoFormer: Enhanced Transformer with Rotary Position Embedding](https://arxiv.org/abs/2104.09864)
- [GLU Variants Improve Transformer](https://arxiv.org/abs/2002.05202)

