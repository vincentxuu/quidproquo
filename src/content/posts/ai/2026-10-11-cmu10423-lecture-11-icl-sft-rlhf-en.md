---
title: "ICL, SFT, and RLHF: From Changing Inputs to Changing Weights | CMU 10-423 Lecture 11"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 14
draft: false
description: "Separate what ICL, SFT, reward models, and RLHF each change, with worked examples and answered variations."
---

> 🌏 [中文版](/posts/ai/2026-10-11-cmu10423-lecture-11-icl-sft-rlhf)

**Video status: recordings require login or course authorization.** [Sources](#course-video-sources)

This guide follows [CMU 10-423](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 public slides. Worked examples are original teaching additions.

Lecture 11 follows one line: first change only the input (in-context learning), then change the weights—SFT on demonstrations, a reward model trained on preferences, and reinforcement learning against that reward model. The first part separates example effects, formatting, and leakage; the second separates the demonstration, preference, and reward records for a single task.

## In-Context Learning: How Examples Change Predictions

### Same weights, different conditions

In-context learning (ICL) places task instructions and examples in the inference context. Unlike [LoRA](/posts/ai/2026-10-11-cmu10423-peft-en), ordinary ICL performs no optimizer step. The weights stay fixed, while p(y|prompt) changes because the prompt changes. Building on [decoding](/posts/ai/2026-10-11-cmu10423-lecture-03-training-decoding-en), this part teaches controlled comparisons that distinguish example effects, formatting, and leakage. Its course material includes the zero/few-shot section at the end of Lecture 9 and ICL in Lecture 11.

The [GPT-3 paper](https://arxiv.org/abs/2005.14165) uses zero-shot, one-shot, and few-shot task settings. A shot is a completed task example, not a sentence in the prompt. A long instruction can still be zero-shot. Chain-of-thought is a separate dimension: whether an example includes reasoning, rather than just an input and answer.

### A controlled classification example

Our original task uses arbitrary labels: A means the reviewer liked the film, B means they disliked it. Hold the test sentence fixed: “The pacing is slow, but I like the character details.” The zero-shot prompt provides the label rule and test sentence. A few-shot prompt additionally includes “So boring I left → B” and “Slow, but the characters are moving → A.” The second example demonstrates that slow pacing need not imply a negative overall judgment.

Without running a model, we cannot claim it will answer A. We can say the few-shot prompt supplies a relevant judgment pattern. If its output changes from B to A, more controls are needed. Reverse example order while preserving everything else. Then preserve label counts but replace the examples with unrelated reviews. Record predictions, output-format compliance, and prompt token counts. These comparisons distinguish order, relevance, and cost.

### Useful examples can also mislead

Causal attention allows the test position to attend to preceding demonstrations. Pattern recognition, format continuation, and task associations learned during pretraining may contribute. Behavior that resembles learning does not prove the model internally executes a particular gradient algorithm. Examples also consume context and prefill computation on each request unless the serving system provides an applicable cache.

If every example ends in A, the model may learn an answer bias rather than the classification criterion. If a demonstration contains the exact test sentence and answer, that is leakage. Retrieval of similar solved tasks also requires a clear boundary between reference material and evaluation data; nearest-neighbor recall should not be presented as new reasoning ability.

### Reasoning examples do not guarantee correctness

A chain-of-thought demonstration might separate pacing from overall enjoyment. Yet fluent explanations can still rationalize a wrong guess. Evaluate against a predefined criterion and a counterexample: “The characters are subtle, but watching this was painful.” The overall judgment is negative, so B is appropriate. Answering A solely because of “subtle” reveals a failure to apply the intended rule.

### Check your understanding

Do ten different demonstration prompts with fixed weights constitute fine-tuning? No: there are no parameter updates. What should happen if the example labels contradict one another? No particular output is guaranteed; measure sensitivity and error rates and examine whether the model recognizes ambiguity. A comparison with SFT needs the same held-out evaluation data and separate accounting for training versus per-request inference costs. The second half, on SFT and RLHF, shows how the data changes when weights actually update.

## SFT and RLHF: From Demonstrations to Preferences and Rewards

### Three kinds of data, three learning signals

[SFT and RLHF](https://arxiv.org/abs/2203.02155) are not interchangeable model names. SFT imitates prompt–demonstration pairs. A reward model learns from two answers to the same prompt plus a preference. The reinforcement-learning stage scores fresh policy samples using that reward model. Unlike ICL in the first part, all three stages update the weights. You need the conditional-probability view from [language-model training](/posts/ai/2026-10-11-cmu10423-lecture-03-training-decoding-en). The goal is to distinguish all three records for one task.

For response y=(y₁,…,y_T), the SFT loss is −Σ log π(y_t|x,y_<t). Instruction tuning commonly computes loss only on response tokens, with prompt tokens as context. This is a training choice, not a universal rule for language modeling. Exclude padding and treat EOS consistently with the objective. An incorrect shift can expose the answer token to the model.

### Follow one support question through the pipeline

This is an original teaching example. The prompt asks why a refund has not arrived. A demonstration says to check the refund date and contact support after the stated processing window. Compress that answer into two toy tokens with correct-token probabilities 0.5 and 0.25. The sequence probability is 0.125 and the summed negative log-likelihood is approximately 2.079. Averaging per token gives 1.040. This is a reduction choice, not a quality improvement.

A preference record compares A, “Please provide the refund date so we can check,” with B, “It will definitely arrive today.” Preferring A does not assign a literal reward of one to A and zero to B. The reward model outputs real-valued scores and models the win probability as σ(r_A−r_B). Scores two and zero give probability approximately 0.881 and loss 0.127. Adding 100 to both leaves the loss unchanged: pairwise preferences do not identify an absolute reward offset.

### Why keep a reference policy?

Maximizing learned reward alone can push the policy into regions where the reward model is unreliable, such as elaborate reassuring language that does not resolve the refund. A typical RLHF objective includes E[r]−β KL(π||π_ref). The fixed reference is often copied from the SFT model. Updating it together with the policy would remove this fixed anchor.

For one sampled answer, log π(y|x)−log π_ref(y|x) supplies a KL-related signal. This sample value can be negative; the full distributional KL is nonnegative after taking the expectation. PPO also uses the rollout's old policy for ratios and clipping. That old policy and the reference have distinct roles.

### Preference fit still needs factual evaluation

If evaluators reward confident promises, preference training can reinforce false guarantees. Define the relevant refund conditions, treatment of unknown information, and assessment rubric. Hold out new situations for evaluation. Lower training loss demonstrates a better fit to the signal, while factual correctness, refusal rates, and tone need separate checks.

### Check your understanding

Scores five and three still give a 0.881 preference probability because their difference remains two. Can a dataset containing only one ideal answer directly train a Bradley–Terry pairwise comparison? No: it lacks a comparison answer and preference label, though it can support SFT. If policy and reference start identical, full KL starts at zero and can change after an update. Continue to [DPO](/posts/ai/2026-10-11-cmu10423-lecture-12-dpo-latent-diffusion-en), which uses preference pairs without a separately trained reward model or online rollout loop.

## Course video sources

The [official Spring 2026 course site](https://www.cs.cmu.edu/~mgormley/courses/10423/) directs recordings to SCS Panopto. On 2026-10-12, anonymous retrieval returned an unloaded folder and a sign-in prompt, without playable classroom content. This establishes an access limit, not the absence of recordings. This guide uses public slides and linked primary papers; examples are original teaching additions, not a transcript. [Official recording folder](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22).

## References

- [CMU 10-423 Spring 2026 Lecture 11 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture11-ift-rlhf.pdf)
- [Primary paper](https://arxiv.org/abs/2005.14165)
- [Official schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
- [Primary paper](https://arxiv.org/abs/2203.02155)
