---
title: "Harvard CS181 HW4 (Part 2): Why Autoencoders Can't Generate, and What VAEs Add"
date: 2026-09-29
category: tech
tags: [harvard, cs181, vae, generative-models, homework, machine-learning]
lang: en
series:
  name: "Harvard CS181 Weekly Guides"
  order: 7
type: guide
tldr: "HW4 Problem 2 has you train a convolutional autoencoder on 64×64 CelebA, sample from N(0, I), and watch it fail to produce faces. You then derive the ELBO, the reparameterization trick, and the closed-form KL, and turn the same backbone into a VAE to compare reconstructions and samples."
description: "A problem-by-problem guide to Harvard CS1810 Spring 2026 HW4 Problem 2: a convolutional autoencoder, why sampling its latent space fails, the ELBO derivation, the reparameterization trick, the closed-form Gaussian KL, and the VAE implementation, plus a notebook detail about mismatched loss scales."
draft: false
glossary:
  - term: "ELBO"
    aliases: ["Evidence Lower Bound"]
    definition: "A lower bound on log p(x), equal to the expected reconstruction log-likelihood minus the KL between the approximate posterior and the prior. Maximizing it stands in for the intractable log p(x)."
    context: "HW4 Problem 2 asks you to derive it from the KL definition and rewrite it as reconstruction minus KL."
  - term: "reparameterization trick"
    definition: "Rewrite z ~ N(μ, σ²) as z = μ + σ ⊙ ε with ε ~ N(0, I). The randomness moves into ε, which does not depend on the parameters, so gradients can flow through the sampling step back to μ and σ."
    context: "The key to training a VAE encoder with backpropagation."
  - term: "KL divergence"
    aliases: ["Kullback–Leibler divergence"]
    definition: "A measure of how far one probability distribution is from another. Always non-negative, zero when the two are equal, and not symmetric."
    context: "The VAE loss uses it to pull the encoder's output distribution toward N(0, I)."
---

> 🌏 [中文版](/posts/tech/2026-09-29-harvard-cs181-hw4-autoencoder-vae)

