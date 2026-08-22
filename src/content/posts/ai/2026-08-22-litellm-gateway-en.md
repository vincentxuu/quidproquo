---
title: "LiteLLM: From a Python SDK to a Self-Hosted AI Gateway"
date: 2026-08-22
category: ai
type: deep-dive
tags: [litellm, ai-gateway, llm-routing, openai-compatible, llm, self-hosted]
lang: en
tldr: "LiteLLM is not a model provider. It is a Python SDK and self-hosted proxy that normalizes 100+ LLM APIs, then centralizes routing, fallbacks, virtual keys, budgets, and observability at the gateway layer."
description: "A practical guide to LiteLLM's Python SDK and proxy gateway, routing and fallbacks, budget controls, observability integrations, and how it differs from hosted aggregators such as OpenRouter."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-litellm-gateway)

[LiteLLM](https://github.com/BerriAI/litellm) is not another model provider selling tokens. It is an open-source interface between applications and model APIs: a small project can import it as a Python package, while a team can deploy the same set of capabilities as a centralized AI gateway. The project currently claims support for [more than 100 LLM providers](https://docs.litellm.ai/) and normalizes requests, responses, and exceptions around OpenAI-compatible formats.

That distinction matters. OpenRouter, Together, and Fireworks primarily provide hosted inference and billing. LiteLLM's central value is that you can keep your own OpenAI, Anthropic, Bedrock, Vertex AI, and other accounts while deciding how traffic is routed, who receives access, how much they may spend, and where telemetry goes.

## Start by separating the two LiteLLM products

LiteLLM has two deployment modes, and they solve different problems.

The **Python SDK** lives inside your application. Your code calls `completion()` with a `provider/model` name; LiteLLM translates the request for the provider and returns a more consistent response and exception shape. It is a good fit for a single Python service, prototype, or agent that needs fewer provider SDKs without operating another network service.

```python
from litellm import completion

response = completion(
    model="anthropic/claude-sonnet-4-5-20250929",
    messages=[{"role": "user", "content": "Summarize this incident."}],
)
print(response.choices[0].message.content)
```

The **Proxy Server (AI Gateway)** is a separate service. Applications in any language point an OpenAI client at it, while real provider credentials remain in the gateway. LiteLLM positions the proxy as a central entry point for platform teams, with authentication, virtual keys, multi-tenant spend tracking, and an admin UI. Those capabilities do not appear merely because an application changed its `base_url`. [The official introduction explicitly separates the SDK's in-application role from the proxy's centralized-gateway role](https://docs.litellm.ai/).

```text
App / Agent / IDE
        │ OpenAI-compatible request
        ▼
  LiteLLM Proxy
   ├─ auth / budget / logs
   ├─ route / retry / fallback
   └─ provider credentials
        │
        ├─ OpenAI / Anthropic
        ├─ Bedrock / Vertex AI
        └─ Together / Fireworks / self-hosted model
```

## A unified interface helps, but does not erase differences

LiteLLM's philosophy is to normalize the common surface, not pretend every model behaves identically. Chat, streaming, embeddings, images, audio, and the Responses API can use similar call patterns. The documentation also says provider errors are mapped to OpenAI exception classes, which makes upper-layer retries and error handling more consistent.

Provider-specific features still need provider-specific parameters, however, and identically named features do not necessarily have identical semantics. Bedrock's AWS identity, Vertex AI's project and region, and Anthropic's caching behavior do not disappear behind an OpenAI-shaped request. A practical design uses the unified interface for the common path and keeps integration tests for any provider capability the application genuinely depends on. Format compatibility is not behavioral equivalence.

## Routing, retries, and fallbacks are different operations

LiteLLM Router can bind one logical model name to several deployments. A routing strategy picks a deployment; retry rules handle individual failures; repeatedly failing deployments may enter cooldown; and a fallback model is tried only after those mechanisms cannot complete the request.

The [official routing documentation](https://docs.litellm.ai/docs/routing) lists weighted selection, rate-limit-aware, latency-based, least-busy, and lowest-cost strategies, and recommends `simple-shuffle` as the production default. This is distinct from using a classifier to judge task difficulty and choose a cheap or expensive model. The former primarily distributes calls among deployments; the latter is application-level task routing. LiteLLM can participate in both, but they should not be treated as one concept.

Fallback does not have to mean “switch models after any error,” either. LiteLLM separates general, context-window, and content-policy fallbacks. Its [reliability documentation](https://docs.litellm.ai/docs/proxy/reliability) also allows fallbacks to be disabled per request or key. That matters for payments or structured extraction, where a clear failure may be safer than silently switching to a model with different behavior.

## Virtual keys and budgets turn the gateway into a control plane

The proxy can issue LiteLLM virtual keys, keeping upstream provider credentials out of individual services. A key can restrict models, RPM or TPM, and budgets, and can belong to a user or team. According to the [virtual-key documentation](https://docs.litellm.ai/docs/proxy/virtual_keys), persistent key and spend management requires PostgreSQL, with a master key used to create subordinate keys.

Budgets are enforcement controls, not just dashboard reports. The [budget documentation](https://docs.litellm.ai/docs/proxy/users) says requests are rejected after a virtual key exceeds `max_budget`, and a duration can periodically reset that allowance. A team can therefore issue separate keys for staging, internal tools, and production. A useful action tonight is to give non-production workloads a key with a model allowlist and monthly ceiling instead of sharing the master key everywhere.

Cost controls still have boundaries. LiteLLM estimates spend from model pricing data and reported usage; it is not the provider's final invoice. Private discounts, caching, batch rates, or a provider price change can produce differences. Treat it as a real-time guardrail and attribution layer, while reconciling month-end totals against cloud bills.

## Observability is an outlet, not a complete analytics product

Both SDK and proxy can use callbacks to send successes, failures, latency, tokens, and cost data to external systems. [The official introduction](https://docs.litellm.ai/) lists integrations including Langfuse, MLflow, Helicone, and custom callbacks. LiteLLM acts as the collection and forwarding layer; trace search, evaluation datasets, and prompt-version comparisons still belong in an observability product such as Langfuse.

This split also creates a privacy risk. If a callback records full prompts and responses, sensitive data flows into another system. Before production, verify which fields leave the gateway, how long they are retained, and whether callback failures block the primary request. Send a test trace containing fake sensitive data and inspect what actually arrives downstream.

## How it differs from OpenRouter and 9Router

| Tool | Primary role | Upstream billing and keys | Best fit |
|---|---|---|---|
| [LiteLLM](https://github.com/BerriAI/litellm) | SDK or self-hosted gateway | Usually held directly by you | Teams centralizing API shape, access, budgets, and telemetry |
| OpenRouter | Hosted model aggregation API | Central OpenRouter balance or supported BYOK | Fast access to many models through one hosted API |
| [9Router](/posts/ai/2026-05-09-9router-ai-coding-router-introduction-en) | Local router oriented toward coding CLIs | Subscription OAuth and API keys stay local | Connecting Claude Code, Cursor, and similar tools to several sources |

LiteLLM can also use OpenRouter as one upstream provider, so these are not mutually exclusive products. The actual decision is who owns the control plane. Choose a hosted aggregator when speed of adoption matters more than operating a gateway. LiteLLM becomes compelling when you already have multi-cloud accounts, data-boundary requirements, or team-level quotas.

## Overall

LiteLLM's strongest feature is not simply the number of models it supports. It brings API normalization, reliability, identity, cost control, and telemetry into one self-hostable entry point. The Python SDK is a sensible way to validate the interface first. When a second service needs the same fallback, budget, and logging policy, moving that configuration into the proxy is usually more practical than deploying a full control plane on day one.

It is a poor fit for a tiny application with one provider and one service, and it cannot eliminate capability differences among models. The gateway also becomes another critical service: its database, upgrades, scaling, Redis, and credentials all need operations. That cost is the real tradeoff between LiteLLM and a hosted aggregation API.

Further reading: [Open-Source Multi-Model Routing Tools](/posts/ai/2026-04-02-multi-model-routing-opensource-tools-en) and [2026 LLM Inference Free Tiers and Pricing](/posts/ai/2026-05-09-llm-inference-free-tier-comparison-en).

## References

- [LiteLLM documentation: Getting Started](https://docs.litellm.ai/)
- [LiteLLM GitHub repository](https://github.com/BerriAI/litellm)
- [LiteLLM Router: Load Balancing](https://docs.litellm.ai/docs/routing)
- [LiteLLM Proxy: Fallbacks](https://docs.litellm.ai/docs/proxy/reliability)
- [LiteLLM Proxy: Virtual Keys](https://docs.litellm.ai/docs/proxy/virtual_keys)
- [LiteLLM Proxy: Budgets and Rate Limits](https://docs.litellm.ai/docs/proxy/users)
- [On-site: An Introduction to 9Router](/posts/ai/2026-05-09-9router-ai-coding-router-introduction-en)
- [On-site: Open-Source Multi-Model Routing Tools](/posts/ai/2026-04-02-multi-model-routing-opensource-tools-en)
- [On-site: LLM Inference Free Tiers and Pricing](/posts/ai/2026-05-09-llm-inference-free-tier-comparison-en)
