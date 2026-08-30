---
title: "How Do You Avoid Missing Cells in Joint Distribution and PMF Transformations?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 18
tldr: "Joint PMF problems require listing every cell. Marginalization, conditional probability, and variable transformations are all sums or regroupings of the original cells."
description: "A beginner guide to joint PMFs and transformations: 2x2 probability tables, marginals, conditionals, and a full hand calculation for Z = X + Y."
draft: false
---

> [中文版](/posts/learning/2026-08-29-im-stat-pmf-transformations)

Joint-distribution problems often go wrong because a cell is missing. When a problem asks for `P(X + Y = 1)`, it is easy to remember `(1, 0)` and forget `(0, 1)`, even though both make the sum equal 1.

The hard part of PMF transformation is usually not the final arithmetic. It is listing the original sample space completely.

A joint PMF is a probability table. Each cell is the probability of one `(x, y)` pair. A marginal distribution sums across rows or columns. A conditional distribution fixes one condition and renormalizes the remaining cells. A variable transformation groups old cells by the value of a new variable.

## Three Moves: Sum, Restrict, Regroup

Given a joint PMF `p(x, y)`, the marginal distribution of `X` is:

```text
pX(x) = sum_y p(x, y)
```

Fix `x`, then add over all possible `y` values. The marginal distribution of `Y` is:

```text
pY(y) = sum_x p(x, y)
```

Conditional probability is:

```text
p(x | y) = p(x, y) / pY(y)
```

The denominator reminds you that once `Y = y` is known, probability is redistributed inside that restricted world.

If a new variable is defined as `Z = g(X, Y)`, then:

```text
pZ(z) = sum p(x, y) over all (x, y) where g(x, y) = z
```

In plain language: find every original cell that maps to the same `z`, then add their probabilities.

## Worked Example: A 2x2 Joint PMF

Suppose `X` and `Y` each take values 0 or 1:

| X | Y | P(X, Y) |
| ---: | ---: | ---: |
| 0 | 0 | 0.10 |
| 0 | 1 | 0.20 |
| 1 | 0 | 0.30 |
| 1 | 1 | 0.40 |

First check the total:

```text
0.10 + 0.20 + 0.30 + 0.40 = 1
```

So this is a valid PMF.

Now compute the marginal distribution of `X`. For `X = 0`, add the cells where `Y = 0` and `Y = 1`:

```text
P(X = 0) = 0.10 + 0.20 = 0.30
```

For `X = 1`:

```text
P(X = 1) = 0.30 + 0.40 = 0.70
```

Now compute one conditional probability: `P(X = 1 | Y = 1)`.

The numerator is:

```text
P(X = 1, Y = 1) = 0.40
```

The denominator is:

```text
P(Y = 1) = 0.20 + 0.40 = 0.60
```

So:

```text
P(X = 1 | Y = 1) = 0.40 / 0.60 = 2/3
```

## Variable Transformation: Z = X + Y

Now define:

```text
Z = X + Y
```

`Z` can be 0, 1, or 2. List the source cells:

```text
Z = 0: (X, Y) = (0, 0)
Z = 1: (X, Y) = (1, 0), (0, 1)
Z = 2: (X, Y) = (1, 1)
```

Therefore:

```text
P(Z = 0) = P(0, 0) = 0.10
P(Z = 1) = P(1, 0) + P(0, 1) = 0.30 + 0.20 = 0.50
P(Z = 2) = P(1, 1) = 0.40
```

Check the total again:

```text
0.10 + 0.50 + 0.40 = 1
```

This final check matters. If a PMF transformation misses a cell, the probabilities often fail to sum to 1. Even under time pressure, reserve a few seconds for this check.

## Where This Shows Up in ML/AI

Many probabilistic models operate on joint probability. Naive Bayes approximates the joint probability of labels and features. HMMs handle visible observations and hidden states. Topic models build probability relationships among documents, topics, and words.

ML evaluation also uses the same table logic. You might record both data source and whether the model answered correctly. That is a joint table. You can marginalize over source to get overall accuracy, or condition on one source to inspect that source's error rate. If you only read the aggregate score, you may miss a subgroup failure.

LLM systems have similar structures. Suppose you track retrieval hit or miss and answer correct or incorrect. The four cells are: hit and correct, hit and wrong, miss and correct, miss and wrong. That table is more informative than one accuracy number because it shows where the system breaks.

## Common Mistakes

Mistake 1: starting calculations before listing all `(x, y)` combinations.

Mistake 2: computing `P(X = 1 | Y = 1)` with denominator `P(X = 1)` instead of `P(Y = 1)`.

Mistake 3: missing another old cell that maps to the same new value during a transformation.

Mistake 4: not checking that the transformed PMF is nonnegative and sums to 1.

Mistake 5: mixing joint, marginal, and conditional probability in one unclear explanation.

## Practice

1. Draw your own 2x2 joint PMF table and make sure the four probabilities sum to 1.
2. From that joint PMF, compute `P(X = 0)`, `P(X = 1)`, `P(Y = 0)`, and `P(Y = 1)`.
3. Let `Z = X + Y`. List which `(x, y)` cells map to each value of `z`.
4. Design a retrieval-system 2x2 table using retrieval hit/miss and answer correct/incorrect. Explain what each cell means.

## Next

At this point, Layer One has enough tools for many introductory exam problems. The next post returns to the NTU IM 114-115 past-paper entry point and shows how to analyze questions without treating two years as the whole exam scope.

## Section-Level Source Map

- OpenIntro and OpenStax: joint PMFs, marginal distributions, conditional probability, and discrete variable transformations.
- Stanford CS109: discrete probability tables, random variables, and probabilistic-model intuition.
- scikit-learn: Naive Bayes, classification models, and error-analysis tables.
- NTU IM prep pages: topic placement and practice-flow alignment; not used as official solutions.

## References

- [Joint distributions and PMF transformations in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: Discrete Random Variables and Probability](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109: Probability for Computer Scientists](https://cs109.stanford.edu/)
- [scikit-learn Naive Bayes](https://scikit-learn.org/stable/modules/naive_bayes.html)
- [scikit-learn Classification Metrics](https://scikit-learn.org/stable/modules/model_evaluation.html#classification-metrics)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
