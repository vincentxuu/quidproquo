---
title: "The VC Dimension: Measuring Model Complexity | NTU Hsuan-Tien Lin Machine Learning Foundations Lecture 7"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, learning-theory, perceptron]
lang: en
math: true
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 7
tldr: "This lecture names the largest non-break point the VC dimension d_VC, proves in two parts (an invertible matrix, then linear dependence) that d-dimensional perceptrons have d_VC = d + 1, and rewrites the VC bound as E_out ≤ E_in + Ω: the larger d_VC is, the easier it is to push E_in down, but the larger the complexity penalty Ω becomes. By the bound, ε = δ = 0.1 and d_VC = 3 need 29,300 examples, roughly 10,000 times d_VC; in practice 10 times is often enough."
description: "A guide to Lecture 7 of NTU Hsuan-Tien Lin's Machine Learning Foundations, The VC Dimension: the definition of the VC dimension and four examples, the two-part proof that d-dimensional perceptrons have d_VC = d + 1, the degrees-of-freedom intuition, the derivation that rewrites the VC bound as a penalty for model complexity and as sample complexity, and why the bound is loose, with hand-computed four-point examples and an explanation of every Fun Time question."
draft: false
glossary:
  - term: "VC dimension"
    aliases: ["d_VC", "Vapnik-Chervonenkis dimension"]
    definition: "The largest number of points a hypothesis set H can shatter, that is, the largest N for which m_H(N) = 2^N; it equals the minimum break point minus 1. When this holds for every N, it is written as infinity."
    context: "Foundations Lecture 7 uses it as the yardstick for model complexity; d-dimensional perceptrons have d_VC = d + 1."
    links:
      - label: "Foundations Lecture 7 handout"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/07_handout.pdf"
  - term: "penalty for model complexity"
    aliases: ["model complexity penalty", "Ω(N, H, δ)"]
    definition: "The extra term after the VC bound is rewritten as E_out ≤ E_in + Ω: Ω = √((8/N)·ln(4(2N)^d_VC / δ)). It grows with d_VC and shrinks as N grows."
    context: "Foundations Lecture 7 uses it to show that a more powerful hypothesis set is not always better."
  - term: "sample complexity"
    aliases: ["number of examples needed"]
    definition: "Given a tolerated error ε, a tolerated failure probability δ, and d_VC, how many examples N it takes for the right-hand side of the VC bound to be at most δ."
    context: "Foundations Lecture 7 finds that theory asks for about 10,000 times d_VC, while practical experience says 10 times."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error)

**Video status: Videos included.** This article is written from the official MOOC handout [07_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/07_handout.pdf) and transcripts of this lecture's four official videos, with formulas following the handout. The transcripts are machine transcripts made for this article (Whisper), not official captions, and no human has proofread them. The videos are taught in Mandarin; the slides are in English. Each section opens with its official video and the approximate time ranges. Page numbers refer to the number at the lower right of each slide (0/26 to 26/26), and wherever the text says "in the lecture" it is paraphrasing what is said in the videos.

This is Foundations Lecture 7 in [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en). The Roadmap on page 1 of the handout divides Foundations into four questions, and this lecture sits under the second, "Why Can Machines Learn?". The conclusion of the previous lecture, [Foundations Lecture 6: Theory of Generalization](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-06-theory-of-generalization-en), takes up a single line on the Roadmap: as long as the growth function $m_{\mathcal{H}}(N)$ breaks somewhere and $N$ is large enough, $E_{\text{out}} \approx E_{\text{in}}$ is possible.

That conclusion is awkward to use. Every time the hypothesis set changes, you have to find its break point again and rewrite the upper bound. This lecture does three things: it replaces the break point with one number, called the VC dimension; it computes that number for perceptrons; and it uses that number to reread the VC bound and see what the bound says about how complex a model to choose and how much data is needed.

The prerequisites are dichotomies, the growth function, shattering, and break points from [Foundations Lecture 5: Training versus Testing](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function-en), the bounding function $B(N, k)$ and the VC bound from the previous lecture, and matrix inverses and linear dependence from linear algebra. After reading, you should be able to decide for yourself how to prove the VC dimension of a hypothesis set (what each of the two directions requires), rewrite the two-part proof for perceptrons, derive the square root in $\Omega$ from the VC bound, and plug in numbers to compute how much the bound actually guarantees for a given $N$.

## Giving the break point a formal name: the definition of the VC dimension

```youtube
url: https://www.youtube.com/watch?v=XxPB9GlJEUk
title: The VC Dimension :: Definition of VC Dimension @ Machine Learning Foundations (機器學習基石)
```

(Video 00:19–03:06 reviews the upper bound on the growth function, 03:06–06:19 reviews the VC bound and the conditions for learning, 06:19–09:03 is the definition, 09:03–10:29 the four examples, 10:29–11:50 the relation between the VC dimension and learning, and Fun Time follows.)

### Recap: the bounding function can be loosened further to N to the power k−1

The lecture begins by reviewing the previous one. In the lecture, Lin describes generalization as carrying over from the examples you were shown: examples are given during training, and performance at test time resembles performance during training. What the previous lecture proved is that as soon as the growth function shows a glimmer of hope (a break point) at some $k$, it is covered by the bounding function $B(N, k)$ (page 2 of the handout):

$$
m_{\mathcal{H}}(N) \ \le\ B(N, k) = \sum_{i=0}^{k-1}\binom{N}{i}
$$

The highest term of this sum is $N^{k-1}$. The handout puts the tables of $B(N, k)$ and $N^{k-1}$ side by side; merged into one, the two tables look like this (each cell is written as "$B(N,k)$ / $N^{k-1}$"):

| $N$ | $k=1$ | $k=2$ | $k=3$ | $k=4$ | $k=5$ |
|---|---|---|---|---|---|
| 1 | 1 / 1 | 2 / 1 | 2 / 1 | 2 / 1 | 2 / 1 |
| 2 | 1 / 1 | 3 / 2 | 4 / 4 | 4 / 8 | 4 / 16 |
| 3 | 1 / 1 | 4 / 3 | 7 / 9 | 8 / 27 | 8 / 81 |
| 4 | 1 / 1 | 5 / 4 | 11 / 16 | 15 / 64 | 16 / 256 |
| 5 | 1 / 1 | 6 / 5 | 16 / 25 | 26 / 125 | 31 / 625 |
| 6 | 1 / 1 | 7 / 6 | 22 / 36 | 42 / 216 | 57 / 1296 |

The handout shades the block with $N \ge 2$ and $k \ge 3$. Inside that block the number on the right is never smaller than the one on the left, so the handout writes "provably & loosely":

$$
m_{\mathcal{H}}(N) \ \le\ B(N, k) = \sum_{i=0}^{k-1}\binom{N}{i} \ \le\ N^{k-1} \qquad (N \ge 2,\ k \ge 3)
$$

Neither condition can be dropped. The $k = 2$ column is $N + 1$ against $N$, with the right side always smaller by 1; the $N = 1$ row is 2 against 1 from $k = 2$ onward. The handout does not write out a proof of the second inequality. This article computed every cell for $N = 2$ to 300 and $k = 3$ to 40 in Python and found no counterexample; that is a numerical check, not a proof.

The benefit of switching to $N^{k-1}$ is stated in very practical terms in the lecture: from now on, an upper bound on the growth function no longer has to carry $B$ or that sum around. A simple polynomial is enough.

### Recap: the VC bound and the three conditions for learning

Page 3 of the handout writes the previous lecture's VC bound once more. For any $g = \mathcal{A}(\mathcal{D}) \in \mathcal{H}$ that the algorithm picks from the data:

$$
\begin{aligned}
\mathbb{P}_{\mathcal{D}}\Big[\big|E_{\text{in}}(g) - E_{\text{out}}(g)\big| > \epsilon\Big]
&\le \mathbb{P}_{\mathcal{D}}\Big[\exists\, h \in \mathcal{H} \ \text{s.t.}\ \big|E_{\text{in}}(h) - E_{\text{out}}(h)\big| > \epsilon\Big] \\
&\le 4\, m_{\mathcal{H}}(2N)\exp\Big(-\frac{1}{8}\epsilon^2 N\Big) \\
&\le 4\,(2N)^{k-1}\exp\Big(-\frac{1}{8}\epsilon^2 N\Big)
\end{aligned}
$$

Each of the three inequalities has its own reason:

1. $g$ is one of the hypotheses in $\mathcal{H}$. If $g$ goes wrong, then at least one $h$ in $\mathcal{H}$ goes wrong, so the event in the first line is contained in the event in the second. In the lecture, Lin states it the other way around: since most of the time no $h$ goes wrong at all, whatever the algorithm chooses is covered by this bound.
2. The second inequality is the VC bound proved in the previous lecture.
3. The third inequality applies the $m_{\mathcal{H}}(N) \le N^{k-1}$ from a moment ago to $2N$ points; the handout notes "if $k$ exists" above the inequality sign.

On the slide, the condition originally reads "for $N \ge 2$, $k \ge 3$", with $N \ge 2$ crossed out. In the lecture, Lin explains that the proof of the VC bound already assumes $N$ is large, so that one is not a new condition; $k \ge 3$ is the newly added one. When $k$ is smaller than 3, the only consequence is that the expression $N^{k-1}$ cannot be used, and some other upper bound can be used instead. This article adds one ready-made choice: use $B(N, k)$ itself.

