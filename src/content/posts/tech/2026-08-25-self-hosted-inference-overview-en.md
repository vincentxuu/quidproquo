---
title: "Self-Hosted Inference Overview: When Running Your Own Models Makes Sense"
date: 2026-08-25
type: guide
category: tech
tags: [self-hosted, llm-inference, vllm, sglang, tensorrt-llm, triton, ray-serve, gpu]
lang: en
tldr: "The key question in self-hosted inference isn't how fast the engine is — it's your GPU utilization. A fully saturated A100 costs ~$0.70 per million output tokens; at 10% utilization that becomes $7, more than most cloud APIs. This overview maps seven tools across three layers to help you decide which layer you need."
description: "Self-hosted inference series overview: the decision threshold between cloud APIs and self-hosting, the three-layer architecture of LLM execution engines (vLLM, SGLang, TensorRT-LLM), model serving platforms (Triton), and distributed orchestration (Ray Serve), plus migration from the archived TGI."
series:
  name: "Self-Hosted Inference"
  order: 0
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-25-self-hosted-inference-overview)

This series covers seven self-hosted inference tools. But before picking a tool, answer a more fundamental question: **do you actually need to run models yourself?**

---

## What Self-Hosted Inference Means

Self-hosted inference means running LLMs on hardware you control instead of calling someone else's model through a cloud API. The hardware can be your own GPU servers, rented cloud GPU instances (A100, H100), or a workstation in your office.

You get full control: model version, inference parameters, data flow, latency, cost structure — all your decisions. The cost is that you also own GPU management, model deployment, monitoring, scaling, and failure handling.

---

## When to Self-Host

Not every team using LLMs needs self-hosting. Three common triggers:

### 1. Cost Threshold

Self-hosted inference has a fundamentally different cost structure from cloud APIs. APIs charge per token — pay for what you use. Self-hosting is a fixed GPU rental — the meter runs whether you're using it or not.

The key metric is **GPU utilization**. From the [vLLM self-hosting decision guide](/posts/ai/2026-08-21-vllm-self-host-decision-en/):

| GPU Utilization | Cost per Million Output Tokens (A100) |
|-----------------|---------------------------------------|
| 100% | ~$0.70 |
| 50% | ~$1.40 |
| 10% | ~$7.00 |

Most cloud APIs price between $1–$15 per million output tokens. Your GPU utilization needs to stay above 50% for self-hosting to save money. Below 20%, self-hosting is almost certainly more expensive than an API.

**Bottom line**: only sustained, high-volume inference workloads (e.g., millions of calls per day) can justify the fixed cost of self-hosting.

### 2. Data Sovereignty

Model inputs contain customer PII, medical records, legal documents, internal code — anything you don't want passing through a third-party API. Self-hosting keeps data within your network end-to-end.

### 3. Customization Requirements

You need fine-tuned models, custom KV cache strategies, bespoke pre/post-processing pipelines, or models not yet supported by cloud APIs. Self-hosting is the only option.

---

## Decision Flowchart

```
Your LLM needs
    │
    ▼
Can data leave your network?
    │
    ├── Yes → High monthly inference volume? (GPU utilization stable > 50%)
    │              │
    │              ├── No → Cloud API (OpenAI, Anthropic, Google)
    │              │
    │              └── Yes → Need custom pipelines?
    │                          │
    │                          ├── No → Managed inference (HuggingFace Endpoints, Baseten, Modal)
    │                          │
    │                          └── Yes → Self-hosted inference ↓
    │
    └── No → Self-hosted inference ↓

Self-hosted inference: which layer?
    │
    ├── Single LLM, OpenAI-compatible API → LLM execution engine (vLLM / SGLang)
    │
    ├── NVIDIA GPU + maximum throughput → TensorRT-LLM
    │
    ├── Multiple model types (LLM + CV + embedding) unified serving → Triton Inference Server
    │
    └── Complex pipelines + autoscaling + multi-node → Ray Serve
```

---

## Three-Layer Architecture

Self-hosted inference tools aren't interchangeable alternatives — they **stack in layers**. Understanding this prevents most selection mistakes.

### Layer 1: LLM Execution Engines

Handle the lowest level: loading the model onto GPU, managing KV cache, continuous batching, returning generated tokens.

| Engine | Core Technology | Hardware | Best For |
|--------|----------------|----------|----------|
| [vLLM](/posts/ai/2026-03-14-vllm-inference-engine-en/) | PagedAttention | NVIDIA, AMD | General-purpose default, largest ecosystem |
| [SGLang](/posts/tech/2026-08-22-sglang-inference-server-en/) | RadixAttention | NVIDIA, AMD | Shared-prefix workloads (structured output, few-shot) |
| [TensorRT-LLM](/posts/tech/2026-08-25-tensorrt-llm-inference-en/) | TensorRT compilation | NVIDIA only | Maximum throughput, willing to spend 28 min compiling |

