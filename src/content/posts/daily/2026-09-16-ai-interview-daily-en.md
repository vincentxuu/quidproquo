---
title: "AI Engineer Interview Daily — 2026-09-16: ML System Design"
date: 2026-09-16
category: daily
type: digest
tags: [ai-engineer-interview, daily, system-design]
lang: en
description: "Today's drill covers the six-dimension framework interviewers use for ML system design — problem framing, data/features, modeling, evaluation, serving, and monitoring — plus a full breakdown of a video-recommendation-system design question."
tldr: "Today's ML System Design rotation covers the six dimensions interviewers are actually probing (problem framing, data/features, model choice, evaluation, serving, monitoring/iteration), what a feature store actually solves (training/serving skew), the latency tradeoffs between real-time and batch inference, how data drift differs from model drift and how each gets monitored, and how offline metrics need to line up with online A/B tests. The practice question asks you to design a video recommendation system — interviewers want to see whether you can chain candidate generation, ranking, serving, and monitoring into one coherent technical story with defensible tradeoffs, rather than reciting one company's architecture diagram."
series:
  name: "AI Engineer Interview Daily"
  order: 28
---

> 🌏 [中文版](/posts/daily/2026-09-16-ai-interview-daily)

## Today's Topic

Wednesday's rotation is ML System Design, one of the fastest-growing interview formats in 2026 — nearly every mid-to-large ML/AI Engineer loop at Google, Meta, Amazon, or Netflix includes this round. Unlike traditional system design, it's not about load balancers or database sharding; it tests whether you can turn a fuzzy business problem ("reduce churn," "increase engagement") into an end-to-end, executable ML system. Today's material targets the most common interview flow: you're given a product scenario, and the interviewer wants to see whether you can chain problem framing, data, modeling, serving, and monitoring into one coherent reasoning path — not recite the internals of one specific architecture.

## Core Concepts Cheat Sheet

### The six dimensions interviewers are actually evaluating

