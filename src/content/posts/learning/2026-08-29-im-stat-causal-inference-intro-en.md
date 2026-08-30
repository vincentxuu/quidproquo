---
title: "Causal Inference Basics: Why Prediction Accuracy Does Not Mean Real Effect"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 45
tldr: "Causal inference separates prediction from effect. A model can predict who will buy without proving that an intervention will make them buy."
description: "Statistics from Exams to ML/AI, post 45: causal inference, counterfactuals, treatment effects, confounders, randomized experiments, and ML/AI policy evaluation."
draft: true
---

> [中文版](/posts/learning/2026-08-29-im-stat-causal-inference-intro)

In A/B testing, the cleanest answer is randomization: split people into control and treatment, and the difference between groups can more plausibly be read as the effect of the change. Causal inference handles the harder situation. You do not have a perfect experiment. You have observational data, but you still want to ask whether something caused the outcome to change.

This post builds the entry map. Exams often ask about association, causation, confounders, and treatment effects. ML/AI work asks the same question in recommender systems, ads, education technology, and risk models: if a model predicts who will buy, churn, or pass, does that tell us who should receive an intervention?

## What Problem This Solves

Separate two questions first.

The prediction question asks: after seeing user data, can we predict whether the user will buy next week?

```text
P(Y = 1 | X)
```

The causal question asks: if this user receives a recommendation card, will the purchase probability change?

```text
Y(1) - Y(0)
```

`Y(1)` is the outcome under treatment. `Y(0)` is the outcome without treatment. The desired quantity is the difference for the same unit under two possible conditions.

The difficulty is that the same person at the same time can only follow one path. If you observe `Y(1)`, you do not observe that person's `Y(0)`. If you observe `Y(0)`, you do not observe that person's `Y(1)`. The missing outcome is the counterfactual.

## Core Intuition

Causal inference is about comparability. A complex model does not save the estimate if the compared groups were different from the start.

Suppose you want to know whether a recommendation module increases purchases. You compare people who saw recommendations with people who did not, and the first group has a higher purchase rate. That still does not prove the recommendation worked.

People who saw recommendations may already log in more often, browse more products, be closer to checkout, or be identified by the system as high intent. Those variables affect both treatment and outcome. They are confounders.

The first move is to name four roles:

```text
unit: the observed entity, such as a user, firm, class, or patient
treatment: the intervention, such as seeing a recommendation or receiving a coupon
outcome: the result, such as purchase, retention, score, or cost
confounder: a variable that affects both treatment and outcome
```

If these roles are unclear, later formulas usually only hide the confusion.

## Formula and Mechanism

A common target is the average treatment effect, or ATE:

```text
ATE = E[Y(1) - Y(0)]
```

If the treatment is a recommendation card and the outcome is purchase, ATE asks how much the recommendation card changes purchase on average.

Random experiments matter because random assignment makes treatment and control groups comparable in expectation. Age, activity, spending power, and prior preference should not systematically tilt toward one group. In that setting:

```text
E[Y(1) | T = 1] - E[Y(0) | T = 0]
```

is closer to the target:

```text
E[Y(1) - Y(0)]
```

Observational data do not have this guarantee. You need design, controls, matching, weighting, difference-in-differences, instrumental variables, or other assumptions to rebuild comparability. Each method has limits.

## Worked Example: The Confounded Recommendation Lift

Suppose a course platform adds a recommendation block.

| Group | Users | Purchases | Purchase rate |
|---|---:|---:|---:|
| Saw recommendation | 1,000 | 180 | 18% |
| Did not see recommendation | 1,000 | 100 | 10% |

The naive difference is:

```text
18% - 10% = 8 percentage points
```

That is not automatically the recommendation effect. Now add one background variable: logins last week. People who saw recommendations turn out to be much more active.

| Activity | Group | Users | Purchases | Purchase rate |
|---|---|---:|---:|---:|
| High activity | Saw recommendation | 800 | 160 | 20% |
| High activity | Did not see recommendation | 200 | 36 | 18% |
| Low activity | Saw recommendation | 200 | 20 | 10% |
| Low activity | Did not see recommendation | 800 | 64 | 8% |

