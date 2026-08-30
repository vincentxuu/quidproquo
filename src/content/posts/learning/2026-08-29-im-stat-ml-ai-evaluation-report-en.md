---
title: "How Do You Write an ML/AI Evaluation Report That Is More Than a Leaderboard Score?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 52
tldr: "A useful ML/AI evaluation report turns statistical evidence into a decision: ship, stage, roll back, or run more experiments."
description: "Statistics from Exams to ML/AI, post 52: metric definition, uncertainty, paired comparison, segment analysis, guardrail metrics, raw traces, and decision-ready evaluation reports."
draft: true
---

> [中文版](/posts/learning/2026-08-29-im-stat-ml-ai-evaluation-report)

This series moved from means, variances, distributions, tests, and regression to experimental design, causality, missing data, Monte Carlo, and reproducible workflows. The final practical question is whether you can turn statistical evidence into an ML/AI evaluation report that supports a decision.

A good evaluation report is not just a leaderboard score. It answers whether the data represent the real task, whether the metric matches the product goal, whether the difference is stable, where failures concentrate, whether risk is acceptable, and whether the recommendation is to ship, stage, roll back, or run another experiment.

## What Problem This Solves

Many model reports look like this:

| Model | score |
|---|---:|
| baseline | 0.81 |
| new model | 0.84 |

This table is not enough. It does not say how large the test set is, how the score is computed, whether the gap is stable, which task types got worse, whether cost increased, or whether data leakage occurred.

An evaluation report puts the score back into a decision question:

```text
Should we launch the new model?
```

To answer that question, the report needs at least:

```text
decision: what decision the evaluation supports
data: where the test data came from and which population it represents
metric: how the metric is defined and how it relates to the goal
uncertainty: how stable the difference is
error analysis: where failures concentrate
guardrails: whether cost, latency, safety, or experience worsened
recommendation: action and limitations
```

## Core Intuition

The point is not report length. The point is that every conclusion should trace back to evidence.

A strong conclusion looks like this:

```text
On a 1,200-task customer-support test set, the new model raises task success rate from 72.4% to 75.1%, with a bootstrap 95% CI of about +0.6 to +4.8 percentage points. Long-input tasks drop by 3.9 percentage points, so we recommend staging the launch to short-input traffic first and fixing long-input failures before broader rollout.
```

This sentence states data, metric, effect size, uncertainty, segment risk, and decision.

A weak conclusion says:

```text
The new model is better, so launch it.
```

The reader does not know better where, by how much, or with what risk.

## Formula and Mechanism

A standard ML/AI evaluation report can use this skeleton:

```text
1. Decision question
2. Dataset and split
3. Models / systems compared
4. Metric definitions
5. Main results
6. Uncertainty / statistical comparison
7. Segment and error analysis
8. Guardrail metrics
9. Limitations
10. Recommendation
```

Main results should not be only averages. For classification, include:

```text
accuracy, precision, recall, F1, confusion matrix
```

For generative AI or agents, include:

```text
task success rate, human preference win rate, refusal quality, factuality, tool-call success, latency, cost
```

If two models are evaluated on the same items, think paired comparison first. The same question difficulty affects both models, so pairing can reduce noise. A simple item-level difference is:

```text
d_i = score_new_i - score_base_i
mean difference = average(d_i)
```

Then use bootstrap or a paired test to estimate uncertainty.

## Worked Example: Accuracy Is Not Enough

Suppose you evaluate two support-classification models on 1,000 test items.

| Model | Correct items | accuracy |
|---|---:|---:|
| baseline | 810 | 81.0% |
| new model | 840 | 84.0% |

The gap is:

```text
84.0% - 81.0% = 3.0 percentage points
```

That is the main result, but it is not enough.

Now inspect segments:

| Task type | baseline | new model | gap |
|---|---:|---:|---:|
| Short input | 82% | 87% | +5% |
| Long input | 79% | 75% | -4% |
| Billing | 80% | 85% | +5% |
| Technical | 83% | 84% | +1% |

The conclusion changes. Overall accuracy rises by 3 points, but long-input performance drops by 4 points. If long input is common among high-value customers, a full launch is risky.

