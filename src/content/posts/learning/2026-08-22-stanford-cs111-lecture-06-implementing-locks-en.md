---
title: "Stanford CS111 Lecture 6: Implementing Locks"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: en
series:
  name: "Reading Stanford CS111"
  order: 7
tldr: "Lecture 6 evolves a one-core interrupt-masking lock through multicore version 5, tracking guard, lock, and wait-queue state to prevent races and lost wakeups."
description: "A guide to Stanford CS111 Spring 2026 Lecture 6, following interrupt masking, atomic exchange, spinlocks, and blocking locks version by version."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs111-lecture-06-implementing-locks)

This is part 7 of [Reading Stanford CS111](/series/stanford-cs111), covering **Stanford CS111, Spring 2026, Lecture 6**. Mendel Rosenblum taught the lecture on 2026-04-10; its official title is [Implementing Locks](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/6/Lecture6.pdf). This article uses the public PDF and the [course calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar). The recording is behind Canvas/Panopto and is not treated as a source read for this article.

Lecture 6 stops treating a lock as a black box. Its 16-page deck begins with interrupt masking on one core, then adds atomic exchange, spinning, blocking, and wakeup across successive multicore versions. Each change removes a concrete race and may expose the next one.

## Track the lock invariant version by version

Across versions 1 through 5, follow only three pieces of state: whether the guard is held, whether the lock is available, and whether a waiter has entered the queue. The hard boundary is between observing failure and going to sleep, where a wakeup must not be lost. The sections therefore follow the versions rather than imposing a generic mechanism/policy template.


## One core: interrupt masking removes the scheduling point

The slides first restrict the machine to one core, where only a trap or interrupt can switch threads. The kernel disables interrupts while inspecting `locked` and changing the wait queue, then restores them afterward. This is a privileged kernel critical section, not an implementation applications may freely copy.

The waiting path exposes lost wakeup. If a thread queues itself, enables interrupts, and only then calls `blockThread`, an unlock may wake it in the gap. The original thread subsequently sleeps with nobody left to wake it. Queue insertion and transition to blocked must therefore appear atomic to unlock.

## Multiple cores: atomic exchange protects only the inner guard

Disabling interrupts locally does not stop another core. Atomic `exchange(true)` returns the old value while storing the new one in one indivisible read-modify-write. A false old value acquires the spinlock; true causes retry. The slides show the corresponding x86 `xchg` busy-wait loop.

Version 1 spins for the entire application lock. Version 2 adds a wait queue but leaves the queue unprotected. Version 3 uses a short spinlock around `locked` and queue bookkeeping, then blocks long waiters. Busy waiting is minimized to the inner guard rather than the user critical section.

## Versions 3 through 5: blocking and waking is the hard boundary

Version 3 still races between releasing the spinlock and calling `blockThread`. Version 4 changes the dispatcher interface: mark the current thread `BLOCKED`, release the spinlock, then `redispatch`. Unlock can now observe consistent state. The next slide asks what happens if an interrupt arrives in that gap.

Version 5 combines mechanisms. It disables local interrupts, acquires the cross-core spinlock, completes queue and thread-state transitions, releases the guard, and restores interrupts after redispatch. Interrupt masking prevents local preemption; atomic exchange prevents another core's concurrent modification. Unlock similarly either clears `locked` or removes and unblocks a waiter under brief protection.

The same division of responsibility is independently documented in the [Linux kernel's spinlock lessons](https://docs.kernel.org/locking/spinlocks.html): interrupt masking is local to one CPU, while the spinlock provides exclusion across CPUs. If an interrupt handler can take the same lock, failing to mask local interrupts can also self-deadlock a holder interrupted on that CPU. This is an implementation-level comparison supporting the deck's two-threat model, not a claim that its pseudocode is the Linux API.

The useful reading is to identify each version's linearization points: when acquisition occurs, when a thread becomes a waiter, and when unlock transfers ownership. If no single state transition answers one of these, search for an interleaving between “queued but not asleep” and “awakened but still blocked.”

The [Linux generic mutex design](https://docs.kernel.org/locking/mutex-design.html) offers a second topic-specific comparison. Its uncontended fast path uses an atomic owner update, its middle path may spin optimistically, and its slow path puts the task on a wait queue to sleep. The document also describes the atomic owner state and short spinlock protecting queue access. That supports the lecture's layered idea—brief spinning for bookkeeping and blocking for long contention—without retroactively treating Linux's three paths as Stanford's versions 1–5.

## Public-material scope and short-deck exception

The public PDF has only 16 pages. Excluding title, reading, and announcement slides, it concentrates on the uniprocessor version and incremental multicore versions 1–5; several pages repeat the same code to mark the next race. This article covers every version and both central questions without importing condition-variable or memory-model material from another offering, so it intentionally remains short.

One useful extension is fault-injection reading. After every state transition, assume that the thread is descheduled, the process crashes, or the machine loses power, then record what an observer can see. This is not a claim about a required course test; it is a method for turning the design diagrams into verification cases.

A second exercise is a mechanism/policy table. Put only capabilities on the left and selection or allocation rules on the right. An item that cannot be placed usually reveals two concepts that have not yet been separated.

## References

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 6 slides: Implementing Locks](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/6/Lecture6.pdf)
- [Operating Systems: Principles and Practice](https://ospp.cs.washington.edu/)
- [Linux kernel documentation: Locking lessons](https://docs.kernel.org/locking/spinlocks.html)
- [Linux kernel documentation: Generic Mutex Subsystem](https://docs.kernel.org/locking/mutex-design.html)
