---
title: "Gradient Boosted Decision Trees: AdaBoost as Gradient Descent on an Error Function | NTU Hsuan-Tien Lin Machine Learning Techniques Lecture 11"
date: 2026-10-13
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, ensemble, decision-trees, gradient-descent]
lang: en
math: true
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 28
tldr: "The sum of AdaBoost's weights in each round is exactly the sum of the exponential error exp(−ys). From that, this lecture derives that the gₜ found by the base algorithm is an approximate functional gradient direction, and the vote αₜ is the best step size along that direction. Swap the exponential error for squared error and the same derivation becomes 'in each round, run regression on the residuals yₙ − sₙ, then set the step size with one-variable linear regression'; with a weakened C&RT as the base model, that is GBDT."
description: "A guide to Lecture 11 of NTU Hsuan-Tien Lin's Machine Learning Techniques, Gradient Boosted Decision Tree: sampling and pruning in AdaBoost-DTree, AdaBoost's exponential error and the steepest descent derivation, residual fitting in gradient boosting under squared error, the GBDT algorithm, and a summary of aggregation models, with two examples worked by hand."
draft: false
glossary:
  - term: "exponential error"
    aliases: ["exponential error measure", "err_ADA"]
    definition: "exp(−ys), where s is the voting score and y is the ±1 label. It is never below the 0/1 error anywhere, and it is convex."
    context: "Techniques Lecture 11 points out that AdaBoost's sum of weights is the sum of the exponential error over all the data, and that AdaBoost decreases it in every round."
  - term: "gradient boosting"
    aliases: ["GradientBoost", "GBDT"]
    definition: "Viewing boosting as steepest descent in function space: each round finds a gₜ that approximates the negative gradient direction, then decides the step size αₜ with a one-dimensional search. Under squared error this equals regression on the residuals yₙ − sₙ."
    context: "Techniques Lecture 11 generalizes from AdaBoost's exponential error to arbitrary error functions; with a weakened decision tree as the base model it is GBDT."
  - term: "residual"
    aliases: ["remainder"]
    definition: "yₙ − sₙ, the target value minus the score accumulated so far, which is the part not yet achieved."
    context: "In each round of GBDT the base algorithm receives the residuals, not the original yₙ. In the lecture, Lin calls it the remainder."
  - term: "steepest descent"
    definition: "Once the direction is decided, do not take a fixed small step; solve directly for the step size that brings the error to its lowest point along that direction."
    context: "Techniques Lecture 11 uses it to explain both AdaBoost's αₜ and GBDT's αₜ."
---

> 🌏 [中文版](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-11-gradient-boosted-decision-tree)

**Video status: Videos included.** This article is written from the official MOOC handout [211_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/211_handout.pdf) and transcripts of this lecture's four official videos, with formulas following the handout. The transcripts are machine transcripts made for this article (Whisper), not official captions, and no human has proofread them. The videos are taught in Mandarin; the slides are in English. Each section opens with its official video and the approximate time ranges. Page numbers refer to the number at the lower right of each slide (0/25 to 25/25), and wherever the text says "in the lecture" it is paraphrasing what is said in the video.

This is Techniques Lecture 11 in [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en). The Roadmap on page 1 of the handout divides Techniques into three ways of handling features, and this is the last lecture of the second, Combining Predictive Features: Aggregation Models. The previous lecture, [Techniques Lecture 10: Random Forests](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-10-random-forest-en), takes up a single line on that page: bagging of randomized C&RT trees with automatic validation and feature selection. This lecture swaps the outer bagging for boosting, then goes back to a question that [Techniques Lecture 8: AdaBoost](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-08-adaptive-boosting-en) left unanswered: what is AdaBoost's vote formula, which seemed to come out of nowhere, actually optimizing?

There are five prerequisites:

- [Techniques Lecture 8: AdaBoost](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-08-adaptive-boosting-en): the update rule for the weights $u_n^{(t)}$, the weighted error rate $\epsilon_t$, the scaling factor $\blacklozenge_t$, and the vote $\alpha_t$.
- C&RT from [Techniques Lecture 9: Decision Trees](/posts/ai/2026-09-30-ntu-htlin-ml-decision-tree-random-forest-gbdt-en): branching with decision stumps and putting constants at the leaves.
- Gradient descent from [Foundations Lecture 10: Logistic Regression](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-10-logistic-regression-en): finding a descent direction with a first-order Taylor expansion.
- The closed-form solution from [Foundations Lecture 9: Linear Regression](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression-en).
- The move in [Foundations Lecture 14: Regularization](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-14-regularization-en) that turns a constraint into a penalty term; a rough memory of it is enough.

After reading, you should be able to start from AdaBoost's weight update and derive on your own that $g_t$ is a functional gradient direction and $\alpha_t$ is the best step size, then carry the same derivation over to squared error, write down the three steps of GBDT, and run a few rounds by hand on a small data set.

The order of the derivation across the lecture:

1. **AdaBoost with decision trees**: express the weights through sampling, and weaken the tree.
2. **The sum of weights equals the sum of the exponential error**: AdaBoost decreases it in every round.
3. **Fix the step size, find the direction**: after a Taylor expansion, the best direction is the $h$ with the lowest weighted error rate.
4. **Fix the direction, find the step size**: set the derivative to 0, and the solution is exactly $\alpha_t$.
5. **Switch to an arbitrary error function**: this gives GradientBoost; under squared error the direction is a regression on the residuals, and the step size is a one-variable linear regression.
6. **Use trees as the base model**: GBDT.

## How a tree works with AdaBoost: pass the weights through sampling, then weaken the tree

```youtube
url: https://www.youtube.com/watch?v=aX6ZiIWLjdk
title: Gradient Boosted Decision Tree :: AdaBoost Decision Tree @ Machine Learning Techniques (機器學習技法)
```

(Video 00:18–01:23 reviews random forest, 01:23–07:16 covers how to make a decision tree take weights, 07:23–11:55 covers why the tree has to be weak, 11:55–14:11 is the extreme case of height 1, and Fun Time follows.)

### From Random Forest to AdaBoost-DTree

Page 2 of the handout puts two algorithms side by side. On the left is the random forest from the previous lecture; on the right the outer layer is swapped for AdaBoost:

| | RandomForest(D) | AdaBoost-DTree(D) |
|---|---|---|
| Step 1 of each round | request size-$N'$ data $\tilde{\mathcal{D}}_t$ by bootstrapping with $\mathcal{D}$ | reweight data by $\mathbf{u}^{(t)}$ |
| Step 2 of each round | $g_t$ = Randomized-DTree($\tilde{\mathcal{D}}_t$) | $g_t$ = DTree($\mathcal{D}, \mathbf{u}^{(t)}$) |
| Step 3 of each round | (none) | calculate the vote $\alpha_t$ of $g_t$ |
| Return | $G$ = Uniform($\{g_t\}$), one vote per tree | $G$ = LinearHypo($\{(g_t, \alpha_t)\}$), a linear combination by votes |

Step 2 on the right needs a tree that can take weights, and the handout writes at the bottom of the page need: weighted DTree($\mathcal{D}, \mathbf{u}^{(t)}$). The C&RT of Techniques Lecture 9 does not consider a weight on each example, neither when it chooses a branch nor when it decides the constant at a leaf.

### Change the data fed in, not the algorithm

Page 3 first states what we expect of a weighted algorithm: it should minimize the weighted $E_{\text{in}}$ (possibly with regularization),

$$
E_{\text{in}}^{\mathbf{u}}(h) = \frac{1}{N}\sum_{n=1}^{N} u_n \cdot \text{err}(y_n, h(\mathbf{x}_n))
$$

In the lecture, Lin says there are two routes. The first is to open the algorithm up, find every place where it handles $E_{\text{in}}$, and multiply the weights in. For SVM, for example, the part related to $E_{\text{in}}$ is the hinge term, so you multiply each example's term by its weight. This route is a lot of trouble for decision trees: besides the basic steps, a tree has many tricks that different authors added, and you would have to check one by one which of them are related to $E_{\text{in}}$.

The second route is to treat the original algorithm as a black box, leave it completely alone, and work only on the data fed into it. Lin looks back at where the weights came from to explain why this is possible. Techniques Lecture 8 introduced weights starting from bagging, where a weight records how many copies of an example the bootstrap drew; weight 3 means there are 3 copies in the data. In the other direction, when you hold a set of weights $\mathbf{u}$, you can sample in proportion to $u_n$, and the proportion of each example in the sampled data is then roughly its share of the weights. The handout puts the two side by side:

| | How the weights are expressed | How to get $\tilde{\mathcal{D}}_t$ |
|---|---|---|
| 'Weighted' Algorithm in Bagging | bootstrap-sampled copies | request size-$N'$ data by bootstrapping with $\mathcal{D}$ |
| A General Randomized Base Algorithm | sampling proportional to $u_n$ | request size-$N'$ data by sampling $\propto \mathbf{u}$ on $\mathcal{D}$ |

