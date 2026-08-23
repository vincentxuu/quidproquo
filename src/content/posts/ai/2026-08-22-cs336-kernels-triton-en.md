---
title: "CS336 Lecture 6: Benchmark and Profile Before Writing a Triton Kernel"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs336, triton, gpu, cuda, performance]
lang: en
series:
  name: "Reading Stanford CS336"
  order: 7
tldr: "Lecture 6 turns GPU principles into kernels: benchmark scaling across shapes, profile actual calls and time, then implement GeLU, softmax, reductions, and tiled matrix multiplication in Triton. Speed begins with measuring correctly."
description: "A guide to Stanford CS336 Spring 2026 Lecture 6: reliable GPU benchmarks, profiling, warps and occupancy, bank conflicts, Triton's programming model, fusion, and tiling."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs336-kernels-triton)

This post covers **CS336 Spring 2026 Lecture 6: Kernels, Triton**, taught by Percy Liang on April 15, 2026. Its primary source is the official executable lecture, [`lecture_06.py`](https://github.com/stanford-cs336/lectures/blob/main/lecture_06.py).

Lecture 5 explains data movement, tiling, and fusion. Lecture 6 asks you to measure and write a kernel. The order matters: without trustworthy benchmarks and a profiler, a custom kernel merely optimizes a guess.

## Correctness, performance, and diagnosis are separate layers

PyTorch provides tensor semantics and mature kernels, making it the correctness baseline. Triton lets a programmer think in thread blocks and tiles, controlling how data moves from HBM into faster memory, gets processed, and returns. Lower-level PTX exposes loads, stores, and registers, but it is rarely the right first interface.

Each layer has a job. A framework reference establishes correct output. A benchmark compares speed and scaling. A profiler identifies the kernels actually executed and their time. A single wall-clock measurement cannot separate compilation, launch overhead, asynchronous execution, and kernel runtime.

## Benchmarks must handle GPU asynchrony

GPU operations are usually queued asynchronously. Without synchronization, a CPU timer may measure only launch time. Reliable measurement warms up to remove JIT and first-cache effects, uses CUDA events or explicit synchronization, repeats trials, and sweeps problem sizes rather than testing one shape.

Shape sweeps expose dispatch changes, tile alignment, and wave quantization. The same API can select different CUTLASS kernels for different dimensions. Small matrices may be dominated by launch overhead; large ones can approach hardware throughput.

## Profilers answer where the time went

A profiler reveals which CUDA kernel a PyTorch operation invokes, its shape, and runtime. A naive GeLU consists of several pointwise kernels whose intermediates repeatedly enter and leave HBM. Built-in or compiled versions can fuse that work into one read and one write. This is better evidence than assuming a compiler performed fusion.

Hardware details remain visible. Warp divergence serializes branches. Excessive register use lowers occupancy. Conflicting access to shared memory's banks serializes traffic. Uncoalesced HBM access wastes transactions. Higher occupancy is not automatically better: thread coarsening can trade resident threads for increased reuse.

## Triton's basic unit is a block of data

A Triton kernel uses a program ID to locate its block, constructs offsets and masks, loads a tile, computes vectorized operations, and stores results. GeLU is simple elementwise fusion. Row-wise softmax reduces within a row while preserving numerical stability. Row sum introduces accumulation across tiles. Matrix multiplication tiles both inputs and accumulates partial results.

The examples form a deliberate progression:

1. GeLU: independent elements, with fusion as the main objective.
2. Softmax: a row-level reduction plus numerical stability.
3. Row sum: tiled accumulation when data exceeds one block.
4. Matrix multiplication: tile shapes, shared reuse, registers, and boundary masks.

If a matrix multiplication is immediately followed by ReLU or GeLU, the activation can run while output remains in fast memory, avoiding another kernel launch and HBM round trip.

## A stopping condition for custom kernels

Use a framework implementation as the correctness oracle, including non-divisible dimensions and dtype tolerances. Plot runtime against shape to identify where the custom version wins. Finally, profile kernel counts, memory traffic, and occupancy so the code is not specialized to one convenient benchmark.

Triton reduces CUDA's syntactic burden but does not remove hardware constraints. Lecture 6 teaches the complete loop: understand the programming model, measure, diagnose, then change the data path.

## Material fidelity

This lecture has a Spring 2026 schedule entry and a complete executable artifact containing benchmarks, profiling, and four Triton examples.

## References

- [CS336 Spring 2026 course and schedule](https://cs336.stanford.edu/)
- [Lecture 6 executable lecture](https://github.com/stanford-cs336/lectures/blob/main/lecture_06.py)
- [Triton language documentation](https://triton-lang.org/main/index.html)
- [PyTorch Profiler](https://pytorch.org/tutorials/recipes/recipes/profiler_recipe.html)

