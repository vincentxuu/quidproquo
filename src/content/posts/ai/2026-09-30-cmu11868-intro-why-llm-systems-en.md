---
title: "CMU 11-868 L01: Why LLMs Need Systems — the Scale Curve, Low-Level Operators, and Three Layers of Abstraction"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, ai-course, cmu, llm, gpu]
lang: en
series:
  name: "Reading CMU 11-868 LLM Systems"
  order: 1
tldr: "CMU 11-868's first lecture spends 51 slides on one argument: the LLM bottleneck isn't only the model, it's computing larger LLMs on bigger datasets with fewer GPUs, less memory, and less power, faster. It breaks a Transformer into four low-level operators (matrix multiply, reduction, map, memory movement), sorts the hard problems into kernel, framework, and distributed-system layers, and warns that fast computation isn't enough because moving data takes time too."
description: "A guide to the L01 Introduction slides of CMU 11-868 LLM Systems (Spring 2026): the learning objectives, the LLM scale curve, how the next-token model and training pipeline define the system's workload, the low-level operators, system challenges at three abstraction levels, model-algorithm-system co-design, the compute versus data-transfer trade-off, and how these ideas map onto later lectures and assignments."
draft: false
glossary:
  - term: "model-algorithm-system co-design"
    aliases: ["co-design"]
    definition: "Designing the model architecture, training and inference algorithms, software optimizations (partitioning, scheduling, data movement, latency hiding), and hardware acceleration together instead of optimizing each layer separately."
    context: "CMU 11-868 L01 makes this a core claim, under the slide title \"LLM needs Model-Algorithm-System Co-design\"."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu11868-intro-why-llm-systems)

> **Version note**: This article follows the Spring 2026 offering of [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/). The main source is the 1/12 [L01 Introduction to LLM slides](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-01-intro-14e74a426e4a7e3ed485a026e1f65b70.pdf) (51 pages); page numbers are PDF page numbers. Facts were checked on 2026-09-30. The course has **no public videos**, so everything here comes from the slide text; whatever the instructor said out loud is unknown.

**Series**: previous [Series overview and self-study paths](/posts/ai/2026-09-30-cmu11868-llm-systems-overview-en) | next [L02–L04: GPU Programming and Acceleration](/posts/ai/2026-09-30-cmu11868-gpu-programming-acceleration-en) | [Series overview](/posts/ai/2026-09-30-cmu11868-llm-systems-overview-en)

L01 has four parts: what LLMs can do, mathematical foundations, challenges in LLM systems, and logistics (page 5). Logistics are covered in the [overview](/posts/ai/2026-09-30-cmu11868-llm-systems-overview-en). This article follows the first three parts and traces how the lecture argues that LLMs need systems.

## Course video sources

This article follows official notes, slides, or assignments. This check of the official public pages did not verify a public recording for the material covered here; it does not establish that no recording exists.

Course and recording entries:

- [cmu-11-868-llm-systems — official course materials and recording index](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)

## The learning objectives open with an arithmetic problem

Page 4 lists three objectives. Under the first one sits a single question:

> How much resources do you need to train a 100B model?

The other two are engineering skills (fast CUDA kernels, scalable training systems, efficient inference) and research ability (finding and solving new problems in LLM systems research). Together they're almost a table of contents. Kernels map to the GPU lectures and HW1 and HW4. Training systems map to distributed training and HW5. Inference maps to the serving lectures and HW6.

L01 never works out how much a 100B model needs; it only poses the question. To do the math once, read [CS336 Lecture 2: count FLOPs and memory first](/posts/ai/2026-08-22-cs336-resource-accounting-en).

## The scale curve: why this is a systems problem

Page 3 is a log-scale chart of parameter counts in billions. It runs from the 2017 Transformer through GPT-1 and GPT-2, then GPT-3, Gopher, and PaLM, up to GPT-4, DeepSeek-V3, and Kimi K2, with the top tick at 10,000B. L02 opens with the same chart under the subtitle "the need for system optimization."

The chart spans several orders of magnitude from GPT-2 to Kimi K2. Compare that with the spec table on L02 page 15: even the newest B200 has 192GB of memory per card. When a model doesn't fit on one card and the data doesn't fit on one machine, systems engineering is a precondition for training at all, not a later optimization.

## The math section really defines the workload

The second part looks like a primer on LLMs, but each slide defines computation the system has to handle.

