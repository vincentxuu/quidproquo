---
title: "AI Engineer Interview Daily — 2026-09-29: Deep Learning & NLP"
date: 2026-09-29
category: daily
type: digest
tags: [ai-engineer-interview, daily, deep-learning]
lang: en
description: "Tuesday's rotation is Deep Learning & NLP — why Transformers use scaled dot-product instead of additive attention, what the 1/√dk scale factor actually prevents, why multi-head attention splits into subspaces, and the inductive-bias trade-off across CNNs, RNNs, and Transformers — plus a real attention-efficiency question from dsprep.com's interview bank, flagged as a frequent ask at Anthropic and DeepMind."
tldr: "Today's Deep Learning & NLP rotation covers five core concepts: why scaled dot-product attention parallelizes as a single batched matmul on GPUs, why multi-head attention splits the embedding dimension into subspaces so different heads can learn different relations, why positional encoding is information Transformers must add back once they give up recurrence, the trade-off between CNN locality, RNN recurrence, and Transformer global interaction, and how BPE, WordPiece, and SentencePiece differ as subword tokenization strategies — plus why byte-level BPE eliminates out-of-vocabulary tokens entirely. The practice question, sourced from dsprep.com's interview bank and flagged as a frequent ask at research labs like Anthropic and DeepMind, asks why Transformers chose scaled dot-product attention over additive attention — the breakdown threads efficiency, the scale factor, and the multi-head motivation into one coherent design-philosophy argument."
series:
  name: "AI Engineer Interview Daily"
  order: 41
---

> 🌏 [中文版](/posts/daily/2026-09-29-ai-interview-daily)

## Today's Topic

Tuesday's rotation is Deep Learning & NLP — the area most likely to draw a "derive it from scratch" follow-up in an AI Engineer interview. Interviewers rarely settle for a recitation of the Transformer diagram; they want to hear whether you can tie each design choice back to a concrete problem it solves. Today's practice question centers on the efficiency case for attention, because "why scaled dot-product instead of additive attention" is one of the few questions that simultaneously tests your grasp of linear algebra, GPU parallelism, and gradient training dynamics — it shows up from phone screens through onsite ML systems deep-dives.

## Core Concepts Cheat Sheet

### Scaled dot-product attention: the efficiency win is collapsing into a single matrix multiplication

Self-attention lets every token in a sequence interact directly with every other token: three linear projections turn the input into query, key, and value; the query is compared against each key to produce a similarity score; softmax normalizes those scores into weights; and the output is a weighted average of the values. The original Transformer paper chose a dot product for that similarity function instead of the additive attention common in earlier seq2seq models (which scores each pair with a small feed-forward network), and the core reason is efficiency: $QK^T$ can be computed for the entire sequence in one batched matrix multiplication, which saturates a GPU's tensor cores. Additive attention has a nonlinearity in the middle, so it can't collapse into a single matmul — each pair has to be scored individually, and parallelism suffers. A common follow-up is "which one has more representational capacity in theory" — additive attention arguably does, but at sufficient dimensionality that gap is negligible in practice, and the parallelism payoff is what let Transformers scale to their current size.

### The 1/√dk scale factor: keeping softmax out of its saturated regime

After computing $QK^T$, the scores are divided by $\sqrt{d_k}$ (the key dimension) before softmax. The reason is that the variance of a dot product between two random vectors grows linearly with dimension, so as $d_k$ increases, the raw scores get large in magnitude. Softmax is sensitive to the absolute scale of its input — once the scores spread out enough, the output collapses toward one-hot, and the corresponding gradients vanish, stalling training. Dividing by $\sqrt{d_k}$ pulls the score variance back to a constant scale, keeping softmax in a range where gradients still flow. This is a frequent test of whether you understand the *reason* for the scale factor rather than just reciting the formula — the complete answer names both the variance growth and the softmax-saturation-to-vanishing-gradient chain.

### Multi-head attention: splitting the same embedding space into independent subspaces

A single attention head can only converge on one similarity pattern, but language contains several distinct kinds of relations at once — syntactic dependency, coreference, semantic similarity. Multi-head attention splits the query/key/value embedding dimension into several smaller subspaces (say, 512 dimensions into 8 heads of 64 each), runs scaled dot-product attention independently in each, and lets different heads specialize in different relation types before concatenating all outputs and projecting them back to the original dimension. A common follow-up is "why not just use one head at a larger dimension instead" — empirically, several smaller heads learn more diverse relational patterns than one large head, which tends to get dominated by a few strong signals and loses the flexibility to capture multiple relation types at once.

