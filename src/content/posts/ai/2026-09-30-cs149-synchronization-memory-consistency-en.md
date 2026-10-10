---
title: "CS149 L15 Memory Consistency: How Write Buffers Make r1 = r2 = 0 Possible"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, ai-course, stanford, parallelism, concurrency, hardware, systems]
lang: en
series:
  name: "Reading Stanford CS149"
  order: 20
tldr: "Coherence covers a single address. Memory consistency covers reads and writes to different addresses, and the order in which other threads see them take effect. CS149 L15 uses two threads and two variables to make the point: under sequential consistency, r1 = r2 = 0 is impossible, but the write buffer in every modern processor lets reads pass writes, so it becomes possible. TSO, PSO, and weak ordering relax more orderings in exchange for speed, and fences and synchronization primitives restore the orderings you need. The takeaway for application programmers is short: write data-race-free programs and use a synchronization library, and C11, C++11, and Java 5 guarantee you'll see sequential consistency."
description: "A guide to Stanford CS149 (Fall 2025) Lecture 15: coherence versus consistency, the four memory-operation orderings, sequential consistency and the switch metaphor, write buffers with TSO and PC, PSO, weak ordering and release consistency, x86 lfence/sfence/mfence, data races, and SC for DRF. It also notes that the \"Implementing Synchronization\" in the official lecture title appears in the Fall 2025 L16 slides."
draft: false
glossary:
  - term: "memory consistency model"
    definition: "The rules for how hardware and compilers may reorder reads and writes to different addresses; a contract between them and application software."
    context: "CS149 L15 stresses that it has nothing to do with whether caches exist; a cacheless system still needs a consistency model."
  - term: "sequential consistency"
    aliases: ["SC"]
    definition: "All processors' memory operations appear to execute in some single order, and each thread's operations appear in that order in program order."
    context: "L15 cites Lamport's 1976 definition and explains it with a switch metaphor: memory picks a processor at random and runs one of its operations to completion."
  - term: "total store ordering"
    aliases: ["TSO"]
    definition: "A consistency model that relaxes only write-to-read ordering: a processor may let its own reads pass its own writes, but other processors can't read the new value until the write is visible to all."
    context: "L15 says x86 uses an incompletely specified form of TSO."
  - term: "data race"
    definition: "Two accesses by different processors to the same address, at least one a write, not ordered by any synchronization operation."
    context: "L15 concludes that data-race-free programs produce SC results even on non-SC systems."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs149-synchronization-memory-consistency)

