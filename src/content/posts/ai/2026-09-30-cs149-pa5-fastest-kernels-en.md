---
title: "CS149 PA5, the Fastest Kernel on an H100: Five AI Kernels, Graded on Your Work Log"
date: 2026-09-30
category: ai
type: guide
tags: [cs149, ai-course, stanford, gpu, cuda, triton, flashattention, performance]
lang: en
series:
  name: "Reading Stanford CS149"
  order: 18
tldr: "The last programming assignment in CS149 Fall 2025 is open-ended. Pick at least one of five kernels (Histogram, a 1D occupancy decoder, FlashAttention, a 3D heat equation with RK4, SwiGLU) and make it faster than its PyTorch baseline on an H100. You can write CUDA, Triton, or TileLang, and you may use LLMs. There is no speed threshold. The grade depends on a work log that shows what you measured at each step, what hypothesis you formed, and why you stopped. The H100 job queue and leaderboard need a SUNet ID; outside Stanford you can only run eval.py on your own NVIDIA GPU."
description: "A guide to Stanford CS149 (Fall 2025) Programming Assignment 5, \"Make the World's Fastest CUDA Kernels\": the input sizes and bottlenecks of the five problems, the CUDA / Triton 3.5.1 / TileLang 0.1.6.post2 options, popcorn-cli's test, benchmark, leaderboard, and profile modes, the 80 / 95 / 95–110 work-log rubric, and why outsiders are limited to running eval.py locally. No solutions."
draft: false
glossary:
  - term: "work log"
    definition: "The PA5 hand-in: for each optimization step, the code structure, the runtime, the profiler statistics you looked at, the hypothesis they suggested, and finally why you stopped."
    context: "Course staff grade PA5 by assessing the work log. There is no fixed performance bar."
  - term: "online softmax"
    definition: "When attention scores are processed block by block, keep a running row maximum and running sum so softmax can be normalized incrementally without holding a full row in memory."
    context: "The PA5 FlashAttention README lists it as one of three key ideas, alongside tiling and fusion."
  - term: "popcorn-cli"
    definition: "An open-source command-line tool from the GPU MODE community. PA5 uses it to submit code to the course's H100 job queue and leaderboards."
    context: "It requires registering with a SUNet ID, so readers outside Stanford cannot use the course queue."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs149-pa5-fastest-kernels)

