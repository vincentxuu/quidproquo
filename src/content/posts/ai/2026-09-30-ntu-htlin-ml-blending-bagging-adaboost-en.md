---
title: "Blending and Bagging: Why Combining Hypotheses Works Better | NTU Hsuan-Tien Lin Machine Learning Techniques Lecture 7"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, ensemble, bagging]
lang: en
math: true
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 24
tldr: "With T hypotheses gₜ in hand, you can do more than pick one by validation: give each one vote (uniform blending), learn a set of ballot counts (linear blending), or learn another model that combines them (the form the handout calls any blending, also named stacking). This lecture proves in six lines of algebra that, under squared error, the averaged G is never worse than the average performance of the gₜ, and the gap is exactly how spread out the gₜ are, which is the variance. Finally, bootstrapping re-samples T data sets from the one data set you have, trains one gₜ on each, and lets them vote; that is bagging."
description: "A guide to Lecture 7 of NTU Hsuan-Tien Lin's Machine Learning Techniques, Blending and Bagging: the four forms of aggregation, the bias–variance decomposition derived from uniform blending, the practical steps of linear and any blending, the KDD Cup 2011 numbers, bootstrapping and bagging, with all four Fun Time questions and the made-up numerical examples worked through and checked."
draft: false
glossary:
  - term: "blending"
    aliases: ["stacking"]
    definition: "Deciding how to combine g₁…g_T after they are already in hand: one vote each (uniform), a learned set of linear weights (linear), or an arbitrary model learned on the outputs of the gₜ as features (the form called any blending, also named stacking)."
    context: "Techniques Lecture 7 separates blending from aggregation learning, which combines the gₜ while learning them."
  - term: "bagging"
    aliases: ["bootstrap aggregation"]
    definition: "Draw several bootstrap data sets from the original data by sampling with replacement, train one gₜ on each, and give every gₜ one vote. It is a meta algorithm wrapped around whichever base algorithm you choose."
    context: "The conclusion of Techniques Lecture 7: the more sensitive the base algorithm is to the randomness of the data, the better bagging works."
  - term: "bootstrap"
    aliases: ["bootstrapping"]
    definition: "A statistical re-sampling tool: draw N examples uniformly with replacement from the N examples in hand (drawing N′ is also allowed) to simulate getting a fresh data set."
    context: "Techniques Lecture 7 uses it to replace the virtual process in the bias–variance analysis, which needs infinitely many fresh data sets."
  - term: "bias–variance decomposition"
    aliases: ["bias-variance decomposition"]
    definition: "Under squared error, the expected performance of an algorithm equals the expected deviation of each gₜ from the consensus ḡ (variance) plus the performance of the consensus ḡ itself (bias)."
    context: "Techniques Lecture 7 gets it by letting T go to infinity in the algebraic identity for uniform blending; what uniform blending removes is the variance term."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-htlin-ml-blending-bagging-adaboost)

**Video status: Videos included.** This article is written from the official MOOC handout [207_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/207_handout.pdf) and transcripts of the four official videos, with formulas following the handout. The transcripts are machine transcripts made for this article (Whisper), not official captions, and no human has proofread them. The videos are taught in Mandarin; the slides are in English. Each section opens with its official video and the approximate time ranges. Page numbers refer to the number at the lower right of each slide (0/23 to 23/23), and wherever the text says "in the lecture" it is paraphrasing what is said in the video.

This is Techniques Lecture 7 in [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en). The Roadmap on page 1 of the handout divides Techniques into three ways of handling features. The first six lectures all belong to the first, Embedding Numerous Features: Kernel Models, which wraps up with the previous lecture, [Techniques Lecture 6: Support Vector Regression](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-06-support-vector-regression-en). This lecture starts the second: Combining Predictive Features: Aggregation Models. The question changes. You already have several hypotheses, each with some predictive power; how do you combine them into something better than any one of them alone? In the lecture, Lin says this family takes five lectures, each introducing a few different approaches, and this is the first.

The prerequisites are the $E_{\text{val}}$ and $g^-$ notation from [Foundations Lecture 15: Validation](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles-en), the squared error from [Foundations Lecture 9: Linear Regression](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression-en), the "transform first, then run a linear model" flow from [Foundations Lecture 12: Nonlinear Transformation](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-12-nonlinear-transformation-en), and basic manipulation of expectations. After reading, you should be able to re-derive the error decomposition of uniform blending on your own and say which term is the bias and which is the variance; carry out linear blending and any blending step by step and explain why the ballots have to be learned on validation data; and write down the bagging procedure and work out what a bootstrap data set looks like.

## Why combine hypotheses: from picking one friend to letting everyone vote

```youtube
url: https://www.youtube.com/watch?v=mjUKsp0MvMI
title: Blending and Bagging :: Motivation of Aggregation @ Machine Learning Techniques (機器學習技法)
```

(Video 00:17–02:03 reviews the previous lecture and previews the topic, 02:03–05:18 is the story of friends tipping stocks, 05:18–10:34 writes the four approaches as formulas, 10:34–12:59 covers the limits of selection, 12:59–17:49 covers the two illustrations, followed by Fun Time.)

### Four ways to use your friends

The story on page 2 of the handout goes like this. You have $T$ friends $g_1, \dots, g_T$, each of whom predicts whether a certain stock will go up or down tomorrow; friend $t$'s prediction is written $g_t(\mathbf{x})$. In the lecture, Lin simply assumes 15 friends, some saying up and some saying down. Having heard them, you can:

1. **Select the most trustworthy one and listen only to that friend.** You choose by each person's usual performance. The handout marks this with "validation": it is the model selection of Foundations Lecture 15.
2. **Give everyone one vote.** If the majority says up, call it up.
3. **Vote, but with unequal ballots.** The more trustworthy friends get a few more ballots.
4. **Decide whom to listen to depending on the situation.** The handout's wording is: if "$t$ satisfies some condition", give some ballots to friend $t$. The example in the lecture is that some friends are good at technology stocks and others at traditional industries; for a technology stock you consult friends A, B, and C, and for a traditional-industry stock you switch to A and D.

The handout calls all of these aggregation models: mix or combine hypotheses, for better performance.

### The four approaches as formulas

Page 3 writes each of the four as one line. Up is $+1$, down is $-1$, and the final result is the capital $G$.

**Select one (select):**

$$
G(\mathbf{x}) = g_{t_*}(\mathbf{x}), \qquad t_* = \underset{t \in \{1, 2, \dots, T\}}{\operatorname{argmin}}\ E_{\text{val}}(g_t^-)
$$

$g_t^-$ is the version learned from the training data only (without the validation data), and its validation error is what you select by. Once $t_*$ is chosen, what you return is $g_{t_*}$ learned from all the data; this is the procedure from Foundations Lecture 15.

**One vote each (uniform):**

$$
G(\mathbf{x}) = \operatorname{sign}\Big(\sum_{t=1}^{T} 1 \cdot g_t(\mathbf{x})\Big)
$$

Add up everyone's $\pm 1$ and look at whether the sum is positive or negative.

**Unequal ballots (non-uniform):**

$$
G(\mathbf{x}) = \operatorname{sign}\Big(\sum_{t=1}^{T} \alpha_t \cdot g_t(\mathbf{x})\Big), \qquad \alpha_t \ge 0
$$

$\alpha_t$ is the number of ballots friend $t$ gets. In the lecture, Lin says the number of ballots of course cannot be negative, but it can be 0, meaning this person's vote is not needed at all.

**Conditional (conditional):**

$$
G(\mathbf{x}) = \operatorname{sign}\Big(\sum_{t=1}^{T} q_t(\mathbf{x}) \cdot g_t(\mathbf{x})\Big), \qquad q_t(\mathbf{x}) \ge 0
$$

The ballot count changes from a fixed number into a function of $\mathbf{x}$. The explanation in the lecture: if the input records which kind of stock this is, $q_t(\mathbf{x})$ can use that information to decide whether to ask friend $t$ and how many ballots to give.

The four forms are nested one inside the next. The handout uses $\llbracket \cdot \rrbracket$ for "1 when the condition holds, 0 when it does not":

| The larger form | The setting that reduces it to the smaller form |
|---|---|
| non-uniform | $\alpha_t = \llbracket E_{\text{val}}(g_t^-) \text{ smallest} \rrbracket$: only the one with the smallest validation error gets 1 ballot and everyone else gets 0, which is select |
| non-uniform | $\alpha_t = 1$: this is uniform |
| conditional | $q_t(\mathbf{x}) = \alpha_t$: the same ballots under every condition, which is non-uniform |

