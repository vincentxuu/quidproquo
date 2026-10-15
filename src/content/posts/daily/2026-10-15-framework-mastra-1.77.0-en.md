---
title: "Framework Update: Mastra @mastra/core@1.77.0"
date: 2026-10-15
category: daily
type: digest
tags: [ai-agent, framework, daily, mastra]
lang: en
description: "Mastra 1.77.0 extends run fencing to more than a dozen storage backends and links MCP client and server traces both ways; workflow HTTP routes no longer start internal workflows, the breaking change to handle first"
tldr: "Three things in Mastra 1.77.0: Factory gets a formal sandbox provider contract (Docker, E2B, Mastra Platform) and prebuilt environments; the previous release's run fencing now covers Cloudflare DO/D1, DynamoDB, MongoDB, Redis and a dozen more, so a durable run that lost ownership can't overwrite the recovered run's state; spans support links, and `@mastra/mcp` connects client tool-call traces and server request traces in both directions. Breaking: `@mastra/server` workflow routes can no longer start or resume internal workflows, so durable agents must go through agent routes."
series:
  name: "AI Framework Changelog"
  order: 41
---

> 🌏 [繁體中文版](/posts/daily/2026-10-15-framework-mastra-1.77.0)

## Version Info

| Item | Value |
|---|---|
| Framework | Mastra |
| Version | @mastra/core@1.77.0 |
| Previous | @mastra/core@1.76.0 |
| Released | 2026-10-14 |
| Release Notes | [@mastra/core@1.77.0](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.77.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 28.8k |

## Why This Release Matters

1.76.0 only just introduced ownership for durable agent runs; this release rolls it out to almost every storage backend, which is what actually closes the "two workers writing the same run after crash recovery" problem in distributed deployments. The other headline is observability: agent traces and MCP server traces now link to each other, so debugging a failed tool call no longer means stitching timestamps together by hand.

## Key Changes

- **Factory sandbox provider contract**: a formal `FactorySandbox` interface with tunable settings schemas, repository templates and prebuilt environment builds, shipping Docker (`@mastra/docker`), E2B (`@mastra/e2b`) and Mastra Platform (`@mastra/platform-workspace`) implementations → switching sandbox vendors means swapping one provider instance
- **Prebuilt environments and multi-repo sessions**: when the sandbox supports builds, environment templates can be built ahead of time (manually, on a cron or on push) to cut first-session cold starts; sessions boot every repository in the environment and can open change requests against any of them via `source_control_*` tools → coding agents can work across several repos at once
- **Run fencing across storage backends**: Cloudflare DO/D1, Convex, DynamoDB, DSQL, MongoDB, MSSQL, MySQL, OracleDB, Spanner and Redis/Upstash/Valkey all support run fencing, so a durable run that lost ownership can't overwrite the recovered run's threads, messages or workflow state → multi-machine correctness no longer depends on a particular database
- **Observational Memory concurrency fixes**: generation protection (`supersededBy`) plus write APIs that report whether and why a write applied, e.g. `commitActiveObservations({ applied, reason })` → concurrent processes no longer clobber each other's memory writes
- **Trace links and two-way MCP correlation**: spans support `links` (with W3C `traceparent` helpers), propagated by the Datadog, Sentry and OTel exporters; `@mastra/mcp` links client tool-call spans and server request spans in both directions → jump from an agent trace straight to the MCP server trace

## Breaking Changes

- `@mastra/server` workflow HTTP routes no longer allow starting or resuming internal workflows (they return 404) → invoke durable agents through agent routes, e.g. `POST /agents/:agentId/stream`
  - Affected: services that trigger durable agents by calling workflow routes directly
- AgentController thread/session behavior changes, with new suspension address-claiming APIs and deprecations of `SessionRecord.modeId/modelId/state/pending`, `HarnessStorage.appendPendingItem/updatePendingItem/removePendingItem` and `SessionSuspensions.resolveToolCallId()`
  - Affected: projects with a custom harness storage or that read session records directly
- `@mastra/playground-ui` `Dialog`/`AlertDialog` drop handle/render-style props and are now controlled via `open`/`onOpenChange`
  - Affected: front ends reusing playground UI components
- `@mastra/client-js` / `@mastra/react` experiment comparison APIs deprecate `experimentIdA/experimentIdB` in favor of `experimentIds` (plus optional `baselineId`)
  - Affected: code comparing A/B experiments through the client SDK
- Factory projects support provider-instance sandboxes (`MastraFactoryConfig.sandbox`); the old callback form still works but doesn't get settings or builds

## Migration Guide

### Upgrading from 1.76.0 to 1.77.0

```bash
# Step 1: update dependencies
npm install @mastra/core@1.77.0 @mastra/server@latest @mastra/mcp@latest
```

```ts
// Step 2: send durable agents through agent routes
// Before: calling the workflow route to start the durable agent's internal workflow (404 from 1.77.0)
// After:
await fetch(`${baseUrl}/agents/${agentId}/stream`, { method: "POST", body: JSON.stringify(input) });

// Step 3: experiment comparison API
// Before: { experimentIdA, experimentIdB }
// After:  { experimentIds: [idA, idB], baselineId: idA }
```

If you implement your own harness storage, also check for the deprecated fields and methods listed above.

## Compared With Other Frameworks

Both recent Mastra releases are about correctness for durable execution, the same direction as contemporaneous updates in [Pydantic AI v2.56.0](/posts/daily/2026-10-15-framework-pydantic-ai-v2.56.0-en) (PGTaskDurability and a microVM sandbox) and Google ADK 2.12.0 (workflow nodes that require human confirmation): competition among frameworks is moving from "can you build an agent" to "does state stay consistent when agents run across machines, for a long time, and need debugging after failure."

## Today's Takeaway

I assumed something like run fencing only needed to work on one primary database. Seeing Mastra roll it out to a dozen backends at once made it clear: frameworks don't control which storage users deploy on, so a correctness guarantee has to follow every backend, or it's just a feature of one adapter.

## References

- [@mastra/core@1.77.0 release notes — GitHub](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.77.0)
- [mastra-ai/mastra — GitHub](https://github.com/mastra-ai/mastra)
- [Framework Update: Mastra @mastra/core@1.76.0](/posts/daily/2026-10-14-framework-mastra-1.76.0-en)
