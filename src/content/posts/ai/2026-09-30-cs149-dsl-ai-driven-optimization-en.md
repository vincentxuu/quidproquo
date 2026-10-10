---
title: "CS149 L13: Performance Optimization Beyond the Experts — Halide's Algorithm/Schedule Split, Autoschedulers, and LLM Agents"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, parallelism, performance, compiler, coding-agent, stanford, ai-course]
lang: en
series:
  name: "Reading Stanford CS149"
  order: 17
tldr: "L13 asks what to do when there are too few people who can write fast code. The slides offer three answers. First, raise the level of abstraction: Halide splits what to compute (the algorithm) from how to compute it (the schedule), so one line of schedule turns the same blur into a tiled, vectorized, multi-core version. Second, intelligent search: because the schedule space is well defined, search plus a learned cost model can generate schedules automatically. Third, the emerging option of LLM agents: have a model write CUDA, run it, read the profiler, reflect, and revise, and let it improve itself with a database of examples or prompt optimization. The last slide leaves you with a question: is the real value in DSL design or in the LLM agent?"
description: "A guide to Stanford CS149 (Fall 2025) Lecture 13, Domain-Specific Programming Systems and AI-Driven Performance Optimization: the performance/productivity/generality trade-off, locality analysis of a two-pass blur, Halide's separation of algorithm and schedule, the Halide autoscheduler's search and learned cost model, and using LLM agents to generate fast kernels via reflection loops, KernelBench, and self-improvement."
draft: false
glossary:
  - term: "Halide"
    aliases: ["Halide DSL"]
    definition: "An image-processing DSL embedded in C++ that separates the algorithm (how each pixel is computed) from the schedule (loop order, tiling, vectorization, parallelism, and when intermediates are computed)."
    context: "CS149 L13 uses Halide to show how a DSL can deliver both productivity and performance."
  - term: "schedule"
    aliases: ["Halide schedule"]
    definition: "Halide's second language for describing how to compute, e.g. tile, vectorize, parallel, compute_at. It affects performance only, never the result."
    context: "In CS149 L13, changing one line of schedule on the same Halide algorithm produces a different loop nest."
  - term: "producer-consumer locality"
    definition: "One stage's output is immediately consumed by the next stage; using it while it is still in cache or on chip avoids writing it out and reading it back."
    context: "The two-pass blur in CS149 L13 and Written 3 both practice this."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs149-dsl-ai-driven-optimization)

