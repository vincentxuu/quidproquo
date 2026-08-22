---
title: "CMU 07-280 Lecture 5: Defining Machine Learning with Loss, Risk, and ERM"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cmu, ai-course, machine-learning, empirical-risk-minimization]
lang: en
series:
  name: "Reading CMU 07-280"
  order: 5
tldr: "Lecture 5 formulates machine learning through `X → Y`, loss, risk, and empirical risk minimization: a training set only gives average observed loss, while the real objective remains generalization over an unknown distribution."
description: "A complete reading of CMU 07-280 Spring 2026 ML Problem Formulation: classification, regression, loss, risk, i.i.d. sampling, ERM, unsupervised learning, and self-supervision."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cmu-07280-lecture-05-ml-formulation)

This is **CMU 07-280 Spring 2026 Lecture 5: ML Problem Formulation**. The first four lectures relied on human-defined transitions, constraints, utilities, and heuristics. This lecture turns to systems that rely primarily on examples, but it still does not choose a model. It first makes the input, output, and cost of error explicit.

## Official materials and reading scope

I read the complete [ML Problem Formulation notes](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec5_MLFormulation.pdf) and the following lecture's [Decision Trees pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Decision_Trees.pdf) to verify how the formulation becomes a first model. No lecture recording is public.

The course lists HW3 as online-only. An anonymous learner cannot inspect its prompt, answers, or Gradescope feedback. This article therefore does not claim assignment-level verification from HW3; its public practice connection begins with Recitation 3 and HW4.

## The inherited question: when rules cannot be written, what counts as learning well

A CSP has explicit constraints, minimax has utility, and A* has path cost. Machine learning also needs a performance definition. Otherwise “learning from data” is not an operational claim. Lecture 5 writes supervised learning as:

```text
input space X
output space Y
training data D={(x(i),y(i))} for i=1...N
hypothesis h: X → Y
```

For classification, `Y` is finite and unordered. For regression, `Y` is continuous and ordered. The function `h` predicts the unknown `y(new)` for a new input `x(new)`.

## Full conceptual path: from one loss to distributional risk

A **loss function** `ℓ(ŷ,y)` defines the cost of one prediction. Classification can use zero-one loss: 1 for a mistake, 0 for a match. Regression commonly uses squared error `(ŷ-y)^2`, making the size of the deviation matter.

The real target is expected loss on unseen data:

```text
R(h) = E_(x,y)[ℓ(h(x),y)]
```

This is **risk**. The lecture uses the standard i.i.d. assumption: training and test examples are independently drawn from the same unknown distribution. Since that distribution is unknown, `R(h)` cannot be computed directly. The training set instead gives **empirical risk**:

```text
R_hat(h) = (1/N) Σ ℓ(h(x(i)),y(i))
```

Selecting the function in a hypothesis class `H` with the lowest empirical risk is **empirical risk minimization (ERM)**. This leaves two questions for later lectures: which functions belong to `H`, and how can a minimizer be computed efficiently? Decision trees, linear models, and neural networks provide different answers.

The lecture closes by distinguishing unsupervised learning. With inputs `x` but no human-provided labels `y`, one can cluster, reduce dimensions, learn representations, or generate. Self-supervision constructs targets from the data itself—for example, hide part of a text and predict the hidden or next token—turning unlabelled material into supervised pairs.

## A reproducible example: equal error rates, unequal costs

Suppose four medical labels are `[ill, ill, healthy, healthy]`. Model A predicts `[healthy, ill, ill, healthy]`; model B predicts `[ill, ill, ill, ill]`. Both make two mistakes, so each has zero-one empirical risk `2/4=0.5`.

Now set asymmetric costs: a false negative—predicting healthy for an ill person—costs 5, while a false positive costs 1. Model A has one of each, for average loss `6/4=1.5`. Model B has two false positives, for `2/4=0.5`. Data and predictions stayed fixed, but the preferred model changed with the loss.

The performance measure is therefore not a reporting column outside the model. It defines what ERM searches for.

## Recitation and homework connection

The missing public HW3 prevents an external learner from reproducing the week's official assessment. The next accessible [Recitation 3](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec3.pdf) starts with decision trees, entropy, and mutual information. [HW4](https://www.cs.cmu.edu/~07280/assignments/hw4_blank.pdf) places decision-tree splitting and a linear-regression objective in one assignment.

The sequence is exact: Lecture 5 defines `H`, loss, and ERM; Lecture 6 chooses `H=decision trees` and uses mutual information for greedy construction; Lecture 7 chooses linear functions and squared loss and solves the ERM objective directly.

## Further comparison: ERM is a proxy, not a generalization guarantee

Empirical risk uses a finite sample already observed. Risk lives over an unknown distribution. Connecting them requires additional conditions: whether data are actually identically distributed, how flexible the hypothesis class is, and whether the sample is large enough. Lecture 5 establishes the formulation but does not prove a generalization bound here.

Low training loss therefore does not by itself mean “the model learned.” The precise statement is that it fits this training set under the chosen loss and hypothesis class. Performance on unseen data still requires validation or test evidence.

## What to do tonight

1. Choose a familiar problem and define `X`, `Y`, one `h`, and a computable loss.
2. Calculate the empirical risk of two hypotheses on five toy examples.
3. Make the loss asymmetric once and see whether the ERM choice changes.

## References

- [CMU 07-280 Spring 2026 Lecture 5 — ML Problem Formulation](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec5_MLFormulation.pdf)
- [07-280 Decision Trees pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Decision_Trees.pdf)
- [07-280 Spring 2026 Recitation 3](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec3.pdf)
- [07-280 Spring 2026 Homework 4](https://www.cs.cmu.edu/~07280/assignments/hw4_blank.pdf)
