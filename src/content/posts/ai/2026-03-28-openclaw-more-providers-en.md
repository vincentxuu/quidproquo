---
title: "OpenClaw Additional Providers: DeepSeek, Groq, Ollama, OpenRouter, Bedrock..."
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, deepseek, groq, ollama, openrouter, vllm, bedrock, sglang, mistral]
lang: en
tldr: "Beyond the big three (Anthropic/OpenAI/Google), OpenClaw supports 30+ providers — from DeepSeek to local Ollama and everything in between."
description: "Configuration guide for OpenClaw's 30+ model providers: DeepSeek, Groq, Ollama, vLLM, OpenRouter, Amazon Bedrock, and more."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-more-providers)

The previous model article covered Anthropic, OpenAI, and Google — the big three providers. But OpenClaw supports 35+ providers. This article covers the rest — from cost-effective DeepSeek, to ultra-fast Groq inference, to locally deployed Ollama and vLLM.

## Unified Configuration Format

All providers follow the same pattern:

```json5
{
  env: { PROVIDER_API_KEY: "your-key" },
  agents: {
    defaults: {
      model: { primary: "provider/model-name" }
    }
  }
}
```

Most providers can be configured interactively with `openclaw onboard`.

## Cost-Effective: DeepSeek

A Chinese AI company with an OpenAI-compatible API at extremely low prices.

```bash
openclaw onboard --auth-choice deepseek-api-key
```

| Model | Use Case | Context |
|---|---|---|
| `deepseek-chat` (V3.2) | General conversation | 128K |
| `deepseek-reasoner` (V3.2) | Reasoning / chain-of-thought | 128K |

Set the environment variable `DEEPSEEK_API_KEY`. If Gateway runs as a daemon, make sure the key is in `~/.openclaw/.env`.

## Ultra-Fast Inference: Groq

Groq uses its proprietary LPU hardware to run open-source models with extremely fast inference speeds.

```json5
{
  env: { GROQ_API_KEY: "gsk_..." },
  agents: {
    defaults: {
      model: { primary: "groq/llama-3.3-70b-versatile" }
    }
  }
}
```

Commonly used models:

| Model | Highlights |
|---|---|
| Llama 3.3 70B Versatile | Broad capabilities, long context |
| Llama 3.1 8B Instant | Speed-oriented |
| Gemma 2 9B | Lightweight |
| Mixtral 8x7B | MoE architecture, complex reasoning |

Bonus feature: Groq's Whisper can do fast speech transcription — just configure it as the media-understanding provider.

## Local Models: Ollama

Run open-source models on your own machine at zero cost.

```bash
# Install Ollama
# Pull a model
ollama pull glm-4.7-flash

# OpenClaw configuration
openclaw onboard  # Select Ollama
```

OpenClaw automatically discovers local Ollama models. It also supports cloud models (`kimi-k2.5:cloud`, `minimax-m2.5:cloud`, etc.).

**Important warning: Do not use the `/v1` OpenAI-compatible URL.** This breaks tool calling — the model will output tool JSON as plain text. Use the native Ollama API URL: `http://host:11434` (without `/v1`).

Minimal setup: Set `OLLAMA_API_KEY=ollama-local`, and OpenClaw handles auto-discovery.

## Local Models: vLLM

Serves open-source and custom models via an OpenAI-compatible HTTP API.

```bash
# Start vLLM server
# Configure
export VLLM_API_KEY="vllm-local"
```

```json5
{
  agents: {
    defaults: {
      model: { primary: "vllm/your-model-id" }
    }
  }
}
```

Like Ollama, vLLM supports auto-discovery — if `VLLM_API_KEY` is set but no provider config is specified, OpenClaw will query `GET http://127.0.0.1:8000/v1/models`.

Manual configuration allows specifying parameters like `contextWindow`, `maxTokens`, etc.

## Local Models: SGLang

Another local model runtime. Documentation is in `docs/providers/sglang.md`, and the configuration approach is similar to vLLM.

## Unified Gateway: OpenRouter

One API key to access models from multiple providers. Model format: `openrouter/<provider>/<model>`.

```bash
openclaw onboard --auth-choice apiKey --token-provider openrouter --token "$OPENROUTER_API_KEY"
```

```json5
{
  agents: {
    defaults: {
      model: { primary: "openrouter/anthropic/claude-sonnet-4-6" }
    }
  }
}
```

Ideal for those who want a single bill for accessing models from multiple providers. OpenRouter automatically injects cache control for Anthropic models.

## Enterprise Cloud: Amazon Bedrock

No API key needed — uses the AWS SDK default credential chain.

```json5
{
  models: {
    providers: {
      "amazon-bedrock": {
        api: "bedrock-converse-stream"
        // No apiKey needed, uses AWS credentials
      }
    }
  }
}
```

Authentication priority: `AWS_BEARER_TOKEN_BEDROCK` → standard AWS credentials → profiles → SDK chain.

Supports auto-discovery — if AWS credentials are available, it automatically lists available Bedrock models (via `bedrock:ListFoundationModels`, cached for 1 hour).

