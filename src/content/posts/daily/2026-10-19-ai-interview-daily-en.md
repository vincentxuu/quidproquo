---
title: "AI Engineer Interview Daily — 2026-10-19: ML Fundamentals"
date: 2026-10-19
category: daily
type: digest
tags: [ai-engineer-interview, daily, machine-learning]
lang: en
description: "Monday's slot is ML Fundamentals: a real Amazon ML Engineer interview question anchors today's practice — handling class imbalance while explaining how L1 and L2 regularization actually work at the optimization level."
tldr: "Today's core concepts: the bias-variance trade-off, the gradient-level intuition behind L1 vs. L2 regularization, how to pick between batch/mini-batch/SGD, and an easy-to-miss evaluation trap — repeatedly tuning hyperparameters against your validation score is its own form of data leakage. The practice question comes straight from an Amazon ML Engineer onsite: how do you handle class imbalance, and what's actually happening mathematically when you apply L1 vs. L2 regularization. The point isn't reciting formulas — it's keeping data-level, model-level, and evaluation-level fixes clearly separated."
series:
  name: "AI Engineer Interview Daily"
  order: 61
---

> 🌏 [中文版](/posts/daily/2026-10-19-ai-interview-daily)

## Today's Focus

Monday is ML Fundamentals day — loss functions, regularization, optimization, evaluation metrics, bias-variance. These show up in almost every ML/AI Engineer interview because they're the foundation everything else sits on. Interviewers rarely want a textbook definition; they want to see you chain these concepts into a decision path: what went wrong with the data, how the model should respond, which metric actually tells you if it worked. This is classic phone-screen territory, and the most common way to lose points is reciting definitions without ever connecting them back to data or evaluation.

## Core Concepts

### The bias-variance trade-off

A model that's too simple — too few parameters — has high bias and low variance: underfitting. A model that's too complex has low bias and high variance: overfitting. In an interview, point to concrete signals: training and validation error both high and close together usually means high bias; training error very low but validation error noticeably higher usually means high variance. Then name the fix that matches — add features or model capacity for high bias; add regularization, more data, or ensembling for high variance.

### L1 vs. L2 regularization

L1 (Lasso) adds a penalty on the absolute value of each weight. Its gradient is constant near zero, which pushes unimportant weights all the way to zero — effectively automatic feature selection — but that non-differentiability at zero means training needs subgradient or proximal-gradient methods. L2 (Ridge) penalizes the squared weight; its gradient scales with the weight's magnitude, so it shrinks every weight toward zero without ever hitting exactly zero, has a closed-form solution, and is more numerically stable, but it never prunes features. This pair gets dressed up as "the data's imbalanced and overfitting badly, what do you do" more often than it gets asked directly — be ready to connect the regularization choice back to the actual data situation.

### Choosing a gradient descent variant

Batch gradient descent computes the gradient over the full dataset every step — accurate direction, expensive step. Stochastic gradient descent (SGD) uses one sample per update — fast, but the gradient is noisy and the path oscillates. Mini-batch sits in between and is the industry default, because batch size is really a knob trading off gradient-estimate variance against per-step compute cost. Interviewers often push further: too small a batch and convergence gets shaky; too large and you lose the implicit regularization that SGD's noise provides by helping the optimizer escape bad local minima.

### The leakage trap hiding inside evaluation

One detail that's easy to miss: repeatedly tuning hyperparameters or picking models based on validation-set scores is itself a form of information leakage, just a subtler version of the same problem as test-set contamination. The fix is nested cross-validation, or a strict three-way split — train, validation, test — where the test set gets touched exactly once, at the very end. "How do you make sure your model didn't overfit to your own evaluation process" is a question that, answered well, stands out.

## Today's Practice Question

### The Question

Your training data has a severe class imbalance — the minority class has far fewer samples than the majority class — and the model is clearly overfitting on it. Walk through how you'd handle the class imbalance, and explain from an optimization standpoint how L1 and L2 regularization each work.

**Source**: Amazon Machine Learning Engineer onsite (compiled from the IGotAnOffer interview guide)　**Difficulty**: Medium　**Round**: Onsite

### How to Break It Down

