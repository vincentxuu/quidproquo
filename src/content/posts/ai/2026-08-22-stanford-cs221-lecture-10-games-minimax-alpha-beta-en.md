---
title: "CS221 Lecture 10: Games I: From Expectimax to Minimax"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: en
series:
  name: "Reading Stanford CS221"
  order: 11
tldr: "Lecture 10 extends single-agent search into adversarial game trees: expectimax averages chance outcomes, minimax takes the opponent's worst case, and alpha-beta removes irrelevant branches without changing the answer."
description: "A lecture-by-lecture reading of Stanford CS221 Autumn 2025 Lecture 10: official agenda, core development, implementation connection, and material gaps."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs221-lecture-10-games-minimax-alpha-beta)

This article covers **Stanford CS221, Autumn 2025, Lecture 10**, taught by Percy Liang on 2025-10-22. The [official course site](https://stanford-cs221.github.io/autumn2025/) fixes the offering and assignments; the primary artifact is [games](https://stanford-cs221.github.io/autumn2025-lectures/?trace=games). Rather than presenting game search as a list of detached terms, this reading follows the execution order of `main()` in `.work/stanford-cs221-notes/source/games.py`, from the game interface to exact pruning and approximate evaluation.

> Material gap: Official lecture material and video are public; Canvas interactions, assignment solutions, and hidden tests are unavailable.

## Reframing the MDP problem as games

The previous starting point is an MDP and reinforcement learning: the agent tries to maximize utility while the environment is random and known. This lecture changes the setting to games. The agent still maximizes its utility, but the opponent's strategy is unknown. That small change determines what a recurrence does at each node. With a random environment we take an expectation; with a player who chooses actions, we must state exactly what kind of opponent policy we assume.

`games.py` narrows the scope to two-player, zero-sum games. The players are `agent` and `opp`; zero-sum means the opponent's utility is the negative of the agent's utility. Every value below is therefore from the agent's perspective: positive is good for the agent and negative is bad. This is not a model of every game, but it makes the relationship between max and min explicit.

## What a game must define

The code represents a game with a `Game` class and keeps the search routines independent of the board, number, or rules. A game supplies five definitions:

- `start_state()`: where the game begins.
- `successors(state)`: a mapping from every available action to its successor state.
- `player(state)`: which player moves at the state.
- `is_end(state)`: whether the game is over.
- `utility(state)`: the agent's utility at a terminal state.

The last item carries an important assumption: rewards are sparse and all utility is placed at the end state. Non-terminal states do not receive a direct score; search must follow successors until it can call `utility`. `HalvingGame` makes this contract explicit with `assert state.n == 0` inside `utility`.

### `Game1`: a small tree

`Game1.start_state()` returns `"root"`. The root has actions `A`, `B`, and `C`, leading to same-named middle states. At each middle state it is the opponent's turn, with actions `1` and `2`:

```text
root (agent)
├─ A (opp) ─ 1 → A1: -50, 2 → A2: 50
├─ B (opp) ─ 1 → B1:   1, 2 → B2:  3
└─ C (opp) ─ 1 → C1:  -5, 2 → C2: 15
```

Reading `is_end` at root returns false, `player` returns `agent`, and `successors` returns the three actions. Changing the state to `"A"` still gives a non-terminal state, but `player` is now `opp` and the successors are `1` and `2`. Changing it to `"A1"` gives a terminal state, where `utility` returns `-50`. The search code does not need to know what A means; it only needs the interface.

The file then shows another representation with `HalvingGame(n=11)`. `HalvingState` is an immutable data class containing an integer `n` and the current player. The start state is `(11, agent)`. Each move has `decrement` and `half`: subtract one or integer-divide by two, then hand the turn to the other player. The game ends when `n == 0`. If the player recorded in that terminal state is `agent`, utility is `+1`; otherwise it is `-1`. Here, `player` is part of the state instead of being inferred from search depth.

Policies are also explicit. A deterministic policy maps a state to one action, written `π_p(s)`. A stochastic policy gives the probability of each action, written `π_p(a | s)`. The code generally uses stochastic policies: a policy returns an action-probability dictionary and `sample_dict` samples from it.

## Simulation and game evaluation

Given a game and a policy for every player, the first question is not how the agent should act. It is the value of the game when those policies are fixed. `simulate(game, policies)` starts at `start_state()`. While the state is not terminal, it finds the current player, calls that player's policy, samples an action with `sample_dict`, and advances through `successors(state)[action]`. Each action and resulting state becomes a `Step`; the full sequence and the terminal utility become a `Rollout`.

`game_evaluation()` supplies a concrete setup for `Game1`. The agent's `always_choose_a_policy` always returns `{"A": 1}`. The opponent's `random_policy` returns `{"1": 0.5, "2": 0.5}`. The agent therefore reaches A, then the opponent reaches A1 with probability one half and gets -50, or A2 with probability one half and gets 50. One simulation is affected by sampling. The code fixes random seed 1 for one demonstration, then runs 20 rollouts and takes `np.mean` of their utilities. That is a Monte Carlo estimate, not an exact answer merely because it used 20 samples.

When policies and successors can be enumerated, `V_eval(game, policies, state)` computes the expectation exactly. Its base case returns `utility(state)` at a terminal state. Otherwise it finds the player, obtains that player's policy, loops over `(action, prob)`, follows the successor, and adds `prob * V_eval(next_state)`:

```text
V_eval(s) = Σ_a π_player(a | s) V_eval(successor(s, a))
```

At A, the random opponent gives `0.5 × (-50) + 0.5 × 50 = 0`. This is analogous to policy evaluation in an MDP: the policy is fixed and we compute its expected utility. The difference is that several players contribute policies in turn. The exact recurrence can still take exponential time because it may expand every successor.

## Expectimax: optimize against a fixed opponent policy

The next step keeps the opponent policy fixed but no longer fixes the agent policy. The base case of `V_exptmax(game, opp_policy, state)` remains terminal utility. At an agent state, it recursively evaluates every successor and takes the maximum. At an opponent state, it follows `opp_policy(state)` and takes the probability-weighted sum. The opponent node is therefore an expectation node, not a min node.

With the random opponent in `Game1`, the root branches have these values:

- A: `(−50 + 50) / 2 = 0`.
- B: `(1 + 3) / 2 = 2`.
- C: `(−5 + 15) / 2 = 5`.

The code consequently says the optimal action is C and the value is 5. That optimality is conditional on the supplied `random_policy`; changing the opponent distribution can change the expectations. Expectimax finds the best agent policy with respect to a fixed opponent policy, analogous in the source to value iteration: max at agent nodes and expectation at the known-policy nodes.

## Minimax: model the opponent as a best response

The source then states the problem with expectimax: the point of games is that the opponent policy is unknown. If there is no trustworthy fixed distribution, treating the opponent as random is unjustified. Minimax adopts the worst-case assumption that the opponent plays its best possible strategy, meaning the strategy that minimizes the agent's utility.

`V_minmax(game, state)` again returns terminal utility at an end state. Otherwise it recursively evaluates every successor and builds `values[action]`. At an agent state it chooses the largest value; at an opponent state it chooses the smallest. The function returns both `(value, action)`, so every state can retain its minimax value and selected move. At an opponent state, that selected action is the worst response for the agent, not an action the agent will execute.

For `Game1`, the middle-state values are A: `min(-50, 50) = -50`, B: `min(1, 3) = 1`, and C: `min(-5, 15) = -5`. The root is an agent node, so it chooses `max(-50, 1, -5) = 1`, action B. This differs from expectimax's C because the opponent model differs: expectimax assumes equal random probabilities, while minimax assumes the opponent selects the smaller result at every opponent node.

The halving game turns the result into a policy that can play. For `n=11`, `minimax_policy` calls `V_minmax` and returns `{action: 1.0}`. The comparison opponent is a random policy, `{"decrement": 0.5, "half": 0.5}`. The code fixes seed 1 for one rollout, then runs 10 simulations and computes their mean utility; the source describes the result as the minimax policy crushing the random policy. The distinction matters: minimax is computed for a worst-case guarantee against any opponent, while this experiment happens to use a random opponent.

The code also computes minimax values for agent-to-move halving states with `n` from 1 through 11. A value of 1 means the agent is guaranteed to win regardless of the opponent's action. A value of -1 means the opponent can guarantee a win if it plays optimally. When both sides play optimally, the result is perfect play. A game is solved when its outcome under perfect play is known. The source lists tic-tac-toe, nim, and connect four as strongly solved; checkers and Othello as weakly solved from the initial position; and chess and Go as unsolved, even though computers are superhuman. These examples distinguish knowing the perfect-play outcome from merely having very strong computers.

## Face-off: optimal relative to whom?

Every recurrence bakes an opponent assumption into its policy. `V_minmax` produces `π_max` for the agent and `π_min` for the opponent. `V_exptmax` under opponent policy `π_7` produces `π_exptmax(7)` for the agent. Write `V(π_agent, π_opp)` for the value when those two policies actually play each other.

`face_off()` gives three relationships. First, `π_max` is the best agent policy against `π_min`:

```text
V(π_exptmax(7), π_min) ≤ V(π_max, π_min)
```

Second, `π_min` is the best opponent policy against `π_max`:

```text
V(π_max, π_min) ≤ V(π_max, π_7)
```

Third, if the agent knows the opponent will use `π_7`, then `π_exptmax(7)` is at least as good against it as minimax:

```text
V(π_max, π_7) ≤ V(π_exptmax(7), π_7)
```

Knowing the opponent can therefore do better than minimax; not knowing the opponent is exactly where minimax supplies a lower bound. “Optimal” has no standalone meaning here: expectimax is optimal relative to fixed `π_7`, while minimax is optimal relative to the worst-case `π_min`. Different face-offs producing different values is not a contradiction.

## Expectiminimax: randomness in the game tree

In `Game1`, each branch is selected by a player. `expectiminimax()` introduces a game tree with randomness, so its recurrence needs agent max nodes, opponent min nodes, and chance expectation nodes. The source shows the `game2` tree and the expectiminimax recurrence diagrams rather than adding a separate generic Python class. The point is to define the appropriate `V_...()` recurrence for the node types in a game.

Expectiminimax therefore does not blur expectimax and minimax together. It distinguishes the node: the agent maximizes, the opponent minimizes, and a random event takes a probability-weighted expectation. The source mentions possible extensions such as more than two players, extra turns, or a player choosing who moves next. It also explicitly lists what these game trees do not cover: imperfect-information poker, non-zero-sum prisoner's dilemma, and non-turn-based rock-paper-scissors. A neat recurrence does not make those problems the same model.

## Alpha-beta pruning: exact search with fewer branches

The basic minimax recurrence generally takes exponential time. Alpha-beta pruning accelerates the exact computation by stopping when a branch cannot change the answer. It is a branch-and-bound idea, not an approximation.

The simplest bound example says A has value in `[3, 5]` and B has value in `[5, 100]`. At a max choice, B cannot be worse than A, so neither value needs to be computed exactly for that comparison. In the game-tree example, the root computes `max(3, min(2, X))`. Since `min(2, X)` can never exceed 2, the root will choose 3 whatever X is; X does not need to be explored.

More generally, while exploring, each max node has a lower bound on its value and each min node has an upper bound. The minimax value comes from a leaf, and the path taken by minimax policies to that leaf is the optimal path. That path must remain within the bounds supplied by its ancestors. A node can be pruned when its bounds no longer overlap the relevant bounds of every ancestor. The criterion is that the max/min answer cannot change, not that the node looks unimportant. Alpha-beta therefore preserves the exact minimax value and action while visiting fewer states.

The amount pruned depends on child order. If a max node first visits a child that raises its lower bound quickly, or a min node first visits one that lowers its upper bound quickly, later branches can be discarded sooner. The source recommends using an evaluation function to order children: decreasing order at max nodes and increasing order at min nodes. In this alpha-beta section, the evaluation function is used to improve ordering; it does not make alpha-beta inexact. The speedup depends on ordering because ordering controls how quickly bounds tighten.

## Evaluation functions: approximate search at a depth limit

If the tree is too deep, even alpha-beta may not reach terminal states in time. `evaluation_functions()` instead defines an evaluation function using prior knowledge to estimate how good a non-terminal state is. In this game model, the true terminal concern is who wins; the evaluation function supplies a signal before the search reaches the end. The source uses chess as an illustration of domain knowledge, but `games.py` does not prescribe a universal chess scoring formula.

A depth-limited recurrence carries a depth `d`. At a terminal state it returns true `utility`. When the depth is exhausted, it stops expanding and returns `evaluation(state)`. Otherwise it applies max or min and recurses on each successor with `d-1`. The implementation must make that cutoff explicit: otherwise it may call a terminal-only utility function on a non-terminal state, or fail to reduce depth and continue expanding indefinitely. Alpha-beta can still be added to depth-limited minimax, but its correctness is relative to the leaf values supplied at the cutoff. If those values are estimates, the resulting policy is not guaranteed to be optimal for the full original tree.

That is the approximation failure mode. An evaluation function can mistake a short-term advantage for a long-term win; a shallow cutoff may miss whose turn it is or an immediate reversal; and a game without reliable prior knowledge may simply receive poor estimates. The source defines the idea and shows a chess illustration, but it does not provide a cross-game evaluation formula. The illustration should not be expanded into a general tactic absent from the material.

## The execution order in one view

`games.py` begins by separating state, turn, transitions, termination, and utility through five `Game` methods. It uses `simulate` to observe rollouts under fixed policies and `V_eval` to compute their expected utility exactly. Expectimax then maximizes at agent nodes and takes expectation under a fixed opponent policy. Minimax changes the opponent node to min, producing a worst-case policy for an unknown opponent. The face-off section makes clear that each optimality claim is relative to an opponent assumption. When chance enters the tree, expectiminimax combines max, min, and expectation.

The final two speedups have different contracts. Alpha-beta is branch-and-bound with bounds and ordering, so it remains exact. An evaluation function is prior knowledge used at a depth-limited leaf, trading full-tree guarantees for computability. Alpha-beta's main practical variable is ordering; depth-limited evaluation's main risk is the quality of its estimates and cutoff depth. Keeping those assumptions next to the interface is what prevents “best against a fixed opponent,” “guaranteed against the worst opponent,” and “approximately best under a finite search” from collapsing into one answer.

## References

- [CS221 Autumn 2025 course site](https://stanford-cs221.github.io/autumn2025/)
- [Official lecture artifact: games](https://stanford-cs221.github.io/autumn2025-lectures/?trace=games)
- [CS221 Autumn 2025 executable lecture repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Official Stanford Online CS221 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
