---
title: "MIT 6.5940 Lecture 4: Per-Layer Pruning Ratios, Fine-Tuning, and Hardware Support for Sparsity"
date: 2026-09-30
category: ai
type: guide
tags: [ai-course, mit, pruning, model-compression, hardware]
lang: en
series:
  name: "Reading MIT 6.5940"
  order: 3
tldr: "MIT 6.5940 Lecture 4 finishes the pruning unit. Per-layer ratios come from sensitivity analysis, AMC (reinforcement learning), or NetAdapt (step-by-step with a lookup table). Fine-tuning uses 1/10 to 1/100 of the original learning rate, and iterative pruning pushes AlexNet from 5x to 9x. EIE, NVIDIA 2:4 sparsity, and TorchSparse/PointAcc show that sparsity only turns into speed with system support."
description: "A guide to MIT 6.5940 EfficientML (Fall 2024) Lecture 4, Pruning and Sparsity Part II: non-uniform pruning, sensitivity analysis, AMC, NetAdapt, fine-tuning and iterative pruning, L1/L2 regularization, and system and hardware support through EIE, M:N (2:4) sparsity, TorchSparse, and PointAcc, with a Fall 2026 comparison."
draft: false
glossary:
  - term: "sensitivity analysis (pruning)"
    aliases: ["sensitivity scan"]
    definition: "Prune one layer at a time across a sweep of pruning ratios, record the accuracy drop at each ratio, plot a sensitivity curve per layer, and pick each layer's ratio from its curve."
    context: "6.5940 Lecture 4 demonstrates it with VGG-11 on CIFAR-10 and notes that it ignores interactions between layers."
  - term: "2:4 sparsity"
    aliases: ["M:N sparsity", "N:M sparsity"]
    definition: "A structured fine-grained sparsity format that keeps two nonzero values out of every four consecutive weights. Nonzeros are packed to the left and their positions stored as 2-bit indices, so NVIDIA Sparse Tensor Cores perform only half the multiplications."
    context: "6.5940 Lecture 4 uses it to show how fine-grained but regular sparsity can deliver speedups on GPUs."
---

> 🌏 [中文版](/posts/ai/2026-09-30-mit-65940-pruning-ratio-system-support)

