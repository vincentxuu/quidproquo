---
title: "Berkeley CS285 L1–4: Imitation Learning, Distribution Shift, and RL Basics"
date: 2026-08-22
category: learning
tags: [cs285, berkeley, imitation-learning, reinforcement-learning, self-study]
lang: en
type: guide
difficulty: 進階
tldr: "The first four lectures move from behavioral cloning to MDPs; HW1 turns distribution shift into an observable failure through MSE policies, DAgger, and flow matching."
description: "A guide to CS285 Spring 2026 Lectures 1–4, Sections 1–2, and HW1, building the first bridge from imitation learning to reinforcement learning."
series:
  name: "Reading Berkeley CS285 Spring 2026"
  order: 2
---

> 🌏 [中文版](/posts/learning/2026-08-22-berkeley-cs285-imitation-rl-basics)

**Video status: Videos included.** [Source details](#course-video-sources)

The [official schedule](https://rail.eecs.berkeley.edu/deeprlcourse/) starts with Introduction, Behavioral Cloning, Behavioral Cloning Part 2, and RL Basics. The point is not to memorize an RL algorithm first. It is to see where a supervised controller fails, then introduce learning from reward.

## Course video sources

Checked live on 2026-10-10: the instructor published the Spring 2026 lecture recordings on the RAIL YouTube channel (playlist “CS 185/285: Deep Reinforcement Learning (Spring 2026)”, 27 videos, public since 2026-08-15). Lecture numbers match the official slide list, so these recordings correspond to the lectures this post covers. The course syllabus still says recordings are on bCourses and the course site still links the Fall 2023 playlist; neither is needed to watch these. Two of the lectures are embedded here; the rest are in the playlist.

```youtube
url: https://www.youtube.com/watch?v=yatA09E0J00
title: CS 185/285 (Spring 2026): Lecture 2, Supervised Learning of Behaviors
```

```youtube
url: https://www.youtube.com/watch?v=FcpIul7rAEE
title: CS 185/285 (Spring 2026): Lecture 4, Reinforcement Learning Basics
```

Original videos: [CS 185/285 (Spring 2026): Lecture 2, Supervised Learning of Behaviors](https://www.youtube.com/watch?v=yatA09E0J00)、[CS 185/285 (Spring 2026): Lecture 4, Reinforcement Learning Basics](https://www.youtube.com/watch?v=FcpIul7rAEE)

Course and recording entries:

- [Official course and recording entry](https://rail.eecs.berkeley.edu/deeprlcourse/)
- [CS 185/285: Deep Reinforcement Learning (Spring 2026) — official RAIL YouTube playlist (27 videos)](https://www.youtube.com/playlist?list=PLKq1TCpsv3Y4)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): the Lecture 2 transcript covers behavioral cloning, distributional shift (with the math) and DAgger (with the drone-in-a-forest example), and previews flow matching/diffusion for complex distributions; the Lecture 4 transcript first finishes the previous lecture's flow-matching policy and HW1, then defines MDPs (state, action, reward, transition) and POMDPs and contrasts imitation learning with RL. The L3, Sections and HW1 details in this note are the site's own synthesis from official materials and are not covered by the two embedded lectures; the phrase "credit assignment" does not appear in the transcript, and exploration is only touched briefly.

## L1–2: control as supervised learning

Behavioral cloning trains a policy on expert state-action pairs. Its training loss is simple; deployment is not. Once the learned policy makes a small error, it may visit states absent from expert data. Draw the training distribution beside the distribution induced by the learned policy before naming the problem “covariate shift.”

## L3 and Sections 1–2: make failure visible

Section 1 supplies a PyTorch tutorial, Section 2.1 reviews probability, and Section 2.2 focuses on BC distribution shift. [HW1](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw1.pdf) compares an MSE policy, DAgger, and a flow-matching policy. DAgger asks the expert to label states actually visited by the learner, iteratively repairing the dataset.

## L4: when RL becomes necessary

RL Basics reframes the task as an MDP. A policy produces a trajectory, rewards accumulate, and transition dynamics make today's action alter tomorrow's state. Expert actions permit direct imitation; outcome-only feedback introduces credit assignment and exploration.

## HW1 and compute

The [Spring 2026 starter code](https://github.com/berkeleydeeprlcourse/homework_spring2026/tree/main/hw1) uses `uv` and Weights & Biases. This assignment is a sensible place to start on a local CPU; see the [homework compute ledger](/posts/learning/2026-08-22-berkeley-cs285-homework-project-route-en) for the supporting details. Retain three artifacts: a reward curve, generated behavior video, and a qualitative comparison of MSE, DAgger, and flow matching.

Public code is enough to implement the work, but it is not the complete enrolled experience. The [series overview](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview-en) owns the full access boundary.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Found the public Spring 2026 CS 185/285 YouTube playlist on the RAIL channel; embedded two matching lectures and changed the status from official entry only to Videos included.
- 2026-10-10: Checked the video content against its transcript. Confirmed the two videos are Lectures 2 and 4 and match the note; noted the term "credit assignment" does not appear in the video.

## References

- [CS185/285 Spring 2026 course site](https://rail.eecs.berkeley.edu/deeprlcourse/)
- [HW1: Imitation Learning](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw1.pdf)
- [HW1 starter code](https://github.com/berkeleydeeprlcourse/homework_spring2026/tree/main/hw1)
