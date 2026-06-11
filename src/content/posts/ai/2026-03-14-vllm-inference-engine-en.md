---
title: "vLLM — From PagedAttention to a Production-Grade LLM Inference Engine"
date: 2026-03-14
type: guide
category: ai
tags: [vllm, llm-inference, pagedattention, model-serving, gpu]
lang: en
tldr: "vLLM uses PagedAttention to eliminate KV cache memory waste, combining continuous batching and prefix caching to become the most widely adopted open-source LLM inference engine today."
description: "An overview of vLLM's core technologies (PagedAttention, continuous batching, prefix caching), comparisons with other inference engines, basic usage, and the latest developments in 2026."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-14-vllm-inference-engine)

vLLM is currently the most widely adopted open-source LLM inference engine. The core problem it solves is clear: **prevent GPUs from wasting memory and compute when serving LLMs**. This post covers its key technologies, comparisons with other solutions, how to use it, and the latest developments in 2026.

## PagedAttention: An Old Trick from Operating Systems

vLLM's most important innovation is **PagedAttention**, inspired by the virtual memory paging mechanism in operating systems.

Traditional LLM serving allocates a contiguous chunk of GPU memory for each request's KV cache. The problem is: you don't know how long the response will be, so you have to pre-allocate for the maximum length. The result is 60-80% of memory wasted on fragmentation.

How PagedAttention works:

- The KV cache is divided into fixed-size **blocks** (default: 16 tokens/block)
- Each request maintains a **block table** that maps logical blocks to physical locations scattered across GPU memory
- The model thinks it's reading contiguous memory, but it's actually using indirect addressing through the block table

The result: memory waste drops from 60-80% to **under 4%**. And because blocks can be shared, multiple requests with the same prefix (like a system prompt) only need to store one copy.

```
Request A: [Block 1] → [Block 4] → [Block 7]
Request B: [Block 1] → [Block 3] → [Block 9]
                ↑
        Shared system prompt block
```

## Continuous Batching: No Waiting Around

Traditional static batching waits for an entire batch of requests to finish before processing the next one. The problem is: some requests generate 10 tokens and finish, while others need 500 — the short requests just sit idle waiting.

vLLM uses **continuous batching** (also called iteration-level batching):

- New requests can be inserted at every forward pass
- Completed requests are immediately removed from the batch
- GPU utilization stays close to 100%

This is especially impactful in high-concurrency scenarios — a single long request won't block the entire batch.

## Prefix Caching: Free Caching

The V1 engine has prefix caching **enabled by default with zero additional overhead**. Even when the cache hit rate is 0%, throughput drops by less than 1%.

Ideal scenarios:

- **Multi-turn conversations**: the system prompt only needs to be computed once
- **RAG workflows**: repeated context hits the cache directly
- **Batch processing**: requests with the same prefix share computation results

## Comparison with Other Inference Engines

| | vLLM | SGLang | TensorRT-LLM | llama.cpp |
|---|---|---|---|---|
| Positioning | Production GPU serving | Production GPU serving | NVIDIA peak performance | Local / edge / CPU |
| Ease of use | High | High | Low (manual tuning required) | Very high |
| Hardware support | NVIDIA, AMD, Intel, TPU | NVIDIA, AMD | NVIDIA only | CPU, Apple Silicon, GPU |
| Throughput | Very high | Very high | Highest (on NVIDIA) | Moderate |
| Community | Largest (74.7k stars) | Growing rapidly | Enterprise-backed | Very large |

Key takeaways:

- **SGLang** is vLLM's closest competitor. SGLang's RadixAttention has a 10-20% advantage in multi-turn conversation scenarios, but vLLM V1's prefix caching has significantly closed the gap.
- **TensorRT-LLM** has the lowest per-request latency on NVIDIA hardware, but the configuration complexity is much higher, and it only supports NVIDIA.
- **Hugging Face TGI** entered maintenance mode in December 2025, with the official recommendation to switch to vLLM or SGLang.
- **llama.cpp / Ollama** are suited for local development; a common 2026 pipeline is Ollama for development, vLLM for production.

## Basic Usage

### Offline Inference (Python API)

