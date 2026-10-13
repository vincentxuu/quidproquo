---
title: "Decision Trees: How C&RT Splits and Prunes | NTU Hsuan-Tien Lin Machine Learning Techniques Lecture 9"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, decision-trees, ensemble]
lang: en
math: true
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 26
tldr: "A decision tree is a model that learns conditional aggregation as it goes: every path from the root to a leaf is a condition, and the leaf is a constant. C&RT splits the data in two with one decision stump at a time, picks the split with the smallest weighted impurity, and keeps going until nothing can be split. A tree grown this way almost always has E_in equal to 0, so it is pruned with \"E_in plus λ times the number of leaves\", with λ chosen by validation. The same recursion also handles multiclass problems, categorical features, and missing values."
description: "A guide to Lecture 9 of NTU Hsuan-Tien Lin's Machine Learning Techniques, Decision Tree: the path view and the recursive view, the four choices in C&RT, the Gini index and other impurity functions, fully-grown trees and pruning, decision subsets, and surrogate branches, with one tree grown and then pruned by hand on 14 data points."
draft: false
glossary:
  - term: "C&RT"
    aliases: ["CART", "Classification and Regression Tree"]
    definition: "Every node branches in two with a decision stump, choosing the split that makes the two sides \"purest\"; a leaf holds the E_in-optimal constant (the majority for classification, the average for regression); the tree grows until nothing can be split."
    context: "The handout for Techniques Lecture 9 states that the C&RT taught in class takes only selected components of CART."
  - term: "impurity"
    aliases: ["impurity function"]
    definition: "A number that measures how inconsistent the y values in a set of data are; it is 0 when they are all the same. C&RT uses it to score each split: multiply the impurity of each of the two parts by its size and add them up, and smaller is better."
    context: "Techniques Lecture 9 lists three: regression error, classification error, and the Gini index."
  - term: "Gini index"
    aliases: ["Gini impurity"]
    definition: "1 minus the sum of the squared class proportions. It is 0 when there is only one class, and largest, at 1 − 1/K, when K classes each take 1/K."
    context: "The handout says it is the popular impurity for C&RT in classification, because the proportions of all classes are counted."
  - term: "pruning"
    aliases: ["pruned decision tree"]
    definition: "Regularization applied to a fully-grown tree: minimize E_in plus λ times the number of leaves. In practice only the sequence of trees obtained by removing one leaf at a time is compared, and λ is chosen by validation."
    context: "Techniques Lecture 9 uses it to deal with the overfitting of fully-grown trees."
  - term: "surrogate branch"
    aliases: ["surrogate split"]
    definition: "A few substitute splits stored alongside each branch during training, whose results are close to the best branch. At prediction time, when the feature the best branch needs is missing, a substitute split is used instead."
    context: "Techniques Lecture 9 explains how C&RT handles missing values with \"if weight is missing, look at height instead\"."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-htlin-ml-decision-tree-random-forest-gbdt)

**Video status: Videos included.** This article is written from the official MOOC handout [209_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/209_handout.pdf) and transcripts of the four official videos, with formulas following the handout. The transcripts are machine transcripts made for this article (Whisper), not official captions, and no human has proofread them. The videos are taught in Mandarin; the slides are in English. Each section opens with its official video and the approximate time ranges. Page numbers refer to the number at the lower right of each slide (0/22 to 22/22), and wherever the text says "in the lecture" it is paraphrasing what is said in the video.

This is Techniques Lecture 9 in [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en). The Roadmap on page 1 of the handout divides Techniques into three ways of handling features, and this lecture belongs to the second, Combining Predictive Features: Aggregation Models. The summary of the previous lecture, [Techniques Lecture 8: AdaBoost](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-08-adaptive-boosting-en), on that same page is: re-weight each data point to get diverse hypotheses, then combine them linearly so that weak algorithms become strong. This lecture fills in the last kind of aggregation not yet covered: using different hypotheses under different conditions, where both the conditions and the hypotheses have to be learned from data.

The prerequisites are the classification of aggregation in [Techniques Lecture 7: Blending and Bagging](/posts/ai/2026-09-30-ntu-htlin-ml-blending-bagging-adaboost-en), the decision stump and AdaBoost-Stump from the previous lecture, and two tools from Foundations: [Foundations Lecture 14: Regularization](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-14-regularization-en) ($E_{\text{in}}$ plus $\lambda$ times a complexity term) and validation from [Foundations Lecture 15: Validation](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles-en). After reading, you should be able to write a tree in both the path form and the recursive form, compute every branching step of C&RT by hand on a small data set, prune the grown tree back one leaf at a time and choose $\lambda$, and say which step of the algorithm categorical features and missing values each change.

This lecture has few formulas. Its content is concentrated in one recursive algorithm and its four design choices:

1. **How many branches at a time**: C&RT chooses 2.
2. **What a leaf returns**: the constant that minimizes $E_{\text{in}}$.
3. **How to branch**: with a decision stump, picking the one that leaves the purest parts.
4. **When to stop**: when nothing more can be split, with pruning afterwards.

## What kind of hypothesis a decision tree is: aggregation that divides the work by condition

