---
title: "Training versus Testing: Infinitely Many Lines, Only a Few Kinds | NTU Hsuan-Tien Lin Machine Learning Foundations Lecture 5"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, learning-theory, growth-function]
lang: en
math: true
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 5
tldr: "The guarantee from the previous lecture contains the number of hypotheses M, and the perceptron has infinitely many lines, so M is infinite. This lecture instead counts how many ○× patterns (dichotomies) those lines can produce on N data points, and takes the maximum over all placements to get the growth function m_H(N): N+1 for positive rays, ½N²+½N+1 for positive intervals, 2ᴺ for convex sets, and at most 14 for 2D perceptrons on 4 points. The first number of points at which the growth function falls short of 2ᴺ is called a break point; the handout conjectures that it forces the growth function down to a polynomial, and leaves the proof to the next lecture."
description: "A guide to Lecture 5 of NTU Hsuan-Tien Lin's Machine Learning Foundations, Training versus Testing: the two central questions that learning splits into, the trade-off on M, where the union bound over-estimates, the definitions of dichotomy and growth function, how to count the growth functions of four hypothesis sets, shattering and break points, with all four Fun Time questions explained one by one."
draft: false
glossary:
  - term: "dichotomy"
    aliases: ["dichotomies"]
    definition: "The length-N ○× vector you get by looking only at the outputs of one hypothesis h on N inputs x₁…x_N. On a fixed set of N points, infinitely many hypotheses produce at most 2^N dichotomies."
    context: "Foundations Lecture 5 uses the number of dichotomies as the candidate for replacing the number of hypotheses M."
    links:
      - label: "Foundations Lecture 5 handout"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/05_handout.pdf"
  - term: "growth function"
    aliases: ["m_H(N)"]
    definition: "The number of dichotomies the hypothesis set H can produce, maximized over all possible sets of N inputs. It is upper-bounded by 2^N."
    context: "Foundations Lecture 5 wants to use it in place of M in the Hoeffding-plus-union-bound inequality; whether the replacement is allowed is not proved until the next lecture."
    links:
      - label: "Foundations Lecture 5 handout"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/05_handout.pdf"
  - term: "shatter"
    aliases: ["shattered"]
    definition: "N inputs are shattered by H when H can produce all 2^N dichotomies on those N points."
    context: "Foundations Lecture 5 introduces it with the convex sets example: N points placed on a circle can be shattered."
  - term: "break point"
    aliases: ["minimum break point"]
    definition: "If no k inputs can be shattered by H, then k is a break point for H; so are k+1, k+2, and so on. The course usually discusses only the smallest one."
    context: "The minimum break point of 2D perceptrons is 4."
    links:
      - label: "Foundations Lecture 5 handout"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/05_handout.pdf"
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function)

**Video status: Videos included.** This article is written from the official MOOC handout [05_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/05_handout.pdf) and transcripts of this lecture's four official videos, with formulas following the handout. The transcripts are machine transcripts made for this article (Whisper), not official captions, and no human has proofread them. The videos are taught in Mandarin; the slides are in English. Each section opens with its official video and the approximate time ranges. Page numbers refer to the number at the lower right of each slide (0/27 to 27/27), and wherever the text says "in the lecture", it is reporting what is said in the videos.

This is Foundations Lecture 5 in [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en). The Roadmap on page 1 of the handout divides Foundations into four questions. The first four lectures answered the first one, "When Can Machines Learn?", and this lecture begins the second, "Why Can Machines Learn?". The conclusion of the previous lecture, [Foundations Lecture 4: Feasibility of Learning](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning-en), takes up a single line on that page: learning is PAC-possible when the data come from statistical sampling and the size of the hypothesis set $\lvert\mathcal{H}\rvert$ is finite. This lecture deals with the word "finite". The perceptron from [Foundations Lecture 2: Perceptrons and PLA](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm-en) has infinitely many lines, and the inequality from the previous lecture guarantees nothing for it.

The prerequisites are $E_{\text{in}}$, $E_{\text{out}}$, Hoeffding's inequality, and the union bound from the previous lecture, plus the perceptron from Lecture 2. This lecture has almost no algebra. The work is counting: how many ○× patterns a hypothesis set can produce on $N$ points. After reading, you should be able to work out the growth functions of positive rays, positive intervals, and convex sets on your own, find on paper the two patterns that 2D perceptrons cannot produce on four points, and find the break point of any new hypothesis set.

The route through the lecture:

1. **Two central questions**: $E_{\text{out}}(g) \approx E_{\text{in}}(g)$ and $E_{\text{in}}(g) \approx 0$; the number of hypotheses $M$ pulls the two in opposite directions.
2. **$M$ comes from the union bound**: similar hypotheses go wrong together, but the union bound treats them as separate bad events and counts them repeatedly.
3. **Count kinds instead**: infinitely many lines, yet only finitely many kinds when viewed from $N$ data points.
4. **The growth function** $m_{\mathcal{H}}(N)$: turning "how many kinds" into a quantity defined for any hypothesis set.
5. **Break point**: the first place where the growth function falls short of $2^N$.

## Learning splits into two questions, and M is caught between them

```youtube
url: https://www.youtube.com/watch?v=4aIAxH8eBMs
title: Training versus Testing :: Recap and Preview @ Machine Learning Foundations (機器學習基石)
```

