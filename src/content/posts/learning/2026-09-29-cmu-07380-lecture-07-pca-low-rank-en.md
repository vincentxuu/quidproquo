---
title: "Reading CMU 07-380 Lecture 7: Low Rank Optimization, PCA's Reconstruction Error, Projected Variance, and LoRA"
date: 2026-09-29
category: learning
tags: [cmu, 07-380, ai-course, course-guide, pca, dimensionality-reduction]
lang: en
type: guide
difficulty: 進階
series:
  name: "Reading CMU 07-380"
  order: 9
tldr: "07-380 Lec7 frames PCA as low-rank optimization: approximate the data with a matrix of rank at most r. For a unit vector v, each point's reconstruction error equals ‖x‖² minus the squared projection length, so minimizing reconstruction error and maximizing projected variance are the same problem. Lagrange multipliers show the answer is an eigenvector of the covariance matrix, which you can also read straight off the V in the SVD. The site lists the LoRA paper as reading; its ΔW = BA applies the same low-rank idea to weight updates."
description: "A guide to CMU 07-380 Fall 2026 Lecture 7, Low Rank Optimization: PCA — dimensionality reduction and low-rank approximation, centering, projection and reconstruction, the proof that the two objectives match, Lagrange multipliers and eigenvectors, SVD, choosing K, Recitation 4's PCA walkthrough, the pca_2d_exercise notebook, and an intuitive link to LoRA, based on the course site as of 2026-09-29."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-09-29-cmu-07380-lecture-07-pca-low-rank)

