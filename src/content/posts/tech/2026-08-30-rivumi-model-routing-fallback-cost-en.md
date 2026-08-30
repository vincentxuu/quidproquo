---
title: "Rivumi model roles, fallback, cache hints, and estimated cost"
date: 2026-08-30
category: tech
type: deep-dive
tags: [rivumi, coding-agent, llm-routing, prompt-caching, cost-tracking]
lang: en
tldr: "Rivumi uses a static model-role catalog and retries or falls back only after retryable provider errors. Cache data is a provider hint plus trace, while cost is a static-table estimate; neither is live routing intelligence or a bill."
description: "Trace Rivumi model-role candidates, retry and fallback control flow, provider cache hints, and best-effort cost estimates."
series:
  name: "Rivumi Architecture Notes"
  order: 6
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-30-rivumi-model-routing-fallback-cost)

The [provider article](/posts/tech/2026-08-23-rivumi-model-provider-multigateway-en) explained how different protocols become a canonical `ModelTurn`. This article follows one request through candidate selection, retry, fallback, cache signaling, and cost recording.

## Roles select from a static catalog

`provider_catalog.py` defines model roles, route metadata, candidate ranking, and price tables. A role turns a need such as coding into a configured candidate list. It does not query live provider health, remaining quota, current prices, or measured answer quality.

`AgentRunner` receives a primary model and fallback models as an ordered sequence. An unknown model can still run, but Rivumi may be unable to estimate its cost. This is deterministic routing configuration, not an autonomous optimizer.

## Retryability controls recovery

Each candidate receives its own attempt budget. `_complete_model_with_retry()` retries only canonical `ProviderError` values marked retryable, applies bounded backoff, and honors provider retry-delay signals. Exhausting one candidate moves to the next fallback.

Authentication and invalid-request failures stop immediately because resending the same request later does not repair credentials or schema. Retry and fallback events preserve the provider, model, attempt, and reason, making recovery part of the audit trail.

## A cache hint is not a response cache

`cache_strategy.py` derives a key from the stable prompt prefix and tool schema, then maps it to provider-specific request fields. Anthropic receives stable-prefix cache control; OpenAI-compatible and Responses adapters receive a prompt cache key; Workers AI currently receives no hint.

Rivumi does not store and replay model answers. It records cache traces when provider metadata supports them and reports uncertainty when it does not. Dynamic workspace changes can leave the stable key unchanged, while changes to the stable prompt or tools invalidate it.

## Estimated cost is not billing authority

After usage arrives, `estimate_cost()` applies repository-owned static pricing. The `CostBreakdown` contract labels the result best-effort. Unknown prices return no estimate rather than a misleading zero. Mixed provider/model runs retain per-lane records but do not fabricate one aggregate estimate when pricing semantics differ.

The practical reading is narrow: roles are static recommendations, fallback handles classified retryable failures, cache traces expose provider signals, and cost records are estimates. The [next article](/posts/tech/2026-08-23-rivumi-external-coding-runner-en) moves to the separate external-runtime lane, not another model fallback.

---

## References

- [Rivumi provider catalog](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/provider_catalog.py)
- [Retry and fallback loop](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/loop.py)
- [Cache strategy](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/cache_strategy.py)
- [Cache and cost tests](https://github.com/vincentxuu/rivumi/tree/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/tests)