(Video 00:17–04:38 reviews the previous lecture's flow diagram, 04:38–06:51 ties the four lectures into two questions, 06:51–09:57 covers the trade-off on M, 09:57–12:22 previews what comes next, and Fun Time follows.)

### Training and testing each take care of one thing

Page 2 of the handout draws the previous lecture's conclusion back onto the learning flow diagram. The diagram has the unknown target function $f$, the training examples $\mathcal{D}$, the algorithm $\mathcal{A}$, the hypothesis set $\mathcal{H}$, and the final hypothesis $g$. What the previous lecture added is an unknown probability distribution $P$, from which both the training inputs $\mathbf{x}_1, \dots, \mathbf{x}_N$ and the future test input $\mathbf{x}$ are drawn. The two statements at the top of the page are:

- If $\lvert\mathcal{H}\rvert = M$ is finite and $N$ is large enough, then for whatever $g$ picked by $\mathcal{A}$, $E_{\text{out}}(g) \approx E_{\text{in}}(g)$.
- If $\mathcal{A}$ finds one $g$ with $E_{\text{in}}(g) \approx 0$, PAC guarantees $E_{\text{out}}(g) \approx 0$, and learning is possible.

The lower right corner of the diagram writes these two facts as a chain and labels each link with one word:

$$
E_{\text{out}}(g) \underbrace{\approx}_{\text{test}} E_{\text{in}}(g) \underbrace{\approx}_{\text{train}} 0
$$

This is what the lecture title, Training versus Testing, means. The $\approx$ on the right is the job of training: the algorithm pushes the error down on the data it has seen. The $\approx$ on the left only shows up at test time: when $g$ is used on data it has not seen, it should perform about as well as it did in training. In the lecture, Lin explains why training alone is not enough. If the only requirement were $E_{\text{in}}$ close to 0, memorizing all the data would do, and that is easy for a machine. But the test is on unseen data, which is why it takes effort to make sure $E_{\text{in}}$ and $E_{\text{out}}$ are close.

### Two central questions

Page 3 marks what each of the first four lectures contributed on a single line of formulas:

| Which part of the formula | Which lecture | What it says |
|---|---|---|
| $g \approx f$ | Lecture 1 | The goal of learning: find a $g$ that resembles the unknown $f$ |
| $E_{\text{in}}(g) \approx 0$ | Lecture 2 | PLA and pocket make few mistakes on the data seen |
| batch, supervised, binary classification | Lecture 3 | The setting in which all of this is discussed |
| $E_{\text{out}}(g) \approx E_{\text{in}}(g)$ | Lecture 4 | When there are not too many hypotheses, the two are close |

In this setting $g \approx f$ is the same as $E_{\text{out}}(g) \approx 0$, and that is achieved through two links, $E_{\text{out}}(g) \approx E_{\text{in}}(g)$ and $E_{\text{in}}(g) \approx 0$. So the handout says learning splits into two central questions:

1. Can we make sure that $E_{\text{out}}(g)$ is close enough to $E_{\text{in}}(g)$?
2. Can we make $E_{\text{in}}(g)$ small enough?

In the lecture, Lin adds one remark on the first question: without it, the goal set in Lecture 1 and the work done in Lecture 2 would not connect at all. The second question is the part that Lecture 2 already started on, and later lectures will teach more techniques for it.

### Small M is bad, and so is large M

Page 3 ends by asking what role $M = \lvert\mathcal{H}\rvert$ plays for the two questions. Page 4 answers with a comparison table:

| | Small $M$ | Large $M$ |
|---|---|---|
| Question 1: $E_{\text{out}} \approx E_{\text{in}}$? | Yes. $\mathbb{P}[\text{BAD}] \le 2 \cdot M \cdot \exp(\dots)$; with small $M$ the upper bound on the bad probability is small | No. Same formula; with large $M$ the upper bound grows with it |
| Question 2: $E_{\text{in}}$ small enough? | No. Too few choices | Yes. Many choices |

In the lecture, Lin walks through both columns. When $M$ is small, the algorithm has only a limited number of hypotheses to pick from and may not find one with a very small $E_{\text{in}}$, at least not for every problem, because different problems need different hypotheses. When $M$ is large, setting computation aside, the algorithm can always pick one with small $E_{\text{in}}$, but the upper bound on the probability of something bad happening grows. The numbers given in the lecture: going from 10 hypotheses to 10,000 multiplies the upper bound by 1,000, leaving only a weaker guarantee.

The handout concludes that using the right $M$ (or $\mathcal{H}$) is important, and then asks: $M = \infty$ doomed? Infinity falls on the "too large" side. In the lecture, Lin follows this logic to a joke: seen this way, the PLA demonstrated earlier may well have been a fraud.

### What the next few lectures will do

Page 5 puts the known and the to-do side by side. The known part is the inequality from the previous lecture:

$$
\mathbb{P}\big[\lvert E_{\text{in}}(g) - E_{\text{out}}(g)\rvert > \epsilon\big] \le 2 \cdot M \cdot \exp\big(-2\epsilon^2 N\big)
$$

There are three to-do items:

- Establish a **finite quantity** that replaces $M$. The handout writes it as $m_{\mathcal{H}}$ for now:

$$
\mathbb{P}\big[\lvert E_{\text{in}}(g) - E_{\text{out}}(g)\rvert > \epsilon\big] \overset{?}{\le} 2 \cdot m_{\mathcal{H}} \cdot \exp\big(-2\epsilon^2 N\big)
$$

- Use it to justify the feasibility of learning for infinite $M$.
- Study $m_{\mathcal{H}}$ to understand its trade-off in choosing the "right" $\mathcal{H}$, just as was done for $M$ a moment ago.

In the lecture, Lin explains the notation: the lowercase $m$ is there because the quantity may be smaller than the original $M$, and the subscript $\mathcal{H}$ says it is some property of the hypothesis set. The question mark over the inequality gets its own explanation too: nothing so far says the replacement is allowed; the point is only that if it is, a finite quantity takes the place of the infinite $M$. That question mark is still there when this lecture ends, and the next lecture deals with it.

At the bottom of the page the handout writes: mysterious PLA to be fully resolved after 3 more lectures. In the lecture, Lin says it will take roughly three more lectures, about three hours, before anyone can say out loud that PLA really does learn something. Lin also offers some reassurance in advance: these are theory lectures, but the aim is not to go through dry proofs line by line. The aim is to show how these pieces of theory grew out of one another, and the reasoning behind them.

### Fun Time: how much data to collect

**Question (page 6):** One way to use the inequality is to pick a tolerable difference $\epsilon$ as well as a tolerable BAD probability $\delta$ (so that the right-hand side $2 \cdot M \cdot \exp(-2\epsilon^2 N)$ equals $\delta$), and then gather data with size large enough to achieve those tolerance criteria. Let $\epsilon = 0.1$, $\delta = 0.05$, and $M = 100$. What is the data size needed?

1. 215
2. 415
3. 615
4. 815

**Answer: 2.** The handout gives only the result $N = \frac{1}{2\epsilon^2}\ln\frac{2M}{\delta}$; the rearrangement in between goes as follows. Require the right-hand side to be at most $\delta$:

$$
2M\exp\big(-2\epsilon^2 N\big) \le \delta \quad\Longleftrightarrow\quad \exp\big(-2\epsilon^2 N\big) \le \frac{\delta}{2M}
$$

Take the natural logarithm of both sides ($\ln$ is increasing, so the inequality keeps its direction), then divide both sides by $-2\epsilon^2$ (a negative number, so the inequality flips):

$$
-2\epsilon^2 N \le \ln\frac{\delta}{2M} \quad\Longleftrightarrow\quad N \ge \frac{1}{2\epsilon^2}\ln\frac{2M}{\delta}
$$

Plug in the numbers: $\frac{1}{2 \times 0.01} = 50$, $\frac{2M}{\delta} = \frac{200}{0.05} = 4000$, $\ln 4000 \approx 8.294$, so $N \ge 414.7$, which rounds up to 415. In the lecture, Lin frames this question as a scenario: your boss demands a difference of no more than 0.1 and a chance of no more than 5% that something bad happens, and you have to say how much data to collect. Every number in the formula is known except $N$, so you solve backwards for it.

Substituting the other options back in: with $N = 215$ the right-hand side is $200 \times e^{-4.3} \approx 2.71$, which is larger than 1 and guarantees nothing. 615 and 815 give about $0.00091$ and $0.000017$, both of which meet the requirement, but the question asks for the data size needed, that is, the minimum.

An addition in this article: in this formula $M$ sits inside the logarithm. When $M$ goes from 100 to 10,000, the upper bound on the bad probability becomes 100 times larger, yet the data needed only rises from 415 to 645; with $M = 10^6$ it is 876. So a somewhat larger $M$ is not a big problem. The trouble is $M = \infty$: $\ln\infty$ is still infinite, and no amount of data is enough.

## Infinitely many lines: how many kinds, as seen from the data

```youtube
url: https://www.youtube.com/watch?v=oAW0_j8_l3Y
title: Training versus Testing :: Effective Number of Lines @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–03:27 re-examines the union bound, 03:27–06:52 covers one point and two points, 06:52–09:43 three points, 09:43–11:35 four points, 11:35–14:03 defines the effective number of lines, and Fun Time follows.)

### M came from the union bound

To replace $M$, first look at how it appeared in the first place (page 7). For the $m$-th hypothesis $h_m$, define the BAD event

$$
\mathcal{B}_m:\ \lvert E_{\text{in}}(h_m) - E_{\text{out}}(h_m)\rvert > \epsilon
$$

Hoeffding's inequality from the previous lecture says that for a single fixed hypothesis, $\mathbb{P}[\mathcal{B}_m] \le 2\exp(-2\epsilon^2 N)$. To give the algorithm $\mathcal{A}$ freedom of choice (in the lecture, Lin describes this as not stepping on a landmine), what is needed is that no hypothesis at all goes wrong, so the quantity to bound is $\mathbb{P}[\mathcal{B}_1 \text{ or } \mathcal{B}_2 \text{ or } \dots \mathcal{B}_M]$. The previous lecture handled it with the union bound:

$$
\mathbb{P}[\mathcal{B}_1 \text{ or } \mathcal{B}_2 \text{ or } \dots \mathcal{B}_M] \le \mathbb{P}[\mathcal{B}_1] + \mathbb{P}[\mathcal{B}_2] + \dots + \mathbb{P}[\mathcal{B}_M]
$$

The right-hand side has $M$ terms, each at most $2\exp(-2\epsilon^2 N)$, and that is how the factor $M$ gets multiplied in. The handout notes that the worst case, where equality holds, is all $\mathcal{B}_m$ non-overlapping. When $M$ is infinite, the right-hand side is a sum of infinitely many terms. In the lecture, Lin points out that as long as each term is some nonzero number, the sum can be far larger than 1, and then the bound means nothing, since a probability never exceeds 1 anyway.

### Where the union bound over-estimates

Page 8 answers: the BAD events in fact overlap heavily. Take two very similar hypotheses $h_1 \approx h_2$; the example in the lecture is two lines of the perceptron lying very close together. The handout lists two reasons:

1. $E_{\text{out}}(h_1) \approx E_{\text{out}}(h_2)$. The two lines disagree only on a narrow sliver between them. In the lecture, Lin adds a condition: as long as the probability distribution is not too nasty, the probability of landing in that sliver is small.
2. For most $\mathcal{D}$, $E_{\text{in}}(h_1) = E_{\text{in}}(h_2)$. As long as none of the data at hand happens to land in the sliver where the two lines differ, the two lines judge every data point the same way, and $E_{\text{in}}$ is the same number, not just approximately.

Together, these mean that the datasets on which $h_1$ goes wrong and the datasets on which $h_2$ goes wrong are almost the same collection. The right side of the slide shows three circles $\mathcal{B}_1$, $\mathcal{B}_2$, $\mathcal{B}_3$ lying almost on top of one another. The union bound amounts to pulling the three circles apart, computing each area once, and adding them up, so the overlapping part is counted repeatedly. The handout's word for this is over-estimating. Infinitely many lines are infinitely many such overlapping circles, and that is why the sum blows up.

So the handout sets the direction for this lecture: to account for overlap, can we group similar hypotheses by kind? In the lecture, Lin calls this the first step: divide the infinitely many hypotheses into finitely many classes, where the hypotheses within a class look much alike.

### One point, two points

Page 9 tries this with $\mathcal{H} = \{\text{all lines in } \mathbb{R}^2\}$, that is, all perceptrons in the plane. There are infinitely many lines. Lin's way in, in the lecture: the data are finite, so look from the eyes of the data.

**Only one input $\mathbf{x}_1$.** Viewed from it, there are only two kinds of lines: those that classify $\mathbf{x}_1$ as ○, and those that classify $\mathbf{x}_1$ as ×. The slide draws two lines $h_1$ and $h_2$ with different positions and slopes as representatives, and the handout writes the two kinds as $h_1$-like and $h_2$-like. In the lecture, Lin also demonstrates the other direction: two lines that look different count as the same kind as long as both classify $\mathbf{x}_1$ as ○.

**Two inputs $\mathbf{x}_1, \mathbf{x}_2$ (page 10).** Four kinds:

| Kind | $\mathbf{x}_1$ | $\mathbf{x}_2$ | How to draw it |
|---|---|---|---|
| 1 | ○ | ○ | Both points on the positive side of the line |
| 2 | × | × | Swap the positive and negative sides of the previous line |
| 3 | ○ | × | The line passes between the two points, with the positive side toward $\mathbf{x}_1$ |
| 4 | × | ○ | Swap the positive and negative sides of the previous line |

In the lecture, Lin says these four kinds of lines can be represented directly by the circles and crosses they produce on $\mathbf{x}_1$ and $\mathbf{x}_2$. One input gives 2 kinds, two inputs give 4, and the handout goes on to ask about three inputs.

### Three points: 8 kinds, but not always

Page 11 arranges three points in a triangle and lists 8 small pictures: all ○, all ×, two ○ and one × (3 kinds), two × and one ○ (3 kinds). In the lecture, Lin gives the test: whenever a ○× pattern is linearly separable, some line produces it, and that kind exists. However the three vertices of a triangle are labeled, one line can separate the ○ from the ×, so all 8 kinds exist.

The handout then asks: always 8 for three inputs? Page 12 switches to another three inputs: three points on the same straight line, with $\mathbf{x}_2$ in the middle. Now two of the 8 patterns are crossed out:

| $\mathbf{x}_1$ | $\mathbf{x}_2$ (middle) | $\mathbf{x}_3$ | Can it be produced? |
|---|---|---|---|
| ○ | × | ○ | No |
| × | ○ | × | No |

A straight line meets the line through these three points in at most one point, so it can only cut the three points into "a consecutive few on one side, a consecutive few on the other"; the middle point cannot differ from both ends. That leaves 6 kinds. The handout's conclusion is 'fewer than 8' when degenerate, with collinear or same inputs given as examples in parentheses. Lin covers the latter in the lecture as well: if two points sit at the same position and one must be ○ and the other ×, no line can do it.

### Four points: at most 14 kinds

Page 13 arranges four points in a quadrilateral, with $\mathbf{x}_1$ at the top, $\mathbf{x}_2$ on the left, $\mathbf{x}_3$ at the bottom, and $\mathbf{x}_4$ on the right. Four points have $2^4 = 16$ ○× patterns, yet the slide draws only 8 small pictures, with "14: 2×" written next to them. In the lecture, Lin first asks on the students' behalf why only 8 are listed: the other 8 are symmetric. If a pattern can be produced, swapping the positive and negative sides of that line flips the ○× of every point, so the flipped pattern can be produced too. In all 8 pictures $\mathbf{x}_1$ is ○, and each picture stands for itself and its flipped version.

One of the 8 is crossed out: $\mathbf{x}_1$ and $\mathbf{x}_3$ are ○ while $\mathbf{x}_2$ and $\mathbf{x}_4$ are ×, that is, diagonally opposite points share a sign. In the lecture, Lin says that a line can be drawn for each of the other pictures, and only this one has no way of putting the ○ on one side and the × on the other; among the infinitely many lines, no such line exists. So the number of kinds is $(8 - 1) \times 2 = 14$.

The handout's conclusion on this page is stronger than the earlier ones: for any four inputs at most 14. However the four points are placed, you never get 16 kinds. In the lecture, Lin adds that collinear or coincident points give fewer, and a more general placement gives 14.

The handout does not prove the claim about "any four inputs". Below, two concrete sets of coordinates are each checked once. These are examples made up for this article, not from the slides.

**Placement 1: a square.** The four points, in order, are $(0,0)$, $(1,0)$, $(1,1)$, $(0,1)$. Suppose a line $\text{sign}(w_1 x_1 + w_2 x_2 + b)$ classifies the diagonal pair $(0,0)$, $(1,1)$ as ○ and $(1,0)$, $(0,1)$ as ×. The four conditions are

$$
b > 0,\qquad w_1 + w_2 + b > 0,\qquad w_1 + b < 0,\qquad w_2 + b < 0
$$

Adding the first two gives $w_1 + w_2 + 2b > 0$, and adding the last two gives $w_1 + w_2 + 2b < 0$, a contradiction. So this pattern (and its flipped version) cannot be produced. If you treat the two coordinates as two input bits and ○ as output 1, its flipped version ($(1,0)$ and $(0,1)$ are ○) is exactly the truth table of the logical operation XOR, which is why this diagonal-same-sign labeling is often called the XOR pattern. The other 14 patterns all work: all ○ and all ×, 1 each; the 8 patterns where a single point differs from the rest, using a line that cuts off that corner; and the 4 patterns where two adjacent points share a sign, using a horizontal or a vertical line. $2 + 8 + 4 = 14$.

**Placement 2: a triangle plus an interior point.** $(0,0)$, $(4,0)$, $(0,4)$, plus $(1,1)$. The interior point can be written as a weighted average of the three vertices: $(1,1) = \frac{1}{2}(0,0) + \frac{1}{4}(4,0) + \frac{1}{4}(0,4)$. If a line makes $w_1 x_1 + w_2 x_2 + b$ positive at all three vertices, the value at the interior point is a weighted average of those three positive numbers and is positive as well, so it cannot be ×. So "three ○ outside, one × inside" and its flipped version cannot be produced, and the other 14 patterns can.

For this article, all 16 patterns for both sets of coordinates were checked one by one with linear programming. Both give 14 kinds, and the missing ones are exactly the two described above.

Neither argument depends on the specific coordinates, so they can be joined into an explanation for "any four points". Four points fall into three cases:

1. **No three points collinear, and the four points form a convex quadrilateral.** The two diagonals cross at a point $\mathbf{p}$. Since $\mathbf{p}$ lies on both diagonals, it is a weighted average of one diagonal pair and also a weighted average of the other diagonal pair. Suppose a line classifies one diagonal pair as ○ and the other pair as ×: by the reasoning of placement 2, the former makes $w_1 x_1 + w_2 x_2 + b$ positive at $\mathbf{p}$ and the latter makes it negative, a contradiction. This pattern and its flipped version cannot be produced.
2. **No three points collinear, and one point lies inside the triangle formed by the other three.** This is placement 2: "three ○ outside, one × inside" and its flipped version cannot be produced.
3. **Three points collinear, or two points coincident.** Three collinear points cannot produce "middle differs from both ends", and labeling the fourth point ○ or × does not rescue it, so at least 4 patterns are missing (Self-check question 3). When two points coincide, none of the 8 patterns that label them one ○ and one × can be produced.

Four points with no three collinear must be in one of the first two cases, so however they are placed, at least 2 patterns are missing and there are at most 14. This discussion is an addition in this article; the handout gives only the conclusion.

### The effective number of lines

Page 14 gives this "at most how many kinds" a name: the maximum kinds of lines with respect to $N$ inputs $\mathbf{x}_1, \dots, \mathbf{x}_N$ is called the effective number of lines.

| $N$ | effective($N$) | $2^N$ |
|---|---|---|
| 1 | 2 | 2 |
| 2 | 4 | 4 |
| 3 | 8 | 8 |
| 4 | 14 | 16 |

The handout lists three points above it:

- **It must be at most $2^N$.** The handout writes (why?), and Lin answers in the lecture: each point has only two possibilities, ○ and ×, so $N$ points have at most $2^N$ patterns; 10 points, for example, have 1,024.
- **It is a finite grouping of infinitely many lines.** However many lines there are, this number is finite.
- **Wish:** replace the $M$ in the inequality with it.

$$
\mathbb{P}\big[\lvert E_{\text{in}}(g) - E_{\text{out}}(g)\rvert > \epsilon\big] \le 2 \cdot \text{effective}(N) \cdot \exp\big(-2\epsilon^2 N\big)
$$

The handout's word is wish. The bottom of the page spells out the conditions: if (1) effective($N$) can replace $M$ and (2) effective($N$) $\ll 2^N$, then learning is possible with infinite lines. In the lecture, Lin stresses the 14 in the table: the sequence does not continue as 2, 4, 8, 16, and at some point it suddenly drops below $2^N$. As long as it is much smaller than $2^N$, the exponentially decreasing term on the right will push it close to 0 once $N$ is large enough. Lin also says up front that for now this is a conjecture, or a fantasy, and that proving it will take some effort. Why each of the two conditions is needed is worked out with numbers in the Break point section.

### Fun Time: how many kinds of lines for five points

**Question (page 15):** What is the effective number of lines for five inputs in the plane?

1. 14
2. 16
3. 22
4. 32

**Answer: 3.** The handout's solution: if you put the five inputs roughly around a circle, you can then pick any **consecutive** inputs to be on one side of the line, and the other inputs to be on the other side. Counting by this procedure (which is how it is counted in the lecture too: one point is ○, two adjacent points are ○, and so on):

| Number of ○ | How many kinds | Explanation |
|---|---|---|
| 0 | 1 | All × |
| 1 | 5 | Any one point on the circle |
| 2 | 5 | Two adjacent points, with 5 choices of starting point |
| 3 | 5 | Three adjacent points |
| 4 | 5 | Four adjacent points |
| 5 | 1 | All ○ |

The total is $1 + 5 \times 4 + 1 = 22$, much smaller than $2^5 = 32$. Why must the points be consecutive? An addition in this article: these five points form a convex pentagon, and a straight line passing through a convex polygon meets its boundary in at most two places, so the vertices are split into two arcs, each consecutive. A pattern like "○×○××", where the ○ are not adjacent, cannot be produced.

The handout goes on to say that you shall find it difficult to generate more kinds by varying the inputs, and that a formal proof will come in future lectures. In the lecture, Lin also says that proving 22 is the maximum is somewhat complicated, and hopes that after enough tries everyone will believe it. For this article, 300 random placements of five points were tried, checking all 32 patterns one by one with linear programming, and the largest count was also 22. This is only an experiment, not a proof.

The other options: 14 is the answer for four points. 32 would mean every pattern on five points can be produced; if that were true, then covering one of the points would leave four points on which all 16 patterns can be produced, contradicting "for any four inputs at most 14". 16 is $2^4$, the total number of patterns on four points, and has nothing to do with five points.

An addition in this article: apply this way of counting to $N$ points on a circle. For each number of ○ from 1 to $N-1$ there are $N$ kinds, plus all ○ and all ×, for a total of $N(N-1) + 2$ kinds. For $N = 1, 2, 3, 4, 5$ this gives 2, 4, 8, 14, 22, matching the handout's table; for $N = 6$ it gives 32, much smaller than $2^6 = 64$. This formula only shows that at least this many kinds can be produced. Whether it is the maximum is not answered in this lecture.

## Generalizing "how many kinds of lines" into the growth function

```youtube
url: https://www.youtube.com/watch?v=dnVofdAomWY
title: Training versus Testing :: Effective Number of Hypotheses @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–03:02 defines dichotomies, 03:02–05:48 defines the growth function, 05:48–09:20 covers positive rays, 09:20–11:51 positive intervals, 11:51–15:29 convex sets and shattering, and Fun Time follows.)

