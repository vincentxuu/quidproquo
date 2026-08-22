---
title: "CS224N Lecture 8: From Instruction Tuning and RLHF to DPO"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224n, post-training, rlhf, dpo, stanford]
lang: en
series:
  name: "Stanford CS224N 導讀"
  order: 9
tldr: "Lecture 8 explains how instruction tuning, preference data, and RLHF turn a pretrained model into an assistant, then derives DPO from winner–loser pairs. Every step converts human judgment into signal—and imports its biases."
description: "A lecture-by-lecture reading of CS224N Winter 2026 Lecture 8: SFT, RLHF, reward models, DPO, and human versus AI feedback."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs224n-post-training)

The [official CS224N Winter 2026 schedule](https://web.stanford.edu/class/cs224n/) places lecture 8 on January 29, but does not name a lecturer; this article therefore attributes it only to the course staff. The [official deck](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture08-posttraining.pdf), **Post-training (RLHF, SFT, DPO)**, covers instruction fine-tuning, RLHF, InstructGPT/ChatGPT, limitations of RL and reward modeling, DPO, and human preference data versus AI feedback.

## Next-token prediction is not user assistance

Pretraining learns to continue text. Users expect a model to follow instructions, choose a useful form, and decline inappropriate requests. Instruction fine-tuning applies supervised learning to instruction–ideal-response examples, shifting a base model toward assistant interaction.

Its coverage is bounded by demonstrations. Outside them, the model must generalize from pretraining, and demonstrators' styles and judgments become model preferences.

## The three-stage RLHF pipeline

The typical RLHF pipeline in the [InstructGPT paper](https://arxiv.org/abs/2203.02155) starts with supervised fine-tuning, collects preference rankings over multiple responses to the same prompt, trains a reward model on those comparisons, and then uses an algorithm such as PPO to raise predicted reward while constraining the policy against a reference model.

A reward model does not measure “true good.” It approximates choices made by annotators under a given interface and rubric. A policy may exploit its gaps. RL optimization also brings expensive sampling, value-function fitting, and hyperparameter sensitivity.

## What complexity DPO removes

[Direct Preference Optimization](https://arxiv.org/abs/2305.18290) trains a policy directly on chosen/rejected pairs. It rewrites reward differences as log-probability differences between the policy and reference policy, yielding a classification-style loss without separately fitting a reward model and running PPO.

Removing the RL stage does not remove the preference problem. DPO still depends on pair quality, a reference model, and regularization strength, and learns only preferences represented in data. Collapsing annotator disagreement into one winner hides the disagreement itself.

## Human and AI feedback

Human feedback is expensive and slow and needs a clear rubric. AI feedback scales quickly but can amplify a judge model's biases and blind spots. Evaluation should separately report data provenance, annotator agreement, and automated judging rather than only a final win rate.

## SFT data defines the assistant interface

Instruction examples teach content, format, length, refusal, and conversational style. Balance mixtures by task and token contribution, deduplicate, and evaluate both target behavior and retained base capabilities.

## How preference data is generated

Candidates, sampling temperature, and model mixture set comparison difficulty. Use multidimensional rubrics, position randomization, repeated labels, and agreement. Disagreement may express plural values rather than noise.

## What a reward model learns

\[
P(y_w\succ y_l\mid x)=\sigma(r_\phi(x,y_w)-r_\phi(x,y_l)).
\]

Pairwise training identifies differences, not calibrated absolute reward. Test length, style, and confidence shortcuts plus out-of-distribution candidates.

## Roles inside PPO

The policy generates, the reward model scores, a reference supplies KL control, and a value function reduces variance. Log reward, KL, length, entropy, and independent evaluation; high predicted reward can still mean hacking.

## DPO intuition and objective

DPO trains the policy-reference log-ratio difference for winners versus losers with a logistic loss, eliminating a separate reward model and online PPO. Beta, sequence normalization, masking, and shared prefixes matter. Offline simplicity does not solve coverage shift.

## Quality control for human and AI feedback

Humans add context but cost more; AI judges scale but share model blind spots and style preferences. Route ambiguous and high-risk pairs to humans, maintain a human audit set, and version judge models like datasets.

## A post-training failure taxonomy

Track capability regression, over-refusal, sycophancy, reward hacking, mode collapse, and calibration loss on explicit slices. Compare base, SFT, and preference-optimized checkpoints under one evaluation.

## A small preference experiment

Create paired answers for twenty prompts, collect two independent human rankings, and compare an automated judge. Swap positions, control length, and alter confidence while holding correctness fixed to expose shortcuts.

## Material gap and numbering note

Winter 2026 recordings are not public. The deck cover retains a stale “Lecture 7: Post-training” label, but the official schedule, date, and filename establish it as regular lecture 8. This article covers all six agenda items without inventing spoken examples.

## References

- [Official CS224N Winter 2026 course page](https://web.stanford.edu/class/cs224n/)
- [Lecture 8 Post-training slides](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture08-posttraining.pdf)
- [Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155)
- [Direct Preference Optimization](https://arxiv.org/abs/2305.18290)
