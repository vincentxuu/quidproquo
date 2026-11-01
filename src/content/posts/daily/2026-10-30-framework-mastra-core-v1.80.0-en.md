---
title: "Framework Update: Mastra @mastra/core v1.80.0"
date: 2026-10-30
category: daily
type: digest
tags: [ai-agent, framework, daily, mastra]
lang: en
description: "Mastra @mastra/core v1.80.0 lets each end user connect their own third-party account for an agent to use, adds a connect card the agent can request mid-conversation, and ships four breaking changes to trace queries, connect sessions, code-sdk, and playground sorting"
tldr: "Three things in Mastra @mastra/core v1.80.0: (1) `tools({ resourceId })` plus `userConnectRoutes()` let each end user bind their own OAuth connection, with the server hard-enforcing that one user's connection can't be used by another user's agent; (2) a new `request_connection` tool lets an agent return a structured card when it's missing an integration, so the chat UI can render a connect prompt; (3) four breaking changes: `queryTraceThreads()` drops `model`/`provider` and caps `page.limit` at 100, the connect-session creation API renamed its response field, `code-sdk` no longer registers built-in subagents by default, and `TracesExplorer`'s sort API changed to a single object."
series:
  name: "AI Framework Changelog"
  order: 57
---

> 🌏 [中文版](/posts/daily/2026-10-30-framework-mastra-core-v1.80.0)

## Release Info

