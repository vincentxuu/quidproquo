---
title: "AI Engineer Interview Daily — 2026-09-07: ML Fundamentals"
date: 2026-09-07
category: daily
type: digest
tags: [ai-engineer-interview, daily, machine-learning]
lang: en
description: "Today's ML fundamentals drill goes production-diagnostic: reading learning curves for bias vs. variance, why a 0.85 CV score can turn into 0.70 in production, the right order to attack class imbalance, and why 0.5 is never the default decision threshold."
tldr: "This round of ML Fundamentals skips the textbook formulas and drills the diagnostics that separate senior candidates from junior ones: reading the train/val gap on a learning curve to decide whether to add capacity or regularize, the three usual suspects when CV and production scores diverge (StratifiedKFold, GroupKFold, TimeSeriesSplit), the cost-ordered playbook for class imbalance — reweight before you reach for SMOTE — and why picking a decision threshold from FP/FN cost is a separate problem from probability calibration."
series:
  name: "AI Engineer Interview Daily"
  order: 19
---

> 🌏 [中文版](/posts/daily/2026-09-07-ai-interview-daily)

## Today's Topic

This is round three of ML Fundamentals. The first two rounds covered the textbook material — the bias-variance decomposition, the geometric intuition behind L1/L2, cross-entropy versus MSE, PR-AUC versus ROC-AUC. Today takes a different angle: the question interviewers actually reach for is "your offline metric looked great, production is on fire, walk me through how you'd diagnose it." Four topics today: reading a learning curve to decide whether you have a bias or a variance problem, the three usual suspects when a CV score and a production score disagree, the cost-ordered playbook for handling class imbalance, and why a decision threshold and probability calibration are two separate questions. This is exactly the kind of material that shows up in onsite case studies, and it's where senior candidates pull ahead of junior ones.

## Core Concepts Quick Reference

### Learning Curves — The Right Way to Diagnose Bias vs. Variance

Rather than plugging numbers into bias² + variance, interviewers want to see you diagnose it from data: plot training and validation metrics as a function of training set size. If training error is low but validation error stays far above it, and that gap doesn't shrink as you add more data, that's high variance — the model is memorizing noise in the training sample, and the fix is more data, stronger regularization, or less capacity. If training error itself is high and both curves converge early into a low plateau, that's high bias — the model doesn't have enough expressive power, and the fix is more features or more capacity, with regularization relaxed. A classic trap question: "training accuracy is 99%, validation is 97% — is that overfitting?" The right answer is that the gap alone isn't the problem; what matters is whether the validation score itself is good enough for the task and stable across folds and time slices. Shrinking the gap by crippling the model helps nobody.

### Stratified / Group K-Fold — A Pretty CV Score Doesn't Mean It'll Hold in Production

A favorite interviewer follow-up: "your CV score is 0.85, why is production only 0.70?" The three usual suspects, in order of how often they show up: under class imbalance, plain KFold can hand one fold almost no positives by chance, distorting the metric — use StratifiedKFold to preserve the class ratio in every fold. If the data has repeated entities — a user_id or session_id — the same entity can land in both the train and validation fold, so the model partially memorizes "who this person is" instead of learning something generalizable — use GroupKFold so each entity stays in one fold only. If the data has temporal structure but you're splitting randomly, the model effectively gets to peek at the future's distribution — use TimeSeriesSplit, or split by date so training strictly precedes validation. Volunteering "if there's a user_id column, I'd use GroupKFold" before the interviewer even asks is a much stronger signal than reciting the definition of k-fold cross-validation.

### Class Imbalance — Reweight Before You Reach for SMOTE

Handling class imbalance follows a clear cost-ordered sequence: try the cheapest fix first. Layer one: check whether imbalance is even a problem — if the classes are separable and you're evaluating with PR-AUC instead of accuracy, the raw distribution might already be fine. Layer two: reweight — scikit-learn's `class_weight='balanced'` or XGBoost's `scale_pos_weight` makes the loss penalize minority-class mistakes harder without touching the data at all, and this is usually the best effort-to-value trade. Layer three, resampling, comes next: undersampling the majority class (viable when you have millions of negatives), oversampling the minority class, or SMOTE, which synthesizes new minority points by interpolating between neighbors — but be skeptical of SMOTE on high-dimensional or categorical-heavy data, where the interpolated points are often meaningless (a synthetic user that's half one zip code, half another), and multiple empirical studies show reweighting matches or beats SMOTE on gradient-boosted trees anyway. Layer four is reframing the problem — with positives below roughly 0.5%, anomaly detection or a two-stage funnel may fit the operational reality better than a single classifier. Whichever layer you use, resampling must happen inside each CV fold, never before the split — resampling before splitting leaks duplicated or synthetic positives into validation and inflates every metric.

### Decision Threshold and Probability Calibration — 0.5 Is Never the Default Answer

A 0.5 threshold is a library default, not a decision. The right threshold comes from cost: if a false negative costs C_fn and a false positive costs C_fp, the expected-cost-minimizing threshold on calibrated probabilities is C_fp / (C_fp + C_fn) — if missing a fraud case costs 50x a false alarm, the right threshold might sit around 2%, nowhere near 0.5. When costs are hard to pin down, sweep the threshold on the validation set (never the test set) and pick the operating point off the precision-recall curve that satisfies a business constraint, like "maximize recall subject to precision at or above 80%." Threshold selection and calibration are two separate questions: calibration asks whether a model's "70% probability" actually happens about 70% of the time, and rank-based metrics like ROC-AUC are completely blind to it — but the moment you do expected-value math (probability times dollar amount, probability times customer lifetime value), calibration becomes load-bearing. Reweighting, resampling, and shallow trees all distort calibration, so diagnose it with a reliability diagram and Brier score, and fix it with Platt scaling (small data, sigmoid-shaped distortion) or isotonic regression (more data, arbitrary monotonic distortion) — fit on a held-out calibration set, never on training data.

