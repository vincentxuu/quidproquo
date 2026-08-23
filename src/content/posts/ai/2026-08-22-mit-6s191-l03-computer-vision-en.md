---
title: "MIT 6.S191 Lecture 3: Computer Vision: How Convolution Preserves Spatial Structure"
date: 2026-08-22
category: ai
type: guide
tags: [mit, ai-course, deep-learning, 6s191]
lang: en
series:
  name: "Reading MIT 6.S191"
  order: 4
tldr: "Lecture 3 of the 2026 course moves from image tensors, convolution, and pooling to recognition systems, preparing for MNIST and face detection in Lab 2."
description: "A bilingual study note for MIT 6.S191 2026 Lecture 3: core ideas, viewing prompts, a concrete exercise, and official materials."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-mit-6s191-l03-computer-vision)

Lecture 3 of [MIT 6.S191 2026](https://introtodeeplearning.com/) is **Computer Vision: How Convolution Preserves Spatial Structure**. It Moves from image tensors, convolution, and pooling to recognition systems, preparing for MNIST and face detection in Lab 2. This note uses only the official 2026 slides and video; it does not mix in similarly named material from 2025.

## What to take away

- Compute feature-map sizes after kernel, stride, and padding choices
- Explain why weight sharing suits images better than dense layers
- Inspect accuracy together with data distribution and failure cases

These goals have one thing in common: recognizing terminology is insufficient. You should be able to identify inputs, outputs, the learning signal, and the main constraint before moving on.


The conceptual chain runs from local receptive fields and shared weights to a growing effective field of view and finally a classification or detection output. This creates a useful translation-related inductive bias, but it does not make the model naturally robust to rotation, occlusion, lighting, or new populations; each requires targeted evaluation.

## How to watch

First scan the sections and diagrams in the [official slides](https://introtodeeplearning.com/slides/6S191_MIT_DeepLearning_L3.pdf), then watch the [official video](https://www.youtube.com/watch?v=pqIcoskUuWs). On a second pass, pause at equations and architecture diagrams and redraw them in your own notation. Afterward, close the material and write three central ideas plus one unresolved question.

## An exercise for tonight

Compute one 3×3 convolution on a tiny image, then compare your shape with PyTorch in Lab 2 Part 1.

“Finished” means leaving a checkable diagram, calculation, program output, or short note—not merely reaching the end of the video. You should also be able to explain one failure mode to someone else.

## Scope and limits

6.S191 is a high-intensity introduction, and this article is only a lecture guide. It does not replace the full recording, rigorous derivations, or instructor feedback. Use a semester course or primary papers when a topic needs theoretical depth.

## References

- [MIT 6.S191 2026 course site](https://introtodeeplearning.com/)
- [Lecture 3 official slides](https://introtodeeplearning.com/slides/6S191_MIT_DeepLearning_L3.pdf)
- [Lecture 3 official video](https://www.youtube.com/watch?v=pqIcoskUuWs)
- On this site: [Complete MIT 6.S191 guide](/posts/ai/2026-08-21-mit-6s191-introduction-to-deep-learning-en)
