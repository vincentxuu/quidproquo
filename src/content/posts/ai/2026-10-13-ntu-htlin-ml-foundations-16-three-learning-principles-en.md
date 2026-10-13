---
title: "Three Learning Principles: Occam's Razor, Sampling Bias, and Data Snooping | NTU Hsuan-Tien Lin Machine Learning Foundations Lecture 16"
date: 2026-10-13
category: ai
type: guide
tags: [ntu-htlin-ml, ntu, ai-course, machine-learning, learning-theory, validation]
lang: en
math: true
series:
  name: "Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques"
  order: 16
tldr: "The last Foundations lecture teaches no new algorithm. It covers three situations in which the guarantees of the first fifteen lectures stop holding. A simple model rarely separates randomly labeled data by accident: with 10 points and random labels, a decision stump separates them with probability only 20/1024, so a successful separation means something. The VC guarantee fails when training and testing do not share one distribution, and once data has affected any step of the learning process it can no longer assess the outcome. The lecture closes with Power of Three, which folds the whole course into five groups of three."
description: "A guide to Lecture 16 of NTU Hsuan-Tien Lin's Machine Learning Foundations, Three Learning Principles: how Occam's razor relates to the growth function, sampling bias in the 1948 US election and the Netflix competition, three kinds of data snooping (choosing a transform by looking at a plot, scaling, and papers reusing one data set), and the Power of Three summary, with the reasoning for all four Fun Time questions and numerical examples checked in Python."
draft: false
glossary:
  - term: "Occam's razor"
    aliases: ["Ockham's razor"]
    definition: "Among the models that explain the data well, the simplest one is the most plausible. Simple means a hypothesis with few parameters, or a hypothesis set that contains few hypotheses."
    context: "The first learning principle in Lin's Foundations Lecture 16, which uses the growth function to explain why a successful fit by a simple model is meaningful."
  - term: "sampling bias"
    definition: "When the distribution of the training data differs from the distribution of the test scenario, the VC guarantee no longer holds, and what is learned carries the same bias."
    context: "The second learning principle in Lin's Foundations Lecture 16; the rule of thumb is to make training and validation match the test scenario as closely as possible."
  - term: "data snooping"
    aliases: ["snooping"]
    definition: "Once a data set has affected any step in the learning process (including choosing features from a plot, using it for scaling, or reading other people's results on the same data), its ability to assess the final outcome is contaminated."
    context: "The third learning principle in Lin's Foundations Lecture 16."
---

> 🌏 [中文版](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-16-three-learning-principles)

**Video status: Videos included.** This article is written from the official MOOC handout [16_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/16_handout.pdf) and transcripts of this lecture's four official videos, with formulas following the handout. The transcripts are machine transcripts made for this article (Whisper), not official captions, and no human has proofread them. The videos are taught in Mandarin; the slides are in English. Each section opens with its official video and the approximate time ranges. Page numbers refer to the number at the lower right of each slide (0/25 to 25/25), and wherever the text says "in the lecture" it is paraphrasing what is said in the video.

This is Foundations Lecture 16 in [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en), and the last lecture of Foundations. The Roadmap on page 1 of the handout places it under the fourth of the four big questions, How Can Machines Learn Better? The previous lecture, [Foundations Lecture 15: Validation](/posts/ai/2026-09-30-ntu-htlin-ml-validation-three-principles-en), takes up a single line on that page: (crossly) reserve validation data to simulate testing procedure for model selection. This lecture has no new algorithm. In the lecture, Lin says he is handing over three pieces of advice to keep at hand when doing machine learning, and then going through all sixteen lectures once more.

Each of the three principles corresponds to a hole in one of the earlier guarantees:

1. **Occam's razor**: when the model is too complex, the fact that it separates the data means nothing.
2. **Sampling bias**: when the training data and the test scenario do not share one distribution, the VC guarantee does not hold.
3. **Data snooping**: once data has affected your decisions, you can no longer use it to assess the outcome.

The prerequisites are the growth function ([Foundations Lecture 5](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function-en)), Hoeffding's inequality ([Foundations Lecture 4](/posts/ai/2026-09-30-ntu-htlin-ml-feasibility-of-learning-en)), the VC bound ([Foundations Lecture 6](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-06-theory-of-generalization-en) and [Lecture 7](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error-en)), feature transforms ([Foundations Lecture 12](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-12-nonlinear-transformation-en)), and validation from the previous lecture. This lecture has few formulas, but every principle can be turned into numbers. After reading, you should be able to compute the probability that a model separates randomly labeled data by accident and explain how that relates to Occam's razor, point out where the training, validation, and test distributions in a pipeline fail to match, and check step by step where your own pipeline snooped the data and which bound to use to estimate the cost.

## Among the models that explain the data, why pick the simplest

```youtube
url: https://www.youtube.com/watch?v=Oj6j98ceUz8
title: Three Learning Principles :: Occam's Razor @ Machine Learning Foundations (機器學習基石)
```

(Video 00:18–01:00 reviews the previous lecture, 01:00–03:17 covers where the razor comes from and the two figures, 03:17–06:00 what simple means, 06:00–08:24 why simple is better, 08:24–09:25 the action to take, and Fun Time follows.)

### Where the razor comes from

Page 2 of the handout shows two quotations. The first is An explanation of the data should be made as simple as possible, but no simpler, attributed to Albert Einstein (1879–1955) with a question mark after the name. In the lecture, Lin explains the question mark: the sentence is usually credited to Einstein, but there is currently no historical evidence that Einstein actually said it. The sentence means that the simpler the explanation of the data, the better; the second half, but no simpler, is a reminder not to overdo it, because an explanation that is too simple can no longer explain the data well.

The second is entia non sunt multiplicanda praeter necessitatem, which the handout translates as entities must not be multiplied beyond necessity, from William of Occam (1287–1347). In the lecture, Lin says the philosophy behind this sentence goes back to the fourteenth century and means: do not do more to a thing than is needed. The handout calls this idea Occam's razor, for trimming down unnecessary explanation, and shows a picture of an old-fashioned razor blade next to it. As Lin puts it in the lecture, an excessive explanation of the data gets shaved off with the razor, the way you shave a beard.

### Which of the two figures to choose

Page 3 rewrites the razor in a machine learning version:

> The simplest model that fits the data is also the most plausible.

Among the models that fit the data well, the simplest is also the most believable. Below it are two figures side by side showing the same data: a cluster of blue circles in the middle, surrounded by red crosses. The left figure encloses all the circles with one large ellipse; the right figure wraps the circles one by one with a chain of small circles, giving a winding boundary. Both figures classify the data perfectly. The handout asks which one do you prefer?, and in the lecture Lin says most people choose the left one, because there is no reason to draw a pile of complicated curves to explain data that one large circle can enclose.

That is intuition. The handout then breaks it into two questions to answer: what does it mean for a model to be simple? And how do we know that simpler is better?

### What simple means: a simple hypothesis and a simple model

Page 4 separates two levels.

| | simple hypothesis $h$ | simple model $\mathcal{H}$ |
|---|---|---|
| Complexity notation | small $\Omega(h)$ | small $\Omega(\mathcal{H})$ |
| Meaning | 'looks' simple | not many hypotheses inside |
| Concrete quantity | specified by few parameters | contains small number of hypotheses |

