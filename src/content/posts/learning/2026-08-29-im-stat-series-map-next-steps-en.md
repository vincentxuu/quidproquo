---
title: "After 53 Posts, How Do You Connect Statistics to ML, Causality, and Mathematical Statistics?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 53
tldr: "The series does not finish all of statistics. It gives beginners a working map for exams, ML/AI evaluation, causality, Bayesian thinking, time series, and mathematical statistics."
description: "Statistics from Exams to ML/AI, post 53: the full learning map, exam prep path, ML evaluation path, causality path, Bayesian path, time-series path, and mathematical statistics path."
draft: false
---

> [中文版](/posts/learning/2026-08-29-im-stat-series-map-next-steps)

At this point, you have not "finished statistics." Statistics is much larger: mathematical statistics, causal graphs, Bayesian computation, time-series models, books on experimental design, ML theory, and more. The goal of these 53 posts is more practical: help a beginner move from exam basics to ML/AI evaluation, and know how to decompose new problems.

This final post turns the series into one map. It adds no new formulas. The point is to see what you now have, what is still only introductory, and which path to deepen next.

## What Problem This Solves

After reading this series, a beginner should be able to do five things:

```text
1. Recognize whether a problem is about description, probability, inference, modeling, experiment, or reporting
2. Choose a basic method instead of applying formulas by keyword
3. Perform common calculations: expectation, variance, confidence intervals, tests, regression, MLE, Bayesian updating
4. State assumptions, limitations, and conclusions
5. Connect statistics to ML/AI evaluation, A/B testing, causal claims, and monitoring
```

This is not the same as mastering all of statistics. It is a foundation: enough to handle common exam questions and start reading ML/AI reports without being led by one score or a nice chart.

## Core Intuition

The series has three layers.

Layer One is basic tools. You learned data summaries, probability, random variables, common distributions, expectation, variance, sampling distributions, and the CLT. This layer gives you the language of statistics.

Layer Two is inference. You learned confidence intervals, hypothesis tests, p-values, power, two-sample comparisons, chi-square tests, ANOVA, regression, and past-paper decomposition. This layer moves from samples to populations and shows how uncertainty enters conclusions.

Layer Three is modeling and application. You learned MLE, Fisher information, likelihood-ratio tests, Bayesian inference, bootstrap, logistic regression, GLMs, model diagnostics, regularization, causality, time series, missing data, and evaluation reports. This layer puts statistics into ML/AI, experiments, and reporting.

When a new problem appears, use this five-part checklist:

```text
data: where did the data come from?
target: what is being estimated or compared?
assumption: what assumptions does the method need?
calculation: which statistic should be computed?
conclusion: what can the result support, and what can it not support?
```

## Six Next Paths

The next step depends on the goal.

**Exam Path**

The goal is speed, accuracy, and clear written explanations. Next steps:

```text
1. Verify official PDF problem statements item by item
2. Label each question by chapter, formula, and trap
3. Add complete hand solutions
4. Build an error notebook
5. Redo a weekly cycle
```

This path cares most about recognition, calculation, and interpretation sentences.

**ML Evaluation Path**

The goal is to write and review ML/AI evaluation reports. Next topics:

```text
classification metrics
calibration
cross-validation
bootstrap evaluation
paired model comparison
segment analysis
online experiment
```

This path is the easiest to use immediately in work.

**Causal Inference Path**

The goal is to separate prediction, association, and effect. Next topics:

```text
potential outcomes
causal graphs
backdoor adjustment
propensity score methods
difference-in-differences
instrumental variables
sensitivity analysis
```

This path fits product experiments, policy evaluation, ads, and recommender systems.

**Bayesian Path**

The goal is to reason with prior, likelihood, and posterior uncertainty. Next topics:

```text
conjugate priors
hierarchical models
MCMC
posterior predictive checks
Bayesian decision theory
```

This path is useful for small samples, grouped data, and settings where prior knowledge matters.

**Time-Series Path**

The goal is to handle data that changes over time. Next topics:

```text
ARIMA
state space models
forecast evaluation
change point detection
seasonality modeling
drift monitoring
```

This path fits forecasting, monitoring, operations metrics, and deployed model observation.

**Mathematical Statistics Path**

The goal is to understand the theory behind inference tools. Next topics:

```text
probability theory
estimation theory
asymptotic normality
likelihood theory
decision theory
measure-theoretic probability
```

This path is slower, but it makes advanced textbooks and research papers more readable.

## Worked Example: Decompose a New Evaluation Question

Suppose you see a new model-evaluation problem:

