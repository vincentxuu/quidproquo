---
title: "MIT 6.5940 L3 Pruning I: Where to Prune, How Fine, and by What Criterion"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, ai-course, course-guide, mit, pruning, deep-learning, cnn]
lang: en
series:
  name: "Reading MIT 6.5940"
  order: 2
tldr: "Pruning removes unimportant weights or neurons from a neural network. The goal is written as minimizing loss subject to at most N nonzero weights. Lecture 3 of 6.5940 handles two of the decisions involved. First, granularity: from fine-grained pruning, which can remove any element, to channel pruning, which removes whole channels. The more regular the pattern, the easier it is to speed up on existing hardware, and the less you can remove. In between, 2:4 sparsity gives up to 2× speedup on NVIDIA Ampere GPUs. Second, criteria: look at weight magnitude, Batch Norm scaling factors, second derivatives, the fraction of zero activations, or how well a layer's output can be reconstructed after pruning."
description: "Guide to MIT 6.5940 Fall 2024 Lecture 3, Pruning and Sparsity Part I: the pruning problem formulation, iterative pruning with fine-tuning, the trade-offs of fine-grained, pattern-based (N:M), vector, kernel, and channel granularities, and five pruning criteria (magnitude, scaling, second-order, APoZ, regression), compared against the Fall 2026 slides."
draft: false
glossary:
  - term: "pruning"
    aliases: ["neural network pruning"]
    definition: "Removing unimportant weights (synapses) or neurons from a neural network to make the model smaller and cheaper to run."
    context: "The topic of 6.5940 Lectures 3–4. Lecture 3 covers granularity and criteria."
  - term: "N:M sparsity"
    aliases: ["2:4 sparsity"]
    definition: "A regular sparsity pattern that removes N out of every M consecutive elements. 2:4 removes 2 of every 4, giving 50% sparsity."
    context: "The L3 slides cite NVIDIA: Ampere GPUs support 2:4 sparsity for up to about 2× speedup."
  - term: "APoZ"
    aliases: ["Average Percentage of Zeros"]
    definition: "The average fraction of a channel's output activations that are zero. A lower APoZ means the neuron fires more often and is more important."
    context: "L3 uses it as one criterion for choosing which neurons to prune."
---

> 🌏 [中文版](/posts/ai/2026-09-30-mit-65940-pruning-granularity-criteria)

