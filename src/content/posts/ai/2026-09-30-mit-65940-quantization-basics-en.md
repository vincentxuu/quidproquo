---
title: "MIT 6.5940 Lecture 5: Number Formats, K-Means Quantization, and Linear Quantization"
date: 2026-09-30
category: ai
type: guide
tags: [ai-course, mit, quantization, model-compression, hardware]
lang: en
series:
  name: "Reading MIT 6.5940"
  order: 5
tldr: "MIT 6.5940 Lecture 5 starts from one fact: an 8-bit integer add uses 30x less energy than a 32-bit float add. It reviews the bit layouts of INT, fixed point, FP32/FP16/BF16, FP8, and FP4, then covers two quantization methods. K-means quantization saves storage only, since computation stays in floating point. Linear quantization, r = S(q − Z), turns matrix multiplication, fully connected layers, and convolutions into integer arithmetic."
description: "A guide to MIT 6.5940 EfficientML (Fall 2024) Lecture 5, Quantization Part I: the energy cost of low-bit operations, integer and floating-point formats (FP32, FP16, BF16, FP8 E4M3/E5M2, INT4 and FP4), what quantization is, K-means quantization and Deep Compression, scale and zero point in linear quantization, symmetric quantization, and integer-only fully connected and convolution layers, with a Fall 2026 comparison."
draft: false
glossary:
  - term: "zero point"
    aliases: ["Z"]
    definition: "The integer parameter in linear quantization r = S(q − Z) that lets the real number 0 be represented exactly by a quantized integer. In symmetric quantization, Z = 0."
    context: "6.5940 Lecture 5 computes it as Z = round(q_min − r_min / S)."
  - term: "BF16"
    aliases: ["Brain Float 16", "bfloat16"]
    definition: "A 16-bit floating-point format from Google Brain with an 8-bit exponent and a 7-bit fraction. It has the same range as FP32 and less precision than FP16."
    context: "6.5940 Lecture 5 places it next to FP32 and FP16 to show that exponent bits set range and fraction bits set precision."
---

> 🌏 [中文版](/posts/ai/2026-09-30-mit-65940-quantization-basics)

