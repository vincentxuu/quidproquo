---
title: "Principal Components Analysis: Projection, Reconstruction, and Reduction"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, unsupervised-learning, pca, dimensionality-reduction]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 13
tldr: "Chapter 12 formulates PCA as geometric optimization: maximize projected variance along a unit direction to obtain the leading eigenvector of the covariance matrix. The top k eigenvectors give both maximum retained variance and minimum linear reconstruction error."
description: "A reading of Chapter 12 in the 2026 CS229 notes: centering and scaling, the Rayleigh quotient, principal eigenvectors, low-dimensional projection, reconstruction error, and limitations."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-12-principal-components-analysis)

**Video status: Related supplementary video included; the original lecture recording has not been verified.** [Source details](#course-video-sources)

This is a chapter-by-chapter reading of Chapter 12, printed pages 167–172, in the 2026 [CS229 Lecture Notes](https://cs229.stanford.edu/main_notes.pdf). It follows the official notes and is **not a reconstruction of any quarter's recordings**. Its single line of argument is how to find a linear subspace on which the data approximately lies.

PCA targets linear redundancy among coordinates. Recording the same speed in both miles and kilometers creates nearly duplicate attributes. More generally, if a point cloud lies mostly along a diagonal direction, much of its meaningful variation may fit on one intrinsic axis.

## Course video sources

This article follows the 2026 main notes chapter by chapter, and chapter numbers are not lecture numbers. The video(s) below come from public recordings from CS229 Spring 2026 and from the older Autumn 2018 course (Andrew Ng); their titles match this chapter's topic, but they are related supplements, not a line-by-line source for this chapter, and the original lecture recording for the chapter has not been verified. The official CS229 page currently shows Summer 2026 and sends recordings and materials to a Stanford sign-in Canvas site, so only the public YouTube playlists are used here.

```youtube
url: https://www.youtube.com/watch?v=sUS-eTa0l6s
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 10: GMM (EM), PCA
```

```youtube
url: https://www.youtube.com/watch?v=dyb_cFywuik
title: Lecture 15 - PCA and ICA | Stanford CS229: Machine Learning Andrew Ng - Autumn 2018
```

Original videos: [Stanford CS229 Machine Learning | Spring 2026 | Lecture 10: GMM (EM), PCA](https://www.youtube.com/watch?v=sUS-eTa0l6s); [Lecture 15 - PCA and ICA | Stanford CS229: Machine Learning Andrew Ng - Autumn 2018](https://www.youtube.com/watch?v=dyb_cFywuik)

Course and recording entries:

- [Stanford CS229 Machine Learning, Spring 2026 playlist (Stanford Online, 17 videos)](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [Stanford CS229: Machine Learning led by Andrew Ng, Autumn 2018 playlist (21 videos)](https://www.youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU)
- [Official course / lecture source](https://cs229.stanford.edu/)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): both transcripts were read, and what was checked is how the video topics relate to this chapter. In Spring 2026 Lecture 10 (about 80 minutes) the first 60% is EM and only from about 62% does it turn to PCA (the direction of maximum variance, eigenvectors of the covariance matrix, projection), so the relevant part is the last 40%. In Andrew Ng's Autumn 2018 Lecture 15 (about 79 minutes) roughly the first 80% is PCA: standardizing to zero mean and unit variance, projecting onto the principal axis, maximizing projected variance to get the principal eigenvector of the covariance matrix, dimensionality-reduction applications (a neuroscience example, among others); only the last 20% starts the ICA cocktail-party problem. Both match this chapter's topic; the Lecture 10 transcript never says "reconstruct", so reconstruction-error statements rest on the notes alone.

## Preprocessing defines what counts as large variation

The notes typically subtract each feature mean and divide by its empirical standard deviation:

$$
x_j^{(i)}\leftarrow\frac{x_j^{(i)}-\mu_j}{\sigma_j}.
$$

Centering places the data mean at the origin, so $\frac1n\sum_ix^{(i)}x^{(i)T}$ is the covariance matrix. Scaling makes unlike units comparable. Without it, a speed coordinate with values in the hundreds may dominate a seat-count coordinate with values near four.

Scaling is not mechanical. If all pixel coordinates already use a common scale, or physical amplitude itself carries meaning, unit variance may distort the intended geometry. PCA's answer is always relative to the coordinate system and scaling we choose.

## Maximum projected variance yields the leading eigenvector

For a unit vector $u$, the coordinate of $x^{(i)}$ along that direction is $u^Tx^{(i)}$. Preserving as much variation as possible means solving

$$
\max_{\|u\|_2=1}\frac1n\sum_i(u^Tx^{(i)})^2
=\max_{\|u\|_2=1}u^T\Sigma u,
\qquad
\Sigma=\frac1n\sum_ix^{(i)}x^{(i)T}.
$$

This Rayleigh quotient is maximized by the eigenvector of $\Sigma$ with the largest eigenvalue. The direction is not an unexplained best-fit line; under a unit-length constraint, it captures the greatest projected energy.

For a $k$-dimensional representation, take the top orthogonal eigenvectors $u_1,\ldots,u_k$ and compute

$$
y^{(i)}=[u_1^Tx^{(i)},\ldots,u_k^Tx^{(i)}]^T.
$$

This basis maximizes total retained projected variance. Equivalently, among all $k$-dimensional linear subspaces, it minimizes squared reconstruction error.

## What PCA preserves and what it discards

PCA supports compression, two- or three-dimensional visualization, dimensionality reduction before supervised learning, and noise reduction by discarding low-variance directions. The notes use eigenfaces as an example: project face images to a much smaller space, then compare low-dimensional representations in hopes of preserving systematic facial variation while suppressing small lighting changes.

The same design creates its limits. PCA only models linear subspaces and second-order variation, so it cannot unfold a curved manifold. High variance need not be task-relevant, and low variance need not be noise. Outliers strongly affect the mean and covariance. In a predictive pipeline, centering, scaling, and components must all be fitted on training data only; otherwise validation or test information leaks into the representation.

## Connections to adjacent chapters

Chapter 11 modeled data with probabilistic latent variables. PCA instead builds a deterministic orthogonal projection. Chapter 13 also changes basis, but ICA seeks statistically independent sources rather than maximum variance or orthogonal components. Sharing a linear transformation does not make their objectives interchangeable.

## Self-study exercise

Use a two-dimensional dataset whose features have very different numeric scales. Compute covariance, the leading eigenvector, and the fraction of variance explained after centering only; repeat after standardization. Plot both principal axes and explain how the definition of scale changes what PCA calls important.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Found a public CS229 playlist with matching topics (Spring 2026 and/or the older Autumn 2018) and embedded 2 related supplementary video(s).
- 2026-10-10: Checked the video content against its transcript. Both videos contain a PCA segment that matches the chapter; the first 60% of Lecture 10 is EM and the last 20% of Lecture 15 is the start of ICA, neither part of this chapter.

## References

- [CS229 Lecture Notes (2026), Chapter 12: PCA motivation and preprocessing](https://cs229.stanford.edu/main_notes.pdf#page=168)
- [CS229 Lecture Notes (2026), Chapter 12: Maximum projected variance and principal eigenvectors](https://cs229.stanford.edu/main_notes.pdf#page=170)
- [CS229 Lecture Notes (2026), Chapter 12: Reduction, reconstruction, and applications](https://cs229.stanford.edu/main_notes.pdf#page=172)
