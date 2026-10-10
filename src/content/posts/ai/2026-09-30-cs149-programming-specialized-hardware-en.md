---
title: "CS149 L11: Programming Specialized Hardware — ThunderKittens Tames H100 Asynchrony, Dataflow Replaces It with Metapipelines"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, parallelism, performance, hardware, gpu, compiler, stanford, ai-course]
lang: en
series:
  name: "Reading Stanford CS149"
  order: 14
tldr: "L11 asks what programmers pay once hardware specializes for AI. On the H100, saturating Tensor Cores means 16×16 tiles, TMA moving data asynchronously, and producer and consumer warps running as a pipeline. That's hard to write, which is why DSLs like ThunderKittens exist. The other route is a dataflow architecture (SambaNova SN40L): describe the computation with parallel patterns such as map, reduce, and zip, and let the compiler handle tiling, metapipelining, and placement. The slides say this can fuse an entire Llama 3.1 8B decoder layer into one kernel."
description: "A guide to Lecture 11 of Stanford CS149 (Fall 2025), written slide by slide because no public video exists: synchronous vs asynchronous execution, weight/output/input-stationary systolic dataflows, H100/B100 Tensor Cores and TMA, why GPU kernels are worth the effort, ThunderKittens tiles and producer-consumer pipelines, the SambaNova SN40L reconfigurable dataflow unit, parallel patterns and metapipelining, and fusing a whole decoder into a single kernel."
draft: false
glossary:
  - term: "ThunderKittens"
    aliases: ["TK"]
    definition: "A C++ template library embedded in CUDA (the slides call it an embedded DSL) that uses 16×16 tiles as its basic data type and provides async primitives and GPU coordination patterns like producer-consumer for writing high-performance AI kernels."
    context: "CS149 L11 uses it to walk through a three-step H100 matrix multiply kernel."
  - term: "metapipelining"
    aliases: ["metapipeline"]
    definition: "A hierarchical, coarse-grained pipeline. The body of a parallel pattern (loop) is split into stages that run concurrently and overlap iterations, with intermediates in double buffers. Each stage of an outer loop can itself be a pipeline, hence a pipeline of pipelines."
    context: "L11 uses it to show how to program matrix multiply and FlashAttention on SambaNova's dataflow architecture."
  - term: "weight-stationary"
    aliases: ["WS", "output-stationary", "input-stationary", "systolic dataflow"]
    definition: "Systolic array dataflow types, named for what stays fixed in each PE. Weight-stationary keeps weights, output-stationary keeps partial sums, input-stationary keeps inputs; everything else streams through."
    context: "The table on slide 17 of L11 shows which data each type avoids reloading or moving."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs149-programming-specialized-hardware)

