---
title: "Theory of Generalization: How One Break Point Makes the Growth Function Polynomial | NTU Hsuan-Tien Lin Machine Learning Foundations Lecture 6"
date: 2026-10-13
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, learning-theory, vc-bound]
lang: en
math: true
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 6
tldr: "Once a hypothesis set has a break point k, the largest number of dichotomies it can produce on N points, B(N, k), satisfies B(N, k) ≤ B(N−1, k) + B(N−1, k−1). That gives B(N, k) ≤ C(N, 0) + … + C(N, k−1), whose highest term is N to the power k−1. Three more steps put the growth function into Hoeffding and yield the VC bound: the probability of the bad event is at most 4·m_H(2N)·exp(−ε²N/8). The break point of 2D perceptrons is 4, so they can learn."
description: "A guide to Lecture 6 of NTU Hsuan-Tien Lin's Machine Learning Foundations, Theory of Generalization: how a break point restricts the growth function, the table and recurrence of the bounding function B(N, k), the induction proof of the polynomial upper bound, and the three-step pictorial proof of the VC bound, with all four Fun Time questions explained and checked numerically."
draft: false
glossary:
  - term: "bounding function"
    aliases: ["B(N, k)"]
    definition: "The largest number of dichotomies that can coexist on N points under the condition that no k points may be shattered. It is a purely combinatorial quantity and does not look at the details of the hypothesis set."
    context: "Foundations Lecture 6 uses it as an upper bound on the growth function m_H(N), then proves that it is bounded by a polynomial in N of degree k−1."
    links:
      - label: "Lecture 6 handout"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/06_handout.pdf"
  - term: "VC bound"
    aliases: ["Vapnik-Chervonenkis bound"]
    definition: "P[there exists h with |E_in(h) − E_out(h)| > ε] ≤ 4·m_H(2N)·exp(−ε²N/8). It replaces the M in the finite-hypothesis version of Hoeffding with the growth function, and the constants change along with it."
    context: "The last section of Foundations Lecture 6 uses three steps to show where each constant comes from."
    links:
      - label: "Lecture 6 handout"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/06_handout.pdf"
  - term: "ghost data"
    aliases: ["D′", "verification set"]
    definition: "A second set of N examples, D′, imagined in the proof as if it were drawn again. The E′_in computed on it stands in for E_out, which cannot be determined from finitely many points. It is not data that actually exists."
    context: "The first step of the VC bound proof."
---

> 🌏 [中文版](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-06-theory-of-generalization)

**Video status: Videos included.** This article is written from the official MOOC handout [06_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/06_handout.pdf) and transcripts of this lecture's four official videos, with formulas following the handout. The transcripts are machine transcripts made for this article (Whisper), not official captions, and no human has proofread them. The videos are taught in Mandarin; the slides are in English. Each section opens with its official video and the approximate time ranges. Page numbers refer to the number at the lower right of each slide (0/27 to 27/27), and wherever the text says "in the lecture" it is paraphrasing what is said in the video.

This is Foundations Lecture 6 in [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en). The Roadmap on page 1 of the handout places it under the second of the four big questions, Why Can Machines Learn?, right after [Foundations Lecture 5: Training versus Testing](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function-en). On that same page, the previous lecture's conclusion is one line carrying the word "(wishfully)": the effective price of choice in training is, we hope, the growth function $m_{\mathcal{H}}(N)$ with a break point. This lecture turns that hope into a theorem. In the lecture's opening, Lin glosses generalization in everyday terms as inferring other cases from one example, and splits today's task into two questions:

1. Does the growth function $m_{\mathcal{H}}(N)$ grow slowly enough?
2. If it does, can it replace the $M$ in Hoeffding's inequality, which may be infinite?

The first three sections answer the first question, and the last section answers the second.

The prerequisites are four terms from the previous lecture: dichotomy (one ○× pattern that a hypothesis draws on $N$ points), growth function (the largest number of dichotomies on $N$ points), shatter (all $2^k$ patterns appear on some $k$ points), and break point (a $k$ such that no $k$ points can be shattered), together with Hoeffding's inequality and the union bound from [Foundations Lecture 4: Feasibility of Learning](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning-en). The only mathematics used is the binomial coefficient $\binom{N}{i}$ and mathematical induction. After reading, you should be able to fill in the table of the bounding function $B(N, k)$ yourself, derive the recurrence inequality and the polynomial upper bound from scratch, and say which step of the proof each of the three constants in the VC bound, 4, $2N$, and $\frac{1}{8}$, comes from.

## How much one break point restricts the cases with more points

```youtube
url: https://www.youtube.com/watch?v=rUFqB5Z3YHQ
title: Theory of Generalization :: Restriction of Break Point @ Machine Learning Foundations (機器學習基石)
```

(Video 00:17–04:50 reviews the growth function and the four examples, 04:50–11:22 is the three-point experiment, 11:22–13:11 covers the idea this section arrives at, and Fun Time follows.)

### Review: the break points of four hypothesis sets

Page 2 of the handout lists the four examples computed in the previous lecture side by side:

| Hypothesis set | Growth function | Pattern it cannot produce | Break point |
|---|---|---|---|
| positive rays | $m_{\mathcal{H}}(N) = N + 1$ | two points as ○× | 2 ($m_{\mathcal{H}}(2) = 3 < 2^2$) |
| positive intervals | $m_{\mathcal{H}}(N) = \frac{1}{2}N^2 + \frac{1}{2}N + 1$ | three points as ○×○ | 3 ($m_{\mathcal{H}}(3) = 7 < 2^3$) |
| convex sets | $m_{\mathcal{H}}(N) = 2^N$ | none | none |
| 2D perceptrons | less than $2^N$ for some $N$ | four points, same sign on each diagonal | 4 ($m_{\mathcal{H}}(4) = 14 < 2^4$) |

In the lecture, Lin calls the break point the point where a first ray of hope shows: it is where the growth function first falls below $2^N$. The previous lecture never worked out what the growth function of 2D perceptrons looks like; it only established that its break point is at 4.

The previous lecture already showed that if $k$ is a break point, then so are $k+1$, $k+2$, and so on. At the bottom of the page the handout asks: what else? What more does one break point restrict about the cases with more points?

### Experiment: with minimum break point 2, how many dichotomies on three points

Page 3 runs a thought experiment. Suppose all we know about some hypothesis set is that its minimum break point is $k = 2$, and nothing else.

- $N = 1$: $m_{\mathcal{H}}(1) = 2$. The reason given in the lecture is that the minimum break point is at 2, so 1 is not yet a break point and one point can be shattered.
- $N = 2$: $m_{\mathcal{H}}(2) < 4$, which is the definition of a break point, so at most 3.
- $N = 3$: at most how many?

On three points, "$k = 2$" means that for each of the three pairs $(\mathbf{x}_1, \mathbf{x}_2)$, $(\mathbf{x}_1, \mathbf{x}_3)$, and $(\mathbf{x}_2, \mathbf{x}_3)$, the four patterns ○○, ○×, ×○, ×× must not all appear. The lecture treats this as a puzzle: add dichotomies one at a time, and after each addition check whether the condition has been violated. The handout draws the process on nine slides (all numbered page 3), summarized in the table below:

| Dichotomies collected so far ($\mathbf{x}_1\mathbf{x}_2\mathbf{x}_3$) | Which two points are shattered | Allowed? |
|---|---|---|
| ○○○ | none (only 1 dichotomy, 4 patterns are impossible) | yes |
| ○○○, ○○× | none | yes |
| ○○○, ○○×, ○×○ | none | yes |
| ○○○, ○○×, ○×○, ○×× | $(\mathbf{x}_2, \mathbf{x}_3)$: ○○, ○×, ×○, ×× all appear | no |
| ○○○, ○○×, ○×○, ×○○ | none | yes |
| the four in row five plus ×○× | $(\mathbf{x}_1, \mathbf{x}_3)$ | no |
| the four in row five plus ××○ | $(\mathbf{x}_1, \mathbf{x}_2)$ | no |
| the four in row five plus ××× | $(\mathbf{x}_1, \mathbf{x}_2)$ (the pair the slide marks; the other two pairs are in fact shattered as well) | no |

The lecture adds a labor-saving observation: shattering two points takes at least four different dichotomies, so nothing needs checking until the fourth one comes in; up to three there can be no violation.

