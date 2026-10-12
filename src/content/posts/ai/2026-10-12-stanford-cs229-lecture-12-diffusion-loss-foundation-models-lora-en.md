---
title: "The Diffusion Noise-Prediction Loss, Foundation Models, and LoRA | Stanford CS229 Lecture 12"
date: 2026-10-12
category: ai
type: guide
tags: [cs229, ai-course, stanford, machine-learning, diffusion-model, foundation-models, lora]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 12
tldr: "The first half collapses the diffusion ELBO into one expression: every time step is a squared error for guessing the noise that was added, which gives a five-step training procedure and a one-loop sampler. The second half opens the foundation-model unit: the two-stage paradigm of pretraining plus adaptation, linear probe, finetune, LP-FT, and why LoRA trains only 2dr parameters yet saves very little compute."
description: "A guide to Lecture 12 of Stanford CS229 Spring 2026: the full derivation of the diffusion loss from the posterior mean down to noise prediction, the training and sampling algorithms, then pretraining and adaptation of foundation models, linear probe, finetune, LP-FT, and LoRA."
draft: false
math: true
---

> 🌏 [中文版](/posts/ai/2026-10-12-stanford-cs229-lecture-12-diffusion-loss-foundation-models-lora)

**Video status: Videos included.** This article is written from the English captions of the Spring 2026 Lecture 12 recording published by Stanford Online, with notation matched to the end of Chapter 14 and to Chapter 15 of the 2026 main notes. I did not see the board, so the formulas written on it are reconstructed from the notes.

This lecture has two topics that have nothing to do with each other; they just landed on the same day. The first 34 minutes finish the diffusion loss that the [previous lecture](/posts/ai/2026-10-12-stanford-cs229-lecture-11-diffusion-models-en) left open, and the conclusion is that the whole training objective can be written as "make the network guess the noise that was added." The last 40 minutes open the next four or five lectures on large language models: the two-stage paradigm of foundation models, and how to adapt a pretrained model to a new task when you have labeled data, covering linear probe, finetune, LP-FT, and LoRA.

The YouTube title says Representation Learning. In practice, representation learning shows up in this lecture as a single definition (from 47:51), used to set up the linear probe; twice the lecturer says that how representations are trained is left to the [next lecture](/posts/ai/2026-10-12-stanford-cs229-lecture-13-representation-learning-semantic-search-en). So the title reads more like the name of the unit than a summary of these 76 minutes.

Prerequisites: the forward process and ELBO from the previous lecture, conditional distributions of a multivariate Gaussian, and backpropagation. After reading, you should be able to derive the noise-prediction loss from the posterior mean yourself, work one training step and one sampling step by hand, and say how much LoRA saves on each of three things: compute, memory, and serving many users. For the whole course, see the [Stanford CS229 Course Overview](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en).

```youtube
url: https://www.youtube.com/watch?v=_kREM2UAiJ8
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 12: Representation Learning
captions: en
```

The lecturer is Tengyu Ma. In the first two minutes (00:05–02:11) he lays out the remaining seven or eight lectures: one on what people did before GPT became mainstream, then training autoregressive language models, post-training of language models and reinforcement learning, with reinforcement learning basics and robotics applications mixed in, plus one guest lecture on machine learning systems.

## First half: the diffusion loss

### Where the previous lecture stopped (recording 02:11–07:35)

Set up the notation first; all of it carries over from the previous lecture. The forward process $q$ is a fixed noising chain, $x_0$ is the clean image, and $x_T$ is close to a standard Gaussian. With $\alpha_t = 1-\beta_t$ and $\bar\alpha_t = \prod_{s=1}^{t}\alpha_s$, the previous lecture gave the one-shot form:

$$
x_t = \sqrt{\bar\alpha_t}\,x_0 + \sqrt{1-\bar\alpha_t}\,\hat\epsilon_t,\qquad \hat\epsilon_t\sim\mathcal N(0,I).
$$

The reverse process is the model to be learned. Every step is Gaussian, with the mean output by a neural network:

$$
p_\theta(x_{t-1}\mid x_t) = \mathcal N\big(\mu_\theta(x_t,t),\ \tilde\beta_t I\big).
$$

Taking the ELBO of $\log p_\theta(x_0)$ leaves three kinds of terms:

$$
\log p_\theta(x_0)\ \ge\ \underbrace{\mathbb E_q\big[\log p_\theta(x_0\mid x_{1:T})\big]}_{\text{last-step reconstruction}}\ -\ \underbrace{\mathrm{KL}\big(q(x_T\mid x_0)\,\Vert\,p_\theta(x_T)\big)}_{L_T\ (\text{terminal})}\ -\ \sum_{t=2}^{T}\underbrace{\mathbb E_q\,\mathrm{KL}\big(q(x_{t-1}\mid x_t,x_0)\,\Vert\,p_\theta(x_{t-1}\mid x_t)\big)}_{L_{t-1}}.
$$

The previous lecture only handled the last group, the $L_{t-1}$ terms. The true posterior $q(x_{t-1}\mid x_t,x_0)$ is the Gaussian $\mathcal N(\tilde\mu_t(x_t,x_0),\tilde\beta_t I)$, and the model's variance is deliberately chosen to be the same $\tilde\beta_t$. For two Gaussians with the same covariance, the KL reduces to the difference of the means:

$$
L_{t-1} = \mathbb E_q\left[\frac{1}{2\tilde\beta_t}\big\lVert \tilde\mu_t(x_t,x_0)-\mu_\theta(x_t,t)\big\rVert_2^2\right].
$$

The expectation is over $x_t$: draw an $x_t$ from $q$, compute the two means, subtract and square, then average over the randomness of $x_t$.

### The two remaining terms: one is zero, one looks like the rest (recording 07:35–14:58)

