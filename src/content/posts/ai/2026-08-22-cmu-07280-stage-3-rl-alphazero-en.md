---
title: "CMU 07-280 Stage Review III: From MDPs and Q-learning to AlphaZero"
date: 2026-08-22
category: ai
tags: [cmu, ai-course, reinforcement-learning, mcts, alphazero]
lang: en
series:
  name: "Reading CMU 07-280"
  order: 27
type: deep-dive
tldr: "Stage III connects value, policy, bootstrapping, function approximation, and MCTS into AlphaZero: a network supplies priors and estimates, search improves decisions, and self-play creates the next training set."
description: "A synthesis of MDPs, reinforcement learning, deep RL, MCTS, and the Building AlphaZero assignment in CMU 07-280 Spring 2026."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cmu-07280-stage-3-rl-alphazero)

Earlier stages usually begin with answers supplied by a dataset: search has a goal, supervised learning has labels, and language modeling has the next token. Reinforcement learning changes how data is produced. An agent's action changes later states, rewards may be delayed, and the policy determines which experience the learner will observe.

Stage III moves from MDPs through value iteration, Q-learning, and function approximation, then combines MCTS with self-play in Building AlphaZero. Public worksheets, some solutions, and assignment links remain available, but there is no complete public recording set. The old direct HW12 PDF also returned 404 during this audit, so this review limits claims to the anonymous official course page and Recitation 14 rather than implying access to the complete grader.

## An MDP makes uncertainty explicit

A Markov decision process specifies states `s`, actions `a`, transitions `P(s'|s,a)`, rewards `R`, and discount `γ`. The Bellman optimality equation separates long-term value into immediate reward and the best value available next:

```text
V*(s) = max_a Σ_s' P(s'|s,a) [R(s,a,s') + γV*(s')]
```

This is more than a recursive formula. Value must be self-consistent: when an estimate of a successor changes, the ranking of current actions must change too. Model-based dynamic programming knows the transition model; model-free RL estimates the same structure from sampled transitions.

Draw a three-state MDP tonight, assign two actions and rewards, and calculate two rounds of value iteration by hand. Watch rewards propagate backward one iteration at a time before writing code; that makes both the power and risk of bootstrapping concrete.

## Q-learning puts the objective into a sample update

Q-learning does not require the full transition table. After observing `(s, a, r, s')`, it updates with a temporal-difference error:

```text
δ = r + γ max_a' Q(s', a') - Q(s, a)
Q(s, a) ← Q(s, a) + αδ
```

The `max` points the target at the currently estimated best next action; `α` controls how much one sample changes prior belief. Exploration remains separate. A policy that always picks its current highest Q-value may never collect evidence about untried actions.

Deep RL replaces a table with a neural approximation of Q or policy/value functions. That handles larger spaces while introducing correlated samples, moving targets, and optimization instability. Replay buffers and target networks address those interactions; they are not guarantees that arrive automatically with a neural network.

## MCTS spends evaluation where it is needed

Monte Carlo Tree Search cycles through selection, expansion, evaluation or simulation, and backup. Unlike fixed-depth minimax, it can spend more budget on branches that appear promising or uncertain. Its selection rule balances average value against visit counts so the search does not commit too early.

Standard MCTS may estimate a leaf with a random rollout. AlphaZero-like systems instead use a network for both a policy prior and value estimate. Policy guides which actions to inspect; value avoids simulating every trajectory to termination. Search is not replaced by the network—it is directed by it.

## AlphaZero is a data-generation loop

[Spring 2026 Recitation 14](https://www.cs.cmu.edu/~07280/recitations/07280_S26_rec14.pdf) writes training data as `(s_t, π_t, z_t)`: the state, the action distribution improved by MCTS, and the final outcome. The loop is:

```text
network → policy/value priors → MCTS → improved action distribution
    ↑                                      ↓
    └──── train on self-play (s, π, z) ← play game
```

Planning and learning become teachers for each other. MCTS spends extra computation to improve immediate network decisions; self-play stores those improved decisions and updates the network. The loop also creates feedback risk. Weak exploration narrows data to states the current policy already visits, while bad estimates can be amplified through search and retraining.

## What the public material supports

The [official assignment table](https://www.cs.cmu.edu/~07280/) identifies HW12 as an online programming assignment, Building AlphaZero, and links its notebook. Recitation 14 and its solution expose policy/value heads, self-play tuples, and policy-guided tree selection. That is enough to reconstruct the conceptual chain, but not the enrolled tests, compute, or feedback.

An independent implementation should begin with tic-tac-toe or a reduced Connect Four. First make MCTS produce a visit-count distribution for each state and verify that backed-up root values have the correct sign. Add the network only after that. Turning on self-play, GPU training, and full tree search together hides bugs at three loop boundaries.

## The Stage III exit test

You should distinguish environment rewards, value estimates, and search statistics; calculate one Q-learning update; and explain why `π_t` is a search-generated target rather than a label directly supplied by the environment. Most importantly, you should be able to draw the entire path from self-play data back into the network.

At that point the course closes its loop. Lecture 2's search has not been discarded by machine learning; it returns inside AlphaZero. The neural network is no longer merely a classifier but a prior and evaluator for search.

## References

- [CMU 07-280 official course site and assignment table](https://www.cs.cmu.edu/~07280/)
- [CMU 07-280 syllabus](https://www.cs.cmu.edu/~07280/07280_syllabus_v1.pdf)
- [MDP notes](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_MDPs.pdf)
- [Approximate Q-learning notes](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Approx_Q-learning.pdf)
- [Recitation 14: AlphaGo/AlphaZero](https://www.cs.cmu.edu/~07280/recitations/07280_S26_rec14.pdf)
- [Recitation 14 solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec14_sol.pdf)
