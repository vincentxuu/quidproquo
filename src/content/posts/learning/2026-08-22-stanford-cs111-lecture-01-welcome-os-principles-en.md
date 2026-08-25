---
title: "Stanford CS111 Lecture 1: Welcome to CS111!"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: en
series:
  name: "Reading Stanford CS111"
  order: 2
tldr: "Lecture 1 follows shared I/O cards in the 1940s, batch processing, multiprogramming, and personal computers to explain how OS responsibilities accumulated as hardware costs and user needs changed."
description: "A guide to Stanford CS111 Spring 2026 Lecture 1, reading operating-system history as the origin of abstraction, protection, resource sharing, and the course’s three threads."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs111-lecture-01-welcome-os-principles)

This is part 2 of [Reading Stanford CS111](/series/stanford-cs111), covering **Stanford CS111, Spring 2026, Lecture 1**. Mendel Rosenblum taught the lecture on 2026-03-30; its official title is [Welcome to CS111!](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/1/Lecture1.pdf). This article uses the public PDF and the [course calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar). The recording is behind Canvas/Panopto and is not treated as a source read for this article.

Lecture 1 does not begin by asking students to memorize a closed definition of an OS. It follows changes in hardware cost and use to explain why operating systems accumulated layers: shared I/O cards, batch monitors, multiprogramming, and personal computers each answer a concrete bottleneck.

## How to read this historical lecture

Keep two lines in view. When hardware was scarce, an OS primarily improved machine utilization. As hardware spread, convenience, protection, and sharing across applications became central. The sections below follow the slide chronology, then use the course structure and grading scheme to show how that history becomes CS111’s learning map.

## Shared cards in the 1940s

The slides deliberately avoid beginning with a closed definition of an operating system. The field did not grow by deduction from a definition. In the 1940s, one person used a computer directly at its console, and the earliest “operating systems” were shared decks containing common device input/output routines. Two motives were already visible: convenience and avoiding repeated waste of expensive machinery. ([official lecture PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/1/Lecture1.pdf))

Batch processing moved the user away from the console. A user submitted punched cards describing a job; a batch monitor loaded jobs and printed program output or a memory image after a crash—the historical source of “core dump.” Machine utilization improved, but the edit-debug cycle became slower, and a job waiting for I/O could still leave the whole computer idle. ([official lecture PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/1/Lecture1.pdf))

This period establishes the first design objective: **when hardware is expensive and humans are cheap, keep the machine busy.** Data channels and interrupts later allowed I/O to overlap computation. Buffers and interrupt handlers then forced the OS to handle several events at once. Concurrency was not an ornamental topic added to the curriculum; it appeared immediately when systems attempted to improve utilization. ([official lecture PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/1/Lecture1.pdf))

## How protection produced the kernel

The simple batch monitor still ran one job at a time, could be damaged by a misbehaving job, and made short jobs wait behind long ones. Larger memories, relocation, and memory protection made safe coexistence possible.

The kernel emerged as code in privileged mode, resident in protected memory and able to control the machine, while applications ran with restricted authority. Isolation is therefore not a request that users behave. Hardware and the kernel jointly prevent one participant from modifying another participant’s state.

Multitasking also creates policy questions: who runs next, whether a short job should pass a long one, and what fairness means. The slide asking whether fairness matters more than total happiness previews scheduling policy rather than adding philosophical decoration.

By the mid-1960s, projects such as Multics and OS/360 also showed that an OS capable of solving more problems could become an enormous software system. The lecture connects the emergence of software engineering to failures in large operating systems. Abstraction and module boundaries are reliability mechanisms as much as organizational conveniences. ([official lecture PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/1/Lecture1.pdf))

## When hardware became cheap

The next phase reverses the objective: hardware becomes cheaper while human time becomes expensive. Interactive timesharing pulls people back into the loop. File systems add convenient persistent naming, while response time and thrashing become first-class problems. Personal computers initially resemble a return to one person and one machine, then grow complex again through networking, background work, and protection requirements.