### Dichotomy: a hypothesis seen only on N points

The Effective Number of Lines section counted lines. In the lecture, Lin opens by saying that the hypothesis sets used later will not always be lines; they may be hyperplanes in high dimensions, or curves, so a way of speaking that works for any $\mathcal{H}$ is needed. Page 16 gives the definition. The hypothesis set is $\mathcal{H} = \{\text{hypothesis } h: \mathcal{X} \to \{\times, \circ\}\}$. Line up the outputs of one hypothesis $h$ on $N$ inputs:

$$
h(\mathbf{x}_1, \mathbf{x}_2, \dots, \mathbf{x}_N) = \big(h(\mathbf{x}_1), h(\mathbf{x}_2), \dots, h(\mathbf{x}_N)\big) \in \{\times, \circ\}^N
$$

This length-$N$ vector of circles and crosses is called a dichotomy. The handout describes it as a hypothesis 'limited' to the eyes of $\mathbf{x}_1, \dots, \mathbf{x}_N$, and the page title simply calls dichotomies mini-hypotheses. In the lecture, Lin explains the word as a split in two: it divides the points at hand into a pile of ○ and a pile of ×.

All the dichotomies that the hypotheses in $\mathcal{H}$ can implement on these $N$ points are collected into a set, written $\mathcal{H}(\mathbf{x}_1, \mathbf{x}_2, \dots, \mathbf{x}_N)$. The symbol is still $\mathcal{H}$, now followed by parentheses and the inputs, to show that what is being looked at is dichotomies and not the original hypotheses. The handout compares the two in a table:

| | hypotheses $\mathcal{H}$ | dichotomies $\mathcal{H}(\mathbf{x}_1, \dots, \mathbf{x}_N)$ |
|---|---|---|
| e.g. | all lines in the plane | $\{\circ\circ\circ\circ, \circ\circ\circ\times, \circ\circ\times\times, \dots\}$ |
| size | possibly infinite | upper bounded by $2^N$ |

The difference lies in the domain: a hypothesis must give an answer for every point of the whole input space $\mathcal{X}$, while a dichotomy gives answers only for $N$ specific points. Many different hypotheses correspond to the same dichotomy, which is what "the same kind of line" meant in the Effective Number of Lines section. The handout concludes: $\lvert\mathcal{H}(\mathbf{x}_1, \dots, \mathbf{x}_N)\rvert$ is a candidate for replacing $M$.

### The growth function: take the max over all placements

This candidate has a problem (page 17): it depends on which $N$ inputs were chosen. Three points in a triangle give 8, and three collinear points give 6. In the lecture, Lin says this dependence on the inputs would make the later theoretical analysis awkward, so it should be removed; and since the point is to count how many kinds there are, count the most there can be. The way to do it is to take the max over all possible $N$ inputs:

$$
m_{\mathcal{H}}(N) = \max_{\mathbf{x}_1, \mathbf{x}_2, \dots, \mathbf{x}_N \in \mathcal{X}} \big\lvert\mathcal{H}(\mathbf{x}_1, \mathbf{x}_2, \dots, \mathbf{x}_N)\big\rvert
$$

This is the growth function. It is a function of $N$: give it the number of points, and it answers how many dichotomies this hypothesis set can produce at most. After taking the max, it depends only on $\mathcal{H}$ and $N$, and not on what the data actually look like. It is also the formal definition of the $m_{\mathcal{H}}$ previewed in the subsection "What the next few lectures will do". Since every set of dichotomies has at most $2^N$ elements, the handout writes that the growth function is finite, upper-bounded by $2^N$.

The effective number of lines from the Effective Number of Lines section is the growth function of 2D perceptrons. The handout lists that table again, and writes the third row specifically as $\max(\dots, 6, 8) = 8$: the collinear 6 and the triangle's 8 both showed up, and the growth function takes the larger.

| $N$ | $m_{\mathcal{H}}(N)$ (2D perceptrons) |
|---|---|
| 1 | 2 |
| 2 | 4 |
| 3 | $\max(\dots, 6, 8) = 8$ |
| 4 | $14 < 2^N$ |

This table has only four values. The handout asks: how to 'calculate' the growth function? In the lecture, Lin admits that writing out the perceptron's growth function in full is rather hard, so the lecture first looks at a few simple hypothesis sets.

### Positive rays: N+1

The setup on page 18:

- The input space is $\mathcal{X} = \mathbb{R}$; the data are points on the number line.
- Each hypothesis is determined by a threshold $a$: $h(x) = \text{sign}(x - a)$. Points greater than $a$ are $+1$ (○), and points less than $a$ are $-1$ (×).

In the lecture, Lin explains the name: it is like a beam of light shot toward the positive direction. The handout notes that it is the 'positive half' of 1D perceptrons; in the lecture, Lin says 1D perceptrons also have the half that points toward the negative direction, which is left out for now. To make the picture easier to draw, number the points from left to right as $x_1 < x_2 < \dots < x_N$. Lin says this ordering is only for looks and does not affect the result.

**How to count.** $N$ distinct points cut the number line into $N + 1$ segments (the handout calls each one a spot): to the left of $x_1$, between each pair of adjacent points, and to the right of $x_N$. While the threshold $a$ moves within one spot, no point switches from one side of $a$ to the other, and the dichotomy does not change; when $a$ moves to another spot, at least one point switches sides, and the dichotomy is different. So

$$
m_{\mathcal{H}}(N) = N + 1
$$

In the lecture, Lin adds that if some points coincide, there are fewer spots and so only fewer dichotomies, which means the maximum occurs when all $N$ points are distinct. The 5 kinds for $N = 4$ (the table on the right of the slide):

