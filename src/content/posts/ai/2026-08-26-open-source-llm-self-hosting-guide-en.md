---
title: "Self-Hosting Open-Source LLMs: Framework Choice, Hardware Math, and When It Beats APIs"
date: 2026-08-26
category: ai
type: guide
tags: [self-hosting, vllm, sglang, ollama, llama-cpp, gpu, quantization, llm-inference]
lang: en
series:
  name: "認識 AI 模型"
  order: 17
tldr: "Open-source models now match closed-source on coding benchmarks, but self-hosting isn't just picking a model — vLLM handles high-concurrency production serving, SGLang is 29% faster on prefix-heavy workloads, Ollama is the local dev default, and llama.cpp runs on the least hardware. A100 cloud rentals run ~$1.4-2.2/hr; self-hosting breaks even at roughly 100M tokens/month."
description: "Complete decision guide for self-hosting open-source LLMs: vLLM / SGLang / Ollama / llama.cpp comparison, GPU hardware requirements, quantization format choices, cost breakeven analysis, and practical setup for agentic coding CLIs."
draft: false
glossary:
  - term: "PagedAttention"
    def: "vLLM's core mechanism — manages KV cache like OS virtual memory pages, reducing GPU memory waste"
  - term: "RadixAttention"
    def: "SGLang's core mechanism — caches shared-prefix KV states in a radix tree, especially effective for multi-turn and RAG workloads"
  - term: "GGUF"
    def: "Quantized model format used by llama.cpp, supporting multiple precision levels to run large models on consumer hardware"
---

> 🌏 [中文版](/posts/ai/2026-08-26-open-source-llm-self-hosting-guide)

[Ornith 35B-A3B](/posts/tech/2026-08-26-ornith-deepreinforce-model-family) scores 79.0 on SWE-bench, [MiniMax M2.5](/posts/tech/2026-08-26-minimax-model-family) hits 80.2% — open-source models now match closed-source on coding tasks. But "the model is strong enough" and "I can actually run it" are separated by real decisions: which serving framework, what GPU, how much quantization, and when self-hosting beats API calls. This is the decision guide.

This site already has individual deep-dives on [vLLM](/posts/ai/2026-08-21-vllm-self-host-decision) (in Chinese), [Ollama](/posts/ai/2026-03-14-ollama-local-llm-guide) (in Chinese), and [llama.cpp](/posts/ai/2026-04-01-llama-cpp-local-llm-inference) (in Chinese). This post doesn't repeat their content — it covers the cross-framework comparison and cost math.

## Four Frameworks, Four Use Cases

