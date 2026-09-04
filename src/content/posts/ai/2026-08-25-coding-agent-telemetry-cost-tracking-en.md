---
title: "Learning from Mature Coding Agents (34): Telemetry and Cost Tracking — You Count Tokens, Then What?"
date: 2026-08-30
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 34
tags: [coding-agent, telemetry, cost-tracking, opentelemetry, looplane]
lang: en
tldr: "looplane now has CostBreakdown, an explicitly estimated static GPT-5-family price table, per-lane usage/cost, and OTel cost fields. Unknown models still show tokens without invented dollars; broader pricing coverage, authoritative external-CLI bills, and live billing reconciliation remain open."
description: "Comparing telemetry and cost tracking across mature coding agents, including looplane's implemented estimated-cost, per-lane attribution, and OTel baseline."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-telemetry-cost-tracking)

Part 2 of the series, post #34. The previous one covered session recording and replay; this one covers a capability that looks trivial but suddenly becomes a big problem on long runs: telemetry and cost tracking.

Evidence scope as always: pi (badlogic/pi-mono), omp (can1357/oh-my-pi), opencode (sst/opencode), codex (openai/codex Rust workspace), and claude-code (community-decompiled v2.1.88; symbol names may differ from the original). Every `repo/path/file.ext#symbol` below was grepped in local clones.

## The capability gap: a usage field is not cost tracking

Every provider's API response carries usage, so every agent "has token counts". But token counts can't answer three real questions:

1. **What did this run cost?** Input/output/cache-read/cache-write prices differ by more than an order of magnitude; total tokens tell you nothing about cost structure.
2. **Where did the money go?** Was it the main model re-reading context over and over, or hidden calls from compaction and subagents? Without per-model, per-span attribution you can't say.
3. **Can you trust the number?** Custom models, subscription quotas, and cache pricing changes all distort local estimates. Users need to know whether the number on screen is exact or a guess.

looplane normalizes and accumulates input/output/cached_input/reasoning tokens, with query paths in the TUI, `/usage`, sessions, and OTel. It now also has a static price table and `CostBreakdown`. The gap is therefore no longer "no cost" but **estimate coverage and billing authority**: known models can be estimated, unknown ones stay unpriced, and provider-authoritative bills remain separate from local estimates.

## How the five projects do it

### pi: cost embedded in the type, spans defined by schema

pi's approach is the cleanest: `pi-mono/packages/ai/src/types.ts#Usage` doesn't just carry token counts — it embeds itemized costs (input/output/cacheRead/cacheWrite/total), computed on the spot by `pi-mono/packages/ai/src/models.ts#calculateCost` when a response arrives. It supports tiered pricing and even hard-codes Anthropic's detail that 1h cache writes bill at twice the base input rate. Cost is part of usage, not a report computed afterwards.

For telemetry, `pi-mono/packages/telemetry/src/index.ts#TelemetryContext` defines the span abstraction (startSpan/setAttributes/setStatus), and `defineTelemetrySchema` turns span names, attributes, and requiredness into type-level schemas. Building on that, `pi-mono/packages/agent/src/harness/telemetry.ts#AI_TELEMETRY_SCHEMA` declares the end attributes of the `pi.ai.request` span: beyond input/cache_read/cache_write/reasoning tokens there is a literal `pi.ai.usage.cost`. The default implementation is `NOOP_TELEMETRY_CONTEXT` — zero overhead unless you plug in a backend.

### omp: session JSONL as source, SQLite for dashboards

omp is a pi fork that inherits the embedded usage.cost and stacks a whole stats package on top: `oh-my-pi/packages/stats/src/parser.ts` reads each assistant message's rawUsage.cost from session JSONL, `oh-my-pi/packages/stats/src/aggregator.ts#syncAllSessions` incrementally syncs into SQLite, `db.ts` gives the messages table explicit cost_input / cost_output / cost_cache_read / cost_cache_write / cost_total columns, and `aggregator.ts#getCostDashboardStats` produces time series. It even handles backfilling old data that predates cost computation (COST_REINGEST_BACKFILL_KEY). This is the offline-aggregation school: the runtime only writes numbers into the log; analysis happens in batch later.

### opencode: normalize first, price with tiers and vendor quirks

`opencode/packages/opencode/src/session/session.ts#getUsage` is normalization code worth reading line by line: AI SDK v6 folds cached tokens into inputTokens, so they must be subtracted before pricing separately; reasoning is split out of output and billed at the output rate; cache writes are pulled from different metadata paths per provider. Pricing accumulates with Decimal precision, supports `model.cost.tiers` context-tiered pricing, and when a vendor like Copilot reports `totalNanoAiu` directly, it skips local math entirely. Results land in the SQLite session table's tokens_* and cost columns.

