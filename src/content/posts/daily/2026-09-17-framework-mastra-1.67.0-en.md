---
title: "Framework Update: Mastra @mastra/core@1.67.0"
date: 2026-09-17
category: daily
type: digest
tags: [ai-agent, framework, daily, mastra]
lang: en
description: "Mastra 1.67 turns workflow authoring itself into an agent capability, adds @mastra/connect to expose platform integrations as agent tools, and supports thread ownership transfer with finer-grained background task execution."
tldr: "Mastra @mastra/core@1.67.0 in four points: (1) the Studio Workflow Builder backend lets an editor-owned agent generate and persist workflow definitions directly — describe a flow in natural language and get a real, runnable workflow back; (2) the new `@mastra/connect` package wraps Mastra Platform integration connections as agent tools, with credentials injected by the platform's connection proxy so agent code never touches a secret; (3) `Memory.updateThreadResourceId()` lets a thread be transferred to a new `resourceId`, implemented transactionally across every major SQL adapter; (4) breaking: `subscribeQueuedMessages` is renamed `subscribeThreadEvents`, and `ArchilFilesystem.grep()` is renamed `diskGrep()`."
series:
  name: "AI Framework Changelog"
  order: 21
---

> 🌏 [中文版](/posts/daily/2026-09-17-framework-mastra-1.67.0)

## Release Info

