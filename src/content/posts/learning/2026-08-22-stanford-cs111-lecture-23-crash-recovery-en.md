---
title: "Stanford CS111 Lecture 23: From fsck and Ordered Writes to Write-Ahead Logging"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: en
series:
  name: "Reading Stanford CS111"
  order: 24
tldr: "A single file-system operation updates several blocks, but a crash can occur between any two writes; this lecture compares how fsck, ordered writes, and write-ahead logging trade recovery time, performance, durability, and consistency."
description: "A reading of Stanford CS111 Spring 2026 Lecture 23: file-system crash models, fsck repair, ordered writes, and the entry point to write-ahead logging."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs111-lecture-23-crash-recovery)

This is part 24 of [Reading Stanford CS111](/series/stanford-cs111), covering **Stanford CS111, Spring 2026, Lecture 23**. Mendel Rosenblum taught the lecture on 2026-05-20; its official title is [File System Crash Recovery](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/23/Lecture23.pdf). The public PDF has 23 pages. Its SHA-256 differs from Lecture 24, yet their content is nearly identical: extracted text differs only in the slash in `/lost+found` and four periods. A different hash therefore does not establish independent material. This article owns the crash model, `fsck`, ordered writes, and the WAL entry point; Lecture 24 continues with transactions, checkpoints, and durability. The recording sits behind Canvas/Panopto, and this article does not treat unwatched spoken material as a source.

The lecture asks one sharp question. A file-system operation may modify the free map, an inode, and a directory entry across several disk blocks, but disks do not provide arbitrary atomic multiblock writes. If power fails in the middle, which version should the rebooted system trust? The slides compare three answers in order: scan and repair afterward with `fsck`, constrain write order beforehand, or record an operation in a log before applying it. All three address consistency, but they choose different costs in lost data, startup time, and normal-path performance.

## Most OS state can restart after a crash; file-system state cannot

Page 3 narrows the problem. Reboot clears volatile memory, so scheduling queues, process tables, and similar state can be rebuilt from a clean slate. Users, however, expect disk data to survive a crash. “Start over” would abandon the file system's central persistence promise.

Page 4 separates two hazards. The first is **data loss**: recent changes remain in the block cache and have not reached disk. [The slides](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/23/Lecture23.pdf) use original Unix delaying as much as roughly 30 seconds of changes as a historical example; this is a classroom case, not a fixed guarantee for every modern `write`. The second is **inconsistency**: one logical operation spans several metadata blocks, and only some reach disk. The buffer cache may also reorder writes, so program update order is not necessarily persistence order at the device.

Two examples make a partial update concrete. While allocating a new block, the free map may already mark it occupied while the inode does not yet point to it. While creating a hard link, the directory entry may exist before the inode reference count increases. The first case leaks space; the second makes the number of names pointing to an inode disagree with its count. The problem is not merely one missing record. The disk now contains mutually incompatible claims.

## Approach one: fsck reconstructs consistency from global metadata

Pages 5–10 introduce Unix `fsck` (file system check). A normal shutdown writes a clean bit at the end. Startup can skip a full scan when that marker is present; otherwise, it reads inodes, indirect and doubly indirect blocks, the free map, and directories, then detects and repairs contradictory metadata. This design allows updates to happen first and reconstructs a valid state from global invariants after failure ([official slides](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/23/Lecture23.pdf)).

The slides first offer two relatively unambiguous repairs. If an inode references a block that the free map still calls available, `fsck` should remove it from the free set, or a later allocation may give the same block to another file. If an inode's reference count differs from the actual number of links found in all directories, the scan can correct the count. Complete metadata points toward one defensible answer in both cases.

The harder case is one block belonging to two inodes. A sequence involving deletion of A, creation of B, delayed writeback, and reordering can produce it. The repair program lacks the original intent and sees only the accident scene. It could let either file keep the block, copy the block for both, or remove it from both, but it has no evidence for which answer matches the user's intent. Another case is a positive reference count with no directory pointing to the inode: the contents survive but the name is gone. The traditional repair creates a link in a special `lost+found` directory, preserving recoverable contents without pretending it can reconstruct the original path or meaning.

The boundary of `fsck` is therefore explicit: it can return metadata to some consistent state, but it cannot guarantee preservation of information or intent. Corruption of a high-level directory may leave a technically repaired system hard to use. Misattached contents from a sensitive file can also create a security problem. A full scan grows with file-system size. The deck models a 5 TB disk as taking about eight hours to read sequentially and weeks to read 10% randomly. Those figures belong to [The slides](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/23/Lecture23.pdf)' hardware model, not every 5 TB device; the durable lesson is that recovery work is coupled to total file-system scale.

## Approach two: ordered writes choose less harmful intermediate states

Pages 11–14 move from repair after failure to constraints before failure. When allocating a new block, first persist the free map marking it occupied, then persist the inode pointer. A crash at any point cannot leave a block both available for allocation and referenced by an inode. A crash after the first step but before the second can leak one block. Ordered writes do not make a multiblock update atomic; they deliberately bias every possible intermediate state toward the less dangerous side ([official slides](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/23/Lecture23.pdf)).

The slides generalize the rule in two sentences: initialize information before storing a pointer to it, and nullify every old pointer to a resource before reusing that resource. The first prevents an inode from reaching an uninitialized indirect block. The second prevents one data block from belonging to two files. If every dependency follows these rules, the system need not wait for a full `fsck` before serving after reboot; a background scan may still reclaim leaked resources later.

The simplest implementation is synchronous write-through: wait for each step to reach disk before taking the next. It is easy to explain, but it puts disk latency into each file operation. The improved design records dependencies in the buffer cache. For example, an inode block depends on a free-map block, so the cache pushes the free map first when it is ready to write the inode. This preserves delayed writes, but the dependency graph can contain cycles, forcing the system to write some blocks to break them. The ordering rules themselves become complex state whose correctness must be established.

## The entry to approach three: leave a recoverable promise first

Page 15 introduces write-ahead logging (WAL): append information about an operation to a special log before changing its home blocks; after a crash, recovery can use the log to complete the update. Unlike `fsck`, which infers intent from global metadata, WAL records intent first. Unlike ordered writes, which manage many dependencies, WAL allows home updates to reach disk later and in a different order.

But “write the log first” is only a design principle, not a complete protocol. How do several entries become all-or-none? What if replay itself crashes? How is the log reclaimed? Does structural consistency imply that recent data is durable? [Lecture 24](/posts/learning/2026-08-22-stanford-cs111-lecture-24-journaling-file-systems) owns those four questions.

## Page-by-page index

- Pages 1–4: topic, optional reading, why file-system recovery is special, and data loss, inconsistency, and write reordering.
- Pages 5–10: clean bit, global `fsck` scan, free-map and reference-count repairs, double ownership, `lost+found`, and scaling limits.
- Pages 11–14: ordered writes, pointer rules, leaked resources, synchronous writes, buffer-cache dependencies, and cycles.
- Page 15: WAL and journaling as the entry point to the third recovery strategy.
- Pages 16–23: continued in Lecture 24 with entries, transactions, checkpoints, `fsync`, and the final trade-off.

## Update history

- 2026-08-22: Corrected the duplicate-artifact inference and narrowed this lecture to the crash model, `fsck`, ordered writes, and the WAL entry point.

## References

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 23 slides: File System Crash Recovery](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/23/Lecture23.pdf)