The lower half of the same page breaks "learning works" into conditions:

| Condition | The handout's label | What you get |
|---|---|---|
| $m_{\mathcal{H}}(N)$ breaks at $k$ | good $\mathcal{H}$ | |
| $N$ large enough | good $\mathcal{D}$ | The first two together: probably generalized, $E_{\text{out}} \approx E_{\text{in}}$ |
| $\mathcal{A}$ picks a $g$ with small $E_{\text{in}}$ | good $\mathcal{A}$ | All three together: probably learned |

The word "probably" comes from the fact that the bound is a statement about probability. The handout adds "good luck" on the last line, and in the lecture Lin explains that besides a good hypothesis set, good data, and a good algorithm, you also need a bit of good luck.

### Definition: the maximum non-break point

Under the title on page 4, the handout writes "the formal name of maximum non-break point". In the lecture, Lin explains that the formal name is not given to the break point itself but to the point just before it: if the minimum break point is $k$, then $k - 1$ is the maximum non-break point.

> **Definition.** The VC dimension of $\mathcal{H}$, denoted $d_{\text{VC}}(\mathcal{H})$, is the largest $N$ for which $m_{\mathcal{H}}(N) = 2^N$.

The handout then gives two equivalent statements: it is the most inputs that $\mathcal{H}$ can shatter, and it equals "minimum $k$" minus 1. The lecture adds the case the definition does not write down: when no minimum break point exists, the VC dimension is said to be infinite.

Two statements follow directly from the definition:

- $N \le d_{\text{VC}}$: $\mathcal{H}$ can shatter **some** $N$ inputs.
- $k > d_{\text{VC}}$: $k$ is a break point for $\mathcal{H}$.

The word "some" in the first statement is the easiest thing to misread in this lecture. Lin stresses it in the lecture: having no more data points than the VC dimension only means that there exists some set of that many points that can be shattered, and the set we actually hold need not be one of them. The second statement has no "some": beyond the VC dimension, no set of that many points can be shattered.

An addition in this article: why the first statement also holds for $N$ smaller than $d_{\text{VC}}$. If some $d_{\text{VC}}$ points are shattered, take any $N$ of them; every labeling of those $N$ points can be extended to some labeling of the $d_{\text{VC}}$ points, and the latter can be produced, so the former can too.

Replace the $k - 1$ in the recap's $m_{\mathcal{H}}(N) \le N^{k-1}$ with $d_{\text{VC}}$, and the condition $k \ge 3$ becomes $d_{\text{VC}} \ge 2$ (bottom of page 4 of the handout):

$$
m_{\mathcal{H}}(N) \ \le\ N^{d_{\text{VC}}} \qquad (N \ge 2,\ d_{\text{VC}} \ge 2)
$$

### The VC dimensions of the four old examples

Page 5 of the handout assigns a VC dimension to each of the four hypothesis sets from [Foundations Lecture 5: Training versus Testing](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function-en). The two columns on the right are this article's results from plugging into the growth function:

| Hypothesis set | $m_{\mathcal{H}}(N)$ | $d_{\text{VC}}$ | At $N = d_{\text{VC}}$ | At $N = d_{\text{VC}} + 1$ |
|---|---|---|---|---|
| positive rays | $N + 1$ | 1 | $2 = 2^1$ | $3 < 2^2$ |
| positive intervals | $\frac{1}{2}N^2 + \frac{1}{2}N + 1$ | 2 | $4 = 2^2$ | $7 < 2^3$ |
| convex sets | $2^N$ | $\infty$ | $2^N$ for every $N$ | no break point |
| 2D perceptrons | $\le N^3$ (for $N \ge 2$) | 3 | $8 = 2^3$ | at most $14 < 2^4$ |

Next to each row the slide draws the shattered points: one point for positive rays, two for positive intervals, a ring of points on a circle for convex sets, and three non-collinear points for 2D perceptrons. The lecture walks through the rows: for positive rays, one point can be labeled both ways but two points cannot; for convex sets, as long as the points are placed on a circle, any number of them can be shattered, so the answer is infinity.

The positive rays row also demonstrates that the condition $d_{\text{VC}} \ge 2$ cannot be dropped: its $d_{\text{VC}} = 1$, yet $m_{\mathcal{H}}(N) = N + 1 > N^1$.

The conclusion of this page is a single line: good: finite $d_{\text{VC}}$. In the lecture, Lin matches it to the previous lecture's wording: a good hypothesis set used to be one that shows a glimmer of hope, and is now one with a finite VC dimension.

### What a finite VC dimension guarantees

Page 6 of the handout: if $d_{\text{VC}}$ is finite, $g$ "will" generalize, $E_{\text{out}}(g) \approx E_{\text{in}}(g)$. Moreover, this holds:

- Regardless of the learning algorithm $\mathcal{A}$. The extreme case given in the lecture: even with a terrible algorithm that picks a $g$ with very high $E_{\text{in}}$, its $E_{\text{out}}$ will still be close to its $E_{\text{in}}$, though that is of little use to us.
- Regardless of the input distribution $P$. We do not need to know what distribution the data came from.
- Regardless of the target function $f$. So $f$ can stay unknown all along.

The slide redraws the learning flow diagram from earlier, the version with the probability distribution added ($P$ was added in [Foundations Lecture 4: Feasibility of Learning](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning-en)): the unknown $f$ generates the training examples $\mathcal{D}$, the unknown $P$ generates both the training $\mathbf{x}_1, \dots, \mathbf{x}_N$ and the future test $\mathbf{x}$, and the algorithm $\mathcal{A}$ picks $g \approx f$ from the hypothesis set $\mathcal{H}$. In the diagram the three positions $f$, $P$, and $\mathcal{A}$ are all drawn in gray, meaning the guarantee does not depend on them. The yellow box at the lower right reads "worst case" guarantee on generalization: it holds even in the worst case. This benefit of assuming nothing becomes the reason the bound is so loose in the subsection "Why it is a thousand times looser".

### Fun Time: what follows from one set of points that cannot be shattered

**Question (page 7):** If there is a set of $N$ inputs that cannot be shattered by $\mathcal{H}$. Based only on this information, what can we conclude about $d_{\text{VC}}(\mathcal{H})$?

1. $d_{\text{VC}}(\mathcal{H}) > N$
2. $d_{\text{VC}}(\mathcal{H}) = N$
3. $d_{\text{VC}}(\mathcal{H}) < N$
4. no conclusion can be made

**Answer: 4.** The handout's answer: it is possible that there is another set of $N$ inputs that can be shattered, which means $d_{\text{VC}} \ge N$; it is also possible that no set of $N$ inputs can be shattered, which means $d_{\text{VC}} < N$. Neither case can be ruled out by one non-shattering set.

This article gives one concrete instance of each. $\mathcal{H}$ is 2D perceptrons and $N = 3$: three points on one straight line cannot be shattered (the labeling with × in the middle and ○ on both sides cannot be produced), but three other non-collinear points can, so $d_{\text{VC}} = 3 \ge N$. $\mathcal{H}$ is positive rays and $N = 2$: no two points can be shattered, so $d_{\text{VC}} = 1 < N$. The two examples have exactly the same given condition and opposite conclusions, so choices 1, 2, and 3 cannot be chosen.

The lecture's summary is that "there exists a set" and "for all sets" in the definition say different things, and you need to tell them apart before moving on. The two-part proof for perceptrons that comes next uses one of each.

## Why the VC dimension of d-dimensional perceptrons is d+1

