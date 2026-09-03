---
title: "Framework Update | Mastra @mastra/core 1.60.0"
date: 2026-08-19
category: daily
type: digest
tags: [ai-agent, framework, daily, mastra]
lang: en
description: "Mastra 1.60.0 lets Stored Agents opt into durable execution with a single durable: true flag, adds a Cloudflare Sandbox provider, and picks up the MCP 2026-07-28 protocol revision — pushing Mastra closer to 'production-grade without redeployment'"
tldr: "Mastra 1.60.0 highlights: (1) Stored Agents gain durable: true for durable execution without redeployment, inheriting the server's cache/pubsub for multi-replica persistence; (2) new @mastra/cloudflare-sandbox provider executes commands and file operations through a deployed Sandbox Bridge Worker; (3) @mastra/mcp supports the stateless 2026-07-28 MCP protocol revision and multi-turn elicitation. No breaking changes."
series:
  name: "AI Framework Changelog"
  order: 3
---

> 🌏 [中文版](/posts/daily/2026-08-19-framework-mastra-1.60.0)

## Version Info

| Item | Value |
|---|---|
| Framework | Mastra |
| Version | @mastra/core@1.60.0 |
| Previous | @mastra/core@1.59.0 |
| Release Date | 2026-08-19 |
| Release Notes | [GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.60.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 27.3k |

## Why This Release Matters

This release formally connects Stored Agents (agent definitions saved but not deployed) with durable execution. Previously, giving an agent cross-restart, cross-replica recovery required a full deployment cycle. In 1.60.0, a Stored Agent only needs `durable: true` to inherit the server's existing cache and pubsub for multi-replica persistence — opening a path from "prototype first, decide on production-grade durability later" without redeployment. The same release fills in two infrastructure pieces: Cloudflare Sandbox extends workspace execution beyond Local/Docker, and the MCP protocol upgrade to the `2026-07-28` revision keeps Mastra's tool interop current. All three changes point in the same direction — shrinking the gap between prototype and long-running production.

## Notable Changes

- **Durable Execution for Stored Agents (Agents API)**: Stored Agents can enable durable execution by adding `durable: true` — no code redeployment needed — and inherit the server's cache and pubsub for multi-replica persistence → cross-restart recovery, previously available only to deployed Agents, is now accessible during prototyping
- **Cloudflare Sandbox Provider**: New `@mastra/cloudflare-sandbox` package executes commands and file operations through a deployed Sandbox Bridge Worker → adds another execution environment option for Mastra workspaces beyond Local and Docker
- **MCP Protocol Upgrade**: `@mastra/mcp` supports the stateless `2026-07-28` MCP protocol revision with multi-turn elicitation → keeps interop current with other MCP clients/servers on the same revision
- **Sandbox Checkpoints**: LocalSandbox gains filesystem-level checkpoints via `checkpointName` and `seedCheckpointName` → workspaces can "warm-start" from a known snapshot instead of initializing from scratch
- **RAG Graph Serialization**: `@mastra/rag` adds `serialize()` / `deserialize()` for GraphRAG → knowledge graphs can be persisted and restored without rebuilding on every startup
- **ProcessHandle.closeStdin()**: Sends an EOF signal to background processes on Local, Docker, and supported sandbox providers; providers that don't support stdin closure throw a new `StdinCloseError`

## Breaking Changes

None in this release.

## Migration Guide

Upgrade directly — no code changes required:

```bash
npm install @mastra/core@1.60.0
```

To enable durable execution for a Stored Agent, add `durable: true`:

```typescript
// Before (1.59.x and earlier): Stored Agents have no durable execution
const agent = await mastra.getStoredAgent('support-agent')

// After (1.60.0): add durable to enable cross-restart, multi-replica persistence
const agent = await mastra.getStoredAgent('support-agent', {
  durable: true,
})
```

## Cross-Framework Observations

"Upgrade to durable execution without redeployment" is a distinctive approach in this release. Most frameworks (e.g. LangGraph) tie persistence to a checkpoint mechanism that developers must opt into from the start. Mastra defers that decision until a Stored Agent is already running, lowering the architectural commitment during prototyping.

## Takeaway

Seeing "durable execution" usually brings to mind low-level checkpointing or workflow engine plumbing. What stood out here is that Mastra surfaces it as a single flag (`durable: true`) on Stored Agents — persistence is designed as a runtime property you can toggle on at any time, not an architectural fork you must choose when creating the Agent. That makes "validate the logic first, decide on long-running later" a practical path.

## References

- [Mastra @mastra/core@1.60.0 — GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.60.0)
- [mastra-ai/mastra — GitHub](https://github.com/mastra-ai/mastra)