**Video status: Videos included.** [Source details](#course-video-sources)

> **Version note**: This post is based on the [MIT 6.5940 Fall 2024 course page](https://hanlab.mit.edu/courses/2024-fall-65940), the most recent complete offering; the [series overview](/posts/ai/2026-09-30-mit-65940-course-overview-en) explains why. The main source is the [Lecture 5 slides, Lec05-Quantization-I.pdf](https://www.dropbox.com/scl/fi/qc2s9opsa2mnqfithvwz1/Lec05-Quantization-I.pdf?rlkey=sizfzkdv85etnplz1nqgngeql&st=zr1y81q7&dl=0) (70 pages; page numbers below are PDF pages). The [recording](https://www.youtube.com/watch?v=ymAzUz3qlIA) is linked too, but every claim here rests on the slides. Facts were checked against the official materials on 2026-09-30. Access level: Fall 2024 is **A3**; Fall 2026 is **A2** (in progress).

**Series**: previous [Lab 1: nine questions on fine-grained and channel pruning](/posts/ai/2026-09-30-mit-65940-lab1-pruning-en) | next [Lecture 6: PTQ, QAT, binary quantization, and mixed precision](/posts/ai/2026-09-30-mit-65940-quantization-ptq-qat-en) | [Series overview](/posts/ai/2026-09-30-mit-65940-course-overview-en)

Pruning cuts the *number* of weights. Quantization cuts the *bits* per weight. Lecture 5 is the first half of the quantization unit, and the Lecture Plan on page 2 lists three goals: review number formats, learn the basic concept of quantization, and learn three common methods (K-means, linear, and binary/ternary).

In practice, Lecture 5 covers only the first two methods. The summary on page 69 lists K-means and linear quantization only, and the comparison table on page 68 has a question mark in the binary/ternary column. The Lecture Plan of [Lecture 6](/posts/ai/2026-09-30-mit-65940-quantization-ptq-qat-en) is where binary and ternary quantization appear as a formal item. This post follows what the slides actually cover and leaves binary/ternary for the next one.

## Course video sources
Rechecked against the live official course page on 2026-10-10: the lecture numbers and recording links match and the videos are public and embeddable.

```youtube
url: https://www.youtube.com/watch?v=ymAzUz3qlIA
title: EfficientML.ai Lecture 5 - Quantization Part I (MIT 6.5940, Fall 2024)
```

Original videos: [EfficientML.ai Lecture 5 - Quantization Part I (MIT 6.5940, Fall 2024)](https://www.youtube.com/watch?v=ymAzUz3qlIA)

Course and recording entries:

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)

Checked: 2026-10-10.

## Why bit width matters

Page 3 cites [Horowitz's ISSCC 2014 paper](https://doi.org/10.1109/ISSCC.2014.6757323) and lists the energy of various operations on a 45nm process. The standout pair: an 8-bit integer add costs 0.03 pJ and a 32-bit float add costs 0.9 pJ, a 30x gap. Multiplication points the same way, with 0.2 pJ for an 8-bit integer multiply and 3.7 pJ for a 32-bit float multiply.

The slide title states the conclusion: fewer bits, less energy. Page 4 follows with the question that drives the whole unit: how should we make deep learning more efficient?

## How numbers look inside a computer

### Integers and fixed point

Page 6 covers three kinds of n-bit integer:

| Representation | Range | Notes |
|---|---|---|
| Unsigned | $[0, 2^n - 1]$ | |
| Sign-magnitude | $[-2^{n-1}+1, 2^{n-1}-1]$ | Both 000…0 and 100…0 mean 0 |
| Two's complement | $[-2^{n-1}, 2^{n-1}-1]$ | One zero; 100…0 means $-2^{n-1}$ |

Page 7's fixed-point number pins the binary point in one place. The slide's example is the 8-bit value `00110001`. Read as 4 integer bits plus 4 fraction bits, it's 3.0625; read another way, it's the integer 49 times $2^{-4}$. That second reading matters, because it's the seed of linear quantization.

### Floating point: exponent sets range, fraction sets precision

Page 8 uses IEEE 754 FP32: 1 sign bit, 8 exponent bits, 23 fraction bits, with value $(-1)^{\text{sign}} \times (1 + \text{Fraction}) \times 2^{\text{Exponent} - 127}$. The slide shows how 0.265625 = $1.0625 \times 2^{-2}$ is encoded.

<details>
<summary>Pages 10–16: subnormals, INF, and NaN</summary>

When the exponent is 0, the "1 + Fraction" rule no longer applies; the value is $(-1)^{\text{sign}} \times \text{Fraction} \times 2^{1-127}$. These subnormal numbers represent 0 and values very close to it. The smallest positive FP32 subnormal is $2^{-149}$, and the smallest positive normal is $2^{-126}$. When the exponent is all ones (255), a zero fraction means ±INF and anything else is NaN.

</details>

The title of page 17 is the key line of the section: **Exponent Width → Range; Fraction Width → Precision**.

| Format | Exponent | Fraction | Total bits |
|---|---|---|---|
| IEEE FP32 | 8 | 23 | 32 |
| IEEE FP16 | 5 | 10 | 16 |
| Google BF16 | 8 | 7 | 16 |

BF16 keeps FP32's 8 exponent bits, so its range matches FP32; the price is a 7-bit fraction. Pages 18–19 each have an exercise: what is the FP16 value `1100011100000000` (answer: −7.0), and how do you write 2.5 in BF16 (answer: `0100000000100000`)? Cover the answers and work them out first.

### FP8 and 4-bit formats

Page 20 adds NVIDIA's two FP8 formats:

- **E4M3**: 4 exponent bits and 3 mantissa bits. No INF; the largest normal value is 448.
- **E5M2**: 5 exponent bits and 2 mantissa bits. Has INF and NaN; the largest normal value is 57344. The slide notes it's used for gradients in the backward pass.

Both use 8 bits: E5M2 has more range and E4M3 more precision, which is page 17's rule again.

Page 21 breaks down 4 bits too. INT4 covers the integers −8 through 7. FP4 comes in three layouts: E1M2, E2M1, and E3M0. In E2M1, the only positive values are 0, 0.5, 1, 1.5, 2, 3, 4, and 6, with no INF or NaN. The representable values are no longer evenly spaced; they get denser near zero.

## What quantization is

Page 22's definition: quantization is the process of constraining an input from a continuous or otherwise large set of values to a discrete set. The difference between an input and its quantized value is the quantization error. The slide shows a 16-color image as an example, a technique also called palettization.

Page 24 previews the three methods with a table focused on what gets stored and what arithmetic runs:

| | K-means quantization | Linear quantization | Binary/ternary quantization |
|---|---|---|---|
| Storage | Integer indices plus a floating-point codebook | Integer weights | (Lecture 6) |
| Computation | Floating-point arithmetic | Integer arithmetic | (Lecture 6) |

## K-means quantization: cluster similar weights

### Storage

Page 28 uses a 4×4 FP32 weight matrix. K-means groups the 16 weights into 4 clusters. Each weight stores only a 2-bit cluster index, plus one codebook of 4 centroids.

- Before: 32 bits × 16 = 64 B
- After: 2 bits × 16 (4 B) + 32 bits × 4 (16 B) = 20 B, 3.2x smaller

When the weight count $M$ is much larger than $2^N$, the codebook cost becomes negligible and the compression ratio approaches $32/N$.

### Fine-tuning after quantization

Pages 29–30 show how to train quantized weights. Compute each weight's gradient, group gradients by cluster index, sum them, scale by the learning rate, and update the centroids. The histograms on pages 34–36 show the weights turning from a continuous distribution into a few discrete bars, and the bars shifting after retraining.

### Deep Compression

Pages 31–33 plot accuracy against compression rate for AlexNet on ImageNet: pruning only, quantization only, and pruning plus quantization. Pruning plus quantization compresses furthest at the same accuracy.

Pages 38–39 package the full flow as the three-stage pipeline of [Deep Compression (Han et al., ICLR 2016)](https://arxiv.org/abs/1510.00149):

1. Pruning: fewer weights, 9–13x smaller.
2. K-means quantization: fewer bits per weight, 27–31x cumulative.
3. Huffman coding: frequent values get fewer bits, 35–49x cumulative.

In the results table on page 40, AlexNet shrinks from 240 MB to 6.9 MB (35x) and VGGNet from 550 MB to 11.3 MB (49x), with no accuracy loss. Below the table the slide asks: can we build compact models to begin with? Page 42 cites [SqueezeNet](https://arxiv.org/abs/1602.07360), which after Deep Compression takes just 0.47 MB, 510x smaller than AlexNet at similar accuracy.

### The limit of K-means quantization

Page 43 spells it out: at inference time the weights are decoded back to floating point through the codebook, so **K-means quantization only saves storage; all computation and memory access remain floating point**. To save on computation too, you need the next method.

## Linear quantization: a straight line between integers and reals

### The core equation

Pages 47–48 define linear quantization as an affine mapping of integers to real numbers:

$$
r = S(q - Z)
$$

$r$ is the floating-point real value, $q$ the quantized integer, $S$ the floating-point scale, and $Z$ the integer zero point. $Z$ exists so the real number 0 maps exactly to some integer. The slide reuses the same 4×4 matrix, reconstructs it with 2-bit signed integers, $Z = -1$, and $S = 1.07$, and shows the resulting quantization error matrix.

### Computing scale and zero point

Map the ends of the floating-point range, $r_{\min}$ and $r_{\max}$, to the ends of the integer range, $q_{\min}$ and $q_{\max}$ (pages 50 and 52):

$$
S = \frac{r_{\max} - r_{\min}}{q_{\max} - q_{\min}}, \qquad Z = \text{round}\left(q_{\min} - \frac{r_{\min}}{S}\right)
$$

### Turning matrix multiplication into integer arithmetic

<details>
<summary>Pages 54–57: expanding Y = WX</summary>

Substitute $S(q - Z)$ for $W$, $X$, and $Y$ and rearrange:

$$
q_Y = \frac{S_W S_X}{S_Y}\left(q_W q_X - Z_W q_X - Z_X q_W + Z_W Z_X\right) + Z_Y
$$

Inside the parentheses are N-bit integer multiplications and 32-bit integer additions and subtractions, and the terms that depend only on the weights can be precomputed. The slide says the factor $\frac{S_W S_X}{S_Y}$ empirically always falls in (0, 1), so it can be written as $2^{-n} M_0$ with $M_0 \in [0.5, 1)$ and computed with a fixed-point multiply plus a bit shift, no floating point needed.

</details>

Page 57 leaves a question: what if $Z_W = 0$? That leads to symmetric quantization.

### Symmetric quantization

Page 58: set $Z = 0$ and use a symmetric floating-point range $[-|r|_{\max}, |r|_{\max}]$. An N-bit signed integer spans $[-2^{N-1}, 2^{N-1}-1]$; for 4 bits, that's −8 to 7. Page 59's full range mode uses $S = |r|_{\max} / 2^{N-1}$.

With $Z_W = 0$, two terms drop out of the equation above, leaving $q_W q_X - Z_X q_W$ on the weight side.

### Fully connected and convolution layers

Pages 62–64 add the bias. With $Z_W = 0$, $Z_b = 0$, and $S_b = S_W S_X$, a fully connected layer becomes

$$
q_Y = \frac{S_W S_X}{S_Y}\left(q_W q_X + q_{\text{bias}}\right) + Z_Y, \qquad q_{\text{bias}} = q_b - Z_X q_W
$$

The slide notes that both $q_b$ and $q_{\text{bias}}$ are 32 bits. The convolution version on page 66 has the same structure with Conv in place of the matrix multiply, drawn as a dataflow: integer inputs and integer weights go through the convolution, an int32 bias is added, the result is scaled, the zero point is added, and the output is an integer.

### The accuracy cost

Page 67 cites [Jacob et al. (CVPR 2018)](https://arxiv.org/abs/1712.05877): ResNet-50 goes from 76.4% top-1 in floating point to 74.9% with 8-bit integer quantization, and Inception-V3 goes from 78.4% to 75.4%. The same page has a latency-vs-accuracy curve for MobileNets on Snapdragon 835. Losing a few percentage points is exactly the problem Lecture 6 takes on.

## Fall 2026 comparison

Lecture 5 on the [Fall 2026 course page](https://hanlab.mit.edu/courses/2026-fall-65940) (September 24) already has [slides](https://www.dropbox.com/scl/fi/1yvbg0dqcysee8hf61hjr/Lec05-Quantization-I.pdf?rlkey=kaxx0x1m67ruecnm07gtm6d78&st=xb9raxr5&dl=0) and a [recording](https://www.youtube.com/watch?v=Qg_3N8pdK9s). Comparing the text layers of the two PDFs: both have 70 pages. The differences are the cover image, the course name, and the subnormal pages, where explanatory text was replaced with "Normal number / Subnormal number" labels. The structure is the same.

Fall 2026's Lab 2 is labeled Quantization and had not been released as of 2026-09-30. Fall 2024's [Lab 2](https://colab.research.google.com/drive/11IBla1q1McoZ2oCANCGHns8VtzG5nCMP) has you implement this lecture's K-means and linear quantization; this series breaks it down after Lecture 6.

## What to do after reading

1. Work the two format exercises on pages 18–19, then use the same method to write 2.5 in FP16 and compare it with BF16.
2. Take one layer of real weights and compute $S$ and $Z$ by hand, once asymmetric and once symmetric. Quantize, dequantize, and see where the error lands.
3. One thing you can do tonight: in PyTorch, take the weight of an `nn.Linear`, find its min and max with `torch.aminmax`, compute $S$ and $Z$ with the formulas above, quantize with `torch.quantize_per_tensor(w, S, Z, torch.qint8)`, restore with `.dequantize()`, and look at the error distribution.

## Further reading

- Quantization formats from a user's point of view (GGUF, Q4/Q8): [Understanding AI models: quantization](/posts/ai/2026-08-26-understanding-ai-models-quantization-en)
- How an LLM systems course teaches quantization: [Reading CMU 11-868: model quantization](/posts/ai/2026-09-30-cmu11868-model-quantization-en)
- The previous stop on the same road: [Lecture 4: pruning ratios and system support](/posts/ai/2026-09-30-mit-65940-pruning-ratio-system-support-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Live-checked the official course page: lecture numbers and recording links match and the videos are public, so the status is now “Videos included.”

## References

- [MIT 6.5940 Fall 2024 course page](https://hanlab.mit.edu/courses/2024-fall-65940) — Lecture 5 (September 19) slide and video links
- [Lec05-Quantization-I.pdf (Fall 2024)](https://www.dropbox.com/scl/fi/qc2s9opsa2mnqfithvwz1/Lec05-Quantization-I.pdf?rlkey=sizfzkdv85etnplz1nqgngeql&st=zr1y81q7&dl=0) — source of every page number above
- [EfficientML.ai Lecture 5 recording (Fall 2024)](https://www.youtube.com/watch?v=ymAzUz3qlIA)
- [Lec06-Quantization-II.pdf (Fall 2024)](https://www.dropbox.com/scl/fi/qt970xoje5d1btek4a8cl/Lec06-Quantization-II.pdf?rlkey=lalxz5ed2hez0olwu4e4gokbj&st=f1oof15v&dl=0) — item 4 of its Lecture Plan is binary/ternary quantization
- [MIT 6.5940 Fall 2026 course page](https://hanlab.mit.edu/courses/2026-fall-65940) — Lecture 5 slides and [recording](https://www.youtube.com/watch?v=Qg_3N8pdK9s)
- [Horowitz, Computing's Energy Problem (and What We Can Do About It) (ISSCC 2014)](https://doi.org/10.1109/ISSCC.2014.6757323) — source of the energy table
- [Han, Mao & Dally, Deep Compression (ICLR 2016)](https://arxiv.org/abs/1510.00149)
- [Iandola et al., SqueezeNet (arXiv 2016)](https://arxiv.org/abs/1602.07360)
- [Jacob et al., Quantization and Training of Neural Networks for Efficient Integer-Arithmetic-Only Inference (CVPR 2018)](https://arxiv.org/abs/1712.05877)