```youtube
url: https://www.youtube.com/watch?v=WQzhc1IdB_I
title: The VC Dimension :: VC Dimension of Perceptrons @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–01:49 looks back at 2D PLA, 01:49–03:19 guesses $d+1$, 03:19–07:10 proves "greater than or equal to", 07:10–10:24 looks at "less than or equal to" through a four-point special case, 10:24–13:01 is the general case, and Fun Time follows.)

### Back to PLA: the two-dimensional story is already complete

Page 8 of the handout brings back PLA from [Foundations Lecture 2: Perceptrons and PLA](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm-en) and draws it as two lines of reasoning that merge:

| | The line on the left | The line on the right |
|---|---|---|
| Premise | linearly separable $\mathcal{D}$ | $\mathbf{x}_n \sim P$, $y_n = f(\mathbf{x}_n)$ |
| Basis | PLA can converge | $\mathbb{P}[\lvert E_{\text{in}}(g) - E_{\text{out}}(g)\rvert > \epsilon] \le \dots$, by $d_{\text{VC}} = 3$ |
| Needs | number of corrections $T$ large | data size $N$ large |
| Gives | $E_{\text{in}}(g) = 0$ | $E_{\text{out}}(g) \approx E_{\text{in}}(g)$ |

Only the two results together give $E_{\text{out}}(g) \approx 0$. In the lecture, Lin describes it as two story lines coming together, and only then can we say something has been learned.

This picture holds only in two dimensions, because $d_{\text{VC}} = 3$ is the number for 2D perceptrons. PLA can be run on data of any dimension, so the bottom of the slide asks: what about $\mathbf{x}$ with more than 2 features? Answering that requires the VC dimension of $d$-dimensional perceptrons.

### Guessing d+1 from one and two dimensions

Page 9 lists the two known examples:

- A 1D perceptron is positive rays plus negative rays, with $d_{\text{VC}} = 2$. The slide gives only this number; this article adds the computation: its growth function is $2N$ (worked out in the Fun Time of Foundations Lecture 5), which gives $4 = 2^2$ at $N = 2$ and $6 < 2^3$ at $N = 3$.
- 2D perceptrons have $d_{\text{VC}} = 3$. The slide draws two small figures: three non-collinear points (which can be shattered, so $d_{\text{VC}} \ge 3$), and four points in a diamond with ○ on top and bottom and × on left and right (a labeling that cannot be produced, used to illustrate $d_{\text{VC}} \le 3$).

The lecture adds a remark about the second figure: the slide draws only one four-point set that cannot be shattered, but what actually counts is that no set of four points can be shattered.

One dimension gives 2 and two dimensions give 3, so the guess for $d$ dimensions is $d + 1$; the slide puts a question mark over the equals sign. Lin pokes fun at this in the lecture: learning from just two examples is not a smart thing to do, so this can only count as a conjecture. Removing the question mark takes two directions:

$$
d_{\text{VC}} \ge d + 1 \qquad \text{and} \qquad d_{\text{VC}} \le d + 1
$$

### Extra Fun Time: which statement proves "at least d+1"

**Question (page 10):** What statement below shows that $d_{\text{VC}} \ge d + 1$?

1. There are some $d + 1$ inputs we can shatter.
2. We can shatter any set of $d + 1$ inputs.
3. There are some $d + 2$ inputs we cannot shatter.
4. We cannot shatter any set of $d + 2$ inputs.

**Answer: 1.** The handout's explanation: $d_{\text{VC}}$ is the maximum $N$ for which $m_{\mathcal{H}}(N) = 2^N$, and $m_{\mathcal{H}}(N)$ is the most number of dichotomies of $N$ inputs. So if we can find $2^{d+1}$ dichotomies on some $d + 1$ inputs, $m_{\mathcal{H}}(d+1) = 2^{d+1}$ and hence $d_{\text{VC}} \ge d + 1$.

The other choices: choice 2 would of course also suffice if it were true, but it asks for too much, and for perceptrons it is simply false (three collinear points are the counterexample in two dimensions). Choice 3 is the situation from the previous Fun Time, from which nothing can be concluded. Choice 4 says $d + 2$ is a break point, which gives the upper bound $d_{\text{VC}} \le d + 1$, the opposite direction.

### Proving "at least d+1": pick a special set of points and solve a linear system

Page 11 picks $d + 1$ "trivial" inputs: the origin, plus one point on each coordinate axis. Recall that the perceptron prepends the constant coordinate $x_0 = 1$ to every $\mathbf{x}$, so stacking these points row by row gives the matrix

$$
\mathrm{X} = \begin{bmatrix} \text{—}\ \mathbf{x}_1^\top\ \text{—} \\ \text{—}\ \mathbf{x}_2^\top\ \text{—} \\ \text{—}\ \mathbf{x}_3^\top\ \text{—} \\ \vdots \\ \text{—}\ \mathbf{x}_{d+1}^\top\ \text{—} \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 & \cdots & 0 \\ 1 & 1 & 0 & \cdots & 0 \\ 1 & 0 & 1 & & 0 \\ \vdots & \vdots & & \ddots & 0 \\ 1 & 0 & \cdots & 0 & 1 \end{bmatrix}
$$

The slide colors the 1s in the leftmost column gray, and in the lecture Lin explains that this is the zeroth dimension slipped in to represent the threshold. In two dimensions, the three points are $(0,0)$, $(1,0)$, and $(0,1)$. The handout marks the key fact in a yellow box at the bottom of the page: $\mathrm{X}$ is invertible. This article adds the reason in one sentence: it is a lower triangular matrix with all 1s on the diagonal, so its determinant is 1.

Page 12 explains what invertibility buys. To shatter means: for any label vector $\mathbf{y} = (y_1, \dots, y_{d+1})$, where each $y_n$ is $+1$ or $-1$, we can find $\mathbf{w}$ such that

$$
\text{sign}(\mathrm{X}\mathbf{w}) = \mathbf{y}
$$

The sign is hard to work with, so ask for something stronger instead: that $\mathrm{X}\mathbf{w}$ equals $\mathbf{y}$ outright, without taking signs. The components of $\mathbf{y}$ are already $\pm 1$, and taking their signs leaves them unchanged, so

$$
\text{sign}(\mathrm{X}\mathbf{w}) = \mathbf{y} \ \Longleftarrow\ \mathrm{X}\mathbf{w} = \mathbf{y} \ \Longleftrightarrow\ \mathbf{w} = \mathrm{X}^{-1}\mathbf{y}
$$

Look carefully at the direction of the arrows: the left one goes one way, since $\mathrm{X}\mathbf{w} = \mathbf{y}$ is a sufficient condition and not a necessary one; the two-way arrow on the right relies on $\mathrm{X}$ being invertible. $\mathrm{X}\mathbf{w} = \mathbf{y}$ is a linear system with $d + 1$ unknowns and $d + 1$ equations, and invertibility guarantees it has a solution. The lecture wraps up: the same recipe works for all $2^{d+1}$ choices of $\mathbf{y}$, each finding its own $\mathbf{w}$, so this special set of points is shattered and $d_{\text{VC}} \ge d + 1$.

This article solves $\mathbf{w} = \mathrm{X}^{-1}\mathbf{y}$ explicitly. The first equation (the origin) is $w_0 = y_1$; equation $i + 1$ (the point on axis $i$) is $w_0 + w_i = y_{i+1}$. So

$$
w_0 = y_1, \qquad w_i = y_{i+1} - y_1 \quad (i = 1, \dots, d)
$$

**Numerical example ($d = 2$, computed by this article from the formula above; not on the handout).** The three points are $\mathbf{x}_1 = (0,0)$, $\mathbf{x}_2 = (1,0)$, and $\mathbf{x}_3 = (0,1)$, and each of the eight labelings has its own $\mathbf{w} = (w_0, w_1, w_2)$:

| $(y_1, y_2, y_3)$ | $\mathbf{w} = (y_1,\ y_2 - y_1,\ y_3 - y_1)$ | $\mathrm{X}\mathbf{w} = (w_0,\ w_0 + w_1,\ w_0 + w_2)$ |
|---|---|---|
| $(+1, +1, +1)$ | $(1, 0, 0)$ | $(1, 1, 1)$ |
| $(+1, +1, -1)$ | $(1, 0, -2)$ | $(1, 1, -1)$ |
| $(+1, -1, +1)$ | $(1, -2, 0)$ | $(1, -1, 1)$ |
| $(+1, -1, -1)$ | $(1, -2, -2)$ | $(1, -1, -1)$ |
| $(-1, +1, +1)$ | $(-1, 2, 2)$ | $(-1, 1, 1)$ |
| $(-1, +1, -1)$ | $(-1, 2, 0)$ | $(-1, 1, -1)$ |
| $(-1, -1, +1)$ | $(-1, 0, 2)$ | $(-1, -1, 1)$ |
| $(-1, -1, -1)$ | $(-1, 0, 0)$ | $(-1, -1, -1)$ |

Every row of the rightmost column equals the leftmost column, so all eight dichotomies can be produced. Take the second row: $\mathbf{w} = (1, 0, -2)$ corresponds to the line $1 - 2x_2 = 0$, that is, the horizontal line $x_2 = \frac{1}{2}$. The origin and $(1,0)$ are below the line and get $+1$; $(0,1)$ is above it and gets $-1$. This article also checked the same formula by program on all 64 labelings for $d = 5$, and it holds for every one.

What this result means: when proving "at least", we choose the points ourselves, and we can put them where the linear system is easiest to solve.

### Extra Fun Time: which statement proves "at most d+1"

**Question (page 13):** With the same four choices, what statement shows that $d_{\text{VC}} \le d + 1$?

**Answer: 4.** The handout's explanation: if we cannot find $2^{d+2}$ dichotomies on **any** $d + 2$ inputs (i.e. $d + 2$ is a break point), $m_{\mathcal{H}}(d+2) < 2^{d+2}$ and hence $d_{\text{VC}} < d + 2$. That is, $d_{\text{VC}} \le d + 1$.

Choice 3 finds only one set of $d + 2$ points that cannot be shattered; other sets might be, so no upper bound follows. Choices 1 and 2 are about $d + 1$ points and give lower bounds.

The two questions together are the skeleton of the whole section: a lower bound needs only one example, while an upper bound has to hold for all possible data. Lin admits in the lecture that the latter is harder, so the proof starts from a special case.

### Proving "at most d+1": a 2D special case

Page 14 adds a fourth point $(1,1)$ to the three points from before, so that the four points form a square:

$$
\mathrm{X} = \begin{bmatrix} \text{—}\ \mathbf{x}_1^\top\ \text{—} \\ \text{—}\ \mathbf{x}_2^\top\ \text{—} \\ \text{—}\ \mathbf{x}_3^\top\ \text{—} \\ \text{—}\ \mathbf{x}_4^\top\ \text{—} \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 \\ 1 & 1 & 0 \\ 1 & 0 & 1 \\ 1 & 1 & 1 \end{bmatrix}
$$

The figure on the slide: $\mathbf{x}_1$ at the lower left is ×, $\mathbf{x}_2$ at the lower right and $\mathbf{x}_3$ at the upper left are ○, and $\mathbf{x}_4$ at the upper right carries a question mark, with a note that ? cannot be ×. This is the labeling seen in [Foundations Lecture 5](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function-en), with one label on each diagonal, that cannot be produced. Back then a drawing was all we had to convince ourselves; now there is an algebraic reason.

The four rows satisfy a relation that can be verified by looking at the matrix: $(1,1,1) = (1,1,0) + (1,0,1) - (1,0,0)$, that is,

$$
\mathbf{x}_4 = \mathbf{x}_2 + \mathbf{x}_3 - \mathbf{x}_1
$$

Take the inner product of both sides with any $\mathbf{w}$, and the equality still holds:

$$
\mathbf{w}^\top\mathbf{x}_4 = \underbrace{\mathbf{w}^\top\mathbf{x}_2}_{\circ:\ >0} + \underbrace{\mathbf{w}^\top\mathbf{x}_3}_{\circ:\ >0} - \underbrace{\mathbf{w}^\top\mathbf{x}_1}_{\times:\ <0} \ >\ 0
$$

If some $\mathbf{w}$ labels $\mathbf{x}_2$ and $\mathbf{x}_3$ as ○ and $\mathbf{x}_1$ as ×, then the first two terms are positive, and the third is negative but has a minus sign in front, so the three terms must add up to something positive. The lecture specifically warns against overlooking that minus sign. The conclusion is that $\mathbf{x}_4$ is forced to be ○, and the dichotomy $(\times, \circ, \circ, \times)$ cannot be generated.

The handout sums the page up in one phrase: linear dependence restricts dichotomy.

### Proving "at most d+1": the general case

Page 15 moves the same argument to an arbitrary set of $d + 2$ points. Stack them into a matrix $\mathrm{X}$: it has $d + 2$ rows and only $d + 1$ columns ($x_0$ plus $d$ features). The handout writes "more rows than columns": $d + 2$ vectors of dimension $d + 1$ must be linearly dependent, so

$$
\mathbf{x}_{d+2} = a_1\mathbf{x}_1 + a_2\mathbf{x}_2 + \dots + a_{d+1}\mathbf{x}_{d+1}, \qquad \text{some } a_i \ne 0
$$

In the lecture, Lin says these coefficients may be positive, negative, or 0, but they are not all 0.

Next comes a proof by contradiction. Suppose these $d + 2$ points can be shattered. Then some $\mathbf{w}$ must generate the following dichotomy: the labels of the first $d + 1$ points agree with the signs of the coefficients (points with $a_i > 0$ are ○, points with $a_i < 0$ are ×), and the last point is ×. The handout writes it as $(\text{sign}(a_1), \text{sign}(a_2), \dots, \text{sign}(a_{d+1}), \times)$. For this $\mathbf{w}$:

$$
\mathbf{w}^\top\mathbf{x}_{d+2} = a_1\mathbf{w}^\top\mathbf{x}_1 + a_2\mathbf{w}^\top\mathbf{x}_2 + \dots + a_{d+1}\mathbf{w}^\top\mathbf{x}_{d+1} \ >\ 0
$$

Each term $a_i\mathbf{w}^\top\mathbf{x}_i$ is a product of two numbers with the same sign, positive times positive or negative times negative, so every term is positive and the sum is greater than 0. $\mathbf{x}_{d+2}$ is forced to be ○, contradicting "the last point is ×". So this dichotomy cannot be generated, and these $d + 2$ points cannot be shattered. The $d + 2$ points were arbitrary and no special property of them was used, so no set of $d + 2$ points can be shattered, and $d_{\text{VC}} \le d + 1$.

Putting the two directions together, $d$-dimensional perceptrons have $d_{\text{VC}} = d + 1$.

The handout leaves out two details on this page, which this article fills in:

- **How to label the points with $a_i = 0$.** $\text{sign}(0)$ is undefined. The term these points contribute to the sum is 0, so labeling them ○ or × does not affect the argument; pick either. Because at least one $a_i \ne 0$, at least one term in the sum is strictly greater than 0, and the conclusion stands.
- **Why it has to be the last point that is expressed by the others.** What linear dependence guarantees is "there is a set of coefficients, not all 0, that makes the combination of the $d + 2$ vectors equal the zero vector"; the vector expressed by the others need not come last. Move any vector with a nonzero coefficient to the other side of the equation and renumber it as number $d + 2$. Self-check question 2 is an example where renumbering is needed.

### Numerical example: two sets of four points that are not a square

The two point sets below are examples made up for this article, not from the slides, to show how the general-case argument applies to concrete points. Both are two-dimensional ($d = 2$), so each has four points.

**First set: the fourth point lies inside the triangle formed by the other three.** $\mathbf{x}_1 = (0,0)$, $\mathbf{x}_2 = (4,0)$, $\mathbf{x}_3 = (0,4)$, $\mathbf{x}_4 = (1,1)$. After prepending $x_0 = 1$, solve $\mathbf{x}_4 = a_1\mathbf{x}_1 + a_2\mathbf{x}_2 + a_3\mathbf{x}_3$, one equation per coordinate:

$$
a_1 + a_2 + a_3 = 1, \qquad 4a_2 = 1, \qquad 4a_3 = 1
$$

The solution is $a_2 = a_3 = \frac{1}{4}$ and $a_1 = \frac{1}{2}$. All three coefficients are positive, so the dichotomy that cannot be produced is $(\circ, \circ, \circ, \times)$: when all three vertices are ○, $\mathbf{w}^\top\mathbf{x}_4 = \frac{1}{2}\mathbf{w}^\top\mathbf{x}_1 + \frac{1}{4}\mathbf{w}^\top\mathbf{x}_2 + \frac{1}{4}\mathbf{w}^\top\mathbf{x}_3 > 0$, and the point inside can only be ○.

**Second set: all four points are on the outside.** $\mathbf{x}_1 = (0,0)$, $\mathbf{x}_2 = (2,0)$, $\mathbf{x}_3 = (0,2)$, $\mathbf{x}_4 = (3,3)$. The equations are

$$
a_1 + a_2 + a_3 = 1, \qquad 2a_2 = 3, \qquad 2a_3 = 3
$$

The solution is $a_2 = a_3 = \frac{3}{2}$ and $a_1 = -2$. The signs of the coefficients are $(-, +, +)$, so the dichotomy that cannot be produced is $(\times, \circ, \circ, \times)$, the same type as the handout's square.

The first equation $a_1 + a_2 + a_3 = 1$ comes from the $x_0 = 1$ coordinate, and it is why the two examples look different: the coefficients always sum to 1, so when the point is inside the triangle all three are positive, and when it is outside at least one is negative.

**Check.** For each of the two point sets, this article used a program to sweep every $\mathbf{w}$ on an integer grid (each component from $-12$ to $12$) and collected the dichotomies that appeared; both sets give exactly 14. The two missing ones are $(\circ, \circ, \circ, \times)$ and $(\times, \times, \times, \circ)$ for the first set, and $(\times, \circ, \circ, \times)$ and $(\circ, \times, \times, \circ)$ for the second. In each set the second missing one is the first with every label flipped. The reason is that replacing $\mathbf{w}$ with $-\mathbf{w}$ flips the label of every point, so if one cannot be produced, neither can its flipped version.

**What this result means.** However the four points are placed, the coefficients of the linear dependence point to a labeling that cannot be produced. 14 is also the largest number of dichotomies 2D perceptrons can generate on four points, 1 less than the previous lecture's bound $B(4, 4) = 15$ and far smaller than $N^{d_{\text{VC}}} = 4^3 = 64$. This gap comes back in the subsection "Why it is a thousand times looser".

### Fun Time: 1126-dimensional perceptrons

**Question (page 16):** Based on the proof above, what is $d_{\text{VC}}$ of 1126-D perceptrons?

1. $1024$
2. $1126$
3. $1127$
4. $6211$

**Answer: 3.** $d = 1126$, so $d_{\text{VC}} = d + 1 = 1127$. The handout's answer is just a joke: Well, too much fun for this section! In the lecture, Lin likewise says there were too many exercises earlier, so this one is very easy. Choice 2 forgets to count the $w_0$ dimension; the extra 1 is the threshold.

## What the VC dimension measures: effective degrees of freedom

```youtube
url: https://www.youtube.com/watch?v=5-V5WCf8cY8
title: The VC Dimension :: Physical Intuition of VC Dimension @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–01:53 is degrees of freedom, 01:53–02:45 the two old friends, 02:45–05:15 the comparison of $M$ and $d_{\text{VC}}$, and Fun Time follows.)

