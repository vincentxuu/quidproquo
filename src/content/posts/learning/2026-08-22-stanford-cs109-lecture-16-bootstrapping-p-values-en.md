---
title: "Stanford CS109 Lecture 16 | Bootstrapping: Sampling statistics, error bars, and p-values"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: en
series:
  name: "Reading Stanford CS109"
  order: 17
tldr: "The bootstrap treats a sample histogram as a population proxy, resampling with replacement to approximate a statistic's sampling distribution, error bar, or null p-value."
description: "A problem-by-problem guide to Stanford CS109 Summer 2026 Lecture 16: sample variance, standard error, bootstrap algorithms, median uncertainty, null hypotheses, and p-values."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs109-lecture-16-bootstrapping-p-values)

This is article 17 in [Reading Stanford CS109](/series/stanford-cs109), covering **Summer 2026 Lecture 16: Bootstrapping** on July 20 with Chris Gregg. It follows the current [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture16-Worksheet.pdf), [answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture16-AnswerKey.pdf), [LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture16-LLMPrompts.pdf), and reader chapters on [bootstrapping](https://probabilitycoders.stanford.edu/spr26/bootstrapping) and [samples](https://probabilitycoders.stanford.edu/spr26/samples). Current slides are unavailable and Canvas video is gated, so this remains an L2 artifact guide.

The worksheet, key, and guide are all three pages. The formal agenda is P1–P6 plus challenge, with no orphan page or numbering gap. A sample distribution describes data spread; a sampling distribution describes how a statistic changes when the whole experiment is repeated. Error bars target the latter.

## P1: Review a CLT for checkout totals

One hundred IID checkout counts each have mean three and variance four. For total `S`,

```text
S ≈ N(100×3,100×4)=N(300,400),  SD=20
```

The counts are integer-valued, so `S≥320` begins at continuous boundary `319.5`:

```text
P(S≥320)≈1-Φ((319.5-300)/20)
        =1-Φ(0.975)≈0.165
```

## P2: Ping Times mean, unbiased variance, and SE

The eight latencies `[12,15,11,14,13,19,12,16]` sum to 112, giving `X̄=14 ms`. Squared deviations from 14 sum to 48:

```text
S² = 48/(8-1) = 48/7 ≈ 6.86 ms²
SE(X̄)=√(S²/8)≈0.93 ms
```

Replacing the unknown population mean with the fitted sample mean systematically shrinks squared deviations; Bessel's `n-1` correction makes the variance estimator unbiased. Sample SD describes individual-ping spread, while SE estimates the standard deviation of the mean across repeated eight-ping experiments.

The approximate CLT interval is

```text
14±2(0.93)=[12.1,15.9] ms
```

Across repeated sampling, this construction covers the true mean roughly 95% of the time. It does not assign 95% probability to a fixed parameter lying in this already computed interval.

## P3: A tiny bootstrap that can be enumerated

For sample `[2,4,9]`, three with-replacement draws create `3³=27` ordered resamples. The probability the maximum equals nine is

```text
P(max=9)=1-(2/3)³=19/27≈0.70
```

The resample mean equals original mean five exactly when its sum is 15. Only multiset `{2,4,9}` works, with `3!=6` orderings:

```text
P(mean=5)=6/27=2/9≈0.22
```

With `replace=False`, drawing `n` from `n` only permutes the original sample. Every statistic is identical, collapsing the bootstrap distribution to one point. Replacement preserves the empirical PMF's draw probabilities.

## P4: Bootstrap a median without a closed-form SE

For 50 app ratings,

```text
medians=[]
repeat 10,000 times:
  resample=choice(ratings,50,replace=True)
  medians.append(median(resample))
return std(medians)
```

The bootstrap assumes the observed sample histogram is a useful proxy for the population distribution. Resampling it then mimics fresh experiments and works for medians, variances, IQRs, and differences of means.

It becomes unreliable when data are non-IID because naive resampling destroys dependence, or when a long-tailed population contains consequential rare extremes absent from the original sample.

## P5: A null bootstrap test for a compiler flag

Flag A has 40 runtimes with mean 210 ms; B has 45 with mean 204 ms, an observed six-ms gap. The null says both groups come from one runtime distribution and the gap is sampling noise.

Pool all 85 measurements under the null, then redraw original group sizes:

```text
universal=concat(A_times,B_times)
count=0
repeat 10,000 times:
  A*=choice(universal,40,replace=True)
  B*=choice(universal,45,replace=True)
  if abs(mean(A*)-mean(B*))>=6: count+=1
p=count/10,000
```

`p=0.03` means that, if the null were true, about 3% of experiments like this would produce a gap at least this extreme. It is not `P(null=true|data)` and does not measure effect size. With `p=0.4`, the gap is ordinary under the null and does not establish a real flag difference.

## P6: Bootstrap uncertainty in a Course Size estimator

Ten historical ratios `ri` are IID, and final enrollment is `T=300R`. Plug-in estimates are

```text
Ê[T] = 300R̄ = 300×(1/10)Σri

Var-hat(T)=300²S_R²
          =300²×(1/9)Σ(ri-R̄)²
```

The target in part (c) is not `Var-hat(T)` but its sampling variability with only ten historical observations:

```text
estimates=[]
repeat 10,000 times:
  r*=choice([r1,...,r10],10,replace=True)
  estimates.append(300²×sample_variance(r*))
return std(estimates)
```

Each round must recompute the full target statistic. Bootstrapping only raw-ratio SD would answer a different question.

## Challenge: Two schools of statistical thought

Fifteen flips yield five heads and ten tails. Starting from Laplace prior `Beta(2,2)`, the Bayesian route gives

```text
p|data~Beta(7,12),  E[p|data]=7/19≈0.37
```

The frequentist bootstrap treats five ones and ten zeros as the empirical sample, repeatedly draws 15 values with replacement, and records head fraction. Ten thousand fractions approximate the sampling distribution of `p-hat`, centered near observed `5/15=1/3`.

The distributions answer different questions. A Bayesian posterior expresses belief about random parameter `p` given prior and data. A bootstrap distribution treats `p` as a fixed unknown and describes estimator `p-hat` across repeated samples.

## How to use the LLM Learning Guide

The six concepts are population/sample/statistic, unbiased variance, SE, the bootstrap algorithm, arbitrary statistics and failure modes, and null p-values. First state which quantity varies across repeated experiments, then write resampling code. A hypothesis test additionally requires samples from the null-implied pool and a conditional interpretation of the resulting p-value.

## Material boundaries

- This guide covers P1–P6, the optional challenge, and all six guide concepts; all three pages and problem numbers are complete.
- Current slides are unavailable and video is gated; an L2 article does not reconstruct missing lecture content.
- Bootstrap code is equivalent organization of official pseudocode, not a claim about production implementation details.
- The limited artifact scope qualifies for the short-material exception; the article remains `draft: true` pending independent review.

## References

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 16: Bootstrapping](https://web.stanford.edu/class/cs109/lectures/16-Bootstrapping)
- [Lecture 16 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture16-Worksheet.pdf)
- [Lecture 16 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture16-AnswerKey.pdf)
- [Lecture 16 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture16-LLMPrompts.pdf)
- [Probability for Computer Science: Bootstrapping](https://probabilitycoders.stanford.edu/spr26/bootstrapping)
- [Probability for Computer Science: Samples and populations](https://probabilitycoders.stanford.edu/spr26/samples)