In the lecture, Lin gives an example for each side. On the hypothesis side: the large circle in the left figure is fully described by its center and radius, so it does not need many parameters. On the model side: the handout writes small number of hypotheses, and the lecture refines this to a small number of effective hypotheses, meaning the growth function grows slowly and the VC dimension is small.

The two kinds of simplicity are connected. The relation the handout writes is

$$
h \text{ specified by } \ell \text{ bits} \ \Longleftarrow\ \lvert\mathcal{H}\rvert \text{ of size } 2^{\ell}
$$

The reason is numbering: if $\mathcal{H}$ contains only $2^{\ell}$ hypotheses, number them from 0 to $2^{\ell} - 1$, and each number written in binary takes exactly $\ell$ bits, so specifying any one $h$ needs only $\ell$ bits. A small $\Omega(\mathcal{H})$ therefore guarantees that every $h$ inside also has a small $\Omega(h)$. The arrow goes one way: the handout only says that a simple model implies simple hypotheses.

Here is an example added in this article. A one-dimensional decision stump $h(x) = s \cdot \text{sign}(x - \theta)$ can produce only 20 labelings on 10 points (computed below), and $2^4 = 16 < 20 \le 32 = 2^5$, so 5 bits are enough to say which one. Conversely, if a model can produce all $2^{10} = 1024$ labelings on those 10 points, specifying one of them takes 10 bits, which amounts to memorizing the 10 labels one by one.

The conclusion on this page of the handout is: simple means small hypothesis/model complexity. In the lecture, Lin recalls the two earlier routes to it: use only a simple model from the start, or use [regularization](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-14-regularization-en) to constrain the hypothesis you end up with.

### Why simple is better: how rare a successful fit is

The mathematical reason is already in the VC bound: when $m_{\mathcal{H}}(N)$ grows slowly, $E_{\text{in}}$ and $E_{\text{out}}$ stay close. Page 5 says that in addition to the math proof that you have seen, there is a philosophical argument, written as three implications:

$$
\text{simple } \mathcal{H} \ \Longrightarrow\ \text{smaller } m_{\mathcal{H}}(N) \ \Longrightarrow\ \text{less likely to fit data perfectly: } \frac{m_{\mathcal{H}}(N)}{2^N} \ \Longrightarrow\ \text{more significant when fit happens}
$$

The fraction in the middle needs an explanation. The setting imagined in the lecture is this: the inputs $\mathbf{x}_1, \dots, \mathbf{x}_N$ are fixed and the labels are generated by coin flips, so the data has no pattern at all. $N$ labels have $2^N$ possible outcomes, each with probability $1/2^N$. The model $\mathcal{H}$ can produce at most $m_{\mathcal{H}}(N)$ labelings on these $N$ points, and $\mathcal{H}$ contains a hypothesis with $E_{\text{in}} = 0$ only when the flipped labels happen to be one of them. The handout writes only the fraction itself; this article completes it into an inequality:

$$
\mathbb{P}\big[\text{random labels are perfectly fit by } \mathcal{H}\big] \ \le\ \frac{m_{\mathcal{H}}(N)}{2^N}
$$

It is written with "$\le$" because $m_{\mathcal{H}}(N)$ is a maximum over all inputs, and a particular set of $N$ points may allow fewer labelings.

Next comes the reasoning from the lecture. When the model is simple this probability is small, and randomly labeled data cannot be separated most of the time. Seen from the other direction, if the data in your hands really is separated perfectly by this simple model, it is probably not randomly labeled data, and it should contain some pattern. The word used in the lecture is significance: the result is significant. With a very complex model you cannot draw that conclusion, because it separates the data whether or not there is a pattern, and a successful separation does not tell you which kind of data you have.

### Numerical example: 10 points, four models

The table below is computed in this article and is not in the handout; the decision stump row is the answer to this section's Fun Time. The growth functions come from [Foundations Lecture 5](/posts/ai/2026-09-30-ntu-htlin-ml-training-vs-testing-growth-function-en), with $N = 10$ and labels generated by a fair coin, $2^{10} = 1024$ outcomes in total.

| Model | $m_{\mathcal{H}}(N)$ | $m_{\mathcal{H}}(10)$ | Upper bound on the probability that random labels are perfectly separated |
|---|---|---|---|
| positive rays | $N + 1$ | $11$ | $11/1024 \approx 1.07\%$ |
| decision stump (rays in both directions) | $2N$ | $20$ | $20/1024 \approx 1.95\%$ |
| positive intervals | $\frac{1}{2}N^2 + \frac{1}{2}N + 1$ | $56$ | $56/1024 \approx 5.47\%$ |
| a model that shatters these 10 points (for example convex sets when the points lie on a circle) | $2^N$ | $1024$ | $100\%$ |

In the first three rows the inputs lie on the one-dimensional number line, and when the 10 points are distinct the numbers in the table are the actual counts of achievable labelings, so the probabilities hold with equality. This article used Python to list all 1024 labelings and check them one by one: the decision stump separates exactly 20 of them and positive intervals 56.

**What this result means.** Suppose you use a decision stump on a data set of 10 examples and get $E_{\text{in}} = 0$. If the data actually had no pattern, the probability of this happening would be under 2%, so the more reasonable reading is that the data really contains a threshold. With the model in the last row, $E_{\text{in}} = 0$ is certain, and it tells you nothing about the data. With more data the gap widens: at $N = 20$ the probability for the decision stump is $40/2^{20} \approx 0.004\%$.

### The action to take

Page 5 concludes with two things:

- **linear first.** In the lecture, Lin says the linear model is nearly the simplest model you can think of; if a simple model solves the problem, it is solved, and everything else can wait.
- **always ask whether data over-modeled.** The lecture draws a distinction here: the question is not about the overfitting you can only see after the machine has run, but about the moment you decide which model to use, and whether you first used the simplest one you could think of. If you used a more complex model, it becomes hard to explain why a good result is good.

### Fun Time: the probability that a decision stump separates 10 random labels

**Question (page 6):** Consider the decision stumps in $\mathbb{R}^1$ as the hypothesis set $\mathcal{H}$. Recall that $m_{\mathcal{H}}(N) = 2N$. Consider 10 different inputs $x_1, x_2, \dots, x_{10}$ coupled with labels $y_n$ generated iid from a fair coin. What is the probability that the data $\mathcal{D} = \{(x_n, y_n)\}_{n=1}^{10}$ is separable by $\mathcal{H}$?

1. $\frac{1}{1024}$
2. $\frac{10}{1024}$
3. $\frac{20}{1024}$
4. $\frac{100}{1024}$

**Answer: 3.** The handout's solution: of all 1024 possible $\mathcal{D}$, only $2N = 20$ of them are separable by $\mathcal{H}$.