Take row five and verify it yourself. On $(\mathbf{x}_1, \mathbf{x}_2)$ the four dichotomies are ○○, ○○, ○×, ×○, only three distinct patterns; on $(\mathbf{x}_1, \mathbf{x}_3)$ they are ○○, ○×, ○○, ×○, three patterns; on $(\mathbf{x}_2, \mathbf{x}_3)$ they are ○○, ○×, ×○, ○○, three patterns. All three pairs are missing ××, so no two points are shattered.

Three points have only $2^3 = 8$ dichotomies in total. Row five uses four of them, leaving ○××, ×○×, ××○, ×××. The last three rows of the table together with row four (where ○×× gets $(\mathbf{x}_2, \mathbf{x}_3)$ shattered) show that none of these four can be added. The conclusion on the handout's last slide is maximum possible so far: 4 dichotomies, with a sad face drawn under each of the three columns. In the lecture, Lin says the four dichotomies chosen earlier might be swapped for a different combination, but however you swap, four is the limit. Lin also points out what the number means: the dichotomies an actual hypothesis set produces need not be these four, and there may be fewer than four; 4 is the maximum under the condition that no two points can be shattered.

A check made for this article: a Python script examined all $2^8$ subsets of the 8 dichotomies. The largest subsets in which no two points are shattered contain 4 dichotomies, and the handout's set is not the only one that reaches 4. Another example that is easy to read is positive rays itself: on three points ordered left to right it produces ○○○, ×○○, ××○, ×××, exactly 4.

### The idea this experiment leads to

Page 4 puts the three numbers side by side:

| $N$ | Maximum possible ($k = 2$) | With no restriction |
|---|---|---|
| 1 | 2 | 2 |
| 2 | 3 | 4 |
| 3 | 4 | 8 |

At $N = 2$, 3 and 4 differ only slightly; at $N = 3$, 4 is already half of 8. The handout puts it as break point $k$ restricts maximum possible $m_{\mathcal{H}}(N)$ a lot for $N > k$; the explanation in the lecture is that with more points, every combination of $k$ points adds its own "cannot shatter" condition. At $N = 3$ there are already three pairs of points to protect at once.

This gives the route for the lecture (page 4):

$$
m_{\mathcal{H}}(N) \ \le\ \text{maximum possible } m_{\mathcal{H}}(N) \text{ given } k \ \le\ \text{poly}(N)
$$

The growth function depends on the details of the hypothesis set and is hard to compute directly. The quantity in the middle depends only on $k$. If we can prove that the middle quantity is a polynomial in $N$, then every hypothesis set with a break point is bounded by a polynomial.

### Fun Time: not even one point can be shattered

**Question (page 5):** When minimum break point $k = 1$, what is the maximum possible $m_{\mathcal{H}}(N)$ when $N = 3$?

1. 1
2. 2
3. 4
4. 8

**Answer: 1.** $k = 1$ means the hypothesis set cannot even shatter one point, so ○ and × cannot both appear on any single point. Lay the dichotomies out as rows of a table, and this says every "column" may contain only one symbol. Next to the reference answer the handout draws two rows, ○×○ and ○××: in the $\mathbf{x}_3$ column one of them has ○ and the other ×, so $\mathbf{x}_3$ is shattered. In the lecture, Lin explains that a second dichotomy has to differ from the first on some point, and that point then has both ○ and ×, violating the condition. So there can be only 1.

The other three choices (2, 4, and 8 dichotomies) each contain at least two dichotomies, and none escapes the argument above. The result has nothing to do with $N$ being 3; it holds for every $N$, and it will be used when filling in the table of $B(N, k)$.

## Defining "maximum possible" as the bounding function and filling in the easy cells

