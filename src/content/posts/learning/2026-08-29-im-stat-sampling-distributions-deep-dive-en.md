---
title: "How Do Sampling Distributions Become Exam-Ready Reasoning?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 22
tldr: "A sampling distribution describes how a statistic fluctuates under repeated sampling. Means, proportions, and variances each connect to common distributions used in intervals and tests."
description: "A deeper guide to sampling distributions: sample means, sample proportions, sample variances, chi-square, CLT, and uncertainty in model evaluation metrics."
draft: true
---

> [中文版](/posts/learning/2026-08-29-im-stat-sampling-distributions-deep-dive)

Many inference formulas seem to appear out of nowhere: mean confidence intervals, proportion tests, chi-square tests, and t tests. They are all answering one question: if we repeatedly sampled and computed the same statistic each time, how would that statistic behave?

A sampling distribution is not the distribution of the raw data in your hand. The raw-data distribution describes `Xi`. The sampling distribution describes how `xbar`, `phat`, or `s^2` moves across repeated samples.

Once this distinction is lost, standard error, p-values, and confidence intervals all become shaky.

## The Sampling Distribution of the Sample Mean

If `X1, ..., Xn` are iid and:

```text
E[Xi] = mu
Var(Xi) = sigma^2
```

then the sample mean:

```text
xbar = (X1 + ... + Xn) / n
```

has:

```text
E[xbar] = mu
Var(xbar) = sigma^2 / n
SE(xbar) = sigma / sqrt(n)
```

If the population is normal, `xbar` is also normal. If the population is not necessarily normal, the central limit theorem says `xbar` is approximately normal when the sample size is large enough. This is the reason many mean-inference problems can use z or t approximations.

## The Sampling Distribution of the Sample Proportion

Proportion problems can start from Bernoulli trials. Each observation is success or failure, with success probability `p`. The sample proportion is:

```text
phat = number of successes / n
```

Its expectation and variance are:

```text
E[phat] = p
Var(phat) = p(1 - p) / n
SE(phat) = sqrt(p(1 - p) / n)
```

In practice, `p` is unknown, so `phat` is often plugged in to estimate the standard error. When the sample is large enough, `phat` can be approximated by a normal distribution. Proportion confidence intervals and proportion tests usually rely on this sampling-distribution logic.

## Why Sample Variance Connects to Chi-Square

Means and proportions often use normal approximations. Sample variance connects to chi-square. If the population is normal, the sample variance `s^2` satisfies:

```text
((n - 1)s^2) / sigma^2 ~ chi-square(df = n - 1)
```

This result appears in variance inference. Its condition matters: the normal-population assumption is important. If a problem asks for an interval or test about variance, it usually states or implies that normal setting.

## Worked Example: How Much Can a Proportion Estimate Move?

Suppose a classifier's true future accuracy is `p = 0.6`, and each evaluation draws `n = 100` test items. The standard error of the sample accuracy `phat` is:

```text
SE = sqrt(0.6 * 0.4 / 100)
   = sqrt(0.0024)
   = 0.049
```

Even if the true accuracy is 0.6, observing 0.57 or 0.62 in one evaluation would not be surprising. Those numbers do not necessarily mean the model suddenly improved or declined; they may be ordinary sampling fluctuation.

If the sample size becomes 400:

```text
SE = sqrt(0.6 * 0.4 / 400)
   = sqrt(0.0006)
   = 0.0245
```

The sample size became four times larger, and the standard error became about half as large. Test-set size directly affects how trustworthy benchmark rankings are.

## Where This Shows Up in ML/AI

Model evaluation scores have sampling distributions. Accuracy, F1, win rate, average latency, and average human rating can all be viewed as statistics computed from test data. Change the test data and the statistic may change.

Small benchmarks especially need this idea. If two models differ by 1% on a small test set, the difference may sit inside sampling noise. If the same prompts are used for both models, paired evaluation or bootstrap may be more appropriate than subtracting two averages.

Sampling distributions also matter in monitoring. A production model's daily error rate may move because traffic volume is small, or because the model is drifting. Without a sampling-distribution view, alerts and noise are hard to separate.

## Common Mistakes

Mistake 1: treating the raw-data distribution as the sampling distribution of the statistic.

Mistake 2: saying only "more data is better" without explaining that standard error shrinks with `sqrt(n)`.

Mistake 3: using a mean formula for a proportion and forgetting `p(1 - p) / n`.

Mistake 4: using chi-square variance inference without noticing the normal-population assumption.

Mistake 5: reading model-score movement without first estimating natural variation from test-set size.

## Practice

1. If `p = 0.4` and `n = 100`, compute the standard error of `phat`.
2. Explain the difference between the sampling distribution of `xbar` and the raw distribution of `Xi`.
3. Write the population assumption needed when sample variance connects to a chi-square distribution.
4. Design a small-test-set accuracy example and explain how sampling distribution affects model ranking.

## Next

Sampling distributions let us describe how statistics fluctuate. The next post uses that foundation to compare estimator quality more formally: bias, variance, MSE, and consistency.

## Section-Level Source Map

- OpenIntro and OpenStax: sampling distributions of sample means, proportions, and variances.
- Stanford CS109: central limit theorem, repeated sampling, and standard error.
- scikit-learn: evaluation metrics, test-set size, and model-comparison context.
- NTU IM prep pages: topic placement and practice-flow alignment; not used as official solutions.

## References

- [Sampling distributions and standard error in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: The Central Limit Theorem](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109: Probability for Computer Scientists](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation: Metrics and Scoring](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [scikit-learn Cross-Validation and Model Selection](https://scikit-learn.org/stable/modules/cross_validation.html)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
