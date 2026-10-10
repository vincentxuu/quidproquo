---
title: "CS149 PA1 + Written 1: Measuring Speedup on a Quad-Core CPU and Explaining Why It Isn't Linear"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, parallelism, performance, hardware, stanford, ai-course]
lang: en
series:
  name: "Reading Stanford CS149"
  order: 4
tldr: "PA1 has little code and a lot of analysis. Its six programs cover work assignment across threads, SIMD masking, ISPC gangs and tasks, how input data shapes SIMD efficiency, a bandwidth-bound saxpy, and finding a K-Means hotspot with timers. Written 1 drills the same intuitions on paper: peak throughput, instruction dependencies, pipelining, latency hiding with multithreading, and SIMD divergence. Official grading uses Stanford's myth machines; you can run everything on your own hardware, but your numbers won't match the reference."
description: "A guide to Stanford CS149 (Fall 2025) Programming Assignment 1 and Written Assignment 1: what Programs 1–6 practice, what to look for, the limits of working off campus (myth machines, installing ISPC, the K-Means dataset), and the scope of Written 1's five graded problems and practice problems. No solutions."
draft: false
glossary:
  - term: "SIMD divergence"
    aliases: ["divergent execution"]
    definition: "When lanes of one SIMD instruction take different sides of an if/else, the hardware runs both branches under masks, and masked-off lanes sit idle for that time."
    context: "PA1 Programs 2 and 4 and Written 1 Problem 5 all ask you to estimate this cost."
  - term: "ISPC task"
    aliases: ["launch", "ISPC tasks"]
    definition: "ISPC's abstraction for using multiple cores: launch creates a batch of tasks, each run by one gang, and the runtime hands tasks to worker threads on different cores."
    context: "PA1 Program 3 Part 2 asks you to choose how many tasks to launch."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs149-pa1-w1-quad-core-performance)