| Field | Value |
|---|---|
| Framework | Mastra |
| Version | `@mastra/core@1.67.0` |
| Previous | `@mastra/core@1.66.0` |
| Released | 2026-09-15 |
| Release Notes | [GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.67.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 28k |

## Why This Release Matters

[The previous release (1.65.0)](/en/posts/daily/2026-09-10-framework-mastra-1.65.0-en) was about making trace data queryable, deletable, and tenant-scoped. 1.67 pushes a step further: it starts turning "generating a workflow" and "wiring up a third-party service" — things a human previously had to do by hand — into capabilities the agent itself can perform. The Studio Workflow Builder backend gives the editor a hidden, editor-owned agent that reads and writes persisted workflow definitions directly: a developer describes the desired flow in natural language, and the agent produces a workflow that's actually runnable, not just a code snippet. `@mastra/connect` solves the older problem of "an agent that wants to call a third-party API has to manage its own pile of API keys" by wrapping Mastra Platform's already-connected integrations as agent tools; credentials are injected by the platform's connection proxy and refreshed automatically, and the agent's code never touches the secret itself. Combined with thread ownership transfer and finer-grained background task execution, this release fills in a substantial chunk of the infrastructure needed for multi-agent, multi-thread collaboration.

## Key Changes

- **Studio Workflow Builder backend (`workflowBuilder` option)**: configuring `MastraEditor` with `workflowBuilder` enables a hidden, editor-owned agent that authors and persists workflow definitions, adding two new server endpoints — `GET /editor/workflow-builder/settings` and `POST /editor/workflow-builder/stream` — gated by `stored-workflows:read`/`stored-workflows:write` permissions → developers describe a flow in natural language and the agent produces an executable, savable workflow instead of hand-wiring nodes and edges
- **`@mastra/connect`: platform integration connections become agent tools**: wraps a third-party integration connection already set up on Mastra Platform as an agent-callable tool, with credentials injected by the platform's connection proxy and refreshed automatically; supports live discovery/refresh of connected tools and optional allowlisting via `integrations` → agent code never has to touch an API key or OAuth token, and wiring up a third-party service is no longer a manual "apply for credentials, drop them into an env var" process
- **Thread ownership transfer**: `Memory.updateThreadResourceId({ threadId, resourceId })`, a new server route `POST /memory/threads/:threadId/transfer`, and `client-js` support via `MemoryThread.transfer()`, implemented transactionally across every major SQL adapter (moving vector data along with it when semantic recall is enabled) → merging user identities or transferring accounts across tenants no longer requires exporting and re-importing an entire thread history — one API call does it safely
- **Finer-grained background tool execution control**: tools now support per-call execution dispositions (`foreground`/`deferred`/`awaited`), where `awaited` uses durable background execution while still letting the current branch wait for the authoritative result, plus a new `createBackgroundWorkSignalProcessor()` giving the caller a scoped completion signal → long-running tasks (like "go research this topic") can run in the background while the caller still synchronously waits on the authoritative result, without having to build polling logic
- **Workspace/Sandbox bulk uploads and performance**: `WorkspaceSandbox.writeFiles` now supports per-file POSIX `mode` and cancellation via `abortSignal`; `DockerSandbox` supports bulk uploads and richer Docker `mounts` (including volume subpaths); `grep`/`list_files` can use a provider's native `walk()`/`grep()` for speed → remote filesystem operations no longer need a network round trip per file

## Breaking Changes

- `subscribeQueuedMessages({ resourceId, threadId }, listener)` → `subscribeThreadEvents({ resourceId, threadId }, listener)`; the listener now receives typed events (e.g. `queue-count-changed`) instead of the original message shape
  - Affects: any integration code subscribing directly to queued messages
- `@mastra/archil`: `ArchilFilesystem.grep()` renamed to `diskGrep()`
  - Affects: code calling `ArchilFilesystem.grep()` directly

## Migration Guide

### Upgrading from 1.66.x to 1.67.0

```bash
pnpm add @mastra/core@1.67.0
```

```ts
// Old (1.66.x and earlier)
mastra.subscribeQueuedMessages({ resourceId, threadId }, (message) => {
  console.log(message);
});

// New (1.67.0)
mastra.subscribeThreadEvents({ resourceId, threadId }, (event) => {
  if (event.tagName === 'queue-count-changed') {
    console.log(event.data);
  }
});
```

```ts
// Old (@mastra/archil, 1.66.x and earlier)
await archilFilesystem.grep(pattern);

// New (1.67.0)
await archilFilesystem.diskGrep(pattern);
```

Projects that don't use `subscribeQueuedMessages` or `@mastra/archil` have no breaking changes in this release and can upgrade directly.

## How This Compares to Other Frameworks

`@mastra/connect` turns "wiring up a third-party service" from something a developer manages credentials for by hand into a model where the platform proxies the connection and the agent never touches a secret — conceptually close to what Composio offers with its 200+ integration aggregation, except Mastra builds it as a native framework capability rather than an external tool-aggregation layer. The Studio Workflow Builder pushes agent capability another step toward "generating an executable flow itself," a different posture from where LangGraph and CrewAI currently focus, which is still primarily "executing an existing graph or crew." Mastra keeps leaning toward being a platform rather than just a library.

## Today's Takeaway

I used to assume the standard way for an agent to call a third-party API was to drop an API key into an environment variable and hand it to the tool. Seeing `@mastra/connect` hand the entire credential lifecycle to a platform connection proxy — where the agent's code never touches the secret at all — made it clear: credential leakage risk doesn't just come from "is it encrypted at rest," it more often comes from "does the agent's execution environment ever get a chance to see the plaintext credential in the first place." Removing the credential from the agent's field of view entirely is more fundamental than auditing after the fact.

## References

- [Mastra @mastra/core@1.67.0 — GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.67.0)
- [mastra-ai/mastra — GitHub](https://github.com/mastra-ai/mastra)
- [Mastra @mastra/core@1.65.0 — previous framework update](/en/posts/daily/2026-09-10-framework-mastra-1.65.0-en)
- [PR #23493: Studio Workflow Builder backend](https://github.com/mastra-ai/mastra/pull/23493)
- [PR #23026: per-call background execution dispositions](https://github.com/mastra-ai/mastra/pull/23026)
- [PR #21986: experimental cross-agent communication tools](https://github.com/mastra-ai/mastra/pull/21986)
- [PR #23554: hideSignals for live streams and memory recall](https://github.com/mastra-ai/mastra/pull/23554)
