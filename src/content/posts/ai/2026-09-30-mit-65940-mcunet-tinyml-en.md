---
title: "MIT 6.5940 L10 MCUNet: Running Neural Networks on a Microcontroller with 320kB of SRAM"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, ai-course, mit, tinyml, edge-ai, on-device-ai]
lang: en
series:
  name: "Reading MIT 6.5940"
  order: 12
tldr: "An MCU has roughly 256–320kB of SRAM and 1MB of Flash, tens of thousands of times less than a phone. Even an int8 MobileNetV2 needs 5x more peak memory than that. Lecture 10 answers with MCUNet: TinyNAS picks a search space before searching for a subnet, and MCUNetV2's patch-based inference cuts MobileNetV2's peak SRAM from 1372kB to 172kB. The lecture closes with tinyML applications in vision, audio, and anomaly detection."
description: "A guide to Lecture 10 of MIT 6.5940 Fall 2024, MCUNet and TinyML: what tinyML is and why memory is the binding constraint, how to estimate Flash and SRAM use, why MobileNetV2 shrinks parameters but not activations, TinyNAS's two-stage search, MCUNetV2's patch-based inference and the halo problem, plus visual wake words, keyword spotting, and autoencoder anomaly detection."
draft: false
glossary:
  - term: "tinyML"
    aliases: ["TinyML", "Tiny AI"]
    definition: "Deploying deep learning models on microcontrollers (MCUs) and similar devices with kilobytes of memory and milliwatt power budgets. 6.5940 Lecture 10 places it at the far end of a Cloud AI → Mobile AI → Tiny AI spectrum."
    context: "The topic of MIT 6.5940 Lecture 10."
  - term: "peak SRAM"
    aliases: ["peak activation memory"]
    definition: "The largest amount of activation data held in SRAM at once during inference. Lecture 10's simplified estimate is input activation plus output activation per layer, maximized over layers. Weights live in Flash and can be fetched in parts, so they are not counted."
    context: "On an MCU this, more often than parameter count, decides whether a model fits."
  - term: "patch-based inference"
    aliases: ["per-patch inference"]
    definition: "MCUNetV2's technique: for the memory-heavy early layers, compute the feature map one small spatial patch at a time instead of all at once, then stitch the results. Peak SRAM drops; the cost is recomputing the overlap (halo) between neighboring patches."
    context: "Lecture 10 slides, pages 51–72."
---

> 🌏 [中文版](/posts/ai/2026-09-30-mit-65940-mcunet-tinyml)

