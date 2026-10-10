---
title: "CS149 L1: Why Single Cores Stopped Getting Faster, and Why Fast Isn't Efficient"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, ai-course, stanford, performance, hardware, systems]
lang: en
series:
  name: "Reading Stanford CS149"
  order: 1
tldr: "The first lecture of CS149 Fall 2025 defines speedup, then uses three classroom demos to show how communication and load imbalance eat into it. Next it explains why single-core performance stalled: superscalar execution runs out of instruction-level parallelism at about four instructions per clock, and clock frequency hits the power wall. So performance now has to come from more cores and specialized hardware. The last part turns to efficiency. A DRAM access takes about 60 times as long as an L1 cache hit, and moving 64 bits costs over a thousand times the energy of an integer op. Efficiency almost always comes down to accessing data efficiently."
description: "A guide to Stanford CS149 (Fall 2025) Lecture 1, 'Why Parallelism? Why Efficiency?', based on the official 86-slide deck: the definition of speedup, lessons from three classroom demos, why ILP and clock frequency hit their limits, the power-wall formula, the basics of memory latency and caches, and the energy cost of moving data. The 2023 L1 recording serves as a listening supplement."
draft: false
glossary:
  - term: "speedup"
    definition: "The execution time of a problem on 1 processor divided by its execution time on P processors."
    context: "The first definition in CS149 L1; the course warns that high speedup doesn't mean the hardware is used efficiently."
  - term: "ILP"
    aliases: ["instruction-level parallelism"]
    definition: "The number of instructions in a single instruction stream that don't depend on each other and can run at the same time."
    context: "L1 uses a = x*x + y*y + z*z: the three multiplies have ILP = 3, each of the two adds only 1."
  - term: "superscalar"
    definition: "A processor that automatically finds independent instructions in one instruction stream at run time and dispatches them to multiple execution units at once."
    context: "The L1 slides show most available ILP is exploited by a processor that issues four instructions per clock."
  - term: "stall"
    definition: "The state where a processor can't make progress because the next instruction depends on one that hasn't finished yet, such as a load still waiting on memory."
    context: "L1 explains memory access is a major source of stalls, and caches exist to shorten them."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs149-why-parallelism-efficiency)

