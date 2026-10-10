---
title: "MIT 6.5940 Lecture 13: LLM Deployment Through Quantization, Sparsity, and Serving"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, ai-course, course-guide, mit, llm-inference, quantization, model-serving]
lang: en
series:
  name: "Reading MIT 6.5940"
  order: 15
tldr: "Lecture 13 sorts the ways to speed up LLM inference into three paths. Quantization: SmoothQuant moves the difficulty of activation outliers onto the weights to make W8A8 work, AWQ uses activation magnitudes to find the roughly 1% of weights that matter and protects them by scaling for W4A16, and QServe combines both into W4A8KV4. Sparsity: Wanda prunes weights by |W|·‖X‖, DejaVu and MoE use only part of the parameters per token, and SpAtten and H2O drop unimportant tokens. Serving: TTFT/TPOT metrics, PagedAttention, FlashAttention, speculative decoding, and continuous batching. On the slides, INT3 OPT-6.7B has a perplexity of 43.16 with RTN; scaling the salient channels by 2 brings it to 14.07."
description: "A guide to MIT 6.5940 EfficientML (Fall 2024) Lecture 13, Efficient LLM Deployment: why decode is memory-bound, SmoothQuant, AWQ and TinyChat, QServe W4A8KV4, Wanda, DejaVu, MoE, SpAtten, H2O, plus serving metrics, PagedAttention, FlashAttention, speculative decoding, and batching. Includes Fall 2026 status."
draft: false
glossary:
  - term: "AWQ"
    aliases: ["activation-aware weight quantization"]
    definition: "A weight-only quantization method (commonly 4-bit, groups of 128). It uses activation magnitudes from calibration data to find the important weight channels, multiplies them by a scale before quantizing, and folds the inverse scale into the previous operation, so no mixed precision is needed."
    context: "One of the main techniques in MIT 6.5940 Lecture 13, and the algorithm you implement in Lab 4."
  - term: "W4A16"
    aliases: ["weight-only quantization"]
    definition: "A quantization setting that stores weights in 4 bits and keeps activations in 16-bit floating point. It saves the memory bandwidth spent moving weights, which suits small-batch decoding limited by bandwidth."
    context: "The slides contrast it with W8A8 for the cloud: W4A16 for edge inference, W8A8 for batched cloud serving."
  - term: "TTFT"
    aliases: ["time to first token"]
    definition: "The time from sending a request to seeing the first output token, mostly set by how long it takes to process the prompt (prefill)."
    context: "One of the four serving metrics in Lecture 13; the others are TPOT, latency, and throughput."
  - term: "SmoothQuant"
    definition: "A W8A8 quantization method. It uses calibration data to find the per-channel maximum of the activations, divides the activations by a scale vector, and multiplies the weights by the same vector, so both sides become easy to quantize."
    context: "The first technique in the quantization part of Lecture 13, representing weight-activation quantization."
---

> 🌏 [中文版](/posts/ai/2026-09-30-mit-65940-llm-deployment)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

