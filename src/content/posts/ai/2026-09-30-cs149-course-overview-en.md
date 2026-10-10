---
title: "Reading Stanford CS149: A Guide to the Fall 2025 Parallel Computing Course"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, ai-course, stanford, gpu, performance, systems, course-guide]
lang: en
series:
  name: "Reading Stanford CS149"
  order: 0
tldr: "CS149 is Stanford's parallel computing course, taught by Kayvon Fatahalian and Kunle Olukotun. It runs from multi-core CPUs and SIMD through GPUs, AI accelerators, and the datacenter, then returns to cache coherence and lock-free programming. For Fall 2025, all 18 slide decks, the starter code and READMEs for 5 programming assignments, and 4 written-assignment PDFs are public, so this series rates it A3 (self-study ready). There are four gaps: the Fall 2025 lecture videos are Canvas-only; PA1 is graded on Stanford's myth machines; PA4 needs a self-funded AWS Trainium2 instance and a private course AMI; PA5's H100 job queue and leaderboard require a SUNet ID. The public videos are from 2023, and this series treats them as a listening supplement only."
description: "Series overview for Stanford CS149 Parallel Computing (Fall 2025), based on the official course home page, course info, 18 lecture slide decks, 5 GitHub assignments, 4 written assignments, and the 2023 YouTube playlist. Covers what the course is for, a prerequisite self-check, grading, what outside readers can access, how the 2023 videos map to Fall 2025, and two reading paths."
draft: false
glossary:
  - term: "A3 self-study ready"
    definition: "One of this site's course-access grades: structured materials plus assignments and the files they need are public, so you can work through the course in order."
    context: "CS149 Fall 2025 is rated A3, although PA4's Trainium environment is effectively A2."
  - term: "myth machines"
    definition: "Shared Linux machines that Stanford students log into over SSH; CS149 PA1 uses their quad-core Intel CPUs as the grading reference."
    context: "Outside readers can do PA1 on their own multi-core CPU, but the numbers are not directly comparable to the official reference."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs149-course-overview)

