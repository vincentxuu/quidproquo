---
title: "How Does A/B Testing Turn a Product Change Into an Estimable Effect?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 44
tldr: "A/B testing turns a product change into an estimate with uncertainty. A useful report covers effect size, confidence, guardrails, randomization, and launch risk."
description: "Statistics from Exams to ML/AI, post 44: A/B testing, two-proportion inference, sample ratio mismatch, guardrail metrics, peeking, and ML product experiments."
draft: true
---

> [中文版](/posts/learning/2026-08-29-im-stat-ab-testing)

A/B testing is one of the most common forms of statistical inference inside product decisions. The question is not only whether the new version has a higher average. You also need to know whether the difference plausibly comes from the change, how large the effect is, how uncertain it is, and whether side effects are acceptable.

This post follows experimental design. Design first sets treatment, control, randomization, and the primary metric. A/B testing turns those choices into a product workflow: split traffic, estimate the effect, inspect intervals, test hypotheses, check guardrails, and decide whether to launch.

## What an A/B Test Must Define First

First, define treatment and control. Treatment is the new version. Control is the current version. The change should be as focused as possible; otherwise the result is hard to interpret.

Second, define the experimental unit. If users are randomized, all events from the same user should stay in the same group. If one session can cross groups, both user experience and statistical independence become messy.

Third, define the primary metric. This is the main decision metric, such as conversion rate, retention, task success rate, or human preference win rate.

Fourth, define guardrail metrics. These protect what should not be sacrificed: latency, crash rate, complaint rate, cost, violation rate, or review load.

Fifth, define the stopping rule. Repeatedly peeking at results and stopping when significance appears inflates error rates.

## How to Estimate a Treatment Effect

If the outcome is a proportion, a common effect is:

```text
p_B - p_A
```

If the outcome is an average, a common effect is:

```text
mean_B - mean_A
```

Then estimate a standard error, confidence interval, or p-value. A complete report should not only say "B is higher than A." It should state the difference, interval, sample size, primary metric, and guardrails.

## Worked Example: Two Conversion Rates

Suppose group A has 1,000 users and 100 conversions:

```text
p_A = 100 / 1000 = 0.10
```

Group B has 1,000 users and 108 conversions:

```text
p_B = 108 / 1000 = 0.108
```

The effect estimate is:

```text
p_B - p_A = 0.108 - 0.10 = 0.008
```

That is 0.8 percentage points.

An approximate standard error for the difference in two proportions is:

```text
SE = sqrt(p_A(1 - p_A)/n_A + p_B(1 - p_B)/n_B)
```

Substitute the numbers:

```text
SE = sqrt(0.10 * 0.90 / 1000 + 0.108 * 0.892 / 1000)
   = sqrt(0.00009 + 0.0000963)
   = sqrt(0.0001863)
   approximately 0.0136
```

A 95% approximate interval is:

```text
0.008 +/- 1.96 * 0.0136
= 0.008 +/- 0.0267
= (-0.0187, 0.0347)
```

The interval includes 0. A careful report should not describe the result as a stable lift. A better sentence is: group B's conversion-rate point estimate is 0.8 percentage points higher, but with this sample the 95% approximate interval is about -1.9 to 3.5 percentage points, so the data do not yet support a stable improvement.

## Check Sample Ratio Mismatch First

Many A/B tests expect a 50/50 split. If the final sample has 10,000 users in A and 6,000 users in B, that is a sample ratio mismatch warning.

It may come from a randomization bug, missing tracking, incorrect exclusions, or interactions between experiments. The visible issue is unequal sample size; the deeper issue is that randomization may be broken.

When sample ratio mismatch appears, inspect the experiment pipeline before interpreting treatment effects. If randomization is broken, clean-looking tests no longer have a trustworthy foundation.

## Peeking and Multiple Metrics

If you check the p-value every day and stop once it falls below 0.05, the actual false-positive rate is higher than intended. You gave yourself many chances to get a significant result by luck.

If you inspect 30 metrics and report only the significant one, the same problem appears. This is multiple testing or p-hacking risk.

A better workflow defines the primary metric, analysis window, and stopping rule before the experiment starts. Exploratory analysis is still useful, but it should be labeled exploratory rather than presented as pre-planned hypothesis testing.

## Guardrails Make Launch Decisions Broader Than the Main Metric

Suppose a new recommendation model raises CTR, but latency increases, unsubscribes rise, and complaints grow. A better primary metric does not automatically mean launch.

Guardrail metrics put non-negotiable constraints into the decision. For ML/AI products, common guardrails include latency, cost, safety violation rate, human-review load, user reports, and long-term retention.

An A/B test conclusion should read like a decision memo, not just a hypothesis-test answer.

## Paired A/B Differs From Independent Two-Group Tests

Online product experiments often randomize independent user groups. Two-sample proportion or mean-difference methods are common there.

Model evaluation is often paired. The same tasks may be answered by model A and model B. In that setting, task difficulty affects both models, so the analysis should preserve the pairing. Possible tools include paired differences, sign tests, paired bootstrap, or another suitable paired test.

Treating paired data as two independent groups usually wastes information and may estimate the standard error incorrectly.

## Where This Shows Up in ML/AI

Product ML teams use A/B testing to decide whether a model should ship. Better offline scores are candidate evidence; deployment still requires online metrics, latency, cost, segment effects, and long-term side effects.

LLM products are the same. A new prompt, retriever, reranker, or model version may look better in offline evals but make live responses slower, increase refusals, raise tool-call cost, or harm specific user segments.

An ML/AI A/B test report should at least include the experimental unit, split ratio, primary metric, guardrail metrics, sample size, effect estimate, interval or test, segment checks, sample ratio mismatch status, and whether the experiment followed its stopping rule.

## How to Recognize the Problem

When you see two proportions, estimate `p_B - p_A`, then connect it to a standard error, interval, or test.

When you see treatment and control, check random assignment and the experimental unit.

When the same user, same item, same task, or same rater compares A and B, think paired design.

When the split ratio is abnormal, check sample ratio mismatch before interpreting effects.

When there are many metrics or repeated peeking, discuss multiple testing, peeking, and stopping rules.

## Common Mistakes

- Looking only at average lift without estimating uncertainty.
- Choosing the primary metric after seeing results.
- Analyzing a user-level experiment as event-level data and underestimating standard error.
- Continuing to interpret effects after sample ratio mismatch appears.
- Treating better offline model scores as enough to skip online guardrails.

## Practice

1. Design an A/B test: state treatment, control, primary metric, guardrail metric, and randomization unit.
2. Two groups have conversion rates of 12% and 14%, with 1000 users in each group. What test or interval would you use to compare the effect?
3. Explain why sample ratio mismatch can make experiment results untrustworthy.
4. Why does repeatedly peeking at p-values increase false-positive risk?
5. In an ML product, give two reasons why offline model scores may improve while the online A/B test does not.

## What Comes Next

A/B testing turns experimental design into product decisions. The next post moves to causal inference: when a perfect randomized experiment is not available, how can statistics still approach the question of effect?

## Section-Level Source Map

- OpenIntro and OpenStax support two-proportion comparisons, confidence intervals, hypothesis tests, and experimental design basics.
- Stanford CS109 supports the intuition from sampling error to uncertainty in product experiments.
- scikit-learn Model Evaluation supports offline metric contexts; this post separates that evidence layer from online A/B tests.

## References

- [A/B testing, two-proportion inference, sample ratio mismatch, guardrail metrics, and online experiments: OpenIntro Statistics](https://www.openintro.org/book/os/)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
