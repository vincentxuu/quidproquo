---
title: "Berkeley CS285 L5–10: Policy Gradients, Actor-Critic, DQN, and SAC"
date: 2026-08-22
category: learning
tags: [cs285, berkeley, policy-gradient, q-learning, actor-critic]
lang: en
type: guide
difficulty: 深度
tldr: "L5–10 build the deep-RL core through policy- and value-based routes; HW2 is CPU-friendly, while HW3's Atari and HalfCheetah runs can require hours of GPU time."
description: "A guide to CS285 Spring 2026 Lectures 5–10, Sections 3–5, and the policy-gradient, DQN, and SAC assignments."
series:
  name: "Reading Berkeley CS285 Spring 2026"
  order: 3
---

> 🌏 [中文版](/posts/learning/2026-08-22-berkeley-cs285-policy-value-methods)

**Video status: Videos included.** [Source details](#course-video-sources)

Lectures 5–10 form the algorithmic core. The [official agenda](https://rail.eecs.berkeley.edu/deeprlcourse/) covers Policy Gradients, Actor Critic, Value-Based RL, Q-learning in Practice, and two Advanced Policy Gradients lectures. Read them by asking what is estimated, where data comes from, and how bias trades against variance.

## Course video sources

Checked live on 2026-10-10: the instructor published the Spring 2026 lecture recordings on the RAIL YouTube channel (playlist “CS 185/285: Deep Reinforcement Learning (Spring 2026)”, 27 videos, public since 2026-08-15). Lecture numbers match the official slide list, so these recordings correspond to the lectures this post covers. The course syllabus still says recordings are on bCourses and the course site still links the Fall 2023 playlist; neither is needed to watch these. Two of the lectures are embedded here; the rest are in the playlist.

```youtube
url: https://www.youtube.com/watch?v=S0D9REIVdg4
title: CS 185/285 (Spring 2026): Lecture 5, Policy Gradients
```

```youtube
url: https://www.youtube.com/watch?v=PCOyNjwyFvk
title: CS 185/285 (Spring 2026): Lecture 7, Value-Based RL
```

Original videos: [CS 185/285 (Spring 2026): Lecture 5, Policy Gradients](https://www.youtube.com/watch?v=S0D9REIVdg4)、[CS 185/285 (Spring 2026): Lecture 7, Value-Based RL](https://www.youtube.com/watch?v=PCOyNjwyFvk)

Course and recording entries:

- [Official course and recording entry](https://rail.eecs.berkeley.edu/deeprlcourse/)
- [CS 185/285: Deep Reinforcement Learning (Spring 2026) — official RAIL YouTube playlist (27 videos)](https://www.youtube.com/playlist?list=PLKq1TCpsv3Y4)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): the Lecture 5 transcript derives the policy gradient from the trajectory objective and covers reward-to-go and baselines (variance reduction that stays unbiased), and mentions policy gradients training language models; the Lecture 7 transcript explains that removing the actor and keeping only the critic gives Q-learning, then moves from policy iteration, value iteration and fitted value iteration to fitted Q iteration, with replay buffers, epsilon-greedy and Boltzmann exploration, and previews stabilizing tricks for the next lecture. This matches the note; the word "advantage" does not appear in the transcript, DQN tricks such as target networks belong to the next lecture, and the HW2/HW3 details are the site's own synthesis.

## Policy-based methods

L5 derives policy gradients from a trajectory objective. Reward-to-go, baselines, and advantages reduce variance without changing the desired objective. L6 introduces actor-critic: a critic supplies the actor's update signal, potentially adding function-approximation bias. Sections 3 and 5 connect and extend these ideas.

[HW2](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw2.pdf) experiments with reward-to-go and neural-network baselines. It is a CPU-first assignment; the [homework compute ledger](/posts/learning/2026-08-22-berkeley-cs285-homework-project-route-en) owns the timing and hardware details. For self-study, hold the environment fixed, run three seeds, and retain both individual curves and their mean.

## Value-based methods

L7–8 move from Bellman backups to DQN and its stability machinery. L9–10 return to advanced policy-gradient methods. Section 4 places DQN beside SAC; compare their update targets, replay buffers, target networks, and entropy terms.

[HW3](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw3.pdf) implements DQN and SAC. Its [starter code](https://github.com/berkeleydeeprlcourse/homework_spring2026/tree/main/hw3) spans cheap and expensive environments; see the [homework compute ledger](/posts/learning/2026-08-22-berkeley-cs285-homework-project-route-en) for GPU estimates. Validate losses, replay, and evaluation in a small environment first.

## Completion check

Explain why policy gradients have high variance, how a critic trades variance for bias, why DQN uses replay and target networks, and what entropy contributes to SAC. If any answer is vague, return to the derivation and smallest experiment before spending more compute.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Found the public Spring 2026 CS 185/285 YouTube playlist on the RAIL channel; embedded two matching lectures and changed the status from official entry only to Videos included.
- 2026-10-10: Checked the video content against its transcript. Confirmed the two videos are Lectures 5 and 7 and match the note; noted that DQN stabilizing tricks are in the next lecture.

## References

- [CS185/285 Spring 2026 course site](https://rail.eecs.berkeley.edu/deeprlcourse/)
- [HW2: Policy Gradients](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw2.pdf)
- [HW3: Q-Learning and Actor-Critic](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw3.pdf)
- [Spring 2026 starter code](https://github.com/berkeleydeeprlcourse/homework_spring2026)
