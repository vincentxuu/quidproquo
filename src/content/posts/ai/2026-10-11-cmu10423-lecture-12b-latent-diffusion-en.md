---
title: "Latent Diffusion: What Compression and Text Conditioning Do | CMU 10-423 Lecture 12"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 18
draft: false
description: "A complete worked example and answered variations for Latent Diffusion: What Compression and Text Conditioning Do."
---

> 🌏 [中文版](/posts/ai/2026-10-11-cmu10423-lecture-12b-latent-diffusion)

**Video status: recordings require login or course authorization.** [Sources](#course-video-sources)

This guide follows [CMU 10-423](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 public slides. Worked examples are original teaching additions.

## Separate two data paths

[Latent diffusion](https://arxiv.org/abs/2112.10752) denoises in a compressed representation, while text conditioning specifies what to generate. The autoencoder reduces spatial cost; a text encoder represents the prompt. Review [diffusion](/posts/ai/2026-09-30-cmu10423-diffusion-models-en) and [VAEs](/posts/ai/2026-10-11-cmu10423-lecture-09-vae-en). The goal is to trace training and generation and identify when a real image is available.

An autoencoder maps x through E to z₀ and reconstructs D(E(x)). Compression can discard details; reconstruction losses and regularization determine what survives. Latent diffusion typically fixes this autoencoder, adds noise to z₀, and trains εθ(z_t,t,c) to predict it. The text embedding c enters the denoiser; merely sending text to an image decoder does not establish text control.

## Shapes and one coordinate

This original teaching setup is not a product specification. A 32×32×3 image becomes an 8×8×4 latent after fourfold downsampling per spatial dimension. The image has 3072 values and the latent 256. Spatial positions shrink sixteenfold, but total values shrink twelvefold because channels change. Neither ratio is automatically the overall memory or speed improvement.

Take one latent coordinate z₀=2, ᾱ_t=0.64, and noise ε=−1. Then z_t=0.8·2+0.6·(−1)=1. Let the text describe a small red bird. If the denoiser predicts ε̂=−0.5, squared noise error is 0.25 and ẑ₀=(1−0.6·(−0.5))/0.8=1.625. This is one timestep's estimate, not a completed image or permission to skip the remaining sampling steps.

## Training sees images; generation starts with noise

Training encodes a real image and samples t and ε. One image supplies targets at many noise levels. Generation has no z₀: sample z_T, repeatedly denoise on a chosen schedule, then decode with D. Model parameters normally stay fixed during generation. Whether a step adds fresh noise depends on the sampler; one DDPM update is not the only diffusion procedure.

Hold seed fixed and change c to test conditioning. Hold text fixed and change seed to examine diversity. Keep sampler and step count controlled. If the autoencoder already blurs small text, more denoising steps cannot guarantee recovery of the lost detail. Evaluate the representation bottleneck and generative model separately.

## Text-to-image has other architectures

Lecture 12 also covers other routes, including autoregressive image tokens and pixel-space diffusion. They are not all LDMs. Latents specify representation, diffusion specifies learning and sampling, and cross-attention specifies a conditioning mechanism. These dimensions can be combined differently. The next [VLM guide](/posts/ai/2026-10-11-cmu10423-lecture-13-vision-language-en) asks how to read an image rather than generate one.

## Check your understanding

Twofold spatial downsampling with four channels yields 16×16×4=1024 values, only a threefold reduction from the original image. Predicting ε=−1 exactly recovers z₀=2 in the numerical example. If generation begins by encoding the target image, the task may be reconstruction or image-to-image, not pure text-to-image. State the inputs explicitly before interpreting an evaluation.

## Course video sources

The [official Spring 2026 course site](https://www.cs.cmu.edu/~mgormley/courses/10423/) directs recordings to SCS Panopto. On 2026-10-12, anonymous retrieval returned an unloaded folder and a sign-in prompt, without playable classroom content. This establishes an access limit, not the absence of recordings. This guide uses public slides and linked primary papers; examples are original teaching additions, not a transcript. [Official recording folder](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22).

## References

- [CMU 10-423 Spring 2026 Lecture 12 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture12-dpo-text2img.pdf)
- [Primary paper](https://arxiv.org/abs/2112.10752)
- [Official schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
