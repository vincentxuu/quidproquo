---
title: "CS336 Lecture 2: Count FLOPs and Memory Before Asking Whether a Model Fits"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs336, llm, pytorch, gpu, performance]
lang: en
series:
  name: "Reading Stanford CS336"
  order: 3
tldr: "Lecture 2 reduces model training to tensors, FLOPs, bytes, and time: use einops to track dimensions, arithmetic intensity and roofline analysis to identify bottlenecks, then trade compute for memory with gradient accumulation and activation checkpointing."
description: "A guide to Stanford CS336 Spring 2026 Lecture 2: PyTorch tensors, einops, training FLOPs, MFU, arithmetic intensity, roofline analysis, optimizer memory, and two common memory-saving techniques."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs336-resource-accounting)

This post covers **CS336 Spring 2026 Lecture 2: PyTorch (einops), resource accounting**, taught by Percy Liang on April 1, 2026. Its primary source is the official executable lecture, [`lecture_02.py`](https://github.com/stanford-cs336/lectures/blob/main/lecture_02.py).

Lecture 1 places efficiency at the center of the course; Lecture 2 immediately asks you to calculate it. The questions are no longer “is this model large?” but: how much computation does a 70B model require? What is the largest AdamW model that fits on eight H100s? Is an operation limited by compute or memory bandwidth?

## Everything eventually becomes a tensor

Data, parameters, gradients, activations, and optimizer states all live in tensors. A memory estimate needs two quantities: the number of elements and the bytes per element. fp32 uses four bytes; fp16 and bf16 use two. bf16 retains roughly the dynamic range of fp32 at lower precision, so deep-learning systems often store parameters, activations, and gradients in bf16 while retaining optimizer state in fp32.

This inventory also explains why “parameter count times two bytes” badly underestimates training memory. AdamW stores weights, gradients, momentum, and second moments. Activations vary with batch size, sequence length, and depth. Counting weights alone is, at best, a lower bound.

## Einops puts dimension names into the operation

PyTorch's `transpose(-2, -1)` is concise but hides meaning behind negative indices. `einops` names dimensions so einsum, reduce, and rearrange state which axes survive, which are reduced, and which are split.

This is more than a syntax preference. Transformer tensors commonly carry batch, sequence, head, and hidden dimensions simultaneously. A misplaced axis can still broadcast and produce a plausible but incorrect result. Treating shapes as readable contracts is the correctness foundation for later performance work.

## FLOPs estimate total work first

A multiply and an addition count as two floating-point operations. Matrix-multiplication cost follows directly from its three nested indices. For a dense Transformer training run, the lecture uses a standard approximation:

```text
6 × parameters × training tokens FLOPs
```

The factor of six combines the dominant forward and backward matrix multiplications. It is not a precise profiler, but it is enough for order-of-magnitude planning. Divide total FLOPs by the GPU count, peak FLOP/s per GPU, and expected utilization to estimate time before renting hardware.

The lecture also separates FLOPs from FLOP/s: one is work completed, the other is hardware throughput. Model FLOPs Utilization (MFU) divides achieved throughput by the advertised peak. A specification-sheet number is not the speed an arbitrary program receives automatically.

## Arithmetic intensity tells you what you are waiting for

Arithmetic intensity measures FLOPs performed per byte moved. Elementwise operations reuse little data and are often memory-bandwidth bound. Large matrix multiplications reuse loaded values and are more likely compute-bound.

The roofline model combines both ceilings:

```text
achievable FLOP/s = min(peak compute, memory bandwidth × arithmetic intensity)
```

A point on the sloped region cannot benefit from more arithmetic units; reduce data movement or fuse operations instead. Only the horizontal region is compute-bound, where lower-precision tensor cores or higher peak compute directly help. This distinction leads into the later GPU, kernel, and FlashAttention lectures.

## Why backward is roughly twice forward

A linear layer computes its output during the forward pass. Backpropagation computes both input gradients and weight gradients, each through a matrix multiplication of similar scale. Dominant dense operations therefore make backward roughly twice the cost of forward, producing the factor of six above.

Optimizer arithmetic may be small relative to matrix multiplication while still being bandwidth-bound and consuming substantial state memory. This is where FLOP counting alone fails: runtime depends on where data lives and how often it moves, not merely on the operation count.

## Two ways to exchange compute for memory

**Gradient accumulation** splits a large batch into microbatches and updates parameters only after accumulating their gradients. It reduces the activations held by each forward/backward pass but does not reduce the total work for the batch.

**Activation checkpointing** stores only selected intermediate values and recomputes the rest during backward. It deliberately adds FLOPs to lower peak memory. When memory would otherwise prevent a useful batch size or sequence length, this exchange can improve the feasibility of the full training run.

## The table to keep after this lecture

Make four rows for your model: parameters, gradients, optimizer states, and activations. Record dtype, element count, and bytes for each. Then list the dominant operations with FLOPs, bytes read and written, and arithmetic intensity. Only then decide whether to change batch size, precision, checkpointing, or hardware.

The table does not replace a profiler, but it catches order-of-magnitude mistakes before an expensive run. The CS336 resource-accounting mindset is simple: make the estimate say what you expect to observe before executing the experiment.

## Material fidelity

This lecture has a Spring 2026 schedule entry and a complete executable artifact. This guide follows its PyTorch examples and summary without merging another offering.

## References

- [CS336 Spring 2026 course and schedule](https://cs336.stanford.edu/)
- [Lecture 2 executable lecture](https://github.com/stanford-cs336/lectures/blob/main/lecture_02.py)
- [PyTorch automatic mixed precision](https://pytorch.org/docs/stable/amp.html)
- [Einops documentation](https://einops.rocks/)

