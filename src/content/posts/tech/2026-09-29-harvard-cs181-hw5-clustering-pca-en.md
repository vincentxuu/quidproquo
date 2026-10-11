---
title: "Harvard CS181 HW5 (Part 1): K-means, HAC, and PCA on Handwritten Digits Without Labels"
date: 2026-09-29
category: tech
tags: [harvard, cs181, machine-learning, homework, clustering, k-means, pca, unsupervised-learning]
lang: en
series:
  name: "Harvard CS181 Weekly Guides"
  order: 9
type: guide
tldr: "HW5 Problems 3–4 give handwritten digits to three methods that never see a label: K-means summarizes the data with 10 mean images, HAC builds a merge tree you can cut at any number of clusters, and PCA compresses images onto a few continuous directions. All three answer the same question — how much error do you pay to describe the data with a few objects — and the assignment makes you compare their objectives and reconstruction errors directly."
description: "Weekly guide to Harvard CS1810 Spring 2026 HW5 (due 2026-04-19) Problems 3–4: K-means and HAC with max/min/centroid linkage from scratch, centroids before and after standardization, cluster sizes and confusion matrices, and PCA on the first 6000 MNIST images with cumulative explained variance and reconstruction error. Mapped to schedule week 9 and Section 7."
draft: false
glossary:
  - term: "HAC"
    aliases: ["hierarchical agglomerative clustering"]
    definition: "Bottom-up clustering: every point starts as its own cluster, and each step merges the two clusters with the smallest linkage distance until one remains. The merge history forms a tree (dendrogram); cutting it at different heights gives different numbers of clusters."
    context: "HW5 Problem 3 asks you to implement HAC with three linkages from scratch and compare it with K-means."
  - term: "linkage"
    aliases: ["linkage function"]
    definition: "The rule HAC uses to measure the distance between two clusters. Min (single) uses the closest pair of points, max (complete) uses the farthest pair, and centroid uses the distance between the two cluster means."
    context: "The linkage decides whether HAC grows long chained clusters or compact ones."
---

> 🌏 [中文版](/posts/tech/2026-09-29-harvard-cs181-hw5-clustering-pca)

