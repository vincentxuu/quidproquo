---
title: "Stanford CS111 Lecture 27: Trap-and-Emulate, Virtual I/O, and Nested Page Tables"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, virtualization]
lang: en
series:
  name: "Reading Stanford CS111"
  order: 28
tldr: "A VM expands the process interface into a machine interface; the hypervisor directly executes ordinary instructions, traps privileged operations, and virtualizes interrupts, I/O, and two-stage address translation."
description: "A reading of Stanford CS111 Spring 2026 Lecture 27: VM abstractions, simulation, direct execution, trap-and-emulate, virtual I/O, shadow/nested page tables, and VM uses."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs111-lecture-27-virtual-machines)

This is part 28 of [Reading Stanford CS111](/series/stanford-cs111), covering **Spring 2026 Lecture 27**, taught by Mendel Rosenblum on 2026-06-01 under [Virtual Machines](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/27/Lecture27.pdf). It follows the public PDF and [calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar); Canvas/Panopto video is inaccessible. SHA auditing shows Lecture 27 differs from adjacent Lectures 26 and 28.

## From process abstraction to machine abstraction

A process sees linear virtual pages, unprivileged CPU state, and calls such as open/read/write, fork, wait, and exit—a subset of the machine. CPU looks similar; memory and files differ substantially.

A hardware-like process instead sees all instructions and registers, physical pages, MMU, timer, disks, network, display, traps, and interrupts. A system call is merely one guest-machine trap.

This private machine is a VM and can run a complete guest OS and applications. A hypervisor shares one real machine among VMs, potentially with different guest systems.

## Hosted and hardware-controlling VMMs

A 1999 [slide](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/27/Lecture27.pdf) from Rosenblum's group places virtual x86, motherboard, disks, display, and network over a VMM. It is historical context, not every modern architecture's specification.

A hosted VMM runs over Linux, which controls hardware; another VMM controls hardware directly with Linux or NT 4.0 guests above. The distinction is bottom-level ownership and trusted base, not whether guests see a virtual PC ([official slides](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/27/Lecture27.pdf)).

Guests need not become host-system-call clients. In exchange, the hypervisor must reproduce CPU, MMU, devices, interrupts, and privilege semantics, creating a larger interface and attack surface than a process.

## Full simulation is slow; direct execution captures the common case

A simulator interprets CPU instructions, models memory/MMU with an array, disks with image files, and privilege/interrupt state. [The deck](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/27/Lecture27.pdf) estimates 100× CPU/memory slowdown and 2× I/O slowdown.

Direct execution runs the guest OS in host user mode. Ordinary instructions execute natively; privileged CLI, STI, POPF, and HALT trap to hypervisor emulation. Because privileged instructions are relatively rare, overhead is a smaller fraction.

Trap-and-emulate runs the common path natively and controls sensitive operations. It requires every isolation-affecting instruction to trap reliably rather than silently alter state at low privilege.

## CLI: virtual state is not physical state

Guest CLI in real user mode raises an illegal-instruction trap. The real IDT enters the hypervisor, which identifies CLI and marks virtual interrupts masked for that VM.

Return resumes after CLI in real user mode. Host interrupts remain enabled; otherwise one guest could block the hypervisor and other VMs. Only virtual CPU state changes.

Guest privileged state therefore lives in an interceptable representation while the hypervisor owns real privilege. Emulation also preserves next PC, exception visibility, and pending virtual events.

## A guest system call has two privilege layers

A guest application's syscall first traps to the hypervisor because the real IDT belongs to the VMM. The VMM consults the virtual IDT and register block, marks the vCPU in guest kernel mode, then runs guest-kernel code in real user mode.

The guest handles its process state and ends with sysret, which traps again. The VMM changes the vCPU back to guest user mode and resumes the application. Real kernel mode appears only during VMM traps.

Guest and hardware each maintain user/kernel state. The guest kernel believes it has privilege but never receives real kernel authority; the slide sequence keeps these states distinct.

## Virtual I/O and paravirtualization

Guests use MMIO, DMA, and interrupts. The hypervisor traps virtual-register accesses and simulates the device, then injects a virtual interrupt on completion; the backend may be hardware, a file, or software.

Register-by-register traps are expensive. Modified guest drivers can use higher-level hypervisor calls and batching, called paravirtualization, trading transparency for fewer exits.

Paravirtualization remains virtualization: the guest knowingly uses an efficient interface. CPU direct execution and paravirtual I/O can coexist, while full emulation retains unmodified-guest compatibility.

## Shadow maps and hardware second-stage translation

Guest virtual addresses map through guest tables to guest “physical” pages; the hypervisor maps those to host machine pages. The actual MMU must realize the composition.

Shadow page maps once encoded the composition directly. The VMM intercepted guest page-table changes and synchronized shadows, imposing high overhead on update-heavy workloads and requiring no mapping change escape monitoring.

Intel and AMD added another hardware table level: guest virtual→physical, hypervisor physical→machine. Hardware combines walks and reduces shadow traps. [The deck](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/27/Lecture27.pdf) names x86-64 extensions without versions or benchmarks, so none are invented.

## Encapsulation, history, and cloud consolidation

VMs encapsulate execution state and can be duplicated, saved, and moved. Developers retain OS-version environments and reproduce tests on one machine.

[The deck](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/27/Lecture27.pdf) traces VMs to late-1960s IBM, decline in the 1980s–1990s as private machines and time sharing prevailed, and renewed mid-1990s interest around Windows compatibility. This is a simplified industry history, not a complete invention chronology.

Data centers once isolated applications on separate underused machines. One application per VM lets several share a host, separates hardware provisioning from software, and enabled cloud computing. Utilization improves while the hypervisor becomes a shared failure and trust boundary.

## Update history

- 2026-08-22: Rewritten against Lecture 27 through VM abstraction, trap-and-emulate, virtual I/O, memory virtualization, and usage, with adjacent-artifact SHA auditing.

## References

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 27 slides: Virtual Machines](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/27/Lecture27.pdf)
- [Intel 64 and IA-32 Architectures Software Developer Manuals](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html)
- [AMD64 Architecture Programmer’s Manual, Volume 2](https://docs.amd.com/v/u/en-US/24593_3.41)