Within high-activity users, the difference is:

```text
20% - 18% = 2 percentage points
```

Within low-activity users, the difference is:

```text
10% - 8% = 2 percentage points
```

After stratifying, the effect is closer to 2 percentage points. The naive 8-point gap mostly came from different activity mixes. That is the power of confounding: a large surface difference may shrink once groups become more comparable.

In an exam, do not rush to a test. Ask first: was treatment randomized? Are the groups comparable on important background variables? If not, does the problem provide stratification, matching, controls, or weights?

## Where This Shows Up in ML/AI

Recommender systems easily confuse prediction with causality.

A prediction model identifies who is likely to buy. A causal question asks whose purchase probability increases if the system intervenes. High-intent users may buy anyway, so showing them more prompts may waste exposure. Medium-intent users may have the largest treatment effect.

Advertising has the same issue. A model may predict who will click, but the platform wants incremental lift: how much extra action did the ad cause? Without causal design, ads can look effective because they were shown to people who would have bought anyway.

In AI product evaluation, causal questions appear in:

- recommenders: whether recommendations increase purchases, study time, or retention.
- LLM feature rollouts: whether a new summarization feature reduces support workload.
- education AI: whether hints or personalized practice improve test scores.
- policy evaluation: whether a new policy would outperform the old policy.
- fairness analysis: whether an intervention actually reduces a group gap.

Learning causal inference is not permission to force every observational dataset into a causal claim. It teaches when that interpretation is not supported and what design layer is missing.

## How Sources Are Used

- Official past-paper PDFs are used only for years, subject names, and problem statements; two years of questions are not treated as the full future scope.
- The grad-exam-prep pages are used for study-route, question-index, and practice-flow alignment, not as official solutions.
- OpenIntro, OpenStax, and other open textbooks are used to verify formulas, definitions, assumptions, and common derivations.
- Stanford CS109 and scikit-learn documentation are used to connect each topic to ML/AI training, evaluation, experiments, and uncertainty reporting.

## Problem Recognition Hints

- When you see cause, effect, impact, or intervention, identify treatment, outcome, and unit first.
- If the problem gives only correlation or a regression coefficient, check whether random assignment or confounding control exists.
- If the question asks about effect, do not answer only with predictive accuracy; explain how the comparison group is constructed.
- If the setting is observational, state the possible confounders and limitations.

## Common Mistakes

- Interpreting "users used the feature and had better outcomes" as proof that the feature caused the outcome.
- Forgetting that the same unit cannot reveal both `Y(1)` and `Y(0)` at the same time.
- Controlling only easy-to-measure variables while ignoring important unobserved confounders.
- Treating predictive accuracy as evidence of causal effect.
- Assuming causal inference is irrelevant because it did not appear in two years of past papers.

## Practice

1. A platform finds that users who receive coupons have a higher purchase rate. Identify treatment, outcome, unit, and at least two possible confounders.
2. Explain why `P(Y=1|T=1) - P(Y=1|T=0)` usually cannot be treated directly as ATE.
3. Using the recommendation example above, explain why the apparent effect drops from 8 percentage points to 2 after stratifying by activity.
4. In an LLM support product, agents who use a new summarization feature have shorter handling times. Name one possible reverse-causality or selection-bias explanation.
5. Write an exam-style answer: when can a randomized experiment support causal interpretation, and when must an observational study preserve caveats?

## What Comes Next

Causal inference shows that the bottleneck is comparability. The next post moves to matching and weighting: when perfect randomization is unavailable, how can statistics make treatment and control groups more similar on observed variables?

## Section-Level Source Map

- OpenIntro and OpenStax support the entry-level language of observational studies, experimental design, confounders, and causal interpretation.
- Stanford CS109 supports intuition about conditional probability, data-generating processes, and counterfactual comparison.
- scikit-learn evaluation documentation supports the boundary of predictive evaluation; this post uses it to contrast predictive modeling with causal questions.
- The ML/AI connection here is recommender systems, policy evaluation, feature rollout, and incremental lift.

## References

- [Causal inference, observational studies, confounding, treatment effects, and randomized experiments: OpenIntro Statistics](https://www.openintro.org/book/os/)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
