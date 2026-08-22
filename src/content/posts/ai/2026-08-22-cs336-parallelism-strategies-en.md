---
title: "CS336 Lecture 8: Align ZeRO, FSDP, and 3D Parallelism with Hardware Topology"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs336, distributed-training, fsdp, zero, parallelism]
lang: en
series:
  name: "Reading Stanford CS336"
  order: 9
tldr: "Lecture 8 moves from parallel primitives to system design: ZeRO progressively shards optimizer state, gradients, and parameters; TP, PP, SP, and EP split width, depth, sequence, and experts. Their composition must follow topology and dynamic activation memory."
description: "A guide to Stanford CS336 Spring 2026 Lecture 8: ZeRO stages 1–3, FSDP, pipeline/tensor/sequence/expert parallelism, activation memory, and 3D/4D parallelism."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs336-parallelism-strategies)

This post covers **CS336 Spring 2026 Lecture 8: Parallelism**, taught by Tatsunori Hashimoto on April 22, 2026. Its primary source is the official [`lecture_08.pdf`](https://github.com/stanford-cs336/lectures/blob/main/lecture_08.pdf).

Lecture 7 builds parallelism from collectives. Lecture 8 asks how to compose it for a large model. It treats the datacenter as the new compute unit: GPU memory, NVLink domains, cross-node fabric, and batch size jointly determine sharding. No strategy solves every limit alone.

## ZeRO removes replicated state in stages

Naive data parallelism stores full parameters, gradients, and optimizer state on every device. Compute spreads with the batch, while memory remains replicated. ZeRO uses the relationship between reduce-scatter and all-gather to shard progressively:

- **Stage 1:** shard optimizer state. Each rank updates its parameter shard, then all-gathers new parameters.
- **Stage 2:** shard gradients too. Reduce-scatter them layer by layer during backward.
- **Stage 3/FSDP:** shard parameters. All-gather them per layer before forward or backward and free them afterward.

Higher stages reduce persistent memory but invoke collectives more frequently, making prefetch and compute/communication overlap critical. FSDP also does not automatically solve activation memory; long sequences and microbatches can still dominate.

## Model parallelism solves a model or layer that does not fit

Pipeline parallelism splits layers along depth. Microbatches improve utilization but leave bubbles. Zero-bubble schedules go further by separating activation-gradient and weight-gradient work and rearranging idle slots.

Tensor parallelism splits matrices along width. It avoids pipeline bubbles but communicates every layer, so it usually remains within one node or NVLink island. Sequence parallelism additionally shards activations for normalization, dropout, and other regions outside tensor-parallel matrix multiplications.

## MoE adds expert parallelism

Expert parallelism places experts on different ranks and routes tokens through all-to-all. In MLP blocks it behaves like another form of width parallelism and reduces expert parameters per device. Attention usually remains dense, so attention and expert blocks prefer different parallel degrees.

EP, TP, and DP dimensions cannot simply be multiplied. Expert balance, whether all-to-all crosses slow links, and how DP replicas overlap EP groups all affect utilization.

## Activations are dynamic memory, not a parameter footnote

Parameter memory can be calculated before launch. Activations vary with batch, sequence length, hidden size, layers, and checkpointing. Tensor and pipeline parallelism shard some activations; sequence parallelism handles components replicated along sequence.

Long context adds context parallelism: ranks hold sequence segments and exchange K/V required for attention. It extends context across devices at the cost of attention communication and load balancing.

## A practical order for 3D or 4D parallelism

The lecture provides a topology-aware sequence rather than fixed degrees:

1. Until the model fits, use TP or EP within a fast intra-node domain.
2. Use PP to split layers across slower nodes while controlling bubbles.
3. Once it fits, spend remaining devices on DP or ZeRO throughput.
4. Add SP or CP and recomputation when activations or context dominate.

Large-model case studies use different combinations, proving that no universal configuration exists. Dense versus MoE, short versus long context, and initial pretraining versus context extension can all change the strategy.

## How to validate a parallel configuration

Build per-rank accounting for parameters, optimizer state, gradients, activations, and communication buffers. List each parallel dimension's collective, message size, frequency, and link. Then measure steady-state throughput, bubble fraction, and overlap rather than merely confirming that OOM disappeared.

A configuration that runs is not necessarily efficient. Lecture 8's central test is whether memory saved by sharding justifies its added communication and idle time.

## Material fidelity

This lecture has a Spring 2026 schedule entry and a complete official PDF. This guide covers its networking, ZeRO/FSDP, TP/PP/SP/EP, and composition sections.

## References

- [CS336 Spring 2026 course and schedule](https://cs336.stanford.edu/)
- [Lecture 8 official slides](https://github.com/stanford-cs336/lectures/blob/main/lecture_08.pdf)
- [ZeRO](https://arxiv.org/abs/1910.02054)
- [PyTorch FSDP](https://pytorch.org/docs/stable/fsdp.html)

