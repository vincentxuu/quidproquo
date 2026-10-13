---
title: "Finale: Three Families of Techniques Across the Whole Course | NTU Hsuan-Tien Lin Machine Learning Techniques Lecture 16"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, deep-learning, optimization, regularization]
lang: en
math: true
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 33
tldr: "Techniques Lecture 16 has no new model. It re-sorts the models of the first 15 lectures by three questions: where the features are hidden (kernel, aggregation, extraction, low-dimensional projection), how the error is brought down (gradients, equivalent problems, multiple steps), and how to hit the brakes when the model is too powerful (regularization, validation). This article works PCA plus AdaBoost-Stump on eight points from start to finish and checks the answer against each of the three questions; it closes by keeping the ReLU, Xavier/He initialization, momentum, RMSProp, and Adam material that the Fall 2024 on-campus course added."
description: "A guide to Lecture 16, Finale, of NTU Hsuan-Tien Lin's Machine Learning Techniques: the classification tables and four Fun Time questions for the three families of techniques (feature exploitation, error optimization, overfitting elimination), a complete worked example of PCA plus AdaBoost-Stump on eight points, the four KDD Cup champion models and the ICDM top 10 algorithms, and the Fall 2024 supplementary slides 302u, 303u, mlmai.ics, and 1126."
draft: false
glossary:
  - term: "He initialization"
    aliases: ["Kaiming initialization"]
    definition: "Weight initialization for ReLU networks: zero mean and variance 2/d^(ℓ−1), so that the variance of each layer's scores stays roughly constant. Xavier initialization is the counterpart for tanh networks, with variance 2/(d^(ℓ−1)+d^(ℓ))."
    context: "Derived on the last three pages of Hsuan-Tien Lin's Fall 2024 supplementary slides 302u."
    links:
      - label: "302u slides"
        url: "https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/302u_handout.pdf"
  - term: "Adam"
    aliases: ["Adaptive Moment Estimation"]
    definition: "A variant of SGD: it uses an exponential moving average of the gradients as the direction (momentum), uses a moving average of the squared gradients to adjust the step size of each component (RMSProp), and adds global decay."
    context: "Hsuan-Tien Lin's Fall 2024 supplementary slides 303u write it as \"momentum + RMSProp + global decay\"."
    links:
      - label: "303u slides"
        url: "https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/303u_handout.pdf"
  - term: "multi-stage optimization"
    definition: "Split the variables into groups, solve one group and freeze it, then solve the next, without going back. Probabilistic SVM, linear blending, stacking, RBF networks, and layer-by-layer pre-training of deep networks all work this way."
    context: "The first of the three ways of \"splitting into multiple steps\" on page 9 of the Techniques Lecture 16 handout."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-htlin-ml-finale-modern-deep-learning)

**Video status: Videos included.** This article is written from the official MOOC handout [216_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/216_handout.pdf) and transcripts of this lecture's four official videos, with formulas following the handout. The transcripts are machine transcripts made for this article (Whisper), not official captions, and no human has proofread them. The videos are taught in Mandarin; the slides are in English. Each section opens with its official video and the approximate time ranges. Page numbers refer to the number at the lower right of each slide (0/21 to 21/21), and wherever the text says "in the lecture" it is paraphrasing what is said in the video.

This is Techniques Lecture 16 in [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en), and the last of the 32 lectures across the two courses. The Roadmap on page 1 of the handout divides Techniques into three ways of handling features: Embedding Numerous Features (kernel models), Combining Predictive Features (aggregation models), and Distilling Implicit Features (extraction models). This lecture sits under the third, right after [Techniques Lecture 15: Matrix Factorization](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-15-matrix-factorization-en), but it teaches no new model. In the lecture, Lin opens by saying that today does not start from models; it looks instead at the aspects along which the techniques behind those models can be strung together. There are three aspects: how to exploit features, how to optimize, and how to avoid overfitting. The last video then looks at how these techniques are combined in competitions.

The prerequisites are the first 15 lectures of Techniques. You do not need to remember every model's derivation, but you should recognize the names; each table in this article marks which lecture to go back to. After reading, you should be able to answer three questions about every model you have learned (where its features come from, how its error is brought down, and what keeps it from overfitting), and to redo this article's eight-point example on your own.

After the four sections of the handout, this article keeps one more section for the four slide decks that the Fall 2024 on-campus course added. That material is not in MOOC Lecture 16 and is marked as such.

## Where the features are hidden: kernel, aggregation, extraction, and low-dimensional projection

```youtube
url: https://www.youtube.com/watch?v=WeLobtIDBzI
title: Finale :: Feature Exploitation Techniques @ Machine Learning Techniques (機器學習技法)
```

