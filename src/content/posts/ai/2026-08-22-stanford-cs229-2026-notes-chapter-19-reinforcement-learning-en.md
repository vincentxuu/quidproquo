---
title: "Reinforcement Learning: MDPs, Value Iteration, and Continuous States"
date: 2026-08-22
type: deep-dive
category: ai
tags: [cs229, reinforcement-learning, mdp, value-iteration, fitted-value-iteration]
lang: en
tldr: "Chapter 19 uses Bellman equations to turn long-horizon decisions into one-step updates, moving from value iteration in known MDPs to model learning and continuous-state approximation."
description: "A reading of Chapter 19 in the 2026 CS229 notes, from MDPs and Bellman equations to value iteration, model learning, and continuous-state approximation."
draft: false
series:
  name: "Reading Stanford CS229"
  order: 20
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-19-reinforcement-learning)

**Video status: Related supplementary video included; the original lecture recording has not been verified.** [Source details](#course-video-sources)

This article reads Chapter 19, printed pages 227–243, of the [2026 CS229 main notes](https://cs229.stanford.edu/main_notes.pdf). It is a chapter guide to the 2026 notes, not a reconstruction of any quarter's recordings. It organizes the mathematical spine and approximation methods without copying every proof.

## Course video sources

This article follows the 2026 main notes chapter by chapter, and chapter numbers are not lecture numbers. The video(s) below come from public recordings from CS229 Spring 2026 and from the older Autumn 2018 course (Andrew Ng); their titles match this chapter's topic, but they are related supplements, not a line-by-line source for this chapter, and the original lecture recording for the chapter has not been verified. The official CS229 page currently shows Summer 2026 and sends recordings and materials to a Stanford sign-in Canvas site, so only the public YouTube playlists are used here.

```youtube
url: https://www.youtube.com/watch?v=hHC-SF3utxg
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 16: Basic Concept in RL, Policy Gradient
```

```youtube
url: https://www.youtube.com/watch?v=d5gaWTo6kDM
title: Lecture 17 - MDPs & Value/Policy Iteration | Stanford CS229: Machine Learning Andrew Ng (Autumn2018)
```

Original videos: [Stanford CS229 Machine Learning | Spring 2026 | Lecture 16: Basic Concept in RL, Policy Gradient](https://www.youtube.com/watch?v=hHC-SF3utxg); [Lecture 17 - MDPs & Value/Policy Iteration | Stanford CS229: Machine Learning Andrew Ng (Autumn2018)](https://www.youtube.com/watch?v=d5gaWTo6kDM)

Course and recording entries:

- [Stanford CS229 Machine Learning, Spring 2026 playlist (Stanford Online, 17 videos)](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [Stanford CS229: Machine Learning led by Andrew Ng, Autumn 2018 playlist (21 videos)](https://www.youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU)
- [Official course / lecture source](https://cs229.stanford.edu/)

Checked: 2026-10-10.

## MDPs model delayed consequences

A Markov decision process consists of states \(S\), actions \(A\), transition probabilities \(P_{sa}\), discount \(\gamma\), and reward \(R\). The Markov assumption says that, conditioned on the current state and action, the next state does not need earlier history.

For policy \(\pi\), the value function is

\[
V^\pi(s)=\mathbb{E}\left[\sum_{t=0}^{\infty}\gamma^t R(s_t,a_t)\mid s_0=s,\pi\right].
\]

Discount \(0\le\gamma<1\) controls the weight of distant rewards and helps make the infinite sum and Bellman operator well behaved.

## Bellman equations and two iterations

The optimal value obeys

\[
V^*(s)=\max_a\left[R(s,a)+\gamma\sum_{s'}P_{sa}(s')V^*(s')\right].
\]

Value iteration repeatedly applies this backup until values stabilize, then selects the maximizing action. Policy iteration alternates policy evaluation and policy improvement: evaluate the current policy, then choose a better action at each state.

Both assume a known model and enumerable states. With unknown transitions, counts can estimate \(P_{sa}(s')\), and sample averages can estimate reward before planning in the learned MDP. But data from only the current policy omits untried actions, making exploration part of identification rather than an optional add-on.

## Why continuous states need approximation

Discretizing each of \(d\) dimensions into \(k\) bins creates \(k^d\) states: the curse of dimensionality. A coarse grid also treats all states inside one cell alike, yielding piecewise-constant behavior.

One alternative learns dynamics such as

\[
s_{t+1}=As_t+Ba_t+\epsilon_t,
\]

then plans with that model. Another is fitted value iteration with \(V_\theta(s)=\theta^\top\phi(s)\): sample states and successors, compute Bellman targets, and regress the targets onto features. This converts dynamic programming into repeated supervised learning. Function approximation, sampling distribution, and bootstrapped targets now interact, however, so the general convergence guarantee of finite tabular value iteration no longer carries over.

## Assumptions and failure modes

- If state omits information needed to predict the future, the Markov assumption fails.
- Small learned-model errors can compound over a long planning horizon.
- Pure exploitation may confuse “unobserved” with “bad.”
- Discretization faces \(k^d\) growth; function approximation adds representation bias and instability.
- The reward is the optimized proxy, not a guarantee of the real objective.

## Connection to adjacent chapters

Chapter 18 treated LLM token generation as a finite-horizon MDP and optimized the policy directly. Chapter 19 fills in the value-based language. Chapter 20 adds linear dynamics, quadratic rewards, and Gaussian noise in continuous spaces to obtain exactly solvable LQR and LQG structures.

## Exercise

Write \(S,A,P,R,\gamma\) for a simplified balancing cart with position and velocity. Compare the state count when each dimension uses 20 bins with a linear value approximation using ten basis functions. Identify the information each representation is most likely to lose.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Found a public CS229 playlist with matching topics (Spring 2026 and/or the older Autumn 2018) and embedded 2 related supplementary video(s).

## References

- [CS229 Lecture Notes Chapter 19: Reinforcement Learning, MDPs, and Value Iteration (2026-08-18)](https://cs229.stanford.edu/main_notes.pdf#page=228)
- [Official Stanford CS229 course page](https://cs229.stanford.edu/)