Here is how to count the 20. Sort the 10 points in increasing order; the threshold $\theta$ can sit in any of the 9 gaps between adjacent points. Each gap comes with two directions (positive on the right, or negative on the right), giving $9 \times 2 = 18$ labelings. When the threshold sits to the left or to the right of all the points, the 10 labels are all the same, which adds the 2 labelings "all positive" and "all negative". The total is $18 + 2 = 20$. Each labeling occurs with probability $(1/2)^{10} = 1/1024$, so the probability is $20/1024 \approx 1.95\%$.

Each of the other options misses one thing. Option 1 is the probability of one particular labeling. Option 2 counts only 10, forgetting that a decision stump has two directions. The 100 in option 4 is $N^2$; the growth function of the decision stump is linear in $N$ and has no squared term.

## What happens when the training data and the exam do not share one distribution

```youtube
url: https://www.youtube.com/watch?v=8QZZiIAdTUU
title: Three Learning Principles :: Sampling Bias @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–03:14 tells the story of the 1948 election, 03:14–05:07 covers the principle and the VC assumption, 05:07–07:47 the Netflix competition experience, 07:47–09:31 how to deal with it, 09:31–11:00 the credit card puzzle, and Fun Time follows.)

### The 1948 phone poll

The story on page 7 of the handout: the 1948 US presidential election was Truman versus Dewey, and a newspaper ran a phone poll asking how people had voted, then set the title 'Dewey Defeats Truman' based on the result. In the lecture, Lin adds two details: the poll was taken after people had voted, so there is no issue of voting intentions changing later; and it is assumed that most people answered honestly. In principle this is a sample, and it can be used to estimate who will win.

The page shows a historical photograph of a man smiling and holding that newspaper up high, and the handout asks who is this?. Page 8 reveals the answer: the man is Truman, and yes he won. The handout lists two suspects and rules them out one at a time:

- editorial bug? no. In the lecture, Lin says that later investigation showed the editors had not misread the result or written the article wrong.
- bad luck of polling ($\delta$)? no. $\delta$ is the probability of "drawing a bad sample" in Hoeffding's inequality, and the lecture's analogy is flipping a fair coin ten times and getting heads every time. In hindsight this was not the cause either.

The handout's hint is phones were expensive. The lecture finishes the story: telephones were expensive back then, so the people who could be sampled were the wealthier ones, and that year a higher share of wealthy people supported Dewey, while more of everyone else supported Truman. Sampling only people with phones naturally makes Dewey's support look higher; with one person, one vote all counted, the winner was Truman.

### Made-up numbers: no sample size can rescue it

Why does the handout say this was not luck? What follows is an example made up for this article; the numbers are invented for the calculation and are not actual 1948 data.

Suppose 25% of all voters have a telephone at home. Of those with a phone, 60% vote for Dewey; of those without, 40% vote for Dewey. Dewey's true vote share is

$$
0.25 \times 0.60 + 0.75 \times 0.40 = 0.15 + 0.30 = 0.45
$$

Dewey loses. The phone poll reaches only people with phones, and Dewey's support in that population is 0.60. Interview $N = 1000$ people and let $\nu$ be the fraction of the sample that voted for Dewey. Hoeffding's inequality says

$$
\mathbb{P}\big[\lvert\nu - 0.60\rvert > 0.05\big] \ \le\ 2\exp\big(-2 \times 0.05^2 \times 1000\big) = 2e^{-5} \approx 0.0135
$$

So with probability at least 98.6% the poll result falls between 55% and 65%, and the newspaper will write with confidence that Dewey wins. Raise the sample to 10,000 people and the right-hand side becomes $2e^{-50} \approx 3.9 \times 10^{-22}$: the poll points to 60% even more steadily, and it is just as far from the true 45%. This article simulated five polls of 1000 people each way in Python: sampling only people with phones gave 0.590, 0.574, 0.594, 0.608, 0.594; sampling from all voters gave 0.471, 0.472, 0.443, 0.461, 0.462. These come from one run, and on a rerun each number moves by a percentage point or two, but the first group stays near 0.60 and the second near 0.45.

**What this result means.** Hoeffding guarantees that the sample is close to "the population that was sampled". $\delta$ governs luck, and increasing $N$ pushes it down. The 15-percentage-point gap caused by sampling the wrong population is not in this inequality, and no $N$ will shrink it.

### The principle, and VC's "minor" assumption

Page 9 states the principle in one sentence:

> If the data is sampled in a biased way, learning will produce a similarly biased outcome.

If the sampling is biased, what is learned will be biased in a similar way. The handout gives two explanations:

- **Technical explanation:** data from $P_1(\mathbf{x}, y)$ but test under $P_2 \ne P_1$: VC fails.
- **Philosophical explanation:** study Math hard but test English: no strong test guarantee. In the lecture, Lin explains that however well you study math, you will not necessarily do well on the English exam, because the two are not strongly related.

The bottom of the page points to the overlooked premise: VC has a 'minor' assumption, data and testing both iid from $P$. The lecture recalls that deriving the VC bound used very few assumptions, and one of them is that the training data and the test data come from the same distribution. The handout puts minor in quotation marks. This article's reading: the assumption is rarely brought up during the derivation, yet both stories in this section are cases where it fails.

### The Netflix competition: the validation set was sampled wrong

Page 10 is titled A True Personal Story. [Foundations Lecture 1](/posts/ai/2026-09-30-ntu-htlin-ml-learning-problem-perceptron-en) mentioned Netflix's movie recommendation competition: improve the recommender system by 10% and win 1 million US dollars. In the lecture, Lin says he entered this competition while studying at Caltech. People who do machine learning do not put all the data into training, so Lin held out a block of data for validation (the handout writes formed $\mathcal{D}_{\text{val}}$). On the first attempt (the handout writes in my first shot), a model trained on the remaining data showed a 13% improvement in $E_{\text{val}}(g)$.

The next line of the handout is why am I still teaching here?. In the lecture, Lin says that collecting the prize of course never happened. The reason is at the bottom of the page:

- validation: random examples within $\mathcal{D}$
- test: 'last' user records 'after' $\mathcal{D}$

Lin's validation data was drawn at random from $\mathcal{D}$, which is the most common practice. The competition's test data was not drawn at random. As described in the lecture: a user watches several movies, and the organizers take the earlier records in time (the lecture's example is the first seven movies) as training data and the later ones (the last three) as test data, so there is an order in time between the two. The distribution used for validation therefore differs from the distribution used for testing, and the 13% seen on the validation set does not carry over to the test. In the lecture, Lin says the two differed by roughly 6% or 7%, and the improvement on the test did not cross the 10% threshold.

This story connects to the previous lecture. That lecture said $\mathcal{D}_{\text{val}}$ is split off at random so that it is still drawn from $P$; the problem here is that the test is not under that $P$ at all.

### How to deal with it: match the test scenario as much as possible

The rule of thumb on page 11 is match test scenario as much as possible. The lecture puts it more flexibly: there is no need to insist that the training and test distributions be identical; what you do is understand the test environment first, then make the training environment as close to it as you can. Taking "test: 'last' user records 'after' $\mathcal{D}$" as the example, the handout lists two measures:

- **Training:** emphasize later examples. In the lecture, Lin explains that since the data later in time matters more, you give it heavier weights, or strengthen it in some other way, so that the trained hypothesis leans toward the later data. The handout marks this KDDCup 2011, and Lin says it was one of the solutions the NTU team used that year.
- **Validation:** use 'late' user records. Do not sample at random; instead take the latest records in the data you have as validation data.

### One last puzzle: learning credit card approval from existing bank records

Page 11 ends with a question: danger when learning 'credit card approval' with existing bank records? The handout does not write the answer; the answer is in the lecture.

The records the bank holds say whether customers who were approved in the past later abused their cards. For the applicants who were rejected, the bank has no data on what would have happened had they received a card. So this data has already been filtered by the old approval rule. After the new system goes live it faces all applicants, some of whom the old rule would approve and some of whom it would reject, and that distribution differs from the training data. The lecture's conclusion: a $g$ trained with the methods taught so far and used directly may not perform as expected, and some adjustment is needed. The lecture does not go into how to adjust.

### Fun Time: which subset is still an unbiased sample

**Question (page 12):** If the data $\mathcal{D}$ is an unbiased sample from the underlying distribution $P$ for binary classification, which of the following subset of $\mathcal{D}$ is also an unbiased sample from $P$?

1. all the positive ($y_n > 0$) examples
2. half of the examples that are randomly and uniformly picked from $\mathcal{D}$ without replacement
3. half of the examples with the smallest $\lVert\mathbf{x}_n\rVert$ values
4. the largest subset that is linearly separable

**Answer: 2.** The handout's solution is: That's how we form the validation set, remember? The lecture adds a remark only about option 1: picking only the positive examples is clearly not a representative random sample. The reasoning for the other options is an addition in this article.

The selection in option 2 looks at neither $\mathbf{x}_n$ nor $y_n$, and every example is chosen with the same probability, so the chosen data still looks as if it were drawn directly from $P$. The other three options all decide whether to keep an example after looking at its content:

- Option 1 filters on $y_n$, so $P(y = +1)$ in the subset becomes 1.
- Option 3 filters on $\mathbf{x}_n$, so the subset covers only the region of the input space near the origin.
- Option 4 filters on both $\mathbf{x}_n$ and $y_n$: to make what remains linearly separable, the points thrown away are exactly those whose labels disagree with most of their neighbors, and many of them are noisy examples. The subset looks cleaner than the true $P$.

This article checks the answer with a made-up one-dimensional example. $x$ is uniform on $[-1, 1]$, the target is $\text{sign}(x)$, each label is flipped with probability 20%, and 20,000 examples are drawn. In one dimension "linearly separable" means separable by a single threshold, so the largest separable subset can be computed directly. The table below comes from one draw; on a redraw the second and third decimal places change, and the differences between rows do not.

| Subset | Size | Fraction positive | Mean of $\lvert x\rvert$ | Fraction flipped |
|---|---|---|---|---|
| all of $\mathcal{D}$ | 20,000 | 0.495 | 0.505 | 0.199 |
| Option 1: all positive examples | 9,910 | 1.000 | 0.509 | 0.197 |
| Option 2: a random half | 10,000 | 0.495 | 0.508 | 0.195 |
| Option 3: the half with the smallest $\lvert x\rvert$ | 10,000 | 0.487 | 0.256 | 0.202 |
| Option 4: the largest separable subset | 16,023 | 0.497 | 0.505 | 0.000 |

Only option 2 has all three statistics close to those of the whole data set. Option 1's fraction of positives becomes 1, option 3's input range shrinks by half, and option 4 filters out all the noise: the error rate estimated on that subset is 0, while on the true distribution even the best classifier has 20% error.

## Once data has affected any step, it can no longer be used for scoring

```youtube
url: https://www.youtube.com/watch?v=7nP5zWMQmxM
title: Three Learning Principles :: Data Snooping @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–01:52 covers looking at the data with your eyes, 01:52–06:11 the scaling of exchange-rate data, 06:11–09:10 papers reusing the same data set, 09:10–11:57 how to deal with it, and Fun Time follows.)

