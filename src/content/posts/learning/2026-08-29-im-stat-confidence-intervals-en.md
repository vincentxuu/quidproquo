---
title: "How Do You Write Confidence Intervals Without Only Memorizing Bounds?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 9
tldr: "A confidence interval puts a point estimate back inside sampling fluctuation. Computing bounds is only the first step; you also need to explain standard error, critical values, and coverage."
description: "A beginner guide to confidence intervals: mean t intervals, proportion intervals, correct interpretation, and uncertainty reports for model accuracy."
draft: false
---

> [中文版](/posts/learning/2026-08-29-im-stat-confidence-intervals)

Many beginners learn confidence intervals as a formula: write the sample mean, attach a plus-minus sign, look up a table value, and report two endpoints. That can get partial credit, but it does not mean you understand the topic.

A confidence interval is a way to keep an estimate honest. A sample mean, sample proportion, or model accuracy is only one result from one sample. If a different sample had been drawn, the estimate would move. The interval shows a plausible range after accounting for that sampling fluctuation.

The important part is not only the arithmetic. You need to know what the center is, what the standard error measures, where the critical value comes from, and what the final sentence is allowed to say.

## First See the Three Parts of an Interval

Most confidence intervals can be read as:

```text
estimate +/- critical value * standard error
```

The estimate is the center. For a population mean, it is usually `xbar`. For a population proportion, it is usually `phat`. This is the best single-number guess you have from the sample.

The standard error describes how much that estimate would fluctuate across repeated samples. It is not the same as the sample standard deviation. The sample standard deviation describes spread among observations; the standard error describes uncertainty in the estimate.

The critical value controls how wide the interval needs to be for a chosen confidence level. A 95% interval is wider than a 90% interval because it asks for a procedure that captures the true parameter more often in repeated sampling.

For a mean, the common exam split is:

```text
sigma known:     xbar +/- z* sigma / sqrt(n)
sigma unknown:   xbar +/- t* s / sqrt(n)
```

In most realistic problems, the population standard deviation `sigma` is unknown, so the t distribution is the natural default for a mean interval. For a proportion, the common large-sample approximation is:

```text
phat +/- z* sqrt(phat(1 - phat) / n)
```

The formula is not the starting point. The starting point is the question: what parameter are you estimating, and how unstable is the estimate?

## Worked Example: A t Confidence Interval for a Mean

Suppose a sample has:

```text
n = 25
xbar = 82
s = 10
confidence level = 95%
```

Because the population standard deviation is not given, use a t interval. The degrees of freedom are:

```text
df = n - 1 = 24
```

The standard error is:

```text
SE = s / sqrt(n) = 10 / sqrt(25) = 2
```

For a 95% t interval with `df = 24`, the critical value is about:

```text
t* = 2.064
```

The margin of error is:

```text
margin = 2.064 * 2 = 4.128
```

So the interval is:

```text
82 +/- 4.128 = [77.872, 86.128]
```

A good interpretation is:

We are 95% confident that the population mean is between 77.872 and 86.128, where "95%" refers to the long-run coverage of this interval-making procedure.

The sentence to avoid is: "There is a 95% probability that the true mean is inside this interval." In frequentist inference, the parameter is fixed; the interval is random before we collect the data.

This distinction may feel philosophical at first, but it matters in exams. Many questions give points for interpreting the interval, not just computing it.

## How to Recognize the Problem

Confidence-interval questions often use words like estimate, interval, margin of error, confidence level, or plausible range. They usually do not ask whether to reject a hypothesis. They ask you to quantify uncertainty around an estimate.

First classify the parameter:

```text
mean            -> xbar interval
proportion      -> phat interval
difference      -> two-sample interval
variance        -> chi-square based interval, if covered
```

Then check the information given. If the question is about a mean and gives population `sigma`, a z interval may be intended. If it gives sample `s`, use a t interval unless the problem states otherwise. If the question is about a proportion, check whether the sample is large enough for the normal approximation.

Do not jump straight from "95%" to `1.96`. That is only one possible critical value. The reference distribution depends on the statistic and assumptions.

## Where This Shows Up in ML/AI

ML evaluation often reports one number: accuracy, F1, AUC, average latency, or win rate. Those numbers are estimates from a finite validation set or benchmark. A confidence interval asks whether the reported number is stable enough to trust.

Suppose a model answers 168 out of 200 validation questions correctly:

```text
phat = 168 / 200 = 0.84
SE = sqrt(0.84 * 0.16 / 200) = 0.026
```

Using the rough 95% normal approximation:

```text
0.84 +/- 1.96 * 0.026 = [0.789, 0.891]
```

If another model reports accuracy `0.86` on a similar-sized set, the difference between `0.84` and `0.86` is not automatically meaningful. You need the uncertainty, the evaluation design, whether the models were tested on the same items, and whether the benchmark represents the target population.

This is why a leaderboard without intervals can be misleading. The top score may be higher, but the statistical question is whether the gap is larger than the noise in the evaluation process.

## Common Mistakes

Mistake 1: treating the sample standard deviation as the standard error. The standard deviation describes individual observations; the standard error describes the estimate.

Mistake 2: using `z = 1.96` for every 95% interval. Mean intervals with unknown `sigma` usually use t, and small samples need extra care.

Mistake 3: writing a probability statement about the fixed parameter. For a standard frequentist interval, the confidence level describes the method's repeated-sampling coverage.

Mistake 4: comparing two point estimates without comparing their uncertainty. In ML/AI evaluation, a difference like `0.86` versus `0.84` is not enough by itself.

## Practice

1. Build a 95% t confidence interval with `xbar = 70`, `s = 8`, and `n = 16`. Write the standard error, critical value source, margin of error, and interval.
2. Repeat the same setup with `n = 64`. Explain why the interval becomes narrower.
3. Write one correct confidence-interval interpretation and one incorrect interpretation.
4. A model gets 450 correct answers out of 500. Compute a rough 95% interval for accuracy and explain what it does and does not prove.

## Next

Confidence intervals ask "what range of values is plausible?" The next post moves to hypothesis testing, where the question becomes "is this sample evidence strong enough to reject a specific baseline claim?"

## Section-Level Source Map

- OpenIntro and OpenStax: confidence intervals for means and proportions, standard errors, critical values, and interpretation limits.
- Stanford CS109: sampling variation and uncertainty around estimates.
- scikit-learn: model-evaluation metrics and the need to interpret validation scores as estimates.
- NTU IM prep pages: topic placement and practice-flow alignment; not used as official solutions.

## References

- [Confidence intervals in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: Confidence Intervals](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
