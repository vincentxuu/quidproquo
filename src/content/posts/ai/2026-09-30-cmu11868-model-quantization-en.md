---
title: "CMU 11-868 L19–L20 Model Quantization: GPTQ Saves Memory, and the Speedup Comes Along for the Ride"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-11868, ai-course, cmu, quantization, llm-inference]
lang: en
series:
  name: "Reading CMU 11-868 LLM Systems"
  order: 15
tldr: "11-868 spends two lectures on quantization. L19 goes from BF16 and absmax/zero-point quantization to AdaQuant, ZeroQuant, and LLM.int8(). L20 is all GPTQ. GPTQ quantizes weights only: after each column is quantized, it uses second-order information to adjust the weights not yet quantized, and lazy batch updates plus a Cholesky trick let it scale to 175B. What it mainly saves is memory. Inference gets faster because single-batch decoding was already bottlenecked on reading weights; the amount of arithmetic does not shrink."
description: "A guide to CMU 11-868 LLM Systems (Spring 2026) L19 Model Quantization and L20 Model Quantization II: low-precision formats, absmax and zero-point, the trade-off between quantizing during training and after it, how ZeroQuant and LLM.int8() cope, the three changes that turn OBS/OBQ into GPTQ, and the limitations the slides themselves list."
draft: false
glossary:
  - term: "GPTQ"
    aliases: ["GPT-Q"]
    definition: "A one-shot post-training weight quantization method. It quantizes weights layer by layer and column by column, using an approximate Hessian computed from input data to adjust the not-yet-quantized weights and absorb rounding error."
    context: "The subject of all of 11-868 L20; the reading is Frantar et al., ICLR 2023."
    links:
      - label: "GPTQ (arXiv 2210.17323)"
        url: "https://arxiv.org/abs/2210.17323"
  - term: "post-training quantization"
    aliases: ["PTQ"]
    definition: "Converting a trained model's weights or activations to low-bit representations using only a small calibration set, without retraining the whole model."
    context: "L19 splits quantization methods into during-training and post-training; LLMs are effectively limited to the latter."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu11868-model-quantization)

