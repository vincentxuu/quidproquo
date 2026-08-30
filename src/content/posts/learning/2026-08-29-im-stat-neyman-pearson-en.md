---
title: "What Kind of Optimal Test Is the Neyman-Pearson View About?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 28
tldr: "The Neyman-Pearson view treats a test as a decision rule: under a fixed Type I error rate alpha, choose the rejection region with the highest power."
description: "A beginner guide to Neyman-Pearson: alpha, beta, power, likelihood ratio, most powerful tests, and the ML analogy with classifier thresholds."
draft: true
---

> [中文版](/posts/learning/2026-08-29-im-stat-neyman-pearson)

When you first learn hypothesis testing, you often enter through p-values. The Neyman-Pearson view shifts attention to a different place: a test is a decision rule.

You decide which data outcomes will lead you to reject `H0`, then ask how that rule behaves under error risk and power.

This view connects naturally to ML/AI because classifiers do something similar. You choose a threshold, decide which cases become positive, and trade off false positives against true positives. The language is not identical, but the decision problem is close.

## Alpha, Beta, and Power

Start by separating three quantities.

`alpha` is the Type I error probability:

```text
alpha = P(reject H0 | H0 true)
```

That means `H0` is actually true, but your rule rejects it. This is often compared to a false positive.

`beta` is the Type II error probability:

```text
beta = P(fail to reject H0 | H1 true)
```

That means the alternative is true, but your rule does not reject `H0`.

Power is:

```text
power = 1 - beta = P(reject H0 | H1 true)
```

The Neyman-Pearson idea is: fix `alpha`, then maximize power. In words, first control the false-alarm risk, then choose the rule that is best at detecting the alternative.

## When the Most Powerful Test Result Applies

The classic Neyman-Pearson lemma applies to a simple `H0` versus a simple `H1`. Simple means each side fully specifies a distribution, without extra unknown parameters.

In that setting, the most powerful test ranks data outcomes by the likelihood ratio. Intuitively, if an observed result is much more plausible under `H1` than under `H0`, it should be placed in the rejection region earlier.

One way to write the likelihood ratio is:

```text
likelihood ratio = f1(x) / f0(x)
```

Here `f1(x)` is the probability or density under `H1`, and `f0(x)` is the probability or density under `H0`.

The decision rule puts sufficiently large likelihood-ratio outcomes into the rejection region while keeping the probability of that region under `H0` at or below `alpha`.

## Worked Example: Compare Power at the Same Alpha

Suppose two test rules, A and B, both control Type I error at:

```text
alpha = 0.05
```

Under a particular `H1`, their powers are:

```text
power(A) = 0.80
power(B) = 0.65
```

At the same alpha level, A is more powerful. A contextual conclusion is:

If both tests control Type I error at 5%, rule A rejects `H0` more often when this alternative is true, so it has higher power against that alternative.

The order matters. First confirm alpha is the same, then compare power. If A has higher power only because it uses a looser alpha, the comparison is not fair.

## Relationship to p-Values

A p-value measures how extreme the observed data are under `H0`. The Neyman-Pearson view emphasizes the rejection rule chosen in advance: under an alpha constraint, which outcomes belong in the rejection region?

In introductory testing, the two views can be connected. After choosing alpha, reject `H0` when the p-value is smaller than alpha. That means the observed data fell into the rejection region.

Neyman-Pearson then asks a sharper design question: if `H1` is a specific alternative distribution, how should we choose the rejection region to maximize power?

## Where This Shows Up in ML/AI

Classifier thresholds are the most direct analogy. Suppose you build a fraud detector and the positive class is fraud. Lowering the threshold may catch more fraud, raising true positive rate. It may also increase false positives, blocking more normal transactions.

If the product requirement says false positive rate must stay below 5%, you are searching for a decision rule with higher true positive rate under a fixed false-positive constraint. That is close to "fix alpha, maximize power."

ROC curves can also be read this way. Each threshold gives one false positive rate and one true positive rate. The point is not just one model score, but how different decision rules allocate error costs.

LLM safety classifiers, spam detection, medical screening, and financial risk scoring all face similar threshold choices. Statistical testing language reminds you that thresholds are not minor technical details. They allocate error risk.

## Common Mistakes

Mistake 1: mixing power and p-value.

Mistake 2: comparing two tests' powers without checking whether alpha is the same.

Mistake 3: assuming the Neyman-Pearson lemma applies to every complicated hypothesis test.

Mistake 4: memorizing the likelihood ratio without explaining the rejection region as a decision rule.

Mistake 5: tuning ML classifier thresholds without naming false-positive and false-negative costs.

## Practice

1. Write definitions of alpha, beta, and power, each with one testing-decision scenario.
2. Compare two tests with the same alpha but different power and state which is better.
3. Use likelihood ratios to explain how a rejection region ranks data outcomes.
4. Describe a classifier threshold as a decision rule that controls false positive rate.

## Next

Neyman-Pearson frames tests as decision rules. The next post returns to confidence intervals, but no longer only through t tables: general confidence intervals can be built from estimators, standard errors, approximating distributions, bootstrap, or likelihood ideas.

## Section-Level Source Map

- OpenIntro and OpenStax: Type I error, Type II error, power, and hypothesis-testing foundations.
- Stanford CS109: likelihood ratios, decision rules, and testing intuition.
- scikit-learn: ROC, thresholds, false positive rate, and classifier decisions.
- NTU IM prep pages: topic placement and practice-flow alignment; not used as official solutions.

## References

- [Power and hypothesis testing in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: Type I Error, Type II Error, and Power](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109: Probability for Computer Scientists](https://cs109.stanford.edu/)
- [scikit-learn ROC Metrics and Classification Thresholds](https://scikit-learn.org/stable/modules/model_evaluation.html#roc-metrics)
- [scikit-learn Classification Metrics](https://scikit-learn.org/stable/modules/model_evaluation.html#classification-metrics)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