```youtube
url: https://www.youtube.com/watch?v=dAqPpAXnMJ4
title: Decision Tree :: Decision Tree Hypothesis @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–01:11 reviews the previous lecture, 01:11–04:01 is the aggregation table, 04:01–09:18 presents the path view with the MOOC-watching example, 09:18–12:22 the recursive view, 12:22–16:45 the pros and cons of decision trees, and Fun Time follows.)

### The last cell of the table

Page 2 of the handout collects Techniques Lectures 7 and 8 into one table. Aggregation has two aspects: blending means you already have some $g_t$ and only learn how to combine them; learning means you learn the $g_t$ and combine them at the same time. There are three ways to combine:

| aggregation type | blending (get $g_t$ first, then aggregate) | learning (aggregate while getting $g_t$) |
|---|---|---|
| uniform (one vote per $g_t$) | voting/averaging | Bagging |
| non-uniform (different numbers of votes) | linear | AdaBoost |
| conditional (a different $g_t$ depending on the situation) | stacking | **Decision Tree** |

The lower-right cell is this lecture. In the lecture, Lin describes that cell this way: different $g_t$ are to be used in different situations, and both those $g_t$ and the conditions for "which situation" have to be learned. The handout positions the decision tree as a traditional learning model that realizes conditional aggregation. The lecture adds some history: decision trees appeared very early, possibly even earlier than the term "machine learning", because they imitate how people make decisions, and they have been in continuous use in medicine and business.

### The tree for watching MOOC lectures: the path view

The example on page 3 of the handout is whether to watch online lectures after getting home from work. Written out in words, the tree on the slide is:

1. **The root** asks about the quitting time.
2. Earlier than 18:30: next ask whether there is a date. With a date, do not watch (N); without one, watch (Y).
3. Between 18:30 and 21:30: watch (Y).
4. Later than 21:30: next ask about the homework deadline. More than 2 days before the deadline, do not watch (N); more than 2 days past it, do not watch (N); in between, watch (Y).

The lecture goes through the reason for every branch: leaving work early with no date, a lecture goes well with dinner; after working very late, you sleep first if the deadline is still far away, and once it is more than two days overdue a large part of the score has already been deducted and watching will not help you catch up, so you only force yourself to watch when the deadline is close or has just passed.

This tree has 6 leaves (2 under the date node, 1 attached directly to the middle branch of the root, 3 under the deadline node), and therefore 6 paths from the root to a leaf. The handout writes it in aggregation form:

$$
G(\mathbf{x}) = \sum_{t=1}^{T} q_t(\mathbf{x}) \cdot g_t(\mathbf{x})
$$

- $g_t(\mathbf{x})$ is the base hypothesis, the leaf at the end of path $t$. Here every leaf is a constant (Y or N).
- $q_t(\mathbf{x}) = \llbracket \text{is } \mathbf{x} \text{ on path } t \text{?} \rrbracket$ is the condition: 1 when it holds and 0 when it does not.

Listing the 6 paths (the numbering is added by this article, following the slide from left to right):

| $t$ | condition $q_t(\mathbf{x})$ | leaf $g_t(\mathbf{x})$ |
|---|---|---|
| 1 | quitting time earlier than 18:30, and has a date | N |
| 2 | quitting time earlier than 18:30, and has no date | Y |
| 3 | quitting time between 18:30 and 21:30 | Y |
| 4 | quitting time later than 21:30, and more than 2 days before the deadline | N |
| 5 | quitting time later than 21:30, and within 2 days either side of the deadline | Y |
| 6 | quitting time later than 21:30, and more than 2 days past the deadline | N |

The bottom row of the slide shows only 5 leaves. The Y of path 3 is drawn one level higher, attached directly under the root, and it is easy to miss when counting. Writing every path as a row prevents that.

Every $\mathbf{x}$ reaches exactly one leaf, so exactly one of the six $q_t(\mathbf{x})$ is 1, and the sum is the value of that leaf. For example, if you leave work at 22:00 today and the homework is due tomorrow: $q_5 = 1$, the others are 0, and $G(\mathbf{x}) = g_5(\mathbf{x}) = $ Y.

Compare this with the previous two lectures. In Bagging and AdaBoost every $g_t$ votes on every $\mathbf{x}$, and the weights are fixed numbers. A decision tree's "weight" $q_t(\mathbf{x})$ changes with $\mathbf{x}$, and only one $g_t$ speaks each time.

The handout also notes on this page that a tree is usually with simple internal nodes. In the lecture, Lin explains that simplicity is prized throughout the world of decision trees: the simpler the test at an internal node the better, the simpler the decision at a leaf the better, and the complicated part is all buried in the links and paths between nodes. The lecture also mentions that a leaf does not have to be a constant, and that in practice people put simple models such as linear regression at the leaves; this lecture uses constants only.

### The recursive view: a tree is a root plus some sub-trees

Page 4 writes it another way. Take the tree apart at the root: the root has a branching criterion $b(\mathbf{x})$ whose value is an integer between 1 and $C$, telling you which branch to take; under each branch hangs a smaller tree $G_c$.

$$
G(\mathbf{x}) = \sum_{c=1}^{C} \llbracket b(\mathbf{x}) = c \rrbracket \cdot G_c(\mathbf{x})
$$

- $G(\mathbf{x})$: the full-tree hypothesis.
- $b(\mathbf{x})$: the branching criteria.
- $G_c(\mathbf{x})$: the sub-tree hypothesis at the $c$-th branch.

In the MOOC-watching example, $C = 3$, and $b(\mathbf{x})$ returns 1, 2, or 3 according to the quitting time; $G_1$ is the small two-leaf "has a date?" tree, $G_2$ is a single leaf Y, and $G_3$ is the small three-leaf "deadline?" tree. $G_1$ and $G_3$ can themselves be taken apart once more with the same formula.

The handout's note is tree = (root, sub-trees), just like what your data structure instructor would say. In the lecture, Lin calls this a recursive definition: a tree is defined in terms of several smaller trees. The two views describe the same function. The path view makes it easy to see that this is conditional aggregation, and the recursive view makes it easy to write an algorithm; the C&RT algorithm follows the recursive formula.

### Pros and cons, stated up front

Page 5 is titled Disclaimers about Decision Tree and lays out the practical reality of decision trees.

**Usefulness:**

- **human-explainable**, widely used in business and medical data analysis. The lecture uses a doctor's visit as the example: if the doctor says your medical record was mapped into an infinite-dimensional space, a fat boundary was found, and the result was mapped back, that is SVM, and the patient cannot follow it; if the doctor says this indicator of yours is above so much and that one is below so much, so the judgment is no cancer, the patient can follow.
- **simple**; the handout writes even freshmen can implement one. The lecture says this is actual experience: Lin teaches the freshman data structures course at NTU, and the homework for the unit on trees had students write a decision tree.
- **efficient in prediction and training**. The reason given in the lecture is that the computation is simple at internal nodes and leaves alike, and a few steps lead to the answer.

**However:**

- **heuristic**: mostly little theoretical explanations. The lecture is blunter: much of the reasoning in the algorithms is just "it seems natural", and there are many different discussions of why they work well.
- **heuristics (plural)**: one decision tree algorithm may contain five, six, or seven clever ideas from earlier people, and it is not very clear whether each should be used or what happens if it is changed, so beginners get a headache just choosing these settings.
- **arguably no single representative algorithm**. In the lecture, Lin explains that, unlike algorithms such as SVM and AdaBoost, decision trees usually have no single algorithm that is truly representative; some are more popular and some less, but the reason for popularity is sometimes only historical and does not mean the design is better.

The handout's conclusion is mostly heuristic but useful on its own. The lecture therefore says up front: there are more decision tree models than can be taught, and this course picks one version that is relatively simple and connects to the rest of the course; in practice you are quite likely to try other decision tree algorithms.

### Fun Time: reading code as a tree

**Question (page 6):** The following C-like code can be viewed as a decision tree of three leaves.

```c
if (income > 100000) return true;
else {
  if (debt > 50000) return false;
  else return true;
}
```

What is the output of the tree for (income, debt) = (98765, 56789)?

1. true
2. false
3. 98765
4. 56789

**Answer: 2.** Trace the code: 98765 is not greater than 100000, so go into the else; 56789 is greater than 50000, so return false. The lecture reads false as not issuing you the card: the income does not pass the threshold, and the debt exceeds its threshold. Choices 3 and 4 are numbers from the input, and the leaves of this tree only return true or false. Choice 1 appears only if you reach one of the other two leaves.

The handout's answer adds one sentence: the tree expresses a complicated boolean condition $\llbracket \text{income} > 100000 \text{ or } \text{debt} \le 50000 \rrbracket$.

An addition in this article: write it once in each view. The path view has three paths:

| $t$ | condition $q_t$ | leaf $g_t$ |
|---|---|---|
| 1 | income > 100000 | true |
| 2 | income ≤ 100000 and debt > 50000 | false |
| 3 | income ≤ 100000 and debt ≤ 50000 | true |

The input in the question gives $(q_1, q_2, q_3) = (0, 1, 0)$, and the output is $g_2$ = false. The paths that output true are paths 1 and 3, and together they are the "or" condition the handout writes. In the recursive view, $C = 2$: the root's $b$ looks at income, the sub-tree on one side is the single leaf true, and the sub-tree on the other side is the two-leaf tree that looks at debt. This tree comes back in the numerical example later.

## How to grow a tree from data: the four choices in C&RT

```youtube
url: https://www.youtube.com/watch?v=s9Um2O7N7YM
title: Decision Tree :: Decision Tree Algorithm @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–02:50 is the basic recursive algorithm, 02:50–05:21 the two simple choices in C&RT, 05:21–09:08 branching by purifying, 09:08–12:57 impurity functions, 12:57–14:46 the termination criteria, and Fun Time follows.)

### The skeleton of the recursive algorithm

The formula of the recursive view turns directly into an algorithm (page 7). The input is data $\mathcal{D} = \{(\mathbf{x}_n, y_n)\}_{n=1}^{N}$, and the output is a tree:

**DecisionTree($\mathcal{D}$):**

- If the termination criteria are met: return the base hypothesis $g_t(\mathbf{x})$.
- Else:
  1. Learn the branching criteria $b(\mathbf{x})$.
  2. Split $\mathcal{D}$ to $C$ parts: $\mathcal{D}_c = \{(\mathbf{x}_n, y_n) : b(\mathbf{x}_n) = c\}$.
  3. Build a sub-tree recursively for each part: $G_c \leftarrow$ DecisionTree($\mathcal{D}_c$).
  4. Return $G(\mathbf{x}) = \sum_{c=1}^{C} \llbracket b(\mathbf{x}) = c \rrbracket \, G_c(\mathbf{x})$.

In the lecture, Lin calls this a typical divide and conquer: separate the data, learn a small tree on each part, and join them back together. Lin also warns that if you write only steps 1 to 4, your data structures instructor will say you deserve a spanking, because the recursion has no stopping condition and the computer will go on forever.

This skeleton leaves four blanks, which the handout calls four choices: the number of branches $C$, how the branching criteria $b(\mathbf{x})$ are learned, when to stop (the termination criteria), and what a leaf returns (the base hypothesis). Each decision tree algorithm is one way of filling these four blanks. This lecture presents the Classification and Regression Tree, written C&RT in the handout; what is said aloud in the lecture is CART, and it refers to the same algorithm.

