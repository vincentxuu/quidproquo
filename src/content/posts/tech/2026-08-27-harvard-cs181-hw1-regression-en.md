---
title: "Harvard CS181 HW1: Ice Core Regression — kNN, Kernels, Basis Functions, and Regularization"
date: 2026-08-27
category: tech
tags: [harvard, cs181, regression, linear-regression, kernel-regression, knn, regularization, ice-core, python, machine-learning]
lang: en
series:
  name: "Harvard CS181 Weekly Guides"
  order: 2
type: guide
tldr: "HW1 uses an 800,000-year ice-core temperature dataset across four problems: kNN and kernel regression, a geometric proof of least squares, basis-function regression, and a probabilistic derivation of ridge and LASSO, ending with a coordinate-descent LASSO implementation."
description: "Weekly guide for Harvard CS181 (CS1810 Spring 2026) HW1 (due 2026-02-13), following the official hw1_release.tex problem by problem: kNN & Kernels, Geometric Least Squares, Basis Regression, and Probabilistic View & Regularization, plus a self-test plan."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-27-harvard-cs181-hw1-regression)

> ⚠️ **Edition**: This guide follows `hw1_release.tex` from the [CS181 2026 HW1 repository](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw1) (course number CS1810-S26, due 2026-02-13 at 11:59 PM). Earlier years may differ in problems and points; if you are working from another year, go by that year's `.tex`.

## Course video sources

This article follows official notes, slides, or assignments. This check of the official public pages did not verify a public recording for the material covered here; it does not establish that no recording exists.

Course and recording entries:

