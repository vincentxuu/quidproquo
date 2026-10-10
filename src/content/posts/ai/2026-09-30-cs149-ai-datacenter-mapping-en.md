---
title: "CS149 L12: From One Chip to a Whole Datacenter — Dataflow Hardware, Kernel Fusion, Parallelism Strategies, and the Memory Bottleneck"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, parallelism, performance, hardware, distributed-training, stanford, ai-course]
lang: en
series:
  name: "Reading Stanford CS149"
  order: 16
tldr: "L12 is about moving data. The first part uses the SambaNova SN40L to explain dataflow architecture and metapipelining: running Llama 3.1 8B, the slides say the RDU needs about 3 kernel calls per token versus about 800 on a GPU, because it can fuse an entire decoder into one kernel. The middle part scales up to the datacenter: which collective each of TP, PP, EP, and DP requires, and why overlapping compute with communication decides how well you scale. The last part returns to energy and DRAM: moving a byte costs far more than computing on it, and memory controllers, burst mode, and HBM all attack the same problem. There is no public video for this lecture; this post relies on the slides alone."
description: "A guide to Stanford CS149 (Fall 2025) Lecture 12, Mapping AI Applications to the AI Datacenter: an HBM primer, the SambaNova SN40L dataflow architecture and metapipelining, kernel fusion for Llama 3.1 8B, scale-up vs scale-out and collective communication, tensor/pipeline/expert/data parallelism, compute-communication overlap, the energy cost of data movement, and how DRAM works."
draft: false
glossary:
  - term: "metapipelining"
    aliases: ["meta-pipelining"]
    definition: "A hierarchical, coarse-grained pipeline — a pipeline of pipelines. The body of a parallel loop is split into stages that run different iterations concurrently, with double buffers carrying intermediates between stages."
    context: "CS149 L12 explains it with SambaNova SN40L METAPIPE code; Written 3 has problems on it."
  - term: "RDU"
    aliases: ["Reconfigurable Dataflow Unit", "SN40L"]
    definition: "SambaNova's reconfigurable dataflow processor, built from PCUs (compute), PMUs (memory), and switches. It lays the computation graph out across the chip instead of executing instructions one by one."
    context: "CS149 L12 compares kernel fusion on the SN40L RDU and the H100."
  - term: "all-to-all"
    aliases: ["All-to-All"]
    definition: "A collective in which each node sends its i-th chunk of data to node i; the effect is a transpose across nodes."
    context: "The table in CS149 L12 maps it to expert parallelism."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs149-ai-datacenter-mapping)

