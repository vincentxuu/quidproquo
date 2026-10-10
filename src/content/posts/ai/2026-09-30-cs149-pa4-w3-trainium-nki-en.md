---
title: "CS149 PA4 + Written 3: Moving Your Own Data on Trainium2 — NKI, SBUF/PSUM, and a Fused Conv+Maxpool"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, parallelism, performance, hardware, stanford, ai-course]
lang: en
series:
  name: "Reading Stanford CS149"
  order: 15
tldr: "PA4 drops you onto a single NeuronCore of an AWS Trainium2 chip. No cache decides what stays on chip: you move data into SBUF (28 MiB) and PSUM (2 MiB) yourself with dma_copy, and the partition dimension tops out at 128. Part 1 teaches those limits and the cost of DMA through vector add and transpose. Part 2 asks you to rewrite convolution as a series of matmuls and fuse it with max pooling so nothing spills back to HBM. Written 3 drills the same idea with a line buffer, two back-to-back box blurs, softmax hardware, and metapipelining: keep intermediates on chip. The environment needs the course's private AMI and a paid capacity block, so for outside readers this assignment is effectively A2."
description: "A guide to Stanford CS149 (Fall 2025) Programming Assignment 4 and Written Assignment 3: the Trainium2 NeuronCore and its HBM/SBUF/PSUM hierarchy, the NKI programming model, vector add and matrix transpose, mapping a fused convolution + max pool onto matmuls, and the written problems on locality, softmax hardware, and data-parallel thinking, plus what outside learners can actually run."
draft: false
glossary:
  - term: "SBUF"
    aliases: ["State Buffer"]
    definition: "Software-managed on-chip memory on a Trainium NeuronCore (28 MiB per the PA4 README, roughly 20x the bandwidth of HBM). Data must be explicitly moved in from HBM before computing on it."
    context: "Every NKI kernel in CS149 PA4 starts by dma_copy-ing data into SBUF."
  - term: "PSUM"
    aliases: ["Partial Sum Buffer"]
    definition: "A small on-chip memory (2 MiB) on the NeuronCore dedicated to Tensor Engine matmul results. It supports read-add-write, which makes it a natural accumulator for tiled matmul."
    context: "In PA4, transpose and matmul results land in PSUM and must be copied to SBUF before a DMA back to HBM."
  - term: "partition dimension"
    aliases: ["P dimension"]
    definition: "The first dimension of a 2D SBUF/PSUM tensor in NKI. The NeuronCore loads and processes data along it in parallel, and it is capped at 128. The second dimension is the free dimension."
    context: "PA4 Part 1's first vector add only handles 128 elements because a 1D vector's only dimension becomes the partition dimension."
  - term: "NKI"
    aliases: ["Neuron Kernel Interface"]
    definition: "AWS's kernel language and compiler for Trainium, written in Python; functions marked with @nki.jit are compiled to run on NeuronDevices."
    context: "All of CS149 PA4 is written in NKI."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs149-pa4-w3-trainium-nki)

