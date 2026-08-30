---
title: "What Makes an Estimator Good: Bias, Variance, or MSE?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 14
tldr: "An estimator is a rule for using samples to infer a population parameter. To judge whether it is good, look at bias, variance, and MSE together."
description: "A beginner guide to estimators: estimator versus estimate, bias, variance, MSE, and how validation scores estimate model generalization."
draft: true
---

> [中文版](/posts/learning/2026-08-29-im-stat-estimators)

The word estimator can feel abstract at first. In practice, you use estimators all the time: sample mean to estimate population mean, sample proportion to estimate the true conversion rate, validation accuracy to estimate future model performance.

An estimator is a rule. An estimate is the number you get after applying that rule to one dataset.

For example, "add all sample values and divide by n" is an estimator. If this sample has 25 observations and the computed mean is 82, then 82 is the estimate. When an exam asks about an estimator, it is usually asking about the long-run behavior of the rule, not whether this one number looks nice.

## Three Judgments: Bias, Variance, and MSE

The first judgment is bias. If an estimator is `T` and the target parameter is `theta`, then:

```text
Bias(T) = E[T] - theta
```

If `E[T] = theta`, the estimator is unbiased. Across repeated samples drawn in the same way, its long-run average lands on the target parameter.

The second judgment is variance. An estimator can be unbiased and still unstable. If repeated samples produce estimates that jump around, the estimator has high variance.

The third judgment is MSE:

```text
MSE(T) = E[(T - theta)^2] = Var(T) + Bias(T)^2
```

MSE puts bias and fluctuation on the same scale. This is why a slightly biased estimator can sometimes be better than a perfectly unbiased but very noisy estimator.

## Worked Example: Which Estimator Is Better?

Suppose `X1` and `X2` are independent observations. Both have expectation `mu` and variance `sigma^2`. Consider two rules for estimating `mu`:

```text
T1 = (X1 + X2) / 2
T2 = (3X1 + X2) / 4
```

Start with the expectation of `T1`:

```text
E[T1] = E[(X1 + X2) / 2]
      = (E[X1] + E[X2]) / 2
      = (mu + mu) / 2
      = mu
```

So `T1` is unbiased.

Now check `T2`:

```text
E[T2] = E[(3X1 + X2) / 4]
      = (3E[X1] + E[X2]) / 4
      = (3mu + mu) / 4
      = mu
```

`T2` is also unbiased. Bias alone cannot choose between them, so compare variance.

Because `X1` and `X2` are independent:

```text
Var(T1) = Var((X1 + X2) / 2)
        = (1/4)Var(X1) + (1/4)Var(X2)
        = sigma^2 / 2
```

For `T2`, the weights are `3/4` and `1/4`:

```text
Var(T2) = (9/16)Var(X1) + (1/16)Var(X2)
        = 10sigma^2 / 16
        = 0.625sigma^2
```

`T1` has variance `0.5sigma^2`, which is smaller than `T2`'s `0.625sigma^2`. Since both are unbiased, `T1` is more efficient.

The exam logic is the sequence: first check whether the rule targets the right parameter in expectation, then compare how much it fluctuates.

## When MSE Changes the Answer

Now consider a short example. Estimator A is unbiased and has `Var(A) = 9`. Estimator B has bias 1 and `Var(B) = 2`.

```text
MSE(A) = 9 + 0^2 = 9
MSE(B) = 2 + 1^2 = 3
```

B is biased, but its MSE is smaller. That does not mean bias is good by itself. It means the cost of bias can be outweighed by a large reduction in variance.

This tradeoff appears constantly in machine learning: a model or estimator can accept some bias in exchange for much lower variance and better generalization.

## Where This Shows Up in ML/AI

Validation accuracy is an estimator. You use one validation set to estimate how well the model will perform on future data. If the validation set is small, the estimator has high variance. Model A may win today and lose on another sample.

Average loss is also an estimator. During training, mini-batch loss estimates the full objective using a small subset of data. Smaller batches are noisier; larger batches make the estimate more stable but cost more computation.

Regularization can also be described with estimator language. A constraint may introduce some bias while lowering variance. The MSE decomposition makes the tradeoff explicit: total error reflects both systematic offset and instability.

## Common Mistakes

Mistake 1: mixing up estimator and estimate. The estimator is the rule; the estimate is one realized number.

Mistake 2: checking only unbiasedness while ignoring variance or MSE.

Mistake 3: assuming any bias automatically makes an estimator worse.

Mistake 4: forgetting to square weights when computing the variance of a weighted estimator.

Mistake 5: deciding a model is stably better from one validation score.

## Practice

1. If `E[T] = theta + 2`, compute the bias and decide whether `T` is unbiased.
2. Estimator A is unbiased with `Var = 9`; estimator B has `bias = 1` and `Var = 2`. Compute both MSE values.
3. If `T = 0.8X1 + 0.2X2`, and `X1`, `X2` are independent and identically distributed, write `E[T]` and `Var(T)`.
4. Use validation accuracy to explain why a small test set can make model selection unstable.

## Next

Estimators answer "what rule should we use to infer a parameter?" The next post puts that idea into the most familiar model: simple linear regression, where a line estimates the average relationship between `X` and `Y`.

## Section-Level Source Map

- OpenIntro and OpenStax: estimators, unbiasedness, variance, and MSE.
- Stanford CS109: estimation, sampling fluctuation, and expectation calculations.
- scikit-learn: validation scores, overfitting, underfitting, and generalization.
- NTU IM prep pages: topic placement and practice-flow alignment; not used as official solutions.

## References

- [Estimator bias, variance, and MSE in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: Point Estimation, Bias, Variance, and MSE](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109: Probability for Computer Scientists](https://cs109.stanford.edu/)
- [scikit-learn User Guide: Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [scikit-learn User Guide: Underfitting and Overfitting](https://scikit-learn.org/stable/auto_examples/model_selection/plot_underfitting_overfitting.html)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
