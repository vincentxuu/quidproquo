---
title: "TurboQuant+ — Two-Stage Quantization to Compress KV Cache to 2-bit, Running 100B Models on a MacBook"
date: 2026-04-01
type: guide
category: ai
tags: [turboquant, kv-cache, quantization, llm-inference, llama-cpp, apple-silicon]
lang: en
tldr: "TurboQuant+ is an open-source implementation of a Google Research ICLR 2026 paper that uses PolarQuant + QJL two-stage quantization to compress the KV cache by 3.8-6.4x, enabling consumer hardware to run larger models with longer contexts."
description: "An introduction to TurboQuant+'s core quantization principles (PolarQuant, QJL), asymmetric K/V compression strategy, three key research findings, compression benchmarks, and practical usage with llama.cpp on Mac."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-01-turboquant-plus-kv-cache-compression)

The memory bottleneck of LLM inference isn't just the model itself — when contexts get longer, **KV cache is the real memory killer**. A 70B model at 128K context can easily consume over 40GB just for the KV cache. TurboQuant+ directly compresses this memory, achieving 3.8-6.4x compression through two-stage quantization with virtually no quality loss.

## Why KV Cache Is the Bottleneck

During Transformer inference, the attention computation for each token needs to access Key and Value vectors of all previous tokens. These vectors are stored in fp16, and memory consumption grows linearly with context length:

```
KV cache size ≈ 2 × num_layers × num_heads × head_dim × context_length × 2 bytes
```

Model weights are fixed, but the KV cache keeps growing as the conversation gets longer. This is why your MacBook can load a 32B model but OOMs during long conversations — it's not that the model is too large, it's the cache eating all the memory.

vLLM's PagedAttention solves the memory fragmentation problem of KV cache. TurboQuant takes a different angle: **directly shrinking each vector**.

## Stage 1: PolarQuant — Rotation + Scalar Quantization

The core observation of PolarQuant: after normalizing high-dimensional vectors to the unit sphere, coordinates approximately follow a Gaussian distribution and can be efficiently compressed with optimal scalar quantization.

The process:

1. **Extract L2 norm**, normalizing the vector to a unit vector
2. **Walsh-Hadamard random rotation** (O(d log d)) to evenly distribute information across all dimensions — avoiding some coordinates being extremely large while others are near zero
3. **Optimal scalar quantization**: use Lloyd's algorithm to pre-compute the optimal codebook for the Gaussian distribution, quantizing each coordinate
4. Store quantization indices + norm

The rotation step is critical. Without rotation, outlier dimensions severely degrade quantization quality. The Walsh-Hadamard transform is faster than random matrices (O(d log d) vs O(d²)) and is orthogonal and distance-preserving.

## Stage 2: QJL — 1-bit Residual Compression

PolarQuant reconstruction inevitably has residuals. QJL (Quantized Johnson-Lindenstrauss) uses extreme compression to preserve residual information:

1. Compute residual = original vector - Stage 1 reconstruction
2. Store residual L2 norm
3. Multiply by a random projection matrix, take the **sign** → only 1 bit per dimension

The Johnson-Lindenstrauss lemma guarantees: after random projection, the inner product relationships between vectors are preserved with high probability in high dimensions. 1-bit is coarse, but when dimensions are high enough (LLM head_dim is typically >= 64), it's statistically sufficient to compensate for Stage 1's quantization error.

The combined compression of both stages:

| Format | Stage 1 | Stage 2 | Total bits/element | Compression ratio (vs fp16) |
|--------|---------|---------|-------------------|---------------------------|
| turbo2 | 1-bit | 1-bit | 2 | 6.4x |
| turbo3 | 2-bit | 1-bit | 3 | 4.6-5.1x |
| turbo4 | 3-bit | 1-bit | 4 | 3.8x |

## Asymmetric K/V Strategy: The Most Important Design Decision

TurboQuant+ uses different quantization strategies for the Key cache and Value cache:

- **K cache** → `TurboQuant` (two-stage, PolarQuant + QJL)
- **V cache** → `TurboQuantMSE` (PolarQuant only, no QJL)

The reason lies in different mathematical properties:

- Attention score computation is **Q . K^T** (inner product), which requires preserving angular relationships between vectors → QJL's JL property is designed to preserve inner products
- Attention weighted sum is **softmax(scores) . V** (linear combination), which only needs MSE minimization → PolarQuant alone is sufficient

This asymmetric design stems from the project's three key research findings.

## Three Key Research Findings

### V Compression Is Nearly Free

