---
title: "CS149 L16: Fine-Grained Locking and Lock-Free Programming, from Test-and-Set to the ABA Problem"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, parallelism, concurrency, performance, stanford, ai-course]
lang: en
series:
  name: "Reading Stanford CS149"
  order: 21
tldr: "CS149 L16 has three parts. It first looks at lock implementations through the lens of cache coherence (test-and-set, test-and-test-and-set, ticket locks, CAS, LL/SC). It then takes a sorted linked list from one big lock to hand-over-hand fine-grained locking. Finally it introduces lock-free programming: a single-producer/single-consumer queue, a CAS-based stack, the ABA problem, and hazard pointers. The slides land on a practical conclusion: when your program has the machine to itself, well-written lock-based code is often just as fast and much simpler. Lock-free designs pay off in systems where threads can be preempted or page-fault inside a critical section."
description: "A guide to Lecture 16 of Stanford CS149 (Fall 2025): deadlock, livelock, and starvation; the coherence traffic of test-and-set locks; test-and-test-and-set and ticket locks; building atomic_min and a lock from CAS; LL/SC and C++11 atomics; hand-over-hand locking on a sorted linked list; blocking vs. lock-free; SPSC queues, a lock-free stack, the ABA problem, DCAS, and hazard pointers."
draft: false
glossary:
  - term: "hand-over-hand locking"
    aliases: ["lock coupling"]
    definition: "While traversing a linked list, lock the next node before releasing the current one, so a thread never holds more than two adjacent locks."
    context: "CS149 L16 uses it to move a sorted linked list from one global lock to a lock per node, so operations on different parts of the list can proceed in parallel."
  - term: "ABA problem"
    definition: "A thread reads address A and prepares a CAS. Meanwhile other threads remove A and put it back. The CAS sees the same value and succeeds, even though the data structure has changed underneath it."
    context: "L16 shows it on a lock-free stack: the CAS sets top to a node that is no longer on the stack, and a node is lost."
  - term: "lock-free"
    definition: "A non-blocking progress guarantee: at any time some thread can make progress (systemwide progress), though an individual thread may still starve."
    context: "The L16 definition, contrasted with lock-based algorithms, where a descheduled lock holder stops everyone else."
  - term: "hazard pointer"
    definition: "Each thread publishes the node it is currently accessing. A thread that wants to free a node first puts it on a retire list and deletes it only once no hazard pointer refers to it."
    context: "Marked as an advanced topic in L16, used to stop a lock-free stack's pop from reading freed memory."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs149-fine-grained-locking-lock-free)