### The knob analogy

This section first answers a question about the name: why "dimension"? The answer in the lecture is that $d + 1$ is exactly the dimension of the perceptron's $\mathbf{w}$, which is how the VC dimension came to be tied to the dimension of the perceptron.

Page 17 of the handout draws ten knobs (a note under the figure says it is modified from the work of Hugues Vermeiren on texample.net) and uses them to compare three ways of measuring a hypothesis set:

| What is measured | The handout's wording | Meaning |
|---|---|---|
| hypothesis parameters $\mathbf{w} = (w_0, w_1, \dots, w_d)$ | creates degrees of freedom | each parameter is a knob that can be turned |
| hypothesis quantity $M = \lvert\mathcal{H}\rvert$ | "analog" degrees of freedom | treat the knobs as analog, each with infinitely many positions |
| hypothesis "power" $d_{\text{VC}} = d + 1$ | effective "binary" degrees of freedom | how many degrees of freedom are really in effect for binary classification |

The lecture's explanation of "effective": a knob that has no effect at all is not counted among the effective degrees of freedom. Its explanation of "binary": we are doing binary classification, so we measure the degrees of freedom for that task, and the way to measure them is how many dichotomies can be generated and how many points can at most still be shattered. The yellow box on the slide sums it up in one line: $d_{\text{VC}}(\mathcal{H})$ is the powerfulness of $\mathcal{H}$.