So conditional contains everything before it. The handout's summary is "aggregation models: a rich family".

### The limits of selecting just one

Page 4 looks back at selection. It is simple and popular, but two things are worth remembering:

- If you select with $E_{\text{in}}(g_t)$ instead of $E_{\text{val}}(g_t^-)$, you pay a complexity price on $d_{\text{VC}}$. Foundations Lecture 15 covered this, and it is used once more in this lecture when linear blending comes up.
- For selection to succeed, the candidates must include one strong $g_t^-$, which guarantees a small $E_{\text{val}}$ and in turn a small $E_{\text{out}}$. In the lecture, Lin puts it bluntly: if every $g_t^-$ is weak, then however you select, you are only picking one out of a bad bunch.

The handout sets the two side by side in two sentences. Selection relies on one strong hypothesis, which the lecture calls strongman leadership. Aggregation asks: with many (possibly weaker) hypotheses in hand, can we do better by combining them?

### Two pictures: combining can make things stronger, and also steadier

Page 5 uses two pictures to answer "why might aggregation work?" Both show circles (positive examples) and crosses (negative examples) on a two-dimensional plane.

**Left picture: weak ones combine into a strong one.** The rule is that only horizontal or vertical lines may be used to classify. In this data set the circles sit at the upper right and the crosses at the lower left, so it looks as though at least a slanted line is needed to separate them, and no single horizontal or vertical line does well. The picture draws one horizontal line and two vertical lines, none of them perfect on its own. After the three get one vote each, the resulting boundary is a staircase-shaped polyline that goes down, right, and down again, separating the circles and crosses completely. The handout's note is: mix different weak hypotheses uniformly and $G(\mathbf{x})$ becomes "strong", an effect like a feature transform.

**Right picture: many lines that are all correct combine into the one in the middle.** This data set is linearly separable, and infinitely many lines separate it perfectly. When PLA runs with randomness it may stop at any one of them, and the picture draws a bundle of gray lines. Let these gray lines vote and the result is the black line in the middle. The explanation in the lecture: the gray lines are spread across all the feasible lines, so the vote lands near the moderate one and does not hug any particular circle or cross; and the moderate line is roughly the line with the fatter boundary, so the effect resembles the large margin of SVM, that is, regularization. The handout's note is that $G(\mathbf{x})$ becomes "moderate".

In the lecture, Lin points out that these two things pull in opposite directions in Foundations: a feature transform is like stepping on the accelerator, giving the model more power, and regularization is like stepping on the brake, keeping the model from being so powerful. The same act of letting hypotheses vote can produce either effect. Doing aggregation right is like having both the accelerator and the brake under control. The conclusion on this page of the handout is "proper aggregation ⟹ better performance", and both effects carry a question mark; this article's reading is that the two pictures give intuition, not yet a proof. One effect addresses a model that lacks power and the other addresses overfitting, and both show up once more when the last aggregation lecture, [Techniques Lecture 11: Gradient Boosted Decision Trees](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-11-gradient-boosted-decision-tree-en), sums everything up.

### Fun Time: three decision stumps vote

**Question (page 6):** Consider three decision stump hypotheses from $\mathbb{R}$ to $\{-1, +1\}$: $g_1(x) = \operatorname{sign}(1 - x)$, $g_2(x) = \operatorname{sign}(1 + x)$, $g_3(x) = -1$. When mixing the three hypotheses uniformly, what is the resulting $G(x)$?

1. $2\llbracket \lvert x \rvert \le 1 \rrbracket - 1$
2. $2\llbracket \lvert x \rvert \ge 1 \rrbracket - 1$
3. $2\llbracket x \le -1 \rrbracket - 1$
4. $2\llbracket x \ge +1 \rrbracket - 1$

First, read the notation in the choices: when $\llbracket \cdot \rrbracket$ holds it is 1 and $2 \times 1 - 1 = +1$; when it does not hold it is 0 and $2 \times 0 - 1 = -1$. So choice 1 means "output $+1$ when $\lvert x \rvert \le 1$ and $-1$ everywhere else". A decision stump is a classifier that looks at one dimension and makes one cut; $g_1$ cuts at $x = 1$, $g_2$ cuts at $x = -1$, and $g_3$ is the constant that says $-1$ whatever the input.

**Answer: 1.** Split the number line into three segments and count the votes on each:

| Region | $g_1$ | $g_2$ | $g_3$ | Vote total | $G$ |
|---|---|---|---|---|---|
| $x < -1$ | $+1$ | $-1$ | $-1$ | $-1$ | $-1$ |
| $-1 < x < 1$ | $+1$ | $+1$ | $-1$ | $+1$ | $+1$ |
| $x > 1$ | $-1$ | $+1$ | $-1$ | $-1$ | $-1$ |

Only the middle segment gets the two positive votes from $g_1$ and $g_2$ at once, beating the single negative vote from $g_3$. Choice 2 swaps inside and outside. Choices 3 and 4 each have only one cut point, but the result of the vote has two.

An addition in this article: at exactly the two points $x = \pm 1$, one of the stumps evaluates $\operatorname{sign}(0)$. Taking $\operatorname{sign}(0)$ as $+1$ makes these two points $+1$ as well, which is what it takes to match the "$\le$" in choice 1 exactly.

The handout's answer adds one sentence: the three decision stumps can be aggregated to form a more sophisticated hypothesis. Each stump can only cut the number line into a left side and a right side, yet $G$ carves out "a segment in the middle". In the lecture, Lin says this is a bit like the left picture on page 5: combining a bunch of simple hypotheses makes something more complex.

## Why one vote each works: uniform blending and the error decomposition

