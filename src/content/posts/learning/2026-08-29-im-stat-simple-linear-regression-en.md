---
title: "How Does One Regression Line Become Prediction, Interpretation, and Error?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 15
tldr: "Simple linear regression uses one X to describe the average change in Y. Slope, intercept, residuals, and squared error form the smallest supervised learning model."
description: "A beginner guide to simple linear regression: OLS, slope, intercept, residuals, prediction, interpretation, and the supervised-learning baseline."
draft: false
---

> [中文版](/posts/learning/2026-08-29-im-stat-simple-linear-regression)

Simple linear regression can look like middle-school algebra: draw a line and plug in `x`. But statistical questions are asking more than that. They ask how the average value of `Y` changes when `X` changes, whether the line can be used for prediction, and how prediction error is measured.

The basic model is:

```text
Y = beta0 + beta1 X + error
```

`beta0` is the intercept, `beta1` is the slope, and `error` is the part the line does not explain. From sample data, we estimate `b0` and `b1`, giving the fitted line:

```text
yhat = b0 + b1 x
```

## How to Interpret Slope and Intercept

The slope answers: when `X` increases by one unit, how much is the average value of `Y` expected to change?

If `b1 = 2`, then each one-unit increase in `X` is associated with an estimated average increase of 2 in `Y`.

The intercept answers what the predicted average `Y` is when `X = 0`. But the intercept does not always have practical meaning. If `X` is study hours and the observed data range is 3 to 10 hours, `X = 0` may be outside the range of the data. In that case, the intercept helps position the line, but you should not force a real-world interpretation.

A residual is the difference between the observed value and fitted value:

```text
residual = y - yhat
```

OLS, or ordinary least squares, chooses `b0` and `b1` to minimize the residual sum of squares:

```text
RSS = sum (y_i - yhat_i)^2
```

Squaring errors prevents positive and negative residuals from canceling out, and it penalizes large errors more heavily.

## Worked Example: Build the Regression Line From Summary Values

Suppose a problem gives:

```text
xbar = 3
ybar = 10
Sxx = 20
Sxy = 40
```

The slope estimate in simple linear regression is:

```text
b1 = Sxy / Sxx = 40 / 20 = 2
```

The intercept is:

```text
b0 = ybar - b1 xbar = 10 - 2 * 3 = 4
```

So the fitted line is:

```text
yhat = 4 + 2x
```

When `x = 5`:

```text
yhat = 4 + 2 * 5 = 14
```

A good interpretation is:

Under this linear model, each one-unit increase in `X` is associated with an estimated average increase of 2 in `Y`. When `X = 5`, the model predicts the average value of `Y` to be about 14.

Two traps are worth naming. First, the slope describes an average relationship; it does not say every individual increases by exactly 2. Second, regression does not automatically imply causation. If `X` is advertising spend and `Y` is sales, a positive slope may reflect advertising impact, seasonality, budget allocation, or another confounding factor.

## Correlation Versus Regression

Correlation measures the direction and strength of linear movement between two variables. It does not assign one variable as the response and the other as the predictor.

Regression does assign roles: use `X` to explain or predict `Y`.

If you swap `X` and `Y`, the regression line changes. The correlation coefficient does not. When an exam asks about slope, prediction, or residuals, move into regression language. When it asks about strength of linear association, it may be asking about correlation.

## Where This Shows Up in ML/AI

Linear regression is the smallest supervised learning model. `X` is a feature, `Y` is a label, `yhat` is a prediction, and squared error is a loss.

In an ML project, linear regression may not be the most accurate model, but it is still useful in three ways.

First, it gives a baseline. More complex models should have to beat it. Second, coefficients are interpretable enough to check whether feature directions are reasonable. Third, residuals can reveal data problems: a region where the model systematically overpredicts, outliers that dominate the fit, or a pattern the line cannot capture.

LLMs and recommender systems are far more complex than one line, but evaluation keeps returning to the same questions: how far is the prediction from the observed outcome? What loss is being minimized? Is the model learning a relationship or memorizing the training data?

## Common Mistakes

Mistake 1: interpreting the slope as what happens to every individual, rather than an average change.

Mistake 2: giving a practical interpretation to an intercept far outside the data range.

Mistake 3: treating a regression coefficient as a causal effect without design or identification.

Mistake 4: extrapolating far beyond the observed range of `X`.

Mistake 5: drawing the line without checking residuals.

## Practice

1. Given `b0 = 5`, `b1 = 2`, and `x = 7`, compute `yhat` and write one prediction sentence.
2. For the model `yhat = 4 + 2x`, an observation has `x = 5` and `y = 11`. Compute the residual.
3. Write a correct slope interpretation that includes the word "average."
4. Use one ML project to explain why linear regression is useful as a baseline.

## Next

Simple linear regression uses one predictor. The next post reads a full regression output table: coefficients, standard errors, t values, F tests, and R-squared, so you do not reduce the whole model to p-values.

## Section-Level Source Map

- OpenIntro and OpenStax: simple linear regression, OLS, slope, intercept, residuals, and R-squared.
- Stanford CS109: supervised prediction, loss, and data-modeling context.
- scikit-learn: linear-regression baselines and regression metrics.
- NTU IM prep pages: topic placement and practice-flow alignment; not used as official solutions.

## References

- [Simple linear regression in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: Linear Regression and Correlation](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109: Probability for Computer Scientists](https://cs109.stanford.edu/)
- [scikit-learn Linear Models](https://scikit-learn.org/stable/modules/linear_model.html)
- [scikit-learn Model Evaluation: Regression Metrics](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
