---
title: "Stanford CS111 Lecture 4: Concurrency"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: en
series:
  name: "Reading Stanford CS111"
  order: 5
tldr: "Lecture 4 defeats each Too Much Milk attempt with an explicit schedule, deriving race condition, atomicity, critical section, and synchronization requirements from concrete interleavings."
description: "A guide to Stanford CS111 Spring 2026 Lecture 4, using Too Much Milk counterexamples to explain interleavings, races, atomicity, and critical sections."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs111-lecture-04-concurrency-atomicity)

This is part 5 of [Reading Stanford CS111](/series/stanford-cs111), covering **Stanford CS111, Spring 2026, Lecture 4**. Mendel Rosenblum taught the lecture on 2026-04-06; its official title is [Concurrency](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/4/Lecture4.pdf). This article uses the public PDF and the [course calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar). The recording is behind Canvas/Panopto and is not treated as a source read for this article.

Lecture 4 places two facts side by side: each thread executes sequentially, yet the global order among threads is not fixed. Too Much Milk is not a diversion; three failed attempts force precise definitions of race condition, atomicity, and critical section.

## Learn concurrency through counterexamples

First separate independent from cooperating threads, then split `read`, decision, and `write` into interleavable steps. Each proposed solution must be defeated by an explicit schedule. Only then do mutual exclusion, progress, and bounded waiting become more than labels attached after the fact.

## Independent and cooperating threads

Independent threads share no state, so scheduling cannot change their results. Cooperating threads share state and may become nondeterministic. Two threads printing `ABC` and `CBA` may interleave characters, but each thread's local order remains, ruling out some apparent outputs.

Cooperation remains necessary for shared disks and bank accounts, multicore parallelism, and overlapping I/O with computation. The goal is controlled conflict, not eliminating concurrency.

## Races and atomicity

Writes to different variables need not conflict. If one thread computes `A = B + 1` while another changes B, A depends on interleaving. `x++` is usually read, add, and write rather than one indivisible action.

Atomic means appearing instantaneous and unobservable midway. Aligned single-word reads and writes are usually atomic; structure copies and multi-step operations are not. “Usually” matters: exact guarantees depend on hardware, alignment, and the language memory model. Hardware must supply at least one atomic primitive before software can build higher-level synchronization.

## Too Much Milk, attempt by attempt

Two roommates can both observe no milk and both buy it. Correctness needs safety—never too much—and liveness—someone eventually buys it. A shared `milk` flag fails because a switch can occur between checking and buying. A shared note still fails when both read zero before either writes; lower probability is not correctness.

A turn variable can preserve safety while starving progress when the designated roommate is absent. Per-thread notes can make both back away. The fourth attempt works by making one side wait, but is asymmetric and busy-waits, consuming a processor without work. Peterson's algorithm is symmetric, but the lesson is that atomic reads and writes remain difficult to compose safely.

## The three definitions

Synchronization uses atomic operations to preserve cooperating-thread correctness. A critical section permits one thread at a time. Mutual exclusion enforces that rule, commonly through a lock. The next lecture packages the fragile milk protocols into locks and condition variables.

## Writing out the failing schedules

In the original version, A reads `milk==0`; B then reads zero and buys; A resumes and acts on its old observation. The problem is not a torn write but a non-atomic check-then-act sequence. With one shared note, A may read zero, B may also read zero and complete, and A may resume and buy anyway. A smaller race window is still a race.

The turn version prevents simultaneous buying but can fail liveness when it is A's turn and A never runs. Per-thread notes can fail when A sets `noteA`, B sets `noteB`, and both observe the other note: neither buys. The asymmetric fourth attempt breaks the tie, but B spins while waiting and consumes a core without useful work.

## Peterson belongs in the extension

The PDF only links Peterson's algorithm as a symmetric solution; it contains neither code nor proof. Following [Peterson’s original paper](https://doi.org/10.1016/0020-0190(81)90106-X), each thread declares intent and yields `turn` to the other. If both compete, the single final turn value favors only one, preserving mutual exclusion. Clearing intent on exit allows the waiter to progress under the two-thread, atomic-access assumptions.

It still busy-waits, directly handles two participants, and depends on memory-order assumptions. C++ specifies cross-thread visibility through explicit [atomic ordering rules](https://eel.is/c++draft/atomics.order), so textbook pseudocode without atomic semantics is not automatically valid C++ synchronization. Production code should use mutexes and condition variables with specified blocking and ordering semantics.

## Verify with a schedule, not intuition

Choose one Too Much Milk attempt and place every read, write, and condition check into two columns until the schedule produces duplicate purchases or no purchase. Then identify the atomic region required to exclude that counterexample. “Add a lock” without drawing its boundary has not located the race.

## References

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 4 slides: Concurrency](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/4/Lecture4.pdf)
- [CS111 Assignment 2: Synchronization](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/assign2/)
- [G. L. Peterson, Myths About the Mutual Exclusion Problem](https://doi.org/10.1016/0020-0190(81)90106-X)
- [C++ working draft: order and consistency](https://eel.is/c++draft/atomics.order)
- [cppreference: `std::mutex`](https://en.cppreference.com/w/cpp/thread/mutex)
- [cppreference: memory order](https://en.cppreference.com/w/cpp/atomic/memory_order)
- [Operating Systems: Principles and Practice](https://ospp.cs.washington.edu/)