1. **Clarify first**: Ask about the actual imbalance ratio (1:10 versus 1:1000 calls for very different tactics), whether this is classification or regression, whether the minority samples are genuinely rare or possibly mislabeled, and what latency or false-positive cost constraints exist once this ships.
2. **Build a framework**: Split the fixes into three layers — data-level (resampling, synthetic samples), model-level (regularization, cost-sensitive loss), and evaluation-level (switching metrics). Stating the framework before filling in details signals that you're decomposing the problem systematically rather than listing things as they come to mind.
3. **Go deep on the technical core**: The real substance here is the gradient-level difference between L1 and L2. L1's constant-gradient penalty zeroes out unimportant weights — automatic feature selection — but on imbalanced data it risks zeroing out the few features that actually carry the minority class's signal. L2's magnitude-proportional penalty shrinks every weight without eliminating any, which tends to be more stable when samples are scarce. Make the distinction explicit: regularization fixes overfitting, not class imbalance itself — the two need separate treatment.
4. **Close it out**: Land on one sentence — "regularization stops the model from memorizing noise on the few samples it has, but the underlying distribution problem still needs data strategy and metric choice to actually fix it" — then add a line about production monitoring (data drift, periodic threshold recalibration).

### Sample Answer (say it like this in the interview)

> **Start with the data itself.** I'd first confirm the imbalance ratio and the business context — for something like a 1:1000 fraud-detection problem, I'd reach for class-weighted sampling or SMOTE-style synthetic minority samples before ever handing raw data to the model. I'd also check whether the minority samples might have label quality issues, since with so few of them, even one or two mislabeled points get amplified way out of proportion.
>
> **Then the model and the optimization objective.** If overfitting is still a problem after the data-level fixes, I'd add regularization to the loss. L1 penalizes the absolute value of each weight — its gradient has a constant direction that drives unimportant weights straight to zero, which is essentially automatic feature selection. But with scarce minority-class samples, that's risky: it might zero out exactly the handful of features that carry the minority signal. L2 penalizes the squared weight — the gradient scales with magnitude, so every weight shrinks together without hitting zero, which tends to hold up better when sample size is small and features are correlated. So I'd start with L2 or an Elastic Net blend and only add L1-style sparsity if the validation results justify it.
>
> **Finally, production.** For evaluation I wouldn't touch accuracy — on imbalanced data it can sit at 99% while missing the minority class entirely. I'd switch to precision/recall and PR-AUC instead. Once it's live, I'd keep monitoring for data drift, since class ratios in production tend to shift over time, which means the classification threshold needs periodic recalibration too.

### Self-Check

Use this table to catch anything your answer might have skipped:

| Check | Covered? |
|---------|---------|
| Asked about the imbalance ratio and business context up front | |
| Kept data-level, model-level, and evaluation-level fixes clearly separate | |
| Explained the gradient-level difference between L1 sparsity and L2 shrinkage | |
| Pointed out that regularization fixes overfitting, not class imbalance itself | |
| Switched the evaluation metric to precision/recall/PR-AUC instead of accuracy | |
| Bonus: mentioned post-launch data-drift monitoring and threshold recalibration | |

## Further Reading

- [What Is Regularization? L1, L2, Dropout, and Early Stopping Explained — Unite.AI](https://www.unite.ai/what-is-regularization-l1-l2-dropout-and-early-stopping-explained/) — frames dropout and early stopping inside the same "fighting overfitting" picture as L1/L2, filling in what this article doesn't cover.
- [MLQuestions — GitHub](https://github.com/andrewekhalel/MLQuestions) — 69 Q&A-style questions spanning ML fundamentals, deep learning, CV, NLP, statistics, and coding; a good recurring practice bank.

## References

- [Amazon Machine Learning Engineer Interview (questions, process, prep) — IGotAnOffer](https://igotanoffer.com/blogs/tech/amazon-machine-learning-engineer-interview) — source of today's practice question.
- [Top Machine Learning Interview Questions and Answers — goodspace.ai](https://goodspace.ai/interview-questions/machine-learning) — explains XGBoost's second-order optimization (gradient + Hessian) and built-in regularization, the advanced extension referenced in Core Concepts.
- [What Is Regularization? L1, L2, Dropout, and Early Stopping Explained — Unite.AI](https://www.unite.ai/what-is-regularization-l1-l2-dropout-and-early-stopping-explained/) — backs the "L1 vs. L2 regularization" section.
- [MLQuestions — GitHub](https://github.com/andrewekhalel/MLQuestions) — backs the "leakage trap hiding inside evaluation" section.
