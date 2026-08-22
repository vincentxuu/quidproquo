---
title: "CS188 MDPs and Reinforcement Learning: From Value Iteration to Q-Learning"
date: 2026-08-22
category: learning
tags: [berkeley, cs188, reinforcement-learning, mdp, q-learning]
lang: en
type: guide
difficulty: 進階
series:
  name: "Berkeley CS188 Spring 2026"
  order: 4
tldr: "Lectures 9–12 and Project 3 use the same Gridworld to contrast value iteration with a known model, Q-learning from unknown dynamics, and approximate Q-learning that generalizes through features."
description: "A project-centered guide to MDPs, value iteration, Q-learning, and Project 3 in Berkeley CS188 Spring 2026."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-berkeley-cs188-mdp-reinforcement-learning)

Search assumes successors can be enumerated. Reinforcement learning must act under uncertain outcomes and delayed rewards. [Lectures 9–12](https://inst.eecs.berkeley.edu/~cs188/sp26/) establish MDPs and then RL; [Project 3](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj3/) implements value iteration, Q-learning, epsilon-greedy exploration, and approximate Q-learning.

## Separate planning from learning

Value iteration knows transition and reward models and computes values through Bellman updates. Q-learning does not require the model in advance; it updates Q-values from `(state, action, reward, nextState)` experience. Both can produce a policy, but their information sources differ.

Check synchronous updates carefully: every new value in an iteration should come from the previous iteration, not from values modified earlier in the same sweep. For Q-learning, observe learning rate, discount, and exploration separately. A random epsilon-greedy action gathers information; it is not a malfunction.

## From tables to features

Tabular Q-learning stores every state-action pair separately and generalizes poorly in a large Pacman state space. Approximate Q-learning expresses Q-values through features and weights so related situations share experience. First verify that an identity extractor behaves like the tabular version, then introduce meaningful features. This isolates the effect of representation while preserving the update rule.

Hand-calculate one Bellman update in a tiny Gridworld before running a single autograder case. Finally compare policies before and after exploration is disabled. Do not stop at average score; explain why the agent selects its action.

Series navigation: [Previous: CSPs and multi-agent search](/posts/learning/2026-08-22-berkeley-cs188-csp-multi-agent-en) | [Next: Bayes nets and Ghostbusters](/posts/learning/2026-08-22-berkeley-cs188-bayes-ghostbusters-en)

## References

- [CS188 textbook — MDPs](https://inst.eecs.berkeley.edu/~cs188/textbook/mdp/markov-decision-processes.html)
- [CS188 textbook — Reinforcement Learning](https://inst.eecs.berkeley.edu/~cs188/textbook/rl/rl.html)
- [CS188 Spring 2026 Project 3](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj3/)
