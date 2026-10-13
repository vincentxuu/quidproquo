---
title: "Perceptrons and PLA: How a Line Corrects Itself from Mistakes | NTU Hsuan-Tien Lin Machine Learning Foundations Lecture 2"
date: 2026-10-13
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, perceptron, classification]
lang: en
math: true
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 2
tldr: "This lecture puts the first concrete content into the flowchart from Lecture 1: the hypothesis set H is all lines (perceptrons), and the algorithm A is PLA, which adds yₙxₙ to w whenever it sees a misclassified point. When the data is linearly separable, PLA started from w₀ = 0 halts after at most R²/ρ² corrections; when the data cannot be separated, switch to pocket, which keeps the line with the fewest mistakes seen so far in its pocket."
description: "A guide to Lecture 2 of NTU Hsuan-Tien Lin's Machine Learning Foundations, Learning to Answer Yes/No: the perceptron hypothesis set and its vector form, PLA's correction rule, the full proof of T ≤ R²/ρ² under linear separability, and the pocket algorithm, with PLA run step by step on four two-dimensional points from w = 0 until it halts."
draft: false
glossary:
  - term: "perceptron"
    definition: "A hypothesis that multiplies each input feature by a weight, sums them, and compares the sum with a threshold, outputting +1 above it and −1 below it; in vector form, h(x) = sign(wᵀx). On the plane, each perceptron is a line."
    context: "The hypothesis set chosen in Foundations Lecture 2, also called a linear binary classifier."
  - term: "PLA"
    aliases: ["Perceptron Learning Algorithm"]
    definition: "Start from some w₀; each time, find one misclassified example (xₙ, yₙ) and change w to w + yₙxₙ, until no example is misclassified."
    context: "The learning algorithm of Foundations Lecture 2; Lin nicknames it after a Chinese saying about admitting a mistake and correcting it."
  - term: "linear separable"
    aliases: ["linearly separable"]
    definition: "There exists a weight vector w_f such that every training example satisfies yₙ = sign(w_fᵀxₙ); that is, one line (a hyperplane in higher dimensions) separates the positive and negative examples completely."
    context: "The premise under which PLA is guaranteed to halt; the convergence proof in Foundations Lecture 2 holds only under this condition."
  - term: "pocket algorithm"
    aliases: ["pocket"]
    definition: "A variant of PLA: it corrects mistakes as usual, but also keeps the weights with the fewest mistakes seen so far in a \"pocket\", and returns the pocket weights after enough iterations."
    context: "Foundations Lecture 2 uses it for data that is not separable or contains noise."
---

> 🌏 [中文版](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm)

**Video status: Videos included.** This article is written from the official MOOC handout [02_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/02_handout.pdf) and transcripts of this lecture's four official videos, with formulas following the handout. The transcripts are machine transcripts made for this article (Whisper), not official captions, and no human has proofread them. The videos are taught in Mandarin; the slides are in English. Each section opens with its official video and the approximate time ranges. Page numbers refer to the number at the lower right of each slide (0/22 to 22/22), and wherever the text says "in the lecture" it is paraphrasing what is said in the video.

This is Foundations Lecture 2 in [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en). The Roadmap on page 1 of the handout divides Foundations into four questions, and this lecture is still under the first, "When Can Machines Learn?". The previous lecture ([Foundations Lecture 1: The Learning Problem](/posts/ai/2026-09-30-ntu-htlin-ml-learning-problem-perceptron-en)) is left with a single line on that page: the algorithm $\mathcal{A}$ takes the data $\mathcal{D}$ and the hypothesis set $\mathcal{H}$ to get $g$. In that flowchart $\mathcal{H}$ and $\mathcal{A}$ were still empty boxes; this lecture fills them with their first concrete content, on the simplest kind of problem: answering yes or no.

The prerequisites are the five symbols from the previous lecture ($f$, $\mathcal{D}$, $\mathcal{A}$, $\mathcal{H}$, $g$), the vector inner product, and the relation between vector lengths and the angle between them ($\mathbf{a}^\top\mathbf{b} = \lVert\mathbf{a}\rVert\lVert\mathbf{b}\rVert\cos\theta$). After reading, you should be able to write PLA yourself, work out every correction by hand on a small data set, and derive from scratch the conclusion that "when the data is linearly separable, PLA makes at most $R^2/\rho^2$ corrections"; you should also know why to switch to pocket when the data cannot be separated.

## What the hypothesis set looks like: writing the credit approval rule as a line

```youtube
url: https://www.youtube.com/watch?v=WlpF1Phkv28
title: Learning to Answer Yes/No :: Perceptron Hypothesis Set @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–03:00 reviews the previous lecture, 03:00–07:47 covers the score and the threshold, 07:47–10:26 the vector form, 10:26–14:15 the two-dimensional picture, and Fun Time follows.)

### A weighted score and a threshold

Page 2 of the handout shows the credit card flowchart from the previous lecture again, with a single question underneath: what hypothesis set can we use? The answer on page 3 is a rule for computing a score. Each applicant is represented by a vector $\mathbf{x} = (x_1, x_2, \dots, x_d)$; the dimensions the handout lists are age, annual salary, year in job, and current debt. Each dimension is multiplied by a weight $w_i$, and the sum is the applicant's score:

$$
\text{approve credit if } \sum_{i=1}^{d} w_i x_i > \text{threshold}; \qquad \text{deny credit if } \sum_{i=1}^{d} w_i x_i < \text{threshold}
$$

In the lecture, Lin compares this to an exam: every question carries some points, a total above 60 passes, and anything else fails. The weights are the points per question. A dimension that favors approval gets a positive weight, larger the more important it is; an unfavorable dimension, for which the example in the lecture is owing a lot of money, may get a negative weight, or a smaller one.

There are only two outputs, and the handout encodes them as numbers: $\mathcal{Y} = \{+1(\text{good}), -1(\text{bad})\}$. In the lecture, Lin explains that any symbols would do, and $+1$ and $-1$ are chosen for mathematical convenience: with them, "output good above the threshold and bad below it" is just taking the sign of "score minus threshold".

$$
h(\mathbf{x}) = \text{sign}\Big(\Big(\sum_{i=1}^{d} w_i x_i\Big) - \text{threshold}\Big)
$$

When the score equals the threshold exactly, the sign is 0, and the handout only writes "0 ignored". The lecture adds a little more: this case rarely happens and does not matter in the discussion that follows, and if it does come up, treat it as decided by a coin flip.

Note that this is a lowercase $h$. One set of weights plus one threshold determines one $h$, a different set gives a different $h$, and all such $h$ together form the hypothesis set $\mathcal{H}$. The handout says this kind of hypothesis is historically called a perceptron. In the lecture, Lin gives the origin of the name: it comes from very early neural network research and can be seen as a mathematical model of a single neuron, which this course does not go into for now.

### Folding the threshold into the vector

Writing a sum and then subtracting a threshold every time is tedious. Page 4 tidies this up in a way that changes only the notation, not the meaning: treat "minus the threshold" as one more product term.

$$
\begin{aligned}
h(\mathbf{x}) &= \text{sign}\Big(\Big(\sum_{i=1}^{d} w_i x_i\Big) + \underbrace{(-\text{threshold})}_{w_0} \cdot \underbrace{(+1)}_{x_0}\Big) \\
&= \text{sign}\Big(\sum_{i=0}^{d} w_i x_i\Big) \\
&= \text{sign}\big(\mathbf{w}^\top\mathbf{x}\big)
\end{aligned}
$$

The trick is to give every example a zeroth coordinate $x_0$ that always equals $+1$, and to call $-\text{threshold}$ by the name $w_0$. Once the sum starts at 0 instead of 1, the threshold is absorbed. Both $\mathbf{x}$ and $\mathbf{w}$ are then vectors of dimension $d+1$, which the handout calls the 'tall' versions (the lecture uses the same image in Mandarin), and score minus threshold is the inner product of the two vectors. For the rest of the lecture $\mathbf{x}$ and $\mathbf{w}$ always mean these versions with one extra dimension, and one $\mathbf{w}$ represents one hypothesis $h$.

### On the plane, a perceptron is a line

Page 5 draws the case $d = 2$. Here $h(\mathbf{x}) = \text{sign}(w_0 + w_1 x_1 + w_2 x_2)$, and the picture maps to the symbols as follows:

| Symbol | What it looks like in the picture |
|---|---|
| Customer features $\mathbf{x}$ | a point on the plane (a point in $\mathbb{R}^d$ in higher dimensions) |
| Label $y$ | the shape of the point: a blue circle ○ is $+1$, a red cross × is $-1$ |
| Hypothesis $h$ | a line (a hyperplane in higher dimensions), predicting $+1$ on one side and $-1$ on the other |

Why a line? The explanation in the lecture is to look at where the sign flips: where the quantity in the parentheses equals 0. $w_0 + w_1 x_1 + w_2 x_2 = 0$ is a first-degree equation in $x_1$ and $x_2$, which is a straight line on the plane. Points on one side of the line give a positive value and points on the other side a negative one. The handout's figure puts two different lines through the same set of points, each painting the plane into a blue region and a red region, to show that different lines classify the customers differently.

An addition in this article, a geometric fact that will be used again and again: $(w_1, w_2)$ is the normal vector of the line and points toward the side predicted $+1$; the distance from the line to the origin is $\lvert w_0\rvert$ divided by the length of $(w_1, w_2)$. Multiplying the whole of $\mathbf{w}$ by a positive number changes neither the position of the line nor its positive and negative sides, so one line corresponds to infinitely many $\mathbf{w}$ that point in the same direction.

The handout's conclusion is perceptrons ⇔ linear (binary) classifiers: a perceptron is a linear binary classifier.

### Fun Time: the weights of a spam detector

**Question (page 6):** Consider using a perceptron to detect spam messages. Assume that each email is represented by the frequency of keyword occurrence, and output $+1$ indicates a spam. Which keywords below shall have large positive weights in a good perceptron for the task?

1. coffee, tea, hamburger, steak
2. free, drug, fantastic, deal
3. machine, learning, statistics, textbook
4. national, Taiwan, university, coursera

**Answer: 2.** The handout's explanation: the occurrence of keywords with positive weights increases the 'spam score', and hence those keywords should often appear in spams. The lecture says the same: this perceptron is in effect computing a spam score for an email, and free, drug, fantastic, and deal are words spam commonly uses, so they get the largest weights.

The words in the other choices appear about equally often in spam and in normal mail, or more often in normal mail (for people taking this course, choices 3 and 4 are the words a course announcement would use), and giving them large positive weights would only push normal mail over the threshold. One small difference: the handout writes the "frequency" of keyword occurrence, while the lecture describes it orally as "record yes if the word appears and no if it does not". The reasoning is the same under either representation.

## How to pick one line out of infinitely many: correct a mistake when you see one

```youtube
url: https://www.youtube.com/watch?v=1xnUlrgJJGo
title: Learning to Answer Yes/No :: Perceptron Learning Algorithm @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–04:45 covers what kind of line to pick and why it is hard, 04:45–08:38 the rule of PLA, 08:38–10:04 cyclic PLA, 10:04–15:49 goes through the figures step by step, 15:49–17:41 lists the questions not yet answered, and Fun Time follows.)

