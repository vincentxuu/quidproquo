---
title: "AI Engineer Interview Daily — 2026-09-04: Coding"
date: 2026-09-04
category: daily
type: digest
tags: [ai-engineer-interview, daily, coding]
lang: en
description: "Today's ML coding drill: hand-implement a BPE tokenizer's merge logic and encode/decode symmetry, alongside three core concepts — hand-coding building blocks, batch inference trade-offs, and NumPy vectorization."
tldr: "ML coding interviews don't test whether you've memorized LeetCode templates — they test whether you can hand-write building blocks in NumPy (linear layers, residual connections, layer norm, causal self-attention) and read someone else's training/inference loop well enough to find the bug. Today covers four concepts: the real test in ML coding interviews is hand-implementation, not memorized answers; BPE tokenizer's core logic is 'count frequencies, merge iteratively, encode using the exact same merge order learned during training' — get the order wrong and encode no longer matches decode; batch inference trade-offs throughput against latency and has to handle padding waste across variable-length sequences; and the test for whether to vectorize a loop in NumPy is whether it has cross-element dependencies. The practice problem is a real technical-screen question from Glean — implementing a BPE tokenizer end to end, from training to encode/decode."
series:
  name: "AI Engineer Interview Daily"
  order: 16
---

> 🌏 [中文版](/posts/daily/2026-09-04-ai-interview-daily)

## Today's Topic

Coding interviews for AI engineers look very different from three years ago. Back then it was "can you implement KNN, can you run one pass of gradient descent." Today it's more common to get a chunk of training or inference code and be asked to find the bug, or to hand-write a model's building block — a linear layer, a residual connection, layer norm, causal self-attention — with no room to look up API syntax.

Today isn't a generic data-structures-and-algorithms drill. It's practice for the "ML/NLP-flavored" coding question: hand-implementing a tokenizer, and getting clear on what the training phase and the encoding phase each have to handle. This style of question shows up often in technical screens for LLM infra, search, and platform engineering teams — it tests whether you actually understand how text becomes tokens a model can read, not just whether you can call `tokenizer.encode()`.

## Core Concepts Quick Reference

### ML coding interviews test hand-implementation, not memorized templates

ML coding interviews today usually take one of two forms: you're given a chunk of model code (a model class, a training loop, an inference loop) and asked to find a correctness or performance bug, or you're asked to hand-write a common architecture (MLP, CNN, RNN, Transformer encoder/decoder) and its components (linear layers, projections, residual connections, layer norm, batch norm, causal self-attention, bidirectional self-attention, activation functions, optimizers) in NumPy or PyTorch. Many candidates burn their time reading the provided code or looking up NumPy/PyTorch syntax, leaving no time to actually debug or implement. What interviewers are actually screening for is whether you're fluent enough in these "deep learning primitives" to write them from memory — not fluent enough to merely read someone else's implementation.

### BPE tokenizer's core logic: frequency counting, iterative merging, and encode order must match training

Byte-Pair Encoding trains by splitting every word in a corpus into a character sequence, counting how often every adjacent symbol pair occurs, and merging the highest-frequency pair into a new symbol — repeating until a target vocabulary size is reached. This produces an ordered merge list. The place this problem most often breaks is at encode time: given a new string, you cannot just greedily match against "which substrings exist in the final vocabulary." You have to replay the exact same merges, in the exact same order they were learned during training. Get the order wrong, and the same string can split into a different token sequence, which means encode and decode stop being inverses of each other.

### Batch inference's throughput/latency trade-off and padding waste

Batching multiple requests together before running the model dramatically improves GPU utilization and throughput, which is why it shows up as a "design a batch inference function" coding question. The core difficulty is that sequences in the same batch are usually different lengths — you either pad every sequence to the batch's longest length (wasting compute on the shorter ones, and requiring an attention mask to hide the padded positions), or bucket requests by similar length to reduce waste. What this question is really testing is whether you understand that bigger batches aren't a free lunch — latency rises because you have to wait to fill a batch, and that's the cost you're paying for throughput. Saying "bigger batches are just faster" without naming that trade-off is a red flag.

### The test for NumPy vectorization: does this loop have cross-element dependencies?

Interviewers love hiding a Python for-loop in the provided code to see whether you'll rewrite it with broadcasting. The key diagnostic question is: does this iteration's computation depend on the result of the previous iteration? If every element's computation is independent — element-wise sums, normalization, element-wise multiplication — it can almost always be vectorized in one shot with broadcasting. But if the computation is inherently sequential, like an RNN's recurrent hidden state, or BPE's iterative merging, it can't be trivially vectorized, and the right move in an interview is to talk about a different optimization instead — for example, maintaining pair frequencies with a heap rather than rescanning every pair from scratch on every round.

## Today's Practice Problem

### Problem

"Implement a Byte-Pair Encoding (BPE) tokenizer: given a corpus and a target number of merges, learn the merge rules; then use the learned rules to encode and decode a new string so the two operations are inverses of each other."

