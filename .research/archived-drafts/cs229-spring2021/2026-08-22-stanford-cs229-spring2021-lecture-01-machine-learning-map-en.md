---
title: "Stanford CS229 Lecture 1: Mapping the Kinds of Problems Machine Learning Can Solve"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, stanford, supervised-learning, unsupervised-learning]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 2
tldr: "CS229 Spring 2021 begins by defining a learning problem through data, tasks, and performance measures, then maps the course across supervised, unsupervised, and reinforcement learning."
description: "A reading of Stanford CS229 Spring 2021 Lecture 1: definitions of machine learning, three learning settings, features and labels, and the map they provide for the remaining lectures."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-spring2021-lecture-01-machine-learning-map)

This is post 2 in [Reading Stanford CS229](/en/series/stanford-cs229), covering **Stanford CS229, Spring 2021, Lecture 1**. The course opened on March 29, 2021, with the official title **Introduction**. This article uses the Spring 2021 Lecture 1 slides. The course page places recordings in Canvas, so I did not use the recording as a source.

The lecture's spine is not an algorithm. It is a way to turn a vague desire for AI into a learning problem. After course prerequisites and logistics, the slides organize the field into supervised, unsupervised, and reinforcement learning. Every later equation should still answer the questions introduced here: what data does the learner receive, what task must it perform, and how will improvement be measured?

## Learning requires three explicit pieces

The slides present two classic definitions. Arthur Samuel emphasizes improvement without explicitly programming every rule. Tom Mitchell separates learning into experience `E`, tasks `T`, and a performance measure `P`. Mitchell's formulation doubles as a requirements check. “Make the model smarter” names neither a task nor a measurable improvement.

For a game-playing program, self-play can provide the experience, winning can be the task, and win rate can be the performance measure. This framing does not guarantee success. It does rule out a claim that cannot be tested. Before implementation, write three lines: what the system observes, what it must produce, and which metric must improve.

## Supervised learning: examples arrive with answers

The housing example represents the dataset as paired observations:

```text
(x^(1), y^(1)), ..., (x^(n), y^(n))
```

`x` is the input or feature vector; `y` is the label or output. With only floor area, a learner can fit a map from area to price. Adding lot size, number of floors, condition, and ZIP code turns `x` into a high-dimensional vector. “Supervision” means that training examples contain `y`; it does not mean a person guides every optimization step.

The task is regression when `y` is continuous and classification when it is discrete. Image classification, object detection, and machine translation can all be described as input-output mappings. The slides also set a boundary: CS229 covers foundational supervised techniques, not enough by themselves to solve difficult vision or natural-language problems. The course supplies common machinery, not an entire application stack.

## Unsupervised learning: no labels and a looser objective

An unsupervised dataset contains only `x^(1), ..., x^(n)`. The slides deliberately describe the goal broadly: find interesting structure in the data. Clustering groups similar observations. Principal component analysis identifies dominant directions of variation. Word embeddings place words in a vector space where some relations appear as directions.

No labels does not mean no judgment. A practitioner still chooses a similarity measure, the number of clusters, representation size, and a downstream use. A clustering result should therefore not be mistaken for proof that the world naturally contains exactly those groups. The structure comes from both the data and the modeling assumptions.

## Reinforcement learning: the strategy changes its future data

Reinforcement learning introduces interaction. An algorithm tries a strategy, collects feedback, and improves the strategy; the next strategy changes what data will be observed. Unlike the usual fixed-dataset picture of supervised learning, it must handle exploration, delayed feedback, and data distributions altered by action.

Lecture 1 draws only this loop. It does not yet derive Markov decision processes or value functions; Lectures 17 and 18 take up those tools. The supportable conclusion here is that the three settings differ in how data is generated. Reinforcement learning is not merely classification with a label that arrives later.

## A useful taxonomy, not a law of nature

The slides label the taxonomy a simplified task-based view and note that the categories can also describe tools or methods. One system might learn a representation from unlabeled data, fine-tune it on labels, and then adapt through interactive feedback. The taxonomy helps formulate questions; it does not require an entire project to occupy one box.

Data also does not choose the performance measure. Low average housing-price error does not establish equal reliability across regions. High image accuracy does not rule out failures on a minority class. The lecture lists robustness and fairness among later topics, signaling that average predictive performance is a starting point rather than a complete quality judgment.

## Where Lecture 1 sits in the eighteen-lecture path

Lecture 1 is the index. Lectures 2–10 build supervised learning, classification, core methods, and generalization tools. Lectures 11–15 turn toward clustering, latent structure, and self-supervision. Lectures 17–18 cover reinforcement learning. While reading each later derivation, keep returning to three checks: what fields exist in the training data, what is the target, and on which task will the output be measured?

## Beyond the lecture

Take a model you are building and omit the algorithm name. Write down only its `E/T/P`, then mark it as supervised, unsupervised, reinforcement learning, or a hybrid pipeline. If the three lines cannot be completed, the proposal is probably still a product wish rather than a testable learning problem.

## References

- [Stanford CS229 Spring 2021 syllabus](https://cs229.stanford.edu/syllabus-spring2021.html)
- [Spring 2021 Lecture 1 slides](https://cs229.stanford.edu/notes2021spring/notes2021spring/lecture1.pdf)