**Video status: Related supplementary video included; the original lecture recording has not been verified.** [Source details](#course-video-sources)

**This post follows the Fall 2025 edition of [CS149](https://gfxcourses.stanford.edu/cs149/fall25).** It is part 17 of the [Reading Stanford CS149](/posts/ai/2026-09-30-cs149-course-overview-en) series and covers the November 6 Lecture 13, [Domain-Specific Programming Systems and AI-Driven Performance Optimization](https://gfxcourses.stanford.edu/cs149/fall25/lecture/aiperfoptimization/). The official [slide PDF](https://gfxcourses.stanford.edu/cs149/fall25content/media/aiperfoptimization/13_autooptimize.pdf) has 55 pages (its title slide says "Automatic Performance Optimization").

About video: Fall 2025 recordings are Canvas-only. The DSL half of this lecture has a counterpart in the 2023 public recordings that the course home page points to, [2023 Lecture 15 - Domain Specific Programming Languages](https://www.youtube.com/watch?v=sRuyBNxCkGQ). **The LLM-agent half has no public video at all and is covered from the slides only.** Everything here follows the 2025 slides; the 2023 video is only a listening supplement for the first half, and this post has not compared the two section by section.

## Course video sources

This article uses Fall 2025 materials. The official Fall 2025 course page states that this year's lecture videos cannot be distributed to the public and points to a 2023 YouTube playlist instead. The Fall 2023 recording below covers a closely related topic but its content may differ from the 2025 lecture, and the original recording has not been verified. Checked: 2026-10-10.

```youtube
url: https://www.youtube.com/watch?v=sRuyBNxCkGQ
title: Stanford CS149 I Parallel Computing I 2023 I Lecture 15 - Domain Specific Programming Languages
```

Original videos: [Stanford CS149 I Parallel Computing I 2023 I Lecture 15 - Domain Specific Programming Languages](https://www.youtube.com/watch?v=sRuyBNxCkGQ)

Course and recording entries:

- [CS149 2023 public lecture playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [Official course / lecture source](https://gfxcourses.stanford.edu/cs149/fall25/lecture/aiperfoptimization/)

## The starting point: too few people can write fast code

Page 2 sets the goal: mechanisms and techniques that make performance optimization more productive, both by making expert programmers more productive and through automation. Three key ideas:

1. Raise the level of abstraction
2. Intelligent search
3. (Emerging) Use the problem-solving and code-generation abilities of modern LLMs

Page 3 is blunt: "CS149 educated programmers = hard to find." Optimizing in C++, ISPC, or CUDA has low productivity — proof, the slide says, is assignments 1, 2, 3, and 4.

## Idea one: domain-specific languages

### The triangle

Pages 4–6 use a triangle (the slide credits Pat Hanrahan for the design): the ideal parallel language has **performance, productivity, and generality** at once. Popular languages each occupy one or two corners. The slides' way forward is **domain-specific languages (DSLs)**: give up generality to get performance and productivity.

Pages 7–8 define a DSL as a language with restricted expressiveness for a particular domain — high-level, usually declarative, and deterministic. The goals:

- Quickly write a high-performance program for a target machine
- Write one program and run it efficiently on different machines

Its primitives match behaviors the domain uses often, so they are intuitive and portable. The system knows which algorithms and parallelization strategies suit the domain, so it is fast. The slide adds: **optimization goes beyond mapping software to hardware; the hardware itself can be optimized for the abstractions.** The cost is generality.

### A blur shows how hard hand optimization is

Pages 9–10 introduce [Halide](https://halide-lang.org/) (Ragan-Kelley, Adams, et al., SIGGRAPH 2012 and PLDI 2013). The slides say it runs camera pipelines on Google phones (HDR+, parts of portrait mode) and is used at Instagram, Adobe, and elsewhere.

Page 12 shows an unreadable block of SSE intrinsics. The verdict: good, it is about 10x faster on a quad-core CPU than the original two-pass code; bad, it is SSE-only (not AVX2), CPU-only, and impossible to read. Pages 13–14 reveal the answer: it is a 3x3 box blur.

Pages 15–20 then rebuild the optimization step by step:

- **One 2D blur**: 9 x WIDTH x HEIGHT work per image, N² for an NxN filter.
- **Two passes** (horizontal, then vertical): a separable filter splits into two 1D filters, cutting work to 6 x WIDTH x HEIGHT (2N for NxN), but adding a full `tmp_buf`. The slide says arithmetic intensity is now half that of the 2D version and asks why.
- **Locality analysis** (page 18): the algorithm must read every input and write every output; reads and writes of `tmp_buf` are **extra traffic created by the two-pass implementation**, not needed by the computation itself. If the cache holds three rows, `tmp_buf` data is never loaded twice.
- **Chunked version 1** (page 19): for each output row, compute just the three rows of `tmp_buf` it needs, so the buffer is 3 rows. But total work rises to 12 x WIDTH x HEIGHT — too much recomputation.
- **Chunked version 2** (page 20): produce `CHUNK_SIZE` output rows at a time with a `CHUNK_SIZE + 2`-row `tmp_buf`, sized to fit in cache. With `CHUNK_SIZE = 16`, work is (34/16) x 3 ≈ 6.4 x WIDTH x HEIGHT, approaching the ideal 6 as chunks grow.

This is the locality-versus-recomputation trade-off from [L6](/posts/ai/2026-09-30-cs149-locality-communication-en), and the same code used in [Written 3](/posts/ai/2026-09-30-cs149-pa4-w3-trainium-nki-en) Problems 1 and 2.

Pages 21–22 say you are still not done: no multi-core, no SIMD, no loop unrolling. Page 22 then dissects the SSE code: it partitions the image vertically across cores, walks 256x32 tiles to raise cache hit rate, uses SIMD intrinsics, and fuses the two passes so tmp data comes from cache. **Four right decisions, all tangled into one unreadable, unportable block.**

### Halide: one language for the algorithm, another for the schedule

Pages 23–25 cover Halide's algorithm language. A `Func` maps integer coordinates to values, and programs are written point-wise:

```cpp
blurx(x,y) = 1/3.f * (in(x-1,y) + in(x,y) + in(x+1,y));
blury(x,y) = 1/3.f * (blurx(x,y-1) + blurx(x,y) + blurx(x,y+1));
```

The slides stress that Halide is declarative: **it defines neither iteration order nor which values are stored**, only what is needed to compute them. There are no explicit loops. Page 26 shows real pipeline sizes: a two-pass blur has 2 functions, a local Laplacian filter 103, and Google's HDR+ pipeline more than 2,000 Halide functions.

Page 28 has the sentence that anchors the whole lecture: **a key aspect of designing any system is choosing the right representations for the job.** Good representations are productive to use and let the system provide services — correctness checks, parallelization, vectorization, use of specialized hardware.

Page 29 introduces the second representation, the **schedule**:

```cpp
out.tile(x, y, xi, yi, 256, 32).vectorize(xi,8).parallel(y);
blurx.compute_at(x).vectorize(x, 8);
```

Meaning: evaluate `out` in 256x32 2D tiles, vectorize the inner loop 8-wide, parallelize the y loop with threads, and produce `blurx` on demand for each output tile. In the slide's words, scheduling primitives let the programmer sketch how to map the algorithm onto a parallel machine, leaving the platform-specific code generation to the Halide compiler.

Pages 31–34 show what changing one `compute_at` does to the loop nest:

| Schedule | Resulting implementation |
|---|---|
| `blurx.compute_root()` | Compute all of `blurx`, then `out` (the original two-pass code) |
| `blurx.compute_at(out, xi)` | Allocate just 3 elements of `blurx` per output pixel and compute them on the spot (maximum locality, maximum recomputation) |
| `blurx.compute_at(out, x)` | Allocate a 256x34 tile of `blurx` per 256x32 output tile |

Page 34 expands the full schedule into an equivalent parallel loop nest: thread-parallel outer tile loops, a `blur_x` buffer per tile, 8-wide SIMD inner loops, and compiler-generated boundary code. **That is exactly the four decisions in page 22's SSE code, with the two lines of algorithm untouched.**

### Halide's philosophy and constraints

Page 35 describes the division of labor:

- The programmer describes the image-processing algorithm.
- The programmer knows how to schedule it well (but it is slow and tedious), so Halide provides a second language for high-level scheduling decisions: loop structure, unrolling, vectorization, multi-core parallelism.
- **The Halide compiler is not smart.** Its service is mechanically carrying out the schedule using the target machine's mechanisms (pthreads, AVX intrinsics, and so on).

Page 36 lists the language's constraints, which are what make those services possible: computation on regular N-D domains only, feed-forward pipelines only (plus special support for reductions and fixed-depth recursion), and all dependencies inferable by the compiler.

Page 37 gives early academic results (Ragan-Kelley 2012). A camera RAW pipeline originally written as 463 lines of hand-tuned ARM NEON assembly became 2.75x less code in Halide and 5% faster. A bilateral filter originally 122 lines of C++ became 34 lines of algorithm plus 6 lines of schedule, 5.9x faster on CPU and 2x faster than hand-written CUDA on GPU.

## Idea two: search for schedules automatically

Page 38 describes a surprise: **very few programmers can write good Halide schedules.** Google had 80+ people writing Halide, and only a small number were trusted to write schedules. The fix was to have the compiler analyze the program and generate schedules itself (Adams 2019, the SIGGRAPH paper "Learning to Optimize Halide with Tree Search and Random Programs").

Pages 39–41 explain how:

1. **Model scheduling as a sequence of choices.** Starting from the end of the DAG, for each node decide where it goes in the existing loop nest (`compute_at`), then pick tile sizes (outer dimension parallel, inner vectorized), until the whole DAG is scheduled.
2. **Search a large space** with greedy or beam search. The challenge: you may need to evaluate hundreds of thousands of schedules. How do you get each one's cost?
3. **Estimate cost with AI.** A simple MLP runs in tens of microseconds per schedule (for example, 1.4M schedules in 166 seconds). It is trained on a large set of randomly generated Halide programs, compiled and run to get real costs. A footnote says it does not output cost directly; it outputs 27 coefficients plugged into a hand-crafted cost model.

Page 42's conclusion: with the Adams 2019 autoscheduler, you would have to work pretty hard to hand-write a better schedule for image-processing code on CPUs. Page 43 cites earlier results (Mullapudi 2016) comparing the autoscheduler with two experts over time.

Page 44 wraps up: Halide's scheduling primitives were designed to make experts more productive, but **the high-level scheduling abstraction also gave a clean way to enumerate every possible schedule**, which is what made automated search possible. The slide asks you to imagine searching over all permutations of a C++ program instead.

## Idea three: LLMs writing kernels

### The reflection loop

Page 46 draws a trial-and-error loop:

1. Give the LLM starting code (e.g. PyTorch) and a prompt: "You are a performance optimization engineer in CS149. Please rewrite the following PyTorch code as high performance code in CUDA," plus the optimization principles from class.
2. Execute and profile: correct or not, time, and stats such as SM utilization, DRAM utilization, and L2 cache hit rate.
3. Prompt the LLM again: given the code and profiling stats from an H100, reflect on what might be slowing it down, then make one edit to address it.

Page 47 introduces [KernelBench](https://github.com/ScalingIntelligence/KernelBench): a benchmark of hundreds of PyTorch kernels, where the LLM agent's goal is to automatically produce fast and correct CUDA kernels.

### DSLs help LLMs too

Page 48 ties the two halves together: DSLs for writing DNN programs help automation as well. The upside is that the LLM assembles high-performance primitives instead of writing low-level CUDA, so correctness mistakes and hallucinations are less likely. The challenge is that LLMs struggle with less-used languages (less training data, which the slide expects to resolve over time). The examples listed are Triton, CUTLASS/CuTe, and TileLang; Triton and TileLang are also allowed languages in [PA5](/posts/ai/2026-09-30-cs149-pa5-fastest-kernels-en).

Page 49 poses an open question: **can an LLM agent be a great CS149 student, and at what token cost?**

### Four ideas for stronger agents

Pages 50–54 list four directions:

1. **Fine-tune an LLM on experience** for a particular kind of programming task; this needs many tasks and the ability to fine-tune large models.
2. **Self-improve by building a database of example solutions.** Given a new problem, retrieve the most relevant practice problems. The database stores not just solutions but **the sequence of optimization decisions** (the slide's example contents are kernels written in ThunderKittens or CuTe).
3. **Optimize the prompt from experience.** Inspect past optimization trajectories, summarize them into important facts and principles, and update the prompt, rather than only supplying examples.
4. **Combine exhaustive search (like Halide's autotuning) with the agent ideas above.** Extremely high optimization cost, but some of the best results.

Page 52 shows results for idea 2. The left chart, "Writing ML Library Functions for a Domain Specific Accelerator," compares pass@n for Claude 3.5 Sonnet, GPT-4o, Llama 3.1-405B, and DeepSeek-V3 in three modes (single, agent, self-improved), with self-improved gains over single labeled from 1.3x to 3.9x. The right chart shows success rate on database programming tasks rising with the number of training tasks. The slide does not cite the source paper.

## Summary: where does the value lie?

Page 55 sums up:

- Performance optimization requires a high level of expertise
- Even for experts it is tedious and hard
- You have to redo it for new machines and slightly different problems
- Companies spend tens to hundreds of millions of dollars a year or more on AI compute
- It looks like a great case for automation

The slide predicts that the best CS149 students of the future will likely work in tandem with automated agents to accelerate their own thinking and work. The final line leaves the debate to you: **is the real value that leads to success in the DSL design, or in the LLM agent?**

## One habit to take away

**Separate what to compute from how to compute it before you optimize.** Halide draws that line as two languages; [L3](/posts/ai/2026-09-30-cs149-latency-bandwidth-ispc-en)'s "abstraction vs implementation" is the same line; and LLM agents make fewer mistakes on DSLs because that line means they only have to change the "how."

**Something you can do tonight**: find a loop you wrote that processes data in two passes (say, normalize then filter). Write down its algorithm (how each output element is computed) and its schedule (loop order, whether there is an intermediate array, whether it can be chunked and fused), then estimate the recomputation cost of chunking using the method on pages 19–20.

## Further reading

- Another path to fast GPU kernels, Triton: [CS336 Kernels and Triton](/posts/ai/2026-08-22-cs336-kernels-triton-en)
- General methods for self-improving agents: [Stanford CS329A Self-Improving Agents](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents-en)

Series navigation: previous [L12 Mapping AI Applications to the Datacenter](/posts/ai/2026-09-30-cs149-ai-datacenter-mapping-en) | next [PA5: Writing the Fastest Kernels](/posts/ai/2026-09-30-cs149-pa5-fastest-kernels-en) | [Series overview](/posts/ai/2026-09-30-cs149-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Official sources only have Fall 2023 recordings, so the status is now related supplementary video only, and video titles use the original titles.

## References

- [Stanford CS149 Fall 2025 course home page](https://gfxcourses.stanford.edu/cs149/fall25)
- [Lecture 13 page (slide-by-slide)](https://gfxcourses.stanford.edu/cs149/fall25/lecture/aiperfoptimization/)
- [Lecture 13 slide PDF: Domain-Specific Programming Systems and Automatic Performance Optimization](https://gfxcourses.stanford.edu/cs149/fall25content/media/aiperfoptimization/13_autooptimize.pdf)
- [2023 Lecture 15 video: Domain Specific Programming Languages (covers only the DSL half)](https://www.youtube.com/watch?v=sRuyBNxCkGQ)
- [CS149 2023 public lecture playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMp7MTFr4hQsDEcX7Bx6Odp)
- [Halide official site](https://halide-lang.org/)
- [KernelBench GitHub repo](https://github.com/ScalingIntelligence/KernelBench)
- [Written Assignment 3 PDF (Problems 1 and 2 use the same two-pass blur)](https://gfxcourses.stanford.edu/cs149/fall25content/static/pdfs/written_asst3.pdf)
