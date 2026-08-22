---
title: "CMU 07-280 Lecture 4: CSPs, AC-3, and Search Order"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cmu, ai-course, constraint-satisfaction, csp, search]
lang: en
series:
  name: "Reading CMU 07-280"
  order: 4
tldr: "Lecture 4 exposes structure through variables, domains, and constraints, then upgrades DFS with backtracking, forward checking, AC-3, MRV, and LCV; the goal is to prove failure earlier."
description: "A complete reading of CMU 07-280 Spring 2026 Constraint Satisfaction Problems: CSP formulation, backtracking, forward checking, arc consistency, AC-3, MRV, and LCV."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cmu-07280-lecture-04-constraint-satisfaction)

This is **CMU 07-280 Spring 2026 Lecture 4: Constraint Satisfaction Problems**. A CSP is still search, but it does not treat a state as a black box. Variables, domains, and constraints expose structure, allowing the algorithm to delete impossible values before completing an assignment.

## Official materials and reading scope

I read the complete [inked slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec4_CSPs_inked.pdf), used the official [backtracking demo](https://www.cs.cmu.edu/~07280/demos/csp_backtracking/), and read [Recitation 2](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec2.pdf), its [solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec2_sol.pdf), and [HW2](https://www.cs.cmu.edu/~07280/assignments/hw2_blank.pdf). No lecture recording is public. The demo exposes algorithm state, not spoken instruction.

## The inherited question: can failure be found before finishing a wrong path

Generic search can use a partial assignment as a state and expand until the goal test passes. But with `n` variables and `d` values each, there can be `d^n` complete assignments. Waiting until every variable is filled before checking constraints wastes branches that were contradictory much earlier.

A CSP has three parts: variables `X={X1,...,Xn}`, a domain `Di` for each variable, and constraints defining permitted joint values. Map coloring, N-Queens, and Sudoku share this language; only their graph structure and constraint types differ.

## Full conceptual path: from backtracking to propagation

**Backtracking search** is DFS with two key changes. Assign one unassigned variable at a time, and return immediately when a constraint is violated. Since assignment order does not change the final assignment, it avoids treating permutations of the same values as separate solutions.

**Forward checking** processes the consequences of assigning `Xi=vi` by deleting conflicting values from adjacent unassigned domains. If any domain becomes empty, backtrack immediately. It examines only arcs directly affected by the new assignment.

**Arc consistency** goes further. For a directed arc `Xi → Xj`, every value in `Di` must have at least one compatible supporting value in `Dj`. AC-3 repeatedly revises arcs in a queue. When `Di` shrinks, arcs from neighbors that may depend on `Di` return to the queue. The slides give `O(n²d³)` as an upper bound for one AC-3 run, while a full backtracking solver may invoke it repeatedly.

Ordering completes the toolkit. **MRV** chooses the variable with the smallest domain, exposing failure early. **LCV** tries the value that removes the fewest choices from neighbors, preserving flexibility. One is fail-fast; the other is least-constraining.

## A reproducible example: AC-3 solves a three-region chain

Let adjacent regions `A-B-C` use colors `{R,G}`, with an inequality constraint on each edge and a unary constraint `A=R`.

```text
DA={R}, DB={R,G}, DC={R,G}
```

On arc `B→A`, value `B=R` has no differently colored support in `A`, so remove R and obtain `DB={G}`. Since B changed, process `C→B`; `C=G` has no support, leaving `DC={R}`. Constraint propagation finds the unique assignment without expanding a search branch.

The example also shows why arcs are directed. `B→A` checks whether each value of B has support in A. `A→B` checks the other domain. Both directions matter.

## Recitation and homework connection

The second half of Recitation 2 formulates aircraft scheduling with variables, domains, unary and binary constraints, then draws a constraint graph and runs AC-3 plus backtracking. A magic-square problem shows that a higher-order `alldiff` constraint is not fully represented by every simplified binary graph; omitting it for one drawing does not remove it from the original CSP.

The worksheet ends by comparing MRV, LCV, and different orderings through their backtracking behavior. HW2 programming places CSPs beside games in the same search-and-games assignment. The public tree is enough for an independent implementation, but the official tests and Gradescope feedback are not public.

## Further comparison: propagation is not a complete solver

Arc consistency catches many contradictions early, but it neither guarantees a solution nor proves that an arc-consistent CSP has a global solution. Every local edge can have compatible support while a cycle or higher-order constraint remains jointly impossible. AC-3 therefore usually lives inside backtracking: propagation shrinks domains, and search resolves the remaining choices.

This pattern—reasoning to reduce a space, search to handle residual ambiguity—returns later when the course combines learned models with MCTS.

## What to do tonight

1. Formulate Australian map coloring with three colors: list variables, domains, and every binary constraint.
2. Run AC-3 on a three-node chain, recording the queue and each deleted value.
3. Open the official demo and compare when forward checking and AC-3 first discover the same dead end.

## References

- [CMU 07-280 Spring 2026 Lecture 4 — CSPs, inked slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec4_CSPs_inked.pdf)
- [07-280 CSP backtracking demo](https://www.cs.cmu.edu/~07280/demos/csp_backtracking/)
- [07-280 Spring 2026 Recitation 2](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec2.pdf)
- [Recitation 2 solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec2_sol.pdf)
- [07-280 Spring 2026 Homework 2](https://www.cs.cmu.edu/~07280/assignments/hw2_blank.pdf)
