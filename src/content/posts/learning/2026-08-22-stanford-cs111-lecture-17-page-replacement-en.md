---
title: "Stanford CS111 Lecture 17: From Page Faults to Clock—Who Leaves When Memory Is Full?"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: en
series:
  name: "Reading Stanford CS111"
  order: 18
tldr: "Lecture 17 separates demand paging into fetching and replacement: MIN cannot know the future, exact LRU is too expensive, and Clock uses reference/dirty bits to find a page old enough to evict; when active working sets exceed RAM, even a 1% fault rate can cause an approximately 1,000-fold slowdown."
description: "A slide-by-slide reading of Stanford CS111 Spring 2026 Lecture 17: page faults, demand fetching, prefetching, FIFO/MIN/LRU, Clock, global replacement, and thrashing."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs111-lecture-17-page-replacement)

This is part 18 of [Reading Stanford CS111](/series/stanford-cs111), covering **Stanford CS111, Spring 2026, Lecture 17**. Mendel Rosenblum taught it on 2026-05-06 under the official title [Demand Paging, Continued](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/17/Lecture17.pdf). The official Lecture 16 and 17 PDFs are byte-identical (both SHA-256 `65091d9719674258175c2dcf29e1ad82bca8ff8a82d3b66d73b9e40ad3287d9e`), not distinguishable decks. This article therefore emphasizes replacement policy while Lecture 16 emphasizes fault/fetching mechanism. Inaccessible Canvas/Panopto video prevents recovering the actual two-day spoken boundary.

Lecture 16 establishes demand paging's promise: a program can execute without keeping all code and data in physical memory at once. Lecture 17 asks what follows. When should a page enter memory, and which resident page should leave once RAM is full? The former is **page fetching policy**; the latter is **page replacement policy**. Page faults, the present bit, and restartable instructions are mechanisms. FIFO, LRU, Clock, and global replacement are policies.

## Complete agenda

The public deck proceeds through demand paging and locality; DRAM/SSD/disk trade-offs; the page-fault handler and x86-64 `CR2`; restartable instructions; fetching versus replacement; sources for demand-fetched pages; prefetching; Random, FIFO, MIN, and LRU; a 12-reference trace; why exact LRU is impractical; reference/dirty bits; Clock/second chance; clock-hand speed; global versus per-process replacement; a quantitative thrashing example; and finally suspending processes or controlling which working sets run together.

It does not teach disk geometry, file systems, or flash translation layers. Disk and SSD latencies only establish the gap between a page fault and DRAM access. The next lecture begins magnetic disks proper.

## Locality makes “not fully loaded” viable

Demand paging permits execution while only part of a program occupies physical memory. Active pages stay in page frames; idle pages can live in a paging file—backing store or swap space—and move as needed. It does not create capacity from nothing. Slower storage holds state that does not currently fit in RAM.

Its premise is **locality of reference**: during an interval, most programs repeatedly use a small fraction of code and data. This active group is a working set. If it fits in RAM, most references hit resident pages. If each step jumps to a new nonresident page, execution degrades into continual I/O waits.

The [official Lecture 17 PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/17/Lecture17.pdf) uses approximate orders of magnitude: DRAM is `100,000×` faster than disk and `1,000×` faster than SSD, while disk/SSD capacity may cost about `100×` less than DRAM. These are not timeless specifications. The durable target is capacity and cost like backing storage with common-case access like DRAM. Locality approaches that goal; it cannot erase a miss.

## A page fault can be controlled demand rather than a program error

A page in backing store has present=0 in its PTE. A CPU reference cannot complete normal translation, so it traps into the OS. The handler first validates the address. An invalid virtual address is an error; a valid page that is merely nonresident follows the ordinary page-in path.

The handler finds a free frame, obtains the page from its source, updates the PTE's frame number and present bit, and resumes the thread. Resume means retry the original instruction, not skip the faulting access. The load, store, or instruction fetch must execute after the page becomes resident.

On x86-64, hardware stores the faulting linear address in privileged register `CR2`. The [Intel architecture manuals](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html) document `CR2` and the page-fault error code as handler inputs. The slide phrase “latch faulting address on a page table” is easy to misread: hardware preserves the address; the page table remains translation metadata.

## Restartable instructions are required for transparent page-in

