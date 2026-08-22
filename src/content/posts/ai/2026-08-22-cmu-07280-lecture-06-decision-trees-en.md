---
title: "CMU 07-280 Lecture 6: How Decision Trees Split Data with Mutual Information"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cmu, ai-course, decision-trees, information-theory, machine-learning]
lang: en
series:
  name: "Reading CMU 07-280"
  order: 6
tldr: "Lecture 6 recursively grows a tree from decision stumps, measures label uncertainty with entropy, and selects splits by `I(Y;W)=H(Y)-H(Y|W)`; this is computationally practical greedy ERM, not a global optimal-tree guarantee."
description: "A complete reading of CMU 07-280 Spring 2026 Decision Trees: recursive construction, stopping rules, continuous features, entropy, conditional entropy, and mutual information."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cmu-07280-lecture-06-decision-trees)

This is **CMU 07-280 Spring 2026 Lecture 6: Decision Trees**. Lecture 5 said to find a low-empirical-risk function in a hypothesis class. This lecture makes `H` concrete and exposes a central tradeoff: do not enumerate every possible tree; greedily choose one informative split at each node.

## Official materials and reading scope

I read the complete [Decision Trees lecture notes](https://www.cs.cmu.edu/~07280/lectures/07_280_lecture_notes%20-%20decision%20trees.pdf), [pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Decision_Trees.pdf), [Recitation 3](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec3.pdf) and [solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec3_sol.pdf), and checked [HW4](https://www.cs.cmu.edu/~07280/assignments/hw4_blank.pdf). No lecture recording is public.

## The inherited question: once the hypothesis class is chosen, how is a model found

An internal decision-tree node asks about an attribute, an edge represents an answer, and a leaf outputs a label. The apartment example asks about rent, deposit, distance, and transit before deciding whether to visit. Its prediction path can be read as a rule. The training data, however, do not tell the learner which question to ask first.

In the binary version, `X={0,1}^d` and `Y={0,1}`. A decision stump makes one split. A full tree splits recursively. When attributes are exhausted or all labels at a node agree, the algorithm creates a leaf using majority vote.

## Full conceptual path: greedy construction and information

At each node, the lecture's algorithm calls `BestAttribute(S,A)`, splits samples by the chosen attribute's value, then recurses. This is greedy: it takes the locally best split for computational efficiency, without guaranteeing the globally smallest or most accurate tree.

“Best” can mean lowest post-split training error or an impurity measure. This lecture develops information theory:

```text
H(Y) = Σ_y P(Y=y) log2(1/P(Y=y))
H(Y|W) = Σ_w P(W=w) H(Y|W=w)
I(Y;W) = H(Y) - H(Y|W)
```

Entropy measures uncertainty in the labels. Conditional entropy is the weighted average child entropy after observing attribute `W`. Mutual information is the reduction in uncertainty, so `BestAttribute` chooses the largest `I(Y;W)`.

Continuous features can use thresholds such as `x2 ≥ 4.5`. An attribute need not always be removed after use; a numerical feature can be split again at another threshold. Stopping rules control tree size—for example, stop when a split barely reduces training error.

## A reproducible example: how much information is in one bit

Suppose eight examples contain four positive and four negative labels:

```text
H(Y) = -0.5 log2 0.5 - 0.5 log2 0.5 = 1 bit
```

Attribute `W1` perfectly places all positives in one child and negatives in the other. Both child entropies are 0, so `H(Y|W1)=0` and `I(Y;W1)=1`.

Both children of `W2` contain two positives and two negatives. Conditional entropy remains 1, so `I(Y;W2)=0`. Drawing two branches did not reduce label uncertainty; the split learned nothing useful for distinguishing the classes.

## Recitation and homework connection

Recitation 3 first defines decision trees, entropy, conditional entropy, and mutual information. It then calculates entropy for a fair coin, deterministic coin, and die. A weather-and-running dataset leads through `H(Y)`, `H(Y|X)`, and a best split, followed by discussion of when information gain can still produce an undesirable tree.

HW4's first question presents a training set and asks about candidate splits. The prompt explicitly says entropy need not be calculated for that part; the target is reading the class composition after each split. The recitation's arithmetic and the homework's structural judgment complement one another.

## Further comparison: interpretable does not mean stable or globally optimal

A single path through a tree is readable, but training is greedy. A small data change can replace the root split and rebuild every descendant subtree. Mutual information evaluates current uncertainty reduction, not the globally optimal future tree.

“Human interpretable” should therefore mean that a prediction path can be inspected—not that training has no tradeoffs, the model must be small, or the result is stable.

## What to do tonight

1. Calculate the entropy of a fair coin, an always-tails coin, and a fair six-sided die.
2. Compute conditional entropy and mutual information for two attributes in an eight-example binary dataset.
3. Use the best attribute as the root and recurse until labels agree or attributes are exhausted.

## References

- [CMU 07-280 Spring 2026 Decision Trees lecture notes](https://www.cs.cmu.edu/~07280/lectures/07_280_lecture_notes%20-%20decision%20trees.pdf)
- [07-280 Decision Trees pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Decision_Trees.pdf)
- [07-280 Spring 2026 Recitation 3](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec3.pdf)
- [Recitation 3 solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec3_sol.pdf)
- [07-280 Spring 2026 Homework 4](https://www.cs.cmu.edu/~07280/assignments/hw4_blank.pdf)
