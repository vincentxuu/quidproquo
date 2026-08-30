---
title: "How Do Samples, Statistics, and Sampling Distributions Differ?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 21
tldr: "A sample is the data, a statistic is a function of the sample, and a sampling distribution is the distribution of that statistic under repeated sampling."
description: "A beginner guide to random samples, statistics, sampling distributions, iid assumptions, sample means, standard errors, and why validation metrics are also statistics."
draft: false
---

> [中文版](/posts/learning/2026-08-29-im-stat-random-samples-statistics)

Layer Two starts with a distinction that beginners often blur: sample, statistic, and sampling distribution. In Layer One, you used sample means, sample proportions, standard errors, confidence intervals, and tests. Now we step back and ask why numbers computed from a sample can say anything about a population.

Separate the three terms first:

```text
sample: the data you observed this time
statistic: a function computed from the sample
sampling distribution: the distribution a statistic forms under repeated sampling
```

Many errors come from mixing the first and third lines. Your observed data have a distribution. If you repeatedly draw new samples and compute the sample mean each time, those sample means also form a distribution. That second distribution is the sampling distribution.

## What iid Means

Mathematical derivations often begin with:

```text
X1, X2, ..., Xn are iid
```

`Independent` means the sample observations do not affect one another. `Identically distributed` means each observation comes from the same distribution.

Both assumptions are strong. If you collect 20 consecutive clicks from the same user in one day, the observations may not be independent. If you mix weekday and weekend traffic, Taiwan and overseas users, or old and new product versions, the observations may not be identically distributed.

Exams often give clean iid settings so formulas can be derived. In practice, always ask how the data collection process might violate the assumption.

## A Statistic Is a Function of the Sample

A statistic uses the sample only. It does not use unknown parameters. The sample mean is the most familiar example:

```text
xbar = (X1 + X2 + ... + Xn) / n
```

Sample proportion, sample variance, maximum, minimum, median, and validation accuracy are also statistics. They can all be computed directly from observed data.

If:

```text
E[Xi] = mu
Var(Xi) = sigma^2
```

then the sample mean has two important properties:

```text
E[xbar] = mu
Var(xbar) = sigma^2 / n
```

The first line says the sample mean is centered on the population mean in the long run. The second line says the sample mean fluctuates less as sample size grows.

The standard error is:

```text
SE(xbar) = sigma / sqrt(n)
```

This `SE` describes the fluctuation of the sample mean, not the standard deviation of one observation.

## Worked Example: Individual Variation Versus Mean Variation

Suppose one observation has standard deviation 10. Each sample contains 25 observations, and you use the sample mean to estimate the population mean.

The standard error of the sample mean is:

```text
SE = 10 / sqrt(25) = 2
```

This does not mean each observation typically differs by 2. The typical scale of one observation is still 10. What became smaller is the fluctuation of the average of 25 observations.

If the sample size becomes 100:

```text
SE = 10 / sqrt(100) = 1
```

The sample size became four times larger, and the standard error became half as large. This is the intuition behind many confidence-interval and testing formulas: more data does not remove variation from the world, but it makes the statistic more stable.

## Where This Shows Up in ML/AI

Model evaluation metrics are statistics. If you compute accuracy from 1,000 test examples and get 0.84, that 0.84 is a statistic from the test sample. If you switch to another test sample, the accuracy may change.

Average loss works the same way. During training, mini-batch loss estimates the full objective with a small sample. Smaller batches create noisier loss curves. Larger batches make the estimate more stable but cost more computation.

This is why benchmark reports need uncertainty information. A single score is a statistic, not a permanent label of model ability. Model comparison eventually needs confidence intervals, bootstrap, paired evaluation, or another way to handle sampling variation.

## Common Mistakes

Mistake 1: confusing the distribution of the original data with the sampling distribution of a statistic.

Mistake 2: saying standard error is the standard deviation of one observation.

Mistake 3: seeing iid and forgetting to inspect the data collection process.

Mistake 4: calling a sample statistic a population parameter.

Mistake 5: treating validation accuracy as the model's true ability instead of an estimate from one test set.

## Practice

1. Define sample, statistic, and sampling distribution in your own words.
2. Write what `X1, ..., Xn iid` means, then give one example that violates independence and one that violates identical distribution.
3. Given `sigma = 12` and `n = 36`, compute the standard error of `xbar`.
4. Use validation accuracy to explain why a metric is a statistic.

## Next

This post clarified the role of statistics. The next post looks more closely at sampling distributions: sample means, sample proportions, and sample variances each connect to different distributions, and exams use those results repeatedly.

## Section-Level Source Map

- OpenIntro and OpenStax: random samples, statistics, sampling distributions, and standard error.
- Stanford CS109: iid assumptions and derivations for the expectation and variance of the sample mean.
- scikit-learn: validation metrics as sample-based model evaluation.
- NTU IM prep pages: topic placement and practice-flow alignment; not used as official solutions.

## References

- [Random samples and sampling distributions in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: Sampling and Data](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109: Probability for Computer Scientists](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation: Metrics and Scoring](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
