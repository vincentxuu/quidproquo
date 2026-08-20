---
title: "MLOps & Deployment Interview Guide: From CI/CD to Model Monitoring"
date: 2026-08-20
category: ai
tags: [interview, ai-engineer, mlops, deployment, monitoring]
lang: en
type: deep-dive
description: "Breaking down the AI Engineer MLOps interview — ML pipeline CI/CD, model registry, A/B testing, scaling, and production monitoring."
tldr: "MLOps interviews test whether you have experience pushing models to production. Key topics: ML pipeline CI/CD (how it differs from software CI/CD), model registry and version management, A/B testing design and pitfalls, inference scaling strategies (horizontal scaling, model compression, caching), and production monitoring and alerting design."
series:
  name: "AI Engineer Interview Prep"
  order: 9
---

## Why MLOps Is a Must for Senior Roles

Junior AI Engineers can pass interviews on model knowledge alone; seniors can't. Interviewers want to know: have you taken a model from notebook to production end-to-end? When a model breaks in production, how do you detect, diagnose, and fix it?

MLOps questions usually don't get their own round — they're woven into system design or ML deep dive. After asking "how would you design the serving architecture for this recommendation system," the next question is "how do you know when the model has degraded?" If you can't give concrete answers at this stage, your earlier architecture design gets discounted.

## ML CI/CD: How It Differs from Software CI/CD

Software CI/CD runs code tests — unit tests, integration tests, deployment. ML CI/CD adds two dimensions: **data validation** and **model validation**.

**Data validation** sits at the pipeline's front end. Every time new data arrives, you check: has the schema changed (columns added or removed)? Has the distribution shifted (a feature's mean suddenly drifted by 3 standard deviations)? Has the null rate spiked? Common tools include Great Expectations or TensorFlow Data Validation. You don't need to memorize tool names for interviews, but you need to articulate what you'd check.

