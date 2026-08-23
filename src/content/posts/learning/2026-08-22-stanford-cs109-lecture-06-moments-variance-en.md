---
title: "Stanford CS109 Lecture 6 | Moments: Expectation, LOTUS, and linearity"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: en
series:
  name: "Reading Stanford CS109"
  order: 7
tldr: "Expectation compresses a distribution into a weighted average; LOTUS handles transformed values, while linearity makes sums tractable even without independence."
description: "A problem-by-problem guide to Stanford CS109 Summer 2026 Lecture 6: expectation, LOTUS, linear transformations, and linearity of expectation."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs109-lecture-06-moments-variance)

This is article 7 in [Reading Stanford CS109](/series/stanford-cs109), covering **Summer 2026 Lecture 6: Moments (Expectation)** on June 30 with Chris Gregg. Its Summer agenda comes from the [schedule](https://web.stanford.edu/class/cs109/schedule.html), [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture06-Worksheet.pdf), [answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture06-AnswerKey.pdf), and [LLM guide](https://web.stanford.edu/class/cs109/worksheets/Lecture06-LLMPrompts.pdf). The `/spr26` [reader](https://probabilitycoders.stanford.edu/spr26) is a shared, Spring-dated concept reference rather than evidence of the Summer lecture. Canvas video is inaccessible and is not reconstructed.

## From a distribution to an operational summary

Expectation is the probability-weighted average,

```text
E[X] = Σx x P(X=x)
```

and need not be attainable. A fair die has expectation 3.5 although no face shows 3.5.

## Problem 1: reconnecting the binomial PMF

For five four-option questions guessed independently, `X~Bin(5,.25)` and

```text
P(X=k) = C(5,k)(.25)^k(.75)^(5-k)
```

Exactly two substitutes k=2; at least one is `1-.75^5`. This separates a fixed-trial success count from a waiting-time variable.

## Problem 2: naming four classic variables

A single ad click is Bernoulli(.01); dates until the first partner are geometric(.2); attempts until Shaq’s third make are negative binomial with r=3 and p=.53; heads in twenty fair flips are Bin(20,.5). Identify what X counts and whether trials or required successes determine stopping.

## Problem 3: sampling a class versus sampling a student

Choosing one of classes sized 5, 10, and 150 uniformly gives mean 55. Choosing one of 165 students uniformly weights classes by enrollment, giving `(5²+10²+150²)/165≈137.1`. The larger student-experienced average is size-biased sampling, not contradictory arithmetic.

## Problem 4: linearity and LOTUS

For die result X and winnings W=2X-1, linearity gives `E[W]=2E[X]-1=6`. LOTUS handles nonlinear transformations:

```text
E[g(X)] = Σx g(x)P(X=x)
```

Thus `E[X²]=91/6`, while `E[X]²=12.25`; averaging then squaring differs from squaring then averaging. That contrast prepares the variance topic without claiming it as this lecture's agenda.

## Problem 5: expectations of classic variables

The formulas are `E[Bern(p)]=p`, `E[Bin(n,p)]=np`, and `E[Geo(p)]=1/p`. Shaq expects 265 makes in 500 attempts at .53; improving by ten percentage points adds 50 expected makes. Geometric(.2) has mean waiting time five, a long-run average rather than a fifth-trial guarantee.

## Problem 6: daycare revenue and piecewise cost

With six babies independently attending with probability 5/6, `X~Bin(6,5/6)` and high attendance is `P(X=5)+P(X=6)`. Revenue is linear:

```text
E[R] = 50E[X] = 50 × 6 × 5/6 = 250
```

Staffing cost is piecewise: `200P(X≤4)+400P(X≥5)`. This contrasts a linear transform with a function requiring event-weighted LOTUS reasoning.

## Problem 7: linearity without independence

Let Xi indicate whether position i contains its sorted card. Each is Bernoulli(1/52), though the indicators are dependent. Linearity still gives

```text
E[X] = E[Σ Xi] = Σ E[Xi] = 52 × 1/52 = 1
```

so a random permutation has one fixed point on average. The challenge derives `E[Bin(n,p)]=np` by writing the count as a sum of n Bernoulli indicators—no binomial-PMF sum required.

## Material gaps

- This guide covers all seven worksheet problems and the optional challenge without inventing inaccessible classroom examples.
- Recordings are Canvas-gated and were not used.

## References

- [CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 6 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture06-Worksheet.pdf)
- [Lecture 6 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture06-AnswerKey.pdf)
- [Lecture 6 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture06-LLMPrompts.pdf)
- [Probability for Computer Science](https://probabilitycoders.stanford.edu/spr26)
