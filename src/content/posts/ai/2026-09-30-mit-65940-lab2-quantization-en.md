---
title: "MIT 6.5940 Lab 2: Implementing K-means and Linear Quantization, Down to an Integer-Only VGG"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, mit, ai-course, course-guide, quantization, homework, pytorch]
lang: en
series:
  name: "Reading MIT 6.5940"
  order: 7
tldr: "Lab 2 is a Colab notebook with 10 questions worth 100 points, built around a VGG pretrained on CIFAR-10. The first 3 questions cover K-means quantization: write the quantizer, work out how many clusters n bits gives you, write the centroid update, then compare accuracy at 8, 4, and 2 bits before and after fine-tuning. The other 7 cover linear quantization: write q = round(r/S) + Z, derive the scale and zero-point formulas, do per-channel weight quantization and bias quantization, write integer versions of the fully connected and convolution layers, and finally convert the whole model to INT8 for inference. This post lays out the questions, points, setup, and limits for outside learners. No solutions."
description: "A guide to MIT 6.5940 EfficientML (Fall 2024) Lab 2, Quantization: the notebook's K-means and linear quantization sections, the questions and points for Q1–Q10, which slides of Lectures 5 and 6 each question maps to, Colab GPU and package requirements, the built-in test functions, and what outside learners can't get. Includes Fall 2026 status."
draft: false
glossary:
  - term: "zero point"
    aliases: ["Z"]
    definition: "The integer offset in linear quantization r = S(q − Z) that lets floating-point 0 map exactly to an integer. Z = 0 in symmetric quantization."
    context: "Lab 2 Q5 asks you to derive the formula for Z."
  - term: "BN folding"
    aliases: ["BatchNorm fusion", "conv-bn fusion"]
    definition: "Merging BatchNorm's scale and shift into the preceding convolution's weights and bias. Inference output is unchanged, but one layer of computation disappears."
    context: "Lab 2 Q9 does this before quantizing the whole model."
---

> 🌏 [中文版](/posts/ai/2026-09-30-mit-65940-lab2-quantization)