- **Next-token probability** (pages 20–21): a language model factors the probability of a sentence into a product of per-token conditional probabilities. That's why generation happens one token at a time, and it's the starting point for the later decoding and serving lectures.
- **Three architectures** (pages 23–26): encoder-only (BERT's masked prediction), encoder-decoder, and decoder-only. Page 26 calls decoder-only the "Most popular choice of LLM architecture."
- **Training pipeline** (pages 27–29): pre-training, supervised fine-tuning, then RL. Pre-training uses next-token cross-entropy loss on web-scale text, where more data is better and quality matters.
- **Why ChatGPT changed the landscape** (page 22): pre-training on huge raw data (300B tokens) plus a little human feedback, instruction following, and in-context learning. Page 32 adds: "Both model scale and data are important."

So the system has to support three things: huge models, huge datasets, and token-by-token generation. Every later lecture attacks one of them.

## Defining the systems problem

The first slide of part three (page 34) names three traits of modern LLMs: any task can be written as token sequence generation, they take natural-language instructions, and they're agentic (they call tools and take feedback). Page 35 then states the course's problem:

> Key system problem: compute (train/inference) larger LLMs on bigger datasets with fewer resources (GPU/memory/power) faster

The same page gives two design principles. Find the **right abstraction**: building blocks that hide complexity from application developers. Understand the **trade-offs**: ask what the fundamental constraints and main success metrics are.

### A Transformer as four operators

Page 36 splits LLM computation into two levels. The upper level is the usual network layers: multi-head attention, layer norm, dropout, linear layers, nonlinear activations, and softmax. The lower level has just four operators:

| Low-level operator | Examples |
|---|---|
| Matrix/tensor multiplication | Linear layers, QKᵀ in attention |
| Reduction | Sum, average |
| Map | Applying a function element-wise |
| Memory movement | Moving data between devices and memory levels |

This table is worth remembering. The CUDA kernels in [Assignment 1](https://llmsystem.github.io/llmsystemhomework/assignment_1/) are exactly map, zip, reduce, and matrix multiply. Once they're done, every layer of MiniTorch runs on your own GPU code.

### Hard problems at three layers

Page 37 draws the systems challenges as three layers:

| Abstraction layer | What it has to solve |
|---|---|
| Distributed/parallel system | Gigantic models, gigantic datasets, very long sequences and context; partitioning, scheduling, communication |
| Deep learning framework | Making models easy to build and modify, and ML algorithms easy to develop |
| Operators on blocks of data | Fast CUDA/TPU kernels; data and model compression |

The schedule mostly climbs from the bottom: GPUs and kernels, then frameworks and autodiff, then Transformers and acceleration, and finally distributed training and serving.

### Co-design, and moving data

Page 38 is titled "LLM needs Model-Algorithm-System Co-design." It asks you to design four things together: the model architecture, training and inference algorithms, software optimization (partitioning, scheduling, data movement, latency hiding), and hardware acceleration through device-specific instructions. Its first line reads "Scaling is all you need! – scale up and scale down."

Page 39 is the most systems-minded slide in the lecture:

> Making computation fast is not enough

It gives three reasons. Large models have many parameters, and moving parameters and gradients between devices and nodes can take longer than computing. A batch of samples behaves differently from a single sequence. Long-context LLMs need a lot of working memory. This compute-versus-movement tension runs through the whole course. L04's tiling, LightSeq's fused kernels, FlashAttention, ZeRO, and KV cache management are all ways of moving less data.

Page 40 closes with programming models and splits AI applications into three levels. The upper level integrates models into products and improves their quality over time. The middle level builds training and inference software and streaming dataflow. The lower level builds GPU kernels and compilers. A good abstraction "frees the programmer of one or more concerns" while still supporting many applications on top.

## Who this course isn't for

Page 45 lists three kinds of students who shouldn't take it. If you want to learn to build deep learning models and use TensorFlow or PyTorch, take 11-685/11-785. If you want to use LLMs and don't care about the underlying system, take 11-667. If you can't attend or finish the homework and project, don't take it, because the course "requires system implementation."

Page 47 describes the homework: individual, in Python and C++/CUDA, building the main pieces of MiniTorch and training a Transformer LLM. CUDA experience is "helpful but not required."

## What to do after this lecture

- **Map the four operators onto a model you know.** Take a Transformer implementation you've used and label which low-level operators each layer needs. Softmax needs both a reduction (summing a row) and maps (exponentiating and dividing element-wise); HW4 asks you to write it as a single fused kernel.
- **Try the 100B question yourself.** Estimate weight size as parameter count × bytes per parameter, compare it with one GPU's memory, and see how many pieces you need at minimum. Don't worry if you can't account for gradients and optimizer state yet; the ZeRO lecture covers them.
- **Pick your path.** If page 45 made you think you're the second kind of student, the series is still worth reading, but you can skip the homework. If you want to build, check the hardware requirements in the [overview's self-study paths](/posts/ai/2026-09-30-cmu11868-llm-systems-overview-en) first.

## Further reading

- [CS336 Lecture 2: count FLOPs and memory before asking if a model will run](/posts/ai/2026-08-22-cs336-resource-accounting-en): actually does the resource math L01 only poses.
- [CME295 Lecture 5: LLM Systems](/posts/ai/2026-09-29-cme295-llm-systems-en): the same systems questions in one lecture.
- [Reading CMU 11-785 Deep Learning](/posts/ai/2026-08-22-cmu-11785-course-overview-en): the course L01 recommends for students who want to learn to build models.

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [CMU 11-868 L01 Introduction to LLM slides (Spring 2026, 51 pages)](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-01-intro-14e74a426e4a7e3ed485a026e1f65b70.pdf)
- [CMU 11-868 Spring 2026 home page (course description)](https://llmsystem.github.io/llmsystem2026spring/)
- [CMU 11-868 Spring 2026 Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)
- [CMU 11-868 Assignment 1: CUDA Programming](https://llmsystem.github.io/llmsystemhomework/assignment_1/)
- [CMU 11-868 L02 GPU Programming slides (scale curve on page 3)](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-02-gpu-programming-c64a0141b96a1f384db7f6717ed8e039.pdf)
