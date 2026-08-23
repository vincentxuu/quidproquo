---
title: "Stanford CS111 Lecture 10: Dynamic Storage Management"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: en
series:
  name: "Reading Stanford CS111"
  order: 11
tldr: "Lecture 10 moves from predictable LIFO stacks to heap free lists, first/best fit, and slabs, then compares reference counting with mark-and-sweep across dangling pointers, leaks, cycles, and fragmentation."
description: "A slide-by-slide reading of Stanford CS111 Spring 2026 Lecture 10 on dynamic allocation, stacks and heaps, fragmentation, free lists, slabs, bitmaps, reference counting, and garbage collection."
draft: true
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs111-lecture-10-dynamic-storage-allocation)

This is part 11 of [Reading Stanford CS111](/series/stanford-cs111), covering **Stanford CS111, Spring 2026, Lecture 10**. Mendel Rosenblum taught the lecture on 2026-04-20; its official title is [Dynamic Storage Management](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/10/Lecture10.pdf). This article uses the public PDF and the [course calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar). The recording is behind Canvas/Panopto and is not treated as a source read for this article.

Dynamic storage management asks how applications and operating systems manage memory or storage under unpredictable demand. The interface is tiny: `allocate(size) -> ptr` returns a block, and `free(ptr)` returns one. The allocator does not know how long a block will live or how large the next request will be. Memory is today's case; disk storage returns later in the course.

The same requests leave different hole patterns when frees arrive in a different order. The allocator cannot see whether splitting a large block now will block a large future request. Placement is therefore an online decision made from current free-space state, with future fragmentation as a consequence.

## 1. Stack allocation trades ordering restrictions for constant time

Stack allocation supports last allocated, first freed (LIFO) lifetimes. A single stack pointer moves on allocation and moves back on free. Nested calls and recursion naturally have this order; tree traversal, expression evaluation, and top-down recursive-descent parsing are other slide examples.

Allocated and free space each remain contiguous, and operations are addition or subtraction, so holes do not accumulate. The price is predictable nesting: freeing an older object before a newer one breaks the model. The C++ slide places globals, stack locals, and a `new int(42)` heap object together to show that storage class follows lifetime rather than merely data type.

## 2. Heap allocation and fragmentation

Trees, graphs, and shared structures often create and delete objects in arbitrary order and need heap allocation—heap here means a storage region, not the priority-queue data structure. Arbitrary frees interleave allocated chunks and free holes. If no hole is large enough, the allocator grows the heap segment.

The goal is few, large holes. **Fragmentation** is inefficient memory use caused by many small holes: total free bytes can be sufficient while no contiguous region satisfies a large request. Stack free space stays contiguous; a heap allocator needs a free list and must search it.

Core invariants are that allocated blocks do not overlap, the free list represents all available storage exactly, and adjacent holes are coalesced when the policy requires it. Invalid or double frees can violate them. The PDF concentrates on management algorithms rather than defensive checks.

## 3. First fit, best fit, and coalescing

An early free list is a linked list of holes. **Best fit** scans for the closest size and returns leftover space to the list. **First fit** stops at the first adequate region. Best fit tries to reduce immediate waste; first fit reduces search. Both can create many small holes. ([official lecture PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/10/Lecture10.pdf))

Free operations merge adjacent blocks. A 64-byte hole next to a returned 128-byte block can become a useful 192-byte region; leaving two entries creates false scarcity. Coalescing requires location and size metadata and consistent updates. ([official lecture PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/10/Lecture10.pdf))

The PDF's failures are large requests that fail or force heap growth and expensive scans over small holes. Best fit is not guaranteed to be best over time: a locally tight choice can leave unusable fragments.

## 4. Slab allocation makes the common fixed-size case fast

A slab is a region divided into equal chunks. Popular sizes have separate pools and each slab has a free list. Allocation takes from the appropriate slab; if empty, it allocates a new slab and divides it. Free returns a block to its slab; a wholly free slab can itself be released.

