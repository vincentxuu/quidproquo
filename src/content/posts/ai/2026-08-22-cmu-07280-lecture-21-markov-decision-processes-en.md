---
title: "CMU 07-280 Lecture 21: How Bellman Equations Solve Markov Decision Processes"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cmu, ai-course, reinforcement-learning, markov-decision-process, dynamic-programming]
lang: en
tldr: "Lecture 21 formulates stochastic sequential decisions as an MDP with known dynamics, defines value and Q-values through Bellman backups, and solves for an optimal policy with value or policy iteration."
description: "A detailed reading of CMU 07-280 Spring 2026 Lecture 21: MDP components, the Markov property, discounted return, Bellman updates, value iteration, and policy iteration."
draft: false
series:
  name: "Reading CMU 07-280"
  order: 21
---

> 🌏 [中文版](/posts/ai/2026-08-22-cmu-07280-lecture-21-markov-decision-processes)

**CMU 07-280, Spring 2026, Lecture 21** moves from predicting the next token to selecting a sequence of actions. The official title is *Markov Decision Processes*. Its most important boundary is that transition probabilities and rewards are known. This lecture is about planning, not learning an environment from interaction.

## Official materials and reading scope

This article fully reads the [Lecture 21 slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec21_MDPs.pdf), the [MDP pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_MDPs.pdf), [Recitation 11](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec11.pdf), its [solutions](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec11_sol.pdf), and the racing problem in [Homework 11](https://www.cs.cmu.edu/~07280/assignments/hw11_blank.pdf). The official site has no public Spring 2026 lecture recording, so no spoken classroom explanation is invented here.

## The inherited problem: an expectimax tree can expand forever

Adversarial search already introduced chance nodes and expected value. If every action can lead probabilistically to several states and the horizon is long, a full expectimax tree repeatedly encounters the same states and may expand indefinitely.

An MDP compresses this repeated structure into a state graph. Its standard components are states `S`, actions `A`, a transition function `P(s'|s,a)`, rewards `R(s,a,s')`, and possibly terminal states. A policy `π(s)` chooses an action in each state.

The Markov property does not mean history ceases to exist. It means the state contains the information needed to predict the future: conditional on the current state, earlier history adds no predictive information. If a representation omits velocity, inventory, or opponent state, the resulting process may not be Markov.

## Full conceptual path: values, Q-values, and Bellman backups

Under policy `π`, a state value is the expected discounted return from `s`:

\[
V^\pi(s)=\mathbb E_\pi\left[\sum_{t=0}^{\infty}\gamma^t r_t\mid s_0=s\right].
\]

A discount `0≤γ<1` reduces the weight of distant rewards and makes an infinite sum converge under bounded rewards. The optimal value satisfies

\[
V^*(s)=\max_a\sum_{s'}P(s'\mid s,a)
\left[R(s,a,s')+\gamma V^*(s')\right].
\]

The bracket contains immediate reward plus discounted successor value. `Q*(s,a)` holds the first action fixed:

\[
Q^*(s,a)=\sum_{s'}P(s'\mid s,a)
[R(s,a,s')+\gamma\max_{a'}Q^*(s',a')].
\]

Value iteration starts from an arbitrary `V_0` and repeatedly applies the optimality backup, then extracts a greedy policy. Policy iteration alternates policy evaluation with policy improvement: calculate the current policy's value, then replace each action with the best one-step lookahead.

## Reproducible derivation: take 2 now or gamble for 5

Consider one nonterminal state `s` with two actions:

- `Stop` enters a terminal state with reward `2`.
- `Try` reaches a terminal reward of `5` with probability one half and returns to `s` with reward `0` otherwise.

Let `γ=0.9`. The action value for `Try` is

\[
Q(s,Try)=0.5(5)+0.5(0+0.9V(s))=2.5+0.45V(s).
\]

`Stop` has value `2`. Assume `Try` is optimal and solve its fixed point:

\[
V(s)=2.5+0.45V(s)
\Rightarrow 0.55V(s)=2.5
\Rightarrow V(s)\approx4.545.
\]

The result exceeds `2`, so the assumption is self-consistent and the optimal policy chooses `Try`. The calculation shows why immediate rewards cannot be compared alone: returning to the same state carries future value.

Starting value iteration at `V_0(s)=0` gives `V_1=2.5`, `V_2=3.625`, and `V_3≈4.131`, approaching the fixed point. Every backup effectively extends the planning horizon by another layer.

## Recitation and homework connection

Recitation 11 uses a racing-car MDP to ask for transitions, rewards, discount effects, and policy iteration. Homework 11 promotes the same problem to written work. Its states are `{0,2,3,4,5,Done}`. `Move` advances randomly; `Stop` earns the current position as reward. Students run four rounds of value iteration, extract an optimal policy, and change `γ`.

The alignment is direct: slides provide the algorithm, recitation builds the state table, and homework requires the numerical solution. Public PDFs let a self-learner reproduce the task, while Gradescope submission and staff feedback remain restricted.

## Extension: MDP planning is not yet reinforcement learning

Value iteration in this lecture requires complete `P` and `R`. If an agent does not know where actions lead or what rewards they generate, it cannot evaluate the expectation directly. Lecture 22 replaces the model with samples and enters reinforcement learning.

State-space size is a separate problem. Even with known dynamics, a very large state space cannot store one `V(s)` per state. Lecture 23 introduces features and function approximation. Keeping “unknown model” separate from “too many states” prevents every difficulty from being blurred into the word RL.

## An action for tonight

Implement the `Stop/Try` MDP in a five-line loop and run twenty value-iteration updates from `V_0=0`. Test `γ=0,0.5,0.9`, recording the converged value and greedy action. Then make whether the agent has previously tried an action affect transitions without adding that fact to the state; observe why the Markov assumption fails.

## References

- [CMU 07-280 Spring 2026 Lecture 21 slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec21_MDPs.pdf)
- [CMU 07-280 MDP pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_MDPs.pdf)
- [CMU 07-280 Recitation 11](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec11.pdf)
- [CMU 07-280 Recitation 11 solutions](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec11_sol.pdf)
- [CMU 07-280 Homework 11](https://www.cs.cmu.edu/~07280/assignments/hw11_blank.pdf)
