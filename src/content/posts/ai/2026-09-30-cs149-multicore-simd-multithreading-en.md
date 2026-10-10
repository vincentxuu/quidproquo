---
title: "CS149 L2: Multi-Core, SIMD, and Hardware Multithreading, and the Problem Each One Solves"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, ai-course, stanford, performance, hardware, systems]
lang: en
series:
  name: "Reading Stanford CS149"
  order: 2
tldr: "The second lecture of CS149 Fall 2025 takes a loop that computes sin(x) and adds three ideas in turn: spend transistors on more cores (multi-core), let one instruction drive many ALUs (SIMD), and interleave several threads on one core to hide memory latency (hardware multithreading). The first two add compute; the third keeps that compute busy while waiting on memory. The conclusion is three requirements: enough parallel work, groups of work that run the same instructions, and more parallel work than ALUs so latency can be hidden."
description: "A guide to Stanford CS149 (Fall 2025) Lecture 2, 'A Modern Multi-Core Processor (Part I)', based on the official 108-slide deck: why multi-core, SIMD, and hardware multithreading exist and where each falls short, including SIMD divergence from branches, how Kaby Lake reaches 400 GFLOPs, and an exercise on how many threads it takes to reach 100% core utilization. CPU only; GPUs wait for L7. The 2023 L2 recording serves as a supplement."
draft: false
glossary:
  - term: "SIMD"
    aliases: ["single instruction, multiple data"]
    definition: "One instruction is broadcast to many ALUs, which apply the same operation to different data at once; the cost of managing an instruction stream is amortized over many ALUs."
    context: "Idea #2 in CS149 L2; AVX2 processes 8 32-bit floats at a time."
  - term: "hardware multithreading"
    aliases: ["multi-threading"]
    definition: "A core holds execution contexts for several threads at once; when one thread stalls waiting on memory, the core runs instructions from another, hiding the latency."
    context: "Idea #3 in CS149 L2; Intel Hyper-threading is SMT with 2 threads per core."
  - term: "divergent execution"
    aliases: ["divergence"]
    definition: "Work items in the same SIMD group take different instruction paths, such as different sides of an if/else, so some ALU results must be masked off and discarded."
    context: "L2 notes that 8-wide SIMD can drop to 1/8 of peak performance in the worst case."
  - term: "SMT"
    aliases: ["simultaneous multi-threading"]
    definition: "Each clock, the core picks instructions from several threads and issues them to the ALUs together, as opposed to interleaved multithreading, which picks one thread per clock."
    context: "L2 uses Intel Hyper-threading (2 threads per core) as the example."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs149-multicore-simd-multithreading)

