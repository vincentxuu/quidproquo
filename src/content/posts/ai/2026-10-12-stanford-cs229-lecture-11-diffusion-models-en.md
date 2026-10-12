---
title: "Diffusion Models: How Do You Learn to Run the Noising Process Backward? | Stanford CS229 Lecture 11"
date: 2026-10-12
category: ai
type: guide
tags: [cs229, ai-course, stanford, machine-learning, diffusion-model, elbo, generative-models]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 11
tldr: "Each forward step multiplies the data by √(1−β_t) and adds Gaussian noise with variance β_t. Unrolled, x_t = √ᾱ_t·x_0 + √(1−ᾱ_t)·ε̂_t, and nothing here is learned. The reverse direction is learned with a Gaussian p_θ(x_{t−1}|x_t): apply last lecture's ELBO to the whole trajectory, split it with the KL chain rule, and the loss at each step is ‖μ̃_t(x_t,x_0) − μ_θ(x_t,t)‖²/(2β̃_t). The lecture stops at this expression; simplifying it into noise prediction is left for Lecture 12."
description: "A guide to Lecture 11 of Stanford CS229 Spring 2026: the forward noising process of diffusion models, the closed-form jump formula, the Gaussian parameterization of the reverse process, the continuous-time view, and the full derivation of the per-step denoising loss from the ELBO and the KL chain rule, with worked numerical examples."
draft: false
math: true
---

> 🌏 [中文版](/posts/ai/2026-10-12-stanford-cs229-lecture-11-diffusion-models)

**Video status: Videos included.** This article is written from the English transcript of the Spring 2026 Lecture 11 recording published by Stanford Online, with notation matched to Chapter 14 of the 2026 main lecture notes. I did not see the blackboard; the equations on the board are reconstructed from the surrounding transcript and the notes. Times given here are the start of a transcript segment and may be off from the actual picture by a few tens of seconds.

This is Lecture 11 in the [Reading Stanford CS229](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en) series, taught by Tengyu Ma. He opens by saying he reordered the course and moved diffusion models earlier, because the tools they use are close to the EM algorithm Chris Ré covered the week before. That is why the [previous lecture](/posts/ai/2026-10-12-stanford-cs229-lecture-10-em-pca-en) had only just finished EM and PCA, and this one jumps straight into generative models.

Coming from PCA, what you actually need to bring along is the EM material from the first half of the previous lecture, and only three pieces of it:

- **Latent variables and the ELBO**: when there is an unobserved variable $z$, $\log p(x;\theta)$ cannot be maximized directly, so you maximize its lower bound $\mathbb E_{z\sim Q}[\log p(x\mid z;\theta)]-\mathrm{KL}(Q\,\Vert\,p_z)$ instead.
- **The definition of KL divergence**: $\mathrm{KL}(Q\,\Vert\,P)=\mathbb E_{Q}[\log (Q/P)]$.
- **Two properties of Gaussians**: a linear combination of independent Gaussians is Gaussian, and conditioning a joint Gaussian gives a Gaussian.

PCA itself is not used in this lecture. After reading this article, you should be able to write down the closed-form jump formula for the forward process yourself, explain why the reverse process is parameterized as a Gaussian, and derive the per-step denoising loss all the way from the ELBO.

```youtube
url: https://www.youtube.com/watch?v=dqUMCzWjZSI
title: Stanford CS229 Machine Learning | Spring 2026 | Lecture 11: Diffusion Models
captions: en
```

## The problem this lecture solves: sampling from the data distribution

(Recording 00:00–05:50)

The task is abstract and simple. There is a data distribution $p_{\text{data}}$ (think of the distribution of "all natural images"), and all you have are samples drawn from it. You want to train a model that can draw new samples on its own that look like they came from the same distribution. In notation, clean data is always written $x_0\sim p_{\text{data}}$, $x_0\in\mathbb R^d$.

The lecturer first places the method. Image generation used to rely on GANs and variational autoencoders (VAEs); diffusion models are now the mainstream, and the course changed accordingly:

> "And now diffusion model is the predominant approach, I think, is much better than both GANs and variational autoencoders. And that's why we don't teach GANs and variational autoencoders anymore." (around 01:06)

He adds that the lecture notes still keep the VAE chapter for anyone who wants to read it. The applications go beyond images: video, robotics (he says most vision-language-action models use diffusion models to produce actions), and for language he mentions that Stefano Ermon has several papers and a startup working on it, the selling point being that diffusion models can generate in parallel, so inference may be faster than with autoregressive models. This is background, and he says outright that you don't need to follow every detail.

