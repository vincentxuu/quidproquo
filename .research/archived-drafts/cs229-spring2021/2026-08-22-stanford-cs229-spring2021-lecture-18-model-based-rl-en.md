---
title: "Stanford CS229 Lecture 18: Model-Based RL and Fitted Value Iteration"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, stanford, reinforcement-learning, model-based-rl]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 19
tldr: "Model-based RL estimates transitions and rewards from trajectories, then replans. In continuous states, fitted value iteration regresses toward Bellman targets, avoiding exhaustive tables while losing their convergence guarantee."
description: "A reading of Stanford CS229 Spring 2021 Lecture 18: learning dynamics, exploration, continuous states, value function approximation, and fitted value iteration."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-spring2021-lecture-18-model-based-rl)

This is post 19 in [Reading Stanford CS229](/en/series/stanford-cs229), covering **Stanford CS229, Spring 2021, Lecture 18**. The syllabus dates it May 26, 2021 and gives the official title **Model-based RL, value function approximator**. This article uses the Lecture 18 live notes and Sections 3–4 of the syllabus-linked *Reinforcement Learning and Control* notes. The Canvas recording was not used.

Lecture 17 assumed known dynamics and a table with one value for every state. This lecture removes both idealizations: learn a transition model from interaction data, then approximate value as a function over continuous states.

## Model-based RL learns an environment before planning

In a discrete state space, trajectories provide `(s, a, s')` counts. The maximum-likelihood transition estimate is:

```text
P̂_sa(s') = count(s,a,s') / count(s,a)
```

If rewards are unknown, their observed average supplies an estimate as well. Value iteration or policy iteration can then plan with `P̂` and `R̂` to produce a new policy.

The full procedure becomes a loop: execute the current policy, collect trajectories, update the model, replan, and execute again. The explicit transition model is the reusable intermediate object that makes the approach model-based.

## Why the current best policy cannot collect all the data

An inaccurate early model may produce a greedy policy that visits only a small region. Unvisited `(s,a)` pairs receive no counts, so their estimates cannot improve. This creates the exploitation–exploration tradeoff.

The notes mention adding noise to policy actions to reach more states. That is an intuitive exploration strategy, not a universally optimal one. Exploration has costs and safety constraints; a physical system cannot try arbitrary actions merely to diversify its dataset.

## Why continuous states do not fit a grid

Discretizing each dimension into `k` values creates `k^d` cells in a `d`-dimensional state space. This curse of dimensionality multiplies the state count with every dimension. A grid also produces piecewise-constant values that do not naturally express smooth change.

Instead of storing each `V(s)`, use a parameterized approximation:

```text
V_θ(s) = θᵀφ(s)
```

`φ(s)` may contain designed features, and the notes also allow nonlinear approximators. Shared parameters let nearby states generalize to one another.

## Dynamics can also be learned as supervised prediction

A continuous system may begin with a linear model:

```text
s_{t+1} = As_t + Ba_t + ε_t
```

Treat `(s_t,a_t)` as input and `s_{t+1}` as the label, then estimate `A`, `B`, and noise through regression. Nonlinear feature maps or predictors can replace the linear form.

This reconnects model-based RL to the first part of CS229: dynamics learning is supervised learning. The difference is that examples are not a fixed independent dataset; they are trajectories induced by a policy.

## Fitted value iteration turns Bellman backups into regression targets

A continuous state space cannot be updated exhaustively, so sample finite states `s⁽ⁱ⁾`. For every action, draw successor states from the model and estimate:

```text
q(a) ≈ R(s⁽ⁱ⁾) + γ E[V_θ(s') | s⁽ⁱ⁾, a]
y⁽ⁱ⁾ = max_a q(a)
```

Then regress toward these Bellman targets:

```text
θ ← argmin_θ Σᵢ (V_θ(s⁽ⁱ⁾) - y⁽ⁱ⁾)²
```

Exact tabular value iteration says `V(s)=target`. The fitted version instead asks a function to approximate targets on a finite sample. It gains generalization across states while introducing approximation, sampling, and model error.

## Three approximations can compound

The method has three distinct error sources:

- Learned dynamics differ from the real environment.
- Finite successor samples only estimate an expectation.
- The function class for `V_θ` may not represent `V*`.

The target also depends on the current `V_θ`, so errors can re-enter training through repeated Bellman backups. The notes explicitly state that fitted value iteration lacks the tabular method's general convergence guarantee, even though it often works in practice.

A deterministic simulator needs only one successor to evaluate its expectation. Stochastic dynamics require averaging samples. With many actions, sampling for every action can become computationally expensive.

## Where Lecture 18 sits in the eighteen-lecture path

Lecture 18 closes the main CS229 arc. Regression now learns dynamics, function approximation represents value, and earlier concerns about bias, variance, and diagnostics reappear as approximation and deployment risks. RL is not isolated from supervised learning; it places those tools inside an interaction loop.

Spring 2021 includes Lecture 19, *Societal impact*, but the syllabus exposes no public material for that lecture. This series does not substitute another offering, so Lecture 18 is the final post currently supported by offering-specific official sources.

## Beyond the lecture

Measure the three errors separately before implementation: dynamics prediction on real transitions, Monte Carlo variance of Bellman targets under a fixed model, and regressor residuals under fixed targets. A single final return mixes all three and does not reveal whether to collect data, change the model, or increase sampling.

## References

- [Stanford CS229 Spring 2021 syllabus](https://cs229.stanford.edu/syllabus-spring2021.html)
- [Lecture 18 live lecture notes](https://cs229.stanford.edu/notes2021spring/notes2021spring/lecture18_live.pdf)
- [Reinforcement Learning and Control notes: learning an MDP model](https://cs229.stanford.edu/notes2020fall/notes2020fall/cs229-notes12.pdf#page=7)
- [Reinforcement Learning and Control notes: continuous states and fitted value iteration](https://cs229.stanford.edu/notes2020fall/notes2020fall/cs229-notes12.pdf#page=9)
