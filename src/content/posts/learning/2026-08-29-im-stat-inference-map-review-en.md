---
title: "How Do Estimation, Testing, Likelihood, and Bayes Fit on One Inference Map?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 35
tldr: "The inference map starts with the question type: point estimate, uncertainty interval, decision test, likelihood model comparison, Bayesian update, or resampling."
description: "A Layer Two review of statistical inference: estimation, standard error, confidence intervals, hypothesis tests, likelihood, LRT, Bayes, bootstrap, and ML/AI evaluation reports."
draft: true
---

> [中文版](/posts/learning/2026-08-29-im-stat-inference-map-review)

By this point in Layer Two, it is normal to feel crowded. You have seen point estimation, standard error, confidence intervals, hypothesis tests, likelihood, LRT, Bayes, and bootstrap. But when a problem appears, the hard part is still deciding where to start.

This post turns Layer Two into an inference map. It adds no new formula. The exam move is to identify what kind of question is being asked. The ML/AI move is similar: decide whether a report needs a point estimate, interval, test, model comparison, or uncertainty update.

## First Question: What Am I Estimating?

Point estimation answers: what is the most reasonable single number?

Sample mean, sample proportion, regression coefficient, MLE, and MAP can all be point estimates.

If the prompt says estimate, find MLE, compute sample mean, or fit coefficient, start with estimation.

But a point estimate is rarely the end. Ask whether the number is stable. If another sample were drawn, how much would it move? That leads to standard error, sampling distributions, and confidence intervals.

## Second Question: Do I Need Uncertainty?

If the prompt asks for confidence interval, standard error, or sampling distribution, the focus is uncertainty in the estimator.

A common path is:

```text
estimate -> sampling variability -> interval
```

If the standard error is clear, use a formula interval. If the sample is large, asymptotic normality may apply. If the target is a transformed function, use the delta method. If the formula is hard or data structure matters, use bootstrap.

These tools are not enemies. They are different ways to answer the same question: how unstable is this estimate?

## Third Question: Am I Making a Decision?

Hypothesis testing answers: under a null hypothesis, is this data extreme enough to reject?

If you see `H0`, `H1`, p-value, alpha, reject, or power, enter testing language.

Tests and confidence intervals often connect. For many two-sided tests, if a 95% confidence interval excludes the null value, the corresponding 5% test rejects that null value. But the language differs: intervals give ranges; tests give decisions.

The Neyman-Pearson view goes one step further. It says to control Type I error first, then seek higher power. That is useful for classifier thresholds, fraud detection, and LLM safety classification.

## Fourth Question: Am I Comparing Models?

Likelihood gives language for compatibility between data and a model. MLE finds the best parameter inside one model. LRT compares nested models and asks whether the full model's extra flexibility creates enough likelihood improvement over the restricted model.

If you see likelihood, log likelihood, full model, restricted model, or nested, first inspect the model relationship. The common chi-square approximation for LRT needs nested conditions. Non-nested model comparison often moves to AIC, BIC, cross-validation, or held-out performance.

In ML/AI, model comparison is not only training score. A more flexible model will often fit training data better. The real report needs validation/test behavior and uncertainty.

## Fifth Question: Am I Updating Belief?

Bayesian inference treats unknown parameters as uncertain quantities and updates them through prior, likelihood, and posterior.

If you see prior, posterior, credible interval, MAP, or conjugate prior, use Bayesian language. Do not mix this with frequentist confidence-interval coverage.

MAP is the posterior mode. Its connection to regularization comes from:

```text
log posterior = log likelihood + log prior + constant
```

A Gaussian prior leads to an L2 penalty. A Laplace prior leads to an L1 penalty. That turns regularization from an engineering trick into a statement of parameter preference.

## Worked Example: One Model Comparison, Five Languages

Suppose Model A answers 405 out of 500 test items correctly, and Model B answers 420 correctly.

First compute point estimates:

```text
A = 405 / 500 = 0.81
B = 420 / 500 = 0.84
difference = 0.03
```

Writing "B is 3 percentage points higher" is only point estimation.

A confidence interval asks whether the gap is stable. If both models answered the same items, use paired differences rather than treating the two accuracies as fully independent. Paired bootstrap can resample items and produce an interval for the difference.

A hypothesis test might set:

```text
H0: A and B have equal performance
H1: B is better than A
```

Then use an appropriate paired test or resampling method to decide whether the data support rejecting `H0`.

A likelihood version models correct/incorrect responses as Bernoulli or logistic outcomes and asks whether a model-identity factor is needed.

A Bayesian version assigns priors to A and B accuracies, updates with observed results, then reports `P(p_B > p_A | data)` or a posterior interval for the difference.

The same data can support several analyses. Exams ask you to pick the intended language. Real reports require you to say which language you used.

## How to Organize Mistakes

Do not classify wrong answers only as "confidence interval" or "test." That is too broad.

Map mistakes to the inference map:

- Did I identify the wrong estimand?
- Did I confuse standard deviation and standard error?
- Did I skip approximation conditions?
- Did I mix interval language and test language?
- Did I misread the likelihood model relationship?
- Did I confuse prior, posterior, and MAP?
- Did I ignore paired or clustered data structure?

This kind of review transfers across problem types. Graduate exams can change surface wording while testing the same inference ideas.

## Where This Shows Up in ML/AI

ML/AI experiment reports can use the same map.

For a single model, report a point estimate and uncertainty: accuracy, F1, win rate, latency, and a confidence interval or resampling result.

For two-model comparison, preserve paired design. The same item is usually similarly easy or hard for both models. Comparing only two average scores wastes information and can overstate the gap.

For regularization and model selection, separate training loss, validation performance, and test reporting. Training loss measures fit. Validation supports selection. Test results support final reporting.

When reading papers, this map is also useful. For an ablation table, ask whether uncertainty is reported. For a likelihood objective, ask whether regularization is present. For a Bayesian baseline, ask whether it uses a posterior or only a MAP point estimate.

## Common Mistakes

Mistake 1: treating every problem as formula substitution before identifying the question type.

Mistake 2: mixing confidence intervals, credible intervals, and prediction intervals.

Mistake 3: reporting only a p-value without `H0`, `H1`, significance level, and contextual conclusion.

Mistake 4: using LRT without checking nested models.

Mistake 5: using bootstrap without checking the resampling unit.

Mistake 6: comparing ML models with only point scores and no paired difference or uncertainty.

## Practice

1. Take one model-comparison problem and analyze it in five languages: point estimate, confidence interval, hypothesis test, likelihood, and Bayesian inference.
2. Two models differ by 1.5 percentage points on a 500-item test set, and both answered the same items. Which inference tool would you reach for first, and why?
3. Rewrite this bad report sentence: "The new model has a higher average score, so it is definitely better." Include uncertainty and data limits.
4. Build your own mistake table. For each missed problem, label one cause: standard error, testing language, nested condition, prior/posterior, or resampling unit.

## Next

Layer Two closes here. Layer Three puts inference back into models. The next post starts with OLS: when assumptions fail, how can the regression line still be interpreted, used for prediction, and diagnosed?

## Section-Level Source Map

- OpenIntro and OpenStax: estimation, intervals, tests, and resampling definitions across Layer Two.
- Stanford CS109: sampling distributions, likelihood, and Bayesian updating.
- scikit-learn: model evaluation contexts for choosing the right inference language.
- NTU IM prep pages: topic placement and practice-flow alignment; not used as official solutions.

## References

- [Statistical inference topics in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
