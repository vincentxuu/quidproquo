---
title: "CS231N L13: Generative Models I — What Autoregressive Models, VAEs, and GANs Each Optimize"
date: 2026-09-30
category: ai
type: guide
tags: [cs231n, ai-course, stanford, computer-vision, generative-models, vae, gan]
lang: en
series:
  name: "Reading Stanford CS231N"
  order: 15
tldr: "The first generative-models lecture of CS231N Spring 2026 starts by pinning down the difference between a discriminative model, which learns p(y|x), and a generative model, which learns p(x). Every possible image competes for the same probability mass, so a generative model can reject unreasonable inputs. A taxonomy then splits generative models into those that can compute p(x) and those that can only sample. The lecture covers the two that compute (or approximate) it: autoregressive models factor p(x) with the chain rule into step-by-step predictions, and their weak point on raw pixels is speed; VAEs cannot compute p(x), so they maximize a lower bound, the ELBO, whose reconstruction and prior terms pull against each other. The schedule lists GANs under this lecture, but both the 2026 and 2025 slides place them at the start of the next one. This post covers them too so the three paradigms can be compared in one place."
description: "A guide to Stanford CS231N (Spring 2026) Lecture 13: discriminative vs. generative models, the generative-model taxonomy, maximum likelihood, autoregressive models (PixelRNN/PixelCNN), from autoencoders to VAEs, the ELBO derivation and the reparameterization trick, plus GANs, which the slides actually place at the start of L14 (minimax objective, non-saturating loss, DC-GAN, StyleGAN). Formulas are in collapsible blocks."
draft: false
glossary:
  - term: "ELBO"
    aliases: ["evidence lower bound", "variational lower bound"]
    definition: "A lower bound on log p(x): a reconstruction term minus the KL divergence between the encoder's output and the prior. A VAE cannot compute p(x) itself, so it maximizes this bound instead."
    context: "CS231N L13 derives the ELBO from Bayes' rule and uses it as the VAE training objective."
  - term: "reparameterization trick"
    definition: "Rewriting \"sample from N(μ, σ²)\" as \"sample ε from N(0, I), then compute z = μ + σ ⊙ ε\", so gradients can flow back through the sampling step to μ and σ."
    context: "Needed when a VAE samples z from the encoder's output distribution during training."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs231n-generative-models-vae-gan)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

> **Source years:** slides and assignments are from Spring 2026; the recordings are from Spring 2025 (YouTube). The two may differ. This post follows the 2026 slides and uses the recording only as a supplement.
>
> This is part 15 of the [Reading Stanford CS231N](/posts/ai/2026-09-30-cs231n-course-overview-en) series. The previous post is [L12: Self-Supervised Learning](/posts/ai/2026-09-30-cs231n-self-supervised-learning-en); the next is [L14: Generative Models II, Diffusion](/posts/ai/2026-09-30-cs231n-generative-models-diffusion-en).

