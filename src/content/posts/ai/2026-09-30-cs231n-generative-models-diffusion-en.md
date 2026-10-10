---
title: "CS231N L14: Generative Models II — Why Adding Noise and Removing It Generates Images"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, ai-course, stanford, computer-vision, generative-models, diffusion-model]
lang: en
series:
  name: "Reading Stanford CS231N"
  order: 16
tldr: "The CS231N Spring 2026 diffusion lecture doesn't start with DDPM math. It opens by warning that terminology and notation in this area are a mess, then teaches one clean modern version: rectified flow. In training, pick a point between a data sample and noise and have the network predict the velocity from data toward noise; to generate, start from noise and walk backward for about 50 steps. The lecture then stacks on the practical pieces: classifier-free guidance, noise schedules that emphasize middle noise levels, diffusion on VAE latents, Transformers (DiT) as the denoiser, and distillation to cut the step count. Only at the end does it fold VP, VE, and ε/v-prediction into a generalized diffusion framework and name three mathematical views: latent variable model, score function, and SDE."
description: "A guide to Stanford CS231N (Spring 2026) Lecture 14: diffusion intuition, rectified flow (flow matching) training and sampling, conditioning and classifier-free guidance, noise schedules, latent diffusion (VAE + GAN + diffusion), Diffusion Transformers, text-to-image and text-to-video, distillation, the generalized diffusion framework and its three mathematical perspectives, and the return of autoregressive models on discrete latents. Formulas are in collapsible blocks."
draft: false
glossary:
  - term: "rectified flow"
    aliases: ["flow matching"]
    definition: "A way to train diffusion models: take a point on the straight line between data x and noise z, x_t = (1−t)x + tz, and train the network to predict the velocity v = z − x. To generate, start from noise and step against the predicted velocity back to data."
    context: "CS231N L14 uses it as the clean entry point to diffusion."
  - term: "classifier-free guidance"
    aliases: ["CFG"]
    definition: "Randomly drop the condition y during training so one model learns both conditional and unconditional predictions; at sampling time, use their difference to amplify the condition. The cost is running the model twice per step."
    context: "The slides call it used everywhere in practice."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs231n-generative-models-diffusion)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

> **Source years:** slides and assignments are from Spring 2026; the recordings are from Spring 2025 (YouTube). The two may differ. This post follows the 2026 slides and uses the recording only as a supplement.
>
> This is part 16 of the [Reading Stanford CS231N](/posts/ai/2026-09-30-cs231n-course-overview-en) series. The previous post is [L13: Generative Models I, Autoregressive Models, VAEs, and GANs](/posts/ai/2026-09-30-cs231n-generative-models-vae-gan-en); the next is [L16: Vision and Language](/posts/ai/2026-09-30-cs231n-vision-language-en).

