---
title: "CS149 L17–L18: Transactional Memory and Written 4, Handing \"Make This Atomic\" to the System"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, parallelism, concurrency, hardware, stanford, ai-course]
lang: en
series:
  name: "Reading Stanford CS149"
  order: 22
tldr: "Coarse locks are easy to write but slow; fine-grained locks are fast but easy to get wrong. Transactional memory lets the programmer just declare atomic { } and leaves atomicity and isolation to the system. CS149 L17 covers the motivation (failure atomicity, composability) and the design space: data versioning is eager (undo log) or lazy (write buffer), and conflict detection is pessimistic or optimistic. L18 opens up STM runtime data structures and the McRT algorithm, then shows how HTM uses per-line R/W bits plus the coherence protocol to detect conflicts, ending with Intel Haswell's RTM. Written 4 ties MSI, LL/SC, locks and memory ordering, and fine-grained locking on a doubly linked list into four problems."
description: "A guide to Lectures 17 and 18 of Stanford CS149 (Fall 2025) and Written Assignment 4: the semantic difference between atomic blocks and lock/unlock, TM atomicity, isolation, and serializability, eager vs. lazy versioning, pessimistic vs. optimistic conflict detection, STM transaction descriptors and records, McRT STM, HTM read/write bits and TCC, Intel RTM, and the topics of Written 4's four graded problems and 12 practice problems."
draft: false
glossary:
  - term: "transactional memory"
    aliases: ["TM"]
    definition: "A synchronization mechanism that runs a sequence of memory accesses like a database transaction: on commit all writes take effect at once, on abort nothing is left behind, and no other processor sees intermediate state before commit."
    context: "CS149 L17–L18 present it as a synchronization abstraction one level above locks."
  - term: "eager versioning"
    aliases: ["undo-log versioning"]
    definition: "Writes inside a transaction update memory directly while the old values are recorded in an undo log, which is replayed on abort."
    context: "L17's verdict: fast commit, slow abort, and fault-tolerance issues if the system crashes mid-transaction."
  - term: "lazy versioning"
    aliases: ["write-buffer versioning"]
    definition: "Writes inside a transaction go to a write buffer and reach memory only at commit; an abort simply discards the buffer."
    context: "L17's verdict: fast abort and no fault-tolerance issues, but slower commit."
  - term: "HTM"
    aliases: ["hardware transactional memory"]
    definition: "Transactional memory implemented in hardware: caches hold the transaction's data versions, and cache coherence requests detect conflicts between transactions."
    context: "L18 walks through a lazy-optimistic HTM, including per-line R/W bits and a two-phase commit."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs149-transactional-memory-w4)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

