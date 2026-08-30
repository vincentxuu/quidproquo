---
title: "How Does the Delta Method Estimate Uncertainty for F1 and Ratio Metrics?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 31
tldr: "The delta method transfers uncertainty through a smooth function: the local derivative expands or shrinks the estimator's original standard error."
description: "A guide to the delta method: tangent approximation, transformed standard errors, log-scale intervals, gradients, covariance matrices, and uncertainty for F1 or ratio metrics."
draft: true
---

> [中文版](/posts/learning/2026-08-29-im-stat-delta-method)

Many statistics are easy to estimate, but the quantity you want to report is often a function of them. You may estimate a proportion and report log odds, estimate two means and report a ratio, or compute precision and recall and report F1.

The delta method answers this question: if we already understand the uncertainty of `theta_hat`, how can we approximate the uncertainty of `g(theta_hat)`?

In exams, it often appears as a formula derivation. In ML/AI reports, it appears whenever a metric is a nonlinear transformation of simpler estimates. The core idea is local slope: near the estimate, the function's derivative magnifies or shrinks the original uncertainty.

## Start With a Tangent Approximation

Suppose `theta_hat` fluctuates slightly around `theta`. If `g` is smooth near that value, use a first-order approximation:

```text
g(theta_hat) approximately g(theta) + g'(theta)(theta_hat - theta)
```

If `theta_hat` moves a little, `g(theta_hat)` moves by roughly that amount multiplied by the local slope `g'(theta)`.

If:

```text
theta_hat approximately follows N(theta, Var(theta_hat))
```

then:

```text
g(theta_hat) approximately follows N(g(theta), [g'(theta)]^2 Var(theta_hat))
```

The standard-error form is often easier to remember:

```text
SE(g(theta_hat)) approximately |g'(theta_hat)| * SE(theta_hat)
```

In practice, the unknown `theta` is replaced by the estimate `theta_hat`.

## Worked Example: Standard Error After a Log Transform

Suppose:

```text
theta_hat = 0.25
SE(theta_hat) = 0.04
```

You want to report:

```text
g(theta) = log(theta)
```

The derivative is:

```text
g'(theta) = 1 / theta
```

Plug in `theta_hat = 0.25`:

```text
g'(theta_hat) = 1 / 0.25 = 4
```

So:

```text
SE(log(theta_hat)) approximately |4| * 0.04 = 0.16
```

For a 95% approximate interval, first work on the log scale:

```text
log(0.25) +/- 1.96 * 0.16
```

If you need the original scale, exponentiate the endpoints. Many ratio and odds-ratio intervals are built on the log scale because that scale is closer to normal and avoids negative lower bounds.

## Multi-Parameter Version: Gradient and Covariance

In one dimension, there is one derivative. With multiple parameters, `theta` becomes a vector and the derivative becomes a gradient.

Suppose:

```text
theta_hat = (theta_hat1, theta_hat2)
```

and the target is:

```text
g(theta1, theta2)
```

The delta-method approximation is:

```text
Var(g(theta_hat)) approximately gradient(g)' * Cov(theta_hat) * gradient(g)
```

The intuition is the same: uncertainty in each direction is weighted by the function's slope in that direction. If the estimates have covariance, that covariance affects the result too.

F1 is close to this situation. It is a function of precision and recall. Precision and recall often come from the same confusion matrix, so they move together. A serious standard error for F1 cannot simply treat them as two unrelated numbers.

## When Delta Method Is Risky

First, the function may be too curved near the estimate. Delta method uses a tangent line. If the estimator's fluctuation range spans a highly curved region, the approximation can fail.

Second, the estimate may be near a boundary. When a proportion is close to 0, the derivative of `log(theta)` is large. A small estimation error can be greatly amplified.

Third, the derivative may be near 0. Then a first-order approximation may miss the main variation, and a second-order delta method or another method may be needed.

Fourth, the sample may not be large enough. Delta method often sits on top of large-sample approximation. If the earlier approximation is poor, the transformed approximation will not be reliable.

In practice, bootstrap or simulation may be better when the formula approximation is fragile.

## How to Recognize the Problem

If a problem includes `g(theta_hat)`, `log(theta_hat)`, `exp(beta_hat)`, a ratio, or an odds ratio, ask whether the delta method is intended.

For a one-parameter problem, use three steps:

```text
identify g
compute g'
plug in theta_hat and SE(theta_hat)
```

For a multi-parameter problem, write the gradient and check whether a covariance matrix is given. If two estimates come from the same data, do not assume independence without justification.

## Where This Shows Up in ML/AI

ML/AI evaluation uses many derived metrics. F1 combines precision and recall. Relative improvement is a ratio of scores. Calibration error is a function of binned errors. Odds ratios appear in logistic-regression interpretation.

If you report only the standard error of the raw estimate, you can miss the extra uncertainty from the nonlinear transformation. A model's error rate falling from 0.02 to 0.01 sounds like a 50% improvement, but the uncertainty of relative improvement can be large because the denominator is small.

The delta method lets you say: this metric is not directly observed; its interval is approximated by propagating uncertainty from the base estimates.

## Common Mistakes

Mistake 1: forgetting the derivative and copying the original standard error to the transformed scale.

Mistake 2: putting the square in the wrong place. Variance uses `[g']^2`; standard error uses `|g'|`.

Mistake 3: building a log-scale interval but forgetting to exponentiate endpoints when returning to the original scale.

Mistake 4: ignoring covariance in multi-parameter problems.

Mistake 5: treating a first-order approximation as stable when the estimate is near 0, 1, or another boundary.

## Practice

1. If `g(theta) = log(theta)`, `theta_hat = 0.5`, and `SE(theta_hat) = 0.1`, estimate `SE(g(theta_hat))`.
2. If `g(theta) = exp(theta)`, `theta_hat = 0.7`, and `SE(theta_hat) = 0.2`, estimate `SE(exp(theta_hat))`.
3. Explain why odds-ratio intervals are often computed on the log odds-ratio scale first.
4. F1 is a function of precision and recall. If both come from one confusion matrix, why does the multi-parameter delta method need covariance?

## Next

Delta method uses smooth functions and large-sample approximation. The next post takes another route: when formula derivation is inconvenient, bootstrap resamples the data to approximate the sampling distribution directly.

## Section-Level Source Map

- OpenIntro and OpenStax: standard error and confidence-interval foundations.
- Stanford CS109: random-variable transformations and approximation intuition.
- scikit-learn: F1, precision, recall, and model-evaluation metrics.
- NTU IM prep pages: topic placement and practice-flow alignment; not used as official solutions.

## References

- [Delta method context in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
