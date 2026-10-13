---
title: "Scaling Laws: With Ten Times the Compute, Grow the Model or the Data? | MIT 6.7960 Lecture 20"
date: 2026-10-13
category: tech
type: guide
tags:
  - mit-67960
  - deep-learning
  - scaling-laws
  - power-law
  - chinchilla
  - batch-size
  - fall-2024
lang: en
math: true
description: "MIT 6.7960 Fall 2024 OCW, Lecture 20 (Phillip Isola): power-law relationships between test loss and data, parameters and compute, the four findings of Kaplan et al., the Chinchilla revision, the data manifold hypothesis, data pruning and critical batch size. The public recording covers only the first 38 minutes; the second half is written from the slides."
tldr: "Test loss follows an approximate power law in data, parameters and compute, but the exponents are small: Kaplan et al. measure a data exponent of about 0.095, so doubling the data lowers the loss by only 6% and halving it takes over 1,400 times more. Two papers disagree on how to split compute: Kaplan gives parameters ∝ C^0.73 and data ∝ C^0.27, Chinchilla about half each. The public recording stops at the second finding; everything after that is written here from the slides, without the lecturer's spoken explanation."
draft: false
series:
  name: "Reading MIT 6.7960"
  order: 25
---

> 🌏 [中文版](/posts/tech/2026-10-13-mit-67960-l20-scaling-laws)

