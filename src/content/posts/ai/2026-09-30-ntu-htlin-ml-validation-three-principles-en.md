---
title: "Validation: Holding Out Data to Select a Model | NTU Hsuan-Tien Lin Machine Learning Foundations Lecture 15"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, validation, model-selection, cross-validation]
lang: en
math: true
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 15
tldr: "Selecting a model by E_in always favors the most complex one, and selecting by E_test needs test data you cannot get. This lecture holds out K of the N examples on hand as a validation set and obtains E_out(g_m*) ≤ E_out(g⁻_m*) ≤ E_val(g⁻_m*) + O(√(log M / K)), which explains why you retrain on all the data after selecting and why K is taken as N/5. It then pushes K down to 1 to get the almost unbiased leave-one-out estimate, and finally brings the computation back to something feasible with 5-fold or 10-fold cross validation."
description: "A guide to Lecture 15 of NTU Hsuan-Tien Lin's Machine Learning Foundations, Validation: the model selection problem, the comparison of E_in, E_test, and E_val, the dilemma about the validation set size K, the proof that leave-one-out is almost unbiased, and V-fold cross validation, with all four ways of selecting worked out by hand on six data points."
draft: false
glossary:
  - term: "model selection"
    aliases: ["model selection problem"]
    definition: "Given M pairings of a hypothesis set with an algorithm, pick one so that the g it learns from the data has low E_out."
    context: "The main problem of Foundations Lecture 15; the handout calls it arguably the most important practical problem of ML."
  - term: "validation set"
    aliases: ["D_val"]
    definition: "K examples held out at random from the data D on hand and never given to the algorithm for training, used to simulate test data and to choose among candidate models."
    context: "Foundations Lecture 15 computes E_val on it, in place of the dangerous E_in and the unobtainable E_test."
  - term: "leave-one-out cross validation"
    aliases: ["LOOCV", "E_loocv"]
    definition: "Hold out one example for validation and train on the other N−1, repeat for all N examples, and average the N errors. Its expectation equals the average E_out when training on N−1 examples."
    context: "The extreme case in Foundations Lecture 15 where the validation set size is pushed to K = 1."
  - term: "V-fold cross validation"
    aliases: ["E_cv"]
    definition: "Randomly partition the data into V equal parts, take each part in turn for validation while training on the other V−1, and average the V validation errors."
    context: "Foundations Lecture 15 recommends 5-fold or 10-fold in practice, with no need to go all the way to leave-one-out."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles)

**Video status: Videos included.** This article is written from the official MOOC handout [15_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/15_handout.pdf) and transcripts of this lecture's four official videos, with formulas following the handout. The transcripts are machine transcripts made for this article (Whisper), not official captions, and no human has proofread them. The videos are taught in Mandarin; the slides are in English. Each section opens with its official video and the approximate time ranges. Page numbers refer to the number at the lower right of each slide (0/22 to 22/22), and wherever the text says "in the lecture" it is paraphrasing what is said in the video.

This is Foundations Lecture 15 in [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en). The Roadmap on page 1 of the handout divides Foundations into four questions, and this lecture belongs to the fourth, How Can Machines Learn Better?. The previous lecture, [Foundations Lecture 14: Regularization](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-14-regularization-en), takes up a single line on that page: it minimizes augmented error, where the added regularizer effectively limits model complexity. That lecture left one question unanswered: how large the regularization strength $\lambda$ should be depends on how much noise there is, and the amount of noise is not known in advance. Validation, the subject of this lecture, is the tool for making that kind of choice.

There are three prerequisites: the finite-hypothesis Hoeffding inequality from [Foundations Lecture 4](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning-en), linear regression and the learning curve from [Foundations Lecture 9](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression-en), and the polynomial transform from [Foundations Lecture 12](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-12-nonlinear-transformation-en). Linearity of expectation is used once; the check made up for this article also uses the fact that when two independent random variables are subtracted, their variances add.

After reading, you should be able to explain why neither $E_{\text{in}}$ nor $E_{\text{test}}$ can be used to select a model, write down the full validation procedure and its guarantee, derive on your own why the expectation of leave-one-out equals $\overline{E_{\text{out}}}(N-1)$, and compute $E_{\text{val}}$, $E_{\text{loocv}}$, and $E_{\text{cv}}$ by hand for a small data set.

## With so many combinations, how do you pick one: the model selection problem

```youtube
url: https://www.youtube.com/watch?v=BRLGPnrcel8
title: Validation :: Model Selection Problem @ Machine Learning Foundations (機器學習基石)
```

(Video 00:18–01:14 reviews the previous lecture, 01:14–03:20 is the table of combinations, 03:20–06:17 defines the model selection problem, 06:17–09:57 discusses selecting by $E_{\text{in}}$, 09:57–12:40 discusses selecting by $E_{\text{test}}$, 12:40–15:06 leads to validation data, and Fun Time follows.)

### So many choices that you have to multiply

Page 2 of the handout lays out what the previous fourteen lectures taught in one table. For binary classification alone there are six things to decide:

| What to decide | Options listed in the handout |
|---|---|
| Algorithm $\mathcal{A}$ | PLA, pocket, linear regression, logistic regression |
| Number of iterations $T$ | 100, 1000, 10000 |
| Step size $\eta$ | 1, 0.01, 0.0001 |
| Feature transform $\boldsymbol{\Phi}$ | linear, quadratic, poly-10, Legendre-poly-10 |
| Regularizer $\Omega(\mathbf{w})$ | L2, L1, symmetry regularizer |
| Regularization strength $\lambda$ | 0, 0.01, 1 |

The slide draws a multiplication sign between every two rows. This article multiplies it out: $4 \times 3 \times 3 \times 4 \times 3 \times 3 = 1296$ combinations, and every row could take more options. In the lecture, Lin explains that the more methods are taught, the more choices there are to make, and that these choices combine. Everyone has a favorite combination, just as everyone has a favorite food; but always using the same one will not do well on every data set. The bottom of the slide says the same thing: in addition to your favorite combination, you may need to try other combinations to get a good $g$.

### Stating the problem clearly

Page 3 gives the formal definition, called the model selection problem:

- **Given:** $M$ models $\mathcal{H}_1, \mathcal{H}_2, \dots, \mathcal{H}_M$, each with corresponding algorithm $\mathcal{A}_1, \mathcal{A}_2, \dots, \mathcal{A}_M$.
- **Goal:** select $\mathcal{H}_{m^*}$ such that $g_{m^*} = \mathcal{A}_{m^*}(\mathcal{D})$ is of low $E_{\text{out}}(g_{m^*})$.
- **Difficulty:** $E_{\text{out}}$ cannot be computed, because $P(\mathbf{x})$ and $P(y \mid \mathbf{x})$ are unknown. The handout adds: as always.

A "model" here means a hypothesis set together with the algorithm that runs on it, and every combination in the table above counts as one. The star on $m^*$ marks the one that gets selected; the example in the lecture is 100 combinations from which number 37 is selected, and for the rest of the lecture the selected model is called "number 37".

The handout calls this arguably the most important practical problem of ML. The reason given in the lecture is that in practice no single model and single algorithm works everywhere, so a choice has to be made.

### Picking by eye does not work

The top of page 3 shows two figures and asks which one you prefer: on the left, $\mathcal{H}_1$ is a straight line that misclassifies a few points; on the right, $\mathcal{H}_2$ is a curved boundary that misclassifies none. The bottom of the slide asks and answers: select visually? No, remember Lecture 12?

The lecture repeats the two reasons from [Foundations Lecture 12](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-12-nonlinear-transformation-en). First, once the data has many dimensions it cannot be drawn, so there is nothing to look at. Second, when you choose by eye, the powerful model in your head and its VC dimension have to be counted in the price too, and that may not be a good deal.

### Picking by training error: you always get the most complex one

With only the data $\mathcal{D}$ on hand, the most direct approach is to run every model once and pick the one with the smallest $E_{\text{in}}$ (page 4):

$$
m^* = \operatorname*{argmin}_{1 \le m \le M} \big(E_m = E_{\text{in}}(\mathcal{A}_m(\mathcal{D}))\big)
$$

The handout points out two problems.

**The first problem: the result is known in advance.** The handout writes that $\boldsymbol{\Phi}_{1126}$ is always more preferred over $\boldsymbol{\Phi}_1$, and $\lambda = 0$ always more preferred over $\lambda = 0.1$. The reason is that these pairs of options are nested. The hypothesis set of a higher-order transform contains the lower-order one, and looking for the minimum-$E_{\text{in}}$ hypothesis in the larger set can never do worse than looking in the smaller set. $\lambda = 0$ minimizes $E_{\text{in}}$ directly, while $\lambda > 0$ minimizes $E_{\text{in}}$ plus the regularizer, so the $E_{\text{in}}$ the latter reaches cannot be lower than the former's. The lecture puts it bluntly: select this way and there was no point in the previous lecture's regularization, since you would just drive $E_{\text{in}}$ to its minimum, which may put you in danger of overfitting.

**The second problem: the complexity price goes up.** This holds even when the candidates are not nested. Suppose there are only two models, where $\mathcal{A}_1$ finds the minimum-$E_{\text{in}}$ hypothesis in $\mathcal{H}_1$ and $\mathcal{A}_2$ finds the minimum-$E_{\text{in}}$ hypothesis in $\mathcal{H}_2$, and you then pick whichever of the two has the smaller $E_{\text{in}}$. Taking the smaller of the two sets' minima gives the minimum over their union:

