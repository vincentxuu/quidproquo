---
title: "CS149 L5 Work Distribution and Scheduling: From Work Queues to Cilk's Work Stealing"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, parallelism, performance, stanford, ai-course]
lang: en
series:
  name: "Reading Stanford CS149"
  order: 6
tldr: "Load balancing is hard because it pulls against scheduling cost: smaller tasks balance better, but every task grab pays a synchronization cost. CS149 Lecture 5 first lays the options out as a continuum from static to dynamic, then takes apart the Cilk runtime: one deque per worker, run the child at a spawn and leave the continuation for others to steal, and idle threads steal the biggest chunk of work from the top of someone else's deque."
description: "A guide to Stanford CS149 (Fall 2025) Lecture 5: when static, semi-static, and dynamic assignment apply, the task-granularity trade-off, scheduling long tasks first, distributed work queues, and the Cilk Plus runtime: cilk_spawn/cilk_sync semantics, child stealing vs. continuation stealing, deque-based stealing, and greedy join."
draft: false
glossary:
  - term: "work stealing"
    definition: "A scheduling strategy in which each worker thread keeps its own work queue and, when that queue runs dry, steals work from another thread's queue."
    context: "CS149 Lecture 5 uses the Cilk Plus runtime to show how it achieves load balance at low synchronization cost."
  - term: "continuation stealing"
    aliases: ["run child first"]
    definition: "At a spawn, the current thread runs the spawned child and places the rest of the caller (the continuation) in its queue for other threads to steal."
    context: "The strategy Cilk Plus uses; when no steals happen, execution order matches the serial program with the spawns removed."
  - term: "parallel slack"
    definition: "The ratio of independent work to the machine's parallel execution capability."
    context: "The Lecture 5 slides say about 8 is a good ratio in practice: too little makes balancing hard, too much raises the cost of managing fine-grained work."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs149-work-distribution-scheduling)