```youtube
url: https://www.youtube.com/watch?v=OmRekto9rkc
title: Theory of Generalization :: Bounding Function: Basic Cases @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–02:26 defines the bounding function, 02:26–05:58 fills in the boundary of the table, and Fun Time follows.)

### The definition of the bounding function B(N, k)

Page 6 of the handout gives "maximum possible" a name. The **bounding function** $B(N, k)$ is the maximum possible $m_{\mathcal{H}}(N)$ when the break point is $k$.

The handout stresses that it is a combinatorial quantity: the maximum number of length-$N$ vectors with (○, ×) while "no shatter" any length-$k$ subvectors. The lecture describes it as covering up some dimensions of the vectors and looking at only $k$ of them; whichever $k$ you look at, you must not see all $2^k$ patterns.

This definition never mentions the hypothesis set. The handout's example is that $B(N, 3)$ bounds two sets that look very different: positive intervals have break point 3, and 1D perceptrons also have break point 3. In the lecture, Lin says this removes the need to study separately how to analyze intervals and how to analyze perceptrons; you take the single number, the break point, and look up $B$.

In the new notation, the results of the earlier three-point experiment read $B(2, 2) = 3$ and $B(3, 2) = 4$. The new goal (page 6):

$$
B(N, k) \le \text{poly}(N) \ ?
$$

### Filling the table: four kinds of cells that take no effort

Pages 7 to 10 arrange $B(N, k)$ in a table, with $N$ as rows and $k$ as columns, and fill it in step by step.

**The two known cells (page 7).** $B(2, 2) = 3$ and $B(3, 2) = 4$.

**The first column, $k = 1$ (page 8).** $B(N, 1) = 1$, which is the conclusion of the Fun Time just above.

**The upper right, $N < k$ (page 9).** $B(N, k) = 2^N$. There are fewer points than $k$, so you cannot even pick $k$ distinct points to check. In the lecture, Lin says that in this case the condition "no $k$ points can be shattered" might as well not have been written, so all $2^N$ dichotomies can be included.

**The diagonal, $N = k$ (page 10).** $B(N, k) = 2^N - 1$. Here there is only one way to pick $k$ points, namely all $N$ of them. They cannot be shattered, so the count cannot be $2^N$; remove any single dichotomy and the remaining $2^N - 1$ no longer shatter them, and no larger number is possible. The lecture checks this against numbers already computed: for two points, 4 is not allowed and removing one gives 3; for three points, 8 is not allowed and removing one gives 7.

The table after these steps (page 10):

| $N$ (rows) / $k$ (columns) | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| 1 | 1 | 2 | 2 | 2 | 2 | 2 |
| 2 | 1 | 3 | 4 | 4 | 4 | 4 |
| 3 | 1 | 4 | 7 | 8 | 8 | 8 |
| 4 | 1 | | | 15 | 16 | 16 |
| 5 | 1 | | | | 31 | 32 |
| 6 | 1 | | | | | 63 |

At the bottom of the page the handout writes more than halfway done. The lecture adds that the part still unfilled is the main event. On the table that is the lower left, the cells with $N > k$. (An addition in this article: this is exactly the part that matters for learning, because in real problems the amount of data $N$ is far larger than the break point $k$.)

### Fun Time: 2D perceptrons and B(4, 4)

**Question (page 11):** For the 2D perceptrons, which of the following claim is true?

1. minimum break point $k = 2$
2. $m_{\mathcal{H}}(4) = 15$
3. $m_{\mathcal{H}}(N) < B(N, k)$ when $N = k =$ minimum break point
4. $m_{\mathcal{H}}(N) > B(N, k)$ when $N = k =$ minimum break point

**Answer: 3.** The minimum break point for 2D perceptrons is 4, with $m_{\mathcal{H}}(4) = 14$; from the table, $B(4, 4) = 2^4 - 1 = 15$. $14 < 15$.

The other choices: choice 1 is wrong because two points, and three points (not collinear), can both be shattered by lines, so neither 2 nor 3 is a break point. Choice 2 writes 14 as 15; on four points, what lines cannot produce are the two patterns with the same sign on each diagonal, and $16 - 2 = 14$. Choice 4 cannot happen: $B(N, k)$ is by definition the "maximum possible $m_{\mathcal{H}}(N)$", so the growth function cannot exceed it.

The message to take from this question is in the last sentence of the handout's answer: the bounding function can be "loose". $B(4, 4) = 15$ only says "remove one and it is legal", while 2D perceptrons, for geometric reasons, actually lose two. In the lecture, Lin explains that $B$ is an upper limit on the growth function, and equality need not hold.

## The remaining cells: reducing B(4, 3) to the row above

```youtube
url: https://www.youtube.com/watch?v=6jtWUmaBqFU
title: Theory of Generalization :: Bounding Function: Inductive @ Machine Learning Foundations (機器學習基石)
```

(Video 00:01–02:18 finds $B(4, 3)$ by program, 02:18–08:17 groups the 11 dichotomies and obtains two inequalities, 08:17–10:00 generalizes to the recurrence and fills the table, 10:00–12:20 is the theorem on the polynomial upper bound, 12:20–13:58 goes back to check three examples, and Fun Time follows. The title of this video on YouTube says Inductive; the section's name in the handout is Bounding Function: Inductive Cases.)

### The answer first: B(4, 3) is 11

Page 12 takes the empty cell $B(4, 3)$ as its example. The motivation: four points with no three shattered should be related to the "three points" row, because four points with one covered up are three points. The goal is to reduce $B(4, 3)$ to $B(3, ?)$.

How to do the reduction is not easy to see directly, so the lecture finds the answer first and then studies it. Lin says that, coming from a computer science department, the natural move is to write a small program: there are 16 length-4 ○× vectors; pick some of them as a set of dichotomies, check whether any three points are shattered, and find the largest such set. There are $2^{16}$ sets to check, written in the handout as $2^{2^4}$, which is quick for a computer. Page 13 lists the winner, 11 dichotomies in all:

| No. | $\mathbf{x}_1$ | $\mathbf{x}_2$ | $\mathbf{x}_3$ | $\mathbf{x}_4$ |
|---|---|---|---|---|
| 01 | ○ | ○ | ○ | ○ |
| 02 | × | ○ | ○ | ○ |
| 03 | ○ | × | ○ | ○ |
| 04 | ○ | ○ | × | ○ |
| 05 | ○ | ○ | ○ | × |
| 06 | × | × | ○ | × |
| 07 | × | ○ | × | ○ |
| 08 | × | ○ | ○ | × |
| 09 | ○ | × | × | ○ |
| 10 | ○ | × | ○ | × |
| 11 | ○ | ○ | × | × |

So $B(4, 3) = 11$. On the table, directly above $B(4, 3)$ is $B(3, 3) = 7$ and to the upper left is $B(3, 2) = 4$, and $4 + 7 = 11$. In the lecture, Lin says this cannot be treated as a game of making numbers add up; to claim that 11 is 4 plus 7, you have to give a reason.

A check made for this article: following the same approach, a Python script enumerated all $2^{16} = 65{,}536$ subsets. The largest legal subsets do contain 11 dichotomies, and the handout's set passes the check. It is not the only subset that reaches 11 (later we will see that the 11 dichotomies of positive intervals on four points form another one), and the argument below holds for any of them.

### Splitting by the last point into "pairs" and "singles"

Page 14 reorders the 11 rows. The grouping is based on what the first three points $(\mathbf{x}_1, \mathbf{x}_2, \mathbf{x}_3)$ look like:

- **Pair (orange on the slide)**: the first three symbols are the same, and $\mathbf{x}_4$ is ○ in one row and × in the other. These are 01 and 05 (○○○), 02 and 08 (×○○), 03 and 10 (○×○), 04 and 11 (○○×): 4 pairs, 8 rows.
- **Single (purple)**: the first three symbols appear only once in the whole table. These are 06 (××○, with $\mathbf{x}_4$ being ×), 07 (×○×, with $\mathbf{x}_4$ being ○), and 09 (○××, with $\mathbf{x}_4$ being ○): 3 rows.

The lecture's words for the two groups are Mandarin idioms meaning "coming in pairs" and "all alone". Write $\alpha$ for the number of pairs and $\beta$ for the number of singles (page 15):

$$
B(4, 3) = 11 = 2\alpha + \beta, \qquad \alpha = 4,\ \beta = 3
$$

### The first inequality: after covering x₄

Cover the $\mathbf{x}_4$ column and look only at the first three points (page 15). The two rows of each pair become the same row and count once; each single counts once. So there are $\alpha + \beta$ different dichotomies on the first three points:

| Source | What it looks like on $(\mathbf{x}_1, \mathbf{x}_2, \mathbf{x}_3)$ |
|---|---|
| $\alpha$ (first three symbols of the pairs) | ○○○, ×○○, ○×○, ○○× |
| $\beta$ (first three symbols of the singles) | ××○, ×○×, ○×× |

The original 11 rows "no shatter" any three points, and $(\mathbf{x}_1, \mathbf{x}_2, \mathbf{x}_3)$ is of course one such triple. So these $\alpha + \beta$ dichotomies on three points cannot shatter those three points either, and their number cannot exceed the maximum for "three points, no three shattered":

$$
\alpha + \beta \le B(3, 3)
$$

In this example $4 + 3 = 7 = B(3, 3)$, exactly equality.

### The second inequality: looking only at the paired half

Do it once more. This time, besides covering $\mathbf{x}_4$, also throw away the singles and keep only the four dichotomies of $\alpha$ (page 16). The handout claims that these $\alpha$ dichotomies, on the first three points, cannot shatter any *two* points.

The reason is by contradiction. Suppose the $\alpha$ dichotomies shatter some two of the first three points, say $(\mathbf{x}_1, \mathbf{x}_2)$, meaning ○○, ○×, ×○, ×× all appear on those two points. Every dichotomy in $\alpha$ has two versions in the original table, one with $\mathbf{x}_4$ being ○ and one with $\mathbf{x}_4$ being ×, so all $4 \times 2 = 8$ patterns appear on $(\mathbf{x}_1, \mathbf{x}_2, \mathbf{x}_4)$, three points are shattered, and this contradicts the original condition. The lecture puts it bluntly: two shattered points, combined with the paired $\mathbf{x}_4$, are three shattered points, and then we are done for. So

$$
\alpha \le B(3, 2)
$$

Verify it in this example: for the four dichotomies ○○○, ×○○, ○×○, ○○×, any two points show only the three patterns ○○, ○×, ×○, with ×× missing. $\alpha = 4 = B(3, 2)$, again equality. These four also happen to be the very set that survived to the end of the earlier three-point experiment, only with the rows in a different order.

The first inequality uses "cover one point, and the $k$ in the condition stays the same"; the second uses the extra information of pairing to get a stricter condition, with $k$ lowered by 1. Neither can be dropped: with only the first, what you get is $B(4, 3) = 2\alpha + \beta \le 2(\alpha + \beta) \le 2B(3, 3)$, which doubles with every additional point, so the upper bound is still exponential.

### Putting it together: the recurrence inequality

Page 17 stacks the three lines:

$$
\begin{aligned}
B(4, 3) &= 2\alpha + \beta = (\alpha + \beta) + \alpha \\
&\le B(3, 3) + B(3, 2)
\end{aligned}
$$

The second slide on the same page replaces 4 with $N$ and 3 with $k$. In the lecture, Lin says not a word of the proof has to change; the only difference is that the largest set of dichotomies no longer comes out of a computer but is one we imagine: it can always be split by $\mathbf{x}_N$ into $\alpha$ pairs and $\beta$ singles.

$$
\begin{aligned}
B(N, k) &= 2\alpha + \beta \\
\alpha + \beta &\le B(N-1, k) \\
\alpha &\le B(N-1, k-1) \\
\Longrightarrow\ B(N, k) &\le B(N-1, k) + B(N-1, k-1)
\end{aligned}
$$

Here is the reasoning for the general case written out in full (an addition in this article; the handout only lists the formulas). Let $S$ be a set of dichotomies that achieves $B(N, k)$. Covering $\mathbf{x}_N$ gives $\alpha + \beta$ dichotomies of length $N-1$, and no $k$ of the first $N-1$ points were shattered by $S$ to begin with, so $\alpha + \beta \le B(N-1, k)$. If the $\alpha$ paired dichotomies shattered some $k-1$ of the first $N-1$ points, then adding $\mathbf{x}_N$ would shatter $k$ points, a contradiction, so $\alpha \le B(N-1, k-1)$. This argument needs $N \ge 2$ and $k \ge 2$.

On the table, the inequality says that each cell is at most "the cell directly above" plus "the cell to the upper left". Use it to fill the lower left (page 17):

| $N$ (rows) / $k$ (columns) | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| 1 | 1 | 2 | 2 | 2 | 2 | 2 |
| 2 | 1 | 3 | 4 | 4 | 4 | 4 |
| 3 | 1 | 4 | 7 | 8 | 8 | 8 |
| 4 | 1 | ≤ 5 | 11 | 15 | 16 | 16 |
| 5 | 1 | ≤ 6 | ≤ 16 | ≤ 26 | 31 | 32 |
| 6 | 1 | ≤ 7 | ≤ 22 | ≤ 42 | ≤ 57 | 63 |

Cell by cell: $B(4, 2) \le 4 + 1 = 5$; $B(5, 2) \le 5 + 1 = 6$; $B(5, 3) \le 11 + 5 = 16$; $B(5, 4) \le 15 + 11 = 26$; $B(6, 2) \le 6 + 1 = 7$; $B(6, 3) \le 16 + 6 = 22$; $B(6, 4) \le 26 + 16 = 42$; $B(6, 5) \le 31 + 26 = 57$. Note that the 5 used for $B(5, 3)$ is itself an upper bound; in the lecture, Lin explains that from two upper bounds you can estimate the next upper bound. Lin sums up the chain of relations this way: the growth function is bounded by the bounding function, and the bounding function is bounded by "a bound on the bound".

### The theorem: the bounding function is bounded by a polynomial

The theorem on page 18:

$$
B(N, k) \ \le\ \sum_{i=0}^{k-1} \binom{N}{i}
$$

The handout says the proof is simple induction using boundary and inductive formula, and the lecture likewise calls it a very simple induction without going through it. It is written out below (the steps are supplied by this article). By convention, $\binom{N}{i} = 0$ when $i > N$.

**The column $k = 1$.** The right side has only the $i = 0$ term, $\binom{N}{0} = 1$, and $B(N, 1) = 1$. It holds.

**The row $N = 1$.** $k = 1$ has been covered. For $k \ge 2$, $B(1, k) = 2$, and the right side is $\binom{1}{0} + \binom{1}{1} + 0 + \dots = 2$. It holds.

**Inductive step.** Let $N \ge 2$ and $k \ge 2$, and assume every cell in row $N-1$ holds. Use the recurrence inequality, then substitute the induction hypothesis into both terms:

$$
\begin{aligned}
B(N, k) &\le B(N-1, k) + B(N-1, k-1) \\
&\le \sum_{i=0}^{k-1}\binom{N-1}{i} + \sum_{i=0}^{k-2}\binom{N-1}{i}
\end{aligned}
$$

Shift the index of the second sum by one and write it as $\sum_{i=1}^{k-1}\binom{N-1}{i-1}$. Take the $i = 0$ term out of the first sum, and pair the rest term by term with the second sum:

$$
= \binom{N-1}{0} + \sum_{i=1}^{k-1}\left[\binom{N-1}{i} + \binom{N-1}{i-1}\right] = \binom{N}{0} + \sum_{i=1}^{k-1}\binom{N}{i} = \sum_{i=0}^{k-1}\binom{N}{i}
$$

Two facts are used in the middle: $\binom{N-1}{0} = \binom{N}{0} = 1$, and the Pascal's triangle identity $\binom{N-1}{i} + \binom{N-1}{i-1} = \binom{N}{i}$ (choosing $i$ out of $N$ things splits into the cases "do not choose the last one" and "choose the last one"). Row $N$ holds, and the induction is complete.

The recurrence "above plus upper left" has the same shape as the rule that generates Pascal's triangle, which is why binomial coefficients appear on the right side.

**Why this is a polynomial.** For fixed $k$, the term of highest degree in the sum is the last one,

$$
\binom{N}{k-1} = \frac{N(N-1)\cdots(N-k+2)}{(k-1)!}
$$

It is a polynomial in $N$ of degree $k-1$, and the handout labels the sum with highest term $N^{k-1}$. Hence (page 18): for fixed $k$, $B(N, k)$ is upper bounded by $\text{poly}(N)$, so **$m_{\mathcal{H}}(N)$ is polynomial if a break point exists**. The lecture's conclusion is that once the growth function has that point where a ray of hope shows, there is nothing to fear: in the end it must be polynomial.

Check against the table: for $k = 3$, $\binom{N}{0} + \binom{N}{1} + \binom{N}{2}$ at $N = 4, 5, 6$ is $11, 16, 22$; for $k = 4$, adding $\binom{N}{3}$ gives $26, 42$ at $N = 5, 6$. These agree with the numbers on the table.

On the same page the handout writes that "≤" can be "=" actually, and that math lovers should go and prove it. The lecture adds that what needs proving is the other direction (≥), and the technique differs from the one here. An addition in this article, an idea that shows why the ≥ direction holds: collect all vectors in which "the number of × is at most $k-1$" into one set, $\sum_{i=0}^{k-1}\binom{N}{i}$ vectors in all; for any $k$ points to be shattered, a vector with × on all of those $k$ points would have to appear, but such a vector has at least $k$ × and is not in the set. For $N = 4$ and $k = 3$ this set has $1 + 4 + 6 = 11$ vectors, and a program written for this article checked that it does not shatter any three points. So the numbers on the table marked "≤" are all the true values.

### Applying it to a concrete hypothesis set: positive intervals on four points

What follows is an example made up for this article, not from the slides, to see what the $\alpha$, $\beta$ argument looks like on a real hypothesis set. Positive intervals have break point 3, and on four points ordered left to right there are $m_{\mathcal{H}}(4) = \frac{1}{2}\cdot 16 + \frac{1}{2}\cdot 4 + 1 = 11$ dichotomies: the all-× one, plus the $4 + 3 + 2 + 1 = 10$ in which the ○ form one contiguous run. Grouped by the first three points:

| First three symbols | $\mathbf{x}_4$ is ○ | $\mathbf{x}_4$ is × | Group |
|---|---|---|---|
| ××× | ×××○ | ×××× | pair |
| ××○ | ××○○ | ××○× | pair |
| ×○○ | ×○○○ | ×○○× | pair |
| ○○○ | ○○○○ | ○○○× | pair |
| ○×× | impossible (the ○ are not contiguous) | ○××× | single |
| ×○× | impossible | ×○×× | single |
| ○○× | impossible | ○○×× | single |

$\alpha = 4$, $\beta = 3$, and $2 \times 4 + 3 = 11$. The first three symbols of the pairs are ×××, ××○, ×○○, ○○○; on any two points the pattern ○× (○ on the left, × on the right) is missing, so no two points are shattered, and $\alpha = 4 = B(3, 2)$. All seven sets of first three symbols are exactly positive intervals on three points, and $\alpha + \beta = 7 = B(3, 3)$.

What this result means: positive intervals on four points use up all of $B(4, 3) = 11$. Their 11 dichotomies and the 11 found by the handout's program are two different sets, yet after grouping, $\alpha$ and $\beta$ are the same, and both inequalities hold with equality. Why the paired half is subject only to the restriction $k - 1 = 2$ is easy to see here: for the last point to accept both symbols, the first three points must either be all × or have ○ running all the way to the right end. That is precisely the look of positive rays, with a single boundary, and the break point of positive rays is 2.

### Going back to check three examples

Page 19 applies the theorem to the opening examples (convex sets have no break point, so this page is called The Three Break Points):

| Hypothesis set | $k$ | The true $m_{\mathcal{H}}(N)$ | The theorem's upper bound $\sum_{i=0}^{k-1}\binom{N}{i}$ |
|---|---|---|---|
| positive rays | 2 | $N + 1$ | $1 + N$ |
| positive intervals | 3 | $\frac{1}{2}N^2 + \frac{1}{2}N + 1$ | $1 + N + \frac{N(N-1)}{2} = \frac{1}{2}N^2 + \frac{1}{2}N + 1$ |
| 2D perceptrons | 4 | not yet known | $\frac{1}{6}N^3 + \frac{5}{6}N + 1$ |

In the first two rows the upper bound equals the true value. Expand the upper bound in the third row once:

$$
1 + N + \frac{N(N-1)}{2} + \frac{N(N-1)(N-2)}{6} = 1 + N + \frac{N^2 - N}{2} + \frac{N^3 - 3N^2 + 2N}{6} = \frac{1}{6}N^3 + \frac{5}{6}N + 1
$$

The $N^2$ coefficient is $\frac{1}{2} - \frac{1}{2} = 0$, and the $N$ coefficient is $1 - \frac{1}{2} + \frac{1}{3} = \frac{5}{6}$. Substituting $N = 4$ gives $\frac{64}{6} + \frac{20}{6} + 1 = 15$, which is $B(4, 4)$.

In the lecture, Lin says the first two rows are not the point, since their growth functions could be written down anyway. What matters is the third row: we still cannot write down the growth function of 2D perceptrons, yet from the single number "the break point is 4" we know it grows at most like $N^3$. The conclusion at the bottom of the handout page is can bound $m_{\mathcal{H}}(N)$ by only one break point.

### Fun Time: is the upper bound loose for 1D perceptrons

**Question (page 20):** For 1D perceptrons (positive and negative rays), we know that $m_{\mathcal{H}}(N) = 2N$. Let $k$ be the minimum break point. Which of the following is **not** true?

1. $k = 3$
2. for some integers $N > 0$, $m_{\mathcal{H}}(N) = \sum_{i=0}^{k-1}\binom{N}{i}$
3. for all integers $N > 0$, $m_{\mathcal{H}}(N) = \sum_{i=0}^{k-1}\binom{N}{i}$
4. for all integers $N > 2$, $m_{\mathcal{H}}(N) < \sum_{i=0}^{k-1}\binom{N}{i}$

**Answer: 3.** The handout says the proof is generally trivial by listing the definitions; here the listing is carried out.

- Choice 1 is true: $m_{\mathcal{H}}(2) = 4 = 2^2$, so two points can be shattered; $m_{\mathcal{H}}(3) = 6 < 8$. The minimum break point is 3.
- For $k = 3$ the upper bound is $1 + N + \frac{N(N-1)}{2} = \frac{1}{2}N^2 + \frac{1}{2}N + 1$. Compared with $2N$:

| $N$ | $m_{\mathcal{H}}(N) = 2N$ | Upper bound |
|---|---|---|
| 1 | 2 | 2 |
| 2 | 4 | 4 |
| 3 | 6 | 7 |
| 4 | 8 | 11 |
| 5 | 10 | 16 |

- Choice 2 is true: they are equal at $N = 1$ and $N = 2$.
- Choice 4 is true: the upper bound minus $2N$ is $\frac{1}{2}N^2 - \frac{3}{2}N + 1 = \frac{1}{2}(N-1)(N-2)$, which is positive for $N > 2$.
- Choice 3 says they are equal for every $N$, which already fails at $N = 3$ (6 versus 7).

With the same $k = 3$, positive intervals use up the upper bound while 1D perceptrons grow only linearly. The bounding function looks only at the break point, so for the latter it is very loose.

## How the growth function replaces M: the three-step pictorial proof of the VC bound

```youtube
url: https://www.youtube.com/watch?v=GcxpsIvR7t8
title: Theory of Generalization :: A Pictorial Proof @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–01:56 shows what the final formula looks like and how this section will go, 01:56–06:39 is step one, 06:39–09:28 step two, 09:28–11:29 step three, 11:29–13:37 is the VC bound and 2D perceptrons, 13:37–14:35 is Fun Time, and the summary follows.)