Now add guardrails:

| Metric | baseline | new model |
|---|---:|---:|
| Average latency | 1.2s | 2.0s |
| Cost per 1,000 tasks | $4 | $9 |
| Escalation rate | 12% | 10% |

The model is more accurate, but latency and cost increase. A decision-ready report might say:

```text
The new model improves overall accuracy by 3.0 percentage points, mainly on short-input and billing tasks. Long-input accuracy drops by 4.0 points, average latency rises from 1.2s to 2.0s, and cost increases. We recommend staged rollout for short-input traffic only, keeping the baseline for long-input cases until error analysis and latency optimization are complete.
```

That is the bridge from statistical result to product decision.

## Where This Shows Up in ML/AI

This post integrates the series.

- Descriptive statistics: inspect data distribution, mean, variance, and segments.
- Confidence intervals: answer whether the difference is stable.
- Hypothesis tests: handle whether the gap could be sampling variation.
- Paired design: reduce noise when the same items compare two models.
- Regression diagnostics: find where model failures concentrate.
- A/B testing: test real online effect after offline evaluation.
- Causal inference: avoid treating correlated metrics as launch effects.
- Missing data: check which populations or scenarios are absent from evaluation.
- Monte Carlo: estimate rerun variation, cost risk, or process stability.
- Reproducible workflow: make the report rerunnable.

In LLM and agent settings, reports should keep raw traces. When an agent fails, you need to know whether retrieval failed, tool arguments were wrong, parsing broke, or the final answer was incorrect. Average score alone cannot show this.

## How Sources Are Used

- Official past-paper PDFs are used only for years, subject names, and problem statements; two years of questions are not treated as the full future scope.
- The grad-exam-prep pages are used for study-route, question-index, and practice-flow alignment, not as official solutions.
- OpenIntro, OpenStax, and other open textbooks are used to verify formulas, definitions, assumptions, and common derivations.
- Stanford CS109 and scikit-learn documentation are used to connect each topic to ML/AI training, evaluation, experiments, and uncertainty reporting.

## Problem Recognition Hints

- If the problem asks for an evaluation report, begin with the decision question.
- A score table should come with data, metric, baseline, and uncertainty.
- When two models are compared on the same items, think paired comparison.
- If average improvement and segment regression both exist, the conclusion must reflect the risk.
- End with a recommended action, not only "model A is better."

## Common Mistakes

- Showing only a leaderboard or average score.
- Omitting the baseline, so the score has no comparison.
- Using a metric that does not match the product goal and still making a launch decision from it.
- Ignoring confidence intervals, bootstrap results, or rerun variation.
- Skipping segment error analysis, allowing important failures to be hidden by averages.
- Omitting guardrail metrics, leaving cost, latency, and safety outside the decision.

## Practice

1. Write an ML/AI evaluation summary that includes data, metric, estimate, uncertainty, limitation, and recommendation.
2. If a model has high accuracy but low recall, how should the report avoid presenting only the flattering number?
3. Rewrite "model B scored 0.84 and model A scored 0.81" as a statistical conclusion with sample size, gap, and limitation.
4. List three guardrail metrics and explain which risks they protect.
5. Choose one LLM agent eval setting and list which raw traces you would preserve.

## What Comes Next

The evaluation report is the practical landing point of this series. The next post returns to the whole map: after 53 posts, how should a learner continue toward exams, ML, causality, Bayesian work, time series, or mathematical statistics?

## Section-Level Source Map

- OpenIntro and OpenStax support the basic language of estimation, confidence intervals, hypothesis tests, and result interpretation.
- Stanford CS109 supports the bridge from data and models to uncertainty communication.
- scikit-learn Model Evaluation supports metric choice and classification/regression evaluation; this post turns metrics into decision-ready reports.
- This post connects evaluation reports to paired comparison, segment analysis, guardrail metrics, A/B testing, and raw traces.

## References

- [ML/AI evaluation reports, metric definition, uncertainty, segment analysis, and guardrail metrics: OpenIntro Statistics](https://www.openintro.org/book/os/)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
