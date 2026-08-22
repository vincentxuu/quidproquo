---
title: "Berkeley CS285 Homework and Final Projects: The CPU, GPU, and H100 Boundary"
date: 2026-08-22
category: learning
tags: [cs285, berkeley, deep-reinforcement-learning, gpu, self-study]
lang: en
type: guide
difficulty: 深度
tldr: "Five assignments move from CPU-friendly imitation learning to H100-based LLM RL and six-hour offline-RL runs; self-learners should use three compute tiers instead of copying the entire enrolled workflow."
description: "A per-assignment map of Berkeley CS285 Spring 2026 starter code, compute requirements, unavailable assets, and two final-project routes."
series:
  name: "Reading Berkeley CS285 Spring 2026"
  order: 6
---

> 🌏 [中文版](/posts/learning/2026-08-22-berkeley-cs285-homework-project-route)

The public [Spring 2026 starter repository](https://github.com/berkeleydeeprlcourse/homework_spring2026) contains HW1–5 and code for two default final projects under an MIT license. That makes independent implementation possible.

The [series overview](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview-en) owns the complete public-versus-enrolled access boundary. This article owns compute and project tradeoffs.

## Compute ledger

| Work | Implementation focus | Official compute signal | Self-study choice |
| --- | --- | --- | --- |
| [HW1](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw1.pdf) | MSE, DAgger, flow-matching imitation | README found local CPU faster in testing | Complete on CPU |
| [HW2](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw2.pdf) | Policy gradients, reward-to-go, baseline | Seconds to about ten minutes per run | Complete on CPU; add seeds |
| [HW3](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw3.pdf) | DQN and SAC | MsPacman and HalfCheetah may take about three GPU hours | Do small environments; choose one expensive task |
| [HW4](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw4.pdf) | REINFORCE, GRPO, LLM rewards | Modal wrapper defaults to H100; four required runs | Reduce format-copy first; set a cloud budget |
| [HW5](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw5.pdf) | SAC+BC, IQL, FQL, OGBench | One run may take about six hours; tuning accumulates | Start with one task and seed |

These times are estimates for the official environments, not guarantees across hardware. Cloud pricing changes, so check current rates and define a stopping condition before launching paid resources.

## A three-tier route

First, complete HW1 and HW2 and establish logging, evaluation, and multi-seed habits. Second, run HW3 on cheap environments and choose at most one expensive environment. Third, select one reduced experiment from each of HW4 and HW5, with a time or spending cap.

Record environment versions, seeds, commands, wall-clock time, hardware, and failed runs. Saving only the best curve discards the reproducibility lesson that matters most in RL.

## Choosing a final project

The public [final project outline](https://rail.eecs.berkeley.edu/deeprlcourse/static/misc/final_project_outline.pdf) accompanies default Offline-to-Online RL and LLM RL options. The first extends a fixed dataset with limited interaction. The second involves preference data, reward modeling, and policy optimization. Course documents mention enrolled-student Modal resources and an H200 option; neither is a public entitlement.

A self-study project can be one baseline, one modification, three seeds, one principal plot, and a limitations section. Without a GPU, choose a small simulated offline-to-online setting rather than assuming LLM training costs.

## Delivery boundary

The public path can reproduce a self-evaluated version of the assignments. It cannot claim completion of the Berkeley credit-bearing course. The [series overview](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview-en) maintains the full list of video, discussion, grading, and course-support limits.

## References

- [Spring 2026 starter code](https://github.com/berkeleydeeprlcourse/homework_spring2026)
- [CS185/285 Spring 2026 syllabus](https://rail.eecs.berkeley.edu/deeprlcourse/syllabus/)
- [HW1](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw1.pdf)
- [HW2](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw2.pdf)
- [HW3](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw3.pdf)
- [HW4](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw4.pdf)
- [HW5](https://rail.eecs.berkeley.edu/deeprlcourse/static/homeworks/hw5.pdf)
- [Final project outline](https://rail.eecs.berkeley.edu/deeprlcourse/static/misc/final_project_outline.pdf)
