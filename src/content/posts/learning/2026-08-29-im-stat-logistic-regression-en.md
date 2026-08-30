---
title: "Why Should Classification Start With Log Odds?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 17
tldr: "Logistic regression connects a linear score to a probability between 0 and 1. Understanding odds, log odds, and odds ratios prevents wrong coefficient interpretations."
description: "A beginner guide to logistic regression: probability, odds, log odds, sigmoid, odds ratios, classification thresholds, and cross entropy."
draft: true
---

> [中文版](/posts/learning/2026-08-29-im-stat-logistic-regression)

The previous regression posts focused on numeric outcomes: scores, time, revenue, or model metrics. Exams and ML projects often use another kind of outcome: churn or not, admitted or not, default or not, correct or incorrect.

Those are 0/1 outcomes. A straight linear regression line can produce values below 0 or above 1, so it does not naturally behave like a probability.

Logistic regression solves this by first computing a linear score, then converting that score into a probability between 0 and 1. It looks like a classification model, but it still uses regression language: coefficients, interpretation, standard errors, tests, and prediction.

## From Probability to Log Odds

Do not start by memorizing the sigmoid formula. First separate three scales.

The first scale is probability `p`, which ranges from 0 to 1. If a user's churn probability is 0.8, the event is likely under similar conditions.

The second scale is odds:

```text
odds = p / (1 - p)
```

If `p = 0.8`, then:

```text
0.8 / 0.2 = 4
```

The odds of churn versus no churn are 4 to 1.

The third scale is log odds:

```text
log odds = log(p / (1 - p))
```

Logistic regression makes log odds equal to a line:

```text
log(p / (1 - p)) = b0 + b1 x
```

So the direct interpretation of `b1` is not "probability increases by `b1`." It says that when `x` increases by one unit, log odds increase by `b1`.

To translate the coefficient into an odds ratio, use:

```text
odds ratio = exp(b1)
```

## Worked Example: From Linear Score to Probability

Suppose the model is:

```text
log(p / (1 - p)) = -2 + 0.8x
```

For `x = 3`, first compute the linear score:

```text
z = -2 + 0.8 * 3 = 0.4
```

Then use the sigmoid transformation:

```text
p = 1 / (1 + exp(-z))
  = 1 / (1 + exp(-0.4))
  = 0.599
```

A contextual answer is:

Under this model, an individual with `x = 3` has an estimated probability of about 59.9% of belonging to the positive class.

Now interpret the coefficient. Since `b1 = 0.8`:

```text
exp(0.8) = 2.23
```

The odds-ratio interpretation is:

When `x` increases by one unit, the odds of the positive class are estimated to multiply by about 2.23.

This is still an association under the model. Do not write it as a causal effect unless the study design supports causal interpretation.

## Separate Probability Estimation From Classification

Logistic regression first gives a probability. To turn that probability into a class label, you still need a threshold. The common threshold is 0.5, but 0.5 is not a law.

If a model is used to flag fraud, you may prefer a lower threshold so that more suspicious cases get reviewed. If a model is used to automatically reject loans, false positives are costly, so the threshold and process should be more conservative.

Read a classification model as two decisions:

```text
probability estimation: what is the estimated probability of the positive class?
classification decision: given a threshold and error costs, which class should we assign?
```

If an exam asks about logistic-regression coefficients, explain log odds or odds ratios. If it asks about classification performance, move to confusion matrix, precision, recall, and threshold.

## Where This Shows Up in ML/AI

Logistic regression is a basic binary classifier. It can serve as a baseline and as an interpretable model. If a complex model only performs slightly better, you should be able to explain what it solves beyond this simple baseline.

It also connects statistical inference to ML loss. When `Y` is 0/1, logistic regression often uses a Bernoulli likelihood. Maximizing that likelihood corresponds to the binary cross entropy used in machine learning.

That helps explain many classification objectives. The model adjusts the positive-class probability for each observation, then a threshold turns probabilities into decisions.

LLM systems use the same pattern. You may predict whether a response will be accepted, whether an output violates a policy, or whether a retrieval result is relevant. These are binary or nearly binary outcomes. Logistic regression gives a transparent starting point before using more complex classifiers.

## Common Mistakes

Mistake 1: interpreting a logistic-regression coefficient as a direct probability increase.

Mistake 2: mixing odds, log odds, and odds ratios as if they were the same scale.

Mistake 3: saying `p = 0.6` must be classified as positive without naming the threshold.

Mistake 4: evaluating every classifier with accuracy while ignoring precision, recall, and error costs.

Mistake 5: treating a positive coefficient as a causal effect.

## Practice

1. Given `b0 = -1`, `b1 = 0.5`, and `x = 4`, compute `z` and `p = 1 / (1 + exp(-z))`.
2. Convert `b1 = 0.5` into an odds ratio and write one contextual interpretation.
3. Explain what may happen to the number of positive predictions if the threshold moves from 0.5 to 0.8.
4. Design one binary-classifier scenario and write both the probability-estimation question and the classification-decision question.

## Next

Logistic regression depends on conditional probability and binary outcomes. The next post returns to discrete probability tables: joint PMF, marginal distributions, conditional probability, and variable transformations.

## Section-Level Source Map

- OpenIntro and OpenStax: logistic regression, odds, log odds, odds ratios, and coefficient interpretation.
- Stanford CS109: classification probability, likelihood, and Bernoulli models.
- scikit-learn: classifiers, thresholds, classification metrics, and linear-model baselines.
- NTU IM prep pages: topic placement and practice-flow alignment; not used as official solutions.

## References

- [Logistic regression in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: Logistic Regression](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109: Probability for Computer Scientists](https://cs109.stanford.edu/)
- [scikit-learn Linear Models: Logistic Regression](https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression)
- [scikit-learn Classification Metrics](https://scikit-learn.org/stable/modules/model_evaluation.html#classification-metrics)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