$$
\min\Big(\min_{h \in \mathcal{H}_1} E_{\text{in}}(h),\ \min_{h \in \mathcal{H}_2} E_{\text{in}}(h)\Big) = \min_{h \in \mathcal{H}_1 \cup \mathcal{H}_2} E_{\text{in}}(h)
$$

So the whole "model selection + learning" procedure is really minimizing $E_{\text{in}}$ over $\mathcal{H}_1 \cup \mathcal{H}_2$ and pays $d_{\text{VC}}(\mathcal{H}_1 \cup \mathcal{H}_2)$, and generalization may get worse. The analogy in the lecture is two classes of students: each algorithm picks the student with the smallest $E_{\text{in}}$ from its own class, and model selection then has the two top students compete, so overall you are picking the single best student from the two classes combined.

The handout's conclusion is selecting by $E_{\text{in}}$ is dangerous.

### Six data points: whom does training error pick

The following is an example made up for this article, not from the slides, and the next three sections keep using it. The data is six one-dimensional regression examples, with squared error:

| $n$ | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| $x_n$ | 0 | 1 | 2 | 3 | 4 | 5 |
| $y_n$ | 1 | 1 | 2.5 | 3 | 3 | 3 |

This article made up these six points from $f(x) = 1 + 0.5x$ plus hand-picked noise $(0, -0.5, +0.5, +0.5, 0, -0.5)$, so the right answer is a straight line. Looking only at the $y$ values, which climb at first and then level off, it is easy to feel that a curve that bends is the right choice.

There are three candidate models, all trained with the least-squares method of [Foundations Lecture 9](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression-en): the constant $h(x) = w_0$, the line $h(x) = w_0 + w_1 x$, and the quadratic $h(x) = w_0 + w_1 x + w_2 x^2$. Each contains the one before it. Training on all six points gives:

| Model | $g$ trained on all six points | $E_{\text{in}}$ |
|---|---|---|
| Constant | $2.25$ | $13/16 \approx 0.8125$ |
| Line | $1.0714 + 0.4714x$ | $23/140 \approx 0.1643$ |
| Quadratic | $0.7143 + 1.0071x - 0.1071x^2$ | $13/140 \approx 0.0929$ |

The constant model's solution is the average of the six $y$ values, $13.5/6 = 2.25$, and its $E_{\text{in}}$ is $\frac{1}{6}(1.25^2 + 1.25^2 + 0.25^2 + 0.75^2 + 0.75^2 + 0.75^2) = 4.875/6 = 0.8125$. The other two are solved by least squares; a short piece of Python near the end of the article recomputes them.

$E_{\text{in}}$ gets smaller from top to bottom, so selecting by $E_{\text{in}}$ picks the quadratic. You can predict this result without looking at the data, because the quadratic model contains the line and the line contains the constant; if the candidates also included a degree-five polynomial, it would pass through all six points with $E_{\text{in}} = 0$ and be the one selected.

### Picking by test error: a great guarantee, but the data is out of reach

Here is another idea (page 5): find a fresh test set $\mathcal{D}_{\text{test}}$ that has never been used, see how the $g_m$ learned by each model does on it, and pick the one with the smallest $E_{\text{test}}$.

$$
m^* = \operatorname*{argmin}_{1 \le m \le M} \big(E_m = E_{\text{test}}(\mathcal{A}_m(\mathcal{D}))\big)
$$

Selecting this way comes with a theoretical guarantee. $g_1, \dots, g_M$ are already fixed before $\mathcal{D}_{\text{test}}$ is seen, so this is choosing one of $M$ fixed hypotheses, and the finite-hypothesis Hoeffding inequality from [Foundations Lecture 4](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning-en) applies (the handout calls it finite-bin Hoeffding):

$$
E_{\text{out}}(g_{m^*}) \le E_{\text{test}}(g_{m^*}) + O\bigg(\sqrt{\frac{\log M}{N_{\text{test}}}}\bigg)
$$

The handout's comment is yes! strong guarantee. The lecture uses 100 models as the example: take the $\log$, take the square root, and divide by the number of test examples as well, and the price is small, unlike $E_{\text{in}}$, which pays the model complexity of the entire union. The section "Holding out K examples as a validation set" derives where this formula comes from.

The problem is where $\mathcal{D}_{\text{test}}$ is. The handout writes your boss's safe; in the lecture, Lin says it is locked in the boss's cabinet. The analogy in the lecture is a teacher's exam: hand the exam out before the test for students to take home, and the scores no longer mean anything. If you really do get hold of the test data, it was most likely stolen, and the lecture calls that fooling yourself. The handout's conclusion is selecting by $E_{\text{test}}$ is infeasible and cheating.

### The compromise: hold out a piece of the data on hand

Page 6 puts the two approaches side by side:

| | $E_{\text{in}}$ | $E_{\text{test}}$ | $E_{\text{val}}$ |
|---|---|---|---|
| Calculated from | $\mathcal{D}$ | $\mathcal{D}_{\text{test}}$ | $\mathcal{D}_{\text{val}} \subset \mathcal{D}$ |
| Can you get it | On hand | In the boss's safe | On hand |
| Is it clean | Contaminated: $\mathcal{A}_m$ has already used $\mathcal{D}$ to select $g_m$ | Clean: never used for selection before | Clean, provided $\mathcal{A}_m$ has never used $\mathcal{D}_{\text{val}}$ |

"Contaminated" is the key word of this lecture. $\mathcal{D}$ has already been used by every algorithm to decide $g_1, g_2, \dots$, and using the same data again to choose among them is reusing it. $\mathcal{D}_{\text{test}}$ is like a freshly written exam that measures ability cleanly.

The road in between is to hold out a piece of the data on hand, lock it away unused, and take it out only when it is time to choose; the error computed on it is called $E_{\text{val}}$. The handout calls this legal cheating. The analogy in the lecture is working through a study guide: do not do every problem, keep some aside, and use them to test yourself before the exam.

### Fun Time: one class for each sign of the first weight

**Question (page 7):** For $\mathcal{X} = \mathbb{R}^d$, consider two hypothesis sets, $\mathcal{H}_+$ and $\mathcal{H}_-$. The first hypothesis set contains all perceptrons with $w_1 \ge 0$, and the second hypothesis set contains all perceptrons with $w_1 \le 0$. Denote $g_+$ and $g_-$ as the minimum-$E_{\text{in}}$ hypothesis in each hypothesis set, respectively. Which statement below is true?

1. If $E_{\text{in}}(g_+) < E_{\text{in}}(g_-)$, then $g_+$ is the minimum-$E_{\text{in}}$ hypothesis of all perceptrons in $\mathbb{R}^d$.
2. If $E_{\text{test}}(g_+) < E_{\text{test}}(g_-)$, then $g_+$ is the minimum-$E_{\text{test}}$ hypothesis of all perceptrons in $\mathbb{R}^d$.
3. The two hypothesis sets are disjoint.
4. None of the above.

**Answer: 1.** The $w_1$ of every perceptron is either at least 0 or at most 0, so $\mathcal{H}_+ \cup \mathcal{H}_-$ is all perceptrons. Apply the formula from a moment ago: the smaller of the two sets' minimum $E_{\text{in}}$ is the minimum $E_{\text{in}}$ over the union. Since $g_+$ has the smaller one, it has the smallest $E_{\text{in}}$ of all perceptrons. This question is really the second problem from page 4 asked again in a different form.

Choice 2 is wrong because $g_+$ and $g_-$ were picked by $E_{\text{in}}$. Comparing the $E_{\text{test}}$ of those two only tells you which of the two is better, and other perceptrons may have a lower $E_{\text{test}}$. For choice 3, the handout's answer explains it: perceptrons with $w_1 = 0$ belong to both sides, so the two sets are not disjoint.

## Holding out K examples as a validation set: what the guarantee is, why you retrain after selecting, and how large K should be

