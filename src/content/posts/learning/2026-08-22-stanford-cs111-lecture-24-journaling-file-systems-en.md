---
title: "Stanford CS111 Lecture 24: Journaling, Transactions, and Checkpoints"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: en
series:
  name: "Reading Stanford CS111"
  order: 25
tldr: "Lecture 24 continues from the WAL entry point into transactions, idempotent replay, and checkpoints, showing why consistency is not durability and why a journal does not replace fsync or backups."
description: "A reading of Stanford CS111 Spring 2026 Lecture 24, covering journal entries, transactions, idempotent replay, checkpoints, and the boundary between consistency and durability."
draft: true
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs111-lecture-24-journaling-file-systems)

This is part 25 of [Reading Stanford CS111](/series/stanford-cs111), covering **Stanford CS111, Spring 2026, Lecture 24**. Mendel Rosenblum taught it on 2026-05-22, and the calendar calls it [File System Crash Recovery, Continued](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar). This article uses only the [public lecture PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/24/Lecture24.pdf). The recording is behind Canvas/Panopto and is not treated as a source read here.

First, an anomaly in the source material: the Lecture 23 and Lecture 24 PDFs both have 23 pages, with the same page titles, bullets, and ordering. Their SHA-256 hashes differ, but extracted text differs only in the slash in `/lost+found` and four periods. The public material therefore does not provide an independent “continued” [slide](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/24/Lecture24.pdf) deck. Rather than invent missing content, this series assigns pages 1–15 to Lecture 23 and uses this article for page 16 onward: write-ahead logging, transactions, checkpoints, and the boundary between consistency and durability.

## Continuing from the previous lecture: same public material, different question

[Lecture 23](/posts/learning/2026-08-22-stanford-cs111-lecture-23-crash-recovery) owns pages 1–15: the crash model, `fsck`, ordered writes, and the WAL entry point. This lecture does not repeat those repair cases. It starts from page 16 and asks how one log entry describes an update, how several entries form a transaction, how replay tolerates repetition, and how a checkpoint safely reclaims the log ([official slides](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/24/Lecture24.pdf)).

The comparison baseline still matters. `fsck` reconstructs a legal state from metadata after a crash. Ordered writes constrain dangerous orders before a crash. WAL first leaves a recoverable promise before changing home blocks. L24 turns that third sentence into an executable protocol.

## Approach three: write the journal before the home locations

Pages 16–18 expand the WAL principle into a journaling protocol. The system first appends the intended operation to a special log, then updates the home blocks later in any order. After reboot, it replays complete log groups. The Linux kernel's [ext4 journal documentation](https://docs.kernel.org/filesystems/ext4/journal.html) describes the same two stages: a transaction is fully written and committed to the journal, then checkpointed to its final locations; a crash during the latter stage is recovered by replaying the journal.

A log entry can describe a logical operation, such as assigning a block to a particular index in an inode. It can instead describe a physical update, such as patching four bytes at an offset in a disk block. Replay itself can crash and run again, so an action must be **idempotent**: applying it once or multiple times must yield the same result.

One file-system operation may require several log entries. Recovery needs to know whether a consistent group is complete and must not apply only half of it. Assignment 8 uses hybrid entries that can both patch disk blocks and mark blocks allocated or free. Start and end transaction markers then delimit an all-or-nothing group. A transaction here is a crash-recovery boundary; it does not imply every concurrency-control property of a database transaction.

## Checkpoints bound the log, but truncation is not free

Page 19 notes that recovery becomes slower if the log grows forever. A checkpoint first records the log head just after the last complete transaction, then flushes all dirty blocks to their home locations. Only after that succeeds may the log before the recorded position be truncated. Reversing the order would let a crash after truncation but before dirty-block writeback lose both the home update and the replayable record.

A second choice is how much to log. [The slides](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/24/Lecture24.pdf) say systems commonly journal metadata such as free maps, inodes, and indirect blocks; journaling file data is more expensive. The [official ext4 documentation](https://docs.kernel.org/filesystems/ext4/journal.html) makes the alternatives concrete: the default `data=ordered` mode primarily journals metadata, `data=journal` sends both data and metadata through the journal, and `data=writeback` provides weaker ordering for data blocks. Journaling is not one fixed guarantee; its configuration matters.

## Delayed log writes separate consistency from durability

Pages 20–22 collect the benefits and costs. A journal limits how much work reboot recovery must inspect, and sequential appends suit storage devices. Metadata writeback may remain delayed instead of forcing every normal operation to be synchronous. The simplest write-ahead design, however, adds a synchronous log write before each metadata operation, while delayed file data can still disappear in a crash ([official slides](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/24/Lecture24.pdf)).

The actual safety condition is not “synchronize every log entry immediately.” It is that the corresponding log entry must reach disk before any related home block does. The system may therefore buffer log entries in memory and flush the required log before the buffer cache writes a dependent block. That preserves consistency without promising that the content just written is already durable.

An application that needs durability must ask for synchronization explicitly. The Linux [`fsync(2)` manual](https://man7.org/linux/man-pages/man2/fsync.2.html) says that it flushes a file's modified in-core data and associated metadata. Guaranteeing a new name's directory entry also requires calling `fsync` on the directory itself. Journaling explains how a file-system structure returns to a legal state after a crash; it does not automatically make every application write durable.

## The conclusion: choose which failure you intend to survive

The final page reduces the design space to performance, durability, and consistency. `fsck` pays much of its cost after reboot. Ordered writes constrain normal persistence order. Journaling writes an additional replayable record of intent. None of them handles destruction of the storage device itself; that requires replication or backup, not a more elaborate journal.

To test your understanding, close the slides and model one “allocate a new block to a file” operation. List every write to the free map, inode, data block, and log; insert a power failure between every pair; then classify the restart outcome as data loss, leaked space, inconsistent metadata, or complete replay. If you cannot identify which write must become durable first, you have not fully understood the “ahead” in write-ahead logging.

## Page-by-page coverage checklist

- Pages 1–15: owned by Lecture 23—the crash model, `fsck`, ordered writes, and the WAL entry point.
- Pages 16–18: logical and physical entries, idempotence, consistent groups, and Assignment 8 transactions.
- Pages 19–22: checkpoints, metadata-only logging, benefits and costs, delayed log writes, `fsync`, and device failure.
- Page 23: trade-offs among performance, durability, consistency, and the failures a design can recover from.

## References

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 24 slides: File System Crash Recovery, Continued](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/24/Lecture24.pdf)
- [Linux kernel documentation: ext4 Journal (jbd2)](https://docs.kernel.org/filesystems/ext4/journal.html)
- [Linux man-pages: fsync(2)](https://man7.org/linux/man-pages/man2/fsync.2.html)
