---
title: "AI Engineer Interview Daily — 2026-10-26: ML Fundamentals"
date: 2026-10-26
category: daily
type: digest
tags: [ai-engineer-interview, daily, machine-learning]
lang: en
description: "Monday's slot is ML Fundamentals: a real Spector AI interview question anchors today's practice — when a deployed model's performance drops, how do you cleanly separate data drift, concept drift, and training-serving skew?"
tldr: "Today's core concepts are three distinct ways a deployed model can get worse, and how to tell them apart: data drift (the input distribution shifted), concept drift (the relationship between inputs and labels shifted — you need real labels to confirm it), and training-serving skew (the world didn't change at all — your training and serving code paths were computing the same feature two different ways all along). The detection tool is PSI (Population Stability Index), but PSI only tells you a distribution moved, not why — that takes a disciplined diagnostic order. Today's practice question comes straight from a real Spector AI MLE interview: a model's performance drops two weeks after launch, how do you diagnose it. The point isn't reciting the three terms — it's demonstrating a diagnostic sequence that rules out pipeline bugs and skew before ever blaming drift."
series:
  name: "AI Engineer Interview Daily"
  order: 68
---

> 🌏 [中文版](/posts/daily/2026-10-26-ai-interview-daily)

## Today's Focus

Monday is ML Fundamentals day. Today's focus is a scenario almost every MLE onsite eventually asks: a model validated well offline, but a few weeks after launch its performance drops — how do you diagnose it. On the surface this looks like a monitoring-tools question, but what it's really testing is whether you can keep "the world changed" (drift) cleanly separated from "your own system already had two inconsistent code paths" (skew) — because the fix for each is completely different. Interviewers want to hear a diagnostic sequence with real order to it, not three jargon terms thrown out at once.

## Core Concepts

### Data drift vs. concept drift vs. prediction drift

All three describe a different probability distribution shifting inside the same system. Data drift is the input feature distribution P(X) changing (say, the age structure of your user base shifts). Concept drift is the relationship between inputs and labels, P(Y|X), changing — the same feature combination now maps to a different real-world outcome, like how spending behavior's relationship to default risk shifted around a pandemic. Prediction drift is the model's output score distribution P(Ŷ) changing; it needs no labels to detect and is usually the earliest warning signal, but it's a symptom — it won't tell you on its own whether the root cause is data drift or concept drift. The classic interview trap is treating all three as the same thing. Be explicit: concept drift can only be confirmed once real (often delayed) labels come back, while data drift and prediction drift can be detected in real time.

### Training-serving skew isn't drift

This is the detail interviewers most often use to catch people out: the fundamental difference between skew and drift is whether the world actually changed. Drift means the world changed and your model hasn't kept up. Skew means the world didn't change at all — it's that the feature your training pipeline computed in batch SQL/Spark and the same feature your serving path computes in real-time Python/Flink were never actually the same number. Offline AUC might read 0.97, but recompute it using the exact features your serving path actually receives and it drops to 0.68, because training used a statistic like "orders in the last 30 days" that simply isn't available at the point in time serving needs it. Misdiagnose this as drift and rush to retrain, and you just ship a new model with the exact same bug — nothing gets fixed.

### PSI (Population Stability Index) tells you whether a distribution moved

PSI is the most common metric for comparing a feature's distribution during training against its distribution in the current time window: bucket the values into bins and sum up the change in each bin's share. The industry-standard thresholds are PSI < 0.1 = stable, 0.1–0.25 = a minor shift worth watching, and > 0.25 = significant drift that should trigger retraining or a rollback. Know PSI's limitation going in: it only tells you a distribution moved, never why. Binning choices, small sample sizes, and seasonality can all trigger false alarms — so a PSI breach is a signal to start investigating, not a conclusion on its own.

### An offline metric isn't the same thing as an online business metric

Even once skew and drift are both ruled out, picking the wrong offline metric in the first place can decouple "looks good" from "works in production." Offline evaluation uses some fixed metric (AUC, F1) against a historical distribution, but the business actually cares about post-launch conversion, revenue, or the cost of misclassification — and in between sit data leakage, how you split your data in time, and which guardrail metrics your A/B test even tracks. A common interviewer follow-up is "how do you know this model actually works, not just that the score looks good" — the answer ties back to evaluating offline with a time-respecting split, then confirming the business metric with an A/B test rather than trusting a single offline number.

## Today's Practice Question

### The Question

You deployed a model, but two weeks later its performance has clearly dropped. How would you diagnose this, and how would you fix it?

**Source**: Spector AI Machine Learning Engineer interview (compiled from the knok.work interview guide)　**Difficulty**: Medium　**Round**: Onsite technical

### How to Break It Down