ML system design questions look wildly different on the surface — recommendation systems, fraud detection, ad-click prediction — but underneath, interviewers are checking the same set of skills every time: problem framing (can you translate "increase engagement" into a clear ML objective), data and features (where the data comes from, how it's labeled, which features are actually predictive), model choice (picking a model under latency and interpretability constraints, and being able to justify the tradeoff), evaluation (how offline metrics map to online ones), serving (real-time vs. batch inference, API design, scalability), and monitoring/iteration (data drift, model decay, retraining cadence). Memorize this six-dimension skeleton and you can apply it to almost any prompt — no need to memorize 30 different architectures.

### What a feature store actually solves

When a feature store comes up, the point isn't to sketch its internal architecture — it's to clearly explain the two problems it solves: training/serving skew (the feature-computation logic used at training time doesn't match what's used at serving time, so the model underperforms in production relative to offline evaluation) and duplicated feature engineering (the same feature gets recomputed by different teams, sometimes with inconsistent definitions). Being able to name both of those, plus the difference between batch features (precomputed offline and stored) and real-time features (computed on the fly), is enough to satisfy most follow-ups at the Data Scientist level; deeper architectural detail is usually only probed if you have relevant hands-on experience.

### Serving layer: real-time vs. batch tradeoffs

The core question for the serving layer is always "how much latency can this scenario tolerate?" Batch inference (periodically running predictions and storing them for lookup) fits scenarios like recommendation candidate generation or risk scoring that don't need to react to an individual action instantly — it's cheap and easy to operate. Real-time inference (running the model when the request arrives) fits scenarios like fraud detection or dynamic pricing that must reflect the current input, but it means dealing with a latency budget, model compression, and caching. Many real systems are hybrid: candidates are computed in batch, and only lightweight ranking or re-ranking happens in real time, balancing cost against responsiveness.

### Monitoring: data drift and model drift are not the same thing

Data drift is when the distribution of inputs shifts over time (changing user behavior, seasonality, a new product launch). Model drift (or concept drift) is when the relationship between inputs and outputs itself changes (the same features now map to a different correct answer). Both silently degrade a model, but the causes and the fixes differ — data drift is typically caught by monitoring statistical distances on feature distributions (e.g. PSI, KL divergence), while concept drift shows up as a sustained decline in online metrics (conversion rate, click-through rate). The fix in both cases is a retraining cadence plus an automated rollback path so a new model that regresses online metrics can be reverted quickly.

### How offline metrics and online A/B tests fit together

Offline metrics (AUC, precision/recall, NDCG) are fast and cheap to compute, but there's always a gap between them and what the business actually cares about (revenue, retention, watch time) — which is exactly why an A/B test is required to confirm a model is actually "good." A common follow-up is "offline metrics look great but there's no lift online — what now?" The right answer is to go back and check whether the offline metric is even a good proxy for the north-star metric (e.g., optimizing for clicks might be trading away long-term retention), not to just keep tuning hyperparameters.

## Today's Practice Question

### The Question

Design a video recommendation system (e.g. a homepage "recommended for you" feed) for a platform with tens of millions of users and a catalog of millions of videos. The system must respond in real time to a user's browsing behavior while also maintaining diversity and avoiding homogeneous, repetitive recommendations.

**Source**: Adapted from ByteByteGo's "Machine Learning System Design Interview" video-recommendation-system chapter and the six-dimension framework laid out in Javarevisited's "How to Prepare for an ML System Design Interviews in 2026"　**Difficulty**: Advanced　**Round**: onsite / system design

### How to Break It Down

1. **Clarify first**: Confirm the business objective — is it maximizing total watch time, next-day return rate, or does it need to balance content diversity to avoid filter bubbles? Then ask about scale and latency: the homepage load latency budget, the size of the video catalog, and how fresh user-behavior data needs to be (does finishing a video need to be reflected in the next recommendation immediately, or is a few minutes of lag acceptable?). These answers directly determine how heavy the architecture needs to be.
2. **Build a framework**: Use the industry-standard two- or three-stage funnel — candidate generation quickly narrows millions of videos down to a few hundred or few thousand candidates using embeddings plus approximate nearest neighbor (ANN) search or collaborative filtering; ranking applies a heavier model (typically gradient boosting or a deep ranking model) to score the candidates using richer features (user history, video metadata, current context); if diversity matters, a re-ranking layer on top uses rules or an algorithm like MMR to break up homogeneous clusters.
3. **Go deep on the core**: What interviewers most want to hear is the tradeoff between candidate generation and ranking — candidate generation has to be extremely fast (narrowing candidates in milliseconds), so it can only afford lightweight similarity computation, trading precision for speed; the ranking model can afford to be slower but more accurate, because it only runs on a few hundred candidates. Watch for training/serving skew: if candidate-generation embeddings are computed in batch and stored in a feature store, the vector version used at query time must match the one used offline, or you'll see good offline evaluation numbers that don't translate to production. Also address cold start (new users or new videos with no behavioral history) — typically handled with content-based features (tags, categories) plus explore/exploit-style exploratory recommendations.
4. **Close strong**: Lay out the monitoring and validation plan — beyond online metrics like watch time and CTR, track diversity metrics (making sure a user's recommendations don't converge to a single content type over time) and data drift in both the candidate-generation and ranking models. Roll out changes through A/B tests and keep a fast rollback path available, since recommendation-system changes often look better offline but underdeliver online when the offline proxy metric isn't well aligned with the actual business goal.

### Sample Answer (What You'd Actually Say)

> **Framing the problem**: I'd first confirm whether the north-star metric is total watch time or next-day return rate, and what the homepage latency budget is — that determines how heavy a model the candidate-generation stage can afford to run. Assuming tens of millions of users, millions of videos, and a latency budget under 200ms, I'd go with the standard two-stage funnel architecture rather than running a heavy ranking model over the entire catalog.
>
> **Architecture**: For candidate generation, I'd use a two-tower model to encode users and videos into embeddings separately, then use an approximate-nearest-neighbor index like FAISS to pull a few hundred candidates out of millions of videos offline — trading a bit of precision for speed. For ranking, I'd use a gradient-boosted or deep ranking model with richer features (recent behavior sequences, video metadata, device and time-of-day context) to rescore the candidates, since it only runs on a few hundred items and can afford to be heavier. If diversity matters to the product, I'd add a lightweight re-ranking pass using something like MMR to make sure the final list isn't dominated by one content type. Throughout the pipeline, a feature store makes sure training and serving use the same feature definitions, avoiding training/serving skew.
>
> **Monitoring and wrap-up**: Before launch, I'd roll it out through an A/B test, tracking business metrics like watch time and next-day return rate alongside system metrics like diversity and candidate-generation latency. Post-launch, I'd continuously monitor feature distributions for data drift and online metrics for model drift, with a rollback path ready in case a new version regresses. For cold-start users or videos without enough behavioral data, I'd blend in content-based candidates and a small share of exploratory recommendations, gradually converging to personalized ones as data accumulates.

### Self-Check List

Use this table to check whether your answer covered the key points:

| Check item | Covered? |
|---------|---------|
| Asked about the north-star metric (watch time / return rate) and latency budget before jumping to architecture | |
| Proposed a multi-stage funnel: candidate generation + ranking (+ re-ranking) | |
| Explained the "fast but coarse" vs. "slow but precise" tradeoff between candidate generation and ranking | |
| Mentioned a feature store to avoid training/serving skew | |
| Addressed cold start (new users / new videos) | |
| Bonus: a monitoring plan (data drift, diversity metrics, A/B testing, rollback) | |

## Further Reading

- [Machine Learning System Design Interview — ByteByteGo](https://bytebytego.com/courses/machine-learning-system-design-interview/video-recommendation-system?fpr=javarevisited) — A full architectural breakdown of the video-recommendation chapter; the primary framework behind today's practice question.
- [Machine Learning System Design — Educative.io](https://www.educative.io/courses/machine-learning-system-design?affiliate_id=5073518643380224) — A text-based, interactive course with a structure matching today's six-dimension framework — good for a quick refresher before an interview.
- [ml-system-design — analyticsbot (GitHub)](https://github.com/analyticsbot/ml-system-design) — A free ML system design prep checklist covering everything from requirements clarification to risk/limitations, with recommendation, ranking, and content-moderation case studies.

## References

- [How to Prepare for an ML System Design Interviews in 2026? — Javarevisited](https://javarevisited.substack.com/p/how-to-prepare-for-an-ml-system-design) — Primary source for today's six-dimension framework and the feature store / serving / monitoring sections.
- [Machine Learning System Design Interview — ByteByteGo](https://bytebytego.com/courses/machine-learning-system-design-interview/video-recommendation-system?fpr=javarevisited) — Source for the architecture behind today's "video recommendation system" practice question.