### Choosing a transform by looking at the plot

Page 13 returns to the warning from [Foundations Lecture 12](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-12-nonlinear-transformation-en). The data lies in $\mathcal{X} = \mathbb{R}^2$, and the figure on the right shows points in the square $[-1, 1]^2$: blue circles concentrated inside a circle centered at the origin, red crosses outside it. The handout lists a sequence of transforms that get "smarter the more you look":

| Transform chosen | $d_{\text{VC}}$ | How it was decided |
|---|---|---|
| the full quadratic transform $\boldsymbol{\Phi}_2$: $\mathbf{z} = (1, x_1, x_2, x_1^2, x_1x_2, x_2^2)$ | 6 | without looking at the data |
| $\mathbf{z} = (1, x_1^2, x_2^2)$ | 3 | after looking at the plot (after visualizing) |
| $\mathbf{z} = (1, x_1^2 + x_2^2)$ | 2 | after looking at the plot and noticing the boundary is a perfect circle |
| $\mathbf{z} = \big(\text{sign}(0.6 - x_1^2 - x_2^2)\big)$ | not given | the answer written straight into the transform |

The "How it was decided" column is this article's own summary: the handout writes after visualizing only on the second row, and the third and fourth rows say or better and or even better. The $d_{\text{VC}}$ in the table is the number of parameters of linear classification in $\mathcal{Z}$ space: 6 components, 3 components, 2 components. The last row leaves nothing to learn. In the lecture, Lin says this amounts to learning the final hypothesis with your own brain and then plugging it in.

The numbers keep getting smaller and things look safer and safer, yet the handout's comment is careful about your brain's 'model complexity'. The $d_{\text{VC}}$ written in the table counts only the machine's part, not the choices your brain made for the machine after seeing the data. The conclusion is: for VC-safety, $\boldsymbol{\Phi}$ shall be decided without 'snooping' data. In the lecture, Lin explains that snooping means peeking: once you look at the data with your own eyes and then decide, the VC guarantee derived earlier is no longer safe.

This article adds a sense of the magnitudes. Use the model complexity penalty from [Foundations Lecture 7](/posts/ai/2026-09-30-ntu-htlin-ml-vc-dimension-noise-error-en), $\Omega = \sqrt{\frac{8}{N}\ln\frac{4(2N)^{d_{\text{VC}}}}{\delta}}$, with $N = 1000$ and $\delta = 0.1$: at $d_{\text{VC}} = 6$, $\Omega \approx 0.628$; at $d_{\text{VC}} = 3$ it is about $0.460$; at $d_{\text{VC}} = 2$ about $0.389$. Someone who picks the third row only after looking at the plot pays 0.389 on paper, but in fact chose this one out of a larger set that includes the full quadratic transform, so the price owed is at least on the order of 0.628, and the possibilities the brain considered cannot really be counted.

### Even plain scaling counts as snooping

Page 14 states the principle first:

> If a data set has affected any step in the learning process, its ability to assess the outcome has been compromised.

Once a data set has affected any step of the learning process, its ability to assess the result is reduced. In the lecture, Lin explains that any process that uses the data lets you see indirectly how the data behaves, every decision made after seeing it is a choice, and choices bring in extra model complexity.

The handout's example is exchange-rate prediction:

