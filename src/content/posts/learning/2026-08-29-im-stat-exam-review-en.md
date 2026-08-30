---
title: "When a Mixed Problem Appears, How Do You Pick the Tool in 30 Seconds?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 20
tldr: "At the final review stage, train problem recognition: identify data type, unknown quantity, and decision goal before choosing a formula and writing a contextual conclusion."
description: "A Layer One statistics exam review: 30-second tool selection, 14-day schedule, mistake classification, and ML/AI evaluation problem analysis."
draft: true
---

> [中文版](/posts/learning/2026-08-29-im-stat-exam-review)

Mixed problems are usually the most stressful part of exam preparation. A prompt may describe data collection, ask for an estimation range, then require a test or a regression-table interpretation. If you only search for keywords, you can choose the wrong tool at the first step.

At the end of Layer One, the goal is to build a usable exam sequence. After reading a problem, spend the first 30 seconds answering three questions: what type of data is this, does the problem ask for estimation, testing, comparison, or modeling, and does the answer require numbers, interpretation, or both?

## The 30-Second Tool Table

Layer One can be summarized as this table:

| Problem clue | First tool to consider | Check first |
| --- | --- | --- |
| Center and spread of one numeric dataset | descriptive statistics, mean, variance | outliers, units |
| Events, conditions, independence | probability, conditional probability, Bayes | which event is in the denominator |
| PMF, CDF, joint table | random variables, marginalization, conditional distribution | all cells listed, total probability equals 1 |
| Sample mean to population mean | standard error, CLT, confidence interval | whether `sigma` is known, whether sample size is reasonable |
| Difference or effect | hypothesis test | `H0`/`H1`, one-tailed or two-tailed, `alpha` |
| Two group means or proportions | two-sample, paired, or two-proportion method | independent or paired, numeric or binary outcome |
| Categorical count table | chi-square goodness-of-fit or independence | one categorical variable or two |
| Three or more group means | ANOVA | numeric outcome, follow-up comparison needed |
| One X predicting one Y | simple linear regression | slope, intercept, residuals, causal limits |
| Regression output table | coef, SE, t, F, R-squared | single coefficient, overall model, explanatory power |
| Binary outcome | logistic regression | log odds, odds ratio, threshold |

This table is not for memorizing formulas. It is for training the first move. While practicing, cover the formulas and force yourself to write what kind of data problem the prompt is asking.

## How to Spend 14 Days

If only two weeks remain, split the review into three stages.

First 5 days: repair foundations. Pick one area per day: descriptive statistics, probability, random variables, sampling distributions, confidence intervals and tests. Do not only read solutions. Write what each tool answers.

Middle 6 days: work mixed problems. Each day, solve at least one set and require full answers: data type, unknown quantity, tool, formula, substitution, conclusion. When an answer is wrong, label the cause.

Final 3 days: repair mistakes and answer format. Do not open many new topics at this point. New topics can create the illusion that everything is missing. The real score loss often comes from holes you already saw: reversed `H0` and `H1`, wrong p-value explanation, incorrect CI wording, paired and independent samples mixed up, or regression coefficients written as causal effects.

## Worked Example: Do Two Model Accuracies Differ?

Suppose the prompt says:

Model A and Model B have accuracies of 84% and 86%. Decide whether their performance differs.

Do not immediately answer that B is better. Split the problem:

```text
data type: each item is correct/incorrect, a binary outcome
unknown quantity: difference in model accuracies, or paired difference on the same items
tool: two-proportion comparison, paired comparison, or bootstrap
first follow-up question: did both models answer the same test items?
```

If the two models answered different items and the two item sets can be treated as independent, the problem is closer to a two-proportion comparison. If both models answered the same items, the data are paired. Item difficulty affects both models, so you should examine item-level wins and losses rather than only total scores.

Sample size also matters. With only 100 questions, a two-point gap may be unstable. With 50,000 questions, the gap may be statistically clear but still require a product-cost decision.

A complete answer has three layers:

```text
gap: B's observed accuracy is 2 percentage points higher.
uncertainty: the test design determines the standard error, confidence interval, or test.
decision: use B only if the gap is stable and the practical costs are acceptable.
```

## How to Record Mistakes

A mistake log should not only copy the correct answer. Each problem should receive at least one error type:

| Error type | Symptom | Repair |
| --- | --- | --- |
| Concept error | saying the p-value is the probability that H0 is true | rewrite the definition and one plain-language example |
| Tool error | using independent two-sample logic for paired data | add the "same subjects or same items?" check |
| Substitution error | forgetting `sqrt(n)` in a standard error | recompute two similar problems |
| Arithmetic error | wrong degrees of freedom, critical value, or sum of squares | write intermediate steps |
| Conclusion error | only writing reject H0 without context | add one complete sentence tied to the prompt |

The last category is often underestimated. Statistics exams are not pure arithmetic. If you compute `t = -2` or CI `[77.872, 86.128]`, you still need to say what that means for processing time, population mean, or model performance.

## Where This Shows Up in ML/AI

ML/AI work is full of mixed problems: data quality, model selection, metrics, A/B testing, error analysis, and uncertainty. Layer One trains the order of problem analysis, and that skill carries into model evaluation and product experiments.

For a model evaluation report, ask:

```text
data: does the test data represent production use?
metric: is the score accuracy, F1, AUC, loss, or win rate?
comparison: is this one model against a baseline or several models?
uncertainty: is there a confidence interval, test, or bootstrap?
decision: is the gap enough to support replacing a model, launching a product change, or changing a workflow?
```

This sequence keeps you from being led by leaderboards alone. Statistics adds a second layer to the report: what risks remain behind the score?

## Common Mistakes

Mistake 1: applying a formula from keywords before identifying the data type.

Mistake 2: practicing calculations but not practicing `H0`/`H1`, confidence-interval interpretation, or regression-coefficient language.

Mistake 3: correcting wrong answers without labeling the error cause.

Mistake 4: opening many new topics in the final three days instead of repairing known weaknesses.

Mistake 5: misunderstanding the ML/AI connection as a claim that exams will directly test AI terms. The point is to learn the same statistical judgment.

## Practice

1. Take your latest 10 wrong problems and classify each as concept, tool, substitution, arithmetic, or conclusion error.
2. Build a 14-day schedule: 5 foundation days, 6 mixed-problem days, and 3 mistake-repair days.
3. Pick one mixed problem and write the data type and goal before choosing a formula.
4. Write an ML/AI evaluation analysis using data, metric, comparison, uncertainty, and decision.

## Next

Layer One closes here. Layer Two makes statistical inference more formal: samples, statistics, sampling distributions, point estimation, method of moments, MLE, Fisher information, LRT, Neyman-Pearson, bootstrap, and Bayesian inference. Layer One helps you solve problems; Layer Two explains why the tools work.

## Section-Level Source Map

- OpenIntro and OpenStax: Layer One problem types, formulas, and answer-language conventions.
- grad-exam-prep: NTU IM statistics prep entry point and past-paper navigation.
- NTU Library Past Exam System: official problem-statement source; formal walkthroughs still require PDF verification.
- Stanford CS109 and scikit-learn: data, metric, uncertainty, and decision language for ML/AI evaluation problems.

## References

- [OpenIntro Statistics: Inference, Regression, and Review Topics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
- [Stanford CS109: Probability for Computer Scientists](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
