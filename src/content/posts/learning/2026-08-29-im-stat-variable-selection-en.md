---
title: "How Does Variable Selection Avoid Memorizing the Training Data?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 40
tldr: "Variable selection is not only about choosing predictors. It is about avoiding noisy training-set wins that do not generalize."
description: "Statistics from Exams to ML/AI, post 40: adjusted R-squared, AIC, BIC, selection procedures, cross-validation, leakage, and ML feature selection."
draft: true
---

> [中文版](/posts/learning/2026-08-29-im-stat-variable-selection)

Variable selection sounds like a question about which predictors should enter the model. The harder question is: how do you know the selected variables are stable signals rather than noise that happened to look good in the training data?

In exams, this shows up as adjusted R-squared, AIC, BIC, forward selection, and backward elimination. In ML/AI work, it becomes feature selection, cross-validation, data leakage, and deployment cost.

## Why Training Scores Overstate Improvement

In ordinary linear regression, adding a variable usually cannot decrease training-set R-squared. The model receives another degree of freedom. At worst it can mostly ignore the new variable; if the variable happens to fit a bit of noise, R-squared can rise.

That is the core risk in variable selection. The more flexible the model becomes, the easier it is to look better on the training data. New data may not improve.

So the real question becomes:

```text
Is the improvement from the new variable large enough to justify added complexity, variance, and maintenance cost?
```

This question runs through adjusted R-squared, AIC/BIC, cross-validation, and regularization.

## Adjusted R-Squared Penalizes the Number of Variables

R-squared measures how much in-sample variation the model explains, but it is too friendly to adding predictors. Adjusted R-squared accounts for sample size and the number of predictors, adding a penalty for complexity.

If a new variable raises R-squared only slightly but adds model complexity, adjusted R-squared may fall.

An exam answer can say: although raw R-squared increased, adjusted R-squared decreased, so the in-sample improvement from the added variable was not enough to overcome the complexity penalty.

## AIC, BIC, and Cross-Validation Ask Different Questions

AIC and BIC both balance fit and complexity, but the penalty strength differs. AIC is often more prediction-oriented. BIC penalizes complexity more strongly, especially as sample size grows.

They are usually used as "smaller is better" criteria. At the introductory level, you do not need to derive them fully. You do need to know that they are not simply likelihood. Extra parameters have to pay a penalty.

Cross-validation takes a different approach. It splits the data into training and validation folds and estimates performance on data the model did not use for fitting. This is closer to the ML question: does the model generalize?

A useful comparison is:

- Adjusted R-squared: corrects R-squared's preference for more variables inside regression.
- AIC/BIC: compare models by likelihood with a complexity penalty.
- Cross-validation: estimates out-of-sample performance by data splitting.

## Selection Procedures Create Bias Too

Forward selection starts from an empty model and adds the most helpful variable one step at a time.

Backward elimination starts from a full model and removes the least useful variable one step at a time.

All-subsets selection tries many variable combinations and chooses by a criterion.

These procedures are convenient, but they search through many models. The more models you try, the easier it is to find a combination that looks good by chance in the training data. After model selection, p-values, confidence intervals, and coefficient interpretations are affected by the selection process.

An exam may not require post-selection inference, but you should know the warning: standard inference after selection can be too optimistic if the selection process is ignored.

## Worked Example: R-Squared Rises, Adjusted R-Squared Falls

Suppose model A uses 3 predictors:

```text
R2 = 0.64
adjusted R2 = 0.62
```

Model B adds a fourth predictor:

```text
R2 = 0.65
adjusted R2 = 0.61
```

Raw R-squared says model B is higher. Adjusted R-squared says the fourth predictor's in-sample improvement is too small to justify the added complexity.

An exam answer can write: model B's training-set explanatory power rose slightly, but adjusted performance worsened; if the goal is interpretation or generalization, model B should not be chosen merely because raw R-squared increased.

If this is ML feature selection, the next step would not stop at adjusted R-squared. You would check whether model B performs better on a validation set or under cross-validation.

## Leakage Is the Big Feature-Selection Trap

The most common practical mistake is selecting features using the full dataset and then splitting into train/test. Information from the test set has already entered the selection process.

The correct workflow puts feature selection inside the training pipeline. In each cross-validation fold, features must be selected using only that fold's training data, then evaluated on the validation fold.

If the full dataset is inspected first, the model may select features that happen to favor the test set. Test performance then looks good, but production performance drops.

This also happens in AI evaluation. If you inspect all benchmark questions first and then choose the prompt, tools, or reranker that work best for those questions, the final score is no longer a clean estimate of generalization.

## Where This Shows Up in ML/AI

Feature selection affects more than accuracy.

Too many features increase training cost, inference latency, data-pipeline maintenance, and leakage risk. Every extra feature is another place where production can have missing values, delays, format drift, or permission mismatches.

Too few features also have a cost. The model may miss important signals or leave confounders in the residuals.

In LLM systems, variable selection can correspond to retrieval features, reranker features, prompt metadata, user context, or tool-output fields. For each signal, ask: does it look good only in offline evaluation, or can it be obtained reliably in production? Does it leak the answer? Does it make the system harder to maintain?

## How to Recognize the Problem

When R-squared and adjusted R-squared appear together, focus on the complexity penalty.

When AIC or BIC appears, remember that smaller is usually better and that fit is being balanced against model size.

When cross-validation appears, return to out-of-sample performance.

When forward, backward, or all-subsets selection appears, explain the search procedure and then mention that repeated model search can make inference too optimistic.

When ML feature selection appears, first check data splitting and leakage.

## Common Mistakes

- Choosing variables only by training-set R-squared.
- Treating adjusted R-squared, AIC, BIC, and cross-validation as the same kind of criterion.
- Trusting standard p-values after variable selection without considering selection bias.
- Selecting features on the full dataset before train/test splitting.
- Chasing the highest score while ignoring feature availability, stability, and deployment maintenance.

## Practice

1. Explain the difference between forward selection, backward selection, and all-subsets selection.
2. Why does choosing variables only by training-set R-squared tend to overfit?
3. Model A has `R2 = 0.64` and `adjusted R2 = 0.62`; model B has `R2 = 0.65` and `adjusted R2 = 0.61`. How would you interpret this?
4. What cost does AIC, BIC, and cross-validation each bring into model selection?
5. In ML feature selection, why must feature selection be placed inside the cross-validation pipeline?

## What Comes Next

Variable selection handles model complexity and generalization. The next post turns to regularization: instead of selecting variables first and estimating the model afterward, we can penalize large coefficients during estimation so the model becomes more conservative.

## Section-Level Source Map

- OpenIntro and OpenStax support multiple regression, model comparison, and the basics of choosing explanatory variables.
- Stanford CS109 supports train/test thinking and the entry point into generalization error.
- scikit-learn supports feature selection, cross-validation, and model-selection workflows.

## References

- [Variable selection, adjusted R-squared, AIC, BIC, cross-validation, feature selection, and model selection: OpenIntro Statistics](https://www.openintro.org/book/os/)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
