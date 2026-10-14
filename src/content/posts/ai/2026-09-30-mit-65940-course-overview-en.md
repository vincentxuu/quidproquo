---
title: "Efficient AI: A Learning Path from Model Compression to Hardware Deployment | MIT 6.5940 Course Overview"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, ai-course, course-guide, mit, quantization, edge-ai, llm-inference]
lang: en
math: true
series:
  name: "Reading MIT 6.5940"
  order: 0
tldr: "MIT 6.5940 teaches how to make models smaller and faster and fit them onto laptops and microcontrollers, in four chapters: efficient inference (pruning, quantization, NAS, distillation, MCUNet and TinyEngine), domain-specific optimization (LLM deployment and post-training, long context, ViTs, diffusion), efficient training (distributed and on-device), and quantum ML. It covers algorithms and systems together, and ends with running Llama2-7B on your own laptop. This series follows Fall 2024, whose 23 lecture recordings and Labs 0–5 are all public, with slides for all but the quantum ML part of Lecture 22."
description: "Entry point for the MIT 6.5940 series: what each lecture in the four chapters teaches, a hand calculation of LLM memory and 4-bit linear quantization, prerequisites and self-check questions, three reading routes with the materials available outside MIT, and the 25-post series contents."
draft: false
glossary:
  - term: "sabbatical"
    definition: "A period in which a professor pauses teaching to focus on research."
    context: "6.5940 was not offered in Fall 2025 because Song Han was on sabbatical, so this series uses Fall 2024."
  - term: "EfficientML.ai"
    aliases: ["efficientml.ai"]
    definition: "The course brand and URL of MIT 6.5940. It redirects to MIT HAN Lab's course page, and every lecture video title starts with \"EfficientML.ai Lecture N\"."
    context: "The slide covers and video titles cited in this series use this name."
---

> 🌏 [中文版](/posts/ai/2026-09-30-mit-65940-course-overview)

**Video status: Videos included.** The intro embeds the Lecture 1 recording (1 h 6 min); each lecture's recording is in its own post. [Source details](#course-video-sources)

