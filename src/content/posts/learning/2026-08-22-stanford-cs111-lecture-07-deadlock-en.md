---
title: "Stanford CS111 Lecture 7: Deadlock Conditions and Global Lock Ordering"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: en
series:
  name: "Reading Stanford CS111"
  order: 8
tldr: "Lecture 7 extracts four necessary deadlock conditions from request/ownership graphs, then compares detection, prevention, and lock ranking; breaking circular wait is common in practice, but every module must obey one global order."
description: "A lecture-by-lecture reading of Stanford CS111 Spring 2026 Lecture 7: multiple-lock motivation, four deadlock conditions, resource graphs, detection, prevention, global lock ordering, and the mv case study."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs111-lecture-07-deadlock)

This is part 8 of [Reading Stanford CS111](/series/stanford-cs111), covering **Stanford CS111, Spring 2026, Lecture 7**. Mendel Rosenblum taught it on 2026-04-13; the official title is [Deadlock](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/7/Lecture7.pdf). This article uses only the public PDF and [course calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar). The Canvas/Panopto recording is not treated as a source read.

The previous lecture established mutexes and condition variables while warning that more locks create complexity. This lecture starts from the other side of that tradeoff. Multiple locks can reduce contention and let each data structure encapsulate synchronization, but a thread often needs several resources simultaneously. Conflicting acquisition orders can leave every critical section locally correct while the system as a whole stops forever.

## Why systems use multiple locks

The PDF gives three motivations. First, reducing contention: one coarse-grained lock for unrelated data blocks otherwise independent operations, while fine-grained locks may permit more concurrency. Second, modularity: one lock per structure allows a module to preserve its own invariants. Third, real operations cross structures, so threads often need several locks at once.

The first two points appear local. A module seems to need knowledge only of its own lock. The third makes the issue global. If an operation updates directory A and then B, releasing A in the middle may expose half-completed state, so it holds A while acquiring B. A reverse operation may hold B while requesting A. Deadlock emerges from acquisitions that are individually legal but globally incompatible.

## A minimal two-mutex deadlock trace

The PDF uses `m1`, `m2`, and two threads:

```cpp
// Thread A                    // Thread B
m1.lock();                    m2.lock();
m2.lock();                    m1.lock();
// ...                        // ...
m2.unlock();                  m1.unlock();
m1.unlock();                  m2.unlock();
```

If A acquires `m1` and B acquires `m2`, A's second line waits for `m2`, while B's second line waits for `m1`. Neither reaches an unlock. More scheduler time cannot solve it, and neither thread is merely slow; the wait relation has closed into a cycle.

The informal definition has three parts. A collection of threads is blocked; each waits for a resource owned by another member; and because every owner is blocked, none can release. “Two threads are stuck” is insufficient. Long I/O or lack of CPU time can pause work, but if an external event can still let one participant proceed, it is not this deadlock definition.

## Four necessary conditions

Deadlock is one theory result the lecture identifies as directly useful to OS design. Four necessary conditions must coexist; eliminating any one prevents deadlock:

1. **Limited access / mutual exclusion:** a resource cannot be freely shared. A mutex has capacity for one owner.
2. **No preemption:** once allocated, a resource cannot be forcibly removed; its owner must release it.
3. **Multiple independent requests / hold and wait:** a thread requests resources incrementally and keeps acquired resources while waiting for another.
4. **Circular wait:** request and ownership relations form a cycle, with each waiter needing a resource held by the next.

They are necessary, not four independent deadlock tests. A mutex provides mutual exclusion, yet one mutex alone has no resource cycle. Holding one lock while waiting for another creates only a chain; if its final owner can finish and release, progress remains possible. Diagnosis asks whether all four coexist.

They also form a review checklist beyond literal `lock()` calls. Can the resource be shared? Can the system revoke it? Does a caller retain prior allocations while requesting another? Can the global wait graph contain a cycle?

## Request and ownership graphs

The PDF draws threads and resources as different node types. Directed edges represent “resource owned by thread” and “thread waiting for resource.” Each edge should be translated into present state: who already holds what, and who still needs what. A long acyclic chain can unwind when its final owner finishes.

For example, T1 may wait for R2 owned by T2. If T2 does not wait for a resource held by T1, it can finish and release R2. Add T2 waiting for R1 owned by T1, and the path closes: `T1 → R2 → T2 → R1 → T1`.

For the lecture's mainly single-instance resources, the cycle directly shows circular wait. More general multiple-instance models need additional information, so an arbitrary graph cycle should not be promoted into a universal sufficient test. Here the graph makes lock owner/waiter relationships inspectable rather than developing a complete graph algorithm.

## Deadlock extends beyond locks

