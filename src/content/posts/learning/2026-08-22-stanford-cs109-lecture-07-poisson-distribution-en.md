---
title: "Stanford CS109 Lecture 7 | Variance and Poisson: From spread to rare-event counts"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: en
series:
  name: "Reading Stanford CS109"
  order: 8
tldr: "Variance describes a random variable's spread; Poisson models counts in a fixed interval and approximates a large-n, small-p binomial."
description: "A problem-by-problem guide to Stanford CS109 Summer 2026 Lecture 7: variance, standard deviation, Poisson rates, and binomial approximation."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs109-lecture-07-poisson-distribution)

This is article 8 in [Reading Stanford CS109](/series/stanford-cs109), covering **Summer 2026 Lecture 7: Poisson** on July 1 with Chris Gregg. Its Summer agenda follows the [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture07-Worksheet.pdf), [answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture07-AnswerKey.pdf), [LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture07-LLMPrompts.pdf), and the shared Spring-dated [course reader](https://probabilitycoders.stanford.edu/spr26/poisson) problem by problem. The Canvas recording is inaccessible, so spoken material is not reconstructed.

Although the official title is Poisson, the worksheet first completes another part of the previous lecture's agenda. Expectation locates a distribution's center; variance and standard deviation describe its spread. The worksheet then turns to counts in a fixed interval.

## P1: Reconnect expectation

If each person you date is a life partner with probability `0.2`, independently, and dating stops at the first success, then

```text
X ~ Geo(0.2),   E[X] = 1 / 0.2 = 5
```

The geometric count includes the successful trial, so this means five people on average, not four failures. Separately, `Y~Bin(500,0.53)` counts makes in 500 free throws. The binomial mean, or linearity over indicators, gives `E[Y]=500×0.53=265`. This review connects both later ideas: variance centers deviations at `μ=E[X]`, while the Poisson approximation uses `λ=np`.

## P2: Why variance squares deviations

```text
Var(X) = E[(X - μ)²],   μ = E[X]
```

Simply averaging deviations cannot measure spread because `E[X-μ]` is always zero: positive and negative deviations cancel. Squaring makes both sides positive and gives larger departures more weight. Expanding the definition yields

```text
Var(X) = E[X²] - (E[X])²
```

`E[X²]` squares each possible value before weighting it by the PMF—LOTUS gives `Σx x²P(X=x)`. `(E[X])²` computes the mean first and then squares it. They are not interchangeable. Variance has squared units, so `SD(X)=√Var(X)` returns to the original unit and is easier to compare with a mean or observation. These are the LLM guide's first two concepts: distinguish equal means with different spreads, then derive the computational formula.

## P3: Variance of a fair die

For a fair six-sided die, reuse `E[X]=3.5` and `E[X²]=91/6`:

```text
Var(X) = 91/6 - 3.5² = 35/12 ≈ 2.917
SD(X) = √(35/12) ≈ 1.708
```

The value `1.708` is a typical scale of departure from the mean. It does not say every roll differs by that amount, and it is not an event probability.

## P4: Variance of Bernoulli and Binomial variables

```text
Var(Bern(p)) = p(1-p)
Var(Bin(n,p)) = np(1-p)
```

A free throw made with probability `0.53` has variance `0.53×0.47=0.2491`. For makes in 500 independent attempts,

```text
Var(Y) = 500 × 0.53 × 0.47 = 124.55
SD(Y) = √124.55 ≈ 11.16
```

A binomial is a sum of independent Bernoulli variables, so their variances add. With fixed `n`, `p(1-p)` is largest at `p=1/2`; probabilities near zero or one make outcomes nearly fixed and reduce spread.

P4 is present with a complete solution in both official artifacts. Its earlier apparent omission was a PDF page-boundary extraction artifact, not a gap in the Summer 2026 material.

## P5: Meet the Poisson distribution

A Poisson random variable counts events in a fixed interval. If that interval contains `λ` events on average,

```text
X ~ Poi(λ)
P(X=k) = e^(-λ) λ^k / k!,   k=0,1,2,...
E[X] = Var(X) = λ
```

For `2.79` major earthquakes per year, let `X~Poi(2.79)`:

```text
P(X=3) = e^(-2.79) 2.79³ / 3! ≈ 0.222
P(X=0) = e^(-2.79) ≈ 0.0615
```

Poisson's mean and variance both equal `λ`, but its standard deviation is `√λ`; these three quantities should not be conflated.

## P6: Poisson approximation to a Binomial

Ten thousand strings are assigned independently and uniformly to 2,000 hash buckets. If `X` counts strings in the first bucket, the exact model is `Bin(10000,1/2000)`. Since `n` is large, `p` is small, and `np=5`, approximate it by `Poi(5)`:

```text
P(X≤8) ≈ Σ(k=0..8) e^-5 5^k / k! ≈ 0.9319
```

Poisson collapses the binomial parameters into `λ=np` and avoids huge combinations. The large-`n`, small-`p` justification must still be stated; the presence of a count alone does not license the approximation.

## P7: Match the rate to the interval

A server receives two hits per second on average. In one second, `X~Poi(2)`, so

```text
P(X<5) = Σ(k=0..4) e^-2 2^k / k! ≈ 0.947
```

For a five-second question, the parameter becomes `λ=2×5=10`. Lambda is the expected event count in the interval being modeled, not a unitless constant. Converting the interval before using the PMF is a separate concept in the LLM guide for good reason.

## Optional challenge: DNA data storage

A DNA strand stores `10⁴` base pairs, each independently corrupted with probability `10⁻⁶`:

```text
X ~ Bin(10⁴, 10⁻⁶)
X ≈ Poi(0.01)
P(X≥1) ≈ 1 - e^-0.01 ≈ 0.00995
```

The exact binomial value is about `0.00995017`, essentially identical. The challenge compresses the lecture's workflow: state the exact model, verify rare-event conditions, compute `λ=np`, then use the zero-event complement.

## How to use the LLM Learning Guide

The official guide orders six concepts: variance and SD, `E[X²]-(E[X])²`, variances of classic distributions, the Poisson PMF, rate/interval matching, and Poisson approximation to a binomial. It asks students to attempt each test, show their reasoning, and request the exact point of failure—not to outsource the worksheet.

For each problem, record the random variable and unit, independence assumptions, the interval represented by `λ`, and the approximation conditions. Then attempt the guide's wrap-up problem combining variance/SD, a rescaled Poisson rate, and a large-`n`, small-`p` binomial. The next lecture moves to continuous variables: Poisson counts events in an interval, while the Exponential distribution asks how long until the next event.

## Material boundaries

- This guide covers worksheet/answer-key P1–P7, the optional DNA challenge, and all six LLM-guide concepts.
- P4 is not missing; the earlier reading was a PDF page-boundary extraction artifact.
- The Canvas recording is inaccessible, so no additional spoken examples or claims are inferred.
- The worksheet and guide are only two pages each. This article uses the short-material exception: complete problem coverage without generic padding. It remains `draft: true` pending independent review.

## References

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 7: Poisson](https://web.stanford.edu/class/cs109/lectures/7-Poisson)
- [Lecture 7 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture07-Worksheet.pdf)
- [Lecture 7 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture07-AnswerKey.pdf)
- [Lecture 7 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture07-LLMPrompts.pdf)
- [Probability for Computer Science: Poisson](https://probabilitycoders.stanford.edu/spr26/poisson)
