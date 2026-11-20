---
title: "Framework Update: Pydantic AI v2.69.0"
date: 2026-11-18
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: en
description: "Pydantic AI v2.69.0 adds six new sandbox/workspace backends and Peers for direct agent-to-agent messaging, while folding RequestInput into HandleDeferredToolCalls"
tldr: "Compatibility notes in Pydantic AI v2.69.0: RequestInput is folded into HandleDeferredToolCalls, whose handler can now take a resume token; BubblewrapSandbox is renamed to BubblewrappedWorkspace. On the feature side, six new sandbox/workspace backends (including KubernetesSandbox and WindowsWorkspace) and Peers, which lets agents message each other directly."
series:
  name: "AI Framework Changelog"
  order: 69
---

> :globe: [中文版](/posts/daily/2026-11-18-framework-pydantic-ai-v2.69.0)

## Release Info

| Item | Value |
|---|---|
| Framework | Pydantic AI |
| Version | v2.69.0 |
| Previous version | v2.68.0 |
| Release date | 2026-11-16 |
| Release Notes | [v2.69.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.69.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 21.3k |

## Why this release matters

This release is large — the official changelog lists well over a hundred entries — but the throughline is clear: Pydantic AI is expanding `pydantic-ai-harness`, its agent execution layer, from a handful of fixed sandboxes toward matching each cloud provider's own networking and secrets model one by one, adding six new sandbox/workspace backends in one release. At the same time, it adds `Peers`, which lets multiple agents message each other directly instead of always routing through a central orchestrator. For anyone building multi-agent systems on Pydantic AI, this release fills in two things at once — where an agent runs, and how agents talk to each other — rather than shipping one small feature.

## Key changes

- **Six new sandbox/workspace backends at once**: `KubernetesSandbox` (runs on kubernetes-sigs/agent-sandbox pods), `WindowsWorkspace` (a PowerShell workspace for Windows hosts), `E2BSandbox(network=)`, `BoxdSandbox(secrets=)`, `DaytonaSandbox(secrets=)`, and `OpenSandbox(network_policy=)` → agent execution environments are no longer limited to a small, fixed set of sandboxes; they can now match each cloud provider's own network isolation and secrets injection model
- **Peers: agents messaging each other directly**: `pydantic-ai-harness` adds `Peers`, letting multiple agents send messages to one another → fills a gap in native agent-to-agent communication for multi-agent collaboration, instead of requiring every team to build their own central relay layer
- **ToolBudgets**: lets `ToolBudgets` answer with a result instead of raising when a tool call goes over budget or repeats → turns "whether to keep calling this tool" from a hardcoded exception path into a hook developers can take over
- **DynamicWorkflow(call_scheduler=)**: lets subclasses decide when sub-agent calls actually start → sub-task scheduling logic is no longer locked into the framework's internal logic

## Breaking Changes

- `RequestInput` is folded into `HandleDeferredToolCalls`: the official compatibility note reads "Fold `RequestInput` into `HandleDeferredToolCalls`, whose handler can take a resume token" — the previously standalone `RequestInput` mechanism is absorbed into `HandleDeferredToolCalls`, whose handler can now accept a resume token to resume a flow
  - Affected: code that directly imports or constructs `RequestInput`
- `BubblewrapSandbox` is renamed to `BubblewrappedWorkspace`
  - Affected: code that references the `BubblewrapSandbox` class name directly

## Migration Guide

### Upgrading from 2.68.x to 2.69.0

```bash
pip install --upgrade pydantic-ai==2.69.0
```

These compatibility changes are mostly naming and interface consolidation rather than a behavioral rewrite, and the official notes don't include a line-by-line before/after. For the exact migration, check the relevant PR diffs directly:

- `RequestInput` → `HandleDeferredToolCalls`: [PR #13285](https://github.com/pydantic/pydantic-ai/pull/13285)
- `BubblewrapSandbox` → `BubblewrappedWorkspace`: [PR #13179](https://github.com/pydantic/pydantic-ai/pull/13179)

## Compared to other frameworks

The same week, [Agno v3.2.1](/posts/daily/2026-11-18-framework-agno-v3.2.1-en) made session compaction history and Company files queryable through an API, while Pydantic AI expanded in a different direction — infrastructure for where an agent runs and how agents talk to each other. The two frameworks reinforced different things in the same week, "auditability" versus "execution environment flexibility," echoing the observation from the Agno v3.2.0 release: competition between agent frameworks has moved past how a single agent is written, into infrastructure-level questions about where agents run and how they talk to each other.

## Today's takeaway

I used to think of Pydantic AI's "harness" as just a wrapper around running an agent's execution environment. Seeing six new sandbox/workspace backends land in one release, alongside Peers for direct agent-to-agent messaging, made it clear that Pydantic AI now positions itself as a full multi-agent execution environment provider, not just an SDK for calling an LLM.

## References

- [Pydantic AI v2.69.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.69.0)
- [pydantic/pydantic-ai on GitHub](https://github.com/pydantic/pydantic-ai)
- [Full Changelog: v2.68.0...v2.69.0](https://github.com/pydantic/pydantic-ai/compare/v2.68.0...v2.69.0)
- [PR #13285: Fold RequestInput into HandleDeferredToolCalls](https://github.com/pydantic/pydantic-ai/pull/13285)
- [PR #13179: Rename BubblewrapSandbox to BubblewrappedWorkspace](https://github.com/pydantic/pydantic-ai/pull/13179)
- [Framework Update: Agno v3.2.1](/posts/daily/2026-11-18-framework-agno-v3.2.1-en)