### The formula we want and the formula we actually get

The first question now has an answer: with a break point, the growth function is polynomial. The second question is putting it into Hoeffding. The result of Foundations Lecture 4 for finitely many hypotheses is $\mathbb{P}[\text{BAD}] \le 2M\exp(-2\epsilon^2 N)$. The most direct wish is to replace $M$ with $m_{\mathcal{H}}(N)$ (the want on page 21 of the handout):

$$
\mathbb{P}\Big[\exists h \in \mathcal{H} \text{ s.t. } \big\lvert E_{\text{in}}(h) - E_{\text{out}}(h)\big\rvert > \epsilon\Big] \ \le\ 2\, m_{\mathcal{H}}(N)\, \exp\big(-2\epsilon^2 N\big)
$$

In the lecture, Lin says things are not that simple. What can actually be proved is a version that looks similar (the actually on page 21), and it requires $N$ large enough:

$$
\mathbb{P}\Big[\exists h \in \mathcal{H} \text{ s.t. } \big\lvert E_{\text{in}}(h) - E_{\text{out}}(h)\big\rvert > \epsilon\Big] \ \le\ 2 \cdot 2\, m_{\mathcal{H}}(2N) \cdot \exp\Big(-2 \cdot \frac{1}{16}\epsilon^2 N\Big)
$$