- 8 years of currency trading data, the first 6 years for training and the last 2 years for testing.
- The input $\mathbf{x}$ is the exchange rate of the previous 20 days and the output $y$ is the rate on the 21st day, a regression problem.
- Before regression the values are shifted and scaled (shift-scale). In the lecture, Lin says regression is hard when the values range too widely, so for instance values from 0 to 100 in the currency are scaled into 0 to 1, and scaled back after predicting.

The only difference is where the scaling statistics are computed from:

- **no snooping:** compute them from the 6 training years only, then apply them to all the data.
- **snooping:** compute them from all 8 years, training plus testing. In the lecture, Lin calls this a lazy shortcut: all 8 years of data are on hand anyway, and scaling everything at once saves trouble.

In the figure on the right, the horizontal axis is the day within the test period (0 to 500) and the vertical axis is the cumulative profit in percent. The handout gives no numbers, so everything below is an approximate value read off the figure. For roughly the first 140 days both curves move up and down within a few percentage points of 0. After that they separate: the red curve labeled snooping climbs with ups and downs, peaks at around 30% near day 460, and ends at about 24%; the blue curve labeled no snooping drops below 0 and afterwards only ever returns to just about 0, with its lowest point near day 250 at about $-14\%$, ending near $-4\%$. The handout's wording is superior profit possible. The lecture's reading is that the red curve looks spectacular while the blue one earns little and even loses a bit.

The 2 test years did not take part in training directly; the influence is indirect. The lecture's explanation: scaling lets the machine learn statistics of the last two years, such as the maximum, minimum, mean, and standard deviation. It is like mixing the exam paper in and reading it together with the study material. The red curve's method also cannot be used in practice: as Lin puts it, you would have to finish collecting the next two years of exchange rates before the system could tell you how to profit over those two years. Even indirect peeking at future data is not allowed; in the lecture, Lin calls it fooling yourself.

Below is a small example made up for this article, to see what scaling actually leaks. The 6 exchange rates in the training period are 28, 30, 32, 31, 29, 30, and the 4 in the test period are 33, 35, 36, 34. Scale the values linearly so the minimum and maximum map to 0 and 1:

| Method | Minimum, maximum used | Training data after scaling | Test data after scaling |
|---|---|---|---|
| computed from training data only | 28, 32 | 0, 0.5, 1, 0.75, 0.25, 0.5 | 1.25, 1.75, 2, 1.5 |
| computed from training plus test | 28, 36 | 0, 0.25, 0.5, 0.375, 0.125, 0.25 | 0.625, 0.875, 1, 0.75 |

Under the second method the training data only reaches 0.5, while the top of the scale is 1. The range of the training data alone tells you that future rates will rise, and that the distance from the highest point to the lowest will be twice the current one ($36 - 28 = 8$ versus $32 - 28 = 4$). This information comes from the test period, yet it enters the inputs before training starts. Under the first method the test data goes beyond $[0, 1]$, and that is the honest result: in real deployment, future values can always fall outside the past range.

### Everyone publishing papers in relay on the same data set

The setting on page 15 is research. There is a benchmark data set $\mathcal{D}$ that everyone uses:

- paper 1: propose $\mathcal{H}_1$ that works well on $\mathcal{D}$.
- paper 2: find room for improvement, propose $\mathcal{H}_2$, and publish only if better than $\mathcal{H}_1$ on $\mathcal{D}$.
- paper 3: propose $\mathcal{H}_3$, and publish only if it beats $\mathcal{H}_2$ on $\mathcal{D}$.
- And so on.

The handout looks at this from two angles. First, treat all the papers as one big paper by a single author: that big paper has tried $\mathcal{H}_1, \mathcal{H}_2, \mathcal{H}_3, \dots$, and the price for generalization is $d_{\text{VC}}(\cup_m \mathcal{H}_m)$. This is the same reasoning as in the previous lecture, where choosing between two models by $E_{\text{in}}$ costs the VC dimension of the union. Second, look at it step by step: a later author who reads the earlier papers has indirectly snooped which methods do well on this data; publish only if better makes it worse.

The lecture adds three points. Every author can claim to be honest, but each already stands on the shoulders of predecessors, and the later the paper, the heavier the contamination. The calculation above does not yet include the models that were tried, found to be bad, and thrown away. After a data set has been used for ten years with a thousand papers doing research on it, everyone claims to be better, and nobody can tell whether it really is better or is some form of indirect overfitting.

The handout quotes a line: if you torture the data long enough, it will confess. In the lecture, Lin explains the saying it borrows from: interrogate a prisoner long enough and the prisoner will confess. What the data confesses is a hypothesis that performs very well on it; whether that hypothesis does well on a real test is unknown.

Below is an example made up for this article that turns the "torture" into numbers. Suppose the benchmark's test set has 1000 binary classification examples, and every method that gets tried is actually guessing at random, with a true accuracy of 50%. The probability that a single method happens to get 540 or more of these 1000 right, computed exactly from the binomial distribution, is

$$
p = \sum_{k=540}^{1000} \binom{1000}{k}\Big(\frac{1}{2}\Big)^{1000} \approx 0.0062
$$

The probability that at least one of $M$ mutually independent methods reaches 54% is $1 - (1 - p)^M$:

| Number of methods tried $M$ | Probability that at least one reaches 54% |
|---|---|
| 1 | 0.6% |
| 10 | 6.1% |
| 100 | 46.4% |
| 1000 | 99.8% |

Now simulate "publish only if better" once: try 1000 random-guessing methods in order, and count only the ones that set a new record as published. The program below uses `random` from the Python standard library with the seed set to 1126, and for each method flips a fair coin 1000 times, once per example, to decide right or wrong:

```python
import random

random.seed(1126)
best = -1
for i in range(1, 1001):
    correct = sum(random.getrandbits(1) for _ in range(1000))
    if correct > best:
        best = correct
        print(i, correct / 1000)
```

It prints four lines, that is, four papers: method 1 at 49.3%, method 2 at 53.0%, method 31 at 53.4%, method 217 at 54.4%. With a different seed the number of papers and the figures change, but the record only goes up. Every paper honestly reports its own number on the benchmark, and every paper beats the one before it.

**What this result means.** Part of the steadily rising number on a leaderboard comes from "trying many times on the same data and keeping only the best". On new data, the expected accuracy of all four methods is 50%. No single paper has a problem when viewed alone; the problem lies in how many choices the whole community has made on the same data.

### How to deal with it: degrees of honesty and two habits

The first line of page 16 is the truth: very hard to avoid, unless being extremely honest. In the lecture, Lin says not peeking at all is hard to achieve, and that machine learning may also go badly if you never look at the data. The handout lists two levels by degree of honesty:

- **extremely honest:** lock your test data in safe. As Lin describes it in the lecture, the moment the data arrives you lock the test data in a cabinet, and take it out only at the very end when you really are going to test.
- **less honest:** reserve validation and use cautiously. Validation data is used for something like testing, and it is used repeatedly (model selection is exactly that). The lecture warns to use it carefully, and not to select among ten million models with the same validation data.

Then there are two habits:

- **be blind:** avoid making modeling decision by data. The lecture uses speech as the example: if you have domain knowledge, think it through before looking at the data and build it in as features; do not look at the data, feel that it seems to have some property, and then add that feature, or the complexity of the human brain comes in again.
- **be suspicious:** stay skeptical when reading papers and looking at research results, and the handout specifically notes including your own, by proper feeling of contamination. In the lecture, Lin says you need to sense how many steps a result went through and how badly it may be contaminated, and that this is honed slowly through experience.

The bottom of the page is one secret to winning KDDCups: careful balance between data-driven modeling (snooping) and validation (no-snooping). The lecture is blunt about it: data-driven modeling is the polite name, and it really is peeking, only done with more care; on the other side you rely on validation results to make reasonable choices.

### Fun Time: what can make test performance unsatisfactory

**Question (page 17):** Which of the following can result in unsatisfactory test performance in machine learning?

1. data snooping
2. overfitting
3. sampling bias
4. all of the above

**Answer: 4.** The handout's solution is A professional like you should be aware of those!, and the lecture also says this is an easy question. Each of the three options is one way for $E_{\text{out}}$ to be worse than you think:

- **overfitting** ([Foundations Lecture 13](/posts/ai/2026-09-30-ntu-htlin-ml-overfitting-regularization-en)): $E_{\text{in}}$ is very low, but the model complexity is too high and $E_{\text{out}}$ is far from it.
- **sampling bias**: $E_{\text{in}}$ and $E_{\text{val}}$ estimate performance on $P_1$, but the test is under $P_2$.
- **data snooping**: the data used for assessment already took part in the decisions, so the estimate is optimistic.

What the three share is that the number in your hands for estimating performance has gone wrong.

## Folding sixteen lectures into a few groups of three

```youtube
url: https://www.youtube.com/watch?v=29jgHPeRAqI
title: Three Learning Principles :: Power of Three @ Machine Learning Foundations (機器學習基石)
```

(Video 00:00–01:00 covers three related fields, 01:00–01:55 three theoretical bounds, 01:55–03:24 three linear models, 03:24–05:06 three tools, 05:06–05:31 three principles, 05:31–07:02 three future directions, 07:02–07:22 Fun Time, and the summary of the whole lecture follows.)

The handout calls the last section Power of Three. In the lecture, Lin says everything introduced in the course seems to come in threes, like the trio in Harry Potter, where the three together are the most powerful. One page, one group, below.

### Three related fields

Page 18 reviews the three fields compared in [Foundations Lecture 1](/posts/ai/2026-09-30-ntu-htlin-ml-learning-problem-perceptron-en):

| Field | What it tries to do | Relation to machine learning |
|---|---|---|
| Data Mining | use (huge) data to find property that is interesting | difficult to distinguish ML and DM in reality |
| Artificial Intelligence | compute something that shows intelligent behavior | ML is one possible route to realize AI |
| Statistics | use data to make inference about an unknown process | statistics contains many useful tools for ML |

### Three theoretical bounds

Page 19 puts three bounds side by side; the point is where each one is used:

| | Hoeffding | Multi-Bin Hoeffding | VC |
|---|---|---|---|
| $\mathbb{P}[\text{BAD}] \le$ | $2\exp(-2\epsilon^2 N)$ | $2M\exp(-2\epsilon^2 N)$ | $4\,m_{\mathcal{H}}(2N)\exp(\dots)$ |
| Applies to | one hypothesis | $M$ hypotheses | all $\mathcal{H}$ |
| Useful for | verifying/testing | validation | training |

In the handout the exponent in the VC cell is written as "$\dots$"; the full expression is in [Foundations Lecture 6](/posts/ai/2026-10-13-ntu-htlin-ml-foundations-06-theory-of-generalization-en) and is $\exp(-\frac{1}{8}\epsilon^2 N)$. The lecture ties the three together: testing involves a single hypothesis, so Hoeffding is enough; validation chooses among finitely many candidates, so it uses the multi-bin version; training has infinitely many hypotheses and needs the VC bound.

This table is also the tool for computing the cost of snooping: the number of choices the data was used for decides which column applies. Below is a comparison made up for this article. To have $\epsilon = 0.1$ with the probability of something bad no more than $\delta = 0.05$, how many examples does each of the three situations need?

- **Testing one hypothesis:** solving $2\exp(-2\epsilon^2 N) \le \delta$ gives $N \ge \frac{\ln(2/\delta)}{2\epsilon^2} = \frac{\ln 40}{0.02} \approx 184.4$, so 185 examples.
- **Choosing among 100 candidates:** $N \ge \frac{\ln(2M/\delta)}{2\epsilon^2} = \frac{\ln 4000}{0.02} \approx 414.7$, so 415 examples.
- **Training with a decision stump:** $m_{\mathcal{H}}(2N) = 4N$, and we need $16N\exp(-\frac{1}{8} \times 0.01 \times N) \le 0.05$. This has no closed-form solution; trying values from small to large by program, the smallest $N$ is 12,138.

**What this result means.** For the same guarantee, testing needs only 185 examples, choosing among 100 needs 415, and training even the simplest model needs more than ten thousand. Clean test data goes a long way because it assesses only one hypothesis that is already final. Once you use it to choose, it moves to the middle column; once it is used for repeated tuning to the point of being equivalent to training, it lands in the rightmost column.

### Three linear models

Page 20 is the figure from [Foundations Lecture 11](/posts/ai/2026-09-30-ntu-htlin-ml-linear-classification-nonlinear-transform-en). All three models first compute a score $s = \mathbf{w}^\top\mathbf{x}$ and differ in how the score is output, which error is used, and how it is minimized:

| | PLA/pocket | linear regression | logistic regression |
|---|---|---|---|
| Hypothesis | $h(\mathbf{x}) = \text{sign}(s)$ | $h(\mathbf{x}) = s$ | $h(\mathbf{x}) = \theta(s)$ |
| Error | 0/1 (plausible: small flipping noise) | squared (friendly: easy to minimize) | cross-entropy (plausible: maximum likelihood) |
| How it is minimized | specially | analytically | iteratively |

The handout separates the error functions with two adjectives: 0/1 and cross-entropy are plausible, each with a sensible origin; squared error is friendly, meaning easy to compute. The lecture adds: minimizing the 0/1 error is a hard problem, so PLA and pocket use special methods; linear regression has a closed-form solution; logistic regression passes the score through an S-shaped function before output and is optimized with gradient descent or stochastic gradient descent.

### Three tools

Page 21 gives three answers to the fourth question, How Can Machines Learn Better?, and each one trades one thing for another:

| | Feature Transform | Regularization | Validation |
|---|---|---|---|
| What changes | $E_{\text{in}}(\mathbf{w}) \to E_{\text{in}}(\tilde{\mathbf{w}})$; $d_{\text{VC}}(\mathcal{H}) \to d_{\text{VC}}(\mathcal{H}_{\boldsymbol{\Phi}})$ | $E_{\text{in}}(\mathbf{w}) \to E_{\text{in}}(\mathbf{w}_{\text{REG}})$; $d_{\text{VC}}(\mathcal{H}) \to d_{\text{EFF}}(\mathcal{H}, \mathcal{A})$ | $E_{\text{in}}(h) \to E_{\text{val}}(h)$; $\mathcal{H} \to \{g_1^-, \dots, g_M^-\}$ |
| How | by using more complicated $\boldsymbol{\Phi}$ | by augmenting regularizer $\Omega$ | by reserving $K$ examples as $\mathcal{D}_{\text{val}}$ |
| Gain | lower $E_{\text{in}}$ | lower $d_{\text{EFF}}$ | fewer choices |
| Cost | higher $d_{\text{VC}}$ | higher $E_{\text{in}}$ | fewer examples |

