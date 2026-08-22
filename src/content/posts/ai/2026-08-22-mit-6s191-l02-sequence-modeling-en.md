---
title: "MIT 6.S191 Lecture 2: Sequence Modeling: From RNNs to Attention"
date: 2026-08-22
category: ai
type: guide
tags: [mit, ai-course, deep-learning, 6s191]
lang: en
series:
  name: "Reading MIT 6.S191"
  order: 3
tldr: "Lecture 2 of the 2026 course addresses data where order changes meaning—text, audio, and time series—and connects directly to music generation in Lab 1."
description: "A bilingual study note for MIT 6.S191 2026 Lecture 2: core ideas, viewing prompts, a concrete exercise, and official materials."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-mit-6s191-l02-sequence-modeling)

Lecture 2 of [MIT 6.S191 2026](https://introtodeeplearning.com/) is **Sequence Modeling: From RNNs to Attention**. It Addresses data where order changes meaning—text, audio, and time series—and connects directly to music generation in Lab 1. This note uses only the official 2026 slides and video; it does not mix in similarly named material from 2025.

## What to take away

- Understand how recurrent state carries the past forward
- Recognize gradient and memory bottlenecks in long sequences
- Treat attention as query-dependent information selection, not a magic block

These goals have one thing in common: recognizing terminology is insufficient. You should be able to identify inputs, outputs, the learning signal, and the main constraint before moving on.


A sequence model combines the current token with prior context and predicts the next step. An RNN compresses memory into recurrent state, while attention lets each position retrieve other positions according to a query. Neither mechanism automatically understands long-range causality; longer sequences still create memory, compute, and data-quality limits.

## How to watch

First scan the sections and diagrams in the [official slides](https://introtodeeplearning.com/slides/6S191_MIT_DeepLearning_L2.pdf), then watch the [official video](https://www.youtube.com/watch?v=d02VkQ9MP44). On a second pass, pause at equations and architecture diagrams and redraw them in your own notation. Afterward, close the material and write three central ideas plus one unresolved question.

## An exercise for tonight

Take a short ABC score and manually form input/next-character pairs before opening Lab 1 Part 2.

“Finished” means leaving a checkable diagram, calculation, program output, or short note—not merely reaching the end of the video. You should also be able to explain one failure mode to someone else.

## Scope and limits

6.S191 is a high-intensity introduction, and this article is only a lecture guide. It does not replace the full recording, rigorous derivations, or instructor feedback. Use a semester course or primary papers when a topic needs theoretical depth.

## References

- [MIT 6.S191 2026 course site](https://introtodeeplearning.com/)
- [Lecture 2 official slides](https://introtodeeplearning.com/slides/6S191_MIT_DeepLearning_L2.pdf)
- [Lecture 2 official video](https://www.youtube.com/watch?v=d02VkQ9MP44)
- On this site: [Complete MIT 6.S191 guide](/posts/ai/2026-08-21-mit-6s191-introduction-to-deep-learning-en)
