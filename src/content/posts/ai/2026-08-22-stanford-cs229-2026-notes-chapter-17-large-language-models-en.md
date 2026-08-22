---
title: "Large Language Models: Tokenization, Transformers, MoE, and SFT"
date: 2026-08-22
type: deep-dive
category: ai
tags: [cs229, llm, transformer, mixture-of-experts, sft]
lang: en
tldr: "Chapter 17 runs from next-token loss through Transformers, KV caches, MoE, and SFT, connecting an LLM's objective and architecture to its inference costs."
description: "A reading of Chapter 17 in the 2026 CS229 notes, from autoregressive modeling and attention to inference efficiency, MoE, prompting, and SFT."
draft: false
series:
  name: "Reading Stanford CS229"
  order: 18
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-17-large-language-models)

This article reads Chapter 17, printed pages 202–219, of the [2026 CS229 main notes](https://cs229.stanford.edu/main_notes.pdf). It is a chapter guide to the 2026 notes, not a reconstruction of any quarter's recordings. The focus is the chain from model to computation to post-training, not a line-by-line reproduction of every proof.

## From text to an autoregressive probability

A tokenizer converts text into tokens. Characters give a small vocabulary but long sequences; whole words shorten sequences but handle rare words poorly. Subword methods such as BPE occupy the middle ground. Vocabulary size changes embedding and output layers as well as sequence length, so tokenization is part of the model's systems design.

The chain rule factorizes sequence probability as

\[
p(x_1,\ldots,x_T)=\prod_{t=1}^{T}p(x_t\mid x_{<t}).
\]

Training uses teacher forcing and cross-entropy at each position. Generation feeds sampled tokens back into the prefix. Temperature changes distribution sharpness, while top-k and top-p truncate candidates. These are inference heuristics; they do not redefine the learned probability model.

## The Transformer's computational core

For hidden-state matrix \(H\), one attention head forms

\[
Q=HW_Q,\quad K=HW_K,\quad V=HW_V,
\]

then computes

\[
H_{out}=\operatorname{softmax}_{row}\left(\frac{QK^\top}{\sqrt{d_h}}+M\right)V.
\]

Here \(d_h\) is head dimension and causal mask \(M\) prevents a position from seeing future tokens. Multiple heads model relations in separate subspaces; residual connections, normalization, and MLPs complete a Transformer block. The notes also distinguish PreNorm and PostNorm and discuss RMSNorm in modern LLMs.

## The real cost of long sequences

Full attention materializes interactions that grow quadratically with sequence length \(T\). FlashAttention reduces intermediate-memory traffic through tiling, streaming softmax, and recomputation, but it does not make every full-attention operation linear-time. Autoregressive inference uses a KV cache to avoid recomputing old keys and values, at the cost of cache growth with context length.

MQA and GQA let multiple query heads share a smaller number of key/value heads, shrinking the KV cache. Sliding-window attention keeps only recent context and gives up direct global connections. Each technique trades among computation, memory, and long-range access differently.

## MoE, prompting, and SFT

A mixture-of-experts layer uses a router to select a small expert subset per token. This expands total parameter capacity without evaluating every expert for every token, but introduces routing balance, communication, and expert-capacity problems.

Zero-shot prompts or few-shot in-context examples change behavior without changing weights. Supervised fine-tuning instead updates the model on prompt–completion pairs, often computing loss only on response tokens. That loss mask is distinct from the causal attention mask: one controls which positions are scored, while the other controls which positions can attend to which tokens. Instruction-tuning mixtures teach the broader pattern of following instructions rather than one dataset alone.

## Assumptions and limits

- Next-token prediction does not directly guarantee factuality or task success.
- Tokenization changes sequence costs unevenly across languages and strings.
- KV caching, FlashAttention, and GQA target different bottlenecks and are not interchangeable terms.
- Sparse expert activation does not eliminate total parameter storage or deployment complexity.
- SFT behavior is bounded by the quality and coverage of its demonstrations.

## Connection to adjacent chapters

Chapter 16 used embeddings for retrieval and RAG. This chapter opens the Transformer that can provide those embeddings and generate an answer. Chapter 18 then treats a generated sequence as a decision process with a terminal reward, leading to chain-of-thought prompting and RLVR.

## Exercise

For the same 2,048-token prompt, compare what must be recomputed during token-by-token generation with and without a KV cache. Then make a table showing the main resource saved by FlashAttention, GQA, and sliding-window attention—and the bottleneck each does not solve.

## References

- [CS229 Lecture Notes Chapter 17: Large Language Models, Transformers, MoE, and SFT (2026-08-18)](https://cs229.stanford.edu/main_notes.pdf#page=203)
- [Official Stanford CS229 course page](https://cs229.stanford.edu/)
