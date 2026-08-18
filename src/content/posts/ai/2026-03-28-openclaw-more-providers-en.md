---
title: "OpenClaw's 60 Providers: A Category Map, and What Actually Bites When You Attach a Local Model"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, deepseek, groq, ollama, openrouter, vllm, bedrock, sglang, mistral]
lang: en
series:
  name: "Reading the OpenClaw Docs"
  order: 7
tldr: "The official provider directory now lists 60 entries. The most common failure when attaching a local model is writing Ollama's base URL with /v1 — that breaks tool calling, and the model starts emitting raw tool-call JSON as plain text."
description: "A category map of OpenClaw's 60 model providers, plus the auth rules, discovery mechanics, and real thresholds involved in attaching local models via Ollama, vLLM, SGLang, and LM Studio."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-more-providers)

The previous article covered the layering. This one looks at the ecosystem itself. The official provider directory now lists **60 entries** — but walking through each one is pointless, since the setup details live in their own pages and keep moving. So this article does two things: **give a category map**, then **spell out the local-model rules that will actually block you**.

## The category map

A meaningful share of those 60 entries are not LLMs at all but speech, image, music, and video providers — which itself says something about the ambition: OpenClaw wants to be the gateway for the whole model layer, not just chat.

| Category | Providers |
|---|---|
| Frontier commercial | Anthropic, OpenAI, Google |
| Chinese vendors | DeepSeek, Qwen, Z.AI (GLM), MiniMax, Moonshot (Kimi), Qianfan, Volcengine, Tencent, Xiaomi, LongCat, StepFun, BytePlus |
| Inference accelerators | Groq, Cerebras, Together, Fireworks, Baseten, Novita, Chutes, GMI, Featherless |
| Local deployment | Ollama, LM Studio, vLLM, SGLang, inferrs, ds4 |
| Gateway proxies | OpenRouter, LiteLLM, ClawRouter, Vercel AI Gateway, Cloudflare AI Gateway |
| Cloud vendors | Amazon Bedrock (and Mantle), Alibaba Model Studio |
| Subscription coding | GitHub Copilot, OpenCode (and the Go build), Kilocode |
| Transcription | Deepgram, ElevenLabs, Azure Speech, SenseAudio, Mistral (Voxtral), xAI |
| Media generation | ComfyUI, fal, Runway |
| Others | xAI, Mistral, NVIDIA, Hugging Face, Cohere, Arcee, Venice, Perplexity, Synthetic, Gradium, Vydra |

