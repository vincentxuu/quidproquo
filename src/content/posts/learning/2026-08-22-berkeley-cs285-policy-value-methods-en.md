---
title: "Berkeley CS285 L5–10: Policy Gradients, Actor-Critic, DQN, and SAC"
date: 2026-08-22
category: learning
tags: [cs285, berkeley, policy-gradient, q-learning, actor-critic]
lang: en
type: guide
difficulty: 深度
tldr: "L5–10 build the deep-RL core through policy- and value-based routes; HW2 is CPU-friendly, while HW3's Atari and HalfCheetah runs can require hours of GPU time."
description: "A guide to CS285 Spring 2026 Lectures 5–10, Sections 3–5, and the policy-gradient, DQN, and SAC assignments."
series:
  name: "Reading Berkeley CS285 Spring 2026"
  order: 3
---

> 🌏 [中文版](/posts/learning/2026-08-22-berkeley-cs285-policy-value-methods)

Lectures 5–10 form the algorithmic core. The [official agenda](https://rail.eecs.berkeley.edu/deeprlcourse/) covers Policy Gradients, Actor Critic, Value-Based RL, Q-learning in Practice, and two Advanced Policy Gradients lectures. Read them by asking what is estimated, where data comes from, and how bias trades against variance.

## Policy-based methods

L5 derives policy gradients from a trajectory objective. Reward-to-go, baselines, and advantages reduce variance without changing the desired objective. L6 introduces actor-critic: a critic supplies the actor's update signal, potentially adding function-approximation bias. Sections 3 and 5 connect and extend these ideas.

[HW2](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw2.pdf) experiments with reward-to-go and neural-network baselines. It is a CPU-first assignment; the [homework compute ledger](/posts/learning/2026-08-22-berkeley-cs285-homework-project-route-en) owns the timing and hardware details. For self-study, hold the environment fixed, run three seeds, and retain both individual curves and their mean.

## Value-based methods

L7–8 move from Bellman backups to DQN and its stability machinery. L9–10 return to advanced policy-gradient methods. Section 4 places DQN beside SAC; compare their update targets, replay buffers, target networks, and entropy terms.

[HW3](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw3.pdf) implements DQN and SAC. Its [starter code](https://github.com/berkeleydeeprlcourse/homework_spring2026/tree/main/hw3) spans cheap and expensive environments; see the [homework compute ledger](/posts/learning/2026-08-22-berkeley-cs285-homework-project-route-en) for GPU estimates. Validate losses, replay, and evaluation in a small environment first.

## Completion check

Explain why policy gradients have high variance, how a critic trades variance for bias, why DQN uses replay and target networks, and what entropy contributes to SAC. If any answer is vague, return to the derivation and smallest experiment before spending more compute.

## References

- [CS185/285 Spring 2026 course site](https://rail.eecs.berkeley.edu/deeprlcourse/)
- [HW2: Policy Gradients](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw2.pdf)
- [HW3: Q-Learning and Actor-Critic](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw3.pdf)
- [Spring 2026 starter code](https://github.com/berkeleydeeprlcourse/homework_spring2026)