**Video status: Checked: no corresponding recording link listed on the public official page.** [Source details](#course-video-sources)

This is Lecture 7 of [CMU 07-380 AI & ML II](https://www.cs.cmu.edu/~07380/), Fall 2026: **Low Rank Optimization: PCA** (9/16). The topic column on the course site reads "PCA (LoRA)." It is the last lecture in the Optimization module.

In the previous two lectures ([Lec5 LP](/en/posts/learning/2026-09-29-cmu-07380-lecture-05-linear-programming-en), [Lec6 IP](/en/posts/learning/2026-09-29-cmu-07380-lecture-06-integer-programming-en)), the constraints were linear inequalities. Here the constraint becomes "rank at most r" and the objective becomes squared error. The problem looks different, but the approach is the same: write it as an optimization problem, then find the structure of the solution.

The short answer: **PCA's two usual definitions, minimizing reconstruction error and maximizing projected variance, have the same argmin.** The solution is the eigenvectors of the covariance matrix, which are also the right singular vectors in the SVD of the data matrix.

Everything here reflects the [course site as of 2026-09-29](https://www.cs.cmu.edu/~07380/#schedule). The site notes that the schedule is subject to change.

## Course video sources

The official Fall 2026 schedule and assignment list have been checked: public resources include slides, pre-readings, demonstrations and assignments, but no public recording link for the corresponding lectures. This article is therefore a materials-based guide with no corresponding lecture player. This observation concerns the public official page and does not establish whether internal recordings exist.

Official sources:

- [CMU 07-380 Fall 2026 官方課表與教材](https://www.cs.cmu.edu/~07380/)

Checked on 2026-10-10.

## Official materials and what I read

- [Lec7 slides (inked PDF)](https://www.cs.cmu.edu/~07380/lectures/07380_F26_Lec7_Low_Rank_Optimization_PCA_inked.pdf), 41 pages: definitions, an MRI growth-plate example, centering, coordinate transforms, the PCA algorithm, the two objectives, the equivalence proof, Lagrange multipliers, choosing K, SVD. A [pptx version](https://www.cs.cmu.edu/~07380/lectures/07380_F26_Lec7_Low_Rank_Optimization_PCA.pptx) is also posted
- [PR4 PCA pre-reading](https://www.cs.cmu.edu/~07380/notes/07380_F26_Notes_PCA.pdf) (checkpoint due 9/15): scalar and vector projection, rotation and the projection matrix, the covariance matrix
- Two Desmos demos: [Projection](https://www.desmos.com/calculator/7x11plypr0) and [Projection of points](https://www.desmos.com/calculator/dsfa42s9ln)
- [`pca_2d_exercise.ipynb` (Colab)](https://colab.research.google.com/drive/1DQJ4cjImkuWOxGibw4oONuuPaVhnxBfC?usp=drive_link): publicly downloadable
- [Recitation 3-4 handout](https://www.cs.cmu.edu/~07380/recitations/Recitation3-4_07380_f26.pdf) and [solutions](https://www.cs.cmu.edu/~07380/recitations/Recitation3-4_07380_f26_sol.pdf), Problem 6, PCA Walkthrough (Recitation 4, 9/18)
- Assigned reading: [Bishop, *Pattern Recognition and Machine Learning*](https://www.microsoft.com/en-us/research/uploads/prod/2006/01/Bishop-Pattern-Recognition-and-Machine-Learning-2006.pdf) §12.1 (covers both the 12.1.1 maximum-variance and 12.1.2 minimum-error derivations); Murphy §12.2; the [LoRA paper (Hu et al., 2021)](https://arxiv.org/abs/2106.09685)

**Access level**: slides, notes, Desmos, the notebook, and the recitation with solutions are all available outside CMU, so this lecture's materials reach A3 (defined in the [global AI/CS course map](/en/posts/learning/2026-08-21-global-ai-cs-course-map-en)). Two exceptions: the Murphy link goes through CMU's EBSCO library access and needs a campus login, so I did not read it; and the site has no lecture recordings.

## The starting question: what is low-rank optimization

The slides open with two definitions:

- **Dimensionality reduction**: transform data from a high-dimensional representation to a lower-dimensional one while keeping the important information and dropping distracting, unimportant information
- **Low-rank optimization**: find a matrix `A'` of rank at most r that best approximates a given matrix `A`

```text
min_{A'}  ‖A − A'‖²   s.t.  rank(A') ≤ r
```

The PR4 notes describe dimensionality reduction as shrinking the data matrix from N×M to N×K with K < M. They give three reasons: fewer features train faster, dropping noisy features can help the model, and two or three dimensions can be plotted.

The slides then define principal components: an ordered sequence of orthogonal basis vectors such that, for every K, the first K vectors span the "best" subspace of the data. What "best" means is the second half of the lecture.

The real-world example is MRI imaging of a knee growth plate. PCA finds the plate's principal axes so it can be flattened into 2-D for an area measurement. The slides drop a spoiler here: the PCA axes are eigenvectors.

## Pre-reading building blocks: projection, rotation, covariance

PR4 breaks the needed linear algebra into three pieces:

1. **Projection**: for a unit vector `v`, the scalar projection is `d = vᵀx` (the length of the shadow) and the vector projection is `z = (vᵀx)v` (the shadow itself)
2. **Rotation**: stack orthonormal vectors into a matrix `V`, and `z = Vx` gives the coordinates of `x` along the new axes. When `V` is square, `VᵀV = I` and reconstruction is exact; keeping only K < M axes generally loses information
3. **Covariance matrix**: for centered data, the covariance matrix is `(1/N) XᵀX`. Diagonal entries are feature variances; off-diagonal entries are pairwise covariances

A notation warning: the notes stack basis vectors as **rows** of `V` (`z = Vx`), while the slides' algorithm stacks eigenvectors as **columns** (`Z = X V_K`). They differ by a transpose, so don't mix them.

## The PCA algorithm (slide version)

Input: training data `X`, test data `X_test`, and the number of dimensions `K` to keep.

1. Center (and optionally scale each axis) using the **training** data's statistics, and apply it to both `X` and `X_test`
2. `V = eigenvectors(XᵀX)`
3. Keep only the top K eigenvectors, `V_K`
4. `Z_test = X_test V_K`

Optionally, use `V_Kᵀ` to rotate `Z_test` back to the original space and uncenter. Why center at all? The slides ask what to do if the data isn't centered, and the answer is to subtract the sample mean. Every derivation after that assumes centered data.

## The two objectives are the same

For the first principal component, the slides put two goals side by side, both with `‖v‖₂ = 1`:

```text
Minimize reconstruction error:  v* = argmin_v (1/N) Σᵢ ‖x⁽ⁱ⁾ − (vᵀx⁽ⁱ⁾)v‖²
Maximize projected variance:    v* = argmax_v (1/N) Σᵢ (vᵀx⁽ⁱ⁾)²
```

The equivalence proof is one line. Because `vᵀv = 1`, the cross term cancels when you expand:

```text
‖x − (vᵀx)v‖² = ‖x‖² − (vᵀx)²
```

`‖x‖²` doesn't depend on `v`, so minimizing the left side is the same as maximizing the average of `(vᵀx)²`. The intuition is the Pythagorean theorem. Each point's squared distance from the origin is fixed and splits into squared projection length plus squared distance to the line. When one grows, the other shrinks.

Slide Poll 2 asks you to drag the projection vector `v` in a Desmos demo and find the smallest reconstruction MSE and the largest projected variance. The site's [Desmos: Projection of points](https://www.desmos.com/calculator/dsfa42s9ln) supports this experiment: both extremes land on the same direction.

## Why the answer is an eigenvector

The slides handle the `‖v‖₂ = 1` constraint with Lagrange multipliers. Let `Σ` be the covariance matrix:

```text
max_v  vᵀΣv   s.t. vᵀv = 1
L(v, λ) = vᵀΣv − λ(vᵀv − 1)
∂L/∂v = 0  ⇒  Σv = λv
```

The last line is the definition of an eigenvector. Substituting back gives `vᵀΣv = λ`, so the projected variance equals the eigenvalue. The first principal component is the eigenvector with the largest eigenvalue, the second has the next largest, and so on.

**Choosing K**: look at the eigenvalues. A slide the lecture borrows defines "Variance (%)" as the share of total variance along a given component. Drop axes with small eigenvalues and you lose little information.

**SVD**: in `X = USVᵀ`, the columns of `V` are eigenvectors of `XᵀX`, and each `σₖ²` is an eigenvalue of both `XXᵀ` and `XᵀX`. So PCA can skip forming the covariance matrix and run SVD directly on the data.

The last two slides are titled "PCA versus other Linear Transforms" and "Where else have we seen linear transforms?" The PDF shows only the titles, with no text content.

## A worked example you can redo: the recitation's four points

Recitation Problem 6 uses the points (1,2), (2,3), (3,2), (4,3).

1. Both features have mean 2.5. After centering: (−1.5,−0.5), (−0.5,0.5), (0.5,−0.5), (1.5,0.5)
2. Projected onto `v = [1,1]ᵀ/√2`, the projection lengths are −√2, 0, 0, √2
3. The solutions give a reconstruction error of 1/2 and a projected variance of 1
4. By eigendecomposition, `XᵀX = [[5,1],[1,1]]` with eigenvalues 3 ± √5, and the first principal component is about (0.973, 0.230)

I checked one more step that isn't in the solutions. The total variance is `(5 + 1)/4 = 1.5`. For `v = [1,1]ᵀ/√2`, 1 + 0.5 = 1.5. For the first principal component, the projected variance is `(3+√5)/4 ≈ 1.309` and the reconstruction error is 1.5 − 1.309 ≈ 0.191. The two always add up to 1.5, which is exactly what the equivalence proof says.

## The notebook: `pca_2d_exercise.ipynb`

This Colab samples 30 points from a 2-D Gaussian (mean [20,20], covariance [[25,22],[22,25]]) and leaves several `# FIX ME!` cells for you:

1. Center the data
2. Get the covariance matrix's eigenvectors `V`, ordered by eigenvalue
3. Rotate to `Z`, then rotate back to `X'`
4. Keep only the first column of `V`: `Z` becomes 1-D, `X'` stays 2-D but every point lands on one line
5. Add the mean back and overlay the result on the original data

Once filled in, step 4's plot is the slide's "Reduced along 1st principal component" figure.

## Homework

**HW3 written** Q3 PCA is worth 9 points. The Warm-Up (2 pts) asks you to draw the first and second principal components on given 2-D plots. The Computation part (7 pts) uses 6 points in 5 dimensions: decide whether the data is centered, write the SVD's three matrices and their dimensions, find the first principal component, and give the variance and reconstruction error after projecting to 1-D. The ideas match Recitation Problem 6, just in higher dimensions and via SVD; see the [HW3 guide](/en/posts/learning/2026-09-29-cmu-07380-hw3-optimization-pca-map-en). HW3 is due 10/1, and this series does not post solutions.

## Connection: LoRA's low rank is the same idea

The site attaches the [LoRA paper](https://arxiv.org/abs/2106.09685) to this lecture, but the slide text never mentions LoRA, so I can't confirm how much of it was covered in class. What follows is only an intuitive link:

- LoRA starts from the hypothesis that the **change** in weights during fine-tuning has low intrinsic rank. It freezes the pretrained weight `W₀ ∈ ℝ^{d×k}` and learns only `ΔW = BA`, with `B ∈ ℝ^{d×r}`, `A ∈ ℝ^{r×k}`, and `r ≪ min(d,k)`
- Compare the lecture's opening definition: `BA` is a matrix of rank at most r, the same kind of object as PCA's rank-K approximation
- The difference: PCA solves for the best low-rank approximation in one eigendecomposition. LoRA doesn't approximate a known matrix; it treats `B` and `A` as parameters and trains them with gradient descent on the downstream task

Two other posts on this site cover LoRA from the implementation side: [CS224N Tinker and LoRA](/en/posts/ai/2026-08-22-cs224n-tinker-lora-en) and [MIT 6.S191 Lab 3 LoRA fine-tuning](/en/posts/ai/2026-08-22-mit-6s191-lab3-lora-evaluation-en).

## Things to do tonight

1. Open [Desmos: Projection](https://www.desmos.com/calculator/7x11plypr0), drag the points to see how the projected vector changes, then check one case by hand: does `‖x‖²` equal squared projection length plus squared distance to the line?
2. Work Recitation Problem 6 without the solutions, then add the reconstruction error for the first principal component and check that it sums with the projected variance to 1.5.
3. Download `pca_2d_exercise.ipynb`, fill every `# FIX ME!` using only `np.linalg.eigh`, then redo it with `np.linalg.svd` and check that the two `V`s differ only in sign.

## Series navigation

- Previous: [Lecture 6: Integer Programming, Relax to an LP and Branch and Bound](/en/posts/learning/2026-09-29-cmu-07380-lecture-06-integer-programming-en)
- Next: [Lecture 8: MAP, How Priors Enter Estimation and Why It Equals Regularization](/en/posts/learning/2026-09-29-cmu-07380-lecture-08-map-en)
- Series overview: [CMU 07-380 Fall 2026 Overview](/en/posts/learning/2026-08-22-cmu-07380-fall-2026-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Re-verified the live official course pages and public video sources; no public recording for this lecture was found, so the status stands.

## References

- [CMU 07-380 AI & ML II Fall 2026 course site](https://www.cs.cmu.edu/~07380/)
- [07-380 Fall 2026 Lecture 7 — Low-rank Optimization & PCA (inked PDF)](https://www.cs.cmu.edu/~07380/lectures/07380_F26_Lec7_Low_Rank_Optimization_PCA_inked.pdf)
- [07-380 Pre-reading: Principal Component Analysis (PR4)](https://www.cs.cmu.edu/~07380/notes/07380_F26_Notes_PCA.pdf)
- [07-380 Recitation 3 & 4](https://www.cs.cmu.edu/~07380/recitations/Recitation3-4_07380_f26.pdf)
- [07-380 Recitation 3 & 4 Solutions](https://www.cs.cmu.edu/~07380/recitations/Recitation3-4_07380_f26_sol.pdf)
- [pca_2d_exercise.ipynb (Colab)](https://colab.research.google.com/drive/1DQJ4cjImkuWOxGibw4oONuuPaVhnxBfC?usp=drive_link)
- [Desmos: Projection](https://www.desmos.com/calculator/7x11plypr0)
- [Desmos: Projection of points](https://www.desmos.com/calculator/dsfa42s9ln)
- [07-380 HW3 Written](https://www.cs.cmu.edu/~07380/assignments/hw3_blank.pdf)
- [Bishop, Pattern Recognition and Machine Learning (PDF)](https://www.microsoft.com/en-us/research/uploads/prod/2006/01/Bishop-Pattern-Recognition-and-Machine-Learning-2006.pdf)
- [Hu et al. (2021), LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685)
