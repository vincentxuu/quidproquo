---
title: "CS231N L11: Large-Scale Distributed Training — Splitting One Model Across Tens of Thousands of GPUs"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, ai-course, stanford, distributed-training, gpu, parallelism]
lang: en
series:
  name: "Reading Stanford CS231N"
  order: 13
tldr: "CS231N Lecture 11 uses Llama3-405B as its running example. It starts with GPU hardware and clusters (the H100, 8-GPU servers, a 24,576-GPU cluster), then maps the four dimensions of a Transformer activation to four kinds of parallelism: split the batch for data parallelism (which grows into FSDP and HSDP), the sequence for context parallelism, the layers for pipeline parallelism, and the channels for tensor parallelism. Along the way it covers activation checkpointing (trading recomputation for memory) and a practical scaling recipe, and it uses Model FLOPs Utilization (MFU) as the tuning target: above 30% is good, above 40% is excellent."
description: "A guide to Stanford CS231N Spring 2026 Lecture 11 (Large-Scale Distributed Training): GPU and cluster hardware, collectives such as all-reduce, data parallelism, FSDP, and HSDP, the memory-compute trade-off in activation checkpointing, HFU and MFU, context, pipeline, and tensor parallelism, ND parallelism, and the slides' scaling recipe. Slides from Spring 2026, recordings from Spring 2025."
draft: false
glossary:
  - term: "MFU"
    aliases: ["Model FLOPs Utilization"]
    definition: "The theoretical matmul FLOPs for one training iteration divided by the device's peak throughput gives a theoretical time; divide that by the measured iteration time. It measures how much of the GPU's compute goes to useful model computation."
    context: "CS231N L11 uses it as the target when tuning a parallelism recipe; the slides call above 30% good and above 40% excellent."
  - term: "FSDP"
    aliases: ["Fully Sharded Data Parallelism"]
    definition: "A variant of data parallelism in which each weight (with its gradient and optimizer state) is owned by one GPU and broadcast to the others only when needed, then deleted."
    context: "Comes from ZeRO; lets models too big for one GPU still use data parallelism."
  - term: "activation checkpointing"
    aliases: ["gradient checkpointing"]
    definition: "Keep only some layers' activations during the forward pass and recompute the rest from the nearest checkpoint during backward, trading extra compute for memory."
    context: "With √N checkpoints, memory is O(√N) and compute is O(N√N)."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs231n-distributed-training)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