> ⚠️ **Version and access**: Based on [CS1810 Spring 2026 HW4](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw4) (`hw4_release.tex/ipynb`) and the [Section 6 notes](https://harvard-ml-courses.github.io/cs181-web/static/sec06/sec06.pdf), opened on 2026-09-29. The course is **A3** overall, but has no current-term recordings and no homework solutions. The autoencoder part of Section 6 stops at sparse and denoising autoencoders and **does not cover VAEs**. I did not get the Week 6 Representation Learning / Autoencoders lecture slides, so the VAE material here rests only on the homework handout itself.

This is post 7 of the [Harvard CS181 weekly guide](/posts/tech/2026-08-27-harvard-cs181-overview-en), following [HW4 (Part 1) on Transformers](/posts/tech/2026-09-29-harvard-cs181-hw4-transformer-en).

## Course video sources

This article follows official notes, slides, or assignments. This check of the official public pages did not verify a public recording for the material covered here; it does not establish that no recording exists.

Course and recording entries:

- [harvard-cs181 — official course materials and recording index](https://harvard-ml-courses.github.io/cs181-web/syllabus)

## The setup: it can rebuild a face, but can't draw a new one

HW4 Problem 2 opens with a convincing demonstration. You train a convolutional autoencoder that squeezes CelebA faces into a 128-dimensional vector and rebuilds them, and the reconstructions look fine. Then the problem asks you to do something that seems reasonable: draw a random 128-dimensional vector from a standard normal `N(0, I)` and feed it to the decoder. What comes out usually doesn't look like a face.

The whole problem answers one question: **why can't a latent space that reconstructs well be used for generation, and what does a VAE add so that any random point decodes into a plausible image?**

The problem header says 76 points, but the points marked on the sub-parts add up to 78 (12+4, 4, 8+4+8, 4+4+4, 8+6+12). Go by the actual Gradescope rubric; I'm just flagging the mismatch.

## Intuition: blank space on the map

Think of the latent space as a map. The autoencoder is trained on one goal only: the decoder must be able to rebuild every training image from its coordinates. Nothing asks the coordinates to land in any particular region, and nothing asks the gaps between them to mean anything. So the training data ends up scattered in odd corners of the map, with large blank areas the decoder has never seen.

Sampling from `N(0, I)` is like throwing darts blindfolded at the middle of the map. Most darts land in blank space, and the decoder produces garbage.

The VAE fix: **require all coordinates to crowd inside the `N(0, I)` blob, and make each image a small cloud instead of a point**. Neighboring clouds overlap and fill in the blanks. Now a sample from `N(0, I)` lands somewhere the decoder has seen.

## Mechanism: five steps, five groups of sub-parts

### 1. The autoencoder and the sampling failure (1(a) 12 pts, 1(b) 4 pts)

An encoder `f_φ` compresses `x` into a `d`-dimensional `z`; a decoder `g_θ` rebuilds `x̂`. The loss is mean squared reconstruction error. The handout stresses that **what makes a model an autoencoder is the encoder–decoder pairing trained with a reconstruction loss, not any particular architecture**.

The notebook spells out the architecture:

- Data: `tpremoli/CelebA-attrs` from Hugging Face, with the training set cut to the first 30,000 images for speed, `CenterCrop(178)` then resized to 64×64
- Encoder: 4 stride-2 `Conv2d` layers (channels 3→32→64→128→256), each followed by `BatchNorm2d` + `ReLU`, spatially 64→32→16→8→4, flattened to 4096 then `Linear(4096, 128)`
- Decoder: mirror it with `ConvTranspose2d`, final `Sigmoid`
- 20 epochs, Adam with `lr=1e-3`

1(a) wants training and test loss curves plus the first 5 test images and their reconstructions. 1(b) asks you to explain in 1–2 sentences why an AE has no reason to make samples from `N(0, I)` decode into anything coherent. The "blank space on the map" picture above is what this part wants.

### 2. Why not maximize log p(x) directly (2(a) 4 pts)

To generate, the natural idea is to learn the data distribution by maximum likelihood:

```text
log p(x) = log ∫ p(x | z) p(z) dz
```

The integral is intractable: `p(x | z)` is a neural network and `z` is high-dimensional. The problem presses further: why not draw many `z ~ p(z)` and average `p(x | z)`? A good direction for your answer: for one specific face, what fraction of randomly drawn high-dimensional `z` would give a `p(x | z)` that isn't essentially zero?

### 3. Deriving the ELBO (2(b), 20 pts total)

Since the true posterior `p(z | x)` is out of reach, introduce a network `q_φ(z | x)` as an approximate posterior and measure its distance from the true posterior with KL divergence. Three sub-parts:

1. Expand `log p(z | x)` with Bayes' rule and rearrange to `log p(x) = KL(q ‖ p(z|x)) + ELBO`
2. Since KL ≥ 0, `ELBO ≤ log p(x)`, so maximizing the ELBO is a sensible surrogate
3. Split `log p(x, z)` into `log p(x | z) + log p(z)` and rewrite as "reconstruction term − KL(q ‖ p(z))"

<details>
<summary>Proof skeleton (what each step uses)</summary>

**Step 1**: Start from
`KL(q ‖ p(z|x)) = E_q[log q(z|x) − log p(z|x)]`
and substitute `log p(z|x) = log p(x, z) − log p(x)`. `log p(x)` does not depend on `z`, so it comes out of the expectation. After rearranging, the remaining expectation is exactly the ELBO as the problem defines it.

**Step 2**: KL is non-negative, so `log p(x) ≥ ELBO`, with equality when `q` equals the true posterior. Maximizing the ELBO does two things at once: pushes `log p(x)` up and pulls `q` toward the true posterior.

**Step 3**: Split `log p(x, z)` inside `E_q[log p(x, z) − log q]`. The piece `E_q[log p(z) − log q]` is exactly `−KL(q ‖ p(z))`.

</details>

### 4. Reading the two terms of the VAE loss (2(c), 12 pts total)

The negative ELBO is the VAE loss:

```text
L_VAE = −E_q[log p(x | z)] + KL(q_φ(z | x) ‖ p(z))
```

All three sub-parts are about interpretation:

- How the first term connects back to the reconstruction loss in part 1 (when `p(x|z)` is a Gaussian with fixed variance, the negative log-likelihood is squared error plus a constant)
- How the second term fixes the problem from 1(b): it penalizes the encoder's output for straying from `N(0, I)`, pulling all the "clouds" into the same blob
- What the tug-of-war between the two does: compared with the AE, VAE reconstructions are usually blurrier but samples look more plausible. The handout calls this part "Tensity"

### 5. Reparameterization, closed-form KL, and implementation (3(a) 8 pts, 3(b) 6 pts, 3(c) 12 pts)

The VAE encoder shares the same convolutional backbone, then splits into two linear heads after flattening: `fc_mu` outputs `μ` and `fc_logvar` outputs `log σ²`.

**3(a) Reparameterization**: sampling is not differentiable with respect to the distribution's parameters. Rewrite it as `z = μ + σ ⊙ ε` with `ε ~ N(0, I)`. All the randomness sits in `ε`, `z` becomes a deterministic, differentiable function of `μ` and `σ`, and gradients reach the encoder. You must show the resulting `z` really has distribution `q_φ(z | x)`.

**3(b) Closed-form KL**: for `q = N(μ, diag(σ²))` and `p = N(0, I)`, derive

```text
KL(q ‖ p) = ½ Σⱼ (μⱼ² + σⱼ² − ln σⱼ² − 1)
```

<details>
<summary>Derivation hint</summary>

KL between diagonal Gaussians adds up coordinate by coordinate. For one coordinate `j`, write out `log q(zⱼ) − log p(zⱼ)` from the Gaussian densities. The two `½ log 2π` terms cancel, leaving `−½ ln σⱼ² − (zⱼ − μⱼ)²/(2σⱼ²) + zⱼ²/2`. Take the expectation under `q` using the given `E[zⱼ] = μⱼ` and `E[zⱼ²] = μⱼ² + σⱼ²`: the second term's expectation is `½`, the third is `½(μⱼ² + σⱼ²)`.

</details>

**3(c) Implementation**: the notebook already hands you `vae_loss`, and its KL line is the 3(b) formula written in terms of `logvar`. You fill in the encoder backbone and `reparameterize` (compute `std` from `logvar`, draw `eps`), train for 30 epochs, and plot training and test curves for reconstruction, KL, and total loss. Attach reconstructions, then sample from `N(0, I)` and compare with 1(b).

One notebook detail is worth knowing: **the AE's test loss uses `F.mse_loss` with its default per-pixel mean, while the VAE's reconstruction term uses `reduction="sum"` divided by batch size**. A 3×64×64 image has 12,288 pixels, so the two losses live on very different scales. Don't compare the numbers on the two loss plots directly. Compare AE and VAE by looking at the images, not the loss values.

## Connecting back to generative models

The VAE layout, where an encoder compresses an image into a distribution and a decoder rebuilds from the latent, later became one of the building blocks of image generation systems. [Latent Diffusion](https://arxiv.org/abs/2112.10752), for example, first uses an autoencoder to compress images into a latent space and then runs diffusion there. HW4 stops at the original VAE. CS181 continues in Week 10 with Self-Supervised Learning / Generative Models and Contrastive Learning, GANs, and EBMs (see the [official schedule](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ)), which map to HW5.

Section 6 §2.5 also has a result that ties straight into the next assignment: an autoencoder with a linear encoder, a linear decoder, and squared error has an optimal solution spanning the same subspace as the top m principal components, i.e. PCA. A nonlinear AE can be seen as a nonlinear generalization of PCA. You will meet this again in the HW5 PCA problem.

## Going deeper

- [CMU 11-785 Lecture 22: Variational Autoencoders](/posts/ai/2026-08-22-cmu-11785-22-variational-autoencoders-en): another walkthrough of the same ELBO derivation
- [Kingma & Welling 2013, Auto-Encoding Variational Bayes](https://arxiv.org/abs/1312.6114): the original VAE paper, where both the reparameterization trick and the closed-form Gaussian KL appear

## Previous / next

- Previous: [HW4 (Part 1): Transformers, from hand-computed attention to multi-head](/posts/tech/2026-09-29-harvard-cs181-hw4-transformer-en)
- Next: [HW4 (Part 3): decision trees, random forests, and Mixture of Experts](/posts/tech/2026-09-29-harvard-cs181-hw4-trees-forests-moe-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [CS1810 Spring 2026 HW4 handout hw4_release.tex](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw4/hw4_release.tex)
- [CS1810 Spring 2026 HW4 notebook hw4_release.ipynb](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw4/hw4_release.ipynb)
- [CS1810 Spring 2026 Section 6 (Autoencoders and Representation Learning in §2)](https://harvard-ml-courses.github.io/cs181-web/static/sec06/sec06.pdf) ([solutions](https://harvard-ml-courses.github.io/cs181-web/static/sec06/sec06_soln.pdf))
- [CS1810 Spring 2026 official schedule (Google Sheet)](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ)
- [CelebA-attrs dataset (Hugging Face, the version the notebook uses)](https://huggingface.co/datasets/tpremoli/CelebA-attrs)
- [Kingma & Welling 2013, Auto-Encoding Variational Bayes](https://arxiv.org/abs/1312.6114)
- [Rombach et al. 2022, High-Resolution Image Synthesis with Latent Diffusion Models](https://arxiv.org/abs/2112.10752)
- [CS181 2026 course website](https://harvard-ml-courses.github.io/cs181-web/)
