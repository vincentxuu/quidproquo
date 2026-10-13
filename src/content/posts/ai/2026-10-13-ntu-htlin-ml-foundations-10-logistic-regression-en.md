---
title: "Logistic Regression: Learning Probabilities with Gradient Descent | NTU Hsuan-Tien Lin Machine Learning Foundations Lecture 10"
date: 2026-10-13
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, logistic-regression, gradient-descent]
lang: en
math: true
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 10
tldr: "Logistic regression uses θ(wᵀx) to estimate P(+1|x), yet the data contains only circles and crosses. This lecture derives the cross-entropy error ln(1 + exp(−y wᵀx)) from maximum likelihood and uses the chain rule to show that the gradient is a θ-weighted average of −yₙxₙ. Setting the gradient to zero gives a non-linear equation of w with no closed-form solution, so the lecture switches to fixed learning rate gradient descent, w ← w − η∇E_in(w), and walks to the bottom of the valley one step at a time."
description: "A guide to Lecture 10 of NTU Hsuan-Tien Lin's Machine Learning Foundations, Logistic Regression: soft binary classification, the logistic function, deriving cross-entropy from likelihood, the chain-rule derivation of the gradient, why there is no closed-form solution, gradient descent and the fixed learning rate, with the updates on five data points worked out step by step."
draft: false
glossary:
  - term: "logistic function"
    aliases: ["sigmoid", "θ(s)"]
    definition: "θ(s) = 1 / (1 + e⁻ˢ). It squeezes any real-valued score into the range between 0 and 1; it is smooth, monotonic, and S-shaped, with θ(0) = ½ and 1 − θ(s) = θ(−s)."
    context: "Foundations Lecture 10 uses h(x) = θ(wᵀx) as the hypothesis that approximates P(+1|x)."
    links:
      - label: "Foundations Lecture 10 handout"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/10_handout.pdf"
  - term: "cross-entropy error"
    aliases: ["cross-entropy"]
    definition: "The error logistic regression assigns to a single example, err(w, x, y) = ln(1 + exp(−y wᵀx)), with y equal to +1 or −1. It is the per-example term left after taking ln of the likelihood and adding a minus sign."
    context: "Foundations Lecture 10 derives it from maximum likelihood; E_in is its average over the N examples."
    links:
      - label: "Foundations Lecture 10 handout"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/10_handout.pdf"
  - term: "fixed learning rate gradient descent"
    aliases: ["gradient descent"]
    definition: "An iterative optimization method that repeats w ← w − η∇E_in(w). η is a fixed positive number called the learning rate; the length actually stepped is η times the length of the gradient, so a steeper slope means a longer step."
    context: "Foundations Lecture 10 uses it to solve logistic regression, which has no closed-form solution."
    links:
      - label: "Foundations Lecture 10 handout"
        url: "https://www.csie.ntu.edu.tw/~htlin/mooc/doc/10_handout.pdf"
---

> 🌏 [中文版](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-10-logistic-regression)

**Video status: Videos included.** This article is written from the official MOOC handout [10_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/10_handout.pdf) and transcripts of this lecture's four official videos, with formulas following the handout. The transcripts are machine transcripts made for this article (Whisper), not official captions, and no human has proofread them. The videos are taught in Mandarin; the slides are in English. Each section opens with its official video and the approximate time ranges. Page numbers refer to the number at the lower right of each slide (0/25 to 25/25), and wherever the text says "in the lecture" it is paraphrasing what is said in the video.

This is Foundations Lecture 10 in [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en). The Roadmap on page 1 of the handout places it under the third of the four big questions, "How Can Machines Learn?", right after [Foundations Lecture 9: Linear Regression](/posts/ai/2026-09-30-ntu-htlin-ml-linear-logistic-regression-en). The previous lecture takes up a single line on that page: linear regression hypotheses with squared error have the analytic solution $\mathbf{w}_{\text{LIN}} = X^\dagger \mathbf{y}$. In the lecture, Lin opens by saying that Logistic Regression and Linear Regression differ by a single word, and this lecture is about what that word brings.

There are two differences. First, the output should be a probability between 0 and 1, but the data contains no probabilities, only whether something happened or not. Second, the error function that comes out of the derivation cannot be minimized in one step the way linear regression's can; you have to walk there step by step.

The prerequisites are the "set the gradient to zero" solution of linear regression, the update rule from [Foundations Lecture 2: Perceptrons and PLA](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-02-perceptron-learning-algorithm-en), the target distribution $P(y \mid \mathbf{x})$ and pointwise error from [Foundations Lecture 8: Noise and Error Measures](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-08-noise-and-error-en), and partial derivatives, the chain rule, exponentials, and logarithms. After reading, you should be able to go from "pick the hypothesis with the largest likelihood" to the cross-entropy error on your own, compute its gradient with the chain rule, explain why there is no closed-form solution, derive the gradient descent update, and work out a few updates by hand on a small data set.

The derivation in this lecture runs in this order:

1. **Problem**: the target function changes from $\pm 1$ to the probability $P(+1 \mid \mathbf{x})$.
2. **Hypothesis**: the score $\mathbf{w}^\top\mathbf{x}$ goes through a logistic function $\theta$.
3. **Error**: maximum likelihood gives cross-entropy.
4. **Gradient**: the chain rule gives $\nabla E_{\text{in}}(\mathbf{w})$.
5. **Stuck**: the gradient-equals-zero equation cannot be solved.
6. **Algorithm**: gradient descent, one step at a time toward the bottom of the valley.

## Turning the target into a probability: soft binary classification and the logistic hypothesis

