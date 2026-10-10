---
title: "CS149 Lecture 7: GPU Architecture and CUDA Programming"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, ai-course, stanford, gpu, cuda, parallelism]
lang: en
series:
  name: "Reading Stanford CS149"
  order: 9
tldr: "CUDA's grid, thread block, and CUDA thread are programming abstractions; the GPU implements them with SMs, warps, and a hardware block scheduler. The heart of the lecture is keeping two things apart: the system may run thread blocks in any order, but all threads in one block are guaranteed to be live at once. That is why a block can cooperate through shared memory and __syncthreads(), and why the number of blocks an SM can hold is set by registers and shared memory."
description: "A guide to Stanford CS149 (Fall 2025) Lecture 7: how GPUs went from the graphics pipeline to compute mode, CUDA's execution and memory abstractions (host/device, grid/block/thread, global/shared/local), the 1D convolution example, how V100 SMs and warps implement them, how resource limits drive thread block scheduling, and why blocks must never wait on each other."
draft: false
glossary:
  - term: "warp"
    definition: "A group of 32 CUDA threads that execute together on an NVIDIA GPU. When they run the same instruction, the hardware executes it once on SIMD units; when they take different paths, execution diverges."
    context: "CS149 L7 stresses that the warp is an implementation detail, not part of the CUDA programming model (apart from a few intra-warp built-ins)."
  - term: "SIMT"
    aliases: ["single instruction multiple thread"]
    definition: "NVIDIA's name for how its GPUs execute: programs are written as scalar threads, and the hardware checks at run time whether the threads of a warp share an instruction, executing them SIMD-style when they do."
    context: "L7 contrasts it with an ISPC gang: ISPC emits SIMD instructions at compile time, SIMT is a hardware run-time check."
  - term: "thread block"
    aliases: ["CUDA thread block", "block"]
    definition: "CUDA's unit for grouping threads. Threads in a block always run on the same SM and are live at the same time, so they can cooperate through shared memory and __syncthreads(); different blocks may run in any order."
    context: "L7 uses a block's resource requirements (thread count, shared memory) to explain the GPU's block scheduler."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs149-gpu-architecture-cuda)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

