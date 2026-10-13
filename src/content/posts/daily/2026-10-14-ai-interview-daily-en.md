---
title: "AI Engineer Interview Daily — 2026-10-14: ML System Design"
date: 2026-10-14
category: daily
type: digest
tags: [ai-engineer-interview, daily, system-design]
lang: en
description: "Wednesday's rotation is ML System Design — how feature stores guarantee point-in-time correctness to avoid training-serving skew, how to carve a serving latency budget into sub-budgets with versioned fallbacks, and how data drift differs from concept drift in detection timing — plus an Amazon MLE-style question on point-in-time feature correctness."
tldr: "Today's ML System Design rotation covers four core concepts: a feature store needs both an event time and an available time on every feature version to guarantee point-in-time correctness — filtering on event time alone still leaks future information; a serving system should carve its latency budget into explicit sub-budgets (lookup, scoring, response) and version the model, feature schema, and fallback path together; data drift (the input distribution shifted) and concept drift (the input-output relationship itself shifted) need different detection timing — the former shows up in feature distributions immediately, the latter usually needs labels to confirm; and production monitoring splits into three layers — operational (latency/error rate), data (feature distribution/missing rate), and model (prediction distribution/actual accuracy) — where the first two layers serve as early warning when label delay is long. The practice question adapts a real scenario from an Amazon MLE interview guide: a feature is only point-in-time correct when both its event time and its available time are no later than the prediction time, and the exercise is learning to state that criterion precisely in a system design interview."
series:
  name: "AI Engineer Interview Daily"
  order: 56
---

> 🌏 [中文版](/posts/daily/2026-10-14-ai-interview-daily)

## Today's Topic

Wednesday's rotation is ML System Design, and this round doesn't test how good your model is in isolation — it tests whether you can walk through a complete pipeline: how data flows, where features come from, how the model gets served, and how the system gets monitored, while being able to point out exactly where each stage can go wrong. Today's four concepts circle one core question: why does a model that looks great offline degrade the moment it ships? The answer is usually hiding in how the feature store handles timestamps, how the serving layer allocates its latency budget, when drift actually gets detected, and which three layers of metrics you're supposed to be watching. The practice question takes "point-in-time correctness" — a phrase that gets waved through in a single sentence far too often — and breaks it down into the criterion an interviewer actually wants to hear.

## Core Concepts Cheat Sheet

### Point-in-time correctness: check both event time and available time, or you leak

A feature store has to guarantee that the offline training data and the features the live system actually serves follow the exact same logic, and the detail most commonly missed is this: every feature version needs two timestamps — when the event it represents actually happened (event time), and when the system could actually retrieve it (available time). Filtering on event time alone still leaks. Say a prediction happens at time 100, and an event occurred at time 90 but didn't land in the system until time 105 — at time 100, that data simply didn't exist yet. If training data is filtered only on "event time ≤ 100," it pulls in a row the serving system genuinely couldn't have seen, and the model looks systematically better offline than it ever performs in production. The correct rule is that both timestamps must be no later than the prediction time, and the logic for reconstructing historical features offline has to match the online query's semantics exactly — otherwise it's just another flavor of training-serving skew.

### Serving latency budget: carve sub-budgets first, then version the model, schema, and fallback together

When an interviewer asks you to design a ranking service that responds within 100ms, they don't want to hear "use a faster model" — they want to see you break the budget into named sub-items: how many milliseconds go to request handling, feature lookup, model scoring, response assembly, plus a safety margin, so every stage has an explicit failure boundary you can actually track. Once the budget is carved up, the next step is deploying the model version, the feature schema version, and the transformation logic as one bundle. The moment a feature lookup times out or a schema mismatch occurs, the system needs a clearly defined fallback — typically reverting to the last compatible version or a simplified baseline — and that fallback's exposure has to be logged too, or downstream evaluation can't tell which predictions actually came from the degraded path.

### Data drift vs. concept drift: one shows up in feature distributions, the other usually needs labels

These two get paired in interviews constantly, but they're detected on completely different timelines. Data drift is a shift in the input distribution itself — a new user segment appearing, a new device type showing up — and it can be detected directly, in real time, from statistics like the population stability index, with no labels required. Concept drift is a shift in the relationship between input and output — fraud patterns evolving so the same feature combination now represents a different level of risk — and confirming it usually requires waiting for labels to come back and checking whether model accuracy has actually dropped. The practical strategy: when data drift is detected, don't rush to retrain — first confirm whether the distribution shift is actually hurting model performance. Once concept drift is confirmed, retrain on recent data, and consider up-weighting recent samples if needed.

### Three monitoring layers: operational, data, model — the first two are your early warning when labels are slow

Production model monitoring should split into three layers rather than a single accuracy number. The operational layer watches latency, error rate, and throughput — anomalies here usually mean the system itself broke, independent of model quality. The data layer watches whether input feature distributions have shifted from the training baseline and whether missing-value rates have spiked — this layer needs no labels and can be computed in real time. The model layer watches the prediction distribution itself, and — once labels arrive — actual accuracy metrics. When a business scenario has a long label delay (a credit-risk model might not confirm default for 60 days), the first two layers are the earliest warning you'll get after launch. Mentioning this in an interview is usually a differentiator — it signals you've actually thought through the practical problem of "how do I know the model has already broken before the labels come back."

## Today's Practice Question

