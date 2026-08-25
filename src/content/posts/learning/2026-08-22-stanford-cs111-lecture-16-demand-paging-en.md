---
title: "Stanford CS111 Lecture 16: Page Faults, Demand Fetching, and Prefetch"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: en
series:
  name: "Reading Stanford CS111"
  order: 17
tldr: "Demand paging loads pages only when needed; present bits, precise exceptions, and restartable instructions let the kernel safely fill them from executables, zero-fill, or backing store."
description: "A reading of Stanford CS111 Spring 2026 Lecture 16: page-fault mechanism, restartable instructions, demand fetching, page sources, and prefetch."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs111-lecture-16-demand-paging)

This is part 17 of [Reading Stanford CS111](/series/stanford-cs111), covering **Stanford CS111, Spring 2026, Lecture 16**. Mendel Rosenblum taught it on 2026-05-04 under [Demand Paging](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/16/Lecture16.pdf). The official Lecture 16/17 PDFs are byte-identical and video is inaccessible, so the spoken boundary cannot be recovered. To avoid duplication, this article owns fault/fetching mechanism; [Lecture 17](/posts/learning/2026-08-22-stanford-cs111-lecture-17-page-replacement) owns replacement policy.

## From address spaces to true virtual memory

Earlier lectures mapped each process's virtual addresses through page tables to physical frames. If every page had to remain in DRAM, that would still mainly provide isolation and relocation. Demand paging goes further: a program can execute before all its information enters memory. Recently used pages stay in DRAM, while idle contents remain in the executable or a backing store, also called swap space in the deck.

The design relies on locality. An address space may be large, but during an interval a program normally revisits only a portion. If those active pages fit, most accesses hit DRAM and the process appears to own more memory than is installed. The slides call this “true virtual memory”: translation now supports a hierarchy spanning DRAM and storage.

The [official Lecture 16 PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/16/Lecture16.pdf) uses order-of-magnitude figures in which DRAM is about 100,000 times faster than disk and 1,000 times faster than SSD, while disk or SSD is about 100 times cheaper per bit. These build intuition, not guarantees across hardware generations. Disk is not merely slower RAM: the slow path must be rare, because frequent faults destroy the average cost.

## How a page fault turns absence into presence

When a PTE has present set to zero, the MMU cannot translate and traps into the kernel. The kernel first checks whether the virtual address belongs to a legal region. Demand paging must not hide an invalid access by inventing a page; only a valid but nonresident page enters the loading path.

For a valid fault, the kernel finds a physical frame, reads contents from the page's source, updates the frame number and present bit, then restarts the faulting instruction. If no frame is free, finding one invokes replacement policy; a modified victim may first require writeback. Hardware and the kernel provide trapping, I/O, PTE updates, and resumption, while policy chooses what to fetch and sacrifice.

Until reading finishes and the PTE is updated, user code must not observe the mapping as present. Publishing it early could let another thread read incomplete contents. A fault looks like one exception, but internally joins storage, frame allocation, and page-table state in a controlled transition.

## Faulting addresses and restartable instructions

The kernel must know which address failed. The x86 example latches the faulting virtual address in CR2. The kernel reads it, finds the region and PTE, checks validity, and locates the content source. Saving only the program counter is insufficient because one instruction may contain several memory operands.

The repaired instruction must run again, so page-faulting instructions must be restartable. The deck uses `push`: an implementation might update the stack pointer before writing the new stack location. If the write faults and restart decrements it again, semantics break. The CPU must expose precise exception state so restart is equivalent to the instruction not yet occurring, instead of making the kernel guess partial progress.

Although software policy exploits faults, hardware mechanism enables them. The MMU marks absence, the CPU retains adequate fault information and precise state, and the kernel chooses a source and victim. Remove one layer and lazy loading ceases to be transparent.

## Demand fetching gives different pages different sources

At the extreme, a new process starts with no user pages resident. Its first instruction fetch loads code from the executable; the first initialized-data access loads a data page. The kernel still knows the layout, valid ranges, and sources. It postpones I/O, not the mapping's definition.

Uninitialized data, a growing stack, and newly allocated unwritten space need no old file bytes. They can receive zero-filled contents, called a zero-page source in the slides. Modified anonymous pages later evicted do need backing-store storage for restoration. Thus `present=0` is not one semantic state: contents may reside in an executable or swap, or be reproducible as zeros.

Source changes eviction cost. A clean code page can be discarded and reread from the executable; a dirty anonymous page has no equivalent original copy and needs writeback. Present, referenced, and dirty bits summarize information the kernel needs on the slow path.

## Prefetch asks whether reading extra pages pays

Pure demand fetching retrieves only the faulted page. Prefetch predicts future pages and reads them during the same I/O episode. Sequential code or a linear array scan makes neighbors likely to be used soon. Once disk seek and command latency are paid, transferring contiguous pages can add little cost.

The [same official deck's prefetch table](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/16/Lecture16.pdf) gives illustrative timings that put a disk fault at five to ten milliseconds and a fast extra prefetch at 0.04 milliseconds; an SSD fault at fifty to one hundred microseconds and extra prefetch at ten to twenty microseconds; and DRAM at fifty to one hundred nanoseconds. These are teaching magnitudes, not specifications for all 2026 devices. They show that accurate prefetch amortizes fixed I/O cost, while wrong guesses waste bandwidth and frames.

Prefetch is not unconditionally superior. An unused page may evict an active one and make another process fault sooner. Prediction accuracy, incremental transfer cost, and memory pressure determine whether the guess pays.


## Connecting the fetching mechanism

The fetching path is one loop: present detects absence, CR2 preserves the address, the kernel validates the mapping and identifies executable, zero-fill, or backing-store source, I/O completes, the PTE changes, and a precise exception restarts the instruction. Prefetch only retrieves predicted pages along this path.

Three questions test the model. Why does `present=0` not necessarily mean an invalid address? Which sources can back a nonresident page? Why must the faulting instruction be restartable? Victim selection and thrashing move to Lecture 17.

## Update history

- 2026-08-22: Narrowed after duplicate-deck review to page-fault, fetching, and prefetch mechanism; replacement moves to Lecture 17.

## References

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 16 slides: Demand Paging](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/16/Lecture16.pdf)
- [OSTEP: Beyond Physical Memory—Mechanisms](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-beyondphys.pdf)
- [OSTEP: Beyond Physical Memory—Policies](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-beyondphys-policy.pdf)