Compressing the Value cache to 2-bit barely affects attention output quality — provided Key precision is maintained. This finding is counterintuitive, but experimental data is highly consistent: V's quantization error gets diluted by the softmax weighted average.

### K Compression Is the Sole Source of Quality Degradation

All measurable quality degradation comes from Key cache compression. This explains why asymmetric configurations (high-precision K + low-precision V) can significantly recover quality. With turbo4 using 3+1 bit for K and only 3 bit for V, it achieves near-lossless performance.

### Boundary Layer Sensitivity

The first and last two layers of a Transformer are particularly sensitive to quantization. Protecting these layers (no compression or higher precision) can recover **37-91%** of the quality gap. This strategy has minimal cost — a 32-layer model only needs to protect 4 extra layers, increasing memory by less than 15%.

## Real-World Performance Data

turbo4 benchmarks on Apple M5 Max:

| Metric | turbo4 | q8_0 (baseline) |
|--------|--------|-----------------|
| Perplexity | 6.125 | 6.111 |
| Prefill speed | ~2747 tokens/sec | — |
| Decode speed | ~0.9x baseline | 1x |
| Memory compression | 3.8x | 1x |

Perplexity differs by only 0.014, which is virtually imperceptible. This gap only becomes noticeable at turbo3 and turbo2.

The community has validated results on M1-M5 Mac, NVIDIA RTX 3080 Ti / 3090 / 4090 / 5090, and AMD RX 9070 XT.

## How to Use on Mac

### Current Status

TurboQuant+'s llama.cpp integration is being pushed upstream via PR. There are currently two ways to try it:

### Option 1: Python Prototype (Principle Verification)

```bash
git clone https://github.com/TheTom/turboquant_plus
cd turboquant_plus
pip install .

# Run demo to see compression results
python benchmarks/demo.py

# Full benchmark
python benchmarks/run_benchmark.py
```

Requirements: Python 3.10+, NumPy, SciPy. This is numerical verification, not actual LLM inference.

### Option 2: llama.cpp + Metal (Actual Inference)

```bash
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
cmake -B build -DGGML_METAL=ON
cmake --build build --config Release -j
```

`-DGGML_METAL=ON` enables Apple Metal GPU acceleration. `-ngl 99` offloads all layers to the GPU.

### Mac Hardware Reference

| Mac Memory | Recommended Model | Quantization Format | Expected Performance |
|-----------|------------------|--------------------|--------------------|
| 16 GB | 7-8B | Q4_K_M | ~30-40 t/s |
| 36 GB | 14-32B | Q4_K_M | ~8-25 t/s |
| 64 GB | 70B | Q4_K_M | ~5-8 t/s |
| 96-128 GB | 104B @ 128K ctx | turbo4 | Verified feasible |

TurboQuant's sweet spot is **32GB+ with long context scenarios** — the longer the context, the higher the KV cache proportion, and the greater the compression benefit. For short conversations, traditional quantization is sufficient.

## Comparison with Other KV Cache Optimizations

| Method | Strategy | Compression Ratio | Quality Impact |
|--------|----------|-------------------|---------------|
| PagedAttention (vLLM) | Eliminate memory fragmentation | ~1.25x | Zero |
| KV cache eviction | Drop unimportant tokens | Variable | Lossy |
| GQA / MQA | Share KV heads | 4-8x | Decided at training time |
| KIVI / KVQuant | Per-channel quantization | 2-4x | Low |
| **TurboQuant** | Rotation + optimal quantization + JL residual | **3.8-6.4x** | Very low |

TurboQuant's advantage: high compression ratio, no retraining required, and can be stacked with PagedAttention.

## Overall Takeaway

TurboQuant+ is currently the open-source KV cache quantization scheme with the highest compression ratio and the most solid theoretical foundation. The two-stage design (PolarQuant handles the main body + QJL compensates residuals) is mathematically elegant and practically viable in engineering.

For Mac users, once the llama.cpp upstream merge lands, this will be a killer optimization for long contexts — the same memory can support 3-4x the context length. A 36GB M3 Pro with turbo4 has the potential to stably run 32K or even longer contexts on a 32B model.

## References

- [TurboQuant+ GitHub repo](https://github.com/TheTom/turboquant_plus)
- [llama.cpp GitHub repo](https://github.com/ggerganov/llama.cpp)
- [vLLM — From PagedAttention to Production-Grade LLM Inference Engine](/posts/ai/2026-03-14-vllm-inference-engine)
- [Ollama Local LLM Guide](/posts/ai/2026-03-14-ollama-local-llm-guide)
