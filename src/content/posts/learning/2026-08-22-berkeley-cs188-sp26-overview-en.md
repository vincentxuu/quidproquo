---
title: "Berkeley CS188 Spring 2026: Learn AI Through Projects P0–P5"
date: 2026-08-22
category: learning
tags: [berkeley, cs188, artificial-intelligence, pacman, open-course]
lang: en
type: guide
difficulty: 進階
series:
  name: "Berkeley CS188 Spring 2026"
  order: 1
tldr: "CS188 Spring 2026 publishes 28 recordings, 27 lecture slide sets, 11 discussions, and Projects P0–P5. P0 is a Python/autograder tutorial, P1–P4 use Pacman settings, and P5 contains general machine-learning tasks."
description: "A complete self-study overview of Berkeley CS188 Spring 2026: public resources, prerequisites, Projects P0–P5, study order, and access limits for independent learners."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-berkeley-cs188-sp26-overview)

[Berkeley CS188 Spring 2026](https://inst.eecs.berkeley.edu/~cs188/sp26/) is a broad introduction to artificial intelligence, not merely a neural-network course. It begins with state spaces, heuristics, constraint satisfaction, and game trees; moves through MDPs, reinforcement learning, and probabilistic inference; and only then reaches machine learning, deep learning, and LLMs. The official schedule publishes 28 recordings, 27 lecture slide sets (Lecture 22 has no separate slides), 11 discussion sets, and Projects P0–P5.

Its strength is that concepts return as programs. P0 teaches Python and the autograder; P1–P4 use Pacman settings for search, multi-agent reasoning, RL, and probabilistic inference; P5 contains general ML tasks such as regression, classification, CNNs, and attention. That is why this series follows P0–P5 instead of producing 28 disconnected lecture summaries.

## What is publicly available

Under this site's A0–A3 rubric, this edition is A3. The official page links directly to slides, YouTube recordings, the [online textbook](https://inst.eecs.berkeley.edu/~cs188/textbook/), discussion worksheets and solutions, and specifications and files for [Projects P0–P5](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/). The starter files include a local autograder, giving independent learners a workable code-test-revise loop.

Berkeley course services remain outside that loop: Ed, official submissions, instructor feedback, and the full grading experience. This guide neither depends on nor promises access to an auditor Gradescope account; an untested entry path is not an executable self-study step.

## What to know first

The [official prerequisites](https://inst.eecs.berkeley.edu/~cs188/sp26/policies/) are CS61A or CS61B, plus CS70 or Math 55. Completing all projects is easier with programming, data-structure, and discrete-mathematics background together. An independent learner can use three checks: read Python classes and recursion comfortably, explain stacks versus queues versus priority queues, and compute conditional probabilities and expectations.

If Python or terminal work is unfamiliar, begin with the optional [Project 0](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj0/), which teaches setup and the autograder workflow. If P0 is effortless, move on.

## How the seven-part guide works

1. **Search and heuristics:** Lectures 1–4, then P0/P1.
2. **CSPs and multi-agent search:** Lectures 5–8, then P2.
3. **MDPs and reinforcement learning:** Lectures 9–12, then P3.
4. **Bayes nets and Ghostbusters:** Lectures 13–18, then P4.
5. **Decisions and machine learning:** Lectures 19–25, then P5.
6. **Applications, safety, and completion:** Lectures 26–28, followed by project integration.

For each stage, read the textbook first, watch the lecture, and attempt the discussion worksheet before checking its official solution. When a project stalls, reduce the problem to one local autograder case instead of searching for a full solution. The point is translating a model into code, not merely launching Pacman.

## Start tonight

Open P0 and verify that Python and the local autograder run. Then read the state-space search chapter and write down the frontier rule for DFS, BFS, and UCS. If time remains, inspect P1's file layout and Q1 without trying to finish the project at once.

## References

- [Berkeley CS188 Spring 2026](https://inst.eecs.berkeley.edu/~cs188/sp26/)
- [CS188 online textbook](https://inst.eecs.berkeley.edu/~cs188/textbook/)
- [CS188 Spring 2026 projects](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/)
- [CS188 Spring 2026 policies](https://inst.eecs.berkeley.edu/~cs188/sp26/policies/)