**The terminal term $L_T$.** $p_\theta(x_T)$ is defined to be a standard Gaussian. When $T$ is large enough, the noise washes out the signal and $q(x_T\mid x_0)$ also approaches a standard Gaussian. The two distributions are the same, so the KL is zero (strictly, it tends to zero as $T$ grows), and it is simply treated as zero. The notes add another reason: this term does not contain $\theta$ at all, so even if it were not zero it would not affect training.

**The last-step reconstruction.** The notes call this term $L_0$ (in the captions it sounds like "L1"; this article follows the notes). The derivation takes four steps.

Step one: the reverse model is a Markov chain, so given $x_1$, the variables $x_2,\dots,x_T$ carry no further information, and $p_\theta(x_0\mid x_{1:T}) = p_\theta(x_0\mid x_1)$.

Step two: the model for the step $x_1\to x_0$ was never specified, so make it Gaussian like the other steps: $p_\theta(x_0\mid x_1)=\mathcal N(\mu_\theta(x_1,1),\sigma_1^2 I)$.

Step three: take the log of the Gaussian density. Everything outside the exponent becomes a constant, leaving the quadratic inside the exponent:

$$
\log p_\theta(x_0\mid x_1) = -\frac{1}{2\sigma_1^2}\big\lVert x_0-\mu_\theta(x_1,1)\big\rVert_2^2 + \text{const}.
$$

Step four is a notational arrangement: define $\tilde\mu_1(x_1,x_0) := x_0$. The expression above then becomes $\lVert\tilde\mu_1-\mu_\theta(x_1,1)\rVert^2$ times a coefficient, the same shape as $L_{t-1}$ for $t\ge 2$.

This definition should not be just a way to force the shapes to match; it has to be checked against the $\tilde\mu_t$ formula for $t\ge 2$. Apply the one-shot formula at $t=1$ (where $\bar\alpha_1=\alpha_1$ and $1-\bar\alpha_1=\beta_1$) and solve for $x_0$:

$$
x_0 = \frac{x_1-\sqrt{1-\bar\alpha_1}\,\hat\epsilon_1}{\sqrt{\bar\alpha_1}} = \frac{1}{\sqrt{\alpha_1}}\big(x_1-\sqrt{\beta_1}\,\hat\epsilon_1\big).
$$

The next section derives, for $t\ge 2$, $\tilde\mu_t = \frac{1}{\sqrt{\alpha_t}}\big(x_t-\frac{\beta_t}{\sqrt{1-\bar\alpha_t}}\hat\epsilon_t\big)$. Plug in $t=1$: $\frac{\beta_1}{\sqrt{1-\bar\alpha_1}}=\frac{\beta_1}{\sqrt{\beta_1}}=\sqrt{\beta_1}$, which is exactly the line above. So one formula holds all the way from $t=1$ to $t=T$. The lecturer's comment is that there is a more fundamental reason behind it, but you can also treat it as a coincidence caused by different notation at the boundary.

At this point, the ELBO to maximize equals $-\sum_{t=0}^{T-1} L_t$ (equation (14.17) in the notes, with $L_T$ already dropped), which means minimizing the sum of squared errors over all time steps. The subscripts line up as follows: $L_0$ covers $x_1\to x_0$, and $L_{t-1}$ covers $x_t\to x_{t-1}$. The name is always one less than the $x_t$ it uses.

### Drop the coefficients, then look again at what this loss compares (recording 14:58–19:09)

The lecturer then mentions a practical detail: the coefficient in front of each term ($\frac{1}{2\tilde\beta_t}$, $\frac{1}{2\sigma_1^2}$) is simply dropped in implementations, leaving

$$
L_{t-1} = \mathbb E_q\,\big\lVert \tilde\mu_t(x_t,x_0)-\mu_\theta(x_t,t)\big\rVert_2^2 .
$$

Then he restates what each of the two means stands for, and this part is worth pausing on:

- $\mu_\theta(x_t,t)$ is the model's guess for the mean of $x_{t-1}$ when it sees only $x_t$.
- $\tilde\mu_t(x_t,x_0)$ is the true process's reconstruction of $x_{t-1}$ when it knows both $x_t$ and $x_0$. The previous lecture showed it is a linear combination of $x_0$ and $x_t$.

The loss asks the model's reconstruction to stay close to the latter. This is an algorithm you can implement directly: draw $x_0$, run the forward process to get $x_t$, compute $\tilde\mu_t$ from the formula, feed $x_t$ into the network to get $\mu_\theta$, compute the squared error, and backpropagate.

Here is a point the lecture does not spell out and that often trips up self-learners (an addition in this article): the model cannot see $x_0$, so how can it match a target that contains $x_0$? The answer is in the expectation. The minimizer of a squared error in expectation is the conditional mean, so the best $\mu_\theta(x_t,t)$ is $\mathbb E[\tilde\mu_t\mid x_t]$, an average over every $x_0$ that could have produced this $x_t$. The model does not have to guess the $x_0$ of any single data point.

### Where the posterior mean comes from, and switching to noise prediction (recording 19:09–26:34)

At this point the lecturer is not sure whether the previous lecture explained where $\tilde\mu_t$ comes from, so he goes back and gives the idea: conditioned on $x_0$, $x_{t-1}$ and $x_t$ are jointly Gaussian, any conditional distribution of a joint Gaussian is still Gaussian, and the appendix of the notes has a ready-made formula to plug into. The lecture only gives the route; the calculation below is an addition in this article, following Lemma A.1.2 in the notes. The guide to the previous lecture took the Bayes-rule, complete-the-square route. Here we take the route in the notes, and both give the same $\tilde\mu_t$ and $\tilde\beta_t$.

Given $x_0$, the coordinates are independent, so look at one dimension:

