---
title: "Stanford CS111 Lecture 28: Four Ideas Connecting Concurrency, Memory, and Storage"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: en
series:
  name: "Reading Stanford CS111"
  order: 29
tldr: "Lecture 28 reduces the semester to concurrency, memory, and storage, then uses four ideas—virtualization, atomicity, locality, and layering—to explain how operating systems manage shared resources."
description: "A page-by-page reading of Stanford CS111 Spring 2026 Lecture 28, connecting processes, paging, and file systems through virtualization, atomicity, locality, and layering."
draft: true
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs111-lecture-28-course-review)

This is part 29 of [Reading Stanford CS111](/series/stanford-cs111), covering **Stanford CS111, Spring 2026, Lecture 28**. Mendel Rosenblum taught it on 2026-06-03, and its official title is [Course Review](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/28/Lecture28.pdf). This article follows the ten-page public PDF and the [course calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar) page by page. The recording is behind Canvas/Panopto and is not treated as a source read here.

The artifact audit found no duplicate deck: Lecture 28 has a different hash, page count, and title from Lectures 26 and 27. Nor is this final review merely a recitation of chapter names. Pages 2–7 inventory mechanisms along the three threads of concurrency, memory, and storage. Page 8 then extracts four cross-cutting ideas: virtualization, atomicity, locality, and layering. The real takeaway is how the latter four recur across the former three.

## Thread one: concurrency is more than “running at the same time”

Pages 2–3 divide concurrency management into processes and threads, synchronization, CPU scheduling, and deadlock. Processes and threads provide independently dispatchable units of execution. Once several execution units share state, race conditions make results depend on unpredictable interleavings. Locks, condition variables, monitors, and underlying atomic instructions restrict which interleavings may become visible.

CPU scheduling asks a different question: when several runnable threads are legal choices, which should execute now? Time slices, round robin, and priorities are policy choices, not substitutes for synchronization correctness. A scheduler can be fair while a program still has a race; a program can be data-race-free yet wait a long time under a scheduling policy.

Deadlock reminds us that individually locked operations do not guarantee global progress. The slides list limited access, no preemption, multiple independent requests, and circular wait. Once a cycle forms, every participant waits for another to release a resource. Detection accepts that this can happen and then finds the cycle; prevention first makes a necessary condition impossible. Their juxtaposition separates finding a bad state from making it unreachable.

## Thread two: memory management turns addresses into a controlled abstraction

Page 4 reviews linking and dynamic allocation. Static and dynamic linking determine when symbols bind to code. Stack and heap storage provide different lifetimes. A dangling pointer uses a name after its object has expired; a memory leak leaves allocated storage after the object is unreachable. The errors point in opposite directions, but both arise when the lifetime of a name and the lifetime of storage diverge.

The same page moves from static to dynamic relocation, then lists base-and-bound, segmentation, and paging. The common question is how program addresses map to physical memory while preserving isolation and mobility. Segmentation uses variable-size regions that resemble program structure; paging simplifies allocation with fixed-size pages. They incur different forms of fragmentation and lookup cost.

Page 5 enters the post-midterm details: x86-64 page tables, TLBs, OS address spaces, fragmentation, demand paging, and thrashing. A TLB uses locality to cache recent translations. Page faults load absent pages on demand. Prefetching predicts the future early, while a replacement policy selects a victim when capacity is full.

The slides list Random, FIFO, MIN, LRU, Clock, and global versus local replacement. MIN requires knowledge of the future and therefore serves as an ideal baseline. LRU uses the recent past to approximate the future; Clock uses a cheaper reference bit to approximate LRU. Global replacement may take pages across processes, while local replacement contains the impact within one process. When combined working sets exceed available memory, the system may spend its time moving pages instead of doing work: thrashing.

## Thread three: storage ties persistence, naming, and hardware cost together

Page 6 begins with disk mechanisms: operations, interrupts, programmed I/O, and DMA describe how the CPU and device exchange data. One layer above, files provide sequential, random, and keyed access; inodes hold file metadata and block indexes. Contiguous, linked, multilevel-index, FAT, and Unix-inode layouts trade off random access, growth, index space, and failure impact.