One instruction may modify a register and write memory. The deck uses a push-like operation: update the stack pointer, then write to the stack. If the write discovers a missing page, naively rerunning could decrement the stack pointer twice. Hardware therefore needs precise exception/restartable semantics: after service, the instruction must not expose half-committed state.

The kernel manages I/O, PTEs, and scheduling but cannot guess which micro-step completed. The architecture defines a safe fault boundary. The present bit is therefore not just location metadata; it participates in an exception contract among CPU, MMU, and kernel.

## Fetch policy: wait for demand or predict with prefetching?

**Demand fetching** can start a process with almost no resident pages and move each target only when first referenced. Read-only code and initialized data can come from the executable; new stack/heap pages can initially be zero-filled; previously written anonymous data returns from swap. It avoids I/O for untouched pages, but first reference waits, and present=0 alone cannot distinguish those sources.

**Prefetching** predicts future use. The deck suggests reading adjacent pages during a fault. Sequential traversal may consume them soon, and contiguous I/O may be cheaper. A jumping pattern wastes bandwidth and frames and may evict an active page early.

The [same official PDF's prefetch table](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/17/Lecture17.pdf) gives 5–10 ms for a disk fault versus about 0.04 ms for fast prefetch, 50–100 µs for an SSD fault versus 10–20 µs for prefetch, and 50–100 ns for DRAM. Devices change; the test remains: prefetch only wins when avoided stalls exceed extra reads, pollution, and replacement cost.

## Replacement policy: every fault needs a victim once RAM fills

While a free frame exists, the handler allocates it. Once memory fills, each incoming page needs a victim:

- **Random** chooses arbitrarily. Accounting is cheap, and performance can be surprisingly good.
- **FIFO** evicts the longest-resident page. Its queue is cheap, but residence age does not imply inactivity.
- **MIN/optimal** evicts the page used farthest in the future or never again. It is a theoretical baseline because a real OS cannot know the complete future.
- **LRU** evicts the least recently referenced page. It uses past access to predict future access and approximates MIN when temporal locality persists.

Evaluation includes fault count, per-reference metadata, scanning, and dirty write-back—not merely the policy name. Avoiding a fault matters, but a perfect rank updated on every load/store can cost too much.

## One reference string, three outcomes

The deck uses four frames and:

```text
A B C D A B E A B C D E
```

The first four references load A–D and fault; A and B then hit. At E, policies diverge. FIFO evicts by arrival order and totals **10 faults**. MIN knows the future, evicts D when E arrives, and totals **6 faults**. LRU uses recent history, evicts C, and totals **8 faults**.

This does not prove LRU always lies between the others. It fixes one trace to expose information differences: FIFO sees arrival history, LRU sees access history, and MIN sees the future. Another string may reverse practical rankings. MIN remains offline optimal, not deployable.

## Exact LRU is attractive and too expensive

A literal LRU design could attach a timestamp register to each physical page, write the system clock on every access, and scan all pages on replacement. It is expensive twice: every load/store updates fast state, and every fault performs a large scan.

The deck draws an approximation chain. MIN is unavailable; LRU approximates MIN with history. There is little value in paying disproportionate cost for exact LRU when the final target remains approximate. Replacement needs a page old enough, not proof of the globally oldest page.

## Reference and dirty bits provide cheap evidence

A **referenced bit**—Accessed on x86—is set when a page is read or written and says it was used since the OS last cleared it. A **dirty bit** is set on modification and says the memory copy differs from its disk/executable source. CPU/MMU hardware can update them during translation use.

Reference gives coarse recency evidence. Dirty determines eviction cost. A clean code page reconstructible from an executable can be dropped; a dirty anonymous page with no newer copy must be saved to backing store.

Architectures need not update all bits in hardware. An OS can simulate reference by trapping first access, or dirty by initially mapping a writable page read-only and handling the first write. Less hardware state means more traps and kernel work.

## Clock finds a page old enough rather than proving which is oldest

Clock, or second chance, arranges physical pages in a ring with a hand. The hand advances only when a fault needs a frame and the free list is empty.

At reference=1, the OS clears the bit, grants a second chance, and continues. If the page is used before the hand returns, hardware sets it again. At reference=0, no evidence shows use since the previous inspection, so the page can become the victim.

A dirty victim cannot be forgotten like a clean page. The deck says to clear dirty and start a disk write. An implementation must protect data/frame until I/O completes and may keep scanning for a clean victim. The public slides do not specify queues, synchronization, or a daemon, so this article does not invent one.

Clock does not recover exact recency. It distinguishes “used during the latest interval” from “not observed,” at far lower cost than per-access timestamps. Cheap evidence correlated with locality is often better for an OS fast path than perfect information.

## Clock-hand speed is also a pressure signal

The hand is driven by replacement demand, not wall time. Slow movement suggests few free-frame shortages and working sets that broadly fit. Rapid circling indicates repeated frame demand.

Speed alone is not a verdict: a large transient scan can move it quickly, while inactive processes can make it slow. Combine it with fault rate, I/O queues, CPU utilization, and dirty-page rate. Replacement metadata reveals pressure as well as drives decisions.

## Global versus per-process replacement chooses who can hurt whom

**Global replacement** puts all resident pages in one pool. One process's fault may evict another's page. Frames flow toward current demand, but performance isolation is weak.

**Per-process replacement** permits eviction only from the faulting process's frames, removing direct interference. It creates a new question: how many frames per process? Equal quotas waste capacity; working-set allocation requires estimation. The deck concludes that most systems use global replacement. That is a lecture generalization, not a timeless law for every kernel or cgroup.

Global pooling lends idle frames but couples workloads. Local pools isolate but can leave one process short while another quota is unused—a utilization/isolation trade-off.

## Thrashing: a 1% memory-reference page-fault rate can mean about 1,000 times slower

When active pages exceed physical memory, replacement evicts pages still in a working set. They fault again soon and evict other active pages. Nearly all time goes to backing-store I/O rather than computation: **thrashing**.

The [official Lecture 17 PDF's thrashing example](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/17/Lecture17.pdf) uses 100 ns DRAM and 10 ms disk and shows that a 1% fault rate gives:

```text
0.99 × 100 ns + 0.01 × 10,000,000 ns
= 100,099 ns
```

That is about a **1,001× slowdown** over 100 ns. The slide prints `.1` in the expression, but its “1 in every 100” premise and `100,099 ns` result require `.01`; this article uses the consistent value. The model omits overlap, queueing, and modern devices, but preserves the point: a rare path dominates when it is orders of magnitude slower.

Thrashing reinforces itself. While one thread waits for I/O, scheduling another process brings in a different working set and evicts more pages. More multiprogramming can reduce throughput, a serious issue in early many-user time-sharing systems.

## Handling thrashing means controlling active working sets

Replacement cannot manufacture frames. If active working sets exceed RAM, smarter victim order merely chooses who pays next. The deck's direct response is to suspend some processes so only jobs whose working sets fit together run concurrently.

This lowers the degree of multiprogramming: let fewer working sets make progress, then resume others after completion or pressure reduction. A personal-computer user can close applications; adding enough RAM is the deck's pragmatic final answer.

Lecture 17 therefore marks demand paging's boundary. Mechanism can trap, page in, and restart. Policy can exploit locality. Clock approximates LRU cheaply. Once demand exceeds capacity, the issue moves from queue discipline to admission, scheduling, and total resources.

## What you should be able to reason through

For a fault, separate mechanism (valid address, source, restart), fetching (target only or prefetch), and replacement (free frame, global/local pool, reference/dirty cost). For a reference string, fix frame count, draw resident state, update policy on every hit/fault, and count faults. For a real slowdown, ask whether the working set fits: if the Clock hand races, fault I/O saturates, and useful work collapses, a victim-order tweak may not cure thrashing.

## Update history

- 2026-08-22: Rewritten against the complete 19-page official deck, restoring fetching/replacement, Clock, global policy, and thrashing.

## References

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 17 slides: Demand Paging, Continued](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/17/Lecture17.pdf)
- [Operating Systems: Principles and Practice, Chapter 9](https://ospp.cs.washington.edu/)
- [OSTEP: Beyond Physical Memory — Mechanisms](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-beyondphys.pdf)
- [OSTEP: Beyond Physical Memory — Policies](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-beyondphys-policy.pdf)
- [Intel 64 and IA-32 Architectures Software Developer Manuals](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html)