- [harvard-cs181 — official course materials and recording index](https://harvard-ml-courses.github.io/cs181-web/syllabus)

## TL;DR

HW1 is about **regression**, and all four problems use the same ice-core temperature data:

1. **kNN and Kernels (35 pts)**: run kNN, implement kernel regression yourself, and compare test MSE and complexity.
2. **Geometric Least Squares (20 pts)**: prove that OLS is the orthogonal projection of `y` onto the column space of `X`.
3. **Basis Regression (30 pts)**: fit linear regression with four basis sets (polynomial, RBF, two cosine sets) and decide which ones overfit.
4. **Probabilistic View of Regression and Regularization (30 pts)**: derive ridge and LASSO from Gaussian and Laplace priors, then implement LASSO with coordinate descent.

By the end you will have seen non-parametric regression (kNN, kernels) and parametric regression (linear with bases) on the same data, and you will know what regularization means in probabilistic terms.

## Why HW1 deserves its own guide

- **One dataset, several models**: the introduction states the goal outright: implement nearest-neighbor, kernelized, and linear regression on the same dataset and compare their tradeoffs.
- **Half proofs, half code**: Problem 2 and the first part of Problem 4 are derivations; Problems 1, 3, and the last part of Problem 4 are notebook work. Being good at only one of the two will slow you down.
- **It counts**: per the [2026 syllabus](https://harvard-ml-courses.github.io/cs181-web/syllabus), each of HW1–HW6 is worth 11%.

## The data and how to get it

The data lives in `hw1/data/`, in two files:

- `earth_temperature_sampled_train.csv` (57 lines including a header)
- `earth_temperature_sampled_test.csv` (26 lines including a header)

Each row has two columns: the **age** of the ice-core sample (years before present), and the **temperature difference (K)** from the average of the preceding 1,000 years. The data comes from the EPICA Dome C ice core in Antarctica (Jouzel et al. 2007, *Science*). Because the ages are large numbers, the assignment works in thousands of years; the provided notebook does the conversion for you.

```bash
curl -O https://raw.githubusercontent.com/harvard-ml-courses/cs181-s26-homeworks/main/hw1/data/earth_temperature_sampled_train.csv
```

## The four problems, one by one

### Problem 1: kNN and Kernels (35 pts)

Both non-parametric regressions are here.

- **kNN**: the prediction is the mean `y` of the `k` nearest training points. The implementation is provided. You run `k = 1, 3, N−1`, plot the fits, describe how they change with `k`, and write code to compute the test MSE for each `k`.
- **Kernel regression**: the prediction is a weighted average `f_τ(x*) = Σ K_τ(x_n, x*) y_n / Σ K_τ(x_n, x*)` with kernel `K_τ(x, x') = exp(−(x − x')² / τ)`, where `τ` is the squared lengthscale.
  - Implement `kernel_regressor` and plot the model from 800,000 BC to 400,000 BC at 1,000-year intervals for `τ = 1, 50, 2500`.
  - Write the test MSE as a formula, then compute it for the three `τ` values, explain which one wins, and explain why choosing `τ` on the training set is a bad idea.
  - Compare the time and space complexity of kNN and kernel regression in terms of training-set size `N`: what the model must store, and how much work one new prediction takes.
  - The last part asks for the exact form of `f_τ(x*)` as `τ → 0`.

### Problem 2: Geometric Least Squares (20 pts)

No code here; it is all proofs. The setup: the column space `C(X)` of `X ∈ ℝ^{N×D}` is a subspace of `ℝ^N`, and OLS projects `y` orthogonally onto it.

1. With `w* = (XᵀX)⁻¹Xᵀy` and `ŷ = Xw*`, prove that `ŷ` is the orthogonal projection of `y` onto `C(X)`.
2. Prove that `ŷ` is the vector in `C(X)` closest to `y`: for every `v ∈ C(X)`, `‖y − ŷ‖² ≤ ‖y − v‖²`. The hint is the Pythagorean identity for orthogonal vectors.
3. Prove that the hat matrix `P = X(XᵀX)⁻¹Xᵀ` is symmetric and idempotent, and that its rank and trace both equal `d`. You may use the fact that an idempotent matrix has equal rank and trace.
4. When the residual plot shows a U shape instead of random scatter, explain what that means in terms of projection onto the column space.

### Problem 3: Basis Regression (30 pts)

The raw input is one-dimensional (the year). This problem expands it with basis functions `φ` into a more expressive feature set and then runs linear regression. You implement four bases in `make_basis`, each with a bias term added:

| Basis | Form | Transform `f(x)` |
|---|---|---|
| (a) polynomial | `φ_j(x) = f(x)^j`, `j = 1…9` | `x / 181` |
| (b) RBF | `φ_j(x) = exp(−(f(x) − μ_j)² / 5)`, `μ_j = (j + 7) / 8`, `j = 1…9` | `x / 400` |
| (c) cosine | `φ_j(x) = cos(f(x) / j)`, `j = 1…9` | `x / 1.81` |
| (d) cosine | `φ_j(x) = cos(f(x) / j)`, `j = 1…49` | `x / 0.181` |

The transform `f` rescales the input for numerical stability and is already in the notebook. Then:

- Plot the four fitted curves over the training data. These four plots are all the writeup needs for this part.
- Compute the test MSE for each basis and discuss which ones overfit or underfit.
- Explain what the transforms `φ` are for, and analyze how linear regression's time and space cost scales with `N` and the number of features `D`.
- Compare kNN, kernel regression, and linear regression with bases, and think about how you would use several regression functions together.

### Problem 4: Probabilistic View of Regression and Regularization (30 pts)

Linear regression is rewritten as a probabilistic model `y_n = wᵀx_n + ε_n` with `ε_n ~ N(0, σ²)`. Adding a prior on the weights and maximizing the posterior (MAP) gives you regularization.

1. With `w ~ N(0, (σ²/λ) I)`, show that maximizing the posterior is equivalent to minimizing the ridge loss `½‖y − Xw‖² + (λ/2)‖w‖²`.
2. Solve for the `w` that minimizes the ridge loss.
3. With each `w_d` drawn from a Laplace distribution `L(0, 2σ²/λ)`, show that maximizing the posterior is equivalent to minimizing the LASSO loss `½‖y − Xw‖² + (λ/2)‖w‖₁`.
4. Explain why LASSO has no general closed-form solution.
5. Implement `find_lasso_weights` using the coordinate-descent algorithm given in the problem: start from a vector of ones, run at most 5,000 iterations, compute `ρ_d` for each coordinate, update the first coordinate (the bias) directly, and apply soft-thresholding to the rest. Then fit basis (d) from Problem 3 with `λ = 1` and `λ = 10`, plot the predictions on the training set, and compute the test MSE.

## A 90-minute self-test

1. **Run the first half of the notebook**: open `hw1_release.ipynb`, confirm the ages are converted to thousands of years, and produce the kNN plots for `k = 1, 3, N−1`.
2. **Kernel regression**: once `kernel_regressor` works, plot only `τ = 50` first. The curve should sit between the jagged `k = 1` fit and the flat `k = N−1` line.
3. **Geometry proofs**: start with part 2 (`ŷ` is closest). The orthogonality it relies on is the result of part 1, so the two are easiest to write together.
4. **Basis regression**: build basis (a) in `make_basis` first and check the output shape is `N × 10` (nine basis functions plus bias), then copy the structure for (b)–(d).
5. **LASSO**: after writing `find_lasso_weights`, run it once with `λ = 0`. The result should be close to the OLS fit for basis (d) from Problem 3, which is a quick sanity check.

## How HW1 connects to later weeks

Next: [HW2: classification and bias-variance](/posts/tech/2026-09-29-harvard-cs181-hw2-classification-bias-variance-en) (`due 2026-02-27`). Going by the problem titles in each s26 `.tex`, HW1 material comes back here:

- **HW2**: Bias-Variance & Uncertainty, MLE in classification, GD & Regularization, building on this post's least squares and regularization.
- **[HW3](/posts/tech/2026-09-29-harvard-cs181-hw3-kernels-neural-networks-scaling-en)**: Kernels & Feature Maps, Neural Networks, Neural Scaling Laws, extending the kernel and basis ideas here to feature maps and neural networks.
- **[HW4 (Part 1)](/posts/tech/2026-09-29-harvard-cs181-hw4-transformer-en)**: Understanding the Transformer.

The previous post is [HW0: linear algebra review](/posts/tech/2026-08-27-harvard-cs181-hw0-linear-algebra-review-en). The full list is in the [series overview](/posts/tech/2026-08-27-harvard-cs181-overview-en).

## Update log


- 2026-10-10: Added course video sources and recording access notes.
- **2026-09-30**: Rewrote the problem sections to match the official `hw1_release.tex`. The earlier version described three problems (OLS, RBF kernel, MLP); the actual assignment has four: kNN & Kernels, Geometric Least Squares, Basis Regression, and Probabilistic View & Regularization. Also corrected the dataset size and age description and the Jouzel et al. 2007 citation, and removed the unsourced MLP and PyTorch material.
- **2026-09-29**: Corrected the due date to 2026-02-13 per the s26 `hw1_release.tex`; rewrote "How HW1 connects to later weeks" to link the actual series posts, with topics taken from each `.tex`.

## References

- [CS181 2026 HW1 (GitHub)](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw1)
- [CS181 2026 HW1 `hw1_release.tex`](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw1/hw1_release.tex)
- [CS181 2026 Syllabus](https://harvard-ml-courses.github.io/cs181-web/syllabus)
- [Jouzel et al. 2007, Orbital and Millennial Antarctic Climate Variability over the Past 800,000 Years, *Science* 317(5839)](https://doi.org/10.1126/science.1141038)
- [NOAA NCEI: EPICA Dome C temperature data](https://www.ncei.noaa.gov/pub/data/paleo/icecore/antarctica/epica_domec/edc3deuttemp2007.txt)
- [MML Book (Mathematics for Machine Learning)](https://mml-book.github.io/)
