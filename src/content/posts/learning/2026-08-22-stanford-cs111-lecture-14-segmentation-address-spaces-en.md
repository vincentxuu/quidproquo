---
title: "Stanford CS111 Lecture 14: Virtual Memory, Continued"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: en
series:
  name: "Reading Stanford CS111"
  order: 15
tldr: "Lecture 14's official PDF is byte-identical to Lecture 13; this article records the gap and focuses on how multiple base/bound/protection entries enable growth, sharing, and compaction while retaining fixed-count, fragmentation, and rigid-layout limits."
description: "A reading of Stanford CS111 Spring 2026 Lecture 14 on its duplicated official PDF, segmented address spaces, descriptor selection, protection, sharing, compaction, and mmap limits."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs111-lecture-14-segmentation-address-spaces)

This is part 15 of [Reading Stanford CS111](/series/stanford-cs111), covering **Stanford CS111, Spring 2026, Lecture 14**. Mendel Rosenblum taught the lecture on 2026-04-29; its official title is [Virtual Memory, Continued](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/14/Lecture14.pdf). This article uses the public PDF and the [course calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar). The recording is behind Canvas/Panopto and is not treated as a source read for this article.

Official `Lecture13.pdf` and `Lecture14.pdf` are byte-identical 25-page files with SHA-256 `f0aa78c7...e315`, although the calendar calls April 29 **Virtual Memory, Continued**. Canvas video is unavailable. This article does not pretend there is another deck; it focuses on segmentation in the repeated artifact's latter section.

## 1. Why one base/bound pair is insufficient

Base/bound lets every process start at virtual zero and performs `physical = base + virtual` with `virtual < bound`, meeting multitasking, transparency, isolation, and efficiency. But code, data, and stack are forced into one contiguous region.

One descriptor cannot express read-only code versus writable data/stack, independent stack growth, or shared code. The variable-size process region still externally fragments and is costly to grow or move. Translation is not the problem; one metadata entry is too weak.

## 2. A segment map is several protected base/bound pairs

Segmentation divides virtual space into variable-size regions. Each MMU map entry contains type, base, bound, and protection. The PDF maps code as 1000/1000/R-O, data as 3000/2000/R-W, and stack as 8000/2000/R-W. ([official lecture PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/14/Lecture14.pdf))

Translation selects a descriptor, checks offset against bound and operation against protection, then computes `base + offset`. Hardware remains lookup, add, and compare. Expressiveness comes from multiple descriptors, not skipped checks.

A reference is `(segment number, offset)`. Offset 140 in code and data can map differently; faults can distinguish an out-of-range offset from a write to R-O code.

## 3. Three sources of the segment number

PDP-10 used a high-order address bit for high/low segments. PDP-11 could select implicitly by instruction semantics: instruction fetch from code and data access from data. Original x86 specified a segment in an instruction or prefix.

Address bits make pointers self-describing but fix segment count. Implicit selection simplifies common accesses but resists arbitrary mappings. Instruction selection adds flexibility while exposing segmentation to compiler and programming model. All select a descriptor before translation.

With two segment bits there are only four slots. An unused range in one slot cannot naturally become a fifth mapping, producing rigid division.

## 4. Independent growth, swapping, and compaction

Segments grow and shrink independently. Stack growth need not move code, and heap expansion does not reserve one maximum process region. The OS may swap one segment to disk while retaining others, although the deck does not provide a disk algorithm.

When physical memory fragments, the OS can move a segment and update its base, merging holes. Program `(segment, offset)` values stay unchanged, unlike load-time relocation. This is dynamic-translation transparency.

Movement still copies bytes and must prevent execution with the old base. The slides say move/compact but do not specify stop-the-world, DMA, or concurrency protocol.

## 5. Shared segments and protection

Two process descriptors can reference one physical code region while data and stacks remain private. Marking shared code R-O permits execution/read without modification, saving memory while preserving isolation.

Sharing becomes finer than a whole process. Separating library code from per-process state makes code shareable; a single base/bound region would require all-private memory or shared writable state. Protection metadata is a sharing contract.

The PDF does not cover synchronization for shared writable segments. R/W permission does not provide atomicity, ordering, or application invariants; locks and condition variables remain necessary.

## 6. Fixed segment counts and `mmap`

The first drawback is a fixed number of segments. With few ISA selectors, arbitrary regions are difficult; the PDF explicitly says it cannot `mmap` files. Mapped files, libraries, and guards can each need independent mappings, exhausting slots.

The issue is not fitting file bytes somewhere but lacking a scalable representation. Combining unrelated mappings loses independent bounds, protection, sharing, and lifetime.

## 7. Variable lengths still fragment

Segments are smaller than whole processes but remain variable-length physical allocations. Create/grow/free sequences leave differently sized holes, so a large segment can fail without a contiguous region despite sufficient total free memory. Compaction pays copy and pause costs.

Virtual space is rigidly divided too. Code/data/stack ranges follow the encoding, unused capacity does not necessarily transfer, and tools must understand segment identity.

Multiple descriptors repair protection, growth, and sharing for one-region base/bound, but retain fixed-count and variable-size placement limits. Paging next uses fixed-size pages and a larger map for noncontiguous frames; this article does not write paging back into the duplicated PDF.


## References

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 14 slides: Virtual Memory, Continued](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/14/Lecture14.pdf)
- [Operating Systems: Principles and Practice](https://ospp.cs.washington.edu/)
- [OSTEP: Segmentation](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-segmentation.pdf)
- [Linux manual: mmap(2)](https://man7.org/linux/man-pages/man2/mmap.2.html)
- [Intel 64 and IA-32 Architectures manuals](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html)
