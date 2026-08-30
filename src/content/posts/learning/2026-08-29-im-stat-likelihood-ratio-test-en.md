---
title: "How Does the Likelihood Ratio Test Compare Nested Models?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 27
tldr: "The likelihood-ratio test compares the log likelihood of a restricted model with a full model; the usual chi-square reference only makes sense under nested-model and approximation conditions."
description: "A beginner guide to the likelihood-ratio test: full model, restricted model, nested condition, chi-square approximation, and ML model comparison."
draft: true
---

> [中文版](/posts/learning/2026-08-29-im-stat-likelihood-ratio-test)

MLE finds the most plausible parameter inside one model. The Likelihood Ratio Test, or LRT, asks the next question: if we compare a simpler restricted model with a more flexible full model, does the extra flexibility make the observed data much more plausible?

This question appears often. You may ask whether an added predictor is useful, whether a logistic-regression coefficient should remain, or whether a constraint is too strong. LRT compares models using likelihood, not only one coefficient's t statistic.

## Full Model and Restricted Model

The two models in an LRT are usually nested. A restricted model should be obtainable from the full model by adding constraints.

For example:

```text
Full model:       logit(p) = beta0 + beta1 x1 + beta2 x2
Restricted model: logit(p) = beta0 + beta1 x1, with beta2 = 0
```

The restricted model is a special case of the full model. Setting `beta2 = 0` returns the simpler model.

The intuition is that the full model is more flexible, so its likelihood will usually not be worse than the restricted model. The real question is whether the improvement is large enough to justify the added flexibility.

## How to Compute the Statistic

The common LRT statistic is:

```text
2(log L_full - log L_restricted)
```

Because the full model usually has larger log likelihood, this value is usually nonnegative. If the models differ a lot, the statistic becomes large.

Under common regularity conditions, and when the models are nested, the statistic is approximately chi-square:

```text
2(log L_full - log L_restricted) ~ chi-square(df)
```

The degrees of freedom are usually the difference in the number of parameters between the two models.

## Worked Example: Two Log Likelihoods

Suppose the full model has:

```text
log L_full = -120
```

and the restricted model has:

```text
log L_restricted = -126
```

The LRT statistic is:

```text
2(log L_full - log L_restricted)
= 2(-120 - (-126))
= 2(6)
= 12
```

If the full model has 2 more parameters than the restricted model:

```text
df = 2
```

Compare 12 with `chi-square(df = 2)`. At the 5% level, the critical value is about 5.991. Since 12 is larger, reject the restricted model.

A contextual conclusion is:

The data provide statistical evidence that the restricted model is too constrained; the full model improves likelihood more than would be expected from the extra parameters alone under the reference approximation.

## Why the Nested Condition Matters

The usual chi-square approximation for LRT depends on nested models and regularity conditions. If two models are not nested, for example one model uses `x1` and another unrelated model uses `x2`, you cannot directly use the same chi-square approximation as the standard answer.

For non-nested comparison, analysts often use AIC, BIC, cross-validation, held-out log loss, or other model-selection tools. The question is similar: compare model performance while accounting for complexity and generalization risk.

When an exam mentions LRT, check these before substituting numbers:

```text
Are the models nested?
Which model is restricted?
How many additional parameters does the full model have?
```

Those three questions matter more than rushing to the formula.

## Where This Shows Up in ML/AI

Traditional LRT is not always used directly in ML, but model comparison is constant. You compare feature sets, prompt templates, rerankers, classifiers, and model variants. A more flexible model often fits training data better. The question is whether the improvement is real and generalizable.

LRT teaches a useful discipline: improvements from extra parameters or flexibility should be judged against complexity and uncertainty. That spirit connects to validation loss, AIC/BIC, and cross-validation.

In logistic regression or GLMs, LRT is often used to compare a full model with a restricted model that removes some variables. If the LRT is significant, the constrained-away parameters have evidence as a group.

## Common Mistakes

Mistake 1: applying the chi-square approximation without checking whether the models are nested.

Mistake 2: reversing full and restricted log likelihoods and getting a negative statistic.

Mistake 3: using the wrong degrees of freedom instead of the parameter-count difference.

Mistake 4: saying every added parameter is individually significant after a significant LRT. The test is about the group restriction.

Mistake 5: comparing ML models only by training loss without handling complexity and generalization.

## Practice

1. Given `log L_full = -80` and `log L_restricted = -85`, compute the LRT statistic.
2. If the full model has 2 more parameters, write the approximate reference distribution and degrees of freedom.
3. Explain what nested models are, then give one non-nested counterexample.
4. When comparing models by validation loss, explain how the question resembles LRT's concern.

## Next

LRT uses likelihood for model comparison. The next post studies the Neyman-Pearson view: under a fixed Type I error rate, how do we design the most powerful rejection rule?

## Section-Level Source Map

- OpenIntro and OpenStax: likelihood ratios, hypothesis testing, chi-square approximations, and model-comparison foundations.
- Stanford CS109: likelihood thinking and nested-model comparison intuition.
- scikit-learn: validation loss, cross-validation, and model-selection context.
- NTU IM prep pages: topic placement and practice-flow alignment; not used as official solutions.

## References

- [Likelihood-ratio tests in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: Hypothesis Testing and Chi-Square Tests](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109: Probability for Computer Scientists](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation: Log Loss and Scoring](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [scikit-learn Cross-Validation and Model Selection](https://scikit-learn.org/stable/modules/cross_validation.html)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
