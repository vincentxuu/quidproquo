---
title: "Berkeley CS288 Part 3: Pre-training, Post-training, Generation, and Evaluation"
date: 2026-08-22
category: learning
tags: [berkeley, cs288, llm, post-training, evaluation, prompting]
lang: en
type: guide
difficulty: 深度
tldr: "Units 08–12 turn a base model into an interactive system: pre-training establishes capability, post-training shapes behavior, and generation plus evaluation determine how outputs are used."
description: "A guide to CS288 pre-training, fine-tuning, prompting, post-training, generation, evaluation, and benchmarking."
draft: false
series: { name: "Berkeley CS288 Spring 2026", order: 3 }
---

> 🌏 [中文版](/posts/learning/2026-08-22-berkeley-cs288-post-training)

[Units 08–12](https://cal-cs288.github.io/sp26/) ask how an architecture becomes a deployable, evaluated system through pre-training, fine-tuning, prompting, and post-training. Generation and evaluation are not appendices: different decoding policies turn the same logits into different quality, cost, and risk profiles.

## Keep the stages and methods separate

Pre-training learns general predictive capability from broad data. Fine-tuning changes task behavior with narrower data. Prompting supplies context and output constraints without parameter updates. Post-training is a broader behavior-shaping layer, not merely “training again.” For each stage, record data provenance, objective, updated parameters, and held-out evidence.

The [A2 bonus](https://cal-cs288.github.io/sp26/assignments/Sp2026_CS288_Assignment2.pdf) creates a runnable mini-study: pre-train your own tokenizer and Transformer, then compare a fine-tuned QA classifier with prompting. A tiny model does not establish a universal LLM law, but it is useful for controlled experiments.

## Generation is a decision

Greedy decoding, sampling, and top-k variants change exploration. Stopping, length, and temperature alter the output distribution. Fix the checkpoint and prompts, change one decoding parameter at a time, and retain raw outputs rather than cherry-picked examples.

## Evaluation joins models, data, and people

The schedule places inference/evaluation next to experimental design and human annotation. A benchmark score needs a defined dataset, split, and annotation process. Write an evaluation contract—task, data timestamp, metric, failure taxonomy, and human-review sample—before running comparisons.

Recordings and classroom discussion are restricted, so this article does not infer instructor opinions about particular benchmarks.

## References

- [CS288 Spring 2026 schedule and slides](https://cal-cs288.github.io/sp26/)
- [Assignment 2 specification](https://cal-cs288.github.io/sp26/assignments/Sp2026_CS288_Assignment2.pdf)
- [Course information](https://cal-cs288.github.io/sp26/course_info/)
