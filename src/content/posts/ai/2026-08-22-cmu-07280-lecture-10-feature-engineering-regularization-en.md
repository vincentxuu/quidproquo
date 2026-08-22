---
title: "CMU 07-280 Lecture 10: Trading Expressiveness for Stability with Features and Regularization"
date: 2026-08-22
category: ai
tags: [cmu, ai-course, machine-learning, feature-engineering, regularization]
lang: en
series:
  name: "Reading CMU 07-280"
  order: 10
type: deep-dive
tldr: "Lecture 10 uses φ(x) to let linear models express nonlinear functions, then controls the resulting overfitting with train/validation/test separation, L1/L2 regularization, and model selection."
description: "A reading of CMU 07-280 Spring 2026 Lecture 10: feature transforms, polynomial models, overfitting, L1/L2 regularization, and data splits."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cmu-07280-lecture-10-feature-engineering-regularization)

Spring 2026 Lecture 10 is **Feature Engineering and Regularization**, dated February 12. Lecture 9's logistic model still draws a linear boundary in its input features. This lecture first expands what the model can represent, then immediately addresses the overfitting created by that expansion. There is no public lecture-by-lecture recording, and this article does not reconstruct spoken content.

## Official material and scope

This reading uses the [Feature Engineering & Logistic Regression pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Feature_Eng_and_Logistic_Reg.pdf), the official [Model Selection deck](https://www.cs.cmu.edu/~07280/lectures/model%20selection.pdf), the [Recitation 5 solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec5_sol.pdf), and HW5. The Spring link for `07280_S26_Lec10_Regularization.pdf` now returns 404, so the article does not claim to have read it or substitute Fall 2026 material.

## The inherited problem: is the limitation in the learner or the representation?

A line `h(x)=b+w₁x` fits a parabolic dataset badly. Add `x²` as a second feature and the same learner becomes

```text
h(x) = b + w₁x + w₂x²
```

The function is nonlinear in the original input but remains linear in its parameters, so ordinary linear-regression optimization still applies. Feature engineering changes the input space through `φ(x)` rather than replacing the learner.

## Complete conceptual path: φ(x) expands both hypotheses and failure modes

In general, `φ:Rᴷ→Rᴹ` can create polynomial terms, interactions, periodic features, distances, or domain-specific measurements. Training and inference must apply the identical transform; otherwise the learned weights and prediction inputs occupy different coordinate systems.

Increasing freedom usually lowers training error but does not guarantee better predictions. A high-degree polynomial can pass through every training point while oscillating between them. Model selection therefore needs a validation set:

```text
training set    → fit parameters
validation set  → choose degree / λ / architecture
test set        → one final unbiased estimate
```

Repeatedly inspecting test error while choosing a model makes the test set part of tuning, destroying its role as an independent estimate.

Regularization writes a preference for simpler parameters directly into the objective. If `J(θ)` is empirical loss,

```text
L2: J(θ) + λ ||θ||²₂
L1: J(θ) + λ ||θ||₁
```

At `λ=0`, parameters are unrestricted; an excessively large value forces underfitting. L2 smoothly shrinks weights. The sharp geometry of L1 more readily puts some weights exactly at zero, connecting it to sparsity. Neither is a free accuracy improvement: both trade additional bias for lower variance.

## Reproducible mini-example: one curve and three λ values

Suppose `φ(x)=[1,x,x²,x³]` and an unregularized fit produces `θ=[1,0.4,-0.1,12]`. The large cubic coefficient suggests that the model is chasing training detail.

You can anticipate three candidates without pretending to know the result:

```text
λ = 0      lowest training loss; validation loss may be high
λ = 0.01   shrinks the cubic term; validation loss may improve
λ = 100    drives all weights near zero; both splits underfit
```

The correct procedure is empirical: keep the training set fixed, fit every candidate, choose once using validation error, and open the test set only afterward.

## Recitation and homework connection

Recitation 5 places logistic regression and regularization on one worksheet, connecting the probability model to parameter control. HW5 asks students to compare model convergence, choose a model for an energy-use dataset, and state the evidence behind that choice. It turns “flexible model” into observable training and validation curves instead of a single training score.

The public PDFs support hand calculations and self-built experiments. The notebook, online components, and grading feedback do not form a complete anonymous course package.

## Extension: hand-designed versus learned features

Manual feature engineering makes `φ(x)` explicit. It can be interpretable and data-efficient, but people cannot enumerate every useful visual or linguistic feature. Lecture 11 turns `φ` into a learned, parameterized network. Regularization does not disappear: weight decay, dropout, and early stopping address the same generalization problem.

## What to do tonight

Create eight noisy `(x,y)` points and fit degree-1, degree-3, and degree-7 polynomials. Hold out two points solely for validation. Record training and validation MSE, then apply three `λ` values to the degree-7 model. Do not inspect test points until degree and `λ` have been selected.

## References

- [Feature Engineering & Logistic Regression pre-reading](https://www.cs.cmu.edu/~07280/notes/07280_S26_Notes_Feature_Eng_and_Logistic_Reg.pdf)
- [CMU 07-280 Model Selection slides](https://www.cs.cmu.edu/~07280/lectures/model%20selection.pdf)
- [Recitation 5 solution](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec5_sol.pdf)
- [HW5 written component](https://www.cs.cmu.edu/~07280/assignments/hw5_blank.pdf)
