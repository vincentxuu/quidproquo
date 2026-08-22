---
title: "Stanford CS109 Lecture 15 | Adding Random Variables and the Central Limit Theorem"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: en
series:
  name: "Reading Stanford CS109"
  order: 16
tldr: "A few independent sums have closed forms; general IID sums become approximately Normal under the CLT, with continuity correction for discrete sums."
description: "A problem-by-problem guide to Stanford CS109 Summer 2026 Lecture 15: IID variables, convolution, closed-form sums, Normal differences, the CLT, and continuity correction."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs109-lecture-15-central-limit-theorem)

This is article 16 in [Reading Stanford CS109](/series/stanford-cs109), covering **Summer 2026 Lecture 15: Central Limit Theorem** on July 16 with Chris Gregg. It follows the current [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture15-Worksheet.pdf), [answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture15-AnswerKey.pdf), [LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture15-LLMPrompts.pdf), and reader chapters on [sums of random variables](https://probabilitycoders.stanford.edu/spr26/summation_vars) and the [CLT](https://probabilitycoders.stanford.edu/spr26/clt). The current slides are unavailable and Canvas video is gated, so missing material is not reconstructed.

The worksheet and key contain complete two-page P1–P7 plus challenge material. The guide's six concepts occupy two substantive pages; page three only continues the wrap-up. This is the first **L2** unit: the public problem set and reader support a complete artifact guide, but not a claim to reproduce the full slides or lecture.

## P1: Open with a Beta-belief review

A Subscribe button receives nine clicks from 12 visitors. Starting from `Beta(1,1)`,

```text
X|data ~ Beta(10,4)
E[X] = 10/14 = 5/7 ≈ 0.714
```

This closes belief over a probability before moving to distributions of sums.

## P2: Three closed-form sum families

Independent `Bin(12,0.25)` and `Bin(28,0.25)` variables pool into 40 Bernoulli trials with a shared probability:

```text
X+Y ~ Bin(40,0.25)
```

Different `p` values would make pooled trials non-identically distributed, so the sum would not be an ordinary Binomial. Independent Poisson rates add:

```text
Poi(2.2)+Poi(3.8)=Poi(6)
P(total=5)=e^-6 6^5/5!≈0.161
```

Independent Normal means and variances add:

```text
N(10,9)+N(20,16)=N(30,25)
P(X+Y>40)=1-Φ((40-30)/5)=1-Φ(2)≈0.0228
```

Most families are not closed under addition; for example, two Uniforms sum to a triangular distribution.

## P3: Why convolution is a sum of products

For independent nonnegative discrete `X,Y`,

```text
P(X+Y=n)=Σ(k=0..n)P(X=k)P(Y=n-k)
```

In the supplied PMFs, only `(1,1)` and `(2,0)` contribute to sum two:

```text
P(X+Y=2)=0.3×0.6+0.2×0.4=0.26
```

The split events are mutually exclusive, so probabilities add; independence factors each joint term into a product. Continuous convolution replaces the sum with an integral while preserving the same “all possible splits” logic.

## P4: A Normal difference and ELO

Independent performances satisfy `A~N(1650,200²)` and `B~N(1500,200²)`. For `D=A-B`,

```text
D ~ N(150, 200²+(-1)²200²)
  = N(150,80000)
SD(D)≈282.8
```

Variance adds even for a difference because coefficient `-1` is squared. Team A's win probability is

```text
P(D>0)=Φ(150/282.8)=Φ(0.53)≈0.70
```

If both variances grow, the mean gap remains 150 while its z-score shrinks toward zero. A's win probability moves toward `0.5`, reflecting more upsets.

## P5: A CLT for truncation error

Each `Xi~Uniform(0,1)` is truncated to three decimals. One loss `Xi-Yi~Uniform(0,0.001)`. The sum of 1,000 IID errors is approximately Normal:

```text
μ = 1000×0.001/2 = 0.5
σ² = 1000×(0.001)²/12 = 8.33×10^-5
σ ≈ 0.00913
```

Hence

```text
P(X-Y>0.51)
≈1-Φ((0.51-0.5)/0.00913)
≈1-Φ(1.10)≈0.137
```

The errors are continuous, so no continuity correction applies. Since truncation losses are nonnegative, the negative tail in a two-sided reading is essentially zero.

## P6: The CLT needs more than a sum

The problem adds one Bernoulli, Binomial, Geometric, Uniform, Beta, and Exponential variable. They are independent but not identically distributed, and there are only six terms. The standard IID CLT taught here therefore makes no claim that their sum is Normal.

The guide requires IID variables, finite variance, and reasonably large `n`. More general CLTs have different assumptions, but those are outside this public unit and do not change the intended answer.

## P7: Rolling Until 300

“At least 80 rolls are needed to exceed 300” means the first 79 rolls sum to `S79≤300`. One die has mean `3.5` and variance `35/12`, so

```text
S79 ≈ N(79×3.5,79×35/12)
    = N(276.5,230.417)
SD≈15.179
```

Because the sum is integer-valued, `≤300` uses boundary `300.5`:

```text
P(S79≤300)
≈Φ((300.5-276.5)/15.179)
=Φ(1.581)≈0.943
```

P7 is a pset5 item omitted from the public key; the event translation, CLT parameters, and continuity correction come directly from the prompt.

## Challenge: A sum of 30 Betas

IID `Xi~Beta(4,2)` have

```text
E[Xi]=2/3
Var(Xi)=4×2/(6²×7)=2/63
```

For `X=Σ(i=1..30)Xi`, the CLT gives

```text
X≈N(20,20/21),  SD≈0.9759
P(19<X<20)
≈Φ(0)-Φ((19-20)/0.9759)
≈0.347
```

This sum is continuous, so no continuity correction is used. The challenge is another pset5 item omitted from the public key; the derivation uses only the prompt.

## How to use the LLM Learning Guide

The six concepts are IID variables, convolution, closed-form sums, Normal differences/ELO, the CLT, and continuity correction. First ask whether a sum already has an exact closed form; only then check CLT conditions. After choosing a Normal approximation, determine whether the original sum is integer-valued—only discrete bars need a half-unit correction.

## Material boundaries

- This guide covers P1–P7, the optional challenge, and all six guide concepts; numbering is complete.
- P7 and the challenge are pset5 items omitted from the public answer key and are derived only from public prompts.
- Current slides are unavailable and video is gated; L2 does not mean a full lecture reconstruction.
- The worksheet/key are two pages each, and guide page three only continues closing text. The short-material exception applies; the article remains `draft: true` pending independent review.

## References

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 15: Central Limit Theorem](https://web.stanford.edu/class/cs109/lectures/15-CLT)
- [Lecture 15 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture15-Worksheet.pdf)
- [Lecture 15 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture15-AnswerKey.pdf)
- [Lecture 15 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture15-LLMPrompts.pdf)
- [Probability for Computer Science: Sums of random variables](https://probabilitycoders.stanford.edu/spr26/summation_vars)
- [Probability for Computer Science: Central Limit Theorem](https://probabilitycoders.stanford.edu/spr26/clt)
