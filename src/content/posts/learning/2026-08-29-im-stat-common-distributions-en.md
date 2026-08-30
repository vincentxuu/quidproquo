---
title: "When Should Bernoulli, Binomial, Normal, and Poisson Appear?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 6
tldr: "Distributions are names for data-generating situations, not formula cards. Learn when Bernoulli, Binomial, Poisson, and Normal distributions fit a problem."
description: "A beginner guide to common distributions: how to recognize Bernoulli, Binomial, Poisson, and Normal settings, and how they appear in labels, counts, errors, and model evaluation."
draft: true
---

> [中文版](/posts/learning/2026-08-29-im-stat-common-distributions)

Many learners read distributions as formula cards. Bernoulli has mean `p`. Binomial has mean `np`. Poisson has mean `lambda`. Normal has `mu` and `sigma`. After memorizing the cards, the problem wording changes and the right distribution is still unclear.

A better reading is to treat a distribution as the name of a data-generating situation. Problems usually describe a scene first: one success/failure outcome, a number of successes in fixed trials, event counts in a fixed interval, measurement error, or an average that can be approximated. Your job is to infer the distribution from the scene.

This skill connects directly to ML/AI. Binary labels, clicks, error counts, model residuals, and benchmark averages all carry distribution assumptions. If the distribution is wrong, likelihoods, losses, and uncertainty statements can drift with it.

## Bernoulli: One 0/1 Outcome

Bernoulli is for one success/failure result. A coin flip being heads, an email being spam, one answer being correct, and one user clicking are all 0/1 outcomes.

If:

```text
X ~ Bernoulli(p)
```

then:

```text
P(X=1) = p
P(X=0) = 1 - p
E[X] = p
Var(X) = p(1 - p)
```

The important part is the setting. If the problem describes one yes/no, success/failure, correct/incorrect outcome, think Bernoulli first. Binary classification labels in ML can also be understood from this starting point.

## Binomial: Successes in a Fixed Number of Trials

Binomial adds many Bernoulli trials together. The key conditions are: fixed number of trials `n`, same success probability `p`, and trials that can be treated as independent.

Suppose a model has an assumed accuracy of 0.8 on a certain task type. You sample 10 items and ask for the probability that it answers exactly 7 correctly. The problem counts successes out of 10 trials, so:

```text
X ~ Binomial(10, 0.8)
```

The formula is:

```text
P(X=k) = C(n,k)p^k(1-p)^(n-k)
```

where `C(n,k)` counts which `k` trials were successful. A common exam mistake is stopping at Bernoulli because the problem has success/failure outcomes. If the question asks for the total number of successes in `n` trials, it is Binomial.

## Poisson: Event Counts in a Fixed Interval

Poisson often describes event counts in a fixed time or space interval: support tickets per hour, system errors per day, or requests per minute. Its possible values are 0, 1, 2, 3, and so on.

If:

```text
X ~ Poisson(lambda)
```

then `lambda` is both the expectation and the variance. Intuitively, `lambda` is the rate: the average number of events in the fixed interval.

The recognition cues are fixed interval and event count. If a problem says a system averages 3 errors per hour and asks for the probability of 5 errors in the next hour, Poisson is plausible. If it says 10 users are sampled and each user either clicks or does not click, the problem is closer to Binomial because the number of trials is fixed.

## Normal: Errors, Averages, and Approximations

The Normal distribution often appears with measurement error, natural variation, regression residuals, and approximate distributions of sample averages. It is determined by mean `mu` and variance `sigma^2`.

Beginners often treat Normal as the default distribution for any numeric data. That is risky. A variable having a mean and standard deviation does not make it Normal. Categorical data, severely skewed numeric data, and count data should not be forced into a Normal model without checking.

The real strength of Normal comes from its link to the central limit theorem. Even when the original data is not Normal, under suitable conditions and with a large enough sample, the sample mean is often approximately Normal. That idea will matter for confidence intervals and hypothesis tests.

## A Distribution Recognition Example

Suppose a problem gives three settings.

First: one user sees a recommendation and either clicks or does not click. This is one 0/1 outcome, so Bernoulli fits.

Second: 100 users each see one recommendation, and the question asks how many click. This is the number of successes in 100 fixed trials. If independence and common click probability are reasonable approximations, Binomial fits.

Third: a service receives an average of 12 support tickets per hour, and the question asks for the probability of 15 tickets in the next hour. This is an event count in a fixed time interval, so Poisson fits.

If the problem changes to "whether the average session duration of 100 users is higher than before," it is no longer a direct Bernoulli, Binomial, or Poisson question. Session duration is numeric data, and the later tool may involve a sample mean and a Normal approximation.

The same domain, "user behavior," can lead to different distributions depending on the exact question. That is the recognition skill to practice.

## Where This Shows Up in ML/AI

Binary classification starts naturally from Bernoulli. Each label is 0 or 1, and the model's output `p` can be read as the predicted probability that `Y=1`. Logistic regression and binary cross entropy sit on this language.

Clicks, errors, requests, and incident counts often connect to Poisson or other count models. In monitoring, if one minute has far more errors than usual, you need a model of normal fluctuation before deciding whether the event is worth intervention.

Normal distributions appear in residuals, noise assumptions, approximate average scores, and parameter estimates. Many ML evaluation reports use means and standard errors, which rely on sampling distributions and approximate Normal reasoning.

Distributions do not exist only for exam memorization. They are assumptions about how data is generated. Clear assumptions make losses, likelihoods, and uncertainty easier to interpret.

## How Sources Are Used

- Official past-paper PDFs are used only for years, subject names, and problem statements; two years of questions are not treated as the full future scope.
- The grad-exam-prep pages are used for study-route, question-index, and practice-flow alignment, not as official solutions.
- OpenIntro, OpenStax, and other open textbooks are used to verify formulas, definitions, assumptions, and common derivations.
- Stanford CS109 and scikit-learn documentation are used to connect each topic to ML/AI training, evaluation, experiments, and uncertainty reporting.

## Problem Recognition Hints

- One 0/1 result suggests Bernoulli.
- Number of successes in fixed `n` trials suggests Binomial.
- Event counts in a fixed time or space interval suggest Poisson.
- Errors, average approximations, and symmetric continuous variation may suggest Normal.

## Common Mistakes

- Using Bernoulli whenever a problem says success/failure, even when it asks for the number of successes in many trials.
- Mixing Poisson and Binomial without checking fixed interval versus fixed number of trials.
- Treating all numeric data as Normal.
- Using a loss or likelihood in ML without thinking about the distribution assumption behind it.

## Practice

1. Match "admitted or not," "number correct out of 20," "errors per hour," and "measurement error" to distributions.
2. If `X ~ Binomial(20, 0.3)`, compute `E[X]` and `Var(X)`.
3. If a system averages 4 errors per hour, explain what Poisson `lambda` means.
4. Write one ML/AI example each for binary labels, count events, and Normal approximation.

## Next

Distributions describe how random variables can move. The next post covers expectation and variance: one describes long-run center, the other describes fluctuation. These two quantities connect directly to loss, risk, and model stability.

## Section-Level Source Map

- OpenIntro / OpenStax: definitions, settings, expectations, and variances of Bernoulli, Binomial, Poisson, and Normal distributions.
- Stanford CS109: common distributions, data-generating assumptions, and modeling intuition.
- scikit-learn: how distribution assumptions enter classification, count-style data, losses, and baseline models.

## References

- [OpenIntro Statistics: Bernoulli, Binomial, Normal, and Poisson distributions](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: discrete and continuous probability distributions](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109: common distributions and modeling assumptions](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation: classification, count-style metrics, and model assumptions](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
