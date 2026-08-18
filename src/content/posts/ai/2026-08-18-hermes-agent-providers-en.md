---
title: "Hermes Agent Model Providers: The Subscription Billing Trap, and Why Fallback Fires Only Once"
date: 2026-08-18
type: guide
category: ai
tags: [hermes-agent, llm-providers, openrouter, anthropic, fallback, prompt-caching]
lang: en
series:
  name: "Hermes Agent Documentation Guide"
  order: 3
tldr: "Hermes supports 40+ providers, and the consumer-subscription OAuth paths are where billing surprises live: Anthropic OAuth only spends Claude Max extra-usage credits, and Claude Pro can't use it at all. Auxiliary tasks default to `provider: auto`, meaning your expensive main model does compression and vision grunt work. The fallback chain is a one-shot switch per session, not continuous retry."
description: "The provider layer of Hermes Agent: subscription billing semantics, hermes model versus /model, auxiliary model routing defaults, context_length versus max_tokens, fallback chains and credential pools, and always-on prompt caching."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-18-hermes-agent-providers)

Post 3 in the series. [Start with the opener](/en/posts/ai/2026-08-18-hermes-agent-intro).

Hermes's provider list is long past the point of usefulness — the official table runs 40-plus rows of first-class providers alone: Nous Portal, OpenRouter, Anthropic, Gemini, Bedrock, Vertex, Azure Foundry, z.ai/GLM, Kimi, MiniMax, Xiaomi MiMo, Tencent TokenHub, DeepSeek, plus self-hosted paths through Ollama, vLLM, SGLang, llama.cpp, and LM Studio. The list isn't worth discussing and grows every month. **The billing semantics and the fallback behavior are what actually bite.** That's all this post covers.

## Before you sign in with a subscription, know which balance it draws from

Several providers now let you log in with a consumer subscription (Claude Max, ChatGPT, SuperGrok) via OAuth instead of an API key. The docs call this "the single most common source of billing surprises" and publish an unusually honest table — several cells read *not currently documented*.

The rows that change decisions:

| Path | Usable? | What it consumes | Common surprise |
|---|---|---|---|
| Anthropic — Claude Max + OAuth | ✅ Requires Max **and** purchased extra usage credits | Only the extra/overage credits you added | **Your included Max allowance is never touched** — all Hermes usage bills as extra usage |
| Anthropic — Claude Pro | ❌ No | — | Pro looks like it should work; it doesn't. Use `ANTHROPIC_API_KEY` (pay-per-token) instead |
| OpenAI Codex — ChatGPT OAuth | ✅ Device-code login | Not currently documented | Docs cover auth and token refresh only; plan-quota semantics are unspecified |
| xAI — SuperGrok / X Premium+ OAuth | ✅ Browser login | Subscription quota (explicit for X Search: "uses your subscription quota instead of API spend") | `HTTP 403` after a successful login — xAI restricts OAuth API access to certain SuperGrok tiers; not a stale token |
| Google Gemini consumer plans | ❌ No documented path | Your API key's quota | Free-tier keys die in a handful of agent turns, because Hermes may make several model calls per user turn |

That last row deserves emphasis: **one "user turn" for an agent is not one model call.** The tool loop, compression, and vision analysis are each their own requests. This is why every cost estimate extrapolated from chatbot usage comes out low.

The docs' own posture is worth copying too: cells marked "not currently documented" mean exactly that — "Don't assume — check your provider's billing dashboard, and treat these as open questions."

## The highest-ROI setting nobody changes

Vision analysis, web summarization, context compression, and Mixture of Agents all run on what Hermes calls the **auxiliary model**. The default is `auxiliary.*.provider: "auto"`, and auto means: **your main chat model**.

So if your main model is expensive, the grunt work of compressing a 200K-token conversation into a summary is also being done by that expensive model. The docs recommend overriding each task individually and pointing them at something cheap and fast (their example is Gemini Flash on OpenRouter). It's the single best line in the config file.

Auxiliary tasks can also carry their own fallback chain and concurrency limit, separate from the main model.

## `hermes model` and `/model` are not the same thing

The docs call this confusion out explicitly:

| Command | Where you run it | What it does |
|---|---|---|
| `hermes model` | Your terminal, outside a session | Full wizard — add providers, run OAuth, enter keys, configure endpoints |
| `/model` | Inside a chat session | Quick switch between **already-configured** providers and models |

Trying to switch to a provider you never set up? `/model` won't help. Exit the session and run `hermes model`.

## `context_length` and `max_tokens` are different quantities

The docs pin this classic confusion down in a note:

> **`context_length`** is the **total context window** — the combined budget for input *and* output tokens… **`model.max_tokens`** is the **output cap**.

The former decides when Hermes compresses history; the latter only caps a single response. Anthropic renamed their native `max_tokens` to `max_output_tokens` for the same reason.

