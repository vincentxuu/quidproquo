---
title: "AI Engineer Interview Daily — 2026-11-09: ML Fundamentals"
date: 2026-11-09
category: daily
type: digest
tags: [ai-engineer-interview, daily, machine-learning]
lang: en
description: "Monday's slot is ML Fundamentals: why accuracy quietly lies when fraud is only 0.1% of transactions, and which metrics actually tell you whether the model works."
tldr: "Today's core idea is metric choice under extreme class imbalance. Accuracy breaks down when fraud is 0.1% of transactions, because a model that always predicts \"legitimate\" scores 99.9% accuracy while catching zero fraud. Precision and recall pull in opposite business directions — prioritizing recall means accepting more false alarms on legitimate transactions in exchange for catching more fraud. ROC-AUC looks better than it should under heavy imbalance, which is exactly when you need to switch to a precision-recall curve to see the real tradeoff at each threshold. Today's practice question comes from Pensero's AI engineer interview prep guide: \"You're building fraud detection where 0.1% of transactions are fraudulent. Why is accuracy poor? What metrics would you use?\" The trap is reciting precision/recall formulas without being able to tie the operating threshold back to actual business cost."
series:
  name: "AI Engineer Interview Daily"
  order: 82
---

> 🌏 [中文版](/posts/daily/2026-11-09-ai-interview-daily)

## Today's Focus

Monday is ML Fundamentals day. This question looks like a formula check, but the real test is whether you know which metric lies to you under a given data distribution. Fraud detection, anomaly detection, rare-disease classification — any setting where the positive class is a tiny sliver of the data — are exactly the scenarios interviewers reach for to separate candidates who memorized definitions from candidates who understand the assumptions baked into each metric. This question shows up constantly in technical screens and the ML fundamentals round of onsites, and how well you handle it tends to set the tone for how much benefit of the doubt you get in the applied-ML and system-design rounds that follow.

## Core Concepts

### Accuracy is a false signal under extreme imbalance

Accuracy measures the fraction of correct predictions, which is intuitive when classes are roughly balanced. But when the positive class is 0.1% of the data, a model that does nothing — always predicting "legitimate" — scores 99.9% accuracy while catching exactly zero fraud. That's not the model being clever; it's the base rate doing all the work. The majority class is so large that guessing it blindly inflates the overall score, so accuracy shouldn't be treated as a primary metric on imbalanced data in the first place.

### Precision and recall pull in opposite business directions

