---
title: "CS336 Lecture 4: Attention Has Alternatives, and MoE Does Not Scale for Free"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs336, llm, attention, mixture-of-experts, mamba]
lang: en
series:
  name: "Reading Stanford CS336"
  order: 5
tldr: "Lecture 4 studies two kinds of sparsity: linear/recurrent attention reduces sequence-length cost, while MoE activates only part of a model for each token. Both turn saved FLOPs into routing, balancing, communication, and kernel problems."
description: "A guide to Stanford CS336 Spring 2026 Lecture 4: linear attention, Mamba-2, Gated DeltaNet, sparse attention, MoE routing, load balancing, expert parallelism, and upcycling."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs336-attention-moe)

This post covers **CS336 Spring 2026 Lecture 4: Attention alternatives and mixture of experts**, taught by Tatsunori Hashimoto on April 8, 2026. Its primary source is the official [`lecture_04.pdf`](https://github.com/stanford-cs336/lectures/blob/main/lecture_04.pdf).

The lecture places two topics together that are often discussed separately: attention alternatives and mixture of experts (MoE). They share a question: can a model gain longer context or more parameters without making every token pay the full cost? Structured sparsity can do that, but saved arithmetic becomes a new optimization and systems problem.

## Linear attention changes multiplication order

Standard attention constructs `QKᵀ`, producing an `n × n` matrix for sequence length `n`. If softmax is temporarily removed, associativity gives:

```text
(QKᵀ)V = Q(KᵀV)
```

The right side avoids storing the full attention matrix and can turn quadratic sequence cost into linear cost. A causal version can also be written as recurrent state: add each new key/value outer product to the state, then read it with the query. Training can remain parallel while inference updates a fixed-size state recurrently.

Softmax is not a disposable decoration, however. Linear attention requires a kernel feature map or another gating mechanism, so its expressivity and stability no longer match standard attention automatically. Practical models therefore often use hybrids: most layers use linear or recurrent blocks, with occasional full-attention layers preserving exact token-to-token access.

## From Mamba-2 to Gated DeltaNet

Mamba-2 can be viewed as adding an input-dependent decay gate to linear recurrent state. Old information no longer accumulates forever; each token controls what persists. Gated DeltaNet adds a write gate and an update that erases state along the current key direction, allowing the model both to skip writes and overwrite similar memories.

The lecture does not claim that one mechanism has replaced Transformers. Public models more often demonstrate the hybrid route: recurrent or linear blocks scan long sequences cheaply, while a small number of full-attention layers provide exact recall. Sparse attention offers another route by using a lightweight indexer to select positions before attending only to those tokens.

## MoE makes parameter activation sparse

Every token in a dense Transformer passes through the same feed-forward network. MoE replaces it with multiple experts and a router that selects a small subset per token. Total parameters can grow substantially while per-token active parameters and FLOPs grow only with selected experts.

Token-choice top-k routing is the common design. A router scores experts, selects the highest k, and combines their outputs by gating weights. Models vary the number and size of experts, how many are active, and whether some shared experts always run. Total parameters alone are therefore misleading; active parameters and communication paths determine inference cost.

## The router has two hard problems

First, discrete selection is not differentiable. Practical systems make top-k choose the sparse path while gradients flow through selected gating weights. Earlier work also explored REINFORCE and stochastic perturbations, but no single clean solution dominates.

Second, load can become unbalanced. If many tokens choose the same expert, one device becomes congested while others idle. An auxiliary load-balancing loss can push utilization toward uniformity. Other systems maintain a dynamic bias per expert to lower the routing probability of overloaded experts.

These methods create another tradeoff. A strong balancing objective can interfere with learned specialization; a weak one can collapse hardware utilization. Router z-losses are also used to keep logits controlled and softmax stable.

## Expert parallelism distributes parameters and creates all-to-all traffic

MoE naturally places different experts on different devices. After routing, token activations travel to the selected devices and return after computation. This is all-to-all communication: arithmetic is sparse, but network traffic can dominate.

MoE advantages therefore appear most clearly at multi-node scale, with infrastructure more complex than for dense models. Capacity limits, token dropping, routing stochasticity, and fine-tuning overfit are costs hidden by the phrase “more parameters at the same FLOPs.”

## Upcycling grows experts from a dense checkpoint

An MoE need not begin from scratch. Upcycling copies existing dense feed-forward weights into several experts, then continues training so they can specialize. It reuses an expensive checkpoint, but initially identical experts still require the router and further optimization to diverge.

The lecture uses successive DeepSeek MoE designs to show another direction: more fine-grained experts, few active experts, shared experts, latent attention, and multi-token prediction. These components act together, so model results cannot be attributed to MoE alone.

## How to choose after this lecture

For a long-context bottleneck, compare local/full hybrids, sparse attention, and recurrent/linear hybrids. Evaluate quality, prefill cost, decode state, and kernel support. For increasing parameter capacity without proportional FLOPs, consider MoE only while including router balance, all-to-all bandwidth, and serving batch behavior in the design.

Sparsity does not eliminate cost; it relocates it. The durable test from Lecture 4 is to ask what state, routing, communication, or kernel complexity appears whenever an architecture claims to reduce FLOPs.

## Material fidelity

This lecture has a Spring 2026 schedule entry and a complete official PDF. This guide follows its attention-alternative, MoE-routing, training, and systems sections.

## References

- [CS336 Spring 2026 course and schedule](https://cs336.stanford.edu/)
- [Lecture 4 official slides](https://github.com/stanford-cs336/lectures/blob/main/lecture_04.pdf)
- [Mamba-2: Transformers are SSMs](https://arxiv.org/abs/2405.21060)
- [Switch Transformers](https://arxiv.org/abs/2101.03961)

