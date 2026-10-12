---
title: "Video Generation: Modeling the Time Axis | CMU 10-423 Lecture 25"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 30
description: "Video Generation: Modeling the Time Axis | CMU 10-423 Lecture 25"
draft: false
---

> [繁體中文版](/posts/ai/2026-10-11-cmu10423-lecture-25-video-generation)

**Video status: recordings require login or course authorization.** This guide uses the public slides for Lecture 25 of CMU 10-423 Spring 2026. Worked examples and variations are teaching additions.

Generating separate images of “a red ball rolling right” can yield attractive frames but changing colors, sizes, or positions. Video generation must model relationships between frames as well as individual images. Repeating an image generator does not automatically produce stable motion.

Prerequisites are [diffusion training and sampling](/posts/ai/2026-10-11-cmu10423-lecture-08-diffusion-training-sampling-en) and [conditional attention and DiT](/posts/ai/2026-10-11-cmu10423-lecture-14-cross-attention-dit-en). Audio generation is not required. Action-conditioned world models are evaluated separately.

## Adding time changes the problem

Images have shape `(B,H,W,C)`; videos add time: `(B,T,H,W,C)`. A 3D convolution spans local spatial and temporal neighborhoods. Its temporal receptive field still depends on kernels, depth, and downsampling; an extra dimension does not provide unlimited long-term understanding.

Full attention treats all `T×H×W` positions as tokens, producing a quadratic number of scores. Factorized attention instead alternates spatial interaction within frames and temporal interaction at corresponding spatial positions. Stacking these layers permits information to travel across space and time, but one temporal layer directly connects only the same spatial position. This is not equivalent to one unrestricted attention layer.

## A complete reshape example

Take an illustrative latent `(B,T,H,W,C)=(2,3,2,2,4)`, containing 96 scalars. Spatial attention reshapes it to `(B×T,H×W,C)=(6,4,4)`: six frames, four tokens each. Each single-head score matrix is `(4,4)`, for 96 score entries total.

Restore `(2,3,2,2,4)`, then **permute axes** so that the three time points at each location are adjacent. Temporal attention receives `(B×H×W,T,C)=(8,3,4)`: eight sequences, each with a `(3,3)` score matrix, giving 72 entries. The two stages use 168 score entries, compared with `2×12²=288` for full attention over each 12-token video.

This counts single-head score entries, not complete-model FLOPs or peak GPU memory. A raw reshape without the correct permutation can combine different locations into a false temporal sequence. The scalar count remains correct while the meaning is corrupted.

## Video time and diffusion time differ

Video diffusion corrupts a clean video or latent and learns denoising conditioned on noise level, text, or other inputs. Frame index three and denoising step three are different variables. One denoising step can update the entire clip; reverse diffusion reduces noise rather than playing frames sequentially.

Video LDM models compressed spatial latents and adds temporal modules, allowing existing image-model capabilities to contribute. Joint image/video training can use images for appearance and videos for temporal relationships. Temporal branches and masks must handle one-frame samples correctly. Image quality alone cannot demonstrate learned motion.

Conditions can include a first frame, observed intermediate frames, or text. Continuation and interpolation constrain generation with known content. Reconstruction guidance is one way to incorporate such constraints during sampling, not a guarantee of correct physics. DiT and spatiotemporal patches change the backbone and representation without automatically eliminating temporal drift.

## Variations and evaluation

Double T to six. Spatial input becomes `(12,4,4)` and temporal input `(8,6,4)`. Their single-head score counts are 192 and 288, totaling 480. Full attention uses `2×24²=1152`. Temporal attention still grows quadratically with T; factorization does not make every cost linear in clip length.

Suppose the ball retains its color but jumps back to its starting point. Has the video passed? No: color consistency tests appearance, while positional continuity tests temporal behavior. Use short sequences with known starting positions and directions, track location and size through occlusion, and compare multiple seeds rather than selecting the best clip.

A video VLM reads clips and answers questions; it is not the video generator itself. Even coherent rightward motion does not prove that a “move left” action changes the trajectory. That requires the intervention test in the world-model guide.


## Continue reading

- [Previous](/posts/ai/2026-10-11-cmu10423-lecture-24-audio-understanding-generation-en)
- [Next](/posts/ai/2026-10-11-cmu10423-lecture-26-world-models-alignment-en)

## Course video sources

The official [course homepage](https://www.cs.cmu.edu/~mgormley/courses/10423/) provides a Panopto recording link; access requires login or course authorization. This is a slide-based guide; it does not include a recording transcript, captions, or original-audio shadowing material.

## References

- [CMU Lecture 25 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture25-video.pdf)
- [Video Diffusion Models](https://arxiv.org/abs/2204.03458)
- [Video LDM](https://arxiv.org/abs/2304.08818)
