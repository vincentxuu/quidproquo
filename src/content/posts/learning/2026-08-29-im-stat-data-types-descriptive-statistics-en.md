---
title: "When You See a Dataset, What Statistics Should You Check First?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 3
tldr: "Data type determines the statistical tools you can use. Start with categorical, numeric, count, and time-ordered data, then choose summaries that fit the question."
description: "A beginner guide to data types and descriptive statistics: how to inspect variables, choose summaries, and connect dataset checks to ML evaluation."
draft: false
---

> [Mandarin version](/posts/learning/2026-08-29-im-stat-data-types-descriptive-statistics)

Many statistics problems fail at the first step, before any calculation. The problem gives a list of numbers, and you assume the mean is needed. It gives a table, and you assume it is only counting people. It gives model accuracy, and you assume that is the model's true capability. Once the data type is misread, the formula choice usually goes wrong too.

Descriptive statistics is often underrated in exam prep. Means, medians, and standard deviations feel too basic compared with confidence intervals and tests. But inference stands on top of description. If you do not know whether the data is categorical or numeric, whether it is skewed, whether it has outliers, or whether two groups are balanced, later inference has no stable base.

ML/AI works the same way. If you do not inspect the data before training, a more sophisticated model may simply learn the bias more efficiently. Label imbalance, extreme feature values, missingness concentrated in a subgroup, and train/test distribution mismatch all affect whether an evaluation can be trusted.

## First Classify the Data Type

When you receive data, first ask what kind of variable it is.

Categorical data places observations into groups: department, gender, admission status, correct/incorrect. These variables usually use counts, proportions, and contingency tables. They are not naturally summarized by ordinary means. A binary category can be encoded as 0 and 1, but its mean is a proportion.

Ordinal data has an order, but the distance between adjacent values may not be equal. Examples include 1-to-5 satisfaction ratings, rankings, and survey scales. You can compare higher and lower values, and sometimes summarize with a mean, but the interpretation needs care because the gap from 1 to 2 may not match the gap from 4 to 5.

Numeric data supports arithmetic and averages: scores, height, time, money. These variables can use means, standard deviations, variances, and interquartile ranges. Even then, shape matters. Income is often skewed, so a mean can be pulled by a few extreme values.

Count data records how many times something happens: daily support tickets, requests per minute, number of errors. Counts cannot be negative and are often right-skewed. Later, this may lead to Poisson or other count models.

Time series data adds an ordering constraint. Today, tomorrow, and next week are not observations you can freely shuffle. When data has time dependence, train/test splits, trend interpretation, and anomaly detection need special handling.

## Descriptive Statistics Is Not Computing Everything

The job of descriptive statistics is to reveal data structure with a small set of summaries.

Center answers where the typical value is. The mean works well for roughly symmetric numeric data without extreme values. The median is more stable under skew or outliers. Spread answers how unstable the data is. Standard deviation describes variation around the mean, while IQR is less affected by extremes.

Proportions answer how categories are composed. If 95% of samples are in one class, a classifier can get high accuracy while learning very little. Contingency tables answer how two categorical variables intersect, such as admission status by department.

Plots answer what text summaries miss. Histograms show distribution shape. Boxplots show medians, quartiles, and outliers. Scatter plots show whether two numeric variables move together. In exams, the plot does not need to be beautiful, but you need to know what each plot is checking.

## A Small Data Example

Suppose a model produces confidence scores on 10 items:

```text
0.91, 0.88, 0.86, 0.84, 0.81, 0.79, 0.76, 0.72, 0.30, 0.18
```

If you report only the mean, it is about 0.705. That makes the model look moderately confident overall. But the summary hides an important pattern: the first 8 items are all at least 0.72, while the last 2 are much lower.

The median better describes the typical item. After sorting, the 5th and 6th values are 0.79 and 0.81, so the median is:

```text
(0.79 + 0.81) / 2 = 0.80
```

The mean is lower than the median, which tells you the low tail is pulling the average down.

Next, check the range. The maximum is 0.91 and the minimum is 0.18, so the range is large. A boxplot would force you to inspect the low-confidence cases. Are they a specific task type, language, format, or data source?

An exam answer can say: "This is continuous numeric data, so center, spread, and outliers should be inspected. The mean confidence is about 0.705, but the median is about 0.80, which suggests a small number of low-confidence items pull the mean down. To evaluate model stability, inspect the low-score cases instead of reporting only the mean."

The example is simple, but it builds an important habit: descriptive statistics should bring you back to the data, not take you farther away from it.

## How to Recognize Common Problem Types

If the problem gives scores, times, or money, start with numeric summaries. Think of mean, median, standard deviation, IQR, and outliers.

If it gives admission status, purchase/no purchase, or correct/incorrect, start with proportions. If it also gives another category such as department or version, think of a contingency table and possibly a chi-square test later.

If it asks whether two variables are related, classify both variables first. Two numeric variables may lead to correlation or regression. Two categorical variables may lead to a contingency table. One categorical variable and one numeric variable may lead to grouped means or boxplots.

If the question asks whether you can generalize to a population, descriptive statistics is only the first step. You then need standard error, confidence intervals, or hypothesis tests.

## Where This Shows Up in ML/AI

The first table in an ML pipeline should be a dataset summary.

For features, inspect type, range, mean or proportion, missing rate, and extreme values. For labels, inspect class proportions. For train/test splits, inspect whether distributions are similar. If one class is 90% of training data but only 60% of test data, performance differences may come from distribution shift.

After training, descriptive statistics still matters. Inspect score distributions, error distributions, and subgroup performance. Overall accuracy may look good while one task type fails often. Average latency may look acceptable while tail latency breaks the user experience.

The habit from this post is simple: before any inference or modeling, clarify the data type and the right summary.

## How Sources Are Used

- Official past-paper PDFs are used only for years, subject names, and problem statements; two years of questions are not treated as the full future scope.
- The grad-exam-prep pages are used for study-route, question-index, and practice-flow alignment, not as official solutions.
- OpenIntro, OpenStax, and other open textbooks are used to verify formulas, definitions, assumptions, and common derivations.
- Stanford CS109 and scikit-learn documentation are used to connect each topic to ML/AI training, evaluation, experiments, and uncertainty reporting.

## Problem Recognition Hints

- For categorical data, start with counts, proportions, and contingency tables.
- For numeric data, inspect mean, median, variance, and outliers.
- When train/test distributions differ, return to descriptive statistics before tuning the model.

## Common Mistakes

- Applying formulas by keyword without checking data type and assumptions.
- Treating sample statistics as population parameters.
- Treating two years of past papers as the complete future scope.
- Treating the ML/AI connection as a claim that the exam will directly test AI terms.

## Practice

1. Classify age, department, admission status, and exam score as categorical or numerical data.
2. For data 2, 3, 3, 7, 10, compute mean, median, range, and sample variance.
3. Explain why the median can be more stable than the mean with outliers.
4. Design an ML dataset summary with feature type, missing rate, and mean or proportion.

## Next

Once the data type is clear, the next step is probability. Post 4 covers events, conditional probability, independence, and Bayes' rule, which are the basis for reading precision, recall, and base rates correctly.

## Section-Level Source Map

- OpenIntro / OpenStax: data types, center, and spread.
- scikit-learn: feature inspection and preprocessing context.
- Stanford CS109: data summaries and data-quality checks.

## References

- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
