---
title: "CS336 Lecture 11: Scaling Laws in Practice Must Scale Learning Rate and Batch Too"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs336, scaling-laws, llm, mup, optimization]
lang: en
series:
  name: "Reading Stanford CS336"
  order: 12
tldr: "Lecture 11 reads public recipes from MiniCPM, DeepSeek, Qwen, and Llama 3: hold most architectural ratios fixed, sweep learning rate and batch at small scale, then choose model/data allocation with IsoFLOPs. μP helps, but normalization, optimizers, and weight decay can break transfer."
description: "A guide to Stanford CS336 Spring 2026 Lecture 11: WSD schedules, IsoFLOPs, learning-rate and batch scaling, μP's assumptions and limits, and public scaling recipes."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs336-scaling-laws-practice)

This post covers **CS336 Spring 2026 Lecture 11: Scaling — case study and details**, taught by Tatsunori Hashimoto on May 4, 2026. Its primary source is the official [`lecture_11.pdf`](https://github.com/stanford-cs336/lectures/blob/main/lecture_11.pdf).

Lecture 9 explains scaling-law principles. This lecture inspects how public teams implement them. Choosing model size and token count is not enough; initialization, learning rate, batch size, and schedules must remain comparable as scale changes.

## Public recipes share a common skeleton

MiniCPM, DeepSeek, Qwen, and Llama 3 differ in details but follow a practical sequence. Treat most Transformer architecture ratios as approximately scale-invariant, sweep learning rate and batch with small models, then use IsoFLOPs or joint fitting for parameter/data allocation.

This reduces a search over every architecture and optimizer combination to variables that actually drift with scale. It requires preserving small runs rather than publishing only the final checkpoint.

## WSD makes token budgets easier to compare

A cosine schedule ties learning rate to a planned number of steps. If the same run is stopped at several token budgets, checkpoints occupy different schedule phases. Warmup–stable–decay (WSD) holds learning rate steady for a long phase and enters a shorter decay only near a chosen endpoint.

One long run can then provide checkpoints at several data budgets during the stable phase, followed by decay at selected endpoints. WSD does not eliminate the need to train configurations from scratch, but it reduces sweep cost and prevents schedule phase from masquerading as a scaling effect.

## Learning rate and batch form a surface

Choosing one learning rate per scale writes tuning error into the scaling curve. Public studies grid over `(learning rate, batch size)`, identify a convex basin in loss, and fit how the near-optimal region moves with model size.

Critical batch size is not constant either. Target loss, distribution, and optimizer change it. Larger batches reduce optimization steps until additional examples stop helping. A scaling recipe should report tokens, steps, global batch, and wall-clock together.

## μP aims to transfer hyperparameters across width

Maximum update parameterization adjusts initialization and layer-specific learning-rate scaling so activations and updates remain comparable as width grows. Under its assumptions, a learning rate selected on a small model transfers to a large one.

The lecture devotes substantial space to failures. Modern SwiGLU, learnable RMSNorm gains, unusual optimizers, and strong weight decay can violate the theory. μP is often more stable than standard parameterization, but it is not a permanent exemption from tuning. Every new component requires rechecking activation scale, update norm, and the optimal learning rate.

## IsoFLOPs locks the comparison budget

For each compute budget, train several model sizes, take the minimum loss, and observe how optimal `N` and `D` move with budget. This is cleaner than ranking public models trained with different FLOPs because every curve answers the same fixed-budget question.

IsoFLOPs can still inherit recipe errors. A poorly tuned learning rate, excessive data repetition, or a different schedule shifts a model size's minimum. The scaling experiment is itself a training project requiring quality control.

## An executable scaling recipe

Fix tokenizer, data mixture, architecture ratios, and optimizer family. Choose three or four small scales and grid learning rate and batch, confirming the loss surface and near-optimal band. Sweep model/data allocations at several FLOP budgets and hold out a scale for extrapolation testing. Only then train the target model, using predicted loss for anomaly detection during the run.

Lecture 11's conclusion is deliberately unglamorous. Scaling laws do not remove tuning; they replace one expensive gamble with many controlled small experiments.

## Material fidelity

This lecture has a Spring 2026 schedule entry and a complete official PDF. This guide follows its public recipes, optimizer scaling, and μP sections.

## References

- [CS336 Spring 2026 course and schedule](https://cs336.stanford.edu/)
- [Lecture 11 official slides](https://github.com/stanford-cs336/lectures/blob/main/lecture_11.pdf)
- [Tensor Programs V: Tuning Large Neural Networks via Zero-Shot Hyperparameter Transfer](https://arxiv.org/abs/2203.03466)
- [DeepSeek LLM](https://arxiv.org/abs/2401.02954)

