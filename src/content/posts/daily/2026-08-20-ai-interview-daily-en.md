---
title: "AI Engineer Interview Daily — 2026-08-20: ML System Design"
date: 2026-08-20
category: daily
type: digest
tags: [ai-engineer-interview, daily, system-design]
lang: en
description: "Today's ML system design interview practice: feature store architecture, training-serving skew, model deployment strategies, and production monitoring."
tldr: "The core of ML system design interviews isn't which model to pick — it's how to keep the model alive in production. Today covers four high-frequency topics: online/offline separation in feature stores, root causes and prevention of training-serving skew, deployment strategies (shadow/canary/blue-green), and ML-specific monitoring beyond HTTP error rates."
series:
  name: "AI Engineer 面試日練"
  order: 1
---

> 🌏 [中文版](/posts/daily/2026-08-20-ai-interview-daily)

## Today's Topic

ML System Design is the dividing line in senior AI engineer interviews. What sets it apart from traditional software system design: you're not just designing a system that runs — you also have to handle consistency between training and serving, model quality degradation over time, and the gap between offline metrics and online business metrics.

The most commonly tested scenarios are recommendation systems, search ranking, fraud detection, and content moderation, each with different latency budgets and evaluation metrics. Today, instead of picking a specific scenario, we'll practice four foundational modules that apply across all of them.

## Core Concepts

### Training-Serving Skew

Inconsistency between features used during training and features used during serving is the most common silent failure in production ML systems. Common causes: training and serving use different feature pipeline code, aggregation windows are misaligned, or training accidentally uses future labels (label leakage). The fix is to use the same feature computation code (or a unified feature store like Feast or Tecton) and run online/offline consistency validation.

### Online/Offline Separation in Feature Stores

Feature stores split into an online store (low-latency key-value lookup for serving) and an offline store (batch historical joins for training). In interviews, you should be able to draw this dual-track architecture and explain why point-in-time joins are essential — without them, training data includes future information, and the model will perform significantly worse online than in offline testing.

### Model Deployment Strategies

Three main strategies, each suited to different scenarios. Shadow deployment sends production traffic to both old and new models simultaneously, logging the new model's predictions without actually serving them — good for initial validation in high-risk scenarios. Canary rollout directs a small fraction of traffic (e.g., 5%) to the new model and gradually increases the ratio — suitable for most situations. Blue-green deployment maintains two complete environments with instant switchover — ideal for scenarios requiring fast rollback. In interviews, saying something like "I'd shadow for two days to observe prediction distributions, then canary at 5% for a week watching business metrics" scores well.

### ML-Specific Monitoring

Monitoring for ML systems can't stop at HTTP 5xx and latency. You need to track at least three layers: data layer (input feature distribution shift, null rate anomalies), model layer (prediction distribution shift, confidence calibration degradation), and business layer (downstream metrics like CTR/conversion). Mentioning data drift detection and the threshold logic for setting retraining triggers tells the interviewer you have production experience.

## Practice Problem

### Problem

"Design a feature store pipeline that can serve real-time features with sub-millisecond latency."

**Source**: Uber MLE Interview | **Difficulty**: Advanced | **Round**: Onsite system design

### Approach

1. **Clarify the problem first**: Ask the interviewer — how many features? What's the QPS? How frequently are features updated? Are there real-time aggregate features (e.g., "number of transactions in the past 5 minutes")? These questions determine the architecture's complexity.

2. **Establish a framework**: Draw three parts — (a) data ingestion layer (streaming + batch), (b) feature computation layer, (c) serving layer (online store). Explain the technology choices and trade-offs for each layer.

3. **Go deep on the core**: The sub-millisecond requirement means you can't compute features at request time. The core trade-off is **freshness vs. latency** — pre-compute and store in a KV store like Redis/DynamoDB (fast but potentially stale), or aggregate at request time (fresh but slow). The interviewer wants to hear how you split it: high-frequency features use a streaming pipeline (Kafka + Flink) writing to the online store, low-frequency ones use a batch pipeline, with each feature having a defined freshness SLA and TTL.

