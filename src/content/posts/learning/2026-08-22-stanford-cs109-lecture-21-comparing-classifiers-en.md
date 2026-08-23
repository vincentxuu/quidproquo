---
title: "Stanford CS109 Lecture 21 | Comparing Classifiers: Beyond accuracy to calibration, error costs, and fairness"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, machine-learning]
lang: en
series:
  name: "Reading Stanford CS109"
  order: 22
tldr: "Classifier comparison requires held-out data, baselines, calibration, precision/recall, and an explicit fairness criterion—not accuracy alone."
description: "A problem-by-problem guide to Stanford CS109 Summer 2026 Lecture 21: Naive Bayes, overfitting, calibration, precision/recall, tree entropy, and fairness."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs109-lecture-21-comparing-classifiers)

This is article 22 in [Reading Stanford CS109](/series/stanford-cs109), covering **Summer 2026 Lecture 21: Comparing Classifiers** (Jul 29), taught by Chris Gregg. It follows the official [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture21-Worksheet.pdf), [answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture21-AnswerKey.pdf), and [LLM guide](https://web.stanford.edu/class/cs109/worksheets/Lecture21-LLMPrompts.pdf).

This is **L2**: a four-page worksheet with P1–P8 plus a Platt challenge, a five-page key omitting only the P8 pset7 solution, and a three-page six-concept guide. Current slides are unavailable and video is Canvas-gated.

## P1: Logistic Regression refresher

For `θ=[-1,3,-1]` and `x=[1,1,1]`, `z=1` and `ŷ=0.7311`. With `y=1`, `∂LL/∂θ₁=x₁(y-ŷ)=0.2689`, so ascent increases `θ₁`. Negative `θ₂` pushes predictions away from class 1.

## P2: Brute-force Bayes and Naive Bayes

`m` binary features require `O(2^m)` cells: about 4.2 million assignments at `m=22`, and `2^100≈1.3×10^30` at 100. Data is the binding constraint: 467 samples can populate at most 467 cells.

Naive Bayes assumes conditional independence:

```text
P(x₁,…,xₘ|y)=∏ⱼP(xⱼ|y)
```

This reduces parameters to `O(m)`. The assumption is usually imperfect but makes estimation feasible.

## P3: A Beta prior prevents a zero-probability veto

Thirty positives in 100 examples with prior `Beta(3,4)` yield posterior `Beta(33,74)` and mean `33/107≈0.3084`. The prior's pseudo-rate exceeds 0.30, hence the upward nudge. If a feature is never 1 among positives, MLE assigns zero and one unseen value vetoes the entire positive-class product; a prior supplies a small nonzero probability.

## P4: Train, test, baselines, and overfitting

For 99.8% accuracy, first ask whether it is train or test. Random Forest has the largest table gap, 0.8726 versus 0.8500, but a two-point advantage still needs test size and a bootstrap interval. The always-positive baseline already scores 0.5887. XOR demonstrates a linear boundary's limit; interaction features can change separability in expanded space.

## P5: Calibration is not accuracy

Observed positive fractions are `0.08,0.30,0.52,0.75,0.70`. The 0.9 bucket is badly overconfident and has threshold accuracy 0.70. Under `Bin(100,0.9)`:

```text
P(X=70)=C(100,70)0.9^70 0.1^30 ≈ 1.8×10^-8
```

That is not plausible sampling noise. A model that always outputs the base rate can be perfectly calibrated while having no discrimination.

## P6: Precision, recall, and error costs

`TP=40,FP=10,FN=20,TN=130` gives accuracy `0.85`, precision `0.80`, and recall `2/3`. Always-negative still gets 0.70 accuracy but zero recall. Lowering a threshold usually raises recall and lowers precision. The correct priority in fraud or medical screening follows false-positive and false-negative costs.

## P7: Fairness is not one number

Selection rates are 0.30 and 0.50; their 0.60 ratio fails the 80% rule. Positive-prediction correctness is `48/60=0.80` versus `70/100=0.70`, a 0.10 gap that passes relaxed calibration at `ε=0.2`. Passing one criterion and failing another means “fair” requires an explicit definition. Removing a protected column also fails when correlated proxies reconstruct demographic signal.

## P8: Decision-tree entropy

The root has 40/80 positives and entropy 1 bit. With `p_left=17/52` and `p_right=23/28`:

```text
H_left ≈ 0.912
H_right ≈ 0.677
E[H_child] ≈ 0.830
information gain ≈ 0.170 bits
```

P8 is a pset7 item omitted from the public key; these values follow the public prompt.

## Optional challenge: Platt recalibration

For `q=σ(ap̂-0.5)`, `p̂=0.9,a=2` gives `q=σ(1.3)≈0.7858`. On held-out pairs:

```text
LL(a)=Σᵢ[yᵢlog qᵢ+(1-yᵢ)log(1-qᵢ)]
∂LL/∂a=Σᵢp̂ᵢ[yᵢ-σ(ap̂ᵢ-0.5)]
```

Optimize by gradient ascent. Calibration must use held-out validation data because training-set probabilities are optimistically distorted.

## How to use the LLM Learning Guide

Work through brute-force Bayes, Naive Bayes, train/test evaluation, calibration, precision/recall, and fairness. Solve first, then ask for the first erroneous step and identify the error cost or fairness definition behind every metric choice.

## Material boundaries

- The worksheet has P1–P8 plus a challenge; the five-page key omits only P8.
- The three-page guide has six concepts and no extra problem.
- Current slides are unavailable and video is Canvas-gated.

## References

- [Schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 21 page](https://web.stanford.edu/class/cs109/lectures/21-ComparingClassifiers)
- [Worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture21-Worksheet.pdf)
- [Answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture21-AnswerKey.pdf)
- [LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture21-LLMPrompts.pdf)
- [Course reader](https://probabilitycoders.stanford.edu/spr26)
