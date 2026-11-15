---
title: "Framework Update: Mastra @mastra/core v1.83.0"
date: 2026-11-14
category: daily
type: digest
tags: [ai-agent, framework, daily, mastra]
lang: en
description: "Mastra @mastra/core v1.83.0 gives every Agent a resumable stream and ships a built-in MCP server at /api/mcp, but also splits the durable option into two separate guarantees: stream resumption and crash-recoverable durable execution"
tldr: "Three things in Mastra @mastra/core v1.83.0: (1) every Agent, not just durable ones, can now publish a resumable stream — agent.observe(runId) lets another reader follow or abort a run; (2) @mastra/server ships a built-in MCP server at /api/mcp with no MCPServer to define, plus OAuth discovery; (3) Breaking: the Agent durable option now controls stream resumption only, not crash-recoverable durable execution — use createDurableAgent() for that."
series:
  name: "AI Framework Changelog"
  order: 66
---

> 🌏 [中文版](/posts/daily/2026-11-14-framework-mastra-core-v1.83.0)

## Release Info

| Item | Value |
|---|---|
| Framework | Mastra (`@mastra/core`) |
| Version | @mastra/core@1.83.0 |
| Previous version | @mastra/core@1.80.0 |
| Release date | 2026-11-12 |
| Release Notes | [Release November 12, 2026](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.83.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 29.5k |

## Why this release matters

This release splits apart two things that used to live behind the same switch. Before, an `Agent`'s `durable: true` meant both "the stream can survive a disconnect and reconnect" and "the run's state can be recovered from a checkpoint after the process itself crashes" — two guarantees that sound alike but actually sit at different layers. 1.83.0 makes resumable streaming a default capability of every Agent, durable or not: `agent.observe(runId)` lets any reader follow a run that's already in flight, and `observe().abort()` can stop it. But crash recovery from a checkpoint is no longer something `durable` promises on its own — that now requires wrapping the agent with `createDurableAgent({ agent })`. The other change worth flagging is the built-in MCP server: exposing an agent to an MCP client used to mean defining your own `MCPServer`; now `@mastra/server` opens an endpoint at `/api/mcp` directly, enabled by default once `server.auth` is configured, with OAuth discovery and audience checks built in. For teams wiring agents into Claude, ChatGPT, or any other MCP client, that removes a whole layer of manual plumbing.

```diagram
title: Mastra v1.83.0: exposing an agent over MCP, before and after
desc: Before 1.83.0, exposing an agent to an MCP client meant defining a custom MCPServer by hand. After 1.83.0, @mastra/server ships a built-in /api/mcp endpoint that turns on by default once server.auth is configured.
caption: Simplified: the existing manual MCPServer path (present before 1.83.0, not removed by this release) is omitted — it's just no longer the only option.
---
<svg viewBox="0 0 640 400">
  <path class="dg-line" d="M160 100V160" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 220V280" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M480 100V160" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M480 220V280" marker-end="url(#arrow)"/>

  <text class="dg-sub" x="160" y="30" text-anchor="middle" dominant-baseline="central">Before</text>
  <rect class="dg-box dg-box--ghost" x="20" y="44" width="280" height="56" rx="6"/>
  <text class="dg-label" x="160" y="64" text-anchor="middle" dominant-baseline="central">Define your own MCPServer</text>
  <text class="dg-sub" x="160" y="84" text-anchor="middle" dominant-baseline="central">register each tool/agent to expose</text>

  <rect class="dg-box dg-box--ghost" x="20" y="164" width="280" height="56" rx="6"/>
  <text class="dg-label" x="160" y="184" text-anchor="middle" dominant-baseline="central">Build your own MCP route</text>
  <text class="dg-sub" x="160" y="204" text-anchor="middle" dominant-baseline="central">wire up OAuth/permission checks yourself</text>

  <rect class="dg-box dg-box--ghost" x="20" y="284" width="280" height="56" rx="6"/>
  <text class="dg-label" x="160" y="304" text-anchor="middle" dominant-baseline="central">MCP client calls the agent/tool</text>

  <text class="dg-sub" x="480" y="30" text-anchor="middle" dominant-baseline="central">After 1.83.0</text>
  <rect class="dg-box" x="340" y="44" width="280" height="56" rx="6"/>
  <text class="dg-label" x="480" y="64" text-anchor="middle" dominant-baseline="central">Configure server.auth</text>
  <text class="dg-sub" x="480" y="84" text-anchor="middle" dominant-baseline="central">built-in MCP endpoint turns on by default</text>

  <rect class="dg-box" x="340" y="164" width="280" height="56" rx="6"/>
  <text class="dg-label" x="480" y="184" text-anchor="middle" dominant-baseline="central">GET /api/mcp</text>
  <text class="dg-sub" x="480" y="204" text-anchor="middle" dominant-baseline="central">server.mcp.oauth handles discovery/audience</text>

  <rect class="dg-box" x="340" y="284" width="280" height="56" rx="6"/>
  <text class="dg-label" x="480" y="304" text-anchor="middle" dominant-baseline="central">MCP client calls the agent/tool</text>
</svg>
```

## Key changes

- **Resumable Agent streams, by default for every Agent**: every `Agent` can publish a run stream with a replay cache that survives a reconnect; `agent.observe(runId)`, `observe().abort()`, and `agent.abortRunStream(runId)` let any reader follow or stop a run across instances, with ownership/TTL enforcement built in → a client disconnecting no longer kills the run by default, and multiple frontends or background workers can track the same run together
- **Built-in MCP server (`/api/mcp`)**: `@mastra/server` now ships an MCP endpoint turned on by default once `server.auth` is configured, with no `MCPServer` to define yourself; `server.mcp.oauth` (`resource`, `requireAudience`, `authorizationServers`, `scopesSupported`) handles OAuth discovery and token audience checks, plus a new self-check route at `GET /api/mcp/builtin` → exposing agents, workflows, and tools to an MCP client needs one less layer of manual wiring
- **Workflow Storage Version 2, now broader**: the experimental `storageVersion: 2` (writing only per-step deltas instead of rewriting the whole run) now works with `@mastra/pg` and `@mastra/libsql`, and results can lazily load step history through an async `steps()` function → long-running workflows write far less, and this is no longer limited to in-memory storage
- **Resumable AI SDK chat routes**: `chatRoute({ resumable: true })` now generates a matching POST + reconnect GET endpoint pair that replays or follows an active run through `agent.observe(runId)`, with explicit `server.apiRoutes: [routes]` configuration support → a frontend using the AI SDK's `useChat({ resume: true })` can wire straight into this, and a page refresh no longer interrupts a reply that's still streaming
- **One-off and bounded schedules**: schedules now support one-time execution (`runAt`) and bounded recurring execution (`endAt`), with `cron` made optional and matching type updates across the server, client, and several storage backends → no more hand-rolling the "turn off the cron after it runs once" cleanup logic

## Breaking Changes

Yes, one:

- `Agent`'s `durable` option now controls **stream resumption only** — it no longer implies crash-recoverable, checkpoint-backed durable execution:
  - Before: `new Agent({ ..., durable: true })` gave you both stream resumption and recovery from a checkpoint after a crash
  - After: `new Agent({ ..., durable: true })` gives you stream resumption only; for crash recovery, switch to `createDurableAgent({ agent })`
  - Affected: any project relying on a plain `Agent`'s `durable: true` for crash recovery — and note that plain agents now also behave differently on disconnect, since resumable streams are on by default

## Migration Guide

### Upgrading from 1.80.x to 1.83.0

```bash
npm install @mastra/core@1.83.0
```

```ts
// Before (pre-1.80.x): durable: true gave you both stream resumption and crash recovery
const agent = new Agent({
  name: 'support-agent',
  durable: true, // assumed both guarantees came with this
  instructions: '...',
});

// After (1.83.0): stream resumption is now a default capability, no flag needed
const agent = new Agent({
  name: 'support-agent',
  instructions: '...',
});
// For checkpoint-based crash recovery, wrap the agent explicitly
const durableAgent = createDurableAgent({ agent });
```

After upgrading, check every `Agent` in your project with `durable: true` and ask whether it actually needs crash recovery. If it's only there for client-side reconnects, you no longer need the flag at all. But if it genuinely depends on crash recovery — a long-running background task, for instance — forgetting to add `createDurableAgent()` means silently losing that recovery the next time the process restarts.

## Compared to other frameworks

Coincidentally, Agno's v3.2.0, covered here yesterday (Nov 12), is working on a closely related problem: it moved sandboxed agents' cross-replica cancel/resume logic off Redis and onto "Postgres plus a shared checkpoint store." Both frameworks are reinforcing the same direction — making execution state recoverable across instances and restarts — but from different angles. Agno is fixing recovery for the sandbox execution environment itself; Mastra's release here fixes two other layers — who gets to observe or abort a run in flight, plus stream resumption — and deliberately separates that from crash recovery as its own, distinct option. By comparison, Mastra's split here is less about building one unified durable-execution story and more about defining the problem more precisely.

## Today's takeaway

I used to treat "resumable" as one concept — if something can reconnect, crash recovery is just an extension of that same idea. Seeing Mastra split the `durable` option into "stream resumption" and "checkpoint-based crash recovery" as two independent guarantees made it clear these sit at genuinely different layers: stream resumption only needs the server to still remember the run's state, which is a connection-layer concern; crash recovery needs the run's execution state itself persisted to a checkpoint, which is an execution-engine concern. Binding both to one boolean made it unclear, exactly when it mattered most, which guarantee you actually had — which is why this release was willing to break the API rather than keep hiding that distinction.

## References

- [Mastra Release November 12, 2026 (@mastra/core@1.83.0)](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.83.0)
- [mastra-ai/mastra on GitHub](https://github.com/mastra-ai/mastra)
- [@mastra/core CHANGELOG.md](https://github.com/mastra-ai/mastra/blob/@mastra/core@1.83.0/packages/core/CHANGELOG.md)
- [Framework Update: Agno v3.2.0](/posts/daily/2026-11-13-framework-agno-v3.2.0-en)
