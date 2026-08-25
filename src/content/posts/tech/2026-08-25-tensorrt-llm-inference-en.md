---
title: "TensorRT-LLM: The Compile-for-Performance NVIDIA-Only LLM Inference Engine"
date: 2026-08-25
category: tech
type: deep-dive
tags: [tensorrt-llm, nvidia, llm-inference, gpu, self-hosted, cuda]
lang: en
tldr: "TensorRT-LLM is NVIDIA's open-source LLM inference library (Apache 2.0). It offline-compiles model weights and compute graphs into optimized TensorRT engines, then serves them with custom CUDA kernels, in-flight batching, and multi-dimensional parallelism. The cost: NVIDIA GPUs only, compilation takes tens of minutes, and switching models or quantization means rebuilding."
description: "A deep dive into TensorRT-LLM's build → runtime two-phase architecture, core optimizations (FP8/FP4, in-flight batching, speculative decoding, multi-dimensional parallelism), CLI tools, integration with Triton Inference Server, and selection trade-offs against vLLM and SGLang."
series:
  name: "Self-Hosted Inference"
  order: 7
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-25-tensorrt-llm-inference)

[TensorRT-LLM](https://github.com/NVIDIA/TensorRT-LLM) is NVIDIA's open-source library for LLM inference. The key difference from vLLM and SGLang is an explicit "compilation" step: model weights and compute graphs are offline-converted into a TensorRT engine, and the runtime uses that engine for inference.

This two-phase design lets TensorRT-LLM extract peak performance on NVIDIA GPUs — typically 15–30% faster than vLLM on H100, sometimes 2–4× in certain scenarios. The trade-offs are equally clear: NVIDIA GPUs only, compilation takes 20–30 minutes, and every model or quantization change requires a rebuild.

## Two-Phase Architecture: Build → Runtime

### Build Phase

Build is the defining design of TensorRT-LLM. You provide HuggingFace weights or a checkpoint, and TensorRT-LLM:

1. Loads the model definition (PyTorch-native architecture description)
2. Applies quantization (FP8, FP4, INT4 AWQ, etc.)
3. Feeds the compute graph to the TensorRT compiler for kernel fusion, memory scheduling, and layer-level optimization
4. Outputs one or more `.engine` files, bound to a specific GPU architecture

```bash
# One-step: build + launch OpenAI-compatible API
trtllm-serve \
  --model meta-llama/Llama-3.1-8B-Instruct \
  --backend tensorrt \
  --tp 2
```

`trtllm-serve` automatically downloads weights, builds the engine, and starts an OpenAI-compatible API server. First-run compilation time depends on model size and GPU: ~10–15 minutes for 7B, ~30–60 minutes for 70B. Cached engines skip the build on subsequent runs.

Manual build gives you more control:

```python
from tensorrt_llm import LLM, SamplingParams

llm = LLM(
    model="meta-llama/Llama-3.1-8B-Instruct",
    tensor_parallel_size=2,
    quantization="fp8",
)
```

### Runtime Phase

Once the engine is compiled, inference is handled by the C++ runtime. Core capabilities:

- **In-flight batching**: Unlike continuous batching that schedules per iteration, TensorRT-LLM can insert new requests before a batch's forward pass completes. This reduces GPU idle time further when mixing long and short prompts
- **KV cache management**: Supports paged attention, plus KV cache quantization (FP8, INT8) to extend usable context
- **Multiple decoding strategies**: greedy, beam search, top-k/top-p sampling, speculative decoding

## Core Optimizations

### Quantization

| Format | Precision | Best For |
|--------|-----------|----------|
| FP16 / BF16 | Baseline | Highest quality, sufficient memory |
| FP8 | Near FP16 | Sweet spot on H100/H200/L40S |
| FP4 | Slight degradation | Extreme memory constraints |
| INT4 AWQ | Lossy but controllable | Fitting large models on small GPUs |

FP8 is currently the best balance of performance and quality. H100's FP8 tensor core throughput is 2× its FP16; TensorRT-LLM can auto-calibrate and apply it.

### Parallelism

| Dimension | Purpose |
|-----------|---------|
| Tensor Parallel | Split layer weights across GPUs |
| Pipeline Parallel | Assign different layers to different GPUs |
| Expert Parallel | MoE expert routing parallelization |
| Context Parallel | Attention splitting for long sequences |

Dimensions can be combined. In practice, tensor parallel is the most common; pipeline parallel matters for cross-node deployments or extremely large models (it introduces bubbles).

### Speculative Decoding

A small draft model predicts multiple tokens; the target model verifies them in one pass. NVIDIA claims up to 3× throughput improvement. Works best when the draft model shares the target's vocabulary and has sufficient accuracy.

### Prefill-Decode Disaggregation

Separates prefill (processing the prompt) and decode (generating tokens) onto different GPU groups. Prefill is compute-bound; decode is memory-bound. Splitting scheduling lets each group run at optimal load. This matters at large scale; single-machine deployments typically don't need it.

## CLI Tools

TensorRT-LLM provides three main CLI tools:

```bash
# All-in-one: build + serve OpenAI API
trtllm-serve --model meta-llama/Llama-3.1-8B-Instruct

# Performance benchmarking
trtllm-bench \
  --model meta-llama/Llama-3.1-8B-Instruct \
  --input-length 512 \
  --output-length 256 \
  --concurrency 32

# Model evaluation (accuracy)
trtllm-eval \
  --model meta-llama/Llama-3.1-8B-Instruct \
  --tasks gsm8k,mmlu
```

`trtllm-bench` is especially useful for selection decisions: it measures actual throughput and latency for your specific combination of hardware, model, quantization, and parallelism settings, rather than relying on someone else's benchmark.

## Integration with Triton Inference Server

TensorRT-LLM is an inference engine; Triton is a model server. Their relationship parallels vLLM and Ray Serve:

- **TensorRT-LLM** handles GPU kernels, batching, KV cache, decoding
- **Triton** handles HTTP/gRPC APIs, model repository, version management, ensembles, monitoring

NVIDIA provides the [TensorRT-LLM Backend for Triton](https://github.com/triton-inference-server/tensorrtllm_backend), mounting TensorRT-LLM engines as a Triton backend. This lets TensorRT-LLM's LLM inference coexist with other models on Triton (embeddings, rerankers, pre/post-processing).

That said, `trtllm-serve` already includes a built-in OpenAI-compatible API. If you don't need Triton's model repository or ensemble capabilities, using `trtllm-serve` directly is simpler.

## Hardware Requirements

**NVIDIA GPUs only.** This is the most decisive selection constraint.

| Item | Requirement |
|------|-------------|
| GPU | NVIDIA H100, H200, L40, L4, RTX 40/50 series |
| CUDA | 13.2.1+ |
| Python | 3.10+ |
| PyTorch | 2.1.2+ |
| Memory | At least enough for quantized model weights + KV cache |

Consumer GPUs: RTX 4090 (24 GB) can run 7B FP8 or 14B INT4. RTX 4060 (8 GB) is limited to very small models.

Data center GPUs: H100 (80 GB) is TensorRT-LLM's highest-performance platform. With NVLink and NVSwitch for multi-GPU, AllReduce can achieve 3× speedup.

## How to Choose: TensorRT-LLM vs vLLM vs SGLang

| | TensorRT-LLM | vLLM | SGLang |
|---|---|---|---|
| Hardware | NVIDIA only | NVIDIA, AMD, CPU | NVIDIA, AMD |
| Compilation step | Required (10–60 min) | None | None |
| Typical perf gap | Baseline | 15–30% slower | Close to vLLM |
| Model switching | Requires rebuild | Instant load | Instant load |
| Community | NVIDIA-led | Largest open-source | Academic + community |
| API | OpenAI-compatible | OpenAI-compatible | OpenAI-compatible |
| Quantization | FP8/FP4/INT4 most complete | FP8/GPTQ/AWQ | FP8/GPTQ/AWQ |

### When Is the Compilation Cost Worth It

TensorRT-LLM's performance advantage comes from offline compilation — it has more time for kernel fusion and memory scheduling. This means:

- Model is fixed, serving long-term: worth it. One-time compilation cost is amortized across millions of inferences
- Frequently switching models or experimenting with quantization: not worth it. Waiting for builds each time adds up
- Non-NVIDIA hardware: impossible. No alternative
- Latency-critical workloads (e.g., trading): worth it. A 30% latency gap is decisive in some contexts
- Team lacks CUDA debugging skills: think twice. Engine build failures produce less friendly errors than Python

A simple decision rule: if your inference service will run the same model for more than a week, and the hardware is NVIDIA, at least run `trtllm-bench` once. A 15–30% performance gap translates to real GPU rental savings.

## References

- [TensorRT-LLM GitHub Repository](https://github.com/NVIDIA/TensorRT-LLM)
- [TensorRT-LLM Documentation](https://nvidia.github.io/TensorRT-LLM/)
- [TensorRT-LLM Backend for Triton](https://github.com/triton-inference-server/tensorrtllm_backend)
- [NVIDIA TensorRT Developer Guide](https://docs.nvidia.com/deeplearning/tensorrt/developer-guide/)
- [vLLM: The Default Choice for Self-Hosted Inference](/posts/ai/2026-08-21-vllm-self-host-decision-en)
- [NVIDIA Triton Inference Server](/posts/tech/2026-08-22-triton-inference-server-en)
- [SGLang: Self-Hosted Inference](/posts/tech/2026-08-22-sglang-inference-server-en)
