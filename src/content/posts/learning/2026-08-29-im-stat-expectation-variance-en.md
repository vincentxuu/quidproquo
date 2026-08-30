---
title: "What Do Expectation and Variance Mean in Exams and Model Evaluation?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 7
tldr: "Expectation describes long-run center; variance describes fluctuation. This post computes E[X], E[X^2], and Var(X), then connects them to average loss and model stability."
description: "A beginner guide to expectation and variance: how to compute E[X], E[X^2], Var(X), understand linear transformations and independent sums, and connect them to ML/AI loss and variance."
draft: true
---

> [中文版](/posts/learning/2026-08-29-im-stat-expectation-variance)

Expectation and variance are often taught together, so beginners may compress them into "average and spread." That is not wrong, but it is too rough. Exams and ML/AI evaluation need a sharper distinction: expectation tells you the long-run center; variance tells you how much results move around.

A higher average does not mean stable. Two models can have the same average score, while one behaves consistently and the other swings between excellent and terrible. Product decisions would differ. Low variance also does not mean a good average. A model can be consistently wrong.

So this post separates two questions: where is the long-run average, and how large is the fluctuation? These questions connect later to standard error, confidence intervals, bias-variance tradeoff, and model evaluation.

## Expectation Is a Probability-Weighted Long-Run Average

If a random variable can take several values, and each value has a probability, the expectation multiplies each value by its probability and adds them up.

For a discrete random variable:

```text
E[X] = sum x p(x)
```

This does not mean the next observation will equal `E[X]`. A fair die has expectation 3.5, but you will never roll 3.5. Expectation describes the long-run average, not a single outcome.

This matters in exams. When a problem asks for average payoff, long-run loss, or expected score, it is usually asking for expectation. Match each possible outcome with its probability; do not look only at the largest or most common outcome.

## Variance Asks How Far Outcomes Move From the Mean

Variance describes how much results fluctuate around the expectation. It does not simply average `X - E[X]`, because positive and negative differences would cancel. Instead, it squares the distance before averaging.

The definition is:

```text
Var(X) = E[(X - E[X])^2]
```

A common equivalent formula is:

```text
Var(X) = E[X^2] - E[X]^2
```

This version is often cleaner for discrete exam problems. First compute `E[X]`, then `E[X^2]`, then subtract. The standard deviation is the square root of variance and returns to the original unit, so it is easier to explain.

## A Complete Worked Example

Suppose `X` is a human rating for one model answer:

| X | Meaning | Probability |
|---|---|---:|
| 0 | Wrong | 0.20 |
| 1 | Partly correct | 0.50 |
| 2 | Fully correct | 0.30 |

First compute expectation:

```text
E[X] = 0*0.20 + 1*0.50 + 2*0.30 = 1.10
```

The long-run average rating is 1.10. A single answer will not receive 1.10 points; across many answers or repeated evaluations, the center is near that value.

Next compute `E[X^2]`:

```text
E[X^2] = 0^2*0.20 + 1^2*0.50 + 2^2*0.30 = 1.70
```

Then:

```text
Var(X) = 1.70 - 1.10^2 = 0.49
```

The standard deviation is:

```text
sqrt(0.49) = 0.70
```

In an exam answer, you can write: "The long-run average rating is 1.10, and the standard deviation is about 0.70, so a single answer still fluctuates noticeably around the mean."

A common mistake is stopping after `E[X]`. If the problem asks about risk, stability, fluctuation, or reliability, variance is the central quantity.

## Linear Transformations Change Center and Spread Differently

Exams often ask about `aX+b`. These problems test whether you separate location from fluctuation.

Expectation transforms linearly:

```text
E[aX+b] = aE[X] + b
```

Variance transforms differently:

```text
Var(aX+b) = a^2 Var(X)
```

Adding `b` shifts every outcome by the same amount, so it does not change spread. Multiplying by `a` stretches or shrinks distances, so variance is multiplied by `a^2`.

For example, if a score `X` is converted to `Y=10X+5`, then the mean becomes `10E[X]+5`, while the variance becomes `100Var(X)`. The `+5` moves every score upward; it does not make scores less stable or more stable.

## Be Careful When Adding Random Variables

If `X` and `Y` are independent:

```text
Var(X+Y) = Var(X) + Var(Y)
```

This is a common property.

If they are not independent, you cannot just add variances. Scores from two models on the same test items are often related: if one item is difficult, both models may fail. Then the uncertainty calculation involves covariance.

This is why later model comparison emphasizes paired evaluation. Whether two results are independent directly changes the uncertainty estimate.

## Where This Shows Up in ML/AI

Training loss can be treated as a random variable. Each data point has a loss. Average loss is a sample version of expected risk. When you minimize training loss, you use a sample average to approximate the future average loss you actually care about.

Model evaluation also needs variance. If the same model gets very different scores across different splits, the evaluation is unstable. You should not choose the highest single run as the conclusion. This connects to cross-validation, bootstrap, and confidence intervals.

Bias-variance tradeoff also starts here. High bias means the model is systematically off target. High variance means the model is too sensitive to the training sample. Average performance and fluctuation must be read together.

## How Sources Are Used

- Official past-paper PDFs are used only for years, subject names, and problem statements; two years of questions are not treated as the full future scope.
- The grad-exam-prep pages are used for study-route, question-index, and practice-flow alignment, not as official solutions.
- OpenIntro, OpenStax, and other open textbooks are used to verify formulas, definitions, assumptions, and common derivations.
- Stanford CS109 and scikit-learn documentation are used to connect each topic to ML/AI training, evaluation, experiments, and uncertainty reporting.

## Problem Recognition Hints

- For long-run average, expected return, or average loss, think expectation.
- For risk, stability, fluctuation, or reliability, think variance or standard deviation.
- When you see `aX+b`, remember that expectation and variance transform differently.
- When adding random variables, first check whether independence is a reasonable assumption.

## Common Mistakes

- Treating expectation as the value that must appear next.
- Computing only the average and ignoring fluctuation.
- Forgetting that `a` is squared in `Var(aX+b)`.
- Assuming two model scores are independent when they come from paired data.

## Practice

1. Given `P(X=0)=0.25` and `P(X=4)=0.75`, compute `E[X]`, `E[X^2]`, and `Var(X)`.
2. If `Y=3X+2`, write `E[Y]` and `Var(Y)`.
3. Explain why average loss alone is not enough to describe model stability.
4. Give one example of a high-bias model and one example of a high-variance model.

## Next

Expectation and variance describe the center and fluctuation of one random variable. The next post puts many samples together and studies how the sample mean fluctuates: standard error and the central limit theorem.

## Section-Level Source Map

- OpenIntro / OpenStax: expectation, variance, standard deviation, linear transformations, and independence.
- Stanford CS109: roles of expectation and variance in probability models.
- scikit-learn: loss, model stability, bias-variance tradeoff, and evaluation context.

## References

- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