```python
from vllm import LLM, SamplingParams

llm = LLM(model="meta-llama/Llama-3.1-8B-Instruct")

sampling_params = SamplingParams(
    temperature=0.7,
    top_p=0.8,
    max_tokens=512
)

outputs = llm.generate(
    ["Explain quantum computing in simple terms."],
    sampling_params
)

for output in outputs:
    print(output.outputs[0].text)
```

### OpenAI-Compatible API Server

Start the server:

```bash
vllm serve meta-llama/Llama-3.1-8B-Instruct
```

Call it with the OpenAI SDK:

```python
from openai import OpenAI

client = OpenAI(
    api_key="EMPTY",
    base_url="http://localhost:8000/v1",
)

response = client.chat.completions.create(
    model="meta-llama/Llama-3.1-8B-Instruct",
    messages=[
        {"role": "user", "content": "What is PagedAttention?"}
    ]
)
print(response.choices[0].message.content)
```

This is one of vLLM's killer features — your code barely needs to change. Just swap the `base_url` and you can switch from OpenAI to a self-hosted model.

### Multi-GPU Inference

```bash
vllm serve meta-llama/Llama-3.3-70B-Instruct --tensor-parallel-size 4
```

Run a 70B model across 4 GPUs — one line is all it takes.

## vLLM in 2026

### V1 Engine (Default since v0.8.0)

V1 is a complete architectural rewrite:

- **Multi-process architecture**: the scheduler and EngineCore run in separate processes; tokenization, detokenization, and the server each run independently, fully non-blocking
- **Unified scheduling**: removes the prefill/decode phase distinction; all tokens are processed uniformly
- **Persistent batch**: input tensors are cached via NumPy and updated incrementally, eliminating Python-side reconstruction on every step

V1 achieves up to **1.7x throughput improvement** over V0 on Llama 3.1 8B and 3.3 70B.

### Speculative Decoding

EAGLE speculative decoding supports CUDA graphs, multi-GPU, and even multimodal models. The team also released the [Speculators](https://github.com/vllm-project/speculators) library, which unifies the construction, evaluation, and storage of speculative decoding algorithms.

### Multimodal Support

vLLM is no longer just a text inference engine. It supports vision-language models like LLaVA, Qwen-VL, DeepSeek-VL2, and InternVL, as well as speech models like Qwen3-ASR. Multimodal preprocessing is decoupled from the GPU, so it doesn't affect inference performance.

### Structured Output

Supports constrained generation with JSON schema, regex, and context-free grammar, and it works in combination with speculative decoding.

## The Big Picture

vLLM's core trade-off is: **engineering complexity in exchange for memory efficiency and throughput**. PagedAttention adds an extra layer of indirect addressing overhead, but the memory utilization gains far outweigh this cost.

Ideal scenarios: high-concurrency, multi-user LLM services, especially production environments with GPUs. If you just want to run a model locally for chatting, Ollama is simpler. If you're on NVIDIA hardware chasing the lowest possible latency and willing to spend time tuning, TensorRT-LLM might be faster. But for most teams, vLLM is the default choice for self-hosted LLMs in 2026.

Background: vLLM was created in 2023 by Woosuk Kwon and others at UC Berkeley's Sky Computing Lab and is now managed by the PyTorch Foundation. The team founded Inferact, raising a $150 million seed round led by a16z and Lightspeed at an $800 million valuation. The project has 74,700+ stars and 2,000+ contributors on GitHub.

---

## References

- [Efficient Memory Management for Large Language Model Serving with PagedAttention (arXiv:2309.06180)](https://arxiv.org/abs/2309.06180)
- [vLLM Official Documentation](https://docs.vllm.ai/en/latest/)
- [vLLM GitHub Repository](https://github.com/vllm-project/vllm)
- [vLLM V1 Alpha Release Blog](https://vllm.ai/blog/v1-alpha-release)
- [vLLM Performance Dashboard](https://docs.vllm.ai/en/latest/benchmarking/dashboard/)
- [Speculators Library](https://github.com/vllm-project/speculators)
- [LLM Inference Servers Compared — vLLM vs TGI vs SGLang vs Triton (PremAI, 2026)](https://blog.premai.io/llm-inference-servers-compared-vllm-vs-tgi-vs-sglang-vs-triton-2026/)
- [Ollama vs vLLM: Deep Dive Performance Benchmarking (Red Hat)](https://developers.redhat.com/articles/2025/08/08/ollama-vs-vllm-deep-dive-performance-benchmarking)