```youtube
url: https://www.youtube.com/watch?v=DAFkKJYTMW4
title: Blending and Bagging :: Uniform Blending @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–04:17 is voting for classification, 04:17–06:46 is averaging for regression, 06:46–15:24 derives the error decomposition, 15:24–19:54 is the virtual process and bias–variance, followed by Fun Time.)

### The word blending, and voting for classification

The lecture starts with the terminology. Blending is what a blender does: throw a bunch of hypotheses in and turn them into one glass of mixed juice. The word is used when the $g_t$ are already in hand; say you lead a team of three, each member hands you a $g$, and the only question left is how to combine them. When every $g_t$ has equal standing and one vote, it is called uniform blending.

The formula for binary classification (page 7) is the line from before:

$$
G(\mathbf{x}) = \operatorname{sign}\Big(\sum_{t=1}^{T} 1 \cdot g_t(\mathbf{x})\Big)
$$

The handout lists two extreme cases:

- **All $g_t$ are the same** (the handout jokingly calls this autocracy): the vote gives that one $g_t$, with no benefit at all.
- **The $g_t$ are very different** (diversity plus democracy): the majority can correct the minority.

The picture on the right of page 7 is the actual voting result for the left picture of page 5. The explanation in the lecture: one horizontal line and two vertical lines cut the plane into six pieces; in each piece the three lines each give an answer and you take the side with two votes. The whole upper-right area comes out as circles and the whole lower-left area as crosses, and the staircase boundary is what this vote counting produces. "The minority yields to the majority" can correct mistakes, and the assumption behind it is that the minority side is the one more likely to be wrong.

Multiclass classification can vote too, except that instead of adding and subtracting you count how many votes each class gets and pick the highest:

$$
G(\mathbf{x}) = \underset{1 \le k \le K}{\operatorname{argmax}} \sum_{t=1}^{T} \llbracket g_t(\mathbf{x}) = k \rrbracket
$$

An example from this article: five hypotheses say classes 2, 1, 2, 3, 2 for the same $\mathbf{x}$; class 2 gets three votes, so $G(\mathbf{x}) = 2$.

### Regression: average the outputs

Regression outputs are real numbers, and the approach on page 8 is to average:

$$
G(\mathbf{x}) = \frac{1}{T}\sum_{t=1}^{T} g_t(\mathbf{x})
$$

Why divide by $T$? The example in the lecture: the correct answer is 2, ten people all predict something near 2, and adding them directly gives 20. To give one vote each and still land in the same range, you have to divide by the head count.

The two extreme cases are the same as in classification. When the $g_t$ are all the same, the average is still that one hypothesis. When the $g_t$ differ, the handout writes: some $g_t(\mathbf{x}) > f(\mathbf{x})$, some $g_t(\mathbf{x}) < f(\mathbf{x})$, and the average "could be" more accurate than the individual ones. Overestimates and underestimates cancel in part.

The handout wraps the two pages into one sentence: with diverse hypotheses, even simple uniform blending can be better than any single hypothesis. The "can be" in that sentence is turned into a definite inequality next, with a short piece of algebra.

### Derivation: average error equals spread plus the error of G

What page 9 proves is that the average squared error of the $g_t$ and the squared error of $G$ differ by exactly one term, "how spread out the $g_t$ are".

First, the notation. In the lecture, Lin says dragging $(\mathbf{x})$ behind every function is too much trouble, so fix one $\mathbf{x}$ and abbreviate $g_t(\mathbf{x})$, $f(\mathbf{x})$, $G(\mathbf{x})$ to $g_t$, $f$, $G$; all three are just numbers. Also let $\operatorname{avg}$ mean "sum over $t = 1, \dots, T$ and divide by $T$", so $G = \operatorname{avg}(g_t)$. Lin remarks that writing avg is friendlier than the summation sign.

This $\operatorname{avg}$ has two properties, and the whole derivation rests on just these two: it is linear (sums can be split and constants pulled out), and the average of a quantity that does not depend on $t$ is that quantity itself. Neither $f$ nor $G$ depends on $t$.

$$
\begin{aligned}
\operatorname{avg}\big((g_t - f)^2\big) &= \operatorname{avg}\big(g_t^2 - 2g_t f + f^2\big) \\
&= \operatorname{avg}\big(g_t^2\big) - 2Gf + f^2 \\
&= \operatorname{avg}\big(g_t^2\big) - G^2 + (G - f)^2 \\
&= \operatorname{avg}\big(g_t^2\big) - 2G^2 + G^2 + (G - f)^2 \\
&= \operatorname{avg}\big(g_t^2 - 2g_t G + G^2\big) + (G - f)^2 \\
&= \operatorname{avg}\big((g_t - G)^2\big) + (G - f)^2
\end{aligned}
$$

What each line does:

1. **Expand the square.**
2. **Split the average over the three terms.** The first term stays. The middle term is $\operatorname{avg}(2g_t f) = 2f \operatorname{avg}(g_t) = 2Gf$, because $f$ is a constant and $\operatorname{avg}(g_t)$ is $G$. The last term is $\operatorname{avg}(f^2) = f^2$.
3. **Complete $(G - f)^2$.** The target contains the error of $G$, $(G - f)^2 = G^2 - 2Gf + f^2$; we have $-2Gf + f^2$ and are short one $G^2$. In the lecture, Lin describes this as borrowing a $G^2$ and then paying it back, which leaves an extra $-G^2$.
4. **Write $-G^2$ as $-2G^2 + G^2$.** Lin calls this a magic trick; the purpose is to let the first half form a square as well.
5. **Put $G$ back inside the average.** $2G^2 = 2G \cdot \operatorname{avg}(g_t) = \operatorname{avg}(2g_t G)$, which turns one of the $G$'s back into "the average of the $g_t$"; and $G^2 = \operatorname{avg}(G^2)$, because $G$ does not depend on $t$.
6. **Recognize the perfect square.** $g_t^2 - 2g_t G + G^2 = (g_t - G)^2$.

The conclusion, for this fixed $\mathbf{x}$:

$$
\underbrace{\operatorname{avg}\big((g_t - f)^2\big)}_{\text{average error of the } g_t} = \underbrace{\operatorname{avg}\big((g_t - G)^2\big)}_{\text{how far the } g_t \text{ are from } G} + \underbrace{(G - f)^2}_{\text{error of } G}
$$

### Numerical example: three predictions

The following is an example made up for this article, not from the slides. Fix one $\mathbf{x}$; the true answer is $f = 6$ and the three hypotheses predict $g_1 = 2$, $g_2 = 4$, $g_3 = 9$. Two underestimate and one overestimates.

- $G = (2 + 4 + 9)/3 = 5$.
- Left-hand side: $\operatorname{avg}\big((g_t - f)^2\big) = (16 + 4 + 9)/3 = 29/3 \approx 9.67$.
- Spread: $\operatorname{avg}\big((g_t - G)^2\big) = (9 + 1 + 16)/3 = 26/3 \approx 8.67$.
- Error of $G$: $(5 - 6)^2 = 1$.

$26/3 + 1 = 29/3$, so the identity holds. The squared errors of the three hypotheses are 16, 4, and 9, averaging close to 10; the averaged $G$ has only 1, and in this example $G$ beats all three.

But the identity only guarantees "no worse than the average". Change the predictions to $g_1 = 6$, $g_2 = 2$, $g_3 = 1$ with $f$ still 6: $G = 3$, the error of $G$ is 9, the average error of the $g_t$ is $(0 + 16 + 25)/3 = 41/3 \approx 13.67$, the spread is $(9 + 1 + 4)/3 = 14/3$, and $14/3 + 9 = 41/3$ still holds. Yet the error of $g_1$ is 0, better than $G$. This is exactly the point made in the lecture: whether the best $g_t$ beats $G$ is unknown; what is certain is that $G$ beats the expected performance of "picking a $g_t$ at random", because you do not know in advance which one to pick.

### From one point to the overall Eout

The identity above holds for every $\mathbf{x}$, so you can take the expectation over the distribution that generates $\mathbf{x}$. The handout writes this expectation as $\mathcal{E}$. The expectation of the squared error is $E_{\text{out}}$: $\mathcal{E}\,(g_t - f)^2 = E_{\text{out}}(g_t)$ and $\mathcal{E}\,(G - f)^2 = E_{\text{out}}(G)$. Both $\operatorname{avg}$ and $\mathcal{E}$ are linear operations and their order can be swapped, so the lower half of page 9 reads

$$
\operatorname{avg}\big(E_{\text{out}}(g_t)\big) = \operatorname{avg}\big(\mathcal{E}\,(g_t - G)^2\big) + E_{\text{out}}(G) \ \ge\ E_{\text{out}}(G)
$$

The middle term is an average of squares followed by an expectation and cannot be negative; drop it and you have the inequality. In regression with squared error, the $G$ of uniform blending is guaranteed to be no worse than the average performance of the $g_t$, and the gap between the two is exactly the spread among the $g_t$: the more the $g_t$ differ, the more $G$ wins by; when the $g_t$ are identical that term is 0 and there is no benefit. The earlier "be diverse" now has a precise meaning.

An addition in this article: this conclusion is proved for the squared error of regression. Voting in classification has no identity this clean; Self-check question 2 works a classification example with probabilities.

### Some special gₜ: bias and variance

Page 10 applies the same identity to a special set of $g_t$. Imagine a virtual process that, for $t = 1, 2, \dots, T$:

1. Requests a fresh size-$N$ data set $\mathcal{D}_t$ from the distribution $P^N$ (i.i.d.).
2. Obtains $g_t = \mathcal{A}(\mathcal{D}_t)$ with the algorithm $\mathcal{A}$.

In the lecture, Lin says this process is abstract and leaves what is impractical about it for later; the bagging section shows that the problem is that nobody can get a brand-new data set every round in reality. Push $T$ to infinity and write the result of the averaging as $\bar{g}$:

$$
\bar{g} = \lim_{T \to \infty} G = \lim_{T \to \infty} \frac{1}{T}\sum_{t=1}^{T} g_t = \underset{\mathcal{D}}{\mathcal{E}}\ \mathcal{A}(\mathcal{D})
$$

$\bar{g}$ is the expected value of the hypothesis the algorithm $\mathcal{A}$ produces after seeing all kinds of data. Replace $G$ with $\bar{g}$ and the earlier identity becomes

$$
\operatorname{avg}\big(E_{\text{out}}(g_t)\big) = \operatorname{avg}\big(\mathcal{E}\,(g_t - \bar{g})^2\big) + E_{\text{out}}(\bar{g})
$$

An addition in this article: the identity still holds after the swap because the derivation used only the linearity of the average and the fact that $G$ is the average of the $g_t$. Replace "average over $t$" with "expectation over the data $\mathcal{D}$" and both properties are still there.

The handout gives each of the three terms a name:

| Term in the formula | The handout's wording | Name |
|---|---|---|
| $\operatorname{avg}\big(E_{\text{out}}(g_t)\big)$ | expected performance of $\mathcal{A}$ | — |
| $E_{\text{out}}(\bar{g})$ | performance of consensus | **bias** |
| $\operatorname{avg}\big(\mathcal{E}\,(g_t - \bar{g})^2\big)$ | expected deviation to consensus: how far each $g_t$ is expected to deviate from the consensus | **variance** |

$\bar{g}$ is called the consensus, the shared opinion of all the $g_t$. The plain-language version in the lecture: bias looks at how far this consensus still is from the $f$ we really want; variance looks at how messy the opinions are when this crowd of $g_t$ all talk at once. The average performance of an algorithm splits into these two terms, which statistics books call the bias–variance decomposition.

The conclusion on this page of the handout: uniform blending reduces variance for more stable performance. In the lecture, Lin explains that the averaging process removes the influence of the "how messy the opinions are" term. The identity shows it too: once you use the consensus $\bar{g}$, the error is only the one bias term $E_{\text{out}}(\bar{g})$, and the variance term disappears entirely. The bias, on the other hand, does not shrink because of averaging; however far the consensus is from $f$, that is how far it stays.

### Numerical example: learning a constant from one example

The following is an example made up for this article, not from the slides; its purpose is to put a number on each of the three terms.

- The input $x$ takes $-1$, $0$, $1$ with equal probability and the target function is $f(x) = x^2$, so the values of $f$ are 1, 0, 1.
- Each data set has only $N = 1$ example. The algorithm $\mathcal{A}$ returns the constant hypothesis through that example, $g(x) = y_1$.

There are three equally likely data sets, and the learned $g$ is the constant 1, 0, 1 respectively. The $E_{\text{out}}$ of a constant hypothesis $g(x) = c$ is $\frac{1}{3}\big[(c - 1)^2 + c^2 + (c - 1)^2\big]$:

| The $x$ drawn | The $g$ learned | $E_{\text{out}}(g)$ | $(g - \bar{g})^2$ |
|---|---|---|---|
| $-1$ | $1$ | $\frac{1}{3}$ | $\frac{1}{9}$ |
| $0$ | $0$ | $\frac{2}{3}$ | $\frac{4}{9}$ |
| $1$ | $1$ | $\frac{1}{3}$ | $\frac{1}{9}$ |

- Consensus: $\bar{g} = (1 + 0 + 1)/3 = \frac{2}{3}$.
- Expected performance of the algorithm: $(\frac{1}{3} + \frac{2}{3} + \frac{1}{3})/3 = \frac{4}{9}$.
- Variance: $(\frac{1}{9} + \frac{4}{9} + \frac{1}{9})/3 = \frac{2}{9}$. Because $g$ is a constant, $(g - \bar{g})^2$ does not change with $x$, so its expectation over $x$ is itself.
- Bias: $E_{\text{out}}(\bar{g}) = \frac{1}{3}\big[\frac{1}{9} + \frac{4}{9} + \frac{1}{9}\big] = \frac{2}{9}$.

$\frac{2}{9} + \frac{2}{9} = \frac{4}{9}$, so the identity holds. What this result says: for an algorithm that draws its conclusion from a single example, half of the expected error $\frac{4}{9}$ comes from "the data seen is different each time, and what is learned wobbles along with it". If you could average all the possible $g$, the error would drop to $\frac{2}{9}$, lower than each of the three $g$ ($\frac{1}{3}$ or $\frac{2}{3}$). The remaining $\frac{2}{9}$ is the part of $x^2$ that a constant hypothesis cannot express in the first place, and no amount of averaging removes it.

### Fun Time: what an average of linear hypotheses is

**Question (page 11):** Consider applying uniform blending $G(\mathbf{x}) = \frac{1}{T}\sum_{t=1}^{T} g_t(\mathbf{x})$ on linear regression hypotheses $g_t(\mathbf{x}) = \operatorname{innerprod}(\mathbf{w}_t, \mathbf{x})$. Which of the following properties best describes the resulting $G(\mathbf{x})$?

1. a constant function of $\mathbf{x}$
2. a linear function of $\mathbf{x}$
3. a quadratic function of $\mathbf{x}$
4. none of the other choices

**Answer: 2.** The inner product is linear in its first argument, so

$$
G(\mathbf{x}) = \frac{1}{T}\sum_{t=1}^{T} \operatorname{innerprod}(\mathbf{w}_t, \mathbf{x}) = \operatorname{innerprod}\Big(\frac{1}{T}\sum_{t=1}^{T}\mathbf{w}_t,\ \mathbf{x}\Big)
$$

$G$ is still a linear hypothesis, and its weight vector is the average of all the $\mathbf{w}_t$. Choice 1 holds only when the averaged weights happen to make $G$ not change with $\mathbf{x}$, which is not the general case. Choice 3 is impossible; adding linear functions does not grow a quadratic term. The handout also explains why it writes innerprod: the T in the usual transpose notation $\mathbf{w}^\top\mathbf{x}$ would clash with the number of hypotheses $T$.

An addition in this article: this question and the "three decision stumps vote" Fun Time form a matched pair. An average of linear regression hypotheses stays inside the original hypothesis set, so the model gains no power, and the only thing averaging can bring is lower variance. When decision stumps vote there is an extra layer of $\operatorname{sign}$, and the combined $G$ lands somewhere a single stump cannot express. Of the two pictures on page 5, one is about gaining power and the other about becoming steadier; the stump question is a small instance of the former, and this linear regression question is the plainest case of "steadier only, with no change in power" (the PLA vote in the right picture has an extra layer of $\operatorname{sign}$, so it is not exactly the same).

## How the ballots are decided: linear blending and any blending

```youtube
url: https://www.youtube.com/watch?v=i03s1g7X_m4
title: Blending and Bagging :: Linear and Any Blending @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–03:44 views linear blending as a linear model, 03:44–06:18 covers the constraint $\alpha_t \ge 0$, 06:18–11:10 compares with selection and gives the practical steps, 11:10–12:49 is any blending, 12:49–16:11 is the KDD Cup 2011 story, followed by Fun Time.)

