---
title: "Stanford CS111 Lecture 3: Threads, Processes, and Dispatching, Continued"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: en
series:
  name: "Reading Stanford CS111"
  order: 4
tldr: "Lecture 3 follows running, blocked, and ready transitions to show how PCBs, context save/restore, and the dispatcher complete one CPU-control handoff."
description: "A guide to Stanford CS111 Spring 2026 Lecture 3, connecting thread states, PCBs, context switching, and dispatch through one CPU handoff."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs111-lecture-03-dispatching-context-switch)

This is part 4 of [Reading Stanford CS111](/series/stanford-cs111), covering **Stanford CS111, Spring 2026, Lecture 3**. Mendel Rosenblum taught the lecture on 2026-04-03; its official title is [Threads, Processes, and Dispatching, Continued](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/3/Lecture3.pdf). This article uses the public PDF and the [course calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar). The recording is behind Canvas/Panopto and is not treated as a source read for this article.

Lecture 3 takes up the question left by the previous lecture: when threads outnumber cores, how can each appear to keep progressing? The answer is not one scheduler function but a loop of state transitions, PCBs, context save/restore, and dispatch.

## Read the lecture as one CPU handoff

Follow one thread from running to blocked, another from ready to selected, and eventually the first back to ready. At each step ask what returns the core to the kernel and which execution state must remain intact for a correct resume.

## The dispatching loop in full

The lecture reviews threads as execution units and processes as threads plus execution state, then asks how a created thread reaches a core. CPU, processor, core, and hardware thread reflect different eras; the stable abstraction is one software thread per available execution context at a time.

An OS manages more threads than cores. Blocked threads wait for events, while ready threads must eventually run without damaging another process or the kernel. Dispatching is the placement mechanism; fairness, priority, and selection are scheduling policy. This lecture uses a FIFO ready queue and defers policy comparison to Lecture 8. ([official lecture PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/3/Lecture3.pdf))

## PCBs and thread states

The Process Control Block stores saved registers, scheduling information, process memory, open files, and accounting. It makes a thread not currently on a core restorable. Ready means eligible but waiting; blocked means waiting for an event. Completion moves a blocked thread to ready, not directly to guaranteed execution.

## Saving and restoring context

Each core's dispatcher runs a thread, saves it, and loads another. The slides trace A3 to B1: registers are saved on A3's stack, its stack pointer identifies that frame, then B1's stack pointer and registers are restored. Returning resumes B1 at its saved instruction.

Thread startup reuses this path. The kernel builds an initial stack and PCB that look previously switched out, with the return address set to the first instruction. An ordinary restore and return starts it.

## How the kernel regains a core

Cooperative yielding lets broken code monopolize a machine. System calls, illegal instructions, segmentation faults, and page faults trap into the kernel; device interrupts do so for events such as keyboard input or completed disk transfers.

A compute-bound thread may trigger neither, so a periodic timer interrupt guarantees kernel control and enables preemption. The loop is now complete: PCBs store state, thread states encode eligibility, context switches move execution, traps and interrupts regain control, and a ready queue supplies the next thread. Shared-state interleavings remain for Lecture 4.

## Walking once through the state diagram

Suppose A is running and calls `read`, while B waits ready. The trap enters the kernel; unavailable data moves A from running to blocked. The dispatcher saves A, selects B, and restores it. A later disk interrupt moves A from blocked to ready, not directly onto the core. A runs only after a dispatcher selects it, perhaps when B blocks or a timer preempts B.

Thus unblocking changes eligibility, dispatching occupies a core, and scheduling chooses among ready threads. On multicore hardware another dispatcher may take A immediately; the one-core diagram requires the current thread to leave running first.

PCB fields serve separate responsibilities. Saved registers and SP restore instruction execution; scheduling fields locate the thread in policy structures; memory metadata restores its address space; open-file state reconnects operations to kernel objects; accounting supports limits and observation. The PDF defines these categories, not a universal C structure shared by every OS.

Traps arise synchronously from the current instruction: system calls intentionally trap, while illegal instructions and page faults arise from execution conditions. Device interrupts arrive asynchronously. Both enter the kernel, but a timer uniquely guarantees control even when user code never cooperates.

Preemption is not free. Saving state costs work, process switches disturb caches and translations, a short timer interval adds overhead, and a long one hurts responsiveness. The lecture specifies neither a universal interval nor a final priority policy; FIFO is only the working baseline.

The context-switch sequence hinges on SP. Registers are saved into the current stack, and saving SP locates that frame. Switching SP makes restoration operate on another thread’s stack. A fabricated initial frame can therefore start a new thread through the ordinary restore path.

## Walk one dispatch by hand

Draw running, ready, and blocked boxes for threads A and B. Starting when A issues blocking I/O, label the PCB update, stack-pointer switch, B’s resume, and A’s return to the ready queue after I/O completion. If a step cannot be attributed to an event or the dispatcher, revisit that state-transition arrow.

## References

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 3 slides: Threads, Processes, and Dispatching, Continued](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/3/Lecture3.pdf)
- [CS111 Assignment 3: Thread Dispatcher](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/assign3/)
- [Linux `clone(2)` manual page](https://man7.org/linux/man-pages/man2/clone.2.html)
- [Linux `sched(7)` manual page](https://man7.org/linux/man-pages/man7/sched.7.html)
- [Operating Systems: Principles and Practice](https://ospp.cs.washington.edu/)