The [CS231N](https://cs231n.stanford.edu/) lecture on May 14, 2026 was the first half of generative models. The [schedule](https://cs231n.stanford.edu/schedule.html) lists three topics: Variational Autoencoders, Generative Adversarial Network, and Autoregressive Models, with one suggested reading, the blog post [ELBO — What & Why](https://yunfanj.com/blog/2021/01/11/ELBO.html). The official material is the 116-page [lecture_13.pdf](https://cs231n.stanford.edu/slides/2026/lecture_13.pdf); the matching public recording is [Spring 2025 Lecture 13](https://www.youtube.com/watch?v=zbHXQRUNlH0).

One thing to clear up first: **the 2026 L13 slides actually cover only autoregressive models and VAEs.** The taxonomy (slides 46–47) marks autoregressive models and VAEs as "Today" and GANs and diffusion as "Next Time", and the last slide reads "Next Time: Generative Adversarial Networks, Diffusion Models". The GAN material is on slides 8–35 of [lecture_14.pdf](https://cs231n.stanford.edu/slides/2026/lecture_14.pdf). The 2025 slides split things the same way. Following the schedule and the series plan, this post includes GANs and marks where they really sit in the slides; the next post starts at diffusion.

## Course video sources

This article uses Spring 2026 materials. The public Spring 2025 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=zbHXQRUNlH0
title: YouTube: CS231N Spring 2025 Lecture 13: Generative Models 1
```

```youtube
url: https://www.youtube.com/watch?v=Edr4uZFh4EE
title: YouTube: CS231N Spring 2025 Lecture 14: Generative Models 2
```

Original videos: [YouTube: CS231N Spring 2025 Lecture 13: Generative Models 1](https://www.youtube.com/watch?v=zbHXQRUNlH0)、[YouTube: CS231N Spring 2025 Lecture 14: Generative Models 2](https://www.youtube.com/watch?v=Edr4uZFh4EE)

Course and recording entries:

- [Official course / lecture source](https://cs231n.stanford.edu/schedule.html)

## Scene: a classifier can't say "this image makes no sense"

The slides open by revisiting a familiar contrast (slides 14–21):

- **Supervised learning** gets (x, y) and learns a function x → y: classification, detection, segmentation, captioning
- **Unsupervised learning** gets only x and learns hidden structure in the data: clustering, dimensionality reduction, density estimation

Slides 23–30 then sharpen this with three kinds of probabilistic model:

| Model | Learns | What competes for probability |
|---|---|---|
| Discriminative | p(y \| x) | The labels for one image compete; different images do not |
| Generative | p(x) | **All possible images** compete for the same probability mass |
| Conditional generative | p(x \| y) | Each label sets off its own competition across all images |

The key is the second column. A discriminative model must output a label distribution for any input; feed it an abstract painting and it can only split probability between "cat" and "dog". Because all images share a total probability of 1 in a generative model, it can give an unreasonable image tiny probability, in effect "rejecting" it. The slides point out this takes deep understanding: is a dog more likely to sit or stand? Is a three-legged dog more likely than a three-armed monkey?

Slide 36 adds a practical note: "generative models" can mean either the unconditional or conditional version, and **conditional generative models are the most common in practice**.

Why generative models at all? Slides 37–39 answer: **modeling ambiguity**. When one input y has many plausible outputs x, you want to model P(x | y). The three examples are language modeling (the slide has a model write a short rhyming poem about generative models), text-to-image, and image-to-video that predicts what happens next.

## Intuition: one taxonomy splits generative models into two camps

The taxonomy on slide 46, adapted from Ian Goodfellow's 2017 GAN tutorial, is the map for these two lectures:

```text
Generative models
├── Explicit density (model can compute P(x))
│   ├── Tractable: autoregressive models
│   └── Approximate: VAE
└── Implicit density (cannot compute p(x), but can sample)
    ├── Direct sampling: GAN
    └── Iterative procedure to approximate samples: Diffusion
```

Read it this way: the further down you go, the more the model gives up on writing p(x) down in exchange for better sampling. Autoregressive models compute probabilities honestly; VAEs can't, so they compute a lower bound; GANs don't compute it at all and only need to sample; diffusion reaches a sample through many small steps.

## Mechanism 1: autoregressive models — p(x) as a chain of predictions

**Maximum likelihood.** Slide 52 sets the goal: write down an explicit function p(x) = f(x, W), then maximize the probability of the training data. Taking the log turns the product into a sum, giving a loss you can optimize with gradient descent.

**Chain rule.** If x is a sequence (x₁, …, x_T), the chain rule of probability factors the joint probability into a product of "each step given all previous steps" (slide 55). The slide notes: **we have already seen this** — it is language modeling with an RNN. Slide 56 adds that LLMs are autoregressive models too, just with a masked Transformer.

<details>
<summary>Formulas: maximum likelihood and the chain rule (slides 52, 55)</summary>

$$W^* = \arg\max_W \prod_i p(x^{(i)}) = \arg\max_W \sum_i \log f(x^{(i)}, W)$$

$$p(x) = p(x_1, x_2, \dots, x_T) = p(x_1)\,p(x_2 \mid x_1)\,p(x_3 \mid x_1, x_2)\cdots = \prod_{t=1}^{T} p(x_t \mid x_1, \dots, x_{t-1})$$

</details>

**Applied to images.** Slide 58 follows [PixelRNN](https://arxiv.org/abs/1601.06759) and [PixelCNN](https://arxiv.org/abs/1606.05328): flatten the image into a sequence of 8-bit subpixel values in scanline order, treat each subpixel as a 256-way classification, and model it with an RNN or Transformer.

**The weak point is cost.** A 1024×1024 image is a sequence of 3 million subpixels. Slide 59 "jumps ahead" to a fix: model the image as a **sequence of tiles** rather than subpixels. This thread returns at the end of the next lecture (autoregression over discrete latents); see [the next post](/posts/ai/2026-09-30-cs231n-generative-models-diffusion-en).

## Mechanism 2: from autoencoders to VAEs

**Plain autoencoders.** Slides 63–67 start with the non-variational version. The goal is to extract useful features z from inputs x without labels. How do you train without labels? Have a decoder reconstruct x from z and use the L2 distance between x̂ and x as the loss — "encoding yourself". After training, the encoder can be reused for downstream tasks.

**Where it gets stuck.** Slides 68–70 ask: since the decoder turns z into an image, can we invent a new z to generate images? The problem is that generating a new z is no easier than generating a new x. The fix: **force all z to come from a known distribution.** That is the starting point of the [VAE](https://arxiv.org/abs/1312.6114) (Kingma & Welling).

**The probabilistic story** (slides 75–86):

1. Assume each training image x is generated from an unobserved latent representation z; think of z as attributes, orientation, and other factors that produce x
2. Assume a simple prior p(z), such as a Gaussian
3. To generate: sample z from the prior, then sample x from the conditional p(x | z)

The natural way to train is maximum likelihood. But z is unobserved, so you have to marginalize it out, and **you can't integrate over all z**. Bayes' rule doesn't help either, because the true posterior p(z | x) is intractable. The fix is to **train a second network q(z | x) that approximates p(z | x)** — the encoder.

**How does a network output a distribution?** Slides 89–90: the network outputs the mean (and standard deviation) of a (diagonal) Gaussian. The decoder outputs a mean for x with fixed variance, so maximizing log p(x | z) is equivalent to **minimizing the L2 distance between x and the network output**.

<details>
<summary>Formulas: the ELBO derivation (slides 92–102)</summary>

Start from Bayes' rule and multiply top and bottom by q(z | x):

$$\log p_\theta(x) = \log \frac{p_\theta(x \mid z)\,p(z)}{p_\theta(z \mid x)} = \log \frac{p_\theta(x \mid z)\,p(z)\,q_\phi(z \mid x)}{p_\theta(z \mid x)\,q_\phi(z \mid x)}$$

Rearrange the logs. The left side doesn't depend on z, so it can be wrapped in an expectation over z ∼ q(z | x):

$$\log p_\theta(x) = \mathbb{E}_{z}[\log p_\theta(x \mid z)] - D_{KL}\big(q_\phi(z \mid x)\,\|\,p(z)\big) + D_{KL}\big(q_\phi(z \mid x)\,\|\,p_\theta(z \mid x)\big)$$

The three terms are:

- **Data reconstruction**: x passed through the encoder and decoder should come back
- **Prior**: the encoder output should match the prior over z; closed form when both are Gaussian
- **Posterior approximation**: the encoder output should match the true posterior; this term **cannot be computed**

KL divergence is always ≥ 0, so dropping the last term gives a lower bound:

$$\log p_\theta(x) \ge \mathbb{E}_{z \sim q_\phi(z \mid x)}[\log p_\theta(x \mid z)] - D_{KL}\big(q_\phi(z \mid x)\,\|\,p(z)\big)$$

</details>

The last line of that block is the VAE training objective, the **variational lower bound**, also called the **Evidence Lower Bound (ELBO)**. The encoder and decoder are trained jointly to make it as large as possible. The suggested [ELBO blog post](https://yunfanj.com/blog/2021/01/11/ELBO.html) opens by describing exactly this role: it turns an intractable inference problem into an optimization problem you can solve with gradient methods.

**One training iteration** (slide 109):

1. Run x through the encoder to get a distribution over z
2. Prior loss: the encoder output should be close to a unit Gaussian (zero mean, unit variance)
3. Sample z from the encoder output using the **reparameterization trick**: draw ε ∼ N(0, I), then compute z = ε ⊙ Σ + μ
4. Run z through the decoder to get the predicted data mean
5. Reconstruction loss: the predicted mean should match x in L2

**The two losses fight.** Slide 110 names the VAE's central tension: the reconstruction loss wants Σ = 0 and a unique μ for every x so the decoder can reconstruct deterministically; the prior loss wants Σ = I and μ = 0 so the encoder output is always a unit Gaussian. The trained model is a compromise between the two.

**Sampling and disentangling.** To generate, sample z from the prior N(0, I) and run the decoder once (slide 111). Because the prior is a diagonal Gaussian, the dimensions of z are independent, so varying z₁ or z₂ alone shows different factors of variation — what the slides call "disentangling factors of variation" (slide 112).

## Mechanism 3: GANs — give up on p(x), just sample (slides are in L14)

This section comes from slides 8–35 of [lecture_14.pdf](https://cs231n.stanford.edu/slides/2026/lecture_14.pdf); the recording is [Spring 2025 Lecture 14](https://www.youtube.com/watch?v=Edr4uZFh4EE).

Slide 10 lines up the first two models: autoregressive models directly maximize the likelihood of the training data; VAEs introduce a latent z and maximize a lower bound. **[GANs](https://arxiv.org/abs/1406.2661) give up on modeling p(x) but let us draw samples from it.**

**Setup** (slide 15): data x comes from p_data. Introduce a simple prior p(z), sample z, pass it to a generator G to get x = G(z), which follows the generator distribution p_G. We want p_G = p_data. To get there, train a discriminator D to tell real from fake, and train the generator by fooling the discriminator.

**A minimax game** (slides 19–22): D(x) is the probability that x is real. The discriminator wants real data classified as 1 and fake data as 0; the generator wants fake data classified as 1. The two are trained with alternating gradient updates. The slides flag an important point: **we are not minimizing any overall loss, so there are no training curves to look at.**

**Vanishing gradients early on** (slide 25): at the start the generator is bad and the discriminator easily tells real from fake, so D(G(z)) is near 0 and the generator's gradients are near 0 too. The fix is to have the generator minimize −log D(G(z)) instead, which gives strong gradients early.

<details>
<summary>Formulas: the GAN objective and its optimum (slides 19, 29)</summary>

$$\min_G \max_D\; \mathbb{E}_{x \sim p_{data}}[\log D(x)] + \mathbb{E}_{z \sim p(z)}[\log(1 - D(G(z)))]$$

Alternating updates: D ← D + α_D ∂V/∂D, G ← G − α_G ∂V/∂G.

For any fixed p_G, the optimal inner discriminator is:

$$D^*_G(x) = \frac{p_{data}(x)}{p_{data}(x) + p_G(x)}$$

Plugging it back in, the outer objective is minimized at p_G = p_data (the slides omit the proof).

</details>

That optimum shows the objective itself is sound, but the slides list two caveats: fixed-capacity networks may not be able to represent the optimal D and G, and the result says nothing about convergence with finite data.

**Architectures** (slides 31–34):

- **[DC-GAN](https://arxiv.org/abs/1511.06434)** (Radford et al., ICLR 2016): G and D are both usually CNNs; it was the first GAN architecture that worked on non-toy data. The slides also note that GANs fell out of favor before ViT became popular
- **[StyleGAN](https://arxiv.org/abs/1812.04948)**: a more complex generator that injects noise via adaptive normalization, predicting at each layer a scale w and shift b of the same shape as x
- **Latent-space interpolation**: a GAN's latent space is smooth; interpolating linearly between z₀ and z₁ gives images that transition smoothly

**GAN summary** (slide 35): pros are a simple formulation and very good image quality; cons are no loss curve to look at, unstable training, and difficulty scaling to big models and data. The slides' verdict: **GANs were the go-to generative models from about 2016 to 2021.**

## Back to the models: what each paradigm optimizes

| | Autoregressive | VAE | GAN |
|---|---|---|---|
| Objective | Exact log p(x) (chain rule) | ELBO, a lower bound on p(x) | Minimax game with a discriminator |
| Computes p(x)? | Yes | Only approximately | No |
| Sampling | Generate step by step | Sample z from prior, decode once | Sample z from prior, generate once |
| Pain point named in slides | Too slow on raw pixels | Reconstruction and prior losses fight | No loss curve, unstable, hard to scale |

The table also previews the next lecture: [diffusion](/posts/ai/2026-09-30-cs231n-generative-models-diffusion-en) is the last box in the taxonomy, "iterative procedure to approximate samples", and modern latent diffusion brings back both VAEs and GANs as components. Autoregression returns on discrete latents.

On the assignment side, [A3](https://cs231n.github.io/assignments2026/assignment3/) has no VAE or GAN problem; its generative-model exercise is the DDPM in Q3, covered in the [A3 guide](/posts/ai/2026-09-30-cs231n-a3-transformer-ssl-ddpm-clip-en).

## Going deeper

**Official material**

- [lecture_13.pdf](https://cs231n.stanford.edu/slides/2026/lecture_13.pdf): autoregressive models and VAEs; the ELBO derivation is on slides 92–103
- [lecture_14.pdf](https://cs231n.stanford.edu/slides/2026/lecture_14.pdf), slides 8–35: GANs
- [ELBO — What & Why](https://yunfanj.com/blog/2021/01/11/ELBO.html): the suggested reading on the schedule
- Recordings: [Spring 2025 L13](https://www.youtube.com/watch?v=zbHXQRUNlH0), [Spring 2025 L14](https://www.youtube.com/watch?v=Edr4uZFh4EE)

**Related posts on this site** (each is self-contained; overlap is kept)

- [CMU 11-785 Lecture 22: VAEs](/posts/ai/2026-08-22-cmu-11785-22-variational-autoencoders-en), [Lecture 24: GANs](/posts/ai/2026-08-22-cmu-11785-24-gans-en)
- [MIT 6.S191 Lecture 4: Generative Modeling](/posts/ai/2026-08-22-mit-6s191-l04-generative-modeling-en)
- [CS230: Adversarial Robustness and Generative Models](/posts/ai/2026-08-16-cs230-adversarial-and-generative-en)

## Access limits

Under the grading in the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en), this course is **A3**: the 2026 slides, assignments, and course notes are public, plus full 2025 recordings. The gaps for this lecture: 2026 recordings are on Canvas for enrolled students only, and the midterm (May 12, two days before this lecture) is not public.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [Stanford CS231N course homepage (Spring 2026)](https://cs231n.stanford.edu/)
- [CS231N Spring 2026 schedule](https://cs231n.stanford.edu/schedule.html)
- [CS231N Spring 2026 Lecture 13 slides](https://cs231n.stanford.edu/slides/2026/lecture_13.pdf)
- [CS231N Spring 2026 Lecture 14 slides](https://cs231n.stanford.edu/slides/2026/lecture_14.pdf)
- [CS231N Spring 2025 schedule](https://cs231n.stanford.edu/2025/schedule.html)
- [YouTube: CS231N Spring 2025 Lecture 13: Generative Models 1](https://www.youtube.com/watch?v=zbHXQRUNlH0)
- [YouTube: CS231N Spring 2025 Lecture 14: Generative Models 2](https://www.youtube.com/watch?v=Edr4uZFh4EE)
- [Yunfan's Blog, ELBO — What & Why (suggested reading)](https://yunfanj.com/blog/2021/01/11/ELBO.html)
- [CS231N Assignment 3 (Spring 2026)](https://cs231n.github.io/assignments2026/assignment3/)
- [Kingma & Welling, Auto-Encoding Variational Bayes](https://arxiv.org/abs/1312.6114)
- [Goodfellow et al., Generative Adversarial Nets](https://arxiv.org/abs/1406.2661)
- [van den Oord et al., Pixel Recurrent Neural Networks](https://arxiv.org/abs/1601.06759)
- [van den Oord et al., Conditional Image Generation with PixelCNN Decoders](https://arxiv.org/abs/1606.05328)
- [Radford et al., DC-GAN](https://arxiv.org/abs/1511.06434)
- [Karras et al., A Style-Based Generator Architecture for GANs](https://arxiv.org/abs/1812.04948)
