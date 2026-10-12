---
title: "Diffusion and VAEs: Related Objectives, Different Generation Paths | CMU 10-423 Topic Guide"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai, vae, variational-inference, elbo, diffusion-model]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 41
tldr: "Diffusion and VAEs share probabilistic ideas without sharing the same generation procedure. Diffusion chains noise steps; a VAE approximates a latent posterior with an encoder and reconstructs through a decoder. This guide connects those ideas while directing each mechanism to its own lesson."
description: "Diffusion and VAEs share probabilistic ideas without sharing the same generation procedure. Diffusion chains noise steps; a VAE approximates a latent posterior with an encoder and reconstructs through a decoder. This guide connects those ideas while directing each mechanism to its own lesson."
draft: false
glossary:
  - term: "ELBO"
    aliases: ["Evidence Lower BOund"]
    definition: "ELBO(q) = E_q[log p(x, z)] − E_q[log q(z | x)]. Its gap to log p(x) is KL(q(z | x) ‖ p(z | x)). Maximizing ELBO minimizes this posterior KL when p is fixed and only q is optimized. Joint VAE training also changes p and log p(x), so that equivalence alone does not describe the full optimization."
    context: "10-423 L9 uses it to train VAEs; L8 uses it to derive DDPM's objective."
  - term: "reparameterization trick"
    definition: "Rewrite z ~ N(μ_φ(x), σ_φ(x)²) as z = μ_φ(x) + σ_φ(x) ⊙ ε with ε ~ N(0, I), so the randomness comes only from a parameter-free ε and gradients can flow through z back to the encoder."
    context: "L9 uses it to reduce the variance of VAE gradient estimates; L7's x_t = √ᾱ_t x₀ + √(1 − ᾱ_t) ε is the same trick."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-variational-inference-vae)

**Video status: recordings require login or course authorization.** [Recording source](#course-video-sources)

Diffusion and VAEs share probabilistic ideas without sharing the same generation procedure. Diffusion chains noise steps; a VAE approximates a latent posterior with an encoder and reconstructs through a decoder. This guide connects those ideas while directing each mechanism to its own lesson.

## Choose a lesson

- [Diffusion basics](/posts/ai/2026-09-30-cmu10423-diffusion-models-en): work through its mechanism, example, and answer criteria.
- [Training and sampling](/posts/ai/2026-10-11-cmu10423-lecture-08-diffusion-training-sampling-en): work through its mechanism, example, and answer criteria.
- [VAE and variational inference](/posts/ai/2026-10-11-cmu10423-lecture-09-vae-en): work through its mechanism, example, and answer criteria.

The [course map](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en) lists the core path. This page is a topic guide, not an additional lecture. Choose the question you need to answer and follow its lesson.

## A worked comparison

Teaching example: let x0=2, alpha-bar=0.25, and epsilon=0. Forward diffusion gives xt=1. Correctly predicting zero noise lets us recover x0=2. For a separate VAE, let the encoder produce mu=1 and sigma=0.5. Reparameterization with epsilon=0 gives z=1; a toy decoder D(z)=2z reconstructs 2. Identical outputs do not make the latent variables equivalent: diffusion requires a timestep and schedule; the VAE requires a posterior, prior, and KL term.

## Check your understanding

Does reconstructing this one input prove both models learned the same distribution?

<details>
<summary>Answer and criterion</summary>

No. One reconstruction does not test the full generated distribution, and the models use different objectives, random variables, and sampling paths. A shared evaluation set and explicit distribution or quality metrics are needed.

</details>

## How to use this map

Before reading the answer, identify the inputs, what changes, and the outputs. Then complete the linked lesson’s variation. If two mechanisms seem identical, trace where their conditions or data paths diverge. This page checks relationships and boundaries; it does not replace the derivations, implementations, or evaluations in the individual lessons.

The source edition is Spring 2026. Teaching examples are not official assessments or reconstructed classroom speech. Recordings remain subject to course authorization.

## Course video sources

The [official Spring 2026 course site](https://www.cs.cmu.edu/~mgormley/courses/10423/) directs recordings to SCS Panopto. On 2026-10-12, the anonymous reader returned an unloaded folder and a sign-in prompt; it did not provide playable lecture content. This establishes an access limit, not the absence of recordings. This guide uses public written materials and provides no reconstructed classroom speech or original-audio transcript.

- [Official recording folder](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)

## Update Log

- 2026-10-11: Rebuilt the teaching scope, worked example, and self-check; retained the original URL and publication date.

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