**Video status: Official entry or recording index only.** [Source details](#course-video-sources)

**This post follows the Fall 2025 edition of [CS149](https://gfxcourses.stanford.edu/cs149/fall25).** It is part 15 of the [Reading Stanford CS149](/posts/ai/2026-09-30-cs149-course-overview-en) series and covers two assignments: [Assignment 4: Programming a Machine Learning Accelerator](https://github.com/stanford-cs149/asst4-trainium2) (due Nov 13, 100 points) and [Written Assignment 3](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst3.pdf).

Access first. The course as a whole is A3 (enough to self-study), but **PA4 is effectively A2**. The code and README are fully public, so you can read and understand everything. Running it requires an AWS Trainium2 machine, and the official setup uses a private AMI available only to enrolled students (details under "What outside learners can do" below). The Written 3 PDF is public; no solutions are.

This post covers what each problem trains and what to watch for. **It does not include solutions.**

## Course video sources

Official course and existing recording entries are linked below. A single public video matching this article has not been verified for embedding.

Course and recording entries:

- [Official course / lecture source](https://gfxcourses.stanford.edu/cs149/fall25/lecture/proghardware/slide_10)

## From CUDA to Trainium: the cache is gone

The previous assignment, [PA3](/posts/ai/2026-09-30-cs149-pa3-w2-cuda-renderer-en), was CUDA on an NVIDIA GPU. The PA4 README opens by comparing the two. CUDA's hierarchy is host memory, device global memory, per-thread-block shared memory, and per-thread private memory. Trainium has four levels:

| Level | Where | README figure | Who manages it |
|---|---|---|---|
| Host memory (DRAM) | Off the Trainium device | — | Not used in this assignment |
| HBM | On the Trainium device | 96 GiB | Main device memory; NumPy arrays created outside kernels live here by default |
| SBUF (State Buffer) | On-chip, per NeuronCore | 28 MiB, ~20x HBM bandwidth | **Software** moves data in and out explicitly |
| PSUM (Partial Sum Buffer) | On-chip, per NeuronCore | 2 MiB | Dedicated to Tensor Engine matmul results |

One paragraph in the README states the core difference. In a system with a data cache, the hardware decides which data gets replicated on chip; from the standpoint of software correctness, the cache does not exist. NeuronCore memories are **software managed**. Either the programmer writes the data movement explicitly, or the NKI compiler analyzes the program and generates it. The README says orchestrating data movement through the machine is one of the biggest challenges of using a NeuronCore well.

This picks up where the previous two lectures left off. [L10 Hardware Specialization](/posts/ai/2026-09-30-cs149-hardware-specialization-en) explains why accelerators carry large on-chip storage, and [L11 Programming Specialized Hardware](/posts/ai/2026-09-30-cs149-programming-specialized-hardware-en) covers how you program such hardware. PA4 has you do it yourself.

### What the hardware looks like

The `trn2.3xlarge` instance has one Trainium device with eight NeuronCores, each with its own dedicated HBM. Each NeuronCore is a standalone processing unit with its own on-chip storage and a set of specialized engines: a Tensor Engine for 128x128 matrix operations, a Vector Engine for 128-wide vector operations, and so on. The README says there are four distinct compute engines and links to the [AWS Neuron docs](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/neuron-core-v3.html). **The whole assignment targets a single NeuronCore.**

## The NKI programming model: three kinds of operations

[NKI](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/general/nki/programming_model.html) (Neuron Kernel Interface) is Trainium's kernel language and compiler, written in Python. The README sorts NKI operations into three kinds:

1. **Load** data from HBM into SBUF
2. **Compute** on the NeuronCore engines
3. **Store** results from SBUF back to HBM

The README keeps mapping things back to CUDA. The `@nki.jit` decorator plays the role of `__global__`. Kernel arguments are tensors in HBM, like CUDA kernel arguments in device global memory. `nisa.dma_copy` moves data between HBM and SBUF, conceptually like `cudaMemcpyAsync`. The assignment also adds `@nki.compiler.skip_middle_end_transformations`, which disables compiler optimizations that can rewrite kernels in surprising ways, to make debugging easier.

The key sentence is in bold in the README: **NKI operations work on tensors, not scalars.** SBUF and PSUM store data as 2D arrays. The first dimension is the **partition dimension** (P), the second the **free dimension** (F). The NeuronCore can load and process data along the partition dimension in parallel, but the architecture **caps the partition dimension at 128**.

That is why the first vector add kernel in the README only works for vectors of length 128 or less: a 1D vector's only dimension is the partition dimension.

## Part 1: vector add and transpose (30 points)

Part 1 lives in `part1/`. The `run_benchmark.py` script runs each kernel at different vector sizes and can optionally collect profiling data.

### Step 1: chunk to match 128 lanes

`vector_add_tiled` splits the vector into chunks of `ROW_CHUNK` and loops over them with `nl.affine_range`. The starter code deliberately sets `ROW_CHUNK = 1` (the README admits this is inefficient). Your tasks:

- Time `ROW_CHUNK = 1` on 25600 elements.
- Change it to 128, measure the speedup, and explain it. The README's hint: think of execution as loading `ROW_CHUNK` elements from HBM in parallel, then doing a `ROW_CHUNK`-wide vector add in SBUF.
- Try 256, get an error, and explain why in one sentence.

`affine_range` requires no loop-carried dependencies; for loops with dependencies there is `sequential_range`. The README notes that since compiler optimizations are disabled here, the two behave the same in this assignment.

### Step 2a: move more per DMA

The README asks you to think of each `nisa.dma_copy` as **a single asynchronous operation that moves a block of data between HBM and SBUF**. Each NeuronCore has 16 DMA engines that can work on different transfers in parallel, but setting up each transfer has a fixed cost. Efficient code moves a lot of data per transfer to amortize it.

The partition dimension is capped at 128, but the free dimension of a single SBUF vector instruction can reach 64K elements. So `vector_add_stream` reshapes the 1D vector into a `(128, M/128)` tile and moves `FREE_DIM` elements along the free dimension per transfer. The README frames this as the inverse of PA3: there you flattened a 2D grid of threads into a linear index; here you fold a 1D vector into a 2D matrix. You tune `FREE_DIM` to minimize DMA transfers on 25600 elements and record the speedups.

### Step 2b: bigger tiles are not always better

The README lists the trade-off in choosing the free dimension:

1. Too small: instruction overhead dominates and the engines run inefficiently.
2. Too large: pipelining between engines suffers, and with data reuse, SBUF memory pressure rises.

This step grows the vector to 256000 elements and compares `FREE_DIM = 2000` with `1000`, using `neuron-profile` to read `dma_transfer_count` and `total_time`. The README tells you which way it goes: **1000 makes more DMA transfers and is still faster.** You open the profiler GUI, look at the DMA engine, Vector Engine, Pending DMA Count, and DMA Throughput timelines, and explain why. The hint is one word: pipelining.

It is the same point as [L3's laundry analogy](/posts/ai/2026-09-30-cs149-latency-bandwidth-ispc-en): if one batch is too big, the next station just waits.

### Step 3: transpose on the Tensor Engine (15 points + 1 extra credit)

The Tensor Engine is built around a 128x128 systolic array (the README links back to [L11 slide 10](https://gfxcourses.stanford.edu/cs149/fall25/lecture/proghardware/slide_10)). It streams matrix data from SBUF and writes results to PSUM. PSUM supports read-add-write at every address, so when you tile a large matmul, each tile's results can accumulate into the same output tile.

You write a kernel that turns an (M, N) matrix into (N, M), with M and N multiples of 128. The constraint: **the only compute instruction allowed is `nisa.nc_transpose`**, which transposes tiles up to 128x128 on the Tensor Engine and leaves the result in PSUM. `nisa.dma_copy` only works on SBUF and HBM, so you first copy PSUM results to SBUF, for example with `nisa.tensor_copy`.

Then you answer: without a profiler, is the kernel memory-bound or compute-bound? Then verify with the profiler. Extra credit asks for a 4096x4096 transpose under 700 μs.

## Part 2: fused convolution + max pool (70 points)

### First, tiled matmul in NKI

The Tensor Engine has its own tile limits, different from the Vector Engine's. For C = A x B:

- The left tile A can be at most (128, 128)
- The right tile B can be at most (128, 512)
- The output tile C in PSUM is at most (128, 512)

The README gives a tiled matmul adapted from the NKI tutorials. Two outer `affine_range` loops walk the M and N dimensions of the output, allocating a partial-sum tile in PSUM for each. The inner loop walks the contraction dimension K, loads A and B tiles, and accumulates `nisa.nc_matmul` results into PSUM. Then it copies back to SBUF, casts, and DMAs to HBM.

One interface detail matters a lot: **the left matrix is passed transposed, as `lhsT` with shape [K, M]**. `nisa.nc_matmul(lhsT, rhs)` returns A x B. That shapes whether you need to transpose inputs in Part 2.

### Convolution as a series of matmuls

[L9](/posts/ai/2026-09-30-cs149-dnn-on-gpus-en) showed one conv-to-GEMM reduction that builds a row per spatial patch and runs one big matmul. The PA4 README flags in a NOTE that **this assignment uses a different reduction**, one that suits Trainium better.

Flatten the input's height and width into one dimension, giving `(Height x Width) x Input Channels`. Each filter position (i, j) is an `Input Channels x Output Channels` slice. For each (i, j), shift the input by the matching offset, multiply by that slice (contracting over Input Channels), and accumulate. The README's pseudocode is two loops over filter height and width wrapped around `output += matmul(transpose(weight[i,j,:,:]), input_shifted)`, with a reminder: **this is only an algorithm; the assignment is about working out how to map it efficiently onto the hardware.**

The convolution is simplified: stride 1 only, and no padding to handle (the harness pads for you).

### Max pool and fusion

Max pooling also slides a window over the feature map, but takes the maximum, and each channel is handled independently. The assignment uses a single `pool_size` parameter for both window size and stride, and it is only ever 1 or 2. With `pool_size = 1` pooling is a no-op, so the same kernel doubles as a plain convolution.

The README defines "fused" precisely: convolution and max pool are computed together on Trainium **without writing intermediate values to off-chip HBM**.

The inputs come with friendly guarantees: Input Channels and Output Channels are multiples of 128, filters are square, weights always fit in SBUF, and sizes divide evenly.

### The README's suggested order

The General Tips read like a work plan:

1. **Correctness first.** Start with a small image, no bias, no maxpool. Then handle images too large for SBUF, then add bias, then fuse max pool. Only then tune performance.
2. **Understand the algorithm.** Draw the matrices and their shapes and think about the memory hierarchy. Hint: remember what is unusual about NKI's matmul interface — the first input is transposed.
3. **Track tile shapes.** Decide which output dimension to tile. The partition dimension is at most 128 and must come first. Once the output shape is fixed, work out which slice of X and W one output tile needs.
4. **Order loops for locality.** Loops come from filter height and width, tiled matmul, and batching. A recommended goal is to keep intermediates in PSUM until a tile is finished, so each part of the SBUF result is written once; then order the rest for input locality.
5. **Use the profiler** to find stretches where the Tensor Engine sits idle, and restructure to shrink them.

### Grading

- Correctness uses two image types: a small 32x16 image and a large 224x224 image that exceeds SBUF and cannot be loaded at once. **You must pass every correctness test to earn performance points.**
- Performance is measured against a reference kernel across four configurations: with and without maxpool, float16 and float32, with stricter targets for float16. p99 latency within 120% of an unoptimized reference earns 95% of performance points; within 120% of the optimized reference earns full points.
- Points: write-up 30 (Part 1 questions 20, Part 2 questions 10), transpose correctness 10, conv correctness 10 (small, large, bias, maxpool at 2.5 each), conv performance 50, plus up to 5 extra credit for small-image performance.
- The write-up must report MFU (Model FLOPs Utilization) from the profiler, for both float16 and float32.

The extra credit asks whether MFU differs between small and large images and how you would optimize for small ones. The README's hint: `nisa.nc_matmul` accepts a tensor with more than two dimensions as its moving argument, as long as PSUM's hardware limits are respected.

**Something you can do tonight**: the first step needs no Trainium. Open `part2/conv2d_numpy.py` in the repo, which has NumPy versions of convolution and maxpool. Sketch the README's "shift + matmul + accumulate" version on paper, label every matrix shape, and ask: which slice of the output does one 128x512 PSUM tile correspond to, and how much input does it need?

## Written 3: keep intermediates on chip

The first page of Written 3 is headed **Improving locality on Specialized Hardware**. Graded and practice problems are interleaved; here they are in PDF order, with only what each trains.

### Graded problems

**Problem 1 (30 points, graded for correctness): a line buffer for a two-pass blur.** Start from C code that blurs each row horizontally into `tmp_buf`, then each column vertically. Compute its arithmetic intensity, then its peak performance on a processor with 1 TB/s bandwidth and 1 TFLOPS. Then the problem introduces `LINEBUFF`, an on-chip storage module that accepts per-pixel enqueues and whole-row dequeues and stalls the caller when full or not ready. You run the horizontal and vertical passes on two threads communicating through the line buffer, and pick the minimum number of rows that maximizes arithmetic intensity while letting both threads keep making progress in steady state. Finally you recompute intensity and peak performance on a dual-core processor.

This is the same two-pass blur that [L13's Halide example](/posts/ai/2026-09-30-cs149-dsl-ai-driven-optimization-en) uses — one from the hardware side, one from the scheduling-language side, both removing the round trip through `tmp_buf`.

**Problem 2 (35 points, graded for correctness): Two Box Blurs are Better Than One.** Two back-to-back `FILTER_SIZE x FILTER_SIZE` convolutions. Compute the unfused arithmetic intensity, then analyze a version that fuses both passes and produces `CHUNK_SIZE x CHUNK_SIZE` output blocks. How big must `temp` be? With `CHUNK_SIZE = 8` and `FILTER_SIZE = 5`, how much arithmetic per output pixel? If the original was already compute-bound, does this help or hurt? And the last question: why might the transformation still be useful in an energy-constrained setting even if performance barely changes?

The trade-off it forces: fusion saves memory traffic, but the edges of each chunk **recompute** part of the intermediate.

**Problem 3 (30 points, graded on effort): Designing Hardware for Softmax.** On an AI accelerator programmed with `LOAD_TILE`, `STORE_TILE`, and `BUFFER`, you analyze the exp and rowsum stages of softmax: compute the arithmetic intensity of the EXP loop, the runtime for N=1000 at 10 MB/s and 10 MFLOPS, improve it using only plain loops, and then again with metapipelining. Metapipelining is the concept [L12](/posts/ai/2026-09-30-cs149-ai-datacenter-mapping-en) introduces with the SambaNova dataflow architecture.

**Problem 4 (30 points, graded for correctness): An Interesting CUDA Program.** A kernel that is "almost like exponentiation, but not quite," where each thread's loop count depends on its input (1 to 8, with at least one 8 in every group of 8). How many cycles per warp? Memory-bound or compute-bound at 32 GB/s? With 75-cycle latency, how many warps of execution contexts are needed to never stall? It combines divergence and latency hiding from [L7 GPU Architecture](/posts/ai/2026-09-30-cs149-gpu-architecture-cuda-en).

**Problem 5 (18 points, graded on effort): Data-Parallel Grid Solver.** Back to the red-black grid solver from [L4](/posts/ai/2026-09-30-cs149-parallelizing-thought-process-en). Compute its arithmetic intensity, then rewrite it as a tiled program on a dataflow architecture (the problem names the SambaNova SN40L) and compute one iteration's time with a sequential `LOOP` and with `METAPIPE`. The hint: what limits the throughput of a pipeline?

### Practice problems (ungraded)

- **Practice 1: An Exercise in Data-Parallel Thinking.** Using only bulk launch and `exclusive_scan`, find the longest segment described by a flags array; full credit wants lg2(num_segs) span. Pairs with [L8 Data-Parallel Thinking](/posts/ai/2026-09-30-cs149-data-parallel-thinking-en).
- **Practice 2: Async Message Ping Pong.** With an asynchronous send/recv API, thread A sends COUNT random integers to B, B sends them all back, and A verifies before printing DONE. The network has high latency and may reorder messages; maximize parallelism in transfers.
- **Practice 3: PKPU2.0.** A fictional GPU (16 cores, 1 GHz, 32-wide warps): peak throughput, divergence, arithmetic intensity, latency hiding, and a choice among four hardware upgrades.
- **Practice 4: Fusion, Fusion, Fusion.** A chain of math-library calls and a choice between two machines with different bandwidth and SIMD width. You may rewrite the code (including fusing it) but not change the math.
- **Practice 5: Paparazzi Camera.** Design a heterogeneous camera chip: how to mix fixed-function and programmable cores, why the 6x Amdahl's Law ceiling does not hold here, and how to change the pseudocode to roughly double energy efficiency.

The question running through all of Written 3 is: **does this intermediate need to go back to memory at all?** It is the same question as PA4 Part 2's "fuse and never spill to HBM."

## What outside learners can do

Per the [cloud_readme](https://github.com/stanford-cs149/asst4-trainium2/blob/main/cloud_readme.md), the official environment is:

- A `trn2.3xlarge` in AWS Asia Pacific (Melbourne, `ap-southeast-4`), a region that is not enabled by default and must be turned on first.
- The course's Ubuntu AMI from EC2 **Private images**. The README says "All students in CS149 should have access"; outside accounts cannot see it.
- **A capacity block purchase is required** to launch the instance. The README says that as of October 31, 2025 the upfront cost is $2.25 per hour, about $300 for 7 days; blocks come in 1-day increments up to 14 days and are prepaid whether you use them or not.
- Enrolled students get course AWS credits, and the README mentions an extra $400.
- Profiling needs ports 3001 and 8086 forwarded so you can open the `neuron-profile` GUI in a browser.

So outside readers have three options:

1. **Read only.** The README is a solid introduction to Trainium and NKI on its own; pair it with `kernels.py` and `conv2d_numpy.py`.
2. **Pay and build your own.** Buy a Trainium2 capacity block and install the Neuron SDK and NKI yourself. The private AMI and `install.sh` environment cannot be reproduced exactly, and your numbers will not compare directly with the official references.
3. **NKI's CPU simulation.** The README says the harness's `--simulate` flag wraps your kernel in `nki.simulate_kernel()`, and warns that simulation can diverge from on-device results. The README does not say whether this works outside the course environment, and this post has not tested it.

## Further reading

- The same "manage on-chip memory yourself and feed tiles to a matrix unit" pattern on Google TPUs: [CMU 11-868 TPU, JAX, and Pallas](/posts/ai/2026-09-30-cmu11868-tpu-jax-pallas-en).
- The GPU counterpart with Triton kernels: [CS336 Kernels and Triton](/posts/ai/2026-08-22-cs336-kernels-triton-en).

Series navigation: previous [L11 Programming Specialized Hardware](/posts/ai/2026-09-30-cs149-programming-specialized-hardware-en) | next [L12 Mapping AI Applications to the Datacenter](/posts/ai/2026-09-30-cs149-ai-datacenter-mapping-en) | [Series overview](/posts/ai/2026-09-30-cs149-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [Stanford CS149 Fall 2025 course home page](https://gfxcourses.stanford.edu/cs149/fall25)
- [Assignment 4 GitHub repo: asst4-trainium2 (README)](https://github.com/stanford-cs149/asst4-trainium2)
- [Assignment 4 AWS setup: cloud_readme.md](https://github.com/stanford-cs149/asst4-trainium2/blob/main/cloud_readme.md)
- [Written Assignment 3 PDF](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst3.pdf)
- [Lecture 11 slide 10: systolic array (cited by the README)](https://gfxcourses.stanford.edu/cs149/fall25/lecture/proghardware/slide_10)
- [Lecture 9 slide 57: convolution layer implementation (cited by the README)](https://gfxcourses.stanford.edu/cs149/fall25/lecture/dnninference/slide_57)
- [AWS Neuron docs: NeuronCore-v3 architecture](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/about-neuron/arch/neuron-hardware/neuron-core-v3.html)
- [AWS Neuron docs: NKI programming model](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/general/nki/programming_model.html)
- [AWS docs: purchasing EC2 Capacity Blocks](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/capacity-blocks-purchase.html)
