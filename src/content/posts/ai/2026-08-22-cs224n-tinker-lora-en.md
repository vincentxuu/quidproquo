---
title: "Low-Rank Updates: Preparing for the Tinker Guest Session | Stanford CS224N Lecture 18"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224n, lora, model-adaptation, guest-lecture, stanford]
lang: en
series:
  name: "Reading Stanford CS224N"
  order: 19
tldr: "Work through a low-rank update, distinguish update rank from full-weight rank, and count trainable parameters. This preparation follows the LoRA paper and does not reconstruct the unavailable guest session."
description: "Preparatory reading for CS224N Lecture 18: understand low-rank updates, parameter counts, and limitations through the LoRA paper and an invented matrix example, while preserving the guest-session material gap."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs224n-tinker-lora)

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

Why can LoRA adapt a layer without updating its entire weight matrix? Start from [Lecture 9 on efficient adaptation](/posts/ai/2026-08-22-cs224n-efficient-adaptation-en), then work through a low-rank update. You should be able to distinguish the rank of the update from the rank of the full weight and count trainable parameters.

> **Source scope:** This is preparatory reading based on the original LoRA paper, with an invented example. Lecture 18 is titled Tinker and LoRA Without Regret, but the official schedule still listed no public slide link for this session on 2026-10-11. This preparation does not reconstruct Tinker's classroom interface, experiments, or the meaning of “Without Regret.”

## The update is low-rank, not the whole model

[Section 4.1 of the LoRA paper](https://arxiv.org/html/2106.09685v2#S4.SS1) freezes the original weight `W0` and trains smaller matrices `A` and `B`. For a `d_out × d_in` weight, A is `r × d_in` and B is `d_out × r`; the forward pass is `W0 x + (α/r) B A x`.

The rank of `BA` is at most r, but `W0+BA` need not be low-rank. This limits the directions of adaptation; it does not reduce the original model to r parameters. For one `8 × 8` weight, full fine-tuning updates 64 values. At `r=1`, the two factors contain `8+8=16` trainable values. This counts trainable parameters for that weight only, not total model memory.

## Work through a forward update

This is an invented two-dimensional example. Assume that after some training, `W0=[[1,0],[0,1]]`, `A=[[1,-1]]`, and `B=[[2],[1]]`, with `r=α=1` and input `x=[3,1]`. These are not LoRA initialization settings or a guest lecturer's demonstration.

1. Original branch: `W0 x=[3,1]`.
2. Projection: `A x=3-1=2`.
3. Map back: `B(Ax)=[4,2]`.
4. Add the branches to obtain `[7,3]`.

Equivalently, form `BA=[[2,-2],[1,-1]]` and compute `(W0+BA)x`. The update has rank 1, but the merged weight `[[3,-2],[1,0]]` has determinant 2 and rank 2. This tiny matrix has four full weights, while A and B also contain four values, so there is no parameter saving here; its purpose is hand calculation.

## Change the input and check your understanding

Keep the matrices and use `x=[1,1]`. How does the low-rank branch change the output? Does that establish that no task can get worse?

**Answer:** `Ax=0`, so the update branch produces `[0,0]` and the full output remains `[1,1]`. This input lies in A's null space, but the output for `[3,1]` did change. Neither a low-rank constraint nor one unchanged input guarantees quality on every task, and the session title does not establish such a guarantee.

## Course video sources

Original session attribution: the official schedule lists John Schulman for “Guest Lecture: Tinker and LoRA Without Regret” on March 5, 2026. The preparatory calculations above are independently authored.



Checked live on the official CS224N page: Winter 2026 lecture videos are on Canvas (sign-in required) and the course says they cannot be opened to non-enrolled students; the 2026-10-10 Canvas access test redirected to Stanford sign-in. The official page rechecked on 2026-10-11 still restricts the recordings to enrolled students. The only public recordings the official page points to are the 2024 playlist, and none of its lectures matches this lecture's title, so no video is embedded and recordings from other years are not passed off as this term's.

Course and recording entries:

- [CS224N Spring 2024 public recordings (supplementary)](https://www.youtube.com/playlist?list=PLoROMvodv4rOaMFbaqxPDoLWjDaRAdP9D)
- [Official course / lecture source](https://web.stanford.edu/class/cs224n/)

Checked: 2026-10-11.

## Update Log

- 2026-10-11: Reframed as LoRA preparation with an invented matrix example and answer; saved the source-audit history in research notes.
- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Confirmed Winter 2026 recordings need sign-in and public recordings are the 2024 playlist with no matching lecture; status unchanged and check date added.

## References

- [Official CS224N Winter 2026 course page](https://web.stanford.edu/class/cs224n/)
- [John Schulman's website](http://joschu.net/)

- [LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685)