```youtube
url: https://www.youtube.com/watch?v=RvkCaAwRP8A
title: Validation :: Validation @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–04:01 is how the validation set is split off and its guarantee, 04:01–07:36 the model selection procedure and retraining, 07:36–09:38 the experiment figure, 09:38–11:59 the dilemma about $K$, followed by the rule of thumb and Fun Time.)

### The split and the notation

Page 8 splits $\mathcal{D}$ into two pieces:

$$
\underbrace{\mathcal{D}}_{\text{size } N} \ \rightarrow\ \underbrace{\mathcal{D}_{\text{train}}}_{\text{size } N-K} \ \cup\ \underbrace{\mathcal{D}_{\text{val}}}_{\text{size } K}
$$

| | The original way | With validation |
|---|---|---|
| Data given to the algorithm | $\mathcal{D}$ ($N$ examples) | $\mathcal{D}_{\text{train}}$ ($N-K$ examples) |
| Resulting hypothesis | $g_m = \mathcal{A}_m(\mathcal{D})$ | $g_m^- = \mathcal{A}_m(\mathcal{D}_{\text{train}})$ |
| Error used to select the model | $E_{\text{in}}$, computed on $\mathcal{D}$ | $E_{\text{val}}$, computed on $\mathcal{D}_{\text{val}}$ |

$\mathcal{D}_{\text{val}}$ is called the validation set, and the handout describes it as an on-hand simulation of the test set. The minus sign on $g_m^-$, as the lecture explains, is a reminder that it used less data: with 1000 examples and 100 held out for validation, the algorithm sees only 900, and the hypothesis it learns may differ from the one learned from 1000.

Two rules govern the split, and each guarantees one thing.

- **Select at random.** $\mathcal{D}$ was drawn independently and identically distributed (iid) from $P(\mathbf{x}, y)$ in the first place, so when $K$ examples are selected from it uniformly at random, $\mathcal{D}_{\text{val}}$ is still iid from the same $P$. This connects $E_{\text{val}}$ with $E_{\text{out}}$.
- **The algorithm sees only $\mathcal{D}_{\text{train}}$.** This makes sure $\mathcal{D}_{\text{val}}$ is clean.

The lecture describes this arrangement as a division of roles: originally $\mathcal{D}$ played two roles by itself, being used both to train $g$ and to compute $E_{\text{in}}$ for making choices, and the data got contaminated as a result. Now the two roles go to two pieces of data, one responsible for training $g^-$ and one for reporting how well $g^-$ does.

### Where the guarantee comes from

The handout writes the conclusion directly on page 8:

$$
E_{\text{out}}(g_m^-) \le E_{\text{val}}(g_m^-) + O\bigg(\sqrt{\frac{\log M}{K}}\bigg)
$$

The lecture only says that this is the same situation as with $E_{\text{test}}$ a moment ago, where you cut off a small piece yourself to serve as test data, and that it uses the finite-hypothesis Hoeffding inequality. The derivation below is an addition in this article; it uses only results from [Foundations Lecture 4](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning-en) and applies to bounded errors such as 0/1 error.

**Step 1: a single hypothesis.** First hold $\mathcal{D}_{\text{train}}$ fixed. $g_m^-$ is determined by $\mathcal{D}_{\text{train}}$ alone, so as far as $\mathcal{D}_{\text{val}}$ is concerned it is a hypothesis fixed in advance. $E_{\text{val}}(g_m^-)$ is its average error on $K$ iid examples, and the expected error on each of these $K$ examples is $E_{\text{out}}(g_m^-)$. This is exactly the setting of Hoeffding, only with the number of examples changed from $N$ to $K$:

$$
P\Big[\big\lvert E_{\text{val}}(g_m^-) - E_{\text{out}}(g_m^-)\big\rvert > \epsilon\Big] \le 2\exp(-2\epsilon^2 K)
$$

**Step 2: $M$ hypotheses together.** What we want is a statement that holds no matter which one ends up selected, so we require that none of the $M$ hypotheses goes wrong. The probability that some one of them goes wrong is no more than the sum of their individual probabilities of going wrong:

$$
P\Big[\text{some } m:\ \big\lvert E_{\text{val}}(g_m^-) - E_{\text{out}}(g_m^-)\big\rvert > \epsilon\Big] \le 2M\exp(-2\epsilon^2 K)
$$

**Step 3: solve for $\epsilon$.** Set the right-hand side equal to $\delta$, take logarithms, and rearrange:

$$
2M\exp(-2\epsilon^2 K) = \delta \quad\Longrightarrow\quad \epsilon = \sqrt{\frac{1}{2K}\ln\frac{2M}{\delta}}
$$

So with probability at least $1 - \delta$, every $m$ satisfies $E_{\text{out}}(g_m^-) \le E_{\text{val}}(g_m^-) + \sqrt{\frac{1}{2K}\ln\frac{2M}{\delta}}$, and the selected $m^*$ of course satisfies it too. Absorbing the constants into $O(\cdot)$ gives the handout's formula. The guarantee for $E_{\text{test}}$ is the same derivation with $K$ replaced by $N_{\text{test}}$.

Plug in some numbers, taking $M = 100$ and $\delta = 0.05$:

| Validation set size $K$ | $\sqrt{\frac{1}{2K}\ln\frac{2M}{\delta}}$ |
|---|---|
| 200 | 0.144 |
| 20 | 0.455 |
| 1 | 2.04 |

At $K = 200$ the error bar is about 14 percentage points; at $K = 1$ it comes out above 1, which for 0/1 error guarantees nothing at all. $M$ matters much less: at $K = 200$, changing $M$ from 100 to the 1296 that the table of combinations multiplied out to only moves the number from 0.144 to 0.165, because $M$ sits inside a logarithm.

The key to this derivation is Step 1: $g_m^-$ must not depend on $\mathcal{D}_{\text{val}}$. Once the algorithm has peeked at the validation set, $g_m^-$ is no longer a hypothesis fixed in advance and Hoeffding does not apply. That is what "clean" means mathematically.

### The model selection procedure, and the final retraining

Page 9 replaces the error in the selection formula with $E_{\text{val}}$:

$$
m^* = \operatorname*{argmin}_{1 \le m \le M} \big(E_m = E_{\text{val}}(\mathcal{A}_m(\mathcal{D}_{\text{train}}))\big)
$$

The right side of the same page has a flow chart, which says the following:

1. Split $\mathcal{D}$ into $\mathcal{D}_{\text{train}}$ and $\mathcal{D}_{\text{val}}$.
2. Feed $\mathcal{D}_{\text{train}}$ to each of $\mathcal{H}_1, \mathcal{H}_2, \dots, \mathcal{H}_M$ to get $g_1^-, g_2^-, \dots, g_M^-$.
3. Use $\mathcal{D}_{\text{val}}$ to compute the validation errors $E_1, E_2, \dots, E_M$ of each $g_m^-$.
4. Pick the best, which gives $(\mathcal{H}_{m^*}, E_{m^*})$.
5. Feed the full $\mathcal{D}$ to $\mathcal{H}_{m^*}$, retrain, and output $g_{m^*}$.

Step 5 is the one that is easy to miss. After model number 37 is selected, what you return is $g_{37}$ retrained on all the data, not the $g_{37}^-$ used while selecting. The reason is written as an inequality:

$$
E_{\text{out}}\big(\underbrace{g_{m^*}}_{\mathcal{A}_{m^*}(\mathcal{D})}\big) \le E_{\text{out}}\big(\underbrace{g_{m^*}^-}_{\mathcal{A}_{m^*}(\mathcal{D}_{\text{train}})}\big)
$$

Next to it the handout writes learning curve, remember?: the more data, the lower $E_{\text{out}}$ usually is, which is the learning curve seen in [Foundations Lecture 9](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression-en) and [Foundations Lecture 13](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization-en).

This inequality does not have the same standing as the one derived in "Where the guarantee comes from". The handout calls it heuristic gain and prints it in gray. The lecture makes a point of saying that this part is not a theoretical guarantee and is closer to practical experience; it might be provable with a pile of extra conditions, but the point of this lecture is to use up as much of the data on hand as possible. Joining the two gives the formula at the bottom of page 9:

$$
E_{\text{out}}(g_{m^*}) \le E_{\text{out}}(g_{m^*}^-) \le E_{\text{val}}(g_{m^*}^-) + O\bigg(\sqrt{\frac{\log M}{K}}\bigg)
$$

The inequality on the left rests on experience; the one on the right rests on Hoeffding.

### The experiment in the handout: four curves

Page 10 uses validation to select between the degree-five polynomials $\mathcal{H}_{\boldsymbol{\Phi}_5}$ and the degree-ten polynomials $\mathcal{H}_{\boldsymbol{\Phi}_{10}}$. The horizontal axis of the figure is the validation set size $K$ (ticks at 5, 15, 25, with the curves starting to the left of 5), and the vertical axis is the expected $E_{\text{out}}$ (ticks at 0.48, 0.52, 0.56), where lower is better. There are four curves:

| Curve | What it does | How it looks in the figure |
|---|---|---|
| in-sample (solid black horizontal line) | Selection with $E_{\text{in}}$ | Does not change with $K$; height about 0.545 |
| optimal (dashed black line; the matching caption on the right is printed in gray) | Cheating-selection with $E_{\text{test}}$ | The lowest, about 0.47, below the 0.48 tick |
| sub-g (red) | Selection with $E_{\text{val}}$, reporting $g_{m^*}^-$ | Below the black line at the far left (about 0.535), then rising all the way; crosses the black line at $K$ around 8 to 9 and has left the top of the figure at 0.56 by $K$ around 11 |
| full-g (blue) | Selection with $E_{\text{val}}$, reporting $g_{m^*}$ | Starts at about the same height as the red curve and then stays below both the black and the red; lowest at about $K = 17$ (about 0.52), rising slightly to about 0.53 at $K = 25$ |

All the values in the "How it looks in the figure" column are approximate values read off the figure by eye for this article; the handout prints no numbers. The lecture goes through the curves one by one. Selecting with $E_{\text{in}}$ picks the degree-ten polynomial every time, because its $E_{\text{in}}$ is always smaller, so it is a horizontal line. The optimal line is drawn dashed with a gray caption to show that it cannot be done in practice, only by cheating. The blue curve is always below the red one, confirming that $g$ is better than $g^-$; the blue curve is also below the black line, showing that selecting with validation really is safer than selecting with $E_{\text{in}}$.

The bottom of the slide leaves a question: why is sub-g worse than in-sample some time? The handout gives no answer, and the lecture does: as $K$ grows, $\mathcal{D}_{\text{train}}$ shrinks, and $g_m^-$ is learned from less data and performs worse. Even if you choose the right model among these $g_m^-$, what you return can still lose to a $g$ that used all the data, even though the latter was selected by $E_{\text{in}}$.

### The dilemma about K

Page 11 writes the reasoning of validation as a chain of approximations:

$$
E_{\text{out}}(g) \underset{\text{small } K}{\approx} E_{\text{out}}(g^-) \underset{\text{large } K}{\approx} E_{\text{val}}(g^-)
$$

We choose using the rightmost quantity, $E_{\text{val}}(g^-)$, while what we want to end up with is the one that is best on the leftmost, $E_{\text{out}}(g)$. The two approximations pull $K$ in opposite directions:

- **Large $K$:** every $E_{\text{val}}$ is close to $E_{\text{out}}$ (the right approximation is good), but all $g_m^-$ are much worse than $g_m$ (the left approximation is bad). This is the right half of the figure, where the red and blue curves are far apart.
- **Small $K$:** every $g_m^-$ is close to $g_m$ (left is good), but $E_{\text{val}}$ is far from $E_{\text{out}}$ (right is bad). The $K = 1$ row of the table in "Where the guarantee comes from" is this case.

The practical rule of thumb the handout gives is

$$
K = \frac{N}{5}
$$

The lecture adds that some people use one tenth or one twentieth, and one fifth is a very common number.

### Six data points: one validation split

Back to the six data points made up for this article. $N/5 = 1.2$ is not an integer, so take $K = 2$ here. Suppose the random draw puts points 2 and 5 in the validation set:

$$
\mathcal{D}_{\text{val}} = \{(1, 1),\ (4, 3)\},\qquad \mathcal{D}_{\text{train}} = \{(0, 1),\ (2, 2.5),\ (3, 3),\ (5, 3)\}
$$

**The constant model.** $g_0^-$ is the average of the four $y$ values in the training set: $(1 + 2.5 + 3 + 3)/4 = 2.375$. On the validation set, $(1 - 2.375)^2 = 1.8906$ and $(3 - 2.375)^2 = 0.3906$, so the average is $E_{\text{val}} = 1.1406$.

**The line model.** Least squares in one dimension is the slope formula. The training set has $\bar{x} = 2.5$ and $\bar{y} = 2.375$:

$$
w_1 = \frac{\sum (x_n - \bar{x})(y_n - \bar{y})}{\sum (x_n - \bar{x})^2} = \frac{3.4375 - 0.0625 + 0.3125 + 1.5625}{6.25 + 0.25 + 0.25 + 6.25} = \frac{5.25}{13} \approx 0.4038
$$

$w_0 = \bar{y} - w_1\bar{x} = 2.375 - 0.4038 \times 2.5 = 1.3654$, so $g_1^-(x) = 1.3654 + 0.4038x$. At $x = 1$ it predicts $1.7692$, with squared error $0.5917$; at $x = 4$ it predicts $2.9808$, with squared error $0.0004$. $E_{\text{val}} = 0.2960$.

**The quadratic model.** The solution is $g_2^-(x) = 0.9904 + 1.0288x - 0.125x^2$. It predicts $1.8942$ at $x = 1$ and $3.1058$ at $x = 4$, the squared errors are $0.7996$ and $0.0112$, and $E_{\text{val}} = 0.4054$.

| Model | Error on $\mathcal{D}_{\text{train}}$ | $E_{\text{val}}$ |
|---|---|---|
| Constant | 0.6719 | 1.1406 |
| Line | 0.1418 | **0.2960** |
| Quadratic | 0.0012 | 0.4054 |

The quadratic model passes almost exactly through the four training points (error 0.0012), yet on the two points it has not seen it loses to the line. The line has the smallest $E_{\text{val}}$, so the line model is the one selected. Following step 5 of the procedure, retrain on all six points; what is returned is the $g(x) = 1.0714 + 0.4714x$ computed earlier.

**What this result means.** This data was made up, so the answer can be checked. Suppose $x$ is uniformly distributed on $[0, 5]$ and the noise has mean 0. Then $E_{\text{out}}(g)$ equals $\frac{1}{5}\int_0^5 (g(x) - f(x))^2\,dx$ plus the variance of the noise; the latter is the same for every hypothesis, so only the former needs comparing:

| Returned hypothesis | Mean squared distance from $f$ |
|---|---|
| Constant, all six points | 0.5208 |
| Line, all six points ($g$) | 0.0017 |
| Quadratic, all six points | 0.0495 |
| Line, only four points ($g^-$) | 0.0349 |

Of the three models the line is closest to $f$, so $E_{\text{val}}$ chose correctly, and the quadratic that $E_{\text{in}}$ chose is worse by a factor of nearly 30. The last two rows compare retraining: for the same line model, the $g$ from six points is much closer than the $g^-$ from four, so $E_{\text{out}}(g_{m^*}) \le E_{\text{out}}(g_{m^*}^-)$ holds in this example.

**What about a different split.** Holding out two of six points can be done in $\binom{6}{2} = 15$ ways, and this article computed all of them: 7 select the line, 2 are ties between the line and the quadratic (the trained quadratic coefficient happens to be 0), 5 select the quadratic, and 1 selects the constant. The one that selects the constant holds out the last two points (points 5 and 6): the training set is left with the four points from $x = 0$ to $3$, where $y$ climbs all the way, so both the line and the quadratic overshoot toward the upper right, the three $E_{\text{val}}$ values are 1.2656, 1.4062, and 5.0781, and the constant comes out smallest.

A validation error with $K = 2$ is just the average of two numbers, and a different split can change the conclusion. That is the starting point of the next section.

### Fun Time: how long does validation take

**Question (page 12):** For a learning model that takes $N^2$ seconds of training when using $N$ examples, what is the total amount of seconds needed when running the whole validation procedure with $K = \frac{N}{5}$ on 25 such models with different parameters to get the final $g_{m^*}$?

1. $6N^2$
2. $17N^2$
3. $25N^2$
4. $26N^2$

**Answer: 2.** The procedure contains two kinds of training. First, each of the 25 models is trained once on $\mathcal{D}_{\text{train}}$, which has $N - \frac{N}{5} = \frac{4N}{5}$ examples, so each run takes $\big(\frac{4N}{5}\big)^2 = \frac{16}{25}N^2$ seconds and 25 runs take $16N^2$ seconds. Then the selected model is retrained once on all $N$ examples, which takes $N^2$ seconds. The total is $17N^2$.

$25N^2$ is the time for training each of the 25 models once on all the data, which is the cost of selecting by $E_{\text{in}}$; $26N^2$ is that plus one more training run. $6N^2$ is too small, since the first stage alone takes $16N^2$.

The lecture draws one more point out of this question: $17N^2$ is less than $25N^2$. Validation is not necessarily slower, because less data goes in when training $g_m^-$.

## Pushing K to 1: leave-one-out cross validation

```youtube
url: https://www.youtube.com/watch?v=iToz5t0J6WU
title: Validation :: Leave-One-Out Cross Validation @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–03:53 is $K = 1$ and the definition of $E_{\text{loocv}}$, 03:53–07:27 illustrates it with three points and uses it to select a model, 07:27–12:57 is the theoretical guarantee, 12:57–15:24 the experiment on handwritten digits, and Fun Time follows.)

