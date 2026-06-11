---
title: "llama.cpp — From Pure C++ to an LLM Inference Engine on Consumer Hardware"
date: 2026-04-01
type: guide
category: ai
tags: [llama-cpp, gguf, quantization, llm-inference, apple-silicon, metal, cuda, local-llm]
lang: en
tldr: "llama.cpp is the most widely used local LLM inference engine, implemented in pure C/C++. It supports CPU, Metal, CUDA, Vulkan, and other backends, and uses the GGUF quantization format to run multi-billion-parameter models on consumer hardware."
description: "A deep dive into llama.cpp's core architecture (GGML tensor library, GGUF format), complete quantization format breakdown (Q/K/IQ series), hardware backends, CLI tools, server mode, speculative decoding, and comparisons with MLX, vLLM, and ExLlamaV2."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-01-llama-cpp-local-llm-inference)

Ollama lets you run a model with a single command, and the engine doing the actual work under the hood is llama.cpp. If you've used Ollama but found it too opaque — and want more control over quantization formats, GPU layer offloading, speculative decoding, or building directly against an OpenAI-compatible API — llama.cpp is the layer you need to dig into.

This post covers llama.cpp's core architecture, the logic behind choosing quantization formats, differences across hardware backends, practical usage, and where it stands in 2026.

## Core Architecture: GGML + GGUF

llama.cpp was started by Georgi Gerganov in March 2023, originally just to run LLaMA on a MacBook. As of March 2026, it has **100K+ GitHub stars, 1,039+ contributors, and 4,828+ commits**. In February 2026, Gerganov and the ggml.ai team officially joined Hugging Face, and the project moved from `ggerganov/llama.cpp` to `ggml-org/llama.cpp`.

The core design decision: **no Python dependency, no PyTorch dependency, no CUDA dependency** — tensor operations are implemented from scratch in pure C/C++.

The foundation is **GGML** (Georgi Gerganov Machine Learning), an extremely lightweight tensor library:

- 16 quantized data types
- Computation graph model (DAG) — define once, execute many times
- Context-based contiguous memory allocation, cache-friendly
- Pluggable backend architecture (runtime auto-detection of optimal hardware)
- Zero runtime dependencies — compiles to a single binary

Models are stored in **GGUF** (GGML Unified Format), a self-describing binary format:

```
GGUF File Structure:
┌─────────────────────────┐
│ Magic Number (GGUF)     │
│ Version                 │
│ Metadata (key-value)    │  ← Model architecture, quantization type, tokenizer, context length...
│ Tensor Info             │  ← Name, shape, and offset of each tensor
│ Tensor Data             │  ← Actual quantized weights
└─────────────────────────┘
```

GGUF replaced the earlier GGML format in August 2023. Key improvements:

- **Single-file, self-contained**: metadata, tokenizer, and model weights all in one file
- **Memory-mappable**: tensor data can be accessed directly via mmap without loading the entire file into memory, dramatically speeding up load times
- **Mixed quantization**: different tensors within the same file can use different quantization formats
- **Supports 50+ model architectures**: LLaMA, Mistral, Qwen, Gemma, DeepSeek, Phi, and more

Nearly all community-quantized models on HuggingFace are published in GGUF. It has become the de facto standard format for local LLMs.

## Quantization Formats: A Complete Breakdown

This is the most important part of llama.cpp to understand. The quantization format determines the trade-off between model size, inference speed, and output quality.

### Naming Convention

```
Q4_K_M
│ │ │
│ │ └── Size: S(mall) / M(edium) / L(arge)
│ └──── K: K-quant, advanced quantization using k-means clustering
└────── 4: 4 bits per weight
```

- **Q series** (Q4_0, Q4_1, Q5_0, Q5_1, Q8_0): Basic quantization — per-block symmetric or asymmetric quantization with a uniform scale. Q4_0 stores one fp16 scale per 32 floats + 32 4-bit integers; Q4_1 adds an offset (`w = d * q + m`) for slightly higher precision
- **K series** (Q3_K_S, Q4_K_M, Q5_K_M, Q6_K): K-quant — **uses different precision for different tensor types** — sensitive layers (attention projection, output) get more bits, while FFN layers are compressed more aggressively. The S/M/L suffix controls compression level: **S** (Small) is more aggressive, **M** (Medium) is balanced, **L** (Large) is more conservative
- **IQ series** (IQ1_S, IQ2_XXS, IQ3_M, IQ4_NL): Importance-weighted quantization — uses a calibration dataset to compute an importance matrix, combined with lattice codebook vector quantization. Better quality at the same bit width compared to K series, but the quantization process is slower and requires calibration data