| Position of $a$ | $x_1$ | $x_2$ | $x_3$ | $x_4$ |
|---|---|---|---|---|
| Left of $x_1$ | ○ | ○ | ○ | ○ |
| Between $x_1$ and $x_2$ | × | ○ | ○ | ○ |
| Between $x_2$ and $x_3$ | × | × | ○ | ○ |
| Between $x_3$ and $x_4$ | × | × | × | ○ |
| Right of $x_4$ | × | × | × | × |

Only 5 of the 16 patterns can be produced. The ones that cannot all share one feature: a × appears to the right of some ○. The handout's comment is $(N + 1) \ll 2^N$ when $N$ large. In the lecture, Lin says this is good for replacing $M$: when $N$ is large, the exponentially decreasing term in the inequality becomes tiny and overpowers the $N + 1$ term.

### Positive intervals: ½N² + ½N + 1

Page 19 changes the hypotheses to intervals, with the inputs still on the number line: $h(x) = +1$ iff $x \in [\ell, r)$, $-1$ otherwise. Inside the interval is ○, and outside is ×.

**How to count.** There are again $N + 1$ spots. A dichotomy is determined by which spot each of the interval's two ends falls in:

- The two ends fall in two **different** spots: choose 2 of the $N + 1$ spots, $\binom{N+1}{2}$ ways. Each choice encloses a different set of points, so these dichotomies are all distinct, and each has at least one ○.
- The two ends fall in the **same** spot: the interval contains no data point at all, and everything is ×. The result is the same whichever spot it is, so this counts as only 1 kind.

$$
m_{\mathcal{H}}(N) = \underbrace{\binom{N+1}{2}}_{\text{interval ends in } N+1 \text{ spots}} + \underbrace{1}_{\text{all } \times} = \frac{(N+1)N}{2} + 1 = \frac{1}{2}N^2 + \frac{1}{2}N + 1
$$

For $N = 4$ that is $\binom{5}{2} + 1 = 11$ kinds. The table on the right of the slide lists all 11 one by one; below they are regrouped by the number of ○:

| Number of ○ | Dichotomies ($x_1 x_2 x_3 x_4$) | How many |
|---|---|---|
| 1 | ○×××, ×○××, ××○×, ×××○ | 4 |
| 2 | ○○××, ×○○×, ××○○ | 3 |
| 3 | ○○○×, ×○○○ | 2 |
| 4 | ○○○○ | 1 |
| 0 | ×××× | 1 |

An addition in this article, as a way to cross-check: what positive intervals can produce is exactly the patterns in which all the ○ are contiguous. A contiguous run of length $j$ has $N - j + 1$ positions, and summing over $j$ from 1 to $N$ gives $N + (N-1) + \dots + 1 = \frac{N(N+1)}{2}$; add the 1 kind that is all × and you get the same formula as above. An example that cannot be produced is ○×○×: a × sits between two ○.

The handout's comment is again $\ll 2^N$ when $N$ large. With $N = 4$, 11 against 16 does not show much yet; with $N = 20$ it is 211 against 1,048,576. In the lecture, Lin calls this good news for us: the growth function is a polynomial and will eventually be smaller than $2^N$.

### Convex sets: 2 to the power N, and shattering

Page 20 returns to the plane, $\mathcal{X} = \mathbb{R}^2$. Each hypothesis corresponds to a convex region: $h(\mathbf{x}) = +1$ iff $\mathbf{x}$ is in this convex region, $-1$ otherwise. The slide has two pictures, each a blue region on a pink background; in the lecture, Lin says blue stands for ○ and pink for ×. The region on the left looks like a circle whose upper-left corner has been filled out into a right angle, and is labeled convex region in blue. The one on the right is two partly overlapping circles with a dent where they meet, labeled non-convex region; that one does not count. Convex means that the segment joining any two points of the region stays inside the region.

**How to count (page 21).** The growth function takes a maximum, so it is enough to find one most favorable placement. In the lecture, Lin says the growth function has to cope with all sorts of possibilities, and here is a very extreme one: put all $N$ points on the circumference of a big circle. Name any dichotomy you like; the procedure is:

1. Connect the points that should be ○ into a polygon.
2. Extend this polygon outward by a tiny amount, so that those ○ points fall inside it.

The handout's wording is a convex region slightly extended from contour of positive inputs. A polygon whose vertices all lie on a circle is always convex, and the other points are on the circle too, outside this polygon, so if the extension is small enough they will not be enclosed. Lin's examples in the lecture: for 3 ○ draw a triangle, for 4 ○ a quadrilateral. The picture on the slide has 10 points on a circle, 5 marked $+$ and 5 marked $-$; the pentagon with those 5 $+$ points as vertices is shaded blue, with a large $+$ in the center. The picture shows the contour before it is extended outward.

Every dichotomy can be produced, so

$$
m_{\mathcal{H}}(N) = 2^N
$$

Here the handout introduces a term: those $N$ inputs are **shattered** by $\mathcal{H}$. In the lecture, Lin explains the word as smashing something to pieces, and says you can also picture these $N$ points as knocked down by the hypothesis set, with every case producible. The bottom of the page is

$$
m_{\mathcal{H}}(N) = 2^N \quad\Longleftrightarrow\quad \text{exists } N \text{ inputs that can be shattered}
$$

Note that it says "exists". An addition in this article, with an example showing that it does not mean "all": place four points as the triangle plus an interior point used earlier. A convex region that contains the three vertices must contain the interior point, so "three ○ outside, one × inside" cannot be produced, and these four points have only 15 kinds. But the growth function takes the maximum; four points on a circle give 16 kinds, so $m_{\mathcal{H}}(4)$ is still 16.

At this point there are three examples whose complete formula can be worked out, two of them polynomials and one $2^N$. This difference is the subject of the Break point section.

### Cross-checking with a program

An addition in this article: the three 1D hypothesis sets can be enumerated with a dozen or so lines of Python. Take one representative threshold for each spot, and put the resulting dichotomies into a set to count them.

```python
def spots(xs):
    s = sorted(xs)
    return [s[0] - 1] + [(a + b) / 2 for a, b in zip(s, s[1:])] + [s[-1] + 1]

def rays(xs):        # h(x) = sign(x - a)
    return {tuple(x > a for x in xs) for a in spots(xs)}

def intervals(xs):   # h(x) = +1 iff l <= x < r
    return {tuple(l <= x < r for x in xs) for l in spots(xs) for r in spots(xs)}

def stumps(xs):      # positive and negative rays
    return rays(xs) | {tuple(not v for v in d) for d in rays(xs)}

for N in range(1, 7):
    xs = list(range(N))
    print(N, len(rays(xs)), len(intervals(xs)), len(stumps(xs)), 2 ** N)
```

The five output columns are, in order, $N$, positive rays, positive intervals, the decision stump from the Fun Time below, and $2^N$:

| $N$ | rays | intervals | stumps | $2^N$ |
|---|---|---|---|---|
| 1 | 2 | 2 | 2 | 2 |
| 2 | 3 | 4 | 4 | 4 |
| 3 | 4 | 7 | 6 | 8 |
| 4 | 5 | 11 | 8 | 16 |
| 5 | 6 | 16 | 10 | 32 |
| 6 | 7 | 22 | 12 | 64 |

The first two columns agree with $N + 1$ and $\frac{1}{2}N^2 + \frac{1}{2}N + 1$.

### Fun Time: positive plus negative rays

**Question (page 22):** Consider positive and negative rays as $\mathcal{H}$, which is equivalent to the perceptron hypothesis set in 1D. The hypothesis set is often called 'decision stump' to describe the shape of its hypotheses. What is the growth function $m_{\mathcal{H}}(N)$?

1. $N$
2. $N + 1$
3. $2N$
4. $2^N$

**Answer: 3.** The handout's solution: two dichotomies when the threshold is in each of the $N - 1$ 'internal' spots; two dichotomies for the all-○ and all-× cases. To unpack it: a negative ray is $h(x) = -\text{sign}(x - a)$, with ○ to the left of the threshold and × to the right.

- The threshold is in one of the internal spots (between two adjacent points, $N - 1$ spots in all): the positive ray gives "× on the left, ○ on the right" and the negative ray gives "○ on the left, × on the right", two different dichotomies. Subtotal $2(N - 1)$.
- The threshold is in the leftmost spot: the positive ray gives all ○ and the negative ray gives all ×. The threshold is in the rightmost spot: the positive ray gives all × and the negative ray gives all ○. The four outcomes contain only two distinct dichotomies.

$$
m_{\mathcal{H}}(N) = 2(N - 1) + 2 = 2N
$$

Another way to count: positive rays give $N + 1$ kinds, and by symmetry negative rays also give $N + 1$; all ○ and all × are each counted once on both sides, so subtract the 2 duplicates, $2(N+1) - 2 = 2N$. This is the count used in the Fall 2026 [05e extended slides](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/05e_handout.pdf). The stumps column of the program above reads 2, 4, 6, 8, 10, 12.

