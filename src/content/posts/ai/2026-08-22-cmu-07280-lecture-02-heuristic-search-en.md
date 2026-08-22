---
title: "CMU 07-280 Lecture 2: Heuristic Search from UCS and Greedy to A*"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cmu, ai-course, search, a-star, algorithms]
lang: en
series:
  name: "Reading CMU 07-280"
  order: 2
tldr: "Lecture 2 decomposes search into a problem, frontier, and priority: UCS uses paid cost, Greedy uses estimated remaining cost, and A* combines them as `f=g+h`; tree and graph search require different optimality conditions."
description: "A complete reading of CMU 07-280 Spring 2026 Heuristic Search: problem formulation, tree and graph search, DFS, BFS, UCS, Greedy, A*, admissibility, and consistency."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cmu-07280-lecture-02-heuristic-search)

This is **CMU 07-280 Spring 2026 Lecture 2: Heuristic Search**. The point is not memorizing five algorithms. It is seeing how each algorithm assigns a different priority to the same frontier. Completeness, path cost, and memory use are often determined at the moment the algorithm chooses what to expand next.

## Official materials and reading scope

I read the complete [inked slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec2_Heuristic_Search_inked.pdf), [Search pre-reading](https://www.cs.cmu.edu/~07280/notes/search/search_prereading.html), [Recitation 1 worksheet](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec1.pdf) and [solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec1_sol.pdf), and checked [HW1](https://www.cs.cmu.edu/~07280/assignments/hw1_blank.pdf). No public lecture recording is available. Inked slides preserve marks on slides, not a verbatim class transcript.

## The inherited question: after representing a problem, which state comes next

Lecture 1 required a precise input and representation. Lecture 2 defines a search problem through an initial state, actions, transition model, action cost, and goal test. The algorithm does not operate on the world directly; it operates on the state-space graph produced by those definitions.

The same state may be reached through several paths. **Tree search** keeps each path as a separate search node. **Graph search** stores an explored set to avoid expanding the same state repeatedly. Tree search may loop or duplicate work. Graph search saves work but must avoid permanently closing a state before a cheaper path to it is discovered.

## Full conceptual path: frontier priority is the strategy

The shared loop puts the start node on a frontier, removes one node at a time, returns a path if it reaches a goal, and otherwise inserts its successors. The priority rule creates the named algorithms:

| Strategy | Priority | Intuition |
|---|---:|---|
| DFS | deepest or last-in | follow one path to its end |
| BFS | depth | find the fewest-step path first |
| UCS | `g(n)` | expand the lowest paid cost |
| Greedy | `h(n)` | expand what looks closest to a goal |
| A* | `g(n)+h(n)` | combine paid and estimated remaining cost |

The heuristic `h(n)` estimates the remaining cost from a node to a goal. It is **admissible** when `h(n) ≤ h*(n)`: it never overestimates the true remaining cost. A* tree search can then prevent a suboptimal goal from looking cheaper than every node on an optimal path.

Graph search requires the stronger **consistency** condition. For every edge `n → n'`, `h(n) ≤ c(n,n') + h(n')`. Equivalently, `f=g+h` never decreases along a path. When a state leaves the priority queue for the first time, its path is already cheapest. The recitation solution emphasizes that admissibility does not imply consistency; the course's A* graph-search version is not guaranteed optimal with admissibility alone.

## A reproducible example: why Greedy loses to A*

Consider two routes from `S` to `G`:

```text
S --2--> A --2--> G
S --1--> B --10-> G
h(A)=2, h(B)=1, h(G)=0
```

Greedy compares only `h`, chooses `B`, then reaches `G` at total cost 11. A* first computes:

```text
f(A)=g(A)+h(A)=2+2=4
f(B)=g(B)+h(B)=1+1=2
```

A* also expands `B` first. But the resulting goal has `f=11`, while `A` remains on the frontier with 4. A* returns to `A` and finds the cost-4 route. A* is not immune to initially moving in the wrong direction; it simply refuses to forget paid cost when “closeness” looks attractive.

## Recitation and homework connection

Recitation 1 first formulates Tower of Hanoi as a search problem, then compares admissible and consistent heuristics, and finally traces DFS, BFS, UCS, Greedy, and A*. Its counterexamples are the most valuable part to redraw, especially the claim that A* graph search with an admissible heuristic must be optimal.

HW1 moves the same skills into a navigation state with position, orientation, and velocity. It asks about branching factor, dead ends, overestimating heuristics, and possible returned paths. This is not a cosmetic change. Once orientation and velocity enter the state, a heuristic based only on geometric distance can become misleading.

## Further comparison: a heuristic is extra knowledge, not a free answer

BFS and UCS need no directional knowledge about the goal and pay by expanding broadly. Greedy and A* place domain knowledge inside `h`, so efficiency depends on heuristic quality. Setting `h=0` reduces A* to UCS. Setting `h=h*` nearly points directly to an optimal path, but computing `h*` is usually equivalent to solving the original problem.

The real design question is whether a computation cheaper than search can produce an informative lower bound while preserving the guarantee you need.

## What to do tonight

1. Trace the DFS, BFS, UCS, Greedy, and A* explored orders in Recitation 1 without its solution.
2. Define misplaced-tile and Manhattan-distance heuristics for the eight puzzle and justify why each does not overestimate.
3. Draw a three-node admissible-but-inconsistent example and run the course's A* graph search by hand.

## References

- [CMU 07-280 Spring 2026 Lecture 2 — Heuristic Search, inked slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec2_Heuristic_Search_inked.pdf)
- [07-280 Search pre-reading](https://www.cs.cmu.edu/~07280/notes/search/search_prereading.html)
- [07-280 Spring 2026 Recitation 1](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec1.pdf)
- [Recitation 1 solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec1_sol.pdf)
- [07-280 Spring 2026 Homework 1](https://www.cs.cmu.edu/~07280/assignments/hw1_blank.pdf)
