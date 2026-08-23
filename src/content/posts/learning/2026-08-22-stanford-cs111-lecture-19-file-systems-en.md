---
title: "Stanford CS111 Lecture 19: File Abstractions, Allocation, and FAT"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: en
series:
  name: "Reading Stanford CS111"
  order: 20
tldr: "A file system maps durable byte collections onto disk blocks; contiguous, linked, and FAT allocation trade locality, growth, random access, and metadata cost."
description: "A lecture-by-lecture reading of Stanford CS111 Spring 2026 Lecture 19: file abstractions, access patterns, inodes, contiguous/linked allocation, and FAT."
draft: true
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs111-lecture-19-file-systems)

This is part 20 of [Reading Stanford CS111](/series/stanford-cs111), covering **Stanford CS111, Spring 2026, Lecture 19**. Mendel Rosenblum taught it on 2026-05-11; the official title is [File Systems](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/19/Lecture19.pdf). This article follows the public PDF and [course calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar). The Canvas/Panopto recording is not public and is not treated as reviewed.

## Four problems on a high-latency disk

Disks have high latency but relatively fast sequential transfer. A file system handles disk-space management for capacity, seeks, and efficiency; naming from names to blocks; reliability across OS and hardware failure; and protection with isolation and controlled sharing.

The goals interact. Contiguity improves locality but constrains growth; metadata accelerates lookup but consumes space and adds crash-consistency state. This deck focuses on layout. It names but does not teach directory lookup, journaling, or permission-check algorithms, so later material is not imported.

## User bytes and kernel blocks

Users see a file as a named, durable collection of bytes. The kernel sees disk blocks plus metadata. The byte stream hides sectors, while the kernel translates an offset into a block and in-block position.

Sequential access processes bytes in order; [The slide](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/19/Lecture19.pdf) estimates about 90% on then-current machines. That is a deck snapshot, not every workload. Random access addresses any position and serves paging datasets and databases. Keyed access searches by contents, as in hash tables and dictionaries, and is normally supplied by databases rather than the OS.

Most files are small, demanding low per-file overhead, while most space and I/O belong to large files, demanding throughput. Files also grow unpredictably. A design optimized only for an “average” file can hurt both populations.

## The inode is a per-file index node

An inode is one OS structure per file, resident in memory while open and stored on disk beside file data. The deck lists size, occupied sectors, last-read/write times, owner and group IDs, and rwx protection. The name is absent from this inode list; name-to-inode resolution is another layer.

Its core task is mapping bytes to sectors with little metadata. Fast byte lookup and compact indexing are the evaluation criteria. Contiguous, linked, and FAT allocation answer the same mapping problem differently.

## Contiguous allocation: shortest index, hardest growth

Contiguous allocation gives a file one sector extent. Its inode needs only first sector and length, resembling base-and-bound or segmentation. Offset arithmetic is direct, random and sequential access are easy, and sequential I/O needs few seeks.

Creation requires a length and the OS tracks free disk areas. Growth may find no adjacent room; over-reservation wastes capacity. External fragmentation can leave sufficient total space but no sufficiently large hole.

[The deck](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/19/Lecture19.pdf) cites IBM OS/360: simple, compact, and excellent sequentially, but poor for prediction, extension, and fragmentation. Modern “extent-based” systems may support many extents; those later capabilities should not be projected onto this single-extent historical model.

## Linked allocation: easy growth, expensive location

Linked files use fixed blocks; [The slide](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/19/Lecture19.pdf) deliberately writes “4096 bytes?”, making it illustrative rather than normative. The inode points to the first block, each block points to the next, and a linked free list tracks free blocks. Appending takes any free block, without predicting size or finding a large hole.

Sequential access follows links but scattered blocks cause seeks. Random access to block k walks k−1 preceding links. Pointers consume data space and a broken link can lose the tail. TOPS-10 and Xerox Alto are labeled “more or less” examples, so they are similar rather than asserted identical.

Growth and external fragmentation improve at the cost of locality and direct indexing. Freedom of placement is not free: without another index, lookup cost grows with chain length.

## FAT moves all links into an in-memory table

MS-DOS FAT preserves linked allocation but centralizes next pointers. Each disk block has an entry containing a next block, end marker, or free marker. A directory entry names the first block; allocation scans free entries, possibly starting near the file's tail.

In [The slide](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/19/Lecture19.pdf) example A follows 6 → 4 → 3 → end, while B follows 1 → 2 → end. Chains may remain scattered, but the normally memory-resident FAT avoids reading data blocks just to chase pointers. Random lookup remains linear but faster; data blocks hold no pointer. Free markers make FAT the free list too.

Sequential performance approaches contiguous allocation when unfragmented, but scattered blocks add seeks. The global table consumes memory and free space fragments. FAT does not remove chaining; it moves traversal to a faster tier.

## FAT16, FAT32, and historical slide anomalies

[The deck](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/19/Lecture19.pdf) says original FAT used 16-bit integers with 512-byte blocks, yielding 32 MB; the simplified 2^16 × 512 arithmetic matches that magnitude. It says Microsoft introduced FAT32 in 1996, with 28 sector-number bits and 2–32 KB clusters fixed at file-system creation.

Its 4 KB cluster/1 TB and 32 KB cluster/8 TB figures match simplified 28-bit cluster arithmetic. They are not the complete Microsoft rules for reserved values, volume sizes, and tooling ([official slides](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/19/Lecture19.pdf)).

[The slide](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/19/Lecture19.pdf) also labels FAT on the “original IBM PC (1983).” IBM's PC history places the IBM 5150 introduction in 1981; 1983 aligns more closely with PC/XT. The safe claim is that early IBM PCs used FAT, not that the original PC launched in 1983, so the parenthesis is not a precise product chronology.

## What the three allocations exchange

Contiguous allocation trades difficult growth and fragmentation for tiny metadata and locality. Linked allocation trades pointers, seeks, and linear random lookup for arbitrary growth. FAT centralizes memory-resident links to improve traversal and preserve data-block capacity, at the cost of a disk-sized global table and persistent fragmentation.

Test three workloads: fixed-size sequential files favor contiguity; unpredictable append needs growth; large random-access files reject on-disk link chasing. The lecture declares no universal winner. It makes metadata placement and physical distribution comparable.

## Update history

- 2026-08-22: Rewritten against the official Lecture 19 PDF, noting the 4 KiB question mark, simplified capacity model, and IBM PC date anomaly.

## References

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 19 slides: File Systems](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/19/Lecture19.pdf)
- [IBM: The IBM PC](https://www.ibm.com/history/personal-computer)
- [OSTEP: File System Implementation](https://pages.cs.wisc.edu/~remzi/OSTEP/file-implementation.pdf)
