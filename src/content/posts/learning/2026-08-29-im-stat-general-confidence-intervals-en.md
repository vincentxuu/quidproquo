---
title: "Confidence Intervals Are More Than t-Tables: What Is the General Construction?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 29
tldr: "A confidence interval is built by defining the target estimate, describing its sampling error, and choosing a rule that turns uncertainty into a range."
description: "A guide to general confidence-interval construction: estimates, standard errors, coverage, test inversion, likelihood intervals, bootstrap, and ML/AI metric intervals."
draft: true
---

> [中文版](/posts/learning/2026-08-29-im-stat-general-confidence-intervals)

Earlier posts built confidence intervals for means, proportions, and regression coefficients. At the beginning, it is natural to think a confidence interval means "find the formula, look up the t table, substitute numbers." That can work for a narrow mean problem, but it breaks once the target becomes an odds ratio, prediction error, accuracy, or bootstrap interval.

This post pulls confidence intervals back into a general frame. Ask three questions: what quantity are we estimating, how does that estimator fluctuate, and what method turns that fluctuation into an interval?

## What the General Form Is Doing

The most common confidence interval has the form:

```text
estimate +/- critical value * standard error
```

The `estimate` is the number computed from the sample: a sample mean, sample proportion, regression coefficient, or model accuracy.

The `standard error` describes how much that estimate would move under repeated sampling. It is the standard deviation of the estimator, not the spread of raw observations. A sample mean's standard error gets smaller as sample size grows because the average becomes more stable.

The `critical value` controls how wide the interval is. A 95% interval often uses 1.96 because the middle 95% of a standard normal distribution lies roughly between -1.96 and 1.96. For small-sample means with unknown variance, t critical values are used instead.

So do not start by searching for a formula table. Start by asking what the estimator is, where its standard error comes from, and whether the approximation or resampling method is justified.

## Coverage Is a Long-Run Property

The most common bad sentence is: "This interval has a 95% probability of containing the true value."

In frequentist language, the parameter is fixed and the interval is random before the sample is observed. A more accurate statement is: if we repeatedly sample and build intervals using the same procedure, about 95% of those intervals will cover the true parameter.

For an already computed interval, the true value either lies inside it or does not. The 95% describes the procedure's long-run coverage.

This matters in ML reporting too. You should not write "Model A has a 95% probability of beating Model B" unless you are using a framework that supports that probability interpretation. A standard confidence interval reports long-run behavior of an estimation procedure.

## Four Common Construction Routes

The first route is standard error plus critical value. Means, proportions, large-sample estimators, and regression coefficients often use this form.

The second route is test inversion. Test each possible parameter value; the values not rejected form a confidence interval. This connects tests and intervals: if a 95% interval excludes 0, a two-sided 5% test of 0 is often rejected.

The third route is likelihood-based intervals. Instead of relying only on a normal approximation, you inspect which parameter values have likelihood close enough to the maximum likelihood. This becomes useful in MLE, GLMs, and profile likelihood.

The fourth route is bootstrap intervals. When the exact sampling distribution is hard to derive, resampling can approximate how the estimator fluctuates.

All four routes share the same core: define the target, describe estimation error, then choose an interval rule.

## Worked Example: Approximate Interval for Model Accuracy

Suppose a classifier answers 328 out of 400 test items correctly. The sample accuracy is:

```text
p_hat = 328 / 400 = 0.82
```

If we temporarily treat each test item as an independent Bernoulli outcome, the standard error is:

```text
SE(p_hat) = sqrt(p_hat(1 - p_hat) / n)
          = sqrt(0.82 * 0.18 / 400)
          = sqrt(0.000369)
          = 0.0192
```

Using the standard normal 95% critical value 1.96:

```text
0.82 +/- 1.96 * 0.0192
= 0.82 +/- 0.0376
= (0.7824, 0.8576)
```

A careful report says:

Under the iid Bernoulli approximation and large-sample conditions, the 95% confidence interval for accuracy is about 78.2% to 85.8%.

That sentence keeps the assumptions visible. If the 400 items are highly correlated, the standard error may be too small. If the test set does not represent production data, a narrow interval still cannot guarantee deployment performance.

## How to Recognize the Problem

If the problem gives an estimate, standard error, and approximate distribution, it likely wants:

```text
estimate +/- critical value * SE
```

If the problem asks about the relationship between confidence intervals and hypothesis tests, explain whether the interval contains the null value.

If the prompt says unknown distribution, resampling, percentile, or bootstrap standard error, the method has moved toward bootstrap. Name the resampling unit.

If the prompt includes likelihood, profile, or nested models, an interval may come from likelihood or LRT logic rather than a mean t interval.

## Where This Shows Up in ML/AI

ML/AI evaluation often reports single numbers: accuracy 82%, win rate 56%, latency 420 ms. Single numbers look clean, but they hide test-set size, data variation, and sampling error.

Confidence intervals turn evaluation from a leaderboard into inference. If two models have accuracies 82% and 84%, the two-point gap is not enough by itself. If intervals overlap heavily, or a paired bootstrap shows the difference often changes sign, the report should not call it a stable improvement.

LLM evaluation has the same issue. Human preference, rubric score, pass@k, and win rate all come from finite test sets. A confidence interval is not decoration. It is how the report admits that the benchmark is a sample.

## Common Mistakes

Mistake 1: saying a 95% confidence interval means the fixed truth has 95% probability of lying inside this already computed interval.

Mistake 2: reporting endpoints without naming the estimate, standard error, critical value, and assumptions.

Mistake 3: confusing sample standard deviation with standard error.

Mistake 4: applying a t interval to every problem without checking the parameter, sample size, or method conditions.

Mistake 5: comparing two model point estimates without measuring uncertainty in the gap.

## Practice

1. A model answers 765 out of 900 test items correctly. Use the proportion standard error to build a 95% confidence interval and write a full interpretation.
2. Explain the difference between sample standard deviation and standard error of the mean.
3. An odds-ratio confidence interval is `(0.9, 1.8)`. For a two-sided 5% test of odds ratio = 1, would you usually reject? Why?
4. Two model win rates are 53% and 56%. What information would you ask for before deciding whether 56% is a real improvement?

## Next

This post framed confidence intervals as estimator, standard error, and interval rule. The next post examines one of the most useful and misused tools behind that frame: large-sample approximation.

## Section-Level Source Map

- OpenIntro and OpenStax: confidence intervals, t distribution, standard error, and coverage interpretation.
- Stanford CS109: repeated sampling and standard-error intuition.
- scikit-learn: ML/AI metric reporting and model-evaluation context.
- NTU IM prep pages: topic placement and practice-flow alignment; not used as official solutions.

## References

- [Confidence intervals in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
