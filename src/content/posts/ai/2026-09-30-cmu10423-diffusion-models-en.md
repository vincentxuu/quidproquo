---
title: "Diffusion Models: Why Adding Noise Creates a Training Task | CMU 10-423 Lecture 7"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai, diffusion-model, deep-learning]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 9
tldr: "A GAN learns from a discriminator."
description: "A teaching guide based on public Spring 2026 materials: Diffusion Models: Why Adding Noise Creates a Training Task | CMU 10-423 Lecture 7"
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-diffusion-models)

**Video status: recordings require sign-in or course authorization.** This guide uses public slides and assignments; numerical examples are site-authored, not a lecture transcript.

A GAN learns from a discriminator. Diffusion instead defines a process that gradually destroys data and learns conditional distributions in the reverse direction. “Remove noise” is only a starting intuition: you must distinguish the forward inputs, the training target, and the starting point of generation. Reverse means and parameterizations belong to the next guide.

Prerequisites are Gaussian randomness, squared error, and directed conditional models. Images are vectors of real-valued pixels; a scalar example makes the mechanism easier to inspect. All numbers below are original teaching examples.

## The forward chain scales signal and adds randomness

One step is xₜ=√αₜ xₜ₋₁+√(1−αₜ)εₜ, with αₜ=1−βₜ and standard Gaussian εₜ. It does not simply add a fixed noise value: it also shrinks the previous signal so that sufficiently many steps can approach a standard Gaussian distribution.

Set x₀=2, α₁=α₂=0.8, ε₁=1, and ε₂=−1. Then x₁≈2.2361 and x₂≈1.5528. A particular noisy trajectory need not monotonically approach zero. The signal fraction of a distribution differs from the numerical value of one random sample.

Expanding the two steps gives x₂=0.8x₀+0.4ε₁+√0.2 ε₂. Independent noise contributions have variance 0.16+0.2=0.36, so the conditional distribution can be sampled as x₂=0.8x₀+0.6ε using a single standard Gaussian ε.

The effective ε for the specific trajectory above is approximately −0.0787. It is not the second-step draw −1; it combines both noise draws. Confusing per-step noise with the aggregate noise in the closed-form expression produces an incorrect training target.

## Sample any timestep directly

Define ᾱₜ as the product α₁⋯αₜ. Then xₜ=√ᾱₜ x₀+√(1−ᾱₜ)ε. This follows from expanding a linear Gaussian chain and avoids executing all preceding steps for each training input. In our example ᾱ₂=0.64, giving coefficients 0.8 and 0.6.

The timestep is essential. The same noisy value can occur under different noise levels, so the denoiser needs information about the current signal/noise ratio. Networks commonly encode t into an embedding and inject it into their layers.

## Predicting noise creates a supervised objective

Training samples x₀ from data, samples t and ε, and constructs xₜ. The network εθ(xₜ,t) predicts the aggregate noise used in that construction. The simplified MSE objective used in the DDPM paper compares predicted and actual ε, usually averaging over batch and spatial coordinates. Assignment 2 specifies an L1 loss, so do not substitute this paper objective for its instructions.

For x₀=2, ᾱₜ=0.64, and ε=1, we obtain xₜ=2.2. A prediction εθ=0.5 gives scalar MSE 0.25; a prediction of one gives zero for this example. Targets are available because we sampled the noise ourselves, without human labels for every noisy image.

However, the same noisy value may originate from different clean values and noise draws. A model cannot uniquely identify every originating pair from that value alone. The squared-error optimum relates to a conditional expectation; solving one toy example does not establish perfect reconstruction everywhere.

## Generation starts elsewhere

Training knows x₀ so it can create inputs and labels. Generation has no clean target image and starts from approximately standard Gaussian x_T, repeatedly using learned reverse transitions. Noising an existing training image and recovering it is not the same experiment as unconditional generation.

Without x₀, predicted noise is a learned reverse signal compatible with the data distribution, not direct knowledge of a historical draw. The schedule, sampling steps, and model error all affect results. The next guide converts noise predictions into reverse means, rather than treating a simple subtraction as the complete DDPM algorithm.

## Variations with answers

Keep x₀=2 and ᾱ=0.64 but draw ε=−1. Then xₜ=1. A prediction of 0.5 has MSE 2.25; predicting −1 has zero error. The label must match this draw, even when the clean input and timestep remain fixed.

With α₁=0.9 and α₂=0.8, ᾱ₂=0.72. The signal coefficient is about 0.8485 and aggregate noise standard deviation about 0.5292. Adding β values directly would incorrectly give variance 0.3 instead of 0.28. These coefficients are the bridge to the training and sampling calculations in Lecture 8.

[Previous](/posts/ai/2026-09-30-cmu10423-gans-en) | [Next](/posts/ai/2026-10-11-cmu10423-lecture-08-diffusion-training-sampling-en) | [Series overview](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en)

## Course Video Sources

The official recording index is on SCS Panopto. The anonymous folder view is unloaded and requests sign-in; this is an access limitation, not evidence that recordings do not exist. Original audio and subtitles require the appropriate course access.

- [Official Panopto recording index](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [Official course homepage](https://www.cs.cmu.edu/~mgormley/courses/10423/)

## References

- [Lecture 7 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture7-diffusion.pdf)
- [Denoising Diffusion Probabilistic Models](https://arxiv.org/abs/2006.11239)
- [Nonequilibrium Thermodynamics](https://arxiv.org/abs/1503.03585)
- [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Lecture 8 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture8-diffusion-vae.pdf)
- [schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
- [practice exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)
- [solutions](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf)
- [Coursework page](https://www.cs.cmu.edu/~mgormley/courses/10423/coursework.html)
- [HW2 handout (zip)](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw2.zip)
- [Ho, Jain & Abbeel, Denoising Diffusion Probabilistic Models (NeurIPS 2020)](https://proceedings.neurips.cc/paper/2020/hash/4c5bcfec8584af0d967f1ab10179ca4b-Abstract.html)
