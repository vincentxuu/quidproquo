---
title: "OpenClaw's Model Requirements and Provider Ecosystem"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, llm, anthropic, openai, gemini, model-failover, tool-use]
lang: en
tldr: "OpenClaw supports 35+ model providers. The minimum requirement is that the model supports tool use + streaming. It has built-in auth rotation and model failover mechanisms."
description: "OpenClaw's functional requirements for LLMs, configuration for the three major providers, auth rotation, and model failover mechanisms."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-model-providers)

OpenClaw is a model-agnostic AI gateway that supports 35+ providers. But you can't just plug in any model -- it has explicit functional requirements. This post covers OpenClaw's model requirements, how to configure the major providers, and the failover mechanisms when things go wrong.

## Functional Requirements for Models

OpenClaw's agent operation relies on these capabilities:

**Tool Use (Required)** -- The model must support function calling. This is the foundation of OpenClaw agent operation; without tool use, no tools can be executed.

**Streaming (Required)** -- Supports streaming output, used for real-time responses and chunked delivery to chat platforms.

**Extended Thinking (Optional)** -- Deep reasoning capability. Claude 4.6 supports this natively; it automatically degrades to normal mode on failure.

**Schema Compatibility** -- Different providers use different tool schema formats. OpenClaw has a built-in normalizer that handles schema differences between Gemini and OpenAI, so no manual processing is needed.

The documentation recommends: _"use the strongest latest-generation model available"_. If using local models (Ollama, vLLM, SGLang), make sure the model supports tool calling.

## Configuration

All models use a unified `provider/model` format, configured in `~/.openclaw/openclaw.json`:

```json5
{
  agents: {
    defaults: {
      model: { primary: "anthropic/claude-opus-4-6" }
    }
  }
}
```

## Supported Providers

| Category | Providers |
|---|---|
| Top-tier Commercial | Anthropic (Claude), OpenAI (GPT), Google (Gemini) |
| Chinese Vendors | DeepSeek, Qwen/Alibaba Cloud, GLM (Zhipu), MiniMax, Moonshot (Kimi), Qianfan (Baidu), Volcengine (Doubao), Xiaomi |
| Inference Acceleration | Groq (LPU), Together AI |
| Local Deployment | Ollama, vLLM, SGLang |
| Proxy Gateways | OpenRouter, LiteLLM, Vercel AI Gateway, Cloudflare AI Gateway |
| Others | xAI, Mistral, NVIDIA, Hugging Face, Venice, Amazon Bedrock, GitHub Copilot |
| Speech Transcription | Deepgram |

## Configuration Details for the Three Major Providers

### Anthropic (Claude)

Three authentication methods (choose one): API Key, Claude CLI, or Setup-Token.

```bash
openclaw onboard --anthropic-api-key "$ANTHROPIC_API_KEY"
```

| Item | Details |
|---|---|
| Recommended Model | `anthropic/claude-opus-4-6` |
| Thinking Mode | Claude 4.6 defaults to `adaptive` |
| Fast Mode | API Key only, maps to `service_tier: "auto"` |
| Prompt Caching | `none` / `short` (5 min) / `long` (1 hr), API Key defaults to `short` |
| 1M Context | Beta, requires setting `params.context1m: true` |

Limitations: CLI mode does not support tool use or streaming. Setup-Token does not support fast mode.

### OpenAI (GPT)

Two authentication methods: API Key or Codex subscription (OAuth).

```json5
{
  agents: { defaults: { model: { primary: "openai/gpt-5.4" } } }
}
```

| Item | Details |
|---|---|
| Recommended Model | `openai/gpt-5.4`, `openai/gpt-5.4-pro` |
| Transport Protocol | Automatic (WebSocket preferred, SSE fallback) |
| Fast Mode | `reasoning.effort = "low"` + `text.verbosity = "low"` |
| Auto Compaction | Triggers server-side compaction at 70% context window |

Codex subscription users can also use `openai-codex/gpt-5.3-codex-spark`.

### Google (Gemini)

Primarily uses API Key authentication.

```bash
openclaw onboard --auth-choice google-api-key
```

| Item | Details |
|---|---|
| Recommended Model | `google/gemini-3.1-pro-preview` |
| Special Capabilities | Image generation, image/audio/video understanding, Web search (Grounding) |
| Thinking | Gemini 3.1+ supports reasoning mode |

## Model Failover Mechanism

OpenClaw has a built-in two-stage failover:

```
Stage 1: Round-robin auth profile rotation within the same provider
         ↓ All exhausted
Stage 2: Switch to fallback model
```

Configuring fallbacks:

```json5
{
  agents: {
    defaults: {
      model: {
        primary: "anthropic/claude-opus-4-6",
        fallbacks: ["openai/gpt-5.4", "google/gemini-3.1-pro-preview"]
      }
    }
  }
}
```

### Cooldown Mechanism

| Error Type | Cooldown Escalation |
|---|---|
| General Failure | 1 min → 5 min → 25 min → 1 hr (cap) |
| Billing/Quota Failure | 5 hr → 10 hr → 20 hr → 24 hr (cap) |

### Multi-Account Rotation

You can configure multiple sets of API Keys; on failure, it automatically switches to the next one. Auth profiles are stored in `~/.openclaw/agents/<agentId>/agent/auth-profiles.json`. The default ordering prioritizes OAuth over API Key, and within the same type, uses "oldest first."

### Session Stickiness

Once an auth profile is selected, it remains unchanged for the entire session duration, maintaining provider cache efficiency. Switching only occurs on session reset, compaction, or cooldown trigger.

### Thinking Degradation

If an extended thinking call fails, it automatically degrades to normal mode without interrupting the conversation.

## Overall

OpenClaw's baseline requirement for models is **tool use + streaming**. On top of that, it uses three layers of mechanisms -- auth rotation, model fallback, and thinking degradation -- to ensure uninterrupted service. If you have API Keys from multiple providers, configuring fallbacks gives you very high availability. Local models can also be connected, but you need to verify tool calling support.

## References

This post is compiled from the following OpenClaw source documents:

- [docs/providers/index.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/index.md) -- Provider directory overview
- [docs/providers/models.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/models.md) -- Model configuration quick guide
- [docs/providers/anthropic.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/anthropic.md) -- Anthropic (Claude) configuration
- [docs/providers/openai.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/openai.md) -- OpenAI (GPT) configuration
- [docs/providers/google.md](https://github.com/openclaw/openclaw/blob/main/docs/providers/google.md) -- Google (Gemini) configuration
- [docs/concepts/models.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/models.md) -- Model core concepts
- [docs/concepts/model-providers.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/model-providers.md) -- Model provider concepts
- [docs/concepts/model-failover.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/model-failover.md) -- Model failover mechanism
- [docs/pi.md](https://github.com/openclaw/openclaw/blob/main/docs/pi.md) -- Pi embedded integration architecture (Tool Use / Schema requirements)
