---
title: "Support Vector Machines: Margins, Duality, and SMO"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, stanford, machine-learning, svm, optimization]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 7
tldr: "Chapter 6 formalizes classification confidence as geometric margin, then builds an implementable SVM through Lagrange duality, kernels, and SMO."
description: "A guided reading of Chapter 6 of the 2026 Stanford CS229 notes: margins, SVM duality, soft margins, kernels, and SMO."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-06-support-vector-machines)

**Video status: Related supplementary video included; the original lecture recording has not been verified.** [Source details](#course-video-sources)

This article reads Chapter 6, “Support vector machines,” on printed pages 60–78 of the [2026 CS229 main notes](https://cs229.stanford.edu/main_notes.pdf). It is a **chapter-by-chapter reading of the 2026 notes**, not a reconstruction of any quarter's recordings.

## Course video sources

This article follows the 2026 main notes chapter by chapter, and chapter numbers are not lecture numbers. The video(s) below come from the older public CS229 Autumn 2018 recordings (Andrew Ng); their titles match this chapter's topic, but they are related supplements, not a line-by-line source for this chapter, and the original lecture recording for the chapter has not been verified. The official CS229 page currently shows Summer 2026 and sends recordings and materials to a Stanford sign-in Canvas site, so only the public YouTube playlists are used here.

```youtube
url: https://www.youtube.com/watch?v=lDwow4aOrtg
title: Lecture 6 - Support Vector Machines | Stanford CS229: Machine Learning Andrew Ng (Autumn 2018)
```

```youtube
url: https://www.youtube.com/watch?v=8NYoQiRANpg
title: Lecture 7 - Kernels | Stanford CS229: Machine Learning Andrew Ng (Autumn 2018)
```

Original videos: [Lecture 6 - Support Vector Machines | Stanford CS229: Machine Learning Andrew Ng (Autumn 2018)](https://www.youtube.com/watch?v=lDwow4aOrtg); [Lecture 7 - Kernels | Stanford CS229: Machine Learning Andrew Ng (Autumn 2018)](https://www.youtube.com/watch?v=8NYoQiRANpg)

Course and recording entries:

- [Stanford CS229 Machine Learning, Spring 2026 playlist (Stanford Online, 17 videos)](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [Stanford CS229: Machine Learning led by Andrew Ng, Autumn 2018 playlist (21 videos)](https://www.youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU)
- [Official course / lecture source](https://cs229.stanford.edu/)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): both transcripts were read, and what was checked is how the video topics relate to this chapter. For roughly its first two thirds, Lecture 6 (about 81 minutes) is still finishing Naive Bayes (Laplace smoothing, event models for text); it starts introducing SVMs after about 55% and reaches the functional and geometric margin and the optimal margin classifier at about 70%, ending with a preview of kernels. Lecture 7 (about 80 minutes) opens with the optimal margin classifier's optimization problem and the representer theorem, spends its body on kernels (see Chapter 5) and has the L1 soft-margin SVM near the end. Neither transcript covers the chapter's Lagrange duality derivation, KKT conditions or SMO (Lecture 6 never mentions Lagrange; neither mentions SMO), so those sections rest on the notes alone; together the videos match only the first half of the chapter (margins, the max-margin optimization) and the idea of soft margin.

## From correct classification to distance from the boundary

Two hyperplanes may classify every training point correctly while differing greatly in robustness. SVMs express that difference through margins. With \(y\in\{-1,1\}\) and score \(w^Tx+b\), an example's functional margin is

\[
\hat\gamma^{(i)}=y^{(i)}(w^Tx^{(i)}+b).
\]

A positive value means correct classification, and a larger value appears more confident. Yet multiplying both \(w\) and \(b\) by ten leaves the boundary unchanged while multiplying the functional margin by ten.

Dividing by \(\|w\|\) gives the geometric margin, which is invariant to common rescaling and corresponds to signed distance from the hyperplane. The dataset margin is the minimum over examples, so maximizing it protects the points nearest the boundary.

## Turning maximum margin into convex optimization

For linearly separable data, scaling freedom lets us set the smallest functional margin to one and solve

\[
\min_{w,b}\frac12\|w\|^2
\quad\text{s.t.}\quad
y^{(i)}(w^Tx^{(i)}+b)\ge1.
\]

This has a convex quadratic objective and linear constraints. Minimizing \(\|w\|\) maximizes geometric margin while eliminating the awkward normalization constraint.

## The dual opens the door to kernels

The notes introduce generalized Lagrangians, primal and dual problems, weak and strong duality, and KKT conditions. In the SVM dual, training data appear only through \(x^{(i)T}x^{(j)}\), so Chapter 5's kernel can replace every inner product.

The resulting weight vector is \(w=\sum_i\alpha_i y^{(i)}x^{(i)}\). Only examples with \(\alpha_i>0\) affect the boundary: the support vectors. The name is literal—the classifier is supported by points on or inside the margin rather than depending equally on every observation.

## Soft margins and the role of C

Real datasets are rarely perfectly separable. A soft-margin SVM introduces slack variables \(\xi_i\) and minimizes

\[
\min_{w,b,\xi}\frac12\|w\|^2+C\sum_i\xi_i
\quad\text{s.t.}\quad
y^{(i)}(w^Tx^{(i)}+b)\ge 1-\xi_i,\qquad \xi_i\ge0.
\]

A large \(C\) penalizes violations heavily and favors training fit; a small \(C\) tolerates more violations to obtain a wider margin. In the dual, the constraints become \(0\le\alpha_i\le C\).

## Why SMO updates two variables

Sequential minimal optimization updates two dual variables at a time. The equality constraint \(\sum_i\alpha_i y^{(i)}=0\) means changing only one variable would generally leave the feasible set. Once all other variables are fixed, the pair is tied by the equality, reducing the step to a one-dimensional quadratic problem whose solution is clipped to its feasible interval.

## Assumptions, limits, and the next chapter

Hard-margin SVM assumes separability. Soft margins are more practical but still require choosing \(C\), a kernel, and kernel hyperparameters. Kernel SVMs can struggle at large sample sizes because of Gram-matrix and quadratic-optimization costs, and calibrated probabilities are not a native output.

This chapter realizes Chapter 5's main kernel application and contrasts with Chapter 2: logistic regression optimizes likelihood and emits probabilities, while SVM optimizes margin. Chapter 7 moves to neural networks and learns nonlinear multilayer representations directly.

## Self-study exercise

On separable two-dimensional data, draw the maximum-margin line, both margin boundaries, and the support vectors. Add one outlier, fit soft-margin SVMs with three values of \(C\), and record how margin width, violations, and the number of support vectors change.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Found a public CS229 playlist with matching topics (Spring 2026 and/or the older Autumn 2018) and embedded 2 related supplementary video(s).
- 2026-10-10: Checked the video content against its transcript. The two videos cover only the margin and optimization part of this chapter (Lecture 6 is mostly Naive Bayes first); the duality derivation, KKT and SMO are not in either transcript and rest on the notes alone.

## References

- [CS229 Lecture Notes (2026-08-18), Chapter 6: Support vector machines](https://cs229.stanford.edu/main_notes.pdf)
- [John Platt, Sequential Minimal Optimization: A Fast Algorithm for Training Support Vector Machines](https://www.microsoft.com/en-us/research/publication/sequential-minimal-optimization-a-fast-algorithm-for-training-support-vector-machines/)
