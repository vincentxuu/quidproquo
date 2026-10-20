---
title: "AI Engineer Interview Daily — 2026-10-20: Deep Learning & NLP"
date: 2026-10-20
category: daily
type: digest
tags: [ai-engineer-interview, daily, deep-learning]
lang: en
description: "Tuesday's slot is Deep Learning & NLP: a scenario question — your Transformer runs out of memory on long documents — anchors today's practice on telling FlashAttention and Sliding Window Attention apart."
tldr: "Today's core concepts: the Q/K/V mechanics behind self-attention and the √dₖ scaling factor, why multi-head attention needs multiple heads, why positional encoding is necessary, and how to break down self-attention's O(n²) cost into fixable pieces. The practice question is a common scenario prompt — your Transformer OOMs on long documents — and the real test isn't naming FlashAttention or Sliding Window Attention, it's being able to say clearly that the first optimizes GPU memory movement (I/O bound) while the second actually cuts the algorithmic complexity from O(n²) to linear. They solve different layers of the same problem."
series:
  name: "AI Engineer Interview Daily"
  order: 62
---

> 🌏 [中文版](/posts/daily/2026-10-20-ai-interview-daily)

## Today's Focus

Tuesday's fixed slot is Deep Learning & NLP: CNNs, RNNs, Transformers, attention, tokenization, fine-tuning, and embeddings are some of the highest-frequency architecture topics in AI/ML Engineer interviews. These questions often come wrapped in a scenario — "your model hits this limitation in production, what do you do" — rather than a plain definition question, because what the interviewer actually wants to see is whether you can break an architectural constraint (like attention's computational complexity) into actionable engineering choices, not just recite terms from a paper.

## Core Concepts, Quick Review

### Self-attention and Q/K/V