**This post follows the Fall 2024 edition of [MIT 6.5940](https://hanlab.mit.edu/courses/2024-fall-65940).** It is post 15 in the [Reading MIT 6.5940](/posts/ai/2026-09-30-mit-65940-course-overview-en) series and picks up from [Lecture 12: Transformers and LLMs](/posts/ai/2026-09-30-mit-65940-transformer-llm-primer-en).

**Series position**: previous [L12 Transformers and LLMs](/posts/ai/2026-09-30-mit-65940-transformer-llm-primer-en) | next [Lab 4 + Lab 5: AWQ and LLaMA2-7B on a laptop](/posts/ai/2026-09-30-mit-65940-lab4-lab5-llm-on-laptop-en) | [series overview](/posts/ai/2026-09-30-mit-65940-course-overview-en)

**Official materials**: [Lec13-LLM-Deployment.pdf](https://www.dropbox.com/scl/fi/aa5ea0hrc68cn3fh18nan/Lec13-LLM-Deployment.pdf?rlkey=gzq9yiddx4bnh14bxomtfmcoj&dl=0) (93 pages; every page number below refers to this PDF) and the [Lecture 13 recording](https://youtu.be/sTz2tXG1T0c). Access level **A3**: slides and recording are public, and the matching exercises are [Lab 4 and Lab 5](/posts/ai/2026-09-30-mit-65940-lab4-lab5-llm-on-laptop-en). Everything below follows the slides, checked on 2026-09-30.

**Fall 2026 status**: the [Fall 2026 course page](https://hanlab.mit.edu/courses/2026-fall-65940) renames Lecture 13 (October 27) to "LLM Quantization and Deployment". As of 2026-09-30 its slides and recording aren't up, so the content can't be compared yet.

## Course video sources

Recording links have been checked against the official course page for the edition used by this article.

```youtube
url: https://www.youtube.com/watch?v=sTz2tXG1T0c
title: Lecture 13 recording (YouTube)
```

Original videos: [Lecture 13 recording (YouTube)](https://www.youtube.com/watch?v=sTz2tXG1T0c)

Course and recording entries:

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)

## What this lecture is solving

[Lecture 12](/posts/ai/2026-09-30-mit-65940-transformer-llm-primer-en) left one fact on the table: an LLM generates one token at a time, and every token requires reading all of the model's weights from memory. This lecture organizes the ways to make that faster and cheaper into three paths. The Lecture Plan on page 2 is the map:

| Path | Slide pages | Techniques |
|---|---|---|
| 1. Quantization | 4–59 | SmoothQuant (weight-activation), AWQ and TinyChat (weight-only), QServe (W4A8KV4) |
| 2. Pruning and sparsity | 60–68 | Wanda (weights), DejaVu and MoE (contextual), SpAtten and H2O (attention) |
| 3. Serving systems | 69–92 | Metrics, PagedAttention (vLLM), FlashAttention, speculative decoding, batching |

Quantization takes up more than half the slides and is the topic of Lab 4, so this post goes deepest there. For the other two paths it picks one representative technique each and lists the rest.

## Path 1: Quantization

### The setup: why CNN-style W8A8 doesn't carry over

Page 5 asks the question. W8A8 (8-bit weights and activations) is already standard for CNNs, so why not for LLMs? The slide's answer: once models grow past 6.7B parameters, activations develop **systematic outliers**, and classic CNN quantization methods destroy accuracy.

Pages 6–7 plot weights and activations side by side. Weights are flat and easy to quantize. A few activation channels are huge, which makes activations hard to quantize. The good news is that the outliers **always show up in the same few channels**.

### SmoothQuant: move the difficulty from activations to weights

The intuition is simple. If one activation channel is too large, divide it by a number. To keep the result unchanged, multiply the matching row of the weights by the same number. Page 8 calls this "migrate the quantization difficulty". Afterward, activations are easy to quantize and weights get slightly harder but stay easy.

Pages 10–12 break it into three steps: offline calibration (record the max absolute value of each activation channel), offline smoothing (compute the scale vector $s$ and fold it into the weights), and inference that runs the pre-smoothed $\hat{X}\hat{W}$ directly.

<details>
<summary>The scale formula and the role of α (page 13)</summary>

$$
s_j = \frac{\max(|X_j|)^{\alpha}}{\max(|W_j|)^{1-\alpha}},\quad
Y = (X\,\mathrm{diag}(s)^{-1})\cdot(\mathrm{diag}(s)\,W) = \hat{X}\hat{W}
$$

$\alpha$ is the migration strength, which controls how much difficulty moves onto the weights. The slides conclude that too large an $\alpha$ makes the weights hard to quantize, too small leaves the activations hard, and there's a sweet spot in between.

</details>

Page 14 covers the system side: SmoothQuant is integrated into FasterTransformer, and every compute-heavy operation (Linear, BMM) runs in INT8. Page 15 shows accuracy holds without fine-tuning while inference gets faster and memory use halves (the figure uses 8 GPUs for FP16 and 4 for SmoothQuant). Page 16 fits MT-NLG 530B on a single node, and page 17 shows LLaMA 7B through 65B barely change in Wikitext perplexity.

### Why W8A8 isn't enough: decode is limited by bandwidth

Page 19 turns the corner. W8A8 suits **batched serving** (say, batch size 128). But when one user runs an LLM locally, decode is still heavily limited by memory bandwidth. What you need there is low-bit **weight-only** quantization, such as W4A16.

Page 20 shows the gap with measurements on an RTX 4090: processing a 200-token context takes about 10 ms, while generating 20 tokens takes about 310 ms. Each generation step computes only one token, so compute is tiny and the time goes into reading weights.

If you've done the [roofline part of Fall 2026 Lab 1](/posts/ai/2026-09-30-mit-65940-f26-lab1-gpu-basics-en), this is decode sitting on the left, memory-bound side of the roofline.

### AWQ: find the 1% of weights that matter and protect them by scaling

**Setup.** Quantize OPT-6.7B to INT3 with plain round-to-nearest (RTN) in groups of 128, and page 21 shows Wiki-2 perplexity getting noticeably worse.

**Observation 1: weights aren't equally important** (page 22). Keeping just about 1% of the salient weight channels in FP16 improves perplexity a lot.

**Observation 2: importance comes from activations, not from the weights themselves** (page 24). Picking the 1% by weight magnitude helps little. Picking by activation magnitude helps a lot. That's where "activation-aware" comes from.

**Problem**: keeping 1% in FP16 means mixed precision, which is awkward in hardware.

**Solution: scaling instead of mixed precision** (pages 25–27). Multiply the salient channels' weights by $s$ (greater than 1) and divide the matching activations by $s$. The $1/s$ folds into the previous operation. Page 25 has the clearest numbers: at INT3, RTN gives perplexity 43.16, scaling the salient channels by 2 gives 14.07, and the FP16 baseline is 12.29. Scaling by 4 climbs back up to 14.42, because too large a scale hurts the other channels.

<details>
<summary>Why scaling lowers the error (pages 26 and 28)</summary>

Let quantization be $Q(w) = \Delta \cdot \mathrm{Round}(w/\Delta)$ with $\Delta = \max(|w|)/2^{N-1}$. The error is roughly $\Delta \cdot \mathrm{Err}(\mathrm{Round}(\cdot)) \cdot x$, where the expected rounding error is about 0.25.

Multiply one channel by $s$ and divide back, and the error becomes $\Delta' \cdot \mathrm{Err}(\cdot) \cdot x \cdot \frac{1}{s}$. As long as $s$ isn't too large, the maximum of a 128-weight group rarely changes ($\Delta' \approx \Delta$), so the error shrinks by about a factor of $s$. When $s$ is too large, $\Delta'$ grows and the error on the other, non-salient weights grows with it.

The actual $s$ comes from a search (page 28):

$$
\mathcal{L}(s) = \lVert Q(W\cdot s)(s^{-1}\cdot X) - WX \rVert,\quad s = s_X^{\alpha},\quad \alpha^* = \arg\min_{\alpha}\mathcal{L}(s_X^{\alpha})
$$

$s_X$ is the average activation magnitude. The slides stress two points: the scale depends only on activation magnitude, and the search minimizes error in the **output**, not in the weights themselves (the difference from GPTQ).

</details>

Page 29 lists AWQ's advantages: simple, hardware-efficient, less dependent on calibration data than regression-based methods, and it generalizes to instruction-tuned and multimodal models. Page 30 compares RTN, GPTQ, and AWQ at INT3/INT4 on Llama-2 and LLaMA. Pages 31–33 apply AWQ to the VILA vision-language model, where INT4 average scores stay close to FP16.

### TinyChat: making the quantized model actually fast

Quantization only saves storage. Getting speed also takes an inference engine. Page 35 introduces [TinyChat](https://github.com/mit-han-lab/llm-awq): lightweight, Python-native, and running on cloud and edge GPUs as well as laptop and phone CPUs. Two key tricks:

- **Hardware-aware packing** (page 36): reorder the 4-bit weights offline so that one AND and one shift unpack them at runtime, cutting decode instructions.
- **Kernel fusion** (page 37): fuse dequantization with the matrix multiply to skip writing an intermediate result back to DRAM.

Page 38's headline is more than 3x faster than Huggingface FP16 inference, tested on an RTX 4090, an RTX 4070 laptop GPU, and a Jetson Orin. Page 40 runs a 7B model on a Jetson Orin Nano with only about 7 GB of usable memory. That's exactly what [Lab 5](/posts/ai/2026-09-30-mit-65940-lab4-lab5-llm-on-laptop-en) has you do by hand on a CPU.

### QServe: combining the cloud and edge settings

Pages 47–48 point out that the two worlds use different settings:

| Setting | Format | Details |
|---|---|---|
| Cloud serving | W8-A8-KV8 | Weights per-channel, activations per-token, KV per-tensor, all 8-bit |
| Edge inference | W4-A16-KV16 | Weights 4-bit per-group (group 128), activations and KV in FP16 |

Page 49 asks whether you can have both: 4-bit weights to save bandwidth, 8-bit activations for higher peak throughput. That's W4A8KV4. Page 50 says existing W4A4 methods have two problems: noticeable accuracy loss, and they aren't fast on current GPUs. Pages 51–53 explain why: inside the main loop of a quantized GEMM, dequantization runs on CUDA cores, and CUDA cores are expensive.

QServe's two answers:

- **SmoothAttention** (pages 54–55): move the quantization difficulty of the K cache onto Q, with the same structure as the SmoothQuant formula.
- **Progressive quantization** (pages 56–57): during dequantization, "multiply by the scale first, then subtract the zero point", which avoids overflow in register-level parallel arithmetic.

Page 59's headline is 2.4x to 3.5x faster than TensorRT-LLM on A100 and L40S.

## Path 2: Pruning and sparsity

This section is only 9 pages, one or two per technique. **H2O** is the representative here, because it directly tackles the KV cache problem from Lecture 12.

**Setup**: the longer the generation, the bigger the KV cache. **Intuition**: not every past token matters equally. **Mechanism**: page 68 says H2O keeps only two kinds of tokens in the KV cache, recent local tokens and heavy hitters (H2) with high cumulative attention scores, and drops the rest. **Back to the model**: this prunes attention at the token level during inference without touching the weights.

The other four techniques:

| Technique | Pages | In one line |
|---|---|---|
| [Wanda](https://arxiv.org/abs/2306.11695) | 61–62 | Same idea as AWQ: pruning should also look at activations. It scores importance as $\lvert W\rvert \cdot \lVert X\rVert$ and consistently beats magnitude-only pruning |
| [DejaVu](https://arxiv.org/abs/2310.17157) | 63 | Static sparsity hurts accuracy at medium-to-high sparsity; contextual sparsity depends on the input, with an asynchronous predictor choosing the heads and features each token needs |
| MoE ([Switch Transformers](https://arxiv.org/abs/2101.03961)) | 64–66 | A router sends each token to a few experts, so total parameters grow while per-token inference cost stays flat; page 65 uses the capacity factor to show that tokens get skipped once an expert is full |
| [SpAtten](https://arxiv.org/abs/2012.09852) | 67 | Cascade-prunes tokens and heads with low cumulative attention; skips fetching V when QK is small; computes in low precision first and switches to high precision only when unsure |

## Path 3: Serving systems

### First, define what to measure

Page 70 cites [Databricks's inference performance post](https://www.databricks.com/blog/llm-inference-performance-engineering-best-practices) for four metrics:

- **TTFT** (time to first token): how fast the user sees the first word, mostly set by prompt processing time.
- **TPOT** (time per output token): time per output token. The slide's example: 100 ms/token is 10 tokens per second, about 450 English words per minute.
- **Latency** = TTFT + TPOT × number of tokens to generate.
- **Throughput**: how many tokens per second the server generates across all requests.

Page 71 names the tradeoff: handling many requests at once raises throughput but stretches each user's TPOT, and output length is the main source of latency.

### Representative: PagedAttention

**Setup** (page 74): the KV cache is large. For Llama-2-70B (assuming MHA), each token in each sequence needs 2.5 MB. Batch 16 at sequence length 4096 needs 160 GB, which takes two A100s.

**Problem** (page 75): KV cache waste comes in three forms. You don't know how long the output will be, so you over-allocate (internal fragmentation). You reserve space for tokens that come later (reservation). Different sequence lengths leave holes (external fragmentation).

**Intuition** (page 76): borrow virtual memory and paging from operating systems.

**Mechanism** (pages 77–80): [PagedAttention](https://arxiv.org/abs/2309.06180) stores logically contiguous K and V in non-contiguous physical blocks. Multiple requests can share blocks, and parallel sampling can share the blocks of a common prompt.

### The other three

- **FlashAttention** (pages 82–83): tiling avoids writing the full $N\times N$ attention matrix to slow HBM, combined with kernel fusion. [Fall 2026 Lab 1 Part 5](/posts/ai/2026-09-30-mit-65940-f26-lab1-gpu-basics-en) lets you measure the gap against standard attention yourself.
- **Speculative decoding** (pages 85–87): a small draft model generates K tokens autoregressively, then the large target model checks them all in one parallel pass and accepts or rejects them. Because the target model processes several tokens at once, the bandwidth bottleneck eases. The slides cite [Leviathan et al.](https://arxiv.org/abs/2211.17192): a 2–3x speedup with identical outputs.
- **Batching** (pages 89–91): no batching, static, dynamic, and continuous (in-flight). Dynamic batching is like a bus that leaves when full or when time runs out. Continuous batching works per token and lets a new request take a finished request's slot, which suits LLMs with varied output lengths.

Page 92 closes with NVIDIA's [TensorRT-LLM](https://github.com/NVIDIA/TensorRT-LLM), marking which features this lecture covered and which come later in the course.

## One idea running through all three paths

Put side by side, one thread runs through everything: **look at the activations**. SmoothQuant sets its scale from activations, AWQ picks salient weights by activations, Wanda puts activations into the pruning score, and H2O and SpAtten drop tokens by attention score. The second thread is **bandwidth**: W4A16, TinyChat's kernel fusion, FlashAttention, and speculative decoding all cut the number of trips data makes from memory.

## How to self-study it

1. Start with pages 19–20 and make sure you can explain why decode is slow. If you can't, do the roofline part of [Fall 2026 Lab 1](/posts/ai/2026-09-30-mit-65940-f26-lab1-gpu-basics-en) first.
2. Read page 25 (the effect of scaling) against page 28 (the search objective), then open [Lab 4](/posts/ai/2026-09-30-mit-65940-lab4-lab5-llm-on-laptop-en). Lab 4's Q1 and Q2 are essentially these two pages as code.
3. One thing you can do tonight: use the formula on page 74 to work out how much KV cache a model you use regularly needs per request at 8K context (look up its layer count, KV head count, and head dimension).

## Further reading

- Same series: [L12 Transformers and LLMs](/posts/ai/2026-09-30-mit-65940-transformer-llm-primer-en), [L6 Quantization II (PTQ and QAT)](/posts/ai/2026-09-30-mit-65940-quantization-ptq-qat-en), [L11 TinyEngine and parallel computing](/posts/ai/2026-09-30-mit-65940-tinyengine-parallel-computing-en)
- Inference and serving: [CS336 inference](/posts/ai/2026-08-22-cs336-inference-en), [CMU 11-868 model quantization](/posts/ai/2026-09-30-cmu11868-model-quantization-en), [CMU 11-868 LLM serving (SGLang and vLLM)](/posts/ai/2026-09-30-cmu11868-llm-serving-sglang-vllm-en), [CMU 11-868 FlashAttention](/posts/ai/2026-09-30-cmu11868-flashattention-en)
- MoE: [CMU 11-868 model parallelism and MoE](/posts/ai/2026-09-30-cmu11868-model-parallel-moe-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [Lec13-LLM-Deployment.pdf (Fall 2024)](https://www.dropbox.com/scl/fi/aa5ea0hrc68cn3fh18nan/Lec13-LLM-Deployment.pdf?rlkey=gzq9yiddx4bnh14bxomtfmcoj&dl=0) — all page numbers, figures, and section breakdown in this post
- [Lecture 13 recording (YouTube)](https://youtu.be/sTz2tXG1T0c)
- [MIT 6.5940 Fall 2024 course page](https://hanlab.mit.edu/courses/2024-fall-65940) — schedule and Lab 4 release date
- [MIT 6.5940 Fall 2026 course page](https://hanlab.mit.edu/courses/2026-fall-65940) — Lecture 13 rename and release status
- [Xiao et al., SmoothQuant (ICML 2023)](https://arxiv.org/abs/2211.10438)
- [Lin et al., AWQ (MLSys 2024)](https://arxiv.org/abs/2306.00978), [llm-awq / TinyChat (GitHub)](https://github.com/mit-han-lab/llm-awq)
- [Lin et al., QServe: W4A8KV4 Quantization and System Co-design](https://arxiv.org/abs/2405.04532)
- [Sun et al., Wanda](https://arxiv.org/abs/2306.11695), [Liu et al., Deja Vu](https://arxiv.org/abs/2310.17157), [Fedus et al., Switch Transformers](https://arxiv.org/abs/2101.03961)
- [Wang et al., SpAtten](https://arxiv.org/abs/2012.09852), [Zhang et al., H2O](https://arxiv.org/abs/2306.14048)
- [Kwon et al., PagedAttention / vLLM](https://arxiv.org/abs/2309.06180), [Dao et al., FlashAttention](https://arxiv.org/abs/2205.14135), [Leviathan et al., Speculative Decoding](https://arxiv.org/abs/2211.17192)
- [Databricks, LLM Inference Performance Engineering: Best Practices](https://www.databricks.com/blog/llm-inference-performance-engineering-best-practices) — source of the metric definitions on pages 70–71
- [Baseten, Continuous vs dynamic batching for AI inference](https://www.baseten.co/blog/continuous-vs-dynamic-batching-for-ai-inference/) — source of the batching analogy on pages 90–91
- [NVIDIA TensorRT-LLM (GitHub)](https://github.com/NVIDIA/TensorRT-LLM)