Three constants have been added: an extra 2 in front, the argument of $m_{\mathcal{H}}$ changing from $N$ to $2N$, and an extra $\frac{1}{16}$ in the exponent.

The handout calls what comes next a sketch of proof. The lecture first makes clear where this section stands: the full proof is very technical, and Lin does not think everyone should spend the effort to understand every mathematical detail, so the lecture only accounts for which technique brings in each of the three constants and leaves out the underlying mathematics; anyone interested has to write out the details on their own. This article keeps to the same scope. It adds a few sentences of reasoning the handout does not write down, but it is likewise not a rigorous proof.

Below, $\mathbb{P}[\exists h \in \mathcal{H} \text{ s.t. } \lvert E_{\text{in}}(h) - E_{\text{out}}(h)\rvert > \epsilon]$ is abbreviated as BAD, as on page 23 of the handout. It means: the data $\mathcal{D}$ we drew makes $E_{\text{in}}$ and $E_{\text{out}}$ differ by more than $\epsilon$ for at least one $h$ in the hypothesis set.

### Step 1: Replace Eout by E′in

Why not just sort the hypotheses into $m_{\mathcal{H}}(N)$ kinds and apply the union bound? The first point on page 22 of the handout: $E_{\text{in}}(h)$ finitely many, $E_{\text{out}}(h)$ infinitely many. The explanation in the lecture is that $E_{\text{in}}$ depends only on the $N$ examples, and two hypotheses with the same dichotomy on these $N$ points have the same $E_{\text{in}}$, so there are at most $m_{\mathcal{H}}(N)$ values; $E_{\text{out}}$, however, depends on the whole input space, and turning a line in the plane slightly already changes $E_{\text{out}}$. In other words, two hypotheses with the same $E_{\text{in}}$ still have different $E_{\text{out}}$, so whether BAD happens may differ between them too, and they cannot be lumped into one kind. The handout calls $E_{\text{out}}$ evil; it has to be replaced first.

The replacement is to sample another data set $\mathcal{D}'$ of the same size $N$ (the handout calls it the verification set), compute $E'_{\text{in}}(h)$ on it, and use that in place of $E_{\text{out}}(h)$. In the lecture, Lin says this is the verification discussed before: to learn roughly what $E_{\text{out}}$ is from finitely many points, take another batch of data and estimate with it. $\mathcal{D}'$ is usually called ghost data; the lecture stresses that it is not data that actually exists, only an imagined second draw.

