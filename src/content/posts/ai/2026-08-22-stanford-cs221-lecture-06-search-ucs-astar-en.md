---
title: "CS221 Lecture 6: Search II: Priorities in UCS and A*"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: en
series:
  name: "Reading Stanford CS221"
  order: 7
tldr: "Lecture 6 of Stanford CS221 Autumn 2025 follows the official material on Search II: Priorities in UCS and A* and makes its assumptions and limits explicit."
description: "A lecture-by-lecture reading of Stanford CS221 Autumn 2025 Lecture 6: official agenda, core development, implementation connection, and material gaps."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs221-lecture-06-search-ucs-astar)

This article covers **Stanford CS221, Autumn 2025, Lecture 6**, taught by Percy Liang on 2025-10-08. The [official course site](https://stanford-cs221.github.io/autumn2025/) fixes the offering and assignments; the primary artifact is [ucs_astar](https://stanford-cs221.github.io/autumn2025-lectures/?trace=ucs_astar).

> Material gap: Official lecture material and video are public; Canvas interactions, assignment solutions, and hidden tests are unavailable.

## Recap: what search is solving

Last time began with a simple premise: complex problems require search, using thinking and reasoning to find an executable sequence of actions. A search problem must first be formalized as callable pieces: how states are represented, which successors follow from a state, the start state, and whether a state is an end state. The source's travel example constructs this interface with ten locations: obtain the start state, inspect its successors, and test one successor for termination.

The objective is not merely to find any path. It is to find an action sequence that minimizes total cost. Exact algorithms in the source include exhaustive search and dynamic programming with caching; approximate algorithms include best-of-n and beam search. “Find an answer” and “find a minimum-cost answer” are different objectives.

This lecture addresses the harder case in which the search graph allows cycles, under the assumption that every action cost is nonnegative. Its agenda is Uniform-cost search (UCS), A* search, and heuristics built through relaxation. The closing claims are equally explicit: UCS and A* are exact algorithms that allow cycles (but require nonnegative costs); the key is ordering states by increasing past cost; in general one cannot do better than UCS; and A* uses domain knowledge to accelerate search.

## Why UCS changes the priority order

Separate two kinds of cost. Future cost is the minimum cost from a state to an end state. Past cost is the minimum cost from the start state to that state. Dynamic programming commonly computes future cost: because a state's future cost depends on successor future costs, and because cycles are excluded, it computes from end states back toward the start, like backpropagation.

With cycles (undirected edges are a special case), there is no simple topological order. The source's diamond graph starts at A: A→B costs 1, A→C costs 100; B→C costs 1 and C→D costs 1, with cost-100 detours also present. Which comes first, B or C? More generally, in what order should states be processed?

UCS answers by computing past costs and processing states in increasing past cost rather than computing future costs in topological order. It is presented alongside Dijkstra (1956) and assumes all costs are nonnegative. That assumption matters: an already-spent cost cannot be reduced by taking the next action, so the current minimum remains meaningful.

## Frontier, priority queue, and updates

UCS divides candidate states into three groups. Explored states are those for which the minimum-cost path has been found. The frontier contains states that have been seen but whose best way of reaching them is still being determined. Unexplored states have not been seen. A priority queue manages the frontier, with the current minimum known past cost as priority; each `remove_min` returns the state with the smallest priority.

The start state enters the queue at priority 0. After expanding a state, UCS considers every successor and computes `past_cost + successor.cost`, then calls `frontier.update(successor.state, new_priority)`. The update succeeds only when the state is new or the new route is cheaper. That relaxation decision also determines whether the backpointer must change.

The source implementation combines a heap with a `priorities` dictionary. Since heapq does not delete old heap entries directly, lowering a priority pushes a new tuple while leaving the old tuple in the heap. That old tuple is a stale entry. Once the state is removed with its newest, smaller priority, the dictionary marks it `DONE`; when the old tuple later appears, it is skipped. The number of heap tuples is therefore not the number of valid candidates.

`num_explored` increases only after a valid state is removed from the queue. An empty queue returns no solution and the exploration count; an end state stops the search before expansion. The count means states removed and processed, not every candidate ever seen and not every heap tuple.

## Backpointers and path reconstruction

The queue does not need to carry a complete path for every candidate. The source's `Backpointer` records, for each state, its previous state, the action taken, and that action's cost. When a cheaper route to a successor is found, its backpointer is replaced with the current state as predecessor.

When UCS removes an end state, it follows backpointers from the end back to the start. Each edge becomes a `Step` inserted at the front of `steps`, producing a forward action sequence rather than the reverse tracing order. The important detail is that a backpointer stores the current best predecessor, not every edge that ever reached the state. Freezing the first predecessor would preserve an expensive path in the diamond example.

## Two UCS examples

The diamond example makes priority order visible. A is removed with priority 0, B enters the frontier at 1, and C first enters at 100. Expanding B changes C to 2 and gives D a candidate cost of 101. C is then removed first, updates D to 3, and D is finally removed. Reconstruction yields A→B→C→D rather than accepting the initially visible expensive detour. Frontier updates and backpointers must work together.

The second example is a grid search. States are grid coordinates; S is the start and E the end. Actions are up, down, left, and right, each with cost 1, while `#` marks an impassable wall. The source draws the grid graph, inspects the start, successors, and end test, and then runs UCS. Equal action costs make the queue process reachable cells by distance layers, but the point is still general cost ordering, not simply renaming UCS as BFS.

The source also links a larger demonstration in which each pixel is a state. The material supplies a video link but no additional numbers or efficiency conclusion, so this article does not invent a benchmark for it.

## UCS correctness intuition and conditions

The theorem is: whenever UCS moves a state `s` from the frontier to explored, `priority(s) = PastCost(s)`. The base case is `priority(start) = PastCost(start) = 0`. For the inductive case, assume the equality holds for every explored state and consider an alternative red path to `s` through explored `t` and frontier `u`.

Because `PastCost(t)` is the minimum cost to t and the cost from u to s is nonnegative, the red path costs at least `PastCost(t) + Cost(t,u)`. By induction this is `priority(t) + Cost(t,u)`. Since t was used to update u, that quantity is at least `priority(u)`; since s is the minimum-priority frontier state, it is at least `priority(s)`. The latter equals the blue path cost by definition. Thus no cheaper alternative path can exist when s is removed.

This proof does not cover negative costs. A negative edge from explored territory could lower a previously settled total and invalidate the ordering. The source therefore treats nonnegative costs as an explicit condition, not as an implementation detail.

## A*: putting the goal into the order

UCS knows past cost but has no information about how far a state is from an end state. Ideally, states would be ordered by `PastCost(s) + FutureCost(s)`, but computing FutureCost is generally as hard as solving the original problem. A* uses a heuristic `h(s)` as an approximation and explores by `PastCost(s) + h(s)`.

The source turns A* into UCS through modified costs:

`Cost'(s, a) = Cost(s, a) + h(Succ(s, a)) - h(s)`.

The intuition is that an action receives a larger penalty when it appears to move away from the goal and a smaller modified cost when it appears to move closer. `ModifiedSearchProblem` applies the formula to each successor and calls UCS. UCS returns a path under modified costs; `astar_search` restores each original action cost with `modified_cost - h(next) + h(current)`.

The line example starts at state 0, allows left and right moves of cost 1, and ends at 2. Its heuristic is `h(state) = 2 - state`, which favors moving right. The source runs UCS and then A* over the same search interface, showing how ordering information changes. It also supplies links to UCS and A* demonstration videos.

Not every heuristic works. In the counterexample, `h(C) = 1000` actively misleads the search. To make the modified problem suitable for UCS, the source defines consistency: `Cost(s,a) + h(Succ(s,a)) - h(s)` must be nonnegative on every edge, and `h(end) = 0`. Under this condition A* is correct. For any start-to-end path, the sum of modified costs equals the sum of original costs minus `h(start)`, because the intermediate heuristic terms cancel as a telescoping sum.

Admissibility means `h(s) <= FutureCost(s)`: the heuristic always underestimates future cost. The source states that consistency implies admissibility. Its efficiency proposition says A* explores states satisfying `PastCost(s) <= PastCost(end) - h(s)`. With `h(s)=0`, A* equals UCS; with `h(s)=FutureCost(s)`, it explores only nodes on minimum-cost paths; usual heuristics lie between these cases. These are conditional comparisons from the source, not a universal promise of identical exploration counts.

## Relaxation: obtaining a heuristic

An ideal heuristic equals FutureCost, which would require solving the original problem again. The source's recipe is to remove some constraints, compute the future cost in the easier relaxed problem, and set `h(s) = FutureCost_relaxed(s)`. The aim is not to guess a number but to preserve a useful lower bound while making the calculation tractable.

The first relaxation returns to the walled grid: remove every `#`. The relaxed future cost from `(r,c)` to the lower-right goal has a closed form, the Manhattan distance `abs(end_r-r) + abs(end_c-c)`. The source evaluates `(0,0)`, `(0,1)`, `(2,4)`, and `(3,0)` in order; looking close to E does not mean the original walled map is easy. It runs UCS and A*, and explicitly notes that A* provides no benefit in this case.

The second example is limited travel. From 1 to n, one may walk (`i → i+1`) or take a tram (`i → 2*i`), but tram use is limited by a ticket count. The relaxed problem makes the tram free again and computes future costs with an unrestricted TravelSearchProblem. The original state is `(loc, tickets)`, while the relaxed state contains only loc, so the heuristic maps the original state to the relaxed one. For accounting, the cost of solving the relaxed problem must also be included. The source also notes that dynamic programming cannot handle cycles; if the relaxed problem has cycles, reverse its edges and use past costs in the reversed problem as future costs in the original relaxed problem.

The third example is the 8-puzzle. The original problem forbids tiles from overlapping; the relaxed problem allows overlap, splitting it into eight independent subproblems, each solvable in closed form. The source's displayed heuristic value is the sum `1 + 1 + 3 + 1 + 1 + 1 + 1 + 3`. This article keeps the relaxation shown by the material and does not add puzzle theory absent from the source.

The general definition is that a relaxation keeps the same states, actions, and successors while satisfying `Cost_relaxed(s,a) <= Cost(s,a)` for every edge. It can be viewed as reducing constraint-induced infinite costs to finite values. If h is the future cost of a relaxed problem, then `h(s) <= Cost_relaxed(s,a) + h(Succ(s,a)) <= Cost(s,a) + h(Succ(s,a))`, so h is consistent.

A relaxed problem is not automatically easier. Costs must be reduced in a structured way that can reduce the number of states, produce a closed-form solution, or split the problem into independent subproblems. Finally, if h1 is the heuristic from removing walls and h2 the heuristic from a free tram, then `h(s)=max(h1(s),h2(s))` is consistent whenever both are consistent. The source's proof takes the maximum of the two consistency inequalities and factors out the shared Cost.

## Closing: what this lecture promises

UCS explores by increasing past cost and uses priority-queue updates, DONE/stale-entry accounting, and backpointers to reconstruct a minimum-cost path; with nonnegative costs, the removed goal has minimum cost. A* is UCS with a heuristic: consistency keeps modified costs nonnegative, admissibility supplies a lower bound on future cost, and a useful relaxation may reduce exploration.

Next time asks what happens when action outcomes are nondeterministic, such as rolling dice. Canvas interactions, assignment solutions, hidden tests, and unsupported numerical claims remain material gaps; they should not be filled with another term or intuition.

## References

- [CS221 Autumn 2025 course site](https://stanford-cs221.github.io/autumn2025/)
- [Official lecture artifact: ucs_astar](https://stanford-cs221.github.io/autumn2025-lectures/?trace=ucs_astar)
- [CS221 Autumn 2025 executable lecture repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Official Stanford Online CS221 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
