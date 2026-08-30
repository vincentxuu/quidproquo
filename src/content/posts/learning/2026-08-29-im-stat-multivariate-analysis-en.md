---
title: "How Does Multivariate Analysis Organize Features That Move Together?"
date: 2026-08-29
category: learning
type: guide
tags: [statistics, machine-learning, exam-prep, ntu-im]
lang: en
series:
  name: "Statistics from Exams to ML/AI"
  order: 48
tldr: "Multivariate analysis looks at features together. Covariance, correlation, and PCA reveal shared directions that univariate summaries miss."
description: "Statistics from Exams to ML/AI, post 48: covariance matrices, correlation, PCA, eigenvalues, dimensionality reduction, embeddings, and ML diagnostics."
draft: false
---

> [中文版](/posts/learning/2026-08-29-im-stat-multivariate-analysis)

Earlier posts covered means, variances, correlations, and regression. Those tools often examine variables one at a time. Multivariate analysis handles a different situation: there are many features, and they move together.

This post connects covariance matrices, correlation matrices, and PCA. Exams may ask how to interpret matrix entries, what principal component directions mean, or how eigenvalues are read. ML/AI uses the same intuition in embeddings, dimensionality-reduction plots, feature compression, and data-quality checks.

## What Problem This Solves

Univariate summaries tell you the mean and variance of each column. The structure of a dataset often lives between columns.

Suppose you have three features:

```text
x1: weekly login count
x2: weekly completed tasks
x3: weekly paid amount
```

If `x1` and `x2` are highly positively correlated, they may both describe activity. If `x3` is less correlated with the first two, it may describe another direction, such as ability or willingness to pay.

The first multivariate question is: are these features each providing separate information, or are they repeating the same direction?

## Core Intuition

A covariance matrix organizes the co-movement of every pair of variables. If two variables are high together and low together, covariance is positive. If one tends to be high when the other is low, covariance is negative. If there is no clear linear relationship, covariance is near 0.

For two variables, the covariance matrix is:

```text
[ Var(X1)      Cov(X1, X2) ]
[ Cov(X2, X1)  Var(X2)    ]
```

The diagonal entries are the variances of individual variables. The off-diagonal entries are covariances between variables.

PCA then asks: instead of viewing the data along the original `X1` and `X2` axes, what if we rotate to new directions? Which direction captures the most variation?

The first principal component is the direction of maximum variance. The second principal component is perpendicular to the first and captures the most remaining variance. That is the basic idea of dimensionality reduction: keep the main directions of movement and discard smaller directions.

## Formula and Mechanism

Sample covariance is:

```text
Cov(X, Y) = sum((x_i - x_bar)(y_i - y_bar)) / (n - 1)
```

Correlation standardizes covariance:

```text
Corr(X, Y) = Cov(X, Y) / (s_X s_Y)
```

Correlation has no units and lies between -1 and 1, which makes it easier to compare variables with different scales.

PCA usually starts from centered data or a covariance matrix and finds eigenvectors and eigenvalues:

```text
covariance matrix -> eigenvectors -> principal component directions
covariance matrix -> eigenvalues  -> variance explained by each direction
```

An eigenvector is a new direction. An eigenvalue is the amount of variance along that direction.

If the first eigenvalue takes up a large share of total eigenvalues, most variation is explained by the first principal component:

```text
explained variance ratio = lambda_1 / (lambda_1 + lambda_2 + ... + lambda_p)
```

## Worked Example: Covariance and PCA Intuition

Compute covariance from a small example. Three students have statistics and programming scores:

| Student | Statistics X | Programming Y |
|---|---:|---:|
| A | 80 | 82 |
| B | 90 | 88 |
| C | 100 | 96 |

The means are:

```text
x_bar = (80 + 90 + 100) / 3 = 90
y_bar = (82 + 88 + 96) / 3 = 88.67
```

Deviation products:

```text
A: (80 - 90)(82 - 88.67) = (-10)(-6.67) = 66.7
B: (90 - 90)(88 - 88.67) = (0)(-0.67) = 0
C: (100 - 90)(96 - 88.67) = (10)(7.33) = 73.3
```

Sample covariance:

```text
Cov(X, Y) = (66.7 + 0 + 73.3) / (3 - 1) = 70
```

The positive covariance says students with higher statistics scores also tend to have higher programming scores.

If the two scores are highly positively correlated, the first principal component may be close to "overall academic performance." The second component may describe "statistics stronger than programming" or the reverse. PCA is not discovering causality. It is changing coordinates to describe variation more clearly.

Now suppose PCA gives two eigenvalues:

```text
lambda_1 = 9
lambda_2 = 1
```

The explained variance ratio of the first component is:

```text
9 / (9 + 1) = 0.90
```

This means 90% of the variation is concentrated in the first direction. If the goal is visualization or compression, keeping the first component may be useful. If an important minority signal lives in the second direction, discarding it can still be harmful.

## Where This Shows Up in ML/AI

Embeddings are high-dimensional vectors. A document, image, user, or product may be represented by tens, hundreds, or thousands of dimensions. You usually cannot interpret each dimension one by one, but you can inspect distances, directions, clusters, and projections.

PCA is an entry point into high-dimensional thinking, even though modern embedding analysis often uses t-SNE, UMAP, or model-specific representations. PCA teaches three habits:

- High-dimensional data can be projected onto a smaller number of directions.
- Projection preserves some information and discards some information.
- A dimensionality-reduction plot is a diagnostic tool, not proof of model quality.

In ML/AI work, multivariate analysis appears in:

- feature compression: reducing many correlated features into fewer directions.
- visualization: projecting embeddings into 2D or 3D to inspect clusters.
- leakage checks: detecting suspicious grouping when features are tightly tied to labels or sources.
- monitoring: comparing embedding distributions across time.
- retrieval: checking whether query and document vectors form reasonable neighborhoods.

Avoid over-reading the result. The first principal component captures the direction of largest variance. It is not necessarily the most important business direction or a causal direction.

## How Sources Are Used

- Official past-paper PDFs are used only for years, subject names, and problem statements; two years of questions are not treated as the full future scope.
- The grad-exam-prep pages are used for study-route, question-index, and practice-flow alignment, not as official solutions.
- OpenIntro, OpenStax, and other open textbooks are used to verify formulas, definitions, assumptions, and common derivations.
- Stanford CS109 and scikit-learn documentation are used to connect each topic to ML/AI training, evaluation, experiments, and uncertainty reporting.

## Problem Recognition Hints

- When a problem gives many variables, inspect covariance or correlation instead of only separate means.
- When a problem asks about PCA, mention centering, principal components, eigenvalues, and explained variance.
- When a problem asks about dimensionality reduction, discuss both compression and information loss.
- When a PCA result is interpreted as a cause, state that PCA describes directions of variation, not causality.

## Common Mistakes

- Discussing PCA without centering the data first.
- Confusing covariance and correlation. Covariance has units; correlation is standardized.
- Assuming that if the first principal component explains much variance, all other directions are unimportant.
- Treating clusters in a reduced plot as proof of classification performance without returning to test data or task metrics.
- Ignoring scaling; feature scale strongly affects covariance-based PCA.

## Practice

1. Write a 2x2 covariance matrix and explain what the diagonal and off-diagonal entries represent.
2. Compute covariance from three observations and decide whether two variables move together positively or negatively.
3. If `lambda_1=8` and `lambda_2=2`, what is the explained variance ratio of the first principal component?
4. Why is the first principal component not necessarily the most meaningful business direction?
5. Connect PCA to embeddings: what can a dimensionality-reduction plot help inspect, and what can it not prove?

## What Comes Next

Multivariate analysis compresses many features into more interpretable directions. The next post moves to missing data: when not every field in a dataset is observed, statistical inference and ML training take on new risks.

## Section-Level Source Map

- OpenIntro and OpenStax support correlation, covariance, matrix-style summaries, and the basics of multivariate data.
- Stanford CS109 supports vectors, features, matrix summaries, and ML data representation intuition.
- scikit-learn evaluation documentation supports the language of feature processing and evaluation workflows; this post extends that to embeddings and dimensionality-reduction diagnostics.
- This post connects PCA to feature compression, embedding visualization, distribution shift, and retrieval diagnostics.

## References

- [Multivariate analysis, covariance matrices, correlation, PCA, eigenvalues, and dimensionality reduction: OpenIntro Statistics](https://www.openintro.org/book/os/)
- [NTU Library Past Exam System: Institute of Information Management](https://exam.lib.ntu.edu.tw/graduate/term/195) (in Mandarin)
- [NTU IM statistics prep page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/subjects/im-stat) (in Mandarin)
- [NTU IM past-papers page](https://grad-exam-prep.vincent-xu-work.workers.dev/im/past-papers) (in Mandarin)
- [OpenIntro Statistics](https://www.openintro.org/book/os/)
- [OpenStax Introductory Statistics 2e](https://openstax.org/details/books/introductory-statistics-2e)
- [Stanford CS109](https://cs109.stanford.edu/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
