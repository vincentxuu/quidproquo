---
title: "Quantization & Inference Optimization: Running a 70B Model on Your Laptop"
date: 2026-08-26
category: ai
type: deep-dive
tags: [quantization, gguf, kv-cache, inference, vram, ollama, llama-cpp, ai-model]
lang: en
series:
  name: "認識 AI 模型"
  order: 14
tldr: "A 70B model needs ~140GB VRAM in FP16, but 4-bit quantization shrinks it to ~35GB. With llama.cpp's partial CPU offloading, it can run on consumer hardware. GGUF naming conventions (Q4_K_M, Q5_K_S) tell you the precision-size tradeoff. KV cache is why long conversations slow down."
description: "An introduction to model quantization and inference optimization: the precision tradeoff from FP16 to INT4, how to read GGUF naming conventions, why KV cache eats memory, and what model sizes your VRAM can handle."
draft: false
glossary:
  - term: "Quantization"
    def: "Reducing the numerical precision of model weights (e.g. FP16→INT4) to decrease memory usage and speed up inference, at the cost of minor quality loss"
  - term: "GGUF"
    def: "The quantized model format used by llama.cpp — Q4/Q5/Q8 in the filename indicates the quantization bit depth, K_M/K_S indicates the quantization strategy"
  - term: "KV Cache"
    def: "Cached Key and Value vectors for each token during inference, avoiding redundant computation — the longer the conversation, the more VRAM it consumes"
---

> 🌏 [中文版](/posts/ai/2026-08-26-understanding-ai-models-quantization)

You want to run Llama 3 70B on your laptop. You check the specs: 70 billion parameters, each stored in FP16 (16-bit floating point), requiring **140GB of VRAM**. Your GPU has 8GB.

That's a 17x gap. Now what?

## Why Models Are So Large

As we covered in the [training](/en/posts/ai/2026-08-26-understanding-ai-models-training-stages-en) article, a model is essentially a massive collection of numbers (weights). Each weight is stored in FP16 or BF16 during training — 2 bytes per number.

Simple arithmetic:

```
parameters × bytes per parameter = model size
70B × 2 bytes = 140GB
```

All 140GB must be loaded into memory (VRAM or RAM) before inference can begin. Even NVIDIA's most expensive consumer GPU (RTX 4090) has only 24GB of VRAM. Even if you're willing to spend thousands, a single card won't cut it.

## Quantization: Trading Precision for Space

The core idea of quantization is simple: **reduce the precision of each number**.

Think about everyday math. Pi is 3.14159265..., but most of the time 3.14 is good enough. You lose a tiny bit of precision but save a lot of digits.

Quantization does exactly this: compress weights originally stored in 16-bit down to 8-bit, 4-bit, or even 2-bit.

### Precision Levels at a Glance

| Format | Per weight | 70B model size | vs. FP16 |
|--------|-----------|---------------|----------|
| FP16 (16-bit) | 2 bytes | ~140 GB | 100% |
| INT8 (8-bit) | 1 byte | ~70 GB | 50% |
| INT4 (4-bit) | 0.5 byte | ~35 GB | 25% |
| INT2 (2-bit) | 0.25 byte | ~17.5 GB | 12.5% |

4-bit quantization shrinks a 70B model from 140GB to 35GB — within range of two RTX 4090s (48GB total). With CPU offloading (placing some layers in system RAM), a single 24GB GPU with enough RAM can manage it, albeit slowly.

### How Much Quality Do You Lose?

Quantization isn't free. You're trading precision for space, so there's some quality loss. But modern quantization techniques (GPTQ, AWQ, GGUF's K-quants) are clever — they don't cut precision uniformly. Important weights retain higher precision; less important ones get compressed more aggressively.

In practice:

- **8-bit (Q8)**: Nearly imperceptible difference. Benchmark scores typically drop less than 1%
- **4-bit (Q4_K_M)**: Good performance on most tasks. Occasional errors on problems requiring precise arithmetic. Everyday conversation, writing, and code generation work well
- **2-bit (Q2_K)**: Noticeable quality degradation. Experimental use only

## GGUF Format: The Standard Packaging for Quantized Models

When you browse Hugging Face for quantized models, you'll see a bunch of `.gguf` files with cryptic names:

```
llama-3-70b-instruct-Q4_K_M.gguf
llama-3-70b-instruct-Q5_K_S.gguf
llama-3-70b-instruct-Q8_0.gguf
```

GGUF is the format defined by llama.cpp and has become the de facto standard for running models locally. The codes in the filename tell you two things:

### Decoding the Naming Convention

**Q + number** = quantization bit depth
- Q2 = 2-bit, Q3 = 3-bit, Q4 = 4-bit, Q5 = 5-bit, Q8 = 8-bit

