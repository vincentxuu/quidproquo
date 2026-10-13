---
title: "AdaBoost: Re-weighting Data to Stack Weak Classifiers into a Strong One | NTU Hsuan-Tien Lin Machine Learning Techniques Lecture 8"
date: 2026-10-13
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, ensemble, boosting, adaboost]
lang: en
math: true
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 25
tldr: "This lecture re-reads bagging's bootstrap as putting a weight on every example, then deliberately tunes the weights so that the previous round's gₜ has a weighted error rate of exactly 1/2, which forces the next round to learn a different hypothesis. The recipe multiplies incorrect examples by ◆ₜ = √((1−εₜ)/εₜ), divides correct ones by it, and uses αₜ = ln ◆ₜ as the vote weight in a linear vote. That is AdaBoost. As long as the base algorithm is a little better than random guessing in every round, E_in drops to 0 within O(log N) rounds; with decision stumps, three hand-computed rounds on six examples are enough to see it."
description: "A guide to Lecture 8 of NTU Hsuan-Tien Lin's Machine Learning Techniques, Adaptive Boosting: the classroom story of recognizing apples, bootstrap seen as re-weighting, the optimal re-weighting that makes the previous hypothesis look like a coin flip, the scaling factor and the vote weights, the full AdaBoost algorithm and its VC guarantee, decision stumps and face detection, with three rounds of AdaBoost-Stump computed by hand on six examples."
draft: false
glossary:
  - term: "AdaBoost"
    aliases: ["Adaptive Boosting"]
    definition: "In every round, multiply the weights of the examples the previous gₜ got wrong by ◆ₜ and divide the weights of the ones it got right by ◆ₜ, so that gₜ has a weighted error rate of exactly 1/2 under the new weights and the next hypothesis is forced to differ; at the end, vote linearly with αₜ = ln ◆ₜ."
    context: "Techniques Lecture 8 introduces it with the story of a teacher helping children recognize apples; Techniques Lecture 11 derives it again from the optimization side."
  - term: "weighted error rate εₜ"
    aliases: ["weighted incorrect rate"]
    definition: "The total weight of the examples gₜ gets wrong, divided by the total weight of all examples. When all weights are equal it is the ordinary error rate."
    context: "AdaBoost's scaling factor ◆ₜ and vote weight αₜ are both determined by εₜ alone."
  - term: "decision stump"
    aliases: ["positive and negative rays"]
    definition: "A classifier that looks at one feature and cuts once at one threshold, h(x) = s · sign(xᵢ − θ). Its three parameters are the feature i, the threshold θ, and the direction s. In the 2D plane it is a vertical or a horizontal line."
    context: "Techniques Lecture 8 uses it as the weak base algorithm for AdaBoost; the combination is called AdaBoost-Stump."
---

> 🌏 [中文版](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-08-adaptive-boosting)

**Video status: Videos included.** This article is written from the official MOOC handout [208_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/208_handout.pdf) and transcripts of the four official videos for this lecture, with formulas following the handout. The transcripts are machine transcripts made for this article (Whisper), not official captions, and no human has proofread them. The videos are taught in Mandarin; the slides are in English. Each section opens with its official video and the approximate time ranges. Page numbers refer to the number at the lower right of each slide (0/25 to 25/25), and wherever the text says "in the lecture" it is paraphrasing what is said in the video.

This is Techniques Lecture 8 in [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en). The Roadmap on page 1 of the handout divides Techniques into three ways of handling features, and this lecture belongs to the second, Combining Predictive Features: Aggregation Models. The previous lecture, [Techniques Lecture 7: Blending and Bagging](/posts/ai/2026-09-30-ntu-htlin-ml-blending-bagging-adaboost-en), is condensed into one sentence on that page: when you already hold a set of diverse hypotheses, you can combine them uniformly, linearly, or even non-linearly (blending); when you do not, you can learn diverse hypotheses from bootstrapped data (bagging).

Bagging's diversity depends on the luck of sampling. This lecture asks: can we design each round's data on purpose, so that the newly learned hypothesis is certain to differ from the previous one, and so that the final combined $G$ comes with a theoretical guarantee? The answer is Adaptive Boosting, AdaBoost for short.

The prerequisites are bootstrap and linear blending from the previous lecture, weighted classification from [Foundations Lecture 8: Noise and Error Measures](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-08-noise-and-error-en), the form of the VC bound, and basic arithmetic with logarithms and square roots. After reading, you should be able to derive on your own the pair of multipliers "what to multiply the incorrect ones by, what to multiply the correct ones by", write down the three steps of AdaBoost, compute each round's $\epsilon_t$, $\blacklozenge_t$, $\alpha_t$, and new weights by hand for a small data set, and explain why "a little better than random guessing" is enough.

The order of the derivation in this lecture:

1. **Motivation**: many crude rules, plus a teacher who points out mistakes, can be combined into a good classifier.
2. **Bootstrap as weights**: every $g_t$ in bagging is in fact minimizing a weighted error.
3. **Designing the weights**: make $g_t$ look like a coin flip under the next round's weights, which gives the optimal re-weighting.
4. **The scaling factor $\blacklozenge_t$**: write the re-weighting as "multiply the incorrect, divide the correct".
5. **The vote weight $\alpha_t = \ln\blacklozenge_t$**: decide the weights of the linear vote while learning each $g_t$.
6. **Guarantee and practice**: both terms of the VC bound can be made small; then run it with decision stumps.

## Can weak rules be combined into a strong one: a class on recognizing apples

```youtube
url: https://www.youtube.com/watch?v=hL8DjIHAzZY
title: Adaptive Boosting :: Motivation of Boosting @ Machine Learning Techniques (機器學習技法)
```

(Video 00:17–01:14 reviews the previous lecture, 01:14–02:22 introduces the topic, 02:22–10:30 is the classroom story, 10:30–12:23 maps the roles back to the algorithm, and Fun Time follows.)

### Twenty photos

Page 2 of the handout sets up a problem: teach a class of 6 year olds to tell whether a photo shows an apple. The teacher gathers photos under the CC-BY-2.0 license from Flickr, ten of apples and ten of other things. The non-apples named in the lecture are bananas, oranges, and strawberries, and tomatoes show up later in the story.

Lin first maps this setting back to machine learning vocabulary: the twenty photos are $\mathbf{x}$, whether each is an apple is $y$, the teacher gives the students both, so this is supervised learning, and what is to be learned is a binary classification.

### Four students, one teacher

Pages 3 to 6 of the handout are four rounds of question and answer, with the twenty photos at the bottom of every page. Pages 3 to 5 mark with a blue background the photos that this round's rule gets wrong; from page 4 on, the size of each photo changes with the previous round's result, with the ones answered wrongly enlarged and the ones answered correctly shrunk. The table below collects the four pages:

| Round (handout page) | The rule the student gives | Where the rule goes wrong (as explained in the lecture) | The class's conclusion so far (handout) |
|---|---|---|---|
| 1 (page 3) | Michael: apples are circular | Oranges are circular too; one apple does not look that round in its photo | Apples are circular |
| 2 (page 4) | Tina: apples are red | Green apples are not red; strawberries and tomatoes are red but are not apples | Somewhat circular and somewhat red |
| 3 (page 5) | Joey: apples could also be green | Quite a few photos are wrong, but they all fall on photos that have already been shrunk | Somewhat circular and somewhat red and possibly green |
| 4 (page 6) | Jessica: apples have stems at the top | (The last round; the handout marks no more mistakes) | Somewhat circular, somewhat red, possibly green, and may have stems at the top |

What matters is what the teacher does between rounds. After Michael says "circular", the teacher does not simply reject it. The line on the handout is: being circular is a good feature for the apples, but if you only say circular you could make several mistakes, so what else can we say for an apple? Lin describes the teacher's action concretely: move the photos Michael got right farther away (drawn as shrinking on the slide), enlarge the photos he got wrong, and then ask the next student to look.

What Tina sees is not what Michael saw. As Lin describes it, the enlarged photos include two big red apples, while most of the other fruit that are not apples are not red, so she says "red". That rule was drawn out by those few enlarged photos.

Joey's round has a detail that is easy to miss. Lin says the rule "green" looks as if it gets a great many photos wrong, but all those mistakes happen on photos that are currently shrunk very small, which are not what Joey is concentrating on; on the photos he mainly sees (two green apples and one tomato enlarged a great deal), the rule makes sense. As for the mistakes it makes, the next round will fix them.

After four rounds, Lin's comment is that this conclusion may not be perfect yet, but it is richer than what each student could have said alone.

### Mapping the roles back to the algorithm

Page 7 of the handout maps the three roles:

| In the story | In the algorithm | How the handout puts it |
|---|---|---|
| Students | Simple hypotheses $g_t$ | simple hypotheses, like vertical/horizontal lines |
| The class | The combined, complex hypothesis $G$ | sophisticated hypothesis, like the black curve in the figure |
| Teacher | A learning algorithm that guides the students | directs the students to focus on key examples |

The figure on the same page is a 2D example: several circles and crosses, a few gray vertical and horizontal lines in the background, and a black piecewise boundary that separates the circles from the crosses completely. Lin says that being allowed to cut only vertical and horizontal lines, with not even a slanted line permitted, is a very weak way to classify, just like those schoolchildren; the black boundary is the result of combining these lines, and it is richer than every one of them. This figure is redrawn round by round where the AdaBoost-Stump demonstration is covered.