**Video status: Videos included.** [Source details](#course-video-sources)

> This is post 2 of the [Reading MIT 6.5940](/posts/ai/2026-09-30-mit-65940-course-overview-en) series, based on the Fall 2024 edition. The previous post covered how to measure model size and compute. This one starts actually making models smaller.

Official materials covered here:

- Lecture 3 Pruning and Sparsity (Part I): [slides](https://www.dropbox.com/scl/fi/6qspcmk8qayy7mft737gh/Lec03-Pruning-I.pdf?rlkey=9jpifc92be0sitiknpbhn9ggf&st=lml94lam&dl=0) (74 pages), [video](https://www.youtube.com/watch?v=EjsB0WgIfUM)

All page numbers are PDF page numbers.

## Course video sources
Rechecked against the live official course page on 2026-10-10: the lecture numbers and recording links match and the videos are public and embeddable.

```youtube
url: https://www.youtube.com/watch?v=EjsB0WgIfUM
title: EfficientML.ai Lecture 3 - Pruning and Sparsity Part I (MIT 6.5940, Fall 2024)
```

Original videos: [EfficientML.ai Lecture 3 - Pruning and Sparsity Part I (MIT 6.5940, Fall 2024)](https://www.youtube.com/watch?v=EjsB0WgIfUM)

Course and recording entries:

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)

Checked: 2026-10-10.

## Why start with pruning

Page 4 lists the four techniques in the course's first part, "Efficient Inference": Pruning, Quantization, Neural Architecture Search, and Knowledge Distillation. Pruning comes first.

The motivation picks up from the previous lecture's energy table (page 6): one 32-bit DRAM read costs 640 pJ, far more than any arithmetic operation. Fewer weights means less data to move, and energy drops with it.

The slides also include an LLM example (page 5). In the open division of MLPerf Inference v4.1, NVIDIA pruned Llama 2 70B: depth went from 80 layers to 32, and the MLP intermediate dimension from 28,762 to 14,336. On a single H200, offline samples per second rose from 4,488 in the closed division to 11,189, about 2.5×, while keeping 99% accuracy.

## The problem statement

Page 9 writes pruning as a constrained optimization problem:

> argmin_{W_P} L(x; W_P)　subject to　‖W_P‖₀ ≤ N

L is the training objective, W the original weights, and W_P the pruned weights. ‖W_P‖₀ counts the nonzero elements of W_P, and N is how many nonzeros you are allowed. In plain terms: keep only N weights and make the loss as small as possible.

The formula raises four decisions, which also form the outline of Lectures 3 and 4 (page 8):

1. **Granularity**: what pattern do you prune in?
2. **Criterion**: which synapses or neurons do you remove?
3. **Ratio**: what target sparsity does each layer get?
4. **Fine-tuning**: how do you recover accuracy afterwards?

This post covers the first two. The other two are in the [next lecture](/posts/ai/2026-09-30-mit-65940-pruning-ratio-system-support-en).

## Pruning needs retraining

Pages 16–20 use experimental curves from [Han et al. 2015](https://arxiv.org/abs/1506.02626) to show that pruning is not one cut. The x-axis is the fraction of parameters pruned (40% to 100%) and the y-axis is accuracy loss. The slides add one line per page, three in all:

- **Prune only**: the more you prune, the faster accuracy falls
- **Prune, then fine-tune**: at the same pruning ratio, the loss is clearly smaller
- **Iterative pruning and fine-tuning**: prune a little, train a little, prune again. This reaches the highest ratio with the smallest loss

Page 21 lists results on several classic models:

| Model | Params before | Params after | Param reduction | MAC reduction |
|---|---|---|---|---|
| AlexNet | 61M | 6.7M | 9× | 3× |
| VGG-16 | 138M | 10.3M | 12× | 5× |
| GoogleNet | 7M | 2.0M | 3.5× | 5× |
| ResNet50 | 26M | 7.47M | 3.4× | 6.3× |
| SqueezeNet | 1M | 0.38M | 3.2× | 3.5× |

Parameter reduction and MAC reduction differ because pruned weights do not necessarily sit in the compute-heavy layers. AlexNet's parameters are concentrated in its fully-connected layers, and its compute in its conv layers (see the [previous post](/posts/ai/2026-09-30-mit-65940-basics-efficiency-metrics-en)). So parameters drop 9× while MACs drop only 3×.

Page 22 shows NeuralTalk, an LSTM that generates image captions. With 90% of the weights pruned, its captions are nearly the same as the original model's. Page 24 lists industry hardware support: EIE, ESE, SpArch, SpAtten, and 2:4 sparsity on the A100 GPU (the slide says "2X peak performance, 1.5X measured BERT speedup").

## Decision 1: granularity

### Starting from a 2D matrix

Pages 29–30 use a 2D weight matrix to show the two extremes:

| | Fine-grained / Unstructured | Coarse-grained / Structured |
|---|---|---|
| What can be pruned | Any position | Only whole rows or blocks |
| Flexibility | High | Low (a subset of fine-grained) |
| Speedup | Hard, because nonzeros are irregular | Easy: the result is just a smaller matrix |

### Conv layers offer four dimensions

A conv weight has shape [cₒ, cᵢ, k_h, k_w], and the four dimensions allow more ways to prune. Page 33 cites the taxonomy of Mao et al., ordered from irregular to regular:

1. **Fine-grained pruning**: any element
2. **Pattern-based pruning**: fixed patterns
3. **Vector-level pruning**: whole vectors
4. **Kernel-level pruning**: a whole k_h × k_w kernel
5. **Channel-level pruning**: a whole channel

The slides then look at three representatives.

**Fine-grained** (pages 35–37). It is the most flexible and usually gives the highest compression, since it can find "redundant" weights anywhere; the table above comes from fine-grained pruning. The drawback, on page 37: it can be accelerated on some custom hardware (such as EIE) but is hard to accelerate on GPUs.

**Pattern-based: N:M sparsity** (pages 39–42). Remove N of every M consecutive elements. The classic case is 2:4, which is 50% sparsity. The pruned matrix can be stored as the nonzero values plus a 2-bit index per value. The slides cite NVIDIA: the Ampere GPU architecture supports 2:4 sparsity for up to about 2× speedup, and it usually maintains accuracy across many tasks. It is a compromise between regularity and flexibility.

**Channel pruning** (pages 44–46). Reduce the channel count directly. The result is an ordinary network with fewer channels, so any hardware runs it faster. The cost is a smaller compression ratio. Page 45 compares two approaches: a uniform shrink that cuts 30% from every layer, and channel pruning with a different ratio per layer (for example 0.5, 0.3, 0.7, 0.2). Page 46 cites [AMC](https://arxiv.org/abs/1802.03494): at the same latency, per-layer ratios give higher ImageNet accuracy than uniform scaling. How to find those per-layer ratios is the topic of the next lecture.

In short, granularity is a trade-off axis. Finer patterns let you prune more but are harder to accelerate. Coarser patterns accelerate easily but remove less. Which one you choose depends on what your hardware supports.

## Decision 2: criteria

A criterion answers "what do we prune?" The principle on page 49: the less important the removed parameters, the better the pruned network performs. The hard part is defining "important."

Page 49 opens with a small example: y = ReLU(10x₀ − 8x₁ + 0.1x₂). If you may remove only one weight, which one? The intuitive answer is 0.1, because it affects the output least. That is the idea behind magnitude-based pruning.

### Three criteria for pruning weights

**Magnitude-based** (pages 50–53). Weights with larger absolute values are more important.

- Element-wise: importance = |W|. Pruning half of [[3, −2], [1, −5]] keeps 3 and −5
- Row-wise (structured): importance is the L1 norm of a whole row. For the same matrix, row one is |3| + |−2| = 5 and row two is |1| + |−5| = 6, so row one goes
- You can also use the L2 norm (√13 vs. √26), or in general the Lp norm (page 53 cites [Wen et al. 2016](https://arxiv.org/abs/1608.03665))

The fine-grained part of [Lab 1](https://colab.research.google.com/drive/1Fagq3JQBzCizodyxpHKvWDzfCC7F1RWN) implements this criterion.

**Scaling-based** (pages 54–56). This criterion is for filters (output channels) and comes from [Network Slimming](https://arxiv.org/abs/1708.06519). Each output channel gets a trainable scaling factor that multiplies its output, and channels with small factors are pruned. Page 56 points out that no extra parameters are needed: Batch Norm's γ is already one scaling factor per channel and can be used directly.

**Second-order-based** (pages 57–62). This is LeCun's 1989 Optimal Brain Damage: estimate directly how much the loss rises when a weight is removed.

<details>
<summary>Derivation of Optimal Brain Damage</summary>

Expand the change in loss from pruning with a Taylor series:

δL = Σᵢ gᵢ δwᵢ + ½ Σᵢ hᵢᵢ δwᵢ² + ½ Σᵢ≠ⱼ hᵢⱼ δwᵢ δwⱼ + O(‖δW‖³)

Here gᵢ is the first derivative and hᵢⱼ the second derivative (an entry of the Hessian). Optimal Brain Damage makes three assumptions:

1. The objective is nearly quadratic, so terms of third order and above are dropped
2. Training has converged, so the first-order term is zero
3. The errors from deleting each parameter are independent, so the cross terms are zero

What remains is δLᵢ ≈ ½ hᵢᵢ wᵢ². Importance is defined as ½ hᵢᵢ wᵢ², and weights with the smallest error are pruned first.

</details>

Page 62 names the practical obstacle: the Hessian is hard to compute.

### Two criteria for pruning neurons

Page 63 explains that pruning a neuron is coarse-grained weight pruning. In a fully-connected layer, removing a neuron removes one row of the weight matrix; in a conv layer it removes one channel.

**Percentage-of-Zero-based** (pages 64–66). ReLU produces many zeros. Measure the average fraction of zeros in each channel's output (APoZ). The smaller it is, the more often the neuron fires and the more important it is. Page 66 works an example with batch 2, 3 channels, and 4×4 maps, and gets APoZ values of 11/32, 12/32, and 14/32 for the three channels, so channel 2 is pruned first. The method comes from [Network Trimming](https://arxiv.org/abs/1607.03250).

**Regression-based** (pages 67–72). The earlier criteria look at the overall loss or the weights themselves. This one looks at a single layer: after pruning, can this layer's output be reconstructed to match the original? Write the original output as Z = XWᵀ, which splits into a sum of contributions from each input channel. Introduce a coefficient vector β of length cᵢ, where β_c = 0 means channel c is pruned. The problem becomes:

> argmin_{W, β} ‖Z − Σ_c β_c X_c W_cᵀ‖²_F　subject to　‖β‖₀ ≤ N_c

The solution alternates: fix W and solve for β to choose channels, then fix β and solve for W to minimize reconstruction error. The source is [He et al., ICCV 2017](https://arxiv.org/abs/1707.06168).

### The five criteria side by side

| Criterion | Prunes | Looks at | Cost |
|---|---|---|---|
| Magnitude | Weights (elements or structures) | Lp norm of weights | Cheapest |
| Scaling | Output channels | Scaling factors (BN γ works) | Must train the factors |
| Second-order | Weights | ½ hᵢᵢ wᵢ² | Hessian is hard to compute |
| APoZ | Neurons / channels | Fraction of zero outputs | Must run data to collect activations |
| Regression | Channels | Single-layer reconstruction error | Must solve an optimization problem |

## Fall 2026 comparison

The Fall 2026 [L3 slides](https://www.dropbox.com/scl/fi/y5k1ipgvg919hykax33nu/Lec03-Pruning-I.pdf?rlkey=yg3v2oa8r8wfd7oez23b8azlg&st=ilwjkc8u&dl=0) run 71 pages, and the [video](https://www.youtube.com/watch?v=47nNIPj3B98) is up. The three-part structure (intro to pruning, granularity, criteria) matches Fall 2024, and the closing summary is word for word the same. The difference is three pages dropped from the opening: "Today's AI is too BIG," "Efficient Deep Learning Techniques are Essential," and the MLPerf Llama 2 70B pruning case. The charts on the first two already appear in the Fall 2026 L2.

In Fall 2026, Lab 1 became GPU Basics, and the course page and slides disagree on Lab 2's topic (details in the [series entry point](/posts/ai/2026-09-30-mit-65940-course-overview-en)). To practice this lecture's material, the Fall 2024 Lab 1 is currently the only option.

## What you can do tonight

Open the [Fall 2024 Lab 1](https://colab.research.google.com/drive/1Fagq3JQBzCizodyxpHKvWDzfCC7F1RWN), run Setup and the weight-distribution histograms, and do Question 1: what do the per-layer weight distributions have in common, and why does that help pruning? It needs no code, but if you can answer it, you understand why magnitude-based pruning works. The full walkthrough of Lab 1 is in [order 4](/posts/ai/2026-09-30-mit-65940-lab1-pruning-en).

## Further reading

- [Stanford CS336: GPUs and TPUs](/posts/ai/2026-08-22-cs336-gpu-tpu-en): why irregular sparsity is hard to accelerate on GPUs
- [Stanford CS336: inference](/posts/ai/2026-08-22-cs336-inference-en): compression on the LLM inference side

**Series navigation**: previous [Why efficiency matters and how to measure model size and compute](/posts/ai/2026-09-30-mit-65940-basics-efficiency-metrics-en) | next [Pruning II: per-layer ratios and hardware support](/posts/ai/2026-09-30-mit-65940-pruning-ratio-system-support-en) | [Series entry point](/posts/ai/2026-09-30-mit-65940-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Live-checked the official course page: lecture numbers and recording links match and the videos are public, so the status is now “Videos included.”

## References

- [MIT 6.5940 Fall 2024 course page](https://hanlab.mit.edu/courses/2024-fall-65940)
- [Lecture 3 slides: Pruning and Sparsity Part I (Fall 2024)](https://www.dropbox.com/scl/fi/6qspcmk8qayy7mft737gh/Lec03-Pruning-I.pdf?rlkey=9jpifc92be0sitiknpbhn9ggf&st=lml94lam&dl=0)
- [Lecture 3 video (Fall 2024)](https://www.youtube.com/watch?v=EjsB0WgIfUM)
- [Lecture 3 slides (Fall 2026)](https://www.dropbox.com/scl/fi/y5k1ipgvg919hykax33nu/Lec03-Pruning-I.pdf?rlkey=yg3v2oa8r8wfd7oez23b8azlg&st=ilwjkc8u&dl=0)
- [Lecture 3 video (Fall 2026)](https://www.youtube.com/watch?v=47nNIPj3B98)
- [Lab 1: Pruning (Fall 2024, Colab)](https://colab.research.google.com/drive/1Fagq3JQBzCizodyxpHKvWDzfCC7F1RWN)
- [Han et al. (2015). Learning both Weights and Connections for Efficient Neural Networks. NeurIPS](https://arxiv.org/abs/1506.02626)
- [Liu et al. (2017). Learning Efficient Convolutional Networks through Network Slimming. ICCV](https://arxiv.org/abs/1708.06519)
- [Hu et al. (2016). Network Trimming: A Data-Driven Neuron Pruning Approach towards Efficient Deep Architectures](https://arxiv.org/abs/1607.03250)
- [He et al. (2017). Channel Pruning for Accelerating Very Deep Neural Networks. ICCV](https://arxiv.org/abs/1707.06168)
- [He et al. (2018). AMC: AutoML for Model Compression and Acceleration on Mobile Devices. ECCV](https://arxiv.org/abs/1802.03494)
- [Wen et al. (2016). Learning Structured Sparsity in Deep Neural Networks. NeurIPS](https://arxiv.org/abs/1608.03665)
