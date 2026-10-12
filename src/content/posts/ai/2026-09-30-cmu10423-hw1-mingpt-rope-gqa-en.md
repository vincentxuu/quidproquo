---
title: "Testing minGPT Changes: Shapes, Masks, and Positions | CMU 10-423 Assignment 1"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, homework, transformer, attention, pytorch]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 6
tldr: "Assignment 1 brings sequence modeling and modern attention into code."
description: "A teaching guide based on public Spring 2026 materials: Testing minGPT Changes: Shapes, Masks, and Positions | CMU 10-423 Assignment 1"
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-hw1-mingpt-rope-gqa)

**Video status: recordings require sign-in or course authorization.** This guide uses public slides and assignments; numerical examples are site-authored, not a lecture transcript.

Assignment 1 brings sequence modeling and modern attention into code. Errors often occur in reshaping, head grouping, position offsets, and dropout rather than in recalling a formula. This guide builds a diagnostic testing order. All additional examples are original tests, not complete solutions to the official TODOs.

Prerequisites are Assignment 0's autograd exercise, causal masking from Lecture 2, and RoPE/GQA from Lecture 4. The official basis is `hw1.zip` on the coursework page, containing the handout, starter, and `test_model.py`. Follow the semester's submission and AI-use rules. Earlier notes recorded some archive/document inconsistencies; they do not establish what will happen in your environment.

## Establish a baseline before changing a module

Download and extract the official archive, install Python, PyTorch, and einops using its environment specification, and keep an unmodified copy. Run `python test_model.py` in the starter directory. Unimplemented sections may raise `NotImplementedError`; distinguish those from package imports and file-path failures before diagnosing attention mathematics.

Read `CausalSelfAttention.forward` and annotate shapes at every step. The provided attention implementation is a reference for comparison. Naming the meaning of each axis is more useful than guessing what the model probably does.

## Build a shape ledger

Take B=2, T=3, embedding dimension 8, four query heads, two KV heads, and dimension two per head. The input is `[2,3,8]`. Q contains 48 elements and is arranged as `[2,4,3,2]`. K and V each contain 24 elements and are arranged as `[2,2,3,2]`. Each pair of query heads shares one KV head, yielding scores `[2,4,3,3]`.

Weighted values have shape `[2,4,3,2]`; concatenate the heads into `[2,3,8]` before the output projection. Do not reshape `[B,H,T,D]` directly into `[B,T,H×D]` without moving the H/T axes first. The element count can remain valid while positions and heads become mixed.

K and V together hold 48 elements here, compared with 96 for four independent KV heads. If computation temporarily expands or repeats them, inspect whether this creates physical copies and which version persists in the cache. Output correctness and memory savings require separate evidence.

## Test causal invariance to detect leakage

Use a three-position input with dropout disabled or the model in eval mode. Compute outputs, change only the third input, and recompute. The first two outputs should remain unchanged within floating-point tolerance; the third may change. This directly tests access to future information without requiring particular trained weights.

If the first output changes, inspect whether masking precedes softmax, whether the triangle direction is reversed, and whether reshaping mixes positions. If differences occur only in training mode, first eliminate independently sampled dropout masks. A seed helps reproducibility but does not promise bitwise identity across hardware and kernels.

## Test position offsets and dropout modes independently

The reduced RoPE example from Lecture 4 offers a rotation check: q=k=[1,0], with 90° per position. A one-position difference gives dot product zero, and a two-position difference gives negative one. Moving both positions equally preserves the score. Actual model code must use its specified frequencies and coordinate pairing; the reduced example isolates the indexing mechanism.

If a cache already contains two positions, a new token uses absolute position 2, rather than restarting at zero. Compare a full forward pass with incremental cached passes using the same token sequence. The final-step output should agree. Sampling different tokens during the two runs would confound this check.

Dropout should stop discarding values in eval mode and operate in train mode. Official tests separately cover GQA, RoPE, dropout, and integration. Passing them establishes the behaviors they inspect, not the complete grading result or training quality.

## Variations with answers

Change embedding dimension to 12, query heads to three, KV heads to one, head dimension to four, B=1, and T=5. Q is `[1,3,5,4]`; K/V are each `[1,1,5,4]`; scores are `[1,3,5,5]`; the merged output is `[1,5,12]`. The KV cache contains 40 elements in total.

Suppose changing a future token preserves earlier eval outputs, but full and cached forward passes disagree at the final step. Inspect cache contents, position offsets, and how masks address old and new lengths before changing the optimizer. Only then run a short training smoke test, recording shapes, loss, generation, and memory separately, followed by held-out evaluation.

[Previous](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa-en) | [Next](/posts/ai/2026-09-30-cmu10423-cnn-bert-vit-en) | [Series overview](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en)

## Course Video Sources

The official recording index is on SCS Panopto. The anonymous folder view is unloaded and requests sign-in; this is an access limitation, not evidence that recordings do not exist. Original audio and subtitles require the appropriate course access.

- [Official Panopto recording index](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [Official course homepage](https://www.cs.cmu.edu/~mgormley/courses/10423/)

## References

- [HW1 official archive](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw1.zip)
- [HW1 recitation](https://docs.google.com/presentation/d/1IpSzQ5dkr3iO0riNfareQiif9J9O684amTBATiybuVk/edit?usp=sharing)
- [Coursework](https://www.cs.cmu.edu/~mgormley/courses/10423/coursework.html)
- [minGPT](https://github.com/karpathy/minGPT)
- [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [read-only Overleaf template](https://www.overleaf.com/read/sdrhkbjjdhwv#8049a1)
- [schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
- [Lecture 4 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture4-rope-gqa.pdf)
- [Su et al. 2021: RoFormer: Enhanced Transformer with Rotary Position Embedding](https://arxiv.org/abs/2104.09864)
- [Ainslie et al. 2023: GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints](https://arxiv.org/abs/2305.13245)
