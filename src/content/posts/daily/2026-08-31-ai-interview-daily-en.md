---
title: "AI Engineer Interview Daily — 2026-08-31: ML Fundamentals"
date: 2026-08-31
category: daily
tags: [ai-engineer-interview, daily, machine-learning]
lang: en
description: "Today's ML fundamentals drill: why AUC-ROC inflates on imbalanced data, why classifiers use cross-entropy instead of MSE, what bagging and boosting each fix, and why multicollinearity kills interpretability but not predictive accuracy."
tldr: "ML fundamentals interviews test whether you can diagnose the gap between 'the metric looks great' and 'production is on fire.' Today covers four high-frequency topics: why AUC-ROC inflates under heavy class imbalance, why cross-entropy beats MSE for classification (it comes down to vanishing gradients), whether bagging or boosting fixes variance versus bias, and the common misconception that multicollinearity hurts prediction — it only hurts interpretability."
series:
  name: "AI Engineer Interview Daily"
  order: 12
---

> 🌏 [中文版](/posts/daily/2026-08-31-ai-interview-daily)

## Today's Topic

This is round two of ML Fundamentals. Last week covered bias-variance diagnosis, the geometric intuition behind L1/L2, choosing a loss function, and the AdamW-versus-Adam-plus-L2 distinction. This week's set is a different angle on the same high-frequency territory: why classification uses cross-entropy instead of MSE, whether your evaluation metric is lying to you on imbalanced data, which error source each ensemble method actually reduces, and a classic correlated-features trap. Interviewers reach for these questions to separate candidates who understand the mechanism from candidates who memorized the formula — they show up as quickfire rounds in phone screens and as follow-up probes in onsite technical rounds.

## Core Concepts Quick Reference

### Cross-Entropy vs. MSE — Why Classifiers Don't Use Mean Squared Error

You can technically train a classifier with MSE by treating a 0/1 label as a regression target, but it has a fatal flaw: paired with a sigmoid output, MSE barely punishes confident wrong answers, and the gradient vanishes exactly when you need it most. Say the true label is 1 and the model confidently predicts 0.01. MSE's penalty is about (1 − 0.01)² ≈ 0.98 — nearly identical to the penalty for predicting 0.1, which is (1 − 0.1)² ≈ 0.81. That doesn't reflect how badly wrong the first prediction is. Worse, backpropagating MSE through a sigmoid multiplies the gradient by the sigmoid's derivative, and that derivative approaches zero exactly when the output is near 0 or 1 — precisely when the model is most confident and most needs correcting. That's textbook vanishing gradient. Cross-entropy paired with a sigmoid or softmax output collapses the gradient to a clean "predicted probability minus true label," sidestepping the problem entirely. That's why nearly every classifier trains on cross-entropy instead of MSE.

### PR-AUC vs. ROC-AUC — Which Curve to Trust on Imbalanced Data

The ROC curve plots true positive rate against false positive rate, and FPR's denominator is every true negative (FP + TN). When negatives vastly outnumber positives — say 99% of transactions are legitimate in a fraud model — even a flood of false positives large enough to overwhelm your support team can leave FPR looking tiny, so AUC-ROC still looks great while precision quietly collapses. The precision-recall curve only looks at the positive class, so it isn't diluted by a massive negative base. Under heavy imbalance, PR-AUC is the honest number. One detail that scores points in an interview: a random classifier's PR-AUC baseline equals the positive class rate, not 0.5.

### Bagging vs. Boosting — Two Different Error-Correction Mechanisms

Bagging (random forests, for example) trains many models in parallel, each on a different bootstrap sample, then averages their predictions. That averaging mainly cuts variance — each tree's random errors tend to cancel out, but the systematic bias shared by every tree doesn't go away. Boosting (XGBoost, LightGBM) trains sequentially instead: each new tree targets the residual the ensemble has failed to learn so far. That mechanism mainly cuts bias, because the model keeps getting pushed to fit patterns it previously missed — at the cost that training too long can start fitting noise too, letting variance creep back up. The line that lands in an interview is "bagging treats variance, boosting treats bias" — being able to explain why beats reciting the two definitions.

### Multicollinearity — Interpretability Dies, Prediction Survives

When features are highly correlated, predictive accuracy barely suffers. If two features correlate at 0.95, a model can assign +50 to one and −48 to the other and land at almost the same numerical fit as +2 and 0. What actually breaks is explanation: that unstable coefficient split will flip under a different sample or a reordered column, and any causal story you tell from those coefficients is unreliable. The right interview move is to ask back: is this for prediction or inference? For prediction, multicollinearity barely matters — ridge handles it. For inference, a VIF (variance inflation factor) above 10 is the signal to drop or combine the correlated features.

## Today's Practice Problem

### Problem

You trained a credit card fraud detection model. Offline, it scores an AUC-ROC of 0.92 — looks great, so you ship it. After launch, the support team reports that among transactions the system flags for manual review, only about 30% are actual fraud (precision of 0.3), and a wave of legitimate customer transactions are getting blocked, driving up complaints. Explain why this gap happened and what you'd do next.

**Source**: Adapted from a common question in PracHub's "Machine Learning Interview Questions: Complete 2026 Guide" | **Difficulty**: Medium | **Stage**: phone screen / onsite technical