[MIT 6.5940](https://hanlab.mit.edu/courses/2024-fall-65940) (TinyML and Efficient Deep Learning Computing) is a graduate course taught by [Song Han](https://songhan.mit.edu), at [efficientml.ai](https://efficientml.ai). It tackles a practical problem: models are growing faster than hardware. A cloud GPU has 80 GB of memory and a microcontroller a few hundred KB, so how do you shrink and speed up a model to fit it on a laptop, a phone, or a microcontroller?

What sets this course apart from a typical deep learning course is that it covers algorithms and systems together. Which weights to prune and how many bits to store a number in are algorithm questions; whether pruning actually makes things faster and how memory is laid out are systems questions. Both have to be right for a model to really get smaller and faster on hardware. The hands-on goal is concrete: deploy Llama2-7B on your own laptop.

This post is the series entry point. It lays out what each lecture in the four chapters teaches, works the memory and 4-bit quantization of an LLM by hand, and ends with a prerequisite check and reading routes. Below is the Lecture 1 recording, on why efficient AI is needed and the map of the whole course, the same map the storyline section draws; watch it before reading or after.

```youtube
url: https://www.youtube.com/watch?v=U7EPZv8Kh9w
title: EfficientML.ai Lecture 1 - Introduction (MIT 6.5940, Fall 2024)
```

## The storyline: measuring tools plus four chapters

### Measuring tools (Lectures 1–2)

[Lectures 1–2](/posts/ai/2026-09-30-mit-65940-basics-efficiency-metrics-en) supply the measuring tools: memory is parameter count, model size, and peak activations; compute is MACs and FLOPs. AlexNet has 61M parameters and 724M MACs; on a microcontroller, what runs out first is often activation memory, not parameters. Every later lecture measures its savings with these tools.

### Chapter I: efficient inference (Lectures 3–11)

- **Pruning** ([Lecture 3](/posts/ai/2026-09-30-mit-65940-pruning-granularity-criteria-en), [Lecture 4](/posts/ai/2026-09-30-mit-65940-pruning-ratio-system-support-en)): remove unimportant weights. The more regular the pruning (whole channels), the easier it is to speed up on hardware, but the less you can prune; 2:4 sparsity, in between, is up to 2× faster on NVIDIA Ampere GPUs. Per-layer pruning ratios come from sensitivity analysis, followed by fine-tuning at a small learning rate.
- **Quantization** ([Lecture 5](/posts/ai/2026-09-30-mit-65940-quantization-basics-en), [Lecture 6](/posts/ai/2026-09-30-mit-65940-quantization-ptq-qat-en)): store numbers in fewer bits. Linear quantization $r = S(q - Z)$ turns matrix multiplication into integer arithmetic; when accuracy drops, first use finer scale granularity (per-channel, group) or clip outliers, and if that is not enough, retrain with QAT.
- **NAS** ([Lecture 7](/posts/ai/2026-09-30-mit-65940-nas-search-space-strategy-en), [Lecture 8](/posts/ai/2026-09-30-mit-65940-nas-hardware-aware-en)): Lecture 7 first looks at how hand-designed architectures save compute; ResNet's bottleneck, for example, uses a 1×1 convolution to cut the channel count before the 3×3, needing 8.5× fewer MACs than doing it directly on 2048 channels. Then search replaces hand design: within a space of depths, widths, resolutions, and kernel sizes, random search, reinforcement learning, gradients, or evolution find architectures that are small and accurate. Lecture 8 tackles the most expensive step, evaluating candidates; Once-for-All trains one supernet whose $10^{19}$ subnetworks need no separate training.
- **Distillation** ([Lecture 9](/posts/ai/2026-09-30-mit-65940-knowledge-distillation-en)): have a small model learn a large model's output distribution. Raising the temperature turns the teacher's "cat vs. dog" output from 0.982/0.017 into 0.599/0.401, so the small model can learn how similar the classes are.
- **TinyML** ([Lecture 10](/posts/ai/2026-09-30-mit-65940-mcunet-tinyml-en), [Lecture 11](/posts/ai/2026-09-30-mit-65940-tinyengine-parallel-computing-en)): a microcontroller has only about 256–320 kB of SRAM. MCUNet picks the search space before searching for a subnetwork, and patch-based inference cuts peak memory from 1372 kB to 172 kB; TinyEngine squeezes more out at the systems level: loop reordering and tiling keep data in cache, and in-place depthwise convolution writes the output over the input, saving a copy of the activation memory.

### Chapter II: domain-specific optimization (Lectures 12–18)

- **LLMs** ([Lecture 12](/posts/ai/2026-09-30-mit-65940-transformer-llm-primer-en), [Lecture 13](/posts/ai/2026-09-30-mit-65940-llm-deployment-en)): attention is $O(N^2)$ and the KV cache grows linearly with length; GQA and MQA let several heads share KV. Deployment follows three paths: quantization (SmoothQuant moves the difficulty of activation outliers into the weights, AWQ protects about 1% of important weights with scaling to go 4-bit), sparsity (use only part of the parameters or tokens), and serving (PagedAttention, speculative decoding).
- **Post-training and long context** ([Lecture 14](/posts/ai/2026-09-30-mit-65940-llm-post-training-en), [Lecture 15](/posts/ai/2026-09-30-mit-65940-long-context-llm-en)): LoRA fine-tunes through a low-rank branch that merges back into the weights, and QLoRA also quantizes the backbone to 4-bit; StreamingLLM found that the first few tokens act as an attention sink, and keeping them plus a recent window keeps very long generation stable.
- **Vision and generation** ([Lectures 16–17](/posts/ai/2026-09-30-mit-65940-efficient-vision-gan-video-pointcloud-en), [Lecture 18](/posts/ai/2026-09-30-mit-65940-diffusion-efficiency-en)): ViT cost grows with the square of resolution, which window attention and linear attention bring down; Lecture 17 targets three kinds of redundancy: GAN generators repeat a lot of computation across space (GAN Compression uses distillation plus NAS to decide how many channels each layer keeps), adjacent video frames are nearly identical (TSM models time by just shifting features along the time axis, at zero extra FLOPs), and point clouds are mostly empty (compute only where points exist). Diffusion is slow because it runs dozens to thousands of steps, and the speedups are fewer steps, less compute per step, and splitting across GPUs.

### Chapter III: efficient training (Lectures 19–21)

[Lectures 19–20](/posts/ai/2026-09-30-mit-65940-distributed-training-en): GPT-3's fp16 weights alone are 350 GB, too big for one 80 GB card, so training is split: data parallelism, ZeRO spreading optimizer state across cards, pipeline and tensor parallelism, and then the communication bottleneck that splitting creates (gradient compression). [Lecture 21](/posts/ai/2026-09-30-mit-65940-on-device-training-en) trains on the device itself: training costs more than inference because activations must be stored; approaches include tuning only biases plus a lightweight residual (TinyTL) and updating only important layers and channels (sparse update), and PockEngine stacks these with int8 training and compile-time optimization to bring training memory down to 141 KB on a 256 KB microcontroller.

### Chapter IV: summary and quantum ML (Lectures 22–23)

[The last post](/posts/ai/2026-09-30-mit-65940-course-summary-quantum-ml-en) redraws the whole course as inference, training, and application-specific work along algorithm and system axes, then replays supernets and magnitude pruning on quantum circuits.

## Work it by hand: fitting Llama2-7B on an 8 GB laptop

This is a teaching example written for this post, to see how Lecture 2's measuring tools connect with the quantization in Lectures 5 and 13.

**First, memory.** Llama2-7B has about 7 billion parameters. In fp16 each takes 2 bytes, so the weights alone are $7 \times 10^9 \times 2 = 14$ GB. Lab 5's minimum is a laptop with 8 GB of memory, which can't hold that. In 4-bit each parameter takes 0.5 bytes, so the weights shrink to $7 \times 10^9 \times 0.5 = 3.5$ GB, and even with the KV cache and runtime activations added, there is a chance of fitting into 8 GB.

**Next, quantize one number.** With symmetric 4-bit quantization ($Z = 0$; the 4-bit integer range is −8 to 7, and here −8 is dropped so only −7 to 7 is used, keeping it symmetric), if a group of weights has a maximum absolute value of 1, the scale is $S = 1/7 \approx 0.143$. The weight 0.3 becomes $q = \text{round}(0.3 / 0.143) = \text{round}(2.1) = 2$, which dequantizes to $2 \times 0.143 \approx 0.286$, an error of about 0.014.

**The outlier problem.** If the same group has one weight equal to 8, the scale becomes $8/7 \approx 1.143$. Now 0.3 quantizes to $\text{round}(0.26) = 0$, and the information is gone, as it is for every other small weight in the group.

**What this means:** 4-bit cuts memory to a quarter, but a single outlier can zero out a whole group of small values. Lecture 6's per-channel and group quantization use finer scales so an outlier only affects its own group; Lecture 13's AWQ and SmoothQuant deal specifically with outliers in LLMs. Quantization is not just using fewer bits; the hard part is deciding who shares a scale.

## Prerequisites and self-check

- **Python and PyTorch**: Lab 0 is a PyTorch tutorial; catch up first if it feels hard.
- **Backpropagation and CNNs**: Lecture 2 only reviews terms and layer shapes and does not teach how training works. If that is new to you, read the [MIT 6.7960 guide](/posts/ai/2026-08-26-mit-67960-deep-learning-guide-en) or the [CMU 11-785 guide](/posts/ai/2026-08-22-cmu-11785-course-overview-en) first.
- **Basic computer architecture**: the 6.191 prerequisite is a computer architecture course, and TinyEngine, SIMD, and the memory hierarchy come up later.
- **A Google account**: Labs 0–4 run on Colab; Lab 5 runs on your own computer (macOS, Linux, or Windows, 8 GB of memory, 5 GB of free space).

After reading this post, try to answer:

1. Why is channel pruning easier to turn into a real speedup on a GPU than fine-grained pruning?
   Answer: Removing whole channels makes the matrices smaller, so ordinary dense operations speed up; zeros scattered anywhere need specialized sparse hardware or kernels to save time.
2. Roughly how large are Llama2-13B's weights in 4-bit?
   Answer: $13 \times 10^9 \times 0.5 = 6.5$ GB.
3. If the example above used 8-bit instead (integers from −127 to 127), what does 0.3 dequantize to?
   Answer: again dropping the minimum and using −127 to 127, $S = 1/127$, $q = \text{round}(38.1) = 38$, which dequantizes to about 0.299, an error of about 0.001.
4. Why does knowledge distillation raise the temperature?
   Answer: A higher temperature flattens the teacher's output distribution, so the small model can see which wrong classes are more alike.
5. When running a model on a microcontroller, why does activation memory often run out before parameters do?
   Answer: Parameters can live in Flash, while activations must live in much smaller SRAM, and the peak comes in the early, highest-resolution layers.

## How to read it: routes and materials

This series follows Fall 2024: 6.5940 was not offered in Fall 2025 because Song Han was on sabbatical, and Fall 2024 is the most recent complete term, with all 23 lecture recordings and Labs 0–5 public, and slides for all but the quantum ML part of Lecture 22. There are no exams; grading is 75% for five labs plus 25% for a final project. The labs have no public solutions, so check your work against the slides and the notebooks' checkpoints. Fall 2026 is running now, and each post has a "Fall 2026 comparison" section; its Lab 1 became a GPU profiling lab, which this series covers in a separate supplementary post. The Fall 2026 lab list is inconsistent about whether Lab 2 is pruning or quantization, so if you want to practice pruning, use Fall 2024's Lab 1.

**The full route.** Read orders 0–24 in sequence, with each lecture's slides and video, and do each lab when you reach its post. Fall 2024 released a lab every two or three lectures. At that pace the route takes about a semester.

**LLM efficiency only.** Read order 1 (the measuring tools) → 5 and 6 (quantization basics, needed for AWQ) → 14 → 15 → 16 → 18 → 19 (add 17 if you want GPU-level profiling). You can skip pruning and NAS for now and come back to order 2 when you reach LLM sparsity.

**TinyML and edge devices.** Read order 1 → 2, 3, 4 → 5, 6, 7 → 8, 9, 10 → 12 → 13 → 23. This is Chapter I plus on-device training, focused on design under KB-scale memory limits.

## Series contents

This series has 25 posts. There are more posts than lectures because the pruning, quantization, and NAS labs are big enough to get their own posts.

| Order | Post | Material |
|---|---|---|
| 0 | This post: series entry | Both course pages |
| 1 | [Why efficiency matters and how to measure model size and compute](/posts/ai/2026-09-30-mit-65940-basics-efficiency-metrics-en) | L1, L2, Lab 0 |
| 2 | [Pruning I: granularity and criteria](/posts/ai/2026-09-30-mit-65940-pruning-granularity-criteria-en) | L3 |
| 3 | [Pruning II: per-layer ratios and hardware support](/posts/ai/2026-09-30-mit-65940-pruning-ratio-system-support-en) | L4 |
| 4 | [Lab 1: fine-grained and channel pruning](/posts/ai/2026-09-30-mit-65940-lab1-pruning-en) | F24 Lab 1 |
| 5 | [Quantization I: number formats and basic quantization](/posts/ai/2026-09-30-mit-65940-quantization-basics-en) | L5 |
| 6 | [Quantization II: PTQ, QAT, and mixed precision](/posts/ai/2026-09-30-mit-65940-quantization-ptq-qat-en) | L6 |
| 7 | [Lab 2: k-means and linear quantization](/posts/ai/2026-09-30-mit-65940-lab2-quantization-en) | F24 Lab 2 |
| 8 | [NAS I: search space and search strategy](/posts/ai/2026-09-30-mit-65940-nas-search-space-strategy-en) | L7 |
| 9 | [NAS II: hardware-aware NAS](/posts/ai/2026-09-30-mit-65940-nas-hardware-aware-en) | L8 |
| 10 | [Lab 3: searching subnets under constraints](/posts/ai/2026-09-30-mit-65940-lab3-nas-en) | F24 Lab 3 |
| 11 | [Knowledge distillation](/posts/ai/2026-09-30-mit-65940-knowledge-distillation-en) | L9 |
| 12 | [MCUNet: neural networks on microcontrollers](/posts/ai/2026-09-30-mit-65940-mcunet-tinyml-en) | L10 |
| 13 | [TinyEngine and parallel computing](/posts/ai/2026-09-30-mit-65940-tinyengine-parallel-computing-en) | L11 |
| 14 | [Bridge: Transformers and LLMs](/posts/ai/2026-09-30-mit-65940-transformer-llm-primer-en) | L12 |
| 15 | [LLM deployment](/posts/ai/2026-09-30-mit-65940-llm-deployment-en) | L13 |
| 16 | [Labs 4 + 5: AWQ and an LLM on your laptop](/posts/ai/2026-09-30-mit-65940-lab4-lab5-llm-on-laptop-en) | F24 Labs 4 and 5 |
| 17 | [Fall 2026 supplement: Lab 1 GPU Basics](/posts/ai/2026-09-30-mit-65940-f26-lab1-gpu-basics-en) | F26 Lab 1 |
| 18 | [LLM post-training](/posts/ai/2026-09-30-mit-65940-llm-post-training-en) | L14 |
| 19 | [Long-context LLMs](/posts/ai/2026-09-30-mit-65940-long-context-llm-en) | L15 |
| 20 | [Efficient vision: ViT, GANs, video, point clouds](/posts/ai/2026-09-30-mit-65940-efficient-vision-gan-video-pointcloud-en) | L16, L17 |
| 21 | [Accelerating diffusion](/posts/ai/2026-09-30-mit-65940-diffusion-efficiency-en) | L18 |
| 22 | [Distributed training](/posts/ai/2026-09-30-mit-65940-distributed-training-en) | L19, L20 |
| 23 | [On-device training](/posts/ai/2026-09-30-mit-65940-on-device-training-en) | L21 |
| 24 | [Course summary and quantum ML](/posts/ai/2026-09-30-mit-65940-course-summary-quantum-ml-en) | L22, L23 |

## What to do tonight

1. Open the [Lab 0 Colab](https://colab.research.google.com/drive/1gvxq7mIAeIBAtmLKH1Q1GknA-GRsK7Q6) and work through the PyTorch tutorial.
2. Redo the memory calculation in "Work it by hand" with your own laptop's memory: what size of LLM fits in 4-bit?
3. Read the [Lectures 1–2 post](/posts/ai/2026-09-30-mit-65940-basics-efficiency-metrics-en).

## Further reading

- [MIT AI/ML course map](/posts/learning/2026-08-21-mit-ai-ml-course-map-en): where 6.5940 sits in MIT's curriculum
- [Stanford CS336: GPUs and TPUs](/posts/ai/2026-08-22-cs336-gpu-tpu-en) and [inference](/posts/ai/2026-08-22-cs336-inference-en): hardware and inference from a language-model course
- [Stanford CS224N guide](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning-en) and [Stanford CME295 guide](/posts/ai/2026-09-29-cme295-course-overview-en): how Transformers and LLMs work
- [Stanford CS231N guide](/posts/ai/2026-09-30-cs231n-course-overview-en): ViTs and computer vision
- [MIT 6.S184 guide](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview-en): the theory of diffusion and flow matching

**Series navigation**: Next: [Why efficiency matters and how to measure model size and compute](/posts/ai/2026-09-30-mit-65940-basics-efficiency-metrics-en)

## Course video sources

This is a course overview; the intro embeds the Fall 2024 Lecture 1 recording. Each other lecture's recording is in its own post, or find it from the official course page or [live.efficientml.ai](https://live.efficientml.ai/). The Fall 2024 page lists public recordings for Lectures 1–23; the final project presentations have none.

Course and recording entries:

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)
- [mit-6-5940 Fall 2026 — official course page](https://hanlab.mit.edu/courses/2026-fall-65940)
- [Lecture 1 recording](https://www.youtube.com/watch?v=U7EPZv8Kh9w) (embedded in the intro, 1 h 6 min)

Checked: 2026-10-14.

## Update Log

- 2026-10-14: Rewrote the body as a real guide: the mechanism behind each lecture in the four chapters, a hand calculation of LLM memory and 4-bit quantization, self-check questions, and the Lecture 1 recording in the intro; the term comparison, openness rating, grading, and lab structure were cut down to one paragraph in the reading routes.
- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [MIT 6.5940 Fall 2024 course page](https://hanlab.mit.edu/courses/2024-fall-65940)
- [MIT 6.5940 Fall 2026 course page](https://hanlab.mit.edu/courses/2026-fall-65940)
- [MIT 6.5940 Fall 2023 course page](https://hanlab.mit.edu/courses/2023-fall-65940)
- [EfficientML.ai video entry point (MIT HAN Lab YouTube)](https://live.efficientml.ai/)
- [Fall 2024 Lecture 1 slides: Introduction](https://www.dropbox.com/scl/fi/h3ggav4eopxsitqxzf6t2/Lec01-Introduction.pdf?rlkey=hzbpsha72p5e3ed4mdvcgcda5&st=pz5u977e&dl=0)
- [Fall 2024 Course Summary slides](https://www.dropbox.com/scl/fi/cn0wr4zxuv4hvpce81lo1/Course-Summary.pdf?rlkey=ycn79vnsu2n7395fz1v04khz0&st=z86d0rap&dl=0)
- [Fall 2026 Lecture 1 slides: Introduction](https://www.dropbox.com/scl/fi/yi5oq4f9yzg9sikwcxm3o/Lec01-Introduction.pdf?rlkey=w0zyuyfkm09haqlh7mo2n27ak&st=oe0pir7t&dl=0)
- [Fall 2026 Lab 1 archive (lab1_gpu_basics.zip)](https://www.dropbox.com/scl/fi/y2zmly5aoekmsg7jq4954/lab1_gpu_basics.zip?rlkey=29v29mlm2muvm0c5teleiusvc&st=2xh5vnk3&dl=1)
- [Fall 2024 final project list](https://docs.google.com/document/d/1QiCkCUr_1DnLNUCXUM3g0SQRIbVG5XyrQjdfsUPrIeA)
- [Fall 2024 Lab 0: PyTorch Tutorial (Colab)](https://colab.research.google.com/drive/1gvxq7mIAeIBAtmLKH1Q1GknA-GRsK7Q6)
- [Fall 2024 Lab 5 folder (Google Drive)](https://drive.google.com/drive/folders/1MhMvxvLsyYrN-4C6eQG8Zj2JeSuyAOf0)
