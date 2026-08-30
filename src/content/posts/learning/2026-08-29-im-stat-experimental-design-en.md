---
title: "How Does Experimental Design Make Results Interpretable Rather Than Merely Correlated?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 43
tldr: "Experimental design decides whether a result can be interpreted. Randomization, control, blocking, replication, blinding, and pre-specified outcomes give inference a usable foundation."
description: "Statistics from Exams to ML/AI, post 43: treatment, control, experimental units, randomization, blocking, replication, blinding, and ML/AI evaluations."
draft: false
---

> [中文版](/posts/learning/2026-08-29-im-stat-experimental-design)

Many statistical mistakes are planted before the data are collected. If grouping is unfair, the experimental unit is unclear, the primary metric is chosen after the result, or confounders are not controlled, even a clean p-value cannot rescue the conclusion.

Experimental design asks whether a result can be interpreted. Exams often ask about randomization, control, blocking, replication, and blinding. ML/AI work asks whether an offline benchmark, online experiment, or human evaluation can support a launch decision.

## Treatment, Control, and Experimental Unit

Start with three roles.

The treatment is the change you want to test: a new recommendation model, ranking rule, copy change, or teaching method.

The control is the comparison condition: the old model, current workflow, placebo, or existing version.

The experimental unit is the unit that gets randomly assigned. It might be a user, class, transaction, task, session, store, or item. This unit must be defined before analysis because standard errors and tests depend on it.

If users are randomized, you cannot later treat 100 clicks from the same user as 100 fully independent samples. That inflates the effective sample size.

## Randomization Creates Comparability First

The goal of randomization is to make treatment and control groups roughly comparable across known and unknown confounders. It does not guarantee perfect balance in every experiment, but it makes the comparison less dominated by selection bias.

If the new model runs only on weekend traffic and the old model runs only on weekday traffic, the observed difference may be a model effect, or it may be a weekend behavior effect. Careful analysis after the fact will still struggle to separate them.

A better design randomizes the same eligible population during the same time window. Then the treatment-control difference has a better chance of being interpreted as the effect of the change.

## Blocking, Replication, Blinding, and Pre-Specification

Blocking handles known differences. If new users and returning users behave very differently, you can stratify by user type first and randomize within each block. This reduces the chance that one group happens to contain many more new users.

Replication means having enough repeated observations to estimate uncertainty. Comparing one class against one class or one day against one day often cannot separate a treatment effect from ordinary noise.

Blinding reduces the chance that behavior or scoring changes because people know the assignment. Human evaluation needs this especially. If raters know which answer came from the new model, expectations may affect scores.

Pre-specified outcomes define the primary metric before results are seen. Choosing the best-looking metric afterward breaks the usual interpretation of error rates.

## Worked Example: Bad Grouping Makes Effects Unreadable

Suppose you compare two recommendation models.

Bad design:

```text
A model: weekday traffic
B model: weekend traffic
```

If B has a higher click-through rate, you cannot directly say B is better. Weekend traffic may have different users, browsing time, and purchase intent.

A better design:

```text
eligible users in the same period
randomly assign 50% to A, 50% to B
primary metric: click-through rate
guardrail metric: complaint rate or latency
```

This first handles comparability across time and population. Then analysis can estimate:

```text
treatment effect = CTR_B - CTR_A
```

If A has CTR of 10.0% and B has CTR of 10.8%, the difference is 0.8 percentage points. The next step is a confidence interval or test, plus guardrail checks. If clicks rise but latency worsens or complaints increase, the product decision may still be no launch.

## Analysis Must Match Design

Paired designs need paired analysis. If the same rater judges both model A and model B, or the same task receives answers from both models, the data are naturally paired. The analysis should preserve within-pair differences.

Stratified designs should preserve strata. If users were blocked by new versus returning user, the analysis should inspect effects within those strata instead of blindly pooling everything.

Cluster designs need cluster-aware uncertainty. If classes, not students, were randomized, the standard error cannot pretend every student is fully independent.

Design determines analysis. Analysis should not reshape the data afterward just because another formula is easier.

## Where This Shows Up in ML/AI

Offline benchmarks are candidate evidence. They can quickly eliminate weak models, but they do not automatically predict online product impact.

Online A/B tests are closer to product outcomes. A new model may improve offline accuracy and still fail online because latency rises, the user distribution differs, the interface changes behavior, or errors concentrate in high-value segments.

Human evaluation is also experimental design. You need a scoring rubric, blinding, task sampling, rater agreement, and a primary outcome. If raters know the model source, or tasks are chosen from a domain the model already handles well, the result cannot support a broad claim.

LLM agent evaluation also needs a clear experimental unit. A task may contain many turns, tool calls, and retries. Decide whether the unit is task, conversation, tool call, or user session before counting samples.

## How to Recognize the Problem

When you see treatment and control, ask whether the groups are comparable.

When you see randomization, explain how it reduces selection bias.

When you see blocking, explain how it controls known differences.

When you see replication, explain how it allows variance and uncertainty to be estimated.

When you see paired, stratified, or cluster design, mention that analysis must preserve the design structure.

When the primary metric is chosen after results are known, point out multiple testing or p-hacking risk.

## Common Mistakes

- Looking only at the p-value while ignoring whether grouping was fair.
- Failing to define the experimental unit, then analyzing events as if they were users.
- Using blocking in design but pooling strata away in analysis.
- Treating paired data as independent samples.
- Choosing the primary metric after seeing results.
- Claiming that a better offline benchmark guarantees a better online product result.

## Practice

1. Explain what randomization, control, blocking, and replication each solve.
2. If an A/B test has no random assignment, what kind of factor is most likely to contaminate the result?
3. Design an online recommendation-system experiment: state the treatment, control, primary metric, and one guardrail metric.
4. If the same rater evaluates both model A and model B answers, why should the analysis preserve the paired design?
5. Why does better offline ML benchmark performance not necessarily imply better online product performance?

## What Comes Next

Experimental design decides whether data can be interpreted. The next post puts the same logic into product work: how A/B testing moves from random assignment, primary metrics, sample size, and uncertainty to launch decisions.

## Section-Level Source Map

- OpenIntro and OpenStax support experimental design, random assignment, control groups, and causal interpretation.
- Stanford CS109 supports the shared language for statistical inference and experimental data interpretation.
- scikit-learn Model Evaluation supports offline metric contexts; this post connects that layer to online experiments and distinguishes the evidence levels.

## References

- [Experimental design, randomization, control, blocking, replication, blinding, and pre-specified outcomes: OpenIntro Statistics](https://www.openintro.org/book/os/)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
