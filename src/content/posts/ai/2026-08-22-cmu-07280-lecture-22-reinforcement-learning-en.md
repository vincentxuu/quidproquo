---
title: "CMU 07-280 Lecture 22: Q-learning When Dynamics Are Unknown"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cmu, ai-course, reinforcement-learning, q-learning, temporal-difference]
lang: en
tldr: "Lecture 22 keeps the MDP structure but removes known transitions and rewards. TD learning updates value from one sample, and Q-learning uses an off-policy target to learn optimal action values directly."
description: "A detailed reading of CMU 07-280 Spring 2026 Lecture 22: model-based and model-free RL, Monte Carlo evaluation, TD(0), Q-learning, and exploration."
draft: false
series:
  name: "Reading CMU 07-280"
  order: 22
---

> 🌏 [中文版](/posts/ai/2026-08-22-cmu-07280-lecture-22-reinforcement-learning)

Lecture 21 could sum over every successor because `P` and `R` were known. **CMU 07-280, Spring 2026, Lecture 22** removes that privilege. An agent chooses an action, observes a reward and next state, and learns from samples. The official title is simply *Reinforcement Learning*.

## Official materials and reading scope

This article fully reads the [Lecture 22 slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec22_RL.pdf), [Recitation 12](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec12.pdf), its [solutions](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec12_sol.pdf), and the public [RL programming assignment](https://www.cs.cmu.edu/~07280/assignments/reinforcement/). The official site has no public Spring 2026 lecture recording, so this reading relies only on published slides, recitation material, and code scaffolding.

Parts of the programming directory are anonymously visible. Gradescope tests, submission, and staff feedback are not. Visible code is not the same as a completely gradeable course assignment.

## The inherited problem: where does `P` in the Bellman expectation come from?

A known MDP supports offline value or policy iteration. With an unknown environment, there are two broad routes:

- **Model-based** methods estimate transitions `T(s,a,s')` and rewards `R(s,a,s')` from samples, then solve the estimated MDP.
- **Model-free** methods do not explicitly reconstruct `T,R`; they learn values or Q-values directly from experience.

Passive RL evaluates a fixed policy; active RL also improves the policy. A separate distinction is on-policy versus off-policy: does the update target use the behavior policy's next action, or a different target policy such as the greedy action?

## Full conceptual path: from complete returns to one-step TD targets

Monte Carlo evaluation waits until an episode ends and updates visited states from the realized cumulative return. It needs no model, but delays learning and can have high variance.

Temporal-difference learning, specifically `TD(0)`, updates after one transition `(s,r,s')` and bootstraps from the current estimate:

\[
V(s)\leftarrow V(s)+\alpha
\underbrace{[r+\gamma V(s')-V(s)]}_{\text{TD error}}.
\]

Q-learning extends values to state-action pairs and targets the best action in the successor state:

\[
Q(s,a)\leftarrow Q(s,a)+\alpha
[r+\gamma\max_{a'}Q(s',a')-Q(s,a)].
\]

It is off-policy: behavior can explore while the target still moves toward a greedy policy. If behavior always chooses the current `argmax`, untried actions never generate evidence. The slides therefore introduce exploration; a common implementation is `ε`-greedy, which usually exploits the current best action and occasionally samples another.

## Reproducible example: one Q-learning transition

Suppose

```text
Q(s, left) = 1.0
Q(s', up) = 2.0
Q(s', right) = 3.0
r = 0.5, gamma = 0.9, alpha = 0.2
```

The Q-learning target is

\[
y=0.5+0.9\max(2,3)=3.2.
\]

The TD error is `3.2-1.0=2.2`, so

\[
Q_{new}(s,left)=1.0+0.2(2.2)=1.44.
\]

Repeated updates from the same transition can still have changing targets because successor Q-values change. That is the power and risk of bootstrapping: no complete episode is required, but the learner chases a target produced by its own estimates.

Comparing SARSA exposes the off-policy distinction. If exploration actually selects `up` in `s'`, SARSA targets `0.5+0.9(2)=2.3`; Q-learning still uses the greedy value `3.0` for `right`. They are not evaluating the same policy.

## Recitation and homework connection

Recitation 12 first asks what information disappeared when moving from MDP planning to RL. It then calculates TD and Q-learning updates and distinguishes model-based/model-free, passive/active, and on/off-policy. Those categories determine where data comes from and which action appears in the target.

The RL programming assignment provides Gridworld and a Q-learning agent skeleton. It asks for `getQValue`, `computeValueFromQValues`, `computeActionFromQValues`, `update`, and exploration behavior. A self-study implementation should test policy extraction separately from the learning update. Because the formal autograder is not public, deterministic toy cases must replace it.

## Extension: sampling error versus planning error

Value iteration can be wrong because it stops early or approximates states. Tabular Q-learning adds sampling noise and exploration coverage. If an action is almost never visited, its bad Q estimate does not imply a broken Bellman equation; it indicates insufficient evidence.

Tabular Q-learning also assumes one storage cell for every `(s,a)`. Pac-Man, images, and continuous control cannot enumerate such tables. Lecture 23 replaces them with `Q_θ(s,a)` so states share features, adding approximation and optimization error to the problem.

## An action for tonight

Create a deterministic MDP with two states and two actions and write down its true optimal Q-table. Hand-calculate the first three Q-learning updates from a fixed transition sequence, then reproduce them in code. Enable `ε=0.2` for 1,000 steps and record both visit counts and Q error for every action; do not inspect cumulative reward alone.

## References

- [CMU 07-280 Spring 2026 Lecture 22 slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec22_RL.pdf)
- [CMU 07-280 Recitation 12](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec12.pdf)
- [CMU 07-280 Recitation 12 solutions](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec12_sol.pdf)
- [CMU 07-280 reinforcement-learning programming assignment](https://www.cs.cmu.edu/~07280/assignments/reinforcement/)
- [CMU 07-280 official course site](https://www.cs.cmu.edu/~07280/)
