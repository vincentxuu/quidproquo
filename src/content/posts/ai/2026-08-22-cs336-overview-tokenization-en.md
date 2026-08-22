---
title: "CS336 Lecture 1: From Bytes to a Tokenizer—and What Deserves to Scale"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs336, llm, tokenization, bpe, stanford]
lang: en
series:
  name: "Reading Stanford CS336"
  order: 2
tldr: "CS336's first lecture does not treat building a language model from scratch as reenacting every old technique. It separates mechanics, mindset, and intuitions, then uses BPE to show how raw bytes become trainable tokens."
description: "A complete guide to Stanford CS336 Spring 2026 Lecture 1: why the course exists, which knowledge transfers to frontier scale, the main arc of language modeling, and how byte-level BPE tokenizers are trained."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs336-overview-tokenization)

This post covers Stanford **CS336 Spring 2026 Lecture 1: Overview, tokenization**, taught by Percy Liang on March 30, 2026. Its primary source is the official executable lecture, [`lecture_01.py`](https://github.com/stanford-cs336/lectures/blob/main/lecture_01.py), rather than a reconstruction from videos of an earlier offering.

The lecture does two things. First, it asks why anyone should build a language model from scratch when GPT, Claude, and Gemini are available through APIs. It then starts from raw bytes and implements a byte-level BPE tokenizer. These are two parts of the same argument: identify the abstractions that limit scaling, then open them up by building them.

## The course is not against abstraction; it warns that abstractions leak

Liang lays out a timeline of researchers moving away from the underlying technology. Researchers once implemented and trained their own models, later downloaded BERT and fine-tuned it, and now prompt models through APIs. Higher abstractions increase productivity, but language-model abstractions remain leaky. Researchers who want to change the foundations cannot work exclusively through the topmost interface.

This is not a claim that everyone should reproduce a frontier model. The lecture says plainly that the resources and opacity surrounding frontier systems put them beyond the reach of ordinary research groups. The course instead preserves three kinds of knowledge:

- **Mechanics:** how Transformers, tokenizers, and model parallelism work.
- **Mindset:** treating hardware, data, and time as finite budgets and continually pursuing efficiency.
- **Intuitions:** which data and modeling decisions might improve quality.

The first two transfer more reliably across scales. The third is dangerous because intuition learned from small models may not extrapolate to frontier models. This distinction establishes the contract for the next sixteen lectures: CS336 can teach verifiable mechanisms and accounting, but it will not present small-scale experiments as universal laws of frontier training.

## The bitter lesson leaves an efficiency requirement

The lecture rejects a common misreading of the bitter lesson. The point is not that scale matters and algorithms do not; it is that **algorithms that scale matter**. The slides compress the idea into one expression:

```text
accuracy = efficiency × resources
```

Waste scales with the resource budget, so efficiency becomes more important at larger scales. This gives “from scratch” a practical test. The goal is not hand implementation for its own sake, but understanding how a design changes compute, memory, data requirements, and final quality.

The historical survey follows the same axis: n-grams to neural language models, LSTMs to Transformers, GPT-3's in-context learning, scaling laws, Chinchilla, open-weight models, and fully open training efforts. There are many dates and names, but one spine holds them together: every advance changes both what a model can do and how resources turn into capability.

## A language model sees tokens, not text

A language model assigns probabilities to token sequences, and the tokenizer decides how raw text becomes that sequence. Character tokenization runs into large alphabets and unknown symbols. Word tokenization creates an enormous vocabulary and handles rare words poorly. CS336 uses byte-level BPE: encode the input as UTF-8 bytes, then repeatedly merge the most frequent adjacent token pair.

BPE training reduces to four steps:

1. Start with the 256 possible byte values as the initial vocabulary.
2. Scan the training corpus and count adjacent token pairs.
3. Merge the most frequent pair into a new token and record the rule.
4. Repeat until the vocabulary reaches its target size.

Encoding cannot repeat the statistical search. It must apply the learned merges in training order; otherwise the same string could produce a different tokenization. That is why the assignment cares about more than plausible output. Data structures, tie-breaking, special tokens, and pre-tokenization all affect reproducibility.

## Vocabulary size has no free lunch

A small vocabulary produces longer sequences, forcing the Transformer to process more positions. A large vocabulary expands the embedding and output matrices while making rare tokens harder to learn. Compression ratio is therefore one useful measurement, not the sole objective.

Starting from bytes eliminates unknown tokens: every UTF-8 input can eventually be decomposed into bytes. But encodable does not mean well tokenized. Languages, source code, numbers, and symbols receive different compression behavior, and the training corpus writes those preferences directly into the tokenizer. What looks like preprocessing already determines the model's basic units and sequence cost.

## What to build after this lecture

Reading the BPE definition alone makes it easy to miss efficiency and edge cases. A small implementation exercise keeps the point intact:

1. Begin with a byte vocabulary and avoid an existing tokenizer library.
2. Implement pair counting, merge selection, and merge application.
3. Test round trips on Chinese, English, and source code outside the training corpus.
4. Compare token counts and embedding parameter counts across vocabulary sizes.

The last step reconnects tokenization to the course's main theme. Every token removed saves a sequence position downstream; every vocabulary entry added creates another row in the input and output matrices. You are not merely selecting a neat segmentation algorithm—you are allocating cost across the whole training system.

## Material fidelity

This lecture has a Spring 2026 schedule entry, a complete executable lecture, and an official course recording playlist, so it can be aligned to the offering. This guide uses the lecture artifact as its primary source and does not merge in Spring 2025 videos, assignment details, or later model developments.

## References

- [CS336 Spring 2026 course and schedule](https://cs336.stanford.edu/)
- [Lecture 1 executable lecture](https://github.com/stanford-cs336/lectures/blob/main/lecture_01.py)
- [Official CS336 Spring 2026 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMqXOcazWaTUHhq-yembLCV)
- [Assignment 1: Basics](https://github.com/stanford-cs336/assignment1-basics)

