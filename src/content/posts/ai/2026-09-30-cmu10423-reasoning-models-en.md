---
title: "Reasoning Models: Spending Compute on Verifiable Answers | CMU 10-423 Lecture 20"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 25
description: "Reasoning Models: Spending Compute on Verifiable Answers | CMU 10-423 Lecture 20"
draft: false
---

> [繁體中文版](/posts/ai/2026-09-30-cmu10423-reasoning-models)

**Video status: recordings require login or course authorization.** This guide uses the public slides for Lecture 20 of CMU 10-423 Spring 2026. Worked examples and variations are teaching additions.

Five lines can produce a wrong answer; fifty can too. The relevant change in reasoning models is how additional computation supports candidate generation, correction, tools, and verification. Lecture 20 also covers mechanistic interpretability: readable explanations and internal causal mechanisms are different evidence.

Prerequisites are [sampling](/posts/ai/2026-10-11-cmu10423-lecture-03-training-decoding-en) and [SFT/RLHF](/posts/ai/2026-10-11-cmu10423-lecture-11-icl-sft-rlhf-en).

## Training and inference compute

Chain-of-thought prompting changes outputs without updating weights. STaR selects reasoning that leads to correct answers and uses it for fine-tuning; a correct final answer does not establish fidelity of every intermediate statement. Reinforcement learning connects rewards to policy updates.

DeepSeek-R1-Zero explores reasoning RL without the preceding SFT stage used in many pipelines. Full R1 includes cold-start data and multiple stages; “R1 has no SFT” conflates them. Public o1 results illustrate scaling training and inference computation without revealing every implementation detail.

At inference, one can sample more candidates, extend one candidate, or invoke a verifier. Correlated samples can repeat the same error, and a verifier favoring presentation can consistently choose a wrong answer.

## A worked candidate test

Two tickets cost 120 each plus a 10% fee on the total. Base cost is 240, fee24, total264. Candidates264,252,264,240 yield 264 by majority; an arithmetic verifier also accepts264.

Change candidates to 264,252,252,240. Majority now selects252, while the condition-aware verifier still selects264. More samples and selection policy must be evaluated together. A different fee rule can coincidentally produce the same number; verification must follow the conditions rather than memorize the result. If no candidate passes, retry or report failure instead of forcing a wrong selection.

## GRPO's group-relative advantage

GRPO samples a group for the same prompt and normalizes rewards using their group mean and standard deviation, avoiding a separately trained value model. For illustrative rewards `[1,0,1,0]`, the mean is .5 and population standard deviation .5. Ignoring a numerical-stability epsilon, advantages are `[1,−1,1,−1]`. They rank responses relative to their peers; they are not correct-answer labels for individual tokens.

Updates still involve new/old policy probability ratios, clipping, and reference-policy KL regularization. With illustrative clip width.2, positive advantage1 and ratio1.3 produce `min(1.3,1.2)=1.2`. Negative advantage−1 and ratio .7 produce `min(−.7,−.8)=−.8`. These are local surrogate terms, not the full loss; averaging and KL remain. Clipping is not a universal guarantee against policy drift.

Variation: rewards `[1,1,1,1]` have mean1 and zero variance. Implementations must handle this case; stabilized centered advantages are all zero. The group supplies no relative preference signal, though KL gradients may remain. Rewarding formatting alone can improve formatting without improving correctness.

## Explanations and mechanisms

Superposition allows limited-dimensional representations to encode multiple sparse features, so one neuron need not correspond to one named concept. Sparse autoencoders decompose activations into a sparse feature dictionary; circuits and cross-layer transcoders investigate paths across layers.

Correlation with an answer is insufficient. Ablation, activation patching, and replication across tasks provide stronger causal evidence. Reconstruction error, missing features, and approximation by replacement models constrain conclusions. Finding a “reasoning feature” does not prove every written explanation faithfully reports internal computation.

Final variation: longer outputs double cost with unchanged accuracy. Under the same quality requirement, this supplies no improvement evidence. Fix tasks, rewards, tools, and selection rules; measure accuracy, token cost, and latency together. Explanation quality, answer correctness, and mechanistic understanding need separate tests.


## Continue reading

- [Previous](/posts/ai/2026-10-11-cmu10423-lecture-19-long-context-en)
- [Next](/posts/ai/2026-10-11-cmu10423-lecture-21-state-space-models-en)

## Course video sources

The official [course homepage](https://www.cs.cmu.edu/~mgormley/courses/10423/) provides a Panopto recording link; access requires login or course authorization. This is a slide-based guide; it does not include a recording transcript, captions, or original-audio shadowing material.

## References

- [CMU Lecture 20 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture20-reasoning.pdf)
- [DeepSeekMath / GRPO](https://arxiv.org/abs/2402.03300)
- [DeepSeek-R1](https://arxiv.org/abs/2501.12948)
- [STaR](https://arxiv.org/abs/2203.14465)
- [Toy Models of Superposition](https://transformer-circuits.pub/2022/toy_model/index.html)
