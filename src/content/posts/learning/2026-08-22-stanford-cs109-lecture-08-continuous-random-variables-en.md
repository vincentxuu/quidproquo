---
title: "Stanford CS109 Lecture 8 | Continuous Random Variables: PDFs, CDFs, Uniform, and Exponential"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: en
series:
  name: "Reading Stanford CS109"
  order: 9
tldr: "A continuous variable assigns zero probability to a point and area to intervals; CDFs, Uniform, Exponential, and memorylessness build on that distinction."
description: "A problem-by-problem guide to Stanford CS109 Summer 2026 Lecture 8: PDFs, CDFs, Uniform, Exponential minima, and memorylessness."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs109-lecture-08-continuous-random-variables)

This is article 9 in [Reading Stanford CS109](/series/stanford-cs109), covering **Summer 2026 Lecture 8: Continuous Random Variables** on July 2 with Chris Gregg. Its Summer agenda follows the [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture08-Worksheet.pdf), [answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture08-AnswerKey.pdf), [LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture08-LLMPrompts.pdf), and shared Spring-dated reader chapters on [continuous variables](https://probabilitycoders.stanford.edu/spr26/continuous), [Uniform](https://probabilitycoders.stanford.edu/spr26/uniform), and [Exponential](https://probabilitycoders.stanford.edu/spr26/exponential). The Canvas recording is inaccessible, so spoken material is not reconstructed.

Moving from discrete to continuous variables is more than replacing a sum with an integral. A PMF places probability on individual values. A PDF is density per unit length, and probability comes from area:

```text
P(a≤X≤b) = ∫[a,b] f(x) dx
F(a) = P(X≤a) = ∫[-∞,a] f(x) dx
```

## P1: Reconnect Poisson counts

A primatologist collects 15 usable samples per day on average. For `X~Poi(15)`,

```text
P(X=10) = e^-15 15^10 / 10! ≈ 0.0486
E[X] = Var(X) = 15
```

This review prepares the Exponential connection. Poisson asks how many events occur in fixed time; Exponential asks how long until the next event. Their rates must use consistent time units.

## P2: Uniform, point probability, and high-dimensional edges

For `X~Uniform(0,1)`, density is one throughout the interval, so `P(a≤X≤b)=b-a`. Yet `P(X=0.5)=0`: one point has zero width and therefore zero area under the density. This does not mean `0.5` is an impossible output; no exact real value receives positive probability by itself.

For `X~Uniform(5,7)`,

```text
f(x) = 1/2,  5≤x≤7
       0,    otherwise
P(5.5≤X≤6) = (6-5.5)/(7-5) = 0.25
```

P2(c) moves the simple model into 100 dimensions. One coordinate lies below `0.01` or above `0.99` with probability `0.02`. With 100 independent coordinates, the probability that at least one is near an edge is

```text
1 - (1-0.02)^100 = 1 - 0.98^100 ≈ 0.867
```

Edges occupy little space in one dimension, yet about 86.7% of these high-dimensional points touch at least one edge region. The worksheet uses this as a concrete instance of the curse of dimensionality: low-dimensional geometric intuition deteriorates quickly.

## P3: Build a PDF and CDF from scratch

The problem defines

```text
f(x) = c(2-2x²),  -1<x<1
       0,          otherwise
```

A valid PDF is nonnegative and has total area one. Since `∫[-1,1](2-2x²)dx=8/3`, normalization gives `c=3/8`. For `-1<a<1`, integrate from the left edge of the support:

```text
F(a) = ∫[-1,a] (3/8)(2-2x²) dx
     = 1/2 + 3a/4 - a³/4
F(0.5) = 27/32 = 0.84375
```

The complete CDF is zero at `a≤-1` and one at `a≥1`; differentiating the middle piece recovers `F'(a)=f(a)`. P3 belongs to pset3, so the official answer key deliberately says only “problem set problem.” The calculation above is derived directly from the public prompt and is not attributed to the omitted key.

## P4: A PDF is not a PMF

A PDF may exceed one because density itself is not probability. `Uniform(0,0.5)` has density two, while its total area remains `2×0.5=1`. The integral, not the density height, must be a probability between zero and one.

For any point of a continuous variable,

```text
P(X=c) = ∫[c,c] f(x) dx = 0
```

Consequently endpoints make no difference: `P(a≤X≤b)=P(a<X<b)`. Integrating the PDF over its entire support yields one, the probability of the whole outcome space. These checks align with the LLM guide's first two concepts on PDF interpretation and normalization.

## P5: Exponential waiting time

Magnitude 8.0+ earthquakes have rate `λ=0.002` per year. Let `Y~Exp(0.002)` be years until the next event:

```text
f(y) = 0.002e^(-0.002y),  y≥0
F(y) = 1-e^(-0.002y)
```

The probability of an event within 30 years is

```text
P(Y≤30) = 1-e^(-0.002×30) = 1-e^-0.06 ≈ 0.0582
```

An Exponential variable has both mean and standard deviation `1/λ=500` years. This is a distributional center and spread scale, not a promise that the next event occurs in exactly five centuries.

## P6: Use the CDF instead of reintegrating

For `X~Exp(1)`, `F(x)=1-e^-x`. Common events translate directly into CDF operations:

```text
P(X<2) = F(2) = 1-e^-2 ≈ 0.865
P(X>1) = 1-F(1) = e^-1 ≈ 0.368
P(1<X<2) = F(2)-F(1) = e^-1-e^-2 ≈ 0.233
```

Use `F` for a left tail, `1-F` for a right tail, and subtract endpoint CDF values for an interval. Strict and non-strict inequalities agree because endpoint probability is zero.

## P7: Minimum of two Exponentials

Let independent `X,Y~Exp(1)` and `L=min(X,Y)`. The earlier waiting time exceeds two only when both waits exceed two:

```text
P(L>2) = P(X>2,Y>2)
       = e^-2 × e^-2 = e^-4
P(L≤2) = 1-e^-4 ≈ 0.9817
```

This also shows `L~Exp(2)`: two rate-one processes competing to arrive first have total rate two. Independence is essential; shared causes would invalidate multiplication of the survival probabilities.

## Challenge: Exponential memorylessness

For `X~Exp(λ)`, conditioning on already waiting `s` gives

```text
P(X>s+t | X>s)
= P(X>s+t) / P(X>s)
= e^[-λ(s+t)] / e^(-λs)
= e^(-λt)
= P(X>t)
```

Elapsed waiting time does not alter the distribution of remaining time: this is memorylessness. Under the earthquake model, even after a long quiet period, the expected additional wait remains `1/λ=500` years. This is a property of the chosen model, not an unconditional claim about geology; adopting an Exponential model assumes a constant hazard.

## How to use the LLM Learning Guide

The guide orders six concepts: PMF to PDF, area and normalization, the CDF, Uniform, Exponential, and memorylessness. Attempt its tests—whether a PDF may exceed one, how to normalize a density, and whether rate units match—before showing reasoning to an LLM for line-by-line correction. The wrap-up combines PDF normalization, CDF derivation, a Uniform or Exponential probability, and memorylessness, making it a useful check that the six ideas have become one workflow.

## Material boundaries

- This guide covers worksheet/answer-key P1–P7, the optional challenge, and all six LLM-guide concepts.
- P3 is a pset3 problem whose solution is deliberately omitted from the official answer key; this article derives it only from the public prompt.
- The Canvas recording is inaccessible, so no additional spoken examples or claims are inferred.
- The worksheet and guide are only two pages each. This article uses the short-material exception: complete problem coverage without generic padding. It remains `draft: true` pending independent review.

## References

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 8: Continuous Random Variables](https://web.stanford.edu/class/cs109/lectures/8-Continuous)
- [Lecture 8 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture08-Worksheet.pdf)
- [Lecture 8 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture08-AnswerKey.pdf)
- [Lecture 8 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture08-LLMPrompts.pdf)
- [Probability for Computer Science: Continuous random variables](https://probabilitycoders.stanford.edu/spr26/continuous)
- [Probability for Computer Science: Uniform](https://probabilitycoders.stanford.edu/spr26/uniform)
- [Probability for Computer Science: Exponential](https://probabilitycoders.stanford.edu/spr26/exponential)