```youtube
url: https://www.youtube.com/watch?v=4rPupwSdAac
title: Logistic Regression :: Logistic Regression Problem @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–01:00 reviews the previous lecture, 01:00–04:03 covers the heart disease problem, 04:03–07:47 ideal and actual data, 07:47–13:06 the logistic hypothesis and the logistic function, and Fun Time follows.)

### From "yes or no" to "how much risk"

Page 2 of the handout brings back the learning flow diagram with a hospital example: the input is a patient's age, gender, blood pressure, cholesterol level, and weight (the patient on the slide is 40 years old, male, blood pressure 130/85, cholesterol level 240, weight 70), and the output is "heart disease? yes". This is ordinary binary classification. Foundations Lecture 8 explained that noisy data is described by a target distribution $P(y \mid \mathbf{x})$, and that under the 0/1 error the ideal target function is

$$
f(\mathbf{x}) = \text{sign}\Big(P(+1 \mid \mathbf{x}) - \frac{1}{2}\Big) \in \{-1, +1\}
$$

In other words, it looks at which side of one half the probability falls on. The handout notes that this choice is "because of classification err": what we care about is the fraction of mistakes. In the lecture, Lin adds that, to keep the figure simple, the box for the $P(\mathbf{x})$ that generates the inputs is not drawn.

Page 3 changes one word of the problem: heart disease becomes heart attack, and the output changes from yes to "80% risk". In the lecture, Lin explains that the question a doctor often has to answer is how likely a heart attack (or a cancer recurrence) is some months from now, not merely whether it will happen. What we want to know is then the value $P(+1 \mid \mathbf{x})$ itself, and the target function becomes

$$
f(\mathbf{x}) = P(+1 \mid \mathbf{x}) \in [0, 1]
$$

The handout calls this 'soft' binary classification: the output is no longer a hard circle or cross but a risk value.

### The data we want and the data we can get

To learn an $f$ that outputs probabilities, the ideal data would attach a probability to every $\mathbf{x}_n$. The left column on page 4 of the handout calls this ideal (noiseless) data:

| | ideal (noiseless) data | actual (noisy) data |
|---|---|---|
| Example 1 | $y'_1 = 0.9 = P(+1 \mid \mathbf{x}_1)$ | $y_1 = \circ$, drawn from $P(y \mid \mathbf{x}_1)$ |
| Example 2 | $y'_2 = 0.2 = P(+1 \mid \mathbf{x}_2)$ | $y_2 = \times$, drawn from $P(y \mid \mathbf{x}_2)$ |
| Example $N$ | $y'_N = 0.6 = P(+1 \mid \mathbf{x}_N)$ | $y_N = \times$, drawn from $P(y \mid \mathbf{x}_N)$ |

With the left column, things would be much like regression: find a hypothesis whose predictions at these points are close to 0.9, 0.2, and 0.6. But the left column is not available. In the lecture, Lin uses hospital records to explain: the record says whether the patient had a heart attack two or three months later, and nobody knows whether the probability was 0.9 or 0.2.

So all we have is the right column. The second slide of the same page rewrites the right column as numbers: with 1 for a circle and 0 for a cross, the three examples are $y'_1 = 1$, $y'_2 = 0$, and $y'_N = 0$, each the outcome of "draw once from $P(y \mid \mathbf{x}_n)$; did a circle come up?" In the lecture, Lin reads this as: the actual data is a noisy version of the ideal data. We wanted 0.9 and got 1 after sampling; we wanted 0.2 and got 0; the third example has probability 0.6, larger than one half, yet the sample happened to land on the other side and gave 0, a rather large error.

The handout wraps up in one sentence: "same data as hard binary classification, different target function". The data has exactly the same form as in ordinary binary classification; what is to be learned is different. The question for the rest of the lecture is how to learn a hypothesis that outputs probabilities when all we have is circles and crosses.

### The logistic hypothesis: pass the score through an S-shaped function

The first step of the hypothesis is the same as in earlier lectures (page 5). Write the patient's features as $\mathbf{x} = (x_0, x_1, x_2, \dots, x_d)$, where $x_0$ is the constant term, and compute a weighted "risk score":

$$
s = \sum_{i=0}^{d} w_i x_i = \mathbf{w}^\top\mathbf{x}
$$

Linear regression outputs $s$ directly, but $s$ can be any real number and we want a value between 0 and 1. The approach is to say that a higher score means higher risk, and then use an S-shaped function $\theta$ to convert the score to a probability. The handout calls $\theta$ the logistic function and writes the hypothesis as

$$
h(\mathbf{x}) = \theta(\mathbf{w}^\top\mathbf{x})
$$

In the figure on page 5 the horizontal axis is the score $s$ and the vertical axis runs from 0 to 1. The blue curve starts at the lower left hugging 0, climbs around $s = 0$, and approaches 1 to the right. In the lecture, Lin reads it this way: with a score of 1126, go to 1126 on the horizontal axis, look up to the curve, and read off the value to output; the same goes for a score of $-5$.

### The formula of the logistic function

Page 6 gives the formula:

$$
\theta(s) = \frac{e^{s}}{1 + e^{s}} = \frac{1}{1 + e^{-s}}
$$

The second equality divides the numerator and denominator by $e^s$. The handout lists three values, and the lecture checks them one by one:

- $\theta(0) = \frac{1}{1 + 1} = \frac{1}{2}$, exactly in the middle.
- As $s \to \infty$, using the right-hand form, $e^{-s} \to 0$, so $\theta(s) \to 1$. The lecture uses the left-hand form instead: the numerator and denominator both go to infinity and are about the same size, so the ratio goes to 1; Lin acknowledges that infinity divided by infinity needs a more rigorous definition mathematically.
- As $s \to -\infty$, using the left-hand form, the numerator $e^{s} \to 0$ and the denominator approaches 1, so $\theta(s) \to 0$.

The handout describes it as a "smooth, monotonic, sigmoid function of $s$": smooth (differentiable everywhere), monotonic, and S-shaped. This article plugs in a few numbers to get a feel for how fast it changes:

| $s$ | $-5$ | $-2$ | $-1$ | $0$ | $1$ | $2$ | $5$ |
|---|---|---|---|---|---|---|---|
| $\theta(s)$ | 0.0067 | 0.1192 | 0.2689 | 0.5 | 0.7311 | 0.8808 | 0.9933 |

The output changes fastest for scores between $-2$ and $2$, and beyond $\pm 5$ it is almost flat against 0 or 1. The table also shows a property that will be used later: $\theta(-1) + \theta(1) = 1$ and $\theta(-2) + \theta(2) = 1$; two scores placed symmetrically about zero have outputs that add up to 1.

Putting it together, logistic regression uses

$$
h(\mathbf{x}) = \frac{1}{1 + \exp(-\mathbf{w}^\top\mathbf{x})}
$$

to approximate the target function $f(\mathbf{x}) = P(+1 \mid \mathbf{x})$.

### Fun Time: converting a probability back to circle or cross

**Question (page 7):** Consider any logistic hypothesis $h(\mathbf{x}) = \frac{1}{1 + \exp(-\mathbf{w}^\top\mathbf{x})}$. 'Convert' it to a binary classification prediction by taking $\text{sign}\big(h(\mathbf{x}) - \frac{1}{2}\big)$. What is the equivalent formula for the binary classification prediction?

1. $\text{sign}\big(\mathbf{w}^\top\mathbf{x} - \frac{1}{2}\big)$
2. $\text{sign}\big(\mathbf{w}^\top\mathbf{x}\big)$
3. $\text{sign}\big(\mathbf{w}^\top\mathbf{x} + \frac{1}{2}\big)$
4. none of the above

**Answer: 2.** The handout's reason is that when $\mathbf{w}^\top\mathbf{x} = 0$, $h(\mathbf{x})$ is exactly $\frac{1}{2}$, so thresholding $h$ at $\frac{1}{2}$ is the same as thresholding the score at 0. Filling in the middle step: $\theta$ is strictly increasing, so $\theta(s) > \frac{1}{2} = \theta(0)$ if and only if $s > 0$, and $\theta(s) < \frac{1}{2}$ if and only if $s < 0$.

Choice 1 puts the threshold at a score of $\frac{1}{2}$, which corresponds to the probability $\theta(0.5) \approx 0.622$; that is, it says circle only when the probability exceeds 0.622. Choice 3 puts the threshold at a score of $-\frac{1}{2}$, corresponding to $\theta(-0.5) \approx 0.378$. Neither is the same as "more than one half".

The conclusion the lecture draws from this question is that a logistic hypothesis is really just a counterpart of the earlier binary classification hypothesis. An addition in this article: the boundary is still the hyperplane $\mathbf{w}^\top\mathbf{x} = 0$; what the logistic hypothesis reports in addition is the probability that corresponds to how far the score is from 0.

## Defining the error: from likelihood to cross-entropy

```youtube
url: https://www.youtube.com/watch?v=Uw62i3-Tr4Q
title: Logistic Regression :: Logistic Regression Error @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–01:46 puts the three linear models side by side, 01:46–06:18 covers likelihood, 06:18–09:45 the symmetry of the logistic function and the product form, 09:45–14:47 the rearrangement into cross-entropy, and Fun Time follows.)

### Three linear models, one error missing

Page 8 puts the three models learned so far together. All of them first compute the same linear score $s = \mathbf{w}^\top\mathbf{x}$; they differ in what happens to the score afterwards:

| | linear classification | linear regression | logistic regression |
|---|---|---|---|
| Hypothesis $h(\mathbf{x})$ | $\text{sign}(s)$ | $s$ | $\theta(s)$ |
| Output function in the figure | step | slanted straight line | S-shaped curve |
| Error | 0/1 | squared | ? |
| The handout's reason | plausible (corresponds to small flipping noise) | friendly (easy to minimize) | to be decided |

In the lecture, Lin explains the icons: the box for linear classification shows a step-shaped sign; linear regression shows a slanted line, meaning the score is output unchanged (identity); logistic regression shows an S shape. The reason for the 0/1 error is that it is the most convincing, right or wrong; the reason for the squared error is that it leads to a clean algorithm. The third cell is still empty, and the handout asks "how to define $E_{\text{in}}(\mathbf{w})$ for logistic regression?"

### Likelihood: let h pretend to be f

Page 9 first spells out the relation between the target function and the target distribution. $f(\mathbf{x}) = P(+1 \mid \mathbf{x})$ is equivalent to

$$
P(y \mid \mathbf{x}) = \begin{cases} f(\mathbf{x}) & \text{for } y = +1 \\ 1 - f(\mathbf{x}) & \text{for } y = -1 \end{cases}
$$

because the probabilities of the two outcomes add up to 1.

Now consider a data set $\mathcal{D} = \{(\mathbf{x}_1, \circ), (\mathbf{x}_2, \times), \dots, (\mathbf{x}_N, \times)\}$. What is the probability that $f$ generates this data? Each example is produced by first drawing $\mathbf{x}_n$ and then drawing that label from $P(y \mid \mathbf{x}_n)$; the examples are independent, so the probability of the whole data set is a product:

$$
P(\mathbf{x}_1)P(\circ \mid \mathbf{x}_1) \times P(\mathbf{x}_2)P(\times \mid \mathbf{x}_2) \times \dots \times P(\mathbf{x}_N)P(\times \mid \mathbf{x}_N)
$$

Use the relation above to replace $P(\circ \mid \mathbf{x})$ with $f(\mathbf{x})$ and $P(\times \mid \mathbf{x})$ with $1 - f(\mathbf{x})$:

$$
P(\mathbf{x}_1)f(\mathbf{x}_1) \times P(\mathbf{x}_2)\big(1 - f(\mathbf{x}_2)\big) \times \dots \times P(\mathbf{x}_N)\big(1 - f(\mathbf{x}_N)\big)
$$

But $f$ is unknown. The lecture's move is to let $h$ pretend to be $f$ for a moment: pretend $h$ is the function that generated the data and replace every $f$ in the expression with $h$. That gives "how likely it is that $h$ generates the same data", a quantity called the likelihood:

$$
\text{likelihood}(h) = P(\mathbf{x}_1)h(\mathbf{x}_1) \times P(\mathbf{x}_2)\big(1 - h(\mathbf{x}_2)\big) \times \dots \times P(\mathbf{x}_N)\big(1 - h(\mathbf{x}_N)\big)
$$

The handout then makes two points:

- If $h \approx f$, then $\text{likelihood}(h) \approx$ probability using $f$.
- The probability using $f$ is usually large. In the lecture, Lin explains that the data in hand really was generated by $f$, so in hindsight the probability that $f$ generates this data should not be small, and says this is an intuition.

Put the two together: a good $h$ should have a large likelihood. So the choice on page 10 is

$$
g = \underset{h}{\text{argmax}}\ \text{likelihood}(h)
$$

Among all hypotheses, pick the one with the largest likelihood as $g$.

### Working it once with the handout's three probabilities

What follows is an example made up for this article from the numbers on page 4 of the handout; it is not on the slides. Suppose there are only three examples, the true probabilities are $f(\mathbf{x}_1) = 0.9$, $f(\mathbf{x}_2) = 0.2$, and $f(\mathbf{x}_3) = 0.6$, and the labels drawn are circle, cross, cross. The $P(\mathbf{x}_n)$ part is the same for every hypothesis, so set it aside and compare only the product of the remaining three factors:

| Hypothesis outputs at the three points | Product | Value |
|---|---|---|
| $f$ itself: $(0.9, 0.2, 0.6)$ | $0.9 \times 0.8 \times 0.4$ | 0.288 |
| Close to $f$: $(0.8, 0.3, 0.5)$ | $0.8 \times 0.7 \times 0.5$ | 0.280 |
| Says one half for everything: $(0.5, 0.5, 0.5)$ | $0.5 \times 0.5 \times 0.5$ | 0.125 |
| The opposite of $f$: $(0.1, 0.8, 0.4)$ | $0.1 \times 0.2 \times 0.6$ | 0.012 |

A hypothesis close to $f$ has a likelihood close to $f$'s 0.288; a hypothesis that contradicts $f$ is left with a likelihood of only 0.012. That is what the handout's first point means.

An addition in this article, on something to watch for. If any function were allowed as a hypothesis, $(1, 0, 0)$ would have likelihood $1 \times 1 \times 1 = 1$, higher than $f$'s 0.288: it memorizes the labels it saw and states the probabilities with certainty. So for "the largest likelihood is close to $f$" to hold, the hypothesis set has to be restricted (here to the form $\theta(\mathbf{w}^\top\mathbf{x})$, with finite $d_{\text{VC}}$) and there has to be enough data, the same condition under which the earlier lectures could go from "small $E_{\text{in}}$" to "small $E_{\text{out}}$". The handout's word is "usually", not "always".

### Symmetry: writing circles and crosses as one expression

The likelihood has two kinds of factors: $h(\mathbf{x}_n)$ for a circle and $1 - h(\mathbf{x}_n)$ for a cross. Page 10 unifies them with a property of the logistic function. First verify the property:

$$
1 - \theta(s) = 1 - \frac{1}{1 + e^{-s}} = \frac{e^{-s}}{1 + e^{-s}} = \frac{1}{e^{s} + 1} = \theta(-s)
$$

The third equality multiplies the numerator and denominator by $e^{s}$. For $h(\mathbf{x}) = \theta(\mathbf{w}^\top\mathbf{x})$, this is what the handout writes as

$$
1 - h(\mathbf{x}) = \theta(-\mathbf{w}^\top\mathbf{x}) = h(-\mathbf{x})
$$

The lecture calls this property symmetry and asks the audience to look at the S-shaped curve on the right of the slide and convince themselves it is true. An addition in this article, on what it means in the picture: the curve is symmetric about the point $(0, \frac{1}{2})$, and the heights at $s$ and $-s$ add up to exactly 1.

So the cross factor $1 - h(\mathbf{x}_n)$ can be written as $h(-\mathbf{x}_n)$, and the likelihood becomes

$$
\text{likelihood}(h) = P(\mathbf{x}_1)h(+\mathbf{x}_1) \times P(\mathbf{x}_2)h(-\mathbf{x}_2) \times \dots \times P(\mathbf{x}_N)h(-\mathbf{x}_N)
$$

A circle has label $y_n = +1$ and a cross has $y_n = -1$, so every factor is $h(y_n\mathbf{x}_n)$. The slide draws all the $P(\mathbf{x}_n)$ in gray, and in the lecture Lin explains why: when comparing different $h$, everyone uses the same $\mathbf{x}_1$ through $\mathbf{x}_N$, so this part is the same for every $h$ and does not affect which is larger. Dropping it leaves

$$
\text{likelihood}(\text{logistic } h) \propto \prod_{n=1}^{N} h(y_n\mathbf{x}_n)
$$

The symbol "$\propto$" means proportional to; the constant of proportionality is the product of those $P(\mathbf{x}_n)$.

### Take ln, add a minus sign, divide by N

Page 11 turns "maximize a product" into the familiar "minimize an average error" in four steps.

**Step 1: replace $h$ with $\mathbf{w}$.** Every logistic hypothesis is determined by $\mathbf{w}$, with $h(y_n\mathbf{x}_n) = \theta(y_n\mathbf{w}^\top\mathbf{x}_n)$:

$$
\max_{\mathbf{w}}\ \text{likelihood}(\mathbf{w}) \propto \prod_{n=1}^{N} \theta\big(y_n\mathbf{w}^\top\mathbf{x}_n\big)
$$

**Step 2: take ln.** The lecture's reason is that every $E_{\text{in}}$ handled in earlier lectures was a sum, and products have not been handled; taking the logarithm turns the product into a sum, and since the logarithm is monotonic, the largest stays the largest. The natural logarithm $\ln$ is used to make differentiation convenient later.

$$
\max_{\mathbf{w}}\ \ln\prod_{n=1}^{N} \theta\big(y_n\mathbf{w}^\top\mathbf{x}_n\big) = \max_{\mathbf{w}}\ \sum_{n=1}^{N} \ln\theta\big(y_n\mathbf{w}^\top\mathbf{x}_n\big)
$$

**Step 3: add a minus sign, then multiply by $\frac{1}{N}$.** Everything so far has been a minimization, so a minus sign turns the max into a min. The $\frac{1}{N}$ is gray on the slide; in the lecture, Lin says it is just a constant scaling that treats every $\mathbf{w}$ equally and does not affect the optimal solution, and that it is put in to make the expression look like the earlier $E_{\text{in}}$:

$$
\min_{\mathbf{w}}\ \frac{1}{N}\sum_{n=1}^{N} -\ln\theta\big(y_n\mathbf{w}^\top\mathbf{x}_n\big)
$$

**Step 4: substitute the formula for $\theta$.** $\theta(s) = \frac{1}{1 + \exp(-s)}$, so

$$
-\ln\theta(s) = -\ln\frac{1}{1 + \exp(-s)} = \ln\big(1 + \exp(-s)\big)
$$

The lecture says the same thing: $\theta$ has its expression in the denominator, pulling it out of the logarithm produces another minus sign, and that cancels the minus sign in front. Substituting $s = y_n\mathbf{w}^\top\mathbf{x}_n$:

$$
\min_{\mathbf{w}}\ \underbrace{\frac{1}{N}\sum_{n=1}^{N} \ln\Big(1 + \exp\big(-y_n\mathbf{w}^\top\mathbf{x}_n\big)\Big)}_{E_{\text{in}}(\mathbf{w})}
$$

Each term in the sum depends on a single example; it is the pointwise error measure from Foundations Lecture 8. The handout calls it the cross-entropy error:

$$
\text{err}(\mathbf{w}, \mathbf{x}, y) = \ln\Big(1 + \exp\big(-y\mathbf{w}^\top\mathbf{x}\big)\Big)
$$

$E_{\text{in}}$ is its average over the $N$ examples. The summary on page 25 of the handout gives it another name, negative log likelihood, which is exactly the three operations just performed.

Back to the three-example calculation: $f$ itself gives $-\frac{1}{3}\ln(0.288) \approx 0.415$, and the hypothesis that says one half for everything gives $-\frac{1}{3}\ln(0.125) = \ln 2 \approx 0.693$. A larger likelihood means a smaller error, with the ranking exactly reversed, so minimizing $E_{\text{in}}$ and maximizing the likelihood pick the same hypothesis.

### The shape and the name of cross-entropy

The error is determined by the single number $ys = y\mathbf{w}^\top\mathbf{x}$. $ys > 0$ means the sign of the score agrees with the label (as a classifier it is correct), and $ys < 0$ means it is wrong. This article computes a few values:

| $y\mathbf{w}^\top\mathbf{x}$ | $-5$ | $-2$ | $-1$ | $0$ | $1$ | $2$ | $5$ |
|---|---|---|---|---|---|---|---|
| err | 5.0067 | 2.1269 | 1.3133 | 0.6931 | 0.3133 | 0.1269 | 0.0067 |

Three observations. When the example is classified correctly, the farther the score is from 0 the closer the error gets to 0, but it is never exactly 0. At $ys = 0$ the error is $\ln 2 \approx 0.6931$, the price paid when the hypothesis says "fifty-fifty". On the wrong side, the error is almost as large as $-ys$ (5.0067 at $ys = -5$): the worse the mistake, the heavier the penalty, with no upper limit.

As for where the name comes from, the lecture says only that there are historical reasons, does not go into the details, and suggests that students with a reference book look it up. An addition in this article: a way of writing the error that makes the name visible, derived using only the formulas above. Relabel the examples as $y' = 1$ (circle) or $y' = 0$ (cross), and write $h = h(\mathbf{x})$:

- When $y = +1$, $\text{err} = \ln(1 + e^{-s}) = -\ln\theta(s) = -\ln h$.
- When $y = -1$, $\text{err} = \ln(1 + e^{s}) = -\ln\theta(-s) = -\ln(1 - h)$.

The two cases combine into one line:

$$
\text{err} = -\Big[y'\ln h + (1 - y')\ln(1 - h)\Big]
$$

Fall 2024 HW4 Q1 tests exactly this equivalent form after relabeling, and the problem also explains that the name cross-entropy comes from the form $p\log q + (1 - p)\log(1 - q)$.

### Fun Time: four properties of cross-entropy

**Question (page 12):** The four statements below help us understand more about the cross-entropy error $\text{err}(\mathbf{w}, \mathbf{x}, y) = \ln\big(1 + \exp(-y\mathbf{w}^\top\mathbf{x})\big)$. Consider $\mathbf{w}^\top\mathbf{x} \ne 0$. Which statement is not true?

