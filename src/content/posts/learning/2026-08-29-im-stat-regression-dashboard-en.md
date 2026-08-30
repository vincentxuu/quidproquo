---
title: "How Should coef, SE, t, F, and R-Squared Be Read Together?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 16
tldr: "A regression table is not a p-value list: coef, SE, t, F, and R-squared answer effect size, uncertainty, single-coefficient tests, overall model signal, and in-sample explanation."
description: "A beginner guide to regression output: coef, standard error, t, p-value, F test, R-squared, adjusted R-squared, and ML baseline reports."
draft: false
---

> [中文版](/posts/learning/2026-08-29-im-stat-regression-dashboard)

The first time you see a regression output table, the easiest habit is to scan p-values: circle anything below 0.05 and skip the rest. That is risky in an exam and in real model reporting.

Each column answers a different question. `coef` estimates effect size. `SE` describes uncertainty. `t` and p-value test whether one coefficient is clearly away from 0. `F` looks at the model as a whole. `R-squared` describes in-sample explanatory power.

Read the table like a dashboard, not a row of stars. A useful sequence is: understand the model question, read coefficient direction and size, check standard errors and tests, then read overall fit and diagnostics.

## Read coef and SE Together

A regression coefficient says: controlling for the other variables in the model, when this predictor increases by one unit, the average response is estimated to change by this amount.

The phrase "controlling for the other variables" matters in multiple regression. Each coefficient is interpreted while the other predictors remain in the model.

The standard error says how unstable the coefficient estimate is. A large coefficient with a large SE may be shaky. A small coefficient with a small SE may be stable but practically small.

The t statistic for a single coefficient is usually:

```text
t = coefficient / standard error
```

It measures how many standard errors the estimate is away from 0.

## Worked Example: Read One Coefficient Row

Suppose a regression table has one row for `hours_studied`:

```text
coef = 1.5
SE = 0.5
```

Compute:

```text
t = 1.5 / 0.5 = 3
```

With enough degrees of freedom, `|t| = 3` usually corresponds to a small p-value. But an answer should say more than "significant."

A fuller interpretation is:

Controlling for the other variables in the model, each additional study hour is associated with an estimated average score increase of 1.5 points. The estimate is about 3 standard errors away from 0, so the data provide statistical evidence that the coefficient is not 0.

Separate the ideas. `1.5` is the estimated effect size. `t` and p-value describe evidence under uncertainty. A small p-value does not mean the effect is large. A large coefficient does not mean the estimate is stable.

## F Test and R-Squared Live at Different Levels

A single t test checks one coefficient. The overall F test often uses:

```text
H0: beta1 = beta2 = ... = betap = 0
```

That means all slope coefficients have no linear explanatory power. A significant F test says the model has at least some explanatory signal. It does not say every predictor is useful.

`R-squared` describes the proportion of response variation explained by the model in this sample. If `R-squared = 0.60`, a plain-language interpretation is:

In this sample, the model explains about 60% of the variation in `Y`.

But R-squared has limits. It is an in-sample measure, so it does not guarantee test-set performance. Adding more predictors usually does not lower R-squared, which is why multiple regression often also reports adjusted R-squared. A high R-squared does not prove causality; it only describes linear association and fit in the sample.

## How to Recognize the Question Type

When you see regression output, separate four common prompts.

If the question asks about the direction or size of one variable's effect, read the coefficient and interpret units. If it asks whether that variable is significant, use `coef / SE`, t, and p-value. If it asks whether the overall model has explanatory power, use the F test. If it asks how much variation the model explains, use R-squared or adjusted R-squared.

If the question says "controlling for other variables," it is usually testing multiple-regression coefficient interpretation. If it asks whether the model is significant overall, do not answer with one predictor's p-value. If it asks whether prediction is good, R-squared is only partial evidence; train/test evaluation is stronger.

## Where This Shows Up in ML/AI

Multiple regression is often the first interpretable baseline in an ML project. It may not beat trees, boosting, or neural networks, but it can quickly answer whether feature directions make sense, which effects look large, and which variables are unstable.

Regression tables also keep model reports from talking only about metrics. Suppose a churn model has strong accuracy, but a linear baseline shows a feature coefficient with a direction that contradicts business knowledge. That may point to leakage, collinearity, or a bad split.

Feature-effect reporting needs careful language. You can write: controlling for other variables, this feature is associated with an average change in the outcome. Without experimental design or causal identification, do not write that the feature causes the outcome to change.

## Common Mistakes

Mistake 1: reading only p-values and ignoring coefficient direction and size.

Mistake 2: treating SE as the standard deviation of the variable itself.

Mistake 3: saying every predictor is useful because the overall F test is significant.

Mistake 4: treating high R-squared as proof of good generalization or causality.

Mistake 5: interpreting a multiple-regression coefficient without saying "controlling for other variables."

## Practice

1. A coefficient row gives `coef = -0.8` and `SE = 0.2`. Compute t and write a contextual coefficient interpretation.
2. Explain what a single-coefficient t test and the overall F test answer.
3. Write one correct R-squared interpretation and one common incorrect interpretation.
4. Use an ML baseline scenario to explain why an interpretable linear model is still worth running.

## Next

So far, linear models have handled numeric outcomes. The next post moves to classification: when the outcome is 0/1, logistic regression turns a linear score into a probability and connects statistical modeling to classification, thresholds, and cross entropy.

## Section-Level Source Map

- OpenIntro and OpenStax: regression output, coefficients, SE, t tests, F tests, R-squared, and adjusted R-squared.
- Stanford CS109: the distinction between explanation, prediction, and uncertainty.
- scikit-learn: linear baselines, feature inspection, and model evaluation.
- NTU IM prep pages: topic placement and practice-flow alignment; not used as official solutions.

## References

- [Regression output in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: Multiple Regression, F Test, and R-Squared](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109: Probability for Computer Scientists](https://cs109.stanford.edu/)
- [scikit-learn Linear Models](https://scikit-learn.org/stable/modules/linear_model.html)
- [scikit-learn Model Evaluation: Regression Metrics](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
