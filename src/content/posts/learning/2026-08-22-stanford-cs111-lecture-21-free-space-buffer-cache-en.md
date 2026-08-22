---
title: "Stanford CS111 Lecture 21: Block Cache, Free Bitmaps, and Delayed Allocation"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: en
series:
  name: "Reading Stanford CS111"
  order: 22
tldr: "Block cache retains hot indexes, bitmap slack preserves placement choices, and fragments plus delayed allocation trade later, better information for locality."
description: "A focused reading of Stanford CS111 Spring 2026 Lecture 21: block cache, write policy, free bitmaps, fragments, repacking, and delayed allocation."
draft: true
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs111-lecture-21-free-space-buffer-cache)

This is part 22 of [Reading Stanford CS111](/series/stanford-cs111), covering **Spring 2026 Lecture 21**, taught by Mendel Rosenblum on 2026-05-15 under [File Systems, Continued](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/21/Lecture21.pdf). The official [Lecture 20 PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/20/Lecture20.pdf) and Lecture 21 PDF are byte-identical, both SHA-256 `42e4021f84ed272db95224024c878a09d6c719430efc386c2614dcc8ef94310d`. Inaccessible Canvas/Panopto video prevents recovering the spoken boundary.

This article focuses on cache, free-space bitmaps, fragments, repacking, and delayed allocation. Direct/indirect inode walks and disk scheduling belong to [Lecture 20](/posts/learning/2026-08-22-stanford-cs111-lecture-20-file-system-indexes); duplicate prose is not evidence of a second [deck](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/21/Lecture21.pdf).

## Block cache removes cold index I/O

Without caching, a BSD inode's indirect path may add two index reads before data. The OS retains recent disk blocks in memory; frequently used indirect and inode blocks stay under the slide's LRU replacement policy.

The “double fault” becomes a cold-cache upper path, not a fixed charge. After one tree walk, adjacent reads tend to reuse indexes. The layout is unchanged, but latency becomes a few disk misses and many DRAM hits.

File cache and virtual memory compete for physical memory. More cached metadata means fewer process pages, so cache sizing is a global capacity policy rather than an independent pool.

## When modified cache blocks reach disk

Synchronous write immediately writes through and stalls the process. Completion is less likely to leave data only in volatile DRAM, but every small change can become disk I/O.

Delayed write marks a block dirty and flushes later. [The deck](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/21/Lecture21.pdf)'s “30 seconds?” is illustrative, not guaranteed. Repeated indirect-block changes coalesce, and a temporary file deleted early may need no data I/O.

The cost is a crash window for dirty contents. The safe/dangerous labels simplify durability: synchronous writes alone do not solve controller caches, ordering, or multi-block consistency. Recovery protocols are outside this deck section.

## From a free list to a free bitmap

Early Unix linked free blocks. Initial ordering encouraged contiguity, but allocation and deletion scrambled the list. A chain answers whether space exists but poorly exposes a nearby run.

A bitmap stores one bit per block: one free, zero used. At 1 TiB and 4 KiB, 2^28 blocks need 2^28 bits, or 32 MiB. This arithmetic belongs to [The deck](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/21/Lecture21.pdf) model and excludes reserved regions or other block sizes.

The allocator scans near a file's previous block. With slack it usually finds a good location; near full, search grows and remaining holes lose locality. The bitmap reveals distribution but does not abolish fragmentation.

## Why pretend the disk is 10% smaller

[The deck](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/21/Lecture21.pdf) reserves 10% and reports full at 90%. This is not a universal threshold. Slack gives the allocator alternative positions and a better chance of keeping file blocks close.

Measured only in bytes it looks wasteful; including seeks, search, and future growth shows that it buys choice. Near 100%, scattered free blocks may remain but be expensive and badly placed. Capacity policy is performance policy ([official slides](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/21/Lecture21.pdf)).

## Large blocks and internal fragmentation

Early 512-byte blocks required more transfers and gave only 128 four-byte pointers per 4 KiB indirect block; [The deck](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/21/Lecture21.pdf) estimates one-percent pointer space. A 4 KiB block improves I/O and fan-out but enlarges unused file tails.

The “almost half” waste claim assumes many small files and no ordinary block sharing. It is workload-dependent, not a law. Unit size jointly controls transfer granularity, index depth, and fragmentation.

## 4.3BSD fragments separate two granularities

4.3BSD uses 4 KiB blocks for most data but allows the last file block to use 512-byte-multiple fragments. Fragments from different files share a large block, and the bitmap operates at fragment granularity ([official slides](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/21/Lecture21.pdf)).

Only the tail may fragment. Arbitrary small pieces everywhere would restore metadata and I/O overhead. The exception targets the location where internal fragmentation actually appears.

## Repacking and delayed allocation

Unknown-size files grow one block at a time; small files fragment space while large files want extents. Newer techniques may use 16 KiB blocks and 2 KiB fragments, allocate singly at first, then repack a grown file into contiguous clusters, trading movement for future locality ([official slides](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/21/Lecture21.pdf)).

Allocation can also wait until cache flush. By then the OS sees many dirty blocks and allocates a cluster together. Delayed allocation postpones location; delayed write postpones transfer. They often combine but are analytically distinct.

The slide says cheap disk makes internal fragmentation less important. That is relative, not disappearance; small devices, quotas, and tiny-file workloads differ. Lower capacity cost makes trading space for less metadata and higher throughput more attractive.

## Update history

- 2026-08-22: Focused the duplicate Lecture 20/21 PDF on cache, free space, fragments, and delayed allocation, recording the shared SHA and video boundary.

## References

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 21 slides: File Systems, Continued](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/21/Lecture21.pdf)
- [FreeBSD inode(5) manual](https://man.freebsd.org/cgi/man.cgi?query=inode&sektion=5)
- [OSTEP: File System Implementation](https://pages.cs.wisc.edu/~remzi/OSTEP/file-implementation.pdf)
