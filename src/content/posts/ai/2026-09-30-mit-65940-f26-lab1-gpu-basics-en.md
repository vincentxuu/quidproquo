---
title: "MIT 6.5940 Fall 2026 Lab 1 Supplement: Reading GPU Bottlenecks with Roofline, the Profiler, and FlashAttention"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, mit, ai-course, course-guide, gpu, performance, flashattention, homework]
lang: en
series:
  name: "Reading MIT 6.5940"
  order: 17
tldr: "This post covers Fall 2026 material, not the Fall 2024 edition the rest of the series follows. Fall 2026 replaced the pruning lab with \"Efficient AI Fundamentals\" (lab1_gpu_basics.zip). Part 1 has you hand-write a triple-loop GEMM and compute MAC, FLOPs, and I/O. Part 2 plots GEMM and GEMV rooflines. Part 3 works through a gemma-3-270m-it decoder layer, computing attention and MLP costs and comparing prefill with decode. Part 4 uses the PyTorch Profiler to inspect kernels, has you write GeLU to feel kernel fusion, then tries torch.compile and CUDA Graphs. Part 5 compares SDPA with FlashAttention. The core is 80 points plus 20 bonus, and all of Part 5 became bonus because Colab's T4 can't run it."
description: "A guide to MIT 6.5940 Fall 2026 Lab 1 (GPU Basics / Efficient AI Fundamentals): the five parts in the README and notebook, points per question, Colab and local GPU requirements, the gemma-3-270m-it case study, PyTorch Profiler, kernel fusion, torch.compile, CUDA Graphs, the FlashAttention bonus, and how it relates to Fall 2024 Lecture 13 and Labs 4/5. No solutions."
draft: false
glossary:
  - term: "roofline model"
    aliases: ["roofline"]
    definition: "A plot with a kernel's arithmetic intensity (FLOPs ÷ bytes moved) on the x-axis and attainable performance on the y-axis. The sloped left side is limited by memory bandwidth, the flat right side by peak compute, and the point where they meet is the ridge point."
    context: "Parts 2 and 3 of Fall 2026 Lab 1 both ask you to draw one."
  - term: "arithmetic intensity"
    aliases: ["AI", "operational intensity"]
    definition: "The FLOPs an operation performs divided by the bytes it has to move. Below the ridge point it's memory-bound; above it, compute-bound."
    context: "Lab 1 uses it to explain why GEMM and prefill lean compute-bound while GEMV and decode lean memory-bound."
  - term: "CUDA Graph"
    definition: "Records a sequence of GPU kernel launches once and replays the whole sequence in one go, saving the cost of launching each kernel individually from the CPU."
    context: "Lab 1 Part 4 enables it through torch.compile's max-autotune mode."
---

> 🌏 [中文版](/posts/ai/2026-09-30-mit-65940-f26-lab1-gpu-basics)