### One validation example is not enough, so take turns

$K$ has to be both large and small, and it is hard to satisfy both sides. Page 13 first looks at an extreme: $K = 1$. Now $g^-$ uses $N - 1$ examples and is almost the same as $g$, so the left part of the approximation chain is fine. The trouble is on the right: there is only one validation example.

Suppose the one held out is example $n$. In notation, the validation set is $\mathcal{D}_{\text{val}}^{(n)} = \{(\mathbf{x}_n, y_n)\}$, the hypothesis trained on the other $N - 1$ examples is $g_n^-$, and the validation error has a single term:

$$
E_{\text{val}}^{(n)}(g_n^-) = \text{err}\big(g_n^-(\mathbf{x}_n), y_n\big) = e_n
$$

A single $e_n$ tells you very little. The example in the lecture is binary classification: $e_n$ is either 0 or 1, and you cannot tell from it whether the true $E_{\text{out}}$ is 32% or 27%. The handout's remedy is to hold out each example once in turn, obtaining $e_1, e_2, \dots, e_N$, and then average:

$$
E_{\text{loocv}}(\mathcal{H}, \mathcal{A}) = \frac{1}{N}\sum_{n=1}^{N} e_n = \frac{1}{N}\sum_{n=1}^{N} \text{err}\big(g_n^-(\mathbf{x}_n), y_n\big)
$$

This is called leave-one-out cross validation. The lecture takes the name apart: leave-one-out means leaving one example out as validation data; cross means that the same example is sometimes training data and sometimes validation data.

Note that the argument of $E_{\text{loocv}}$ is $(\mathcal{H}, \mathcal{A})$, not one particular hypothesis. The $N$ values $e_n$ come from $N$ different $g_n^-$, and the lecture says that what it reports is not how good a single $g^-$ is but how well this algorithm does on this data. What we hope for is $E_{\text{loocv}}(\mathcal{H}, \mathcal{A}) \approx E_{\text{out}}(g)$.

### The three-point figure: line or constant

Page 14 draws two rows of figures with three points. The top row is the linear model: each time one point is removed, the remaining two determine a line, and $e_n$ is the squared vertical distance from the removed point to that line; the three small figures mark $e_1$, $e_2$, and $e_3$. The bottom row is the constant model: the best constant for two points is the average of their $y$ values (the lecture calls it the midpoint of the two points), and $e_n$ is again the squared distance from the removed point to that horizontal line.

$$
E_{\text{loocv}}(\text{linear}) = \frac{1}{3}(e_1 + e_2 + e_3),\qquad E_{\text{loocv}}(\text{constant}) = \frac{1}{3}(e_1 + e_2 + e_3)
$$

In the first figure of the top row, the two remaining points are close together and at different heights, so the line through them is steep and the removed point is far from it. The lecture points out that the error is squared, so this term is very large and the top row's average is higher than the bottom row's. Leave-one-out is telling you here that with only three points the constant is enough, and a line is already too complex for this data.

