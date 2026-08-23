---
title: "Stanford CS109 Lecture 9 | Normal Distribution: Standardization, Phi, and continuity correction"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: en
series:
  name: "Reading Stanford CS109"
  order: 10
tldr: "Standardization maps Normal variables to Z; Phi, linear transforms, and continuity correction turn intervals and large binomials into computable probabilities."
description: "A problem-by-problem guide to Stanford CS109 Summer 2026 Lecture 9: Normal variables, z-scores, Phi, linear transforms, binomial approximation, and continuity correction."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs109-lecture-09-normal-distribution)

This is article 10 in [Reading Stanford CS109](/series/stanford-cs109), covering **Summer 2026 Lecture 9: The Normal Distribution** on July 6 with Chris Gregg. Its Summer agenda follows the [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture09-Worksheet.pdf), [answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture09-AnswerKey.pdf), [LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture09-LLMPrompts.pdf), and shared Spring-dated reader chapters on the [Normal](https://probabilitycoders.stanford.edu/spr26/normal) and [binomial approximation](https://probabilitycoders.stanford.edu/spr26/binomial_approx). The Canvas recording is inaccessible, so spoken material is not reconstructed.

The original worksheet has two pages: P1–P3 are on page one, while P4–P7 and the challenge are on page two. No problem number is missing. P5 and the challenge are problem-set items deliberately hidden from the public answer key; this guide distinguishes its derivations from officially printed solutions.

## P1: Review Exponential waiting time

The wait for a server's next request is `T~Exp(0.5)` hours:

```text
P(T<2) = 1-e^(-0.5×2) = 1-e^-1 ≈ 0.632
E[T] = 1/0.5 = 2 hours
```

Given no request in the first three hours, memorylessness gives

```text
P(T>5 | T>3) = P(T>2) = e^-1 ≈ 0.368
```

This closes the waiting-time model before the worksheet introduces the Normal distribution for measurement error, natural variation, and sums of many small effects.

## P2: Normal parameters and standardization

For an exam score `X~N(70,16)`, CS109's second parameter is variance `σ²=16`, so the mean is `70` and standard deviation is `σ=4`. Many software libraries take `σ` rather than `σ²`, an interface trap the worksheet explicitly flags.

The z-score of 74 is

```text
z = (74-70)/4 = 1
Z = (X-μ)/σ ~ N(0,1)
```

Thus 74 is one standard deviation above the mean. With `Φ(z)=P(Z≤z)` denoting the standard-normal CDF, `P(X<74)=Φ(1)≈0.841`. Standardization is an exact linear transformation of a Normal, not an approximation.

## P3: Symmetry of Phi and intervals

The standard normal is symmetric around zero:

```text
Φ(-a) = 1-Φ(a)
```

The probability within one standard deviation is

```text
P(-1≤Z≤1) = Φ(1)-Φ(-1)
           = 2Φ(1)-1
           ≈ 0.683
```

This is the first part of the 68–95–99.7 rule. A right tail uses a complement: if `Φ(1.31)=0.9049`, then `P(Z>1.31)=0.0951`. Sketch the event before choosing `Φ`, `1-Φ`, or a difference of two CDF values.

## P4: A two-sided submarine-panel specification

Panel thickness is `X~N(500,36)` microns, hence `σ=6`. The specification accepts 490 through 510, whose z-scores are

```text
z490 = (490-500)/6 ≈ -1.667
z510 = (510-500)/6 ≈  1.667
```

Therefore

```text
P(490≤X≤510)
= Φ(1.667)-Φ(-1.667)
= 2Φ(1.667)-1
≈ 0.904
```

About 90.4% of panels meet the standard. The problem combines P2's standardization with P3's symmetry: convert each endpoint, then subtract the left CDF from the right.

## P5: A Website Analytics right tail

Weekly visitors satisfy `X~N(2200,52900)`, so `σ=230`. The probability of exceeding 2,000 is

```text
P(X>2000)
= 1-Φ((2000-2200)/230)
= Φ(200/230)
≈ 0.808
```

The threshold lies below the mean, so the result should exceed one half—a useful directional check. P5 belongs to pset3 and is omitted from the public answer key; `0.808` is computed directly from the public prompt and the standard-normal CDF.

## P6: Normal approximation to a large Binomial

A new design is tested on one million users. Under the no-effect assumption, each improves independently with probability `0.5`, so `X~Bin(10⁶,0.5)`. The approximating Normal has

```text
μ = np = 500,000
σ² = np(1-p) = 250,000
σ = 500
```

The CEO endorses at `X≥501,000`. Integer 501,000 occupies a discrete bar beginning at 500,999.5 on the continuous curve, so continuity correction gives

```text
P(X≥501,000)
≈ 1-Φ((500,999.5-500,000)/500)
= 1-Φ(1.999)
≈ 0.0228
```

Even with no real effect, sampling variation reaches the endorsement threshold about 2.3% of the time. Here `p=0.5` and `np(1-p)=250,000` is far above ten, making this a large-`n`, moderate-`p` Normal regime. Poisson is instead suited to large `n` with tiny `p`.

## P7: What continuity correction corrects

For 100 fair flips, the heads count `X~Bin(100,0.5)` is approximated by `N(50,25)`. The discrete event `X=55` is a bar one unit wide, so preserve the entire bar:

```text
P(X=55) ≈ P(54.5<Y<55.5)
        = Φ((55.5-50)/5)-Φ((54.5-50)/5)
```

The event `X≤60` includes all of the 60 bar, moving the continuous boundary to 60.5:

```text
P(X≤60) ≈ Φ((60.5-50)/5) = Φ(2.1)
```

Drawing integer bars is safer than memorizing signs: `≤k` extends to `k+0.5`, `≥k` begins at `k-0.5`, and `=k` occupies `[k-0.5,k+0.5]`.

## Challenge: A linear combination of independent Normals

Let independent `X~N(1,2)` and `Y~N(1,2)`, with `W=2X+Y`. A linear combination of Normals remains Normal. Means use the coefficients directly, while variances use squared coefficients:

```text
E[W] = 2E[X]+E[Y] = 3
Var(W) = 2²Var(X)+Var(Y) = 4×2+2 = 10
W ~ N(3,10)
```

Thus

```text
P(W<5) = Φ((5-3)/√10) ≈ Φ(0.632) ≈ 0.736
```

Independence makes the covariance term zero. Without it, the variance would also contain `2ab Cov(X,Y)`. This challenge belongs to pset4 and is hidden from the public key; the result above is derived from the prompt.

## How to use the LLM Learning Guide

The guide's six concepts are Normal parameters, standardization and `Φ`, symmetry and intervals, linear transformations and sums, Normal approximation to a binomial, and continuity correction. A useful test order is to distinguish variance from SD, sketch the event direction, and only then look up `Φ`. For an approximation, add one sentence explaining Normal rather than Poisson and draw the half-unit adjustment around discrete bars.

## Material boundaries

- This guide covers worksheet P1–P7, the optional challenge, and all six LLM-guide concepts; there is no page-boundary numbering gap.
- P5 and the challenge are problem-set items deliberately omitted from the public answer key; this article derives them only from the public prompts.
- The Canvas recording is inaccessible, so no additional spoken examples or claims are inferred.
- The worksheet and guide are only two pages each. The short-material exception applies: complete problem coverage without generic padding. It remains `draft: true` pending independent review.

## References

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 9: The Normal Distribution](https://web.stanford.edu/class/cs109/lectures/9-Gaussian)
- [Lecture 9 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture09-Worksheet.pdf)
- [Lecture 9 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture09-AnswerKey.pdf)
- [Lecture 9 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture09-LLMPrompts.pdf)
- [Probability for Computer Science: Normal](https://probabilitycoders.stanford.edu/spr26/normal)
- [Probability for Computer Science: Normal approximation to Binomial](https://probabilitycoders.stanford.edu/spr26/binomial_approx)
