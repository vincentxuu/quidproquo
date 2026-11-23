---
title: "TensorRT-LLM: NVIDIA's GPU-Only LLM Inference Engine, and Why It Dropped the Compile Step"
date: 2026-08-25
category: tech
type: deep-dive
tags: [tensorrt-llm, nvidia, llm-inference, gpu, self-hosted, cuda]
lang: en
tldr: "TensorRT-LLM is NVIDIA's open-source LLM inference library (Apache 2.0). It pushes NVIDIA GPUs to their limit with NVIDIA's own CUDA kernels, FP8/NVFP4 quantization, in-flight batching, and multi-dimensional parallelism. It used to require compiling the model offline into a TensorRT engine; the PyTorch architecture became the default in 1.0, and version 1.3 (November 2026) removed the TensorRT backend entirely, so it now loads Hugging Face weights directly, like vLLM. The constraint that has not changed: NVIDIA GPUs only."
description: "A deep dive into TensorRT-LLM's move from a build → runtime two-phase design to a single PyTorch backend, its core optimizations (FP8/NVFP4, in-flight batching, speculative decoding, multi-dimensional parallelism, prefill-decode disaggregation), CLI tools, integration with Triton Inference Server, and selection trade-offs against vLLM and SGLang."
series:
  name: "Self-Hosted Inference"
  order: 7
draft: false
---

> :globe: [中文版](/posts/tech/2026-08-25-tensorrt-llm-inference)