**This post is based on the Fall 2025 offering of [CS149](https://gfxcourses.stanford.edu/cs149/fall25).** It is part 6 of the [Reading Stanford CS149](/posts/ai/2026-09-30-cs149-course-overview-en) series and follows [Lecture 4, the parallelization thought process](/posts/ai/2026-09-30-cs149-parallelizing-thought-process-en). It covers Lecture 5, "Program Optimization 1: Work Distribution and Scheduling" (2025-10-07).

The official source is the [Lecture 5 slide PDF](https://gfxcourses.stanford.edu/cs149/fall25content/media/perfopt1/05_progperf1.pdf) (63 pages, with a [slide-by-slide web version](https://gfxcourses.stanford.edu/cs149/fall25/lecture/perfopt1/)). Fall 2025 recordings are on Canvas only; the course homepage points to the 2023 recordings instead, here the [2023 Lecture 5 video](https://www.youtube.com/watch?v=mmO2Ri_dJkk). This post follows the 2025 slides and lists the video only as a listening supplement. Access level for this lecture is **A3**: the slides are fully public, and what's missing is the current-term recording.

The "Today" slide lists three items: finishing Lecture 4's grid solver, basic load-balancing techniques, and a deep dive into Cilk's scheduler. This post covers the last two.

## Course video sources

This article uses Fall 2025 materials. The public Fall 2023 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=mmO2Ri_dJkk
title: CS149 2023 Lecture 5 recording (supplement)
```

Original videos: [CS149 2023 Lecture 5 recording (supplement)](https://www.youtube.com/watch?v=mmO2Ri_dJkk)

Course and recording entries:

- [CS149 2023 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [Official course / lecture source](https://gfxcourses.stanford.edu/cs149/fall25/lecture/perfopt1/)

## Three goals that fight each other

Lecture 5 opens by defining performance tuning as iteratively refining your choices of decomposition, assignment, and orchestration, with three conflicting goals:

1. Balance the workload across the available execution resources
2. Reduce communication, to avoid stalls
3. Reduce the extra work (overhead) spent on increasing parallelism, managing assignment, reducing communication, and so on

The second goal is the subject of [Lecture 6, the next post](/posts/ai/2026-09-30-cs149-locality-communication-en). This one is about how the first and third pull against each other.

The slides' TIP #1 is short: **implement the simplest solution first, measure, then decide whether you need to do better.**

## A little imbalance is expensive

Ideally every processor is busy from start to finish and they all finish together. The slide's example has P4 doing twice the work of the other three processors. P4 then takes twice as long, and half the program's runtime is effectively serial. That work is only about 1/5 of the total, which corresponds to S = 0.2 in Lecture 4's Amdahl's law.

## Static, semi-static, and dynamic form a continuum

**Static assignment** means the assignment doesn't depend on runtime behavior. It isn't necessarily fixed at compile time: if it's set once the amount of work and the number of workers are known, it counts as static, so it can depend on input size or thread count. It is simple, with essentially zero runtime cost, usually a bit of indexing math. [PA1](/posts/ai/2026-09-30-cs149-pa1-w1-quad-core-performance-en) Program 1 has students try different static ways to split the grid.

It works when the cost and amount of work are predictable:

- Every task costs the same (the slide's example: 12 equal tasks, 3 per processor)
- Costs differ but are known
- Cost statistics are predictable, for example the same on average

**Semi-static**: the recent past predicts the near future. The program periodically profiles itself and readjusts; between adjustments the assignment is fixed. The slides use particle simulation and adaptive meshes: when particles move or the mesh changes slowly, redistribution need not happen often.

**Dynamic assignment**: when task execution times or the number of tasks are unknown, assign at runtime. The slide's example tests N = 1024 numbers with `test_primality`, where the time per number is unknown. In SPMD style, each thread grabs the next i from a shared counter inside a lock:

```cpp
while (1) {
  int i;
  lock(counter_lock);
  i = counter++;
  unlock(counter_lock);
  if (i >= N) break;
  is_prime[i] = test_primality(x[i]);
}
```

The general form is a **shared work queue**: worker threads pull work from it and push new work back as it's created.

The Lecture 5 summary slide draws static and dynamic as a continuum of choices. The more you know about the workload, the more you should use that knowledge to cut imbalance and management cost; in the limit, if the system knows everything, use fully static assignment.

## How big should a task be?

The loop above grabs one element at a time. Balance is good, but every element enters the critical section, and critical sections run serially, which brings back Amdahl's law. The slide asks: "So... IS IT a problem?" That depends on how expensive `test_primality` is compared with grabbing a task.

Raising the granularity to 10 elements per grab enters the critical section 10 times less often. The trade-off is on the "Choosing task size" slide:

- You want many more tasks than processors, so dynamic assignment has room to balance. That pushes toward small tasks.
- You want as few tasks as possible, to minimize management overhead. That pushes toward large tasks.
- The ideal size depends on many factors. This is a recurring theme of the course: **know your workload, and know your machine.**

<details>
<summary>A small typo in the slide code</summary>

On the "Increasing task granularity" slide, the inner loop reads `for (int j=i; j<end; j++) is_prime[i] = test_primality(x[i]);`. The loop variable is `j`, but the array index is still `i`. Following the slide's intent, the index should be `j`. Don't let it trip you up.

</details>

## Long tasks first, and distributed queues

Even with a dynamic queue, if tasks go out left to right and the longest one happens to come last, the other processors finish early and sit waiting for it. The slides give two fixes:

- **Split into more, smaller tasks** so the "long pole" becomes shorter relative to the whole. Synchronization overhead may rise, and the long task might be fundamentally sequential and impossible to split.
- **Smarter scheduling: run long tasks first.** The thread that takes the long task runs fewer tasks, but about the same total work as the others. The cost is that you need some ability to predict task cost.

The other problem is that every worker contends for one queue. The fix is **one queue per worker**: pull from and push to your own, and when it's empty, **steal** from someone else.

Work in the queues need not be independent. A task management system can track dependencies, and a task isn't handed to a worker until all its dependencies are done. The slides use this interface:

```cpp
foo_handle = enqueue_task(foo);              // independent of all prior tasks
bar_handle = enqueue_task(bar, foo_handle);  // cannot run until foo is complete
```

This is exactly what [PA2](/posts/ai/2026-09-30-cs149-pa2-task-graph-scheduling-en) Part B asks you to build.

## Fork-join and Cilk Plus

The second half of Lecture 5 turns to divide-and-conquer algorithms. After quicksort partitions, the two halves are independent, a structure that **fork-join** expresses naturally. The slides use Cilk Plus: a C++ language extension originally developed at MIT and later adopted as an open standard in GCC and Intel ICC.

| Syntax | Semantics |
|---|---|
| `cilk_spawn foo(args);` | fork: call foo, but the caller may keep running asynchronously alongside foo |
| `cilk_sync;` | join: returns only when every call spawned by the current function has completed |

Every function containing a `cilk_spawn` ends with an implicit `cilk_sync`. So when a Cilk function returns, all the work it created is done.

The slides stress the **distinction between abstraction and implementation**. `cilk_spawn` says only that the spawned call *may* run concurrently with the caller; it says nothing about when or by whom. So the slide asks: is an implementation correct if it treats `cilk_spawn foo()` as an ordinary function call? The next bullet hints at the answer: the abstraction only grants permission to run concurrently, and what actually constrains scheduling is `cilk_sync`, since every spawned call must finish before it returns.

Parallel quicksort falls back to `std::sort` when the problem is small enough, because the cost of spawning outweighs the benefit of parallelizing:

```cpp
void quick_sort(int* begin, int* end) {
  if (begin >= end - PARALLEL_CUTOFF)
    std::sort(begin, end);
  else {
    int* middle = partition(begin, end);
    cilk_spawn quick_sort(begin, middle);
    quick_sort(middle+1, last);
  }
}
```

The rule of thumb for fork-join programs: expose at least enough independent work to fill the machine, and preferably more, so the load has room to balance. The slides call this ratio **parallel slack** and say about 8 is a good value in practice. But not so much that each piece becomes too small.

## How the Cilk runtime schedules

### Why not one pthread per spawn

The naive approach: call `pthread_create` for each `cilk_spawn`, and turn `cilk_sync` into the matching `pthread_join` calls. The slides list four problems: heavyweight spawns, far more running threads than cores, context-switch overhead, and a larger working set with worse cache locality.

The Cilk Plus runtime uses a **pool of worker threads** instead, exactly as many as the machine has execution contexts. The slides' example is eight workers on a quad-core laptop with Hyper-Threading. In practice runtimes tend to create the workers lazily on the first spawn; ISPC does the same for the workers that run ISPC tasks.

### Run the child or the continuation?

At `cilk_spawn foo(); bar();`, the spawned `foo()` is the child and the rest of the caller (here `bar()`) is the continuation. The current thread can run only one of them first; the other goes into its work queue, where an idle thread can steal it.

| Strategy | Runs first | Queued for stealing | Behavior when a `for` loop spawns N times |
|---|---|---|---|
| child stealing | continuation | child | The caller queues all N children before running any, like breadth-first traversal, O(N) space. Without steals, execution order differs a lot from the program with spawns removed |
| continuation stealing | child | continuation | Only one item, "the rest of the loop," is ever available to steal, like depth-first traversal. Without steals, execution order matches the serial program |

The slides mention a provable result: under continuation stealing, work-queue storage for T threads is no more than T times the stack storage of single-threaded execution. Cilk Plus uses this strategy.

### Deques: pop locally from the bottom, steal from the top

Each worker's queue is a **deque** (double-ended queue). The local thread pushes and pops at the tail (bottom); other threads steal from the head (top). The slides walk through quicksort on 200 elements: thread 0 keeps partitioning, and its deque accumulates `cont: 101-200`, `cont: 51-100`, `cont: 26-50` from top to bottom.

An idle thread picks a victim **at random** and steals from the top. The slides give three reasons:

- The top holds the oldest and largest piece of work, so each steal grabs the most and fewer steals are needed
- Combined with run-child-first, each thread's work has maximum locality
- The thief and the local thread work at opposite ends of the deque and don't contend for the same element, so efficient lock-free deque implementations exist

The slides also compare two loop styles. One spawns `cilk_spawn foo(i)` one iteration at a time in a `for` loop. The other, `recursive_for`, splits the range in half, spawns one half, and keeps splitting the other. The second generates work in parallel, so it fills the machine faster. A child-first work-stealing scheduler anticipates divide-and-conquer parallelism.

### Implementing sync

- **No steals**: `cilk_sync` has nothing to do; it's a no-op.
- **With steals**: on the first steal, the runtime creates a descriptor for the spawn block, tracking how many spawns are outstanding and how many have completed. The slides step through a 10-iteration loop from `spawn: 1, done: 0` to `spawn: 10, done: 10`. When the last spawn completes, the thread holding the continuation goes on to run `bar()` after the `cilk_sync`.

Cilk uses **greedy join scheduling**:

- A thread with nothing to do always tries to steal, and goes idle only when there is no work to steal anywhere in the system
- The thread that initiated a spawn may not be the one that runs the code after `cilk_sync`
- The bookkeeping cost of steals and sync points **is paid only when steals happen**. If stolen pieces are large, steals are rare, and most of the time threads just push and pop on their own deques

## How this connects to the assignments

| Concept from this lecture | Where it shows up |
|---|---|
| static vs. dynamic assignment | PA1 Programs 1 and 3 (the slide asks directly: why did splitting into many ISPC tasks help?) |
| task granularity and synchronization cost | [PA2](/posts/ai/2026-09-30-cs149-pa2-task-graph-scheduling-en) Part A, whose tests include many ultra-light tasks |
| worker thread pool | PA2 Part A Step 2 |
| dependency-aware task queue | PA2 Part B's `runAsyncWithDeps()` |

**Try this**: open slide 16, "Choosing task size," take any `parallel for` or thread-pool code you have, and write down two numbers: roughly how long one task runs, and roughly how long one task grab takes. If they're less than two orders of magnitude apart, try a larger granularity first.

## What this post can and cannot confirm

Confirmed: the contents of the Lecture 5 slide PDF and the lecture date on the course homepage. Not confirmed: anything said in the Fall 2025 classroom (the recordings aren't public), and page-level differences between the 2023 recording and the 2025 slides. This post was not written from the video.

Further reading: OS-level CPU scheduling is out of scope for this lecture; see [CS111 Lecture 8: CPU scheduling](/posts/learning/2026-08-22-stanford-cs111-lecture-08-cpu-scheduling-en).

Series navigation: previous, [Lecture 4: the parallelization thought process](/posts/ai/2026-09-30-cs149-parallelizing-thought-process-en) | next, [Lecture 6: locality, communication, and arithmetic intensity](/posts/ai/2026-09-30-cs149-locality-communication-en) | [series overview](/posts/ai/2026-09-30-cs149-course-overview-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [Stanford CS149 Fall 2025 course homepage and schedule](https://gfxcourses.stanford.edu/cs149/fall25)
- [Lecture 5: Program Optimization 1: Work Distribution and Scheduling (slide PDF)](https://gfxcourses.stanford.edu/cs149/fall25content/media/perfopt1/05_progperf1.pdf)
- [Lecture 5 slide-by-slide web version](https://gfxcourses.stanford.edu/cs149/fall25/lecture/perfopt1/)
- [CS149 2023 Lecture 5 recording (supplement)](https://www.youtube.com/watch?v=mmO2Ri_dJkk)
- [CS149 2023 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [Assignment 2 README (stanford-cs149/asst2)](https://github.com/stanford-cs149/asst2)