### Two old friends, and "but not always"

Page 18 looks back at two one-dimensional hypothesis sets:

- **positive rays** ($d_{\text{VC}} = 1$): $-1$ to the left of the threshold $a$ and $+1$ to the right. The only free parameter is $a$.
- **positive intervals** ($d_{\text{VC}} = 2$): $+1$ inside the interval and $-1$ outside. The free parameters are the left end $\ell$ and the right end $r$, two in all.

Adding the perceptron's $d + 1$ parameters against $d_{\text{VC}} = d + 1$, the handout gives a practical rule of thumb:

$$
d_{\text{VC}} \approx \#\text{free parameters} \quad \text{(but not always)}
$$

In the lecture, Lin explains that this is roughly right but not always right; in practice, when you want to estimate about how large a VC dimension is, counting the knobs that can be turned is usually a good way.

The handout gives no example of "not always". The following two are additions in this article and are not on the handout:

- **More parameters than effective degrees of freedom.** Write the threshold of positive rays as $h(x) = \text{sign}(x - (a + b))$. There are two parameters, $a$ and $b$, but they act only through $a + b$, the hypotheses that can be produced are exactly the same as before, and $d_{\text{VC}}$ is still 1. This is the knob with no effect that the lecture mentions.
- **One parameter, yet an infinite VC dimension.** $h(x) = \text{sign}(\sin(\alpha x))$ has a single parameter $\alpha$. Take $N$ points $x_i = 10^{-i}$ and, for any labels, set $\alpha = \pi\big(1 + \sum_{i:\,y_i = -1} 10^i\big)$; this labels the $N$ points as desired, for $N$ as large as you like. For example, with $N = 3$ and $\mathbf{y} = (+1, -1, +1)$, $\alpha = 101\pi$, and $\sin(\alpha x_i)$ at the three points is $\sin(10.1\pi) \approx 0.309$, $\sin(1.01\pi) \approx -0.031$, and $\sin(0.101\pi) \approx 0.312$, whose signs are exactly $(+, -, +)$. This article checked all 16 labelings for $N = 4$ by program, and every one can be produced.

So counting parameters is only an estimate; to be sure, you still have to go back to the definition and try one point, two points, three points.

### M and the VC dimension: the same trade-off with a different yardstick

Page 19 brings back a table from [Foundations Lecture 5](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function-en) unchanged (the slide says copied from Lecture 5). Learning has to answer two questions at once:

1. Can we make sure that $E_{\text{out}}(g)$ is close enough to $E_{\text{in}}(g)$?
2. Can we make $E_{\text{in}}(g)$ small enough?

| | Question 1: $E_{\text{out}} \approx E_{\text{in}}$? | Question 2: $E_{\text{in}}$ small enough? |
|---|---|---|
| small $M$ | Yes, $\mathbb{P}[\text{BAD}] \le 2 \cdot M \cdot \exp(\dots)$ is small | No, too few choices |
| large $M$ | No, the same expression gets large | Yes, many choices |
| small $d_{\text{VC}}$ | Yes, $\mathbb{P}[\text{BAD}] \le 4 \cdot (2N)^{d_{\text{VC}}} \cdot \exp(\dots)$ is small | No, too limited power |
| large $d_{\text{VC}}$ | No, the same expression gets large | Yes, lots of power |

The top two rows are the Lecture 5 version, and the bottom two rows are the version with $M$ replaced by $d_{\text{VC}}$. Lin points out in the lecture that $(2N)^{d_{\text{VC}}}$ now plays the role $M$ used to play. The difference is that $M$ is infinite for a hypothesis set like perceptrons, which has infinitely many lines, so that table was unusable; $d_{\text{VC}}$ is a finite number, and the same trade-off can finally be computed.

The slide's conclusion is using the right $d_{\text{VC}}$ (or $\mathcal{H}$) is important. The lecture previews that later on, the VC dimension or similar information will be used to decide which hypothesis set to choose given the data at hand. A first version of how to choose appears in the subsection "Model complexity: a more powerful hypothesis set is not always better".

### Fun Time: origin-crossing hyperplanes

**Question (page 20):** Origin-crossing hyperplanes are essentially perceptrons with $w_0$ fixed at 0. Make a guess about the $d_{\text{VC}}$ of origin-crossing hyperplanes in $\mathbb{R}^d$.

1. $1$
2. $d$
3. $d + 1$
4. $\infty$

**Answer: 2.** The handout's answer says the proof is almost the same as proving the $d_{\text{VC}}$ for usual perceptrons, but it is the intuition, $d_{\text{VC}} \approx$ #free parameters, that you shall use to answer this quiz. The lecture puts it more plainly: there were $d + 1$ parameters, and $w_0$ has been fixed and can no longer move, so only $d$ knobs are actually left.

This article supplies the "almost the same" proof to confirm that the intuition is right this time. Without $x_0$, each point is simply a $d$-dimensional vector.

- **At least $d$:** take the $d$ unit vectors on the coordinate axes. The matrix they form is the $d \times d$ identity matrix, which is of course invertible. For any $\mathbf{y}$, taking $\mathbf{w} = \mathbf{y}$ gives $\mathrm{X}\mathbf{w} = \mathbf{y}$.
- **At most $d$:** any $d + 1$ vectors of dimension $d$ must be linearly dependent, and the same proof by contradiction applies.

A two-dimensional example: the two points $(1,0)$ and $(0,1)$ can be shattered. Add $(1,1)$; because $(1,1) = (1,0) + (0,1)$, when the first two points are both ○ the third is forced to be ○, and $(\circ, \circ, \times)$ cannot be produced. This article swept $\mathbf{w}$ over an integer grid by program, and these three points yield only 6 dichotomies; the missing ones are exactly $(\circ, \circ, \times)$ and its fully flipped version.

Choice 3 fails to subtract the fixed $w_0$. Choice 1 misreads "one fewer degree of freedom" as "only one left". Choice 4 is impossible, because this hypothesis set is a subset of the usual perceptrons, so it can only generate fewer dichotomies and its VC dimension cannot exceed $d + 1$.

## Reading the VC bound as model complexity and sample complexity