### Format Comparison Table

| Format | bits/weight | 7B Model Size | PPL Increase | Use Case |
|------|------------|-----------|---------|---------|
| Q2_K | ~3.2 | ~2.95 GB | High | Extreme memory constraints |
| IQ3_M | ~3.8 | ~3.52 GB | Low | Tight memory but want better quality |
| Q4_0 | ~4.5 | ~3.83 GB | +0.2499 | Legacy baseline, not recommended |
| Q4_K_S | ~4.7 | ~4.36 GB | +0.1149 | Limited memory but want K-quant |
| **Q4_K_M** | **~4.9** | **~4.58 GB** | **+0.0535** | **Best choice for most people** |
| Q5_K_M | ~5.7 | ~5.33 GB | Very low | Quality priority |
| Q6_K | ~6.6 | ~6.14 GB | Near zero | Use this if you have enough memory |
| Q8_0 | ~8.5 | ~7.95 GB | ≈ 0 | Highest quality requirement |
| F16 | 16 | ~14.96 GB | Baseline | Reference only |

Note that Q4_K_M's PPL increase is only +0.0535, while legacy Q4_0 is +0.2499 — **at the same 4-bit width, K-quant is an order of magnitude better in quality**.

**How to choose?** If you have enough memory, go with Q6_K. For general use, Q4_K_M. For extreme memory savings, IQ3_M. Another rule of thumb: **a larger model at lower quantization usually beats a smaller model at higher quantization** — 14B Q4_K_M is typically smarter than 7B Q8_0.

### IQ Formats: The Extreme Compression Option

IQ (importance quantization) formats have two core innovations:

1. **Importance matrix (imatrix)**: Runs a calibration dataset to determine which weights have the greatest impact on output, and prioritizes preserving those weights during compression
2. **Lattice codebook**: Uses optimized vector quantization codebooks instead of simple linear quantization, providing greater expressiveness at the same bit width

| Format | bits/weight | 7B Model Size | Notes |
|------|------------|-----------|------|
| IQ1_S | ~1.87 | ~1.87 GB | Extreme compression, significant quality loss |
| IQ2_XXS | ~2.4 | ~2.23 GB | Ultra-low bit, requires imatrix |
| IQ3_M | ~3.8 | ~3.52 GB | Better quality than Q3_K at the same bit width |
| IQ4_XS | ~4.3 | — | Importance-weighted 4-bit |
| IQ4_NL | ~4.5 | — | Non-linear 4-bit quantization |

There are also **TQ (Ternary Quantization)** formats: TQ1_0 (1.69 bpw) and TQ2_0 (2.06 bpw), which represent weights using only three values: -1/0/+1. These are the most extreme compression methods available.

IQ format quantization requires first generating calibration data with `llama-imatrix`. Skipping this step will cause `llama-quantize` to warn. Decoding speed is slightly slower than the K series. Currently best supported on CPU and Metal.

## Hardware Backends

Cross-platform capability is llama.cpp's greatest competitive advantage.

### Apple Metal

The go-to backend for Mac users. Apple Silicon's unified memory architecture lets CPU and GPU share the same memory pool — no extra data transfers needed.

```bash
cmake -B build -DGGML_METAL=ON
cmake --build build --config Release -j
```

`-ngl 99` offloads all layers to the GPU. The Metal backend is very efficient on M-series chips because there's no PCIe bandwidth bottleneck like with NVIDIA.

### NVIDIA CUDA

The highest-performance backend, especially on high-end consumer cards (RTX 4090, 5090).

```bash
cmake -B build -DGGML_CUDA=ON
cmake --build build --config Release -j
```

Supports Flash Attention (`-fa` flag) and tensor parallelism across multiple GPUs. VRAM is a hard limit — anything that exceeds it falls back to CPU, and speed drops off a cliff.

### Vulkan

A cross-platform GPU backend supporting NVIDIA, AMD, and Intel GPUs. Performance is slightly lower than native CUDA/Metal (roughly 80-90%), but wins on universality.