(Video 00:18–01:42 reviews the previous lecture and previews this lecture's three aspects, 01:42–04:20 is kernel, 04:20–09:24 is aggregation, 09:24–12:53 is extraction, 12:53–15:31 is low-dimensional projection, and Fun Time follows.)

In the lecture, Lin first reviews the previous lecture in one sentence: seen from the movies' side, matrix factorization is a set of linear models acting on extracted user features; movies and users are symmetric, so the reverse reading holds too. The most common optimization method is stochastic gradient descent (SGD).

Doing anything nonlinear requires a feature transform $\boldsymbol{\Phi}$. Pages 2 to 5 of the handout use four tables to answer the same question: where is this $\boldsymbol{\Phi}$ hidden? The first three follow the three parts of the course; the fourth, as Lin puts it in the lecture, is one that all kinds of models share and that is often overlooked.

### Kernel: burying numerous features inside an inner product

The header of page 2 reads: numerous features within some $\boldsymbol{\Phi}$, embedded in kernel $K_{\boldsymbol{\Phi}}$ with inner product operation. That is,

$$
K_{\boldsymbol{\Phi}}(\mathbf{x}, \mathbf{x}') = \boldsymbol{\Phi}(\mathbf{x})^\top \boldsymbol{\Phi}(\mathbf{x}')
$$

In the lecture, Lin explains that a kernel wraps two actions, "do the feature transform" and "take the inner product in the transformed space", into a single computation, and the number of features can be very large. The slide uses a horizontal line to split its content into two halves: six kinds of kernel above, and the models that can use a kernel below.

| Box on the handout | The handout's note | What the lecture adds | Review |
|---|---|---|---|
| Polynomial Kernel | 'scaled' polynomial transforms | A polynomial transform is inside, and special scaling is what makes the kernel easy to compute | [Techniques Lecture 3](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-soft-margin-svm-en) |
| Gaussian Kernel | infinite-dimensional transforms | An infinite-dimensional feature transform is inside | Techniques Lecture 3 |
| Stump Kernel | decision-stumps as transforms | Derived in the homework; it buries many decision stumps inside, and the literature calls it the stump kernel | Homework |
| Sum of Kernels | transform union | The sum of two kernels is still a kernel, which means mixing the two transforms together | Techniques Lecture 3 and homework |
| Product of Kernels | transform combination | The product is still a kernel too; the transforms buried in each combine into a more complicated transform | Same as above |
| Mercer Kernels | transform implicitly | Every function that satisfies Mercer's condition has some transform buried inside, even when we cannot write down what it looks like | Techniques Lecture 3 |

Below the line there are five models: SVM ([Techniques Lecture 1](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm-en) to [Lecture 4](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-04-soft-margin-svm-en)), SVR and kernel ridge regression ([Techniques Lecture 6](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-06-support-vector-regression-en)), and kernel logistic regression and probabilistic SVM ([Techniques Lecture 5](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-logistic-support-vector-regression-en)). The slide lists the five side by side, while in the lecture Lin puts kernel ridge regression and kernel logistic regression on the "less often used" side. Paired with the kernels in the upper half, these originally linear models can produce very complicated nonlinear boundaries.

The yellow box at the bottom of the page reads possibly Kernel PCA, Kernel k-Means. The reason given in the lecture is that the computations in PCA and k-means involve only linear operations and inner products, so they can be swapped for kernel versions as well.

**An addition in this article: sum is union and product is combination, seen once with numbers.** The following is an example made up for this article, not from the slides. Take two very small transforms $\boldsymbol{\Phi}_1(\mathbf{x}) = (x_1, x_2)$ and $\boldsymbol{\Phi}_2(\mathbf{x}) = (1, x_1)$, and two points $\mathbf{x} = (1, 2)$, $\mathbf{x}' = (3, 1)$.

- $K_1 = (1)(3) + (2)(1) = 5$, $K_2 = (1)(1) + (1)(3) = 4$.
- Concatenate the two transforms, $\boldsymbol{\Phi}(\mathbf{x}) = (x_1, x_2, 1, x_1)$. $\mathbf{x}$ becomes $(1, 2, 1, 1)$, $\mathbf{x}'$ becomes $(3, 1, 1, 3)$, and the inner product is $3 + 2 + 1 + 3 = 9 = K_1 + K_2$. Concatenation is what the handout calls union.
- Multiply the components of the two transforms pairwise, $\boldsymbol{\Phi}(\mathbf{x}) = (x_1 \cdot 1,\ x_1 \cdot x_1,\ x_2 \cdot 1,\ x_2 \cdot x_1)$. $\mathbf{x}$ becomes $(1, 1, 2, 2)$, $\mathbf{x}'$ becomes $(3, 9, 1, 3)$, and the inner product is $3 + 9 + 2 + 6 = 20 = K_1 \times K_2$. Pairwise multiplication is combination.

The general case just writes these two lines as sums. For the sum, the inner product of $[\boldsymbol{\Phi}_1; \boldsymbol{\Phi}_2]$ splits into a front half and a back half, which are $K_1$ and $K_2$ respectively. For the product:

$$
\sum_{i}\sum_{j} \phi_{1,i}(\mathbf{x})\,\phi_{2,j}(\mathbf{x})\,\phi_{1,i}(\mathbf{x}')\,\phi_{2,j}(\mathbf{x}') = \Big(\sum_i \phi_{1,i}(\mathbf{x})\phi_{1,i}(\mathbf{x}')\Big)\Big(\sum_j \phi_{2,j}(\mathbf{x})\phi_{2,j}(\mathbf{x}')\Big) = K_1 K_2
$$

### Aggregation: treating each g as a feature

The header of page 3 is predictive features within some $\boldsymbol{\Phi}$, with a single line of formula beneath it:

$$
\phi_t(\mathbf{x}) = g_t(\mathbf{x})
$$

In the lecture, Lin explains that the hypotheses we usually see can also serve as feature transforms, since they already help predict the output; treating a collection of different $g_t$ as features may produce a better $G$. The slide has two layers. The upper layer holds the three basic units commonly used as $g_t$:

| Basic unit | The handout's note | What the lecture adds | Review |
|---|---|---|---|
| Decision Stump | simplest perceptron; simplest DecTree | It can be seen as a perceptron restricted to vertical and horizontal lines, or as a decision tree with a single branch | [Techniques Lecture 8](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-08-adaptive-boosting-en) |
| Decision Tree | branching (divide) + leaves (conquer) | Cut the data apart with stumps or the like until it cannot be cut further, then put the small pieces back together | [Techniques Lecture 9](/posts/ai/2026-09-30-ntu-htlin-ml-decision-tree-random-forest-gbdt-en) |
| (Gaussian) RBF | prototype (center) + influence | Predict from "the representatives close to me" and each representative's influence | [Techniques Lecture 14](/posts/ai/2026-09-30-ntu-htlin-ml-rbf-network-matrix-factorization-en) |

The lower layer holds three ways of combining the $g_t$:

| Way of combining | Models listed on the handout | The lecture's explanation | Review |
|---|---|---|---|
| Uniform | Bagging; Random Forest | When there are no $g_t$ at hand, use bagging to produce many different $g_t$ and then average or vote; paired with decision trees this is the random forest | [Techniques Lecture 7](/posts/ai/2026-09-30-ntu-htlin-ml-blending-bagging-adaboost-en), [Lecture 10](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-10-random-forest-en) |
| Non-Uniform | AdaBoost; GradientBoost | Find very different $g_t$ one step at a time and then combine them | Techniques Lecture 8, [Lecture 11](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-11-gradient-boosted-decision-tree-en) |
| Conditional | Decision Tree; Nearest Neighbor | Use splits to find different $g_t$ in different regions and combine them conditionally | Techniques Lecture 9, Lecture 14 |

Two positions in the table get a specific explanation in the lecture:

- **Why Nearest Neighbor counts as conditional.** If you are my neighbor you get a vote, and if not you do not; "being a neighbor or not" is the condition, and each vote stands for a constant $g$. In the lecture, Lin notes that although this model was covered in a different place later in the course, looking back it does much the same thing as a decision tree.
- **Why probabilistic SVM appears on this page.** The slide places it by itself below the Non-Uniform column. Techniques Lecture 5 first solves an SVM, then multiplies the SVM score by a coefficient $A$ and adds a shift $B$ so that the output approximates a probability. The reading given in the lecture is that this amounts to a linear blend of the SVM result and a constant model (standing for the shift), and the second-stage learning is the same thing as the blending step "we already have a set of $g_t$, now learn a linear model that turns them into $G$".

The footer reads possibly Infinite Ensemble Learning, Decision Tree SVM. In the lecture, Lin spends one sentence on where each comes from. Combining infinitely many $g_t$ looks impossible, but if infinitely many decision stumps are placed inside a kernel (the stump kernel mentioned under kernels), what the SVM solves for behaves as if infinitely many stumps were combined inside it. Decision trees branch with very simple stumps, and using an SVM to make the cut might well work too. Lin says the point of going through all this is for everyone to see that the models are all related, and that once they are understood together, quite different models can often be conjured up.

### Extraction: treating the features as variables to be learned

The header of page 4 is hidden features within some $\boldsymbol{\Phi}$: as hidden variables to be 'jointly' optimized with usual weights, possibly with the help of unsupervised learning. In the lecture, Lin explains that when writing down a model, we should not think of the feature transform as already given or already buried inside some kernel; think of it as a variable that has to be optimized just like the weights of a linear model, and then solve for the two together.

| Model | What gets extracted (handout) | Review |
|---|---|---|
| Neural Network; Deep Learning | neuron weights | [Techniques Lecture 12](/posts/ai/2026-09-30-ntu-htlin-ml-neural-network-deep-learning-en), [Lecture 13](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-13-deep-learning-en) |
| RBF Network | RBF centers | Techniques Lecture 14 |
| Matrix Factorization | user/movie factors | Techniques Lecture 15 |
| AdaBoost; GradientBoost | $g_t$ parameters | Techniques Lecture 8, Lecture 11 |
| k-Means | cluster centers | Techniques Lecture 14 |
| Autoencoder; PCA | 'basis' directions | Techniques Lecture 13 |

The top three rows are supervised models. Among the bottom three, k-means, autoencoder, and PCA are the "unsupervised helpers" that the header mentions. The pairings given in the lecture are: RBF networks often use k-means to find the cluster centers; neural networks often get help from an autoencoder or PCA, which extract good projection directions, good basis directions, and are closely related to matrix factorization.

AdaBoost and GradientBoost appeared in the previous table and show up again here. The explanation in the lecture is that boosting finds one $g_t$ per round and gives it a linear weight, so these $g_t$ can also be thought of as hidden features, and what each round does is find the parameters of $g_t$ (for example, where a decision stump cuts). The same model can go into more than one table; the four tables are four ways of looking, and they are not mutually exclusive.

The footer reads possibly GradientBoosted Neurons, NNet on Factorized Features. The lecture's explanation: when building a neural network, gradient boosting can be used to find the neurons one at a time; and after matrix factorization has extracted features, prediction need not use the original vector inner product, since the features can be fed on into a neural network.

### Low-dimensional projection: the table most easily overlooked

The header of page 5 is low-dimensional features within some $\boldsymbol{\Phi}$: compressed from original features. In the lecture, Lin says the first three pages roughly follow the flow of the course and this page is an extra: when the data's original dimension is fairly high, we often try to turn it into low-dimensional data and operate there, by compression or projection.

| Model | The handout's note | What the lecture adds |
|---|---|---|
| Decision Stump; DecTree Branching | 'best' naïve projection to $\mathbb{R}$ | A stump is a very low-dimensional projection; every branching of a decision tree makes its decision on some very low-dimensional projection |
| Random Forest Tree Branching | 'random' low-dim. projection | Random forests often first apply a random low-dimensional projection to the original features and then cut a stump on it, so that the trees grown differ more |
| Autoencoder; PCA | info.-preserving compression | Find the projection directions that best preserve the data's characteristics |
| Matrix Factorization | projection from abstract to concrete | Project the user's abstract vector, which has a single 1 and a very high dimension, onto a more concrete vector |
| Feature Selection | 'most-helpful' low-dimensional projection | Finding a few useful dimensions among the original features is also a transform from high to low dimension; covered with random forests |

The footer reads possibly other 'dimension reduction' models. The comment in the lecture is that dimension reduction is extremely useful in practice, and when looking at a new model later it is worth asking one more question: what kind of dimension reduction does it use inside, and what other kinds could be paired with it?

### Fun Time: what you get from running AdaBoost-Stump after PCA

**Question (page 6):** Consider running AdaBoost-Stump on a PCA-preprocessed data set. Then, in terms of the original features $\mathbf{x}$, what does the final hypothesis $G(\mathbf{x})$ look like?

1. a neural network with $\tanh(\cdot)$ in the hidden neurons
2. a neural network with $\text{sign}(\cdot)$ in the hidden neurons
3. a decision tree
4. a random forest

**Answer: 2.** The handout's answer: PCA results in a linear transformation of $\mathbf{x}$. Then, when applying a decision stump on the transformed data, it is as if a perceptron is applied on the original data. So the resulting $G$ is simply a linear aggregation of perceptrons. The handout says only that; the formulas and the per-option explanations below are additions in this article. The PCA of Techniques Lecture 13 returns $\boldsymbol{\Phi}(\mathbf{x}) = \mathrm{W}(\mathbf{x} - \bar{\mathbf{x}})$, and the $i$-th new feature is $z_i = \mathbf{w}_i^\top(\mathbf{x} - \bar{\mathbf{x}})$. A stump on $z_i$ is

$$
g_t(\mathbf{x}) = s_t \cdot \text{sign}(z_{i_t} - \theta_t) = \text{sign}\Big( (s_t\mathbf{w}_{i_t})^\top \mathbf{x} - s_t\big(\theta_t + \mathbf{w}_{i_t}^\top\bar{\mathbf{x}}\big) \Big)
$$

The second equality uses the fact that $s_t = \pm 1$ can be moved inside the sign. The expression in the parentheses is first-degree in $\mathbf{x}$, so this is a perceptron: the weights are $s_t\mathbf{w}_{i_t}$, and the threshold term is $-s_t(\theta_t + \mathbf{w}_{i_t}^\top\bar{\mathbf{x}})$. AdaBoost finally returns

$$
G(\mathbf{x}) = \text{sign}\Big( \sum_{t=1}^{T} \alpha_t\, g_t(\mathbf{x}) \Big)
$$

The outer layer is a linear combination followed by a sign, and the inner layer is $T$ perceptrons that each take a sign. Compared with the neural network of Techniques Lecture 12, this is a network with an input layer, one layer of $T$ hidden neurons, and one output; the hidden layer's transformation function is sign, and the output layer's weights are $\alpha_t$.

Why the other options are wrong:

- Option 1: a stump outputs only $\pm 1$, a hard sign, not a smooth tanh.
- Option 3: a decision tree is a conditional combination, where a point follows a single path and is decided by a single leaf; here every point has to evaluate all $T$ of the $g_t$ and add them up with weights.
- Option 4: a random forest is a uniform vote over bagged trees; here the $g_t$ are stumps, and the votes $\alpha_t$ are not uniform.

In the lecture, Lin states the answer a little more conservatively than the handout: a set of perceptrons aggregated linearly is similar to a neural network.

An addition in this article: this network differs from an ordinarily trained neural network in two ways. The directions of the hidden neurons can only be the PCA directions $\pm\mathbf{w}_i$, not arbitrary directions; and the weights are not tuned together by backprop, since PCA fixes the directions first and AdaBoost then decides the thresholds and $\alpha_t$ one round at a time. Both points come up again in the optimization section.

### Working through the Fun Time: an eight-point example

The following is an example made up for this article, not from the slides. The only tools it uses are the PCA of Techniques Lecture 13 and the AdaBoost-Stump of Lecture 8.

**Data.** Eight two-dimensional points:

| $n$ | $\mathbf{x}_n$ | $y_n$ | $\mathbf{x}_n - \bar{\mathbf{x}}$ | $p_n$ | $q_n$ |
|---|---|---|---|---|---|
| 1 | $(3, 1)$ | $-1$ | $(-1, -3)$ | $-4$ | $2$ |
| 2 | $(1, 3)$ | $-1$ | $(-3, -1)$ | $-4$ | $-2$ |
| 3 | $(3, 3)$ | $+1$ | $(-1, -1)$ | $-2$ | $0$ |
| 4 | $(6, 2)$ | $+1$ | $(2, -2)$ | $0$ | $4$ |
| 5 | $(2, 6)$ | $+1$ | $(-2, 2)$ | $0$ | $-4$ |
| 6 | $(5, 5)$ | $+1$ | $(1, 1)$ | $2$ | $0$ |
| 7 | $(7, 5)$ | $-1$ | $(3, 1)$ | $4$ | $2$ |
| 8 | $(5, 7)$ | $+1$ | $(1, 3)$ | $4$ | $-2$ |

The last two columns, $p_n$ and $q_n$, come out of the PCA in the next step; they are placed here in advance.

**Step 1: PCA.** Follow the three steps of Techniques Lecture 13. The mean is $\bar{\mathbf{x}} = (32/8,\ 32/8) = (4, 4)$, and subtracting it gives the fourth column of the table. Next compute $\mathrm{X}^\top\mathrm{X}$, where each row of $\mathrm{X}$ is one mean-subtracted point:

$$
\mathrm{X}^\top\mathrm{X} = \begin{bmatrix} 1+9+1+4+4+1+9+1 & 3+3+1-4-4+1+3+3 \\ 3+3+1-4-4+1+3+3 & 9+1+1+4+4+1+1+9 \end{bmatrix} = \begin{bmatrix} 30 & 6 \\ 6 & 30 \end{bmatrix}
$$

The eigenvalues satisfy $(30 - \lambda)^2 - 36 = 0$, giving $\lambda = 36$ and $\lambda = 24$. The eigenvector for $\lambda = 36$ solves $-6v_1 + 6v_2 = 0$ and is $\mathbf{w}_1 = \frac{1}{\sqrt{2}}(1, 1)$; the one for $\lambda = 24$ is $\mathbf{w}_2 = \frac{1}{\sqrt{2}}(1, -1)$. Both directions are kept here, so PCA just rotates the coordinate axes by 45 degrees:

$$
z_1 = \mathbf{w}_1^\top(\mathbf{x} - \bar{\mathbf{x}}) = \frac{x_1 + x_2 - 8}{\sqrt{2}}, \qquad z_2 = \mathbf{w}_2^\top(\mathbf{x} - \bar{\mathbf{x}}) = \frac{x_1 - x_2}{\sqrt{2}}
$$

To avoid writing $\sqrt{2}$ all the time, let $p = \sqrt{2}\,z_1 = x_1 + x_2 - 8$ and $q = \sqrt{2}\,z_2 = x_1 - x_2$, which are the last two columns of the table. A stump on $z_1$ that cuts at $\theta$ is the same as one on $p$ that cuts at $\sqrt{2}\,\theta$.

**Step 2: three rounds of AdaBoost-Stump.** Follow Techniques Lecture 8: in each round pick, among all stumps, the one with the lowest weighted error rate $\epsilon_t$, and let $\blacklozenge_t = \sqrt{(1 - \epsilon_t)/\epsilon_t}$ and $\alpha_t = \ln \blacklozenge_t$; the weights of misclassified points are multiplied by $\blacklozenge_t$ and those of correctly classified points are divided by $\blacklozenge_t$. Stump thresholds are taken at the midpoints of adjacent values: on $p$ the cuts can be at $-3$, $-1$, $1$, $3$, on $q$ at $-3$, $-1$, $1$, $3$, and each has in addition one constant stump that "puts everything on the same side". Only the ratios of the weights matter, so what is written below are the ratios after dividing by the total, which are easier to compute with.

Round 1: every point has weight $\frac{1}{8}$.

- Best stump: $g_1 = \text{sign}(p + 3)$, positive when $p > -3$. Only point 7 ($p = 4$, $y = -1$) is misclassified.
- $\epsilon_1 = \frac{1}{8}$, $\blacklozenge_1 = \sqrt{7} \approx 2.646$, $\alpha_1 = \ln\sqrt{7} \approx 0.973$.
- New weight ratios: point 7 gets $\frac{1}{8}\sqrt{7}$ and the rest $\frac{1}{8}/\sqrt{7}$, a ratio of $7 : 1$. After normalization point 7 has $\frac{7}{14} = \frac{1}{2}$, and each of the other seven points has $\frac{1}{14}$. The misclassified points together take exactly half; this is the result of Techniques Lecture 8's "make $g_t$ look like random guessing under the new weights".

Round 2.

- Best stump: $g_2 = -\text{sign}(q - 1)$, positive when $q < 1$. Point 7 ($q = 2$) is classified correctly this time. The misclassified ones are point 2 ($q = -2$, $y = -1$) and point 4 ($q = 4$, $y = +1$).
- $\epsilon_2 = \frac{1}{14} + \frac{1}{14} = \frac{1}{7}$, $\blacklozenge_2 = \sqrt{6} \approx 2.449$, $\alpha_2 = \ln\sqrt{6} \approx 0.896$.
- New weight ratios: points 2 and 4 each get $\frac{1}{4}$ (half between the two of them), point 7 gets $\frac{1}{2} \times \frac{7}{12} = \frac{7}{24}$, and each of the other five points gets $\frac{1}{14} \times \frac{7}{12} = \frac{1}{24}$. Here $\frac{7}{12}$ is the factor that shrinks the total weight of the correctly classified points, $\frac{6}{7}$, down to $\frac{1}{2}$.

Round 3.

- Best stump: $g_3 = \text{sign}(q - 3)$, positive when $q > 3$. Only point 4 is predicted positive, and points 2 and 7 are both classified correctly. The misclassified ones are points 3, 5, 6, and 8, all four carrying the smallest weight, $\frac{1}{24}$.
- $\epsilon_3 = \frac{4}{24} = \frac{1}{6}$, $\blacklozenge_3 = \sqrt{5} \approx 2.236$, $\alpha_3 = \ln\sqrt{5} \approx 0.805$.

The runner-up stumps in the three rounds have error rates $\frac{1}{4}$, $\frac{3}{14}$, and $\frac{7}{24}$, all higher than the chosen ones, so there is no tie in the choice of any round.

**Step 3: back to the original coordinates.** Substitute $p = x_1 + x_2 - 8$ and $q = x_1 - x_2$ back in:

$$
g_1(\mathbf{x}) = \text{sign}(x_1 + x_2 - 5), \qquad g_2(\mathbf{x}) = \text{sign}(-x_1 + x_2 + 1), \qquad g_3(\mathbf{x}) = \text{sign}(x_1 - x_2 - 3)
$$

$$
G(\mathbf{x}) = \text{sign}\big( 0.973\, g_1(\mathbf{x}) + 0.896\, g_2(\mathbf{x}) + 0.805\, g_3(\mathbf{x}) \big)
$$

All three $g_t$ are slanted lines; none is horizontal or vertical. $G$ is a 2–3–1 neural network: three sign neurons in the hidden layer with weights $(1, 1)$, $(-1, 1)$, and $(1, -1)$ (the directions are $\pm\mathbf{w}_1$ and $\pm\mathbf{w}_2$ times $\sqrt{2}$, and sign is unaffected by a positive factor), and output-layer weights $(0.973, 0.896, 0.805)$. Here the Fun Time answer can be seen as an actual object.

**Step 4: check.**

| $n$ | $y_n$ | $g_1$ | $g_2$ | $g_3$ | $\sum_t \alpha_t g_t$ | $G$ |
|---|---|---|---|---|---|---|
| 1 | $-1$ | $-$ | $-$ | $-$ | $-2.674$ | $-1$ |
| 2 | $-1$ | $-$ | $+$ | $-$ | $-0.882$ | $-1$ |
| 3 | $+1$ | $+$ | $+$ | $-$ | $1.064$ | $+1$ |
| 4 | $+1$ | $+$ | $-$ | $+$ | $0.882$ | $+1$ |
| 5 | $+1$ | $+$ | $+$ | $-$ | $1.064$ | $+1$ |
| 6 | $+1$ | $+$ | $+$ | $-$ | $1.064$ | $+1$ |
| 7 | $-1$ | $+$ | $-$ | $-$ | $-0.728$ | $-1$ |
| 8 | $+1$ | $+$ | $+$ | $-$ | $1.064$ | $+1$ |

All eight points are classified correctly. With $g_1$ alone, $E_{\text{in}} = \frac{1}{8}$; after adding $g_2$, point 7's score is $0.973 - 0.896 = 0.077$, still positive, so $E_{\text{in}}$ is still $\frac{1}{8}$; only the third round brings it down to 0. Try a point that was never seen: for $\mathbf{x} = (8, 4)$ the three neurons output $(+, -, +)$, the score is $0.973 - 0.896 + 0.805 = 0.882$, and the prediction is $+1$.

**What this result means.** The same set of numbers fits into the four tables of this section:

- **Aggregation**: the three columns $g_1$, $g_2$, $g_3$ of the table are each point's new features $\boldsymbol{\Phi}(\mathbf{x}_n) = (g_1, g_2, g_3)$, and $G$ is a linear classifier on these three features with weights $\alpha_t$. This is exactly the handout's line $\phi_t(\mathbf{x}) = g_t(\mathbf{x})$.
- **Extraction**: nobody supplied in advance where the three lines cut ($-5$, $+1$, $-3$); they are parameters found one by one over three rounds, which is the $g_t$ parameters written in the handout's table.
- **Low-dimensional projection**: each stump looks at only one number, $p$ or $q$, which is a projection to $\mathbb{R}$.
- **The price of compression**: if PCA keeps only the first direction ($\tilde{d} = 1$), each point is left with only $p$. Points 7 and 8 both have $p$ equal to 4 but opposite labels, so every classifier that looks only at $p$ gets at least one of them wrong, and $E_{\text{in}}$ cannot go below $\frac{1}{8}$. For this article AdaBoost was actually run for more rounds on the data with only $p$, and $E_{\text{in}}$ stayed at $\frac{1}{8}$ throughout. PCA keeps the directions along which the data spreads out most; it does not look at the labels, and the direction it throws away may be precisely the one classification needs.

What PCA is good for in this example is visible too: without PCA, cutting stumps directly on $x_1$ and $x_2$, the best single stump misclassifies two points ($\epsilon = \frac{1}{4}$), and after the 45-degree rotation the best one misclassifies only one.

## How the error is brought down: gradients, equivalent problems, multiple steps

```youtube
url: https://www.youtube.com/watch?v=En-EyzFipaw
title: Finale :: Error Optimization Techniques @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–02:31 is the gradient descent family, 02:31–04:47 is switching to an equivalent problem, 04:47–08:07 is splitting into multiple steps, and Fun Time follows.)

Once we know where the features come from, the variables in the model still have to be solved for. Pages 7 to 9 of the handout sort the optimization approaches used in the course into three kinds.

### The gradient descent family: where there is a gradient, take a small step

The header of page 7: when $\nabla E$ 'approximately' defined, use it for 1st order approximation:

$$
\text{new variables} = \text{old variables} - \eta\,\nabla E
$$

Where this formula comes from was derived once in [Foundations Lecture 10: Logistic Regression](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-10-logistic-regression-en); here it is walked through again. Take a small step $\eta$ in a unit direction $\mathbf{v}$ and use the first-order Taylor expansion:

$$
E(\mathbf{w} + \eta\mathbf{v}) \approx E(\mathbf{w}) + \eta\,\mathbf{v}^\top\nabla E(\mathbf{w})
$$

To make the right-hand side smallest, the inner product $\mathbf{v}^\top\nabla E(\mathbf{w})$ has to be smallest. The inner product of two vectors is smallest when they point in opposite directions, so $\mathbf{v} = -\nabla E(\mathbf{w})/\lVert\nabla E(\mathbf{w})\rVert$, and absorbing the length into $\eta$ gives the line above. In the lecture, Lin explains that as long as there is a gradient direction, or some gradient direction can be roughly computed, we treat it as a first-order approximation of the error function, and the conclusion is to take a small step in the direction of the negative gradient. The 'approximately' in the header refers to "can be roughly computed".

The slide has three columns:

| Approach | Models listed on the handout | The lecture's explanation |
|---|---|---|
| SGD/Minibatch/GD | (Kernel) LogReg; Neural Network [backprop]; Matrix Factorization; Linear SVM (maybe) | SGD draws one point at random and moves along that point's error direction; minibatch draws a handful of points at random and moves along the direction of that handful combined |
| Steepest Descent | AdaBoost; GradientBoost | Instead of taking just a small step in that direction, take a big step, and see how that step can bring the error we care about down the most |
| Functional GD | AdaBoost; GradientBoost | The direction taken is a function, not a vector |

The first column has two annotations. The [backprop] after Neural Network is the accompanying technique: in the lecture Lin says it helps compute the gradient quickly. The (maybe) after Linear SVM is not explained on the handout; the lecture's explanation is that this course had no time for it, but in practice many solvers for linear SVM are designed around SGD.

AdaBoost and GradientBoost appear in both of the last two columns because they do both things: the direction is a function, and the step size is optimal.

An addition in this article: "the direction is a function" can be seen with the eight-point example. The variables being updated here are not a weight vector but the eight points' individual scores $s_n = \sum_\tau \alpha_\tau g_\tau(\mathbf{x}_n)$. Adding a new $g_t$ and moving a distance $\eta$ turns each point's score into $s_n + \eta\,g_t(\mathbf{x}_n)$; the outputs of $g_t$ on the eight points, $(\pm 1, \ldots, \pm 1)$, play the role of the direction vector $\mathbf{v}$ in ordinary gradient descent. Techniques Lecture 11 showed that the direction that brings the exponential error down fastest is exactly the $g_t$ with the lowest weighted error rate $\epsilon_t$, so AdaBoost's "pick the best stump" in every round is a search for a direction.

With the direction fixed, the same example can be used to compute "the optimal step size" once. Techniques Lecture 11 views AdaBoost as minimizing the exponential error; once the direction $g_t$ is fixed, the step size $\eta$ should minimize

$$
\widehat{E}_{\text{ADA}}(\eta) = \sum_{n=1}^{N} u_n^{(t)} \exp\big(-\eta\, y_n g_t(\mathbf{x}_n)\big)
$$

Correctly classified points have $y_n g_t(\mathbf{x}_n) = +1$, and misclassified points have $-1$. With normalized weights, the correct ones total $1 - \epsilon_t$ and the incorrect ones total $\epsilon_t$:

$$
\widehat{E}_{\text{ADA}}(\eta) = (1 - \epsilon_t)\,e^{-\eta} + \epsilon_t\,e^{\eta}
$$

Setting the derivative with respect to $\eta$ to 0: $-(1 - \epsilon_t)e^{-\eta} + \epsilon_t e^{\eta} = 0$, and rearranging gives $e^{2\eta} = (1 - \epsilon_t)/\epsilon_t$, so

$$
\eta_t = \ln\sqrt{\frac{1 - \epsilon_t}{\epsilon_t}} = \alpha_t
$$

The optimal step size is exactly AdaBoost's vote. Substituting back, the minimum value is $2\sqrt{\epsilon_t(1 - \epsilon_t)}$. For round 1 of the example, $\epsilon_1 = \frac{1}{8}$:

| Step size $\eta$ | $\frac{7}{8}e^{-\eta} + \frac{1}{8}e^{\eta}$ |
|---|---|
| $0$ (no step) | $1$ |
| $0.1$ (a fixed small step) | $0.930$ |
| $\ln\sqrt{7} \approx 0.973$ (optimal) | $\frac{\sqrt{7}}{4} \approx 0.661$ |

In the same direction, a small step lowers the exponential error by only 7%, while going to the optimal step size lowers it by 34%. Over the three rounds the total exponential error goes $1 \to 0.661 \to 0.463 \to 0.345$, multiplied each round by $2\sqrt{\epsilon_t(1 - \epsilon_t)}$ (which is $0.661$, $0.700$, and $0.745$ respectively). The exponential error is an upper bound on the 0/1 error, and as the upper bound is pushed down, $E_{\text{in}}$ follows it down to 0.

The footer reads possibly 2nd order techniques, GD under constraints. The lecture's explanation: gradient descent is a first-order approximation, and using a second-order approximation instead gives methods such as Newton's method; gradient descent was originally designed for the case without constraints, and with constraints it needs some modification. Many more advanced methods are simply the models already learned paired with different ways of optimizing.

### Switching to an equivalent problem: if the original cannot be solved, find one that can

Page 8 of the handout: when difficult to solve original problem, seek for equivalent solution. In the lecture, Lin says that as the Techniques course goes on, optimization problems appear that at first glance offer no place to start, and it often takes mathematical derivation to reshape them into a problem we know how to solve.

| Model | The equivalence written on the handout | What was done (this article's summary) | Review |
|---|---|---|---|
| Dual SVM | equivalence via convex QP | The number of variables in the primal problem is tied to the feature dimension; switching to the dual problem leaves only $N$ variables, and only then can a kernel be attached | [Techniques Lecture 2](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-02-dual-svm-en) |
| Kernel LogReg; Kernel RidgeReg | equivalence via representer | The representer theorem guarantees that the optimal $\mathbf{w}$ can be written as $\sum_n \beta_n \mathbf{z}_n$; substituting it in changes the variables from $\mathbf{w}$ to $\boldsymbol{\beta}$, and only kernels remain in the formula | Techniques Lecture 5, Lecture 6 |
| PCA | equivalence to eigenproblem | An optimization problem that looks complicated ends up requiring only the solution of an eigenvalue problem | Techniques Lecture 13 |

The PCA row can be verified with the example. When only one direction is sought, the linear autoencoder maximizes the sum of squares after projection, with $\mathbf{w}$ constrained to be a unit vector:

$$
\max_{\mathbf{w}} \ \sum_{n=1}^{N} \big(\mathbf{w}^\top\mathbf{x}_n\big)^2 = \mathbf{w}^\top\mathrm{X}^\top\mathrm{X}\,\mathbf{w} \qquad \text{subject to} \quad \mathbf{w}^\top\mathbf{w} = 1
$$

(The $\mathbf{x}_n$ have already had the mean subtracted.) A short derivation added in this article: handle the constraint with a Lagrange multiplier $\lambda$, and differentiating with respect to $\mathbf{w}$ gives $\mathrm{X}^\top\mathrm{X}\mathbf{w} = \lambda\mathbf{w}$, so the optimal solution must be an eigenvector; the objective value is then $\mathbf{w}^\top(\lambda\mathbf{w}) = \lambda$, and to maximize it we pick the one with the largest eigenvalue.

In the example $\mathrm{X}^\top\mathrm{X} = \begin{bmatrix} 30 & 6 \\ 6 & 30 \end{bmatrix}$. Solve the original problem once directly, without eigenvalues: write a two-dimensional unit vector as $\mathbf{w} = (\cos\theta, \sin\theta)$, and

$$
\mathbf{w}^\top\mathrm{X}^\top\mathrm{X}\,\mathbf{w} = 30\cos^2\theta + 12\cos\theta\sin\theta + 30\sin^2\theta = 30 + 6\sin 2\theta
$$

The largest value of $\sin 2\theta$ is 1, which happens at $\theta = 45°$, where the value is 36 and the direction is $\frac{1}{\sqrt{2}}(1, 1)$. That is identical to the $\lambda = 36$ and $\mathbf{w}_1$ obtained earlier from the eigenvalue problem; the minimum value 24 happens at $\theta = 135°$ and corresponds to the other eigenvalue and the direction of $\mathbf{w}_2$. In two dimensions the problem can still be solved directly like this; once the dimension is high no such formula can be written down, while the eigenvalue problem has ready-made solvers. That is the benefit "equivalence" brings.

The lecture's reminder about this kind of approach is that transforming a problem often involves deeper mathematics, and anyone who wants to understand machine learning models better can read more of the relevant mathematics in the linear algebra and optimization literature. As for the footer, some other boosting models and modern solvers of kernel models rely on such a technique heavily, the lecture's explanation is that some boosting models not covered in class are designed this way, and some solvers for kernel models also lean heavily on "can this be turned into an equivalent form that is easier to solve".

### Splitting into easier sub-problems

Page 9 of the handout: when difficult to solve original problem, seek for 'easier' sub-problems. The three columns are three ways of splitting.

**Multi-Stage.** The variables are split into groups; a group is frozen once solved, and then the next is solved. In the lecture, Lin goes through the five models on the handout one by one:

- probabilistic SVM: kernel logistic regression is hard to solve, so solve the SVM first, freeze it, and then do the second-stage fine-tuning.
- linear blending and stacking: the first stage gets the $g_t$, and the second stage gets $G$.
- RBF Network: the first stage finds the centers, and the second stage combines them.
- DeepNet pre-training: pre-train one layer and freeze it, then do the next layer.

**Alternating Optim. (alternating optimization).** When two groups of variables cannot be solved together, solve one group with the other fixed, then the other way around, alternating until satisfied. The handout lists k-Means (Techniques Lecture 14) and alternating LeastSqr (the alternating least squares of matrix factorization in Techniques Lecture 15). The difference from multi-stage is that it goes back: multi-stage solves each group only once, while alternating optimization goes back and forth several times.

At the end of this column the handout adds a parenthesized (steepest descent). The lecture's explanation is that steepest descent first finds a direction, then tries to take the largest step, then finds the next direction and takes the largest step again; it contains two actions, optimizing the direction and optimizing the step, so it can be seen as an extended example of alternating optimization. The eight-point example works exactly like this: each round first chooses $g_t$ (the direction) and then computes $\alpha_t$ (the step).

**Divide & Conquer.** The handout lists only decision tree. In the lecture, Lin explains that finding the globally best decision tree is very hard, so we split first, find a decision tree on each side, and put them together; when the data has been cut small enough and pure enough, returning a constant is enough.

The footer reads useful for complicated models. In the lecture, Lin says everyone will meet more and more complicated models in the future, and in those models it is often an understanding of optimization that makes it possible to actually find good parameters.

### Fun Time: running DeepNet on PCA-preprocessed data

**Question (page 10):** When running the DeepNet algorithm introduced in Lecture 213 (the handout's numbering, which is Techniques Lecture 13) on a PCA-preprocessed data set, which optimization technique is used?

1. variants of gradient-descent
2. locating equivalent solutions
3. multi-stage optimization
4. all of the above

**Answer: 4.** The handout's answer gives one item per option: minibatch GD for training; equivalent eigenproblem solution for PCA; multi-stage for pre-training. The item-by-item explanations below are additions in this article:

- Option 1: after pre-training, the DeepNet of Techniques Lecture 13 still fine-tunes the whole network with backprop, which belongs to the gradient descent family.
- Option 2: the data first goes through PCA, and PCA is solved by the very eigenvalue problem in "switching to an equivalent problem".
- Option 3: pre-training is done layer by layer, each layer frozen once it is done, which is multi-stage. One level further out, the pipeline "PCA first, then pre-training, then fine-tuning" is itself multi-stage.

All three hold, so choosing only 1, 2, or 3 is incomplete. When giving the answer in the lecture, Lin uses looser wording: training may use gradient descent, PCA may use solving an eigenvalue problem, and pre-training uses the optimization of many layers.

An addition in this article: the eight-point example also uses all three. PCA is an equivalent solution, AdaBoost is the functional version of gradient descent plus the optimal step size, and "finish PCA and freeze it, then run AdaBoost" is multi-stage. Compared with an ordinary neural network of the same 2–3–1 shape, backprop tunes all the weights together with the gradient, while here the work is split into three stages, each using a method it knows how to solve.

## What to do when the model is too powerful: brakes and the dashboard

```youtube
url: https://www.youtube.com/watch?v=b6t22jVVC0s
title: Finale :: Overfitting Elimination Techniques @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–04:57 is regularization, 04:57–06:21 is validation, and Fun Time follows.)

