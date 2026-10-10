---
title: "CMU 11-868 L18: How ZeRO Cuts Data-Parallel Memory — Optimizer State, Gradients, Then Parameters"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, cmu, ai-course, distributed-training, memory, gpu]
lang: en
series:
  name: "Reading CMU 11-868 LLM Systems"
  order: 13
tldr: "Data parallelism keeps a full copy of parameters, gradients, and optimizer state on every GPU. With Adam and mixed precision that is about 20 bytes per parameter, 16 of them optimizer-related, so LLaMA-3 8B already needs 160GB. CMU 11-868 L18 builds on the ZeRO paper and animates its three stages frame by frame: ZeRO-1 partitions optimizer state, ZeRO-2 also partitions gradients, and ZeRO-3 partitions parameters too. The slides conclude that the first two stages add no communication and save up to 8x memory; stage 3 makes per-GPU memory shrink with GPU count, at what the slides estimate as about 3x the communication."
description: "A guide to CMU 11-868 LLM Systems (Spring 2026) L18 Memory Optimization in Distributed Training: what fills GPU memory in mixed-precision DDP, how ZeRO stages 1/2/3 partition state and which NCCL collectives each step uses, per-stage memory formulas and communication cost, partitioned activation checkpointing, constant-size buffers, defragmentation, ZeRO++ quantized communication, and ZeRO combined with PP/TP as 3D parallelism."
draft: false
glossary:
  - term: "ZeRO"
    aliases: ["Zero Redundancy Optimizer"]
    definition: "DeepSpeed's memory optimization for data parallelism: instead of every GPU holding full optimizer state, gradients, and parameters, each is split into K shards, each GPU owns one, and the rest is fetched through collectives when needed."
    context: "Stage 1 partitions optimizer state, stage 2 adds gradients, stage 3 adds parameters."
  - term: "reduce-scatter"
    aliases: ["ReduceScatter"]
    definition: "A collective that sums tensors across all participants (reduce), then splits the result into K shards so each participant receives only its own shard."
    context: "ZeRO-1 in L18 uses ncclReduceScatter so each GPU gets only its shard of the global gradient."
  - term: "mixed precision training"
    definition: "Running forward and backward with FP16 parameters and gradients while the optimizer keeps FP32 copies of the parameters, momentum, and variance for the update, then casts the result back to FP16."
    context: "L18 uses this setup to arrive at roughly 20 bytes per parameter."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu11868-zero-memory-optimization)

