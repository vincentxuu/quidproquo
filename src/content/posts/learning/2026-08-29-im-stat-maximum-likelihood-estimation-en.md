---
title: "Why Does MLE Ask Which Parameter Most Likely Generated the Data?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 25
tldr: "MLE fixes the observed data and compares which parameter values make that data most plausible; log likelihood turns products into sums and connects directly to negative log loss."
description: "A beginner guide to Maximum Likelihood Estimation: likelihood, log likelihood, Bernoulli MLE, cross entropy, and next-token loss."
draft: false
---

> [中文版](/posts/learning/2026-08-29-im-stat-maximum-likelihood-estimation)

Method of Moments matches summaries to summaries. Maximum Likelihood Estimation changes the question: once a model family has been chosen, which parameter value makes the observed data look most plausible?

This question is one of the main bridges between statistical inference and machine learning training. In exams, you maximize likelihood. In ML, you often minimize loss. In many settings, those are the same objective with a minus sign.

## Likelihood Is Not a Probability Report About the Parameter

In the MLE view, the data have already been observed. The data are fixed, and candidate parameters are compared.

```text
data: fixed
parameter: candidate value to compare
```

If the probability mass or density for one observation is `f(x; theta)`, the likelihood for an iid sample is often:

```text
L(theta) = product over i of f(x_i; theta)
```

For hand calculation and implementation, we usually use log likelihood:

```text
ell(theta) = sum over i of log f(x_i; theta)
```

The log form has two advantages. First, products become sums, which are easier to differentiate. Second, multiplying many small probabilities can create numerical underflow, while log likelihood is more stable.

The MLE is:

```text
theta_hat = argmax_theta ell(theta)
```

In words: choose the parameter that gives the observed data the largest log likelihood.

## Worked Example: Bernoulli MLE

Suppose `X1, ..., Xn` come from Bernoulli(`p`). Each observation is either 0 or 1. In `n` observations, there are `k` successes.

The probability of one observation can be written as:

```text
P(X = x) = p^x (1 - p)^(1 - x)
```

The likelihood of the full sample is:

```text
L(p) = product over i of p^(x_i) (1 - p)^(1 - x_i)
```

Since the total number of successes is `k` and failures is `n - k`, this becomes:

```text
L(p) = p^k (1 - p)^(n - k)
```

The log likelihood is:

```text
ell(p) = k log p + (n - k) log(1 - p)
```

Differentiate with respect to `p`:

```text
d ell / dp = k / p - (n - k) / (1 - p)
```

Set the derivative equal to 0:

```text
k / p = (n - k) / (1 - p)
k(1 - p) = p(n - k)
k = np
p_hat = k / n
```

So the MLE for the Bernoulli success probability is the sample proportion. If `n = 20` and `k = 7`:

```text
p_hat = 7 / 20 = 0.35
```

Do not stop at the number. A full contextual answer is:

Under the Bernoulli model and iid assumption, the success probability that maximizes the likelihood of these 20 observations is estimated as 0.35.

## How MLE Differs From Method of Moments

Method of Moments uses a few summary statistics, such as the sample mean or second moment, and matches them to theoretical values. MLE uses the likelihood of the full observed dataset under the model.

Sometimes the two methods produce the same estimator. Bernoulli `p_hat = k/n` is one example. Sometimes they differ.

If the exam asks for Method of Moments, start by writing theoretical moments and sample moments. If it asks for MLE, start by writing the likelihood or log likelihood. The point is the derivation path, not only the final estimator.

## Where This Shows Up in ML/AI

Binary classification log loss can be understood as Bernoulli negative log likelihood. If a model predicts positive-class probability `p_i` for observation `i`, and the true label is `y_i`, the common loss is:

```text
- [y_i log p_i + (1 - y_i) log(1 - p_i)]
```

That is the Bernoulli log likelihood with a negative sign. Minimizing average log loss is equivalent to maximizing the likelihood of the labels under the model.

Next-token language-model training uses the same idea. The model assigns probability to the correct next token. Negative log likelihood penalizes the model when it assigns low probability to the observed token. Cross entropy is the common training form for classification and sequence prediction.

Once you see this, MLE stops being only an exam derivation. It becomes the statistical language behind many ML objectives.

## Common Mistakes

Mistake 1: explaining likelihood as "the probability that the parameter is true." MLE compares parameters after fixing the data.

Mistake 2: forgetting that the data are fixed and the parameter varies in the likelihood view.

Mistake 3: writing the likelihood product correctly but losing the success and failure counts in the log likelihood.

Mistake 4: solving the derivative without checking the parameter range, such as `0 < p < 1`.

Mistake 5: memorizing cross entropy without knowing its connection to negative log likelihood.

## Practice

1. Write the likelihood and log likelihood for a Bernoulli(`p`) sample.
2. If `n = 20` and `k = 7`, estimate `p` by MLE and write one contextual conclusion.
3. Explain why implementations usually use log likelihood instead of multiplying likelihood terms.
4. Explain binary cross entropy using negative log likelihood language.

## Next

MLE gives a parameter estimate. The next post asks how stable that estimate is. Fisher information uses the curvature of likelihood near the estimate to connect parameter estimation with standard error.

## Section-Level Source Map

- OpenIntro and OpenStax: likelihood, log likelihood, Bernoulli models, and basic MLE.
- Stanford CS109: MLE, probability models, and the data-generation view.
- scikit-learn: log loss, cross entropy, and classification-model training context.
- NTU IM prep pages: topic placement and practice-flow alignment; not used as official solutions.

## References

- [Maximum likelihood estimation in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: Probability Distributions and Estimation](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109: Probability for Computer Scientists](https://cs109.stanford.edu/)
- [scikit-learn Log Loss and Classification Metrics](https://scikit-learn.org/stable/modules/model_evaluation.html#log-loss)
- [scikit-learn Linear Models: Logistic Regression](https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
