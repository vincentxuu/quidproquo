---
title: "CS188 CSPs and Multi-Agent Search: Choosing Minimax, Alpha-Beta, and Expectimax"
date: 2026-08-22
category: learning
tags: [berkeley, cs188, multi-agent, minimax, constraint-satisfaction]
lang: en
type: guide
difficulty: 進階
series:
  name: "Berkeley CS188 Spring 2026"
  order: 3
tldr: "Lectures 5–8 use CSPs to practice variables, constraints, and search order before Project 2 implements minimax, alpha-beta, and expectimax. Their key difference is the assumption made about other agents."
description: "A self-study guide to CSPs, game trees, and the multi-agent Pacman Project 2 in Berkeley CS188 Spring 2026."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-berkeley-cs188-csp-multi-agent)

[Lectures 5–8](https://inst.eecs.berkeley.edu/~cs188/sp26/) place two problem types together. CSPs use variables, domains, and constraints to reduce combinatorial search; game trees add other agents that respond. In [Project 2](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj2/), Pacman faces ghosts while you implement a reflex agent, minimax, alpha-beta pruning, expectimax, and an evaluation function.

## CSPs: reduce choices before entering the game

The [official CSP textbook chapter](https://inst.eecs.berkeley.edu/~cs188/textbook/csp/csps.html) represents a problem through variables, each variable's domain, and constraints on compatible assignments. Basic backtracking assigns one variable at a time. Ordering heuristics choose the next variable and value; propagation removes candidates that can no longer participate in a solution. These techniques preserve the solution set while avoiding branches already known to fail.

For an executable exercise, open the official Discussion 2 CSP worksheet. Pick one problem and draw the first three levels of its backtracking tree. Apply minimum remaining values and forward checking separately, circling nodes each technique avoids. Check the official solution before moving to Project 2. This separates search ordering from inference-based pruning.

## Three algorithms, three views of the world

Minimax assumes an opponent chooses the worst action for you. Alpha-beta preserves the minimax answer while pruning branches that cannot affect it. Expectimax replaces the always-adversarial opponent with a probability model. The [official P2 specification](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj2/) explicitly notes that a correct agent still loses some tests; winning is not the sole proof of correctness.

Define a ply before coding. P2 counts one Pacman move plus every ghost response as one layer. Misreading depth can leave recursion looking plausible while producing completely wrong expansion counts.

## The evaluation function is part of the model

With limited depth, leaf-state evaluation defines the world the agent can see. Combining food distance, ghost danger, and remaining goals is easy; putting them on coherent scales is harder. Use a fixed seed and multiple games to separate genuine improvement from luck.

First draw a small tree with two ghosts and mark when agent index and depth change. Implement minimax before pruning, then obtain expectimax by changing only the ghost-node aggregation rule. Each step should correspond to one explicit assumption.

Series navigation: [Previous: Search and heuristics](/posts/learning/2026-08-22-berkeley-cs188-search-heuristics-en) | [Next: MDPs and reinforcement learning](/posts/learning/2026-08-22-berkeley-cs188-mdp-reinforcement-learning-en)

## References

- [CS188 Spring 2026 calendar](https://inst.eecs.berkeley.edu/~cs188/sp26/)
- [CS188 textbook — CSPs](https://inst.eecs.berkeley.edu/~cs188/textbook/csp/csps.html)
- [CS188 textbook — Games](https://inst.eecs.berkeley.edu/~cs188/textbook/games/games.html)
- [CS188 Spring 2026 Project 2](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj2/)