- $x_{t-1}$ has mean $\sqrt{\bar\alpha_{t-1}}x_0$ and variance $1-\bar\alpha_{t-1}$.
- $x_t=\sqrt{\alpha_t}x_{t-1}+\sqrt{\beta_t}\epsilon_t$ has mean $\sqrt{\bar\alpha_t}x_0$ and variance $1-\bar\alpha_t$.
- Their covariance is $\mathrm{Cov}(x_{t-1},\sqrt{\alpha_t}x_{t-1}+\sqrt{\beta_t}\epsilon_t)=\sqrt{\alpha_t}\,\mathrm{Var}(x_{t-1})=\sqrt{\alpha_t}(1-\bar\alpha_{t-1})$, because $\epsilon_t$ is independent of $x_{t-1}$.

The conditional Gaussian formula is $\mathbb E[A\mid B]=\mu_A+\frac{\mathrm{Cov}(A,B)}{\mathrm{Var}(B)}(B-\mu_B)$. Set $A=x_{t-1}$ and $B=x_t$:

$$
\tilde\mu_t = \sqrt{\bar\alpha_{t-1}}x_0+\frac{\sqrt{\alpha_t}(1-\bar\alpha_{t-1})}{1-\bar\alpha_t}\big(x_t-\sqrt{\bar\alpha_t}x_0\big).
$$

The coefficient of $x_0$ is $\sqrt{\bar\alpha_{t-1}}-\frac{\sqrt{\alpha_t}(1-\bar\alpha_{t-1})}{1-\bar\alpha_t}\sqrt{\bar\alpha_t}$. Use $\sqrt{\bar\alpha_t}=\sqrt{\alpha_t}\sqrt{\bar\alpha_{t-1}}$ to factor out $\sqrt{\bar\alpha_{t-1}}$; after putting the bracket over a common denominator, the numerator is $(1-\bar\alpha_t)-\alpha_t(1-\bar\alpha_{t-1})=1-\bar\alpha_t-\alpha_t+\bar\alpha_t=\beta_t$. The variance uses the other half of the same lemma, $\mathrm{Var}(A\mid B)=\mathrm{Var}(A)-\frac{\mathrm{Cov}(A,B)^2}{\mathrm{Var}(B)}$:

$$
\tilde\beta_t=(1-\bar\alpha_{t-1})-\frac{\alpha_t(1-\bar\alpha_{t-1})^2}{1-\bar\alpha_t}=\frac{(1-\bar\alpha_{t-1})\big[(1-\bar\alpha_t)-\alpha_t(1-\bar\alpha_{t-1})\big]}{1-\bar\alpha_t}=\frac{1-\bar\alpha_{t-1}}{1-\bar\alpha_t}\beta_t .
$$

Put together:

$$
\tilde\mu_t(x_t,x_0)=\frac{\sqrt{\bar\alpha_{t-1}}\,\beta_t}{1-\bar\alpha_t}x_0+\frac{\sqrt{\alpha_t}(1-\bar\alpha_{t-1})}{1-\bar\alpha_t}x_t,\qquad \tilde\beta_t=\frac{1-\bar\alpha_{t-1}}{1-\bar\alpha_t}\beta_t .
$$

The coefficients look complicated, but they are just two scalars. Now comes the main line of the lecture. $x_t$, $x_0$, and $\hat\epsilon_t$ are tied together linearly by the one-shot formula; knowing any two gives the third, so $x_0$ can be swapped out. Substitute $x_0=\frac{1}{\sqrt{\bar\alpha_t}}(x_t-\sqrt{1-\bar\alpha_t}\hat\epsilon_t)$:

- Coefficient of $x_t$: $\frac{\beta_t}{\sqrt{\alpha_t}(1-\bar\alpha_t)}+\frac{\sqrt{\alpha_t}(1-\bar\alpha_{t-1})}{1-\bar\alpha_t}=\frac{\beta_t+\alpha_t-\bar\alpha_t}{\sqrt{\alpha_t}(1-\bar\alpha_t)}=\frac{1}{\sqrt{\alpha_t}}$.
- Coefficient of $\hat\epsilon_t$: $-\frac{\beta_t}{\sqrt{\alpha_t}(1-\bar\alpha_t)}\sqrt{1-\bar\alpha_t}=-\frac{\beta_t}{\sqrt{\alpha_t}\sqrt{1-\bar\alpha_t}}$.

So

$$
\tilde\mu_t=\frac{1}{\sqrt{\alpha_t}}\left(x_t-\frac{\beta_t}{\sqrt{1-\bar\alpha_t}}\,\hat\epsilon_t\right).
$$

Now the target contains only $x_t$ and $\hat\epsilon_t$. $x_t$ is the network's input, so it is already known. The lecturer's point is: why make the network learn the part you already know? Hard-code it into the formula and let the network handle only the unknown piece. So parameterize the model's mean in the same shape, with the network $\epsilon_\theta$ outputting only an estimate of the noise:

$$
\mu_\theta(x_t,t)=\frac{1}{\sqrt{\alpha_t}}\left(x_t-\frac{\beta_t}{\sqrt{1-\bar\alpha_t}}\,\epsilon_\theta(x_t,t)\right).
$$

Subtract the two and the $x_t$ term cancels completely:

$$
\tilde\mu_t-\mu_\theta=-\frac{\beta_t}{\sqrt{\alpha_t}\sqrt{1-\bar\alpha_t}}\big(\hat\epsilon_t-\epsilon_\theta(x_t,t)\big),
$$

Square it and multiply back the original $\frac{1}{2\tilde\beta_t}$:

$$
L_{t-1}=\frac{\beta_t^2}{2\tilde\beta_t\,\alpha_t(1-\bar\alpha_t)}\ \mathbb E\,\big\lVert\hat\epsilon_t-\epsilon_\theta(x_t,t)\big\rVert_2^2 .
$$

