---
title: "Foundation Models Overview: Linear Probes, Fine-Tuning, and LoRA"
date: 2026-08-22
type: deep-dive
category: ai
tags: [cs229, foundation-models, fine-tuning, lora]
lang: en
tldr: "Chapter 15 compares linear probing, full fine-tuning, and LoRA—not only by trainable parameter count, but by representation movement, data needs, and memory cost."
description: "A reading of Chapter 15 in the 2026 CS229 notes, from linear probing and full fine-tuning to continued pretraining, LP-FT, and LoRA."
draft: false
series:
  name: "Reading Stanford CS229"
  order: 16
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-15-foundation-models-overview)

**Video status: Official entry or recording index only.** [Source details](#course-video-sources)

This article reads Chapter 15, printed pages 191–195, of the [2026 CS229 main notes](https://cs229.stanford.edu/main_notes.pdf). It is a chapter guide to the current public notes, not a reconstruction of any quarter's recordings or lecture schedule. The goal is to explain the derivational spine and practical choices, not reproduce every proof.

## Course video sources

This article follows the 2026 main notes chapter by chapter, and chapter numbers are not lecture numbers. Both public playlists were checked live (Spring 2026: 17 videos; Autumn 2018: 21 videos), and no single lecture could be matched to this chapter's topic, so nothing is embedded. The official CS229 page currently shows Summer 2026 and sends recordings and materials to a Stanford sign-in Canvas site, so only the public YouTube playlists are used here.

Course and recording entries:

- [Stanford CS229 Machine Learning, Spring 2026 playlist (Stanford Online, 17 videos)](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [Stanford CS229: Machine Learning led by Andrew Ng, Autumn 2018 playlist (21 videos)](https://www.youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU)
- [Official course / lecture source](https://cs229.stanford.edu/)

Checked: 2026-10-10.

## Why pretrain first and adapt later

A foundation model is not one model that magically solves every downstream problem. It first learns reusable parameters from broad data, then adapts with a smaller task-specific dataset. For pretraining samples \(x_1,\dots,x_n\), the generic objective is

\[
L_{\mathrm{pre}}(\theta)=\frac{1}{n}\sum_{i=1}^{n}\ell_{\mathrm{pre}}(x_i,\theta).
\]

Here \(\theta\) denotes model parameters and \(\ell_{\mathrm{pre}}\) may be next-token prediction or another self-supervised loss. Afterward, the model may be used zero-shot or few-shot, or its parameters may be adapted.

## Linear probes and full fine-tuning

Let \(\phi_{\hat\theta}(x)\) be the representation from a pretrained model. A linear probe freezes \(\hat\theta\) and learns only a head \(w\):

\[
\min_w \frac{1}{m}\sum_{i=1}^{m}\ell\bigl(y_i,w^\top\phi_{\hat\theta}(x_i)\bigr).
\]

This tests whether the frozen representation already exposes the task signal through a linear boundary. It is cheap and diagnostically useful. Full fine-tuning instead updates both \(w\) and \(\theta\). That adds capacity, but with limited data it can distort useful pretrained features or fit the training distribution too closely.

LP-FT first trains the linear probe, then uses it to initialize full fine-tuning. The head starts in a sensible region before the representation moves, which can reduce needless feature distortion. When abundant unlabeled in-domain data exists, continued pretraining can precede supervised adaptation.

## LoRA learns a low-rank update

LoRA freezes the original matrix \(W_0\) and constrains its update to \(\Delta W=BA\):

\[
h=W_0x+\frac{\alpha}{r}BAx,
\]

where \(A\in\mathbb{R}^{r\times d_{in}}\), \(B\in\mathbb{R}^{d_{out}\times r}\), and rank \(r\) is small. The trainable count becomes \(r(d_{in}+d_{out})\), rather than \(d_{out}d_{in}\). Multiple tasks can share \(W_0\) and swap compact adapters.

The low-rank constraint applies to the update, not necessarily the merged final weight. LoRA reduces gradients and optimizer state substantially, but the base model must still be loaded; activation memory and forward compute do not fall by the same ratio automatically.

## Assumptions and limits

- A linear probe assumes the needed signal is already encoded and linearly accessible.
- Full fine-tuning is more expressive, but raises cost, overfitting, and forgetting risk.
- LoRA assumes an effective update can be approximated in a low-rank subspace; too small a rank constrains adaptation.
- Continued pretraining is usually more valuable when its domain data better matches the downstream task; a mismatched distribution may consume substantial compute without improving downstream performance.

## Connection to adjacent chapters

Chapter 14 showed how a diffusion model can be trained as a generative model. This chapter extracts the broader pretrain-then-adapt pattern. Chapter 16 asks how representations become useful for classification, retrieval, and RAG in the first place.

## Exercise

For a \(4096\times4096\) weight matrix and LoRA rank \(r=16\), calculate the trainable parameter counts and ratio for full fine-tuning versus LoRA. Then explain why that ratio is not also the reduction in inference memory or computation.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Checked the Spring 2026 and Autumn 2018 public playlists live; no lecture matches this chapter, so status unchanged.

## References

- [CS229 Lecture Notes Chapter 15: Foundation Models, Linear Probes, Fine-Tuning, and LoRA (2026-08-18)](https://cs229.stanford.edu/main_notes.pdf#page=192)
- [Official Stanford CS229 course page](https://cs229.stanford.edu/)
