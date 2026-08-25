---
title: "Stanford CS111 Lecture 20: Multilevel Inodes, Index Walks, and Disk Scheduling"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: en
series:
  name: "Reading Stanford CS111"
  order: 21
tldr: "The 4.3BSD inode uses direct, single-indirect, and double-indirect tiers so lookup depth scales with file size; FIFO, SPTF, SCAN, and CSCAN then trade seek cost, fairness, and wait time."
description: "A reading of Stanford CS111 Spring 2026 Lecture 20: multilevel inodes, index walks for blocks 5, 23, and 1040, the double-fault problem, and disk scheduling."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs111-lecture-20-file-system-indexes)

This is part 21 of [Reading Stanford CS111](/series/stanford-cs111), covering **Spring 2026 Lecture 20**. Mendel Rosenblum taught it on 2026-05-13; the official title is [File Systems, Continued](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/20/Lecture20.pdf). The official Lecture 20 and [Lecture 21 PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/21/Lecture21.pdf) files are byte-identical, both SHA-256 `42e4021f84ed272db95224024c878a09d6c719430efc386c2614dcc8ef94310d`. Inaccessible Canvas/Panopto video prevents recovering the actual spoken boundary.

This article therefore owns [The deck](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/20/Lecture20.pdf)'s opening multilevel-inode/index-walk material and its closing disk-scheduling material. Block cache, write policy, free bitmaps, fragments, and delayed allocation are concentrated in [Lecture 21](/posts/learning/2026-08-22-stanford-cs111-lecture-21-free-space-buffer-cache). This is an editorial partition of a byte-identical artifact, not a claim that the public material reveals the exact classroom split.

## A 4.3BSD inode is an on-demand tree

Disk and file use 4 KiB blocks. The inode roots a page-table-like pointer tree with fourteen pointers; zero means absent. The first twelve point directly to file blocks 0–11, so small files need no index I/O ([official slides](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/20/Lecture20.pdf)).

Pointer thirteen names a single-indirect block containing 1,024 four-byte pointers, covering blocks 12–1035. Pointer fourteen names a double-indirect block whose entries name indirect blocks. Index blocks are allocated only when needed, keeping small-file metadata low while fixing a large maximum. Truncation must free index blocks that no longer lead to data; otherwise the on-demand tree only grows and strands empty indexes ([official slides](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/20/Lecture20.pdf)).

[The slide](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/20/Lecture20.pdf) note “4GB (4TB with triple)” is ambiguous: the pictured fourteen-pointer layout has only direct, single, and double tiers. At 4 KiB and fan-out 1,024, double indirect adds about 4 GiB; 4 TiB needs a triple tier. The article treats 4 TiB as an extension, not a feature drawn in this layout.

## Walking blocks 5, 23, and 1040

Block 5 uses direct pointer 5. With a cached inode, only data I/O remains. Block 23 subtracts twelve direct blocks and selects entry 11 in the single-indirect table, far better than chasing 23 linked blocks ([official slides](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/20/Lecture20.pdf)).

Block 1040 exceeds 1035 and uses double indirect. After subtracting 1,036 blocks, offset 4 selects the first indirect branch and its entry 4. In general quotient chooses an indirect block and remainder chooses its data entry ([official slides](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/20/Lecture20.pdf)).

Lookup depth grows by file-size tier rather than linearly with offset. A double-indirect cache miss may need two index reads before data—the deck's “double-fault problem.” Here fault means absent cached disk-index block, not CPU page fault.

## Benefits and limits of the BSD inode

It is simple and Assignment-7-friendly, needs no declared size, allocates index blocks lazily, serves small files fast, and consumes less memory than a disk-wide FAT. Each file carries only its own required index.

Large access may add two index reads, and a block-by-block free list gives poor locality. Indexing solves how to find a block, not whether blocks are nearby; logical lookup and physical placement remain distinct policies.

## From logical lookup to physical I/O

The inode tree answers which disk block corresponds to a logical block. It does not decide physical proximity or which of several pending I/Os runs first. [Lecture 21](/posts/learning/2026-08-22-stanford-cs111-lecture-21-free-space-buffer-cache) fully owns index-cache hits, free-space and block-size policy, fragments, write policy, and delayed allocation. The boundary retained here is simple: once lookup produces physical requests, the disk scheduler can order them.

## FIFO, SPTF, SCAN, and CSCAN

With queued I/O, scheduling minimizes seek. FIFO preserves arrival order but ignores position. Shortest positioning time first minimizes immediate seeks but can starve distant requests. SCAN serves one direction then reverses; CSCAN serves one direction and jumps back, tending toward more uniform waits.

The last diagrams compare one pending set: FIFO has long seeks, SPTF minimal seeks, and CSCAN a single-direction sweep. PDF extraction merges adjacent labels as “71,” so it cannot establish whether these are 7 and 1 or 71. No exact traversal is invented from that artifact ([official slides](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/20/Lecture20.pdf)).

## Update history

- 2026-08-22: Partitioned the byte-identical Lecture 20/21 deck; this article now focuses on inode index walks and disk scheduling, while Lecture 21 owns cache, free-space, and allocation policy.

## References

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 20 slides: File Systems, Continued](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/20/Lecture20.pdf)
- [FreeBSD inode(5) manual](https://man.freebsd.org/cgi/man.cgi?query=inode&sektion=5)
- [OSTEP: File System Implementation](https://pages.cs.wisc.edu/~remzi/OSTEP/file-implementation.pdf)
