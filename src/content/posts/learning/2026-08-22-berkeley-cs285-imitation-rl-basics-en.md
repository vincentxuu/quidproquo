---
title: "Berkeley CS285 L1–4: Imitation Learning, Distribution Shift, and RL Basics"
date: 2026-08-22
category: learning
tags: [cs285, berkeley, imitation-learning, reinforcement-learning, self-study]
lang: en
type: guide
difficulty: 進階
tldr: "The first four lectures move from behavioral cloning to MDPs; HW1 turns distribution shift into an observable failure through MSE policies, DAgger, and flow matching."
description: "A guide to CS285 Spring 2026 Lectures 1–4, Sections 1–2, and HW1, building the first bridge from imitation learning to reinforcement learning."
series:
  name: "Reading Berkeley CS285 Spring 2026"
  order: 2
---

> 🌏 [中文版](/posts/learning/2026-08-22-berkeley-cs285-imitation-rl-basics)

The [official schedule](https://rail.eecs.berkeley.edu/deeprlcourse/) starts with Introduction, Behavioral Cloning, Behavioral Cloning Part 2, and RL Basics. The point is not to memorize an RL algorithm first. It is to see where a supervised controller fails, then introduce learning from reward.

## L1–2: control as supervised learning

Behavioral cloning trains a policy on expert state-action pairs. Its training loss is simple; deployment is not. Once the learned policy makes a small error, it may visit states absent from expert data. Draw the training distribution beside the distribution induced by the learned policy before naming the problem “covariate shift.”

## L3 and Sections 1–2: make failure visible

Section 1 supplies a PyTorch tutorial, Section 2.1 reviews probability, and Section 2.2 focuses on BC distribution shift. [HW1](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw1.pdf) compares an MSE policy, DAgger, and a flow-matching policy. DAgger asks the expert to label states actually visited by the learner, iteratively repairing the dataset.

## L4: when RL becomes necessary

RL Basics reframes the task as an MDP. A policy produces a trajectory, rewards accumulate, and transition dynamics make today's action alter tomorrow's state. Expert actions permit direct imitation; outcome-only feedback introduces credit assignment and exploration.

## HW1 and compute

The [Spring 2026 starter code](https://github.com/berkeleydeeprlcourse/homework_spring2026/tree/main/hw1) uses `uv` and Weights & Biases. This assignment is a sensible place to start on a local CPU; see the [homework compute ledger](/posts/learning/2026-08-22-berkeley-cs285-homework-project-route-en) for the supporting details. Retain three artifacts: a reward curve, generated behavior video, and a qualitative comparison of MSE, DAgger, and flow matching.

Public code is enough to implement the work, but it is not the complete enrolled experience. The [series overview](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview-en) owns the full access boundary.

## References

- [CS185/285 Spring 2026 course site](https://rail.eecs.berkeley.edu/deeprlcourse/)
- [HW1: Imitation Learning](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw1.pdf)
- [HW1 starter code](https://github.com/berkeleydeeprlcourse/homework_spring2026/tree/main/hw1)
