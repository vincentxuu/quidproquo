---
title: "Noise and Error Measures: Learning with Noisy Targets and Unequal Mistakes | NTU Hsuan-Tien Lin Machine Learning Foundations Lecture 8"
date: 2026-10-13
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, learning-theory, classification]
lang: en
math: true
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 8
tldr: "This lecture replaces the fixed target function with a target distribution P(y|x): as long as each (x, y) is drawn independently from the same joint distribution, the VC bound holds with noise just as before. The error measure err and P(y|x) together decide the ideal prediction on each x; the 0/1 error picks the most probable y and the squared error picks the weighted mean. CIA fingerprint verification penalizes a false accept 1000 times more, and this kind of weighted classification is the same as copying the −1 examples 1000 times and then doing ordinary classification."
description: "A guide to Lecture 8 of NTU Hsuan-Tien Lin's Machine Learning Foundations, Noise and Error: noise and the target distribution P(y|x), pointwise error measures, the derivation of the ideal mini-target, the cost matrices of the supermarket and CIA fingerprint verification, the algorithmic êrr, weighted classification and weighted pocket, with all four Fun Time questions explained and the weighted error worked out in full on eight one-dimensional points."
draft: false
glossary:
  - term: "target distribution"
    aliases: ["P(y|x)"]
    definition: "The conditional probability distribution P(y|x) of the label y given the input x. It replaces the fixed target function f and can be viewed as the ideal prediction on each x plus noise; a fixed f is the special case where every probability is 0 or 1."
    context: "Foundations Lecture 8 uses it to extend VC theory to noisy data."
    links:
      - label: "Foundations Lecture 8 handout"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/08_handout.pdf"
  - term: "ideal mini-target"
    definition: "With noise present, the prediction that minimizes the average error on a given input x. P(y|x) and the error measure decide it together: under the 0/1 error it is the most probable y, under the squared error it is the expected value of y, and under the absolute error it is the weighted median."
    context: "A term from Lecture 8 of Hsuan-Tien Lin's Machine Learning Foundations."
    links:
      - label: "Foundations Lecture 8 handout"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/08_handout.pdf"
  - term: "pointwise error measure"
    aliases: ["err"]
    definition: "A function err(ỹ, y) that scores a prediction ỹ against the label y on one single x. E_in is its average over the N training examples, and E_out is its expectation over the data distribution."
    context: "Every algorithm after Foundations Lecture 8 uses an error of this form; the two most common are the 0/1 error and the squared error."
  - term: "algorithmic error measure"
    aliases: ["êrr"]
    definition: "The error measure an algorithm actually uses when it optimizes, written êrr. It need not equal the err the application really cares about; it is usually chosen because it is plausible or because it is friendly, meaning easy to optimize."
    context: "Foundations Lecture 8 separates err from êrr; linear regression and logistic regression, which come next, each use one kind of êrr."
  - term: "weighted classification"
    aliases: ["cost-sensitive classification"]
    definition: "A classification problem in which misclassifying different examples (x, y) costs different amounts. In E_in and E_out every mistake is multiplied by its own weight before averaging."
    context: "Foundations Lecture 8 uses CIA fingerprint verification as the example and reduces it back to ordinary 0/1 classification by copying each example as many times as its weight."
---

> 🌏 [中文版](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-08-noise-and-error)

**Video status: Videos included.** This article is written from the official MOOC handout [08_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/08_handout.pdf) and transcripts of this lecture's four official videos, with formulas following the handout. The transcripts are machine transcripts made for this article (Whisper), not official captions, and no human has proofread them. The videos are taught in Mandarin; the slides are in English. Each section opens with its official video and the approximate time ranges. Page numbers refer to the number at the lower right of each slide (0/25 to 25/25), and wherever the text says "in the lecture" it is paraphrasing what is said in the video.

This is Foundations Lecture 8 in [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en). The Roadmap on page 1 of the handout places it under the second of the four big questions, Why Can Machines Learn?, and it is the last lecture on that question. The conclusion of the previous lecture, [Foundations Lecture 7: The VC Dimension](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error-en), takes up a single line on the same page: learning happens if $d_{\text{VC}}$ is finite, $N$ is large, and $E_{\text{in}}$ is low.

That conclusion was derived under two simplifying settings: the label of every $\mathbf{x}$ comes from one fixed target function $f$, and right and wrong are counted only as "classified correctly or not". Real data fits neither. Labels get recorded wrong, and people with identical conditions end up with different outcomes. Mistakes also differ in weight: letting an intruder into a classified system is not the same thing as keeping an employee out. In the lecture, Lin frames this session as going back over the assumptions made while deriving the VC bound and seeing how far they can be relaxed.

The prerequisites are the bin of marbles and Hoeffding's inequality from [Foundations Lecture 4](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning-en), PLA and pocket from [Foundations Lecture 2](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm-en), and expectations and conditional probability. After reading, you should be able to do four things:

1. Explain why the VC bound still holds once $f$ is replaced by $P(y \mid \mathbf{x})$, and compute $E_{\text{out}}$ of any hypothesis for a small distribution.
2. Given $P(y \mid \mathbf{x})$ and an error measure, derive and compute the ideal prediction (for the 0/1, squared, and absolute errors).
3. Write a cost matrix as a formula for $E_{\text{in}}$, and work out how it moves the threshold for "should I predict $+1$".
4. Explain why weighted classification equals copying examples, and which two places in pocket have to change.

## Does the VC bound still hold when the data is noisy

```youtube
url: https://www.youtube.com/watch?v=Br8J5pZM_CE
title: Noise and Error :: Noise and Probabilistic Target @ Machine Learning Foundations (機器學習基石)
```

(Video 00:19–02:22 reviews the previous lecture and the learning flow, 02:22–04:31 covers the three kinds of noise, 04:31–10:14 the color-changing marbles, 10:14–12:56 the target distribution, 12:56–15:00 the new learning flow, and Fun Time follows.)

### What the original flow diagram left out

Page 2 of the handout redraws the learning flow diagram that the earlier lectures kept using. It has five components:

1. At the upper left is the unknown target function $f: \mathcal{X} \to \mathcal{Y}$, which produces the label of every $\mathbf{x}$.
2. At the top is the unknown distribution $P$; the training inputs $\mathbf{x}_1, \dots, \mathbf{x}_N$ and the future test input $\mathbf{x}$ are all drawn from it.
3. Together the two produce the training examples $\mathcal{D}: (\mathbf{x}_1, y_1), \dots, (\mathbf{x}_N, y_N)$.
4. The learning algorithm $\mathcal{A}$ picks one hypothesis from the hypothesis set $\mathcal{H}$.
5. What it picks is the final hypothesis $g$, and the hope is $g \approx f$.

This page adds an orange "+ noise" inside the box for $f$, and the bottom of the page asks: what if there is noise?

Noise came up once before, in Foundations Lecture 2 with the pocket algorithm, where the only point was that the data might not be separable. Page 3 of the handout uses the bank's credit card approval example (age 23, female, annual salary NTD 1,000,000, 1 year in residence, 0.5 year in job, current debt 200,000; approve the card or not) to list three sources:

| Where the noise is | What the handout says | The situations given in the lecture |
|---|---|---|
| $y$ | good customer, 'mislabeled' as bad | A recording error, a human error, or a mistake in the formula originally used to approve cards |
| $y$ | same customers, different labels | The data comes from different sources, and expert one and expert two think differently; on a binary classification plot, two points sit on top of each other, one marked as a circle and one as a cross |
| $\mathbf{x}$ | inaccurate customer information | The customer filled in the form inaccurately, or the data was collected inaccurately |

The derivations in the earlier lectures did not account for any of this: $\mathbf{x}$ came from some distribution and $y$ was produced by a fixed $f$. The question on this page is whether the VC bound still works under noise.

### Color-changing marbles

Answering that means going back to where the VC bound starts. Page 4 of the handout says one key of the VC bound is marbles. The setting from Foundations Lecture 4 goes like this (the left column of the page, which the handout calls deterministic marbles):

- Each marble is an $\mathbf{x}$ drawn from $P(\mathbf{x})$.
- The marble's color is fixed: for a hypothesis $h$, it is orange if $\llbracket f(\mathbf{x}) \ne h(\mathbf{x}) \rrbracket$ holds ($h$ is wrong here) and green if not.

The fraction of orange marbles in the bin is $E_{\text{out}}(h)$, and the fraction counted in a handful is $E_{\text{in}}(h)$. Hoeffding's inequality says the two fractions are close with high probability.

The right column is the noisy version, which the handout calls probabilistic (noisy) marbles:

- A marble is still $\mathbf{x} \sim P(\mathbf{x})$.
- The color becomes random: $\llbracket y \ne h(\mathbf{x}) \rrbracket$, where $y \sim P(y \mid \mathbf{x})$.

In the lecture, Lin describes these as marbles that change color: the color is not fixed, and a marble might be orange 60% of the time and green 40% of the time. At any single moment the whole bin still has some fraction of orange. The way to estimate that fraction is still sampling, except that the color has to be written down the instant a marble is drawn. For example, draw 100 marbles; if 20 of them are orange at the moment they are drawn, use 20% to estimate the fraction of orange in the bin at that same moment.

