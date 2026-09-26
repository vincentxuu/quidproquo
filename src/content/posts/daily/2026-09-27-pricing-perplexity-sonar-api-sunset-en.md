---
title: "Pricing Watch | Perplexity Retires Sonar API Today, Moves to Token-Plus-Tool-Call Billing on the Agent API"
date: 2026-09-27
category: daily
lang: en
type: digest
tags: [ai-agent, pricing, daily, perplexity]
description: "Perplexity's own docs confirm Sonar Chat Completions stops being supported on 2026-09-27, replaced by the Agent API. Billing shifts from a flat per-request fee tied to search depth to model token pricing plus per-tool-call fees — most tiers get 50-85% cheaper at equivalent usage, but Sonar Pro and Reasoning Pro have no direct model replacement to switch to."
tldr: "Perplexity's pricing docs and migration guide confirm that Sonar Chat Completions (sonar, sonar-pro, sonar-reasoning-pro, sonar-deep-research) stops being supported on 2026-09-27, fully replaced by the Agent API. The old model billed model token price plus a flat request fee tiered by search depth ($5-$12 per 1,000 requests); the new model bills whatever third-party model token price you pick (e.g. gpt-5.6-luna at $0.20/1M input) plus per-tool-call fees (web_search at $0.0025, fetch_url at $0.0005). Using Perplexity's own representative usage figures, Sonar-to-fast comes out about 49% cheaper, Sonar Pro-to-low about 84% cheaper, and Sonar Reasoning Pro-to-medium about 71% cheaper. But sonar-pro and sonar-reasoning-pro stop being routable outright on most third-party gateways — only the base sonar model gets auto-migrated to the Agent API, and every other tier requires a manual switch to the new preset system."
series:
  name: "AI Pricing Watch"
  order: 11
---

> 🌏 [中文版](/posts/daily/2026-09-27-pricing-perplexity-sonar-api-sunset)

## Summary of Changes

Perplexity has run a migration banner in its API docs since August 13, and today (2026-09-27) is the hard cutoff date it wrote into that notice: Sonar Chat Completions — `sonar`, `sonar-pro`, `sonar-reasoning-pro`, and `sonar-deep-research` — all hand off to the Agent API, and this isn't a simple endpoint swap. The billing structure itself changed shape. The old model charged model token price plus a flat request fee tiered by search depth (low/medium/high). The new model charges whichever third-party model's token price you pick, plus a separate fee for every tool call (web_search, fetch_url, sandbox, and so on). The base `sonar` model gets auto-migrated into the Agent API's model list with a compatible calling pattern, but Pro, Reasoning Pro, and Deep Research have no matching model in the Agent API — Perplexity's own guidance is a "which preset performs similarly" mapping table, and migrating means rewriting to the new request/response format.

## Before & After

Based on Perplexity's official Sonar-tier-to-Agent-API-preset mapping, converted into actual per-unit rates at the representative usage each preset is benchmarked on:

| Item | Old (Sonar API) | New (Agent API) | Change | Effective |
|---|---|---|---|---|
| Sonar → `fast` preset — Model | sonar (Perplexity's own) | openai/gpt-5.6-luna | Model swap | 2026-09-27 |
| Sonar → `fast` — Input | $1.00/1M tokens | $0.20/1M tokens | ↓80% | 2026-09-27 |
| Sonar → `fast` — Output | $1.00/1M tokens | $1.20/1M tokens | ↑20% | 2026-09-27 |
| Sonar Pro → `low` preset — Input | $3.00/1M tokens | $0.20/1M tokens | ↓93% | 2026-09-27 |
| Sonar Pro → `low` — Output | $15.00/1M tokens | $1.20/1M tokens | ↓92% | 2026-09-27 |
| Sonar Reasoning Pro → `medium` preset — Input | $2.00/1M tokens | $0.20/1M tokens | ↓90% | 2026-09-27 |
| Sonar Reasoning Pro → `medium` — Output | $8.00/1M tokens | $1.20/1M tokens | ↓85% | 2026-09-27 |
| Flat request fee by search depth | $5 (low) / $8 (medium) / $12 (high) per 1,000 requests | Removed, replaced by per-tool-call billing | Structural change | 2026-09-27 |
| Web Search tool call | Bundled into the flat request fee | $2.50 per 1,000 calls (`web_search`) | Unbundled into its own line item | 2026-09-27 |
| URL Fetch tool call | Not applicable (Sonar has no such tool) | $0.50 per 1,000 calls (`fetch_url`) | New line item | 2026-09-27 |

The `fast` preset's output rate looks like it went up 20%, but that's because it landed on OpenAI's lightest model, gpt-5.6-luna, which has a different token-price structure than Sonar to begin with. Since the tool-call fees run well below the old flat request fee, total per-query cost still comes out lower overall (see below).

## Cost Estimate

**Scenario**: A web-research agent handling 10,000 queries a day. It used to run Sonar Pro (averaging 2,000 input + 1,000 output tokens per query, search depth set to medium, mapping to an $8-per-1,000-request fee), and migrates to the `low` preset Perplexity's own mapping table recommends — same token volume, one `web_search` call plus one `fetch_url` call.

| | Old (Sonar Pro, medium depth) | New (Agent API `low` preset) | Difference |
|---|---|---|---|
| Token cost per query | $0.021 | $0.0016 | -$0.0194 |
| Tool/request fee per query | $0.008 (flat request fee) | $0.0030 (web_search + fetch_url) | -$0.0050 |
| Total cost per query | $0.029 | $0.0046 | -$0.0244 (↓84%) |
| **Monthly cost (10,000 queries/day × 30 days)** | **$8,700** | **$1,380** | **-$7,320 (↓84%)** |

Running the same math on Sonar-to-`fast` (about 49% cheaper) and Sonar Reasoning Pro-to-`medium` (about 71% cheaper) shows sizeable but very uneven savings across tiers. The `low` tier drops the most because Sonar Pro's token price ($3/$15) was already priced a full order of magnitude above the lightweight model the Agent API defaults to ($0.20/$1.20), and the tool-call fees ($0.0025 + $0.0005) undercut the old flat request fee by a wide margin. Sonar Deep Research's mapping to the `high`/`xhigh` presets involves sandbox sessions and multi-round search counts that Perplexity hasn't published enough representative usage data on, so this piece skips forcing a number there — but the migration guide's own claim is that it's "often at a lower per-request cost than Sonar Deep Research."

## Impact on Developers & Enterprises

### Who Wins, Who Takes the Hit

Teams running mid-to-high-volume search-grounded RAG on Sonar Pro or Reasoning Pro stand to gain the most — those tiers were priced at a premium to begin with, and being able to pick a lightweight model like gpt-5.6-luna instead typically cuts equivalent-task cost by 70% or more. The teams taking the hit are the ones who haven't migrated yet and are routing through a third-party gateway that calls `sonar-pro` or `sonar-reasoning-pro` directly — gateways like LLM Gateway have already announced that both tiers stop being routable today, with only the base `sonar` model auto-migrating to the Agent API. There's no "do nothing and it keeps working" option for the rest.

### The Real Signal: From Depth Tiers to Model-Plus-Tool-Calls

Sonar API's design had you pick a depth tier, and Perplexity bundled the model and search depth together behind one flat price. The Agent API does the opposite — it separates "which model" from "how many search tool calls," billing each independently by actual usage. For developers, that means more control (swap to a cheaper or stronger model, tune exactly how many tool calls a task needs) but it also retires the old mental model of "one query costs X." The new mental model is "this model's token price is X, and this task probably needs Y tool calls" — which brings Perplexity's billing logic in line with how most general-purpose agent platforms already charge for models and tools separately.

### Action Items

- If your calls still use the `sonar` model: most of these auto-migrate to the Agent API with a compatible format, but test the response shape against the official migration guide anyway — `choices` becomes an `output` array, and parsing logic that assumes the old shape will break.
- If you use `sonar-pro`, `sonar-reasoning-pro`, or `sonar-deep-research`: there's no model to swap to as of today. You need to follow the official mapping table to the `low`/`medium`/`high`/`xhigh` preset and rewrite to the Agent API's request/response format — this isn't a migration you can finish by changing a model parameter.
- If you call Sonar through a third-party gateway (OpenRouter, LLM Gateway, etc.): confirm your gateway has already routed the model IDs you use to the Agent API. If it hasn't, your calls fail starting today.

## Expiration Notice

⚠️ **Retirement date**: 2026-09-27 (today). Sonar Chat Completions' `messages`/`choices` format stops being supported entirely, in favor of the Agent API's `input`/`output` format. Migration guide: [Migrate from Sonar to the Agent API](https://docs.perplexity.ai/docs/agent-api/migrate-from-sonar/overview).

## Takeaway

Most API sunsets logged here have been one-for-one swaps — kill the old model, call a new model ID instead. This migration changes the billing skeleton itself: from a flat price tiered by search depth to a combination of model token price and tool-call count. That's why the migration guide can't just hand over a simple conversion table — under the new pricing, the real bill depends not just on which tier you picked, but on how you actually configure the agent's search behavior.

## References

- [Pricing | Perplexity API Docs (original Sonar retirement notice and pricing tables)](https://docs.perplexity.ai/docs/getting-started/pricing)
- [Migrate from Sonar to the Agent API | Perplexity API Docs (tier mapping table)](https://docs.perplexity.ai/docs/agent-api/migrate-from-sonar/overview)
- [Perplexity Sonar Changes September 25 | LLM Gateway Changelog](https://llmgateway.io/changelog/perplexity-sonar-changes)
- [Perplexity Sonar API Retiring | DNotifier](https://www.dnotifier.com/blog/perplexity-sonar-api-is-retiring/)
