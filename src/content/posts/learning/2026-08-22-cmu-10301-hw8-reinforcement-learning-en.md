---
title: "CMU 10-301 HW8: From MDPs to Reinforcement-Learning Updates"
date: 2026-08-22
category: learning
tags: [cmu, machine-learning, reinforcement-learning, mdp]
lang: en
type: guide
difficulty: 深度
tldr: "HW8 connects states, actions, rewards, transitions, and value updates while separating environment dynamics, policy, and estimation error."
description: "The conceptual map and local validation strategy for CMU 10-301/601 Spring 2026 HW8 Reinforcement Learning."
series: { name: "Reading CMU 10-301 Machine Learning", order: 8 }
---
> 🌏 [中文版](/posts/learning/2026-08-22-cmu-10301-hw8-reinforcement-learning)

The [official handout](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw8.zip) is titled **Homework 8: Reinforcement Learning** and contains written plus programming work. Written sections cover synchronous/asynchronous value iteration, algorithm comparison and selection, a REINFORCE walkthrough, actor-critic/A2C, and empirical questions. Programming implements policy/value networks, n-step returns, policy/value losses, and A2C training for Atari Pong. The ZIP supplies `agent.py`, `environment.py`, `utils.py`, `test_runner.py`, and `requirements.txt`; this public bundle contains no reference output, while hidden tests remain on Gradescope.

## Separate the MDP components

Write down states, actions, rewards, transitions, discount, and terminal conditions before deriving a Bellman target. Common failures bootstrap through terminals, confuse immediate reward with return, or alter the policy with evaluation data.

## First executable action and completion

From the [bundle](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw8.zip), create the documented environment:

```bash
conda create -n HW8 python=3.12
conda activate HW8
pip install -r requirements.txt
```

Run `test_runner.py` before Pong training. Completion means passing public checks for network shapes, n-step returns, and losses; starting sustained fixed-seed training; and retaining configurations and reward curves. With no reference output or hidden tests, one high-scoring run is not official validation.

## References
- [HW8 official bundle](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw8.zip)
- [Spring 2026 schedule](https://www.cs.cmu.edu/~mgormley/courses/10601/schedule.html)