```bash
cmake -B build -DGGML_VULKAN=ON
```

For AMD users who find ROCm too much hassle, Vulkan is a simpler alternative.

### CPU

You can run without a GPU — it's just slower. Supports AVX2/AVX-512 (x86) and ARM NEON (Apple Silicon, Raspberry Pi). IQ formats have special CPU optimizations and can be faster than Q formats in certain cases.

### The Key to Performance: Memory Bandwidth

LLM text generation is a **memory bandwidth bottleneck**, not a compute bottleneck — the GPU spends most of its time waiting for data to arrive from memory, not doing math. This explains a counterintuitive phenomenon:

| Hardware | Memory Bandwidth | 8B Q4_K_M Decode | Notes |
|------|-----------|-----------------|------|
| M3 Pro 36GB | 150 GB/s | ~20 tok/s | Metal |
| M2 Pro 32GB | 200 GB/s | ~38-48 tok/s | Higher bandwidth than M3 Pro! |
| M4 Max 128GB | 546 GB/s | ~70-80 tok/s | Metal |
| RTX 4090 24GB | ~1 TB/s | ~120-150 tok/s | CUDA |
| RTX 3060 12GB | 360 GB/s | ~35 tok/s | CUDA |
| i9-13900K (CPU) | ~90 GB/s | ~12 tok/s | AVX2 |

The M2 Pro has **higher memory bandwidth than the M3 Pro** (200 vs 150 GB/s), so it's actually faster at decoding. The RTX 4090 is unbeatable when the model fits entirely in VRAM, but a 70B model exceeds 24GB and must be offloaded to CPU, causing speed to drop off a cliff — at that point, a 128GB M4 Max is actually faster because unified memory eliminates data transfers.

**Apple Silicon's advantage is capacity; NVIDIA's advantage is bandwidth.**

## CLI Tools

After compilation, llama.cpp produces several key binaries:

### llama-cli: Interactive Inference

```bash
# Basic usage
llama-cli -m model.gguf -p "Explain quantum computing" -n 256

# Full parameter example
llama-cli \
  -m llama-3.1-8b-q4_k_m.gguf \
  -ngl 99 \          # GPU offload layers
  -c 8192 \          # context length
  -t 8 \             # CPU threads
  -fa \              # Flash Attention
  --temp 0.7 \       # temperature
  --top-p 0.9 \      # nucleus sampling
  -p "Write a haiku about coding"
```

Add `-i` for interactive mode, or `--conversation` for multi-turn chat.

### llama-server: OpenAI-Compatible API

```bash
llama-server \
  -m model.gguf \
  -ngl 99 \
  -c 8192 \
  --port 8080 \
  --host 0.0.0.0 \
  -np 4              # 4 parallel slots
```

Once started, it provides:

- `POST /v1/chat/completions` — Chat (OpenAI-compatible)
- `POST /v1/completions` — Text generation
- `POST /v1/embeddings` — Embeddings
- `POST /v1/messages` — **Anthropic Messages API compatible**
- `POST /reranking` — Document reranking
- `GET /health` — Health check
- `GET /metrics` — Prometheus metrics
- Built-in Web UI (open `http://localhost:8080` in a browser)

Supports function calling, structured output (JSON Schema), vision input, reasoning/thinking mode, dynamic LoRA loading, SSL/TLS, and API key authentication. Any tool that supports the OpenAI or Anthropic API can connect directly.

### llama-quantize: Model Quantization

```bash
# Quantize an fp16 model to Q4_K_M
llama-quantize model-f16.gguf model-q4_k_m.gguf Q4_K_M

# IQ formats require calibration data
llama-quantize --imatrix imatrix.dat model-f16.gguf model-iq3_m.gguf IQ3_M
```

Calibration data for IQ formats can be generated with the `llama-imatrix` tool — feed it a representative text corpus to compute each weight's importance.

### llama-bench: Performance Benchmarking

```bash
llama-bench -m model.gguf -ngl 99 -t 8
```

Outputs prompt processing (prefill) and token generation (decode) speeds, making it easy to compare different quantization formats and hardware configurations.

## Advanced Features

### Speculative Decoding

