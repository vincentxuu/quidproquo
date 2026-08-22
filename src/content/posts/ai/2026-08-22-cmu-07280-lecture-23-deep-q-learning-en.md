---
title: "CMU 07-280 Lecture 23: From Approximate Q-learning to DQN"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cmu, ai-course, reinforcement-learning, deep-q-learning, function-approximation]
lang: en
tldr: "Lecture 23 replaces a huge Q-table with Qθ(s,a): first derive a gradient update for linear features from squared TD error, then add replay data and a fixed target network to form DQN."
description: "A detailed reading of CMU 07-280 Spring 2026 Lecture 23: feature-based approximate Q-learning, TD loss, gradient updates, experience replay, and target networks."
draft: false
series:
  name: "Reading CMU 07-280"
  order: 23
---

> 🌏 [中文版](/posts/ai/2026-08-22-cmu-07280-lecture-23-deep-q-learning)

Tabular Q-learning stores one number for every `(state, action)`. The Deep Reinforcement Learning segment of **CMU 07-280, Spring 2026, Lecture 23** addresses state explosion. Features and neural networks approximate `Q(s,a)`, allowing one experience to affect many related states.

## Official materials and reading scope

There is an important source gap. The Spring 2026 Lecture 23 `Deep_RL` slide and PowerPoint links listed by the course site all returned 404 on August 22, 2026. This article therefore **does not claim to have read the Lecture 23 slides** and does not invent their sequence.

The available primary materials are the [Approximate Q-learning pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Approx_Q-learning.pdf), [Recitation 13](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec13.pdf) and its [solutions](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec13_sol.pdf), plus [Recitation 14](https://www.cs.cmu.edu/~07280/recitations/07280_S26_rec14.pdf) and its [solutions](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec14_sol.pdf). There is no official public Spring 2026 lecture recording. This is a reading of those available materials, not a complete classroom reconstruction.

## The inherited problem: a Q-table cannot even visit the states

The pre-reading uses Pac-Man to make the scale concrete. Merely tracking whether food remains in 100 locations creates `2^100` configurations, before adding positions and directions. Tabular Q-learning cannot store that space or gather enough samples for every cell.

Define features `f_i(s,a)` and share parameters:

\[
Q_\theta(s,a)=\sum_i\theta_i f_i(s,a)=\theta^\top f(s,a).
\]

Features might represent distance to food, proximity to a ghost, or whether an action hits a wall. Similar feature vectors share weights. Updating one state-action pair changes predictions for other pairs.

## Full conceptual path: make TD error an optimization objective

A tabular update changes one cell. Function approximation minimizes the discrepancy between `Q_θ(s,a)` and a bootstrapped target:

\[
y=r+\gamma\max_{a'}Q_{\theta^-}(s',a'),
\qquad
L(\theta)=\frac12[y-Q_\theta(s,a)]^2.
\]

`θ⁻` denotes temporarily fixed target parameters. The gradient is

\[
\nabla_\theta L
=-(y-Q_\theta(s,a))\nabla_\theta Q_\theta(s,a).
\]

For a linear model, `∇_θQ=f(s,a)`, so gradient descent becomes

\[
\theta\leftarrow\theta+\alpha
[y-Q_\theta(s,a)]f(s,a).
\]

This generalizes tabular Q-learning. If every `(s,a)` receives an independent one-hot feature, only one weight changes and the method reduces to a table. Shared features produce generalization.

DQN replaces the linear `Q_θ` with a neural network. Recitation 14 explicitly adds two stabilization components: store transitions `(s,a,r,s')` in a dataset or replay buffer and sample random mini-batches; compute `y` with a temporarily fixed target network `θ⁻`, so the target and prediction do not move together in the same step.

## Reproducible derivation: one update with two features

Let `f(s,a)=[1,2]` and `θ=[0.5,-0.5]`. The current prediction is

\[
Q_\theta(s,a)=0.5(1)-0.5(2)=-0.5.
\]

Suppose `r=1`, `γ=0.9`, and the target network's maximum successor Q-value is `2`. Then

\[
y=1+0.9(2)=2.8,
\qquad
\delta=y-Q=3.3.
\]

With `α=0.1`,

\[
\theta_{new}=\theta+0.1(3.3)[1,2]
=[0.83,0.16].
\]

The new prediction is `0.83+0.32=1.15`, moving toward `2.8` without jumping there in one step. More importantly, any other `(s,a)` using the same features changes too. That coupling is both the source of efficiency and the source of interference.

Recitation 14 asks students to derive the same update from squared loss. In that derivation, `y` is treated as independent of `θ`, which is the mathematical role of a fixed target network. Allowing both sides to move through the same trainable parameters changes both the gradient and the learning dynamics.

## Recitation and homework connection

Recitation 13 introduces feature representations and approximate-Q weight updates. Recitation 14 connects them to DQN loss, target networks, and mini-batch data. Together, they establish the verifiable course core even though the Lecture 23 slides are unavailable.

The public [RL programming assignment](https://www.cs.cmu.edu/~07280/assignments/reinforcement/) primarily implements tabular Q-learning. The formal DQN compute, tests, and grading environment are not fully public on that path. A self-study implementation should build tiny-MDP regression tests instead of treating a decreasing loss as proof of correctness.

## Extension: approximation brings both generalization and instability

A tabular update to one cell does not directly damage another cell. Function approximation can. With a neural network, bootstrapping, and off-policy data, the target distribution also changes during learning. A replay buffer reduces correlation among adjacent samples, and a target network slows target movement, but neither is a convergence guarantee.

This lecture also reconnects RL to supervised learning: DQN still has inputs, predictions, targets, loss, and gradient descent. The difference is that targets are not fixed labels; they combine rewards with another Q estimate.

## An action for tonight

Do not begin with Atari. Use the two-dimensional linear features above and hand-calculate `y`, TD error, and weight updates for three transitions, then encode them as unit tests. Implement one version using the current network for every target and another that synchronizes a target network every ten steps. Plot not only reward but also TD loss, Q-value magnitude, and the gap between target and online predictions.

## References

- [CMU 07-280 Approximate Q-learning pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Approx_Q-learning.pdf)
- [CMU 07-280 Recitation 13](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec13.pdf)
- [CMU 07-280 Recitation 13 solutions](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec13_sol.pdf)
- [CMU 07-280 Recitation 14](https://www.cs.cmu.edu/~07280/recitations/07280_S26_rec14.pdf)
- [CMU 07-280 Recitation 14 solutions](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec14_sol.pdf)
- [CMU 07-280 reinforcement-learning programming assignment](https://www.cs.cmu.edu/~07280/assignments/reinforcement/)