### The goal: get everything right on the data already seen

$\mathcal{H}$ is all lines; which one should $g$ be? Page 7 reasons in four steps:

- What we want is $g \approx f$. But $f$ is unknown, so this cannot be done directly. In the lecture, Lin says that if we knew $f$ we could call it a day and go home, with no need for machine learning.
- The almost necessary condition is that $g$ is close to $f$ on $\mathcal{D}$, ideally right on every example: $g(\mathbf{x}_n) = f(\mathbf{x}_n) = y_n$. As the lecture puts it, first make sure the data we have seen is fine, and worry about the unseen data later.
- The difficulty is that $\mathcal{H}$ is of infinite size. In the lecture, Lin explains that even in two dimensions a line can be rotated into infinitely many positions, and the brute-force way of trying them one by one never finishes.
- So take a different approach: start with some line $g_0$ in hand, and 'correct' its mistakes on $\mathcal{D}$. The lecture likens this to how people learn: not very good at first, and better the more they learn.

The figure on the right of the same page shows exactly this last step: a line puts one circle at the lower right on the red side, and a few small arrows drawn on the line point toward that circle. In the lecture, Lin says to move the line a little and see whether that fixes the mistake, or at least makes it less wrong.

$g_0$ is represented by its weight vector $\mathbf{w}_0$. The subscript of this $\mathbf{w}_0$ means "round 0" and it is a whole vector, not the same thing as the component $w_0$ (not bold) that stands for the threshold in "Folding the threshold into the vector" above.

### The two steps of PLA

Page 8 is the whole algorithm. Start from some $\mathbf{w}_0$ (the handout says $\mathbf{0}$ will do), and for $t = 0, 1, \dots$ repeat:

1. Find an example that $\mathbf{w}_t$ gets wrong, and call it $(\mathbf{x}_{n(t)}, y_{n(t)})$. Getting it wrong means

$$
\text{sign}\big(\mathbf{w}_t^\top\mathbf{x}_{n(t)}\big) \ne y_{n(t)}
$$

2. (Try to) correct the mistake by

$$
\mathbf{w}_{t+1} \leftarrow \mathbf{w}_t + y_{n(t)}\mathbf{x}_{n(t)}
$$

Keep going until there are no more mistakes, and return the last $\mathbf{w}$ (called $\mathbf{w}_{\text{PLA}}$) as $g$. The notation $n(t)$ only means "the index of the example picked in round $t$".

This is the Perceptron Learning Algorithm (PLA). At the bottom of the page the handout writes "A fault confessed is half redressed"; in the lecture, Lin explains that this corresponds to a Chinese saying to the effect that nothing is better than recognizing a mistake and correcting it, and so often refers to PLA by that saying. As for starting from $\mathbf{0}$, the explanation in the lecture is that it stands for knowing nothing.

### Why adding yₙxₙ counts as a correction

The right side of page 8 has two small figures, one for each kind of mistake. First recall that the sign of an inner product is determined by the angle: $\mathbf{w}^\top\mathbf{x} > 0$ means the angle between $\mathbf{w}$ and $\mathbf{x}$ is less than 90 degrees, and less than 0 means the angle is more than 90 degrees.

| Case | What it looks like in the figure | Correction | Effect |
|---|---|---|---|
| $y = +1$, but $\mathbf{w}^\top\mathbf{x} < 0$ | the angle between $\mathbf{w}$ and $\mathbf{x}$ is too large | $\mathbf{w} + \mathbf{x}$ | the new vector falls between $\mathbf{w}$ and $\mathbf{x}$, rotating toward $\mathbf{x}$ |
| $y = -1$, but $\mathbf{w}^\top\mathbf{x} > 0$ | the angle between $\mathbf{w}$ and $\mathbf{x}$ is too small | $\mathbf{w} - \mathbf{x}$ | the new vector rotates away from $\mathbf{x}$ |

The way the lecture puts it: when the answer should be positive, rotate $\mathbf{w}$ a little closer to $\mathbf{x}$, and when it should be negative, rotate it a little away from $\mathbf{x}$. The two cases need only one formula, because $y$ carries the sign itself: $\mathbf{w} + y\mathbf{x}$.

The figures only say the direction is right; algebra can say it more precisely. Take the inner product of both sides of the correction rule with $y_n\mathbf{x}_n$ (writing $n(t)$ as $n$ for short):

$$
y_n\mathbf{w}_{t+1}^\top\mathbf{x}_n = y_n(\mathbf{w}_t + y_n\mathbf{x}_n)^\top\mathbf{x}_n = y_n\mathbf{w}_t^\top\mathbf{x}_n + y_n^2\,\mathbf{x}_n^\top\mathbf{x}_n = y_n\mathbf{w}_t^\top\mathbf{x}_n + \lVert\mathbf{x}_n\rVert^2
$$

The last step uses $y_n^2 = 1$. The quantity $y_n\mathbf{w}^\top\mathbf{x}_n$ is worth remembering: when it is positive, the sign of the score agrees with $y_n$ and the example is classified correctly; when it is negative or 0, the example is wrong. The equation above says that after the correction this quantity has increased by $\lVert\mathbf{x}_n\rVert^2$. Because $x_0 = 1$, $\lVert\mathbf{x}_n\rVert^2$ is at least 1, so the push is always in the right direction. Whether one push is enough to make the quantity positive, this equation does not guarantee, which is why the handout puts "(try to)" in front of "correct". This paragraph is the content of this section's Fun Time.

### Implementation: cyclic PLA

"Find a mistake" on page 8 does not say how to find it, and "no more mistakes" does not say how to tell. Page 9 gives a practical version called cyclic PLA: arrange the data in a cycle, find the "next" mistake each time, and stop only after a full cycle of not encountering mistakes.

The lecture illustrates with 100 examples: go from number 1 to number 100; if this one is fine, look at the next, and if it is wrong, correct it; once all 100 have been seen and the cycle comes back around without another mistake, you are done. The order can follow the original numbering of the data (the handout calls this the naïve cycle), or you can fix a random order in advance and cycle through that (the precomputed random cycle). The benefit of writing it this way is that "is anyone still making a mistake" becomes easy to check.

