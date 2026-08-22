---
title: "MIT 6.S191 Lecture 9: Massively Parallel Training: Memory and Communication Set the Boundary"
date: 2026-08-22
category: ai
type: guide
tags: [mit, ai-course, deep-learning, 6s191]
lang: en
series:
  name: "Reading MIT 6.S191"
  order: 10
tldr: "Lecture 9 of the 2026 course starts with GPU memory pressure and moves through checkpointing, offloading, ZeRO, FSDP, and multiple forms of parallelism."
description: "A bilingual study note for MIT 6.S191 2026 Lecture 9: core ideas, viewing prompts, a concrete exercise, and official materials."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-mit-6s191-l09-parallel-training)

Lecture 9 of [MIT 6.S191 2026](https://introtodeeplearning.com/) is **Massively Parallel Training: Memory and Communication Set the Boundary**. It Starts with GPU memory pressure and moves through checkpointing, offloading, ZeRO, FSDP, and multiple forms of parallelism. This note uses only the official 2026 slides and video; it does not mix in similarly named material from 2025.

## What to take away

- Estimate parameters, gradients, optimizer states, and activations separately
- Identify what data, tensor, pipeline, and context parallelism partition
- Recognize that memory savings often increase recomputation or communication

These goals have one thing in common: recognizing terminology is insufficient. You should be able to identify inputs, outputs, the learning signal, and the main constraint before moving on.


First budget memory for parameters, gradients, optimizer states, and activations. Then choose a partition: data parallelism replicates the model, tensor parallelism splits operators, pipeline parallelism splits layers, and context parallelism splits sequences. Every partition trades some memory pressure for communication, synchronization, or pipeline bubbles.

## How to watch

First scan the sections and diagrams in the [official slides](https://introtodeeplearning.com/slides/6S191_MIT_DeepLearning_L9.pdf), then watch the [official video](https://www.youtube.com/watch?v=UZZD9d9YqnQ). On a second pass, pause at equations and architecture diagrams and redraw them in your own notation. Afterward, close the material and write three central ideas plus one unresolved question.

## An exercise for tonight

Make a four-column memory budget for a model, then choose checkpointing, sharding, or a smaller model instead of starting from a GPU count.

“Finished” means leaving a checkable diagram, calculation, program output, or short note—not merely reaching the end of the video. You should also be able to explain one failure mode to someone else.

## Scope and limits

6.S191 is a high-intensity introduction, and this article is only a lecture guide. It does not replace the full recording, rigorous derivations, or instructor feedback. Use a semester course or primary papers when a topic needs theoretical depth.

## References

- [MIT 6.S191 2026 course site](https://introtodeeplearning.com/)
- [Lecture 9 official slides](https://introtodeeplearning.com/slides/6S191_MIT_DeepLearning_L9.pdf)
- [Lecture 9 official video](https://www.youtube.com/watch?v=UZZD9d9YqnQ)
- On this site: [Complete MIT 6.S191 guide](/posts/ai/2026-08-21-mit-6s191-introduction-to-deep-learning-en)