> "So basically, you turn this reconstruction into a noise prediction problem." (25:31)

$\hat\epsilon_t$ is the noise that was added to build $x_t$ in the first place, and the network's job is to look at $x_t$ and guess it back. Then the coefficient in front is dropped once more, leaving only $\lVert\hat\epsilon_t-\epsilon_\theta\rVert^2$.

The two "drop the coefficient" moves need to be kept apart (this paragraph is an addition in this article; both times the lecture only says to drop the coefficient). Dropping $\frac{1}{2\tilde\beta_t}$ in the $\mu$ form and dropping the whole coefficient in the $\epsilon$ form give two different weightings, which differ by a factor that varies with $t$, $\frac{\beta_t^2}{\alpha_t(1-\bar\alpha_t)}$. What the lecture ends up using, and what (14.28) in the notes writes, is the unweighted version in the $\epsilon$ form.

### Five steps to train, one loop to sample (recording 26:34–32:04)

**Training** (notes pp.187–188):

1. Draw an $x_0$ from the training set.
2. Draw a time step $t$ uniformly from $1$ to $T$. The original objective is a sum of $T$ terms; here one term is picked at random each time, the same idea as stochastic gradient descent drawing one data point at a time.
3. Draw noise $\epsilon\sim\mathcal N(0,I)$.
4. Build $x_t=\sqrt{\bar\alpha_t}x_0+\sqrt{1-\bar\alpha_t}\,\epsilon$.
5. Compute the gradient of $L_t(\theta)=\lVert\epsilon-\epsilon_\theta(x_t,t)\rVert_2^2$ and update $\theta$.

Most texts write $\hat\epsilon_t$ simply as $\epsilon$. The lecturer's take is that it is a random variable anyway, so the name does not matter. The notes give the reason more fully: the $\hat\epsilon_t$ for different $t$ are correlated with each other and not i.i.d., but each training step uses only one time step and only needs its marginal distribution to be a standard Gaussian, so the subscript serves no purpose. The loss in step 5 is named $L_t(\theta)$ after equation (14.28) in the notes, with the subscript being the sampled time step; it corresponds to $L_{t-1}$ in the ELBO decomposition, and the off-by-one is only naming.

**Sampling**:

1. Draw $x_T\sim\mathcal N(0,I)$.
2. For $t=T,T-1,\dots,1$: compute $\epsilon_\theta(x_t,t)$, plug it into the formula above to get $\mu_\theta(x_t,t)$, then set $x_{t-1}=\mu_\theta(x_t,t)+\sigma_t\xi$ with $\xi\sim\mathcal N(0,I)$.

Each step of the reverse process carries its own noise, hence the $\sigma_t\xi$; we chose $\sigma_t^2=\tilde\beta_t$ earlier, so $\sigma_t=\sqrt{\tilde\beta_t}$. The notes have one detail the lecture does not mention: at the last step ($t=1$), set $\xi=0$ and add no more noise.

### Working one training step and one sampling step

The following is an example made up for this article, not from the lecture. The data is one-dimensional, with $\beta_1=0.1$ and $\beta_2=0.2$, and we look at the step $t=2$.

**Schedule quantities first.** $\alpha_1=0.9$, $\alpha_2=0.8$, $\bar\alpha_1=0.9$, $\bar\alpha_2=0.72$, and $\tilde\beta_2=\frac{1-0.9}{1-0.72}\times0.2=0.0714$.

**Build $x_2$.** Take $x_0=1$ and suppose the sampled noise is $\hat\epsilon=0.5$:

$$
x_2=\sqrt{0.72}\times1+\sqrt{0.28}\times0.5=0.8485+0.2646=1.1131 .
$$

**Compute the posterior mean two ways.** In the form with $x_0$: the coefficient of $x_0$ is $\frac{\sqrt{0.9}\times0.2}{0.28}=0.6776$ and the coefficient of $x_2$ is $\frac{\sqrt{0.8}\times0.1}{0.28}=0.3194$, so $\tilde\mu_2=0.6776\times1+0.3194\times1.1131=1.0332$. In the form with noise: $\frac{\beta_2}{\sqrt{1-\bar\alpha_2}}=\frac{0.2}{0.5292}=0.3780$, and $\tilde\mu_2=\frac{1}{\sqrt{0.8}}(1.1131-0.3780\times0.5)=1.1180\times0.9241=1.0332$. Both routes give the same number, so the substitution in the previous section was done correctly.

**Compute the loss.** Suppose the network currently outputs $\epsilon_\theta(x_2,2)=0.3$ (the truth is $0.5$). The noise-prediction loss is $(0.5-0.3)^2=0.04$. In terms of means, $\mu_\theta=1.1180\times(1.1131-0.3780\times0.3)=1.1177$, $\tilde\mu_2-\mu_\theta=-0.0845$, and the square is $0.00714$. The ratio of the two, $0.00714/0.04=0.1786$, is exactly $\frac{\beta_2^2}{\alpha_2(1-\bar\alpha_2)}=\frac{0.04}{0.8\times0.28}$. The fully weighted ELBO term is $\frac{0.00714}{2\times0.0714}=0.05$, which equals $1.25\times0.04$.

**Take one sampling step.** If this were a step during generation and we drew $\xi=-1$, then $x_1=1.1177+\sqrt{0.0714}\times(-1)=1.1177-0.2673=0.8505$.

