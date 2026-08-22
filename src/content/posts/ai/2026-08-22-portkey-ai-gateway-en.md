---
title: "Portkey: Put LLM Routing, Observability, and Governance Behind One AI Gateway"
date: 2026-08-22
category: ai
type: deep-dive
tags: [portkey, ai-gateway, llm-routing, observability, guardrails, openai-compatible]
lang: en
tldr: "Portkey sits between applications and model providers: one OpenAI-compatible endpoint adds routing, fallbacks, request logs, budgets, and guardrails, with an open-source gateway available for self-hosting."
description: "An introduction to Portkey AI Gateway, its routing, observability, and governance model, and how it differs from OpenRouter, LiteLLM, and 9Router."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-portkey-ai-gateway)

[Portkey](https://portkey.ai/docs/product/ai-gateway) is an AI gateway placed between an application and its model providers. It does not train models or sell another pool of inference tokens. It receives requests that would otherwise go directly to OpenAI, Anthropic, Google, or a private endpoint, then applies routing, retries, fallbacks, usage logging, budgets, and safety policies.

That distinction matters. OpenRouter primarily answers, “How can I buy and call many models through one account?” Portkey answers, “My organization already has provider accounts; how do I govern their traffic consistently?” Both expose a unified API, but they own different parts of the stack.

## The product is a control plane, not merely a proxy

With one LLM provider, an application needs little more than an endpoint, an API key, and a model name. A second provider raises operational questions: should a 429 trigger a switch, how many retries are safe, which team incurred a charge, may sensitive data leave the system, and can traces retain the same fields after a model change?

Portkey centralizes those cross-provider concerns. Its documentation lists conditional routing, load balancing, fallbacks, retries, circuit breakers, caching, rate limits, budget limits, and canary testing. The application sends one request and a gateway config selects its destination; policy changes no longer have to be copied into every service.

```text
Web / API / Agent
        │ OpenAI-compatible request
        ▼
Portkey AI Gateway
  ├─ route / retry / fallback
  ├─ budget / rate limit / guardrail
  └─ logs / traces / cost attribution
        │
        ├── OpenAI
        ├── Anthropic
        ├── Google
        └── private model endpoint
```

The tradeoff is visible in the same diagram: the gateway becomes a new critical path. Adopting it requires choosing Portkey's hosted endpoint, the open-source self-hosted gateway, or an enterprise deployment, then verifying where prompts, responses, logs, and credentials travel.

## Connect through the OpenAI-compatible interface

[Portkey's compatibility guide](https://portkey.ai/docs/integrations/libraries/openai-compatible) reduces the smallest migration to two settings: use `https://api.portkey.ai/v1` as the base URL and replace the API key with a Portkey key. A provider and model can be addressed as `@provider-slug/model-name`.

```ts
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.portkey.ai/v1',
  apiKey: process.env.PORTKEY_API_KEY,
});

const response = await client.chat.completions.create({
  model: '@openai-prod/gpt-4o',
  messages: [{ role: 'user', content: 'Summarize this incident log in three points.' }],
});

console.log(response.choices[0].message.content);
```

This only proves that a request passes through Portkey. A more useful production setup creates provider integrations in Model Catalog and moves routing policy into a config. The application then holds neither every raw provider credential nor the fallback order.

## A fallback is a strategy tree

The [fallback documentation](https://portkey.ai/docs/product/ai-gateway/fallbacks) supports an ordered list of models or providers and can restrict switching to status codes such as 429 and 503. Each target may itself contain a load balancer, conditional router, or another fallback.

```json
{
  "strategy": {
    "mode": "fallback",
    "on_status_codes": [429, 503]
  },
  "targets": [
    { "override_params": { "model": "@openai-prod/gpt-4o" } },
    { "override_params": { "model": "@anthropic-prod/claude-sonnet" } }
  ]
}
```

This is easier to maintain than a chain of application-level `try/catch` blocks, but API compatibility does not imply behavioral equivalence. Models differ in tool calling, structured output, context limits, and refusals. Before enabling a fallback, run the same golden prompts against the primary and backup; if software parses the result, validate its schema automatically.

## Observability, cost, and governance are the other half

Portkey records tokens, latency, and cost for each request, while traces and config identifiers reveal every attempt in a fallback chain. That adds application context missing from a provider invoice: teams can attribute spend to a feature, environment, or group instead of merely seeing what one API key consumed.

Cost controls require more scrutiny than a feature label. The [Budget Limits documentation](https://portkey.ai/docs/product/ai-gateway/virtual-keys/budget-limits) says that some controls are limited to Enterprise and selected Pro customers. A model without pricing support may also show zero cost and remain outside a cost-based limit. Confirm plan entitlements individually instead of assuming that “budget support” always means the current plan can hard-stop overspend.

Security follows the same rule. Guardrails can centralize PII detection, content filtering, and organizational policy, but they do not prove compliance by themselves. Teams still need to verify log retention, data location, RBAC, upstream provider terms, and who owns upgrades and incident response in a self-hosted deployment.

## Portkey versus OpenRouter, LiteLLM, and 9Router

| Tool | Primary role | Credentials and billing | Best fit |
|---|---|---|---|
| [Portkey](https://portkey.ai/docs/product/ai-gateway) | Hosted or self-hosted gateway and governance platform | Can centralize existing provider integrations | Teams needing routing, observability, budgets, and policy |
| [OpenRouter](https://openrouter.ai/docs/quickstart) | Multi-model aggregation API | Fund OpenRouter and use one key | Fast access to many models without opening every provider account |
| [LiteLLM](https://docs.litellm.ai/) | Open-source SDK and proxy | Usually uses your provider keys | Owning the compatibility layer and deployment |
| [9Router](/posts/ai/2026-05-09-9router-ai-coding-router-introduction-en) | Local coding-CLI router | Keeps API keys and selected subscription tokens locally | Individuals using Claude Code, Cursor, Codex, and similar tools |

For experimenting with ten models, an aggregation API is usually faster. If an organization already has AWS, Google Cloud, and OpenAI contracts but struggles with permissions, attribution, and failover, Portkey's control plane becomes relevant. If every data and control component must remain inside the organization's environment, compare the operational cost of LiteLLM with Portkey's self-hosted options.

## Overall

Portkey is not aimed at the first LLM API call. It is aimed at the point where one company has many such calls. As models, credentials, teams, and environments multiply, retry logic and cost records scattered across services become operational debt; a gateway pulls them into one observable, policy-controlled entry point.

A practical evaluation starts with one non-critical traffic path. Change only the base URL and inspect latency and data boundaries. Then add one fallback that triggers only on 429 and 503. Moving every model, guardrail, and budget rule on day one makes it difficult to tell whether a failure came from the model, the policy, or the gateway.

For model prices, continue with the site's [40-plus LLM inference provider roundup](/posts/ai/2026-05-09-llm-inference-free-tier-comparison-en). If the use case is limited to local coding agents, read the [9Router introduction](/posts/ai/2026-05-09-9router-ai-coding-router-introduction-en) first.

## References

- [Portkey AI Gateway](https://portkey.ai/docs/product/ai-gateway)
- [Portkey with any OpenAI-compatible project](https://portkey.ai/docs/integrations/libraries/openai-compatible)
- [Portkey fallbacks](https://portkey.ai/docs/product/ai-gateway/fallbacks)
- [Portkey budget limits](https://portkey.ai/docs/product/ai-gateway/virtual-keys/budget-limits)
- [Portkey AI Gateway on GitHub](https://github.com/Portkey-AI/gateway)
- [On this site: 9Router's local three-tier fallback router](/posts/ai/2026-05-09-9router-ai-coding-router-introduction-en)
- [On this site: free tiers and pricing across 40-plus LLM inference providers](/posts/ai/2026-05-09-llm-inference-free-tier-comparison-en)
