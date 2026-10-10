---
title: "CMU 11-868 Assignment 1: Writing MiniTorch's map, zip, reduce, and matmul in CUDA"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, ai-course, cmu, cuda, gpu, homework]
lang: en
series:
  name: "Reading CMU 11-868 LLM Systems"
  order: 3
tldr: "The first 11-868 assignment has you write four CUDA kernels in src/combine.cu (map 15, zip 25, reduce 25, matmul 30 points), wire them into MiniTorch's Python backend, and finish with a 5-point integration test. Shared-memory optimizations for reduce and matmul are marked Optional. The assignment page says plainly that you need a GPU, and grading uses private test cases."
description: "A guide to CMU 11-868 LLM Systems (Spring 2026) Assignment 1: the five problems and their points, strides-based indexing, the compile-and-test commands for each problem, the Optional shared-memory optimizations, the official schedule (out 1/14, due 1/28), the GPU you need, and where outside readers get stuck. No solutions."
draft: false
glossary:
  - term: "CUDA kernel"
    aliases: ["kernel", "__global__ function"]
    definition: "A function that runs in parallel across many threads on an NVIDIA GPU, declared with __global__ and launched from the CPU with a grid/block configuration."
    context: "Each of the four problems in Assignment 1 asks for one kernel: mapKernel, zipKernel, reduceKernel, and MatrixMultiplyKernel."
  - term: "strides"
    aliases: ["stride"]
    definition: "A tuple of integers describing how a multidimensional tensor is laid out in one-dimensional memory: moving one step along dimension k skips strides[k] elements of the underlying array."
    context: "The assignment page explains it as A[i, j] = Adata[i * strides[0] + j * strides[1]]; all four kernels depend on it to compute positions."
  - term: "shared memory"
    aliases: ["__shared__"]
    definition: "A small, fast on-chip memory shared by all threads in a GPU block, often used to stage data that will be read repeatedly."
    context: "Assignment 1 lists tree-based reduction and tiled matmul as Optional optimizations; both rely on shared memory."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu11868-hw1-cuda-programming)

