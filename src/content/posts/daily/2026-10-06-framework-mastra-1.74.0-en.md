---
title: "Framework Update: Mastra @mastra/core@1.74.0"
date: 2026-10-06
category: daily
type: digest
tags: [ai-agent, framework, daily, mastra]
lang: en
description: "Mastra 1.74 lets tools read the full conversation state at execution time, lets memory recall page back and forth around a search hit, and removes an old trace-pagination API from playground-ui"
tldr: "Three things in Mastra @mastra/core@1.74.0: (1) agent.getMessages() lets a tool, at execution time, read the full current conversation (including remembered messages and responses already produced in this run) without changing the existing input-only messages field; (2) getObservationalMemoryHistory gains group filtering, ordering, and direct recordId lookup, and memory recall can now page before/after a matched observation group; (3) breaking: @mastra/playground-ui's ThreadViewByTrace/TraceThreadPanel/ThreadTrace drop anchorTraceId, ThreadTrace.LoadMoreSentinel is removed entirely, and pagination now runs through pageSize/onLoadOlder."
series:
  name: "AI Framework Changelog"
  order: 33
---

> 🌏 [中文版](/posts/daily/2026-10-06-framework-mastra-1.74.0)

## Release Info

| Item | Value |
|---|---|
| Framework | Mastra |
| Version | `@mastra/core@1.74.0` |
| Previous | `@mastra/core@1.73.0` |
| Released | 2026-10-01 |
| Release Notes | [GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.74.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 28.6k |

## Why this release matters

A tool's execution used to only ever see the `messages` parameter the framework explicitly handed it — that's the input for "this call," not the state of "the whole conversation so far." 1.74 adds `agent.getMessages()`, letting a tool read the full conversation at execution time, including messages that have already been remembered and responses already produced elsewhere in the same run — and it's purely additive, with no change to the existing `messages` input field. This solves a specific, concrete pain point: a tool often needs to know "what did the user already ask earlier" or "what have other tools in this same turn already answered" to make the right call, and until now that meant wiring up your own side channel outside the tool. Now the framework provides it natively. The other direction worth noting is memory-recall usability: `getObservationalMemoryHistory` gains group filtering, explicit ordering, and direct lookup by ID, and recall search can now page before/after a matched observation group — including groups condensed away by reflection and groups buffered but not yet activated — all without re-indexing, enabling much finer-grained investigative queries. Both directions point at the same underlying theme: letting the agent (and the developer) see more of what actually happened in a conversation at execution time, instead of only the narrow slice the framework was willing to pass along explicitly.

## What changed

- **`agent.getMessages()` in tool context**: both standard and durable agent loops now expose `context.agent.getMessages()` in tool execution context, returning the current full conversation (including remembered messages and this run's responses) without touching the existing input-only `messages` field → the getter reflects message-list removals, but not transient transforms applied only to the provider prompt; treat the returned messages as read-only
- **Observational Memory History query improvements**: `getObservationalMemoryHistory` gains group filtering (`groupId`), explicit ordering (`sortDirection`), and direct lookup by `recordId`, with each database adapter advertising support through `supportsObservationalMemoryHistorySearch` → Convex users need to redeploy their server functions for the new filters to apply; also affects `@mastra/convex`, `@mastra/libsql`, `@mastra/mongodb`, `@mastra/mysql`, `@mastra/oracledb`, and `@mastra/pg`
- **Memory recall can page before/after a search hit**: recall now supports paging "before/after" from a matched `groupId`, including groups condensed away by reflection and groups buffered but not yet activated, with no re-indexing required; search results are also now chronologically ordered, mark where groups may be hidden between hits, and hits already in the agent's context come back as shorter references so more new hits fit
- **Playground UI: new accessible form field primitives**: adds `Field`/`Fieldset`/`Form`/`SearchInput` components that standardize label/description/error wiring without manually managing `id`/`htmlFor`; the older `*FieldBlock` approach is being phased out
- **Vanta remediation pass**: raises the floor on transitive dependencies (`dompurify`, `js-yaml`, `@ai-sdk/provider-utils`) for the 2026-10-01 Vanta remediation pass, and bumps nested dependencies like `nodemailer`, `fastify`, `hono`, and `ajv` along the way

## Breaking Changes

- `@mastra/playground-ui`'s trace pagination API changes entirely:
  - `ThreadViewByTrace`, `TraceThreadPanel`, and `ThreadTrace` drop the `anchorTraceId` prop
  - `ThreadTrace.LoadMoreSentinel` is removed entirely
  - Pagination and loading older turns now go through `pageSize` and `onLoadOlder` on `ThreadTrace`
  - Impact: projects that directly use these components to customize Mastra Studio or build their own trace-thread UI

## Migration guide

### Upgrading from 1.73.x to 1.74.0

```bash
pnpm add @mastra/core@1.74.0
```

```tsx
// Before (1.73.x and earlier)
<ThreadTrace anchorTraceId={traceId} />
<ThreadTrace.LoadMoreSentinel />

// After (1.74.0)
<ThreadTrace pageSize={20} onLoadOlder={() => fetchOlderMessages()} />
```

```ts
// New capability: read the full conversation inside a tool
execute: async (input, context) => {
  const messages = context?.agent?.getMessages?.() ?? [];
  return { messageCount: messages.length };
};
```

Projects that don't directly use `ThreadTrace`, `TraceThreadPanel`, or `ThreadViewByTrace` to customize their trace UI have no code-level breaking change on upgrade. Projects using Convex as their memory storage backend need to redeploy their server functions to pick up the new group-filtering options.

## How this compares to other frameworks

Frameworks differ in their default stance on how much conversation state a tool should be able to read: LangGraph tends to model state explicitly into the graph's state schema, so a tool declares in the schema what it needs to read. Mastra 1.74 takes a different path — the tool execution context opens up a getter that exposes the full current conversation directly, with nothing to declare in a schema upfront. That's friendlier to fast-iterating tool development (you can read more context without touching a schema), but it also pushes the judgment call of "how much should a tool read, and how should it use that" entirely onto the tool author. The recall pagination work continues the same thread as last release's (1.71.0) Observability Capabilities Negotiation: making the capability-discovery and pagination mechanics at the query layer more formal and systematic, instead of every caller rolling its own.

## Today's takeaway

I used to think of "a tool's input" and "the agent's conversation history" as two cleanly separated concerns with a clear boundary — a tool should only ever see the parameters the framework handed it. Seeing `agent.getMessages()` made it clear that boundary is a design choice, not something inevitable: letting a tool read the full current conversation buys smarter judgment calls (like "the user already asked something similar, no need to look it up again"), at the cost of the tool's behavior now depending on finer details of conversation history, which widens the surface for testing and debugging. The tradeoff between expanded capability and predictability isn't unique to the model layer — a framework's interface design for tools has to make the same call.

## References

- [Mastra @mastra/core@1.74.0 — GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.74.0)
- [mastra-ai/mastra — GitHub](https://github.com/mastra-ai/mastra)
- [Mastra @mastra/core@1.71.0 — previous framework update](/en/posts/daily/2026-09-26-framework-mastra-1.71.0-en)
- [PR #25525: agent.getMessages() and Observational Memory History group filtering/paging](https://github.com/mastra-ai/mastra/pull/25525)
- [PR #25317: Playground UI Field/Fieldset/Form/SearchInput](https://github.com/mastra-ai/mastra/pull/25317)
- [PR #25694: Vanta remediation pass dependency bumps](https://github.com/mastra-ai/mastra/pull/25694)
- [@mastra/core — npm version history](https://www.npmjs.com/package/@mastra/core?activeTab=versions)
