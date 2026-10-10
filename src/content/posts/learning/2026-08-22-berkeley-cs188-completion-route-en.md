---
title: "Completing CS188: Turn 28 Lectures and Projects P0–P5 into a Portfolio"
date: 2026-08-22
category: learning
tags: [berkeley, cs188, artificial-intelligence, portfolio, learning-path]
lang: en
type: guide
difficulty: 進階
series:
  name: "Berkeley CS188 Spring 2026"
  order: 7
tldr: "Lectures 26–28 close with nuclear monitoring, AI safety, and reflection. Independent completion should preserve assumptions, test evidence, and failure analysis for Projects 1–5 instead of reporting only autograder scores."
description: "A completion and portfolio route for Berkeley CS188 Spring 2026, integrating Projects P0–P5, application lectures, AI safety, and self-study assessment."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-berkeley-cs188-completion-route)

**Video status: Videos included.** [Source details](#course-video-sources)

The final three meetings on the [CS188 Spring 2026 calendar](https://inst.eecs.berkeley.edu/~cs188/sp26/) cover AI for Global Nuclear Monitoring, AI Safety, and Further Thoughts. They are not detached news topics. They ask what remains missing when search, decisions, uncertainty, and learning enter real institutions.

## Course video sources

The official Spring 2026 schedule and the official YouTube playlist ([CS188 SP26] Live Lectures, 28 videos) were checked live on 2026-10-10; the lecture recording embedded here is listed there as a “Recording”. No unverified timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=H5AQ5s-n0ck
title: CS188 Spring 2026 Lecture 26: AI for Global Nuclear Monitoring
```

Original videos: [CS188 Spring 2026 Lecture 26: AI for Global Nuclear Monitoring](https://www.youtube.com/watch?v=H5AQ5s-n0ck)

Course and recording entries:

- [Official course and recording entry](https://inst.eecs.berkeley.edu/~cs188/sp26/)
- [CS188 Spring 2026 Recordings](https://www.youtube.com/playlist?list=PLp8QV47qJEg5tSxKiwcZt4LVwN_ek2Kxy)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): sampled check (only the first ~5,000 characters of the transcript were read): the embedded video is Lecture 26, on AI for global nuclear monitoring; the transcript presents it as an application built on Bayesian networks and probabilistic programs and introduces the nuclear test-ban treaty and how compliance is verified, matching this article's description of Lecture 26. The remaining sections of this article cover other lectures in the unit and the project, not this video.

## A standard for independent completion

Without a Berkeley transcript, replace a vague claim of completion with an auditable portfolio. For each project from P1 through P5, preserve four things: the problem model, core algorithm, test evidence, and one failure case. P0 only verifies the environment and need not become a portfolio piece.

Under the [official course policies](https://inst.eecs.berkeley.edu/~cs188/sp26/policies/), do not publish solutions or submission-ready answers. A better artifact is a design note with state, belief, or update diagrams; tests you added outside the graded cases; and a link back to the [official project specifications](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/). It demonstrates understanding without undermining the assignment.

## What each project should demonstrate

- **P1 Search:** justify the state representation and heuristic.
- **P2 Multi-Agent:** explain the ghost assumptions behind minimax and expectimax.
- **P3 RL:** distinguish planning with a known model from learning through experience.
- **P4 Ghostbusters:** diagram observation updates versus time updates.
- **P5 ML:** interpret a loss curve and failure example, not just accuracy.

## One final rerun

From a clean environment, rerun each local autograder. For every project, choose a formerly failing case and record its cause and correction. Then choose one of the final applications and identify its objective, observations, actions, risks, and stakeholders that cannot be represented by one score. This reconnects the course's agent models to the world.

Afterward, choose a next course by direction: CS189 for mathematical ML, CS285 for deep RL, or an introductory NLP course before CS288. CS188 does not cover all of AI; it supplies a reusable language for representing AI problems.

Series navigation: [Previous: Decisions and machine learning](/posts/learning/2026-08-22-berkeley-cs188-machine-learning-en) | [Back to the course overview](/posts/learning/2026-08-22-berkeley-cs188-sp26-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The official Spring 2026 schedule and YouTube playlist were checked live and list the embedded lecture recording, so the status is now Videos included.
- 2026-10-10: Checked the video content against its transcript. Confirmed the embedded video is Lecture 26 (AI for global nuclear monitoring) and fits the article scope; no video claims needed correcting.

## References

- [CS188 Spring 2026 course calendar](https://inst.eecs.berkeley.edu/~cs188/sp26/)
- [CS188 Spring 2026 projects](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/)
- [CS188 Spring 2026 policies](https://inst.eecs.berkeley.edu/~cs188/sp26/policies/)
- [Berkeley AI/ML course guide](/posts/learning/2026-08-21-berkeley-ai-ml-course-map-en)