> **This post is based on the Fall 2025 edition of [Stanford CS149](https://gfxcourses.stanford.edu/cs149/fall25).** The source is the [86-slide Lecture 1 deck](https://gfxcourses.stanford.edu/cs149/fall25content/media/efficiency/01_efficiency_hyF1AJq.pdf) (also available [slide by slide on the web](https://gfxcourses.stanford.edu/cs149/fall25/lecture/efficiency/)). The Fall 2025 recording isn't public, so the 2023 L1 recording serves as a supplement. This is post 1 of [Reading Stanford CS149](/posts/ai/2026-09-30-cs149-course-overview-en); see the overview for course background, access level, and limits.

The first lecture, on September 23, 2025, is titled with two questions: Why Parallelism? Why Efficiency? Those two questions set the direction of the whole course. The first half answers the first one: why single-core processors stopped getting faster on their own. The second half answers the other: even once a program is parallel, why should you still care about efficiency?

## Course video sources

This article uses Fall 2025 materials. The public Fall 2023 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=V1tINV2-9p4
title: CS149 2023 Lecture 1 video (YouTube)
```

Original videos: [CS149 2023 Lecture 1 video (YouTube)](https://www.youtube.com/watch?v=V1tINV2-9p4)

Course and recording entries:

- [Official course / lecture source](https://gfxcourses.stanford.edu/cs149/fall25/lecture/efficiency/)

## Parallel computers and speedup

The slides give a short definition: **a parallel computer is a collection of processing elements that cooperate to solve problems quickly.** Two side notes state the course's stance: we care about performance, and we care about efficiency. Using multiple processing elements is just the means of getting performance.

The first quantitative tool is [speedup](https://gfxcourses.stanford.edu/cs149/fall25/lecture/efficiency/slide_5):

```text
speedup(using P processors) = execution time (using 1 processor) / execution time (using P processors)
```

Then come three classroom demos in which students act as "processors" and compute something together. The slides keep only each demo's takeaway:

| Demo | What limited speedup | How it improved |
|---|---|---|
| Demo 1 | Communication (telling each other partial sums) capped the maximum speedup | Move the "processors" closer together, or let them shout, to cut communication cost |
| Demo 2: scaling to four "processors" | Uneven work assignment: some finished and sat idle while others kept working | Better work distribution |
| Demo 3: massively parallel | Too much communication relative to computation | Communication can dominate a parallel computation and severely limit speedup |

**These three demos preview the course's main enemies: communication, load imbalance, and the ratio of communication to computation.** L5 and L6 take each of them apart later.

## Three course themes

The slides organize the course into three themes:

1. **Designing and writing parallel programs that scale.** That includes three steps of parallel thinking: decompose work into pieces that can safely run in parallel, assign work to processors, and manage communication and synchronization so they don't limit speedup.
2. **How parallel hardware is implemented.** Why know hardware? Because the machine's characteristics really matter, as the communication speed in the demos showed.
3. **Thinking about efficiency.** [The slide](https://gfxcourses.stanford.edu/cs149/fall25/lecture/efficiency/slide_13) says in large type **FAST != EFFICIENT**, and asks: is a 2x speedup on a computer with 10 processors a good result? Programmers should make use of what the machine provides. Hardware designers choose which capabilities to include, weighing performance against cost (silicon area, power, and so on).

## Why nobody bothered with parallelism

The slides start with history. Single-threaded CPU performance doubled about every 18 months. That meant parallelizing your code was usually not worth the effort: do nothing, and your code gets faster next year.

Until about 20 years ago, processors got faster for two main reasons:

1. Exploiting **instruction-level parallelism** (ILP) through superscalar execution
2. Raising CPU clock frequency

To explain the first, the slides go back to basics. From a processor's point of view, **a program is just a list of processor instructions**. The simplest processor has three parts: Fetch/Decode picks the next instruction, the ALU (execution unit) performs the operation, and registers in the execution context hold program state. This processor executes one instruction per clock.

## ILP: running several instructions at once

The slides use one line of code:

```c
a = x*x + y*y + z*z
```

It compiles to five instructions: three `mul`s and two `add`s. One at a time, that takes five clocks. What about two execution units? The constraint is dependencies. `add R0, R0, R1` has to wait for the first two `mul`s, and the final `add` has to wait for it. The three `mul`s are independent, so the program's ILP is 3, then 1, then 1. With three execution units, all three multiplies finish in the first clock and the program completes in three.

A **superscalar processor** finds independent instructions like these automatically at run time and runs them in parallel on multiple execution units. The slides then pose a question: what does it mean for such a parallel schedule to "respect program order"? The hint is to think about what output is expected.

ILP has a ceiling. The chart on [this slide](https://gfxcourses.stanford.edu/cs149/fall25/lecture/efficiency/slide_48) shows that **most available ILP is exploited by a processor that can issue four instructions per clock**. Building a wider one buys little.

## The power wall

Clock frequency ran into power. [This slide](https://gfxcourses.stanford.edu/cs149/fall25/lecture/efficiency/slide_51) gives the power a transistor consumes:

```text
Dynamic power ∝ capacitive load × voltage² × frequency
Static power: transistors burn power even when idle, due to leakage
```

High power means high heat, so power is a critical design constraint in modern processors. The slide lists some TDP figures for scale: a phone processor at about 0.5 to 2 W, an Apple M1 laptop at 13 W, an Intel Core i9 10900K desktop CPU at 95 W, and an NVIDIA RTX 4090 GPU at 450 W. Another slide adds that the maximum allowed frequency is set by the processor's core voltage.

With both paths exhausted, the slides conclude:

1. Frequency scaling is limited by power
2. ILP scaling has tapped out

So the rate of single-instruction-stream performance scaling has dropped almost to zero. Architects now build faster processors by adding more execution units that run in parallel, or units specialized for tasks like graphics or video playback. **Software must be written to be parallel to see performance gains. The free lunch for software developers is over.**

## What parallel hardware looks like today

The slides then show a lineup of hardware. The point is scale:

- Intel Comet Lake 10th-gen Core i9 (2020), 10 cores
- AMD Ryzen Threadripper 3990X, 64 cores, built from four 8-core chiplets
- NVIDIA AD102 GPU (GeForce RTX 4090, 2022): 76 billion transistors, 18,432 fp32 multipliers organized into 144 processing blocks called SMs
- The Frontier supercomputer (world's #1 in fall 2022): 9,472 64-core AMD CPUs plus 37,888 Radeon GPUs
- Apple A15 Bionic (iPhone 13 and 14): a CPU with 2 big and 4 small cores, plus a multi-core GPU

The slides also preview the first assignment. [PA1](https://github.com/stanford-cs149/asst1) runs on a quad-core Intel CPU, with a baseline of single-threaded C compiled with `-O3`. Using AVX SIMD vector instructions, hyper-threading, and all four cores, [the slide](https://gfxcourses.stanford.edu/cs149/fall25/lecture/efficiency/slide_55) says you can get **roughly 32 to 40 times faster**. SIMD and hyper-threading get explained in the next lecture.

## Efficiency: power and specialized hardware

The second half turns to the second question. The slogan: modern software must be more than parallel; **it must also be efficient**.

Take phones, where the big concern is power. There are two reasons to save it:

- **Power is heat.** A chip that gets too hot has to clock down to cool off, so saving power lets you run at higher performance for a fixed time.
- **Power is battery.** Saving power lets you run at sufficient performance for longer.

That's why mobile chips lean heavily on specialized units. Besides its CPU and GPU, the A15 has a Neural Engine (NPU) for DNN acceleration, an image and video encode/decode processor, and a motion-sensor processor. Datacenters do the same: the slides show Google TPU pods and a row of DNN accelerators, including the Huawei Kirin NPU, GraphCore IPU, Apple Neural Engine, AWS Trainium, Ampere GPUs with Tensor Cores, SambaNova, and the Cerebras Wafer Scale Engine. **High efficiency comes from using specialized processing units, not only many of them.** That thread returns in L10 on hardware specialization.

## Efficiency almost always comes down to data access

The last section is headed by a single sentence: **achieving efficient processing almost always comes down to accessing data efficiently.**

First, a few basic terms:

- **Memory** is an array of bytes, each identified by its address. A `ld` instruction moves a value from memory into a register.
- **Memory access latency** is the time the memory system takes to deliver data to the processor, for example 100 clock cycles or 100 ns.
- **Stall**: the processor can't make progress because the next instruction depends on one that isn't done. Memory access is a major source of stalls, and access times are often hundreds of cycles.
- **A cache** is on-chip storage holding a copy of a subset of memory. It's a hardware implementation detail that affects only performance, never a program's output, and it works in units of cache lines.

The slides walk two access sequences through a tiny cache (8 bytes, 4-byte lines, LRU replacement) to show cold misses, capacity misses, and two kinds of locality. Loading one cache line makes nearby addresses hit (**spatial locality**); accessing the same address again hits (**temporal locality**).

Then two tables worth remembering. [Data access times on a Kaby Lake CPU](https://gfxcourses.stanford.edu/cs149/fall25/lecture/efficiency/slide_83), in cycles at 4 GHz:

| Where the data is | Latency (cycles) |
|---|---|
| L1 cache | 4 |
| L2 cache | 12 |
| L3 cache | 38 |
| DRAM (best case) | ~248 |

And [the energy cost of moving data](https://gfxcourses.stanford.edu/cs149/fall25/lecture/efficiency/slide_84), which the slide attributes to estimates from Bill Dally (NVIDIA) and Tom Olson (ARM): an integer op is about 1 pJ and a floating-point op about 20 pJ. Reading 64 bits from small local SRAM 1 mm away on chip costs about 26 pJ, and reading 64 bits from low-power mobile DRAM (LPDDR) about 1,200 pJ. In practice, reading 10 GB/s from memory draws about 1.6 W, while a mobile GPU's entire power budget is about 1 W.

**Hence the rule of thumb in system design: always try to reduce the amount of data moved around the computer.**

## Summary

The slides close with three points:

- Single-thread-of-control performance is improving very slowly. To make programs significantly faster, you need multiple processing elements or specialized hardware, which means knowing how to reason about and write parallel, efficient code.
- Parallel programming is hard. It requires partitioning the problem, communication, and synchronization, plus knowledge of the machine, **especially data movement**.
- Used efficiently, modern computers have far more processing power than you'd guess.

My reading is that this lecture plants two threads that run through the whole course. One is "communication and imbalance eat speedup," which leads to the optimization lectures in L4 to L6. The other is "moving data costs more than computing," which leads to bandwidth limits in L3, arithmetic intensity in L6, and eventually to why AI accelerators manage their own on-chip memory.

## 2023 video supplement

The 2023 [Lecture 1 video](https://www.youtube.com/watch?v=V1tINV2-9p4) (about 1 hour 12 minutes) covers the same lecture. I compared the text of the [2023 L1 slides](https://gfxcourses.stanford.edu/cs149/fall23content/media/whyparallelism/01_whyparallelism_huXfOJ4.pdf) with the 2025 deck. The technical material on ILP, the power wall, hardware examples, memory, and caches is largely the same. The differences are in two places:

- **Logistics.** Per the [Fall 2023 Course Info page](https://gfxcourses.stanford.edu/cs149/fall23/courseinfo), 2023 had four programming assignments (58%, plus an optional Assignment 5 on big graph processing), five written assignments (1.6% each, 8% total), and 2% participation credit from comments on the lecture pages of the course website ("async lecture comments"). 2025 has five programming assignments, four written ones, and a quiz each lecture. For assignments and grading rules you hear in the video, go by 2025.
- **2025 adds the slide on the energy cost of data movement.** The pJ figures above aren't in the 2023 L1 slides, so the video won't cover them.

## Things to do tonight

1. Look up your CPU model: how many cores it has and which SIMD instruction sets it supports (AVX2, AVX-512, ARM Neon). The next lecture uses this.
2. Replace `a = x*x + y*y + z*z` with `a = x*y*z*w`, draw the dependency graph, and find its ILP. Then try `a = (x*y)*(z*w)` and compare.
3. Think of a recent piece of performance-sensitive code you wrote. Was its time spent computing or moving data?

---

**Series navigation**: [← Series overview](/posts/ai/2026-09-30-cs149-course-overview-en) | Next: [L2 Modern multi-core processors: multi-core, SIMD, multithreading →](/posts/ai/2026-09-30-cs149-multicore-simd-multithreading-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [CS149 Fall 2025 home page and schedule](https://gfxcourses.stanford.edu/cs149/fall25)
- [Lecture 1 slides PDF: Why Parallelism? Why Efficiency? (Fall 2025, 86 slides)](https://gfxcourses.stanford.edu/cs149/fall25content/media/efficiency/01_efficiency_hyF1AJq.pdf)
- [Lecture 1 slide-by-slide web version (Fall 2025)](https://gfxcourses.stanford.edu/cs149/fall25/lecture/efficiency/)
- [Lecture 1 slides PDF (Fall 2023, for comparison)](https://gfxcourses.stanford.edu/cs149/fall23content/media/whyparallelism/01_whyparallelism_huXfOJ4.pdf)
- [CS149 2023 Lecture 1 video (YouTube)](https://www.youtube.com/watch?v=V1tINV2-9p4)
- [PA1 README: Analyzing Parallel Program Performance on a Quad-Core CPU](https://github.com/stanford-cs149/asst1)