### Finding the ballots is one run of linear regression

Linear blending (page 12) likewise assumes the $g_t$ are already in hand and decides how many ballots each $g_t$ gets:

$$
G(\mathbf{x}) = \operatorname{sign}\Big(\sum_{t=1}^{T} \alpha_t \cdot g_t(\mathbf{x})\Big), \qquad \alpha_t \ge 0
$$

The explanation in the lecture for the word linear in the name: $G$ is a linear combination of the outputs of the $g_t$, with the $\alpha_t$ as coefficients. What is a good $\alpha$? The most direct idea is to minimize the error, $\min_{\alpha_t \ge 0} E_{\text{in}}(\boldsymbol{\alpha})$. Taking regression as the example, the handout puts it side by side with a problem learned in Foundations:

| linear blending for regression | LinReg + transformation |
|---|---|
| $\displaystyle \min_{\alpha_t \ge 0} \frac{1}{N}\sum_{n=1}^{N}\Big(y_n - \sum_{t=1}^{T}\alpha_t\, g_t(\mathbf{x}_n)\Big)^2$ | $\displaystyle \min_{w_i} \frac{1}{N}\sum_{n=1}^{N}\Big(y_n - \sum_{i=1}^{\tilde{d}} w_i\, \phi_i(\mathbf{x}_n)\Big)^2$ |

The two sides match term by term: $\alpha_t$ with $w_i$, $g_t$ with $\phi_i$, and the number of hypotheses $T$ with the transformed dimension $\tilde{d}$. The only difference is the extra $\alpha_t \ge 0$ on the left. So the handout writes linear blending as one line:

**linear blending = LinModel + hypotheses as transform + constraints**

In the lecture, Lin says linear blending really contains nothing new: treat the $g_t$ as a feature transform and all that remains is the linear models already learned, linear regression for regression and logistic regression when you want to output probabilities. The handout notes that this is like two-level learning. Lin points out that this appeared with the probabilistic SVM ([Techniques Lecture 5: Kernel Logistic Regression](/posts/ai/2026-09-30-ntu-htlin-ml-kernel-logistic-support-vector-regression-en)): run SVM first, then hand its output to logistic regression. Here you get a set of $g_t$ first, then run a linear model once to get $\alpha$.

### Can ballots not be negative?

A linear model has no constraint like $\alpha_t \ge 0$ to begin with, and adding it means the ready-made solvers no longer apply directly. Page 13 first switches the error to the general form $\min_{\alpha_t \ge 0} \frac{1}{N}\sum_n \operatorname{err}\big(y_n, \sum_t \alpha_t g_t(\mathbf{x}_n)\big)$ and then asks: if the solution has some $\alpha_t < 0$, what does that mean?

$$
\alpha_t < 0 \quad\Longrightarrow\quad \alpha_t\, g_t(\mathbf{x}) = \lvert \alpha_t \rvert \cdot \big(-g_t(\mathbf{x})\big)
$$

Giving $g_t$ a negative number of ballots equals giving $-g_t$ a positive number. In binary classification, $-g_t$ is $g_t$ with its answers flipped. In the lecture, Lin puts it this way: when the machine finishes learning and comes out with a negative $\alpha_t$, it is suggesting you use this $g_t$ the other way round.