### The handout's demonstration: halting after nine corrections

Page 10 is titled Seeing is Believing: a run of 11 figures that draw every step of PLA on a two-dimensional data set. The figure has 6 blue circles and 9 red crosses, with the circles toward the lower right and the crosses toward the upper left. The figures show the following:

| Figure | Point used for the correction | What is drawn |
|---|---|---|
| initially | | only the data, no line yet |
| update: 1 | $\mathbf{x}_1$ (circle) | $\mathbf{w}_{t+1}$ is the vector from the origin to $\mathbf{x}_1$ |
| update: 2 | $\mathbf{x}_9$ (circle) | the line from the previous step is perpendicular to $\mathbf{w}_t$; $\mathbf{x}_9$ falls on the red side, and $\mathbf{w}$ rotates toward it |
| update: 3 | $\mathbf{x}_{14}$ (cross) | it has rotated too far, a distant cross ends up on the blue side, and $\mathbf{w}$ rotates away from it |
| update: 4 | $\mathbf{x}_3$ (cross) | another cross is misclassified, so rotate away again |
| update: 5 to 9 | $\mathbf{x}_9$, $\mathbf{x}_{14}$, $\mathbf{x}_9$, $\mathbf{x}_{14}$, $\mathbf{x}_9$ | the line swings back and forth between these two points: after a correction with $\mathbf{x}_9$ the line gets flatter, and after a correction with $\mathbf{x}_{14}$ it gets steeper again |
| finally | | $\mathbf{w}_{\text{PLA}}$ separates the circles and crosses completely |

Why is there always a mistake at the first step? In the lecture, Lin explains that at the start $\mathbf{w} = \mathbf{0}$, which amounts to having no line, so whatever you look at counts as wrong. For the steps in the middle that swing back and forth, the explanation in the lecture is that PLA looks at only one point at a time, and fixing this one may send another over to the wrong side; here Lin uses a Taiwanese proverb about going after the tortoise and having the soft-shelled turtle get away, meaning that you catch this point and another one escapes. The nine corrections use only 4 distinct points, and $\mathbf{x}_9$ alone is used 4 times.

There are two lines of text at the bottom of the page. The first, worked like a charm with < 20 lines: in the lecture, Lin says the program behind these figures, not counting the plotting, is under 20 lines. The second is a reminder for anyone who wants to redraw this figure: note: made $x_i \gg x_0 = 1$ for visual purpose. The lecture explains that every feature value was deliberately made much larger than $x_0 = 1$ so the picture looks better; without doing so the algorithm still finds a line.

### A numerical example: four points, from w = 0 until it halts

The following is an example made up for this article, not from the slides. Four two-dimensional examples, with $x_0 = 1$ added the way the handout does:

| $n$ | Original point | $\mathbf{x}_n = (x_0, x_1, x_2)$ | $y_n$ |
|---|---|---|---|
| 1 | $(3, 0)$ | $(1, 3, 0)$ | $+1$ |
| 2 | $(0, 3)$ | $(1, 0, 3)$ | $+1$ |
| 3 | $(1, 0)$ | $(1, 1, 0)$ | $-1$ |
| 4 | $(0, 1)$ | $(1, 0, 1)$ | $-1$ |

Start from $\mathbf{w}_0 = (0, 0, 0)$ and run cyclic PLA in the order 1, 2, 3, 4. One detail has to be settled first: does a score of exactly 0 count as a mistake? Page 15 of the handout writes "mistake" as $y_n\mathbf{w}_t^\top\mathbf{x}_n \le 0$, with equality included, and that convention is followed here: a score of 0 is treated as wrong. Without this rule, every score is 0 when starting from $\mathbf{0}$ and the algorithm cannot take a single step.

First step: look at example 1; $\mathbf{w}_0^\top\mathbf{x}_1 = 0$, which counts as wrong. $\mathbf{w}_1 = (0,0,0) + (+1)(1,3,0) = (1,3,0)$.

Next, example 2: $\mathbf{w}_1^\top\mathbf{x}_2 = 1 + 0 + 0 = 1 > 0$ and $y_2 = +1$, correct. Example 3: $\mathbf{w}_1^\top\mathbf{x}_3 = 1 + 3 + 0 = 4 > 0$, but $y_3 = -1$, wrong. $\mathbf{w}_2 = (1,3,0) - (1,1,0) = (0,2,0)$.

Every later step is the same calculation, collected in the table. "Points still wrong after the correction" is the result of plugging the new $\mathbf{w}_{t+1}$ back into all four examples.

| $t$ | Point used | $\mathbf{w}_t$ | $\mathbf{w}_t^\top\mathbf{x}_n$ | $y_n$ | $\mathbf{w}_{t+1} = \mathbf{w}_t + y_n\mathbf{x}_n$ | Points still wrong after the correction |
|---|---|---|---|---|---|---|
| 0 | 1 | $(0, 0, 0)$ | $0$ | $+1$ | $(1, 3, 0)$ | 3, 4 |
| 1 | 3 | $(1, 3, 0)$ | $4$ | $-1$ | $(0, 2, 0)$ | 2, 3, 4 |
| 2 | 4 | $(0, 2, 0)$ | $0$ | $-1$ | $(-1, 2, -1)$ | 2, 3 |
| 3 | 2 | $(-1, 2, -1)$ | $-4$ | $+1$ | $(0, 2, 2)$ | 3, 4 |
| 4 | 3 | $(0, 2, 2)$ | $2$ | $-1$ | $(-1, 1, 2)$ | 3, 4 |
| 5 | 4 | $(-1, 1, 2)$ | $1$ | $-1$ | $(-2, 1, 1)$ | none |

After $\mathbf{w}_6 = (-2, 1, 1)$, go around one more full cycle: $y_n\mathbf{w}_6^\top\mathbf{x}_n$ for the four examples is $-2 + 3 = 1$, $-2 + 3 = 1$, $-(-2 + 1) = 1$, and $-(-2 + 1) = 1$, all positive, and the algorithm halts. There were 6 corrections in total.

**What this result means.** $\mathbf{w}_{\text{PLA}} = (-2, 1, 1)$ corresponds to the line $-2 + x_1 + x_2 = 0$, that is, $x_1 + x_2 = 2$. The two positive examples have $x_1 + x_2 = 3$ and lie on one side of the line; the two negative examples have $x_1 + x_2 = 1$ and lie on the other. Translated back into credit card terms: each of the two features is worth 1 point, and the card is approved only when the total exceeds 2.

Three things in this run can be checked against the earlier explanation:

- Step $t = 1$ corrects with example 3. Before the correction $y_3\mathbf{w}^\top\mathbf{x}_3 = -4$, and afterwards it is $-2$. It increased by $\lVert\mathbf{x}_3\rVert^2 = 2$, in the right direction, but example 3 is still wrong. "Try to correct" does not guarantee a fix in one go.
- After that same correction, example 2, which had been correct, becomes $\mathbf{w}_2^\top\mathbf{x}_2 = 0$ and lands on the line. Correcting one point moves the others, which is why the line swings back and forth in the handout's figures.
- After step $t = 4$, the score of example 3 is $-1 + 1 + 0 = 0$, still wrong under the rule above; but the next example cyclic PLA looks at is example 4, which it corrects first, and as a result example 3 becomes correct as well.

Written as a program, this takes under 20 lines of plain Python:

```python
def pla(data):
    w = [0, 0, 0]
    updates, clean, i = 0, 0, 0
    while clean < len(data):              # stop only after a full cycle with no mistakes
        x, y = data[i]
        score = sum(wj * xj for wj, xj in zip(w, x))
        if y * score <= 0:                # misclassified, or exactly on the line
            w = [wj + y * xj for wj, xj in zip(w, x)]
            updates, clean = updates + 1, 0
        else:
            clean += 1
        i = (i + 1) % len(data)
    return w, updates

data = [((1, 3, 0), +1), ((1, 0, 3), +1), ((1, 1, 0), -1), ((1, 0, 1), -1)]
print(pla(data))                          # ([-2, 1, 1], 6)
```

The output is `([-2, 1, 1], 6)`, which agrees with the last row of the table above and the total of 6 corrections. This program does not stop on data that cannot be separated; the reason is in the section "What to do when the data cannot be separated".

### Two kinds of questions not yet answered

Page 11 sorts the questions PLA leaves open into two kinds, all still marked with question marks:

- **Algorithmic: does it halt?** For cycling in the original order, cycling in a random order, and other variants, the handout writes "??" for each. The lecture stresses that what was just shown is a single example, with no claim that PLA always halts.
- **Learning: is $g \approx f$?** If it halts, yes on $\mathcal{D}$, because there are no mistakes. What about outside $\mathcal{D}$? What if it does not halt? Both are "??".

