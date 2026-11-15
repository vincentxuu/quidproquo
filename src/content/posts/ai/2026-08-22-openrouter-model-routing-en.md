---
title: "OpenRouter: One API Key for Multi-Model, Multi-Provider LLM Routing"
date: 2026-08-22
category: ai
type: deep-dive
tags: [openrouter, llm-routing, llm-inference, openai-compatible, api-gateway]
lang: en
tldr: "OpenRouter exposes many models and inference endpoints through an OpenAI-compatible API, with provider ordering, failover, BYOK, and zero-data-retention controls in one routing policy."
description: "A deep dive into OpenRouter's unified API, two-level model and provider routing, fallbacks, BYOK, costs, privacy controls, and the projects it does and does not fit."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-openrouter-model-routing)

[OpenRouter](https://openrouter.ai/) is a cloud routing layer between an application and model providers. Your code calls one API, then chooses among models from OpenAI, Anthropic, Google, and open-weight model hosts. When several providers serve the same model, routing can also account for price, speed, availability, and data policy.

It is neither a new foundation model nor a GPU inference platform. What OpenRouter sells is a unified interface plus routing control: fewer SDKs, keys, and error formats to manage, while preserving room to change models and providers. Its official [Quickstart](https://openrouter.ai/docs/quickstart) describes one endpoint for hundreds of models with automatic fallback handling.

## Layer one: change models through one interface

The simplest integration keeps the OpenAI SDK and changes only the `baseURL`, API key, and model name:

```ts
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

const response = await client.chat.completions.create({
  model: 'anthropic/claude-sonnet-4',
  messages: [{ role: 'user', content: 'Summarize these meeting notes in three points.' }],
});

console.log(response.choices[0].message.content);
```

Model IDs follow a `vendor/model` convention. Switching models usually means changing one string, which is useful for evaluations, A/B tests, and gradual provider migrations. OpenRouter also normalizes common capabilities such as streaming, tool calling, and structured outputs. A common interface does not imply identical capabilities, however. The official documentation says structured-output support is endpoint-specific, so different providers serving the same model may offer different guarantees. In production, set `require_parameters: true` to avoid routing to an endpoint that lacks a required feature ([Structured Outputs documentation](https://openrouter.ai/docs/guides/features/structured-outputs)).

This layer reduces integration cost; it does not erase model differences. Providers still vary in system-prompt behavior, reasoning controls, caching, and tool calling. If a product depends deeply on the newest native API features from one vendor, a unified interface may expose them later or less completely.

## Layer two: keep the model, choose the serving provider

An important distinction is that a model and an endpoint are not the same thing. Several inference companies may serve the same open-weight model. Even proprietary models can sometimes be reached through first-party APIs, AWS Bedrock, Google Vertex AI, or Azure. By default, OpenRouter distributes requests among eligible endpoints to improve availability. The request's `provider` object can specify ordering, fallback behavior, data restrictions, and required capabilities ([Provider Routing documentation](https://openrouter.ai/docs/guides/routing/provider-selection)).

```ts
const response = await client.chat.completions.create({
  model: 'meta-llama/llama-3.3-70b-instruct',
  messages: [{ role: 'user', content: 'Extract the invoice fields.' }],
  extra_body: {
    provider: {
      order: ['groq', 'together'],
      allow_fallbacks: true,
      require_parameters: true,
      zdr: true,
    },
  },
});
```

This separates “I want Llama” from “I want this company to run Llama.” A latency-sensitive chat product can prefer fast endpoints, batch work can sort by price, and regulated data can be restricted to qualifying endpoints. For a closer look at a specialized inference provider, read the [Groq Console introduction](/posts/ai/2026-05-06-groq-console-introduction-en). For a broader price survey, see the [LLM inference free-tier and pricing comparison](/posts/ai/2026-05-09-llm-inference-free-tier-comparison-en).

Routing introduces a new debugging problem. When output quality changes, the cause may be a model revision, serving endpoint, parameter translation, or fallback. In production, record the actual provider, model, token usage, and latency returned for each request, rather than logging only the requested model name.

## Layer three: switch models when providers fail

Provider fallback changes the endpoint while keeping the model. Model fallback changes the model too. OpenRouter's `models` array tries candidates in order when it encounters rate limits, downtime, moderation refusals, or context-length errors, and bills for the model that ultimately handled the request ([Model Fallbacks documentation](https://openrouter.ai/docs/guides/routing/model-fallbacks)).

This works well for support summaries or background jobs where getting an answer matters more than using one exact model. It is risky to chain models with widely different quality. A backup may have another context window, tool format, or safety policy; a successful HTTP response does not prove acceptable semantic quality. A useful first test is to take ten representative production inputs, deliberately disable the first choice, and verify the backup's format, quality, and cost.

If the actual requirement is to let local tools such as Claude Code and Cursor consume existing subscriptions and rotate among accounts, a cloud gateway may be the wrong category. The [9Router introduction](/posts/ai/2026-05-09-9router-ai-coding-router-introduction-en) covers local OAuth, account rotation, and three-tier fallback, with a different deployment model and trust boundary.

## Credits and BYOK: less administration, not necessarily less money

OpenRouter uses prepaid credits for inference. Its [FAQ](https://openrouter.ai/docs/faq) says underlying inference prices are passed through without markup, while credit purchases carry a platform fee. Fees and plans can change, so procurement should consult the current [Pricing page](https://openrouter.ai/pricing) instead of copying a percentage from an old article.

Organizations with existing provider contracts can use [BYOK](https://openrouter.ai/docs/guides/overview/auth/byok). OpenRouter can prioritize your provider keys, then fall back to shared OpenRouter capacity. This preserves the unified interface and failover, but requests still pass through OpenRouter, and usage beyond the plan's included BYOK allowance may carry a platform fee. If eliminating the intermediary is a hard requirement, integrate directly or evaluate a self-hosted gateway such as LiteLLM.

## How to find and use free models

You do not have to buy credits before trying a free model. OpenRouter offers two ways to select one:

| Selection | What it does | When to use it |
|---|---|---|
| A listed model ID ending in `:free` | Selects that specific free catalog entry | Comparing models or keeping the same model for a task |
| `openrouter/free` | Filters free models for the request's capabilities, then chooses one at random | Trying the API without picking a model first |

Start with the [zero-input-price shortlist](https://openrouter.ai/models?max_price=0). Open a model, confirm that its ID ends in `:free`, and check that both input and output prices are zero. The shortlist filters input price; it does not replace checking output price. Not every paid model has a free variant.

For a coding agent, also check `tools` / tool calling in the model's supported parameters. A free chat model is not automatically suitable for reading files or editing code through an agent. OpenCode 2 prefixes an OpenRouter ID with its own provider name: `vendor/model:free` becomes `openrouter/vendor/model:free` in OpenCode configuration.

To try a free route with the client above:

```ts
const response = await client.responses.create({
  model: 'openrouter/free',
  input: 'I have eggs, tofu, and cabbage. Suggest a simple dinner for two.',
});
console.log(response.output_text);
```

Free models have request limits and variable availability. For current account and provider limits, see [Limits](https://openrouter.ai/docs/api/reference/limits). For a broader comparison, see [free tiers and pricing](/posts/ai/2026-05-09-llm-inference-free-tier-comparison-en). OpenCode also offers its own free models inside the app; connecting OpenRouter is optional. The [OpenCode 2 overview](/posts/tech/2026-08-22-opencode-2-electron-rewrite-coding-agent-en) explains its current entry points.

## Privacy control is more than “not used for training”

Adding a routing layer adds another data processor to review. According to OpenRouter's [data collection documentation](https://openrouter.ai/docs/guides/privacy/data-collection), retention of prompt and response content is opt-in by default, while request metadata such as token counts and latency is retained. Downstream providers still have their own retention and training policies.

Sensitive workloads should enable [Zero Data Retention](https://openrouter.ai/docs/guides/features/zdr). Setting `zdr: true` restricts inference to endpoints marked as zero-retention. OpenRouter explicitly notes that this restriction does not cover separately enabled web search, plugins, or other third-party tools. The practical sequence is to classify the data, build a guardrail with a provider allowlist, ZDR, and required parameters, then confirm that the system fails closed when no endpoint qualifies instead of silently weakening the policy.

## Where OpenRouter fits—and where it does not

OpenRouter fits small teams that need to test many models quickly, manage multiple serving endpoints through one API, or add price and availability fallbacks at the application layer. It is also useful during prototyping: measure which models actually meet quality and latency requirements before negotiating directly with the primary provider.

It is a weaker fit when a product needs the deepest native features from one provider, requires all network traffic to remain inside an existing cloud boundary, or cannot accept an intermediary as a shared failure domain. At high volume, compare direct contracts, batch discounts, and platform fees rather than looking only at the token price on a model page.

OpenRouter's central value is not simply “cheaper models.” It turns model selection and serving-provider selection into configurable routing policy. That speed and optionality are valuable during prototyping. In production, observability, data policy, backup quality, and an exit path must be designed alongside the router—or multi-vendor lock-in merely becomes gateway lock-in.

For step-by-step setup, finding free models, and a first everyday prompt, read [How to use LLMs for free with OpenCode 2 and OpenRouter](/posts/ai/2026-11-01-free-llm-opencode2-openrouter-en).

## Update history

- 2026-11-01: Added free-model discovery, `:free` versus `openrouter/free`, zero-price and tool-support checks, and OpenCode 2 model-ID mapping.

## References

- [OpenRouter Free Variant](https://openrouter.ai/docs/guides/routing/model-variants/free)
- [OpenRouter Free Models Router](https://openrouter.ai/docs/guides/routing/routers/free-router)
- [OpenRouter Limits](https://openrouter.ai/docs/api/reference/limits)


- [OpenRouter Quickstart](https://openrouter.ai/docs/quickstart)
- [OpenRouter Provider Routing](https://openrouter.ai/docs/guides/routing/provider-selection)
- [OpenRouter Model Fallbacks](https://openrouter.ai/docs/guides/routing/model-fallbacks)
- [OpenRouter Structured Outputs](https://openrouter.ai/docs/guides/features/structured-outputs)
- [OpenRouter BYOK](https://openrouter.ai/docs/guides/overview/auth/byok)
- [OpenRouter Data Collection](https://openrouter.ai/docs/guides/privacy/data-collection)
- [OpenRouter Zero Data Retention](https://openrouter.ai/docs/guides/features/zdr)
- [OpenRouter Pricing](https://openrouter.ai/pricing)
- [On-site: Groq Console introduction](/posts/ai/2026-05-06-groq-console-introduction-en)
- [On-site: 9Router introduction](/posts/ai/2026-05-09-9router-ai-coding-router-introduction-en)
- [On-site: LLM inference free tiers and pricing](/posts/ai/2026-05-09-llm-inference-free-tier-comparison-en)