> A company compares two recommendation models. The new model has higher overall click-through rate, but retention among new users drops. Should it launch?

Do not guess the formula first. Use the five-part checklist.

**data**

Did the data come from offline tests, historical logs, or an online A/B test? If it is historical log data, the old recommendation policy may create selection bias.

**target**

Is the target CTR, retention, revenue, or long-term satisfaction? Higher CTR does not automatically mean a better product.

**assumption**

If this is an A/B test, did randomization work? Is there sample ratio mismatch? If this is observational data, what confounders exist?

**calculation**

CTR difference can be handled as a two-proportion comparison. Retention can also be compared as a proportion. If the same users or queries are compared across two models, use paired comparison. If the sample is not large, use bootstrap to inspect the difference distribution.

**conclusion**

A good answer might be:

```text
The new model improves CTR, but retention among new users drops. If retention is a guardrail metric, CTR improvement is not enough to support full launch. First check randomization, segment effects, and the confidence interval for the retention drop. If the drop is concentrated among new users, restrict rollout or revise the ranking strategy before retesting.
```

This is the habit the series is meant to build: decompose data and question first, choose a method second, and put limitations into the conclusion.

## Where This Shows Up in ML/AI

ML/AI is full of statistical questions.

Training data are sampling problems. Loss is a proxy for expected risk. Validation estimates generalization. Benchmarks involve sampling and measurement. A/B testing is experimental design. Causal claims need counterfactuals. Monitoring is time series. Fairness needs subgroup estimation and uncertainty. Agent evaluation needs reruns, sampling, error analysis, and reproducibility.

Statistics is not an appendix to ML/AI. It is the language behind questions like: is this model really better, can this experiment support its conclusion, and is this report trustworthy?

## How Sources Are Used

- Official past-paper PDFs are used only for years, subject names, and problem statements; two years of questions are not treated as the full future scope.
- The grad-exam-prep pages are used for study-route, question-index, and practice-flow alignment, not as official solutions.
- OpenIntro, OpenStax, and other open textbooks are used to verify formulas, definitions, assumptions, and common derivations.
- Stanford CS109 and scikit-learn documentation are used to connect each topic to ML/AI training, evaluation, experiments, and uncertainty reporting.

## Problem Recognition Hints

- Treat the series as a problem-classification map, not a formula list.
- For any problem, first decompose data, target, assumption, calculation, and conclusion.
- Exam practice still needs official problem-statement verification and complete hand calculations.
- For ML/AI extension, begin with evaluation reports and A/B testing because they are immediately useful.
- When a new question appears, ask whether it belongs to description, probability, inference, modeling, experiment, or reporting.

## Common Mistakes

- Finishing the series and stopping all practice. Statistics becomes usable through repeated problems.
- Treating two years of past papers as the full future exam scope. They are an entry point, not a boundary.
- Memorizing formulas without practicing interpretation sentences.
- Looking only at ML/AI application terms without returning to the statistical problem.
- Ignoring English synchronization and human review before publication.

## Practice

1. Group the 53 posts into three layers: foundations, inference, and modeling applications. Pick three weak topics from each layer.
2. Take one past-paper or mock problem, identify the statistical tools it needs, and map them back to the series.
3. Choose one next path: mathematical statistics, ML evaluation, causal inference, Bayesian work, or time series. Write a four-week study plan.
4. Write a pre-exam checklist with columns for formulas, problem recognition, hand calculation, interpretation sentences, and ML/AI applications.
5. Find one ML/AI benchmark report and check whether it includes data version, metric definition, uncertainty, segment error analysis, and limitations.

## What Comes Next

The main line of the series is now structurally complete. Before publication, the remaining work is review: read the posts as a learner, verify official past-paper wording where used, check English-Chinese alignment, and decide which drafts are ready to publish.

## Section-Level Source Map

- The full series uses OpenIntro, OpenStax, Stanford CS109, and scikit-learn as sources for statistical foundations, inference language, and ML/AI connections.
- The NTU Library past-exam system and the prep page are used as exam context and problem-type entry points; 114-115 problem statements still require item-by-item PDF verification.
- This post is a study map and next-step guide. It does not add unverified exam predictions or treat two years of past papers as the full future scope.
- The next paths separate exams, ML evaluation, causality, Bayesian statistics, time series, and mathematical statistics so "introductory command" is not confused with "finishing statistics."

## References

- [Statistics learning map, exam prep, ML evaluation, causal inference, Bayesian statistics, and next steps: OpenIntro Statistics](https://www.openintro.org/book/os/)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