The bottom of the page previews what the section "Does PLA always halt" below will prove: if (...), after 'enough' corrections, any PLA variant halts. The condition in the parentheses is left blank for now. As for the question outside $\mathcal{D}$, the lecture says it will be about two lectures before it is discussed, which is [Foundations Lecture 4: Feasibility of Learning](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning-en).

### Fun Time: what the correction rule guarantees

**Question (page 12):** Let's try to think about why PLA may work. Let $n = n(t)$, according to the rule of PLA below,

$$
\text{sign}\big(\mathbf{w}_t^\top\mathbf{x}_n\big) \ne y_n, \qquad \mathbf{w}_{t+1} \leftarrow \mathbf{w}_t + y_n\mathbf{x}_n
$$

which formula is true?

1. $\mathbf{w}_{t+1}^\top\mathbf{x}_n = y_n$
2. $\text{sign}(\mathbf{w}_{t+1}^\top\mathbf{x}_n) = y_n$
3. $y_n\mathbf{w}_{t+1}^\top\mathbf{x}_n \ge y_n\mathbf{w}_t^\top\mathbf{x}_n$
4. $y_n\mathbf{w}_{t+1}^\top\mathbf{x}_n < y_n\mathbf{w}_t^\top\mathbf{x}_n$

**Answer: 3.** The handout's hint is to multiply the second part of the rule by $y_n\mathbf{x}_n$, and the derivation is the one in "Why adding yₙxₙ counts as a correction" above: the right side gains $\lVert\mathbf{x}_n\rVert^2 \ge 0$, so the left side cannot be smaller. The handout says the result shows that the rule somewhat 'tries to correct the mistake'. The lecture reads it this way: $\mathbf{w}^\top\mathbf{x}_n$ is the score, and its getting larger after being multiplied by $y_n$ means the sign of the score agrees with $y_n$ a little better; that may make the example fully right, or it may not yet.

The other choices can be ruled out with the numerical example above. Choice 1: after the first correction, $\mathbf{w}_1^\top\mathbf{x}_1 = 1 + 9 = 10$, which is not equal to $y_1 = 1$; the correction rule never aims to make the score exactly $\pm 1$. Choice 2: after the correction at step $t = 1$, the score of example 3 is $2$, whose sign still differs from $y_3 = -1$. Choice 4 points the opposite way from choice 3, and since $\lVert\mathbf{x}_n\rVert^2 \ge 1$, it cannot hold.

## Does PLA always halt: the guarantee under linear separability

