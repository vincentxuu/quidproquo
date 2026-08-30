---
title: "When OLS Assumptions Fail, How Can the Regression Line Still Be Used?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 36
tldr: "OLS is a useful baseline, but coefficient interpretation, inference, prediction, and diagnosis depend on assumptions about linearity, errors, independence, and variance."
description: "A guide to OLS beyond the first formula: assumptions, coefficient interpretation, residuals, robust limitations, prediction versus explanation, and ML/AI baseline diagnostics."
draft: false
---

> [中文版](/posts/learning/2026-08-29-im-stat-linear-models-deep-dive)

Earlier posts covered how to compute a simple regression line and read coefficients, standard errors, t values, F tests, and R-squared. Layer Three moves closer to real data: if OLS assumptions do not fully hold, can the regression line still be used? For what purpose? What limits must be stated?

This matters because regression is a common baseline in exams and ML/AI. It is transparent, easy to compute, and easy to explain. That usefulness also makes it easy to use beyond its conditions.

## What OLS Minimizes

A linear model is often written as:

```text
y = X beta + epsilon
```

OLS chooses `beta_hat` to minimize the residual sum of squares:

```text
sum_i (y_i - x_i' beta)^2
```

In matrix form, if `X'X` is invertible:

```text
beta_hat = (X'X)^(-1) X'y
```

This formula says two things. First, OLS fits `y` using a linear combination of features. Second, it depends heavily on the quality of `X`. If features are nearly linearly duplicated, scales are extreme, or outliers are strong, the estimate can become unstable.

## Coefficients Describe Conditional Means

Suppose the model is:

```text
score = beta0 + beta1 hours + beta2 prior_score + epsilon
```

and the estimated coefficient is:

```text
beta1_hat = 2.3
```

A careful interpretation is:

Under this model and holding `prior_score` fixed, a one-unit increase in `hours` is associated with an estimated 2.3-point increase in the conditional mean of `score`.

That sentence contains three limits.

First, it describes a conditional mean, not every individual outcome. Second, it holds other included variables fixed. Third, it does not claim causality. If the data are not from a randomized experiment, `hours` may move together with motivation, resources, or prior ability. Regression controls only variables included in the model, not variables that were never measured.

## How to Use Common OLS Assumptions

Introductory courses often list assumptions. The useful skill is knowing which conclusion is affected when an assumption fails.

Linearity: the conditional mean should be reasonably described by a linear form. If the true relationship is curved, a straight line may systematically underpredict or overpredict some regions.

Zero conditional error mean: given `X`, the expected error should be 0. If an important omitted variable is correlated with `X`, coefficient interpretation can be biased.

Independence: observations should not have unhandled dependence. Time series, repeated records from the same user, or students within the same class may violate this.

Constant variance: error variance should be roughly similar across values of `X`. Funnel-shaped residuals can make standard errors and tests unreliable.

Normal errors: small-sample t and F inference often relies on this. With large samples, coefficient estimates may use approximations, but outliers and heavy tails can still damage stability.

## Worked Example: Coefficient, Prediction, and Residual

Suppose the fitted model is:

```text
y_hat = 10 + 2x
```

For one observation:

```text
x = 4
y = 21
```

The prediction is:

```text
y_hat = 10 + 2 * 4 = 18
```

The residual is:

```text
e = y - y_hat = 21 - 18 = 3
```

For another observation with `x = 8`:

```text
y_hat = 10 + 2 * 8 = 26
```

The arithmetic is simple. Exams often then ask for interpretation: slope 2 means a one-unit increase in `x` is associated with a 2-unit increase in the predicted conditional mean of `y`. It does not mean every observation follows the line exactly, because every observation still has a residual.

If a residual plot shows larger residual spread as `x` increases, add a limitation: the coefficient point estimate can still summarize a linear trend, but standard errors, t tests, and confidence intervals based on constant variance may be unreliable. Consider robust standard errors, transformations, or a different model specification.

