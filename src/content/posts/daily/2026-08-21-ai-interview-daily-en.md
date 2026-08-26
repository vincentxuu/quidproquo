---
title: "AI Engineer Interview Daily — 2026-08-21: Coding (ML From-Scratch Implementation)"
date: 2026-08-21
category: daily
tags: [ai-engineer-interview, daily, coding]
lang: en
description: "Today's ML coding round practice: NumPy vectorization, softmax numerical stability, multi-head attention from scratch, and padding/masking for batch inference."
tldr: "ML coding rounds don't test leetcode recall — they test whether you can implement attention, k-means, and other ML primitives from scratch using only NumPy, while articulating the shape and complexity at every step. Today covers five high-frequency topics: vectorized thinking, softmax numerical stability, shape tracking and complexity analysis, padding/masking for batch inference, and how to verify correctness when hand-coding algorithms."
series:
  name: "AI Engineer 面試日練"
  order: 2
---

> 🌏 [中文版](/posts/daily/2026-08-21-ai-interview-daily)

## Today's Topic

The ML coding round is what separates ML engineer interviews from general software engineering interviews. Instead of LRU caches or rate limiters, you get "no `torch.nn`, no autograd — implement this ML component using only NumPy." Interviewers care not just about whether it runs, but whether you have vectorization instincts, whether you've hit numerical stability pitfalls before, and whether you can narrate the tensor shape at every step as you code.

These problems appear most often in frontier lab ML engineer or research engineer loops — 60 minutes, live shared editor, collaborative coding. Today we skip general algorithm problems and focus on the hand-coding skills specific to this track.

## Core Concepts Quick Reference

### NumPy Vectorization and Broadcasting

Avoiding Python for-loops for element-wise operations is the first bar in an ML coding round. Interviewers will stare at your nested loops and ask "how slow would this be at batch size 1000" — you need to immediately rewrite it as matrix operations, using broadcasting so a `(batch, seq, dim)` tensor does matmul directly instead of looping over each batch or token.

### Softmax Numerical Stability

Softmax is a component you'll use in nearly every from-scratch problem, but naively calling exp on raw logits causes overflow for large values. The standard fix is subtracting the axis maximum before exp (`x - np.max(x, axis=-1, keepdims=True)`) — mathematically equivalent, but it's the dividing line interviewers use to tell whether you've written production code.

### Shape Tracking and Complexity Analysis

When hand-coding attention, convolution, or similar problems, interviewers want you to narrate the tensor shape at every step and state the overall time complexity. The core cost of self-attention is the `QKᵀ` step at O(n²d) — this is why long sequences need flash attention or sparse attention optimizations. Articulating the naive version's bottleneck earns you the right to discuss optimization directions.

### Padding and Masking for Batch Inference

Real data has variable sequence lengths, so batch inference requires padding to a uniform length — but padded positions must not participate in attention or loss computation. The approach is to create a boolean mask and fill padding positions with `-inf` (or a very small value) after computing attention scores but before softmax, ensuring those positions get near-zero weight after softmax.

### Testing Strategy for From-Scratch Algorithms

When implementing an ML algorithm from scratch, don't wait until the end to test. Interviewers expect you to verify intermediate results with examples small enough to compute by hand (e.g., `seq_len=2` attention, 3-point k-means), or to compare outputs against `sklearn`/`scipy` built-in implementations. This habit is a bonus signal because it shows how you'd prevent silent bugs in production.

## Today's Practice Problem

### Problem

"Without using `torch.nn` or autograd, implement scaled dot-product attention and multi-head attention from scratch using only NumPy."

**Source**: OpenAI ML Engineer Interview Round 2　**Difficulty**: Advanced　**Format**: Onsite ML coding round (60 minutes, live shared editor)

### Approach Breakdown

1. **Clarify the problem first**: Ask about batch size, sequence length, whether you need to handle a padding mask, and whether causal masking is needed (decoder-only scenarios). These determine whether you need additional masking logic after computing attention scores.

2. **Build the scaffold**: Start with a single-head scaled dot-product attention (`Q, K, V → softmax(QKᵀ/√d)V`), verify the shapes line up, then abstract to multi-head — split the embedding dimension into h heads, compute in parallel, concat back, and apply an output projection.