The handout makes the point that there is nothing wrong with flipping by way of a joke: if you have a stock up/down classifier with 99% error, tell me! The lecture finishes the thought: when it says up I guess down, and when it says down I guess up, so 99% error becomes 99% accuracy.

So the handout's conclusion is that in practice the constraint is often simply dropped, and "+ constraints" is struck through on the slide:

**linear blending = LinModel + hypotheses as transform**

Lin also concedes in the lecture that for regression the meaning of using a hypothesis flipped is less intuitive, but most of the time there is no need to keep this constraint on purpose.

### Numerical example: computing ballots for three decision stumps

The following is an example made up for this article, not from the slides; the hypotheses are the three decision stumps from two of the handout's Fun Time questions, $g_1(x) = \operatorname{sign}(1 - x)$, $g_2(x) = \operatorname{sign}(1 + x)$, $g_3(x) = -1$.

Treat the hypotheses as a feature transform, $\boldsymbol{\Phi}(x) = (g_1(x), g_2(x), g_3(x))$. Points on the number line have only three possible images:

| Region | $\boldsymbol{\Phi}(x)$ |
|---|---|
| $x < -1$ | $(+1, -1, -1)$ |
| $-1 < x < 1$ | $(+1, +1, -1)$ |
| $x > 1$ | $(-1, +1, -1)$ |

Take five data points $x = -2, -1.5, 0, 0.5, 3$ to learn the ballots, using linear regression without the constraint, that is, finding the $\boldsymbol{\alpha}$ that minimizes $\sum_n (y_n - \boldsymbol{\alpha}^\top\boldsymbol{\Phi}(x_n))^2$. If some $\boldsymbol{\alpha}$ makes the error on every point 0, it is the minimum, so solve "one equation per region" directly:

$$
\begin{aligned}
x < -1:&\quad \alpha_1 - \alpha_2 - \alpha_3 = y_{\text{left}} \\
-1 < x < 1:&\quad \alpha_1 + \alpha_2 - \alpha_3 = y_{\text{mid}} \\
x > 1:&\quad -\alpha_1 + \alpha_2 - \alpha_3 = y_{\text{right}}
\end{aligned}
$$

The second equation minus the first gives $2\alpha_2 = y_{\text{mid}} - y_{\text{left}}$, the second minus the third gives $2\alpha_1 = y_{\text{mid}} - y_{\text{right}}$, and substituting back into the second gives $\alpha_3 = \alpha_1 + \alpha_2 - y_{\text{mid}}$. Solve once for each of three different targets:

| Target (the region where $y = +1$) | $(y_{\text{left}}, y_{\text{mid}}, y_{\text{right}})$ | The solution $(\alpha_1, \alpha_2, \alpha_3)$ | What these ballots mean |
|---|---|---|---|
| $\lvert x \rvert < 1$ | $(-1, +1, -1)$ | $(1, 1, 1)$ | One vote each, which is uniform blending |
| $x < 1$ | $(+1, +1, -1)$ | $(1, 0, 0)$ | Keep only $g_1$, which is selection |
| $x < -1$ | $(+1, -1, -1)$ | $(0, -1, 0)$ | Use $g_2$ flipped |

Take the third row: $2\alpha_2 = -1 - 1 = -2$, so $\alpha_2 = -1$; $2\alpha_1 = -1 - (-1) = 0$, so $\alpha_1 = 0$; $\alpha_3 = 0 + (-1) - (-1) = 0$. Check: at $x = -2$, $\boldsymbol{\alpha}^\top\boldsymbol{\Phi} = (-1)(-1) = +1$; at $x = 0$ it is $(-1)(+1) = -1$; at $x = 3$ it is also $-1$; all five points match exactly. Hand the $\boldsymbol{\Phi}(x_n)$ and $y_n$ of these five points to the linear regression solution from Foundations Lecture 9 and compute once more, and you get the same answer.

This small example walks through all three things in this section. With the same hypotheses and the same linear regression, different data produce ballots that can be uniform or can be selection, which is the nesting table from page 3. The $\alpha_2 = -1$ in the third row is negative: these three equations have only this one solution, so insisting on $\alpha_t \ge 0$ makes zero error unreachable; allowing negative ballots amounts to having one more hypothesis available, $-g_2 = \operatorname{sign}(-1 - x)$.

The three stumps in this example are given in advance, not learned from these five points. In practice the $g_t$ are usually learned from data as well, and then which data you use to learn the ballots matters; that is handled next.

### Ein cannot be used to learn the ballots

Where do the $g_t$ usually come from in practice? Page 14 says: each from a different model, $g_1 \in \mathcal{H}_1, g_2 \in \mathcal{H}_2, \dots, g_T \in \mathcal{H}_T$, each obtained by minimizing $E_{\text{in}}$ within its own hypothesis set. This is the same setting as model selection in Foundations Lecture 15, and the conclusions from then apply:

- **Selection by $E_{\text{in}}$** picks the best of best, and the complexity price to pay is $d_{\text{VC}}\big(\bigcup_{t=1}^{T}\mathcal{H}_t\big)$. The analogy in the lecture is that the top students of two classes come out and compete once more, and whoever is picked represents the complexity of the two classes combined.
- **Linear blending includes selection as a special case**, by setting $\alpha_t$ to $\llbracket E_{\text{val}}(g_t^-) \text{ smallest} \rrbracket$.
- So **linear blending with $E_{\text{in}}$**, which the handout calls aggregation of best, has a complexity price $\ge d_{\text{VC}}\big(\bigcup_{t=1}^{T}\mathcal{H}_t\big)$.

The reason for the third point, as given in the lecture: selection only picks one out of the class champions, while linear blending assembles all the champions into an elite team; what it can do includes selection, so the price paid can only be higher. Best of best is already dangerous enough and this overfits even more easily, so learning $\alpha$ with $E_{\text{in}}$ is not recommended in practice.

The handout's prescription is the same as for selection, with two replacements: use $E_{\text{val}}$ instead of $E_{\text{in}}$; and the hypotheses being combined are the $g_t^-$, the versions obtained by minimizing $E_{\text{train}}$ on $\mathcal{D}_{\text{train}}$ only. In the lecture, Lin adds the purpose of the second point: the validation data used to compute $\alpha$ has to be separate from the data that produced those hypotheses, so that there is independence.

### The practical steps, and any blending

Page 15 writes out the procedure. After splitting the data into $\mathcal{D}_{\text{train}}$ and $\mathcal{D}_{\text{val}}$:

1. Learn $g_1^-, g_2^-, \dots, g_T^-$ on $\mathcal{D}_{\text{train}}$.
2. Transform every $(\mathbf{x}_n, y_n)$ in $\mathcal{D}_{\text{val}}$ into $(\mathbf{z}_n = \boldsymbol{\Phi}^-(\mathbf{x}_n),\ y_n)$, where $\boldsymbol{\Phi}^-(\mathbf{x}) = (g_1^-(\mathbf{x}), \dots, g_T^-(\mathbf{x}))$.
3. Learn how to combine on the transformed data.
4. The returned $G$ uses $\boldsymbol{\Phi}(\mathbf{x}) = (g_1(\mathbf{x}), \dots, g_T(\mathbf{x}))$ instead, that is, the $g_t$ without the minus sign.

Steps 3 and 4 come in two versions:

| | Linear Blending | Any Blending (Stacking) |
|---|---|---|
| Step 3 | $\boldsymbol{\alpha} = \text{LinearModel}\big(\{(\mathbf{z}_n, y_n)\}\big)$ | $\tilde{g} = \text{AnyModel}\big(\{(\mathbf{z}_n, y_n)\}\big)$ |
| Step 4 | $G_{\text{LINB}}(\mathbf{x}) = \text{LinearHypothesis}_{\boldsymbol{\alpha}}\big(\boldsymbol{\Phi}(\mathbf{x})\big)$ | $G_{\text{ANYB}}(\mathbf{x}) = \tilde{g}\big(\boldsymbol{\Phi}(\mathbf{x})\big)$ |

What $\text{LinearHypothesis}_{\boldsymbol{\alpha}}$ means, as explained in the lecture: first compute the inner product of $\boldsymbol{\alpha}$ and $\boldsymbol{\Phi}(\mathbf{x})$; for regression output it directly, and for classification take $\operatorname{sign}$ of it.

