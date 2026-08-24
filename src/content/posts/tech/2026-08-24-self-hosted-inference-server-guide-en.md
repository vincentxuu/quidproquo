---
title: "How to Pick a Self-Hosted Inference Server: From Ollama to Xinference, Six Tools and Their Trade-Offs"
date: 2026-08-24
category: tech
type: guide
tags: [llm-inference, self-hosting, vllm, sglang, ollama, xinference, triton-inference-server, ray-serve, gpu]
lang: en
tldr: "Self-hosted inference servers fall into three layers: execution engine (llama.cpp), serving engine (vLLM, SGLang), and model management platform (Ollama, Xinference, Triton). Picking the right layer matters more than picking the right tool — ask where your bottleneck is before deciding where to add complexity."
description: "A three-layer framework for choosing among llama.cpp, Ollama, vLLM, SGLang, Triton Inference Server, Ray Serve, and Xinference — helping you locate your actual needs and avoid common mis-layering mistakes."
series:
  name: "AI 時代的技術選擇"
  order: 127
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-24-self-hosted-inference-server-guide)

This site already has dedicated deep-dives on [vLLM](/posts/ai/2026-03-14-vllm-inference-engine), [SGLang](/posts/tech/2026-08-22-sglang-inference-server), [Triton Inference Server](/posts/tech/2026-08-22-triton-inference-server), [Ray Serve](/posts/tech/2026-08-22-ray-serve-inference), [Ollama](/posts/ai/2026-03-14-ollama-local-llm-guide), and [llama.cpp](/posts/ai/2026-04-01-llama-cpp-local-llm-inference). This article doesn't repeat tool-specific details. Instead, it places them on a single architecture diagram so you can locate which layer your problem lives in — and pick accordingly.

## Three Layers: Execution, Serving, Management

Self-hosted inference tools roughly fall into three layers. Some cover only one; others span two or even three:

```
┌─────────────────────────────────────────────────────────┐
│  Model Management Platform                              │
│  Ollama / LM Studio / Xinference / Triton                │
│  — model download, versioning, API routing, multi-model  │
├─────────────────────────────────────────────────────────┤
│  Serving Engine                                          │
│  vLLM / SGLang / Ray Serve                               │
│  — continuous batching, KV cache management, scheduling  │
├─────────────────────────────────────────────────────────┤
│  Execution Engine                                        │
│  llama.cpp / Transformers / TensorRT-LLM / ONNX Runtime  │
│  — model format, quantization, hardware kernels          │
└─────────────────────────────────────────────────────────┘
```

**Execution engines** handle "load the model into memory and run one forward pass." llama.cpp runs GGUF-quantized models on CPU or Apple Silicon; TensorRT-LLM compiles models into optimized NVIDIA GPU kernels. This layer determines single-inference speed and hardware compatibility.