Context-window detection runs a nine-step resolution chain: config override → custom provider per-model setting → persistent cache → the endpoint's `/models` → Anthropic `/v1/models` → OpenRouter → Nous Portal suffix matching → [models.dev](https://models.dev) (3,800+ models across 100+ providers) → family-pattern default of 128K.

The chain is that long because **the same model has different context limits depending on who serves it** — the docs' example is `claude-opus-4.6` at 1M on Anthropic direct versus 128K on GitHub Copilot. The capability you think you bought is a property of model × provider, not model.

## Fallback is a one-shot switch, not continuous retry

```yaml
fallback_providers:
  - provider: openrouter
    model: anthropic/claude-sonnet-4
  - provider: anthropic
    model: claude-sonnet-4
```

When the primary model hits rate limits, server errors, or auth failures, Hermes walks this chain, **swapping model and provider mid-session without losing the conversation**. The crucial detail is one sentence in the docs:

> The chain is tried entry-by-entry; activation is one-shot per session.

It fires once per session. So fallback is a survival mechanism, not load balancing — for the latter, use OpenRouter provider routing or LiteLLM.

A related trap sits in the official troubleshooting table: the fix for "model unavailable or odd fallback behavior" is **"keep routing off until the base provider is stable."** Turning routing and fallback on at first install makes it impossible to tell which layer failed.

Multiple keys for one provider is a separate mechanism:

```yaml
credential_pool_strategies:
  openrouter: round_robin    # cycle evenly
  anthropic: least_used      # pick the least-used key
```

Options are `fill_first` (default), `round_robin`, `least_used`, and `random`.

## Prompt caching: no switch, always on

This one moves real money and needs no configuration. For Claude via native Anthropic, OpenRouter, or Nous Portal, Hermes attaches `cache_control` breakpoints with a one-hour TTL on the system prompt and skill blocks. Within that hour the discount applies **across sessions and across forked subagents**.

Alibaba's DashScope caps TTL at five minutes upstream, so Hermes uses five there; Bedrock and Azure Foundry fall back to provider defaults; xAI uses a session-pinned conversation-id mechanism instead. The only knob is `prompt_caching.cache_ttl`, which honors `"5m"` and `"1h"` and ignores everything else.

The docs are blunt about why there's no off switch: **the system prompt alone is a meaningful fraction of input tokens**, so caching pays even on single-turn conversations.

## Two OpenRouter-specific levers

`provider_routing` takes `sort: "price" | "throughput" | "latency"`, allow/deny lists, explicit ordering, and `data_collection: "deny"` to exclude providers that may store or train on your data — that last one is a hard requirement in most enterprise settings. The shorthand is a `:nitro` (throughput) or `:floor` (price) model-name suffix.

There's also the experimental `openrouter/pareto-code` router, which auto-selects the cheapest model clearing a coding-quality bar ranked by Artificial Analysis, tuned via `min_coding_score` (0–1, default 0.65). Note that its choice shifts as the Pareto frontier moves — the same score can select a different model on a different day, which **works against reproducibility**.

## Local and self-hosted

Ollama, vLLM, SGLang, llama.cpp, and LM Studio are all first-class. The docs' own selection table: OpenRouter or Nous Portal if you just want it to work; Ollama for easy local; vLLM or SGLang for production GPU serving; fully local for maximum privacy. WSL2 users get a dedicated networking section.

The most common self-hosted failure is in the troubleshooting table too: "custom endpoint 'works' but returns garbage" — wrong base URL, wrong model name, or an endpoint that isn't actually OpenAI-compatible. **Verify the endpoint in a separate client before wiring it in.**

## The takeaway

Only three decisions in this layer actually matter: **which pocket the money comes from** (subscription overage versus per-token API versus one unified subscription), **which model does the grunt work** (don't leave auxiliary on auto), and **where you land when the primary breaks** (fallback is one-shot survival). The rest is a list, it expires, and it lives in the [official providers page](https://hermes-agent.nousresearch.com/docs/integrations/providers).

Next: [the Nous Tool Gateway](/en/posts/ai/2026-08-18-hermes-agent-tool-gateway) — one subscription in place of Firecrawl, FAL, OpenAI TTS, and Browser Use accounts.

## References

- [Hermes Agent — AI Providers](https://hermes-agent.nousresearch.com/docs/integrations/providers)
- [Hermes Agent — Configuration](https://hermes-agent.nousresearch.com/docs/user-guide/configuration)
- [Nous Portal](https://portal.nousresearch.com/)
- [OpenRouter — Provider Routing](https://openrouter.ai/docs/features/provider-routing)
- [OpenRouter — Pareto Router](https://openrouter.ai/docs/guides/routing/routers/pareto-router)
- [models.dev — model metadata registry](https://models.dev)
- [Artificial Analysis](https://artificialanalysis.ai/)