1. For any $\mathbf{w}$, $\mathbf{x}$, and $y$, $\text{err}(\mathbf{w}, \mathbf{x}, y) > 0$.
2. For any $\mathbf{w}$, $\mathbf{x}$, and $y$, $\text{err}(\mathbf{w}, \mathbf{x}, y) < 1126$.
3. When $y = \text{sign}(\mathbf{w}^\top\mathbf{x})$, $\text{err}(\mathbf{w}, \mathbf{x}, y) < \ln 2$.
4. When $y \ne \text{sign}(\mathbf{w}^\top\mathbf{x})$, $\text{err}(\mathbf{w}, \mathbf{x}, y) \ge \ln 2$.

**Answer: 2.** The handout's answer is "1126, really? :-)", and it encourages plotting the curve of the error with respect to some fixed $y$ and a varying score $s = \mathbf{w}^\top\mathbf{x}$; after plotting, it is easy to see that the error is not bounded above and that the other three choices are correct. In the lecture, Lin jokes that a choice containing a strange number is usually the wrong one. The four choices are reasoned through one by one below, writing $t = y\mathbf{w}^\top\mathbf{x}$:

- **Choice 1 is true.** $\exp(-t) > 0$, so $1 + \exp(-t) > 1$, and its $\ln$ is greater than 0.
- **Choice 2 is false.** Take $t = -1126$ (for example, in one dimension, $w = 1126$, $x = 1$, $y = -1$); then $\text{err} = \ln(1 + e^{1126}) > \ln(e^{1126}) = 1126$. Push $t$ further in the negative direction and the error can be as large as you like.
- **Choice 3 is true.** $y$ and the score have the same sign, so $t > 0$, $\exp(-t) < 1$, and $\text{err} < \ln 2$.
- **Choice 4 is true.** $y$ and the score have opposite signs, so $t < 0$, $\exp(-t) > 1$, and $\text{err} > \ln 2$, which certainly satisfies "$\ge$".

The lecture singles out choices 3 and 4: a score of 0 is the switching point, with the error above $\ln 2$ on one side and held below $\ln 2$ on the other.

## What the gradient looks like, and why there is no closed-form solution

```youtube
url: https://www.youtube.com/watch?v=IZttt_v5tSw
title: Logistic Regression :: Gradient of Logistic Regression Error @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–01:38 covers the properties of $E_{\text{in}}$, 01:38–07:28 derives the gradient with the chain rule, 07:28–10:30 explains why there is no closed-form solution, 10:30–14:12 revisits PLA and iterative optimization, and Fun Time follows.)

### E_in is a valley

With $E_{\text{in}}$ in hand, what remains is finding the $\mathbf{w}$ that minimizes it. The lecture first recalls why: this set of hypotheses has a finite VC dimension (see [Foundations Lecture 7: The VC Dimension](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error-en)), so making $E_{\text{in}}$ small makes $E_{\text{out}}$ small too. Two minimization methods have been learned so far: the mistake-correcting approach of linear classification, and linear regression's "compute the gradient and find where it is zero". The latter applies to smooth, differentiable functions.

Page 13 says the $E_{\text{in}}$ of logistic regression is continuous, differentiable, twice-differentiable, and convex. A convex function looks like a valley, and the bottom of the valley is where the gradient is zero, so the goal is the same as in linear regression:

$$
\text{want}\quad \nabla E_{\text{in}}(\mathbf{w}) = \mathbf{0}
$$

The handout does not prove "convex". In the lecture, Lin says the proof computes the matrix of second derivatives and confirms that it is positive definite, does not carry it out, and asks the audience to take it on trust for now. The check below is an addition in this article and is not on the slides; it uses the gradient derived in the subsection "Peeling the onion with the chain rule", and can be skipped on a first reading. Differentiating the gradient once more, with $\theta'(s) = \theta(s)\big(1 - \theta(s)\big)$ and $y_n^2 = 1$, gives the matrix of second derivatives

$$
\nabla^2 E_{\text{in}}(\mathbf{w}) = \frac{1}{N}\sum_{n=1}^{N} \theta\big(\mathbf{w}^\top\mathbf{x}_n\big)\Big(1 - \theta\big(\mathbf{w}^\top\mathbf{x}_n\big)\Big)\mathbf{x}_n\mathbf{x}_n^\top
$$

For any vector $\mathbf{u}$, $\mathbf{u}^\top\mathbf{x}_n\mathbf{x}_n^\top\mathbf{u} = (\mathbf{u}^\top\mathbf{x}_n)^2 \ge 0$, and the coefficient $\theta(1 - \theta)$ in front is positive, so $\mathbf{u}^\top\nabla^2 E_{\text{in}}\,\mathbf{u} \ge 0$. This is positive semi-definiteness, which is already enough to guarantee that $E_{\text{in}}$ is convex. The "positive definite" mentioned in the lecture needs one more condition: the $\mathbf{x}_n$ must span the whole $(d + 1)$-dimensional space, so that the expression above is strictly greater than 0 for every nonzero $\mathbf{u}$.

### Peeling the onion with the chain rule

$E_{\text{in}}$ contains an $\ln$, an $\exp$, and $\mathbf{w}$. The lecture's attitude is not to be afraid: differentiation has no secret trick, and doing it one layer at a time and stringing the layers together is the chain rule. Page 14 first gives temporary names to the intermediate quantities:

$$
E_{\text{in}}(\mathbf{w}) = \frac{1}{N}\sum_{n=1}^{N} \ln\Big(\underbrace{1 + \exp(\overbrace{-y_n\mathbf{w}^\top\mathbf{x}_n}^{\bigcirc})}_{\square}\Big)
$$

The piece inside the exponential is called $\bigcirc$, and the whole piece inside the $\ln$ is called $\square$. In the lecture, Lin explains why shapes are used instead of A, B, C: thinking of them as a circle and a square makes it easier to remember that they are only temporary intermediate values.

The $i$-th component of the gradient is the partial derivative with respect to $w_i$. The chain rule splits it into three parentheses, which the lecture likens to peeling an onion from the outermost layer inward:

$$
\frac{\partial E_{\text{in}}(\mathbf{w})}{\partial w_i} = \frac{1}{N}\sum_{n=1}^{N} \Big(\frac{\partial \ln(\square)}{\partial \square}\Big)\Big(\frac{\partial\big(1 + \exp(\bigcirc)\big)}{\partial \bigcirc}\Big)\Big(\frac{\partial\,(-y_n\mathbf{w}^\top\mathbf{x}_n)}{\partial w_i}\Big)
$$

Each of the three parentheses is simple:

1. The derivative of $\ln(\square)$ with respect to $\square$ is $\frac{1}{\square}$.
2. The derivative of $1 + \exp(\bigcirc)$ with respect to $\bigcirc$: the constant 1 vanishes, and the derivative of $\exp(\bigcirc)$ is still $\exp(\bigcirc)$.
3. $-y_n\mathbf{w}^\top\mathbf{x}_n = -y_n\sum_j w_j x_{n,j}$; only the $j = i$ term of the sum contains $w_i$, so the derivative is $-y_n x_{n,i}$. The lecture reminds the audience not to drop the minus sign.

Substituting back:

$$
\frac{\partial E_{\text{in}}(\mathbf{w})}{\partial w_i} = \frac{1}{N}\sum_{n=1}^{N} \Big(\frac{1}{\square}\Big)\Big(\exp(\bigcirc)\Big)\Big(-y_n x_{n,i}\Big) = \frac{1}{N}\sum_{n=1}^{N} \Big(\frac{\exp(\bigcirc)}{1 + \exp(\bigcirc)}\Big)\Big(-y_n x_{n,i}\Big)
$$

The second equality merges the first two parentheses and replaces $\square$ with $1 + \exp(\bigcirc)$. The merged $\frac{\exp(\bigcirc)}{1 + \exp(\bigcirc)}$ is exactly the first form of the logistic function, which the lecture calls our new friend $\theta$:

$$
\frac{\partial E_{\text{in}}(\mathbf{w})}{\partial w_i} = \frac{1}{N}\sum_{n=1}^{N} \theta(\bigcirc)\big(-y_n x_{n,i}\big)
$$

The $\theta(\bigcirc)$ is the same for every component; only the final $x_{n,i}$ changes with $i$. Stacking the results for $i = 0, 1, \dots, d$ into a vector stacks the $x_{n,i}$ into $\mathbf{x}_n$:

$$
\nabla E_{\text{in}}(\mathbf{w}) = \frac{1}{N}\sum_{n=1}^{N} \theta\big(-y_n\mathbf{w}^\top\mathbf{x}_n\big)\big(-y_n\mathbf{x}_n\big)
$$

How to read it: each example contributes a vector $-y_n\mathbf{x}_n$, multiplied by a weight between 0 and 1, $\theta(-y_n\mathbf{w}^\top\mathbf{x}_n)$, and everything is averaged. Page 15 of the handout calls it a "scaled $\theta$-weighted sum of $-y_n\mathbf{x}_n$".

An addition in this article, on what the weight means. By symmetry, $\theta(-y_n\mathbf{w}^\top\mathbf{x}_n) = 1 - \theta(y_n\mathbf{w}^\top\mathbf{x}_n) = 1 - h(y_n\mathbf{x}_n)$, and $h(y_n\mathbf{x}_n)$ is the probability the current hypothesis assigns to "this example appearing with its actual label". So the weight is the probability the hypothesis assigns to this label not appearing: the more surprised the hypothesis is, the louder this example speaks in the gradient.

### Setting the gradient to zero cannot be solved

Now solve $\nabla E_{\text{in}}(\mathbf{w}) = \mathbf{0}$ (page 15). When is a weighted sum the zero vector? The handout distinguishes two cases.

**Case 1: all the weights $\theta(\cdot)$ are 0.** $\theta$ approaches 0 only when its argument goes to $-\infty$, so every example needs $-y_n\mathbf{w}^\top\mathbf{x}_n \to -\infty$. The handout writes this as "only if $y_n\mathbf{w}^\top\mathbf{x}_n \gg 0$", and the lecture adds that strictly speaking it has to go to positive infinity. $y_n\mathbf{w}^\top\mathbf{x}_n > 0$ means the label and the score have the same sign, so this $\mathbf{w}$ classifies example $n$ correctly; for that to hold for every example, the data must be linearly separable. The lecture puts it the other way round: if the data is not linearly separable, then for any $\mathbf{w}$ at least one example has $y_n\mathbf{w}^\top\mathbf{x}_n$ below 0, and this route is closed.

**Case 2: the weights are not all 0, but the weighted sum happens to cancel out.** What has to be solved is then an equation in $\mathbf{w}$, and $\mathbf{w}$ appears inside $\theta$, so it is a non-linear equation of $\mathbf{w}$.

Compare with linear regression: there the gradient is $\frac{2}{N}(X^\top X\mathbf{w} - X^\top\mathbf{y})$, and setting it to zero gives a linear equation of the form "a matrix times $\mathbf{w}$ equals some vector", which we know how to solve, so the answer comes in a single step. The equation here is not linear. The handout concludes "closed-form solution? no :-(". In the lecture, Lin says that, as far as Lin knows, there is no closed-form solution as neat as linear regression's.

### Looking back at PLA: iterative optimization

If the answer cannot be reached in one step, go back and look for a method that corrects itself step by step, and that is PLA. Page 16 reviews PLA: start from some $\mathbf{w}_0$ (say, the zero vector), and for $t = 0, 1, \dots$:

1. Find a mistake of $\mathbf{w}_t$, called $(\mathbf{x}_{n(t)}, y_{n(t)})$, that is, $\text{sign}(\mathbf{w}_t^\top\mathbf{x}_{n(t)}) \ne y_{n(t)}$.
2. Correct it: $\mathbf{w}_{t+1} \leftarrow \mathbf{w}_t + y_{n(t)}\mathbf{x}_{n(t)}$.

When it stops, return the last $\mathbf{w}$. The same page merges the two steps into one: pick some $n$, and then

$$
\mathbf{w}_{t+1} \leftarrow \mathbf{w}_t + \big[\!\big[\text{sign}(\mathbf{w}_t^\top\mathbf{x}_n) \ne y_n\big]\!\big]\, y_n\mathbf{x}_n
$$

The double square brackets are a boolean operation: 1 if the condition holds, 0 if it does not. If the chosen point is misclassified, the factor is 1 and $y_n\mathbf{x}_n$ is added as usual; if the chosen point is classified correctly, the factor is 0 and nothing is updated. The lecture asks the audience to confirm for themselves that this is the same as the original two steps.

Now split this expression into two parts:

$$
\mathbf{w}_{t+1} \leftarrow \mathbf{w}_t + \underbrace{1}_{\eta} \cdot \underbrace{\Big(\big[\!\big[\text{sign}(\mathbf{w}_t^\top\mathbf{x}_n) \ne y_n\big]\!\big] \cdot y_n\mathbf{x}_n\Big)}_{\mathbf{v}}
$$

$\mathbf{v}$ is the direction of the update, and $\eta$ is how large a step to take in that direction. In the lecture, Lin says $\eta$ is a constant quietly slipped in here: PLA does not single out the step size, which amounts to always stepping 1, and its importance only shows up in the gradient descent section.

The handout's conclusion is "choice of $(\eta, \mathbf{v})$ and stopping condition defines iterative optimization approach". Different directions, different step sizes, and different stopping conditions give different iterative optimization methods. PLA is one of them, and gradient descent will be another.

### Fun Time: who has the largest weight in the gradient

**Question (page 17):** Consider the gradient $\nabla E_{\text{in}}(\mathbf{w}) = \frac{1}{N}\sum_{n=1}^{N} \theta(-y_n\mathbf{w}^\top\mathbf{x}_n)(-y_n\mathbf{x}_n)$. That is, each example $(\mathbf{x}_n, y_n)$ contributes to the gradient by an amount of $\theta(-y_n\mathbf{w}^\top\mathbf{x}_n)$. For any given $\mathbf{w}$, which example contributes the most amount to the gradient?

1. the example with the smallest $y_n\mathbf{w}^\top\mathbf{x}_n$ value
2. the example with the largest $y_n\mathbf{w}^\top\mathbf{x}_n$ value
3. the example with the smallest $\mathbf{w}^\top\mathbf{x}_n$ value
4. the example with the largest $\mathbf{w}^\top\mathbf{x}_n$ value

**Answer: 1.** The handout's reason is that $\theta$ is monotonic. Spelled out: $\theta$ is increasing, so the largest $\theta(-y_n\mathbf{w}^\top\mathbf{x}_n)$ is the same as the largest $-y_n\mathbf{w}^\top\mathbf{x}_n$, that is, the smallest $y_n\mathbf{w}^\top\mathbf{x}_n$.

Choice 2 is the example with the smallest weight, the one classified most correctly and most confidently. Choices 3 and 4 look only at the score and not at the label: a point with a very low score whose label is $-1$ has a large positive $y_n\mathbf{w}^\top\mathbf{x}_n$ and a small weight, so the score alone cannot decide.

The lecture's reading is this: the example with the smallest $y_n\mathbf{w}^\top\mathbf{x}_n$ may have a very negative value, and negative means $\mathbf{w}$ makes a mistake on this example, so the mistaken points get especially large weights. This resembles PLA's "pick a mistaken point and correct it": PLA looks at one mistake, while the gradient combines every point, whether its mistake is big or small.

An addition in this article: the question asks about the weight $\theta$. The vector actually added into the gradient is $\theta(\cdot)\,(-y_n\mathbf{x}_n)$, whose length is further multiplied by $\lVert\mathbf{x}_n\rVert$, so the point with the largest weight is not necessarily the point with the longest vector.

## Gradient descent: which way each step goes and how far

```youtube
url: https://www.youtube.com/watch?v=X9NTihvSdjw
title: Logistic Regression :: Gradient Descent @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–03:45 covers rolling the ball downhill and the greedy choice, 03:45–09:26 the linear approximation and the best direction, 09:26–14:47 the choice of $\eta$ and the fixed learning rate, 14:47–16:48 the full algorithm, 16:48–17:54 Fun Time, and the summary follows.)