**This guide follows the Fall 2025 edition of [CS149](https://gfxcourses.stanford.edu/cs149/fall25).** It is post 14 in the [Reading Stanford CS149](/posts/ai/2026-09-30-cs149-course-overview-en) series and covers Lecture 11 from October 28, [Programming Systems for Specialized Hardware](https://gfxcourses.stanford.edu/cs149/fall25/lecture/proghardware/). The official [slide PDF](https://gfxcourses.stanford.edu/cs149/fall25content/media/proghardware/11_SpecializedHardwareProgramming.pdf) has 60 slides (the title slide reads Programming Specialized Hardware for AI).

**There is no public video for this lecture.** Fall 2025 recordings live only on Stanford Canvas, and the 2023 playlist that the official home page points to doesn't include this lecture. The second half of the [2023 course site's hardware specialization slides](https://gfxcourses.stanford.edu/cs149/fall23/lecture/hwaccel/) covers the Spatial accelerator language and a streaming execution model. That is conceptually close to this lecture's dataflow half, but the content differs and can't stand in for it. This guide follows the 2025 slides page by page and adds nothing they don't say. Some slides are only images or code screenshots with no text; for those, this guide gives only the title. The course overall is A3 (enough to self-study); gaps are listed in the [series overview](/posts/ai/2026-09-30-cs149-course-overview-en).

The hardware terms used here (Tensor Core, TMA, systolic array, dataflow architecture) were all explained in the [previous post](/posts/ai/2026-09-30-cs149-hardware-specialization-en) and are only referenced here.

## Course video sources

Official course and existing recording entries are linked below. A single public video matching this article has not been verified for embedding.

Course and recording entries:

- [Official course / lecture source](https://gfxcourses.stanford.edu/cs149/fall25/lecture/proghardware/)

## 1. The scene: the same kernel gets slower on a newer GPU

Slide 31 makes the case that GPU kernels are worth the effort:

- The slide puts NVIDIA's 2025 quarterly revenue at over $47B.
- AI kernels often run on GPU clusters worth hundreds of millions of dollars, for months at a time (large training runs, serving at scale).
- **FlashAttention-2 used about 70% of an A100 but dropped to about 35% on the H100. It took two years for FlashAttention-3 to get back to about 65%.**
- Poor kernels underutilize billions of dollars of compute.

The third point is where this lecture starts. The more specialized the hardware, the less old code benefits from new features. The H100/B100 units from the previous post (revisited here on slides 27–29 and 33) all have to be used deliberately.

## 2. The intuition: asynchrony is necessary, and hard to write

Slide 2 lists three case studies. Google's TPU: a systolic array for dense matrix multiply. NVIDIA's H100 and B100: asynchronous compute and memory mechanisms ⇒ complex programming ⇒ simplified with the ThunderKittens DSL. SambaNova's SN40L: a dataflow architecture whose programming model is tiling plus streaming with metapipelining.

Slide 3 brings back last lecture's efficiency spectrum, with one added line: **programmability adds overhead, which reduces efficiency.**

Slides 4–5 contrast two execution styles. Synchronous: each load → compute → store group starts only after the previous one finishes. Asynchronous: later operations start before earlier ones complete. The slide notes two ways to get asynchrony: software plus hardware (asynchronous instructions and synchronization), or hardware alone (out-of-order execution).

So the question becomes: **asynchrony is a must, so who manages the synchronization?** The lecture gives two answers:

1. On GPUs, the programmer does, with a DSL that packages common patterns (ThunderKittens).
2. Switch to dataflow hardware, let the data drive execution, and have the programmer describe only how data flows (metapipelining).

## 3. Mechanism one: systolic dataflow types

Most of slides 6–26 repeat the TPU and systolic array material from the previous post. The new piece is slide 17's table:

| Dataflow type | Stays in each PE | Streams through | Main goal |
|---|---|---|---|
| Weight-Stationary (WS) | Weights | Inputs (activations) and partial sums | Minimize reloading weights |
| Output-Stationary (OS) | Partial sums (outputs) | Inputs and weights | Minimize movement of accumulated results |
| Input-Stationary (IS) | Input activations | Weights and partial sums | Minimize reloading inputs |

The TPU y = Wx animation from the previous post, with weights held in PEs and x streaming through, is weight-stationary. Which type to choose depends on which data is most expensive to move and most reused. It's arithmetic intensity reasoning again.

Also, slide 18's SIMD vs systolic table is nearly identical to the previous lecture's, except the efficiency row now reads "low / high" instead of "Medium / Very high."

## 4. Mechanism two: saturating Tensor Cores on the H100

### What the hardware provides

Slides 28–29 summarize two specialized GPU units:

- **Tensor Cores**: specialized MMA compute. The slide adds two terms: a warpgroup is 128 consecutive threads, and PTX is NVIDIA's virtual instruction set architecture.
- **TMA**: a specialized block data-movement unit. Slide 28 contrasts the A100's LDGSTS with the H100's TMA, which can bypass L1. Slide 29 says it eliminates thousands of instructions and memory-addressing overhead, plus unnecessary data movement through L1 and registers.

Slide 30 puts GPUs back into the ideal-features table (same as the previous post): tiled tensors, async compute, and async memory are ✅; compute-unit-to-compute-unit communication is ❓.

### What the programmer has to do

Slide 35 lists what it takes to keep H100 Tensor Cores above 90% of peak TFLOPS:

- use 16×16 tiles of fp16 data, matching the Tensor Core's compute shape;
- make sure compute is never idle;
- overlap memory access and compute using asynchrony.

The slide draws a tile-processing pipeline: tiles load from global memory (HBM/L2) into shared memory, then into registers for the Tensor Cores, and results are stored back. Every stage has to be running at once.

### ThunderKittens: packaging the patterns

Slide 36 introduces [ThunderKittens](https://github.com/HazyResearch/ThunderKittens) (credited on the slide to Ben Spector et al.), a template library embedded in CUDA. Three design principles:

1. **A 16×16 tile is the primitive data type.** TK manages layouts and provides basic operations.
2. **Asynchrony everywhere.** Primitives are exposed for users to manage when they need top performance.
3. **High-level GPU coordination patterns**, such as producer-consumer.

There are four data types: register tiles (2D), register vectors (1D), shared memory tiles, and shared memory vectors, each with configurable size and layout. Operations include initializers (e.g., zeroing a vector), unary ops (`exp`), binary ops (`mul`), and row/column ops (`row_sum`).

Slide 37 maps the tile pipeline onto three roles. The **producer** loads tiles from global into shared memory. The **consumer** computes in registers on the Tensor Cores. **Finish** stores results back to global memory through shared memory.

<details>
<summary>Slides 38–40: the three steps of a TK matmul (code details)</summary>

**Step 1: define layouts.** A uses 64×64 tiles and B uses 64×256 tiles, each with a TMA descriptor; C needs none. The shared-memory input block holds two A tiles and one B tile, the finish block holds two 64×256 C tiles, and each consumer's state is a 16×256 fp32 register tile used as the accumulator.

**Step 2: define the pipeline and producers.** 8 consumer warps, 4 producer warps (the default), and a 4-stage input pipeline. Producers call `warpgroup::decrease_registers<40>()` to leave registers for consumers. For loading, only one warp (really one thread) needs to tell TMA to issue `tma::load_async`, after `tma::expect` tells the mbarrier how many bytes to wait for.

**Step 3: compute.** Consumers call `warpgroup::increase_registers<232>()` and zero the accumulator. Each iteration runs `warpgroup::mma_AB`, waits with `mma_async_wait`, and has one thread mark the input block as finished. At the end, results go to shared memory first; the code comment says this reorganizes them for better coalescing when writing to HBM.

Slide 41 is a TK matmul performance chart with no text.

</details>

Look at the shape of this code. Registers are **manually redistributed** between producers and consumers, barriers need their expected byte counts set by hand, and you pick which thread issues the TMA. That's what slide 2 meant by "asynchronous mechanisms ⇒ complex programming." TK makes it writable, but the programmer is still managing synchronization directly.

## 5. Mechanism three: dataflow, with computation described as metapipelines

Slide 42 asks: **can we get asynchrony with a simpler programming model?** The hint: take a data-centric view.

Slides 43–46 recap the previous post's argument. AI models are dataflow graphs, so run them on a reconfigurable dataflow architecture (Plasticine). Streaming dataflow naturally gives kernel fusion and coarse-grained pipelining. With no instruction stream, there's no fetch or decode overhead.

### The SambaNova SN40L hardware

Slide 47's SN40L RDU specs (as stated on the slide):

- 1,040 PCUs and PMUs
- 638 TFLOPS (bf16)
- 520 MB on-chip SRAM, 64 GB HBM, 1.5 TB DDR
- PCU: systolic and SIMD compute (16×8 bf16)
- PMU: high address-generation flexibility and bandwidth
- Mesh switches (S): high on-chip interconnect flexibility and bandwidth
- AGCU (address generator and coalescing unit): the portal to off-chip memory and I/O

### Programming with parallel patterns

Slide 48 uses a simplified softmax: Map (`exp`), then Reduce (`+`), then Zip (`/`). The programmer writes a chain of parallel patterns like this. The compiler flow then does **tiling → parallelization → metapipelining → place & route → codegen**. Composable primitives include MM, Map, Zip, Reduce, Gather, and Scatter. Scheduling is flexible in both space and time, ending in spatial execution.

### Metapipelining

Slide 49's definition:

- **A hierarchical coarse-grained pipeline**, "a pipeline of pipelines," that exploits nested-loop parallelism.
- Convert a parallel pattern (loop) into a streaming pipeline: insert pipe stages into the loop body, run stages in parallel, and overlap multiple iterations.
- Intermediate data between stages lives in **double buffers**, which absorbs imbalance between stages with different execution times.
- It works well with tiling, buffers can change the access pattern (e.g., transpose data), and **metapipelining can work where fusion doesn't.**

Slide 50 illustrates with Gaussian Discriminant Analysis: for each row, slice it, subtract the mean, take the outer product, and accumulate. That forms a four-stage metapipeline, with stages mapped to AGCUs, PCUs, and PMUs.

<details>
<summary>Slides 51–53: a matrix multiply metapipeline</summary>

The slide's code (trimmed):

```cpp
auto MM = 256;  // tile size along M
auto NN = 64;   // tile size along N
METAPIPE(M / MM, [&]() {
  auto a_tile = LOAD_TILE(A, a_tile_shape);          // MM x K
  METAPIPE(N / NN, [&]() {
    auto b_tile = LOAD_TILE(B, b_tile_shape, row_par = 4);  // K x NN
    auto c = MAT_MUL(a_tile, b_tile);
    auto c_tile = BUFFER(c);
    STORE_TILE(C, c_tile);
  });
});
```

The outer metapipeline loads one MM×K strip of A at a time; the inner one loads a K×NN strip of B, multiplies, buffers, and stores to C. Slide 53 shows the mapping: loads and stores go through AGCUs, `a_tile`, `b_tile`, and `c_tile` sit in PMUs, and the matrix multiply is spread across four PCUs.

Compared with the TK version: no barriers, no register redistribution. The program only says how data is split and how it flows.

</details>

Slide 54 writes FlashAttention as a metapipeline: QKᵀ, Mask, Softmax, Dropout, and ×V in sequence, with tiles flowing through one after another. The slide's note: **dataflow execution with token control ⇒ no lock-based synchronization**; a metapipeline is streaming dataflow.

## 6. Back to the model: a whole decoder as one kernel

Slides 55–59 use Llama 3.1 8B inference as a case study (all numbers and comparisons here come from the slides). The model is an embedding, 32 decoder layers, a classifier, and sampling. Each decoder layer has a long chain of operations: Q/K/V GEMMs, QKᵀ, scale, mask, softmax, ×V, the O GEMM, all-reduce, RMS norm, gate/up/down GEMMs, SiLU, and more.

- **On a GPU** (slide 56, running TensorRT-LLM): fusion is limited (FlashAttention is one fused piece), and each decoder layer still runs as roughly ten kernels. The slide lists the problems: low kernel fusion, low data locality, high launch and synchronization overheads.
- **On the RDU** (slide 57): aggressive fusion, **one kernel call per decoder layer**. The slide credits on-chip SRAM: 520 MB on the SN40L versus 100 MB on the H100, about 5x. Dataflow fusion eliminates GBs of off-chip intermediate traffic and adds no extra kernel launch overhead.
- **Going further** (slide 58): one kernel call for all decoders. Inference is limited by HBM bandwidth, so weight loading and compute must overlap completely to keep HBM busy all the time. The slide's numbers are 3 calls per token on the RDU versus about 800 on a GPU, written as "100x fewer kernel calls."
- **Across chips** (slide 59): all-reduce fully overlaps with weight loading and compute, and it consumes no HBM capacity or bandwidth.

This takes the fusion from [post 12](/posts/ai/2026-09-30-cs149-dnn-on-gpus-en) to its limit. L9 fused two or three operations on a GPU. Here the hardware has enough on-chip storage and direct interconnect that a whole layer, or even the whole model, never writes intermediates back to DRAM.

## 7. Going deeper: the lecture's summary and your own judgment

Slide 60's summary:

- Specialized AI hardware has large, numerous matrix multiply units implemented as systolic arrays; customized or configurable datapaths that move intermediates directly between processing units (laying computation out spatially on the chip); and lots of on-chip storage.
- **H100**: asynchronous compute and memory mechanisms ⇒ complex programming; ThunderKittens and other DSLs are needed to manage the complexity.
- **SN40L**: a dataflow model with metapipelining ⇒ a simpler programming model, but a sophisticated compiler is needed to optimize and map to dataflow hardware.
- **Minimizing synchronization overhead is required for high performance.**

The final slide also shows a TPU supercomputer (1024 TPU v3 chips) with no accompanying text.

Keep in mind while reading: the GPU-versus-RDU comparison, the Llama call counts, and the SRAM figures are case studies presented on the slides; this series did not reproduce them independently. Also note that one of CS149's instructors, Kunle Olukotun, is an author of the [Plasticine paper](https://doi.org/10.1145/3079856.3080256), so the dataflow approach is tied directly to the teaching team's research. You'll get more out of it read as an argument about design tradeoffs than as a product comparison.

**A framework to take away.** When you meet new AI hardware, ask three things:

1. What's its compute shape (16×16 tiles? how big a systolic array?), and does your operation match it?
2. Who manages asynchrony: you (barriers, register allocation), or a compiler and dataflow?
3. How much on-chip storage is there, and is it enough to keep intermediates out of DRAM?

**Something to try tonight**: open [ThunderKittens on GitHub](https://github.com/HazyResearch/ThunderKittens), pick a kernel example, and mark which lines are producer, which are consumer, and which set up synchronization. Then try writing the same operation with slide 48's Map / Reduce / Zip, and compare what each approach asks you to decide.

Further reading: for another way of managing specialized hardware through a DSL, on TPUs, read [CMU 11-868 TPU, JAX, and Pallas](/posts/ai/2026-09-30-cmu11868-tpu-jax-pallas-en). For higher-level GPU kernel languages like Triton, read [CS336 Kernels and Triton](/posts/ai/2026-08-22-cs336-kernels-triton-en). Next up, [PA4](/posts/ai/2026-09-30-cs149-pa4-w3-trainium-nki-en) has you manage software-controlled on-chip memory yourself on AWS Trainium2.

Series navigation: previous [L10 Hardware specialization and DNN accelerator design](/posts/ai/2026-09-30-cs149-hardware-specialization-en) | next [PA4 + Written 3: Trainium2 and NKI](/posts/ai/2026-09-30-cs149-pa4-w3-trainium-nki-en) | [Series overview](/posts/ai/2026-09-30-cs149-course-overview-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [Stanford CS149 Fall 2025 course home](https://gfxcourses.stanford.edu/cs149/fall25)
- [Lecture 11 page (slide-by-slide)](https://gfxcourses.stanford.edu/cs149/fall25/lecture/proghardware/)
- [Lecture 11 slide PDF: Programming Specialized Hardware for AI](https://gfxcourses.stanford.edu/cs149/fall25content/media/proghardware/11_SpecializedHardwareProgramming.pdf)
- [2023 hardware specialization lecture page (conceptual comparison only, not a substitute)](https://gfxcourses.stanford.edu/cs149/fall23/lecture/hwaccel/)
- [ThunderKittens (HazyResearch)](https://github.com/HazyResearch/ThunderKittens)
- [Prabhakar et al., Plasticine: A Reconfigurable Architecture for Parallel Patterns (ISCA 2017)](https://doi.org/10.1145/3079856.3080256)
