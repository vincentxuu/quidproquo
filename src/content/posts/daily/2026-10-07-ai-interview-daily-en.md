---
title: "AI Engineer Interview Daily — 2026-10-07: ML System Design"
date: 2026-10-07
category: daily
type: digest
tags: [ai-engineer-interview, daily, system-design]
lang: en
description: "Wednesday's rotation is ML System Design — how a feature store solves training-serving skew, why a serving pipeline design should start from a baseline instead of jumping straight to a neural net, how PSI and KS tests catch data drift, and the shadow-deployment-to-canary-rollout sequence — plus an A10 Networks-style question: design a real-time traffic-feature ML inference pipeline with a baseline model, a latency budget, drift monitoring, and a rollback path."
tldr: "Today's ML System Design rotation covers five core concepts: how a feature store eliminates training-serving skew by sharing one feature computation path, why ML pipeline design should establish a baseline before justifying anything more complex, PSI versus the KS test as two data-drift detection methods and when each applies, the shadow-deployment-to-canary-rollout-to-rollback sequence for gradual releases, and how an A/B testing framework quantifies a model's real impact after launch. The practice question is adapted from a reported A10 Networks Machine Learning Engineer interview (compiled by PracHub's 2026 guide from candidate reports, not a leaked question): design a real-time traffic-feature ML inference pipeline with a baseline model, a latency budget, drift monitoring, and a rollback path — the breakdown threads 'clarify traffic volume and latency target first' through to 'what mechanism lets a bad model exit immediately' into one complete reasoning chain."
series:
  name: "AI Engineer Interview Daily"
  order: 49
---

> 🌏 [中文版](/posts/daily/2026-10-07-ai-interview-daily)

## Today's Topic

Wednesday's rotation is ML System Design, and today's concepts circle around one question: a model can score beautifully in a notebook, but how many engineering decisions stand between that and it surviving in production? A feature store answers "does training see the same feature-computation logic the model sees online?" Drift detection answers "the world changed after launch — when should the model get swapped out?" Shadow deployment and canary rollout answer "how do we catch a bad model before it hurts real users?" These form the standard skeleton of an ML system design round. The interviewer isn't grading you on the most elaborate architecture diagram — they're watching whether you nail down traffic, latency, and label-source constraints before you start making trade-offs.

## Core Concepts Cheat Sheet

### Feature stores and training-serving consistency

A feature store's real value isn't "storing features" — it's making sure training and online inference share the exact same feature-computation logic, which is what prevents training-serving skew. If a feature is computed one way via batch joins offline and a different way via a real-time event stream online — say, a different time-window definition or different null-handling — the model looks great on the offline validation set and then drops in score the moment it goes live. A common follow-up is "how is the same feature computed on each side?" The answer needs to name a single shared feature definition (one codebase or one transformation spec) that feeds both the batch training pipeline and the real-time serving layer, rather than two independently written versions.

### Designing from a baseline first

A classic trap in ML system design rounds is jumping straight into an elaborate neural architecture before pinning down the latency budget, data volume, or where labels even come from. The right order is: clarify traffic volume, p50/p99 latency targets, who consumes the model's output, and how and how often labels arrive — then start from a simple baseline (a rules engine or a tree-based model), and only argue for something more complex once you can point to a specific condition that justifies it, like a baseline that's persistently weak on one subgroup, or enough labeled data to actually support a bigger model. Leading with the baseline and only then describing the upgrade path is what separates someone who's actually shipped a model from someone who hasn't.

### PSI and the KS test: two ways to catch data drift

The Population Stability Index (PSI) buckets a feature into fixed bins and compares the share of samples in each bin between the training period and the live period. A common rule of thumb reads PSI below 0.1 as stable, 0.1 to 0.25 as worth watching, and above 0.25 as significant drift — it's cheap to compute and works well for categorical or discretized features on a scheduled batch job. The Kolmogorov-Smirnov (KS) test instead compares the maximum distance between two cumulative distribution functions (CDFs) and returns a formal p-value — better suited to continuous features where you want statistical rigor, but it's sensitive to sample size: at large enough sample sizes, even a tiny, practically meaningless distribution shift gets flagged as "significant." Being able to say which test fits which situation carries a lot more weight than a vague "I'd monitor for drift."

### The shadow-deployment-to-canary-rollout sequence

Before a new model goes live, run it in shadow deployment: it processes the same live traffic as the current model, but only the current model's output is actually returned to users — the new model's predictions are logged and compared against the old one, letting you validate behavior on real traffic distribution at zero risk. Once that checks out, move to canary rollout: route a small slice of traffic (say 1% to 5%) to the new model, watch the key metrics continuously (latency, error rate, business metrics), and only widen the slice once it's stable. The whole sequence needs an explicit rollback path attached — the moment a monitored metric crosses a predefined threshold, traffic flips back to the old model immediately, instead of waiting for a human to notice something's wrong.

### A/B testing and experimentation frameworks in ML systems

