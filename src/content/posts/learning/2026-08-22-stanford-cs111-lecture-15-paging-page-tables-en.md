---
title: "Stanford CS111 Lecture 15: Paging"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: en
series:
  name: "Reading Stanford CS111"
  order: 16
tldr: "Lecture 15 uses fixed pages to remove inter-process external fragmentation, then connects x86-64's four-level walk, sharing and aliasing, and the TLB to trade-offs among translation speed, sparse tables, context switches, and page size."
description: "A slide-by-slide reading of Stanford CS111 Spring 2026 Lecture 15 on pages and frames, PTE protection, four-level tables, sparse spaces, TLBs, user-memory access, aliasing, and fragmentation."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs111-lecture-15-paging-page-tables)

This is part 16 of [Reading Stanford CS111](/series/stanford-cs111), covering **Stanford CS111, Spring 2026, Lecture 15**. Mendel Rosenblum taught the lecture on 2026-05-01; its official title is [Paging](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/15/Lecture15.pdf). This article uses the public PDF and the [course calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar). The recording is behind Canvas/Panopto and is not treated as a source read for this article.

Segmentation still allocates variable-size physical regions and externally fragments. Paging divides both virtual and physical spaces into fixed-size chunks: virtual **pages** map to physical **page frames**. The [official PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/15/Lecture15.pdf) gives 4 KB (“x86 myth”) and 16 KB MacBook examples as course snapshots, not universal specifications.

## 1. VPN, offset, and PTE

A virtual address splits into virtual page number (VPN) and page offset. The MMU page map/page table converts VPN to physical page number (PPN) while preserving the offset. A 4 KB page therefore uses 12 offset bits. ([official lecture PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/15/Lecture15.pdf))

A page-table entry stores PPN plus present and protection bits such as writeable. Present zero means no valid current mapping; writeable zero protects code. Each address space has its own map, so identical VPNs can select different PPNs.

Fixed-size frames give the OS a simple free-page list: allocation removes a frame and free returns it. Program segments become page collections beginning at page boundaries, while their frames need not be contiguous.

## 2. Why a flat page table is too large

The myth x86-64 machine has 64-bit virtual addresses and 4 KB pages. Sixteen upper bits are unused, leaving 48 usable bits and a 36-bit VPN: `2^36` possible pages. ([official lecture PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/15/Lecture15.pdf))

At eight bytes per PTE, a flat map costs `8 × 2^36 = 2^39 bytes = 512 GB` **per process**. Real spaces are sparse: low code/data and a high stack leave the middle empty. Allocating every possible entry is impossible. ([official lecture PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/15/Lecture15.pdf))

The map is therefore paged and lower-level tables exist only for used branches. Overhead follows mapped neighborhoods rather than the full possible space.

## 3. The four-level x86-64 map

A 4 KB table page holds `4096/8 = 512 = 2^9` entries, so each index is nine bits. Four levels split the address as: ([official lecture PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/15/Lecture15.pdf))

```text
unused 16 | PML4 9 | PML3 9 | PML2 9 | PML1 9 | offset 12
```

The PML4 base register points to the root. PML4 leads to PML3, then PML2, PML1, and the final PTE/frame. Intermediate present bits omit unused subtrees and compress sparse spaces.

The slide's physical address has 40 PPN bits plus 12 offset bits. Virtual unused bits, physical width, and PTE format are assumptions of its myth model, not a universal x86-64 implementation contract.

## 4. Walking code, data, and stack

The sample maps code at `0x0000`, data at `0x1000`, and one stack page at `0xFFFFFFFFF000`. Code addresses use PML indices `0,0,0,0`; the walker follows four tables from PML4 base to the code PTE.

Data address `0x1008` uses indices `0,0,0,1` and offset `0x8`. It shares the first three levels with code and differs only at PML1.

The top stack page uses `0x1FF` at every level, taking a separate high-address branch. The enormous empty gap consumes no flat entries because only paths exist.

This is a radix tree/trie: every nine-bit chunk chooses a child, and the leaf holds a PTE. It is neither a hash lookup nor one direct array indexed by the 36-bit VPN.

## 5. Sharing and multiple page sizes

Two PML1 entries can point to one PPN to share a 4 KB page. A higher-level subtree can also be shared: a PML2 entry covers `512×4 KB = 2 MB`, PML3 covers 1 GB, and PML4 covers 512 GB in the slides. ([official lecture PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/15/Lecture15.pdf))

The hierarchy can terminate at 4 KB, 2 MB, or 1 GB pages. Large pages reduce table and TLB entries but increase internal fragmentation and need larger contiguous physical frames. ([official lecture PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/15/Lecture15.pdf))

Shared PPN does not require the same VPN. Different address spaces may map it at different locations and permissions. Permission and synchronization remain separate contracts.

## 6. Four memory references and the TLB

Page maps live in main memory; the MMU keeps only the root base. Four table references before every real access are unacceptable.

The Translation Lookaside Buffer is a small MMU cache of recent mappings. The PDF gives 64–2048 entries containing VPN (36 bits), PPN (40 bits), and protection. Fully associative lookup must be fast; the slides cite typical hit rates of at least 95%, relying on locality. ([official lecture PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/15/Lecture15.pdf))

On a TLB hit, hardware uses PPN and checks protection. On a miss it walks the tables and fills VPN/PPN/protection. The table remains authoritative; TLB is derived cache state.

## 7. OS consistency responsibilities for TLBs

A context switch cannot reuse old translations in a new address space. The PDF says assigning x86-64 PML4 base flushes the TLB; some architectures tag entries with a PID/address-space identifier to avoid a full flush.

Changing a PTE also requires invalidation or the CPU may retain stale frame or permission information. x86-64 provides `INVLPG`. Revoking a PTE without invalidating its cached entry does not immediately revoke access. Multicore shootdown is outside the PDF.

This is the recurring cache invariant: when authority changes, derived fast-path state must be synchronized or discarded.

## 8. How the OS accesses user memory

`write(fd, buffer, length)` gives the kernel a user virtual pointer. An unmapped OS operating with physical addresses must software-translate virtual-contiguous pages that may be physically scattered.

Alternatively, the OS is mapped in every address space: shared kernel code/region with private process code/data/stack. Kernel code can then access under translation. I/O devices still raise an address issue, which the PDF notes without developing IOMMUs.

## 9. Aliasing and fragmentation

**Memory aliasing** maps multiple virtual addresses to one physical page by duplicating a PML1 PTE. It can look odd in user code but is common for an OS mapping physical memory. Writes through either alias affect the single frame.

Paging removes **external fragmentation** between processes because any frame can serve any page. Unused bytes in a page are **internal fragmentation**, commonly in the last page of a segment; larger pages increase worst-case waste.

The trade-offs are linked: fixed pages simplify allocation and sparse mappings; multilevel tables save memory but add walks; TLB locality hides walks but creates invalidation/context-switch duties; large pages reduce metadata/TLB pressure but waste more internally. Demand paging later explains how a non-present page is fetched from disk.


## References

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 15 slides: Paging](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/15/Lecture15.pdf)
- [Operating Systems: Principles and Practice](https://ospp.cs.washington.edu/)
- [OSTEP: Paging Introduction](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-paging.pdf)
- [OSTEP: Faster Translations with TLBs](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-tlbs.pdf)
- [Intel 64 and IA-32 Architectures manuals](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html)
