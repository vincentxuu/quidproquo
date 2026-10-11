---
title: "MIT 6.5940 Lecture 6: Quantization II — PTQ Granularity and Clipping, QAT and STE, Binarization, Mixed Precision"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, mit, ai-course, course-guide, quantization, model-compression, deep-learning]
lang: en
series:
  name: "Reading MIT 6.5940"
  order: 6
tldr: "Lecture 6 is about what to do when quantization costs you accuracy. First, without retraining: use finer scale granularity (per-channel, group, MX), clip outliers (EMA, calibration batches, MSE, KL), and round smarter (AdaRound). If that isn't enough, retrain: QAT keeps a full-precision copy of the weights, runs fake quantization in the forward pass, and uses the STE to pass gradients straight through. In the whitepaper table the slides cite, MobileNetV1 drops to 0.1% accuracy under per-tensor INT8 PTQ and recovers to 70.7% with per-channel QAT, against a 70.9% float baseline. The last two sections cover 1–2 bit binary and ternary networks, and HAQ, which uses reinforcement learning to assign a bit width to each layer."
description: "A guide to MIT 6.5940 EfficientML (Fall 2024) Lecture 6, Quantization Part II: per-tensor, per-channel, and group quantization plus MX formats; how to set activation ranges; AdaRound; QAT and the straight-through estimator; BinaryConnect, XNOR-Net, TWN, TTQ; and HAQ automatic mixed precision. Includes a Fall 2026 comparison."
draft: false
glossary:
  - term: "PTQ"
    aliases: ["post-training quantization"]
    definition: "Quantizing an already-trained floating-point model directly. You choose scales, zero points, clipping ranges, and rounding, but you don't retrain the weights."
    context: "The first half of MIT 6.5940 Lecture 6: granularity, dynamic range clipping, rounding."
  - term: "QAT"
    aliases: ["quantization-aware training"]
    definition: "Simulating inference-time quantization error in the forward pass during training or fine-tuning, so the weights learn to work well after quantization. Only the quantized weights are kept for inference."
    context: "The fallback when PTQ loses too much accuracy, especially below 4 bits."
  - term: "STE"
    aliases: ["straight-through estimator"]
    definition: "The quantization function has zero derivative almost everywhere. The STE treats it as the identity function during backpropagation, so gradients pass through the quantization node unchanged."
    context: "The trick that makes QAT work."
---

> 🌏 [中文版](/posts/ai/2026-09-30-mit-65940-quantization-ptq-qat)

