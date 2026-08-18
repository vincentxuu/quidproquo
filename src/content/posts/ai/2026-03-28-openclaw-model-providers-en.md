---
title: "OpenClaw's Model Requirements and Provider Ecosystem: Provider, Model, and Runtime Are Three Different Things"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, llm, anthropic, openai, gemini, model-failover, tool-use]
lang: en
series:
  name: "Reading the OpenClaw Docs"
  order: 6
tldr: "OpenClaw's hard requirement for a model is tool use plus a large enough context — onboarding only auto-suggests a local model when it confirms tool support and at least a 16K context window. The easier thing to get wrong is that provider, model, and agent runtime are three separate layers: an `openai/*` ref does not mean Codex."
description: "OpenClaw's layered model architecture (provider / model / agent runtime / channel), the hard requirements for a usable model, the size of the provider ecosystem, and easily missed settings like modelPolicy allowlists and the utility model."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-model-providers)

OpenClaw is a model-agnostic gateway, but "connect a model" involves one more layer than you would expect. This article covers **the layering you need to understand before choosing a model**, plus a few settings that will actually block you.

## Four layers, not two

The most common confusion is treating "the provider" and "the thing that runs the agent" as one. The docs separate them into four layers:

| Layer | Examples | Meaning |
|---|---|---|
| Provider | `anthropic`, `openai`, `github-copilot` | How OpenClaw authenticates, discovers models, and names model refs |
| Model | `claude-opus-5`, `gpt-5.6-sol` | Which model is selected for this turn |
| Agent runtime | `openclaw`, `codex`, `claude-cli`, `copilot` | **The backend that actually runs the model loop** |
| Channel | Discord, Slack, Telegram | Where messages enter and leave |

The agent runtime is the layer people miss. It owns one prepared model loop: it receives the prompt, drives model output, handles native tool calls, and returns the finished turn to OpenClaw.

There are two families. **Embedded harnesses** run inside OpenClaw's own agent loop (the built-in `openclaw` runtime plus plugin harnesses like `codex` and `copilot`). **CLI backends** run a local CLI process while keeping the model ref canonical — `anthropic/claude-opus-5` with a model-scoped `agentRuntime.id: "claude-cli"` means "select the Anthropic model, execute it through Claude CLI."

## `openai/*` does not mean Codex

This rule deserves its own section because it is counterintuitive: **the `openai/` prefix by itself never selects Codex**.

With runtime policy unset or set to `auto`, OpenAI implicitly selects Codex in exactly one case: an official HTTPS Platform Responses or ChatGPT Responses route with no authored provider request override. The moment you use a Completions adapter, a custom endpoint, or authored request behavior, the turn stays on OpenClaw's own runtime. Plaintext official HTTP endpoints are rejected outright.

To be explicit, set `agentRuntime.id` at the provider or model level. `"openclaw"` means "stay on OpenClaw even if the route would otherwise qualify"; `"codex"` **fails closed** — if the effective route is not Codex-compatible, it fails rather than quietly downgrading.

Related: `claude-cli/*`, `google-gemini-cli/*`, and `codex-cli/*` refs are all legacy now. `openclaw doctor --fix` rewrites them into canonical provider refs with the runtime recorded separately. Whole-agent runtime keys are ignored entirely; only model-scoped ones count.

## The model's hard requirements

**Tool use is the floor.** There is a very concrete piece of evidence for this: when Ollama's guided setup wants to auto-suggest an installed local model, the condition is that `/api/show` confirms **tool support and a context window of at least 16K**. Miss either and it falls back to the manual setup path.

That is far more useful than the abstract advice to "use the strongest model available": if you want to attach a local model, those two are the threshold.

## Do not write model names down

This article deliberately does not list "recommended models," for a practical reason: **the official docs are not consistent with themselves**. Read on the same day, the quickstart on `/providers/` shows `anthropic/claude-opus-4-6`, while `/concepts/model-providers` and `/concepts/agent-runtimes` show `claude-opus-5`.

Model refs are the fastest-rotting content there is. The only reliable way to know what your account can actually use is to ask:

```bash
openclaw models list
openclaw models list --provider openai   # one provider
openclaw models list --all               # including hidden/deprecated rows
```

## Onboarding will not overwrite your default model

This is a useful behavioral guarantee: `openclaw configure` **preserves an existing `agents.defaults.model.primary`** when you add or reauthenticate a provider. So does `openclaw models auth login`, unless you pass `--set-default`.

Provider plugins may return a recommended default model in their auth config patch, but when a primary already exists OpenClaw treats that as "make this model available," not "replace your primary."

To switch deliberately, use `openclaw models set <ref>` or `openclaw models auth login --provider <p> --set-default`.

## Two settings that are easy to miss

