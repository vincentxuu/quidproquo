---
title: "How Does Logistic Regression Move From Probability to Thresholds and Error Costs?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 37
tldr: "Logistic regression estimates probabilities first. Classification decisions come later, when thresholds turn those probabilities into actions under real error costs."
description: "Statistics from Exams to ML/AI, post 37: log odds, odds ratios, likelihood, binary cross entropy, thresholds, calibration, and classification error costs."
draft: true
---

> [中文版](/posts/learning/2026-08-29-im-stat-logistic-regression-deep-dive)

Layer One introduced logistic regression as the natural starting point when the target is 0/1. Layer Three asks the questions that usually get mixed together in real reports: after logistic regression estimates a probability, why do we still need a threshold? How do coefficients, likelihood, confusion matrices, and error costs fit into one workflow?

This distinction matters. Training estimates probabilities. Product decisions turn probabilities into labels. Accuracy, precision, and recall evaluate the labels after a threshold has been applied. If these layers are not separated, it is easy to see a significant coefficient and conclude that the classification decision is also reasonable.

## Why Log Odds Are Used

Logistic regression does not set `p` equal to a straight line. A probability must stay between 0 and 1, while a linear combination such as `X beta` can be any real number. If we used it directly as a probability, the model could predict negative probabilities or values above 1.

The model instead makes log odds linear:

```text
log(p / (1 - p)) = beta0 + beta1 x1 + ... + betak xk
```

The term `p / (1 - p)` is the odds. If `p = 0.8`, then:

```text
0.8 / 0.2 = 4
```

The event is four times as likely as the non-event. Taking the log moves odds onto a scale that can be connected to a linear predictor.

## Coefficients Are Odds Ratios

With one predictor, the model is:

```text
log(p / (1 - p)) = beta0 + beta1 x
```

`beta1` means that when `x` increases by one unit, log odds increase by `beta1`. On the odds scale:

```text
odds ratio = exp(beta1)
```

If `beta1 = 0.7`, then:

```text
exp(0.7) approximately 2.01
```

The interpretation is: holding other variables fixed, a one-unit increase in `x` multiplies the odds of the event by about 2.01.

This is not a probability increase of 0.7. It also does not mean the probability doubles. The same odds ratio turns into different probability changes depending on the baseline probability.

## Likelihood and Binary Cross Entropy

For each observation, `y_i` is either 0 or 1. The model predicts event probability `p_i`. The Bernoulli likelihood contribution is:

```text
p_i^(y_i) (1 - p_i)^(1 - y_i)
```

The log likelihood over all observations is:

```text
sum_i [y_i log(p_i) + (1 - y_i) log(1 - p_i)]
```

MLE maximizes this log likelihood. In machine learning, binary cross entropy is usually the negative log likelihood:

```text
- sum_i [y_i log(p_i) + (1 - y_i) log(1 - p_i)]
```

So logistic regression is not separate from ML classification loss. It is the probabilistic-model version of a binary classifier.

## Worked Example: Coefficient to Probability to Class

Suppose the model is:

```text
log(p / (1 - p)) = -1 + 0.8x
```

When `x = 2`:

```text
log odds = -1 + 0.8 * 2 = 0.6
odds = exp(0.6) approximately 1.82
```

Convert odds back to probability:

```text
p = odds / (1 + odds)
  = 1.82 / 2.82
  approximately 0.65
```

If the threshold is 0.5, this observation is classified as positive.

If the positive class is "high-risk transaction" and blocking a normal transaction is expensive, the product team may raise the threshold to 0.8. The same observation, with `p = 0.65`, would no longer be classified as positive.

The model did not change. The decision rule changed. That is the main boundary between logistic regression as probability estimation and classification as an action rule.

## Thresholds Are Error-Cost Decisions

Lowering the threshold usually catches more positives, so recall rises. It may also create more false positives, so precision can fall.

Raising the threshold usually makes positive predictions more conservative, so precision may rise. It can also miss more true positives, so recall can fall.

That is why 0.5 should not be treated as a law. It is a common default when error costs are symmetric, probabilities are reasonably calibrated, and the class balance does not require special treatment.

Fraud detection, medical screening, LLM safety classification, and spam detection rarely have symmetric false-positive and false-negative costs. The threshold should be designed together with cost, review capacity, and risk tolerance.

## Calibration Also Matters

Logistic regression outputs probability estimates, but a model score of 0.8 does not automatically mean that 80% of such cases will actually occur. That is calibration.

If cases scored near 0.8 occur only 60% of the time, the model's ranking may still be useful, but its probability interpretation is unreliable. This is common in AI systems: a score can be good enough for ranking while still being unsafe to treat as a true risk probability.

Exams often focus first on log odds, odds ratios, and likelihood. Practical reports should also discuss thresholds, confusion matrices, ROC or PR curves, and calibration.

## How to Recognize the Problem

When `Y` is binary, think logistic regression or a Bernoulli GLM.

When the question asks for coefficient interpretation, use log odds or odds ratios. Do not describe the coefficient as a direct probability difference.

When the question mentions thresholds, confusion matrices, precision, or recall, the task has moved from probability estimation to classification decisions.

When the question asks whether predicted probabilities can be trusted, the issue is calibration, not just accuracy.

## Where This Shows Up in ML/AI

Logistic regression remains one of the most important binary-classification baselines. It is simple enough to reveal feature direction, leakage, class imbalance, and threshold-cost problems quickly.

In an LLM safety classifier, a model may estimate the probability that a piece of content violates policy. Whether to block it depends on the threshold. A platform that wants to reduce missed violations may choose a lower threshold. If false blocks are costly, it may raise the threshold or create a human-review band.

In recommendation systems and click-through-rate prediction, logistic regression is also a useful interpretable baseline. Even when the final model is a tree model or deep model, log odds, calibration, thresholds, and PR curves remain part of the reporting language.

## Common Mistakes

- Interpreting a logistic coefficient as a probability increase.
- Forgetting that `exp(beta)` is an odds ratio.
- Training with binary cross entropy but reporting classification results without stating the threshold.
- Reporting only accuracy while ignoring precision, recall, class balance, and error costs.
- Treating model scores as calibrated probabilities without checking calibration.

## Practice

1. Write `log(p/(1-p)) = b0 + b1x` and explain in one sentence how `b1` affects odds.
2. If `b1 = 0.7`, approximate `exp(b1)` and interpret the odds ratio in context.
3. If `log odds = 0.6`, compute the odds and then convert them to a probability.
4. Explain why the classification threshold remains a separate decision after logistic regression outputs a probability.
5. In an AI classifier, what risk appears when accuracy is high but calibration is poor?

## What Comes Next

Logistic regression is one case inside the GLM family. The next post widens the frame: for different response types, which distribution and which link function should be used, and why linear regression, logistic regression, and Poisson regression can sit inside one framework.

## Section-Level Source Map

- OpenIntro and OpenStax support logistic regression, log odds, odds ratios, and binary response models.
- Stanford CS109 supports the probability-modeling language behind classification decisions.
- scikit-learn supports classifiers, thresholds, probability estimates, calibration, and model-evaluation contexts.

## References

- [Logistic regression, log odds, odds ratios, binary cross entropy, and classification thresholds: OpenIntro Statistics](https://www.openintro.org/book/os/)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