LLM decoding is memory bandwidth-bound — processing N tokens at once takes roughly the same time as processing 1. Speculative decoding exploits this: it cheaply and quickly guesses multiple candidate tokens, then has the large model verify them all at once.

llama.cpp supports several speculation methods:

| Method | Principle | Speedup |
|------|------|---------|
| **Draft model** | A small model (e.g., 1B) generates a draft, the large model verifies | 1.8-2x, up to 3x |
| **ngram-simple** | Matches n-grams in the already-generated token history and uses subsequent tokens as drafts | Low overhead |
| **ngram-mod** | Hash-based n-gram statistics, shared across server slots, ~16MB memory | Low overhead |

```bash
# Draft model approach
llama-server \
  -m large-model.gguf \
  -md draft-model.gguf \
  -ngl 99 -ngld 99 \
  --draft-max 16 \
  --spec-type draft

# N-gram approach (no additional model needed)
llama-server \
  -m model.gguf -ngl 99 \
  --spec-type ngram-mod \
  --spec-ngram-size-n 12
```

The best draft model pairing: large and small models from the same family (e.g., Llama 3.1 8B + 1B) — vocabularies must match. 0.5-1B draft models work best; going too large is counterproductive. **Code generation** benefits the most from speculative decoding due to its repetitive patterns.

### Grammar-Constrained Sampling

Use BNF grammar to constrain model output format, with a 100% structural guarantee:

```bash
llama-cli -m model.gguf --grammar 'root ::= "{" "\"name\":" [^}]+ "}"' -p "Generate a JSON"
```

Stronger than JSON mode — you can define arbitrary grammar rules to ensure output is valid JSON, SQL, or any custom format.

### Flash Attention

Flash Attention is **enabled by default** in llama.cpp. Use `-fa off` to disable it if needed.

Real-world benchmarks (M3 Max, Llama 3 8B, ~26K tokens):
- Without FA: first token 80s, generation 11 tok/s
- With FA: first token 72s, generation 32 tok/s — **~3x generation speed**

The main benefit is during the prefill phase (processing long inputs) — the longer the context, the more pronounced the effect. A few models may show quality differences on specific GPUs, but llama.cpp automatically falls back for unsupported cases.

### Multimodal Inference

**libmtmd**, added in April 2025, unified multimodal support. It supports vision-language models like LLaVA, Gemma 3, Qwen2-VL, and MobileVLM, and has begun supporting audio input:

```bash
llama-mtmd-cli -m model.gguf --mmproj mmproj.gguf -p "Describe this image" --image photo.jpg
```

llama-server also has built-in multimodal support and can receive images via the OpenAI-compatible API.

## Getting Models from HuggingFace

The simplest approach is to use llama.cpp's built-in HuggingFace integration — one command does it all:

```bash
# Download and run directly from HuggingFace
llama-cli -hf ggml-org/gemma-3-1b-it-GGUF --conversation
```

Or manually download community-quantized GGUFs:

```bash
pip install huggingface_hub
huggingface-cli download bartowski/Meta-Llama-3.1-8B-Instruct-GGUF \
  --include "Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf" \
  --local-dir ./models
```

If you want to convert from safetensors yourself:

```bash
# Convert to fp16 GGUF
python convert_hf_to_gguf.py /path/to/hf-model --outfile model-f16.gguf

# Then quantize
llama-quantize model-f16.gguf model-q4_k_m.gguf Q4_K_M
```

Search for the `GGUF` tag on HuggingFace to find a large selection of pre-quantized models. Common quantizers include bartowski, TheBloke, and mradermacher.

## Python Bindings

If you'd rather not use the CLI, `llama-cpp-python` provides a Python interface:

```python
from llama_cpp import Llama

llm = Llama(
    model_path="model-q4_k_m.gguf",
    n_gpu_layers=-1,    # Offload everything to GPU
    n_ctx=8192,
    flash_attn=True,
)

output = llm.create_chat_completion(
    messages=[{"role": "user", "content": "What is KV cache?"}],
    temperature=0.7,
)
print(output["choices"][0]["message"]["content"])
```

It also provides an OpenAI-compatible server:

```bash
pip install 'llama-cpp-python[server]'
python -m llama_cpp.server --model model.gguf --n_gpu_layers -1
```

## Comparison with Other Inference Engines

