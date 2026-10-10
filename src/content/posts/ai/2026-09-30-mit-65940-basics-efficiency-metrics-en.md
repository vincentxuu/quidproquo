---
title: "MIT 6.5940 L1–L2 + Lab 0: How Do You Measure a Model's Size? Parameters, Activations, MACs, and Latency"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, ai-course, course-guide, mit, deep-learning, cnn, pytorch, edge-ai]
lang: en
series:
  name: "Reading MIT 6.5940"
  order: 1
tldr: "The first two lectures of 6.5940 show that the problem exists, then hand you the rulers. L1 plots model parameter counts growing much faster than GPU memory, and contrasts 80GB on a cloud GPU with 320kB on a microcontroller. L2 splits efficiency metrics into memory metrics (#parameters, model size, peak activations) and compute metrics (MAC, FLOP, OP). AlexNet has 61M parameters and 724M MACs, and on a microcontroller the thing that runs out first is usually activation memory, not parameters. Lab 0 introduces a VGG variant on CIFAR-10 (9.2M parameters, 606M MACs) that later labs build on."
description: "Guide to MIT 6.5940 Fall 2024 Lectures 1–2 and Lab 0: why efficiency is a problem, the hardware gap from cloud to microcontroller, parameter and MAC formulas for FC, conv, grouped and depthwise layers, peak activations, FLOP vs. FLOPS, latency vs. throughput, plus what Fall 2026 adds (a CNN architecture review and new Lab 0 questions)."
draft: false
glossary:
  - term: "MAC"
    aliases: ["multiply-accumulate", "MACs"]
    definition: "A multiply-accumulate operation a ← a + b·c: one multiplication plus one addition. One MAC equals 2 FLOPs."
    context: "6.5940 L2 uses MACs as its main unit of compute. AlexNet has 724M MACs."
  - term: "peak activation"
    aliases: ["Peak #Activations"]
    definition: "The largest amount of intermediate feature data that must sit in memory at the same time during inference, roughly one layer's input plus output."
    context: "L2 cites MCUNet data showing that the memory bottleneck on microcontrollers is activations, not parameters."
  - term: "FLOPS"
    aliases: ["FLOP/s"]
    definition: "Floating-point operations per second, a unit of hardware speed. FLOP (plural FLOPs) measures a model's amount of compute."
    context: "Page 74 of L2 separates the two with FLOPS = FLOPs / second."
---

> 🌏 [中文版](/posts/ai/2026-09-30-mit-65940-basics-efficiency-metrics)

