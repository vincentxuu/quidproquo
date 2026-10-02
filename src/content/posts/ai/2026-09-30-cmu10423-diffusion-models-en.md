---
title: "CMU 10-423 L7: Diffusion Models, from Adding Noise to Learning to Remove It"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai, diffusion-model, deep-learning]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 7
tldr: "L7 splits a diffusion model into two Markov chains. A fixed forward process gradually turns an image into Gaussian noise, and a learned reverse process removes the noise step by step. The exact reverse process is intractable, but the posterior given the original image x₀ is a closed-form Gaussian, so it can serve as the learning target. The slides compare three parameterizations. The best in practice has a U-Net predict the noise ε that was added, and the training loop is eight lines long."
description: "A guide to Lecture 7 of CMU 10-423/623 Generative AI (Spring 2026): the shared goal of unsupervised learning, a GAN→VAE→Diffusion comparison, the U-Net architecture, DDPM's forward and reverse processes, the noise schedule, three key properties, predicting the mean, the clean image or the noise, and the ε-prediction training algorithm plus the sampling algorithm from the start of L8."
draft: false
glossary:
  - term: "forward process"
    aliases: ["noising process"]
    definition: "The fixed, unlearned Markov chain q(x_t | x_{t−1}) in a diffusion model. Each step rescales the image and adds Gaussian noise; after T steps the result is close to a standard Gaussian."
    context: "10-423 L7 contrasts it with the learned reverse process p_θ(x_{t−1} | x_t)."
  - term: "noise schedule"
    definition: "The fixed sequence of coefficients α_t used by the forward process, chosen so that q(x_T) is close to N(0, I) and matches the reverse process's starting point p_θ(x_T)."
    context: "The Defining the Forward Process section of the L7 slides."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-diffusion-models)

> **Version note**: This post is based on the Spring 2026 offering of [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/). The main source is the [Lecture 7 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture7-diffusion.pdf) (Diffusion models Part I, a 47-page PDF). The sampling section comes from the recap at the start of the [Lecture 8 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture8-diffusion-vae.pdf), and the readings follow the [schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html). All facts were checked against the official materials on 2026-09-30. Access level **A3**: slides, homework and the practice exam are public; lecture recordings are on CMU's Panopto and not viewable off campus.

**Series**: previous [L6: Generative adversarial networks](/posts/ai/2026-09-30-cmu10423-gans-en) | next [L8–L9: Variational inference, VAEs and the diffusion ELBO](/posts/ai/2026-09-30-cmu10423-variational-inference-vae-en) | [Series overview](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en)

GANs can draw, but they have a basic limitation: they can't compute the probability p_θ(x) of an image, so they are trained with an adversarial game instead. L7 (February 4, 2026) introduces diffusion models, which take a different route. First define a process that slowly turns an image into noise, then train a network to run that process backward. This is also the model you implement from scratch in the [HW2](/posts/ai/2026-09-30-cmu10423-hw2-ddpm-en) programming section.

## Three models in one table

The slides restate the problem as unsupervised learning. Data comes from a true distribution p\*(x₀); we pick a p_θ(x₀) that is easy to sample from and want p_θ ≈ p\*. The three model families differ in whether they can maximize log p_θ(x₀) directly:

| Model | Direct MLE? | Reason given in the slides | How it actually learns |
|---|---|---|---|
| Autoregressive LM | Yes | Each step is Categorical; ancestral sampling is exact and efficient | Gradient ascent on log p_θ(x₀) |
| GAN | No | Can't even compute log p_θ(x₀) or its gradient | Optimize a minimax loss instead |
| VAE / diffusion | "Sort of" | Can't compute the gradient | Optimize a variational lower bound (details in L8) |

A "GAN → VAE → Diffusion" slide then writes all three as latent variable models. A GAN is z ~ N(0, I) plus a deterministic G_θ(z). A VAE is z plus a Gaussian decoder, paired with an encoder q_φ(z | x). A diffusion model is a whole chain of latents z_T → … → z_1 → z₀ = x. The same slide returns twice more in L8 and L9, so it is worth learning now.

## First, the U-Net

A diffusion denoiser has to take an image in and put something the same size out, so the slides introduce the U-Net first. It was designed for biomedical segmentation, and its key property is that the output layer has the same spatial dimensions as the input (possibly with a different number of channels).

- **Contracting path**: each block is two 3×3 convolutions, a ReLU and stride-2 max-pooling, repeated N times with the channel count doubling each time.
- **Expanding path**: each block is a 2×2 up-convolution, concatenation with the matching contracting-path features, then two 3×3 convolutions and a ReLU, repeated N times with the channel count halving.