**`agents.defaults.utilityModel`** — a lower-cost model for short internal tasks: generated dashboard session titles, channel thread/topic titles, progress narration. When unset, OpenClaw uses the primary provider's declared small-model default (OpenAI → `gpt-5.6-luna`, Anthropic → `claude-haiku-4-5`), then the agent's primary model; set it to an empty string to turn utility routing off.

Worth knowing: **utility tasks are separate model calls and may send bounded task content to the selected provider**. If you care where data goes, this is a setting to decide actively, not a detail to skip.

**`agents.defaults.modelPolicy.allow`** — the override allowlist. When non-empty it governs `/model`, session overrides, and `--model` together, and selecting outside it returns before any reply is generated:

```text
Model override "provider/model" is not allowed by agents.defaults.modelPolicy.allow.
```

It supports trailing prefix wildcards (`provider/*`, `provider/namespace/*`), so restricting to a provider does not mean listing every model. One trap: **local/GGUF models need the full provider-prefixed ref** (for example `ollama/gemma4:26b`). Bare filenames and display names stop working once the allowlist is active.

## How big the ecosystem is

The official provider directory now lists **60 entries**, including non-LLM providers for speech (Deepgram, ElevenLabs, Azure Speech, SenseAudio) and for image/music/video generation (ComfyUI, fal, Runway).

Roughly: frontier commercial (Anthropic, OpenAI, Google), Chinese vendors (DeepSeek, Qwen, Z.AI/GLM, MiniMax, Moonshot, Qianfan, Volcengine, Tencent, Xiaomi, LongCat), inference accelerators (Groq, Cerebras, Together, Fireworks, Baseten, Novita), local deployment (Ollama, LM Studio, vLLM, SGLang, inferrs, ds4), and gateway proxies (OpenRouter, LiteLLM, ClawRouter, Vercel AI Gateway, Cloudflare AI Gateway). The next article picks a few and goes deeper.

Most provider logic lives in **provider plugins** (`registerProvider(...)`) while OpenClaw keeps only the generic inference loop. Plugins own onboarding, model catalogs, auth env-var mapping, transport and config normalization, tool-schema cleanup, failover classification, OAuth refresh, usage reporting, and thinking profiles. So the answer to "does this provider support X" usually lives in its plugin, not in the core.

## Configuring from the Control UI

**Settings → Model Providers** in the Control UI adds, replaces, or removes provider API keys (stored in `models.providers.<p>.apiKey`). It shows whether each key comes from OpenClaw config or an environment variable **without displaying the credential**; environment-provided keys stay managed by the gateway process environment.

A **Test connection** button runs a live provider probe and reports latency or a categorized error (authentication, rate limit, billing, timeout, response). Note that it makes a real request and **consumes a small number of tokens**.

## The big picture

What you should settle first when attaching a model is the layering: **the provider decides how you authenticate, the model decides which brain answers, and the runtime decides who runs the loop**. Separate those and questions like "why did my `openai/...` ref end up on Codex" or "why did doctor rewrite my model ref" finally have answers.

As for model names — do not memorize them. Ask `openclaw models list` every time. The next article covers the rest of the providers, and the one after that covers failure and failover.

## Changelog

- 2026-08-18: Substantially revised against the current official docs. **Added the agent runtime layer** (provider / model / agent runtime / channel), which the March version lacked entirely, along with the rule that an `openai/*` prefix does not select Codex and the doctor-driven migration of legacy `claude-cli/*` and `codex-cli/*` refs. **Removed all fixed "recommended model" refs** (the original named `claude-opus-4-6` and `openai/gpt-5.4`; both have moved, and the official docs disagree with themselves across pages), pointing to `openclaw models list` instead. Added the guarantee that onboarding preserves an existing primary, `utilityModel` (including that it is a separate model call that sends content out), the `modelPolicy.allow` allowlist and the full-ref requirement for local models, and the Control UI provider page whose Test connection consumes tokens. The provider count moved from "35+" to the 60 entries the directory now lists. Per-provider setup tables were dropped in favor of the next article and the official docs.

## References

This article draws on the following official OpenClaw documentation:

- [Agent runtimes](https://docs.openclaw.ai/concepts/agent-runtimes) — the provider/model/runtime/channel split and the various Codex surfaces
- [Model providers](https://docs.openclaw.ai/concepts/model-providers) — provider setup, plugin-owned behavior, the Control UI page
- [Models CLI](https://docs.openclaw.ai/concepts/models) — ref resolution, selection order, `modelPolicy.allow`, and the utility model
- [Provider directory](https://docs.openclaw.ai/providers/) — the provider catalog
- [Ollama](https://docs.openclaw.ai/providers/ollama) — tool-support and context thresholds for local models
