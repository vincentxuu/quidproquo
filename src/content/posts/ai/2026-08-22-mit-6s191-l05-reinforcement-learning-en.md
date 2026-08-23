---
title: "MIT 6.S191 Lecture 5: Reinforcement Learning: Learning from Return Instead of Labels"
date: 2026-08-22
category: ai
type: guide
tags: [mit, ai-course, deep-learning, 6s191]
lang: en
series:
  name: "Reading MIT 6.S191"
  order: 6
tldr: "Lecture 5 of the 2026 course connects agent, environment, state, action, reward, and policy into an interaction loop, introducing credit assignment and exploration."
description: "A bilingual study note for MIT 6.S191 2026 Lecture 5: core ideas, viewing prompts, a concrete exercise, and official materials."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-mit-6s191-l05-reinforcement-learning)

Lecture 5 of [MIT 6.S191 2026](https://introtodeeplearning.com/) is **Reinforcement Learning: Learning from Return Instead of Labels**. It Connects agent, environment, state, action, reward, and policy into an interaction loop, introducing credit assignment and exploration. This note uses only the official 2026 slides and video; it does not mix in similarly named material from 2025.

## What to take away

- Separate immediate reward from long-term return
- Explain why policy gradients increase the probability of high-return actions
- Recognize sparse rewards, exploration, and unstable training as distinct risks

These goals have one thing in common: recognizing terminology is insufficient. You should be able to identify inputs, outputs, the learning signal, and the main constraint before moving on.


The interaction chain is: a policy chooses an action from a state; the environment returns the next state and reward; rewards across steps become a return. Policy gradients estimate an update from sampled trajectories, so reward design, exploration coverage, and estimator variance all change the learned behavior.

## How to watch

First scan the sections and diagrams in the [official slides](https://introtodeeplearning.com/slides/6S191_MIT_DeepLearning_L5.pdf), then watch the [official video](https://www.youtube.com/watch?v=1ij3dweHu-0). On a second pass, pause at equations and architecture diagrams and redraw them in your own notation. Afterward, close the material and write three central ideas plus one unresolved question.

## An exercise for tonight

Define state, action, reward, and termination for a simple game. If the reward cannot fit in one clear line, do not train yet.

“Finished” means leaving a checkable diagram, calculation, program output, or short note—not merely reaching the end of the video. You should also be able to explain one failure mode to someone else.

## Scope and limits

6.S191 is a high-intensity introduction, and this article is only a lecture guide. It does not replace the full recording, rigorous derivations, or instructor feedback. Use a semester course or primary papers when a topic needs theoretical depth.

## References

- [MIT 6.S191 2026 course site](https://introtodeeplearning.com/)
- [Lecture 5 official slides](https://introtodeeplearning.com/slides/6S191_MIT_DeepLearning_L5.pdf)
- [Lecture 5 official video](https://www.youtube.com/watch?v=1ij3dweHu-0)
- On this site: [Complete MIT 6.S191 guide](/posts/ai/2026-08-21-mit-6s191-introduction-to-deep-learning-en)
