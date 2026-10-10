---
title: "Hsuan-Tien Lin's ML Techniques T9–T11: Decision Trees, Random Forests, and Gradient Boosted Trees"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, ensemble, decision-trees]
lang: en
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 13
tldr: "Lectures 9–11 of Machine Learning Techniques tie three models together with one thread: trees plus aggregation. T9 treats a decision tree as conditional aggregation and covers C&RT's binary branching, Gini and regression impurity, pruning, categorical features, and surrogate branches. T10 applies bagging to fully grown trees; add random subspaces and random projections and you get a random forest, with free OOB validation and permutation-based feature importance. T11 re-derives AdaBoost as steepest descent in function space on the exponential error, then swaps in squared error to get GBDT, which fits regressions to residuals. Practice with the impurity and gradient boosting proofs in Fall 2024 HW7. There are no official solutions."
description: "A guide to Lecture 9 (Decision Tree), Lecture 10 (Random Forest), and Lecture 11 (Gradient Boosted Decision Tree) of NTU Hsuan-Tien Lin's Machine Learning Techniques: the C&RT algorithm and heuristics, random forests with random-combination branching, OOB estimates and model selection, permutation-test feature selection, AdaBoost-DTree, the optimization view of AdaBoost, the gradient boosting derivation, and the summary of aggregation models, with the matching Fall 2024 HW7 problems and the Loh, Breiman, and Friedman readings listed on the course page."
draft: false
glossary:
  - term: "C&RT"
    aliases: ["CART", "Classification and Regression Tree"]
    definition: "Each node branches in two with a decision stump, picking the split that leaves both sides purest; leaves hold the E_in-optimal constant (majority for classification, average for regression); the tree grows until it cannot branch anymore."
    context: "Lin's T9 notes that the C&RT taught in class uses only selected components of CART."
  - term: "OOB"
    aliases: ["out-of-bag"]
    definition: "Examples not drawn into a bootstrap sample. Each example has roughly a 1/e chance of being left out of a given bootstrap sample, so it can validate the trees that never saw it."
    context: "T10 calls E_oob self-validation for bagging and random forests: no separate validation split and no retraining."
  - term: "gradient boosting"
    aliases: ["GradientBoost", "GBDT"]
    definition: "Boosting viewed as steepest descent in function space: each round finds a g_t approximating the negative gradient direction, then a one-dimensional search picks the step size α_t. With squared error this means regressing on the residuals y_n − s_n."
    context: "T11 generalizes from AdaBoost's exponential error to any error; with pruned trees as the base model it is GBDT."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-htlin-ml-decision-tree-random-forest-gbdt)