Lin defines "key examples" as the examples on which mistakes were made: emphasizing them is what makes the next student find a different line. The rest of the lecture answers the math of this: how much to enlarge, how much to shrink, and how to combine at the end.

### Fun Time: which one helps recognize an apple

**Question (page 8):** Which of the following can help recognize an apple?

1. apples are often circular
2. apples are often red or green
3. apples often have stems at the top
4. all of the above

**Answer: 4.** The handout's solution is one sentence congratulating you on passing first grade. The point of the question is in the wording of the choices: each one says only "often", and using a single one of them alone to classify would make mistakes (in the story, the teacher pointed out mistakes for each of the first three students), yet each one is more useful than random guessing. Choosing 1, 2, or 3 alone leaves out two other rules that are just as useful. "Each one weak, but each better than random guessing" is exactly the only requirement placed on the base algorithm later.

## How to force a different hypothesis: see bootstrap as weights, then design the weights yourself

```youtube
url: https://www.youtube.com/watch?v=pTNKUj_1Dw8
title: Adaptive Boosting :: Diversity by Re-weighting @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–03:03 rewrites bootstrap as weights, 03:03–06:29 discusses how a base algorithm takes weights, 06:29–09:19 is the idea of "making the previous hypothesis look like a coin flip", 09:19–13:35 derives the optimal re-weighting, and Fun Time follows.)

### Bagging is in fact minimizing a weighted error

Page 9 of the handout starts from the previous lecture's bagging. Suppose the original data has four examples, and bootstrap draws example 1 twice, example 2 once, example 4 once, and never draws example 3:

$$
\mathcal{D} = \{(\mathbf{x}_1, y_1), (\mathbf{x}_2, y_2), (\mathbf{x}_3, y_3), (\mathbf{x}_4, y_4)\} \ \xRightarrow{\ \text{bootstrap}\ }\ \tilde{\mathcal{D}}_t = \{(\mathbf{x}_1, y_1), (\mathbf{x}_1, y_1), (\mathbf{x}_2, y_2), (\mathbf{x}_4, y_4)\}
$$

The base algorithm minimizes the 0/1 error on $\tilde{\mathcal{D}}_t$:

$$
E_{\text{in}}^{0/1}(h) = \frac{1}{4}\sum_{(\mathbf{x}, y) \in \tilde{\mathcal{D}}_t} \llbracket y \ne h(\mathbf{x}) \rrbracket
$$

Lin's observation is this: since the two copies of example 1 are identical, we may as well keep the original four examples and use a separate variable $u_n$ to record "how many copies" each one has. Here $u_1 = 2$, $u_2 = 1$, $u_3 = 0$, $u_4 = 1$, and the same thing can be written as a weighted error on the original data $\mathcal{D}$:

$$
E_{\text{in}}^{\mathbf{u}}(h) = \frac{1}{4}\sum_{n=1}^{4} u_n^{(t)} \cdot \llbracket y_n \ne h(\mathbf{x}_n) \rrbracket
$$

The spoken version in the lecture: getting an example with two copies wrong costs two points, and one with a single copy costs one point. The superscript $(t)$ stands for round $t$, because each round's bootstrap draws a different set of $u_n$.

This article checks one case: suppose some $h$ gets only example 1 wrong. In the bootstrapped-data form, two of the four examples in $\tilde{\mathcal{D}}_t$ are wrong, an error rate of $\frac{2}{4}$; in the weighted form it is $\frac{1}{4}(2 \cdot 1 + 1 \cdot 0 + 0 \cdot 0 + 1 \cdot 0) = \frac{2}{4}$. The two forms give the same number.

The handout sums this page up in one sentence: each diverse $g_t$ in bagging is obtained by minimizing the bootstrap-weighted error. The use of this rephrasing is that the weights do not have to be decided by sampling.

### The base algorithm has to take weights

Page 10 of the handout writes the weighted error in general form. What is minimized (a regularization term may be added) is

$$
E_{\text{in}}^{\mathbf{u}}(h) = \frac{1}{N}\sum_{n=1}^{N} u_n \cdot \text{err}(y_n, h(\mathbf{x}_n))
$$

Lin says the weights are integers in bagging, but there is no reason they must be integers: give 10 to an example that is ten times as important, and 0.8 to one that is 0.8 times as important. Lin then asks a question on the students' behalf: earlier algorithms only had to do well on $E_{\text{in}}$, so what do we do now that there is a $u_n$? The handout gives two examples to show that this is usually not hard.

**SVM.** In soft-margin SVM, the cost of each example's margin violation was multiplied by $C$; now the cost of example $n$ is multiplied by $C u_n$. The handout's conclusion is that when solving by dual QP, this amounts to changing the upper bound on $\alpha_n$ from $C$ to $C u_n$:

$$
0 \le \alpha_n \le C u_n
$$

Lin's explanation is: one mistake used to cost $C$ points, and with two copies it now costs $2C$ points; after going through the whole QP derivation, this parameter ends up in the upper limit on $\alpha_n$. This article fills in the step in between (using the derivation in [Techniques Lecture 4: Soft-Margin SVM](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-04-soft-margin-svm-en)): the weighted primal problem minimizes $\frac{1}{2}\mathbf{w}^\top\mathbf{w} + C\sum_n u_n\xi_n$. The term containing $\xi_n$ in the Lagrange function is $(C u_n - \alpha_n - \beta_n)\,\xi_n$, where $\beta_n \ge 0$ is the multiplier of the constraint $\xi_n \ge 0$. Setting the partial derivative with respect to $\xi_n$ to 0 gives $\beta_n = C u_n - \alpha_n$, and then $\beta_n \ge 0$ gives $\alpha_n \le C u_n$. The rest of the dual problem is completely unchanged.

**Logistic regression.** When training with SGD, each step used to pick one example uniformly at random to compute the gradient. The handout's approach is to sample in proportion to $u_n$ instead. The reason given in the lecture: if an example has 10 copies, its chance of being drawn ought to be 10 times everyone else's in the first place. This article adds one line of math: when example $n$ is drawn with probability $u_n / \sum_m u_m$, the expected gradient is $\sum_n \frac{u_n}{\sum_m u_m}\nabla\text{err}_n$, which is proportional to $\nabla\sum_n u_n\,\text{err}_n$, the gradient direction of the weighted error.

At the bottom of the page the handout notes that this kind of learning, where each example carries its own weight (example-weighted learning), is an extension of class-weighted learning in Lecture 8 of ML Foundations. Lin looks back: Foundations Lecture 8 was about which of two kinds of mistake is more serious in fingerprint verification, and the weight followed the class; now the weight follows each individual example. Lin says most of what was learned in that lecture carries over (a note from this article: the approach in that lecture was to think of a high-cost example as copied many times).

From here on, the derivation assumes that the base algorithm $\mathcal{A}$ accepts weights: give it data $\mathcal{D}$ and weights $\mathbf{u}$, and it returns a hypothesis whose weighted error is as small as it can make it.

### Making the previous hypothesis look like a coin flip under the new weights

Page 11 of the handout returns to binary classification and asks how to design the weights to get more diverse hypotheses. The previous lecture concluded that the more the hypotheses differ, the better the combination works. Hypotheses in two neighboring rounds come about like this:

$$
g_t \leftarrow \operatorname*{argmin}_{h \in \mathcal{H}} \left(\sum_{n=1}^{N} u_n^{(t)} \llbracket y_n \ne h(\mathbf{x}_n) \rrbracket\right), \qquad g_{t+1} \leftarrow \operatorname*{argmin}_{h \in \mathcal{H}} \left(\sum_{n=1}^{N} u_n^{(t+1)} \llbracket y_n \ne h(\mathbf{x}_n) \rrbracket\right)
$$

$g_{t+1}$ is the hypothesis with the smallest weighted error under $\mathbf{u}^{(t+1)}$. The handout's reasoning: if $g_t$ is "not good" for $\mathbf{u}^{(t+1)}$, then $g_t$ and the hypotheses that look like $g_t$ will not be returned as $g_{t+1}$, so $g_{t+1}$ will be diverse from $g_t$. Lin puts it this way: $g_t$ is already in hand, so just adjust the weights a little to make it perform badly in the new round, and none of the hypotheses much like it will be picked.

What is the standard for "performing badly" in binary classification? Lin's answer is being no different from flipping a coin. The expected error rate of a coin flip is $\frac{1}{2}$, so the handout writes the goal as: construct $\mathbf{u}^{(t+1)}$ so that the weighted error rate of $g_t$ is exactly one half.

$$
\frac{\sum_{n=1}^{N} u_n^{(t+1)} \llbracket y_n \ne g_t(\mathbf{x}_n) \rrbracket}{\sum_{n=1}^{N} u_n^{(t+1)}} = \frac{1}{2}
$$

The denominator is the total of all the weights; dividing by it converts the weighted error into a proportion.

An addition in this article: why is the target $\frac{1}{2}$, instead of pushing the weighted error rate of $g_t$ higher, to $0.9$ for example? In binary classification, a weighted error rate of $0.9$ for $g_t$ means a weighted error rate of $0.1$ for $-g_t$. If the hypothesis set contains both $h$ and $-h$ (decision stumps do, since the direction $s$ can be positive or negative), the base algorithm would simply pick $-g_t$ in the next round, which is just the same line used the other way around and brings no new information. $\frac{1}{2}$ is the only position where both $g_t$ and $-g_t$ are useless, so the algorithm has to go and find some other hypothesis.

### Optimal re-weighting: the handout's 1126 and 6211

Page 12 of the handout splits that ratio into two pieces. Write $\blacksquare_{t+1}$ for the total, under the new weights, of the examples $g_t$ gets wrong, and $\bullet_{t+1}$ for the total of the ones it gets right (read aloud in the lecture as the square and the circle):

$$
\blacksquare_{t+1} = \sum_{n=1}^{N} u_n^{(t+1)} \llbracket y_n \ne g_t(\mathbf{x}_n) \rrbracket, \qquad \bullet_{t+1} = \sum_{n=1}^{N} u_n^{(t+1)} \llbracket y_n = g_t(\mathbf{x}_n) \rrbracket
$$

Every example is either wrong or right, so the total of all the weights is $\blacksquare_{t+1} + \bullet_{t+1}$, and the goal becomes

$$
\frac{\blacksquare_{t+1}}{\blacksquare_{t+1} + \bullet_{t+1}} = \frac{1}{2} \quad\Longleftrightarrow\quad \blacksquare_{t+1} = \bullet_{t+1}
$$

Why the two are equivalent: cross-multiplying the left side gives $2\blacksquare_{t+1} = \blacksquare_{t+1} + \bullet_{t+1}$, and moving a term over gives the right side. So there is only one thing to do: make the total weight of the incorrect group equal to the total weight of the correct group.

Lin says there are many ways to achieve this, and the handout picks the one that matches enlarging and shrinking photos in the story: multiply each group by its own number. The handout demonstrates with a set of numbers. Suppose that under the current weights $\mathbf{u}^{(t)}$ the incorrect total is 1126 and the correct total is 6211:

| | The incorrect group | The correct group |
|---|---|---|
| Current total weight | $1126$ | $6211$ |
| Share of the whole ($7337$) | $\frac{1126}{7337}$ | $\frac{6211}{7337}$ |
| The handout's approach: multiply each example by | $6211$ | $1126$ |
| New total weight | $1126 \times 6211$ | $6211 \times 1126$ |

Each side is multiplied by the other side's total, so of course the new totals are equal, both $6{,}993{,}586$ (checked for this article). Dividing both by $7337$ works the same way: multiply each incorrect example by $\frac{6211}{7337}$ (the correct rate) and each correct example by $\frac{1126}{7337}$ (the incorrect rate), and both sides become $\frac{1126 \times 6211}{7337} \approx 953.19$.

Now replace the numbers with symbols. Let the weighted error rate of $g_t$ under the current weights be

$$
\epsilon_t = \frac{\sum_{n=1}^{N} u_n^{(t)} \llbracket y_n \ne g_t(\mathbf{x}_n) \rrbracket}{\sum_{n=1}^{N} u_n^{(t)}}
$$

and let $U = \sum_n u_n^{(t)}$. The incorrect group totals $\epsilon_t U$ and the correct group totals $(1 - \epsilon_t)U$. After multiplying each incorrect example by $(1 - \epsilon_t)$ and each correct example by $\epsilon_t$:

$$
\underbrace{\epsilon_t U \cdot (1 - \epsilon_t)}_{\text{incorrect}} \ =\ \underbrace{(1 - \epsilon_t) U \cdot \epsilon_t}_{\text{correct}}
$$

The handout calls this conclusion 'optimal' re-weighting:

> Multiply the incorrect ones by something proportional to $(1 - \epsilon_t)$, and the correct ones by something proportional to $\epsilon_t$.

"Proportional to" means the two multipliers can both be multiplied by the same positive constant, because the two totals then grow together and stay equal. The only thing really determined is the ratio of the two multipliers, $(1 - \epsilon_t) : \epsilon_t$. In the handout's example $\epsilon_t = \frac{1126}{7337} \approx 0.153$, and this ratio is $6211 : 1126 \approx 5.52$: relative to each correct example, the importance of each incorrect example is raised to 5.52 times what it was.

Lin wraps up here: once the two sides are made equal, the original $g_t$ performs badly in the new round and should not be picked by the base algorithm again.

### Fun Time: four examples, one wrong

**Question (page 13):** Four examples, each with $u_n^{(1)} = \frac{1}{4}$. $g_1$ predicts the first example wrongly but all the other three examples correctly. After the 'optimal' re-weighting, what is $u_1^{(2)} / u_2^{(2)}$?

1. $4$
2. $3$
3. $1/3$
4. $1/4$

**Answer: 2.** The weights are all equal, so $\epsilon_1 = \frac{1}{4}$. Example 1 is wrong and is multiplied by something proportional to $1 - \epsilon_1 = \frac{3}{4}$; example 2 is right and is multiplied by something proportional to $\epsilon_1 = \frac{1}{4}$. The two started with the same weight, so the ratio is $\frac{3/4}{1/4} = 3$. In the handout's words, example 1 is now three times more important than every other example.

Check that the goal is met: the new weights are proportional to $(3, 1, 1, 1)$, the incorrect group totals 3, the correct group totals $1 + 1 + 1 = 3$, and the weighted error rate of $g_1$ is $\frac{3}{6} = \frac{1}{2}$.

The other choices: $4$ is $\frac{1}{\epsilon_1}$, which amounts to remembering only that correct examples are multiplied by $\epsilon_1$ while letting the incorrect one be multiplied by 1; the multiplier for incorrect examples is $1 - \epsilon_1$, and the right ratio is $\frac{1 - \epsilon_1}{\epsilon_1}$. $\frac{1}{3}$ has the numerator and denominator swapped, which is $u_2^{(2)} / u_1^{(2)}$; and $\frac{1}{4}$ is $\epsilon_1$ itself. A quick check: an incorrect example should get heavier, so the answer must be greater than 1, and the last two choices can be ruled out directly.

## The AdaBoost algorithm: scaling factor, vote weights, and theoretical guarantee

```youtube
url: https://www.youtube.com/watch?v=vqTXLTYqbbw
title: Adaptive Boosting :: Adaptive Boosting Algorithm @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–02:24 is the scaling factor, 02:24–04:58 is the preliminary algorithm and its two gaps, 04:58–08:00 decides the vote weights, 08:00–10:01 is the full algorithm, 10:01–13:07 is the theoretical guarantee, and Fun Time follows.)

