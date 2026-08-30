---
title: "What Do Bias, Variance, and Consistency Check in Point Estimation?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 23
tldr: "Bias checks whether an estimator is centered correctly, variance checks sampling fluctuation, MSE combines both, and consistency asks whether the estimator approaches truth as sample size grows."
description: "A guide to point-estimation quality: bias, variance, MSE, consistency, worked calculations, and the ML bias-variance tradeoff."
draft: false
---

> [中文版](/posts/learning/2026-08-29-im-stat-bias-variance-consistency)

Post 14 introduced estimators in a beginner-friendly way. This post goes one layer deeper. If several estimation methods are available, how do you decide which one is better?

Exams often use four criteria: bias, variance, MSE, and consistency. The answer is not "the formula I remember best."

All four terms describe the long-run behavior of an estimator. You only observe one dataset and one estimate. Statistical inference asks what would happen if the same method were used repeatedly: is it centered correctly, does it fluctuate a lot, and does it approach the true value when sample size grows?

## Bias: Is the Center Shifted?

Let estimator `T` estimate parameter `theta`. Bias is:

```text
Bias(T) = E[T] - theta
```

If `E[T] = theta`, then `T` is an unbiased estimator. Across repeated samples from the same design, the average estimate lands on `theta`.

Unbiased does not mean every estimate is accurate. It only describes the long-run center. Some unbiased estimators fluctuate heavily, so one realized estimate can still be far from the truth.

## Variance: How Much Does It Move Across Samples?

Variance measures how much the estimator moves under repeated sampling. If two estimators are both unbiased, the one with smaller variance is usually more efficient because it is centered correctly and moves less.

Exams often test this with linear combinations. If:

```text
T = aX1 + bX2
```

and `X1`, `X2` are independent with variance `sigma^2`, then:

```text
Var(T) = a^2 sigma^2 + b^2 sigma^2
```

The weights are squared. Forgetting that square is a common calculation error.

## MSE: Bias and Fluctuation Together

MSE is:

```text
MSE(T) = E[(T - theta)^2]
       = Var(T) + Bias(T)^2
```

It combines two sources of error: the estimator's center being shifted away from the target, and the estimator fluctuating across samples. This lets you compare "unbiased but noisy" with "slightly biased but stable."

## Worked Example: Bias and MSE Can Choose Differently

Estimator A is unbiased with variance 4. Estimator B has bias 1 and variance 1.

For A:

```text
Bias(A) = 0
MSE(A) = Var(A) + Bias(A)^2 = 4 + 0 = 4
```

For B:

```text
Bias(B) = 1
MSE(B) = Var(B) + Bias(B)^2 = 1 + 1^2 = 2
```

If you look only at bias, A looks better because it is unbiased. If you look at MSE, B is better because its small bias is outweighed by much lower variance.

The lesson is simple: after seeing "unbiased," keep checking variance and MSE.

## Consistency: Does More Data Move It Toward Truth?

Consistency asks whether the estimator converges to the target parameter as sample size grows. Informally:

```text
Tn -> theta as n -> infinity
```

More formally, many courses describe this as convergence in probability. For a first pass, focus on the meaning: with enough data, the estimator should get close to the true parameter.

Consistency differs from finite-sample unbiasedness. Unbiasedness checks whether the expected value is exactly centered for a fixed sample size. Consistency checks the large-sample limit. An estimator can be biased in small samples but have bias vanish as `n` grows.

## Where This Shows Up in ML/AI

The ML bias-variance tradeoff is an extension of this language. A model that is too simple can have high bias: it cannot capture the main relationship, so it underfits. A model that is too flexible can have high variance: it reacts too strongly to details of the training data, so it overfits.

Regularization often accepts some bias to reduce variance. A constraint may make training performance slightly worse, but test-set performance more stable. This matches the MSE decomposition:

```text
total error = variance + bias^2
```

Model evaluation also has a consistency issue. As the test set grows, accuracy or average loss should become a more stable estimate of future performance. If the data source keeps changing, however, more observations may not fix the problem because the identical-distribution assumption may have failed.

## Common Mistakes

Mistake 1: choosing an estimator as best just because it is unbiased, without checking variance or MSE.

Mistake 2: treating bias as the error from one estimate instead of the long-run expected offset.

Mistake 3: forgetting to square weights when computing variance of a linear combination.

Mistake 4: interpreting consistency as "small samples are accurate."

Mistake 5: using high bias and high variance as slogans without connecting them to underfitting, overfitting, and generalization error.

## Practice

1. Given `E[T] = theta - 1`, compute the bias and decide whether `T` is unbiased.
2. If `Var(A) = 4`, `Bias(A) = 0`, `Var(B) = 1`, and `Bias(B) = 1.5`, compute both MSE values.
3. Write one sentence separating finite-sample unbiasedness from consistency.
4. Use underfitting and overfitting to explain the bias-variance tradeoff, with one model-selection example for each.

## Next

This post compared estimator quality. The next post introduces a concrete way to estimate parameters: Method of Moments. It matches sample moments to population moments and solves for distribution parameters.

## Section-Level Source Map

- OpenIntro and OpenStax: estimator quality, bias, variance, and MSE.
- Stanford CS109: sampling fluctuation, long-run estimator behavior, and convergence intuition.
- scikit-learn: bias-variance tradeoff, underfitting, overfitting, and generalization evaluation.
- NTU IM prep pages: topic placement and practice-flow alignment; not used as official solutions.

## References

- [Point estimation, bias, variance, and MSE in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: Estimation and Sampling Variability](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109: Probability for Computer Scientists](https://cs109.stanford.edu/)
- [scikit-learn Example: Underfitting vs Overfitting](https://scikit-learn.org/stable/auto_examples/model_selection/plot_underfitting_overfitting.html)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
