---
title: "AI Engineer Interview Daily — 2026-08-26: ML System Design"
date: 2026-08-26
category: daily
type: digest
tags: [ai-engineer-interview, daily, system-design]
lang: en
description: "Today's practice covers ML system design: online/offline dual-track feature stores, training-serving skew, two-stage recommendation architecture, and how to design an A/B test that actually tells you whether your model works."
tldr: "ML system design interviews test whether you can translate a business goal into a complete ML system — not whether you can recite buzzwords. Today we focus on four high-frequency topics: online/offline feature stores with point-in-time correctness, latency budgets for online inference and shadow mode, choosing the right randomization unit for A/B tests and separating novelty effects, and using PSI to detect data drift vs concept drift."
series:
  name: "AI Engineer 面試日練"
  order: 7
---

> 🌏 [中文版](/posts/daily/2026-08-26-ai-interview-daily)

## Today's Topic

The biggest difference between ML system design and general software system design is the three extra layers: where does the training data come from, are the features computed with the same logic during training and online inference, and how do you know when a deployed model is "silently degrading." Just being able to talk about API gateways, load balancers, and caches isn't enough. Interviewers want to see whether you can decompose a business problem (e.g., "improve recommendation click-through rate") into a clear ML objective, data pipeline, serving architecture, and monitoring strategy — and whether every technical decision traces back to that original business metric.

Today's practice follows the format most commonly tested in ML system design rounds at companies like Google, Meta, Uber, and Airbnb: walking through the full production loop from feature store to A/B test to drift monitoring.

## Core Concepts

### Feature Store: Online/Offline Dual-Track and Training-Serving Skew

A feature store has two planes: the offline store (data warehouses like Hive, BigQuery, or Snowflake) holds historical features and emphasizes point-in-time correctness — during training, you can only use data that existed before the timestamp when each label was generated, otherwise it's leakage. The online store (low-latency KV stores like Redis or DynamoDB) serves features at inference time with < 10ms p99. If the two sides each implement their own computation logic, you get training-serving skew: the feature distributions the model saw during training differ from what it sees at inference time, and accuracy silently degrades. The bonus sentence in an interview: "The feature computation logic should be shared as a single codebase, regardless of whether it runs through the offline batch path or the online real-time path."

### Latency Budgets for Online Inference and Shadow Mode

Ranking models typically have a real-time inference latency budget of 10–50ms; complex ensembles can stretch to 200ms. Roughly broken down: feature retrieval < 5ms, model forward pass < 10ms. Common techniques to stay within budget include model quantization (INT8), exporting to ONNX and running via TensorRT, and switching to batch inference for non-real-time scenarios. The standard practice before deploying a new model is shadow mode: the new model runs alongside the production model, but only the production model's results are served to users. You compare the prediction distributions from both sides to catch serving-side issues (latency, crashes, missing features) before moving to an A/B test that actually affects users.

### Designing A/B Tests That Don't Mislead

A/B testing ML models differs from A/B testing UI changes — model effects on downstream metrics take longer to manifest. The randomization unit matters: for personalization models that learn user preferences over time, use user-level randomization. Stateless ranking models can use query-level randomization, but this underestimates the novelty effect. The novelty effect refers to users interacting differently in the first few days after seeing a new model (they might be more curious or more resistant). You need at least two weeks to separate "novelty" from "steady-state performance." Metrics should be layered upfront: primary metric (the business outcome you're actually optimizing), guardrail metrics (engagement, latency, revenue — these shouldn't be sacrificed for a gain in the primary metric), and diagnostic metrics (model-specific signals like CTR and NDCG). All three layers must be defined before the experiment starts — don't wait until the data comes in to decide which numbers to look at.

### Data Drift vs Concept Drift: Two Different Ways a Model Degrades

Data drift means the input distribution has changed (e.g., the age demographics of your users shift). Concept drift means the relationship between inputs and outputs has changed (e.g., before and after a pandemic, user purchasing behavior for "home" products is fundamentally different). Both are silent failure modes — they don't throw errors, they just cause business metrics to slowly decline. A common quantification tool is PSI (Population Stability Index): `PSI = Σ(actual_proportion − expected_proportion) × ln(actual_proportion / expected_proportion)`. A PSI above 0.25 is typically considered significant drift, which should trigger retraining. Beyond monitoring feature distributions themselves, you should also monitor the prediction score distribution — a sudden shift in score distribution often provides an earlier warning than ground truth labels (which typically arrive with a delay).

## Practice Problem

### Problem Statement

Design the feature store and online inference path for a product recommendation system on an e-commerce site. Explain how you would design an A/B test to validate whether a new model version should actually go to production.

