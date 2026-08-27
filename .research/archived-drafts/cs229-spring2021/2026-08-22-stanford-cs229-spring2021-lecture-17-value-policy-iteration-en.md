---
title: "Stanford CS229 Lecture 17: How the Bellman Equation Leads to Value and Policy Iteration"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, stanford, reinforcement-learning, mdp]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 18
tldr: "An MDP describes sequential decisions with states, actions, transitions, discounting, and rewards. The Bellman equation splits long-term value into immediate reward and next-state value, leading to value iteration and policy iteration."
description: "A reading of Stanford CS229 Spring 2021 Lecture 17: MDPs, policies, discounted returns, Bellman equations, value iteration, and policy iteration."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-spring2021-lecture-17-value-policy-iteration)

This is post 18 in [Reading Stanford CS229](/en/series/stanford-cs229), covering **Stanford CS229, Spring 2021, Lecture 17**. The syllabus dates it May 24, 2021 and gives the official title **Basic concepts in RL, value iteration, policy iteration**. This article uses the Lecture 17 live notes and Sections 1–2 of the syllabus-linked *Reinforcement Learning and Control* notes. The Canvas recording was not used.

Supervised learning often gives a target answer for each input. Reinforcement learning instead handles a sequence of decisions. An action changes the next state and therefore changes the choices that remain available. The action with the largest immediate reward may sacrifice a larger future return.

## An MDP describes the environment in five parts

A Markov Decision Process is `(S, A, P, γ, R)`:

- `S`: the state space.
- `A`: the action space.
- `P_sa(s')`: the probability of reaching `s'` after taking `a` in `s`.
- `γ ∈ [0,1)`: the discount factor.
- `R`: the immediate reward function.

The Markov property says that once the current state and action are given, the next-state distribution does not need the full history. History is not inherently irrelevant; the state representation must contain the historical information needed to predict the future.

The discounted return of a trajectory is:

```text
G₀ = R(s₀) + γR(s₁) + γ²R(s₂) + …
```

`γ` reduces the weight of later rewards and keeps an infinite sum finite under bounded rewards. It also encodes a preference for receiving positive rewards sooner and sets an effective planning horizon.

## Policies and value functions

A policy `π: S → A` selects an action in every state. For a fixed `π`, its value function is the expected return from `s` when all later actions follow `π`:

```text
V^π(s) = E[G₀ | s₀=s, π]
```

Separating the first step gives the Bellman equation:

```text
V^π(s) = R(s) + γ Σ_s' P_{s,π(s)}(s') V^π(s')
```

This is the lecture's central equation. An infinite future becomes an immediate reward plus the same value problem after one transition. That recursive structure makes long-term planning computable through local backups.

In a finite MDP, one equation exists for every state, so policy evaluation becomes a linear system with `|S|` unknown values.

## The optimal Bellman equation adds a maximum

The optimal value `V*(s)` is the highest expected return attainable over all policies:

```text
V*(s) = R(s) + γ max_a Σ_s' P_sa(s') V*(s')
```

An optimal policy selects the action with the best expected next-state value:

```text
π*(s) = argmax_a Σ_s' P_sa(s') V*(s')
```

This greediness is not myopic. `V*` already contains the entire future. The warning that immediate-reward greed can fail does not conflict with being greedy with respect to optimal long-term value.

## Value iteration repeatedly performs optimal backups

Value iteration begins with an arbitrary value estimate and repeatedly updates every state:

```text
V(s) ← R(s) + γ max_a Σ_s' P_sa(s')V(s')
```

Each pass moves the current estimate toward the Bellman fixed point. For a finite MDP with known dynamics and `γ<1`, the values converge to `V*`; taking the maximizing action then yields a policy.

Updates may be synchronous across all states or asynchronous one state at a time. The implementation differs, but both apply the same Bellman backup.

## Policy iteration alternates evaluation and improvement

Policy iteration starts with a policy and repeats two steps:

1. Policy evaluation: solve its Bellman linear system to obtain `V^π`.
2. Policy improvement: choose the best action under `V^π` in every state.

```text
π(s) ← argmax_a Σ_s' P_sa(s')V^π(s')
```

Policy iteration may converge in fewer iterations, but each evaluation solves a linear system. Value iteration uses cheaper iterations while approaching value only approximately. The notes do not declare one universally superior; the balance depends on the state space and per-iteration cost.

## What the lecture deliberately assumes

Both algorithms assume that `P_sa` and `R` are known and that state and action spaces are finite. Real robots rarely come with exact transition models, and continuous states cannot store one value per point. Lecture 18 removes those assumptions.

Bellman equations also do not fix reward design. The algorithm optimizes the reward that was specified, not the intent that a designer forgot to encode.

## Where Lecture 17 sits in the eighteen-lecture path

Lecture 17 is the course's transition from static prediction to sequential decisions. Earlier datasets were generally fixed before training. In RL, the policy changes which states are reached and therefore which data is collected next.

Lecture 18 addresses two practical gaps: learning dynamics from trajectories and replacing value tables with function approximation in continuous states.

## Beyond the lecture

Build a tiny MDP with three states and two actions and perform one Bellman backup by hand. Label the immediate reward, transition probabilities, and successor values separately. If one of those terms is absent, the environment definition is incomplete.

## References

- [Stanford CS229 Spring 2021 syllabus](https://cs229.stanford.edu/syllabus-spring2021.html)
- [Lecture 17 live lecture notes](https://cs229.stanford.edu/notes2021spring/notes2021spring/lecture17_live.pdf)
- [Reinforcement Learning and Control notes: MDPs and Bellman equations](https://cs229.stanford.edu/notes2020fall/notes2020fall/cs229-notes12.pdf#page=2)
- [Reinforcement Learning and Control notes: value and policy iteration](https://cs229.stanford.edu/notes2020fall/notes2020fall/cs229-notes12.pdf#page=5)