**Video status: Videos included.** [Source details](#course-video-sources)

**This post is based on [MIT 6.5940](https://hanlab.mit.edu/courses/2024-fall-65940), Fall 2024.** It is part 6 of the [Reading MIT 6.5940](/posts/ai/2026-09-30-mit-65940-course-overview-en) series and follows [Lecture 5: Quantization I](/posts/ai/2026-09-30-mit-65940-quantization-basics-en).

**Series**: previous [Lecture 5: Quantization basics](/posts/ai/2026-09-30-mit-65940-quantization-basics-en) | next [Lab 2: Implementing K-means and linear quantization](/posts/ai/2026-09-30-mit-65940-lab2-quantization-en) | [Series overview](/posts/ai/2026-09-30-mit-65940-course-overview-en)

**Official materials**: [Lec06-Quantization-II.pdf](https://www.dropbox.com/scl/fi/qt970xoje5d1btek4a8cl/Lec06-Quantization-II.pdf?rlkey=lalxz5ed2hez0olwu4e4gokbj&dl=0) (82 pages; all page numbers below refer to this PDF) and the [Lecture 6 recording](https://youtu.be/wrcgWm_nUeE). Access grade **A3**: slides and recordings are public, and the exercises are in [Lab 2](/posts/ai/2026-09-30-mit-65940-lab2-quantization-en). Everything below follows the slides, checked on 2026-09-30.

**Fall 2026 comparison**: The Fall 2026 [Lecture 6 slides](https://www.dropbox.com/scl/fi/4zry0dea0hrykoa2aoqp0/Lec06-Quantization-II.pdf?rlkey=cb7gol6t8jcrb8kyyxpxwjzfb&dl=0) (80 pages) and [recording](https://www.youtube.com/watch?v=_sHTMuOQY5A) are already up. The five-item Lecture Plan is word-for-word identical. A page-by-page comparison finds only two pages missing: a duplicate linear-quantization recap, and the chart of HAQ's bit allocation on edge versus cloud hardware (F24 page 80).

## Course video sources
Rechecked against the live official course page on 2026-10-10: the lecture numbers and recording links match and the videos are public and embeddable.

```youtube
url: https://www.youtube.com/watch?v=wrcgWm_nUeE
title: EfficientML.ai Lecture 6 - Quantization Part II (MIT 6.5940, Fall 2024)
```

Original videos: [EfficientML.ai Lecture 6 - Quantization Part II (MIT 6.5940, Fall 2024)](https://www.youtube.com/watch?v=wrcgWm_nUeE)

Course and recording entries:

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): Read the opening and closing summary and spot-checked the middle: per-tensor vs. per-channel quantization, group quantization, clipping outliers (calibration methods), PTQ and QAT, the straight-through estimator, binary/ternary networks with XNOR/popcount, and mixed precision (HAQ). Topics and lecture number match this post. The captions garble names such as AdaRound and VS-Quant, so those follow the slides. Page numbers and slide figures follow the slides and were not checked sentence by sentence against the video.

## The question Lecture 5 left open

Lecture 5 introduced two kinds of quantization: K-means (store integer indices plus a floating-point codebook) and linear quantization (`r = S(q − Z)`, where both weights and arithmetic can be integer). Page 3 of Lecture 6 reviews them side by side, and page 10 states the lecture's core question:

> How should we get the optimal linear quantization parameters (S, Z)?

The Lecture Plan on page 2 splits the answer into five parts, and this post follows it:

1. Review linear quantization
2. **PTQ**: no retraining; tune granularity, range clipping, rounding
3. **QAT**: simulate quantization during training to recover accuracy
4. Binary and ternary quantization
5. Automatic mixed precision

## PTQ move 1: finer scales

### Why per-tensor breaks on small models

The simplest approach shares one scale across the whole weight tensor, with `|r|max = |W|max`. That's per-tensor quantization. Page 14's verdict: it works well for large models, but accuracy drops for small ones.

The same page names the common failure. Weight ranges across output channels can differ by more than 100×. With one scale for the whole tensor, channels with small ranges get only a handful of integer levels, and their information is mostly erased. The slide's fix is **per-channel quantization**: each output channel gets its own scale.

Pages 16–20 walk through 2-bit symmetric quantization of a 4×4 matrix. Per-tensor uses `|r|max = 2.12` for every row. Per-channel uses 2.09, 2.12, 1.92, and 1.87 for the four rows, and the reconstruction error shrinks.

### Group quantization: between accuracy and hardware cost

Per-channel is still coarse. Pages 21–28 go finer, splitting a channel into small groups with one scale each. The catch is that scales cost bits too: the smaller the group, the larger the overhead. The slides' answer is **multi-level scaling**: cheap integer scales at fine granularity, expensive floating-point scales at coarse granularity.

- **[VS-Quant](https://arxiv.org/abs/2102.04503)** (page 24): `r = γ · Sq(q − Z)`, where γ is one floating-point scale per tensor and `Sq` is one integer scale per vector. With 4-bit weights and a 4-bit scale for every 16 elements, the effective bit width is 4 + 4/16 = **4.25 bits**.
- **[Shared micro-exponents (MX)](https://arxiv.org/abs/2302.08007)** (pages 26–28): also two levels, but the scales use exponent-only formats (E1M0, E8M0). The table lists effective bit widths of 4, 6, and 9 for MX4, MX6, and MX9.
- Page 23 ties this to hardware. NVIDIA Blackwell GPUs support "micro-tensor scaling" for FP4, and the FP4 tensor core has 2× the theoretical throughput of the FP8/FP6/INT8 tensor core.

**What to do**: when a quantization paper or tool says "4-bit," find its group size and scale format first, convert to effective bit width, and then compare. A 4-bit per-channel method and a 4-bit method with group size 16 don't take the same space.

## PTQ move 2: pick the range, clip the outliers

Weights are fixed before deployment, so their range is easy to compute. Activations aren't: their range varies with the input (page 30), so you have to collect statistics before deploying. Pages 31–38 list several approaches:

| Approach | When statistics are collected | How the range is chosen | Slide source |
|---|---|---|---|
| EMA | During training | Exponential moving average of observed min/max, smoothed over thousands of steps | Page 31, [Jacob et al. CVPR 2018](https://arxiv.org/abs/1712.05877) |
| Calibration batches + averaging | After training, on a few calibration batches | Average each sample's min/max so range isn't spent on outliers | Page 32 |
| Minimize MSE | Same | Assume Gaussian or Laplace inputs and solve for the optimal clipping point | Page 33, [Banner et al. NeurIPS 2019](https://arxiv.org/abs/1810.05723) |
| Minimize KL divergence | Same | Minimize information lost between the quantized and original distributions | Pages 34–36, TensorRT (Migacz 2017) |
| Newton-Raphson on MSE | — | OCTAV iterates toward the optimal clipping value | Pages 37–38, [Sakr et al. ICML 2022](https://arxiv.org/abs/2206.06501) |

The core intuition is one idea: **spend your integer levels where most of the data lives.** Clip a few extreme values rather than coarsening every level to fit them. Page 33 gives concrete numbers: for a Laplace(0, b) distribution, the optimal clipping points at 2, 3, and 4 bits are 2.83b, 3.89b, and 5.03b.

## PTQ move 3: don't just round to nearest

Pages 40–42 introduce **AdaRound** ([Nagel et al. 2020](https://arxiv.org/abs/2004.10568)). Its starting point: rounding each weight to its nearest integer doesn't give the best result for the tensor as a whole, because weights are correlated.

AdaRound turns each weight's rounding direction (up or down) into a learnable variable. The objective is the gap between the layer's output `Wx` before and after quantization, plus a regularizer that pushes the variable toward 0 or 1. It still counts as PTQ: only the rounding direction is learned, and the original weights stay put.

<details>
<summary>AdaRound's objective (page 42)</summary>

```
argmin_V ‖Wx − ⌊⌊W⌋ + h(V)⌉x‖²_F + λ f_reg(V)
```

- `x` is the layer's input; `V` is a variable with the same shape as W
- `h()` maps values into (0, 1), e.g., a rectified sigmoid
- `f_reg(V)` encourages `h(V)` to become binary (0 or 1)

</details>

## Where PTQ runs out: small models

Pages 44–45 summarize INT8 PTQ results. Large models are nearly lossless; small models like MobileNet lose more. The slides' reading is that small models have less representational capacity, so they respond worse to PTQ. Page 45 then asks outright: "How should we improve performance of quantized models?" The answer is QAT.

## QAT: fake-quantize forward, pretend you didn't going backward

### The situation

PTQ can only choose parameters; it can't change weights. Below 4 bits, choosing parameters no longer saves you. Page 47 says that to minimize accuracy loss, especially at 4 bits and below, you train or fine-tune the network with quantized weights and activations, and fine-tuning a pretrained float model usually beats training from scratch.

Page 47 first shows the K-means version: group the gradients by cluster, sum them, and use the result to update the centroids, as in [Deep Compression](https://arxiv.org/abs/1510.00149). The linear-quantization version works like this.

### The intuition

Pages 48–51 describe a process with three key points:

1. Keep a **full-precision copy of the weights W** throughout training.
2. In the forward pass, quantize and dequantize W to get `S_W · q_W = Q(W)`, and compute with that. This is "simulated" or "fake" quantization. Activations get the same treatment.
3. After training, inference uses only the quantized weights.

The slides give the reason for keeping full precision: small gradients can accumulate without being swallowed by limited precision.

### The mechanism: STE

The trouble is backpropagation. Quantization is `round()`, a staircase function whose derivative is 0 almost everywhere (page 52). The gradient becomes 0 when it hits this node, the weights never update, and the network learns nothing.

The **Straight-Through Estimator (STE)** fixes this bluntly: in the backward pass, treat the quantizer as the identity function and let the gradient pass straight through. Quantize going forward; pretend you didn't going backward. The slides credit Hinton's 2012 Coursera lectures and [Bengio et al. 2013](https://arxiv.org/abs/1308.3432).

<details>
<summary>The STE equations (page 52)</summary>

Without the STE:

```
g_W = ∂L/∂W = ∂L/∂Q(W) · ∂Q(W)/∂W = 0      (because ∂Q(W)/∂W = 0)
```

With the STE, set directly:

```
g_W = ∂L/∂W = ∂L/∂Q(W)
```

</details>

For the intuition behind backpropagation, see [CMU 11-785 Lecture 5: Backpropagation](/posts/ai/2026-08-22-cmu-11785-05-backpropagation-en) or the [MIT 6.7960 guide](/posts/ai/2026-08-26-mit-67960-deep-learning-guide-en).

### Back to the numbers

Page 54 cites [Krishnamoorthi's 2018 quantization whitepaper](https://arxiv.org/abs/1806.08342), and it's the most persuasive table in the lecture. MobileNetV1's float accuracy is 70.9%:

| Method | MobileNetV1 accuracy |
|---|---|
| PTQ, asymmetric per-tensor | 0.1% |
| PTQ, symmetric per-channel | 59.1% |
| QAT, asymmetric per-tensor | 70.0% |
| QAT, symmetric per-channel | 70.7% |

Two things hold at once: switching to per-channel recovers a large chunk, and QAT closes nearly all of the remaining gap.

**What to do**: when deploying a small model, run per-channel INT8 PTQ first and see how much you lose. If the drop is small, stop. If it's large, spend the compute on QAT fine-tuning.

## Down to 1 bit: binary and ternary networks

Page 57 asks: can quantization go all the way to 1 bit?

### Binarizing only the weights

With weights restricted to +1 and −1, multiplications become additions and subtractions. Page 59 estimates about 32× less memory and about 2× less computation than floating point.

There are two ways to binarize (page 60). **Deterministic** binarization uses a sign function with threshold 0. **Stochastic** binarization picks +1 or −1 with some probability; [BinaryConnect](https://arxiv.org/abs/1511.00363), for example, computes it with a hard sigmoid. The stochastic version needs hardware that generates random bits, so it's harder to implement.

Plain sign has a large error, so the **Binary Weight Network (BWN)** multiplies by a floating-point scale `α = ‖W‖₁ / n` (page 61). On the same slide, the ImageNet top-1 change for an AlexNet-style network is −21.2% for BinaryConnect and +0.2% for BWN.

### Binarizing both weights and activations

When both sides are ±1, encode +1 as 1 and −1 as 0, and the dot product becomes XNOR plus popcount (pages 62–67): `y = −n + popcount(W xnor x) << 1`. Page 67 estimates about 32× less memory and about 58× less computation.

The price is accuracy. AlexNet ImageNet top-1 change from page 68:

| Method | W/A bits | Accuracy change |
|---|---|---|
| BWN (scaled weights) | 1 / 32 | +0.2% |
| [BNN](https://arxiv.org/abs/1602.02830) (no scale factors) | 1 / 1 | −28.7% |
| [XNOR-Net](https://arxiv.org/abs/1603.05279) (scaled weights and activations) | 1 / 1 | −12.4% |

### Ternary: add a zero

**[Ternary Weight Networks (TWN)](https://arxiv.org/abs/1605.04711)** quantize weights to +1, 0, and −1 with threshold `Δ = 0.7 × E(|r|)` (page 69). **[Trained Ternary Quantization (TTQ)](https://arxiv.org/abs/1612.01064)** makes the positive and negative scales trainable parameters `wp` and `wn` (page 70). ResNet-18 ImageNet top-1: float 69.6, BWN 60.8, TWN 65.3, TTQ 66.6.

## Different bits per layer: automatic mixed precision

Every method so far uses the same bit width in every layer. Pages 72–74 propose another direction: pick the bit width for each layer's weights and activations separately, e.g., 4/5 bits in layer 1 and 6/7 bits in layer 2.

The hard part is the search space (page 75). With 8 choices each for weights and activations, one layer has 8 × 8 = 64 options, and n layers have 64ⁿ.

The slides' answer is **HAQ** ([Wang et al. CVPR 2019](https://arxiv.org/abs/1811.08886), with Song Han as a co-author). It uses actor-critic reinforcement learning to choose bit widths layer by layer (page 76) and feeds the target hardware's response directly into the search loop (page 77). Pages 78–79 show that on MobileNetV1, HAQ beats uniform quantization under model-size, latency, and energy constraints alike.

The idea of letting a machine search the design grows to the whole network architecture in the next lecture: [Lecture 7: NAS I](/posts/ai/2026-09-30-mit-65940-nas-search-space-strategy-en).

## How to self-study this lecture

1. Look at the MobileNet table on page 54 first, then go back to the granularity and QAT sections. That table carries the lecture's argument.
2. Take a pretrained MobileNetV2 in PyTorch, write per-tensor and per-channel INT8 weight quantization yourself, and measure accuracy for each. Check whether you see the same direction of gap as page 54.
3. Then do [Lab 2](/posts/ai/2026-09-30-mit-65940-lab2-quantization-en). Its Q5–Q9 are this lecture's scale, zero point, per-channel, and integer inference.

One thing you can do tonight: open the table on page 26 and work out VS-Quant's 4 + 4/16 and MX6's 5 + 1/2 + 8/16 yourself, so you know where each term of "effective bit width" comes from.

## Further reading

- Series entry point and course status: [Reading MIT 6.5940 (series overview)](/posts/ai/2026-09-30-mit-65940-course-overview-en)
- Quantization basics: [Lecture 5: Quantization I](/posts/ai/2026-09-30-mit-65940-quantization-basics-en)
- Quantization and systems in LLM inference: [CS336 Inference](/posts/ai/2026-08-22-cs336-inference-en)
- Backpropagation: [CMU 11-785 Lecture 5](/posts/ai/2026-08-22-cmu-11785-05-backpropagation-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Live-checked the official course page: lecture numbers and recording links match and the videos are public, so the status is now “Videos included.”
- 2026-10-10: Checked the video content against its transcript. The L6 video matches the topic and lecture number; the spot check found no contradictions, so the body text is unchanged.

## References

- [MIT 6.5940 Fall 2024 course page](https://hanlab.mit.edu/courses/2024-fall-65940) — schedule, slide and video links, Lab 2 release date
- [Lec06-Quantization-II.pdf (Fall 2024)](https://www.dropbox.com/scl/fi/qt970xoje5d1btek4a8cl/Lec06-Quantization-II.pdf?rlkey=lalxz5ed2hez0olwu4e4gokbj&dl=0) — every page number, figure, and table in this post
- [EfficientML.ai Lecture 6 - Quantization Part II (MIT 6.5940, Fall 2024)](https://youtu.be/wrcgWm_nUeE) — official recording
- [MIT 6.5940 Fall 2026 course page](https://hanlab.mit.edu/courses/2026-fall-65940) — schedule for the term in progress
- [Lec06-Quantization-II.pdf (Fall 2026)](https://www.dropbox.com/scl/fi/4zry0dea0hrykoa2aoqp0/Lec06-Quantization-II.pdf?rlkey=cb7gol6t8jcrb8kyyxpxwjzfb&dl=0) — compared page by page with F24
- [EfficientML.ai Lecture 6 - Quantization (Part II) (MIT 6.5940 Fall 2026)](https://www.youtube.com/watch?v=_sHTMuOQY5A) — Fall 2026 recording
- [Krishnamoorthi, Quantizing Deep Convolutional Networks for Efficient Inference: A Whitepaper (arXiv:1806.08342)](https://arxiv.org/abs/1806.08342) — source of the tables on pages 44 and 54
- [Jacob et al., Quantization and Training of Neural Networks for Efficient Integer-Arithmetic-Only Inference (arXiv:1712.05877)](https://arxiv.org/abs/1712.05877) — linear quantization and EMA ranges
- [Nagel et al., Up or Down? Adaptive Rounding for Post-Training Quantization (arXiv:2004.10568)](https://arxiv.org/abs/2004.10568) — AdaRound
- [Wang et al., HAQ: Hardware-Aware Automated Quantization with Mixed Precision (arXiv:1811.08886)](https://arxiv.org/abs/1811.08886) — automatic mixed precision