**Video status: Videos included.** [Video source and notes](#lecture-video-source)

> **Edition**: based on **MIT 6.7960 Fall 2024 OCW** (OCW Lec 20, Scaling Laws, taught by Phillip Isola). **The recording OCW published is only 38 minutes long**, and the official transcript stops around page 17 of the 52-page slide deck, in the middle of a sentence. The first half of this post follows the transcript and slides; the second half follows the slides only, and the two parts are marked separately.

---

## The Question This Lecture Answers

You have a fixed compute budget. Should you train a very large model on a little data, or a smaller model on a lot of data? The two can cost the same number of floating-point operations and give very different results.

Lecture 20 of [MIT 6.7960](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/) answers with **scaling laws**: measure at small scale how loss changes with resources, then extrapolate to large scale. Phillip Isola warns at the start that these last lectures are ongoing science, and that it is not yet known whether these empirical results will stand the test of time.

After this post you should be able to:

- Use a power-law exponent to work out how much the loss drops when a resource doubles.
- Explain why growing only the model or only the data shows no power law.
- Compare the Kaplan and Chinchilla allocations, and work out what each prescribes when compute grows 10x.
- Judge where increasing the batch size stops paying off.

Prerequisites are training and test loss from [Lecture 6 on generalization](/posts/tech/2026-10-13-mit-67960-l06-generalization-theory-en) and [Lecture 8 on Transformers](/posts/tech/2026-08-30-mit-67960-l08-transformers-en).

## Why Study Scale (from the Recording)

Deep learning wins when data, compute and parameters are all plentiful. His account can be organized into three reasons.

**The trend itself is predictable.** OpenAI's [AI and Compute](https://openai.com/index/ai-and-compute/) tracks the compute used to train landmark models, which grows steadily by year; Isola says in class that it doubles about every three months and that the slope has been steepening (the OpenAI post gives 3.4 months, with data through 2018).

**The bitter lesson.** Richard Sutton's 2019 essay [The Bitter Lesson](http://www.incompleteideas.net/IncIdeas/BitterLesson.html) argues that most clever algorithms did not last, and that what won systematically were simple methods that scale with resources. So which method is better today matters less than which is better after scaling. Isola says many people disliked the essay and many loved it, and that he thinks there is a lot of truth in it.

**It saves money.** This is the most practical reason. If one training run of the final model costs a million dollars, intuition says the hyperparameter search during design should cost a hundred times that. What is actually done is to run all the searches and comparisons at a thousandth to a ten-thousandth of the final scale, measure at several small scales, fit a curve of loss against compute, extrapolate to the final scale, pick the configuration predicted to be best, and train at large scale once. The slides label this a 10,000x saving.

Such curves hold for more than the loss. The lecture shows a plot of downstream capability (pass rate on 23 coding problems) that is also a predictable curve.

Isola also notes that scaling laws are not a new idea. Asymptotic analysis and big-O notation in an algorithms course ask the same thing: how does cost grow as the input grows?

## The Form of the Problem

Three resources: the number of parameters $N$, the amount of data $D$ (here the number of training tokens, not depth and not dimensionality), and compute $C$. Training a model with $N$ parameters on $D$ data points costs roughly in proportion to $N \times D$. The estimate used in [Kaplan et al.'s 2020 paper](https://arxiv.org/abs/2001.08361) is:

$$
C \approx 6 \times N \times B \times S
$$

$B$ is the batch size and $S$ the number of gradient steps, so $B \times S$ is the data seen. Isola says he does not know where the constant 6 comes from, only that it converts the units to floating-point operations.

The problem to solve: for fixed $C$, which $N$ and $D$ give the lowest test loss?

A student asks whether compute equals time. It does not: twice the compute can be twice the time, or twice the GPUs running in parallel.

The experimental setup (from the slides): an autoregressive Transformer on WebText2 with a 1024-token context; model sizes from 768 to 1.5 billion non-embedding parameters, and data from 22 million to 23 billion tokens. Everything is trained for one epoch, so the tokens seen equal the dataset size.

## Finding One: Power Laws (from the Recording)

With all other factors set optimally, test loss relates to any one resource $X$ approximately as:

$$
L(X) = \left(\frac{X_c}{X}\right)^{\alpha}
$$

A power law means "multiply the resource by a factor and the loss is multiplied by a fixed factor." Double the resource and the loss becomes $2^{-\alpha}$ of what it was. On log-log axes it is a straight line with slope $-\alpha$, and $X_c$ only sets the height of the line.

For data, Kaplan et al. fit $\alpha_D \approx 0.095$ and $D_c \approx 5.4 \times 10^{13}$ tokens. Parameters and compute each have their own power law with different exponents and constants.

One exchange and one caution from class are worth recording:

- **Why a power law and not exponential decay?** Isola answers that it is mostly an empirical fact: a power law fits better than an exponential. A theoretical model comes later, but he says he is not sure how much he trusts it.
- **Is this a physical law?** No. The points could have traced a parabola; they just happen to form a line on a log-log plot.

### The Power Law Is an Envelope

This is the easiest point to misread. Take **one** model of fixed size and **one** dataset of fixed size, add only compute, and what you plot is not a power law but a curve that flattens. The power law is the lower edge (the Pareto frontier) of many such curves: at each level of compute, tune the model size and the data to their best values, and joining those points gives the straight line.

So if you scale only one factor, diminishing returns are normal and do not mean the power law has failed.

## Finding Two: Scale Model and Data Together (from the Recording)

Plot models of different sizes on the same "loss against tokens" chart: a large enough model follows the power law; a model that is too small stops improving however much data you add, because it lacks the capacity. In the words of Kaplan et al., performance improves predictably as long as $N$ and $D$ are scaled up in tandem, and enters diminishing returns if either is held fixed while the other increases.

The joint forms they fit (from the slides):

$$
L(N, D) = \left[\left(\frac{N_c}{N}\right)^{\alpha_N/\alpha_D} + \frac{D_c}{D}\right]^{\alpha_D}
\qquad
L(N, S_{\min}) = \left(\frac{N_c}{N}\right)^{\alpha_N} + \left(\frac{S_c}{S_{\min}}\right)^{\alpha_S}
$$

Isola treats formulas like these with reserve. He quotes "with five parameters you can fit an elephant" and says there may be some reading of tea leaves here. Counting on the spot he gets five free constants in the first formula; as written there are four: $N_c$, $D_c$, $\alpha_N$ and $\alpha_D$. As for who said it, he first guesses von Neumann, a student says they heard it attributed to Anderson, and he accepts that. An addition of mine: the usual source is Freeman Dyson recalling Fermi quoting von Neumann, and the original has four parameters fitting the elephant and a fifth making it wiggle its trunk (see [A meeting with Enrico Fermi](https://www.nature.com/articles/427297a)).

The evidence that these forms are more than curve fitting is that they extrapolate. [Rosenfeld et al.](https://arxiv.org/abs/1909.12673) fit a similar form (a sum of two power laws) on vision and language tasks using only points at some scales, then predict scales that were held out, and the predictions hold.

The fitted exponents imply an optimal allocation of compute:

$$
N \propto C^{0.73}, \qquad D = B \times S \propto C^{0.27}
$$

That is, as compute grows the model should grow much more than the data. Next to it the slides say in blue: take these exact equations and numbers with a grain of salt.

**The transcript and the public recording end here**, on the sentence where Isola is about to summarize the second finding.

## From Here On, Slides Only

Nothing in this section has the lecturer's spoken explanation. This post relays what the slides say and does not add inferences the slides do not make.

### The Remaining Findings of Kaplan et al.

- **Finding three**: performance depends strongly on scale and only weakly on model shape (the ratio of depth, width and attention heads).
- **Finding four**: larger models need fewer samples to reach the same performance. The slides also cite [Li et al. (2020)](https://bair.berkeley.edu/blog/2020/03/05/compress/): larger models train faster, and little is lost by compressing them afterward.

The takeaways on the slides: loss is more sensitive to parameter count than to data, so with more compute the model should grow by a larger factor than the dataset; do not train to completion, make the model larger instead.

The slides also list limitations the paper itself admits: how loss scales with $D$ at very large model size "still remains mysterious"; the small-data regime was not studied thoroughly and $L(N, D)$ fits poorly there; regularization and data augmentation were not studied; not every hyperparameter was tuned, and short runs might have better learning rates.

### Two Years Later: Chinchilla

[Hoffmann et al. (2022)](https://arxiv.org/abs/2203.15556), the paper that trained the Chinchilla model, still assumes a power law but arrives at a different allocation. The differences listed on the slides: learning-rate schedules adapted to dataset size (not explored by Kaplan et al.), and larger models (over 500 million parameters).

They estimate $L(N, D)$ three ways: fix the model size and record the whole training curve; fix the compute and compare final loss across $(N, D)$; fit the parametric form $\hat L(N, D) = E + A/N^{\alpha} + B/D^{\beta}$. All three give roughly the same allocation:

$$
N \propto C^{0.49}, \qquad D \propto C^{0.51}
$$

The slides' reading: existing large models at the time would have needed much more training data than they got, and the better allocation is a smaller model with more data and steps.

Limitations listed on the slides: smoothed training loss stands in for test loss; there were only two large-scale runs (Gopher and Chinchilla); the curve bends somewhat at high compute, so the power law may not hold universally; training is for one epoch only.

Another slide lists results from other work, including that vision models (CNNs) have a larger exponent in model size, $\alpha \approx 0.5$.

### Why a Power Law: The Data Manifold Hypothesis

The slides give a toy model. To approximate a Lipschitz function on $[0,1]^d$ with a piecewise constant function, cut the space into hypercubes of side $s$, which takes $N = s^{-d}$ pieces. Mean squared error shrinks as $s^2$, which in terms of $N$ is:

$$
L(N) \lesssim N^{-2/d}
$$

A ReLU network is piecewise linear, so its error shrinks as $s^4$ and $L(N) \lesssim N^{-4/d}$.

The hypothesis is that a neural network is really doing regression on a low-dimensional data manifold; replace $d$ with the manifold's intrinsic dimension and you get $\alpha \approx 4/d$. This says the exponent is set mainly by the data and the task, so different models on the same data should have similar exponents. The slides say the prediction fits vision models well and gives only $\alpha \gtrsim 4/d$ for Transformers. The corresponding paper is [Sharma and Kaplan, A Neural Scaling Law from the Dimension of the Data Manifold](https://arxiv.org/abs/2004.10802).

### Breaking the Power Law: Data Pruning

A small exponent means each small drop in loss costs another order of magnitude of data or parameters. The slides read this as a sign that many training examples are highly redundant, and that pruning data intelligently can scale better than the power law ([Sorscher et al., 2022](https://arxiv.org/abs/2206.14486)).

### Critical Batch Size

The slides open with a question: 16 steps at batch size 16 and 1 step at batch size 256 cost the same compute, so which is better? There are costs beyond compute as well: one node can only process a batch up to some size in parallel, and beyond that you must split across nodes (communication cost) or compute sequentially (time cost).

[The model of McCandlish, Kaplan and Amodei (2018)](https://arxiv.org/abs/1812.06162) splits the minibatch gradient into the true gradient plus noise and derives that the progress one SGD step can make is proportional to:

$$
\frac{1}{1 + B_{\text{noise}}/B}
$$

$B_{\text{noise}}$ is the noise scale. When $B$ is far below it, doubling the batch doubles the progress (perfect scaling); when $B$ is far above it, increasing further has almost no effect. The crossover $B \approx B_{\text{noise}}$ is the **critical batch size**.

### Representational Convergence

The last few slides belong to a different topic. Describe a representation by its kernel (how similar the embeddings of any two inputs are), then compare the kernels of language models with those of vision models. The plot shows that the better a language model performs, the more its kernel aligns with that of the vision model DINOv2. The source is [The Platonic Representation Hypothesis](https://arxiv.org/abs/2405.07987) (Huh, Cheung, Wang, Isola, ICML 2024). The slides carry no explanatory text, and this post does not interpret further.

## Working the Numbers

The examples below are computed for this post from the formulas above; they are not from the lecture.

**1. What doubling the data buys.** Take $\alpha_D = 0.095$:

| Data becomes | Loss becomes |
|---|---|
| 2x | $2^{-0.095} = 0.936$ (6.4% lower) |
| 10x | $10^{-0.095} = 0.804$ (19.6% lower) |

Halving the loss takes $2^{1/0.095} \approx 1{,}475$ times the data. Check against the fitted form on the slide, $L = (D / 5.4 \times 10^{13})^{-0.095}$: at $D = 10^8$, $L \approx 3.50$; at $D = 10^9$, $L \approx 2.82$, which matches the points on the plot.

**2. How to split 10x the compute.**

| | Parameters times | Data times |
|---|---|---|
| Kaplan ($C^{0.73}$, $C^{0.27}$) | 5.4 | 1.9 |
| Chinchilla ($C^{0.49}$, $C^{0.51}$) | 3.1 | 3.2 |

Both rows multiply to 10. The gap widens at 100x compute: Kaplan gives 29x the parameters and 3.5x the data; Chinchilla gives 9.5x the parameters and 10.5x the data. For the same budget the former buys a model three times larger and the latter sees three times more data.

**3. Returns on batch size.**

| $B / B_{\text{noise}}$ | Progress per step (maximum 1) |
|---|---|
| 0.1 | 0.091 |
| 1 | 0.5 |
| 10 | 0.909 |

From 0.1 to 1 the batch grows 10x and progress grows 5.5x, which is still reasonable. From 1 to 10 the batch again grows 10x and progress grows only 1.8x.

**4. Exponent and dimension.** Under the manifold hypothesis $\alpha \approx 4/d$, an intrinsic dimension of $d = 40$ gives $\alpha = 0.1$. The higher the dimension, the smaller the exponent and the worse the return on scaling.

## Common Misunderstandings

- **"A power law means scaling always works."** It holds only when the other factors are tuned to their best. Fix the model and add only data, and the curve flattens.
- **"0.73 and 0.27 are laws."** Two years later they were revised to about half each. The slides themselves say to take them with a grain of salt.
- **"A small exponent means scaling is useless."** A small exponent means expensive, not without return. Being able to predict is what lets you work out in advance whether it is worth it.
- **"Bigger batches are always more efficient."** Far past the critical batch size, almost all the extra compute goes into a gradient estimate that was already accurate enough.

## Check Yourself

1. A task measures $\alpha_N = 0.5$. Parameters grow 4x. What happens to the loss?
   **Answer**: $4^{-0.5} = 0.5$; it halves. This is the case the slides mention of vision models (CNNs) having a larger exponent.
2. You hold the model fixed, add 100x the data, and the loss barely moves. Does that violate the scaling law?
   **Answer**: no. Model capacity is already the bottleneck. The power law is the envelope after model size is also tuned to its best.
3. Under the Chinchilla allocation, compute grows 4x. By how much should the model grow?
   **Answer**: $4^{0.49} \approx 1.97$, about 2x, and the data about 2x as well.
4. Your batch size equals the noise scale exactly. Double the batch. How much does progress per step increase?
   **Answer**: from $1/(1+1) = 0.5$ to $1/(1+0.5) = 0.667$, an increase of one third, while compute per step doubles.

## Lecture Video Source

Rechecked against the live MIT OCW Fall 2024 gallery on 2026-10-13: the lecture number matches and the video is public and embeddable. Lecture numbering and topics follow OCW. **This video is 38 minutes 22 seconds long**, while the other lectures run about 68 to 83 minutes; the official transcript likewise ends mid-sentence, so it is the published recording that covers only the first half, not a transcript with missing pages. OCW gives no reason.

```youtube
url: https://www.youtube.com/watch?v=7hbf4klU3ks
title: MIT 6.7960 Fall 2024 — Lec 20. Scaling Laws
```

Original video: [MIT 6.7960 Fall 2024 — Lec 20. Scaling Laws](https://www.youtube.com/watch?v=7hbf4klU3ks)

Course and recording links:

- [MIT OCW — Lec 20. Scaling Laws](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/resources/mit6_7960f24_lec20_mp4/)
- [MIT 6.7960 Fall 2024 — official lecture video gallery](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/video_galleries/lecture-videos/)

Checked: 2026-10-13.

Content check: verified against the video transcript (2026-10-13): read the full official OCW transcript and the entire slide deck. The transcript has no timestamps and the audio was not replayed for this post. The transcript covers only up to the second finding; the sections after that follow the slides only, as marked in the text. The "Working the Numbers" section is computed for this post.

## References

- [MIT 6.7960 Fall 2024 OCW course home](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)
- [Lec 20 official transcript (PDF)](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/mit6_7960f24_lec20_transcript.pdf)
- [Lecture 20: Scaling Laws slides](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/resources/mit6_7960_f24_lec20_pdf/)
- Kaplan, McCandlish et al., [Scaling Laws for Neural Language Models](https://arxiv.org/abs/2001.08361) (2020)
- Hoffmann et al., [Training Compute-Optimal Large Language Models](https://arxiv.org/abs/2203.15556) (Chinchilla, 2022)
- Freeman Dyson, [A meeting with Enrico Fermi](https://www.nature.com/articles/427297a) (Nature, 2004)
- Rosenfeld et al., [A Constructive Prediction of the Generalization Error Across Scales](https://arxiv.org/abs/1909.12673)
- Sharma & Kaplan, [A Neural Scaling Law from the Dimension of the Data Manifold](https://arxiv.org/abs/2004.10802)
- Sorscher et al., [Beyond neural scaling laws: beating power law scaling via data pruning](https://arxiv.org/abs/2206.14486)
- McCandlish, Kaplan, Amodei, [An Empirical Model of Large-Batch Training](https://arxiv.org/abs/1812.06162)
- Huh, Cheung, Wang, Isola, [The Platonic Representation Hypothesis](https://arxiv.org/abs/2405.07987)
- Richard Sutton, [The Bitter Lesson](http://www.incompleteideas.net/IncIdeas/BitterLesson.html) (2019)
- OpenAI, [AI and Compute](https://openai.com/index/ai-and-compute/)
- BAIR Blog, [Speeding Up Transformer Training and Inference By Increasing Model Size](https://bair.berkeley.edu/blog/2020/03/05/compress/)