The handout sums up what the two columns share in one line: same nature, the sampling only has to be i.i.d. for $\mathbb{P}[\text{orange}]$ to be estimated. The conclusion is that the VC bound holds for data of this kind:

$$
\mathbf{x} \overset{\text{i.i.d.}}{\sim} P(\mathbf{x}),\quad y \overset{\text{i.i.d.}}{\sim} P(y \mid \mathbf{x}) \qquad\Longleftrightarrow\qquad (\mathbf{x}, y) \overset{\text{i.i.d.}}{\sim} P(\mathbf{x}, y)
$$

Drawing $\mathbf{x}$ first and then drawing $y$ according to $P(y \mid \mathbf{x})$ is the same thing as drawing a pair $(\mathbf{x}, y)$ directly from the joint distribution $P(\mathbf{x}, y) = P(\mathbf{x})\,P(y \mid \mathbf{x})$. In the lecture, Lin explains that the only thing VC insists on is the sampling process, so $y$ has to be sampled too; it is drawn this way in training and drawn this way in testing. The handout does not rewrite the proof, and the lecture only says that rewriting those complicated proofs with color-changing marbles leaves the conclusion unchanged.

Here is an addition in this article on why that can be believed. Fix a hypothesis $h$ and define "wrong or not" for each example as

$$
Z_n = \llbracket y_n \ne h(\mathbf{x}_n) \rrbracket
$$

The $(\mathbf{x}_n, y_n)$ are independent and come from the same $P(\mathbf{x}, y)$, so $Z_1, \dots, Z_N$ are independent, identically distributed random variables that take only the values 0 and 1, each with expectation $\mathbb{P}[y \ne h(\mathbf{x})]$. That is all Hoeffding's inequality needs. It does not care whether $Z_n$ equals 1 because $h$ differs from $f$ or because noise flipped $y$. The new $E_{\text{out}}$ and $E_{\text{in}}$ are therefore

$$
E_{\text{out}}(h) = \mathop{\mathbb{E}}_{(\mathbf{x}, y) \sim P} \llbracket y \ne h(\mathbf{x}) \rrbracket, \qquad E_{\text{in}}(h) = \frac{1}{N}\sum_{n=1}^{N} \llbracket y_n \ne h(\mathbf{x}_n) \rrbracket
$$

Hoeffding for a single hypothesis holds as before. The later steps that combine many hypotheses (the growth function, the VC bound) count how many different outcomes the hypotheses can produce on $\mathbf{x}_1, \dots, \mathbf{x}_N$, which has nothing to do with how the labels are generated. All of this is only a reason to find "the conclusion is unchanged" credible, not a complete proof: a complete proof would rewrite every step of the VC bound with $(\mathbf{x}, y)$, which neither the handout nor the lecture does, and this article does not either.

### The target distribution and the mini-target

Page 5 of the handout gives $P(y \mid \mathbf{x})$ a name: the target distribution. It characterizes the behavior of the mini-target on one $\mathbf{x}$. The handout offers two ways to look at it.

**View one: an ideal mini-target plus noise.** The handout's example is

$$
P(\circ \mid \mathbf{x}) = 0.7, \qquad P(\times \mid \mathbf{x}) = 0.3
$$

In the lecture, Lin asks the students directly: the circle has probability 0.7 and the cross 0.3, so which do you guess? Guessing the circle is wrong 30% of the time and guessing the cross 70%, so on this $\mathbf{x}$ the circle is the better choice. The handout calls this best choice the ideal mini-target, $f(\mathbf{x}) = \circ$; the remaining 0.3 is the 'flipping' noise level. As Lin puts it in the lecture, the 30% of the time that guessing the circle is still wrong can be seen as noise added on top of the best choice.

**View two: a fixed $f$ is a special case of the target distribution.** Without noise,

$$
P(y \mid \mathbf{x}) = 1 \ \text{ for } y = f(\mathbf{x}), \qquad P(y \mid \mathbf{x}) = 0 \ \text{ for } y \ne f(\mathbf{x})
$$

So every result from the first seven lectures is contained in the new setting, and none of them has to be thrown away.

The bottom of this page restates the goal of learning: predict the ideal mini-target (w.r.t. $P(y \mid \mathbf{x})$) on often-seen inputs (w.r.t. $P(\mathbf{x})$). Each distribution takes care of one thing. In the lecture, Lin explains the role of $P(\mathbf{x})$: a point with large $P(\mathbf{x})$ is drawn often, shows up often in $E_{\text{in}}$, and carries more weight in $E_{\text{out}}$, so on these common points the prediction should be close to the mini-target.

Page 6 of the handout updates the flow diagram accordingly (The New Learning Flow). It differs from page 2 in two places:

- The box at the upper left changes from "unknown target function $f$" to "unknown target distribution $P(y \mid \mathbf{x})$, containing $f(\mathbf{x})$ + noise", and it produces the $y_1, \dots, y_N$ of the training examples.
- There is a new dashed line from this box to $g \approx f$ on the right, labeled $y$. In the lecture, Lin says this line is drawn on purpose for emphasis: the $y$ that $g$ is compared against at test time must be generated from the same distribution too.

The bottom of the page reads VC still works, pocket algorithm explained. What pocket does is push $E_{\text{in}}$ as low as it can when the data is not separable. The explanation in the lecture is that as long as the noise can be described by a target distribution, lowering $E_{\text{in}}$ still brings $E_{\text{out}}$ down with it. When Foundations Lecture 2 taught pocket this justification was not yet available; it is supplied here.

### Working it out once: E_out with noise and its lower bound

The following is an example made up for this article, not from the slides. Simplify the bank's customers into three groups, let $\mathbf{x}$ record only which group a customer belongs to, and let $y = +1$ mean the customer pays normally after getting the card.

| Group | $P(\mathbf{x})$ | $P(y = +1 \mid \mathbf{x})$ | ideal mini-target | The least this group can be wrong |
|---|---|---|---|---|
| A | 0.5 | 0.9 | $+1$ | 0.1 |
| B | 0.3 | 0.6 | $+1$ | 0.4 |
| C | 0.2 | 0.2 | $-1$ | 0.2 |

The ideal mini-target column uses the rule from a moment ago: guess the side with the larger probability. For any hypothesis $h$, $E_{\text{out}}$ can be computed by fixing $\mathbf{x}$ and taking the expectation over $y$ first, then taking the expectation over $\mathbf{x}$:

$$
E_{\text{out}}(h) = \sum_{\mathbf{x}} P(\mathbf{x}) \cdot \mathbb{P}\big[y \ne h(\mathbf{x}) \mid \mathbf{x}\big]
$$

If $h$ predicts $+1$ on a group, the probability of error on that group is $P(y = -1 \mid \mathbf{x})$; if it predicts $-1$, it is $P(y = +1 \mid \mathbf{x})$. Three hypotheses work out as follows:

| Hypothesis (predictions on groups A, B, C) | Computing $E_{\text{out}}$ | Result |
|---|---|---|
| $(+1, +1, -1)$, the ideal mini-target on every group | $0.5 \times 0.1 + 0.3 \times 0.4 + 0.2 \times 0.2$ | 0.21 |
| $(+1, +1, +1)$, approve everyone | $0.5 \times 0.1 + 0.3 \times 0.4 + 0.2 \times 0.8$ | 0.33 |
| $(-1, -1, -1)$, approve no one | $0.5 \times 0.9 + 0.3 \times 0.6 + 0.2 \times 0.2$ | 0.67 |

Each of the three groups has two possible predictions, for eight hypotheses in total; compute all eight and the smallest is 0.21. This result says two things. First, $E_{\text{out}}$ has a lower bound that is not 0: even knowing the complete $P(y \mid \mathbf{x})$ and guessing the right side on every group, you are still wrong 21% of the time. That part is noise, and no change of model removes it. Second, only the gap above the lower bound is the hypothesis's responsibility: the 0.33 of approving everyone exceeds 0.21 by 0.12, all of it from guessing the wrong side on group C ($0.2 \times (0.8 - 0.2) = 0.12$).

Now look at sampling. The program below draws 1,000 examples from this joint distribution and computes $E_{\text{in}}$ for two hypotheses:

```python
import random

random.seed(8)
P_pos = [0.9, 0.6, 0.2]            # probability of y = +1 in groups A, B, C
data = []
for _ in range(1000):
    r = random.random()
    g = 0 if r < 0.5 else (1 if r < 0.8 else 2)   # draw a group with 0.5 / 0.3 / 0.2
    y = +1 if random.random() < P_pos[g] else -1  # draw the label from P(y|x)
    data.append((g, y))

for name, h in [("ideal", (+1, +1, -1)), ("always +1", (+1, +1, +1))]:
    print(name, sum(h[g] != y for g, y in data) / 1000)
```

The output is `ideal 0.204` and `always +1 0.308`; against the $E_{\text{out}}$ values 0.21 and 0.33, the gaps are 0.006 and 0.022. For a single hypothesis, the guarantee from Hoeffding is $\mathbb{P}[\lvert E_{\text{in}} - E_{\text{out}} \rvert > 0.05] \le 2e^{-2 \times 0.05^2 \times 1000} = 2e^{-5} \approx 0.013$, and both gaps are within 0.05. The labels are random and the sampling estimate is just as accurate, which is what the color-changing marbles are saying.

