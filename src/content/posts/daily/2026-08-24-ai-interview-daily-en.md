---
title: "AI Engineer Interview Daily — 2026-08-24: ML Fundamentals"
date: 2026-08-24
category: daily
type: digest
tags: [ai-engineer-interview, daily, machine-learning]
lang: en
description: "Today's ML fundamentals drill: diagnosing bias-variance gaps, geometric intuition behind L1/L2 regularization, choosing loss functions that match business objectives, and why AdamW differs from Adam with L2."
tldr: "ML fundamentals interviews don't test whether you can recite definitions — they test whether you can walk through a structured diagnostic when handed a train/val accuracy gap. Today covers four high-frequency topics: bias-variance decomposition and learning curve interpretation, geometric intuition for L1/L2 regularization and when to pick which, aligning loss functions with business objectives instead of accepting defaults, and why AdamW decouples weight decay from L2 regularization."
series:
  name: "AI Engineer Interview Daily"
  order: 5
---

> 🌏 [中文版](/posts/daily/2026-08-24-ai-interview-daily)

## Today's Topic

ML Fundamentals is the bedrock of every ML interview loop. Whether the later rounds cover system design or LLMs, interviewers first confirm you have solid intuition around bias-variance, regularization, and loss functions. A junior candidate can recite definitions; a senior candidate, given a concrete train/val accuracy gap, can immediately outline the diagnostic steps and which knobs to turn next.

Today's goal isn't just reviewing definitions — it's practicing the full "diagnose, prescribe, verify" pathway, which is exactly the format Google, Meta, and Amazon favor in phone screens and onsite technical rounds.

## Core Concepts Quick Reference

### Bias-Variance Decomposition

Expected test error decomposes into `Bias² + Variance + Irreducible Noise`. High bias means the model is too simple — both training and validation errors are high and close together. High variance means the model is too complex — training error is low but validation error is high, with a large gap between them. In an interview, saying "this is overfitting" isn't enough. You need to explain that you'd use learning curves (training/validation error plotted against data size or training epochs) to confirm, rather than jumping to conclusions.

### Geometric Intuition for L1 vs L2 Regularization

L2 (ridge) penalty has circular contours that smoothly shrink weights toward zero but rarely hit exactly zero — use it when you believe most features contribute a little and features are correlated. L1 (lasso) penalty has diamond-shaped contours whose corners sit on the coordinate axes, so the optimal solution often lands exactly at zero for some weights — that's where automatic feature selection comes from. The trade-off: with highly correlated feature groups, L1's selection is unstable (a different sample split can flip which feature survives). Elastic net combines both to get sparsity without the instability.

### Loss Functions Should Align with Business Objectives, Not Defaults

Most people default to cross-entropy (classification) or MSE (regression), but that's just a starting point. For long-tailed targets (e.g., revenue prediction), use MAE or Huber — MSE's squared penalty on outliers forces the model to spend its entire gradient budget on a few extreme values. For severe class imbalance (e.g., 1% positive in fraud detection), consider focal loss — with standard cross-entropy at 99:1, the model can hit 99% accuracy by always predicting the negative class. The interview bonus point: "First clarify what business objective the loss should optimize, then choose the function" — not treating loss as a mindless default.

### Why AdamW Differs from Adam + L2

This is a detail only senior candidates know. Traditional L2 regularization adds `lambda * w` to the gradient, but Adam rescales gradients per-parameter using second-moment estimates (RMS) — so the L2 penalty also gets diluted by that rescaling. Parameters with large gradients end up with weaker penalties, which is the opposite of regularization's goal of suppressing large weights. AdamW decouples weight decay from the gradient update, applying the same decay factor to every parameter regardless of gradient magnitude. This is why virtually all transformer training now uses `torch.optim.AdamW` instead of `Adam(weight_decay=...)` — the latter's regularization behavior is actually wrong.

## Today's Practice Problem

### Problem

"Your model achieves 92% accuracy on the training set but only 78% on the validation set. Walk me through your diagnostic process."

**Source**: Meta ML Engineer interview-style question (compiled by AI Architect Manoranjan Rajguru) | **Difficulty**: Medium | **Stage**: phone screen / onsite technical

### Breakdown

