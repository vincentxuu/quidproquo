---
title: "Missing Data Is Not Just Blank Cells: How Does It Distort Statistics and Models?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 49
tldr: "Missing data can change representativeness, bias estimates, and mislead ML systems. The first question is why the data are missing."
description: "Statistics from Exams to ML/AI, post 49: MCAR, MAR, MNAR, complete-case analysis, imputation, dataset bias, missing labels, and AI evaluation limits."
draft: false
---

> [中文版](/posts/learning/2026-08-29-im-stat-missing-data)

In the multivariate-analysis post, we assumed every column had values. Real datasets are rarely that clean. Survey respondents skip income, app logs miss events, medical datasets miss lab values, and LLM evaluation datasets may miss labels or human review.

Missing data are not just blank cells. They change sample representativeness, distort means, affect tests, and teach ML models the wrong signals. Exams often ask about MCAR, MAR, MNAR, complete-case analysis, and imputation. ML/AI practice sees dataset bias, logging failures, missing labels, and subgroup evaluation gaps.

## What Problem This Solves

When you see missing data, the first question is not whether to fill with the mean. The first question is:

```text
Why is the data missing?
```

If the missingness has nothing to do with data values, deleting rows may mainly reduce sample size. If missingness relates to observed variables, those variables may help adjustment. If missingness relates to the unobserved value itself, the problem is harder.

Missing data affects three layers:

```text
estimate: means, proportions, and regression coefficients can become biased
uncertainty: smaller effective samples usually increase uncertainty
generalization: the learned population may differ from the target population
```

## Core Intuition

There are three common mechanisms.

MCAR means missing completely at random. Missingness is unrelated to any data values. For example, a random system failure loses a small portion of survey answers. In this case, complete-case analysis mainly loses precision.

MAR means missing at random. Missingness relates to observed variables, but after conditioning on those variables, it has no additional relation to the missing value itself. For example, younger users are less likely to report income, but within the same age group, reporting is not systematically related to actual income. Age, occupation, and region can help imputation or weighting.

MNAR means missing not at random. Missingness relates to the missing value itself. For example, high-income users are less willing to report income. The unobserved income is part of why the data are missing. Existing columns may not be enough; sensitivity analysis, external data, or stronger design may be needed.

An exam answer does not need to be fancy. It needs to state which missingness mechanism the method assumes.

## Formula and Mechanism

Common treatments include several families.

Complete-case analysis keeps only complete rows:

```text
analyze only observations with no NA
```

It is simple, but it can be biased when missingness is not MCAR.

Mean imputation fills missing values with the observed mean:

```text
missing income -> mean(observed income)
```

It can shrink variance because imputed values are too concentrated. If the filled values are treated as real observations, standard errors may also become too small.

The indicator method adds a missingness flag:

```text
income_missing = 1 if income is missing else 0
```

This is common in ML because missingness itself may be predictive. For statistical inference, it needs care; the indicator does not automatically remove bias.

Multiple imputation creates several completed datasets, analyzes each, and combines results. It is more honest than a single mean fill because it carries imputation uncertainty.

Model-based imputation predicts missing values from other variables, such as age, occupation, and region. It still depends on model assumptions and the missingness mechanism.

## Worked Example: Complete Cases Can Bias the Mean

Suppose you want to estimate average monthly income for platform users:

| User | Income |
|---|---:|
| A | 40 |
| B | 45 |
| C | 50 |
| D | missing |
| E | missing |

Using complete cases:

```text
(40 + 45 + 50) / 3 = 45
```

If D and E are missing because of a random storage failure, 45 may mainly be unstable due to fewer observations.

But if D and E are high-income users whose true values are 90 and 100, the full-data mean is:

```text
(40 + 45 + 50 + 90 + 100) / 5 = 65
```

Complete-case analysis underestimates the mean as 45.

If you fill both missing values with the observed mean, D and E become 45:

```text
(40 + 45 + 50 + 45 + 45) / 5 = 45
```

The mean is still too low, and variance is artificially compressed. Filling cells is not enough. If missingness relates to income itself, mean imputation hides the problem.

A good exam answer can follow this order:

1. Decide whether the missingness is likely MCAR, MAR, or MNAR.
2. Explain whether complete-case analysis may be biased.
3. If imputing, state which variables are used and how imputation uncertainty is handled.
4. Report the limitation.

## Where This Shows Up in ML/AI

Missing data in ML/AI often does not look like an empty spreadsheet cell.

Missing labels: some groups, languages, or task types receive less human labeling. Evaluation may look strong, but only for the well-labeled population.

Missing logs: tool-call failures, event-tracking gaps, or offline user behavior may never enter the database. A model may appear to have no side effects simply because the side effects were not recorded.

Selection missingness: only users willing to leave feedback enter the dataset. If very satisfied and very dissatisfied users are more likely to respond, the evaluation skews toward extremes.

Subgroup missingness: long-tail tasks, minority languages, and rare errors may have too few examples. Overall accuracy can stay stable while important groups are poorly measured.

An AI evaluation report should at least state:

```text
missing rate: which fields or groups are missing and by how much
missing mechanism: why the data may be missing
sensitivity check: whether conclusions change under different treatments
```

Missing data belongs in the credibility section of the report, not at the end of data cleaning.

## How Sources Are Used

- Official past-paper PDFs are used only for years, subject names, and problem statements; two years of questions are not treated as the full future scope.
- The grad-exam-prep pages are used for study-route, question-index, and practice-flow alignment, not as official solutions.
- OpenIntro, OpenStax, and other open textbooks are used to verify formulas, definitions, assumptions, and common derivations.
- Stanford CS109 and scikit-learn documentation are used to connect each topic to ML/AI training, evaluation, experiments, and uncertainty reporting.

## Problem Recognition Hints

- If the problem only says "missing values," ask about the missingness mechanism first.
- For complete-case analysis, state when it is more reasonable.
- For imputation, state the method, variables used, and remaining uncertainty.
- In ML/AI settings, treat missingness as a possible bias source, not just preprocessing.

## Common Mistakes

- Deleting all missing rows without checking who was removed.
- Filling with the mean and pretending the data were never missing.
- Forgetting that imputation affects variance, correlation, and standard errors.
- Only checking whether the ML model accepts NA values while ignoring data-collection bias.
- Writing "missing values were handled" without stating the rule.

## Practice

1. Compare MCAR, MAR, and MNAR, giving one example of each mechanism.
2. Use the income example to explain how complete-case analysis can underestimate the mean.
3. Why can mean imputation reduce variance?
4. In an AI dataset, if human labels are missing more often for certain languages, how can model evaluation be affected?
5. Write a short report paragraph that states missing rate, handling method, and limitation.

## What Comes Next

Missing data forces you to think about the data-generating process. The next post moves to Monte Carlo simulation: when formulas are hard or a workflow has many random parts, repeated simulation can show how statistics and decisions vary.

## Section-Level Source Map

- OpenIntro and OpenStax support sampling bias, data quality, estimation, and result interpretation.
- Stanford CS109 supports intuition about data generation, representativeness, and conditional information.
- scikit-learn evaluation documentation supports data splitting and evaluation workflows; this post extends them to missingness, subgroup evaluation, and dataset bias.
- This post connects missing data to logging failure, missing labels, selection bias, and AI evaluation reports.

## References

- [Missing data, MCAR, MAR, MNAR, imputation, complete-case analysis, and dataset bias: OpenIntro Statistics](https://www.openintro.org/book/os/)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
