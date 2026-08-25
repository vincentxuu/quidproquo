---
title: "Self-Hosting Inference with SGLang: RadixAttention, OpenAI APIs, and Multi-GPU Serving"
date: 2026-08-22
category: tech
type: deep-dive
tags: [sglang, llm-serving, inference, gpu, self-hosted, openai-api]
lang: en
tldr: "SGLang is an inference engine for generative models. RadixAttention reuses KV cache across shared prefixes, while OpenAI-compatible APIs, structured output, and multi-GPU parallelism support production LLM serving; it is not a complete product backend."
description: "A practical guide to SGLang's execution model, RadixAttention, OpenAI-compatible server, structured outputs, multi-GPU deployment, and its boundaries with vLLM, Triton, and Ray Serve."
series:
  name: "Self-Hosted Inference"
  order: 3
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-sglang-inference-server)

[SGLang](https://docs.sglang.io/) is an inference framework for large language and multimodal generative models. It combines a model execution engine, an OpenAI-compatible HTTP API, parallelism, and cache management so applications can point an existing client at a GPU endpoint they operate.

It is strongest when the model is already chosen and the remaining problem is extracting useful token throughput from each GPU. Authentication, tenant quotas, business workflows, and cross-service traffic policy still belong in an API gateway, Kubernetes, Ray Serve, or another platform layer.

## Core design: do not recompute shared prefixes

LLM inference has prefill and decode phases. Long system prompts, fixed few-shot examples, and conversation histories often give requests a common prefix. Recomputing it wastes GPU work. SGLang's central design, [RadixAttention](https://arxiv.org/abs/2312.07104), manages KV cache in a radix tree so the server can detect and reuse shared prefixes, then evict cached entries under memory pressure.

That does not guarantee proportional gains for every workload. Requests with little prefix overlap offer little cache reuse, and short prompts may be dominated by decoding or model execution. Evaluate with real prompt lengths, concurrency, and prefix-sharing ratios instead of importing a benchmark result from a different workload.

SGLang also supports continuous batching, quantization, speculative decoding, structured outputs, and tensor, pipeline, and expert parallelism. These features live in the same serving layer, but each added optimization expands the compatibility and debugging surface.

## Start a server behind an OpenAI-compatible API

The official [OpenAI-compatible API](https://docs.sglang.io/basic_usage/openai_api_completions.html) avoids rewriting the client protocol. The minimum launch command is below. A production deployment should pin a model revision, restrict network access, and verify the model license.

```bash
python -m sglang.launch_server \
  --model-path Qwen/Qwen3-8B \
  --host 0.0.0.0 \
  --port 30000
```

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://127.0.0.1:30000/v1",
    api_key="local-placeholder",
)

response = client.chat.completions.create(
    model="Qwen/Qwen3-8B",
    messages=[{"role": "user", "content": "Explain KV cache in three bullets."}],
    temperature=0.2,
)
print(response.choices[0].message.content)
```

API compatibility lowers migration cost; it does not make every vendor extension identical. Put streaming, tool calling, JSON schemas, stop conditions, and error shapes into contract tests before switching production traffic.

## Multi-GPU and multi-node serving require systems work

The [server arguments](https://docs.sglang.io/advanced_features/server_arguments.html) expose tensor parallelism, data parallelism, and distributed initialization. Tensor parallelism is a starting point when a model does not fit on one GPU. Data parallelism is usually easier when one replica fits but aggregate throughput is insufficient. Multi-node serving also needs fast interconnects, reproducible images, weight distribution, failure handling, and health checks.

Measure time to first token, inter-token latency, throughput, GPU memory, error rate, and queue depth. Optimizing only aggregate tokens per second can produce an impressive load test and a sluggish interactive product.

## Boundaries with vLLM, Triton, and Ray Serve

- **vLLM** is SGLang's closest peer: both are general LLM serving engines. Benchmark your models, prompts, and hardware.
- **NVIDIA Triton** is a broader multi-framework model server with model repositories, dynamic batching, versions, and ensembles. It is a natural fit for conventional models and mixed pipelines.
- **Ray Serve** handles service composition, Python deployment graphs, replicas, and cluster resources. It can orchestrate SGLang as the underlying engine.

Ollama or llama.cpp is usually easier for a small model on a workstation. SGLang reaches its sweet spot when a GPU service has sustained traffic, substantial shared prefixes, or a need for deliberate LLM scheduling.

## A practical pre-production test

Build a fixed request set covering a long system prompt, multi-turn chat, short questions, structured output, and maximum context. Measure cold and warm runs, raise concurrency gradually, then exercise GPU OOM, client cancellation, and worker restart. Those tests reveal more about fit than a public leaderboard.

SGLang trades specialization for performance and control over generative serving. It also leaves GPU capacity planning, model compatibility, and reliability with the operator. Without sustained load or GPU operations expertise, a usage-based API may still cost less.

## References

- [SGLang Documentation](https://docs.sglang.io/)
- [SGLang OpenAI-Compatible APIs](https://docs.sglang.io/basic_usage/openai_api_completions.html)
- [SGLang Server Arguments](https://docs.sglang.io/advanced_features/server_arguments.html)
- [SGLang Structured Outputs](https://docs.sglang.io/advanced_features/structured_outputs.html)
- [SGLang: Efficient Execution of Structured Language Model Programs](https://arxiv.org/abs/2312.07104)
- [On this site: the cost threshold for self-hosting vLLM](/posts/ai/2026-08-21-vllm-self-host-decision-en)
