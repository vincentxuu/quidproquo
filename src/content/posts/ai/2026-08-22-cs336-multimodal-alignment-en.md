---
title: "CS336 Lecture 17: Multimodal Models Turn Images into Tokens, Then Reconcile Semantics with Detail"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs336, multimodal, vision-language-model, clip, qwen-vl]
lang: en
series:
  name: "Reading Stanford CS336"
  order: 18
tldr: "Lecture 17 organizes CLIP/SigLIP, LLaVA, Qwen-VL, and Chameleon into three paths: contrastive encoders learn semantics, vision-encoder/projector/LM stacks provide understanding, and discrete image tokens enable generation. Resolution, token budgets, and modality balance constrain them all."
description: "A guide to Stanford CS336 Spring 2026 Lecture 17: CLIP, SigLIP, LLaVA and AnyRes, Qwen-VL dynamic resolution, multimodal RoPE, VQ-VAE, and unified generation models."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs336-multimodal-alignment)

This post covers **CS336 Spring 2026 Lecture 17: Alignment — multimodality**, taught by Percy Liang on May 27, 2026. Its primary source is the official executable lecture, [`lecture_17.py`](https://github.com/stanford-cs336/lectures/blob/main/lecture_17.py). This is the final regular lecture; the two later guest sessions are outside the 17-lecture series.

Transformers consume tokens. Text needs tokenization, and images or video likewise need conversion into processable units. Understanding benefits from high-level semantics, while generation requires color, texture, and spatial detail. One representation rarely optimizes both.

## CLIP learns semantics through contrastive training

CLIP collects image-text pairs and encodes images and text separately. Within a batch, each image should be closer to its caption than other captions, and the text-to-image direction is trained too. Large noisy pair collections provide supervision without manual class labels.

The contrastive objective needs many negatives, encouraging large batches and cross-device softmax. Fixed resize and crop procedures discard detail, especially for OCR, charts, and small objects. The representation captures semantics expressed by captions, not a reversible image.

SigLIP replaces batch-wide multiclass softmax with binary sigmoid loss for each image-text pair, reducing global normalization coupling. It performs well without unlimited batch growth, while data quality, OCR extraction, and multilingual coverage remain central.

## LLaVA establishes the vision-encoder, projector, and LM template

A standard vision-language model uses a CLIP- or SigLIP-like encoder, maps visual features through a linear or MLP projector into the language-model embedding space, and processes them with text tokens in a decoder.

LLaVA's alignment stage freezes the vision encoder and LM and trains only the projector. Instruction tuning later updates projector and LM. Instruction data is frequently synthesized from captions, detected objects, or images through another LLM, so behavior depends heavily on data generation and task mixture.

Cropping every image to low fixed resolution damages OCR. AnyRes divides high-resolution images into encoder-sized tiles, encodes them separately, and concatenates them. Larger images then consume more tokens, creating a tradeoff among detail, context window, and latency. Multiple images and video usually lower per-image or per-frame resolution to control the budget.

## Qwen-VL places resolution and time inside tokenization

Qwen-VL generations use dynamic resolution, patching and compressing different image sizes so token count follows information content. Video adds frame sampling; explicit timestamp tokens can represent time rather than relying only on positional embeddings.

Multimodal RoPE distributes temporal, height, and width axes over position frequencies. DeepStack-like fusion injects visual features into several LM layers rather than only at input.

Long video produces many more tokens than text. A token-averaged loss can let video dominate gradients, motivating per-example or square-root-normalized weighting. A shared token interface does not make information density or training dynamics identical.

## Understanding and generation need different encoders

CLIP optimizes semantic similarity and cannot reconstruct pixels. Autoregressive image generation instead uses VQ-VAE-like tokenizers to map images into discrete codebook indices modeled with text. Chameleon follows this unified route, but quantization loses fine detail such as OCR.

Image tokens also have higher entropy than text tokens and can cause norm growth or logit drift, motivating QK norm, z-loss, and balanced data. Another common design keeps a continuous vision encoder for understanding and a diffusion decoder for generation, accepting that the system is not one pure autoregressive model.

## How to evaluate a multimodal model

Separate image retrieval and classification, OCR, charts and documents, spatial relations, multi-image comparison, temporal video reasoning, and generation fidelity. Sweep resolution, visual tokens, frames, and latency for each. Record which encoder, projector, and LM parameters are frozen at every stage and where synthetic instruction data originates.

Lecture 17 returns the course to Lecture 1: every modality eventually needs tokenization, and the token choice determines both what the model preserves and what it pays to process.

## Material fidelity

This lecture has a Spring 2026 schedule entry and a complete executable artifact. This guide follows its CLIP, SigLIP, LLaVA, Qwen-VL, and Chameleon sections without including later guest sessions.

## References

- [CS336 Spring 2026 course and schedule](https://cs336.stanford.edu/)
- [Lecture 17 executable lecture](https://github.com/stanford-cs336/lectures/blob/main/lecture_17.py)
- [CLIP](https://arxiv.org/abs/2103.00020)
- [LLaVA](https://arxiv.org/abs/2304.08485)