The handout's figure has no numbers, so this article makes up three points of a similar shape to compute it once: $(0, 0)$, $(3, 1)$, $(4, 3)$.

| Removed point | Line: through the two remaining points | $e_n$ for the line | Constant: average of the two remaining points | $e_n$ for the constant |
|---|---|---|---|---|
| $(0, 0)$ | $y = 2x - 5$, which is $-5$ at $x = 0$ | $25$ | $2$ | $4$ |
| $(3, 1)$ | $y = \frac{3}{4}x$, which is $2.25$ at $x = 3$ | $1.5625$ | $1.5$ | $0.25$ |
| $(4, 3)$ | $y = \frac{1}{3}x$, which is $\frac{4}{3}$ at $x = 4$ | $2.7778$ | $0.5$ | $6.25$ |
| Average | | $\approx 9.78$ | | $3.5$ |

$E_{\text{loocv}}(\text{linear}) \approx 9.78$ and $E_{\text{loocv}}(\text{constant}) = 3.5$, so the constant is selected. The line loses because of the 25 in the first row.

Using it to select a model means replacing $E_{\text{val}}$ in "The model selection procedure, and the final retraining" with $E_{\text{loocv}}$ (bottom of page 14):

$$
m^* = \operatorname*{argmin}_{1 \le m \le M} \big(E_m = E_{\text{loocv}}(\mathcal{H}_m, \mathcal{A}_m)\big)
$$

After selecting, train once on all the data as before to get $g_{m^*}$.

### Why it is called almost unbiased

Page 15 asks: does $E_{\text{loocv}}(\mathcal{H}, \mathcal{A})$ say something about $E_{\text{out}}(g)$? The answer is yes, for the average $E_{\text{out}}$ on size-$(N - 1)$ data.

First, be clear about what is to be proved. The lecture puts it this way: take an algorithm, do leave-one-out on 1000 examples, then do it on all sorts of different sets of 1000 examples and average. That average equals the average $E_{\text{out}}$ of the $g^-$ obtained by feeding 999 examples to the same algorithm. The latter is written $\overline{E_{\text{out}}}(N-1)$, which is the height of the learning curve at $N - 1$. The expectation $\mathcal{E}_{\mathcal{D}}$ is taken over all data sets of size $N$.

$$
\begin{aligned}
\mathop{\mathcal{E}}_{\mathcal{D}} E_{\text{loocv}}(\mathcal{H}, \mathcal{A}) = \mathop{\mathcal{E}}_{\mathcal{D}} \frac{1}{N}\sum_{n=1}^{N} e_n
&= \frac{1}{N}\sum_{n=1}^{N} \mathop{\mathcal{E}}_{\mathcal{D}} e_n \\
&= \frac{1}{N}\sum_{n=1}^{N} \mathop{\mathcal{E}}_{\mathcal{D}_n} \mathop{\mathcal{E}}_{(\mathbf{x}_n, y_n)} \text{err}\big(g_n^-(\mathbf{x}_n), y_n\big) \\
&= \frac{1}{N}\sum_{n=1}^{N} \mathop{\mathcal{E}}_{\mathcal{D}_n} E_{\text{out}}(g_n^-) \\
&= \frac{1}{N}\sum_{n=1}^{N} \overline{E_{\text{out}}}(N-1) = \overline{E_{\text{out}}}(N-1)
\end{aligned}
$$

The handout lists only the formulas. The lecture gives the reason for every step, organized below.

**Line 1:** The leftmost equals sign just substitutes the definition of $E_{\text{loocv}}$. The aligned equals sign uses the fact that expectation is linear and summation is linear, so the two can be exchanged.

**Line 2:** Split $\mathcal{D}$ into two parts, the held-out example $(\mathbf{x}_n, y_n)$ and the other $N - 1$ examples, written $\mathcal{D}_n$. The data is drawn iid, so these two parts are independent, and the expectation over $\mathcal{D}$ can be written as an expectation over $(\mathbf{x}_n, y_n)$ first and then over $\mathcal{D}_n$. The definition of $e_n$ is substituted at the same time.

**Line 3:** Look at the inner layer. $g_n^-$ depends only on $\mathcal{D}_n$, so inside that layer it is fixed. The average error of a fixed hypothesis on fresh data drawn from $P$ is the definition of $E_{\text{out}}$. The lecture says it makes no difference whether this example is called $(\mathbf{x}_n, y_n)$ or $(\mathbf{x}, y)$. An addition in this article: this step and Step 1 of "Where the guarantee comes from" rest on the same thing, namely that the hypothesis has not seen this example.

**The first equals sign of line 4:** $\mathcal{D}_n$ is $N - 1$ iid examples. Averaging $E_{\text{out}}(g_n^-)$ over all such data sets is the definition of $\overline{E_{\text{out}}}(N-1)$. This number does not depend on $n$.

**The last equals sign of line 4:** The average of $N$ identical constants is the constant itself.

The conclusion at the bottom of the slide is that the expected $E_{\text{loocv}}(\mathcal{H}, \mathcal{A})$ says something about the expected $E_{\text{out}}(g^-)$, and it is often called almost unbiased estimate of $E_{\text{out}}(g)$. It is "almost" because the right-hand side is the average performance with $N - 1$ examples while what we want is the one with $N$; the lecture says one uses 999 and the other 1000, which is nearly the same.

This article adds two things to keep in mind when reading this formula. First, it is a statement about the expectation, about what happens after averaging over many data sets; with only one data set on hand, the $E_{\text{loocv}}$ computed that one time can be far from $\overline{E_{\text{out}}}(N-1)$. Second, the $N$ values $e_n$ are not independent of one another, because any two $g_n^-$ share $N - 2$ training examples, so you cannot treat $E_{\text{loocv}}$ as the average over $N$ independent test examples and apply Hoeffding directly.

### Checking it once with the average predictor

The following is a check made up for this article, not from the slides. Take the simplest algorithm: ignore $\mathbf{x}$ and always predict with the average of the training $y$ values, with squared error. Suppose $y$ is drawn iid with mean $\mu$ and variance $\sigma^2$.

**First compute $\overline{E_{\text{out}}}(N)$.** Training on $N$ examples gives $\bar{y}_N$; a fresh $y$ is independent of it, and both have expectation $\mu$. When independent random variables are subtracted, their variances add:

$$
\overline{E_{\text{out}}}(N) = \mathcal{E}\big[(y - \bar{y}_N)^2\big] = \sigma^2 + \frac{\sigma^2}{N} = \sigma^2\Big(1 + \frac{1}{N}\Big)
$$

This agrees with the learning curve for linear regression in [Foundations Lecture 9](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression-en), $\text{noise level} \cdot \big(1 + \frac{d+1}{N}\big)$, at $d = 0$.

**Then compute the expectation of $E_{\text{loocv}}$.** $e_n = (y_n - \bar{y}_{-n})^2$, where $\bar{y}_{-n}$ is the average of the other $N - 1$ examples and is independent of $y_n$. The same calculation gives:

$$
\mathcal{E}[e_n] = \sigma^2 + \frac{\sigma^2}{N-1} = \sigma^2\Big(1 + \frac{1}{N-1}\Big) = \overline{E_{\text{out}}}(N-1)
$$

Every $e_n$ has this expectation, and so does their average. The theorem holds, and you can see where the "almost" falls short:

| $N$ | $\mathcal{E}[E_{\text{in}}]$ | $\mathcal{E}[E_{\text{loocv}}] = \overline{E_{\text{out}}}(N-1)$ | $\overline{E_{\text{out}}}(N)$ |
|---|---|---|---|
| 3 | $0.667\sigma^2$ | $1.5\sigma^2$ | $1.333\sigma^2$ |
| 1000 | $0.999\sigma^2$ | $1.001001\sigma^2$ | $1.001\sigma^2$ |

The $E_{\text{in}}$ column uses the other formula from Foundations Lecture 9, $\text{noise level} \cdot \big(1 - \frac{d+1}{N}\big)$. At $N = 3$ the expectation of $E_{\text{loocv}}$ is somewhat higher than the $\overline{E_{\text{out}}}(3)$ we actually want, which errs on the pessimistic side; $E_{\text{in}}$, by contrast, is only half of it. Once $N$ is large the gap disappears. This article also ran a simulation in Python: with $N = 3$ and $\sigma = 1$, drawing 200,000 data sets, the averages of $E_{\text{in}}$, $E_{\text{loocv}}$, $E_{\text{out}}(g^-)$, and $E_{\text{out}}(g)$ are 0.666, 1.499, 1.500, and 1.334, matching the table above.

### Leave-one-out on the six data points

Back to the six data points. Each model has to be trained six times, holding out one point each time. Take holding out point 1, $(0, 1)$, as the example:

- Constant: the average of the other five $y$ values is $12.5/5 = 2.5$, so $e_1 = (1 - 2.5)^2 = 2.25$.
- Line: the least-squares solution on the other five points is $1.15 + 0.45x$, which predicts $1.15$ at $x = 0$, so $e_1 = 0.0225$.
- Quadratic: the solution on the other five points is $-0.6 + 1.95x - 0.25x^2$, which predicts $-0.6$ at $x = 0$, so $e_1 = 2.56$.

To fit the five points on the right, the quadratic drops to $-0.6$ when extended to the left, far from the true $y_1 = 1$. After all six rounds:

