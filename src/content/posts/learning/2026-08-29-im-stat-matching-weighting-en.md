---
title: "How Do Matching and Weighting Make Observational Data More Experiment-Like?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 46
tldr: "Matching and weighting do not turn observational data into a true experiment. They try to make treatment and control comparable on observed variables."
description: "Statistics from Exams to ML/AI, post 46: propensity scores, matching, inverse probability weighting, balance, overlap, logged data, and ML policy evaluation."
draft: true
---

> [中文版](/posts/learning/2026-08-29-im-stat-matching-weighting)

The previous post introduced causal inference through comparability. Randomized experiments create comparability through random assignment. Observational data do not have that guarantee, so design and assumptions have to do more work.

Matching and weighting are two common tools. They do not make observational data a real experiment, but they can make treatment and control groups more similar on observed variables. Exams often ask about propensity scores, matching, weights, and balance. ML/AI practice meets the same issue in logged data, recommender-policy evaluation, and ad-effect estimation.

## What Problem This Solves

Suppose you want to know whether taking an AI course improves hiring outcomes. A raw comparison between course takers and non-takers may overstate the course effect. People who took the course may have been more motivated, more prepared, or more experienced before the course began.

Matching says: for each person who took the course, find a similar person who did not. If their experience, education, role, and portfolio are close, comparing outcomes becomes more reasonable.

Weighting says: keep more of the data, but change the weight of each observation so the weighted background distributions of the two groups become more similar.

Both methods aim at balance. First ask whether the groups can be compared. Only then discuss the treatment effect.

## Core Intuition

Consider two groups of job candidates:

- Treatment group: took an AI course.
- Control group: did not take the course.

If the treatment group mostly has two or more years of experience, while the control group is mostly new graduates, direct comparison is unfair. Matching pairs people with similar backgrounds. Weighting makes rare but important profiles more representative in the analysis.

A common compression tool is the propensity score:

```text
e(X) = P(T = 1 | X)
```

It is the probability of receiving treatment given background variables `X`. If two people have similar propensity scores, then based on observed background variables, their treatment tendency is similar.

## Formula and Mechanism

Propensity-score matching can be summarized as:

```text
1. Predict T from X to estimate e(X)
2. For each treated unit, find a control unit with similar e(X)
3. Check whether covariates are balanced after matching
4. Estimate treatment effect in the matched sample
```

Inverse probability weighting, or IPW, rebuilds a sample that looks more like random assignment. Common weights are:

```text
treated: 1 / e(X)
control: 1 / (1 - e(X))
```

The intuition is that a treated person who was unlikely to receive treatment, based on background variables, carries valuable information about the treated group. That observation receives a larger weight. The same logic applies to control units.

Large weights can make estimates unstable. In practice, you inspect propensity-score overlap, extreme weights, and balance after weighting. Applying the formula is not enough.

## Worked Example: Matching and IPW

Suppose four candidates are used to estimate whether the course improves hiring:

| Person | Took course T | Propensity score e(X) | Hired Y |
|---|---:|---:|---:|
| A | 1 | 0.80 | 1 |
| B | 1 | 0.40 | 1 |
| C | 0 | 0.75 | 1 |
| D | 0 | 0.35 | 0 |

### Matching

A has `e(X)=0.80`. The closest control is C with `0.75`. Their outcome difference is:

```text
1 - 1 = 0
```

B has `e(X)=0.40`. The closest control is D with `0.35`. Their outcome difference is:

```text
1 - 0 = 1
```

The average paired difference is:

```text
(0 + 1) / 2 = 0.5
```

In this toy example, matching estimates that the course increases hiring probability by 0.5. Real data cannot support conclusions with such a tiny sample; the example only shows the workflow.

### Weighting

IPW weights are:

```text
A treated weight = 1 / 0.80 = 1.25
B treated weight = 1 / 0.40 = 2.50
C control weight = 1 / (1 - 0.75) = 4.00
D control weight = 1 / (1 - 0.35) = 1.54
```

C receives a large control weight because, given its background, it was likely to take the course but did not. That observation helps construct a counterfactual comparison, but it also makes the estimate sensitive.

If an exam provides a table like this, you usually need to do three things: compute the weights, explain why some weights are large, and state the risk from extreme weights.

## Where This Shows Up in ML/AI

ML/AI often runs into logged data.

A recommender system logs only the items the old policy showed and how users responded. It does not show what would have happened if another item had been shown. That is the same treatment/counterfactual problem.

Suppose the old recommendation policy favors popular items. Niche items have low exposure probability. If you use this log to evaluate a new policy that recommends niche items, there may be very few comparable observations. Weighting language appears here: records with low exposure probability but actual exposure need larger weights.

Advertising is similar. Platforms often serve ads to users already likely to convert, which inflates the apparent ad effect. Matching and weighting help ask a sharper question: among people with similar backgrounds, did seeing the ad create an additional difference?

The limit remains important. Matching and weighting cannot fix unmeasured confounders. If the data did not record user intent, budget, or current need, a complete-looking formula can still produce a fragile causal interpretation.

## How Sources Are Used

- Official past-paper PDFs are used only for years, subject names, and problem statements; two years of questions are not treated as the full future scope.
- The grad-exam-prep pages are used for study-route, question-index, and practice-flow alignment, not as official solutions.
- OpenIntro, OpenStax, and other open textbooks are used to verify formulas, definitions, assumptions, and common derivations.
- Stanford CS109 and scikit-learn documentation are used to connect each topic to ML/AI training, evaluation, experiments, and uncertainty reporting.

## Problem Recognition Hints

- When the problem mentions propensity score, write `e(X)=P(T=1|X)`.
- When the problem asks about matching, focus on finding similar controls and checking balance.
- When the problem asks about weighting, focus on weight formulas, extreme weights, and overlap.
- Do not describe matching as removing all bias. It mainly handles observed confounders.

## Common Mistakes

- Estimating treatment effect without first checking covariate balance.
- Treating the propensity score as an outcome model; it predicts treatment assignment, not the outcome.
- Ignoring overlap. If some backgrounds appear almost only in the treatment group, the data lack a suitable comparison group.
- Thinking that weighted sample size means more real information. Weights change representation and can also amplify noise.
- Forgetting unobserved confounding. Important differences that were not recorded cannot be repaired automatically by the formula.

## Practice

1. In one sentence, explain what a propensity score predicts.
2. If `e(X)=0.2` and the person actually receives treatment, what is the IPW treated weight? What does it mean intuitively?
3. If `e(X)=0.95` and the person is in control, what is the control weight? What risk does this create?
4. Write the basic matching workflow, including propensity estimation, matching, balance checking, and effect estimation.
5. In recommender-system logged data, why does the old policy's exposure probability affect offline evaluation of a new policy?

## What Comes Next

Matching and weighting both handle how the data were generated. The next post moves to time series, where the constraint changes: the data have order, so observations cannot be treated as a bag to shuffle randomly.

## Section-Level Source Map

- OpenIntro and OpenStax support the basics of observational data, comparison groups, confounders, and experimental design.
- Stanford CS109 supports conditional-probability, selection-mechanism, and reweighting intuition.
- scikit-learn evaluation documentation supports the language of ML evaluation workflows; this post uses logged data to distinguish ordinary validation from counterfactual evaluation.
- This post connects matching and weighting to recommenders, ads, and policy evaluation.

## References

- [Matching, weighting, propensity scores, observed confounders, and observational studies: OpenIntro Statistics](https://www.openintro.org/book/os/)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
