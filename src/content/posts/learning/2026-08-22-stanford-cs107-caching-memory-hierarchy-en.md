---
title: "Stanford CS107 Lecture 25: Caching, Memory Hierarchy, and Locality"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, systems-programming, cache, memory-hierarchy, performance]
lang: en
series:
  name: "Reading Stanford CS107"
  order: 26
tldr: "CS107 Lecture 25 builds the essential cache model from a concise deck: memory access costs are nonuniform, smaller and faster layers retain data likely to be reused, and temporal and spatial locality determine whether a program benefits."
description: "A guided reading of Stanford CS107 Winter 2026 Lecture 25: caching, memory hierarchy, temporal locality, spatial locality, and the performance implications of traversal and data layout."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs107-caching-memory-hierarchy)

The previous lecture used profilers and compiler transformations to ask what work can be removed. Lecture 25 changes direction: even when the same instructions execute, waiting time can differ because data resides at different memory levels. A cache retains data likely to be reused in a smaller, faster layer near the processor, allowing many accesses to avoid returning to a slower layer.

The Winter 2026 public deck extracts to only 55 lines. It is not a complete public course in cache architecture. This article faithfully explains its memory hierarchy, temporal locality, and spatial locality, then turns them into testable programming questions. It does not invent cache-line sizes, associativity, replacement policies, write policies, or processor-specific latencies.

## Lecture materials and complete agenda

- Course: Stanford CS107: Computer Organization & Systems
- Offering: Winter 2026
- Official lecture: Lecture 25, 2026-03-06
- Official title: Caching and Memory Hierarchies
- Instructor: Jerry Cain
- Materials read: official calendar, complete public slides, and Intel's official architecture and optimization documentation
- Material gaps: the public deck is unusually short; the Canvas recording and AFS examples are unavailable, so this article cannot reconstruct Q&A, demonstrations, or unpublished hardware details

The [official calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html) places this lecture after Optimizations and before Wrap-up. The [complete five-page deck](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/25/Lecture25.pdf) covers the caching idea, nonuniform costs in a memory hierarchy, temporal locality, and spatial locality; page 3 adds a quantitative thought question, and page 5 labels `Demo: cache.c`.

## A cache is a replication strategy, not a magical container

Suppose a slower level retains the complete data set while a faster level holds only a subset. Fetching every access from the slower level leaves a fast processor waiting. Copying likely-to-be-reused data into the faster level lets later hits shorten the wait. The design trades capacity for speed: the faster level is generally smaller and cannot retain everything permanently.

“Cache is faster than memory” is only a starting point. The useful question is whether the cache contains the bytes the program needs next. With neither repetition nor proximity, even a fast cache produces few reusable hits. When a working set is repeatedly used while it fits in a small level, expensive lower-level accesses can be amortized.

The [Intel architecture manuals portal](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html) separates basic architecture, system programming, and optimization references. That distinction reinforces the boundary here: CS107 presents a portable locality model, not a promise about one CPU configuration. Concrete levels, capacities, and behavior belong to the target processor documentation and measurement.

## Memory hierarchy gives the same address different costs

C exposes addressable objects; hardware and systems supply their data through multiple levels. Storage nearer a processing core is commonly faster and smaller, while more distant levels offer greater capacity with higher access cost. A hierarchy succeeds when a frequently used subset remains in fast storage while the machine preserves a much larger total capacity.

Source code cannot command that one variable stay cached forever. Programs influence access order, layout, and working-set size; hardware moves data according to its implementation. Optimization should form a measurable hypothesis, such as “walking a row contiguously has better locality than using a large stride,” and compare representative inputs rather than treating the hierarchy as a fixed latency chart.