### Two simple choices: a binary tree, and the optimal constant at the leaves

Page 8 fills in the two easier blanks first.

**$C = 2$.** Every split makes only two parts, and what grows is a binary tree.

**$g_t(\mathbf{x})$ is the $E_{\text{in}}$-optimal constant**, where $E_{\text{in}}$ counts only the data that reach this leaf:

- binary/multiclass classification (0/1 error): the majority of $\{y_n\}$.
- regression (squared error): the average of $\{y_n\}$.

The handout gives only the conclusions, and the lecture only mentions that the one about the average is not hard to prove, without writing out the steps. Both are derived below (the derivations are added by this article).

**Classification.** The leaf has $N$ data points, of which $N_k$ belong to class $k$. If the leaf returns the constant $k$, the ones it gets wrong are the $N - N_k$ points of the other classes, and $E_{\text{in}} = (N - N_k)/N$. To make it smallest, choose the class with the largest $N_k$, written $y^*$. The error rate is then

$$
\frac{1}{N}\sum_{n=1}^{N} \llbracket y_n \ne y^* \rrbracket = 1 - \max_{1 \le k \le K} \frac{N_k}{N}
$$

**Regression.** When the leaf returns the constant $c$, $E_{\text{in}}(c) = \frac{1}{N}\sum_{n=1}^{N}(y_n - c)^2$. It is a quadratic function of $c$ that opens upward; differentiate with respect to $c$ and set the result to 0:

$$
\frac{dE_{\text{in}}}{dc} = -\frac{2}{N}\sum_{n=1}^{N}(y_n - c) = 0 \quad\Longrightarrow\quad \sum_{n=1}^{N} y_n = Nc \quad\Longrightarrow\quad c = \frac{1}{N}\sum_{n=1}^{N} y_n = \bar{y}
$$

For example, if the $y$ values at the leaf are 1, 2, 2: the average is $\frac{5}{3}$, and the total squared error is $\frac{4}{9} + \frac{1}{9} + \frac{1}{9} = \frac{2}{3}$. Returning 2 instead gives a total of $1 + 0 + 0 = 1$, and returning 1 gives $0 + 1 + 1 = 2$, both larger.

The same page carries a disclaimer: the C&RT here is based on selected components of CART™ of California Statistical Software. The lecture's explanation is that CART is that company's registered trademark, the algorithm they actually use is much more complicated, and the lecture presents only the more essential parts.

### Branching: purifying the data with a decision stump

Page 9 fills in the third blank. Since there are only two parts, the internal node uses the decision stump from the previous lecture: look at a single feature and make one cut at some threshold. Unlike the previous lecture, the stump here outputs 1 or 2 (which branch to take), and the handout calls it a $\{1, 2\}$-output decision stump.

There are many candidate stumps; which one should be picked? The lecture's reasoning runs like this: when the tree is cut all the way down, a leaf returns a constant. When is a constant a good prediction? When the data left there are very "pure", meaning the $y$ values are all the same (classification) or all close together (regression). So every branching step should make the two resulting parts as pure as possible, which the handout calls purifying:

$$
b(\mathbf{x}) = \operatorname*{argmin}_{\text{decision stumps } h(\mathbf{x})} \ \sum_{c=1}^{2} \lvert \mathcal{D}_c \text{ with } h \rvert \cdot \text{impurity}(\mathcal{D}_c \text{ with } h)
$$

$\mathcal{D}_c \text{ with } h$ is the $c$-th part of the data produced by stump $h$, $\lvert\cdot\rvert$ is the number of points, and impurity is smaller when the part is purer. Each part's impurity is multiplied by its own size and the products are added. The lecture explains the weighting: for the larger part, whether it is pure matters more; for the smaller part it matters less. The handout sums this page up as bi-branching by purifying.

### How impurity is measured

Page 10 gives four formulas in two columns.

**Left column: by $E_{\text{in}}$ of the optimal constant.** The idea in the lecture is direct: the tree returns a constant in the end, and how well that constant does is itself a statement of how pure the data are.

Regression error:

$$
\text{impurity}(\mathcal{D}) = \frac{1}{N}\sum_{n=1}^{N}(y_n - \bar{y})^2, \qquad \bar{y} = \text{average of } \{y_n\}
$$

Classification error:

$$
\text{impurity}(\mathcal{D}) = \frac{1}{N}\sum_{n=1}^{N} \llbracket y_n \ne y^* \rrbracket, \qquad y^* = \text{majority of } \{y_n\}
$$

**Right column: for classification specifically.** First rewrite the classification error; it is what was derived above,

$$
1 - \max_{1 \le k \le K} \frac{\sum_{n=1}^{N} \llbracket y_n = k \rrbracket}{N}
$$

The handout notes beside it optimal $k = y^*$ only. The lecture's explanation is that this formula looks only at the class with the largest proportion; with ten classes, how the other nine are distributed has no effect on the result. Replace the max with a sum over all classes, and square the proportions, and you have the Gini index:

$$
1 - \sum_{k=1}^{K} \left( \frac{\sum_{n=1}^{N} \llbracket y_n = k \rrbracket}{N} \right)^2
$$

The handout's note is all $k$ considered together. The reading given in the lecture: square each class's proportion and add them up; the larger this sum, the purer the data, and subtracting it from 1 makes it an impurity.

The handout says the popular choices are Gini for classification and regression error for regression. The lecture stresses that these are all heuristics you are free to choose.

This article adds three things the handout does not write but which a little computation shows. Write the proportion of class $k$ as $p_k$.

1. **The range of Gini.** With only one class, $p_k = 1$ and Gini is $1 - 1 = 0$. With $K$ classes each taking $\frac{1}{K}$, Gini is $1 - K \cdot \frac{1}{K^2} = 1 - \frac{1}{K}$, which is its maximum; with two classes the maximum is $\frac{1}{2}$.
2. **Another way to write Gini.** Because $\sum_k p_k = 1$, we have $1 - \sum_k p_k^2 = \sum_k p_k - \sum_k p_k^2 = \sum_k p_k(1 - p_k)$. Each class contributes "the proportion that is this class" times "the proportion that is not this class".
3. **What the weighted sum means.** Both impurities in the left column are an $E_{\text{in}}$, that is, "total error divided by the number of points". Multiplying back by the size $\lvert\mathcal{D}_c\rvert$ gives the total error: for classification, how many points of this part a majority vote gets wrong; for regression, the total squared error. So with these two impurities, the branching criterion is the same as minimizing the overall number of mistakes (or the total squared error) after "one cut, with one optimal constant on each side". Gini has no such direct correspondence; it is a separately designed quantity. The numerical example below shows that the two can pick different splits.

### Termination: the two cases where the algorithm is forced to stop

Page 11 fills in the last blank. C&RT sets no extra stopping rule and stops only when it cannot go on. The handout calls this 'forced' to terminate:

- **All $y_n$ the same.** The impurity is already 0, and further cuts cannot make it purer. Return $g_t(\mathbf{x}) = y_n$ directly; this leaf makes no mistakes.
- **All $\mathbf{x}_n$ the same.** No stump can separate them; the lecture says there is simply nowhere to put the knife.

A tree grown until it is forced to stop is called a fully-grown tree. All four blanks are now filled, and the handout writes C&RT in one sentence: fully-grown tree with constant leaves that come from bi-branching by purifying.

An addition in this article: this recursion always stops. Every branching step splits the data into two parts, neither of them empty (the threshold is placed between two different feature values), so each part has fewer points than before, and at the slowest it shrinks to a single point, whose $y$ is of course "all the same". There are at most $N$ leaves and at most $N - 1$ internal nodes.

### Numerical example: 14 data points, growing the tree to the end

What follows is an example made up for this article, not from the slides. The setting continues the card-issuing decision from Fun Time, with the unit changed to ten thousands: $x_1$ is annual income, $x_2$ is debt, $y = +1$ means the card is approved, and $y = -1$ means it is not.

