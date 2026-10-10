---
title: "Berkeley CS285 L11–18: From Variational Inference and LLM RL to Offline RL"
date: 2026-08-22
category: learning
tags: [cs285, berkeley, variational-inference, llm-rl, offline-rl]
lang: en
type: guide
difficulty: 深度
tldr: "L11–18 connect control as inference, LLM RL, model-based RL, and offline RL, with HW4 and HW5 providing two compute-intensive implementations."
description: "A guide to CS285 Spring 2026 Lectures 11–18 and Sections 6–9, covering inference, LLM RL, model-based RL, and offline RL."
series:
  name: "Reading Berkeley CS285 Spring 2026"
  order: 4
---

> 🌏 [中文版](/posts/learning/2026-08-22-berkeley-cs285-inference-offline-rl)

**Video status: Videos included.** [Source details](#course-video-sources)

The [official schedule](https://rail.eecs.berkeley.edu/deeprlcourse/) assigns L11–18 to Variational Inference, VI in RL, Control as Inference, LLM RL, two lectures on Model-Based RL, and two on Offline RL. Together they ask what signal an agent can trust when data, models, and objectives are incomplete.

## Course video sources

Checked live on 2026-10-10: the instructor published the Spring 2026 lecture recordings on the RAIL YouTube channel (playlist “CS 185/285: Deep Reinforcement Learning (Spring 2026)”, 27 videos, public since 2026-08-15). Lecture numbers match the official slide list, so these recordings correspond to the lectures this post covers. The course syllabus still says recordings are on bCourses and the course site still links the Fall 2023 playlist; neither is needed to watch these. Two of the lectures are embedded here; the rest are in the playlist.

```youtube
url: https://www.youtube.com/watch?v=62V4ailxwEs
title: CS 185/285 (Spring 2026): Lecture 11, Variational Inference
```

```youtube
url: https://www.youtube.com/watch?v=u2Ug046R0xk
title: CS 185/285 (Spring 2026): Lecture 17, Offline Reinforcement Learning
```

Original videos: [CS 185/285 (Spring 2026): Lecture 11, Variational Inference](https://www.youtube.com/watch?v=62V4ailxwEs)、[CS 185/285 (Spring 2026): Lecture 17, Offline Reinforcement Learning](https://www.youtube.com/watch?v=u2Ug046R0xk)

Course and recording entries:

- [Official course and recording entry](https://rail.eecs.berkeley.edu/deeprlcourse/)
- [CS 185/285: Deep Reinforcement Learning (Spring 2026) — official RAIL YouTube playlist (27 videos)](https://www.youtube.com/playlist?list=PLKq1TCpsv3Y4)

Checked: 2026-10-10.

## L11–14: control as inference

L11–13 establish latent-variable and variational-inference machinery, then express optimality as a probabilistic event. Reward, trajectory distributions, and entropy enter one language. Section 6 supports the derivation; Section 7 connects IRL and LLM RL.

L14 applies policy optimization to token policies and verifiable rewards. [HW4](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw4.pdf) implements REINFORCE and GRPO on format-copy and harder math tasks.

It is not a laptop-first exercise. The [homework compute ledger](/posts/learning/2026-08-22-berkeley-cs285-homework-project-route-en) owns the supporting H100 and required-run details.

## L15–16: learning or using dynamics

Model-based RL learns or uses dynamics, then plans or improves a policy through that model. Data reuse is the advantage; compounding model error is the danger. For Section 8, draw three loops—data collection, model learning, and planning or policy learning—and mark every possible distribution shift.

## L17–18: learning from a fixed dataset

Offline RL cannot collect corrective interactions. Out-of-distribution actions can therefore receive overestimated values. [HW5](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw5.pdf) implements SAC+BC, IQL, and FQL on OGBench tasks. Its long-running experiments and tuning burden are detailed in the [homework compute ledger](/posts/learning/2026-08-22-berkeley-cs285-homework-project-route-en).

## A reduced self-study path

Read the slides and sections first. For HW4, start with the smallest format-copy run. For HW5, choose one task, seed, and baseline, and verify loading, evaluation, and checkpoints before scaling. The goal is understanding failure modes, not reproducing course-only compute support.

See the [series overview's access boundary](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview-en) for current course assets and the proper use of historical video.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Found the public Spring 2026 CS 185/285 YouTube playlist on the RAIL channel; embedded two matching lectures and changed the status from official entry only to Videos included.

## References

- [CS185/285 Spring 2026 course site](https://rail.eecs.berkeley.edu/deeprlcourse/)
- [HW4: LLM RL](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw4.pdf)
- [HW5: Offline RL](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw5.pdf)
- [Spring 2026 starter code](https://github.com/berkeleydeeprlcourse/homework_spring2026)
