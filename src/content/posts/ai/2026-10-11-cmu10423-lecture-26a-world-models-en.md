---
title: "World Models: How Actions Change Predicted Futures | CMU 10-423 Lecture 26"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 35
description: "World Models: How Actions Change Predicted Futures | CMU 10-423 Lecture 26"
draft: false
---

> [繁體中文版](/posts/ai/2026-10-11-cmu10423-lecture-26a-world-models)

**Video status: recordings require login or course authorization.** This guide uses the public slides for Lecture 26 of CMU 10-423 Spring 2026. Worked examples and variations are teaching additions.

A convincing video may not let you choose where its character goes. A world model asks an additional question: from the same current state, what changes if we take a different action? This connects prediction to planning and control.

Prerequisites are [temporal modeling](/posts/ai/2026-10-11-cmu10423-lecture-25-video-generation-en) and [state updates](/posts/ai/2026-10-11-cmu10423-lecture-21-state-space-models-en). We separate the world-model deck's three representations: 3D scenes, interactive video, and latent prediction. The separate alignment deck has its own guide.

## State, observation, and action

An idealized transition is `p(s_next | s, a)`. Camera images are observations, not necessarily complete states: they may hide objects, velocity, or friction. Models often need history or a latent/belief representation of uncertainty. One image does not always determine the future.

Different actions from the same history should produce distinguishable, semantically appropriate futures. Stochastic environments may require distributions rather than point predictions. The key is a reliable intervention effect over multiple steps.

## Three representations, three tests

3D representations emphasize geometry and viewpoint consistency. NeRF predicts color and density from position and viewing direction, then renders along rays. Gaussian splatting uses explicit Gaussian primitives. Static scene reconstruction supports new views but does not establish dynamics under force. Connecting generative priors to 3D optimization, as in DreamFusion, does not automatically produce controllable physics.

Interactive video models predict frames conditioned on visual history and actions. Genie combines a video tokenizer, a latent action model (LAM), and a dynamics model. LAM infers discrete actions from adjacent frames; dynamics predicts new video tokens from past tokens and an action. Training LAM can use the next observed frame because it is inferring a past transition. At generation time that future frame is unavailable: a user or policy supplies the latent action. Reusing the retrospective inference as an input would leak the future.

Latent prediction need not reconstruct every pixel. V-JEPA-style learning predicts representations rather than all visual details. Predicting masked video latents and planning with actions remain different capabilities; V-JEPA 2 includes a separate action-conditioned component involving robot data. Planning requires informative observations, action semantics, and rollout evaluation, not merely a latent representation.

## Two futures in one corridor

Consider an illustrative five-cell corridor with position x in 0–4 and actions −1, 0, +1. Let `x_next=clip(x+a,0,4)`. From x=2, +1 gives 3 and −1 gives 1. Repeated +1 produces 2→3→4→4; repeated −1 produces 2→1→0→0. Boundary handling matters.

A geometry test asks whether two views of x=2 represent the same object at the same location. An interactive-video test fixes the initial image and checks whether changing the action changes movement direction. A latent test encodes `z=x/4`: x=2 is .5, and a rightward rollout predicts .75→1→1, decoded as 3→4→4. Can a planner select the action sequence reaching the right endpoint? These tests share an environment but establish different properties.

A model that ignores actions and predicts `x_next=x` may reconstruct stationary clips well while immediately failing the intervention test. A model with a correct first step but a third step through the wall also fails multi-step use. Track one-step error, boundary violations, and goal achievement separately.

## Latent codes are not keyboard labels

Genie's LAM learns without original action annotations. Codes can capture directions or jumps, but code 0 is not guaranteed to mean “left.” Code numbering can permute across training runs, and non-action factors may enter the representation. In transferring to real environment controls, the paper uses a small amount of action-labeled data to map latent codes to real actions. Learning controllable latents from unlabeled video is not the same claim as never needing an action mapping.

Variation: begin at x=4 and take +1 twice. The answer is 4→4→4. Taking −1 then +1 gives 4→3→4. If the “right” latent also changes the background color, control and appearance may be entangled. Test the same code across starting scenes before asserting consistent action semantics. Attractive frames cannot fill this evidence gap.


## Continue reading

- [Previous](/posts/ai/2026-10-11-cmu10423-lecture-25-video-generation-en)
- [Next](/posts/ai/2026-10-11-cmu10423-lecture-26b-science-of-alignment-en)

## Course video sources

The official [course homepage](https://www.cs.cmu.edu/~mgormley/courses/10423/) provides a Panopto recording link; access requires login or course authorization. This is a slide-based guide; it does not include a recording transcript, captions, or original-audio shadowing material.

## References

- [CMU Lecture 26 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture26-world-models.pdf)
- [Genie](https://arxiv.org/abs/2402.15391)
- [NeRF](https://arxiv.org/abs/2003.08934)
- [V-JEPA 2](https://arxiv.org/abs/2506.09985)
