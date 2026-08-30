---
title: "Why Do Ridge, Lasso, and Weight Decay Make Models More Stable?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 41
tldr: "Regularization adds a preference against extreme parameters. Ridge, Lasso, and weight decay trade some training fit for a model that generalizes more reliably."
description: "Statistics from Exams to ML/AI, post 41: Ridge, Lasso, L1/L2 penalties, weight decay, validation tuning, and the bias-variance tradeoff."
draft: true
---

> [中文版](/posts/learning/2026-08-29-im-stat-regularization)

After MAP, regularization is no longer just an engineering trick that makes models more stable. It can be read as an explicit preference: unless the data provide enough evidence, do not let parameters become too extreme.

This post puts Ridge, Lasso, and weight decay on the same map. Exams often ask about penalty forms, the bias-variance tradeoff, and what happens to coefficients. ML/AI work asks how to tune regularization strength with validation, what happens when features are highly correlated, and whether regularization can fix data leakage.

## What Loss Plus Penalty Does

Regularization is often written as:

```text
minimize loss + lambda * penalty
```

`loss` measures how well the model fits the data. `penalty` measures whether parameters are too large, too complex, or too unstable. `lambda` controls how much training-set fit you are willing to trade for a more conservative model.

When `lambda` is larger, the model is more restricted. Coefficients usually become smaller, variance may fall, and bias may rise.

When `lambda` is smaller, the estimate is closer to the unregularized estimate. The training data may look better, but new-data performance can be less stable.

That is the bias-variance tradeoff. Regularization accepts some bias in exchange for lower variance, with the goal of improving performance on new data.

## Ridge Shrinks Coefficients

Ridge regression uses an L2 penalty:

```text
sum_j beta_j^2
```

The objective can be written as:

```text
RSS + lambda sum_j beta_j^2
```

Ridge pulls coefficients toward 0, but it usually does not make them exactly 0. It is especially useful when predictors are highly correlated. With multicollinearity, OLS can distribute weight across correlated variables in an unstable way; across samples, one coefficient may jump, shrink, or even change direction.

Ridge penalizes large coefficients and makes the solution more stable. It often keeps both correlated variables, while shrinking them together.

## Lasso Shrinks and Can Select Variables

Lasso uses an L1 penalty:

```text
sum_j |beta_j|
```

The objective is:

```text
RSS + lambda sum_j |beta_j|
```

Lasso can push some coefficients exactly to 0. That gives it both regularization and variable-selection behavior.

This is attractive when there are many features. The model can become more conservative, more sparse, easier to deploy, and easier to explain.

But Lasso can be unstable among highly correlated features. If two features both carry signal, Lasso may keep one and set the other to 0. With a different sample, the selected feature may switch.

## Worked Example: Compare Regularized Objectives

Suppose model A and model B have training losses:

```text
loss(A) = 100
loss(B) = 94
```

By training loss alone, B looks better.

Now add an L2 penalty with `lambda = 0.5`. The sums of squared coefficients are:

```text
penalty(A) = 6
penalty(B) = 24
```

The regularized objectives are:

```text
objective(A) = 100 + 0.5 * 6 = 103
objective(B) = 94 + 0.5 * 24 = 106
```

After the penalty, A is preferred. B fits the training data better, but it uses much larger coefficients. If the concern is generalization, A may be the more stable choice.

## How Lambda Should Be Chosen

`lambda` should not be chosen by training loss alone. If you only look at training data, the smallest `lambda` often wins because it gives the model the most freedom.

A better workflow uses a validation set or cross-validation. Train models with different `lambda` values on the training data, select by validation performance, and reserve the test set for one clean report.

In an exam answer, say that regularization strength is a tuning parameter. It should be selected by out-of-sample performance, not by using the same training data for fitting, selection, and evaluation.

## Weight Decay, Dropout, and Early Stopping

Deep learning uses more than Ridge and Lasso.

Weight decay is closely related to L2 regularization. It discourages weights from becoming too large.

Dropout randomly disables some units during training, forcing the model not to depend too heavily on specific paths.

Early stopping stops training when validation performance begins to worsen, before the model continues memorizing training details.

The forms differ, but the goal is similar: control model complexity and improve generalization.

## Where This Shows Up in ML/AI

Regularization is a basic tool for stopping models from memorizing the training data. It matters especially when data are limited, features are many, the model is large, or labels are noisy.

In LLMs and deep models, you may not manually write a Ridge objective every day, but weight decay, dropout, early stopping, and data augmentation all handle related risks. When model capacity is high, training performance can be impressive; validation and test performance carry the real evidence.

Regularization is not a cure-all. It cannot fix data leakage, wrong labels, or a train-test distribution mismatch. It only helps at the model-complexity layer.

## How to Recognize the Problem

When you see `loss + lambda penalty`, separate the loss from the penalty.

When you see L2, Ridge, or weight decay, focus on shrinking coefficients and reducing variance.

When you see L1 or Lasso, focus on sparse solutions and variable selection.

When the question mentions bias-variance tradeoff, explain how changing `lambda` changes model freedom.

When the question is about ML tuning, return to validation or cross-validation.

## Common Mistakes

- Treating regularization as simply making the model worse, instead of controlling generalization risk.
- Assuming Ridge automatically selects variables; Ridge usually shrinks coefficients without setting them to 0.
- Assuming Lasso always selects the truly important feature among correlated features.
- Choosing `lambda` by training loss.
- Expecting regularization to repair data leakage or distribution shift.

## Practice

1. Compare Ridge and Lasso by penalty form, coefficient effect, and whether sparse solutions may appear.
2. Write `loss + lambda * penalty` and explain what usually happens to model complexity as `lambda` increases.
3. If `loss(A)=80`, `penalty(A)=4`, `loss(B)=76`, `penalty(B)=16`, and `lambda=0.5`, which objective is smaller?
4. Why can regularization increase bias but reduce variance? Connect the answer to the bias-variance tradeoff.
5. In deep learning, how do weight decay, dropout, and early stopping each help control overfitting?

## What Comes Next

Regularization still assumes that a model form has been chosen. The next post looks at nonparametric methods: if you do not want to compress the data into a distribution described by a small fixed set of parameters, what more flexible inference and modeling tools are available?

## Section-Level Source Map

- OpenIntro and OpenStax support the regression, MSE, and model-complexity language needed before regularization.
- Stanford CS109 supports statistical intuition for generalization, model selection, and overfitting.
- scikit-learn supports Ridge, Lasso, regularized models, and validation-based tuning contexts.

## References

- [Regularization, Ridge, Lasso, L1/L2 penalties, weight decay, and bias-variance tradeoff: OpenIntro Statistics](https://www.openintro.org/book/os/)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
