---
title: "When the Formula Distribution Is Unknown, How Does Bootstrap Estimate Uncertainty?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 32
tldr: "Bootstrap estimates uncertainty by resampling from the observed sample with replacement, rebuilding many sample-like datasets, and watching the statistic fluctuate."
description: "A guide to bootstrap: resampling with replacement, percentile intervals, paired bootstrap, cluster bootstrap, and uncertainty estimation for ML/AI metrics."
draft: false
---

> [中文版](/posts/learning/2026-08-29-im-stat-bootstrap)

Some statistics are easy to compute but hard to derive distributions for. Means have familiar standard-error formulas. Medians, F1, model win rate, score differences, and complex ratios are often less convenient.

Bootstrap takes a pragmatic route. If we do not know how the statistic would fluctuate under repeated sampling, we repeatedly resample from the observed data, create many sample-like datasets, and compute the statistic again.

Learn bootstrap as a procedure, not as the phrase "sample 1,000 times." You need to identify the resampling unit, explain why sampling is with replacement, build intervals from the resampled statistics, and avoid breaking the data structure.

## Why Resample With Replacement?

Bootstrap treats the observed sample as a stand-in for the population. If the original sample has `n` observations, draw `n` observations from it with replacement to form one bootstrap sample.

With replacement matters. Some observations appear multiple times; some do not appear. This mimics the way a new sample from the population might contain a different composition.

After each resample, recompute the statistic of interest, called `T*`. After repeating this `B` times, you have:

```text
T*_1, T*_2, ..., T*_B
```

This sequence approximates the sampling distribution. You can use its standard deviation as a bootstrap standard error, or use its quantiles for a percentile interval.

## Basic Bootstrap Workflow

The workflow has four steps.

First, choose the resampling unit. Is it a user, item, transaction, company, article, or paired comparison unit? This step is often the most important.

Second, sample with replacement from the original sample to create a new sample of the same size.

Third, recompute the statistic on the bootstrap sample.

Fourth, repeat many times and use the bootstrap distribution to estimate standard error or a confidence interval.

In symbols:

```text
Original sample: x1, x2, ..., xn
Bootstrap sample b: x*_1, x*_2, ..., x*_n
Statistic: T*_b = T(x*_1, ..., x*_n)
Repeat b = 1, ..., B
```

## Worked Example: Percentile Bootstrap Interval

Suppose you evaluate a model's accuracy on 200 test items. Treat each test item as the resampling unit. Each bootstrap sample draws 200 items with replacement, recomputes accuracy, and repeats this process `B = 1000` times.

After sorting the 1,000 bootstrap accuracies, suppose the 25th value is 0.78 and the 975th value is 0.86. A 95% percentile interval is:

```text
(0.78, 0.86)
```

The 25th and 975th values correspond to the 2.5% and 97.5% quantiles.

A careful report says:

Using test item as the resampling unit and 1,000 percentile-bootstrap resamples, the 95% interval for accuracy is about 78% to 86%.

The phrase "test item as the resampling unit" is not decoration. If the resampling unit is wrong, the interval is wrong.

## Paired Bootstrap: Do Not Break Model Comparisons

Model comparisons often need paired bootstrap. Suppose Model A and Model B answer the same 200 test items. You care about the item-level difference:

```text
d_i = score_A_i - score_B_i
```

The resampling unit should be the item. When an item is sampled, bring both A's and B's result on that item. Then recompute the average difference.

Do not resample A's 200 scores and B's 200 scores separately. That destroys the paired structure and loses the shared difficulty of each item.

LLM evaluations commonly use paired designs because the same prompt may be easy or difficult for both models. Preserving pairs makes the comparison more faithful to the experiment.

## Cluster Bootstrap: Resample Groups When Data Are Grouped

If data are grouped, the resampling unit may not be a row.

For example, an evaluation set has 1,000 support-chat messages from 100 users, 10 messages each. If messages from the same user share style and context, treating all 1,000 messages as independent rows underestimates uncertainty.

A better design may resample users, then include all messages from sampled users. This is a cluster bootstrap.

Even if an exam does not require the term, the principle matters: bootstrap does not mean shuffling rows blindly. The resampling unit should match the data-generating process.

## What Bootstrap Cannot Fix

Bootstrap can approximate sampling fluctuation, but it cannot repair bias in the original sample.

If the test set misses long-tail cases, contains only English questions, or comes from one benchmark template, bootstrap will resample from that biased sample. It will not invent the missing production distribution.

Bootstrap also does not guarantee reliability in tiny samples. If the original sample is too small to be a useful stand-in for the population, the bootstrap distribution may look precise while still being misleading.

## How to Recognize the Problem

If you see resampling, with replacement, percentile interval, or bootstrap standard error, write the procedure.

If the task asks for an interval, a common answer is to sort bootstrap statistics and take quantiles.

If the task compares two models, before/after measurements, or the same person measured twice, check whether paired bootstrap is needed.

If the data include users, classes, companies, hospitals, or sources, consider whether the bootstrap should resample clusters instead of rows.

## Where This Shows Up in ML/AI

Bootstrap is useful in ML/AI evaluation when metric distributions are hard to derive. F1, win rate, average human score, pass@k, and latency percentiles can all be resampled.

For LLM model comparison, use paired bootstrap over test items. Each resample gives a new average score difference between Model A and Model B. The resulting distribution can show how often the gap falls below 0, or provide a percentile interval for the gap.

In product A/B testing, if users are the experimental units, resample users. If the same user generates many events, resampling events directly inflates the effective sample size.

Bootstrap is intuitive, flexible, and easy to implement. Its weakness is equally clear: it inherits the original sample's bias and gives wrong precision when the resampling unit is wrong.

## Common Mistakes

Mistake 1: saying bootstrap recollects new data. It resamples inside the existing sample.

Mistake 2: forgetting replacement and only shuffling the original observations.

Mistake 3: breaking paired structure when comparing two models.

Mistake 4: resampling rows in grouped data and underestimating standard error.

Mistake 5: reporting a precise bootstrap interval without discussing whether the original sample represents the real task.

## Practice

1. Write the full workflow for `B = 1000` bootstrap resamples and name the resampling unit.
2. If the sorted bootstrap statistics have 25th and 975th values 0.78 and 0.86, write the 95% percentile interval and an interpretation.
3. Models A and B answer the same test items. Explain how paired bootstrap resamples and why the scores should not be separated.
4. An eval set has 50 users with 20 records each. How would you bootstrap the mean satisfaction score?

## Next

Bootstrap estimates uncertainty when formulas are inconvenient. The next post moves to Bayesian inference, where prior information, data, and posterior belief are combined in one probability-updating language.

## Section-Level Source Map

- OpenIntro and OpenStax: resampling, sampling distributions, and interval estimation.
- Stanford CS109: simulation-based uncertainty and bootstrap intuition.
- scikit-learn: model-evaluation metrics and resampling-style evaluation contexts.
- NTU IM prep pages: topic placement and practice-flow alignment; not used as official solutions.

## References

- [Bootstrap and resampling in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