> **This post is based on the Fall 2025 edition of [Stanford CS149](https://gfxcourses.stanford.edu/cs149/fall25).** The source is the [108-slide Lecture 2 deck](https://gfxcourses.stanford.edu/cs149/fall25content/media/multicore1/02_basicarch.pdf) (also available [slide by slide on the web](https://gfxcourses.stanford.edu/cs149/fall25/lecture/multicore1/)). The Fall 2025 recording isn't public, so the 2023 L2 recording serves as a supplement. This is post 2 of [Reading Stanford CS149](/posts/ai/2026-09-30-cs149-course-overview-en); the previous post is [L1 Why parallelism, why efficiency](/posts/ai/2026-09-30-cs149-why-parallelism-efficiency-en).

[Last lecture](/posts/ai/2026-09-30-cs149-why-parallelism-efficiency-en) concluded that single cores won't get faster on their own, so performance has to come from parallelism and specialized hardware. This lecture answers the next question: in what ways do modern processors actually run things in parallel?

The slides frame it as "computer architecture from a software engineer's perspective," built around three key concepts. Two concern parallel execution (multi-core and SIMD), and one addresses memory latency (multithreading). Understanding them helps you optimize your own parallel programs and build intuition for which workloads benefit from parallel machines.

Several later slides use GPUs as examples. This series saves GPUs for [post 9, L7 GPU architecture and CUDA](/posts/ai/2026-09-30-cs149-gpu-architecture-cuda-en), so this post covers CPUs only.

## Course video sources

This article uses Fall 2025 materials. The public Fall 2023 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=CKmNpAO5rS4
title: CS149 2023 Lecture 2 video (YouTube)
```

Original videos: [CS149 2023 Lecture 2 video (YouTube)](https://www.youtube.com/watch?v=CKmNpAO5rS4)

Course and recording entries:

- [Official course / lecture source](https://gfxcourses.stanford.edu/cs149/fall25/lecture/multicore1/)

## Opening review

The 2025 version of L2 opens with a review of L1: a program is a list of instructions, superscalar processors find independent instructions and run them in parallel, and then memory latency, stalls, caches, and LRU. The [previous post](/posts/ai/2026-09-30-cs149-why-parallelism-efficiency-en) already covers all of that.

## The running example: computing sin(x)

The whole lecture revolves around one function. For an array of N floats, it computes sin(x) for each element with a Taylor expansion.

```c
void sinx(int N, int terms, float* x, float* y)
{
  for (int i=0; i<N; i++)
  {
    float value = x[i];
    float numer = x[i] * x[i] * x[i];
    int denom = 6; // 3!
    int sign = -1;
    for (int j=1; j<=terms; j++)
    {
      value += sign * numer / denom;
      numer *= x[i] * x[i];
      denom *= (2*j+2) * (2*j+3);
      sign *= -1;
    }
    y[i] = value;
  }
}
```

This compiles to one stream of scalar instructions. The slides point out that the inner loop's instructions depend on one another almost entirely, so **there's no ILP in this region**. A superscalar processor that can issue two instructions per clock doesn't help.

## Idea #1: spend transistors on more cores

Before the multi-core era, most of a chip's transistors went into making **a single instruction stream** run fast: a big data cache, out-of-order logic, a fancy branch predictor, a memory prefetcher. More transistors meant bigger and smarter versions of these.

The multi-core idea: **instead of spending transistors on sophisticated logic that speeds up one instruction stream, use them to add more cores.** Each core is simpler and may run a single stream more slowly, but now there are two. The slides do the arithmetic: if each core runs at 0.75 of the original speed, two cores give 2 × 0.75 = 1.5, a potential speedup.

The catch is that the C code above **expresses no parallelism**. It compiles to one instruction stream and runs as one thread on one core. If the simpler core is 25% slower than the old complex one, the program really does run 25% slower.

So the programmer has to state the parallelism. The slides show two ways:

- **C++ threads**: launch a `std::thread` for the first half of the array, do the second half on the main thread, then `join()` to wait for it.
- **Kayvon's fictitious `forall` construct**: declare that loop iterations are independent, and a compiler could generate threaded code for you.

With parallelism expressed, you can scale up: 4 cores compute 4 elements at once, 16 cores compute 16, meaning 16 simultaneous instruction streams. Real examples include Intel's 10-core Comet Lake Core i9, the Apple A15 (2 big and 4 small cores), and the Apple M1 (a heterogeneous design with 4 big and 4 small cores).

## Idea #2: SIMD, one instruction driving many ALUs

The slides note another property of `sinx`: **the parallelism is across loop iterations, and every iteration runs exactly the same instruction sequence**, just on different input `x[i]`.

That leads to [the second idea](https://gfxcourses.stanford.edu/cs149/fall25/lecture/multicore1/slide_44): add more ALUs to a core and **amortize the cost and complexity of managing an instruction stream across many ALUs**. The same instruction is broadcast to all of them and runs in parallel on each. This is SIMD (single instruction, multiple data).

The slides rewrite `sinx` with AVX intrinsics. `__m256` is a vector type holding eight 32-bit floats, and functions like `_mm256_load_ps` and `_mm256_mul_ps` operate on all eight values at once. The compiled program contains vector instructions such as `vmulps` and processes eight array elements at a time.

Sixteen cores with 8 SIMD ALUs each compute 128 elements in parallel. The `forall` abstraction pays off again here: it tells the compiler that iterations are independent and that one loop body runs over many data elements, so the compiler can generate both multi-core code and SIMD vector instructions.

### What about branches?

SIMD's weak spot is conditional execution. The slides' example puts `if (t > 0.0) {...} else {...}` inside a `forall`. Across 8 ALUs, the condition is true for some elements and false for others. The hardware runs both paths and uses a mask to discard the outputs that shouldn't count. **Not all ALUs do useful work**, and [the worst case is 1/8 of peak performance](https://gfxcourses.stanford.edu/cs149/fall25/lecture/multicore1/slide_52). Full speed resumes after the branch.

The slides leave a breakout question: can you write code, using only a single `if`, that hits the worst case on an 8-wide SIMD processor?

[This slide](https://gfxcourses.stanford.edu/cs149/fall25/lecture/multicore1/slide_55) defines two terms that come up again and again:

- **Instruction stream coherence (coherent execution)**: the same instruction sequence applies to many data elements. Coherent execution **is necessary** to use SIMD efficiently. It **is not necessary** for efficient parallelism across cores, because each core can fetch and decode different instructions from its own thread.
- **Divergent execution**: a lack of instruction stream coherence.

### SIMD on modern CPUs

The slides list three instruction sets: Intel AVX2 does 256-bit operations (8 × 32 bits, 8-wide float vectors), AVX-512 does 512-bit (16 × 32 bits), and ARM Neon does 128-bit (4 × 32 bits).

The compiler generates these instructions, and the parallelism can come from three places:

1. The programmer requests it explicitly with intrinsics
2. Parallel language semantics convey it, like the `forall` example
3. An "auto-vectorizing" compiler infers it from dependency analysis of loops

The CPU approach is called **explicit SIMD**: vectorization happens at compile time, and you can see SIMD instructions like `vmulps` and `vstoreps` in the binary. The other approach, implicit SIMD, is how GPUs work, and it waits for L7.

## Three forms of parallel execution compared

With the first two ideas in place, [this slide](https://gfxcourses.stanford.edu/cs149/fall25/lecture/multicore1/slide_58) sets three forms of parallel execution side by side:

| Form | Where | What runs in parallel | Who finds the parallelism |
|---|---|---|---|
| Superscalar | Within a core | Different instructions from the same stream | Hardware, automatically, at run time (ILP) |
| SIMD | Within a core | Many ALUs controlled by one instruction | The compiler (explicit SIMD) or hardware at run time (implicit SIMD) |
| Multi-core | Across cores | Entirely different instruction streams (thread-level parallelism) | Software creates threads to expose it to the hardware |

Put all three into a real CPU and you can compute its peak throughput. [The slide's example is the quad-core Intel i7-7700K (Kaby Lake)](https://gfxcourses.stanford.edu/cs149/fall25/lecture/multicore1/slide_60), with three 8-wide SIMD ALUs per core (AVX2):

```text
4 cores × 8-wide SIMD × 3 × 4.2 GHz = 400 GFLOPs
```

**A single-threaded, unvectorized program uses only one core and one lane of that figure.** That's where the 32 to 40x speedup previewed for PA1 in the last lecture comes from.

## Part 2: accessing memory

With compute scaled up, the next problem is data. The slides first recap that caches shorten stalls, because the processor sees lower latency when it touches recently used data.

The second trick is **prefetching**. Many modern CPUs analyze a program's memory access patterns at run time, guess which data will be needed, and load it into cache ahead of time, so the load becomes a cache hit. But [the slide](https://gfxcourses.stanford.edu/cs149/fall25/lecture/multicore1/slide_66) warns that a wrong guess can hurt performance, because prefetching consumes bandwidth and pollutes the cache.

What if the data hasn't been read recently, isn't in cache, and the next address can't be predicted? The slides' example:

```c
int x = some_function();
int y = A[x];
```

The analogy is doing laundry or cooking: while the washing machine runs, you don't stand there staring at it. You do something else.

## Idea #3: hardware multithreading to hide stalls

[The third idea](https://gfxcourses.stanford.edu/cs149/fall25/lecture/multicore1/slide_69): **interleave processing of multiple threads on the same core to hide stalls.** If the current thread can't make progress, work on another one.

The slides show one core holding execution contexts for 4 hardware threads, each processing 8 elements. When thread 1 stalls, the core switches to thread 2; when thread 2 stalls, it runs thread 3. By the time the core returns to thread 1, its data has arrived.

This is the **trade-off of throughput computing**: any single thread may take longer to finish (it's runnable, but the core is busy with someone else), in exchange for higher overall system throughput.

The cost is storage. Execution contexts live on chip, and space is limited. The same storage can hold many small contexts (small working set per thread, strong latency hiding) or a few large ones (large working set per thread, weak latency hiding).

### Exercise: how many threads fill the core?

The slides then pose an exercise worth working through yourself. A core can run one scalar instruction per clock from one of its hardware threads. Each thread does 3 arithmetic instructions, then a memory load with a 12-cycle latency.

- **1 thread**: only 3 of every 15 cycles do work, so utilization is 3/15 = 20%.
- **2 threads**: 6/15 = 40%.
- **How many threads for 100%?** [The answer is 5](https://gfxcourses.stanford.edu/cs149/fall25/lecture/multicore1/slide_82). More threads add nothing; the core is already full.

Then the conditions change: each thread now does 6 arithmetic instructions before the same load. Now only 3 threads reach 100%.

The slides draw two takeaways:

1. A processor with multiple hardware threads can avoid stalls by running instructions from other threads while one waits on a long-latency operation. **The memory latency itself doesn't shrink**; it just stops dragging down processor utilization.
2. [A multithreaded processor hides memory latency by performing arithmetic from other threads](https://gfxcourses.stanford.edu/cs149/fall25/lecture/multicore1/slide_87). **Programs with more arithmetic per memory access need fewer threads to hide stalls.**

The second point is worth holding on to. The ratio of arithmetic to memory access comes back in L6 under the name arithmetic intensity.

### Two kinds of hardware multithreading

The slides distinguish two designs:

- **Interleaved multithreading** (also called temporal multithreading): each clock, the core picks one thread and runs one of its instructions. The exercise above works this way.
- **Simultaneous multithreading** (SMT): each clock, the core picks instructions from several threads and runs them on the ALUs together. The example is Intel Hyper-threading, with 2 threads per core.

Both share one property: **the core has the same number of ALUs**. Multithreading only helps use them more efficiently in the face of high-latency operations like memory access.

## Putting it all together

The slides stack the three ideas into a fictitious chip: 16 cores, 8 SIMD ALUs per core (128 total), and 4 threads per core. That's 16 simultaneous instruction streams and 64 concurrent threads in total. Running this chip with maximal latency-hiding ability [takes 512 independent pieces of work](https://gfxcourses.stanford.edu/cs149/fall25/lecture/multicore1/slide_89).

A real Intel Skylake/Kaby Lake core is two-way multithreaded (2 threads per core) and can run up to 4 independent scalar instructions and up to 3 8-wide vector instructions per clock.

The next few slides use the NVIDIA V100 to show GPUs as "extreme throughput-oriented processors": the same three ideas, pushed to a much larger scale. Details wait for L7.

## The story so far

[The summary slide](https://gfxcourses.stanford.edu/cs149/fall25/lecture/multicore1/slide_94) says that to use modern parallel processors efficiently, an application must:

1. **Have enough parallel work** to use all available execution units, across many cores and many units per core
2. **Group parallel work so items need the same instruction sequence**, to use SIMD
3. **Expose more parallel work than there are ALUs**, so work can be interleaved to hide memory stalls

The slides suggest students know these terms: instruction stream, multi-core processor, SIMD execution, coherent control flow, and hardware multithreading (both interleaved and simultaneous).

The deck ends with a set of bonus slides that build step by step from a simple scalar core to a "multi-core, multithreaded, superscalar" core, titled with the claim that if you understand this sequence, you understand lecture 2. The last slide is a thought experiment: an application spawns two threads on a processor with two cores and two execution contexts per core. Who maps the application's threads to hardware contexts? The operating system. Then: if you were writing the OS, which two contexts would you pick? What if the program spawned five threads?

## 2023 video supplement

The 2023 [Lecture 2 video](https://www.youtube.com/watch?v=CKmNpAO5rS4) (about 1 hour 16 minutes) covers the same lecture. I compared the text of the [2023 L2 slides](https://gfxcourses.stanford.edu/cs149/fall23content/media/multicore/02_basicarch_xX3ssOi.pdf) (103 slides) with the 2025 deck (108 slides). The `sinx` example, the three ideas, SIMD divergence, and the thread-utilization exercise are the same. There are two differences:

- **The opening.** The 2025 deck adds the review slides from L1 on memory, latency, stalls, caches, and the energy cost of data movement, plus the Apple M1 example.
- **The ending.** The last few slides of the 2023 L2 already start the bandwidth example: load A[i], load B[i], compute A[i] × B[i], store into C[i], and ask whether that suits a throughput-oriented parallel processor. The 2025 course moves this to L3, so the final stretch of the 2023 video belongs to the next post in this series.

## Things to do tonight

1. Compute your own CPU's peak GFLOPs: cores × SIMD width × SIMD units per core × clock. If you can't find the unit count, use the other three and see how far a single-threaded scalar program falls short.
2. Redo the utilization exercise with "4 arithmetic instructions + a load with 20-cycle latency" and find how many threads you need.
3. Write a loop with a single `if` that leaves only one lane of an 8-wide SIMD unit doing useful work at a time.

---

**Series navigation**: [← Previous: L1 Why parallelism, why efficiency](/posts/ai/2026-09-30-cs149-why-parallelism-efficiency-en) | [Series overview](/posts/ai/2026-09-30-cs149-course-overview-en) | Next: [L3 Latency vs. bandwidth + ISPC →](/posts/ai/2026-09-30-cs149-latency-bandwidth-ispc-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [CS149 Fall 2025 home page and schedule](https://gfxcourses.stanford.edu/cs149/fall25)
- [Lecture 2 slides PDF: A Modern Multi-Core Processor (Part I) (Fall 2025, 108 slides)](https://gfxcourses.stanford.edu/cs149/fall25content/media/multicore1/02_basicarch.pdf)
- [Lecture 2 slide-by-slide web version (Fall 2025)](https://gfxcourses.stanford.edu/cs149/fall25/lecture/multicore1/)
- [Lecture 2 slides PDF (Fall 2023, for comparison)](https://gfxcourses.stanford.edu/cs149/fall23content/media/multicore/02_basicarch_xX3ssOi.pdf)
- [CS149 2023 Lecture 2 video (YouTube)](https://www.youtube.com/watch?v=CKmNpAO5rS4)