Here are some numbers (an example made up for this article, not from the slides). Five examples have weights $(0.1, 0.1, 0.1, 0.1, 0.4)$, which sum to 0.8, so their probabilities of being drawn are $(\frac{1}{8}, \frac{1}{8}, \frac{1}{8}, \frac{1}{8}, \frac{1}{2})$. Drawing $N' = 8$ examples, each of the first four appears 1 time on average and the fifth appears 4 times on average. An unmodified decision tree that sees these 8 examples learns indirectly that the fifth one matters more.

The handout's conclusion is that AdaBoost-DTree is often done via AdaBoost + sampling proportional to $\mathbf{u}^{(t)}$ + DTree($\tilde{\mathcal{D}}_t$), without modifying DTree. Lin puts it plainly in the lecture: we are usually lazy and do not want to modify the decision tree algorithm.

### A fully grown tree turns AdaBoost into an autocracy

Page 4 first reviews the vote formula. $\epsilon_t$ is the weighted error rate of $g_t$ (the total weight of the misclassified examples divided by the total weight of all examples):

$$
\alpha_t = \ln \blacklozenge_t = \ln\sqrt{\frac{1-\epsilon_t}{\epsilon_t}}
$$

Then comes a chain of implications. If $g_t$ is a fully grown tree trained on all $\mathbf{x}_n$:

1. As long as all $\mathbf{x}_n$ are different, the tree can keep cutting until every example has a leaf to itself, so $E_{\text{in}}(g_t) = 0$.
2. With no mistakes at all before weighting, the weighted error is of course also 0: $E_{\text{in}}^{\mathbf{u}}(g_t) = 0$.
3. So $\epsilon_t = 0$.
4. So $\alpha_t = \ln\sqrt{1/0} = \infty$.

One tree gets infinitely many votes, and nothing the other trees vote can matter. The handout calls this autocracy. In the lecture, Lin explains that this is no longer aggregation, since you only need that one tree; the idea was to combine many trees as random forest does, and the calculation ends up needing just one. The problem comes from two places: all the data was thrown in, and the tree was really allowed to cut all the way down.

So AdaBoost needs a weaker tree, which the handout writes as pruned tree trained on some $\mathbf{x}_n$:

- **pruned**: use the usual pruning, or just limit the tree height. Lin adds in the lecture that the pruning methods from Techniques Lecture 9 all work, but since AdaBoost only needs the base model to do roughly well, people often use the simpler option of limiting the height.
- **some**: use only part of the data. Sampling already does half of this along the way, because sampling by $\mathbf{u}^{(t)}$ does not necessarily draw every example.

The conclusion on this page completes the one on the previous page: AdaBoost-DTree is often done via AdaBoost + sampling proportional to $\mathbf{u}^{(t)}$ + pruned DTree($\tilde{\mathcal{D}}$).

### Pruned down to one level: the decision stump

Which tree is the weakest? Page 5 asks what happens if the height of C&RT is limited to at most 1. The whole tree then has a single branching criterion,

$$
b(\mathbf{x}) = \underset{\text{decision stumps } h(\mathbf{x})}{\operatorname{argmin}} \ \sum_{c=1}^{2} \lvert \mathcal{D}_c \text{ with } h\rvert \cdot \text{impurity}(\mathcal{D}_c \text{ with } h)
$$

that is, make one cut so that the impurity of the two sides, weighted by the amount of data on each, is lowest. If the impurity is binary classification error, this means making one cut, returning $+1$ or $-1$ on each side, and making the fewest classification mistakes, which is exactly the decision stump of Techniques Lecture 8. So the handout says AdaBoost-Stump is a special case of AdaBoost-DTree.

In the lecture, Lin adds an implementation habit that is not on the handout. When the tree is this short, $\epsilon_t$ is usually not 0, and a decision stump is simple enough to take the weights directly inside the algorithm. So with stumps people usually skip the sampling and use the weights directly; sampling is for general decision trees.

### Fun Time: all correct on the sampled data, so what is the vote

**Question (page 6):** When running AdaBoost-DTree with sampling and getting a decision tree $g_t$ such that $g_t$ achieves zero error on the sampled data set $\tilde{\mathcal{D}}_t$. Which of the following is possible?

1. $\alpha_t < 0$
2. $\alpha_t = 0$
3. $\alpha_t > 0$
4. all of the above

**Answer: 4.** The handout's explanation: while $g_t$ achieves zero error on $\tilde{\mathcal{D}}_t$, it may not achieve zero weighted error on $(\mathcal{D}, \mathbf{u}^{(t)})$, and hence $\epsilon_t$ can be anything, even at least $\frac{1}{2}$, in which case $\alpha_t \le 0$. $\alpha_t$ is computed with the original full data and weights; the sampled data is used only to train the tree.

This article builds one example for each case from the weights $(0.1, 0.1, 0.1, 0.1, 0.4)$ used above. Let the labels of the five examples be $(+1, +1, -1, -1, +1)$:

| The sample happens to contain only | A tree that is all correct on the sample | Misclassified on the full data | $\epsilon_t$ | $\alpha_t$ |
|---|---|---|---|---|
| examples 1, 2, 5 | always answer $+1$ | examples 3, 4, weight 0.2 | $0.2/0.8 = 0.25$ | $\ln\sqrt{3} \approx 0.549$ |
| examples 1 to 4 | $+1$ on the first two, $-1$ on the rest | example 5, weight 0.4 | $0.4/0.8 = 0.5$ | $\ln 1 = 0$ |
| examples 3, 4 | always answer $-1$ | examples 1, 2, 5, weight 0.6 | $0.6/0.8 = 0.75$ | $\ln\sqrt{1/3} \approx -0.549$ |

All three signs appear, so choosing option 1, 2, or 3 alone is incomplete.

## What AdaBoost minimizes: steepest descent on the exponential error