```youtube
url: https://www.youtube.com/watch?v=Okrrz0IYoSE
title: Learning to Answer Yes/No :: Guarantee of PLA @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–01:40 defines linear separability, 01:40–06:17 is the first fact, 06:17–09:20 the second fact, 09:20–10:58 puts the two together, and Fun Time follows.)

### The precondition: linear separability

When PLA halts, the line in hand makes no mistakes on $\mathcal{D}$. So page 13 says the necessary condition for PLA to halt is that $\mathcal{D}$ allows some $\mathbf{w}$ to make no mistake. The handout calls such a $\mathcal{D}$ linear separable. The lecture is blunt about it: if no line can cut the data apart at all, PLA can run forever and never halt.

The handout illustrates with three figures:

| Figure | What the data looks like | Linear separable? |
|---|---|---|
| Left | circles on the right, crosses on the left, separable by one line | Yes |
| Middle | split roughly along the diagonal into two sides, but with a few points of each kind mixed into the other side | No |
| Right | circles clustered in the middle with crosses surrounding them, separable only by a circle | No |

In the lecture, Lin mentions in passing that the two figures on the right are the two patterns in this course's logo, and that later lectures will introduce ways of handling them one by one, with part of these cases already handled later in this lecture.

With the necessary condition settled, the question is turned around: assuming $\mathcal{D}$ is linear separable, does PLA always halt?

### Fact one: each correction increases the inner product of w and w_f by at least a fixed amount

Linear separable means there exists a perfect $\mathbf{w}_f$ such that $y_n = \text{sign}(\mathbf{w}_f^\top\mathbf{x}_n)$ for every example (page 14). In the lecture, Lin explains that the subscript $f$ is deliberate: think of this line as the target function. We do not know what $\mathbf{w}_f$ is, but the proof only needs it to exist.

$\mathbf{w}_f$ classifies every example correctly, so $y_n\mathbf{w}_f^\top\mathbf{x}_n$ is positive for every example, and no point lies on the line or on the wrong side. There are only $N$ examples, so the smallest of these $N$ positive numbers is also positive. The example PLA picks in round $t$ is one of them, so

$$
y_{n(t)}\mathbf{w}_f^\top\mathbf{x}_{n(t)} \ \ge\ \min_{n} y_n\mathbf{w}_f^\top\mathbf{x}_n \ >\ 0
$$

In the lecture, Lin calls the example that attains the minimum "the person closest to the line".

Now look at how the inner product of $\mathbf{w}_f$ and $\mathbf{w}_t$ changes after one correction. Substitute the correction rule and expand the inner product:

$$
\begin{aligned}
\mathbf{w}_f^\top\mathbf{w}_{t+1} &= \mathbf{w}_f^\top\big(\mathbf{w}_t + y_{n(t)}\mathbf{x}_{n(t)}\big) \\
&= \mathbf{w}_f^\top\mathbf{w}_t + y_{n(t)}\mathbf{w}_f^\top\mathbf{x}_{n(t)} \\
&\ge \mathbf{w}_f^\top\mathbf{w}_t + \min_{n} y_n\mathbf{w}_f^\top\mathbf{x}_n \\
&> \mathbf{w}_f^\top\mathbf{w}_t + 0
\end{aligned}
$$

The third line uses the inequality just above. The conclusion is that each correction increases the inner product by at least $\min_n y_n\mathbf{w}_f^\top\mathbf{x}_n$. Note that this part uses only "correct with some example"; it never uses the fact that the example is misclassified.

With the inner product growing, the handout says $\mathbf{w}_t$ appears more aligned with $\mathbf{w}_f$, followed by a "(really?)". In the lecture, Lin raises the objection on behalf of the students who are good at math: the inner product is $\lVert\mathbf{w}_f\rVert\lVert\mathbf{w}_t\rVert\cos\theta$, and it may grow because the angle gets smaller, or merely because $\mathbf{w}_t$ gets longer. Take two vectors with a positive inner product, multiply one of them by two or three, and the inner product grows too. So only half has been proved at this point, and the length of $\mathbf{w}_t$ still has to be kept under control.

### Fact two: the squared length of w grows by at most R² each time

Page 15 uses the property that fact one did not, which the lecture calls the most important property of PLA: it corrects only when there is a mistake. The handout rewrites "misclassified" as a convenient inequality:

$$
\text{sign}\big(\mathbf{w}_t^\top\mathbf{x}_{n(t)}\big) \ne y_{n(t)} \quad\Longleftrightarrow\quad y_{n(t)}\mathbf{w}_t^\top\mathbf{x}_{n(t)} \le 0
$$

When the score and $y$ have different signs, their product cannot be positive. Now expand the squared length after a correction. $\lVert\mathbf{a} + \mathbf{b}\rVert^2 = \lVert\mathbf{a}\rVert^2 + 2\mathbf{a}^\top\mathbf{b} + \lVert\mathbf{b}\rVert^2$; take $\mathbf{a} = \mathbf{w}_t$ and $\mathbf{b} = y_{n(t)}\mathbf{x}_{n(t)}$:

$$
\begin{aligned}
\lVert\mathbf{w}_{t+1}\rVert^2 &= \lVert\mathbf{w}_t + y_{n(t)}\mathbf{x}_{n(t)}\rVert^2 \\
&= \lVert\mathbf{w}_t\rVert^2 + 2y_{n(t)}\mathbf{w}_t^\top\mathbf{x}_{n(t)} + \lVert y_{n(t)}\mathbf{x}_{n(t)}\rVert^2 \\
&\le \lVert\mathbf{w}_t\rVert^2 + 0 + \lVert y_{n(t)}\mathbf{x}_{n(t)}\rVert^2 \\
&\le \lVert\mathbf{w}_t\rVert^2 + \max_{n}\lVert y_n\mathbf{x}_n\rVert^2
\end{aligned}
$$

Third line: the middle term is 2 times a number that is at most 0, and replacing it with 0 can only make the right side larger. Fourth line: the example used in this round is no longer than the longest example in the data. $y_n$ is $\pm 1$ and does not affect the length, so $\lVert y_n\mathbf{x}_n\rVert^2 = \lVert\mathbf{x}_n\rVert^2$; in the lecture, Lin explains that this is why the slide shades the $y_n$ here in gray.

The handout sums up this part as: mistake 'limits' $\lVert\mathbf{w}_t\rVert^2$ growth, even when updating with 'longest' $\mathbf{x}_n$. Even if every correction used the longest example, the squared length would grow by only $\max_n\lVert\mathbf{x}_n\rVert^2$ at a time. As the lecture puts it, the only thing that makes $\mathbf{w}_t$ grow is the last term; the middle term gives it no growth at all.

### Putting the two facts together: T ≤ R²/ρ²

The bottom of page 15 gives only the shape of the conclusion: start from $\mathbf{w}_0 = \mathbf{0}$, and after $T$ mistake corrections,

$$
\frac{\mathbf{w}_f^\top}{\lVert\mathbf{w}_f\rVert}\frac{\mathbf{w}_T}{\lVert\mathbf{w}_T\rVert} \ \ge\ \sqrt{T}\cdot\text{constant}
$$

The lecture leaves the calculation in between to the students, saying that writing down the results of the two pages on a sheet of paper is enough to get it. Here it is carried through. First give two quantities names, using the notation of the Fun Time on page 16:

$$
R^2 = \max_{n}\lVert\mathbf{x}_n\rVert^2, \qquad \rho = \min_{n} y_n\frac{\mathbf{w}_f^\top}{\lVert\mathbf{w}_f\rVert}\mathbf{x}_n
$$

$R$ is the length of the longest example, and the lecture mentions that some people call $R^2$ the squared radius. $\rho$ is the minimum from fact one divided by $\lVert\mathbf{w}_f\rVert$, so $\min_n y_n\mathbf{w}_f^\top\mathbf{x}_n = \rho\lVert\mathbf{w}_f\rVert$, and $\rho > 0$ when the data is linearly separable.

**Step one: accumulate fact one $T$ times.** $\mathbf{w}_0 = \mathbf{0}$, so $\mathbf{w}_f^\top\mathbf{w}_0 = 0$. Each correction adds at least $\rho\lVert\mathbf{w}_f\rVert$:

$$
\mathbf{w}_f^\top\mathbf{w}_T \ \ge\ \mathbf{w}_f^\top\mathbf{w}_{T-1} + \rho\lVert\mathbf{w}_f\rVert \ \ge\ \cdots \ \ge\ \mathbf{w}_f^\top\mathbf{w}_0 + T\rho\lVert\mathbf{w}_f\rVert = T\rho\lVert\mathbf{w}_f\rVert
$$

**Step two: accumulate fact two $T$ times.** $\lVert\mathbf{w}_0\rVert^2 = 0$, and each correction adds at most $R^2$:

$$
\lVert\mathbf{w}_T\rVert^2 \ \le\ \lVert\mathbf{w}_{T-1}\rVert^2 + R^2 \ \le\ \cdots \ \le\ \lVert\mathbf{w}_0\rVert^2 + TR^2 = TR^2 \quad\Longrightarrow\quad \lVert\mathbf{w}_T\rVert \le \sqrt{T}R
$$

**Step three: divide.** When $T \ge 1$, step one says $\mathbf{w}_f^\top\mathbf{w}_T > 0$, so $\mathbf{w}_T$ is not the zero vector and we can divide by its length. Use the lower bound from step one for the numerator and the upper bound from step two for the denominator (replacing the denominator with a larger number makes the whole fraction smaller):

$$
\frac{\mathbf{w}_f^\top\mathbf{w}_T}{\lVert\mathbf{w}_f\rVert\lVert\mathbf{w}_T\rVert} \ \ge\ \frac{T\rho\lVert\mathbf{w}_f\rVert}{\lVert\mathbf{w}_f\rVert\cdot\sqrt{T}R} = \sqrt{T}\cdot\frac{\rho}{R}
$$

The constant on the handout is $\rho/R$.

**Step four: the left side cannot exceed 1.** The left side is the inner product of two vectors of length 1, that is, $\cos\theta$ for the angle between $\mathbf{w}_f$ and $\mathbf{w}_T$, which is at most 1. This time it really does measure how close the directions are, since the effect of length has been divided out, and that answers the handout's "(really?)". Therefore

$$
1 \ \ge\ \sqrt{T}\cdot\frac{\rho}{R} \quad\Longrightarrow\quad \sqrt{T} \le \frac{R}{\rho} \quad\Longrightarrow\quad T \le \frac{R^2}{\rho^2}
$$

Read the inequality this way: whenever PLA has made $T$ corrections, $T$ cannot exceed $R^2/\rho^2$. PLA keeps correcting only while there are mistakes, and since the number of corrections is bounded, at some moment it must fail to find a mistake, which is to say it halts, and when it halts there are no mistakes on $\mathcal{D}$. The way the lecture puts it: each correction brings the two a little closer, and the closeness grows with the square root of the number of corrections, but the inner product of the two vectors is at most 1 and cannot keep rising without limit.

Nothing in the derivation uses "how the mistake is picked". Cycling in the original order, cycling in a random order, and picking any wrong example each time are all covered, which is why the preview on page 11 says any PLA variant, and the condition left blank in the parentheses is linear separable.

Three additions in this article. First, $\rho$ has a geometric meaning: for a point $\mathbf{x}$, $\mathbf{w}_f^\top\mathbf{x}/\lVert\mathbf{w}_f\rVert$ is the length of its projection onto the direction of $\mathbf{w}_f$, so $\rho$ measures "how far the closest example is from the separating hyperplane determined by $\mathbf{w}_f$, in the space of dimension $d+1$ with $x_0$ added". When presenting fact one, the lecture already describes $\mathbf{w}_f^\top\mathbf{x}_n$, not yet divided by $\lVert\mathbf{w}_f\rVert$, as a signed distance; that is a looser way of speaking, and strictly it is a distance only after dividing by the length. The farther the data is from the boundary (large $\rho$) and the shorter the examples themselves (small $R$), the lower the bound. Second, there is more than one $\mathbf{w}_f$. Any $\mathbf{w}_f$ that classifies the data perfectly can be plugged in, each gives its own bound, all of them hold, and the one with the largest $\rho$ gives the tightest bound. Third, the condition $\mathbf{w}_0 = \mathbf{0}$ is actually used: both accumulations start from 0.

### Checking the bound against the four-point example

Go back to the made-up data from "A numerical example: four points" above. Its $\mathbf{w}_{\text{PLA}} = (-2, 1, 1)$ classifies the data perfectly, so it can be used directly as $\mathbf{w}_f$.

- $R^2$: $\lVert\mathbf{x}_n\rVert^2$ for the four examples is $1 + 9 + 0 = 10$, $10$, $1 + 1 + 0 = 2$, and $2$, so the maximum is $10$.
- $\rho$: $y_n\mathbf{w}_f^\top\mathbf{x}_n$ is $1$ for all four examples (computed at the end of the PLA example), and $\lVert\mathbf{w}_f\rVert = \sqrt{4 + 1 + 1} = \sqrt{6}$, so $\rho = 1/\sqrt{6}$ and $\rho^2 = 1/6$.
- The bound: $R^2/\rho^2 = 10 \times 6 = 60$.

The run actually made 6 corrections, and $6 \le 60$. The two facts can also be checked step by step. In the table below, $T$ is the number of corrections made so far, and $\mathbf{w}_T$ is taken from the table in that example:

| $T$ | $\mathbf{w}_T$ | $\mathbf{w}_f^\top\mathbf{w}_T$ | Lower bound $T\rho\lVert\mathbf{w}_f\rVert = T$ | $\lVert\mathbf{w}_T\rVert^2$ | Upper bound $TR^2$ | $\cos\theta$ | Lower bound $\sqrt{T}\rho/R$ |
|---|---|---|---|---|---|---|---|
| 1 | $(1, 3, 0)$ | $1$ | $1$ | $10$ | $10$ | $0.129$ | $0.129$ |
| 2 | $(0, 2, 0)$ | $2$ | $2$ | $4$ | $20$ | $0.408$ | $0.183$ |
| 3 | $(-1, 2, -1)$ | $3$ | $3$ | $6$ | $30$ | $0.500$ | $0.224$ |
| 4 | $(0, 2, 2)$ | $4$ | $4$ | $8$ | $40$ | $0.577$ | $0.258$ |
| 5 | $(-1, 1, 2)$ | $5$ | $5$ | $6$ | $50$ | $0.833$ | $0.289$ |
| 6 | $(-2, 1, 1)$ | $6$ | $6$ | $6$ | $60$ | $1.000$ | $0.316$ |

**What this table means.** The inner product column goes up by exactly 1 each time, because for this data every example's $y_n\mathbf{w}_f^\top\mathbf{x}_n$ equals the minimum 1, and the inequality in fact one is an equality here. The squared length column is far below its upper bound, and it can even decrease: it drops from $10$ to $4$ because the middle term at that step is $2y_n\mathbf{w}_t^\top\mathbf{x}_n = 2 \times (-4) = -8$, and adding $\lVert\mathbf{x}_3\rVert^2 = 2$ gives a net change of $-6$. Fact two throws this negative term away entirely and also treats every example as the longest one, so its upper bound is loose, and that is where 60 being ten times 6 comes from. The $\cos\theta$ column climbs all the way to 1, meaning the direction of $\mathbf{w}_T$ ends up exactly the same as that of $\mathbf{w}_f$; at every step it is no lower than the lower bound in the rightmost column.

Try a different $\mathbf{w}_f$. $(-3, 2, 2)$ also classifies all four correctly: $y_n\mathbf{w}_f^\top\mathbf{x}_n$ is $3$, $3$, $1$, and $1$, the minimum is $1$, $\lVert\mathbf{w}_f\rVert^2 = 17$, $\rho^2 = 1/17$, and the bound is $170$. It holds just the same, only more loosely. For this data no $\mathbf{w}_f$ has a $\rho$ larger than $1/\sqrt{6}$ (the argument is an addition in this article): take any vector $\mathbf{u}$ of length 1 and average the four values $y_n\mathbf{u}^\top\mathbf{x}_n$ with weights $\frac{1}{6}$, $\frac{1}{6}$, $\frac{1}{3}$, $\frac{1}{3}$; the result is the inner product of $\mathbf{u}$ with $\frac{1}{6}(1,3,0) + \frac{1}{6}(1,0,3) - \frac{1}{3}(1,1,0) - \frac{1}{3}(1,0,1) = \frac{1}{6}(-2, 1, 1)$, which cannot exceed the length of the latter, $\sqrt{6}/6 = 1/\sqrt{6}$. The minimum of four numbers is no larger than their weighted average, so $\rho \le 1/\sqrt{6}$. 60 is therefore the best number this theorem can give for this data.

The bound holds for every variant, and this can be verified too: run cyclic PLA once for each of the 24 orderings of the four examples, and the number of corrections is 6, 12, or 14; pick an arbitrary example among the misclassified ones each time, enumerate every possible way of picking, and the number of corrections is at least 6 and at most 15. None of them exceeds 60.

### Fun Time: the bound in terms of R and ρ

**Question (page 16):** Let's upper-bound $T$, the number of mistakes that PLA 'corrects'. Define

$$
R^2 = \max_{n}\lVert\mathbf{x}_n\rVert^2, \qquad \rho = \min_{n} y_n\frac{\mathbf{w}_f^\top}{\lVert\mathbf{w}_f\rVert}\mathbf{x}_n
$$

We want to show that $T \le \square$. Express the upper bound $\square$ by the two terms above.

1. $R/\rho$
2. $R^2/\rho^2$
3. $R/\rho^2$
4. $\rho^2/R^2$

**Answer: 2.** The handout's explanation: the maximum value of $\frac{\mathbf{w}_f^\top}{\lVert\mathbf{w}_f\rVert}\frac{\mathbf{w}_t}{\lVert\mathbf{w}_t\rVert}$ is 1, and since $T$ mistake corrections increase the inner product by $\sqrt{T}\cdot\text{constant}$, the maximum number of corrected mistakes is $1/\text{constant}^2$. The constant was computed above as $\rho/R$, so $1/\text{constant}^2 = R^2/\rho^2$.

The other choices can be ruled out from two angles. One is the square root: the inequality is $\sqrt{T} \le R/\rho$ and has to be squared to get $T$; choice 1 is missing the square and choice 3 squares only half. The other is the direction: data farther from the separating line should be easier to separate, so a larger $\rho$ should give a smaller bound, and choice 4 has $\rho$ in the numerator, the wrong way around. Check with the four-point example: choice 1 gives $\sqrt{10} \times \sqrt{6} \approx 7.7$, choice 3 gives $\sqrt{10} \times 6 \approx 19$, and choice 4 gives $1/60$. The run actually made 6 corrections, which refutes choice 4 outright; other orderings produced 12 and 14 corrections, so choice 1 fails too. Choice 3 has the wrong units: scale all the data up by a factor of 10 ($x_0$ included), and both $R$ and $\rho$ become 10 times larger, every step of PLA is simply scaled along with them and the number of corrections does not change, yet $R/\rho^2$ becomes one tenth, about $1.9$, smaller than the actual 6 corrections.

## What to do when the data cannot be separated: the pocket algorithm

```youtube
url: https://www.youtube.com/watch?v=vT-mUeRJfys
title: Learning to Answer Yes/No :: Non-Separable Data @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–02:48 sums up the pros and cons of PLA, 02:48–06:56 discusses noise and NP-hardness, 06:56–10:02 is the pocket algorithm, 10:02–11:34 is Fun Time, and the summary follows.)

