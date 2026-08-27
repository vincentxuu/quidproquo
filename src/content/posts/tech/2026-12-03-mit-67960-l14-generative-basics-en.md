---
title: "MIT 6.7960 L14: Generative Models Basics — Density/Energy Models, GANs, Autoregressive, Diffusion"
date: 2026-12-03
category: tech
tags:
  - mit-67960
  - deep-learning
  - generative-model
  - gan
  - diffusion
  - autoregressive
  - fall-2024
lang: en
description: "MIT 6.7960 Fall 2024 OCW Lecture 14 (Phillip Isola): the generative-model family — density models, energy models and their samplers, GANs, autoregressive models, and the intuition behind diffusion models."
tldr: "Generative models learn the data distribution p(x). Density models model probability directly, energy models use an unnormalized potential + sampler, GANs let a discriminator force realistic samples, autoregressive predicts the next token step by step, and diffusion dodges tricky maximum-likelihood via 'add noise then learn to denoise'."
draft: false
series:
  name: "MIT 6.7960 導讀 (Fall 2024 OCW)"
  order: 16
additionalSeries:
  - "Global AI/CS Course Map"
---

> 🌏 [中文版](/posts/tech/2026-12-03-mit-67960-l14-generative-basics)

> **Source version**: based on **MIT 6.7960 Fall 2024 OCW**. Videos, slides, and assignments are public at [MIT OCW](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/). This lecture is taught by **Phillip Isola**; the required reading is *Generative Models*.

---

## The ultimate goal of generative models

Every generative model does the same thing: **learn the data distribution `p(x)`** so that sampling from it produces samples "of the same kind but brand new". They differ only in *how they represent it, how they train it, how they sample from it*.

## Density models: model probability directly

The most intuitive is the **explicit density model**: parameterize `p_θ(x)` and maximize the log-likelihood `log p_θ(x)` of the training data.

- **Autoregressive models**: factorize `p(x)` as `p(x_1)·p(x_2|x_1)·…·p(x_n|x_<n)`, predicting the next element step by step. PixelCNN generates images pixel by pixel this way. Upside: likelihood is exact and training is stable. Downside: slow generation (must be sequential).
- **Normalizing flows**: a chain of invertible transforms mapping a simple distribution to a complex one, with likelihood still exactly computable.

## Energy models: define "looks real" first, then sample

An **energy-based model (EBM)** does not give a probability directly; it defines an energy function `E_θ(x)` such that

```
p_θ(x) = exp(−E_θ(x)) / Z_θ        (Z_θ is an intractable normalization constant)
```

Low `E_θ(x)` = dense data region = high probability. The catch: `Z_θ` is usually a high-dimensional integral you cannot compute. So training and sampling split:

- **Training**: use contrastive divergence and friends — only require "real samples have low energy, generated samples have high energy", dodging `Z_θ`.
- **Sampling**: use Langevin dynamics / MCMC, walk along `−∇E` toward low energy, adding noise so you do not get stuck.

EBMs are appealing for their expressiveness and freedom from a tractable density form; the cost is slow sampling and brittle training.

## GAN: let a discriminator force realistic samples

A **GAN** uses an adversarial game to dodge explicit density: a generator `G` fakes samples, a discriminator `D` tells real from fake, in a zero-sum tug-of-war.

```
min_G max_D  E[log D(x)] + E[log(1 − D(G(z)))]
```

Once training stabilizes, `G`'s outputs are visually striking (GAN's strength). But the cost is **fragile training**: mode collapse (only a few modes generated), vanishing gradients, hyperparameter sensitivity. Later WGAN, spectral norm, and GAN-stabilization tricks patch these holes.

## Diffusion: add noise step by step, then learn to denoise

**Diffusion models (DDPM)** are the strongest image generators of recent years, with an elegant idea:

1. **Forward process**: gradually add Gaussian noise to a real sample; after T steps it becomes pure noise.
2. **Reverse process**: train a network `ε_θ(x_t, t)` to predict "how much noise was added this step" — equivalently, learn to denoise.
3. **Sampling**: start from pure noise, repeatedly predict and subtract noise, restoring a sharp sample step by step.

This dodges the intractable normalization constant of maximum likelihood; the training objective is just a simple "predict the noise" MSE, yet it generates extremely high-quality images. The cost is many sampling steps (though DDIM and friends later sped it up).

A PyTorch-style training objective (simplified):

```python
def diffusion_loss(net, x0, t, sqrt_alphas_cumprod, sqrt_1_m_alphas):
    noise = torch.randn_like(x0)
    x_t = sqrt_alphas_cumprod[t] * x0 + sqrt_1_m_alphas[t] * noise  # add noise
    pred_noise = net(x_t, t)
    return F.mse_loss(pred_noise, noise)                            # predict noise
```

## How to choose

- **Need exact likelihood, want stability**: autoregressive / flow.
- **Need极致 image fidelity**: GAN (but hard to train) or diffusion (stable and high quality).
- **Need to express arbitrarily complex distributions, free of density form**: energy models.
- **Discrete sequences like text**: autoregressive (today's LLMs are exactly this).

The next batch (L15, L16) goes deep on VAEs and conditional generation (text-to-image, image-to-text), connecting generative models back to the need for *control*.

## References

- MIT 6.7960 OCW (Fall 2024): [course home](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)
- Goodfellow et al., *Generative Adversarial Networks (GAN)*: [arXiv:1406.2661](https://arxiv.org/abs/1406.2661)
- Ho et al., *Denoising Diffusion Probabilistic Models (DDPM)*: [arXiv:2006.11239](https://arxiv.org/abs/2006.11239)
- Van den Oord et al., *Conditional Image Generation with PixelCNN*: [arXiv:1606.05328](https://arxiv.org/abs/1606.05328)