This article adds one more commonly used special case. Suppose there is a fixed $f$ underneath, and each label is flipped independently with probability $\tau$ ($\tau < 0.5$). Let $\mu = \mathbb{P}_{\mathbf{x}}[h(\mathbf{x}) \ne f(\mathbf{x})]$, the error rate of $h$ without noise. On an $\mathbf{x}$ where $h$ and $f$ agree, $h$ counts as wrong only when the label is flipped, with probability $\tau$; on an $\mathbf{x}$ where they disagree, it counts as wrong only when the label is not flipped, with probability $1 - \tau$. So

$$
E_{\text{out}}(h) = (1 - \mu)\,\tau + \mu\,(1 - \tau) = \tau + (1 - 2\tau)\,\mu
$$

With $\tau = 0.3$ and $\mu = 0.1$ this is $0.3 + 0.4 \times 0.1 = 0.34$. Because $1 - 2\tau > 0$, the smaller the $E_{\text{out}}$ computed against the noisy labels, the smaller $\mu$ is as well: picking a hypothesis with noisy data points in the same direction as picking one without noise. Only the numbers differ: $\mu$ is multiplied by $1 - 2\tau$ and then $\tau$ is added, so the lowest it can go is $\tau$.

### Fun Time: does separability of the data tell you whether f is linear

**Question (page 7):** Let's revisit PLA/pocket. Which of the following claim is true?

1. In practice, we should try to compute if $\mathcal{D}$ is linear separable before deciding to use PLA.
2. If we know that $\mathcal{D}$ is not linear separable, then the target function $f$ must not be a linear function.
3. If we know that $\mathcal{D}$ is linear separable, then the target function $f$ must be a linear function.
4. None of the above

**Answer: 4.** Each of the three claims goes wrong in a different place.

- **Choice 1.** The handout's answer is: after computing if $\mathcal{D}$ is linear separable, we shall know $\mathbf{w}^*$ and then there is no need to use PLA. To confirm the data is linearly separable you have to find a line that separates it, and that line is exactly what PLA was going to give you. In the lecture, Lin says that logically one usually would not do this.
- **Choice 2.** The handout writes only What about noise?. $f$ can be linear, yet once noise is added to the labels the data is no longer separable; the lecture points to the situation in the pocket figure of Foundations Lecture 2.
- **Choice 3.** The handout writes What about 'sampling luck'?. The lecture gives two kinds of luck: $f$ is actually curvy, and the points that happened to be drawn can be separated by a line; or $f$ is noisy, and you were lucky enough that the drawn data missed every point the noise affected.

Lin spends some time in the lecture on the idea behind this question: a property of the data does not necessarily let you infer a property of $f$. The guarantee VC gives runs in a different direction: get a low $E_{\text{in}}$, pair it with a small $d_{\text{VC}}$, and you have a low $E_{\text{out}}$. It does not say that $f$ must be linear or must not be linear.

## How to score g: error measures and the ideal prediction on each x

```youtube
url: https://www.youtube.com/watch?v=2gCnX0V1do8
title: Noise and Error :: Error Measure @ Machine Learning Foundations (機器學習基石)
```

(Video 00:01–02:02 sorts out the three properties of the original E_out, 02:02–04:10 covers pointwise error, 04:10–05:55 the 0/1 and squared errors, 05:55–11:30 the ideal mini-target, 11:30–14:10 the flow diagram with an error measure and the extension of VC, and Fun Time follows.)

### The original E_out made three choices

The last box of the flow diagram is $g \approx f$. "How close counts as close" needs a way of scoring, and in the lecture Lin calls this giving a score: someone hands you a $g$, you have an $f$ in mind that you want, and there has to be some way to tell them whether it is good or not. Page 8 of the handout first writes out the one the earlier lectures used all along:

$$
E_{\text{out}}(g) = \mathop{\mathbb{E}}_{\mathbf{x} \sim P} \llbracket g(\mathbf{x}) \ne f(\mathbf{x}) \rrbracket
$$

More generally there is an error measure $E(g, f)$. The handout points out that the original $E_{\text{out}}$ naturally made three choices:

- **out-of-sample:** averaged over unknown $\mathbf{x}$.
- **pointwise:** evaluated on one $\mathbf{x}$ at a time. The contrast drawn in the lecture is that it does not need to draw ten $\mathbf{x}$ at once and apply some combined measure; score one point at a time and take the average at the end.
- **classification:** only $\llbracket \text{prediction} \ne \text{target} \rrbracket$ matters, that is, right or wrong.

The third is often also called the 0/1 error. In the lecture, Lin explains the name: there are only two cases, where being right costs 0 and being wrong costs 1.

### Pointwise error measures

Page 9 of the handout isolates the "pointwise" part. Many error measures can be expressed as the average of some function $\text{err}$ over individual points, and the original $E_{\text{out}}$ is one of them:

$$
E_{\text{out}}(g) = \mathop{\mathbb{E}}_{\mathbf{x} \sim P} \underbrace{\llbracket g(\mathbf{x}) \ne f(\mathbf{x}) \rrbracket}_{\text{err}(g(\mathbf{x}),\, f(\mathbf{x}))}
$$

$\text{err}$ is called the pointwise error measure. With it, the error on the training data and the error on the distribution are two averages of the same $\text{err}$:

$$
E_{\text{in}}(g) = \frac{1}{N}\sum_{n=1}^{N} \text{err}\big(g(\mathbf{x}_n), f(\mathbf{x}_n)\big), \qquad E_{\text{out}}(g) = \mathop{\mathbb{E}}_{\mathbf{x} \sim P}\, \text{err}\big(g(\mathbf{x}), f(\mathbf{x})\big)
$$

The formulas on this page are written with $f$. The lecture adds a remark that ties them to the setting of "The target distribution and the mini-target": in the noisy setting, the $f(\mathbf{x}_n)$ in the formula is really $y_n$, and the $f(\mathbf{x})$ in $E_{\text{out}}$ is likewise replaced by a $y$ drawn from the distribution, so what is measured is the difference between $g$ and $y$. By page 20, where the handout writes weighted classification, the formulas use $y$ directly.

The handout says that for simplicity it will mainly consider pointwise $\text{err}$ from here on. The reason given in the lecture is that other measures are usually more complicated, some are hard to handle, and they often have to start from the pointwise form anyway.

### The two most important err

Page 10 of the handout renames the two inputs of $\text{err}$: the prediction $g(\mathbf{x})$ is written $\tilde{y}$ and the target $f(\mathbf{x})$ is written $y$. It then lists the two $\text{err}$ that will be used again and again:

| | 0/1 error | squared error |
|---|---|---|
| Definition | $\text{err}(\tilde{y}, y) = \llbracket \tilde{y} \ne y \rrbracket$ | $\text{err}(\tilde{y}, y) = (\tilde{y} - y)^2$ |
| What it asks | correct or incorrect? | how far is $\tilde{y}$ from $y$? |
| Often for | classification | regression |

The lecture's explanation of the squared error: a difference of 2 gives an error of 4 and a difference of 10 gives an error of 100, so the error grows faster the farther away you are. It suits regression because demanding "exactly the same" makes no sense when the output is a real number; if the target is 3.141592, a guess of 3.14 may already be very accurate, so what matters is distance, not right or wrong.

The bottom of this page asks: how does $\text{err}$ 'guide' learning?

### err and P(y|x) together decide the ideal mini-target

The subsection "The target distribution and the mini-target" said the ideal mini-target is "the best prediction on this $\mathbf{x}$". In the 0.7 versus 0.3 example, the best prediction was to guess the more probable one. Page 11 of the handout points out that this answer actually depends on the error measure: $P(y \mid \mathbf{x})$ and $\text{err}$ define the ideal mini-target $f(\mathbf{x})$. The example is an $\mathbf{x}$ with three possible outputs:

$$
P(y = 1 \mid \mathbf{x}) = 0.2, \qquad P(y = 2 \mid \mathbf{x}) = 0.7, \qquad P(y = 3 \mid \mathbf{x}) = 0.1
$$

For each candidate prediction $\tilde{y}$, compute its average error on this $\mathbf{x}$, $\sum_{y} P(y \mid \mathbf{x})\,\text{err}(\tilde{y}, y)$. The handout's table lists only the results; the computation is as follows.

| $\tilde{y}$ | Average 0/1 error | Average squared error |
|---|---|---|
| 1 | $0.7 + 0.1 = 0.8$ | $0.2 \times 0 + 0.7 \times 1 + 0.1 \times 4 = 1.1$ |
| 2 | $0.2 + 0.1 = 0.3$ (smallest) | $0.2 \times 1 + 0.7 \times 0 + 0.1 \times 1 = 0.3$ |
| 3 | $0.2 + 0.7 = 0.9$ | $0.2 \times 4 + 0.7 \times 1 + 0.1 \times 0 = 1.5$ |
| 1.9 | $0.2 + 0.7 + 0.1 = 1.0$ | $0.2 \times 0.81 + 0.7 \times 0.01 + 0.1 \times 1.21 = 0.29$ (smallest) |

