---
title: "Framework Update | Mastra @mastra/core@1.65.0"
date: 2026-09-10
category: daily
type: digest
tags: [ai-agent, framework, daily, mastra]
lang: en
description: "Mastra 1.65 ships a cross-storage advanced trace query contract and tenant-scoped batch deletion, plus a typed rewrite of Factory custom boards that brings four breaking changes"
tldr: "Mastra @mastra/core@1.65.0 highlights: (1) a new advanced trace query contract implemented across ClickHouse, DuckDB, and Postgres, with bounded time ranges, recursive predicates, and cursor pagination; (2) tenant-scoped batch deletion (up to 1,000 traces per request) that cascades to spans/scores/feedback/metrics/logs; (3) breaking: `@mastra/factory`'s `defineBoard()` becomes a typed phase contract, the global rules object is removed, and two `@mastra/playground-ui` components got renamed slots/props."
series:
  name: "AI Framework Changelog"
  order: 17
---

> 🌏 [中文版](/posts/daily/2026-09-10-framework-mastra-1.65.0)

## Version Info

| Item | Value |
|---|---|
| Framework | Mastra |
| Version | `@mastra/core@1.65.0` |
| Previous | `@mastra/core@1.64.0` |
| Released | 2026-09-09 |
| Release Notes | [GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.65.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 28k |

## Why This Version Matters

[The previous release (1.64.0)](/posts/daily/2026-09-05-framework-mastra-1.64.0) tackled sandbox cold-start latency; 1.65 addresses what happens once observability data grows large: **traces need to be queryable consistently across storage backends**, and **traces need to be deletable safely**. Query semantics used to drift subtly depending on whether you ran ClickHouse or Postgres underneath — 1.65 collapses that into a strict contract (bounded time ranges, recursive predicates, thread grouping, deterministic cursor pagination), rejecting invalid or overly complex requests before they ever reach a storage adapter. The same release adds tenant-scoped batch deletion that cascades to spans, scores, feedback, metrics, and logs — a necessary piece for production deployments that need data retention or compliance cleanup. The other major thread is Factory: custom boards move from "built-in only" to "typed and installable," which is also where four breaking changes come from.

## Key Changes

- **Advanced Trace Querying (Core Contract + Server Endpoint + three storage backends)**: A strict, portable trace query contract (bounded time ranges, recursive trace/span/score predicates, thread grouping, deterministic cursor pagination) plus an authenticated server endpoint, with real implementations in ClickHouse, DuckDB, and Postgres → you don't need to rewrite query logic when switching observability storage backends, and invalid or overly complex requests get rejected before hitting a storage adapter
- **Tenant-Scoped Trace Deletion + Cascade Cleanup**: Delete up to 1,000 traces per request with tenant scoping; deletion cascades to spans, scores, feedback, metrics, and logs. The new `mastra.datasets.deleteExperiment()` also cleans up traces for orphaned experiments with no dataset ownership → large-scale agent deployments doing data retention or compliance cleanup no longer leave behind traces that are invisible but still occupy storage
- **Workflow Graph Metadata for Control-Flow Blocks**: `.parallel()`, `.branch()`, `.dowhile()`, `.dountil()`, `.foreach()`, `.sleep()`, `.sleepUntil()`, and `.map()` now support optional `id`, `description`, and `metadata`, surviving serialization and rehydration → visual editors and review tools can address a parallel block or a sleep node with a stable id instead of a generated one or a position in the graph
- **Agent Channel Actions API**: `handlers.onAction` lets applications intercept interactive UI card actions (e.g., a "retry" button) while still delegating to the built-in `defaultHandler` for tool approval, or disabling it entirely with `onAction: false` → custom interactive UIs don't need to reimplement the whole approval flow
- **Factory Custom Boards Become First-Class**: `defineBoard()` is now a typed contract where boards own their phase semantics (`resting`/`working`/`terminal`); installable custom boards fully render in the UI and can be targeted end-to-end by decisions and tools, with board-owned transition policy and tool-result rules → third-party developers can build custom Factory boards that stand on equal footing with the built-in ones
- **Observability naming cleanup**: Built-in add-ons — skills, workspace instructions, observational memory, and agent state signals — now show up in traces under their real subsystem names (e.g. `skill:inject`, `memory: recall`) instead of an anonymous "processor run"; two new span types, `SKILL_ACTION` and `AGENT_SIGNAL`, were added, and custom processors can declare their own tracing behavior

## Breaking Changes

- `@mastra/factory`: `defineBoard()` phases must now add `kind`, working phases must add `role`, and `initialPhase` must be `resting`
  - Impact: any project defining custom boards via `@mastra/factory`
- `@mastra/factory`: the global rules object is removed (`FactoryRules`, its defaults/merge/assert helpers, `new MastraFactory({ rules })`); tool-result rules move onto `defineBoard({ tools })`, and `configVersion` replaces `rules.version`
  - Impact: any project that configured global rules via `MastraFactory({ rules })`
- `@mastra/factory`: the `GET /web/factory/projects/:id/attention` response shape changed — `tier` is removed, and count/latest fields moved under `kinds[kind]...`
  - Impact: custom frontends or integrations calling this attention API directly
- `@mastra/playground-ui`: `TraceDataPanelView` replaces `partialThreadTabSlot` with `messagesPanelSlot`; `TracesLayout` replaces `sidePanelWide` with `sidePanelWidth: 'half' | 'wide' | 'full'`
  - Impact: projects embedding these two playground-ui components with custom slots/props

## Migration Guide

### Upgrading from 1.64.x to 1.65.0

```bash
pnpm add @mastra/core@1.65.0
```

```ts
// @mastra/factory defineBoard()
// Before (1.64.x and earlier)
defineBoard({
  phases: { resting: {}, working: {} },
  initialPhase: 'resting',
});

// After (1.65.0)
defineBoard({
  phases: {
    resting: { kind: 'resting' },
    working: { kind: 'working', role: 'executor' },
  },
  initialPhase: 'resting',
  tools: { /* tool-result rules that used to live on the global rules object */ },
});
```

```tsx
// @mastra/playground-ui slot / prop renames
// Before (1.64.x and earlier)
<TraceDataPanelView partialThreadTabSlot={<CustomTab />} />
<TracesLayout sidePanelWide />

// After (1.65.0)
<TraceDataPanelView messagesPanelSlot={<CustomTab />} />
<TracesLayout sidePanelWidth="wide" />
```

Projects that only call the general `@mastra/core` API without defining custom `@mastra/factory` boards or embedding the two affected playground-ui components have no breaking changes and can upgrade directly.

## Cross-Framework Observations

Mastra keeps grinding down production-infrastructure friction release by release — 1.63 aligned traces with native logs, 1.64 fixed sandbox cold starts, and 1.65 makes trace data queryable, deletable, and tenant-bounded. That's the classic path from "observability that records" to "observability that can be governed." It's a different focus from LangGraph and CrewAI, which are currently investing more in agent primitives and role-based orchestration; Factory boards moving toward installable and typed also pushes Mastra further toward being a platform rather than just a library.

## Takeaway

I used to think "trace querying" just meant pulling recorded data back out for display. Seeing Mastra encode bounded time ranges, recursive predicates, and cursor pagination into a single contract that ClickHouse, DuckDB, and Postgres — three very different storage backends — all have to honor made it clear: once observability data grows large enough to need multiple storage backends, keeping query semantics consistent across them is itself a deliberate engineering problem, not something a few extra SQL `WHERE` clauses solve.

## References

- [Mastra @mastra/core@1.65.0 — GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.65.0)
- [mastra-ai/mastra — GitHub](https://github.com/mastra-ai/mastra)
- [Mastra @mastra/core@1.64.0 — Previous framework update](/posts/daily/2026-09-05-framework-mastra-1.64.0)
- [PR #22726: Advanced trace query contract](https://github.com/mastra-ai/mastra/pull/22726)
- [PR #22553: Tenant-scoped trace deletion](https://github.com/mastra-ai/mastra/pull/22553)
- [PR #22550: `deleteExperiment` cascade cleanup](https://github.com/mastra-ai/mastra/pull/22550)
- [PR #22633: Workflow control-flow id/description/metadata](https://github.com/mastra-ai/mastra/pull/22633)
- [PR #22927: Agent Channel `handlers.onAction`](https://github.com/mastra-ai/mastra/pull/22927)
- [PR #22542: Observability span naming cleanup](https://github.com/mastra-ai/mastra/pull/22542)
