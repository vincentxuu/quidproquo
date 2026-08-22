---
title: "Reasoning in LLMs: Chain of Thought and Long-Reasoning RLVR"
date: 2026-08-22
type: deep-dive
category: ai
tags: [cs229, llm-reasoning, chain-of-thought, rlvr, ppo]
lang: en
tldr: "Chapter 18 separates two levers for LLM reasoning: chain of thought adds test-time computation, while verifiable rewards and policy gradients train long-reasoning behavior."
description: "A reading of Chapter 18 in the 2026 CS229 notes: test-time computation through chain of thought and long-reasoning training with RLVR, PPO, GRPO, and CISPO."
draft: false
series:
  name: "Reading Stanford CS229"
  order: 19
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-18-reasoning-in-llms)

This article reads Chapter 18, printed pages 220–225, of the [2026 CS229 main notes](https://cs229.stanford.edu/main_notes.pdf). It is a chapter guide to the 2026 notes, not a reconstruction of any quarter's recordings. It explains the main objectives and algorithmic intuition without claiming to reproduce every proof or implementation detail.

## Chain of thought turns one prediction into a computation

A direct answer models \(p(a\mid x)\). Chain of thought first generates an intermediate sequence \(z\), then the answer \(a\):

\[
p(a,z\mid x)=p(z\mid x)p(a\mid x,z).
\]

The extra tokens hold intermediate results, supplying more sequential computation and writable working space at inference time. Few-shot CoT demonstrations provide a reasoning format, while zero-shot prompts request stepwise reasoning. These can help decomposable tasks, but a longer output is not itself evidence of better reasoning.

## Generation as a finite-horizon MDP

RLVR—reinforcement learning with verifiable rewards—can score a final math answer, program test result, proof checker, or output format without supervising every reasoning step. For prompt \(x\), the state is prefix \((x,y_{<t})\), an action is the next token, the transition appends it, and terminal reward is \(R(x,y)\).

The basic objective is

\[
J_R(\theta)=\mathbb{E}_{y\sim\pi_\theta(\cdot\mid x)}[R(x,y)].
\]

A common regularized form penalizes divergence from a reference policy:

\[
J_\beta(\theta)=J_R(\theta)-\beta\,\mathbb{E}[D_{KL}(\pi_\theta\|\pi_{ref})],
\]

where \(\beta\) controls how strongly reward seeking may move the policy away from the starting model.

## From policy gradient to PPO, GRPO, and CISPO

The sequential policy-gradient skeleton is

\[
\sum_t (R-b_t)\nabla_\theta\log\pi_\theta(y_t\mid x,y_{<t}),
\]

When the baseline \(b_t\) does not depend on the currently sampled token—it may depend on the prompt, prefix/state, or independent group statistics—it preserves the ideal expected direction while reducing estimator variance. PPO uses token-level probability ratios between new and old policies and clips excessive changes, limiting how far one sampled batch can push the policy.

GRPO samples a group of completions for the same prompt and standardizes reward relative to that group, avoiding a separately trained critic. CISPO instead clips the importance coefficient while retaining a direct log-probability gradient path. All these variants address the same difficulty: extracting stable updates from expensive, sparse, high-variance terminal feedback.

## Assumptions and failure modes

- A verified final answer does not prove that the intermediate trace is faithful or sound.
- Models may exploit the reward, format, or verifier.
- Sparse reward complicates credit assignment; extra tokens can merely add verbosity.
- On-policy sampling is expensive, while reusing old data creates distribution shift.
- KL penalties and clipping constrain updates; they do not guarantee truthfulness or safety.

## Connection to adjacent chapters

Chapter 17 built the autoregressive Transformer and SFT objective. This chapter recasts generation as sequential decision-making. Chapter 19 returns to general MDPs, values, and dynamic programming, supplying the broader reinforcement-learning language behind policy gradients.

## Exercise

Define an RLVR setup for generating a function that passes unit tests: state, action, termination, reward, and reference policy for KL regularization. Then describe two reward-hacking scenarios and explain why merely adding more tests may still be insufficient.

## References

- [CS229 Lecture Notes Chapter 18: LLM Reasoning, Chain of Thought, and RLVR (2026-08-18)](https://cs229.stanford.edu/main_notes.pdf#page=221)
- [Official Stanford CS229 course page](https://cs229.stanford.edu/)
