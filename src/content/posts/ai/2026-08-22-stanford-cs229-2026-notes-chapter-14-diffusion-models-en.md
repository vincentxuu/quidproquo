---
title: "Diffusion Models: Forward Noise, Reverse Generation, and the ELBO"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, machine-learning, generative-models, diffusion-models, elbo, score-matching]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 15
tldr: "Chapter 14 starts with a fixed Gaussian noising Markov chain and learns to reverse each transition. The ELBO turns reverse-kernel matching into weighted noise prediction, while the continuous-time view explains reverse drift through the score ∇log p_t."
description: "A reading of Chapter 14 in the 2026 CS229 notes: forward diffusion, closed-form noising, Gaussian reverse kernels, the ELBO, noise-prediction loss, sampling, and reverse-time SDEs."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-14-diffusion-models)

This is a chapter-by-chapter reading of Chapter 14, printed pages 180–190, in the 2026 [CS229 Lecture Notes](https://cs229.stanford.edu/main_notes.pdf). It follows the official notes and is **not a reconstruction of any quarter's recordings or schedule**. The chapter begins generative modeling by choosing a fixed path from data to Gaussian noise, then learning how to denoise every step in reverse.

## The forward process gradually washes data into a Gaussian

Let $x_0\sim p_{data}$. Forward diffusion is a fixed Markov chain:

$$
q(x_t\mid x_{t-1})=
\mathcal N\!\left(x_t;\sqrt{1-\beta_t}x_{t-1},\beta_tI\right).
$$

Each step shrinks the previous state slightly and adds independent Gaussian noise. Define $\alpha_t=1-\beta_t$ and $\bar\alpha_t=\prod_{s=1}^t\alpha_s$. The entire sequence admits a one-step sampling formula:

$$
x_t=\sqrt{\bar\alpha_t}x_0+
\sqrt{1-\bar\alpha_t}\epsilon,\qquad
\epsilon\sim\mathcal N(0,I).
$$

This closed form makes training practical: we can synthesize $x_t$ at a random time without simulating all previous steps. As $\bar\alpha_T$ approaches zero, the terminal distribution approaches a spherical Gaussian. The forward process is chosen, not learned; once the noise schedule is fixed, corruption is known.

## The generative model learns unknown reverse kernels

Bayes' rule defines the true $q(x_{t-1}\mid x_t)$ under the forward joint distribution, but it depends on the unknown data distribution. A neural network parameterizes a Gaussian approximation:

$$
p_\theta(x_{t-1}\mid x_t)=
\mathcal N\!\left(x_{t-1};\mu_\theta(x_t,t),\sigma_t^2I\right).
$$

Generation starts from $x_T\sim\mathcal N(0,I)$ and samples backward through $x_{T-1},\ldots,x_0$. The network receives $t$ because the appropriate denoising scale changes with the noise level. Fixed isotropic covariance is a modeling choice; the notes mention that variance can also be learned.

## The ELBO decomposes path likelihood into local matching

Computing $p_\theta(x_0)$ requires integrating out the latent path $x_{1:T}$. Following Chapter 11, use the known forward path $q(x_{1:T}\mid x_0)$ as the variational distribution. Markov factorization decomposes the resulting KL into terminal-prior matching, a sequence of terms matching $q(x_{t-1}\mid x_t,x_0)$ to $p_\theta(x_{t-1}\mid x_t)$, and final reconstruction of $x_0$.

Conditioned on $x_0$, the forward variables are jointly Gaussian, so the true one-step posterior is Gaussian. If model and posterior share a covariance, their KL reduces to a weighted squared distance between means. Replacing $x_0$ through the closed-form noising equation makes posterior-mean prediction equivalent to predicting the injected noise:

$$
\mathcal L_t(\theta)=
\|\epsilon-\epsilon_\theta(x_t,t)\|_2^2.
$$

The exact ELBO supplies different weights across timesteps. Practice often drops them and uses the unweighted objective above. That simplification works well, but it is not identical to the derived ELBO; it changes the relative emphasis placed on noise levels.

## Training and sampling are asymmetric

A training example requires only a clean sample, a sampled timestep, and Gaussian noise. The closed form creates $x_t$ directly, and the network predicts the exact noise used. Different examples and timesteps can be processed in parallel.

Sampling is sequential. Starting at $T$, each state depends on the previous reverse result: use $\epsilon_\theta(x_t,t)$ to construct $\mu_\theta$, then add the prescribed randomness, usually omitting noise on the final step. This captures a central tradeoff of diffusion models: a simple, stable training target paired with potentially expensive iterative generation.

## The continuous-time view explains the score

The notes finally express forward diffusion as a stochastic differential equation:

$$
dX_t=f(X_t,t)dt+g(t)dW_t.
$$

The reversed process is also a diffusion, but its drift includes $g(t)^2\nabla_x\log p_t(x)$. This score points toward increasing marginal density at time $t$ and supplies the correction missing from merely negating the forward drift. It explains why small reverse transitions remain locally Gaussian and why score-based modeling shares the mathematical structure of diffusion models.

This statement requires suitable regularity conditions. The chapter presents an informal theorem and a one-dimensional small-step derivation, not an unconditional guarantee for every data distribution or discretization.

## Connections to adjacent chapters

This chapter directly reuses Chapter 11's ELBO, treating the full noise trajectory as latent. It also bridges classical unsupervised learning and modern generative models. Chapter 15 shifts to foundation models, asking how large-scale pretraining is adapted through linear probes, fine-tuning, or LoRA rather than treating generation as the endpoint.

## Self-study exercise

Choose one normalized small image and three values of $\bar\alpha_t$. Sample noise and construct each $x_t$ with the closed-form equation. Pretend a perfect model knows $\epsilon$ and solve algebraically for $x_0$. Then perturb the predicted noise slightly and observe how reconstruction error is amplified at low signal-to-noise timesteps.

## References

- [CS229 Lecture Notes (2026), Chapter 14.1: Forward diffusion and closed-form noising](https://cs229.stanford.edu/main_notes.pdf#page=181)
- [CS229 Lecture Notes (2026), Chapter 14.2: Reverse generative kernels](https://cs229.stanford.edu/main_notes.pdf#page=184)
- [CS229 Lecture Notes (2026), Chapters 14.3–14.4: The ELBO, noise prediction, and reverse-time SDEs](https://cs229.stanford.edu/main_notes.pdf#page=185)
