---
title: "Why Not Run Many t-Tests? What Is ANOVA Protecting?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 13
tldr: "ANOVA first checks whether three or more group means differ overall, so you do not inflate false-positive risk by running many pairwise t tests."
description: "A beginner guide to ANOVA: multi-group mean comparison, between-group and within-group variation, the F statistic, and model or prompt experiments in ML/AI."
draft: false
---

> [中文版](/posts/learning/2026-08-29-im-stat-anova)

When there are three or more group means, the tempting move is to run a chain of pairwise t tests: A versus B, A versus C, B versus C. With three groups, that still feels manageable. With five groups, there are already ten pairwise comparisons.

Each test carries a Type I error risk. As the number of tests grows, the chance of making at least one false-positive claim grows too.

ANOVA starts with the overall question: can the population means of all groups be treated as equal? If the overall test does not find enough evidence of a difference, you should not rush to declare which two groups differ. If the overall test is significant, post-hoc comparisons can then ask which pairs differ while accounting for multiple-comparison risk.

## ANOVA Compares Two Kinds of Variation

The intuition behind ANOVA is simple. If group means are far apart while observations inside each group are tightly clustered, group membership may matter. If group means look different but observations within each group are already very spread out, the apparent difference may just be noise.

ANOVA decomposes total variation into two parts:

```text
total variation = between-group variation + within-group variation
```

Between-group variation measures how far each group mean is from the grand mean. Within-group variation measures how far each observation is from its own group mean.

The F statistic takes their ratio:

```text
F = MS_between / MS_within
```

`MS_between` is the between-group mean square. `MS_within` is the within-group mean square. A larger F value means the gap among group means is large relative to the noise inside groups.

The usual null hypothesis is:

```text
H0: mu1 = mu2 = mu3 = ... = muk
```

The alternative is not "every group is different." It is: at least one group mean is different.

## Worked Example: Three Version Scores

Suppose three model versions A, B, and C are evaluated on four batches each:

| Version | Scores |
| --- | --- |
| A | 8, 9, 7, 8 |
| B | 10, 11, 9, 10 |
| C | 6, 7, 5, 6 |

The group means are:

```text
A mean = 8
B mean = 10
C mean = 6
grand mean = 8
```

Compute the between-group sum of squares. Each group has 4 observations:

```text
SS_between = 4(8 - 8)^2 + 4(10 - 8)^2 + 4(6 - 8)^2
           = 0 + 16 + 16
           = 32
```

The between-group degrees of freedom are:

```text
df_between = k - 1 = 3 - 1 = 2
MS_between = 32 / 2 = 16
```

Now compute within-group variation. For group A, the squared deviations from mean 8 are `0 + 1 + 1 + 0 = 2`. Group B also gives 2. Group C also gives 2.

```text
SS_within = 2 + 2 + 2 = 6
df_within = N - k = 12 - 3 = 9
MS_within = 6 / 9 = 0.667
```

Then:

```text
F = 16 / 0.667 = 24
```

The next step is to use the F distribution or software to get the p-value. Here the F statistic is very large: the group means differ much more than the within-version fluctuation.

A good conclusion is:

The data provide statistical evidence that the three population mean scores are not all equal.

That statement still does not say whether B is significantly higher than A, or whether A is significantly higher than C. The overall ANOVA test answers whether at least one group mean differs. Pairwise claims require follow-up comparisons and multiple-comparison control.

## How to Recognize the Problem

When a question compares three or more means, think ANOVA first. Clues include treatment, group, between groups, within groups, F statistic, and ANOVA table.

If the outcome is categorical counts instead of numeric measurements, the problem usually belongs to chi-square rather than ANOVA. If there are only two group means, a two-sample t test is often more direct.

The tricky version is a question with three or more groups that later asks which groups differ. The sequence is: overall ANOVA first, then post-hoc comparisons if the overall test supports moving forward.

## Where This Shows Up in ML/AI

Multi-model comparison often has the same structure. Suppose you compare three embedding models, four prompt templates, or five reranker settings, and each version is evaluated across multiple batches or tasks. Picking the highest average can mistake evaluation noise for model quality.

ANOVA first asks whether there is an overall version effect. If the overall difference is clear, you can then compare which versions are worth keeping.

Prompt experiments are another example. You may test A/B/C prompt templates across several task batches. ANOVA forces you to separate version-to-version differences from task-level or batch-level noise.

Product experiments can use the same entry point when the outcome is numeric: three recommendation strategies, three ranking rules, or three onboarding flows measured by average session time or order value. If the same users see multiple versions, however, the design may become repeated measures rather than simple one-way ANOVA.

## Common Mistakes

Mistake 1: running many t tests for three or more groups without controlling the overall Type I error risk.

Mistake 2: saying "B is better than A" immediately after a significant ANOVA result. The overall test does not identify the pair by itself.

Mistake 3: forgetting that F is a ratio of between-group variation to within-group variation.

Mistake 4: applying ANOVA to categorical count data. That belongs to a different family of tests.

Mistake 5: selecting the best model only by the highest mean score without estimating experimental noise.

## Practice

1. Write `H0` and `H1` for a three-group mean comparison. Make sure `H1` does not list a specific pair.
2. Explain in words why a large F statistic pushes the test away from `H0`.
3. For three groups with 5 observations each, write `df_between` and `df_within`.
4. Design an experiment with three prompt templates and explain when post-hoc comparison is needed.

## Next

ANOVA compares several means, but it still relies on estimation and testing. The next post returns to a more basic question: when we use a sample-based rule to estimate a parameter, how do we judge whether that rule is good?

## Section-Level Source Map

- OpenIntro and OpenStax: ANOVA, F statistic, between-group variation, and within-group variation.
- Stanford CS109: multi-group comparison and decisions under uncertainty.
- scikit-learn: model evaluation contexts where several model versions are compared.
- NTU IM prep pages: topic placement and practice-flow alignment; not used as official solutions.

## References

- [ANOVA in OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e: F Distribution and ANOVA](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109: Probability for Computer Scientists](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation: Metrics and Scoring](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