3. **Go deeper on the core**: The trade-off interviewers most want to hear is "for-loop over each head vs. reshape to fold the head dimension into the batch dimension and compute all at once" — the latter is what production code uses, and it demonstrates you know how to squeeze performance out of NumPy broadcasting. Another commonly probed point is softmax numerical stability, and how to generate a causal mask using `np.triu` without writing a for-loop.

4. **Wrap up**: Proactively mention "this naive implementation is O(n²d); real systems use flash attention or KV cache for long sequences and autoregressive generation," and verify correctness with a small hand-computed case rather than assuming it works.

### Sample Answer (How to Walk Through It in the Interview)

> I'll start with the single-head version, chaining three matmuls and one softmax. **Inputs are `Q`, `K`, `V`, all with shape `(batch, seq_len, d_k)`.** First compute `scores = Q @ K.transpose(-1, -2) / sqrt(d_k)`, yielding an attention score matrix of shape `(batch, seq_len, seq_len)`. If there's a mask, set the masked positions to `-1e9` at this step, then apply softmax — softmax needs to subtract the axis max first to avoid overflow. Finally `output = softmax(scores) @ V`, recovering shape `(batch, seq_len, d_k)`.
>
> **The key to multi-head is not actually writing a for-loop over h heads.** I'll split `d_model` into h chunks of `d_k = d_model // h`, use `reshape` plus `transpose` to move the head dimension alongside the batch dimension, producing `(batch * h, seq_len, d_k)`. This way the single-head code can be reused as-is — NumPy's matmul automatically handles each head in parallel. After computation, reshape back to `(batch, seq_len, d_model)` and apply an output projection `W_o`.
>
> **For verification**, I'll use a small case with `seq_len=2, d_model=4` to hand-compute attention scores and compare against program output. If there's a causal mask, I'll generate an upper-triangular mask with `np.triu` to test edge cases, confirming the first token can only attend to itself and cannot peek at future tokens.

### Self-Check Checklist

Use this table to check whether your answer covers the key points:

| Checkpoint | Covered? |
|---------|---------|
| Q/K/V shapes clearly stated | |
| Softmax numerical stability (subtract max) | |
| Multi-head via reshape/transpose, not for-loop | |
| Masking applied before softmax with -inf | |
| Complexity analysis: O(n²d) | |
| Correctness verified with small hand-computed case | |
| Bonus: mentioned flash attention / KV cache optimization directions | |

## Further Reading

- [Interview Coder — OpenAI ML Engineer Interview (2026): Process & Prep](https://www.interviewcoder.co/blog/openai-ml-engineer-interview) — Full breakdown of OpenAI ML engineer six-round interviews, with NumPy from-scratch examples for attention, k-means, and 2D convolution
- [Sundeep Teki — AI Career Advice for OpenAI, Anthropic & DeepMind Roles](https://www.sundeepteki.org/advice.html) — Anthropic Research Engineer 2026 interview guide covering PyTorch/JAX/NumPy from-scratch implementation and a six-month preparation framework
- [Shadecoder — Machine Learning Coding Interview Prep Guide (2026)](https://www.shadecoder.com/blogs/machine-learning-coding-interview-prep-guide-2026-skills-practice-tools) — ML coding round problem taxonomy: data preprocessing, algorithm from-scratch, model evaluation, optimization

## References

- [Interview Coder — OpenAI ML Engineer Interview (2026): Process & Prep](https://www.interviewcoder.co/blog/openai-ml-engineer-interview) — Source for today's practice problem: attention from-scratch problem type and 60-minute live coding format in ML coding rounds
- [Sundeep Teki — AI Career Advice for OpenAI, Anthropic & DeepMind Roles](https://www.sundeepteki.org/advice.html) — Core concept of "ML-native coding fluency" and the interview trend of prioritizing from-scratch implementation over framework APIs
- [Shadecoder — Machine Learning Coding Interview Prep Guide (2026)](https://www.shadecoder.com/blogs/machine-learning-coding-interview-prep-guide-2026-skills-practice-tools) — Common patterns for data preprocessing and algorithm from-scratch implementation in core concepts