In the lecture, Lin opens this section by saying that with many features and the ability to optimize, it looks as though a $g$ with very small $E_{\text{in}}$ can be found; but a small $E_{\text{in}}$ is not what matters most, and these $g$ often overfit, so we have to find ways to hit the brakes, and the more complicated the model, the more the brakes matter.

### Regularization: eight kinds of brakes

The header of page 11: when model too 'powerful': add brakes somewhere. Eight boxes follow:

| Brake | Models listed on the handout | The lecture's explanation | Review |
|---|---|---|---|
| large-margin | SVM; AdaBoost (indirectly) | SVM derived a lot around the large-margin idea; what AdaBoost optimizes is also related to the margin, so it indirectly achieves the fat-boundary effect | Techniques Lecture 1, Lecture 11 |
| L2 | SVR; kernel models; NNet [weight-decay] | The kernel methods derived from the representer theorem all contain L2 regularization; so does the squared-length-of-$\mathbf{w}$ term in SVR | Techniques Lectures 5, 6, 12 |
| voting/averaging | uniform blending; Bagging; Random Forest | When the majority is right, it can correct what a minority does not do well enough, and the model is less sensitive to the minority | Techniques Lecture 7, Lecture 10 |
| denoising | autoencoder | To resist noise, feed noise in | Techniques Lecture 13 |
| weight-elimination | NNet | Beyond L2, also try to make the weights fewer | Techniques Lecture 12 |
| constraining | autoenc. [weights]; RBF [# centers] | Reduce the number of parameters or add conditions when setting up the model: the autoencoder requires the encoding and decoding weights to be the same, and the RBF network limits the number of centers | Techniques Lecture 13, Lecture 14 |
| pruning | decision tree | Cut the tree back so that the model's complexity is not so high | Techniques Lecture 9 |
| early stopping | NNet (any GD-like) | Stopping early uses less model complexity; it applies to every method in the gradient family | Techniques Lecture 12 |

For the denoising autoencoder Lin uses an analogy in the lecture: it is like a vaccine, where a weakened virus is injected first, and once antibodies have formed the real virus is no longer something to fear.

The footer reads arguably most important techniques. In the lecture Lin puts it more bluntly: the earlier parts on how to use features and how to optimize took up more space, but what matters most is the brakes, not the accelerator. When driving, the accelerator makes the ride enjoyable, and in an emergency it is the brakes that save your life.

Two of the brakes in the table can be shown to work with very little arithmetic.

**Weight decay is L2.** Take the $E_{\text{aug}}(\mathbf{w}) = E_{\text{in}}(\mathbf{w}) + \frac{\lambda}{N}\mathbf{w}^\top\mathbf{w}$ of [Foundations Lecture 14: Regularization](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-14-regularization-en) and do one step of gradient descent on it:

$$
\mathbf{w} \leftarrow \mathbf{w} - \eta\Big(\nabla E_{\text{in}}(\mathbf{w}) + \frac{2\lambda}{N}\mathbf{w}\Big) = \Big(1 - \frac{2\eta\lambda}{N}\Big)\mathbf{w} - \eta\,\nabla E_{\text{in}}(\mathbf{w})
$$

Each step first multiplies the old weights by a number slightly less than 1 and then moves along the original gradient. For example, with $\eta = 0.1$ and $\lambda/N = 0.05$ the factor is $0.99$. In the lecture, Lin explains that shrinking the weights a little at every step of gradient descent is doing L2 regularization.

**Why voting and averaging act as a brake.** Techniques Lecture 7 derived an identity when covering uniform blending. Fix a point $\mathbf{x}$, let $G$ be the average of $T$ hypotheses $g_t$, and let $f$ be the target value; then

$$
\underset{t}{\text{avg}}\,\big(g_t - f\big)^2 = \underset{t}{\text{avg}}\,\big(g_t - G\big)^2 + \big(G - f\big)^2
$$

The derivation is a single step: split $g_t - f$ into $(g_t - G) + (G - f)$ and square it; the cross term is $2(G - f)\cdot\text{avg}(g_t - G)$, and since $\text{avg}(g_t - G) = G - G = 0$, the cross term vanishes. The following numbers are made up for this article: at some point $f = 1$, and three $g_t$ predict $0.4$, $1.3$, and $1.6$.

- $G = (0.4 + 1.3 + 1.6)/3 = 1.1$.
- Left-hand side: $(0.36 + 0.09 + 0.36)/3 = 0.27$, the average error of the three $g_t$.
- First term on the right: $(0.49 + 0.04 + 0.25)/3 = 0.26$, how much the three $g_t$ disagree with one another.
- Second term on the right: $(1.1 - 1)^2 = 0.01$, the error of $G$.
- $0.26 + 0.01 = 0.27$, and the identity holds.

Three $g_t$ that are each inaccurate (average error $0.27$) leave an error of only $0.01$ after averaging; the $0.26$ that was removed is exactly the disagreement among them. The more the $g_t$ differ, the more averaging can remove, which is why random forests work so hard to make every tree different.

### Validation: watch the dashboard when you drive

The header of page 12: when model too 'powerful': check performance carefully and honestly. In the lecture Lin continues the driving analogy: regularization is the brakes, and validation is the dashboard that lets you check how you are actually doing right now. [Foundations Lecture 15: Validation](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles-en) covers validation in general, and Techniques introduced three more kinds:

| Approach | Models listed on the handout | The lecture's explanation | Review |
|---|---|---|---|
| # SV | SVM/SVR | The number of support vectors roughly tells you how much complexity the model used, and it can serve as a checking mechanism | Techniques Lecture 4 |
| OOB | Random Forest | Bagging's sampling naturally leaves some points undrawn, and they can be used for something like validation | Techniques Lecture 10 |
| Internal Validation | blending; DecTree pruning | Validation is not only for looking at final performance; internal operations such as blending and pruning also often use validation data to make wiser decisions | Techniques Lecture 7, Lecture 9 |

This article adds two numbers to make the first two rows more concrete. The conclusion of Techniques Lecture 4 is that an SVM's leave-one-out cross-validation error does not exceed the proportion of support vectors, $\#\text{SV}/N$; with the numbers from the Fun Time of Techniques Lecture 2, $5566$ examples and $1126$ support vectors, the upper bound is $1126/5566 \approx 0.202$. Techniques Lecture 10 computed that when $N$ is large, the probability that a point is never drawn in a given round of bagging is $(1 - 1/N)^N \approx 1/e \approx 0.368$, so each tree has about a third of the data available as its OOB data.

The footer reads simple but necessary. The lecture's advice: do not do machine learning blindfolded, just as nobody drives without looking at the dashboard; keep track of current performance at all times through clean data.

Back to the eight-point example: $E_{\text{in}} = 0$ only says that the three lines memorized these eight points. The example held out no validation data, so it says nothing at all about $E_{\text{out}}$. To use it for real, at least part of the data has to be held out to decide how many rounds to run ($T$ is one of this model's brakes) and how many directions PCA keeps.

### Fun Time: what a random forest relies on to eliminate overfitting

**Question (page 13):** What is the major technique for eliminating overfitting in Random Forest?

1. voting/averaging
2. pruning
3. early stopping
4. weight-elimination

**Answer: 1.** The handout's answer: Random Forest, based on uniform blending, relies on voting/averaging for regularization. Why the other options are wrong (an addition in this article):

- Option 2: Techniques Lecture 10 defines the random forest as bagging plus fully-grown C&RT decision trees; every tree is grown all the way and not pruned. A single fully-grown tree overfits very easily, and what the random forest relies on is the average of many trees.
- Option 3: early stopping is the brake for gradient-family methods, and a random forest's trees are not trained by gradient descent.
- Option 4: weight-elimination is a regularizer for neural networks, and a random forest has no weights of that kind.

The uniform blending identity is the numerical version of this question: each $g_t$ overfits in a different direction, and averaging removes the disagreement.

## How things are combined in practice: KDD Cup champion models and the top 10 algorithms

```youtube
url: https://www.youtube.com/watch?v=jIpwy-mPvIA
title: Finale :: Machine Learning in Practice @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–06:40 is the four KDD Cups, 06:40–09:33 is the ICDM top 10 algorithms, 09:33–10:30 is the Machine Learning Jungle, 10:30–10:58 is Fun Time, and the summary of the whole lecture follows.)

Lin's opening remark for this section in the lecture is that it is billed as looking at how models are used in practice, but it is really some self-promotion, taking everyone through which models the NTU teams used in the KDD Cup.

### Four KDD Cup champion models

Pages 14 to 17 of the handout cover one edition each. The first line of each page is the team's paper title and authors, and the composition of the model follows.

| Edition (paper) | Model composition on the handout | What the lecture adds |
|---|---|---|
| KDD Cup 2010 (Yu et al., *Feature engineering and classifier ensemble for KDD Cup 2010*) | linear blending of: Logistic Regression + many rawly encoded features; Random Forest + human-designed features | The encoding used for logistic regression is close to the binary vector encoding of the matrix factorization lecture, and encoding the raw data yields a long string of features; the random forest side does not use such raw data and instead uses features designed from human understanding of the problem |
| KDD Cup 2011 Track 1 (Chen et al., *A linear ensemble of individual and blended models for music rating prediction*) | NNet, DecTree-like, and then linear blending of: Matrix Factorization variants (including probabilistic PCA), Restricted Boltzmann Machines, k Nearest Neighbors, Probabilistic Latent Semantic Analysis, linear regression, NNet, & GBDT | Nonlinear blending comes first and linear blending only at the end; the task is a music recommender system |
| KDD Cup 2012 Track 2 (Wu et al., *A two-stage ensemble of diverse models for advertisement ranking in KDD Cup 2012*) | NNet, GBDT-like, and then linear blending of: Linear Regression variants (including linear SVR), Logistic Regression variants, Matrix Factorization variants, … | NNet and GBDT-like methods were used for blending because, according to the literature, such methods were relatively useful for that competition's data |
| KDD Cup 2013 Track 1 (Li et al., *Combination of feature engineering and ranking models for paper-author identification in KDD Cup 2013*) | linear blending of: Random Forest with many many many trees, GBDT variants; with tons of efforts in designing features | The random forest lecture mentioned that this edition used a great many trees to make the model more stable; the competition involved handling textual features, and a great deal of effort went into understanding the goal of the competition and designing features with human brainpower |

Each page ends with a one-line comment, and the four together form this section's argument:

1. 2010: yes, you've learned everything! In the lecture Lin asks the audience whether they have learned logistic regression and whether they have learned random forests. Nothing used is especially complicated; what has to go with it is an understanding of the models, knowing why each one fits and which features it pairs well with.
2. 2011: yes, you can 'easily' understand everything! This edition has two models not taught in class; the handout positions each in one phrase, and the lecture adds an explanation. Restricted Boltzmann Machines are an 'extended' autoencoder, and in the lecture Lin says they can be seen as a more complicated autoencoder, an angle worth starting from when the chance to read about them comes. Probabilistic Latent Semantic Analysis is, on the handout, an extraction model that has 'soft clusters' as hidden variables; in the lecture Lin says it does something similar to k-means, except that it does not require each point to belong to only one cluster and uses a probability distribution to find the latent clusters. Lin also says that someone who has finished this course should be able to read and follow these papers.
3. 2012: 'key' is to blend properly without overfitting. In the lecture Lin says people often ask for the NTU teams' secret, and one of the keys to success in those years was doing blending well and very systematically.
4. 2013: 'another key' is to construct features with domain knowledge. In the lecture Lin says the other key is understanding what the competition is asking for.

In the lecture Lin calls blending "making juice": a pile of models goes into the blender, and after a few rounds of blending the final model comes out; in both 2011 and 2012 the nonlinear blend came first and the linear blend last. The handout lists 2011's linear regression, NNet, and GBDT alongside the other ingredients, whereas in the lecture Lin says those three were the less important ingredients that year.

On domain knowledge, the lecture includes a reminder: when using models in practice, do not imagine handing the data to the machine and going off to sleep. Good machine learning often depends on good human learning to go with it. What a person can do is tell the machine what they understand about the problem: which features are more suitable, or at least give the machine a good feature-transform model (the example given in the lecture is deep learning). Only with good features can the machine learn good weights.

**This article's summary: placing the 2010 model into the three groups of tables for features, optimization, and overfitting.** The classification below is this article's, based on the tables on pages 2 to 12 of the handout.

| Component | Features | Optimization | Overfitting |
|---|---|---|---|
| Logistic Regression + rawly encoded features | Human-made encoding (of the binary vector encoding kind) | The gradient descent family | Page 11 of the handout does not list logistic regression; the L2 of Foundations Lecture 14 can be applied to it |
| Random Forest + human-designed features | Human-designed features, plus aggregation (uniform) and random low-dimensional projection | Divide and conquer within each tree | Voting/averaging; OOB |
| The final linear blending | Aggregation: the two models' outputs serve as features | Multi-stage | Internal validation |

This table is also the way to read the other three editions' models: ask the three questions of every block.

### The ICDM 2006 top 10 data mining algorithms

Page 18 of the handout lists the top 10 data mining algorithms named in 2006 by ICDM (which Lin spells out in the lecture as the International Conference on Data Mining). In the lecture Lin maps each one onto this course:

| Rank | Algorithm | The handout's note | The lecture's explanation |
|---|---|---|---|
| 1 | C4.5 | another decision tree | The course taught C&RT, and after understanding C&RT, C4.5 is not hard to read |
| 2 | k-Means | | Taught; it is a clustering method |
| 3 | SVM | | It has kernels and large margin inside |
| 4 | Apriori | for frequent itemset mining | Finds things that occur often, and often together, in the data; not quite a machine learning problem, and this course touches on it little |
| 5 | EM | 'alternating optimization' algorithm for some models | Can be seen as a special case of alternating optimization, used on probabilistic models |
| 6 | PageRank | for link-analysis, similar to matrix factorization | The method Google first used to analyze how important a website is; the details look a lot like matrix factorization, and in the end it also solves a very large eigenvalue problem |
| 7 | AdaBoost | | Learned |
| 8 | k Nearest Neighbor | | Learned |
| 9 | Naive Bayes | a simple linear model with 'weights' decided by data statistics | Not really taught; it can be seen as a very special linear model whose weights are decided by the statistics of the data rather than by optimization |
| 10 | C&RT | | Learned; two of the top ten are decision tree algorithms |

Of the ten, this course taught five directly: k-Means, SVM, AdaBoost, k Nearest Neighbor, and C&RT. For another four (C4.5, EM, PageRank, Naive Bayes) the handout uses one phrase each to tie them back to what was learned, and only Apriori has no counterpart. In the lecture Lin points out that this list is the view of the data mining field; the Foundations course said that data mining and machine learning often exchange methods, so the list represents only one side.

At the bottom of the page the handout lists a personal view of five missing ML competitors: LinReg, LogReg, Random Forest, GBDT, NNet. In the lecture, Lin explains that these five are tools already learned that are well suited to use yet are not on the top 10 list, and that neural networks and deep learning had only just begun to become popular when this video was recorded. The supplementary section after the handout's four sections picks up this thread.

### Machine Learning Jungle

Page 19 of the handout is a whole page of scattered terms: bagging, decision tree, support vector machine, neural network, kernel, sparsity, autoencoder, functional gradient, AdaBoost, dual, uniform blending, deep learning, nearest neighbor, decision stump, aggregation, large-margin, prototype, quadratic programming, SVR, kernel LogReg, GBDT, PCA, random forest, matrix factorization, Gaussian kernel, RBF network, probabilistic SVM, soft-margin, k-means, OOB error. The page title is Machine Learning Jungle, and the bottom line is welcome to the jungle!

This is not the first time this picture appears. Page 23 of the handout for [Foundations Lecture 16](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-16-three-learning-principles-en) has a page of terms laid out the same way, with the line ready for the jungle! at the bottom, at a time when almost none of these terms had been taught. In the lecture Lin says the jungle is not the forest of random forests, and that a jungle is full of tigers and fierce beasts; seeing this picture back in Foundations may have felt frightening, with so many unfamiliar terms. A course cannot cover everything, and the hope is that when people meet new applications and new methods later, they can relate them to these key concepts and not get lost in the jungle.

**How to do it:** take a sheet of paper, use this lecture's three questions as columns (where the features come from, how the error is brought down, what keeps it from overfitting), and fill in every model name on this page. The cells you cannot fill are the lectures to go back to.

### Fun Time: the lucky number of this class

**Question (page 20):** Which of the following is the official lucky number of this class?

1. 9876
2. 1234
3. 1126
4. 6211

**Answer: 3.** The handout's answer is just one sentence, May the luckiness always be with you! In the lecture Lin says this is the last exercise, a chance to be a little silly, and that the question is about the number that keeps recurring in the course. There is no derivation to do here, but the number can be found by flipping back through the earlier handouts. For example, the Fun Time of Techniques Lecture 2 has 5566 examples and 1126 support vectors; when Techniques Lecture 8 covers re-weighting, the total weight of the misclassified points is 1126 and that of the correct ones is 6211. Option 4, 6211, is 1126 written backwards and also appeared on that page; option 1, 9876, is the number of examples in another Fun Time of Techniques Lecture 8.

### Summary of this lecture

Page 21 of the handout sums up each of the four sections in one line:

- Feature Exploitation Techniques: kernel, aggregation, extraction, low-dimensional
- Error Optimization Techniques: gradient, equivalence, stages
- Overfitting Elimination Techniques: (lots of) regularization, validation
- Machine Learning in Practice: welcome to the jungle

The last line is no longer a preview of the next lecture; it reads next: happy learning! Lin's closing words in the lecture are that regularization keeps the machine from fixating on trivial details and validation lets you know at all times how you are doing; the hope is that everyone walks into the machine learning jungle without fear and, whether it is human learning or machine learning, goes on learning happily. The two courses add up to 32 lectures.

## Supplementary slides from the Fall 2024 on-campus course: modern deep learning that is not in MOOC Lecture 16

**This section is not part of MOOC Lecture 16, and it has no corresponding video.** The MOOC's deep learning goes only as far as the pre-training and autoencoder of Techniques Lecture 13. In the last three weeks of the [Fall 2024 on-campus course](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/), Hsuan-Tien Lin added four slide decks covering ReLU, initialization, momentum, and Adam, practices that later became standard equipment. The content below is organized from those four decks: [302u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/302u_handout.pdf), [303u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/303u_handout.pdf), [mlmai.ics.handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/mlmai.ics.handout.pdf), and [1126_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/1126_handout.pdf). All four can be downloaded directly, but there are only slides and no recordings. Page numbers in this section are each supplementary deck's own page numbers.

They are placed in this article because they connect to exactly the tables of this lecture: ReLU and initialization connect to the neural networks in "how to exploit features", momentum and Adam connect to "the gradient descent family", and 1126 is another way of organizing the whole course.

### The three versions each end differently

The same course ends in three differently arranged ways across three versions:

| Version | Content of the last few weeks |
|---|---|
| MOOC | Techniques Lecture 13 deep learning (pre-training and autoencoder) → Lecture 14 RBF networks → Lecture 15 matrix factorization → Lecture 16 Finale |
| [Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) | W13 (11/25) 212u, 213u → W14 (12/02) modern deep learning: 302u, 303u → W15 (12/09) no class, the mlmai.ics slides are posted → W16 (12/16) finale: 1126 |
| [Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) | W13 (12/02) no class, mlmai.ics is posted → W14 (12/09) final exam → W15 (12/16) 212u, 213u → W16 (12/23) modern deep learning and finale: 302u, 303u, 1126 |

Two things are worth noting. First, neither on-campus semester uses the MOOC's 216 handout; the finale week uses 1126. Second, the Fall 2026 paths for 302u, 303u, 1126, and mlmai.ics all returned 404 when opened on 2026-10-13 and will be made public only in their scheduled weeks, so this section follows the Fall 2024 version. The Fall 2026 course page states that there is a public simultaneous live stream, but this article did not check, video by video, whether the live streams leave complete recordings.

Fall 2024's HW7 was released in W14, and its questions cover material up to the neural networks of Techniques Lecture 12; it does not test the content of 302u/303u. In other words this section has no corresponding homework to practice on, and practice means doing it yourself; the two "How to do it" items below are this article's suggestions.

### 302u: activation functions and initialization

The cover of 302u reads "Machine Learning Soundings (機器學習深測) Lecture 2: Activation and Initialization", while the course page labels it "deep learning activation". It comes after 212u/213u (the on-campus versions of Techniques Lectures 12 and 13) and starts from backprop in a tanh network.

**Vanishing gradients** (pages 3–6): the $\delta^{(1)}$ of backprop is $\delta^{(L)}$ multiplied by a long chain of weights and $\phi'(s)$. tanh saturates when $\lvert s \rvert$ is large, $\phi'(s) = 1 - \tanh^2(s)$ approaches 0, and the gradients of the earlier layers become so small that they hardly update, so deep networks fail to train. This article adds a number: at $s = 2$, $\tanh(2) \approx 0.964$ and $\phi'(2) \approx 0.071$; setting the weights aside, the product of five layers of $\phi'$ alone is $0.071^5 \approx 1.8 \times 10^{-6}$. Page 6 lists six countermeasures: skip connections, small random initialization, layer-by-layer pre-training (Techniques Lecture 13), internal normalization, gradient normalization, and switching to a better activation function.

**The ReLU family** (pages 7–10):

- **ReLU**, $\phi(s) = \max(s, 0)$: the derivative is 1 on the positive side, so the gradient does not vanish about half the time; each example activates only some of the neurons, and computation is fast. The slides say it is arguably the most commonly used activation function in deep learning.
- **dead neuron**: if some neuron's $s$ is below 0 for every example, both its output and its gradient are 0, and it never updates again. Examples are a very large gradient step that pushes the bias far negative, or inputs that are all positive (images that have not been shifted) paired with negative weights.
- **Leaky ReLU**, $\phi(s) = \max(s, 0.01s)$: a little slope is kept on the negative side, which makes dead neurons less likely. The slides themselves ask: why 0.01?
- **Parametric ReLU**, $\phi(\alpha, s) = \max(s, \alpha \cdot s)$: treat $\alpha$ as a parameter too and learn it with backprop. The slides' conclusion is "anything (loosely) differentiable is learnable".

Parametric ReLU is the same idea as the extraction on page 4 of the handout: even the shape of the activation function is treated as a variable to be learned.

**Initialization** (pages 11–14): all zeros is too symmetric for tanh and not differentiable for ReLU; setting everything to the same constant turns the neurons into copies of one another; values that are too large saturate tanh and kill part of a ReLU network. So what is needed is **small zero-mean random values**. The slides then derive how large the variance should be, where $d^{(\ell-1)}$ and $d^{(\ell)}$ are this layer's numbers of inputs and outputs:

- For tanh, keeping the variance of each layer's output unchanged in the forward pass gives $\text{var}(w) = 1/d^{(\ell-1)}$, while the backward pass requires $1/d^{(\ell)}$. **Xavier initialization** takes a compromise between the two, $\text{var}(w) = 2/(d^{(\ell-1)} + d^{(\ell)})$.
- ReLU keeps only half, so $\mathbb{E}(x^2)$ is half the variance of $s$, and a factor of 2 has to be multiplied back in: **He initialization**, $\text{var}(w) = 2/d^{(\ell-1)}$.

This article plugs in one set of numbers: a layer with 256 inputs and 128 outputs. Xavier's variance is $2/384 \approx 0.0052$, a standard deviation of about $0.072$; He's variance is $2/256 \approx 0.0078$, a standard deviation of about $0.088$. Both are far smaller than 1, and the wider the layer, the smaller the initial weights.

The original papers attached on the course page: ReLU is [Glorot, Bordes & Bengio](http://jmlr.org/proceedings/papers/v15/glorot11a/glorot11a.pdf), Leaky ReLU is [Maas, Hannun & Ng](https://ai.stanford.edu/~amaas/papers/relu_hybrid_icml2013_final.pdf), and Parametric ReLU is [He, Zhang, Ren & Sun](https://arxiv.org/abs/1502.01852).

### 303u: optimization in deep learning

303u is Lecture 3 of the same series, Optimization in Deep Learning, and it is very short. It connects to the first column of "the gradient descent family" on page 7 of the handout.

Page 2 first describes the error surface: local minima are not as bad as imagined; saddle points and local maxima are easy to escape with SGD; plateaus need a larger $\eta$; and in ravines back-and-forth oscillation has to be avoided. Computing gradients with backprop is slow, so minibatch SGD is used, at the price of unstable gradient estimates. To get stability, average.

- **Momentum** (pages 3–5): averaging over $M$ minibatches costs $M$ times the computation, while reusing past gradients does not. A sliding window with uniform weights is not good enough, so it is replaced by an exponentially decaying moving average $\mathbf{v}_t = \beta\mathbf{v}_{t-1} + (1 - \beta)\boldsymbol{\Delta}_t$, and $\beta = 0$ falls back to plain SGD. The benefits are cancelling part of the variance, damping the oscillation in ravines, and escaping shallow local optima and saddle points.
- **RMSProp** (pages 6–8): the wish is for components with large gradients to take smaller steps. With only stochastic gradients available, take a moving average $\mathbf{u}_t$ of $\boldsymbol{\Delta}_t \odot \boldsymbol{\Delta}_t$, and the step size of each component is $\eta \cdot (u_t + \epsilon)^{-1/2}$.
- **Adam** (page 9): roughly momentum plus RMSProp plus global decay. The slides' caution is that Adam is usually more aggressive than plain SGD, but may also overfit faster.

This article uses four steps to show how momentum damps oscillation. Suppose the gradient of some component jumps back and forth across the two sides of a ravine: $+1, -1, +1, -1$, with $\beta = 0.9$ and $v_0 = 0$:

| $t$ | $\Delta_t$ | $v_t = 0.9\,v_{t-1} + 0.1\,\Delta_t$ |
|---|---|---|
| 1 | $+1$ | $0.1$ |
| 2 | $-1$ | $0.09 - 0.1 = -0.01$ |
| 3 | $+1$ | $-0.009 + 0.1 = 0.091$ |
| 4 | $-1$ | $0.0819 - 0.1 = -0.0181$ |

Originally every step is a back-and-forth move of size 1; after averaging the largest is only $0.1$. If the gradient were $+1$ all the time, $v_t$ would climb slowly to nearly 1, so components with a consistent direction are not suppressed.

The slides' caution about Adam maps back to the regularization table: the more aggressive the optimization, the less the brakes (early stopping, L2) can be skipped.

The papers attached on the course page: [Rumelhart, Hinton & Williams](https://rdcu.be/b4ocH) for backprop, [Qian](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.57.5612&rep=rep1&type=pdf) for momentum, and [Adam (Kingma & Ba)](https://arxiv.org/pdf/1412.6980.pdf).

**How to do it:** write a two-layer ReLU network in numpy and, on the same data, compare three initializations (all zeros, standard normal, He) and three optimizers (SGD, momentum, Adam), plotting one training loss curve per combination. Nine curves on one plot make the complete experimental version of 302u plus 303u.

### mlmai.ics: the slides of a talk

In Fall 2024, W15 had no class because the instructor was attending ACML 2024 and NeurIPS 2024, and the course page posted the mlmai.ics slides in its place. This deck is Hsuan-Tien Lin's keynote "Machine Learning for Modern Artificial Intelligence", given on 2020-12-17 at the International Computer Symposium 2020, held together with the results presentation of the Ministry of Education's AI technology and application talent cultivation program.

The talk has three parts:

1. **ML for (Modern) AI**: Lin's definition of modern AI is "intelligently ≈ easily", that is, application intelligence; machine learning is the tool that "cooks" big data into AI, and at the start it often has to draw on human domain knowledge. The example is estimating typhoon intensity with a CNN.
2. **ML Research for Modern AI**: three research cases. Cost-sensitive multiclass classification (different misclassifications carry different costs, for example mistaking COVID-19 for healthy), active learning by learning (using a bandit to choose the active learning strategy, open-sourced as [libact](https://github.com/ntucllab/libact)), and typhoon intensity estimation. Each case comes with a reflection on "did this get more realistic?"; for instance, the most frequently reported problem with libact is that it is hard to install on Windows/Mac.
3. **ML for Future AI**: more creative, more interpretable, and more interactive, corresponding to winning human respect, trust, and affection.

The value of this deck is that it shows how textbook material becomes research topics: cost-sensitive error comes from [Foundations Lecture 8](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-08-noise-and-error-en), and the bandit is the slot machine problem of Foundations HW2. The first part's "it has to draw on human domain knowledge" says the same thing as MOOC Lecture 16's comment on KDD Cup 2013.

### 1126: the super short summary

The cover of 1126 reads "Machine Learning Foundations, Lecture 1126: Super Short Summary". The number is the "official lucky number of this class" from the Fun Time above. It condenses the whole semester into 11 models, each described with the same set of fields: err, the error the algorithm uses, the optimization method, Φ, regularization/validation, parameters, and practical use.

| # | Model | Practical use written on the slides |
|---|---|---|
| 1 | PLA | online learning and teaching |
| 2 | ridge linear regression | as a decent baseline |
| 3 | logistic regression | baseline for hard and soft classification |
| 4 | ridge polynomial regression | often used for one-dimensional regression |
| 5 | soft-margin linear SVM | large-scale classification |
| 6 | soft-margin kernel SVM | medium-scale classification |
| 7 | AdaBoost | to "boost" decision trees or stumps |
| 8 | decision tree | an interpretable nonlinear model |
| 9 | bagging/random forest | to make any model or tree more stable |
| 10 | GBDT | information retrieval and competitions |
| 11 | neural networks/deep learning | vision and speech |

The description of the 11th model brings 302u and 303u straight in: GD/SGD with Adam, Xavier/He initialization, ReLU or tanh neurons, and regularization by early stopping, L1/L2, and dropout.

Among the fields of 1126, the three for optimization method, Φ, and regularization/validation are exactly the three questions of MOOC Lecture 16. The two materials differ in the direction of organization: 1126 is written row by row by model, and the 216 handout is written table by table by technique.

**How to do it:** read this table side by side with this lecture's classification tables. With the 11 models as rows and the three questions as columns, the cross-tabulation is an index of the whole course.

## Self-check

**1. In the eight-point example, suppose round 1 did not pick the best stump but one with weighted error rate $\epsilon_1 = \frac{1}{4}$. What is this round's $\alpha_1$? What does the total exponential error drop to from 1? How does that compare with the original $\epsilon_1 = \frac{1}{8}$?**

Answer: $\blacklozenge_1 = \sqrt{(3/4)/(1/4)} = \sqrt{3}$, $\alpha_1 = \ln\sqrt{3} \approx 0.549$. The total exponential error is multiplied by $2\sqrt{\epsilon_1(1 - \epsilon_1)} = 2\sqrt{3/16} = \frac{\sqrt{3}}{2} \approx 0.866$. Originally it was $0.661$. The more accurate the direction (the smaller $\epsilon$), the larger the optimal step size, and the more error a single round can remove.

**2. Place the RBF Network into this lecture's three groups of tables: where do its features come from? Which optimization techniques does it use? What is its brake?**

Criteria: all three items have to match the handout's tables. Features: the basic unit is the Gaussian RBF (page 3), and the centers are extracted hidden variables supplied by k-means (page 4). Optimization: overall it is multi-stage, finding the centers first and then doing the linear combination; within that, the k-means that finds the centers is alternating optimization (page 9). Brake: limiting the number of centers (the constraining box on page 11). Answering only "the RBF Network is an extraction model" is not complete.

**3. A mean-subtracted two-dimensional data set gives $\mathrm{X}^\top\mathrm{X} = \begin{bmatrix} 5 & 3 \\ 3 & 5 \end{bmatrix}$. Without solving the eigenvalue problem, maximize $\mathbf{w}^\top\mathrm{X}^\top\mathrm{X}\mathbf{w}$ directly over $\mathbf{w} = (\cos\theta, \sin\theta)$; then solve the eigenvalue problem and confirm that the two answers agree.**

Answer: $\mathbf{w}^\top\mathrm{X}^\top\mathrm{X}\mathbf{w} = 5\cos^2\theta + 6\cos\theta\sin\theta + 5\sin^2\theta = 5 + 3\sin 2\theta$, with maximum value 8 at $\theta = 45°$ and direction $\frac{1}{\sqrt{2}}(1, 1)$. The eigenvalue problem: $(5 - \lambda)^2 - 9 = 0$, so $\lambda = 8$ or $2$; the eigenvector for $\lambda = 8$ solves $-3v_1 + 3v_2 = 0$ and is likewise $\frac{1}{\sqrt{2}}(1, 1)$. The largest eigenvalue is the maximum value of the objective.

**4. At some point the target value is $f = 5$, and three $g_t$ predict 2, 3, and 7. Compute the $G$ of uniform blending, the average squared error of the three $g_t$, and the squared error of $G$, and use the identity to say what the difference is.**

Answer: $G = (2 + 3 + 7)/3 = 4$. The average squared error is $(9 + 4 + 4)/3 = \frac{17}{3} \approx 5.67$. The squared error of $G$ is $(4 - 5)^2 = 1$. The difference $\frac{17}{3} - 1 = \frac{14}{3}$ should equal the average squared deviation of the $g_t$ from $G$: $(4 + 1 + 9)/3 = \frac{14}{3}$, which matches. The difference is the disagreement among the three $g_t$, and averaging removed it.

**5. In the example, if PCA keeps only the first direction, why can $E_{\text{in}}$ never reach 0 no matter how many rounds AdaBoost runs? What limitation of the info.-preserving compression on page 5 of the handout does this show?**

Criteria: the answer has to point out that point 7, $(7, 5)$, and point 8, $(5, 7)$, both have $p$ equal to 4 after projection but opposite labels, so every function that looks only at $p$ gives the same output on these two points and gets at least one wrong, hence $E_{\text{in}} \ge \frac{1}{8}$. The limitation: PCA preserves the variation of the data itself ($\lambda = 36$ versus $24$) and never looks at $y$ along the way, so the direction thrown away may be exactly the one carrying the information classification needs. How many directions to keep should be decided by validation.

## Exercises and corresponding reading

**The corresponding weeks in the two semesters.** The [Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) schedules the finale in W16 (12/16), and the slides used are 1126, not the MOOC's 216; the [Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) schedules it in W16 (12/23), the same week as modern deep learning. For details see "The three versions each end differently" above.

**Homework.** This lecture has no homework of its own. Fall 2024's last assignment, HW7, covers material up to the neural networks of Techniques Lecture 12; the guide to it and to the final project is in [Techniques Homework and Final Project](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project-en). The best practice for this lecture is three things: redo the eight-point example yourself; fill in a three-column table as described in the "Machine Learning Jungle" subsection; and run the nine-curve experiment that follows 303u.

**Further reading.** 302u/303u are only the entrance to deep learning. To go further, this site has [CMU 11-785](/posts/ai/2026-08-22-cmu-11785-course-overview-en) (whose lectures on [loss surfaces and momentum](/posts/ai/2026-08-22-cmu-11785-06-loss-surfaces-momentum-en) and [optimizers and regularization](/posts/ai/2026-08-22-cmu-11785-08-optimizers-regularization-en) pick up right where 303u leaves off), [MIT 6.7960](/posts/ai/2026-08-26-mit-67960-deep-learning-guide-en), and NTU's other track, [Hung-yi Lee's ML 2026](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en).

**Next.** This is the last lecture, so there is no next lecture. The series continues with [Techniques Homework and Final Project](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project-en); to look up a particular lecture, start from the [Course Overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en).

## Course video sources

Original videos: [Feature Exploitation Techniques](https://www.youtube.com/watch?v=WeLobtIDBzI), [Error Optimization Techniques](https://www.youtube.com/watch?v=En-EyzFipaw), [Overfitting Elimination Techniques](https://www.youtube.com/watch?v=b6t22jVVC0s), [Machine Learning in Practice](https://www.youtube.com/watch?v=jIpwy-mPvIA)

- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [Official course and recordings page](https://www.csie.ntu.edu.tw/~htlin/mooc/)

Checked: 2026-10-13. The video IDs, titles, and lengths were taken from the official playlist that day; YouTube has no caption tracks for these videos, and what this article reports from the lecture comes from transcripts made for it. The four Fall 2024 supplementary slide decks have no corresponding recordings.

## Update Log

- 2026-10-10: Marked the video status and checked the recording sources and how to obtain them.
- 2026-10-10: Rechecked the video status. The embedded videos match the lecture numbers in the official playlist.
- 2026-10-13: The whole series was changed to one article per lecture. This article already covered only Techniques Lecture 16; this time the handout's four sections were rewritten from the 216 handout and the transcripts of the four videos, adding explanations of the four Fun Time questions and the eight-point worked example. The content on the Fall 2024 supplementary slides is kept and moved after the handout's four sections.

## References

- [Techniques Lecture 16 handout 216_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/216_handout.pdf): the main source for the first four sections of this article; the classification tables, the four Fun Time questions, and the KDD Cup and ICDM content all come from this handout.
- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2): the IDs and titles of the four videos; what the text reports as said "in the lecture" is paraphrased from machine transcripts of these four videos.
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/): the official page for handouts and recordings.
- [Foundations Lecture 16 handout 16_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/16_handout.pdf): the "ready for the jungle!" page of terms on page 23, used for comparison with page 19 of this lecture.
- [Techniques Lecture 7 handout 207_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/207_handout.pdf): the uniform blending identity (page 9).
- [Techniques Lecture 8 handout 208_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/208_handout.pdf): the AdaBoost re-weighting rule used in the worked example, and the source of the three numbers 1126, 6211, and 9876.
- [Techniques Lecture 11 handout 211_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/211_handout.pdf): AdaBoost's exponential error and the optimal step size ηₜ = αₜ.
- [Techniques Lecture 13 handout 213_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/213_handout.pdf): the three steps of PCA used in the worked example.
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/): the schedule of the last four weeks, the scope of HW7, and the links to the supplementary slides.
- [Fall 2024 302u: Activation and Initialization](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/302u_handout.pdf): vanishing gradients, the ReLU family, Xavier/He initialization.
- [Fall 2024 303u: Optimization in Deep Learning](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/303u_handout.pdf): momentum, RMSProp, Adam.
- [Fall 2024 mlmai.ics: Machine Learning for Modern Artificial Intelligence](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/mlmai.ics.handout.pdf): the three parts of the 2020 talk.
- [Fall 2024 1126: Super Short Summary](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/1126_handout.pdf): the summary table of 11 models.
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/): the schedule of the last four weeks of Fall 2026.
- [Deep Sparse Rectifier Neural Networks (Glorot, Bordes & Bengio)](http://jmlr.org/proceedings/papers/v15/glorot11a/glorot11a.pdf): the ReLU paper attached to 302u on the course page.
- [Rectifier Nonlinearities Improve Neural Network Acoustic Models (Maas, Hannun & Ng)](https://ai.stanford.edu/~amaas/papers/relu_hybrid_icml2013_final.pdf): the Leaky ReLU paper.
- [Delving Deep into Rectifiers (He, Zhang, Ren & Sun)](https://arxiv.org/abs/1502.01852): the paper for Parametric ReLU and He initialization.
- [Learning representations by back-propagating errors (Rumelhart, Hinton & Williams)](https://rdcu.be/b4ocH): the backprop paper attached to 303u on the course page.
- [On the Momentum Term in Gradient Descent Learning Algorithms (Qian)](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.57.5612&rep=rep1&type=pdf): the momentum paper.
- [Adam: A Method for Stochastic Optimization (Kingma & Ba)](https://arxiv.org/pdf/1412.6980.pdf): the Adam paper.
- [libact](https://github.com/ntucllab/libact): the open-source active learning package mentioned in the mlmai.ics talk.
- [MOOC slide errata](https://www.csie.ntu.edu.tw/~htlin/mooc/errata.php): the official errata page.
- [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques: Course Overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en): where this lecture sits in the whole course, and the reading routes.