| Item | Value |
|---|---|
| Framework | Mastra (`@mastra/core`) |
| Version | @mastra/core@1.80.0 |
| Previous version | @mastra/core@1.79.0 |
| Release date | 2026-10-28 |
| Release Notes | [@mastra/core@1.80.0](https://github.com/mastra-ai/mastra/releases/tag/@mastra/core@1.80.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 29k |

## Why this release matters

Multi-tenant agent products have long faced an awkward tradeoff. The simplest way to let an agent touch a third-party service like Gmail, Slack, or GitHub is to authorize one shared service account for the whole app — but then everything every user's agent does gets attributed to that same shared identity, which makes auditing and risk isolation crude. This release turns "users authorize their own accounts" into a framework-native feature: `tools({ resourceId })` lets the same agent definition resolve a different tool set depending on who's calling, `userConnectRoutes()` opens the matching connection routes, and the server now hard-blocks the cross-tenant case where user A's connection ends up serving user B's agent. Paired with the new `request_connection` tool, an agent can proactively say mid-conversation "I need you to authorize this service," letting the chat UI render a connect card on the spot — the user doesn't need to know in advance where to go set it up.

```diagram
title: Mastra v1.80.0: the per-resource connection request flow
desc: When an agent is missing a user's connection to an integration, request_connection returns a structured card; once the user authorizes it themselves, that connection is locked to serving only that one user.
caption: Simplified: the existing global/shared connection path (present before 1.80.0, not replaced by this release) is omitted.
---
<svg viewBox="0 0 640 440">
  <path class="dg-line" d="M320 96V136" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 204V240" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 300V340" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="140" y="40" width="360" height="56" rx="6"/>
  <text class="dg-label" x="320" y="60" text-anchor="middle" dominant-baseline="central">Agent calls an integration tool</text>
  <text class="dg-sub" x="320" y="80" text-anchor="middle" dominant-baseline="central">but this user has no connection</text>

  <rect class="dg-box" x="140" y="140" width="360" height="64" rx="6"/>
  <text class="dg-label" x="320" y="160" text-anchor="middle" dominant-baseline="central">request_connection</text>
  <text class="dg-sub" x="320" y="180" text-anchor="middle" dominant-baseline="central">returns a structured connect-prompt</text>

  <rect class="dg-box" x="140" y="244" width="360" height="56" rx="6"/>
  <text class="dg-label" x="320" y="264" text-anchor="middle" dominant-baseline="central">Chat UI</text>
  <text class="dg-sub" x="320" y="284" text-anchor="middle" dominant-baseline="central">renders a connect card for the user</text>

  <rect class="dg-box dg-box--ghost" x="140" y="344" width="360" height="56" rx="6"/>
  <text class="dg-label" x="320" y="364" text-anchor="middle" dominant-baseline="central">The user</text>
  <text class="dg-sub" x="320" y="384" text-anchor="middle" dominant-baseline="central">completes OAuth with their own account</text>
</svg>
```

## Key changes

- **End-user (per-resource) connections**: `tools({ resourceId })` resolves a different tool set depending on who's calling; `userConnectRoutes()` opens routes for users to authorize their own connections, with built-in caching and hard server-side enforcement that one user's connection can't be taken by another user's agent → multi-tenant agent products no longer need to build their own "who can use which connection" check
- **In-chat "request connection" prompts**: resource-scoped tool resolution now includes a built-in `request_connection` tool that returns a structured `connect-prompt` (provider list plus connection state), so chat UIs can render a connect card directly → an agent missing an integration can ask the user to authorize it on the spot, instead of steering them to a settings page ahead of time
- **Span aggregation API**: new `POST /observability/spans/aggregate` plus `aggregateSpans()`, supported across ClickHouse/Postgres/DuckDB, computes grouped metrics — run counts, latency, error rate, tokens, cost — in one query → building a Metrics/observability dashboard no longer needs application-level aggregation
- **Unified provider-error classification**: `@mastra/core/error` adds `classifyProviderError` and friends, a single reader that distinguishes authentication failure, quota, rate limit, context overflow, rejected model/request, timeout, and outage; streamed errors now carry the provider's status/requestId/model id/reason to the client, and reloading a thread classifies the same way a live stream did → inconsistent error messaging across providers finally gets a single, consistent UX
- **Run status and durable-execution control**: thread subscriptions can opt into `withRunStatus: true` to receive ordered `thread-run-status` events without closing the subscription; `agent.abortRun(runId)` can explicitly cancel a durable run, and disconnecting an observer no longer aborts durable/evented execution by default → the lifecycle of run state is now managed more precisely

## Breaking Changes

Yes, four:

- `queryTraceThreads()` thread rows no longer include `model` or `provider`, and `page.limit` is now capped at 100 (default 25):
  - Before: `queryTraceThreads({ page: { limit: 500 } })`, reading `threads[0].model` directly
  - After: `queryTraceThreads({ page: { limit: 100 } })`; `threads[0].model` no longer exists — read it from span-level data instead
  - Affected: any code that depends on `model`/`provider` on thread rows, or sets `limit` above 100
- `@mastra/connect`'s connect-session creation API renamed its response field from `connectUrl` to `launchUrl`:
  - Before: `const { connectUrl } = await createConnectSession(...)`
  - After: `const { launchUrl } = await createConnectSession(...)` (a server-verified launch route)
  - Affected: any code calling the connect-session creation API and reading the old field name
- `@mastra/code-sdk` no longer registers built-in subagents by default:
  - Before: `createCodeSdk({ ... })` (built-in subagents attached automatically)
  - After: `createCodeSdk({ subagents: [...builtinSubagents], ... })` (pass them explicitly to keep the old behavior)
  - Affected: projects relying on built-in subagents being present automatically
- `@mastra/playground-ui`'s `TracesExplorer` sorting API changed to a single `{ field, direction }` object:
  - Before: `<TracesExplorer sortDirection={dir} onSortDirectionChange={setDir} />`
  - After: `<TracesExplorer sort={{ field: 'startedAt', direction: dir }} onSortChange={setSort} />`
  - Affected: projects with a custom playground UI calling this sort prop pair directly

## Migration Guide

### Upgrading from 1.79.x to 1.80.0

```bash
npm install @mastra/core@1.80.0
```

```ts
// The existing global/shared connection path still works unchanged
const result = await agent.generate(prompt, { tools });

// New: let each end user authorize their own account (additive, not a replacement)
const result = await agent.generate(prompt, {
  tools: tools({ resourceId: user.id }),
});

// Open the route for users to connect their own accounts
app.use('/connect', userConnectRoutes());
```

Of the four breaking changes, `queryTraceThreads()` and `connectUrl → launchUrl` are the easiest to silently break in existing code — the type system won't catch it, and the field just comes back `undefined` at runtime. After upgrading, search your codebase for both call sites first.

## Compared to other frameworks

In the same week (Oct 27–29), Agno's v3.1.12 wired Claude's and Codex's own permission requests into AgentOS's Approval UI — a consent mechanism for "should this one tool call run." Mastra's v1.80.0 solves a different layer — "which user does this connection represent" — but the direction is the same: both frameworks are pulling authorization logic that used to live in the application layer up into the framework itself as a first-class concern. By contrast, crewAI's v1.15.33 the same week was still adding CLI conveniences (skill search, flow argument passing) — it hasn't touched this class of authorization problem yet.

## Today's takeaway

I used to assume that "user isolation" in a multi-tenant agent product was mostly a database-level concern — keep each user's sessions and records in separate rows. Seeing Mastra push that isolation up to the OAuth connection itself, and enforce it server-side against cross-user misuse, made it clear: if an agent is going to act on a third-party service on a user's behalf, isolating only at the database layer does nothing to stop the risk of one user's authorized account being used on another user's behalf. The connection itself has to be bound to the user's identity — that's the real security boundary for this class of product.

## References

- [Mastra @mastra/core@1.80.0 Release Notes](https://github.com/mastra-ai/mastra/releases/tag/@mastra/core@1.80.0)
- [mastra-ai/mastra on GitHub](https://github.com/mastra-ai/mastra)
- [@mastra/core CHANGELOG.md](https://github.com/mastra-ai/mastra/blob/@mastra/core@1.80.0/packages/core/CHANGELOG.md)
- [AI Agent GitHub Digest 2026-10-30 (candidate list)](/posts/daily/2026-10-30-ai-agent-github-digest-en)
