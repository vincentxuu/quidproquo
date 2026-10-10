---
title: "NTU ML 2026 HW4: Drawing Pokémon with Next-Token Prediction on a Decoder-Only Transformer"
date: 2026-09-30
category: ai
type: guide
tags: [ntu-ml-2026, ai-course, course-guide, homework, transformer, image-generation, pytorch]
lang: en
series:
  name: "Reading NTU Hung-yi Lee Machine Learning 2026 Spring"
  order: 10
tldr: "HW4 moves next-token prediction from text to images unchanged: 792 Pokémon sprites at 20×20, each pixel one of 167 color tokens, so one image is a 400-token sequence. Training is next-token prediction; at test time you get the first 60% of an image and the model draws the rest. Grading checks FID and a Pokémon Detection Rate (PDR) together, and the three baseline hints go from \"run the sample code\" to \"tune hyperparameters\" to \"switch to Llama or Mistral\". The spec, Colab, Kaggle notebook and dataset are public, but JudgeBoi returned 502 on 2026-09-30, so outside readers cannot get official FID or PDR scores."
description: "A guide to HW4 \"Training Transformers\" of NTU Machine Learning 2026 Spring (Hung-yi Lee): task design, 792 Pokémon images and a 167-color colormap, the 632/80/80 split, completing an image from its first 60%, the FID and PDR metrics, simple/medium/strong baseline hints and hyperparameter ranges, the Colab's GPT-2 config and checkpoint strategy, submission rules, and how to self-check without the grader."
draft: false
glossary:
  - term: "FID"
    aliases: ["Fréchet Inception Distance"]
    definition: "Extracts Inception v3 features from real and generated images and measures the Fréchet distance between the two feature distributions (means and covariances); lower means the generated distribution is closer to the real one."
    context: "One of HW4's two metrics, with baseline thresholds of FID ≤ 86 / 80 / 73."
  - term: "PDR"
    aliases: ["Pokémon Detection Rate"]
    definition: "The share of generated images that a TA-trained classifier judges to be a Pokémon."
    context: "HW4 requires FID and PDR to pass their thresholds at the same time."
---

> 🌏 [中文版](/posts/ai/2026-09-30-ntu-ml2026-hw4-training-transformer)

**This guide covers HW4 of [NTU Machine Learning 2026 Spring by Hung-yi Lee](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php).** It is part 10 of the [Reading NTU Hung-yi Lee Machine Learning 2026 Spring](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en) series. The previous part, [Positional Embedding](/posts/ai/2026-09-30-ntu-ml2026-positional-embedding-en), explained how a model knows token order. This assignment has you train a decoder-only Transformer yourself, on images instead of text.

The course page lists HW4 as released on 3/27 and due 04/16/2026 23:59, with TAs 劉建蘴, 馮柏翰 and 陳品睿. Official materials:

- The spec [hw4.pdf](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/hw4.pdf) (26 slides; the cover says "Slide Credit: ML2025 spring HW4")
- The [Colab sample code](https://colab.research.google.com/drive/1G9CgvnhqQ5AwHc6nbVzVGCoe-xUXdSWB?usp=sharing) (40 cells) and the [Kaggle version](https://www.kaggle.com/code/stevenlunar/ml2026-spring-hw4-training-transformer) listed on the course page
- The TA walkthrough video [ML 2026 Spring HW4 -- Training Transformers](https://youtu.be/QrqdoGf35Iw)

Access level: the spec, sample code and dataset are all public, which makes this **A3**. What is missing is the grading chain, covered below.

## Course video sources

These course video sources were already documented in this article. Playback has not been reverified for each video; no timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=QrqdoGf35Iw
title: Video: ML 2026 Spring HW4 -- Training Transformers
```

Original videos: [Video: ML 2026 Spring HW4 -- Training Transformers](https://www.youtube.com/watch?v=QrqdoGf35Iw)

Course and recording entries:

- [Official course and recording entry](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php)

## The task: an image as a sequence of tokens

Slide 3 of hw4.pdf states the goal: use a transformer decoder-only model for next-token prediction on Pokémon images, and learn how current LM architectures predict the next token.

The data design is clean (slides 7–9):

| Item | Value |
|---|---|
| Images | 792 small Pokémon sprites |
| Split | train 632, validation 80, test 80 |
| Size | 20 × 20 = 400 pixels |
| Vocabulary | 167 colors, one token per pixel; a colormap maps tokens to RGB, e.g. token 0 is white |

In training, each image is flattened into a 400-token sequence and the model predicts the next token, exactly like a language model. At test time you get the first 60% of an image and the model generates the rest (slides 5–6).

The Colab's `PixelSequenceDataset` spells this out. In train mode the input is `sequence[:-1]` and the labels are `sequence[1:]`. In dev mode the input is `sequence[:-160]` and the labels are the last 160 tokens, which is 40% of 400. The data loads from Hugging Face as `lca0503/ml2025-hw4-pokemon` and `lca0503/ml2025-hw4-colormap`, matching the slide credit: this assignment reuses the 2025 HW4.

One detail connects back to the previous lecture. The sample GPT-2 config sets `n_positions` to 400, exactly one image. The model only ever learns 400 positions, so train-short-test-long never comes up.

## Two metrics, both must pass

- **FID (slide 10)**: extract Inception v3 features from real and generated images and compute the Fréchet distance between the two distributions. Lower is better.
- **PDR (slide 11)**: Pokémon Detection Rate, the share of generated images that a TA-trained classifier calls a Pokémon. Higher is better.

The baseline table on slide 12:

| Level | FID | PDR | Estimated training time |
|---|---|---|---|
| simple | ≤ 86.00 | ≥ 0.1 | about 10 min |
| medium | ≤ 80.00 | ≥ 0.5 | about 20 min |
| strong | ≤ 73.00 | ≥ 0.85 | 30–40 min |

Each level has a public and a private version worth 1 point each, and code submission is worth 4 points. A note under the table says **FID and PDR must pass together**.

## The three hints

- **Simple (slide 13)**: run the sample code as is, and you get a decoder-only GPT-2 generating Pokémon.
- **Medium (slide 14)**: tune the epochs and learning rate, then the model config's number of attention heads, embedding dimension and number of layers.
- **Strong (slides 15–17)**: the recommended route is to switch to architectures like Llama or Mistral by importing their Config classes from Transformers and setting hyperparameters. An optional route is to train your own "does this look like a Pokémon?" classifier, like a GAN discriminator, and use it to pick checkpoints.

That last point deserves a second look. The sample code saves the checkpoint with the **lowest training loss**. Slides 15 and 17 and the Colab's Train section give the reason: reconstruction accuracy on the validation set does not directly reflect generation quality. There are many valid ways to finish an image, and guessing each token right is not the same as drawing something that looks right.

Slide 18 gives hyperparameter ranges:

| Hyperparameter | Range | Default |
|---|---|---|
| epochs | 30–150 | 50 |
| learning rate | 1e-5–1e-2 | 1e-3 |
| batch size | 8–64 | 16 |
| weight decay | 0.1–1e-5 | 0.1 |
| attention heads | 1–12 | 2 |
| embedding dim | 32–512 | 64 |
| layers | 1–12 | 2 |

The default GPT-2 config in the Colab matches this table (`n_embd` 64, `n_head` 2, `n_layer` 2). Inference calls `model.generate(..., max_length=400)` to complete every image to 400 tokens and writes `reconstructed_results.txt`.

## Submission rules

- **JudgeBoi (slides 19–20)**: submit a single `.txt` with exactly 80 lines, each holding 400 numbers for one image. Five submissions per day, resetting at 23:59 UTC+8, with a 10-minute evaluation limit per submission.
- **NTU COOL (slides 21–22)**: submit `ML2026Spring_hw4.ipynb`. No late submissions, and no model weights or datasets. Code that is unreasonable or not reproducible scores 0.
- **Rules (slide 24)**: no closed-source LLM APIs such as GPT-4 or Gemini, no extra training data, no hand-editing prediction files, and fix the random seed so TAs can reproduce your results.

## What outside readers cannot get

1. **Official scores.** JudgeBoi at `ml.ee.ntu.edu.tw` returned only 502 on 2026-09-30, and that is where FID and PDR are computed. PDR relies on a TA-trained classifier that is not public, so outside readers **cannot reproduce PDR**.
2. **COOL.** Code submission and the discussion board need an NTU account.
3. **Private baselines.** You know the thresholds, but not the private test results.

**Try this**: use the sample code's dev mode as a stand-in grader. Give the model only the first 240 tokens of each of the 80 validation images, let it complete them, and plot them next to the originals with `pixel_to_image`. For FID, any public FID implementation works on the real and completed validation images. Record the default run first, then change one hyperparameter at a time and watch which way FID moves.

## Further reading

- For background on decoder-only architectures, see the Stanford CME295 guide on [Transformer tricks](/posts/ai/2026-09-29-cme295-transformer-tricks-en) and the CMU 11-785 guide on [Transformer architectures](/posts/ai/2026-08-22-cmu-11785-19-transformer-architectures-en)

Series navigation: [Series overview](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en) | Previous: [Positional Embedding](/posts/ai/2026-09-30-ntu-ml2026-positional-embedding-en) | Next: [Harness Engineering](/posts/ai/2026-09-30-ntu-ml2026-harness-engineering-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [NTU Machine Learning 2026 Spring course page (Hung-yi Lee)](https://speech.ee.ntu.edu.tw/~hylee/ml/2026-spring.php) (in Mandarin)
- [hw4.pdf (ML 2026 Spring HW4: Training Transformers)](https://speech.ee.ntu.edu.tw/~hylee/ml/ml2026-course-data/hw4.pdf)
- [HW4 Colab sample code](https://colab.research.google.com/drive/1G9CgvnhqQ5AwHc6nbVzVGCoe-xUXdSWB?usp=sharing)
- [HW4 Kaggle version](https://www.kaggle.com/code/stevenlunar/ml2026-spring-hw4-training-transformer)
- [Video: ML 2026 Spring HW4 -- Training Transformers](https://youtu.be/QrqdoGf35Iw)
- [Hugging Face dataset lca0503/ml2025-hw4-pokemon](https://huggingface.co/datasets/lca0503/ml2025-hw4-pokemon)
- [GANs Trained by a Two Time-Scale Update Rule Converge to a Local Nash Equilibrium (introduces FID, arXiv 1706.08500)](https://arxiv.org/abs/1706.08500)