| Held-out point | $e_n$ for the constant | $e_n$ for the line | $e_n$ for the quadratic |
|---|---|---|---|
| Point 1 $(0, 1)$ | 2.2500 | 0.0225 | 2.5600 |
| Point 2 $(1, 1)$ | 2.2500 | 0.5933 | 0.7861 |
| Point 3 $(2, 2.5)$ | 0.0900 | 0.3517 | 0.1012 |
| Point 4 $(3, 3)$ | 0.8100 | 0.3943 | 0.1322 |
| Point 5 $(4, 3)$ | 0.8100 | 0.0037 | 0.0017 |
| Point 6 $(5, 3)$ | 0.8100 | 0.8100 | 0.1600 |
| $E_{\text{loocv}}$ | 1.1700 | **0.3626** | 0.6235 |

$E_{\text{loocv}}$ selects the line. Compared with a single validation split, there is no question here of which two points happened to be drawn, because every point serves as validation data once. The quadratic model is in fact more accurate than the line on the middle four points; it loses at the two ends, especially at point 1.

### The handwritten digit experiment

Page 16 returns to the handwritten digit data used in earlier lectures, telling "1" from "not 1", with two raw features, average intensity and symmetry. These two features go through a polynomial transform, and the thing to decide is how many transformed features to use.

The figure at the lower left has the number of features used on the horizontal axis (ticks at 5, 10, 15, 20, with the curves starting to the left of 5) and the error on the vertical axis (ticks at 0.01, 0.02, 0.03), and it has three curves. The figure prints no values, and the numbers below are all approximate values read off the figure by eye for this article:

- **$E_{\text{in}}$ (blue):** lower with more features, stepping down like a staircase from about 0.008 to nearly 0.
- **$E_{\text{out}}$ (red):** lower when few features are used (about 0.014 to 0.017), then jumping to about 0.027 past roughly ten features.
- **$E_{\text{cv}}$ (black, here the leave-one-out result):** lowest in the stretch with few features (touching about 0.008 near 5 and near 7), then rising along with the red curve, and jumping up and down.

The lecture explains that this is real data, so the curves are not as smooth as the earlier averaged figures, but you can see that a good number of features lies in the middle and toward the low side, and more is not better; the black curve is closer to the red one. Selecting by $E_{\text{in}}$ picks the largest number of features, and selecting by $E_{\text{loocv}}$, the lecture says, picks around five or seven.

The two figures at the upper right are the classification boundaries obtained by the two ways of selecting: the boundary from select by $E_{\text{in}}$ twists and turns, and the boundary from select by $E_{\text{loocv}}$ is much smoother. The handout's conclusion is $E_{\text{loocv}}$ much better than $E_{\text{in}}$.

### Fun Time: the three numbers 1, 5, 7

**Question (page 17):** Consider three examples $(\mathbf{x}_1, y_1)$, $(\mathbf{x}_2, y_2)$, $(\mathbf{x}_3, y_3)$ with $y_1 = 1$, $y_2 = 5$, $y_3 = 7$. A learning algorithm predicts with the average $y$ value of the data set, which is the optimal constant prediction with respect to the squared error. What is $E_{\text{loocv}}$ (squared error) of the algorithm?

1. $0$
2. $\frac{56}{9}$
3. $\frac{60}{9}$
4. $14$

**Answer: 4.** Each time, hold out one example and predict it with the average of the other two:

- Hold out $y_1 = 1$: the other two average $\frac{5+7}{2} = 6$, so $e_1 = (1 - 6)^2 = 25$.
- Hold out $y_2 = 5$: the other two average $\frac{1+7}{2} = 4$, so $e_2 = (5 - 4)^2 = 1$.
- Hold out $y_3 = 7$: the other two average $\frac{1+5}{2} = 3$, so $e_3 = (7 - 3)^2 = 16$.

$E_{\text{loocv}} = \frac{25 + 1 + 16}{3} = 14$. The lecture says this question is the calculation behind the three figures in the bottom row of page 14.

The $\frac{56}{9}$ of choice 2 is $E_{\text{in}}$: the average of the three is $\frac{13}{3}$, and $\frac{1}{3}\big[(1 - \frac{13}{3})^2 + (5 - \frac{13}{3})^2 + (7 - \frac{13}{3})^2\big] = \frac{1}{3} \cdot \frac{168}{9} = \frac{56}{9}$. You get it if you forget to remove the example being tested from the average. $E_{\text{loocv}} = 14$ is more than twice $E_{\text{in}} \approx 6.22$, in the same direction as the $N = 3$ row of the table in "Checking it once with the average predictor". The 0 of choice 1 is impossible: the three $y$ values differ, so a constant has some error no matter what it guesses. The handout does not explain where choice 3 comes from. This article found one calculation that matches: use the median of the three $y$ values, 5, as the constant prediction and compute the squared error directly on the three examples, which gives $\frac{1}{3}\big[(1-5)^2 + (5-5)^2 + (7-5)^2\big] = \frac{20}{3} = \frac{60}{9}$. That uses neither the average nor a held-out example, so it is not the $E_{\text{loocv}}$ the question asks for.

An addition in this article: the question gives no $\mathbf{x}$ because the constant model does not need it. If you supply $x = 1, 2, 3$ and let a line model compete, the three $e_n$ are $4$, $1$, $4$, and $E_{\text{loocv}}(\text{linear}) = 3$, far below the constant's 14. These three points are nearly on a straight line, and this time leave-one-out selects the line. It has no built-in preference for simple models; it goes by the data.

## A version that is affordable and stable enough: V-fold cross validation

```youtube
url: https://www.youtube.com/watch?v=Y8PaLsYm0Ac
title: Validation :: V-Fold Cross Validation @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–02:28 is the two disadvantages of leave-one-out, 02:28–05:25 is V-fold, 05:25–08:28 the closing reminders about validation, 08:28–08:59 Fun Time, followed by the summary of the whole lecture and the preview of the next one.)

### The two disadvantages of leave-one-out

Page 18 lists two.

**Computation.** Every model needs $N$ additional training runs. The numbers in the lecture are 1000 examples meaning 1000 training runs with 999 examples going in each time, which is often not feasible in practice. The handout mentions an exception: a special case like the analytic solution for linear regression. The lecture says the leave-one-out error of linear regression also has a closed-form solution and can be computed quickly, but most models have no such shortcut.

**Stability.** The reason the handout gives is variance of single-point estimates, and it shows the figure from page 16 again. The lecture explains that each $e_n$ is measured at a single point. For binary classification it is either 0 or 1, which jumps around a lot, and averaging these jumps away is not easy, so the black curve in the figure jumps. That is bad for selection: we do not want to select a model merely because its curve happened to jump down a notch there.

The handout's conclusion is $E_{\text{loocv}}$: not often used practically.

### Partitioning into V parts

Page 19 first looks at leave-one-out from another angle: it partitions $\mathcal{D}$ into $N$ parts, taking $N - 1$ for training and 1 for validation in turn. The computation is heavy because the partition is too fine.

So partition more coarsely. V-fold cross validation randomly partitions $\mathcal{D}$ into $V$ equal parts, taking 1 for validation and the other $V - 1$ for training in turn. The handout's figure has $V = 10$: $\mathcal{D}$ is partitioned into $\mathcal{D}_1$ through $\mathcal{D}_{10}$, and the figure shows the round in which $\mathcal{D}_4$ is the validate part and the other nine are the train parts. The hypothesis from round $v$ is written $g_v^-$, the error $E_{\text{val}}^{(v)}(g_v^-)$ is computed on part $v$, and the $V$ rounds are averaged:

$$
E_{\text{cv}}(\mathcal{H}, \mathcal{A}) = \frac{1}{V}\sum_{v=1}^{V} E_{\text{val}}^{(v)}(g_v^-)
$$

The selection formula just swaps the error once more:

$$
m^* = \operatorname*{argmin}_{1 \le m \le M} \big(E_m = E_{\text{cv}}(\mathcal{H}_m, \mathcal{A}_m)\big)
$$

The lecture says leave-one-out is one extreme case of cross validation ($V = N$). With 1000 examples partitioned into 10 parts, the effort is 10 training runs instead of 1000.

The handout's rule of thumb is

$$
V = 10
$$

The lecture adds that partitioning into 5, 20, or 2 parts is your choice, and 10 is the common one.

This article puts it back into the dilemma about $K$. In V-fold each validation set has $K = N/V$ examples and each training set has $N(1 - \frac{1}{V})$. At $V = 10$ every $g_v^-$ uses nine tenths of the data and is not far from $g$; the validation error of each round is an average over $N/10$ examples, steadier than a single $e_n$; and once all the rounds are done, every example has served as validation data once. It buys all this with $V$ times as many training runs.

### 3-fold on the six data points, and a summary table of the four ways of selecting

Partition the six data points into 3 parts of 2 points each. Suppose the random partition is $\{1, 4\}$, $\{2, 5\}$, $\{3, 6\}$ (the numbers are the indices of the points). The round in which the second part is the validation set is the one already computed in "Six data points: one validation split".

| Part used for validation | Constant | Line | Quadratic |
|---|---|---|---|
| Points 1 and 4 | 1.1406 | 0.1956 | 1.2800 |
| Points 2 and 5 | 1.1406 | 0.2960 | 0.4054 |
| Points 3 and 6 | 0.6250 | 0.4450 | 0.4450 |
| $E_{\text{cv}}$ | 0.9688 | **0.3122** | 0.7101 |

In the third row the line and the quadratic have the same number, because the quadratic coefficient trained in that round happens to be 0. $E_{\text{cv}}$ selects the line. Putting the four ways of selecting together:

| Selection by | Constant | Line | Quadratic | Selects | Training runs (including the final retraining) |
|---|---|---|---|---|---|
| $E_{\text{in}}$ | 0.8125 | 0.1643 | 0.0929 | Quadratic | 3 |
| $E_{\text{val}}$, holding out points 2 and 5 | 1.1406 | 0.2960 | 0.4054 | Line | 3 + 1 |
| $E_{\text{val}}$, holding out points 5 and 6 | 1.2656 | 1.4062 | 5.0781 | Constant | 3 + 1 |
| $E_{\text{loocv}}$ | 1.1700 | 0.3626 | 0.6235 | Line | 18 + 1 |
| $E_{\text{cv}}$, 3-fold | 0.9688 | 0.3122 | 0.7101 | Line | 9 + 1 |
| Mean squared distance from $f$ after retraining | 0.5208 | 0.0017 | 0.0495 | | |

This table lines up with several of the handout's conclusions. $E_{\text{in}}$ selects the most complex model. A single validation split may choose correctly, or may choose wrongly because of the two points that were drawn. Leave-one-out and 3-fold both choose correctly, and 3-fold takes only half the training runs. This is just one example with six data points and proves nothing, but you can compute every cell yourself.

The pure Python below prints, for the three models, $E_{\text{in}}$, the $E_{\text{val}}$ holding out points 2 and 5, $E_{\text{loocv}}$, and the 3-fold $E_{\text{cv}}$ (the first number in each row is the degree of the polynomial):

```python
from fractions import Fraction as F

