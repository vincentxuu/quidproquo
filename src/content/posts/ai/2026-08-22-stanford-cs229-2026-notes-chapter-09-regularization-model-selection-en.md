---
title: "Regularization and Model Selection: Explicit, Implicit, and Cross-Validated"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, regularization, cross-validation, bayesian-statistics]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 10
tldr: "Chapter 9 presents three controls on generalization: explicit complexity penalties, optimizer-induced implicit regularization, and model selection on data excluded from training. MAP estimation then connects a Gaussian prior to an L2 penalty."
description: "A reading of Chapter 9 in the 2026 CS229 notes: L1 and L2 regularization, weight decay, implicit bias, hold-out and k-fold cross-validation, and Bayesian MAP estimation."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-09-regularization-model-selection)

**Video status: Related supplementary video included; the original lecture recording has not been verified.** [Source details](#course-video-sources)

This is a chapter-by-chapter reading of Chapter 9, printed pages 137–145, in the 2026 [CS229 Lecture Notes](https://cs229.stanford.edu/main_notes.pdf). It follows the official notes and is **not a reconstruction of any quarter's recordings**. The organizing question is how to control effective complexity through explicit penalties, optimization dynamics, validation, and Bayesian priors.

Chapter 8 diagnosed variance as a threat to generalization, but using fewer parameters is not the only remedy. Complexity may mean parameter norm, sparsity, smoothness, or even which one of many global minima an optimizer prefers.

## Course video sources

This article follows the 2026 main notes chapter by chapter, and chapter numbers are not lecture numbers. The video(s) below come from Stanford Online's public CS229 Spring 2026 recordings; their titles match this chapter's topic, but they are related supplements, not a line-by-line source for this chapter, and the original lecture recording for the chapter has not been verified. The official CS229 page currently shows Summer 2026 and sends recordings and materials to a Stanford sign-in Canvas site, so only the public YouTube playlists are used here.

```youtube
url: https://www.youtube.com/watch?v=llnEgyyuYkQ
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 6: Dataset Split, ML Advice
```

Original videos: [Stanford CS229 Machine Learning | Spring 2026 | Lecture 6: Dataset Split, ML Advice](https://www.youtube.com/watch?v=llnEgyyuYkQ)

Course and recording entries:

- [Stanford CS229 Machine Learning, Spring 2026 playlist (Stanford Online, 17 videos)](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [Stanford CS229: Machine Learning led by Andrew Ng, Autumn 2018 playlist (21 videos)](https://www.youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU)
- [Official course / lecture source](https://cs229.stanford.edu/)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): what was checked is how the video topic relates to this chapter. This is Spring 2026 Lecture 6 (about 78 minutes); the transcript runs through overfitting and underfitting, the bias-variance decomposition, regularization (L2, L1 and norm penalties, roughly 50 to 75%), the Bayesian view that "regularization encodes prior knowledge" (a single sentence, around 55%), double descent, and only around 90% train/dev/test splits, k-fold cross-validation and hyperband. It fits this chapter's topic broadly. Implicit regularization appears only as a few sentences about the optimizer's implicit bias after double descent, and the MAP derivation and its equivalence with weight decay are never worked through, so those two sections rest mainly on the notes.

## Explicit regularization trades off two objectives

The regularized objective is

$$
J_\lambda(\theta)=J(\theta)+\lambda R(\theta).
$$

$J$ rewards fit to the data, $R$ charges for a chosen kind of complexity, and $\lambda$ sets the balance. At $\lambda=0$ there is no additional preference. If $\lambda$ is too large, the penalty can force the model into a high-bias regime. Regularization is therefore not a guarantee of improvement; it encodes which solutions we prefer.

The standard $L_2$ choice uses $R(\theta)=\frac12\|\theta\|_2^2$. A gradient step then includes the shrinkage factor $(1-\eta\lambda)\theta$, which motivates the term weight decay. The $L_1$ penalty $\|\theta\|_1$ is a continuous surrogate for the discontinuous number of nonzero parameters, encouraging sparsity. But a strong sparsity prior raises bias when no sparse predictor works. The notes also explain why kernels usually pair more naturally with $L_2$: an $L_1$ optimum need not be expressible only through feature inner products.

## Implicit regularization comes from how optimization selects a solution

In a classical problem with a unique global minimum, sensible optimizers have little room to disagree. Overparameterized models often have many solutions with nearly identical training loss and very different test performance. Initialization, learning rate, batch size, and momentum can change which solution training reaches. This preference is called implicit bias or algorithmic regularization.

Near-zero training error therefore does not mean optimizer choices no longer matter. An optimizer decides both whether it can reduce $J$ and which zero-loss solution it finds. The notes list larger initial learning rates, smaller initialization, smaller batches, and momentum as helpful clues in some settings, not universal rules. The hypothesis that stochasticity favors flatter minima and that flatter minima generalize better remains context-dependent rather than a general theorem.

## Cross-validation makes models compete on unseen data

Selecting polynomial degree by training error almost always favors the highest degree because the same observations are used to fit and score the model. Hold-out cross-validation separates those roles: fit every candidate on a training split, then choose by error on a validation split that the candidate did not see during fitting.

When data are scarce, k-fold cross-validation partitions the sample into $k$ subsets. Each candidate trains $k$ times, holding out a different fold each time, and is scored by the average held-out error. The selected model is then retrained on all data. Leave-one-out is the extreme $k=n$ case. It uses nearly all observations for each fit but costs more and is not automatically the lowest-variance estimate.

The validation set belongs to model selection. If we repeatedly inspect the test set and tune hyperparameters in response, we indirectly overfit the test set. That separation is more important than treating five versus ten folds as a universal choice.

## MAP turns a prior into a penalty

Frequentist estimation treats $\theta$ as an unknown constant. A Bayesian model places a prior $p(\theta)$ over it and updates to $p(\theta\mid S)$. Fully Bayesian prediction integrates over that posterior, which is often computationally intractable in high dimensions. MAP replaces the posterior with its mode:

$$
\theta_{MAP}=\arg\max_\theta p(S\mid\theta)p(\theta).
$$

After taking negative logarithms, the likelihood becomes the data-fitting loss and the prior becomes a regularizer. An isotropic zero-mean Gaussian prior yields an $L_2$-shaped penalty. This gives regularization a probabilistic interpretation, but MAP remains a point estimate and discards posterior uncertainty.

## Limits and the transition to unsupervised learning

A penalty helps only when its inductive preference suits the problem. Cross-validation assumes that the split represents future data; time series and grouped observations require structure-aware splits. Implicit regularization also changes with architecture and training dynamics.

This chapter turns Chapter 8's diagnosis into practical controls. Chapter 10 begins unsupervised learning with k-means, whose pattern—each alternating step improves an objective without ensuring the global optimum—returns in Chapter 11's treatment of EM.

## Self-study exercise

Fit polynomial regressions across a grid of $L_2$ strengths. Train on one split, choose $\lambda$ only on validation data, and inspect the test set once. Then deliberately choose $\lambda$ by training error and compare test performance. The contrast makes the separation between parameter fitting and model selection concrete.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Found a public CS229 playlist with matching topics (Spring 2026 and/or the older Autumn 2018) and embedded 1 related supplementary video(s).
- 2026-10-10: Checked the video content against its transcript. The video topic broadly matches the chapter; implicit regularization and MAP get only a sentence or two in the video and rest mainly on the notes.

## References

- [CS229 Lecture Notes (2026), Chapter 9.1: L1, L2, and weight decay](https://cs229.stanford.edu/main_notes.pdf#page=138)
- [CS229 Lecture Notes (2026), Chapter 9.2: Implicit regularization](https://cs229.stanford.edu/main_notes.pdf#page=140)
- [CS229 Lecture Notes (2026), Chapters 9.3–9.4: Cross-validation and Bayesian MAP](https://cs229.stanford.edu/main_notes.pdf#page=142)
