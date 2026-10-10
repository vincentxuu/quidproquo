---
title: "CS149 L14 Cache Coherence: MSI, MESI, and False Sharing"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, ai-course, stanford, parallelism, hardware, cache, systems]
lang: en
series:
  name: "Reading Stanford CS149"
  order: 19
tldr: "When every core has its own cache, one address can have several copies, and different cores can see different values. Locks can't fix this; the hardware created it by replicating data. CS149 L14 defines what coherent means, then takes apart the snooping MSI protocol: before writing, broadcast BusRdX so everyone else invalidates. MESI adds an E state that saves the second transaction in read-then-write, and directories replace broadcast with point-to-point messages. The practical consequence for programmers is false sharing: two threads write different variables, but because they share a cache line, the line bounces between cores. In the lecture's demo it made the program three times slower."
description: "A guide to Stanford CS149 (Fall 2025) Lecture 14: where the cache coherence problem comes from, the formal definition of coherence and its SWMR and write-serialization invariants, snooping and the simplest write-through implementation, the MSI state machine and a worked example, MESI's E state, the Intel Core i7 using L3 as a directory, and AMAT, false sharing, and padding."
draft: false
glossary:
  - term: "cache coherence"
    definition: "When several processors cache the same memory address, the guarantee that all reads and writes to that one address can be put in a single order consistent with every processor's observations, with each read returning the last write in that order."
    context: "CS149 L14 stresses that it only concerns a single address; ordering across addresses is the next lecture's memory consistency."
  - term: "false sharing"
    definition: "Two processors write different addresses that fall in the same cache line, so the coherence protocol moves the line back and forth between their caches, creating communication the program never needed."
    context: "In the L14 demo, 8 threads each incrementing their own counter on a 4-core machine ran about three times slower without padding than with it."
  - term: "SWMR invariant"
    aliases: ["Single-Writer, Multiple-Read"]
    definition: "In any time period, an address has either exactly one processor that may write (and read) it, or some number of processors that may only read it."
    context: "L14 uses it, together with the data-value invariant, to show why MSI maintains coherence."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs149-cache-coherence)