The 0/1 column: when predicting $\tilde{y}$, any other value of $y$ is a mistake, so the average error is the total probability of the other values. With a prediction of 1.9, none of the three possible $y$ equals 1.9, so it is always wrong and the average error is 1.0. The handout puts "really? :-)" next to this number. As Lin says in the lecture, guessing 1.9 under the 0/1 error gets you laughed at, because it is not even a possible answer.

The squared column: $(1.9 - 1)^2 = 0.81$, $(1.9 - 2)^2 = 0.01$, $(1.9 - 3)^2 = 1.21$, and weighting them gives $0.162 + 0.007 + 0.121 = 0.29$, slightly below the 0.3 of predicting 2. The 1.9 that was just laughed at becomes the best prediction once the error is squared.

With the same $P(y \mid \mathbf{x})$, changing $\text{err}$ moves the ideal prediction from 2 to 1.9. The handout writes the general result for the two cases below the table:

$$
\text{0/1 error:}\ f(\mathbf{x}) = \mathop{\text{argmax}}_{y \in \mathcal{Y}} P(y \mid \mathbf{x}) \qquad\qquad \text{squared error:}\ f(\mathbf{x}) = \sum_{y \in \mathcal{Y}} y \cdot P(y \mid \mathbf{x})
$$

The handout does not prove these two. In the lecture, Lin says the proofs are not hard and encourages everyone to try. The derivations below are additions in this article.

**The 0/1 error.** When predicting some possible value $\tilde{y} \in \mathcal{Y}$, the average error is

$$
\sum_{y \ne \tilde{y}} P(y \mid \mathbf{x}) = 1 - P(\tilde{y} \mid \mathbf{x})
$$

Making it smallest means making $P(\tilde{y} \mid \mathbf{x})$ largest, that is, choosing the $y$ with the highest probability. Predicting a value outside $\mathcal{Y}$ gives an average error of 1, which cannot be better.

**The squared error.** Treat the average error as a function of $\tilde{y}$:

$$
G(\tilde{y}) = \sum_{y} P(y \mid \mathbf{x})\,(\tilde{y} - y)^2
$$

It is a quadratic function of $\tilde{y}$ whose $\tilde{y}^2$ coefficient is $\sum_y P(y \mid \mathbf{x}) = 1 > 0$, so it opens upward, and its minimum is where the derivative equals 0:

$$
\frac{dG}{d\tilde{y}} = \sum_{y} P(y \mid \mathbf{x}) \cdot 2(\tilde{y} - y) = 2\tilde{y} - 2\sum_{y} y \cdot P(y \mid \mathbf{x}) = 0 \quad\Longrightarrow\quad \tilde{y} = \sum_{y} y \cdot P(y \mid \mathbf{x})
$$

The second equality uses the fact that the probabilities sum to 1. The best prediction is the average with the probabilities as weights, which the lecture calls the weighted mean. Plugging in the example: $1 \times 0.2 + 2 \times 0.7 + 3 \times 0.1 = 1.9$.

Write this mean as $m$. $G$ can then be split into two pieces (write $\tilde{y} - y$ as $(\tilde{y} - m) + (m - y)$ and expand; the cross term vanishes because $\sum_y P(y \mid \mathbf{x})(m - y) = 0$):

$$
G(\tilde{y}) = (\tilde{y} - m)^2 + \sum_{y} P(y \mid \mathbf{x})\,(m - y)^2
$$

The second piece does not depend on $\tilde{y}$. It is the variance on this $\mathbf{x}$, and it is also the noise the squared error cannot remove at this point. In the example it equals 0.29, so the squared column of the table can be checked at a glance: predicting 1 gives $0.9^2 + 0.29 = 1.1$, predicting 2 gives $0.1^2 + 0.29 = 0.3$, and predicting 3 gives $1.1^2 + 0.29 = 1.5$.

### The flow diagram gains a component

Since $\text{err}$ changes what "the ideal target" is, it has to appear in the flow diagram. Page 12 of the handout (Learning Flow with Error Measure) adds a blue ellipse, error measure $\text{err}$, at the lower right, with two arrows coming out of it: one points to the final $g \approx f$, meaning it is used to judge how good $g$ is; the other points to the algorithm $\mathcal{A}$, meaning the algorithm has to know it too. In the lecture, Lin explains the second arrow: if the algorithm is not told, it may keep its head down and do very well on the 0/1 error while what we care about is the squared error, and the two can be worlds apart.

The bottom of this page reads: extended VC theory/'philosophy' works for most $\mathcal{H}$ and $\text{err}$. The lecture says what has to change without going into details: for regression, for instance, you first have to define how the VC dimension of "functions with real-valued output" is computed; after definitional changes of this kind you get a VC bound that is almost the same or very similar. Lin says plainly in the lecture that these derivations are too tedious and nobody is asked to walk through them; what he hopes people remember is the spirit: although the earlier lectures derived everything only in the restricted setting of "binary classification, a fixed $f$, and the 0/1 error", the conclusion carries over to other problems and other error measures.

### Fun Time: the ideal mini-target for the absolute error

**Question (page 13):** Consider the following $P(y \mid \mathbf{x})$ and $\text{err}(\tilde{y}, y) = \lvert \tilde{y} - y \rvert$. Which of the following is the ideal mini-target $f(\mathbf{x})$?

$$
P(y = 1 \mid \mathbf{x}) = 0.10, \quad P(y = 2 \mid \mathbf{x}) = 0.35, \quad P(y = 3 \mid \mathbf{x}) = 0.15, \quad P(y = 4 \mid \mathbf{x}) = 0.40
$$

1. 2.5 = average within $\mathcal{Y} = \{1, 2, 3, 4\}$
2. 2.85 = weighted mean from $P(y \mid \mathbf{x})$
3. 3 = weighted median from $P(y \mid \mathbf{x})$
4. 4 = $\text{argmax}\, P(y \mid \mathbf{x})$

**Answer: 3.** The handout's answer is a single sentence: for the 'absolute error', the weighted median provably results in the minimum average err. The lecture suggests that the simplest approach is to plug the four numbers in and compare, and says the weighted median is the number at the place where the probability accumulates to about one half. First, plug in the numbers as the lecture suggests:

| Choice | $\tilde{y}$ | Average absolute error | Result |
|---|---|---|---|
| 1 | 2.5 | $0.10 \times 1.5 + 0.35 \times 0.5 + 0.15 \times 0.5 + 0.40 \times 1.5$ | 1.000 |
| 2 | 2.85 | $0.10 \times 1.85 + 0.35 \times 0.85 + 0.15 \times 0.15 + 0.40 \times 1.15$ | 0.965 |
| 3 | 3 | $0.10 \times 2 + 0.35 \times 1 + 0.15 \times 0 + 0.40 \times 1$ | 0.950 |
| 4 | 4 | $0.10 \times 3 + 0.35 \times 2 + 0.15 \times 1 + 0.40 \times 0$ | 1.150 |

The smallest is $\tilde{y} = 3$. The lecture mentions that each of the four numbers has its own meaning but does not go through them. This article fills that in: choice 4 is the ideal mini-target for the 0/1 error (the most probable value is 4), choice 2 is the one for the squared error ($0.10 + 0.70 + 0.45 + 1.60 = 2.85$), and choice 3 is the one for the absolute error. Choice 1 does not use the probabilities at all and treats the four values as equally likely. For the same distribution, three error measures give three different ideal predictions: 4, 2.85, and 3.

Why the median? The derivation here is an addition in this article. Let $G(\tilde{y}) = \sum_y P(y \mid \mathbf{x})\,\lvert \tilde{y} - y \rvert$. Move $\tilde{y}$ slightly to the right: its distance to every $y$ on its left increases and its distance to every $y$ on its right decreases, so wherever $\tilde{y}$ is not equal to any $y$,

$$
\frac{dG}{d\tilde{y}} = \sum_{y < \tilde{y}} P(y \mid \mathbf{x}) - \sum_{y > \tilde{y}} P(y \mid \mathbf{x})
$$

The slope is "the probability on the left" minus "the probability on the right". While the probability accumulated on the left is below one half, the slope is negative and moving right lowers the error; past one half, the slope is positive. The minimum is at the $y$ where the cumulative probability crosses 0.5. In this question the cumulative probabilities are 0.10, 0.45, 0.60, 1.00, crossing 0.5 at $y = 3$. Check against the slope: for $\tilde{y}$ between 2 and 3 it is $0.45 - 0.55 = -0.10$, and between 3 and 4 it is $0.60 - 0.40 = +0.20$, so $G$ falls to the left of 3 and rises to its right. The table's numbers confirm it as well: going from 2.85 to 3, the error drops by $0.15 \times 0.10 = 0.015$, which is exactly $0.965 - 0.950$.

## Where the error measure comes from: the application decides err, and the algorithm picks a separate êrr

