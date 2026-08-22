---
title: "The Pacman AI Project Lineage: How Berkeley CS188 and CMU 15-281 Restructure the Same Material"
date: 2026-08-22
category: learning
tags: [berkeley, cmu, artificial-intelligence, pacman, course-guide]
lang: en
type: deep-dive
tldr: "CMU 15-281's Search and Games explicitly credits Berkeley's Pacman AI projects. The official course site separately lists a zero-point P0 tutorial and five programming assignments, P1–P5."
description: "An official-assignment-based comparison of the Pacman AI project's documented origin, file structure, problem split, and self-study paths."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-pacman-ai-project-lineage)

Berkeley CS188 and CMU 15-281 both ask Pacman to search mazes, avoid ghosts, and eat food, but “the schools happened to use similar games” is not the most precise account. CMU's [Search and Games assignment](https://www.cs.cmu.edu/~15281/assignments/programming/search_and_games/) explicitly says that it is based on the Pacman AI projects developed at UC Berkeley. The lineage is documented. The public specifications do not say why CMU chose each modification or who decided to merge particular tasks, so this article does not infer those motives.

The comparison uses two structures anonymously accessible in 2026: Berkeley CS188 Spring 2026's six projects and CMU 15-281 Spring 2026's programming-assignment sequence.

## Berkeley separates AI units into individual Pacman projects

[Berkeley CS188 Spring 2026](https://inst.eecs.berkeley.edu/~cs188/sp26/) lists P0–P5. P0 introduces Python and the autograder; subsequent projects follow course units:

| Project | Official topic | Main environment |
|---|---|---|
| [P0](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj0/) | Python tutorial | Basic functions and local autograder |
| [P1](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj1/) | Search | Pacman mazes, search problems, heuristics |
| [P2](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj2/) | Multi-Agent Search | Pacman, ghosts, minimax, alpha-beta, expectimax |
| [P3](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj3/) | Reinforcement Learning | Gridworld, Crawler, and Pacman |
| [P4](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj4/) | Ghostbusters | Bayes nets and particle-filter tracking |
| [P5](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj5/) | Machine Learning | Neural-network models |

This split keeps each project close to a lecture unit. Each specification provides downloadable code, identifies files to edit, gives test commands, and includes a local autograder. Independent learners lack Ed, official grades, and staff help, but can execute the core practice path.

## CMU combines search and multi-agent work into its first main assignment

CMU's Search and Games is more than a logo change. Within one archive and autograder, it first asks for iterative deepening, A*, Corners and Food heuristics, then moves to a reflex agent, minimax, and expectimax. The specification names `search.py`, `searchAgents.py`, and `multiAgents.py` as editable files and publishes test cases and a local autograder.

The clearest structural difference is consolidation. Berkeley places Search and Multi-Agent Search in P1 and P2; CMU puts both in Search and Games. CMU's questions are not a verbatim mirror of Berkeley's current version. For example, CMU begins its search section with iterative deepening and A*, while Berkeley's current P1 sequence includes DFS, BFS, UCS, and A*. The common framework and explicit attribution are provable; complete identity is not.

## The shared framework still has course-specific grading boundaries

Both versions preserve several core designs:

- `GameState` represents the game, while agents generate successors through legal actions.
- Search questions separate an algorithm from a maze problem so either side can vary.
- Multi-agent questions make Pacman the max agent and ghosts the other agents.
- Local autograders inspect interfaces and behavior such as expanded nodes or successor generation.

But an autograder belongs to a specific course version. CMU's specification even warns that some standard alpha-beta implementations will not match its grader because they call `generateSuccessor` a different number of times. Algorithmic correctness has not changed; theoretical correctness and compliance with a specified evaluation interface coexist.

For self-study, use only the starter and grader from the version you are reading. Do not mix Berkeley and CMU starters, graders, or completed files, and do not compare node-count thresholds across semesters.

## Pacman serves different roles in the two course structures

At Berkeley, Pacman spans search, multi-agent reasoning, reinforcement learning, and probabilistic inference. In [CMU 15-281 Spring 2026](https://www.cs.cmu.edu/~15281/), Search and Games is P1; the sequence continues with P2 Optimization, P3 Planning, P4 Reinforcement Learning, and P5 Ghostbusters. Both courses use Pacman, but their project boundaries and subsequent sequences differ.

There is also a 2026 curricular layer. The [07-280 FAQ](https://www.cs.cmu.edu/~07280/#faq) says that 15-281 and 10-315 will be retired, while the [BSAI curriculum](https://www.cs.cmu.edu/bs-in-artificial-intelligence/curriculum) lists 07-280/07-380 in the current AI core. That does not erase the assignment's origin or imply a corresponding change at Berkeley. It changes only the present role of CMU's Pacman archive: from a current-core assignment to an executable historical resource.

## Choosing a version to start

To follow a broad AI course one unit at a time, use Berkeley Spring 2026: run P0 first, then continue through P1–P5. To study how another institution restructures the material, complete one small question from Berkeley P1 and P2, then compare CMU Search and Games' interfaces and ordering.

Tonight's smallest action is to download one version's starter code and run its own `python3 autograder.py`. Once the environment starts, address only the first failing test. Pinning the version matters more than finding a supposed best solution.

## References

- [Berkeley CS188 Spring 2026](https://inst.eecs.berkeley.edu/~cs188/sp26/)
- [Berkeley CS188 Project 1: Search](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj1/)
- [Berkeley CS188 Project 2: Multi-Agent Search](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj2/)
- [CMU 15-281 Spring 2026](https://www.cs.cmu.edu/~15281/)
- [CMU 15-281 Search and Games](https://www.cs.cmu.edu/~15281/assignments/programming/search_and_games/)
- [CMU 07-280 FAQ](https://www.cs.cmu.edu/~07280/#faq)
- [CMU BSAI Curriculum](https://www.cs.cmu.edu/bs-in-artificial-intelligence/curriculum)