For how any one of them is configured, go to its page in the official [Provider directory](https://docs.openclaw.ai/providers/). This article does not copy those commands, because they are precisely the content that expires.

## Provider logic lives in plugins

Understanding this will save you a lot of doc-searching: **most provider-specific logic lives in provider plugins** (`registerProvider(...)`), while the OpenClaw core keeps only the generic inference loop.

Plugins own onboarding flows, model catalogs, auth env-var mapping, transport and config normalization, tool-schema cleanup, failover classification, OAuth refresh, usage reporting, and thinking/reasoning profiles.

So when you ask "does this provider support X," the answer usually lives in its plugin, not in core config.

## Attaching a local model: three Ollama rules

Local models are the most failure-prone group here, and they fail in confusing ways.

**Rule 1: never use the `/v1` OpenAI-compatible URL.** OpenClaw talks to Ollama's native API (`/api/chat`), not `/v1`. Using `/v1` **breaks tool calling** — the model emits tool-call JSON as plain text. Write `baseUrl: "http://host:11434"`, with no `/v1`.

(The canonical config key is `baseUrl`; `baseURL` is accepted for OpenAI-SDK-style examples, but new config should use the former.)

**Rule 2: private hosts do not need a real token.** Auth rules are host-dependent:

- **Loopback, private-network, `.local`, and bare hostnames** — no real bearer token needed; OpenClaw uses the `ollama-local` marker
- **Public remote hosts and `https://ollama.com`** — a real credential is required (`OLLAMA_API_KEY`, an auth profile, or the provider's `apiKey`)

There is also a leak-prevention design worth knowing: **a pure `OLLAMA_API_KEY` env value is treated as the Ollama Cloud convention and is not sent to local or self-hosted hosts by default**. A provider-level key is likewise sent only to that provider's host.

**Rule 3: the model must genuinely support tools, with enough context.** When guided setup wants to auto-offer an installed local model, the condition is that `/api/show` confirms **tool support and a context window of at least 16K**; missing or smaller metadata drops you onto the manual path. That automatic check never pulls a model for you.

Those two numbers are the practical threshold for local models — far more actionable than "use a stronger model."

## Ollama's three modes

You pick one at setup; the difference is who serves the models:

| Mode | What it uses |
|---|---|
| Cloud + Local | A reachable Ollama host serving local models and, when signed in, `:cloud` models |
| Cloud only | `https://ollama.com` directly, no local daemon |
| Local only | A reachable Ollama host, local models only |

Cloud + Local is Ollama's hybrid flow and requires `ollama signin` on that same host; without it, setup stays local-only.

If you want cloud without a local daemon, use the dedicated `ollama-cloud` provider id:

```bash
openclaw onboard --auth-choice ollama-cloud
```

Using `ollama-cloud/<model>` refs keeps cloud routing separate from a local `ollama` provider.

One detail reveals the design instinct here: the cloud model list shown during onboarding is populated **live** from `https://ollama.com/api/tags` (capped at 500 entries), falling back to a hardcoded suggested list only when that is unreachable. Even upstream refuses to hardcode the model list.

## Custom providers and implicit discovery

**Implicit discovery**: when `OLLAMA_API_KEY` (or an auth profile) is set and neither `models.providers.ollama` nor another `api: "ollama"` custom provider is defined, OpenClaw discovers models from `http://127.0.0.1:11434`. vLLM works similarly.

**Custom providers**: a custom provider with `api: "ollama"` — say an `ollama-remote` pointed at a LAN host — follows the same auth rules and can use the `apiKey: "ollama-local"` marker, which sub-agents resolve through the Ollama provider hook rather than treating it as a missing credential. `memory.search.provider` can also point at a custom provider id so embeddings use that endpoint.

**Put settings in the right place**: credentials go in the auth profile, endpoint settings (`baseUrl`, `api`, models, headers, timeouts) go in `models.providers.<id>`. Old flat files are not a runtime format; `openclaw doctor --fix` rewrites them into a canonical API-key profile with a backup, and a `baseUrl` sitting in such a file is noise that belongs in provider config.

## The big picture

You do not need to memorize 60 entries. You need to remember **three things that will stop you**: look model refs up with `openclaw models list` instead of memorizing them; provider-specific behavior lives in that provider's plugin; and local models need tool support plus a 16K context — with a base URL that must never end in `/v1`.

The next article covers what happens when models fail, and how to spend less.

## Changelog

- 2026-08-18: Substantially revised against the current official docs. The provider count moved from "35+" to the 60 entries the directory now lists, and the category map was reorganized (adding media generation, transcription, and subscription-coding categories). **Per-provider setup steps and model lists were removed** (DeepSeek's and Groq's specific model names and context sizes were not verified this round, and they are among the fastest-moving content upstream), replaced by the category map plus official links. The focus is now the practical rules for local models: Ollama's native `/api/chat` rather than `/v1`, the host-dependent auth rules and the `ollama-local` marker, the leak-prevention behavior that keeps `OLLAMA_API_KEY` away from local hosts, the threshold for auto-suggesting a local model (tool support plus a 16K context), the three modes, the separate `ollama-cloud` provider id, and where settings belong between auth profiles and provider config.

## References

This article draws on the following official OpenClaw documentation:

- [Provider directory](https://docs.openclaw.ai/providers/) — the full provider catalog
- [Ollama](https://docs.openclaw.ai/providers/ollama) — native API, auth rules, modes, and model discovery
- [Ollama Cloud](https://docs.openclaw.ai/providers/ollama-cloud) — the dedicated cloud provider id
- [Model providers](https://docs.openclaw.ai/concepts/model-providers) — plugin-owned provider behavior
- [Models CLI](https://docs.openclaw.ai/concepts/models) — model refs and allowlist syntax for local models
