---
title: "Which Test Fits a Two-Group Mean or Proportion Difference?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 11
tldr: "Two-group comparisons start by classifying the outcome and the design: numeric or binary, independent or paired. That choice determines the standard error, test statistic, and conclusion."
description: "A beginner guide to two-sample comparisons: independent means, Welch t, paired comparisons, two-proportion differences, and paired design in ML/AI evaluation."
draft: false
---

> [中文版](/posts/learning/2026-08-29-im-stat-two-sample-comparisons)

Two-sample questions look simple because they often start with two numbers: group A has a mean of 78, group B has a mean of 72, or one version has a conversion rate of 13% while another has 17%.

The trap is that the difference itself is not the whole problem. You must ask what kind of outcome you are comparing, whether the two groups are independent, and which standard error matches the design.

The same surface sentence, "compare A and B," can lead to different tests.

## Classify With Three Questions

Before touching a formula, classify the problem.

Question 1: What kind of outcome is measured?

If the outcome is numeric, such as score, time, revenue, or latency, you are comparing means. If the outcome is binary, such as clicked/not clicked, correct/incorrect, churned/not churned, you are comparing proportions.

Question 2: Are the samples independent or paired?

Independent samples are different units in each group: two different classes, two different user groups, two different factories. Paired samples use natural pairs: the same person before and after, matched subjects, or the same test item evaluated by two models.

Question 3: For independent means, do you have reason to assume equal variances?

Many modern treatments prefer Welch's two-sample t method when equal variance is not clearly justified. Exams may still ask for pooled variance when the equal-variance assumption is explicitly stated.

A practical recognition table:

```text
numeric outcome + independent groups  -> independent two-sample t
numeric outcome + paired observations -> paired t on differences
binary outcome  + independent groups  -> two-proportion comparison
binary outcome  + paired observations -> paired binary comparison, such as McNemar or resampling
```

This classification step prevents most formula mistakes.

## Worked Example: Independent Mean Difference

Suppose two training methods produce exam scores:

```text
Method A: n1 = 25, xbar1 = 78, s1 = 10
Method B: n2 = 25, xbar2 = 72, s2 = 12
```

The estimated difference is:

```text
xbar1 - xbar2 = 78 - 72 = 6
```

Using Welch's standard error:

```text
SE = sqrt(s1^2 / n1 + s2^2 / n2)
   = sqrt(100 / 25 + 144 / 25)
   = sqrt(9.76)
   = 3.12
```

The t statistic for testing no difference is:

```text
t = 6 / 3.12 = 1.92
```

This number is not the final conclusion by itself. You still need the degrees of freedom, significance level, and tail direction. But the structure is already clear: the observed difference is being judged relative to the uncertainty of two separate sample means.

If the question asks for a confidence interval, the same center and standard error appear:

```text
difference +/- t* SE
```

The test and interval are two views of the same comparison.

## Why Paired Comparisons Are Different

Now suppose the same 25 students use Method A first and Method B later, or the same 25 matched pairs are observed under two conditions. This is not an independent two-sample problem.

For paired data, compute the within-pair difference:

```text
d_i = A_i - B_i
```

Then reduce the problem to a one-sample inference problem on the differences:

```text
t = dbar / (s_d / sqrt(n))
```

The point is that each pair has its own baseline. In exams, this often appears as before/after, matched subjects, repeated measurements, or the same item under two treatments.

In ML/AI, paired comparison is especially common. If two models answer the same prompts, item difficulty affects both models. Comparing model scores as if the samples were independent throws away useful information and can produce the wrong uncertainty.

## How to Read Proportion Differences

For binary outcomes, the estimate is usually a difference in proportions:

```text
phat1 - phat2
```

Suppose:

```text
Version A: 52 clicks out of 400 users -> phat1 = 0.13
Version B: 68 clicks out of 400 users -> phat2 = 0.17
```

The observed difference is:

```text
0.17 - 0.13 = 0.04
```

That four-point gap still needs uncertainty. For a confidence interval, a common standard error uses each sample's own estimated proportion. For a hypothesis test of equal proportions, many introductory courses use a pooled proportion under the null hypothesis.

This is a common exam detail: interval standard error and test standard error may not be identical because the test assumes the null condition.

## Where This Shows Up in ML/AI

Two-sample thinking appears everywhere in ML and AI systems:

```text
model A vs model B accuracy
old ranking model vs new ranking model click-through rate
baseline prompt vs revised prompt win rate
before/after latency after an inference optimization
human rater agreement across two labeling interfaces
```

The design determines the method. If different users see two product versions, that is often an independent comparison. If the same prompts are scored under two models, it is paired. If the outcome is correct/incorrect, you are dealing with proportions or paired binary outcomes, not ordinary means unless you deliberately aggregate them.

This prevents a common mistake in model evaluation: treating leaderboard scores as independent numbers when they were generated from the same test set.

## Common Mistakes

Mistake 1: using an independent two-sample test for before/after data. Paired data should usually be reduced to differences first.

Mistake 2: treating binary outcomes like ordinary continuous measurements without checking whether a proportion method is intended.

Mistake 3: using pooled variance just because two groups are present. The equal-variance assumption must be stated or justified.

Mistake 4: reporting "A is larger than B" without measuring whether the gap is large relative to sampling variability.

## Practice

1. Classify each scenario as independent two-sample, paired t, or two-proportion comparison: two classes' final scores; one class before and after tutoring; two websites' conversion rates.
2. For the training-method example above, recompute the standard error and t statistic.
3. Create a paired model-evaluation setup using the same 100 prompts for two models. Define `d_i`.
4. For click rates `52/400` and `68/400`, compute the observed proportion difference and describe what extra information is needed for a test.

## Next

Two-sample comparisons handle numeric and binary outcomes across two groups. The next post moves to chi-square tests, where the data are categorical counts arranged in frequency tables.

## Section-Level Source Map

- OpenIntro and OpenStax: two-sample means, Welch t, paired tests, and two-proportion comparisons.
- Stanford CS109: comparative inference and sampling variability.
- scikit-learn: paired model evaluation and metric-comparison context.
- NTU IM prep pages: topic placement and practice-flow alignment; not used as official solutions.

## References

- [Two-sample comparisons in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: Two Samples](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