In the lecture, Lin says regularization and feature transform go in opposite directions: one makes $d_{\text{VC}}$ larger in exchange for a smaller $E_{\text{in}}$, the other makes the effective VC dimension smaller and accepts a slightly larger $E_{\text{in}}$. Validation takes a third route: keep a block of clean data, and do not choose over the whole of $\mathcal{H}$ but only among the finitely many representatives picked by each model; with fewer choices the guarantee is better. Lin says these three are the basic tools for learning all kinds of machine learning methods later.

### Three principles, walked through on the credit approval problem

Page 22 pairs each of this lecture's three principles with one phrase:

| Occam's Razor | Sampling Bias | Data Snooping |
|---|---|---|
| simple is good | class matches exam | honesty is best policy |

On this page the handout spells the first heading Occam's Razer; every other page has Razor.

Below is a walkthrough made up for this article, applying the three principles to the credit card approval problem the course has used since Lecture 1; all numbers are invented. Suppose a bank has 10,000 records of customers approved in the past, each with 10 features, and wants to learn a classifier that decides whether to issue a card.

1. **Lock the test data first, and split it according to the test scenario.** After going live the system faces future applicants, so sort by time: lock away the latest 1,000 records as test data, take the 2,000 before them as validation, and train on the earliest 7,000. This does match test scenario and lock your test data in safe together.
2. **Occam's razor: try linear first.** Logistic regression directly on the 10 features has 11 parameters. The full quadratic transform has $\binom{12}{2} = 66$ components. If the linear model is good enough on the validation set, there is no need to bring in 66 dimensions.
3. **Compute scaling from the training data only.** The mean and standard deviation come from those 7,000 records and are then applied to the validation and test data.
4. **Count how many times the validation set was used.** Suppose $E_{\text{val}}$ is used to choose among 20 candidates (a few transforms combined with a few values of $\lambda$). Multi-bin Hoeffding gives $\epsilon = \sqrt{\frac{\ln(2M/\delta)}{2K}}$, and substituting $M = 20$, $K = 2000$, $\delta = 0.05$ gives $\epsilon \approx 0.041$. If the candidates are expanded to ten million, $\epsilon \approx 0.070$.
5. **Test only once.** The final $g$ is evaluated once on the 1,000 test records, using single-hypothesis Hoeffding, $\epsilon = \sqrt{\frac{\ln(2/\delta)}{2 \times 1000}} \approx 0.043$. If the test data had been used along the way to compare those 20 candidates, it would have to be computed with $M = 20$ instead, $\epsilon \approx 0.058$, and there would be no clean data left.
6. **The sampling bias that remains unsolved.** All 10,000 records are people the old rule approved. Suppose the old rule approved 60% of applicants, 5% of the approved later defaulted, and 30% of the rejected would have defaulted had they received a card. The default rate over all applicants is $0.6 \times 0.05 + 0.4 \times 0.30 = 0.15$, three times the 5% seen in the training data. However carefully the first five steps are done, $E_{\text{val}}$ and the test result both estimate performance on the distribution of "people the old rule would approve".

**What this walkthrough means.** The numbers in steps 4 and 5 hold only when the validation and test data really come from the future distribution; Hoeffding has nothing to say about distributions that differ. The first five steps are discipline you can keep yourself, while step 6 is a limit of the data itself: all you can do is know it exists and watch for it after going live. This is also why the handout separates sampling bias and data snooping into two principles: one asks where the data comes from, the other asks what you did with the data.

### Three future directions

The three directions listed on page 23 are More Transform, More Regularization, and Less Label. The lecture gives each one sentence: transforms more varied and more complex than polynomial transforms, and how to handle their computation; more advanced regularization, and how to keep the machine from bolting like a runaway horse; and what happens when there are not so many labels (for example unsupervised).

The lower half of the slide is scattered with a pile of terms: bagging, decision tree, support vector machine, neural network, kernel, AdaBoost, aggregation, sparsity, autoencoder, coordinate descent, dual, uniform blending, deep learning, nearest neighbor, decision stump, kernel LogReg, large-margin, prototype, quadratic programming, SVR, GBDT, PCA, random forest, matrix factorization, Gaussian kernel, soft-margin, k-means, OOB error, RBF network, probabilistic SVM. The bottom of the page reads ready for the jungle!. In the lecture, Lin says that once you study these terms a little you find that many of them are deeply connected to these sixteen lectures, and that what this course wants to give is a foundation. Lin also announces that the second half, Machine Learning Techniques, will cover several of these directions; its sixteen lectures begin with [Techniques Lecture 1: Linear SVM](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm-en).

### Fun Time: the magic numbers of this class

**Question (page 24):** What are the magic numbers that repeatedly appear in this class?

1. 3
2. 1126
3. both 3 and 1126
4. neither 3 nor 1126

**Answer: 3.** The handout's solution is 3 as illustrated, and you may recall 1126 somewhere. The 3 is the five groups of three in this section, six with the future directions. 1126 served as an example several times in earlier handouts: the option "err less than 1126" in the Fun Time of Foundations Lecture 10, the 1126th-order target function and $\sin(1126x)$ in Lecture 13, $\mathcal{H}(1126)$ in Lecture 14, and $\boldsymbol{\Phi}_{1126}$ in Lecture 15. Options 1 and 2 are each only half right, and option 4 denies both. Nothing needs deriving in this question; it is a joke before the course ends.

The summary on page 25 reduces each of the four sections to one phrase: Occam's razor is simple, simple, simple!; sampling bias is match test scenario as much as possible; data snooping is any use of data is 'contamination'; Power of Three is relatives, bounds, models, tools, principles. The next step is written as ready for jungle!.

## Self-check

**1. There are 6 distinct points on the one-dimensional number line, with labels generated by a fair coin. What is the probability that positive intervals (positive inside one interval, negative elsewhere) separate the data perfectly? What about positive rays? For which model is a successful separation more meaningful?**

Answer: for positive intervals, $m_{\mathcal{H}}(6) = \frac{1}{2} \times 36 + \frac{1}{2} \times 6 + 1 = 22$, and the probability is $22/64 \approx 34.4\%$. For positive rays, $m_{\mathcal{H}}(6) = 7$, and the probability is $7/64 \approx 10.9\%$. A separation by positive rays is more meaningful, because randomly labeled data is less likely to be separated by it by accident. Neither probability is small: 6 points are too few, and a separation by either model is not strong evidence.

**2. A poll can reach only 30% of voters (for example, it calls landlines only). Of this group 55% support candidate A, and of the remaining 70% of voters 42% support A. What is A's true support? With 2000 people interviewed, how large can the probability be that the poll result falls below 50%?**