**This post follows the Fall 2025 edition of [CS149](https://gfxcourses.stanford.edu/cs149/fall25).** It is part 16 of the [Reading Stanford CS149](/posts/ai/2026-09-30-cs149-course-overview-en) series and covers the October 30 Lecture 12, [Mapping AI Applications to the Datacenter Computer](https://gfxcourses.stanford.edu/cs149/fall25/lecture/aidatacenter/). The official [slide PDF](https://gfxcourses.stanford.edu/cs149/fall25content/media/aidatacenter/12_AI_DatacenterMapping.pdf) has 72 pages.

**There is no public video for this lecture.** Fall 2025 recordings are Canvas-only, and the 2023 public recordings that the course home page points to do not include this topic. This post is based only on the slides. Some slides are images without text (the Nvidia HBM roadmap, a Transformer diagram); what the lecturer said about them is unknown, and this post does not fill it in.

One thing stands out when you read the deck. The title says "datacenter," but only about pages 28–44 of 72 are about datacenter scale. Before that comes a memory primer and dataflow hardware; after it, energy and DRAM. The thread through all three is **data movement**: on chip, between chips, and across a cluster, the bottleneck is whether data arrives fast enough.

## Course video sources

Official course and existing recording entries are linked below. A single public video matching this article has not been verified for embedding.

Course and recording entries:

- [CS149 2023 public lecture playlist (no video for this lecture)](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [Official course / lecture source](https://gfxcourses.stanford.edu/cs149/fall25/lecture/aidatacenter/)

## Part one: HBM and dataflow hardware (pages 3–27)

### Why GPUs use HBM

Page 4 shows the difference in one picture: a CPU talks to DRAM over a 64-bit bus, a GPU talks to HBM over a 1024-bit one. Page 5 explains how: DRAM dies are stacked in 3D and connected by through-silicon vias (TSVs), the base "logic layer" acts as the memory controller, and a silicon interposer links the stack to the processor. Page 7 lists the progression:

| GPU | Year | Interface | Peak bandwidth |
|---|---|---|---|
| AMD Radeon Fury | 2015 | 4 HBM x 1024 bit | 512 GB/s |
| NVIDIA P100 | 2016 | 4 HBM2 x 1024 bit | 720 GB/s |
| NVIDIA H100 | 2022 | 6 HBM3 stacks x 1024 bit | 3.2 TB/s |

(The same slides reappear on pages 68–70 in the DRAM section.)

### Dataflow: trade instructions for space

Page 9 asks whether you can keep the benefits of asynchrony with a simpler programming model. The hint: take a data-centric view.

Pages 10–11 argue that AI models already are dataflow graphs (GEMM, pooling, softmax, sum). So the hardware can be a dataflow processor too. The slides cite the Plasticine reconfigurable dataflow architecture (Prabhakar, Zhang, et al., ISCA 2017): a grid of **PCUs** (Pattern Compute Units), **PMUs** (Pattern Memory Units), and switches.

Page 12 is a table of features an ideal accelerator needs and how a dataflow architecture provides them: tiled tensors for maximum GEMM TFLOPS, asynchronous compute and memory access so they overlap, direct compute-unit-to-compute-unit communication for fusion and pipelining. The last row: **streaming dataflow has no instructions, so no instruction fetch/decode overhead**, and no sequential instruction execution.

Page 13 gives the SambaNova SN40L RDU specs: 1,040 PCUs and PMUs, 638 TFLOPS (bf16), 520 MB of on-chip SRAM, 64 GB of HBM, 1.5 TB of DDR. Each PCU has systolic and SIMD compute (16 x 8 bf16); each PMU holds 0.5 MB.

### Program with parallel patterns, schedule with metapipelining

Page 14 shows the programming model: describe the computation with composable parallel patterns like Map, Zip, Reduce, Gather, Scatter, and MM (the example is a simplified softmax), then run it through tiling, parallelization, metapipelining, place & route, and code generation, scheduling it in both space and time.

Page 16 defines **metapipelining**:

- A hierarchical coarse-grained pipeline, "a pipeline of pipelines," that exploits nested-loop parallelism
- Turns a parallel pattern (a loop) into a streaming pipeline: insert stages into the loop body, run stages in parallel, overlap multiple iterations
- Intermediate data between stages sits in double buffers, which absorbs stages with uneven runtimes
- Works well with tiling; buffers can change access patterns (e.g. transpose); **metapipelining can work when fusion does not**

Pages 18–20 give a matmul `METAPIPE` program: the outer level loads A tiles along M, the inner level loads B tiles along N, runs `MAT_MUL`, and stores to C, with a diagram of which AGCUs, PMUs, and PCUs each stage maps to. Page 21 lays FlashAttention's QKᵀ, mask, softmax, dropout, and xV out as a metapipeline.

### Same model: 3 kernel calls vs 800

Pages 22–25 are the most concrete example in the lecture: Llama 3.1 8B inference.

- Page 23: with TensorRT-LLM on a GPU, each decoder becomes about ten kernels (K1–K10). The slide labels this "low kernel fusion, low data locality, high launch and synchronization overheads."
- Page 24: the RDU **fuses an entire decoder into one kernel**. The slide credits the SRAM gap — 520 MB on the SN40L versus 100 MB on the H100, about 5x — and says dataflow fusion eliminates GBs of off-chip intermediate traffic.
- Page 25: go further and run all decoders in one kernel call. The slide's figures: **3 calls per token on the RDU versus about 800 on the GPU, more than 100x fewer.** It also names the inference bottleneck: **HBM bandwidth limits inference performance**, so the goal is to fully overlap weight loading with compute and keep HBM busy all the time.

Page 27 sums up the first part. Specialized hardware has many systolic matmul units, configurable datapaths that pass intermediates directly between units, and lots of on-chip storage. The H100 uses asynchronous compute and memory mechanisms, which makes programming complex and calls for DSLs like ThunderKittens. The SN40L uses dataflow with metapipelining, a simpler programming model that depends on a sophisticated compiler. **High performance requires minimizing synchronization overhead.**

Note that the RDU-versus-GPU numbers in this section come from the slides themselves, which do not state measurement conditions. This post reports them as given and has not verified them independently.

## Part two: datacenter scale (pages 28–44)

### Why you need a whole datacenter

Page 28 uses an Epoch AI chart that splits growth in "effective compute" since 2014 into algorithmic progress and compute scaling. Page 29 is titled "All the TFLOPS are in the Tensor Cores." Page 30 uses another Epoch AI chart showing training hardware quantity rising over time (with GPT-4, Gemini 1.0 Ultra, and Llama 3.1-405B labeled).

Page 31 distinguishes **scale up** (within a node) from **scale out** (across nodes). Page 32 shows the modular NVIDIA DGX SuperPOD: 140 DGX A100 nodes (1,120 GPUs) form one GPU POD. Each node has two AMD EPYC 7742 CPUs and eight A100s, fully connected by NVLink 3.0. Nodes connect over a 200 Gb/s HDR InfiniBand fat-tree, with separate networks for compute and storage.

### Collective communication

Pages 33–34 define the collectives that come up again and again (a rank is one accelerator node):

- **AllReduce**: every node ends up with the sum over all nodes. The slide shows AllReduce = ReduceScatter + AllGather.
- **ReduceScatter**: sum, then each node keeps only one chunk.
- **AllGather**: each node broadcasts its chunk to everyone.
- **All-to-All**: rank i sends its j-th chunk to rank j, which amounts to a transpose across nodes.

### Where the parallelism is, and what it costs

Page 36 draws a model's tensors as a cube and marks how each dimension can be split: pipeline parallel (across layers), tensor parallel (across the hidden dimension), expert parallel (across experts), sequence/context parallel (across the sequence), and data parallel (across the batch). Page 37 maps them to collectives:

| Parallelism | Communication primitive |
|---|---|
| Tensor Parallel (TP) | ReduceScatter + AllGather, or AllReduce |
| Pipeline Parallel (PP) | Send-Receive |
| Expert Parallel (EP) | All-to-All |
| Data Parallel (DP) | ReduceScatter + AllGather, or AllReduce |

This table is the thing to remember from the lecture: **choosing a kind of parallelism means choosing a communication pattern.**

### Overlap decides how well you scale

Page 38 walks through a distributed matmul: `inputA[MxK] x inputB[KxN]` with BS = 16, M = 24576, K = 131072, N = 8192, with K split across S RDUs. Each RDU computes `[MxK/S] x [K/SxN]`, producing an [MxN] partial result, and an S-way reduce-scatter combines them.

Page 40's conceptual chart says that without overlap (labeled GPU), communication takes a growing share of time as sockets increase and becomes the bottleneck, so GPUs need very large interconnect bandwidth to stay utilized. Page 41 quantifies it on RDUs:

| RDUs | 8 | 16 | 32 |
|---|---|---|---|
| Compute time at 100% utilization (ms) | 66.3 | 33.1 | 16.5 |
| Reduce-scatter time at 100% link utilization (ms) | 8.6 | 9.7 | 15 |
| Theoretical peak utilization without overlap | 88.5% | 77% | 52% |
| Measured utilization with overlap | 72% | 75% | 79% |

Read it this way: compute time falls linearly with node count, but communication time rises. Run them back to back and 32 nodes cap out at 52% in theory. The slide's conclusion is that compute-communication overlap sustains 70%+ utilization across 32 sockets. Page 39 adds that on the RDU, AllReduce is pipelined with decoder compute and never touches HBM.

### Pipeline parallelism and 3D parallelism

Page 42 notes that naive pipeline parallelism in training leaves compute idle and lowers throughput. Page 43's fix is fine-grained pipeline parallelism: split a mini-batch into micro-batches and pipeline forward and backward passes across them.

Page 44 is a configuration table for models from 1.7B to 1T parameters (sequence length 2048, vocabulary 51,200), listing tensor-, pipeline-, and data-parallel sizes, GPU counts, and achieved percent of peak FLOPS, which ranges from 41% to 49%. The 1T configuration, for example, is TP 8, PP 64, DP 6, on 3,072 GPUs, at 49%. The slide does not cite the table's source. The takeaway is the text beneath it: **the degree of each parallelism, the pipeline schedule, global batch size, and micro-batch size all affect communication volume, pipeline bubble size, and memory footprint.**

## Part three: energy and DRAM (pages 45–72)

### Moving data costs more than computing

Page 45 gives two ideas for cutting energy: use the right processor for the job (specialization), and **move less data**.

Page 46 quotes ballpark numbers from Bill Dally (NVIDIA) and Tom Olson (ARM): an integer op about 1 pJ, a floating-point op about 20 pJ, reading 64 bits from a small local SRAM 1 mm away about 26 pJ, reading 64 bits from low-power mobile DRAM (LPDDR) about 1200 pJ. The slide's inference: when optimizing for energy, **recomputing is often better than storing and reloading**. It also does the arithmetic: reading 10 GB/s from memory costs about 1.6 W, while a mobile GPU's whole power budget is about 1 W. Page 47 cites another set (Han, ICLR 2016, 45 nm): a 32-bit float op about 0.9 pJ, a local SRAM access about 5 pJ, a 32-bit LPDDR load about 640 pJ.

This is [L3](/posts/ai/2026-09-30-cs149-latency-bandwidth-ispc-en)'s "arithmetic is free" again, seen through energy instead of speed.

### How DRAM works

Pages 48–66 are a DRAM primer:

- **The DRAM array**: one transistor plus one capacitor per bit, 2 Kbits per row; a read moves a whole row into the row buffer.
- **Reading one byte**: precharge (~10 ns) → row activation (~10 ns) → column selection (~10 ns) → transfer onto the bus. If the next byte is in the same row, skip the first two steps.
- **Latency is not fixed**: best case is just column access (CAS); worst case is precharge + row activate + column access.
- **Data pins are the scarcest resource**: each access pays latency and the pins sit idle most of the time. Two fixes: **burst mode** (one command transfers a long contiguous run, amortizing latency) and **multiple banks** (one bank precharges/activates while another transfers).
- **DIMMs**: eight DRAM chips form a 64-bit bus. The wrong way to read a 64-byte cache line is to have one chip send every byte in sequence; the right way interleaves physical addresses across the eight chips at byte granularity so they send 64 bits in parallel.
- **The memory controller is a request scheduler** with conflicting goals (throughput, latency, energy). A common policy is FR-FCFS: serve requests to the currently open row first, other rows in FIFO order. It may also coalesce small requests into large contiguous ones to exploit burst mode.
- **Multiple channels**: page 65 uses the Intel Core i7-7700K in the myth machines: DDR4-2400 gives 64 bits x 1.2 GHz x 2 = 19.2 GB/s per channel, 38.4 GB/s over two channels, with about 13 ns CAS.

Page 71 mentions HBM4's custom logic die and lists things that might go on it, including an SRAM cache and KV cache compression.

### Summary

Page 72 splits the answers to the memory bottleneck in two:

- **Application programmers**: schedule computation to maximize locality and minimize required data movement
- **New hardware architectures**: smarter DRAM request scheduling, bringing data closer to the processor (deep cache hierarchies, 3D stacking), wider memory systems, limited compute in or near memory, and hardware-accelerated compression

And three general principles: put storage near the processor, move computation to the data, and trade extra computation for less data transfer.

## Three questions to take away

1. **How many kernel calls does your code make?** The slides' 3 versus 800 is an extreme case, but you can count how many kernels your own inference code launches per token with a profiler.
2. **What communication does your parallelism require?** Check page 37's table.
3. **Can communication overlap with compute?** Check page 41's table: without overlap, adding nodes can lower utilization.

**Something you can do tonight**: take the training or inference config of any model you work with, list which kinds of parallelism it uses (TP/PP/DP/EP), map each to page 37's collectives, and estimate how much data each step moves.

## Further reading

This lecture is a survey. Each topic has a deeper guide on the site; this series keeps its full content, and these are extensions only:

- Mechanics and trade-offs of parallelism: [CS336 Parallelism Mechanics](/posts/ai/2026-08-22-cs336-parallelism-mechanics-en), [CS336 Parallelism Strategies](/posts/ai/2026-08-22-cs336-parallelism-strategies-en)
- Model parallelism and MoE all-to-all: [CMU 11-868 Model Parallelism and MoE](/posts/ai/2026-09-30-cmu11868-model-parallel-moe-en)
- Serving at scale: [CMU 11-868 LLM Serving with SGLang and vLLM](/posts/ai/2026-09-30-cmu11868-llm-serving-sglang-vllm-en), [CMU 11-868 Serving at Scale and the KV Cache](/posts/ai/2026-09-30-cmu11868-serving-at-scale-kv-cache-en)
- The big picture of LLM systems: [CME295 LLM Systems](/posts/ai/2026-09-29-cme295-llm-systems-en)

Series navigation: previous [PA4 + Written 3: Trainium2 and NKI](/posts/ai/2026-09-30-cs149-pa4-w3-trainium-nki-en) | next [L13 Domain-Specific Languages and AI-Driven Performance Optimization](/posts/ai/2026-09-30-cs149-dsl-ai-driven-optimization-en) | [Series overview](/posts/ai/2026-09-30-cs149-course-overview-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [Stanford CS149 Fall 2025 course home page](https://gfxcourses.stanford.edu/cs149/fall25)
- [Lecture 12 page (slide-by-slide)](https://gfxcourses.stanford.edu/cs149/fall25/lecture/aidatacenter/)
- [Lecture 12 slide PDF: Mapping AI Applications to the AI Datacenter](https://gfxcourses.stanford.edu/cs149/fall25content/media/aidatacenter/12_AI_DatacenterMapping.pdf)
- [CS149 2023 public lecture playlist (no video for this lecture)](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [Prabhakar et al., Plasticine: A Reconfigurable Architecture for Parallel Patterns (ISCA 2017)](https://dl.acm.org/doi/10.1145/3079856.3080256)
