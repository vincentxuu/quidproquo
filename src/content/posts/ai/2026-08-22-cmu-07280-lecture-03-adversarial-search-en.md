---
title: "CMU 07-280 Lecture 3: Minimax, Alpha-Beta, and Expectimax"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cmu, ai-course, adversarial-search, minimax, game-playing]
lang: en
series:
  name: "Reading CMU 07-280"
  order: 3
tldr: "Lecture 3 turns a single path into a contingent plan: minimax faces an optimal opponent, alpha-beta skips branches without changing the root value, and expectimax replaces worst-case choice with probability."
description: "A complete reading of CMU 07-280 Spring 2026 Adversarial Search: game trees, minimax, depth-limited evaluation, alpha-beta pruning, expectimax, and assignment connections."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cmu-07280-lecture-03-adversarial-search)

This is **CMU 07-280 Spring 2026 Lecture 3: Adversarial Search**. The previous lecture found a route through a fixed world. Here, an opponent or random event changes the next state. The answer is no longer one action sequence but a contingent plan: what to do after each possible response.

## Official materials and reading scope

I read the complete [inked slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec3_Adversarial_Search_inked.pdf), [Adversarial Search staff notes](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Adversarial_Search.pdf), [Recitation 2](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec2.pdf) and [solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec2_sol.pdf), and checked [HW2](https://www.cs.cmu.edu/~07280/assignments/hw2_blank.pdf). No recording is public. This article does not turn slide games or demos into unrecorded spoken commentary.

## The inherited question: when you do not control the transition

A* assumes that after an action, the transition model determines the next state. Games alternate action choices between agents. MAX wants higher utility; MIN wants lower utility. In a stochastic world, a chance node produces outcomes according to a probability distribution.

The algorithm must therefore evaluate a strategy rather than a path. MAX's move must include what MIN can do next, just as an opening move in chess cannot be scored using only the immediate board change.

## Full conceptual path: three backup rules

**Minimax** backs terminal utilities up the tree. A MAX node takes the maximum child value; a MIN node takes the minimum. Under zero-sum optimal play, the root value is what MAX can preserve even when MIN works against it. With branching factor `b` and depth `m`, exhaustive time is `O(b^m)`. Real games require a limited horizon and an evaluation function for nonterminal states.

**Alpha-beta pruning** maintains two bounds. `α` is the best value MAX can already guarantee; `β` is the best upper bound MIN can already enforce. When a branch cannot change an ancestor's choice, expansion stops. Pruning does not change the minimax root value. Good move ordering simply makes more branches provably irrelevant earlier.

**Expectimax** changes the chance-node backup to an expectation:

```text
V(s) = Σ P(s'|s,a) V(s')
```

MIN deliberately chooses the worst result. Chance samples from a distribution. Treating an imperfect opponent as MIN can be overly conservative; treating a strategic opponent as random can overvalue risky moves.

## A reproducible example: one tree, different choices

MAX has two actions:

```text
Safe  -> [4, 4]
Risky -> [0, 10]
```

If the next layer is MIN, Safe has value 4 and Risky has value 0, so minimax chooses Safe. If it is an equal-probability chance node, their expected values are 4 and 5, so expectimax chooses Risky.

Now apply alpha-beta. Fully evaluating Safe sets root `α=4`. At Risky's MIN node, the first child gives 0, so `β=0 ≤ α=4`. The remaining 10 need not be read: MIN can already hold Risky to at most 0, and MAX will not abandon Safe's 4.

## Recitation and homework connection

Recitation 2 first asks for alpha, beta, and pruned branches under left-to-right traversal. Its true/false questions then compare minimax and expectimax values and policies. The exercise forces a distinction between a higher expectation and a better worst-case guarantee.

HW2 places pruning inside iterative deepening: complete a shallow search, then use its information to improve move ordering in the next round. It also asks a precise question. Alpha-beta preserves the root value, but must it return the same move as full minimax? When several moves tie for the optimum, tie-breaking can still differ. The search-and-games programming tree is public, while its official grader and submission feedback are not.

## Further comparison: an evaluation function is a compressed future

A depth limit does more than cut computation. It replaces terminal utility with an estimate of how good the current state looks. If that evaluation orders states incorrectly, deeper search often helps but is not a formal promise of monotonic improvement; the slides also discuss horizon effects and cases where additional depth does not improve play.

This returns to Lecture 1's representation problem. An evaluation function compresses an enormous future into one number. What it preserves determines which positions the search favors.

## What to do tonight

1. Compute the full minimax value of Recitation 2's first tree before pruning anything.
2. Trace `α` and `β` in the same order, writing why each pruned branch cannot change an ancestor's decision.
3. Build a three-action example in which minimax and expectimax choose different actions.

## References

- [CMU 07-280 Spring 2026 Lecture 3 — Adversarial Search, inked slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec3_Adversarial_Search_inked.pdf)
- [07-280 Adversarial Search staff notes](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Adversarial_Search.pdf)
- [07-280 Spring 2026 Recitation 2](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec2.pdf)
- [Recitation 2 solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec2_sol.pdf)
- [07-280 Spring 2026 Homework 2](https://www.cs.cmu.edu/~07280/assignments/hw2_blank.pdf)