Every token gets projected into three vectors: Query (what I'm looking for), Key (how I can be found), and Value (the actual information I carry). The computation takes the dot product of Q against every token's K to get a score, scales it down by √dₖ, runs it through softmax to get a probability distribution, and uses that distribution to weight all the tokens' V vectors. The scaling by √dₖ is a common follow-up question — as the Key dimension dₖ grows, the dot products get larger in magnitude, and without scaling, softmax ends up dominated by a few extreme values with vanishingly small gradients elsewhere. The scaling keeps softmax's input in a range where gradients stay stable.

### Why multi-head attention needs multiple heads

A single Q/K/V set can only learn one "attention pattern" — say, purely subject-verb syntactic relations. Multi-head attention splits the vectors into several smaller subspaces and runs attention independently in each one, letting the model learn several different relationships in parallel: some heads focus on syntactic structure, others on semantic similarity. The outputs from all heads get concatenated and linearly projected back to the original dimension. The key detail to land in an interview: multiple heads aren't a parameter-count trick for squeezing out more performance — they're structural room for the model to learn multiple attention patterns at once.

### Why positional encoding is necessary

Self-attention by itself is order-insensitive — shuffle the input tokens and the set of attention outputs doesn't change; the model has no way to know "who comes before whom" from attention alone. Positional encoding injects position information directly into the token embeddings so the model has an order signal before attention even runs. The original Transformer used fixed sinusoidal encodings; later models mostly switched to learned positional embeddings, and most mainstream LLMs today (like the Llama family) use RoPE (Rotary Position Embedding), which makes the attention score itself vary with the relative distance between tokens — this generalizes to sequence lengths the model never saw during training far better than absolute positional encoding does.

### Self-attention's O(n²) cost, and two genuinely different fixes

With n input tokens, every token has to compute an attention score against every other token, producing an n×n score matrix — double the text length and the compute quadruples. There are two fundamentally different fixes for this bottleneck, and interviews punish conflating them: FlashAttention doesn't change the math or the O(n²) theoretical complexity at all — it optimizes GPU memory movement. Standard attention has to write and read that n×n intermediate matrix between HBM (large but slow) and SRAM (small but 10–20x faster) across four round trips, so the GPU spends most of its time waiting on data rather than computing. FlashAttention tiles the matrix into blocks and does softmax plus weighting entirely inside SRAM, avoiding ever materializing the full matrix in HBM. Sliding Window Attention is the one that actually changes the compute itself — each token only attends to a fixed range of nearby tokens, cutting complexity from O(n²) to O(n×w), at the cost of giving up direct long-range dependencies beyond the window.

## Today's Practice Question

### The Question

Your Transformer model runs out of memory (OOM) on long documents because self-attention's compute cost is quadratic (O(n²)). How would you address this?

**Source**: Compiled from amitshekhariitbhu/ai-engineering-interview-questions (a GitHub AI engineering interview question bank covering LLM/Transformer architecture scenario questions)　**Difficulty**: Advanced　**Round**: Onsite / System design

### How to Break It Down

1. **Clarify the problem first**: Is this OOM happening during training or inference? How long are the actual documents — a few thousand tokens or hundreds of thousands? Is the hardware constraint a single GPU or can it scale across multiple? And can the task tolerate some loss of long-range accuracy in exchange for memory headroom? These answers determine which direction to go.
2. **Build a framework**: Split the options into two tiers — first ask "have we maxed out memory efficiency at the current complexity" (FlashAttention, KV cache quantization/paging), and only if that's still not enough, ask "do we need to actually reduce the computational complexity" (Sliding Window Attention, sparse attention, chunking with cross-chunk aggregation). Lead with the framework before filling in details — don't jump straight to an answer the moment you hear "OOM."
3. **Dig into the core trade-off**: The technical crux here is keeping FlashAttention and Sliding Window Attention clearly separated as solving different layers of the problem. FlashAttention doesn't change the O(n²) theoretical complexity — it fixes the I/O bottleneck of moving data between HBM and SRAM, and the math output is identical. Sliding Window Attention is the one that actually cuts complexity from O(n²) to O(n×w), at the cost of direct long-range dependencies outside the window (though information can still propagate indirectly to farther positions through stacked layers). Conflating the two in an interview — claiming you "reduced the compute" when you actually just sped up memory I/O — gets caught immediately by a good interviewer's follow-up.
4. **Wrap it up**: Land on one summary line — "First max out memory efficiency at the existing complexity with FlashAttention; if document length still exceeds what's workable, move to Sliding Window Attention or chunking to actually cut complexity, and validate the trade-off with metrics on tasks that genuinely need long-range dependencies." Then add a note on production monitoring: inference latency, OOM rate, and — if you switch to windowed attention — tracking whether accuracy on long-range tasks has regressed.

### Sample Answer (how to actually say this in the interview)

> **Start by locating the actual bottleneck**: I'd first ask whether the OOM happens during training or inference, how long the documents typically run, and whether this task genuinely needs long-range dependencies — a legal contract where clauses reference each other is a very different case from generic long-document summarization. If documents are in the few-thousand-to-ten-thousand-token range, I'd first check whether FlashAttention is already in use — it doesn't change the O(n²) theoretical complexity, but it fixes the I/O bottleneck where standard attention has to round-trip the N×N intermediate matrix between a GPU's HBM and SRAM four separate times. Tiling the computation to stay inside the faster SRAM alone often lets the same memory budget handle several times the input length.
>
> **If that's not enough, go after the actual complexity**: I'd move to Sliding Window Attention, where each token only attends to a fixed range of nearby tokens, cutting complexity from O(n²) to O(n×w) — double the text length and the work only doubles, not quadruples. The trade-off is that tokens outside the window can't see each other directly anymore, but information still propagates outward layer by layer through the stack — it just takes a longer path.
>
> **Close the loop with production validation**: After switching to windowed attention, I wouldn't just check that the OOM is gone — I'd specifically run evaluations on tasks that need long-range dependencies (like clauses that reference each other across a long document) to confirm the trade-off didn't visibly hurt accuracy. After deployment I'd keep monitoring inference latency and OOM rate, and if the business genuinely needs very long-range dependencies, I'd look at chunking combined with cross-chunk retrieval to recover some of what windowing gave up.

### Self-Check List

Use this table to make sure your answer hit the key points:

| Checkpoint | Covered? |
|---------|---------|
| Clarified document length, training vs. inference, and whether long-range accuracy loss is tolerable | |
| Clearly separated FlashAttention (I/O optimization, no change to theoretical complexity) from Sliding Window Attention (actually cuts O(n²) to linear) | |
| Named the root cause of O(n²): every token computes an attention score against every other token | |
| Named the trade-off: windowed/sparse attention gives up direct long-range dependencies outside the window | |
| Mentioned production monitoring: latency, OOM rate, and validating with long-range task metrics | |
| Bonus: mentioned KV cache paging/quantization, or chunking with retrieval to recover long-range dependencies | |

## Further Reading

- [How does Sliding Window Attention work? — Outcome School](https://outcomeschool.com/blog/how-does-sliding-window-attention-work) — Uses a classroom analogy to make intuitive why O(n²) blows up and how windowing turns it linear; a good first follow-up on this question.
- [What is Flash Attention and Why Is It So Fast? — Outcome School](https://outcomeschool.com/blog/decoding-flash-attention) — A detailed breakdown of the HBM/SRAM speed gap and how tiling cuts memory movement, filling in the GPU-memory mechanics this article didn't fully expand on.

## References

- [amitshekhariitbhu/ai-engineering-interview-questions — GitHub](https://github.com/amitshekhariitbhu/ai-engineering-interview-questions) — Source of today's "Transformer OOMs on long documents" practice question, and also the compiled question list for Q/K/V, positional encoding, and multi-head attention core concepts.
- [Math Behind Attention: Q, K, V — Outcome School](https://outcomeschool.com/blog/math-behind-attention-qkv) — Backs the math detail in "Self-attention and Q/K/V," including the √dₖ scaling derivation.
- [How does Sliding Window Attention work? — Outcome School](https://outcomeschool.com/blog/how-does-sliding-window-attention-work) — Backs the Sliding Window Attention mechanism in "Self-attention's O(n²) cost, and two genuinely different fixes."
- [What is Flash Attention and Why Is It So Fast? — Outcome School](https://outcomeschool.com/blog/decoding-flash-attention) — Backs the FlashAttention HBM/SRAM I/O bottleneck explanation in the same section.