### The scaling factor ◆: multiply the incorrect, divide the correct

The conclusion of optimal re-weighting is two multipliers: multiply the incorrect by $(1 - \epsilon_t)$ and the correct by $\epsilon_t$, with the freedom to multiply both by a constant. Page 14 of the handout picks a constant that makes the formulas symmetric and defines the scaling factor

$$
\blacklozenge_t = \sqrt{\frac{1 - \epsilon_t}{\epsilon_t}}
$$

and then writes the update rule as

$$
\text{incorrect} \leftarrow \text{incorrect} \cdot \blacklozenge_t, \qquad \text{correct} \leftarrow \text{correct} \,/\, \blacklozenge_t
$$

The handout says this is equivalent to optimal re-weighting. The derivation is as follows. Divide both of the original multipliers by $\sqrt{\epsilon_t(1 - \epsilon_t)}$:

$$
\frac{1 - \epsilon_t}{\sqrt{\epsilon_t(1 - \epsilon_t)}} = \sqrt{\frac{1 - \epsilon_t}{\epsilon_t}} = \blacklozenge_t, \qquad \frac{\epsilon_t}{\sqrt{\epsilon_t(1 - \epsilon_t)}} = \sqrt{\frac{\epsilon_t}{1 - \epsilon_t}} = \frac{1}{\blacklozenge_t}
$$

The ratio of the two multipliers is still $\blacklozenge_t \div \frac{1}{\blacklozenge_t} = \blacklozenge_t^2 = \frac{1 - \epsilon_t}{\epsilon_t}$, and Lin also uses this ratio to explain that the two forms have the same effect. A direct check works too: the new total of the incorrect group is $\epsilon_t U \cdot \blacklozenge_t = U\sqrt{\epsilon_t(1 - \epsilon_t)}$ and that of the correct group is $(1 - \epsilon_t)U / \blacklozenge_t = U\sqrt{\epsilon_t(1 - \epsilon_t)}$, and the two are equal.

The benefit of switching to $\blacklozenge_t$ is that it has a direct physical meaning. The handout writes $\blacklozenge_t \ge 1$ if and only if $\epsilon_t \le \frac{1}{2}$:

$$
\blacklozenge_t \ge 1 \iff \frac{1 - \epsilon_t}{\epsilon_t} \ge 1 \iff 1 - \epsilon_t \ge \epsilon_t \iff \epsilon_t \le \frac{1}{2}
$$

Lin adds that $\epsilon_t$ is usually smaller than $\frac{1}{2}$, because $\frac{1}{2}$ is the level of random guessing and there is an algorithm underneath doing the learning, which ought to learn better than random guessing. In that case $\blacklozenge_t > 1$, "multiplying by $\blacklozenge_t$" really enlarges and "dividing by $\blacklozenge_t$" really shrinks, which is what the handout writes as scale up incorrect, scale down correct, the same thing the teacher does in the story. Lin also compares it with [the PLA of Foundations Lecture 2](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm-en): conceptually a bit alike, in that a mistake prompts a correction.

