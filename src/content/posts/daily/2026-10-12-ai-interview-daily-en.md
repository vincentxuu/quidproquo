---
title: "AI Engineer Interview Daily — 2026-10-12: ML Fundamentals"
date: 2026-10-12
category: daily
type: digest
tags: [ai-engineer-interview, daily, machine-learning]
lang: en
description: "Monday's rotation is ML Fundamentals — how to diagnose the bias-variance tradeoff from the train/validation gap, why L1 and L2 regularization behave so differently (one pushes weights to exactly zero, the other doesn't), how to pick the right cross-validation strategy (StratifiedKFold, TimeSeriesSplit, Nested CV) — plus a classic question that rotates through Amazon, Meta, and Google interview loops: your model has a high AUC-ROC but low precision, what does that mean and what do you do about it."
tldr: "Today's ML Fundamentals rotation covers four core concepts: diagnosing the bias-variance tradeoff from the size of the train/validation gap rather than reciting definitions; why L1 regularization's constant gradient pushes weights to exactly zero while L2's shrinking gradient only approaches it; how cross-validation strategy has to change with the data (StratifiedKFold for classification, TimeSeriesSplit for time series, Nested CV when you're tuning hyperparameters and estimating performance at the same time); and why AUC-ROC and PR-AUC can tell completely different stories under class imbalance. The practice question is a classic that recurs across Amazon, Meta, and Google interview loops: a model's AUC-ROC is high but precision is low — what's going on, and what do you do about it — and the breakdown threads 'what to suspect first' through to 'why you switch from the ROC curve to the precision-recall curve' into one complete reasoning chain."
series:
  name: "AI Engineer Interview Daily"
  order: 54
---

> 🌏 [中文版](/posts/daily/2026-10-12-ai-interview-daily)

## Today's Topic

Monday's rotation is ML Fundamentals, and today's four concepts circle around one thread: the same model can look completely different depending on which angle you examine it from. Bias-variance tradeoff, regularization, cross-validation, and evaluation metrics are all terms every candidate can define — but what interviewers are actually testing is whether you can say, for a concrete scenario, *why* a given metric is lying to you here, or *why* a given validation scheme is leaking future information here. Today's practice question is deliberately chosen to pull several of these threads together at once.

## Core Concepts Cheat Sheet

### Bias-Variance Tradeoff: read it off the train/validation gap, don't just recite the definition

Bias is the error from a model's assumptions being too simple (fitting a linear model to clearly nonlinear data); variance is the error from a model being too sensitive to its training data (a different training sample produces a noticeably different model). What actually has discriminating power in an interview isn't stating the definitions — it's reading the diagnosis off the train/validation score gap: both scores low means underfitting (high bias); a low train score with a validation score noticeably higher means overfitting (high variance). The prescriptions have to be kept separate too — too much bias calls for more model capacity (more features, deeper trees, a more expressive model family); too much variance calls for regularization, more data, or reducing model complexity. Blurring the two together is exactly what triggers the follow-up: "okay, which specific parameter would you actually change?"

### L1 vs. L2 Regularization: a constant gradient vs. a shrinking one

Both add a penalty term to the loss, but the shape of the penalty changes the behavior completely. L2 (Ridge) penalizes the square of each weight; its gradient with respect to a weight is proportional to the weight's size, so as the weight shrinks, the force pulling it toward zero shrinks too — L2 squeezes weights to be small but almost never exactly zero. L1 (Lasso) penalizes the absolute value of each weight; its gradient is a constant, independent of the weight's current size, so L1 keeps applying the same pull toward zero no matter how small the weight already is — until it actually lands on zero. That's why L1 produces sparse solutions and effectively performs automatic feature selection, while L2 doesn't. Which one to pick depends on the situation: suspect many features are useless and want automatic pruning → L1; features are highly correlated and you want stable coefficient estimates → L2.

### Cross-Validation strategy: match it to the data, don't default to plain k-fold

There's almost no good reason to use plain KFold on a classification problem — under class imbalance, a random fold can end up with zero minority-class samples, so StratifiedKFold (keeping each fold's class ratio matched to the full dataset) should be the default instead. Plain k-fold on time-series data is an even more direct way to get burned: a random split mixes future data into training, the model effectively peeks at the answer, the CV score looks unrealistically good, and the model collapses in production. The right approach is TimeSeriesSplit's walk-forward validation — the training window only ever expands forward and never includes data from after the test window — and if there's a known lag between when a feature is observed and when the label is known, you add a gap between train and test to prevent that leakage. Another trap interviewers like to catch: if the same CV folds are used both to search hyperparameters and to report final performance, the score is systematically optimistic, because you've implicitly picked the hyperparameters that happen to do best on exactly those folds. The fix is nested cross-validation — an outer k-fold loop estimates generalization performance, an inner k-fold loop searches hyperparameters, and the two are kept fully separate.

### AUC-ROC vs. PR-AUC: they tell different stories under imbalance

AUC-ROC measures, across every possible threshold, how well the model ranks positive examples ahead of negative ones — and it's insensitive to the class ratio, meaning AUC-ROC can stay high even when positives are only 1% of the data, because it's measuring ranking, not counts. Precision, on the other hand, measures "of everything I flagged as positive, how many actually were" — and when positives are rare to begin with, even a low false-positive *rate* can translate into more false positives than true positives in absolute terms, which drags precision down. That's exactly why "high AUC-ROC but low precision" is the normal outcome on imbalanced data, not an anomaly — the right move is to switch from the ROC curve to the precision-recall curve, because the PR curve is the one that actually reflects the real trade-off under imbalance.

## Today's Practice Question

### The Question

Your model has a high AUC-ROC but low precision. What's going on, and what would you do about it?