**Video status: Videos included.** [Source details](#course-video-sources)

> This is post 1 of the [Reading MIT 6.5940](/posts/ai/2026-09-30-mit-65940-course-overview-en) series, based on the Fall 2024 edition. The [series entry point](/posts/ai/2026-09-30-mit-65940-course-overview-en) explains why it does not follow Fall 2026.

Official materials covered here:

- Lecture 1 Introduction: [slides](https://www.dropbox.com/scl/fi/h3ggav4eopxsitqxzf6t2/Lec01-Introduction.pdf?rlkey=hzbpsha72p5e3ed4mdvcgcda5&st=pz5u977e&dl=0) (93 pages), [video](https://youtu.be/U7EPZv8Kh9w)
- Lecture 2 Basics of Neural Networks: [slides](https://www.dropbox.com/scl/fi/pxvvqyq2yu6mwgk79bq5x/Lec02-Basics.pdf?rlkey=tsumfkhrglic55jnjs4yu66ni&st=cmwnvuvn&dl=0) (77 pages), [video](https://youtu.be/I0nKjPpZmMU)
- [Lab 0: PyTorch Tutorial](https://colab.research.google.com/drive/1gvxq7mIAeIBAtmLKH1Q1GknA-GRsK7Q6) (Colab)

Page numbers below are PDF page numbers. The number printed in the slide corner is sometimes off by one or two.

## Course video sources
Rechecked against the live official course page on 2026-10-10: the lecture numbers and recording links match and the videos are public and embeddable.

```youtube
url: https://www.youtube.com/watch?v=U7EPZv8Kh9w
title: EfficientML.ai Lecture 1 - Introduction (MIT 6.5940, Fall 2024)
```

```youtube
url: https://www.youtube.com/watch?v=I0nKjPpZmMU
title: EfficientML.ai Lecture 2 - Basics of Neural Networks (MIT 6.5940, Fall 2024)
```

Original videos: [EfficientML.ai Lecture 1 - Introduction (MIT 6.5940, Fall 2024)](https://www.youtube.com/watch?v=U7EPZv8Kh9w), [EfficientML.ai Lecture 2 - Basics of Neural Networks (MIT 6.5940, Fall 2024)](https://www.youtube.com/watch?v=I0nKjPpZmMU)

Course and recording entries:

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)

Checked: 2026-10-10.

## The problem: models grow faster than hardware

Lecture 1 opens (page 3) with a two-line chart. One line is language-model size: Transformer 0.05B, BERT 0.34B, GPT-2 1.5B, GPT-3 175B, MT-NLG 530B. The other is GPU memory, from 32GB on the V100 to 80GB on the A100. The gap keeps widening, and the chart's caption reads "Model compression bridges the gap." Page 3 of Lecture 2 puts it in one line: Moore's law gives about 2× every two years, while deep learning models grow about 4× every two years.

Outside the cloud the gap is larger. Page 78 of Lecture 1 compares three platforms:

| Platform | Activation memory | Weight storage |
|---|---|---|
| Cloud AI | 80GB | ~TB/PB |
| Mobile AI | 4GB | 256GB |
| Tiny AI (microcontroller) | 320kB | 1MB |

Cloud GPUs and microcontrollers differ by five orders of magnitude in memory. Everything the course covers later (pruning, quantization, NAS, MCUNet) attacks the same question: how do you fit a model into the bottom two rows?

The middle of Lecture 1 walks through many HAN Lab projects: image recognition on phones, person detection on microcontrollers (MCUNet), EfficientViT-SAM, GAN Compression, TinyChat, and LLaMA-2 running on Jetson Orin with AWQ quantization. Each gets its own lecture later, so treat this part as a preview. The last page (page 93) lists the course goals: learn the key efficiency metrics of deep learning computation, accelerate inference and training on resource-constrained platforms, understand the trade-offs between optimization techniques, and deploy an LLM on your own laptop.

## Four items in Lecture 2

The Lecture Plan on page 5 of Lecture 2 has four items:

1. Review neural network terms: neuron, synapse, activation, feature, weight, parameter
2. Review common layers: fully-connected, convolution, grouped convolution, depthwise convolution, pooling, normalization, transformer
3. Introduce efficiency metrics: #Parameters, Model Size, Peak #Activations, MAC, FLOP, FLOPS, OP, OPS, Latency, Throughput
4. Lab 0: PyTorch tutorial

One point from the terminology section matters later. When the course says "prune a synapse" it means pruning a weight. "Prune a neuron" means removing a whole output channel. Both mappings come up constantly in the pruning lectures.

Transformers get only two pages here (pages 39–40). The slides say the full architecture is covered in Lecture 12.

## Layer shapes drive everything

Every metric below is computed from tensor shapes, so learn the notation first. The slides use n for batch size, cᵢ and cₒ for input and output channels, hᵢ/wᵢ and hₒ/wₒ for input and output height and width, k_h and k_w for kernel height and width, and g for the number of groups.

| Layer | Weight shape | Notes |
|---|---|---|
| Fully-connected | (cₒ, cᵢ) | Every output connects to every input |
| 2D Convolution | (cₒ, cᵢ, k_h, k_w) | Each output connects only to inputs in its receptive field; weights are shared |
| Grouped Convolution | (g·cₒ/g, cᵢ/g, k_h, k_w) | Channels split into g groups, each convolved separately with a narrower kernel |
| Depthwise Convolution | (c, k_h, k_w) | g = cᵢ = cₒ; one independent filter per channel |
| Pooling | none | No learnable parameters; stride usually equals kernel size |

The conv output size is hₒ = (hᵢ + 2p − k_h) / s + 1, where p is padding and s is stride (page 33). Page 32 gives the receptive field: L conv layers with kernel size k see L·(k − 1) + 1 pixels. A large image therefore needs many layers before any unit "sees" the whole picture, which is why networks downsample internally.

The normalization page (page 37) draws Batch Norm, Layer Norm, Instance Norm, and Group Norm with the same formula. They differ only in which set of pixels the mean and standard deviation are computed over. The Batch Norm scaling factor γ comes back in the pruning lectures.

## Efficiency metrics: two families

Page 42 splits efficiency metrics into two groups:

- **Memory-related**: #parameters, model size, total/peak #activations
- **Computation-related**: MAC, FLOP/FLOPS, OP/OPS

Together they determine latency and energy. Let's take them in order.

### #Parameters and model size

The parameter count is the number of elements in the weight tensors (ignoring bias):

| Layer | #Parameters |
|---|---|
| Linear | cₒ·cᵢ |
| Convolution | cₒ·cᵢ·k_h·k_w |
| Grouped Convolution | cₒ·cᵢ·k_h·k_w / g |
| Depthwise Convolution | cₒ·k_h·k_w |

The slides work through AlexNet layer by layer (page 56) and arrive at about 61M parameters. The largest layer is the first fully-connected layer: 4096 × (256×6×6) = 37,748,736. That single layer holds about 60% of the total.

Model size is the storage needed for the weights. When every weight uses the same data type, model size = #Parameters × bit width (page 58). AlexNet in 32-bit takes about 244MB; in 8-bit it drops to 61MB. That is the starting point for quantization in Lectures 5–6.

### #Activations: often the real bottleneck

The title of page 60 says it directly: "#Activation is the memory bottleneck in CNN inference, not #Parameters."

The slides cite a comparison from [MCUNet](https://arxiv.org/abs/2007.10319). ResNet-18 and MobileNetV2-0.75 both reach about 70% ImageNet top-1 accuracy. MobileNetV2 has 4.6× fewer parameters, but its peak activation does not shrink with them (page 61 is titled "#Activation didn't improve from ResNet to MobileNet-v2"). Page 62 plots memory use per MobileNetV2 block. The peak is 1372kB against a 256kB microcontroller limit, and it sits in the first few blocks.

Training makes this worse. Page 63 cites [TinyTL](https://arxiv.org/abs/2007.11622): moving from ResNet-50 to MobileNetV2-1.4 cuts parameters by 4.3× but activation memory by only 1.1×.

The AlexNet example (page 65) shows two ways to count:

- **Total #activations**: the sum of every layer's output features. For AlexNet, 932,264
- **Peak #activations**: roughly one layer's input plus output. AlexNet peaks at the first conv layer: input 3×224×224 = 150,528 plus output 96×55×55 = 290,400, for 440,928

AlexNet's parameters live mostly in the fully-connected layers, while its activations pile up in the early conv layers. The two metrics blow up in different places. If you remember one thing from this post, make it that.

### MAC, FLOP, OP

One MAC is a ← a + b·c. A matrix-vector product costs m·n MACs; a matrix-matrix product costs m·n·k (page 67).

<details>
<summary>MAC formulas per layer (batch size 1, bias ignored)</summary>

| Layer | MACs |
|---|---|
| Linear | cₒ·cᵢ |
| Convolution | cᵢ·k_h·k_w·hₒ·wₒ·cₒ |
| Grouped Convolution | cᵢ/g·k_h·k_w·hₒ·wₒ·cₒ |
| Depthwise Convolution | k_h·k_w·hₒ·wₒ·cₒ |

A conv layer's MAC count is its parameter count times the output area hₒ·wₒ, because the same weights are reused at every output position.

</details>

AlexNet totals 724M MACs (page 72). Compare that with the parameter counts. The first conv layer has only 96×3×11×11 = 34,848 parameters (page 56 prints 24,848, but the multiplication gives 34,848), yet it performs 105,415,200 MACs. The first fully-connected layer has 37.7M parameters and also 37.7M MACs. Conv layers have few parameters and lots of compute; fully-connected layers are the reverse.

The next three terms are the easiest to mix up:

- **FLOP**: a multiplication counts as one floating-point operation and an addition counts as another, so 1 MAC = 2 FLOPs. AlexNet has about 724M × 2 = 1.4G FLOPs (page 74)
- **FLOPS**: floating-point operations per second, FLOPS = FLOPs / second. This is hardware speed, not model compute
- **OP/OPS**: activations and weights are not always floating point (after quantization they may be integers), so OP is the generic operation count and OPS is operations per second (page 75)

FLOP and FLOPS differ by one letter: one describes a model, the other describes hardware. Papers and spec sheets often use them loosely, so read the context.

### Latency and throughput

Latency is the delay to finish one task; throughput is how much data you process per unit time. Page 45 contrasts two designs:

| | Latency | Throughput |
|---|---|---|
| Design 1 | 50 ms | 20 image/s |
| Design 2 | 100 ms | 40 image/s |

Design 2 has higher latency and also higher throughput. The slides pose two questions: does high throughput imply low latency, and does low latency imply high throughput? Neither is guaranteed. Parallel processing can raise throughput without making any single task faster.

Page 46 gives an estimate:

> Latency ≈ max(T_computation, T_memory)

T_computation is roughly the model's operation count divided by the processor's operations per second. T_memory is the time to move weights and activations: model size and activation size divided by memory bandwidth. Taking the max assumes compute and data movement overlap; the Fall 2026 slides draw this as a timeline on page 51. The formula ties the earlier metrics together. Parameters and activations set T_memory, and MACs set T_computation.

### Energy: moving data costs more than computing

[Page 47](https://www.dropbox.com/scl/fi/pxvvqyq2yu6mwgk79bq5x/Lec02-Basics.pdf?rlkey=tsumfkhrglic55jnjs4yu66ni&st=cmwnvuvn&dl=0) cites Horowitz's ISSCC 2014 numbers for a 45nm process: a 32-bit integer add costs 0.1 pJ, a 32-bit float multiply 3.7 pJ, a 32-bit SRAM cache read 5 pJ, and a 32-bit DRAM read 640 pJ. One DRAM access costs thousands of times more than an integer add. Compression is not only about fitting in memory: every DRAM access you avoid saves energy.

## Lab 0: the starting point for later labs

[Lab 0](https://colab.research.google.com/drive/1gvxq7mIAeIBAtmLKH1Q1GknA-GRsK7Q6) is a Colab notebook in six sections: Setup, Data, Model, Optimization, Training, Visualization.

- **Data**: CIFAR-10, 10 classes of 3×32×32 color images, batch size 512
- **Model**: a VGG-11 variant (fewer downsamples, smaller classifier). The backbone is 8 conv-bn-relu blocks with 4 max-pool layers in between
- **Efficiency check**: model size estimated from the parameter count, MACs counted with [TorchProfile](https://github.com/zhijian-liu/torchprofile). The notebook states that the model has 9.2M parameters and needs 606M MACs per inference, and says the next few labs will work together on making it more efficient
- **Training**: cross-entropy loss, SGD with momentum, a custom learning-rate scheduler. It takes about 10 minutes and, if all goes well, reaches over 92.5% accuracy

Lab 0 itself is easy. What matters is getting to know this model. The Fall 2024 [Lab 1](https://colab.research.google.com/drive/1Fagq3JQBzCizodyxpHKvWDzfCC7F1RWN) prunes the same VGG on CIFAR-10.

## Fall 2026 comparison

The Fall 2026 [L1 slides](https://www.dropbox.com/scl/fi/yi5oq4f9yzg9sikwcxm3o/Lec01-Introduction.pdf?rlkey=w0zyuyfkm09haqlh7mo2n27ak&st=oe0pir7t&dl=0) (91 pages, [video](https://youtu.be/tY75czj43_4)) have the same structure as Fall 2024. The differences are in the logistics pages at the end; lab and grading changes are covered in the [series entry point](/posts/ai/2026-09-30-mit-65940-course-overview-en).

The [L2 slides](https://www.dropbox.com/scl/fi/42vwbruge0kz3yiuc5un4/Lec02-Basics-of-Neural-Networks.pdf?rlkey=r7o3vatbn8wv5o1n44n2dxizt&st=72q7v2zc&dl=0) (86 pages, [video](https://www.youtube.com/watch?v=CzGTQseaM38)) add three things:

- **One more Lecture Plan item**: "Review convolutional neural networks' architecture: AlexNet, VGG-16, ResNet-50, MobileNetV2," on pages 40–44. The ResNet-50 page draws the bottleneck block (1×1 → 3×3 → 1×1, with N/4 channels in the middle). The MobileNetV2 page draws the inverted bottleneck (1×1 expanding to N×6, then 3×3 depthwise, then 1×1 back to N)
- **A timeline on the latency page** (page 51), showing load input, load weight, compute, and store output overlapping, which is why the estimate takes the max
- **Three new closing pages titled "Today's AI is too BIG"** (pages 81–83). The model-vs-GPU-memory chart on page 81 extends to 2026

The [Fall 2026 Lab 0](https://colab.research.google.com/drive/1PfVYxikSaVpCSD-cnmNLN4l7yx_4odmg) is nearly identical to Fall 2024 but adds two questions: Question 1.1 asks you to complete the model's forward pass, and Question 1.2 asks for the model's best accuracy. It also starts by mounting Google Drive and switching into the lab folder.

## What you can do tonight

1. Open the [Lab 0 Colab](https://colab.research.google.com/drive/1gvxq7mIAeIBAtmLKH1Q1GknA-GRsK7Q6), run through the Model section, and check that the printed parameter and MAC counts match the notebook's 9.2M and 606M.
2. Work out the parameters and MACs of AlexNet's first conv layer by hand (96 filters of 11×11, 3 input channels, 55×55 output), then check against pages 56 and 72. Once you can do this, you will know how to turn a pruning ratio into compute saved in the next lecture.

## Further reading

- [MIT 6.7960 guide](/posts/ai/2026-08-26-mit-67960-deep-learning-guide-en) and [CMU 11-785 guide](/posts/ai/2026-08-22-cmu-11785-course-overview-en): the full story of backpropagation and CNNs
- [Stanford CS231N guide](/posts/ai/2026-09-30-cs231n-course-overview-en): how CNN architectures evolved
- [Stanford CS336: GPUs and TPUs](/posts/ai/2026-08-22-cs336-gpu-tpu-en): latency from the memory-bandwidth angle

**Series navigation**: previous [Series entry point](/posts/ai/2026-09-30-mit-65940-course-overview-en) | next [Pruning I: granularity and criteria](/posts/ai/2026-09-30-mit-65940-pruning-granularity-criteria-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Live-checked the official course page: lecture numbers and recording links match and the videos are public, so the status is now “Videos included.”

## References

- [MIT 6.5940 Fall 2024 course page](https://hanlab.mit.edu/courses/2024-fall-65940)
- [Lecture 1 slides: Introduction (Fall 2024)](https://www.dropbox.com/scl/fi/h3ggav4eopxsitqxzf6t2/Lec01-Introduction.pdf?rlkey=hzbpsha72p5e3ed4mdvcgcda5&st=pz5u977e&dl=0)
- [Lecture 1 video (Fall 2024)](https://youtu.be/U7EPZv8Kh9w)
- [Lecture 2 slides: Basics of Neural Networks (Fall 2024)](https://www.dropbox.com/scl/fi/pxvvqyq2yu6mwgk79bq5x/Lec02-Basics.pdf?rlkey=tsumfkhrglic55jnjs4yu66ni&st=cmwnvuvn&dl=0)
- [Lecture 2 video (Fall 2024)](https://youtu.be/I0nKjPpZmMU)
- [Lab 0: PyTorch Tutorial (Fall 2024, Colab)](https://colab.research.google.com/drive/1gvxq7mIAeIBAtmLKH1Q1GknA-GRsK7Q6)
- [MIT 6.5940 Fall 2026 course page](https://hanlab.mit.edu/courses/2026-fall-65940)
- [Lecture 2 slides (Fall 2026)](https://www.dropbox.com/scl/fi/42vwbruge0kz3yiuc5un4/Lec02-Basics-of-Neural-Networks.pdf?rlkey=r7o3vatbn8wv5o1n44n2dxizt&st=72q7v2zc&dl=0)
- [Lab 0 (Fall 2026, Colab)](https://colab.research.google.com/drive/1PfVYxikSaVpCSD-cnmNLN4l7yx_4odmg)
- [Lin et al. (2020). MCUNet: Tiny Deep Learning on IoT Devices. NeurIPS](https://arxiv.org/abs/2007.10319)
- [Cai et al. (2020). TinyTL: Reduce Activations, Not Trainable Parameters for Efficient On-Device Learning. NeurIPS](https://arxiv.org/abs/2007.11622)
- [TorchProfile](https://github.com/zhijian-liu/torchprofile)
