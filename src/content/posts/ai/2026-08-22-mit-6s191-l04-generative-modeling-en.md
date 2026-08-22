---
title: "MIT 6.S191 Lecture 4: Generative Modeling: From Latent Spaces to Diffusion"
date: 2026-08-22
category: ai
type: guide
tags: [mit, ai-course, deep-learning, 6s191]
lang: en
series:
  name: "Reading MIT 6.S191"
  order: 5
tldr: "Lecture 4 of the 2026 course separates generative from discriminative tasks, organizes VAE, GAN, and diffusion objectives, and leads into Lab 2’s DB-VAE."
description: "A bilingual study note for MIT 6.S191 2026 Lecture 4: core ideas, viewing prompts, a concrete exercise, and official materials."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-mit-6s191-l04-generative-modeling)

Lecture 4 of [MIT 6.S191 2026](https://introtodeeplearning.com/) is **Generative Modeling: From Latent Spaces to Diffusion**. It Separates generative from discriminative tasks, organizes VAE, GAN, and diffusion objectives, and leads into Lab 2’s DB-VAE. This note uses only the official 2026 slides and video; it does not mix in similarly named material from 2025.

## What to take away

- Explain how latent variables can represent factors of variation
- Distinguish reconstruction, adversarial, and denoising objectives
- Recognize that sample quality does not imply that data bias is gone

These goals have one thing in common: recognizing terminology is insufficient. You should be able to identify inputs, outputs, the learning signal, and the main constraint before moving on.


A VAE encodes an input as a distribution, samples a latent value, and decodes a reconstruction. A GAN pits a generator against a discriminator, while diffusion learns to reverse a noising process. Because their objectives differ, “better generation” must be defined in terms of fidelity, diversity, and downstream use.

## How to watch

First scan the sections and diagrams in the [official slides](https://introtodeeplearning.com/slides/6S191_MIT_DeepLearning_L4.pdf), then watch the [official video](https://www.youtube.com/watch?v=R8V8CbuxryI). On a second pass, pause at equations and architecture diagrams and redraw them in your own notation. Afterward, close the material and write three central ideas plus one unresolved question.

## An exercise for tonight

Draw a VAE with encoder, sampling, and decoder; label both loss terms before opening Lab 2 Part 2.

“Finished” means leaving a checkable diagram, calculation, program output, or short note—not merely reaching the end of the video. You should also be able to explain one failure mode to someone else.

## Scope and limits

6.S191 is a high-intensity introduction, and this article is only a lecture guide. It does not replace the full recording, rigorous derivations, or instructor feedback. Use a semester course or primary papers when a topic needs theoretical depth.

## References

- [MIT 6.S191 2026 course site](https://introtodeeplearning.com/)
- [Lecture 4 official slides](https://introtodeeplearning.com/slides/6S191_MIT_DeepLearning_L4.pdf)
- [Lecture 4 official video](https://www.youtube.com/watch?v=R8V8CbuxryI)
- On this site: [Complete MIT 6.S191 guide](/posts/ai/2026-08-21-mit-6s191-introduction-to-deep-learning-en)