### CNNs, RNNs, and Transformers: three different inductive-bias trade-offs

CNNs assume locality — a convolutional kernel only looks at nearby pixels, and receptive field grows by stacking layers — a good match for the spatially local correlation in images. RNNs propagate order information step by step through a hidden state; in theory they can remember arbitrarily long history, but backpropagation has to travel the full length of the sequence, so gradients vanish and long-range dependencies are hard to learn in practice. Transformers abandon both locality and recurrence entirely, letting any two positions interact directly through attention — the cost is compute that grows quadratically with sequence length ($O(n^2)$), and the payoff is direct long-range dependency modeling plus full-sequence parallel training (no step-by-step recurrence bottleneck). Interviewers often ask "why did NLP move from RNNs to Transformers" — the core answer is exactly this inductive-bias trade-off: give up some built-in bias toward local sequential structure in exchange for parallelizable training and better long-range modeling.

### Tokenization: why BPE, WordPiece, and SentencePiece are all subword approaches

Language models can't consume raw text directly — it has to be split into token ids from a fixed vocabulary first. The three dominant subword algorithms each solve a slightly different problem. BPE (Byte-Pair Encoding) starts from individual bytes or characters and repeatedly merges the most frequent adjacent pair until the vocabulary hits a target size — the GPT family and the Claude family both use variants of this approach. WordPiece is what BERT uses: the merge criterion maximizes corpus likelihood instead of raw frequency, and continuation pieces are prefixed with `##`. SentencePiece trains directly on raw text and treats whitespace as an ordinary symbol (rendered as `▁`), which makes it well suited to languages without whitespace-delimited words like Chinese, Japanese, or Thai, and it supports training either a BPE or a unigram probabilistic model. The reason all three go the subword route instead of whole-word tokens: a whole-word vocabulary hits out-of-vocabulary (OOV) failures on unseen words, while subword tokenization can decompose any string into known pieces. Byte-level BPE (introduced with GPT-2) goes one step further, using the 256 possible bytes as the alphabet — in principle it can represent any byte sequence, eliminating OOV entirely.

## Today's Practice Question

### The Question

Why did the Transformer choose scaled dot-product attention over the additive attention common in earlier seq2seq models? Explain the efficiency reasoning, explain what problem the $1/\sqrt{d_k}$ scale factor is preventing, and explain why multi-head attention splits the embedding dimension into several subspaces instead of using one larger single head.

**Source**: Featured in dsprep.com's Data Science Interview Preparation question bank, flagged as a frequent ask at research labs including Anthropic and DeepMind　**Difficulty**: Advanced　**Round**: Technical screen / ML fundamentals deep-dive

### How to Break It Down

1. **Clarify the question first**: Confirm whether the interviewer wants the efficiency comparison alone or also expects an explanation of how additive attention computes its score; check whether they want the multi-head discussion folded in immediately or the single-head efficiency argument finished first.
2. **Build a framework**: Start from the general definition of attention — a compatibility function scores the query against each key, softmax normalizes those scores into weights, and the output is a weighted average of the values. Within that framework, compare two compatibility functions: dot-product (a direct inner product) versus additive (a feed-forward network). The key distinguishing factor is whether the computation can flatten into a matrix multiplication.
3. **Go deep on the core mechanism**: Explain how dot-product attention computes $QK^T$ for the whole sequence as one batched matmul that saturates GPU tensor cores, while additive attention's nonlinear layer can't be batched the same way and must score pairs individually — a real parallelism gap. Then explain the scale factor: dot-product variance grows with dimension, pushing scores toward softmax saturation and vanishing gradients; dividing by $\sqrt{d_k}$ restores a constant-scale variance and keeps gradients flowing. Finally, explain the multi-head motivation: a single head converges on one similarity pattern, while splitting into smaller subspaces lets different heads specialize in syntax, coreference, or semantics instead of being dominated by one strong signal.
4. **Land the close**: Tie all three design choices back to a larger theme — the Transformer's overall design philosophy is to systematically trade "operations that parallelize well on hardware" for "operations that might be marginally more expressive but don't parallelize," and that trade is the actual reason Transformers scaled to their current size. This is the angle most likely to leave an impression as a closing statement.

