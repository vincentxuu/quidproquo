---
title: "Helicone Deep Dive: LLM Gateway, Request Tracing, and Cost Analytics"
date: 2026-08-22
category: ai
type: deep-dive
tags: [helicone, llm-observability, ai-gateway, tracing, llmops, open-source]
lang: en
tldr: "Helicone is an open-source LLM gateway and observability platform: requests sent through its compatible endpoint automatically capture model, latency, tokens, cost, and custom properties, while managed credits or BYOK enable routing and fallbacks."
description: "A practical guide to Helicone's gateway, asynchronous logging, request/session/trace model, cost analytics, self-hosted architecture, and boundaries relative to LiteLLM, Portkey, and LangSmith."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-helicone-llm-observability)

[Helicone](https://github.com/Helicone/helicone) is an open-source LLM gateway and observability platform. It sits between an application and model providers, forwarding requests while recording model, latency, tokens, cost, errors, and application-defined properties. Engineers can move from a failed answer to the API calls that produced it.

Its data path distinguishes it from a tracing-only SDK. The shortest integration points an OpenAI client's `baseURL` at Helicone. The gateway then sees the full request and response and can route, fall back, cache, and rate-limit. When policy prohibits a proxy, Helicone also supports asynchronous logging, but gateway controls no longer sit in the critical path.

This guide follows one request lifecycle: choose an integration path, structure requests into sessions and traces, connect costs to feedback, and then define data and self-hosting boundaries. For centralized multi-provider control rather than observation-first tooling, read the [LiteLLM](/posts/ai/2026-08-22-litellm-gateway-en) and [Portkey](/posts/ai/2026-08-22-portkey-ai-gateway-en) guides.

## Two integration paths: gateway or asynchronous logging

The current [official quickstart](https://docs.helicone.ai/getting-started/quick-start) leads with an OpenAI-compatible AI Gateway. Change the endpoint and API key to call multiple providers through one interface. Teams can use Helicone credits or bring provider keys.

```ts
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://ai-gateway.helicone.ai',
  apiKey: process.env.HELICONE_API_KEY,
});

const response = await client.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [{ role: 'user', content: 'Summarize this support transcript.' }],
});
```

The separate [gateway integration](https://docs.helicone.ai/getting-started/integration-method/gateway) can preserve upstream credentials and select a destination with `Helicone-Target-Url`. This suits teams with enterprise contracts or regional endpoints. Before choosing either path, establish who owns upstream keys, who bills the request, which regions it crosses, and which provider actually serves a fallback.

If prompts cannot pass through Helicone's proxy, [async logging](https://docs.helicone.ai/getting-started/integration-method/openai) keeps model traffic direct and submits telemetry separately. It reduces proxy involvement but cannot enforce pre-request routing, caching, or rate limits. Draw the sensitive-data path before optimizing integration convenience.

## Requests, sessions, and traces require deliberate IDs

A request explains one call's latency, token use, and error. It cannot explain a complete agent task. Chats span multiple completions; agents add retrieval, tool calls, and retries. Sessions, traces, and custom properties connect those requests.

Generate a stable session ID on the server and attach non-sensitive feature and environment labels. Never use email addresses, full document names, or access tokens as properties. Analytics labels are telemetry, not a secret store.

```ts
const client = new OpenAI({
  baseURL: 'https://gateway.helicone.ai/v1',
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    'Helicone-Auth': `Bearer ${process.env.HELICONE_API_KEY}`,
    'Helicone-Session-Id': sessionId,
    'Helicone-Property-Environment': 'staging',
    'Helicone-Property-Feature': 'support-summary',
  },
});
```

Start with one non-critical flow. Treat one user operation as one session and verify that retries and fallbacks remain in the same trace. If every attempt creates a new session, cost and success metrics fragment into API calls instead of measuring whether the task completed.

## Cost, latency, and feedback belong together

Helicone can segment tokens, cost, and latency by model, user, property, and time. That adds product context absent from a provider invoice. Properties can reveal which feature, environment, or customer segment caused spend.

Observed cost is still an estimate, not an accounting ledger. Missing price mappings, discounts, cached tokens, and newly released models can diverge from the final invoice. Use observability for trends and anomalies, reconcile against provider billing, and sample request-level token and rate calculations.

Successful HTTP responses do not establish answer quality. Store thumbs, human labels, or programmatic checks as feedback, then move failing requests into a dataset. The smallest useful loop is concrete: collect a batch of negative-feedback requests, modify the prompt, and rerun them instead of merely watching a dashboard curve.

## Gateway routing does not guarantee model behavior

[Provider Routing](https://docs.helicone.ai/gateway/provider-routing) uses the model registry to locate providers, prioritizes BYOK before managed credits, and tries another source on rate limits, timeouts, or server errors. This improves transport availability; it does not prove that model versions, system prompts, or output behavior are identical across hosts.

Record the actual provider, model identifier, attempt count, and error reason. Structured-output and tool-calling paths need the same golden prompts against every route. If a backup cannot satisfy the schema, fail explicitly instead of turning availability into silent bad data.

Caching and rate limits also live at the gateway. Cache only deterministic, non-sensitive requests unless the key includes every authorization and freshness dimension that affects the answer. Enforce limits using trusted server-side identities, not a header supplied by the browser.

## Self-hosting is a stack, not one container

Helicone is Apache-2.0 and provides a Docker Compose path. The [official repository's architecture](https://github.com/Helicone/helicone#self-hosting-open-source-llm-observability) includes the web application, proxy worker, collection service, Supabase, ClickHouse, and MinIO; production Helm deployment requires enterprise access. “Self-hostable” does not mean “one binary.”

Production operators own retention, backup restoration, upgrades, deletion, TLS, SSO, monitoring, and capacity. ClickHouse serves analytics, object storage holds payloads, and application data and authentication have separate services. Avoiding SaaS without staffing this stack merely replaces vendor exposure with internal on-call work.

The decisive data choice is whether to store prompts and responses. Full content is best for debugging and most likely to contain personal or proprietary data. Begin with metadata-only or redacted logging. Send synthetic sensitive text through the entire flow and verify that it is absent from dashboards, exports, backups, and deletion results before relaxing the policy.

## Where Helicone fits—and where it does not

Helicone fits teams seeking low-friction request observability, cost attribution, and gateway routing, especially those already using OpenAI-compatible clients and ready to evolve from API logs into sessions, feedback, and datasets.

It is a weaker fit when only basic OpenTelemetry traces are needed, third-party content processing is prohibited, or the team cannot operate the full self-hosted analytics stack. LangSmith is closer to complex agent trajectories and offline/online evaluation workflows; LiteLLM and Portkey act more like control planes for keys, budgets, and providers.

Helicone's core bargain is simple: place LLM requests behind one entry point in exchange for low-friction visibility. The selection questions are whether a proxy may enter the data path, which fields may be retained, and who will turn traces into a real quality loop.

## References

- [Helicone GitHub repository](https://github.com/Helicone/helicone)
- [Helicone Quickstart](https://docs.helicone.ai/getting-started/quick-start)
- [Helicone Gateway Integration](https://docs.helicone.ai/getting-started/integration-method/gateway)
- [Helicone OpenAI Async Logging](https://docs.helicone.ai/getting-started/integration-method/openai)
- [Helicone Provider Routing](https://docs.helicone.ai/gateway/provider-routing)
- [LiteLLM Guide](/posts/ai/2026-08-22-litellm-gateway-en)
- [Portkey Guide](/posts/ai/2026-08-22-portkey-ai-gateway-en)
