---
title: "Stanford CS111 Lecture 18: Disk Geometry, Interrupts, and DMA"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: en
series:
  name: "Reading Stanford CS111"
  order: 19
tldr: "A disk hides mechanical seek and rotation behind a linear block API; modern I/O then uses memory-mapped registers, DMA queues, and interrupts so the CPU mainly issues commands and receives completions."
description: "A lecture-by-lecture reading of Stanford CS111 Spring 2026 Lecture 18: HDD geometry, seek/rotation/transfer, linear blocks, MMIO, polling, interrupts, PIO, and DMA queues."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs111-lecture-18-magnetic-disks)

This is part 19 of [Reading Stanford CS111](/series/stanford-cs111), covering **Stanford CS111, Spring 2026, Lecture 18**. Mendel Rosenblum taught it on 2026-05-08; the official title is [Magnetic Disks](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/18/Lecture18.pdf). This article follows the public PDF page by page and uses the [course calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar). The Canvas/Panopto recording is not publicly accessible and is not treated as reviewed.

## An HDD is storage with moving parts

A drive contains one to ten platters, spinning at 5,000–15,000 RPM in [The deck](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/18/Lecture18.pdf), commonly in 2.5- and 3.5-inch sizes. An actuator moves an arm so read-write heads travel radially. Reading data is therefore not a simple array lookup: mechanical components must first reach the right position.

A circular track occupies one radius and is divided into sectors. [The slides](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/18/Lecture18.pdf) use 4,096-byte sectors, hundreds of thousands to about 500,000 tracks per radial inch, thousands to tens of thousands of sectors per track, and capacities from 500 GB to above 30 TB. They compare 1 TB to roughly 500 million text pages. These are Spring 2026 deck snapshots, not HDD standards; physical sectors, logical blocks, and vendor formats are not universally 4 KiB.

## One access contains three distinct costs

Seek moves the actuator to the target track, with a deck range of 3–10 ms. The drive selects a head, then waits for rotational latency: under uniform positioning, half a rotation on average, about 4 ms at 7,500 RPM. Only then does transfer occur as sectors pass the head, at [The slide](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/18/Lecture18.pdf)'s 150–280 MB/s.

[The deck](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/18/Lecture18.pdf) calls seek plus rotation latency, typically 5–15 ms; transfer time scales with length. Sequential I/O amortizes fixed mechanical costs, whereas many small random requests repeatedly pay them. This lecture does not present a disk-scheduling algorithm, so SSTF, SCAN, and C-SCAN should not be imported merely because scheduling often accompanies this topic.

## Flying only nanometers above the surface

The head must approach the platter without touching. Air dragged by the spinning surface forms a bearing on which it “flies”; the deck gives 3–10 nm, compared with an 80,000–100,000 nm human hair. These too are approximate [slide](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/18/Lecture18.pdf) ranges.

Dust or shock can damage the head and surface, historically causing catastrophic head crashes. Modern drives are sealed in clean enclosures and usually park heads on a ramp off the platter at shutdown; older ones used an on-surface landing zone. Laptop drives have used accelerometers to park during a fall, and modern HDDs compensate for vibration and thermal expansion. A stable API thus rests on continual control of nanoscale physical error.

## A linear block API hides geometry

Modern disks export `0, 1, …, N` blocks, conceptually through `read(startSector, sectorCount, physAddr)` and `write`. Older interfaces exposed track, surface, and sector; firmware now hides that geometry ([official slides](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/18/Lecture18.pdf)).

Outer tracks can hold more sectors than inner tracks, and firmware can remap bad sectors to spares. Logical adjacency therefore does not reveal exact physical position or latency. The OS gains a stable block namespace but cannot infer internal geometry precisely from a block number.

## Memory-mapped I/O and device registers

CPU/MMU physical address space covers DRAM and I/O devices. DRAM loads/stores are normally cacheable; devices listen to uncached accesses at particular addresses. These device registers let the OS control hardware through memory-mapped I/O (MMIO).

Register bits carry parameters written by the CPU, status loaded by it, and controls such as starting a read. They do not behave like ordinary memory: a start bit may always read zero, while completion may change without a CPU write. Compilers, CPUs, and drivers therefore cannot treat MMIO as freely cacheable ordinary variables.

## Choosing polling or interrupts

After the CPU starts a read, ready is zero until the device sets it. Polling repeatedly reads ready. It is simple and responsive, but wastes CPU cycles across millisecond disk operations.

With an interrupt, the device forces a trap on completion while the CPU performs other work. The processor enters a kernel vector; the OS identifies, services, and acknowledges the device, perhaps starts another operation, then returns to interrupted execution. System calls, page faults, and interrupts all use controlled transfer, with different triggers.

The deck notes that interrupts keep multiple devices busy alongside user code and can be spread across cores. CPU and device sides also have enable/disable flags. Interrupts are not free: they replace prolonged waiting with discrete handling work that must not lose events.

## PIO and DMA: who moves the bytes

Programmed I/O has the CPU move data using register loads and stores. It is simple but spends valuable execution capacity on byte movement. Direct Memory Access lets the device transfer directly to or from physical memory after the CPU supplies a buffer address.

DMA does not remove the CPU entirely. The OS allocates a suitable buffer, prepares commands, establishes permissions, and handles completion. Because the device acts outside ordinary CPU loads/stores, buffer visibility and lifetime become driver invariants. The deck does not expand cache coherence or IOMMU details, so they are not attributed to this agenda.

## Modern queues, doorbells, and completion

Modern interfaces mainly use DMA with minimal PIO for a doorbell. OS and device share command and response queues. To read sector 32, the OS builds a command naming sector and destination, then writes an uncached doorbell ([official slides](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/18/Lecture18.pdf)).

The device DMA-reads the command, DMA-writes sector bytes to the destination, DMA-writes a completion response, and interrupts the CPU. Control and data paths separate: the CPU builds descriptors and rings, the device moves bulk data, and an interrupt announces results.

Ordering is a correctness contract. The command must be visible before the doorbell; response and data must be complete before interrupt handling; the OS cannot recycle the buffer early. The slides do not teach barrier syntax, but their flow already shows why a driver is more than a call to `read`.

## From tape rooms to the same abstraction stack

The final two pages show old magnetic tape and an IBM System/360 datacenter without adding algorithms or quantitative claims. They provide historical context: software once confronted mechanical order more directly, while block APIs, DMA, and queues moved details into controllers and drivers.

Trace one request to test the lecture: a user requests a block; the OS builds a command; an MMIO doorbell notifies the device; the controller pays seek, rotation, and transfer; DMA writes memory; a response records completion; and an interrupt returns control to the kernel. Knowing who changes which state at every step matters more than memorizing HDD figures.

## Update history

- 2026-08-22: Rewritten against the official Lecture 18 PDF, with hardware figures explicitly scoped as slide snapshots.

## References

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 18 slides: Magnetic Disks](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/18/Lecture18.pdf)
- [Linux kernel documentation: Dynamic DMA mapping](https://docs.kernel.org/core-api/dma-api-howto.html)
- [OSTEP: Hard Disk Drives](https://pages.cs.wisc.edu/~remzi/OSTEP/file-disks.pdf)
