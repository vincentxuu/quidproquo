---
title: "Framework Update: Mastra @mastra/core@1.78.0"
date: 2026-10-17
category: daily
type: digest
tags: [ai-agent, framework, daily, mastra]
lang: en
description: "Mastra 1.78.0 adds agent scopes for multi-tenant permission isolation and a typed signal you can queue mid-run; it also tightens cross-resource run access, which now fails without an FGA provider"
tldr: "Three things in Mastra 1.78.0: (1) agent scopes let the caller, the agent itself, and trusted middleware all carry `<type>:<value>` scopes, and memory derives resource/thread from them; (2) `queueSignal()` queues a typed signal behind the current run instead of faking it as a user message; (3) a trace aggregation API adds output/error previews that cut the cost of reading traces. Breaking: `@mastra/server` tightens cross-resource run access — privileged access now fails without a connected FGA provider when `mapUserToResourceId` is set; command output is capped at 1 MiB by default; `stream()` without a `resourceId` only delivers resource-less tasks."
series:
  name: "AI Framework Changelog"
  order: 44
---

> 🌏 [繁體中文版](/posts/daily/2026-10-17-framework-mastra-1.78.0)

## Version Info

| Item | Value |
|---|---|
| Framework | Mastra |
| Version | @mastra/core@1.78.0 |
| Previous | @mastra/core@1.77.0 |
| Released | 2026-10-16 |
| Release Notes | [@mastra/core@1.78.0](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.78.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 28.9k |

## Why This Release Matters

The previous release rolled durable-run ownership out to a dozen storage backends; this one fills in who's allowed to touch which run. Agent scopes push permission boundaries straight into the memory and server layers instead of leaving them to application code. `queueSignal()` fixes another common pain point: sending a structured signal to a running agent mid-turn used to mean faking it as a user message — now there's a dedicated queue for it. Teams already running Mastra in a multi-tenant setup should read the breaking change on cross-resource run access before the new features.

## Key Changes

- **Agent scopes (multi-tenant permission boundaries)**: the caller, the agent itself, and trusted middleware can all carry `<type>:<value>` scopes, and the three layers merge; memory can derive which resource/thread to read or write directly from `resource:`/`thread:` scopes, conflicts return 400, and a resumed run can't add new scopes → permission isolation no longer needs manual checks in every route
- **Typed signal queueing**: new `queueSignal()` queues a typed signal behind the current run instead of converting it into a user message; signal metadata is recorded on the `AGENT_RUN` span → telling a running agent "new data just arrived" no longer means faking a message
- **Trace aggregation API**: a new server endpoint, client method, and React hook for aggregate field discovery, with `@mastra/client-js` adding `aggregateTraces()` → no more pulling every span down just to compute stats
- **Trace previews**: trace/span lists now return stored input, output, and error previews directly, and message previews show the last user message → one less full read when debugging
- **Workflow reliability fixes**: fixes for `.foreach()` hanging or corrupting output on the evented engine, durable agent support inside workflow steps, `suspendData` surviving crashes, and handling of invalid resume data

## Breaking Changes

- `@mastra/server` tightens run-ownership checks under `mapUserToResourceId`: privileged access now requires a connected FGA provider; without the mapper, several routes that reused runs across resources now return 403
  - Affected: multi-tenant deployments and services that relied on loose access being caught by application code after the fact
- Command output is capped at 1 MiB by default and truncated beyond that; pass `maxRetainedBytes: Infinity` to keep everything
  - Affected: workflows whose tools produce large logs or output
- `stream()` without a `resourceId` only delivers resource-less background task events; pass `allResources: true` to get everything
  - Affected: clients listening for background task events without a specific resourceId
- `buildInputPreview()`/`INPUT_PREVIEW_MAX_LENGTH` are deprecated in favor of `buildPreview()`/`PREVIEW_MAX_LENGTH`
  - Affected: integrations that assemble trace preview strings themselves
- Factory: removed cross-scope credential fallback — custom providers must replace `orgFirst` with `credentialScope`; Factory sessions no longer have modes, so Plan/Explore are gone
  - Affected: custom model providers and integrations that depended on Factory modes

## Migration Guide

### Upgrading from 1.77.0 to 1.78.0

```bash
npm install @mastra/core@1.78.0 @mastra/server@latest @mastra/client-js@latest
```

```ts
// Cross-tenant run access: privileged access under mapUserToResourceId now fails without an FGA provider
// Before: application code caught cross-resource access on its own
// After: connect an FGA provider, or drop mapUserToResourceId to fall back to default behavior

// Keeping tool output above the 1 MiB cap
const result = await tool.execute({ maxRetainedBytes: Infinity });

// Listening for all background task events, not scoped to one resource
const stream = await agent.stream({ allResources: true });
```

## Compared With Other Frameworks

Today's batch also includes Pydantic AI v2.57.0's `ApprovalReviewer` (letting a model pre-screen low-risk tool calls) and Agno v3.1.4's sandbox isolation. All three frameworks moved the same direction this week, and not by coincidence: whether an agent can run was never the hard part — who can touch it, what it can touch, and who reviews it first are. Mastra's scopes handle "who can touch which run"; Agno's containers handle "what the agent can touch." They're complementary layers of the same defense.

## Today's Takeaway

I used to think agent permission control could live in application-level if-else checks. Seeing Mastra bake scope-merging rules, conflict handling, and the "resumed runs can't add scopes" edge case into the framework itself made it clear why that assumption breaks down: once multiple tenants are involved, application-level checks are easy to miss one case of — only pulling the boundary into the core lets an upgrade close the gap for everyone at once.

## References

- [@mastra/core@1.78.0 release notes — GitHub](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.78.0)
- [mastra-ai/mastra — GitHub](https://github.com/mastra-ai/mastra)
- [Framework Update: Mastra @mastra/core@1.77.0](/posts/daily/2026-10-15-framework-mastra-1.77.0-en)
