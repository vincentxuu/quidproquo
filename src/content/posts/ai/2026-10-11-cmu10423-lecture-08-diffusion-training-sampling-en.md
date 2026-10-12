---
title: "Diffusion Training and Sampling: Random Timesteps and Reverse Chains | CMU 10-423 Lecture 8"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 10
tldr: "Lecture 7 constructed noisy inputs and noise targets."
description: "A teaching guide based on public Spring 2026 materials: Diffusion Training and Sampling: Random Timesteps and Reverse Chains | CMU 10-423 Lecture 8"
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-11-cmu10423-lecture-08-diffusion-training-sampling)

**Video status: recordings require sign-in or course authorization.** This guide uses public slides and assignments; numerical examples are site-authored, not a lecture transcript.

Lecture 7 constructed noisy inputs and noise targets. Now we address the missing step: how does a predicted ε produce the next, less noisy sample? We connect training, three parameterizations, and reverse sampling through one calculable example. The lecture's closing VAE introduction is a bridge; the full ELBO and variational treatment belong to Lecture 9.

## Distinguish the predicted quantities

Noise parameterization predicts εθ(xₜ,t). Clean-data parameterization predicts x̂₀. Mean parameterization directly predicts the reverse Gaussian mean μθ. Given a fixed forward schedule, known coefficients relate them; they are not three unrelated model families.

Rearranging xₜ=√ᾱₜ x₀+√(1−ᾱₜ)ε gives x̂₀=(xₜ−√(1−ᾱₜ)εθ)/√ᾱₜ. But x̂₀ is an estimate of original data, not xₜ₋₁, the next reverse-chain state. Confusing them skips the definition of the sampling model.

## Calculate noise, clean data, and reverse mean together

Our original example uses α₁=α₂=0.8, giving ᾱ₁=0.8, ᾱ₂=0.64, and β₂=0.2. With x₀=2 and effective ε=1, x₂=2.2. If the network predicts εθ=1, then x̂₀=(2.2−0.6)/0.8=2.

The DDPM noise-parameterized mean is μθ=(xₜ−βₜ εθ/√(1−ᾱₜ))/√αₜ. Here it is (2.2−0.2/0.6)/√0.8≈2.0870. Although x̂₀=2, the reverse mean differs because this step predicts x₁ rather than directly returning x₀.

Check the result with the posterior mean: μ̃ₜ = [√ᾱₜ₋₁ βₜ/(1−ᾱₜ)]x₀ + [√αₜ(1−ᾱₜ₋₁)/(1−ᾱₜ)]xₜ. Both coefficients are approximately 0.4969, giving 0.4969×4.2≈2.0870.

The posterior variance is β̃₂=β₂(1−ᾱ₁)/(1−ᾱ₂)=1/9. A sampler choosing this fixed variance and drawing z=0.3 produces x₁≈2.1870. This z is new reverse-sampling randomness, not the ε used to create x₂. The DDPM paper also discusses other fixed variance choices; state the choice explicitly.

## Training samples a timestep; generation traverses the chain

A training example selects clean data x₀, samples t and ε, constructs xₜ directly, and compares prediction with target. Batch elements may use different timesteps. Each update need not execute complete forward and reverse chains. Timestep sampling and loss weighting together determine the emphasis placed on noise scales.

Generation draws x_T and repeatedly calls the model at T,T−1,…,1. The final step typically adds no fresh noise. A schedule whose terminal distribution is insufficiently Gaussian also creates a mismatch when sampling starts from a standard Gaussian. Our two-step schedule illustrates arithmetic, not a high-quality image-generation setup.

## Convertible predictions do not imply identical objectives

At fixed t, ε and x₀ predictions are linearly related. Their errors scale as x̂₀−x₀ = −√((1−ᾱₜ)/ᾱₜ)(εθ−ε). Uniformly weighted x₀ MSE therefore weights timesteps differently from uniformly weighted ε MSE.

DDPM's variational objective includes time-dependent terms and coefficients. The simplified noise MSE is not term-by-term identical to the complete ELBO. If an implementation changes its prediction target, weighting, or variance, matching output shapes is insufficient: the model and sampler must agree on these definitions.

## Variations with answers

Set εθ=0.5 in our example. Then x̂₀=2.375 and μθ≈2.2733. Underestimating noise raises both the clean-data estimate and the reverse mean, but they remain different quantities.

With ᾱₜ=0.64 and noise-prediction error 0.5, the clean-data error magnitude is √(0.36/0.64)×0.5=0.375. Its squared error is 0.140625. Understanding this scale is essential for comparing parameterizations and loss weights. Next, VAE develops another latent-variable model and its variational bound.

[Previous](/posts/ai/2026-09-30-cmu10423-diffusion-models-en) | [Next](/posts/ai/2026-10-11-cmu10423-lecture-09-vae-en) | [Series overview](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en)

## Course Video Sources

The official recording index is on SCS Panopto. The anonymous folder view is unloaded and requests sign-in; this is an access limitation, not evidence that recordings do not exist. Original audio and subtitles require the appropriate course access.

- [Official Panopto recording index](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [Official course homepage](https://www.cs.cmu.edu/~mgormley/courses/10423/)

## References

- [Lecture 8 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture8-diffusion-vae.pdf)
- [DDPM equations 4, 7, 11 and Algorithms 1–2](https://arxiv.org/abs/2006.11239)
- [DDPM official implementation](https://github.com/hojonathanho/diffusion)