**Source**: Self-composed (synthesized from common ML system design questions at Meta/Uber/Airbnb; this is the highest-frequency "recommendation + feature store" combination). **Difficulty**: Advanced. **Stage**: Onsite (ML system design round, 45–60 minutes).

### Solution Approach

1. **Clarify the problem first**: The scope is large — you must ask clarifying questions. Is the recommendation for the homepage or the "related products" section on a product detail page? What's the latency budget (typically < 100ms)? What business metric are you optimizing — click-through rate, add-to-cart rate, or GMV? Is there an existing feature pipeline to build on?
2. **Establish a framework**: Walk through in order: "data → features → model → serving → evaluation → monitoring." Start by defining the label clearly (click? add-to-cart? purchase? what time window?) before moving to features — don't jump straight to model architecture.
3. **Go deep on the core tradeoffs**: The key tensions in this problem are twofold — first, how do you ensure consistency between the online and offline feature stores (training-serving skew, covered above); second, the two-stage architecture (use a lightweight model to retrieve a few hundred candidates from tens of thousands of items, then use a heavier model to re-rank those few hundred), because running the heavy model on the full candidate set would blow the latency budget.
4. **Close with evaluation**: End with A/B testing. Explain the randomization unit choice (user-level here, since recommendations involve personalized learning), guardrail metrics (can't sacrifice page load speed or diversity to boost click-through rate), and the deployment sequence: shadow mode first to verify serving stability, then canary (1–5% traffic), then full-scale A/B test.

### Sample Answer (How You Might Say It in an Interview)

> **Start with the framework**: "I'll break this into three layers: data and features, model and serving architecture, and evaluation and monitoring. Let's assume the scenario is 'related products' on the product detail page, with a 100ms latency budget, optimizing click-through rate with add-to-cart rate as a guardrail."
>
> **Feature store and serving architecture**: "Features are split across online and offline stores: the offline store uses BigQuery for user behavioral history and product attributes, doing point-in-time joins to generate training data; the online store uses Redis for the latest user embeddings and product embeddings, retrieved in < 10ms at inference time. Since the candidate pool could be tens of thousands of products, running the full ranking model on all of them would exceed the latency budget. So I'd design a two-stage pipeline: first use lightweight embedding similarity for retrieval to get the top 500, then use a gradient boosting model or small transformer for re-ranking those 500."
>
> **A/B test and monitoring**: "Before launch, I'd run shadow mode for one week, comparing the prediction distributions of the new and production models for significant shifts, and confirming no serving bugs before moving to canary at 2% traffic to observe latency and error rates. The full A/B test uses user-level randomization, runs for at least two weeks to separate novelty effects from steady-state performance. The primary metric is click-through rate; guardrails are add-to-cart rate and page latency p99. Post-launch, I'd continuously monitor feature distributions and prediction distributions using PSI, triggering retraining alerts if thresholds are exceeded."

### Self-Check Checklist

Use this table to verify your answer covers the key points:

| Checkpoint | Covered? |
|---------|---------|
| Asked clarifying questions about latency budget, target business metric, and label definition | |
| Explained how online/offline feature stores stay consistent (training-serving skew) | |
| Designed a two-stage retrieval + ranking architecture due to large candidate set | |
| Explained the choice of A/B test randomization unit and how long to run to separate novelty effect | |
| Mentioned guardrail metrics, not just a single primary metric | |
| Bonus: Deployment follows a gradual rollout — shadow mode → canary → full A/B test | |
| Bonus: Monitoring uses quantitative metrics like PSI to distinguish data drift from concept drift | |

## Further Reading

- [ML System Design Interview Guide 2026 — CalibreOS](https://www.calibreos.com/blog/mlsd-ml-system-design-interview-guide) — Comprehensive coverage of the nine-step MLSD framework; the A/B testing and monitoring sections are particularly thorough and were a primary reference for this post.
- [System Design: ML Training and Serving Pipeline — techinterview.org](https://www.techinterview.org/post/3233466263/system-design-ml-pipeline/) — Connects feature store, training pipeline, and serving pipeline with concrete code snippets; useful for cross-referencing your own architecture diagrams.

## References

- [ML System Design Interview Guide 2026 — CalibreOS](https://www.calibreos.com/blog/mlsd-ml-system-design-interview-guide) — Corresponds to the "Designing A/B Tests That Don't Mislead" and "Data Drift vs Concept Drift" sections.
- [System Design: ML Training and Serving Pipeline — techinterview.org](https://www.techinterview.org/post/3233466263/system-design-ml-pipeline/) — Corresponds to the "Feature Store: Online/Offline Dual-Track" and "Latency Budgets for Online Inference and Shadow Mode" sections.
- [Feature Store & Model Serving — System Design Space](https://system-design.space/en/chapter/feature-store-model-serving/) — Supplementary discussion on point-in-time correctness and feature contracts.
