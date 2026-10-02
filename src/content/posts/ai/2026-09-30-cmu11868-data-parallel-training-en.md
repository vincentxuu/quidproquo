---
title: "CMU 11-868 L14-L15: Distributed Training and Data Parallelism, and Where Gradient Sync Costs Come From"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, cmu, ai-course, distributed-training, parallelism, pytorch, gpu]
lang: en
series:
  name: "Reading CMU 11-868 LLM Systems"
  order: 11
tldr: "Lectures 14 and 15 of 11-868 go from the parameter server to PyTorch DDP. They use NCCL's five collectives (Broadcast, Reduce, AllReduce, ReduceScatter, AllGather) as building blocks, show why a ring makes broadcast time nearly independent of GPU count, and split AllReduce into ReduceScatter plus AllGather. The second lecture takes apart DDP's two key designs: bucketing gradients (25 MB by default) and starting synchronization before the backward pass finishes. There is no recording; this guide works from slide page numbers and the VLDB 2020 paper."
description: "A guide to Lectures 14-15 of CMU 11-868 LLM Systems (Spring 2026): parameter server versus AllReduce data parallelism, NCCL collectives and the ring algorithm, the two phases of ring AllReduce, world size and ranks in PyTorch DDP, gradient bucketing and compute-communication overlap, and two pitfalls from the DDP paper. With slide page numbers and a reading plan."
draft: false
glossary:
  - term: "AllReduce"
    aliases: ["all-reduce", "ring AllReduce", "ring all-reduce"]
    definition: "A collective operation: each GPU holds its own data, a reduction (sum, max, or min) is applied, and every GPU ends up with the full result. It can be split into ReduceScatter followed by AllGather."
    context: "Data-parallel training does one AllReduce over the gradients every step; L14 slides 32-45 draw the ring version step by step."
  - term: "NCCL"
    aliases: ["Nvidia Collective Communication Library"]
    definition: "NVIDIA's multi-GPU communication library, providing collective and point-to-point send/receive over PCIe, NVLink, InfiniBand, and IP sockets."
    context: "L14 uses its API to introduce the five primitives Broadcast, Reduce, AllReduce, ReduceScatter, and AllGather."
    links:
      - label: "NVIDIA NCCL"
        url: "https://developer.nvidia.com/nccl"
  - term: "gradient bucketing"
    aliases: ["bucket_cap_mb"]
    definition: "PyTorch DDP packs several parameters' gradients into a bucket and launches one AllReduce once the whole bucket is ready, a compromise between syncing each gradient separately (too often) and syncing only after everything is done (too late)."
    context: "The DDP paper states the default bucket size is 25 MB, adjustable with bucket_cap_mb."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu11868-data-parallel-training)