```youtube
url: https://www.youtube.com/watch?v=lKkXrFVcZjs
title: Gradient Boosted Decision Tree :: Optimization of AdaBoost @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–05:00 tidies up the weight update, 05:00–09:39 connects the voting score to the margin, 09:39–11:43 is the exponential error, 11:43–17:58 expands it the way gradient descent does, 17:58–21:08 finds the direction, 21:08–26:46 finds the step size, and Fun Time follows.)

### Writing the weight update as one formula

The update rule in Techniques Lecture 8 takes two lines: multiply the weight of a misclassified example by $\blacklozenge_t$, and divide the weight of a correct one by $\blacklozenge_t$. Page 7 merges them into one line. In binary classification $y_n$ and $g_t(\mathbf{x}_n)$ are both $\pm 1$: when the answer is wrong they have opposite signs and $y_n g_t(\mathbf{x}_n) = -1$; when it is right they have the same sign and $y_n g_t(\mathbf{x}_n) = +1$. So

$$
u_n^{(t+1)} = u_n^{(t)} \cdot \blacklozenge_t^{\,-y_n g_t(\mathbf{x}_n)}
$$

When the answer is wrong the exponent is $+1$, which multiplies by $\blacklozenge_t$; when it is right the exponent is $-1$, which divides by $\blacklozenge_t$. Now use $\alpha_t = \ln\blacklozenge_t$, that is, $\blacklozenge_t = \exp(\alpha_t)$:

$$
u_n^{(t+1)} = u_n^{(t)} \cdot \exp\big(-y_n \alpha_t g_t(\mathbf{x}_n)\big)
$$

Every round multiplies by an exponential. Starting from $u_n^{(1)} = \frac{1}{N}$ and multiplying all the way to the end of round $T$, the exponents of the product can move inside a single exp and become a sum:

$$
u_n^{(T+1)} = u_n^{(1)} \cdot \prod_{t=1}^{T}\exp\big(-y_n\alpha_t g_t(\mathbf{x}_n)\big) = \frac{1}{N}\cdot\exp\Big(-y_n \sum_{t=1}^{T}\alpha_t g_t(\mathbf{x}_n)\Big)
$$

The $\sum_t \alpha_t g_t(\mathbf{x})$ inside the exp looks familiar: what AdaBoost finally returns is $G(\mathbf{x}) = \text{sign}\big(\sum_{t=1}^{T}\alpha_t g_t(\mathbf{x})\big)$, and this is the quantity before the sign is taken. The handout calls it the voting score of $\{g_t\}$ on $\mathbf{x}$. The conclusion of this page is

$$
u_n^{(T+1)} \propto \exp\big(-y_n \cdot (\text{voting score on } \mathbf{x}_n)\big)
$$

The final weight of each example is determined only by its label and the voting score it receives.

### The voting score is an unnormalized margin

Page 8 returns to the view from Techniques Lecture 7: linear blending is LinModel + hypotheses as transform. The handout originally listed a third item, constraints, which is crossed out on the slide. In the lecture, Lin explains that votes should in principle not be negative, which would call for a condition, but as said before it does no harm to leave it out; a negative vote just uses that $g_t$'s opinion in reverse.

In this view, take $g_t(\mathbf{x}_n)$ as the $t$-th transformed feature $\phi_t(\mathbf{x}_n)$ and $\alpha_t$ as the weight $w_t$ on that feature, and the voting score is $\mathbf{w}^\top\boldsymbol{\phi}(\mathbf{x}_n)$. The margin of hard-margin SVM is

$$
\text{margin} = \frac{y_n\big(\mathbf{w}^\top\boldsymbol{\phi}(\mathbf{x}_n) + b\big)}{\lVert\mathbf{w}\rVert}
$$

Comparing the two, $y_n \cdot (\text{voting score})$ is a signed & unnormalized margin. Lin points out two differences from SVM in the lecture: there is no division by $\lVert\mathbf{w}\rVert$, and there is no $b$. Multiplying by $y_n$ brings in the information about being on the correct side or the wrong side.

We want this margin to be positive (classified correctly) and large (far from the boundary). The handout continues with three lines of equivalences:

- want $y_n \cdot (\text{voting score})$ positive and large
- which is the same as wanting $\exp(-y_n \cdot (\text{voting score}))$ small
- which is the same as wanting $u_n^{(T+1)}$ small

The last step uses the proportionality from page 7. The handout then states the claim of this section: **AdaBoost decreases $\sum_{n=1}^{N} u_n^{(t)}$ as the rounds go on.** Lin's extension in the lecture is that AdaBoost, while it runs, keeps trying to make the margin of every point more positive and larger, so it can achieve a large-margin effect.

### Exponential error: a convex upper bound of the 0/1 error

Add up the final weights of all the examples (page 9):

$$
\sum_{n=1}^{N} u_n^{(T+1)} = \frac{1}{N}\sum_{n=1}^{N}\exp\Big(-y_n\sum_{t=1}^{T}\alpha_t g_t(\mathbf{x}_n)\Big)
$$

Write the linear score as $s = \sum_{t=1}^{T}\alpha_t g_t(\mathbf{x}_n)$, and every term on the right is a function of $(s, y)$. The handout places it next to the 0/1 error:

$$
\text{err}_{0/1}(s, y) = [\![\, ys \le 0 \,]\!], \qquad \widehat{\text{err}}_{\text{ADA}}(s, y) = \exp(-ys)
$$

The figure on page 9 has $ys$ on the horizontal axis. The black 0/1 error is a step: 1 when $ys \le 0$ and 0 when $ys > 0$. The purple $\exp(-ys)$ is a curve that falls to the right and passes through $(0, 1)$; the whole curve is never below the step, and the two touch only at the point $ys = 0$. Values at a few points (the numbers are computed by this article):

| $ys$ | $-2$ | $-1$ | $0$ | $1$ | $2$ |
|---|---|---|---|---|---|
| 0/1 error | 1 | 1 | 1 | 0 | 0 |
| $\exp(-ys)$ | 7.39 | 2.72 | 1 | 0.37 | 0.14 |

When $ys \le 0$ we have $\exp(-ys) \ge 1$, and when $ys > 0$ we have $\exp(-ys) > 0$, so it is an upper bound of the 0/1 error; it is also convex. The handout calls $\widehat{\text{err}}_{\text{ADA}}$ the exponential error measure and positions it as an algorithmic error measure: doing well on the 0/1 error indirectly through a convex upper bound. Lin reminds us in the lecture that we have met this move again and again; SVM's hinge error and logistic regression's scaled cross-entropy are both upper bounds of the 0/1 error.

So "AdaBoost decreases the sum of weights" can be rewritten as "AdaBoost minimizes the exponential error to some extent"; the handout's wording is somewhat minimizes. The next two subsections prove this statement and make clear how the minimization happens.

### Treating a function as a direction

Page 10 first reviews gradient descent from Foundations Lecture 10. At step $t$ we stand at $\mathbf{w}_t$ and want to take a small step $\eta$ along some unit direction $\mathbf{v}$. A Taylor expansion writes the nearby $E_{\text{in}}$ as a first-order expression:

$$
\min_{\lVert\mathbf{v}\rVert = 1} E_{\text{in}}(\mathbf{w}_t + \eta\mathbf{v}) \approx \underbrace{E_{\text{in}}(\mathbf{w}_t)}_{\text{known}} + \underbrace{\eta}_{\text{given positive}} \ \mathbf{v}^\top\underbrace{\nabla E_{\text{in}}(\mathbf{w}_t)}_{\text{known}}
$$

Lin's review in the lecture: under the length constraint, the direction that minimizes this first-order expression is the negative gradient, and taking a small step $\eta$ that way lowers the error a little.

Now follow the same pattern. When AdaBoost reaches round $t$ it already holds $g_1, \dots, g_{t-1}$ and $\alpha_1, \dots, \alpha_{t-1}$, and that is where we currently stand. The next step adds a new $g_t$ and $\alpha_t$; before they are decided, call them $h$ and $\eta$. $h$ plays the role of the direction $\mathbf{v}$, except that it is a function.

In the lecture, Lin asks the question on the students' behalf: the direction used to be a vector, so how can we now be looking for a function? The reply is that functions and vectors are not that different. Give a vector an index (which entry) and it returns the value of that entry; give a function an $\mathbf{x}$ and it returns the function value. Only the kind of index differs, and everything else is done as before.

The problem to solve in round $t$ is

$$
\min_{h}\ \widehat{E}_{\text{ADA}} = \frac{1}{N}\sum_{n=1}^{N}\exp\Big(-y_n\Big(\sum_{\tau=1}^{t-1}\alpha_\tau g_\tau(\mathbf{x}_n) + \eta h(\mathbf{x}_n)\Big)\Big)
$$

**Step one: collect the known part into the weights.** The sum in the exponent splits into a product of two exps. The first half, $\frac{1}{N}\exp\big(-y_n\sum_{\tau=1}^{t-1}\alpha_\tau g_\tau(\mathbf{x}_n)\big)$, is exactly $u_n^{(t)}$ by the product formula above (with $T$ replaced by $t-1$):

$$
\widehat{E}_{\text{ADA}} = \sum_{n=1}^{N} u_n^{(t)}\exp\big(-y_n\eta h(\mathbf{x}_n)\big)
$$

**Step two: Taylor expansion.** When $\eta$ is small, $\exp(z) \approx 1 + z$ near the origin. Take $z = -y_n\eta h(\mathbf{x}_n)$:

$$
\widehat{E}_{\text{ADA}} \approx \sum_{n=1}^{N} u_n^{(t)}\big(1 - y_n\eta h(\mathbf{x}_n)\big) = \sum_{n=1}^{N} u_n^{(t)} - \eta\sum_{n=1}^{N} u_n^{(t)} y_n h(\mathbf{x}_n)
$$

The form matches the gradient descent line exactly: the first term is the current error, a known constant; the second is $\eta$ times a quantity that depends on the direction. $\eta$ is positive, so a good $h$ should make

$$
\sum_{n=1}^{N} u_n^{(t)}\big(-y_n h(\mathbf{x}_n)\big)
$$

as small as possible.

An addition in this article: gradient descent has to impose $\lVert\mathbf{v}\rVert = 1$, since otherwise a longer direction gives a lower value of the first-order expression and there is no minimum. No extra constraint is added here because a binary classification $h$ only outputs $\pm 1$, so its magnitude is fixed to begin with. The issue only surfaces in the section on switching the error function, where $h$ becomes real-valued, and the handout handles it there with a penalty term.

### Finding the direction: the base algorithm has been doing it all along

Page 11 rearranges the quantity above into something recognizable. In binary classification $y_n$ and $h(\mathbf{x}_n)$ are both $\pm 1$, so $-y_n h(\mathbf{x}_n)$ is $-1$ when the answer is right and $+1$ when it is wrong. Pull a $-1$ out of every term, and what remains is 0 for right and 2 for wrong:

$$
\sum_{n=1}^{N} u_n^{(t)}\big(-y_n h(\mathbf{x}_n)\big) = -\sum_{n=1}^{N} u_n^{(t)} + \sum_{n=1}^{N} u_n^{(t)}\cdot 2\,[\![\, y_n \ne h(\mathbf{x}_n) \,]\!] = -\sum_{n=1}^{N} u_n^{(t)} + 2E_{\text{in}}^{\mathbf{u}^{(t)}}(h)\cdot N
$$

The last equality uses $E_{\text{in}}^{\mathbf{u}^{(t)}}(h) = \frac{1}{N}\sum_n u_n^{(t)}[\![\, y_n \ne h(\mathbf{x}_n) \,]\!]$; the definition contains $\frac{1}{N}$, so we multiply $N$ back. The first term does not depend on $h$, and therefore

> finding good $h$ (function direction) $\Longleftrightarrow$ minimize $E_{\text{in}}^{\mathbf{u}^{(t)}}(h)$

Who minimizes the weighted $E_{\text{in}}^{\mathbf{u}}$? The base algorithm $\mathcal{A}$ in AdaBoost. Techniques Lecture 8 asked only one thing of it, to drive the weighted 0/1 error down once it receives the weights; we now know that the $g_t$ it hands back is at the same time a good direction in this approximate optimization problem. Lin's comment in the lecture is that the math is a little magical.

### Finding the step size: the solution is α

Once the direction is set, gradient descent would take a fixed small step and then look for the next direction. Page 12 asks: since $g_t$ is already fixed, why not solve directly

$$
\min_{\eta}\ \widehat{E}_{\text{ADA}} = \sum_{n=1}^{N} u_n^{(t)}\exp\big(-y_n\eta g_t(\mathbf{x}_n)\big)
$$

The motivation Lin gives in the lecture is that this direction was computed by another algorithm, and computing it once is not cheap, so it is worth taking a bigger step. The handout says the optimal $\eta_t$ solved this way is somewhat greedily faster than a fixed small $\eta$, and that this is called steepest descent in optimization. Lin explains what greedily means: it only guarantees that this round looks faster, with no guarantee that it is faster in the long run.

Note that this step needs no Taylor expansion; with $g_t$ fixed it can be computed directly. There are only two kinds of terms in the summation:

- correct ($y_n = g_t(\mathbf{x}_n)$): $u_n^{(t)}\exp(-\eta)$
- incorrect ($y_n \ne g_t(\mathbf{x}_n)$): $u_n^{(t)}\exp(+\eta)$

The total weight of the incorrect examples is $\epsilon_t\sum_n u_n^{(t)}$ and that of the correct ones is $(1-\epsilon_t)\sum_n u_n^{(t)}$; this is the definition of $\epsilon_t$. Factor out the total weight:

$$
\widehat{E}_{\text{ADA}} = \Big(\sum_{n=1}^{N} u_n^{(t)}\Big)\cdot\big((1-\epsilon_t)\exp(-\eta) + \epsilon_t\exp(+\eta)\big)
$$

This is a differentiable function of the single variable $\eta$. Differentiate with respect to $\eta$ and set the result to 0:

$$
\frac{\partial\widehat{E}_{\text{ADA}}}{\partial\eta} = \Big(\sum_{n=1}^{N} u_n^{(t)}\Big)\cdot\big(-(1-\epsilon_t)\exp(-\eta) + \epsilon_t\exp(+\eta)\big) = 0
$$

The total weight is positive, so the bracket must be 0: $\epsilon_t\exp(\eta) = (1-\epsilon_t)\exp(-\eta)$. Multiply both sides by $\exp(\eta)$ and divide by $\epsilon_t$ to get $\exp(2\eta) = \frac{1-\epsilon_t}{\epsilon_t}$, then take the logarithm and divide by 2:

$$
\eta_t = \frac{1}{2}\ln\frac{1-\epsilon_t}{\epsilon_t} = \ln\sqrt{\frac{1-\epsilon_t}{\epsilon_t}} = \alpha_t
$$

An addition in this article: the second derivative is $\big(\sum_n u_n^{(t)}\big)\big((1-\epsilon_t)\exp(-\eta) + \epsilon_t\exp(\eta)\big) > 0$, so this point is a minimum.

Techniques Lecture 8 explained $\alpha_t$ as "the better $g_t$ performs, the more votes it gets"; Lin says in the lecture that we now see it was quietly carrying out an optimization. The handout sums up the whole section in one line: AdaBoost is steepest descent with approximate functional gradient. Functional gradient refers to doing something like gradient descent in the world of functions; approximate is because finding the direction used the Taylor approximation.

This article adds one more step and turns the handout's claim into numbers. Substitute $\eta = \alpha_t$ back in. With $\exp(-\alpha_t) = \sqrt{\epsilon_t/(1-\epsilon_t)}$ and $\exp(\alpha_t) = \sqrt{(1-\epsilon_t)/\epsilon_t}$, each of the two terms equals $\sqrt{\epsilon_t(1-\epsilon_t)}$:

$$
\sum_{n=1}^{N} u_n^{(t+1)} = \Big(\sum_{n=1}^{N} u_n^{(t)}\Big)\cdot 2\sqrt{\epsilon_t(1-\epsilon_t)}
$$

The left side can be written as the next round's sum of weights because substituting $\eta = \alpha_t$ into $u_n^{(t)}\exp(-y_n\eta g_t(\mathbf{x}_n))$ gives $u_n^{(t+1)}$. $2\sqrt{\epsilon_t(1-\epsilon_t)}$ equals 1 when $\epsilon_t = \frac{1}{2}$ and is less than 1 otherwise. So as long as the base algorithm does a little better than random guessing in every round, the sum of weights (that is, the exponential error) really does go down every round. This is the precise version of the claim on page 8.

### Numerical example: three rounds of AdaBoost-Stump on five points

The following is an example made up for this article, not from the slides, used to put a number on every formula in this section. The data are five points in one dimension:

| $n$ | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| $x_n$ | 1 | 2 | 3 | 4 | 5 |
| $y_n$ | $+1$ | $+1$ | $-1$ | $-1$ | $+1$ |

The base algorithm is the decision stump: choose a threshold and a direction that give the lowest weighted error rate (answering the same sign on the whole line is also allowed). The initial weights are $u_n^{(1)} = \frac{1}{5}$, with sum $U_1 = 1$.

**Round 1.** The best stump is $g_1(x) = \text{sign}(2.5 - x)$, which outputs $(+,+,-,-,-)$ and is wrong only on example 5. $\epsilon_1 = 0.2$, $\blacklozenge_1 = \sqrt{0.8/0.2} = 2$, $\alpha_1 = \ln 2 \approx 0.693$.

Look first at the function from the step-size subsection. In this round $\widehat{E}_{\text{ADA}}(\eta) = 0.8\exp(-\eta) + 0.2\exp(\eta)$:

| $\eta$ | $\widehat{E}_{\text{ADA}}(\eta)$ | Note |
|---|---|---|
| $0$ | $1$ | no step yet, equal to $U_1$ |
| $0.1$ | $0.9449$ | a fixed small step; the Taylor approximation gives $1 - 0.1\times 0.6 = 0.94$ |
| $\ln 2 \approx 0.693$ | $0.4 + 0.4 = 0.8$ | the steepest descent step size |
| $2\ln 2 \approx 1.386$ | $0.2 + 0.8 = 1$ | overshoots and returns to the original height |

The $0.6$ in the Taylor approximation row is $\sum_n u_n^{(1)} y_n g_1(x_n) = 0.8 - 0.2$. The lowest point is at $\eta = \alpha_1$, with value $0.8 = 1 \times 2\sqrt{0.2\times 0.8}$, in agreement with the formula. Update the weights: the misclassified example 5 becomes $0.2\times 2 = 0.4$, the other four become $0.2/2 = 0.1$, and the sum is $U_2 = 0.8$.

**Round 2.** The weights are $(0.1, 0.1, 0.1, 0.1, 0.4)$. The previous round's $g_1$ now has weighted error rate $0.4/0.8 = 0.5$, the same as random guessing, which is the design explained in Techniques Lecture 8. Two stumps tie for best in this round: $\text{sign}(x - 4.5)$ is wrong on examples 1 and 2, and the one that answers $+1$ on the whole line is wrong on examples 3 and 4. Both have misclassified weight $0.2$, and every other cut is worse. Here we take $g_2(x) = \text{sign}(x - 4.5)$, which outputs $(-,-,-,-,+)$ (choosing the other one would change the numbers that follow, but two things still hold: the sum of weights equals the average exponential error, and it falls each round by the ratio $2\sqrt{\epsilon_t(1-\epsilon_t)}$). $\epsilon_2 = 0.2/0.8 = 0.25$, $\blacklozenge_2 = \sqrt{3}$, $\alpha_2 = \ln\sqrt{3} \approx 0.549$. The new weights: examples 1 and 2 are $0.1\sqrt{3} \approx 0.173$, examples 3 and 4 are $0.1/\sqrt{3} \approx 0.058$, and example 5 is $0.4/\sqrt{3} \approx 0.231$. The sum is $U_3 \approx 0.693 = 0.8\times 2\sqrt{0.25\times 0.75}$.

**Round 3.** The best stump is $g_3$, which answers $+1$ on the whole line and is wrong on examples 3 and 4. $\epsilon_3 = 0.115/0.693 = \frac{1}{6}$, $\blacklozenge_3 = \sqrt{5}$, $\alpha_3 = \ln\sqrt{5} \approx 0.805$. The sum is $U_4 \approx 0.516 = 0.693\times 2\sqrt{\frac{1}{6}\times\frac{5}{6}}$.

After three rounds, the voting score of each example, $s_n = \sum_t \alpha_t g_t(x_n)$:

| $n$ | $s_n$ (after round 1) | $s_n$ (after round 2) | $s_n$ (after round 3) | $y_n s_n$ after round 3 |
|---|---|---|---|---|
| 1, 2 | $0.693$ | $0.144$ | $0.949$ | $0.949$ |
| 3, 4 | $-0.693$ | $-1.242$ | $-0.438$ | $0.438$ |
| 5 | $-0.693$ | $-0.144$ | $0.661$ | $0.661$ |

| | Initial | After round 1 | After round 2 | After round 3 |
|---|---|---|---|---|
| Sum of weights $U_{t+1}$ | $1$ | $0.8$ | $0.693$ | $0.516$ |
| $\frac{1}{N}\sum_n\exp(-y_n s_n)$ | $1$ | $0.8$ | $0.693$ | $0.516$ |
| $E_{\text{in}}(G)$ (0/1) | no $G$ yet | $0.2$ | $0.2$ | $0$ |

**What this result means.** The second row is identical to the first, and that is the equation on page 9: the sum of weights is the average exponential error. It falls every round, by the ratio $2\sqrt{\epsilon_t(1-\epsilon_t)}$, which is $0.8$, $0.866$, and $0.745$ in turn. The 0/1 error stays pinned below the exponential error throughout; in round 2 it does not move (example 5 is still wrong), yet the exponential error falls all the same, because what AdaBoost optimizes is the upper bound. After round 3 all five $y_n s_n$ are positive: three stumps that each make mistakes combine to classify all the data correctly.

### Fun Time: differentiating with respect to η

**Question (page 13):** With $\widehat{E}_{\text{ADA}} = \big(\sum_{n=1}^{N} u_n^{(t)}\big)\cdot\big((1-\epsilon_t)\exp(-\eta) + \epsilon_t\exp(+\eta)\big)$, which of the following is $\frac{\partial\widehat{E}_{\text{ADA}}}{\partial\eta}$ that can be used for solving the optimal $\eta_t$? All four options begin with $\big(\sum_{n=1}^{N} u_n^{(t)}\big)$ and differ in the bracket that follows:

1. $\big(+(1-\epsilon_t)\exp(-\eta) + \epsilon_t\exp(+\eta)\big)$
2. $\big(+(1-\epsilon_t)\exp(-\eta) - \epsilon_t\exp(+\eta)\big)$
3. $\big(-(1-\epsilon_t)\exp(-\eta) + \epsilon_t\exp(+\eta)\big)$
4. $\big(-(1-\epsilon_t)\exp(-\eta) - \epsilon_t\exp(+\eta)\big)$

**Answer: 3.** Differentiating $\exp(-\eta)$ with respect to $\eta$ brings out a $-1$, differentiating $\exp(+\eta)$ brings out a $+1$, and the other coefficients stay the same. These are also the two sentences Lin says in the lecture.

Where the other options go wrong: option 1 is identical to the original expression, as if nothing had been differentiated (it is in fact the second derivative). Option 4 treats both terms as gaining a minus sign. Option 2 is the correct answer multiplied through by $-1$; setting it to 0 gives the same $\eta_t$, but it is not the partial derivative the question asks for. Check with round 1 of the example: with $\epsilon_1 = 0.2$ and $\eta = \ln 2$, the bracket of option 3 is $-0.8\times\frac{1}{2} + 0.2\times 2 = 0$, exactly the lowest point.

## Switching the error function: under squared error, every round fits the residuals

```youtube
url: https://www.youtube.com/watch?v=F_EuNXhS9js
title: Gradient Boosted Decision Tree :: Gradient Boosting @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–02:45 generalizes from AdaBoost to GradientBoost, 02:45–07:24 is the Taylor expansion under squared error, 07:24–12:09 adds the penalty term and arrives at residuals, 12:09–15:00 decides the step size, 15:00–17:45 assembles GBDT, and Fun Time follows.)