The handout's example $\epsilon_t = \frac{1126}{7337}$ corresponds to $\blacklozenge_t = \sqrt{6211/1126} \approx 2.349$ (computed for this article): multiply each incorrect example by 2.349 and divide each correct example by 2.349.

### Two pieces still missing: the first round's weights, and how to combine at the end

Page 15 of the handout writes what we have so far as a preliminary algorithm, leaving two question marks:

1. $\mathbf{u}^{(1)} = ?$
2. For $t = 1, 2, \dots, T$: obtain $g_t$ by $\mathcal{A}(\mathcal{D}, \mathbf{u}^{(t)})$, where $\mathcal{A}$ tries to minimize the $\mathbf{u}^{(t)}$-weighted 0/1 error; then update $\mathbf{u}^{(t)}$ to $\mathbf{u}^{(t+1)}$ by $\blacklozenge_t$.
3. Return $G(\mathbf{x}) = ?$

**The first round's weights.** The handout's answer is that we want $g_1$ to be 'best' for the original $E_{\text{in}}$, so $u_n^{(1)} = \frac{1}{N}$. When every example has the same weight, the weighted error is the ordinary $E_{\text{in}}$.

**How to combine at the end.** The most intuitive choice is a uniform vote, as in bagging. Next to this option the handout writes "but $g_2$ very bad for $E_{\text{in}}$", with a "why? :-)" attached. Lin's explanation: $g_1$ is chosen under uniform weights and is good for $E_{\text{in}}$; $g_2$ is chosen under weights deliberately made to defeat $g_1$, is very different from $g_1$, and is probably not good for the original $E_{\text{in}}$. Giving a good one and a poor one the same vote may not turn out well.

An addition in this article: "very bad" is a tendency, not a theorem. The only statement this lecture can strictly guarantee is the weighted one: the error rate of $g_t$ under $\mathbf{u}^{(t+1)}$ is $\frac{1}{2}$. In the numerical example later, the error rate of $g_2$ on the original data is $\frac{1}{3}$, the same as that of $g_1$.

The handout goes on to say that combining linearly or non-linearly is up to you (as you wish). Lin's point in the lecture is that once you hold a pile of $g_t$, every kind of blending from the previous lecture can be applied again. But this lecture introduces a special approach: decide the coefficients of the linear combination along the way, while learning the $g_t$. The handout calls it linear aggregation on the fly, and it comes with a theoretical guarantee.

### Deciding the vote weights while learning

Page 16 of the handout adds a third step inside the loop:

$$
\alpha_t = \ln(\blacklozenge_t), \qquad G(\mathbf{x}) = \text{sign}\left(\sum_{t=1}^{T}\alpha_t g_t(\mathbf{x})\right)
$$

Lin explains "on the fly": each time a $g_t$ is decided an $\alpha_t$ is decided too, so both are available when the algorithm finishes, and there is no need to go back and solve a linear blending problem.

The design requirement for $\alpha_t$ is that a good $g_t$ gets more votes. Lin's reasoning: a good $g_t$ has a small $\epsilon_t$, a small $\epsilon_t$ means a large $\blacklozenge_t$, so letting $\alpha_t$ be some monotonically increasing function of $\blacklozenge_t$ meets the requirement. The handout writes $\alpha_t = \text{monotonic}(\blacklozenge_t)$ and then takes the natural logarithm directly. Lin says only that this is a particular choice made by the people who designed the algorithm, and does not explain in this lecture why it is a logarithm; the handout calls it 'magic' linear aggregation. The reason does not appear until [Techniques Lecture 11: Gradient Boosted Decision Trees](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-11-gradient-boosted-decision-tree-en) looks at AdaBoost again from the optimization side.

The handout checks two extremes:

- $\epsilon_t = \frac{1}{2}$: $\blacklozenge_t = 1$, $\alpha_t = \ln 1 = 0$. As Lin puts it, a $g_t$ as bad as a coin flip gets no votes at all, which amounts to keeping it out of $G$.
- $\epsilon_t = 0$: $\blacklozenge_t = \infty$, $\alpha_t = \infty$. $g_t$ brings the weighted error to 0 all by itself, so it gets infinitely many votes and $G$ listens to it entirely.

For the cases in between, this article lists a few numbers (all computed with $\alpha_t = \frac{1}{2}\ln\frac{1 - \epsilon_t}{\epsilon_t}$ and checked in Python):

| $\epsilon_t$ | $\blacklozenge_t$ | $\alpha_t$ |
|---|---|---|
| $0.10$ | $3.000$ | $1.099$ |
| $0.25$ | $1.732$ | $0.549$ |
| $0.40$ | $1.225$ | $0.203$ |
| $0.49$ | $1.020$ | $0.020$ |
| $0.50$ | $1.000$ | $0$ |

When the error rate drops from $0.40$ to $0.10$, the vote weight becomes more than five times what it was; a $g_t$ only slightly better than random guessing ($\epsilon_t = 0.49$) has almost no say.

The same page breaks AdaBoost into three components and maps each back to a role in the story:

| Component | Role | What it does |
|---|---|---|
| Weak base learning algorithm $\mathcal{A}$ | Student | Looks at the weights the teacher has prepared and picks this round's best $g_t$ |
| Optimal re-weighting factor $\blacklozenge_t$ | Teacher | Enlarges the incorrect, shrinks the correct |
| 'Magic' linear aggregation $\alpha_t$ | Class | Combines the $g_t$ into $G$, each weighted by how well it did |

### The full algorithm

Page 17 of the handout is the full version:

1. Initialize $\mathbf{u}^{(1)} = \left[\frac{1}{N}, \frac{1}{N}, \dots, \frac{1}{N}\right]$.
2. For $t = 1, 2, \dots, T$:
   1. Obtain $g_t$ by $\mathcal{A}(\mathcal{D}, \mathbf{u}^{(t)})$, where $\mathcal{A}$ tries to minimize the $\mathbf{u}^{(t)}$-weighted 0/1 error.
   2. Compute $\epsilon_t$ and $\blacklozenge_t$, and update $\mathbf{u}^{(t)}$ to $\mathbf{u}^{(t+1)}$: for incorrect examples $u_n^{(t+1)} \leftarrow u_n^{(t)} \cdot \blacklozenge_t$, for correct examples $u_n^{(t+1)} \leftarrow u_n^{(t)} / \blacklozenge_t$.
   3. Compute $\alpha_t = \ln(\blacklozenge_t)$.
3. Return $G(\mathbf{x}) = \text{sign}\left(\sum_{t=1}^{T}\alpha_t g_t(\mathbf{x})\right)$.

where

$$
\blacklozenge_t = \sqrt{\frac{1 - \epsilon_t}{\epsilon_t}}, \qquad \epsilon_t = \frac{\sum_{n=1}^{N} u_n^{(t)} \llbracket y_n \ne g_t(\mathbf{x}_n) \rrbracket}{\sum_{n=1}^{N} u_n^{(t)}}
$$

This article adds two details you run into when implementing it. First, the weights do not need to be normalized to sum to 1: $\epsilon_t$ is a ratio, so multiplying all $u_n$ by the same constant leaves $\epsilon_t$, $\blacklozenge_t$, $\alpha_t$, and "which hypothesis has the smallest weighted error" unchanged. The hand computation later uses this to write the weights as integer ratios. Second, if $\epsilon_t = 0$ in some round, $\blacklozenge_t$ divides by 0 and the program has to handle that case separately; here $g_t$ classifies the weighted data perfectly all by itself, and by the handout's account it should get infinitely many votes.

Lin mentions in the lecture that AdaBoost has a Chinese name meaning roughly "the cobblers' method", after a proverb that three cobblers together outdo one Zhuge Liang, a famous strategist; the summary on the last page of the handout uses the English saying two heads are better than one. The property of making weak $g_t$ strong is called boosting, and at the bottom of this page the handout writes that AdaBoost has a provable boosting property.

### Theoretical guarantee: both terms can be made small

Page 18 of the handout applies the VC bound from Foundations to $G$:

$$
E_{\text{out}}(G) \le E_{\text{in}}(G) + O\left(\sqrt{\underbrace{O\big(d_{\text{VC}}(\mathcal{H}) \cdot T\log T\big)}_{d_{\text{VC}} \text{ of all possible } G} \cdot \frac{\log N}{N}}\right)
$$

The first term on the right is how $G$ does on the training data, and the second is the price of model complexity. Lin explains where the second term comes from: $d_{\text{VC}}(\mathcal{H})$ is the complexity of the hypothesis set that a single $g_t$ lives in, and when $T$ of them are combined, the overall VC dimension can be proved to be roughly $T\log T$ times that; the rest is the standard form of the VC bound. Lin says explicitly that the detailed proof is not done here.

The handout draws one conclusion for each term:

- **The first term can be small.** If $\epsilon_t \le \epsilon < \frac{1}{2}$ always holds, then $E_{\text{in}}(G) = 0$ after $T = O(\log N)$ iterations. Lin says this is a result proved by the original authors.
- **The second term can be small.** The overall $d_{\text{VC}}$ grows "slowly" with $T$. As Lin puts it, $T$ only needs to be about $\log N$, so once the amount of data $N$ is large enough the whole second term is small too.