def fit(pts, deg):  # least squares: build the normal equation, then solve by Gaussian elimination
    n = deg + 1
    A = [[sum(F(x) ** (i + j) for x, _ in pts) for j in range(n)]
         + [sum(y * F(x) ** i for x, y in pts)] for i in range(n)]
    for i in range(n):
        p = next(r for r in range(i, n) if A[r][i] != 0)
        A[i], A[p] = A[p], A[i]
        A[i] = [v / A[i][i] for v in A[i]]
        for r in range(n):
            if r != i:
                A[r] = [a - A[r][i] * c for a, c in zip(A[r], A[i])]
    return [row[n] for row in A]

def err(w, pts):  # mean squared error
    return sum((sum(c * F(x) ** i for i, c in enumerate(w)) - y) ** 2
               for x, y in pts) / len(pts)

def cv(pts, deg, folds):  # each item of folds holds the indices of one validation part (0-based)
    total = 0
    for fold in folds:
        train = [p for i, p in enumerate(pts) if i not in fold]
        total += err(fit(train, deg), [pts[i] for i in fold])
    return total / len(folds)

D = list(zip(range(6), [F(1), F(1), F(5, 2), F(3), F(3), F(3)]))
for deg in range(3):
    print(deg,
          round(float(err(fit(D, deg), D)), 4),                   # E_in
          round(float(cv(D, deg, [[1, 4]])), 4),                  # hold out points 2 and 5
          round(float(cv(D, deg, [[i] for i in range(6)])), 4),   # leave-one-out
          round(float(cv(D, deg, [[0, 3], [1, 4], [2, 5]])), 4))  # 3-fold
