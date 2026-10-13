---
title: "RBF Networks: Predicting by Similarity to Centers Found with k-Means | NTU Hsuan-Tien Lin Machine Learning Techniques Lecture 14"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, rbf-network, k-means, clustering]
lang: en
math: true
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 31
tldr: "The result of the Gaussian SVM can be read as a linear vote over Gaussians centered at the support vectors; let both the centers and the votes be learned and you have the RBF network. When all N examples serve as centers, the optimal votes for regression are β = Z⁻¹y and the training error is exactly 0, so you regularize with ridge or by cutting the centers down to M ≪ N prototypes. The prototypes are found with k-means, which alternates two steps, assigning every example to its closest center and moving every center to the average of its cluster, until the clusters stop changing."
description: "A guide to Lecture 14 of NTU Hsuan-Tien Lin's Machine Learning Techniques, Radial Basis Function Network: the RBF network hypothesis, the full RBF network and nearest neighbor, exact interpolation with β = Z⁻¹y and its regularization, the alternating-optimization derivation of k-means, and the RBF network with centers found by k-means, with hand-computed examples and worked answers to the four Fun Time questions."
draft: false
glossary:
  - term: "RBF network"
    aliases: ["RBF Network", "radial basis function network", "RBFNet"]
    definition: "A model whose hidden layer computes a similarity from the distance between the input and each center (a Gaussian, for example) and whose output layer takes a linearly weighted vote over those similarities. The variables to learn are the centers μₘ and the votes βₘ."
    context: "Techniques Lecture 14 derives it from the Gaussian SVM and points out that historically it is a type of neural network."
    links:
      - label: "Techniques Lecture 14 handout"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/214_handout.pdf"
  - term: "prototype"
    aliases: ["center"]
    definition: "A center μₘ of an RBF network when the centers are far fewer than the examples. Each prototype speaks for a cluster of examples that are close to one another."
    context: "Techniques Lecture 14 treats using fewer centers as a form of regularization and finds the prototypes with k-means."
  - term: "k-means"
    aliases: ["k-Means"]
    definition: "A clustering algorithm: with the centers fixed, assign every example to its closest center; with the clusters fixed, move every center to the average of its cluster; alternate the two steps until the clusters stop changing."
    context: "Techniques Lecture 14 uses it to find prototypes for the RBF network; the k here is the number of clusters and has nothing to do with the k in k nearest neighbor."
  - term: "exact interpolation"
    definition: "The learned function passes through every training example, so the training error is 0. This is what happens in the full Gaussian RBF network with β = Z⁻¹y."
    context: "Techniques Lecture 14 points out that this is good for function approximation but carries a risk of overfitting in machine learning."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-htlin-ml-rbf-network-matrix-factorization)

**Video status: Videos included.** This article is written from the official MOOC handout [214_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/214_handout.pdf) and transcripts of the four official videos for this lecture, with formulas following the handout. The transcripts are machine transcripts made for this article (Whisper), not official captions, and no human has proofread them. The videos are taught in Mandarin; the slides are in English. Each section opens with its official video and the approximate time ranges. Page numbers refer to the number at the lower right of each slide (0/24 to 24/24), and wherever the text says "in the lecture" it is paraphrasing what is said in the video.

This is Techniques Lecture 14 in [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en). The Roadmap on page 1 of the handout divides Techniques into three ways of handling features, and this lecture belongs to the third, Distilling Implicit Features: Extraction Models, where the feature transform itself is something to be learned. The previous lecture, [Techniques Lecture 13: Deep Learning](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-13-deep-learning-en), takes up a single sentence on that page: pre-training with denoising autoencoder and fine-tuning with backprop for NNet with many layers. This lecture switches to a different kind of hidden layer: instead of taking inner products, it computes how far the input is from a few centers.

There are four prerequisites: the Gaussian kernel and Gaussian SVM from [Techniques Lecture 3](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm-en), the closed-form solution of linear regression from [Foundations Lecture 9](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression-en), ridge regression from [Foundations Lecture 14](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-14-regularization-en), and taking a gradient with respect to a vector. After reading, you should be able to write down the RBF network hypothesis and say how it differs from the Gaussian SVM and from a neural network; derive $\boldsymbol{\beta} = \mathrm{Z}^{-1}\mathbf{y}$ for the full RBF network and explain why the training error is 0; and derive the two steps of k-means from the clustering error function and run them by hand on a small data set until convergence.

The route through the whole lecture:

1. **Revisit the Gaussian SVM**: it is a linear combination of a bunch of Gaussians.
2. **Generalize**: treat both the centers $\boldsymbol{\mu}_m$ and the votes $\beta_m$ as variables to learn, which gives the RBF network.
3. **The laziest centers**: use every example as a center. This road leads to nearest neighbor, and also to overfitting with $E_{\text{in}} = 0$.
4. **Regularize**: add ridge, or cut the centers down to a few prototypes.
5. **Find the prototypes**: k-means.
6. **Put it together**: k-means finds the centers, the RBF does the transform, and a linear model computes the votes.

## What an RBF network looks like: reading the Gaussian SVM as a similarity vote over centers

```youtube
url: https://www.youtube.com/watch?v=7lHhnpdPVr0
title: Radial Basis Function Network :: RBF Network Hypothesis @ Machine Learning Techniques (機器學習技法)
```

(Video 00:18–01:33 reviews the previous lecture, 01:33–04:59 revisits the Gaussian SVM, 05:00–06:47 compares with the neural network, 06:47–08:56 writes down the hypothesis, 09:00–12:31 discusses RBF and similarity, and Fun Time follows.)

### Looking back from the result of the Gaussian SVM

Page 2 of the handout copies down the Gaussian SVM from Techniques Lecture 3:

$$
g_{\text{SVM}}(\mathbf{x}) = \text{sign}\Big(\sum_{\text{SV}} \alpha_n y_n \exp\big(-\gamma\lVert\mathbf{x} - \mathbf{x}_n\rVert^2\big) + b\Big)
$$

Back then the story was about finding the fattest boundary in an infinite-dimensional space. This time the lecture reads it from the result: the final hypothesis is a linear combination of a bunch of Gaussians, each centered at a support vector $\mathbf{x}_n$.

Another name for the Gaussian kernel is the Radial Basis Function (RBF) kernel. The handout splits the name into two halves:

- **radial**: the function value only depends on the distance between $\mathbf{x}$ and the 'center' $\mathbf{x}_n$. In the lecture, Lin stresses the "only": it depends on the distance between these two points and on nothing else.
- **basis function**: a function to be 'combined'. In the Gaussian SVM, the combination coefficients are $\alpha_n y_n$.

The handout then defines $g_n(\mathbf{x}) = y_n \exp(-\gamma\lVert\mathbf{x} - \mathbf{x}_n\rVert^2)$, so that

$$
g_{\text{SVM}}(\mathbf{x}) = \text{sign}\Big(\sum_{\text{SV}} \alpha_n g_n(\mathbf{x}) + b\Big)
$$

The physical meaning the lecture gives $g_n$ is this: check whether the new $\mathbf{x}$ is close enough to $\mathbf{x}_n$; the closer it is, the more votes it gets, and the votes go to the $y_n$ side. Each $g_n$ can be thought of as one small hypothesis in the sense of the aggregation discussion in [Techniques Lecture 7](/posts/ai/2026-09-30-ntu-htlin-ml-blending-bagging-adaboost-en), $\alpha_n$ is the weight in the linear combination, and only the support vectors, those with $\alpha_n \ne 0$, need to be computed. The handout's phrase is linear aggregation of selected radial hypotheses.

Take away "selected" and what remains is the subject of this lecture. The definition on page 2 of the handout is a single line: **an RBF network is a linear aggregation of radial hypotheses.**

### Why it is called a "network": only the hidden layer differs

Page 3 draws the neural network of [Techniques Lecture 12](/posts/ai/2026-09-30-ntu-htlin-ml-neural-network-deep-learning-en) and the RBF network side by side. The two figures share one skeleton: the inputs $x_0 = 1, x_1, \dots, x_d$ on the left, a layer of nodes in the middle, and one output node on the right. The difference is in the labels:

| | Neural network | RBF network |
|---|---|---|
| Hidden-layer nodes | tanh | RBF |
| Connections from input to hidden layer | weights $w_{ij}^{(1)}$ | centers |
| What the hidden layer does | inner product, then tanh | distance, then Gaussian |
| Connections from hidden layer to output | weights $w_{j1}^{(2)}$ | votes |
| What the output layer does | linear aggregation | linear aggregation |

The handout's conclusion is hidden layer different, output layer same, and it says the RBF network is historically a type of NNet. In the lecture, Lin adds the question that research on it asked at the time: what can be done once the neurons are replaced with functions that depend on distance.

### The hypothesis written out in full

Page 4 writes down the RBF network hypothesis:

$$
h(\mathbf{x}) = \text{Output}\Big(\sum_{m=1}^{M} \beta_m \,\text{RBF}(\mathbf{x}, \boldsymbol{\mu}_m) + b\Big)
$$

