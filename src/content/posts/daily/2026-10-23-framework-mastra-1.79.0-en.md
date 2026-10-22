---
title: "Framework Update: Mastra @mastra/core@1.79.0"
date: 2026-10-23
category: daily
type: digest
tags: [ai-agent, framework, daily, mastra]
lang: en
description: "Mastra 1.79.0 replaces resourceId+scope session addressing with standalone sessionIds, and adds experimental MCP Events so an MCP server can push events on its own"
tldr: "Four things in Mastra 1.79.0: (1) agent controller sessions now address by a standalone sessionId, so one resourceId can hold several sessions; (2) experimental MCP Events (SEP-3415 draft) let an MCP server publish an event stream, picked up via poll, a kept-open stream, or signed webhooks; (3) span-level observability aggregation (`aggregateSpans()`) answers p95 latency and token-cost questions; (4) sandboxes gain a native filesystem API that drops the per-step shell command. Breaking: session addressing changed, `querySpans()` drops some filters and fields, and channel resolvers now require requestContext."
series:
  name: "AI Framework Changelog"
  order: 50
---

> 🌏 [繁體中文版](/posts/daily/2026-10-23-framework-mastra-1.79.0)

## Version Info

| Item | Value |
|---|---|
| Framework | Mastra |
| Version | @mastra/core@1.79.0 |
| Previous | @mastra/core@1.78.0 |
| Released | 2026-10-21 |
| Release Notes | [@mastra/core@1.79.0](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.79.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 29k |

## Why This Release Matters

The previous release (1.78.0) pushed "who's allowed to touch which run" into the framework as agent scopes. This one takes on two different problems: whether one resource can hold several independent sessions at once, and how an agent's MCP server talks to the outside world on its own. Moving sessions from "resourceId + scope" to a standalone sessionId is a real API reshuffle. MCP Events means a Mastra MCP server is no longer just answering calls passively — it can push events out, filling a gap for long-running agent integrations. Teams already using agent controller's multi-session feature, or running their own observability backend, should read the four breaking changes before the new features.

## Key Changes

- **MCP Events (experimental, SEP-3415 draft)**: an MCP server can publish an event stream; clients pick it up via poll, a kept-open stream, or signed webhooks. Under `mastra dev`, Studio can list event types, poll, stream, and even trigger a test event → long-running agent integrations no longer need a separate event system bolted on
- **Span-level observability aggregation**: a new `aggregateSpans()` storage contract lets adapters that declare the `span-aggregate` feature answer questions like "p95 latency for this tool" or "token spend for this agent"; `queryTraces()`/`querySpans()` also gain a `timeToFirstChunkMs` field → building an agent performance dashboard no longer means pulling every span down to compute stats yourself
- **Native filesystem API for sandboxes**: `WorkspaceSandbox` can now expose a `filesystem` property for one-roundtrip reads, writes, and listings instead of a separate shell command per operation; E2B/PlatformSandbox and other providers already support it, and `@mastra/code-sdk`'s `SandboxFilesystem` has switched over → code agents doing heavy file I/O drop a lot of round-trips
- **User-scoped Connect isolation**: `@mastra/connect` adds per-resource (end-user) connection scoping so one user's connections can't serve another user's requests; new `userConnectRoutes()` lets authenticated end users connect their own accounts; Microsoft Teams is added as a channel → multi-tenant SaaS products wiring up third-party integrations no longer need to build their own isolation layer

## Breaking Changes

- Agent controller sessions now address by `sessionId` (scope removed): `controller.getSessionByResource(resourceId, scope)` is gone, replaced by `controller.getSession(sessionId)`; `createSession()` drops `scope` in favor of giving each session its own `id` (omitted, it defaults to `resourceId`, so existing one-session-per-resource code keeps working); `deleteSession()` now takes `{ sessionId }`
  - Affected: integrations using agent controller's multi-session management, or calling `getSessionByResource` directly
- Thread-row queries now use `timeRange.traces` / `timeRange.threads` instead of `traces.timeRange`
  - Affected: code that assembles its own observability query conditions
- `querySpans()` drops the `model`/`provider` filters, and responses no longer carry `cost`, `inputTruncated`, `outputTruncated`, or `errorTruncated` (storage adapters need an update to bring them back)
  - Affected: dashboards and monitoring integrations that use span-level data for cost or truncation checks
- Channel `resolveResourceId`/`resolveThreadId` contexts now require `requestContext`
  - Affected: code that calls either resolver directly (tests, scripts)

## Migration Guide

### Upgrading from 1.78.0 to 1.79.0

```bash
npm install @mastra/core@1.79.0 @mastra/server@latest @mastra/client-js@latest
```

```ts
// Before (1.78.0): sessions addressed by resourceId + scope
await controller.createSession({ resourceId: 'repo-1', scope: 'run-a' });
const session = await controller.getSessionByResource('repo-1', 'run-a');
await controller.deleteSession({ resourceId: 'repo-1', scope: 'run-a' });

// After (1.79.0): sessions addressed by their own id
await controller.createSession({ id: 'run-a', resourceId: 'repo-1' });
const session = await controller.getSession('run-a');
await controller.deleteSession({ sessionId: 'run-a' });
```

## Compared With Other Frameworks

This week also brought Composio's session hooks (blocking a tool call before or after it runs) and Agno's MCP Tool Runner (testing a tool on its own, no MCP client needed). All three frameworks are converging on the same gap: once an agent is running, how does the outside world talk to it and see what it's doing? Mastra's answer is MCP Events pushing data out; Composio's is hooks intercepting requests and results. Opposite directions, same underlying problem — runtime observability and control are becoming the next battleground across every framework.

## Today's Takeaway

I used to think how a session gets addressed — resourceId+scope versus a standalone sessionId — was just an internal implementation detail. Seeing Mastra list this as its first breaking change, and specifically design the "omitted id defaults to resourceId" compatibility path, made it clear that the real risk in this kind of API reshuffle isn't the code you have to change — it's how existing data maps onto the new addressing scheme. That compatibility design is itself part of the migration cost.

## References

- [@mastra/core@1.79.0 release notes — GitHub](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.79.0)
- [mastra-ai/mastra — GitHub](https://github.com/mastra-ai/mastra)
- [Framework Update: Mastra @mastra/core@1.78.0](/posts/daily/2026-10-17-framework-mastra-1.78.0-en)
