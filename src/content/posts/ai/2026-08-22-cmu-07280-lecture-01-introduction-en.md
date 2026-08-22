---
title: "CMU 07-280 Lecture 1: The Shared Problem Behind AI, ML, and Representation Learning"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cmu, ai-course, machine-learning, representation-learning]
lang: en
series:
  name: "Reading CMU 07-280"
  order: 1
tldr: "Lecture 1 uses an alien autoencoder, the scope of AI and ML, and AI history to establish the course's coordinate system: an intelligent system turns inputs into representations and decisions under uncertainty."
description: "A close reading of CMU 07-280 Spring 2026 Lecture 1: course scope, autoencoder representation spaces, the relationship between AI and ML, historical cycles, and the entry point to the first eight lectures."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cmu-07280-lecture-01-introduction)

This is **CMU 07-280 Spring 2026 Lecture 1: Introduction**. It is not merely a warm-up that arranges AI terms on a timeline. The slides keep returning to one question: when an input is too complex for hand-written rules, how can a system build a useful representation and use it to predict or act?

## Official materials and reading scope

I read the complete [Lecture 1 slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec1_Intro.pdf), [Notation Guide](https://www.cs.cmu.edu/~07280/notes/07280_Notation_Guide.pdf), and [Math Background notes](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Math_Background.pdf). There is no anonymously accessible lecture recording or transcript, so this article interprets the documents only. It does not reconstruct spoken explanations, activity results, or Q&A.

The Spring 2026 title is simply **Introduction**. Alignment and safety material later added to the Fall 2026 homepage is outside this article's edition.

## The inherited question: why search and GPT-2 belong in one course

07-280 moves from search and CSPs to regression, neural networks, language models, and reinforcement learning. Lecture 1 does not connect them by saying they are all popular. It draws AI as the larger problem space: search, planning, logic, optimization, probabilistic graphical models, machine learning, and reinforcement learning are ways to perform tasks under uncertainty. Deep learning occupies only part of ML.

That classification changes how the course reads. If AI means deep learning, A* and CSPs look like historical baggage. If intelligence means performing well under constraints and uncertainty, each method becomes an answer for a different information setting.

## Full conceptual path: representation comes before learning

The deck begins with an alien-autoencoder activity about representation. People place alien drawings in a two-dimensional coordinate system, then another person tries to reconstruct a drawing from coordinates alone. If the axes preserve important variation—shape, size, or limbs—the reconstruction can work. Poor coordinates destroy information during compression.

An autoencoder turns the same problem into a learned system. An encoder compresses an image into a low-dimensional vector `z`; a decoder reconstructs the input from `z`. The slide example compresses `28 × 28 = 784` pixels into two latent coordinates and expands them back to 784 dimensions. Those two dimensions are not guaranteed to be the “true meaning” of aliens. They are a representation constrained by a reconstruction objective.

The lecture then introduces four task languages:

- **search** finds a path from an initial state to a goal;
- **optimization** finds a maximum or minimum subject to constraints;
- **machine learning** identifies patterns from examples;
- **reinforcement learning** learns actions from rewards and penalties.

All four first require a choice about what information becomes a state, feature, objective, or reward. Lecture 1 therefore trains skepticism about representation before it teaches any particular model.

## A reproducible example: what a two-dimensional bottleneck preserves

Suppose each alien has three observable factors: eye count `e ∈ {1,2,3}`, height `h ∈ [0,1]`, and antenna indicator `a ∈ {0,1}`. Force them into two coordinates:

```text
z1 = h
z2 = e + 0.25a
```

Height is exactly recoverable from `z1`. `z2` usually separates eye count and stores antenna presence in its fractional part. But if broader values were allowed, different aliens could collide at the same coordinate. The lesson is the cost of a bottleneck: a low-dimensional representation must decide which distinctions survive, and the training objective decides which distinctions matter.

You can reproduce the idea without training a network. Place ten household objects on two axes of your own design, then ask someone else to infer their properties from coordinates alone. Whatever cannot be recovered is information your representation discarded.

## Recitation and homework connection

Lecture 1's HW0 is Gradescope-only, so an external learner cannot inspect its prompt or feedback anonymously. The public preparation path has two parts: use the Notation Guide to standardize vector, set, probability, and derivative notation; use the Math Background notes to audit the linear algebra, calculus, and probability needed later.

[Recitation 1](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec1.pdf) already moves to search formulation. This continues the lecture's point: represent the state before choosing the algorithm. If Tower of Hanoi has no precise state, action, cost, and goal test, a fast search routine still has no defined problem to solve.

## Further comparison: AI winters were not single-model contests

The slides organize AI history into repeated summers and winters: early neuron models and the perceptron, collapsed promises, expert systems, the return of backpropagation, SVMs and a deep-network slowdown, then the combined effect of data, compute, research, and engineering in the 2010s. The point is not memorizing dates. A method succeeds under a joint set of representational, optimization, data, and computing conditions.

When later lectures present closed-form linear regression or CSP algorithms, do not grade them by novelty. Ask what they assume is known, what they output, and how success is computed. That is the shared language of 07-280.

## What to do tonight

1. Read the Notation Guide and write a five-symbol cheat sheet for the notation you do not use fluently.
2. Describe one familiar AI application in four columns: input, representation, output, and performance criterion.
3. Open Recitation 1 and formulate only the Tower of Hanoi state and actions before reading the solution.

## References

- [CMU 07-280 Spring 2026 Lecture 1 — Introduction](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec1_Intro.pdf)
- [07-280 Notation Guide](https://www.cs.cmu.edu/~07280/notes/07280_Notation_Guide.pdf)
- [07-280 Spring 2026 Math Background](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Math_Background.pdf)
- [07-280 Spring 2026 Recitation 1](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec1.pdf)
