---
title: "MIT 6.S191 Lab 2: From MNIST to Facial Debiasing with a DB-VAE"
date: 2026-08-22
category: ai
type: guide
tags: [mit, ai-course, deep-learning, 6s191]
lang: en
series:
  name: "Reading MIT 6.S191"
  order: 12
tldr: "In the 2026 lab, part 1 classifies MNIST with dense and convolutional networks; Part 2 learns a facial latent distribution with a DB-VAE and changes training sampling."
description: "A bilingual implementation guide for MIT 6.S191 2026 Lab 2: execution order, completion artifacts, and account or service constraints."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-mit-6s191-lab2-debiasing)

Lab 2 in the [official MIT 6.S191 2026 repository](https://github.com/MITDeepLearning/introtodeeplearning/tree/2026/lab2) is **Lab 2: From MNIST to Facial Debiasing with a DB-VAE**. Part 1 classifies MNIST with dense and convolutional networks; Part 2 learns a facial latent distribution with a DB-VAE and changes training sampling. This article pins the 2026 branch so later changes to master do not silently alter the exercise.

## Before you begin

The [official 2026 README](https://github.com/MITDeepLearning/introtodeeplearning/blob/2026/README.md) specifies Google Colab, Python 3, and a GPU runtime. Copy the notebook to your Drive and run it from the beginning. Put API keys in the notebook's secret manager—never in a shareable cell or Git commit.

## Recommended sequence

1. Use Part 1 to verify convolution shapes and the training loop
2. Record aggregate results and concrete failures from the baseline detector
3. Compare the same cases after the DB-VAE without treating one metric as a fairness verdict

Solve one TODO at a time. Write the expected input and output shapes before executing the cell; when something fails, preserve the error and your reason for the fix. Public solutions are for final comparison, not initial copying.


Expected outputs include MNIST results, baseline face-detection results, and the same cases evaluated after DB-VAE resampling. Common failures include putting the image channel in the wrong dimension and reporting only aggregate accuracy without preserving failed face examples.

## Completion criteria

Keep a notebook copy, one reproducible end-to-end run, and a short conclusion: what the model did correctly, where it failed, and which variable you would change next. A service-dashboard screenshot does not replace model outputs and an experiment record.

## Limits

This is a course experiment, not a fairness fix proven across all populations. Data, measurement, and deployment context still require a separate audit.

## References

- [MIT 6.S191 2026 course site](https://introtodeeplearning.com/)
- [Official 2026 Lab 2 code and notebooks](https://github.com/MITDeepLearning/introtodeeplearning/tree/2026/lab2)
- [Official repository README](https://github.com/MITDeepLearning/introtodeeplearning/blob/2026/README.md)
- On this site: [Complete MIT 6.S191 guide](/posts/ai/2026-08-21-mit-6s191-introduction-to-deep-learning-en)
