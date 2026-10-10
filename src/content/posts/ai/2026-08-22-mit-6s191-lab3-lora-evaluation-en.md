---
title: "MIT 6.S191 Lab 3: LoRA Fine-Tuning and LLM-as-a-Judge Evaluation"
date: 2026-08-22
category: ai
type: guide
tags: [mit, ai-course, deep-learning, 6s191]
lang: en
series:
  name: "Reading MIT 6.S191"
  order: 13
tldr: "In the 2026 lab, students build chat templates and generation with LFM2-1.2B, adapt style through LoRA, and combine OpenRouter with Opik for a judge workflow."
description: "A bilingual implementation guide for MIT 6.S191 2026 Lab 3: execution order, completion artifacts, and account or service constraints."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-mit-6s191-lab3-lora-evaluation)

**Video status: Checked: no corresponding recording link listed on the public official page.** [Source details](#course-video-sources)

Lab 3 in the [official MIT 6.S191 2026 repository](https://github.com/MITDeepLearning/introtodeeplearning/tree/2026/lab3) is **Lab 3: LoRA Fine-Tuning and LLM-as-a-Judge Evaluation**. It builds chat templates and generation with LFM2-1.2B, adapts style through LoRA, and combines OpenRouter with Opik for a judge workflow. This article pins the 2026 branch so later changes to master do not silently alter the exercise.

## Course video sources
Rechecked against the live official course page on 2026-10-10: the public page lists lecture recordings only and no recording dedicated to this article (the lab is provided as official GitHub notebooks).

Course and recording entries:

- [mit-6s191 — official course materials and recording index](https://introtodeeplearning.com/)

Checked: 2026-10-10.

## Before you begin

The [official 2026 README](https://github.com/MITDeepLearning/introtodeeplearning/blob/2026/README.md) specifies Google Colab, Python 3, and a GPU runtime. Copy the notebook to your Drive and run it from the beginning. Put API keys in the notebook's secret manager—never in a shareable cell or Git commit.

## Recommended sequence

1. Fix three prompts and record base-model outputs
2. Complete the LoRA configuration and training TODOs
3. Write a human rubric before spending API credit on a judge

Solve one TODO at a time. Write the expected input and output shapes before executing the cell; when something fails, preserve the error and your reason for the fix. Public solutions are for final comparison, not initial copying.


Expected outputs are base-versus-LoRA responses for fixed prompts, a training record, and human or judge scores under one rubric. Common failures include mismatched chat-template/tokenizer formatting and invoking the judge before freezing the rubric, which makes results incomparable.

## Completion criteria

Keep a notebook copy, one reproducible end-to-end run, and a short conclusion: what the model did correctly, where it failed, and which variable you would change next. A service-dashboard screenshot does not replace model outputs and an experiment record.

## Limits

This lab has the most dependencies: a Colab GPU, Comet/Opik, and an OpenRouter key. The [official Lab 3 notebook](https://github.com/MITDeepLearning/introtodeeplearning/blob/2026/lab3/LLM_Finetuning.ipynb) warns that capable judges may cost money and free models may be rate-limited; recheck current terms.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Live-checked the official public page: it still lists lecture recordings only, with none dedicated to this article, so the status is now “Checked: no corresponding recording link listed on the public official page.”

## References

- [MIT 6.S191 2026 course site](https://introtodeeplearning.com/)
- [Official 2026 Lab 3 code and notebooks](https://github.com/MITDeepLearning/introtodeeplearning/tree/2026/lab3)
- [Official repository README](https://github.com/MITDeepLearning/introtodeeplearning/blob/2026/README.md)
- On this site: [Complete MIT 6.S191 guide](/posts/ai/2026-08-21-mit-6s191-introduction-to-deep-learning-en)