> **Sources**: The core material is the [MOOC version](https://www.csie.ntu.edu.tw/~htlin/mooc/) of Machine Learning Techniques: [209_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/209_handout.pdf) (Decision Tree), [210_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/210_handout.pdf) (Random Forest), [211_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/211_handout.pdf) (Gradient Boosted Decision Tree), and videos 34–45 of the [Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2). Homework references come from [Fall 2024 HW7](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf). All facts were checked against the originals on 2026-09-30. The lectures are taught in Mandarin; the slides are in English. Access level: the MOOC alone is **A2**; adding the Fall 2024 homework PDFs brings it to **A3 (minus the grading chain)**. There are no official solutions, and Gradescope and NTU COOL are for enrolled students only.

**Series**: Previous: [Blending, Bagging, and AdaBoost](/posts/ai/2026-09-30-ntu-htlin-ml-blending-bagging-adaboost-en) | Next: [Neural Networks and Deep Learning](/posts/ai/2026-09-30-ntu-htlin-ml-neural-network-deep-learning-en) | [Series overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en)

At the end of the [previous post](/posts/ai/2026-09-30-ntu-htlin-ml-blending-bagging-adaboost-en), one cell on the aggregation map was still empty. T9 opens by drawing the map as a table:

| | uniform | non-uniform | conditional |
|---|---|---|---|
| blending (combine after getting g_t) | voting/averaging | linear | stacking |
| learning (combine while getting g_t) | Bagging | AdaBoost | **Decision Tree** |

A decision tree fills the "learn while doing conditional aggregation" cell. That is also why this series reads the three lectures as one post: T9 covers trees, T10 puts trees inside bagging, and T11 puts trees inside boosting. They share one thread.

## Course video sources

These course video sources were already documented in this article. Playback has not been reverified for each video; no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=dAqPpAXnMJ4
title: Decision Tree Hypothesis
```

```youtube
url: https://www.youtube.com/watch?v=s9Um2O7N7YM
title: Decision Tree Algorithm
```

Original videos: [Decision Tree Hypothesis](https://www.youtube.com/watch?v=dAqPpAXnMJ4)、[Decision Tree Algorithm](https://www.youtube.com/watch?v=s9Um2O7N7YM)、[Decision Tree Heuristics in C&RT](https://www.youtube.com/watch?v=uvGC_Y0EYiA)、[Decision Tree in Action](https://www.youtube.com/watch?v=ryWTrPPbqcg)、[Random Forest Algorithm](https://www.youtube.com/watch?v=ATM3sH0D45s)、[Out-of-bag Estimate](https://www.youtube.com/watch?v=7oz5aO-FkR0)、[Feature Selection](https://www.youtube.com/watch?v=ChqNC94JXtM)、[Random Forest in Action](https://www.youtube.com/watch?v=Ipfpf7AW_yM)

Course and recording entries:

- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

## Where these lectures sit

| Version | Week | Slides | Extended reading (as listed on the course page) |
|---|---|---|---|
| MOOC | Techniques T9–T11 | 209, 210, 211 | — |
| [Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) | W12 (11/18), the same week as T8 | [209u](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/209u_handout.pdf), [210u](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/210u_handout.pdf), [211u](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/211u_handout.pdf) | Loh, Breiman et al. (CART book), Breiman (RF), Friedman |
| [Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) | W12 (11/25) | 209u–211u currently return 404 (not released yet) | Same |

The course page lists no LFD chapters for these lectures.

## T9 Decision Tree

Videos: [Decision Tree Hypothesis](https://www.youtube.com/watch?v=dAqPpAXnMJ4), [Decision Tree Algorithm](https://www.youtube.com/watch?v=s9Um2O7N7YM), [Decision Tree Heuristics in C&RT](https://www.youtube.com/watch?v=uvGC_Y0EYiA), [Decision Tree in Action](https://www.youtube.com/watch?v=ryWTrPPbqcg)

### What kind of aggregation a tree is

The slides' example is "should I watch MOOC lectures today?" First check quitting time. If it's before 18:30, check whether you have a date; if it's after 21:30, check how many days remain before the homework deadline.

In aggregation form, G(x) = Σ q_t(x)·g_t(x): g_t is the leaf at the end of path t (a constant here), and q_t(x) is "is x on path t?" There is also a recursive view: G(x) = Σ_c [b(x) = c]·G_c(x), where b is the branching criterion and G_c the sub-tree for branch c. In the slides' words, "just like what your data structure instructor would say."

The slides are candid about both sides. Pros: human-explainable, widely used in business and medical data analysis, simple enough for freshmen to implement, and efficient to train and predict. Cons: little theoretical explanation, so many heuristics that beginners get confused, and arguably no single representative algorithm.

### Four choices in C&RT

The basic decision tree algorithm is recursive: unless a termination criterion is met, learn a branching criterion b(x), split the data into C parts, and build a sub-tree on each. Four things must be decided: the number of branches, the branching criterion, the termination criterion, and the base hypothesis at the leaves.

The C&RT taught in class (the slides note it uses only selected components of CART) chooses:

- **C = 2**, a binary tree.
- **Leaves** hold the E_in-optimal constant: majority vote for classification, average for regression.
- **Branching** uses a decision stump that leaves both sides purest: b(x) = argmin Σ_c |D_c|·impurity(D_c).
- **Impurity** is the E_in of the optimal constant. Regression uses squared error. Classification can use the Gini index (1 − Σ_k (N_k/N)², considering all classes together) or the classification error (looking only at the majority class). The slides say the popular choices are Gini for classification and regression error for regression.
- **Termination** is forced when all y_n are the same (impurity = 0) or all x_n are the same (no stump can split them).

So by default C&RT grows a fully grown tree with constant leaves.

### Pruning, categorical features, missing values

A fully grown tree has E_in = 0 when all x_n are distinct, but deep nodes are built from very little data and tend to overfit. The slides' remedies:

- **Pruning**: use the number of leaves as the regularizer, Ω(G) = NumberOfLeaves(G). You can't enumerate every tree, so consider a sequence: G^(0) is the fully grown tree, and G^(i) is the tree with minimal E_in among those with one leaf removed from G^(i−1). Choose λ by validation.
- **Categorical features**: numerical features split on a threshold; categorical features split on a subset instead, b(x) = [x_i ∈ S] + 1.
- **Missing values**: during training, also keep a few surrogate branches that split almost like the best branch. If the best branch is weight ≤ 50 kg and weight is missing at prediction time, use a threshold on height instead.

The slides list five practical specialties of C&RT: human-explainable, multiclass made easy, categorical features made easy, missing features made easy, and efficient non-linear training and testing. They also mention C4.5, another popular decision tree algorithm with different heuristics. On the demo datasets, C&RT is even more efficient than the previous lecture's AdaBoost-Stump.

## T10 Random Forest

Videos: [Random Forest Algorithm](https://www.youtube.com/watch?v=ATM3sH0D45s), [Out-of-bag Estimate](https://www.youtube.com/watch?v=7oz5aO-FkR0), [Feature Selection](https://www.youtube.com/watch?v=ChqNC94JXtM), [Random Forest in Action](https://www.youtube.com/watch?v=Ipfpf7AW_yM)

### Bagging plus fully grown trees

Bagging reduces variance; fully grown trees have large variance. The slides call putting them together "aggregation of aggregation":

**Random forest (RF) = bagging + fully grown C&RT**

It has three advantages: it is highly parallel, it inherits the strengths of C&RT, and voting cancels the weaknesses of fully grown trees.

You can add more diversity. Bagging samples examples; RF can also sample features. Pick d′ random dimensions, Φ(x) = (x_{i1}, …, x_{id′}), which is a random subspace. The original RF draws a new subspace for **every branch** inside C&RT.

Going further, the rows of the projection matrix P need not be unit vectors. They can be random low-dimensional combinations φ_i(x) = p_iᵀx with only d″ nonzero components. The original RF considers d′ such random projections at each branch. Each branch b(x) is then a perceptron. The slides' tagline: "randomness everywhere!"

### OOB: validation for free

When you bootstrap N′ examples, each D̃_t misses some examples. They are the out-of-bag (OOB) examples of g_t. With N′ = N and large N, the chance that an example is not in D̃_t is (1 − 1/N)^N ≈ 1/e, so each tree has roughly N/e OOB examples.

OOB examples act like validation data for g_t. Validating a single tree this way is easy but rarely needed. The useful part is validating the whole G:

E_oob(G) = (1/N) Σ_n err(y_n, G_n⁻(x_n)), where G_n⁻ contains only the trees that never saw x_n.

The slides call this self-validation for bagging and RF. You can use it directly for model selection, such as choosing RF parameters like d″, without retraining. According to the slides, E_oob is often accurate in practice.

### Feature importance by permutation test

Feature selection aims to remove two kinds of features: redundant ones (like keeping both "age" and "full birthday") and irrelevant ones (like insurance type for cancer prediction). The benefits are efficiency, generalization, and interpretability; the costs are expensive combinatorial optimization, possible overfitting, and possible misinterpretation. The slides note that decision trees are a rare model with built-in feature selection.

If you can compute an importance score for each feature, you can keep the top d′. For linear models, |w_i| works. Non-linear models are much harder. RF uses a **permutation test**: if feature i matters, replacing its values with random ones should hurt performance. To keep the distribution of x_i unchanged, shuffle {x_{n,i}} across examples instead of drawing uniform or Gaussian noise.

importance(i) = performance(D) − performance(D^(p))

In general D^(p) requires retraining and validation. The original RF sidesteps this with OOB: importance(i) = E_oob(G) − E_oob^(p)(G), where E_oob^(p) replaces each request for x_{n,i} with a permuted OOB value while computing the OOB error. The slides' verdict: often efficient and promising in practice.

### How many trees

On the demo data, more trees give smoother boundaries that look large-margin-like. The slides' practical example is KDD Cup 2013 Track 1 (NTU won again; the task was predicting author–paper relations). E_val with thousands of trees ranged from 0.015 to 0.019 depending on the random seed, while the top 20 teams' E_out ranged from 0.014 to 0.019. The team chose 12,000 trees with seed 1. So one drawback of RF: when the random process is unstable, you may need a lot of trees, and you should double-check that G is stable.

## T11 Gradient Boosted Decision Tree

Videos: [AdaBoost Decision Tree](https://www.youtube.com/watch?v=aX6ZiIWLjdk), [Optimization of AdaBoost](https://www.youtube.com/watch?v=lKkXrFVcZjs), [Gradient Boosting](https://www.youtube.com/watch?v=F_EuNXhS9js), [Summary of Aggregation](https://www.youtube.com/watch?v=JqSLmlSpqNo)

### AdaBoost-DTree: the tree must be weak

To swap RF's bagging for AdaBoost, you need a tree that takes example weights. If you don't want to modify the DTree code, sample D̃_t in proportion to u^(t) and train an ordinary DTree on it.

The other problem is that AdaBoost needs a **weak** base algorithm. A fully grown tree gets E_in^u = 0 when all x_n are distinct, so ε_t = 0 and α_t = ∞, which the slides call "autocracy." So prune the tree (or just limit its height) and train it on only a sampled part of the data.

The extreme case is a tree of height ≤ 1. If the impurity is binary classification error, that is a decision stump. So AdaBoost-Stump is a special case of AdaBoost-DTree.

### The optimization view of AdaBoost

This section is the heart of T11. It re-derives the α_t that looked like "magic" in the previous lecture.

Start with the weights. Multiplying incorrect examples by ♦_t and dividing correct ones by ♦_t can be written as u_n^(t+1) = u_n^(t)·exp(−y_n α_t g_t(x_n)). Multiplying all the way through, u_n^(T+1) is proportional to exp(−y_n·Σ_t α_t g_t(x_n)).

Σ_t α_t g_t(x_n) is G's voting score. Recall T7's linear blending and the hard-margin SVM: y_n times the voting score is a signed, unnormalized margin. You want it positive and large, meaning exp(−y_n·score) small.

The slides claim that **AdaBoost decreases Σ_n u_n^(t)**, and therefore somewhat minimizes Σ_n exp(−y_n s_n). Here err_ADA(s, y) = exp(−ys) is a convex upper bound on the 0/1 error, called the exponential error.

<details>
<summary>Derivation: g_t is an approximate functional gradient direction, α_t is the steepest-descent step</summary>

**Finding the direction.** In round t, find a function h and step size η that decrease Ê_ADA:

Ê_ADA = (1/N) Σ_n exp(−y_n(Σ_{τ<t} α_τ g_τ(x_n) + η h(x_n)))
= Σ_n u_n^(t) exp(−y_n η h(x_n))
≈ Σ_n u_n^(t)(1 − y_n η h(x_n)) (Taylor expansion around η = 0)
= Σ_n u_n^(t) − η Σ_n u_n^(t) y_n h(x_n)

So a good h minimizes Σ_n u_n^(t)(−y_n h(x_n)). For binary classification with y_n, h(x_n) ∈ {−1, +1}, this equals −Σ_n u_n^(t) + 2·E_in^u(h)·N. Minimizing it means minimizing the weighted E_in^u(h), which is exactly what the base algorithm A does inside AdaBoost.

**Finding the step.** Once g_t is found, instead of a fixed small η, find the η that minimizes Ê_ADA directly (steepest descent):

Ê_ADA = (Σ_n u_n^(t))·((1 − ε_t) exp(−η) + ε_t exp(+η))

Setting the derivative with respect to η to zero gives η_t = ln √((1 − ε_t)/ε_t) = α_t.

</details>

The conclusion: **AdaBoost is steepest descent with an approximate functional gradient**. The α_t from the previous lecture is simply the optimal step size. The identity U_{t+1}/U_t = 2√(ε_t(1 − ε_t)) that HW7 Q6 asks you to prove is the exact size of this decrease.

### Gradient boosting: swap out the error function

If AdaBoost is steepest descent on the exponential error, replacing it with any err and letting h be a real-valued hypothesis gives GradientBoost. It extends to regression, soft classification, and more.

For regression with squared error, the result is clean:

<details>
<summary>Derivation: with squared error, g_t is a regression on residuals and α_t is a one-variable linear regression</summary>

Let s_n = Σ_{τ<t} α_τ g_τ(x_n) and err(s, y) = (s − y)². Taylor-expand around s_n:

min_h (1/N) Σ_n err(s_n + η h(x_n), y_n) ≈ constant + (η/N) Σ_n h(x_n)·2(s_n − y_n)

With no constraint on h, the optimum is h(x_n) = −∞·(s_n − y_n), which is meaningless. The magnitude of h doesn't matter (η is optimized next), so add a penalty (h(x_n))²:

constant + (η/N) Σ_n (2h(x_n)(s_n − y_n) + (h(x_n))²) = constant + (η/N) Σ_n (constant + (h(x_n) − (y_n − s_n))²)

That is squared-error regression on {(x_n, y_n − s_n)}, where y_n − s_n is the **residual**.

Once g_t is found, α_t is the η minimizing Σ_n((y_n − s_n) − η g_t(x_n))², which is a one-variable linear regression with g_t(x_n) as input and the residual as output.

</details>

Put together, this is GBDT:

1. Set s_1 = … = s_N = 0.
2. Each round, train g_t with a (squared-error) regression algorithm on {(x_n, y_n − s_n)}; the slides suggest sampled and pruned C&RT.
3. α_t = OneVarLinearRegression({(g_t(x_n), y_n − s_n)}).
4. Update s_n ← s_n + α_t g_t(x_n).
5. Return G(x) = Σ_t α_t g_t(x).

The slides call GBDT the "regression sibling" of AdaBoost-DTree, popular in practice.

### Summary of aggregation models

T11 closes the second part of the course with three maps:

- **Blending** (after getting g_t): uniform is voting/averaging, non-uniform is a linear model on g_t-transformed inputs, conditional is a non-linear model on them. Use uniform for stability; use non-uniform and conditional carefully because of complexity.
- **Aggregation learning** (while getting g_t): Bagging gets diversity from bootstrapping and votes uniformly; AdaBoost gets it from re-weighting and finds linear weights by steepest search; decision trees get it from data splitting and vote conditionally by branching; GradientBoost gets it from residual fitting and finds linear weights by steepest search. The slides say boosting-like algorithms are the most popular.
- **Aggregation of aggregation**: RF = randomized bagging + "strong" trees; AdaBoost-DTree = AdaBoost + "weak" trees; GBDT = GradientBoost + "weak" trees. All three are frequently used in practice.

The last slide returns to T7's two intuitions. Aggregation can make G strong, like a feature transform, which cures underfitting. It can also make G moderate, like regularization, which cures overfitting. Proper aggregation (a.k.a. "ensemble") gives better performance.

## Practice with the Fall 2024 homework

The problems in [HW7](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf) (released 2024-12-02, due 12-16) that map to these three lectures:

| Problem | Type | What it practices |
|---|---|---|
| Q2 | Auto-graded | After normalizing several impurity functions (classification error, squared error, entropy, closeness) by their maximum, which one is equivalent to the Gini index? |
| Q6 | Human-graded | Prove U_{t+1}/U_t = 2√(ε_t(1 − ε_t)); the problem explicitly refers to AdaBoost in Lectures 208 and 211 |
| Q7 | Human-graded | If gradient boosting uses unregularized linear regression instead of trees, prove or disprove that the optimal α_1 = 1 |
| Q8 | Human-graded | After GBDT updates s_n with the steepest η as α_t, prove Σ_n (y_n − s_n) g_t(x_n) = 0, and think about how the residual vector relates to g_t's output vector |

These lectures have no programming problems. If you want hands-on work, turn the AdaBoost-Stump from the [previous post](/posts/ai/2026-09-30-ntu-htlin-ml-blending-bagging-adaboost-en) (HW7 Q10–12) into AdaBoost-DTree, or run scikit-learn's `RandomForestClassifier` on the same madelon data and compare `oob_score_` with the test error to check the claim that E_oob is often accurate. There are no official solutions, so you have to check proofs yourself or with classmates. The full homework walkthrough is in [Techniques homework and final project](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project-en).

## How to use these three lectures for self-study

1. T9 and T10 work as a course in "understanding scikit-learn parameters." After watching, you should be able to map `max_depth`, `max_features`, `oob_score`, and `feature_importances_` to specific parts of the slides.
2. T11's [Optimization of AdaBoost](https://www.youtube.com/watch?v=lKkXrFVcZjs) is worth rewatching. Work through both collapsed derivations yourself, and any later gradient boosting variant will be much easier to read.
3. One thing to do tonight: write a 30-line GBDT in numpy (with a depth-2 `DecisionTreeRegressor` as the base model) on a noisy one-dimensional sine curve, and plot G after rounds 1, 5, and 20. You'll see each round patching the residuals the previous round left behind.

## Further reading

Extended reading listed on the course page:

- [Loh, Classification and Regression Trees (WIREs overview)](https://pages.stat.wisc.edu/~loh/treeprogs/guide/wires11.pdf): a panorama of decision tree algorithms.
- Breiman et al., *Classification and Regression Trees*: the original CART book; the course page links its [Amazon page](http://www.amazon.com/Classification-Regression-Wadsworth-Statistics-Probability/dp/0412048418).
- [Breiman, Random Forests (Machine Learning, 2001)](https://doi.org/10.1023/A:1010933404324): the original random forest paper.
- [Friedman, Greedy Function Approximation: A Gradient Boosting Machine (Annals of Statistics, 2001)](https://doi.org/10.1214/aos/1013203451): the original gradient boosting paper. The course page's old link (www-stat.stanford.edu) no longer resolved on 2026-09-30, so this uses the DOI.

How other courses on this site cover the same topics (this post does not skip anything because of them):

- [Harvard CS181 HW4: Decision Trees, Random Forests, and MoE](/posts/tech/2026-09-29-harvard-cs181-hw4-trees-forests-moe-en)
- [CMU 10-301 HW2: Decision Trees](/posts/learning/2026-08-22-cmu-10301-hw2-decision-trees-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/) — section titles and slides for Techniques T9–T11
- [Lecture 9: Decision Tree (209_handout.pdf)](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/209_handout.pdf) — conditional aggregation, C&RT, impurity, pruning, categorical features, surrogate branches
- [Lecture 10: Random Forest (210_handout.pdf)](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/210_handout.pdf) — RF, random subspaces and projections, OOB, permutation feature importance, KDD Cup 2013 experience
- [Lecture 11: Gradient Boosted Decision Tree (211_handout.pdf)](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/211_handout.pdf) — AdaBoost-DTree, optimization view, gradient boosting, aggregation summary
- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2) — videos 34–45 (lectures in Mandarin)
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) — weekly schedule, 209u–211u slides, and reading list
- [Fall 2024 Homework 7 (hw7.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf)
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) — W12 schedule
- [Loh, Classification and Regression Trees](https://pages.stat.wisc.edu/~loh/treeprogs/guide/wires11.pdf)
- [Breiman, Random Forests](https://doi.org/10.1023/A:1010933404324)
- [Friedman, Greedy Function Approximation: A Gradient Boosting Machine](https://doi.org/10.1214/aos/1013203451)
- On this site: [Series overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en)