Why does step 4 use $\boldsymbol{\Phi}$ and not $\boldsymbol{\Phi}^-$? Lin stops to explain this in the lecture: it is the same reasoning as returning $g$ and not $g^-$ after validation has selected a model; $g_t$ used all the data and is expected to perform better than $g_t^-$. An addition in this article: this means every model is trained twice, once on $\mathcal{D}_{\text{train}}$ only to get $g_t^-$ for learning $\boldsymbol{\alpha}$, and once on all the data to get $g_t$ for the final prediction.

The right-hand column swaps the linear model for an arbitrary model. The handout names this any blending, also called stacking. In the lecture, Lin explains that stacking means one layer piled on another: the first layer gets the $g_t$ and the second layer combines them, and the second layer can be a nonlinear SVM or whichever model you want to use. There is also a joke: the Lin in LinearModel stands for linear, not for the lecturer's surname.

The handout has two remarks on any blending:

- **powerful**: the second layer is nonlinear and can achieve the conditional blending of page 3, which amounts to using different $g_t$ under different conditions.
- **danger of overfitting**: the more powerful a model, the more easily it overfits. In the lecture, Lin warns that any blending has to be used very carefully, with regularization added wherever it is called for and the brake applied often.

### A real case: KDD Cup 2011 Track 1

