---
title: "Framework Update | Mastra @mastra/core 1.62.0"
date: 2026-08-27
category: daily
tags: [ai-agent, framework, daily, mastra]
lang: en
description: "Mastra 1.62 turns desktop control — screenshots, mouse, keyboard — into a 12th workspace tool, adds Elasticsearch and Valkey storage backends, and ships 7 breaking changes"
tldr: "Mastra @mastra/core@1.62.0 has three highlights: (1) new Computer-Use Sandboxes let agents drive a virtual desktop through the Daytona or E2B Desktop providers — 11 tools for screenshots, clicks, typing, and scrolling; (2) new `@mastra/elasticsearch` and `@mastra/valkey`/`@mastra/valkey-streams` storage backends widen production storage options; (3) 7 breaking changes, including dropped Cloudflare KV/ClickHouse support for background task storage, a changed `DaytonaSandbox` command result format, and the removed `persistPartialOnAbort` option on `agent.stream()`."
series:
  name: "AI Framework Changelog"
  order: 7
---

> 🌏 [中文版](/posts/daily/2026-08-27-framework-mastra-1.62.0)

## Version Info

| Item | Value |
|---|---|
| Framework | Mastra |
| Version | `@mastra/core@1.62.0` |
| Previous | `@mastra/core@1.61.0` |
| Release Date | 2026-08-26 |
| Release Notes | [GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.62.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 27.5k |

## Why This Release Matters

The biggest change in Mastra 1.62 is turning desktop control into a native workspace capability. Previously, a Mastra sandbox could only run code or shell commands. This release adds a `SandboxComputer` capability through Daytona and a new E2B Desktop provider. Agents now get 11 additional tools — screenshot, click, double-click, right-click, drag, type, press key, scroll, read screen info, and wait — so they can operate a virtual desktop directly. This fills a gap the agent framework community has been working on: a code sandbox alone isn't enough for tasks like testing a web UI or driving a legacy system with no API, where an agent still needs to look at the screen and move a mouse. The same release adds two new storage backends, `@mastra/elasticsearch` and `@mastra/valkey`, giving memory, workflow snapshots, and semantic recall more production storage options. But this is also one of the releases with the most breaking changes recently — background task storage drops Cloudflare KV and ClickHouse support outright, so projects on either backend need a migration plan before upgrading.

## Notable Changes

- **Computer-Use Sandboxes (`SandboxComputer` capability)**: workspace sandboxes gain an optional desktop-control capability. Through Daytona or the new `@mastra/e2b-desktop` provider, 11 `mastra_workspace_computer_*` tools are exposed (screenshot / click / double-click / right-click / move / drag / type / press key / scroll / get screen info / wait) → agents can now operate a virtual desktop directly instead of being limited to code/shell; screenshots are returned to the model in native media format
- **New storage backends**: `@mastra/elasticsearch` supports memory, workflow snapshots, scores, and semantic recall; `@mastra/valkey`/`@mastra/valkey-streams` provide GLIDE-backed storage with PubSub and lease support → another round of expanded production storage options
- **Sandbox lifecycle management**: new `getEnv()`/`setEnv()` manage runtime environment variables inside a sandbox; `Mastra.shutdown()` now suspends remote sandboxes instead of destroying them outright; `Workspace.stop()` supports suspend/resume without a full teardown-and-rebuild → lowers the risk of losing state from accidentally killing a sandbox during long-running agent runs
- **Observability / scoring improvements**: Scorers gain declarative eligibility filters and deterministic sampling tied to trace decisions; `PostgresStoreVNext` now shows in-progress traces in Studio; `span.endTree()` can force-close an entire span tree → easier debugging for long-running agents with high trace volume
- **Streaming / session UX**: `@mastra/ai-sdk` adds `withSseHeartbeat()` so SSE connections survive long reasoning without being cut off by an intermediate proxy's timeout; `AgentController#generateThreadTitle()` can generate a thread title without initializing the full session → a good fit for UIs that list titles first and only load the full session on demand

## Breaking Changes

- Mastra Code LSP is now opt-in — you must explicitly set `"lsp": true` in config
  - Affects: projects using Mastra Code editor integration features
- `MarkdownRenderer` no longer streams text word-by-word; it now uses `useRevealedText`
  - Affects: projects embedding the `@mastra/playground-ui` markdown rendering component directly
- CSS class `mastra-markdown-arriving` renamed to `mastra-arriving`
  - Affects: projects with custom styles relying on that class name
- `SankeySignals` now requires controlled `selectedFrameId` and `onFrameIdChange` props
  - Affects: projects using the playground-ui Sankey visualization component
- Background task storage no longer supports Cloudflare KV or ClickHouse
  - Affects: projects running background tasks on either backend
- `DaytonaSandbox` command execution result format changed: the `args` field is removed, and `command` now contains the full string
  - Affects: code that parses the Daytona sandbox command output structure directly
- `agent.stream()` removes the `persistPartialOnAbort` option; aborted runs now retain history automatically
  - Affects: code that previously set this option manually to control abort behavior

## Migration Guide

### Upgrading from 1.61.x to 1.62.0

```bash
# Step 1: update the dependency
pnpm add @mastra/core@1.62.0
```

```typescript
// Step 2a: if you use Mastra Code LSP, enable it explicitly
export default defineConfig({
  lsp: true, // opt-in as of 1.62.0, no longer enabled by default
})
```

```typescript
// Step 2b: update how you parse DaytonaSandbox command results
// Old (1.61.x)
const { command, args } = result

// New (1.62.0) — args is removed, command is now the full string
const { command } = result
```

If your project stores background tasks in Cloudflare KV or ClickHouse, switch to another supported storage backend before upgrading. If you use the `persistPartialOnAbort` option on `agent.stream()`, you can just delete it — abort behavior now defaults to retaining history, so nothing gets worse. The remaining UI-related breaking changes (LSP opt-in, `MarkdownRenderer`, the CSS class rename, `SankeySignals`) only affect projects embedding `@mastra/playground-ui` components directly; code that only calls the `@mastra/core` API is unaffected.

## Cross-Framework Observations

For computer use, Mastra layers a `SandboxComputer` capability on top of its existing sandbox provider abstraction (Daytona, E2B Desktop) — a different layer than Anthropic's own Computer Use API or OpenAI's Operator, where the model itself is trained to operate a screen directly. Mastra instead turns desktop control into a 12th workspace tool at the agent-framework layer. The benefit: the same agent definition can move between environments with and without desktop capability just by swapping the sandbox provider, while governance mechanisms — approval, tracing, screenshot-after-action — carry over from the existing workspace tool framework instead of needing a separate rule set for computer use. Combined with the new Elasticsearch/Valkey storage in this release, Mastra is closing gaps faster than same-language competitors in its position as a "production-deployable TypeScript agent framework" — but that also means every upgrade now demands a careful read of the breaking changes list, and seven in one release is not a small number.

## Takeaway

I used to think of "computer use" as purely a model-layer capability — feed in a screenshot, get back coordinates, and the model learns to operate a screen on its own. Seeing Mastra implement it as a workspace-tool-layer capability instead made me realize the framework layer can reuse the same approval/tracing/screenshot-after-action machinery to govern computer use alongside other workspace tools like `read_file` or shell commands — security controls don't need to be rewritten for every new tool type. It's a good example of decoupling a new capability from an existing governance framework.

## References

- [Mastra @mastra/core@1.62.0 — GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.62.0)
- [mastra-ai/mastra — GitHub](https://github.com/mastra-ai/mastra)
- [Mastra Sandbox Overview — Computer-use tools](https://mastra.ai/docs/sandbox/overview)
- [Mastra @mastra/core@1.61.0 — GitHub Release (previous version)](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.61.0)