> **Version note**: This post is based on the Spring 2026 edition of [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/). Every fact was checked on 2026-09-30 against the [course syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus), the [L14 slides](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-14-distributed-training-b27c3d1dc185e680c6f5cc924e9ec9d7.pdf) (48 pages), the [L15 slides](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-15-ddp-165dbe3873fac21eb8b339e64bcfee28.pdf) (26 pages), and the [PyTorch DDP paper](https://www.vldb.org/pvldb/vol13/p3005-li.pdf). Access grade **A3**, but **the course has no public recordings**. Page numbers below always mean PDF pages; the numbers printed in the corner of the L14 slides run 2-3 higher than the PDF page, so go by the PDF.

**Series**: Previous: [HW4: Fused CUDA Kernels for Softmax and LayerNorm](/posts/ai/2026-09-30-cmu11868-hw4-transformer-cuda-acceleration-en) | Next: [L16-L17 Model Parallelism and MoE](/posts/ai/2026-09-30-cmu11868-model-parallel-moe-en) | [Series overview](/posts/ai/2026-09-30-cmu11868-llm-systems-overview-en)

## What these lectures answer

[LightSeq in the previous lecture](/posts/ai/2026-09-30-cmu11868-accelerating-transformer-lightseq-en) squeezed everything out of one GPU. The next question: when one isn't enough, **where does the time go when many GPUs train together?**

L14 slide 5 sets the scale. DeepSeek-V3 (671B) was pretrained on 2,048 H800s for about two months, 2.664 million H800 GPU hours in total; LLaMA 3.1 (405B) used 16,000 H100s and 30.84 million GPU hours. At that scale, how GPUs exchange data decides whether the money is well spent.

Slide 6 splits scaling strategies into two families:

| Partition the data | Partition the model |
|---|---|
| Single-node data parallel, distributed data parallel, parameter server | Model parallel: pipeline parallel, tensor parallel |

These two lectures cover only the left column: **every GPU holds a full copy of the model and eats different data**. The right column is the [next post](/posts/ai/2026-09-30-cmu11868-model-parallel-moe-en). The syllabus puts L14 on March 9 (the first class after spring break) and L15 on March 11, with the [PyTorch DDP paper](https://www.vldb.org/pvldb/vol13/p3005-li.pdf) (VLDB 2020) as L15's reading. There is also a "Recitation 6 Distributed Training" on March 20, with no slides linked in the syllabus.

## Intuition: data parallelism has only one thing to synchronize

Every data-parallel step looks the same (L14 slide 32):

1. Split a batch across workers
2. Each worker runs forward and backward on its share to get **local gradients**
3. All workers compute the **average gradient** together
4. Each worker updates its own copy of the parameters with the average

Steps 1, 2, and 4 need no communication at all. **The only communication cost is step 3.** So the whole problem becomes: how do you make that step fast enough that GPUs don't sit idle waiting?

## Mechanism 1: from parameter server to AllReduce

### The old way: parameter server

L14 slide 7 shows the classic parameter server. Workers pull parameters from the server, compute local gradients, push them back, and the server aggregates, updates, and starts the next round. Slide 30 translates this into NCCL terms: pull is Broadcast and push is Reduce.

Slide 46 names the problem: **two synchronizations** (parameters once, gradients once), with workers waiting for the server to send parameters and the server waiting for every worker's gradients.

### NCCL's five building blocks

[NCCL](https://developer.nvidia.com/nccl) is NVIDIA's multi-GPU communication library. L14 slide 9 says it offers both collective and point-to-point communication over PCIe, NVLink, InfiniBand, and IP sockets, and ties every operation to a CUDA stream. Slides 10-15 introduce five collectives:

| Primitive | What it does | Slide |
|---|---|---|
| Broadcast | Copy N elements from the root to all ranks | p.11 |
| Reduce | Reduce (sum, max, or min) across devices, write the result to one rank | p.12 |
| AllReduce | Reduce, and every rank gets the result (= Reduce + Broadcast) | p.13 |
| ReduceScatter | Reduce, then split the result into parts scattered across ranks | p.14 |
| AllGather | Gather N values from each of k ranks into a k×N result sent to all ranks | p.15 |

The bottom of slide 15 has the key identity: **AllReduce = ReduceScatter + AllGather**. Ring AllReduce is built exactly this way.

### Why a ring: chop the data so transfers pipeline

Slide 18 says NCCL moves data and performs reductions around rings. Slides 19-28 derive why using Broadcast. Send N bytes at bandwidth B across K GPUs in a one-way ring:

- **Send it whole**: each hop takes N/B, and there are K−1 hops, so total time is (K−1)·N/B (p.22). More GPUs means slower.
- **Split into S messages**: each hop takes N/(S·B), and the second message can leave as soon as the first reaches the next GPU. Total time is (K−2+S)·N/(S·B), which is **about N/B** when S is large (p.28).

The second is nearly independent of GPU count. Chopping big messages so every link stays busy at once is the heart of the ring algorithm.

### Ring AllReduce: ReduceScatter, then AllGather

Slides 34-43 draw ring AllReduce step by step with 4 workers. Each worker splits its gradient into 4 chunks (a0-a3 on worker 0, b0-b3 on worker 1, and so on):

1. **ReduceScatter phase** (p.35-42): at each step, every worker sends one chunk to the next worker in the ring, which adds it to its own matching chunk. After K−1 steps, each worker holds **one** fully reduced chunk (for example, a1+b1+c1+d1).
2. **AllGather phase** (p.43): another K−1 steps pass the finished chunks to everyone. At the end, every worker has the full summed gradient.

Slides 44-45 give MPI code for both phases. The slides don't derive the total communication volume of ring AllReduce; for that, [CS336 Lecture 7](/posts/ai/2026-08-22-cs336-parallelism-mechanics-en) works through the math.

Back to the comparison on slide 46: AllReduce data parallelism needs no server, but **every worker updates the parameters itself**. The slide asks "redundant?" and answers that a local update is much faster than moving data between GPUs.

<details>
<summary>The NCCL call example on L14 (p.29)</summary>

The slide shows how one process managing several GPUs initializes communicators, launches an AllReduce, and waits for the streams:

```c
NCCLCHECK(ncclGroupStart());
for (int i=0; i<nDev; i++) {
  CUDACHECK(cudaSetDevice(localRank*nDev + i));
  NCCLCHECK(ncclCommInitRank(comms+i, nRanks*nDev, id, myRank*nDev + i));
}
NCCLCHECK(ncclGroupEnd());

NCCLCHECK(ncclGroupStart());
for (int i=0; i<nDev; i++)
  NCCLCHECK(ncclAllReduce((const void*)sendbuff[i], (void*)recvbuff[i],
                          size, ncclFloat, ncclSum, comms[i], s[i]));
NCCLCHECK(ncclGroupEnd());

for (int i=0; i<nDev; i++)
  CUDACHECK(cudaStreamSynchronize(s[i]));
```

</details>

## Mechanism 2: how PyTorch DDP hides the synchronization

L15 picks up from L14: the algorithm exists, so how does a real framework use it? The subject is [PyTorch Distributed Data Parallel (DDP)](https://www.vldb.org/pvldb/vol13/p3005-li.pdf).

### Two design goals

L15 slide 8 quotes the paper's two goals:

- **Non-intrusive**: developers should be able to reuse their local training script with minimal changes
- **Interceptive**: the API must let the implementation intercept signals and trigger the right algorithms promptly, exposing as many optimization opportunities as possible

The example on slide 12 shows the first goal in practice: wrap `model` as `DDP(model, device_ids)`, and the loss, optimizer, `backward()`, and `step()` stay the same.

### World size, global rank, local rank

Slide 9 defines three terms, using two machines with two GPUs each:

- **world size**: total number of processes (4 here)
- **global rank**: the process's global ID (0-3)
- **local rank**: its ID within one machine (0 and 1 on each)

Slides 10-11 explain that the older `torch/distributed/launch.py` passes these through the environment variables `MASTER_ADDR`, `MASTER_PORT`, `RANK`, and `WORLD_SIZE`, and each process joins the process group with `dist.init_process_group(backend="nccl")`. The course's [code example](https://github.com/llmsystem/llmsys_code_examples/tree/main/ddp_example) (the code walkthrough on L15 slide 23) launches with `torchrun --nproc_per_node=2 main.py --ddp` instead.

### When to sync: gradient bucketing

The obvious approach is to wait for the whole backward pass, then AllReduce every gradient once. Slides 13-14 point out you can do better: **gradients are computed layer by layer from the back**, so the last layers' gradients are ready long before the first layers'. There's no reason to wait.

But syncing each parameter the moment it's ready syncs too often. DDP's compromise is buckets (slides 15-18):

- Bucket size is set by the `bucket_cap_mb` argument to the DDP constructor
- The mapping from parameters to buckets is fixed **when DDP is constructed**, based on the size limit and parameter sizes
- Parameters go into buckets in roughly the **reverse order** of `model.parameters()`, because DDP expects gradients to become ready in about that order during backward
- Once every gradient in a bucket is ready, the Reducer launches an **asynchronous AllReduce** on it while backward keeps computing earlier layers

The result is backward computation overlapping with AllReduce communication. Slide 20 shows the skeleton of the Reducer's C++ code: after each parameter's gradient accumulates, `autograd_hook` decrements its bucket's pending count; when it hits zero, `mark_bucket_ready` sends ready buckets to AllReduce **in bucket order**. The charts on slides 21-22 show DDP's scalability and the latency reduction from overlapping communication.

### What the paper adds beyond the slides

The [DDP paper](https://arxiv.org/abs/2006.15704) describes the PyTorch v1.5 implementation. Its abstract lists three acceleration techniques: gradient bucketing, overlapping computation with communication, and **skipping gradient synchronization**. When configured appropriately, the paper reports near-linear scalability on 256 GPUs.

Details worth noticing when you read it:

- **The default bucket is 25 MB.** The paper calls bucket size the key trade-off: bigger buckets amortize communication overhead better, but each bucket waits longer for its gradients. It recommends measuring for your own use case; in its ResNet50 experiments on 16 GPUs with the NCCL backend, the fastest range was 10 MB to 25 MB.
- **Why buckets must go out in order.** Each process rebuilds the autograd graph dynamically on every forward pass, so gradient ready order can differ between processes. If each process sent buckets as soon as they were ready, AllReduce contents would mismatch, producing wrong results or crashes. So all processes must use the same bucket order, and none can launch bucket i+1 before bucket i. The paper admits reverse `model.parameters()` order is only an approximation.
- **Unused parameters can hang backward.** If some parameters don't take part in an iteration, their bucket never fills and backward hangs. DDP's `find_unused_parameters` option walks the autograd graph at the end of forward to mark them.
- **Skipping sync**: the `no_sync()` context manager lets you skip synchronization during the small steps of gradient accumulation and sync once on the last step.
- The paper supports three communication backends, NCCL, Gloo, and MPI, and compares NCCL with Gloo.

## What these lectures don't cover

- **What if the model doesn't fit on one GPU**: the next-lecture readings on L15's last slide are GPipe and Megatron-LM, that is, [pipeline and tensor parallelism](/posts/ai/2026-09-30-cmu11868-model-parallel-moe-en).
- **Every GPU storing a full optimizer state is wasteful**: that's the [ZeRO post](/posts/ai/2026-09-30-cmu11868-zero-memory-optimization-en). L10's last slide also lists the PyTorch FSDP paper as a reading, but the Spring 2026 syllabus attaches only the DDP paper to these two sessions.
- **Implementation**: [HW5](/posts/ai/2026-09-30-cmu11868-hw5-distributed-training-en) has you write data and pipeline parallelism yourself, on at least 2 GPUs.

## How to read these lectures

1. In L14, start with the ring broadcast derivation on slides 19-28. Work out (K−2+S)·N/(S·B) yourself to feel why chopping helps.
2. Then read ring AllReduce on slides 34-43 with pen and paper, following all 4 workers until you know who sends which chunk to whom at each step.
3. In L15, read slides 13-20 alongside Section 3 (System Design) of the DDP paper, focusing on the reasons behind bucketing and ordering.
4. Finally, run the course's [ddp_example](https://github.com/llmsystem/llmsys_code_examples/tree/main/ddp_example) and compare per-epoch time on one GPU versus two.

One thing you can do tonight: in any PyTorch training script, set `bucket_cap_mb` to 1, 25, and 100, run a few steps each, and watch how step time changes.

## Further reading

- Building data, tensor, and pipeline parallelism from collectives, with communication-volume derivations: [CS336 Lecture 7: Build Data, Tensor, and Pipeline Parallelism from Collectives](/posts/ai/2026-08-22-cs336-parallelism-mechanics-en)
- ZeRO, FSDP, and hardware topology: [CS336 Lecture 8: Align ZeRO, FSDP, and 3D Parallelism with Hardware Topology](/posts/ai/2026-08-22-cs336-parallelism-strategies-en)

## References

- [CMU 11-868 LLM Systems (Spring 2026) course home](https://llmsystem.github.io/llmsystem2026spring/) — instructor and course description
- [11-868 Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) — L14 (3/9) and L15 (3/11) dates, the DDP reading, Recitation 6
- [L14 slides: Distributed Training (PDF, 48 pages)](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-14-distributed-training-b27c3d1dc185e680c6f5cc924e9ec9d7.pdf) — parameter server, NCCL primitives, ring broadcast and ring AllReduce
- [L15 slides: Distributed Data Parallel Training (PDF, 26 pages)](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-15-ddp-165dbe3873fac21eb8b339e64bcfee28.pdf) — DDP design goals, ranks, gradient bucketing, Reducer source
- [Li et al., PyTorch Distributed: Experiences on Accelerating Data Parallel Training (VLDB 2020)](https://www.vldb.org/pvldb/vol13/p3005-li.pdf) — the reading the syllabus assigns
- [The same paper on arXiv (2006.15704)](https://arxiv.org/abs/2006.15704) — three techniques, near-linear scaling on 256 GPUs, 25 MB default, bucket order, unused parameters
- [llmsystem/llmsys_code_examples: ddp_example](https://github.com/llmsystem/llmsys_code_examples/tree/main/ddp_example) — L15's code walkthrough, single- and multi-GPU runs with `torchrun`
- [NVIDIA NCCL](https://developer.nvidia.com/nccl) — the communication library L14 introduces
