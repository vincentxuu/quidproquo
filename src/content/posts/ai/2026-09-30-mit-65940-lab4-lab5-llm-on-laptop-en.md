---
title: "MIT 6.5940 Lab 4 + Lab 5: Quantizing an LLM with AWQ, Then Running LLaMA2-7B on Your Own Laptop"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, mit, ai-course, course-guide, quantization, llm-inference, homework, edge-ai]
lang: en
series:
  name: "Reading MIT 6.5940"
  order: 16
tldr: "Lab 4 is a Colab notebook that rebuilds AWQ step by step on OPT-1.3B: first see how badly 3-bit quantization hurts perplexity, then keep 1% of the salient channels in FP16 (Q1), then protect them by scaling instead and search for the best scale (Q2). Each question is worth 50 points, plus a bonus scored on perplexity. Lab 5 moves to C++: run 4-bit LLaMA2-7B-chat on your own computer with TinyChatEngine and write five versions of the W4A8 linear-layer kernel (loop unrolling, multithreading, SIMD, multithreading plus unrolling, and all combined), 20 points each, plus up to 20 bonus points for performance. This post covers the questions, points, setup, and limits for outside learners. No solutions."
description: "A guide to MIT 6.5940 EfficientML (Fall 2024) Lab 4 (LLM Quantization with AWQ) and Lab 5 (Optimize LLM on Edge Devices): Lab 4's Q1–Q2 and bonus with the OPT-1.3B and wikitext-2 setup; Lab 5's TinyChatEngine, QM_ARM/QM_x86 weight layouts, five kernel files and evaluate.sh, grading, and submission; plus the limits for outside learners. Includes Fall 2026 status."
draft: false
glossary:
  - term: "pseudo quantization"
    aliases: ["simulated quantization", "fake quantization"]
    definition: "Quantizing weights to integers and immediately dequantizing them back to floating point, to simulate how quantization error affects accuracy while the weights are still stored as floats."
    context: "Lab 4 evaluates AWQ this way throughout instead of writing a real 4-bit kernel."
  - term: "TinyChatEngine"
    definition: "MIT HAN Lab's C/C++ inference library for running quantized LLMs on edge devices, with support for x86 and ARM CPUs."
    context: "Lab 5's starter repo, tinychat-tutorial, is built on it."
  - term: "GOPs"
    aliases: ["GOPS", "giga operations per second"]
    definition: "Billions of operations per second, a measure of a kernel's actual throughput. Higher is faster."
    context: "Lab 5's evaluate.sh reports each implementation's performance in GOPs."
---

> 🌏 [中文版](/posts/ai/2026-09-30-mit-65940-lab4-lab5-llm-on-laptop)

