---
title: "CS149 Lecture 8: Data-Parallel Thinking, Replacing Locks with Map, Scan, and Sort"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, ai-course, stanford, gpu, cuda, parallelism]
lang: en
series:
  name: "Reading Stanford CS149"
  order: 10
tldr: "Lecture 8 asks you to switch mental models: stop thinking about what each worker does and write algorithms as operations on sequences, such as map, fold, scan, segmented scan, gather/scatter, sort, and groupBy. These primitives have efficient parallel implementations, and they turn irregular parallelism into regular parallelism and fine-grained synchronization into coarse synchronization. The price is extra passes over the data, so they are bandwidth hungry."
description: "A guide to Stanford CS149 (Fall 2025) Lecture 8: why GPUs need parallelism on the order of a hundred thousand threads, when map and fold can run in parallel, the O(N lg N) and work-efficient scan algorithms, a CUDA scan layered by warp and block, segmented scan and sparse matrix multiplication, gather/scatter, and using sort instead of locks to build a particle grid and a histogram."
draft: false
glossary:
  - term: "prefix sum"
    aliases: ["scan", "inclusive scan", "exclusive scan"]
    definition: "A running total over a sequence: element i of an inclusive scan is the sum of the first i+1 elements, and element i of an exclusive scan is the sum of the first i (excluding itself). Any associative binary operator works in place of addition; the general operation is called scan."
    context: "The core primitive of CS149 L8; PA3 asks you to implement exclusive scan in CUDA."
  - term: "segmented scan"
    definition: "Several scans run at once over contiguous segments of one sequence, with segment starts marked in a flag array. It lets irregular 'sequence of sequences' data be processed in a regular, data-parallel way."
    context: "L8 uses it for sparse matrix multiplication and for implementing a scatter that would otherwise need atomics."
  - term: "work-efficient"
    definition: "A parallel algorithm whose total work is of the same order as the best sequential algorithm. The simple parallel scan does O(N lg N) operations; the work-efficient one does O(N)."
    context: "L8 notes that inside a 32-wide SIMD warp the work-efficient version needs more instructions, because its SIMD utilization is low."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs149-data-parallel-thinking)