### Sample Answer (the kind you'd actually say in an interview)

> **The efficiency comparison**: Additive attention concatenates the query and key and runs them through a small feed-forward network to produce a score — that step includes a nonlinearity, so it can't flatten into a single matrix multiplication and has to be computed pair by pair. Scaled dot-product attention takes the inner product of query and key directly, so the entire sequence can be computed as one $QK^T$ batched matrix multiplication, which saturates a GPU's tensor cores. That's the main reason the Transformer picked it — additive attention may have slightly more theoretical expressiveness, but at sufficient dimensionality that gap is negligible, and the parallelism payoff is what actually let the architecture scale to where it is now.
>
> **What the scale factor prevents**: The variance of a dot product grows linearly with the key dimension $d_k$, so as dimensionality increases, the raw scores get large in magnitude. Softmax is sensitive to the absolute scale of its input, so once scores spread out enough, the output collapses toward one-hot and the corresponding gradients vanish — training stalls. Dividing by $\sqrt{d_k}$ pulls the score variance back to a constant scale, keeping softmax in a range where gradients still flow. It's a direct numerical-stability design choice, not an arbitrarily chosen hyperparameter.
>
> **The multi-head motivation**: A single head can only converge on one similarity pattern, but language contains several distinct kinds of relations at once — syntactic dependency, coreference, semantic similarity. Splitting the embedding dimension into several smaller subspaces and running attention independently in each lets different heads specialize in different relation types — better than one larger single head, which tends to get dominated by a few strong signals and lose that flexibility. All three of these design choices are really making the same point: the Transformer systematically trades operations that parallelize well for operations that might be marginally more expressive but don't.

### Self-Check List

Use this table to check whether your answer covers the key points:

| Check item | Covered? |
|---|---|
| Explained that dot-product flattens into a batched matmul while additive attention can't | |
| Explained that the $1/\sqrt{d_k}$ scale factor prevents softmax saturation and vanishing gradients | |
| Explained why multi-head splits into subspaces instead of using one larger single head | |
| Acknowledged additive attention's theoretical expressiveness while prioritizing parallelism | |
| Closed by tying all three choices to the Transformer's overall design philosophy | |
| Bonus: extended to positional encoding or RoPE as the ordering information Transformers add back | |

## Further Reading

- [Transformer Interview Questions — dsprep.com](https://dsprep.com/Interview-Questions/Transformers/) — the source of today's practice question, with more Transformer interview questions tagged by company source and difficulty for further practice.
- [How to Answer: Explain Transformers (Technical Interview Guide) — Naveen Bansal](https://medium.com/@bansal.naveen09/how-to-answer-explain-transformers-technical-interview-guide-67eb14aab50c) — demonstrates how to narrate the encoder architecture, positional encoding, and multi-head attention as one coherent spoken answer, a useful pacing reference for today's sample answer.
- [What is Tokenization in LLMs? BPE, SentencePiece, tiktoken in 2026 — FutureAGI](https://futureagi.com/blog/what-is-tokenization-llms-2026/) — a full breakdown of which tokenizer each major model family actually uses in 2026 (GPT, Claude, Llama, Gemma, Qwen), filling in the model comparison the tokenization section didn't have room for.

## References

- [Transformer Interview Questions — dsprep.com](https://dsprep.com/Interview-Questions/Transformers/) — source of today's practice question, its difficulty tag, and the Anthropic/DeepMind frequent-ask attribution.
- [How to Answer: Explain Transformers (Technical Interview Guide) — Naveen Bansal](https://medium.com/@bansal.naveen09/how-to-answer-explain-transformers-technical-interview-guide-67eb14aab50c) — reference for the narrative structure of the sample answer section.
- [What is Tokenization in LLMs? BPE, SentencePiece, tiktoken in 2026 — FutureAGI](https://futureagi.com/blog/what-is-tokenization-llms-2026/) — source for the BPE/WordPiece/SentencePiece comparison and model tokenizer table in the tokenization section.
- [Transformer Attention Mechanism in NLP — GeeksforGeeks](https://www.geeksforgeeks.org/nlp/transformer-attention-mechanism-in-nlp/) — source for the mechanism description in the scaled dot-product attention and multi-head attention sections.