With both terms small, $E_{\text{out}}(G)$ is small. The handout calls this conclusion the boosting view of AdaBoost:

> If $\mathcal{A}$ is weak but always slightly better than random ($\epsilon_t \le \epsilon < \frac{1}{2}$), then (AdaBoost + $\mathcal{A}$) can be strong ($E_{\text{in}} = 0$ and $E_{\text{out}}$ small).

Lin's way of saying it: we ask only a little of the algorithm underneath, namely being slightly better than random guessing, and AdaBoost can make it stronger and stronger, strong enough that $E_{\text{in}}$ is 0 and $E_{\text{out}}$ is guaranteed as well.

An addition in this article: note that the $\epsilon$ in the condition is a fixed number smaller than $\frac{1}{2}$, and no round's $\epsilon_t$ may exceed it. $\epsilon_t$ is measured under weights that get trickier and trickier, so this condition is not an easy one: it requires the base algorithm to come up with a hypothesis better than random guessing no matter what weights it faces.

### An addition in this article: where the O(log N) iterations come from

What follows is not on this lecture's handout and is not done in the lecture either. It is written here to give the phrase "$T = O(\log N)$" on page 18 of the handout a source. The whole argument rests on three facts. The first is a proof problem in the Fall 2024 homework (see the exercises at the end), so only the conclusion and the intuition are given here and the proof is left to you; this article works through the other two.

**Fact one (conclusion only): the total weight is multiplied by a number smaller than 1 in every round.** Let $U_t = \sum_n u_n^{(t)}$. After each round's update,

$$
U_{t+1} = U_t \cdot 2\sqrt{\epsilon_t(1 - \epsilon_t)}
$$

When $\epsilon_t \ne \frac{1}{2}$, $2\sqrt{\epsilon_t(1 - \epsilon_t)} < 1$, so the total weight keeps shrinking. This factor depends only on $\epsilon_t$: the better $g_t$ is (the smaller $\epsilon_t$), the faster it shrinks, and the closer $\epsilon_t$ is to $\frac{1}{2}$, the closer the factor is to 1. You can check the numbers against the six-fruit-photo example later: the three rounds' $\epsilon_t$ are $\frac{1}{3}, \frac{1}{4}, \frac{1}{6}$, the factors are $0.943, 0.866, 0.745$, and the total weight goes $1 \to 0.943 \to 0.816 \to 0.609$.

**Fact two: each example's final weight records the votes it received.** $y_n$ and $g_t(\mathbf{x}_n)$ are both $\pm 1$; when the prediction is right $y_n g_t(\mathbf{x}_n) = +1$, and when it is wrong the product is $-1$. So "multiply the incorrect by $\blacklozenge_t$, divide the correct by $\blacklozenge_t$" can be written as a single formula:

$$
u_n^{(t+1)} = u_n^{(t)} \cdot \blacklozenge_t^{-y_n g_t(\mathbf{x}_n)} = u_n^{(t)} \cdot \exp\big(-y_n\alpha_t g_t(\mathbf{x}_n)\big)
$$

The second equality uses $\blacklozenge_t = e^{\alpha_t}$. Starting from $u_n^{(1)} = \frac{1}{N}$ and multiplying through $T$ rounds:

$$
u_n^{(T+1)} = \frac{1}{N}\exp\left(-y_n\sum_{t=1}^{T}\alpha_t g_t(\mathbf{x}_n)\right)
$$

The sum in the exponent is exactly the score of $G$ before taking the sign. Here the choice of the logarithm shows a little of its purpose: it ties the weights directly to the voting score. The handout of Techniques Lecture 11 writes down the same formula and looks at AdaBoost again starting from it.

**Fact three: the total weight bounds $E_{\text{in}}(G)$.** If $G$ misclassifies example $n$, $y_n$ and the score have opposite signs (or the score is 0), the quantity in the exponent is greater than or equal to 0, and so $u_n^{(T+1)} \ge \frac{1}{N}$. Every example misclassified by $G$ contributes at least $\frac{1}{N}$, so

$$
E_{\text{in}}(G) = \frac{\text{number of errors}}{N} \le \sum_{n=1}^{N} u_n^{(T+1)} = U_{T+1}
$$

**Putting it together.** $U_1 = 1$; now multiply the conclusion of fact one through $T$ rounds. The function $x(1 - x)$ is increasing on $0 \le x \le \frac{1}{2}$, so $\epsilon_t \le \epsilon$ means every factor is at most $2\sqrt{\epsilon(1 - \epsilon)}$:

$$
E_{\text{in}}(G) \le U_{T+1} = \prod_{t=1}^{T} 2\sqrt{\epsilon_t(1 - \epsilon_t)} \le \Big(2\sqrt{\epsilon(1 - \epsilon)}\Big)^T
$$

Let $r = 2\sqrt{\epsilon(1 - \epsilon)}$, a constant smaller than 1. $E_{\text{in}}(G)$ can only be an integer multiple of $\frac{1}{N}$, so as soon as $r^T < \frac{1}{N}$, $E_{\text{in}}(G)$ can only be 0. Solving for $T$:

$$
r^T < \frac{1}{N} \iff T > \frac{\ln N}{\ln(1/r)}
$$

The denominator is a constant that depends only on $\epsilon$, so $T = O(\log N)$. For example, with $\epsilon = 0.4$ we get $r \approx 0.9798$, and $N = 1000$ needs $T > 338.4$, so 339 rounds guarantee $E_{\text{in}}(G) = 0$. This is an upper bound meant as a guarantee; in practice it often happens much earlier.

### Fun Time: when is α positive

**Question (page 19):** According to $\alpha_t = \ln(\blacklozenge_t)$ and $\blacklozenge_t = \sqrt{\frac{1 - \epsilon_t}{\epsilon_t}}$, when would $\alpha_t > 0$?

1. $\epsilon_t < \frac{1}{2}$
2. $\epsilon_t > \frac{1}{2}$
3. $\epsilon_t \ne 1$
4. $\epsilon_t \ne 0$

**Answer: 1.** $\ln$ is positive when its argument is greater than 1, so $\alpha_t > 0 \iff \blacklozenge_t > 1 \iff \frac{1 - \epsilon_t}{\epsilon_t} > 1 \iff \epsilon_t < \frac{1}{2}$. The handout's solution says the math part should be easy and the interesting part is the physical meaning: $g_t$ is useful for $G$ (its vote weight is positive) if and only if its weighted error rate is better than random.

The other choices: choice 2 has the direction reversed; when $\epsilon_t > \frac{1}{2}$, $\blacklozenge_t < 1$ and $\alpha_t$ is negative. Choices 3 and 4 both include cases where $\alpha_t$ is not positive; for example $\epsilon_t = 0.7$ is neither 1 nor 0, yet $\alpha_t = \ln\sqrt{3/7} \approx -0.424$.

An addition in this article: a negative $\alpha_t$ does not mean $g_t$ is useless. A $g_t$ with $\epsilon_t = 0.7$ has an error rate of $0.3$ when used the other way around, and the negative vote weight flips it in exactly that way. This is the same reasoning as in the previous lecture, where linear blending could drop the constraint $\alpha_t \ge 0$. The only truly useless case is $\epsilon_t = \frac{1}{2}$.

## Running it for real: decision stumps, two demonstrations, and face detection

```youtube
url: https://www.youtube.com/watch?v=5wPN87bwoaE
title: Adaptive Boosting :: Adaptive Boosting in Action @ Machine Learning Techniques (機器學習技法)
```

(Video 00:00–02:18 is the decision stump, 02:18–05:05 is the round-by-round demonstration on simple data, 05:05–06:35 is the complicated data, 06:35–08:47 is face detection, 08:47–09:14 is Fun Time, followed by the summary and a preview of the next lecture.)

### A weak base algorithm: the decision stump

AdaBoost needs a weak base algorithm $\mathcal{A}$. The requirement on page 20 of the handout is that it minimizes the weighted error $E_{\text{in}}^{\mathbf{u}}(h) = \frac{1}{N}\sum_n u_n \cdot \llbracket y_n \ne h(\mathbf{x}_n) \rrbracket$ "a little bit". A popular choice is the decision stump, which the handout reminds you appeared in ML Foundations Homework 2:

$$
h_{s,i,\theta}(\mathbf{x}) = s \cdot \text{sign}(x_i - \theta)
$$

It has three parameters: which feature $i$ to look at, where the threshold $\theta$ cuts, and the direction $s \in \{+1, -1\}$ (whether the right side of the threshold is judged positive or negative). The handout calls it positive and negative rays on some feature. Lin's description: on each dimension it is like a perceptron that looks only at that dimension, cutting once so that one side is positive and the other negative. In the 2D plane it is the vertical or horizontal line in the figure on page 7 of the handout.

The handout says it is efficient to optimize, in $O(d \cdot N\log N)$ time, where $d$ is the number of features. Lin's reasons come in two layers. First, on the data these three parameters really have only finitely many combinations, and searching through all of them finds the best one, so the decision stump is one of the few hypothesis sets for which $E_{\text{in}}$ can truly be minimized, and the same goes for the weighted version. Second, sorting the data on each feature first and being a little clever in the computation gets it down to $O(d \cdot N\log N)$; Lin leaves the details to interested students.

