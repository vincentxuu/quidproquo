---
title: "CS188 Bayes Nets and Ghostbusters: Inference When Ghosts Are Invisible"
date: 2026-08-22
category: learning
tags: [berkeley, cs188, bayesian-network, probabilistic-inference, particle-filter]
lang: en
type: guide
difficulty: 進階
series:
  name: "Berkeley CS188 Spring 2026"
  order: 5
tldr: "Lectures 13–18 and Project 4 move from factor operations and variable elimination to exact inference and particle filtering, letting Pacman track invisible ghosts through noisy distance sensors."
description: "A guide to Bayes nets, HMMs, exact inference, particle filtering, and the Ghostbusters project in Berkeley CS188 Spring 2026."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-berkeley-cs188-bayes-ghostbusters)

[Lectures 13–18](https://inst.eecs.berkeley.edu/~cs188/sp26/) progress from probability and Bayes nets through exact inference and sampling to HMMs and particle filtering. [Project 4: Ghostbusters](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj4/) makes the sequence concrete: Pacman cannot see ghosts and receives only noisy Manhattan-distance readings, so it must maintain location beliefs and pursue targets.

## Factor operations are not mechanical tables

Joining factors combines compatible information; elimination sums over a variable no longer needed. Variable-elimination cost depends strongly on order. Before each implementation step, state what distribution the factor represents and check conditioned versus unconditioned variables instead of manipulating dictionary keys blindly.

## Observation and time are different updates

On a sensor reading, reweight beliefs by likelihood and normalize. When time advances without direct observation, propagate the distribution through the ghost movement model. Alternating these operations is filtering. The [official P4 specification](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj4/) states that if every particle receives zero weight, the particle filter must reinitialize rather than sample from an empty distribution.

The official visualization displays posterior probability through brightness. After each update, predict which cells should brighten and where the transition model should move mass, then run the autograder. Predicting the direction of the picture demonstrates more than a passing test.

## Study order

Hand-calculate a join and elimination on a two-variable factor, then implement exact inference. Verify normalization before moving to particle filtering. Finally let the greedy BustersAgent act on each ghost's most likely position and examine what is lost when a complete uncertainty distribution is reduced to a mode.

Series navigation: [Previous: MDPs and reinforcement learning](/posts/learning/2026-08-22-berkeley-cs188-mdp-reinforcement-learning-en) | [Next: Decisions and machine learning](/posts/learning/2026-08-22-berkeley-cs188-machine-learning-en)

## References

- [CS188 textbook — Bayes Nets](https://inst.eecs.berkeley.edu/~cs188/textbook/bayes-nets/representation.html)
- [CS188 textbook — HMMs](https://inst.eecs.berkeley.edu/~cs188/textbook/hmms/markov.html)
- [CS188 Spring 2026 Project 4](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj4/)