```youtube
url: https://www.youtube.com/watch?v=_DN_oF-i6ag
title: The VC Dimension :: Interpreting VC Dimension @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–04:14 rephrases the VC bound, 04:14–07:26 is model complexity, 07:26–10:30 sample complexity, 10:30–14:57 why the bound is loose, 14:57–15:37 Fun Time, followed by the summary of the whole lecture.)

### From "the probability of the bad event" to "how large the gap is when the good event happens"

With $k - 1$ replaced by $d_{\text{VC}}$, the VC bound is (page 21 of the handout; the condition again has $N \ge 2$ crossed out, leaving $d_{\text{VC}} \ge 2$):

$$
\mathbb{P}_{\mathcal{D}}\Big[\underbrace{\big|E_{\text{in}}(g) - E_{\text{out}}(g)\big| > \epsilon}_{\text{BAD}}\Big] \ \le\ \underbrace{4\,(2N)^{d_{\text{VC}}}\exp\Big(-\frac{1}{8}\epsilon^2 N\Big)}_{\delta}
$$

This expression takes $\epsilon$ first and then tells you an upper bound on the probability of the bad event. The lecture switches viewpoint: a small probability of the bad event is the same as a large probability of the good event. Call the right-hand side $\delta$; then with probability at least $1 - \delta$ the good event happens, namely $\lvert E_{\text{in}}(g) - E_{\text{out}}(g)\rvert \le \epsilon$. Now ask the reverse question: fix the $\delta$ you are willing to bear first, and what is the corresponding $\epsilon$? The handout solves for it in four steps.

**Step 1:** set the right-hand side equal to $\delta$.

$$
\delta = 4\,(2N)^{d_{\text{VC}}}\exp\Big(-\frac{1}{8}\epsilon^2 N\Big)
$$

**Step 2:** divide both sides by $4(2N)^{d_{\text{VC}}}$ to isolate the exponential term.

$$
\frac{\delta}{4\,(2N)^{d_{\text{VC}}}} = \exp\Big(-\frac{1}{8}\epsilon^2 N\Big)
$$

**Step 3:** take the natural logarithm of both sides to get $\ln\frac{\delta}{4(2N)^{d_{\text{VC}}}} = -\frac{1}{8}\epsilon^2 N$. Then multiply both sides by $-1$; flipping the fraction inside the logarithm absorbs the minus sign exactly.

$$
\ln\Big(\frac{4\,(2N)^{d_{\text{VC}}}}{\delta}\Big) = \frac{1}{8}\epsilon^2 N
$$

**Step 4:** multiply both sides by $\frac{8}{N}$ and take the square root. $\epsilon$ is positive, so take the positive root.

$$
\epsilon = \sqrt{\frac{8}{N}\ln\Big(\frac{4\,(2N)^{d_{\text{VC}}}}{\delta}\Big)}
$$

So with probability at least $1 - \delta$:

$$
\big|E_{\text{in}}(g) - E_{\text{out}}(g)\big| \ \le\ \sqrt{\frac{8}{N}\ln\Big(\frac{4\,(2N)^{d_{\text{VC}}}}{\delta}\Big)}
$$

The handout labels the gap on the left gen. error (generalization error), and in the lecture Lin says it measures how well the hypothesis carries over from the examples it was shown. Unpacking the absolute-value inequality gives bounds on both sides:

$$
E_{\text{in}}(g) - \sqrt{\frac{8}{N}\ln\Big(\frac{4\,(2N)^{d_{\text{VC}}}}{\delta}\Big)} \ \le\ E_{\text{out}}(g) \ \le\ E_{\text{in}}(g) + \sqrt{\frac{8}{N}\ln\Big(\frac{4\,(2N)^{d_{\text{VC}}}}{\delta}\Big)}
$$

The lecture remarks that this looks a lot like a confidence interval in statistics. The slide colors the left half gray, because we usually care little about how good $E_{\text{out}}$ could be at best and more about how bad it could be at worst. The lecture's example: when you take $g$ to invest in the stock market, you want to know how bad the worst case is under the $\delta$ you set.

The handout calls the square-root term the penalty for model complexity and writes it $\Omega(N, \mathcal{H}, \delta)$. In the lecture, Lin explains that "model" here means the hypothesis set: the more powerful the hypothesis set, the higher the price paid in generalization. It is determined by three things: the data size $N$, the hypothesis set $\mathcal{H}$ (through $d_{\text{VC}}$), and $\delta$. The lecture's informal description of $\delta$ is how lucky you think you are.

### Model complexity: a more powerful hypothesis set is not always better

The title of page 22 of the handout is THE VC Message. With a high probability:

$$
E_{\text{out}}(g) \ \le\ E_{\text{in}}(g) + \underbrace{\sqrt{\frac{8}{N}\ln\Big(\frac{4\,(2N)^{d_{\text{VC}}}}{\delta}\Big)}}_{\Omega(N,\ \mathcal{H},\ \delta)}
$$

The slide has a figure: the horizontal axis is the VC dimension, the vertical axis is error, and there are three curves.

| Curve | As $d_{\text{VC}}$ grows | Reason |
|---|---|---|
| in-sample error ($E_{\text{in}}$) | falls all the way | more points can be shattered, so there are more combinations to choose from |
| model complexity ($\Omega$) | rises all the way | $d_{\text{VC}}$ is an exponent inside the logarithm inside the square root |
| out-of-sample error ($E_{\text{out}}$) | falls, then rises | the sum of the first two |

The handout writes it in three lines: as $d_{\text{VC}}$ goes up, $E_{\text{in}}$ goes down but $\Omega$ goes up; as $d_{\text{VC}}$ goes down, $\Omega$ goes down but $E_{\text{in}}$ goes up; the best $d^*_{\text{VC}}$ is in the middle. A dashed line in the figure marks where $E_{\text{out}}$ is lowest.

Why $E_{\text{in}}$ falls is explained in the lecture: the data stays fixed, and as the VC dimension grows more points can be shattered and there are more combinations, so a reasonable algorithm has a better chance of finding a hypothesis with smaller $E_{\text{in}}$.

In the lecture, the message of this figure is addressed to people who have just started using machine learning: beginners often want only to drive $E_{\text{in}}$ as low as possible, which may mean using a more powerful hypothesis set with a higher VC dimension, but the figure shows that this is not necessarily the best choice, because the model-complexity price is large. The conclusion at the bottom of the slide is powerful $\mathcal{H}$ not always good. The lecture also previews that figures of this shape will show up often from now on, where the horizontal axis need not be the VC dimension and may be some quantity related to it; it comes back in [Foundations Lecture 13: Hazard of Overfitting](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization-en).

**Numerical example: plugging Ω into a concrete setting.** The following is an example made up for this article, not from the slides; the $\Omega$ numbers are computed from the formula, and the $E_{\text{in}}$ numbers are assumed for illustration.

Continue with the course's credit card approval setting. A bank has $N = 10{,}000$ historical records and wants to use a perceptron to decide whether to approve a card, with tolerated failure probability $\delta = 0.1$. There are three options: use only 3 features, use 10, or use 50. A perceptron on $d$ features has $d_{\text{VC}} = d + 1$. First compute $\Omega$, taking 3 features as the example:

$$
\Omega = \sqrt{\frac{8}{10{,}000}\ln\Big(\frac{4 \times 20{,}000^{4}}{0.1}\Big)} = \sqrt{0.0008 \times 43.30} \approx 0.186
$$

Here $\ln(4 \times 20{,}000^4 / 0.1) = \ln 40 + 4\ln 20{,}000 \approx 3.69 + 39.61 = 43.30$. The three options:

| Number of features $d$ | $d_{\text{VC}}$ | $\Omega$ (computed) | $E_{\text{in}}$ (assumed) | $E_{\text{in}} + \Omega$ |
|---|---|---|---|---|
| 3 | 4 | 0.186 | 0.20 | 0.386 |
| 10 | 11 | 0.300 | 0.08 | 0.380 |
| 50 | 51 | 0.638 | 0.05 | 0.688 |

Going from 3 features to 10, the assumed $E_{\text{in}}$ drops by 0.12 while $\Omega$ grows by only 0.114, so the guaranteed upper bound improves slightly. Going from 10 to 50, $E_{\text{in}}$ drops by only another 0.03 while $\Omega$ grows by 0.338, and the upper bound goes from 0.380 to 0.688, which is much worse. This is the curve in the figure that falls and then rises, with the best position in the middle.

What this result means has to be read on two levels. First: the only thing that can be computed directly from the formula is $\Omega$, and it depends only on $N$, $d_{\text{VC}}$, and $\delta$, so it can be computed before looking at the data; $E_{\text{in}}$ is known only after actually training. Second: the 0.38 in the table is a guarantee that "the error rate is at most 38%", which is hardly a good guarantee for card approval, but the actual $E_{\text{out}}$ is usually far below it. That gap is the subject of the next two subsections.

### Sample complexity: how much data the bound asks for

The second way to read the VC bound is sample complexity (page 23 of the handout). The lecture tells it as a boss handing down specs:

- $E_{\text{in}}$ and $E_{\text{out}}$ should differ by at most $\epsilon = 0.1$.
- The probability of the bad event should be at most $\delta = 0.1$, that is, ninety percent of the time we trust that the good event happens.
- The model you are given has $d_{\text{VC}} = 3$, for example 2D perceptrons.

Question: how much data is enough? The method is to plug $N$ into $4(2N)^{d_{\text{VC}}}\exp(-\frac{1}{8}\epsilon^2 N)$ and see when it is no more than $\delta$. The handout lists five values of $N$; the two middle columns of the table below are this article's recomputation, splitting the bound into two factors:

| $N$ | $4(2N)^3$ | $\exp(-\frac{1}{8} \times 0.01 \times N)$ | bound (the handout's number) |
|---|---|---|---|
| 100 | $3.2 \times 10^{7}$ | $e^{-0.125} \approx 0.882$ | $2.82 \times 10^{7}$ |
| 1,000 | $3.2 \times 10^{10}$ | $e^{-1.25} \approx 0.287$ | $9.17 \times 10^{9}$ |
| 10,000 | $3.2 \times 10^{13}$ | $e^{-12.5} \approx 3.73 \times 10^{-6}$ | $1.19 \times 10^{8}$ |
| 100,000 | $3.2 \times 10^{16}$ | $e^{-125} \approx 5.17 \times 10^{-55}$ | $1.65 \times 10^{-38}$ |
| 29,300 | $8.05 \times 10^{14}$ | $e^{-36.625} \approx 1.24 \times 10^{-16}$ | $9.99 \times 10^{-2}$ |

The products of the two factors all match the handout's numbers. The lecture goes through the rows one at a time: with 100 examples the bound is $2.82 \times 10^7$, a probability that is at most twenty-some million, which is as good as writing nothing, because a probability never exceeds 1 anyway. Switch to 1,000 examples and the result is worse. Only at 10,000 examples do things start to improve, and the lecture says that is the exponentially decreasing term beginning to take effect. At 100,000 examples the bound is as small as $10^{-38}$. Searching back, about 29,300 examples just meet the specs (what Lin says aloud in the lecture is roughly 29,000).

An addition in this article: why does the bound get larger when the data goes from 100 examples to 1,000? Look at the two middle columns of the table: $N$ becomes 10 times larger, the polynomial factor becomes 1,000 times larger, and the exponential factor only drops from 0.882 to 0.287. Take the logarithm of the bound and differentiate with respect to $N$:

$$
\frac{d}{dN}\Big[d_{\text{VC}}\ln(2N) - \frac{1}{8}\epsilon^2 N\Big] = \frac{d_{\text{VC}}}{N} - \frac{\epsilon^2}{8} = 0 \quad\Longrightarrow\quad N = \frac{8\,d_{\text{VC}}}{\epsilon^2} = \frac{8 \times 3}{0.01} = 2{,}400
$$

So the bound keeps growing until $N = 2{,}400$ (its maximum is about $2.2 \times 10^{10}$) and only then starts to fall, and it has to fall all the way to 29,300 before it is below 0.1. This article compared the values one by one by program, and $N = 29{,}300$ is indeed the first integer at which the bound is no more than 0.1. This does not mean more data makes learning worse; it only means that while $N$ is still small, this bound has nothing useful to say.

From this the handout generalizes: need $N \approx 10{,}000\,d_{\text{VC}}$ in theory. In the lecture, Lin says that plugging in different VC dimensions gives roughly 10,000 times each time. This article computed a few under the same $\epsilon = \delta = 0.1$:

| $d_{\text{VC}}$ | Smallest $N$ with bound $\le 0.1$ | $N / d_{\text{VC}}$ |
|---|---|---|
| 2 | 19,898 | 9,949 |
| 3 | 29,300 | 9,767 |
| 5 | 48,916 | 9,783 |
| 10 | 100,652 | 10,065 |
| 50 | 560,113 | 11,202 |

The ratios are all around 10,000. Note that this "10,000" is tied to the specs: change $\epsilon$ or $\delta$ and the multiple changes with it.

The lecture then complains on the students' behalf: to learn one line in a two-dimensional plane, you have to find 30,000 points, and where would that much data come from? Then it gives the practical observation: about 10 times the VC dimension is quite enough. Giving 30 points to learn a line in the plane is already plenty, and giving 100 points is a luxury. The handout writes this as the second rule of thumb:

$$
N \approx 10\,d_{\text{VC}} \quad \text{often enough!}
$$

This article plugs $N = 30$ back into $\Omega$ to see what the theory says: $\Omega = \sqrt{\frac{8}{30}\ln\frac{4 \times 60^3}{0.1}} \approx 2.06$. The statement $E_{\text{out}} \le E_{\text{in}} + 2.06$ has no content at all, because an error rate is at most 1. The amount of data that is enough in practice amounts, in the eyes of this bound, to no guarantee.

### Why it is a thousand times looser

10,000 times in theory and 10 times in practice: page 24 of the handout lists four sources of this gap. Each is a place where the derivation was relaxed so that the conclusion would hold "for anything". In the table below the first two columns are the handout's content, and the third column is this article's summary of what is said in the lecture:

| What the derivation used | What it buys | Where the looseness is |
|---|---|---|
| Hoeffding for unknown $E_{\text{out}}$ | any distribution, any target | the particular distribution and target we face need not be the worst ones |
| $m_{\mathcal{H}}(N)$ instead of $\lvert\mathcal{H}(\mathbf{x}_1, \dots, \mathbf{x}_N)\rvert$ | "any" data | the growth function is the maximum over all data sets, and the data at hand may have fewer dichotomies |
| $N^{d_{\text{VC}}}$ instead of $m_{\mathcal{H}}(N)$ | "any" $\mathcal{H}$ of same $d_{\text{VC}}$ | the polynomial is an upper bound of an upper bound of an upper bound |
| union bound on worst cases | any choice made by $\mathcal{A}$ | the algorithm will not necessarily pick the hypothesis that goes wrong |

The lecture has one remark for each of the four rows. First row: the bound covers everything under the sun, with no need to know $P$ or $f$. Second row: the growth function is only an overestimate of the actual number of dichotomies. Third row: the benefit is that a hypothesis set can be judged by one number without looking at its details; the cost can be felt with four points, where the bounding function says at most 15 while 2D perceptrons actually have only 14, and switching to a power of $N$ only makes it looser. Fourth row: we assume the algorithm may step on a landmine whenever one exists, but in reality it does not step on one that easily.

This article lists the gaps in the second and third rows using examples computed earlier. Four points, 2D perceptrons: the actual number of dichotomies on the data at hand can be 12 (data with three collinear points, as in self-check question 2), the growth function is 14, the bounding function $B(4, 4)$ is 15, and $N^{d_{\text{VC}}}$ is 64.

Is the bound still useful, then? Under these four points the handout writes in red: but hardly better, and "similarly loose for all models". The lecture explains in two points:

- Many researchers have tried to tighten the bound, but among bounds that, like the VC bound, place no restriction on the distribution, the target function, or the algorithm, almost no one has done better.
- It is about equally loose for all kinds of models. The lecture's analogy: if every model's bound were inflated 20,000 times over reality, the bounds could still be used to compare which is larger and which is smaller.

So the handout's conclusion is: philosophical message of VC bound important for improving ML. The lecture says it directly: what gets used later is not the theoretical numbers, because those ask for data 10,000 times the VC dimension, which most of the time is out of reach; what gets used is the philosophical message behind it, for example what the model-complexity figure says: do not blindly chase the most powerful hypothesis set.

### Fun Time: how to decrease the probability of getting bad data

**Question (page 25):** Consider the VC bound below. How can we decrease the probability of getting BAD data?

$$
\mathbb{P}_{\mathcal{D}}\Big[\big|E_{\text{in}}(g) - E_{\text{out}}(g)\big| > \epsilon\Big] \ \le\ 4\,(2N)^{d_{\text{VC}}}\exp\Big(-\frac{1}{8}\epsilon^2 N\Big)
$$

1. decrease model complexity $d_{\text{VC}}$
2. increase data size $N$ a lot
3. increase generalization error tolerance $\epsilon$
4. all of the above

**Answer: 4.** The handout's answer is only a line of congratulations (Congratulations on being Master of VC bound), so this article supplies the reasons for the three choices one by one:

- **Choice 1.** $2N > 1$, so $(2N)^{d_{\text{VC}}}$ gets smaller as $d_{\text{VC}}$ gets smaller. At $N = 10{,}000$ and $\epsilon = 0.1$, each decrease of $d_{\text{VC}}$ by 1 divides the bound by 20,000.
- **Choice 2.** The question says increase "a lot", and those words are not decoration. The sample complexity table shows that the bound gets larger as $N$ goes from 100 to 1,000; only past $8\,d_{\text{VC}}/\epsilon^2$ does the exponential term overpower the polynomial.
- **Choice 3.** $\epsilon$ appears only inside $\exp(-\frac{1}{8}\epsilon^2 N)$, and the larger $\epsilon$ is, the smaller this term. The price is that the definition of the "good event" has been widened: what you guarantee is that $E_{\text{in}}$ and $E_{\text{out}}$ differ by no more than a larger number.

Strictly speaking, all three actions lower the **upper bound** on the probability; the bound does not say the true probability must drop by as much.

### Summary of this lecture

Page 26 of the handout sums up each of the four sections in one line:

| Section | The handout's one line |
|---|---|
| Definition of VC Dimension | maximum non-break point |
| VC Dimension of Perceptrons | $d_{\text{VC}}(\mathcal{H}) = d + 1$ |
| Physical Intuition of VC Dimension | $d_{\text{VC}} \approx \#$free parameters |
| Interpreting VC Dimension | loosely: model complexity & sample complexity |

Up to this point, every derivation has assumed that the data is generated by some fixed target function $f$, with no noise, and for binary classification only. The slide's preview is more than noiseless binary classification?, and in the lecture Lin says the next lecture extends the idea of the VC dimension to more kinds of learning problems.

## Self-check

**1. The growth function of the 1D perceptron (positive rays plus negative rays) is $m_{\mathcal{H}}(N) = 2N$. What are its VC dimension and its minimum break point? Does $m_{\mathcal{H}}(N) \le N^{d_{\text{VC}}}$ hold at $N = 2$ and $N = 3$?**

Answer: at $N = 2$, $2N = 4 = 2^2$; at $N = 3$, $6 < 2^3 = 8$. So $d_{\text{VC}} = 2$ and the minimum break point is 3. $d_{\text{VC}} = 2$ satisfies the condition $d_{\text{VC}} \ge 2$, and the upper bound is $N^2$: $4 \le 4$ at $N = 2$ and $6 \le 9$ at $N = 3$, so both hold. This also agrees with the perceptron formula $d + 1 = 1 + 1 = 2$.

**2. Four two-dimensional points: $\mathbf{x}_1 = (0,0)$, $\mathbf{x}_2 = (1,0)$, $\mathbf{x}_3 = (2,0)$, $\mathbf{x}_4 = (5,7)$. Following the handout's formulation, can $\mathbf{x}_4$ be written as a linear combination of the first three points? If not, how do you find a dichotomy that 2D perceptrons cannot produce?**

Answer: after prepending $x_0 = 1$, the first three vectors are $(1,0,0)$, $(1,1,0)$, and $(1,2,0)$. Their third coordinates are all 0, so they cannot combine into $(1,5,7)$, and $\mathbf{x}_4$ cannot be expressed by the first three points. But the four vectors are still linearly dependent: $\mathbf{x}_1 - 2\mathbf{x}_2 + \mathbf{x}_3 = \mathbf{0}$ (the coefficient of $\mathbf{x}_4$ is 0). Move $\mathbf{x}_3$, whose coefficient is nonzero, to one side: $\mathbf{x}_3 = -\mathbf{x}_1 + 2\mathbf{x}_2$. The signs of the coefficients are $(-, +)$, so when $\mathbf{x}_1$ is × and $\mathbf{x}_2$ is ○, $\mathbf{w}^\top\mathbf{x}_3 = -\mathbf{w}^\top\mathbf{x}_1 + 2\mathbf{w}^\top\mathbf{x}_2 > 0$ and $\mathbf{x}_3$ is forced to be ○. $(\times, \circ, \times, \ast)$ cannot be produced, whether $\ast$ is ○ or ×; the fully flipped $(\circ, \times, \circ, \ast)$ cannot be produced either. This article checked by program that these four points have only 12 dichotomies, and the missing ones are exactly these 4. This is the algebraic version of "with three collinear points, the point in the middle cannot differ from both sides".

**3. For a three-dimensional perceptron ($d = 3$), take the handout's set of points: the origin and the unit points on the three coordinate axes. Write down the $\mathbf{w}$ that generates the labels $\mathbf{y} = (-1, +1, +1, -1)$, and check it.**

Answer: $w_0 = y_1 = -1$ and $w_i = y_{i+1} - y_1$, so $\mathbf{w} = (-1, 2, 2, 0)$. Check: the origin gets $w_0 = -1$; the point on the first axis gets $-1 + 2 = 1$; the point on the second axis gets $-1 + 2 = 1$; the point on the third axis gets $-1 + 0 = -1$. The four values are exactly $\mathbf{y}$.

**4. $d_{\text{VC}} = 3$ and $\delta = 0.1$. What is $\Omega$ at $N = 1{,}000$ and at $N = 100{,}000$? What does each number mean?**

Answer: at $N = 1{,}000$: $\Omega = \sqrt{\frac{8}{1000}\ln\frac{4 \times 2000^3}{0.1}} = \sqrt{0.008 \times 26.49} \approx 0.46$. At $N = 100{,}000$: $\Omega = \sqrt{\frac{8}{100000}\ln\frac{4 \times 200000^3}{0.1}} = \sqrt{0.00008 \times 40.31} \approx 0.057$. The meaning: with at least ninety percent confidence, $E_{\text{out}}$ will not exceed $E_{\text{in}}$ by more than this. With 1,000 examples the guaranteed gap is 0.46, and even $E_{\text{in}} = 0$ only guarantees $E_{\text{out}} \le 0.46$, not much better than flipping a coin; with 100,000 examples the gap shrinks to 0.057. The data grows 100 times, yet $\Omega$ shrinks only to about one eighth, because $N$ sits inside the square root and the logarithm term grows along with it.

**5. Someone says: "My hypothesis set has a finite VC dimension, so it is sure to learn." What is missing from this statement? Someone else says: "Then I will pick the hypothesis set with the largest VC dimension; it has the lowest $E_{\text{in}}$, so it must be the best." What is missing from this one?**

Criteria: the answer to the first statement should point out that a finite $d_{\text{VC}}$ plus a large enough $N$ only guarantees $E_{\text{out}} \approx E_{\text{in}}$, that the algorithm still has to find a $g$ with small $E_{\text{in}}$, and that the whole guarantee is probabilistic; when $d_{\text{VC}}$ is too small, $E_{\text{in}}$ may not come down at all. The answer to the second statement should point out that the second term of $E_{\text{out}} \le E_{\text{in}} + \Omega$ grows with $d_{\text{VC}}$ and that the best $d_{\text{VC}}$ is in the middle; it is even better to give a numerical comparison like this article's three feature counts.

## Exercises and corresponding reading

**Homework.** [Fall 2024 HW3](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf) was released on 2024-10-07 and due 10-21; its problems cover Foundations Lectures 7 to 10, and it has no official solutions. Two problems relate directly to this lecture:

- **Q1** (auto-graded): among five hypothesis sets with one parameter each, which has the largest $d_{\text{VC}}$. This tests exactly "$d_{\text{VC}} \approx$ number of free parameters, but not always". Approach: for each of the five choices, try to shatter 1 point, 2 points, 3 points; do not just count parameters.
- **Q5**: prove or disprove $d_{\text{VC}}(\mathcal{H}_1 \cup \mathcal{H}_2) \le d_{\text{VC}}(\mathcal{H}_1) + d_{\text{VC}}(\mathcal{H}_2)$. Try the pair positive rays and negative rays first.

Q6 and Q7 of the same assignment belong to the next lecture. The guide to the whole assignment is in [Foundations Homework](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide-en). According to the course page's schedule, Fall 2026 hw2 is released on 10/07, and it was not yet public when checked on 2026-09-30. The videos and handouts are all free and public; the Fall 2024 homework PDFs are public too, but there are no official solutions and grading is limited to enrolled students.

**Textbook.** The [Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) and [Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) course pages both map this lecture to Section 2.2 of [Learning from Data](http://amlbook.com) (LFD).

**The Fall 2026 extended slides.** Fall 2026 issued an additional 5-page set of extended slides for this lecture, [07e_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/07e_handout.pdf), with three things the MOOC handout does not have:

- It states $d_{\text{VC}} = d$ for origin-crossing $d$-dimensional perceptrons as a formal result (the MOOC handout only leaves it in a Fun Time for you to guess), and points out that proving $d_{\text{VC}}$ is sometimes easier than deriving $m_{\mathcal{H}}(N)$ directly.
- It places "the bound is loose" in the context of deep learning: the VC bound still holds as a mathematical theorem and conceptually still links model complexity to generalization; but for reasonable $N$ and $\mathcal{H}$, $\Omega$ is far greater than 1, making the bound meaningless, and newer observations such as double descent have not been fully explained either. The slides' advice is "take the philosophical message, not the mathematical numbers".
- It introduces another yardstick for complexity, Rademacher complexity: data-dependent, "softer" than the growth function, and easier to extend to regression.

**Everyday use.** Pick a model you know well, count its free parameters to estimate a $d_{\text{VC}}$, and see whether the amount of data at hand is at least 10 times that. This is the most direct practical use of this lecture's conclusion.

**Further reading.** Lecture 7 of [Caltech Learning from Data](https://work.caltech.edu/telecourse) is likewise The VC Dimension and can serve as an English-language parallel. [Stanford CS229 Lecture 6: Bias and Variance, Regularization, and Model Selection](/posts/ai/2026-10-12-stanford-cs229-lecture-06-bias-variance-regularization-en) looks at the same trade-off between a model that is too simple and one that is too complex from the bias–variance angle.

**Next lecture.** [Foundations Lecture 8: Noise and Error Measures](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-08-noise-and-error-en) replaces the fixed target function with a noisy target distribution, and explains whether this lecture's conclusions still hold once the error is computed differently.

## Course video sources

Original videos: [Definition of VC Dimension](https://www.youtube.com/watch?v=XxPB9GlJEUk), [VC Dimension of Perceptrons](https://www.youtube.com/watch?v=WQzhc1IdB_I), [Physical Intuition of VC Dimension](https://www.youtube.com/watch?v=5-V5WCf8cY8), [Interpreting VC Dimension](https://www.youtube.com/watch?v=_DN_oF-i6ag)

- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

Checked: 2026-10-13. The video IDs, titles, and lengths were taken from the official playlist that day; the videos have no caption track on YouTube, and what this article reports from the lecture comes from transcripts made for it.

## Update Log

- 2026-10-10: Marked the video status and checked the recording sources and how to access them.
- 2026-10-10: Rechecked the video status. The embedded videos match the lecture numbers in the official playlist.
- 2026-10-13: Previously combined with Lecture 8 in one article; changed to one article per lecture and rewritten from the handout and the video transcripts.

## References

- [Foundations Lecture 7 handout 07_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/07_handout.pdf): the main source for this article; the definitions, proofs, tables, and six Fun Time questions of the four sections all come from this handout.
- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf): the IDs and titles of the four videos; what the text reports as said "in the lecture" is paraphrased from machine transcripts of these four videos.
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/): the official entry for handouts and recordings.
- [Fall 2026 extended slides 07e_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/07e_handout.pdf): the result for origin-crossing perceptrons, the deep-learning-era remarks on the VC bound, and Rademacher complexity.
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/): the corresponding LFD sections.
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/): the corresponding LFD sections and the hw2 schedule.
- [Fall 2024 Homework 3 (hw3_red.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf): the content of Q1 and Q5.
- [Learning from Data textbook site](http://amlbook.com): the source for Section 2.2.
- [Caltech Learning from Data telecourse](https://work.caltech.edu/telecourse): an English-language parallel; Lecture 7 has the same title.
- [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques: Course Overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en): where this lecture sits in the whole course and the reading routes.