1. **Clarify first**: Is the drop sudden or gradual (sudden points more toward a pipeline bug or skew; gradual points more toward drift)? Did anything change on the product side around deployment (a UI change alone can shift user behavior)? Do ground-truth labels arrive immediately or with a delay? What's the business cost of this drop versus the cost of retraining?
2. **Build a framework**: Lay out the investigation as four layers instead of dumping three terms at once — (1) check whether the data pipeline itself is broken (schema changes, dropped joins, unexpected nulls), (2) verify the training and serving feature-computation logic actually agree (the skew check), (3) compare feature distributions with PSI or a KS test (data drift), and (4) if delayed labels are available, check whether the relationship between predictions and real outcomes has shifted (concept drift). Drift only becomes a live hypothesis once the first two layers are ruled out.
3. **Go deep on the technical core**: The real substance here is that skew and drift need completely different fixes. Skew is a code bug — the answer is consolidating feature definitions into a shared feature store (like Feast) so training and serving call the same definition, which makes the two paths structurally unable to diverge again. Drift means the world actually changed — only then is retraining the right answer, and ideally through a continuous-training pipeline with a validation gate, so detecting drift doesn't automatically push a new model to production; it has to pass validation first.
4. **Close it out**: Land on one sentence — "diagnosing a performance drop isn't about picking a label to stick on it; it's ruling out pipeline issues and skew in order, and only what's left over is drift that actually needs retraining" — then add a line on prevention: consolidate feature definitions into a feature store to eliminate skew altogether, and use tiered PSI alerting (log minor shifts, only trigger retraining on major ones) to avoid over-sensitive false alarms.

```diagram
title: Diagnostic order when a deployed model's performance drops
desc: Rule out a data pipeline problem first, then check for training-serving skew, and only then use PSI to decide whether it's genuine data drift — a stable distribution just needs continued monitoring, and only after all three layers are ruled out does retraining come into play.
caption: Simplified for clarity — a full diagnosis also uses delayed labels to confirm concept drift specifically; see the text above.
step: First check whether the data pipeline itself is broken (schema, nulls, joins)
step: Once the pipeline is ruled out, recompute offline using the actual serving features — does the score drop back to the live level? (the skew check)
step: Compare feature distributions with PSI
step: If the distribution genuinely shifted, only then schedule retraining, gated behind validation before it replaces the live model
---
<svg viewBox="0 0 640 568">
  <path class="dg-line" d="M280 34V64" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line dg-line--warn" d="M376 108H432" marker-end="url(#arrow-warn)" data-step="1"/>
  <path class="dg-line" d="M280 152V204" marker-end="url(#arrow)" data-step="1 2"/>
  <path class="dg-line dg-line--accent" d="M376 248H432" marker-end="url(#arrow-accent)" data-step="2"/>
  <path class="dg-line" d="M280 292V344" marker-end="url(#arrow)" data-step="2 3"/>
  <path class="dg-line" d="M376 388H432" marker-end="url(#arrow)" data-step="3"/>
  <path class="dg-line dg-line--accent" d="M280 432V484" marker-end="url(#arrow-accent)" data-step="3 4"/>

  <circle class="dg-dot" cx="280" cy="28" r="6" data-step="1"/>

  <g data-step="1">
    <path class="dg-box" d="M280 64L376 108L280 152L184 108Z"/>
    <text class="dg-label" x="280" y="98" text-anchor="middle" dominant-baseline="central">Pipeline broken?</text>
    <text class="dg-sub" x="280" y="120" text-anchor="middle" dominant-baseline="central">schema／nulls</text>
  </g>

  <g data-step="1">
    <rect class="dg-box dg-box--warn" x="432" y="84" width="144" height="48" rx="6"/>
    <text class="dg-label" x="504" y="108" text-anchor="middle" dominant-baseline="central">Fix pipeline</text>
  </g>

  <g data-step="2">
    <path class="dg-box" d="M280 204L376 248L280 292L184 248Z"/>
    <text class="dg-label" x="280" y="238" text-anchor="middle" dominant-baseline="central">Recompute drops score?</text>
    <text class="dg-sub" x="280" y="260" text-anchor="middle" dominant-baseline="central">skew check</text>
  </g>

  <g data-step="2">
    <rect class="dg-box dg-box--accent" x="432" y="220" width="144" height="56" rx="6"/>
    <text class="dg-label" x="504" y="238" text-anchor="middle" dominant-baseline="central">Unify features</text>
    <text class="dg-sub" x="504" y="260" text-anchor="middle" dominant-baseline="central">Feature Store</text>
  </g>

  <g data-step="3">
    <path class="dg-box" d="M280 344L376 388L280 432L184 388Z"/>
    <text class="dg-label" x="280" y="378" text-anchor="middle" dominant-baseline="central">Distribution stable?</text>
    <text class="dg-sub" x="280" y="400" text-anchor="middle" dominant-baseline="central">PSI&lt;0.1</text>
  </g>

  <g data-step="3">
    <rect class="dg-box" x="432" y="360" width="144" height="56" rx="6"/>
    <text class="dg-label" x="504" y="378" text-anchor="middle" dominant-baseline="central">Keep watching</text>
    <text class="dg-sub" x="504" y="400" text-anchor="middle" dominant-baseline="central">could be noise</text>
  </g>

  <g data-step="4">
    <rect class="dg-box dg-box--accent" x="208" y="484" width="144" height="64" rx="6"/>
    <text class="dg-label" x="280" y="506" text-anchor="middle" dominant-baseline="central">Retrain</text>
    <text class="dg-sub" x="280" y="528" text-anchor="middle" dominant-baseline="central">gate on validation</text>
  </g>

  <text class="dg-edge dg-text--warn" x="404" y="96" text-anchor="middle" dominant-baseline="central" data-step="1">Yes</text>
  <text class="dg-edge" x="290" y="178" text-anchor="start" dominant-baseline="central" data-step="1 2">No</text>
  <text class="dg-edge" x="404" y="236" text-anchor="middle" dominant-baseline="central" data-step="2">Yes</text>
  <text class="dg-edge" x="290" y="318" text-anchor="start" dominant-baseline="central" data-step="2 3">No</text>
  <text class="dg-edge" x="404" y="376" text-anchor="middle" dominant-baseline="central" data-step="3">Yes</text>
  <text class="dg-edge" x="290" y="458" text-anchor="start" dominant-baseline="central" data-step="3 4">No</text>
</svg>
```