Networking extends sharing across machines. Since the 2000s, operating systems have stretched in both directions, from phones and embedded devices to datacenters and clouds. Their scales differ, but the responsibilities can still be organized consistently: share processors through concurrency, share memory across processes, operate I/O devices efficiently, share storage through files, coordinate machines through networks, and protect participants from one another. ([official lecture PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/1/Lecture1.pdf))

The modern OS is therefore more than “a program that manages hardware.” Its kernel sits between applications and hardware, provides process, memory, and file-management abstractions, allocates finite resources, and constrains authority. Applications see a more regular and safer virtual machine; the kernel pays the cost of maintaining that illusion.

## How the three course parts connect

Lecture 1 divides the quarter into three parts:

1. **Concurrency:** processes, synchronization, and scheduling, supported by four programming assignments.
2. **Memory management:** linkers, dynamic storage, virtual memory, and paging, supported by two assignments.
3. **File systems:** disk layout, directory structures, and crash recovery, supported by two assignments.

Those counts add to eight because [Assignment 0](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/assign0/) is a C/C++ and environment warm-up. It reviews classes, methods, instance variables, `std::vector`, `std::map`, and `std::unordered_map`, and checks use of the myth machines, `gdb`, `sanitycheck`, and submission tools. It is not an OS topic assignment, but it fixes the toolchain on which every later systems experiment depends.

The slides explicitly contrast CS111 with CS106 and CS107. In the earlier courses, lectures often focus on assignments. CS111 lectures focus on principles and concepts; sections focus on assignment work, and exams focus on lecture material. A working program is therefore not complete exam preparation. Students must also compare mechanisms, state invariants, and analyze policy on paper.

## The grading scheme reveals the learning target

The [Spring 2026 syllabus](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/syllabus) assigns 55% of the grade to exams, 35% to assignments, and 10% to participation. The midterm is 20% and the final 35%; lecture and section participation are 5% each. Exams are in-person paper-and-pencil assessments, closed book and closed note except for a small number of note pages.

These are not merely administrative figures. More than half of the grade comes from exams, reinforcing the statement that exams test lecture material. A self-learner who implements only the assignment specifications misses a deliberate half of the course: explaining why a design is correct, when its model fails, and what changes when policy changes.

The assignment sequence makes the three threads concrete: lambdas, threads and processes; synchronization; a thread dispatcher; locks and condition variables; then memory-mapped encrypted files and Clock page replacement; finally reading a Unix V6 file system and implementing a journaling file system. These are not nine isolated projects. They move from execution to address spaces and then to persistent state.

The access boundary must remain explicit. The first lecture mentions Canvas, Panopto, Ed, and Gradescope, but those are not public research sources. This article can verify the schedule and claims present in the public PDF and calendar; it cannot import spoken examples from a recording it did not access.

## The reading method Lecture 1 leaves behind

The lecture’s main deliverable is not a feature list. It is a method for the remaining twenty-seven lectures: begin with the concrete historical problem, identify the mechanism the OS added, then extract a principle that can outlive the original hardware.

Applied to the next lecture, threads and processes are not merely two definitions. They are execution abstractions that make different trade-offs between sharing and isolation, and the dispatcher is a mechanism for allocating finite processors among them. The same pattern returns in virtual memory, file systems, and virtual machines.

## Check yourself with a historical causal chain

Choose one period and write “hardware or usage bottleneck → new OS mechanism → newly created policy or protection problem.” If the arrows cannot be explained, the dates have been memorized without the lecture’s causal account of design.

## References

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 1 slides: Welcome to CS111!](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/1/Lecture1.pdf)
- [CS111 Spring 2026 syllabus](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/syllabus)
- [Assignment 0: Welcome to CS111](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/assign0/)
- [CS111 enrollment FAQ](https://web.stanford.edu/class/cs111/faq)
- [CS111 Honor Code and collaboration policy](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/collaboration.html)
- [Operating Systems: Principles and Practice](https://ospp.cs.washington.edu/)
