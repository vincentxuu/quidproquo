---
title: "Framework Update: Mastra @mastra/core@1.75.0"
date: 2026-10-08
category: daily
type: digest
tags: [ai-agent, framework, daily, mastra]
lang: en
description: "Mastra 1.75 splits trace queries down to the individual span, lets memory hand embedding off to the vector store itself, and ships @mastra/connect 1.0 with three renamed APIs"
tldr: "Four things in Mastra @mastra/core@1.75.0: (1) a new storage.querySpans() lets you query individual spans directly (filters, cursors, cost) instead of locating a trace first; (2) aggregateTraces() gains token/cost measures, implemented across ClickHouse, DuckDB, and Postgres observability stores; (3) Semantic Recall now works with self-embedding vector stores (like MongoDBVector's autoEmbed), so you no longer need to configure a client-side embedder; (4) @mastra/connect reaches 1.0, but integrations is renamed providers, discovered MCP tools no longer require approval by default, and the Slack channel id changes from slack to slack-channels — all breaking."
series:
  name: "AI Framework Changelog"
  order: 35
---

> 🌏 [中文版](/posts/daily/2026-10-08-framework-mastra-1.75.0)

## Release Info

| Item | Value |
|---|---|
| Framework | Mastra |
| Version | `@mastra/core@1.75.0` |
| Previous | `@mastra/core@1.74.0` |
| Released | 2026-10-07 |
| Release Notes | [GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.75.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 28.6k |

## Why this release matters

Querying "every failed tool_call in the last hour" used to mean fetching traces first, then paging through spans inside each one — the trace was the smallest unit you could query. 1.75 adds `storage.querySpans()`, making the span itself a first-class query target: you can filter, cursor, and cost-filter directly without locating a trace first. Paired with the same release's token/cost measures on `aggregateTraces()` (`tokens.*`, `cost.sum`/`cost.avg`), the direction is clear — Mastra is pushing observability from "here's a list of traces" toward "here's a data layer you can run dashboard-style queries against," across ClickHouse, DuckDB, and Postgres stores alike. The other direction is a lower barrier at the memory layer: Semantic Recall used to require a client-side `embedder` to be configured; 1.75 lets a vector store declare `isSelfEmbedding` instead, so something like `MongoDBVector` with `autoEmbed` turned on can run semantic memory without touching embedder configuration at all. That matters most for fast prototyping — one less setting that has to be exactly right, and silently breaks things when it isn't. The thing to watch is that `@mastra/connect` reaches 1.0 in this same release: the price of stability is that `integrations` is renamed to `providers`, discovered MCP tools no longer require approval by default, and Slack's channel id changes from `slack` to `slack-channels` — none of which are backward compatible.

## What changed

- **`storage.querySpans()` for single-span queries**: adds `storage.querySpans()` / `client.querySpans()` / `POST /api/observability/spans/query`, supporting filters, cursors, bounded previews, and model cost, so you can directly query "every failed `tool_call` in the last hour" without locating a trace first → shared cursor/timeout/resource-limit error messages now say "query" too; error codes are unchanged (#25791)
- **`aggregateTraces()` gains token/cost measures**: adds `tokens.input`/`tokens.output`/`tokens.total`/`tokens.reasoning`/`tokens.cached` (each with `.sum`/`.avg`) plus `cost.sum`/`cost.avg`, usable in `having`/`orderBy`, implemented across ClickHouse, DuckDB, and Postgres observability stores → usage is summed per trace first, then per group; averages only count traces with recorded usage; a group mixing currencies returns `null` for `cost.sum`/`cost.avg` with `cost.unit` set to `"mixed"` (#25735)
- **Semantic Recall supports self-embedding vector stores**: `MastraVector` gains `isSelfEmbedding`, defaulting to `false` so every existing store is unaffected; a store that declares `true` (e.g. `MongoDBVector` with `autoEmbed: { model: 'voyage-4' }`) lets semantic recall run with no client-side `embedder` configured → a configured `embedder` still takes precedence; self-embedded messages live in a separate `memory_messages_selfembed` index so the two paths never cross-contaminate (#25009)
- **Sessions now keep one current model per thread**: `AgentController` sessions no longer track a separate model per mode, so switching modes no longer auto-changes the model; `session.model.switch` changes signature to `switch(modelId, options?)`, letting you set model and thinking level together → an existing thread's legacy per-mode selection is automatically migrated to `currentModelId` the first time it's reopened (#25997); separately, `createSession({ createInitialThread: false })` plus `session.thread.ensureId()` let a session start without creating a thread up front — the thread is only created once a message is actually sent, cutting down on empty threads left behind (#22561)

## Breaking Changes

- Discovered MCP tools under `@mastra/connect@1.0.0` no longer require approval by default:
  - Restore the old behavior by explicitly setting `requireApproval` (replacing the old `autoApproveTools`)
  - Impact: projects wiring external MCP tools through `@mastra/connect` that relied on the default approval flow as a safeguard
- `@mastra/connect` renames its API from `integrations` to `providers`:
  - Removes `connect()` (the `tools()` alias), the `environment()` sandbox credential surface, and several resolver helpers/exports
  - Impact: projects calling `@mastra/connect`'s lower-level API directly, not just the high-level agent integration
- Slack's channel integration id in `channels()` changes from `slack` to `slack-channels` (Slack *tools* stay on `slack`):
  - Impact: projects configuring Slack channel integrations through `channels()`; tool-level configuration is unaffected
- `AgentController` model switching drops `modeId`/`scope`:
  - `session.model.switch({ modelId, modeId })` → `session.model.switch(modelId, options?)`
  - Switching modes no longer automatically restores that mode's previous model
  - Impact: projects relying on "each mode remembers its own model" behavior
- `@mastra/react` hooks switch to a single object argument:
  - Positional arguments are replaced entirely by an object argument; every hook now accepts `queryOptions` (TanStack Query) and no longer defaults to skipping on an empty id
  - Impact: frontend projects using `@mastra/react` hooks directly

## Migration guide

### Upgrading from 1.74.x to 1.75.0

```bash
pnpm add @mastra/core@1.75.0
```

```ts
// Before (1.74.x and earlier): each mode remembers its own model
await session.model.switch({ modelId: 'openai/gpt-5.6', modeId: 'build' });
await session.mode.switch({ modeId: 'plan' }); // Auto-restores plan mode's previous model

// After (1.75.0): the session keeps a single current model
await session.model.switch('openai/gpt-5.6', { thinkingLevel: 'high' });
await session.mode.switch({ modeId: 'plan' }); // Stays on openai/gpt-5.6
```

```ts
// New capability: a vector store that embeds itself, no client-side embedder needed
const memory = new Memory({
  storage,
  vector: new MongoDBVector({ id: 'vec', uri, dbName, autoEmbed: { model: 'voyage-4' } }),
  options: { semanticRecall: true },
});
```

Projects that don't use `@mastra/connect`, and don't call `session.model.switch` or `@mastra/react` hooks directly, have no code-level breaking change on upgrade. Projects using `@mastra/connect` to wire up Slack or MCP tools need to check the approval defaults and channel id against the list above.

## How this compares to other frameworks

Splitting trace queries down to the span level and adding token/cost measures on top is a path LangGraph and CrewAI haven't taken yet — both still sit at "a list of traces plus an external observability platform," without treating cost/tokens as fields the framework itself can query. Mastra's last few releases (1.71's Observability Capabilities Negotiation, 1.74's pagination work, 1.75's span queries and cost measures) have been stacking in the same direction — treating observability as a data layer the framework itself owns, rather than handing it off to an external APM tool. Self-embedding vector stores are part of a broader memory-layer trend: the LlamaIndex/LangChain ecosystem is also moving toward "the vector store handles embedding natively" (MongoDB Atlas's own auto-embedding, for instance). Mastra standardizes this into its framework interface with a single `isSelfEmbedding` flag — plugging into capability the ecosystem already has, rather than reinventing it.

## Today's takeaway

I used to think of observability and memory as two cleanly separate subsystems in a framework — one handles traces and debugging, the other handles whether the agent remembers things. Looking at 1.75's changes, both layers actually share the same underlying concern: getting reliable historical data with the least possible configuration. Span queries and cost measures turn traces into data you can run analytical queries against, not just logs for debugging; self-embedding vector stores mean memory no longer needs the developer to keep an embedder config in sync. The common effect is pulling what used to require building your own data pipeline into the framework's default behavior — but the three breaking changes in `@mastra/connect` 1.0 are a reminder too: reaching stable doesn't mean the interface stops changing, just that it changes on a different cadence.

## References

- [Mastra @mastra/core@1.75.0 — GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.75.0)
- [mastra-ai/mastra — GitHub](https://github.com/mastra-ai/mastra)
- [Mastra @mastra/core@1.74.0 — previous framework update](/en/posts/daily/2026-10-06-framework-mastra-1.74.0-en)
- [PR #25791: storage.querySpans() single-span query API](https://github.com/mastra-ai/mastra/pull/25791)
- [PR #25735: aggregateTraces() token/cost measures](https://github.com/mastra-ai/mastra/pull/25735)
- [PR #25009: Semantic Recall self-embedding vector store support](https://github.com/mastra-ai/mastra/pull/25009)
- [PR #25997: AgentController session single-model persistence](https://github.com/mastra-ai/mastra/pull/25997)
- [@mastra/core — npm version history](https://www.npmjs.com/package/@mastra/core?activeTab=versions)