Option 2, $N + 1$, is the answer for positive rays alone. Option 4, $2^N$, is already wrong at $N = 3$: a decision stump cannot produce ○×○ or ×○×, so there are only 6 kinds. Option 1, $N$, undercounts: at $N = 1$ a single point can plainly be either ○ or ×.

## Break point: where the growth function first falls short of 2 to the power N

```youtube
url: https://www.youtube.com/watch?v=z3TpJRqPzcg
title: Training versus Testing :: Break Point @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–02:12 compares the four growth functions, 02:12–03:56 defines the break point, 03:56–05:59 covers the four break points and the conjecture, 05:59–06:29 is Fun Time, and the summary follows.)

### Polynomial is good, exponential is bad

Page 23 lines up the four growth functions:

| Hypothesis set | $m_{\mathcal{H}}(N)$ |
|---|---|
| positive rays | $N + 1$ |
| positive intervals | $\frac{1}{2}N^2 + \frac{1}{2}N + 1$ |
| convex sets | $2^N$ |
| 2D perceptrons | $< 2^N$ for some $N$ |

For 2D perceptrons, only a few values are known, along with the fact that 16 kinds cannot be produced at $N = 4$. The handout then puts the growth function into the inequality with the question mark:

$$
\mathbb{P}\big[\lvert E_{\text{in}}(g) - E_{\text{out}}(g)\rvert > \epsilon\big] \overset{?}{\le} 2 \cdot m_{\mathcal{H}}(N) \cdot \exp\big(-2\epsilon^2 N\big)
$$

One line of conclusion sits below it: polynomial: good; exponential: bad. Lin's explanation in the lecture is that the last term decreases exponentially in $N$. If $m_{\mathcal{H}}(N)$ is a polynomial, the exponential decrease is faster, and the right-hand side keeps shrinking once $N$ is large enough. If it is $2^N$, as for convex sets, there is exponential growth in front and exponential decrease behind, the product is still governed by an exponential, and even a very large $N$ does not necessarily guarantee that $E_{\text{in}}$ and $E_{\text{out}}$ are close.

The numbers below were computed for this article and are not in the handout. Take $\epsilon = 0.1$ and substitute the three growth functions that have complete formulas into the right-hand side (the inequality still carries its question mark; this only shows how its size changes):

| $N$ | $\exp(-2\epsilon^2 N)$ | positive rays | positive intervals | convex sets |
|---|---|---|---|---|
| 100 | $0.135$ | $27.3$ | $1{,}367$ | about $10^{29.5}$ |
| 500 | $4.5 \times 10^{-5}$ | $0.045$ | $11.4$ | about $10^{146}$ |
| 1,000 | $2.1 \times 10^{-9}$ | $4.1 \times 10^{-6}$ | $0.0021$ | about $10^{293}$ |
| 2,000 | $4.2 \times 10^{-18}$ | $1.7 \times 10^{-14}$ | $1.7 \times 10^{-11}$ | about $10^{585}$ |

Take the cell for positive rays at $N = 500$ as an example: $2 \times 501 \times e^{-10} = 1002 \times 4.54 \times 10^{-5} \approx 0.045$. Both polynomial columns start out larger than 1 (meaningless), but drop quickly toward 0 as $N$ grows. The convex sets column only gets larger, because

$$
2^N \exp\big(-2\epsilon^2 N\big) = \exp\big(N(\ln 2 - 2\epsilon^2)\big)
$$

With $\epsilon = 0.1$ the parenthesis is $0.693 - 0.02 = 0.673 > 0$, so the whole expression grows exponentially with $N$. Making the parenthesis negative requires $2\epsilon^2 > \ln 2$, that is, $\epsilon > 0.589$; a guarantee that tolerates $E_{\text{in}}$ and $E_{\text{out}}$ differing by nearly 60% is of no use. This is the purpose of condition (2) in the earlier wish, "effective($N$) $\ll 2^N$".

So the handout asks at the bottom of the page: for 2D or general perceptrons, $m_{\mathcal{H}}(N)$ polynomial? Lin's version of the question in the lecture: the PLA we had such a good time with last time, is the hypothesis set it uses a good one or a bad one?

### The definition of a break point

Answering that question has to wait for the next lecture. Page 24 first makes a definition. It begins by collecting what is known about 2D perceptrons, and the handout pointedly puts the quantifiers in quotes:

- Three inputs: 'exists' shatter. There **exists** a set of three points (a triangle) that produces all 8 kinds.
- Four inputs: 'for all' no shatter. **Every** placement of four points fails to produce 16 kinds.

The definition: if no $k$ inputs can be shattered by $\mathcal{H}$, call $k$ a **break point** for $\mathcal{H}$. By the definition of the growth function, this is the same as

$$
m_{\mathcal{H}}(k) < 2^k
$$

The reason: $m_{\mathcal{H}}(k)$ is the maximum over all placements, and a maximum below $2^k$ means no placement reaches $2^k$ kinds. The picture on the right of the slide shows four points, ○ at top and bottom and × at left and right, with a big cross drawn over it. It is the pattern that could not be produced in the Effective Number of Lines section.

In the lecture, Lin describes the break point as the first place in the growth function that looks hopeful, the point where a ray of light breaks through. Before it, the growth function is pinned at $2^N$; here it is strictly smaller for the first time.

The handout lists two properties:

**If $k$ is a break point, so are $k+1$, $k+2$, and so on.** Lin gives the reason in the lecture; here it is written out in full. Argue by contradiction: suppose some $k + 1$ points are shattered, so all $2^{k+1}$ patterns can be produced. Cover one of the points and look only at the remaining $k$. Any ○× pattern on these $k$ points is the first $k$ entries of some pattern on the $k + 1$ points, so it can be produced as well, and thus these $k$ points are shattered, contradicting that $k$ is a break point. So if $k$ points cannot do it, $k + 1$ points cannot either, and the same holds all the way up.

**Study only the minimum break point.** Since all the later ones follow automatically, only the first carries information. 2D perceptrons can still shatter at $N = 3$ but not at $N = 4$, so the handout writes: 2D perceptrons: break point at 4.

The quantifier in the definition deserves a second look. With three collinear points, 2D perceptrons have only 6 kinds, yet 3 is not a break point, because a break point requires that "no" three points can be shattered, and a triangle can be.

### Four break points, and a conjecture

Page 25 fills in the break points of the four hypothesis sets. The handout writes only the results; the "check" column in the table below was filled in for this article from the growth functions:

| Hypothesis set | $m_{\mathcal{H}}(N)$ | Minimum break point | Check |
|---|---|---|---|
| positive rays | $N + 1 = O(N)$ | 2 | $m(1) = 2 = 2^1$; $m(2) = 3 < 4$ |
| positive intervals | $\frac{1}{2}N^2 + \frac{1}{2}N + 1 = O(N^2)$ | 3 | $m(2) = 4 = 2^2$; $m(3) = 7 < 8$ |
| convex sets | $2^N$ | none | equals $2^N$ for every $N$ |
| 2D perceptrons | $< 2^N$ for some $N$ | 4 | $m(3) = 8 = 2^3$; $m(4) = 14 < 16$ |

For each break point you can name the pattern that cannot be produced. Positive rays cannot produce "○ on the left, × on the right" on two points. Positive intervals cannot produce ○×○ on three points. 2D perceptrons are missing two kinds on four points. The growth function of convex sets is always $2^N$; in the lecture, Lin says it has no break point, or that its break point is infinitely far away.

Putting the break points next to the degrees of the growth functions, the handout writes down the lecture's final conjecture:

- No break point: $m_{\mathcal{H}}(N) = 2^N$. The handout marks this sure!; it is just the definition restated.
- Break point $k$: $m_{\mathcal{H}}(N) = O(N^{k-1})$.

Check it against the table: positive rays have $k = 2$ and a growth function of $O(N^1)$; positive intervals have $k = 3$ and $O(N^2)$. In the lecture, Lin carries the reasoning on: if this conjecture can be proved, then since the first break point of 2D perceptrons is at 4, their growth function grows at roughly the speed of $N$ cubed, which is a polynomial and lands on the "good" side. The bottom of the page reads: excited? wait for next lecture.

The weight of this conjecture is that it uses only the single fact that $2^k$ kinds cannot be produced at some $k$, and draws a conclusion for every $N$. For this article, $O(N^3)$ was plugged into the earlier table as a trial calculation: with $\epsilon = 0.1$, $2N^3\exp(-2\epsilon^2 N)$ is $4.1$ at $N = 1{,}000$ and $6.8 \times 10^{-8}$ at $N = 2{,}000$. The cubic is somewhat slower than the previous two examples, but the exponential still pushes it down.

An addition in this article: $O(N^{k-1})$ is an upper bound and does not promise exactly that degree. The decision stump in the Fun Time below has break point 3, the conjecture gives $O(N^2)$, and the actual growth function is $2N$.

### Fun Time: the break point of the decision stump

**Question (page 26):** Consider again the positive and negative rays (the 1D perceptron) from the earlier question, whose growth function is known to be $m_{\mathcal{H}}(N) = 2N$. What is the minimum break point for $\mathcal{H}$?

1. 1
2. 2
3. 3
4. 4

**Answer: 3.** The handout's solution is that at $k = 3$, $m_{\mathcal{H}}(k) = 6$ while $2^k = 8$. Comparing one by one from small $k$:

| $k$ | $m_{\mathcal{H}}(k) = 2k$ | $2^k$ | Is it a break point? |
|---|---|---|---|
| 1 | 2 | 2 | No |
| 2 | 4 | 4 | No |
| 3 | 6 | 8 | Yes |
| 4 | 8 | 16 | Yes, but not the minimum |

At $k = 2$ all four patterns ○○, ××, ×○, ○× can be produced (the last two with a positive ray and a negative ray respectively), so 2 is not one. At $k = 3$, ○×○ and ×○× are missing: the middle point differs from both ends, which a single threshold cannot do. The 4 in option 4 is also a break point, but the question asks for the minimum.

Compare this with positive rays: the only added flexibility is being allowed to point the other way, and the break point moves from 2 to 3.

### Summary of this lecture

Page 27 reduces each of the four sections to one line:

- Recap and Preview: two questions, $E_{\text{out}}(g) \approx E_{\text{in}}(g)$ and $E_{\text{in}}(g) \approx 0$.
- Effective Number of Lines: at most 14 through the eye of 4 inputs.
- Effective Number of Hypotheses: at most $m_{\mathcal{H}}(N)$ through the eye of $N$ inputs.
- Break Point: when $m_{\mathcal{H}}(N)$ becomes "non-exponential".

The preview of the next lecture is $m_{\mathcal{H}}(N) = \text{poly}(N)$? Lin closes the lecture this way: with the ray of light that the break point provides, next time we will see whether it can really be proved that the growth function grows at about the speed of a polynomial.

Two things are still unfinished when this lecture ends, and both are left to [Foundations Lecture 6: Theory of Generalization](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-06-theory-of-generalization-en): one is the conjecture itself, and the other is the question mark on the inequality, that is, whether $m_{\mathcal{H}}(N)$ can replace $M$ directly at all.

## Walking through the whole lecture with one threshold classifier

This section is an example made up for this article, not from the slides, and its numbers were computed with Python. The aim is to put the concepts from the four sections into a single scenario.

**The scenario.** The input $x$ is a score between 0 and 1, uniformly distributed on $[0, 1]$. The true rule is $f(x) = \text{sign}(x - 0.5)$. The hypothesis set is positive rays, $h_a(x) = \text{sign}(x - a)$, where the threshold $a$ can be any real number in $[0, 1]$, so $M = \infty$. $h_a$ and $f$ disagree only between $a$ and $0.5$, and the length of that stretch is the probability that $h_a$ is wrong:

$$
E_{\text{out}}(h_a) = \lvert a - 0.5\rvert
$$

**The two central questions.** Question 2 is easy here: $f$ itself is in $\mathcal{H}$ ($a = 0.5$), so a threshold with $E_{\text{in}} = 0$ can always be found. The hard one is question 1: with infinitely many thresholds, the right-hand side of the previous lecture's inequality is infinite.

**How much two nearby thresholds overlap.** Take $a = 0.30$ and $a = 0.31$. Their $E_{\text{out}}$ values are $0.20$ and $0.19$, very close. Their $E_{\text{in}}$ values differ only when some data point lands in $[0.30, 0.31)$; the probability that none of $N = 20$ data points lands in this small stretch is $0.99^{20} \approx 0.818$. In other words, on more than 80% of datasets the two thresholds have exactly the same $E_{\text{in}}$, which is the statement on page 8 of the handout: for most $\mathcal{D}$, $E_{\text{in}}(h_1) = E_{\text{in}}(h_2)$.

Now compute the BAD events. Take $\epsilon = 0.1$. The $E_{\text{in}}$ of $h_{0.30}$ is the number of data points landing in $[0.30, 0.50)$ divided by 20, and this count follows a binomial distribution with 20 trials and probability $0.2$ each; $\lvert E_{\text{in}} - 0.20\rvert > 0.1$ happens when the count is at most 1 or at least 7. $h_{0.31}$ looks at the count landing in $[0.31, 0.50)$ and compares against $0.19$; the bad event happens when the count is at most 1 or at least 6. Computing the joint distribution of the two with Python:

| Quantity | Value |
|---|---|
| $\mathbb{P}[\mathcal{B}_{0.30}]$ | $0.156$ |
| $\mathbb{P}[\mathcal{B}_{0.31}]$ | $0.248$ |
| Union bound: the sum of the two | $0.404$ |
| The actual $\mathbb{P}[\mathcal{B}_{0.30} \text{ or } \mathcal{B}_{0.31}]$ | $0.251$ |
| Probability that both happen together | $0.153$ |

$\mathcal{B}_{0.30}$ lies almost entirely inside $\mathcal{B}_{0.31}$, and the sum is about 60% more than the actual value. This is with only two hypotheses; between $0.30$ and $0.31$ there are infinitely many more thresholds, each overlapping heavily with these two, and the union bound counts every one of them separately.

**Viewed from the data, there are only N+1 kinds.** Suppose the sample is $N = 4$ data points: $0.15$, $0.42$, $0.58$, $0.83$, whose labels under $f$ are ×, ×, ○, ○. On these four points the infinitely many thresholds give only 5 dichotomies:

| Range of $a$ | Dichotomy | $E_{\text{in}}(h_a)$ | Range of $E_{\text{out}}(h_a)$ |
|---|---|---|---|
| $a < 0.15$ | ○○○○ | $0.5$ | $0.35$ to $0.5$ |
| $0.15 < a < 0.42$ | ×○○○ | $0.25$ | $0.08$ to $0.35$ |
| $0.42 < a < 0.58$ | ××○○ | $0$ | $0$ to $0.08$ |
| $0.58 < a < 0.83$ | ×××○ | $0.25$ | $0.08$ to $0.33$ |
| $a > 0.83$ | ×××× | $0.5$ | $0.33$ to $0.5$ |

Each row contains infinitely many thresholds with the same $E_{\text{in}}$, and the algorithm cannot tell them apart from the data. The growth function counts the number of rows: $m_{\mathcal{H}}(4) = 5$. But $E_{\text{out}}$ is not the same within a row. $E_{\text{in}}$ depends only on the dichotomy, while $E_{\text{out}}$ depends on the whole hypothesis. This is a small addition in this article to the handout's question mark: replacing $M$ with $m_{\mathcal{H}}(N)$ is not something that can be written down in one step, and the $E_{\text{out}}$ side is exactly what the next lecture has to deal with.

**With infinitely many thresholds, what the bad probability really is.** Use simulation to estimate directly the probability that "there exists some threshold $a$ with $\lvert E_{\text{in}}(h_a) - E_{\text{out}}(h_a)\rvert > 0.1$". For each dataset only the endpoints of each spot need checking: within one spot $E_{\text{in}}$ does not change, and $E_{\text{out}} = \lvert a - 0.5\rvert$ is a linear function of $a$ on any spot that does not contain $0.5$, so the largest difference occurs at an endpoint; on the spot that contains $0.5$, $E_{\text{in}} = 0$ and the difference is $\lvert a - 0.5\rvert$, again largest at an endpoint. Results with a fixed random seed:

| $N$ | Probability estimated by simulation | Single hypothesis, $2\exp(-2\epsilon^2 N)$ | $2M\exp(\dots)$, $M = \infty$ | $2(N+1)\exp(-2\epsilon^2 N)$ |
|---|---|---|---|---|
| 100 | about $0.25$ (4,000 runs) | $0.27$ | $\infty$ | $27.3$ |
| 200 | about $0.03$ (4,000 runs) | $0.037$ | $\infty$ | $7.4$ |
| 500 | 0 out of 1,000 runs | $9.1 \times 10^{-5}$ | $\infty$ | $0.045$ |

**What this result means.** There are infinitely many hypotheses, yet the true bad probability is finite and shrinks quickly as $N$ grows; the infinity that the union bound gives only reflects how crude the count is. The rightmost column is the question-marked formula with $M$ replaced by the growth function. It is loose when $N$ is small (larger than 1), and by $N = 500$ it gives a number below 5%. This column cannot yet be used as a theorem; the simulation only lets you see that the direction is reasonable.

## Self-check

**1. Your boss changes the requirements to $\epsilon = 0.05$ and $\delta = 0.01$, and there are $M = 1{,}000$ hypotheses. How many data points are needed at least?**

Answer: $N \ge \frac{1}{2 \times 0.0025}\ln\frac{2000}{0.01} = 200 \times \ln 200{,}000 \approx 200 \times 12.206 = 2441.2$, so 2,442. Halving $\epsilon$ multiplies the leading coefficient by 4, a far larger effect than that of $M$ or $\delta$.

**2. Five points on the number line: $1.2$, $3.4$, $5.0$, $7.7$, $9.1$. How many dichotomies can positive rays, positive intervals, and the decision stump each produce? Give one that positive intervals can produce and the decision stump cannot. Is there one the other way around?**

Answer: $5 + 1 = 6$, $\binom{6}{2} + 1 = 16$, $2 \times 5 = 10$. The actual positions of the points do not affect the answer, as long as all five are distinct. There are 6 that positive intervals can produce and the decision stump cannot, all with a run of ○ that touches neither end, for example ×○○××. There is none the other way around: every dichotomy of the decision stump is either "the ○ are contiguous and touch one end" or all ×, and positive intervals can produce all of them.

**3. Four points in the plane: $(0,0)$, $(1,0)$, $(2,0)$, $(1,2)$, the first three collinear. How many dichotomies can 2D perceptrons produce on these four points? Does this change $m_{\mathcal{H}}(4)$?**

Answer: 12. The three collinear points cannot produce the "middle differs from both ends" patterns ○×○ and ×○×, and whatever label the fourth point gets does not rescue them, so $2 \times 2 = 4$ patterns are missing and $16 - 4 = 12$. For this article this was checked with linear programming, and the missing ones are exactly these 4. $m_{\mathcal{H}}(4)$ does not change; it is still 14, because the growth function takes the maximum over all placements.

**4. With three collinear points, 2D perceptrons have only 6 dichotomies, fewer than $2^3 = 8$. Why is 3 not their break point?**

Grading criterion: the answer must state that the definition of a break point is "no $k$ inputs can be shattered", which is the same as $m_{\mathcal{H}}(k) < 2^k$; and that $m_{\mathcal{H}}(3)$, taking the maximum, is 8, since three points arranged in a triangle can be shattered. Saying only "because some placements give 8 kinds" without connecting it to the quantifier in the definition is not complete.

**5. A new hypothesis set: "positive intervals plus negative intervals" on the number line, that is, the inside of the interval can be ○ with the outside ×, or the other way around. How many dichotomies are there at $N = 3$ and at $N = 4$? What is the minimum break point?**

Answer: 8 at $N = 3$: the 7 from positive intervals plus ○×○, which could not be produced before (use a negative interval to enclose the middle point). 14 at $N = 4$: the 11 positive ones and their 11 flipped versions, of which the $2N = 8$ that the decision stump can produce appear on both sides, so $22 - 8 = 14$. The ones that cannot be produced are ○×○× and ×○×○, which need three cuts. $m(3) = 8 = 2^3$ and $m(4) = 14 < 16$, so the minimum break point is 4. By the same count, the general formula is $2\big(\frac{1}{2}N^2 + \frac{1}{2}N + 1\big) - 2N = N^2 - N + 2$.

## Exercises and corresponding reading

**How the two semesters line up.** The [Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) lists this lecture's four videos as "required watching (before class)", while the next lecture's four are listed under "suggested watching (anytime)" for W4 (09/30). Fall 2026 also adds a 3-page set of [05e extended slides](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/05e_handout.pdf) for this lecture, with two more growth function examples: one is the $2N$ of the decision stump (the Fun Time question), and the other is 2D perceptrons through the origin, whose growth function is also $2N$, obtained by normalizing the points onto the unit half-circle and then sweeping the angle to reduce the problem to a decision stump.

**Textbook.** According to the [Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/), this lecture corresponds to sections 2.0 and 2.1.1 of [Learning from Data](http://amlbook.com) (LFD). [Caltech Learning from Data](https://work.caltech.edu/telecourse) uses the same textbook, and its Lecture 5 is also called Training versus Testing, so it works as an English-language counterpart.

**Homework.** [Fall 2024 HW2](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw2/hw2_red.pdf) was released on 2024-09-23 and due on 10-07, with a full score of 200 points plus 20 bonus points; its problems cover Lectures 4 through 7, and there are no official solutions. The ones you can start on with this lecture's tools are:

- **Q1**: the growth function, for $N \ge 4$, of 2D perceptrons whose slope is only allowed to be 1 or −1.
- **Q3**: the growth function of 2D perceptrons that must pass through the point $(11, 26)$. You may want to read the 05e page that reduces perceptrons through the origin to a decision stump first.
- **Q10–12**: the decision stump. Q10 proves that $E_{\text{out}}(h_{s,\theta}) = u + v \cdot \lvert\theta\rvert$ under the specified noisy data distribution; Q11 implements the 1D decision stump algorithm, repeats it 2,000 times with $N = 12$ and 15% noise, and draws a scatter plot of $(E_{\text{in}}, E_{\text{out}})$; Q12 switches to picking a hypothesis at random and compares again. The data for Q11 and Q12 are generated by your own program. Put the two plots side by side to see how much $E_{\text{out}} - E_{\text{in}}$ differs between "pick the hypothesis with the smallest $E_{\text{in}}$" and "pick one at random"; the formula derived in Q10 can be used to check the simulation results.

Q4 and the bonus Q13 need the VC dimension from [Foundations Lecture 7: The VC Dimension](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error-en), and Q2, Q6, and Q7 are multi-bin sampling problems from the previous lecture. According to the course page's schedule, the Fall 2026 hw2 is announced on 10/07, and it was not yet public when checked on 2026-09-30. The guide to the homework as a whole is in [Foundations Homework](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide-en). The videos and handouts are all free and public; the homework PDFs are public too, but there are no official solutions, and grading is for enrolled students only.

**Hands-on.** Take a sheet of paper, draw 4 points, and find by hand the two patterns that 2D perceptrons cannot cut out; then move three of the points onto a line and count how many kinds remain. This is the most concrete picture in these few theory lectures.

**Further reading.** [Stanford CS229 Lecture 6: Bias and Variance, Regularization, and Model Selection](/posts/ai/2026-10-12-stanford-cs229-lecture-06-bias-variance-regularization-en) discusses the gap between training and testing along a different route and makes a useful comparison.

**Next lecture.** [Foundations Lecture 6: Theory of Generalization](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-06-theory-of-generalization-en) proves this lecture's conjecture: as long as there is a break point, the growth function is bounded by a polynomial; and it removes the question mark from the inequality.

## Course video sources

Original videos: [Recap and Preview](https://www.youtube.com/watch?v=4aIAxH8eBMs), [Effective Number of Lines](https://www.youtube.com/watch?v=oAW0_j8_l3Y), [Effective Number of Hypotheses](https://www.youtube.com/watch?v=dnVofdAomWY), [Break Point](https://www.youtube.com/watch?v=z3TpJRqPzcg)

- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [Official course and recordings portal](https://www.csie.ntu.edu.tw/~htlin/mooc/)

Checked: 2026-10-13. The video IDs, titles, and lengths were taken from the official playlist on that day; the videos have no caption track on YouTube, and what this article reports from the lecture comes from transcripts made for it.

## Update Log

- 2026-10-10: Marked the video status and checked the recording sources and how to access them.
- 2026-10-10: Re-checked the video status. Replaced the embedded Caltech lecture (a different course) with Hsuan-Tien Lin's own "Effective Number of Lines"; the Caltech video stays as a text link.
- 2026-10-13: Previously combined with Lecture 6 in one article; changed to one article per lecture and rewritten from the handout and the video transcripts.

## References

- [Foundations Lecture 5 handout, 05_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/05_handout.pdf): the main source for this article. The definitions in the four sections, the four growth functions, the break point, and the four Fun Time questions all come from this handout.
- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf): the IDs and titles of the four videos; what the text reports as said "in the lecture" comes from machine transcripts of these four videos.
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/): the official portal for handouts and recordings.
- [Fall 2026 05e extended slides](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/doc/05e_handout.pdf): the other way of counting the decision stump's growth function, and the example of 2D perceptrons through the origin.
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/): the before-class viewing arrangement for this lecture's videos and the hw2 schedule.
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/): the corresponding LFD sections.
- [Fall 2024 Homework 2 (hw2_red.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw2/hw2_red.pdf): the content of Q1, Q3, and Q10–12.
- [Learning from Data textbook site](http://amlbook.com): the source for sections 2.0 and 2.1.1.
- [Caltech Learning from Data telecourse](https://work.caltech.edu/telecourse): the English-language course using the same textbook; its Lecture 5 has the same name.
- [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques: Course Overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en): where this lecture sits in the whole course, and the reading routes.
