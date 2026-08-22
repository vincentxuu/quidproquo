---
title: "CS188 Search and Heuristics: Pacman from DFS and BFS to A*"
date: 2026-08-22
category: learning
tags: [berkeley, cs188, search, heuristic, pacman]
lang: en
type: guide
difficulty: 進階
series:
  name: "Berkeley CS188 Spring 2026"
  order: 2
tldr: "Lectures 1–4 and Project 1 connect DFS, BFS, UCS, A*, state representation, and heuristic design. The goal is not memorizing algorithms but separating what the frontier, cost, and state each control."
description: "A project-centered guide to search algorithms, state representation, heuristic design, and the local autograder in Berkeley CS188 Spring 2026."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-berkeley-cs188-search-heuristics)

The opening unit of CS188 asks how an agent should expand possible states when it does not know the solution path. The [Lectures 1–4 schedule](https://inst.eecs.berkeley.edu/~cs188/sp26/) covers agents, uninformed search, A*, and local search. [Project 1](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj1/) turns that sequence into implementations of DFS, BFS, UCS, and A*, followed by heuristic design for corners and food search.

## Fix the common skeleton first

All four graph-search methods share a loop: remove a node from the frontier, test the goal, expand successors, and avoid repeated states. DFS and BFS change frontier order; UCS orders by accumulated cost; A* adds an estimate of remaining cost. Four largely duplicated implementations usually mean the shared abstraction has been missed.

## State is harder than the formula

P1 explicitly warns against using the entire `GameState` as the corners search state. Two positions can be identical while differing in which corners were visited, which changes the future objective. Ghost data and irrelevant food, however, should not inflate the state. A useful representation retains exactly what affects future legal actions and goal tests.

Heuristics must balance speed with correctness. The [official P1 specification](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj1/) requires a consistent food heuristic. An impressive-looking estimate that overreaches can remove A*'s guarantee. Begin with a lower bound you can justify, then use the autograder to inspect expansions rather than reverse-engineering a score threshold.

## A practical order

1. Write the frontier rule for all four algorithms before coding.
2. Implement DFS and BFS; observe how expansion order changes the path.
3. Implement UCS and A*; test path cost separately from the heuristic.
4. Describe in one sentence what your corners-state tuple predicts.
5. Run one question or test case at a time. The local autograder is enough; Gradescope is not required.

After P1, retain three questions: does the state preserve necessary information, what preference does the frontier encode, and does the heuristic provide only a safe directional estimate? Those questions return in MDPs, Bayes nets, and planning.

Series navigation: [Previous: Course overview](/posts/learning/2026-08-22-berkeley-cs188-sp26-overview-en) | [Next: CSPs and multi-agent search](/posts/learning/2026-08-22-berkeley-cs188-csp-multi-agent-en)

## References

- [CS188 Spring 2026 course calendar](https://inst.eecs.berkeley.edu/~cs188/sp26/)
- [CS188 textbook — Search](https://inst.eecs.berkeley.edu/~cs188/textbook/search/state.html)
- [CS188 Spring 2026 Project 1](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj1/)