4. **Wrap up**: Mention consistency guarantees (online/offline feature parity validation), monitoring (feature freshness alerts, null rate monitoring), and fallback strategies for when the online store goes down (degrade to batch features or use default values).

### Sample Answer (how you might phrase it in an interview)

> I'd design the feature store in three layers.
>
> **Layer 1: Data ingestion.** Real-time features flow through Kafka → Flink streaming jobs that compute sliding window aggregates (e.g., "number of transactions in the past 5 minutes"), writing results to a Redis cluster as the online store. Historical features go through a Spark batch pipeline running hourly, writing to S3 (Parquet format) as the offline store, while also backfilling to Redis.
>
> **Layer 2: Serving.** Online serving uses the Redis cluster with p99 latency in sub-millisecond range. Each feature has a defined freshness SLA and TTL — for example, `user_last_activity` requires < 1 second freshness with a 60-second TTL, while `user_lifetime_value` can tolerate 1-hour delay with a 24-hour TTL. If Redis misses on a request, fall back to default values instead of computing on the fly to avoid latency spikes.
>
> **Layer 3: Consistency guarantees.** Training uses the offline store with point-in-time joins to ensure no future data leaks in. Before going live, run an online/offline consistency check — pull online and offline values for the same set of entity keys simultaneously, compare whether distributions match, and block deployment if they don't.
>
> For monitoring, I'd track three things: feature freshness (actual latency vs. SLA per feature), null rate (sudden spikes indicate upstream issues), and online/offline feature drift (distribution shift exceeding thresholds triggers alerts).
>
> If the Redis cluster goes down entirely, the degradation strategy is: serve stale features from the batch pipeline's most recent backfill snapshot while triggering alerts for oncall to intervene. Stale features are better than letting the model receive nulls.

### Self-Check Checklist

Use this table to verify your answer covers the key points:

| Checkpoint | Covered? |
|---------|---------|
| Online/offline store separation (Redis vs. S3/data lake) | |
| Streaming + batch dual ingestion | |
| Per-feature freshness SLA and TTL | |
| Point-in-time join to prevent label leakage | |
| Online/offline consistency check | |
| Fallback strategy (what if Redis goes down) | |
| Monitoring: freshness, null rate, feature drift | |
| Bonus: feature versioning / lineage tracking | |

## Further Reading

- [CalibreOS — ML System Design Interview Guide 2026](https://www.calibreos.com/blog/mlsd-ml-system-design-interview-guide) — Complete framework covering MLSD interviews from problem framing to monitoring, with real questions from Google, Meta, and Uber
- [PracHub — Production ML Serving, Feature Stores, And Monitoring](https://prachub.com/concepts/production-ml-serving-feature-stores-and-monitoring) — Deep dive into feature store online/offline architecture and training-serving skew prevention strategies
- [Exponent — Machine Learning Interview Prep 2026](https://www.tryexponent.com/blog/machine-learning-interview-guide) — Round-by-round breakdown of ML interviews, with system design questions from Waymo and Meta

## References

- [CalibreOS — ML System Design Interview Guide 2026](https://www.calibreos.com/blog/mlsd-ml-system-design-interview-guide) — High-frequency interview scenarios (recommendation systems, fraud detection, etc.) and six-layer architecture framework referenced in Core Concepts
- [PracHub — Production ML Serving, Feature Stores, And Monitoring](https://prachub.com/concepts/production-ml-serving-feature-stores-and-monitoring) — Feature store online/offline separation architecture, training-serving skew root cause analysis, feature freshness SLA design
- [Uber MLE Interview Questions 2026](https://dataford.io/interview-guides/uber/machine-learning-engineer) — Source for today's practice problem: sub-millisecond feature store design
