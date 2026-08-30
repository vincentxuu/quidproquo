---
title: "Why Should Time-Series Data Not Be Randomly Split?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 47
tldr: "Time-series data have order. Random splits can leak future information into training and make forecasting or monitoring results look better than they are."
description: "Statistics from Exams to ML/AI, post 47: trend, seasonality, autocorrelation, lag, moving average, rolling validation, forecasting, monitoring, and drift detection."
draft: false
---

> [中文版](/posts/learning/2026-08-29-im-stat-time-series)

Causal inference asked whether comparison groups can really be compared. Time series introduce a different constraint: the data have order. Today's traffic, sales, model error rate, and GPU cost are usually related to yesterday's. If you randomly shuffle the data, evaluation may look strong because the model has effectively seen the future.

This post builds the exam and practical intuition for time series. Exams often ask about trend, seasonality, autocorrelation, moving averages, and stationarity. ML/AI work uses the same ideas in forecasting, monitoring, drift detection, capacity planning, and retraining schedules.

## What Problem This Solves

Many introductory statistics settings treat observations as independent samples. Time series should not be handled that way.

If you use January through October data to forecast November demand, training and testing should mimic the real use case: only the past can predict the future. If January through December are randomly split into train and test, the model may train on data close to November and make test performance too optimistic.

Time-series questions often begin with three concepts:

```text
trend: a long-run upward or downward direction
seasonality: a fixed cycle, such as weekly, monthly, or yearly
autocorrelation: relationship between current values and past values
```

These affect models, tests, confidence intervals, and validation.

## Core Intuition

Consider daily orders:

```text
Mon 100
Tue 105
Wed 108
Thu 112
Fri 118
Sat 160
Sun 150
```

The average is:

```text
(100 + 105 + 108 + 112 + 118 + 160 + 150) / 7 = 121.86
```

The average is useful, but it hides two things. First, weekends are much higher, suggesting weekly seasonality. Second, weekdays rise from 100 to 118, suggesting a trend.

Time-series analysis usually starts with a plot. Look for trend, cycles, anomalies, and structural breaks. Many errors are visible before modeling: promotion-day spikes, product-release discontinuities, tracking bugs that suddenly drop a metric to 0.

## Formula and Mechanism

The most basic language is lag. If `y_t` is today's value, yesterday's value is:

```text
y_{t-1}
```

The lag-1 difference is:

```text
y_t - y_{t-1}
```

It changes the question from level to change. If orders go from 118 to 160:

```text
160 - 118 = 42
```

Saturday has 42 more orders than Friday.

A moving average smooths short-term noise by averaging nearby periods. A 3-day moving average might be:

```text
(108 + 112 + 118) / 3 = 112.67
```

Autocorrelation checks correlation between `y_t` and `y_{t-k}`. If lag-1 autocorrelation is high, a high value today tends to be followed by a high value tomorrow. This dependence breaks many ordinary independence assumptions.

Validation must also change. A common method is rolling or expanding windows:

```text
Train: Jan-Mar, Test: Apr
Train: Jan-Apr, Test: May
Train: Jan-May, Test: Jun
```

Another method is a sliding window:

```text
Train: Jan-Mar, Test: Apr
Train: Feb-Apr, Test: May
Train: Mar-May, Test: Jun
```

The difference is whether all history is retained. If the data-generating process is stable, expanding windows can work well. If the market or product changes quickly, sliding windows may better reflect the current state.

## Worked Example: Growth and Forecast Error

Suppose an AI product has weekly active users:

| Week | Users |
|---:|---:|
| 1 | 100 |
| 2 | 110 |
| 3 | 121 |
| 4 | 133 |
| 5 | 146 |

The week-2 growth rate is:

```text
(110 - 100) / 100 = 0.10
```

The week-3 growth rate is:

```text
(121 - 110) / 110 = 0.10
```

It looks like weekly growth is about 10%. A rough forecast for week 6 is:

```text
146 * 1.10 = 160.6
```

Suppose the forecast is 161 and the actual week-6 value is 150. The error is:

```text
actual - forecast = 150 - 161 = -11
```

The absolute percentage error is:

```text
|150 - 161| / 150 = 0.0733
```

or about 7.3%.

If the product changed in week 6, this error may come from a changed data-generating process rather than a sudden model failure. Time-series analysis should record those events; otherwise product events get mistaken for random noise.

## Where This Shows Up in ML/AI

After an ML/AI system ships, almost every important signal becomes a time series.

Model accuracy, latency, token cost, retrieval hit rate, conversion rate, and human escalation rate move by hour, day, and week. Overall averages erase time structure and hide many problems.

Typical scenarios include:

- forecasting: demand, traffic, support volume, or GPU usage.
- monitoring: whether latency, error rate, or cost moves outside the normal range.
- drift detection: whether data distribution or model performance changes over time.
- experiment readout: whether an A/B test is affected by weekly cycles, holidays, or product events.
- retraining: deciding when to retrain and when to trigger human inspection.

LLM products especially need time-series thinking. If answer quality drops on a given day, the cause may be a provider model update, stale retrieval index, changed user mix, or downstream tool failure. A single average score will not tell you which one happened.

## How Sources Are Used

- Official past-paper PDFs are used only for years, subject names, and problem statements; two years of questions are not treated as the full future scope.
- The grad-exam-prep pages are used for study-route, question-index, and practice-flow alignment, not as official solutions.
- OpenIntro, OpenStax, and other open textbooks are used to verify formulas, definitions, assumptions, and common derivations.
- Stanford CS109 and scikit-learn documentation are used to connect each topic to ML/AI training, evaluation, experiments, and uncertainty reporting.

## Problem Recognition Hints

- When the problem mentions day, week, month, year, lag, or forecast, preserve time order.
- For validation, think rolling or expanding windows before random splits.
- Before averaging or testing, check trend, seasonality, and autocorrelation.
- If a plot has a clear break, include product events, policy changes, or data-collection changes in the explanation.

## Common Mistakes

- Treating time series as ordinary iid data.
- Randomly splitting data for a forecasting model and leaking future information.
- Looking only at the overall average while ignoring trend and seasonality.
- Treating holidays, promotions, releases, or tracking failures as ordinary noise.
- Retraining immediately after metric decline without first checking data pipelines and product events.

## Practice

1. Explain why time-series data should not be randomly shuffled before train/test splitting.
2. Use one product metric to distinguish trend, seasonality, and noise.
3. For the sequence `100, 105, 120, 118`, compute each difference from the previous period.
4. Write a rolling-validation workflow and explain what real forecasting situation it simulates.
5. If an LLM product's answer acceptance rate falls for three consecutive weeks, which time-series signals would you inspect first?

## What Comes Next

Time series emphasizes order. Multivariate analysis emphasizes features that move together. The next post moves to covariance matrices, PCA, and dimensionality reduction, all of which help organize high-dimensional data by shared directions.

## Section-Level Source Map

- OpenIntro and OpenStax support time-dependent data, trend, statistical graphics, and basic estimation language.
- Stanford CS109 supports time-aware data splitting, leakage avoidance, and data-generating-process intuition.
- scikit-learn evaluation documentation supports validation workflows; this post extends them to time-aware splits, forecasting, and monitoring.
- The ML/AI connection here is forecasting, drift detection, observability, and retraining.

## References

- [Time-series data, random splits, trend, seasonality, autocorrelation, forecasting validation, and leakage: OpenIntro Statistics](https://www.openintro.org/book/os/)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
