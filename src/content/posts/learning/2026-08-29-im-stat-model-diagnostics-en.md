---
title: "What Do Residuals, Outliers, and Leverage Reveal About Model Failure?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 39
tldr: "Model diagnostics turn fitted errors into evidence: residual patterns, outliers, leverage, and influential points reveal how a model fails."
description: "Statistics from Exams to ML/AI, post 39: residual plots, outliers, leverage, Cook distance, diagnostics, and ML error analysis."
draft: true
---

> [中文版](/posts/learning/2026-08-29-im-stat-model-diagnostics)

After a model is fitted, many people look first at R-squared, accuracy, or p-values. Those numbers can describe surface performance, but they do not always show where the model fails. Diagnostics open the errors and inspect their structure.

Statistics exams often use residual plots, outliers, leverage, and Cook distance to ask about model assumptions. ML/AI practice often calls the same habit error analysis: where do errors concentrate, by data source, user group, task type, input length, or language? The names differ, but the question is similar.

## Residuals Are What the Model Did Not Explain

For regression, a residual is:

```text
residual = observed y - fitted y
```

If the model form is reasonable, residuals should look more like unstructured noise. They can be large or small, but they should not show clear patterns against fitted values, predictors, time, or groups.

Residual plots often show four signals.

A curved pattern suggests that the linear form is not enough.

A funnel shape suggests non-constant variance, or heteroscedasticity.

A few points far away from the rest suggest outliers or data-quality problems.

Patterns across time or groups suggest dependence, seasonality, or group effects that the model did not include.

## Separate Outlier, Leverage, and Influence

An outlier usually means an observation is unusual in the `Y` direction. Given the model prediction, its residual is large.

Leverage is about location in the `X` space. If an observation has a predictor combination far away from the rest, it can have high leverage.

An influential point is one whose removal substantially changes the fitted model. It often has both high leverage and a meaningful residual, but residual size alone does not identify it.

These terms should not be merged. A high-leverage point can lie right on the regression line and have a small residual, while still controlling the slope. A large-residual point near the center of the `X` space may be an outlier but not the most influential point.

## Worked Example: Large Residual Does Not Mean Large Influence

Suppose the fitted model is:

```text
y_hat = 2 + 3x
```

One observation is:

```text
x = 4
y = 20
```

The fitted value is:

```text
y_hat = 2 + 3 * 4 = 14
```

The residual is:

```text
e = 20 - 14 = 6
```

This point is far away in the `Y` direction, so it may be an outlier.

Now consider another observation:

```text
x = 40
y = 122
```

The fitted value is:

```text
y_hat = 2 + 3 * 40 = 122
```

The residual is 0. But if `x = 40` is far away from all other `x` values, the point may have high leverage. It has no large residual, yet it may strongly affect the direction of the regression line.

Good diagnostics therefore inspect three things together: unusual `Y`, unusual location in `X`, and how much the fitted model changes if the point is removed.

## What Cook Distance Asks

Cook distance tries to measure how much one observation affects the overall fitted model. Intuitively, it combines residual size and leverage.

A high Cook distance does not automatically mean the point should be deleted. It means you should investigate. Is the observation a data-entry error? Is it a real but special subgroup? Is the model form too simple and forcing certain cases to look extreme?

In an exam answer, avoid writing "Cook distance is high, so delete the point." A better answer is: high Cook distance means the observation has strong influence on model estimates, so data quality, substantive context, and model specification should be checked before deciding whether exclusion is justified.

## Diagnostics Are Not a Delete-Data Procedure

Many beginners see an outlier and want to remove it. That is risky.

If an outlier is a data-entry error, such as age recorded as 300, correction or exclusion has a reason.

If an outlier is a real long-tail case, such as a high-value customer, rare disease, or extreme latency, it may be exactly the data you need to understand.

If an outlier appears because the model is wrong, such as a nonlinear relationship being forced into a line, deleting the data only hides the modeling problem.

The goal of diagnostics is to locate conflict, not to make the plot look clean.

## Where This Shows Up in ML/AI

ML error analysis is diagnostics in another form. If a classifier's errors concentrate in one language, one input length, one user group, or one data source, the overall accuracy has not told the full story.

LLM evaluation works the same way. The average score may look stable, while failures concentrate in Traditional Chinese, long context, tool calling, multi-turn dialogue, or table reasoning. If you do not slice the errors, production failures will usually come from those hidden regions.

A useful diagnostic workflow is:

```text
overall metric -> grouped errors -> representative failures -> data/model/action
```

Start from the overall metric. Split by task, language, source, length, time, and user group. Then inspect representative failures and decide whether the action is more data, different features, a threshold change, a model change, or a product-flow change.

## How to Recognize the Problem

When you see a residual plot, describe the shape first and then connect it to an assumption.

When you see an outlier, ask whether it is unusual in `Y` or unusual in `X`.

When you see leverage, think predictor space. High leverage does not require a large residual.

When you see influential point or Cook distance, think about how much the fitted model changes when the observation is removed.

When you see ML error analysis, ask for subgroup analysis instead of stopping at the overall metric.

## Common Mistakes

- Treating outlier, leverage point, and influential point as synonyms.
- Looking only at residual size and missing high-leverage points.
- Deleting data automatically because a diagnostic plot looks unusual.
- Describing residual-plot shape without connecting it back to linearity, constant variance, or independence.
- Reporting only an overall ML metric without slicing by group, source, and task type.

## Practice

1. Explain the difference among residual, outlier, leverage, and influential point.
2. If removing one observation changes the slope substantially, is the issue closer to an outlier or an influential point? Why?
3. If `y_hat = 2 + 3x`, `x = 4`, and `y = 20`, what is the residual? What diagnostic signal does it suggest?
4. If a residual plot shows a clear curve, how would you change the model or state the limitation?
5. Connect model diagnostics to ML error analysis: how would you slice the model's errors?

## What Comes Next

Diagnostics show where a model breaks. The next post handles variable selection: when many predictors are available, how do we avoid selecting noise that only looks good in the training data?

## Section-Level Source Map

- OpenIntro and OpenStax support regression diagnostics, residual plots, outliers, leverage, and related concepts.
- Stanford CS109 supports thinking about error analysis and sources of model error.
- scikit-learn Model Evaluation supports checking model performance through metrics and error decomposition; this post connects diagnostic plots to ML error analysis.

## References

- [Regression diagnostics, residual plots, outliers, leverage, Cook distance, and error analysis: OpenIntro Statistics](https://www.openintro.org/book/os/)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
