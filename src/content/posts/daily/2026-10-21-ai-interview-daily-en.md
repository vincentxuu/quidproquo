---
title: "AI Engineer Interview Daily — 2026-10-21: ML System Design"
date: 2026-10-21
category: daily
type: digest
tags: [ai-engineer-interview, daily, system-design]
lang: en
description: "Today's slot is the ML system design framework, practiced on a fraud-detection design prompt: how to pick metrics for a rare-event problem and handle delayed labels."
tldr: "ML system design differs from classic system design in one layer: what the system predicts, how you know the prediction works, and how it quietly decays. Today's practice uses a fraud-detection design question to work through that layer."
series:
  name: "AI Engineer Interview Daily"
  order: 63
---

> 🌏 [中文版](/posts/daily/2026-10-21-ai-interview-daily)

## Today's Focus

Today's practice is ML System Design. The round doesn't test whether you can draw an architecture diagram — it tests whether, on top of a regular system-design data flow, you can clearly explain what the system predicts, how you know the prediction actually works, and how it can quietly get worse over time. A classic system design round fails loudly: outages, data loss. An ML system design round fails silently: drift, feedback loops, and training-serving skew don't crash the service, they just make it gradually wrong.

This round shows up most often in ML Engineer and Applied Scientist onsites. What the interviewer is actually listening for usually isn't your choice of model architecture — it's whether you settle "does this even need ML" and "where do the labels come from, and how messy are they" before you start drawing boxes.

## Core Concepts

### 1. The fixed eight-step framework: problem → metrics → data → features → model → training → serving → monitoring

A reasonable time budget for a 45-minute round: problem framing (5 min), metrics (4 min), data and labels (6 min), features (5 min), model (8 min), training and evaluation (5 min), serving (6 min), monitoring (4 min). Most candidates spend too long on model choice, which leaves serving and monitoring rushed — and those two are exactly what interviewers want to hear most.

### 2. Pair an offline metric with an online metric, plus a guardrail

Saying "accuracy" alone is close to a zero score, especially when positive and negative classes are wildly imbalanced (fraud, spam). The right answer names three things together: an offline metric you can compute on a held-out set (precision-recall AUC, NDCG), an online metric you'd actually A/B test (sessions per user, dollars of fraud caught), and at least one guardrail that must not get worse (false-decline rate, user complaint volume). An offline win doesn't mean you ship — the ship decision comes from real online behavior in an A/B test, and this rule holds across fraud detection, recommendation, and ranking systems alike.

### 3. A feature store fixes training-serving skew

Training-serving skew — a mismatch between the feature logic used in training and what the model actually sees at prediction time — is the single most common thing interviewers dig into in this round. The fix is to write the feature transformation logic once and have both the offline training pipeline and the online serving path call the same code, instead of each side writing its own version; you also log the features the serving path actually used at prediction time and train on those, rather than reconstructing them offline and guessing. Batch features (slow-changing, precomputable) and real-time features (what the user just did, computed on the fly) are deliberately split — that split is what a feature store is for.

### 4. Monitoring means watching drift, skew, and feedback loops — not "retrain when it feels off"

If you say "we retrain when the model gets worse," the interviewer will immediately ask how you'd know. The concrete answer names what's actually being watched: whether feature distributions have drifted (tested statistically, e.g. PSI or a KS test), whether online metrics have dropped for a specific segment, and whether the system has fallen into a feedback loop — learning only from items it already chose to show, which narrows what it shows over time. Feedback loops are especially common in recommendation and ranking systems, because the system only ever logs outcomes for items it displayed; items it never showed get no signal at all.

## Today's Practice Question

### The Question

Design a real-time fraud detection system for credit card transactions: every transaction must be scored at authorization time, and the system decides to approve, decline, or route to manual review. Fraud is a tiny fraction of the overall population, and the ground-truth label (confirmed fraud via chargeback) typically takes weeks to arrive through the dispute process. Explain how you'd pick metrics, how you'd handle the delayed labels, and how the serving path should fall back when something goes wrong.

**Source**: Adapted from the fraud-detection worked prompt in CoPilot Interview's "ML System Design Interview" framework article (published 2026-10-14) **Difficulty**: Advanced **Round**: Onsite ML system design

### Breaking It Down

