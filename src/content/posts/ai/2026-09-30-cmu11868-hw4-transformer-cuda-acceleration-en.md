---
title: "CMU 11-868 HW4: Writing Softmax and LayerNorm as Fused CUDA Kernels"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, cmu, ai-course, homework, cuda, gpu, transformer]
lang: en
series:
  name: "Reading CMU 11-868 LLM Systems"
  order: 10
tldr: "The fourth 11-868 assignment has you follow LightSeq and hand-write CUDA kernels for attention softmax and LayerNorm (forward and backward), bind them into your own MiniTorch, then swap them into your HW3 Transformer and train for one epoch. Points: Softmax 40, LayerNorm 40, integration 20. The assignment page expects individual kernels to be 3.7x to 15.8x faster, but end-to-end training only about 1.1x faster, because of Amdahl's law. You need an NVIDIA GPU, and the repo has already been changed for Fall 2026."
description: "A guide to Assignment 4 of CMU 11-868 LLM Systems (Spring 2026): the three problems and their points, which files you edit, what the kernel tests compare against, why the end-to-end speedup is only 1.1x, the hardware you need, and how to line the llmsys_hw4 repo back up with the spring version after the Fall 2026 edits. No solutions."
draft: false
glossary:
  - term: "Amdahl's law"
    aliases: ["Amdahl"]
    definition: "The overall speedup is capped by the part you didn't speed up: even if one section becomes infinitely fast, the whole program barely improves if that section was a small share of total time."
    context: "The HW4 page uses it to explain why softmax and LayerNorm each get several times faster while full Transformer training is expected to improve by only about 1.1x."
  - term: "warp shuffle"
    aliases: ["shfl_down", "__shfl_down_sync", "g.shfl_down"]
    definition: "CUDA instructions that let threads in the same warp (32 threads) read each other's registers directly, so a reduction can skip shared memory."
    context: "Both the HW4 softmax backward kernel and the LayerNorm gamma/beta gradient kernel use it."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu11868-hw4-transformer-cuda-acceleration)

