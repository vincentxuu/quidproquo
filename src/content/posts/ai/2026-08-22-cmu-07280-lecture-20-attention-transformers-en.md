---
title: "CMU 07-280 Lecture 20: From Position Encoding to Causal Self-Attention"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cmu, ai-course, transformer, attention, gpt-2]
lang: en
tldr: "Lecture 20 expands one-token embeddings into sequences, adds positional information, derives Q/K/V scaled dot-product attention and causal masking, and assembles multi-head blocks into a GPT-2 skeleton."
description: "A detailed reading of CMU 07-280 Spring 2026 Lecture 20: positional encoding, Q/K/V attention, causal masking, multi-head attention, and the GPT-2 skeleton."
draft: false
series:
  name: "Reading CMU 07-280"
  order: 20
---

> 🌏 [中文版](/posts/ai/2026-08-22-cmu-07280-lecture-20-attention-transformers)

The Lecture 19 model used one previous token to predict the next. **CMU 07-280, Spring 2026, Lecture 20** asks how a model can use an entire context while preserving position and deciding which locations matter for the current token. The official title is *Attention & Transformers*, and the deck builds from averaged context vectors to a GPT-2 skeleton.

## Official materials and reading scope

This article fully reads the [Lecture 20 slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec20_NLP_Attention_Transformers.pdf), [Recitation 11](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec11.pdf), its [solutions](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec11_sol.pdf), and [Homework 11](https://www.cs.cmu.edu/~07280/assignments/hw11_blank.pdf) for the Building GPT2 connection. The official site has no public Spring 2026 lecture recording, so this article does not reconstruct slide-animation timing or spoken explanations.

The recitation's minGPT notebook lives in an external environment. The public PDF confirms model comparisons, dimension exercises, and demonstration answers; it does not imply that the full notebook and autograder are anonymously accessible.

## The inherited problem: averaging context forgets order and relationships

The simplest way to combine `T` embeddings is an average:

\[
v'=\frac{1}{T}\sum_{t=1}^{T}v_t.
\]

An average is insensitive to permutation, so `dog bites man` and `man bites dog` can collapse to the same vector. A transformer also has no built-in concept of token position. The slides therefore introduce sinusoidal positional encoding and provide a two-dimensional intuition for rotary position encoding (RoPE).

Position alone is insufficient. Averaging assigns equal weight to every token, but some context positions should matter more than others when predicting the continuation. Attention replaces a fixed average with a query-dependent weighted average.

## Full conceptual path: the roles of Q, K, and V

Let `X∈R^{T×d_model}` be the input sequence. Three learned linear transforms produce

\[
Q=XW_Q,\qquad K=XW_K,\qquad V=XW_V.
\]

`Q` expresses what each position is seeking. `K` provides an index against which queries are matched. `V` contains the content that is actually combined after matching. Scaled dot-product attention is

\[
S=\frac{QK^\top}{\sqrt{d_k}},\quad
A=\operatorname{softmax}_{row}(S),\quad
Z=AV.
\]

PDF text extraction occasionally loses the square root in the slide deck, while Recitation 11 explicitly prints `√d_k`. Scaling prevents dot products from growing with dimension and pushing softmax prematurely into saturation.

An autoregressive language model must not use future tokens while predicting position `t`. A causal mask inserts `-∞` where `j>t`, producing zero probability after softmax. Multi-head attention runs several sets of `W_Q,W_K,W_V` in parallel and concatenates their outputs. Transformer blocks add feed-forward layers, residual connections, and layer normalization.

## Reproducible derivation: causal attention over two tokens

Let `d_k=1`, with scalar queries, keys, and values

```text
Q = [1, 2]^T
K = [1, 3]^T
V = [10, 20]^T
```

The unmasked scores are

\[
QK^T=\begin{bmatrix}1&3\\2&6\end{bmatrix}.
\]

After applying the causal mask, the first row is `[1,-∞]`. Its softmax is `[1,0]`, so the first output is `10`. The second row can access both positions; `softmax([2,6])≈[0.018,0.982]`, producing

\[
0.018(10)+0.982(20)=19.82.
\]

This small example exposes two defining properties. Each row is one query's probability distribution, and the visible context grows with sequence position while future positions always have zero weight.

Dimensions can also be checked directly. If `Q,K∈R^{T×d_k}`, then `S,A∈R^{T×T}`. With `V∈R^{T×d_v}`, `Z=AV∈R^{T×d_v}`. Recitation 11 emphasizes these shapes because implementation errors frequently hide in transposes and the softmax axis.

## Recitation and homework connection

Recitation 11 compares pico and femto minGPT. Students identify word embeddings, attention heads, layers, and embedding size, then track the dimensions of `QKᵀ` and the attention matrix. The official solution says femto uses one head, one layer, and embedding size two; pico uses three heads, three layers, and embedding size six. Those are teaching configurations, not the formal scale of GPT-2.

Homework 11 asks students to plot training loss and perplexity and generate from several prompts and temperatures. Lecture 20 supplies the model internals; the homework turns them into an end-to-end system. The public prompt does not include the full course compute environment or staff feedback.

## Extension: attention is not a complete explanation

Attention weights show how one head combines values in one forward pass. They are not automatically a causal explanation of the model. Residual paths, later layers, and other heads continue to transform the representation. An attention map can be a diagnostic, but treating it as a full reasoning trace would go beyond the lecture materials.

Compared with an N-gram, attention selects context dynamically and shares continuous parameters. Its costs include the compute and memory of a `T×T` attention matrix and learned representations that are harder to audit one count at a time.

## An action for tonight

Choose small matrices with `T=3,d_k=2` and calculate `QKᵀ/√2`, the causal mask, row-wise softmax, and `AV` by hand. Reproduce the result in roughly ten lines of NumPy and assert every shape. Then deliberately apply column-wise softmax and check whether each row still sums to one; this catches an implementation error more effectively than memorizing the formula.

## References

- [CMU 07-280 Spring 2026 Lecture 20 slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec20_NLP_Attention_Transformers.pdf)
- [CMU 07-280 Recitation 11](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec11.pdf)
- [CMU 07-280 Recitation 11 solutions](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec11_sol.pdf)
- [CMU 07-280 Homework 11](https://www.cs.cmu.edu/~07280/assignments/hw11_blank.pdf)