When using instance roles on EC2, set `AWS_PROFILE=default` to tell OpenClaw that credentials are available.

Required IAM permissions: `bedrock:InvokeModel`, `bedrock:InvokeModelWithResponseStream`, `bedrock:ListFoundationModels`.

## Other Providers at a Glance

Each provider has its own dedicated documentation. Here are the highlights:

| Provider | Provider ID | Auth Method | Highlights |
|---|---|---|---|
| Mistral | `mistral` | API Key | European company, strong multilingual support |
| xAI | `xai` | API Key | Grok models |
| NVIDIA | `nvidia` | API Key | NIM inference service |
| Hugging Face | `huggingface` | API Key | Inference API |
| Together AI | `together` | API Key | Multi-model inference platform |
| Qwen / Alibaba Cloud | `qwen_modelstudio` | API Key | Qwen series |
| GLM (Zhipu AI) | `glm` | API Key | GLM series |
| MiniMax | `minimax` | API Key | Chinese AI |
| Moonshot (Kimi) | `moonshot` | API Key | Kimi series, includes Kimi Coding |
| Qianfan (Baidu) | `qianfan` | API Key | ERNIE Bot |
| Volcengine (Doubao) | `volcengine` | API Key | ByteDance |
| Xiaomi | `xiaomi` | API Key | Xiaomi AI |
| Venice | `venice` | API Key | Privacy-focused |
| GitHub Copilot | `github-copilot` | OAuth | Uses Copilot subscription |
| LiteLLM | `litellm` | Custom | Unified proxy gateway |
| Vercel AI Gateway | — | Custom | Vercel proxy |
| Cloudflare AI Gateway | — | Custom | Cloudflare proxy |

## Using Proxy Gateways

LiteLLM, Vercel AI Gateway, and Cloudflare AI Gateway are not model providers — they are **proxy layers**. You place them between OpenClaw and the actual provider for unified billing, rate limiting, or routing.

## Speech Transcription: Deepgram

Not a language model, but a speech transcription service. Once configured as the transcription provider, voice messages are automatically converted to text.

## Community Tool: Claude Max API Proxy

A community-maintained proxy that uses Claude subscription credentials to access the API. **Make sure to verify compliance with Anthropic's Terms of Service before using it.**

## The Big Picture

OpenClaw's provider ecosystem breaks down into four tiers:

1. **Top-tier commercial** (Anthropic / OpenAI / Google) — Strongest capabilities, most expensive
2. **Cost-effective** (DeepSeek / Groq / Mistral) — Cheap or with free tiers, solid capabilities
3. **Local deployment** (Ollama / vLLM / SGLang) — Zero cost, but requires your own hardware
4. **Proxy gateways** (OpenRouter / LiteLLM) — One key to access multiple providers

You can mix and match across tiers in `model.fallbacks` — for example, use Claude as the primary, fall back to DeepSeek, then fall back to local Ollama.

## References

This article is compiled from the following OpenClaw source documents:

- [docs/providers/index.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/index.md) — Provider directory
- [docs/providers/deepseek.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/deepseek.md) — DeepSeek
- [docs/providers/groq.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/groq.md) — Groq
- [docs/providers/ollama.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/ollama.md) — Ollama
- [docs/providers/vllm.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/vllm.md) — vLLM
- [docs/providers/sglang.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/sglang.md) — SGLang
- [docs/providers/openrouter.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/openrouter.md) — OpenRouter
- [docs/providers/bedrock.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/bedrock.md) — Amazon Bedrock
- [docs/providers/mistral.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/mistral.md) — Mistral
- [docs/providers/xai.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/xai.md) — xAI
- [docs/providers/nvidia.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/nvidia.md) — NVIDIA
- [docs/providers/huggingface.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/huggingface.md) — Hugging Face
- [docs/providers/together.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/together.md) — Together AI
- [docs/providers/qwen_modelstudio.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/qwen_modelstudio.md) — Qwen
- [docs/providers/glm.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/glm.md) — GLM
- [docs/providers/minimax.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/minimax.md) — MiniMax
- [docs/providers/moonshot.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/moonshot.md) — Moonshot
- [docs/providers/qianfan.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/qianfan.md) — Qianfan
- [docs/providers/volcengine.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/volcengine.md) — Volcengine
- [docs/providers/xiaomi.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/xiaomi.md) — Xiaomi
- [docs/providers/venice.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/venice.md) — Venice
- [docs/providers/github-copilot.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/github-copilot.md) — GitHub Copilot
- [docs/providers/litellm.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/litellm.md) — LiteLLM
- [docs/providers/vercel-ai-gateway.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/vercel-ai-gateway.md) — Vercel AI Gateway
- [docs/providers/cloudflare-ai-gateway.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/cloudflare-ai-gateway.md) — Cloudflare AI Gateway
- [docs/providers/deepgram.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/deepgram.md) — Deepgram
- [docs/providers/claude-max-api-proxy.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/claude-max-api-proxy.md) — Claude Max API Proxy
