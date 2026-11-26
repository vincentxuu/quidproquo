---
title: "AI Engineer Interview Drill — 2026-11-23: ML Fundamentals"
date: 2026-11-23
category: daily
type: digest
tags: [ai-engineer-interview, daily, machine-learning]
lang: en
description: "Monday's slot is ML Fundamentals: today's practice question comes from a real take-home scenario — why a fraud model with AUC 0.848 produces wildly wrong loss forecasts once its probabilities get summed, and how reliability diagrams, ECE, and the Brier score decomposition separate 'ranks well' from 'probabilities you can trust.'"
tldr: "A high AUC only means a model ranks cases correctly — it says nothing about whether the probability numbers it outputs can be summed or plugged into an expected-loss calculation. Calibration is a separate property, checked with reliability diagrams and ECE. Common causes of miscalibration include tree models and SVMs pushing scores toward the extremes, deep networks being inherently overconfident, or class reweighting quietly shifting the probability base rate. The fix is Platt scaling or isotonic regression, but the calibrator must always be fit on data the model never trained on — otherwise the calibration itself becomes another leak."
series:
  name: "AI Engineer 面試日練"
  order: 96
---

> :globe: [中文版](/posts/daily/2026-11-23-ai-interview-daily)

## Today's Focus

Monday's fixed slot is ML Fundamentals. Today's topic is probability calibration — a concept that gets buried under the line "high AUC means a good model" far more often than it should. Calibration isn't about whether a model ranks cases correctly. It's about whether the probability number it outputs can be acted on directly: when a fraud model says 0.8, does that mean 80% of transactions scored that way are actually fraud, or is the model just confident? That distinction shows up constantly in "how would this model plug into a business decision" interview rounds, because plenty of candidates can recite "Platt scaling" and "isotonic regression" without being able to explain when calibration actually needs checking, or when it needs fixing.

## Core Concepts

### Calibration and discrimination are two different axes — AUC can't tell you about calibration

In one line: AUC asks whether positive cases score higher than negative ones; calibration asks whether the score itself equals the true probability. A model can put every positive case ahead of every negative case, hit AUC 1.0, and still label every positive 0.9 and every negative 0.1 — perfectly ranked, but nowhere near the truth. Any calibration method that applies a monotonic transform to the score — Platt scaling, isotonic regression — leaves the ranking, and therefore AUC, completely untouched, even though the trustworthiness of the probabilities changes a lot. Interviewers want to hear that you treat these as two independent axes, not "AUC is high, so calibration must be fine too."

### Different model families fail in different directions — it's not random noise

Bagged trees, boosted trees, and margin-based methods like SVMs tend to push probabilities toward the extremes — values near 0 or 1 are rare, and the middle gets squeezed into an S-shaped curve — because averaging votes across many base models washes out the chance of landing close to 0 or 1. Modern deep networks trained with cross-entropy go the other way: more capacity tends to make them systematically overconfident, so the softmax output runs high. Another source that gets overlooked is class reweighting or oversampling the minority class during training — this shifts the model's output base rate to match the training distribution, but the real-world event rate after deployment doesn't move, so the whole batch of probabilities comes out systematically too high or too low.

### Diagnose with reliability diagrams and ECE; quantify with the three-term Brier score decomposition

A reliability diagram (also called a calibration curve) bins predicted probabilities and plots each bin's average prediction against its observed positive rate — a calibrated model lands on the diagonal. ECE (Expected Calibration Error) weights each bin's gap by sample count into a single number — smaller is better. Going further, the Brier score decomposes into reliability (calibration error) minus resolution (how well the model separates easy from hard cases) plus uncertainty (the irreducible noise set by the base rate). That decomposition matters: a model with a very low Brier score, when the base rate is extreme (say, a 1% fraud rate), gets most of that low score for free from the uncertainty term — not because it's actually well calibrated. When an interviewer asks "is a Brier score of 0.009 impressive?", the answer starts with this decomposition.

### Fixes depend on sample size, and the calibrator must always be fit on data the model never saw

Platt scaling — fitting a one-dimensional logistic regression on the raw score — has only two parameters, so it's stable even with small samples, but it assumes the calibration curve is a symmetric S-shape, which doesn't hold for every model's bias pattern. Isotonic regression fits an arbitrary monotonic step function, which is more flexible, but overfits into a jagged, unstable curve when you have fewer than roughly a thousand samples. Both methods share one non-negotiable requirement: the calibrator has to be fit on data the model never trained on. Fit it on the training fold's predictions instead, and what you get back is a calibrator for the model's confidence on data it has already memorized — not its real probability on new data. That's a new leak dressed up as a fix.

