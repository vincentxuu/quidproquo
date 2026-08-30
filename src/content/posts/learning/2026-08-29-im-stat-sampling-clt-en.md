---
title: "Why Can a Sample Say Something About a Population or Model?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 8
tldr: "Sampling makes sample statistics fluctuate, and standard error describes that fluctuation. This post separates SD, SE, sampling distributions, and CLT, then connects them to benchmark uncertainty."
description: "A beginner guide to sampling, standard error, and the central limit theorem: how sample means fluctuate, how SD differs from SE, and why ML/AI benchmark scores need uncertainty."
draft: true
---

> [中文版](/posts/learning/2026-08-29-im-stat-sampling-clt)

The most important move in statistics is moving from a sample to a population. You only have one class of students, one survey, one batch of test items, or one benchmark result. The question usually asks about something larger: long-run average, all users, future data, or true model capability.

You cannot make that jump by intuition alone. Sample results fluctuate. The 100 test items you sample today may be easier or harder than the 100 items you sample tomorrow. The people who respond to one survey may differ from the next group of respondents. Sampling, standard error, and the central limit theorem handle that distance.

The most common beginner confusion is standard deviation versus standard error. Standard deviation describes how spread out the original data points are. Standard error describes how unstable a statistic is. If you cannot separate them, confidence intervals and hypothesis tests will also go wrong.

## The Sample Mean Is Also a Random Variable

Many learners treat the sample mean as fixed once it is computed. For the sample already collected, it is fixed. From the sampling perspective, the sample mean changes when the sample changes.

Suppose the population is all possible tasks of the same kind, and you sample 100 items to evaluate a model. This time the accuracy is 0.82. With another 100 items, it might be 0.79 or 0.85. Every sample produces a sample accuracy.

The distribution of these sample statistics is the sampling distribution. Confidence intervals and tests are really about the sampling distribution of a sample mean, sample proportion, model score, or other statistic.

## The Difference Between SD and SE

Standard deviation, SD, describes the spread of individual data points. If student scores have SD 12, individual scores fluctuate around the mean at a scale of about 12.

Standard error, SE, describes the spread of a statistic. If the SE of the sample mean is 2, different sample means fluctuate around the population mean at a scale of about 2.

Those statements are different. A large SD does not automatically make the sample mean very inaccurate. With a large enough sample, the average can become stable. A common formula is:

```text
SE(xbar) = sigma / sqrt(n)
```

As sample size `n` grows, `sqrt(n)` grows, and the SE shrinks. That is why large-sample averages are usually more stable than small-sample averages.

## What CLT Says

The central limit theorem is often simplified as "with enough data, things become Normal." That wording is too rough.

A more accurate statement is: under suitable conditions, as sample size grows, the distribution of the sample mean approaches a Normal distribution, even when the raw data is not perfectly Normal.

The main character is the sample mean, not every raw observation. The raw data may be skewed, discrete, or not Normal. CLT describes the shape you see when many sample means are considered together. If you miss that point, you will use Normal approximation in places where it does not belong.

The practical use of CLT is that it lets us approximate uncertainty around averages. The `z` values in confidence intervals and many approximate hypothesis tests rest on this idea.

## A Standard Error Example

Suppose the population standard deviation of exam scores is about 12. You sample 36 students and get a sample mean of 78. What is the standard error of the sample mean?

Use:

```text
SE(xbar) = sigma / sqrt(n)
```

Substitute `sigma=12` and `n=36`:

```text
SE = 12 / sqrt(36) = 12 / 6 = 2
```

The 2 does not mean individual student scores vary by only 2. Individual scores are still described by SD 12. SE 2 says that if you repeatedly sampled 36 students and computed each sample mean, those sample means would fluctuate at a scale of about 2.

An exam answer can say: "The standard error of the sample mean is 2. It describes the sampling fluctuation of the sample mean as an estimator of the population mean, and it is different from the individual-score standard deviation of 12."

That explanation matters. Many problems do not only ask you to compute SE; they test whether you know whose fluctuation SE describes.

## More Data Does Not Improve Precision Linearly

SE has `sqrt(n)` in the denominator. Increasing sample size makes the average more stable, but not linearly. If `n` goes from 25 to 100, `sqrt(n)` goes from 5 to 10, so SE is cut in half.

This is important in both exams and practice. To cut estimation error roughly in half, you often need about four times as many samples. That is why small-sample model comparisons are unstable. Testing more items helps, but it does not magically remove uncertainty.

## Where This Shows Up in ML/AI

Benchmark scores are sample statistics. A model's accuracy, F1, average win rate, or average rating on one test set is the result on that batch of test data. What you really care about is how the model performs on future tasks from the same population.

If model A scores 82.1 and model B scores 82.3, the gap exists as a point estimate, but it may not be stable. Ask how large the test set is, whether the tasks represent real use, how large the standard error is, and whether bootstrap or confidence intervals were reported.

This is why serious model evaluation should not be only a leaderboard. A rank gives a point estimate. It does not tell you uncertainty. Statistics forces the better question: if we sampled another batch of test tasks, would the ranking stay the same?

## How Sources Are Used

- Official past-paper PDFs are used only for years, subject names, and problem statements; two years of questions are not treated as the full future scope.
- The grad-exam-prep pages are used for study-route, question-index, and practice-flow alignment, not as official solutions.
- OpenIntro, OpenStax, and other open textbooks are used to verify formulas, definitions, assumptions, and common derivations.
- Stanford CS109 and scikit-learn documentation are used to connect each topic to ML/AI training, evaluation, experiments, and uncertainty reporting.

## Problem Recognition Hints

- If the question asks about raw-data spread, use SD.
- If it asks about the fluctuation of a sample mean or estimator, use SE.
- When sample size appears as `sqrt(n)` in the denominator, the problem is usually about a sampling distribution.
- When benchmark gaps are tiny, ask about uncertainty before ranking models.

## Common Mistakes

- Treating SD and SE as the same quantity.
- Explaining CLT as if the raw data itself becomes Normal.
- Assuming precision increases linearly with sample size.
- Declaring a model better from a tiny score gap without uncertainty.

## Practice

1. If `sigma=15` and `n=25`, compute the standard error of the sample mean.
2. Change `n` from 25 to 100 and explain why SE becomes half as large.
3. Write one sentence distinguishing SD from SE; the sentence must say what is fluctuating.
4. Design a benchmark comparison where a small score gap needs uncertainty before interpretation.

## Next

Once standard error is available, the next step is confidence intervals. Post 9 turns "estimate plus uncertainty" into an exam-ready answer and explains why a confidence interval is not the probability that the population parameter lies inside one fixed interval.

## Section-Level Source Map

- OpenIntro / OpenStax: sampling distributions, standard error, CLT, sample means, and confidence-interval prerequisites.
- Stanford CS109: sampling, repeated experiments, large-sample approximation, and ML-evaluation intuition.
- scikit-learn: benchmark metrics, model evaluation, and uncertainty-reporting context.

## References

- [OpenIntro Statistics: sampling distribution, standard error, CLT](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: sampling, standard error, and confidence interval foundations](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109: sampling, uncertainty, and large-sample approximation](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation: benchmark metrics and uncertainty reporting](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