These numbers show three things. Comparing means and comparing noise measure the same error, up to a multiple set by the schedule (here $0.1786$). Dropping the coefficients amounts to changing every time step's multiple to $1$. For a single $t$ on its own, the loss is multiplied by a positive constant, the minimum sits at the same $\epsilon_\theta$, and the optimum does not change; what changes is the relative weight across time steps, and when one network has to serve every $t$ and cannot reach the optimum at each one, the weights decide which time steps it leaves the error on. Finally, guessing the noise $0.2$ too low makes the model's mean $0.0845$ too high. The directions are opposite because the noise enters the formula with a minus sign.

### Why diffusion models are easy to learn, and one student question (recording 32:04–36:40)

The lecturer first says there is no strong theory that proves everything; what follows is intuition. First, one direction is a fixed noising function, so you do not have to parameterize both the forward and the reverse process; people have tried using learnable functions on both sides, and the optimization was harder. Second, the price is a very long time axis (the original approach used $T$ of 1,000), but once it is stretched out, each step's reconstruction becomes locally simple: starting from pure white noise, outlines and rough shapes come first, then sharpening and detail step by step. A neural network can in principle represent anything, but how it represents it and how it learns it still matter, and diffusion models split one big generation task into many small steps that are easy to learn.

A student asks how the parameters actually get updated, and the lecturer's answer works as a way to read the second half of this course: once the loss function is defined, everything else can be computed. Write the network and the loss in PyTorch, compute the gradient, take a step. New applications or algorithms mostly innovate at the level of the loss; you can also innovate at the optimizer level, and a new optimizer then works for diffusion models, language models, and linear regression alike. The coming lectures are mainly about data, architecture, loss functions, and training procedures, and no longer about how to compute gradients.

## Second half: the foundation-model paradigm and adaptation methods

### Pretraining plus adaptation (recording 36:40–46:51)

The lecturer starts with where the term "foundation model" came from. After GPT-3 came out in the summer of 2020, Stanford professors gathered in a room to play with the OpenAI playground. There was no ChatGPT then, only a text box where what you wrote and what the model generated appeared in the same field; you could adjust hyperparameters such as temperature, and a dropdown on the right let you choose the model. Later Percy Liang led a group studying this new paradigm, wrote a survey, and coined the name. The lecturer says he looked it up the day before: the survey's abstract calls it an emergent paradigm, and his own lecture notes say the same:

> "But I think after three years, we probably should just not call it emergent paradigm. It's the new paradigm." (38:26)

He also warns that five years ago this paradigm covered a broader set of techniques, some of which are now outdated; the next lecture or two will cover what was popular from 2019 to 2022, then the mainstream after 2022.

The paradigm has two stages.

**Pretraining.** Use a huge amount of unlabeled data, several orders of magnitude more than before, and very messy: scrape whatever can be scraped from the web, HTML files with their tags, Word files, documents in other formats. The training data of the early versions was quite messy and was only cleaned up gradually later. As a formula it is plain: $\theta$ is the parameters, each data point has a loss, and you take the average:

$$
L_{\text{pre}}(\theta)=\frac{1}{n}\sum_{i=1}^{n}\ell_{\text{pre}}\big(x^{(i)},\theta\big).
$$

There are only two differences from supervised learning: no labels, and $n$ is very large. What $\ell_{\text{pre}}$ actually is comes in later lectures. The parameters the optimization produces are written $\hat\theta$.

**Adaptation.** Start from a good foundation and adapt to all kinds of downstream tasks. The old approach was one model per task, and people doing multi-task learning trained at most three at once. Now the number of tasks has almost no upper limit; the lecturer says the GPT paper evaluated around a hundred tasks, and eventually the very notion of a "task" became hard to define.

Adaptation depends on two things: how much downstream data you have and of what kind, and which technique you use. On the data side, the downstream dataset is $n_{\text{task}}$ pairs $(x_{\text{task}}^{(i)},y_{\text{task}}^{(i)})$:

- When $n_{\text{task}}$ is small, around 5 to 10 examples, it is called **few-shot**.
- When $n_{\text{task}}=0$ and you ask the model to solve the task from a text description alone, it is called **zero-shot**.

The lecturer says one of GPT-3's breakthroughs was that sometimes even few-shot was unnecessary, and today almost nobody collects downstream labels in order to adapt a model. But from 2019 to 2022, labeled downstream datasets were still the norm, for example collecting a small sentiment classification dataset and then adapting the model. On the technique side, this lecture and the next cover adaptation methods that update parameters; methods that rely only on prompts and leave the parameters alone come later.

### Representations and the linear probe (recording 46:51–54:50)

To talk about adaptation with labeled data, you first need the concept of representation learning. It is one kind of pretraining: what gets trained is not a chat model but a model that turns data into a vector

$$
\phi_\theta:\ x\ \mapsto\ \phi_\theta(x)\in\mathbb R^m .
$$

This vector is called a representation, also a feature or an embedding. Training yields $\hat\theta$ and therefore a fixed function $\phi_{\hat\theta}$; put any data in and a vector comes out. The loss used to train it is the subject of the next lecture.

A **linear probe** adds a linear head on top of this fixed representation: an $m$-dimensional vector $w$, with the prediction being the inner product $w^\top\phi_{\hat\theta}(x)$, followed by a softmax for classification. Taking regression as the example:

$$
\min_{w\in\mathbb R^m}\ \frac{1}{n_{\text{task}}}\sum_{i=1}^{n_{\text{task}}}\Big(y_{\text{task}}^{(i)}-w^\top\phi_{\hat\theta}\big(x_{\text{task}}^{(i)}\big)\Big)^2 .
$$

$\hat\theta$ is fixed, so each data point's $\phi_{\hat\theta}(x)$ is a fixed vector and the only variable is $w$. This is the same problem as the linear regression from the very start of the course, except that the input features have changed from the raw $x$ to the representation. It works far better than hand-designed features or a linear model on the raw $x$, because $y$ is usually not a linear function of $x$, while the representation turns the semantically important information into a form that can be read off linearly.