```

### A final reminder: validation is also selecting

Page 20 is titled Final Words on Validation and has two blocks.

**'Selecting' the validation tool:**

- V-fold is generally preferred over a single validation if computation allows. The reason given in the lecture is that the averaging makes it more stable, at the price of the extra computation.
- 5-fold or 10-fold generally works well, and it is not necessary to trade V-fold with leave-one-out and pay the extra computation.

**Nature of validation:**

| Stage | What the handout says | The analogy in the lecture |
|---|---|---|
| Training | select among hypotheses | The preliminary round: each class picks its own top student |
| Validation | select among finalists | The semifinal: set another exam and see which of these contestants does well |
| Testing | just evaluate | Once the choice is made this only measures; nothing is being selected |

Because validation is also making a choice, data contamination and the price of model complexity show up there too, only more lightly than in training. The handout's wording is validation still more optimistic than testing: you choose the one that looks best in front of you, and when it is sent out to be tested it may no longer be the best.

So the words at the bottom of the slide are do not fool yourself and others, report test result, not best validation result. The lecture says that some papers pick the parameter with the best validation result among all of them and report that number as the result, and such a number is not that accurate; however well validation is done, it is only the performance that the data on hand tells you.

### Why validation is still optimistic: an example you can compute

The following is an example made up for this article, not from the slides. Suppose there are $M$ classifiers, all of which guess at random, so the true $E_{\text{out}}$ of each is $\frac{1}{2}$. Use $K$ validation examples to pick the one with the smallest $E_{\text{val}}$, then report that smallest $E_{\text{val}}$ as its performance. What gets reported on average?

Start with $M = 2$ and $K = 2$. Each classifier's $E_{\text{val}}$ on two examples can be $0$, $\frac{1}{2}$, or $1$, with probabilities $\frac{1}{4}$, $\frac{1}{2}$, and $\frac{1}{4}$. The two classifiers are independent, and we take the smaller one:

- The minimum is $1$: both must be $1$, with probability $\frac{1}{4} \times \frac{1}{4} = \frac{1}{16}$.
- The minimum is at least $\frac{1}{2}$: neither can be $0$, with probability $\frac{3}{4} \times \frac{3}{4} = \frac{9}{16}$; so the probability that the minimum is exactly $\frac{1}{2}$ is $\frac{9}{16} - \frac{1}{16} = \frac{8}{16}$.
- The minimum is $0$: the remaining $\frac{7}{16}$.

The expectation is $\frac{1}{2} \times \frac{8}{16} + 1 \times \frac{1}{16} = \frac{5}{16} \approx 0.31$. For two coin-flipping classifiers, the average error reported after picking is 0.31, while the true error is 0.5.

Computing the same thing exactly in Python up to $M = 25$ and $K = 20$, the expectation of the smallest $E_{\text{val}}$ is 0.284. The more candidates and the less validation data, the larger this gap, in the same direction as the $\sqrt{\log M / K}$ in the guarantee. Only with $M = 1$, when no selection is made at all, is the expectation of $E_{\text{val}}$ exactly 0.5, and that is testing.

### Fun Time: how long does 10-fold take

**Question (page 21):** With the same setting as page 12: for a learning model that takes $N^2$ seconds of training when using $N$ examples, what is the total amount of seconds needed when running 10-fold cross validation on 25 such models with different parameters to get the final $g_{m^*}$?

1. $\frac{47}{2}N^2$
2. $47N^2$
3. $\frac{407}{2}N^2$
4. $407N^2$

**Answer: 3.** The training set in each round is nine parts, $\frac{9N}{10}$ examples, taking $\big(\frac{9N}{10}\big)^2 = \frac{81}{100}N^2$ seconds. Each model needs 10 rounds, so 25 models need 250 rounds:

$$
\frac{81}{100}N^2 \times 10 \times 25 = \frac{405}{2}N^2
$$

After $m^*$ is selected, retrain once on all the data and add $N^2$, for a total of $\frac{405}{2}N^2 + N^2 = \frac{407}{2}N^2$. Choice 4 is twice the answer; choices 1 and 2 are both far below the $202.5N^2$ that the 250 training rounds alone require.

An addition in this article, putting the three approaches together (25 models, training time $N^2$):

| Approach | Total time | At $N = 1000$ |
|---|---|---|
| Single split, $K = N/5$ | $17N^2$ | $1.7 \times 10^7$ seconds |
| 10-fold | $203.5N^2$ | $2.035 \times 10^8$ seconds |
| leave-one-out | $25N(N-1)^2 + N^2$ | about $2.5 \times 10^{10}$ seconds |

10-fold is about 12 times the single split, and leave-one-out is more than 120 times 10-fold again, a factor that grows with $N$. This is why page 20 says there is no need to switch to leave-one-out.

### The four lines of this lecture

The summary on page 22 reduces each of the four sections to one line:

- **Model Selection Problem:** dangerous by $E_{\text{in}}$ and dishonest by $E_{\text{test}}$.
- **Validation:** select with $E_{\text{val}}(\mathcal{A}_m(\mathcal{D}_{\text{train}}))$ while returning $\mathcal{A}_{m^*}(\mathcal{D})$.
- **Leave-One-Out Cross Validation:** huge computation for almost unbiased estimate.
- **V-Fold Cross Validation:** reasonable computation and performance.

The preview of the next lecture is a single line: something 'up my sleeve'. In the lecture, Lin says that the core tools have now all been covered, and what comes next is more like a few small secrets: what else to watch out for when using machine learning, followed by a summary of the whole course.

## Self-check

**1. Four examples have $y$ values $2, 4, 6, 12$. The algorithm always predicts with the average of the training $y$ values, with squared error. Compute $E_{\text{in}}$, $E_{\text{loocv}}$, and the 2-fold $E_{\text{cv}}$ with the data partitioned into $\{2, 4\}$ and $\{6, 12\}$.**

Answer: the overall average is $6$, so $E_{\text{in}} = \frac{16 + 4 + 0 + 36}{4} = 14$. Leave-one-out: holding out $2$, the rest average $\frac{22}{3}$ and $e = \frac{256}{9}$; holding out $4$, the rest average $\frac{20}{3}$ and $e = \frac{64}{9}$; holding out $6$, the rest average $6$ and $e = 0$; holding out $12$, the rest average $4$ and $e = 64$. $E_{\text{loocv}} = \frac{1}{4} \cdot \frac{896}{9} = \frac{224}{9} \approx 24.9$. 2-fold: training on $\{6, 12\}$ gives $9$, and on $\{2, 4\}$ the error is $\frac{49 + 25}{2} = 37$; training on $\{2, 4\}$ gives $3$, and on $\{6, 12\}$ the error is $\frac{9 + 81}{2} = 45$; $E_{\text{cv}} = 41$. $E_{\text{in}}$ is the smallest because the examples being tested are themselves in the training data; the difference between the other two comes from the training data dropping from 3 examples to 2, which makes $g^-$ worse.

**2. You have $M = 20$ candidate models (0/1 error) and a validation set of $K = 500$ examples. By the derivation in this article, with 95% confidence, by how much at most can the $E_{\text{out}}(g_{m^*}^-)$ of the selected model exceed $E_{\text{val}}$? If you want this gap to be no more than 0.05, how large must $K$ be at least?**

Answer: $\sqrt{\frac{1}{2 \times 500}\ln\frac{2 \times 20}{0.05}} = \sqrt{\frac{\ln 800}{1000}} = \sqrt{0.006685} \approx 0.082$. To bring it down to 0.05 you need $K \ge \frac{\ln 800}{2 \times 0.05^2} = \frac{6.685}{0.005} \approx 1337$.

**3. A colleague's procedure is: train $g_m$ for each of 25 parameter settings on all of $\mathcal{D}$, then draw one fifth of $\mathcal{D}$ at random to compute the error of each $g_m$, and pick the smallest. How does this differ from validation?**

Criteria: the answer should point out that the one fifth drawn has already been used for training by every $\mathcal{A}_m$ and is not clean; the error computed on it is part of $E_{\text{in}}$, and $g_m$ is not a hypothesis fixed in advance with respect to this data, so the Hoeffding guarantee does not hold. The result favors the most complex model just as selecting by $E_{\text{in}}$ does. The correct order is to split off $\mathcal{D}_{\text{val}}$ first and train only on $\mathcal{D}_{\text{train}}$.

**4. After selecting a model, why retrain on all the data? Does this step have a theoretical guarantee? Someone returns $g_{m^*}^-$ right after selecting; in what situation is the loss largest?**

Criteria: the answer should mention the learning curve (the more data, the lower $E_{\text{out}}$ usually is); it should say that the handout labels this heuristic and that the lecture states outright it is practical experience and not a theoretical guarantee; it should say that the loss is larger the larger $K$ is and the smaller $\mathcal{D}_{\text{train}}$ is, and connect this to the red curve (sub-g) on page 10, which at large $K$ is even higher than the black line that selects by $E_{\text{in}}$.

**5. Three classifiers guess at random (the true $E_{\text{out}}$ of each is $\frac{1}{2}$). Using only $K = 1$ validation example, pick the one with the smallest $E_{\text{val}}$ and report that smallest $E_{\text{val}}$. What is the expectation of the reported value? What does this show?**

Answer: each classifier's $E_{\text{val}}$ is 0 or 1, each with probability $\frac{1}{2}$. The minimum is 1 only when all three guess wrong, with probability $\frac{1}{8}$, so the expectation is $\frac{1}{8}$, far below the true $\frac{1}{2}$. The validation error after picking is an optimistic estimate, and what should be reported is the test result.

## Exercises and corresponding reading

**How the two semesters map.** The [Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) puts Foundations Lectures 15 and 16 in the same week (W8, 10/21), and the slides for this lecture are [15u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/15u_handout.pdf). The [Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) also puts it in W8 (10/28); when checked on 2026-10-13 the slide link for that week still returned 404, so this article uses only the MOOC version of the handout. The four videos for this lecture are videos 58 through 61 of the Foundations YouTube playlist.

**Textbook.** Both course pages map this lecture to Section 4.3 of [Learning from Data](http://amlbook.com) (LFD).

**Homework.** The related problems are in [Fall 2024 HW5](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw5/hw5.pdf) (released 2024-11-04, due 11-18, 12 problems plus 1 bonus; Q1–4 are auto-graded and Q5–12 are graded by the TAs), which has no official solutions.

| Problem | Content | Where it maps in this lecture |
|---|---|---|
| Q2 | On linearly separable data, for the decision stump whose threshold is the midpoint of the closest positive and negative points, find the tightest upper bound on the leave-one-out error | leave-one-out |
| Q7 | Compute the average on the first $N - K$ examples and validate on the last $K$; find the expected validation error | validation set and $K$ |
| Q8 | Prove that for constant regression $E_{\text{loocv}} = \big(\frac{N}{N-1}\big)^2 E_{\text{in}}$, showing that $E_{\text{in}}$ is more optimistic than $E_{\text{loocv}}$ | leave-one-out |
| Q11 | The 2-versus-6 subproblem of mnist.scale: split off 8000 examples as the sub-training set, select $\lambda$ with $E_{\text{val}}$, then retrain on all the training data; repeat 1126 times and compare the distribution of $E_{\text{out}}$ with Q10 (which selects with $E_{\text{in}}$) | validation plus retraining |
| Q12 | The same, but selecting $\lambda$ with 3-fold cross validation, compared with Q11 | V-fold |

Q8 has no official solution, so you can check it with numbers first: the $y = 1, 5, 7$ of the Fun Time on page 17 have $E_{\text{in}} = \frac{56}{9}$ and $E_{\text{loocv}} = 14$, and $\big(\frac{3}{2}\big)^2 \times \frac{56}{9} = 14$; the $\big(\frac{4}{3}\big)^2 \times 14 = \frac{224}{9}$ of Self-check question 1 matches as well. For Q7, the calculation in "Checking it once with the average predictor" is a starting point.

The three problems Q10 through Q12 use the public [LIBLINEAR](https://www.csie.ntu.edu.tw/~cjlin/liblinear/) and [mnist.scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/multiclass/mnist.scale.bz2), and they share the same set of $\lambda$ candidates ($\log_{10}\lambda \in \{-2, \dots, 3\}$) and the same rule of breaking ties by the largest $\lambda$, so it is best to write them as one program that only swaps the selection criterion and see directly how much the $E_{\text{out}}$ distributions of the three ways of selecting differ. The L1 regularization in Q10 is in [the previous lecture](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-14-regularization-en). A guide to the whole assignment is in the [Foundations homework guide](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide-en).

**Hands-on.** While watching the second video, write out the five steps of the validation procedure yourself and circle the step "retrain on the full $\mathcal{D}$". After the last two videos, use a tool you know (scikit-learn, for example) to run 5-fold and leave-one-out once each on the same small data set, and compare the time taken and how much the estimate moves when you switch to a different random partition.

**Further reading.** Another treatment of the same topic: [Stanford CS229 Lecture 6: Bias and Variance, Regularization, and Model Selection](/posts/ai/2026-10-12-stanford-cs229-lecture-06-bias-variance-regularization-en).

**Next lecture.** [Foundations Lecture 16: Three Learning Principles](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-16-three-learning-principles-en) is the last lecture of Foundations. It teaches no new algorithm and is about the situations in which the guarantees so far break down; this lecture's "contamination" gets a formal name there.

## Course video sources

Original videos: [Model Selection Problem](https://www.youtube.com/watch?v=BRLGPnrcel8), [Validation](https://www.youtube.com/watch?v=RvkCaAwRP8A), [Leave-One-Out Cross Validation](https://www.youtube.com/watch?v=iToz5t0J6WU), [V-Fold Cross Validation](https://www.youtube.com/watch?v=Y8PaLsYm0Ac)

- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

Checked: 2026-10-13. The video IDs, titles, and lengths were taken from the official playlist that day; the videos have no caption track on YouTube, and what this article reports from the lecture comes from transcripts made for it.

## Update Log

- 2026-10-13: Previously combined with Lecture 16 in one article; changed to one article per lecture and rewritten from the handout and the video transcripts.
- 2026-10-10: Marked the video status and checked the recording sources and how they were obtained.
- 2026-10-10: Rechecked the video status. The embedded videos match the lectures in the official playlist.

## References

- [Foundations Lecture 15 handout, 15_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/15_handout.pdf): the main source for this article. The content of the four sections, the four Fun Time questions, and the figures on pages 3, 9, 10, 14, 16, and 19 all come from this handout.
- [Foundations Lecture 4 handout, 04_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/04_handout.pdf): the finite-hypothesis Hoeffding inequality, which this article uses to fill in the derivation of the validation guarantee.
- [Foundations Lecture 9 handout, 09_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/09_handout.pdf): the two formulas for the linear regression learning curve, used to compare against the check with the average predictor.
- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf): the IDs and titles of the four videos; what the text reports as said "in the lecture" is paraphrased from machine transcripts of these four videos.
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/): the official entry for handouts and recordings.
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/): the corresponding week, the 15u slides, and the LFD section.
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/): the corresponding week and LFD section.
- [Fall 2024 Homework 5 (hw5.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw5/hw5.pdf): the content of Q2, Q7, Q8, Q11, and Q12.
- [LIBLINEAR](https://www.csie.ntu.edu.tw/~cjlin/liblinear/) and [LIBSVM datasets: mnist.scale](https://www.csie.ntu.edu.tw/~cjlin/libsvmtools/datasets/multiclass/mnist.scale.bz2): the tool and data used by the programming problems of HW5.
- [Learning from Data textbook website](http://amlbook.com): the source of Section 4.3.
- [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques: Course Overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en): where this lecture sits in the whole course and the reading routes.