| $n$ | $x_1$ (income) | $x_2$ (debt) | $y$ |  | $n$ | $x_1$ (income) | $x_2$ (debt) | $y$ |
|---|---|---|---|---|---|---|---|---|
| 1 | 2 | 3 | $+1$ |  | 8 | 4 | 7 | $-1$ |
| 2 | 4 | 1 | $+1$ |  | 9 | 2 | 9 | $-1$ |
| 3 | 6 | 3 | $+1$ |  | 10 | 6 | 9 | $-1$ |
| 4 | 8 | 1 | $+1$ |  | 11 | 8 | 7 | $-1$ |
| 5 | 12 | 1 | $+1$ |  | 12 | 12 | 7 | $+1$ |
| 6 | 12 | 3 | $+1$ |  | 13 | 14 | 7 | $+1$ |
| 7 | 14 | 1 | $-1$ |  | 14 | 14 | 9 | $+1$ |

There are 9 points with $+1$ and 5 with $-1$. The impurity is Gini. With two classes, a part with $a$ points of $+1$ and $b$ points of $-1$ has Gini $1 - \big(\frac{a}{a+b}\big)^2 - \big(\frac{b}{a+b}\big)^2 = \frac{2ab}{(a+b)^2}$, and after multiplying by the size $a + b$ it is $\frac{2ab}{a+b}$. All the tables below are computed with this formula.

**Candidate splits at the root.** The income values that occur are 2, 4, 6, 8, 12, 14; put one threshold (the midpoint) between each pair of adjacent values, 5 in all. The debt values that occur are 1, 3, 7, 9, giving 3 thresholds. Wherever a threshold sits between two adjacent values, the two resulting parts are the same, so only these 8 splits need to be considered:

| split | the "≤" part ($+1$ / $-1$) | the ">" part ($+1$ / $-1$) | weighted impurity |
|---|---|---|---|
| $x_1 \le 3$ | 1 / 1 | 8 / 4 | $1 + \frac{16}{3} = 6.333$ |
| $x_1 \le 5$ | 2 / 2 | 7 / 3 | $2 + \frac{21}{5} = 6.200$ |
| $x_1 \le 7$ | 3 / 3 | 6 / 2 | $3 + 3 = 6.000$ |
| $x_1 \le 10$ | 4 / 4 | 5 / 1 | $4 + \frac{5}{3} = 5.667$ |
| $x_1 \le 13$ | 7 / 4 | 2 / 1 | $\frac{56}{11} + \frac{4}{3} = 6.424$ |
| $x_2 \le 2$ | 3 / 1 | 6 / 4 | $\frac{3}{2} + \frac{24}{5} = 6.300$ |
| $x_2 \le 5$ | 6 / 1 | 3 / 4 | $\frac{12}{7} + \frac{24}{7} = 5.143$ |
| $x_2 \le 8$ | 8 / 3 | 1 / 2 | $\frac{48}{11} + \frac{4}{3} = 5.697$ |

Take the $x_2 \le 5$ row as the example: the points with debt 1 or 3 are points 1 to 7, 6 with $+1$ and 1 with $-1$, giving $\frac{2 \times 6 \times 1}{7} = \frac{12}{7}$; the points with debt 7 or 9 are points 8 to 14, 3 with $+1$ and 4 with $-1$, giving $\frac{2 \times 3 \times 4}{7} = \frac{24}{7}$. The sum is $\frac{36}{7} \approx 5.143$, the smallest of the 8 splits. Without a split, the value for the whole data set is $\frac{2 \times 9 \times 5}{14} = \frac{45}{7} \approx 6.429$. The root chooses $x_2 \le 5$.

**The part with debt ≤ 5 (points 1 to 7).** It has 6 points with $+1$ and 1 with $-1$; the $y$ values are not all the same, so keep splitting. The only $-1$ is point 7, $(14, 1)$, whose income is the highest in this part. Split at $x_1 \le 13$: one side is the 6 points with $+1$ and the other is point 7 alone, the impurity is 0 on both sides, and the weighted sum is 0. Every other split leaves at least one $+1$ on the same side as point 7, so its weighted sum is greater than 0 (for example, $x_1 \le 10$ gives $0 + \frac{2 \times 2 \times 1}{3} = \frac{4}{3}$, and $x_2 \le 2$ gives $\frac{2 \times 3 \times 1}{4} + 0 = \frac{3}{2}$). Choose $x_1 \le 13$. After the split the $y$ values on each side are all the same, so stop.

**The part with debt > 5 (points 8 to 14).** The 4 points with $-1$ have incomes 2, 4, 6, 8, and the 3 points with $+1$ have incomes 12, 14, 14. Split at $x_1 \le 10$: one side has the 4 points with $-1$ and the other the 3 points with $+1$, and the weighted sum is 0. Choose it, and both sides stop.

**The fully-grown tree** has 3 internal nodes and 4 leaves:

1. Debt ≤ 5?
   - Yes: income ≤ 13?
     - Yes → approve (6 points, all $+1$)
     - No → do not approve (1 point, point 7)
   - No: income ≤ 10?
     - Yes → do not approve (4 points, all $-1$)
     - No → approve (3 points, all $+1$)

**What this result means.** All 14 points are classified correctly, so $E_{\text{in}} = 0$. Converted to units of ten thousand, the Fun Time input is $(9.8765, 5.6789)$: the debt is greater than 5 and the income does not exceed 10, so it reaches "do not approve", the same as the Fun Time answer false. But this tree has one leaf held up by a single data point: "someone whose debt is not high but whose income is above 130,000 is not approved". That rule goes against common sense. It looks more like something is wrong with point 7 itself (noise), yet the tree made one more cut just to classify it correctly. This is what pruning has to deal with.

**What happens with classification error instead.** Take the same 8 splits and use classification error as the impurity; the weighted sum is then "how many points are wrong in total when each side uses a majority vote". $x_2 \le 5$ gets $1 + 3 = 4$ points wrong, $x_2 \le 8$ also gets $3 + 1 = 4$ wrong, and the other 6 all get 5 wrong, the same as not splitting at all (5 of the 14 points are $-1$, and guessing $+1$ for everything gets 5 wrong). Classification error cannot tell $x_2 \le 5$ from $x_2 \le 8$, nor can it see that $x_1 \le 10$ cuts out a part that is 5 to 1. Gini counts the proportion of every class, and the scores of these three splits are 5.143, 5.697, and 5.667, which can be ranked. This is what the handout's note "all $k$ considered together" looks like in actual numbers.

### Fun Time: the Gini index for two classes

**Question (page 12):** For the Gini index, $1 - \sum_{k=1}^{K} \Big( \frac{\sum_{n=1}^{N} \llbracket y_n = k \rrbracket}{N} \Big)^2$. Consider $K = 2$, and let $\mu = \frac{N_1}{N}$, where $N_1$ is the number of examples with $y_n = 1$. Which of the following formula of $\mu$ equals the Gini index in this case?

1. $2\mu(1 - \mu)$
2. $2\mu^2(1 - \mu)$
3. $2\mu(1 - \mu)^2$
4. $2\mu^2(1 - \mu)^2$

**Answer: 1.** The proportions of the two classes are $\mu$ and $1 - \mu$. Substitute:

$$
1 - \mu^2 - (1 - \mu)^2 = 1 - \mu^2 - 1 + 2\mu - \mu^2 = 2\mu - 2\mu^2 = 2\mu(1 - \mu)
$$

The handout's answer only says to simplify $1 - (\mu^2 + (1 - \mu)^2)$ and the answer should pop up. The other three choices can be ruled out by plugging in one number: at $\mu = \frac{1}{2}$ Gini is $1 - \frac{1}{4} - \frac{1}{4} = \frac{1}{2}$, and the four choices are $\frac{1}{2}$, $\frac{1}{4}$, $\frac{1}{4}$, and $\frac{1}{8}$, so only choice 1 is right. Choices 2 and 3 have one more visible problem: swapping the names of the two classes (replacing $\mu$ with $1 - \mu$) should not change the impurity, but these two formulas do change.

The $\frac{2ab}{(a+b)^2}$ used in the numerical example is the result of this question, with $\mu = \frac{a}{a+b}$.

## A fully-grown tree needs pruning, and categorical features and missing values fit in too