The lecturer mentions in passing that the linear probe is still a tool in mechanistic interpretability research on language models: even if you do not use it to solve a task, you can use it to probe what the model represents internally.

There are two student questions in this part.

One asks whether foundation models are built per domain or are general. The lecturer says that three or four years ago vision and language each had their own way of learning representations; now people want multimodal capability, with one model taking in images, text, and even video, so the methods have to be unified, and in 2026 many models are called omni or multimodal models. The representation-learning-plus-linear-classifier recipe from this lecture is more common in vision and is still used in medical imaging: extract the representation first, then for each kind of imaging task train a small linear head on a small dataset.

The other is sharper: on what grounds do we assume the downstream task is linear in the representation? The lecturer says this is not really an assumption. The pretraining loss itself pushes the representation toward being linearly usable, and it will be clear once you see the concrete loss in the next lecture.

### Finetune, initialization, and LP-FT (recording 54:50–1:02:20)

**Finetune** differs from the linear probe in exactly one place: $\theta$ also becomes a variable.

$$
\min_{w,\theta}\ \frac{1}{n_{\text{task}}}\sum_{i=1}^{n_{\text{task}}}\ell_{\text{task}}\Big(y_{\text{task}}^{(i)},\ w^\top\phi_{\theta}\big(x_{\text{task}}^{(i)}\big)\Big),\qquad \theta\leftarrow\hat\theta,\quad w\leftarrow\text{random}.
$$

Here the lecturer points out something worth thinking about. This loss function carries no trace of pretraining at all. You could use the identical loss and start from a random $w$ and a random $\theta$, and that would be training a giant model from scratch. The only place pretraining enters the problem is the starting point of $\theta$, and the result is much better.

> "because it's the same loss function. Just initialization are different." (56:19)

His inference: this loss has a great many global minima, possibly millions, and they are not the same as each other. With little downstream data, the training loss can almost always be driven to zero, so "good or bad" refers to test performance. Starting from a random point lands on some solution with zero training loss but poor test performance; starting from the pretrained $\hat\theta$ lands on another solution with the same zero training loss but much better test performance.

A student follows up on what exactly pretraining produces. The answer is $\hat\theta$, a concrete set of numbers under a given architecture. The architecture has to be fixed first, and pretraining and adaptation must use the same one, otherwise there is no way to interpret those numbers.

**LP-FT** is linear probe first, then finetune. Write the loss as $L(w,\theta)$:

1. LP: fix $\theta=\hat\theta$ and minimize over $w$ only, giving $w_0$.
2. FT: start from $(w_0,\hat\theta)$ and minimize over both $w$ and $\theta$.

The lecturer says that if you go down this road, LP-FT is probably the main approach today. As for why it is better:

> "I think we don't know exactly either." (1:01:27)

He says there is some theory on this, and gives his own rough explanation: with direct finetuning, $w$ is random and $\theta$ is pretrained, and a random $w$ sometimes damages the representation a little. Fix $\hat\theta$ first so that $w$ fits the representation, then train both together; the representation still changes, but by less than it would with a random head.

### LoRA: change only along low-rank directions (recording 1:02:20–1:07:36)

LoRA (low-rank adaptation) does not depend on which loss you use for adaptation; as long as you are minimizing some loss and not doing zero-shot, it applies.

The motivation goes like this: finetuning changes every parameter in $\theta$, and a pretrained model has billions of parameters while the downstream data is tiny. The word "adaptation" itself implies you should not need to change much. Changing everything invites overfitting and is overkill. So what about changing only some of the parameters? The difficulty is that you do not know which ones to pick. LoRA's answer is to let every parameter move but restrict the degrees of freedom of the change.

For a weight matrix, reparameterize the model as

$$
W = W_0 + AB,\qquad A\in\mathbb R^{d\times r},\quad B\in\mathbb R^{r\times d},
$$

where $W_0$ is the pretrained matrix, kept fixed, and only $A$ and $B$ are trained. Ordinary finetuning minimizes $L(W)$ starting from $W_0$; LoRA minimizes $L(W_0+AB)$, with $A$ and $B$ as the variables.

**Degrees of freedom.** A $d\times d$ matrix has $d^2$ degrees of freedom, while $A$ and $B$ together have $2dr$. The lecture's numbers are $d=1000$ and $r=10$: $d^2=1{,}000{,}000$ and $2dr=20{,}000$, only 2% of the original.

**Initialization.** Set $A=0$ and $B$ random. Then $AB=0$, the starting $W_0+AB$ is just $W_0$, and before the first step the model behaves exactly like the pretrained model.

A tiny example confirms the mechanism (made up for this article). Take $d=2$ and $r=1$,

$$
W_0=\begin{pmatrix}1&2\\3&4\end{pmatrix},\quad A=\begin{pmatrix}0\\0\end{pmatrix},\quad B=\begin{pmatrix}1&-1\end{pmatrix},\quad x=\begin{pmatrix}1\\0\end{pmatrix}.
$$

Initially $AB$ is the zero matrix and the output is $W_0x=(1,3)^\top$. Suppose that after a few training steps $A=(0.1,0.2)^\top$; then $AB=\begin{pmatrix}0.1&-0.1\\0.2&-0.2\end{pmatrix}$ and the output becomes $(1.1,3.2)^\top$. The two rows of the update $AB$ are proportional, so its rank is 1, but $W_0+AB$ itself is still full rank. What is low-rank is the change; the adapted matrix is not low-rank, a point the notes stress on p.195. Also, in this example $2dr=4$ equals $d^2=4$, so not a single parameter is saved; $r$ has to be smaller than $d/2$ before any saving starts.