### From AdaBoost to GradientBoost

The conclusion of the optimization view can be written as a two-level optimization problem (page 14):

$$
\text{AdaBoost:}\quad \min_{\eta}\min_{h}\ \frac{1}{N}\sum_{n=1}^{N}\exp\Big(-y_n\Big(\sum_{\tau=1}^{t-1}\alpha_\tau g_\tau(\mathbf{x}_n) + \eta h(\mathbf{x}_n)\Big)\Big)
$$

where $h$ is a binary-output hypothesis. Since what each round does is "optimize over $h$ first, then over $\eta$", the same can be done with exp swapped for another error function:

$$
\text{GradientBoost:}\quad \min_{\eta}\min_{h}\ \frac{1}{N}\sum_{n=1}^{N}\text{err}\Big(\sum_{\tau=1}^{t-1}\alpha_\tau g_\tau(\mathbf{x}_n) + \eta h(\mathbf{x}_n),\ y_n\Big)
$$

Here $h$ can be whichever hypothesis you like, and the handout notes that it is usually a real-output one. The handout's positioning is that GradientBoost allows extension to different err, for regression, soft classification, and so on. Lin's examples in the lecture: use cross-entropy if you care about the kind of problem logistic regression solves, and squared error for regression. Lin also notes that because the method belongs to the gradient descent family, the error function has to be smooth enough.

