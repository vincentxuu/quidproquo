---
title: "Stanford CS111 Lecture 26: Flash Translation Layers, Garbage Collection, and Wear Leveling"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: en
series:
  name: "Reading Stanford CS111"
  order: 27
tldr: "Flash programs pages but erases whole units; an FTL hides the asymmetry with out-of-place mapping, then manages amplification through garbage collection, temperature segregation, wear leveling, and TRIM."
description: "A reading of Stanford CS111 Spring 2026 Lecture 26: flash cells, erase units, FTL maps, crash states, garbage collection, write amplification, wear leveling, and TRIM."
draft: true
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs111-lecture-26-flash-memory)

This is part 27 of [Reading Stanford CS111](/series/stanford-cs111), covering **Spring 2026 Lecture 26**, taught by Mendel Rosenblum on 2026-05-29 under [Flash Memory](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/26/Lecture26.pdf). It follows the public PDF and [calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar); Canvas/Panopto video is inaccessible. SHA auditing shows Lecture 26 differs from adjacent Lectures 25 and 27, so there is no duplicate artifact.

## Flash sits between disk and DRAM

[The deck](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/26/Lecture26.pdf) says flash replaced disks in phones and laptops and is packaged as SSDs. Against disk it has no moving parts, 100–1,000× lower random latency, and 3–10× higher cost per bit. Against DRAM it is nonvolatile, 5–20× cheaper, and 100–1,000× slower.

These and later figures are Spring 2026 teaching magnitudes, not universal product specifications. Flash offers persistent storage without seeks, but cannot overwrite arbitrary bytes like DRAM. A compatibility layer must reconcile that physics with a rewritable-block API.

Reads take about 10–100 µs; 1→0 programming 100–1,000 µs; 0→1 change 1,000–10,000 µs. Access uses 4–16 KiB pages and [The slide](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/26/Lecture26.pdf) lists chips up to 2 TB. The PDF has an unmatched parenthesis after page size; the range is retained without reproducing the typo.

## Program a page, erase a whole unit

Programming only clears more bits from one to zero, like logical AND. Restoring any zero to one requires erasing the entire 1–8 MiB erase unit to all ones. [The deck](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/26/Lecture26.pdf) gives 1,000–10,000 µs and elsewhere roughly 2 ms for erase.

One logical update done in place can require reading other live pages, erasing the unit, and rewriting everything. Erases wear cells out; [The slide](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/26/Lecture26.pdf)'s broad 100–100,000-cycle range reflects different flash technologies.

Throughput depends heavily on parallelism: the [official slides](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/26/Lecture26.pdf) use hundreds of MB/s for a NAND chip and GB/s for multi-channel SSDs. Single-page latency and aggregate bandwidth are therefore not interchangeable.

## Why direct mapping fails

An FTL exports linear disk-like blocks, mapping virtual numbers to physical pages so existing file systems work. This costs metadata, spare space, and performance, and implementations are typically proprietary.

Direct mapping keeps virtual N at physical N. Reads are trivial, but writes read the containing unit, erase it, and rewrite it, adding erase latency and repeatedly wearing the same unit.

A crash after erase but before rewrite can lose old data. The deck cites some inexpensive FAT USB sticks as examples, not every USB device.

## Out-of-place mapping and the A-W-G lifecycle

A better FTL lets a virtual block move. Reads consult a map; writes take a free erased page, program it, update the map, and mark the old page garbage. Updates avoid immediate erase.

Approach #1 keeps the map in DRAM and rebuilds by scanning headers. Each page stores virtual number plus allocated, written, and garbage bits. With erase producing ones and program only clearing, states progress from `111` erased, through `011` allocated, `001` valid, to `000` obsolete.

The `011` state detects a crash during programming so a scan does not accept a partial page. [The deck](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/26/Lecture26.pdf) does not specify version selection or an atomic map protocol; A-W-G is not claimed to solve every crash-consistency problem alone.

## Garbage collection and write amplification

Each out-of-place update leaves garbage. A collector selects a garbage-rich unit, copies its live pages to clean space and updates mappings, then erases the old unit.

At live utilization U, copying U units frees 1−U for new data, so writes per unit of new data are `1/(1−U)`: 2 at .5, 10 at .9, and 100 at .99. This assumes collecting a unit at that U and is a teaching model ([official slides](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/26/Lecture26.pdf)).

High utilization conflicts with low write cost and accelerates wear. Yet average U=.5 does not force victims at .5. A desirable distribution packs most units near full while leaving a few nearly empty victims ([official slides](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/26/Lecture26.pdf)).

## Temperature segregation and wear leveling

The FTL groups blocks with similar update locality. Hot blocks likely change soon; cold blocks do not. Hot units accumulate garbage, giving the collector low-U victims and avoiding repeated copying of cold pages.

Only collecting hot units wears them out. Wear leveling occasionally collects cold units, recovering little space but releasing less-worn units for new writes. It accepts immediate GC cost for balanced lifetime.

Garbage collection minimizes copied live data; wear leveling balances erase counts. Policy must combine utilization, temperature, and wear history rather than optimize one metric. Device lifetime and immediate write cost must be evaluated together.

## FTL, TRIM, and cross-layer information loss

FTLs duplicate mapping: file block to logical disk block to flash page. Direct flash-aware file systems could remove a layer, but cheap devices already ship with FTLs, so compatibility won.

The FTL cannot know that a file-system block was freed until overwrite. It may copy deleted data during GC. TRIM/deallocate conveys freed logical ranges, making them garbage, while the FTL retains wear, bad-block, and erase scheduling.

Flash favors out-of-place updates, whereas disks favored in-place layouts for reads. SSD-oriented file systems therefore try to avoid in-place updates. This changes allocation and recovery tradeoffs; it does not make append-only designs automatically correct.

## Update history

- 2026-08-22: Rewritten against Lecture 26, scoping hardware figures as deck snapshots and documenting the page-size typo and crash-state boundary.

## References

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 26 slides: Flash Memory](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/26/Lecture26.pdf)
- [NVM Express: Dataset Management / deallocate](https://nvmexpress.org/wp-content/uploads/NVM-Express-Base-Specification-2.0d-2024.01.11-Ratified.pdf)
- [Linux kernel documentation: F2FS](https://docs.kernel.org/filesystems/f2fs.html)