Block size also has no universal optimum. Larger blocks can reduce index and I/O operations but increase internal fragmentation. Smaller blocks save tail waste while raising metadata and positioning costs. Free-space structures such as linked lists and bitmaps make similar trade-offs among search, updates, and space overhead.

Page 7 connects these structures to performance and recovery. A buffer cache uses delayed writes to combine and reorder I/O. Disk scheduling chooses request order with FIFO, shortest positioning time first, or CSCAN. A directory is a naming layer: hard links let several names refer to one inode, while symbolic links store a path for another round of resolution.

The three crash-recovery answers are `fsck`, ordered writes, and write-ahead logging: scan globally after failure, constrain write order beforehand, or first record replayable intent. Flash memory and the FTL provide one more instance of layering. Upper levels still see a block interface while the lower layer handles erase-before-write, wear leveling, and logical-to-physical mapping.

## Four cross-cutting ideas form the real index to the course

Page 8 reduces the long vocabulary list to four ideas.

First is **virtualization**: make one thing look like another thing, or like many instances. Threads virtualize opportunities to run on a CPU. Files turn a storage device into named byte sequences. Address spaces make each process appear to have its own memory. Virtualization does not pretend resources are infinite; mapping, protection, and multiplexing provide a stable interface.

Second is **atomicity**: make several steps appear externally as one indivisible operation. A lock-protected critical section and a journal transaction belong to different chapters but pose the same question: can an observer see a half-completed state? Hardware atomic instructions, locking protocols, and write-ahead ordering answer it at different layers.

Third is **locality**: the recent past often predicts the near future. Schedulers, TLBs, page replacement, and buffer caches use temporal or spatial locality to reserve expensive resources for likely reuse. Locality is an empirical pattern, not a correctness guarantee; caches and prefetchers can mispredict when workloads change.

Fourth is **layering**: use a higher-level abstraction to hide lower-level detail. A thread does not manipulate each context switch directly. A file caller does not schedule a disk head or flash erase block. A virtual-memory user does not calculate every physical allocation. Layering concentrates hard problems, but cross-layer effects still leak through: `fsync`, page faults, and DMA all remind upper layers that the machinery below has costs.

## How to use this review as a self-test

Do not memorize the lists in slide order. Pick one mechanism—a TLB, condition variable, or journal—and draw four columns: what it virtualizes, which atomic boundary it needs, which locality it exploits, and which layers it connects. If one column remains empty, that does not prove the mechanism lacks the property; return to the original lecture before forcing an answer.

Then run a failure test. Remove the mechanism and ask whether the observable result is slower performance, an incorrect result, broken isolation, or lost data. This separates why a mechanism exists from how it is implemented and distinguishes a policy change from an interface break.

## The next courses are directions, not a difficulty ranking

[Page 9](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/28/Lecture28.pdf) lists CS112, CS140E, CS240, CS143, CS145, CS144, and CS244C. The slide points respectively toward kernel implementation, OS design, advanced OS, compilers, databases, networking, and distributed systems. This is a map of directions, not a guaranteed prerequisite order. Course numbers, titles, and availability can change, so actual enrollment decisions should use the current Stanford catalog.

If the compelling part of CS111 was how abstractions reach the kernel, continue toward kernel implementation. If it was translation and runtime behavior, compilers extend linking, address spaces, and control transfer. If it was persistent state and transactions, databases push consistency further. If it was partial failure across machines, networking and distributed systems remove the course's single-machine assumptions one by one.

## Page-by-page coverage checklist

- Pages 1–2: course review and the three major topics of concurrency, memory, and storage.
- Page 3: processes, threads, dispatch, synchronization, scheduling, and deadlock.
- Pages 4–5: linking, allocation, relocation, segmentation, paging, TLBs, demand paging, replacement, and thrashing.
- Pages 6–7: disk I/O, file access, inodes, block layouts, free space, caching, scheduling, links, crash recovery, and FTL.
- Page 8: virtualization, concurrency, atomicity, locality, and layering.
- Pages 9–10: directions for further courses and the closing slide.

## References

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 28 slides: Course Review](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/28/Lecture28.pdf)
