---
title: "Framework Update: Mastra @mastra/core@1.71.0"
date: 2026-09-26
category: daily
type: digest
tags: [ai-agent, framework, daily, mastra]
lang: en
description: "Mastra 1.71 starts streaming tool calls earlier and lets the observability layer negotiate capabilities across storage backends — two unrelated problems solved on the same day"
tldr: "Four things in Mastra @mastra/core@1.71.0: (1) Eager Tool Execution is on by default, starting a tool call as soon as its own arguments are ready instead of waiting for the whole step; (2) Observability Capabilities Negotiation lets Studio and custom clients probe which tracing APIs a storage backend supports before calling them, fixing hard 500s on legacy stores; (3) a new `@mastra/discord` channel, sandbox credential materialization, and server-side MongoDB Vector embeddings; (4) breaking: `@mastra/playground-ui`'s `TaskList` drops `title`, `TaskListHeader`, and `hideWhenEmpty`."
series:
  name: "AI Framework Changelog"
  order: 27
---

> 🌏 [中文版](/posts/daily/2026-09-26-framework-mastra-1.71.0)

## Release Info

| Item | Value |
|---|---|
| Framework | Mastra |
| Version | `@mastra/core@1.71.0` |
| Previous | `@mastra/core@1.70.0` |
| Released | 2026-09-25 |
| Release Notes | [GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra/core%401.71.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 28.3k |

## Why this release matters

[The previous release (1.69.0)](/posts/daily/2026-09-25-framework-mastra-1.69.0) added the "decision" primitive; 1.71.0 landed the same day and pushes on two fronts that rarely show up in the same release note. The first is perceived latency: a step with several tool calls used to wait for the model to finish its entire reply before running any tool. 1.71 starts each tool call the moment its own arguments finish streaming, without waiting on other tools or the trailing text. The second is protocol-level robustness: Mastra's observability storage already comes in several flavors — LibSQL, Postgres, ClickHouse, DuckDB, Spanner. Studio and custom clients used to find out what a store supported by trial and error, and hitting an unsupported feature meant a bare 500. 1.71 turns that into a proper negotiation protocol: ask the store what it supports first, then decide which endpoint to call. One change is a performance win users will feel; the other is infrastructure maturity only developers will notice — shipped together.

## What changed

- **Eager Tool Execution (on by default)**: a tool call now starts as soon as its own arguments finish streaming, instead of waiting for the model to finish the whole step → a step with several tool calls (e.g. "compare the weather in Paris and Rome") loses noticeably less idle time; set `eagerToolExecution: false` to opt back into the old scheduling, and it's now supported in stored agent default options too
- **Observability Capabilities Negotiation**: `GET /system/packages` and the new `GET /observability/capabilities` return `observabilityStorageCapabilities` (per-endpoint flags like `traceQuery`, `threadQuery`, `deltaPolling`), and a storage backend can declare its own discovery support (entity/service/environment/tag/metric) via `getFeatures()` → a project on LibSQL or the default `PostgresStore` now sees Studio fall back to the legacy trace-light endpoint automatically instead of hitting a 500 on an unsupported discovery route — fixing a recurring "does not support entity name discovery" error
- **Trace Aggregation Planning API (`planTraceAggregate()`)**: validates and converts an `aggregateTraces()` request into a `TrustedTraceAggregatePlan` that any storage backend can execute without re-validating it → rules like the 365-day time-range cap and the 1,000-bucket interval limit for custom storage backends now only need to be written once
- **Discord channel + sandbox credential materialization**: the new `@mastra/discord` connects agents to Discord (slash commands, DMs, mentions, with the bot token encrypted at rest); `@mastra/connect` adds `environment()`, which turns Platform connection credentials into the `{ env, onStart }` shape any sandbox provider (e2b, Modal, Daytona, Docker, subprocess) can consume → CLI tools like `gh` or `git` running inside a sandboxed agent authenticate without hand-wiring tokens
- **Server-side MongoDB Vector embeddings (Automated Embeddings)**: create an index with `autoEmbed` (e.g. Voyage's `voyage-4`), then write plain text and search with `queryText` — MongoDB generates the embeddings server-side → the application needs no embedding provider wiring or dimension bookkeeping; this is currently a MongoDB Atlas Preview feature
- **ReDoS hardening for dataset schema validation**: `pattern` and `patternProperties` regexes in dataset input/ground-truth schemas now run on a linear-time (RE2) engine, so a crafted pattern can no longer freeze the server; patterns using lookaround (`(?=...)`) or backreferences (`\1`) are now rejected outright when a dataset is created or updated (`DATASET_SCHEMA_PATTERN_UNSUPPORTED`) → projects that validate dataset schemas with regex should check for these two constructs, since they'll need rewriting after the upgrade

## Breaking Changes

- `@mastra/playground-ui`'s `TaskList` API: `title`, `TaskListHeader`, and `hideWhenEmpty` are all removed, because the redesigned `TaskList` now draws the active task on its own small lane instead of using a separate list header
  - Affected: projects that customize the Mastra Studio task list UI directly with `TaskList` or `TaskListHeader`

## Migration Guide

### Upgrading from 1.70.x to 1.71.0

```bash
pnpm add @mastra/core@1.71.0
```

```tsx
// Before (1.70.x and earlier)
<TaskList tasks={tasks} title="In progress" hideWhenEmpty={false} />
<TaskListHeader />

// After (1.71.0)
<TaskList tasks={tasks} />
```

Projects that don't customize Mastra Studio's `TaskList` component have no breaking changes in this release — upgrade directly.

## How this compares to other frameworks

Most frameworks (LangGraph, CrewAI) treat "parallel tool calls" as an existing capability: once the model returns several `tool_call`s in one reply, the framework runs them all. Mastra's Eager Tool Execution solves a finer-grained problem instead — it doesn't add parallelism, it stops waiting for the model to finish the whole step once a single tool's arguments are ready. The rest of this release's effort went into hardening the observability protocol itself (capabilities negotiation), something most mainstream frameworks still handle ad hoc — swap the storage backend and the frontend calls typically need manual updates to match. Mastra turns that into a formal protocol both sides can probe before deciding which API to call.

## Today's takeaway

I used to think agent framework performance work was all about token usage or cache hit rates. Seeing Eager Tool Execution made it click: the micro-scheduling gap between "wait for the model to finish talking" and "wait for one tool's arguments to be ready" is itself a source of the lag users actually feel — performance isn't only the global latency number, it's also this granularity question sitting between the shape of a model's output and the timing of a tool call, one that rarely gets discussed on its own.

## References

- [Mastra @mastra/core@1.71.0 — GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra/core%401.71.0)
- [mastra-ai/mastra — GitHub](https://github.com/mastra-ai/mastra)
- [Mastra @mastra/core@1.69.0 — previous framework update](/posts/daily/2026-09-25-framework-mastra-1.69.0)
- [PR #25008: Observability Capabilities Negotiation and discovery feature declarations](https://github.com/mastra-ai/mastra/pull/25008)
- [PR #24868: Trace Aggregation Planning API (`planTraceAggregate()`)](https://github.com/mastra-ai/mastra/pull/24868)
- [PR #25005: Eager Tool Execution](https://github.com/mastra-ai/mastra/pull/25005)
- [PR #25002: `@mastra/discord` channel integration](https://github.com/mastra-ai/mastra/pull/25002)
- [PR #24912: `@mastra/connect environment()` sandbox credential materialization](https://github.com/mastra-ai/mastra/pull/24912)
- [PR #24383: MongoDB Vector Automated Embeddings](https://github.com/mastra-ai/mastra/pull/24383)
- [PR #25044: ReDoS hardening for dataset schema validation](https://github.com/mastra-ai/mastra/pull/25044)
- [PR #24947: `TaskList` redesign (source of the breaking change)](https://github.com/mastra-ai/mastra/pull/24947)