**Video status: Checked: no corresponding recording link listed on the public official page.** [Source details](#course-video-sources)

> ⚠️ **Edition and access**: Based on [CS1810 Spring 2026 HW5](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw5) (`hw5_release.tex/.pdf/.ipynb` and `data/*.npy`), week 9 of the [official schedule](https://harvard-ml-courses.github.io/cs181-web/schedule), and [Section 7](https://harvard-ml-courses.github.io/cs181-web/static/sec07/sec07.pdf) (headed Spring 2026). There are no public recording links listed for the corresponding lectures. The lecture scribe notes are from **2024** (K-means is in [lec12, 2024-02-29](https://harvard-ml-courses.github.io/cs181-web/static/lec12/12-scribe-notes.pdf), PCA in [lec15, 2024-03-21](https://harvard-ml-courses.github.io/cs181-web/static/lec15/15-scribe-notes.pdf); lec13 is missing). Homework solutions are not public; Section 7 has a [solution PDF](https://harvard-ml-courses.github.io/cs181-web/static/sec07/sec07_soln.pdf). Access grade **A3**, same as the [series overview](/posts/tech/2026-08-27-harvard-cs181-overview-en).

This is part 9 of the [Harvard CS181 Weekly Guides](/posts/tech/2026-08-27-harvard-cs181-overview-en). Previous: [HW4 (Part 3): Decision Trees, Random Forests, and MoE](/posts/tech/2026-09-29-harvard-cs181-hw4-trees-forests-moe-en). Next: [HW5 (Part 2): SimCLR Contrastive Learning and GANs](/posts/tech/2026-09-29-harvard-cs181-hw5-contrastive-gans-en).

Through HW4, every assignment had labels: temperatures, loan decisions, image classes. HW5 is titled "Clustering, PCA, SSL," and all four problems drop the labels. This post covers the last two (Problem 3 clustering, Problem 4 PCA), the classical methods that come first in the lecture order. Problems 1–2, SimCLR and GANs, are in the next post.

## Course video sources

Checked the official CS1810 Spring 2026 schedule and syllabus. This guide uses homework, section, or exam materials; the corresponding entries do not list a public lecture video. Slides and section materials are provided. No public listing does not mean that a recording never existed.

Official sources:

- [CS1810 Spring 2026 official schedule](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ/edit?usp=sharing)
- [CS1810 Spring 2026 syllabus](https://harvard-ml-courses.github.io/cs181-web/syllabus)

Checked on 2026-10-10.

## Where HW5 sits in the 2026 schedule

| Item | Official source |
|---|---|
| Release | 2026-04-03 (Fri), the day HW4 is due; the schedule says "Release HW 5 (Clustering, PCA, SSL)" |
| Due | `\duedate` in `hw5_release.tex` is April 19, 2026 11:59pm; the schedule originally said Apr 17, annotated "pushed back to April 19 EOD" |
| Lectures | Week 9: Mar 24 Clustering, Mar 26 PCA |
| Section | Section 7 "Unsupervised Learning" (listed in the week 10 row of the schedule) |
| Weight | Syllabus: hw1–6 are 11% of the grade each; the HW5 tex gives no per-problem points |
| Submission | Writeup PDF to Gradescope `HW5`, `.tex` and `.ipynb` to `HW5 - Supplemental` (enrollment required) |

All four problems live in one notebook, `hw5_release.ipynb`, split by Problem 1–4. The `data/` folder holds three files. I loaded them with NumPy to confirm the shapes:

| File | Shape | Used for |
|---|---|---|
| `large_dataset.npy` | (5000, 784), float32 | K-means |
| `small_dataset.npy` | (300, 784), float32 | HAC |
| `small_dataset_labels.npy` | (300,), int64 | Confusion matrices only |

784 = 28×28; each row is a flattened handwritten digit. The PCA problem does not use these files. The notebook downloads the MNIST training set with `torchvision.datasets.MNIST` and takes the first `N = 6000` images.

## Problem 3: K-means and HAC

You implement both clustering methods from scratch, using ℓ2 (Euclidean) distance throughout, and then answer whether such simple algorithms can group similar-looking digits. The eight sub-questions fall into three stages.

### Stage 1: the K-means objective and centroids

K-means looks for K centers μ and an assignment c for every point that minimize the total squared distance from each point to its center. [Section 7](https://harvard-ml-courses.github.io/cs181-web/static/sec07/sec07.pdf) presents the solver as Lloyd's algorithm, alternating two steps:

1. **Assign**: with centers fixed, send each point to its nearest center.
2. **Update**: with assignments fixed, move each center to the mean of its points.

Sub-question 2 asks you to start from a random initialization with K=10, plot the objective per iteration, and verify that it **never increases**. That is not luck. Each step is optimal with the other half held fixed, so the total can only drop or stay put. Section 7's Exercise 3 asks you to prove exactly this; once you have, the plot in sub-question 2 is just a check.

Sub-question 3 runs three random restarts and shows the mean image of each of the 10 clusters, 30 images in one figure. A mean image is itself a blurry digit, so you see directly which digits got merged and which got split in two. The three runs differ because the K-means objective is non-convex and the algorithm stops at local optima. K-means++, mentioned in Section 7, reduces this by picking initial centers that are far apart.

Sub-question 4 standardizes every pixel to mean 0 and variance 1 (dividing by 1 for zero-variance pixels) and repeats. Section 7's "Practical Considerations" notes that a coordinate with a much larger range dominates the objective, and standardizing mitigates that. But MNIST's border pixels are almost always 0 with tiny variance, so standardizing blows up whatever noise they carry. That is one angle for explaining how the two sets of centroids differ.

### Stage 2: three HAC linkages

HAC needs no K up front. It starts from N singleton clusters, merges the closest pair at each step, and records the merges as a tree; you cut the tree wherever you want a given number of clusters. How "distance between two clusters" is defined is the linkage:

| Assignment term | Section 7 term | Definition | Typical behavior |
|---|---|---|---|
| min linkage | single linkage | Distance of the closest pair across the two clusters | Finds elongated shapes, but bridge points can chain clusters together |
| max linkage | complete linkage | Distance of the farthest pair across the two clusters | Controls cluster diameter; compact clusters |
| centroid linkage | (Section 7 lists average and Ward instead) | Distance between the two cluster means | In between |

Sub-question 5 fits all three linkages on the 300-image set, shows each cluster's mean image at exactly 10 clusters, asks you to comment on crispness, and asks why HAC only needs one run. The hint for the last part is in the algorithm: HAC has no random initialization, so given the data and the linkage, every merge is determined.

Sub-question 6 plots how many images land in each of the 10 clusters, for all three linkages plus one K-means run. This plot usually shows min-linkage chaining most clearly: if one cluster swallows most of the data while the rest hold one or two images, it has been chained. Section 7 also notes that naive HAC is O(N³), which is why it gets 300 images while K-means gets 5000.

### Stage 3: confusion matrices and "can clustering identify digits?"

Sub-question 7 plots pairwise confusion matrices between K-means and the three HAC variants and asks which HAC variant is closest to K-means, and why. Hint: K-means represents a cluster by its mean. Which linkage also looks at means?

Sub-question 8 is a discussion: is clustering a good strategy for digit identification, should clusters match the true labels, and what bad or adversarial data hurts clustering most? Section 7's "Evaluating Clusterings" gives a frame. Without labels you can only judge compactness, separation, and stability, and these often pull against each other. Only with labels can you compare clusters against true classes. A cluster that doesn't line up with a digit isn't necessarily a broken algorithm; 4 and 9 may simply be close in pixel space.

Problem 1 of the [second-half practice problems](https://harvard-ml-courses.github.io/cs181-web/static/final_practice/final_practice.pdf) is HAC on nine 1-D points: draw the dendrogram under min linkage and under max linkage. It is much smaller than the homework. Work it by hand first so you know what each merge does, then write the 300-image version.

## Problem 4: PCA

The problem says plainly: **no third-party PCA implementations** (for example scikit-learn). You build it yourself. Notebook section 4.1.a is titled "PCA via SVD": center the data, then take the SVD of the centered matrix.

Four sub-questions:

1. Plot the eigenvalues of the top 500 components in decreasing order, and plot the cumulative proportion of variance explained by the first k components for k = 1…500. How much variance do 500 components explain, and how does the curve change with k?
2. Plot the dataset's mean image and the images of the first 10 principal components, and compare them with the K-means centroids. The problem reminds you: **center the data before PCA**.
3. Compute the reconstruction error with the first 10 components, then the error when every image is reconstructed as the mean image, and compare both with the final K-means objective. For consistent grading, error is the squared ℓ2 distance between data and reconstruction, averaged over all points.
4. If you right-multiply the component matrix V by a rotation R and use VR, does the reconstruction error change? Does the interpretation of the components?

Section 3 of Section 7 frames PCA in three ways that map onto these questions:

- **Explained variance**: the k-th eigenvalue λk is the variance along the k-th direction; the cumulative ratio is the sum of the top K eigenvalues over the sum of all of them (sub-question 1). Section 7 says common practice is to keep 90–95% or look for an elbow in the scree plot, with no universal threshold.
- **Compression**: encode z = Vᵀx̃, decode x̂ = Vz. PCA is the best linear encoder–decoder under squared error (sub-question 3).
- **Non-uniqueness**: subsection 3.3.1, "Non-uniqueness and the Orthonormality Constraint," is exactly what sub-question 4 is probing. Ask yourself whether VR spans the same subspace as V.

Sub-questions 2 and 3 deserve the most time, because they put K-means and PCA on the same ruler. Both describe each image with a few objects: K-means with one centroid (a discrete identity), PCA with 10 continuous coefficients. Section 7's subsection 3.11, "PCA vs. Clustering," sums up the contrast: clustering finds discrete groups, PCA finds continuous directions of variation, and the same data may benefit from both. The order of your three numbers (mean-image error, 10-component PCA error, K=10 K-means objective) is the empirical version of that paragraph.

One detail: the K-means objective is computed on `large_dataset` (5000 images), PCA on the first 6000 MNIST images. The data differ, and the K-means objective is a sum while the problem's error is an average. Make sure you're comparing the same kind of quantity.

## Suggested order

1. Work Section 7's K-means Exercise 1 (five 1-D points, K=2) and HAC Exercise 1 by hand, then the dendrogram in practice Problem 1.
2. Write K-means and do the objective plot of sub-question 2 first. If the curve ever goes up, your assign or update step is wrong; fix it before moving on.
3. Test HAC on a dozen points and check that the merge order for each linkage matches your hand calculation before running 300 images.
4. For PCA, confirm the centering, then do the SVD. The cumulative ratio in sub-question 1 should end close to 1 (500 components is a lot); if it doesn't, check that you converted singular values to eigenvalues correctly.
5. Write the comparisons in sub-questions 2–3 last. They need the K-means results from Problem 3, so don't do Problem 4 first.

## Self-check

- Why can the K-means objective never go up? Say it in two sentences.
- On what data does min linkage chain two clearly separated groups? Sketch one.
- Which look more like digits, the first 10 principal-component images or the 10 K-means centroids? Why?
- After replacing V with VR, do each image's 10 coefficients change? Does the reconstruction?

## Further reading

- [Stanford CS229 notes, chapter 10: clustering and k-means](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-10-clustering-k-means-en), which revisits K-means as alternating optimization.
- [Berkeley CS189 Spring 2025 overview](/posts/learning/2026-08-22-berkeley-cs189-spring-2025-overview-en), for how another university ML course schedules unsupervised learning.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Re-read the official schedule and syllabus; they still list no public lecture video for this topic.

## References

- [CS1810 Spring 2026 HW5 folder (GitHub)](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw5): `hw5_release.tex`, `hw5_release.pdf`, `hw5_release.ipynb`, `data/*.npy`
- [HW5 problem PDF](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw5/hw5_release.pdf)
- [CS1810 2026 official schedule](https://harvard-ml-courses.github.io/cs181-web/schedule) (weeks 9–12, HW5 release/due; read via Google Sheet CSV export on 2026-09-29)
- [CS1810 2026 syllabus](https://harvard-ml-courses.github.io/cs181-web/syllabus) (grade weights)
- [Section 7: Unsupervised Learning (Spring 2026)](https://harvard-ml-courses.github.io/cs181-web/static/sec07/sec07.pdf) / [solutions](https://harvard-ml-courses.github.io/cs181-web/static/sec07/sec07_soln.pdf)
- [CS181 Second Half Practice Problems](https://harvard-ml-courses.github.io/cs181-web/static/final_practice/final_practice.pdf) (Problem 1, HAC)
- [2024 Lecture 12 scribe notes: unsupervised learning, K-means](https://harvard-ml-courses.github.io/cs181-web/static/lec12/12-scribe-notes.pdf)
- [2024 Lecture 15 scribe notes: PCA](https://harvard-ml-courses.github.io/cs181-web/static/lec15/15-scribe-notes.pdf)
- [CS181 2026 course home page](https://harvard-ml-courses.github.io/cs181-web/)
- [Harvard CS181 Weekly Guides (series overview)](/posts/tech/2026-08-27-harvard-cs181-overview-en)