**This guide follows the Spring 2026 offering of [CMU 11-868 LLM Systems](https://llmsystem.github.io/llmsystem2026spring/).** It is post 15 in the [Reading CMU 11-868 LLM Systems](/posts/ai/2026-09-30-cmu11868-llm-systems-overview-en) series and follows [HW5: Data and Pipeline Parallelism](/posts/ai/2026-09-30-cmu11868-hw5-distributed-training-en). The previous posts asked how to spread a model that is too big across more GPUs. This one changes direction: can the model itself get smaller?

The official materials are two slide decks, both by Lei Li: [L19 Model Quantization](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-19-quantization-da7a2abad092c802b03672ce1cc7bee9.pdf) on 3/25 (25 pages) and [L20 Model Quantization II](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-20-quantization2-ba573d7e5d82e68027bbd3a92c3cd819.pdf) on 3/30 (37 pages). The [Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus) lists only [GPTQ](https://arxiv.org/abs/2210.17323) as reading for L20 and nothing for L19. The in-progress [Fall 2026 Syllabus](https://llmsystem.github.io/llmsystem2026fall/docs/Syllabus) adds three readings to L19: NN Quantization, AdaQuant, and LLM.int8(). Slides and assignments are public, so the access level is **A3**, but there are no public recordings. Everything below comes from the slides and papers. Page numbers refer to the PDF files.

## Course video sources

This article follows official notes, slides, or assignments. This check of the official public pages did not verify a public recording for the material covered here; it does not establish that no recording exists.

Course and recording entries:

- [cmu-11-868-llm-systems — official course materials and recording index](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)

## The question: does quantization save memory or time?

L19 page 3 opens with cost: the slide says Llama-70B needs 140GB of GPU memory for inference. Page 4 gives a short definition: store parameters and layer outputs in low-bit precision. It lists two benefits and one drawback:

- Less memory, so you can run larger batches.
- Faster computation, because more operations fit in one cycle.
- A possible loss of accuracy.

Those two benefits do not always arrive together. By the end of both lectures it becomes clear that GPTQ mostly gets the first one. The second shows up only under specific conditions. That judgment is the takeaway of this post.

## L19: Low-precision numbers and the most direct quantization

### Why BF16 is fast

Page 6 shows one concrete way low precision buys speed. The `HFMA2` instruction packs two BF16 values into one 32-bit register and performs two fused multiply-adds per cycle, a 2x gain. The slide notes that A100/A6000 and later GPUs support BF16. Page 7 lists the matching CUDA APIs, `__hadd2` and `__hfma2`.

This is where the "speed" benefit comes from: **the arithmetic itself runs in low precision**, so the hardware goes faster. Keep this in mind for the GPTQ section.

### absmax and zero-point

Page 10 gives code for two ways to map floats to INT8:

- **absmax** computes a scale from the tensor's largest absolute value and linearly maps values into −127 to 127.
- **zero-point** computes a scale from max minus min, then a zero-point offset, so the whole −128 to 127 range gets used. It wastes less range when the data is asymmetric.

Page 11 links a Colab notebook you can run directly.

Page 8 lists three ways direct quantization goes wrong: precision loss accumulates noise, range mismatch clips values, and rounding introduces error. The MobileNet-v2 table on page 18 makes the cost concrete. The float model has 65.4% top-1 accuracy. **Direct quantization drops it to 1.7%.** Calibrating with AdaQuant brings it back to 52.3%.

<details>
<summary>The two functions from page 10 (PyTorch)</summary>

```python
import torch

def absmax_quantize(X):
    scale = 127 / torch.max(torch.abs(X))
    X_quant = (scale * X).round()
    X_dequant = X_quant / scale
    return X_quant.to(torch.int8), X_dequant

def zeropoint_quantize(X):
    x_range = torch.max(X) - torch.min(X)
    x_range = 1 if x_range == 0 else x_range
    scale = 255 / x_range
    zeropoint = (-scale * torch.min(X) - 128).round()
    X_quant = torch.clip((X * scale + zeropoint).round(), -128, 127)
    X_dequant = (X_quant - zeropoint) / scale
    return X_quant.to(torch.int8), X_dequant
```

</details>

### Quantizing during training vs. after it

Pages 13–15 draw a taxonomy. Quantizing during training means retraining or fine-tuning, which is expensive. Post-training quantization splits into two groups:

| Group | Methods | The slides' verdict |
|---|---|---|
| Preserve accuracy | AdaQuant, BRECQ, OBQ | Quantize layer by layer or block by block; hard to scale to billions of parameters |
| Scale to large models | ZeroQuant, LLM.int8() | Handle large models but lose accuracy at low bit widths |

Page 16 writes the shared starting point as one objective: for each layer, find quantized weights Ŵ that minimize ‖WX − ŴX‖², where X is the layer input. The limitation is that errors still accumulate from layer to layer.

Page 19 names the LLM problem. At 3 or 4 bits, rounding each weight to the nearest grid point costs accuracy. That is the gap GPTQ targets.

### ZeroQuant and LLM.int8()

- **[ZeroQuant](https://arxiv.org/abs/2206.01861)** (pages 20–21) does layer-by-layer knowledge distillation, with the original model as teacher and the quantized model as student. The slides say it was verified up to 20B (GPT-NeoX-20B), takes about 3 hours for a 1.3B model, and is integrated into DeepSpeed. The same page compares it with GPTQ, which handles a model 100x larger in about 4 hours.
- **[LLM.int8()](https://arxiv.org/abs/2208.07339)** (pages 22–23) uses 8-bit matrix multiplication, but activations contain extreme outliers. It keeps the outliers in FP16 and runs the rest in INT8. The slides define an outlier as magnitude ≥ 6.0, affecting ≥ 25% of layers and ≥ 6% of sequence dimensions.

## L20: How GPTQ scales a second-order method to 175B

### Two core moves

Page 5 returns to the same layer-wise objective ‖WX − ŴX‖². GPTQ has two key ideas:

1. Quantize one column block of weights at a time.
2. After quantizing a weight, update every weight **not yet quantized** to compensate for the error just introduced.

The second idea is the fundamental difference from round-to-nearest. The error is not thrown away. It is pushed onto weights that can still move.

### The algorithm in four steps

Pages 6–11 walk through a weight matrix with block size B = 4:

1. Precompute the inverse Hessian of the inputs and take its Cholesky decomposition: G = Cholesky((2XXᵀ + λI)⁻¹)ᵀ.
2. Within the current block, quantize one column, for example to int8 or int4.
3. Compute that column's rounding error and divide it by G's diagonal entry.
4. Use the error to update the remaining columns in the block. When the block is done, update all remaining weights to its right in one batch.

Page 7 uses DeepSeek-V3 to show the shape of X: batch × 128k length × 7168 dims. So the Hessian is 7168 × 7168 and does not depend on sequence length.

### Why it can actually run: from OBS to GPTQ

Pages 13–20 are the most substantive part of the lecture. They explain why GPTQ is not just another accurate-but-slow method. The lineage has three generations:

| Method | What it does | Where it gets stuck |
|---|---|---|
| Optimal Brain Surgeon (1993) | Uses a Taylor expansion to find the one weight whose removal increases loss least, plus the optimal update for the rest | The Hessian is d × d with d = rows × columns; total cost O(d⁴) |
| OBQ (2022) | Applies OBS to quantization, row by row; each row needs only a d_col × d_col Hessian | Still O(d_row · d_col³) |
| GPTQ (2023) | Three engineering changes, below | — |

GPTQ's three changes:

1. **Arbitrary order is good enough** (page 18). OBQ picks the next weight to quantize greedily by error. GPTQ observes that a fixed order usually costs little, because large early errors get balanced out by the weights that remain adjustable. If every row uses the same order, the inverse Hessian is the same for all rows. It needs updating d_col times instead of d_row · d_col times. Page 17 gives the cost drop from O(d_row · d_col³) to O(max(d_row · d_col², d_col³)).
2. **Lazy batch updates** (page 19). Column-by-column updates have too little arithmetic per byte to keep a GPU busy. The rounding decision for column i depends only on updates to that column, so later columns can wait. GPTQ finishes a block first, then updates the remaining weights in one batch.
3. **Cholesky precomputation** (page 20). At LLM scale, repeatedly updating the inverse Hessian accumulates numerical error and can make it indefinite. Quantizing weight q needs only row q of the inverse, starting at the diagonal. A Cholesky decomposition up front computes all of that at once, with little extra memory.

The third change is a classic systems-course point. The math does not change. A different order of computation makes it run on a GPU and stay numerically stable.

### Setup and results

Page 22 lists the setup: calibration data sampled at random from C4 (so the method is not task-aware), standard per-row asymmetric min-max uniform quantization, and quantization one transformer block at a time, with inputs taken from the previous already-quantized block.

The result charts on pages 24–28 come from the paper and contain no numbers you can copy off the slides. The paper's abstract reports that a 175B GPT model can be quantized in about four GPU hours to 3 or 4 bits per weight with negligible accuracy loss. End-to-end inference speedups over FP16 are about 3.25x on A100 and 4.5x on A6000. Accuracy stays reasonable even at 2 bits or ternary levels.

Pages 29–35 turn to code. They walk through `gptq.py` from [GPTQ-for-LLaMa](https://github.com/qwopqwop200/GPTQ-for-LLaMa) (Hessian initialization and updates, lazy batch updates, the Cholesky reformulation), then show an AutoGPTQ example configured with `bits=4, group_size=128`, again calibrated on C4.

## Back to the question: where does the speed come from?

The sentence on page 23 is the one worth copying down: **single-batch inference is memory-bound because it runs GEMVs**. Dequantization costs some extra compute, but the custom kernel cuts memory traffic, so end-to-end time drops.

The limitations on page 36 finish the thought:

- **Theoretical computation is unchanged.** Weights are stored at 3 or 4 bits but restored for the math.
- **Only weights are quantized.** Activation quantization is not addressed.

Put together: GPTQ reliably saves memory. The speedup comes from decoding already being stuck on moving weights. Fewer bits moved means less time. In a large-batch, compute-bound setting, that speedup does not carry over. GPTQ does not get the kind of speedup `HFMA2` offers at the start of L19, where the low-precision arithmetic itself runs faster.

## Further reading

- The course schedules FlashAttention next, still attacking the fact that moving data costs more than computing: [L21 FlashAttention](/posts/ai/2026-09-30-cmu11868-flashattention-en).
- For why inference is memory-bound, the Stanford CS336 [inference post](/posts/ai/2026-08-22-cs336-inference-en) derives it from arithmetic intensity.
- Where quantization sits in the full LLM serving stack: [CME295 LLM systems](/posts/ai/2026-09-29-cme295-llm-systems-en).

## Series navigation

- Previous: [HW5: Data and Pipeline Parallelism](/posts/ai/2026-09-30-cmu11868-hw5-distributed-training-en)
- Next: [L21 FlashAttention (guest lecture by Tri Dao)](/posts/ai/2026-09-30-cmu11868-flashattention-en)
- Series overview: [Reading CMU 11-868 LLM Systems](/posts/ai/2026-09-30-cmu11868-llm-systems-overview-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [CMU 11-868 LLM Systems, Spring 2026 — Syllabus](https://llmsystem.github.io/llmsystem2026spring/docs/Syllabus)
- [L19 Model Quantization slides (Lei Li, 2026-03-25)](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-19-quantization-da7a2abad092c802b03672ce1cc7bee9.pdf)
- [L20 Model Quantization II slides (Lei Li, 2026-03-30)](https://llmsystem.github.io/llmsystem2026spring/assets/files/llmsys-20-quantization2-ba573d7e5d82e68027bbd3a92c3cd819.pdf)
- [Frantar et al., GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers (arXiv 2210.17323)](https://arxiv.org/abs/2210.17323)
- [Official GPTQ implementation, IST-DASLab/gptq](https://github.com/IST-DASLab/gptq)
- [Dettmers et al., LLM.int8(): 8-bit Matrix Multiplication for Transformers at Scale (arXiv 2208.07339)](https://arxiv.org/abs/2208.07339)
- [Yao et al., ZeroQuant (arXiv 2206.01861)](https://arxiv.org/abs/2206.01861)
- [GPTQ-for-LLaMa (the code walked through on page 29)](https://github.com/qwopqwop200/GPTQ-for-LLaMa)
- [CMU 11-868 Fall 2026 Syllabus (for comparison)](https://llmsystem.github.io/llmsystem2026fall/docs/Syllabus)