**This post follows the Fall 2024 edition of [MIT 6.5940](https://hanlab.mit.edu/courses/2024-fall-65940).** It is post 16 in the [Reading MIT 6.5940](/posts/ai/2026-09-30-mit-65940-course-overview-en) series. It turns AWQ and TinyChat from [Lecture 13: LLM deployment](/posts/ai/2026-09-30-mit-65940-llm-deployment-en), and the kernel optimizations from [Lecture 11: TinyEngine and parallel computing](/posts/ai/2026-09-30-mit-65940-tinyengine-parallel-computing-en), into code.

**Series position**: previous [L13 LLM deployment](/posts/ai/2026-09-30-mit-65940-llm-deployment-en) | next [Fall 2026 Lab 1 supplement: roofline, profiling, and FlashAttention](/posts/ai/2026-09-30-mit-65940-f26-lab1-gpu-basics-en) | [series overview](/posts/ai/2026-09-30-mit-65940-course-overview-en)

**Official materials**:

- [Lab 4 Colab notebook](https://colab.research.google.com/drive/16H9RvSg4XIF35X3fLGQUVwAE9ccvDj14): released October 22 (Lecture 13) and due October 31 (Lecture 16) on the Fall 2024 course page.
- [Lab 5 Google Drive folder](https://drive.google.com/drive/folders/1MhMvxvLsyYrN-4C6eQG8Zj2JeSuyAOf0): two docx files, the handout "6.5940 Fall 2024 Lab 5: Optimize LLM on Edge Devices" and a report template. Released October 31, due November 12 (Lecture 19).
- [tinychat-tutorial](https://github.com/mit-han-lab/tinychat-tutorial): Lab 5's starter repo.

Question numbers, points, and wording below follow the notebook and docx themselves, checked on 2026-09-30.

**Access level A3, with gaps**: the notebook, docx, and starter repo are public, and the code downloads the models and datasets for you. What you can't get is grading. Submissions go through MIT's Canvas, there are no public solutions, and Lab 5's bonus requires TA verification. This post **doesn't include solutions**. It only explains what each question asks and which part of the lectures it maps to.

**Fall 2026 status**: the [Fall 2026 course page](https://hanlab.mit.edu/courses/2026-fall-65940) lists Lab 4 as "Quantization" and Lab 5 as "LLM deployment on laptop", with Lab 4 scheduled for October 27 and Lab 5 for November 5. As of 2026-09-30 neither has a link. Lab 4's label repeats Lab 2's, so whether it's still AWQ won't be known until it's released.

## How the two labs fit together

Lecture 13 made the point that quantization only saves space, and speed also needs an inference engine. These two labs are the two halves of that sentence:

| | Lab 4 | Lab 5 |
|---|---|---|
| What you do | Rebuild the AWQ algorithm in Python and watch perplexity | Optimize the linear-layer kernel of a quantized model in C++ and watch speed |
| Model | OPT-1.3B (`facebook/opt-1.3b`) | LLaMA2-7B-chat (4-bit, from the course model zoo) |
| Environment | Colab GPU (notebook metadata specifies a T4) | Your own computer (x86 or ARM CPU) |
| Metric | wikitext-2 perplexity | Kernel GOPs, and whether it can actually chat |
| Points | 100 + bonus | 100 + up to 20 bonus |

## Lab 4: LLM Quantization with AWQ

### Starting point and setup

The notebook opens by explaining why weight-only quantization matters. Take single-batch decode on LLaMA-65B: each step is a $[1, 8192] \times [8192, 8192]$ GEMV. Using the A100's FP16 throughput and roughly 2000 GB/s of bandwidth, the GEMV's arithmetic intensity comes out about two orders of magnitude below the A100's balance point. It's severely memory-bound. This is the arithmetic behind the argument on pages 19–20 of [Lecture 13](/posts/ai/2026-09-30-mit-65940-llm-deployment-en).

Setup:

- **Packages**: `transformers==4.31.0`, `accelerate==0.21.0`, `datasets==2.15.0`, and others are pinned in the first pip install cell.
- **Evaluation**: wikitext-2 test set, 40 segments of 2048 tokens each, scored by perplexity.
- **Calibration data**: 256 samples from `mit-han-lab/pile-val-backup`, cut into blocks of length 512. Forward hooks record the mean absolute value of each linear layer's input.
- **Quantization method**: pseudo quantization throughout. Weights get quantized to integers and immediately dequantized, which simulates the error without writing a real 4-bit kernel.
- **Bit width**: the notebook's title says 4-bit, but every question actually uses **3-bit with group size 128**, which makes the differences easier to see.

The notebook first runs an FP32 baseline, then the most direct 3-bit quantization. The result: the model gets smaller and perplexity gets clearly worse. Every question after that tries to win the gap back.

### Question 1 (50 points): keep 1% of the salient weights

This part maps to the two observations on pages 22–24 of Lecture 13: weights aren't equally important, and importance comes from activations.

| Question | Points | What it asks | Target given in the notebook |
|---|---|---|---|
| 1.1 | 20 | Use calibrated activation magnitudes to pick 1% of channels, back them up before quantizing, and restore them to FP16 afterward | Perplexity 17.15 |
| 1.2 | 15 | Ablation: keep a random 1% of channels instead | Perplexity above 100 |
| 1.3 | 15 | Written: why are these channels so important? | — |

1.1 and 1.2 only make sense side by side. Both keep 1%. The gap between choosing well and choosing at random is the whole reason for the name "activation-aware".

One caveat: when downloaded on 2026-09-30, the public notebook's code cells for 1.1 and 1.2 had already been filled in by someone, while 1.3 and everything after were still blank. When you self-study, clear those two cells and write them yourself, or Question 1 won't teach you anything.

### Question 2 (50 points): scaling instead of mixed precision

Keeping weights in FP16 is mixed precision, which is awkward in hardware. The notebook reuses the error derivation from page 26 of Lecture 13: multiply a salient channel by $s$ and divide the activation by $s$, and as long as the group's maximum doesn't change, the quantization error shrinks by about a factor of $s$. It also works a small 3-bit example by hand, where one weight's error drops from 2.4 to 0.6 after scaling by 2.

| Question | Points | What it asks | Target given in the notebook |
|---|---|---|---|
| 2.1 | 20 | Find the 1% salient channels, scale them up, quantize, then scale back down | Perplexity 18.93 (scale factor 2) |
| 2.2 | 15 | Try scale factors 1, 2, 3, and 4, check whether perplexity falls then rises, and explain why using the principle above | — |
| 2.3 | 15 | Implement the scale search: $s = s_X^{\alpha}$, finding the $\alpha$ within a predefined range that minimizes block output error | Perplexity 17.92 |

Most of 2.3's scaffolding is already written. `auto_scale_block` searches scales at four places in each OPT decoder layer: the attention input (q/k/v proj), the attention output (out_proj), fc1, and fc2. It then uses `scale_ln_fcs` and `scale_fc_fc` to fold the scales into the previous LayerNorm or linear layer. You fill in the search loop's "compute scale, scale up, quantize, scale down" steps.

2.2 is the question most worth your time. It's the hands-on version of the table on page 25 of Lecture 13 (RTN 43.16 → ×2 14.07 → ×4 14.42), with OPT-1.3B swapped in.

### Bonus

Any method that lowers perplexity further without mixed precision counts. If you reach perplexity $x$, you score $\max(0, (17.92 - x) \times 10)$, so each 0.1 below Q2.3's target earns 1 point.

## Lab 5: Optimize LLM on Edge Devices

### Goals and environment

The docx lists three learning goals: deploy LLaMA2-7B-chat on your own computer with [TinyChatEngine](https://github.com/mit-han-lab/TinyChatEngine), implement three optimizations (loop unrolling, multithreading, SIMD) for the linear-layer kernel, and observe the end-to-end latency gain from each.

- **Prerequisites**: basic C/C++. The docx recommends 6.S096 and a parallel computing tutorial.
- **Minimum requirements**: macOS, Linux, or Windows; an x86 (Intel/AMD) or ARM (Apple M1/M2) processor; 8 GB of memory and 5 GB of free storage.
- **Installation**: on macOS, install `boost` and `llvm` with Homebrew. On Windows you need g++, make, unzip, git, and Python, with MSYS2 recommended.
- **Download**: `git clone --recursive` the starter repo, then run `transformer/download_model.py` to fetch the `QM_x86` or `QM_ARM` model for your CPU.

MIT students whose computers fall short can use Athena or library machines, though the docx says outright that those machines aren't user-friendly and aren't recommended. Outside learners have only their own hardware.

### Background: why the 4-bit weights get reordered first

This maps to hardware-aware packing on page 36 of [Lecture 13](/posts/ai/2026-09-30-mit-65940-llm-deployment-en). TinyChatEngine reorders the 4-bit weights offline during model conversion, which removes the runtime reordering cost:

- **QM_ARM**: the 32 4-bit weights in a 128-bit vector, $[w_0, \dots, w_{31}]$, get reordered as $[w_0, w_{16}, w_1, w_{17}, \dots, w_{15}, w_{31}]$, interleaving the lower and upper halves. One 128-bit AND and shift then unpack both halves.
- **QM_x86**: the 64 weights in a 256-bit vector get reordered as $[w_0, w_{32}, w_1, w_{33}, \dots]$ to match 256-bit AVX2 SIMD.

Understand these two layouts before reading the starter code. Otherwise the SIMD question won't make sense, because you won't know how the bits arrive.

### The five implementation files and grading

The target is a **W4A8 linear-layer kernel with quantization group size 32**. Note the difference from Lab 4's 3-bit, group-128 setting: in Lab 5 the activations are 8-bit integers too.

All starter code lives in `kernels/starter_code/`, and `reference.cc` is the baseline written with a plain for loop. The docx recommends this order, and you only write code for your machine's ISA (x86 or ARM):

| Order | File | Technique | Points |
|---|---|---|---|
| 1 | `loop_unrolling.cc` | Loop unrolling | 20 |
| 2 | `multithreading.cc` | Multithreading | 20 |
| 3 | `simd_programming.cc` | SIMD instructions | 20 |
| 4 | `multithreading_loop_unrolling.cc` | Multithreading + unrolling | 20 |
| 5 | `all_techniques.cc` | All combined | 20 |
| Bonus | Your choice | Beat TinyChatEngine's built-in optimized kernel | Up to 20 |

Each 20 points splits in two: **correctness, 15 points** (from the evaluation script's output) and **performance report, 5 points** (how many GOPs you measured on your computer and why it got faster). The docx gives a total of 120 points, meaning 100 plus 20 bonus.

Each of the three techniques has a matching section in Lecture 11: loop optimization, multithreading, and SIMD programming. The docx tags every technique with its lecture section, so when you get stuck, go back to [Lecture 11](/posts/ai/2026-09-30-mit-65940-tinyengine-parallel-computing-en).

### How to check your work

`transformer/evaluate.sh` compiles, runs, checks correctness against the baseline, and prints GOPs:

- `./evaluate.sh`: test every implementation.
- `./evaluate.sh loop_unrolling`: test one, and also build a `chat` executable. Running `./chat` lets you talk to the local chatbot using that kernel version.

The docx includes sample output for `./evaluate.sh reference`: 100 runs, 15.1 ms average, about 17.3 GOPs. It doesn't say what machine that was measured on, so use it only as an order-of-magnitude check. It also recommends running reference once before you start, to confirm dependencies are installed and everything compiles.

### Submission and bonus

- **Report**: use the [report template](https://docs.google.com/document/d/17Z_ab8EhDvjcigLXdDqMqd2LTVsZ4CnpOYNkRTrnTmU/edit?usp=sharing) to paste each file's implementation and answer "how do your GOPs compare to reference, and why".
- **Code**: generate a patch with `git diff`, named `{studentID}-{ISA}.patch`, where ISA is x86 or ARM.
- **Bonus**: 1 point per 1% speedup over TinyChatEngine's built-in optimized kernel, capped at 20. The report template adds that you open a pull request on the repo and a TA verifies it.

The report template gives the path as `kernel/template/`, while the docx and the repo use `kernels/starter_code/`. Go with the repo.

## Limits for outside learners

- **No solutions, no grading.** Lab 4 gives target perplexities to compare against, and Lab 5 has `evaluate.sh`'s correctness check. Those are the only two automatic signals. Written answers and performance reports can only be checked against the slides yourself.
- **Lab 4's package versions date from 2023.** This post didn't test whether `transformers==4.31.0` still installs cleanly in newer Colab environments.
- **Lab 5's model download depends on the course model zoo.** The docx uses `download_model.py`, and this post didn't test whether that source still works in 2026. The starter repo's last push was 2024-11-05.
- **Lab 5's bonus needs a TA to verify the PR**, so outside learners can only measure and compare on their own.

## How to self-study it

1. **Read pages 19–28 of Lecture 13 before opening Lab 4.** Q1 maps to pages 22–24 and Q2 to pages 25–28. The notebook's derivations follow the slides almost page by page.
2. **In Lab 4's Q2.2, run all four scale factors** and plot perplexity as a line. The turning point where it falls then rises is your evidence that too large a scale inflates the group maximum.
3. **In Lab 5, run `./evaluate.sh reference` first, then work in order.** Loop unrolling is the easiest. SIMD depends most on understanding the weight layout.
4. **Run `./chat` after each version** to feel what the GOPs difference means in an actual conversation.

One thing you can do tonight: clone [tinychat-tutorial](https://github.com/mit-han-lab/tinychat-tutorial), get as far as `./evaluate.sh reference`, and write down your computer's GOPs. Compare every later version against it.

## Further reading

- Same series: [L13 LLM deployment](/posts/ai/2026-09-30-mit-65940-llm-deployment-en) (how AWQ and TinyChat work), [L11 TinyEngine and parallel computing](/posts/ai/2026-09-30-mit-65940-tinyengine-parallel-computing-en) (loops, multithreading, SIMD), [Lab 2: K-means and linear quantization](/posts/ai/2026-09-30-mit-65940-lab2-quantization-en) (quantization fundamentals)
- Diagnosing bottlenecks on the GPU side: [Fall 2026 Lab 1 supplement](/posts/ai/2026-09-30-mit-65940-f26-lab1-gpu-basics-en)
- Quantization and inference in other courses: [CMU 11-868 model quantization](/posts/ai/2026-09-30-cmu11868-model-quantization-en), [CS336 inference](/posts/ai/2026-08-22-cs336-inference-en)

## References

- [MIT 6.5940 Fall 2024 course page](https://hanlab.mit.edu/courses/2024-fall-65940) — Lab 4 and Lab 5 release and due dates, Canvas submission, grading weights
- [Lab 4 Colab notebook (Fall 2024)](https://colab.research.google.com/drive/16H9RvSg4XIF35X3fLGQUVwAE9ccvDj14) — every Lab 4 question number, point value, target perplexity, and setup detail
- [Lab 5 Google Drive folder (Fall 2024)](https://drive.google.com/drive/folders/1MhMvxvLsyYrN-4C6eQG8Zj2JeSuyAOf0) — handout docx and report template: system requirements, weight layouts, implementation files, grading, submission
- [mit-han-lab/tinychat-tutorial (GitHub)](https://github.com/mit-han-lab/tinychat-tutorial) — Lab 5 starter repo and the `kernels/starter_code/` file list
- [Lab 5 report template (Google Docs)](https://docs.google.com/document/d/17Z_ab8EhDvjcigLXdDqMqd2LTVsZ4CnpOYNkRTrnTmU/edit?usp=sharing)
- [mit-han-lab/TinyChatEngine (GitHub)](https://github.com/mit-han-lab/TinyChatEngine)
- [Lec13-LLM-Deployment.pdf (Fall 2024)](https://www.dropbox.com/scl/fi/aa5ea0hrc68cn3fh18nan/Lec13-LLM-Deployment.pdf?rlkey=gzq9yiddx4bnh14bxomtfmcoj&dl=0) — AWQ's observations, scaling derivation, and TinyChat
- [Lec11-TinyEngine.pdf (Fall 2024)](https://www.dropbox.com/scl/fi/z1980bzepegz85ara200n/Lec11-TinyEngine.pdf?rlkey=5evtfesbourbo03nlhazmiy1r&dl=0) — loop optimization, multithreading, SIMD
- [MIT 6.5940 Fall 2026 course page](https://hanlab.mit.edu/courses/2026-fall-65940) — Fall 2026 Lab 4/Lab 5 schedule
- [Lin et al., AWQ (arXiv:2306.00978)](https://arxiv.org/abs/2306.00978)