The figure on this page of the handout is a bell-shaped curve showing the probability distribution of $E_{\text{in}}$ and $E'_{\text{in}}$, centered at $E_{\text{out}}$. $E_{\text{in}}$ is marked on the right tail, far from the center, which is the situation where BAD happens; the half to the left of the center line is shaded, and $E'_{\text{in}}$ is marked on that side. The lecture's account: the $E_{\text{in}}$ values computed from different data sets are roughly centered at $E_{\text{out}}$, some farther and some nearer; if $E_{\text{in}}$ is far from $E_{\text{out}}$, then the $E'_{\text{in}}$ from another draw has a good chance of being far from $E_{\text{in}}$ too, and Lin says the picture looks like a chance of somewhat more than one half. Reading it off the figure (this article's reading): when $E'_{\text{in}}$ lands on the other side of $E_{\text{out}}$, it is even farther from $E_{\text{in}}$ than $E_{\text{out}}$ is. The handout writes that BAD $h$ of $E_{\text{in}} - E_{\text{out}}$ probably implies BAD $h$ of $E_{\text{in}} - E'_{\text{in}}$. As a formula:

$$
\frac{1}{2}\,\mathbb{P}\Big[\exists h \in \mathcal{H} \text{ s.t. } \big\lvert E_{\text{in}}(h) - E_{\text{out}}(h)\big\rvert > \epsilon\Big] \ \le\ \mathbb{P}\Big[\exists h \in \mathcal{H} \text{ s.t. } \big\lvert E_{\text{in}}(h) - E'_{\text{in}}(h)\big\rvert > \frac{\epsilon}{2}\Big]
$$

Compared with the original, three things changed: $E_{\text{out}}$ became $E'_{\text{in}}$; the left side gained a $\frac{1}{2}$, which the lecture ties to the "good chance" just mentioned, since it is not certain to happen; and the threshold went from $\epsilon$ to $\frac{\epsilon}{2}$, about which the lecture only says it is a mathematical necessity.

An addition in this article on where $\frac{\epsilon}{2}$ and "$N$ large enough" come from (neither the handout nor the lecture expands on this). Suppose $\mathcal{D}$ makes some $h$ go wrong, $\lvert E_{\text{in}}(h) - E_{\text{out}}(h)\rvert > \epsilon$. This $h$ was picked after looking at $\mathcal{D}$, but $\mathcal{D}'$ is drawn separately and independently, so from the point of view of $\mathcal{D}'$ it is a hypothesis fixed in advance, and the single-hypothesis Hoeffding of Foundations Lecture 4 applies (with $\epsilon$ replaced by $\frac{\epsilon}{2}$): the probability that $\lvert E'_{\text{in}}(h) - E_{\text{out}}(h)\rvert \le \frac{\epsilon}{2}$ is at least $1 - 2\exp(-\frac{1}{2}\epsilon^2 N)$. When that happens, the triangle inequality gives

$$
\big\lvert E_{\text{in}} - E'_{\text{in}}\big\rvert \ \ge\ \big\lvert E_{\text{in}} - E_{\text{out}}\big\rvert - \big\lvert E'_{\text{in}} - E_{\text{out}}\big\rvert \ >\ \epsilon - \frac{\epsilon}{2} = \frac{\epsilon}{2}
$$

So as long as $2\exp(-\frac{1}{2}\epsilon^2 N) \le \frac{1}{2}$, that is, $N \ge \frac{2\ln 4}{\epsilon^2}$, whenever the original BAD happens there is at least a one-half chance that the new BAD happens along with it. The probability of the new BAD is therefore no less than half the probability of the original BAD, which is the formula above. For $\epsilon = 0.1$ this threshold is $N \ge 278$. The handout's "$N$ large enough" gives no number; the threshold here is the condition this particular argument uses, and it does not mean the full proof adopts the same one. Setting the threshold at $\frac{\epsilon}{2}$ leaves a margin: $E'_{\text{in}}$ itself deviates from $E_{\text{out}}$, and if it is allowed to deviate by $\frac{\epsilon}{2}$, the remaining gap is still $\frac{\epsilon}{2}$.

### Step 2: Decompose H by Kind

Move the $\frac{1}{2}$ to the right side (page 23):

$$
\text{BAD} \ \le\ 2\,\mathbb{P}\Big[\exists h \in \mathcal{H} \text{ s.t. } \big\lvert E_{\text{in}}(h) - E'_{\text{in}}(h)\big\rvert > \frac{\epsilon}{2}\Big]
$$

The event inside the brackets now depends only on the $2N$ points of $\mathcal{D}$ and $\mathcal{D}'$. In the lecture, Lin explains that if two hypotheses have the same dichotomy on these $2N$ points, their $E_{\text{in}}$ are the same and their $E'_{\text{in}}$ are the same, so they go wrong or not in perfect step. The infinite $\mathcal{H}$ can therefore be divided into

$$
\big\lvert \mathcal{H}(\mathbf{x}_1, \dots, \mathbf{x}_N, \mathbf{x}'_1, \dots, \mathbf{x}'_N) \big\rvert \ \le\ m_{\mathcal{H}}(2N)
$$

kinds. Take one representative of each kind and apply the union bound to these finitely many representatives:

$$
\text{BAD} \ \le\ 2\, m_{\mathcal{H}}(2N)\ \mathbb{P}\Big[\text{fixed } h \text{ s.t. } \big\lvert E_{\text{in}}(h) - E'_{\text{in}}(h)\big\rvert > \frac{\epsilon}{2}\Big]
$$

The argument of $m_{\mathcal{H}}$ is $2N$ because we are now looking at the number of points in the two data sets combined.

This page of the handout has three small pictures side by side. In each, the box stands for all possible data sets, and $\mathcal{D}$ is one point in it:

| Picture | What is drawn | Meaning |
|---|---|---|
| (a) Hoeffding Inequality | one small blob in the box | the bad data sets of a single $h$ take up only a small patch |
| (b) Union Bound | many blobs, not overlapping, filling the box | adding up each $h$'s bad data sets as if they never overlapped, infinitely many $h$ cover everything |
| (c) Now | many blobs stacked in the same region | the bad data sets of $h$ of the same kind nearly coincide, so one kind is counted only once |

In the lecture, Lin says the technique in this step is the same as when the union bound was used in Foundations Lecture 4, except that the growth function has to be applied first so that a finite count can be pulled out and the amount of overlap among bad events worked out properly. The line at the bottom of the handout page is use $m_{\mathcal{H}}(2N)$ to calculate BAD-overlap properly.

An addition in this article: the representative of each kind can be chosen only after the $2N$ points are fixed, so the "fixed $h$" here is stated conditionally on those $2N$ points being given. This is also why step three switches to the picture of a bin: once the $2N$ points are given, the remaining randomness is "which $N$ go to $\mathcal{D}$ and which $N$ go to $\mathcal{D}'$". The handout does not write this conditioning out, and this article only points to it without working through the details of the conditional probability.

### Step 3: Use Hoeffding without Replacement

What remains is, for one fixed $h$, to estimate the probability that the two samples differ by more than $\frac{\epsilon}{2}$. The approach on page 24 of the handout: think of the $2N$ examples as a small bin, choose $N$ of them to compute $E_{\text{in}}$, and leave the other $N$ in the bin for $E'_{\text{in}}$. The fraction of the bin on which $h$ errs is the average over all $2N$ examples, namely $\frac{E_{\text{in}} + E'_{\text{in}}}{2}$. Because

$$
E_{\text{in}} - \frac{E_{\text{in}} + E'_{\text{in}}}{2} = \frac{E_{\text{in}} - E'_{\text{in}}}{2}
$$

we have

$$
\big\lvert E_{\text{in}} - E'_{\text{in}}\big\rvert > \frac{\epsilon}{2} \quad\Longleftrightarrow\quad \Big\lvert E_{\text{in}} - \frac{E_{\text{in}} + E'_{\text{in}}}{2}\Big\rvert > \frac{\epsilon}{4}
$$

The right side says that "the fraction in the sample" and "the fraction in the bin" differ by more than $\frac{\epsilon}{4}$, which is exactly what Hoeffding handles. The handout lists three differences from Foundations Lecture 4: a smaller bin (only $2N$ examples), a smaller $\epsilon$ ($\frac{\epsilon}{4}$), and sampling without replacement (Hoeffding without replacement). The lecture explains what without replacement means: draw one orange marble and the fraction of orange in the bin drops a little, unlike the original setup where the probability is the same on every draw; still, this version of Hoeffding ends with a result the same as or similar to the original. Substituting $\frac{\epsilon}{4}$ for the $\epsilon$ in $2\exp(-2\epsilon^2 N)$:

$$
\text{BAD} \ \le\ 2\, m_{\mathcal{H}}(2N) \cdot 2\exp\Big(-2\Big(\frac{\epsilon}{4}\Big)^2 N\Big)
$$

### A numerical example of the small bin

What follows is an example made up for this article, not from the slides, to see the equivalence in step three and the actual size of the inequality. Take $N = 10$, so the bin holds $2N = 20$ examples. Some fixed $h$ errs on 8 of them, so the error fraction of the bin is $\frac{8}{20} = 0.4$. Draw 10 at random as $\mathcal{D}$; if $h$ errs on $j$ of them, then $E_{\text{in}} = \frac{j}{10}$ and $E'_{\text{in}} = \frac{8 - j}{10}$. Take $\epsilon = 0.8$, so the thresholds are $\frac{\epsilon}{2} = 0.4$ and $\frac{\epsilon}{4} = 0.2$.

The number of ways to draw $j$ errors is $\binom{8}{j}\binom{12}{10-j}$, out of $\binom{20}{10} = 184{,}756$ draws in total:

| $j$ | Number of ways | $\lvert E_{\text{in}} - E'_{\text{in}}\rvert$ | $\lvert E_{\text{in}} - 0.4\rvert$ | Over the threshold? |
|---|---|---|---|---|
| 0 | 66 | 0.8 | 0.4 | yes |
| 1 | 1,760 | 0.6 | 0.3 | yes |
| 2 | 13,860 | 0.4 | 0.2 | no (exactly equal) |
| 3 | 44,352 | 0.2 | 0.1 | no |
| 4 | 64,680 | 0 | 0 | no |
| 5 | 44,352 | 0.2 | 0.1 | no |
| 6 | 13,860 | 0.4 | 0.2 | no (exactly equal) |
| 7 | 1,760 | 0.6 | 0.3 | yes |
| 8 | 66 | 0.8 | 0.4 | yes |

The third column is always twice the fourth, so "third column greater than 0.4" and "fourth column greater than 0.2" pick out the same four rows, which is the equivalence above. The true probability is

$$
\frac{66 + 1760 + 1760 + 66}{184756} = \frac{3652}{184756} = \frac{83}{4199} \approx 0.0198
$$

The upper bound from step three is $2\exp(-2 \times 0.2^2 \times 10) = 2\exp(-0.8) \approx 0.899$.

This result means two things. The inequality holds, $0.0198 \le 0.899$. It is also very loose, off by a factor of more than forty; Hoeffding uses only the general fact that "a sample average deviates from the population average" and none of the details of this particular bin. Looseness of this kind is present in all three steps, and the Fun Time below shows its accumulated effect.

### Putting it together: the VC bound

Multiply the constants of the three steps, $2 \times 2 = 4$ and $2 \times \frac{1}{16} = \frac{1}{8}$, and you get the **Vapnik-Chervonenkis (VC) bound** on page 25:

$$
\mathbb{P}\Big[\exists h \in \mathcal{H} \text{ s.t. } \big\lvert E_{\text{in}}(h) - E_{\text{out}}(h)\big\rvert > \epsilon\Big] \ \le\ 4\, m_{\mathcal{H}}(2N)\, \exp\Big(-\frac{1}{8}\epsilon^2 N\Big)
$$

| Step | What it does | Constants it leaves |
|---|---|---|
| 1 | replace $E_{\text{out}}$ by $E'_{\text{in}}$ | an extra 2 in front, $\epsilon$ becomes $\frac{\epsilon}{2}$ |
| 2 | decompose $\mathcal{H}$ by kind | $M$ becomes $m_{\mathcal{H}}(2N)$ |
| 3 | use Hoeffding without replacement | another 2, $\frac{\epsilon}{2}$ becomes $\frac{\epsilon}{4}$, and after squaring the exponent holds $\frac{1}{8}$ |

In the lecture, Lin calls this a very important theorem proved in a very hand-waving way, and introduces Vapnik and Chervonenkis as two very important figures in machine learning theory.

The same page then plugs in 2D perceptrons: the break point is 4, and $m_{\mathcal{H}}(N)$ is $O(N^3)$. A polynomial times $\exp(-\frac{1}{8}\epsilon^2 N)$: for $N$ large enough the exponential term wins, and the probability of the bad event goes to 0. The handout's conclusion is learning with 2D perceptrons feasible. The lecture connects this back to the algorithm: with enough data, pick the hypothesis with the smallest $E_{\text{in}}$ and its $E_{\text{out}}$ will probably be small too, so the PLA of [Foundations Lecture 2: Perceptrons and PLA](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm-en) really does learn something on two-dimensional data. Lin also points out that only two dimensions have been proved so far; where the break point of perceptrons in arbitrary dimension lies has not yet been covered.

### Fun Time: the VC bound with ten thousand examples

**Question (page 26):** For positive rays, $m_{\mathcal{H}}(N) = N + 1$. Plug it into the VC bound for $\epsilon = 0.1$ and $N = 10{,}000$. What is VC bound of BAD events?

1. $2.77 \times 10^{-87}$
2. $5.54 \times 10^{-83}$
3. $2.98 \times 10^{-1}$
4. $2.29 \times 10^{2}$

**Answer: 3.** The handout only writes simple calculation; the arithmetic is:

- $m_{\mathcal{H}}(2N) = 2N + 1 = 20{,}001$, and $4\, m_{\mathcal{H}}(2N) = 80{,}004$.
- The exponent is $-\frac{1}{8} \times 0.1^2 \times 10{,}000 = -12.5$, and $\exp(-12.5) \approx 3.727 \times 10^{-6}$.
- Multiplying: $80{,}004 \times 3.727 \times 10^{-6} \approx 0.298$.

The other choices (the matches below were worked out for this article; the handout does not explain them): choice 1 is Hoeffding with a single hypothesis, $2\exp(-2\epsilon^2 N) = 2\exp(-200) \approx 2.77 \times 10^{-87}$. Choice 2 puts the growth function straight into the original exponent, for example $2\, m_{\mathcal{H}}(2N)\exp(-2\epsilon^2 N) = 40{,}002 \times \exp(-200) \approx 5.54 \times 10^{-83}$, without changing the exponent to $-\frac{1}{8}\epsilon^2 N$. Choice 4 is greater than 1, and this article found no formula that produces it; an upper bound on a probability that exceeds 1 provides no information.

Choices 1 and 2 differ from the correct answer by more than eighty orders of magnitude, and the whole difference is in the exponent: $-2\epsilon^2 N = -200$ becomes $-\frac{1}{8}\epsilon^2 N = -12.5$, smaller by a factor of 16. The handout's note is that the BAD probability bound is not very small even with 10000 examples. The explanation in the lecture is that the derivation used many approximations, so this bound is not necessarily that accurate; why it is still worth so much effort to derive when it is not accurate is left for the next lecture.

### Plugging in 2D perceptrons

What follows is a calculation made up for this article, not from the slides. Use the upper bound from page 19, $m_{\mathcal{H}}(2N) \le \frac{1}{6}(2N)^3 + \frac{5}{6}(2N) + 1$, again with $\epsilon = 0.1$:

| $N$ | Upper bound on $m_{\mathcal{H}}(2N)$ | $\exp(-\frac{1}{8}\epsilon^2 N)$ | VC bound |
|---|---|---|---|
| 10,000 | about $1.33 \times 10^{12}$ | $3.73 \times 10^{-6}$ | about $1.99 \times 10^{7}$ |
| 20,000 | about $1.07 \times 10^{13}$ | $1.39 \times 10^{-11}$ | about $593$ |
| 30,000 | about $3.60 \times 10^{13}$ | $5.18 \times 10^{-17}$ | about $0.0075$ |
| 100,000 | about $1.33 \times 10^{15}$ | $5.17 \times 10^{-55}$ | about $2.8 \times 10^{-39}$ |

What this result means: at $N = 10{,}000$ the upper bound is twenty million, far greater than 1, and guarantees nothing; as $N$ goes from twenty thousand to thirty thousand, the bound falls from 593 to 0.0075. Trying values one by one, the bound first drops to 1 or below at $N = 25{,}711$, and first drops to 0.05 or below at $N = 28{,}341$. Over this range the polynomial term grows only a little more than threefold, while the exponential term shrinks by a factor of about $2.7 \times 10^{5}$ for every additional ten thousand examples. This is what "a polynomial eventually loses to an exponential" looks like in practice.

Note that these numbers are the amount of data the guarantee needs, not the amount of data needed in practice to learn a 2D perceptron. The reasons the bound is loose have all appeared earlier: $B(N, k)$ can be larger than the true growth function, the union bound counts overlapping bad events more than once, and Hoeffding itself is loose.

The summary on page 27 condenses each of the four sections into a line: break point "breaks" consequent points; $B(N, k)$ bounds $m_{\mathcal{H}}(N)$ with break point $k$; $B(N, k)$ is $\text{poly}(N)$; $m_{\mathcal{H}}(N)$ can replace $M$ with a few changes. The preview of the next lecture is how to "use" the break point.

## Self-check

**1. When the minimum break point is $k = 2$, what is the largest number of dichotomies on four points? Write down a set of dichotomies that reaches this number.**

Answer: the recurrence inequality gives $B(4, 2) \le B(3, 2) + B(3, 1) = 4 + 1 = 5$. Positive rays on four points ordered left to right produce ○○○○, ×○○○, ××○○, ×××○, ××××, 5 in all; on any two points "○ on the left, × on the right" is missing, so no two points are shattered. The upper bound is therefore attained, $B(4, 2) = 5$, which also equals the theorem's $\binom{4}{0} + \binom{4}{1} = 5$. (This article confirmed by exhaustive search with a program that the maximum is 5.)

**2. The table says $B(5, 3) \le 16$. Without a program, show that $B(5, 3)$ is exactly 16.**

Answer: it is enough to find one set of 16 dichotomies in which no three points are shattered. Positive intervals have break point 3 and $m_{\mathcal{H}}(5) = \frac{25}{2} + \frac{5}{2} + 1 = 16$, and their 16 dichotomies on five points form such a set. The upper bound is 16 and something reaches 16, so they are equal.

**3. In deriving the recurrence inequality, why is the paired $\alpha$ compared with $B(N-1, k-1)$ and not with $B(N-1, k)$? If we could only write $\alpha \le B(N-1, k)$, what would the conclusion become?**

Criteria: the answer should say that every paired dichotomy has both ○ and × on $\mathbf{x}_N$, so as soon as $k-1$ of the first $N-1$ points are shattered, adding $\mathbf{x}_N$ makes $k$ shattered points; hence the restriction on $\alpha$ is one level stricter than the original. Writing only $\alpha \le B(N-1, k)$ gives $B(N, k) \le 2B(N-1, k)$, at most doubling with every additional point; the upper bound is still exponential and no polynomial can be proved.

**4. Positive intervals have $m_{\mathcal{H}}(N) = \frac{1}{2}N^2 + \frac{1}{2}N + 1$. With $\epsilon = 0.1$, compute the VC bound for $N = 10{,}000$ and for $N = 20{,}000$.**

Answer: at $N = 10{,}000$, $m_{\mathcal{H}}(20{,}000) = 200{,}010{,}001$; times 4 is $800{,}040{,}004$; times $\exp(-12.5) \approx 3.727 \times 10^{-6}$ is about $2{,}981$, greater than 1, so there is no guarantee. At $N = 20{,}000$, $m_{\mathcal{H}}(40{,}000) = 800{,}020{,}001$; times 4 is $3{,}200{,}080{,}004$; times $\exp(-25) \approx 1.389 \times 10^{-11}$ is about $0.044$. With the growth function going from linear to quadratic, ten thousand examples go from 0.298 to no guarantee, and it takes twenty thousand to push the bound below 0.05.

**5. Some fixed $h$ has $E_{\text{in}} = 0.3$ on $\mathcal{D}$ and $E'_{\text{in}} = 0.1$ on $\mathcal{D}'$, with $\epsilon = 0.3$. How does each of the two forms in step three judge it? Then explain why the first step of the proof cannot be skipped.**

Answer and criteria: $\lvert E_{\text{in}} - E'_{\text{in}}\rvert = 0.2 > \frac{\epsilon}{2} = 0.15$; the bin average is $0.2$, and $\lvert 0.3 - 0.2\rvert = 0.1 > \frac{\epsilon}{4} = 0.075$. Both forms judge it as over the threshold, because the second is just the first with both sides divided by 2. The reason for the first step should say: $E_{\text{out}}$ depends on the whole input space, and two hypotheses with the same dichotomy on the $N$ points can still have different $E_{\text{out}}$, so they cannot be sorted into finitely many kinds; after switching to $E'_{\text{in}}$, the event depends only on the $2N$ points, and only then can $m_{\mathcal{H}}(2N)$ kinds be counted.

## Exercises and corresponding reading

**Both semesters list this lecture as optional viewing.** The [Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) lists this lecture's four videos under W4 (09/30) as "suggested watching (anytime)", whereas the previous lecture's videos are "required watching (before class)". The [Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) puts this lecture under "optional" and lists two versions side by side: Caltech's Yaser Abu-Mostafa's [Lecture 6 in English](https://www.youtube.com/watch?v=6FWRijsmLtE), and Lin's four segments in Mandarin. If you only want to keep reading, two conclusions are enough to carry forward: a hypothesis set with a break point has a polynomial growth function, and the VC bound is $4\, m_{\mathcal{H}}(2N)\exp(-\frac{1}{8}\epsilon^2 N)$.

**Textbook.** According to the Fall 2024 course page, this lecture corresponds to 2.1.2 of [Learning from Data](http://amlbook.com) (LFD).

**English counterpart.** Lecture 6 of [Caltech Learning from Data](https://work.caltech.edu/telecourse) is also called Theory of Generalization and uses the same textbook.

**Homework.** The bonus problem Q13 of [Fall 2024 HW3](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf) asks for a proof of the lower bound on $B(N, k)$, which is the other direction of the "≤ can be =" that page 18 of the handout leaves to the reader. [Fall 2024 HW2](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw2/hw2_red.pdf) covers Foundations Lectures 4 to 7; its growth-function problems are discussed in the article for [Foundations Lecture 5: Training versus Testing](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function-en). The guide to the whole assignment is in [Foundations Homework](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide-en).

**Hands-on.** The thing most worth doing by hand in this lecture is the small program from the lecture: list the 16 length-4 ○× vectors, enumerate their $2^{16}$ subsets, find the largest subset in which no three points are shattered, and confirm that it has 11 dichotomies; change the condition to no two points and confirm that it has 5. Pure Python finishes in a few seconds.

**Further reading.** [Stanford CS229 Lecture 6: Bias and Variance, Regularization, and Model Selection](/posts/ai/2026-10-12-stanford-cs229-lecture-06-bias-variance-regularization-en) approaches the same generalization question by a different route and makes a useful comparison.

**Next lecture.** [Foundations Lecture 7: The VC Dimension](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error-en) names "the largest non-break point" the VC dimension and takes up the two things this lecture leaves open: where the break point of perceptrons in arbitrary dimension lies, and why this very loose bound is still useful.

## Course video sources

Original videos: [Restriction of Break Point](https://www.youtube.com/watch?v=rUFqB5Z3YHQ), [Bounding Function: Basic Cases](https://www.youtube.com/watch?v=OmRekto9rkc), [Bounding Function: Inductive Cases](https://www.youtube.com/watch?v=6jtWUmaBqFU), [A Pictorial Proof](https://www.youtube.com/watch?v=GcxpsIvR7t8)

- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

Checked: 2026-10-13. The video IDs, titles, and lengths were taken from the official playlist on that day; the videos have no caption track on YouTube, and what this article reports from the lecture comes from transcripts made for it.

## Update Log

- 2026-10-13: The series now has one article per lecture; this lecture is a newly split-out article, written from the handout and the video transcripts.

## References

- [Foundations Lecture 6 handout, 06_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/06_handout.pdf): the main source for this article. The derivations in the four sections, the tables, the four Fun Time questions, and the descriptions of the figures all come from this handout.
- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf): the IDs and titles of the four videos; what the text reports as said "in the lecture" is paraphrased from machine transcripts of these four videos.
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/): the official entry for handouts and recordings.
- [MOOC slide errata](https://www.csie.ntu.edu.tw/~htlin/mooc/errata.php): the official errata page, worth checking against while reading the handout.
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/): this lecture is listed under W4 as suggested watching.
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/): this lecture is listed as optional, along with the corresponding LFD section.
- [Fall 2024 Homework 3 (hw3_red.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf): bonus problem Q13 proves the lower bound on the bounding function.
- [Fall 2024 Homework 2 (hw2_red.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw2/hw2_red.pdf): the assignment covering Foundations Lectures 4 to 7.
- [Caltech Learning from Data telecourse](https://work.caltech.edu/telecourse): the English-language course using the same textbook.
- [Caltech Lecture 6 (Yaser Abu-Mostafa)](https://www.youtube.com/watch?v=6FWRijsmLtE): the English version of Theory of Generalization listed alongside on the Fall 2024 course page.
- [Learning from Data textbook website](http://amlbook.com): the source of 2.1.2.
- [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques: Course Overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en): where this lecture sits in the whole course and the reading routes.