Answer: the true support is $0.3 \times 0.55 + 0.7 \times 0.42 = 0.165 + 0.294 = 0.459$, so A does not have a majority. The support in the population the poll samples is 0.55, and a result below 0.50 means a deviation of more than 0.05; the upper bound from Hoeffding is $2\exp(-2 \times 0.05^2 \times 2000) = 2e^{-10} \approx 9 \times 10^{-5}$. So the poll almost certainly shows A with a majority, the opposite of the truth, and a larger sample does not help.

**3. Which of the four pipelines below involve data snooping, and which data set does each contaminate? (a) Standardize using the mean and standard deviation of all the data, then split into training and test; (b) compare 5 values of λ on the test set and report the best test error; (c) compute the correlation of every feature with the label on all the data, keep the 10 highest features, then run cross validation; (d) before looking at the data, decide from domain knowledge to use only the quadratic transform.**

Criteria: (a) yes, statistics of the test data entered the scale of the inputs, the same as in the exchange-rate example. (b) yes, the test set was used to choose, the reported number should use the bound with $M = 5$, and it is optimistic. (c) yes, the feature selection step saw the labels of all the data, including the validation data of every later fold, so the cross-validation result is no longer clean; the correct practice is to select features separately within the training part of each fold. (d) no, this is exactly what be blind asks for. An answer should be able to say "which data set affected which decision".

**4. Which bound fits each of three situations? (a) The final $g$ is evaluated on 1000 locked-away test examples; (b) 1000 validation examples are used to choose among 5 models; (c) PLA learns $g$ on the training data. What is ε in each of the first two situations at δ = 0.05?**

Answer: (a) single-hypothesis Hoeffding, $\epsilon = \sqrt{\ln(40)/2000} \approx 0.043$. (b) multi-bin Hoeffding with $M = 5$, $\epsilon = \sqrt{\ln(200)/2000} \approx 0.051$. (c) the VC bound, because PLA chooses from infinitely many lines.

**5. A benchmark's test set has 400 binary classification examples. There are 50 methods that are all actually guessing at random (true accuracy 50%). What is the approximate probability that at least one method reaches 55% on the test set? What does this show?**

Answer: the probability that a single method gets 220 or more right, from the binomial distribution, is $\sum_{k=220}^{400}\binom{400}{k}/2^{400} \approx 0.0255$. The probability that at least one of 50 independent methods reaches it is $1 - (1 - 0.0255)^{50} \approx 0.725$. In other words, with probability above 70%, the 55% at the top of the leaderboard comes entirely from selection. Criteria: the answer should point out that the test set was used for 50 comparisons, and that when the best number is reported it can no longer be treated as the test result of a single hypothesis.

## Exercises and corresponding reading

**The matching weeks in two semesters.** The [Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/) puts validation and this lecture in the same week (W8, 10/21), and this lecture's slides are [16u_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/doc/16u_handout.pdf). The [Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/) schedules it in W8 (10/28), with both lectures taught together; the slide link for that week was still a 404 on 2026-09-30, so this article uses only the MOOC handout.

**Textbook.** Both course pages map this lecture to Chapter 5 of [Learning from Data](http://amlbook.com) (LFD).

**Homework.** [Fall 2024 HW5](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw5/hw5.pdf) (released 2024-11-04, due 11-18) has two problems directly related to this lecture, with no official solutions:

- **Q3**: the problem states "In Lecture 16" explicitly. With 5 points and random labels, find the expected value of the smallest $E_{\text{in}}$ a decision stump can achieve; a note says that 1 minus twice the expected value is the empirical Rademacher complexity. This extends the Fun Time on page 6: Fun Time asks for the probability that $E_{\text{in}} = 0$, and this problem asks how well you can do when the data cannot be separated. Before starting, it helps to list the 20 labelings from this article yourself.
- **Q9**: when a classifier is deployed to a test distribution with a different ratio of positive to negative examples, under what conditions is it as bad as a constant classifier? This corresponds to this lecture's sampling bias: the test distribution differs from the training distribution.

The guide to the whole assignment is in the [Foundations homework guide](/posts/ai/2026-09-30-ntu-htlin-ml-foundations-homework-guide-en).

**One thing you can do tonight.** Open the code for your most recent model evaluation and confirm that the statistics for scaling or standardization are computed from the training data only (for example with a scikit-learn scaler, `fit` is called only on the training data). Then check whether the validation set matches the real usage scenario. These two checks correspond to the exchange-rate example and the Netflix story.

**Next lecture.** Foundations ends here. [Techniques Lecture 1: Linear SVM](/posts/ai/2026-09-30-ntu-htlin-ml-linear-dual-svm-en) starts from large-margin and support vector machine in that pile of terms on page 23.

## Course video sources

Original videos: [Occam's Razor](https://www.youtube.com/watch?v=Oj6j98ceUz8), [Sampling Bias](https://www.youtube.com/watch?v=8QZZiIAdTUU), [Data Snooping](https://www.youtube.com/watch?v=7nP5zWMQmxM), [Power of Three](https://www.youtube.com/watch?v=29jgHPeRAqI)

- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf)
- [Official course and recordings page](https://www.csie.ntu.edu.tw/~htlin/mooc/)

Checked: 2026-10-13. The video IDs, titles, and lengths were taken from the official playlist that day; YouTube has no caption track for these videos, and what this article reports from the lecture comes from transcripts made for it. These four are videos 62 to 65 of the Foundations playlist, and video 65 is the last one in the whole list.

## Update Log

- 2026-10-13: The series now has one article per lecture; this lecture is a newly split-out article, written from the handout and the video transcripts.

## References

- [Foundations Lecture 16 handout, 16_handout.pdf](https://www.csie.ntu.edu.tw/~htlin/mooc/doc/16_handout.pdf): the main source for this article; the statements of the three principles, the two stories, the exchange-rate and paper-relay examples, the five Power of Three tables, and the four Fun Time questions all come from this handout.
- [Machine Learning Foundations YouTube playlist](https://www.youtube.com/playlist?list=PLXVfgk9fNX2I7tB6oIINGBmW50rrmFTqf): the IDs and titles of the four videos; what the text reports as said "in the lecture" is paraphrased from machine transcripts of these four videos.
- [Hsuan-Tien Lin > MOOCs](https://www.csie.ntu.edu.tw/~htlin/mooc/): the official page for handouts and recordings.
- [Machine Learning, Fall 2024 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/): the matching week, the 16u slides, and the LFD chapter.
- [Machine Learning, Fall 2026 course page](https://www.csie.ntu.edu.tw/~htlin/course/ml26fall/): the matching week.
- [Fall 2024 Homework 5](https://www.csie.ntu.edu.tw/~htlin/course/ml24fall/hw5/hw5.pdf): the content of Q3 and Q9.
- [Learning from Data textbook site](http://amlbook.com): the source for Chapter 5.
- [Reading NTU Hsuan-Tien Lin Machine Learning Foundations & Techniques: course overview](/posts/ai/2026-09-30-ntu-htlin-ml-course-overview-en): where the lecture sits in the whole course and the reading routes.