Any resource that causes waiting can enter the same structure. The PDF lists discrete locks, continuous memory exhaustion, tape drives, network messages, and distributed systems. They do not share one API, but each can support the relation “I retain my allocation while waiting for yours, and you wait for mine.”

Memory shows that a resource need not be one named object. Processes may retain some pages and all request more before they can complete. If none can reach a release point, a continuously measured resource can deadlock. In networks and distributed systems, ownership and requests span machines, making the global cycle harder to observe.

The PDF also warns that resource needs are generally unknown in advance. Inputs, control flow, and other modules' results can change future requests. That constraint directly limits prevention strategies: requiring complete declaration up front is theoretically clean but often operationally unrealistic.

## Solution 1: detect and break deadlock

Detection allows requests to occur, tracks request/ownership state, identifies deadlock, and terminates one thread to break the cycle. When the victim exits and releases resources, other members may proceed.

The PDF says this is usually impractical in operating systems. Arbitrarily terminating a thread can leave partially modified kernel or application state and external effects that cannot be generically undone. Victim selection, rollback, and repeated sacrifice are recovery problems beyond cycle detection.

Database systems use this approach more often because transactions can abort and retry. Abort still costs work, but the transaction abstraction defines how uncommitted changes are rolled back. Practicality depends on whether resource ownership can be safely undone.

## Solution 2: eliminate a necessary condition

Prevention designs the system so at least one necessary condition can never hold. The PDF considers each option.

Eliminating limited access means creating enough resources that threads never wait. That is unreasonable for locks, whose purpose is exclusive access, and physical memory and devices remain finite.

Eliminating no preemption means taking resources back. CPUs support this: the kernel saves execution state and resumes later. Locks do not. If an owner is halfway through restoring a data-structure invariant, transferring its lock exposes partial state. Preemptibility belongs to resource semantics, not scheduler preference.

Eliminating independent requests means requiring all resources at once: grant all or none. It is difficult to wait for several things without first locking any, and callers may not know their future needs. Conservative declarations over-allocate and reduce utilization and concurrency.

Eliminating circular wait means requiring one resource order. The PDF identifies this as the most common OS approach. It preserves exclusion, does not forcibly revoke resources, and does not require exact knowledge of the whole future set; it restricts the order of requests that do arise.

## Global lock ordering and lock ranks

Assign every lock a global rank and require acquisition strictly increasing, or strictly decreasing, with one direction system-wide. If a cycle existed, every hold-then-request edge around it would strictly increase rank. Returning to the starting lock would require its rank to exceed itself, which is impossible.

The discipline can be checked at runtime. When a thread acquires a lock, compare its rank with every lock currently held; reject an inversion immediately instead of waiting for a rare production interleaving. Rank checking validates ordering discipline, not absence of data races or deadlocks involving unranked resources.

The order must follow resource identity or a predefined rank, not caller parameter order. Two callers can operate on the same pair with reversed parameters; parameter order recreates opposing lock orders.

## The two-mv-process case study

The PDF makes the conflict concrete with concurrent moves:

```text
Process 1: mv a/x b/y
Process 2: mv b/z a/q
```

If implementation locks directories in command parameter order, process 1 locks `a` then `b`, while process 2 locks `b` then `a`. Once each owns one directory lock, this is the original `m1`/`m2` deadlock.

“Always lock the source first” does not solve it because source is the opposite directory in the second command. Both processes must sort the directory resources by one shared identity, such as a stable inode number or defined rank, and acquire in that order. They then request the same first lock. The winner can acquire the second; the loser does not hold a reverse lock that closes a cycle.

Ordering is a correctness rule, not a performance hint. One exceptional path using parameter order while another uses inode order is enough to reintroduce circular wait.

## Deadlock is a global design problem

The lecture's final insight is that deadlock breaks modularity. A module can prove that each access holds its proper lock and still cannot independently prove that the entire system lacks cycles. Every module that can hold locks together must agree on one ordering, and system changes, new locks, and new cross-module calls must preserve it.

This constraint can be painful. Code may hold a high-rank lock and later discover that it needs a low-rank resource. It cannot acquire directly; control flow or interfaces must change, or it must release and retry. Global order preserves safety by crossing module boundaries and restricting local implementation freedom.

A concrete code-review action follows: list locks held together on every path as `L1 < L2 < ...`, then merge all paths into one ordering graph. Contradictory edges mean the design permits circular wait; do not wait for a test to reproduce it. An acyclic graph does not discharge the other three conditions or cover non-lock resources, but it makes the common prevention discipline auditable.

## References

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 7 slides: Deadlock](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/7/Lecture7.pdf)
- [Operating Systems: Principles and Practice](https://ospp.cs.washington.edu/)
- [Linux kernel documentation: Runtime locking correctness validator](https://docs.kernel.org/locking/lockdep-design.html)