This article fills in that clever part. For a single feature $i$: sort the $N$ examples by $x_i$, which costs $O(N\log N)$. The threshold produces a different split only when it sits between two neighboring examples (or outside all the data), so there are at most $N$ candidate values of $\theta$. Move $\theta$ from the far left to the right one slot at a time; each move switches just one example from the right of the threshold to the left, so the weighted error only needs that example's $u_n$ added or subtracted, which is $O(1)$. The weighted error for $s = -1$ equals the total weight minus the weighted error for $s = +1$, so no separate scan is needed. Each feature therefore costs only $O(N)$ after sorting, and $d$ features cost $O(d \cdot N\log N)$ in total.

The handout's overall verdict on the decision stump: it allows efficient minimization of $E_{\text{in}}^{\mathbf{u}}$ but is perhaps too weak to work by itself. Lin says it can only make vertical and horizontal cuts, which is not enough on its own most of the time; now that we have AdaBoost, being weak is fine. The combination of the two is called AdaBoost-Stump.

### A numerical example: three rounds by hand on six fruit photos

What follows is an example made up for this article, not from the slides, and all the numbers were computed in Python (the program is at the end of this subsection). It continues the apple story but reduces each photo to one feature.

**Data.** Six photos, with feature $x$ a color level, 1 the greenest and 6 the reddest. Two green apples sit at the green end, two red apples at the red end, and a banana and an orange are in the middle:

| $n$ | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| $x_n$ | 1 | 2 | 3 | 4 | 5 | 6 |
| Photo | green apple | green apple | banana | orange | red apple | red apple |
| $y_n$ | $+1$ | $+1$ | $-1$ | $-1$ | $+1$ | $+1$ |

**Candidate hypotheses.** With a single feature, the decision stump is $h(x) = s \cdot \text{sign}(x - \theta)$. Put the threshold at the six positions $0.5, 1.5, \dots, 5.5$, each with two directions, for 12 different rules in total. Each rule can cut only once, and the right answer is "apples at both ends, not in the middle", so none of them gets everything right. The three below are the ones that actually get used; in these three rounds the other nine each have a higher weighted error rate than the rule chosen in that round:

| Label | Parameters | In plain words | Predictions ($n = 1$ to $6$) | Which examples it gets wrong |
|---|---|---|---|---|
| A | $s = +1$, $\theta = 0.5$ | Everything is an apple | $+ + + + + +$ | 3, 4 |
| B | $s = -1$, $\theta = 2.5$ | The greener ones are apples | $+ + - - - -$ | 5, 6 |
| C | $s = +1$, $\theta = 4.5$ | The redder ones are apples | $- - - - + +$ | 1, 2 |

On a tie, the convention is to take the rule with the smaller $\theta$.

**Round 1.** $u_n^{(1)} = \frac{1}{6}$, the same weight for every example. A, B, and C each get two examples wrong, a weighted error rate of $\frac{2}{6} = \frac{1}{3}$, the lowest among the 12. By the convention we take A: $g_1 = $ A.

$$
\epsilon_1 = \frac{1}{3}, \qquad \blacklozenge_1 = \sqrt{\frac{2/3}{1/3}} = \sqrt{2} \approx 1.414, \qquad \alpha_1 = \ln\sqrt{2} \approx 0.347
$$

Update: examples 3 and 4 are wrong and are multiplied by $\sqrt{2}$, becoming $\frac{1}{6}\sqrt{2} \approx 0.2357$; the other four are divided by $\sqrt{2}$, becoming $\approx 0.1179$. The ratio of the two is $\blacklozenge_1^2 = 2$, so the new weights are proportional to $(1, 1, 2, 2, 1, 1)$. Check: the incorrect group totals $2 + 2 = 4$, the correct group totals $1 + 1 + 1 + 1 = 4$, and the error rate of A under the new weights is exactly $\frac{1}{2}$.

**Round 2.** The weights are proportional to $(1, 1, 2, 2, 1, 1)$, with total 8.

- A gets 3 and 4 wrong: $\frac{2 + 2}{8} = \frac{1}{2}$. The previous round's winner is now the same as a coin flip.
- B gets 5 and 6 wrong: $\frac{1 + 1}{8} = \frac{1}{4}$.
- C gets 1 and 2 wrong: $\frac{1 + 1}{8} = \frac{1}{4}$.

B and C tie, and we take B with the smaller $\theta$: $g_2 = $ B.

$$
\epsilon_2 = \frac{1}{4}, \qquad \blacklozenge_2 = \sqrt{3} \approx 1.732, \qquad \alpha_2 = \ln\sqrt{3} \approx 0.549
$$

Update: examples 5 and 6 are multiplied by $\sqrt{3}$ and the rest divided by $\sqrt{3}$, so the ratio between the incorrect and correct multipliers is 3. The original $(1, 1, 2, 2, 1, 1)$ becomes proportional to $(1, 1, 2, 2, 3, 3)$. Check: the examples B gets wrong total $3 + 3 = 6$, and the ones it gets right total $1 + 1 + 2 + 2 = 6$.

**Round 3.** The weights are proportional to $(1, 1, 2, 2, 3, 3)$, with total 12.

- A gets 3 and 4 wrong: $\frac{4}{12} = \frac{1}{3}$.
- B gets 5 and 6 wrong: $\frac{6}{12} = \frac{1}{2}$. This time it is B's turn to become a coin flip.
- C gets 1 and 2 wrong: $\frac{2}{12} = \frac{1}{6}$.

$g_3 = $ C.

$$
\epsilon_3 = \frac{1}{6}, \qquad \blacklozenge_3 = \sqrt{5} \approx 2.236, \qquad \alpha_3 = \ln\sqrt{5} \approx 0.805
$$

**Combining.** $G(x) = \text{sign}\big(0.347\,g_1(x) + 0.549\,g_2(x) + 0.805\,g_3(x)\big)$:

| $x$ | $y$ | $g_1$ | $g_2$ | $g_3$ | Score | $G$ |
|---|---|---|---|---|---|---|
| 1, 2 | $+1$ | $+$ | $+$ | $-$ | $0.347 + 0.549 - 0.805 = 0.091$ | $+1$ |
| 3, 4 | $-1$ | $+$ | $-$ | $-$ | $0.347 - 0.549 - 0.805 = -1.007$ | $-1$ |
| 5, 6 | $+1$ | $+$ | $-$ | $+$ | $0.347 - 0.549 + 0.805 = 0.602$ | $+1$ |

All six are right, $E_{\text{in}}(G) = 0$. The exact values of the three scores are $\ln\sqrt{6/5}$, $-\ln\sqrt{15/2}$, and $\ln\sqrt{10/3}$.

The three rounds side by side:

| $t$ | $g_t$ | $\epsilon_t$ | $\blacklozenge_t$ | $\alpha_t$ | Weights after the update (proportional to) | Total weight after the update $U_{t+1}$ | $E_{\text{in}}$ of the first $t$ combined |
|---|---|---|---|---|---|---|---|
| 1 | A | $1/3$ | $1.414$ | $0.347$ | $(1, 1, 2, 2, 1, 1)$ | $0.943$ | $2/6$ |
| 2 | B | $1/4$ | $1.732$ | $0.549$ | $(1, 1, 2, 2, 3, 3)$ | $0.816$ | $2/6$ |
| 3 | C | $1/6$ | $2.236$ | $0.805$ | $(5, 5, 2, 2, 3, 3)$ | $0.609$ | $0$ |

**What this result means.**

- $G$ says "the very green or very red ones are apples", a rule that takes two cuts, which none of the 12 decision stumps can do. Three rules that are each wrong on a third of the data get everything right once combined, and that is boosting.
- The rule chosen in each round is certain to have a weighted error rate of exactly $\frac{1}{2}$ in the next round (A in round 2, B in round 3), so the base algorithm will not choose the same rule two rounds in a row. This is the design goal of optimal re-weighting, and it is directly visible in the numbers.
- $\epsilon_t$ getting smaller round after round ($\frac{1}{3}, \frac{1}{4}, \frac{1}{6}$) is just a coincidence of this data and does not happen in general; but all three rules have an error rate of $\frac{1}{3}$ on the original data and still get different vote weights, because the vote weight reflects performance under the weights at that time.
- A, "everything is an apple", looks like the emptiest rule, yet it cannot be left out. Without it, the score at $x = 1, 2$ is $0.549 - 0.805 = -0.255$, which would be misclassified. Its role in the vote is like a constant term that pushes the overall score in the positive direction.
- The $E_{\text{in}}$ of the first two combined makes no progress ($\alpha_2 > \alpha_1$, so with only two, $G$ is just $g_2$), and it drops to 0 only in the third round. $E_{\text{in}}(G)$ is not guaranteed to decrease in every round; what decreases all the way is the total weight, $1 \to 0.943 \to 0.816 \to 0.609$, multiplied by $2\sqrt{\epsilon_t(1 - \epsilon_t)}$ in each round, and it stays above $E_{\text{in}}(G)$ throughout, consistent with the derivation added earlier.
- In this example a uniform vote among the three rules happens to get everything right too, so it does not show a case where "one vote each breaks down"; what it shows is how re-weighting forces out three different rules.

The program used for checking (pure Python):

