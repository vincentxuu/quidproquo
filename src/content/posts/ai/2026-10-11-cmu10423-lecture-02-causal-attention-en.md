---
title: "Causal Attention: From Q, K, and V to the Next Token | CMU 10-423 Lecture 2"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 3
tldr: "An RNN compresses the prefix into a state."
description: "A teaching guide based on public Spring 2026 materials: Causal Attention: From Q, K, and V to the Next Token | CMU 10-423 Lecture 2"
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-11-cmu10423-lecture-02-causal-attention)

**Video status: recordings require sign-in or course authorization.** This guide uses public slides and assignments; numerical examples are site-authored, not a lecture transcript.

An RNN compresses the prefix into a state. Attention lets each current position retrieve information from a collection of earlier representations. The goal here is to calculate visibility, weights, and returned values for a short sequence, rather than memorize the letters Q, K, and V. Prerequisites are matrix multiplication, softmax, and next-token prediction.

## Query, match, and retrieve

For three token embeddings collected in X, linear projections produce Q=XWQ, K=XWK, and V=XWV. Queries determine what a position seeks, keys determine matching scores, and values carry the information returned. These are descriptions of computational roles, not manually assigned semantic labels inside the network.

Single-head attention computes QKᵀ/√dₖ, applies softmax independently to each row, and multiplies the result by V. With Q and K shaped `[T,dₖ]`, the score matrix is `[T,T]`. For V shaped `[T,dᵥ]`, the output is `[T,dᵥ]`. Sequence length and feature dimension have distinct meanings; reshaping cannot exchange them arbitrarily.

## Calculate three positions completely

This original example specifies the projected vectors directly. Let dₖ=1, Q=[1,1,1], K=[0,ln 2,ln 4], and V=[2,4,8]. Each unmasked score row is [0,ln 2,ln 4], whose exponentials are [1,2,4].

Position three may access all values. Its weights are [1/7,2/7,4/7], producing (2+8+32)/7=6. Position two may access only the first two: the denominator is now 3, the weights are [1/3,2/3,0], and the output is 10/3. Position one sees only itself and returns 2.

Since dₖ=1, scaling has no effect in this example. For multidimensional vectors, divide the dot products by √dₖ before softmax; do not divide the final weights again. Scaling controls score magnitude as dimensionality grows and helps avoid excessively saturated softmax distributions.

## Apply masking before normalization

A causal mask allows position i to read j≤i. Disallowed scores are conventionally set to negative infinity, whose exponential is zero. If you normalize first and then zero future weights, the second row becomes [1/7,2/7,0]. Its weights sum to 3/7 and its output becomes 10/7, rather than the correct 10/3.

That is a different operation, not a rounding issue. A causal mask also differs from a padding mask: one restricts temporal direction, the other excludes positions added for batching. Real batches often need both. Avoid entirely masked rows, because softmax over all negative infinities can produce NaNs.

## An attention output is not a token probability

The value 6 above is one component of a hidden representation. Multiple heads project and retrieve independently, concatenate their results, and apply an output projection. Transformer blocks also contain residual paths, normalization, and position-wise feed-forward layers. A vocabulary projection produces logits; only a subsequent vocabulary softmax gives a next-token distribution.

Without positional information, self-attention is permutation equivariant. Row numbers alone do not encode sequence semantics. A causal mask restricts direction, but it does not replace a dedicated position representation. Lecture 4 covers RoPE; first distinguish content matching, visibility, and positional signals.

## Parallel training does not remove sequential generation

Training provides the complete reference sequence, so a causal mask lets the model calculate all positions together. Inputs [BOS,I,like] have targets [I,like,cats]. Position two can see BOS and “I,” but not its target “like.”

During generation, the next token does not yet exist. It must be selected before the next step. Parallelizable training therefore does not imply that autoregressive generation knows the entire sentence in advance. KV caching avoids repeated computation; it does not remove this dependency.

## Variations with answers

Change the third value from 8 to 15 without changing Q or K. The first two outputs remain 2 and 10/3. The third becomes (2+8+60)/7=10. The future value cannot affect earlier outputs because it is masked, not because its matching score is small.

If the second row has weights [1/7,2/7,0], what went wrong? Normalization preceded masking, without renormalizing the remaining positions. This counterexample gives you a concrete diagnostic before the next guide connects representations to training loss and decoding.

[Previous](/posts/ai/2026-10-11-cmu10423-hw0-autodiff-en) | [Next](/posts/ai/2026-10-11-cmu10423-lecture-03-training-decoding-en) | [Series overview](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en)

## Course Video Sources

The official recording index is on SCS Panopto. The anonymous folder view is unloaded and requests sign-in; this is an access limitation, not evidence that recordings do not exist. Original audio and subtitles require the appropriate course access.

- [Official Panopto recording index](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [Official course homepage](https://www.cs.cmu.edu/~mgormley/courses/10423/)

## References

- [Lecture 2 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture2-transformer.pdf)
- [Attention Is All You Need](https://arxiv.org/abs/1706.03762)
