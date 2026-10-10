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

**Video status: Videos included.** [Source details](#course-video-sources)

The opening unit of CS188 asks how an agent should expand possible states when it does not know the solution path. The [Lectures 1–4 schedule](https://inst.eecs.berkeley.edu/~cs188/sp26/) covers agents, uninformed search, A*, and local search. [Project 1](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj1/) turns that sequence into implementations of DFS, BFS, UCS, and A*, followed by heuristic design for corners and food search.

## Course video sources

The official Spring 2026 schedule and the official YouTube playlist ([CS188 SP26] Live Lectures, 28 videos) were checked live on 2026-10-10; the lecture recording embedded here is listed there as a “Recording”. No unverified timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=On4rmdfuFKE
title: CS188 Spring 2026 Lecture 1: Intro, Agents, and Environments
```

Original videos: [CS188 Spring 2026 Lecture 1: Intro, Agents, and Environments](https://www.youtube.com/watch?v=On4rmdfuFKE)

Course and recording entries:

- [Official course and recording entry](https://inst.eecs.berkeley.edu/~cs188/sp26/)
- [CS188 Spring 2026 Recordings](https://www.youtube.com/playlist?list=PLp8QV47qJEg5tSxKiwcZt4LVwN_ek2Kxy)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): sampled check (only the first ~5,000 characters of the transcript were read): the embedded video is Lecture 1, on course introduction, agents and environments; the early part is course logistics and staff introductions (Dan Klein and Stuart Russell sharing lectures) before moving into the notion of an agent, consistent with this article treating Lecture 1 as the start of the search unit. The remaining sections of this article cover other lectures in the unit and the project, not this video.

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

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The official Spring 2026 schedule and YouTube playlist were checked live and list the embedded lecture recording, so the status is now Videos included.
- 2026-10-10: Checked the video content against its transcript. Confirmed the embedded video is Lecture 1 (course introduction, agents and environments) and fits the article scope; no video claims needed correcting.

## References

- [CS188 Spring 2026 course calendar](https://inst.eecs.berkeley.edu/~cs188/sp26/)
- [CS188 textbook — Search](https://inst.eecs.berkeley.edu/~cs188/textbook/search/state.html)
- [CS188 Spring 2026 Project 1](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj1/)
