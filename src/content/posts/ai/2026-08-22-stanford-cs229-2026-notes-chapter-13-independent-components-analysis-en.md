---
title: "Independent Components Analysis: Recovering Independent Sources"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, unsupervised-learning, ica, source-separation]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 14
tldr: "Chapter 13 models ICA as x=As: observations are unknown linear mixtures, and the goal is to estimate W=A^{-1} to recover independent, non-Gaussian sources. A Jacobian determinant enters the transformed density and leads to the Bell–Sejnowski likelihood update."
description: "A reading of Chapter 13 in the 2026 CS229 notes: the cocktail-party problem, permutation and scaling ambiguities, non-Gaussianity, density transformations, and maximum-likelihood ICA."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-13-independent-components-analysis)

This is a chapter-by-chapter reading of Chapter 13, printed pages 173–178, in the 2026 [CS229 Lecture Notes](https://cs229.stanford.edu/main_notes.pdf). It follows the official notes and is **not a reconstruction of any quarter's recordings or schedule**. The chapter follows the cocktail-party problem: several microphones record different linear mixtures of simultaneous speakers; can the original voices be recovered from observations alone?

## From a mixing matrix to an unmixing matrix

ICA assumes

$$
x=As,
$$

where $s\in\mathbb R^d$ contains mutually independent sources, $A$ is an unknown invertible square mixing matrix, and $x$ is observed. Let $W=A^{-1}$; then source recovery is $s=Wx$. Row $w_j^T$ extracts source $j$ through $s_j=w_j^Tx$.

This resembles PCA because both change basis, but their objectives differ. PCA produces orthogonal directions ordered by variance. ICA seeks statistically independent output coordinates. PCA may whiten data before ICA, but it does not by itself separate independent sources.

## Two ambiguities are impossible to remove

First, source order is unidentifiable. Multiplying by a permutation matrix $P$ changes only the output order, so $PW$ is equally valid. Second, scale and sign are unidentifiable. Multiplying one column of $A$ by $\alpha$ while dividing the corresponding source by $\alpha$ leaves $x$ unchanged. ICA can recover sources only up to permutation and nonzero scaling.

For audio separation, order usually has no inherent meaning, scale mostly changes volume, and sign reversal sounds the same. These are properties of the model, not algorithmic defects; evaluation should not demand a unique answer that the observations cannot determine.

## Why the sources must be non-Gaussian

If $s\sim\mathcal N(0,I)$, its distribution is rotationally symmetric. For any orthogonal $R$, both $A$ and $AR$ produce Gaussian observations with covariance $AA^T$. The data cannot reveal which rotation generated them. Gaussian independent sources therefore have an additional continuous rotational ambiguity.

ICA goes beyond covariance by exploiting non-Gaussianity. The chapter's identifiability story depends on independent, non-Gaussian sources and enough data. Nearly Gaussian sources, convolutive or nonlinear mixing, or mismatched numbers of sources and sensors require extensions beyond this basic model.

## A density transformation needs the determinant

If $s$ has density $p_s$, $x=As$, and $W=A^{-1}$, it is incorrect to write only $p_x(x)=p_s(Wx)$. A linear map changes volume, so

$$
p_x(x)=p_s(Wx)|\det W|.
$$

$|\det W|$ is the Jacobian volume correction. The notes illustrate it in one dimension: if a uniform variable on $[0,1]$ is doubled, its support doubles in length and its density height must halve so total probability remains one.

## Independence yields a maximum-likelihood objective

If sources share marginal density $p_s$ and are independent,

$$
p(x)=\prod_{j=1}^d p_s(w_j^Tx)|\det W|.
$$

Without stronger prior knowledge, the notes choose the sigmoid $g(s)$ as a CDF and set $p_s(s)=g'(s)$. Differentiating the resulting log-likelihood gives the Bell–Sejnowski stochastic gradient update. Its two pieces have distinct roles: $1-2g(w_j^Tx)$ comes from the source-density model, while $(W^T)^{-1}$ comes from the log determinant and prevents the transformation from collapsing volume arbitrarily.

Choosing a sigmoid derivative is itself a source model, not a universal density for every non-Gaussian signal. Known source structure should replace it. The presentation also assumes centered observations. Time-series samples violate the stated independence assumption across $i$, although the notes say sufficient data can still make the method work; shuffling the SGD visitation order may improve convergence.

## Connections to adjacent chapters

Chapter 12 used covariance eigenvectors to find orthogonal directions of maximum variance. ICA adds independence and non-Gaussianity to pursue source separation. Chapter 14 shifts to generative modeling: instead of one fixed linear mixture, it learns a many-step reverse process that transforms Gaussian noise into a complex data distribution.

## Self-study exercise

Generate a sine wave and a square wave, standardize them, and mix them with an invertible $2\times2$ matrix. Compare a PCA rotation with ICA unmixing. When scoring recovered signals, allow permutation, scale, and sign changes; coordinate-wise error without alignment would incorrectly penalize ICA's unavoidable ambiguities.

## References

- [CS229 Lecture Notes (2026), Chapter 13: ICA and the cocktail-party problem](https://cs229.stanford.edu/main_notes.pdf#page=174)
- [CS229 Lecture Notes (2026), Chapters 13.1–13.2: Ambiguities and density transformations](https://cs229.stanford.edu/main_notes.pdf#page=175)
- [CS229 Lecture Notes (2026), Chapter 13.3: Maximum-likelihood ICA](https://cs229.stanford.edu/main_notes.pdf#page=177)