vLLM is the current de facto standard (89K+ GitHub stars). SGLang has an edge when RadixAttention can reuse KV cache across shared prefixes. TensorRT-LLM can be 15–30% faster than vLLM on NVIDIA GPUs, but is NVIDIA-only, requires pre-compilation, and is less flexible.

All three provide OpenAI-compatible APIs, so they can directly replace a cloud API client.

### Layer 2: Model Serving Platforms

Sit above execution engines, handling model lifecycle management, versioning, multi-model routing, and ensemble pipelines.

| Platform | Core Capabilities | Best For |
|----------|-------------------|----------|
| [NVIDIA Triton](/posts/tech/2026-08-22-triton-inference-server-en/) | Model repository, dynamic batching, ensembles | Heterogeneous model platforms (LLM + CV + traditional ML) |

Triton is not LLM-specific — it serves TensorRT, ONNX, PyTorch, and other backends through a unified HTTP/gRPC interface. If you're running a single LLM, use vLLM directly; Triton adds value when you have dozens of models across different frameworks to manage uniformly.

Triton can use vLLM or TensorRT-LLM as backends.

### Layer 3: Distributed Orchestration

Handle service graph composition, cross-node scheduling, and autoscaling.

| Framework | Core Capabilities | Best For |
|-----------|-------------------|----------|
| [Ray Serve](/posts/tech/2026-08-22-ray-serve-inference-en/) | Python service graphs, GPU replica scheduling, autoscaling | Complex pipelines (preprocessing → model A → model B → postprocessing) |

Ray Serve doesn't replace vLLM or SGLang — it uses vLLM as a worker inside a deployment and handles orchestration. If you're running one model on one machine, Ray Serve is over-engineering. Its sweet spot is multi-model, multi-node production environments with autoscaling.

### Archived: TGI

| Tool | Status |
|------|--------|
| [TGI](/posts/tech/2026-08-25-tgi-text-generation-inference-en/) | Archived March 2026, maintenance mode |

HuggingFace's Text Generation Inference pioneered this wave of optimized inference engines. It was the first to adopt Flash Attention and continuous batching in production. But HuggingFace announced end-of-new-features in late 2025 and archived the GitHub repo in March 2026.

The official recommendation is to migrate to vLLM or SGLang. If you're still on TGI, migration urgency depends on whether you need new model architecture support — TGI won't add any.

---

## How the Layers Combine

Common deployment patterns:

**Simplest**: vLLM single machine → OpenAI-compatible API → your application

**Medium complexity**: Triton → vLLM backend + embedding model + reranker → unified API

**Full pipeline**: Ray Serve → multi-node → vLLM workers + pre/post-processing deployments → autoscaling

Complexity increases left to right, but so does the scale and range of scenarios you can handle. Start with the simplest option and add layers as needed.

---

## Series Index

| Order | Article | One-Liner |
|-------|---------|-----------|
| 0 | This overview | Three-layer architecture and selection decisions |
| 1 | [vLLM Inference Engine](/posts/ai/2026-03-14-vllm-inference-engine-en/) | PagedAttention, continuous batching, prefix caching |
| 2 | [vLLM Self-Hosting Decision](/posts/ai/2026-08-21-vllm-self-host-decision-en/) | GPU utilization determines cost; when self-hosting is over-engineering |
| 3 | [SGLang](/posts/tech/2026-08-22-sglang-inference-server-en/) | RadixAttention reuses shared-prefix KV cache |
| 4 | [NVIDIA Triton](/posts/tech/2026-08-22-triton-inference-server-en/) | Multi-framework unified serving, dynamic batching, ensembles |
| 5 | [Ray Serve](/posts/tech/2026-08-22-ray-serve-inference-en/) | Python service graphs, GPU scheduling, autoscaling |
| 6 | [TGI](/posts/tech/2026-08-25-tgi-text-generation-inference-en/) | HuggingFace inference server, archived |
| 7 | [TensorRT-LLM](/posts/tech/2026-08-25-tensorrt-llm-inference-en/) | NVIDIA GPU-specific optimization, compilation for throughput |

---

## Bottom Line

Self-hosted inference isn't a "better" choice — it's a "cheaper under specific conditions" choice. Those conditions are usually: high utilization + data sovereignty + customization needs. You need at least one.

If your only motivation is "save money," calculate your GPU utilization first. You may find cloud APIs are actually cheaper.

If you decide to self-host, start with vLLM. It's the current default choice — the largest ecosystem, the most people who've hit problems, and the most problems that have been solved. Move to other tools when you have a specific reason to.


## References

- [vLLM Documentation](https://docs.vllm.ai/)
- [SGLang Documentation](https://sgl-project.github.io/)
- [TensorRT-LLM Documentation](https://nvidia.github.io/TensorRT-LLM/)
- [Text Generation Inference Documentation](https://huggingface.co/docs/text-generation-inference/)
- [Ray Serve Documentation](https://docs.ray.io/en/latest/serve/)
- [NVIDIA Triton Inference Server](https://developer.nvidia.com/triton-inference-server)