### Sample Answer (say it like this in the interview)

> **Rule out the cheapest explanation first.** When performance drops, I'd check the data pipeline itself first — did the schema change, is a join silently dropping rows, has some upstream source been returning nulls for a while. These checks are cheaper than any statistical test, and in my experience, pipeline bugs plus skew combined show up more often than genuine concept drift. Next I'd rerun offline evaluation using the exact raw features serving actually receives. If the score drops back to the live level right there, that's training-serving skew, not drift — it means the feature-computation logic never matched between training and serving in the first place, and retraining won't fix that.
>
> **Only talk about drift once the distribution genuinely moved.** With the pipeline and skew both ruled out, I'd compare the current time window's feature distribution against the training-period distribution using PSI, treating anything above 0.25 as significant drift. But PSI only tells me the distribution moved — it doesn't tell me whether the relationship with the label changed too. If delayed labels are coming in — something like default risk, where the real outcome only shows up after a while — I'd separately track whether the relationship between predicted scores and actual outcomes has shifted systematically. That's the direct evidence for concept drift.
>
> **Match the fix to the root cause.** If it's skew, I'd consolidate the feature definition into a feature store so training and serving share the exact same logic, eliminating the problem structurally. If it's genuine drift, only then would I schedule retraining — behind a continuous-training pipeline with a validation gate, so a detected drift triggers a retrain candidate, but that candidate still has to pass validation before it replaces the live model; nothing switches over unsupervised.

### Self-Check

Use this table to catch anything your answer might have skipped:

| Check | Covered? |
|---------|---------|
| Checked the data pipeline itself first instead of jumping straight to a statistical test | |
| Clearly separated training-serving skew from data drift (the world changed vs. two code paths were never consistent) | |
| Explained that concept drift needs real labels to confirm, unlike data drift which can be detected in real time | |
| Mentioned both what PSI is good for and its limits (detects that a distribution moved, not why) | |
| Matched the fix to the root cause (feature store for skew, validation-gated retraining for drift) | |
| Bonus: mentioned tiered alerting (log minor shifts, only trigger retraining on major ones) to avoid false alarms | |

## Further Reading

- [Training-Serving Skew and Feature Stores Explained — Stacktrick](https://stacktrick.com/notes/mlops-training-serving-skew-feature-stores/) — walks through a real churn-model example: 0.977 offline AUC versus 0.681 once recomputed with the actual live features, a concrete demonstration of the skew-versus-drift gap.
- [Concept Drift vs Data Drift vs Model Drift: Key Differences — ML Monitoring Report](https://mlmonitoring.report/posts/concept-drift-vs-data-drift-explained/) — tabulates the three drift types against detection tools like PSI, KS tests, and ADWIN, a good next step into the algorithmic side of detection.

## References

- [spector-ai Machine Learning Engineer Interview: Questions & Prep — knok.work](https://knok.work/blog/spector-ai-machine-learning-engineer-interview.html) — source of today's practice question and its STAR-format sample answer.
- [Machine Learning Engineer Onsite Interview: Round by Round — CoPilot Interview](https://copilotinterview.com/blog/machine-learning-engineer-onsite-interview) — source of the "Today's Focus" scenario, corresponding to question 6 in its ML fundamentals round.
- [Streaming Machine Learning – Real-Time Features, Kafka, Flink — Data Expertise](https://www.dataexpertise.in/streaming-machine-learning-real-time-features-kafka-online-learning/) — backs the three-distribution definitions (P(X), P(Y|X), P(Ŷ)) in "Data drift vs. concept drift vs. prediction drift."
- [Training-Serving Skew and Feature Stores Explained — Stacktrick](https://stacktrick.com/notes/mlops-training-serving-skew-feature-stores/) — backs the core distinction and worked example in "Training-serving skew isn't drift."
- [Monitor ML Models in Production (Drift): Practical Guide 2026 — khimananda.com](https://khimananda.com/blog/monitor-ml-models-in-production-drift) — backs the PSI thresholds (0.1 / 0.25) and tiered-alerting strategy in "PSI tells you whether a distribution moved."