**Source**: Glean, "Software Engineer" technical screen (indexed by PracHub's interview question bank) | **Difficulty**: Medium | **Stage**: Technical Screen

### Breakdown

1. **Clarify the problem first**: A few things to confirm up front, because each answer changes the implementation completely — how is the target vocabulary size defined (just the number of merges, or the total vocabulary including the initial character set)? Do you need to handle word boundaries (appending a special end-of-word marker to each word so merges never cross word boundaries)? What happens with characters never seen during training (should there be a byte-level fallback to guarantee no out-of-vocabulary token)? Skip these questions and the function signature may need a complete rewrite later.

2. **Establish a framework**: Split the problem into two independent phases instead of thinking of it as one function — training takes a corpus and produces an ordered merge list; encode/decode takes that merge list plus a string and applies the same rules in both directions. Splitting it this way lets you reason about training's efficiency separately from encoding's correctness, instead of tangling the two together.

3. **Dive into the core**: The most common source of bugs is the encode step — many candidates reach for a greedy match against "which substrings exist in the vocabulary" instead of replaying the learned merges in order. That approach can happen to pass a handful of test cases, but breaks the moment a string has merges with a real dependency chain, because BPE's merge order is inherently dependent — a later merge rule may build on a symbol produced by an earlier one. The secondary technical wrinkle is efficiency: a naive implementation rescans the entire corpus to recount pair frequencies after every single merge. If pressed on optimization, the answer is a pair-frequency structure with lazy updates — only updating the words actually affected by a merge, instead of recomputing everything.

4. **Wrap up**: Close with one line — "training and encoding are two applications of the same rule set: training decides what the rules are and what order they go in, and encoding has to replay that exact order. Without that symmetry, the tokenizer isn't a reversible transformation." That's the line that shows you understand the merge list itself carries hidden, order-dependent state — this isn't just a string-processing exercise.

### Sample Answer (how to articulate this in an interview)

> I'd split this into a training phase and an encode/decode phase. **Training**: split every word in the corpus into individual characters, append an `</w>` marker to mark the word boundary so merges never cross into the next word, then count every adjacent symbol pair's weighted frequency in a hash map — weighted by how often each word appears in the corpus, not counted once per unique word. Each round, take the highest-frequency pair, merge it into a new symbol, and append that rule to an ordered merge list. Repeat until the target number of merges is reached.
>
> **Encoding** is where things most easily go wrong, and it's worth calling out explicitly: given a new string, split it into characters plus the boundary marker, then strictly walk through the merge list in order — for each rule, scan the symbol sequence once and merge any matching adjacent pair, continuing until the whole merge list has been applied. The key is the ordering: you can't greedily match against "does this substring exist in the vocabulary," because a later merge rule may depend on a symbol a previous merge already created. Get the order wrong, and the same string splits into a different token sequence, and decode no longer recovers the original string.
>
> On efficiency, a naive training implementation rescans the whole corpus to recount frequencies every round, which is roughly O(number of merges × corpus size). If asked to optimize, I'd suggest maintaining pair frequencies in a priority queue and only updating the handful of words actually touched by each merge, rather than recomputing everything from scratch — this is the direction production-grade tokenizers, like GPT-2's byte-level BPE, actually take.

### Self-Check Checklist

Use this table to verify your answer covers the key points:

| Check Item | Mentioned? |
|---------|---------|
| Proactively clarified vocabulary size definition, word-boundary markers, and unseen-character handling | |
| Split the problem into independent training and encode/decode phases | |
| Stated that encode must strictly replay the training-time merge order, not greedily match the vocabulary | |
| Mentioned weighted frequency counting (weighted by word occurrence count, not per unique word) | |
| Discussed the naive version's efficiency problem and a possible optimization (priority queue, lazy updates) | |
| Bonus: connected this to production tokenizers' byte-level fallback design (avoiding OOV) | |

## Further Reading

- [Implement a Byte Pair Encoding (BPE) Tokenizer — PracHub](https://prachub.com/interview-questions/implement-a-byte-pair-encoding-bpe-tokenizer) — Original source for today's practice problem, a Glean Software Engineer technical screen question
- [MLE Interview 2.0: Research Engineering and Scary Rounds — Yuan Meng](https://www.yuan-meng.com/posts/mle_interviews_2.0) — A deep breakdown of what ML coding interviews test today: hand-writing building blocks, debugging someone else's training/inference code
- [Deep-ML — Practice Machine Learning](https://www.deep-ml.com/) — A free ML coding practice platform organized by category (NumPy, deep learning, NLP) for ongoing hand-implementation practice

## References

- [Implement a Byte Pair Encoding (BPE) Tokenizer — PracHub](https://prachub.com/interview-questions/implement-a-byte-pair-encoding-bpe-tokenizer) — Full source and difficulty/stage labeling for today's practice problem
- [MLE Interview 2.0: Research Engineering and Scary Rounds — Yuan Meng](https://www.yuan-meng.com/posts/mle_interviews_2.0) — Basis for the "ML coding interviews test hand-implementation" section in Core Concepts
- [Python Developer Interview Questions 2026 — KORE1](https://www.kore1.com/python-developer-interview-questions) — Supporting source for the latency/throughput trade-off and production considerations in the batch inference section