| | llama.cpp | MLX | vLLM | ExLlamaV2 |
|---|---|---|---|---|
| Language | C/C++ | Python (Apple) | Python | Python/CUDA |
| Hardware | CPU, Metal, CUDA, Vulkan, ROCm | Apple Silicon only | Primarily GPU (NVIDIA/AMD/Intel) | NVIDIA only |
| Quant Format | GGUF (Q/K/IQ) | MLX 4-bit | AWQ, GPTQ, fp8 | EXL2 |
| Positioning | Cross-platform local inference | Apple ecosystem optimized | Production-grade high throughput | Maximum speed on NVIDIA |
| Server Mode | Yes (OpenAI-compatible) | Community solutions | Native | Yes (tabbyAPI) |
| Model Source | HuggingFace GGUF | HuggingFace MLX | HuggingFace original | HuggingFace EXL2 |

Key decision points:

- **vs Ollama**: Ollama's underlying engine is llama.cpp, wrapped in a Go layer. Using llama.cpp directly is **13-80% faster** than Ollama (depending on the scenario), but Ollama offers a better developer experience
- **Mac users**: Both llama.cpp (Metal) and MLX are solid choices. MLX is 30-50% faster on Apple Silicon, but llama.cpp has a larger ecosystem and model selection
- **NVIDIA users**: For production use vLLM (35x higher multi-user throughput); for local use, llama.cpp or ExLlamaV2
- **Cross-platform**: llama.cpp is the only engine that supports CPU/Metal/CUDA/Vulkan/ROCm across the board

## Mac Quick Start

```bash
# 1. Build (Metal is auto-enabled)
git clone https://github.com/ggml-org/llama.cpp
cd llama.cpp
cmake -B build    # Metal is enabled by default on macOS
cmake --build build --config Release -j

# Or use Homebrew
brew install llama.cpp

# 2. Download a model
huggingface-cli download bartowski/Meta-Llama-3.1-8B-Instruct-GGUF \
  --include "Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf" \
  --local-dir ./models

# 3. Run it
llama-cli \
  -m models/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf \
  -ngl 99 -c 8192 -fa \
  --conversation

# 4. Or start the server
llama-server \
  -m models/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf \
  -ngl 99 -c 8192 -fa \
  --port 8080
```

Recommendations for M3 Pro 36GB: Use Q6_K (~5.5 GB) for 8B models, Q4_K_M (~8.5 GB) for 14B, and Q4_K_M (~20 GB) for 32B. Reserve the remaining memory for KV cache and the system.

## The Big Picture

llama.cpp is the infrastructure layer of local LLM inference. Ollama, LM Studio, and GPT4All all run on top of it. The benefit of using llama.cpp directly is full control over quantization format selection, GPU offload strategy, context length allocation, and sampling parameters — all of which are automated in Ollama, which is convenient but opaque.

In 2026, llama.cpp is far more than "running LLaMA on a CPU." It's a mature multi-backend inference engine supporting 50+ model architectures with 100K+ GitHub stars. Development has accelerated since the ggml.ai team joined Hugging Face — MCP client support, Anthropic API compatibility, audio input, and autoparser structured output are all recent additions.

If you're already using Ollama and satisfied with it, there's no need to switch. But if you want a deeper understanding of every aspect of local inference, or need features Ollama doesn't support (speculative decoding, grammar sampling, custom quantization), llama.cpp is the next step.

## References

- [llama.cpp GitHub repo](https://github.com/ggml-org/llama.cpp)
- [ggml.ai Joins Hugging Face Announcement](https://huggingface.co/blog/ggml-joins-hf)
- [GGUF Format Specification](https://github.com/ggml-org/ggml/blob/master/docs/gguf.md)
- [HuggingFace GGUF Model Search](https://huggingface.co/models?library=gguf)
- [Quantization Format Selection Study (January 2026 Paper)](https://arxiv.org/html/2601.14277v1)
- [Ollama Complete Guide: Run LLMs Locally with One Command](/posts/ai/2026-03-14-ollama-local-llm-guide)
- [vLLM — From PagedAttention to a Production-Grade LLM Inference Engine](/posts/ai/2026-03-14-vllm-inference-engine)
- [TurboQuant+ — Two-Stage KV Cache Quantization Compression](/posts/ai/2026-04-01-turboquant-plus-kv-cache-compression)
