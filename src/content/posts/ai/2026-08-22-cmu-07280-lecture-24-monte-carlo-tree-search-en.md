---
title: "CMU 07-280 Lecture 24: How Monte Carlo Tree Search Connects to AlphaZero"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cmu, ai-course, monte-carlo-tree-search, alphazero, reinforcement-learning]
lang: en
tldr: "Spring 2026 Lecture 24 is MCTS, not Fall 2026 LLM post-training. It allocates simulations through selection, expansion, rollout, backup, and UCB, then connects policy/value heads and self-play to AlphaZero."
description: "A detailed reading of CMU 07-280 Spring 2026 Lecture 24: the four MCTS phases, UCB exploration, neural-guided tree policy, self-play, and the AlphaZero assignment context."
draft: false
series:
  name: "Reading CMU 07-280"
  order: 24
---

> 🌏 [中文版](/posts/ai/2026-08-22-cmu-07280-lecture-24-monte-carlo-tree-search)

**CMU 07-280, Spring 2026, Lecture 24** is **Monte Carlo Tree Search (MCTS)**. The current Fall 2026 page separately displays LLM Post Training, but that is not the Spring canonical lecture used by this series. This lecture combines earlier adversarial search, sampling, Q estimates, deep networks, and self-play into the Building AlphaZero finale.

## Official materials and reading scope

The Spring 2026 Lecture 24 `MCTS` slide and PowerPoint direct links returned 404 on August 22, 2026. This article therefore does not claim to have read that lecture deck. Its core sources are [Recitation 13](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec13.pdf) and its [solutions](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec13_sol.pdf), [Recitation 14](https://www.cs.cmu.edu/~07280/recitations/07280_S26_rec14.pdf) and its [solutions](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec14_sol.pdf), plus S26 filenames and assignment metadata on the [official course site](https://www.cs.cmu.edu/~07280/).

The official site has no public Spring 2026 lecture recording. The HW12 Building AlphaZero PDF and archive links were also unavailable on the audit date. This article can read the surviving recitation pipeline in detail but does not fill missing materials with imagined classroom content.

## The inherited problem: a complete game tree is too large, while a Q-network has no lookahead

Minimax systematically expands a game tree, but branching factor and depth quickly make the tree intractable. Flat Monte Carlo search avoids a full tree. It runs random rollouts for each root action and selects the action with the best average outcome. It uses simulation but does not concentrate budget on promising deep branches.

MCTS builds an asymmetric partial tree between those extremes. Each simulation has four phases:

1. **Selection** follows a tree policy through existing nodes.
2. **Expansion** adds a node for an action not yet represented.
3. **Rollout or evaluation** simulates an outcome or asks a value model.
4. **Backup** updates visit counts and values along the path.

Repeated simulations allocate more computation to branches that look promising or remain uncertain.

## Full conceptual path: UCB balances exploitation and exploration

Recitation 14 uses the UCB heuristic

\[
UCB(s)=\frac{totalScore(s)}{count(s)}
+c\sqrt{\frac{\ln N}{count(s)}}.
\]

The first term is the empirical mean outcome and favors exploitation. The second grows when a child has few visits and encourages exploration. `N` is the parent or total simulation count; `c` controls exploration strength. Without the bonus, a branch that gets lucky early can monopolize the remaining budget.

Backup in a two-player zero-sum game must also respect perspective. The candy-game exercise notes that players alternate at every layer. If outcomes are always expressed for the player to move, the sign must alternate during backup. Inconsistent value perspective is a common silent MCTS error.

Recitation 13's FlatMCSearch performs rollout and backup but not tree selection or expansion. That contrast is essential: random simulation alone is not automatically MCTS. Maintaining tree statistics and using them to allocate the next simulation is the distinguishing mechanism.

## Reproducible example: UCB for two actions

Suppose the root has completed `N=20` simulations with child statistics

```text
A: totalScore = 8, count = 10
B: totalScore = 3, count = 2
c = sqrt(2)
```

Then

\[
UCB(A)=0.8+\sqrt{2}\sqrt{\frac{\ln20}{10}}
\approx0.8+0.774=1.574,
\]

while

\[
UCB(B)=1.5+\sqrt{2}\sqrt{\frac{\ln20}{2}}
\approx1.5+1.731=3.231.
\]

Although `B` has only two observations, it has both a high mean and a large uncertainty bonus, so the next simulation selects B. If further visits show that B is ordinary, the exploration term decays as `count(B)` grows and empirical value increasingly dominates selection.

## Recitation and homework connection: from MCTS to AlphaZero

Recitation 14 writes neural-guided selection as

\[
a_t=\arg\max_a\left[
Q(s_t,a)+c\frac{\sqrt{N(s_t)}}{1+N(s_t,a)}
\pi_\theta(a\mid s_t)
\right].
\]

The policy head `π_θ(a|s)` supplies an action prior, directing early search toward moves the network considers promising. As visits increase, the prior bonus decays and the selection relies more on search-derived `Q`. A value head estimates the outcome of a state and can replace many blind rollouts.

Self-play generates tuples `(s_t,π_t,z_t)`: the state, the search-improved MCTS policy, and the final game result. The network learns policy and value from those tuples, then produces new self-play data:

```text
network priors/value -> MCTS -> improved policy -> self-play data
          ^                                      |
          |--------------- training -------------|
```

The official assignment table names HW12 Building AlphaZero, but its direct artifact links were unavailable. The recitation algorithm can be reproduced; the full notebook, tests, and grading experience cannot be claimed.

## Extension: MCTS does not exhaust every branch

Minimax compares a systematically expanded tree to a fixed depth. MCTS estimates under a simulation budget. Its answer depends on rollout or evaluation quality, tree policy, budget, and stochastic variance. Neural guidance adds network bias to exploration. Search can correct a prior, but a finite search is not guaranteed to erase every model error.

Ending Spring 2026 with MCTS reconnects the course's two strands. Search decides how to allocate computation; machine learning obtains policy and value from data. AlphaZero is not the name of one neural network. It is a closed system of search, learning, and data generation.

## An action for tonight

Implement the game with 11 candies where each player takes one or two. Build FlatMCSearch first, then add node visits, mean values, UCB selection, expansion, and alternating-sign backup. Fix a random seed and compare root policies after 10, 100, and 1,000 simulations. Finally add a deliberately wrong prior and measure how many simulations search needs to correct it.

## References

- [CMU 07-280 Recitation 13](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec13.pdf)
- [CMU 07-280 Recitation 13 solutions](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec13_sol.pdf)
- [CMU 07-280 Recitation 14](https://www.cs.cmu.edu/~07280/recitations/07280_S26_rec14.pdf)
- [CMU 07-280 Recitation 14 solutions](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec14_sol.pdf)
- [CMU 07-280 official course site](https://www.cs.cmu.edu/~07280/)
- [CMU 07-280 syllabus](https://www.cs.cmu.edu/~07280/07280_syllabus_v1.pdf)
