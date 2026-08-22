---
title: "CS336 Lecture 7: Build Data, Tensor, and Pipeline Parallelism from Collectives"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs336, distributed-training, pytorch, gpu, parallelism]
lang: en
series:
  name: "Reading Stanford CS336"
  order: 8
tldr: "Lecture 7 starts below FSDP APIs, building a communication language from broadcast, all-reduce, all-gather, reduce-scatter, and all-to-all before assembling data, tensor, and pipeline parallelism."
description: "A guide to Stanford CS336 Spring 2026 Lecture 7: the GPU network hierarchy, collectives, torch.distributed, data parallelism, tensor parallelism, pipeline parallelism, and communication cost."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs336-parallelism-mechanics)

This post covers **CS336 Spring 2026 Lecture 7: Parallelism**, taught by Percy Liang on April 20, 2026. Its primary source is the official executable lecture, [`lecture_07.py`](https://github.com/stanford-cs336/lectures/blob/main/lecture_07.py).

Single-GPU optimization ends here. When the model, optimizer state, or batch grows further, work must cross devices. Lecture 7 deliberately avoids hiding the mechanics behind a high-level wrapper and instead builds three fundamental parallel strategies from collective operations.

## Communication has a physical hierarchy

Registers, shared memory, and HBM within one GPU are fastest. GPUs in one node communicate through NVLink or NVSwitch. Cross-node traffic uses InfiniBand or Ethernet with lower bandwidth and higher latency. RDMA lets devices access remote memory without extra copies through the CPU and kernel networking stack.

“How many bytes move?” is therefore incomplete without “which link carries them?” Tensor parallelism communicates every layer and usually stays within a fast interconnect domain. Pipeline parallelism communicates less frequently and can span slower links, but introduces bubbles.

## Collectives are the instruction set of distributed training

A rank is one participating process or device; world size is their total count. Broadcast, scatter, gather, and reduce are foundations. All-gather, reduce-scatter, and all-reduce are training workhorses. All-to-all supports MoE routing.

An all-reduce can be decomposed into reduce-scatter followed by all-gather. This equivalence is crucial: if the next step requires only one shard per device, computation can stop after reduce-scatter instead of immediately replicating the entire tensor. ZeRO and FSDP exploit exactly this fact in the next lecture.

`torch.distributed` and NCCL select ring, tree, or other algorithms based on topology and launch communication kernels. The API may be one line, while performance depends on message size, link type, topology, and collective pattern.

## Data parallelism copies the model and splits the batch

Every rank keeps a full model, processes different data, and all-reduces gradients after backward. Ranks begin from identical parameters and apply the same averaged gradient, so they remain synchronized.

The method is simple and computation is independent. Its limitation is that every device replicates model and optimizer state, so memory does not fall with world size. Global batch also grows with rank count, and returns diminish beyond the critical batch size.

## Tensor parallelism splits matrix width

Tensor parallelism shards a linear layer's weight matrix by rows or columns. Each rank computes partial results, followed by all-reduce, all-gather, or reduce-scatter to produce the layout needed by the next operation.

It distributes individual-layer parameters and keeps all GPUs active without pipeline bubbles. The cost is frequent communication at every layer, which is why tensor-parallel groups usually remain within a high-speed NVLink domain.

## Pipeline parallelism splits layer depth

Consecutive layers are placed on different ranks, and activations flow from one stage to the next. Sending a whole batch at once leaves later stages waiting. Microbatching lets different stages process different microbatches simultaneously and fills the pipeline through a schedule.

Bubbles cannot disappear entirely; their fraction depends on stage and microbatch counts. Pipeline parallelism sends activations only at stage boundaries and can suit slower cross-node links. Its costs are more complicated scheduling, activation storage, and load balancing.

## The three methods are not mutually exclusive

Data parallelism splits the batch, tensor parallelism splits width, and pipeline parallelism splits depth. Large training runs combine them and may add sequence or expert parallelism. The composition should follow hardware topology: frequent communication stays on fast links; infrequent communication crosses slower ones.

The most useful experiment in the executable lecture is to hold tensor size fixed, increase ranks, and measure all-reduce, reduce-scatter, and each parallel strategy. Scaling will not remain linear because communication and idle time progressively consume new compute.

## Material fidelity

This lecture has a Spring 2026 schedule entry and a complete executable artifact with PyTorch examples for collectives and all three parallel strategies.

## References

- [CS336 Spring 2026 course and schedule](https://cs336.stanford.edu/)
- [Lecture 7 executable lecture](https://github.com/stanford-cs336/lectures/blob/main/lecture_07.py)
- [PyTorch Distributed Overview](https://pytorch.org/tutorials/beginner/dist_overview.html)
- [NCCL documentation](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/)

