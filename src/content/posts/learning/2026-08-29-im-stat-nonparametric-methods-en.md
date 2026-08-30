---
title: "What Assumptions Do Nonparametric Methods Relax, and What Do They Cost?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 42
tldr: "Nonparametric methods are not assumption-free. They relax fixed distributional forms, often gaining flexibility while paying in efficiency, interpretation, or overfitting risk."
description: "Statistics from Exams to ML/AI, post 42: rank tests, permutation tests, empirical distributions, KDE, kNN, trees, and flexible ML baselines."
draft: true
---

> [中文版](/posts/learning/2026-08-29-im-stat-nonparametric-methods)

Many beginners hear "nonparametric methods" and think it means "methods with no parameters." That is too literal. A better reading is: the model or test does not first lock the data into a distribution described by a small fixed set of parameters.

For example, a t test often relies on means, variances, and normal approximations. A linear model specifies a linear relationship. Nonparametric methods usually make fewer assumptions about a specific distribution or functional form. They may use ranks, resampling, empirical distributions, nearby points, or tree splits instead.

## What Fewer Assumptions Buy

The benefit of nonparametric methods is flexibility. Rank-based methods are useful when data are skewed, outliers are strong, sample size is not large, or the question is about ordering rather than a strict normal-mean comparison.

The cost is also real. With fewer model assumptions, you often need more data to reach the same precision. Interpretation may depend more on the procedure. If the model is too flexible, it can overfit.

So nonparametric is not a fixed answer meaning "more advanced" or "more conservative." It shifts the tradeoff among assumptions, efficiency, interpretability, and generalization.

## What Rank-Based Tests Do

If you do not trust a normality assumption on raw values, you can compare ranks instead.

For a two-group comparison, a t test compares means. Wilcoxon rank-sum or Mann-Whitney style methods rank all observations together and ask whether one group tends to have systematically higher or lower ranks.

This is attractive when data are skewed or outliers are strong. Extreme values do not dominate through their raw magnitude; they become rank positions.

But a rank test does not answer exactly the same question as a two-sample t test on means. After using a rank test, do not over-explain the result in the language of mean differences.

## What Permutation Tests Do

A permutation test starts from the null hypothesis. If two groups truly have no difference, group labels should be exchangeable. You repeatedly shuffle labels, recompute the statistic, and build the distribution of differences that would appear under "no effect."

The workflow is:

```text
observed statistic
-> shuffle labels many times
-> recompute statistic each time
-> compare observed statistic with the permutation distribution
```

This method is intuitive, especially for understanding p-values. The p-value asks how often the null hypothesis would produce a statistic as extreme as the observed one.

## Worked Example: Compare Two Groups by Ranks

Suppose there are two small samples:

```text
A: 3, 4, 100
B: 5, 6, 7
```

If you compare means, A is pulled upward by 100:

```text
mean(A) = 107 / 3 approximately 35.7
mean(B) = 18 / 3 = 6
```

Now rank all six observations:

```text
3(A), 4(A), 5(B), 6(B), 7(B), 100(A)
```

The ranks are:

```text
A ranks: 1, 2, 6
B ranks: 3, 4, 5
```

The rank sums are:

```text
A: 1 + 2 + 6 = 9
B: 3 + 4 + 5 = 12
```

This example shows how rank-based methods react differently from mean-based methods. The value 100 does not control the result through its size; it only becomes the largest observation.

## Nonparametric in Modeling

In modeling, nonparametric often means model complexity can grow with the data rather than being limited to a small fixed parameter vector.

kNN is a direct example. It does not estimate a fixed set of coefficients first. It keeps the training data and predicts from nearby neighbors.

Decision trees have a related spirit. They build rules by splitting the data. A deeper tree can fit the data more closely, but it can also overfit.

Kernel density estimation builds a distribution shape by placing small smooth bumps around observations, rather than assuming the whole distribution is normal.

These methods are flexible, so they usually need validation, pruning, smoothing parameters, neighbor counts, or other complexity controls.

## How to Recognize the Problem

When the data are skewed, contain outliers, or have a small sample size, and the question hints that normality is not credible, think about rank-based tests.

When you see "shuffle labels," "randomly permute," or "exchangeability," the topic is usually a permutation test.

When you see empirical distribution, KDE, nearest neighbor, or tree, the model is using the data's own shape for estimation or prediction.

When you see nonparametric, do not write that there are no assumptions. The method relaxes specific distributional assumptions, but it may still require independence, exchangeability, smoothness, or enough data.

## Where This Shows Up in ML/AI

kNN, tree-based models, random forests, and kernel methods all carry a nonparametric or flexible-modeling flavor. They can capture nonlinearity, interactions, and local structure more flexibly than a linear model.

The flexibility is also the risk. If `k` in kNN is too small, the model can memorize training data. If a tree is too deep, it can turn noise into rules. If a kernel bandwidth is too small, the density estimate becomes jagged.

In LLM evaluation, permutation tests are useful for paired comparisons. If model A and model B answer the same set of tasks, you can randomly flip the sign of each paired difference to build the distribution of score differences under "no model difference." This respects the paired design better than pretending the model scores are independent.

## Common Mistakes

- Explaining nonparametric methods as having no parameters or no assumptions.
- Using a rank test and then over-interpreting the result as a mean difference.
- Running a permutation test without checking exchangeability.
- Assuming flexible models always generalize better.
- Using flexible ML models without validation-based complexity control.

## Practice

1. Explain why nonparametric does not mean parameter-free. Which fixed distributional or functional-form restrictions are being relaxed?
2. Compare histograms, kernel density estimates, and nearest-neighbor regression. How does each stay close to the data?
3. Rank `A: 3, 4, 100` and `B: 5, 6, 7`, then explain how the rank-based comparison reduces the effect of the extreme value.
4. What problems can nonparametric methods face when sample size is small?
5. In ML, why can kNN or tree-based models be viewed as flexible baselines? What generalization risks do they carry?

## What Comes Next

Nonparametric methods relax model assumptions, but they still depend on a reasonable data-generating setup. The next post moves to experimental design: before analysis begins, grouping, randomization, and outcome definitions already decide whether inference can be trusted.

## Section-Level Source Map

- OpenIntro and OpenStax support distributions, estimation, and data summaries, giving nonparametric methods a clear contrast class.
- Stanford CS109 supports understanding flexible models through data locality, sampling, and simulation.
- scikit-learn supports kNN, tree-based models, and model evaluation; this post connects nonparametric thinking to flexible baselines.

## References

- [Nonparametric methods, rank tests, permutation tests, KDE, kNN, and tree-based models: OpenIntro Statistics](https://www.openintro.org/book/os/)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
