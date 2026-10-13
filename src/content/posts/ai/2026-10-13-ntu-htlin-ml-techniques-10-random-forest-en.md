---
title: "Random Forests: Bagging plus Decision Trees and the Out-of-Bag Estimate | NTU Hsuan-Tien Lin Machine Learning Techniques Lecture 10"
date: 2026-10-13
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, ensemble, decision-trees, bagging]
lang: en
math: true
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 27
tldr: "A random forest is bagging applied to fully-grown C&RT trees, with each branch looking only at a few randomly projected features. When bootstrap draws N times, each example has about a 1/e ≈ 36.8% chance of not being used by a given tree. These out-of-bag examples give E_oob directly, a validation that needs no held-out data and no re-training; add the permutation test and you get an importance for every feature. The price is that the result wobbles with the random seed, so you keep adding trees until G is stable."
description: "A guide to Lecture 10 of NTU Hsuan-Tien Lin's Machine Learning Techniques, Random Forest: bagging plus fully-grown C&RT, random-subspace and random-combination branching, the derivation of how much data is out-of-bag, E_oob and model selection, feature importance by permutation test, and the KDD Cup 2013 experience with the number of trees, with a hand-computed example of eight examples and five trees."
draft: false
glossary:
  - term: "random forest"
    aliases: ["RF"]
    definition: "Draw several data sets by bootstrap, train a fully-grown C&RT decision tree on each, then let all the trees vote uniformly or average. The original version also randomly samples features, or combinations of features, at every branch."
    context: "Techniques Lecture 10 writes it as bagging + random-combination C&RT."
  - term: "OOB"
    aliases: ["out-of-bag", "out-of-bag examples"]
    definition: "The examples that bootstrap sampling did not draw. When the number of draws equals the data size N and N is large, each example has about a 1/e chance of being absent from a given bootstrap data set, and it can be used to validate the trees that never saw it."
    context: "Techniques Lecture 10 calls E_oob the self-validation of bagging/RF: no separate validation set has to be held out, and no re-training is needed."
  - term: "permutation test"
    aliases: ["permutation importance"]
    definition: "Shuffle the values of one feature across the examples, see how much the performance degrades, and use that gap as the feature's importance. Shuffling changes only who gets which value, not the overall distribution of the feature."
    context: "Techniques Lecture 10 pairs it with OOB to compute a random forest's feature importance without re-training."
  - term: "random subspace"
    definition: "Randomly pick d′ of the d features and look for the branch only in those d′ dimensions. The original random forest re-samples at every single branch."
    context: "Techniques Lecture 10 uses it to add diversity among the trees on top of bootstrap."
---

> 🌏 [中文版](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-10-random-forest)

**Video status: Videos included.** This article is written from the official MOOC handout [210_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/210_handout.pdf) and transcripts of this lecture's four official videos, with formulas following the handout. The transcripts are machine transcripts made for this article (Whisper), not official captions, and no human has proofread them. The videos are taught in Mandarin; the slides are in English. Each section opens with its official video and the approximate time ranges. Page numbers refer to the number at the lower right of each slide (0/22 to 22/22), and wherever the text says "in the lecture" it is paraphrasing what is said in the video.

This is Techniques Lecture 10 in [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en). The Roadmap on page 1 of the handout divides Techniques into three ways of handling features, and this lecture belongs to the second, Combining Predictive Features: Aggregation Models. The previous lecture, [Techniques Lecture 9: Decision Trees](/posts/ai/2026-09-30-ntu-htlin-ml-decision-tree-random-forest-gbdt-en), takes up a single line on that page: recursive branching (purification) for conditional aggregation of constant hypotheses. This lecture puts that tree inside the bagging of [Techniques Lecture 7: Blending and Bagging](/posts/ai/2026-09-30-ntu-htlin-ml-blending-bagging-adaboost-en) and gets the random forest (RF from here on).

The prerequisites are bootstrap and bagging from Techniques Lecture 7, C&RT from Techniques Lecture 9 (decision-stump branching, Gini impurity, fully-grown trees), and $E_{\text{val}}$ and model selection from [Foundations Lecture 15: Validation](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles-en). After reading, you should be able to write down the RF algorithm and its two kinds of random branching; derive roughly how much data bootstrap leaves undrawn; take a table of which example was used by which tree and compute $E_{\text{oob}}$ and the permutation-test feature importance by hand; and say how the number of trees should be decided.

The four sections answer these questions in order:

1. How bagging and decision trees fit together, and how else each tree can be made more different.
2. What the data that bootstrap did not draw can be used for.
3. How to tell which features matter.
4. What the boundary looks like in practice, and how many trees are enough.

## Applying bagging to decision trees, then making the trees more different

```youtube
url: https://www.youtube.com/watch?v=ATM3sH0D45s
title: Random Forest :: Random Forest Algorithm @ Machine Learning Techniques (機器學習技法)
```

(Video 00:19–01:29 reviews the previous lecture, 01:29–05:44 covers bagging plus decision trees, 05:44–09:10 random subspace, 09:10–12:16 random combination, and Fun Time follows.)

### What each of the two algorithms is like

Page 2 of the handout sets two algorithms from earlier lectures side by side. On the left is bagging:

1. For $t = 1, 2, \dots, T$, request size-$N'$ data $\tilde{\mathcal{D}}_t$ by bootstrapping with $\mathcal{D}$ (draw one example at a time, with replacement).
2. Hand $\tilde{\mathcal{D}}_t$ to the base algorithm $\mathcal{A}$ and obtain $g_t$.
3. Return $G = \text{Uniform}(\{g_t\})$, that is, let every $g_t$ have one vote (classification) or simply average them (regression).

On the right is the decision tree $\text{DTree}(\mathcal{D})$: if the termination criteria are met, return the base hypothesis at the leaf; otherwise learn a branching criterion $b(\mathbf{x})$, use it to split $\mathcal{D}$ into $C$ parts $\mathcal{D}_c$, recursively build a sub-tree $G_c \leftarrow \text{DTree}(\mathcal{D}_c)$ on each part, and return

$$
G(\mathbf{x}) = \sum_{c=1}^{C} [\![\, b(\mathbf{x}) = c \,]\!]\; G_c(\mathbf{x})
$$

Under each box is a one-line remark. Bagging reduces variance by voting/averaging; the decision tree has large variance, especially if fully-grown. Variance here means what it meant in Techniques Lecture 7: how much the hypothesis the algorithm returns changes when the data set is swapped for a slightly different one.

In the lecture, Lin explains why decision trees are especially unstable. A tree is carved out one cut at a time, and a small change in the data changes where a cut can go; after each cut every piece holds even less data, so later cuts are even more easily swayed by a handful of examples. A fully-grown tree, cut until nothing more can be cut, shows the problem most clearly.

One algorithm pushes variation down and the other varies a lot on its own, so the handout asks: putting them together? It also notes that this is aggregation of aggregation: a decision tree is already an aggregation that combines the constants at its leaves by conditions, and now a layer of bagging goes around it. In the lecture, Lin compares this way of mixing two things into one to the "pissing beef balls" from a Stephen Chow movie.

### The basic random forest

Page 3 gives the definition:

$$
\text{random forest (RF)} = \text{bagging} + \text{fully-grown C\&RT decision tree}
$$

The algorithm just replaces step 2 of bagging with a decision tree:

1. For $t = 1, 2, \dots, T$, request size-$N'$ data $\tilde{\mathcal{D}}_t$ by bootstrapping.
2. Obtain a tree $g_t$ by $\text{DTree}(\tilde{\mathcal{D}}_t)$.
3. Return $G = \text{Uniform}(\{g_t\})$.

In the lecture, Lin also explains where the name comes from: random refers to the randomness of bootstrap within bagging, and forest is there because every hypothesis under bagging is a tree, and many trees together look like a forest.

The handout lists three benefits, and the lecture adds a short explanation to each:

- **highly parallel/efficient to learn.** Each round learns one tree independently, with no ordering dependence between trees, so the work can be split across different machines. The decision tree is itself an efficient algorithm, and the two layers together run fast on today's computing architectures.
- **inherit pros of C&RT.** The previous lecture said C&RT handles multiclass classification, categorical features, and missing values naturally, and RF inherits all of these directly.
- **eliminate cons of fully-grown tree.** A fully-grown tree is too sensitive to the data and overfits easily; the voting in bagging eases this problem.