**Letters after the underscore** = quantization strategy
- `K` = K-quant (smarter group-wise quantization, better quality than older methods)
- `_M` = Medium (balanced between size and quality)
- `_S` = Small (smaller file, slightly lower quality)
- `_L` = Large (bigger file, better quality)
- `_0` = Basic quantization (no K-quant optimization)

### Which One Should You Pick?

| If you want... | Choose |
|---------------|--------|
| Best quality, don't care about size | Q8_0 |
| Best balance of quality and size | Q4_K_M |
| As small as possible, acceptable quality | Q4_K_S |
| Maximum compression, experimental | Q2_K |

**Q4_K_M is the most popular choice.** For most use cases, its quality loss is nearly imperceptible, while the file size is only a quarter of the FP16 original.

## KV Cache: The Hidden Memory Killer in Long Conversations

Quantization solves the "model itself is too large" problem, but there's another major memory consumer during inference: the **KV cache**.

Recall from the [Transformer architecture](/en/posts/ai/2026-08-26-understanding-ai-models-transformer-en) article that the attention mechanism computes relationships between each token and all preceding tokens. If you recomputed every previous token's Key and Value for each new token, inference time would grow quadratically with conversation length — unusably slow.

The solution is the **KV cache**: store the Key and Value vectors for every layer and every token. When generating the next token, you only compute the new token's Query, then run attention against the cached Keys and Values.

### Where's the Problem?

KV cache size = layers × attention heads × head dimension × sequence length × 2 (one each for K and V)

Concretely, for Llama 3 70B:

- 80 layers × 8 KV heads × 128 dims × 8192 tokens × 2 (K+V) × 2 bytes (FP16)
- ≈ **20GB**

An 8K-context conversation consumes roughly 20GB just for the KV cache. This is the fundamental reason long conversations slow down and eventually OOM (out of memory).

### Mitigations

- **KV cache quantization**: Compress the KV cache to INT8 or INT4, saving 50-75% of its memory
- **Sliding Window Attention**: Keep only the last N tokens' KV cache, discard older ones
- **GQA / MQA**: Grouped / Multi-Query Attention reduces the number of KV heads (Llama 3 uses GQA, reducing KV heads from 64 to 8)

## Practical Reference Table: What Your Hardware Can Run

| VRAM | Models you can run (Q4_K_M quantization) | Notes |
|------|------------------------------------------|-------|
| 8 GB | 7B-8B params (Llama 3.1 8B, Qwen 2.5 7B) | Long conversations limited by KV cache |
| 12 GB | 13B-14B params (Qwen 2.5 14B) | Comfortable for 7B/8B |
| 16 GB | 14B (comfortable), try 32B (may need partial CPU offload) | Best value sweet spot |
| 24 GB | 32B-34B (comfortable), 70B (heavy CPU offload, slow) | RTX 4090 / 3090 |
| 48 GB+ | 70B (comfortable), attempt larger | Dual GPU or professional cards |
| CPU only | 7B (slow but works), 13B (very slow) | Needs plenty of RAM, 10-20x slower than GPU |

> These are estimates. Actual usage depends on context length, KV cache settings, quantization method, and other factors.

## Tools: Three Ways to Run Models Locally

The local inference toolchain is mature. Here are the three main options:

- **Ollama**: Simplest. `ollama run llama3.1:8b` — one command, it downloads the model and manages quantized versions automatically. Best for quick experimentation
- **llama.cpp**: Most flexible. Supports GGUF format, hybrid CPU/GPU inference, KV cache quantization, and extensive tuning parameters. The deepest performance optimization. Ollama is built on top of it
- **vLLM**: Production-oriented. Supports continuous batching, PagedAttention (more efficient KV cache management), and OpenAI-compatible APIs. Best for serving multiple users simultaneously

A detailed self-hosting deployment guide will be covered later in this series.

## The Mental Model from This Article

```
FP16 model too large → quantize to 4-bit, size drops to 1/4
GGUF Q4_K_M → the sweet spot between quality and size
KV cache → grows with conversation length, eating more memory
Your VRAM → determines the largest model you can run
```

Next time you see `Q4_K_M.gguf` on Hugging Face, you'll know: it's a model quantized with 4-bit K-quant Medium strategy, roughly one-quarter the size of the original, with virtually no perceptible quality loss.

## References

- [llama.cpp — GGUF format specification and K-quant quantization](https://github.com/ggerganov/llama.cpp)
- [Hugging Face — Quantization documentation](https://huggingface.co/docs/transformers/quantization)
- [The Case for 4-bit Precision (GPTQ paper)](https://arxiv.org/abs/2210.17323)
- [AWQ: Activation-aware Weight Quantization](https://arxiv.org/abs/2306.00978)
- [vLLM: Efficient Memory Management for LLM Serving with PagedAttention](https://arxiv.org/abs/2309.06180)
- [Ollama — The easiest way to run large language models locally](https://ollama.com/)