The [Intel Optimization Reference Manual portal](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html#inpage-nav-8) places tuning in the context of a particular microarchitecture. Locality is therefore a direction, while the observed benefit depends on machine, data, compiler, and concurrent work.

## Temporal locality: recently used may be used again soon

Temporal locality means recently accessed data is more likely to be accessed again soon. Examples include a loop accumulator, a repeatedly queried small table, or an object used several times during one computation. The first access may fetch from a slower layer; subsequent accesses can reuse that cost if the data remains in the faster layer.

Repetition must occur within a useful time and capacity window. If two accesses are separated by a much larger working set, intervening content may displace the original data. Keeping a reused value in a local variable or tiling a computation so a small region completes multiple passes can exploit temporal locality, but profiling and benchmarks must determine whether it helps.

[Page 3 of the deck](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/25/Lecture25.pdf#page=3) gives a concrete thought question: if 97% of accesses hit at 1 cycle each while 3% miss at 100 cycles each, what share of time belongs to misses? Per 100 accesses, hits consume 97 cycles and misses consume 300, so misses take `300 / (97 + 300) ≈ 75.6%` of access time. A small fraction of expensive events can dominate time, which is why hit rate alone is insufficient.

A practical experiment keeps algorithm and input fixed while changing working-set organization: process one large region and return later, or divide it into smaller tiles and complete several operations within each tile. Record elapsed time and verify identical output, but do not claim causation from one timing alone.

## Spatial locality: after here, nearby may come next

Spatial locality means nearby addresses are likely to be accessed soon after one address. Hardware commonly transfers a contiguous range at once, so reading one element can bring neighboring elements into a faster level. Sequential array traversal can consume those neighbors; large strides and dispersed pointer chasing may exploit them less effectively.

This is why data layout can affect performance. When fields needed by one operation are near each other, fetched ranges may be used well. When each needed value lives in a separate allocation, the program may fetch many bytes it will not use immediately. Yet “arrays are always faster than linked structures” is too broad: scale, required operations, mutation cost, and target machine all affect the result.

Compare two logically equivalent loops, one using contiguous indices and one using a large stride. Confirm identical results before measuring repeatedly. A difference can be consistent with the locality model; attribution to a specific cache event requires hardware counters or a more detailed profiler.

## Locality closes the loop with Lecture 24 measurement

Lecture 24 begins optimization with measurement. Lecture 25 preserves that rule while offering another candidate explanation: a hot function may be waiting for data rather than executing too many instructions. Call and instruction counts locate concentrated work; the hierarchy model then suggests traversal or layout experiments.

Establish a baseline, change one access strategy, and compare the same workload. No improvement may mean the data already fit, the compiler transformed the loop, another bottleneck dominates, or the input is unrepresentative. Locality forms hypotheses; it does not excuse skipping measurement.

The [Valgrind Cachegrind manual](https://valgrind.org/docs/manual/cg-manual.html) describes simulated cache, branch-prediction, and event counts. Such a tool can clarify elapsed time, but its simulated model is not the target processor and should be interpreted alongside measurements from the actual environment.

## Cache details this lecture does not teach

Apart from the assumed costs in the page 3 thought question, the public slides do not present a 1-cycle hit or 100-cycle miss as a hardware rule. Nor do they teach direct-mapped or set-associative structures, tag/index/offset decomposition, replacement, write-through versus write-back, prefetchers, or coherence. Those are important systems and architecture topics, but adding them here would misrepresent another source as Lecture 25's agenda.

Page 5 says only `Demo: cache.c`. The public archive supplies neither that source file nor a transcript or results, so this article can confirm the demo's place but cannot reconstruct its data, output, or measured gap. The traversal exercises above are derived from the locality model and are not presented as the classroom demo.

Nor does this article claim stack data inherently has better locality than heap data. Those terms classify lifetime and allocation mechanisms; locality depends on actual addresses, layout, and traversal. Fewer cache misses also do not guarantee a faster whole program because instruction count, branches, I/O, and synchronization may dominate.

## A method to carry forward

For a slow program, ask whether a small data set is reused soon, whether upcoming accesses are near the current address, and whether the active working set may displace earlier data. Choose one minimal change—swap nested-loop order, tile work, or rearrange hot fields—hold inputs and correctness checks constant, and measure again.

Lecture 25 is valuable because it is restrained. It replaces the assumption that every operation has equal cost with questions about where data is and what will be used recently or nearby. Temporal and spatial locality connect source-level traversal to the memory hierarchy. Preserving the source boundary keeps useful intuition from turning into an unsupported machine guarantee.

## Update log

- 2026-08-22: Restored the page 3 cache-cost thought question and calculation, and documented the unavailable source for the page 5 `cache.c` demo.

## References

- [Stanford CS107 Winter 2026 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 25 slides](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/25/Lecture25.pdf)
- [Intel 64 and IA-32 Architectures Software Developer Manuals](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html)
- [Valgrind Cachegrind manual](https://valgrind.org/docs/manual/cg-manual.html)