```python
from math import sqrt, log

X = [1, 2, 3, 4, 5, 6]
Y = [+1, +1, -1, -1, +1, +1]
N = len(X)

def stump(s, theta):
    return lambda x: s * (1 if x > theta else -1)

# 6 thresholds, two directions each, 12 stumps in total; ties go to the earlier one
candidates = [(s, th) for th in [0.5, 1.5, 2.5, 3.5, 4.5, 5.5] for s in (+1, -1)]

u = [1 / N] * N
score = [0.0] * N
for t in range(1, 4):
    def eps_of(c):
        h = stump(*c)
        return sum(un for un, x, y in zip(u, X, Y) if h(x) != y) / sum(u)
    best = min(candidates, key=eps_of)
    eps = eps_of(best)
    dia = sqrt((1 - eps) / eps)
    alpha = log(dia)
    g = stump(*best)
    u = [un * dia if g(x) != y else un / dia for un, x, y in zip(u, X, Y)]
    score = [sc + alpha * g(x) for sc, x in zip(score, X)]
    e_in = sum((1 if sc > 0 else -1) != y for sc, y in zip(score, Y)) / N
    print(t, best, round(eps, 4), round(dia, 4), round(alpha, 4),
          [round(un, 4) for un in u], round(sum(u), 4), round(e_in, 4))
```

The three output lines list, in order, the round, the chosen $(s, \theta)$, $\epsilon_t$, $\blacklozenge_t$, $\alpha_t$, the six weights after the update, the total weight, and $E_{\text{in}}(G)$:

```text
1 (1, 0.5) 0.3333 1.4142 0.3466 [0.1179, 0.1179, 0.2357, 0.2357, 0.1179, 0.1179] 0.9428 0.3333
2 (-1, 2.5) 0.25 1.7321 0.5493 [0.068, 0.068, 0.1361, 0.1361, 0.2041, 0.2041] 0.8165 0.3333
3 (1, 4.5) 0.1667 2.2361 0.8047 [0.1521, 0.1521, 0.0609, 0.0609, 0.0913, 0.0913] 0.6086 0.0
```

### The handout's demonstration: five cuts on ten points

Page 21 of the handout plays AdaBoost-Stump round by round on a small 2D data set, in which you can count 5 circles and 5 crosses. In each picture, the size of a point stands for its weight after that round's update, the dashed line is the cut newly made in this round, and the thick black line is the current boundary of $G$. In the first two pictures the black line lies on top of the new cut, and only from the $t = 3$ picture on can you see it turn. The table below is compiled from the slide's pictures and the explanation in the lecture; the directions and the misclassified points in the $t = 4$ and $t = 5$ rows were read off the pictures for this article:

| Picture | This cut | Which points this cut gets wrong (enlarged in the next picture) |
|---|---|---|
| $t = 1$ | A vertical line toward the left; crosses on its right, circles on its left | The three circles to the right of the line |
| $t = 2$ | A vertical line toward the right; crosses on its right, circles on its left | The four crosses to the left of the line |
| $t = 3$ | A horizontal line toward the bottom; crosses above, circles below | The big circle at the upper right, the cross at the lower right, and the two circles on the left |
| $t = 4$ | A horizontal line at mid height; circles above, crosses below | The topmost cross and the two circles at the bottom |
| $t = 5$ | A horizontal line toward the top; crosses above, circles below | The four crosses below the line; but the combined $G$ already classifies everything correctly |

Lin walks through it step by step: at first all circles and crosses are the same size, the decision stump makes the first cut, three circles are misclassified, and AdaBoost multiplies them by $\blacklozenge_t$ to enlarge them and shrinks the others. Because those three circles are large, the second cut tends to get them right, at the price of sacrificing a few crosses, so the crosses are enlarged. After the third cut, the three cuts voting with their own $\alpha_t$ already form a non-linear boundary that turns. By the fifth cut, $G$ separates all the circles and crosses. Lin also points out that one cross and one circle in the picture appear to sit on the boundary, which is a visual effect of the enlarging and shrinking; both are really on the correct side.

This article works out the numbers for the first two cuts: 10 examples with equal weights and 3 wrong on the first cut give $\epsilon_1 = 0.3$, $\blacklozenge_1 = \sqrt{7/3} \approx 1.528$, $\alpha_1 \approx 0.424$. The three misclassified circles are each multiplied by 1.528 and the seven correct points each divided by 1.528, so the ratio of the per-example weights is $\frac{7}{3}$; the three circles total $3 \times 7 = 21$, equal to the seven points' total $7 \times 3 = 21$. Under these weights (total 42) the second cut gets four crosses wrong, $\epsilon_2 = \frac{4 \times 3}{42} = \frac{2}{7}$, $\alpha_2 = \ln\sqrt{5/2} \approx 0.458$. $\alpha_2 > \alpha_1$, so with only two cuts $G$ equals the second cut, which is why the black line coincides with the new cut in both of the first two pictures.

The $G$ in the last picture is the very figure used for the motivation on page 7 of the handout. At the bottom of this page the handout writes 'Teacher'-like algorithm works!, and Lin says that the teaching model of a teacher and students is not just imagination; it can really be built with an algorithm like AdaBoost.

### Slightly more complicated data: a hundred cuts

Page 22 of the handout switches to a data set with more points, where the boundary between circles and crosses looks to the eye like a sine wave. What the handout prints is the $t = 100$ picture: many gray vertical and horizontal lines in the background, and a black boundary that is a staircase-like piecewise line roughly following that wave.

In the lecture Lin plays it from 10 cuts all the way to 100: at 10 cuts a rough shape is already there, at 20 and 30 cuts it gets finer and finer, $E_{\text{in}}$ may not have reached 0 but is already small, and the next few dozen cuts are mostly fine-tuning. Lin draws two conclusions. First, this is a non-linear model: cut after cut is pieced together and the boundary keeps improving. Second, it is efficient: compared with kernel SVM, there is no need to transform the data into another space and then solve a quadratic program; a hundred cuts carve out the boundary. The handout's slogan is AdaBoost-Stump: non-linear yet efficient.

### Application: real-time face detection

The example on page 23 of the handout is a system it calls The World's First 'Real-Time' Face Detection Program, with AdaBoost-Stump as its core model. Lin explains what "real-time" means: video runs at about 30 frames per second, and all the faces in a frame have to be found at that speed. The handout lists two points:

- **Feature selection.** In 24x24 images there are 162,336 possible small-patch patterns that can serve as features. Each decision stump looks at only one feature, so when AdaBoost-Stump finishes it has in effect picked the key few out of these more than 160,000 and combined them linearly. Lin's description: cut the image into many tiny pieces (usually called patches), find which pieces carry the key patterns, and then use AdaBoost to integrate their information. The handout's wording is feature selection achieved through AdaBoost-Stump.
- **Efficiency.** The above alone is not enough for real time. Lin points out that in a large image only a few positions contain a face and most positions do not. So this program modifies the linear aggregation $G$: partway through the vote, if the score is already very low, it decides right away that this is not a face and stops computing; only positions that might be a face get the whole $G$ computed. What the handout writes is modified linear aggregation $G$ to rule out non-face earlier.

An addition in this article: the handout does not give this system's name; it is generally known as the Viola–Jones face detector.

The handout's summary of this page: AdaBoost-Stump achieves efficient feature selection and aggregation at once.

### Fun Time: how many features are used

**Question (page 24):** For a data set of size 9876 that contains $\mathbf{x}_n \in \mathbb{R}^{5566}$, after running AdaBoost-Stump for 1126 iterations, what is the number of distinct features within $\mathbf{x}$ that are effectively used by $G$?

1. $0 \le \text{number} \le 1126$
2. $1126 < \text{number} \le 5566$
3. $5566 < \text{number} \le 9876$
4. $9876 < \text{number}$

**Answer: 1.** Each decision stump takes only one feature, 1126 rounds make 1126 stumps, and they need at most 1126 distinct features. Lin gives the same one-sentence reason in the lecture.

This article adds why the other choices are impossible: choice 2 needs more than 1126 features, but there are only 1126 stumps; choices 3 and 4 go beyond the total number of features, 5566. The real number is usually smaller than 1126, because different rounds can pick the same feature and cut at different thresholds. The 9876 in the question (the number of examples) does not affect the answer. This question is the numerical version of "feature selection" in the previous subsection: of the 5566 features, at least 4440 are never used by $G$ at all.

### Summary of this lecture and the next one

Page 25 of the handout sums up each of the four sections in one line:

| Section | The handout's one line |
|---|---|
| Motivation of Boosting | aggregate weak hypotheses for strength |
| Diversity by Re-weighting | scale up incorrect, scale down correct |
| Adaptive Boosting Algorithm | two heads are better than one, theoretically |
| Adaptive Boosting in Action | AdaBoost-Stump useful and efficient |

At the end of the lecture Lin places these two lectures side by side: bagging is uniform aggregation, AdaBoost is linear aggregation, and the next lecture introduces conditional aggregation.

## Self-check

**1. Five examples, $u_n^{(1)} = \frac{1}{5}$. $g_1$ gets two of them wrong. Compute $\epsilon_1$, $\blacklozenge_1$, $\alpha_1$, and each example's $u_n^{(2)}$, and verify that the error rate of $g_1$ under the new weights is $\frac{1}{2}$.**