**Source**: Compiled in PracHub's "Machine Learning Interview Questions: Complete 2026 Guide" company-tagged question bank, flagged as a high-frequency classic that recurs across Amazon, Meta, and Google interview loops　**Difficulty**: Intermediate　**Round**: Technical screen / onsite fundamentals round

### How to Break It Down

1. **Clarify first**: Confirm it's a classification problem, roughly what the positive/negative ratio looks like, whether the current decision threshold is the default 0.5 or something already tuned, and whether the business cares more about precision or recall here.
2. **Build a framework**: Define both metrics clearly — AUC-ROC integrates ranking ability across every threshold and ignores class ratio; precision is computed conditional on "already decided positive," which ties it directly to how rare positives are in absolute terms. One measures ranking, the other measures an absolute count under a chosen threshold — that's the root of the gap.
3. **Go deep on the core**: The key trade-off is that under imbalance, even a small false-positive *rate*, multiplied against a large negative base, can produce an absolute number of false positives that exceeds true positives — that's a separate question from whether the model ranks well. The real diagnostic move is switching to the precision-recall curve instead of continuing to stare at the ROC curve.
4. **Close strong**: Give an actionable fix — first check whether the issue is simply an ill-chosen threshold, and try raising it to see how precision and recall trade off; if adjusting the threshold alone can't reach an acceptable balance, consider class weighting or a reweighted loss at training time; and finally, loop back to the business to confirm whether this specific use case should prioritize precision or recall before deciding which direction to push.

### Sample Answer (What You'd Actually Say)

> When AUC-ROC is high but precision is low, my first reaction isn't "the model is broken" — it's to check whether this is a class-imbalance story. **Start with why the two diverge**: AUC-ROC integrates ranking ability across every threshold and completely ignores the positive/negative ratio, so even if positives are only 1% of the data, AUC-ROC stays high as long as the model roughly ranks positives ahead of negatives. Precision, though, asks "of what I flagged positive, how much was actually positive" — and when positives are rare to begin with, even a low false-positive rate can translate into more false positives than true positives in absolute terms, which pulls precision down. That's not the model ranking badly — it's two metrics answering two different questions.
>
> **Then, how I'd diagnose it**: I'd drop the ROC curve and plot a precision-recall curve instead, because PR curves are the ones that actually show the real trade-off under imbalance. Then I'd check whether the decision threshold is still sitting at the default 0.5 — raising the threshold usually improves precision but costs recall, and that trade-off needs to be laid out explicitly rather than tuned by feel.
>
> **Finally, how I'd turn it into action**: if adjusting the threshold alone can't find an acceptable balance, I'd look at class weighting or a loss function that's more robust to imbalance at training time. But before touching the model, I'd go back to the business and confirm whether this specific scenario should prioritize precision (say, the cost of wrongly flagging a normal user is high) or recall (the cost of missing a positive is high) — that call should come from the business metric, not from an assumption I made on my own.

### Self-Check List

Use this table to check whether your answer covered the key points:

| Check item | Covered? |
|---------|---------|
| Explained that AUC-ROC measures ranking and is insensitive to class ratio | |
| Explained that precision gets dragged down by absolute counts under imbalance | |
| Mentioned switching to the precision-recall curve instead of continuing to read the ROC curve | |
| Mentioned checking/adjusting the decision threshold, and named the trade-off against recall | |
| Gave a next step for when threshold tuning alone isn't enough (class weighting / reweighted loss) | |
| Bonus: handed the final call back to a business metric (which scenario should prioritize which metric) instead of deciding unilaterally | |

## Further Reading

- [Cross-Validation Strategies: K-Fold, Time Series, and Nested CV — techinterview.org](https://www.techinterview.org/post/3233460018/cross-validation-strategies-k-fold-time-series-and-nested-cv/) — Organizes StratifiedKFold, TimeSeriesSplit, Nested CV, and common data-leakage traps into one decision table, with full sklearn code.
- [Top 20 Regularization Interview Questions and Answers — Towards AI](https://towardsai.com/p/machine-learning/top-20-regularization-interview-questions-and-answers) — 20 follow-up questions on L1/L2 regularization, good for drilling today's "constant gradient vs. shrinking gradient" explanation until it's automatic.
- [25 Machine Learning Interview Questions for 2026 — InterviewPal](https://blog.interviewpal.com/25-machine-learning-interview-questions-for-2026-and-how-senior-candidates-actually-answer-them/) — A mindmap separating fundamentals, evaluation, and production into three distinct layers, useful for checking whether you've skipped a layer.

## References

- [Machine Learning Interview Questions: Complete 2026 Guide — PracHub](https://prachub.com/resources/machine-learning-interview-questions-guide-2026) — Source of today's practice question ("high AUC-ROC but low precision"), including the comparison of Amazon/Meta/Google interview-loop emphasis and a worked sample answer.
- [Cross-Validation Strategies: K-Fold, Time Series, and Nested CV — techinterview.org](https://www.techinterview.org/post/3233460018/cross-validation-strategies-k-fold-time-series-and-nested-cv/) — Source for the "Cross-Validation strategy" concept section, including the StratifiedKFold rule, the TimeSeriesSplit walk-forward example, and the nested-CV bias explanation.
- [Top 20 Regularization Interview Questions and Answers — Towards AI](https://towardsai.com/p/machine-learning/top-20-regularization-interview-questions-and-answers) — Supporting source for the "L1 vs. L2 Regularization" concept section.
- [25 Machine Learning Interview Questions for 2026 — InterviewPal](https://blog.interviewpal.com/25-machine-learning-interview-questions-for-2026-and-how-senior-candidates-actually-answer-them/) — Supporting source for the "Bias-Variance Tradeoff" and "AUC-ROC vs. PR-AUC" concept sections, confirming how often these question types appear in 2026 interview loops.