**This post is based on the Fall 2025 edition of [CS149](https://gfxcourses.stanford.edu/cs149/fall25).** It is part 19 of [Reading Stanford CS149](/posts/ai/2026-09-30-cs149-course-overview-en). It follows [PA5, the fastest kernel on an H100](/posts/ai/2026-09-30-cs149-pa5-fastest-kernels-en) and covers Lecture 14, "Cache Coherence" (2025-11-11).

The official material is the [L14 slide PDF](https://gfxcourses.stanford.edu/cs149/fall25content/media/cachecoherence/14_coherence.pdf) (45 pages, also available [slide by slide on the web](https://gfxcourses.stanford.edu/cs149/fall25/lecture/cachecoherence/)). Fall 2025 recordings are Canvas-only; the course home page points to the 2023 [Lecture 11 Cache Coherence video](https://www.youtube.com/watch?v=lrCfG2CPDEw) instead. This post follows the 2025 slides and lists the video only as a supplement. The access level is **A3** (defined in the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en)): the slides are fully public, and only the current recordings are missing.

## Course video sources

This article uses Fall 2025 materials. The public Fall 2023 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=lrCfG2CPDEw
title: CS149 2023 Lecture 11 Cache Coherence video (supplement)
```

Original videos: [CS149 2023 Lecture 11 Cache Coherence video (supplement)](https://www.youtube.com/watch?v=lrCfG2CPDEw)

Course and recording entries:

- [CS149 2023 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [Official course / lecture source](https://gfxcourses.stanford.edu/cs149/fall25/lecture/cachecoherence/)

## Why the course returns to caches after AI kernels

That is the official order: L9 through L13, PA4, and PA5 cover AI systems, and L14 through L18 return to correctness in shared memory. The topic seems to break, but it connects back to two earlier places:

- [L2 Modern multi-core processors](/posts/ai/2026-09-30-cs149-multicore-simd-multithreading-en) drew each core with private L1 and L2 caches. This lecture answers how those private copies stay consistent.
- In [PA2's thread pool](/posts/ai/2026-09-30-cs149-pa2-task-graph-scheduling-en), worker threads share task counters and queues. Part of their performance depends on the protocol in this lecture.

Multithreaded runtimes, locks, and lock-free data structures all sit on top of this layer. Part 5 doesn't talk about AI directly, but no parallel runtime gets around it.

## Review: how a cache works

The slides open with two small examples: an 8-byte cache, 4-byte lines, LRU replacement. The first shows spatial locality (loading a line preloads its neighbors) and temporal locality (repeat accesses to one address hit). The second runs into a capacity miss.

Next come the five steps of a write miss in a uniprocessor write-allocate, write-back cache: pick a location (writing back any dirty line there), load the whole line from memory, update 32 bits, mark it dirty. The slides also show the Intel Skylake hierarchy: a private 32 KB L1 and 256 KB L2 per core, a shared 8 MB inclusive L3, and 64-byte lines.

## What the coherence problem looks like

Four processors each have a cache. Variable `foo` sits at shared address X, starts at 0, and caches are write-back. The slides step through:

| Action | Result |
|---|---|
| P1 load X | P1 caches 0 |
| P2 load X | P2 caches 0 |
| P1 store X ← 1 | Only P1's cache changes; memory still holds 0 |
| P3 load X | P3 reads 0 from memory |
| P3 store X ← 2 | Only P3's cache changes |
| P2 load X | P2 hits in its cache and reads the stale 0 |
| P1 load Y, evicting X | P1 writes 1 back to memory |

One address, and processors see 0, 1, and 2. The slide asks: is this a mutual exclusion problem? Can locks fix it? **No.** The hardware created the problem by replicating data in local caches. It has nothing to do with whether the program races.

The root cause is that the abstraction of one shared address space is implemented by global main memory plus per-processor local caches.

### What does "last" mean in "last write"?

The intuitive rule is that reading X returns the last value any processor wrote to X. But what if two processors write at the same moment? What if P1 writes and P2 reads so soon after that the write can't reach P2 in time? In a sequential program, "last" means program order. Parallel programs need a different definition.

The formal definition on the slides: a memory system is coherent if, for each address, there exists a hypothetical serial order of all processors' operations on it that is consistent with the results, and:

1. Operations issued by one processor appear in the order that processor issued them
2. Each read returns the value of the last write to that address in the serial order

In an implementation, this becomes two invariants:

- **SWMR (Single-Writer, Multiple-Read)**: in any period, either one processor may write (and read), or several processors may only read
- **Data-value (write serialization)**: the value at the start of a period equals the value at the end of the last read-write period

## Ways to implement coherence

The slides list three:

- **Software, page-granularity**: the OS propagates writes through page faults, which works across a cluster of workstations. Not covered in class, except to note its big problem is false sharing (see below).
- **Hardware, cache-line granularity**: snooping (the focus here) and directories (briefly).
- **Share one cache**: no replication, no coherence problem, but you lose what makes a cache local and fast, and you get interference and contention. The upside is that when working sets overlap, one processor's loads can prefetch for another. The example is SUN Niagara 2: eight cores connected through a crossbar to shared L2 banks, with the crossbar taking about as much area as one core.

### Snooping, and the simplest version

In snooping, all coherence-related activity is broadcast to every cache controller, and each controller monitors ("snoops") it and reacts per the protocol. A controller now answers to two sides: loads and stores from its own processor, and messages broadcast on the interconnect.

The simplest version assumes write-through caches at cache-line granularity: on a write, broadcast an invalidation; other processors miss on their next read and fetch the new value from memory. The problem is that every write goes to memory, which needs a lot of bandwidth. Write-back caches absorb most writes as hits, but they need a more elaborate protocol.

## MSI: get exclusive ownership before writing

With write-back caches, the dirty state means **exclusive ownership**. The cache holds the only valid copy and may write it; when someone else wants to read, this cache must supply the data, or the reader gets a stale copy from memory.

In MSI, each line has one of three states:

| State | Meaning |
|---|---|
| I (Invalid) | Same as invalid in a uniprocessor cache |
| S (Shared) | Valid in one or more caches; memory is up to date |
| M (Modified) | Valid in exactly one cache (dirty, also called exclusive) |

There are two processor operations, PrRd and PrWr, and three bus transactions:

- **BusRd**: get a copy with no intent to modify
- **BusRdX**: get a copy with intent to modify
- **BusWB**: write a dirty line back to memory

The key transitions:

- A read brings the line into S, even if it is the only copy
- Before writing, a cache must reach M by issuing BusRdX; other caches invalidate their copies, and any cache holding M writes back first
- Even a line already in S needs BusRdX to upgrade to M
- A cache in M that sees another cache's BusRd writes back and drops to S; on BusRdX it writes back and drops to I

The slides' worked example, with three processors operating on x:

| Action | P1 | P2 | P3 | Bus | Data from |
|---|---|---|---|---|---|
| P1 read x | S | – | – | BusRd | Memory |
| P3 read x | S | – | S | BusRd | Memory |
| P3 write x | I | – | M | BusRdX | Memory |
| P1 read x | S | – | S | BusRd | P3's cache |
| P1 read x | S | – | S | none | P1's cache |
| P2 write x | I | M | I | BusRdX | Memory |

How MSI satisfies the invariants: only one cache can be in M, and all others receive invalidations, which gives SWMR. On BusRd and BusRdX, data comes from the cache holding M, and the bus puts all transactions in one order, which gives write serialization.

<details>
<summary>Why a write to a line in S still needs a broadcast</summary>

The MSI summary slide leaves this as a question. The hint is SWMR: S means someone else may also hold a copy. If you wrote without broadcasting, those S copies would go stale, and their owners would keep hitting on the old value. BusRdX tells everyone, in the slide's words, "you can't read any more, because I'm going to write."

</details>

## MESI: skip the second transaction in read-then-write

MSI needs two transactions in the common case of reading an address and then writing it: BusRd from I to S, then BusRdX from S to M. The waste happens even when the program shares nothing.

MESI adds an **E (exclusive clean)** state: the line is unmodified, but only this cache has it. On a read, if no other cache asserts that it shares the line, the line goes straight to E, and a later write moves E to M with no bus transaction at all. E separates exclusivity from ownership: the line isn't dirty, so memory still holds a valid copy.

The slide's corner note: "MESI, not Messi!"

## Directories: stop broadcasting

Snooping broadcasts to learn the state of a line in other caches, and that doesn't scale. A directory keeps the state of each line across all caches in one place. Caches look it up when needed, and coherence runs on point-to-point messages sent on a need-to-know basis. The SWMR and write-serialization invariants still apply.

The example is the Intel Core i7. Its L3 is inclusive, so every line in any L2 is also in L3, which lets L3 serve as the central directory and serialization point. The directory records which L2s hold a line and sends coherence messages only to them. The Core i7 interconnect is a ring, not a bus.

## What it means for programmers

### Communication hides inside memory latency

On a multiprocessor, communication is a key parallel overhead, and it shows up as a longer average memory access time (AMAT). The slides list rough latencies for the Core i7 Xeon 5500 series: about 4 cycles for an L1 hit; for an L3 hit, about 40 cycles when the line is unshared and about 75 cycles when another core has modified it; about 400 cycles for remote DRAM. The warning is that even a small fraction of these slow accesses can matter. The slides suggest Intel VTune to observe memory system behavior.

### False sharing

The slide asks what the performance problem is in this per-thread accumulation:

```c
// one counter per thread, packed into an array
int myPerThreadCounter[NUM_THREADS];
```

And why this version might be faster:

```c
struct PerThreadState {
  int myPerThreadCounter;
  char padding[CACHE_LINE_SIZE - sizeof(int)];
};
PerThreadState myPerThreadCounter[NUM_THREADS];
```

The demo: 8 threads on a 4-core system, each incrementing its own counter many times. Unpadded, 14.2 seconds. Padded, 4.7 seconds.

The cause is false sharing. Two processors write different addresses in the same cache line. Under MSI, every write needs M first, so the line ping-pongs between the two caches and generates heavy coherence traffic. The program has no data to communicate. All of this is artifactual communication caused by cache lines being larger than 4 bytes.

The slides close the section with a simulation figure credited to Culler, Singh, and Gupta: a 1 MB cache, four applications, and line sizes from 8 to 256 bytes, with the miss rate split into cold, capacity/conflict, true sharing, false sharing, and upgrade misses. Bigger lines help and hurt, and false sharing is one of the costs.

**Try this**: open any thread pool or parallel accumulation code you've written (for example, the worker state in [PA2](/posts/ai/2026-09-30-cs149-pa2-task-graph-scheduling-en)). Find fields that are one-per-thread, packed in an array, and written often. Pad them to 64 bytes (the line size on Skylake and in the slides) and measure before and after.

## Lecture summary

The summary slide makes three points:

1. The coherence problem exists because a single shared address space is not implemented by a single storage unit; data is replicated into local caches for performance
2. Snooping's main idea is that any cache operation that could affect coherence is broadcast to all other cache controllers. The hardware challenge is keeping the protocol's overhead low; the software challenge is watching for artifactual communication such as false sharing
3. Snooping scales only as far as broadcast does; directories are how coherence scales further

## What this post can and cannot confirm

Confirmed: the L14 slide PDF, and the lecture date and description on the course home page ("Invalidation-based coherence using MSI and MESI, false sharing"). The first 20 pages of the Fall 2025 L15 slides repeat L14's MSI, MESI, directory, and false-sharing material almost verbatim, which suggests L14 ran over into the next lecture. That is an inference from the slides; there's no recording to confirm it.

Not confirmed: what was said in the Fall 2025 lecture, and the page-by-page differences between the 2023 video and the 2025 slides. This post was not written from the video.

Further reading: locks and synchronization from the operating-system side in [CS111 Lecture 6: Implementing locks](/posts/learning/2026-08-22-stanford-cs111-lecture-06-implementing-locks-en).

**Series**: previous [PA5, the fastest kernel on an H100](/posts/ai/2026-09-30-cs149-pa5-fastest-kernels-en) | next [L15 Memory consistency](/posts/ai/2026-09-30-cs149-synchronization-memory-consistency-en) | [Series overview](/posts/ai/2026-09-30-cs149-course-overview-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [Stanford CS149 Fall 2025 home page and lecture schedule](https://gfxcourses.stanford.edu/cs149/fall25)
- [Lecture 14: Cache Coherence (slide PDF)](https://gfxcourses.stanford.edu/cs149/fall25content/media/cachecoherence/14_coherence.pdf)
- [Lecture 14, slide-by-slide web version](https://gfxcourses.stanford.edu/cs149/fall25/lecture/cachecoherence/)
- [Lecture 15 slide PDF (opens by repeating L14)](https://gfxcourses.stanford.edu/cs149/fall25content/media/sync_consistency/15_consistency.pdf)
- [CS149 2023 Lecture 11 Cache Coherence video (supplement)](https://www.youtube.com/watch?v=lrCfG2CPDEw)
- [CS149 2023 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [Assignment 2 README (stanford-cs149/asst2)](https://github.com/stanford-cs149/asst2)