### The greedy choice: the largest drop in one step

The skeleton of iterative optimization is (page 18): for $t = 0, 1, \dots$, do $\mathbf{w}_{t+1} \leftarrow \mathbf{w}_t + \eta\mathbf{v}$, and when it stops, return the last $\mathbf{w}$. PLA's $\mathbf{v}$ comes from mistake correction. The $E_{\text{in}}$ of logistic regression is a smooth valley, and the handout's idea is to "choose $\mathbf{v}$ to get the ball roll 'downhill'": in the lecture, Lin asks the audience to imagine placing a ball somewhere on the slope (corresponding to some $\mathbf{w}$) and letting it roll; where it reaches the bottom of the valley is where the gradient is zero.

To make the derivation easier, start with two assumptions:

- The direction $\mathbf{v}$ has unit length, $\lVert\mathbf{v}\rVert = 1$. In the lecture, Lin explains that all the information about how big a step to take goes into $\eta$, and $\mathbf{v}$ handles only the direction.
- The step size $\eta$ is positive.

For some given $\eta > 0$, the greedy approach picks the direction that makes $E_{\text{in}}$ drop the most in this step:

$$
\min_{\lVert\mathbf{v}\rVert = 1}\ E_{\text{in}}(\underbrace{\mathbf{w}_t + \eta\mathbf{v}}_{\mathbf{w}_{t+1}})
$$

The picture given in the lecture: think of $\eta$ as a limit of the human body, a stride of at most 30 centimeters; you have to choose a place to put your foot on the circle of radius 30 centimeters centered on yourself. In practice this circle may live in a space of many dimensions.

### Linear approximation: look only at a short segment

Page 19 points out that this problem is no simpler: it is "still non-linear optimization, now with constraints", the constraint being $\lVert\mathbf{v}\rVert = 1$, and "not any easier than $\min_{\mathbf{w}} E_{\text{in}}(\mathbf{w})$".

The way out is to make it linear. In the lecture, Lin explains that the easy problems we have learned all involve linear expressions, and that any winding curve, looked at over a very short stretch, is no different from a short line segment. Mathematically this is the Taylor expansion. The one-dimensional version is $f(x + \delta) \approx f(x) + f'(x)\,\delta$; the multi-dimensional version replaces the slope with the gradient and the displacement $\delta$ with $\eta\mathbf{v}$:

$$
E_{\text{in}}(\mathbf{w}_t + \eta\mathbf{v}) \approx E_{\text{in}}(\mathbf{w}_t) + \eta\,\mathbf{v}^\top\nabla E_{\text{in}}(\mathbf{w}_t)
$$

The handout notes the condition: "if $\eta$ really small". The lecture's explanation: when the curve bends a lot, a long segment ends up far from the curve; the segment has to be short for the approximation to be good.

Replacing the original expression with the approximation gives the "approximate greedy approach":

$$
\min_{\lVert\mathbf{v}\rVert = 1}\ \underbrace{E_{\text{in}}(\mathbf{w}_t)}_{\text{known}} + \underbrace{\eta}_{\text{given positive}}\ \mathbf{v}^\top\underbrace{\nabla E_{\text{in}}(\mathbf{w}_t)}_{\text{known}}
$$

$E_{\text{in}}(\mathbf{w}_t)$ is a constant that does not depend on $\mathbf{v}$; $\eta$ is already given and positive, so it does not change which choice is smallest. The slide draws these two terms in gray. All that really has to be solved is:

$$
\min_{\lVert\mathbf{v}\rVert = 1}\ \mathbf{v}^\top\nabla E_{\text{in}}(\mathbf{w}_t)
$$

### The best direction is opposite to the gradient

When is the inner product of a unit vector with a known vector smallest? The lecture's analogy is two people who have quarrelled and keep as far apart as they can: the inner product is most negative when the directions are exactly opposite.

This article writes the step out in full. Let $\mathbf{g} = \nabla E_{\text{in}}(\mathbf{w}_t)$ and let $\phi$ be the angle between the two vectors; then $\mathbf{v}^\top\mathbf{g} = \lVert\mathbf{v}\rVert\,\lVert\mathbf{g}\rVert\cos\phi = \lVert\mathbf{g}\rVert\cos\phi$. The smallest value of $\cos\phi$ is $-1$, reached at $\phi = 180^\circ$, that is, when $\mathbf{v}$ points in the direction of $-\mathbf{g}$. Then scale the length to 1 (page 20):

$$
\mathbf{v} = -\frac{\nabla E_{\text{in}}(\mathbf{w}_t)}{\lVert\nabla E_{\text{in}}(\mathbf{w}_t)\rVert}
$$

Now $\mathbf{v}^\top\mathbf{g} = -\lVert\mathbf{g}\rVert$, and the approximation says $E_{\text{in}}$ drops by about $\eta\lVert\mathbf{g}\rVert$. Substituting back into the update gives gradient descent: for small $\eta$,

$$
\mathbf{w}_{t+1} \leftarrow \mathbf{w}_t - \eta\,\frac{\nabla E_{\text{in}}(\mathbf{w}_t)}{\lVert\nabla E_{\text{in}}(\mathbf{w}_t)\rVert}
$$

The handout's comment on it is "a simple & popular optimization tool". The lecture adds that it can be used whenever the gradient can be computed.

### η too small, too large, just right

With the direction settled, next comes $\eta$. Page 21 compares three figures, all of the same valley:

| Figure | What it shows | The handout's comment |
|---|---|---|
| too small | many tiny stairs drawn down the left slope, descending slowly one stair at a time | too slow :-( |
| too large | a zigzag line jumping back and forth between the left and right slopes | too unstable :-( |
| just right | large steps where the slope is steep high up (labeled large $\eta$) and small steps near the bottom (labeled small $\eta$) | use changing $\eta$ |

The lecture describes the three cases as three ways of walking. Someone with a very small $\eta$ is conservative, crawling like a snail; they will get there eventually, only slowly. Someone with a very large $\eta$ believes they are walking on a short line segment, but with a big stride the linear approximation is no longer accurate, and they miss their footing and fall onto the opposite slope. Nothing guarantees that the landing point is lower; it might even be higher. Because the Taylor expansion no longer applies, nobody knows what happens after a very large step.

The idea of the third figure is that $\eta$ should change with the slope. The lecture's reasoning: where the slope is steep it is safe to stride a bit farther; where the slope is already gentle, a very large stride may carry you past the optimum in one go. This is a heuristic that feels reasonable, and the handout writes it as

$$
\eta \text{ better be monotonic of } \lVert\nabla E_{\text{in}}(\mathbf{w}_t)\rVert
$$

The slope is the length of the gradient, and the step size should go up and down with it.

### Fixed learning rate: cancelling the two lengths

Page 22 gives the simplest way to do this: make the step size proportional to the length of the gradient. The slide uses color to tell two $\eta$'s apart: the original step size is red and the ratio is purple. Here the red one is written $\eta_{\text{red}}$ and the purple one $\eta$ (the subscript is this article's addition):

$$
\eta_{\text{red}} = \eta \cdot \lVert\nabla E_{\text{in}}(\mathbf{w}_t)\rVert
$$

Substituting into the gradient descent update, the gradient lengths in the numerator and denominator cancel:

$$
\mathbf{w}_{t+1} \leftarrow \mathbf{w}_t - \eta_{\text{red}}\,\frac{\nabla E_{\text{in}}(\mathbf{w}_t)}{\lVert\nabla E_{\text{in}}(\mathbf{w}_t)\rVert} = \mathbf{w}_t - \eta\,\nabla E_{\text{in}}(\mathbf{w}_t)
$$

In the lecture, Lin says the ratio is named purple because it mixes the red $\eta$ and the blue gradient. The result is a simpler update: there is no need to normalize the gradient, just multiply it by a fixed $\eta$. This $\eta$ is called the fixed learning rate, and the method is fixed learning rate gradient descent:

$$
\mathbf{w}_{t+1} \leftarrow \mathbf{w}_t - \eta\,\nabla E_{\text{in}}(\mathbf{w}_t)
$$

What is "fixed" is the ratio $\eta$. The length actually stepped is $\eta\lVert\nabla E_{\text{in}}(\mathbf{w}_t)\rVert$, which still changes: a steep slope means a long step, and near the bottom of the valley the gradient approaches zero and the step shrinks automatically. On the name, the lecture explains that "learning rate" was coined by machine learning people, and optimization people do not necessarily call it that; a small $\eta$ learns slowly, a somewhat larger $\eta$ learns faster, and one that is too large is unstable.

### The logistic regression algorithm

Page 23 puts everything together:

1. Initialize $\mathbf{w}_0$.
2. For $t = 0, 1, \dots$:
   1. Compute the gradient $\nabla E_{\text{in}}(\mathbf{w}_t) = \frac{1}{N}\sum_{n=1}^{N} \theta\big(-y_n\mathbf{w}_t^\top\mathbf{x}_n\big)\big(-y_n\mathbf{x}_n\big)$.
   2. Update by $\mathbf{w}_{t+1} \leftarrow \mathbf{w}_t - \eta\,\nabla E_{\text{in}}(\mathbf{w}_t)$.
3. Until $\nabla E_{\text{in}}(\mathbf{w}_{t+1}) = \mathbf{0}$, or enough iterations.
4. Return the last $\mathbf{w}_{t+1}$ as $g$.

For the stopping condition, the handout writes that the gradient equals zero. The lecture is more practical: with floating-point arithmetic an exact 0 is hard to get, so usually the gradient is only required to be close enough to zero (roughly at the bottom is good enough); another common condition is to stop after enough steps and pretend to have reached a reasonably good place.

The last line on the slide is "similar time complexity to pocket per iteration". The lecture explains: the most expensive part of each iteration is computing the gradient, which averages the contributions of all $N$ examples; pocket also uses all $N$ examples in each iteration to check whether the new $\mathbf{w}$ has a good enough $E_{\text{in}}$, so the two cost about the same.

### Numerical example: five patients, two steps by hand, then run to the bottom

What follows is an example made up for this article, not from the slides; the numbers were verified with Python. It keeps the heart attack setting but only one feature: $x_1$ is the standardized score of some lab test, and $y = +1$ means the patient later had a heart attack. With $x_0 = 1$ added, $\mathbf{x} = (1, x_1)$ and $\mathbf{w} = (w_0, w_1)$.

| $n$ | $x_1$ | $y_n$ | $-y_n\mathbf{x}_n$ |
|---|---|---|---|
| 1 | $-2$ | $-1$ | $(1, -2)$ |
| 2 | $-1$ | $-1$ | $(1, -1)$ |
| 3 | $0$ | $+1$ | $(-1, 0)$ |
| 4 | $1$ | $-1$ | $(1, 1)$ |
| 5 | $2$ | $+1$ | $(-1, -2)$ |

People with a high test value have heart attacks more often, but patient 3 (a middling value, yet a heart attack) and patient 4 (a fairly high value, yet fine) break the ordering. No threshold classifies all five correctly; the data is not linearly separable.

**Step 0: $\mathbf{w}_0 = (0, 0)$, $\eta = 0.1$.** Every example has score 0 and weight $\theta(0) = 0.5$, and $E_{\text{in}}(\mathbf{w}_0) = \ln 2 \approx 0.6931$. The gradient is

$$
\nabla E_{\text{in}}(\mathbf{w}_0) = \frac{1}{5}\cdot 0.5\cdot\Big[(1,-2) + (1,-1) + (-1,0) + (1,1) + (-1,-2)\Big] = \frac{0.5}{5}(1, -4) = (0.1, -0.4)
$$

Update:

$$
\mathbf{w}_1 = (0, 0) - 0.1 \times (0.1, -0.4) = (-0.01, 0.04)
$$

$w_1$ becomes positive, meaning a higher test value means higher risk; the direction is right.

**Step 1: compute the gradient at $\mathbf{w}_1 = (-0.01, 0.04)$.** The five weights are now different:

| $n$ | Score $\mathbf{w}_1^\top\mathbf{x}_n$ | $y_n\mathbf{w}_1^\top\mathbf{x}_n$ | Weight $\theta(-y_n\mathbf{w}_1^\top\mathbf{x}_n)$ |
|---|---|---|---|
| 1 | $-0.09$ | $0.09$ | 0.4775 |
| 2 | $-0.05$ | $0.05$ | 0.4875 |
| 3 | $-0.01$ | $-0.01$ | 0.5025 |
| 4 | $0.03$ | $-0.03$ | 0.5075 |
| 5 | $0.07$ | $0.07$ | 0.4825 |

Examples 3 and 4 have negative $y_n\mathbf{w}^\top\mathbf{x}_n$: they are misclassified, and their weights exceed 0.5. Example 4 has the smallest value and the largest weight, consistent with the conclusion of "Fun Time: who has the largest weight in the gradient". Multiply each weight by its $-y_n\mathbf{x}_n$ and average:

$$
\begin{aligned}
\text{first component} &= \tfrac{1}{5}\big(0.4775 + 0.4875 - 0.5025 + 0.5075 - 0.4825\big) = \tfrac{0.4875}{5} = 0.0975 \\
\text{second component} &= \tfrac{1}{5}\big(-2(0.4775) - 0.4875 + 0 + 0.5075 - 2(0.4825)\big) = \tfrac{-1.9000}{5} = -0.3800
\end{aligned}
$$

Update:

$$
\mathbf{w}_2 = (-0.01, 0.04) - 0.1 \times (0.0975, -0.3800) = (-0.0198, 0.0780)
$$

$E_{\text{in}}$ at the three points in time is 0.6931, 0.6766, and 0.6615, dropping at every step.

**Running to the bottom.** Continuing with $\eta = 0.1$, the gradient length falls below $10^{-3}$ at step 344, and the run finally converges to

$$
\mathbf{w} \approx (-0.6227, 1.0904),\qquad E_{\text{in}} \approx 0.4844
$$

| $n$ | $x_1$ | $y_n$ | $h(\mathbf{x}_n) = \theta(\mathbf{w}^\top\mathbf{x}_n)$ | Weight $\theta(-y_n\mathbf{w}^\top\mathbf{x}_n)$ |
|---|---|---|---|---|
| 1 | $-2$ | $-1$ | 0.057 | 0.057 |
| 2 | $-1$ | $-1$ | 0.153 | 0.153 |
| 3 | $0$ | $+1$ | 0.349 | 0.651 |
| 4 | $1$ | $-1$ | 0.615 | 0.615 |
| 5 | $2$ | $+1$ | 0.826 | 0.174 |

**What this result means.**

- The model reports risk: about 6% for a test value of $-2$ and about 83% for $+2$. Thresholding at one half, as in "Fun Time: converting a probability back to circle or cross", puts the boundary at $x_1 = 0.6227 / 1.0904 \approx 0.571$; examples 3 and 4 are still misclassified, and the 0/1 error is $\frac{2}{5}$. The risks of these two are estimated as 0.349 and 0.615, both not far from one half; the model was never confident about them.
- The likelihood rises from $0.5^5 = 0.03125$ at $\mathbf{w}_0$ to $e^{-5 \times 0.4844} \approx 0.0887$.
- The gradient is zero by way of Case 2 from the subsection "Setting the gradient to zero cannot be solved". None of the weights is 0; the weighted sum cancels: the first component is $0.057 + 0.153 - 0.651 + 0.615 - 0.174 = 0$, and the second is $-2(0.057) - 0.153 + 0.615 - 2(0.174) \approx 0$. The two misclassified examples have the largest weights and pull the three correctly classified ones to a draw.

**Trying different $\eta$.** Same data, same start at $\mathbf{w}_0 = (0, 0)$, changing only the fixed learning rate:

| $\eta$ | $E_{\text{in}}$ after step 1 | Steps until the gradient length falls below $10^{-3}$ | What happens |
|---|---|---|---|
| 0.01 | 0.6915 | 3,460 | each step drops only a tiny bit, the handout's too slow |
| 0.1 | 0.6766 | 344 | steady descent |
| 1 | 0.5634 | 32 | steady descent, ten times faster |
| 3 | 0.4955 | 8 | the fastest of the values in this table (trying others, $\eta = 4$ needs only 5 steps, $\eta = 7$ slows to 21 steps, and $\eta = 8$ never gets there) |
| 10 | 0.8739 | never | higher than the starting 0.6931 after step 1; afterwards it gradually settles into bouncing between the two points $(-0.038, 2.153)$ and $(-1.003, 0.676)$, where $E_{\text{in}}$ is 0.6148 and 0.5308, and the gradient length stays at 0.176 |
| 100 | 8.0000 | never | $E_{\text{in}}$ cycles every three steps, jumping among roughly 4, 14, and 6; it is 13.87 at step 1,000 and 5.84 at step 5,000 |

The $\eta = 10$ row corresponds to the middle figure on page 21: one step crosses the bottom of the valley and lands on the opposite slope. Here the landing point of step 1 is even higher than the starting point, which is the situation the lecture warns about: after crossing to the opposite slope, you end up higher. How large an $\eta$ counts as too large depends on the data, and the numbers in this table do not carry over to other problems.

One more experiment, with the normalized version, that is, the update on page 20 that moves a fixed length $\eta$ at every step, with $\eta = 0.05$. It gets near the bottom of the valley within 30 steps, but after that every step still has to cover the full length of 0.05, so it can only stride back and forth between two points on either side of the bottom: even steps land at $(-0.631, 1.076)$, with gradient length 0.0044; odd steps land at $(-0.607, 1.120)$, with gradient length 0.0087. All the way to step 5,000 these two points keep alternating, and the gradient length stays above 0.004 and never falls to $10^{-3}$. This shows why page 21 asks for a step size that changes with the gradient length; in the fixed learning rate version the step shrinks by itself near the bottom, and the problem does not arise.

### Fun Time: the first step from the zero vector

**Question (page 24):** If $\mathbf{w}_0 = \mathbf{0}$, and take $\eta = 0.1$. What is $\mathbf{w}_1$ in the logistic regression algorithm?

1. $+0.1 \cdot \frac{1}{N}\sum_{n=1}^{N} y_n\mathbf{x}_n$
2. $-0.1 \cdot \frac{1}{N}\sum_{n=1}^{N} y_n\mathbf{x}_n$
3. $+0.05 \cdot \frac{1}{N}\sum_{n=1}^{N} y_n\mathbf{x}_n$
4. $-0.05 \cdot \frac{1}{N}\sum_{n=1}^{N} y_n\mathbf{x}_n$

**Answer: 3.** The handout only says to substitute using $\theta(0) = \frac{1}{2}$. The full substitution: with $\mathbf{w}_0 = \mathbf{0}$, every example has $-y_n\mathbf{w}_0^\top\mathbf{x}_n = 0$, so every weight is $\frac{1}{2}$,

$$
\nabla E_{\text{in}}(\mathbf{w}_0) = \frac{1}{N}\sum_{n=1}^{N} \frac{1}{2}\big(-y_n\mathbf{x}_n\big) = -\frac{1}{2}\cdot\frac{1}{N}\sum_{n=1}^{N} y_n\mathbf{x}_n
$$

$$
\mathbf{w}_1 = \mathbf{0} - 0.1 \times \Big(-\frac{1}{2}\cdot\frac{1}{N}\sum_{n=1}^{N} y_n\mathbf{x}_n\Big) = +0.05 \cdot \frac{1}{N}\sum_{n=1}^{N} y_n\mathbf{x}_n
$$

Choice 1 leaves out $\theta(0) = \frac{1}{2}$. Choices 2 and 4 have the wrong sign: the gradient contains a minus sign and the update subtracts the gradient, and two minuses make a plus. The five-patient example can be used to check the answer: $\frac{1}{5}\sum_n y_n\mathbf{x}_n = (-0.2, 0.8)$, and multiplying by 0.05 gives $(-0.01, 0.04)$, which is the $\mathbf{w}_1$ computed earlier.

The handout's comment on this result is that a scaled average of $y_n\mathbf{x}_n$ is somewhat 'one-step' better than the zero vector. In the lecture, Lin explains that averaging the products of $y$ and $\mathbf{x}$ is a fairly good direction, a little better than the zero vector, because it has already rolled downhill once.

### This lecture in four sentences

The summary on page 25, one sentence per section:

- Problem: $P(+1 \mid \mathbf{x})$ as target and $\theta(\mathbf{w}^\top\mathbf{x})$ as hypotheses.
- Error: cross-entropy (negative log likelihood).
- Gradient: $\theta$-weighted sum of data vectors.
- Gradient descent: roll downhill by $-\nabla E_{\text{in}}(\mathbf{w})$.

The preview of the next lecture is "linear model'S' for classification". In the lecture, Lin says that linear classification, linear regression, and logistic regression are all linear methods, and the next lecture will bring them together and apply them to more complicated problems.

## Self-check

**1. An example has $\mathbf{x} = (1, 3)$ and $y = +1$, and currently $\mathbf{w} = (1, -2)$. Compute $h(\mathbf{x})$, this example's cross-entropy error, and the vector it contributes to the gradient sum, $\theta(-y\mathbf{w}^\top\mathbf{x})(-y\mathbf{x})$. In which direction does this example push $\mathbf{w}$?**

Answer: the score is $s = 1 - 6 = -5$ and $h(\mathbf{x}) = \theta(-5) \approx 0.0067$; the hypothesis considers $+1$ almost impossible, yet the label is $+1$. The error is $\ln(1 + e^{5}) \approx 5.0067$. The weight is $\theta(5) \approx 0.9933$, and the contributed vector is $0.9933 \times (-1, -3) \approx (-0.993, -2.980)$. The update subtracts the gradient, so this example pushes $\mathbf{w}$ in the direction of $(+1, +3)$, that is, of $y\mathbf{x}$, raising its own score.

**2. A hypothesis outputs $h(\mathbf{x}_n) = 0.8$ on all three examples, whose labels are circle, circle, cross. Ignoring $P(\mathbf{x}_n)$, what is the likelihood? What is $E_{\text{in}}$? What is the score $\mathbf{w}^\top\mathbf{x}_n$ of these three examples?**

Answer: the likelihood is $0.8 \times 0.8 \times 0.2 = 0.128$. $E_{\text{in}} = -\frac{1}{3}\ln(0.128) \approx 0.6852$; computed term by term it is $\frac{1}{3}(0.2231 + 0.2231 + 1.6094)$, the same result. Solving $\theta(s) = 0.8$ gives $e^{-s} = 0.25$ and $s = \ln 4 \approx 1.386$. Criterion: the two ways of computing $E_{\text{in}}$ must agree, which is what "$E_{\text{in}}$ is the negative log likelihood divided by $N$" means.

**3. In the five-patient example, switch to $\eta = 1$ and take one step from $\mathbf{w}_0 = (0, 0)$. What is $\mathbf{w}_1$? Can it be obtained directly from the $\eta = 0.1$ result without recomputing the gradient?**

Answer: yes. The gradient at the first step does not depend on $\eta$ and is $(0.1, -0.4)$ either way, so $\mathbf{w}_1 = -1 \times (0.1, -0.4) = (-0.1, 0.4)$, ten times the value for $\eta = 0.1$. Here $E_{\text{in}} \approx 0.5634$. From the second step on this conversion no longer works, because $\mathbf{w}_1$ differs along the two paths and so does the gradient.

**4. Two one-dimensional examples (with $x_0 = 1$ added): $x_1 = -1$ labeled $-1$, and $x_1 = +1$ labeled $+1$. Take $\mathbf{w} = (0, c)$ with $c > 0$. What function of $c$ is $E_{\text{in}}$? Where does gradient descent stop? What does this say about the stopping condition?**

Answer: both examples have $y_n\mathbf{w}^\top\mathbf{x}_n = c$, so $E_{\text{in}} = \ln(1 + e^{-c})$: 0.3133 at $c = 1$, 0.0067 at $c = 5$, and about $4.5 \times 10^{-5}$ at $c = 10$. It keeps decreasing with $c$ and approaches 0 without reaching it; both weights are $\theta(-c)$, always positive. When the data is linearly separable, a zero gradient occurs only in the limit where the length of $\mathbf{w}$ goes to infinity, which is the "all $\theta$ are 0" case. So the algorithm never stops because the gradient is exactly zero; it relies on the two conditions "gradient small enough" or "enough iterations".

**5. Explain in your own words: (a) why the best unit direction is $-\nabla E_{\text{in}} / \lVert\nabla E_{\text{in}}\rVert$; (b) how long each step actually is in the fixed learning rate version; (c) what $\eta$ and $\mathbf{v}$ are when PLA is put into the framework $\mathbf{w}_{t+1} \leftarrow \mathbf{w}_t + \eta\mathbf{v}$.**

Criteria: (a) should mention that for very small $\eta$ the Taylor expansion approximates $E_{\text{in}}(\mathbf{w}_t + \eta\mathbf{v})$ by $E_{\text{in}}(\mathbf{w}_t) + \eta\mathbf{v}^\top\nabla E_{\text{in}}(\mathbf{w}_t)$, that only the inner product term depends on $\mathbf{v}$, and that the inner product is smallest when the unit vector is opposite to the gradient. (b) The length is $\eta\lVert\nabla E_{\text{in}}(\mathbf{w}_t)\rVert$, scaling with the gradient; the answer should point out that what is "fixed" is the ratio. (c) $\eta = 1$, and $\mathbf{v}$ is $y_n\mathbf{x}_n$ when the chosen point is misclassified and the zero vector when it is classified correctly; even better if the answer goes on to note that PLA looks at one example per step while gradient descent looks at all $N$.

## Exercises and corresponding reading

**The corresponding week in two semesters.** The [Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) puts Foundations Lectures 9 and 10 in the same week (W5, 10/07). The corresponding Fall 2024 slides are [10u](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/10u_handout.pdf); this article uses only the MOOC handout and has not compared the two versions page by page.

**Textbook.** The [Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) maps this lecture to Section 3.3 of [Learning from Data](http://amlbook.com) (LFD).

**Homework.** None of the problems below has official solutions.

- [Fall 2024 HW3](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf) (released 2024-10-07, due 10-21) **Q4**: for samples drawn from a uniform distribution on $[\theta, 1]$, what is the likelihood of a given estimate. It practices the move "pretend some parameter is the true one and compute how likely it is to generate the data in hand".
- HW3 **Q9**: switch to a different sigmoid hypothesis and follow the steps of logistic regression to derive the new $E_{\text{in}}$ and gradient. The method is to walk through this article's "Take ln, add a minus sign, divide by N" and "Peeling the onion with the chain rule" once more.
- [Fall 2024 HW4](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf) (released 2024-10-21, due 11-04) **Q1**: after the labels change from $\{-1, +1\}$ to $\{0, 1\}$, which expression is equivalent to the cross-entropy from the lecture. The subsection "The shape and the name of cross-entropy" has already derived it once.
- HW4 **Q5** (extension): derive Newton's method from the second-order Taylor expansion and apply it to the cross-entropy of logistic regression; it can be treated as an advanced version of gradient descent.

The guide to the whole assignment is in [Foundations Homework](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide-en).

**Hands-on.** Write the four steps of "The logistic regression algorithm" as a dozen or so lines of Python. First reproduce this article's numbers on the five-patient data ($\mathbf{w}_1$, $\mathbf{w}_2$, and the converged $\mathbf{w}$), then vary $\eta$ from 0.01 to 100, plot $E_{\text{in}}$ against the number of iterations, and compare with the three figures on page 21.

**Further reading.** [Stanford CS229 Lecture 3: Maximum Likelihood and Logistic Regression](/posts/ai/2026-10-12-stanford-cs229-lecture-03-probabilistic-view-logistic-regression-en) derives the same model with $\{0, 1\}$ labels; Stanford CS109's [Maximum Likelihood Estimation](/posts/learning/2026-08-22-stanford-cs109-lecture-19-maximum-likelihood-estimation-en) and [Logistic Regression](/posts/learning/2026-08-22-stanford-cs109-lecture-20-logistic-regression-en) cover likelihood from the angle of a probability course.

**Next lecture.** [Foundations Lecture 11: Linear Models for Classification](/posts/ai/2026-09-30-ntu-htlin-ml-linear-classification-nonlinear-transform-en) compares these three linear models side by side, asks whether linear regression and logistic regression can be used for classification, turns gradient descent into stochastic gradient descent (SGD), and finally handles multiclass classification.

## Course video sources

Original videos: [Logistic Regression Problem](https://www.youtube.com/watch?v=4rPupwSdAac), [Logistic Regression Error](https://www.youtube.com/watch?v=Uw62i3-Tr4Q), [Gradient of Logistic Regression Error](https://www.youtube.com/watch?v=IZttt_v5tSw), [Gradient Descent](https://www.youtube.com/watch?v=X9NTihvSdjw)

- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [Official course and recording entry](https://www.csie.ntu.edu.tw/~htlin/mooc/)

Checked: 2026-10-13. The video IDs, titles, and lengths were taken from the official playlist that day; the videos have no caption track on YouTube, and what this article reports from the lecture comes from transcripts made for it.

## Update Log

- 2026-10-13: The series now has one article per lecture; this lecture is a newly split-out article, written from the handout and the video transcripts.

## References

- [Foundations Lecture 10 handout, 10_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/10_handout.pdf): the main source for this article. The derivations in the four sections, the four Fun Time questions, and the three figures on page 21 all come from this handout.
- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf): the IDs and titles of the four videos; what the text reports as said "in the lecture" is paraphrased from machine transcripts of these four videos.
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/): the official entry for handouts and recordings.
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/): the corresponding LFD section.
- [Fall 2024 slides, 10u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/10u_handout.pdf): the corresponding Fall 2024 slides, not compared page by page in this article.
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/): the corresponding week.
- [Fall 2024 Homework 3 (hw3_red.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw3/hw3_red.pdf): the content of Q4 and Q9.
- [Fall 2024 Homework 4 (hw4_red.pdf)](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw4/hw4_red.pdf): the content of Q1 and Q5, and the explanation of the name cross-entropy.
- [Learning from Data textbook website](http://amlbook.com): the source of Section 3.3.
- [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques: Course Overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en): where this lecture sits in the whole course and the reading routes.