Along the way the slides define semantic segmentation (one label per pixel) and instance segmentation (also separating instances of the same class) to show why per-pixel prediction is more than plain classification.

## Two chains running in opposite directions

A diffusion model has two processes:

- **Forward process**: q(x₀) is the data distribution. Each step q(x_t | x_{t−1}) adds a bit of noise, and after T steps the image is pure noise. This part is fixed; nothing is learned.
- **Reverse process**: start from p_θ(x_T) = N(0, I). Each step p_θ(x_{t−1} | x_t) removes a bit of noise until an image comes out. This part is learned.

An in-class question asks which variables are the latents. The handout leaves the answer blank, but the diagram makes it clear: x₁ through x_T.

In DDPM ([Ho et al. 2020](https://arxiv.org/abs/2006.11239)) both processes are Gaussian:

<details>
<summary>DDPM's forward and reverse processes (slide 28)</summary>

```text
Forward: q(x_{0:T}) = q(x_0) Π_{t=1..T} q(x_t | x_{t−1})
         q(x_t | x_{t−1}) = N( √α_t · x_{t−1}, (1 − α_t) I )

Reverse: p_θ(x_{0:T}) = p_θ(x_T) Π_{t=1..T} p_θ(x_{t−1} | x_t)
         p_θ(x_T) = N(0, I)
         p_θ(x_{t−1} | x_t) = N( μ_θ(x_t, t), Σ_θ(x_t, t) )
```

</details>

If the forward process is so simple, why not invert it exactly? The slides explain that computing q(x_{t−1} | x_t) means integrating out every other variable, and that involves q(x₀). The real data distribution is anything but simple, so the reverse conditional is intractable.

**Noise schedule**: α_t follows a fixed schedule chosen so that q(x_T) is close to N(0, I), matching the reverse process's starting point p_θ(x_T).

## Four Gaussian rules and two common doubts

The deck includes a "Gaussians" cheat sheet that later slides keep referring back to. The sum or difference of two Gaussians is Gaussian. If a Gaussian's mean is a **linear** function of another Gaussian variable, the marginal and the posterior are Gaussian. If the mean is a **nonlinear** function, they generally are not.

These rules answer two doubts:

- **If the forward process only adds noise, how can the reverse process learn anything interesting?** Because q(x₀) is not noise, and p_θ has to capture its variability.
- **If every step is Gaussian, won't p_θ(x₀) be Gaussian too?** No. Integrating out the forward chain still gives a Gaussian (the maps are linear), but the reverse mean μ_θ is a neural network (nonlinear), so the result is generally not Gaussian. The slides state that a diffusion model with a long enough T can capture any smooth target distribution.

## Three properties that make training easy

**Property 1: jump to any timestep in one step.** Define ᾱ_t = α₁·α₂·…·α_t. Then q(x_t | x₀) = N(√ᾱ_t x₀, (1 − ᾱ_t) I), or as a sampling rule, x_t = √ᾱ_t x₀ + √(1 − ᾱ_t) ε with ε ~ N(0, I). The slides point out that this is the same reparameterization trick VAEs use.

**Property 2: given x₀, one reverse step has a closed form.** q(x_{t−1} | x_t) is intractable, but conditioning on x₀ gives q(x_{t−1} | x_t, x₀), a Gaussian with mean μ̃_q(x_t, x₀) and variance σ_t². Both have formulas.

**Property 3: rewrite that mean.** Rearranging property 1 gives x₀ = (x_t − √(1 − ᾱ_t) ε) / √ᾱ_t. Substituting into property 2 expresses μ̃_q in terms of x_t and ε. The slides note that this parameterization has been shown empirically to help learn p_θ.

<details>
<summary>Formulas for properties 2 and 3 (slides 47 and 51)</summary>

```text
q(x_{t−1} | x_t, x_0) = N( μ̃_q(x_t, x_0), σ_t² I )

μ̃_q(x_t, x_0) = [√ᾱ_{t−1}(1 − α_t) / (1 − ᾱ_t)] · x_0
              + [√α_t (1 − ᾱ_{t−1}) / (1 − ᾱ_t)] · x_t
σ_t² = (1 − ᾱ_{t−1})(1 − α_t) / (1 − ᾱ_t)

After substituting x_0 = (x_t − √(1 − ᾱ_t) ε) / √ᾱ_t:
μ̃_q = (1/√α_t) · ( x_t − (1 − α_t)/√(1 − ᾱ_t) · ε )
```

</details>

## What should the network predict? Three options

The intuition: for a specific training image x₀, the learned reverse step p_θ(x_{t−1} | x_t) should be as close as possible to the exact q(x_{t−1} | x_t, x₀). (Why this is the right goal waits for the ELBO argument in L8.) The slides build two ideas on this:

- **Idea 1**: don't learn the variance; set Σ_θ = σ_t² I.
- **Idea 2**: make μ_θ close to μ̃_q, with three possible parameterizations:

| Option | What the U-Net predicts | Per-step loss |
|---|---|---|
| A | The mean μ̃_q directly | ‖μ̃_q − μ_θ(x_t, t)‖² |
| B | The clean image x₀ | ‖x₀ − x_θ⁽⁰⁾(x_t, t)‖² |
| C | The noise ε that was added | ‖ε − ε_θ(x_t, t)‖² |

All three feed t to the U-Net as an extra feature. The slides' verdict: **option C is the best empirically.**

## Training and sampling

The option C training algorithm is eight lines:

<details>
<summary>Algorithm 1: Training (Option C, slide 55)</summary>

```text
1: initialize θ
2: for e ∈ {1, …, E} do
3:   for x_0 ∈ D do
4:     t ~ Uniform(1, …, T)
5:     ε ~ N(0, I)
6:     x_t ← √ᾱ_t x_0 + √(1 − ᾱ_t) ε
7:     ℓ_t(θ) ← ‖ε − ε_θ(x_t, t)‖²
8:     θ ← θ − ∇_θ ℓ_t(θ)
```

</details>

Each pass picks one random timestep t per image, uses property 1 to produce x_t in a single step, and asks the network to guess the noise. The recap at the start of L8 adds an "all timesteps" version of option A plus the training loops for options A and B.

Sampling starts from x_T ~ N(0, I) and counts t down from T to 1. At each step the network produces μ̂_t, and fresh noise scaled by σ_t is added. With option C, each step first estimates x̂₀ from ε_θ and then builds μ̂_t with the property 2 formula. These algorithms appear on slides 22–26 of L8.

## Where this lecture shows up in homework and exams

- In [HW2](/posts/ai/2026-09-30-cmu10423-hw2-ddpm-en) (60 points total), question 6, Understanding Diffusion Models, is worth 14 points, and Programming: Diffusion Models is worth 21: you implement DDPM on AFHQ cat images.
- Quiz 2 (February 16) covers L5–L9.
- Question 8 of the [practice exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf), Diffusion Models, is worth 8 points, with [solutions](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf).

## How to self-study it

1. Make sure you understand the "GAN → VAE → Diffusion" slide and can name each model's latent variables.
2. Derive property 1 yourself, using only "a sum of Gaussians is Gaussian" to get from q(x_t | x_{t−1}) to q(x_t | x₀).
3. Read Algorithms 1 and 2 in the [DDPM paper](https://arxiv.org/abs/2006.11239) next to the slides' option C training and sampling algorithms.
4. For where diffusion models started, read [Sohl-Dickstein et al. 2015](https://arxiv.org/abs/1503.03585).
5. Write a toy version in PyTorch: 2D data points, T = 100, a small MLP as ε_θ, and the eight-line loop above. It is a scaled-down HW2 programming section.

## Further reading

- [Reading MIT 6.S184](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview-en) and [Lecture 1: flow and diffusion models](/posts/ai/2026-09-30-mit-6s184-lecture-01-flow-diffusion-models-en), which revisit diffusion through ODEs and SDEs
- [Reading CMU 11-785: Diffusion models](/posts/ai/2026-08-22-cmu-11785-23-diffusion-en)
- [Reading Stanford CS231n: Generative models and diffusion](/posts/ai/2026-09-30-cs231n-generative-models-diffusion-en)

## References

- [CMU 10-423/623/723 Generative AI homepage (Spring 2026)](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html): L7 date, title and readings
- [Lecture 7 slides: Diffusion Models (Part I)](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture7-diffusion.pdf): the main source for this post
- [Lecture 8 slides: Diffusion Models (Part II) + Intro to VAEs](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture8-diffusion-vae.pdf): training algorithms A/B and the sampling algorithms
- [Coursework page](https://www.cs.cmu.edu/~mgormley/courses/10423/coursework.html) and [HW2 handout (zip)](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw2.zip): HW2 point table
- [Practice exam (Spring 2026)](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf) and [solutions](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf)
- [Sohl-Dickstein et al., Deep Unsupervised Learning using Nonequilibrium Thermodynamics (ICML 2015)](https://arxiv.org/abs/1503.03585): schedule reading
- [Ho, Jain & Abbeel, Denoising Diffusion Probabilistic Models (NeurIPS 2020)](https://proceedings.neurips.cc/paper/2020/hash/4c5bcfec8584af0d967f1ab10179ca4b-Abstract.html): schedule reading; [arXiv version](https://arxiv.org/abs/2006.11239)
