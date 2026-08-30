---
title: "How Does Fisher Information Tell You Whether a Parameter Is Stable?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 26
tldr: "Fisher information uses likelihood curvature to measure how well the data locate a parameter; larger information usually means a smaller standard error for the MLE."
description: "A beginner guide to Fisher information: score, curvature, observed information, standard error, Wald intervals, ML uncertainty, and natural gradient intuition."
draft: false
---

> [中文版](/posts/learning/2026-08-29-im-stat-fisher-information-standard-error)

MLE finds the parameter that makes the data most plausible. The next question is immediate: how stable is that estimate?

If the likelihood is sharp near its maximum, moving the parameter a little makes the data look much less plausible. The estimate is usually more precise. If the likelihood is flat near the maximum, many nearby parameter values look almost equally plausible. The estimate is less stable.

Fisher information measures this shape. It turns likelihood curvature into a number, moving from "what is the estimate?" to "how uncertain is the estimate?"

## Think of Log Likelihood as a Hill

Imagine log likelihood as a hill. The peak is the MLE. If the peak is sharp, log likelihood drops quickly when you move away from the estimate. The data give a strong signal about where the parameter should be. If the peak is flat, nearby parameter values look similar, and the data do not locate the parameter clearly.

In a one-parameter setting, observed information is commonly written as the negative second derivative at the estimate:

```text
J(theta_hat) = - d^2 ell(theta) / d theta^2 evaluated at theta_hat
```

The negative sign appears because the second derivative near a maximum is usually negative. Taking the negative turns curvature into a positive information measure.

Under regularity conditions, the large-sample variance of the MLE is approximately:

```text
Var(theta_hat) = 1 / I(theta)
```

So the standard error is approximately:

```text
SE(theta_hat) = 1 / sqrt(I(theta_hat))
```

For multiple parameters, this becomes an information matrix. Standard errors come from the diagonal of the inverse matrix, not from a single reciprocal.

## Worked Example: From Observed Information to Standard Error

Suppose the observed information for one parameter at the estimate is:

```text
J(theta_hat) = 25
```

The standard error is approximately:

```text
SE(theta_hat) = 1 / sqrt(25) = 0.2
```

If the estimate is:

```text
theta_hat = 1.4
```

a rough Wald 95% interval is:

```text
1.4 +/- 1.96 * 0.2
= 1.4 +/- 0.392
= [1.008, 1.792]
```

A contextual answer is:

Under the large-sample approximation and model assumptions, the estimate 1.4 has standard error about 0.2, giving a rough 95% Wald interval from 1.008 to 1.792.

Exams may only ask you to compute standard error from information, but you should also know the intuition: information 25 means sharper curvature than information 4, and sharper curvature means a smaller standard error.

## Score, Information, and Curvature

If the log likelihood is `ell(theta)`, the first derivative is the score:

```text
score = d ell(theta) / d theta
```

At an interior MLE, the score is usually 0 because the peak has slope 0. The second derivative describes curvature. Fisher information can be expressed through the variance of the score or the expected negative second derivative.

For a first pass, keep the direction clear: Fisher information measures how sensitive the data likelihood is to parameter movement.

Large information means a small change in the parameter changes likelihood noticeably. Small information means different parameter values produce similar data behavior, so the data struggle to distinguish them.

## Where This Shows Up in ML/AI

Large neural networks rarely compute the full Fisher information matrix because there are too many parameters. The concept still matters.

First, uncertainty estimation. You may not only want a coefficient or parameter value; you may want to know whether it is stable. Linear models, logistic regression, and generalized linear models often use related ideas to estimate coefficient standard errors.

Second, natural gradient. Ordinary gradient methods look for a direction that lowers loss in parameter space. Natural gradient also considers how sensitive the model distribution is to parameter changes. Fisher information is part of that geometry.

Third, identifiability. If different parameter settings produce similar outputs, the data cannot clearly tell which parameter is right. That makes estimates unstable and makes coefficient interpretation risky.

## Common Mistakes

Mistake 1: interpreting larger information as only "more data." More data often increases information, but model structure and data distribution matter too.

Mistake 2: forgetting the inverse relationship between information and standard error.

Mistake 3: mixing observed information, expected Fisher information, and information matrix without naming which one is used.

Mistake 4: applying the one-parameter reciprocal formula to a multi-parameter problem and ignoring covariance.

Mistake 5: reporting only point estimates in ML without discussing parameter or prediction uncertainty.

## Practice

1. If observed information is 16, what is the approximate standard error?
2. Explain in one sentence why larger likelihood curvature usually means smaller standard error.
3. Distinguish one-parameter information from a multi-parameter information matrix.
4. Write an ML/AI scenario involving learned-parameter uncertainty, such as logistic-regression coefficients or a calibrated classifier.

## Next

Fisher information connects likelihood to standard error. The next post uses likelihood to compare models directly: the Likelihood Ratio Test asks whether the full model improves enough over a restricted model to justify its added flexibility.

## Section-Level Source Map

- OpenIntro and OpenStax: standard error, Wald intervals, and likelihood-based inference foundations.
- Stanford CS109: likelihood curvature, score, and parameter-uncertainty intuition.
- scikit-learn: logistic-regression coefficients, calibration, and uncertainty-reporting contexts.
- NTU IM prep pages: topic placement and practice-flow alignment; not used as official solutions.

## References

- [Fisher information and likelihood inference in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: Confidence Intervals and Standard Error](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109: Probability for Computer Scientists](https://cs109.stanford.edu/)
- [scikit-learn Linear Models: Logistic Regression](https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression)
- [scikit-learn Probability Calibration](https://scikit-learn.org/stable/modules/calibration.html)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
