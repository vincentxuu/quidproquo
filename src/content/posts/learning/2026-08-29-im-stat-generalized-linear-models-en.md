---
title: "How Does a GLM Choose Distributions and Link Functions by Data Type?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 38
tldr: "A generalized linear model starts from the response type, chooses a suitable distribution, and uses a link function to connect the mean to a linear predictor."
description: "Statistics from Exams to ML/AI, post 38: GLM components, response types, link functions, Poisson rate ratios, and ML baselines."
draft: true
---

> [中文版](/posts/learning/2026-08-29-im-stat-generalized-linear-models)

The previous posts covered linear regression and logistic regression. They look different on the surface: one handles continuous outcomes, one handles 0/1 classification; one uses squared error, the other uses likelihood or cross entropy. Inside the GLM framework, they are members of the same family.

GLM stands for generalized linear model. It answers a practical modeling question: if `Y` has different data types, why should every problem be forced into normal linear regression? Binary outcomes, counts, proportions, and waiting times need distributions and link functions that match their shape.

## The Three Parts of a GLM

A GLM has three parts: a random component, a linear predictor, and a link function.

The random component describes the distribution of `Y`. Continuous data that are roughly normal can use Normal. A 0/1 outcome can use Bernoulli. Count data often use Poisson.

The linear predictor is:

```text
eta = X beta
```

This keeps the main benefit of linear models: features are still combined linearly.

The link function connects the conditional mean to the linear predictor:

```text
g(E[Y | X]) = X beta
```

This equation is the core of GLMs. The model keeps `X beta`, but it no longer requires `E[Y | X]` itself to equal `X beta` directly.

## Response Type Drives Model Choice

If `Y` is continuous and the error can be reasonably approximated by a normal distribution, ordinary linear regression is the natural starting point:

```text
Y | X ~ Normal(mu, sigma^2)
mu = X beta
```

If `Y` is 0/1, a common choice is Bernoulli with a logit link:

```text
Y | X ~ Bernoulli(p)
log(p / (1 - p)) = X beta
```

That is logistic regression.

If `Y` is a count, a common choice is Poisson with a log link:

```text
Y | X ~ Poisson(lambda)
log(lambda) = X beta
```

This keeps `lambda` positive, because:

```text
lambda = exp(X beta)
```

The first step in a GLM problem is to look at the response variable. The shape of `Y` tells you which distribution and link function should be considered.

## Worked Example: Rate Ratio in a Poisson GLM

Suppose you are analyzing the number of support tickets received each day. `Y` is a count, so you use a Poisson GLM:

```text
log(lambda) = beta0 + beta1 x
```

Let `x` indicate whether a new entry point is enabled. `x = 1` means enabled and `x = 0` means not enabled. Suppose the fitted coefficient is:

```text
beta1_hat = 0.4
```

This does not mean daily ticket count increases by 0.4. The coefficient is on the log-rate scale.

Convert it back:

```text
exp(0.4) approximately 1.49
```

The interpretation is: under this model, enabling the new entry point makes the expected ticket rate about 1.49 times the rate when it is not enabled.

That is the correct interpretation because coefficients under a log link become rate ratios on the original scale.

## Explain Both the Link Scale and the Original Scale

GLM coefficients usually live on the link scale first.

In logistic regression, coefficients are on the log-odds scale. After applying `exp(beta)`, they become odds ratios.

In Poisson regression, coefficients are on the log-rate scale. After applying `exp(beta)`, they become rate ratios.

In linear regression with the identity link, coefficients can be interpreted directly on the original scale.

This is a common exam trap. When you see a GLM coefficient, first ask: which scale is this coefficient on? If the answer is for a general reader or product team, decide whether you should convert it into an odds ratio, rate ratio, or predicted mean.

## Distribution and Loss Function Are Connected

GLMs also explain common ML loss functions.

Normal likelihood corresponds to squared error. Bernoulli likelihood corresponds to binary cross entropy. Poisson likelihood corresponds to a negative log likelihood for count data.

This means loss functions are not arbitrary. Choosing a loss function often encodes an assumption about how the data were generated. If `Y` is count data but ordinary squared error is used, the model may predict negative values or treat high-count errors in a poor way.

## How to Recognize the Problem

When the response is 0/1, think Bernoulli, logit link, and logistic regression.

When the response is a count, think Poisson, log link, and rate ratio.

When the response is continuous and normal error is a reasonable approximation, think Normal, identity link, and linear regression.

When the question asks for coefficient interpretation, answer on the link scale first, then transform back when needed.

When the question asks for model choice, begin from the data type of `Y`, then discuss assumptions and diagnostics.

## Where This Shows Up in ML/AI

GLMs are strong structured baselines in ML projects. They may not beat deep models, but they often answer three questions early: whether the target type is modeled correctly, whether feature directions make sense, and whether a complex model is actually needed.

Many product targets are not continuous normal variables. Click is 0/1. Purchase count is a count. Waiting time is skewed. Retention may be a proportion or survival problem. GLMs force you to respect the response type before talking about model power.

AI evaluation has the same issue. If an eval item is pass/fail, Bernoulli language is natural. If the outcome is number of errors per user, a count model may fit the reporting better. If the outcome is a rating score, a linear or ordinal model may be the first baseline. These choices affect uncertainty estimates and explanation.

## Common Mistakes

- Treating every regression problem as ordinary linear regression.
- Forgetting that GLM coefficients usually live on the link scale.
- Interpreting a Poisson coefficient as a direct additive change in the original count scale.
- Interpreting a logistic coefficient as a probability difference.
- Choosing models only by score while ignoring response type, distribution assumptions, and diagnostics.

## Practice

1. Match Bernoulli, Poisson, and Normal to common response types, and write one possible link function for each.
2. Explain the three parts of a GLM: random component, linear predictor, and link function.
3. In a Poisson GLM, if `beta1 = 0.4`, compute `exp(beta1)` and interpret it as a rate ratio.
4. If the outcome is count data, why might ordinary linear regression be inappropriate?
5. Why is a GLM often a strong baseline before a deep model in ML? Answer from data type and interpretability.

## What Comes Next

GLMs teach you to choose distributions and link functions by response type. The next post returns to model diagnostics: even after choosing a reasonable model, residuals, outliers, leverage, and error analysis still have to show where the model breaks.

## Section-Level Source Map

- OpenIntro and OpenStax support response-variable types and regression extensions such as logistic and Poisson-style models.
- Stanford CS109 supports the intuition for distribution choice and conditional probabilistic modeling.
- scikit-learn supports workflows for evaluating models and treating GLMs as structured baselines.

## References

- [Generalized linear models, Bernoulli, Poisson, logit link, log link, and response type: OpenIntro Statistics](https://www.openintro.org/book/os/)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