This lecture derives only the regression version.

### The Taylor expansion under squared error

Page 15 takes $\text{err}(s, y) = (s - y)^2$ and writes the score accumulated so far as

$$
s_n = \sum_{\tau=1}^{t-1}\alpha_\tau g_\tau(\mathbf{x}_n)
$$

In the lecture, Lin explains that this is now regression, so $s_n$ can no longer quite be called a voting score; it is simply the value accumulated with weights over the earlier rounds. Each example starts from $s_n$ and moves by $\eta h(\mathbf{x}_n)$. Take a first-order Taylor expansion of err in its first argument around $s_n$:

$$
\text{err}\big(s_n + \eta h(\mathbf{x}_n), y_n\big) \approx \text{err}(s_n, y_n) + \eta h(\mathbf{x}_n)\cdot\frac{\partial\,\text{err}(s, y_n)}{\partial s}\bigg|_{s = s_n}
$$

Lin stresses in the lecture that $s$ is a variable and $s_n$ is a number already computed; $s_n$ is substituted only after the partial derivative is taken. The derivative of $(s - y_n)^2$ with respect to $s$ is $2(s - y_n)$, and substituting $s = s_n$ gives $2(s_n - y_n)$. The first term does not depend on $h$ and is a constant:

$$
\min_{h}\ \frac{1}{N}\sum_{n=1}^{N}\text{err}\big(s_n + \eta h(\mathbf{x}_n), y_n\big) \approx \min_{h}\ \text{constants} + \frac{\eta}{N}\sum_{n=1}^{N} h(\mathbf{x}_n)\cdot 2(s_n - y_n)
$$

We want the last term as small as possible. Lin walks the students through it in the lecture: if $s_n - y_n$ is positive, give a negative $h(\mathbf{x}_n)$; if it is negative, give a positive one, so the product is always negative. And the magnitude? 100 is better than 1, 1000 is better than 100, and bigger is always better. So the handout writes this meaningless solution at the bottom of the page: with no constraint on $h$,

$$
h(\mathbf{x}_n) = -\infty\cdot(s_n - y_n)
$$

An addition in this article: squared error can in fact be expanded directly, $(s_n + \eta h - y_n)^2 = (s_n - y_n)^2 + 2\eta h(s_n - y_n) + \eta^2 h^2$. What the first-order Taylor expansion throws away is exactly the final $\eta^2 h^2$, which would have stopped $h$ from growing without bound. The penalty term the handout adds next does something similar.

### Adding a penalty term: the direction is a regression on the residuals

Page 16 deals with this run to infinity. The first observation: the magnitude of $h$ does not matter, because $\eta$ will be optimized next and is in charge of the step size. Gradient descent imposed $\lVert\mathbf{v}\rVert = 1$; Lin says in the lecture that the length of $h$ could be constrained here too, but that means solving a constrained optimization problem, which is a nuisance. Instead use the move from regularization in [Foundations Lecture 14](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-14-regularization-en): turn the constraint into a penalty term and put it into the expression being minimized. The larger $h$ is, the heavier the penalty:

$$
\min_{h}\ \text{constants} + \frac{\eta}{N}\sum_{n=1}^{N}\Big(2h(\mathbf{x}_n)(s_n - y_n) + \big(h(\mathbf{x}_n)\big)^2\Big)
$$

$h^2$ is chosen as the penalty in order to complete the square. A squared term plus "twice $h$ times some quantity" can be made into a perfect square:

$$
2h(\mathbf{x}_n)(s_n - y_n) + \big(h(\mathbf{x}_n)\big)^2 = \big(h(\mathbf{x}_n) + (s_n - y_n)\big)^2 - (s_n - y_n)^2 = \big(h(\mathbf{x}_n) - (y_n - s_n)\big)^2 - (y_n - s_n)^2
$$

The $(y_n - s_n)^2$ subtracted at the end depends only on the current score and the label, so it is a constant. The problem becomes

$$
\min_{h}\ \text{constants} + \frac{\eta}{N}\sum_{n=1}^{N}\Big(\text{constant} + \big(h(\mathbf{x}_n) - (y_n - s_n)\big)^2\Big)
$$

The only part that depends on $h$ is $\sum_n\big(h(\mathbf{x}_n) - (y_n - s_n)\big)^2$: we want $h(\mathbf{x}_n)$ as close as possible to $y_n - s_n$ in the squared-error sense. This is a regression problem, with data $\{(\mathbf{x}_n,\ y_n - s_n)\}$.

$y_n - s_n$ is the target value minus the score achieved so far, and the handout calls it the residual. In the lecture, Lin calls it the remainder and gives this analogy: you want 100 points, you have reached 90, and 10 points are still not done. The handout's conclusion:

> GradientBoost for regression: find $g_t = h$ by regression with residuals

