---
title: "MIT 6.5940 Lecture 7: NAS I — From Hand-Designed Building Blocks to Search Spaces and Search Strategies"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, mit, ai-course, course-guide, neural-architecture-search, deep-learning]
lang: en
series:
  name: "Reading MIT 6.5940"
  order: 8
tldr: "Lecture 7 has three parts. It first reviews fully connected, convolution, grouped, depthwise, and 1×1 convolution layers through their MAC formulas. It then takes apart how the ResNet bottleneck, ResNeXt, MobileNet, MobileNetV2, ShuffleNet, and the Transformer each save compute; the bottleneck, for example, needs 8.5× fewer MACs than a plain 3×3 convolution over 2048 channels. The last part is NAS: search spaces are either cell-level or network-level (depth, resolution, width, kernel size, topology), and there are five search strategies: grid, random, reinforcement learning, gradient descent, and evolution. One arithmetic exercise on the slides shows that the NASNet cell space already holds 3.2×10¹¹ candidates at M=5, N=2, B=5."
description: "A guide to MIT 6.5940 EfficientML (Fall 2024) Lecture 7, Neural Architecture Search Part I: MAC formulas for primitive operations, classic building blocks (ResNet, ResNeXt, MobileNet, MobileNetV2, ShuffleNet, MHSA), NAS search spaces (cell-level, network-level, memory limits in TinyML), and five search strategies (grid, random, RL, DARTS, evolution). Includes Fall 2026 status."
draft: false
glossary:
  - term: "NAS"
    aliases: ["neural architecture search"]
    definition: "Automatically finding the network architecture that scores best on goals such as accuracy and efficiency, by running a search strategy over a predefined set of candidate architectures (the search space)."
    context: "The topic of MIT 6.5940 Lectures 7 and 8 and Lab 3."
  - term: "search space"
    aliases: ["NAS search space"]
    definition: "The set of all candidate architectures NAS may consider, such as the operation each layer can use, depth, width, kernel size, and connectivity."
    context: "Lecture 7 stresses that the search space design itself caps what NAS can find."
---

> 🌏 [中文版](/posts/ai/2026-09-30-mit-65940-nas-search-space-strategy)