**Video status: Related supplementary video included; the original lecture recording has not been verified.** [Source details](#course-video-sources)

**This post is based on the Fall 2025 edition of [CS149](https://gfxcourses.stanford.edu/cs149/fall25).** It is part 21 of the [Reading Stanford CS149](/posts/ai/2026-09-30-cs149-course-overview-en) series. It follows [L15: Implementing Synchronization and Memory Consistency](/posts/ai/2026-09-30-cs149-synchronization-memory-consistency-en) and covers Lecture 16, "Fine-Grained Locking and Lock-Free Programming" (November 20, 2025).

The official material is the [L16 slides PDF](https://gfxcourses.stanford.edu/cs149/fall25content/media/finegrainedsync/16_finegrainedlock.pdf) (66 slides, also available [slide by slide](https://gfxcourses.stanford.edu/cs149/fall25/lecture/finegrainedsync/)). The title slide's full name is "Implementing Locks, Fine-Grained Synchronization, and (a short intro to) Lock-Free Programming", so lock implementation lives in this lecture too. Fall 2025 recordings are only on Canvas. The course home page points to the 2023 recordings instead, and the matching video is [2023 Lecture 13: Fine-Grained Synchronization and Lock-Free Programming](https://www.youtube.com/watch?v=GA1ObImqaMo). This post treats it as a listening supplement and follows the 2025 slides. The course as a whole is **A3**; for this lecture the slides are fully public and only the current-term recording is missing.

Part 5 of the series has no direct link to AI. Still, every thread pool and every multithreaded runtime you write sits on these primitives. The task queue in [PA2](/posts/ai/2026-09-30-cs149-pa2-task-graph-scheduling-en) is exactly a shared data structure that many threads hit at once.

## Course video sources

This article uses Fall 2025 materials. The official Fall 2025 course page states that this year's lecture videos cannot be distributed to the public and points to a 2023 YouTube playlist instead. The Fall 2023 recording below covers a closely related topic but its content may differ from the 2025 lecture, and the original recording has not been verified. Checked: 2026-10-10.

```youtube
url: https://www.youtube.com/watch?v=GA1ObImqaMo
title: Stanford CS149 I 2023 I Lecture 13 - Fine-Grained Synchronization and Lock-Free Programming
```

Original videos: [Stanford CS149 I 2023 I Lecture 13 - Fine-Grained Synchronization and Lock-Free Programming](https://www.youtube.com/watch?v=GA1ObImqaMo)

Course and recording entries:

- [CS149 2023 public recordings playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [Official course / lecture source](https://gfxcourses.stanford.edu/cs149/fall25/lecture/finegrainedsync/)

## Three ways to get stuck

Slide 3 defines three terms and notes that deadlock and livelock are correctness problems, while starvation is really about fairness:

| State | Slide definition | Example |
|---|---|---|
| Deadlock | Operations are outstanding, but none can make progress | Two threads each push work into the other's full work queue |
| Livelock | The system keeps executing operations, but no thread makes meaningful progress | Operations that keep aborting and retrying |
| Starvation | The system makes overall progress, but some processes make none | Yellow cars must yield to green cars and wait as long as green cars keep coming |

Slide 8 lists the four required conditions for deadlock: mutual exclusion, hold and wait, no preemption, and circular wait. You will need this list later to see why hand-over-hand locking cannot deadlock.

## Implementing locks: every attempt is a write

Slides 15–16 review the MSI protocol before any locks appear. The order is deliberate: the performance problems of locks are almost all coherence-traffic problems.

### Test-and-set: simple, but noisy

`ts R0, mem[addr]` atomically loads memory into a register and, if the value is 0, sets it to 1. Acquiring the lock means looping on `ts` until it reads back 0. The catch is that coherence treats test-and-set as a write every time. Each attempt issues a `BusRdX` and invalidates the line in every other cache. In the timeline on slide 19, P2 and P3 keep stealing the line from each other the whole time P1 holds the lock.

Slide 21's graph (credited to Culler, Singh, and Gupta) shows that the time spent just acquiring and releasing the lock grows with the processor count, because even the lock holder must win the interconnect to release it.

Slide 22 lists five properties of a good lock: low latency, low interconnect traffic, scalability, low storage cost, and fairness. The verdict on plain test-and-set: low latency under low contention, high traffic, poor scaling, one int of storage, and no fairness at all.

### Test-and-test-and-set: read first, then grab

The fix is to spin on an ordinary read in your own cache and only attempt test-and-set once the lock looks free:

```c
void Lock(int* lock) {
  while (1) {
    while (*lock != 0);              // spin on a local cached read, no bus traffic
    if (test_and_set(*lock) == 0)    // lock looks free, try to grab it
      return;
  }
}
```

Slide 25's analysis: slightly higher latency with no contention (one extra read), but far less traffic. Each waiting processor is invalidated once per lock release. Storage is unchanged, and there is still no fairness.

### Ticket lock: stopping the stampede

The shared flaw of the test-and-set family is that every waiter rushes the lock the moment it is released. A ticket lock works like the number dispenser at a deli counter. `next_ticket` hands out numbers with an atomic increment, `now_serving` calls them, and waiters only read. Slide 26 concludes that each release causes a single invalidation, and threads get the lock in the order they asked.

### CAS, LL/SC, and C++11 atomics

Slide 27 lists CUDA's atomic operations (`atomicAdd`, `atomicCAS`, and others). Slide 28 poses an exercise: build `atomic_min` out of `atomicCAS` alone. You read the old value, compute the new one, use CAS to confirm nobody changed the old value, and retry if they did. Slide 29 builds a lock from CAS and asks why the "read first, then CAS" version is faster under contention. The answer is the same as for test-and-test-and-set.

Slide 30 introduces load-linked/store-conditional. It is a pair of instructions: the SC succeeds only if no processor has written the address since the matching LL. On ARM the pair is `LDREX`/`STREX`. The slide leaves you a question: how would you implement LL/SC on a cache-coherent processor? It comes back as Problem 2 of [Written 4](/posts/ai/2026-09-30-cs149-transactional-memory-w4-en).

Slide 31 closes with C++11 `atomic<T>`. It gives atomic reads, writes, and read-modify-writes of whole objects, defaults to sequential consistency, and `is_lock_free()` tells you whether the implementation falls back to a mutex.

## Using locks: three versions of a sorted linked list

The running example on slide 33 is a singly linked, sorted list with only `insert` and `delete`. Slides 34–36 show what goes wrong without synchronization. Two threads inserting 6 and 7 compute the same `prev` and `cur`, and one insertion simply vanishes. If one thread inserts 6 while another deletes 10, the new node can end up hanging off a deleted node.

**Version 1: one lock for the whole list.** Slide 38's verdict: correctness is easy, but every operation is serialized, which can cap the whole application's parallelism.

**Version 2: hand-over-hand locking.** Each node gets its own lock. A traversal locks the next node before releasing the previous one (slide 40 illustrates the idea with a photo from *American Ninja Warrior*). In the code on slide 45, both `insert` and `delete` lock the list, lock the first node, then advance by "lock next, release old_prev."

Slide 46 tallies the design:

- **Gain**: operations on different parts of the list proceed in parallel, reducing contention for the global lock.
- **Difficulty**: it is hard to decide where mutual exclusion is needed. The slide asks you to explain why this code is obviously deadlock-free. Hint: go back to the four conditions. Every thread takes locks in the same head-to-tail order, so circular wait cannot happen.
- **Costs**: taking a lock at every step (traversal now writes memory), plus a lock's worth of storage per node.

The slide then asks for a middle ground: one lock guarding a run of consecutive nodes, trading some parallelism for lower overhead. It is the same trade-off as choosing task granularity in [L5](/posts/ai/2026-09-30-cs149-work-distribution-scheduling-en). Slide 47 leaves a take-home exercise: write a fine-grained locking binary search tree that supports insert and delete.

## Lock-free: no locks, just CAS to check whether anyone else touched it

### Why locks are blocking

Slide 49 defines a blocking algorithm as one where a thread can indefinitely prevent others from completing operations. Say thread 0 locks a node, then gets swapped out by the OS, crashes, or just takes a page fault. Nobody else can finish. The slide stresses that a lock-based algorithm is blocking whether the lock spins or uses preemption.

Slide 50 defines lock-free: non-blocking, with a guarantee that **some** thread makes progress. The definition does not rule out an individual thread starving.

### Single-reader, single-writer queues

The bounded queue on slide 51 is the simplest lock-free structure. It is an array where the consumer advances `head` and the producer advances `tail`. The two threads never wait on each other: push fails when the queue is full, pop fails when it is empty. The unbounded version on slides 52–53 (credited to Dr. Dobb's Journal) adds a `reclaim` pointer. The producer does all node allocation and deletion, freeing nodes the consumer has already passed on each push.

These slides carry an asterisk: assume a sequentially consistent memory system for now, or appropriate memory fences, or C++11 `atomic<>`. That is where [L15](/posts/ai/2026-09-30-cs149-synchronization-memory-consistency-en) on memory consistency comes in.

### A lock-free stack and ABA

On slide 54, both push and pop follow the same loop: read `top`, prepare the new value, CAS it in, retry on failure. The slide points out the contrast with fine-grained locking. Fine-grained locking locks part of the data structure. Here, threads hold no lock at all.

The ABA scenario on slide 55 (A, B, C, D are node addresses, not values):

1. Thread 0 starts a pop, reads `old_top = A` and `new_top = B`, and has not yet done its CAS.
2. Thread 1 pops A, pushes D, and pushes A back. The stack is now A → D → B → C.
3. Thread 0's CAS checks `top == A`, succeeds, and sets `top` to B. D is lost.

<details>
<summary>Three remedies (slides 56–59)</summary>

- **Counter plus DCAS**: add a `pop_count` to the stack and have pop use a double compare-and-swap on both `top` and the counter. The slides add that x86 has "double-wide" CAS instructions, `cmpxchg8b` and `cmpxchg16b`. They are not quite DCAS, but if `top` and the counter sit next to each other in memory, one wide CAS does the job.
- **Careful node allocation and reuse policies**: slide 56 notes that ABA can also be solved this way.
- **Hazard pointers**: slide 58 raises another problem. When pop reads `old.top->next`, that node may already have been freed by another thread. Slide 59 (marked as an advanced topic) has each thread publish the node it is reading. Nodes to delete go on a retire list, and once the list passes a threshold, only nodes no hazard pointer refers to are deleted.

</details>

Slide 60's lock-free linked-list insert has no lock overhead and no per-node lock storage, but it assumes insert is the only operation. Slide 61 explains why deletion makes things much harder: if B is deleted while E is being inserted after B, B ends up pointing to E even though B is no longer in the list. The slide points to Harris 2001 and Fomitchev 2004 for the curious.

## When you actually need lock-free

Slide 62 cites Hunt 2011, which compares lock-free, fine-grained locking, and pthread mutex versions of queues and linked lists. Slide 63's conclusion is worth remembering as stated:

- In this course you usually assume your program is the only thing on the machine, as in scientific computing, graphics, machine learning, and data analytics. There, well-written lock-based code can be as fast as lock-free code or faster, and it is often much simpler.
- Locks cause trouble in systems with many threads where page faults or preemption can hit inside a critical section, such as databases and web servers. Priority inversion, convoying, and crashing inside a critical section are problems usually covered in OS classes.

Slide 64's summary adds two points people tend to miss. Lock-free code still needs appropriate memory fences on modern relaxed-consistency hardware. And lock-free does not remove contention: under heavy contention, CAS keeps failing and threads keep spinning.

**Try this**: open the lock-free stack on slide 54 and trace the ABA timeline from slide 55 on paper. Then write the pop that uses `pop_count`. If you can say exactly why the counter makes step 3's CAS fail, you have the core of this lecture.

## A preview: generalizing what CAS does

Slide 65 closes with a question and answer. What role did CAS play in these lock-free implementations? It detected whether another thread modified the data structure while this thread was mid-operation. The next lecture's transactional memory generalizes the idea: let the system speculate that an operation will complete, and abort it if another thread interferes.

Slide 66 lists further reading: Michael & Scott 1996 (a multi-reader/writer lock-free queue), Harris 2001, Michael Sullivan's [RMC compiler](https://github.com/msullivan/rmc-compiler), and two blog posts.

## What this post can and cannot confirm

Confirmed: the contents of the L16 slides PDF, and the lecture date and summary on the course home page. Not confirmed: anything said in the Fall 2025 lecture beyond the slides (the recording is not public); the exact numbers in the slide 62 chart (this post does not read values off the graph); and slide-by-slide differences between the 2023 recording and the 2025 slides. Nothing here is based on the video.

Further reading: for locks and deadlock from the OS side, see [CS111 Lecture 6: Implementing Locks](/posts/learning/2026-08-22-stanford-cs111-lecture-06-implementing-locks-en) and [CS111 Lecture 7: Deadlock](/posts/learning/2026-08-22-stanford-cs111-lecture-07-deadlock-en).

Series navigation: previous [L15: Implementing Synchronization and Memory Consistency](/posts/ai/2026-09-30-cs149-synchronization-memory-consistency-en) | next [L17–L18: Transactional Memory + Written 4](/posts/ai/2026-09-30-cs149-transactional-memory-w4-en) | [series overview](/posts/ai/2026-09-30-cs149-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Official sources only have Fall 2023 recordings, so the status is now related supplementary video only, and video titles use the original titles.

## References

- [Stanford CS149 Fall 2025 course home page and schedule](https://gfxcourses.stanford.edu/cs149/fall25)
- [Lecture 16 slides PDF: Fine-Grained Locking and Lock-Free Programming](https://gfxcourses.stanford.edu/cs149/fall25content/media/finegrainedsync/16_finegrainedlock.pdf)
- [Lecture 16 page (slide by slide)](https://gfxcourses.stanford.edu/cs149/fall25/lecture/finegrainedsync/)
- [2023 Lecture 13 recording: Fine-Grained Synchronization and Lock-Free Programming (supplement)](https://www.youtube.com/watch?v=GA1ObImqaMo)
- [CS149 2023 public recordings playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [Written Assignment 4 (PDF)](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst4.pdf)
- [Michael Sullivan: RMC compiler (listed as further reading in the slides)](https://github.com/msullivan/rmc-compiler)
