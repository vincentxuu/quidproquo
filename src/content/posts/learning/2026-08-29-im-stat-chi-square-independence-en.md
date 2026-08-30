---
title: "How Do You Tell Goodness-of-Fit From Independence in Chi-Square Problems?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 12
tldr: "Chi-square tests compare observed counts with expected counts. First decide whether the problem is goodness-of-fit for one categorical variable or independence for two categorical variables."
description: "A beginner guide to chi-square tests: goodness-of-fit, independence, expected counts, degrees of freedom, a 2x2 worked example, and ML/AI data-bias checks."
draft: true
---

> [中文版](/posts/learning/2026-08-29-im-stat-chi-square-independence)

Chi-square questions are usually about categorical counts. The data are not scores or measurements; they are counts in categories: pass/fail, source A/source B, clicked/not clicked, positive/negative label.

The first task is not to compute. The first task is to decide which kind of chi-square question you are looking at.

Goodness-of-fit asks whether one categorical variable follows expected proportions. Independence asks whether two categorical variables are associated in a contingency table. Both compare observed counts with expected counts, but the hypotheses and degrees of freedom are different.

## What the Chi-Square Statistic Measures

The chi-square statistic measures how far observed counts are from expected counts under the null hypothesis:

```text
chi-square = sum((O - E)^2 / E)
```

`O` is the observed count. `E` is the expected count under the null hypothesis.

For an independence test, the expected count in a cell is:

```text
expected count = row total * column total / grand total
```

For a table with `r` rows and `c` columns, the degrees of freedom are:

```text
df = (r - 1)(c - 1)
```

The statistic is always nonnegative. Large values mean the observed table is far from what the null hypothesis would expect.

## Worked Example: Are Data Source and Label Independent?

Suppose a dataset has two sources and two labels:

```text
              positive   negative   total
source A          30         70       100
source B          50         50       100
total             80        120       200
```

The hypotheses are:

```text
H0: data source and label are independent
H1: data source and label are associated
```

Under independence, the expected count for source A and positive is:

```text
100 * 80 / 200 = 40
```

The expected count for source A and negative is:

```text
100 * 120 / 200 = 60
```

Because both row totals are 100, source B has the same expected counts: 40 positive and 60 negative.

Now compute the cell contributions:

```text
source A positive: (30 - 40)^2 / 40 = 2.50
source A negative: (70 - 60)^2 / 60 = 1.67
source B positive: (50 - 40)^2 / 40 = 2.50
source B negative: (50 - 60)^2 / 60 = 1.67
```

So:

```text
chi-square = 2.50 + 1.67 + 2.50 + 1.67 = 8.34
```

The table is `2 x 2`, so:

```text
df = (2 - 1)(2 - 1) = 1
```

At the 5% level with `df = 1`, the critical value is about `3.841`. Since `8.34 > 3.841`, reject independence.

A good conclusion is:

At the 5% significance level, the data provide evidence of an association between data source and label.

Do not say the source causes the label. A chi-square independence test detects association in counts; it does not establish causality.

## How to Separate Goodness-of-Fit and Independence

Use the number of categorical variables.

Goodness-of-fit has one categorical variable and expected proportions:

```text
Are weekday sales distributed as 20%, 20%, 20%, 20%, 20%?
Does a die follow the 1/6, 1/6, ..., 1/6 distribution?
Do customer types match a known market distribution?
```

Independence has two categorical variables in a table:

```text
Is department associated with pass/fail?
Is data source associated with label?
Is device type associated with error category?
```

For goodness-of-fit with `k` categories, the common degrees of freedom are:

```text
df = k - 1
```

For independence, use:

```text
df = (r - 1)(c - 1)
```

When expected counts are very small, the chi-square approximation can be unreliable. Introductory courses often use a rule-of-thumb expected-count condition; exact tests or simulation may be more appropriate in small samples.

## Where This Shows Up in ML/AI

Chi-square tests are useful for dataset and evaluation audits. Many ML problems begin with categorical variables and counts:

```text
train/test split vs label
data source vs label
language vs error type
device type vs prediction failure
rater group vs annotation category
```

If the train/test split is associated with label, evaluation may be distorted. If a data source is associated with positive labels, a model may learn source artifacts instead of the intended signal. If an error type is concentrated in one language or device group, the aggregate score hides a subgroup failure.

The chi-square test does not solve the ML problem by itself. It gives an early warning that a categorical distribution is not behaving like the null assumption.

## Common Mistakes

Mistake 1: using means for categorical counts. Chi-square works with counts in categories, not numeric averages.

Mistake 2: mixing goodness-of-fit and independence. Count the categorical variables before choosing the hypotheses.

Mistake 3: forgetting that expected counts are computed under `H0`. In an independence test, expected counts come from row totals, column totals, and the grand total.

Mistake 4: treating association as causation. A significant chi-square result says the variables are not independent under the model; it does not identify the cause.

## Practice

1. For a `2 x 3` contingency table, write the degrees of freedom.
2. Given row total `80`, column total `50`, and grand total `200`, compute the expected count for that cell.
3. Create one goodness-of-fit prompt and one independence prompt. Underline the categorical variables in each.
4. Design an ML dataset-bias check using chi-square to test whether label and data source are associated.

## Next

Chi-square tests are the main entry point for categorical count data. The next post moves to ANOVA, where the outcome becomes numeric again and the question is whether several group means differ.

## Section-Level Source Map

- OpenIntro and OpenStax: chi-square goodness-of-fit, chi-square independence, expected counts, and degrees of freedom.
- Stanford CS109: categorical probability tables and independence intuition.
- scikit-learn: dataset inspection and evaluation contexts where categorical imbalance affects model reports.
- NTU IM prep pages: topic placement and practice-flow alignment; not used as official solutions.

## References

- [Chi-square tests in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: Chi-Square Distribution](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
