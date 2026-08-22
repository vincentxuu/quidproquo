---
title: "CMU 07-280 Stage Review I: From Search Problems to Supervised Learning"
date: 2026-08-22
category: ai
tags: [cmu, ai-course, search, supervised-learning, machine-learning]
lang: en
series:
  name: "Reading CMU 07-280"
  order: 25
type: deep-dive
tldr: "Lectures 1–12 form one decision pipeline: define states, moves, and objectives, then use heuristics, losses, regularization, and backpropagation to control an otherwise intractable search space."
description: "A synthesis of the first twelve CMU 07-280 Spring 2026 lectures, connecting search, CSPs, trees, regression, optimization, and neural networks."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cmu-07280-stage-1-search-supervised-learning)

The first twelve lectures of 07-280 can look like two courses bolted together. Lectures 2–4 cover classical AI search; Lectures 5–12 pivot to supervised learning and neural networks. Their real connection is a shared engineering question: **how do you represent candidate solutions, score them, and find a useful answer in a space too large to enumerate?**

This stage review does not replace the lecture guides. It places the Spring 2026 Search Fundamentals and ML Fundamentals modules on one map so that you can test whether you understand the computational structure rather than merely remember algorithm names. Because no complete public lecture recording set exists, the reconstruction is limited to the syllabus, public notes, recitations, and assignments.

## One pipeline: represent, score, move

A search problem defines states, actions, transitions, a goal test, and path cost. Supervised learning changes the vocabulary: features represent inputs, parameters identify candidate functions, a loss scores them, and an optimizer moves between candidates. A CSP's variables, domains, and constraints provide another representation-and-scoring interface.

```text
search:  state ──action──> next state ──cost/heuristic──> priority
learning: weights ─gradient─> new weights ─────loss──────> priority
```

The spaces have different structure. A* expands nodes in an explicit graph; gradient descent follows local slope in a continuous parameter space; a decision tree greedily explores discrete splits. Calling all three optimization does not make them interchangeable. It does force the right questions: what is a candidate, what constitutes one move, and what ends the process?

## Heuristics and features are purposeful compression

Heuristic search cannot compute every future, so `h(n)` compresses an estimate of remaining distance. A supervised model does not consume the world directly either; features compress an input into computable coordinates. Both succeed only when that compression preserves decision-relevant structure.

Manhattan distance ignores obstacles but supplies cheap direction in a grid. Word counts ignore order but may still separate large classes of spam. A useful representation is not the one that preserves the most information; it balances computational cost against decision power.

Try this tonight: define `h(n)` for one route-planning problem, then imagine a learned heuristic and list three features from historical routes. Ask whether each feature could make the estimate exceed the true remaining cost. If it can, the standard A* optimality guarantee no longer transfers automatically.

## From tree depth to model capacity

Depth limits in adversarial search and capacity controls in supervised learning manage related risks. Deeper search and larger models increase expressive power, computation, and opportunities for error. A shallow minimax result depends heavily on its evaluation function; an unrestricted decision tree can memorize accidental training branches.

Regularization does more than make a model “simpler.” It writes a preference into the objective:

```text
J(w) = data_loss(w) + λ · penalty(w)
```

As `λ` grows, the learner accepts more training error in exchange for constrained parameters. This differs from alpha-beta pruning. Pruning skips branches that cannot change the minimax choice; regularization changes the selected solution. Both shrink effective search, but their guarantees are not the same.

## Backpropagation assigns responsibility through a graph

Linear regression, logistic regression, and neural networks differ by more than functional complexity. A neural network composes differentiable operations, and backpropagation uses the chain rule to send responsibility for the final loss back to every parameter.

For `y = (wx + b)^2`, define `z = wx + b`:

```text
dy/dw = (dy/dz)(dz/dw) = 2z · x
dy/db = (dy/dz)(dz/db) = 2z
```

The intermediate `z` can be reused. Automatic differentiation stores a computation graph and local derivatives instead of requiring a handwritten end-to-end derivative for every model. That leads directly to AlexNet in the next stage: a convolutional network is a deeper, structured graph of the same differentiable parts.

## How the assignments test the connection

The [official assignment table](https://www.cs.cmu.edu/~07280/) places HW1 with heuristic search and HW2 with adversarial search and CSPs, then progresses through regression, regularization, and neural networks. Written, programming, and online components test distinct abilities: deriving an algorithm is not the same as making an implementation work.

Independent learners lack the complete Gradescope feedback loop, but can preserve the same two-sided acceptance test. Produce one handwritten derivation and one executable artifact per topic. For search, record expansion order and the final path. For learning, save a loss curve, a validation metric, and one error analysis. A notebook that executes is not yet an explanation.

## The Stage I exit test

You should be able to translate a natural-language problem into a representation, objective, and update rule; explain what a heuristic, feature, loss, and regularizer preserve or prefer; and calculate one backpropagation example by hand. If one of those remains a memorized definition, return to the corresponding lecture guide and recitation before moving to AlexNet.

The next stage assembles these parts into concrete systems: CNNs add spatial structure to image representations, GPT-2 lets sequence representations interact through attention, and a training framework executes the resulting computation graphs on hardware.

## References

- [CMU 07-280 official course site](https://www.cs.cmu.edu/~07280/)
- [CMU 07-280 syllabus](https://www.cs.cmu.edu/~07280/07280_syllabus_v1.pdf)
- [Spring 2026 Midterm 1 learning objectives](https://www.cs.cmu.edu/~07280/07280_S26_Learning_Objectives_Midterm_1.pdf)
- [Recitation 1: Search](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec1.pdf)
- [Recitation 6: Neural Networks](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec6.pdf)
