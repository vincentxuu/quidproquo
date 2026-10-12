---
title: "SFT and RLHF: From Demonstrations to Preferences and Rewards | CMU 10-423 Lecture 11"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 15
draft: false
description: "A complete worked example and answered variations for SFT and RLHF: From Demonstrations to Preferences and Rewards."
---

> 🌏 [中文版](/posts/ai/2026-10-11-cmu10423-lecture-11b-sft-rlhf)

**Video status: recordings require login or course authorization.** [Sources](#course-video-sources)

This guide follows [CMU 10-423](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 public slides. Worked examples are original teaching additions.

## Three kinds of data, three learning signals

[SFT and RLHF](https://arxiv.org/abs/2203.02155) are not interchangeable model names. SFT imitates prompt–demonstration pairs. A reward model learns from two answers to the same prompt plus a preference. The reinforcement-learning stage scores fresh policy samples using that reward model. You need the conditional-probability view from [language-model training](/posts/ai/2026-10-11-cmu10423-lecture-03-training-decoding-en). The goal is to distinguish all three records for one task.

For response y=(y₁,…,y_T), the SFT loss is −Σ log π(y_t|x,y_<t). Instruction tuning commonly computes loss only on response tokens, with prompt tokens as context. This is a training choice, not a universal rule for language modeling. Exclude padding and treat EOS consistently with the objective. An incorrect shift can expose the answer token to the model.

## Follow one support question through the pipeline

This is an original teaching example. The prompt asks why a refund has not arrived. A demonstration says to check the refund date and contact support after the stated processing window. Compress that answer into two toy tokens with correct-token probabilities 0.5 and 0.25. The sequence probability is 0.125 and the summed negative log-likelihood is approximately 2.079. Averaging per token gives 1.040. This is a reduction choice, not a quality improvement.

A preference record compares A, “Please provide the refund date so we can check,” with B, “It will definitely arrive today.” Preferring A does not assign a literal reward of one to A and zero to B. The reward model outputs real-valued scores and models the win probability as σ(r_A−r_B). Scores two and zero give probability approximately 0.881 and loss 0.127. Adding 100 to both leaves the loss unchanged: pairwise preferences do not identify an absolute reward offset.

## Why keep a reference policy?

Maximizing learned reward alone can push the policy into regions where the reward model is unreliable, such as elaborate reassuring language that does not resolve the refund. A typical RLHF objective includes E[r]−β KL(π||π_ref). The fixed reference is often copied from the SFT model. Updating it together with the policy would remove this fixed anchor.

For one sampled answer, log π(y|x)−log π_ref(y|x) supplies a KL-related signal. This sample value can be negative; the full distributional KL is nonnegative after taking the expectation. PPO also uses the rollout's old policy for ratios and clipping. That old policy and the reference have distinct roles.

## Preference fit still needs factual evaluation

If evaluators reward confident promises, preference training can reinforce false guarantees. Define the relevant refund conditions, treatment of unknown information, and assessment rubric. Hold out new situations for evaluation. Lower training loss demonstrates a better fit to the signal, while factual correctness, refusal rates, and tone need separate checks.

## Check your understanding

Scores five and three still give a 0.881 preference probability because their difference remains two. Can a dataset containing only one ideal answer directly train a Bradley–Terry pairwise comparison? No: it lacks a comparison answer and preference label, though it can support SFT. If policy and reference start identical, full KL starts at zero and can change after an update. Continue to [DPO](/posts/ai/2026-10-11-cmu10423-lecture-12a-dpo-en), which uses preference pairs without a separately trained reward model or online rollout loop.

## Course video sources

The [official Spring 2026 course site](https://www.cs.cmu.edu/~mgormley/courses/10423/) directs recordings to SCS Panopto. On 2026-10-12, anonymous retrieval returned an unloaded folder and a sign-in prompt, without playable classroom content. This establishes an access limit, not the absence of recordings. This guide uses public slides and linked primary papers; examples are original teaching additions, not a transcript. [Official recording folder](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22).

## References

- [CMU 10-423 Spring 2026 Lecture 11 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture11-ift-rlhf.pdf)
- [Primary paper](https://arxiv.org/abs/2203.02155)
- [Official schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