**Video status: Related supplementary video included; the original lecture recording has not been verified.** [Source details](#course-video-sources)

**This post is based on the Fall 2025 edition of [CS149](https://gfxcourses.stanford.edu/cs149/fall25).** It is part 20 of [Reading Stanford CS149](/posts/ai/2026-09-30-cs149-course-overview-en). It follows [L14 Cache coherence](/posts/ai/2026-09-30-cs149-cache-coherence-en) and covers Lecture 15 (2025-11-13).

The official material is the [L15 slide PDF](https://gfxcourses.stanford.edu/cs149/fall25content/media/sync_consistency/15_consistency.pdf) (60 pages, also available [slide by slide on the web](https://gfxcourses.stanford.edu/cs149/fall25/lecture/sync_consistency/)). Fall 2025 recordings are Canvas-only; the course home page points to the 2023 [Lecture 12 Memory Consistency video](https://www.youtube.com/watch?v=nFXWmo9MFiY) instead. This post follows the 2025 slides and lists the video only as a supplement. The access level is **A3** (defined in the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en)): the slides are fully public, and only the current recordings are missing.

## Course video sources

This article uses Fall 2025 materials. The official Fall 2025 course page states that this year's lecture videos cannot be distributed to the public and points to a 2023 YouTube playlist instead. The Fall 2023 recording below covers a closely related topic but its content may differ from the 2025 lecture, and the original recording has not been verified. Checked: 2026-10-10.

```youtube
url: https://www.youtube.com/watch?v=nFXWmo9MFiY
title: Stanford CS149 I Parallel Computing I 2023 I Lecture 12 - Memory Consistency
```

Original videos: [Stanford CS149 I Parallel Computing I 2023 I Lecture 12 - Memory Consistency](https://www.youtube.com/watch?v=nFXWmo9MFiY)

Course and recording entries:

- [CS149 2023 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [Official course / lecture source](https://gfxcourses.stanford.edu/cs149/fall25/lecture/sync_consistency/)

## What this lecture actually covers

The course home page titles L15 "Implementing Synchronization + Memory Consistency," with the description "Fine-grained synchronization via locks, motivation for relaxed consistency, implications to programmers." The PDF's cover reads "Memory Coherency and Consistency," and the deck has two parts:

- **Pages 1–20**: an almost verbatim repeat of [L14](/posts/ai/2026-09-30-cs149-cache-coherence-en)'s MSI, MESI, directory, and false-sharing slides. See the previous post.
- **Pages 21–60**: memory consistency, the subject of this post.

The L15 PDF has **no** lock implementations. Test-and-set, test-and-test-and-set, and ticket locks appear in the Fall 2025 [L16 slides](https://gfxcourses.stanford.edu/cs149/fall25content/media/finegrainedsync/16_finegrainedlock.pdf), whose cover reads "Implementing Locks." This series covers them in the next post, [L16 Fine-grained locking and lock-free programming](/posts/ai/2026-09-30-cs149-fine-grained-locking-lock-free-en). This post sticks to what the L15 slides contain.

Slide 2 also announces the midterm: the evening of November 18, covering L1 through L14 (up to cache coherence), closed everything.

## Coherence covers one address; consistency covers all of them

L14 defined coherence for a single address X: all processors must agree on the order of reads and writes to X. Consistency is about **different addresses**: when thread 0 writes X, in what order does thread 1 see that write relative to thread 0's reads and writes of Y?

The slides restate the difference more intuitively:

- Coherence aims to make a parallel machine's memory **behave as if the caches weren't there**. A system without caches needs no coherence.
- Consistency defines what behavior is **allowed** for reads and writes to different addresses. It has to be specified whether or not there are caches.

A later slide, "Clarification (make sure you get this!)," says it again: coherence problems come from the hardware **replicating** data in multiple caches; relaxed-consistency problems come from the hardware **reordering** memory operations. Two optimizations, two problems.

Who needs to care? The slides name three groups: people implementing synchronization libraries, anyone who will work on kernels or drivers, and people writing lock-free data structures. The TL;DR slide: multiprocessors reorder memory operations in unintuitive ways, this is necessary for performance, application programmers rarely see it, and systems developers (OS and compiler) see it all the time.

## Four orderings

A program defines a sequence of loads and stores, its "program order." The slides split the ordering requirement between two operations into four kinds:

| Ordering | Meaning |
|---|---|
| W<sub>X</sub> → R<sub>Y</sub> | A write to X must commit before a later read of Y |
| R<sub>X</sub> → R<sub>Y</sub> | A read of X must commit before a later read of Y |
| R<sub>X</sub> → W<sub>Y</sub> | A read of X must commit before a later write to Y |
| W<sub>X</sub> → W<sub>Y</sub> | A write to X must commit before a later write to Y |

"A write must commit before a read" means the write's result is visible by the time the read happens.

## A two-line example

Initially A = B = 0:

```
Proc 0          Proc 1
(1) A = 1       (3) B = 1
(2) print B     (4) print A
```

What can it print? The slides say it should not print "00" or "10," and explain with a happens-before graph: draw the orderings each outcome requires as edges; if the graph has a cycle, the outcome is impossible, because some event would have to happen before itself.

### Sequential consistency

Lamport proposed it in 1976 (he received the Turing Award in 2013): all operations appear to execute in some sequential order, as if manipulating a single shared memory, and each thread's operations appear in program order. An SC system preserves all four orderings.

The slides' metaphor is a switch. Each processor issues loads and stores in program order; memory picks a processor at random, runs one of its operations to completion, then picks again. The slides then step through one interleaving of `A=1; r1=B` and `B=1; r2=A` that ends with r1 = r2 = 1.

## Why relax: writes are slow

SC's problem: `A = 1` and `r1 = B` don't conflict, yet the read waits for the write to finish. The slides say a write can take hundreds of cycles, and in a coherent system a memory access may also involve finding the data and sending invalidations.

The motivation for relaxing order is **hiding memory latency** by overlapping independent memory operations.

### Write buffers

The classic optimization is a write buffer: the processor drops a write into its own buffer and keeps going, and reads check that buffer first. Back to the example:

```
Initially A = B = 0
Proc 0          Proc 1
(1) A = 1       (3) B = 1
(2) r1 = B      (4) r2 = A
```

Can r1 = r2 = 0? Not under SC. With write buffers, both writes can still be sitting in their buffers while both reads fetch 0 from memory, so **yes**.

The slides say every modern processor uses write buffers, including Intel x86, ARM, and RISC-V, so they need a model weaker than SC.

<details>
<summary>TSO versus PC</summary>

Both relax only W<sub>X</sub> → R<sub>Y</sub>. W<sub>X</sub> → W<sub>Y</sub> still holds, so one thread's writes happen in program order.

- **Total Store Ordering (TSO)**: processor P may read B before its write to A is visible to all processors (its reads may pass its own writes). But other processors can't read the new value of A until the write is visible to everyone.
- **Processor Consistency (PC)**: any processor may read the new value of A before the write is visible to all processors.

The slides say TSO is slightly harder to reason about than SC, and that x86 uses an incompletely specified form of TSO.

</details>

## Relaxing further: reorder writes, then everything

**Partial Store Ordering (PSO)** also relaxes W<sub>X</sub> → W<sub>Y</sub>. The slides show the consequence:

```c
// Thread 1 (P1)        // Thread 2 (P2)
A = 1;                  while (flag == 0);
flag = 1;               print A;
```

Under PSO, P2 may see `flag` become 1 before it sees `A` become 1, and print 0.

Why would hardware want these reorderings? The slides match them up:

- W → W: in a write buffer, one write may miss in the cache while the other hits, so the processor may let the hit finish first
- R → W and R → R: out-of-order execution reorders independent instructions

All of these are valid optimizations for a single instruction stream. They only become a problem when another thread can observe them.

The loosest setting **relaxes all four orderings**, with no guarantees on data operations: reads as early as possible, writes as late as possible. The slides' examples are weak ordering (WO) and release consistency (RC).

## Restoring order: fences and synchronization primitives

The slides admit that reordering seems like a nightmare. Every architecture provides primitives to make ordering stricter:

- **Fences (memory barriers)**: all memory operations before the fence complete before any after it begin. They prevent reordering, but they're expensive.
- **Per-address primitives**: read-modify-write, compare-and-swap, transactional memory, and so on.

x86 is roughly TSO. When software needs an ordering the model doesn't guarantee, it can use `_mm_lfence` (wait for all loads), `_mm_sfence` (wait for all stores), or `_mm_mfence` (wait for all memory operations). The slides call ARM's model "very relaxed" and point to Bartosz Milewski's post on x86 fences, ARM's barrier litmus-test cookbook, and Cambridge's list of weak-memory papers.

## Data races and "SC for DRF"

The slides point out that every example so far contains a data race: two accesses by different processors to the same address, at least one a write, not ordered by any synchronization (a fence, an operation with acquire/release semantics, a barrier, and so on). A racy program's output depends on the relative speed of the processors.

The key result: **a data-race-free program produces SC results even on a non-SC system.** All conflicting accesses are ordered by synchronization, and synchronization enforces sequential consistency. In practice, most programs you'll meet synchronize through libraries of locks and barriers rather than ad-hoc reads and writes of shared variables like the examples.

The same holds at the language level. Compilers reorder too; some reorderings are invisible to the programmer and some aren't, so languages need memory models as well. C11, C++11, and Java 5 guarantee **sequential consistency for data-race-free programs** (SC for DRF), and the compiler inserts whatever synchronization the hardware model requires. Programs with races get **no guarantees at all**, on the reasoning that most programmers would consider a racy program buggy anyway. The slide's one-line conclusion: use a synchronization library.

The two summary slides:

- Relaxed consistency buys performance; one cost is software complexity, since the programmer or compiler must insert synchronization where specific orderings matter. In practice that complexity lives inside library primitives such as lock/unlock, barriers, and fences. The design principle is to optimize for the common case: most accesses don't conflict, so don't build a system that pays for conflicts every time.
- A consistency model is a contract between hardware or compiler and application software. The slides also ask whether good performance requires a weak model; their answer is that SC can perform well given many more resources.

**Try this**: find code you've written that passes "the data is ready" between threads through a plain `bool` or `int` flag, and compare it with the `A`/`flag` example above. Change it to a C++ `std::atomic`, or wrap it in a mutex and condition variable, so the program becomes data-race-free.

## Where this leads

| Concept from this lecture | Where it comes back |
|---|---|
| Fences, compare-and-swap | Lock implementations and lock-free data structures in [L16](/posts/ai/2026-09-30-cs149-fine-grained-locking-lock-free-en) |
| "Lock-free data structure authors must care about consistency" | The slide itself marks it "Topic of a later lecture" |
| Transactional memory as a synchronization primitive | [L17–L18 Transactional memory](/posts/ai/2026-09-30-cs149-transactional-memory-w4-en) |

## What this post can and cannot confirm

Confirmed: the L15 slide PDF, the lecture title and description on the course home page, and the L16 PDF's cover title and lock-implementation section. The home page's "Fine-grained synchronization via locks" has no matching slides in the L15 PDF; whether it was covered verbally in class can't be checked without a recording. Slide 42, "Write Buffer Performance," is a chart, and this post doesn't quote its values.

Not confirmed: what was said in the Fall 2025 lecture, and the page-by-page differences between the 2023 video (titled Memory Consistency that year) and the 2025 slides. This post was not written from the video.

Further reading: lock implementations and atomic operations from the operating-system side in [CS111 Lecture 6: Implementing locks](/posts/learning/2026-08-22-stanford-cs111-lecture-06-implementing-locks-en).

**Series**: previous [L14 Cache coherence: MSI, MESI, and false sharing](/posts/ai/2026-09-30-cs149-cache-coherence-en) | next [L16 Fine-grained locking and lock-free programming](/posts/ai/2026-09-30-cs149-fine-grained-locking-lock-free-en) | [Series overview](/posts/ai/2026-09-30-cs149-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Official sources only have Fall 2023 recordings, so the status is now related supplementary video only, and video titles use the original titles.

## References

- [Stanford CS149 Fall 2025 home page and lecture schedule](https://gfxcourses.stanford.edu/cs149/fall25)
- [Lecture 15: Memory Coherency and Consistency (slide PDF)](https://gfxcourses.stanford.edu/cs149/fall25content/media/sync_consistency/15_consistency.pdf)
- [Lecture 15, slide-by-slide web version](https://gfxcourses.stanford.edu/cs149/fall25/lecture/sync_consistency/)
- [Lecture 16: Implementing Locks (slide PDF, where lock implementations live)](https://gfxcourses.stanford.edu/cs149/fall25content/media/finegrainedsync/16_finegrainedlock.pdf)
- [CS149 2023 Lecture 12 Memory Consistency video (supplement)](https://www.youtube.com/watch?v=nFXWmo9MFiY)
- [CS149 2023 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [Bartosz Milewski: Who ordered memory fences on an x86? (recommended in the slides)](http://bartoszmilewski.com/2008/11/05/who-ordered-memory-fences-on-an-x86/)
- [Cambridge list of weak-memory papers (recommended in the slides)](http://www.cl.cam.ac.uk/~pes20/weakmemory/)