```youtube
url: https://www.youtube.com/watch?v=uvGC_Y0EYiA
title: Decision Tree :: Decision Tree Heuristics in C&RT @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–01:26 reviews C&RT and discusses multiclass, 01:26–07:10 is pruning, 07:10–09:51 categorical features, 09:51–12:44 missing values and the surrogate branch, and Fun Time follows.)

### One algorithm, three kinds of problems

Page 13 puts the four choices back into the skeleton to get the complete C&RT: if it cannot branch anymore, return the $E_{\text{in}}$-optimal constant; otherwise learn a stump by purifying, split the data to 2 parts, recurse on each side, and join the results.

On this page the handout stresses that it can easily handle binary classification, regression, & multi-class classification. The lecture gives the reason: going from binary classification to multiclass, only two places in the algorithm are affected, the constant at a leaf (it becomes the majority among several classes) and the computation of impurity (Gini was written for $K$ classes to begin with). In the lecture, Lin says multiclass is almost as easy for it as binary classification, which makes the decision tree a rather special algorithm. An addition in this article: comparing pages 8 and 10, switching to regression changes the same two places, the constant becomes the average and the impurity becomes the regression error; the three steps of branching, splitting the data, and recursing do not change at all.

### Pruning: regularizing on the number of leaves

Page 14 starts by pointing out the problem with a fully-grown tree:

- As long as all $\mathbf{x}_n$ are different, $E_{\text{in}}(G) = 0$.
- But it overfits (large $E_{\text{out}}$), because the low-level sub-trees are built with very little data $\mathcal{D}_c$.

This article supplies the reason for the first point: as long as a node still holds two data points with different $y$, their $\mathbf{x}$ are different, so at least one feature has different values for them, and a threshold halfway between those two values on that feature is a usable stump, so the algorithm does not stop. Therefore every leaf where it does stop holds identical $y$, and every data point is classified correctly.

The lecture raises this question from a student's point of view: cutting this way, the data can always be completely separated, and $E_{\text{in}}$ is always 0; recalling the theory in [Foundations Lecture 7: The VC Dimension](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error-en), being able to reach $E_{\text{in}} = 0$ every time is not good news, because it means the VC dimension is infinite and the model complexity is not under control. Also, the further down the cuts go, the less data each node has, and a decision made on so little data is quite likely overfitting. The single-point leaf in the numerical example is exactly this situation.

The remedy is the approach taught in [Foundations Lecture 14: Regularization](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-14-regularization-en), which needs a quantity that measures how complex a tree is. The lecture's reasoning: a tree is too complex because too many cuts were made, and too many cuts mean too many leaves, so use the number of leaves:

$$
\Omega(G) = \text{NumberOfLeaves}(G)
$$

What we want is a regularized decision tree:

$$
\operatorname*{argmin}_{\text{all possible } G} \ E_{\text{in}}(G) + \lambda\,\Omega(G)
$$

The handout says the resulting tree is called a pruned decision tree. The lecture explains that to prune is to cut back or trim: do not let the tree grow to its full height, trim it shorter with fewer leaves, in the hope that such a tree overfits less.

The trouble is "all possible $G$". One run of C&RT produces only one tree, and listing every possible split and every possible tree structure is computationally out of reach. The handout's approach is to consider only one sequence of trees:

- $G^{(0)}$ = the fully-grown tree.
- $G^{(i)} = \operatorname*{argmin}_{G} E_{\text{in}}(G)$, such that $G$ is one-leaf removed from $G^{(i-1)}$.

The lecture is more concrete: suppose the fully-grown tree has 10 leaves; try taking off each leaf in turn and see which 9-leaf tree has the smallest $E_{\text{in}}$, and that is $G^{(1)}$; then start from $G^{(1)}$ and take off a second leaf to get $G^{(2)}$, and continue all the way down. "Taking off a leaf" means merging it with the neighbouring leaf, and after the merge the new leaf has its constant recomputed. This way a 10-leaf tree produces only about 10 candidate trees, and $E_{\text{in}} + \lambda\Omega$ is then used to choose among them. In the lecture, Lin explains that these are probably good enough trees, and choosing among them is sufficient.

What remains is how to set $\lambda$. The handout has only one line: systematic choice of $\lambda$? validation. That is the approach of [Foundations Lecture 15: Validation](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles-en): treat $\lambda$ as a parameter and choose it with a validation set.

### Numerical example, continued: pruning that tree back

This part is also made up for this article. Start from the 4-leaf tree grown from the 14 data points above; it is $G^{(0)}$.

The handout does not specify how to remove a leaf when "the neighbour is not a leaf". The reading this article adopts is: find an internal node whose two children are both leaves and merge those two leaves into one, which reduces the number of leaves by 1.

**$G^{(0)} \to G^{(1)}$.** Two internal nodes qualify:

- Merge the two leaves under "income ≤ 13?": together they have 6 points with $+1$ and 1 with $-1$, the new leaf returns $+1$, and 1 more point is wrong. $E_{\text{in}} = \frac{1}{14}$.
- Merge the two leaves under "income ≤ 10?": together they have 3 points with $+1$ and 4 with $-1$, the new leaf returns $-1$, and 3 more points are wrong. $E_{\text{in}} = \frac{3}{14}$.

The smaller $E_{\text{in}}$ is the first, so $G^{(1)}$ is: approve if debt ≤ 5; otherwise look at income, do not approve if ≤ 10 and approve if > 10.

**$G^{(1)} \to G^{(2)}$.** Only "income ≤ 10?" is left to merge, and after merging $E_{\text{in}} = \frac{1 + 3}{14} = \frac{4}{14}$. $G^{(2)}$ has only the root: approve if debt ≤ 5, otherwise do not approve.

**$G^{(2)} \to G^{(3)}$.** Merge the two leaves of the root: 9 points with $+1$ and 5 with $-1$, return $+1$, $E_{\text{in}} = \frac{5}{14}$. $G^{(3)}$ is a single leaf: always approve.

Next compute $E_{\text{in}} + \lambda\Omega$ for different $\lambda$, with the smallest in each column in bold:

| tree | number of leaves $\Omega$ | $E_{\text{in}}$ | $\lambda = 0.03$ | $\lambda = 0.1$ | $\lambda = 0.2$ |
|---|---|---|---|---|---|
| $G^{(0)}$ | 4 | $0$ | **0.120** | 0.400 | 0.800 |
| $G^{(1)}$ | 3 | $\frac{1}{14} \approx 0.071$ | 0.161 | **0.371** | 0.671 |
| $G^{(2)}$ | 2 | $\frac{4}{14} \approx 0.286$ | 0.346 | 0.486 | 0.686 |
| $G^{(3)}$ | 1 | $\frac{5}{14} \approx 0.357$ | 0.387 | 0.457 | **0.557** |

A very small $\lambda$ keeps the fully-grown tree, a very large $\lambda$ prunes down to a single leaf, and a $\lambda$ in between selects $G^{(1)}$. The boundaries can be solved directly: $G^{(1)}$ beats $G^{(0)}$ when $\frac{1}{14} + 3\lambda < 4\lambda$, that is, $\lambda > \frac{1}{14}$; $G^{(1)}$ beats $G^{(3)}$ when $\frac{1}{14} + 3\lambda < \frac{5}{14} + \lambda$, that is, $\lambda < \frac{1}{7}$. $G^{(2)}$ is never the smallest under any $\lambda$: it has one leaf fewer than $G^{(1)}$ but its $E_{\text{in}}$ is $\frac{3}{14}$ higher, so it pays off only when $\lambda > \frac{3}{14}$; yet when $\lambda$ is that large, $G^{(3)}$, with one leaf fewer still and an $E_{\text{in}}$ only $\frac{1}{14}$ higher, pays off more.

**Choosing $\lambda$ with validation.** Suppose another 10 data points were held out and took no part in training (also made up):

| $(x_1, x_2)$ | $y$ |  | $(x_1, x_2)$ | $y$ |
|---|---|---|---|---|
| $(3, 2)$ | $+1$ |  | $(9, 6)$ | $-1$ |
| $(7, 4)$ | $+1$ |  | $(11, 8)$ | $+1$ |
| $(15, 2)$ | $+1$ |  | $(15, 6)$ | $+1$ |
| $(13, 4)$ | $+1$ |  | $(3, 6)$ | $-1$ |
| $(5, 8)$ | $-1$ |  | $(10, 2)$ | $+1$ |

The mistakes of the four trees on these 10 points:

| tree | points it gets wrong | $E_{\text{val}}$ |
|---|---|---|
| $G^{(0)}$ | $(15, 2)$: debt ≤ 5 and income > 13, judged "do not approve" by the single-point leaf | $\frac{1}{10}$ |
| $G^{(1)}$ | none | $0$ |
| $G^{(2)}$ | $(11, 8)$, $(15, 6)$: debt > 5 is never approved | $\frac{2}{10}$ |
| $G^{(3)}$ | $(5, 8)$, $(9, 6)$, $(3, 6)$: always approve | $\frac{3}{10}$ |

The smallest $E_{\text{val}}$ belongs to $G^{(1)}$, which corresponds to every value in $\frac{1}{14} < \lambda < \frac{1}{7}$, for example $\lambda = 0.1$.

**What this result means.** $G^{(0)}$, with $E_{\text{in}} = 0$, does worse on new data than $G^{(1)}$, with $E_{\text{in}} = \frac{1}{14}$, and the difference is the leaf that grew for the sake of point 7. The first pruning step removes exactly that leaf: taking it off costs only 1 more mistake, while taking off the other side costs 3 more, and the handout's argmin gives up the cheapest leaf first. The condition under which $G^{(1)}$ approves is "debt ≤ 5, or income > 10", the same boolean condition the Fun Time tree expresses (with the unit changed to ten thousands), except that it asks about debt first and income second. Two trees with different structures can be the same function.

The data in this example were designed so that every step can be computed by hand, and a validation set of only 10 points is far from enough in a real problem; it demonstrates the procedure and cannot serve as evidence of how well C&RT performs.

### Categorical features: replacing the threshold with a subset

Page 15 handles another kind of input. So far the features have all been numbers (numerical features), for example blood pressure 130, 98, 115, 147, 120, and cutting at some threshold with a decision stump is natural:

$$
b(\mathbf{x}) = \llbracket x_i \le \theta \rrbracket + 1, \qquad \theta \in \mathbb{R}
$$

When the bracket holds, $b(\mathbf{x}) = 2$; when it does not, $b(\mathbf{x}) = 1$.

But a feature can also be a category (categorical features), for example a major symptom that is one of fever, pain, tired, sweaty. The lecture points out that such features are troublesome for linear models: a linear model ends up computing a weighted score, so its inputs had better be numbers to begin with, and categories have no order of magnitude. For a decision tree only the "how to cut" step is affected, and it is enough to replace the threshold with a subset, which the handout calls a decision subset:

$$
b(\mathbf{x}) = \llbracket x_i \in S \rrbracket + 1, \qquad S \subset \{1, 2, \dots, K\}
$$

The lecture's example is the weather: sunny or cloudy goes one way, rainy the other. The method is to enumerate all subsets and see which split is best; the rest of the algorithm does not change. The handout's conclusion is that C&RT (& general decision trees) handles categorical features easily.

An addition in this article: how many subsets have to be tried? $K$ categories have $2^K$ subsets; removing the empty set and the full set (they do not separate the data) leaves $2^K - 2$; $S$ and its complement produce the same two parts with the numbering swapped, so there are $\frac{2^K - 2}{2} = 2^{K-1} - 1$ distinct splits. That is 7 for $K = 4$ and 511 for $K = 10$, so the cost of enumeration rises quickly as the number of categories grows.

**A small example (made up for this article).** 12 patients, with the major symptom as the only feature, and $y = +1$ meaning a diagnosis of some disease:

| symptom | number with $+1$ | number with $-1$ |
|---|---|---|
| fever | 3 | 0 |
| pain | 1 | 2 |
| tired | 0 | 3 |
| sweaty | 2 | 1 |

The weighted Gini of the 7 splits (again with $\frac{2ab}{a+b}$):

| $S$ | the $S$ part ($+1$ / $-1$) | the other part ($+1$ / $-1$) | weighted impurity |
|---|---|---|---|
| {fever, sweaty} | 5 / 1 | 1 / 5 | $\frac{5}{3} + \frac{5}{3} = 3.333$ |
| {fever} | 3 / 0 | 3 / 6 | $0 + 4 = 4.000$ |
| {tired} | 0 / 3 | 6 / 3 | $0 + 4 = 4.000$ |
| {fever, pain} | 4 / 2 | 2 / 4 | $\frac{8}{3} + \frac{8}{3} = 5.333$ |
| {pain} | 1 / 2 | 5 / 4 | $\frac{4}{3} + \frac{40}{9} = 5.778$ |
| {sweaty} | 2 / 1 | 4 / 5 | $\frac{4}{3} + \frac{40}{9} = 5.778$ |
| {fever, tired} | 3 / 3 | 3 / 3 | $3 + 3 = 6.000$ |

The best is $S = \{\text{fever}, \text{sweaty}\}$. Cutting out fever alone gives one completely pure part, but the remaining 9 people are 3 to 6, and overall that is worse than moving sweaty over as well. The worst, {fever, tired}, puts the symptom leaning most toward $+1$ and the one leaning most toward $-1$ on the same side, and the result is the same as not splitting (the value for 12 people at 6 to 6 is also 6).

### Missing values: storing substitute splits during training

The scenario on page 16: the best branch at some node is $b(\mathbf{x}) = \llbracket \text{weight} \le 50\text{kg} \rrbracket$, but at prediction time this patient has no weight on record.

The handout first asks what a human would do: go get the weight; or use a threshold on height instead, because threshold on height ≈ threshold on weight. The lecture turns it into an emergency-room scene: a patient is brought in and nobody weighed them, but a decision still has to be made about treatment and dosage. If there is time, weigh them; if not, estimate the height by eye. People weighing 50 kg or less are roughly 155 cm or shorter, so the cut that was meant to be on weight is made on height instead. The number 155 is an example given aloud in the lecture and is not in the handout.

C&RT builds this idea into the algorithm and calls it the surrogate branch:

- **During training**, besides the best branch $b(\mathbf{x})$, maintain several surrogate branches $b_1(\mathbf{x}), b_2(\mathbf{x}), \dots$, which use other features and whose results are close to those of $b(\mathbf{x})$.
- **During prediction**, when the feature $b(\mathbf{x})$ needs is missing, use a surrogate branch instead.

In the lecture, Lin explains that a surrogate is a stand-in, put simply a substitute; how the substitute is found comes down, broadly, to how similar the parts it produces are to the parts produced by the original split. The handout's conclusion is C&RT: handles missing features easily. The lecture adds in passing that this has to do with the character of decision trees: the algorithm is heuristic to begin with, so adding one more heuristic for a practical problem like incomplete data is easy.

**A small example (made up for this article).** The handout gives no formula for "how similar", so the most direct measure is used here: how many training points the surrogate branch and the best branch send to the same side. The weight (kg) and height (cm) of 8 patients:

| patient | weight | height | weight ≤ 50? |
|---|---|---|---|
| A | 42 | 148 | yes |
| B | 45 | 151 | yes |
| C | 47 | 153 | yes |
| D | 50 | 163 | yes |
| E | 53 | 157 | no |
| F | 60 | 162 | no |
| G | 66 | 165 | no |
| H | 72 | 170 | no |

The candidate surrogate branches are "height ≤ θ", with θ at the midpoints of adjacent heights:

| θ | number sent to the same side as "weight ≤ 50" | patients sent to the wrong side |
|---|---|---|
| 149.5 | 5 | B, C, D |
| 152 | 6 | C, D |
| 155 | 7 | D |
| 159.5 | 6 | D, E |
| 162.5 | 5 | D, E, F |
| 164 | 6 | E, F |
| 167.5 | 5 | E, F, G |

The most similar is "height ≤ 155", which agrees on 7 of the 8 patients; only D, who is taller and thinner, is sent to the other side. During training it is stored as this node's $b_1(\mathbf{x})$. At prediction time, a patient arrives with no weight and a height of 150 cm, so $b_1$ is used: 150 ≤ 155, and the patient goes to the "weight ≤ 50" side.

### Fun Time: how to read a decision subset

**Question (page 17):** For a categorical branching criteria $b(\mathbf{x}) = \llbracket x_i \in S \rrbracket + 1$ with $S = \{1, 6\}$. Which of the following is the explanation of the criteria?

1. if $i$-th feature is of type 1 **or** type 6, branch to first sub-tree; else branch to second sub-tree
2. if $i$-th feature is of type 1 **or** type 6, branch to second sub-tree; else branch to first sub-tree
3. if $i$-th feature is of type 1 **and** type 6, branch to second sub-tree; else branch to first sub-tree
4. if $i$-th feature is of type 1 **and** type 6, branch to first sub-tree; else branch to second sub-tree

**Answer: 2.** Two things have to be checked. First, $x_i \in S$ means $x_i$ equals some element of $S$; the handout's answer notes that "$\in S$" is an "or"-style condition on the elements of S in human language. A feature has only one value at a time and cannot be both type 1 and type 6, so the conditions in choices 3 and 4 never hold. Second, when the bracket holds its value is 1, and adding 1 gives $b(\mathbf{x}) = 2$, the second sub-tree; when it does not hold, $b(\mathbf{x}) = 0 + 1 = 1$, the first sub-tree. Choice 1 gets these two numbers the wrong way round.

When the lecture goes over this question, what is said is that you go right when the condition holds and left when it does not, treating the second sub-tree as the one on the right. But earlier in the same video, in the missing-value example, what is said aloud is that 50 kg or less goes left. Left and right are only a spoken habit of drawing trees, and the two passages are not consistent; the handout's formula has no left or right, only numbers: 2 when the bracket holds and 1 when it does not. For exercises and for code, go by the formula. The numerical examples in this article state directly what follows when a condition holds and when it does not, to avoid confusion.

## What it looks like when it runs: side by side with AdaBoost-Stump

```youtube
url: https://www.youtube.com/watch?v=ryWTrPPbqcg
title: Decision Tree :: Decision Tree in Action @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–03:24 is the step-by-step demonstration on simple data, 03:24–05:10 complicated data, 05:10–06:39 the specialties of C&RT and C4.5, 06:39–07:07 Fun Time, and the summary follows.)