Answer: $\epsilon_1 = \frac{2}{5}$, $\blacklozenge_1 = \sqrt{(3/5)/(2/5)} = \sqrt{1.5} \approx 1.225$, $\alpha_1 = \ln 1.225 \approx 0.203$. The two incorrect examples are each $0.2 \times 1.225 \approx 0.245$, and the three correct ones are each $0.2 / 1.225 \approx 0.163$. The incorrect total is $2 \times 0.245 = 0.490$ and the correct total is $3 \times 0.163 = 0.490$, which are equal.

**2. Continue the six-fruit-photo example. After the round 3 update the weights are proportional to $(5, 5, 2, 2, 3, 3)$. In round 4, what are the weighted error rates of A, B, and C? Which is chosen? What is $\alpha_4$? Is $G$ still entirely correct after adding it?**

Answer: the total is 20. A gets 3 and 4 wrong: $\frac{4}{20} = \frac{1}{5}$; B gets 5 and 6 wrong: $\frac{6}{20} = \frac{3}{10}$; C gets 1 and 2 wrong: $\frac{10}{20} = \frac{1}{2}$ (the previous round's winner). Choose A, $\blacklozenge_4 = \sqrt{4} = 2$, $\alpha_4 = \ln 2 \approx 0.693$. A votes $+1$ for every $x$, so each of the three scores gains $0.693$: $0.784$, $-0.314$, $1.295$. The signs do not change, and $G$ is still entirely correct. The same rule can be chosen again in non-adjacent rounds.

**3. In some round the base algorithm returns a $g_t$ whose weighted error rate is exactly $\frac{1}{2}$. What are this round's $\blacklozenge_t$ and $\alpha_t$? How do the weights change? What happens afterward?**

Criteria: the answer should state $\blacklozenge_t = 1$, $\alpha_t = 0$, and that the weights do not change at all; in the next round the base algorithm faces the same weights, and if it is deterministic it returns the same $g_t$, so the algorithm is stuck in place from then on. It should also connect back to the condition of the theoretical guarantee: this is exactly the case where "$\epsilon_t \le \epsilon < \frac{1}{2}$ in every round" is violated.

**4. Why not a uniform vote at the end, and why use $\alpha_t$ instead? Why should a $g_t$ with $\epsilon_t = \frac{1}{2}$ get 0 votes, while a $g_t$ with $\epsilon_t = 0.7$ does not get 0 votes?**

Criteria: the first part should mention that the hypotheses from $g_2$ on are chosen under deliberately distorted weights and are not necessarily good for the original $E_{\text{in}}$, so they should get different vote weights according to how they perform. The second part should compute that at $\epsilon_t = 0.7$, $\blacklozenge_t = \sqrt{3/7} \approx 0.655$ and $\alpha_t \approx -0.424$, and explain that a negative vote amounts to using $g_t$ the other way around, with an error rate of $0.3$ when reversed; $\frac{1}{2}$ is the only position where neither side carries information.

**5. Use the upper bound added in this article: $N = 1000$, and $\epsilon_t \le 0.4$ in every round. After at most how many rounds is $E_{\text{in}}(G) = 0$ guaranteed? What if the base algorithm is weaker and can only guarantee $\epsilon_t \le 0.45$?**

Answer: with $\epsilon = 0.4$, $r = 2\sqrt{0.24} \approx 0.9798$ and $T > \frac{\ln 1000}{\ln(1/r)} \approx 338.4$, so 339 rounds. With $\epsilon = 0.45$, $r = 2\sqrt{0.2475} \approx 0.99499$ and $T > 1374.6$, so 1375 rounds. The closer the base algorithm is to random guessing, the faster the required number of rounds grows, but the dependence on $N$ is still only $\ln N$: when $N$ goes from 1000 to 1,000,000, the number of rounds only doubles.

## Exercises and corresponding reading

**The corresponding weeks in two semesters.** The [Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) covers Techniques Lectures 8 through 11 in one go in W12 (11/18), and the slide code for this lecture is [208u](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/208u_handout.pdf). The [Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) puts Lectures 7 and 8 in W11 (11/18); the 208u slides for that week were not yet online when checked on 2026-09-30, so this article uses only the MOOC handout.

**Textbook.** Neither course page marks a chapter of [Learning from Data](http://amlbook.com) (LFD) for this lecture. The further reading listed on the course page is [A Short Introduction to Boosting by Freund and Schapire](https://cseweb.ucsd.edu/~yfreund/papers/IntroToBoosting.pdf), an introduction written by AdaBoost's own authors.

**Homework.** The problems in [Fall 2024 HW7](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf) (released 2024-12-02, due 12-16) that relate directly to this lecture are listed below; there are no official solutions:

| Problem | Type | What it practices |
|---|---|---|
| Q3 | Auto-graded | 87% of the data are negative examples and $g_1$ returns the constant $-1$; the question asks for the weight ratio between positive and negative examples in the second round. The method is the same as in the Fun Time "four examples, one wrong": compute $\epsilon_1$ first, then look at the ratio between the incorrect and correct multipliers |
| Q6 | Human-graded | Prove $U_{t+1}/U_t = 2\sqrt{\epsilon_t(1 - \epsilon_t)}$. The problem hints that this is the backbone of the proof that AdaBoost converges within $O(\log N)$ iterations, which is fact one in this article's addition, the one given as a conclusion only; everything the proof needs is in the "scaling factor" subsection |
| Q10–12 | Human-graded | Implement AdaBoost-Stump on LIBSVM's [madelon](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/binary/madelon) (training) and madelon.t (test), run the full $T = 500$ rounds, and plot the curves of $E_{\text{in}}(g_t)$ and $\epsilon_t$, of $E_{\text{in}}(G_t)$ and $E_{\text{out}}(G_t)$, and of $U_t$ |

Q10 requires extending the decision stump from HW2 to a multi-dimensional version that takes weights. The simplest way is to find the best stump for each feature and then pick the best over all features. There are no official solutions, so you have to set your own acceptance test: you can use scikit-learn's `AdaBoostClassifier` with depth-1 decision trees as a reference and see whether the trend of $E_{\text{in}}(G_t)$ agrees; you can also check your implementation first on the six-example data above, where the three rounds' $\epsilon_t$ should be $\frac{1}{3}, \frac{1}{4}, \frac{1}{6}$. This article ran scikit-learn 1.9.1 on these six examples: the first four values of `estimator_errors_` are $\frac{1}{3}, \frac{1}{4}, \frac{1}{6}, \frac{1}{5}$, the same as the hand computation; `estimator_weights_` is $0.693, 1.099, 1.609, 1.386$, exactly twice the handout's $\alpha_t$. Multiplying all the vote weights by the same positive number does not change $G$, so when using it as a reference, compare $\epsilon_t$ and $E_{\text{in}}(G_t)$ and do not compare the vote weights directly. The guide to the whole assignment is in [Techniques Homework and Final Project](/posts/ai/2026-09-30-ntu-htlin-ml-techniques-homework-final-project-en).

**One thing you can do tonight.** Change the program above to 2D: place a dozen or so circles and crosses yourself, and in each round print the few points with the largest weights. You will see that they are mostly the ones near the boundary that keep being misclassified, which is what the teacher is doing.

**Next lecture.** [Techniques Lecture 9: Decision Trees](/posts/ai/2026-09-30-ntu-htlin-ml-decision-tree-random-forest-gbdt-en) covers the third way of combining: conditional aggregation, where different $\mathbf{x}$ listen to different hypotheses. AdaBoost itself appears once more in Techniques Lecture 11, which explains where the choice $\alpha_t = \ln\blacklozenge_t$ comes from.

## Course video sources

Original videos: [Motivation of Boosting](https://www.youtube.com/watch?v=hL8DjIHAzZY), [Diversity by Re-weighting](https://www.youtube.com/watch?v=pTNKUj_1Dw8), [Adaptive Boosting Algorithm](https://www.youtube.com/watch?v=vqTXLTYqbbw), [Adaptive Boosting in Action](https://www.youtube.com/watch?v=5wPN87bwoaE)

- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2)
- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

Checked: 2026-10-13. The video IDs, titles, and lengths were taken from the official playlist on that day; the videos have no caption track on YouTube, and what this article reports from the lecture comes from transcripts made for it.

## Update Log

- 2026-10-13: The series now has one article per lecture; this lecture is a newly split-out article, written from the handout and the video transcripts.

## References

- [Techniques Lecture 8 handout, 208_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/208_handout.pdf): the main source for this article. The derivations in the four sections, the four Fun Time questions, the demonstration figures on pages 21 and 22, and the face detection on page 23 all come from this handout.
- [Machine Learning Techniques YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2IQOYPmqjqWsNUFl2kpk1U2): the IDs and titles of the four videos; what the text reports as said "in the lecture" is paraphrased from machine transcripts of these four videos.
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/): the official entry for handouts and recordings.
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/): the corresponding week, the 208u slides, and the further reading list.
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/): the corresponding week.
- [Fall 2024 Homework 7 (hw7.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw7/hw7.pdf): the content of Q3, Q6, and Q10–12.
- [LIBSVM Data: madelon](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/binary/madelon): the data set used in HW7 Q10–12.
- [Freund & Schapire, A Short Introduction to Boosting](https://cseweb.ucsd.edu/~yfreund/papers/IntroToBoosting.pdf): the further reading listed on the course page.
- [Learning from Data textbook website](http://amlbook.com): the textbook the course pages map chapters to; this lecture has no corresponding chapter.
- [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques: Course Overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en): where this lecture sits in the whole course and the reading routes.