> **Version note**: This post follows the Spring 2026 offering of [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/). The assignment page lives on the cross-semester [homework site](https://llmsystem.github.io/llmsystemhomework/assignment_1/) and the starter code in [llmsys_hw1](https://github.com/llmsystem/llmsys_hw1), both as seen on 2026-09-30. The repo's last commit is dated 2026-01-30, two days after the spring deadline, and Fall 2026 has not touched it since. Access level **A3**: the problems, starter code, and local tests are public; what you cannot get is Canvas submission, the private test cases, and the school's PSC GPUs.

**Series navigation**: Previous [L02–L04 GPU programming model and acceleration](/posts/ai/2026-09-30-cmu11868-gpu-programming-acceleration-en) | Next [L05 Deep learning frameworks and automatic differentiation](/posts/ai/2026-09-30-cmu11868-dl-frameworks-autodiff-en) | [Series overview](/posts/ai/2026-09-30-cmu11868-llm-systems-overview-en)

The previous post covered threads, blocks, and the memory hierarchy. This one turns those ideas into an assignment you hand in. The goal, stated in the page's first paragraph, is to write high-performance CUDA kernels for tensor operations and connect them to MiniTorch through a CUDA backend.

[MiniTorch](https://llmsystem.github.io/llmsystemhomework/) is the teaching framework shared by all seven assignments. The homework site says it comes from Sasha Rush's educational framework, extended by this course to run real CUDA kernels. The four kernels you write here stay with you: the first step in Assignment 2's README is copying your Assignment 1 `src/combine.cu` over.

This post covers only the problem structure, points, required resources, and where outside readers get stuck. **It does not provide solutions to any problem.**

## Course video sources

This article follows official notes, slides, or assignments. This check of the official public pages did not verify a public recording for the material covered here; it does not establish that no recording exists.

Course and recording entries:

- [cmu-11-868-llm-systems — official course materials and recording index](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)

## Where it sits in the course

The official schedule differs from this series' reading order. The [Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) releases HW1 on 1/14, the day of "GPU Programming Basics 1", and makes it due 1/28, the day of L05 on frameworks and autodiff. Enrolled students write this assignment while attending L02–L04. This series places it after all three GPU lectures because the reduce and matmul hints lean directly on L04's tiling and memory-access ideas.

Recitation 1 on 1/16 was "PSC Guidelines, Simple CUDA Demo", and its [slides](https://docs.google.com/presentation/d/1v5IT8XZeWZ4FIlQzRLmEfcZv-kmfAyBIFyqYJkR5Lk8/edit?usp=sharing) are public on Google Slides. The assignment page also points you to the in-lecture CUDA examples and to [cuda_acceleration_demo](https://github.com/llmsystem/llmsys_code_examples/tree/main/cuda_acceleration_demo), which contains files such as `matmul_tile.cu` and `sparse_mv.cu`.

## You only edit two files

The layout on the assignment page is short:

| File | Role |
|---|---|
| `src/combine.cu` | Implementations of the four CUDA kernels (Problems 1–4) |
| `minitorch/cuda_kernel_ops.py` | Connects the Tensor backend to the CUDA kernels; each problem has its own integration piece |

The places to fill in are marked `BEGIN HW1_x` and `END HW1_x`. Every change to `combine.cu` must be recompiled with `nvcc` into `minitorch/cuda_kernels/combine.so`. The page repeats this reminder in every problem, and it is also the first FAQ entry: if tests you believe are correct fail, check that you recompiled.

## Problems and points

Five problems, 100 points in total:

| Problem | What you do | Points | Local test |
|---|---|---|---|
| P1 Map | Apply a unary function elementwise, e.g. `f(x) = x²` on `[1, 2, 3]` gives `[1, 4, 9]` | 15 | `-k "cuda_one_args"` |
| P2 Zip | Apply a binary function elementwise to two tensors; Part A kernel 20, Part B integration 5 | 25 | `-k "cuda_two_args"` |
| P3 Reduce | Reduce along a given dimension, e.g. summing `[[1,2,3],[4,5,6]]` along dim 1 gives `[6, 15]`; Part A kernel 20, Part B integration 5 | 25 | `-k "cuda_reduce"` |
| P4 MatMul | Matrix multiplication; Part A kernel 25, Part B integration 5 | 30 | `-k "cuda_matmul"` |
| P5 Integration | Run all CUDA tests | 5 | `-k "cuda"` |

Design points worth knowing before you start:

**Strides are the shared hurdle.** The page devotes a whole section to it: the usual row-major form is `A[i, j] = Adata[i * cols + j]`, while MiniTorch uses `A[i, j] = Adata[i * strides[0] + j * strides[1]]`. The last map hint is "consider the stride-based indexing for multidimensional tensors", and an FAQ entry is dedicated to strides, suggesting you practice on small 2D examples first.

**The hints describe the most basic parallelization.** For map and zip, the hint is one thread per output element plus bounds checking. The basic reduce has each block compute one output element; the hard part is working out the step size from `reduce_dim` and the strides. The basic matmul has each thread compute one cell of the output matrix; the page gives pseudocode and points to PMPP Section 4.3.

**Shared-memory optimizations are Optional.** "Optimized Reduction" has threads in a block load data into shared memory and then do a tree-based reduction. The page reminds you to work out how the same approach applies to ReduceMultiply and ReduceMax, and how to reduce along a given axis of a contiguous array, and it cites NVIDIA's [reduction slides](https://developer.download.nvidia.com/assets/cuda/files/reduction.pdf). "Shared Memory Tiling" for matmul assigns each block an `[S, S]` chunk of output, following PMPP Section 5.4. Both come with pseudocode, but the points table does not award separate credit for them.

**P5 has more test cases than the earlier problems.** The page says the integration test is more comprehensive; if everything before it passes and this fails, go back and review your implementations.

**Submission and grading.** Zip the whole `llmsys_hw1` directory and upload it to Canvas. The code is compiled automatically and graded with **private test cases**. Local pytest is only a self-check; passing it does not guarantee full marks.

## What compute you need

The Prerequisites line on the page is one sentence: "You'll need a GPU". It recommends the PSC (Pittsburgh Supercomputing Center) account the school provides for this course, with a sign-in guide, and allows AWS or other cloud GPUs without guaranteed support. Setup uses `uv` to create a Python 3.12 environment; on PSC you first request a GPU compute node and load the `cuda/12.4.0` module.

The [Logistics page](https://llmsystem.github.io/llmsystem2026spring/docs/Logistics) adds two things: new users may use Google Colab, and PSC uses job-based scheduling with no guarantee a job starts within any time limit, so submit early.

## Where outside readers get stuck

**No PSC account.** Outside readers need their own NVIDIA GPU or a rented cloud GPU with `nvcc` installed. Without a GPU you cannot complete this assignment.

**The assignment page and the repo README disagree on setup.** As of 2026-09-30, the homework site recommends PSC, `uv`, and `cuda/12.4.0`, while the repo README recommends Google Colab, venv or anaconda, `cuda/12.6.0`, and calls PSC "not necessary". Problems and points match on both; only the environment section differs. The homework site is the safer reference, since the Homework link on the [course homepage](https://llmsystem.github.io/llmsystem2026spring/) points to it.

**The textbook costs money.** The PMPP 4th edition chapters cited in the hints link to O'Reilly through CMU SSO; outside readers need to buy the book or find another route.

**No private tests, no Canvas.** You can self-check only with the repo's `tests/`.

**Late days and errata.** Logistics allows 3 penalty-free late days for the whole semester, then 20% off per additional day. It also rewards bug hunting: find a typo or bug in an assignment, submit a pull request, get it merged, and you earn participation bonus. The llmsys_hw1 commit history reflects this, with a burst of merged PRs from outside contributors in the days before the deadline, including one that fixes a reduce kernel argument type mismatch. If you hit a strange error while self-studying, check the repo's commits and PRs first.

## How to self-study it

1. Confirm you have an NVIDIA GPU that can compile with `nvcc`, set up the environment as the page describes, and pass the `import minitorch` check.
2. Work the page's 2×4 strides example on paper until you can map any multidimensional index to a flat position, then start on map.
3. Go P1 → P4 in order. After each kernel, do the integration right away and run that problem's test. The FAQ says the structure exists precisely so you can test immediately.
4. Once the basic versions pass, decide whether to attempt the Optional shared-memory versions, and measure the speed difference yourself.

One thing you can do tonight: clone [llmsys_hw1](https://github.com/llmsystem/llmsys_hw1), open `src/combine.cu`, and read through the four `BEGIN HW1_x` blocks and their function signatures without writing any code.

## Further reading

- [Stanford CS336: GPUs and TPUs](/posts/ai/2026-08-22-cs336-gpu-tpu-en): why memory movement is often more expensive than compute, from the hardware side
- [Stanford CS336: Kernels and Triton](/posts/ai/2026-08-22-cs336-kernels-triton-en): the same kernel optimization ideas, written in Triton

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [CMU 11-868 Spring 2026 course homepage](https://llmsystem.github.io/llmsystem2026spring/)
- [CMU 11-868 Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) (HW1 release and due dates, Recitation 1)
- [CMU 11-868 Spring 2026 Logistics](https://llmsystem.github.io/llmsystem2026spring/docs/Logistics) (compute, late days, participation bonus)
- [Assignment 1: CUDA Programming](https://llmsystem.github.io/llmsystemhomework/assignment_1/) (homework site, as seen 2026-09-30)
- [llmsystem/llmsys_hw1](https://github.com/llmsystem/llmsys_hw1) (starter code and README)
- [llmsys_code_examples: cuda_acceleration_demo](https://github.com/llmsystem/llmsys_code_examples/tree/main/cuda_acceleration_demo)
- [Recitation 1 slides: PSC Guidelines, Simple CUDA Demo](https://docs.google.com/presentation/d/1v5IT8XZeWZ4FIlQzRLmEfcZv-kmfAyBIFyqYJkR5Lk8/edit?usp=sharing)
- [NVIDIA: Optimizing Parallel Reduction in CUDA](https://developer.download.nvidia.com/assets/cuda/files/reduction.pdf)
- [Programming Massively Parallel Processors, 4th Ed. (O'Reilly)](https://learning.oreilly.com/library/view/programming-massively-parallel/9780323984638/)