**Video status: Checked: no corresponding recording link listed on the public official page.** [Source details](#course-video-sources)

**This post is based on [MIT 6.5940](https://hanlab.mit.edu/courses/2024-fall-65940), Fall 2024.** It is part 7 of the [Reading MIT 6.5940](/posts/ai/2026-09-30-mit-65940-course-overview-en) series and turns the quantization material from [Lecture 5](/posts/ai/2026-09-30-mit-65940-quantization-basics-en) and [Lecture 6](/posts/ai/2026-09-30-mit-65940-quantization-ptq-qat-en) into code.

**Series**: previous [Lecture 6: PTQ, QAT, and mixed precision](/posts/ai/2026-09-30-mit-65940-quantization-ptq-qat-en) | next [Lecture 7: NAS search spaces and search strategies](/posts/ai/2026-09-30-mit-65940-nas-search-space-strategy-en) | [Series overview](/posts/ai/2026-09-30-mit-65940-course-overview-en)

**Official materials**: the [Lab 2 Colab notebook](https://colab.research.google.com/drive/11IBla1q1McoZ2oCANCGHns8VtzG5nCMP). On the Fall 2024 course page, Lab 2 was released on September 26 (Lecture 7) and due October 8 (Lecture 10). The question numbers, points, and wording below follow the notebook itself, checked on 2026-09-30.

**Access grade A3, with gaps**: the notebook, pretrained weights, and dataset all download directly, and the notebook ships a few verification functions. What you can't get is official solutions or grading: submissions go through MIT's Canvas, so outside learners get no graded feedback. This post **doesn't give solutions**. It only says what each question asks and which part of the lectures it maps to.

**Fall 2026 comparison**: The Fall 2026 course page lists Lab 2 as "Quantization," scheduled for release on October 1. When I checked again on 2026-10-01 there was no link yet. I'll add the differences here once it's out.

## Course video sources
Rechecked against the live official course page on 2026-10-10: the public page lists lecture recordings only and no recording dedicated to this article (the lab is provided as Colab / Google Drive links).

Course and recording entries:

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)

Checked: 2026-10-10.

## What the lab wants you to be able to do

The notebook's Goals section lists seven items. Condensed, they come to three:

1. Implement K-means quantization and recover accuracy with quantization-aware training (QAT).
2. Implement linear quantization and integer-only inference.
3. Understand the trade-offs between the two in accuracy, latency, and hardware support.

There are 10 questions: 3 on K-means (Q1–Q3), 6 on linear quantization (Q4–Q9), and Q10 comparing the two.

## Setup and starting point

- **Model and data**: a VGG on CIFAR-10, the same one used in [Lab 0](/posts/ai/2026-09-30-mit-65940-basics-efficiency-metrics-en). The notebook defines a backbone of 8 conv-bn-relu layers plus a 512→10 linear classifier. Pretrained weights download from `hanlab18.mit.edu`.
- **Runtime**: the notebook metadata requests a Colab GPU runtime, and the model is loaded with `.cuda()`.
- **Extra packages**: `torchprofile` (for MAC counts) and `fast-pytorch-kmeans` (for K-means).
- **Built-in checks**: `test_k_means_quantize()`, `test_linear_quantize()`, and `test_quantized_fc()` check your implementation against fixed small tensors. They're the only automatic feedback outside learners get.

The notebook starts by measuring the FP32 model's accuracy and size, and every later result is compared against those numbers.

## Part 1: K-means quantization (Q1–Q3, 30 points)

This part maps to Lecture 5's K-means quantization and the K-means QAT on page 47 of [Lecture 6](/posts/ai/2026-09-30-mit-65940-quantization-ptq-qat-en). The notebook's definition: n-bit K-means quantization splits the weights into 2ⁿ clusters and builds a codebook with 2ⁿ FP32 `centroids` and an n-bit integer `labels` tensor with as many elements as the original weights. At inference, `centroids[labels]` reconstructs floating-point weights.

| Question | Points | What it asks |
|---|---|---|
| Q1 | 10 | Complete `k_means_quantize()`: build a codebook with K-means and reconstruct the weights |
| Q2.1 | 5 | 2-bit quantization renders 4 colors; how many for 4-bit? |
| Q2.2 | 5 | Generalize to n bits |
| Q3 | 10 | Complete `update_codebook()`: update the centroids from the latest weights |

After Q1, the notebook wraps your function in a `KMeansQuantizer` class, quantizes the whole model at 8, 4, and 2 bits, and prints size and accuracy. Note that the size calculation **ignores codebook storage**; the notebook says so explicitly.

The notebook then points out the problem itself: the fewer the bits, the more accuracy drops, so QAT is needed. It gives the centroid gradient as the sum of the weight gradients within a cluster, then explains that the lab, **for simplicity**, just sets each centroid to the mean of the weights in its cluster. Q3 implements that step.

The fine-tuning loop is provided: fine-tune only if accuracy drops by more than 0.5 percentage points, for at most 5 epochs, using SGD (lr 0.01, momentum 0.9) with a cosine schedule, calling `quantizer.apply(model, update_centroids=True)` after each training step.

## Part 2: Linear quantization (Q4–Q9, 65 points)

This part maps to Lecture 5's linear quantization and Lecture 6's per-channel and integer-inference slides (pages 8–9 and 14–20). It starts from `r = S(q − Z)` and the n-bit signed integer range `[−2ⁿ⁻¹, 2ⁿ⁻¹ − 1]`.

| Question | Points | What it asks |
|---|---|---|
| Q4 | 10 | Complete `linear_quantize()`: scale, round, add the zero point; the final clamp to the n-bit range is already written |
| Q5.1 | 3 | Pick the correct scale formula from four options |
| Q5.2 | 4 | Pick the correct zero-point formula from four options |
| Q5.3 | 8 | Complete `get_quantization_scale_and_zero_point()` |
| Q6 | 5 | Complete bias quantization |
| Q7 | 15 | Complete the integer fully connected layer, `quantized_linear()` |
| Q8 | 10 | Complete the integer convolution layer, `quantized_conv2d()` |
| Q9.1 | 5 | Preprocessing that maps inputs from (0, 1) to the INT8 range |
| Q9.2 | 5 | Explain why the quantized model has no ReLU layers |

A few design choices worth knowing up front:

- **Weights use symmetric quantization.** The notebook plots the weight distributions and notes they're roughly symmetric around 0 (except the classifier), so weights get Z = 0 and S comes from the largest absolute weight. This matches the symmetric linear quantization on Lecture 6 page 14.
- **Weights are per-channel.** Conv weights have shape (output channels, input channels, kh, kw), and the notebook says extensive experiments show a separate S and Z per output channel works better, so per-channel is built into the provided code.
- **Activation ranges are calibrated on one batch of training data.** Before Q9, forward hooks record each layer's inputs and outputs on a single batch (batch size 512), and the function you wrote in Q5.3 computes S and Z straight from the min and max. This is the simplest version of Lecture 6 page 32's "calibration batches," with no clipping.
- **The Q9 pipeline**: first fold BatchNorm into the preceding convolution (the notebook verifies accuracy is unchanged), then record activation ranges, then swap `Conv2d` and `Linear` for quantized versions. `MaxPool2d` and `AvgPool2d` are thin wrappers, because PyTorch modules at the time didn't support INT8, so they temporarily compute in FP32.

The Q7 and Q8 hints give the formula skeleton directly, matching Lecture 6 pages 8–9.

<details>
<summary>The integer-inference formulas from the Q7/Q8 hints</summary>

```
q_output = (Linear[q_input, q_weight] + Q_bias) · (S_input · S_weight / S_output) + Z_output
Q_bias   = q_bias − Linear[Z_input, q_weight]
```

For convolution, replace `Linear` with `CONV`. The Q6 hint is `Z_bias = 0` and `S_bias = S_input · S_weight`.

</details>

## Q10 (5 points): compare the two approaches

The last question is open-ended: compare the pros and cons of K-means and linear quantization in terms of accuracy, latency, hardware support, and so on.

Before writing, revisit the side-by-side table on Lecture 6 page 3, which compares storage and computation for the two. Then check it against the numbers you printed in Q3 and Q9: K-means needs a codebook to reconstruct floating-point values, while linear quantization can stay in integers along the whole path. Your answer should rest on results you ran yourself.

## How to self-study the lab

1. **Run through the FP32 baseline cell before anything else.** Make sure the Colab GPU, weight download, and CIFAR-10 download all work before you start on questions.
2. **Run the matching test after every function.** Q1, Q4, and Q7 have ready-made checks. Don't move on until they pass; later questions amplify earlier mistakes.
3. **Work Q5 on paper first.** Subtract `r_min = S(q_min − Z)` from `r_max = S(q_max − Z)` and the multiple-choice answers fall out. Once you understand it, Q5.3 is just translation into code.
4. **Q9.2 and Q10 test understanding.** When you're done, check your answers against the Lecture 6 slides.

One thing you can do tonight: open the notebook and run only the Setup and FP32 evaluation sections, and write down the accuracy and model size. Compare every quantization result against those two numbers, and you'll get a direct feel for how much you save and how much you lose.

## Further reading

- Series entry point and course status: [Reading MIT 6.5940 (series overview)](/posts/ai/2026-09-30-mit-65940-course-overview-en)
- The same workflow applied to pruning: [Lab 1: Pruning](/posts/ai/2026-09-30-mit-65940-lab1-pruning-en)
- 4-bit weight quantization for LLMs: [Lab 4 + Lab 5: AWQ and an LLM on a laptop](/posts/ai/2026-09-30-mit-65940-lab4-lab5-llm-on-laptop-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Live-checked the official public page: it still lists lecture recordings only, with none dedicated to this article, so the status is now “Checked: no corresponding recording link listed on the public official page.”

## References

- [MIT 6.5940 Fall 2024 course page](https://hanlab.mit.edu/courses/2024-fall-65940) — Lab 2 release and due dates, Canvas submission, grading weights
- [Lab 2 Colab notebook (Fall 2024)](https://colab.research.google.com/drive/11IBla1q1McoZ2oCANCGHns8VtzG5nCMP) — every question number, point value, hint, and setup detail in this post
- [Lec06-Quantization-II.pdf (Fall 2024)](https://www.dropbox.com/scl/fi/qt970xoje5d1btek4a8cl/Lec06-Quantization-II.pdf?rlkey=lalxz5ed2hez0olwu4e4gokbj&dl=0) — the matching integer-inference formulas, per-channel quantization, calibration methods
- [Lec05-Quantization-I.pdf (Fall 2024)](https://www.dropbox.com/scl/fi/qc2s9opsa2mnqfithvwz1/Lec05-Quantization-I.pdf?rlkey=sizfzkdv85etnplz1nqgngeql&dl=0) — K-means and linear quantization basics
- [MIT 6.5940 Fall 2026 course page](https://hanlab.mit.edu/courses/2026-fall-65940) — Fall 2026 Lab 2 schedule
- [Han et al., Deep Compression (arXiv:1510.00149)](https://arxiv.org/abs/1510.00149) — K-means quantization and centroid fine-tuning, cited in the notebook
- [Jacob et al., Quantization and Training of Neural Networks for Efficient Integer-Arithmetic-Only Inference (arXiv:1712.05877)](https://arxiv.org/abs/1712.05877) — linear quantization, cited in the notebook
