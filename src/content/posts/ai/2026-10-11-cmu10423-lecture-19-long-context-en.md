---
title: "Long Context: Fitting Input Is Not Reliable Retrieval | CMU 10-423 Lecture 19"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 24
description: "Long Context: Fitting Input Is Not Reliable Retrieval | CMU 10-423 Lecture 19"
draft: false
---

> [繁體中文版](/posts/ai/2026-10-11-cmu10423-lecture-19-long-context)

**Video status: recordings require login or course authorization.** This guide uses the public slides for Lecture 19 of CMU 10-423 Spring 2026. Worked examples and variations are teaching additions.

A model accepts all company policies in a prompt but gives the wrong refund deadline. Position encoding, attention/KV memory, and reliable information use are separate possible problems. A large advertised context window does not resolve all three.

Prerequisites are [RoPE and KV heads](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa-en) and [efficient inference](/posts/ai/2026-10-11-cmu10423-lecture-18-efficient-inference-en). SSMs are developed separately.

## Extending positions

RoPE represents positions as rotations of queries and keys, making relative position affect their inner products. A model trained up to length L may encounter unfamiliar rotations when positions are extended far beyond L. Valid indices do not imply learned competence.

Position interpolation compresses coordinates: to extend L to L', use `p_scaled=p×L/L'`, then adapt through suitable fine-tuning. Adjacent tokens become closer in the coordinate system, so adaptation still matters. Other RoPE extensions use different frequency or scaling strategies.

For an illustrative L=8 and L'=16, positions 0,4,8,12 become 0,2,4,6. At L'=32, position 12 becomes 3. This demonstrates coordinates, not accurate comprehension or cost-free extension.

## Memory is a separate constraint

Dense attention considers roughly n² token pairs. FlashAttention reduces memory IO and avoids materializing the full score matrix; it does not eliminate dense pairwise computation. Blockwise and Ring Attention distribute sequence blocks across devices, with communication and scheduling costs.

For an illustrative single sequence with 32 layers, eight KV heads, head dimension64, and two-byte FP16 values, K and V require `32×2×8×64×2=65536` bytes per token. At 8,192 tokens that is 512MiB; at 32,768 it is 2GiB. This excludes weights, temporary tensors, and batching. Halving KV heads halves this cache but does not establish position or retrieval quality.

Training activations and gradients differ from inference caches. Completing long prefill does not prove acceptable continuous decoding latency or quality.

## A controlled retrieval experiment

Create four equal-length policy passages containing exactly one valid fact: “The standard plan has a 14-day refund window.” Keep the question fixed and move the relevant passage through positions 1–4 while retaining text and total length. Require both the number and its source passage.

Suppose three trials per position yield correct counts 3,1,1,3. The position rates are 100%,33%,33%,100%; overall accuracy is 8/12. These are invented teaching results, not a model benchmark. The average hides middle-position failures. A correct number with a wrong citation should not count as successful evidence retrieval.

Add a clearly marked old-policy passage saying seven days. The task now includes selecting the correct version and plan, not merely finding a number. Its score should not be mixed uncritically with the single-fact task. Lost in the Middle reports position sensitivity in studied models and tasks, not an inevitable curve for every future model.

## Variations diagnose causes

With four trials per position and counts 4,2,1,4, rates are 100%,50%,25%,100%, overall11/16. Holding length fixed while moving evidence tests position sensitivity. Holding position fixed while adding distractors tests length/interference effects. Changing both simultaneously obscures the cause.

Does accepting 32k input but missing “14 days” prove position extension failed? No: version confusion, information use, or prompting may be responsible. First check truncation, then use controlled variations. Retrieval can narrow candidate evidence; long context can retain broader background. Both need evidence-selection evaluation. Capacity is not completion.


## Continue reading

- [Previous](/posts/ai/2026-10-11-cmu10423-lecture-18-efficient-inference-en)
- [Next](/posts/ai/2026-09-30-cmu10423-reasoning-models-en)

## Course video sources

The official [course homepage](https://www.cs.cmu.edu/~mgormley/courses/10423/) provides a Panopto recording link; access requires login or course authorization. This is a slide-based guide; it does not include a recording transcript, captions, or original-audio shadowing material.

## References

- [CMU Lecture 19 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture19-long.pdf)
- [Lost in the Middle](https://arxiv.org/abs/2307.03172)
- [Position Interpolation](https://arxiv.org/abs/2306.15595)
- [Ring Attention](https://arxiv.org/abs/2310.01889)