Page 16 is the solution with which the NTU team won the KDD Cup 2011 Track 1 world championship; the source is the paper by Chen et al., [A linear ensemble of individual and blended models for music rating prediction](https://www.csie.ntu.edu.tw/~htlin/paper/doc/wskdd11cup_one.pdf). The flow chart at the top of the slide has five boxes, in order:

1. Data-Set
2. Single Models: the arrow comes from Data-Set; many single models are trained, and they are the $g_t$ of this lecture.
3. Val.-Set Blending: the arrow comes from Single Models, with another one directly from Data-Set.
4. Test-Set Blending: the arrow comes from Val.-Set Blending, with another one directly from Single Models.
5. Post-Processing

In other words, both the single models and the models produced by the first blending go into the second blending.

Each of the two blendings has numbers, which the handout labels $E_{\text{test}}$ (squared):

| Step | Method | $E_{\text{test}}$ | What the handout says it did |
|---|---|---|---|
| validation set blending | a special any blending model | 519.45 ⟹ 456.24 | helped secure the lead in last two weeks |
| test set blending | linear blending using $\tilde{E}_{\text{test}}$ | 456.24 ⟹ 442.06 | helped turn the tables in last hour |

This article worked out the reductions: the first step lowered it by 63.21, about 12.2%; the second step lowered it by 14.18, about 3.1%.

The lecture fills in how the competition went. The first step combined the single models in a nonlinear way, and after it the NTU team stayed steadily in the leading group over the last two weeks of the competition. The second step combined the hundred or more $g$ and $G$ obtained so far once more, this time only giving each model a different number of ballots; what was special is that some method made it possible to get an estimate very close to $E_{\text{test}}$, which is what the tilde over $E_{\text{test}}$ on the slide means, and the ballots were then learned directly against that estimate. The reduction in the second step looks small, yet it took the NTU team from second place to first in the last hour of the competition.

The handout's conclusion is that blending is "useful" in practice, despite the computational burden. Lin discounts this in the lecture too: whether a competition counts as practice is one question, and whether a real system would hold more than two hundred models is another; what is certain is that if you have tried things from different directions and have some different $g_t$ in hand, combining them really does help, at the cost of model complexity and computation.

### Fun Time: the transformed result at x equal to 0

**Question (page 17):** Consider the same three decision stump hypotheses, $g_1(x) = \operatorname{sign}(1 - x)$, $g_2(x) = \operatorname{sign}(1 + x)$, $g_3(x) = -1$. When $x = 0$, what is the resulting $\boldsymbol{\Phi}(x) = (g_1(x), g_2(x), g_3(x))$ used in the returned hypothesis of linear/any blending?

1. $(+1, +1, +1)$
2. $(+1, +1, -1)$
3. $(+1, -1, -1)$
4. $(-1, -1, -1)$

**Answer: 2.** Substitute directly: $g_1(0) = \operatorname{sign}(1) = +1$, $g_2(0) = \operatorname{sign}(1) = +1$, $g_3(0) = -1$. The handout's answer is a single line, "Too easy? :-)".

The other choices map back to the table in the earlier example: choice 3 is the $\boldsymbol{\Phi}(x)$ of the segment $x < -1$. Choices 1 and 4 never occur for any $x$: the third component of choice 1 is $+1$, but $g_3$ is always $-1$; choice 4 needs $g_1$ and $g_2$ to be $-1$ at once, which requires $x > 1$ and $x < -1$.

What this question checks is whether "hypotheses as transform" has sunk in: the originally one-dimensional $x$ is turned by three hypotheses into a three-dimensional $\mathbf{z}$, and the second-level model sees $\mathbf{z}$, not the original $x$.

## Getting different hypotheses from a single data set: bootstrap and bagging

```youtube
url: https://www.youtube.com/watch?v=3T1mdvzRAF0
title: Blending and Bagging :: Bagging (Bootstrap Aggregation) @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–03:00 reviews blending and lists the sources of diversity, 03:00–04:30 returns to bias–variance, 04:30–06:42 is bootstrap, 06:42–08:12 is bagging, 08:12–09:46 is the pocket demonstration, followed by Fun Time and the summary.)

### From "get the gₜ, then combine" to "combine while learning the gₜ"

Page 18 first sorts out the three kinds of blending so far and raises the next question. Blending aggregates after getting the $g_t$; the handout calls "aggregate as well as getting $g_t$" learning:

| aggregation type | blending | learning |
|---|---|---|
| uniform | voting/averaging | ? |
| non-uniform | linear | ? |
| conditional | stacking | ? |

This lecture fills in only the first cell of the right-hand column. Compared against the same table at the start of the Techniques Lecture 9 handout, the answers to the three cells are, in order, Bagging, AdaBoost, and Decision Tree; the last two are the content of the next two lectures.

To learn the $g_t$ for uniform aggregation, the earlier analysis has already named the key: diversity. The handout lists four sources of diversity:

- **Different models**: $g_1 \in \mathcal{H}_1, g_2 \in \mathcal{H}_2, \dots, g_T \in \mathcal{H}_T$.
- **Different parameters**: for example, gradient descent with $\eta = 0.001, 0.01, \dots, 10$. The lecture adds SVM with different $\gamma$ or different $C$.
- **Algorithmic randomness**: random PLA with different random seeds. Lin says pocket with different starting points counts too.
- **Data randomness**: the within-cross-validation hypotheses $g_v^-$, each learned from a different set of folds.

The handout takes the fourth route next, with one added condition: diversity by data randomness without $g^-$. This article's reading is that every $g_v^-$ from cross-validation uses one fold less data; what is wanted here is a way to build many different $g_t$ from the same data set without carving out validation data.

### Back to bias–variance: two things that cannot be done

Page 19 returns to the conclusion of the uniform blending section:

$$
\text{expected performance of } \mathcal{A} = \text{expected deviation to consensus} + \text{performance of consensus}, \qquad \bar{g} = \text{expected } g_t \text{ from } \mathcal{D}_t \sim P^N
$$

The handout says the consensus $\bar{g}$ is more stable than the direct $\mathcal{A}(\mathcal{D})$, but it comes from many more $\mathcal{D}_t$ than the one $\mathcal{D}$ on hand. The lecture splits the difficulty in two: $\bar{g}$ is an average of infinitely many $g_t$, and we do not have infinitely many; every $g_t$ needs a fresh data set, and we have only the one in hand. So two compromises are needed:

- Use a finite but large $T$ in place of infinitely many.
- Using only the $\mathcal{D}$ in hand, find a way to build a $\mathcal{D}_t$ that "looks like new data", and use it to get $g_t = \mathcal{A}(\mathcal{D}_t)$.

The second compromise relies on bootstrapping. The handout's definition: a statistical tool that re-samples from $\mathcal{D}$ to "simulate" $\mathcal{D}_t$.

### Bootstrap: re-sampling with replacement

The definition on page 20: a bootstrap sample $\tilde{\mathcal{D}}_t$ is the data obtained by re-sampling $N$ examples from $\mathcal{D}$ uniformly with replacement.

With $N$ examples in hand, isn't drawing $N$ of them just the original set? The lecture makes the process concrete: grab one example, note down "this time I drew example 3", and put it back; grab another, note down "this time I drew example 5", and put it back; grab another, example 3 once more, note it down too, and put it back. Because each one goes back, the same example may be drawn several times, and some examples may never be drawn. Do this $N$ times, and the $N$ examples noted down are one bootstrap sample. The tilde indicates that it resembles the imagined $\mathcal{D}_t$ but is not the same.

The number drawn does not have to be $N$; the handout says an arbitrary $N'$ can be used. The example in the lecture: with 10,000 examples, if drawing 3,000 each time seems enough, then $N'$ is 3000. What matters is the process of "draw, note down, put back".

### The bagging procedure

With bootstrap, the virtual process of page 10 can be replaced by a version that can actually be carried out. The handout puts the two side by side:

| | virtual aggregation (virtual) | bootstrap aggregation (physical, can actually be done) |
|---|---|---|
| For each round $t = 1, 2, \dots, T$, step 1 | Request a fresh size-$N$ data set $\mathcal{D}_t$ from $P^N$ | Draw a size-$N'$ data set $\tilde{\mathcal{D}}_t$ from $\mathcal{D}$ by bootstrapping |
| Step 2 | $g_t = \mathcal{A}(\mathcal{D}_t)$ | $g_t = \mathcal{A}(\tilde{\mathcal{D}}_t)$ |
| Finally | $G = \text{Uniform}(\{g_t\})$ | $G = \text{Uniform}(\{g_t\})$ |

$\text{Uniform}$ is the uniform blending of this lecture: voting for classification, averaging for regression. The two columns differ only in where the data comes from.

Bootstrap aggregation is abbreviated BAGging. In the lecture, Lin says the nickname is like bagging up a bunch of $g_t$. It does not care what the underlying $\mathcal{A}$ is and can be applied to every algorithm, so the handout calls it a meta algorithm on top of the base algorithm $\mathcal{A}$.

### Numerical example: bootstrapping three examples

The following is an example made up for this article, not from the slides. The data has only three examples, with $y$ values 1, 2, 6; ignore the input and learn just a constant to predict $y$. Three draws with three possibilities each give $3^3 = 27$ equally likely ways to draw. Ignoring order, there are 10 combinations:

| The three drawn | Number of ways | Mean | Median |
|---|---|---|---|
| 1, 1, 1 | 1 | $1$ | 1 |
| 1, 1, 2 | 3 | $\frac{4}{3}$ | 1 |
| 1, 1, 6 | 3 | $\frac{8}{3}$ | 1 |
| 1, 2, 2 | 3 | $\frac{5}{3}$ | 2 |
| 2, 2, 2 | 1 | $2$ | 2 |
| 2, 2, 6 | 3 | $\frac{10}{3}$ | 2 |
| 1, 2, 6 | 6 | $3$ | 2 |
| 1, 6, 6 | 3 | $\frac{13}{3}$ | 6 |
| 2, 6, 6 | 3 | $\frac{14}{3}$ | 6 |
| 6, 6, 6 | 1 | $6$ | 6 |

The numbers of ways add up to 27. Of the 27 ways, only 6 draw exactly the original three examples; the other 21 all contain a repeat and all miss at least one example. Each round's $\tilde{\mathcal{D}}_t$ mostly differs from $\mathcal{D}$ and from the others, and that is where the differences among the $g_t$ come from.

Now look at two base algorithms. With $T$ very large, the output of bagging approaches the average over the 27 ways:

- **$\mathcal{A}$ returns the mean.** On the original data $\mathcal{A}(\mathcal{D}) = 3$. Average the means of the 27 ways and you still get 3. The individual $g_t$ are all different, yet combined they return to the starting point.
- **$\mathcal{A}$ returns the median.** On the original data $\mathcal{A}(\mathcal{D}) = 2$. Among the 27 ways the median is 1 in 7 of them, 2 in 13, and 6 in 7, and the average is $(7 \times 1 + 13 \times 2 + 7 \times 6)/27 = 75/27 = 25/9 \approx 2.78$, different from the original 2.

This example shows two things. First, the $G$ of bagging does not necessarily equal the result of running $\mathcal{A}$ once on $\mathcal{D}$; the median case differs. Second, bootstrap only re-samples from the same $\mathcal{D}$ and brings in no new data. The mean case shows it most clearly: every example has the same probability of being drawn, so the expected value of the bootstrap mean is the mean of the original data, and re-sampling and then averaging only returns to $\mathcal{A}(\mathcal{D}) = 3$. The $\bar{g}$ of the virtual process is an expectation over truly new data, and the two are not the same thing; when covering bagging in the lecture, Lin also says this only simulates that imagined process. These two points are what this article reads out of the example, not content from the handout. The example has no $f$, so there is no way to say which answer is better; it only shows what bagging changes and what it does not.

### Demonstration: bagging plus pocket

Page 21 is a picture from an actual run, with the pocket algorithm from [Foundations Lecture 2](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm-en) as the base algorithm. The setting is $T_{\text{POCKET}} = 1000$ and $T_{\text{BAG}} = 25$: bootstrap 25 times, let pocket run 1000 rounds on each data set, and get one line from each.

The 25 gray lines in the picture point in very different directions; the lecture describes some as closer to horizontal and some as slanted, and all of these differences are caused by bootstrap. After the 25 lines vote you get the black boundary, a winding nonlinear boundary. The assessment in the lecture is cautious: the circles and crosses are separated acceptably, not extremely well, but possibly better than a single pocket line.

The handout sums it up in two points: the $g_t$ from bagging are very diverse; and aggregating the binary classifiers gives a proper nonlinear boundary. The conclusion on this page: bagging works reasonably well if the base algorithm is sensitive to data randomness. The explanation in the lecture is that the more sensitive the algorithm, the more the bootstrapped $g_t$ differ, and the more likely it is that combining them helps. This sentence sets up [Techniques Lecture 10: Random Forests](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-10-random-forest-en): a fully grown decision tree is exactly an algorithm that is very sensitive to the data.

### Fun Time: the probability of drawing the original set back

**Question (page 22):** When using bootstrapping to re-sample $N$ examples $\tilde{\mathcal{D}}_t$ from a data set $\mathcal{D}$ with $N$ examples, what is the probability of getting $\tilde{\mathcal{D}}_t$ exactly the same as $\mathcal{D}$?

1. $0 / N^N = 0$
2. $1 / N^N$
3. $N! / N^N$
4. $N^N / N^N = 1$

**Answer: 3.** The handout's solution considers re-sampling in an ordered manner for $N$ steps: each step has $N$ possibilities, giving $N^N$ possible outcomes in total, each with equal probability. Of these, $N!$ are permutations of the original $\mathcal{D}$, with every example appearing exactly once and only the order differing, so the probability is $N!/N^N$.

When reading the question out in the lecture, Lin adds a condition: the original $N$ examples are distinct. The question also takes "the same" to mean the same regardless of order.

Where the other choices go wrong: choice 1 says it is impossible, but drawing every example exactly once does happen. Choice 2 counts only the one outcome "drawn in the original order", which would be right if even the order had to match. Choice 4 says they are always the same, ignoring the cases where the same example is drawn repeatedly.

A check by this article: in the three-example case above, 6 of the 27 ways are permutations of the original data, $3!/3^3 = 6/27 = 2/9$, which matches the 6 ways in that row of the table. As $N$ grows this probability falls fast: for $N = 5$ it is $24/625 = 0.0384$ and for $N = 10$ it is $0.00036$. With even slightly more data, every bootstrap data set is almost certain to differ from the original.

The summary on page 23 wraps each of the four sections into one line: the aggregated $G$ can be strong and/or moderate; hypotheses should be diverse, "one vote, one value"; linear and any blending are two-level learning with hypotheses as transform; and bootstrapping is for diverse hypotheses. The preview of the next lecture is "getting more diverse hypotheses to make $G$ strong". The way the lecture puts it: can we get hypotheses even more different than those from bagging, so that $G$ does better.

## Self-check

**1. Fix one $\mathbf{x}$ with $f = 2$; three hypotheses predict $g_1 = 1$, $g_2 = 2$, $g_3 = 9$. Compute $G$, the average squared error of the $g_t$, the spread of the $g_t$ around $G$, and the squared error of $G$, and check the identity. Does $G$ beat every $g_t$?**

Answer: $G = 12/3 = 4$. The average squared error is $(1 + 0 + 49)/3 = 50/3$; the spread is $(9 + 4 + 25)/3 = 38/3$; the squared error of $G$ is $(4 - 2)^2 = 4$. $38/3 + 4 = 50/3$, so it holds. The error of $G$, 4, is far below the average $50/3 \approx 16.7$, but $g_1$ (error 1) and $g_2$ (error 0) are both better than $G$. The identity guarantees that $G$ is no worse than the average, not that it beats the best one.

**2. Three binary classifiers each have a 20% probability of being wrong, and whether each is wrong is independent of the others. What is the probability that the one-vote-each $G$ is wrong? What if the three classifiers are identical? What if each has an error rate of 60%?**

Answer (this article's calculation; independence is an assumption given by the question): $G$ is wrong when at least two are wrong at once, with probability $3 \times 0.2^2 \times 0.8 + 0.2^3 = 0.096 + 0.008 = 0.104$, lower than the 0.2 of a single one. When the three are identical, the vote is just that one classifier and the error rate stays 0.2, which is what the handout calls autocracy. With an error rate of 60% it is $3 \times 0.6^2 \times 0.4 + 0.6^3 = 0.432 + 0.216 = 0.648$, worse than a single one: the majority corrects the minority only on the premise that the majority is more likely to be right.

**3. In linear blending, why is $\boldsymbol{\alpha}$ learned on $\mathcal{D}_{\text{val}}$ from the outputs of the $g_t^-$, while what is returned in the end uses the $g_t$?**

Criterion: the answer should state three things. First, linear blending includes selection as a special case, so learning $\boldsymbol{\alpha}$ with $E_{\text{in}}$ pays a complexity price of at least $d_{\text{VC}}(\bigcup_t \mathcal{H}_t)$ and overfits easily. Second, the $g_t^-$ have seen only $\mathcal{D}_{\text{train}}$, so $\mathcal{D}_{\text{val}}$ is unseen data for them, and learning $\boldsymbol{\alpha}$ is then not misled by data already memorized. Third, once the ballots are fixed, you switch back to the $g_t$ trained on all the data, for the same reason that validation returns $g$ and not $g^-$ after selecting a model.

**4. Using the three decision stumps from the main text, do linear blending without the constraint, with the target "$y = +1$ when $\lvert x \rvert > 1$ and $y = -1$ when $\lvert x \rvert < 1$". Solve for $\boldsymbol{\alpha}$ and explain what it means.**

Answer: $(y_{\text{left}}, y_{\text{mid}}, y_{\text{right}}) = (+1, -1, +1)$. $2\alpha_2 = -1 - 1 = -2$, so $\alpha_2 = -1$; $2\alpha_1 = -1 - 1 = -2$, so $\alpha_1 = -1$; $\alpha_3 = -1 - 1 - (-1) = -1$. $\boldsymbol{\alpha} = (-1, -1, -1)$: all three hypotheses are used flipped and then given one vote each. This is the opposite of the $G$ in the Fun Time question, with all three ballots negative; it cannot be done under the constraint $\alpha_t \ge 0$.

**5. With $N = 4$ distinct examples, bootstrap draws 4. What is the probability that the data drawn is exactly the same as the original (ignoring order)? What does this mean for bagging?**

Answer: $4!/4^4 = 24/256 = 3/32 \approx 0.094$. With more than a nine-in-ten chance some example is drawn repeatedly while some example is not drawn at all, so each round's $\tilde{\mathcal{D}}_t$ mostly differs from $\mathcal{D}$, and that is why the base algorithm gives different $g_t$.

## Exercises and corresponding reading

**The corresponding weeks in two semesters.** The [Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) puts this lecture in W11 (11/11), with the slide code [207u](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/207u_handout.pdf). The [Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) puts it in W11 (11/18), taught in the same week as Techniques Lecture 8; that week's slides were not yet online as of 2026-09-30, so this article uses only the MOOC handout.

**Textbook.** Neither course page marks a chapter of [Learning from Data](http://amlbook.com) (LFD) for this lecture, so this article follows only the handout and the videos.

**Homework.** The related questions are in [Fall 2024 HW6](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf) (released 2024-11-18, due 12-02) and [HW7](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf) (released 12-02, due 12-16), with no official solutions:

| Question | Type | What it practices |
|---|---|---|
| HW6 Q4 | Auto-graded | Uniform blending of 5 classifiers whose errors are independent and which each have $E_{\text{out}} = 0.25$; roughly what the $E_{\text{out}}$ of $G$ is (the question cites page 7 of handout 207 directly). The calculation is the same as in Self-check question 2 |
| HW6 Q9 | Human-graded | Combining the $\boldsymbol{\Phi}(\mathbf{x}) = (g_1(\mathbf{x}), \dots, g_T(\mathbf{x}))$ of linear blending with kernels: take scaled decision stumps on integer inputs as the $g_t$ and derive the corresponding kernel |
| HW7 Q1 | Auto-graded | With $N = 1126$, how many examples bootstrap must draw before the probability of a repeated example exceeds 70% |
| HW7 Q5 | Human-graded | The tightest upper bound on $E_{\text{out}}(G)$ when $2M + 1$ classifiers vote uniformly |

The hint for HW6 Q9 attaches an early paper by Lin, [infkernel.pdf](https://www.csie.ntu.edu.tw/~htlin/paper/doc/infkernel.pdf). For HW7 Q1 you can check your analytic solution with a Monte Carlo simulation. The guide to the whole assignments is in [Techniques Homework and Final Project](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project-en).

**Further reading.** Among the further reading listed on the course page, two items relate to this lecture: [Breiman, Bagging Predictors](https://statistics.berkeley.edu/sites/default/files/tech-reports/421.pdf) (UC Berkeley Technical Report 421) is the original bagging paper; [Chen et al.](https://www.csie.ntu.edu.tw/~htlin/paper/doc/wskdd11cup_one.pdf) is the KDD Cup 2011 solution cited on page 16 of the handout. How other courses on this site cover the same topic: [Harvard CS181 HW4: Decision Trees, Random Forests, and MoE](/posts/tech/2026-09-29-harvard-cs181-hw4-trees-forests-moe-en) and the [Stanford CS229 guide](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en).

**Next lecture.** [Techniques Lecture 8: AdaBoost](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-08-adaptive-boosting-en) picks up the question this lecture leaves behind: bootstrap gets different $g_t$ through random sampling; can the data be adjusted deliberately so that the next $g_t$ differs even more from the previous one?

## Course video sources

Original videos: [Motivation of Aggregation](https://www.youtube.com/watch?v=mjUKsp0MvMI), [Uniform Blending](https://www.youtube.com/watch?v=DAFkKJYTMW4), [Linear and Any Blending](https://www.youtube.com/watch?v=i03s1g7X_m4), [Bagging (Bootstrap Aggregation)](https://www.youtube.com/watch?v=3T1mdvzRAF0)

- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

Checked: 2026-10-13. The video IDs, titles, and lengths were taken from the official playlist that day; the videos have no caption track on YouTube, and what this article reports from the lecture comes from transcripts made for it.

## Update Log

- 2026-10-10: Marked the video status and checked the recording sources and how they were obtained.
- 2026-10-10: Re-checked the video status. The embedded videos match the lecture numbering of the official playlist.
- 2026-10-13: Previously combined with Lecture 8 in one article; changed to one article per lecture and rewritten from the handout and the video transcripts.

## References

- [Techniques Lecture 7 handout, 207_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/207_handout.pdf): the main source for this article. The formulas in the four sections, the derivation of the error decomposition, the KDD Cup 2011 numbers, the bagging pocket demonstration, and the four Fun Time questions all come from this handout.
- [Techniques Lecture 9 handout, 209_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/209_handout.pdf): used only for the blending/learning table at its start, to confirm the answers to the three question marks.
- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2): the IDs and titles of the four videos; what the text reports as said "in the lecture" is paraphrased from machine transcripts of these four videos.
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/): the official entry for handouts and recordings.
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/): the corresponding week, the 207u slides, and the further reading list.
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/): the corresponding week.
- [Fall 2024 Homework 6 (hw6_red.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw6/hw6_red.pdf): the content of Q4 and Q9.
- [Fall 2024 Homework 7 (hw7.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf): the content of Q1 and Q5.
- [Chen et al., A linear ensemble of individual and blended models for music rating prediction](https://www.csie.ntu.edu.tw/~htlin/paper/doc/wskdd11cup_one.pdf): the KDD Cup 2011 Track 1 solution cited on page 16 of the handout.
- [Breiman, Bagging Predictors](https://statistics.berkeley.edu/sites/default/files/tech-reports/421.pdf): further reading listed on the course page, the original bagging paper.
- [Lin, infkernel.pdf](https://www.csie.ntu.edu.tw/~htlin/paper/doc/infkernel.pdf): the paper attached to the hint for HW6 Q9.
- [Learning from Data textbook website](http://amlbook.com): the textbook the course pages use when mapping lectures to LFD chapters.
- [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques: Course Overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en): where this lecture sits in the whole course and the reading routes.
