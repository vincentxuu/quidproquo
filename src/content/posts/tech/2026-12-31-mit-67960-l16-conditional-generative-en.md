---
title: "MIT 6.7960 L16: Conditional Generative Models — cGAN, cVAE, and Classifier-Free Guidance"
date: 2026-08-30
category: tech
tags:
  - mit-67960
  - deep-learning
  - conditional-generative
  - cgan
  - cvae
  - classifier-free-guidance
  - diffusion
  - text-to-image
  - fall-2024
lang: en
description: "MIT 6.7960 Fall 2024 OCW, Lecture 16 (Phillip Isola): how do we make generative models follow instructions? cGAN / cVAE inject the condition y (class, text, image) into the generator and discriminator / encoder; in the diffusion era, Classifier Guidance and Classifier-Free Guidance steer the sample; ending with the modern text-to-image stack (Stable Diffusion, Imagen)."
tldr: "The key to conditional generation is 'feed y into the model': cGAN concatenates y into G/D; cVAE passes y to both encoder and decoder; in diffusion, Classifier Guidance uses gradients from an external classifier to push samples toward a class, while Classifier-Free Guidance trains conditional + unconditional together and linearly combines them at inference — the latter is the standard weapon behind Stable Diffusion and Imagen."
draft: false
series:
  name: "MIT 6.7960 導讀 (Fall 2024 OCW)"
  order: 19
additionalSeries:
  - name: "Global AI/CS Course Map"
    order: 26
---

> 🌏 [中文版](/posts/tech/2026-12-31-mit-67960-l16-conditional-generative)

> **Source**: based on **MIT 6.7960 Fall 2024 OCW** (corresponds to OCW Lec 16). Videos, slides, and assignments are all open on [MIT OCW](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/). This lecture is taught by **Phillip Isola**.

---

## From "generate" to "conditional generate"

L14–L15 were about generating `x`, but in practice we more often need **a condition `y`, and generate the matching `x`**: `y` might be a class label, a sentence, or another image. Conditional generative models answer: how do we estimate and sample from `p(x | y)`?

## cGAN: stuff y into G and D

The most direct approach is **conditional GAN (Mirza & Osindero, 2014)**: feed the condition `y` concatenated with `z` (noise) into the generator `G`, and feed `y` together with real/fake samples into the discriminator `D`. The training objective is unchanged:

```
min_G max_D  E[log D(x|y)] + E[log(1 − D(G(z|y)))]
```

Intuitively: the generator must "generate something that looks right given `y`"; the discriminator must "judge `(x, y)` real or fake." Conditional MNIST generation (pick the digit 0–9) is the classic toy experiment.

Minimal cGAN training skeleton:

```python
import torch, torch.nn as nn
G = nn.Sequential(nn.Linear(z_dim+num_classes, 256), nn.ReLU(),
                  nn.Linear(256, 784), nn.Sigmoid())
D = nn.Sequential(nn.Linear(784+num_classes, 256), nn.LeakyReLU(),
                  nn.Linear(256, 1))
def embed(y, K):           # one-hot
    e = torch.zeros(y.size(0), K, device=y.device); e[range(y.size(0)), y] = 1; return e
# training: D sees (x, y); G produces x from (z, y)
```

## cVAE: stuff y into encoder / decoder

For L15's VAE the same idea: **conditional VAE** treats `y` as an extra input to both encoder and decoder,

```
q(z | x, y),   p(x | z, y),   p(z)
```

The ELBO becomes `E_q[log p(x|z,y)] − KL(q(z|x,y) ‖ p(z))`. In practice `y` can be a class one-hot, a text embedding, or coordinates. This is the foundation for later text-to-image VAEs and inpainting variants.

## Conditional control in the diffusion era

Diffusion models split generation into "iterative denoising" (covered in L14); conditional generation has two main routes:

### Classifier Guidance (Dhariwal & Nichol 2021)

Train a conditional diffusion `p_θ(x_t | x_{t+1}, y)` **and** separately train a classifier `p(y | x_t)`; during the reverse process add a gradient term that pushes the sample toward the specified class:

```
x_{t−1} ← x_t − γ · ∇_{x_t} log p(y | x_t) + noise
```

`γ` controls conditioning strength — larger means more obedient but less diverse. The downside: you need a separate classifier that works on noisy images.

### Classifier-Free Guidance (Ho & Salimans 2022)

A cleaner solution: **the same model trains both conditional and unconditional**, implemented by replacing `y` with a special "null token" for the unconditional case. At inference, linearly combine:

```
ε̂ = (1 + w) ε_θ(x_t | y) − w ε_θ(x_t | ∅)
```

`w` controls how obedient the sample is. `w = 0` is pure conditional, larger `w` pushes harder toward the condition (diversity drops). **This is the standard weapon behind Stable Diffusion and Imagen**.

## The actual text-to-image workflow

Bringing the past few lectures together, today's text-to-image system is roughly:

1. **Text encoding** (L11 / L12 representation learning): a CLIP-style text encoder turns the prompt into an embedding `y`.
2. **Conditional generation**: latent diffusion (run diffusion in a VAE's latent space to save compute) + Classifier-Free Guidance to steer toward the prompt.
3. **Decoding**: a VQ-VAE / KL-VAE decoder turns the latent back into pixels.

In other words, **VAE latent + conditional diffusion + CFG** is the basic recipe of current SOTA.

## Trade-offs and common failure modes

- **CFG weight too high**: images become oversaturated, textures distort, low diversity.
- **Prompt not specific enough**: the model collapses to mean-image (a fundamental issue for the VAE family).
- **y and x misaligned**: in fine-tuning, use LoRA / DreamBooth to "slot" a new concept into the model's condition space.
- **Controllability vs diversity**: this is the fundamental trade-off in conditional generation; there is no silver bullet.

## References

- MIT 6.7960 OCW (Fall 2024): [course home](https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/)
- Mirza & Osindero, *Conditional Generative Adversarial Nets*: [arXiv:1411.1784](https://arxiv.org/abs/1411.1784)
- Ho & Salimans, *Classifier-Free Diffusion Guidance*: [arXiv:2207.12598](https://arxiv.org/abs/2207.12598)
- Dhariwal & Nichol, *Diffusion Models Beat GANs on Image Synthesis*: [arXiv:2105.05233](https://arxiv.org/abs/2105.05233)
