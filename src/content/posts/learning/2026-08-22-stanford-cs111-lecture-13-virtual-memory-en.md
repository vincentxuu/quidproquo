---
title: "Stanford CS111 Lecture 13: Virtual Memory"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: en
series:
  name: "Reading Stanford CS111"
  order: 14
tldr: "Lecture 13 starts from the failures of single-tasking and load-time relocation, uses an MMU with base/bound to create isolated virtual and physical address spaces and traps, then introduces segmentation to escape one contiguous region."
description: "A slide-by-slide reading of Stanford CS111 Spring 2026 Lecture 13 on memory-sharing goals, relocation, MMUs, base/bound, trap transitions, segmentation, sharing, and fragmentation."
draft: true
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs111-lecture-13-virtual-memory)

This is part 14 of [Reading Stanford CS111](/series/stanford-cs111), covering **Stanford CS111, Spring 2026, Lecture 13**. Mendel Rosenblum taught the lecture on 2026-04-27; its official title is [Virtual Memory](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/13/Lecture13.pdf). This article uses the public PDF and the [course calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar). The recording is behind Canvas/Panopto and is not treated as a source read for this article.

Earlier lectures shared one core among concurrent threads. This lecture starts sharing one physical memory among concurrent processes. The PDF uses a historical sequence so each mechanism answers the previous design's failure rather than presenting virtual memory as magic.

## 1. Single-tasking and four memory-sharing goals

Early batch monitors and early MS-DOS ran one program in memory with the OS. The design was simple and efficient, but programs could not coexist and a bad program could corrupt the OS or machine.

The PDF scores designs on **multitasking** (several resident processes), **transparency** (each sees its own memory), **isolation** (no corruption across processes or OS), and **efficiency** (sharing does not badly degrade CPU or memory). Single-tasking achieves only efficiency.

The goals are distinct. Co-residence gives multitasking without isolation; software checks might isolate while being inefficient. Every historical step needs a new scorecard.

## 2. Load-time relocation permits coexistence, not protection

An early sharing scheme has the loader act like a linker and rewrite addresses while placing each process in a distinct physical region. Several processes can reside at once without each compiled program knowing its original physical base.

The process size must be declared statically, useful growth and movement are unavailable, and no runtime bound prevents a bad pointer from writing another process or the OS. Variable-size contiguous regions also fragment like first/best-fit heaps.

The slide score is multitasking Yes, transparency No, isolation No, efficiency Yes. All instruction and data references must be found and rewritten at load time, which does not naturally cover addresses created later at runtime.

## 3. Dynamic address translation creates two spaces

The CPU generates a **virtual address** and a Memory Management Unit translates it to a **physical address** before memory access. Programs see virtual address spaces; DRAM allocation belongs to physical space.

Every fetch, load, and store is translated, so hardware must make the path fast and perform protection checks alongside calculation. The OS can switch translation state so identical virtual addresses select different physical regions.

Processes with virtual ranges 0–1999, 0–999, and 0–2999 can occupy physical regions beginning near 0, 2000, and 5000. Each process has a meaningful virtual address 0, answering the earlier layout question. ([official lecture PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/13/Lecture13.pdf))

## 4. The base-and-bound hardware contract

The simple MMU has two registers. `base` is the process's physical start and `bound` its virtual-space size. For each reference, hardware compares `virtual_address >= bound` and faults if true; otherwise `physical_address = base + virtual_address`.

The example gives Process 3 base 5000/bound 3000, Process 6 2000/1000, and Process 1 0/2000. Loading the right registers on dispatch lets each run from virtual zero while the bound blocks escape from its contiguous region. ([official lecture PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/13/Lecture13.pdf))

Checking the virtual address before addition avoids crossing the limit. The slide performs add and compare in parallel, deriving efficiency from simple hardware rather than omitted isolation.

## 5. CALL and RETURN relocation step by step

With base 6000 and bound 2000, virtual PC 62 contains `CALL 140`; its instruction is fetched at physical 6062. CALL stores virtual return address 66 on the stack: virtual SP moves from 1420 to 1416, whose physical location is 7416, and PC becomes virtual 140. ([official lecture PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/13/Lecture13.pdf))

The stack stores **66, not 6066**. Program-visible pointers, PC, and return addresses remain virtual and receive the base only when used. Relocating the process to base zero changes no code or stack values; instruction 62 and stack 1416 simply map directly.

Transparency therefore applies to runtime-created addresses, not only source variables. Compiler conventions, heap pointers, and calls need not know physical placement.

## 6. Atomic transitions between process and OS

In the slide model, the OS runs with relocation disabled so virtual equals physical. Processor Status Register bits control relocation and user mode. On a trap, hardware atomically saves PC, branches through an interrupt vector, and disables translation and user mode.

Return atomically restores translation/user mode and saved PC. If user instructions could run between these changes, they might execute privileged or with translation disabled. The interrupt-vector entry therefore supplies saved/new PC and new PSR state as one controlled transition.

A context switch also changes base and bound because they are process address-space state. CPU state includes privileged registers that determine memory interpretation, not only general registers.

## 7. Base/bound meets the goals but one region is limiting

Base/bound earns Yes on all four goals: co-residence, transparent virtual addresses, bound-enforced isolation, and a simple add/compare path. Yet each program receives one contiguous variable-size region.

That does not match code, data, and stack. Code wants read-only protection, data and stack need read/write, and stack may grow independently. A single region cannot share read-only code, still fragments, and makes process growth difficult.

The bottom line is “one region too limiting.” Dynamic translation is sound; its metadata—one base/bound pair—is not expressive enough.

## 8. Segmentation supplies several protected regions

Segmentation divides a process into variable-size segments. An MMU map records type, base, bound, and protection. The slide maps code to base 1000/length 1000/R-O, data to 3000/2000/R-W, and stack to 8000/2000/R-W. Translation remains table lookup plus add/compare. ([official lecture PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/13/Lecture13.pdf))

A reference needs a segment number and offset. PDP-10 used a high-order bit for high/low segments; PDP-11 could choose implicitly by instruction type; original x86 specified a segment in the instruction or prefix. Each design first selects a descriptor, then checks offset bounds and protection.

Segments grow, shrink, swap, and move independently for compaction. Processes can map a shared code segment while retaining private data and stacks. Protection becomes a per-segment property.

## 9. Segmentation's next bottleneck

Segmentation still has a fixed number of segments, making arbitrary mappings such as many `mmap` files difficult. Variable-length physical allocations still fragment, and the address space is rigidly divided according to program or ISA-visible segments.

Paging will next replace variable-size regions with fixed-size pages. Lecture 13's method is to retain the four goals while locating an insufficient representation at each generation: load-time relocation lacks runtime protection, base/bound has one region, and segmentation retains fixed-count and variable-length limits.


## References

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 13 slides: Virtual Memory](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/13/Lecture13.pdf)
- [Operating Systems: Principles and Practice](https://ospp.cs.washington.edu/)
- [OSTEP: Address Spaces](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-intro.pdf)
- [OSTEP: Address Translation](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-mechanism.pdf)
- [OSTEP: Segmentation](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-segmentation.pdf)