**Serving engines** handle "how to schedule when multiple requests arrive simultaneously." vLLM uses [PagedAttention](https://arxiv.org/abs/2309.06180) to manage KV cache in non-contiguous blocks and continuous batching so requests of different lengths don't wait on each other. SGLang uses [RadixAttention](https://arxiv.org/abs/2312.07104) to share prefix cache across multi-turn conversations. This layer determines throughput, latency, and GPU memory utilization. [CS336 Lecture 10](/posts/ai/2026-08-22-cs336-inference) provides the theoretical framework for prefill/decode trade-offs and batching strategies.

**Model management platforms** handle "where models come from, how they're deployed, and what the API looks like." Ollama wraps llama.cpp with a model registry and CLI. Xinference integrates vLLM, Transformers, llama.cpp, and more, providing a Web UI and OpenAI-compatible API. Triton uses a model repository to manage models across multiple formats. This layer determines deployment workflow, model lifecycle, and team collaboration complexity.

Most selection mistakes aren't about picking the wrong tool — they're about picking the wrong layer. Throwing a management platform at a throughput problem, or setting up a full Triton deployment just to try one model, are both common misfires.

## Six Tools and Where They Fit

### llama.cpp — Execution Engine

[llama.cpp](/posts/ai/2026-04-01-llama-cpp-local-llm-inference) is a C/C++ LLM inference engine supporting CPU, Apple Silicon (Metal), NVIDIA (CUDA), and AMD (ROCm), using the [GGUF](https://github.com/ggerganov/ggml/blob/master/docs/gguf.md) quantization format. It's the core behind Ollama and one of Xinference's available backends.

Good for: local development, non-NVIDIA environments (Mac, AMD, CPU-only), embedded deployments. If you don't have NVIDIA GPUs, this is usually where you start.

Not for: high-concurrency production serving. llama.cpp's built-in HTTP server supports basic batching but lacks LLM-specific scheduling like PagedAttention or continuous batching — you'll hit throughput bottlenecks earlier than with vLLM or SGLang.

### Ollama — Management Platform + Execution Engine

[Ollama](/posts/ai/2026-03-14-ollama-local-llm-guide) wraps llama.cpp in a Docker-style CLI and model registry: `ollama pull llama3` downloads a model, `ollama run` starts an interactive chat, with automatic handling of quantization formats and GPU detection.

Good for: personal development, prototyping, single-user localhost scenarios. Its value is "from zero to a working local LLM in three minutes."

An alternative at the same layer is [LM Studio](https://lmstudio.ai/) — also built on llama.cpp, but with a desktop GUI and a built-in OpenAI-compatible local server. Choose it if you prefer a graphical interface for switching models and tweaking parameters.

Not for: shared inference services. Both Ollama and LM Studio operate at single-process scheduling — no KV cache paging, no distributed deployment, and GPU memory management relies on llama.cpp's basic configuration. When you need to serve ten concurrent users at five requests per second, it's time to move to a serving engine.

### vLLM — Serving Engine

[vLLM](/posts/ai/2026-03-14-vllm-inference-engine) is the most widely adopted LLM serving engine. Its core contribution is [PagedAttention](https://arxiv.org/abs/2309.06180), which switches KV cache from contiguous allocation to paged management, paired with continuous batching to significantly improve GPU memory utilization and throughput. It provides an OpenAI-compatible API and supports tensor parallelism across multiple GPUs.

Good for: NVIDIA GPU-based LLM production services. You have one or more GPUs, need reliable throughput and latency control, and your models are standard Hugging Face Transformers checkpoints. The [vLLM self-hosting decision guide](/posts/ai/2026-08-21-vllm-self-host-decision) has a more detailed cost and hardware analysis.

Not for: non-LLM models (image classification, speech recognition) — vLLM's scheduling and cache mechanisms are designed for autoregressive text generation. Non-NVIDIA environments aren't its strength either.

### SGLang — Serving Engine

[SGLang](/posts/tech/2026-08-22-sglang-inference-server) targets the same space as vLLM, with a key scheduling difference: [RadixAttention](https://arxiv.org/abs/2312.07104) uses a radix tree to manage KV cache, saving redundant computation in multi-turn conversations, multi-sample generation, and structured output scenarios that share common prefixes.

Good for: multi-turn conversations, same-prompt multi-sampling (e.g., agent tool-use loops, batch generation), and constrained decoding (JSON mode, regex constraints). When your workload has heavy prefix reuse, RadixAttention's benefits outpace PagedAttention.

Not for: same limitations as vLLM — LLM text generation only. The ecosystem is younger than vLLM; some integrations (monitoring, distributed deployment documentation) are less mature.

### Triton Inference Server — Management Platform

[NVIDIA Triton Inference Server](/posts/tech/2026-08-22-triton-inference-server) provides a unified HTTP/gRPC interface for TensorRT, ONNX, PyTorch, Python, and other backends. Its core capabilities are model repository (version management), dynamic batching, instance groups, and ensemble (chaining multiple models into a DAG).

Good for: unified platforms serving heterogeneous models. When your product combines image classification + embedding + ranking + LLM, and you need one server managing different model formats with unified monitoring and batching.

Not for: LLM-only deployments. Triton's dynamic batching isn't designed for autoregressive generation — it lacks KV cache paging, and LLM throughput won't match vLLM or SGLang. Running a pure LLM service on Triton means spending significant effort on config.pbtxt and ensemble setup without gaining LLM-specific scheduling benefits.

### Ray Serve — Orchestration Layer

[Ray Serve](/posts/tech/2026-08-22-ray-serve-inference) isn't an inference engine per se — it's a model serving framework built on Ray. It handles routing between multiple models or services, autoscaling, and A/B testing.

Good for: inference pipelines spanning multiple models and pre/post-processing steps, dynamic replica scaling, or teams already invested in the Ray ecosystem (Ray Train, Ray Data). Large-scale RL rollouts and hybrid train-infer deployments are also its strength.

Not for: single-model deployments. Ray's learning curve and operational cost aren't trivial — cluster management, actor lifecycle, serialization all require Ray expertise. If you need "one model, one API endpoint," vLLM or SGLang will do.

### Xinference — Management Platform

[Xinference](https://inference.readthedocs.io/) (Xorbits Inference) is an open-source model management platform. Its main differentiator from Ollama is broader model type support — not just LLMs but also embedding, rerank, speech (Whisper, CosyVoice), and image generation (Stable Diffusion) — plus the ability to choose vLLM, SGLang, llama.cpp, Transformers, or MLX as the LLM backend.

Key features:

- **Model marketplace**: [built-in model registry](https://inference.readthedocs.io/en/latest/models/builtin/) with Web UI click-to-deploy, no manual format conversion needed
- **Multi-backend switching**: the same LLM can run on vLLM with NVIDIA GPUs or switch to llama.cpp on a Mac
- **Distributed deployment**: supervisor-worker architecture with cross-machine GPU allocation
- **API compatibility**: OpenAI and Anthropic-compatible APIs, plus endpoints for embedding, reranking, speech, and image generation
- **v3.0.0** (July 2026) added MCP server support

Good for: teams that need to manage LLMs, embedding models, rerankers, and speech models on a single platform, especially with a Web UI for non-engineers. It saves the work of "setting up a separate service for each model type."

Not for: if you only need one LLM, vLLM or SGLang is simpler. Xinference's value is in multi-model management; for single-model scenarios, its abstraction layer only adds debugging surface.

**Security note**: management platforms with more parsing logic (tool-call parsing, model output post-processing) have a larger attack surface than pure serving engines. [CVE-2026-61539](/posts/daily/2026-08-24-security-xinference-eval-injection-rce) illustrates this — Xinference used `eval(model_output)` to parse Llama3 tool-call output, resulting in a CVSS 10.0 unauthenticated RCE. Fixed in 2.7.0, but the lesson holds: the higher the platform layer and the more parsing paths it has, the more important it is to treat model output as untrusted input.

## How to Choose: Start From Your Problem

Don't start from tools. Start from your problem:

**"I want to try open-source models on my own machine"**
→ [Ollama](/posts/ai/2026-03-14-ollama-local-llm-guide). Done in three minutes. If you prefer a GUI, [LM Studio](https://lmstudio.ai/) offers a desktop interface with a built-in OpenAI-compatible local server, also powered by llama.cpp. For finer quantization control or non-standard hardware, consider [llama.cpp](/posts/ai/2026-04-01-llama-cpp-local-llm-inference). Hardware specs are covered in the [AI hardware buying guide](/posts/ai/2026-04-02-ai-hardware-local-inference-guide).

**"I need to deploy one LLM as a production service"**
→ [vLLM](/posts/ai/2026-03-14-vllm-inference-engine). If your workload has heavy prefix reuse (multi-turn chat, agent loops), evaluate [SGLang](/posts/tech/2026-08-22-sglang-inference-server). Both offer OpenAI-compatible APIs, so switching cost is low.

**"I need to serve LLMs, embedding models, and speech models together"**
→ Xinference or [Triton](/posts/tech/2026-08-22-triton-inference-server). The difference: Xinference has a Web UI and built-in model registry for faster onboarding; Triton is a lower-level model server suited for teams with existing GPU platform operations capability.

**"I need routing, autoscaling, and A/B testing across multiple models"**
→ [Ray Serve](/posts/tech/2026-08-22-ray-serve-inference). It's an orchestration layer, not an inference engine — typically paired with vLLM or SGLang as the actual inference backend.

**"I'm not sure what to pick"**
→ Start with Ollama or vLLM. Ollama validates model quality (is this model's output good enough?), vLLM validates service quality (can latency and throughput meet requirements?). Move up layers when you hit bottlenecks.

## Common Selection Mistakes

**Reaching for a management platform too early.** You haven't decided which model to run or what throughput you need, but you've already set up Xinference or Triton. Two days of configuration later, you discover the model's output quality doesn't fit your use case. Validate model and service requirements with Ollama or vLLM first, then wrap a management layer around confirmed choices.

**Comparing only tokens/s.** [CS336 Lecture 10](/posts/ai/2026-08-22-cs336-inference) makes this clear: tokens/s (throughput) is only one of three metrics. TTFT (time to first token) and inter-token latency represent different product experiences. Interactive chat cares about TTFT and latency; offline batch processing cares about throughput. The same tool at different batch sizes will yield completely different trade-offs across these three metrics.

**Using a management platform to solve scheduling problems.** "vLLM's throughput isn't enough, let me try Xinference" — Xinference's LLM backend is vLLM. Adding a management layer on top won't make inference faster. Scheduling problems need serving-engine-layer solutions: adjust batch size, upgrade GPUs, add tensor parallelism, or evaluate whether SGLang's prefix caching helps your specific workload.

**Ignoring security.** Inference servers typically don't enable authentication by default. Ollama binds to localhost so the blast radius is limited, but vLLM, SGLang, and Xinference API endpoints exposed on an internal network or the public internet are callable by anyone who can connect. Deploy TLS, authentication, and request body limits at the reverse proxy or service mesh layer.

## Suggested Reading Path

If you're new to self-hosted inference, here's the recommended reading order from this site:

1. [CS336 Lecture 10 — LLM Inference](/posts/ai/2026-08-22-cs336-inference): understand prefill/decode, KV cache, quantization, speculative decoding, and continuous batching
2. [AI hardware buying guide](/posts/ai/2026-04-02-ai-hardware-local-inference-guide): figure out what scale of model your hardware can run
3. [Ollama local LLM guide](/posts/ai/2026-03-14-ollama-local-llm-guide) or [llama.cpp](/posts/ai/2026-04-01-llama-cpp-local-llm-inference): get a model running on your own machine
4. [vLLM inference engine](/posts/ai/2026-03-14-vllm-inference-engine) and [vLLM self-hosting decision guide](/posts/ai/2026-08-21-vllm-self-host-decision): serving engine for production deployment
5. [SGLang](/posts/tech/2026-08-22-sglang-inference-server), [Triton](/posts/tech/2026-08-22-triton-inference-server), [Ray Serve](/posts/tech/2026-08-22-ray-serve-inference): advanced options for specific needs

On the security side, the [Xinference CVE-2026-61539 analysis](/posts/daily/2026-08-24-security-xinference-eval-injection-rce) is worth reading as a case study — it demonstrates what happens when model output is treated as trusted input in an inference server.

## References

- [vLLM and PagedAttention — Efficient Memory Management for Large Language Model Serving](https://arxiv.org/abs/2309.06180)
- [SGLang — Efficiently Executing Structured Language Model Programs](https://arxiv.org/abs/2312.07104)
- [Xinference official documentation](https://inference.readthedocs.io/)
- [Xinference GitHub](https://github.com/xorbitsai/inference)
- [NVIDIA Triton Inference Server User Guide](https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/)
- [CS336 Spring 2026 Lecture 10 executable lecture notes](https://github.com/stanford-cs336/lectures/blob/main/lecture_10.py)
- [LM Studio](https://lmstudio.ai/)
- In-site series: [vLLM inference engine](/posts/ai/2026-03-14-vllm-inference-engine), [vLLM self-hosting decision](/posts/ai/2026-08-21-vllm-self-host-decision), [SGLang](/posts/tech/2026-08-22-sglang-inference-server), [Triton Inference Server](/posts/tech/2026-08-22-triton-inference-server), [Ray Serve](/posts/tech/2026-08-22-ray-serve-inference), [Ollama](/posts/ai/2026-03-14-ollama-local-llm-guide), [llama.cpp](/posts/ai/2026-04-01-llama-cpp-local-llm-inference), [AI hardware buying guide](/posts/ai/2026-04-02-ai-hardware-local-inference-guide)