### Two practical problems with PLA's guarantee

Page 17 first organizes the result of the convergence guarantee into three blocks.

**Guarantee.** As long as the data is linear separable and corrections are made only by mistake: the inner product of $\mathbf{w}_f$ and $\mathbf{w}_t$ grows fast, the length of $\mathbf{w}_t$ grows slowly, and the PLA 'lines' are more and more aligned with $\mathbf{w}_f$, so it halts.

**Pros.** Simple to implement, fast, works in any dimension $d$. In the lecture, Lin explains that the whole algorithm consists of vector operations only and uses no geometric property specific to two dimensions, so two dimensions and a hundred dimensions are about the same to the program, apart from taking 50 times the computation time.

**Cons.** The handout lists two:

- It 'assumes' linear separable $\mathcal{D}$ to halt, and this property is unknown in advance. The handout adds in parentheses: no need for PLA if we know $\mathbf{w}_f$. The lecture calls this a circular argument: confirming that the assumption holds requires finding a $\mathbf{w}_f$ first, but finding $\mathbf{w}_f$ is exactly what PLA is for.
- It is not fully sure how long halting takes, because $\rho$ depends on $\mathbf{w}_f$. $R$ can be computed directly from the data; $\rho$ cannot. The handout adds one remark: though practically fast.

The lecture combines the two into the situation you face in real use: all you can do is let PLA keep running, and be glad if it halts; if it does not, it may not have run long enough yet, or the data may not be separable at all, and you cannot tell the two cases apart.

### Noisy data: step back and look for the line with the fewest mistakes

Page 18 changes one place in the previous lecture's flowchart: the box for the target function $f$ now has "+ noise" added. The sources of noise mentioned in the lecture are a bank having issued cards wrongly in the past, with bad results afterwards, or its financial advisors getting some things wrong. As a result, even if $f$ really is a line, the $\mathcal{D}$ we get is not necessarily linearly separable. The question becomes: how to at least get $g \approx f$ on noisy $\mathcal{D}$?

The reasoning on page 19 has three steps:

- Assume 'little' noise, so most of the data still has $y_n = f(\mathbf{x}_n)$. The reason given in the lecture is that if the noise were large enough to drown out $f$, what we would be learning is the noise.
- If so, $g \approx f$ on $\mathcal{D}$ means that most of the data has $y_n = g(\mathbf{x}_n)$.
- Since no line makes no mistakes at all, look for the line that makes the fewest:

$$
\mathbf{w}_g \leftarrow \underset{\mathbf{w}}{\text{argmin}} \sum_{n=1}^{N} \big[\!\big[\, y_n \ne \text{sign}(\mathbf{w}^\top\mathbf{x}_n) \,\big]\!\big]
$$

The double square brackets are the handout's notation: the value is 1 when the condition inside holds and 0 when it does not, so this sum is the number of examples that $\mathbf{w}$ gets wrong on $\mathcal{D}$. The figure on the same page is the middle one from page 13: a diagonal line classifies most of the points correctly, with a few points left on each side that are mixed into the other.

The handout follows immediately with: NP-hard to solve, unfortunately. For those who have not heard the term, the lecture explains it as a very hard problem for which no efficient algorithm is currently known; Lin also jokes that anyone with an efficient solution should come and collaborate right away. So the practical question is: can we modify PLA to get an 'approximately good' $g$?

### Pocket: keep the best line in your pocket

The pocket algorithm on page 20 is PLA plus a few lines (the handout prints the original parts of PLA in black and the added parts in orange):

1. Initialize the pocket weights $\hat{\mathbf{w}}$.
2. For $t = 0, 1, \dots$:
   - Find an example $(\mathbf{x}_{n(t)}, y_{n(t)})$ that $\mathbf{w}_t$ gets wrong; the handout notes that it is found in a "random" way.
   - (Try to) correct the mistake: $\mathbf{w}_{t+1} \leftarrow \mathbf{w}_t + y_{n(t)}\mathbf{x}_{n(t)}$.
   - **If $\mathbf{w}_{t+1}$ makes fewer mistakes than $\hat{\mathbf{w}}$, replace $\hat{\mathbf{w}}$ by $\mathbf{w}_{t+1}$.**