A model's real impact after launch ultimately has to be quantified through A/B testing or a more advanced multi-armed bandit framework — not offline metrics alone. Frequentist A/B testing requires fixing the sample size and significance threshold up front; peeking at results mid-run inflates the false-positive rate. Bayesian A/B testing instead keeps updating a belief distribution over "which variant is better," which lets you look at results continuously without pre-committing to a sample size — but it requires choosing a prior, and you have to be careful that "posterior probability" isn't the same claim as "statistically significant." When asked "how do you know the new model is actually better," your answer needs to cover which metric is the north star, how you split traffic to avoid contamination, and how long you'd wait before drawing a conclusion.

## Today's Practice Question

### The Question

Design a real-time traffic-feature ML inference pipeline: the system should start from a baseline model, meet an explicit latency budget, have a data-drift monitoring mechanism, and have a clear rollback path for when the new model misbehaves.

**Source**: A reported A10 Networks Machine Learning Engineer interview (compiled by PracHub's 2026 guide from candidate reports, not an official leaked question)　**Difficulty**: Intermediate　**Round**: Onsite ML system design

### How to Break It Down

1. **Clarify first**: What's the traffic volume (requests per second)? What's the p50/p99 latency target in milliseconds? Where do labels come from — real-time feedback or delayed annotation? Who consumes the model's output — a real-time blocking decision or an offline report? And what's the system's tolerance when the model is slow or down — fail open or fail closed?
2. **Build a framework**: Split the system into four stages of a data flow — ingestion (how events arrive), feature computation (one shared feature-computation path for both training and serving), serving (how the model responds to requests), and monitoring/retraining (the drift-detection and model-refresh loop). Start each stage from the simplest version that actually works.
3. **Go deep on the core**: There are three key trade-offs here — lead with a baseline rather than a complex model from the start (and upgrade only once data proves you need to); guarantee training-serving consistency (one shared feature-computation path, never two independently written transforms); and hit the latency budget (batching, quantization, distillation, and caching each have their own fit and cost, and you need to name which one applies where).
4. **Close strong**: Tie drift monitoring (PSI/KS test), the gradual-rollout sequence (shadow deployment to canary rollout), and the rollback mechanism together into one coherent lifecycle, and land it with a concrete number — something like "quantization brought p99 latency down from 45ms to 12ms, with only a 0.3-point drop in recall" — so the interviewer feels this isn't just theory.

### Sample Answer (What You'd Actually Say)

> I'd start by pinning down the boundaries: say we're processing ten thousand traffic events per second, the p99 latency budget is 50 milliseconds, labels arrive with a delay (user behavior takes minutes to hours to confirm), and the model's output directly drives a real-time blocking decision — so when latency blows the budget, I'd fail open: let the request through but flag it for review, rather than stalling the whole service.
>
> **On architecture**, I'd start from a tree-based model like LightGBM as the baseline — a rules engine handles the clear-cut cases, the tree model handles the gray zone, which gives good interpretability and keeps latency easy to control within budget. I'd write the feature-computation logic as one shared transformation that feeds both the offline training pipeline and the real-time serving layer, to avoid a feature computed one way via batch joins offline and a different way via streaming online — I've been burned by this before. Offline AUC looked great, and the model dropped nearly ten points the moment it went live; it took two days to track down that a time-window definition differed between the two sides.
>
> **On rollout and monitoring**, I'd run a new model through two weeks of shadow deployment first — logging only, with no effect on live decisions — then compare its distribution against the baseline before starting canary rollout at 2% of traffic and widening gradually. I'd monitor key features with PSI, set the alert threshold at 0.25, and have latency or error-rate breaches auto-flip traffic back to the old model rather than waiting for a human to notice. If we later move to a more complex neural model, I'd use quantization to bring p99 latency back inside budget first, then validate with A/B testing whether the real business-metric gain is actually worth it.

### Self-Check List

Use this table to check whether your answer covered the key points:

| Check item | Covered? |
|---------|---------|
| Clarified traffic volume, latency target, and label source up front | |
| Started from a baseline and named the condition for upgrading | |
| Explained how feature store / training-serving consistency is guaranteed | |
| Named a drift-detection method (PSI or KS test) and its threshold | |
| Covered the shadow-deployment → canary-rollout → rollback sequence | |
| Bonus: named latency-optimization techniques (batching/quantization/distillation/caching) with a concrete number | |

## Further Reading

- [AI Engineering Interview Questions (GitHub)](https://github.com/amitshekhariitbhu/ai-engineering-interview-questions) — Covers production ML system questions for LLM-era systems, including A/B testing, CI/CD, and model versioning, extending today's traditional-ML serving concepts into an LLM context.
- [FastPrep System Design Practice Library](https://www.fastprep.io/system-design) — Includes real company-signal system design prompts like "design a personalized recommendation system" (Netflix/Oracle-style), good for applying today's pipeline skeleton to a larger system design question.

## References

- [A10 Networks Machine Learning Engineer Interview Questions & Guide 2026 (PracHub)](https://prachub.com/interview-guide/a10-networks-machine-learning-engineer-interview-questions-guide-2026) — Primary source for today's practice question and the baseline/latency-budget/drift-monitoring/rollback design approach.
- [Reddit Machine Learning Engineer Interview Questions 2026 (dataford.io)](https://dataford.io/interview-guides/reddit/machine-learning-engineer) — Candidate-reported breakdown of the ML System Design & Architecture round, supporting today's "baseline before complexity" design philosophy.