| Framework | Design Goal | Core Mechanism | Good For | Not For |
|---|---|---|---|---|
| [vLLM](https://github.com/vllm-project/vllm) | High-concurrency production | PagedAttention + continuous batching | Multi-user API serving | Local dev, consumer GPUs |
| [SGLang](https://github.com/sgl-project/sglang) | Prefix-heavy workloads | RadixAttention + radix tree prefix cache | Multi-turn chat, RAG, shared system prompts | Independent-request batches |
| [Ollama](https://ollama.com/) | One-command model running | Wraps llama.cpp + Docker-style CLI | Local dev, quick model testing | High-concurrency production |
| [llama.cpp](https://github.com/ggml-org/llama.cpp) | Minimal resource inference | Pure C++ + GGUF quantization | Consumer GPUs, CPU, phones, embedded | Multi-user serving (unless using server mode) |

### How to Choose

Per the [beri.net 2026 inference framework guide](https://www.beri.net/article/vllm-vs-tensorrt-llm-vs-sglang-inference-runtime-2026), the current consensus is "default to vLLM, switch to SGLang for prefix-heavy workloads":

- **Independent requests, high concurrency** → vLLM. Largest community (89K+ GitHub stars), broadest model support, most debugging resources
- **Multi-turn chat, RAG, shared system prompts** → SGLang. Per [PremAI benchmarks](https://gpuinsights.net/vllm-vs-sglang-vs-tensorrt-llm-2026), SGLang hits 16,200 tokens/sec vs vLLM's 12,500 on prefix-heavy workloads — 29% faster. The gap narrows to [1-4%](https://www.spheron.network/blog/llm-inference-optimization-2026) on independent requests
- **Local dev, trying models** → Ollama. `ollama run ornith-1.5-9b` handles download, quantization, and server in one command
- **Extreme resource constraints (12GB GPU, CPU-only, mobile)** → llama.cpp or Ollama (which uses llama.cpp under the hood)

## Hardware Requirements

Running a model doesn't mean running it fast. Here are the **minimum GPU memory requirements** for popular open-source models (FP16 full precision vs Q4 quantized):

| Model | Total Params | Active Params | FP16 VRAM | Q4 VRAM | Minimum Hardware |
|---|---|---|---|---|---|
| Ornith 1.5-9B | 9B | 9B | ~18 GB | ~6 GB | RTX 4060 (8GB) Q4 |
| Qwen3-14B | 14B | 14B | ~28 GB | ~9 GB | RTX 4090 (24GB) Q4 |
| Ornith 1.5-35B-A3B | 35B | ~3B | ~70 GB | ~22 GB | A100 40GB Q4 / RTX 4090 Q3 |
| DeepSeek-V4-Flash | 236B | ~21B | ~472 GB | ~140 GB | 2×A100 80GB Q4 |
| Ornith 1.5-397B | 397B | — | ~794 GB | ~240 GB | 4×H100 80GB Q4 |

**The MoE trap**: Ornith 35B-A3B activates only 3B parameters per token (inference is fast), but all 35B parameters must be loaded into VRAM (memory requirements stay the same). Inference speed approaches a 3B model, but GPU memory needs approach a 35B model.

## Quantization Format Selection

| Format | Ecosystem | Quality Loss | Memory Savings | Best For |
|---|---|---|---|---|
| GGUF Q4_K_M | llama.cpp / Ollama | Small (~1-2% perplexity) | ~75% | Consumer GPU default |
| GGUF Q5_K_M | llama.cpp / Ollama | Minimal | ~69% | Quality-sensitive but still memory-constrained |
| AWQ (4-bit) | vLLM / SGLang | Small | ~75% | Production serving, native vLLM support |
| GPTQ (4-bit) | vLLM / SGLang | Small | ~75% | Longest history, most community-quantized models |
| FP16 | All | None | 0% | Default when VRAM isn't a constraint |
| FP8 | vLLM / SGLang | Minimal | ~50% | H100/H200 native support, production recommended |

Rule of thumb: **start with Q4_K_M (GGUF) or AWQ 4-bit**, benchmark, and only upgrade precision if quality falls short. Most coding tasks see negligible quality loss at 4-bit quantization.

## Cost Breakeven Analysis

Self-hosting costs more than GPU rental — there's also engineering time, ops overhead, and idle waste.

### Cloud GPU Monthly Costs (August 2026)

| GPU | On-Demand Price | Monthly (24/7) | Source |
|---|---|---|---|
| RTX 4090 | ~$0.65/hr | ~$470 | [Hyperstack](https://www.hyperstack.cloud/blog/comparison/cloud-gpu-rental-platforms) |
| A100 80GB | ~$1.4-2.2/hr | ~$1,000-1,600 | [Thunder Compute](https://www.thundercompute.com/blog/nvidia-h100-pricing), [CloudZero](https://www.cloudzero.com/blog/h100-gpu-cost) |
| H100 SXM | ~$2.2-3.5/hr | ~$1,600-2,500 | Same sources |

### API Cost Comparison (per million output tokens)

| Service | Price |
|---|---|
| Claude Opus 5 | ~$75 |
| GPT-5 | ~$60 |
| DeepSeek V4 Flash API | ~$2.20 |
| MiniMax M2.5 API | ~$1.20 |
| Self-hosted A100 (high utilization) | ~$0.70 |
| Self-hosted A100 (10% utilization) | ~$7.00 |

Per our [vLLM self-hosting decision guide](/posts/ai/2026-08-21-vllm-self-host-decision) (in Chinese), the critical variable is **GPU utilization**. Above 50% utilization, self-hosting almost always wins. Below 10%, it's more expensive than most APIs.

**Breakeven rule of thumb**: if you consistently consume 100M+ tokens/month and can maintain GPU utilization above 30%, self-hosting starts to pay off. Below that volume, APIs (especially low-cost ones like DeepSeek and MiniMax) are more economical.

## Plugging Into Agentic Coding CLIs

Any self-hosted model with an OpenAI-compatible API endpoint works with mainstream agentic coding tools:

```bash
# Start vLLM server
vllm serve ornith-ai/Ornith-1.5-35B-A3B --port 8000

# Connect Claude Code
export OPENAI_API_BASE=http://localhost:8000/v1
export OPENAI_API_KEY=EMPTY

# Connect OpenCode (~/.config/opencode/opencode.json)
{
  "provider": {
    "local": {
      "npm": "@ai-sdk/openai-compatible",
      "options": { "baseURL": "http://localhost:8000/v1" },
      "models": { "ornith-35b": { "name": "Ornith-1.5-35B-A3B" } }
    }
  }
}
```

vLLM and SGLang both natively support tool calling (function calling), which is essential for agentic workflows. Ollama supports it too, but with lower performance.

## Watch Out For

1. **Context length ≠ usable context**: A model may claim 128K context support, but on consumer GPUs, KV cache memory limits may restrict actual usable context to 8-16K
2. **Tool calling quality varies widely**: Open-source models' tool calling stability still lags Claude / GPT — Ornith and MiniMax handle it relatively well, but general-purpose open models (Llama, Gemma) are prone to format errors
3. **Batching matters**: Single-request speed differences are small, but vLLM's continuous batching can multiply throughput several times in multi-user scenarios. Local dev doesn't need this
4. **Quantization isn't free**: Coding tasks are relatively precision-insensitive, but reasoning tasks (math, logic) degrade noticeably below Q3

## References

- [vLLM GitHub](https://github.com/vllm-project/vllm)
- [SGLang GitHub](https://github.com/sgl-project/sglang)
- [Ollama Website](https://ollama.com/)
- [llama.cpp GitHub](https://github.com/ggml-org/llama.cpp)
- [vLLM vs SGLang vs TensorRT-LLM 2026 Guide — beri.net](https://www.beri.net/article/vllm-vs-tensorrt-llm-vs-sglang-inference-runtime-2026)
- [SGLang vs vLLM Prefix-Heavy Throughput Benchmarks — GPU Insights](https://gpuinsights.net/vllm-vs-sglang-vs-tensorrt-llm-2026)
- [SGLang 3.8% Gap Analysis — Spheron](https://www.spheron.network/blog/llm-inference-optimization-2026)
- [H100 / A100 Cloud Pricing — Thunder Compute](https://www.thundercompute.com/blog/nvidia-h100-pricing)
- [GPU Rental Pricing Trends — Hyperstack](https://www.hyperstack.cloud/blog/comparison/cloud-gpu-rental-platforms)
- [H100 vs A100 Cost Efficiency — CloudZero](https://www.cloudzero.com/blog/h100-gpu-cost)
- [vLLM Self-Hosting Decision Guide — this site](/posts/ai/2026-08-21-vllm-self-host-decision) (in Chinese)
- [Ollama Complete Guide — this site](/posts/ai/2026-03-14-ollama-local-llm-guide) (in Chinese)
- [llama.cpp Inference Engine — this site](/posts/ai/2026-04-01-llama-cpp-local-llm-inference) (in Chinese)
- [Ornith Model Family — this site](/posts/tech/2026-08-26-ornith-deepreinforce-model-family)
- [MiniMax Model Family — this site](/posts/tech/2026-08-26-minimax-model-family)