```diagram
title: Three stages of probability calibration — three datasets that can't swap
desc: Training, calibration, and verification each need data the model hasn't seen; reusing an earlier stage's data at any point makes the result look better than it really is.
caption: Simplified: cross-validation and multiclass calibration details are omitted.
step: Train the base model on the train fold
step: Predict on the calibration fold the model never trained on, and fit Platt scaling or isotonic regression there; fitting directly on the train fold instead gives you a calibrator for the model's confidence on memorized data, not its real posterior probability
step: Draw the reliability diagram and compute ECE on a test fold neither of the earlier steps touched; verifying on the calibration fold instead makes ECE look great, but all it confirms is that the calibrator remembers what it just learned
---
<svg viewBox="0 0 800 220">
  <path class="dg-line" d="M240 56H280" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line" d="M500 56H540" marker-end="url(#arrow)" data-step="3"/>

  <path class="dg-line dg-line--warn dg-line--dashed" d="M390 88V140" marker-end="url(#arrow-warn)" data-step="2"/>
  <path class="dg-line dg-line--warn dg-line--dashed" d="M650 88V140" marker-end="url(#arrow-warn)" data-step="3"/>

  <g data-step="1">
    <rect class="dg-box" x="20" y="24" width="220" height="64" rx="6"/>
    <text class="dg-label" x="130" y="47" text-anchor="middle" dominant-baseline="central">Train base model</text>
    <text class="dg-sub" x="130" y="67" text-anchor="middle" dominant-baseline="central">train fold</text>
  </g>
  <g data-step="2">
    <rect class="dg-box" x="280" y="24" width="220" height="64" rx="6"/>
    <text class="dg-label" x="390" y="47" text-anchor="middle" dominant-baseline="central">Fit Calibrator</text>
    <text class="dg-sub" x="390" y="67" text-anchor="middle" dominant-baseline="central">calibration fold</text>
  </g>
  <g data-step="3">
    <rect class="dg-box" x="540" y="24" width="220" height="64" rx="6"/>
    <text class="dg-label" x="650" y="47" text-anchor="middle" dominant-baseline="central">Check Calibration</text>
    <text class="dg-sub" x="650" y="67" text-anchor="middle" dominant-baseline="central">test fold</text>
  </g>

  <g data-step="2">
    <rect class="dg-box dg-box--warn" x="280" y="140" width="220" height="64" rx="6"/>
    <text class="dg-label dg-text--warn" x="390" y="163" text-anchor="middle" dominant-baseline="central">Fit on train fold</text>
    <text class="dg-sub" x="390" y="183" text-anchor="middle" dominant-baseline="central">confidence, not truth</text>
  </g>
  <g data-step="3">
    <rect class="dg-box dg-box--warn" x="540" y="140" width="220" height="64" rx="6"/>
    <text class="dg-label dg-text--warn" x="650" y="163" text-anchor="middle" dominant-baseline="central">Same fold, reused</text>
    <text class="dg-sub" x="650" y="183" text-anchor="middle" dominant-baseline="central">result is an illusion</text>
  </g>
</svg>
```

## Today's Practice Question

### The question

Your fraud model ranks transactions well (AUC 0.848), but Finance wants to forecast next month's total fraud losses by summing up the model's predicted probabilities across all transactions. The model's average predicted probability on a recent test month was 0.313, while only 0.974% of transactions in that month were actually fraud. How do you explain this discrepancy to Finance, and how would you check a model's probabilities in general?

**Source**: adapted from Pallav Mahapatra's Interview Bank, a real interview question bank (Evaluation category, Q7)　**Difficulty**: Intermediate-advanced　**Round**: Onsite scenario / take-home

### How to break it down

1. **Clarify first**: Ask whether the model's training used class reweighting or oversampled the minority class — if it did, the output base rate was never going to match the real event rate, and that's the fastest, most common root cause to check. Also confirm whether Finance actually needs ranking (which transactions to flag for manual review) or summed totals (an expected-loss forecast) — the two uses have completely different sensitivity to calibration error.
2. **Build a framework**: Split the problem into two separate lines — is discrimination broken, or is calibration broken? AUC 0.848 already answers the first line; the second line is what this question is really testing.
3. **Go deep on the core**: Lay out a checkable diagnostic process — a reliability diagram to see which probability range is systematically off, ECE to quantify the gap, and the Brier score split into reliability, resolution, and uncertainty to rule out "this is just because the fraud rate is low" as the explanation. Then cover the fix: fit Platt scaling on a fold the model never trained on, confirm AUC is unchanged while the average prediction now tracks the real event rate, and do the final check on a third fold the calibrator never saw either.
4. **Close it out**: Land the answer on "here's whether Finance can safely sum these probabilities, or should only use them for ranking." Calibration isn't about making the model look more accurate — it's about telling the people downstream whether this number is safe to do arithmetic with.