**Model validation** runs after training completes but before deployment. Beyond offline metrics (AUC, F1) exceeding the baseline, you need inference latency testing (does the new model's p99 exceed the SLA?), prediction distribution comparison (how different is the new model's output distribution from the old?), and sanity checks (feed a few known-answer cases to confirm the model hasn't gone haywire).

A good framing for interviews: "My ML CI/CD pipeline has three gates — a data quality gate, a model quality gate, and a serving gate. Nothing deploys automatically unless all three pass."

## Model Registry: More Than Just Storing Models

The model registry is the core of ML version management. When interviewers ask about this, they're not asking which tool you've used (MLflow, Weights & Biases, Vertex AI) — they're asking how you ensure reproducibility.

A good registry tracks at least four things:

| Tracked Item | Why It Matters |
|-------------|---------------|
| Model artifact (weights, config) | Can roll back to any historical version |
| Training data snapshot or version ID | Know what data trained this model |
| Training code commit hash | Can reproduce the training process |
| Hyperparameters and metrics | Know why this version was chosen |

Especially worth mentioning: **lineage tracking** — tracing backward from predictions to model version, training data, and feature pipeline code. When production issues arise, this chain is the only path to root cause.

## A/B Testing: Special Challenges for ML Models

ML A/B testing differs from standard product A/B tests in three key ways:

**Delayed feedback.** A recommendation system's impact might take days or weeks to show in retention rates. This means you can't conclude after just three days. In interviews, say: "This model affects long-term retention, so I'd design at least a two-week experiment, with guardrail metrics (crash rate, latency p99) to ensure short-term safety."

**Multi-model interaction.** Production environments typically run multiple models simultaneously (recommendation, ranking, filtering). Changing one model may affect another's input distribution. An interviewer might ask: "If you A/B test two models simultaneously, how do you avoid interaction effects?" The answer is layer-based experimentation — each model's experiment runs on different traffic layers without interference.

**Novelty effect.** When a new model launches, users may interact more due to novelty, then drop off after a few days. This doesn't mean the model got worse — it's novelty wearing off. Solution: observe over a longer experiment period, or compare "users who've had the new model for 7+ days" against the control group.

## Scaling: Making Inference Fast and Cheap

Inference scaling has two directions: making each inference faster (vertical optimization) or handling more concurrency (horizontal scaling).

**Vertical optimization** techniques:

- **Quantization**: Compress FP32 weights to INT8 or INT4. Typically reduces memory 2-4x and speeds up 1.5-3x with controllable quality loss. Mentioning the difference between post-training quantization (PTQ) and quantization-aware training (QAT) earns bonus points.
- **Distillation**: Train a smaller model on a larger model's outputs. Small model serves online, large model moves to offline. Suitable for tight latency budgets.
- **Dynamic batching**: Accumulate requests arriving within a short window into a batch for joint inference. GPU utilization jumps from 10% to 80%, throughput improves dramatically, but individual request latency increases slightly.

**Horizontal scaling** key decisions:

- **Auto-scaling metric selection**: Don't just watch CPU/GPU utilization — watch request queue depth and p99 latency. The former reflects impending problems; the latter reflects problems that already happened.
- **Model serving framework**: Interviews don't test tool name memorization, but knowing the positioning of TorchServe, Triton Inference Server, and vLLM is a plus. Triton suits multi-model heterogeneous inference; vLLM specializes in LLM KV cache management and continuous batching.

## Production Monitoring: Three Layers Plus Retraining Triggers

ML system monitoring must be layered. Use this three-layer framework in interviews:

**Layer 1: Infrastructure.** Latency, throughput, error rate, GPU memory usage. This layer is identical to software monitoring.

**Layer 2: Data and model.** This is ML-specific. Monitor input feature distribution shifts (data drift), prediction distribution shifts (prediction drift), and model quality metrics when ground truth is available. Quantify data drift with statistical tests (KS test, PSI), set thresholds to trigger alerts.

**Layer 3: Business metrics.** CTR, conversion rate, revenue per session. This layer is the ultimate north star but typically has lag — by the time business metrics drop, it's usually too late. That's why Layer 2's timely alerts are critical.

**Retraining triggers** are a high-frequency follow-up question. Two approaches:

- **Scheduled retraining**: Retrain weekly or monthly with latest data. Simple, reliable, suitable for slowly changing data distributions.
- **Triggered retraining**: Automatically trigger when data drift or model quality metrics exceed thresholds. More responsive but requires more mature pipeline infrastructure.

Recommended interview answer: "I'd start with scheduled retraining as the baseline, then add drift-triggered retraining as a supplement. Both run in parallel — scheduled retraining as a safety net, triggered retraining to catch sudden shifts."

## Common Question Types

| Type | What It Tests | How to Answer |
|------|--------------|---------------|
| Your model's accuracy dropped 5% after launch — how do you investigate? | Systematic debugging | Three steps: first check if data changed (drift check), then check if the feature pipeline broke (null rate, schema change), finally check the model itself (prediction distribution) |
| Design an automated retraining pipeline | End-to-end engineering | Draw the flow: data trigger → validation → training → evaluation → registry → canary deploy |
| How would you do canary deployment for ML? | Deployment strategy | First shadow to observe prediction distribution, then canary 5% watching business metrics, set automatic rollback conditions |
| How do you ensure training reproducibility? | Registry and version management | Track four things: model artifact, data version, code commit, hyperparams |

## Practice Question

### Question

"Your recommendation model has been live for two weeks. The A/B test shows the new model's CTR increased by 3%, but revenue per session decreased by 1.5%. How do you decide whether to roll out to all traffic?"

**Source**: Meta MLE interview (adapted)　**Difficulty**: Advanced　**Round**: onsite system design / execution

### Approach

1. **Clarify the problem**: What's the statistical significance of 3% CTR increase and 1.5% revenue decrease? How long has the A/B test been running? Is there a novelty effect? What's the traffic split?
2. **Build the framework**: This is a metric trade-off problem — two important metrics moving in opposite directions. Need to go back to business goals to judge which matters more, rather than purely looking at numbers.
3. **Go deep on the core**: CTR increasing while revenue decreases commonly means the model started recommending more low-price, high-click items (clickbait-y items), indicating objective function misalignment with business goals.
4. **Wrap up**: Don't just give a go/no-go conclusion — propose further analysis and how to correct the model objective.

### Sample Answer (How to say it in an interview)

> **First verify data credibility.** I wouldn't decide immediately. First confirm three things: first, the p-values and confidence intervals for both metrics — 3% CTR might be significant but 1.5% revenue might be in the noise range. Second, check the time series trend — was CTR lift especially high the first few days then converging (novelty effect)? Third, confirm no sample ratio mismatch.
>
> **Deep analysis of root cause.** If both metric changes are statistically significant, I need to understand why CTR went up while revenue went down. The most common cause is **objective-business misalignment** — the model was trained to maximize click probability, and it learned to recommend "easy to click but won't buy" items. I'd look at distribution shift: is the average price of recommended items lower than baseline? Did high-price item exposure decrease? If so, the loss function needs adjustment — add revenue signal to the training objective, or add an exposure fairness constraint to prevent systematic suppression of high-price items.
>
> **Decision and next steps.** In this situation, my recommendation is **don't roll out to all traffic**, but don't rollback either. Keep the A/B test running for 4 more weeks (to rule out novelty effect) while training a new model version using revenue-weighted CTR as the objective in parallel. If revenue is still declining after 4 weeks, rollback and test the new version. Also align with the business team — if they say "our OKR this quarter is engagement, not revenue," then 3% CTR lift is itself a positive result, but ensure everyone understands the revenue cost.

### Self-Check Checklist

| Checkpoint | Mentioned? |
|-----------|-----------|
| Statistical significance check (p-value, confidence interval) | |
| Novelty effect exclusion | |
| Root cause analysis (objective-business misalignment) | |
| Item price distribution shift check | |
| Not a binary go/no-go, but a conditional decision | |
| Proposed fix (revenue-weighted objective) | |
| Bonus: aligning with business team on OKR priorities | |

## References

- [Google — MLOps: Continuous delivery and automation pipelines in machine learning](https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning) — Original definition of the ML CI/CD three-level maturity model, covering data validation, model validation, and pipeline automation
- [Chip Huyen — Designing Machine Learning Systems, Ch. 9-11](https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/) — Systematic framework for production monitoring, data distribution shift, and continual learning
- [Made With ML — MLOps Course](https://madewithml.com/) — Open-source MLOps course covering the complete implementation from testing to monitoring
- [MLflow Documentation](https://mlflow.org/docs/latest/index.html) — Implementation reference for model registry and experiment tracking, a common tool for model versioning in MLOps interviews
- [Evidently AI — ML Monitoring](https://www.evidentlyai.com/) — Open-source tool for data drift and model degradation monitoring, a practical reference for production monitoring in MLOps deployment interviews
