---
title: "CMU 10-423 L8–L9: Variational Inference, VAEs and the Diffusion ELBO"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai, vae, variational-inference, elbo, diffusion-model]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 8
tldr: "VAEs and diffusion models get stuck in the same place: log p_θ(x) requires integrating over latent variables, which is intractable. L8–L9 answer with variational inference. Pick a tractable q to approximate the true posterior, and swap 'minimize the KL' for 'maximize the ELBO,' which is a lower bound on log p(x). Add Monte Carlo estimation and the reparameterization trick, and a VAE trains with one forward and one backward pass. Unpack DDPM's ELBO and every term asks the learned reverse step to match the closed-form q(x_{t−1} | x_t, x₀)."
description: "A guide to the second half of Lecture 8 and the VAE part of Lecture 9 of CMU 10-423/623 Generative AI (Spring 2026): DDPM sampling and its ELBO objective, why plain autoencoders can't sample, how KL divergence behaves, variational inference and the ELBO, why the ELBO is a lower bound, Monte Carlo estimation, the reparameterization trick, the six-step VAE derivation and implementation, Kingma & Welling and Bowman's experiments, VQ-VAE, and how VAEs connect to diffusion."
draft: false
glossary:
  - term: "ELBO"
    aliases: ["Evidence Lower BOund"]
    definition: "ELBO(q) = E_q[log p(x, z)] − E_q[log q(z | x)]. For any q, log p(x) ≥ ELBO(q), and the gap is exactly KL(q(z | x) ‖ p(z | x)). Maximizing the ELBO therefore minimizes that KL and pushes up a lower bound on log p(x)."
    context: "10-423 L9 uses it to train VAEs; L8 uses it to derive DDPM's objective."
  - term: "reparameterization trick"
    definition: "Rewrite z ~ N(μ_φ(x), σ_φ(x)²) as z = μ_φ(x) + σ_φ(x) ⊙ ε with ε ~ N(0, I), so the randomness comes only from a parameter-free ε and gradients can flow through z back to the encoder."
    context: "L9 uses it to reduce the variance of VAE gradient estimates; L7's x_t = √ᾱ_t x₀ + √(1 − ᾱ_t) ε is the same trick."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-variational-inference-vae)

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

> **Version note**: This post is based on the Spring 2026 offering of [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/). The main sources are the [Lecture 8 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture8-diffusion-vae.pdf) (Diffusion Part II + Intro to VAEs, February 9) and the VAE part of the [Lecture 9 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture9-vae-icl.pdf) (February 11, taught by Matt Gormley; there is also an [inked version](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture9-vae-icl-ink.pdf)). The zero-shot/few-shot and prompting material in the second half of L9 is left for post 10. Readings follow the [schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html), which lists them under L8. All facts were checked against the official materials on 2026-09-30. Access level **A3**: slides, homework and the practice exam are public; lecture recordings are on CMU's Panopto and not viewable off campus.

**Series**: previous [L7: An introduction to diffusion models](/posts/ai/2026-09-30-cmu10423-diffusion-models-en) | next [HW2: Implementing DDPM from scratch](/posts/ai/2026-09-30-cmu10423-hw2-ddpm-en) | [Series overview](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en)

This is the steepest post in the series, so here is the intuition up front: **VAEs and diffusion models maximize the same kind of lower bound.** Both have latent variables, neither can compute log p_θ(x), and both push up a quantity that is computable and guaranteed to sit below log p_θ(x): the ELBO. That is the reason behind L7's advice to make the learned reverse step match q(x_{t−1} | x_t, x₀).

If probability and Gaussians feel shaky, read the prerequisites section of [Reading MIT 6.S184](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview-en) first. Every derivation below sits in a collapsible block, so you can skip them on a first pass.

## Course video sources

The course links Spring 2026 recordings through SCS Panopto. On 2026-10-10 the anonymous Panopto folder listed no videos and prompted sign-in. The course homepage and schedule link no public (YouTube) recordings; an instructor post dated 2026-04-08 said YouTube recordings were “coming very soon”, but no such link had appeared on the official pages when checked. This article follows the public slides and assignments; recording access is governed by course authorization.

Course and recording entries:

- [CMU 10-423/623/723 Spring 2026 — official Panopto recordings](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [cmu-10-423-generative-ai — official course materials and recording index](https://www.cs.cmu.edu/~mgormley/courses/10423/)

Checked: 2026-10-10.

## First half of L8: finishing diffusion

L8 opens by recapping L7's U-Net, the forward and reverse processes, the three properties and the three parameterizations. It then adds two things.

**Four versions of the training algorithm**: option A is shown first as "compute all T timesteps for each image, then update," then as "sample one random t per image." Option B predicts x₀. Option C predicts the noise ε, and the slides repeat that C is best empirically. Two slides show the training computation graph.

**The sampling algorithm**: start from x_T ~ N(0, I) and count down. At each step, draw fresh ε, compute the mean μ̂_t with the network, and set x_{t−1} = μ̂_t + σ_t ε. The three parameterizations differ only in how μ̂_t is computed: A outputs it directly, B predicts x₀ and combines, and C estimates x̂₀ from ε_θ and combines.

Then the slides return to the question L7 left open: why is "match q(x_{t−1} | x_t, x₀)" the right goal? Because DDPM's objective is itself an ELBO, and its L_{t−1} term is a KL divergence that wants the two conditional distributions to be as close as possible (slide 28, equations from [Ho et al. 2020](https://arxiv.org/abs/2006.11239)). Making sense of that requires variational inference, which is the job of the rest of L8 and L9.

## Seven things to prepare before VAEs

L8 and L9 show the same list:

1. Autoencoders (not the variational kind)
2. KL divergence
3. Variational inference (using KL as an objective)
4. Monte Carlo estimation (for approximating expectations)
5. (Score function trick)
6. Reparameterization trick (for variance reduction)
7. Stochastic Gradient Variational Bayes

Item 5 is in parentheses on the list, and the public handout PDF has no section slides for it, so this post doesn't cover it either.

## Why a plain autoencoder isn't enough

An autoencoder has an encoder z = ENCODER(x) and a decoder x' = DECODER(z), trained on the reconstruction loss ‖x − DECODER(ENCODER(x))‖² to learn a low-dimensional representation. The catch is that it **doesn't define a probability distribution**. Sampling from its latent space effectively just picks among reconstructions of training examples. A VAE instead learns a continuous latent space that is easy to sample from, so it can generate new data.

## How KL divergence behaves

KL(q ‖ p) = E_q[log q(x)/p(x)] measures how close two distributions are. It is not symmetric, and it is minimized when q = p. The slides use three examples to show what happens when KL(q ‖ p) is the objective:

- Where q puts high probability and p is low, KL increases a lot, so KL **insists** on good approximations where q is high.
- Where q puts low probability, a poor approximation barely matters. KL **doesn't care** about those regions.
- The third example takes a correlated 2D Gaussian p and asks which factorized q minimizes KL; the answer is shown as a figure.

This matters for variational inference: q tends to stay inside p's high-probability region rather than covering all of p.

## Variational inference: from KL to ELBO

Variational inference has four parts:

1. **Goal**: estimate the posterior p_θ(z | x), assumed intractable.
2. **Approximation**: use another distribution q_φ(z | x) ≈ p_θ(z | x). The mean field approximation, for example, factorizes q into independent pieces per variable.
3. **Optimization problem**: pick the q that minimizes KL(q ‖ p).
4. **Algorithm**: for example, gradient descent on a surrogate objective, the ELBO.

The trouble is that this KL can't be computed either. Expand it and log p(x) appears, which is exactly what we couldn't compute in the first place. Fortunately log p(x) doesn't depend on q. Dropping it doesn't change which q is best, and what remains, with the sign flipped, is the ELBO.

<details>
<summary>From KL to ELBO, and why the ELBO is a lower bound (L9 slides 22–25)</summary>

```text
KL(q(z|x) ‖ p(z|x))
  = E_q[log q(z|x)] − E_q[log p(z|x)]
  = E_q[log q(z|x)] − E_q[log p(x, z)] + E_q[log p(x)]
  = E_q[log q(z|x)] − E_q[log p(x, z)] + log p(x)     ← log p(x) does not depend on q

Define ELBO(q) = E_q[log p(x, z)] − E_q[log q(z|x)]

⇒ argmin_q KL = argmax_q ELBO
⇒ log p(x) = ELBO(q) + KL(q ‖ p) ≥ ELBO(q)            ← because KL ≥ 0
```

</details>

The slides read the ELBO's two terms this way: the first is high when q puts mass on the values of z where p puts mass; the second is q's entropy, which is high when q spreads its mass evenly. Three takeaways:

1. Variational inference finds the q that gives the tightest bound on the normalization constant of p(z | x).
2. Maximizing the ELBO is equivalent to minimizing the KL.
3. Maximizing the ELBO maximizes a lower bound on the likelihood p(x).

## Monte Carlo estimation and the reparameterization trick

The ELBO contains expectations. How do you compute them? With **Monte Carlo estimation**: draw S samples from p and average f over them. The slides' example estimates π with random points in the unit square; as S grows from 100 to 1,000,000 the error shrinks. The estimator is unbiased and its variance shrinks as σ²/S. The convergence rate doesn't depend on dimension, but σ² itself can be impractically large in high-dimensional problems.

The next problem: z is sampled from q_φ, and you can't backpropagate through a random sampling step. The **reparameterization trick** rewrites sampling as z = μ_φ(x) + σ_φ(x) ⊙ ε with ε ~ N(0, I), so z becomes a differentiable function of the parameters and the randomness comes from an independent ε. The slides draw the before-and-after computation graphs for 1D and multivariate Gaussians. Figure 4 of [Doersch 2016](https://arxiv.org/abs/1606.05908), which L9 reproduces, makes the same point: the network on the left has a non-differentiable sampling node and can't be trained by backprop; the one on the right can.

## The VAE: two networks, one objective

The VAE model: prior p_θ(z) = N(0, I); decoder p_θ(x | z), a Gaussian whose mean and variance come from an MLP; encoder q_φ(z | x), also a Gaussian whose mean and variance come from a neural network. The slides point out that θ and φ are neural network parameters, not the per-example variational parameters of classical variational inference.

The derivation is laid out as six problems and six solutions:

| Problem | Solution |
|---|---|
| 1. You can't sample from an autoencoder | Define a decoder p_θ(x \| z) you can sample from |
| 2. MLE with this decoder needs an intractable integral | Introduce an encoder q_φ(z \| x) and maximize the ELBO instead |
| 3. Alternating φ (inference) and θ (learning) is slow | Update θ and φ together with stochastic gradient ascent |
| 4. The ELBO's first expectation can't be computed | Monte Carlo estimation |
| 5. That estimate's gradient has very high variance (a known SGVB problem) | Reparameterize, then take the Monte Carlo estimate |
| 6. How to implement it | Take S = 1 sample per image, as below |

<details>
<summary>One VAE training step (L9 slide 53)</summary>

```text
Given a training image x^(i), take S = 1:
  ε^(1) ~ N(0, I)
  compute the encoder MLP outputs μ_φ(x) and σ_φ(x)
  z^(1) = μ_φ(x) + σ_φ(x) ⊙ ε^(1)
  ℓ(θ, φ) = log p_θ(x^(i) | z^(1)) − KL( q_φ(z | x^(i)) ‖ p_θ(z) )
  backprop through ℓ and update θ, φ
```

</details>

Here the ELBO is written as two terms: the reconstruction term E_q[log p_θ(x | z)] and a KL term that pulls the encoder toward the prior.

## What VAEs can do

The "VAE Results" section lists a few landmark works:

- **[Kingma & Welling 2014](https://arxiv.org/abs/1312.6114)** introduced VAEs and applied them to image generation. The encoder and decoder are fully connected networks with a single hidden layer, and the encoder is a Gaussian with diagonal covariance.
- **Bowman et al. 2015** applied VAEs to discrete text, with an LSTM encoder and an LSTM language model as the decoder.
- **VQ-VAE** (van den Oord et al.) learns a continuous codebook, but the encoder outputs discrete codes and the decoder generates conditioned on a code. The slides include an audio generation example.
- **VQ-VAE-2** (Razavi et al. 2019) learns two levels of latents (top and bottom) plus a strong prior over the latent space, producing convincing samples even at high fidelity. VQ-VAE comes back in the HW4 written questions.

The last slide places VAE and DDPM diagrams side by side and links back to the "GAN → VAE → Diffusion" comparison.

## Back to diffusion: DDPM's ELBO

With the ELBO in hand, L7's intuition can be stated precisely. Treat the diffusion model as a latent variable model with latents x₁…x_T, and the forward process as an encoder with **no learnable parameters**. The ELBO then breaks into roughly three kinds of terms: a prior term for x_T, an L_{t−1} term for each timestep, and a final reconstruction term.

- The prior term has no learnable parameters, since the noise schedule is fixed and p(x_T) = N(0, I).
- Each L_{t−1} is KL(q(x_{t−1} | x_t, x₀) ‖ p_θ(x_{t−1} | x_t)). This is L7's "match the closed-form posterior."
- When both sides are Gaussian and the variance is fixed at σ_t², this KL reduces to a squared distance between means. Switch to the ε parameterization and you get L7's option C loss, ‖ε − ε_θ(x_t, t)‖². The DDPM paper calls the version without the weighting the simplified objective.

<details>
<summary>The ELBO decomposition in the DDPM paper (Ho et al. 2020, eqs. 5, 8, 14)</summary>

```text
L = E_q[ KL(q(x_T | x_0) ‖ p(x_T))                           ← L_T
       + Σ_{t>1} KL(q(x_{t−1} | x_t, x_0) ‖ p_θ(x_{t−1} | x_t)) ← L_{t−1}
       − log p_θ(x_0 | x_1) ]                                 ← L_0

With Σ_θ = σ_t² I:
L_{t−1} = E_q[ ‖μ̃_t(x_t, x_0) − μ_θ(x_t, t)‖² / (2σ_t²) ] + C

With the ε parameterization and the weights dropped:
L_simple = E_{t, x_0, ε}[ ‖ε − ε_θ(√ᾱ_t x_0 + √(1 − ᾱ_t) ε, t)‖² ]
```

</details>

Question 6.1 of [HW2](/posts/ai/2026-09-30-cmu10423-hw2-ddpm-en), "ELBO Surgery" (5 points), asks you to prove a different breakdown of this ELBO yourself. This post does not provide a solution.

## Where these lectures show up in homework and exams

- HW2 (60 points total): question 5, VAEs, is worth 6 points (a Monte Carlo estimate of the reconstruction term, computing the loss of a video VAE, and β-VAE). Question 6, Understanding Diffusion Models, is worth 14 (ELBO Surgery, the role of L_t, reparameterization and more).
- Quiz 2 (February 16) covers L5–L9, but only the VAE part of L9.
- On the [practice exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf), question 7 (VAEs) and question 8 (Diffusion) are worth 8 points each, with [solutions](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf).

## How to self-study it

1. Start with [Jason Eisner's high-level explanation of variational inference](https://www.cs.jhu.edu/~jason/tutorials/variational.html) to get the intuition of approximating a hard p with an easy q.
2. Derive the four lines of "from KL to ELBO" above yourself, naming the probability rule used at each step.
3. Read [Doersch 2016](https://arxiv.org/abs/1606.05908), the VAE tutorial, next to the slides' six-step derivation table.
4. For the full math and mean field examples, read [Blei, Kucukelbir & McAuliffe 2018](https://arxiv.org/abs/1601.00670).
5. Write a minimal VAE on MNIST that implements the single step from slide 53. Then read eq. 5 of the DDPM paper against L7's option C.

## Further reading

- [Reading MIT 6.S184](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview-en) and [Lab 3: from DiT and VAE to latent diffusion](/posts/ai/2026-09-30-mit-6s184-lab-03-dit-vae-latent-diffusion-en), another mathematical language for diffusion and VAEs
- [Reading CMU 11-785: Variational autoencoders](/posts/ai/2026-08-22-cmu-11785-22-variational-autoencoders-en)
- [Reading Stanford CS231n: Generative Models I (VAEs and GANs)](/posts/ai/2026-09-30-cs231n-generative-models-vae-gan-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The login wall is confirmed (anonymous Panopto folder lists no videos and prompts sign-in); the official pages link no public YouTube version, so the status is unchanged.

## References

- [CMU 10-423/623/723 Generative AI homepage (Spring 2026)](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html): L8 and L9 dates, titles and readings
- [Lecture 8 slides: Diffusion Models (Part II) + Intro to VAEs](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture8-diffusion-vae.pdf)
- [Lecture 9 slides: VAEs + Zero-shot vs. Few-shot](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture9-vae-icl.pdf) and the [inked version](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture9-vae-icl-ink.pdf)
- [Coursework page](https://www.cs.cmu.edu/~mgormley/courses/10423/coursework.html) and [HW2 handout (zip)](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw2.zip): points for the VAE and diffusion questions
- [Practice exam (Spring 2026)](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf) and [solutions](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf)
- [Blei, Kucukelbir & McAuliffe, Variational Inference: A Review for Statisticians](https://arxiv.org/abs/1601.00670): schedule reading
- [Jason Eisner, High-Level Explanation of Variational Inference (2011)](https://www.cs.jhu.edu/~jason/tutorials/variational.html): schedule reading
- [Carl Doersch, Tutorial on Variational Autoencoders (2016)](https://arxiv.org/abs/1606.05908): schedule reading
- [Ho, Jain & Abbeel, Denoising Diffusion Probabilistic Models (NeurIPS 2020)](https://arxiv.org/abs/2006.11239): L7 reading and the source of L8's DDPM objective
- [Kingma & Welling, Auto-Encoding Variational Bayes (ICLR 2014)](https://arxiv.org/abs/1312.6114): cited in the slides' VAE Results section
