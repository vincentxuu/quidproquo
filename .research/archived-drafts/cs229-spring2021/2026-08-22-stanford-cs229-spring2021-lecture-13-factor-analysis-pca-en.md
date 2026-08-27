---
title: "Stanford CS229 Lecture 13: Finding Low-Dimensional Structure with Factor Analysis and PCA"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, stanford, factor-analysis, pca]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 14
tldr: "Factor Analysis models observations as low-dimensional latent factors plus Gaussian noise. PCA directly finds orthogonal directions with maximum projected variance. Both reduce dimension, but one is a probabilistic generative model and the other a geometric optimization."
description: "A reading of Stanford CS229 Spring 2021 Lecture 13: the latent-variable model behind Factor Analysis, EM estimation, PCA as projection, and the limits of both methods."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-spring2021-lecture-13-factor-analysis-pca)

This is post 14 in [Reading Stanford CS229](/en/series/stanford-cs229), covering **Stanford CS229, Spring 2021, Lecture 13**. The syllabus dates it May 10, 2021 and gives the official title **Factor Analysis and PCA**. This article uses the Spring 2021 live lecture notes and the syllabus-linked PCA notes for the derivation. The syllabus also lists ICA notes, but ICA is not treated here as the lecture's main topic. The Canvas recording was not used.

The lecture gives two answers to one question: although data may have many coordinates, could most of its variation be controlled by only a few directions? Factor Analysis answers with a generative model; PCA answers with projection geometry. They both produce compact representations, but they optimize different things.

## Factor Analysis starts with a data-generating story

Let the observation be `x ∈ R^d` and the latent variable be `z ∈ R^k`, with `k` much smaller than `d`:

```text
z ~ N(0, I)
x = μ + Λz + ε
ε ~ N(0, Ψ)
```

`Λ` maps low-dimensional factors into observation space. `Ψ` is diagonal noise covariance. Shared variation is carried by `Λz`; independent coordinate-level variation remains in `ε`.

After marginalizing the latent variable, the observation is still Gaussian:

```text
x ~ N(μ, ΛΛᵀ + Ψ)
```

The equation exposes the model's structural assumption. Rather than fitting an arbitrary covariance matrix, Factor Analysis represents it as low-rank shared structure plus diagonal noise. That reduces parameters in high dimensions, at the cost of assuming this decomposition is appropriate.

## Why EM returns

If every `z` were observed, estimating `Λ` and the noise would be much easier. The missing latent variables create the same obstacle seen earlier in Gaussian mixture models, so the lecture returns to EM:

- E-step: under the current parameters, compute `p(z | x)`, including `E[z | x]` and `E[zzᵀ | x]`.
- M-step: treat those conditional moments as sufficient statistics and update `μ`, `Λ`, and `Ψ`.

Gaussian marginalization and conditioning stay Gaussian, which gives the E-step a closed form. That closure is the substantive reason EM is tractable here.

The usual limits remain. EM does not promise a global maximum, and rotating the latent space can yield equivalent explanations. An individual factor is therefore not automatically unique or semantically interpretable.

## PCA asks which projection preserves the most variation

PCA does not begin with a probabilistic data-generating process. After centering the data, it finds a unit vector `u` that maximizes squared projected length:

```text
maximize   Σᵢ (uᵀx⁽ⁱ⁾)²
subject to ||u||₂ = 1
```

Equivalently, it minimizes squared residual distance from the data to the projected line. If `Σ̂` is the sample covariance, the objective becomes `uᵀΣ̂u`, and its maximizer is the eigenvector associated with the largest eigenvalue. Keeping `k` dimensions means taking the top `k` mutually orthogonal eigenvectors.

The intuition follows the formula. `uᵀx` is the coordinate of a point along one direction; summing its square measures how much variation that direction carries. PCA finds a linear subspace with high variance and low reconstruction error, not directions guaranteed to have causal meaning.

## The same output shape does not mean the same question

Factor Analysis asks which latent factors and coordinate noise could plausibly generate the observations. PCA asks which linear projection retains the greatest squared variation. Factor Analysis explicitly separates shared structure from coordinate-specific noise; PCA puts all variation into a geometric objective.

Their boundaries matter:

- Both describe linear low-dimensional structure and do not automatically unfold curved manifolds.
- PCA is sensitive to scale, so standardization may matter in addition to centering.
- High explained variance does not guarantee value for a downstream prediction task.
- If Factor Analysis's diagonal-noise assumption is wrong, its factors may absorb correlated error.

## Where Lecture 13 sits in the eighteen-lecture path

Lectures 11 and 12 moved from Gaussian mixtures and EM into Factor Analysis. Lecture 13 completes that line and uses PCA to connect latent-variable thinking to linear algebra. Lectures 14 and 15 then move from compressing `x` to a different question: where learning signals come from when labels are scarce.

A useful check is to apply both views to the same centered dataset. Draw the first principal component, then write a Factor Analysis model with diagonal `Ψ`. Ask what the first method maximizes and which variation the second explicitly calls noise. Those answers distinguish the models more reliably than memorizing two dimensionality-reduction APIs.

## Beyond the lecture

The notes suggest selecting a PCA dimension by retained explained variance. That measures compression, not universal model quality. In practice, evaluate representations with several values of `k` on the actual downstream task as well.

## References

- [Stanford CS229 Spring 2021 syllabus](https://cs229.stanford.edu/syllabus-spring2021.html)
- [Lecture 13 live lecture notes](https://cs229.stanford.edu/notes2021spring/notes2021spring/lecture13_draft.pdf)
- [Principal Components Analysis notes](https://cs229.stanford.edu/notes2020spring/cs229-notes10.pdf)