> **Version note**: This post is based on the Spring 2026 edition of [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/). The assignment site and starter code are **shared across semesters**, so the contents below reflect the [Assignment 4 page](https://llmsystem.github.io/llmsystemhomework/assignment_4/) and the [llmsys_hw4 repo](https://github.com/llmsystem/llmsys_hw4) as seen on 2026-09-30. Access grade **A3**: the problems, starter code, and kernel tests are all public. What you can't get is Canvas submission and grading, the Ed forum, and lecture recordings (the course has none public).

**Series**: Previous: [L10 Accelerating Transformers on GPUs: LightSeq](/posts/ai/2026-09-30-cmu11868-accelerating-transformer-lightseq-en) | Next: [L14-L15 Distributed Training and Data Parallelism](/posts/ai/2026-09-30-cmu11868-data-parallel-training-en) | [Series overview](/posts/ai/2026-09-30-cmu11868-llm-systems-overview-en)

The previous post covered how LightSeq fuses the small operations in a Transformer and rewrites reductions to drop a synchronization. This assignment hands you two of those kernels: attention **softmax** and **LayerNorm**, forward and backward. The assignment page opens by saying the CUDA optimizations come from the [LightSeq](https://arxiv.org/abs/2010.13887) and [LightSeq2](https://arxiv.org/abs/2110.05722) papers, and "strongly encourages" reading them and the lecture slides before writing code.

This post covers only the structure, points, dependencies, hardware, and where self-learners get stuck. **No solutions and no reference implementations.**

## Where it sits in the course

The Spring 2026 [syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) puts the HW4 deadline on **March 11**, the day of Distributed Model Training II. The syllabus doesn't list a release date for HW4; the previous assignment, HW3, was due February 18, the day of LightSeq Part 2. In between come two Google guest lectures on TPUs and a week of spring break.

It depends on more than its name suggests:

| Dependency | Why you need it |
|---|---|
| [L10 slides](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-10-transformer-acc-5ba466406bf7296f86cd244ad0405867.pdf) pp.21-26 | The LayerNorm and Softmax formula rewrites and shape-dependent template tuning. The slides say "You will implement … in hw3", which is an older semester's numbering for this assignment |
| The reduce kernel from [HW1](/posts/ai/2026-09-30-cmu11868-hw1-cuda-programming-en) | The LayerNorm backward section refers back to it directly: you wrote reduce with shared memory in HW1, and this time you use warp shuffles |
| Your whole [HW3](/posts/ai/2026-09-30-cmu11868-hw3-transformer-architecture-en) implementation | Setup has you copy HW3's `combine.cu`, `autodiff.py`, and your modified `nn.py`, `modules_basic.py`, and `modules_transfomer.py` |

The page's first sentence says it extends Assignments 1 and 2, but the setup steps actually copy files from Assignment 3. If HW3 isn't finished, this one won't connect.

## Problems and points

Three problems, 100 points total:

| Problem | Task | Points | Expected speedup |
|---|---|---|---|
| 1.1 Softmax Forward | Implement `ker_attn_softmax` in `src/softmax_kernel.cu` (handles attention masks) | 20 | about 6.5x |
| 1.2 Softmax Backward | Implement `launch_attn_softmax_bw`, choosing template parameters by max sequence length | 20 | about 5.5x |
| 2.1 LayerNorm Forward | Implement `ker_layer_norm` in `src/layernorm_kernel.cu` | 20 | about 15.8x |
| 2.2 LayerNorm Backward | Implement `ker_ln_bw_dinp` and `ker_ln_bw_dgamma_dbetta` | 20 | about 3.7x |
| 3 Adopt Fused Kernels | Swap the fused kernels into `MultiHeadAttention`, `TransformerLayer`, and `DecoderLM`; compare one-epoch training time | 20 | about 1.1x |

Every kernel follows the same loop: write the CUDA, compile it to a `.so` with `nvcc`, bind it in `minitorch/cuda_kernel_ops.py` (passing the CUDA stream), wire up `forward` or `backward` in a `Function` in `minitorch/tensor_functions.py`, then run the matching test under `kernel_tests/`.

A few design points worth knowing before you start:

**Half of softmax forward is already written.** The page says `ker_attn_softmax_lt32` (sequences shorter than 32, using warp-level reduction) is implemented, and you write `ker_attn_softmax` for longer sequences (using CUB block-level reduction) by following it. Both compute the max the same way, and the page spells out the steps: each thread computes a local max, masked future tokens are set to negative infinity, the attention mask is added, then a block-level reduction finds the global max.

**Softmax backward makes you do the template tuning from L10 yourself.** You pick the `ITERATIONS` parameter of `ker_attn_softmax_bw` based on max sequence lengths in {32, 64, 128, 256, 384, 512, 768, 1024, 2048}, with a hint to study how `launch_attn_softmax` uses templates. The page adds that you can try other length sets for more speedup, but it won't be graded.

**LayerNorm forward is exactly the rewrite from L10 slide 21.** The page gives σ(x) = √(μ(x²) − μ(x)² + ε) with ε = 1×10⁻⁸, so the means of x and x² can be computed together. In practice you `reinterpret_cast` the array to `float4` and process four elements at a time.

**LayerNorm backward is split into two kernels.** The input-gradient kernel follows L10 slide 22 and computes the two sums in parallel. The gamma and beta gradients sum across rows; the page suggests staging in shared memory and then reducing along `threadIdx.y` with the cooperative groups `g.shfl_down`, linking to an [NVIDIA blog post](https://developer.nvidia.com/blog/cooperative-groups/) for background.

## "N times faster" than what?

If you read `kernel_tests/test_softmax_fw.py`, the baseline isn't PyTorch. It's **the softmax you assembled from basic operations in your own MiniTorch** (`minitorch.nn.softmax(inp + mask)`). Correctness is checked with `atol=1e-3, rtol=1e-3`.

That explains how LayerNorm forward can be expected to hit 15.8x: the comparison is a chain of MiniTorch operations, each launching its own kernel and reading and writing memory, which is exactly the case L10 says fusion fixes.

Problem 3's 1.1x is a different story. The page cites **Amdahl's law** directly: you only sped up softmax and LayerNorm, while matrix multiplication and everything else stayed the same, so the overall gain can't be large. That gap, a kernel 15x faster and training 1.1x faster, is the most useful lesson in the assignment.

## What you need

| Item | What the page and repo say |
|---|---|
| GPU | An NVIDIA GPU that can run `nvcc`; the setup commands use `module load cuda/12.4` on PSC as the example |
| Python | 3.12 or later; conda or uv recommended |
| Packages | On 2026-09-30, `requirements.txt` pins `torch==2.9.1`, `pycuda==2025.1.2`, `numba==0.63.1`, `datasets==4.4.1`, and others |
| Data for Problem 3 | `project/run_machine_translation.py` loads `bbaaaa/iwslt14-de-en-preprocess` (IWSLT14 German-English) from Hugging Face and trains 1 epoch by default |
| Submission | Zip the whole `llmsys_hw4` folder and upload to Canvas, with a terminal screenshot of one-epoch training time with and without the fused kernels |

Outside readers can't get a PSC account, so bring your own NVIDIA GPU or rent a cloud machine. Canvas doesn't apply either; for self-study, treat "all of `kernel_tests/` passes and both Problem 3 timings run" as done.

The course's [Logistics page](https://llmsystem.github.io/llmsystem2026spring/docs/Logistics) has an unusual rule: students who find a typo or bug in an assignment, open a pull request, and get it merged earn a participation bonus. The repo's commit history does include many merged fixes from outside accounts, such as "Fix Adam second-moment beta coefficient", merged on 2026-02-18. If something behaves strangely while you self-study, check the commits and PRs first.

## The repo has already been changed for Fall 2026

The `llmsys_hw4` README is still titled `llmsys_f25_hw4`, and the GitHub commit history shows:

- The last change during the spring semester was a typo fix merged on **2026-02-20** (commit `e2162e7d`), before the March 11 deadline
- Two more batches landed on **2026-09-18 and 2026-09-29** (last merge on 2026-09-30), touching `nn.py`, `modules_basic.py`, `modules_transfomer.py`, `tensor_functions.py`, and `run_machine_translation.py`, and adding a prebuilt `layernorm_kernel.so`; the two `.cu` files you write were not changed in those batches

To match the spring version exactly, clone and `git checkout e2162e7d`. To follow the current assignment page, use `main`, knowing it may keep changing during Fall 2026.

## How to self-study it

1. Confirm your HW3 Transformer trains. Problem 3 uses it directly, and any HW3 bug carries over.
2. Start with softmax forward: read the finished `ker_attn_softmax_lt32` first, then write the long-sequence version. It's the only one of the four kernels with a ready-made template to compare against.
3. Before LayerNorm, derive the formulas on L10 slides 21-22 yourself, and make sure you see why μ(x) and μ(x²) can be computed together and why the two backward sums can run in parallel.
4. After both Problem 3 timings, profile how much of training time softmax and LayerNorm took originally, and verify for yourself where the 1.1x comes from.

One thing you can do tonight: clone the repo, read only `ker_attn_softmax_lt32` in `src/softmax_kernel.cu`, and map each step to the diagrams on L10 slides 23-24.

## Further reading

- Writing fused kernels in Triton, and profiling before optimizing: [CS336 Lecture 6: Benchmark and Profile Before Writing a Triton Kernel](/posts/ai/2026-08-22-cs336-kernels-triton-en)
- Fusing all of attention into one kernel: this series' [FlashAttention post](/posts/ai/2026-09-30-cmu11868-flashattention-en)

## References

- [Assignment 4: Transformer CUDA Acceleration (assignment page)](https://llmsystem.github.io/llmsystemhomework/assignment_4/) — the three problems, points, expected speedups, setup, and submission (as seen 2026-09-30)
- [llmsystem/llmsys_hw4 (GitHub)](https://github.com/llmsystem/llmsys_hw4) — starter code, kernel tests, `requirements.txt`
- [llmsys_hw4 commit history](https://github.com/llmsystem/llmsys_hw4/commits/main) — last spring change 2026-02-20, fall changes from 2026-09-18
- [kernel_tests/test_softmax_fw.py](https://github.com/llmsystem/llmsys_hw4/blob/main/kernel_tests/test_softmax_fw.py) — the test uses MiniTorch's own softmax as the baseline
- [project/run_machine_translation.py](https://github.com/llmsystem/llmsys_hw4/blob/main/project/run_machine_translation.py) — Problem 3's IWSLT14 dataset and the `--use-fused-kernel` flag
- [11-868 Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) — HW4 due 3/11
- [11-868 Spring 2026 Logistics](https://llmsystem.github.io/llmsystem2026spring/docs/Logistics) — homework weighting, PSC, the participation bonus for bug fixes
- [L10 slides (PDF)](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-10-transformer-acc-5ba466406bf7296f86cd244ad0405867.pdf) — the LayerNorm/Softmax rewrites on pp.21-26
- [Wang et al., LightSeq (arXiv 2010.13887)](https://arxiv.org/abs/2010.13887) and [LightSeq2 (arXiv 2110.05722)](https://arxiv.org/abs/2110.05722) — the two papers the assignment names
- [NVIDIA Developer Blog: Cooperative Groups](https://developer.nvidia.com/blog/cooperative-groups/) — the `shfl_down` explainer the assignment links
