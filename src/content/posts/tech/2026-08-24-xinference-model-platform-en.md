---
title: "Xinference: One Platform to Manage LLM, Embedding, Speech, and Image Models"
date: 2026-08-24
category: tech
type: deep-dive
tags: [xinference, llm-inference, self-hosting, vllm, sglang, model-serving, gpu, openai-api]
lang: en
tldr: "Xinference wraps vLLM, SGLang, llama.cpp, Transformers, and MLX under a single management layer, using a Web UI and OpenAI-compatible API to manage LLMs, embedding, rerank, speech, and image models — suited for self-hosted deployments that need multiple model types to coexist. But the management layer's parsing logic also creates a larger attack surface than pure serving engines (CVE-2026-61539 is a case study)."
description: "A deep dive into Xinference (Xorbits Inference) architecture: multi-backend engine selection, built-in model registry, supervisor-worker distributed deployment, API compatibility layer, and how it compares to vLLM, Ollama, and Triton."
series:
  name: "Technology Choices in the AI Era"
  order: 128
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-24-xinference-model-platform)

[Xinference](https://inference.readthedocs.io/) (Xorbits Inference) is an open-source model inference management platform with [roughly 9,500 stars on GitHub](https://github.com/xorbitsai/inference), under the Apache-2.0 license. Its role isn't to replace vLLM or SGLang — it wraps them alongside Transformers, llama.cpp, and MLX under a single management layer, using a Web UI, CLI, and OpenAI-compatible API to manage LLMs, embedding, rerank, speech, image, and other model types.

If you've read the [self-hosted inference server selection guide](/posts/tech/2026-08-24-self-hosted-inference-server-guide-en), Xinference is one of the representatives of the "model management platform" layer in that three-layer architecture. This article goes deeper into its design, deployment, boundaries, and security considerations.

## Core Design: A Management Layer, Not an Inference Engine

Xinference doesn't perform inference computation itself. Its job is:

1. Let you pick a model from the built-in model registry or a custom registry
2. Automatically select or let you specify a backend engine to run that model
3. Manage model lifecycle (start, monitor, stop) through a unified API and Web UI

This difference from [vLLM](/posts/ai/2026-03-14-vllm-inference-engine) is fundamental: vLLM is a serving engine whose core problem is "how to schedule KV cache when multiple requests arrive simultaneously"; Xinference is a management platform whose core problem is "how to make multiple model types coexist in a single service."

## Five Backend Engines

Starting from v0.11.0, you must specify an inference engine when launching an LLM. The [official documentation's](https://inference.readthedocs.io/en/latest/getting_started/using_xinference.html) recommended logic:

- **Linux + NVIDIA GPU**: prefer [vLLM](/posts/ai/2026-03-14-vllm-inference-engine) or [SGLang](/posts/tech/2026-08-22-sglang-inference-server) for best throughput
- **Linux + limited resources**: [llama.cpp](/posts/ai/2026-04-01-llama-cpp-local-llm-inference) for its wide quantization options
- **Mac (Apple Silicon)**: MLX for best performance; llama.cpp as second choice
- **Other scenarios**: Transformers, which supports the widest range of models

Choose backends via pip extras at installation:

```bash
pip install "xinference[vllm]"      # vLLM
pip install "xinference[sglang]"    # SGLang
pip install "xinference[llama_cpp]" # llama.cpp (xllamacpp)
pip install "xinference[mlx]"       # MLX
pip install "xinference[all]"       # all backends (excludes SGLang due to dependency conflicts)
```

Note that `[all]` doesn't include SGLang — the [official documentation](https://inference.readthedocs.io/en/latest/getting_started/installation.html) explains that vLLM and SGLang have conflicting package dependencies and must be installed separately. The llama.cpp backend switched from `llama-cpp-python` to [xllamacpp](https://github.com/xorbitsai/xllamacpp), a Python binding developed by the Xinference team, starting from v1.6.0. From v3.0, with per-model virtual environments enabled, xllamacpp automatically detects the CUDA version and selects the corresponding GPU wheel.

Query which engines and formats a model supports:

```bash
xinference engine -e http://localhost:9997 --model-name qwen2.5-instruct
xinference engine -e http://localhost:9997 --model-name qwen2.5-instruct --model-engine vllm
```

## Supported Model Types

This is where Xinference differs most from [Ollama](/posts/ai/2026-03-14-ollama-local-llm-guide). Ollama focuses on LLMs (plus limited multimodal support); Xinference supports a broader range of model types:

| Type | Use Case | Example Models |
|---|---|---|
| LLM | Text generation, chat, tool calling | Qwen2.5, Llama 3, DeepSeek-V3 |
| Embedding | Text vectorization (RAG retrieval stage) | bge-m3, e5-mistral |
| Rerank | Re-ranking (RAG reranking stage) | bge-reranker-v2-m3 |
| Speech | Speech-to-text (STT), text-to-speech (TTS) | Whisper, CosyVoice |
| Image | Text-to-image, image-to-image | Stable Diffusion, FLUX |
| Multimodal | Vision-language understanding | Qwen-VL, LLaVA |

This means you can run an entire RAG pipeline's embedding + rerank + LLM on a single Xinference instance, without setting up a separate service for each model type.

## Built-in Model Registry

Xinference ships with a [built-in model registry](https://inference.readthedocs.io/en/latest/models/builtin/) covering mainstream open-source models. You can browse, search, and launch models from the Web UI without manually downloading model files or converting formats. On first launch, Xinference automatically downloads and caches from HuggingFace (or ModelScope, by setting the environment variable `XINFERENCE_MODEL_SRC=modelscope`).

It also supports [custom models](https://inference.readthedocs.io/en/latest/models/custom.html): specify model weight paths and configuration to register models not in the built-in registry.

## Distributed Deployment: Supervisor-Worker

Single-machine deployment requires just one command:

```bash
xinference-local --host 0.0.0.0 --port 9997
```

Multi-machine deployment uses a supervisor-worker architecture. The supervisor receives requests and handles scheduling; workers distribute GPU resources across machines:

```bash
# Machine A: start the supervisor
xinference-supervisor -H 0.0.0.0

# Machine B, C: start workers, connecting to the supervisor
xinference-worker -e "http://<supervisor_ip>:9997" -H 0.0.0.0
```

Workers automatically register with the supervisor on startup, and the supervisor assigns models based on each worker's available resources. This solves a different problem than vLLM's tensor parallelism (splitting a single model across GPUs): Xinference's distribution is "different models on different machines," not "one large model split into pieces" — the latter is handled by the underlying vLLM or SGLang backend.

## API Compatibility Layer

Xinference provides an OpenAI-compatible API that works directly with the OpenAI Python SDK:

```python
from openai import OpenAI

client = OpenAI(base_url="http://localhost:9997/v1", api_key="not used")
response = client.chat.completions.create(
    model="qwen2.5-instruct",
    messages=[{"role": "user", "content": "Hello"}]
)
```

Supported OpenAI API endpoints include Chat Completions, Completions, Embeddings, Images, and more. It also supports [Function Calling](https://inference.readthedocs.io/en/latest/models/model_abilities/tools.html) (tool use), as well as integrations with LangChain, LlamaIndex, and Dify.

v3.0.0 (July 2026) added MCP server support, enabling Xinference to be called as an MCP tool by agent frameworks.

## How It Compares to Similar Tools

### vs Ollama

[Ollama](/posts/ai/2026-03-14-ollama-local-llm-guide) and Xinference are both management platforms, but they target different users. Ollama aims for "get an LLM running locally in three minutes" — its interface is CLI-based, it binds to localhost by default, has no built-in Web UI (third-party options exist), and focuses on LLMs plus basic multimodal. Xinference aims for "one platform to manage all model types" — it has a Web UI, supports multiple backend engine switching, and supports distributed deployment.

Choose Ollama when: personal development, LLMs only, no Python environment wanted.
Choose Xinference when: managing embedding + rerank + LLM + speech simultaneously, need a Web UI for non-engineers, need multi-machine deployment.

### vs vLLM / SGLang

[vLLM](/posts/ai/2026-03-14-vllm-inference-engine) and [SGLang](/posts/tech/2026-08-22-sglang-inference-server) are serving engines — they're Xinference's "internals," not competitors. You can use Xinference to launch a model with vLLM as the backend, at which point the actual inference scheduling (PagedAttention, continuous batching) is all handled by vLLM.

If you only need to run one LLM, using vLLM or SGLang directly is simpler than adding an extra abstraction layer through Xinference. Xinference's value emerges when you need to manage multiple different types of models — it saves the work of "setting up a separate API server for each model type."

### vs Triton Inference Server

[Triton](/posts/tech/2026-08-22-triton-inference-server) and Xinference both do "multi-model management," but at different abstraction levels. Triton is lower-level: you prepare model files yourself, write config.pbtxt, and define ensemble DAGs. Xinference is higher-level: built-in model registry, Web UI click-to-deploy, automatic format handling.

Choose Triton when: existing GPU platform operations capability, diverse model formats (ONNX, TensorRT, PyTorch), need for ensemble pipelines.
Choose Xinference when: want fast onboarding, primarily running open-source LLMs and embeddings, team has no Triton experience.

## Security Considerations

Xinference's security boundary requires more attention than pure serving engines because the management layer has more parsing logic.

**No authentication by default.** Like vLLM, `xinference-local` starts with an API endpoint that's publicly reachable and requires no authentication. If deployed on an internal network or the public internet, anyone who can connect can launch models, invoke inference, or even stop running models. Deploy a reverse proxy in front with TLS and authentication.

**Model output parsing is an attack surface.** [CVE-2026-61539](/posts/daily/2026-08-24-security-xinference-eval-injection-rce) (CVSS 10.0) is a problem specific to the management layer: Xinference called `eval(model_output, {}, {})` on strings produced by the model when parsing Llama3 tool-call output. An attacker could use prompt injection to make the model output a malicious Python expression, executing arbitrary commands in the server process. Fixed in 2.7.0, where the maintainers replaced `eval()` with `json.loads()` and `ast.literal_eval()`.

This vulnerability isn't a vLLM or SGLang issue — they only handle inference scheduling, not tool-call output parsing. **Management platforms add a post-processing layer between inference results and users, and every parsing path is a potential attack surface.** When deploying Xinference or any similar platform:

- Version tracking: run `pip show xinference` to confirm the version; upgrade immediately if < 2.7.0
- Network isolation: don't expose inference API endpoints directly to the public internet
- Least privilege: run the inference server process with a low-privilege identity; use containerized deployment to restrict filesystem and network access

## Who Should Use It

**Good fit**: teams that need to manage LLMs + embedding + rerank + speech + image on a single platform, want a Web UI for PMs or researchers to try models, or need to flexibly switch backends across different hardware (NVIDIA GPU, Mac, CPU).

**Not a good fit**: running a single LLM in production (vLLM is simpler); complex pipelines and ensembles for non-LLM models (Triton's DAG is better suited); trying models on your own computer (Ollama takes three minutes).

As with all management platforms, first confirm you actually need this layer of abstraction. If you're unsure, start with vLLM or Ollama, and consider Xinference when you hit the "managing multiple models is a pain" problem.

## References

- [Xinference official documentation](https://inference.readthedocs.io/)
- [Xinference GitHub (Apache-2.0)](https://github.com/xorbitsai/inference)
- [Xinference Installation Guide](https://inference.readthedocs.io/en/latest/getting_started/installation.html)
- [Xinference Backends](https://inference.readthedocs.io/en/latest/user_guide/backends.html)
- [Xinference Built-in Models](https://inference.readthedocs.io/en/latest/models/builtin/)
- [xllamacpp — Xinference team's llama.cpp Python binding](https://github.com/xorbitsai/xllamacpp)
- [CVE-2026-61539 — Remote code execution via unsafe eval() in Llama3 tool-call parsing](https://github.com/xorbitsai/inference/security/advisories/GHSA-x2rj-828p-hx9m)
- In-site: [Self-hosted inference server selection guide](/posts/tech/2026-08-24-self-hosted-inference-server-guide-en), [vLLM inference engine](/posts/ai/2026-03-14-vllm-inference-engine), [SGLang](/posts/tech/2026-08-22-sglang-inference-server), [Triton Inference Server](/posts/tech/2026-08-22-triton-inference-server), [Ollama](/posts/ai/2026-03-14-ollama-local-llm-guide), [llama.cpp](/posts/ai/2026-04-01-llama-cpp-local-llm-inference), [Xinference CVE-2026-61539 security alert](/posts/daily/2026-08-24-security-xinference-eval-injection-rce)