A student asks why not just add a $d\times d$ matrix. Because that brings you back to $d^2$ degrees of freedom. Another asks whether a product like $AB$ introduces some kind of symmetric bias. The lecturer says $A$ and $B$ are not equal, so there is no extra symmetry and the only restriction is low rank; and low rank is itself a bias.

The lecture's notation differs from the notes in three places, which matters when you look things up. The notes write the update as $\Delta W=BA$ with $B\in\mathbb R^{d_{\text{out}}\times r}$ and $A\in\mathbb R^{r\times d_{\text{in}}}$, so the two letters swap roles relative to the lecture. The factor initialized to zero is actually the same one on both sides, the left factor of the product with shape $d\times r$; the lecture calls it $A$ and the notes call it $B$ (the example in the notes is $B=0$). The body of this article uses the lecture's $W_0+AB$ throughout. The notes allow a non-square $W_0\in\mathbb R^{d_{\text{out}}\times d_{\text{in}}}$, with $r(d_{\text{out}}+d_{\text{in}})$ trainable parameters. The notes also have a scaling coefficient, $h=W_0x+\frac{\alpha}{r}BAx$, which the lecture does not mention.

Here are this lecture's four adaptation methods side by side (compiled for this article; $W_0$ means a weight matrix inside $\hat\theta$ that LoRA rewrites):

| Method | Which parameters are trained | Starting point | Do the pretrained weights change? |
|---|---|---|---|
| Linear probe | Only $w$ | $w$ random | No, fixed at $\hat\theta$ |
| Finetune | $w$ and $\theta$ | $w$ random, $\theta=\hat\theta$ | All of them change |
| LP-FT | First only $w$, then $w$ and $\theta$ | The second stage starts from $(w_0,\hat\theta)$ | They change in the second stage, usually by less |
| LoRA | Only $A$ and $B$ for each rewritten matrix | $A=0$, $B$ random | $W_0$ does not change; what is actually used is $W_0+AB$ |

The first three differ in which parameters are variables and where they start. LoRA is a choice along a different axis: it prescribes what the change in the weights looks like, and it can be combined with any of the approaches above that update $\theta$.

### What LoRA saves (recording 1:07:36–1:15:45)

The last eight minutes are the most useful part of the second half. The lecturer does not hand out the answer; he checks one item at a time.

**Compute: almost nothing saved.** A student first answers "fewer parameters," and the lecturer says yes, but fewer parameters does not mean faster. In the forward pass every layer still computes $(W_0+AB)x$; the $W_0x$ part cannot be skipped and it is the bottleneck, while $ABx$ is cheap. Backpropagation has to pass gradients backward and still multiplies by $W_0^\top$. There are two kinds of derivatives in backpropagation: with respect to activations and with respect to weights. The activation path saves nothing; the weight path saves a little because there are fewer trainable parameters.

> "So largely speaking, your compute don't really change much." (1:08:37)

**Memory: some savings, but not night and day.** $W_0$ still has to sit in memory. During training, memory holds not only the parameters but also the gradients and the optimizer state (one student mentions that Adam tracks momentum). These are stored only for trainable parameters, so LoRA only needs them for $A$ and $B$, and that is the saving. The lecturer says offhand that gradients plus optimizer state cost "12 times or 6 times" as much as the parameters themselves, and admits he does not remember exactly; do not cite this multiple as fact. He then adds a systems observation, saying he does not expect everyone to follow it: in large-scale multi-GPU training, gradients and momentum can be sharded across GPUs, so they are not necessarily the memory bottleneck to begin with. The notes put it this way: neither the base weights $W_0$ nor the activations that backpropagation has to keep get any smaller under a low-rank parameterization, and when these two dominate memory, LoRA's training-time memory saving is limited. Taken together, there is a memory saving, but in the lecturer's words it is not a night-and-day difference.

**The two situations where it really matters.** The first is when memory is right at the edge: saving 10% takes you from two GPUs to one. In that case any saving matters a lot, but it only happens when you have very few GPUs. The second is what the lecturer considers the main benefit, many users sharing the same $W_0$:

> "So in my opinion, that's probably the major benefit of LORA, which you can serve many, many users." (1:15:45)

Each user has their own $(A_1,B_1),(A_2,B_2),\dots,(A_k,B_k)$, and only one copy of $W_0$ is stored. At inference time, whoever's request comes in gets their low-rank matrices swapped in. The adapters of a large share of users can be preloaded into GPU memory, so switching is fast; those not preloaded are loaded from CPU, and small matrices still load much faster than full ones. He cites the finetuning services of commercial models as an example (naming GPT and Gemini), says what these services give users is LoRA-style finetuning, and believes this is the reason. This is the lecturer's statement and conjecture in class; how each provider does it internally is not necessarily public, so do not cite it as confirmed fact.

The numbers he gives out loud are about 100 million parameters per user, 1,000 users, and a total of "about 10 billion." Multiplying it out gives $10^8\times10^3=10^{11}$, which is 100 billion, so the spoken numbers do not add up. The conclusion is unaffected: the comparison is against storing a full set of weights per user, and one set of low-rank matrices per user is far smaller.

The notes on p.195 have two more points the lecture does not get to: the same sharing idea also applies to multi-tenant training (several training jobs sharing the base weights); and LoRA is a trade-off in expressivity, so when the downstream distribution is far from pretraining or needs large changes, full-parameter training may still be better.

## Self-check

1. **Take $\beta_1=0.1$, $\beta_2=0.2$, $x_0=1$, $\hat\epsilon=0.5$, and change the network output to $\epsilon_\theta=0.9$. What are the noise-prediction loss, $\mu_\theta$, and the weighted $L_1$?**
   Answer: The loss is $(0.5-0.9)^2=0.16$. $\mu_\theta=1.1180\times(1.1131-0.3780\times0.9)=0.8642$, which is $0.1690$ below $\tilde\mu_2=1.0332$; guess the noise too high and the mean comes out too low. The weighted term is $1.25\times0.16=0.2$. Check: your $(\tilde\mu_2-\mu_\theta)^2$ divided by $0.16$ should be $0.1786$.