### The Question

Design a feature pipeline for a click-prediction model for music recommendations. Requirement: the offline features used for training must exactly match what the online serving system can actually look up at prediction time — no leaking any information that the system couldn't have queried yet. Explain how you'd determine whether a given feature version is "available" at a given prediction time, and what goes wrong if that criterion is implemented incorrectly.

**Source**: Adapted from the point-in-time feature correctness case in PracHub's "Amazon Machine Learning Engineer Interview Guide 2026"　**Difficulty**: Intermediate　**Round**: ML system design / applied ML

### How to Break It Down

1. **Clarify first**: Is this feature pipeline for batch training only, or does it also need to serve online queries in real time? Do different features update at different frequencies (long-term user preferences vs. recent behavior)? Does the label itself have a delay window (how long before a non-click can be confirmed as a non-click)?
2. **Build a framework**: Split every feature version's lifecycle into two timestamps — event time (when the event it represents actually happened) and available time (when it was actually written and became queryable by the serving system). A feature is available at prediction time t if and only if both timestamps are less than or equal to t.
3. **Go deep on the core**: The key trade-off is that checking event time alone looks logically sound — "this event had already happened by prediction time" — but it ignores that there's almost always an ingestion lag between when data is generated and when it's actually written into the system. If training data is filtered on event time alone, it pulls in rows the serving system genuinely couldn't have queried at the time, which is exactly why offline evaluation metrics end up systematically favoring the offline version. Checking both timestamps is what makes offline-reconstructed training data semantically equivalent to an online query.
4. **Close strong**: Extend into production — this criterion isn't a one-time check. The feature definition and transformation version need to be logged alongside every prediction, so that offline replay or debugging later can accurately reconstruct exactly what the system saw at that moment, instead of guessing backward from today's data state.

### Sample Answer (What You'd Actually Say)

> Point-in-time correctness comes down to a simple rule that's easy to half-implement: whether a feature is usable at a given prediction time depends on two timestamps — when the event it represents actually happened, and when that data actually became queryable in the system. **Start with why checking one timestamp isn't enough**: filtering only on "event time earlier than prediction time" sounds correct, but there's always some lag between when data is generated and when it's fully written and indexed into the system. That lag is easy to overlook during offline training, because we're reconstructing past features using today's complete database — which already contains data that, at the time, hadn't reached the system yet.
>
> **Then, how the criterion gets implemented**: I'd record both an event time and an available time on every feature version. When reconstructing training data offline, both timestamps have to be no later than the prediction time at that point in history for the feature to count as available — anything satisfying only one of the two conditions gets excluded. This logic has to share the same implementation as the online query path, not a separate offline rewrite, or the criterion can be correct in theory and still produce skew because the two implementations diverge.
>
> **Finally, what this design means for debugging and monitoring downstream**: I'd log the feature version and transformation version used at every prediction, so if online performance ever diverges from offline, I can replay exactly what the system saw at that moment instead of guessing from today's data state. That's necessary infrastructure for shadow deployments and offline reproduction later — and it's the piece a lot of teams only discover is missing after they've already shipped.

### Self-Check List

Use this table to check whether your answer covered the key points:

| Check item | Covered? |
|---------|---------|
| Explained why filtering on event time alone isn't enough, and why available time matters too | |
| Stated that offline training data and online queries must share the same feature logic | |
| Mentioned logging the feature and transformation version per prediction to enable replay and debugging | |
| Extended into how this design connects to drift monitoring and shadow deployment downstream | |
| Gave a concrete consequence of getting the criterion wrong (systematic offline bias, degradation after launch) | |
| Bonus: addressed how the criterion should handle features that update at different frequencies | |

## Further Reading

- [Amazon Machine Learning Engineer Interview Guide 2026 — PracHub](https://prachub.com/interview-guide/amazon-machine-learning-engineer-interview-guide) — Walks through a full music-recommendation click-prediction case, from the point-in-time feature criterion through latency budgeting to a canary rollback decision — the primary source for today's practice question.
- [Machine Learning Engineer Interview Questions and Answers — InterviewPlan AI](https://interviewplan.ai/interview-questions/machine-learning-engineer) — Nine common system design questions with sample answers covering training-serving skew, drift detection, and CI/CD for ML — a good cross-check against today's four concepts.
- [System Design Interview Questions (Updated 2026) — PracHub](https://prachub.com/categories/system-design) — A well-organized system design question bank including ML-specific serving and pipeline scenarios, useful for extending practice beyond today's scope.

## References

- [Amazon Machine Learning Engineer Interview Guide 2026 — PracHub](https://prachub.com/interview-guide/amazon-machine-learning-engineer-interview-guide) — Primary source for the "Point-in-Time Correctness" concept and today's practice question, including the event time / available time criterion and the latency-budget and canary-decision case.
- [Machine Learning Engineer Interview Questions and Answers — InterviewPlan AI](https://interviewplan.ai/interview-questions/machine-learning-engineer) — Source for the "Three Monitoring Layers" and "Data Drift vs. Concept Drift" sections, including the operational/data/model monitoring split and PSI-based detection.
- [Databricks Feature Store — Databricks on AWS](https://docs.databricks.com/aws/en/machine-learning/feature-store) — Supporting source for the "Serving Latency Budget" section's feature-serving architecture and training/serving skew elimination mechanism.