Four things in this expression have to be decided:

- **RBF**: which radial basis function to use. The Gaussian is only one of them.
- **Output**: how the output is transformed. In the lecture, Lin says it depends on whether the problem is regression or classification; for binary classification, take the sign.
- **The centers $\boldsymbol{\mu}_m$**: which $M$ points to refer to.
- **The votes $\beta_m$**: what the similarity to each center is multiplied by. They can be positive or negative; the handout writes (signed) votes.

The handout marks the last two as the key variables and states the learning task in one sentence: given RBF and Output, decide $\boldsymbol{\mu}_m$ and $\beta_m$. The $b$ on the slide is printed in gray, and from page 7 on every RBF network formula omits it; this article follows the handout.

The Gaussian SVM is a special case of this hypothesis. Its four choices are:

| Component of the RBF network | The Gaussian SVM's choice |
|---|---|
| RBF | Gaussian |
| Output | sign (binary classification) |
| $M$ | the number of support vectors |
| $\boldsymbol{\mu}_m$ | the support vectors $\mathbf{x}_m$ |
| $\beta_m$ | $\alpha_m y_m$ from the SVM dual |

### RBF is one kind of similarity, the kernel is another

Page 5 places RBF in a bigger picture. The slide draws a large box titled general similarity function between $\mathbf{x}$ and $\mathbf{x}'$, with two overlapping smaller boxes inside it:

| Function | Definition | Which box it is in |
|---|---|---|
| Neuron | $\tanh(\gamma\mathbf{x}^\top\mathbf{x}' + 1)$ | the large box only (a general similarity) |
| DNASim | $\text{EditDistance}(\mathbf{x}, \mathbf{x}')$ | the large box only |
| Poly | $(1 + \mathbf{x}^\top\mathbf{x}')^2$ | kernel |
| Gaussian | $\exp(-\gamma\lVert\mathbf{x} - \mathbf{x}'\rVert^2)$ | the overlap of kernel and RBF |
| Truncated | $[\![\lVert\mathbf{x} - \mathbf{x}'\rVert \le 1]\!]\,(1 - \lVert\mathbf{x} - \mathbf{x}'\rVert)^2$ | RBF |

The definitions of the two smaller boxes:

- **kernel**: similarity via a $\mathcal{Z}$-space inner product, that is, transform the two points and then take the inner product. Because there is an inner product behind it, it is governed by Mercer's condition (Techniques Lecture 3).
- **RBF**: similarity via $\mathcal{X}$-space distance. The handout says it is often monotonically non-increasing to distance. In the lecture, Lin explains that since it is meant to express similarity, the closer two points are, the larger the similarity should be.

The Gaussian satisfies both, and the lecture says it sits in the intersection of the two. The Truncated row is not discussed in the lecture; reading it off the formula: the value is 1 at distance 0, $(1 - 0.5)^2 = 0.25$ at distance 0.5, drops to 0 at distance 1, and stays 0 beyond 1. It looks only at the distance and gets smaller as the distance grows, so it is an RBF.

The lecture spends a passage on each of the other two examples. A neuron can also be seen as comparing similarity: it compares the input vector with the weight vector, taking an inner product and then passing it through an S-shaped function. A DNA sequence is a kind of string, and how alike two sequences are can be measured with the edit distance, the minimum number of edits needed to change one string into the other; in the lecture, Lin says this kind of similarity is not necessarily a kernel and not necessarily an RBF.

The conclusion of this page: **the RBF network uses distance similarity-to-centers as its feature transform.** The lecture states it more broadly: similarity is in itself a good way to define a feature transform, and if you have some other way of measuring similarity, even one that has nothing to do with distance and is not a kernel, you can still consider using it as a transform.

### Fun Time: which one is not a radial basis function

**Question (page 6):** Which of the following is not a radial basis function?

1. $\phi(\mathbf{x}, \boldsymbol{\mu}) = \exp(-\gamma\lVert\mathbf{x} - \boldsymbol{\mu}\rVert^2)$
2. $\phi(\mathbf{x}, \boldsymbol{\mu}) = -\sqrt{\mathbf{x}^\top\mathbf{x} - 2\mathbf{x}^\top\boldsymbol{\mu} + \boldsymbol{\mu}^\top\boldsymbol{\mu}}$
3. $\phi(\mathbf{x}, \boldsymbol{\mu}) = [\![\mathbf{x} = \boldsymbol{\mu}]\!]$
4. $\phi(\mathbf{x}, \boldsymbol{\mu}) = \mathbf{x}^\top\mathbf{x} + \boldsymbol{\mu}^\top\boldsymbol{\mu}$

**Answer: 4.** There is a single test: can the function value be computed from $\lVert\mathbf{x} - \boldsymbol{\mu}\rVert$ alone?

- Choice 1 is the Gaussian.
- In choice 2, the three terms under the square root are the expansion of $(\mathbf{x} - \boldsymbol{\mu})^\top(\mathbf{x} - \boldsymbol{\mu}) = \lVert\mathbf{x} - \boldsymbol{\mu}\rVert^2$, so the whole function is $-\lVert\mathbf{x} - \boldsymbol{\mu}\rVert$. The handout's answer says it contains an $\lVert\mathbf{x} - \boldsymbol{\mu}\rVert^2$ somewhere.
- Choice 3 equals $[\![\lVert\mathbf{x} - \boldsymbol{\mu}\rVert = 0]\!]$. The handout says it is an extreme case of the Gaussian with $\gamma \to \infty$: at distance 0, $\exp(0) = 1$; at a nonzero distance, $\exp(-\gamma \cdot \text{positive number}) \to 0$.
- Choice 4 cannot be expressed with the distance alone. A counterexample added in this article: with $\mathbf{x} = \boldsymbol{\mu} = (0, 0)$ the distance is 0 and the function value is 0; with $\mathbf{x} = \boldsymbol{\mu} = (1, 0)$ the distance is also 0, yet the function value is 2. The same distance gives different values, so the function is not radial. Compared with what is under the square root in choice 2, it lacks the $-2\mathbf{x}^\top\boldsymbol{\mu}$ term, which is exactly the part that ties the two points together.

## How to set the centers and votes: from every example as a center to a few prototypes

```youtube
url: https://www.youtube.com/watch?v=dEYdx2rS66c
title: Radial Basis Function Network :: RBF Network Learning @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–02:29 covers the full RBF network, 02:39–06:56 nearest neighbor, 06:56–14:44 the closed-form solution for regression and exact interpolation, 14:44–17:28 regularization and the comparison with kernel ridge regression, 17:28–19:12 using fewer centers, and Fun Time follows.)

### The full RBF network: every example is a center

Where should the centers go? Page 7 first tries the least effort: $M = N$ and each $\boldsymbol{\mu}_m = \mathbf{x}_m$, which the handout calls the full RBF network. Its physical meaning is that every example $\mathbf{x}_m$ seen so far influences the $\mathbf{x}$ near it, and the size of the influence is $\beta_m$.

If you do not want to learn $\beta_m$ either, you can give every example the same influence. For binary classification, take $\beta_m = 1 \cdot y_m$:

$$
g_{\text{uniform}}(\mathbf{x}) = \text{sign}\Big(\sum_{m=1}^{N} y_m \exp\big(-\gamma\lVert\mathbf{x} - \mathbf{x}_m\rVert^2\big)\Big)
$$

In the lecture, Lin puts it this way: it starts as one person, one vote, but votes from far away are discounted and votes from nearby count a bit more; add up every example's opinion weighted by similarity and see whether the total comes out $+1$ or $-1$. The handout says this is to aggregate each example's opinion subject to similarity, and it calls the full RBF network a lazy way to decide $\boldsymbol{\mu}_m$.

### Listening only to the closest one: nearest neighbor

Page 8 goes one step lazier than $g_{\text{uniform}}$. Every term in the sum is a Gaussian, and the term for whichever $\mathbf{x}_m$ is closest to $\mathbf{x}$ is the largest. A Gaussian decays quickly with distance, so the handout says the maximum one often dominates the whole sum. The scenario given in the lecture: there are a thousand people, and you would have to ask all thousand for their opinion before taking the vote; since the person holding the most votes usually decides the outcome, you might as well find that person and use that opinion as the answer.

This replaces aggregation with selection (the terms of Techniques Lecture 7), and the resulting model is

$$
g_{\text{nbor}}(\mathbf{x}) = y_m \quad \text{such that } \mathbf{x} \text{ closest to } \mathbf{x}_m
$$

which is **nearest neighbor**: among the examples seen, find the one closest to $\mathbf{x}$ and return its label. The handout goes on to say you can also uniformly aggregate the $k$ closest neighbors, which is called **k nearest neighbor**. The lecture places it like this: asking three or five neighbors to vote sits between "everyone votes" and "only one person votes", and is usually a little better than asking just one person.

The handout's verdict on k nearest neighbor is also lazy but very intuitive. In the lecture, Lin explains what lazy means: training does almost nothing, it just memorizes the data; only at prediction time does the model compute similarities and look for the closest examples, so prediction takes more effort.

### Numerical example 1: voting and nearest neighbor with three examples

The following is an example made up for this article, not from the slides. Three one-dimensional examples:

| $m$ | $x_m$ | $y_m$ |
|---|---|---|
| 1 | $0$ | $+1$ |
| 2 | $1$ | $+1$ |
| 3 | $2$ | $-1$ |

To keep the numbers easy, take $\gamma = \ln 2$, so that $\exp(-\gamma d^2) = 2^{-d^2}$: the similarity is $\frac{1}{2}$ at distance 1, $\frac{1}{16}$ at distance 2, and $\frac{1}{512}$ at distance 3.

**Predicting at $x = 3$.** The distances to the three examples are 3, 2, and 1:

$$
\sum_m y_m 2^{-(3 - x_m)^2} = \frac{1}{512} + \frac{1}{16} - \frac{1}{2} = -\frac{223}{512}
$$

$g_{\text{uniform}}(3) = -1$. The largest term is the $\frac{1}{2}$ from example 3, and the other two together come to less than $0.07$; this is "the maximum one dominates the sum". Nearest neighbor looks at the closest example, example 3, and also answers $-1$.

**Predicting at $x = 1.6$.** The distances are 1.6, 0.6, and 0.4, and the three terms are, in order, $2^{-2.56} \approx 0.170$, $2^{-0.36} \approx 0.779$, and $2^{-0.16} \approx 0.895$:

$$
0.170 + 0.779 - 0.895 = +0.054
$$

$g_{\text{uniform}}(1.6) = +1$, but the closest example is example 3, so $g_{\text{nbor}}(1.6) = -1$. Here the largest term cannot beat the other two combined. The handout writes often dominates, and this point is a case outside "often": the two models agree far from the boundary and may disagree near it.

### Learning the votes: the closed-form solution for regression

Page 9 no longer sets $\beta_m$ directly to $y_m$. The centers stay fixed at the examples, and $\beta_m$ is learned by optimization. The problem chosen is regression with squared error, so Output applies no transform (the slide crosses Output out):

$$
h(\mathbf{x}) = \sum_{m=1}^{N} \beta_m \,\text{RBF}(\mathbf{x}, \mathbf{x}_m)
$$

With the centers fixed, each example can first be transformed into an $N$-dimensional vector

$$
\mathbf{z}_n = \big[\text{RBF}(\mathbf{x}_n, \mathbf{x}_1),\ \text{RBF}(\mathbf{x}_n, \mathbf{x}_2),\ \dots,\ \text{RBF}(\mathbf{x}_n, \mathbf{x}_N)\big]
$$

$h(\mathbf{x}_n) = \boldsymbol{\beta}^\top\mathbf{z}_n$ is linear in $\boldsymbol{\beta}$, so this is just linear regression on the RBF-transformed data. Stack the $\mathbf{z}_n$ row by row into a matrix $\mathrm{Z}$, and the closed-form solution from Foundations Lecture 9 applies directly:

$$
\boldsymbol{\beta} = (\mathrm{Z}^\top\mathrm{Z})^{-1}\mathrm{Z}^\top\mathbf{y} \qquad \text{(if } \mathrm{Z}^\top\mathrm{Z} \text{ is invertible)}
$$

This $\mathrm{Z}$ is special in two ways. First, it has $N$ rows (examples) and $N$ columns (centers), so it is square. Second, entry $(n, m)$ is $\text{RBF}(\mathbf{x}_n, \mathbf{x}_m)$, which depends only on the distance between the two points and does not change when $n$ and $m$ are swapped, so the matrix is symmetric.

The handout then gives a theoretical fact without proof: if the $\mathbf{x}_n$ are all different, the $\mathrm{Z}$ produced by the Gaussian RBF is invertible. In the lecture, Lin says that having all examples different is a very common situation. An addition in this article, checking the case of two examples: the diagonal of $\mathrm{Z}$ is 1, the other two entries are $a = \exp(-\gamma\lVert\mathbf{x}_1 - \mathbf{x}_2\rVert^2)$, and the determinant is $1 - a^2$. When the two points differ, $a < 1$, the determinant is greater than 0, and the matrix is invertible; when the two points coincide, $a = 1$ and the determinant is 0. The general $N$ is not proved here.

Since $\mathrm{Z}$ is both symmetric and invertible, the closed-form solution simplifies. Symmetry means $\mathrm{Z}^\top = \mathrm{Z}$; the inverse of a product of two invertible matrices is the product of their inverses in reverse order:

$$
\boldsymbol{\beta} = (\mathrm{Z}\mathrm{Z})^{-1}\mathrm{Z}\mathbf{y} = \mathrm{Z}^{-1}\mathrm{Z}^{-1}\mathrm{Z}\mathbf{y} = \mathrm{Z}^{-1}\mathbf{y}
$$

In the lecture, Lin describes it as an inverse and a non-inverse canceling each other, leaving a result more compact than the original formula.

### The training error is exactly 0: exact interpolation

Page 10 substitutes $\boldsymbol{\beta} = \mathrm{Z}^{-1}\mathbf{y}$ back and looks at the output on the training data. Take $\mathbf{x}_1$:

$$
g_{\text{RBF}}(\mathbf{x}_1) = \boldsymbol{\beta}^\top\mathbf{z}_1 = \mathbf{y}^\top\mathrm{Z}^{-1}\,(\text{first column of } \mathrm{Z}) = \mathbf{y}^\top\begin{bmatrix} 1 & 0 & \cdots & 0 \end{bmatrix}^\top = y_1
$$

The reason for each equality:

1. $\boldsymbol{\beta}^\top = (\mathrm{Z}^{-1}\mathbf{y})^\top = \mathbf{y}^\top(\mathrm{Z}^{-1})^\top$. $\mathrm{Z}$ is symmetric, so $\mathrm{Z}^{-1}$ is symmetric too, and the transpose can be dropped.
2. $\mathbf{z}_1$ is the first row of $\mathrm{Z}$; because $\mathrm{Z}$ is symmetric, it is also the first column of $\mathrm{Z}$.
3. $\mathrm{Z}^{-1}\mathrm{Z} = \mathrm{I}$, so $\mathrm{Z}^{-1}$ times the first column of $\mathrm{Z}$ gives the first column of $\mathrm{I}$, the vector whose only nonzero entry is a 1 in the first position.
4. The inner product of $\mathbf{y}$ with this vector keeps only $y_1$.

The derivation is the same for every other $n$, so $g_{\text{RBF}}(\mathbf{x}_n) = y_n$ holds for every training example, and $E_{\text{in}}(g_{\text{RBF}}) = 0$.

Here the handout writes "yeah!! :-)", and one line later asks: overfitting for learning? In the lecture, Lin says that by this point in the course, seeing $E_{\text{in}} = 0$ should feel a little off. In function approximation, a part of applied mathematics, this property is a good thing and is called **exact interpolation**: you approximate a function from some known points, the curve passes through every one of them, and the interpolation is perfect. Data in machine learning comes with noise, and passing through every point carries the risk of overfitting.

### Numerical example 2: β for three examples

This example is also made up for this article. Reuse the three examples and $\gamma = \ln 2$ from numerical example 1, this time treating $y$ as a real number and doing regression. $\mathrm{Z}$ is

$$
\mathrm{Z} = \begin{bmatrix} 1 & \frac{1}{2} & \frac{1}{16} \\ \frac{1}{2} & 1 & \frac{1}{2} \\ \frac{1}{16} & \frac{1}{2} & 1 \end{bmatrix}, \qquad \mathbf{y} = \begin{bmatrix} 1 \\ 1 \\ -1 \end{bmatrix}
$$

The three $x$ are all different, so $\mathrm{Z}$ is invertible (its determinant is $\frac{135}{256}$). Solving the three linear equations $\mathrm{Z}\boldsymbol{\beta} = \mathbf{y}$ gives

$$
\boldsymbol{\beta} = \mathrm{Z}^{-1}\mathbf{y} = \Big(\frac{8}{45},\ \frac{17}{9},\ -\frac{88}{45}\Big) \approx (0.178,\ 1.889,\ -1.956)
$$

Substitute back to check, over a common denominator of 720:

- Example 1: $\frac{8}{45} + \frac{1}{2}\cdot\frac{17}{9} - \frac{1}{16}\cdot\frac{88}{45} = \frac{128 + 680 - 88}{720} = 1$
- Example 2: $\frac{1}{2}\cdot\frac{8}{45} + \frac{17}{9} - \frac{1}{2}\cdot\frac{88}{45} = \frac{4 + 85 - 44}{45} = 1$
- Example 3: $\frac{1}{16}\cdot\frac{8}{45} + \frac{1}{2}\cdot\frac{17}{9} - \frac{88}{45} = \frac{8 + 680 - 1408}{720} = -1$

All three are hit exactly, and $E_{\text{in}} = 0$.

**What this result means.** The votes and the labels are no longer the same thing. Examples 1 and 2 both have label $+1$, yet their votes differ by a factor of ten; example 2 sits in the middle and has to cancel the negative vote coming over from example 3, so it gets a large positive vote. To pass through every point, $\boldsymbol{\beta}$ is stretched long: $\lVert\boldsymbol{\beta}\rVert^2 \approx 7.42$. Away from the training points, $g_{\text{RBF}}(1.5) \approx -0.019$, $g_{\text{RBF}}(3) = -\frac{55}{64} \approx -0.859$, and $g_{\text{RBF}}(4) \approx -0.119$; the farther from all the data, the closer the output is to 0.

### The first remedy: ridge on β

The lower half of page 10 proposes the first kind of regularization: replace the linear regression step with ridge regression,

$$
\boldsymbol{\beta} = (\mathrm{Z}^\top\mathrm{Z} + \lambda\mathrm{I})^{-1}\mathrm{Z}^\top\mathbf{y}
$$

In the lecture, Lin says the full RBF network often needs regularization added, out of concern that driving $E_{\text{in}}$ to 0 will overfit.

The handout then asks: seen $\mathrm{Z}$ before? Each entry of $\mathrm{Z}$ is the Gaussian between two examples, so it is the Gaussian kernel matrix $\mathrm{K}$. The kernel ridge regression of [Techniques Lecture 6](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-06-support-vector-regression-en) also computes a coefficient in front of each Gaussian, and the handout sets the two formulas side by side:

| Method | Closed-form solution | Where the regularization acts |
|---|---|---|
| kernel ridge regression | $\boldsymbol{\beta} = (\mathrm{K} + \lambda\mathrm{I})^{-1}\mathbf{y}$ | the infinite-dimensional transform |
| regularized full RBFNet | $\boldsymbol{\beta} = (\mathrm{Z}^\top\mathrm{Z} + \lambda\mathrm{I})^{-1}\mathrm{Z}^\top\mathbf{y}$ | the $N$-dimensional transform |

The "where the regularization acts" column is what the lecture says; the handout only writes effect of regularization in different spaces. $\mathrm{Z}$ and $\mathrm{K}$ are the same matrix, yet the two formulas differ, because the quantity being penalized differs.

An addition in this article: write out the objectives the two sides minimize and compare them. The kernel ridge regression of Techniques Lecture 6 penalizes $\mathbf{w}^\top\mathbf{w}$ in the $\mathcal{Z}$ space, which expressed in $\boldsymbol{\beta}$ is $\boldsymbol{\beta}^\top\mathrm{K}\boldsymbol{\beta}$; the ridge here treats $\mathbf{z}_n$ as an ordinary $N$-dimensional feature vector and penalizes $\boldsymbol{\beta}^\top\boldsymbol{\beta}$:

$$
\min_{\boldsymbol{\beta}}\ \lambda\,\boldsymbol{\beta}^\top\mathrm{K}\boldsymbol{\beta} + \lVert\mathbf{y} - \mathrm{K}\boldsymbol{\beta}\rVert^2 \qquad\text{versus}\qquad \min_{\boldsymbol{\beta}}\ \lambda\,\boldsymbol{\beta}^\top\boldsymbol{\beta} + \lVert\mathbf{y} - \mathrm{Z}\boldsymbol{\beta}\rVert^2
$$

The gradient of the left side with respect to $\boldsymbol{\beta}$ is $2\mathrm{K}\big((\mathrm{K} + \lambda\mathrm{I})\boldsymbol{\beta} - \mathbf{y}\big)$, and one solution that makes it 0 is $(\mathrm{K} + \lambda\mathrm{I})^{-1}\mathbf{y}$; the gradient of the right side is $2\big((\mathrm{Z}^\top\mathrm{Z} + \lambda\mathrm{I})\boldsymbol{\beta} - \mathrm{Z}^\top\mathbf{y}\big)$, and its solution is the second formula in the table. The handouts for Techniques Lecture 6 and Foundations Lecture 14 write an extra $\frac{1}{N}$ in front of both terms; multiplying the whole objective by $N$ does not change where the minimum occurs, so it is omitted here.

Running this once on the data of numerical example 2 with $\lambda = 1$ (computed for this article):

| Approach | $\boldsymbol{\beta}$ | Outputs on the three training examples | $E_{\text{in}}$ (mean squared error) | $\lVert\boldsymbol{\beta}\rVert^2$ |
|---|---|---|---|---|
| no regularization, $\mathrm{Z}^{-1}\mathbf{y}$ | $(0.178,\ 1.889,\ -1.956)$ | $(1,\ 1,\ -1)$ | $0$ | $7.42$ |
| regularized full RBFNet, $\lambda = 1$ | $(0.548,\ 0.359,\ -0.450)$ | $(0.700,\ 0.409,\ -0.236)$ | $0.341$ | $0.63$ |
| kernel ridge regression, $\lambda = 1$ | $(0.378,\ 0.569,\ -0.654)$ | $(0.622,\ 0.431,\ -0.346)$ | $0.298$ | $0.89$ |

With regularization the curve no longer passes through every point and $\boldsymbol{\beta}$ is much shorter; the two kinds of regularization do give different $\boldsymbol{\beta}$. With a smaller $\lambda$, say $0.001$, the outputs of the regularized full RBFNet are $(1.002,\ 0.995,\ -0.996)$, almost back to exact interpolation.

### The second remedy: fewer centers

Page 11 looks at the Gaussian SVM once more. Its "network" uses only the support vectors, far fewer than $N$. The numbers given in the lecture: with a thousand examples there may be only a hundred support vectors, so only a hundred centers end up being used.

So another kind of regularization is simply to make $M \ll N$. In the lecture, Lin says fifty centers, or even ten, may be enough for a thousand examples. The handout describes the effect as regularization by constraining number of centers and voting weights: with fewer centers, there are also fewer weights $\beta_m$ for the second layer to learn.

The handout calls the physical meaning of these centers **prototypes**. The lecture's analogy is electing representatives: a thousand people do not all have to vote directly; first elect a few people who can represent everyone's opinions. The question this section leaves open is how to extract prototypes.

### Fun Time: Z when two examples are identical

**Question (page 12):** If $\mathbf{x}_1 = \mathbf{x}_2$, what happens in the $\mathrm{Z}$ matrix of the full Gaussian RBF network?

1. the first two rows of the matrix are the same
2. the first two columns of the matrix are different
3. the matrix is invertible
4. the sub-matrix at the intersection of the first two rows and the first two columns contains a constant of 0

**Answer: 1.** Entry $m$ of row $n$ is $\text{RBF}(\mathbf{x}_n, \mathbf{x}_m)$. When $\mathbf{x}_1 = \mathbf{x}_2$, $\text{RBF}(\mathbf{x}_1, \mathbf{x}_m) = \text{RBF}(\mathbf{x}_2, \mathbf{x}_m)$ holds for every $m$, so the first two rows agree entry by entry.

- Choice 2 is wrong: $\mathrm{Z}$ is symmetric, so if the first two rows are the same, the first two columns are the same too.
- Choice 3 is wrong: a matrix with two identical rows is singular and not invertible. The premise of the "invertible" fact is that all $\mathbf{x}_n$ are different, and this question breaks exactly that premise.
- Choice 4 is wrong: all four entries of that $2 \times 2$ sub-matrix are Gaussians between two identical points, with value $\exp(-0) = 1$, not 0.

A check in this article: take $x_1 = x_2 = 0$, $x_3 = 1$, and $\gamma = \ln 2$,

$$
\mathrm{Z} = \begin{bmatrix} 1 & 1 & \frac{1}{2} \\ 1 & 1 & \frac{1}{2} \\ \frac{1}{2} & \frac{1}{2} & 1 \end{bmatrix}
$$

The first two rows are the same and the determinant is 0. In this case $\mathrm{Z}^{-1}\mathbf{y}$ cannot be computed; and if these two identical $x$ come with different $y$, no curve can pass through both points at once.

## How to find the prototypes: k-means alternates between optimizing the clusters and the centers

```youtube
url: https://www.youtube.com/watch?v=ker9RF2TDUU
title: Radial Basis Function Network :: k-Means Algorithm @ Machine Learning Techniques (機器學習技法)
```

(Video 00:01–03:33 writes finding prototypes as a clustering problem, 03:33–07:02 covers how to partition with the centers fixed, 07:02–10:00 how to set the centers with the partition fixed, 10:00–13:37 the k-means algorithm and convergence, 13:37–15:31 connects k-means to the RBF network, and Fun Time follows.)

### Good prototypes: a clustering problem

Page 13 starts from an observation. If $\mathbf{x}_1 \approx \mathbf{x}_2$, the network has no need for both $\text{RBF}(\mathbf{x}, \mathbf{x}_1)$ and $\text{RBF}(\mathbf{x}, \mathbf{x}_2)$. The reason given in the lecture is that the functions these two RBFs represent are very close, so keeping one is enough. So cluster $\mathbf{x}_1$ and $\mathbf{x}_2$ together and let them share one prototype $\boldsymbol{\mu} \approx \mathbf{x}_1 \approx \mathbf{x}_2$.

This is clustering, which [Foundations Lecture 3](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-03-types-of-learning-en) mentioned as the typical case of unsupervised learning. The version the handout sets out to solve has two actions:

- **partition**: partition $\{\mathbf{x}_n\}$ to disjoint sets $S_1, S_2, \dots, S_M$. In the lecture, Lin explains that disjoint means each example can belong to only one cluster, and later adds the other half: no example may be left without a cluster.
- **choose**: choose a prototype $\boldsymbol{\mu}_m$ for each $S_m$.

The hope is that when $\mathbf{x}_1$ and $\mathbf{x}_2$ both belong to $S_m$, $\boldsymbol{\mu}_m$ is close to both. The reason given in the lecture: if a prototype is far from the example it represents, the RBF built on it differs a lot from that example's own RBF and cannot stand in for it.

Write "close" as an error, using squared distance:

$$
E_{\text{in}}(S_1, \dots, S_M;\ \boldsymbol{\mu}_1, \dots, \boldsymbol{\mu}_M) = \frac{1}{N}\sum_{n=1}^{N}\sum_{m=1}^{M} [\![\mathbf{x}_n \in S_m]\!]\,\lVert\mathbf{x}_n - \boldsymbol{\mu}_m\rVert^2
$$

$[\![\cdot]\!]$ is 1 when the condition holds and 0 otherwise. For a fixed $n$, only one term of the inner sum survives: the $\lVert\mathbf{x}_n - \boldsymbol{\mu}_m\rVert^2$ of the cluster $\mathbf{x}_n$ belongs to. The lecture's example: if $\mathbf{x}_n$ belongs to the third cluster, only the $m = 3$ term has $[\![\cdot]\!]$ equal to 1. So $E_{\text{in}}$ is the average of "the squared distance from each example to its own prototype", which Lin describes in the lecture as how much I disagree with the opinion that represents me.

The goal is to minimize $E_{\text{in}}$ over the clusters and the prototypes jointly, under the constraint that $S_1, \dots, S_M$ form a partition.

### Fix the centers, decide the partition

Page 14 first says why this problem is hard: it is a joint combinatorial-numerical optimization. The prototypes are real-valued vectors, which is numerical optimization; the clustering decides which slot each example goes into, which is combinatorial optimization, where in the lecture's words every example needs a slot of its own. The lecture also mentions that problems mixing the two are rare in this course; the one time they came up before was minimizing the number of mistakes for the perceptron ([Foundations Lecture 2](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm-en)): $\mathbf{w}$ is numerical, and the number of mistakes is combinatorial.

The handout's answer: there are two sets of variables, so optimize alternatingly, fixing one set and solving for the other each time. The minimization formulas on pages 14 and 15 drop the leading $\frac{1}{N}$; it is a positive constant and does not affect where the minimum occurs.

First fix $\boldsymbol{\mu}_1, \dots, \boldsymbol{\mu}_M$. Now the contribution of each $\mathbf{x}_n$ to $E_{\text{in}}$ depends only on which cluster it is put into, not on how the other examples are assigned, so the decision can be made one example at a time. For one $\mathbf{x}_n$:

- $[\![\mathbf{x}_n \in S_m]\!]$ requires it to choose one and only one subset.
- The cost of choosing cluster $m$ is $\lVert\mathbf{x}_n - \boldsymbol{\mu}_m\rVert^2$, and these $M$ numbers are all known once the centers are fixed.

To pay the least, choose the cluster with the minimum $\lVert\mathbf{x}_n - \boldsymbol{\mu}_m\rVert^2$. The handout's conclusion: for given $\boldsymbol{\mu}_1, \dots, \boldsymbol{\mu}_M$, each $\mathbf{x}_n$ 'optimally partitioned' using its closest $\boldsymbol{\mu}_m$.

### Fix the partition, decide the centers

Page 15 does the reverse and fixes $S_1, \dots, S_M$. The values of $[\![\mathbf{x}_n \in S_m]\!]$ are all determined, the combinatorial part disappears, and what remains is an unconstrained optimization for each $\boldsymbol{\mu}_m$, solved by setting the gradient to zero.

When taking the gradient with respect to $\boldsymbol{\mu}_m$, the terms of the sum that belong to other clusters contain no $\boldsymbol{\mu}_m$ and differentiate to 0. Each remaining term is $\lVert\mathbf{x}_n - \boldsymbol{\mu}_m\rVert^2 = (\mathbf{x}_n - \boldsymbol{\mu}_m)^\top(\mathbf{x}_n - \boldsymbol{\mu}_m)$, whose gradient with respect to $\boldsymbol{\mu}_m$ is $-2(\mathbf{x}_n - \boldsymbol{\mu}_m)$: differentiating the square brings down a 2, and the minus sign in front of $\boldsymbol{\mu}_m$ gives the minus sign. So

$$
\nabla_{\boldsymbol{\mu}_m} E_{\text{in}} = -2\sum_{n=1}^{N} [\![\mathbf{x}_n \in S_m]\!]\,(\mathbf{x}_n - \boldsymbol{\mu}_m) = -2\Big(\Big(\sum_{\mathbf{x}_n \in S_m} \mathbf{x}_n\Big) - \lvert S_m\rvert\,\boldsymbol{\mu}_m\Big)
$$

The second equality splits the sum into two halves: the first half adds up the $\mathbf{x}_n$ that belong to this cluster; in the second half every example contributes one $\boldsymbol{\mu}_m$, which appears $\lvert S_m\rvert$ times in total, where $\lvert S_m\rvert$ is the number of examples in this cluster. Setting the gradient to $\mathbf{0}$:

$$
\boldsymbol{\mu}_m = \frac{1}{\lvert S_m\rvert}\sum_{\mathbf{x}_n \in S_m} \mathbf{x}_n
$$

The optimal prototype is the average of the examples within the cluster. One sentence added in this article: $E_{\text{in}}$ is an upward-opening quadratic function of $\boldsymbol{\mu}_m$, so the point where the gradient is zero is the minimum. The handout's conclusion: for given $S_1, \dots, S_M$, each prototype is 'optimally computed' as consensus within $S_m$, and in the lecture Lin calls the average the consensus of the group. On the slides for this page and the next, the subscript of the prototype is printed in a few places as $\boldsymbol{\mu}_n$ or $\boldsymbol{\mu}_i$; this article writes $\boldsymbol{\mu}_m$ throughout.

### The k-means algorithm

Chaining the two steps gives the algorithm on page 16. Its historical name is **k-means**, and the number of prototypes is by convention written $k$ instead of the $M$ used so far in this lecture. Under the name the handout adds a parenthetical line: different from k nearest neighbor, though. In the lecture, Lin says the two share nothing but the letter $k$; the people who proposed the methods just happened to pick the same letter.

1. **Initialize** $\boldsymbol{\mu}_1, \boldsymbol{\mu}_2, \dots, \boldsymbol{\mu}_k$: say, as $k$ randomly chosen $\mathbf{x}_n$.
2. **Alternating optimization** of $E_{\text{in}}$: repeat the following two steps until convergence:
   1. Optimize $S_1, \dots, S_k$: assign each $\mathbf{x}_n$ to its closest center.
   2. Optimize $\boldsymbol{\mu}_1, \dots, \boldsymbol{\mu}_k$: move each center to the average of its own cluster.

Why initialization is needed, the lecture explains as a chicken-and-egg problem: the clusters are decided by the centers and the centers by the clusters, so one of them has to come first. Lin describes a personal habit of picking $k$ of the original examples at random as the starting point, and notes that different papers do it differently; a random choice is recommended because this is a hard optimization problem, and choosing at random is more likely to avoid getting stuck in a strange local optimum.

**Convergence** is defined in the handout as no change of $S_1, \dots, S_k$ anymore, and the handout says it is guaranteed because $E_{\text{in}}$ decreases during alternating minimization. The lecture states one more condition: both steps make $E_{\text{in}}$ smaller, and $E_{\text{in}}$ is bounded below by 0, so the process is bound to stop somewhere.

An addition in this article, to make "bound to stop" a little more complete. There are only finitely many ways to split $N$ examples into $k$ clusters (at most $k^N$). If step 2-1 is required to move an example to another cluster only when it finds a strictly closer center, then whenever the partition changes, $E_{\text{in}}$ strictly decreases; step 2-2 never increases $E_{\text{in}}$. A strictly decreasing $E_{\text{in}}$ means the same partition never appears twice, and the finitely many partitions eventually run out, so the algorithm stops within a finite number of rounds.

The handout sums up k-means as: the most popular clustering algorithm through alternating minimization.

### Numerical example 3: k-means by hand on six examples

The following is an example made up for this article, not from the slides. Six one-dimensional examples: $0, 1, 4, 5, 8, 9$, with three clusters visible to the eye. Take $k = 3$ and choose three of the examples, $(1, 4, 5)$, as the initial centers.

**Round 1, partition.** The midpoints between neighboring centers are 2.5 and 4.5, and the examples line up by these two boundaries: $S_1 = \{0, 1\}$, $S_2 = \{4\}$, $S_3 = \{5, 8, 9\}$. At this point the squared distances from the six examples to their own centers are $1, 0, 0, 0, 9, 16$, and $E_{\text{in}} = \frac{26}{6} = \frac{13}{3} \approx 4.33$.

**Round 1, update the centers.** $\boldsymbol{\mu} = \big(\frac{0+1}{2},\ 4,\ \frac{5+8+9}{3}\big) = \big(\frac{1}{2},\ 4,\ \frac{22}{3}\big)$. The sum of squared distances becomes $\frac{1}{4} + \frac{1}{4} + 0 + \frac{49}{9} + \frac{4}{9} + \frac{25}{9} = \frac{55}{6}$, and $E_{\text{in}} = \frac{55}{36} \approx 1.53$.

**Round 2, partition.** The new midpoints are 2.25 and $\frac{17}{3} \approx 5.67$. The example 5 is now closer to 4 than to $\frac{22}{3}$ and moves to the second cluster: $S_1 = \{0, 1\}$, $S_2 = \{4, 5\}$, $S_3 = \{8, 9\}$. $E_{\text{in}} = \frac{85}{108} \approx 0.79$.

**Round 2, update the centers.** $\boldsymbol{\mu} = \big(\frac{1}{2},\ \frac{9}{2},\ \frac{17}{2}\big)$, every example is $\frac{1}{2}$ away from its own center, and $E_{\text{in}} = \frac{1}{4}$.

**Round 3, partition.** The midpoints are 2.5 and 6.5, the partition does not change, and the algorithm stops.

| Step | Partition | Centers | $E_{\text{in}}$ |
|---|---|---|---|
| After the round 1 partition | $\{0,1\}, \{4\}, \{5,8,9\}$ | $(1,\ 4,\ 5)$ | $\frac{13}{3} \approx 4.33$ |
| After the round 1 update | same as above | $(\frac{1}{2},\ 4,\ \frac{22}{3})$ | $\frac{55}{36} \approx 1.53$ |
| After the round 2 partition | $\{0,1\}, \{4,5\}, \{8,9\}$ | same as above | $\frac{85}{108} \approx 0.79$ |
| After the round 2 update | same as above | $(\frac{1}{2},\ \frac{9}{2},\ \frac{17}{2})$ | $\frac{1}{4} = 0.25$ |

**What this result means.** $E_{\text{in}}$ goes down at every half-step, which is the convergence guarantee the handout speaks of; the three final centers each land in the very middle of a cluster. What happens to the same data under another set of initial centers is in the later subsection "When k and the starting points differ".

### Connecting to the RBF network

Page 17 writes the whole method as four steps, under the title RBF Network Using k-Means:

1. Run k-means with $k = M$ to get $\{\boldsymbol{\mu}_m\}$.
2. Construct the feature transform from the RBF (say, Gaussian) at these centers: $\boldsymbol{\Phi}(\mathbf{x}) = [\text{RBF}(\mathbf{x}, \boldsymbol{\mu}_1),\ \text{RBF}(\mathbf{x}, \boldsymbol{\mu}_2),\ \dots,\ \text{RBF}(\mathbf{x}, \boldsymbol{\mu}_M)]$.
3. Run a linear model on $\{(\boldsymbol{\Phi}(\mathbf{x}_n), y_n)\}$ to get $\boldsymbol{\beta}$.
4. Return $g_{\text{RBFNET}}(\mathbf{x}) = \text{LinearHypothesis}(\boldsymbol{\beta}, \boldsymbol{\Phi}(\mathbf{x}))$.

For the linear model in step 3, the lecture names linear regression, logistic regression, and linear SVM as all being fine.

The handout has two remarks under the algorithm. First, this is using unsupervised learning (k-means) to assist the feature transform, like the autoencoder of the previous lecture. In the lecture, Lin explains what the two have in common: when extracting features they look only at the $\mathbf{x}$ of the data, not at $y$. Second, there are two parameters to choose: $M$ (the number of prototypes), and the RBF's own parameter, such as the $\gamma$ of the Gaussian. The lecture's answer is the usual one in this course: choose with validation ([Foundations Lecture 15](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles-en)).

The verdict at the bottom of this page is RBF Network: a simple (old-fashioned) model. The lecture is blunter: not many people use RBF networks in practice, and their performance may be about the same as that of the Gaussian SVM or a neural network. The lecture gives three reasons for teaching it: it makes us think about how the models we have learned relate to one another; it gets a reasonably good hypothesis fairly simply; and it connects to k-means, which lets the course introduce a clustering technique along the way.

### Fun Time: how two centers split the plane

**Question (page 18):** For k-means, consider examples $\mathbf{x}_n \in \mathbb{R}^2$ such that all $x_{n,1}$ and $x_{n,2}$ are non-zero. When fixing two prototypes $\boldsymbol{\mu}_1 = [1, 1]$ and $\boldsymbol{\mu}_2 = [-1, 1]$, which of the following sets is the optimal $S_1$?

1. $\{\mathbf{x}_n : x_{n,1} > 0\}$
2. $\{\mathbf{x}_n : x_{n,1} < 0\}$
3. $\{\mathbf{x}_n : x_{n,2} > 0\}$
4. $\{\mathbf{x}_n : x_{n,2} < 0\}$

**Answer: 1.** The handout only hints that $S_1$ contains examples that are closer to $\boldsymbol{\mu}_1$ than $\boldsymbol{\mu}_2$. Subtract the two squared distances:

$$
\lVert\mathbf{x} - \boldsymbol{\mu}_1\rVert^2 - \lVert\mathbf{x} - \boldsymbol{\mu}_2\rVert^2 = (x_1 - 1)^2 + (x_2 - 1)^2 - (x_1 + 1)^2 - (x_2 - 1)^2 = -4x_1
$$

The $x_2$ parts cancel because the two centers have the same second coordinate. The difference is negative (closer to $\boldsymbol{\mu}_1$) if and only if $x_1 > 0$, so $S_1 = \{\mathbf{x}_n : x_{n,1} > 0\}$, and the boundary is the line $x_1 = 0$, the perpendicular bisector of the two centers. Choice 2 is $S_2$. Choices 3 and 4 cut by $x_2$, but $x_2$ affects both distances equally and cannot tell which center is closer. The question requires nonzero coordinates in order to rule out examples that fall exactly on the boundary, equidistant from both sides.

A check of one point in this article: the squared distance from $\mathbf{x} = (0.5, -3)$ to $\boldsymbol{\mu}_1$ is $0.25 + 16 = 16.25$ and to $\boldsymbol{\mu}_2$ is $2.25 + 16 = 18.25$, so it goes to $S_1$, consistent with $x_1 = 0.5 > 0$.

## Running it for real: how k and the starting points affect k-means and the RBF network

```youtube
url: https://www.youtube.com/watch?v=D5elADTz1vk
title: Radial Basis Function Network :: k-Means and RBFNet in Action @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–02:46 demonstrates k-means with k = 4, 02:46–04:36 switches to different k, 04:36–06:18 shows the classification results after connecting to the RBF network, 06:18–07:42 covers the full RBF network and nearest neighbor, 07:42–08:11 is Fun Time, and the summary follows.)

The handout for this section is almost entirely figures; what follows describes them in words.

### When k is right: six rounds to the centers of four clusters

Page 19 (titled Beauty of k-Means) is a sequence of frames. The data are points in the two-dimensional plane, forming four blobs at the top, left, right, and bottom; in the lecture, Lin says this data set was designed by the lecturer, with four clusters visible to the eye.

- **iteration 0**: the data are all black dots, and four squares are the initial centers: the light blue one at the upper edge of the top blob, the dark blue and black ones both near the right blob, and the magenta one inside the bottom blob. In the lecture, Lin says the initial centers seem to have little to do with how the data cluster.
- **iteration 1**: every point is colored by its closest center. Light blue takes most of the top blob and the upper half of the left blob, dark blue gets only a few points, black gets the right blob, and magenta gets the bottom blob and the lower half of the left blob. Then each center moves to the average of the points of its color.
- **later rounds**: the dark blue center moves into the top blob and gradually takes it over, while the light blue center moves left round by round and takes over the left blob. The lecture's description is that each round "takes in a few more people and averages again".
- **iteration 6**: the four centers are each in the middle of a blob, and each of the four colors holds one blob.

The handout's conclusion is usually works well with proper $k$ and initialization.

### When k and the starting points differ

Page 20 (Difficulty of k-Means) runs the same data once each with $k = 2, 4, 7$, showing first the starting frame and then the frame after convergence:

| | $k = 2$ | $k = 4$ | $k = 7$ |
|---|---|---|---|
| Initial centers | both near the right blob | same as page 19 | four near the right blob, two at the top, one at the bottom |
| Round at convergence (as marked on the figure) | iteration 9 | iteration 7 | iteration 6 |
| Clusters after convergence | top and right merge into one cluster, left and bottom into another | one cluster per blob | the right blob is cut into three small clusters, the top blob into two, and the left and bottom blobs are one cluster each |

About the $k = 7$ result the lecture asks a question: why aren't the seven clusters spread more evenly, instead of the right side being cut into three small clusters while the left stays one big cluster? The answer is in the starting frame: the initial centers happened to be more numerous on the right.

The handout's conclusion is that k-means is 'sensitive' to $k$ and initialization. In the lecture, Lin explains the reason: alternating optimization solves only part of the problem at a time and does not guarantee the global optimum; wherever it starts, it may get stuck near there.

**Another set of starting points for numerical example 3 (made up for this article).** The same six examples $0, 1, 4, 5, 8, 9$ and $k = 3$, with the initial centers changed to $(0, 1, 4)$. The round 1 partition gives $\{0\}, \{1\}, \{4, 5, 8, 9\}$; after the update the centers are $(0,\ 1,\ \frac{13}{2})$ and $E_{\text{in}} = \frac{1}{6}(2.5^2 + 1.5^2 + 1.5^2 + 2.5^2) = \frac{17}{6} \approx 2.83$. In round 2 the midpoints are 0.5 and 3.75, the partition does not change, and the algorithm stops.

The algorithm converges all the same, but it stops at a partition with $E_{\text{in}} \approx 2.83$, more than eleven times that of the earlier starting points: two centers are crowded onto the pair of examples on the left, and the four on the right get only one. This article ran all 20 ways of choosing three of the six examples as initial centers: 16 converge to the three clusters with $E_{\text{in}} = \frac{1}{4}$, and 4 stop at $E_{\text{in}} = \frac{17}{6}$. This is the same phenomenon as the handout's $k = 7$ figure.

### Classification after connecting to the RBF network

Page 21 adds labels to the same data: the left and right blobs are blue circles, and the top and bottom blobs are red crosses. No single straight line can separate this arrangement. The figures mark the Gaussian of each center with a blurred patch of color, and the black line is the classification boundary:

- **$k = 2$**: the background of the whole figure is red, and there is no boundary. The lecture's explanation is that the two centers happen to land in very murky positions, so the classifier simply labels every point red; two centers are not enough to represent what the data to be classified look like.
- **$k = 4$**: the four centers each sit on a blob, and the boundary is two curves opening away from each other, with the left and right regions classified blue and the top and bottom red. In the lecture, Lin says the blue points mostly fall on the blue side and the red on the red side; some points are still misclassified, but the result is much more reasonable.
- **$k = 7$**: the boundary has a finer shape. In the lecture, Lin says the right side gains one more center that can express red, so the classification in that area is more reasonable.

The handout's conclusion is reasonable performance with proper centers. The lecture's summary: when the first layer's k-means does a sensible job, what the second layer has to do becomes easy.

**Numerical example 4: six examples through all four steps (made up for this article).** Add labels to the data of numerical example 3, with the middle cluster $+1$ and the two sides $-1$:

| $x_n$ | $0$ | $1$ | $4$ | $5$ | $8$ | $9$ |
|---|---|---|---|---|---|---|
| $y_n$ | $-1$ | $-1$ | $+1$ | $+1$ | $-1$ | $-1$ |

In one dimension, $\text{sign}(wx + b)$ can cut only once and cannot produce "positive in the middle, negative on both sides". Follow the four steps of page 17, with the RBF taken as $2^{-(x - \mu)^2}$ (the Gaussian with $\gamma = \ln 2$) and the linear model taken as linear regression without a constant term, followed by a sign at the end. The decimals below were computed for this article with numpy.

*With the good centers $(0.5,\ 4.5,\ 8.5)$.* Every example is 0.5 from its own center, giving a feature value of $2^{-0.25} \approx 0.841$; it is at least 3.5 from the neighboring center, giving a feature value of at most $2^{-12.25} \approx 0.0002$. The transformed data are almost "0.841 in the position of your own cluster and 0 elsewhere":

| $x_n$ | $\boldsymbol{\Phi}(x_n)$ | $y_n$ |
|---|---|---|
| $0$, $1$ | about $(0.841,\ 0,\ 0)$ | $-1$ |
| $4$, $5$ | about $(0,\ 0.841,\ 0)$ | $+1$ |
| $8$, $9$ | about $(0,\ 0,\ 0.841)$ | $-1$ |

The linear regression solution is $\boldsymbol{\beta} \approx (-1.189,\ 1.189,\ -1.189)$, that is, $\mp\frac{1}{0.841}$: each center's vote is the label of its cluster divided by the feature value. The outputs on the six training examples are all within $0.0002$ of $\pm 1$, and every one is classified correctly. The sign of $g(x)$ changes at $x \approx 2.5$ and $x \approx 6.5$, exactly the midpoints between neighboring centers. Three centers and three votes produce a classification that a single straight line cannot.

*With the stuck centers $(0,\ 1,\ 6.5)$.* The four examples on the right can rely only on the third center. The examples 4 and 9 are equally far from it (2.5), and their third feature is $2^{-6.25} \approx 0.013$ in both cases; 5 and 8 are also equally far from it (1.5), both at $2^{-2.25} \approx 0.210$. But 4 and 5 have label $+1$ while 8 and 9 have $-1$. The same feature value has to map to opposite labels, and least squares ends up with $\beta_3 \approx 0.0002$, which amounts to giving up on this center: $\boldsymbol{\beta} \approx (-0.670,\ -0.662,\ 0.0002)$, the outputs for the four examples on the right are all below 0.002 in absolute value, and after taking the sign three of the six are wrong.

*With only two centers.* k-means with $k = 2$ starting from the initial centers $(0, 9)$ converges to $(\frac{5}{3},\ \frac{22}{3})$, with the two clusters $\{0, 1, 4\}$ and $\{5, 8, 9\}$, each of which mixes both labels. Linear regression gives $\boldsymbol{\beta} \approx (-1.526,\ -1.526)$; both votes are negative, $g(x)$ is below 0 along the entire number line, all six examples are classified $-1$, and two are wrong. This is the same situation as the all-red figure for $k = 2$ in the handout.

| Centers | Source | $\boldsymbol{\beta}$ | Training examples misclassified |
|---|---|---|---|
| $(0.5,\ 4.5,\ 8.5)$ | $k = 3$, initial $(1, 4, 5)$ | $(-1.189,\ 1.189,\ -1.189)$ | 0 |
| $(0,\ 1,\ 6.5)$ | $k = 3$, initial $(0, 1, 4)$ | $(-0.670,\ -0.662,\ 0.0002)$ | 3 |
| $(\frac{5}{3},\ \frac{22}{3})$ | $k = 2$, initial $(0, 9)$ | $(-1.526,\ -1.526)$ | 2 |

**What this result means.** The three cases use the same RBF and the same linear model; the only difference is the centers. The linear model in the second step cannot rescue centers that the first step failed to find well. That is what the handout's condition with proper centers means, and it is why $M$ and the starting points need several tries under validation.

### The boundaries of the full RBF network and nearest neighbor

Page 22 sets three figures side by side on the same data:

| | Left | Middle | Right |
|---|---|---|---|
| Model | full RBF network, $k = N$, $\lambda = 0.001$ | RBF network with $k = 4$ | nearest neighbor |
| What the boundary looks like | a curve that winds along the data | two smooth curves | a polyline with many turns that hugs individual points |

The lecture's comments are milder than the impression the figures give: the nearest neighbor boundary is less smooth but not too unreasonable, and the full RBF network with regularization can also get a fairly good boundary. The problem the two share is computation: in a sense they use all of the data, prediction is computationally heavier, and so they are not necessarily used often in practice. The lecture also mentions that nearest neighbor often relies on better geometric search algorithms to overcome the amount of computation.

The handout's conclusion on this page is a single sentence: full RBF Network: generally less useful. The handout does not state a reason; the reason given in the lecture is the amount of computation.

### Fun Time: which is the most regularized

**Question (page 23):** When coupled with ridge linear regression, which of the following RBF networks is 'most regularized'?

1. small $M$ and small $\lambda$
2. small $M$ and large $\lambda$
3. large $M$ and small $\lambda$
4. large $M$ and large $\lambda$

**Answer: 2.** This lecture gives two means of regularization, two knobs that each turn in their own direction:

- Small $M$: fewer centers means fewer components in $\boldsymbol{\beta}$ and fewer adjustable weights. The handout writes fewer weights and more regularized.
- Large $\lambda$: ridge penalizes $\lVert\boldsymbol{\beta}\rVert^2$ heavily and $\boldsymbol{\beta}$ is pressed shorter. The handout writes shorter $\boldsymbol{\beta}$ more and more regularized.

Only choice 2 turns both knobs toward regularization. Choice 3 is the other extreme; with $M = N$ and $\lambda \to 0$ it returns to exact interpolation. Choices 1 and 4 each turn only one knob. In the lecture, Lin describes "most regularized" as the model complexity being kept more under control. One sentence added in this article: most regularized does not mean best; in numerical example 4 the network with $M = 2$ misclassifies precisely because it has too few centers, and $M$ and $\lambda$ still have to be chosen with validation.

### The four-sentence summary of this lecture

Page 24 reduces each of the four sections to one line:

| Section | The handout's summary |
|---|---|
| RBF Network Hypothesis | prototypes instead of neurons as transform |
| RBF Network Learning | linear aggregation of prototype 'hypotheses' |
| k-Means Algorithm | clustering with alternating optimization |
| k-Means and RBF Network in Action | proper choice of # prototypes important |

The preview of the next lecture is extracting features from abstract data. In the lecture, Lin says it will deal with more abstract data and look at how to extract features from it.

## Self-check

**1. Two one-dimensional examples $x_1 = 0$ and $x_2 = 1$ with $y = (3, 0)$, using the Gaussian with $\gamma = \ln 2$ (similarity $2^{-d^2}$). Compute $\boldsymbol{\beta} = \mathrm{Z}^{-1}\mathbf{y}$ for the full RBF network, confirm that it passes through both points, and then compute $g(2)$.**

Answer: $\mathrm{Z} = \begin{bmatrix} 1 & \frac{1}{2} \\ \frac{1}{2} & 1 \end{bmatrix}$, the determinant is $\frac{3}{4}$, $\mathrm{Z}^{-1} = \frac{4}{3}\begin{bmatrix} 1 & -\frac{1}{2} \\ -\frac{1}{2} & 1 \end{bmatrix}$, and $\boldsymbol{\beta} = (4, -2)$. Check: $g(0) = 4 \cdot 1 - 2 \cdot \frac{1}{2} = 3$ and $g(1) = 4 \cdot \frac{1}{2} - 2 \cdot 1 = 0$. $g(2) = 4 \cdot \frac{1}{16} - 2 \cdot \frac{1}{2} = -\frac{3}{4}$. The second example has $y$ equal to 0 yet a vote of $-2$, because it has to cancel the $4 \cdot \frac{1}{2} = 2$ coming over from the first example.

**2. One-dimensional data $0, 2, 3, 10$, $k = 2$, initial centers $(0, 2)$. Run k-means by hand until convergence, writing down the partition and centers of every round and $E_{\text{in}}$ after the centers are updated.**

Answer: Round 1 partitions into $\{0\}, \{2, 3, 10\}$, with centers $(0, 5)$ and $E_{\text{in}} = \frac{9 + 4 + 25}{4} = \frac{19}{2}$. Round 2: the midpoint is 2.5, the partition is $\{0, 2\}, \{3, 10\}$, the centers are $(1, \frac{13}{2})$, and $E_{\text{in}} = \frac{1 + 1 + 12.25 + 12.25}{4} = \frac{53}{8}$. Round 3: the midpoint is 3.75, the partition is $\{0, 2, 3\}, \{10\}$, the centers are $(\frac{5}{3}, 10)$, and $E_{\text{in}} = \frac{1}{4}\cdot\frac{14}{3} = \frac{7}{6}$. Round 4: the midpoint is about 5.83, the partition does not change, and the algorithm stops. $E_{\text{in}}$ goes $9.5 \to 6.625 \to 1.17$, decreasing all the way.

**3. $\mathrm{Z}$ and the Gaussian kernel matrix $\mathrm{K}$ are the same matrix. Why do the $\boldsymbol{\beta}$ formulas of the regularized full RBFNet and kernel ridge regression differ?**

Rubric: the answer has to say that the two penalize different quantities. Kernel ridge regression penalizes $\mathbf{w}^\top\mathbf{w}$ in the infinite-dimensional $\mathcal{Z}$ space, which written in $\boldsymbol{\beta}$ is $\boldsymbol{\beta}^\top\mathrm{K}\boldsymbol{\beta}$, with solution $(\mathrm{K} + \lambda\mathrm{I})^{-1}\mathbf{y}$; the regularized full RBFNet treats $\mathbf{z}_n$ as an $N$-dimensional feature vector and penalizes $\boldsymbol{\beta}^\top\boldsymbol{\beta}$, with solution $(\mathrm{Z}^\top\mathrm{Z} + \lambda\mathrm{I})^{-1}\mathrm{Z}^\top\mathbf{y}$. Better still if it also points out that both return to $\mathrm{Z}^{-1}\mathbf{y}$ as $\lambda \to 0$.

**4. Is $\phi(\mathbf{x}, \boldsymbol{\mu}) = \dfrac{1}{1 + \lVert\mathbf{x} - \boldsymbol{\mu}\rVert^2}$ a radial basis function? What about $\phi(\mathbf{x}, \boldsymbol{\mu}) = \mathbf{x}^\top\boldsymbol{\mu}$?**

Answer: The first one is. It uses only the distance, equals 1 at distance 0, and gets smaller as the distance grows, which fits "monotonically non-increasing to distance". The second is not: with $\mathbf{x} = \boldsymbol{\mu} = (1, 0)$ the value is 1 and with $\mathbf{x} = \boldsymbol{\mu} = (2, 0)$ the value is 4; the distance is 0 in both cases, yet the values differ.

**5. The training data have $N = 10{,}000$ examples. Compare nearest neighbor, the full RBF network, and the k-means RBF network with $M = 10$: what does each do during training? How many distances does each compute to predict one new example?**

Answer: Nearest neighbor only stores the data during training, and at prediction time it computes 10,000 distances and picks the smallest (without an extra search structure). The full RBF network has to solve a $10{,}000 \times 10{,}000$ linear system (or its ridge version) during training to get $\boldsymbol{\beta}$, and at prediction time it likewise computes 10,000 RBFs. The k-means RBF network first runs k-means during training and then solves a linear model with only 10 variables, and at prediction time it computes only 10 RBFs. The first two are what the handout calls lazy and generally less useful.

## Exercises and corresponding reading

**The corresponding week in two semesters.** Neither the [Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) nor the [Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) course plan schedules this lecture: in both semesters, neural networks and deep learning (slide codes 212u and 213u) are followed directly by modern deep learning (302u and 303u). So this lecture has no updated `u` version of the slides, and the course pages do not list a textbook chapter for it. The videos and the handout themselves are free and public.

**Homework.** This lecture has no corresponding homework problem. None of the problems in Fall 2024 HW0–HW7 or in the final project description tests RBF networks or k-means (checked 2026-09-30). What you can check yourself against are the four Fun Time questions in the handout and the self-check above; the handout prints the answer to each Fun Time on the page after the question, so you can cover it and answer first. The guide to the homework as a whole is in [Techniques Homework and Final Project](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project-en).

**A hands-on experiment (not assigned by the course).** Get the centers with scikit-learn's `KMeans`, write the Gaussian transform yourself, then attach `Ridge`; on a two-dimensional toy data set, sweep $M \in \{2, 4, 8, 32, N\}$ and a few values of $\lambda$, plot the classification boundaries, and compare them with the figures on pages 21 and 22 of the handout. Then rerun k-means with different random seeds and see how much the centers and boundaries change. After that, write k-means by hand once and compare it with the result of `KMeans`; the alternating least squares of the next lecture uses the same skeleton: fix one set of variables, solve for the other, and repeat until nothing changes.

**Next lecture.** [Techniques Lecture 15: Matrix Factorization](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-15-matrix-factorization-en) deals with inputs that are not even numerical, just user IDs, and has to extract features of users and movies from rating data.

## Course video sources

Original videos: [RBF Network Hypothesis](https://www.youtube.com/watch?v=7lHhnpdPVr0), [RBF Network Learning](https://www.youtube.com/watch?v=dEYdx2rS66c), [k-Means Algorithm](https://www.youtube.com/watch?v=ker9RF2TDUU), [k-Means and RBF Network in Action](https://www.youtube.com/watch?v=D5elADTz1vk)

- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

Checked: 2026-10-13. The video IDs, titles, and lengths were taken from the official playlist on that day; the videos have no caption track on YouTube, and what this article reports from the lecture comes from transcripts made for it.

## Update Log

- 2026-10-13: Originally combined with Lecture 15 in one article; changed to one article per lecture and rewritten from the handout and the video transcripts.
- 2026-10-10: Rechecked the video status. The embedded videos match the lecture order of the official playlist.
- 2026-10-10: Marked the video status and verified the recording sources and how they were obtained.

## References

- [Techniques Lecture 14 handout, 214_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/214_handout.pdf): the main source for this article. The derivations in the four sections, the four Fun Time questions, and the figures on pages 19–22 all come from this handout.
- [Techniques Lecture 6 handout, 206_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/206_handout.pdf): the objective function and closed-form solution of kernel ridge regression, used in the comparison of the two kinds of regularization.
- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2): the IDs and titles of the four videos; what the text reports as said "in the lecture" is paraphrased from machine transcripts of these four videos.
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/): the official entry for handouts and recordings.
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/): the course plan does not schedule this lecture.
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/): the course plan does not schedule this lecture.
- [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques: Course Overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en): where this lecture sits in the whole course and the reading routes.