Lin contrasts this with AdaBoost in the lecture: in each round AdaBoost hands the base algorithm a new set of weights, while GradientBoost for regression hands the base algorithm a new set of target values (the residuals).

An addition in this article: the relation between the residual and the gradient is direct, $y_n - s_n = -\frac{1}{2}\cdot\frac{\partial\,\text{err}}{\partial s}\big|_{s = s_n}$. Running regression on the residuals means finding a function that stays as close as possible to the negative gradient at every $\mathbf{x}_n$, and this is where the gradient in the name comes from.

### The step size is a one-variable linear regression

After finding $g_t = h$, page 17 fixes it and optimizes over $\eta$ only (the $\min_h$ on the slide is crossed out):

$$
\min_{\eta}\ \frac{1}{N}\sum_{n=1}^{N}\big(s_n + \eta g_t(\mathbf{x}_n) - y_n\big)^2 = \frac{1}{N}\sum_{n=1}^{N}\big((y_n - s_n) - \eta g_t(\mathbf{x}_n)\big)^2
$$

The equality only flips the sign of every term inside the bracket, which does not affect the square. The form on the right is familiar: $y_n - s_n$ is the residual again, $g_t(\mathbf{x}_n)$ is a known number, and we look for a coefficient $\eta$ that brings $\eta g_t(\mathbf{x}_n)$ close to the residual. This is linear regression with only one variable, where the input is the $g_t$-transformed $g_t(\mathbf{x}_n)$ and the output is the residual. Lin makes a point of saying in the lecture that there is no constant term $x_0$ here, so there really is just one variable. It also differs from the regression in the previous step: that one has to be solved by the base algorithm $\mathcal{A}$, and this one has a closed-form solution.

Let us derive the formula ourselves. Differentiate with respect to $\eta$ and set the result to 0:

$$
\frac{d}{d\eta}\sum_{n=1}^{N}\big((y_n - s_n) - \eta g_t(\mathbf{x}_n)\big)^2 = -2\sum_{n=1}^{N} g_t(\mathbf{x}_n)\big((y_n - s_n) - \eta g_t(\mathbf{x}_n)\big) = 0
$$

Expanding gives $\sum_n g_t(\mathbf{x}_n)(y_n - s_n) = \eta\sum_n g_t^2(\mathbf{x}_n)$, so

$$
\alpha_t = \eta_{\text{opt}} = \frac{\sum_{n=1}^{N} g_t(\mathbf{x}_n)(y_n - s_n)}{\sum_{n=1}^{N} g_t^2(\mathbf{x}_n)}
$$

The handout's conclusion: in GradientBoost for regression, $\alpha_t$ is the optimal $\eta$, computed by $g_t$-transformed linear regression.

### Putting everything together: GBDT

Page 18 puts the two steps inside a loop, which gives the Gradient Boosted Decision Tree (GBDT):

1. Initialize: $s_1 = s_2 = \dots = s_N = 0$.
2. For $t = 1, 2, \dots, T$:
   1. Obtain $g_t$ by the regression algorithm $\mathcal{A}$ (which minimizes squared error) on $\{(\mathbf{x}_n,\ y_n - s_n)\}$. The handout asks here: how about sampled and pruned C&RT?
   2. Compute $\alpha_t = \text{OneVarLinearRegression}\big(\{(g_t(\mathbf{x}_n),\ y_n - s_n)\}\big)$.
   3. Update $s_n \leftarrow s_n + \alpha_t g_t(\mathbf{x}_n)$.
3. Return $G(\mathbf{x}) = \sum_{t=1}^{T}\alpha_t g_t(\mathbf{x})$.

Several details come from what Lin says in the lecture. The Decision Tree in the name comes from the first step: decision trees can do regression, so they are the most common choice of base algorithm. The returned $G$ takes no sign, because this is regression. The initial scores are 0, so the residuals in round 1 are just $y_n$ themselves and the problem solved is the original regression problem; learning on residuals begins from round 2.

The handout calls GBDT the regression sibling of AdaBoost-DTree, popular in practice. Lin adds in the lecture that a different derivation produces versions for problems such as logistic regression, and that this lecture demonstrates only regression. The application example given is information retrieval, such as web page ranking.

Here is what the two algorithms do in each round, side by side (this table is put together by this article; the content of every row comes from the derivations above):

| | AdaBoost | GradientBoost (squared error) |
|---|---|---|
| Error function | $\exp(-ys)$ | $(s - y)^2$ |
| Handed to the base algorithm | the original $y_n$, plus new weights $u_n^{(t)}$ | new target values $y_n - s_n$ |
| What the base algorithm solves | weighted binary classification | squared-error regression |
| Step size $\alpha_t$ | $\ln\sqrt{(1-\epsilon_t)/\epsilon_t}$ | $\sum_n g_t(\mathbf{x}_n)(y_n - s_n)\,/\,\sum_n g_t^2(\mathbf{x}_n)$ |
| Return | $\text{sign}\big(\sum_t\alpha_t g_t(\mathbf{x})\big)$ | $\sum_t\alpha_t g_t(\mathbf{x})$ |

### Numerical example: three rounds of GBDT on four points

The following is an example made up for this article, not from the slides. Four one-dimensional examples:

| $n$ | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| $x_n$ | 1 | 2 | 3 | 4 |
| $y_n$ | 1 | 3 | 2 | 6 |

The base algorithm is a C&RT regression tree of height 1: cut midway between two adjacent points, return on each side the average of the residuals on that side, and choose the cut with the smallest total squared error over the two sides. To keep the process easy to follow, the first three rounds do no sampling and use all four examples.

**Round 1.** $s_n = 0$, so the residuals are just $y = (1, 3, 2, 6)$. The three cuts:

| Cut at | Left average | Right average | Total squared error |
|---|---|---|---|
| 1.5 | $1$ | $\frac{11}{3}$ | $\frac{26}{3} \approx 8.67$ |
| 2.5 | $2$ | $4$ | $10$ |
| 3.5 | $2$ | $6$ | $2$ |

Choose 3.5: $g_1(x) = 2$ (for $x < 3.5$) or $6$ (for $x > 3.5$), which is $(2, 2, 2, 6)$ on the four points. The step size is

$$
\alpha_1 = \frac{2\times 1 + 2\times 3 + 2\times 2 + 6\times 6}{2^2 + 2^2 + 2^2 + 6^2} = \frac{48}{48} = 1
$$

Update $s = (2, 2, 2, 6)$; the new residuals are $(-1, 1, 0, 0)$.

**Round 2.** Do it again on the residuals $(-1, 1, 0, 0)$. Cutting at 1.5 gives left average $-1$, right average $\frac{1}{3}$, and total squared error $\frac{2}{3}$; the other two cuts both give 2. So $g_2 = (-1, \frac{1}{3}, \frac{1}{3}, \frac{1}{3})$,

$$
\alpha_2 = \frac{(-1)(-1) + \frac{1}{3}\times 1 + 0 + 0}{1 + 3\times\frac{1}{9}} = \frac{4/3}{4/3} = 1
$$

Update $s = (1, \frac{7}{3}, \frac{7}{3}, \frac{19}{3})$, with residuals $(0, \frac{2}{3}, -\frac{1}{3}, -\frac{1}{3})$.

**Round 3.** Cutting at 2.5 is best (total squared error $\frac{2}{9}$; the other two give $\frac{2}{3}$ and $\frac{14}{27}$): $g_3 = (\frac{1}{3}, \frac{1}{3}, -\frac{1}{3}, -\frac{1}{3})$, $\alpha_3 = 1$. Update $s = (\frac{4}{3}, \frac{8}{3}, 2, 6)$, with residuals $(-\frac{1}{3}, \frac{1}{3}, 0, 0)$.

| | Initial | After round 1 | After round 2 | After round 3 |
|---|---|---|---|---|
| $s_n$ | $(0, 0, 0, 0)$ | $(2, 2, 2, 6)$ | $(1, \frac{7}{3}, \frac{7}{3}, \frac{19}{3})$ | $(\frac{4}{3}, \frac{8}{3}, 2, 6)$ |
| Residuals $y_n - s_n$ | $(1, 3, 2, 6)$ | $(-1, 1, 0, 0)$ | $(0, \frac{2}{3}, -\frac{1}{3}, -\frac{1}{3})$ | $(-\frac{1}{3}, \frac{1}{3}, 0, 0)$ |
| Mean squared error | $12.5$ | $0.5$ | $\frac{1}{6} \approx 0.167$ | $\frac{1}{18} \approx 0.056$ |

**What this result means.** Each round's tree makes a single cut and is weak on its own. Added together, $G(x) = g_1(x) + g_2(x) + g_3(x)$ is a step function with four pieces whose values on the four points are $(\frac{4}{3}, \frac{8}{3}, 2, 6)$, already close to the targets $(1, 3, 2, 6)$. Each round's tree sees a different target: round 1 sees the original $y$, and later rounds see the part not yet achieved, so the three trees cut at three different places. The mean squared error falls from 12.5 all the way to 0.056.