**Video status: Official entry or recording index only.** [Source details](#course-video-sources)

**This post is based on the Fall 2025 edition of [CS149](https://gfxcourses.stanford.edu/cs149/fall25).** It is part 4 of the [Reading Stanford CS149](/posts/ai/2026-09-30-cs149-course-overview-en) series and covers [Programming Assignment 1: Analyzing Parallel Program Performance on a Quad-Core CPU](https://github.com/stanford-cs149/asst1) (due October 6 in Fall 2025) and [Written Assignment 1](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst1.pdf).

This post covers what each problem practices, what to watch for, and which direction to think in. **It contains no solutions.** The value of both assignments is in measuring and explaining things yourself.

## Course video sources

Official course and existing recording entries are linked below. A single public video matching this article has not been verified for embedding.

Course and recording entries:

- [Official course / lecture source](https://gfxcourses.stanford.edu/cs149/fall25)

## What the assignment asks for

The [README](https://github.com/stanford-cs149/asst1/blob/master/README.md) opens by stating its goal: understand the two main forms of parallelism in a modern multi-core CPU — **SIMD within a single core** and **parallelism across cores** (with a look at Hyper-Threading along the way). It says there is only a small amount of programming but **a lot of analysis**. The assignment is worth 100 points plus 6 points of extra credit.

Grading hardware is Stanford's myth machines (`myth[51-66]`): four-core 4.2 GHz Intel Core i7 processors, two hardware threads per core, and 8-wide AVX2 vector instructions. Those numbers set your expectations: at most 4× from cores, at most 8× from SIMD, at most 32× from both, plus a little headroom from Hyper-Threading.

### What you can do off campus

- **You can't log in to myth machines from outside Stanford.** The README says grading uses myth numbers but encourages running on your own machine too, as long as your report says clearly which machine you used.
- **You can install ISPC yourself.** The README uses the Linux build of ISPC v1.28.1, available from the [ISPC site](https://ispc.github.io/).
- **Apple Silicon has its own handout.** The repo includes [README_aarch64.md](https://github.com/stanford-cs149/asst1/blob/master/README_aarch64.md), which asks you to report SIMD speedups on an ARM laptop.
- **Program 6's dataset lives on Stanford AFS** (about 800 MB) and is not reachable from outside. `prog6_kmeans/main.cpp` contains commented-out code for generating your own data, but official grading uses `data.dat`, so your numbers are only comparable to themselves.
- Submission goes through Gradescope. Outside readers can't submit or get graded feedback.

In other words, you can complete all of the **analysis** off campus, but you won't get numbers comparable to the official reference. A four-core laptop, an eight-core desktop, or an M-series chip each changes the "ideal ceiling" for every problem. That is useful practice in itself: look up your core count and SIMD width first, then predict your speedup.

## Program 1: Mandelbrot with threads (20 points)

You get a sequential Mandelbrot fractal generator. The cost of each pixel is proportional to its brightness in the image — keep that sentence in mind.

You parallelize it with `std::thread`:

1. Start with two threads: top half to one, bottom half to the other. The README calls this **spatial decomposition**.
2. Extend to 2 through 8 threads, each getting a contiguous block, and plot speedup against thread count. Is it linear? The README's hint: look carefully at the three-thread data point.
3. Time the start and end of each thread to confirm or reject your hypothesis.
4. Change the work-to-thread mapping to reach about 7–8× on both views. Constraints: **no synchronization**, and one policy that works for every thread count — no hard-coding per configuration. The README says a very simple static assignment does the job.
5. Run with 16 threads. Is it noticeably faster than 8? Explain.

**What to watch for**: when some regions of the image are much more expensive, cutting it into large contiguous blocks makes the work uneven. This is the interleaved vs. blocked distinction from the previous post's ISPC example, moved up to the thread level. Question 5 asks what extra threads can buy on a machine with 4 cores and 8 hardware threads.

## Program 2: SIMD with "fake" vector intrinsics (20 points)

The function to vectorize, `clampedExpSerial`, raises `values[i]` to the power `exponents[i]` and clamps the result at 9.999999. Each element loops a different number of times, so lanes diverge.

Instead of real AVX2, you use the course's own "fake vector intrinsics" in `CS149intrin.h`. They simulate vector operations in software, log every instruction, and report **Total Vector Instructions** (your performance measure) and **Vector Utilization** (the fraction of lanes enabled). Every instruction takes an optional mask; lanes with a 0 in the mask are not written.

Your tasks:

1. Write `clampedExpVector` so it is correct for any `N` and any `VECTOR_WIDTH`. The README suggests testing with `./myexp -s 3` to catch the case where N isn't a multiple of the vector width.
2. Sweep `VECTOR_WIDTH` over 2, 4, 8, and 16, record vector utilization, and explain the trend.
3. Extra credit (1 point): vectorize array sum, targeting on the order of `N / VECTOR_WIDTH + log2(VECTOR_WIDTH)`.

**What to watch for**: the wider the vector, the more likely it is that the slowest lane in a group holds everyone else up. The README's sample `abs()` also has a bug worth finding first.

## Program 3: ISPC and ISPC tasks (20 points)

Back to Mandelbrot, this time in ISPC, using both the four cores and each core's SIMD units. The README says that after you fix one bug — a **performance** bug, not a correctness bug — you should see more than 32× over the sequential version.

### Part 1: ISPC basics (10 points)

This part of the README is a condensed version of the [previous post](/posts/ai/2026-09-30-cs149-latency-bandwidth-ispc-en). Calling an ISPC function from C spawns a gang of `programCount` program instances that run at once on the SIMD units; each instance knows its identity through `programIndex`; control returns to C once the whole gang finishes. The README interrupts itself here: "Stop. This is your friendly instructor. Please read the preceding paragraph again. Trust me."

The README contrasts two versions. `sum` uses `programIndex` to assign elements to instances explicitly; it is **imperative** and describes how work maps to instances. `sum2` uses `foreach`; it is **declarative** and only says which work exists and which iterations are independent. The README calls the difference subtle but very important. It recommends the [official ISPC walkthrough](https://ispc.github.io/example.html) first, whose example is almost identical to this problem's `mandelbrot_ispc()`.

The question: with ISPC set to emit 8-wide AVX2, what is the maximum speedup you expect? Why is what you measure lower? The README suggests thinking about which parts of the image are hard for SIMD, and comparing the two views.

### Part 2: ISPC tasks (10 points)

One gang runs on one core. To use multiple cores you `launch` **tasks**. Each task is run by a gang, and tasks can be processed in any order and in parallel on different cores.

1. Run with `--tasks` and measure the view 1 speedup, compared with the version without tasks.
2. Change only the number of tasks in `mandelbrot_ispc_withtasks()` to beat the sequential version by more than 32×. Explain how you chose the number and why it works best.
3. Extra credit (2 points): how does the thread abstraction differ from the ISPC task abstraction? The README's thought experiment: what happens when you launch 10,000 ISPC tasks, and what happens when you launch 10,000 threads?

The README ends with its own question: why does ISPC have two mechanisms, `foreach` and `launch`? Couldn't the system split `foreach` iterations across cores and emit SIMD code too? Its answer: "Great question! And there are a lot of possible answers. Come to office hours." The next post, on L4's "assignment" step, comes back to this.

## Program 4: iterative `sqrt` (15 points)

The program computes square roots of 20 million random numbers between 0 and 3 using Newton's method with an initial guess of 1.0. The README includes a graph: inputs near 1 converge fastest, and inputs near 0 or 3 need the most iterations. The README calls this problem a review of the concepts in Programs 2 and 3.

Your tasks:

1. Measure ISPC speedup on one core (no tasks) and on all cores (with tasks), and separate how much comes from SIMD and how much from multiple cores.
2. Construct an input that **maximizes speedup** and explain whether it helps SIMD speedup, multi-core speedup, or both.
3. Construct an input that **minimizes speedup for ISPC without tasks** and explain where the efficiency goes.
4. Extra credit (up to 2 points): write your own version with AVX2 intrinsics.

**What to watch for**: this problem lets you control each lane's workload directly. Think about how many iterations each of the 8 lanes in one SIMD instruction must run, and the answers follow.

## Program 5: BLAS `saxpy` (10 points)

`saxpy` computes `result = scale*X + Y` with N = 20 million. The README points out that it does two math operations (one multiply, one add) for every three elements used, and that it is trivially parallel, with regular access and predictable cost.

The question: what speedup do you get from ISPC with tasks? Could you rewrite it for near-linear speedup? Justify your answer.

Extra credit (1 point): the bandwidth calculation uses `TOTAL_BYTES = 4 * N * sizeof(float)`. The program reads X, reads Y, and writes result — three accesses — so why is 4 correct? The README's hint: think about how CPU caches work.

**What to watch for**: this is the CPU version of the previous post's vector-multiply thought experiment. The README also warns that students have overthought this one in the past; it expects a simple answer.

## Program 6: making K-Means faster (15 points)

K-Means clusters one million data points. The starter code is correct, just slow. The README says the key skill is **isolating a performance hotspot**, and it won't tell you where to look.

Your tasks:

1. Use the timer in `common/CycleTimer.h` to find where the time goes.
2. Improve the code based on what you measured, targeting about 2.1× or better. Write the report as a sequence of steps: "I measured … which led me to believe X. So I tried … resulting in …"

Constraints: only `kmeansThread.cpp` may change; the algorithm's behavior must not change; and of `dist`, `computeAssignments`, `computeCentroids`, and `computeCost`, you may parallelize **only one**. The README says the staff solution changed about 20–25 lines, and suggests understanding the relative sizes of K, M, and N first. It also says that thoughtful debugging earns most of the points even if you miss the target.

**Something you can do tonight**: you don't need the dataset for this habit. Take any slow program you have, put timers around two or three suspicious sections, find the most expensive one, and only then decide whether to parallelize. That is the order Program 6 trains.

## Written Assignment 1: the same intuitions on paper

[Written 1](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst1.pdf) is 48 pages: five graded problems followed by 12 PRACTICE PROBLEMs. According to the [course info](https://gfxcourses.stanford.edu/cs149/fall25/courseinfo), written assignments must be done in groups of three, with new random partners assigned by the staff for each one; programming assignments may optionally be done in pairs.

| Problem | Topic | Grading | What it practices |
|---|---|---|---|
| Problem 1 | Hardware Basics | Correctness (20 pts) | Computing peak floating-point throughput step by step, from multi-core to 8-wide SIMD to four hardware threads to superscalar |
| Problem 2 | Identifying Dependencies + A Bit on Superscalar Execution | Correctness (20 pts) | Drawing the dependency graph of nine instructions; scheduling on a constrained three-way superscalar core for minimum cycles; judging whether five-way would help (the hint says to use "ILP") |
| Problem 3 | Pipelining | Effort (20 pts) | A pipeline of ten CAs grading a seven-question exam: steady-state throughput and single-exam latency |
| Problem 4 | Understanding Hardware Multi-Threading and Caches | Effort (20 pts) | Two threads, 50-cycle memory read latency, a 16 MB cache: core utilization, then whether a faster clock or lower memory latency helps more once N shrinks |
| Problem 5 | SIMD Divergence, and Avoiding It | Effort (20 pts) | A 16-pixel-wide black-and-white image repeating every 13 rows, where white and black pixels take branches of different cost: total cycles and average SIMD utilization |

Problem 3 is the exam version of the previous post's laundry analogy. Problem 4 is the quantitative version of "multithreading hides latency, but not bandwidth."

The practice problems start with "Be An ISPC Compiler," which has you hand-translate an ISPC function into the fake vector intrinsics from PA1. The rest keep drilling peak throughput, instruction scheduling, caches and multithreading, and SIMD divergence. The last one opens with a warning: it is tricky, and answering it means you really understand how the SPMD model maps to SIMD execution.

**How to use it**: do Problems 1 and 2 before PA1 so the "ideal ceiling" math is automatic. Do Problem 5 after Programs 2 and 4, and compare it with the vector utilization you measured.

## What this post can and cannot confirm

Confirmed: the problems, point values, grading-machine specs, and constraints in the README; the problems and grading scheme of Written 1. Not confirmed: reference numbers on myth machines, Gradescope grading details, clarifications posted on Ed (not visible outside Stanford), and Written 1's due date (neither the PDF nor the course home page states it). This post includes no solutions.

Further reading: the README's "For the Curious" section strongly recommends Matt Pharr's [The Story of ISPC](https://pharr.org/matt/blog/2018/04/30/ispc-all), which takes on questions like "why can't the compiler just parallelize it?"

Series navigation: previous [L3: Latency vs. Bandwidth and ISPC](/posts/ai/2026-09-30-cs149-latency-bandwidth-ispc-en) | next [L4: The Thought Process of Parallelizing Code](/posts/ai/2026-09-30-cs149-parallelizing-thought-process-en) | [series overview](/posts/ai/2026-09-30-cs149-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [Stanford CS149 Fall 2025 course home page](https://gfxcourses.stanford.edu/cs149/fall25)
- [CS149 Fall 2025 Course Info](https://gfxcourses.stanford.edu/cs149/fall25/courseinfo)
- [stanford-cs149/asst1 (Programming Assignment 1 starter code)](https://github.com/stanford-cs149/asst1)
- [asst1 README](https://github.com/stanford-cs149/asst1/blob/master/README.md)
- [asst1 README_aarch64.md (ARM Mac handout)](https://github.com/stanford-cs149/asst1/blob/master/README_aarch64.md)
- [Written Assignment 1 (PDF)](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst1.pdf)
- [ISPC official site](https://ispc.github.io/)
- [ISPC walkthrough example](https://ispc.github.io/example.html)
- [Matt Pharr: The Story of ISPC](https://pharr.org/matt/blog/2018/04/30/ispc-all)
