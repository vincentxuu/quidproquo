---
title: "CS224N Lecture 9: Prompting, LoRA, and Parameter-Efficient Adaptation"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224n, peft, lora, prompting, stanford]
lang: en
series:
  name: "Stanford CS224N 導讀"
  order: 10
tldr: "Lecture 9 compares prompting, pruning, LoRA, prompt tuning, and adapters. Each asks the same question: how many parameters must change, and how much task-specific state must be stored, to adapt a large pretrained model?"
description: "A lecture-by-lecture reading of CS224N Winter 2026 Lecture 9: DPO wrap-up, prompting, PEFT, pruning, LoRA, prompt tuning, and adapters."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs224n-efficient-adaptation)

The [official CS224N Winter 2026 schedule](https://web.stanford.edu/class/cs224n/) places lecture 9 on February 3, 2026, but does not name a lecturer; this article therefore attributes it only to the course staff. The [official deck](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture09-peft.pdf) closes DPO and preference data, then covers prompting, PEFT, pruning/subnetworks, LoRA, prompt tuning, adapters, and other methods.

## Classify adaptation by what changes

Full fine-tuning updates every parameter. It is flexible, but each task stores a full model and training memory includes gradients and optimizer state. Prompting changes no weights and modifies only context. It is cheap to iterate but sensitive to wording and context limits.

PEFT freezes most of the base model and trains a small task-specific state. Evaluation must look beyond trainable-parameter percentage to inference latency, storage, batching constraints, and quality on the real task.

## Pruning and subnetworks

Pruning removes weights, neurons, or structures to find a smaller subnetwork. Unstructured sparsity may reduce parameter count without becoming faster on ordinary hardware. Structured pruning more readily produces real speedups but offers fewer removal choices.

## LoRA's low-rank update

[LoRA](https://arxiv.org/abs/2106.09685) freezes a weight matrix and represents its update as the product of two smaller matrices. If task-specific changes are approximately low-rank, a small number of parameters can learn an effective adaptation. Deployment can store one LoRA state per task or merge an update into the base weights.

Rank, target layers, and scaling remain design choices. Fewer parameters do not guarantee lossless performance on every task or remove the need for data and evaluation.

## Prompt tuning and adapters

Prompt tuning learns continuous virtual-token embeddings, placing trainable state at the input. [NLP adapters](https://proceedings.mlr.press/v97/houlsby19a.html) insert bottleneck modules inside Transformer layers, learning a down-projection, nonlinearity, and up-projection. Prompt tuning has fewer intervention points; adapters can modify representations across layers but may add per-layer computation and serving complexity.

A practical sequence is: prompt for fast exploration; compare LoRA or adapters when task state must be stable and versioned; measure latency on target hardware if speed matters, rather than substituting a parameter ratio.

## Define the adaptation budget

Write limits on trainable parameters, optimizer memory, GPU time, per-task storage, latency, and base-weight access. Trainable percentage is not peak memory. Compare methods under fixed data and tuning effort.

## Prompting is adaptation, not a free baseline

Zero/few-shot and structured prompts spend context and latency. Test paraphrases, order, labels, and delimiters. Dynamic example retrieval needs its own leakage and provenance checks.

## Pruning and lottery tickets ask different questions

Unstructured sparsity may not accelerate dense hardware; structured pruning more directly changes runtime. [Lottery-ticket results](https://arxiv.org/abs/1803.03635) do not guarantee arbitrary pretrained pruning. Report sparsity, quality, and measured target-hardware latency.

## LoRA parameters and merging

\[
y=Wx+\frac{\alpha}{r}BAx.
\]

LoRA learns low-rank updates while freezing (W). Rank, alpha, dropout, and target modules define capacity. Adapters can load dynamically or merge into weights; composition requires testing.

## Prompt tuning and prefixes

Prompt tuning learns virtual input embeddings; prefix tuning injects learned key/value states across layers. Both use little state but can consume attention capacity and underfit large domain shifts.

## Adapter bottlenecks and composition

Adapters add down-projection, nonlinearity, up-projection, and residual modules. They provide task boundaries but can add sequential latency. Combining language/domain/task adapters may interact and needs evaluation.

## A method-selection matrix

Use prompting without weight access, LoRA/adapters for shared bases, prompt tuning for tiny state, structured pruning for real shrinkage, and full fine-tuning for a single-task ceiling—then validate rather than treating the table as a verdict.

## A fair adaptation experiment

Fix checkpoint, split, tokens, metrics, and seeds. Compare prompting, LoRA, adapters, and full fine-tuning on quality, parameters, peak memory, time, checkpoint bytes, and latency. Add low-data curves and general-capability forgetting tests.

Simulate multi-tenant switching, mixed-adapter batching, cold load, and merged versus dynamic serving. Preserve base hashes, tokenizer versions, adapter configs, and merge scripts so the adaptation remains reversible.

## Material gap

Winter 2026 recordings are not public. This article covers the DPO and preference-data recap plus all seven adaptation topics. Experimental plots in the deck explain trade-offs but are not generalized to untested tasks.

## References

- [Official CS224N Winter 2026 course page](https://web.stanford.edu/class/cs224n/)
- [Lecture 9 Efficient Adaptation slides](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture09-peft.pdf)
- [LoRA](https://arxiv.org/abs/2106.09685)
- [Parameter-Efficient Transfer Learning for NLP](https://proceedings.mlr.press/v97/houlsby19a.html)
- [The Lottery Ticket Hypothesis](https://arxiv.org/abs/1803.03635)
