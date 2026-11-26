---
title: "Framework Update: Mastra @mastra/core v1.86.0"
date: 2026-11-26
category: daily
type: digest
tags: [ai-agent, framework, daily, mastra]
lang: en
description: "Mastra @mastra/core v1.86.0 makes dataset experiments crash-recoverable too, adds an experimental Knowledge importer, and requires that Knowledge tool calls carry an identity set by the host, not the request"
tldr: "Three things stand out in Mastra @mastra/core v1.86.0: (1) startExperimentAsync() can now run as a durable evented workflow, so a worker crash or redeploy no longer leaves an experiment stuck running; (2) an experimental Knowledge importer contract lets external sources sync into Knowledge safely with batching, leases and replay protection; (3) principals/author mean a host calling Knowledge tools outside an agent run must supply the identity itself — it can never come from the request — built for MCP and external-agent scenarios. The four breaking changes are all narrow in scope (a prerelease package, an MCP field rename, playground UI)."
series:
  name: "AI Framework Changelog"
  order: 74
---

> :globe: [中文版](/posts/daily/2026-11-26-framework-mastra-core-v1.86.0)

## Release Info

| Item | Value |
|---|---|
| Framework | Mastra (`@mastra/core`) |
| Version | @mastra/core@1.86.0 |
| Previous version | [@mastra/core@1.85.0](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.85.0) |
| Release date | 2026-11-25 |
| Release Notes | [Release November 25, 2026](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.86.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 29.8k |

## Why this release matters

This release extends crash recovery to a scenario outside agent conversations: dataset experiments. Until now, `startExperimentAsync()` was a plain async call — if the process got redeployed or crashed mid-run, the whole experiment got stuck at `running` with nobody to pick it up. v1.86.0 adds `durable: true`, which runs the experiment as a per-item evented workflow instead; paired with a pubsub that redelivers events, such as Redis Streams, another worker can pick up an item that got cut off and keep going, while each item still records exactly one result. That shows Mastra is treating "crash-safe" as cross-cutting infrastructure, not a special feature reserved for chat-style agents. Another addition worth a closer look is Knowledge: an experimental importer contract lets external sources sync into Knowledge safely using batching, leases and replay protection, instead of every integration hand-rolling its own sync logic against Knowledge's internal storage. The last one is worth pausing on: `principals`/`author` let a host call Knowledge tools outside an agent run — say, an MCP server acting on behalf of an external agent — but the identity can only come from the host's own code, never from the request, and every write records who made it. It's a clear "who gets to claim this identity" design: the caller doesn't get to say who it is; the party in control (the host) decides.

```diagram
title: Mastra v1.86.0: where a Knowledge tool call's identity comes from
desc: When a host calls Knowledge tools on behalf of something outside an agent run, principals can only be set by the host's own code — never taken from an external request.
caption: Simplified; shows only how principals get decided. A normal in-agent-run call is unaffected.
---
<svg viewBox="0 0 680 220">
  <path class="dg-line" d="M160 94V140" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M520 94V140" marker-end="url(#arrow)"/>

  <text class="dg-sub" x="160" y="24" text-anchor="middle" dominant-baseline="central">Not allowed</text>
  <rect class="dg-box dg-box--ghost" x="20" y="38" width="280" height="56" rx="6"/>
  <text class="dg-label" x="160" y="58" text-anchor="middle" dominant-baseline="central">External request carries principals</text>
  <text class="dg-sub" x="160" y="78" text-anchor="middle" dominant-baseline="central">MCP / external agent claims its own identity</text>

  <rect class="dg-box dg-box--ghost" x="20" y="140" width="280" height="56" rx="6"/>
  <text class="dg-label" x="160" y="160" text-anchor="middle" dominant-baseline="central">Applied straight to Knowledge tools</text>
  <text class="dg-sub" x="160" y="180" text-anchor="middle" dominant-baseline="central">whatever identity the request claims</text>

  <text class="dg-sub" x="520" y="24" text-anchor="middle" dominant-baseline="central">After v1.86.0</text>
  <rect class="dg-box" x="380" y="38" width="280" height="56" rx="6"/>
  <text class="dg-label" x="520" y="58" text-anchor="middle" dominant-baseline="central">Host code fixes principals</text>
  <text class="dg-sub" x="520" y="78" text-anchor="middle" dominant-baseline="central">must match a declared scope type</text>

  <rect class="dg-box" x="380" y="140" width="280" height="56" rx="6"/>
  <text class="dg-label" x="520" y="160" text-anchor="middle" dominant-baseline="central">createTools({ principals })</text>
  <text class="dg-sub" x="520" y="180" text-anchor="middle" dominant-baseline="central">writes recorded under author</text>
</svg>
```

## Key changes

- **Durable, crash-safe dataset experiments**: `startExperimentAsync()` and the server/client trigger APIs gain `durable: true`, running the experiment as a per-item evented workflow; after a worker crash or redeploy, another worker (paired with a redelivering pubsub like Redis Streams) can pick up an unacked item and continue → a long-running batch experiment no longer gets stuck entirely just because of one redeploy
- **Knowledge importer contract and runner infrastructure (experimental)**: a new `KnowledgeImporter` contract and `knowledge.importers.run()`, backed by importer bookkeeping persisted in in-memory, LibSQL and Postgres stores (batching, leases, replay protection, settle/repair) → syncing external sources into Knowledge no longer requires hand-rolling your own duplicate- and interruption-safe sync logic
- **Native durable Agent execution engine selection**: `durable.executionEngine` (set at the agent level or via `Mastra.durable` defaults) now takes `default` or `evented`, leaving existing streaming/output APIs untouched; note the earlier prerelease value `executionEngine: 'durable'` has been renamed to `'default'` → choosing an execution engine no longer means switching to a whole different API, just flipping one setting
- **Channels-first chat integrations**: Core adds `createChannelTools()` for reading from and posting to the run's active chat thread across multiple channel adapters; `@mastra/slack` adds `createSlackTools()` (search, attachment download, user/channel lookup) under the same access scoping → wiring an agent into existing chat channels no longer means writing separate permission logic for each integration
- **Knowledge activity query + host-run calls (`principals`/`author`)**: a new `knowledge_activity` tool lists what changed in Knowledge pages and notes over a date range, including who made each change, and can be narrowed with `from` to a single page or scope; `knowledge.createTools({ principals })` lets a host call Knowledge tools outside an agent run, with the identity fixed by the host — never taken from the request — and writes recorded under `author` → when an MCP server acts on Knowledge on behalf of an external agent, the identity boundary is enforced by the host, not left to the caller to declare
- **`interrupted` thread run status**: a durable agent run stopped mid-flight by `mastra.shutdown()` is no longer seen by subscribers as `failed`; the result once recovery finishes picks up on the same subscription → interruptions from a rolling restart don't get mistaken for a genuine failure

## Breaking Changes

Four, all narrow in scope:

- `get_process_output` no longer supports `wait: true`; use `waitSeconds` (1–300) instead — the old flag is now ignored
  - Affected: code that calls `get_process_output` directly and relies on `wait: true`
- `@mastra/connect` (prerelease-only): the old events exports (`EventsClient`, `connectEvents()`, etc.) are replaced by the new `ConnectEvents` iterator API
  - Affected: projects that used only the prerelease version of `@mastra/connect`
- `@mastra/mcp-apps-components`: an MCP boundary field was renamed, `projectId` → `project`
  - Affected: MCP apps integrations that read or write this field directly
- `@mastra/playground-ui`'s trace components have major API changes (a slot-based `ThreadTrace`, a `TracesExplorer` that takes data directly instead of fetching it itself, navigation callbacks replacing href/Link props)
  - Affected: projects that customized the playground trace UI directly

## Migration Guide

### Upgrading from 1.85.x to 1.86.0

```bash
npm install @mastra/core@1.86.0
```

```ts
// Old: get_process_output waits for completion with wait
await getProcessOutput(processId, { wait: true });

// New: use waitSeconds to cap how long to wait
await getProcessOutput(processId, { waitSeconds: 60 });
```

```ts
// Old (prerelease): executionEngine written directly as 'durable'
const agent = new Agent({
  name: 'support-agent',
  durable: { executionEngine: 'durable' },
});

// New: the prerelease 'durable' value has been renamed to 'default'
const agent = new Agent({
  name: 'support-agent',
  durable: { executionEngine: 'default' }, // or 'evented'
});
```

Everything else — `knowledge_activity`, `createChannelTools()`, the Knowledge importer — is purely additive and doesn't affect existing code unless you opt in; only projects that used the prerelease `@mastra/connect` events API or customized the playground trace UI need to make a change.

## Compared to other frameworks

[Pydantic AI v2.75.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.75.0) shipped the same day (11/25) tightening a similar kind of boundary, just at a different layer: Pydantic AI governs "does this text count as an instruction" (workspace files and MCP server instructions no longer automatically mix into the system prompt), while Mastra here governs "whose identity does this call run as" (a Knowledge tool's `principals` must come from the host, never the request). Both frameworks, without coordinating, reinforced "who gets to claim what authority" on the same day as MCP and external integrations keep growing — just one at the prompt layer, the other at the tool-call layer. On the durable-execution front, Mastra extended crash recovery from agent conversations to dataset experiments here, while Agno v3.2.0 last month tackled cross-replica recovery for the sandbox execution environment itself. Taken together, "execution state surviving crashes, restarts, and instance changes" is now infrastructure several mainstream frameworks are filling in at the same time, not a differentiator unique to any one of them.

## Today's takeaway

I used to think "durable" was a guarantee that only mattered for agent conversations or other long-running tasks — a chat-style run already takes a while, so it's worth the effort to make it crash-recoverable. Seeing this release apply the same evented-workflow machinery to dataset experiments made something click: any work that runs for a while and might get interrupted by a redeploy has the same recovery need, whether or not it's an agent conversation. Making durable execution a capability you can attach to different kinds of tasks, rather than wiring it permanently into the agent execution engine, is what actually getting this right looks like.

## References

- [Mastra @mastra/core@1.86.0 Release Notes](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.86.0)
- [mastra-ai/mastra on GitHub](https://github.com/mastra-ai/mastra)
- [@mastra/core CHANGELOG.md](https://github.com/mastra-ai/mastra/blob/@mastra/core@1.86.0/packages/core/CHANGELOG.md)
- [PR #31204: durable dataset experiments](https://github.com/mastra-ai/mastra/pull/31204)
- [PR #31101: Knowledge importer contract and runner infrastructure](https://github.com/mastra-ai/mastra/pull/31101)
- [PR #31200: knowledge_activity tool](https://github.com/mastra-ai/mastra/pull/31200)
- [PR #30996: principals/author for Knowledge tools](https://github.com/mastra-ai/mastra/pull/30996)
- [PR #31113: interrupted thread run status](https://github.com/mastra-ai/mastra/pull/31113)
- [Pydantic AI v2.75.0 Release Notes (shipped the same day, also tightening authority boundaries)](https://github.com/pydantic/pydantic-ai/releases/tag/v2.75.0)
- [Framework Update: Mastra @mastra/core v1.83.0](/posts/daily/2026-11-14-framework-mastra-core-v1.83.0-en)