### codex: local estimate + authoritative backend bill

codex's Rust workspace has a dedicated `codex-rs/otel` crate. `codex-rs/otel/src/events/session_telemetry.rs#record_responses` records token counts onto OpenTelemetry span attributes using gen_ai semantic-convention names (`gen_ai.usage.input_tokens`, `gen_ai.usage.cache_read.input_tokens`); `SessionTelemetry.record_turn_cost` emits a separate `codex.turn_cost` event with `usage.estimated_usd`. Notably, it doesn't fool itself: the `/status` usage card in the TUI (`codex-rs/tui/src/status/thread_usage.rs#format_estimated_usd_micros`) labels values as estimated, while `codex-rs/app-server/src/turn_cost_worker.rs` polls the backend in the background for the authoritative ApiKeyTurnCost figures and updates the card. Local estimates buy immediacy; the real bill buys accuracy — presented separately.

### claude-code: price table, honest fallback, exit hook

`claude-code-source/src/utils/modelCost.ts#MODEL_COSTS` maintains a price table indexed by model short name ($3/$15 Sonnet tier, $15/$75 Opus tier, etc., including cache read/write and web search). When a model isn't found, instead of erroring or pretending, it applies `DEFAULT_UNKNOWN_MODEL_COST` and sets a `hasUnknownModelCost` flag — which is why `src/cost-tracker.ts#formatTotalCost` prints "costs may be inaccurate due to usage of unknown models". The accumulation entry point, `src/cost-tracker.ts#addToTotalSessionCost`, does per-model usage accumulation while also feeding cost and each token class into OpenTelemetry counters (`getCostCounter().add(cost, {model})`, `getTokenCounter()` with type=input/output/cacheRead/cacheCreation); advisor sub-call costs are recursively folded into the total. On shutdown, `src/costHook.ts#useCostSummary` prints the summary on process exit and persists state via `saveCurrentSessionCosts` into project config, letting resume restore accumulated totals through `restoreCostStateForSession`.

## Engineering rationale

The five projects converge exactly where OpenTelemetry's GenAI semantic conventions point: attribute names like `gen_ai.usage.*`, tokens split across input/output/cache, cost as a derived metric rather than a raw event. The [OpenTelemetry GenAI semantic conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/) mandate itemized usage attributes, and [OTLP](https://opentelemetry.io/docs/specs/otlp/) is the common export wire — codex talks to it directly via the otel crate, and claude-code's counter abstraction is isomorphic. Price-table maintenance relies on community catalogs like [models.dev](https://models.dev/) (the source of both pi's and opencode's model catalogs) or manual sync from official pricing pages.

## The baseline now implemented in looplane

`contracts.py` now defines `CostBreakdown`, and `provider_catalog.py` provides the pure `estimate_cost()` function. The static table contains only GPT-5-family rows checked against official pages; cached input is priced separately, and missing prices return `None`. `RunResult`, `/usage`, and OTel export can therefore separate `estimated` cost from token usage.

Role lanes such as auto-review also retain per-lane usage/cost attribution instead of mixing reviewer work into one total. These values are still not provider bills: pricing coverage is narrow, authoritative external-CLI cost is not normalized consistently, and live billing reconciliation has not been run. Showing tokens without dollars for unknown models remains the critical honesty boundary.

## References

- [looplane `provider_catalog.py` at `2ed5efb`](https://github.com/vincentxuu/looplane/blob/2ed5efb/src/looplane/provider_catalog.py)
- [looplane cost contract at `2ed5efb`](https://github.com/vincentxuu/looplane/blob/2ed5efb/src/looplane/contracts.py)

- [vincentxuu/looplane](https://github.com/vincentxuu/looplane) — public Looplane repo and README
- [OpenTelemetry GenAI semantic conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/) — the source of `gen_ai.usage.*` attribute naming
- [OpenTelemetry OTLP specification](https://opentelemetry.io/docs/specs/otlp/) — the common export protocol
- [badlogic/pi-mono packages/telemetry](https://github.com/badlogic/pi-mono/tree/main/packages/telemetry) — full typed span-schema implementation
- [openai/codex codex-rs/otel](https://github.com/openai/codex/tree/main/codex-rs/otel) — Rust-side OpenTelemetry export and turn-cost events
- [can1357/oh-my-pi packages/stats](https://github.com/can1357/oh-my-pi/tree/main/packages/stats) — session JSONL → SQLite cost dashboard
- [Anthropic pricing](https://docs.claude.com/en/docs/about-claude/pricing) — official basis for itemized cache read/write pricing
- [models.dev](https://models.dev/) — community data source behind pi / opencode model catalogs and prices