**This post is based on the Fall 2025 edition of [CS149](https://gfxcourses.stanford.edu/cs149/fall25).** It is part 18 of [Reading Stanford CS149](/posts/ai/2026-09-30-cs149-course-overview-en). It follows [L13 DSLs and AI-driven optimization](/posts/ai/2026-09-30-cs149-dsl-ai-driven-optimization-en) and covers [Programming Assignment 5 (stanford-cs149/asst5-kernels)](https://github.com/stanford-cs149/asst5-kernels). The course home page lists it as "Assignment 5: Make the World's Fastest CUDA Kernels," due December 4, 2025. The README states there are **no late days** for it.

This post covers what each problem exercises, what to measure first, and which direction to think in. **No solutions.**

## Course video sources

Official course and existing recording entries are linked below. A single public video matching this article has not been verified for embedding.

Course and recording entries:

- [Official course / lecture source](https://gfxcourses.stanford.edu/cs149/fall25)

## How this assignment differs from the first four

The [README](https://github.com/stanford-cs149/asst5-kernels/blob/main/README.md) frames PA5 as "a very short final project." The staff calibrated it so a team can earn a decent score in about two evenings, while teams that want to go deep can spend much longer chasing very fast code. Compared with [PA1](/posts/ai/2026-09-30-cs149-pa1-w1-quad-core-performance-en) through PA4, three things change:

1. **No single task.** Pick one or more of five AI-related kernels. Each comes with a PyTorch baseline.
2. **No performance bar.** Your grade comes from the staff's reading of your work log.
3. **LLMs are allowed.** The README says you may use any model in [Stanford's AI Playground](https://uit.stanford.edu/service/aiplayground) to write code, interpret profiler output, or decide what to try next.

The stated goal is practice in open-ended performance engineering, the real-world situation where you need a program to run faster and there is no fast staff reference to chase.

The target is an H100. Teams with PA4 credits left may optimize on Trainium instead, but Trainium has no leaderboard (see the series' [PA4 Trainium2 + NKI post](/posts/ai/2026-09-30-cs149-pa4-w3-trainium-nki-en) for that environment).

## Three ways to write it

| Option | File you hand in | Notes |
|---|---|---|
| Python + [Triton](https://triton-lang.org/main/index.html) | `submission.py`, implementing the `custom_kernel` interface | The job queue runs triton 3.5.1 |
| Python + [TileLang](https://tilelang.com/) | `submission.py` | The job queue runs tilelang 0.1.6.post2 |
| CUDA | `submission.cu`, following `templates/template.cu` | The queue only accepts `submission.py`, so run `python wrap_cuda_submission.py <SUNet ID>` first to wrap the CUDA code |

Every problem folder has `templates/` (`template.py`, `template.cu`) and `test_cases/test.txt`. The FlashAttention problem also ships `template_triton.py`, a Triton kernel skeleton with online softmax.

The README calls Triton and TileLang "modern AI frameworks that provide tile-based abstractions." If you read [L13](/posts/ai/2026-09-30-cs149-dsl-ai-driven-optimization-en) on separating algorithm from schedule, these tools are that idea applied to GPU kernels. For Triton basics, start with the [CS336 kernels and Triton post](/posts/ai/2026-08-22-cs336-kernels-triton-en).

## The five problems

Sizes below come from each problem's `test_cases/test.txt` or README.

| Problem | What it computes | Test size | Difficulty the README points to |
|---|---|---|---|
| [Histogram](https://github.com/stanford-cs149/asst5-kernels/tree/main/problems/histogram) | Multi-channel histogram: for an integer array of shape `[length, num_channels]`, count each bin per channel | length 1,048,576, 512 channels, 256 bins | Many threads competing for the same bins cause atomic contention and poor access patterns |
| [1d-occupancy-decoder](https://github.com/stanford-cs149/asst5-kernels/tree/main/problems/1d-occupancy-decoder) | MLP embedder → cross-attention → LayerNorm → output projection, with module and input sizes taken from Roblox's open-source Cube3D | 250,000 queries, 1,024 latents, width 768, 12 heads | Queries vastly outnumber keys/values; everything is float16 except softmax, which must be float32 |
| [FlashAttention](https://github.com/stanford-cs149/asst5-kernels/tree/main/problems/flashattention) | softmax(QKᵀ/√D)V on FP16 inputs | Three shapes; the remote benchmark uses only the largest, (4, 64, 8192, 128) | Standard attention is memory-bound on an H100 |
| [3D Heat Equation – RK4](https://github.com/stanford-cs149/asst5-kernels/tree/main/problems/rk4) | An 8th-order, 25-point stencil Laplacian inside classical RK4 time stepping | 600³ grid, 10 steps | Correctness requires rtol and atol of 1e-6; the 4-cell boundary stays fixed |
| [SwiGLU](https://github.com/stanford-cs149/asst5-kernels/tree/main/problems/swiglu) | Swish(xW + b) ⊙ (xV + c) | batch 256, in_features 2048, hidden 4096 | The README gives only the definition and shapes; you find the bottleneck yourself |

### The first question for each problem

These are not solutions. They are the questions to ask after reading each README, tied to concepts from earlier in the course.

**Histogram**: how many threads write the same bin at once? That is the contention from [L6 Locality and communication](/posts/ai/2026-09-30-cs149-locality-communication-en). The README points toward shared memory and synchronization.

**1d-occupancy-decoder**: the README includes the TA's own attempts. The PyTorch version takes about 7.4 ms. Porting both the MLP embedder and cross-attention to Triton without fusion made it 19% slower; porting only the embedder made it 2% faster. The TA says the cross-attention port took five to six hours. That table is a lesson by itself: a layer-by-layer rewrite without fusion often loses to a heavily tuned library.

**FlashAttention**: the README names three key ideas: tiling (load small blocks of Q, K, V into SRAM), fusion (never write the N×N score matrix to HBM), and online softmax. In the README's reference table, PyTorch's built-in FlashAttention runs the largest shape in about 28 ms on an H100, 4.5× faster than the naive reference. That tells you roughly what a library already achieves.

**RK4**: each time step computes the Laplacian four times, and each Laplacian reads 25 neighbors. The README's baselines are about 1458 ms for PyTorch, 317 ms for naive Triton, and 148 ms for naive CUDA. Decide first whether the intermediate k₁ through k₄ need to go back to global memory. The README itself names custom memory access patterns, shared memory, and kernel fusion.

**SwiGLU**: two matrix multiplies share the same input x, followed by elementwise work. Profile first to see whether the time goes to the matmuls or the elementwise part, then decide whether to fuse.

<details>
<summary>How much FlashAttention you need for this problem</summary>

The minimum to do the assignment:

1. Standard attention computes the N×N score matrix, writes it to HBM, reads it back for softmax, then multiplies by V. At sequence length 8192, reading and writing that matrix is the main cost.
2. FlashAttention splits Q into row blocks. Each block sweeps over the blocks of K and V, computing entirely in SRAM.
3. Softmax needs each row's maximum and sum. Online softmax updates both as it visits each K block and rescales the output accumulated so far.

For the full derivation, the backward recomputation trick, and how FA2 through FA4 changed with the hardware, read the [CMU 11-868 FlashAttention post](/posts/ai/2026-09-30-cmu11868-flashattention-en). The README recommends the [original FlashAttention paper](https://arxiv.org/abs/2205.14135) and UW CSE 599M's notes [From Online Softmax to FlashAttention](https://courses.cs.washington.edu/courses/cse599m/23sp/notes/flashattn.pdf).

</details>

## Running code: the job queue and local development

The course workflow has four steps, and the first three are tied to a Stanford identity:

1. Install [popcorn-cli](https://github.com/gpu-mode/popcorn-cli) (prebuilt Linux and macOS binaries are in the repo's `binary/` folder, or build it with Rust)
2. Run the `setup.sh` posted on Ed to configure the server connection
3. Register with `popcorn-cli register --sunet-id ... --nickname ...`; the team name cannot be changed afterward
4. Submit with `popcorn-cli submit --leaderboard <problem> --mode <mode> submission.py`

There are four `--mode` values:

| Mode | What it does |
|---|---|
| `test` | Checks correctness only |
| `benchmark` | Measures runtime without posting to the leaderboard |
| `leaderboard` | Measures runtime and posts to that problem's leaderboard |
| `profile` | Runs Nsight Compute and returns a summary; the full `.ncu-rep` is downloadable from the job page |

The profile summary lists Compute_Throughput, SM_Busy, L1/L2/DRAM throughput, cache hit rates, and traffic between levels. The README shows an RK4 `heat_step_kernel` example: 7.10 µs, with Compute_Throughput at 18.45% and DRAM_Throughput at 4.45%, then asks why the kernel isn't using the GPU well yet. RK4 profiles report only the first 20 kernels.

Local development needs no SUNet. On any CUDA-capable NVIDIA GPU, add `problems/` to `PYTHONPATH` and run this in a problem folder:

```bash
python ../eval.py <test/benchmark/profile> test_cases/test.txt
```

`profile` mode needs `ncu`, the `ncu_report` Python package, and permission to read GPU performance counters; the README has step-by-step commands. Its example local machine is an AWS `g6.xlarge` (NVIDIA L4). It also warns that a smaller GPU is fine for correctness and exploration, but **you should tune for the H100 and report analysis on the H100**, because the best decision for one processor may not be best for another.

### What you can do from outside Stanford

- **H100 queue and leaderboard: no.** Registration needs a SUNet ID, and `setup.sh` is only posted on the course Ed. So is the leaderboard link.
- **Problems, templates, references, eval.py: all public.** With any NVIDIA GPU you can run correctness tests and benchmarks.
- **H100 numbers: rent one yourself.** Without an H100, your numbers aren't comparable to the README's reference values, so name your GPU in your log.

For outside readers, then, this assignment is **A3 minus the grading environment**: the materials are complete, but the course H100s and classmates' leaderboard are missing. The access levels are defined in the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en).

## Grading: the work log

| Score | Criteria |
|---|---|
| 80 | Minimal effort, but the log shows course concepts applied over a few optimization steps, with some speedup |
| 95 | Uses course concepts to interpret runtime and profiler results, argues for what to try next, and explores a reasonable set of options; a decent final number also counts as evidence |
| 95–110 | Everything for 95, plus an impressive result; reaching 100 may mean a high leaderboard position, and points above 100 are case by case |

The README reserves the right to go below 80 if the minimal-effort bar isn't met.

The log has three parts:

1. **The steps you took.** For each step: how the code is structured (submit the code, but also describe it at a high level, such as "we blocked the outermost loop and mapped blocks to CUDA thread blocks"), its runtime, which statistics you looked at, what you concluded, what you think limits performance, and what that suggests changing next. Skip the small tweaks. Aim for the level at which you discussed PA2 through PA4 with CAs in office hours.
2. **Why you stopped.** Running out of time is an acceptable answer. If you stopped because the profile showed little left to gain, explain how you decided.
3. **Whether LLMs helped.** Did you use them to write code, brainstorm, or read profiles, and was it useful? The README says iterating with an LLM or running a sequence of prompt-engineering steps is also a good way to do the assignment, as long as the log records your reasoning and prompts. If an LLM hands you a result on the first prompt that you can't improve, the README asks you to contact the staff; one option is to attempt a second problem.

The hand-in is a single `.zip` with `handin.pdf` and the code for your key steps.

The README describes the loop in four steps: run, measure, form a hypothesis from your understanding of the code plus the data (**increase parallelism, reduce memory traffic, hide memory latency, alleviate contention**), and change the code to test it. Those four directions read almost like the table of contents for the first half of CS149: parallelism and latency hiding in [L2](/posts/ai/2026-09-30-cs149-multicore-simd-multithreading-en), bandwidth in [L3](/posts/ai/2026-09-30-cs149-latency-bandwidth-ispc-en), contention in [L6](/posts/ai/2026-09-30-cs149-locality-communication-en), and the CUDA memory hierarchy in [L7](/posts/ai/2026-09-30-cs149-gpu-architecture-cuda-en).

**Try this**: pick a problem and don't write a kernel yet. Run the baseline with `eval.py profile`, paste the summary into your notes, and finish this sentence: "I think it is limited by ___, because of this number: ___." That sentence is step one of your work log.

## What this post can and cannot confirm

Confirmed: the asst5-kernels README, the five problem READMEs and `test_cases/test.txt` files, the template file list, and the assignment title and due date on the course home page. Performance numbers in the READMEs were measured by staff on their own hardware (the FlashAttention table's small and medium shapes on an RTX 5090, the large shape on an H100). This post quotes them without rerunning anything.

Not confirmed: the contents of `setup.sh` on Ed, actual leaderboard results, queue wait times on the H100s, and the finer points of how staff grade work logs.

One more thing to watch: the SwiGLU README calls [arXiv 1710.05941](https://arxiv.org/abs/1710.05941) "the original SwiGLU paper," but that is Ramachandran, Zoph, and Le's 2017 "Searching for Activation Functions," which introduced the Swish activation. The paper that put Swish inside a GLU gate and named it SwiGLU is Noam Shazeer's 2020 "[GLU Variants Improve Transformer](https://arxiv.org/abs/2002.05202)" (arXiv 2002.05202). The problem's formula, Swish(xW + b) ⊙ (xV + c), draws on both: look up Swish in the first and the SwiGLU structure in the second.

Further reading: the full FlashAttention story in [CMU 11-868 L21](/posts/ai/2026-09-30-cmu11868-flashattention-en); Triton's programming model in [CS336 kernels and Triton](/posts/ai/2026-08-22-cs336-kernels-triton-en); another take on GPU programming in [CMU 11-868 GPU programming](/posts/ai/2026-09-30-cmu11868-gpu-programming-acceleration-en).

**Series**: previous [L13 DSLs and AI-driven optimization](/posts/ai/2026-09-30-cs149-dsl-ai-driven-optimization-en) | next [L14 Cache coherence: MSI, MESI, and false sharing](/posts/ai/2026-09-30-cs149-cache-coherence-en) | [Series overview](/posts/ai/2026-09-30-cs149-course-overview-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [Stanford CS149 Fall 2025 home page and assignment list](https://gfxcourses.stanford.edu/cs149/fall25)
- [Assignment 5 README (stanford-cs149/asst5-kernels)](https://github.com/stanford-cs149/asst5-kernels)
- [Histogram problem](https://github.com/stanford-cs149/asst5-kernels/tree/main/problems/histogram)
- [1d-occupancy-decoder problem](https://github.com/stanford-cs149/asst5-kernels/tree/main/problems/1d-occupancy-decoder)
- [FlashAttention problem](https://github.com/stanford-cs149/asst5-kernels/tree/main/problems/flashattention)
- [3D Heat Equation – RK4 problem](https://github.com/stanford-cs149/asst5-kernels/tree/main/problems/rk4)
- [SwiGLU problem](https://github.com/stanford-cs149/asst5-kernels/tree/main/problems/swiglu)
- [Searching for Activation Functions (arXiv 1710.05941, source of Swish)](https://arxiv.org/abs/1710.05941)
- [GLU Variants Improve Transformer (arXiv 2002.05202, source of SwiGLU)](https://arxiv.org/abs/2002.05202)
- [GPU MODE popcorn-cli](https://github.com/gpu-mode/popcorn-cli) and [kernelbot](https://github.com/gpu-mode/kernelbot) (the grading infrastructure PA5 uses)
- [Triton documentation](https://triton-lang.org/main/index.html)
- [TileLang documentation](https://tilelang.com/)
- [FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness (arXiv 2205.14135)](https://arxiv.org/abs/2205.14135)
- [From Online Softmax to FlashAttention (UW CSE 599M notes, PDF)](https://courses.cs.washington.edu/courses/cse599m/23sp/notes/flashattn.pdf)