1. **Clarify the problem first**: ask about transaction volume (per second), the latency ceiling tolerable on the authorization path, how large the manual-review team's capacity is (which bounds how much you can route to them), and whether the business weighs false declines and missed fraud symmetrically or not.
2. **Build the framework**: split the system into three lines — the real-time scoring path (runs at authorization time), the label-collection pipeline (disputes and chargebacks arrive over time and update the training set), and the monitoring/retraining loop (detects changing attack patterns and triggers retraining). State how these three lines feed each other before diving into details.
3. **Go deep on the core trade-offs**: two trade-offs matter most. First, metrics — fraud is a rare event, so accuracy is meaningless; use precision-recall AUC offline, and translate it online into "dollars of fraud caught" versus "number of good customers wrongly declined." Second, label delay and bias — chargebacks are typically confirmed weeks later, so the most recent one or two weeks of data looks "all clean" at the time, when it's actually mixed with fraud that just hasn't been flagged yet. Separately, transactions the model directly declines never get a true label, because the customer never completes the transaction — that's selection bias, and you correct for it by letting a small slice of low-risk-score transactions through as usual, just flagged, so you can measure what the model would otherwise be blind to.
4. **Close it out**: the serving side needs an explicit fallback — if the model times out or goes down, fall back to the rules engine rather than stalling the transaction. Tie drift monitoring (score distribution, approval rate, manual-review hit rate) to a periodic retraining cadence, and close with one concrete number, e.g. "the rules-plus-model two-tier design cut manual review volume from 8,000 to 2,200 transactions a day while keeping fraud catch rate above 91%" — that's what makes the interviewer feel you've actually thought through the scale.

### Sample Answer (How You'd Actually Say This in an Interview)

> I'd start by pinning down scale and latency: say we're processing a few thousand authorization requests per second, with a latency budget in the tens of milliseconds, and the manual-review team can only handle a limited volume per day — so the model's job is to keep the "needs a human look" volume within that capacity while declining as few good customers as possible. **On metrics**, fraud is maybe a few tenths of a percent of all transactions, so I wouldn't use accuracy. Offline I'd evaluate with precision-recall AUC at a fixed review-capacity constraint; online I'd translate that into two business numbers — dollars of fraud caught versus number of good customers wrongly declined — plus a guardrail that can't get worse: the false-decline complaint rate.
>
> **The label side is where this question usually trips people up**: chargebacks take weeks to confirm, so I wouldn't treat the last two weeks of data as a clean negative set — I'd use a sliding window and only pull data into the training set once its confirmation period has passed. Separately, transactions the model directly blocks never get a true label — that's selection bias — so I'd let a small slice of borderline, low-risk-score transactions go through as usual, just flagged, and use that data to correct for the bias in the model's own blocking decisions.
>
> **Architecturally** I'd use a two-tier design: a rules engine for clearly known attack patterns (like the same card appearing in different cities within minutes), and a tree model (like LightGBM) for the gray area — both are interpretable and keep latency predictable. On the serving side, if the model times out, it fails open to the rules engine rather than stalling the transaction entirely. Monitoring watches score distribution drift, approval rate, and manual-review hit rate, and triggers retraining the moment attack patterns shift.

### Self-Check

Use this table to check whether your answer hit the key points:

| Checklist item | Covered? |
|---|---|
| Explained why accuracy doesn't work here and used precision-recall or a business metric instead | |
| Explained how label delay (chargeback lag) contaminates the training set | |
| Identified that model-declined transactions have selection bias, with a correction method | |
| Serving side has an explicit fallback (fail open to rules engine on model timeout) | |
| Monitoring is concrete: score distribution drift, approval rate, manual-review hit rate | |
| Bonus: mentioned using a small slice of low-risk transactions for counterfactual data collection | |

## Further Reading

- [ML System Design Interview: Framework and 3 Examples](https://copilotinterview.com/blog/ml-system-design-interview) — the full 8-step framework, three worked prompts (feed ranking, fraud detection, search ranking), and the interviewer rubric table
- [Design a recommendation system: the ML system design interview walkthrough](https://dev.to/gowthampotureddi/design-a-recommendation-system-the-ml-system-design-interview-walkthrough-5a67) — a step-by-step breakdown of how to split retrieval from ranking, and how to answer feedback-loop and cold-start follow-ups
- [Top Machine Learning Interview Questions You Must Prepare In 2026](https://www.icertglobal.com/blog/machine-learning-interview-questions) — a roundup of how 2026 interviews have shifted toward production MLOps and drift detection

## References

- [ML System Design Interview: Framework and 3 Examples](https://copilotinterview.com/blog/ml-system-design-interview) — source for today's "eight-step framework," "offline/online metrics," and "feature store fixes skew" concepts, and the adapted fraud-detection practice question
- [Design a recommendation system: the ML system design interview walkthrough](https://dev.to/gowthampotureddi/design-a-recommendation-system-the-ml-system-design-interview-walkthrough-5a67) — supporting source for the feedback-loop portion of the "monitoring" concept
- [Top Machine Learning Interview Questions You Must Prepare In 2026](https://www.icertglobal.com/blog/machine-learning-interview-questions) — background on the 2026 interview trend toward production MLOps and drift detection