1. **Clarify the problem first**: Is this classification or regression? How was the train/validation split done — random, time-based, or group-based (could the same user's data appear on both sides)? How large is the dataset?

2. **Establish a framework**: First rule out "false variance" — data leakage, incorrect splitting (e.g., random splits on time-series data leaking future information), or train/validation distributions that are fundamentally different. Only after ruling these out do you move into formal bias-variance decomposition.

3. **Dive into the core**: 92% vs 78% is a clear gap — the first intuition is high variance (overfitting). Verify with learning curves: if training error stays low while validation error rises with more training epochs, that's the classic overfitting signal. Prescribe in order — first adjust "capacity" (the quickest knob: reduce model complexity, reduce features), then add explicit regularization (L2, dropout, early stopping), and only then consider collecting more data (highest cost but most reliable).

4. **Wrap up**: Emphasize that each step requires experimental verification of the hypothesis rather than formula application. Add: "If the model is a deep learning model past the interpolation threshold, a larger model might actually decrease error again (double descent), so 'more complexity always means overfitting' isn't a universal rule." This signals to the interviewer that you're up to date on recent theoretical developments.

### Sample Answer (how to articulate this in an interview)

> Seeing this gap, I wouldn't immediately say "it's overfitting, add regularization." First I'd check the splitting methodology — if it's time-series data with random splits, or if the same user's samples appear in both train and validation, this kind of false variance is common and needs to be ruled out first.
>
> After that, I'd plot learning curves: does training error keep dropping as data increases, and does validation error show a decrease-then-increase pattern over training epochs? If I confirm genuine high variance, my prescription order is: first reduce model complexity (fewer layers, fewer features), then add explicit regularization — L2 for linear models, dropout 0.3 to 0.5 for neural nets, plus early stopping as a near-zero-cost safety net. Only if the gap persists after all of that would I consider collecting more data — most reliable but highest cost.
>
> At each step, I'd re-run the learning curves to verify my hypothesis rather than just tuning parameters and shipping. If the model is a large neural network, I'd also watch for whether it's past the interpolation threshold — overparameterized models sometimes see error decrease again when scaled up further, which means the "too complex" intuition might be wrong.

### Self-Check Checklist

Use this table to verify your answer covers the key points:

| Check Item | Mentioned? |
|---------|---------|
| First rule out data leakage / incorrect split methodology | |
| Diagnose using learning curves, not intuition | |
| Clearly distinguish bias remedies (add features, relax regularization) from variance remedies (regularization, more data) | |
| Prescription has a priority order (capacity, explicit regularization, more data) | |
| Each hypothesis includes how to verify it | |
| Bonus: double descent / overparameterization exceptions | |

## Further Reading

- [LastRound AI — Machine Learning Engineer Interview Guide 2026](https://lastroundai.com/blog/ai-ml-engineer-interview-guide) — Detailed breakdown of how Google, Meta, Waymo, and Two Sigma differ in their bias-variance and regularization question depth
- [techinterview.org — Bias-Variance Tradeoff: Underfitting, Overfitting, and How to Fix Both](https://www.techinterview.org/post/3233459969/bias-variance-tradeoff/) — Step-by-step learning curve interpretation with a fix comparison table for high bias vs high variance
- [CalibreOS — Loss Functions: Choosing the Right Objective for Every ML Problem](https://www.calibreos.com/learn/ml-loss-functions) — Selection framework covering MSE/MAE/Huber/focal loss, plus details on AdamW vs Adam+L2 differences

## References

- [The Bias-Variance Tradeoff: What Senior ML Engineers Actually Know — Manoranjan Rajguru](https://www.linkedin.com/posts/manoranjan-rajguru_machinelearning-biasvariance-mlinterview-activity-7417073441456959488-sfAM) — Source of today's practice problem: Meta interview-style 92% vs 78% diagnostic question
- [techinterview.org — Bias-Variance Tradeoff](https://www.techinterview.org/post/3233459969/bias-variance-tradeoff/) — Basis for the bias-variance decomposition and diagnostic table in Core Concepts
- [prachub.com — List regularization methods and trade-offs (Google Interview Question)](https://prachub.com/interview-questions/list-regularization-methods-and-trade-offs) — Basis for L1/L2 selection logic and regularization hierarchy (capacity, explicit, implicit)
- [CalibreOS — Loss Functions](https://www.calibreos.com/learn/ml-loss-functions) — Technical details for the loss function alignment section and AdamW vs Adam+L2 differences