All three $\alpha_t$ come out as exactly 1, and there is a reason (an addition in this article). Each leaf of a regression tree returns the average of the residuals that fall in that leaf. Suppose a leaf holds $m$ examples with residual average $c$. That leaf contributes $c\times(\text{sum of residuals}) = c\times mc$ to the numerator and $m\times c^2$ to the denominator, and the two are equal. This holds for every leaf, so the numerator equals the denominator. As long as the tree is trained on the same data, the leaves use averages, and the outputs of $g_t$ are not all 0, $\alpha_t$ must be 1.

So when is the second step useful? What the handout suggests is a "sampled and pruned" C&RT. When the tree sees only the sampled data, $\alpha_t$ is recomputed on all the data and need not be 1. Change round 1 so that the tree is trained only on the sampled examples 1, 3, and 4 ($y$ values $1, 2, 6$). Cutting at 3.5 is best, with left average $\frac{3}{2}$ and right $6$, so on the four points $g_1 = (\frac{3}{2}, \frac{3}{2}, \frac{3}{2}, 6)$.

$$
\alpha_1 = \frac{\frac{3}{2}(1 + 3 + 2) + 6\times 6}{3\times\frac{9}{4} + 36} = \frac{45}{42.75} = \frac{20}{19} \approx 1.053
$$

With $\alpha_1 = \frac{20}{19}$, the mean squared error over the four examples is $\frac{25}{38} \approx 0.658$; using 1 directly gives $\frac{11}{16} = 0.6875$. The tree did not see $y = 3$ from example 2, so the left leaf is estimated too low, and the one-variable linear regression uses all the data to scale the whole tree's output up slightly and win a little back.

The pure Python below prints the threshold, the two leaf values, $\alpha_t$, and the mean squared error for the first three rounds, so you can compare with the table above:

```python
from fractions import Fraction as F

x = [1, 2, 3, 4]
y = [F(1), F(3), F(2), F(6)]

def stump(xs, rs):
    """Regression tree of height 1: returns (threshold, left leaf average, right leaf average)"""
    best = None
    for i in range(len(xs) - 1):
        th = F(xs[i] + xs[i + 1], 2)
        left = [r for a, r in zip(xs, rs) if a < th]
        right = [r for a, r in zip(xs, rs) if a > th]
        ml, mr = sum(left) / len(left), sum(right) / len(right)
        sse = sum((r - ml) ** 2 for r in left) + sum((r - mr) ** 2 for r in right)
        if best is None or sse < best[0]:
            best = (sse, th, ml, mr)
    return best[1:]

s = [F(0)] * 4
for t in range(1, 4):
    res = [yn - sn for yn, sn in zip(y, s)]            # residuals
    th, ml, mr = stump(x, res)                         # step 1: regression on the residuals
    g = [ml if a < th else mr for a in x]
    alpha = sum(gn * rn for gn, rn in zip(g, res)) / sum(gn * gn for gn in g)  # step 2
    s = [sn + alpha * gn for sn, gn in zip(s, g)]      # step 3
    mse = sum((yn - sn) ** 2 for yn, sn in zip(y, s)) / 4
    print(t, th, ml, mr, alpha, mse)
```

The output is three lines: `1 7/2 2 6 1 1/2`, `2 3/2 -1 1/3 1 1/6`, `3 5/2 1/3 -1/3 1 1/18`.

### Fun Time: the formula for the optimal step size

**Question (page 19):** Which of the following is the optimal $\eta$ for $\min_{\eta}\frac{1}{N}\sum_{n=1}^{N}\big((y_n - s_n) - \eta g_t(\mathbf{x}_n)\big)^2$? Write $A = \sum_{n=1}^{N} g_t(\mathbf{x}_n)(y_n - s_n)$ and $B = \sum_{n=1}^{N} g_t^2(\mathbf{x}_n)$ (these two symbols are added by this article for layout):

1. $A \cdot B$
2. $A\,/\,B$
3. $A + B$
4. $A - B$

**Answer: 2.** The handout only says it was derived within Lecture 9 of ML Foundations. The closed-form solution for linear regression in Foundations Lecture 9 is $\mathbf{w} = (\mathrm{X}^\top\mathrm{X})^{-1}\mathrm{X}^\top\mathbf{y}$. Here there is only one variable, so $\mathrm{X}$ is an $N\times 1$ column holding $g_t(\mathbf{x}_n)$, and $\mathbf{y}$ is replaced by the residuals. Then $\mathrm{X}^\top\mathrm{X} = B$, $\mathrm{X}^\top\mathbf{y} = A$, and $\eta = A/B$. The subsection above on the step size as one-variable linear regression differentiates directly and arrives at the same expression.

The other options can be ruled out with a simple check: if $g_t$ happens to equal the residuals, the optimal $\eta$ is obviously 1. In that case $A = B$, and the four options give $B^2$, $1$, $2B$, and $0$, so only option 2 is right. Round 1 of the example is another check: $A = 48$, $B = 48$, $\eta = 1$.

## A summary of aggregation models: which ones make a model stronger and which make it steadier