**Video status: Videos included.** [Source details](#course-video-sources)

> **Version note**: This post is based on the [MIT 6.5940 Fall 2024 course page](https://hanlab.mit.edu/courses/2024-fall-65940), the most recent complete offering. Fall 2025 was not offered because Song Han was on sabbatical; the [series overview](/posts/ai/2026-09-30-mit-65940-course-overview-en) explains the choice. The main source is the [Lecture 4 slides, Lec04-Pruning-II.pdf](https://www.dropbox.com/scl/fi/w5baiyci5cxl1ozpy6lsr/Lec04-Pruning-II.pdf?rlkey=6qxc1nz20isy9izwnqfebtukg&st=59gy1eal&dl=0) (119 pages; page numbers below are PDF pages). The [recording](https://youtu.be/upaZrpXkELc) is linked too, but every claim here rests on the slides. Facts were checked against the official materials on 2026-09-30. Access level: Fall 2024 is **A3** (slides, recordings, and labs all public); Fall 2026 is **A2** (in progress).

**Series**: previous [Lecture 3: where to prune, at what granularity, by what criterion](/posts/ai/2026-09-30-mit-65940-pruning-granularity-criteria-en) | next [Lab 1: fine-grained vs. channel pruning](/posts/ai/2026-09-30-mit-65940-lab1-pruning-en) | [Series overview](/posts/ai/2026-09-30-mit-65940-course-overview-en)

[Lecture 3](/posts/ai/2026-09-30-mit-65940-pruning-granularity-criteria-en) answered two questions: what shape to prune, and which weights to pick. Pruning a real model raises three more. How much should each layer lose? How do you recover the accuracy you lost? And will the hardware actually run the sparse matrix any faster?

Lecture 4 covers those three. Page 2 splits the pruning unit into five questions. Lecture 3 took the first three; this lecture takes "Determine the Pruning Ratio" and "Fine-tune/Train Pruned Neural Network", then adds a long section on system and hardware support.

## Course video sources
Rechecked against the live official course page on 2026-10-10: the lecture numbers and recording links match and the videos are public and embeddable.

```youtube
url: https://www.youtube.com/watch?v=upaZrpXkELc
title: EfficientML.ai Lecture 4 - Pruning and Sparsity Part II (MIT 6.5940, Fall 2024)
```

Original videos: [EfficientML.ai Lecture 4 - Pruning and Sparsity Part II (MIT 6.5940, Fall 2024)](https://www.youtube.com/watch?v=upaZrpXkELc)

Course and recording entries:

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): Read the opening and closing summary and spot-checked the middle: deciding per-layer pruning ratios with sensitivity analysis, AMC (reinforcement learning), NetAdapt, fine-tuning to recover accuracy, EIE and sparse accelerators, NVIDIA's sparse support (the captions are garbled here, so exact names follow the slides), and the merge-sort matching for point-cloud sparse convolution. Topics and lecture number match this post. The post only suggests watching the recording alongside the accelerator diagrams and makes no specific claims about the video's content. Page numbers and slide figures follow the slides and were not checked sentence by sentence against the video.

## Pruning as an optimization problem

Page 4 writes pruning down formally:

$$
\arg\min_{W_P} L(x; W_P) \quad \text{s.t.} \quad \|W_P\|_0 < N
$$

$L$ is the training objective, $W_P$ the pruned weights, $\|W_P\|_0$ the count of nonzeros, and $N$ the budget of nonzeros you allow. The constraint caps the total. It says nothing about how that total splits across layers, and the first section of the lecture fills that gap.

## How much to prune in each layer

### Non-uniform beats uniform

Pages 10–11 restate a result: shrinking every layer's channels by the same factor (uniform shrink) loses to pruning each layer by a different ratio. The slide cites the accuracy-vs-latency curve from [AMC (He et al., ECCV 2018)](https://arxiv.org/abs/1802.03494), where the pruned models reach higher accuracy at the same latency.

So how do you set the ratios?

### Method 1: sensitivity analysis

Page 12 gives the intuition. Layers differ in how much pruning they tolerate. Some are sensitive (the first layer, for example) and some are redundant. Page 16 lays out the procedure, using VGG-11 on CIFAR-10:

1. Pick a layer $L_i$.
2. Prune it at each $r \in \{0, 0.1, 0.2, \dots, 0.9\}$.
3. Record the accuracy drop $\Delta Acc_r$ at each ratio.
4. Repeat for every layer.

With one curve per layer, draw an accuracy threshold $T$ and give each layer the largest ratio that stays above it.

Pages 25–26 ask whether this is optimal. The slide answers "Maybe not": it touches one layer at a time and ignores how layers interact. The next method goes after that gap.

### Method 2: AMC, hand the ratios to reinforcement learning

Page 28 states the goal as a "push-the-button" solution that doesn't need an expert in both ML and hardware. AMC treats layer-by-layer ratio selection as a reinforcement learning problem. Page 31 lists the setup:

| Component | Setting |
|---|---|
| State | Layer index, channel count, kernel size, FLOPs, and other features |
| Action | A continuous value $a \in [0, 1)$: the layer's pruning ratio |
| Agent | DDPG, because it supports continuous actions |
| Reward | $-\text{Error}$ if the constraints are met, $-\infty$ otherwise |

Latency constraints use a pre-built lookup table instead of on-device measurement every time.

The table on page 34 is the concrete evidence. The baseline MobileNet has 569M MACs, 70.6% top-1, and 119.0 ms. AMC at 50% FLOPs gets 285M MACs, 70.5%, and 64.4 ms. The hand-designed comparison, MobileNet at 0.75 width, lands at 325M MACs, 68.4%, and 69.5 ms. Latency was measured with TF-Lite on a Samsung Galaxy S7 Edge, single core, batch size 1.

### Method 3: NetAdapt, trim a little and keep the best layer

[NetAdapt (Yang et al., ECCV 2018)](https://arxiv.org/abs/1804.03230) takes a rule-based, iterative path (page 35). It also searches for per-layer ratios that meet one global resource budget, such as latency or energy. The loop on page 41:

1. Each round sets a latency reduction target $\Delta R$ (chosen by hand).
2. For every layer, prune just enough to save $\Delta R$ (estimated from a lookup table), fine-tune briefly for 10k iterations, and measure accuracy.
3. Keep the layer whose pruned version scored highest, and prune it for real.
4. Repeat until the total latency meets the budget, then fine-tune for a long run to recover accuracy.

Page 42 points out a side effect: every round yields a model, so you end up with a whole family of models at different costs, one per iteration.

## Recovering accuracy after pruning

Page 45: the higher the pruning ratio, the more accuracy drops. Fine-tuning the pruned network recovers accuracy and lets you push the ratio further. The slide gives a working number: the fine-tuning learning rate is usually 1/100 to 1/10 of the original.

Pages 46–53 cover iterative pruning. One round is "prune, then fine-tune", and each round raises the target sparsity a bit. Page 53 cites [Han et al. (NeurIPS 2015)](https://arxiv.org/abs/1506.02626): on AlexNet, iterative pruning raised the pruning ratio from 5x to 9x compared with one aggressive step.

Page 54 adds regularization, a term in the loss that penalizes nonzero parameters and pushes parameters toward smaller values:

- L1: $L' = L(x; W) + \lambda |W|$
- L2: $L' = L(x; W) + \lambda \|W\|^2$

The slide's examples: magnitude-based fine-grained pruning applies L2 to the weights, and [Network Slimming (Liu et al., ICCV 2017)](https://arxiv.org/abs/1708.06519) applies smooth-L1 to the channel scaling factors.

## Sparsity needs system support to get faster

This is the longest section of the lecture (pages 56–117). Page 57 lists three case studies, one for each kind of sparsity:

| Case | Sparsity it exploits |
|---|---|
| EIE | Weight sparsity plus activation sparsity |
| NVIDIA Tensor Core | M:N weight sparsity |
| TorchSparse and PointAcc | Activation sparsity (sparse convolution on point clouds) |

### EIE: the first accelerator for sparse, compressed models

Page 60 calls [EIE (Han et al., ISCA 2016)](https://arxiv.org/abs/1602.01528) "The First DNN Accelerator for Sparse, Compressed Model". It exploits three things at once:

- **Sparse weights**: 90% static sparsity, for 10x less computation and 5x less memory.
- **Sparse activations**: 70% dynamic sparsity, for another 3x less computation.
- **Weight sharing**: 4-bit weights, for 8x less memory.

Pages 61–75 walk through how EIE partitions the sparse matrix across processing elements (PEs), its dataflow, and each PE's microarchitecture. These pages read best alongside the recording.

Page 80 is worth copying down, because the slide lists the pros and cons itself:

- Pros: special-purpose hardware can make sparse operations cost-effective for matrices up to 50% dense. EIE skips both zero weights and zero activations. It supports fine-grained sparsity, which allows higher pruning ratios. It stores 4-bit weights and decodes them to 16-bit for 16-bit arithmetic, and the slide notes that this W4A16 approach is reborn for LLMs in GPTQ, AWQ, llama.cpp, and MLC LLM.
- Cons: it doesn't map easily onto arrays of vector processors (the fix is structured N:M sparsity). Control flow and storage add overhead (the fix is coarse-grained sparsity). It supports only FC layers. It fits everything in SRAM, which is practical for TinyML but not for LLMs.

Page 81 sums up the section in one principle: the first principle of efficient AI computing is to be lazy. Avoid redundant computation, quickly reject the work, or delay the work.

### M:N sparsity: fine-grained sparsity that GPUs can use

NVIDIA's answer to EIE's first con is M:N sparsity. Pages 83–85 cite the 2:4 format from [Mishra et al. (arXiv 2021)](https://arxiv.org/abs/2104.08378): keep two nonzeros out of every four consecutive weights. Storage packs the nonzeros to the left, so an $R \times C$ matrix becomes $R \times C/2$ values plus 2-bit index metadata.

Page 86 shows how this maps onto a Tensor Core. The sparse matrix A shrinks from $M \times K$ to $M \times K/2$. The hardware uses the indices to pick matching elements from the dense matrix B, so only two of every four multiplications happen.

Does accuracy suffer? The ImageNet top-1 table on page 87 says barely. ResNet-50 goes from 76.1 dense FP16 to 76.2 with 2:4 sparse FP16, for example.

### TorchSparse and PointAcc: when the input is already sparse

The third case has nothing to do with pruning: inputs like point clouds are sparse to begin with. Page 90 contrasts the two convolutions. A conventional convolution dilates the nonzeros outward; a sparse convolution does not.

[TorchSparse (Tang et al., MLSys 2022)](https://arxiv.org/abs/2204.10319) splits sparse convolution into gather, matrix multiply, and scatter-accumulate (page 105). The core trade-off is on pages 106–109:

- One matmul per kernel offset wastes no computation, but launches many kernels and leaves the device underused.
- Treating it as a dense convolution is the most regular, but computes far more.
- Grouping offsets into batched matmuls spends a little extra computation for regularity, and the grouping strategy can be searched per model and dataset (adaptive grouping).

On the hardware side, [PointAcc (Lin et al., MICRO 2021)](https://arxiv.org/abs/2110.07600) uses merge sort in a mapping unit to find input-output pairs for sparse convolution (pages 115–116). Page 117 charts its speedup and energy savings against platforms including the RTX 2080Ti and TPU v3.

## Fall 2026 comparison

Lecture 4 on the [Fall 2026 course page](https://hanlab.mit.edu/courses/2026-fall-65940) (September 22) already has [slides](https://www.dropbox.com/scl/fi/cmqhxgcml6gpks9khm2vm/Lec04-Pruning-II.pdf?rlkey=k7fb0eam3aiy8kl9gosx2qt78&st=d75bnpaw&dl=0) and a [recording](https://www.youtube.com/watch?v=y-WU7PVj0cg). I compared the text layers of the two PDFs. Both have 119 pages. The only differences are the cover image, the footer's new course name ("TinyML and Efficient AI Computing"), and whitespace. This post applies to both offerings.

The lab is what changed. Fall 2024 released Lab 1 (Pruning) with Lecture 4. Fall 2026 released a different Lab 1, GPU Basics, on the same day. **If you want pruning practice, Fall 2024's Lab 1 is the only option**, and the next post breaks it down.

## What to do after reading

1. Answer the two questions in the summary on page 118. How do you find pruning ratios automatically? What system support does each granularity need? If you can't, go back to pages 26 and 57.
2. Map "non-uniform ratios", "fine-tuning", and "hardware support" onto a model you actually run. Does your inference hardware support 2:4 sparsity? If not, fine-grained pruning saves storage there but not time.
3. One thing you can do tonight: open [Fall 2024 Lab 1](https://colab.research.google.com/drive/1Fagq3JQBzCizodyxpHKvWDzfCC7F1RWN), run it up to the sensitivity scan cell, and see how different the per-layer curves are.

## Further reading

- The first half of pruning (granularity and criteria): [Lecture 3 guide](/posts/ai/2026-09-30-mit-65940-pruning-granularity-criteria-en)
- The same ideas applied to LLMs: [Reading CMU 11-868: model quantization](/posts/ai/2026-09-30-cmu11868-model-quantization-en) (why W4A16 came back)
- Background on GPUs and Tensor Cores: [CS336: GPUs and TPUs](/posts/ai/2026-08-22-cs336-gpu-tpu-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Live-checked the official course page: lecture numbers and recording links match and the videos are public, so the status is now “Videos included.”
- 2026-10-10: Checked the video content against its transcript. The L4 video matches the topic and lecture number; the spot check found no contradictions, so the body text is unchanged.

## References

- [MIT 6.5940 Fall 2024 course page](https://hanlab.mit.edu/courses/2024-fall-65940) — schedule (Lecture 4 on September 17, Lab 1 released the same day), slide and video links, Fall 2025 sabbatical notice
- [Lec04-Pruning-II.pdf (Fall 2024)](https://www.dropbox.com/scl/fi/w5baiyci5cxl1ozpy6lsr/Lec04-Pruning-II.pdf?rlkey=6qxc1nz20isy9izwnqfebtukg&st=59gy1eal&dl=0) — source of every page number above
- [EfficientML.ai Lecture 4 recording (Fall 2024)](https://youtu.be/upaZrpXkELc)
- [MIT 6.5940 Fall 2026 course page](https://hanlab.mit.edu/courses/2026-fall-65940) — Lecture 4 slides, [recording](https://www.youtube.com/watch?v=y-WU7PVj0cg), Lab 1 changed to GPU Basics
- [Han et al., Learning both Weights and Connections for Efficient Neural Networks (NeurIPS 2015)](https://arxiv.org/abs/1506.02626) — fine-tuning and iterative pruning
- [He et al., AMC: AutoML for Model Compression and Acceleration on Mobile Devices (ECCV 2018)](https://arxiv.org/abs/1802.03494)
- [Yang et al., NetAdapt: Platform-Aware Neural Network Adaptation for Mobile Applications (ECCV 2018)](https://arxiv.org/abs/1804.03230)
- [Liu et al., Learning Efficient Convolutional Networks through Network Slimming (ICCV 2017)](https://arxiv.org/abs/1708.06519)
- [Han et al., EIE: Efficient Inference Engine on Compressed Deep Neural Network (ISCA 2016)](https://arxiv.org/abs/1602.01528)
- [Mishra et al., Accelerating Sparse Deep Neural Networks (arXiv 2021)](https://arxiv.org/abs/2104.08378) — the 2:4 format and its Tensor Core mapping
- [Tang et al., TorchSparse: Efficient Point Cloud Inference Engine (MLSys 2022)](https://arxiv.org/abs/2204.10319)
- [Lin et al., PointAcc: Efficient Point Cloud Accelerator (MICRO 2021)](https://arxiv.org/abs/2110.07600)