**Video status: Checked: no corresponding recording link listed on the public official page.** [Source details](#course-video-sources)

> **This guide follows the Spring 2026 edition of [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/).** It is part 13 of [Reading CMU 11-868 LLM Systems](/en/posts/ai/2026-09-30-cmu11868-llm-systems-overview-en). The [previous post](/en/posts/ai/2026-09-30-cmu11868-model-parallel-moe-en) handled "the model doesn't fit" by splitting layers, matrices, or experts. This one takes a different angle: **don't split the model at all; just remove what data parallelism duplicates.**

This is the 3/23 lecture in Week 11 of the [Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus), "Memory Optimization in Distributed Training." It has one reading: [ZeRO (Rajbhandari et al., SC 2020)](https://arxiv.org/abs/1910.02054). The [L18 slides](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-18-zero-20eb6c8d8c1e7092e1b922abf03d8cdd.pdf) run 76 pages; pages 18 through 63 are frame-by-frame animation, each frame adding one step. The official syllabus lists no public recording links, so this post draws on the slides and the paper's abstract. Page numbers are PDF pages.

## Course video sources

The official Spring 2026 syllabus has been checked: it publicly lists slides, readings and homework, but no recording link for the corresponding lectures. This article therefore guides readers through slides, papers or assignments and has no corresponding lecture player. This observation concerns the public official page and does not establish whether internal recordings exist.

Official sources:

- [CMU 11-868 Spring 2026 官方課表與教材](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus/)

Checked on 2026-10-10.

## The problem: data parallelism saves communication but wastes memory

The comparison on page 5 lays out the trade-off:

| | Pros | Cons |
|---|---|---|
| Model parallelism | Good memory efficiency | Poor compute and communication efficiency (the slide's example: 5% of peak when training a 40B model with Megatron) |
| Data parallelism | Good compute and communication efficiency | Poor memory efficiency: every device holds a full copy of the model |

ZeRO wants both: keep data parallelism's compute efficiency and drop its memory duplication.

## The memory bill: where 20 bytes per parameter comes from

Page 6 lists what each GPU stores under DDP with Adam and mixed precision (N is the parameter count):

| Item | Size |
|---|---|
| FP16 model parameters | 2N bytes |
| FP16 gradients | 2N bytes |
| Adam optimizer state (FP32 parameters, gradients, momentum, variance) | 4 × 4 × N = 16N bytes |
| Forward activations per layer | d × len × b × n_layer, depending on batch and sequence length |

That totals **20N plus activations**. Pages 9–11 stack these cells onto a 16-layer Transformer on two GPUs, one frame at a time. Every cell on the two GPUs is identical.

Page 12 applies the bill to real models:

| | LLaMA-3 8B | GPT-3 175B |
|---|---|---|
| Parameters | 16GB | 350GB |
| Gradients | 16GB | 350GB |
| Optimizer state | 128GB | 2,800GB |
| Total | 160GB | 3,500GB |

Optimizer state is 80% of the total. That's why ZeRO goes after it first.

Page 13 adds two easily missed costs: **temporary buffers** (all-reduce and gradient-norm computation often fuse all gradients into one flat buffer for throughput) and **memory fragmentation** (up to 30% in extreme cases, per the slide).

Page 16 lists four families of fixes: ZeRO (partition optimizer state, gradients, parameters), activation reduction (checkpointing, compression), CPU offload (the slide warns that CPU–GPU round trips can take 50% of the time), and memory-efficient optimizers that keep coarser statistics. This lecture is about the first.

## The intuition: K GPUs, each owning one shard

Page 17 states the core idea in one line: **partition the redundant data in DDP into K shards and let each GPU own one.** What you partition defines the stage:

- ZeRO-1: optimizer state
- ZeRO-2: plus gradients
- ZeRO-3: plus parameters

The slide's example: a 7B model drops from 120GB to 30GB on 4 GPUs. ZeRO is implemented in DeepSpeed.

## Mechanism 1: ZeRO-1 partitions optimizer state

Pages 18–41 walk one iteration on two GPUs (K = 2):

1. Each GPU runs forward with the **full** FP16 parameters to get activations and loss (pages 19–26)
2. Backward from the loss produces **full** FP16 local gradients (pages 27–33)
3. `ncclReduceScatter` sums and averages gradients across GPUs, but each GPU receives **only its half** of the global gradient, in FP32 (pages 34–35)
4. Each GPU updates only its half of the FP32 variance, momentum, and parameters (pages 36–38)
5. The updated FP32 parameters are copied to FP16 (pages 39–40)
6. `ncclAllGather` reassembles the full FP16 parameters for the next iteration (page 41)

Steps 3 and 6 are the key. DDP's all-reduce can already be decomposed into a reduce-scatter plus an all-gather. ZeRO-1 simply lets each GPU run the optimizer on its own half between the two.

## Mechanism 2: ZeRO-2 keeps only one copy of the gradients

The idea on page 42: each GPU still computes gradients for **all** parameters on its own data, but **keeps** only the shard it owns and hands the rest to their owners. Gradient memory drops to 1/K.

Pages 43–50 switch to four GPUs (K = 4) and split the parameters into M0–M3, with GPU i owning Mi. Backward runs from the last segment to the first:

1. While computing M3, GPUs 0, 1, and 2 hold M3's gradients in temporary buffers
2. `ncclReduce` sends M3's gradients to GPU 3
3. GPUs 0, 1, and 2 delete them; only GPU 3 keeps M3's gradients
4. Repeat for M2, M1, and M0

Gradients are sent and deleted as soon as they're computed, so each GPU only ever holds its own shard plus one segment of temporary buffer.

## Mechanism 3: ZeRO-3 partitions parameters too

Pages 51–63 split the parameters into four shards as well; normally each GPU stores only one shard of the FP16 parameters.

- **Forward**: before the first segment, GPU 0 uses `ncclBroadcast` to send its parameters to the other three. Everyone computes that segment, then GPUs 1, 2, and 3 delete those parameters. GPUs 1, 2, and 3 then broadcast their segments in turn (pages 52–57)
- **Backward**: starting from segment 4, gradients are reduced to GPU 3 as in ZeRO-2, and the other GPUs delete that segment's parameters and gradients. GPU 2 then broadcasts segment 3's parameters again, everyone computes gradients and sends them to GPU 2, and so on (pages 58–63)

Parameters are broadcast once in forward and again in backward, because they were deleted after forward.

## Memory and communication by stage

Page 64 gives formulas for N parameters, M bytes of optimizer state per parameter (for example 8, 12, or 16), and K GPUs:

| Setup | Memory per GPU |
|---|---|
| Plain DDP | 4N + M·N |
| ZeRO-1 | 4N + M·N / K |
| ZeRO-2 | 2N + (2 + M)·N / K |
| ZeRO-3 | (4 + M)·N / K |

<details>
<summary>Plugging in LLaMA-3 8B from page 12 (my arithmetic, not from the slides)</summary>

N = 8B, M = 16, K = 4:

- Plain DDP: 4 × 8 + 16 × 8 = 160GB (matches page 12)
- ZeRO-1: 32 + 128 / 4 = 64GB
- ZeRO-2: 16 + 18 × 8 / 4 = 52GB
- ZeRO-3: 20 × 8 / 4 = 40GB

None of these include activations, temporary buffers, or fragmentation.

</details>

Page 65 covers communication:

- **ZeRO-1 and ZeRO-2 add no extra communication** while saving up to 8x memory. The reason is the one above: reduce-scatter plus all-gather is just a decomposed all-reduce
- **ZeRO-3** adds one broadcast in forward and one in backward on top of ZeRO-2's reduce. The slide counts this as 3x communication in total, against a baseline DDP that needs one ScatterReduce and one AllGather

The last line of page 64 puts it plainly: the memory savings come "at the cost of additional parameter transfer."

## Other memory optimizations

Pages 67–70 cover other techniques from the ZeRO paper and the later ZeRO++:

- **Partitioned activation checkpointing** (page 67): tensor parallelism by design replicates activations on every GPU. Split each activation across devices and gather it when needed
- **Constant-size buffers** (page 68): all-reduce uses buffers to improve bandwidth, similar to bucketing in PyTorch DDP. Modern implementations often fuse all parameters into one buffer; ZeRO uses constant-size buffers, which is more efficient for large models
- **Memory defragmentation** (page 69): store long-lived data (parameters, optimizer state) together and keep it apart from short-lived data (discarded activations). The slide adds that memory reuse, as in LightSeq, can help further
- **ZeRO++ quantized communication** (page 70, Wang et al., ICLR 2024): block-wise quantization of parameters during the forward broadcast (FP16 to INT8, zero-point quantization); quantizing the backward ReduceScatter to INT8 or INT4; and keeping a full parameter set on each node to cut cross-node traffic

## Results and combinations

Pages 71–72 quote the paper's numbers. In theory, 1,024 V100s with 32GB each can train a 1-trillion-parameter model. In practice, the paper trained the 17B Turing-NLG (noted on the slide as the largest model as of January 2020), and trained a 100B model on 400 GPUs at about 10x the baseline throughput and 30% of theoretical peak. The paper's abstract puts it as: over 100B parameters trained with super-linear speedup on 400 GPUs at 15 petaflops, an 8x increase in model size and 10x in achievable performance over the prior state of the art, and models up to 13B trainable without model parallelism.

Pages 73–74 combine ZeRO with pipeline and tensor parallelism into 3D parallelism, which stacks this post's method on top of the previous post's.

The summary on page 75: ZeRO cuts memory sharply and is scalable, flexible, and easy to use; the downside is extra communication in some stages, whose impact depends on the interconnect (PCI-E vs. NVLink). Page 76 links the course's [DeepSpeed example notebook](https://github.com/llmsystem/llmsys_code_examples/blob/main/deepspeed_example/DeepSpeed-Example.ipynb). HW6 uses DeepSpeed ZeRO with LoRA to fine-tune Llama-2-7B; see the [HW6 guide](/en/posts/ai/2026-09-30-cmu11868-hw6-training-inference-systems-en).

## Try it yourself: three exercises without enrolling

1. **Run the numbers for your own model.** Plug the parameter count of a model you train (or want to train) into the four formulas on page 64, and find the lowest ZeRO stage that fits your GPU count and memory.
2. **Compare stages 1, 2, and 3 on two GPUs.** Using the course notebook or DeepSpeed's official examples, change only `zero_optimization.stage` in the config. Record peak memory and step time for each stage to see what the communication costs on your interconnect.
3. **Take an all-reduce apart.** With `torch.distributed` on two processes, implement "all-reduce" and "reduce-scatter then all-gather" and confirm they give the same result. That's why ZeRO-1 adds no communication.

## Further reading

- Previous in series: [L16–L17 Model parallelism and MoE](/en/posts/ai/2026-09-30-cmu11868-model-parallel-moe-en)
- Next in series: [HW5: data parallelism and pipeline parallelism](/en/posts/ai/2026-09-30-cmu11868-hw5-distributed-training-en)
- On this site: [CS336 resource accounting](/en/posts/ai/2026-08-22-cs336-resource-accounting-en) (another way to count bytes per parameter), [CS336 parallelism mechanics](/en/posts/ai/2026-08-22-cs336-parallelism-mechanics-en), [CS336 parallelism strategies](/en/posts/ai/2026-08-22-cs336-parallelism-strategies-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- Course: [CMU 11-868 LLM Systems Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) (3/23 topic and reading)
- Slides: [L18 Memory Optimization in Distributed Training](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-18-zero-20eb6c8d8c1e7092e1b922abf03d8cdd.pdf) (76 pages)
- Paper: [Rajbhandari et al., ZeRO: Memory Optimizations Toward Training Trillion Parameter Models](https://arxiv.org/abs/1910.02054) (the 100B, 400 GPUs, 15 petaflops, 8x, 10x, and 13B figures in the abstract)
- Paper: [Wang et al., ZeRO++: Extremely Efficient Collective Communication for Giant Model Training](https://arxiv.org/abs/2306.10209)
- Code: [DeepSpeed example notebook in llmsys_code_examples](https://github.com/llmsystem/llmsys_code_examples/blob/main/deepspeed_example/DeepSpeed-Example.ipynb)