> **Version note**: This post is based on the slides for Lecture 7 of [Stanford CS149](https://gfxcourses.stanford.edu/cs149/fall25), Fall 2025 (October 14), [GPU Architecture and CUDA Programming](https://gfxcourses.stanford.edu/cs149/fall25/lecture/gpuarch/) ([PDF](https://gfxcourses.stanford.edu/cs149/fall25content/media/gpuarch/07_gpuarch.pdf), 74 pages), checked on 2026-09-30. Fall 2025 recordings are on Canvas only; the substitute the official homepage points to is the [2023 Lecture 7 video](https://www.youtube.com/watch?v=qQTDF0CBoxE). I did not compare the two versions segment by segment, so the 2025 slides are the authority here. Access grade **A3**: full slides are public, and only an older recording is available.

**Series**: Previous: [PA2: Task Graph Scheduling](/posts/ai/2026-09-30-cs149-pa2-task-graph-scheduling-en) | Next: [Lecture 8: Data-Parallel Thinking](/posts/ai/2026-09-30-cs149-data-parallel-thinking-en) | [Series overview](/posts/ai/2026-09-30-cs149-course-overview-en)

The first eight posts stayed on the CPU. This lecture moves to the GPU, but the GPU is not really new. The second slide brings back the "basic GPU architecture" diagram from [Lecture 2](/posts/ai/2026-09-30-cs149-multicore-simd-multithreading-en): many cores, SIMD execution inside each core, and several threads interleaved on each core. A GPU pushes all three kinds of parallelism to a very large scale at once.

So the question for this lecture is concrete: **how do CUDA's grid, block, and thread abstractions land on GPU hardware?** Mapping DNNs onto GPUs waits for [the Lecture 9 post](/posts/ai/2026-09-30-cs149-dnn-on-gpus-en). This post covers only the execution model.

## Course video sources

This article uses Fall 2025 materials. The public Fall 2023 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=qQTDF0CBoxE
title: Stanford CS149 2023 Lecture 7 video
```

Original videos: [Stanford CS149 2023 Lecture 7 video](https://www.youtube.com/watch?v=qQTDF0CBoxE)

Course and recording entries:

- [CS149 2023 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [Official course / lecture source](https://gfxcourses.stanford.edu/cs149/fall25/lecture/gpuarch/)

## From drawing triangles to running any program

The slides open with some history, because the GPU's design trade-offs come from its original job: real-time 3D graphics.

The graphics workload fits in one sentence. For each triangle, find where it lands on screen; for each pixel it covers, compute the surface color at that point. The code that computes the color is a shader. The slides show a GLSL shader and note that the syntax doesn't matter. What matters is that **a shader is a pure function invoked on a stream of inputs**. Every pixel is independent, which is where the many SIMD, multithreaded cores come from.

Around 2001–2003, researchers noticed this looked a lot like the data parallelism of 1990s supercomputers. That gave rise to the GPGPU hack: to run a function on every element of a 512×512 array, set the output image to 512×512, draw two triangles that exactly cover the screen, and let the fragment shader run once per pixel. Stanford's graphics lab wrapped this in Brook (2004), a stream programming language whose compiler emitted graphics commands.

The turning point was NVIDIA's Tesla architecture in 2007. It offered the first "compute mode" interface that bypassed the graphics pipeline: an application could allocate buffers in GPU memory, copy data back and forth, hand the GPU a kernel, and say "run N instances of this SPMD-style." The slides point out something amusing: this `launch(myKernel, N)` is far simpler than the graphics call `drawPrimitives()`. CUDA arrived the same year with a stated design goal: **keep the abstraction distance low**, so CUDA's abstractions track the GPU's capabilities and performance characteristics closely.

## CUDA's abstractions: launch a big batch of threads

The slides flag a naming trap. A "CUDA thread" is a logical thread of control, like a pthread, but its implementation is completely different. The lecture reveals how only at the end, so keep it in mind.

A CUDA program has two halves:

- **Host code**: an ordinary C/C++ program running serially on the CPU.
- **Device code**: kernel functions marked `__global__`, executed SPMD-style on the GPU.

The host bulk-launches a whole grid with the `<<<numBlocks, threadsPerBlock>>>` syntax. The slide example adds two 12×6 matrices with 4×3 blocks of 12 threads each: 6 blocks, 72 CUDA threads in total. Each thread computes its position in the grid from `blockIdx`, `blockDim`, and `threadIdx`. IDs can have up to three dimensions, which suits problems that are naturally N-D.

One difference from graphics shaders: the number of CUDA threads is **written in the program**, not set by the size of the data. When the data is 11×5 and not a multiple of the block size, the host rounds the block count up and the kernel adds `if (i < Nx && j < Ny)` to avoid going out of bounds.

### Memory: separate address spaces

CUDA's memory model is a **distributed address space**. Host memory and device global memory are different spaces. You allocate on the device with `cudaMalloc` and move data with `cudaMemcpy`. The `deviceA` pointer the host holds cannot be dereferenced there, because it doesn't point into the host's address space. The slide asks: what does `cudaMemcpy` remind you of? The slides leave it open. My reading is that it resembles the message-passing model from [Lecture 6](/posts/ai/2026-09-30-cs149-locality-communication-en): data is explicitly sent from one address space to another.

Kernels see three kinds of device address space:

| Address space | Who can read and write it |
|---|---|
| per-thread private | one thread |
| per-block shared memory | all threads in the block |
| device global memory | all threads |

In the slides' words, the different address spaces reflect different regions of locality in the program, and that matters a lot for how efficiently a GPU runs the code.

### 1D convolution: what shared memory saves

The running example is `output[i] = (input[i] + input[i+1] + input[i+2]) / 3`, with 128 threads per block and one output per thread.

Version 1 has each thread read its three values straight from global memory. Version 2 first has all threads in the block cooperate to load the block's 130 inputs into `__shared__ float support[130]`, calls `__syncthreads()` to wait until everyone is done, and then reads from shared memory. The slides do the arithmetic: global memory loads drop from 3 × 128 to 130.

The example also introduces CUDA's synchronization tools:

- `__syncthreads()`: a barrier within a block.
- Atomic operations such as `atomicAdd`, on both global and shared memory.
- An implicit barrier across all threads when the kernel returns.

## How the abstractions land on hardware

Next the slides ask a good question. With N = 1024×1024, this kernel launches over a million CUDA threads in more than eight thousand blocks. Does the system really allocate a stack for every thread and a copy of the shared variables for every block?

Creating a pthread allocates a stack and a control block for the OS scheduler. GPUs don't work that way.

### A compiled kernel carries its resource requirements

A compiled CUDA device binary holds the instructions plus the kernel's resource needs: 128 threads per block, some number of bytes of local data per thread, and 130 floats (520 bytes) of shared memory per block.

Another observation: a CUDA program never mentions the number of cores. The slides say a CUDA launch is similar in spirit to a forall loop in the data-parallel model. The same program should run unmodified on a 6-core mid-range GPU and a 16-core high-end one.

So the GPU has a dedicated hardware block scheduler that **dynamically** assigns blocks to cores while respecting each block's resource needs. This is a pattern the course keeps returning to: a pool of workers and a pile of tasks. The slides list other instances: ISPC's task implementation (one pthread per hyper-thread, kept alive for the rest of the program) and a web server's thread pool. It is also exactly what you just built in [PA2](/posts/ai/2026-09-30-cs149-pa2-task-graph-scheduling-en).

The scheduling rests on one major CUDA assumption: **thread blocks can execute in any order, with no dependencies between blocks.**

### V100 SMs, warps, and SIMT

The slides use the NVIDIA V100 as the concrete case. One SM (streaming multiprocessor) is split into 4 sub-cores. Each sub-core has its own warp selector and fetch/decode, plus 16 fp32 SIMD units, 16 int units, 8 fp64 units, tensor cores, and load/store units.

The key word here is **warp**. Threads 0–31 of a block form one warp, 32–63 the next, and so on, so a 256-thread block becomes 8 warps. Each sub-core can schedule and interleave up to 16 warps.

When the threads of a warp run the same instruction, they execute together SIMD-style, which NVIDIA calls **SIMT**. When the 32 threads take different paths, divergence costs performance. This resembles an [ISPC gang](/posts/ai/2026-09-30-cs149-latency-bandwidth-ispc-en), with a difference the slides footnote: the GPU hardware **checks at run time** whether 32 independent threads share an instruction. CUDA programs are not compiled to SIMD instructions the way ISPC gangs are.

One more detail: a sub-core has only 16 fp32 units and a warp has 32 threads, so one fp32 instruction takes two clocks to run for the whole warp.

The SM as a whole:

- 64 KB of registers per sub-core, 256 KB per SM, divided among up to 64 warps.
- 128 KB shared between shared memory and the L1 cache.
- Each clock, each sub-core picks one runnable warp from its 16 and runs that warp's next instruction.

The whole V100:

| Item | Value |
|---|---|
| Clock | 1.245 GHz |
| SMs | 80 |
| fp32 mul-add ALUs | 80 × 4 × 16 = 5,120 |
| Peak | 12.7 TFLOPs (mul-add counted as 2 flops) |
| Max interleaved warps | 80 × 64 = 5,120 (163,840 CUDA threads) |
| L2 cache | 6 MB |
| HBM | 16 GB, 900 GB/s |

Back to the convolution kernel: a 128-thread block runs as 4 warps, and all warps of a block are placed on the same SM so they can communicate through shared memory with high bandwidth and low latency.

### Resources decide how many blocks fit on an SM

The slides walk through scheduling on an imaginary two-core GPU. Each core holds execution contexts for 384 threads (12 warps) and 1.5 KB of shared memory. The kernel launches 1,000 blocks, each needing 128 threads and 520 bytes of shared memory.

The scheduler puts block 0 on core 0, block 1 on core 1, block 2 back on core 0, and then a third block doesn't fit on a core. There are enough execution contexts (384 threads is room for three 128-thread blocks). Shared memory is the limit: 3 × 520 bytes exceeds 1.5 KB. After that, whenever a block finishes and frees its resources, the scheduler slots in the next one.

This walkthrough turns a concept people often treat as an incantation into something concrete: **the number of blocks an SM runs at once is set by whichever resource runs out first**. Registers per thread and shared memory per block directly limit how many warps can be interleaved, and therefore how much memory latency can be hidden (the multithreading argument from Lecture 2).

## Two kinds of semantics, don't mix them up

The final section is what the lecture is really testing. The slides say that if you understand the next few examples, you really understand how CUDA programs run on a GPU, and you have a good handle on the course's work-scheduling issues so far.

**Why must CUDA allocate execution contexts for every thread in a block at once?** Suppose a block has 256 threads but the core holds only 128. Why not run threads 0–127 to completion and then 128–255? Because threads in a block can depend on each other, and the simplest case is `__syncthreads()`. The first 128 threads would wait at the barrier for the other 128, which would never start. So CUDA's semantics are: **threads in the same block really are live at the same time, and any runnable thread will eventually run.**

**Can blocks use atomics?** Yes. In the slides' histogram example, every thread does `atomicAdd` on `counts[10]` in global memory. The slides stress that they never claimed blocks are guaranteed independent, only that CUDA reserves the right to schedule them in any order. Here the atomics provide mutual exclusion and nothing more, so scheduling freedom is untouched and the code is valid.

**What about block 0 waiting for block 1 to set a flag?** Suppose the GPU fits only one block at a time, and block 1 spins on `while (atomicAdd(&myFlag, 0) == 0)` waiting for block 0. If the system runs block 1 first, it holds the core forever and block 0 never gets scheduled. That is the price of "any order": blocks cannot have this kind of waiting dependency.

A bonus slide shows the **persistent thread** style. The programmer computes how many blocks the GPU can hold at once (`80 * (32*64/128)` on a V100), launches exactly that many, and has each block loop, grabbing work from a global counter. That bypasses the hardware block scheduler and does work assignment in the application. The cost is that the program now assumes things about the GPU implementation. The slides' verdict is one word: "Ugg!"

In one table:

| Level | Semantics | Allowed cooperation |
|---|---|---|
| Between blocks in a grid | Logically concurrent, any order (a lot like ISPC tasks) | Atomics for mutual exclusion yes; waiting on each other no |
| Between threads in a block | Really live at once; SPMD shared-address-space programming (like an ISPC gang) | shared memory, `__syncthreads()`, atomics |
| Warp | Implementation detail, not in the programming model | Governs SIMD utilization for performance |

The slides close by saying the differences between these execution models are subtle but essential, and that whenever you meet a parallel programming system you should ask which semantics it uses.

## What the lecture deliberately skips

- How the hardware implements the graphics pipeline, which the slides leave to CS248A or CS348K. Most of that fixed-function hardware is more or less off when running CUDA.
- The hundreds of teraflops in the SM's tensor cores, which the slides defer to later in the quarter. In this series that means [Lecture 9, DNNs on GPUs](/posts/ai/2026-09-30-cs149-dnn-on-gpus-en), and Lecture 10 on hardware specialization.

## How to self-study it

1. Read the four questions on the "The plan" slide of the [PDF](https://gfxcourses.stanford.edu/cs149/fall25content/media/gpuarch/07_gpuarch.pdf): Is CUDA a data-parallel model? Shared address space or message passing? Can you draw analogies to ISPC instances, tasks, and pthreads? Answer them after finishing the lecture.
2. Rerun the two-core scheduling walkthrough with new parameters. If a block needs 256 threads and only 100 bytes of shared memory, how many blocks fit per core? Which resource is the limit now?
3. For hands-on practice, move on to [PA3](/posts/ai/2026-09-30-cs149-pa3-w2-cuda-renderer-en), whose first task is porting PA1's SAXPY to CUDA.

One thing you can do tonight: copy down the `myFlag` example, write one sentence explaining why "run block 1 first" deadlocks, and one sentence explaining why the histogram example doesn't.

## Further reading

- The same GPU execution model from the LLM training angle: [CS336 Lecture 5: GPUs Win by Moving Data Less, Not by Making Each Thread Fast](/posts/ai/2026-08-22-cs336-gpu-tpu-en)
- Another course's take on threads, blocks, the memory hierarchy, and tiling: [CMU 11-868 L02–L04 GPU Programming and Acceleration](/posts/ai/2026-09-30-cmu11868-gpu-programming-acceleration-en)
- Course positioning, the five assignments' environment needs, and the 2023 video mapping: [Reading Stanford CS149 (series overview)](/posts/ai/2026-09-30-cs149-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [Stanford CS149 Fall 2025 homepage](https://gfxcourses.stanford.edu/cs149/fall25) — lecture dates and video policy
- [Lecture 7: GPU Architecture and CUDA Programming (per-slide web version)](https://gfxcourses.stanford.edu/cs149/fall25/lecture/gpuarch/) — the source for everything in this post
- [Lecture 7 slides PDF](https://gfxcourses.stanford.edu/cs149/fall25content/media/gpuarch/07_gpuarch.pdf) — 74 pages, including V100 specs and the scheduling walkthrough
- [Stanford CS149 2023 Lecture 7 video](https://www.youtube.com/watch?v=qQTDF0CBoxE) — the older substitute recording the homepage points to
- [CS149 2023 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp) — all 19 recordings from 2023
- [NVIDIA CUDA C++ Programming Guide](https://docs.nvidia.com/cuda/cuda-c-programming-guide/) — the CUDA reference the PA3 README recommends