**This post is based on the Fall 2025 edition of [CS149](https://gfxcourses.stanford.edu/cs149/fall25).** It is part 22, the final part, of the [Reading Stanford CS149](/posts/ai/2026-09-30-cs149-course-overview-en) series, following [L16: Fine-Grained Locking and Lock-Free Programming](/posts/ai/2026-09-30-cs149-fine-grained-locking-lock-free-en). It covers Lecture 17, "Transactional Memory (Part I)" (December 2, 2025), Lecture 18, "Transactional Memory (Part II) + AMA" (December 4, 2025), and Written Assignment 4 (listed under Dec 3 on the course home page).

Official material used:

- [L17 slides PDF](https://gfxcourses.stanford.edu/cs149/fall25content/media/transactions/17_transactionalmem.pdf) (50 slides, [slide-by-slide page](https://gfxcourses.stanford.edu/cs149/fall25/lecture/transactions/))
- [L18 slides PDF](https://gfxcourses.stanford.edu/cs149/fall25content/media/wrapup/18_transactionalmem_A4wu1Q8.pdf) (62 slides, [slide-by-slide page](https://gfxcourses.stanford.edu/cs149/fall25/lecture/wrapup/))
- [Written Assignment 4 PDF](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst4.pdf) (47 pages)

Fall 2025 recordings are only on Canvas. The course home page points to the 2023 recordings instead; the matching videos are [2023 Lecture 16: Transactional Memory 1](https://www.youtube.com/watch?v=rFFf3WIJ7BA) and [2023 Lecture 17: Transactional Memory 2](https://www.youtube.com/watch?v=Tbk1vnYLQqI). This post treats them as listening supplements and follows the 2025 slides. The course as a whole is **A3**; both lectures' slides and Written 4 are fully public, and what is missing is the current-term recording and the solutions.

## Course video sources

This article uses Fall 2025 materials. The public Fall 2023 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=rFFf3WIJ7BA
title: 2023 Lecture 16 recording: Transactional Memory 1 (supplement)
```

```youtube
url: https://www.youtube.com/watch?v=Tbk1vnYLQqI
title: 2023 Lecture 17 recording: Transactional Memory 2 (supplement)
```

Original videos: [2023 Lecture 16 recording: Transactional Memory 1 (supplement)](https://www.youtube.com/watch?v=rFFf3WIJ7BA)、[2023 Lecture 17 recording: Transactional Memory 2 (supplement)](https://www.youtube.com/watch?v=Tbk1vnYLQqI)

Course and recording entries:

- [CS149 2023 public recordings playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [Official course / lecture source](https://gfxcourses.stanford.edu/cs149/fall25/lecture/transactions/)

## Between a lock and a hard place

Slide 4 of L17 is titled "Between a Lock and a Hard Place." Locks force a trade-off between the degree of concurrency (performance) and the chance of races or deadlock (correctness). Coarse locks give low concurrency but are easier to get right. Fine-grained locks like last lecture's hand-over-hand scheme give high concurrency but are easier to get wrong.

The slides walk this trade-off through Java's HashMap (slides 11–15):

| Version | Good | Bad |
|---|---|---|
| Plain `HashMap` | No lock overhead when synchronization is not needed | Not thread safe |
| Java 1.4 synchronized wrapper | Thread safe, easy to program | One lock for everything, poor scalability |
| One lock per bucket | Thread safe, high concurrency | Lock overhead even when synchronization is not needed |
| Wrap everything in `atomic { }` | Thread safe, easy to program | Performance depends on the workload and on how atomic is implemented |

Slides 16–26 make the difference concrete with a tree. Two threads want to modify nodes 3 and 4. With hand-over-hand locking they block each other on shared ancestors 1 and 2. As transactions, A reads 1, 2, 3 and writes 3, while B reads 1, 2, 4 and writes 4. There are no read-write or write-write conflicts, so both proceed; only when both write node 3 must they be serialized. Slide 27 charts coarse locks, fine locks, and TCC (a hardware TM system) on a HashMap and a balanced tree.

## atomic is a declaration, not a lock

Slide 6 replaces `lock(); ... unlock();` with `atomic { ... }` and stresses that atomic is **declarative**. You state what you want (keep this block atomic), not how to do it. The system could implement atomic with locks, but the implementations in these lectures use optimistic concurrency and serialize only on true read-write or write-write conflicts.

Slide 8 defines the three semantic properties of a transaction:

- **Atomicity**: on commit, all writes take effect at once; on abort, it is as if the transaction never happened.
- **Isolation**: no other processor can observe the transaction's writes before it commits.
- **Serializability**: transactions appear to commit in a single serial order, but the semantics do not guarantee which order.

Slide 9 has a memorable framing: TM wants to maintain, for a whole set of reads and writes, the properties that coherence maintains for a single address.

### Two more motivations

**Failure atomicity** (slides 29–30). With locks, a `transfer` function needs hand-written undo code for each exception. Miss a case and side effects can leak, or the system can even deadlock. Inside `atomic`, an exception aborts the transaction, all memory updates are undone, and no failed thread is left holding a lock.

**Composability** (slides 31–33). `transfer(A, B)` locks A then B. If another thread runs `transfer(B, A)` at the same time, you have deadlock. Avoiding it takes a system-wide lock-ordering policy, which breaks modularity. With transactions, the outermost transaction defines the atomicity boundary. `transfer(A,B)` and `transfer(B,A)` are serialized automatically, while `transfer(A,B)` and `transfer(C,D)` run concurrently. The slide hedges this with "(in theory)."

When L18 slide 3 restates TM's promise, it gives a concrete figure: system support for transactions can achieve 90% of the benefit of expert fine-grained locking with 10% of the development time. The same slide in L17 (slide 34) says "most of the benefit" with "much less development time."

### Self-check: atomic { } ≠ lock() + unlock()

Slide 35 insists you understand this difference:

- A lock is a low-level blocking primitive. On its own it provides neither atomicity nor isolation.
- Locks can implement an atomic block, but locks also serve purposes beyond atomicity, so not every lock can become an atomic region.
- Atomic blocks remove many data races, but programmers can still commit atomicity violations. Slide 37's example splits `ptr = A` and `B = ptr->field`, which belong together, into two atomic blocks, and another thread sets `ptr` to `NULL` in between.

Slide 36 leaves a puzzle. Two threads each set their own flag inside `synchronized` and then wait for the other's flag. What happens if you replace `synchronized` with `atomic`? Hint: recall the definition of isolation.

## The design space: two questions, three dimensions

L17 slide 40 says a TM implementation must answer two questions, and L18 adds a third dimension.

**1. Data versioning**

| | Eager (undo log) | Lazy (write buffer) |
|---|---|---|
| On write | Update memory, log the old value | Write into the buffer |
| Commit | Fast, data is already in memory | Slower, the buffer must be flushed |
| Abort | Slower, replay the log | Fast, clear the buffer |
| Fault tolerance | Problems if the system crashes mid-transaction | No fault-tolerance issues |

**2. Conflict detection.** The system tracks each transaction's read set and write set and looks for two kinds of conflict: A reads a value that pending transaction B wrote but has not committed (read-write), or both A and B write the same address (write-write).

- **Pessimistic (eager)**: check on every load and store, and let a contention manager decide whether to stall or abort. It detects conflicts early, wastes less work, and can turn some aborts into stalls. The downsides: no forward-progress guarantee, more aborts in some cases, and checks on the critical path. Case 4 on slide 47 has two transactions restarting each other with no progress, and the slide asks how to avoid that livelock.
- **Optimistic (lazy)**: check at commit time and give priority to the committing transaction. It guarantees forward progress and allows bulk communication. The downside: conflicts are found late, and fairness problems remain possible.

**3. Detection granularity** (L18 slide 16). Object granularity has low overhead but causes false conflicts. Field or word granularity reduces false conflicts at higher time and space cost. Cache-line granularity matches hardware TM but is hard for programmers and compilers to reason about. You can also mix per type, such as element-level for arrays and object-level for everything else.

L18 slide 12 lists real systems and says the optimal design remains an open question. Software TM includes Sun TL2 (lazy + optimistic) and Intel STM variants. Hardware TM includes Stanford TCC (lazy + optimistic), MIT LTM and Intel VTM (lazy + pessimistic), and Wisconsin LogTM (eager + pessimistic, which the slide calls easiest with conventional cache coherence).

## STM: the compiler inserts barriers

L18 slide 13 shows how software TM rewrites a program. `atomic` becomes `tmTxnBegin()`/`tmTxnCommit()`, and each read or write becomes a `tmRd()` or `tmWr()` call. These calls are STM barriers that do the bookkeeping: versioning, read/write-set tracking, and so on. Because the same function is called both inside and outside transactions, STM needs function cloning or dynamic translation.

Slide 14 describes two runtime data structures:

- **Transaction descriptor (one per thread)**: read set, write set, and undo log or write buffer, used for conflict detection, commit, and abort.
- **Transaction record (one per datum)**: a pointer-sized record. Shared data uses a version number or a shared reader lock; exclusive data uses a writer lock pointing to the owner. The slide notes this is the same way hardware cache coherence works.

<details>
<summary>The McRT STM algorithm (L18 slides 17–21)</summary>

The slides' example is based on Intel's McRT STM: eager versioning, optimistic reads, pessimistic writes, with timestamps for version tracking.

- A global timestamp is incremented when a writing transaction commits. Each transaction keeps a local timestamp, the global value when it last validated.
- The 32-bit transaction record: the least significant bit is 0 if writer-locked and 1 if not. The other bits hold the version of the last commit when unlocked, or a pointer to the owning transaction when locked.
- **Read**: read memory directly, check that it is unlocked and its version is ≤ the local timestamp; otherwise validate the whole read set. Then add it to the read set.
- **Write**: validate, acquire the lock, add to the write set, write an undo-log entry, write in place.
- **Commit**: atomically add 2 to the global timestamp (the low bit is reserved for the write lock). If the old global value exceeds the local timestamp, validate the read set. Finally, release each write-set lock and set its version to the new global timestamp.

Slides 20–21 trace an example that copies foo into bar: another transaction must see bar as either all old values or all new values, never half and half.

</details>

Slide 23 lists STM's challenges: software barrier overhead, function cloning, robust contention management, and the memory model (strong vs. weak atomicity). Slides 24–27 show that splitting monolithic barriers into pieces like `txnOpenForWrite` and `txnLogObjectInt` lets the compiler see and remove redundant logging and locking. Slide 28 is an exercise: in an optimistic-read, pessimistic-write, eager-versioning STM, what steps does `obj.f1 = 42` need?

## HTM: caches do versioning, coherence does conflict detection

Slides 29–30 make the case for hardware. STM costs 2–8x per thread in barrier overhead. Measured single-thread STM runs 1.8–5.6x slower than sequential code, and most of the time goes to read barriers and commit, since most programs read more than they write. Slide 31 sorts hardware support into three kinds: hardware-accelerated STM (keeps software barriers), hardware TM (no software barriers), and hybrid TM that switches between the two.

The core idea of HTM (slides 32–33):

- **Versioning lives in the cache.** The cache holds the write buffer or undo log, and each line gets two extra bits: R for read-set membership and W for write-set membership. All the bits are gang-cleared on commit or abort.
- **Conflicts are detected through coherence requests.** Seeing a shared request for a W line is a read-write conflict. Seeing an exclusive request for an R line is a write-read conflict. Seeing an exclusive request for a W line is a write-write conflict.
- A register checkpoint must also be taken at transaction begin so an abort can restore execution state.

Slides 34–41 walk a lazy-optimistic design through `Xbegin; Load A; Load B; Store C ⇐ 5; Xcommit`. Commit has two phases: first obtain exclusive access to the write-set lines, then gang-reset the R/W bits so the write set becomes ordinary dirty data. If another core commits a write to A, its exclusive request hits A in the local read set, and the local transaction aborts: invalidate the write set, clear the bits, restore the register checkpoint. Slide 39 asks a good question: why isn't a transactional store a load into exclusive state?

Slide 42's result: HTM is 2–7x faster than STM, within 10% of sequential for one thread, and scales efficiently with processor count.

Slides 44–48 are an exercise on TCC (Transactional Coherence and Consistency), which uses TM itself as the coherence mechanism: all transactions, all the time. Given four transactions, you schedule them in the fewest steps under lazy, optimistic, one-commit-per-step assumptions.

Finally, slide 49 covers Intel Haswell's restricted transactional memory: `xbegin` (which takes a fallback address to jump to on abort, for example a spin-lock code path), `xend`, and `xabort`, with the read and write sets tracked in the L1 cache. The processor may abort a transaction for many reasons, such as evicting a line in the read or write set, and it does not guarantee progress, so the fallback path is required.

## Second half of L18: wrapping up the course

From slide 51 on, L18 wraps up the course and opens an AMA. Slides 55–56 restate the course's threads: identifying parallelism; scheduling work efficiently (load balance, and overcoming bandwidth, latency, and synchronization limits); exploiting locality; how throughput-oriented hardware works; and abstractions that help structure efficient code (data-parallel thinking, functional parallelism, transactions, tasks, SPMD). Slide 58 suggests follow-on courses: CS 217 (Hardware Accelerators for Machine Learning), CS 348K (Visual Computing Systems), and CS/EE 282 (Computer Systems Architecture).

## Written 4: the four graded problems

The Written 4 PDF has four graded problems worth 25 points each. Problems 1 and 2 are graded for correctness; Problems 3 and 4 are graded on effort only. What follows describes what each problem exercises, not the answers.

| Problem | What it exercises | Related lecture |
|---|---|---|
| 1. MSI Coherence Protocol Warmup | Fill in the states of lines X and Y in each cache after a sequence of P0/P1 loads and stores | [L14: Cache Coherence](/posts/ai/2026-09-30-cs149-cache-coherence-en) |
| 2. Load Linked / Store Conditional and Cache Coherence | A read-write lock built on LL/SC. Part A asks how it differs fundamentally from the way MSI keeps readers and writers apart; Part B fills in bus transactions and cache states as three processors run `read_unlock` | L14, L16 |
| 3. Coherence, Consistency, and Locks | A: with a CAS lock on an MSI system, why the processor holding the lock need not be the one whose cache has the line in M state. B: on a machine that relaxes both write-after-write and read-after-write ordering, why thread 2 can see x=0 after acquiring the lock | L15, L16 |
| 4. Two threads + a doubly Linked List | A sorted doubly linked list with one thread inserting from the head and one from the tail, no locks. Decide which insertions can go wrong, then see what new problem hand-over-hand locking causes, and finally fix it with `trylock` without re-traversing the list | L16 |

Part D of Problem 4 has specific constraints: hold locks on the nodes before and after the new node when inserting, never restart the traversal from the head, and ignore livelock. Read the two hints first. There are only inserts, so a pointer cannot disappear from under a thread. And a thread that holds no locks cannot know what has changed since it last looked.

The PDF also has 12 practice problems. Topics include another MSI state table, false sharing caused by struct layout, cache coherence and false sharing, coherence behavior of the ISPC `sinx` example, a hand-over-hand concurrent linked list, two `atomicMin` implementations, fine-grained synchronization, locks on graph nodes, hash table parallelization, and a concurrent binary search tree with locks on edges.

**Try this**: do the MSI table in Problem 1 first; if you get stuck, go back to L16 slide 16, which walks through a similar sequence step by step. Then do Parts A and B of Problem 4 and draw the pointer states for the interleavings yourself. There are no public solutions. To check your answers, write a small program where two threads interleave many inserts, then verify that every `next` and `prev` agree.

## What this post can and cannot confirm

Confirmed: the contents of the L17 and L18 slides and the Written 4 PDF, and the lecture dates and the Written 4 date on the course home page. Not confirmed: anything said in the Fall 2025 lectures or AMA beyond the slides (the recordings are not public); exact numbers in the performance charts (this post only quotes figures the slides state in text); and Written 4 solutions and grading details (not public). The MSI diagrams in Written 4 carry a "Stanford CS149, Fall 2020" footer, which looks like a reused figure; this post draws no conclusion from it.

Further reading: for locks and deadlock from the OS side, see [CS111 Lecture 7: Deadlock](/posts/learning/2026-08-22-stanford-cs111-lecture-07-deadlock-en).

Series navigation: previous [L16: Fine-Grained Locking and Lock-Free Programming](/posts/ai/2026-09-30-cs149-fine-grained-locking-lock-free-en) | this is the last part | [series overview](/posts/ai/2026-09-30-cs149-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [Stanford CS149 Fall 2025 course home page and schedule](https://gfxcourses.stanford.edu/cs149/fall25)
- [Lecture 17 slides PDF: Transactional Memory (Part I)](https://gfxcourses.stanford.edu/cs149/fall25content/media/transactions/17_transactionalmem.pdf)
- [Lecture 17 page (slide by slide)](https://gfxcourses.stanford.edu/cs149/fall25/lecture/transactions/)
- [Lecture 18 slides PDF: Transactional Memory (Part II) + Course Wrap Up](https://gfxcourses.stanford.edu/cs149/fall25content/media/wrapup/18_transactionalmem_A4wu1Q8.pdf)
- [Lecture 18 page (slide by slide)](https://gfxcourses.stanford.edu/cs149/fall25/lecture/wrapup/)
- [Written Assignment 4 (PDF)](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst4.pdf)
- [2023 Lecture 16 recording: Transactional Memory 1 (supplement)](https://www.youtube.com/watch?v=rFFf3WIJ7BA)
- [2023 Lecture 17 recording: Transactional Memory 2 (supplement)](https://www.youtube.com/watch?v=Tbk1vnYLQqI)
- [CS149 2023 public recordings playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