**Video status: Related supplementary video included; the original lecture recording has not been verified.** [Source details](#course-video-sources)

> **Version note**: This post is based on the slides for Lecture 8 of [Stanford CS149](https://gfxcourses.stanford.edu/cs149/fall25), Fall 2025 (October 16), [Data-Parallel Thinking](https://gfxcourses.stanford.edu/cs149/fall25/lecture/dataparallel/) ([PDF](https://gfxcourses.stanford.edu/cs149/fall25content/media/dataparallel/08_dataparallel.pdf), 51 pages), checked on 2026-09-30. Fall 2025 recordings are on Canvas only; the substitute the official homepage points to is the [2023 Lecture 8 video](https://www.youtube.com/watch?v=Ba3TqxSgnTk). I did not compare the two versions segment by segment, so the 2025 slides are the authority here. Access grade **A3**.

**Series**: Previous: [Lecture 7: GPU Architecture and CUDA](/posts/ai/2026-09-30-cs149-gpu-architecture-cuda-en) | Next: [PA3 CUDA Circle Renderer + Written 2](/posts/ai/2026-09-30-cs149-pa3-w2-cuda-renderer-en) | [Series overview](/posts/ai/2026-09-30-cs149-course-overview-en)

Up to now the course has taught you to think about parallel programs in terms of what workers do and how to assign work to them. The first slide of Lecture 8 says today is different: **describe algorithms as operations on sequences of data**.

The list on the slide is map, filter, fold/reduce, scan/segmented scan, sort, groupBy, join, and partition/flatten. The claim is a single sentence: these operations have high-performance parallel implementations, so programs written with them often run efficiently on parallel machines. It carries an asterisk: **if you can avoid being bandwidth bound**.

## Course video sources

This article uses Fall 2025 materials. The official Fall 2025 course page states that this year's lecture videos cannot be distributed to the public and points to a 2023 YouTube playlist instead. The Fall 2023 recording below covers a closely related topic but its content may differ from the 2025 lecture, and the original recording has not been verified. Checked: 2026-10-10.

```youtube
url: https://www.youtube.com/watch?v=Ba3TqxSgnTk
title: Stanford CS149 I Parallel Computing I 2023 I Lecture 8 - Data-Parallel Thinking
```

Original videos: [Stanford CS149 I Parallel Computing I 2023 I Lecture 8 - Data-Parallel Thinking](https://www.youtube.com/watch?v=Ba3TqxSgnTk)

Course and recording entries:

- [CS149 2023 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [Official course / lecture source](https://gfxcourses.stanford.edu/cs149/fall25/lecture/dataparallel/)

## Why so much parallelism

The slides bring back the V100 numbers from [the previous lecture](/posts/ai/2026-09-30-cs149-gpu-architecture-cuda-en): 80 SMs and up to 163,840 interleaved CUDA threads. The conclusion is on the same slide. Programs that don't expose lots of parallelism, and don't have high arithmetic intensity, won't run efficiently on GPUs.

High-core-count machines, cloud clusters, and SIMD plus multithreaded cores all demand lots of parallelism, and GPUs demand the most. The key to finding it is understanding **dependencies**. Where there are none, there is room for parallel execution.

## Sequences, map, and fold

The data-parallel model organizes computation as operations on sequences. The slides' modern example is NumPy's `C = A + B`. They also list Scala lists, Pandas DataFrames, PyTorch/JAX tensors (N-D sequences), and Haskell's `seq T`.

Sequences differ from arrays in one important way: programs **access elements only through specific operations**, never by direct indexing. That restriction is exactly what frees the implementation to parallelize.

**Map** applies a side-effect-free unary function to every element and produces a sequence of the same length. The slides show Haskell, C++'s `std::transform`, and JAX's `vmap`. Because `f` has no side effects, the order of application doesn't change the result. An implementation can split the sequence into P pieces, map each in parallel, and concatenate the results.

**Fold** threads an accumulated value through the elements with a binary function. To run it in parallel you also need a combiner function to merge the partial results from each piece. If `f` is itself an associative `(b,b) -> b` operator, no separate combiner is needed.

## Scan: the course's favorite primitive

The definition of scan, given an associative binary operator ⊕ with identity I:

- Inclusive scan: `[a0, a0⊕a1, a0⊕a1⊕a2, ...]`
- Exclusive scan: `[I, a0, a0⊕a1, ...]`, where element i excludes itself

With ⊕ as addition, inclusive scan is called a prefix sum. The sequential version is one loop, `out[i] = op(out[i-1], in[i])`, and looks entirely sequential. The slides then show three ways to parallelize it, and each makes a different trade-off.

### The simple parallel version: more work

The first version has every element add the value 1, 2, 4, 8, and so on positions away, finishing in lg N steps. The slides label two numbers: **work O(N lg N), span O(lg N)**. Span is the longest chain of sequential steps. The slides' verdict: inefficient compared to the sequential algorithm.

### The work-efficient version: up-sweep and down-sweep

The second version has two phases. The up-sweep adds pairs going up a binary tree; the down-sweep pushes the partial sums back down. Total work drops to O(N) and span stays O(lg N). The slides leave two question marks next to it: what are the constants hidden in those O's, and what about locality? This pseudocode later reappears verbatim in the [PA3](/posts/ai/2026-09-30-cs149-pa3-w2-cuda-renderer-en) README.

### With only two cores

The third version is the most down to earth. With two cores, each scans its half sequentially, and then the total of the first half, `a0-7`, is added as a base to every element of the second half. Work is O(N) with a constant of only 1.5, and all access is to contiguous memory, so spatial locality is very high. The slides add a caveat: on large machines with non-uniform memory access (NUMA), the cross-region access costs more, but on a small multi-core system it probably costs the same.

Put side by side, the three versions teach one lesson: **the parallelism in the problem is not the parallelism you should use**.

### Scan in CUDA: different algorithms at different levels

The slides then write a scan within a warp (`scan_warp`): 32 threads take 5 steps (2⁵ = 32), and in each step threads with a large enough lane index add the value `shift` positions away. This is the first, O(N lg N), algorithm.

The slides explain why the work-efficient version isn't used here. Inside a 32-wide SIMD unit it leaves many lanes idle, so SIMD utilization is low and it **needs more than twice as many instructions**.

Larger arrays are built in layers:

1. In a 128-element block, 4 warps each scan 32 elements.
2. The last thread of each warp (lane 31) writes its segment's total into shared memory.
3. Warp 0 scans those 4 totals, giving each segment's base.
4. The other warps add their base to their elements.

The slides say PA3 provides similar `scan_block` code. One level up, a million-element scan takes three kernel launches: each block scans its piece, the block totals are scanned, and the bases are added back to each block. Beyond a million elements, the second phase must itself be split across blocks.

The summary of the scan section is worth copying down:

- **Parallelism**: the algorithm has O(N) parallel work, but efficient implementations use only as much parallelism as it takes to fill the machine. The goal is to reduce work, communication, and synchronization.
- **Locality**: multi-level implementations match the memory hierarchy; in CUDA the per-block level runs in shared memory.
- **Heterogeneity**: different levels of the machine use different algorithms, one within a warp and another across threads. A low-core-count CPU relies mostly on sequential scan.

## Segmented scan: making the irregular regular

Many problems are sequences of sequences: for each vertex in a graph, visit each of its edges; for each particle in a simulation, check each neighbor within some radius; for each document, process each of its words. There are two levels of parallelism to exploit, but they are irregular. Edge counts per vertex and words per document can vary enormously.

Segmented scan runs scans over several contiguous segments at once. The slide example: an exclusive additive segmented scan of `A = [[1,2],[6],[1,2,3,4]]` gives `[[0,1],[0],[0,1,3,6]]`. The representation is a flag array that marks each segment start with 1:

```
flag: 1 0 0 1 0 0 0 0
data: 1 2 3 4 5 6 7 8
```

It also has a work-efficient up-sweep/down-sweep version. Each step checks the flags, and the down-sweep needs to keep a copy of the original flags.

### Gather, scatter, and sparse matrix multiplication

Two more key operations:

- `gather(index, input, output)`: `output[i] = input[index[i]]`
- `scatter(index, input, output)`: `output[index[i]] = input[i]`

Hardware support varies. The slides say AVX2 (2013) has SIMD gather but no scatter, and the scatter instruction arrived with AVX-512. GPUs support both in hardware, though both are still more expensive than loading a contiguous vector.

Combining segmented scan with gather gives sparse matrix-vector multiplication in CSR format. Rows have different numbers of non-zeros, so parallelizing directly over rows makes wide SIMD hard to fill. The slides' five steps:

1. Gather the matching elements of x according to `cols`.
2. Map: multiply each non-zero value by its gathered x.
3. Build a flag array from `row_starts`.
4. Run an inclusive segmented scan over the products.
5. Take the last element of each segment; that is y.

Every step is a regular data-parallel operation, and the flags absorb all the irregularity.

### A scatter that needs atomics, done with sort

When the index has duplicates, scatter becomes `output[index[i]] = atomicOp(output[index[i]], input[i])`. The slides show an atomic-free alternative: sort the input by index, mark the start of each run of equal indices, then run a segmented scan over each run.

## Sort instead of locks: the particle grid

The last big example places a million particles into a 16-cell uniform grid by 2D position. N-body codes use this structure to find neighbors within radius R. The slides compare five solutions in turn:

| Solution | Approach | Problem |
|---|---|---|
| 1 | One CUDA thread per particle, appending to the cell's list under one global lock | Thousands of threads contend for one data structure |
| 2 | One lock per cell | About 16× less contention for uniformly distributed particles, but still locks |
| 3 | Parallelize over cells, each scanning every particle | Only 16 tasks, far too little parallelism; 16× the work of the sequential version |
| 4 | Each block builds its own partial grid, merged at the end | Synchronization happens on block-local shared memory and is cheaper, but merging costs extra work and N grids cost extra memory |
| 5 | Map each particle to its cell → sort by cell → each element compares its cell with the previous one to find each cell's start and end | No fine-grained synchronization and lots of parallelism, at the cost of a sort and extra passes over the data |

The histogram is a small exercise in the same pattern: compute bin counts in parallel using only map and sort. Map each element to a bin id, sort, find where each bin starts in the sorted result, and get each bin's size by subtracting its start from the next non-empty bin's start. The slides flag an edge case that is easy to miss: when the next bin is empty, you have to search forward to the first non-empty one.

## Summary: what you gain, what you pay

The two summary slides:

- Data-parallel thinking expresses algorithms as simple operations on large data collections, operations that are usually widely parallelizable and efficiently implemented.
- It turns **irregular parallelism into regular parallelism** and **fine-grained synchronization into coarse synchronization**.
- But most solutions need multiple passes over the data, so they are **bandwidth hungry**.
- These primitives underpin many parallel and distributed systems today: CUDA's Thrust, Pandas, JAX, and Apache Spark / Hadoop.

That last point ties the lecture straight to AI engineering. The tensor operations you write in PyTorch or JAX are, at heart, the sequence operations this lecture describes. Whether they run fast depends on how those primitives are implemented underneath and on whether you are bandwidth bound (the arithmetic intensity argument from [Lecture 6](/posts/ai/2026-09-30-cs149-locality-communication-en)).

## How to self-study it

1. On paper, run both the simple and the work-efficient scan on 8 elements and count the additions each performs, to check the O(N lg N) versus O(N) difference.
2. Work out the exclusive segmented scan of the flag example `[[1,2,3],[4,5,6,7,8]]` by hand.
3. Then read Part 2 of [PA3](/posts/ai/2026-09-30-cs149-pa3-w2-cuda-renderer-en): implementing `find_repeats` with exclusive scan is a direct application of this lecture.

One thing you can do tonight: pick a piece of code you've written that accumulates under a lock or with atomics, try rewriting it as map → sort → find segment starts, and note how many extra passes over the data it takes.

## Further reading

- An assignment that implements map, zip, reduce, and matmul in CUDA: [CMU 11-868 Assignment 1: Writing MiniTorch's map, zip, reduce, and matmul in CUDA](/posts/ai/2026-09-30-cmu11868-hw1-cuda-programming-en)
- Why GPUs dread moving data: [CS336 Lecture 5: GPUs Win by Moving Data Less, Not by Making Each Thread Fast](/posts/ai/2026-08-22-cs336-gpu-tpu-en)
- Series overview and the 2023 video mapping (the 2023 Lecture 9 on Spark has no Fall 2025 counterpart): [Reading Stanford CS149 (series overview)](/posts/ai/2026-09-30-cs149-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Official sources only have Fall 2023 recordings, so the status is now related supplementary video only, and video titles use the original titles.

## References

- [Stanford CS149 Fall 2025 homepage](https://gfxcourses.stanford.edu/cs149/fall25) — lecture dates and video policy
- [Lecture 8: Data-Parallel Thinking (per-slide web version)](https://gfxcourses.stanford.edu/cs149/fall25/lecture/dataparallel/) — the source for everything in this post
- [Lecture 8 slides PDF](https://gfxcourses.stanford.edu/cs149/fall25content/media/dataparallel/08_dataparallel.pdf) — 51 pages
- [Stanford CS149 2023 Lecture 8 video](https://www.youtube.com/watch?v=Ba3TqxSgnTk) — the older substitute recording the homepage points to
- [CS149 2023 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp) — all 19 recordings from 2023
- [stanford-cs149/asst3 README](https://github.com/stanford-cs149/asst3) — the assignment that reuses this lecture's work-efficient scan pseudocode
- [NVIDIA CCCL (the repo that now hosts Thrust)](https://github.com/NVIDIA/cccl) — home of Thrust, the CUDA data-parallel primitives library named in the summary slide
