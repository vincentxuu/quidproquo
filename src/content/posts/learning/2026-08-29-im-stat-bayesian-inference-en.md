---
title: "How Does Bayesian Inference Connect Prior, Data, and Posterior?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 33
tldr: "Bayesian inference updates uncertainty about an unknown parameter by combining prior belief with the likelihood from observed data, producing a posterior distribution."
description: "A guide to Bayesian inference: prior, likelihood, posterior, conjugate Beta-Binomial updating, credible intervals, and uncertainty-aware ML/AI decisions."
draft: true
---

> [中文版](/posts/learning/2026-08-29-im-stat-bayesian-inference)

The previous posts mostly used a frequentist view: parameters are fixed, samples vary, and uncertainty is handled through sampling distributions, confidence intervals, and tests. Bayesian inference changes the question: after seeing data, how should belief about an unknown parameter be updated?

This question is attractive to beginners, but it is easy to distort. Bayesian inference is not a loose synonym for being subjective. It is a strict updating rule. The prior describes belief before data, the likelihood describes how strongly the data support each parameter value, and the posterior describes updated uncertainty after data.

## What Prior, Likelihood, and Posterior Do

The core formula is Bayes' rule:

```text
p(theta | data) = p(data | theta) p(theta) / p(data)
```

In exams and implementation, it is often written as:

```text
posterior proportional to likelihood * prior
```

`p(theta)` is the prior. It describes which parameter values looked plausible before observing the data. A prior can be weak or strong, but it should be explainable.

`p(data | theta)` is the likelihood. It asks: if the parameter had this value, how plausible would the observed data be?

`p(theta | data)` is the posterior. It is the updated belief about the parameter after observing data. The posterior is usually a whole distribution; a single number is only a later summary.

The denominator `p(data)` normalizes the posterior so total probability is 1. For MAP or relative comparisons, it can often be ignored temporarily. For a full posterior, posterior mean, or credible interval, normalization matters.

## Why Conjugate Priors Are Convenient

Introductory exams often use conjugate priors because the posterior stays in the same distribution family.

The classic example is Beta-Binomial. Suppose a success probability is `p`, and the prior is:

```text
p ~ Beta(alpha, beta)
```

Then you observe `x` successes and `n - x` failures. The posterior is:

```text
p | data ~ Beta(alpha + x, beta + n - x)
```

The parameters `alpha` and `beta` can be read as prior success and failure strength. The posterior combines that prior strength with observed successes and failures.

## Worked Example: Updating a Beta Prior

Suppose you are evaluating a new model's answer accuracy. Before testing, you do not have a strong belief, so you use a uniform prior:

```text
p ~ Beta(1, 1)
```

You test 10 questions. The model answers 8 correctly and 2 incorrectly:

```text
x = 8
n - x = 2
```

The posterior is:

```text
p | data ~ Beta(1 + 8, 1 + 2)
         = Beta(9, 3)
```

The posterior mean is:

```text
9 / (9 + 3) = 0.75
```

The sample accuracy is:

```text
8 / 10 = 0.8
```

They differ because the posterior mean reflects both the prior and the data. The prior here is weak, so the posterior mean is only pulled slightly from 0.8 toward 0.5.

If the prior were stronger, such as `Beta(20, 20)`, the same data would give:

```text
Beta(28, 22)
posterior mean = 28 / 50 = 0.56
```

Now the prior has much more influence. Ten questions are not enough to move the posterior far away from the prior center. In an exam answer, name that influence instead of treating the posterior as mysterious.

## Credible Interval Versus Confidence Interval

A Bayesian credible interval can be interpreted directly through posterior probability. A 95% credible interval means that, under the model and prior, the parameter has 95% posterior probability of lying in that interval.

A frequentist confidence interval uses different language. It describes long-run coverage of a repeated-sampling procedure.

Do not mix the two sentences. If the problem asks for posterior probability, credible interval, prior, or posterior updating, use Bayesian language. If it asks for repeated-sampling confidence intervals, use coverage language.

## How to Recognize the Problem

If a prompt includes prior, posterior, conjugate, Beta-Binomial, or Normal-Normal, it is likely asking for Bayesian updating.

If it asks for the posterior distribution, write the likelihood, multiply by the prior, and simplify into a known distribution family.

If it asks for posterior mean or posterior mode, do not confuse them. The posterior mean is an average. The posterior mode is the parameter value where the posterior is largest, which leads to MAP in the next post.

If it asks for a credible interval, explain it as posterior probability, not frequentist coverage.

## Where This Shows Up in ML/AI

Bayesian inference is useful in ML/AI when a single score is not enough and uncertainty needs to be represented as a distribution.

Small-sample evaluation is a common case. A new product feature may have only a few user responses. If you report only the sample average, the first few observations can dominate the story. Bayesian updating lets existing knowledge and new evidence live in one formula.

Bayesian optimization follows the same spirit. You estimate not only which hyperparameter setting may be best, but also where uncertainty remains high enough to explore next.

In LLM systems, Bayesian thinking appears in uncertainty estimation, active learning, labeling priority, and risk decisions. You do not need every model to be fully Bayesian. The practical habit is knowing when a point estimate is too thin for the decision.

## Common Mistakes

Mistake 1: treating the prior as arbitrary bias without explaining how it affects the posterior.

Mistake 2: writing likelihood times prior but forgetting that the posterior must be normalized.

Mistake 3: mixing posterior mean, posterior mode, and MAP.

Mistake 4: explaining a credible interval with confidence-interval coverage language.

Mistake 5: reporting only a sample proportion in a small sample without discussing prior strength and posterior uncertainty.

## Practice

1. With a `Beta(2, 2)` prior, observe 8 successes and 2 failures. Write the posterior Beta parameters.
2. In one line, label prior, likelihood, and posterior: which comes before data, which comes from data, and which comes after updating?
3. Compute the posterior mean from the previous Beta posterior and compare it with sample success rate 0.8.
4. A model answers 10 out of 12 questions correctly. Use Bayesian language to warn readers that the data support high accuracy but uncertainty is still large.

## Next

Bayesian inference gives a whole posterior distribution. The next post studies one common summary: MAP. When you take the parameter value with the largest posterior, the prior becomes a regularization penalty inside an optimization objective.

## Section-Level Source Map

- OpenIntro and OpenStax: conditional probability, Bayes' rule, and introductory inference language.
- Stanford CS109: probability updating from prior to posterior.
- scikit-learn: model evaluation context for small samples and uncertainty-aware decisions.
- NTU IM prep pages: topic placement and practice-flow alignment; not used as official solutions.

## References

- [Bayesian inference basics in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
