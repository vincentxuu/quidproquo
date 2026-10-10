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

**Video status: Related supplementary video included; the original lecture recording has not been verified.** [Source details](#course-video-sources)

This article reads Chapter 17, printed pages 202–219, of the [2026 CS229 main notes](https://cs229.stanford.edu/main_notes.pdf). It is a chapter guide to the 2026 notes, not a reconstruction of any quarter's recordings. The focus is the chain from model to computation to post-training, not a line-by-line reproduction of every proof.

## Course video sources

This article follows the 2026 main notes chapter by chapter, and chapter numbers are not lecture numbers. The video(s) below come from Stanford Online's public CS229 Spring 2026 recordings; their titles match this chapter's topic, but they are related supplements, not a line-by-line source for this chapter, and the original lecture recording for the chapter has not been verified. The official CS229 page currently shows Summer 2026 and sends recordings and materials to a Stanford sign-in Canvas site, so only the public YouTube playlists are used here.

```youtube
url: https://www.youtube.com/watch?v=hHC-SF3utxg
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 16: Basic Concept in RL, Policy Gradient
```

```youtube
url: https://www.youtube.com/watch?v=pwQ0l4hFCVI
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 14: Transformers, In-Context Learning
```

Original videos: [Stanford CS229 Machine Learning | Spring 2026 | Lecture 16: Basic Concept in RL, Policy Gradient](https://www.youtube.com/watch?v=hHC-SF3utxg); [Stanford CS229 Machine Learning | Spring 2026 | Lecture 14: Transformers, In-Context Learning](https://www.youtube.com/watch?v=pwQ0l4hFCVI)

Course and recording entries:

- [Stanford CS229 Machine Learning, Spring 2026 playlist (Stanford Online, 17 videos)](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [Stanford CS229: Machine Learning led by Andrew Ng, Autumn 2018 playlist (21 videos)](https://www.youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU)
- [Official course / lecture source](https://cs229.stanford.edu/)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): both transcripts were read, and what was checked is how the video topics relate to this chapter; one of the two originally embedded videos did not match. Lecture 14 (about 78 minutes) opens by announcing a few lectures on LLMs, then covers tokenization, the autoregressive conditional-probability decomposition, the softmax output, attention and the causal mask, and ends with normalization and residuals, with a mention of the T-squared cost for long sequences; this matches the chapter's first two sections and the start of the long-sequence section. The originally embedded Lecture 13 (YouTube title "LLMs, Next-Word Prediction Loss") is in fact the second half of the representation-learning material (contrastive learning, semantic search, RAG) with no next-token, tokenization or transformer content, so it was replaced here and its content moved to Chapter 16. The replacement carries the YouTube title "Lecture 16: Basic Concept in RL, Policy Gradient", but its transcript covers attention variants (multi-query/grouped-query, KV cache, sliding window), mixture of experts, in-context learning (few-shot, zero-shot) and SFT, matching the chapter's long-sequence and "MoE, prompting and SFT" sections; the title does not match, the content does.

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

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Found a public CS229 playlist with matching topics (Spring 2026 and/or the older Autumn 2018) and embedded 2 related supplementary video(s).
- 2026-10-10: Checked the video content against its transcript. The embedded Lecture 13 was really contrastive learning, semantic search and RAG (moved to Chapter 16), so it was replaced by the video whose transcript covers attention variants, MoE, in-context learning and SFT (hHC-SF3utxg, whose YouTube title wrongly says Lecture 16 RL); Lecture 14 matches the first half of the chapter.

## References

- [CS229 Lecture Notes Chapter 17: Large Language Models, Transformers, MoE, and SFT (2026-08-18)](https://cs229.stanford.edu/main_notes.pdf#page=203)
- [Official Stanford CS229 course page](https://cs229.stanford.edu/)