### Sample answer (say this out loud in the interview)

> **I'd frame this as a calibration problem, not a ranking problem.** AUC 0.848 means the model's relative risk ranking is sound — transactions that are actually fraud do score higher. But what Finance wants is to sum probabilities into a dollar figure, and that use case demands calibration, not ranking. An average predicted probability of 0.313 against an actual rate of 0.974% means the model is systematically overestimating, which usually traces back to class reweighting or oversampling during training shifting the output base rate — while the real-world event rate on live data never moved.
>
> **For diagnosis, I'd draw a reliability diagram, compute ECE, and then look at the Brier score decomposition.** Using equal-frequency bins, I'd plot each bin's average prediction against its observed positive rate — if the whole curve sits above the diagonal, that's a global overestimation, not a local glitch. ECE turns that gap into a single trackable number. I'd also decompose the Brier score into reliability, resolution, and uncertainty — at a 1% base rate, even a model that's essentially guessing gets a deceptively good-looking Brier score because the uncertainty term is small by construction. So I wouldn't trust the total score alone; I'd confirm the low number actually comes from low calibration error, not from a low base rate doing the work.
>
> **For the fix, I'd fit Platt scaling on a fold the model never trained on**, since the sample size is usually under a thousand and isotonic regression would overfit into an unstable step function at that scale. After fitting, I'd confirm AUC is unchanged — it's a monotonic transform — while the average prediction now tracks 0.974%, and I'd run the final check on a third fold the calibrator never touched either, since checking on the same fold used to fit the calibrator just confirms it remembers what it was trained on. Finally, I'd tell Finance explicitly: the calibrated probabilities are safe to sum; the uncalibrated ones are only safe for ranking, not for computing a dollar figure.

### Self-check

Use this table to check whether your answer hit the key points:

| Check item | Covered? |
|---|---|
| Separated "discrimination (AUC)" from "calibration" as two independent problems | |
| Named class reweighting or oversampling as a common cause of systematic probability shift | |
| Used a reliability diagram plus ECE for diagnosis, instead of relying on a single aggregate score | |
| Explained the Brier score's three-term decomposition and why a low score at an extreme base rate doesn't imply good calibration | |
| Mentioned fitting the calibrator on data the model never saw, and verifying on a third, untouched fold | |
| Bonus: closed the answer on "can these be safely summed" as a business decision, not just a pile of technical terms | |

## Further Reading

- [1.16. Probability calibration — scikit-learn documentation](https://scikit-learn.org/stable/modules/calibration.html) — the official reference on Platt scaling, isotonic regression, and `CalibratedClassifierCV`, filling out the implementation details behind "fixes depend on sample size."
- [Evaluation: Measuring Models Honestly — Interview Bank](https://www.pallavlabs.com/learn/machine-learning/evaluation--interview-bank) — the original source of today's practice question; the same series has follow-up questions on the Brier score decomposition and log loss vs. Brier score worth practicing next.

## References

- [Evaluation: Measuring Models Honestly — Interview Bank · Pallav Mahapatra](https://www.pallavlabs.com/learn/machine-learning/evaluation--interview-bank) — today's practice question is adapted from its Q7, "Does 30% mean 30%?", the fraud-loss forecasting scenario, along with its explanation of the Brier score's reliability/resolution/uncertainty decomposition.
- [1.16. Probability calibration — scikit-learn 1.9.1 documentation](https://scikit-learn.org/stable/modules/calibration.html) — corresponds to the "fixes depend on sample size" section; the official docs cover the data-volume tradeoffs between Platt scaling (sigmoid) and isotonic regression, and why the calibrator must be fit on independent data.
- [Top 30 Scikit-learn Interview Questions (2026) — DataInterview](https://www.datainterview.com/blog/scikit-learn-interview-questions) — corresponds to "different model families fail in different directions"; walks through a gradient-boosting pricing scenario to explain the choice between `CalibratedClassifierCV`'s `sigmoid`, `isotonic`, and `temperature` methods.
