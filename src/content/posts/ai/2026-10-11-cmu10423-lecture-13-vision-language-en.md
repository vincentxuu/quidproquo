---
title: "Vision-Language Models: Turning Images into Language-Model Inputs | CMU 10-423 Lecture 13"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 19
draft: false
description: "A complete worked example and answered variations for Vision-Language Models: Turning Images into Language-Model Inputs."
---

> 🌏 [中文版](/posts/ai/2026-10-11-cmu10423-lecture-13-vision-language)

**Video status: recordings require login or course authorization.** [Sources](#course-video-sources)

This guide follows [CMU 10-423](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 public slides. Worked examples are original teaching additions.

## An image is not a text token

A vision-language model (VLM) answers questions using images and text. A typical system extracts visual representations, bridges them into the language model's embedding space, and generates an answer. This differs from [latent diffusion](/posts/ai/2026-10-11-cmu10423-lecture-12b-latent-diffusion-en), which generates images. Review [ViT patches](/posts/ai/2026-09-30-cmu10423-cnn-bert-vit-en). We will track token count, embedding width, and where visual information can be lost.

[LLaVA](https://arxiv.org/abs/2304.08485) illustrates visual features connected to a language model and adapted with instruction data. The encoder extracts information, the projector aligns representations, and the LLM generates from visual and textual context. Correct dimensions alone do not establish semantic alignment; training supplies that signal.

## Follow the shapes through one image

In our original setup, an 8×8 RGB image uses 4×4 patches, producing four patches. Flattening each yields 48 values, mapped to width-six visual embeddings: a 4×6 feature matrix. A 6×8 projector produces 4×8 features compatible with a width-eight LLM. A three-token question conceptually gives seven input positions; real systems can add separators or special tokens.

Ask what color appears in the top-left corner. If that patch contains a red square, the encoder must preserve both content and location. Averaging all patches into one vector can mix locations. A projector changes width but cannot recreate details already discarded by the encoder. Higher resolution, multiple crops, and more visual tokens trade additional cost for retained information.

## Contrastive learning and answer generation differ

CLIP-style contrastive learning brings paired image and text representations closer for retrieval and similarity. It is not itself an autoregressive conversational model. Such representations can serve as a visual backbone connected to an LLM, while captions and visual instructions teach generation. “A red square in the top left” supervises different information from “something red.” Both are text, but their granularity differs.

State which modules are frozen. Training only the projector lowers trainable-parameter cost and depends heavily on what the backbone preserves. Unfreezing visual or language components expands adaptation capacity and cost and can cause forgetting. Frozen parameters can still sit on a required gradient path to earlier trainable modules.

## One correct answer is insufficient

If most dataset answers are “red,” a model may ignore images. Hold the question fixed while moving the red square to the bottom right, replacing it with blue, and masking the relevant patch. Test whether the answer follows the image. An unchanged answer may reflect language priors, failed conditioning, or missing visual information; further localization is needed before blaming a layer.

## Check your understanding

Using 2×2 patches produces sixteen patches and nineteen total positions before special tokens. Projecting width six to eight does not change sixteen tokens into eight; it changes each token's width. If changing the image leaves logits exactly unchanged, first verify the image tensor enters forward, then inspect the conditioning path. Continue to [cross-attention](/posts/ai/2026-10-11-cmu10423-lecture-14-cross-attention-dit-en).

## Course video sources

The [official Spring 2026 course site](https://www.cs.cmu.edu/~mgormley/courses/10423/) directs recordings to SCS Panopto. On 2026-10-12, anonymous retrieval returned an unloaded folder and a sign-in prompt, without playable classroom content. This establishes an access limit, not the absence of recordings. This guide uses public slides and linked primary papers; examples are original teaching additions, not a transcript. [Official recording folder](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22).

## References

- [CMU 10-423 Spring 2026 Lecture 13 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture13-vlm.pdf)
- [Primary paper](https://arxiv.org/abs/2304.08485)
- [Official schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