For the [CS231N](https://cs231n.stanford.edu/) lecture on May 19, 2026, the [schedule](https://cs231n.stanford.edu/schedule.html) lists a single topic: Diffusion models. The official material is the 122-page [lecture_14.pdf](https://cs231n.stanford.edu/slides/2026/lecture_14.pdf); the matching public recording is [Spring 2025 Lecture 14](https://www.youtube.com/watch?v=Edr4uZFh4EE).

The first 35 slides are actually about GANs, which [the previous post](/posts/ai/2026-09-30-cs231n-generative-models-vae-gan-en) already covers. This post starts at slide 36, where diffusion begins.

## Course video sources

This article uses Spring 2026 materials. The public Spring 2025 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=Edr4uZFh4EE
title: YouTube: CS231N Spring 2025 Lecture 14: Generative Models 2
```

Original videos: [YouTube: CS231N Spring 2025 Lecture 14: Generative Models 2](https://www.youtube.com/watch?v=Edr4uZFh4EE)

Course and recording entries:

- [Official course / lecture source](https://cs231n.stanford.edu/schedule.html)

## Scene: a field where "the notation is a mess"

Slide 36 lists five foundational diffusion papers: [Sohl-Dickstein et al. 2015](https://arxiv.org/abs/1503.03585), Song & Ermon 2019, [Ho et al. 2020 (DDPM)](https://arxiv.org/abs/2006.11239), [Song et al. 2021 (SDE)](https://arxiv.org/abs/2011.13456), and Song et al. 2021 (DDIM).

Slide 37 follows with a warning, the line most worth remembering from this lecture: **terminology and notation in this area are a mess.** There are many mathematical formalisms and a lot of variance in terms and notation between papers. So the course makes a choice: teach only one modern, "clean" implementation — **rectified flow**.

That choice shapes how other material will feel. If you've read the DDPM paper first, the notation, the direction of time, and the prediction target here will all look different; the "generalized diffusion" section at the end of the lecture is what connects them.

## Intuition: learn to remove a little noise, then repeat many times

Slide 41 puts diffusion in three sentences:

1. Pick a noise distribution, usually a unit Gaussian
2. Corrupt data x with varying noise levels t to get x_t; t = 0 is no noise, t = 1 is full noise
3. Train a neural network f_θ(x_t, t) whose only job is to **remove a little bit of noise**

To generate, start from pure noise x₁ and apply f_θ many times in sequence to reach a noiseless sample x₀.

In the previous lecture's taxonomy, this is the "implicit density, iterative procedure to approximate samples" box: the model neither writes down p(x) nor generates in one shot like a GAN; it takes many small steps.

## Mechanism 1: rectified flow training and sampling

**Training** (slide 45, based on [Liu et al. 2022](https://arxiv.org/abs/2209.03003) and [Lipman et al. 2022, Flow Matching](https://arxiv.org/abs/2210.02747)): on each iteration, sample three things — noise z, data x, and t from a uniform distribution. Take the point x_t on the line between them; the target velocity v is the vector from data to noise, z − x. The network's job is to predict v, with an L2 loss.

**Sampling** (slide 56): choose a number of steps T (often T = 50), sample x from noise, and walk t from 1 to 0, computing v_t at each step and stepping 1/T in the opposite direction.

Slide 46 says the core training loop is "just a few lines of code". The code on the slide is an image, so the sketch below is my rewrite of the steps on slides 45 and 56, **not the slide's code**:

```python
# Training: one iteration (rewritten from the steps on slide 45)
x = sample_data()                 # x ~ p_data
z = torch.randn_like(x)           # z ~ p_noise
t = torch.rand(x.shape[0])        # t ~ Uniform(0, 1)
x_t = (1 - t) * x + t * z
v = z - x
loss = ((f_theta(x_t, t) - v) ** 2).mean()

# Sampling (rewritten from the steps on slide 56)
x = torch.randn(shape)            # start from pure noise
for t in torch.linspace(1, 0, T + 1)[:-1]:
    v_t = f_theta(x, t)
    x = x - v_t / T
```

<details>
<summary>Formulas: rectified flow (slides 45, 56)</summary>

$$z \sim p_{noise},\quad x \sim p_{data},\quad t \sim \mathrm{Uniform}(0, 1)$$

$$x_t = (1 - t)\,x + t\,z,\qquad v = z - x$$

$$\mathcal{L} = \big\| f_\theta(x_t, t) - v \big\|_2^2$$

At sampling time, t runs through 1, 1 − 1/T, 1 − 2/T, …, 0, and each step sets x ← x − f_θ(x_t, t)/T.

</details>

## Mechanism 2: making generation follow instructions — conditioning and CFG

**Conditional rectified flow** (slide 61): feed a condition y (a class or text) to the network during training, and at generation time you can target p_data(x | y). The slides then ask: can we control how much we "emphasize" the condition y?

**Classifier-free guidance** (slides 67–71, [Ho & Salimans](https://arxiv.org/abs/2207.12598)): randomly drop y during training so the same model is both conditional and unconditional. For a noisy x_t:

- The unconditional velocity v_∅ points toward p(x)
- The conditional velocity v_y points toward p(x | y)
- Their combination v_cfg points more strongly toward p(x | y)

Sampling steps along v_cfg. The "classifier-free" in the name contrasts with earlier work: [Dhariwal & Nichol](https://arxiv.org/abs/2105.05233) used a separate discriminative model p(y | x) and took the gradient of log p(y | x) with respect to x as the step direction. The slides' verdict on CFG: **used everywhere in practice and very important for high-quality outputs**, at the cost of doubling sampling time.

<details>
<summary>Formula: CFG (slide 67)</summary>

$$v^{\varnothing} = f_\theta(x_t, y_\varnothing, t),\qquad v^{y} = f_\theta(x_t, y, t)$$

$$v^{cfg} = (1 + w)\,v^{y} - w\,v^{\varnothing}$$

Larger w puts more emphasis on the condition y.

</details>

## Mechanism 3: which noise level is hardest?

Slide 78 asks: what is the optimal prediction for the network? Many (x, z) pairs can produce the same x_t, so the network must average over them.

- Full noise (t = 1) is easy: the optimal v is the mean of p_data
- No noise (t = 0) is easy: the optimal v is the mean of p_noise
- **Middle noise is the hardest and most ambiguous**

Sampling t uniformly gives every noise level equal weight. The fix is a **non-uniform noise schedule** (slide 81): put more emphasis on middle noise, commonly with logit-normal sampling; for high-resolution data, shift toward higher noise to account for correlations between pixels. The citation here is [Esser et al. 2024](https://arxiv.org/abs/2403.03206).

Slide 83 sums up: rectified flow is a simple, scalable setup for many generative modeling problems, **but it doesn't work naively on high-resolution data**. That leads to latent diffusion.

## Mechanism 4: the modern pipeline — VAE + GAN + diffusion

**Latent diffusion** (slides 85–96, [Rombach et al., CVPR 2022](https://arxiv.org/abs/2112.10752)) has two stages:

1. Train an encoder and decoder that compress an H×W×3 image into an H/D×W/D×C latent. A common setting is D = 8, C = 16, so a 256×256×3 image becomes 32×32×16; the encoder and decoder are CNNs with attention
2. Freeze the encoder and train a diffusion model to denoise latents. To generate, start from a random latent, denoise it iteratively, and run the decoder to get an image

The slides call latent diffusion **the most common form today**.

How is the encoder/decoder trained? Both models from the previous lecture come back. **It's a VAE**, typically with a very small KL prior weight; the problem is that decoder outputs are often blurry. **So add a discriminator**, the GAN move. Slide 96 concludes: **modern LDM pipelines use VAE + GAN + diffusion.**

**Diffusion Transformer** (slide 99, [Peebles & Xie, ICCV 2023](https://arxiv.org/abs/2212.09748)): diffusion uses standard Transformer blocks, and the main question is how to inject conditioning. The diffusion timestep t most commonly goes in by predicting scale and shift; text, image, and similar conditions usually go in through cross-attention or joint attention.

**A text-to-image example** (slide 101) uses [FLUX.1 [dev]](https://github.com/black-forest-labs/flux):

| Component | Setting on the slide |
|---|---|
| Text encoder | T5 + CLIP |
| Encoder/decoder | 8×8 downsampling |
| Diffusion model | 12B parameters |
| Image tokens | 64×64 = 1024 after 2×2 patchify |

The output is a 1024×1024×3 image, and the latents being denoised are 128×128×16. Slides 104–105 extend the same architecture to text-to-video and list a long line of video diffusion models from 2024–2025 (Sora, Veo 2, MovieGen, Wan, Hunyuan, and more).

**Distillation** (slide 107): rectified flow sampling runs the model about 30–50 times, which is slow. Distillation algorithms reduce the number of steps, sometimes all the way to one, and can also bake CFG into the model.

## Mechanism 5: one framework for everyone's notation

Only now does the lecture return to the "notation is a mess" warning from slide 37. Slides 110–114 replace each fixed coefficient in rectified flow with a function:

<details>
<summary>Formulas: generalized diffusion (slides 110–113)</summary>

$$x_t = a(t)\,x + b(t)\,z,\qquad y_{gt} = c(t)\,x + d(t)\,z,\qquad \mathcal{L} = \| y_{gt} - f_\theta(x_t, t) \|_2^2$$

- **Rectified flow**: a(t) = 1 − t, b(t) = t, c(t) = −1, d(t) = 1
- **Variance Preserving (VP)**: a(t) = √σ(t), b(t) = √(1 − σ(t)); if x and z are independent with variance 1, x_t also has variance 1
- **Variance Exploding (VE)**: a(t) = 1, b(t) = σ(t); σ(1) must be large enough to drown out all signal in x
- **Prediction targets**: x-prediction (c = 1, d = 0), ε-prediction (c = 0, d = 1), v-prediction (c = b(t), d = −a(t))

</details>

How do you choose these functions? The slides' answer: **usually through some mathematical formalism.** Slides 115–117 give three views:

| View | What the slides say | Key papers |
|---|---|---|
| Latent variable model | The forward process (adding Gaussian noise) is known; learn a network to approximate the backward process and optimize a variational lower bound (**same as a VAE**) | Sohl-Dickstein 2015, DDPM |
| Score function | The score is the gradient of log p(x) with respect to x, a vector field pointing toward high density; diffusion learns the score of p_data | Song & Ermon 2019, DDPM |
| Stochastic differential equations | Write the continuous noising process as an SDE; diffusion learns to approximately solve it | Song et al. 2021 |

Slide 118 recommends Sander Dieleman's [Perspectives on diffusion](https://sander.ai/2023/07/20/perspectives.html), adding "all his blog posts are great".

## Back to the models: autoregression strikes back

Slides 119–120 pay off the previous lecture's setup. Autoregressive models are too slow on raw pixels, but **work great on discrete latents**: train an encoder and decoder that turn an image into an H/D×W/D grid of integers, model that sequence of discrete tokens autoregressively, then sample from the autoregressive model and pass the result to the decoder. The line of work cited is [VQ-VAE](https://arxiv.org/abs/1711.00937), VQ-VAE-2, and [Taming Transformers](https://arxiv.org/abs/2012.09841).

Taken together, the two lectures show that none of the four paradigms wiped out the others: GANs became a training component for the LDM decoder, VAEs became the latent space, autoregression came back on discrete latents, and diffusion is today's main engine for generating images and video.

**Watch the assignment mapping.** Q3 of [A3](https://cs231n.github.io/assignments2026/assignment3/) asks you to implement **DDPM** (`DDPM.ipynb`, with `unet.py` and `gaussian_diffusion.py` in the starter code), not the rectified flow at the center of the lecture. The bridge is the generalized framework above: a comment in the starter `gaussian_diffusion.py` reads x_t = √ᾱ_t · x₀ + √(1 − ᾱ_t) · noise, which is the VP form, and `objective` defaults to `pred_noise` (ε-prediction), with `pred_x_start` (x-prediction) as the other option. Reading slides 110–115 before the assignment makes the notation easier to line up. Details are in the [A3 guide](/posts/ai/2026-09-30-cs231n-a3-transformer-ssl-ddpm-clip-en).

## Going deeper

**Official material**

- [lecture_14.pdf](https://cs231n.stanford.edu/slides/2026/lecture_14.pdf): diffusion starts at slide 36
- Recording: [Spring 2025 L14](https://www.youtube.com/watch?v=Edr4uZFh4EE)
- [A3](https://cs231n.github.io/assignments2026/assignment3/): Q3 DDPM

**Related posts on this site** (each is self-contained; overlap is kept)

- [Reading MIT 6.S184: Flow Matching and Diffusion](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview-en) — a whole course on the math of flow matching and diffusion
- [CS229 2026 notes, chapter 14: diffusion models](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-14-diffusion-models-en) — derived from the ELBO side
- [CMU 11-785 Lecture 23: Diffusion](/posts/ai/2026-08-22-cmu-11785-23-diffusion-en)
- [Berkeley CS189 HW2: regression, GMMs, and flow matching](/posts/learning/2026-09-29-berkeley-cs189-sp26-hw2-regression-gmm-flow-matching-en)
- [CME295: Diffusion LLMs](/posts/ai/2026-09-29-cme295-diffusion-llms-en) — diffusion applied to text

## Access limits

Under the grading in the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en), this course is **A3**: the 2026 slides, assignments, and starter code are public, plus full 2025 recordings. The gaps for this lecture: 2026 recordings are on Canvas for enrolled students only, and Gradescope autograding is not public.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [Stanford CS231N course homepage (Spring 2026)](https://cs231n.stanford.edu/)
- [CS231N Spring 2026 schedule](https://cs231n.stanford.edu/schedule.html)
- [CS231N Spring 2026 Lecture 14 slides](https://cs231n.stanford.edu/slides/2026/lecture_14.pdf)
- [YouTube: CS231N Spring 2025 Lecture 14: Generative Models 2](https://www.youtube.com/watch?v=Edr4uZFh4EE)
- [CS231N Assignment 3 (Spring 2026)](https://cs231n.github.io/assignments2026/assignment3/)
- [Liu et al., Flow Straight and Fast (Rectified Flow)](https://arxiv.org/abs/2209.03003)
- [Lipman et al., Flow Matching for Generative Modeling](https://arxiv.org/abs/2210.02747)
- [Ho et al., Denoising Diffusion Probabilistic Models](https://arxiv.org/abs/2006.11239)
- [Song et al., Score-Based Generative Modeling through SDEs](https://arxiv.org/abs/2011.13456)
- [Ho & Salimans, Classifier-Free Diffusion Guidance](https://arxiv.org/abs/2207.12598)
- [Rombach et al., High-Resolution Image Synthesis with Latent Diffusion Models](https://arxiv.org/abs/2112.10752)
- [Peebles & Xie, Scalable Diffusion Models with Transformers](https://arxiv.org/abs/2212.09748)
- [Esser et al., Scaling Rectified Flow Transformers for High-Resolution Image Synthesis](https://arxiv.org/abs/2403.03206)
- [Sander Dieleman, Perspectives on diffusion](https://sander.ai/2023/07/20/perspectives.html)