2. **Why define $\tilde\mu_1(x_1,x_0):=x_0$? Is this definition consistent with the formula for $t\ge2$?**
   Answer: So that the last-step reconstruction term $\lVert x_0-\mu_\theta(x_1,1)\rVert^2$ has the same shape as the other terms. The consistency check is to plug $t=1$ into $\frac{1}{\sqrt{\alpha_t}}(x_t-\frac{\beta_t}{\sqrt{1-\bar\alpha_t}}\hat\epsilon_t)$ and use $1-\bar\alpha_1=\beta_1$ to get $\frac{1}{\sqrt{\alpha_1}}(x_1-\sqrt{\beta_1}\hat\epsilon_1)$, which is exactly the $x_0$ you get by solving $x_1=\sqrt{\alpha_1}x_0+\sqrt{\beta_1}\hat\epsilon_1$.

3. **During training, why can $\hat\epsilon_t$ be written as $\epsilon$ with no subscript, when the $\hat\epsilon_t$ for different $t$ are correlated?**
   Answer: Each update samples only one time step, the loss uses only that one $\hat\epsilon_t$, and all it needs is for its marginal distribution to be $\mathcal N(0,I)$. Correlation across time steps does not appear in a single step's loss.

4. **Pretraining is nowhere to be seen in the finetuning loss function. How does pretraining have any effect?**
   Answer: Only through the initial value of $\theta$. With little downstream data, the loss has many minima with zero training error, and they differ in test performance; the starting point decides which one the optimization lands on. You have only answered correctly if you can say "the training losses are all near zero; the difference is in test performance."

5. **One layer is a $4096\times4096$ matrix and LoRA uses $r=8$. What fraction of full finetuning's parameters are trainable? Roughly how much forward-pass compute is saved?**
   Answer: $2dr=65{,}536$ and $d^2=16{,}777{,}216$, about $0.39\%$, which is $1/256$. Forward compute is barely reduced, because $W_0x$ still has to be computed, plus a little extra for $ABx$. Answering "compute also drops to 1/256" confuses the number of trainable parameters with the amount of compute.

## Corresponding reading

The main notes, [main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf) (August 2026 edition):

- **Section 14.3, Training diffusion models by maximizing the ELBO** (pp.184–188): the ELBO decomposition (14.15)–(14.17), the posterior mean (14.18)–(14.19), the rewrite in terms of noise (14.22)–(14.24), the $L_0$ term (14.25)–(14.26), and the training and sampling algorithms (14.27)–(14.29). The conditional Gaussian formula is Lemma A.1.2 in the appendix.
- **Section 14.4, Continuous-time view of reverse diffusion** (pp.188–190): uses stochastic differential equations and the score to explain why the reverse process is Gaussian. The lecture does not cover this section at all.
- **Chapter 15, Foundation models overview** (pp.191–195): Section 15.1 covers linear probe, finetune, and LP-FT; Section 15.2 covers LoRA.

Where the lecture and the notes differ:

- For the terminal term, the lecture says it is zero as $T\to\infty$; the notes additionally point out that it does not contain $\theta$, so it can be removed from the objective outright.
- At the last sampling step, the notes set $\xi=0$; the lecture does not mention it.
- On why LP-FT works, the lecture says it is not fully understood; the notes cite Kumar et al. (2022), saying the method is meant to reduce the feature distortion caused by finetuning and can improve out-of-distribution performance in some settings.
- Section 15.1 of the notes mentions continued pretraining (keep training on new data with the pretraining loss); the lecture does not cover it.
- LoRA's notation, the scaling coefficient $\alpha/r$, and the expressivity trade-off, as listed in the previous section.

**Series navigation**: Previous: [Lecture 11: diffusion models](/posts/ai/2026-10-12-stanford-cs229-lecture-11-diffusion-models-en) | Next: [Lecture 13: contrastive learning and semantic search](/posts/ai/2026-10-12-stanford-cs229-lecture-13-representation-learning-semantic-search-en)

## Course video sources

Original video: [Stanford CS229 Machine Learning | Spring 2026 | Lecture 12: Representation Learning](https://www.youtube.com/watch?v=_kREM2UAiJ8)

- [Stanford CS229 Machine Learning | Spring 2026 playlist (Stanford Online, 17 videos)](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [CS229 course website](https://cs229.stanford.edu/)
- [CS229 main notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)

Checked: 2026-10-12.

Content check: verified against the video transcript (2026-10-12): the whole article was compared section by section with the English captions of this recording, and the time ranges come from the caption timestamps. I did not see the board; formulas are reconstructed from Chapters 14 and 15 of the main notes, and places where the captions clearly misheard (for example "linear head" transcribed as "linear hat") have been corrected to follow the notes.

## References

- [Stanford CS229 Machine Learning | Spring 2026 | Lecture 12: Representation Learning (YouTube)](https://www.youtube.com/watch?v=_kREM2UAiJ8): the basis of this article; the lecture's statements and quotes all come from the English captions of this recording.
- [CS229 main notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf): Section 14.3 (pp.184–188) was used to reconstruct the board formulas and equation numbers, and Chapter 15 (pp.191–195) to compare how linear probe, finetune, LP-FT, and LoRA are written.
- [Stanford CS229 Machine Learning | Spring 2026 playlist](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw): to confirm the lecture number and video title.
- [CS229 course website](https://cs229.stanford.edu/): the course entry point.
- [Stanford CS229 Course Overview](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en): the overview and reading route for this series.
