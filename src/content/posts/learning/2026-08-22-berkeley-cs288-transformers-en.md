---
title: "Berkeley CS288 Part 2: Sequence Models, Seq2Seq, and Transformers"
date: 2026-08-22
category: learning
tags: [berkeley, cs288, nlp, transformer, sequence-model]
lang: en
type: guide
difficulty: 深度
tldr: "Units 05–07 move from recurrent state to encoder-decoder models, then rewrite the information path with attention and Transformer blocks."
description: "A guide to CS288 Sequence Models, Sequence-to-Sequence, and Transformers, connected to the from-scratch A2 implementation."
draft: false
series: { name: "Berkeley CS288 Spring 2026", order: 2 }
---

> 🌏 [中文版](/posts/learning/2026-08-22-berkeley-cs288-transformers)

The through-line of [units 05–07](https://cal-cs288.github.io/sp26/) is information flow across positions. A sequence model updates state; seq2seq separates encoder and decoder; attention lets the decoder select source positions directly; a Transformer replaces the recurrent path with parallel attention blocks.

## Compare information paths, not labels

An RNN compresses history into a fixed-size state, forcing distant information through repeated updates. Seq2seq structures input and output but can retain a context bottleneck. Attention creates content-addressed shortcuts. Transformers must then account explicitly for position, masking, normalization, and residuals.

While reading equations, label every tensor shape and draw token-to-token dependencies. This catches causal-mask, head-reshape, and residual mistakes faster than memorizing the words query, key, and value.

## A2 turns architecture into testable components

[Assignment 2](https://cal-cs288.github.io/sp26/assignments/Sp2026_CS288_Assignment2.pdf) implements BPE, RMSNorm, SiLU, SwiGLU, RoPE, scaled dot-product attention, causal multi-head attention, Transformer blocks, and an LM, followed by training utilities, FLOPs, and memory estimates. Its [starter repository](https://github.com/zinengtang/cs288-sp26-a2) is public.

Preserve the component tests. Verify shapes, masks, and numerical stability on tiny tensors before training TinyStories. Without a GPU, reduce layers, hidden size, and context length; correctness remains testable. Hidden tests and official Gradescope remain unavailable, so local success is not official completion.

## References

- [CS288 Spring 2026 schedule and slides](https://cal-cs288.github.io/sp26/)
- [Assignment 2 specification](https://cal-cs288.github.io/sp26/assignments/Sp2026_CS288_Assignment2.pdf)
- [Assignment 2 starter repository](https://github.com/zinengtang/cs288-sp26-a2)