Why use fully-grown trees here instead of pruning first? An addition in this article: Techniques Lecture 7 splits the average performance of an algorithm into two parts, the performance of the "consensus" $\bar{g}$ (bias) and how far each $g_t$ strays from the consensus (variance), and bagging approximates the consensus by voting, so it works on the second part. The previous lecture used pruning to hold down the variance of a fully-grown tree; RF leaves that job to the vote, so each tree can be left to grow all the way.

### One more layer of randomness: each branch looks at only some of the features

The key to uniform aggregation is having $g_t$ that differ from one another. Page 4 first recalls what bagging does: randomness on the data side, randomly sampling $N'$ examples from $\mathcal{D}$. It then proposes another possibility: randomness on the feature side, randomly sampling $d'$ features from the $d$ features of $\mathbf{x}$.

If the sampled feature indices are $i_1, i_2, \dots, i_{d'}$, this amounts to a feature transform

$$
\boldsymbol{\Phi}(\mathbf{x}) = (x_{i_1}, x_{i_2}, \dots, x_{i_{d'}})
$$

The transformed space $\mathcal{Z} \in \mathbb{R}^{d'}$ is a random subspace of the original $\mathcal{X} \in \mathbb{R}^{d}$. The lecture's example has 100 features, with only 10 of them randomly chosen each time to build a tree; this round picks these 10 and the next round picks those 10, and the two trees clearly classify by very different criteria.

The handout points out two more things:

- Often $d' \ll d$, so this is in fact more efficient when $d$ is large. In the lecture, Lin explains that deciding where to cut used to mean going through all the cuts in 100 dimensions, and now only 10 have to be examined.
- The technique is not limited to decision trees: it can be generally applied on other models. In the lecture, Lin says it also works to apply it to SVM or AdaBoost and then aggregate.

The last line is a design specific to RF: original RF re-sample new subspace for each $b(\mathbf{x})$ in C&RT. The random subspace is not sampled once per tree; a new set of $d'$ features is drawn every time a branch has to be found. In the lecture, Lin says this is the original author's suggestion, and that sampling at every branch makes the trees look more different. So the definition of RF is updated to

$$
\text{RF} = \text{bagging} + \text{random-subspace C\&RT}
$$

### Random combination: letting a branch cut along a slanted line

Page 5 rewrites "sample $d'$ features" in matrix form: $\boldsymbol{\Phi}(\mathbf{x}) = \mathrm{P} \cdot \mathbf{x}$, where $\mathrm{P}$ has $d'$ rows, each sampled randomly from the natural basis (the unit vectors with a single component equal to 1 and the rest 0). As an example (made up for this article, not from the slides), with $d = 4$ and features 2 and 4 sampled:

$$
\mathrm{P} = \begin{bmatrix} 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}, \qquad \mathrm{P}\begin{bmatrix} 1 \\ 2 \\ 3 \\ 4 \end{bmatrix} = \begin{bmatrix} 2 \\ 4 \end{bmatrix}
$$

Written this way, the next step comes naturally. The question asked in the lecture is: why must the projection directions be these fixed coordinate-axis directions? The handout's answer is to let each row $\mathbf{p}_i$ of $\mathrm{P}$ be something other than the natural basis, so that the new features are random combinations of the original ones:

$$
\phi_i(\mathbf{x}) = \mathbf{p}_i^\top \mathbf{x}
$$

The handout calls these more powerful features for diversity. The same page has three more points:

- Often only a low-dimensional projection is considered: $\mathbf{p}_i$ has only $d''$ non-zero components. The lecture's example is that out of 100 features, this time 3 are picked and combined into one weighted score that gets cut, and next time another 5 are picked; the tree does not combine all 100 every time.
- Random subspace is its special case: $d'' = 1$ and $\mathbf{p}_i$ is a vector in the natural basis.
- original RF consider $d'$ random low-dimensional projections for each $b(\mathbf{x})$ in C&RT: the original RF generates $d'$ such random projections afresh at every branch, and C&RT then finds the best decision stump among these $d'$ new features.

Continuing the example above (made up for this article), replace $\mathrm{P}$ with two rows that each have $d'' = 2$ non-zero components:

$$
\mathrm{P} = \begin{bmatrix} 0 & 3 & 0 & -1 \\ 2 & 0 & 0 & 0.5 \end{bmatrix}, \qquad \mathrm{P}\begin{bmatrix} 1 \\ 2 \\ 3 \\ 4 \end{bmatrix} = \begin{bmatrix} 3 \times 2 - 4 \\ 2 \times 1 + 0.5 \times 4 \end{bmatrix} = \begin{bmatrix} 2 \\ 4 \end{bmatrix}
$$

The first new feature is $3x_2 - x_4$. A cut on it, say $3x_2 - x_4 \ge 1$, is a slanted line in the original space, where C&RT could previously make only vertical or horizontal cuts.

The page ends by writing RF as

$$
\text{RF} = \text{bagging} + \text{random-combination C\&RT}
$$

and adds: randomness everywhere! In the lecture, Lin says it is no wonder the method is called random forest: besides the randomness of bagging, there is also randomness in every branching step of C&RT.

The three layers of definition side by side:

| Version | Data for each tree | Features considered at each branch |
|---|---|---|
| Basic (page 3) | $N'$ examples by bootstrap | All $d$ original features |
| random-subspace (page 4) | Same | $d'$ randomly sampled original features, re-sampled at every branch |
| random-combination (page 5) | Same | $d'$ random combinations, each using $d''$ original features, re-sampled at every branch |

### Fun Time: which hypothesis a random-combination branch is equivalent to

**Question (page 6):** Within RF that contains random-combination C&RT trees, which of the following hypothesis is equivalent to each branching function $b(\mathbf{x})$ within the tree?

1. a constant
2. a decision stump
3. a perceptron
4. none of the other choices

**Answer: 3.** The handout's solution: in each $b(\mathbf{x})$, the input vector $\mathbf{x}$ is first projected by a random vector and then thresholded to make a binary decision, which is exactly what a perceptron does. As a formula, the decision stump on the new feature $\phi_i(\mathbf{x}) = \mathbf{p}_i^\top\mathbf{x}$ is

$$
b(\mathbf{x}) = \text{sign}\big(\mathbf{p}_i^\top\mathbf{x} - \theta\big)
$$

Take $-\theta$ as $w_0$ and $\mathbf{p}_i$ as the remaining weights, and it is the $\text{sign}(\mathbf{w}^\top\mathbf{x})$ of [Foundations Lecture 2: Perceptrons and PLA](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm-en). In the example above, the branch $3x_2 - x_4 \ge 1$ corresponds to $\mathbf{w} = (-1, 0, 3, 0, -1)$. Lin's summary in the lecture is that with projection, the cuts are no longer only vertical and horizontal; they can be slanted too.

Choice 1 is wrong because a constant does not split the data into two sides. Choice 2 holds only in a special case: in the random-subspace version with $d'' = 1$, the branch is a decision stump on an original feature; a general random combination uses more than one feature and is not a stump in the original space. One addition in this article: the direction $\mathbf{p}_i$ of this perceptron is generated randomly, and the data decide only which of the $d'$ candidate directions is chosen and the threshold $\theta$, which is unlike PLA learning the whole $\mathbf{w}$ from data.

## The data bootstrap did not draw can be used for validation

```youtube
url: https://www.youtube.com/watch?v=7oz5aO-FkR0
title: Random Forest :: Out-of-bag Estimate @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–01:26 is the OOB table, 01:26–04:24 counts how many examples are OOB, 04:24–10:25 compares with validation and defines the OOB error, 10:25–11:54 uses it for model selection, and Fun Time follows.)

### One table: which example was used by which tree

Page 7 goes back to the bagging procedure and lays it out as a table: each row is one example and each column is one $g_t$. If $(\mathbf{x}_n, y_n)$ was drawn into $\tilde{\mathcal{D}}_t$, that cell says $\tilde{\mathcal{D}}_t$; if it was not drawn, the cell gets a star. The table on the slide looks like this:

| | $g_1$ | $g_2$ | $g_3$ | $\cdots$ | $g_T$ |
|---|---|---|---|---|---|
| $(\mathbf{x}_1, y_1)$ | $\tilde{\mathcal{D}}_1$ | $\star$ | $\tilde{\mathcal{D}}_3$ | | $\tilde{\mathcal{D}}_T$ |
| $(\mathbf{x}_2, y_2)$ | $\star$ | $\star$ | $\tilde{\mathcal{D}}_3$ | | $\tilde{\mathcal{D}}_T$ |
| $(\mathbf{x}_3, y_3)$ | $\star$ | $\tilde{\mathcal{D}}_2$ | $\star$ | | $\tilde{\mathcal{D}}_T$ |
| $\cdots$ | | | | | |
| $(\mathbf{x}_N, y_N)$ | $\tilde{\mathcal{D}}_1$ | $\tilde{\mathcal{D}}_2$ | $\star$ | | $\star$ |

The handout's definition: a $\star$ in the $t$-th column means the example was not used for obtaining $g_t$, and such examples are called the out-of-bag (OOB) examples of $g_t$. Take column 1: training $g_1$ used example 1 and example $N$, and examples 2 and 3 are its OOB examples.

### Roughly how many OOB examples each tree has

Page 8 first states the question precisely: an example is OOB for $g_t$ exactly when it is not sampled after $N'$ drawings. The handout computes only the case $N' = N$, and the derivation has three steps.

**Step 1: the probability of being missed in a single draw.** Each bootstrap draw picks one of the $N$ examples uniformly, so the probability of drawing $(\mathbf{x}_n, y_n)$ is $\frac{1}{N}$ and the probability of missing it is $1 - \frac{1}{N}$.

**Step 2: missed in all $N$ draws.** Every draw is made with replacement, so the draws are independent and the probabilities simply multiply:

$$
P\big((\mathbf{x}_n, y_n) \text{ is OOB for } g_t\big) = \Big(1 - \frac{1}{N}\Big)^N
$$

**Step 3: the approximation for large $N$.** The handout rewrites it into a recognizable form:

$$
\Big(1 - \frac{1}{N}\Big)^N = \Big(\frac{N-1}{N}\Big)^N = \frac{1}{\big(\frac{N}{N-1}\big)^N} = \frac{1}{\big(1 + \frac{1}{N-1}\big)^N} \approx \frac{1}{e}
$$

The first equality puts everything over a common denominator, the second flips the fraction into the denominator, and the third is $\frac{N}{N-1} = \frac{(N-1)+1}{N-1} = 1 + \frac{1}{N-1}$. In the lecture, Lin says these first steps are only simple rearrangements meant to pull out a more familiar term; the final approximation uses the limit $\lim_{m\to\infty}(1 + \frac{1}{m})^m = e$ from calculus. This article fills in the last step: let $m = N - 1$, and the denominator is

$$
\Big(1 + \frac{1}{m}\Big)^{m+1} = \Big(1 + \frac{1}{m}\Big)^{m} \cdot \Big(1 + \frac{1}{m}\Big) \ \longrightarrow\ e \cdot 1 = e
$$

so the whole expression tends to $\frac{1}{e} \approx 0.3679$. The handout's conclusion is

$$
\text{OOB size per } g_t \approx \frac{1}{e} N
$$

This article computed the actual values for a few $N$ in Python to see how quickly the approximation becomes accurate:

| $N$ | $(1 - \frac{1}{N})^N$ | Average number of OOB examples per tree |
|---|---|---|
| 2 | 0.2500 | 0.50 |
| 5 | 0.3277 | 1.64 |
| 10 | 0.3487 | 3.49 |
| 100 | 0.3660 | 36.6 |
| 1126 | 0.3677 | 414.0 |
| $\infty$ | $1/e = 0.3679$ | $0.3679N$ |

At $N = 10$ the value is already near 0.35, and from $N = 100$ on it differs from $1/e$ only in the third decimal place. In the lecture, Lin roughly estimates the fraction aloud as about one third and says that out of 100 examples about 30 or so are OOB; by $1/e$ it is 36.8 examples, a little more than one third.

The handout treats only $N' = N$. The lecture mentions in passing that the result differs somewhat when the number of draws is not $N$. An addition in this article, the general case: replace the exponent in step 2 with $N'$,

$$
\Big(1 - \frac{1}{N}\Big)^{N'} = \bigg[\Big(1 - \frac{1}{N}\Big)^{N}\bigg]^{N'/N} \approx e^{-N'/N}
$$

The fewer the draws, the higher the OOB fraction. The demonstration figures on pages 17 to 19 of the handout use $N' = N/2$, and the fraction in that case is left to Self-check question 1.

### OOB examples are like validation data

Page 9 puts the OOB table next to the validation of [Foundations Lecture 15: Validation](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles-en). Validation splits the data into $\mathcal{D}_{\text{train}}$ and $\mathcal{D}_{\text{val}}$, trains $g_m^-$ with $\mathcal{D}_{\text{train}}$ only, and then measures it with $\mathcal{D}_{\text{val}}$. The lecture restates why this can be trusted: the validation data were not used to obtain $g_m^-$, and had they been used, they could no longer serve for validation.

The OOB table has the same structure. $g_t$ used only the examples marked $\tilde{\mathcal{D}}_t$ in the table and has never seen the starred ones. The handout puts it as $\star$ like $\mathcal{D}_{\text{val}}$: 'enough' random examples unused during training. The lecture fills in what "enough" means: ordinary validation might hold out only one fifth or one tenth of the data, while here each tree leaves about one third of the data unused.

The handout then asks two questions.

**Use $\star$ to validate $g_t$?** The handout answers: easy, but rarely needed. The procedure is direct: compute the error rate of $g_t$ on its OOB examples. The reason it is rarely needed is given in the lecture: bagging and RF are aggregation, and the goal is to obtain $G$, not to find out whether an individual $g_t$ is good.

**Use $\star$ to validate $G$?** No single example can be used to test $G$ directly, because some trees in $G$ have certainly seen it. In the lecture, Lin says the only point that matters here is keeping the starred data uncontaminated, and the way to do it is to look at one example at a time: for $(\mathbf{x}_n, y_n)$, which trees can it serve as validation data for? Exactly the $g_t$ with a star in its row. Put those trees together into a smaller forest, written $G_n^-$, and $(\mathbf{x}_n, y_n)$ is data that $G_n^-$ has never seen. The lecture explains the minus sign: this forest is a bit smaller than the full $G$. The $g_m^-$ in validation means the same thing, a hypothesis trained with less data.

The handout's example is the last row. The table on page 9 draws the row of $(\mathbf{x}_N, y_N)$ with only $g_1$ having used it (this differs from the table on page 7 in the $g_2$ cell) and stars everywhere else, so

$$
G_N^-(\mathbf{x}) = \text{average}(g_2, g_3, g_T)
$$

In the lecture, Lin stresses that $g_1$ cannot be included, because $(\mathbf{x}_N, y_N)$ was used to learn $g_1$. Do this for every example and average the errors, and the result is the OOB error:

$$
E_{\text{oob}}(G) = \frac{1}{N}\sum_{n=1}^{N} \text{err}\big(y_n,\ G_n^-(\mathbf{x}_n)\big)
$$

In the lecture, Lin says this is a little like the leave-one-out cross validation of Foundations Lecture 15: every example takes a turn as validation data, its performance is checked, and the average is taken at the end. The handout calls $E_{\text{oob}}$ the self-validation of bagging/RF. As Lin puts it in the lecture, the moment $G$ is finished, the bootstrap procedure has already told you roughly how well it performs, and no separate validation run is needed.

This article adds two details that come up in implementation. First, if an example is drawn by every tree, its $G_n^-$ is empty and cannot be evaluated. The probability that an example is drawn by a given tree is about $1 - \frac{1}{e} \approx 0.632$, and the probability that all $T$ trees draw it is about $0.632^T$: 0.101 for $T = 5$ and 0.0001 for $T = 20$, negligible once there are many trees. Second, each example's $G_n^-$ has only about $T/e$ trees, fewer than the full $G$, so $E_{\text{oob}}$ estimates the performance of a smaller forest.

### Numerical example: eight examples, five trees, the OOB error by hand

The following example is made up for this article and is not from the slides; every number was recomputed separately in plain Python. The setting reuses the credit card approval from Foundations: eight applicants, where $x_1$ is annual income (in units of 10,000 NTD), $x_2$ is the last digit of the application's serial number (unrelated to approval, included for the feature importance computed later), and $y = +1$ means the card is approved.

| $n$ | $x_1$ (annual income) | $x_2$ (last digit of serial number) | $y_n$ |
|---|---|---|---|
| 1 | 28 | 6 | $-1$ |
| 2 | 35 | 1 | $-1$ |
| 3 | 41 | 8 | $-1$ |
| 4 | 50 | 3 | $-1$ |
| 5 | 62 | 5 | $+1$ |
| 6 | 68 | 9 | $+1$ |
| 7 | 77 | 2 | $+1$ |
| 8 | 90 | 7 | $+1$ |

Use the basic RF: $T = 5$, $N' = N = 8$, and each tree is a fully-grown C&RT (Gini impurity, thresholds at the midpoint of two adjacent values). The five bootstrap data sets were drawn with random numbers and then fixed. To keep the example computable by hand, this article picked a sampling outcome in which every tree needs only one cut and every example has at least one tree that has not seen it.

**Step 1: sample, and find each tree's OOB examples.**

| $t$ | $\tilde{\mathcal{D}}_t$ (example numbers in the order drawn) | OOB examples of $g_t$ |
|---|---|---|
| 1 | 7, 3, 1, 5, 7, 5, 8, 8 | 2, 4, 6 |
| 2 | 5, 6, 2, 5, 3, 4, 5, 4 | 1, 7, 8 |
| 3 | 7, 8, 4, 3, 4, 3, 4, 4 | 1, 2, 5, 6 |
| 4 | 8, 8, 5, 1, 1, 2, 3, 4 | 6, 7 |
| 5 | 5, 8, 6, 7, 4, 5, 6, 4 | 1, 2, 3 |

The five trees have 3, 3, 4, 2, and 3 OOB examples, an average of 3.0. The formula gives an expected value of $8 \times (\frac{7}{8})^8 = 2.75$ examples, and the $N/e$ approximation gives 2.94.

**Step 2: run C&RT for each tree.** Take $g_1$. $\tilde{\mathcal{D}}_1$ contains examples 1 and 3 (once each, $y = -1$) and examples 5, 7, and 8 (twice each, $y = +1$). Among all combinations of feature and threshold, C&RT picks the one that minimizes $\sum_c \lvert\mathcal{D}_c\rvert \cdot \text{impurity}(\mathcal{D}_c)$. The candidate thresholds on $x_1$ and their results:

| Branch | Left (below the threshold) | Right | Weighted impurity |
|---|---|---|---|
| $x_1$ against 34.5 | 1 example, all $-1$ | 7 examples, 1 negative and 6 positive | $1 \times 0 + 7 \times \frac{12}{49} = \frac{12}{7}$ |
| $x_1$ against 51.5 | 2 examples, all $-1$ | 6 examples, all $+1$ | $0$ |
| $x_1$ against 69.5 | 4 examples, 2 negative and 2 positive | 4 examples, all $+1$ | $4 \times \frac{1}{2} + 0 = 2$ |
| $x_1$ against 83.5 | 6 examples, 2 negative and 4 positive | 2 examples, all $+1$ | $6 \times \frac{4}{9} + 0 = \frac{8}{3}$ |

Here Gini is computed as $1 - \sum_k (\frac{N_k}{N})^2$; for instance, 1 negative and 6 positive gives $1 - \frac{1}{49} - \frac{36}{49} = \frac{12}{49}$. The four candidate thresholds on $x_2$ (3.5, 5.5, 6.5, 7.5) come out as $\frac{8}{3}$, $2$, $\frac{44}{15}$, and $\frac{12}{7}$, none of them 0. So the first cut of $g_1$ is "$x_1$ against 51.5". After it both sides are already pure, the termination criteria are met, and this fully-grown tree has a single level:

$$
g_1(\mathbf{x}) = \text{sign}(x_1 - 51.5)
$$

51.5 is the midpoint between the largest negative example in $\tilde{\mathcal{D}}_1$ (example 3, 41) and the smallest positive example (example 5, 62). The other four trees likewise make just one cut, always on $x_1$ (in every tree, no candidate on $x_2$ gives pure sides):

| $t$ | Largest negative example in the bag | Smallest positive example in the bag | Threshold of $g_t$ |
|---|---|---|---|
| 1 | example 3, 41 | example 5, 62 | 51.5 |
| 2 | example 4, 50 | example 5, 62 | 56 |
| 3 | example 4, 50 | example 7, 77 | 63.5 |
| 4 | example 4, 50 | example 5, 62 | 56 |
| 5 | example 4, 50 | example 5, 62 | 56 |

From one original data set, the five trees end up with three different thresholds. $g_3$ did not draw examples 5 and 6, so the smallest positive example it sees is 77 and its threshold gets pushed to 63.5. This is the variance the handout talks about: change the data and the tree changes.

**Step 3: draw the OOB table and compute $G_n^-$ for each example.** "in" means the example is in $\tilde{\mathcal{D}}_t$ (in the bag), and $\star$ means OOB.

| $n$ | $x_1$ | $y_n$ | $g_1$ | $g_2$ | $g_3$ | $g_4$ | $g_5$ | Trees in $G_n^-$ and their predictions | $G_n^-(\mathbf{x}_n)$ | Wrong? |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 28 | $-1$ | in | $\star$ | $\star$ | in | $\star$ | $g_2, g_3, g_5$: $-,-,-$ | $-1$ | |
| 2 | 35 | $-1$ | $\star$ | in | $\star$ | in | $\star$ | $g_1, g_3, g_5$: $-,-,-$ | $-1$ | |
| 3 | 41 | $-1$ | in | in | in | in | $\star$ | $g_5$: $-$ | $-1$ | |
| 4 | 50 | $-1$ | $\star$ | in | in | in | in | $g_1$: $-$ | $-1$ | |
| 5 | 62 | $+1$ | in | in | $\star$ | in | in | $g_3$: $-$ | $-1$ | wrong |
| 6 | 68 | $+1$ | $\star$ | in | $\star$ | $\star$ | in | $g_1, g_3, g_4$: $+,+,+$ | $+1$ | |
| 7 | 77 | $+1$ | in | $\star$ | in | $\star$ | in | $g_2, g_4$: $+,+$ | $+1$ | |
| 8 | 90 | $+1$ | in | $\star$ | in | in | in | $g_2$: $+$ | $+1$ | |

Take example 5: only $g_3$ has not seen it, so $G_5^- = g_3$. The threshold of $g_3$ is 63.5 and $x_1 = 62 < 63.5$, so it predicts $-1$, which disagrees with $y_5 = +1$. One of the eight examples is wrong:

$$
E_{\text{oob}}(G) = \frac{1}{8} = 0.125
$$

**Step 4: compare with $E_{\text{in}}$.** Look at example 5 with $G$, the vote of all five trees: the thresholds of $g_1, g_2, g_4, g_5$ are all below 62 and they vote $+1$; only $g_3$ votes $-1$. Four to one, and $G$ gets it right. On the other seven examples the five trees agree, and they are all correct. So $E_{\text{in}}(G) = 0$.

**What this result means.** $E_{\text{in}} = 0$ because the four trees that saw example 5 will of course classify it correctly, and that number says nothing about what happens when new data arrive. $E_{\text{oob}}$ asks only the trees that have not seen the example, and it exposes something $E_{\text{in}}$ cannot show: for people whose annual income falls between 50 and 77, whether a tree drew the nearby examples affects its threshold, and the prediction can go wrong. A new applicant is exactly data that no tree has seen, and that is the situation $E_{\text{oob}}$ simulates. With only eight examples the estimate is of course crude (a single example is 0.125); the point is the procedure.

### Selecting a model with the OOB error

Page 10 puts the model selection procedure of Foundations Lecture 15 next to the RF version:

| | Previously: by best $E_{\text{val}}$ | RF: by best $E_{\text{oob}}$ |
|---|---|---|
| Score of each candidate | $E_m = E_{\text{val}}(\mathcal{A}_m(\mathcal{D}_{\text{train}}))$ | $E_m = E_{\text{oob}}(\text{RF}_m(\mathcal{D}))$ |
| Which one is chosen | $m^* = \text{argmin}_{1 \le m \le M} E_m$ | $m^* = \text{argmin}_{1 \le m \le M} E_m$ |
| What is finally delivered | $g_{m^*} = \mathcal{A}_{m^*}(\mathcal{D})$ | $G_{m^*} = \text{RF}_{m^*}(\mathcal{D})$ |

On the left every candidate is trained twice: first on $\mathcal{D}_{\text{train}}$ so that $E_{\text{val}}$ can be computed, and once $m^*$ is chosen, again on the full $\mathcal{D}$. On the right every candidate is trained directly on the full $\mathcal{D}$, $E_{\text{oob}}$ comes along for free, and the chosen $\text{RF}_{m^*}(\mathcal{D})$ is already the finished product. The handout writes this as two points: use $E_{\text{oob}}$ for self-validation of RF parameters such as $d''$, and no re-training needed. The lecture names a few more selectable parameters than the handout: $d''$, the number of dimensions used in a random projection, as well as other parameters or heuristics of the decision tree itself.

The last line of this page is $E_{\text{oob}}$ often accurate in practice. In the lecture, Lin says that in RF practice, measuring the performance of $G$ with the OOB error is usually quite accurate. This is an empirical statement, and the handout gives no theoretical guarantee.

### Fun Time: 1126 examples and the probability of not being sampled

**Question (page 11):** For a data set with $N = 1126$, what is the probability that $(\mathbf{x}_{1126}, y_{1126})$ is not sampled after bootstrapping $N' = N$ samples from the data set?

1. 0.113
2. 0.368
3. 0.632
4. 0.887

**Answer: 2.** The handout's solution: the value of $(1 - \frac{1}{N})^N$ with $N = 1126$ is about 0.367716, which is close to $\frac{1}{e} = 0.367879$. This article checked it in Python: $(\frac{1125}{1126})^{1126} = 0.367716$, and the two differ by 0.00016. In the lecture, Lin says that whether you estimate it or actually compute the probability, the answer is near 0.368.

The 0.632 of choice 3 is $1 - 0.368$, the probability that the example is drawn at least once; reading the event the question asks about backwards leads to it. Choices 1 and 4 also add up to 1, but neither 0.113 nor 0.887 matches a quantity in the derivation. The question asks about example 1126, and the answer is the same for every other example, because each one has an equal chance of being drawn.

## Which features matter: the permutation test plus OOB

```youtube
url: https://www.youtube.com/watch?v=ChqNC94JXtM
title: Random Forest :: Feature Selection @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–04:49 gives the motivation and the pros and cons of feature selection, 04:49–05:45 the selection built into decision trees, 05:45–09:07 ranking by importance and linear models, 09:07–13:23 the permutation test, 13:23–18:35 what the original RF does, and Fun Time follows.)

### What feature selection is trying to solve

Page 12 defines the problem: for the input $\mathbf{x} = (x_1, x_2, \dots, x_d)$, we want to remove two kinds of features.

- **redundant:** the handout's example is keeping one of "age" and "full birthday". The lecture uses a medical record: a form sometimes asks for your age and sometimes for your birthday, and filling in both duplicates information, since age can be computed from the birthday.
- **irrelevant:** the handout's example is insurance type for cancer prediction. In the lecture, Lin says whether a patient has cancer is a matter of the body's condition and should have nothing to do with which insurance the patient holds, yet the record form has that column all the same.

After removing them, we only learn a subset-transform $\boldsymbol{\Phi}(\mathbf{x}) = (x_{i_1}, x_{i_2}, \dots, x_{i_{d'}})$ with $d' < d$, and then predict with $g(\boldsymbol{\Phi}(\mathbf{x}))$. The numbers used in the lecture are selecting 300 dimensions out of 10,000, with a reminder that this goes in the opposite direction from earlier feature transforms: those went to higher dimensions, and this one goes lower.

The handout lists three advantages and three disadvantages, and the lecture points out that the two sides correspond one to one:

| Advantage | Corresponding disadvantage |
|---|---|
| **efficiency**: simpler hypothesis and shorter prediction time | **computation**: 'combinatorial' optimization in training |
| **generalization**: 'feature noise' removed | **overfit**: the 'combinatorial' selection may itself overfit |
| **interpretability**: the features that remain can be interpreted | **mis-interpretability**: the interpretation may be wrong |

The lecture first explains the left column with the 300-out-of-10,000 example: after selection, training and prediction both run on only 300 dimensions; if the selection is good, it amounts to excluding the noise in the other 9,700 dimensions, which makes overfitting less likely; and the 300 remaining dimensions can go on to further analysis, for example when a medical application wants to know which items relate to what is being predicted. It then goes through the right column item by item. Efficiency comes after the selection, but which 300 of the 10,000 to choose is a combinatorial problem, and the effort may all be spent in the selection stage. A correct selection excludes noise, but with that many combinations it is quite possible to pick a set of features that looks good and is in fact not that good. As for interpretation, if the selection process has already overfit, the interpretation is wrong; and even if it has not, the interpretation may show only correlation, not causation.

The last sentence on this page is decision tree: a rare model with built-in feature selection. The lecture's explanation: a decision tree has to pick a feature to cut on every time, and that picking is selection; an SVM, by contrast, puts all the features into the computation. AdaBoost with decision stumps has the same property, choosing one feature to cut on in every round.

### First trade the combinatorial problem for a ranking problem

The idea on page 13: if it is possible to calculate a score $\text{importance}(i)$ for each feature, $i = 1, 2, \dots, d$, then we can simply select the $d'$ features with the top importance. The lecture states outright what this approach gives up: it ignores interactions between features and looks only at the importance of each feature on its own. What it buys is not having to face the combinatorial explosion.

A linear model makes this easy. The score of a linear model is

$$
\text{score} = \mathbf{w}^\top\mathbf{x} = \sum_{i=1}^{d} w_i x_i
$$

The handout's intuitive estimate is $\text{importance}(i) = \lvert w_i \rvert$ with some 'good' $\mathbf{w}$, and a good $\mathbf{w}$ is one learned from data. The lecture's explanation: when $\lvert w_i \rvert$ is large, feature $i$ carries a lot of weight in the score; when $\lvert w_i \rvert$ is small, it hardly affects the score. The lecture also mentions that once the features are picked this way, the second stage can be followed by a linear or a non-linear model, because feature selection and the later learning are two separate steps. The lecture adds one more premise that the handout does not write down: the value ranges of the features $x_i$ must not differ too much, or the comparison means nothing. This article adds an example: change the same income feature from units of 10,000 NTD to units of 1 NTD, and $w_i$ shrinks by a factor of 10,000, but the importance of the feature has not changed.

The handout then writes: non-linear models? often much harder. The reason given in the lecture is that in a non-linear model the effects of the features are tangled together, and it is hard to isolate one number that measures the importance of a single feature. RF is a non-linear model, but its internal mechanism makes this relatively easy, and that is the content of the next two pages.

### The permutation test: shuffle one feature and see how far performance drops

The idea on page 14 is called a random test: if feature $i$ is needed, then replacing $x_{n,i}$ with random values degrades performance. As Lin puts it in the lecture, the feature matters a lot to you, you stuff some garbage into it, and of course performance gets worse; compare the performance before and after the stuffing, and the gap tells you how important the feature is.

Which random values should be stuffed in? The handout compares two kinds:

- **uniform, Gaussian, ...** The handout's note is $P(x_i)$ changed. The lecture explains: the original data may not be Gaussian in this feature at all, and if Gaussian random numbers are forced in, the measured performance gap mixes two causes, one being that the distribution was changed and the other being the effect of the noise that we actually want to measure.
- **bootstrap, permutation.** The handout's note is $P(x_i)$ approximately remained. Both take values only from the feature's existing values $\{x_{n,i}\}_{n=1}^{N}$.

Permutation means randomly rearranging these $N$ values. The lecture's analogy is shuffling cards: shuffle 52 cards and put them back into 52 positions, and they are still the same cards. Seen as a whole, the distribution of the feature has not changed; but for each example the value is now scrambled, and the lecture's example is patient A's value going to patient B and patient B's going to patient C. The gap measured this way reflects just one thing: the correspondence between this feature and the other features, and between this feature and $y$, has been broken.

The permutation test is therefore defined as

$$
\text{importance}(i) = \text{performance}(\mathcal{D}) - \text{performance}(\mathcal{D}^{(p)})
$$

where $\mathcal{D}^{(p)}$ is $\mathcal{D}$ with the $i$-th feature $\{x_{n,i}\}$ replaced by the permuted $\{x_{n,i}\}_{n=1}^{N}$. The handout stresses that this is a general statistical tool for arbitrary non-linear models like RF, not something exclusive to RF.

### What the original RF does: no re-training, only a trick at validation time

Page 15 deals with the remaining question: how the two performance terms are measured.

By definition, $\text{performance}(\mathcal{D}^{(p)})$ means re-training a model on the permuted data and then validating it. The handout says this needs re-training and validation in general. With $d$ features, that is $d$ rounds of re-training.

Validation first. The handout asks: 'escaping' validation? The answer is the OOB just learned: RF needs no separate validation data, and performance can use $E_{\text{oob}}$ directly. The term for the original data is then $E_{\text{oob}}(G)$.

Then re-training. By the logic so far, the other term should be $E_{\text{oob}}(G^{(p)})$, with $G^{(p)}$ a forest re-trained on $\mathcal{D}^{(p)}$. As Lin puts it in the lecture: I am lazy and do not want to re-train, so let us take a shortcut and replace $E_{\text{oob}}(G^{(p)})$ with $E_{\text{oob}}^{(p)}(G)$. The two differ in where the $(p)$ sits:

- $E_{\text{oob}}(G^{(p)})$: the permuted data are used in training, which yields a different forest.
- $E_{\text{oob}}^{(p)}(G)$: the forest $G$ stays as it is, and the permutation happens only when the OOB error is computed.

The handout writes this as

$$
\text{importance}(i) = E_{\text{oob}}(G) - E_{\text{oob}}^{(p)}(G)
$$

and explains that $E_{\text{oob}}^{(p)}$ comes from replacing each request of $x_{n,i}$ by a permuted OOB value. The lecture unpacks that sentence: computing the OOB error requires $g_t(\mathbf{x}_n)$, $g_t$ is a decision tree, and on reaching some node it may need the value of $x_{n,i}$, which is replaced at that moment. Replaced with whose value? The original author's suggestion is not to take it from all the data, but only from the examples that are OOB for $g_t$. The reason given in the lecture is that the swapped-in value is then still something $g_t$ has not seen, the training process is not touched at all, and the measurement is more accurate.

The conclusion of this page is RF feature selection via permutation + OOB: often efficient and promising in practice. The lecture is more specific: RF feature selection works well in practice, and many people facing a non-linear problem first use RF for a preliminary feature selection.

This article adds a caution for reading the formula. Page 14 of the handout writes performance, where larger is better, and an important feature makes $\text{performance}(\mathcal{D}) - \text{performance}(\mathcal{D}^{(p)})$ positive. Page 15 substitutes $E_{\text{oob}}$ for performance directly, but $E_{\text{oob}}$ is an error, where smaller is better; when an important feature is permuted the error rises, and $E_{\text{oob}}(G) - E_{\text{oob}}^{(p)}(G)$ computed literally from the formula is negative. Both the handout and the lecture substitute $E_{\text{oob}}$ for performance as is; what is being compared is how far apart the two quantities are before and after the permutation, and the sign is not adjusted separately. When reading, look at the size of the gap: how much the error rose, that is, $E_{\text{oob}}^{(p)}(G) - E_{\text{oob}}(G)$, and the more it rose, the more important the feature.

### Numerical example (continued): the importance of the two features

Now continue with the example of eight examples and five trees, still made up for this article. The baseline is $E_{\text{oob}}(G) = \frac{1}{8}$.

**First $x_2$ (the last digit of the serial number).** All five trees cut only on $x_1$, and no node ever uses the value of $x_2$. Whatever $x_2$ is replaced with, every $g_t(\mathbf{x}_n)$ stays the same, so

$$
E_{\text{oob}}^{(p)}(G) = \frac{1}{8}, \qquad \text{importance}(2) = \frac{1}{8} - \frac{1}{8} = 0
$$

**Then $x_1$ (annual income).** The permutation should be random. To keep it computable by hand, one fixed arrangement is used here: the OOB examples of each tree are arranged in a circle by number, and each example takes the $x_1$ of the next one.

| $t$ | Threshold | OOB examples | The $x_1$ swapped in |
|---|---|---|---|
| 1 | 51.5 | 2, 4, 6 | example 2 gets 50, example 4 gets 68, example 6 gets 35 |
| 2 | 56 | 1, 7, 8 | example 1 gets 77, example 7 gets 90, example 8 gets 28 |
| 3 | 63.5 | 1, 2, 5, 6 | example 1 gets 35, example 2 gets 62, example 5 gets 68, example 6 gets 28 |
| 4 | 56 | 6, 7 | example 6 gets 77, example 7 gets 68 |
| 5 | 56 | 1, 2, 3 | example 1 gets 35, example 2 gets 41, example 3 gets 28 |

The same example gets different values in different trees, because each tree permutes within its own OOB examples. Recompute $G_n^-$ for each example:

| $n$ | $y_n$ | The $x_1$ each OOB tree sees, and its prediction | Vote | Wrong? |
|---|---|---|---|---|
| 1 | $-1$ | $g_2$: 77, $+$; $g_3$: 35, $-$; $g_5$: 35, $-$ | $-1$ | |
| 2 | $-1$ | $g_1$: 50, $-$; $g_3$: 62, $-$; $g_5$: 41, $-$ | $-1$ | |
| 3 | $-1$ | $g_5$: 28, $-$ | $-1$ | |
| 4 | $-1$ | $g_1$: 68, $+$ | $+1$ | wrong |
| 5 | $+1$ | $g_3$: 68, $+$ | $+1$ | |
| 6 | $+1$ | $g_1$: 35, $-$; $g_3$: 28, $-$; $g_4$: 77, $+$ | $-1$ | wrong |
| 7 | $+1$ | $g_2$: 90, $+$; $g_4$: 68, $+$ | $+1$ | |
| 8 | $+1$ | $g_2$: 28, $-$ | $-1$ | wrong |

Three are wrong, so $E_{\text{oob}}^{(p)}(G) = \frac{3}{8}$. By the handout's formula,

$$
\text{importance}(1) = \frac{1}{8} - \frac{3}{8} = -\frac{1}{4}
$$

which is to say the error rose by 0.25. Example 5 was wrong before and is right this time, because it happened to get 68, a value that also belongs to a positive example; not every example gets worse after a permutation.

**What this result means.** Permuting $x_1$ raises the OOB error from 0.125 to 0.375, while permuting $x_2$ has no effect at all, so the ranking is $x_1$ above $x_2$, which matches how the data were designed. No tree was re-trained anywhere in the process; only the predictions were rerun.

The result of one single permutation carries an element of luck. This article used a program to enumerate every possible arrangement in this example (each of the five trees permutes its own OOB examples, $3! \times 3! \times 4! \times 2! \times 3! = 10{,}368$ combinations in total, with a tied vote counted as half an error): $E_{\text{oob}}^{(p)}$ is 0 at its lowest and $\frac{5}{8}$ at its highest, and averages $\frac{7}{24} \approx 0.292$. On average the error still rises (0.125 to 0.292), but 2.8% of the arrangements happen to bring the error down to 0. With only eight examples, the number from one permutation should not be taken too seriously; the fluctuation becomes small only with a lot of data and a lot of trees.

### Fun Time: the importance of a constant feature

**Question (page 16):** For RF, if the 1126-th feature within the data set is a constant 5566, what would $\text{importance}(i)$ be?

1. 0
2. 1
3. 1126
4. 5566

**Answer: 1.** The handout's solution: when a feature is a constant, permutation does not change its value; then $E_{\text{oob}}(G)$ and $E_{\text{oob}}^{(p)}(G)$ are the same, and thus $\text{importance}(i) = 0$. In the lecture, Lin says that however you randomly rearrange, that feature always comes out as 5566, the same as before, so the OOB performance is exactly the same too.

Choices 2, 3, and 4 are numbers that appear in the question or are put together from it; importance is the difference of two errors and will not equal the index of a feature or its value. An addition in this article: the 0 in this question has a second source. A constant feature cannot split the data into two sides at whatever threshold, so C&RT never branches on it and no tree ever uses its value; this is the same reason the importance of $x_2$ is 0 in the example above. The thing to watch out for in the other direction is that an importance of 0 means only that this forest did not rely on the feature, and does not guarantee that the feature is entirely unrelated to $y$.

## What it looks like in practice, and how many trees

```youtube
url: https://www.youtube.com/watch?v=Ipfpf7AW_yM
title: Random Forest :: Random Forest in Action @ Machine Learning Techniques (機器學習技法)
```

(Video 00:01–05:28 is the simple data set, 05:28–06:26 the complicated data set, 06:26–07:44 the data set with added noise, 07:44–11:10 discusses how many trees, 11:10–11:37 is Fun Time, and the summary follows.)

The slides in this section are almost all figures. All three data sets are binary classification in the two-dimensional plane, with circles as one class and crosses as the other, a blue and red background showing which class the model predicts, and a black line for the boundary. The figures on all three pages are labeled $g_t\ (N' = N/2)$: the bootstrap for each tree draws only half the data size. Page 17 additionally states that the trees are C&RT with random combination; pages 18 and 19 do not repeat the label, and the boundaries of the single trees in those figures are slanted lines as well.

### The simple data set: more trees, smoother boundary

Page 17 has three panels, and the slides step $t$ from 1 up to 1000 one frame at a time.

| Panel | What it draws | What you see |
|---|---|---|
| Left (fixed) | No bagging: one random-combination C&RT trained on all the data | The boundary is pieced together from several slanted segments and cuts the plane into irregular polygons |
| Middle | The $t$-th tree $g_t$. Large circles and crosses are examples drawn by bootstrap; small dots are the ones not drawn | Every tree has a different boundary, often just one or two slanted lines, and some of the undrawn points are misclassified |
| Right | $G$ voted by the first $t$ trees | Changes with $t$, see below |

How the right panel changes, as described in the lecture:

- $t = 1$: there is only one tree, the boundary of $G$ is identical to that of the tree in the middle, and some points are misclassified.
- $t = 100$: the boundary twists and turns. In the lecture, Lin says it looks a bit like an amoeba; you can tell it is the result of many different trees voting, and it is already far more complex than each single tree alone.
- From $t = 200$ on: the boundary keeps getting smoother, though it is still not very regular.
- $t = 1000$: the slide's remark is 'smooth' and large-margin-like boundary with many trees.

The lecture compares the right panel at $t = 1000$ with the single tree on the left and points out two things. First, the forest's boundary runs roughly through the middle between the circles and the crosses, whereas the single tree's boundary has a stretch pressed right up against one of the crosses. A boundary far from the points on both sides is the large margin of [Techniques Lecture 1: Linear SVM](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm-en). Second, the forest's boundary is much smoother. Lin's comment in the lecture is that it is interesting for a bunch of messy trees to have such a property when combined, much as the opinions of a crowd of internet forum users can add up to something quite good. The handout's wording is large-margin-like: it has that look, but nothing says RF is optimizing the margin.

### The complicated data set and the data set with added noise

Page 18 switches to a data set with many points whose true boundary is a curve, keeps only the middle and right panels, and steps $t$ through 1, 6, 11, 16, 21. A single tree's boundary is crooked and has sharp corners; with 21 trees combined, the right panel already shows a relatively smooth non-linear boundary that hugs the border between the two classes. The slide's remark is 'easy yet robust' nonlinear model. In the lecture, Lin says this non-linear boundary was obtained in a very simple way, with only twenty or so decision trees, and that it is far more stable than the single trees on the left.

Page 19 uses the same data set, which the lecture explains has 10% noise added, and $t$ again goes from 1 to 21. This time the single trees are affected heavily: a fully-grown tree must cut until every example is classified correctly, so it fences off small patches of red inside the blue region for a few mislabeled crosses, and vice versa. In the lecture, Lin says these parts look like overfitting the noise. With 21 trees combined, the main boundary still comes out, and most of those small patches are gone, with only a few left. The slide's remark is noise corrected by voting.

This article adds why voting removes these patches. For a mislabeled example, only the trees that drew it fence off a patch for it; with $N' = N/2$, each tree has about a 60% chance of not drawing it (Self-check question 1), and those trees predict at that location according to the surrounding majority. In the vote, the trees that fence off a patch for the noise are the minority.

### How many trees are enough

The first line of page 20 is almost every theory: the more, the 'better', under the premise assuming good $\bar{g} = \lim_{T\to\infty} G$. The lecture explains that the theory of RF is not covered in detail in this lecture, but most of that theory assumes that infinitely many trees give a relatively stable and relatively good result, and that finitely many trees only approximate it. So the practical question is how many trees count as a close enough approximation.

The handout then gives an experience from NTU itself, under the heading Our NTU Experience:

- **The competition:** KDD Cup 2013 Track 1, predicting author-paper relation (in the lecture, Lin describes it as predicting whether a given author wrote a given paper). The slide adds a note next to it: yes, NTU is world champion again! :-).
- **The observation:** $E_{\text{val}}$ of thousands of trees fell in $[0.015, 0.019]$ depending on seed; $E_{\text{out}}$ of the top 20 teams in the same competition fell in $[0.014, 0.019]$.
- **The decision:** take 12000 trees with seed 1.

The lecture adds three things the slide does not say. First, that year, for certain reasons, the OOB error was not used and the validation error was computed directly, which is why the slide writes $E_{\text{val}}$. Second, what the two intervals mean when set side by side: with a well-chosen random seed the score is close to the top three, and with a poorly chosen one it drops to around 20th place. Same method, same data, and the only difference is the random numbers. Third, the final approach was to add as many trees as could be computed, with seed 1; in the lecture, Lin says not to ask why 1, it just seemed a relatively stable choice at the time.

From this the handout writes down the cons of RF: may need lots of trees if the whole random process too unstable, and it recommends: should double-check stability of $G$ to ensure enough trees. As Lin puts it in the lecture, RF is a randomized algorithm, and if the random process has not yet reached a stable state, or your problem is sensitive to tiny changes (the gaps between ranks in that competition were very small), the result goes up and down with the random numbers. In practice you check whether $G$ is stable: if performance still changes with one tree more or one tree fewer, there are not enough trees, so add more.

### An addition in this article: why adding trees makes the result settle down

The reasoning in this part is not in the handout. It is here to explain why the result changes with the seed when there are not enough trees.

Once the data $\mathcal{D}$ are fixed, every tree uses its own independent random numbers (its own bootstrap, its own random projections). So at each point $\mathbf{x}$, the predictions of $T$ trees are $T$ independent draws. Suppose one tree predicts circle at this point with probability $p$. When $p > 0.5$, the $\bar{g}$ of infinitely many trees answers circle at this point. The probability that the vote of $T$ trees differs from $\bar{g}$ is the binomial probability that circle does not get a majority in $T$ draws (the table takes $T$ odd to avoid ties):

| $p$ | $T = 1$ | $T = 5$ | $T = 25$ | $T = 101$ | $T = 1001$ |
|---|---|---|---|---|---|
| 0.60 | 0.400 | 0.317 | 0.154 | 0.021 | below 0.0001 |
| 0.55 | 0.450 | 0.407 | 0.306 | 0.156 | 0.001 |
| 0.51 | 0.490 | 0.481 | 0.460 | 0.420 | 0.263 |

For example, with $p = 0.6$ and $T = 5$: the probability that circle gets 0, 1, or 2 votes is $0.4^5 + 5(0.6)(0.4)^4 + 10(0.6)^2(0.4)^3 = 0.01024 + 0.0768 + 0.2304 = 0.317$.

The table shows two things. For points far from the boundary ($p$ far from 0.5), a few dozen trees are stable enough. For points near the boundary ($p$ close to 0.5), even a thousand trees still have a one-in-four chance of differing from $\bar{g}$, and a different seed may flip the answer. In the figures for the simple data set, the boundary twisting at $t = 100$ and becoming smooth only by $t = 1000$, and the KDD Cup score still moving with the seed at thousands of trees, can both be understood from this angle: what wobbles is the points near the boundary. This is also why no single $T$ is right for every problem.

### Fun Time: which one is not the best use of RF

**Question (page 21):** Which of the following is not the best use of Random Forest?

1. train each tree with bootstrapped data
2. use $E_{\text{oob}}$ to validate the performance
3. conduct feature selection with permutation test
4. fix the number of trees, $T$, to the lucky number 1126

**Answer: 4.** The handout's solution: a good value of $T$ can depend on the nature of the data and the stability of the whole random process. In the lecture, Lin says the number of trees needed differs as the data differ and as the stability of the process differs.

Choices 1, 2, and 3 are each the centerpiece of one of the lecture's first three topics: bootstrap is part of the definition of RF, $E_{\text{oob}}$ is the self-validation that comes with it, and the permutation test is the feature-importance computation the handout introduces. The problem with choice 4 is not that 1126 is too large or too small, but that it is fixed without checking; by the handout's advice, you should see whether $G$ has become stable.

The summary on page 22 reduces each of the four sections to one line: bag of trees on randomly projected subspaces; self-validation with OOB examples; permutation test for feature importance; 'smooth' boundary with many trees. The preview of the next lecture is boosted decision trees beyond classification: combining decision trees with boosting of the AdaBoost kind, and extending to problems other than classification.

## Self-check

**1. In the demonstration figures, the bootstrap for each tree draws only $N' = N/2$ examples. When $N$ is large, roughly what is the probability that an example is OOB for a given tree? Is it higher or lower than with $N' = N$?**

Answer: $(1 - \frac{1}{N})^{N/2} = \big[(1 - \frac{1}{N})^N\big]^{1/2} \approx e^{-1/2} \approx 0.607$. It is higher than the 0.368 of $N' = N$, because with fewer draws there is a better chance of escaping. Computed directly with $N = 1000$, $(0.999)^{500} = 0.606$.

**2. $N = 3$, $N' = 3$. What is the probability that example 1 is OOB for a given tree? How many OOB examples does a tree have on average? How far is that from $N/e$?**

Answer: $(\frac{2}{3})^3 = \frac{8}{27} \approx 0.296$. The average number of OOB examples is $3 \times \frac{8}{27} = \frac{8}{9} \approx 0.89$. $N/e = 1.10$ overestimates by about 20 percent; $1/e$ is the approximation for large $N$, and $N = 3$ is not large enough.

**3. Four examples, three trees. The table lists each tree's prediction on each example, and parentheses mean the example is in that tree's bootstrap data (not OOB). Compute $E_{\text{oob}}(G)$ and $E_{\text{in}}(G)$.**

| $n$ | $y_n$ | $g_1$ | $g_2$ | $g_3$ |
|---|---|---|---|---|
| 1 | $+1$ | $(+1)$ | $-1$ | $(+1)$ |
| 2 | $+1$ | $+1$ | $(+1)$ | $+1$ |
| 3 | $-1$ | $(-1)$ | $(-1)$ | $+1$ |
| 4 | $-1$ | $-1$ | $-1$ | $(-1)$ |

Answer: $G_1^- = g_2$ predicts $-1$, wrong. $G_2^-$ consists of $g_1, g_3$, both predicting $+1$, right. $G_3^- = g_3$ predicts $+1$, wrong. $G_4^-$ consists of $g_1, g_2$, both predicting $-1$, right. $E_{\text{oob}}(G) = \frac{2}{4} = 0.5$. $E_{\text{in}}$ uses the vote of all three trees: the tallies for the four examples are two positive and one negative, three positive, two negative and one positive, and three negative, all correct, so $E_{\text{in}}(G) = 0$. The predictions in parentheses are all correct (the tree has seen that example), and those are the votes $E_{\text{in}}$ relies on.

**4. In a permutation test, why not simply replace feature $i$ with Gaussian random numbers? And when the original RF computes $E_{\text{oob}}^{(p)}$, why are the swapped-in values taken only from that tree's OOB examples?**

Criteria: for the first part, say that Gaussian random numbers change the distribution $P(x_i)$ of the feature, so the measured performance gap mixes in the effect of the changed distribution, whereas permutation only rearranges the existing values and leaves the distribution roughly unchanged. For the second part, say that with OOB values the swapped-in data are still something $g_t$ did not see in training, so the validation is not contaminated by data used in training.

**5. At some branch the sampled projection vector is $\mathbf{p} = (0, 0, 1, 0)$ and the threshold is 2.5. Which kind of hypothesis is this branch? Which of the handout's three RF versions does it fall under? What if $\mathbf{p} = (1, 0, -2, 0)$?**

Answer: $\mathbf{p}^\top\mathbf{x} = x_3$, so the branch is $\text{sign}(x_3 - 2.5)$, a decision stump on the original feature $x_3$, which is the random-subspace special case with $d'' = 1$ and $\mathbf{p}$ in the natural basis. With $\mathbf{p} = (1, 0, -2, 0)$ the branch is $\text{sign}(x_1 - 2x_3 - 2.5)$, which uses two features ($d'' = 2$), is a slanted line in the $x_1$–$x_3$ plane, and is equivalent to a perceptron with $\mathbf{w} = (-2.5, 1, 0, -2, 0)$.

## Exercises and corresponding reading

**The corresponding week in two semesters.** The [Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) puts decision trees, random forests, and gradient boosted decision trees in the same week (W12, 11/18), taught together with AdaBoost, and the slides for this lecture are [210u](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/210u_handout.pdf). The [Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) also puts them in W12 (11/25); that week's slides could not yet be opened as of 2026-09-30, so this article uses only the MOOC handout.

**Textbook and further reading.** The course pages do not map this lecture to a chapter of [Learning from Data](http://amlbook.com). Among the further reading listed on the course page, the one directly related to this lecture is [Breiman, Random Forests (Machine Learning, 2001)](https://doi.org/10.1023/A:1010933404324), the original random forest paper; the "original RF" that keeps appearing in the handout and the "original author" mentioned in the lecture refer to it.

**Homework.** [Fall 2024 HW7](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf) (released 2024-12-02, due 12-16, no official solutions) has no problem specifically on random forests and no related programming problem. The closest is Q1: bootstrapping with $N = 1126$, it asks how many draws it takes for the probability of at least one repeated example to exceed 70%. It is the same kind of computation as this lecture's OOB derivation: both write "each draw is independent" as a product. The guide to the whole assignment is in [Techniques Homework and Final Project](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project-en).

**Hands-on.** To verify for yourself the statement that $E_{\text{oob}}$ is usually accurate, run scikit-learn's `RandomForestClassifier` with `oob_score=True` on the madelon data used in the HW7 programming problems, and compare `oob_score_` with the result on the test set. Three things to know when matching it up: `oob_score_` reports accuracy, so subtract it from 1 to get this lecture's $E_{\text{oob}}$; `max_features` controls how many features each branch considers, which corresponds to the handout's random subspace ($d'$), and scikit-learn does not do random combination; `feature_importances_` is computed from the decrease in impurity, not this lecture's permutation test, and the permutation version is `sklearn.inspection.permutation_importance`, which permutes on the data you give it, not on OOB. Then try several values of `random_state` and several of `n_estimators`, and watch how the seed-to-seed wobble of the OOB result shrinks as the number of trees grows; that is the double-check of stability the handout asks for.

**How another course on this site treats the same topic.** [Harvard CS181 HW4: Decision Trees, Random Forests, and Mixture of Experts](/posts/tech/2026-09-29-harvard-cs181-hw4-trees-forests-moe-en).

**Next lecture.** [Techniques Lecture 11: Gradient Boosted Decision Trees](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-11-gradient-boosted-decision-tree-en) replaces this lecture's bagging with boosting: the trees no longer grow independently, and each one tries to fix the mistakes the earlier trees left behind.

## Course video sources

Original videos: [Random Forest Algorithm](https://www.youtube.com/watch?v=ATM3sH0D45s), [Out-Of-Bag Estimate](https://www.youtube.com/watch?v=7oz5aO-FkR0), [Feature Selection](https://www.youtube.com/watch?v=ChqNC94JXtM), [Random Forest in Action](https://www.youtube.com/watch?v=Ipfpf7AW_yM)

- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

Checked: 2026-10-13. The video IDs, titles, and lengths were taken from the official playlist on that day; the videos have no caption track on YouTube, and what this article reports from the lecture comes from transcripts made for it.

## Update Log

- 2026-10-13: The series now has one article per lecture; this lecture is a newly split-out article, written from the handout and the video transcripts.

## References

- [Techniques Lecture 10 handout, 210_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/210_handout.pdf): the main source for this article. The definitions and derivations in the four sections, the four Fun Time questions, the demonstration figures on pages 17 to 19, and the KDD Cup experience on page 20 all come from this handout.
- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2): the IDs and titles of the four videos; what the text reports as said "in the lecture" is paraphrased from machine transcripts of these four videos.
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/): the official entry for handouts and recordings.
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/): the corresponding week, the 210u slides, and the further reading list.
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/): the corresponding week.
- [Fall 2024 Homework 7 (hw7.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf): the content of Q1, and the basis for saying this assignment has no problem specific to random forests.
- [Breiman, Random Forests](https://doi.org/10.1023/A:1010933404324): further reading listed on the course page, and the source of what the handout calls original RF.
- [Learning from Data textbook website](http://amlbook.com): the course's assigned textbook; this lecture has no corresponding chapter.
- [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques: Course Overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en): where this lecture sits in the whole course and the reading routes.