> **This series is based on the Fall 2025 edition of [Stanford CS149](https://gfxcourses.stanford.edu/cs149/fall25).** When I checked on 2026-09-30, `cs149.stanford.edu` still redirected to the fall25 site and the fall26 URL returned 404. This is post 0 of the series and its overview; every later post points back here for materials and limits.

Most AI engineers now work on parallel hardware every day. Training runs on GPU clusters, inference means squeezing kernel performance, and even phones ship an NPU. Yet many people have only a vague sense of why GPUs are fast, or why adding cores didn't make their program faster. [CS149: Parallel Computing](https://gfxcourses.stanford.edu/cs149/fall25) fills that gap.

## Course video sources

Official course and existing recording entries are linked below. A single public video matching this article has not been verified for embedding.

Course and recording entries:

- [CS149 2023 YouTube playlist (Stanford Online)](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [Official course / lecture source](https://gfxcourses.stanford.edu/cs149/fall25/lecture/)

## What the course teaches

The [course home page](https://gfxcourses.stanford.edu/cs149/fall25) opens with the claim that parallel processing is everywhere, from smartphones, multi-core CPUs, GPUs, and AI accelerators to the largest supercomputers. The course aims to give a deep understanding of the principles and engineering trade-offs behind parallel systems, and to teach the programming techniques needed to use them well. Writing good parallel programs requires understanding a machine's performance characteristics, so **the course covers both hardware and software**.

Kayvon Fatahalian and Kunle Olukotun co-taught Fall 2025. There were 18 lectures from Sep 23 to Dec 4, an evening midterm on Nov 18, and a final on Dec 11. The lectures fall into five parts:

| Part | Lectures | Topics |
|---|---|---|
| Part 1 | L1–L3 | Why parallelism, multi-core processors, latency vs. bandwidth, ISPC |
| Part 2 | L4–L6 | How to think about parallelizing code, work distribution and scheduling, locality and communication |
| Part 3 | L7–L8 | GPU architecture and CUDA, data-parallel thinking |
| Part 4 | L9–L13 | DNNs on GPUs, hardware specialization, programming systems for specialized hardware, the AI datacenter, DSLs and AI-driven performance optimization |
| Part 5 | L14–L18 | Cache coherence, synchronization and memory consistency, fine-grained locking and lock-free programming, transactional memory |

The first lecture's slides organize the course around three themes: designing parallel programs that scale, how parallel hardware is implemented, and thinking about efficiency. The third theme comes with a line worth remembering from day one: **FAST != EFFICIENT**. A 2x speedup on 10 processors does make the program faster. Whether it uses the hardware well is a separate question.

## Prerequisite self-check

The [course info page](https://gfxcourses.stanford.edu/cs149/fall25/courseinfo) calls CS111 a "strongly recommended" prerequisite and lists the concepts it expects you to know. Use it as a checklist:

- A compiled program is a sequence of machine instructions. A processor executes them, and each instruction updates state in registers or memory.
- Why a memory hierarchy exists, and how registers, on-chip caches, off-chip memory, and persistent storage implement it.
- You can read, write, and debug C/C++ (classes, STL vectors).
- You have written at least one program that creates threads, for example with `std::thread` or pthreads.

The page is blunt: **the main reason students struggle in CS149 is a lack of debugging experience**, because parallel code is hard to debug. Assignments use new C-like languages such as CUDA and ISPC, and the course expects you to pick them up as you go.

If the first two items feel shaky, start with this site's [Stanford CS107 guide](/posts/learning/2026-08-21-stanford-cs107-computer-systems-en) (machine instructions, assembly, caches, and the memory hierarchy). If threads, locks, and scheduling are new, read the [Stanford CS111 guide](/posts/learning/2026-08-21-stanford-cs111-operating-systems-en).

## Assignments, exams, and grading

Grading from the course info page:

| Component | Weight |
|---|---|
| 5 programming assignments | 8% + 12% + 12% + 12% + 12% = 56% |
| 4 written assignments | 3% × 4 = 12% |
| Per-lecture participation (in-class quiz) | 4% |
| Midterm | 12% |
| Final | 16% |

Programming assignments can be done in pairs, and one- and two-person teams are graded the same way. Written assignments must be done in groups of three, with random partners assigned by the staff. Each student gets 8 late days for the quarter, for programming assignments only, and **not for PA5**.

The five programming assignments, with due dates from the home page:

| Assignment | Due | Topic | Environment |
|---|---|---|---|
| [PA1](https://github.com/stanford-cs149/asst1) | Oct 6 | Analyzing parallel program performance on a quad-core CPU (threads, SIMD intrinsics, ISPC) | Stanford myth machines (quad-core Intel Core i7) |
| [PA2](https://github.com/stanford-cs149/asst2) | Oct 16 | Scheduling task graphs on a multi-core CPU | AWS `c7g.4xlarge` |
| [PA3](https://github.com/stanford-cs149/asst3) | Oct 30 | A circle renderer in CUDA | NVIDIA T4 on AWS |
| [PA4](https://github.com/stanford-cs149/asst4-trainium2) | Nov 13 | Fused conv + maxpool on the Trainium2 accelerator | AWS `trn2.3xlarge` |
| [PA5](https://github.com/stanford-cs149/asst5-kernels) | Dec 4 | Make the world's fastest kernels (open-ended) | Course-managed H100 job queue |

The four written assignments are PDFs: [Written 1](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst1.pdf), [Written 2](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst2.pdf), [Written 3](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst3.pdf), and [Written 4](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst4.pdf). The L1 slides say they contain modified versions of past exam questions, so they double as exam practice. Besides the graded questions, each PDF includes several problems marked PRACTICE PROBLEM. **For a self-learner, these four PDFs are the closest thing to an exam.**

There is no required textbook. The course info page suggests Hennessy & Patterson, *Computer Architecture: A Quantitative Approach*, 6th edition, as an architecture reference, and notes that plenty of good parallel programming material is free online.

## What outside readers can access: A3, with four gaps

Under the grading in this site's [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en), CS149 Fall 2025 is **A3 (self-study ready)**. What's public:

- [18 lecture slide decks](https://gfxcourses.stanford.edu/cs149/fall25/lecture/), each as a PDF and as a slide-by-slide web page
- GitHub repos for all 5 assignments, with starter code, READMEs, and grading rules
- 4 written-assignment PDFs

The gaps need to be stated up front:

1. **Fall 2025 videos are not public.** Course info says lectures are recorded for viewing on Canvas. The home page says outright, "We cannot distribute lecture videos to the public this year," and points to the public 2023 videos instead.
2. **PA1 and PA2 grading machines are out of reach.** The PA1 README asks you to run on the myth machines and report those numbers; PA2 is graded on AWS `c7g.4xlarge`. You can do both on your own multi-core CPU, but your speedups won't compare directly with the official reference.
3. **PA4 is effectively A2.** [PA4's cloud_readme](https://github.com/stanford-cs149/asst4-trainium2/blob/main/cloud_readme.md) has students boot from a private course AMI and buy a capacity block for `trn2.3xlarge`. It lists the upfront price as of 2025-10-31 at $2.25 per hour, about $300 for 7 days. Enrolled students got an extra $400 in AWS credit; outside readers don't. What you can do is read the README and starter code, or build a Neuron environment at your own expense.
4. **PA5's leaderboard requires a SUNet ID.** Submitting to the H100 job queue starts with registering in popcorn-cli using a SUNet ID. The README also says you can develop locally on any CUDA-capable NVIDIA GPU and test and profile with `eval.py`. That is the only route for outside readers, and there is no leaderboard to compare against.

Also: PA3 needs an NVIDIA GPU (the README uses a T4 as reference); no solutions are published for any assignment or written question; announcements and discussion live on Ed, which outsiders can't see.

## Why the 2023 videos are a supplement

The course home page itself sends readers to the [2023 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp), which has 19 videos. This series follows two rules:

- **Fall 2025 slides are the source of truth.** The 2023 videos are a listening supplement. Where the two disagree, 2025 wins, and each post flags the difference.
- **The reason is simple.** Outsiders can't watch the 2025 recordings, and 2023 is the substitute the course points to. I compared the slide text of L1 and L2 across 2023 and 2025. The technical content is largely the same, and the differences are mostly logistics and a few added slides. Each later post notes the differences for its own lecture.

The two terms don't line up exactly, though. 2023 had lectures on Spark (L9) and Accessing Memory (L19) that Fall 2025 dropped. Fall 2025 added L11 (programming systems for specialized hardware), L12 (the AI datacenter), and the AI-driven optimization half of L13, none of which has a 2023 recording. Those posts rely on slides alone.

| Fall 2025 lecture | Matching 2023 video |
|---|---|
| L1 Why Parallelism? Why Efficiency? | [L1](https://www.youtube.com/watch?v=V1tINV2-9p4) |
| L2 A Modern Multi-Core Processor (Part I) | [L2](https://www.youtube.com/watch?v=CKmNpAO5rS4) |
| L3 Multi-Core Architecture (Part II) + ISPC | [L3](https://www.youtube.com/watch?v=F4bVSyz_jxo) |
| L4 Parallelizing Code: An Example Thought Process | [L4 Parallel Programming Basics](https://www.youtube.com/watch?v=0-ztm8SKq70) |
| L5 Work Distribution and Scheduling | [L5](https://www.youtube.com/watch?v=mmO2Ri_dJkk) |
| L6 Locality and Communication | [L6](https://www.youtube.com/watch?v=Mhdny2JNhmc) |
| L7 GPU Architecture and CUDA Programming | [L7](https://www.youtube.com/watch?v=qQTDF0CBoxE) |
| L8 Data-Parallel Thinking | [L8](https://www.youtube.com/watch?v=Ba3TqxSgnTk) |
| L9 Efficiently Evaluating DNNs on GPUs | [L10](https://www.youtube.com/watch?v=qbKtU0X6-WU) |
| L10 Hardware Specialization | [L18](https://www.youtube.com/watch?v=2tAb3EgyjNw) |
| L11 Programming Systems for Specialized Hardware | None |
| L12 Mapping AI Applications to the Datacenter Computer | None |
| L13 Domain-Specific Programming Systems + AI-Driven Optimization | DSL half: [L15](https://www.youtube.com/watch?v=sRuyBNxCkGQ); AI half: none |
| L14 Cache Coherence | [L11](https://www.youtube.com/watch?v=lrCfG2CPDEw) |
| L15 Implementing Synchronization + Memory Consistency | [L12](https://www.youtube.com/watch?v=nFXWmo9MFiY) |
| L16 Fine-Grained Locking and Lock-Free Programming | [L13](https://www.youtube.com/watch?v=GA1ObImqaMo) |
| L17 Transactional Memory (Part I) | [L16](https://www.youtube.com/watch?v=rFFf3WIJ7BA) |
| L18 Transactional Memory (Part II) + AMA | [L17](https://www.youtube.com/watch?v=Tbk1vnYLQqI) |

The assignments changed too. The 2023 L1 slides say "Four programming assignments"; 2025 has five, and the new one is PA5. If a 2023 video mentions assignment details, check the 2025 repos instead.

## Series arc

This series keeps the official lecture order, because assignments are tied to specific lectures and reordering would break their prerequisites. Each assignment post sits after the lectures it depends on, and written assignments are folded into the same post.

**Part 1: Why parallelism, and what a processor looks like**

- 1. [L1 Why parallelism, why efficiency](/posts/ai/2026-09-30-cs149-why-parallelism-efficiency-en)
- 2. [L2 Modern multi-core processors: multi-core, SIMD, multithreading](/posts/ai/2026-09-30-cs149-multicore-simd-multithreading-en)
- 3. [L3 Latency vs. bandwidth + ISPC](/posts/ai/2026-09-30-cs149-latency-bandwidth-ispc-en)
- 4. [PA1 + Written 1: performance on a quad-core CPU](/posts/ai/2026-09-30-cs149-pa1-w1-quad-core-performance-en)

**Part 2: Parallelizing code and making it fast**

- 5. [L4 A thought process for parallelizing code](/posts/ai/2026-09-30-cs149-parallelizing-thought-process-en)
- 6. [L5 Work distribution and scheduling](/posts/ai/2026-09-30-cs149-work-distribution-scheduling-en)
- 7. [L6 Locality and communication](/posts/ai/2026-09-30-cs149-locality-communication-en)
- 8. [PA2: task graph scheduling](/posts/ai/2026-09-30-cs149-pa2-task-graph-scheduling-en)

**Part 3: GPUs and data-parallel thinking**

- 9. [L7 GPU architecture and CUDA](/posts/ai/2026-09-30-cs149-gpu-architecture-cuda-en)
- 10. [L8 Data-parallel thinking](/posts/ai/2026-09-30-cs149-data-parallel-thinking-en)
- 11. [PA3 + Written 2: a CUDA circle renderer](/posts/ai/2026-09-30-cs149-pa3-w2-cuda-renderer-en)

**Part 4: AI systems**

- 12. [L9 DNNs on GPUs](/posts/ai/2026-09-30-cs149-dnn-on-gpus-en)
- 13. [L10 Hardware specialization](/posts/ai/2026-09-30-cs149-hardware-specialization-en)
- 14. [L11 Programming systems for specialized hardware](/posts/ai/2026-09-30-cs149-programming-specialized-hardware-en)
- 15. [PA4 + Written 3: Trainium2 and NKI](/posts/ai/2026-09-30-cs149-pa4-w3-trainium-nki-en)
- 16. [L12 Mapping AI applications to the datacenter](/posts/ai/2026-09-30-cs149-ai-datacenter-mapping-en)
- 17. [L13 DSLs and AI-driven performance optimization](/posts/ai/2026-09-30-cs149-dsl-ai-driven-optimization-en)
- 18. [PA5: the fastest kernels](/posts/ai/2026-09-30-cs149-pa5-fastest-kernels-en)

**Part 5: Correctness in shared memory**

- 19. [L14 Cache coherence](/posts/ai/2026-09-30-cs149-cache-coherence-en)
- 20. [L15 Implementing synchronization and memory consistency](/posts/ai/2026-09-30-cs149-synchronization-memory-consistency-en)
- 21. [L16 Fine-grained locking and lock-free programming](/posts/ai/2026-09-30-cs149-fine-grained-locking-lock-free-en)
- 22. [L17–L18 Transactional memory + Written 4](/posts/ai/2026-09-30-cs149-transactional-memory-w4-en)

## Two reading paths

**Full path**: read 0 → 22 in order. Part 5 only depends on Parts 1–2, so if you want the shared-memory foundations first, jump to 19–22 after post 8, then come back for GPUs and AI.

**AI systems only**: 0 → 1–3 → 7 → 9–10 → 12–18. Posts 1–3 build intuition for SIMD, multithreading, and bandwidth limits; post 7 adds arithmetic intensity; then you go straight into GPUs and AI hardware. The cost is skipping the hands-on assignment posts, plus coherence and synchronization.

## Things to do tonight

1. Open the [L1 slides](https://gfxcourses.stanford.edu/cs149/fall25/lecture/efficiency/), find the efficiency slide, and decide whether "2x speedup on 10 processors" is a good result.
2. Go through the prerequisite checklist above. For any item you're unsure of, read the matching post in the CS107 or CS111 guide.
3. Clone the [PA1 repo](https://github.com/stanford-cs149/asst1), check how many cores your machine has and whether it supports AVX2, and install ISPC. PA1 is the assignment outsiders can reproduce most completely.

## Further reading

These site series overlap with CS149. This series does not cut content because of them; the links are here for reference:

- [Reading Stanford CS336](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch-en): training language models from scratch. For the systems side, see [GPUs and TPUs](/posts/ai/2026-08-22-cs336-gpu-tpu-en), [kernels and Triton](/posts/ai/2026-08-22-cs336-kernels-triton-en), [parallelism mechanics](/posts/ai/2026-08-22-cs336-parallelism-mechanics-en), and [parallelism strategies](/posts/ai/2026-08-22-cs336-parallelism-strategies-en)
- [Reading CMU 11-868 LLM Systems](/posts/ai/2026-09-30-cmu11868-llm-systems-overview-en): the systems side of large language models; [GPU programming and acceleration](/posts/ai/2026-09-30-cmu11868-gpu-programming-acceleration-en) and [FlashAttention](/posts/ai/2026-09-30-cmu11868-flashattention-en) pair with Parts 3–4 here
- [CME295 LLM systems](/posts/ai/2026-09-29-cme295-llm-systems-en): inference and serving systems from an LLM course's angle
- [Global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en): definitions of the A0–A3 grades

**Series navigation**: next, [L1 Why parallelism, why efficiency](/posts/ai/2026-09-30-cs149-why-parallelism-efficiency-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [CS149 Fall 2025 home page and schedule](https://gfxcourses.stanford.edu/cs149/fall25)
- [CS149 Fall 2025 Course Info (prerequisites, grading, late days)](https://gfxcourses.stanford.edu/cs149/fall25/courseinfo)
- [CS149 Fall 2025 lecture index (18 slide decks)](https://gfxcourses.stanford.edu/cs149/fall25/lecture/)
- [L1 slides PDF: Why Parallelism? Why Efficiency? (Fall 2025)](https://gfxcourses.stanford.edu/cs149/fall25content/media/efficiency/01_efficiency_hyF1AJq.pdf)
- [L1 slides PDF (Fall 2023, for comparison)](https://gfxcourses.stanford.edu/cs149/fall23content/media/whyparallelism/01_whyparallelism_huXfOJ4.pdf)
- [PA1: Analyzing Parallel Program Performance on a Quad-Core CPU](https://github.com/stanford-cs149/asst1)
- [PA2: Scheduling Task Graphs on a Multi-Core CPU](https://github.com/stanford-cs149/asst2)
- [PA3: A Circle Renderer in CUDA](https://github.com/stanford-cs149/asst3)
- [PA4: Fused Conv+MaxPool on Trainium2](https://github.com/stanford-cs149/asst4-trainium2)
- [PA4 cloud_readme (private AMI, capacity block pricing)](https://github.com/stanford-cs149/asst4-trainium2/blob/main/cloud_readme.md)
- [PA5: Make the World's Fastest CUDA Kernels](https://github.com/stanford-cs149/asst5-kernels)
- [Written Assignment 1](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst1.pdf), [2](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst2.pdf), [3](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst3.pdf), [4](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst4.pdf)
- [CS149 2023 YouTube playlist (Stanford Online)](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