**This post is based on [MIT 6.5940](https://hanlab.mit.edu/courses/2024-fall-65940), Fall 2024.** It is part 8 of the [Reading MIT 6.5940](/posts/ai/2026-09-30-mit-65940-course-overview-en) series. Pruning and quantization shrink a network you already have. This lecture takes the other route: design a network that is small and accurate from the start.

**Series**: previous [Lab 2: implementing K-means and linear quantization](/posts/ai/2026-09-30-mit-65940-lab2-quantization-en) | next [Lecture 8: NAS II, hardware-aware and zero-shot NAS](/posts/ai/2026-09-30-mit-65940-nas-hardware-aware-en) | [Series overview](/posts/ai/2026-09-30-mit-65940-course-overview-en)

**Official materials**: [Lec07-Neural-Architecture-Search-I.pdf](https://www.dropbox.com/scl/fi/hxhjhxonwqyw2hfoywzcp/Lec07-Neural-Architecture-Search-I.pdf?rlkey=o6s5dglazyb2o2nrc897ccppg&dl=0) (76 pages; all page numbers below refer to this PDF) and the [Lecture 7 recording](https://www.youtube.com/watch?v=3W146_T8eCs). Access level **A3**: slides and recording are public, and the hands-on work is in [Lab 3](/posts/ai/2026-09-30-mit-65940-lab3-nas-en). Everything below follows the slides, checked on 2026-09-30.

**Fall 2026 comparison**: Fall 2026 Lecture 7 is scheduled for October 1. When I checked the course page on 2026-10-01, neither the slides nor the recording were linked yet.

## Where this lecture sits in the NAS unit

Page 4 outlines the whole NAS unit. Lecture 7 covers only the first half:

- **This lecture**: primitive operations, classic building blocks, what NAS is, search spaces, search space design, search strategies
- **Lecture 8**: performance estimation, hardware-aware NAS, zero-shot NAS, neural-hardware architecture co-search, NAS applications (NLP, GANs, point clouds, pose estimation)

The motivation on page 3 is short. Storage, latency, energy, and accuracy trade off against each other, and the architecture decides where on that trade-off curve you land.

## Part 1: the MAC ledger for primitive operations

Pages 6–14 repackage Lecture 2 as a single table. This table is the tool for every building-block analysis that follows. Batch size is 1 and bias is ignored:

| Operation | MACs |
|---|---|
| Fully connected layer | cₒ · cᵢ |
| Convolution | cₒ · cᵢ · kₕ · k_w · hₒ · wₒ |
| Grouped convolution (g groups) | cₒ · cᵢ · kₕ · k_w · hₒ · wₒ / g |
| Depthwise convolution | cₒ · kₕ · k_w · hₒ · wₒ |
| 1×1 convolution | cₒ · cᵢ · hₒ · wₒ |

How to read it: grouped convolution divides the cost by g. Depthwise is the extreme case where the number of groups equals the number of channels, so cᵢ drops out. A 1×1 convolution has no spatial kernel cost; all that is left is channel mixing.

## Part 2: what each classic building block saves

### ResNet-50 bottleneck: shrink channels, then do the 3×3

Pages 16–22 break down the bottleneck block of [ResNet](https://arxiv.org/abs/1512.03385)-50. It has three steps. A 1×1 convolution cuts the channels by 4× (2048→512), a 3×3 convolution runs on the smaller feature map, and another 1×1 convolution expands back to 2048.

The arithmetic (page 21):

- Bottleneck: 2048×512×H×W + 512×512×H×W×9 + 2048×512×H×W = 512×512×H×W×**17**
- A plain 3×3 over 2048 channels: 2048×2048×H×W×9 = 512×512×H×W×**144**

That is **8.5×** fewer MACs. Page 22 notes the parameter count drops by the same 8.5×.

### ResNeXt: swap the 3×3 for a grouped convolution

Pages 23–25: [ResNeXt](https://arxiv.org/abs/1611.05431) replaces the middle 3×3 of the bottleneck with a 3×3 grouped convolution, which is equivalent to a multi-path block.

### MobileNet: depthwise for space, 1×1 for channels

Pages 26–28: the depthwise-separable block in [MobileNet](https://arxiv.org/abs/1704.04861) splits a regular convolution into two jobs. The depthwise convolution captures spatial information, and the 1×1 convolution fuses information across channels.

### MobileNetV2: the inverted bottleneck

Pages 29–32: depthwise convolution has much less capacity than a regular convolution. [MobileNetV2](https://arxiv.org/abs/1801.04381) flips the bottleneck around. A 1×1 convolution first **expands** the channels 6× (N→6N), then a 3×3 depthwise runs, then a 1×1 shrinks back to N. Depthwise cost grows only linearly with channel count, so the wider middle is affordable.

The slides work one example with N = 160 (page 30). The inverted bottleneck costs 960×H×W×329 MACs, while a regular 3×3 convolution over 160 channels costs 960×H×W×240, a ratio of about 1.37 : 1.

Page 32 then names the price: this design **does not save memory**, in inference or in training, because the 6× expanded activations in the middle take up a lot of space. That thread comes back in the [MCUNet](/posts/ai/2026-09-30-mit-65940-mcunet-tinyml-en) lecture.

### ShuffleNet and the Transformer

- **[ShuffleNet](https://arxiv.org/abs/1707.01083)** (page 33): turns even the 1×1 convolutions into 1×1 grouped convolutions, then uses a channel shuffle so the groups can exchange information.
- **Multi-head self-attention in the Transformer** (pages 34–37): Q, K, and V each get h learned linear projections, scaled dot-product attention runs on each in parallel, and the results are concatenated and projected once more.

<details>
<summary>One table for how the six blocks save compute</summary>

| Block | Core move | What it saves |
|---|---|---|
| ResNet bottleneck | 1×1 shrink → 3×3 → 1×1 expand | Channel count of the 3×3 convolution |
| ResNeXt | 3×3 becomes a grouped convolution | Cross-channel connections in the 3×3 |
| MobileNet | depthwise + 1×1 | Handles space and channels separately |
| MobileNetV2 | 1×1 expand 6× → depthwise → 1×1 shrink | Buys capacity with cheap depthwise |
| ShuffleNet | 1×1 grouped convolution + channel shuffle | Cost of the 1×1 convolutions |
| MHSA | Parallel attention over several projections | (Not a saving; listed as a common block) |

</details>

## Part 3: from hand design to automated search

### Why automate

Pages 39–40 give the reason: the design space is too big. You can choose the number of layers, channel counts, kernel sizes, connectivity, and input resolution, and hand design does not scale. Pages 41–42 put hand-designed networks (Inception, ResNeXt, DenseNet, and others) and searched networks ([EfficientNet](https://arxiv.org/abs/1905.11946), AmoebaNet, [DARTS](https://arxiv.org/abs/1806.09055), [ProxylessNAS](https://arxiv.org/abs/1812.00332), [Once-for-All](https://arxiv.org/abs/1908.09791), and others) on the same ImageNet accuracy-versus-efficiency plot.

The goal of NAS (page 43, citing the [NAS survey](https://arxiv.org/abs/1808.05377) by Elsken et al.): find the best architecture in the search space, the one that maximizes the objectives you care about, such as accuracy and efficiency. This lecture handles the search space and the search strategy. How to evaluate candidates (performance estimation) is left to Lecture 8 (pages 4 and 73).

### Search space: cell-level

Page 44 splits search spaces into cell-level and network-level.

The cell-level example is [NASNet](https://arxiv.org/abs/1707.07012) (pages 45–48). The network is a stack of repeated normal cells and reduction cells, and NAS searches only the inside of a cell. An RNN controller builds the cell step by step. It picks two inputs, picks a transform (convolution, pooling, identity, and so on) for each, then picks how to combine them, and repeats this B times.

Page 48 poses an arithmetic question: with 2 candidate inputs, M transform operations, N combine methods, and B layers, how big is the search space?

<details>
<summary>Answer (page 48)</summary>

Each step chooses the first input (2), the second input (2), the first operation (M), the second operation (M), and the combine method (N), so

```
(2 × 2 × M × M × N)^B = 4^B · M^(2B) · N^B
```

With M = 5, N = 2, B = 5 there are about 3.2 × 10¹¹ candidates.

</details>

### Search space: network-level

Network-level search fixes the block type and searches the shape of the whole network. Pages 49–53 walk through five dimensions:

| Dimension | Slide example |
|---|---|
| Depth | How many blocks each stage repeats (the Once-for-All space, page 49) |
| Resolution | Input image size (page 50) |
| Width | Channel count per stage (page 51) |
| Kernel size | The architectures ProxylessNAS found for mobile and for CPU, with different kernel sizes per layer (page 52) |
| Topology | Downsampling paths in Auto-DeepLab (page 53) |

### The search space needs designing too: the TinyML example

Pages 55–59 use [MCUNet](https://arxiv.org/abs/2007.10319) (TinyNAS), from Song Han's group, to show how much the search space design shapes the NAS result. TinyNAS has two steps: first optimize the search space automatically, then specialize the model under the constraints.

The biggest difference from mobile AI is on pages 56–57. Phones care about latency and energy. Microcontrollers (the slides compare an STM32F746 with an iPhone 11 and an NVIDIA V100) add a hard **memory** limit on top.

To pick a search space (page 58), look at the FLOPs distribution of the models that satisfy the constraints. More FLOPs means more model capacity and a better chance at high accuracy, so you lean toward the space whose qualifying models have higher FLOPs. Page 59 leaves a discussion question: what are the pros and cons of this approach versus how [RegNet](https://arxiv.org/abs/2003.13678) designs its search space? The slide's conclusion is one line: a better search space gives better final accuracy.

## Search strategies: five ways to explore

Page 61 lists five strategies.

| Strategy | How it works | Slide example |
|---|---|---|
| Grid search | Take the Cartesian product of each dimension's options and train every candidate from scratch | A 3×3 grid of resolution × width at 1.0x/1.1x/1.2x, marking which points exceed the latency limit (page 62); EfficientNet grid-searches α, β, γ for compound scaling so that FLOPs roughly double (page 63) |
| Random search | Sample candidates at random, compared against grid search | Page 64 |
| Reinforcement learning | Train an RNN controller with RL; it emits architecture descriptions | [Zoph & Le 2017](https://arxiv.org/abs/1611.01578) (page 65) |
| Gradient descent | Relax "which operation" into a softmax-weighted sum of all operations so the architecture parameters are differentiable | DARTS (page 66); ProxylessNAS adds a differentiable latency term (page 67) |
| Evolution | Keep, mutate, and cross over candidates by fitness | Once-for-All (pages 69–72) |

Two details are worth a second look:

- **How latency becomes differentiable** (page 67): measuring latency on real hardware is slow and expensive. ProxylessNAS builds a latency model for each candidate operation (a regressor or a lookup table). The expected latency of a block is the sum of each operation's latency weighted by the architecture parameters, so you can take gradients with respect to those parameters.
- **The three evolutionary operations** (pages 69–72): the fitness function weighs accuracy and efficiency together. A mutation can change the depth of a stage or the operation of one layer (for example, swap a 3×3 for a 5×5). A crossover picks each layer's operation at random from one of the two parents.

**How to use this**: when you read a NAS paper, split it into three columns: what the search space is, which strategy it uses, and how candidates are evaluated. Most papers contribute to only one column, and once you split them it is easier to see what is new relative to earlier work.

## How to self-study this lecture

1. Use the MAC table from Part 1 to recompute the 17 and 144 for the bottleneck on page 21, and the 329 and 240 for MobileNetV2 on page 30. Do it once and you can estimate the cost of any new block yourself.
2. Compute the search space size on page 48 yourself and see why exhaustive search is out of the question.
3. Map the five strategies onto [Lab 3](/posts/ai/2026-09-30-mit-65940-lab3-nas-en): Lab 3 asks you to implement random search and evolutionary search.

One thing to do tonight: write a ResNet bottleneck and a MobileNetV2 inverted bottleneck in PyTorch, run each through `torchprofile.profile_macs`, and compare the numbers with the formulas on the slides.

## Further reading

- Series entry point and course status: [Reading MIT 6.5940 (series overview)](/posts/ai/2026-09-30-mit-65940-course-overview-en)
- First introduction to efficiency metrics and building blocks: [Lectures 1–2 + Lab 0](/posts/ai/2026-09-30-mit-65940-basics-efficiency-metrics-en)
- Another take on CNN architectures: [CMU 11-785 CNN unit](/posts/ai/2026-08-22-cmu-11785-09-cnn-one-en)
- Transformers from scratch: [CMU 11-785 attention and Transformers](/posts/ai/2026-08-22-cmu-11785-18-attention-transformers-en)

## References

- [MIT 6.5940 Fall 2024 course page](https://hanlab.mit.edu/courses/2024-fall-65940) — lecture schedule, slide and recording links
- [Lec07-Neural-Architecture-Search-I.pdf (Fall 2024)](https://www.dropbox.com/scl/fi/hxhjhxonwqyw2hfoywzcp/Lec07-Neural-Architecture-Search-I.pdf?rlkey=o6s5dglazyb2o2nrc897ccppg&dl=0) — every page number, formula, and figure in this post
- [EfficientML.ai Lecture 7 - Neural Architecture Search Part I (MIT 6.5940, Fall 2024)](https://www.youtube.com/watch?v=3W146_T8eCs) — official recording
- [MIT 6.5940 Fall 2026 course page](https://hanlab.mit.edu/courses/2026-fall-65940) — Fall 2026 Lecture 7 schedule
- [Elsken, Metzen & Hutter, Neural Architecture Search: A Survey (arXiv:1808.05377)](https://arxiv.org/abs/1808.05377) — the three-component NAS framework
- [Zoph et al., Learning Transferable Architectures for Scalable Image Recognition (arXiv:1707.07012)](https://arxiv.org/abs/1707.07012) — NASNet cell-level search space
- [Zoph & Le, Neural Architecture Search with Reinforcement Learning (arXiv:1611.01578)](https://arxiv.org/abs/1611.01578) — RL search strategy
- [Liu, Simonyan & Yang, DARTS: Differentiable Architecture Search (arXiv:1806.09055)](https://arxiv.org/abs/1806.09055) — gradient-descent search strategy
- [Cai, Zhu & Han, ProxylessNAS (arXiv:1812.00332)](https://arxiv.org/abs/1812.00332) — differentiable latency term, kernel-size dimension
- [Cai et al., Once-for-All (arXiv:1908.09791)](https://arxiv.org/abs/1908.09791) — network-level search space and evolutionary search
- [Lin et al., MCUNet: Tiny Deep Learning on IoT Devices (arXiv:2007.10319)](https://arxiv.org/abs/2007.10319) — TinyNAS search space design
- [Sandler et al., MobileNetV2 (arXiv:1801.04381)](https://arxiv.org/abs/1801.04381) — inverted bottleneck