### Breakdown

1. **Clarify the problem first**: What's the current classification threshold? Roughly what fraction of transactions are actually fraud (how severe is the imbalance)? Is low precision coming from too many false positives, or has the production data distribution simply drifted from what you tested offline?

2. **Establish a framework**: Explain why AUC-ROC lies in this setup — its FPR denominator is every true negative (legitimate transaction), and when negatives vastly outnumber positives, FPR can stay tiny even when the absolute count of false positives is large enough to overwhelm support. That's when you switch lenses: the PR curve only looks at how the model does on positives, so it isn't diluted by the huge negative base.

3. **Dive into the core**: Pull up the confusion matrix and separate "ranking ability" (what AUC-ROC reflects) from "actual performance at the current threshold" (what precision and recall reflect). The key trade-off isn't a metric — it's cost: weigh the cost of wrongly blocking a legitimate transaction (complaints, lost trust) against the cost of missing real fraud. If blocking legitimate transactions is far more expensive than the current threshold implies, raise the threshold and use the PR curve to find a new operating point that matches the actual cost structure.

4. **Wrap up**: Emphasize ongoing monitoring — precision and recall in production, not just the offline metric at launch — because the true fraud rate itself drifts over time and the threshold needs periodic recalibration. Add one more line: a high AUC doesn't mean the model is calibrated. That detail tells the interviewer you're not just reciting formulas.

### Sample Answer (how to say this out loud in an interview)

> A high AUC-ROC paired with low precision makes me suspect the metric itself is misleading me because of severe class imbalance. AUC-ROC is built on FPR, and FPR's denominator is every legitimate transaction — vastly more than the fraud cases — so even a flood of blocked legitimate customers can leave FPR small enough that AUC still looks great. At that point I stop trusting AUC and go straight to the PR curve and the confusion matrix at the current threshold, to confirm whether low precision comes from too many false positives or whether the production distribution has simply drifted from what I tested offline.
>
> If it's a threshold problem, I'd first pin down one thing with the business side: which costs more — wrongly blocking a legitimate transaction (complaints, eroded trust) or missing an actual fraud case (direct loss)? That answer decides which direction to move the threshold, not my own sense of what "looks balanced." If blocking legitimate transactions is clearly more expensive, I'd use the PR curve to find the threshold that maximizes precision at an acceptable recall level, and reset the decision boundary there.
>
> After shipping the fix, I'd keep monitoring precision and recall in production instead of trusting the offline AUC alone, because the true fraud rate drifts over time and the threshold needs periodic recalibration. I'd also check whether the model's probability outputs are calibrated — AUC only measures ranking ability, it says nothing about whether "80% fraud probability" actually corresponds to an 80% real-world rate.

### Self-Check Checklist

Use this table to verify your answer covers the key points:

| Check Item | Mentioned? |
|---------|---------|
| Explained why AUC-ROC inflates under class imbalance (FPR's denominator is the huge negative count) | |
| Mentioned switching to the PR curve / PR-AUC to see true positive-class performance | |
| Threshold choice is driven by the real cost of FP vs. FN, not a "balanced-looking" number | |
| Mentioned ongoing production monitoring of precision/recall, not just trusting offline AUC | |
| Ruled out distribution drift as a cause before assuming it's purely a threshold problem | |
| Bonus: noted that AUC measures ranking only, and is separate from probability calibration | |

## Further Reading

- [AI/ML Interview: Model Evaluation Metrics — techinterview](https://www.techinterview.org/post/3233474426/ai-ml-interview-model-evaluation-metrics-precision-recall-f1-auc-roc-confusion-matrix-cross-validation/) — Full breakdown of when PR-AUC should replace ROC-AUC, and how to pick metrics case by case
- [Evaluation Metrics Deep Dive](http://fahimfaisal.info/ml_and_llm_learning/03_evaluation_metrics/EVALUATION_METRICS_DEEP_DIVE.html) — Deeper derivations and a running list of common interview traps, for anyone who wants to go further
- [25 Machine Learning Interview Questions for 2026](https://blog.interviewpal.com/25-machine-learning-interview-questions-for-2026-and-how-senior-candidates-actually-answer-them/) — Side-by-side comparison of junior versus senior answers to the same questions

## References

- [Machine Learning Interview Questions: Complete 2026 Guide — PracHub](https://prachub.com/resources/machine-learning-interview-questions-guide-2026) — Source for today's practice problem and its example-answer structure
- [AI/ML Interview: Model Evaluation Metrics — techinterview](https://www.techinterview.org/post/3233474426/ai-ml-interview-model-evaluation-metrics-precision-recall-f1-auc-roc-confusion-matrix-cross-validation/) — Basis for the PR-AUC vs. ROC-AUC section
- [Machine Learning Interview Questions (2026) — LastRoundAI](https://lastroundai.com/interview-questions/machine-learning) — Basis for the cross-entropy vs. MSE section
- [Machine Learning Interview Questions and Answers — GeeksforGeeks](https://www.geeksforgeeks.org/machine-learning/machine-learning-interview-questions/) — Basis for the bagging vs. boosting section
- [Linear & Logistic Regression Interview Questions — StackScholar](https://stackscholar.com/ai-ml-engineer-interview/questions/regression-and-regularization-interview) — Basis for the multicollinearity section
