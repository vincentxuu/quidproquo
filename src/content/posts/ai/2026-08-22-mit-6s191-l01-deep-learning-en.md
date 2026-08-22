---
title: "MIT 6.S191 Lecture 1: The Minimal Structure of Deep Learning"
date: 2026-08-22
category: ai
type: guide
tags: [mit, ai-course, deep-learning, 6s191]
lang: en
series:
  name: "Reading MIT 6.S191"
  order: 2
tldr: "Lecture 1 of the 2026 course builds the vocabulary shared by the rest of the course: perceptrons, forward propagation, loss, and gradient descent."
description: "A bilingual study note for MIT 6.S191 2026 Lecture 1: core ideas, viewing prompts, a concrete exercise, and official materials."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-mit-6s191-l01-deep-learning)

Lecture 1 of [MIT 6.S191 2026](https://introtodeeplearning.com/) is **The Minimal Structure of Deep Learning**. It builds the vocabulary shared by the rest of the course: perceptrons, forward propagation, loss, and gradient descent. This note uses only the official 2026 slides and video; it does not mix in similarly named material from 2025.

## What to take away

- Write one neuron as a weighted sum, bias, and nonlinear activation
- Track tensor shapes through layers instead of memorizing architecture names
- Explain what a loss measures and how gradient descent changes parameters

These goals have one thing in common: recognizing terminology is insufficient. You should be able to identify inputs, outputs, the learning signal, and the main constraint before moving on.


A complete chain is: inputs pass through weighted sums and activations to form a prediction; a loss turns prediction-versus-target into a scalar; backpropagation uses the chain rule to assign responsibility to each parameter. The limit is that a falling loss only improves the chosen objective—it does not guarantee out-of-distribution or real-world performance.

## How to watch

First scan the sections and diagrams in the [official slides](https://introtodeeplearning.com/slides/6S191_MIT_DeepLearning_L1.pdf), then watch the [official video](https://www.youtube.com/watch?v=II4giR4vOOo). On a second pass, pause at equations and architecture diagrams and redraw them in your own notation. Afterward, close the material and write three central ideas plus one unresolved question.

## An exercise for tonight

After watching, draw a two-layer network and label every tensor shape, then use Lab 1 Part 1 to verify the matrix multiplications.

“Finished” means leaving a checkable diagram, calculation, program output, or short note—not merely reaching the end of the video. You should also be able to explain one failure mode to someone else.

## Scope and limits

6.S191 is a high-intensity introduction, and this article is only a lecture guide. It does not replace the full recording, rigorous derivations, or instructor feedback. Use a semester course or primary papers when a topic needs theoretical depth.

## References

- [MIT 6.S191 2026 course site](https://introtodeeplearning.com/)
- [Lecture 1 official slides](https://introtodeeplearning.com/slides/6S191_MIT_DeepLearning_L1.pdf)
- [Lecture 1 official video](https://www.youtube.com/watch?v=II4giR4vOOo)
- On this site: [Complete MIT 6.S191 guide](/posts/ai/2026-08-21-mit-6s191-introduction-to-deep-learning-en)