3. Run until "enough" iterations, and return $\hat{\mathbf{w}}$ (called $\mathbf{w}_{\text{POCKET}}$) as $g$.

There are three differences from PLA. First, there is a pocket, which holds the line with the fewest mistakes seen so far; $\mathbf{w}_t$ keeps being corrected as usual, unaffected by the pocket. The analogy in the lecture is a greedy child clutching the most fun toy in hand, who throws it away for a new one on seeing something more fun; Lin adds that foreigners are more reserved, which is why they describe it as keeping it in a pocket. Second, the mistake is picked at random. The reason given in the lecture is the hope of seeing more variety among the lines along the way, which gives a better chance of running into a good one. Third, the stopping condition is different. PLA stops when there are no mistakes, a condition that never arrives when the data cannot be separated, so it is changed to running until you feel it has been enough iterations.

The handout's wording about the result is cautious: (somewhat) 'best' weights. It does not guarantee finding the line with the fewest mistakes. In the lecture, Lin says there is theory showing that the line it finds is fairly good, but this course does not go into it.

### A numerical example: after adding one noisy example

The following is also an example made up for this article. To the four points above, add a fifth example $(2, 2)$, labeled $-1$. According to the line $x_1 + x_2 = 2$ it should be positive, so think of it as a record that was entered wrongly.

These five cannot be separated. The midpoint of the two positive examples $(3, 0)$ and $(0, 3)$ is $(1.5, 1.5)$; the weighted average of the three negative examples in the proportions $\frac{1}{6}$, $\frac{1}{6}$, $\frac{2}{3}$, $\frac{1}{6}(1, 0) + \frac{1}{6}(0, 1) + \frac{2}{3}(2, 2)$, is also $(1.5, 1.5)$. Any line that predicts both positive examples as positive predicts their midpoint as positive; any line that predicts all three negative examples as negative predicts their weighted average as negative. The same point cannot be both positive and negative, so a perfect line does not exist, and the best line gets at least one example wrong.

To make the run reproducible, no randomness is used here; the next mistake is found in the order 1 to 5 (the same as cyclic PLA). At the start $\mathbf{w}_0 = \mathbf{0}$, all five scores are 0 and all are wrong, and the pocket starts with $\hat{\mathbf{w}} = \mathbf{0}$ (5 mistakes).

| Correction number | Point used | $\mathbf{w}_{t+1}$ | Mistakes of $\mathbf{w}_{t+1}$ (which examples) | Pocket |
|---|---|---|---|---|
| 1 | 1 | $(1, 3, 0)$ | 3 (3, 4, 5) | replaced by $(1, 3, 0)$, 3 mistakes |
| 2 | 3 | $(0, 2, 0)$ | 4 (2, 3, 4, 5) | not replaced |
| 3 | 4 | $(-1, 2, -1)$ | 3 (2, 3, 5) | not replaced, not fewer than 3 |
| 4 | 5 | $(-2, 0, -3)$ | 2 (1, 2) | replaced by $(-2, 0, -3)$, 2 mistakes |
| 5 | 1 | $(-1, 3, -3)$ | 2 (2, 3) | not replaced |
| 6 | 2 | $(0, 3, 0)$ | 4 (2, 3, 4, 5) | not replaced |
| 7 | 3 | $(-1, 2, 0)$ | 3 (2, 3, 5) | not replaced |
| 8 | 5 | $(-2, 0, -2)$ | 2 (1, 2) | not replaced |

Keep running, and correction 25 gives $(-3, 2, 2)$, which gets only example 5 wrong, and the pocket is replaced by it. It was proved above that at least one example must be wrong, so this is already the line with the fewest mistakes.

**What this example means.** First, the number of mistakes of $\mathbf{w}_t$ itself is 3, 4, 3, 2, 2, 4, 3, 2, up and down, with no trend toward getting better. Stop at an arbitrary point midway and take the $\mathbf{w}_t$ of that moment, and you may get a very bad line; the pocket exists for exactly this. Second, if you stop at correction 8, what is returned is $(-2, 0, -3)$, which gets both positive examples wrong and is still some way from the best line. There is no standard answer to how many is "enough", and this is where the handout writes somewhat. Third, after every correction all five examples have to be recomputed to know how many are wrong, and this cost is the point of the Fun Time below. Running the earlier PLA program on the same data, it still has not stopped after 10,000 corrections.

### Fun Time: pocket or PLA

**Question (page 21):** Should we use pocket or PLA? Since we do not know whether $\mathcal{D}$ is linear separable in advance, we may decide to just go with pocket instead of PLA. If $\mathcal{D}$ is actually linear separable, what's the difference between the two?

1. pocket on $\mathcal{D}$ is slower than PLA
2. pocket on $\mathcal{D}$ is faster than PLA
3. pocket on $\mathcal{D}$ returns a better $g$ in approximating $f$ than PLA
4. pocket on $\mathcal{D}$ returns a worse $g$ in approximating $f$ than PLA

**Answer: 1.** The handout's explanation: because pocket needs to check whether $\mathbf{w}_{t+1}$ is better than $\hat{\mathbf{w}}$ in each iteration, it is slower than PLA; on linear separable $\mathcal{D}$, $\mathbf{w}_{\text{POCKET}}$ is the same as $\mathbf{w}_{\text{PLA}}$, both making no mistakes.

The lecture gives two reasons for the slowdown, and the handout writes only the second. One is the effort of storing what is in the pocket. The other is that comparing which of two lines is better requires going through all the data; PLA only needs to find one mistake to move on. This article puts the second reason in numbers: a PLA correction, at its cheapest, computes a single inner product; pocket has to compute $N$ more inner products after every correction to count the mistakes.

Choice 2 points the wrong way. Choices 3 and 4 are wrong because, when the data is linearly separable, $\mathbf{w}_t$ eventually reaches a line that makes no mistakes; at that moment its number of mistakes is 0, necessarily fewer than what is in the pocket (unless the pocket already holds it), so the pocket ends up holding the very line PLA would return, and the two $g$ are equally good.

### Summary of this lecture

Page 22 condenses each of the four sections into a line: the perceptron hypothesis set is hyperplanes in $\mathbb{R}^d$, that is, linear classifiers; PLA corrects mistakes and improves iteratively; there is no mistake eventually if the data is linear separable; for non-separable data, hold the (somewhat) 'best' weights in the pocket. The handout's preview of the next lecture is the zoo of learning problems, and the lecture says machine learning can do more than yes/no questions.

Of the two kinds of questions on page 11, this lecture has answered half: PLA halts when the data is linearly separable, and once it halts it is entirely right on $\mathcal{D}$. "Outside $\mathcal{D}$, is $g$ still close to $f$" still has no answer.

## Self-check

**1. Currently $\mathbf{w}_t = (1, -2, 1)$. An example arrives whose original point is $(2, 1)$, with $y = +1$. Is it misclassified? If so, compute $\mathbf{w}_{t+1}$ and confirm how much this example's score changes after the correction.**

Answer: with $x_0$ added, $\mathbf{x} = (1, 2, 1)$ and the score is $1 - 4 + 1 = -2$, whose sign differs from $y = +1$, so it is misclassified. $\mathbf{w}_{t+1} = (1, -2, 1) + (1, 2, 1) = (2, 0, 2)$. The new score is $2 + 0 + 2 = 4$, and this time it is correct. The score goes from $-2$ to $4$, an increase of $6$, exactly $\lVert\mathbf{x}\rVert^2 = 1 + 4 + 1$.

**2. There are only two examples: $(1, 1)$ labeled $+1$ and $(-1, -1)$ labeled $-1$. How many corrections does PLA make starting from $\mathbf{w}_0 = \mathbf{0}$? Compute $R^2/\rho^2$ with $\mathbf{w}_f = (0, 1, 1)$ and with $\mathbf{w}_f = (1, 1, 1)$.**

Answer: $\mathbf{x}_1 = (1, 1, 1)$ and $\mathbf{x}_2 = (1, -1, -1)$. At the first step the score is 0, which counts as wrong, and $\mathbf{w}_1 = (1, 1, 1)$. Check example 2: $1 - 1 - 1 = -1$, the same sign as $y_2 = -1$; example 1: $3 > 0$. It halts after 1 correction. $R^2 = 3$. With $(0, 1, 1)$: $y_n\mathbf{w}_f^\top\mathbf{x}_n$ is $2$ for both examples, $\lVert\mathbf{w}_f\rVert^2 = 2$, $\rho^2 = 4/2 = 2$, and the bound is $3/2$. With $(1, 1, 1)$: the two values are $3$ and $1$, the minimum is $1$, $\rho^2 = 1/3$, and the bound is $9$. Both bounds hold; $T$ is an integer, so $T \le 1.5$ means at most 1 correction, and for this data the bound is tight.

