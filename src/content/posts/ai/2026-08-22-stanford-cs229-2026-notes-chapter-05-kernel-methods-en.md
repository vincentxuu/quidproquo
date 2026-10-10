---
title: "Kernel Methods: Nonlinear Learning Without Explicit Features"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, stanford, machine-learning, kernel-methods, feature-maps]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 6
tldr: "Chapter 5 replaces high-dimensional feature inner products with kernels, letting inner-product-based linear algorithms learn nonlinear functions without constructing the features."
description: "A guided reading of Chapter 5 of the 2026 Stanford CS229 notes: feature maps, the kernel trick, Mercer conditions, and kernelized algorithms."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-05-kernel-methods)

**Video status: Related supplementary video included; the original lecture recording has not been verified.** [Source details](#course-video-sources)

This article reads Chapter 5, “Kernel methods,” on printed pages 49–59 of the [2026 CS229 main notes](https://cs229.stanford.edu/main_notes.pdf). It is a **chapter reading of the 2026 notes**, not a reconstruction of a quarter's recordings.

## Course video sources

This article follows the 2026 main notes chapter by chapter, and chapter numbers are not lecture numbers. The video(s) below come from the older public CS229 Autumn 2018 recordings (Andrew Ng); their titles match this chapter's topic, but they are related supplements, not a line-by-line source for this chapter, and the original lecture recording for the chapter has not been verified. The official CS229 page currently shows Summer 2026 and sends recordings and materials to a Stanford sign-in Canvas site, so only the public YouTube playlists are used here.

```youtube
url: https://www.youtube.com/watch?v=8NYoQiRANpg
title: Lecture 7 - Kernels | Stanford CS229: Machine Learning Andrew Ng (Autumn 2018)
```

Original videos: [Lecture 7 - Kernels | Stanford CS229: Machine Learning Andrew Ng (Autumn 2018)](https://www.youtube.com/watch?v=8NYoQiRANpg)

Course and recording entries:

- [Stanford CS229 Machine Learning, Spring 2026 playlist (Stanford Online, 17 videos)](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [Stanford CS229: Machine Learning led by Andrew Ng, Autumn 2018 playlist (21 videos)](https://www.youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU)
- [Official course / lecture source](https://cs229.stanford.edu/)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): what was checked is how the video topic relates to this chapter. This is Andrew Ng's Autumn 2018 Lecture 7 (about 80 minutes): it opens with the optimal margin classifier/SVM optimization problem and the representer theorem, then covers high-dimensional feature maps, the kernel trick, the kernel matrix (the transcript also calls it the Gram matrix), Mercer's theorem and positive semi-definiteness, polynomial and Gaussian kernels, which algorithms can be kernelized (linear regression, logistic regression, the perceptron) and closes with the L1 soft-margin SVM and MNIST. The topic matches this chapter, but it is the 2018 presentation, not a line-by-line source for the 2026 notes.

## Nonlinear in the input, linear in the parameters

When a linear model is too limited, one can first map the input through \(\phi(x)\) and learn \(\theta^T\phi(x)\). A scalar input might be expanded into polynomial features. The result is nonlinear in the original \(x\) but remains linear in \(\theta\), so algorithms such as LMS still apply.

The difficulty is that the feature space may be enormous or even infinite-dimensional. Explicitly constructing \(\phi(x)\) can make both storage and computation impractical.

## The algebra behind the kernel trick

The chapter rewrites the parameter vector as a combination of training features:

\[
\theta=\sum_i\beta_i\phi(x^{(i)}).
\]

Predictions then need only inner products \(\phi(x^{(i)})^T\phi(x)\). If a function

\[
K(x,z)=\phi(x)^T\phi(z)
\]

computes that value directly from raw inputs, the feature vectors never need to be constructed. Polynomial kernels correspond to polynomial expansions. The Gaussian kernel uses distance to control similarity and corresponds to an infinite-dimensional feature space.

Thinking of a kernel as a similarity is useful intuition: similar inputs receive larger values. It is not a sufficient definition, however. An arbitrary similarity-looking function need not be a valid kernel.

## Valid kernels and Gram matrices

For every finite set of inputs, the kernel matrix \(K_{ij}=K(x^{(i)},x^{(j)})\) must be symmetric and positive semidefinite. In the notes' finite-dimensional \(\mathbb R^d\) setting, the Mercer condition gives the necessary and sufficient characterization for a function to arise from a feature map.

Positive semidefiniteness is structural, not cosmetic. It means the pairwise values can consistently be interpreted as a Gram matrix in an inner-product space and preserves the geometry required by later optimization.

## Which algorithms can be kernelized?

An algorithm is a candidate when it can be written entirely in terms of inner products between examples. Chapter 5 demonstrates this with feature-based LMS; Chapter 6 applies the same substitution to the SVM dual. Kernelization is not a generic wrapper. The training and prediction computations must interact with features only through inner products.

## Hidden costs and chapter connections

The trick removes explicit high-dimensional features but not dependence on dataset size. It commonly requires an \(n\times n\) Gram matrix, and prediction may depend on many training examples. Kernel hyperparameters also control bias and variance: an excessively narrow Gaussian kernel can resemble memorization, while a very broad one can erase useful structure.

This chapter extends Chapter 1's “linear model over features” idea and prepares Chapter 6. The SVM dual depends only on inner products, so kernels turn its linear maximum-margin separator into a nonlinear classifier.

## Self-study exercise

For three two-dimensional points, explicitly construct second-degree polynomial features and calculate every inner product. Then compute the corresponding polynomial kernel directly and verify equality. Finally, compare Gram matrices from several Gaussian bandwidths and watch them move from nearly diagonal to nearly constant.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Found a public CS229 playlist with matching topics (Spring 2026 and/or the older Autumn 2018) and embedded 1 related supplementary video(s).
- 2026-10-10: Checked the video content against its transcript. The video (2018 Lecture 7) matches the chapter topic; its opening (SVM wrap-up) and ending (soft margin, MNIST) go beyond this chapter.

## References

- [CS229 Lecture Notes (2026-08-18), Chapter 5: Kernel methods](https://cs229.stanford.edu/main_notes.pdf)
- [Stanford CS229 course site](https://cs229.stanford.edu/)
