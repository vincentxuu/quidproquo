---
title: "From H0 to p-Values, What Decision Is a Hypothesis Test Making?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 10
tldr: "A hypothesis test is a decision process under uncertainty: write H0/H1, choose alpha, compute a test statistic and p-value, then decide whether the data is strong enough to challenge H0."
description: "A beginner guide to hypothesis testing: H0/H1, alpha, p-values, t tests, Type I/II errors, and test logic in model comparison."
draft: false
---

> [中文版](/posts/learning/2026-08-29-im-stat-hypothesis-testing)

Hypothesis testing is often taught as a sequence of symbols: write `H0`, write `H1`, compute a statistic, find a p-value, reject or fail to reject. That sequence is useful, but it is easy to memorize without understanding the decision being made.

A hypothesis test starts with a baseline claim. If that baseline were true, would the data we observed look ordinary or unusual? If the data would be very unusual under the baseline, we have evidence against it.

The workflow is a way to make that decision explicit before looking for a conclusion that feels convenient.

## What a p-Value Says

`H0` is the null hypothesis. It is usually the conservative position: no difference, no effect, no association, or no improvement. `H1` is the alternative hypothesis: the direction or kind of departure you are trying to find evidence for.

The significance level `alpha` is the threshold you choose before using the data. A common value is `0.05`, but the important point is not the number itself. The important point is that it defines how much Type I error risk you are willing to tolerate.

A p-value is conditional on `H0`:

```text
p-value = probability of seeing data this extreme or more extreme, assuming H0 is true
```

So a small p-value means the observed result would be unusual if `H0` were true. It does not mean "the probability that H0 is true." A large p-value also does not prove `H0`; it may mean the sample is too small, the effect is weak, or the data are noisy.

A clean exam workflow is:

1. State the parameter and context.
2. Write `H0` and `H1`.
3. Choose `alpha`.
4. Compute the test statistic.
5. Get the p-value or compare with the critical region.
6. Write the conclusion in context.

The last step matters. "Reject H0" is not a full answer. The conclusion needs to return to the original claim.

## Worked Example: One-Mean t Test

Suppose a process claims its mean processing time is 30 seconds. After an improvement, you collect:

```text
n = 16
xbar = 28
s = 4
alpha = 0.05
```

The question is whether the mean processing time is now below 30 seconds.

Write the hypotheses:

```text
H0: mu = 30
H1: mu < 30
```

Because `sigma` is unknown and `s` is given, use a t statistic:

```text
SE = s / sqrt(n) = 4 / sqrt(16) = 1
t = (xbar - mu0) / SE = (28 - 30) / 1 = -2
df = 15
```

For a left-tailed t test with `df = 15`, the p-value is roughly `0.03`. Since `0.03 < 0.05`, reject `H0`.

A good contextual conclusion is:

At the 5% significance level, the sample provides evidence that the mean processing time is below 30 seconds.

Notice what the test does not say. It does not say the mean is exactly 28 seconds. It does not say the improvement is operationally important. It only says the data are strong enough, under this model and significance level, to challenge the 30-second baseline.

## Put Type I and Type II Errors Into Context

Type I error means rejecting `H0` when `H0` is actually true. In this example, that means concluding the process became faster when the true mean is still 30 seconds.

Type II error means failing to reject `H0` when the alternative is actually true. In this example, that means missing a real reduction in processing time.

The error types are easier to remember when you attach them to the decision:

```text
Type I: false alarm
Type II: missed detection
```

In product experiments, a Type I error may ship a change that does not really improve conversion. A Type II error may discard a change that actually helps. The right `alpha`, sample size, and test design depend on which mistake is more costly.

## Where This Shows Up in ML/AI

Model comparison is hypothesis testing in disguise. If Model A gets accuracy `0.84` and Model B gets `0.86`, the question is not only which number is larger. The question is whether the observed gap is too large to be explained by sampling variation.

The evaluation design matters. If both models answer the same test items, their errors are paired by item. A test that ignores the pairing can misstate uncertainty. If many models, prompts, datasets, or hyperparameters are compared, repeated testing can create false discoveries.

This is why a serious model report should separate:

```text
observed metric
uncertainty
test design
decision threshold
practical importance
```

A p-value can support a decision, but it cannot tell you whether the dataset is representative, whether the metric captures user value, or whether a small gain is worth extra cost.

## Common Mistakes

Mistake 1: writing `H0` and `H1` after seeing the sample result. The hypotheses and direction should come from the question, not from a desire to make the result significant.

Mistake 2: explaining the p-value as the probability that `H0` is true. The p-value assumes `H0` is true and asks how unusual the data would be.

Mistake 3: treating "fail to reject" as "accept H0." A non-significant result is not proof that there is no effect.

Mistake 4: ignoring practical significance. A statistically significant result can be too small to matter.

## Practice

1. For the claim "the mean processing time is below 30 seconds," write `H0`, `H1`, `alpha`, and a conclusion template.
2. Given `t = -2.1`, `df = 15`, and `p = 0.026`, write the statistical conclusion and the contextual conclusion at `alpha = 0.05`.
3. In an A/B test, describe one Type I error and one Type II error using product language.
4. Design a two-model comparison and list what the p-value cannot answer.

## Next

This post used one sample and one baseline value. The next post moves to two-sample comparisons, where the baseline is no longer a fixed number but the difference between two groups.

## Section-Level Source Map

- OpenIntro and OpenStax: null and alternative hypotheses, p-values, significance levels, t tests, and error types.
- Stanford CS109: hypothesis testing as decisions under uncertainty.
- scikit-learn: model-evaluation metrics and limits of score comparison.
- NTU IM prep pages: topic placement and practice-flow alignment; not used as official solutions.

## References

- [Hypothesis testing in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: Hypothesis Testing](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