## What to Look For in Residual Plots

Residual plots are not decoration. They ask what structure the model left inside the errors.

If residuals curve against fitted values, the linear form may be insufficient. Consider polynomial terms, interactions, transformations, or nonlinear models.

If residuals form a funnel, heteroskedasticity is likely. This affects standard errors and tests, especially when the question is about inference.

If a few residuals are extreme, they may be outliers. Do not delete them automatically. First check whether they are data errors, special subgroups, or important long-tail cases.

If residuals show patterns over time or groups, independence or group effects may be unhandled. Ordinary OLS standard errors may be too optimistic.

## Prediction and Explanation Have Different Standards

If the goal is prediction, OLS can be a good baseline. You care about validation error, RMSE, MAE, calibration, and out-of-sample performance.

If the goal is explanation, requirements are stricter. Ask whether coefficients can be read as conditional relationships, whether omitted variables are serious, and whether the data-generating process supports "holding other variables fixed."

If the goal is causality, OLS alone does not automatically give a causal answer. You need a design: randomized experiments, natural experiments, instrumental variables, difference-in-differences, matching, or another causal strategy.

## Where This Shows Up in ML/AI

Linear models often serve three roles in ML projects.

First, baseline. If a complex model only slightly beats linear regression but is harder to explain, more expensive, or slower, it may not be worth deploying.

Second, feature inspection. Coefficient direction and size can reveal leakage, bad encoding, or scaling problems. A feature that should not know the answer but has a huge coefficient may be a leakage signal.

Third, error analysis. Residuals concentrated in specific groups, time periods, or task types are often more useful than one aggregate RMSE.

In LLM evaluation, a linear model can analyze which factors affect scores: prompt length, language, domain, model version, or tool use. That helps distinguish broad model improvement from gains limited to specific task types.

## How to Recognize the Problem

If you see an OLS formula, first decide whether the prompt asks for estimation, prediction, coefficient interpretation, assumption checking, or inference.

For coefficient interpretation, include "holding other variables fixed" and "conditional mean."

For residual plots, describe the pattern and connect it to an assumption: curvature to linearity, funnel shape to constant variance, clustering to independence, extreme points to outliers.

If the prompt asks whether `X` causes `Y`, answer through study design rather than coefficient significance alone.

## Common Mistakes

Mistake 1: interpreting the slope as the same change for every individual.

Mistake 2: forgetting to hold other variables fixed in multiple regression.

Mistake 3: declaring causality from a significant coefficient.

Mistake 4: describing a residual plot as pretty or ugly without linking it to assumptions.

Mistake 5: using only RMSE in ML without checking leakage, outliers, subgroup errors, and generalization.

## Practice

1. List common OLS assumptions: linearity, independence, constant variance, and zero conditional error mean. For each, write what can go wrong if it fails.
2. Explain why `b1` in `y = b0 + b1x + e` describes a conditional mean slope, not a guaranteed individual change.
3. If `y_hat = 5 + 3x`, `x = 6`, and `y = 20`, compute the prediction and residual.
4. If a residual plot has a funnel shape, which assumption is most likely in trouble, and how would you write the limitation?
5. When linear regression is used as an ML baseline, what diagnostic signals should be checked beyond RMSE?

## Next

OLS is the entry point for linear models. The next post returns to logistic regression from a deeper model perspective: when the target changes from numeric to 0/1, why do we use log odds and sigmoid instead of forcing linear regression onto probabilities?

## Section-Level Source Map

- OpenIntro and OpenStax: OLS coefficients, residuals, R-squared, assumptions, and basic diagnostics.
- Stanford CS109: supervised prediction, data, and error language.
- scikit-learn: linear-model baselines and evaluation metrics.
- NTU IM prep pages: topic placement and practice-flow alignment; not used as official solutions.

## References

- [OLS and linear regression in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