> **Source years**: The slides are the Spring 2026 [Lecture 11 slides](https://cs231n.stanford.edu/slides/2026/lecture_11.pdf) from [CS231N](https://cs231n.stanford.edu/) (158 pages, cover date 2026-05-05). The recording is the [Spring 2025 Lecture 11](https://www.youtube.com/watch?v=9MvD-XsowsE) on YouTube (about 1 hour 12 minutes; the 2025 schedule lists Justin Johnson as lecturer). The 2026 recordings are on Canvas for enrolled students only, so the two years may differ.
>
> This is part 13 of the [Reading Stanford CS231N](/posts/ai/2026-09-30-cs231n-course-overview-en) series.

**Why does a computer vision course teach distributed training?** The [previous post](/posts/ai/2026-09-30-cs231n-video-understanding-en) computed that 5 minutes of 24 fps video becomes 1.41 million ViT tokens. The next post, on self-supervised learning, notes that SimCLR needs large batches and its ImageNet experiments ran distributed on TPUs. Once vision models reach foundation-model scale, fitting them onto many GPUs becomes everyone's problem.

This is the most systems-heavy lecture in the course. Its running example is [Llama3-405B](https://arxiv.org/abs/2407.21783), and the slides explain why. The GPT-4 technical report explicitly withheld architecture, model size, hardware, and training compute, starting a trend of not sharing model details. Llama3, released by Meta in April 2024, shared many model and training details in its paper.

## Course video sources

This article uses Spring 2026 materials. The public Spring 2025 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=9MvD-XsowsE
title: Stanford CS231N 2025 Lecture 11: Large Scale Distributed Training (YouTube)
```

Original videos: [Stanford CS231N 2025 Lecture 11: Large Scale Distributed Training (YouTube)](https://www.youtube.com/watch?v=9MvD-XsowsE)

Course and recording entries:

- [Stanford CS231N 2025 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16)
- [Official course / lecture source](https://cs231n.stanford.edu/schedule.html)

## Part 1: GPUs and clusters

**What a GPU is.** It was built for graphics and is now a general parallel processor. The slides take apart an NVIDIA H100: it has 50 MB of L2 cache, and each streaming multiprocessor is "sort of like a CPU core with vector instructions."

**How fast they got.** From the K40 in 2013 (about 5 TFLOP/s FP32) to the H100 (989 TFLOP/s BF16 on Tensor Cores) to the B200 (5000 TFLOP/s FP8 on Tensor Cores), the slides mark a 1000× speedup since 2013. The next line is where the lecture begins: we can also train with more than one GPU.

**The bandwidth hierarchy.** These numbers drive every trade-off that follows:

| Level | Bandwidth |
|---|---|
| Inside one H100 | 3352 GB/s |
| Between GPUs in one server (8 GPUs) | 900 GB/s |
| Racks, groups of racks, the whole cluster | Slower the further out you go |

Meta's Llama3 cluster puts 8 GPUs in a server and 2 servers in a rack, for 24,576 GPUs and 1.875 PB of GPU memory in total. The slides' framing: **a GPU cluster is one big computer**, and the goal is to train one giant neural network on it. They also list other training chips: Google TPUs, the AMD MI355X, and AWS Trainium3.

## Part 2: communication collectives

GPUs exchange data through a few collective primitives, and every form of parallelism below is built from them:

| Primitive | What each GPU ends up with |
|---|---|
| All-Reduce | The sum of all input tensors (any associative operator works, such as max) |
| Reduce-Scatter | One chunk of that sum |
| All-Gather | The full tensor, assembled from the pieces each GPU holds |
| All-To-All | Chunks "transposed" across GPUs, used to reshard a tensor along a different axis |

## Part 3: four dimensions, four kinds of parallelism

The slides organize this neatly. A Transformer activation has shape (Layer, Batch, Sequence, Channel), and **the dimension you split names the parallelism**:

| Split dimension | Parallelism |
|---|---|
| Batch | Data parallelism (DP) |
| Sequence | Context parallelism (CP) |
| Layer | Pipeline parallelism (PP) |
| Channel | Tensor parallelism (TP) |

### Data parallelism: DP → FSDP → HSDP

**DP.** The loss is usually averaged over a minibatch and gradients are linear, so you can split MN samples across M GPUs. Each GPU holds its own copy of the model and optimizer, loads its own data, runs forward and backward, and then an all-reduce averages the gradients.

**FSDP.** DP requires each GPU to fit the whole model. [ZeRO](https://arxiv.org/abs/1910.02054) shards the weights instead: each weight W_i is owned by one GPU, which also holds W_i's gradient and optimizer state. The procedure has six steps:

1. Before the forward pass for layer i, the owner broadcasts W_i to all GPUs
2. All GPUs run the forward pass for layer i and delete their local W_i
3. Before the backward pass for layer i, the owner broadcasts W_i again
4. All GPUs compute their local dL/dW_i and delete W_i
5. All GPUs send their local gradient to the owner and delete it
6. The owner updates W_i

In practice communication overlaps with compute: fetch W_{i+1} while computing with W_i, and keep the last layer's weights after the forward pass so they don't have to be resent at the start of backward.

The slides give one calculation to make the scale concrete. A 100B-parameter model stores 4 numbers per parameter (parameter, gradient, and the two Adam moments) at 2 bytes each, which is 800 GB. Split over 80 GPUs, that is just 10 GB per GPU.

**HSDP.** Split N = M×K GPUs into M groups of K. Each group runs FSDP (K can be in the hundreds), and the groups run plain DP with each other. The most frequent weight broadcasts stay inside a group.

### Activation checkpointing: trade recomputation for memory

Treat each layer as two functions: forward A_{i+1} = F_i→(A_i) and backward G_i = F_i←(A_i, G_{i+1}). Backward needs the forward activations, so normal training stores all of them. The slides animate three strategies step by step:

| Strategy | Compute | Memory |
|---|---|---|
| Normal forward + backward | O(N) | O(N) |
| Full recomputation (recompute from the start each time) | O(N²) | O(1) |
| A checkpoint every C layers | O(N²/C) | O(C) |
| √N checkpoints | O(N√N) | O(√N) |

N² compute is too expensive, so in practice you pick the middle: save some checkpoints and recompute only the stretch between them.

### A scaling recipe

The slides pause here for a practical recipe, stressing that "HSDP + activation checkpointing can take you a long way":

1. Use data parallelism up to about 128 GPUs and models of about 1B parameters
2. Always set the per-GPU batch size to max out GPU memory
3. If your model has more than 1B parameters, consider FSDP
4. Add activation checkpointing to fit larger batches per GPU
5. With more than 256 GPUs, consider HSDP
6. With more than 1K GPUs, models above 50B parameters, or sequences longer than 16K, move to the advanced strategies (CP, PP, TP)

### Too many knobs: HFU and MFU

**HFU** (Hardware FLOPs Utilization) is the fraction of theoretical matmul throughput you actually achieve. An H100 can in theory do 989.4 TFLOP/s of 16-bit matrix multiplies, but even the best case, large matrix multiplies alone, reaches only about 80% in the measurement the slides cite.

**MFU** (Model FLOPs Utilization, from the [PaLM](https://arxiv.org/abs/2204.02311) paper) asks what fraction of the GPU's peak goes to useful model computation.

<details>
<summary>The five-step MFU calculation (slide 115)</summary>

1. Compute the total matmul FLOPs for one forward + backward pass (backward is about 2× forward; ignore nonlinearities, normalization, and elementwise ops like residuals)
2. Look up the device's theoretical peak (H100: 989 TFLOP/s)
3. Theoretical time = total FLOPs ÷ peak
4. Measure the actual time for a full iteration: data loading, forward, backward, optimizer step
5. MFU = theoretical time ÷ actual time

</details>

The slides' bar: **MFU above 30% is good, above 40% is excellent**. One counterintuitive note: newer devices sometimes get worse MFU, because peak FLOPs grow faster than memory bandwidth. From the A100 to the H100, FLOPs grew 3.1× while memory bandwidth grew 2.1×.

### Context parallelism: split the sequence

A Transformer processes sequences of length S; CP uses several GPUs for one long sequence. With N-way CP, each block works on tensors of shape (batch, sequence/N, channels) instead of (batch, sequence, channels). The MLP and QKV projections can be split along the sequence with gradients synced as in DP. The slides call the attention operator the hardest part to parallelize and give two options:

- **[Ulysses](https://arxiv.org/abs/2309.14509)**: after computing QKV, reshard from "each GPU has part of the sequence and all heads" to "each GPU has the full sequence and some heads." Easy to implement, but the head count must be divisible by the GPU count.
- **[Ring Attention](https://arxiv.org/abs/2310.01889)**: divide the sequence into blocks across GPUs, with an outer loop over queries and an inner loop over keys and values. Complex to implement, but it scales to very long sequences.

CP is often used for long-sequence fine-tuning. In Llama3-405B, stage 1 used S=8192 with no CP; stage 2 used S=131,072 with 16-way CP, 8192 per GPU.

### Pipeline parallelism: split the layers

Assign the model's layers to different GPUs and copy activations at the boundaries ([GPipe](https://arxiv.org/abs/1811.06965)). The problem is that GPUs wait on each other. The slides' example: 4-way PP without microbatches caps MFU at 1/4 = 25%; with 4 microbatches the cap rises to 16/28, about 57.1%.

### Tensor parallelism: split the channels

Split each linear layer's weights across GPUs and use block matrix multiplication. The trick is splitting two consecutive layers:

<details>
<summary>Why two-layer TP needs no communication in the middle</summary>

Layer 1 is XW = Y. Split W by columns into W_1…W_4, and GPU i computes XW_i = Y_i. Layer 2 is YU = Z. Split U by rows into U_1…U_4, and GPU i computes Y_iU_i from the Y_i it already has. Since Z = Y_1U_1 + Y_2U_2 + Y_3U_3 + Y_4U_4, each GPU computes one term and a single all-reduce produces the output. No communication is needed after XW = Y.

</details>

### ND parallelism

Finally, use TP, CP, PP, and DP at once. Arrange the GPUs in a 4D grid, and each GPU's index in the grid gives its rank along each parallelism dimension. Llama3-405B's setup was tuned this way, again to maximize MFU.

## How to study it

- **Tie each parallelism to a tensor dimension.** For any distributed-training paper, first ask which dimension it splits and which collective it pays for.
- **Learn to compute MFU.** The next time you train a model, run the five steps once. It tells you more about your bottleneck than chasing a new framework.
- **Practice activation checkpointing at small scale.** PyTorch supports it on one GPU; watch how memory and step time change.
- **Gaps**: this lecture has no assignment and no coding exercise in the slides. The 2026 recording is not public, so the spoken derivations are only in the 2025 recording.

## Further reading

- Deeper parallelism implementation and GPU hardware: the [CS336 guide](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch-en) posts on [GPUs and TPUs](/posts/ai/2026-08-22-cs336-gpu-tpu-en), [parallelism mechanics](/posts/ai/2026-08-22-cs336-parallelism-mechanics-en), and [parallelism strategies](/posts/ai/2026-08-22-cs336-parallelism-strategies-en)
- Why video tokens explode: the previous post, [L10: Video Understanding](/posts/ai/2026-09-30-cs231n-video-understanding-en)
- Why large-batch contrastive learning needs distributed training: the next post, [L12: Self-Supervised Learning](/posts/ai/2026-09-30-cs231n-self-supervised-learning-en)

**Series navigation**: Previous: [L10: Video Understanding](/posts/ai/2026-09-30-cs231n-video-understanding-en) | Next: [L12: Self-Supervised Learning](/posts/ai/2026-09-30-cs231n-self-supervised-learning-en) | [Series overview](/posts/ai/2026-09-30-cs231n-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [CS231N course homepage (Spring 2026)](https://cs231n.stanford.edu/)
- [CS231N Spring 2026 schedule](https://cs231n.stanford.edu/schedule.html)
- [Lecture 11: Large Scale Distributed Training slides (Spring 2026, PDF)](https://cs231n.stanford.edu/slides/2026/lecture_11.pdf)
- [CS231N Spring 2025 schedule](https://cs231n.stanford.edu/2025/schedule.html)
- [Stanford CS231N 2025 Lecture 11: Large Scale Distributed Training (YouTube)](https://www.youtube.com/watch?v=9MvD-XsowsE)
- [Stanford CS231N 2025 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOmsNzYBMe0gJY2XS8AQg16)
- [Llama Team (2024). The Llama 3 Herd of Models](https://arxiv.org/abs/2407.21783)
- [Rajbhandari et al. (2019). ZeRO: Memory Optimizations Toward Training Trillion Parameter Models](https://arxiv.org/abs/1910.02054)
- [Chowdhery et al. (2022). PaLM: Scaling Language Modeling with Pathways](https://arxiv.org/abs/2204.02311)
- [Jacobs et al. (2023). DeepSpeed Ulysses](https://arxiv.org/abs/2309.14509)
- [Liu et al. (2023). Ring Attention with Blockwise Transformers for Near-Infinite Context](https://arxiv.org/abs/2310.01889)
- [Huang et al. (2018). GPipe: Efficient Training of Giant Neural Networks using Pipeline Parallelism](https://arxiv.org/abs/1811.06965)