```youtube
url: https://www.youtube.com/watch?v=0ApgGq4mh1E
title: Noise and Error :: Algorithmic Error Measure @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–02:20 covers fingerprint verification and the two types of error, 02:20–05:00 the supermarket, 05:00–06:57 the CIA, 06:57–11:55 err and êrr, 11:55–12:36 the updated flow diagram, and Fun Time follows.)

### The two types of error in fingerprint verification

Page 14 of the handout uses fingerprint verification as the example. The classifier looks at a fingerprint and outputs $+1$ for you and $-1$ for an intruder. The use case given in the lecture is deciding whether you are the owner of this computer, which you may use only if the fingerprint matches. This classifier can make two types of error:

| | $g = +1$ (accept) | $g = -1$ (reject) |
|---|---|---|
| $f = +1$ (you) | no error | false reject |
| $f = -1$ (intruder) | false accept | no error |

A false accept lets in someone who should have been rejected; a false reject turns away someone who should have been accepted. The handout notes at the bottom of the page: 0/1 error penalizes both types equally. In the lecture, Lin explains that the earlier algorithms only count the number of mistakes, a circle turned into a cross and a cross turned into a circle each counting as one, and pay no attention to how important the two types are relative to each other.

### Supermarket and CIA: one problem, two cost tables

Pages 15 and 16 of the handout put the same fingerprint verification into two settings, each with its own table whose numbers are the cost paid for a mistake.

**The supermarket** uses fingerprint verification to decide whether to give a discount, which only regular customers get.

| Supermarket | $g = +1$ | $g = -1$ |
|---|---|---|
| $f = +1$ | 0 | 10 |
| $f = -1$ | 1 | 0 |

- False reject: the handout writes very unhappy customer, lose future business. The lecture makes it concrete: a regular who comes every day does not get the discount, gets very angry, never comes back, and tells friends not to come either, so what the supermarket loses is all the business afterward.
- False accept: the handout writes give away a minor discount, intruder left fingerprint. In the lecture, Lin says the store only earns a little less, and the other person has left a fingerprint in the system, so tracking them down is not hard.

**The CIA** uses fingerprint verification to control entry (the handout writes fingerprint for entrance); in the lecture, Lin describes it as deciding whether an employee may get into some system to see classified information.

| CIA | $g = +1$ | $g = -1$ |
|---|---|---|
| $f = +1$ | 0 | 1 |
| $f = -1$ | 1000 | 0 |

- False accept: the handout writes very serious consequences. Someone without clearance sees classified information.
- False reject: the handout writes unhappy employee, but so what?. In the lecture, Lin says the employee at worst silently curses the lousy system and scans again; for the CIA's overall goal, an unhappy employee matters comparatively little.

In the lecture, Lin calls this kind of table a cost table and says it is sometimes called an error table. Both tables have 0 on the diagonal, since a correct classification costs nothing; they differ in which type of error is more expensive.

### Where a cost table pushes the decision threshold

The following is an example made up for this article. It runs the two tables through the method of the subsection "err and P(y|x) together decide the ideal mini-target": $P(y \mid \mathbf{x})$ and $\text{err}$ together decide the ideal mini-target, and now $\text{err}$ is a cost table.

Suppose a fingerprint $\mathbf{x}$ has $P(y = +1 \mid \mathbf{x}) = 0.8$, that is, an 80% chance of being you. Predicting $+1$ is wrong only when $y = -1$ (a false accept), and predicting $-1$ is wrong only when $y = +1$ (a false reject):

| | Average cost of predicting $+1$ | Average cost of predicting $-1$ | ideal mini-target |
|---|---|---|---|
| 0/1 error | $0.2 \times 1 = 0.2$ | $0.8 \times 1 = 0.8$ | $+1$ |
| Supermarket | $0.2 \times 1 = 0.2$ | $0.8 \times 10 = 8$ | $+1$ |
| CIA | $0.2 \times 1000 = 200$ | $0.8 \times 1 = 0.8$ | $-1$ |

For the same fingerprint that is 80% likely to be you, the supermarket should accept and the CIA should reject. The threshold can be derived directly in the general case. Let $p = P(y = +1 \mid \mathbf{x})$, let the cost of a false accept be $c_{\text{FA}}$, and let the cost of a false reject be $c_{\text{FR}}$. The average cost of predicting $+1$ is $c_{\text{FA}}(1 - p)$, and that of predicting $-1$ is $c_{\text{FR}}\,p$. Predicting $+1$ is the cheaper choice when

$$
c_{\text{FA}}(1 - p) < c_{\text{FR}}\,p \quad\Longleftrightarrow\quad c_{\text{FA}} < (c_{\text{FA}} + c_{\text{FR}})\,p \quad\Longleftrightarrow\quad p > \frac{c_{\text{FA}}}{c_{\text{FA}} + c_{\text{FR}}}
$$

| | $c_{\text{FA}}$ | $c_{\text{FR}}$ | Threshold $c_{\text{FA}} / (c_{\text{FA}} + c_{\text{FR}})$ |
|---|---|---|---|
| 0/1 error | 1 | 1 | $1/2 = 0.5$ |
| False reject costs 3 times a false accept (a number assumed in this article) | 1 | 3 | $1/4 = 0.25$ |
| CIA | 1000 | 1 | $1000/1001 \approx 0.999$ |

The threshold for the 0/1 error is 0.5, which is "guess the more probable side". When a false reject is more expensive the threshold drops below 0.5: if a false reject costs 3 times a false accept, you should predict $+1$ whenever the probability of it being you is above 25%. The supermarket's table also belongs to this class where a false reject is more expensive, which is why the 80%-you fingerprint above should be accepted at the supermarket. When a false accept is more expensive the threshold rises, and the CIA accepts only when it is more than 99.9% sure. A cost table does not change $P(y \mid \mathbf{x})$; it changes the ideal mini-target, so the two settings want classifiers that look different. The lecture's summary is that saying "binary classification" does not mean always scoring by classification error; the same binary classification is a completely different situation at the CIA and at the supermarket.

### The true err and the êrr the algorithm uses

Page 17 of the handout is titled Take-home Message for Now, and its first line is: $\text{err}$ is application/user-dependent. The error measure is decided by the application and the user.

In the ideal case the user hands you $\text{err}$ and you use it directly in the algorithm. In the lecture, Lin says this often cannot be done and takes his own number as the example: the CIA's 1000 is something the lecturer made up, and if you really asked the CIA, they could not say whether it should be 1000 times, 2000 times, or 5000 times. Users have an idea in mind, but turning it into numbers an algorithm can handle is hard.

So what the algorithm uses when it optimizes is often a different error measure, which the handout writes as $\widehat{\text{err}}$ (algorithmic error measure). In the lecture, Lin explains the hat: it is not necessarily identical to what the user really cares about. The handout lists three sources of $\widehat{\text{err}}$:

**true: just $\text{err}$.** If the user can supply it, this is best.

**plausible: one you can give a reason for.** The lecture describes it as a way that convinces ourselves. The handout gives two:

- The 0/1 error corresponds to minimum 'flipping noise'. The lecture goes back to the idea behind pocket: assume the misclassified points are all flipping noise and that there is little of it, and then finding the hypothesis with the smallest 0/1 error makes sense. The handout adds a reminder after this line: NP-hard to optimize, remember?, which is something [Foundations Lecture 2](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm-en) brought up before introducing pocket.
- The squared error corresponds to minimum Gaussian noise. The lecture's explanation: if you believe the noise is Gaussian, the exponent of the Gaussian distribution has a squared term, and making the squared term as small as possible is like looking for the smallest Gaussian noise.

This article writes that second remark as a formula. Suppose $y = h(\mathbf{x}) + \epsilon$, where $\epsilon$ is Gaussian noise with mean 0 and standard deviation $\sigma$; then the probability density of seeing $y_n$ is proportional to $\exp\!\big(-(y_n - h(\mathbf{x}_n))^2 / 2\sigma^2\big)$. The probability density of $N$ independent examples appearing together is the product over the examples, and taking the logarithm turns it into a sum:

$$
\ln \prod_{n=1}^{N} \exp\!\Big(-\frac{(y_n - h(\mathbf{x}_n))^2}{2\sigma^2}\Big) = -\frac{1}{2\sigma^2}\sum_{n=1}^{N} \big(y_n - h(\mathbf{x}_n)\big)^2
$$

The $h$ that makes the data look most likely is the $h$ that minimizes the sum of squared errors. This argument only shows that the squared error is plausible, on the premise that the noise really is close to Gaussian.

**friendly: easy to optimize.** The 0/1 error is plausible but very hard to optimize, so a third kind is needed: one that is friendly to the algorithm $\mathcal{A}$. The handout gives two:

- closed-form solution. As Lin puts it in the lecture, you write down the formula, compute straight through, and have the solution right away.
- convex objective function. The lecture's analogy is that minimizing is just like a ball rolling down from the mountain into the valley.

The bottom of the page reads $\widehat{\text{err}}$: more in next lectures. As an addition in this article, here are the two instances coming up: linear regression in [Foundations Lecture 9](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression-en) uses the squared error and has a closed-form solution; logistic regression in [Foundations Lecture 10](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-10-logistic-regression-en) uses an error that is convex.

Page 18 of the handout updates the flow diagram once more (Learning Flow with Algorithmic Error Measure): the $\text{err}$ ellipse is still at the lower right and still points to $g \approx f$ and $\mathcal{A}$; the ellipse of the algorithm $\mathcal{A}$ now contains a small piece labeled $\widehat{\text{err}}$. The bottom of the page states the division of labor in two lines: $\text{err}$ is the application goal, and $\widehat{\text{err}}$ is a key part of many $\mathcal{A}$. The lecture's description of $\widehat{\text{err}}$ is that it is the piece of the algorithm that tries to make our lives a little easier.

### Fun Time: writing the CIA cost table as E_in

**Question (page 19):** Consider the CIA cost table (false accept 1000, false reject 1) as $\text{err}$. What is $E_{\text{in}}(g)$ when using this err?

1. $\frac{1}{N}\sum_{n=1}^{N} \llbracket y_n \ne g(\mathbf{x}_n) \rrbracket$
2. $\frac{1}{N}\Big(\sum_{y_n = +1} \llbracket y_n \ne g(\mathbf{x}_n) \rrbracket + 1000\sum_{y_n = -1} \llbracket y_n \ne g(\mathbf{x}_n) \rrbracket\Big)$
3. $\frac{1}{N}\Big(\sum_{y_n = +1} \llbracket y_n \ne g(\mathbf{x}_n) \rrbracket - 1000\sum_{y_n = -1} \llbracket y_n \ne g(\mathbf{x}_n) \rrbracket\Big)$
4. $\frac{1}{N}\Big(1000\sum_{y_n = +1} \llbracket y_n \ne g(\mathbf{x}_n) \rrbracket + \sum_{y_n = -1} \llbracket y_n \ne g(\mathbf{x}_n) \rrbracket\Big)$

**Answer: 2.** The key is keeping straight which class of examples each type of error happens on. Examples with $y_n = -1$ are intruders; when $g$ is wrong on such an example it lets an intruder in, which is a false accept and costs 1000. Examples with $y_n = +1$ are you; a mistake there is a false reject and costs 1. So the 1000 multiplies the sum over $y_n = -1$.

The handout's answer calls this error a false positive: when $y_n = -1$, the false positive made on such an example is penalized 1000 times more. This is the same thing as the false accept of the earlier pages (a negative judged as positive), and the lecture still says false accept when explaining this question.

The other choices: choice 1 is the original 0/1 error, with both types weighing the same. Choice 4 multiplies the 1000 onto the mistakes with $y_n = +1$, so the heavily penalized error becomes the false reject, the opposite direction from the CIA (closer to the supermarket, with a different multiple). Choice 3 makes the false accept term negative, so the more intruders get in, the lower $E_{\text{in}}$ becomes.

This article checks with a small set of numbers. Take $N = 5$, with 3 examples of you and 2 intruders; $g$ falsely rejects 2 of you and falsely accepts 1 intruder. The four choices come to $3/5 = 0.6$, $(2 + 1000)/5 = 200.4$, $(2 - 1000)/5 = -199.6$, and $(2000 + 1)/5 = 400.2$. Adding up example by example from the cost table gives $1 + 1 + 1000 = 1002$, and dividing by 5 gives 200.4, in agreement with choice 2.

## Learning when the two errors are not equal: weighted classification and copying examples

```youtube
url: https://www.youtube.com/watch?v=XfuRb1jT4hs
title: Noise and Error :: Weighted Classification @ Machine Learning Foundations (機器學習基石)
```

(Video 00:01–02:54 defines weighted classification, 02:54–05:55 covers the intuitive modification and the doubt about it, 05:55–09:32 copying examples, 09:32–12:50 weighted pocket and reduction, 12:50–14:58 Fun Time, and the summary of the whole lecture follows.)

### E_in and E_out for weighted classification

Page 20 of the handout calls the CIA table a Cost (Error, Loss, …) Matrix. In the lecture, Lin goes through the names: cost, loss, and error are used by different books and papers and mean roughly the same thing, something you want to be as small as possible; this course tries to stick with error. The rows of the table are the true $y$ and the columns are $h(\mathbf{x})$:

| CIA | $h(\mathbf{x}) = +1$ | $h(\mathbf{x}) = -1$ |
|---|---|---|
| $y = +1$ | 0 | 1 |
| $y = -1$ | 1000 | 0 |

According to this table, the out-of-sample and in-sample errors are

$$
E_{\text{out}}(h) = \mathop{\mathbb{E}}_{(\mathbf{x}, y) \sim P} \left\{ \begin{array}{ll} 1 & \text{if } y = +1 \\ 1000 & \text{if } y = -1 \end{array} \right\} \cdot \llbracket y \ne h(\mathbf{x}) \rrbracket
$$

$$
E_{\text{in}}(h) = \frac{1}{N}\sum_{n=1}^{N} \left\{ \begin{array}{ll} 1 & \text{if } y_n = +1 \\ 1000 & \text{if } y_n = -1 \end{array} \right\} \cdot \llbracket y_n \ne h(\mathbf{x}_n) \rrbracket
$$

Inside the braces is the weight of the example, and the $\llbracket \cdot \rrbracket$ after it is still right or wrong. The formula for $E_{\text{in}}$ is the answer to the Fun Time question "writing the CIA cost table as E_in", written another way. The handout calls this kind of problem weighted classification: different 'weight' for different $(\mathbf{x}, y)$.

The lecture first clears up something easy to confuse: the weight here is the importance of each example, which is a different thing from the weight vector $\mathbf{w}$ of the line in PLA. It then gives an analogy: like an exam where each question carries different points, some worth a thousand points and some worth only one. The weight also need not depend only on $y$; another possibility mentioned in the lecture is that different customers have different importance.

### The intuitive modification, and what it is missing

VC theory still applies here (the lecture asks everyone to take this on trust), so the remaining question is the same as before: how to make $E_{\text{in}}$ small. To tell it apart from the original 0/1 version, page 21 of the handout writes the weighted version as $E_{\text{in}}^{\text{w}}$ and the original as $E_{\text{in}}^{0/1}$. The page is titled Naïve Thoughts, and it checks the two algorithms already in hand:

- **PLA:** the handout writes doesn't matter if linear separable. When the data is linearly separable, PLA ends with a line that makes no mistakes at all, $E_{\text{in}}^{0/1} = 0$. With no example misclassified, $E_{\text{in}}^{\text{w}}$ is also 0 whatever the weights are, and 0 is already the minimum. So PLA does not need to care about weights at all; just run it.
- **pocket:** when the data is not separable PLA does not halt, and pocket is needed. Only one step in pocket involves $E_{\text{in}}$: if the newly found $\mathbf{w}_{t+1}$ is better than the $\hat{\mathbf{w}}$ in the pocket, swap it in. The intuitive modification is to make the standard for "better" a weighted one: if $\mathbf{w}_{t+1}$ reaches smaller $E_{\text{in}}^{\text{w}}$ than $\hat{\mathbf{w}}$, replace $\hat{\mathbf{w}}$ by $\mathbf{w}_{t+1}$.

This modification looks reasonable. The handout asks at the bottom of the page: the original pocket has some guarantee on $E_{\text{in}}^{0/1}$; does the modified pocket have a similar guarantee on $E_{\text{in}}^{\text{w}}$? The lecture is blunter: taking an algorithm and changing one line relies on the intuition in your own head, which Lin half-jokingly calls "manual-labor intelligence" (a play on the Chinese word for artificial intelligence); after such a change, it is not clear whether the theoretical guarantee is still there. The next step is to find a modification with a justification.

### Copying the −1 examples 1000 times

Page 22 of the handout is titled Systematic Route: Connect $E_{\text{in}}^{\text{w}}$ and $E_{\text{in}}^{0/1}$. The approach is to connect the weighted problem to the 0/1 problem we already know how to solve. The page has a left column and a right column:

| | original problem (left) | equivalent problem (right) |
|---|---|---|
| Cost table | false accept 1000, false reject 1 | false accept 1, false reject 1 (the 0/1 error) |
| Data | $\mathcal{D}$: every example appears once | every example with $y_n = +1$ appears once, every example with $y_n = -1$ appears 1000 times |

The handout's conclusion: after copying $-1$ examples 1000 times, $E_{\text{in}}^{\text{w}}$ for the left-hand side is equivalent to $E_{\text{in}}^{0/1}$ for the right-hand side.

The lecture explains it by collecting money. Suppose $h$ makes a false accept on $(\mathbf{x}_2, -1)$. The data on the right has 1000 copies of this example; if $h$ is wrong on one copy it is wrong on the other 999 too, because they are the same $\mathbf{x}_2$. If each mistake is charged one dollar, $h$ pays a thousand dollars for this example on the right. A mistake on a $+1$ example costs just one dollar. So the money collected on the right at "one dollar per mistake of either type" is exactly the money collected on the left according to the cost table, and one dollar per mistake of either type is the 0/1 error.

This article writes that passage as a formula. Say $h$ makes $a$ false accepts and $r$ false rejects on $\mathcal{D}$, and $\mathcal{D}$ contains $N_+$ examples of $+1$ and $N_-$ examples of $-1$ ($N = N_+ + N_-$). Call the data set after copying $\mathcal{D}'$; its size is $N' = N_+ + 1000N_-$. Then

$$
E_{\text{in}}^{\text{w}}(h) \text{ on } \mathcal{D} = \frac{r + 1000a}{N}, \qquad E_{\text{in}}^{0/1}(h) \text{ on } \mathcal{D}' = \frac{r + 1000a}{N'}
$$

The two have the same numerator, and the denominators differ by a constant $N'/N$ that does not depend on $h$. Strictly speaking, then, the two numbers are not equal, and the symbol the handout uses is "≡"; but for any two hypotheses, whichever has the smaller $E_{\text{in}}^{\text{w}}$ on the left has the smaller $E_{\text{in}}^{0/1}$ on the right, and the $h$ that minimizes one minimizes the other. For the purpose of "finding the best hypothesis", the two problems are the same problem.

The right-hand side is ordinary 0/1 classification, so pocket can be used directly and its original guarantee applies along with it (the lecture adds that Lin never actually proved this guarantee and only asked everyone to trust it). So the simplest solution appears: really copy the examples and hand them to the original pocket.

### Weighted pocket: copying only in your head

Real copying costs extra memory, disk, and time. In the lecture, Lin says one generally does not do it for real, but designs the algorithm while imagining that the data has already been copied. Page 23 of the handout calls this virtual copying and lists the two steps that are affected when the original pocket runs on $\mathcal{D}'$. Together the two steps are the weighted pocket algorithm:

1. **weighted PLA:** in each round, the PLA inside pocket picks an example at random and checks whether it is misclassified. Picking at random on $\mathcal{D}'$, each $-1$ example has 1000 copies, so it is picked with 1000 times the probability of each $+1$ example. The handout writes: randomly check $-1$ example mistakes with 1000 times more probability.
2. **weighted pocket replacement:** comparing $E_{\text{in}}^{0/1}$ on $\mathcal{D}'$ equals comparing $E_{\text{in}}^{\text{w}}$ on $\mathcal{D}$. So if $\mathbf{w}_{t+1}$ reaches smaller $E_{\text{in}}^{\text{w}}$ than $\hat{\mathbf{w}}$, replace it.

The second step is the one line that intuition came up with a moment ago. What the intuitive modification missed is the first step: the probability of picking an example has to follow the weights too. It takes the systematic route to see that.

The lecture also points out an advantage of writing it this way. Copying can only be done a whole number of times, but "multiply the picking probability by the weight" has no such restriction: with a weight of 11.26, just raise the probability to 11.26 times.

At the bottom of the page the handout gives this approach a name: systematic route, also called reduction, and stresses that it can be applied to many other algorithms. In the lecture, Lin says it resembles how theoretical computer science transforms one problem into another in order to solve it; the binary classification algorithms taught later can all be extended to weighted versions in the same way. Later in this series, [Techniques Lecture 8: AdaBoost](/posts/ai/2026-10-13-ntu-htlin-ml-techniques-08-adaptive-boosting-en) uses the idea of "every example carries a weight" again.

### A numerical example: eight points, three cost tables

The following is an example made up for this article, not from the slides. Use the positive rays from [Foundations Lecture 5](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function-en) as the hypothesis set: $h_\theta(x) = +1$ if $x > \theta$, and $-1$ otherwise. The input is one-dimensional; think of it as the similarity score from a fingerprint matching system, which accepts when the score exceeds the threshold $\theta$. There are 8 examples, 4 of you and 4 intruders:

| $x_n$ | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| $y_n$ | $-1$ | $-1$ | $+1$ | $-1$ | $+1$ | $+1$ | $-1$ | $+1$ |

The data is not "all $-1$ on the left, all $+1$ on the right", so every threshold misclassifies a few. The 8 points cut the number line into 9 segments, and taking one $\theta$ in each segment covers every distinct way of splitting. For each $\theta$, count the false rejects ($y_n = +1$ but $x_n \le \theta$) and the false accepts ($y_n = -1$ but $x_n > \theta$), then apply the three cost tables:

| $\theta$ | False rejects $r$ | False accepts $a$ | 0/1: $\frac{r + a}{8}$ | Supermarket: $\frac{10r + a}{8}$ | CIA: $\frac{r + 1000a}{8}$ |
|---|---|---|---|---|---|
| 0.5 | 0 | 4 | 0.5 | 0.5 | 500 |
| 1.5 | 0 | 3 | 0.375 | 0.375 | 375 |
| 2.5 | 0 | 2 | **0.25** | **0.25** | 250 |
| 3.5 | 1 | 2 | 0.375 | 1.5 | 250.125 |
| 4.5 | 1 | 1 | **0.25** | 1.375 | 125.125 |
| 5.5 | 2 | 1 | 0.375 | 2.625 | 125.25 |
| 6.5 | 3 | 1 | 0.5 | 3.875 | 125.375 |
| 7.5 | 3 | 0 | 0.375 | 3.75 | **0.375** |
| 8.5 | 4 | 0 | 0.5 | 5 | 0.5 |

Take $\theta = 4.5$: $x = 5, 6, 7, 8$ are classified as $+1$. $x = 3$ is you but gets rejected ($r = 1$), and $x = 7$ is an intruder but gets accepted ($a = 1$). The CIA's weighted error is $(1 + 1000)/8 = 125.125$.

**What this table shows.**

- The 0/1 error ties at $\theta = 2.5$ and $\theta = 4.5$, both 0.25; it cannot tell these two thresholds apart.
- The supermarket picks $\theta = 2.5$: a low threshold that rejects no regular customer, at the price of letting in two people who should not get the discount.
- The CIA picks $\theta = 7.5$: the threshold goes above the highest-scoring intruder ($x = 7$), so no intruder gets in, at the price of rejecting 3 of the 4 legitimate users. Its 0/1 error is 0.375, worse than 0.25, but that is not the number the CIA cares about.
- The weighted $E_{\text{in}}$ is no longer a fraction between 0 and 1 and can be far larger than 1. Its unit is "average cost paid per example".

**Checking the claim about copying examples.** Copy each of the 4 examples of $-1$ 1000 times and $\mathcal{D}'$ has $4 + 4000 = 4004$ examples. $\theta = 4.5$ is wrong on $1 + 1000 = 1001$ examples of $\mathcal{D}'$, so $E_{\text{in}}^{0/1} = 1001/4004 = 0.25$; $\theta = 7.5$ is wrong on 3, so $E_{\text{in}}^{0/1} = 3/4004 \approx 0.00075$. For every $\theta$, $E_{\text{in}}^{\text{w}}$ on $\mathcal{D}$ divided by $E_{\text{in}}^{0/1}$ on $\mathcal{D}'$ is $4004/8 = 500.5$, the constant $N'/N$ from before. The nine thresholds rank identically on both sides, and the best is $\theta = 7.5$ in both. This article actually built the copied data in a program and counted example by example, and all nine rows match.

**The picking probabilities of weighted PLA.** Picking one example uniformly on $\mathcal{D}'$, the probability of picking one particular intruder example is $1000/4004 \approx 0.2498$, and the probability of picking one particular example of you is $1/4004 \approx 0.00025$. The four intruder examples together take $4000/4004 \approx 99.9\%$ of the checks, so the algorithm spends nearly all its effort on "do not let the wrong person in".

### Fun Time: with very unbalanced data, how bad is the hypothesis that always accepts

**Question (page 24):** Consider the CIA cost matrix. If there are 10 examples with $y_n = -1$ (intruder) and 999,990 examples with $y_n = +1$ (you). What would $E_{\text{in}}^{\text{w}}(h)$ be for a constant $h$ that always returns $+1$?

1. 0.001
2. 0.01
3. 0.1
4. 1

**Answer: 2.** Always returning $+1$ gets all 999,990 examples of you right and falsely accepts all 10 intruders, each at a cost of 1000. With $N = 10 + 999{,}990 = 1{,}000{,}000$:

$$
E_{\text{in}}^{\text{w}}(h) = \frac{0 \times 1 + 10 \times 1000}{1{,}000{,}000} = \frac{10{,}000}{1{,}000{,}000} = 0.01
$$

Choices 1, 3, and 4 are off by factors of 10, 10, and 100, which amounts to misreading the number of intruders or the weight by one digit.

The handout's answer says that while the quiz is a simple evaluation, it is not uncommon that the data is very unbalanced for such an application, and that properly 'setting' the weights can be used to avoid the lazy constant prediction. The lecture explains why this number is worrying: intruders are rare to begin with, so the data will have this kind of ratio; a hypothesis that accepts whoever shows up is obviously terrible, but 0.01 is a very small number and the computer may think it is doing fine.

This article adds a few numbers to make it clearer. Under the 0/1 error this hypothesis is wrong only $10/1{,}000{,}000 = 0.00001$ of the time, nearly perfect, and the weight of 1000 has already magnified its error 1000 times, yet it is still only 0.01. Compare a hypothesis that takes the job seriously: it catches all 10 intruders but falsely rejects 2% of the legitimate users (about 20,000 examples), so $E_{\text{in}}^{\text{w}} \approx 20{,}000/1{,}000{,}000 = 0.02$, which is worse than the 0.01 of always accepting. From the copying point of view the reason is direct: 10 intruders copied 1000 times are only 10,000 examples, still only about 1% of one million. To make "always accept" as bad as "always reject" (error $999{,}990/1{,}000{,}000 \approx 1$), the weight would have to go up to $999{,}990/10 = 99{,}999$. So the numbers in a cost table have to be read together with the ratio in the data; the lecture's conclusion is that adjusting the weights is one common way to deal with unbalanced data.

As an addition in this article, here is a working procedure: when you face an unbalanced classification problem, first write down the cost of each of the two types of error, then decide whether to adjust the weight of each example (the approach of this section) or to adjust the decision threshold (the approach of the subsection "Where a cost table pushes the decision threshold").

### Summary of this lecture

Page 25 of the handout wraps each of the four sections into one line:

| Section | Conclusion |
|---|---|
| Noise and Probabilistic Target | can replace $f(\mathbf{x})$ by $P(y \mid \mathbf{x})$ |
| Error Measure | affect 'ideal' target |
| Algorithmic Error Measure | user-dependent; when the user cannot supply it, plausible or friendly |
| Weighted Classification | easily done by virtual 'example copying' |

The preview at the bottom of the page is next: more algorithms, please?. In the lecture, Lin says this session ends the more theoretical part of Foundations, and the next three or four lectures will teach more algorithms. The Roadmap likewise moves from the second question, Why Can Machines Learn?, to the third, How Can Machines Learn?.

## Self-check

**1. On some $\mathbf{x}$, $P(y = 0 \mid \mathbf{x}) = 0.45$, $P(y = 1 \mid \mathbf{x}) = 0.15$, and $P(y = 10 \mid \mathbf{x}) = 0.40$. Find the ideal mini-target under the 0/1 error, the squared error, and the absolute error, along with the minimum average error for each.**

Answer: The 0/1 error picks the most probable value, $y = 0$, with average error $1 - 0.45 = 0.55$. The squared error picks the weighted mean $0 \times 0.45 + 1 \times 0.15 + 10 \times 0.40 = 4.15$, and the average error is the variance $0.45 \times 4.15^2 + 0.15 \times 3.15^2 + 0.40 \times 5.85^2 = 22.9275$. The absolute error picks the weighted median: the cumulative probabilities are 0.45, 0.60, 1.00, crossing 0.5 at $y = 1$, so it is 1, with average error $0.45 \times 1 + 0.15 \times 0 + 0.40 \times 9 = 4.05$ (predicting 0 gives 4.15 and predicting 4.15 gives 4.68, both larger). The three answers 0, 4.15, and 1 differ a lot because of the faraway $y = 10$: it pulls the squared error toward itself, while the absolute error and the 0/1 error are hardly affected.

**2. There is a fixed $f$ underneath, and labels are flipped at random with probability 0.2. A hypothesis $h$ disagrees with $f$ on 10% of the $\mathbf{x}$. What is the $E_{\text{out}}$ of $h$ computed against the noisy labels? How low can the best hypothesis go? If you measure $E_{\text{in}} \approx 0.2$ for some hypothesis, how should you read it?**

Answer: $E_{\text{out}}(h) = \tau + (1 - 2\tau)\mu = 0.2 + 0.6 \times 0.1 = 0.26$. The best hypothesis is $f$ itself, with $\mu = 0$ and $E_{\text{out}} = 0.2$. Rubric: the reading has to say that 0.2 is the lower bound caused by noise, and that $E_{\text{in}} \approx 0.2$ means this hypothesis is already close to the best, not "it is wrong 20% of the time, so the model is bad"; to compare hypotheses, look at the part above the lower bound.

**3. A fingerprint has $P(y = +1 \mid \mathbf{x}) = 0.95$. What is the ideal mini-target under the CIA cost table and under the supermarket cost table?**

Answer: CIA: the average cost of predicting $+1$ is $0.05 \times 1000 = 50$ and of predicting $-1$ is $0.95 \times 1 = 0.95$, so predict $-1$ (0.95 does not exceed the threshold $1000/1001 \approx 0.999$). Supermarket: predicting $+1$ costs $0.05 \times 1 = 0.05$ and predicting $-1$ costs $0.95 \times 10 = 9.5$, so predict $+1$. For the same fingerprint that is 95% likely to be you, the CIA still rejects.

**4. $N = 1{,}000$, with 900 examples of $+1$ and 100 examples of $-1$. A hypothesis $h$ makes 30 false rejects and 2 false accepts. With the CIA cost table, what are $E_{\text{in}}^{0/1}$ and $E_{\text{in}}^{\text{w}}$? After copying the $-1$ examples 1000 times, how large is the data set? What is the 0/1 error of $h$ on it?**

Answer: $E_{\text{in}}^{0/1} = 32/1000 = 0.032$. $E_{\text{in}}^{\text{w}} = (30 + 2 \times 1000)/1000 = 2.03$. After copying there are $900 + 100 \times 1000 = 100{,}900$ examples, $h$ is wrong on $30 + 2000 = 2030$ of them, and the 0/1 error is $2030/100{,}900 \approx 0.0201$. $2.03 \div (2030/100{,}900) = 100.9$, which is $N'/N$. There are only 2 false accepts, yet they make up $2000/2030 \approx 98.5\%$ of the weighted error.

**5. To turn pocket into weighted pocket, which two places have to change? If you change only the "pocket replacement rule", what is missing?**

Rubric: the answer has to state (a) when picking an example at random to check, an example with a larger weight must be picked with proportionally higher probability; and (b) $\mathbf{w}_{t+1}$ and $\hat{\mathbf{w}}$ are compared using $E_{\text{in}}^{\text{w}}$. It also has to explain that both points come from "the original pocket running on the copied data": picking uniformly after copying is automatically the weighted probability. The version that changes only the replacement rule is not the original pocket on any data set, so there is no reason for the original guarantee to carry over automatically.

## Exercises and corresponding reading

**How the two semesters map.** In [Fall 2024](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) the slides for this lecture are [08u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/08u_handout.pdf), which has only three sections and drops the MOOC version's Weighted Classification. [Fall 2026](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) likewise lists only the first three videos of this lecture in the required pre-class viewing for W4 (09/30). This article keeps the weighted classification section because the MOOC still has that video and because AdaBoost in Techniques uses the idea of every example carrying a weight. These mappings were checked on 2026-09-30.

**Textbook.** Both course pages map this lecture to 1.4 of [Learning from Data](http://amlbook.com) (LFD).

**Homework.** [Fall 2024 HW3](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf) (released 2024-10-07, due 10-21, covering Lectures 7 to 10) has two problems related to this lecture. There are no official solutions, and grading is for enrolled students only:

- **Q6:** under the supermarket's error measure (a false reject is 10 times as important as a false accept), the ideal target becomes $\text{sign}(P(y = +1 \mid \mathbf{x}) - \alpha)$; find $\alpha$. This article derived the general form of the threshold in "Where a cost table pushes the decision threshold"; that is this article's derivation, not an official solution, and for the homework's setting go by the problem statement. When you are done, plug in a few concrete $P(y \mid \mathbf{x})$ and check that your $\alpha$ really minimizes the average cost under the supermarket's cost table.
- **Q7:** the lecture has two definitions of $E_{\text{out}}$, one compared against $f$ and one against $P(y \mid \mathbf{x})$. Prove the inequality between them, in which $E_{\text{out}}(f)$ stands for the noise that cannot be removed. The flipping-noise formula in this article's "Working it out once" subsection is a special case of it and is a good way to build intuition first.

For the other HW3 problems see the [Foundations homework guide](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide-en). According to the course page, hw2 of Fall 2026 is scheduled for release on 10/07 and was not yet public when checked on 2026-09-30.

**Access.** The videos and handouts are free and public; the Fall 2024 homework PDF is public too, but without official solutions.

**An English-language counterpart.** [Caltech Learning from Data](https://work.caltech.edu/telecourse) uses the same textbook, and Error and Noise is its Lecture 4; its Lecture 8 is Bias-Variance Tradeoff, a different route from Lin's, which makes Lecture 8 Noise and Error.

**Next lecture.** [Foundations Lecture 9: Linear Regression](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression-en) moves into How Can Machines Learn? and uses this lecture's squared error as $\widehat{\text{err}}$ to derive an algorithm with a closed-form solution.

## Course video sources

Original videos: [Noise and Probabilistic Target](https://www.youtube.com/watch?v=Br8J5pZM_CE), [Error Measure](https://www.youtube.com/watch?v=2gCnX0V1do8), [Algorithmic Error Measure](https://www.youtube.com/watch?v=0ApgGq4mh1E), [Weighted Classification](https://www.youtube.com/watch?v=XfuRb1jT4hs)

- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

Checked: 2026-10-13. The video IDs, titles, and lengths were taken from the official playlist that day; the videos have no caption track on YouTube, and what this article reports from the lecture comes from transcripts made for it.

## Update Log

- 2026-10-13: The series now has one article per lecture; this lecture is a newly split-out article, written from the handout and the video transcripts.

## References

- [Foundations Lecture 8 handout, 08_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/08_handout.pdf): the main source for this article. The content of the four sections, the flow diagrams, the cost tables, and the four Fun Time questions all come from this handout.
- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf): the IDs and titles of the four videos; what the text reports as said "in the lecture" is paraphrased from machine transcripts of these four videos.
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/): the official entry for handouts and recordings.
- [Fall 2024 slides for Lecture 8 (08u_handout.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/08u_handout.pdf): confirms that Fall 2024 teaches only the first three sections.
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/): the corresponding LFD chapter.
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/): the required pre-class viewing for W4 and the schedule of hw2.
- [Fall 2024 Homework 3 (hw3_red.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf): the content of Q6 and Q7.
- [Learning from Data textbook website](http://amlbook.com): the source of section 1.4.
- [Caltech Learning from Data telecourse](https://work.caltech.edu/telecourse): the English-language counterpart course.
- [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques: Course Overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en): where this lecture sits in the whole course and the reading routes.
