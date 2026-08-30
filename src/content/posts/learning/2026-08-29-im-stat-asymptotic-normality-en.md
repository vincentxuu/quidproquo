---
title: "Why Do Large-Sample Approximations Work, and When Do They Fail?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 30
tldr: "Large-sample normal approximation describes the behavior of estimators, not raw data. It is useful, but dependence, boundaries, and distribution shift can make it unreliable."
description: "A guide to asymptotic normality: sqrt(n) scaling, standard errors, large-sample intervals, failure modes, and uncertainty in large ML/AI evaluations."
draft: false
---

> [中文版](/posts/learning/2026-08-29-im-stat-asymptotic-normality)

Statistics exams often say, "when the sample size is large, use a normal approximation." That sentence is useful and dangerous. It unifies many formulas, but it also makes answers too confident when conditions are not checked.

Large-sample approximation matters because we cannot derive an exact distribution for every estimator, especially for MLEs, regression coefficients, proportion differences, and compound metrics. Asymptotic normality gives a shared language: after suitable scaling, estimation error often approaches a normal distribution as sample size grows.

But it describes the estimator, not a magical improvement in the raw data.

## What Becomes Normal?

A common statement is:

```text
sqrt(n)(theta_hat - theta) -> N(0, V)
```

There are three roles here.

`theta` is the population parameter: a true mean, true proportion, true regression coefficient, or another target.

`theta_hat` is the estimator computed from the sample. Different samples produce different values.

`sqrt(n)` is the scaling. Estimation error usually shrinks as sample size grows. Multiplying by `sqrt(n)` reveals a stable limiting shape.

So asymptotic normality does not say `Xi` becomes normal. The raw data can be skewed, discrete, or 0/1. The claim is about the sampling distribution of `theta_hat` in large samples.

## Why Standard Error Often Has sqrt(n)

The asymptotic statement can be read as:

```text
theta_hat approximately follows N(theta, V / n)
```

So:

```text
SE(theta_hat) approximately sqrt(V / n)
```

This is why making sample size four times larger cuts standard error roughly in half. More data helps, but not linearly.

That is useful in exam problems and experiment design. If you want standard error to fall from 0.04 to 0.02, you usually need about four times the sample size, not twice.

## Worked Example: From Asymptotic Variance to Standard Error

Suppose an estimator satisfies:

```text
sqrt(n)(theta_hat - theta) approximately follows N(0, 4)
```

The asymptotic variance constant is `V = 4`.

If `n = 100`, the approximate variance of `theta_hat` is:

```text
V / n = 4 / 100 = 0.04
```

The standard error is:

```text
SE(theta_hat) = sqrt(0.04) = 0.2
```

If `n = 400`:

```text
V / n = 4 / 400 = 0.01
SE(theta_hat) = sqrt(0.01) = 0.1
```

The key is reading the notation. The problem gave the limiting variance of `sqrt(n)(theta_hat - theta)`, not the variance of `theta_hat` itself. Divide by `n` before taking the square root.

## When Large-Sample Approximation Is Unstable

First, the sample may not be as large as it looks. `n = 30` is a teaching rule of thumb, not a guarantee. Heavy skew, thick tails, and strong outliers require larger samples.

Second, the data may not be iid. Many records from the same user, multiple answers generated from the same prompt, or samples nested inside the same company can make the apparent sample size much larger than the effective information.

Third, the parameter may be near a boundary. Proportions near 0 or 1, variance components near 0, and extreme classification metrics can make normal approximations produce unreasonable intervals.

Fourth, distribution shift can dominate sample size. A million examples from an old test set do not guarantee reliable estimates for new users, languages, or tasks.

## How to Recognize the Problem

If you see `sqrt(n)(estimate - parameter)`, the problem is usually asking about an asymptotic distribution.

If it asks how standard error changes when sample size changes, it is testing the `1 / sqrt(n)` rate.

If it gives `V`, `n`, and `theta_hat`, a common task is to build:

```text
theta_hat +/- z * sqrt(V / n)
```

If an interpretation is required, explicitly say the approximation is about the estimator, not each raw observation.

## Where This Shows Up in ML/AI

Large model evaluations often need fast uncertainty estimates. Average loss, accuracy, win rate, and average human rating can start with large-sample approximations.

For example, if an eval set has 10,000 items and a model accuracy of 71%, the proportion standard error can give a quick interval if item outcomes are close to independent Bernoulli trials. That helps judge whether 71.0% versus 71.4% is likely noise.

LLM evals often violate the independence assumption. Questions may come from the same templates, sources, or difficulty clusters. Model errors can also cluster. Treating item count as fully independent can underestimate standard error. Better reports may use stratified summaries, cluster bootstrap, or source-level reporting.

Large-sample approximation is a starting point, not permission to stop inspecting the data-generating process.

## Common Mistakes

Mistake 1: writing "the estimator is approximately normal" as "the raw data are approximately normal."

Mistake 2: receiving the variance of `sqrt(n)(theta_hat - theta)` and forgetting to divide by `n`.

Mistake 3: ignoring dependence, clustering, and distribution shift because the sample size is large.

Mistake 4: assuming doubling `n` halves standard error.

Mistake 5: treating test-item count as the only source of uncertainty in model evaluation.

## Practice

1. Explain what quantity `sqrt(n)(theta_hat - theta)` describes.
2. If the limiting variance of `sqrt(n)(theta_hat - theta)` is 9 and `n = 225`, what is the approximate standard error of `theta_hat`?
3. If sample size grows from 1,000 to 4,000, what happens to standard error?
4. An LLM eval has 20,000 items generated from 200 templates, with 100 items per template. Why should you hesitate before treating 20,000 as fully independent?

## Next

Large-sample approximation lets many estimators use normal language. The next post applies that idea to nonlinear targets: when you report `log(theta)`, ratios, or F1, the delta method tracks how uncertainty transforms.

## Section-Level Source Map

- OpenIntro, OpenStax, and Stanford CS109: CLT, sampling distributions, and large-sample approximation foundations.
- This post focuses on asymptotic distributions of estimators, not raw-data distributions.
- scikit-learn: model-evaluation metrics and the assumptions behind large evaluation sets.
- NTU IM prep pages: topic placement and practice-flow alignment; not used as official solutions.

## References

- [Asymptotic normality and sampling distributions in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