## Today's Practice Problem

### Problem

Your credit card fraud model scores AUC 0.85 on 5-fold cross-validation (PR-AUC cross-checks the same story). A week after launch, the fraud team reports production AUC/PR-AUC has dropped to 0.70, with no obvious distribution drift. Walk through how you'd diagnose that gap and what's likely causing it.

**Source**: Adapted from a common interviewer follow-up cited in Goodspace.ai's "Machine Learning Interview Questions and Answers (2026)" — "your CV score is 0.85 but production is 0.70, why?" | **Difficulty**: Medium | **Stage**: onsite technical / cross-functional review

### Breakdown

1. **Clarify the problem first**: Is preprocessing (scalers, any resampling) fit before or after the train/validation split? Does the data have a user_id or session_id column that could let the same entity land in multiple folds? Does the data have temporal structure? Is the current CV plain KFold or StratifiedKFold?

2. **Establish a framework**: Sort the possible causes into three buckets, cheapest to rule out first — preprocessing leakage (fitting a scaler or SMOTE before the split), entity leakage (the same user appearing in both train and validation folds), and temporal leakage (random splitting instead of chronological, letting the model peek at the future's distribution).

3. **Dive into the core**: The key trade-off is diagnostic ordering — assume the evaluation protocol is broken before you assume the model's generalization is actually weak, because checking the protocol is cheap and it's the far more common culprit; only after ruling that out does it make sense to suspect the model itself, since that implies rebuilding features or redesigning the model. Concretely: swap the current CV for GroupKFold (grouped by user_id) and TimeSeriesSplit (chronological order) and rerun it. If the score immediately drops from 0.85 to near 0.70, that confirms it's the evaluation protocol, not the model's actual capability.

4. **Wrap up**: Emphasize that the production score is the only honest score, and propose making out-of-time test sets plus GroupKFold/StratifiedKFold CV a standing checklist item for every model launch going forward, instead of firefighting this gap case by case.

### Sample Answer (how to say this out loud in an interview)

> If CV is 0.85 but production is only 0.70, with no obvious drift, my first suspicion isn't the model — it's the evaluation protocol, because that's both the most common cause and the cheapest to rule out. I'd ask three things: is preprocessing like a scaler or SMOTE fit before or after the split? Is there a user_id or session_id column that could let the same entity end up in both the train and validation fold? Does the data have temporal structure, and are we splitting randomly instead of by time?
>
> Those three questions map to preprocessing leakage, entity leakage, and temporal leakage, and they're fast to check — I'd swap KFold for GroupKFold, grouped by user_id, and TimeSeriesSplit, ordered chronologically, and rerun CV. If the score immediately drops from 0.85 to near 0.70, that confirms the problem is the evaluation protocol, not the model itself — and the fix isn't retuning hyperparameters or reaching for a bigger model, it's moving `fit_transform` to after the split and switching CV to the correct grouped or chronological scheme.
>
> If CV still holds at around 0.85 after fixing the splitting scheme, that's when I'd start suspecting the model itself — and even then, I'd first check for a leakage feature, something like a label-derived field that's only available at application time, before jumping to add model capacity.

### Self-Check Checklist

Use this table to verify your answer covers the key points:

| Check Item | Mentioned? |
|---------|---------|
| Suspected the evaluation protocol before assuming the model lacks capability | |
| Mentioned preprocessing (scaler/SMOTE) must be fit after the split, not before | |
| Mentioned GroupKFold to prevent the same entity (user/session) leaking across folds | |
| Mentioned TimeSeriesSplit/out-of-time evaluation for temporal data instead of random splits | |
| Proposed a concrete verification method (rerun CV with the corrected split), not just a list of possible causes | |
| Bonus: mentioned a leakage feature (label-derived field) as another possibility beyond model capability | |

## Further Reading

- [Machine Learning Interview Questions and Answers (2026) — Goodspace](https://goodspace.ai/interview-questions/machine-learning) — Primary source for today's four concepts, covering 60 questions from basics to advanced, each with a runnable code snippet
- [Top 60+ Machine Learning Interview Questions For 2026 — igmGuru](https://www.igmguru.com/blog/machine-learning-interview-questions) — Rounds out the class imbalance section with SMOTE, class weighting, and threshold adjustment
- [Top Machine Learning Interview Questions and Answers — Simplilearn](https://www.simplilearn.com/tutorials/machine-learning-tutorial/machine-learning-interview-questions) — Includes a runnable pandas snippet for detecting class imbalance in a dataset

## References

- [Machine Learning Interview Questions and Answers (2026) — Goodspace](https://goodspace.ai/interview-questions/machine-learning) — Basis for the learning curves, Stratified/Group K-Fold, class imbalance, and threshold/calibration sections, and the source for today's practice problem
- [Top 60+ Machine Learning Interview Questions For 2026 — igmGuru](https://www.igmguru.com/blog/machine-learning-interview-questions) — Basis for the SMOTE/class-weighting/threshold ordering in the class imbalance section
- [Top Machine Learning Interview Questions and Answers — Simplilearn](https://www.simplilearn.com/tutorials/machine-learning-tutorial/machine-learning-interview-questions) — Basis for the class-imbalance-detection and cross-validation discussion in the Stratified/Group K-Fold section
