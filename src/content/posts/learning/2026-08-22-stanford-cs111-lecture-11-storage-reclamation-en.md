---
title: "Stanford CS111 Lecture 11: Dynamic Storage Management, Continued"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: en
series:
  name: "Reading Stanford CS111"
  order: 12
tldr: "Lecture 11's official PDF is byte-identical to Lecture 10; this article preserves that artifact gap and focuses on reachability, dangling pointers, leaks, reference-count cycles, and mark/compact garbage collection."
description: "A reading of Stanford CS111 Spring 2026 Lecture 11 on its duplicated official PDF, pointer reachability, reference counting, cycles, garbage collection, compaction, and reclamation costs."
draft: true
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs111-lecture-11-storage-reclamation)

This is part 12 of [Reading Stanford CS111](/series/stanford-cs111), covering **Stanford CS111, Spring 2026, Lecture 11**. Mendel Rosenblum taught the lecture on 2026-04-22; its official title is [Dynamic Storage Management, Continued](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/11/Lecture11.pdf). This article uses the public PDF and the [course calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar). The recording is behind Canvas/Panopto and is not treated as a source read for this article.

The material has an important anomaly: official `Lecture10.pdf` and `Lecture11.pdf` have the same SHA-256 (`368092c0...e67cb`) and are byte-identical 22-page files, although the calendar calls April 22 **Dynamic Storage Management, Continued**. The Canvas recording is unavailable, so the actual in-room continuation cannot be reconstructed. This article does not invent boundary tags or other absent content; it focuses on storage reclamation explicitly present in the repeated deck's latter half.

## 1. Placement and reclamation are different questions

`allocate(size) -> ptr` finds space and `free(ptr)` returns it. Stacks, free lists, first/best fit, slabs, and bitmaps answer where storage should go. Reclamation asks the prior question: **when can an object never be accessed again?**

The PDF uses pointer reachability: an object is accessible if a pointer to it exists; without one it is safe to reclaim. A single-owner tree is easier than a shared graph, where all users must finish. The runtime must also identify pointers reliably rather than guessing whether a machine word is an address.

## 2. Dangling pointers and memory leaks

Reclaiming too early creates a **dangling pointer**. The allocator may reuse the block while old code still reads or writes it, exposing unrelated data or corrupting the new owner. The failure can depend on allocation order, so one successful run proves little.

Reclaiming too late creates a **memory leak**: unreachable storage never returns to the allocator. A long-running process grows until heap expansion or allocation fails. Conservative retention reduces dangling risk but increases leaks; aggressive reclamation reverses the risk. An algorithm needs a checkable death condition.

## 3. The local contract of reference counting

Reference counting stores the number of pointers to each object. Creating a reference increments it, removing one decrements it, and zero frees the object. The PDF names C++ `std::shared_ptr`, early JavaScript, Python, and file-system inodes.

The decision is local and can reclaim immediately without scanning the heap. The cost is that every pointer assignment must update counts correctly, with synchronization under sharing. A missing increment can free too early; a missing decrement leaks.

## 4. Why cycles defeat reference counts

Let A point to B, B to C, and C back to A. After every external root disappears, the objects are unreachable, but every count remains positive. Nothing reaches zero, so the entire cycle leaks.

This is not fixed by a wider counter. Incoming-edge counts cannot answer whether a path exists from a root. A system needs cycle detection or a reachability traversal. The PDF uses cycles to mark the boundary of reference counting rather than claiming Python uses counts alone for every object.

## 5. Garbage collection finds the live set from roots

In a garbage-collected model, applications remove pointers instead of calling `free`. The collector finds live objects, deletes the rest, and may compact memory. The slides list Java, JavaScript, Go, and some Python implementations without implying one common collector.

Responsibility moves to the language environment, which must know object boundaries, pointer fields, and roots. Unreachable cycles can be collected, at the cost of tracing, extra memory, and pauses. GC does not eliminate every leak: an unnecessary pointer retained by a root still makes an object live.

## 6. The PDF's mark and compact passes

Pass 1 starts with pointers in statically allocated and procedure-local variables—the roots—and **marks** their objects, recursively following edges until the reachable graph is marked. The language environment must help identify pointers.

Pass 2 walks objects, copies live ones into contiguous memory, updates every pointer to a moved object, and frees the remainder. The slide labels this sweep while also describing copying and compaction; this article preserves that wording rather than imposing one universal textbook definition of classic mark-sweep.

Compaction also reduces external fragmentation, but pointer updates are a hard invariant. Missing one live reference makes the collector create a dangling pointer. Pinned objects, concurrent mutation, and precise stack maps are outside the public PDF.

## 7. GC costs and the material boundary

The slides give magnitudes of 10–20% of CPU time, 2–5× overallocation, and long pauses. They communicate trade-offs, not benchmarks for every runtime, heap, collector, and workload. Generational, incremental, and concurrent techniques are not in these 22 pages. ([official lecture PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/11/Lecture11.pdf))

The conclusion is not that GC always beats manual free. Reference counting buys local decisions but misses cycles; tracing GC buys global reachability while paying scan, space, and pause costs; manual reclamation leaves programmers exposed to dangling pointers and leaks. The duplicated artifact justifies this article's shorter length: these seven sections cover every reclamation item in the PDF without padding the article by repeating Lecture 10's placement discussion.


## References

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 11 slides: Dynamic Storage Management, Continued](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/11/Lecture11.pdf)
- [Operating Systems: Principles and Practice](https://ospp.cs.washington.edu/)
- [Python C API: Reference Counting](https://docs.python.org/3/c-api/refcounting.html)
- [Python: Garbage Collector interface](https://docs.python.org/3/library/gc.html)
- [Go: A Guide to the Go Garbage Collector](https://go.dev/doc/gc-guide)