Generation works by walking a Markov chain backward. Draw a pure-noise $x_T$ (think of every pixel's RGB values as random numbers), apply the model once to get $x_{T-1}$, apply it again to get $x_{T-2}$, and continue down to $x_0$:

$$
x_T \;\xrightarrow{\;p_\theta(x_{T-1}\mid x_T)\;}\; x_{T-1} \;\xrightarrow{\;p_\theta(x_{T-2}\mid x_{T-1})\;}\; \cdots \;\xrightarrow{\;p_\theta(x_0\mid x_1)\;}\; x_0
$$

The intermediate images start as noise, then show a blurry outline, and end as a clear picture. $\theta$ is the neural network's parameters, the thing to learn. Only one question is left: how do you train this $p_\theta$?

Diffusion models answer in two steps. First design a process $q$ that gradually corrupts a clean image (the forward process), then learn its reverse.

## The forward process: shrink a little, add a little noise

(Recording 05:50–13:36; the blackboard correction is at 18:44–20:48)

The forward process does one thing: add Gaussian noise. Step $t$ is

$$
x_t=\sqrt{1-\beta_t}\,x_{t-1}+\sqrt{\beta_t}\,\epsilon_t,\qquad \epsilon_t\sim\mathcal N(0,I)\ \text{mutually independent}
$$

$\beta_t$ is a scalar between 0 and 1, usually very small; the lecturer's order of magnitude is $10^{-2}$ to $10^{-4}$. So each step shrinks the previous image slightly and mixes in a tiny bit of noise, and the image only gets a little blurrier. How to choose $\beta_t$ at each step (the noise schedule) is not covered in this lecture; the lecturer says there are many ways to do it.

**Watch out when viewing the video**: the lecturer first writes $(1-\beta_t)\,x_{t-1}$ on the board, without the square root. At 18:44 a student points out that the coefficients don't match, and at 19:47 he corrects it to "everything needs a square root." So before 19:47, the "one minus beta", "alpha t", and "alpha t bar" read out as coefficients in the transcript are mostly missing a square root and are really $\sqrt{1-\beta_t}$, $\sqrt{\alpha_t}$, $\sqrt{\bar\alpha_t}$; the definition $\alpha_t=1-\beta_t$ itself has no square root. This article uses the corrected version throughout, which is how equation (14.3) in the lecture notes is written.

### Why the coefficients are exactly √(1−βₜ) and √βₜ

The answer is in the covariance. $x_{t-1}$ and the newly added $\epsilon_t$ are independent, and covariances of independent random vectors add; a constant multiplied in comes out squared. So

$$
\mathrm{Cov}(x_t)=\left(\sqrt{1-\beta_t}\right)^2\mathrm{Cov}(x_{t-1})+\left(\sqrt{\beta_t}\right)^2\mathrm{Cov}(\epsilon_t)=(1-\beta_t)\,\mathrm{Cov}(x_{t-1})+\beta_t\,I
$$

The two coefficients sum to 1, so $\mathrm{Cov}(x_t)$ is a linear interpolation between "the previous step's covariance" and "the identity matrix $I$." Two consequences follow:

1. If the data is normalized from the start so that $\mathrm{Cov}(x_0)=I$, plugging in $I$ gives back $I$, and the covariance stays the same at every step. The forward process only mixes noise in; the overall scale does not move.
2. If $\mathrm{Cov}(x_0)\neq I$ (image pixels are correlated, so in practice this is the usual case), the covariance moves step by step toward $I$ along the line segment joining $\mathrm{Cov}(x_0)$ and $I$, and finally converges to $I$. It neither blows up nor shrinks to nothing along the way.

The square roots are there to make "the squared coefficients sum to 1." That is also why square roots are everywhere in the formulas. The lecturer explains that this field treats $\beta_t$ as a variance and $\sqrt{\beta_t}$ as a standard deviation; mathematicians would mostly do the opposite, writing the standard deviation as $\beta_t$ and the variance as $\beta_t^2$. He says he found only one paper that doesn't use this notation, and that one survey tried to change it but nobody else followed (around 20:48).

**A small example (made up for this article, not from the lecture).** One-dimensional data, starting variance 4, and $\beta$ for three steps set to $0.1,\,0.2,\,0.3$ (deliberately large, so the numbers visibly change):

- Step 1: $0.9\times 4+0.1=3.7$
- Step 2: $0.8\times 3.7+0.2=3.16$
- Step 3: $0.7\times 3.16+0.3=2.512$

The variance moves from 4 toward 1, and at every step it lands between the previous value and 1.

## The closed-form jump formula

(Recording 13:36–28:00)

Adding noise one step at a time is too slow. In training we want to jump directly from $x_0$ to any $x_t$. First define two symbols:

$$
\alpha_t=1-\beta_t,\qquad \bar\alpha_t=\alpha_t\,\alpha_{t-1}\cdots\alpha_1
$$

$\alpha_t$ is close to 1; $\bar\alpha_t$ is the running product up to step $t$. Now unroll the recursion, each time replacing $x_{t-1}$ with its own definition:

$$
\begin{aligned}
x_t&=\sqrt{\alpha_t}\,x_{t-1}+\sqrt{1-\alpha_t}\,\epsilon_t\\
&=\sqrt{\alpha_t\alpha_{t-1}}\,x_{t-2}+\sqrt{\alpha_t(1-\alpha_{t-1})}\,\epsilon_{t-1}+\sqrt{1-\alpha_t}\,\epsilon_t\\
&=\cdots\\
&=\sqrt{\bar\alpha_t}\,x_0+\sum_{s=1}^{t}\sqrt{(1-\alpha_s)\prod_{r=s+1}^{t}\alpha_r}\;\epsilon_s
\end{aligned}
$$

However many times you unroll, the shape is the same: one term is "some constant times $x$," with the subscript of $x$ dropping all the way to 0; the rest is a linear combination of $\epsilon$'s. The second term looks intimidating, but it is only a linear combination of independent standard Gaussians, so the whole thing is still a zero-mean Gaussian and can be written as "some scalar $\kappa$ times a standard Gaussian." The only question left is what $\kappa$ is.

The lecturer gives an argument that avoids the brute-force computation (around 26:05). Suppose $\mathrm{Cov}(x_0)=I$; the previous section showed that then $\mathrm{Cov}(x_t)=I$. Take the covariance of both sides of $x_t=\sqrt{\bar\alpha_t}\,x_0+\kappa\,\hat\epsilon_t$:

$$
I=\bar\alpha_t\,I+\kappa^2 I\quad\Longrightarrow\quad \kappa^2=1-\bar\alpha_t
$$

And $\kappa$ is determined by the $\beta$'s alone and has nothing to do with what the data looks like, so this answer holds for any $x_0$ (this last sentence is an addition in this article; the lecture only did the $\mathrm{Cov}(x_0)=I$ case).

He also mentions that you can compute it directly, by telescoping. He did not write this out in class; what follows is an addition in this article. The variance of the second term is the sum of the squared coefficients:

$$
\sum_{s=1}^{t}(1-\alpha_s)\prod_{r=s+1}^{t}\alpha_r=\sum_{s=1}^{t}\left(\prod_{r=s+1}^{t}\alpha_r-\prod_{r=s}^{t}\alpha_r\right)=1-\prod_{r=1}^{t}\alpha_r=1-\bar\alpha_t
$$

The middle step multiplies out $(1-\alpha_s)$; adjacent terms cancel, one positive and one negative, leaving only the two ends. At $s=t$ the empty product equals 1.

The conclusion is the most-used equation of the whole lecture, equation (14.5) in the notes:

$$
x_t=\sqrt{\bar\alpha_t}\,x_0+\sqrt{1-\bar\alpha_t}\;\hat\epsilon_t,\qquad \hat\epsilon_t\sim\mathcal N(0,I)
$$

Written as a conditional distribution, it is $q(x_t\mid x_0)=\mathcal N\!\left(x_t;\sqrt{\bar\alpha_t}\,x_0,\,(1-\bar\alpha_t)I\right)$.

### Numerical example: do step-by-step noising and the jump formula agree?

The following example is made up for this article, not from the lecture; the numbers were checked separately with a program. One dimension, $x_0=1.5$, $\beta_1=0.1$, $\beta_2=0.2$, and the noise drawn is $\epsilon_1=0.5$, $\epsilon_2=-1.0$.

**Step by step:**

$$
x_1=\sqrt{0.9}\times 1.5+\sqrt{0.1}\times 0.5=1.4230+0.1581=1.5811
$$

$$
x_2=\sqrt{0.8}\times 1.5811+\sqrt{0.2}\times(-1.0)=1.4142-0.4472=0.9670
$$

**In one jump:** $\bar\alpha_2=0.9\times 0.8=0.72$. The signal term is $\sqrt{0.72}\times 1.5=1.2728$. The noise term is $\sqrt{\alpha_2\beta_1}\,\epsilon_1+\sqrt{\beta_2}\,\epsilon_2=\sqrt{0.08}\times 0.5+\sqrt{0.2}\times(-1.0)=0.1414-0.4472=-0.3058$. Adding the two gives $1.2728-0.3058=0.9670$, the same as the step-by-step result.

**Check the variance of the noise term:** $0.08+0.2=0.28=1-0.72$, exactly $1-\bar\alpha_2$. So $\hat\epsilon_2=-0.3058/\sqrt{0.28}=-0.578$; it is the weighted sum of $\epsilon_1$ and $\epsilon_2$ after renormalization.

The example shows two things. First, the $\hat\epsilon_t$ in the jump formula is the single Gaussian that blends all the past $\epsilon$'s together, and it is a different object from the $\epsilon_t$ newly added at step $t$. Second, training never needs to store the whole trajectory: draw one $\hat\epsilon_t$ and you can build $x_t$ directly.

### The ε̂ₜ are not independent of each other

Most papers and tutorials write a single $\epsilon$ here. The lecturer deliberately writes $\hat\epsilon_t$, because different $t$ correspond to different random variables. A student asks whether they are i.i.d. (around 25:02), and the answer is no: the marginal distribution of each $\hat\epsilon_t$ is a standard Gaussian, but $\hat\epsilon_t$ and $\hat\epsilon_{t+1}$ share $\epsilon_1,\dots,\epsilon_t$ and are highly correlated. The lecturer says this does no harm, because every later use of $\hat\epsilon_t$ looks at a single $t$ and never needs the relationship between them.

### Go far enough and it becomes pure noise

$\bar\alpha_t$ is a product of numbers less than 1, and it approaches 0 when $t$ is large enough. Then $\sqrt{\bar\alpha_t}\,x_0$ vanishes and $\sqrt{1-\bar\alpha_t}$ approaches 1, so not only the marginal distribution of $x_T$ but even the conditional distribution given $x_0$, $q(x_T\mid x_0)$, approaches $\mathcal N(0,I)$: the endpoint has completely forgotten which image it started from. The lecturer cautions that these convergence statements are written loosely, and making them rigorous means checking regularity conditions. From here on $x_T$ is simply assumed to be a standard Gaussian.

The lecturer says $\bar\alpha_t$ approaches 0 "relatively quickly." How quickly depends on $\beta$, and you can work it out yourself (a calculation made up for this article; $\beta$ is held constant only to keep the arithmetic easy, and real schedules are not constant):

| Per-step $\beta$ | Steps $T$ | $\bar\alpha_T=(1-\beta)^T$ | Signal coefficient $\sqrt{\bar\alpha_T}$ |
|---|---|---|---|
| $10^{-2}$ | 100 | 0.366 | 0.605 |
| $10^{-2}$ | 500 | 0.0066 | 0.081 |
| $10^{-2}$ | 1000 | $4.3\times10^{-5}$ | 0.0066 |
| $10^{-4}$ | 1000 | 0.905 | 0.951 |

With $\beta=10^{-2}$ and 1000 steps, the original image keeps a weight of only about seven thousandths, and $x_T$ is almost pure noise. But with $\beta=10^{-4}$ and the same 1000 steps, the original image still keeps 95%, and the assumption "$x_T$ is a standard Gaussian" fails. So the size of $\beta$ and the number of steps $T$ have to be considered together.

## The reverse process: the true reverse is unknown, so learn it with a Gaussian

(Recording 28:00–35:50)

First, be clear about where the forward process stands. It is entirely our design, we choose the $\beta$'s, and there is nothing to learn:

> "There's no learning involved at all. This is what we design." (around 28:13)

The lecturer contrasts this with VAEs: in a VAE, the direction that turns data into latent variables is also a neural network to be learned, so both directions are learned; a diffusion model learns only one direction.

**The true reverse process.** The forward process defines a joint distribution $q$ over $x_0,\dots,x_T$, and under this joint distribution $q(x_{t-1}\mid x_t)$ is well defined. The reverse is also a Markov chain: the lecturer calls this a basic fact about Markov chains, that a chain that is Markov in one direction is still Markov when viewed backward. The intuition is that $x_{t+1},\dots,x_T$ are all made by adding noise to $x_t$, so once you know $x_t$ they reveal nothing more about $x_{t-1}$ (this intuition is an addition in this article; the lecture only said it is a basic fact).

If we knew $q(x_{t-1}\mid x_t)$, generation would be solved: start from $x_T\sim\mathcal N(0,I)$ and sample backward all the way. The trouble is that it cannot be computed, because it involves the entire data distribution $p_{\text{data}}$. It is the "reference answer" we want to recover.

**Parameterization.** Approximate it with a model $p_\theta$, also built as a Markov chain, with a Gaussian at each step:

$$
p_\theta(x_{t-1}\mid x_t)=\mathcal N\!\left(x_{t-1};\ \mu_\theta(x_t,t),\ \sigma_t^2 I\right)
$$

$\mu_\theta$ is a neural network that takes the noisy image $x_t$ and the step index $t$ and outputs a vector of the same dimension as the image, used as the Gaussian's mean. $\sigma_t^2$ is a variance chosen in advance and not learned (the lecturer says it can in fact be learned too, but not in this lecture; the notes cite Nichol and Dhariwal 2021). What it should be will emerge on its own at the end of the derivation.

A student asks a very natural question: if all we want in the end is noise, why not do it in one step, multiplying $x_0$ by 0 and adding noise? The lecturer's answer is that the reverse of that is harder to learn. The benefit of noising gradually is on the learning side: noising goes one small step at a time, so denoising can also be learned one small step at a time, and each step is a simpler problem. He says $T$ in the first paper was about 1000, or even a few thousand. Something between "one step" and "a thousand steps" is to add noise layer by layer with a five- or ten-layer network, which he says is the VAE idea; the difference is that the VAE's noising network is learned, while a diffusion model does it by brute force, adding only a tiny amount of fixed noise per step. His confidence in this explanation is:

> "There are actually many explanations for why this is working. That's one of the intuition I believe is indeed true." (around 35:24)

A little later (around 38:31, when the lecturer has already started on "why Gaussian"), another student's question is incomplete in the transcript; the gist is whether diffusion models are addressing the gap caused by "the covariance matrix can only be diagonal." The lecturer says no: the $\sigma_t^2I$ used here by diffusion models is diagonal as well. He thinks the real difference is stretching the time axis very long so that each step becomes easy to undo. He also mentions that people later managed reverse generation in four steps, but that works by first learning with many steps and then finding ways to speed it up, which is another story.

## Why the reverse is still Gaussian: Brownian motion and continuous time

(Recording 35:50–50:55)

Going forward adds Gaussian noise; why should going backward also be Gaussian? And going backward is "denoising," so why add variance at all? The lecturer takes a fifteen-minute detour to answer these two questions, and says in advance that not everyone is expected to follow this part.

**Why there is still randomness going backward.** Picture one-dimensional Brownian motion: each step adds a bit of noise and traces a jittery path. Given the point $x_t$, can you be sure where the previous point $x_{t-1}$ was? No. It may have come up from below or dropped down from above, and many different paths pass through the same $x_t$. So given $x_t$, $x_{t-1}$ is still a distribution.

**Why Gaussian.** The lecturer's account is that in continuous time, the small-step change of almost every stochastic process is Gaussian, because any "small step" can be cut into many more, even smaller steps, and enough tiny random perturbations added together become Gaussian. What he says in class is "by law of large number"; strictly speaking, it is the central limit theorem that makes the sum Gaussian (this sentence is an addition in this article). He also says this doesn't always hold and there are counterexamples, which is what makes stochastic processes interesting, but in the common, ordinary cases both forward and reverse are Gaussian.

**The continuous-time form.** Write the forward process as a stochastic differential equation:

$$
dX_t=f(X_t,t)\,dt+g(t)\,dW_t
$$

The left side can be thought of as the change over a very small step, $X_{t+dt}-X_t$. The first term on the right is the deterministic drift, corresponding to the action of shrinking $x_{t-1}$ in the discrete version; the second term is the random part, where $W_t$ is Brownian motion and $g(t)$ is the noise strength, corresponding to $\sqrt{\beta_t}$.

Reverse time by defining $Y_\tau=X_{T-\tau}$. The lecturer cites a theorem saying that $Y_\tau$ also satisfies an equation of the same form (this is how Theorem 14.4.1 in the notes writes it):

$$
dY_\tau=\left[-f(Y_\tau,T-\tau)+g(T-\tau)^2\,\nabla_x\log p_{T-\tau}(Y_\tau)\right]d\tau+g(T-\tau)\,d\bar W_\tau
$$

Here $p_t$ is the probability density of $X_t$ and $\bar W_\tau$ is Brownian motion viewed backward. Read the equation in two parts:

- **The random part** $g\,d\bar W_\tau$ is exactly the same as in the forward direction: it still adds Gaussian noise. This is the basis for setting $p_\theta(x_{t-1}\mid x_t)$ to a Gaussian in the discrete version.
- **The deterministic part** has an extra term $g^2\nabla_x\log p$. The lecturer explains it with the picture from a moment ago: if $x_t$ sits somewhere very high that few paths reach, it more likely came up from below (where the density is higher), so going backward it should drift downward on average; if $x_t$ is in the middle, up and down are symmetric. $\nabla_x\log p$ points exactly in the direction of increasing density. The notes call this the score term; the lecture did not use that word.

For the source of the theorem, the lecturer says "Anderson 1985" aloud, and adds that it is not necessarily the earliest result and can perhaps be traced back to some paper from 1940 (he doesn't say which one); the bibliography in the notes lists Anderson 1982 (Reverse-time diffusion equation models). Go by the notes for the year.

He skips the derivation and says the notes have an intuitive proof using Bayes' rule plus a Taylor expansion (the second half of Section 14.4 of the notes). He sums up the purpose of the detour himself in one sentence: in the continuous limit the true reverse process is Gaussian, so parameterizing with a Gaussian in the discrete case is reasonable. He also says why he wanted to teach this part:

> "Once you go to large language models, it's kind of like you write down three equations and you are done." (around 42:35)

## A notation interlude: is the left side a density or a distribution?

(Recording 50:55–55:10)

Before getting to training, the lecturer stops to deal with a way of writing that the machine learning community takes for granted and a math department would frown at. Many papers simply write

$$
p_\theta(x_{t-1}\mid x_t)=\mathcal N\!\left(\mu_\theta(x_t,t),\ \sigma_t^2I\right)
$$

The left side is a conditional probability density (a scalar once you plug in values), the right side is a distribution, and the types don't match. Two layers of conflation are behind this:

1. $x_t$ stands both for the random variable itself and for a specific value it takes.
2. $p(\cdot)$ stands both for the density function and for the distribution it describes.

The notes adopt a cleaner convention: $\mathcal N(x;\mu,\sigma^2)$ denotes the value of the Gaussian density at $x$,

$$
\mathcal N(x;\mu,\sigma^2)=\frac{1}{\sqrt{2\pi\sigma^2}}\exp\!\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)
$$

so that both sides of $p_\theta(x_{t-1}\mid x_t)=\mathcal N(x_{t-1};\mu_\theta(x_t,t),\sigma_t^2I)$ are functions of $x_{t-1}$. When they mean the distribution, the notes write $\mathrm{Law}_{p_\theta}(x_{t-1}\mid x_t)=\mathcal N(\mu_\theta(x_t,t),\sigma_t^2I)$ instead. A student asks whether random variables should be written in uppercase, and the lecturer says this field doesn't do that; everyone uses lowercase throughout. The body of this article uses the notes' density notation; in the KL discussion below, the $q$ and $p$ inside $\mathrm{KL}(q(\cdot)\,\Vert\,p(\cdot))$ refer to distributions.

## The training objective: apply the ELBO to the whole trajectory

(Recording 55:10–1:07:00)

Training does maximum likelihood: make the probability of real data $x_0$ under the model, $\log p_\theta(x_0)$, as large as possible. $p_\theta$ defines a joint distribution over the whole trajectory $x_0,\dots,x_T$, and $p_\theta(x_0)$ is its marginal, which requires integrating out all of $x_1,\dots,x_T$:

$$
p_\theta(x_0)=\int p_\theta(x_{0:T})\,dx_1\cdots dx_T
$$

This integral cannot be computed. This is exactly the situation EM handled in the previous lecture: there are unobserved variables and the likelihood doesn't come apart. So the same tool comes out.

**ELBO review.** For any distribution $Q(z)$:

$$
\log p(x;\theta)=\log\int Q(z)\,\frac{p(x,z;\theta)}{Q(z)}\,dz\ \ge\ \mathbb E_{z\sim Q}\!\left[\log\frac{p(x,z;\theta)}{Q(z)}\right]
$$

The inequality is Jensen's inequality ($\log$ is concave, so the log of an expectation is no smaller than the expectation of the log); this step was derived in the previous lecture, and in this lecture only the result was rewritten on the board. Substitute $p(x,z)=p(x\mid z)\,p(z)$ and split into two terms:

$$
\log p(x;\theta)\ \ge\ \underbrace{\mathbb E_{z\sim Q}\big[\log p(x\mid z;\theta)\big]}_{\text{reconstruction term}}-\underbrace{\mathrm{KL}\big(Q\,\Vert\,p_z\big)}_{\text{distance between }Q\text{ and the marginal of }z}
$$

This is equation (11.15) in the notes, and the version the lecturer rewrote on the board.

**The correspondence.** Treat the observed data as $x$ and all the noisy intermediate versions as $z$:

| Notation in last lecture's EM | This lecture |
|---|---|
| Observed $x$ | $x_0$ |
| Latent variable $z$ | The whole trajectory $x_{1:T}=(x_1,\dots,x_T)$ |
| Auxiliary distribution $Q(z)$ | The forward process $q(x_{1:T}\mid x_0)$ |
| Model $p(x,z;\theta)$ | The reverse model $p_\theta(x_{0:T})$ |

Substituting gives equation (14.15) in the notes:

$$
\log p_\theta(x_0)\ \ge\ \mathbb E_{x_{1:T}\sim q(\cdot\mid x_0)}\big[\log p_\theta(x_0\mid x_{1:T})\big]-\mathrm{KL}\big(q(x_{1:T}\mid x_0)\,\Vert\,p_\theta(x_{1:T})\big)
$$

The first term is the reconstruction term. Because $p_\theta$ is a Markov chain, $p_\theta(x_0\mid x_{1:T})=p_\theta(x_0\mid x_1)$, so it only concerns how the last step recovers $x_0$ from $x_1$ (this simplification is written in the notes; the lecture didn't specifically mention it). The second term is a KL between two "trajectory distributions": one is the trajectory obtained by starting from $x_0$ and noising forward, the other is the trajectory the model generates backward from noise.

### Three student questions

**How exactly do $q$ and $p_\theta$ differ?** $q$ is the joint distribution defined by the forward process, with a density for every trajectory; writing $q(\text{some variables}\mid\text{other variables})$ always means conditioning under this joint distribution. $p_\theta$ is another joint distribution that we define by hand, fixed once $\theta$ is given, and it can likewise be conditioned in any way. The two are two different distributions over the same set of variables.

**Using the noising process as the posterior and the denoising process as the prior, isn't that backward?** The lecturer says it is deliberate. In a VAE both sides have parameters (one $\theta$, one $\phi$), and here one side is simply held fixed. The more fundamental reason is that the ELBO is an inequality that holds for any $Q$, and whether $Q$ is called a posterior or not doesn't affect that.

**Why is there a minus KL in the lower bound?** The lecturer offers a sanity check: without this term, reconstruction could cheat its way to perfection by simply setting $z=x$. The KL term acts like regularization, requiring that $Q$ not be too far from the prior distribution of $z$.

The lecturer also says that every treatment he has seen starts from the lower bound and computes straight through for a full page; applying (11.15) first and then splitting the KL is his own way of organizing it, meant to give the derivation structure and make it shorter (around 1:06:05).

## The KL chain rule: split the trajectory KL into single steps

(Recording 1:07:00–1:13:50)

The KL term compares two distributions over $T$-dimensional trajectories and cannot be computed directly. The tool for splitting it is the chain rule for KL.

**The two-variable version.** Let $q(x,y)=q(y)\,q(x\mid y)$ and $p(x,y)=p(y)\,p(x\mid y)$. Then

$$
\mathrm{KL}\big(q(x,y)\,\Vert\,p(x,y)\big)=\mathrm{KL}\big(q(y)\,\Vert\,p(y)\big)+\mathbb E_{y\sim q}\Big[\mathrm{KL}\big(q(x\mid y)\,\Vert\,p(x\mid y)\big)\Big]
$$

The proof is just expanding the definition. The $\log$ turns the product into a sum:

$$
\mathbb E_q\!\left[\log\frac{q(y)\,q(x\mid y)}{p(y)\,p(x\mid y)}\right]=\mathbb E_q\!\left[\log\frac{q(y)}{p(y)}\right]+\mathbb E_q\!\left[\log\frac{q(x\mid y)}{p(x\mid y)}\right]
$$

The first term depends only on $y$ and is $\mathrm{KL}(q(y)\Vert p(y))$. For the second term, first fix $y$ and take the expectation over $x$, which gives the KL between the conditional distributions, then take the expectation over $y$. When the lecturer reads this equation out (his letters have $p$ first and $q$ second), he says only $\mathrm{KL}(p(x\mid y)\Vert q(x\mid y))$ for the second term and doesn't mention the outer expectation over $y$; Lemma A.1.4 in the notes writes it, and it must not be dropped when computing.

**Applying it to the trajectory.** Apply the formula above repeatedly to a sequence of variables, peeling from the last variable $x_T$ forward. Both sides need to be written as a "backward" factorization:

- The model side is already defined backward: $p_\theta(x_{1:T})=p_\theta(x_T)\prod_{t=2}^{T}p_\theta(x_{t-1}\mid x_t)$.
- On the forward side, the lecturer says to "treat $x_0$ as always being there," that is, every factor carries an extra condition $x_0$: $q(x_{1:T}\mid x_0)=q(x_T\mid x_0)\prod_{t=2}^{T}q(x_{t-1}\mid x_t,x_0)$. Strictly, the conditions for $x_{t-1}$ should be $x_t,x_{t+1},\dots,x_T$ and $x_0$, but as said earlier for the reverse process, once $x_t$ is known the later variables provide no more information and can be dropped.

With the two factorizations aligned, apply the chain rule to get equation (14.16) in the notes:

$$
\mathrm{KL}\big(q(x_{1:T}\mid x_0)\,\Vert\,p_\theta(x_{1:T})\big)=\underbrace{\mathrm{KL}\big(q(x_T\mid x_0)\,\Vert\,p_\theta(x_T)\big)}_{L_T}+\sum_{t=2}^{T}\underbrace{\mathbb E_{q}\Big[\mathrm{KL}\big(q(x_{t-1}\mid x_t,x_0)\,\Vert\,p_\theta(x_{t-1}\mid x_t)\big)\Big]}_{L_{t-1}}
$$

The expectation is over $x_t\sim q(x_t\mid x_0)$. The name $L_{t-1}$ is one the lecturer takes from the convention in the literature. The notes say the $L_T$ term can be dropped from the training objective: $p_\theta(x_T)=\mathcal N(0,I)$ is fixed and has no parameters; and when $\bar\alpha_T\approx 0$, $q(x_T\mid x_0)$ is also almost $\mathcal N(0,I)$, so this KL is small anyway (the lecture didn't expand on this; it comes from the notes).

Now each $L_{t-1}$ involves only "one step": the model's single reverse step $p_\theta(x_{t-1}\mid x_t)$ has to match $q(x_{t-1}\mid x_t,x_0)$. Here the lecturer points out the cleverest part of the whole derivation:

> "So without x0, it's very hard to reconstruct. But with x0, it's actually easy to reconstruct." (around 1:13:05)

What we originally wanted to learn is $q(x_{t-1}\mid x_t)$, which cannot be computed. The ELBO plus the chain rule replaces the target with $q(x_{t-1}\mid x_t,x_0)$, which has an extra condition $x_0$, and this distribution has a closed form. In training, $x_0$ is the training image in hand, so of course it is known.

The model's input has no $x_0$, yet it is fit to a target that depends on $x_0$; won't it learn the wrong thing? The next section shows that $L_{t-1}$ ends up as a squared error, and minimizing a squared error yields a conditional expectation: after averaging over the whole training set, $\mu_\theta(x_t,t)$ learns the average of the target over "all possible $x_0$ that lead to this $x_t$," namely $\mathbb E[\tilde\mu_t(x_t,x_0)\mid x_t]$. And $\tilde\mu_t(x_t,x_0)$ is itself $\mathbb E[x_{t-1}\mid x_t,x_0]$, so averaging once more over $x_0$ gives $\mathbb E[x_{t-1}\mid x_t]$, which is exactly the mean of $q(x_{t-1}\mid x_t)$ (this explanation is an addition in this article; the lecture didn't cover it).

## Given x₀, one reverse step can be computed

(Recording 1:13:50–1:19:20)

With less than ten minutes left for this part, the lecturer gives only the Bayes' rule expression and the final conclusion. He says he is skipping the calculation in between, and he is candid that he hasn't even checked the coefficients of the result term by term:

> "The coefficients, I can never remember it." (around 1:17:19)

The Bayes' rule step is:

$$
q(x_{t-1}\mid x_t,x_0)=\frac{q(x_t\mid x_{t-1},x_0)\;q(x_{t-1}\mid x_0)}{q(x_t\mid x_0)}
$$

All three factors on the right are known:

- $q(x_t\mid x_{t-1},x_0)=q(x_t\mid x_{t-1})=\mathcal N(x_t;\sqrt{\alpha_t}\,x_{t-1},\beta_tI)$. The Markov property lets $x_0$ be removed, and what remains is the definition of one forward step.
- $q(x_{t-1}\mid x_0)=\mathcal N(x_{t-1};\sqrt{\bar\alpha_{t-1}}\,x_0,(1-\bar\alpha_{t-1})I)$, the jump formula.
- $q(x_t\mid x_0)$ is likewise the jump formula.

What follows fills in the calculation the lecture skipped (this article's own derivation; the result agrees with equations (14.18) and (14.19) in the notes). The denominator does not contain $x_{t-1}$, so as far as $x_{t-1}$ is concerned it is just a constant. So look only at the part of the exponent, after multiplying the two Gaussians in the numerator, that involves $x_{t-1}$:

$$
-\frac12\left[\frac{\lVert x_t-\sqrt{\alpha_t}\,x_{t-1}\rVert^2}{\beta_t}+\frac{\lVert x_{t-1}-\sqrt{\bar\alpha_{t-1}}\,x_0\rVert^2}{1-\bar\alpha_{t-1}}\right]
$$

This is quadratic in $x_{t-1}$, so the result must be a Gaussian. The exponent of a Gaussian $\mathcal N(\mu,\sigma^2I)$ is $-\frac{1}{2\sigma^2}\lVert x\rVert^2+\frac{1}{\sigma^2}\mu^\top x+\text{const}$, so reading off the quadratic and linear coefficients of the expression above is enough to match the variance and the mean.

**The quadratic coefficient** (in front of $\lVert x_{t-1}\rVert^2$, not counting the $-\frac12$):

$$
\frac{\alpha_t}{\beta_t}+\frac{1}{1-\bar\alpha_{t-1}}=\frac{\alpha_t(1-\bar\alpha_{t-1})+\beta_t}{\beta_t(1-\bar\alpha_{t-1})}=\frac{1-\bar\alpha_t}{\beta_t(1-\bar\alpha_{t-1})}
$$

The last equality uses $\alpha_t\bar\alpha_{t-1}=\bar\alpha_t$ and $\alpha_t+\beta_t=1$. This coefficient is the reciprocal of the variance, so

$$
\tilde\beta_t=\frac{1-\bar\alpha_{t-1}}{1-\bar\alpha_t}\,\beta_t
$$

**The linear coefficient** (after expanding the two squares and multiplying by the $-\frac12$ in front, the vector that takes an inner product with $x_{t-1}$, corresponding to $\mu/\sigma^2$ above):

$$
\frac{\sqrt{\alpha_t}}{\beta_t}\,x_t+\frac{\sqrt{\bar\alpha_{t-1}}}{1-\bar\alpha_{t-1}}\,x_0
$$

The mean equals this times the variance $\tilde\beta_t$:

$$
\tilde\mu_t(x_t,x_0)=\frac{\sqrt{\bar\alpha_{t-1}}\;\beta_t}{1-\bar\alpha_t}\,x_0+\frac{\sqrt{\alpha_t}\,(1-\bar\alpha_{t-1})}{1-\bar\alpha_t}\,x_t
$$

Putting it together:

$$
q(x_{t-1}\mid x_t,x_0)=\mathcal N\!\left(x_{t-1};\ \tilde\mu_t(x_t,x_0),\ \tilde\beta_t I\right)
$$

All the lecturer wants you to remember is the shape: **the mean is a linear combination of $x_0$ and $x_t$, and the variance is determined by $\alpha$ and $\beta$ alone and does not depend on the data**. It also makes intuitive sense: $x_{t-1}$ is sandwiched between the clean $x_0$ and the noisier $x_t$, and the best guess is a weighted average of the two.

### Numerical example: continuing the earlier trajectory

This continues the earlier example made up for this article ($\beta_1=0.1$, $\beta_2=0.2$, $x_0=1.5$, $x_1=1.5811$, $x_2=0.9670$) and computes $q(x_1\mid x_2,x_0)$ for $t=2$. The quantities needed: $\bar\alpha_1=0.9$, $\bar\alpha_2=0.72$, $\alpha_2=0.8$.

$$
\tilde\beta_2=\frac{1-0.9}{1-0.72}\times 0.2=\frac{0.1}{0.28}\times0.2=0.0714
$$

$$
\tilde\mu_2=\frac{\sqrt{0.9}\times0.2}{0.28}\,x_0+\frac{\sqrt{0.8}\times0.1}{0.28}\,x_2=0.6776\times1.5+0.3194\times0.9670=1.0164+0.3089=1.3253
$$

So given $x_0=1.5$ and $x_2=0.967$, the distribution of $x_1$ is a Gaussian with mean 1.3253 and standard deviation $\sqrt{0.0714}=0.267$. The actual $x_1=1.5811$ is 0.96 standard deviations above the mean, a perfectly ordinary sample.

A few things you can read off:

- Knowing only $x_0$, the variance of $x_1$ is $1-\bar\alpha_1=0.1$; knowing $x_2$ as well, it drops to 0.0714. The later observation really does provide information.
- $\tilde\mu_2$ falls between $x_2=0.967$ and $x_0=1.5$, leaning toward $x_0$, because in this example $x_1$ is only one step away from the clean data.
- Check with the quadratic coefficient: $\alpha_2/\beta_2+1/(1-\bar\alpha_1)=4+10=14=1/0.0714$.

## Two Gaussians with the same variance: the loss becomes the squared difference of the means

(Recording 1:19:20–1:21:50)

Both distributions in $L_{t-1}$ are now Gaussian:

- Target: $q(x_{t-1}\mid x_t,x_0)=\mathcal N(\tilde\mu_t(x_t,x_0),\ \tilde\beta_tI)$
- Model: $p_\theta(x_{t-1}\mid x_t)=\mathcal N(\mu_\theta(x_t,t),\ \sigma_t^2I)$

The $\sigma_t^2$ left undecided earlier gets its answer here. The lecturer says at least one choice is to set $\sigma_t^2=\tilde\beta_t$ directly, so that the two Gaussians have the same covariance and differ only in their means. The KL then has a very simple formula (equation (14.20) in the notes):

$$
\mathrm{KL}\big(\mathcal N(m_1,\Sigma)\,\Vert\,\mathcal N(m_2,\Sigma)\big)=\frac12\,(m_1-m_2)^\top\Sigma^{-1}(m_1-m_2)
$$

The lecture only wrote the result. The derivation is short (an addition in this article, following the same approach as Lemma A.1.3 in the notes): let $P=\mathcal N(m_1,\Sigma)$. The two densities have the same normalizing constant, so after taking logs and subtracting only the exponents remain:

$$
\mathrm{KL}=\mathbb E_{x\sim P}\left[\frac12(x-m_2)^\top\Sigma^{-1}(x-m_2)-\frac12(x-m_1)^\top\Sigma^{-1}(x-m_1)\right]
$$

Write $x-m_2$ as $(x-m_1)+(m_1-m_2)$ and expand. The quadratic term in $(x-m_1)$ cancels with the second term; the cross term $(x-m_1)^\top\Sigma^{-1}(m_1-m_2)$ has expectation 0, because $\mathbb E_P[x]=m_1$; the remaining $\frac12(m_1-m_2)^\top\Sigma^{-1}(m_1-m_2)$ does not contain $x$.

Substituting $\Sigma=\tilde\beta_tI$, $m_1=\tilde\mu_t$, $m_2=\mu_\theta$ gives the endpoint of this lecture, equation (14.21) in the notes:

$$
L_{t-1}=\mathbb E_q\!\left[\frac{1}{2\tilde\beta_t}\,\big\lVert\tilde\mu_t(x_t,x_0)-\mu_\theta(x_t,t)\big\rVert_2^2\right]
$$

The ELBO has a minus sign in front of the KL and we want to maximize the lower bound, so $L_{t-1}$ is a loss to minimize. It is a very concrete regression problem: give the network $x_t$ and $t$, and ask it to output $\tilde\mu_t(x_t,x_0)$, that linear combination of $x_0$ and $x_t$. The target can be computed and the loss is differentiable in $\theta$, so you can run gradient descent directly.

**Computing the loss once, continuing the example (made up for this article).** Earlier we got $\tilde\mu_2=1.3253$ and $\tilde\beta_2=0.0714$. If the network outputs $\mu_\theta=1.2$ at this $x_2$, the loss for this sample is $(1.3253-1.2)^2/(2\times0.0714)=0.0157/0.1429=0.110$. If it outputs 1.3, the loss drops to $0.00064/0.1429=0.0045$. The error shrinks to one fifth and the loss to about one twenty-fourth, because of the square. The $1/(2\tilde\beta_t)$ in front then decides how much weight the error at each step index gets.

Stringing together the procedure so far, training on one data point means: take an $x_0$, pick a $t$, draw $x_t$ with the jump formula, compute the target $\tilde\mu_t(x_t,x_0)$, and have $\mu_\theta(x_t,t)$ match it. This procedure is assembled in this article from the equations the lecture reached; the lecturer did not write out a training loop in this lecture, and the notes list the algorithm only after the loss has been simplified.

## Where this lecture stops

The lecturer runs five minutes over and stops at the expression for $L_{t-1}$:

> "There's a little bit of a simplification for this, which we'll cover next time, but this is the gist." (around 1:21:27)

Three things are left unfinished, all wrapped up at the start of the [next lecture](/posts/ai/2026-10-12-stanford-cs229-lecture-12-diffusion-loss-foundation-models-lora-en):

1. **Switching from predicting the mean to predicting the noise.** $x_t$ is itself a linear combination of $x_0$ and $\hat\epsilon_t$, so $\tilde\mu_t$ can be rewritten as a combination of $x_t$ and $\hat\epsilon_t$, letting the network predict the added noise instead (equations (14.22)–(14.24) in the notes).
2. **The reconstruction term $L_0$ at $t=1$**, which is the first term of the ELBO.
3. **The training and sampling algorithms**.

This lecture also does not discuss how to schedule $\beta_t$, what the network for $\mu_\theta$ looks like, or how to add text conditioning.

## Self-check

**1. One-dimensional data, $\beta_1=0.05$, $\beta_2=0.1$, $x_0=2$. Write down the mean and variance of $q(x_2\mid x_0)$.**

Answer: $\bar\alpha_2=0.95\times0.9=0.855$. The mean is $\sqrt{0.855}\times2=1.849$ and the variance is $1-0.855=0.145$. If you wrote the variance as $0.05+0.1=0.15$, you forgot that the first step's noise is also multiplied by $\sqrt{\alpha_2}$ in the second step: the correct value is $0.9\times0.05+0.1=0.145$.

**2. If the forward process is written $x_t=(1-\beta)\,x_{t-1}+\sqrt{\beta}\,\epsilon_t$ (one square root missing, which is the version the lecturer first wrote on the board), and you start from $\mathrm{Var}(x_0)=1$, where does the variance end up?**

Answer: the recursion is $v_t=(1-\beta)^2v_{t-1}+\beta$. The fixed point satisfies $v=(1-\beta)^2v+\beta$, which gives $v=1/(2-\beta)$, about 0.5 when $\beta$ is small. The variance is no longer preserved, and $x_T$ converges to something near $\mathcal N(0,\tfrac12 I)$ instead of $\mathcal N(0,I)$. Criterion: if you can say "the squared coefficients must sum to 1," you have it.

**3. $\hat\epsilon_t$ and $\hat\epsilon_{t+1}$ are each a standard Gaussian. Why are they not independent? Why does this not affect the later derivation?**

Answer: both are weighted sums of $\epsilon_1,\epsilon_2,\dots$ and share the first $t$ of the $\epsilon$'s, so they are correlated. Each $L_{t-1}$ term involves $x_t$ for a single $t$ and uses only the marginal distribution $q(x_t\mid x_0)$, so the correlation across different $t$ never appears in the formulas.

**4. With $\beta_1=0.1$, $\beta_2=0.2$, $\beta_3=0.3$, compute $\tilde\beta_3$ for $t=3$, and the coefficients of $x_0$ and $x_3$ in $\tilde\mu_3$.**

Answer: $\bar\alpha_2=0.72$, $\bar\alpha_3=0.504$. $\tilde\beta_3=\frac{0.28}{0.496}\times0.3=0.1694$. The coefficient of $x_0$ is $\frac{\sqrt{0.72}\times0.3}{0.496}=0.5132$, and the coefficient of $x_3$ is $\frac{\sqrt{0.7}\times0.28}{0.496}=0.4723$. Check: $\alpha_3/\beta_3+1/(1-\bar\alpha_2)=2.333+3.571=5.905=1/0.1694$.

**5. The target in $L_{t-1}$ is $q(x_{t-1}\mid x_t,x_0)$. Why not have the model match $q(x_{t-1}\mid x_t)$ directly?**

Answer: $q(x_{t-1}\mid x_t)$ requires a weighted average over all possible $x_0$ according to $p_{\text{data}}$, and $p_{\text{data}}$ is exactly what we don't know, so no formula can be written. Once $x_0$ is added as a condition, every distribution involved is a Gaussian defined by the forward process, Bayes' rule gives a closed form, and in training $x_0$ is the data in hand. If you can say "without $x_0$ it can't be computed; with $x_0$ it is a closed form," you have answered correctly.

## Corresponding reading

Main lecture notes (August 2026 version), Chapter 14 Diffusion models, printed pages 180–190:

- **14.1 The diffusion process** (pp.180–183): the forward process, the covariance recursion, equation (14.5) and its proof. Corresponds to the first three sections of this article.
- **14.2 Parameterizing the reverse process** (pp.183–184): corresponds to the "reverse process" section.
- **14.3 Training diffusion models by maximizing the ELBO** (pp.184–188): this lecture gets as far as equation (14.21) (p.186); the noise-prediction simplification, $L_0$, and the training and sampling algorithms that follow belong to the next lecture.
- **14.4 Continuous-time view of reverse diffusion** (pp.188–190): corresponds to the Brownian motion detour, and includes the one-dimensional derivation the lecture skipped.
- Equation (11.15) in **11.3.1** (p.160) is the form of the ELBO used in this lecture; **Appendix A.1** (pp.266–268) has three lemmas: conditioning a joint Gaussian, the KL between Gaussians with the same covariance, and the KL chain rule.

Differences between the lecture and the notes:

- The notes put the continuous-time material of 14.4 last; in class the lecturer moves it earlier, between parameterization and training, to answer "why is the reverse Gaussian."
- To get $q(x_{t-1}\mid x_t,x_0)$, the notes use Lemma A.1.2 on conditioning a joint Gaussian; the lecture writes Bayes' rule and mentions that the notes' approach is quicker. What this article fills in is the completing-the-square calculation along the Bayes' rule route.
- For the source of the reverse-time theorem, the lecture says Anderson 1985 aloud, and the bibliography in the notes has Anderson 1982.
- In the notes but not covered in the lecture: why $L_T$ can be dropped, $p_\theta(x_0\mid x_{1:T})=p_\theta(x_0\mid x_1)$, the reference for learnable $\sigma_t^2$, and the origins of diffusion models (the notes cite Sohl-Dickstein et al. 2015, Ho et al. 2020, Song et al. 2021).
- In the notes, and corrected during the lecture: the notes' equations carry the square roots from the start, without the blackboard problem of the lecture's first twenty minutes.

**Series navigation**: Previous [Lecture 10: the EM algorithm and PCA](/posts/ai/2026-10-12-stanford-cs229-lecture-10-em-pca-en) | Next [Lecture 12: the noise-prediction loss for diffusion models, foundation models, and LoRA](/posts/ai/2026-10-12-stanford-cs229-lecture-12-diffusion-loss-foundation-models-lora-en) | [Course overview](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en)

## Course video sources

Original video: [Stanford CS229 Machine Learning | Spring 2026 | Lecture 11: Diffusion Models](https://www.youtube.com/watch?v=dqUMCzWjZSI)

- [Stanford CS229 Machine Learning | Spring 2026 playlist (Stanford Online, 17 videos)](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw)
- [CS229 course website](https://cs229.stanford.edu/)
- [CS229 main lecture notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf)

Checked: 2026-10-12.

Content check: verified against the video transcript (2026-10-12): I read the entire English transcript (about 83 minutes) segment by segment, and everything this article attributes to the lecture, including the quotations, comes from the transcript. I did not view the blackboard; the equations are reconstructed from what is spoken in the transcript and from Chapter 14, Chapter 11, and Appendix A.1 of the main lecture notes. Nothing is spoken in the transcript between 1:10:08 and 1:12:04 (the lecturer is writing on the board), and the KL decomposition at that point is taken from equation (14.16) in the notes.

## References

- [Stanford CS229 Machine Learning | Spring 2026 | Lecture 11: Diffusion Models (YouTube)](https://www.youtube.com/watch?v=dqUMCzWjZSI): the main basis for this article. The order of the lecture, the lecturer's statements, the student questions, and the quotations all follow this video's English transcript.
- [CS229 main lecture notes, main_notes.pdf (August 2026 version)](https://cs229.stanford.edu/main_notes.pdf): equations (14.1)–(14.21) and (14.30)–(14.32) in Chapter 14 were used to reconstruct the blackboard formulas; equation (11.15) in Chapter 11 is the form of the ELBO; the lemmas in Appendix A.1 were used to check the KL chain rule and the Gaussian KL formula; the bibliography was used to check Anderson 1982.
- [Stanford CS229 Machine Learning | Spring 2026 playlist](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw): to confirm the lecture number and video title.
- [Reading Stanford CS229: course overview](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en): the series entry point.