> **Version note**: This post is based on Lecture 10 (2024-10-08) of [MIT 6.5940 Fall 2024](https://hanlab.mit.edu/courses/2024-fall-65940). The main materials are [Lec10-MCUNet.pdf](https://www.dropbox.com/scl/fi/udgt7c6sw5wpvrbh7us2t/Lec10-MCUNet.pdf?rlkey=sryh8aiehv8792uk1ocu00icn&st=8v4oql2g&dl=0) (93 pages) and the [lecture recording](https://youtu.be/uR1KKhIhHEk). Page numbers refer to PDF pages. Facts were checked against the official materials on 2026-09-30. Access level **A3**: slides, video, and the Lab 3 released that week are all public. What you can't get is Canvas submission and grading feedback.
>
> **Fall 2026 comparison**: The [F26 schedule](https://hanlab.mit.edu/courses/2026-fall-65940) puts the same lecture on October 15. As of 2026-09-30 its slide and video links are still empty.

**Series**: previous [L9 Knowledge Distillation](/posts/ai/2026-09-30-mit-65940-knowledge-distillation-en) | next [L11 TinyEngine and Parallel Computing](/posts/ai/2026-09-30-mit-65940-tinyengine-parallel-computing-en) | [Series overview](/posts/ai/2026-09-30-mit-65940-course-overview-en)

The first nine lectures (pruning, quantization, NAS, distillation) all answer the question "how do we make a model smaller?" Lecture 10 asks a different one: how small is small enough? That depends on the chip you deploy to. This lecture picks the most extreme target: a microcontroller (MCU). That's a chip that may cost a few dollars, has no operating system, and measures its SRAM in kilobytes.

The Lecture Plan on page 2 has four items: what tinyML is, its challenges, tiny neural network design, and applications (vision, audio, time series and anomaly detection). This post follows that order.

## What tinyML is: shrinking from the cloud to IoT

Song Han opens with a spectrum (pages 5–8): **Cloud AI → Mobile AI → Tiny AI**. The cloud runs on GPUs and TPUs, with data uploaded for inference. Mobile runs on phones. One step further down are the microcontrollers inside IoT devices.

Why go that small? Pages 9–12 give four reasons:

- **Scale**: billions of MCU-based IoT devices exist worldwide.
- **Cost**: roughly $0.1–$10 per unit. The slide's phrasing is that low-income people can afford access: "Democratize AI."
- **Power**: milliwatt-level, which the slide ties to green AI and lower carbon.
- **Breadth**: smart homes, smart manufacturing, personalized healthcare, precision agriculture.

## The challenge: memory tens of thousands of times smaller than a phone

Pages 13–16 hold the numbers the whole lecture depends on. The slides put the three platforms side by side:

| | Cloud AI | Mobile AI | Tiny AI |
|---|---|---|---|
| Memory (activations) | 32GB | 4GB | 320kB |
| Storage (weights) | ~TB/PB | 256GB | 1MB |

Going from phone to MCU, activation memory shrinks by about 13,000x and weight storage by about 100,000x. Page 16's conclusion: **you have to shrink both weights and activations**. Page 17 adds that mobile AI worries about latency and energy, while tinyML adds a third constraint on memory.

### Estimating how much memory a CNN needs

Pages 20–23 give a simplified estimate. The slide notes it ignores temporary buffers and code size for now. It treats the two kinds of memory separately:

- **Flash usage = model size.** It's static: the whole model has to fit.
- **SRAM usage = input activation + output activation.** It's dynamic and differs per layer. What matters is the **peak**. Weights aren't counted because they can be fetched from Flash in parts.

The slides use two boards as examples: the Arduino Nano 33 BLE Sense (256KB SRAM, 1MB Flash) and the STM32 F746ZG (320KB SRAM, 1MB Flash).

Measure off-the-shelf models this way and page 24 is blunt. Against a 320kB limit, ResNet-50's peak SRAM is 23x over, MobileNetV2 is 22x over, and even int8 MobileNetV2 is still 5x over.

Pages 25–26 point out something counterintuitive: **MobileNetV2 shrinks parameters but not peak activation**. At about 70% ImageNet top-1, with ResNet-18 as the baseline (computed in int8), MobileNetV2-0.75 cuts parameters by 4.6x but peak activation by only 1.8x. MCUNet cuts them by 6.1x and 3.4x. This is the peak activation metric from Lectures 1–2, and on an MCU it becomes the first thing to check.

## Tiny neural network design: MCUNet

### Co-designing the system and the algorithm

Pages 29–31 split earlier work into two approaches:

- (a) Search for a model on top of an existing inference library, e.g. [ProxylessNAS](https://arxiv.org/abs/1812.00332) or MnasNet.
- (b) Fix the model and tune the library, e.g. TVM.

[MCUNet](https://arxiv.org/abs/2007.10319) is option (c): optimize **TinyNAS** (architecture search) and **TinyEngine** (compiler and runtime) together. TinyEngine is the subject of the [next lecture](/posts/ai/2026-09-30-mit-65940-tinyengine-parallel-computing-en). Page 34 says "Will introduce in lecture 17", which looks like a leftover from an older schedule; in F24 it's Lecture 11.

### TinyNAS stage 1: pick the right search space first

Pages 36–38 set up the problem. The quality of the search space largely decides how good the searched model is. Reusing a mobile search space (e.g. the MnasNet space) fails: even the **smallest** subnet in it won't fit on an MCU, because 320KB and 4GB are too far apart. So you need a search space chosen for the IoT device. The question is how to choose it.

Pages 39–41 use two knobs: input resolution R and width multiplier W. The original space at R=224, W=1.0 suits phones. Scaled up to R=260, W=1.4 it suits GPUs (citing [Once-for-All](https://arxiv.org/abs/1908.09791)). Which R and W should MCUs with 256kB, 320kB, or 512kB use?

Pages 44–45 give the criterion. In each candidate space, randomly sample models that **satisfy the memory constraint** and look at their FLOPs distribution. More FLOPs means more model capacity and a better chance of high accuracy. The slides compare two spaces: in the good one, 20% of models exceed 50M FLOPs; in the bad one, 20% exceed only 32M FLOPs. So you pick the first.

Page 47 summarizes the best configurations it found:

- **More Flash, same SRAM** → more channels, lower resolution.
- **More SRAM, same Flash** → higher resolution.

You can derive this from the estimate above. Channel count mostly costs weights (Flash); resolution mostly costs activations (SRAM).

### TinyNAS stage 2: search for a subnet within the space

Page 48: one-shot NAS with weight sharing. Train a super network, randomly sample subnets and fine-tune them jointly; small child networks are nested inside larger ones. It's the same toolkit as [the NAS lectures (L7–L8)](/posts/ai/2026-09-30-mit-65940-nas-hardware-aware-en) and [Lab 3](/posts/ai/2026-09-30-mit-65940-lab3-nas-en). In F24, Lab 3 went out on the day of Lecture 10, and it uses the Visual Wake Words dataset.

Page 49 compares peak memory in the first two stages. Compared with MobileNetV2, the TinyNAS network has a more uniform peak per block (the chart marks gaps of 1.6x and 2.2x), so a larger model fits in the same memory. Page 50 compares against MobileNetV2, ProxylessNAS, and others on VWW. The slide's conclusion: higher accuracy, 3x faster inference, 4x smaller memory cost.

### MCUNetV2: compute the most crowded stretch in small tiles

Pages 51–53 look at MobileNetV2's SRAM use per block and find it very uneven: high in the first few blocks, low afterward. The peak is 1372kB, about 8x the 256kB limit. Lower the early stage and the overall peak comes down.

[MCUNetV2](https://arxiv.org/abs/2110.15352) does this with **patch-based inference** (pages 54–57). Instead of computing the full feature map layer by layer in the early stage, it splits the input into small patches, runs each through the early stage, and stitches the results. For the same MobileNetV2, peak memory drops from 1372kB to 172kB. Page 58 measures four models on an STM32F746 against a TinyEngine baseline: peak SRAM drops by 4.1–5.9x.

Pages 59–62 show the cost. Neighboring patches overlap (the halo), so that region gets computed twice, and the overlap grows with the receptive field. There are two fixes:

1. **Network redistribution** (pages 63–64): applying patch-based inference directly to MobileNetV2 adds 10% MACs. After redistributing the network, the slides say the overhead is negligible, with the same performance on image classification and object detection.
2. **Joint search of architecture and schedule** (page 65): put the number of patches and how many layers run per-patch into the same search space as layer count, channel count, and kernel size.

Pages 69–72 dissect a searched VWW architecture and draw three design rules. Kernels are small in the per-patch stage, to reduce overlap. The expansion ratio is small in the middle stage to cap peak memory and large in later stages to boost accuracy. And resolution-sensitive datasets like VWW get larger inputs (MCUNet used 128×128).

## Applications: vision, audio, time series

### Vision

Page 75: with int4 quantization, MCUNet reaches 70.7% ImageNet top-1, which the slide calls the first result above 70% on commercial MCUs. The four STM32 parts range from 256kB/1MB to 512kB/2MB of SRAM/Flash.

**Visual wake words** on page 76 are the more practical use. The slide calls it the vision counterpart of "Hey Siri". A small model on the MCU only checks whether a person is in front of the camera. Only then does it wake the much larger face recognition model, which saves a lot of energy. The dataset comes from [Chowdhery et al. 2019](https://arxiv.org/abs/1906.05721).

Object detection is more sensitive to resolution because it makes dense predictions. Pages 78–80 explain that patch-based inference fits larger input resolutions, which makes face/mask detection and person detection possible on an MCU. Page 81 previews training on an MCU ([On-Device Training Under 256KB Memory](https://arxiv.org/abs/2206.15472)), left for [Lecture 21](/posts/ai/2026-09-30-mit-65940-on-device-training-en).

### Audio: keyword spotting

Page 84 lays out the keyword spotting pipeline, citing [Hello Edge](https://arxiv.org/abs/1711.07128). Cut the audio into overlapping frames of length l with stride s, giving T = (L − l)/s + 1 frames. Convert them to frequency-domain features. Then a neural network outputs class probabilities. Page 85 explains why CNNs beat fully connected DNNs here. Speech spectra are strongly correlated in time and frequency, and DNNs ignore that. DNNs also don't model the translational shifts that different speaking styles cause. Page 86 applies MCUNet's hardware-software co-design to speech commands.

### Time series: catching anomalies with an autoencoder

Pages 88–91: train an autoencoder to reconstruct normal data. In deployment, if reconstruction error exceeds a threshold, flag an anomaly. The slides list three properties: it needs no labels, it only works on data similar to the training set, and reconstruction is lossy. Page 92's example detects fan anomalies on an Arduino Nano 33 BLE Sense (256KB SRAM, 1MB Flash, Cortex-M4 at 64MHz), listing K-means, autoencoders, and GMMs as common approaches.

## What to do after this lecture

- **Tonight**: take a small model you have and use the estimate from pages 22–23. For each layer, add up input and output activation by hand and find where the peak falls. It's usually early in the network, which is exactly the problem MCUNetV2 targets.
- To get hands-on: the [MCUNet repo](https://github.com/mit-han-lab/mcunet) is the official implementation, and [Lab 3](/posts/ai/2026-09-30-mit-65940-lab3-nas-en) practices supernet search on VWW.
- For how the system layer pushes peak memory down further (in-place depthwise, memory layout), read [L11 TinyEngine](/posts/ai/2026-09-30-mit-65940-tinyengine-parallel-computing-en) next.

## Further reading

- CNN basics and MobileNet-style building blocks: [CS231N L5: Image Classification with CNNs](/posts/ai/2026-09-30-cs231n-cnn-image-classification-en)
- This series' two NAS lectures: [L7 Search Space and Strategy](/posts/ai/2026-09-30-mit-65940-nas-search-space-strategy-en), [L8 Hardware-Aware NAS](/posts/ai/2026-09-30-mit-65940-nas-hardware-aware-en)
- Metric definitions (#Params, peak activation): [L1–L2 Efficiency Metrics](/posts/ai/2026-09-30-mit-65940-basics-efficiency-metrics-en)

## References

- [MIT 6.5940 Fall 2024 course page](https://hanlab.mit.edu/courses/2024-fall-65940): L10 date, slide and video links, Lab 3 release date
- [MIT 6.5940 Fall 2026 course page](https://hanlab.mit.edu/courses/2026-fall-65940): L10 scheduled for October 15, materials not yet released
- [Lec10-MCUNet.pdf (Fall 2024)](https://www.dropbox.com/scl/fi/udgt7c6sw5wpvrbh7us2t/Lec10-MCUNet.pdf?rlkey=sryh8aiehv8792uk1ocu00icn&st=8v4oql2g&dl=0): source of every page number and figure in this post
- [EfficientML.ai Lecture 10 - MCUNet and TinyML (YouTube)](https://youtu.be/uR1KKhIhHEk)
- [Lin et al., MCUNet: Tiny Deep Learning on IoT Devices (NeurIPS 2020)](https://arxiv.org/abs/2007.10319): some Lecture 10 slides label it NeurIPS 2019
- [Lin et al., MCUNetV2: Memory-Efficient Patch-based Inference for Tiny Deep Learning (NeurIPS 2021)](https://arxiv.org/abs/2110.15352)
- [Cai et al., ProxylessNAS (ICLR 2019)](https://arxiv.org/abs/1812.00332)
- [Cai et al., Once-for-All (ICLR 2020)](https://arxiv.org/abs/1908.09791)
- [Chowdhery et al., Visual Wake Words Dataset (2019)](https://arxiv.org/abs/1906.05721)
- [Zhang et al., Hello Edge: Keyword Spotting on Microcontrollers (2017)](https://arxiv.org/abs/1711.07128)
- [Lin et al., On-Device Training Under 256KB Memory (NeurIPS 2022)](https://arxiv.org/abs/2206.15472)
- [mit-han-lab/mcunet (GitHub)](https://github.com/mit-han-lab/mcunet)
