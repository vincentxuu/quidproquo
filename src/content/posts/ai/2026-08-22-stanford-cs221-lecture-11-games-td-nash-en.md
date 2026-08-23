---
title: "CS221 Lecture 11: Games II: TD Learning, Simultaneous Games, and Nash Equilibria"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: en
series:
  name: "Reading Stanford CS221"
  order: 12
tldr: "Lecture 11 first learns game values from experience with temporal-difference updates, then moves from sequential play to simultaneous games described by mixed strategies, minimax guarantees, and Nash equilibria."
description: "A lecture-by-lecture reading of Stanford CS221 Autumn 2025 Lecture 11: official agenda, core development, implementation connection, and material gaps."
draft: true
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs221-lecture-11-games-td-nash)

This article covers **Stanford CS221, Autumn 2025, Lecture 11**, taught by Percy Liang on 2025-10-27. The [official course site](https://stanford-cs221.github.io/autumn2025/) fixes the offering and assignments; the primary artifact is [td_learning and simultaneous_games](https://stanford-cs221.github.io/autumn2025-lectures/?trace=td_learning). The account below follows the order of the two source files and does not fill their gaps with material from another lecture or with unstated intuition.

> Material gap: Official lecture material and video are public; Canvas interactions, assignment solutions, and hidden tests are unavailable. This article keeps that boundary explicit rather than inventing evidence.

## The lecture's route

`main()` first reviews two-player zero-sum games, then asks whether a machine can learn an evaluation function from play. TD learning answers that question first. The learned value is then placed back into game policies. The final transition is from turn-based to simultaneous games, and from zero-sum to non-zero-sum games.

That order matters. The first half is about estimating how good a state is from experience. The second is about choosing strategies when two players cannot observe the other's action before acting. Bootstrapping is the central mechanism in the first half; payoff matrices, mixed strategies, and equilibrium are the central objects in the second.

## Review: minimax and evaluation functions

In a turn-based, two-player, zero-sum game, minimax searches a game tree: the agent maximizes and the opponent minimizes. The source also names expectimax and expectiminimax, indicating that chance nodes require a different aggregation rule.

When the tree is too large, there are two directions. Alpha-beta pruning speeds up minimax exactly. An evaluation function estimates the current position approximately. In this lecture's setup, that evaluation function is still a manual heuristic. The motivating question is therefore concrete: if the evaluation function controls how search judges positions, can it be learned from experience?

## Why TD learning appears

First separate two quantities. For a policy `π`, `V_π(s)` is the expected utility of starting at state `s` and then following `π`. `Q_π(s, a)` is the expected utility of taking action `a` at `s` and following `π` afterward.

The source contrasts TD learning with SARSA. SARSA is on-policy: it estimates `Q_π(s, a)` for the current policy, and bootstraps by using immediate reward plus an estimate of future reward as its target. Its flaky-tram interaction has the following shape: at state 1, walk for reward `-1` to state 2; at state 2, walk for reward `-1` to state 3; at state 3, take the tram for reward `-2` and end at state 6.

Because SARSA stores `Q`, it can improve the policy directly:

`π_new(s) = argmax_a Q_π(s, a)`.

If we know `V_π(s)` instead, a general MDP still gives:

`Q_π(s, a) = Σ_s' T(s, a, s') [R(s, a, s') + γ V_π(s')]`.

The improved policy is then:

`π_new(s) = argmax_a Σ_s' T(s, a, s') [R(s, a, s') + γ V_π(s')]`.

This requires the MDP's transitions `T` and rewards `R`. For the deterministic games in the source, it simplifies to `π_new(s) = argmax_a V_π(Succ(s, a))`: compare the value of the successor reached by each action.

Why not solve the known MDP with value iteration? The source's answer is that the number of states is exponential, so solving the full MDP is too expensive. Reinforcement learning is used here not because the MDP is unknown—the original motivation—but because the state space can be too large.

## TD recurrence and algorithm

The source gives the analogy directly: `TD learning : V_π :: SARSA : Q_π`. SARSA stores a value for each state-action pair. TD learning stores a value for each state because the action-to-next-state relationship can be obtained from the MDP.

Assume function approximation: `V_π(s) = V(s; w)`, with weights `w`. In deep reinforcement learning, the source calls this a value network. One experience is `(s, a, r, s')`. The model predicts `V(s; w)`, and the bootstrapped target is:

`target = r + γ V(s'; w)`.

The squared loss is:

`L(w) = (V(s; w) - [r + γ V(s'; w)])²`.

Then take a gradient step:

`w = w - α ∇_w L(w)`.

In plain language: take a small piece of experience, form a target using the current estimate of the next state, and move the current prediction toward that target. TD does not wait for the end of an entire game before assigning a complete return to every earlier state.

The source's `TDLearning` class implements the same idea in a table. `V` is a `defaultdict(float)`, so an unseen state starts at 0. `incorporate_feedback` reads `predicted = V[state]`, computes `target = reward + discount * V[next_state]`, and updates:

`V[state] += learning_rate * (target - predicted)`.

The update is the current value plus the learning rate times the TD error. The class does not fold unobserved alternative actions into this update, which is why the source summary calls it on-policy and emphasizes bootstrapping.

## Flaky tram: executing the recurrence

The source fixes the random seed to 1 and constructs `FlakyTramMDP(num_locs=6, failure_prob=0.1)`. It uses `walk_tram_policy(6)` as its exploration policy, with `epsilon=0.2`, `discount=1`, and `learning_rate=0.1`. These are the example's settings, not universal requirements.

The interaction is:

1. At `state=1`, take `walk`, receive `reward=-1`, move to `next_state=2`, and continue.
2. At `state=2`, take `walk`, receive `reward=-1`, move to `next_state=3`, and continue.
3. At `state=3`, take `tram`, receive `reward=-2`, move to `next_state=6`, and end.

With `discount=1`, the first target is `-1 + V[2]`, the second is `-1 + V[3]`, and the third is `-2 + V[6]`. Since the table begins at zero, the third feedback moves the value of state 3 toward `-2`; the step is scaled by `0.1`. The earlier updates depend on the next state's value at the time of the update rather than directly knowing the total cost of the whole route. That is bootstrapping: estimates propagate through interaction over time.

`get_action` explores with probability `epsilon` by calling the exploration policy. Otherwise it calls `pi(state)`. `pi` uses `get_action_successors` to calculate each action's value:

`Q(action) = Σ successor.prob × (successor.reward + discount × V[successor.state])`.

It then selects the action with the highest value. This is the source's explicit boundary: values are learned from experience, but policy improvement still needs the MDP's possible successors, rewards, and transition probabilities.

## From MDPs to games: learning game values through interaction

The source next says that TD learning works for arbitrary MDPs and adapts it to games. Three changes matter: `Succ(s, a)` captures a deterministic transition; utility may not appear until the game ends; and there are two players, an agent and an opponent.

Both players use the same value function `V_π(s)`, which is the self-play setup. They use it in opposite directions. The agent maximizes:

`π_agent(s) = argmax_a V_π(Succ(s, a))`.

The opponent minimizes:

`π_opp(s) = argmin_a V_π(Succ(s, a))`.

“The same value” does not mean the two players have the same objective. The value is expressed in the agent's utility scale; the opponent selects a successor that is worse for the agent.

## Backgammon: adding chance to the rollout

Backgammon makes the setting less purely alternating. Each player tries to move pieces off the board, and dice determine how many places a player can move. If a piece lands on a point with one opponent piece, that piece is moved to the bar. A piece cannot land on a point with more than one opponent piece.

Because dice introduce randomness, the rollout is not simply agent then opponent. The source writes it as:

`π_dice → π_agent → π_dice → π_opp → π_dice → π_agent → ...`

`π_dice` is fixed. The learned policies are `π_agent` and `π_opp`. To represent states, the source first defines a feature vector, then gives two value-function choices: a linear function `V(s; w) = φ(s) * w`, or an MLP `V(s; w) = MLP_w(φ(s))`. “Then just apply TD learning” means applying the earlier `(s, a, r, s')` update to these representations; the source does not introduce a different recurrence here.

## Three historical examples

The source closes the TD/self-play section with three comparisons.

**Checkers.** Arthur Samuel's checkers program (1959) repeatedly played itself, used smart features, a linear evaluation function, and intermediate rewards, and combined alpha-beta pruning with search heuristics. The source says it reached human amateur level on an IBM 701 with 9K of memory.

**Backgammon.** Gerald Tesauro's TD-Gammon (1992) learned weights by playing itself one million times. It used dumb features and a neural network, with no intermediate rewards. The source says it reached human expert level and provided new insights into openings.

**Go.** AlphaGo Zero (2017) learned through 4.9 million self-play games. It used stone positions as dumb features, a neural network, no intermediate rewards, and Monte Carlo Tree Search. The source says it beat AlphaGo, which beat Lee Sedol in 2016, and produced new insights into the game.

These examples do not establish that a neural network is always best. Their role in the source is to place different combinations of features, evaluation functions, rewards, self-play, and search side by side. TD learning is not synonymous with one fixed model.

## Turning to simultaneous games

The next agenda item is simultaneous games, with rock-paper-scissors as the example. Both players act at the same time, so neither sees the other's action before choosing. In a turn-based game, a game tree can support a minimax policy. In a simultaneous game, the two actions happen together, so that tree structure breaks down.

The source asks whether you can still play optimally if you reveal your strategy. The complete answer requires mixed strategies and the minimax theorem. It starts with a single-move, simultaneous, zero-sum game.

## Two-finger Morra: matrices, strategies, and expectation

The intuition for Morra is that A wants the same number of fingers as B, leaning toward 4. The formal object has one move and no state. Players A and B choose actions, and the payoff matrix gives `V(a,b)` for every action pair. In a zero-sum game, A's utility is `V(a,b)` and B's is `-V(a,b)`.

The source's matrix is:

| A \\ B | 1 | 2 |
|---|---:|---:|
| 1 | 2 | -3 |
| 2 | -3 | 4 |

A pure strategy is one deterministic action: always one is `π=[1,0]`, and always two is `π=[0,1]`. A mixed strategy is a probability distribution over actions; uniform is `π=[0.5,0.5]`.

For two mixed strategies, game evaluation is:

`V(π_A, π_B) = Σ_a Σ_b π_A(a) π_B(b) V(a,b)`.

The source's `evaluate_game` function computes this literally: enumerate each action pair and add `prob_a * prob_b * V[a][b]`. It evaluates uniform versus uniform, each pure policy versus uniform, and uniform versus each pure policy. There is no extra state transition or search in this calculation.

## Best response and minimax

A wants to maximize `V(π_A,π_B)` and B wants to minimize it, while choosing simultaneously. The source uses a traffic deadlock to illustrate the mutual waiting, then temporarily lets one player go first to reason about pure strategies. In general, the second player can always choose a pure strategy.

Now suppose A uses `π_A=[0.5,0.5]`. The expected payoff is expanded as:

`V(π_A, π_B) = π_A(1)π_B(1)V(1,1) + π_A(1)π_B(2)V(1,2) + π_A(2)π_B(1)V(2,1) + π_A(2)π_B(2)V(2,2)`.

Substituting the Morra matrix, the source writes:

`V(π_A,π_B) = 0.5 * π_B(1) (2 - 3) + 0.5 * π_B(2) (4 - 3)`,

which becomes:

`V(π_A,π_B) = -0.5 * π_B(1) + 0.5 * π_B(2)`.

Therefore B's optimal strategy is `π_B(1)=1, π_B(2)=0`. A best response is a strategy that optimizes a player's objective against a specified opponent strategy; it is not a claim that one action is uniquely best against every opponent.

The source then lets A use a general `π_A=[p,1-p]` and B use a general `π_B=[p,1-p]`, displaying the corresponding minimax values for the pure/mixed cases. The key point is that pure strategies expose a first-mover disadvantage, while allowing randomization lets both players mix their actions.

Von Neumann's minimax theorem says that in these simultaneous zero-sum games, once mixed strategies are allowed, both players can achieve the same optimal guarantee. The source labels the proof as linear programming duality and the algorithm as computing optimal mixed strategies through linear programming. The practical consequence is surprising but precise: revealing your optimal mixed strategy does not hurt you.

For two-finger Morra, the source gives both players the optimal mixed strategy `[7/12, 5/12]` and evaluates the game when those strategies face each other. From minimax principles, if the opponent changes strategy, you can only improve; if you change your own optimal strategy, you can only get worse. This is a zero-sum guarantee, not a statement that every action pair has the same payoff.

## Non-zero-sum games and Nash equilibrium

The source now removes the condition that A's and B's utilities sum to zero. In competitive games, minimax can still be used through linear programming or search. In cooperative games where every player's utility is the same, pure maximization and search suffice in the source's framing. Real life lies somewhere between those cases.

The Prisoner's Dilemma is represented with a payoff matrix, written as `V_p(π_A,π_B)`: the utility for player `p ∈ {A,B}` when the two players choose their strategies. The source defines utility as negative years in jail, so fewer years means higher utility. Von Neumann's minimax theorem cannot be applied directly because the game is not zero-sum.

A weaker concept is Nash equilibrium: a strategy profile where no player can gain by changing only their own strategy. The source states Nash's existence theorem (1950): for any finite-player game with a finite number of actions, at least one Nash equilibrium exists.

The source gives three payoff examples. In zero-sum Morra, the Nash equilibrium—which is also the minimax strategy—is `[7/12,5/12]`. In collaborative Morra, the Nash equilibria are both players choosing 1 or both players choosing 2. In the Prisoner's Dilemma, the Nash equilibrium is that both players testify.

The final distinction is essential. Simultaneous zero-sum games have von Neumann's minimax theorem: there may be multiple minimax strategies, but the game value is single. Simultaneous non-zero-sum games have Nash's existence theorem: there may be multiple Nash equilibria and multiple game values. Nash equilibria are stable in the unilateral-deviation sense; the source explicitly says stability is not a notion of optimality.

## The source boundary

Together, the two files demonstrate a recurrence, a tabular TD update, self-play policies that maximize or minimize, expected payoff computation from a matrix, and theorem-level conclusions about minimax and Nash. They do not provide a complete deep-network training system, a general Nash solver implementation, or hidden assignment criteria. Those remain outside what this Lecture 11 artifact establishes.

## References

- [CS221 Autumn 2025 course site](https://stanford-cs221.github.io/autumn2025/)
- [Official lecture artifact: td_learning and simultaneous_games](https://stanford-cs221.github.io/autumn2025-lectures/?trace=td_learning)
- [CS221 Autumn 2025 executable lecture repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Official Stanford Online CS221 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
