---
title: "Berkeley CS285 L19–25: Exploration, RL Theory, Multitask Learning, and Open Problems"
date: 2026-08-22
category: learning
tags: [cs285, berkeley, exploration, reinforcement-learning, multi-task-learning]
lang: en
type: guide
difficulty: 深度
tldr: "The final seven lectures move from exploration and theoretical limits through two review lectures to advanced exploration, multitask RL, and unresolved research problems."
description: "A guide to CS285 Spring 2026 Lectures 19–25: exploration, theory, review, multitask learning, and open problems."
series:
  name: "Reading Berkeley CS285 Spring 2026"
  order: 5
---

> 🌏 [中文版](/posts/learning/2026-08-22-berkeley-cs285-exploration-open-problems)

The final seven items in the [official agenda](https://rail.eecs.berkeley.edu/deeprlcourse/) are Exploration, RL Theory, two Midterm Review lectures, Advanced Exploration, Multi-task RL, and Challenges and Open Problems. This is not miscellaneous cleanup. It asks when earlier algorithms are reliable and whether experience transfers to new tasks.

## L19–20: exploration and guarantees

Exploration balances immediate reward against information value. RL Theory turns intuitions into assumptions and bounds on samples, regret, or performance. Annotate every theoretical result with its conditions. Tabular structure, coverage, or realizability assumptions cannot silently migrate into deep-RL practice.

## L21–22: review as diagnosis

Use the two review lectures for closed-note reconstruction. Draw imitation learning, policy gradients, actor-critic, Q-learning, control as inference, model-based RL, and offline RL. Label each connection with the problem it solves and the risk it introduces.

## L23–24: harder exploration and reuse

Advanced Exploration reaches sparse rewards and representation-level information gathering. Multi-task RL asks whether tasks can share representations, policies, or data. Change the reward or dynamics of an environment you already solved. Observe whether the policy transfers directly, recovers after fine-tuning, or fails.

## L25: turn an open problem into a test

Produce a one-page research memo: problem, current approach, central assumption, failure case, and smallest experiment. Replace “sample efficiency matters” with a measurable question under a fixed interaction budget.

The [Spring 2026 syllabus](https://rail.eecs.berkeley.edu/deeprlcourse/syllabus/) places current recordings in bCourses. If Fall 2023 or other historical videos on the [official resources page](https://rail.eecs.berkeley.edu/deeprlcourse/resources/) fill a conceptual gap, label their year and keep the 2026 slide agenda canonical. See the [series overview](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview-en) for the complete access boundary.

## References

- [CS185/285 Spring 2026 course site](https://rail.eecs.berkeley.edu/deeprlcourse/)
- [CS185/285 Spring 2026 syllabus](https://rail.eecs.berkeley.edu/deeprlcourse/syllabus/)
- [Official resources and previous offerings](https://rail.eecs.berkeley.edu/deeprlcourse/resources/)