### A simple data set: one cut at a time

Page 18 demonstrates on a two-dimensional binary classification data set; 5 circles and 5 crosses can be counted in the figure. The handout breaks the process into a series of figures, which in words are:

1. **The first cut** is a vertical line toward the left. The left side holds only 2 circles and is already pure; the right side is still mixed, so keep cutting.
2. **The second cut** is a vertical line inside the right region, leaving 3 crosses between the two cuts.
3. **The third cut** is again a vertical line, just to the right of the second, enclosing a narrow strip that contains 2 circles.
4. **The fourth cut** switches to a horizontal line and cuts only the rightmost region: 1 circle above, 2 crosses below.

The lecture explains the recursive structure while cutting: after each cut, each side has to grow a small tree of its own before being joined back. At the fourth cut Lin remarks that the first three cuts were all vertical, and this time the algorithm takes a look and finds that a horizontal cut is easier. After four cuts all 5 regions are pure and there is nowhere left to cut; each region returns its own constant (the handout's figure colours the circle regions blue and the cross regions red), and they are joined back level by level into the whole tree.

The last figure puts C&RT side by side with AdaBoost-Stump from the previous lecture. Both use horizontal and vertical lines, and the difference is in the extent of those lines. The lecture's explanation: every stump of AdaBoost-Stump votes over the entire plane, so every cut it makes runs across or down the whole plane; a C&RT cut is made under a condition, for example the fourth cut exists only under the condition "already in the rightmost region" and does not extend into other regions. Under this figure the handout writes C&RT: 'divide-and-conquer'.

### A complicated data set: conditional cuts are more economical

Page 19 switches to a data set with many points and a curved boundary. The lecture compares the two with an animation, each adding 10 cuts at a time:

- **AdaBoost-Stump**, after 10 rounds, already shows the rough shape of the curved boundary, and every further 10 rounds fine-tunes the boundary.
- **C&RT** cuts downward recursively. The first 10 cuts decide only whether a few regions are circles or crosses, and the other regions are still undecided; with every further 10 cuts, more and more regions are decided. By the fourth advance the whole tree is finished, and the boundary has that same curved shape. In the lecture, Lin says some places in the figure look less than perfect only because of the plotting resolution.

What the handout shows on this page is the final result on both sides, with the AdaBoost-Stump figure labelled t = 90, and the conclusion is C&RT: even more efficient than AdaBoost-Stump. The lecture explains why: C&RT cuts under all sorts of different conditions and can cut more finely, unlike AdaBoost-Stump, where every cut has to be a complete horizontal or vertical line.

This article adds one way of looking at it: this matches the formula of the path view. AdaBoost's $G$ is a weighted sum of all the $g_t$, and every $g_t$ acts on every $\mathbf{x}$; a decision tree's $q_t(\mathbf{x})$ lets each leaf look after only its own region. To fix the boundary in one corner of the plane, the tree only needs one more cut in that corner.

### The five specialties of C&RT

Page 20 lists the practical specialties in five points:

- human-explainable.
- multiclass easily.
- categorical features easily.
- missing features easily.
- efficient non-linear training (and testing).

The handout continues: almost no other learning model shares all such specialties, except for other decision trees. The lecture uses SVM for contrast: SVM can be non-linear, but it is comparatively less efficient, and handling categorical data with it is not easy.

The same page mentions another popular decision tree algorithm, C4.5, with different choices of heuristics. In the lecture, Lin explains that C&RT made its own design at several key points, C4.5 made different decisions at those points, and so it became another algorithm. This is the "no single representative algorithm" from the discussion of pros and cons.

### Fun Time: what C&RT lacks without pruning

**Question (page 21):** Which of the following is **not** a specialty of C&RT without pruning?

1. handles missing features easily
2. produces explainable hypotheses
3. achieves low $E_{\text{in}}$
4. achieves low $E_{\text{out}}$

**Answer: 4.** The handout's answer: the first two choices are easy; the third comes from the fact that fully grown C&RT greedily minimizes $E_{\text{in}}$ (almost always to 0); but as you may imagine, overfitting may happen and $E_{\text{out}}$ may not always be low. The lecture says the same: without pruning the tree just keeps growing, $E_{\text{in}}$ is very low, and $E_{\text{out}}$ not necessarily so.

The numerical example walks through all four choices. Choice 3: $G^{(0)}$ has $E_{\text{in}} = 0$. Choice 4: it gets 1 point wrong on the validation data, worse than the pruned $G^{(1)}$. Choice 1 relies on the surrogate branch and choice 2 on the structure of the tree itself, and neither has anything to do with whether the tree is pruned.

The summary on page 22 reduces each of the four sections to one line: the decision tree hypothesis expresses path-conditional aggregation; the algorithm is recursive branching until termination to base; the heuristics in C&RT are pruning, categorical branching, and surrogate; in action it is explainable and efficient. At this point the lecture says that the basic aggregation models have all been covered. The preview of the next lecture is aggregation of aggregation: combining the aggregation models learned in these lectures once more.

## Self-check

**1. A node holds 10 data points, with 5, 3, and 2 points in three classes. Compute the Gini index and the classification error. If this node is a leaf, what does it return?**

Answer: the proportions are 0.5, 0.3, 0.2. Gini is $1 - (0.25 + 0.09 + 0.04) = 0.62$. The classification error is $1 - 0.5 = 0.5$. The leaf returns the first class (the majority). You can check the upper bound along the way: the maximum Gini for three classes is $1 - \frac{1}{3} \approx 0.667$, and 0.62 is already very close, which means this data is quite impure.

**2. A regression problem with one feature and 5 data points $(x, y)$: $(1, 1)$, $(2, 2)$, $(3, 2)$, $(4, 8)$, $(5, 9)$. Using regression error as the impurity, where does the root of C&RT split? What does each of the two leaves return?**

Answer: the weighted impurity of each of the four splits is the sum of the total squared errors on the two sides.

| split | the "≤" part: average, total squared error | the ">" part: average, total squared error | total |
|---|---|---|---|
| $x \le 1.5$ | $1$, $0$ | $\frac{21}{4}$, $\frac{171}{4}$ | $42.75$ |
| $x \le 2.5$ | $\frac{3}{2}$, $\frac{1}{2}$ | $\frac{19}{3}$, $\frac{86}{3}$ | $29.17$ |
| $x \le 3.5$ | $\frac{5}{3}$, $\frac{2}{3}$ | $\frac{17}{2}$, $\frac{1}{2}$ | $1.17$ |
| $x \le 4.5$ | $\frac{13}{4}$, $\frac{123}{4}$ | $9$, $0$ | $30.75$ |

The split is at $x \le 3.5$, and the two leaves return $\frac{5}{3}$ and $\frac{17}{2}$. Without a split the average is $\frac{22}{5}$ and the total squared error is $57.2$. A fully-grown tree would keep splitting (the $y$ values are not yet all the same); this question asks only about the root.

**3. Binary classification with the labels written as $y \in \{0, 1\}$, where the proportion of $y = 1$ is $\mu$. What is the "regression error" impurity in this case? How is it related to the Gini index?**

Answer: the average is $\bar{y} = \mu$. Each point with $y = 1$ contributes $(1 - \mu)^2$, and their proportion is $\mu$; each point with $y = 0$ contributes $\mu^2$, and their proportion is $1 - \mu$. So the impurity is $\mu(1 - \mu)^2 + (1 - \mu)\mu^2 = \mu(1 - \mu)\big[(1 - \mu) + \mu\big] = \mu(1 - \mu)$, exactly half of the Gini index $2\mu(1 - \mu)$. The two differ only by a constant factor, so they rank splits in the same order. For example, at $\mu = \frac{1}{4}$: $\frac{3}{16}$ and $\frac{3}{8}$.

**4. A fully-grown tree has 6 leaves. For the sequence of trees obtained by pruning, the number of leaves and $E_{\text{in}}$ are, in order, (6, 0), (5, 0.02), (4, 0.05), (3, 0.15), (2, 0.20), (1, 0.40). Which tree is chosen at $\lambda = 0.04$? And at $\lambda = 0.01$?**

Answer: at $\lambda = 0.04$, $E_{\text{in}} + \lambda\Omega$ is, in order, 0.24, 0.22, 0.21, 0.27, 0.28, 0.44, so the 4-leaf tree is chosen. At $\lambda = 0.01$ it is 0.06, 0.07, 0.09, 0.18, 0.22, 0.41, so the fully-grown tree is chosen: each leaf removed saves only 0.01, while $E_{\text{in}}$ goes up by at least 0.02.

**5. The handout says "when all $\mathbf{x}_n$ are different, the fully-grown tree has $E_{\text{in}} = 0$". If two data points have exactly the same $\mathbf{x}$ but different $y$, what happens? Can this tree's $E_{\text{in}}$ still be 0?**

Criterion: the answer should say that these two points end up on the same side however the data are cut (no stump can separate them) and finally land in the same leaf; that leaf is forced to stop because "all $\mathbf{x}_n$ are the same" and returns the majority, at least one of the two is wrong, and so $E_{\text{in}} > 0$. An answer that also points out this corresponds to the second termination condition on page 11 is complete.

## Exercises and corresponding reading

**The corresponding week in two semesters.** The [Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) puts this lecture in W12 (11/18), the same week as AdaBoost, Random Forest, and GBDT, and the slide code is [209u](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/209u_handout.pdf). The [Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) also puts it in W12 (11/25); the slides for that week were not yet online when checked on 2026-09-30, so this article uses only the MOOC handout.

**Textbook.** Neither course page maps this lecture to a chapter of Learning from Data. The further reading listed on the course page is [Loh's survey, Classification and Regression Trees](https://pages.stat.wisc.edu/~loh/treeprogs/guide/wires11.pdf), which compares the various decision tree algorithms side by side, and *Classification and Regression Trees* by Breiman et al., the original CART book, for which the course page links to the [Amazon book page](http://www.amazon.com/Classification-Regression-Wadsworth-Statistics-Probability/dp/0412048418). This lecture takes only selected components of CART; if you want to know how algorithms such as C4.5 each fill in the four choices, Loh's survey is the quicker way in.

**Homework.** In [Fall 2024 HW7](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf) (released 2024-12-02, due 12-16), the problem directly related to this lecture is **Q2**: after several impurity functions (classification error, squared error, entropy, closeness) are each normalized by dividing by their maximum, which one is equivalent to the Gini index? There are no official solutions. Self-check question 3 works as a warm-up: first write the impurity as a formula in the class proportions, then compare it with the Gini index. This lecture had no programming problem in Fall 2024. The guide to the whole assignment is in [Techniques Homework and Final Project](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project-en).

**If you want to get your hands dirty.** Write a recursive C&RT yourself, run it on the 14 data points of the numerical example, and check the 8 scores at the root; the program is not long, and the lecture says a freshman can write it. Afterwards you can compare with scikit-learn's `DecisionTreeClassifier` (what follows was actually run on scikit-learn 1.9.1): with `criterion="gini"`, the tree grown from these 14 points is the same as the one computed by hand in this article, with the root split at debt 5, the splits below at income 13 and income 10, and 4 leaves in total. `max_depth` limits the height of the tree directly. `ccp_alpha` defaults to 0, which means no pruning; set to a positive number, it prunes with "the impurity of the leaves plus α times the number of leaves", the same idea as this lecture's $\lambda$ but different in the details: it computes impurity instead of $E_{\text{in}}$, and it can remove a whole sub-tree at once. So on these same 14 points, the sequence of trees it prunes to has 4, 3, and 1 leaves, and does not line up tree by tree with this article's $G^{(0)}$ to $G^{(3)}$.

**How other courses on this site cover the same topic.** [Harvard CS181 HW4: Decision Trees, Random Forests, and Mixture of Experts](/posts/tech/2026-09-29-harvard-cs181-hw4-trees-forests-moe-en), [CMU 10-301 HW2: Decision Trees](/posts/learning/2026-08-22-cmu-10301-hw2-decision-trees-en).

**Next lecture.** [Techniques Lecture 10: Random Forests](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-10-random-forest-en) puts this lecture's fully-grown trees into Bagging: the tendency of a single tree to overfit is handled by having many trees vote.

## Course video sources

Original videos: [Decision Tree Hypothesis](https://www.youtube.com/watch?v=dAqPpAXnMJ4), [Decision Tree Algorithm](https://www.youtube.com/watch?v=s9Um2O7N7YM), [Decision Tree Heuristics in C&RT](https://www.youtube.com/watch?v=uvGC_Y0EYiA), [Decision Tree in Action](https://www.youtube.com/watch?v=ryWTrPPbqcg)

- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

Checked: 2026-10-13. The video IDs, titles, and lengths were taken from the official playlist that day; the videos have no caption track on YouTube, and what this article reports from the lecture comes from transcripts made for it.

## Update Log

- 2026-10-10: Marked the video status and checked the recording sources and how to obtain them.
- 2026-10-10: Re-checked the video status. The embedded videos match the lectures in the official playlist.
- 2026-10-13: Originally one article together with Lectures 10 and 11; changed to one article per lecture. This article covers only Techniques Lecture 9 and was rewritten from the handout and the video transcripts.

## References

- [Techniques Lecture 9 handout, 209_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/209_handout.pdf): the main source for this article. The content of the four sections, the four Fun Time questions, the tree on page 3, and the demonstration figures on pages 18 and 19 all come from this handout.
- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2): the IDs and titles of the four videos; what the text reports as said "in the lecture" is paraphrased from machine transcripts of these four videos.
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/): the official entry for handouts and recordings.
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/): the corresponding week, the 209u slides, and the further reading list.
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/): the corresponding week.
- [Fall 2024 Homework 7 (hw7.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf): the content of Q2.
- [Loh, Classification and Regression Trees](https://pages.stat.wisc.edu/~loh/treeprogs/guide/wires11.pdf): further reading listed on the course page, a survey of decision tree algorithms.
- [Breiman et al., Classification and Regression Trees (Amazon book page)](http://www.amazon.com/Classification-Regression-Wadsworth-Statistics-Probability/dp/0412048418): further reading listed on the course page, the original CART book.
- [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques: Course Overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en): where this lecture sits in the whole course and the reading routes.