[TensorRT-LLM](https://github.com/NVIDIA/TensorRT-LLM) is NVIDIA's open-source library for LLM inference. Its biggest difference from vLLM and SGLang has always been that it is written only for NVIDIA GPUs: kernels, quantization formats, and parallelism strategies follow each NVIDIA hardware generation. On H100 it is typically 15–30% faster than vLLM, sometimes 2–4× in certain scenarios.

It used to have a second difference: an explicit "compilation" step that converted model weights and compute graphs offline into a TensorRT engine, which the runtime then served. That design became history with version 1.3.0, released 2026-11-20: the TensorRT backend was removed entirely and PyTorch is now the only execution backend. This post covers that shift first, then what it can do today and how to choose.

## From Two Phases to a Single PyTorch Backend

### The Old Design: Build → Runtime

Early TensorRT-LLM required a build: load the model definition, apply quantization, feed the compute graph to the TensorRT compiler for kernel fusion and memory scheduling, and emit `.engine` files bound to a specific GPU architecture. A build took tens of minutes and had to be redone for every change of model, quantization, or GPU. What you got in return was the highest throughput available at the time; what you paid was flexibility.

### 1.0 to 1.3: The Compile Step Goes Away

Version 1.0 (September 2025) made the PyTorch-based architecture the stable, default experience, leaving TensorRT engines as an option. Version 1.3.0 (November 2026) went further; the release notes list it as a breaking change:

- The TensorRT backend is removed; PyTorch is the only backend
- `trtllm-build`, `trtllm-refit`, and the per-model `convert_checkpoint.py` scripts are gone; Hugging Face checkpoints load directly
- The legacy C++ Executor and runtime APIs are removed
- TensorRT, ModelOpt, and ONNX are no longer install dependencies

Why remove it? The official [migration guide](https://github.com/NVIDIA/TensorRT-LLM/blob/main/docs/source/legacy/tensorrt-backend-removal.md) only says what changed. The trade-off is visible from the outcome, though: most of the performance has long come from NVIDIA's hand-written attention, GEMM, and MoE kernels, which work just as well inside the PyTorch architecture, while the compile step made every model change a wait and required a conversion script before a new model could run. Without it, new models get supported faster and usage lines up with vLLM and SGLang.

### How to Use It Now

```bash
# Load a Hugging Face model directly and start an OpenAI-compatible API server
trtllm-serve Qwen/Qwen3.5-9B

# For more speed, use a checkpoint NVIDIA has pre-quantized (GPU must support FP8)
trtllm-serve nvidia/Qwen3-8B-FP8
```

The Python LLM API works the same way, with no backend to pick:

```python
from tensorrt_llm import LLM, SamplingParams

llm = LLM(
    model="Qwen/Qwen3.5-9B",
    tensor_parallel_size=2,
)
outputs = llm.generate(["Explain KV cache in three points"], SamplingParams(max_tokens=256))
print(outputs[0].outputs[0].text)
```

If you are still on the old workflow: `LLM(backend="tensorrt")` now raises an error, `--backend tensorrt` has to go, and the `trtllm-serve` `--backend` flag itself is deprecated. Old `.engine` files can no longer be used; point at the original Hugging Face checkpoint instead.

## Core Runtime Capabilities

- **In-flight batching**: requests can join or leave a batch mid-execution, keeping GPU idle time low with mixed short and long prompts; conceptually the same as vLLM's continuous batching
- **KV cache management**: paged KV cache and prefix reuse; since 1.3 most model families use the new KV Cache Manager V2 by default, with FP8/NVFP4 KV cache and KV cache compression to extend usable context
- **Decoding strategies**: greedy, beam search, top-k/top-p sampling, speculative decoding
- **APIs**: OpenAI-compatible `/v1/chat/completions`; 1.3 also adds the Anthropic Messages API (`/v1/messages`) and a gRPC server

## Core Optimizations

### Quantization

| Format | Precision | Best For |
|--------|-----------|----------|
| FP16 / BF16 | Baseline | Highest quality, sufficient memory |
| FP8 | Near FP16 | Sweet spot on Hopper (H100/H200) and Ada (L40S) |
| NVFP4 | Slight loss | Native on Blackwell; since 1.3 also runs weight-only on Hopper and Ada |
| MXFP8 | Near FP8 | New in 1.3; use it directly for models released in MXFP8 (such as MiniMax-M3) |
| INT4 AWQ | Lossy but controlled | Fitting large models on smaller GPUs |

Quantized weights now mostly come as pre-quantized checkpoints, such as the FP8/NVFP4 versions NVIDIA publishes on Hugging Face using Model Optimizer. H100's FP8 tensor cores deliver twice the throughput of FP16, so FP8 remains the best performance-to-quality balance; on Blackwell, look at NVFP4.

### Parallelism

| Dimension | Purpose |
|-----------|---------|
| Tensor Parallel | Split individual layer weights across multiple GPUs |
| Pipeline Parallel | Assign different layers to different GPUs |
| Expert Parallel | Parallelize MoE expert routing |
| Context Parallel | Split attention computation for long sequences |

Parallelism dimensions can be stacked. In practice, tensor parallelism is the most common; pipeline parallelism is only worth introducing for cross-node setups or extremely large models (it introduces pipeline bubbles).

### Speculative Decoding

Guess several tokens ahead, then let the target model verify them in one pass. Version 1.3 removed the two-model implementation that attaches a separate small draft model, keeping only one-model approaches such as EAGLE3 and MTP that attach draft heads to the target model, and it adds drafters such as DSpark and DFlash. The payoff depends on the acceptance rate, and 1.3 also adds an automatic switch-off when acceptance drops too low, so speculation does not slow things down.

### Prefill-Decode Disaggregation

Split prefill (processing the prompt) and decode (generating tokens) onto separate GPU groups. Prefill is compute-bound; decode is memory-bound. Scheduling them separately lets each group run at optimal load. This matters for large-scale deployments; single-machine setups typically don't need it.

## CLI Tools

TensorRT-LLM provides three main CLI tools:

```bash
# Start an OpenAI-compatible API
trtllm-serve Qwen/Qwen3.5-9B

# Benchmark: generate a synthetic dataset, then run throughput
trtllm-bench --model Qwen/Qwen3.5-9B prepare-dataset \
  --output /tmp/synthetic_512_256.txt \
  token-norm-dist --input-mean 512 --output-mean 256 \
  --input-stdev 0 --output-stdev 0 --num-requests 1000
trtllm-bench --model Qwen/Qwen3.5-9B throughput \
  --dataset /tmp/synthetic_512_256.txt

# Accuracy evaluation (officially for development, not recommended for production)
trtllm-eval --model Qwen/Qwen3.5-9B gsm8k
```

`trtllm-bench` is particularly useful for selection decisions: it measures actual throughput and latency for your specific combination of hardware, model, quantization, and parallelism under a given workload, rather than relying on someone else's benchmarks.

## Integration with Triton Inference Server

TensorRT-LLM is an inference engine; Triton is a model server. Their relationship is similar to vLLM and Ray Serve:

- **TensorRT-LLM** handles GPU kernels, batching, KV cache, and decoding
- **Triton** handles HTTP/gRPC APIs, model repository, version management, ensembles, and monitoring

NVIDIA provides the [TensorRT-LLM Backend for Triton](https://github.com/triton-inference-server/tensorrtllm_backend), letting TensorRT-LLM coexist with other models on Triton (embedding, reranker, pre/post-processing) on a single platform. Since 1.3 the backend only has the `llmapi` model, which goes through the LLM API; the old TensorRT-engine model configurations are removed, so the model repository has to change when you upgrade.

If you don't need Triton's model repository and ensemble features, `trtllm-serve` on its own is simpler.

## Hardware Requirements

**NVIDIA GPUs only.** This is the most definitive selection constraint.

| Item | Requirement (1.3.0) |
|------|-------------|
| GPU | Hopper (H100, H200), Blackwell (B200, GB300, RTX 50 series), Ada (L40S, L4, RTX 40 series), and more; 1.3 adds Rubin in preview |
| CUDA | 13.4.1 |
| Python | 3.10, 3.12 |
| PyTorch | 2.14.0 |
| Memory | Must fit quantized model weights + KV cache |

Consumer GPUs: An RTX 4090 (24 GB) can run 7B FP8 or 14B INT4. An RTX 4060 (8 GB) is limited to very small models.

Data center GPUs: H100/H200 are still the most common deployment platform; Blackwell (B200, GB300) has native NVFP4 and is where most new performance work lands first. With NVLink and NVSwitch for multi-GPU setups, AllReduce speed can reach 3×.

## How to Choose: TensorRT-LLM vs vLLM vs SGLang

| | TensorRT-LLM | vLLM | SGLang |
|---|---|---|---|
| Hardware | NVIDIA only | NVIDIA, AMD, Intel, TPU, and more | NVIDIA, AMD, TPU, Apple Silicon, and more |
| Compilation step | None (removed in 1.3) | None | None |
| Typical performance gap | Baseline | 15–30% slower | Close to vLLM |
| Model switching | Loads HF checkpoints directly | Loads directly | Loads directly |
| Ecosystem | NVIDIA-led | Largest open-source community | Academic + community |
| API | OpenAI-compatible, Anthropic Messages | OpenAI-compatible | OpenAI-compatible |
| Quantization | Most complete: FP8/NVFP4/MXFP8/INT4 | FP8/NVFP4/GPTQ/AWQ | FP8/NVFP4/GPTQ/AWQ |

### When TensorRT-LLM Is Worth It

With the compile step gone, "is the build wait acceptable" is no longer the question. What is left is hardware and performance:

- All-NVIDIA hardware, serving a few models long term: worth benchmarking. A 15–30% gap shows up on every month's GPU bill
- Running on Blackwell and wanting NVFP4: most of 1.3's performance work targets Blackwell and Rubin, so put it on the shortlist
- AMD, TPU, or mixed hardware: not an option; pick vLLM or SGLang
- Extremely latency-sensitive (e.g., trading): Worth it. A 30% latency gap can be decisive in some scenarios
- Still running the pre-1.3 TensorRT engine workflow: the upgrade means replacing the engines, the `trtllm-build` scripts, and the Triton model repository together, so run it once in a test environment first

A simple decision rule: if your inference service will run the same model for more than a week and the hardware is NVIDIA, run `trtllm-bench` at least once and compare it with vLLM on the same requests.

## Changelog

- 2026-11-23: TensorRT-LLM 1.3.0 (2026-11-20) removed the TensorRT backend. Rewrote the title, tldr, and the two-phase architecture section to explain how the compile step went away and how to use the library now; updated the runtime, speculative decoding, Triton integration, hardware requirements (CUDA 13.4.1, PyTorch 2.14.0, Python 3.10/3.12), and comparison table for 1.3; switched the example model to Qwen3.5-9B.

## References

- [TensorRT-LLM GitHub Repository](https://github.com/NVIDIA/TensorRT-LLM)
- [TensorRT-LLM v1.3.0 Release Notes](https://github.com/NVIDIA/TensorRT-LLM/releases/tag/v1.3.0) — TensorRT backend removal, dependency versions, new features
- [TensorRT-LLM 1.0 Release Notes](https://github.com/NVIDIA/TensorRT-LLM/releases/tag/v1.0.0) — PyTorch architecture becomes the default
- [Migration Guide: TensorRT Backend Removed](https://github.com/NVIDIA/TensorRT-LLM/blob/main/docs/source/legacy/tensorrt-backend-removal.md)
- [TensorRT-LLM Documentation](https://nvidia.github.io/TensorRT-LLM/)
- [TensorRT-LLM Quick Start Guide](https://nvidia.github.io/TensorRT-LLM/quick-start-guide.html)
- [TensorRT-LLM Backend for Triton](https://github.com/triton-inference-server/tensorrtllm_backend)
- [vLLM: The Default Choice for Self-Hosted Inference](/posts/ai/2026-08-21-vllm-self-host-decision-en)
- [NVIDIA Triton Inference Server](/posts/tech/2026-08-22-triton-inference-server-en)
- [SGLang: Self-Hosted Inference](/posts/tech/2026-08-22-sglang-inference-server-en)
