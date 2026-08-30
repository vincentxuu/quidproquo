---
title: "How to Use Cloudflare AI Gateway: Logging, Caching, Rate Limits, and Fallbacks"
date: 2026-08-30
type: guide
category: ai
tags: [cloudflare, cloudflare-ai-gateway, cloudflare-workers-ai, llm, observability, model-routing]
lang: en
tldr: "AI Gateway is the control plane for AI calls: one layer for logs, analytics, cache, rate limits, retry/fallback, BYOK, and Unified Billing. In Workers, use env.AI.run(..., { gateway }); with external SDKs, change the baseURL or provider-native endpoint."
description: "A practical guide to Cloudflare AI Gateway: Workers bindings, REST API, provider-native endpoints, caching, rate limiting, dynamic routing, BYOK, Unified Billing, and where it fits in an AI app."
draft: true
series:
  name: "Cloudflare AI Stack"
  order: 4
additionalSeries:
  - name: "Cloudflare Edge Platform"
    order: 20
---

> 🌏 [中文版](/posts/ai/2026-08-30-cloudflare-ai-gateway-model-control)

After the first [Workers AI](https://developers.cloudflare.com/workers-ai/) demo works, the next problem is usually not "can the model answer?" It is "how do I debug LLM calls, stop runaway traffic, understand cost, and switch providers without rewriting the app?" [Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/) sits there: a control layer for model calls across logs, analytics, cache, rate limits, retry/fallback, provider keys, and billing.

The useful mental model is not "another model API." Your Worker, Agent, backend, or SDK still calls models, but the request passes through AI Gateway first. The Gateway records the call, applies cache and limits, routes to a fallback model when configured, and returns the provider response.

## Where it fits

AI Gateway belongs between application logic and model providers.

```txt
Client / Cron / Queue
        |
        v
Cloudflare Worker or Agent
        |
        v
AI Gateway
        |
        +--> Workers AI
        +--> OpenAI / Anthropic / Google AI Studio / Groq / Mistral / ...
```

That layer solves production problems:

- **Observability**: inspect provider, model, tokens, cost, latency, and status for each request.
- **Cost control**: use cache, rate limits, budget limits, and dynamic routes to keep traffic bounded.
- **Provider management**: one gateway can front [Workers AI](https://developers.cloudflare.com/workers-ai/), OpenAI, Anthropic, Google AI Studio, Groq, Mistral, OpenRouter, Perplexity, and other supported [providers](https://developers.cloudflare.com/ai-gateway/usage/providers/).
- **Centralized secrets**: [BYOK](https://developers.cloudflare.com/ai-gateway/configuration/bring-your-own-keys/) keeps provider API keys on Cloudflare instead of in app deployments.
- **Consolidated billing**: [Unified Billing](https://developers.cloudflare.com/ai-gateway/features/unified-billing/) lets supported provider calls draw from Cloudflare AI Gateway credits.

If you have one internal script calling a model ten times per day, direct provider APIs are fine. AI Gateway becomes useful once you have users, multiple models, production logs, or platform-level cost controls.

## Three integration paths

### 1. Workers AI binding

Inside a Worker, the [AI Gateway Workers binding](https://developers.cloudflare.com/ai-gateway/usage/worker-binding-methods/) is the cleanest path. You still call `env.AI.run()`, with a `gateway` option in the third argument.

```ts
export default {
  async fetch(request, env) {
    const result = await env.AI.run(
      "@cf/zai-org/glm-5.3-flash",
      {
        messages: [
          { role: "system", content: "Reply in Traditional Chinese." },
          { role: "user", content: "Explain AI Gateway in three sentences." },
        ],
      },
      {
        gateway: {
          id: "default",
          cacheTtl: 300,
          metadata: {
            app: "blog-demo",
            feature: "summary",
          },
        },
      },
    );

    return Response.json({ result, logId: env.AI.aiGatewayLogId });
  },
};
```

This avoids hand-building Gateway URLs inside the Worker and gives you `env.AI.aiGatewayLogId`. Later you can call `env.AI.gateway("default").getLog(logId)` or `patchLog()` to inspect or enrich the record. One caveat: third-party models through the AI binding require AI Gateway and Unified Billing. If you need a non-`default` BYOK alias, use the provider-native endpoint and pass `cf-aig-byok-alias`.

### 2. REST API

For Cloudflare REST calls, you need an Account ID and an API token with `AI Gateway - Read`, `AI Gateway - Edit`, and `Workers AI - Read`. Workers AI chat completions can go through `/ai/v1/chat/completions` with the `cf-aig-gateway-id` header.

```bash
curl "https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/ai/v1/chat/completions" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "cf-aig-gateway-id: default" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "@cf/zai-org/glm-5.3-flash",
    "messages": [
      { "role": "user", "content": "Summarize this issue." }
    ]
  }'
```

Cloudflare auto-creates a `default` gateway. That is convenient for a first request, but production apps should use named gateways so analytics, rate limits, routes, and retention do not all collapse into one shared bucket.

### 3. Provider-native endpoint

If the app already uses the OpenAI SDK, Anthropic SDK, or Vercel AI SDK, you probably do not want to rewrite request payloads. AI Gateway's [provider-specific endpoint](https://developers.cloudflare.com/ai-gateway/get-started/) preserves provider payloads and usually only changes `baseURL`:

```ts
import OpenAI from "openai";

export default {
  async fetch(request, env) {
    const gateway = env.AI.gateway("production");

    const openai = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
      baseURL: gateway.getUrl("openai"),
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: "Draft a release note." }],
    });

    return Response.json(response);
  },
};
```

This is the best migration path for existing applications: switch the base URL to Gateway, observe logs and spend, then add cache, rate limits, BYOK, or dynamic routing.

## Logging and analytics

[AI Gateway analytics](https://developers.cloudflare.com/ai-gateway/observability/analytics/) aggregates requests, token usage, costs, errors, and cached responses. You can inspect it in the dashboard or query it with GraphQL. For an AI app, this is more useful than knowing "the model is expensive" in the abstract: you can group by feature, user, team, tenant, or experiment.

[Logging](https://developers.cloudflare.com/ai-gateway/observability/logging/) is per request. Logs can include provider, timestamp, status, token usage, cost, duration, user agent, prompt, and response. Decide the privacy policy before turning this into production telemetry. Logs are enabled by default; if you do not want raw payloads stored, set `cf-aig-collect-log-payload: false` on the request. That keeps metadata while skipping prompts and responses. Use `cf-aig-collect-log: false` only when you want to skip the whole log.

I treat metadata as required:

```ts
gateway: {
  id: "production",
  metadata: {
    app: "support-copilot",
    tenant: tenantId,
    feature: "answer-draft",
    experiment: "rerank-v2",
  },
}
```

Now the debugging question can be precise: which tenant and feature spent the money?

## Cache: cheap, but exact

[AI Gateway caching](https://developers.cloudflare.com/ai-gateway/features/caching/) works well for repeated prompts, fixed classification tasks, document summaries, and evaluation fixtures. It supports text and image responses and is off by default. Cache status is reported through `cf-aig-cache-status: HIT` or `MISS`.

The key limitation is exactness. The default cache key considers provider, endpoint, model, provider auth header, and the full request body. Any change to messages, tools, temperature, metadata, or another parameter creates a separate cache entry. In multi-turn chat, context changes almost every request, so cache hit rates do not rise automatically.

The main controls are:

- `cf-aig-skip-cache`: bypass cache for one request.
- `cf-aig-cache-ttl`: set TTL; official limits are 60 seconds minimum and one month maximum.
- `cf-aig-cache-key`: set a custom cache key; using one opts the request into caching.

Workers binding maps these to `skipCache`, `cacheTtl`, and `cacheKey`. I use this only where inputs can be canonicalized, such as a summary for a specific document version:

```ts
const digest = await env.AI.run(model, payload, {
  gateway: {
    id: "production",
    cacheKey: `doc-summary:${docId}:${docVersion}`,
    cacheTtl: 24 * 60 * 60,
  },
});
```

Do not treat this as semantic cache. AI Gateway caches exact requests. Similar-question reuse still belongs in embedding, retrieval, or application-level canonicalization.

## Rate limits, budgets, and dynamic routing

[Rate limiting](https://developers.cloudflare.com/ai-gateway/features/rate-limiting/) applies fixed or sliding windows at the gateway layer. Requests over the limit return `429 Too Many Requests`. A basic setup limits requests per minute for a gateway; a better setup separates free users, paid users, and internal jobs with metadata or routes.

[Dynamic Routing](https://developers.cloudflare.com/ai-gateway/features/dynamic-routing/) goes further. A route flow can include conditions, percentage splits, model nodes, rate limits, budget limits, and fallbacks. Typical uses:

- Free tier on a cheaper model; paid tier on a stronger model.
- A team that exhausts its daily budget moves to a smaller model or gets rejected.
- A new model starts at 5% traffic before a wider rollout.
- If the primary provider fails, route to another provider.

Two current constraints matter: Dynamic Routing requires an authenticated gateway and BYOK; the docs also state that dynamic routes currently use the OpenAI-compatible `/compat/chat/completions` endpoint and are not yet available on the standard REST API. For single-model calls, use the newer REST path. For route flows, follow the dynamic routing endpoint.

## BYOK, Unified Billing, and Secrets Store

AI Gateway resolves provider credentials in this order: provider key on the request, BYOK default alias stored in the Gateway, then Unified Billing. That precedence comes from the [Unified Billing](https://developers.cloudflare.com/ai-gateway/features/unified-billing/) docs.

[BYOK](https://developers.cloudflare.com/ai-gateway/configuration/bring-your-own-keys/) is mainly about operational control, not lower pricing. Provider keys are stored by Cloudflare in [Secrets Store](https://developers.cloudflare.com/secrets-store/). Your app calls Gateway with Cloudflare gateway authorization, and Gateway attaches the provider key. The naming convention is `{gateway_id}_{provider_slug}_{alias}`, such as `production_openai_default`.

Unified Billing is a different billing model: buy AI Gateway credits, then use Cloudflare as the billing layer for supported providers. Provider token prices are passed through, and Cloudflare charges a 5% fee when credits are purchased. This is useful when you want Workers AI, OpenAI, Anthropic, Google AI Studio, and similar spend on one Cloudflare bill. Two details matter: Workers AI must be configured for Unified billing to consume AI Gateway credits; Unified Billing has a per-gateway `200 requests / 60s` rate limit, while BYOK traffic does not count against that limit.

The decision tree is simple:

- Existing provider contract and key rotation requirements: use BYOK.
- Fewer provider accounts and consolidated payments: use Unified Billing.
- Small development workload: direct provider key is acceptable, then clean it up before production.

## How it composes in an AI app

In the Cloudflare AI Stack, AI Gateway is rarely the first service you add, but it is one of the earliest cross-cutting layers to introduce:

```txt
Workers / Agents        request orchestration
AI Gateway              logs, cache, limits, routes, keys, billing
Workers AI              inference on Cloudflare
Vectorize / AI Search   retrieval
D1 / Durable Objects    app state, sessions, coordination
R2                      files, datasets, eval artifacts
Queues / Workflows      async jobs and long-running steps
```

Concrete patterns:

- **RAG app**: run embedding and rerank on Workers AI; send generation through AI Gateway. Put `corpus_id`, `retrieval_version`, and `tenant` in metadata so cost can be tied to retrieval quality.
- **Agent app**: route every model call inside the tool loop through Gateway. Use rate or budget limits to protect one session from a bad prompt or loop bug.
- **Content generation app**: add cache keys for repeated summaries, classification, and tagging. For long-form generation, logs and fallback matter more than cache.
- **Multi-provider app**: start with provider-native endpoints so existing SDK calls survive, then use Dynamic Routing for A/B tests and fallback.

AI Gateway does not solve prompt quality, RAG chunking, model evaluation, or data authorization. Those still belong in the application, AI Search/Vectorize, D1/Durable Objects, and storage layers. Gateway gives the production control plane that many AI demos lack.

## First checklist

Before putting AI Gateway in production, decide:

- Whether gateways are split by app, environment, or tenant.
- Metadata schema: at least app, env, feature, tenant, or user tier.
- Logging policy: whether to store prompts/responses or metadata only.
- Cache policy: which tasks have stable cache keys and TTLs.
- Limit policy: free, paid, and internal job request/budget limits.
- Key policy: request provider key, BYOK, or Unified Billing.
- Fallback policy: which errors retry, switch model, or fail immediately.

The point is not to make a demo faster. The point is to make a production AI app observable, bounded, and replaceable at the model layer.

## References

- [Cloudflare AI Gateway — Overview](https://developers.cloudflare.com/ai-gateway/)
- [Cloudflare AI Gateway — Get started](https://developers.cloudflare.com/ai-gateway/get-started/)
- [Cloudflare AI Gateway — Workers binding methods](https://developers.cloudflare.com/ai-gateway/usage/worker-binding-methods/)
- [Cloudflare AI Gateway — Providers](https://developers.cloudflare.com/ai-gateway/usage/providers/)
- [Cloudflare AI Gateway — Caching](https://developers.cloudflare.com/ai-gateway/features/caching/)
- [Cloudflare AI Gateway — Rate limiting](https://developers.cloudflare.com/ai-gateway/features/rate-limiting/)
- [Cloudflare AI Gateway — Dynamic routing](https://developers.cloudflare.com/ai-gateway/features/dynamic-routing/)
- [Cloudflare AI Gateway — Analytics](https://developers.cloudflare.com/ai-gateway/observability/analytics/)
- [Cloudflare AI Gateway — Logging](https://developers.cloudflare.com/ai-gateway/observability/logging/)
- [Cloudflare AI Gateway — Bring your own keys](https://developers.cloudflare.com/ai-gateway/configuration/bring-your-own-keys/)
- [Cloudflare AI Gateway — Unified Billing](https://developers.cloudflare.com/ai-gateway/features/unified-billing/)
- [Cloudflare AI Gateway — Limits](https://developers.cloudflare.com/ai-gateway/reference/limits/)
- [Cloudflare Secrets Store](https://developers.cloudflare.com/secrets-store/)
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)