The common path is fast because it does not scan mixed-size holes. Operating systems benefit because kernels repeatedly allocate a small set of structure sizes. The PDF explicitly claims fixed-size pools and speed; additional cache effects are not required for its argument.

Slabs do not eliminate fragmentation. Unused chunks inside a partially occupied slab cannot serve another size, especially when the allocation-size distribution changes. Fixed-size predictability is exchanged for stranded capacity.

## 5. Bitmaps represent fixed-size free storage

A bitmap uses one bit per chunk: zero means free and one allocated. It fits slab chunks and, later, disk blocks. Metadata is compact compared with pointers in every free block, but allocation may scan bit arrays for a free block or run.

Granularity controls the trade-off. Large chunks shrink metadata but waste space inside allocations; small chunks improve precision while increasing bitmap and scan cost. The PDF leaves detailed disk bitmap treatment to file-system lectures.

## 6. Reclamation asks when a block is truly dead

Placement asks where free space goes; reclamation asks when an object is no longer accessible. The slides assume accessibility through pointers: no pointer means no future access and safe reclamation. Single-owner trees are easier; shared objects cannot be freed until every user is finished.

Freeing too early creates a **dangling pointer**, which may read storage already reassigned. Never freeing unreachable storage creates a **memory leak**. One demands conservative retention and the other aggressive death detection, so “free more” is not a common solution.

## 7. Reference counting and cycles

Reference counting stores the number of pointers to each object. New references increment, removed references decrement, and zero frees the object. Examples include C++ `std::shared_ptr`, early JavaScript, Python, and file-system inodes. Reclamation is local rather than a whole-heap scan.

Cycles are the central failure. If A points to B, B to C, and C to A, all counts remain positive after external references disappear, so the cycle leaks. Every pointer assignment must also update counts correctly. The PDF does not claim reference counting alone computes general reachability.

## 8. Garbage collection and mark-and-sweep

In a garbage-collected model, the program deletes pointers rather than calling `free`. A collector finds live objects, removes the rest, and may compact memory. The slides name Java, JavaScript, Go, and some Python implementations without claiming that they all use one collector.

The presented implementation has two passes. Mark starts at pointers in statically allocated and procedure-local variables—the roots—and recursively marks reachable objects; the language environment must identify pointers. Sweep copies and compacts live objects into contiguous memory, updates every pointer to moved objects, and frees the remainder.

The PDF combines sweep with copying/compaction; this article preserves that agenda rather than declaring it the only textbook meaning of mark-sweep. Its invariant is clear: every live reference must be updated after movement, or compaction creates dangling pointers.

## 9. GC costs and the lecture's conclusion

The slides give cost magnitudes of 10–20% of CPU time, 2–5× overallocation, and long pauses. These illustrate trade-offs, not guarantees for every runtime, heap, and workload. Generational, incremental, and concurrent designs lie outside the public deck. ([official lecture PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/10/Lecture10.pdf))

The lecture can be unified as prediction exchanged for efficiency. Predictable LIFO lifetime makes a stack pointer nearly free. Arbitrary heap lifetime needs free lists and placement. Fixed sizes enable slabs and bitmaps. Trackable ownership makes reference counts direct. General graph reachability requires collection and pays scan, space, and pause costs. No allocator simultaneously provides arbitrary lifetimes, zero fragmentation, constant time, immediate reclamation, and zero metadata.

## References

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 10 slides: Dynamic Storage Management](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/10/Lecture10.pdf)
- [Operating Systems: Principles and Practice](https://ospp.cs.washington.edu/)
- [Wilson et al.: Dynamic Storage Allocation Survey](https://www.cs.cmu.edu/afs/cs.cmu.edu/academic/class/15213-f98/doc/dsa.pdf)
- [Linux kernel: Slab allocation](https://docs.kernel.org/mm/slab.html)
- [Python documentation: Reference counting and cyclic garbage collection](https://docs.python.org/3/c-api/memory.html)