Precision asks: of the transactions I flagged as fraud, how many actually are? Recall asks: of all the real fraud, how much did I catch? These two are structurally opposed — lower the decision threshold and recall goes up (catch more fraud) while precision goes down (more legitimate transactions get flagged, diluting the investigation team's time). Raise the threshold and it's the reverse: fewer false alarms, but more fraud slips through. Fraud detection usually leans toward prioritizing recall, since missing a fraudulent transaction typically costs more than investigating a few extra legitimate ones — but exactly how much precision you're willing to sacrifice has to be calculated against real operating cost, not assumed.

### ROC-AUC runs artificially high under heavy imbalance — the PR curve is where the truth is

ROC-AUC measures how well the model ranks positives above negatives across all thresholds, but its false-positive-rate denominator is the entire negative class. When negatives vastly outnumber positives, even a non-trivial absolute number of false positives produces a tiny FPR, so the ROC curve looks good and AUC comes out high regardless. The precision-recall curve keeps both axes tied to the positive class only, so the more imbalanced the data, the more clearly it shows how much precision actually drops at a given recall level. When an interviewer asks "the model has high AUC but low precision — what's going on," the right move is to switch to the PR curve, not to assume something's broken with the data.

### Setting the operating threshold means tying the metric back to business cost

Computing a stack of precision/recall/F1 numbers isn't the finish line — the actual decision is where to set the threshold. That can mean reweighting the loss function so errors on the minority class cost more, moving the decision threshold directly, or under/oversampling during training to make the model more sensitive to the rare class. Whichever lever you pull, the question that matters is: how does the average loss saved per fraud case caught compare to the investigation cost and user friction from one extra false flag? That cost comparison — not the metric list — is what interviewers are actually listening for at the end of the answer.

## Today's Practice Question

### The Question

You're building fraud detection where 0.1% of transactions are fraudulent. Why is accuracy poor? What metrics would you use?

**Source**: Pensero's AI Engineer Interview Questions preparation guide, listed as a common ML fundamentals question　**Difficulty**: Basic　**Round**: Technical screen / ML fundamentals round

### How to Break It Down

1. **Clarify first**: Worth confirming whether "0.1%" describes the training data or the actual live traffic rate — if the two diverge, the reweighting or sampling strategy you'd propose later changes. Asking this signals you understand training distribution and production distribution can drift apart.
2. **Build the frame**: Start from the root cause — base-rate inflation — then line up precision, recall, F1, the PR curve, and ROC-AUC by what each one actually measures, rather than dumping all the terminology into one sentence.
3. **Go deep**: Explain why precision and recall are structurally opposed, and why ROC-AUC runs high under this kind of imbalance — this is the part that separates a strong answer from a memorized one. If you can't explain why imbalance makes ROC look better than it should, a sharp interviewer will push until it breaks.
4. **Close it out**: Bring the answer back to the business decision — fraud detection usually favors recall, but the final threshold has to balance "loss saved per fraud case caught" against "investigation cost and user friction per false flag," and add that the real validation comes from live A/B testing or investigator feedback, not offline metrics alone.

### Sample Answer (how you'd actually say this in an interview)

> **Start with why accuracy breaks here**: If fraud is only 0.1% of transactions, a model that always predicts "legitimate" scores 99.9% accuracy while catching exactly zero fraud. That's base-rate inflation — the majority class is so large that guessing it blindly pushes the overall score up, so accuracy was never the right metric to optimize for in this setting.
>
> **Switch to metrics tied directly to the minority class**: I'd look at precision — of what I flag as fraud, how much actually is — and recall — of all real fraud, how much I catch. These two are structurally opposed: lower the threshold and recall rises but precision drops. More importantly, ROC-AUC runs artificially high under this kind of imbalance, because its false-positive-rate denominator is the entire negative class — even a meaningful absolute number of false positives produces a tiny ratio when negatives vastly outnumber positives, so the curve looks great. That's when I'd switch to the precision-recall curve instead, since both axes stay tied to the positive class and show how much precision actually erodes at a given recall level.
>
> **Then tie the metric choice back to cost**: Fraud detection usually leans toward prioritizing recall, since missing a fraud case typically costs more than investigating a few extra legitimate transactions — but where exactly to set the threshold is something I'd work out with the business side: the average loss saved per fraud case caught versus the investigation time and user friction cost per false flag. I'd push the threshold toward that point using reweighted loss or direct threshold tuning, then validate with real investigator feedback and A/B testing rather than treating the offline precision/recall numbers as the final answer.

### Self-Check

Use this table to check whether your answer hit the key points:

| Checkpoint | Covered? |
|---------|---------|
| Explained why accuracy misleads under extreme imbalance (99.9% accuracy at a 0.1% base rate while catching zero positives) | |
| Correctly defined precision and recall, and explained their opposing business tradeoff | |
| Explained why ROC-AUC runs artificially high under heavy imbalance, and why the PR curve is the right tool instead | |
| Named at least one concrete lever (reweighted loss, threshold tuning, under/oversampling) | |
| Tied metric choice back to business cost (fraud caught vs. investigation cost of false flags) | |
| Bonus: mentioned validating with A/B testing or investigator feedback after deployment, not just offline metrics | |

## Further Reading

- [Handle highly imbalanced classification data — PracHub](https://prachub.com/interview-questions/handle-highly-imbalanced-classification-data) — Breaks down concrete handling strategies (reweighting, sampling) for imbalanced data, filling in the "adjust the operating threshold" step from today's question.
- [Design payment fraud detection — PracHub](https://prachub.com/interview-questions/design-payment-fraud-detection) — Extends today's metric-choice question into a full fraud detection system design problem, a natural follow-up once this one clicks.

## References

- [AI Engineer Interview Questions: Preparation Guide for 2026 — Pensero](https://pensero.ai/blog/ai-engineer-interview-questions) — Source of today's practice question, "You're building fraud detection where 0.1% of transactions are fraudulent," and its suggested answer structure.
- [Machine Learning Interview Questions: Complete 2026 Guide — PracHub](https://prachub.com/resources/machine-learning-interview-questions-guide-2026) — Source for the "ROC-AUC runs artificially high under heavy imbalance" section; PracHub's worked example (Q3: high AUC-ROC but low precision) walks through the same reasoning.
- [Machine Learning Interview Prep Guide (2026) — Coursera](https://www.coursera.org/resources/machine-learning-interview-prep-guide) — Source for the "Precision and recall pull in opposite business directions" section's metric definitions (precision/recall/F1/AUC/log loss).