**Video status: Official entry or recording index only.** [Source details](#course-video-sources)

**This post covers Fall 2026 material.** The [Reading MIT 6.5940](/posts/ai/2026-09-30-mit-65940-course-overview-en) series follows [Fall 2024](https://hanlab.mit.edu/courses/2024-fall-65940). This is post 17, and the only one built mainly on [Fall 2026](https://hanlab.mit.edu/courses/2026-fall-65940) material.

**Why it's included**: Fall 2024 has no GPU profiling lab, yet [Lecture 13](/posts/ai/2026-09-30-mit-65940-llm-deployment-en) keeps leaning on "decode is limited by bandwidth" and "FlashAttention moves less data". Fall 2026's Lab 1 lets you measure those claims yourself. It sits after [Lab 4 + Lab 5](/posts/ai/2026-09-30-mit-65940-lab4-lab5-llm-on-laptop-en) as the closing exercise for the LLM inference stretch.

**Series position**: previous [Lab 4 + Lab 5: AWQ and LLaMA2-7B on a laptop](/posts/ai/2026-09-30-mit-65940-lab4-lab5-llm-on-laptop-en) | next [L14 LLM post-training](/posts/ai/2026-09-30-mit-65940-llm-post-training-en) | [series overview](/posts/ai/2026-09-30-mit-65940-course-overview-en)

**Official materials**: [lab1_gpu_basics.zip](https://www.dropbox.com/scl/fi/y2zmly5aoekmsg7jq4954/lab1_gpu_basics.zip?rlkey=29v29mlm2muvm0c5teleiusvc&dl=1), linked from the Lecture 4 row of the Fall 2026 course page. The files inside are dated 2026-09-29. The schedule has it released September 22 and due October 1 (Lecture 7). Question numbers and points below follow the README and notebook in the archive, checked on 2026-09-30.

**Access level A2 (semester in progress)**: the archive is publicly downloadable, but submissions go through MIT's Canvas, there are no public solutions, and the course page says it isn't taking cross-registered students this semester. The notebook includes a few public test cases for self-checking. This post **doesn't include solutions**.

## Course video sources

Use the official course entry to check the lecture covered by this article; a directly embeddable public recording for this article has not been verified in this update.

Course and recording entries:

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)

## What's in the archive

The README's title is "Lab1: Efficient AI Fundamentals", and its acknowledgment credits Zhijian Liu's Z Lab for providing the lab.

- `lab1(colab).ipynb`: for Colab, with images embedded. Upload the whole `lab1_gpu_basics` folder to Google Drive, open the notebook from there, and run Setup first.
- `lab1.ipynb`: same content, for a local machine with an NVIDIA GPU.
- `utils/`: benchmarking, a GPU spec table (`config.py` includes T4, L4, A100-40GB, A6000, H100, and others), and roofline plotting helpers.
- Submit only one of the two notebooks.

**Pin the versions**: the README says pinned versions such as `transformers==4.57.6` are required, because newer `transformers` releases changed an API that `utils/config.py` relies on. Colab's preinstalled `transformers` is too new, so skipping Setup fails at import.

**GPU requirements**: Parts 1–4 work on a Colab T4. Part 3.3's prefill/decode latency measurements need an A100 or A6000, but that section has no questions, so T4 users can skip it. For Part 5 on Colab, set the runtime version to 2025.10 and use an A100 so a prebuilt `flash-attn` installs. Otherwise pip compiles it from source, which can take hours.

## The five parts and their points

The core is 80 points:

| Part | Topic | Questions (points) | Subtotal |
|---|---|---|---|
| 1 | Basic metrics: latency, MAC, I/O | 1.1 hand-written triple-loop GEMM (5), 1.2 latency measurement (5), 1.3 MAC for GEMM/GEMV (5), 1.4 I/O for GEMM/GEMV (5) | 20 |
| 2 | Roofline | 2.1.1 GEMM roofline (5), 2.1.2 how large N must be to go compute-bound (5), 2.2 GEMV roofline (5) | 15 |
| 3 | Gemma-3 decoder layer case study | 3.1 attention MAC (10), 3.2 attention I/O (5), 3.4.1 prefill vs decode (5), 3.4.2 effect of batch size (5), 3.4.3 effect of prefill length (5) | 30 |
| 4 | Profiling and kernel fusion | 4.3.1 write GeLU (3), 4.3.2 GeLU latency (2), 4.3.3 findings (2), 4.3.4 explain with the profiler (5), 4.4.1 compiled MLP (3) | 15 |

Bonus, 20 points: MAC and I/O for the whole attention module (2.5 each), profiling the decoder layer during decode (2.5), CUDA Graph profiling (2.5), FlashAttention vs SDPA (5), and FlashAttention analysis (5).

## Parts 1–2: describing an operation with three numbers

**Setup.** Part 1 asks for a triple-loop matrix multiply in plain Python, with no NumPy or PyTorch ops. The notebook explains this is deliberate: the loop runs on the CPU, and later you compare it with `torch.matmul`.

**Three metrics.** Latency measures time. A MAC is one multiply-accumulate, and 1 MAC equals 2 FLOPs. I/O is how many bytes have to move. Question 1.2 asks you to time your GEMM several times in a row without warmup and describe what you see. It builds the instinct that measurement itself is noisy.

**Roofline.** Part 2 defines arithmetic intensity as FLOPs ÷ bytes and the ridge point as peak FLOPs ÷ peak bandwidth. In the memory-bound region on the left, performance = bandwidth × arithmetic intensity. In the compute-bound region on the right, performance = peak FLOPs.

2.1 plots FP32 GEMM rooflines for N from 1024 to 8192 and asks you to derive how large N must be on an A6000 before GEMM turns compute-bound. 2.2 repeats the plot for GEMV. Put the two plots side by side and you'll see what [Lecture 13](/posts/ai/2026-09-30-mit-65940-llm-deployment-en) means by "decode is GEMV, and it's slow because of moving weights".

Remember to change the notebook's default `gpu_name = "A6000"` to the card you're actually using. The comment lists the Colab options.

## Part 3: working through a real decoder layer

The case-study model is [gemma-3-270m-it](https://huggingface.co/google/gemma-3-270m-it). The notebook first lists every component of one decoder layer: input LayerNorm, self-attention (Q/K norm, QKV projections, rotary embedding, output projection), two LayerNorms, the MLP (gate, up, activation, down), and a post-MLP LayerNorm.

It demonstrates how to compute the MLP's MAC and I/O, then asks you to follow the same conventions for attention (3.1, 3.2). The notebook says any extra assumptions get full credit as long as they're reasonable and stated clearly in a comment.

Next it plots the MLP's prefill and decode on the roofline and states the conclusion itself: prefill is compute-bound, decode is memory-bound, and this isn't just an MLP quirk but a general feature of modern LLM inference. The three 3.4 questions dig into why:

- **3.4.1**: explain the difference from the query's shape (hint: think GEMM versus GEMV).
- **3.4.2**: during decode, raise the batch size from 1 to 64 and track how the point moves on the roofline.
- **3.4.3**: during prefill, raise the length from 64 to 4096 and track how the point moves.

The answer to 3.4.2 is the reason Lecture 13 says W8A8 suits batched serving while single-user decode needs W4A16.

## Part 4: see the kernels, then merge them

**Profiler.** 4.1 uses `torch.profiler` to show which CUDA kernel a single `torch.matmul` actually calls. 4.2 switches to the MLP, where the kernel count jumps, and shows how to export a Chrome trace and open it in [Perfetto](https://ui.perfetto.dev/) as a timeline.

**Kernel fusion.** The notebook borrows Horace He's [factory-and-warehouse analogy](https://horace.io/brrr_intro.html). A unary op like `torch.cos` ships data from the warehouse (memory) to the factory (compute units), does a tiny bit of work, and ships it back, so nearly all the time goes to shipping. A chain of such ops makes that round trip at every step. Fusion keeps the data in the factory until all the work is done.

4.3 lets you feel this directly. Write the tanh-approximated GeLU from basic PyTorch ops, compare its latency with `torch.nn.functional.gelu(x, approximate="tanh")`, and use the profiler to explain where the gap comes from.

**torch.compile and CUDA Graphs.** 4.4 first hands your GeLU to `torch.compile` to see what it fuses into, then compiles the MLP with `max-autotune-no-cudagraphs` and compares the before-and-after profiles. Bonus 4.4.2 switches to `max-autotune` (which enables CUDA Graphs), and the graphs only replay under `torch.no_grad()`. The notebook also warns that on GPUs with few SMs, like the T4, `max-autotune` doesn't autotune the matmuls, so the main visible change is the fused element-wise ops.

## Part 5: FlashAttention (all bonus now)

The notebook says this part became bonus because a standard Colab T4 can't run it, and the staff didn't want students stuck hunting for GPUs near the deadline.

- **5.1**: measure standard SDPA's peak memory at sequence lengths from 512 to 32768, then answer what its memory complexity is, at what length it becomes a problem on your GPU, what its main memory overhead is, and which LLM scenario that would hurt.
- **5.2**: compare the latency and memory of `flash_attn_func` against SDPA, then use the profiler to see how FlashAttention fuses attention into a single kernel.

The notebook's explanation of FlashAttention matches pages 82–83 of Lecture 13: it never writes the $N \times N$ attention matrix to HBM, splits Q, K, and V into blocks that fit in SRAM, and computes block by block with an online softmax. It lists the payoff as memory dropping from $O(N^2)$ to $O(N)$, a 2–4x speedup from fewer HBM accesses, and exact rather than approximate attention.

## How this lab maps to the Fall 2024 spine

| What this lab practices | Where Fall 2024 covers it |
|---|---|
| Definitions of MAC, FLOPs, latency | [Lecture 2: efficiency metrics](/posts/ai/2026-09-30-mit-65940-basics-efficiency-metrics-en) |
| Prefill and decode have different bottlenecks | [Lecture 13](/posts/ai/2026-09-30-mit-65940-llm-deployment-en), pages 19–20 |
| Kernel fusion | Lecture 13, page 37 (TinyChat fusing dequantization with the matrix multiply) |
| FlashAttention | Lecture 13, pages 82–83 |
| Parallelism and the hardware underneath | [Lecture 11: TinyEngine](/posts/ai/2026-09-30-mit-65940-tinyengine-parallel-computing-en) |

The difference is that Fall 2024's Labs 4 and 5 have you optimize kernels on a CPU, while this lab has you measure and diagnose on a GPU. Together they make the full loop: find the bottleneck first, then optimize.

Also note that because Fall 2026 swapped in this lab, **it no longer has a pruning lab**. To practice pruning, use [Fall 2024's Lab 1](/posts/ai/2026-09-30-mit-65940-lab1-pruning-en).

## How to self-study it

1. **Decide where you'll run it.** With only Colab's free T4, do Parts 1–4 and skip Part 3.3 and Part 5. With an A100 or A6000, do the full version.
2. **Restart the runtime after Setup.** The README calls this out: skip the restart and imports fail.
3. **Work Parts 1–2 on paper first.** Derive the MAC and I/O for GEMM and GEMV by hand, then write the code and check it against the public test cases.
4. **In Part 4, export a trace at least once and open it.** The table shows only totals. The timeline shows the gaps between kernels.

One thing you can do tonight: download the archive and do only 2.1.2, using your own GPU's peak compute and bandwidth to find its ridge point. After that, you can check any "this op is memory-bound" claim yourself.

## Further reading

- Same series: [L13 LLM deployment](/posts/ai/2026-09-30-mit-65940-llm-deployment-en), [Lab 4 + Lab 5](/posts/ai/2026-09-30-mit-65940-lab4-lab5-llm-on-laptop-en), [L11 TinyEngine and parallel computing](/posts/ai/2026-09-30-mit-65940-tinyengine-parallel-computing-en)
- GPUs and kernels: [CS336 GPUs and TPUs](/posts/ai/2026-08-22-cs336-gpu-tpu-en), [CS336 kernels and Triton](/posts/ai/2026-08-22-cs336-kernels-triton-en), [CMU 11-868 GPU programming](/posts/ai/2026-09-30-cmu11868-gpu-programming-acceleration-en)
- FlashAttention: [CMU 11-868 FlashAttention](/posts/ai/2026-09-30-cmu11868-flashattention-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [MIT 6.5940 Fall 2026 course page](https://hanlab.mit.edu/courses/2026-fall-65940) — Lab 1 release and due dates, lab list, cross-registration policy
- [lab1_gpu_basics.zip (Fall 2026, Dropbox)](https://www.dropbox.com/scl/fi/y2zmly5aoekmsg7jq4954/lab1_gpu_basics.zip?rlkey=29v29mlm2muvm0c5teleiusvc&dl=1) — README, notebooks, utils; every question number, point value, and hardware requirement in this post
- [MIT 6.5940 Fall 2024 course page](https://hanlab.mit.edu/courses/2024-fall-65940) — the spine semester's lab list (Lab 1 is Pruning)
- [Lec13-LLM-Deployment.pdf (Fall 2024)](https://www.dropbox.com/scl/fi/aa5ea0hrc68cn3fh18nan/Lec13-LLM-Deployment.pdf?rlkey=gzq9yiddx4bnh14bxomtfmcoj&dl=0) — the matching pages on decode bottlenecks, kernel fusion, and FlashAttention
- [google/gemma-3-270m-it (Hugging Face)](https://huggingface.co/google/gemma-3-270m-it) — the Part 3 case-study model
- [Horace He, Making Deep Learning Go Brrrr From First Principles](https://horace.io/brrr_intro.html) — the kernel fusion analogy the notebook cites
- [Dao-AILab/flash-attention (GitHub)](https://github.com/Dao-AILab/flash-attention) — the `flash-attn` package used in Part 5
- [Dao et al., FlashAttention (arXiv:2205.14135)](https://arxiv.org/abs/2205.14135)
- [PyTorch Profiler documentation](https://pytorch.org/docs/stable/profiler.html)
