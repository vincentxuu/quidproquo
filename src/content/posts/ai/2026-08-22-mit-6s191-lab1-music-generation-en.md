---
title: "MIT 6.S191 Lab 1: Generate Music with PyTorch and an LSTM"
date: 2026-08-22
category: ai
type: guide
tags: [mit, ai-course, deep-learning, 6s191]
lang: en
series:
  name: "Reading MIT 6.S191"
  order: 11
tldr: "In the 2026 lab, students cover tensors, autograd, and modules before turning ABC notation into character sequences for LSTM music generation."
description: "A bilingual implementation guide for MIT 6.S191 2026 Lab 1: execution order, completion artifacts, and account or service constraints."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-mit-6s191-lab1-music-generation)

Lab 1 in the [official MIT 6.S191 2026 repository](https://github.com/MITDeepLearning/introtodeeplearning/tree/2026/lab1) is **Lab 1: Generate Music with PyTorch and an LSTM**. It covers tensors, autograd, and modules before turning ABC notation into character sequences for LSTM music generation. This article pins the 2026 branch so later changes to master do not silently alter the exercise.

## Before you begin

The [official 2026 README](https://github.com/MITDeepLearning/introtodeeplearning/blob/2026/README.md) specifies Google Colab, Python 3, and a GPU runtime. Copy the notebook to your Drive and run it from the beginning. Put API keys in the notebook's secret manager—never in a shareable cell or Git commit.

## Recommended sequence

1. Complete Part 1 TODOs and verify shapes and gradients
2. Build the vocabulary, batches, and sequence model in Part 2
3. Save a loss curve and one generated ABC/audio sample

Solve one TODO at a time. Write the expected input and output shapes before executing the cell; when something fails, preserve the error and your reason for the fix. Public solutions are for final comparison, not initial copying.


Expected outputs are a generally decreasing loss curve and a parseable ABC score or rendered audio sample. Common failures include shifting input/target sequences by the wrong offset and mixing CPU and GPU tensors during generation.

## Completion criteria

Keep a notebook copy, one reproducible end-to-end run, and a short conclusion: what the model did correctly, where it failed, and which variable you would change next. A service-dashboard screenshot does not replace model outputs and an experiment record.

## Limits

The [official notebook](https://github.com/MITDeepLearning/introtodeeplearning/blob/2026/lab1/PT_Part2_Music_Generation.ipynb) uses a Google Colab GPU and asks for a Comet API key. Outside learners can complete the core TODOs but should not expect competition access or MIT feedback.

## References

- [MIT 6.S191 2026 course site](https://introtodeeplearning.com/)
- [Official 2026 Lab 1 code and notebooks](https://github.com/MITDeepLearning/introtodeeplearning/tree/2026/lab1)
- [Official repository README](https://github.com/MITDeepLearning/introtodeeplearning/blob/2026/README.md)
- On this site: [Complete MIT 6.S191 guide](/posts/ai/2026-08-21-mit-6s191-introduction-to-deep-learning-en)