**3. Where in the proof is "correct only when there is a mistake" used? If someone changed the algorithm to add every example whether it is classified correctly or not, would each of the two facts still hold?**

Criteria: the answer should point out that it is used only in fact two, to say that $2y_{n(t)}\mathbf{w}_t^\top\mathbf{x}_{n(t)} \le 0$ and can be dropped. Fact one holds for any example and is unaffected. If correctly classified examples are added, the middle term is positive, and the amount by which $\lVert\mathbf{w}_t\rVert^2$ grows at a time is no longer limited by $R^2$; in the extreme case of adding the same correctly classified example over and over, $\lVert\mathbf{w}_T\rVert$ grows in proportion to $T$, the lower bound on $\cos\theta$ no longer grows with $\sqrt{T}$, and no upper bound on $T$ follows.

**4. Multiply every $\mathbf{x}_n$ (including $x_0$) by 10. How does $R^2/\rho^2$ change? What about the number of PLA corrections?**

Answer: $R^2$ becomes 100 times larger. $\rho$ is the minimum of the projections of the $\mathbf{x}_n$ onto a unit vector, so it becomes 10 times larger and $\rho^2$ becomes 100 times larger. Dividing one by the other, the bound is unchanged. When PLA starts from $\mathbf{0}$, the $\mathbf{w}_t$ at every step is just 10 times the original, the signs of the scores do not change, and the mistakes picked and the number of corrections are exactly the same. Actually running it on the four-point example: after scaling it is still 6 corrections, and the final $\mathbf{w}$ is $(-20, 10, 10)$.

**5. While running pocket, six consecutive corrections produce $\mathbf{w}$ that make 4, 2, 3, 2, 1, 3 mistakes on $\mathcal{D}$, and the initial pocket makes 5 mistakes. How many mistakes does the line in the pocket make after each correction? If you stop at this point, which correction's $\mathbf{w}$ is returned?**

Answer: the pocket is 4, 2, 2, 2, 1, 1 in turn. The 2 mistakes at the fourth correction are not "fewer" than the 2 in the pocket, so it is not replaced. On stopping, the $\mathbf{w}$ from the fifth correction is returned, not the last one (the last one makes 3 mistakes).

## Exercises and corresponding reading

**The corresponding textbook sections.** The [Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) maps this lecture to 1.1.2 and 3.1 of [Learning from Data](http://amlbook.com) (LFD), and puts this lecture's four videos on the W2 list of videos to watch before class.

**What the Fall 2026 extended slides (02e) add.** [02e_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/02e_handout.pdf) on the same course page has four things beyond the MOOC handout:

- How to treat sign(0). Starting from $\mathbf{w}_0 = \mathbf{0}$, the first step necessarily runs into sign(0); the extended slides list four conventions, $-1$, $+1$, $0$, and random, and say that the choice matters little as long as $\mathbf{w}_1$ usually becomes non-zero. The numerical examples in this article use "0 counts as wrong", which corresponds to the third of these (sign(0) = 0, correct whenever it comes up).
- The role of $x_0$: every correction changes the zeroth component of $\mathbf{w}_t$ by $y_{n(t)}$.
- The full derivation that joins the two facts into $T \le R^2/\rho^2$, which the extended slides call the Magic Chain; its content is the four steps in "Putting the two facts together" in this article.
- A comparison of pocket's pattern of "generate candidates, keep the better one" with contemporary approaches to aligning generative AI, citing a paper by Lu, Lin, and Wang at the ICML 2026 Workshop on Generative and Agentic AI for Biology.

**Homework.** The first homework of both semesters has problems on this lecture; there are no official solutions, and grading is limited to enrolled students.

[Fall 2024 HW1](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw1/hw1_red.pdf):

- Q3–4, Q7–8: how scaling the data and the value of $x_0$ change PLA's bound and behavior; the problems cite this lecture's page on the convergence bound. Self-check question 4 is a warm-up.
- Q9: a derivation about using a perceptron to detect hate posts.
- Q10–12: run randomly picking PLA 1000 times on the first 200 examples of LIBSVM's [rcv1_train.binary](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/binary/rcv1_train.binary.bz2), plot the histogram of the number of corrections and how $\lVert\mathbf{w}_t\rVert$ changes, then compare with the variant that "keeps correcting the same example until it is right". Q13 is a bonus.

[Fall 2026 hw1](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/hw1.pdf):

- Q2–4: the minimum number of corrections needed to guarantee fixing one mistake, how the bound changes after normalizing the inputs, and the relation between multiclass PLA with $K = 2$ and binary PLA.
- Q11–16 (programming problems): run random PLA 1000 times on [hw1_train.dat](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/hw1_train.dat) ($N = 256$, $\mathbf{x} \in \mathbb{R}^{12}$), measure the fraction of runs with $E_{\text{in}} = 0$, the number of corrections, and the median of $\lVert\mathbf{w}_{\text{PLA}}\rVert$, then see how the number of corrections changes when $\mathbf{x}$ is shrunk by half and when $x_0$ is changed to 0.5 or 0.

Without official solutions, you can check a programming problem yourself like this: on small data you generate yourself and know to be linearly separable, confirm that the error on the training data is 0 when the program halts, and check whether the number of corrections exceeds $R^2/\rho^2$. The guide to the whole assignment is in [Foundations Homework](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide-en).

**Hands-on.** Two things you can do tonight:

1. After watching the second video, without looking at the handout, write PLA in Python in 20 lines or fewer, and use this article's four-point example to check whether the output is $(-2, 1, 1)$ and 6 corrections.
2. Generate 50 linearly separable points on the two-dimensional plane yourself, run your PLA on them, draw the line after every correction, and compare with the figures on page 10 of the handout. As the handout reminds you, the feature values have to be much larger than $x_0 = 1$ for the picture to look good.

**Further reading.** The [Stanford CS229 guide](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en) introduces perceptrons and linear classification in a different way. [Caltech Learning from Data](https://work.caltech.edu/telecourse) is the course Abu-Mostafa teaches in English from the same textbook.

**Next lecture.** [Foundations Lecture 3: Types of Learning](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-03-types-of-learning-en) classifies learning problems by output, labels, the way data is obtained, and input; yes/no questions are only one cell of the grid.

## Course video sources

Original videos: [Perceptron Hypothesis Set](https://www.youtube.com/watch?v=WlpF1Phkv28), [Perceptron Learning Algorithm](https://www.youtube.com/watch?v=1xnUlrgJJGo), [Guarantee of PLA](https://www.youtube.com/watch?v=Okrrz0IYoSE), [Non-Separable Data](https://www.youtube.com/watch?v=vT-mUeRJfys)

- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

Checked: 2026-10-13. The video IDs, titles, and lengths were taken from the official playlist on that day; the videos have no caption track on YouTube, and what this article reports from the lecture comes from transcripts made for it.

## Update Log

- 2026-10-13: The series now has one article per lecture; this lecture is a newly split-out article, written from the handout and the video transcripts.

## References

- [Foundations Lecture 2 handout, 02_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/02_handout.pdf): the main source for this article. The content of the four sections, the derivations of the two PLA facts, the four Fun Time questions, and the demonstration figures on page 10 all come from this handout.
- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf): the IDs and titles of the four videos; what the text reports as said "in the lecture" is paraphrased from machine transcripts of these four videos.
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/): the official entry for handouts and recordings.
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/): the W2 list of videos to watch before class and the LFD sections.
- [Foundations Lecture 2 extended slides (02e_handout.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/02e_handout.pdf): the conventions for sign(0), the role of $x_0$, the Magic Chain, and the contemporary comparison for pocket.
- [Fall 2024 Homework 1 (hw1_red.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw1/hw1_red.pdf): the content of Q3–4 and Q7–13.
- [Fall 2026 Homework 1 (hw1.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/hw1.pdf) and [hw1_train.dat](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/hw1/hw1_train.dat): the content of Q2–4 and Q11–16 and the data for the programming problems.
- [LIBSVM Data: rcv1_train.binary](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/binary/rcv1_train.binary.bz2): the data used by the programming problems of Fall 2024 HW1.
- [Learning from Data textbook website](http://amlbook.com): the source of 1.1.2 and 3.1.
- [Caltech Learning from Data](https://work.caltech.edu/telecourse): further reading, an English-language course from the same textbook.
- [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques: Course Overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en): where this lecture sits in the whole course and the reading routes.