```youtube
url: https://www.youtube.com/watch?v=JqSLmlSpqNo
title: Gradient Boosted Decision Tree :: Summary of Aggregation @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–02:08 sums up blending, 02:08–05:00 sums up the models that learn while aggregating, 05:00–06:00 is aggregation of aggregation, 06:00–08:42 discusses the two cures, 08:42–09:21 is Fun Time, and the summary of the whole lecture follows.)

From Techniques Lecture 7 to this one, five lectures have covered a whole family of models. Pages 20 to 23 gather them into three maps and one conclusion.

### Get the g first, then aggregate: blending

The definition on page 20 is aggregate **after** getting diverse $g_t$. Lin's analogy in the lecture is throwing the $g_t$ you already have into a blender to make mixed juice. Three ways to do it:

| | uniform | non-uniform | conditional |
|---|---|---|---|
| How to aggregate | simple voting or averaging | linear model on $g_t$-transformed inputs | nonlinear model on $g_t$-transformed inputs |

The handout's comment: uniform for stability; non-uniform and conditional, carefully, for complexity. Lin's explanation in the lecture is that uniform lets different $g_t$ correct one another's mistakes, while the other two learn one more layer after the transform, which makes them more powerful and in turn means worrying about overfitting. Lin also mentions that the conditional approach is generally called stacking, meaning that layers of learning are stacked up; this name is not on this slide.

### Learn the g while aggregating: four models

The definition on page 21 is aggregate **as well as** getting diverse $g_t$: no $g_t$ are in hand yet, and how to aggregate is decided while learning them.

| Model | How it gets diverse $g_t$ | How it aggregates |
|---|---|---|
| Bagging | bootstrapping | uniform vote, with nothing to compute |
| AdaBoost | reweighting | linear vote, with votes decided by steepest search |
| Decision Tree | data splitting | conditional vote, with conditions decided by branching |
| GradientBoost | residual fitting | linear vote, with votes decided by steepest search |

AdaBoost and GradientBoost differ in the second column and agree in the third, which is exactly the content of this lecture's two derivations. The handout writes at the bottom of the page boosting-like algorithms most popular. What Lin says in the lecture is slightly different: all four models matter in practice, and the most popular are the two related to boosting.

### Aggregating the aggregation models

Page 22 pairs the models above with each other:

| Outer layer | Inner tree | Result |
|---|---|---|
| Bagging (plus randomization) | 'strong' DTree | Random Forest |
| AdaBoost | 'weak' DTree | AdaBoost-DTree |
| GradientBoost | 'weak' DTree | GBDT |

The handout says all three are frequently used in practice. Lin explains the strong and weak distinction in the lecture: random forest uses fully grown trees and relies on random projections to make the trees more varied; AdaBoost is designed to combine weak things into something strong, so starting with something too strong makes no sense, and GradientBoost likewise goes with weak trees. This echoes the autocracy problem from the start of this lecture.

### Two cures

Page 23 returns to the two motivations given at the start of Techniques Lecture 7, each with a figure:

- **Cure underfitting.** The left figure shows data of circles and crosses whose boundary is a staircase made of several horizontal and vertical segments. A single decision stump can only make one horizontal or vertical cut and cannot separate the data well; after aggregation $G(\mathbf{x})$ becomes 'strong'. The handout's reading is aggregation ⟹ feature transform.
- **Cure overfitting.** The right figure has many gray lines and one black line in the middle. Combining many of them gives a more middle-of-the-road $G(\mathbf{x})$ (the handout's word is moderate). In the lecture, Lin explains that overfitting means having made too extreme a choice, and that a moderate choice prevents it. The handout's reading is aggregation ⟹ regularization. Lin says the moderate choice shows up in the figure as something like a large-margin effect, and that the same phenomenon can be seen in the boundary of a random forest.

Lin compares the two sides in the lecture to a big family that has both models that step on the accelerator for you and models that step on the brake: some succeed more at curing underfitting and some at curing overfitting, and you get better performance only by knowing each one's character and using them well in turn. The handout's conclusion is proper aggregation (a.k.a. ensemble) ⟹ better performance. Lin explains the word ensemble as a group, like a choir.

An addition in this article: the two numerical examples for AdaBoost and GBDT both belong to the left-figure kind. Three stumps that each make mistakes combine to classify all five points correctly; three regression trees that each make a single cut combine into a step function with four pieces.

### Fun Time: which model relies on reweighting and steepest search

**Question (page 24):** Which of the following aggregation model learns diverse $g_t$ by reweighting and calculates linear vote by steepest search?

1. AdaBoost
2. Random Forest
3. Decision Tree
4. Linear Blending

**Answer: 1.** The sentence is the AdaBoost row of the table on page 21. Check the other options against the same table. Random Forest gets its $g_t$ by bootstrapping (plus randomized trees) and votes uniformly, with no votes to compute. Decision Tree relies on data splitting and aggregates conditionally. Linear Blending aggregates after the $g_t$ already exist; it is not responsible for learning $g_t$, and its votes come from solving a linear model. GradientBoost's votes also come from steepest search, but it gets $g_t$ by residual fitting, and it is not among the options.

The summary on page 25 reduces each of the four sections to one line: sampling and pruning for 'weak' trees; AdaBoost is functional gradient descent on exponential error; gradient boosting is iterative steepest residual fitting; among aggregation models some cure underfitting and some cure overfitting. The preview of the next lecture is extract features other than hypotheses: so far everything used as a feature transform has been a hypothesis $g_t$, and next the machine will learn other kinds of feature transforms on its own.

## Self-check

**1. In some round of AdaBoost the sum of weights is 1, and the $g_t$ handed back by the base algorithm has weighted error rate $\epsilon_t = 0.1$. What is the optimal step size? After taking this step, what does the sum of weights become?**

Answer: $\eta_t = \ln\sqrt{0.9/0.1} = \ln 3 \approx 1.099$. $\widehat{E}_{\text{ADA}} = 0.9\exp(-\ln 3) + 0.1\exp(\ln 3) = 0.3 + 0.3 = 0.6$, or directly $2\sqrt{0.1\times 0.9} = 0.6$. The more accurate $g_t$ is, the larger the step and the more the sum of weights drops.

**2. In some round of GBDT the residuals of three examples are $(3, -1, 2)$, and the learned $g_t$ outputs $(1, -1, 1)$ on these three. Compute $\alpha_t$ and the updated residuals, and check the inner product of the new residuals with the outputs of $g_t$.**

Answer: $\alpha_t = \frac{3 + 1 + 2}{1 + 1 + 1} = 2$. The new residuals are $(3, -1, 2) - 2\times(1, -1, 1) = (1, 1, 0)$, and the mean squared error falls from $\frac{14}{3}$ to $\frac{2}{3}$. The inner product is $1\times 1 + 1\times(-1) + 0\times 1 = 0$. This is no coincidence: the optimal $\eta$ satisfies $\sum_n g_t(\mathbf{x}_n)\big((y_n - s_n) - \eta g_t(\mathbf{x}_n)\big) = 0$, and the bracket is exactly the updated residual.

**3. Why can AdaBoost not be paired directly with a decision tree that is "trained on all the data and fully grown"? Which two remedies does the handout give?**

Criterion: the answer has to walk through this chain: when all $\mathbf{x}_n$ are different $E_{\text{in}} = 0$, it is still 0 after weighting, $\epsilon_t = 0$, $\alpha_t = \infty$, and one tree takes all the votes. The remedies are pruning (or limiting the height) and using only part of the data (sampling by $\mathbf{u}^{(t)}$).

**4. In deriving GradientBoost's direction, why is there no meaningful $h$ without the penalty term? Who ends up deciding the magnitude of $h$?**

Criterion: the answer has to say that the objective after the Taylor expansion is first-order in $h(\mathbf{x}_n)$, namely $\frac{\eta}{N}\sum_n h(\mathbf{x}_n)\cdot 2(s_n - y_n)$; as long as the sign is chosen opposite to $s_n - y_n$, the larger the magnitude the smaller the value, and there is no minimum. Adding $h^2$ lets it be completed to $\big(h(\mathbf{x}_n) - (y_n - s_n)\big)^2$, and a minimum exists. The magnitude need not be settled in this step, because the $\eta$ of the next step decides the step size by one-variable linear regression.

**5. In round 1 of GBDT, what problem does the base algorithm solve? If the base algorithm is a regression tree with no sampling and averages at the leaves, what is $\alpha_1$?**

Answer: $s_n$ starts at 0, so the residuals equal $y_n$ and round 1 solves the original regression problem. By the argument in the numerical example, every leaf contributes equally to the numerator and the denominator, so $\alpha_1 = 1$.

## Exercises and corresponding reading

**The corresponding week in two semesters.** The [Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) puts decision tree, random forest, and this lecture in the same week (W12, 11/18), and the slide code for this lecture is [211u](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/211u_handout.pdf). The [Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) also puts them in W12 (11/25); the slides for that week were not yet online as of 2026-09-30, so this article uses only the MOOC handout.

**Textbook.** Neither course page maps this lecture to a chapter of [Learning from Data](http://amlbook.com). Among the further readings the course pages list for this week, the one related to this lecture is [Friedman, Greedy Function Approximation: A Gradient Boosting Machine (Annals of Statistics, 2001)](https://doi.org/10.1214/aos/1013203451), the original gradient boosting paper; the link here uses the DOI.

**Homework.** [Fall 2024 HW7](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf) (released 2024-12-02, due 12-16) has three problems that correspond directly to this lecture. All are human-graded proof problems with no official solutions:

- **Q6**: prove $U_{t+1}/U_t = 2\sqrt{\epsilon_t(1-\epsilon_t)}$, where $U_t$ is the sum of weights in round $t$. The problem states that it corresponds to the AdaBoost of Techniques Lecture 8 and this lecture. The addition at the end of the step-size subsection is this formula, and the five-point example can be used to check the numbers.
- **Q7**: when the base model of gradient boosting is replaced by linear regression without regularization, prove or disprove that the optimal $\alpha_1 = 1$. First get clear on why the regression tree in the numerical example gives 1, then see whether that argument still holds for linear regression.
- **Q8**: after GBDT updates $s_n$ using the steepest $\eta$ as $\alpha_t$, prove $\sum_n (y_n - s_n) g_t(\mathbf{x}_n) = 0$, and think about the relation between the residual vector and the output vector of $g_t$. Self-check question 2 is its numerical version.

This lecture has no programming problem. If you want to get your hands dirty, there are two directions. One is to turn the AdaBoost-Stump of HW7 Q10–12 into AdaBoost-DTree, sampling by the weights and limiting the tree height as this lecture describes. The other is to replace the base model in the GBDT code above with a regression tree of depth 2 and, on data from a one-dimensional sin curve with noise, plot $G$ at rounds 1, 5, and 20 to see how each round fills in the residuals the previous round left behind. The guide to the whole assignment is in [Techniques Homework and Final Project](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project-en).

**Next lecture.** [Techniques Lecture 12: Neural Networks](/posts/ai/2026-09-30-ntu-htlin-ml-neural-network-deep-learning-en) enters the third technique, Distilling Implicit Features: Extraction Models, where the feature transform is no longer a set of hypotheses learned one by one but is learned together with the final model.

## Course video sources

Original videos: [Adaptive Boosted Decision Tree](https://www.youtube.com/watch?v=aX6ZiIWLjdk), [Optimization View of AdaBoost](https://www.youtube.com/watch?v=lKkXrFVcZjs), [Gradient Boosting](https://www.youtube.com/watch?v=F_EuNXhS9js), [Summary of Aggregation Models](https://www.youtube.com/watch?v=JqSLmlSpqNo)

- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

Checked: 2026-10-13. The video IDs, titles, and lengths were taken from the official playlist that day; the videos have no caption track on YouTube, and what this article reports from the lecture comes from transcripts made for it. The section names in the video titles are shorter than those in the handout (AdaBoost Decision Tree, Optimization of AdaBoost, Summary of Aggregation); the links above use the section names from page 1 of the handout.

## Update Log

- 2026-10-13: The series now has one article per lecture; this lecture is a newly split-out article, written from the handout and the video transcripts.

## References

- [Techniques Lecture 11 handout, 211_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/211_handout.pdf): the main source for this article. The derivations in the four sections, the four Fun Time questions, and the figures on pages 9 and 23 all come from this handout.
- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2): the IDs and titles of the four videos; what the text reports as said "in the lecture" is paraphrased from machine transcripts of these four videos.
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/): the official entry for handouts and recordings.
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/): the corresponding week, the 211u slides, and the further reading list.
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/): the corresponding week.
- [Fall 2024 Homework 7 (hw7.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf): the content of Q6, Q7, Q8, and Q10–12.
- [Friedman, Greedy Function Approximation: A Gradient Boosting Machine](https://doi.org/10.1214/aos/1013203451): further reading listed on the course page, the original gradient boosting paper.
- [Learning from Data textbook website](http://amlbook.com): the textbook mentioned when noting that the course pages map no chapter to this lecture.
- [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques: Course Overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en): where this lecture sits in the whole course and the reading routes.
