---
title: "Framework Update | Pydantic AI 2.36.0"
date: 2026-08-30
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: en
description: "Pydantic AI 2.36.0 rebuilds durable_exec around a single declarative @durable_operation decorator, giving third-party durable engines (Lambda, Restate, Absurd, etc.) a public backend API with zero private imports"
tldr: "Pydantic AI 2.36.0 highlights: (1) new `@durable_operation` decorator turns any custom capability method into a replay-safe durable unit under Temporal/Prefect/DBOS and other engines; (2) a public backend API (`BaseDurabilityCapability`, `CallableOperationBackend`, `RegisteredOperationBackend`) lets third-party durable engines integrate with zero private imports — verified against three out-of-tree engines; (3) one compatibility tightening: MCP tools can no longer opt out of durable execution via tool metadata (previously allowed on DBOS), plus a Prefect dynamic-tool cache-key fix."
series:
  name: "AI Framework Changelog"
  order: 10
---

> 🌏 [中文版](/posts/daily/2026-08-30-framework-pydantic-ai-2.36.0)

## Version Info

| Item | Value |
|---|---|
| Framework | Pydantic AI |
| Version | v2.36.0 |
| Previous | v2.35.3 |
| Release Date | 2026-08-29 |
| Release Notes | [GitHub Release](https://github.com/pydantic/pydantic-ai/releases/tag/v2.36.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 19.6k |

## Why This Release Matters

Pydantic AI already supports four durable execution engines — Temporal, DBOS, Prefect, and Restate — letting agents resume from where they left off after transient API failures or application restarts. But until now, each engine hand-rolled its own naming, serialization, dispatch, and caching logic — six separate implementations of the same idea. 2.36.0 collapses that into one core concept: **every durable unit is a declared operation** that the framework assembles, and each engine only needs to implement a small backend class to bind it. For anyone building custom Agent capabilities (a message-compaction step, a moderation pass, a caching layer), this means adding one `@durable_operation` decorator to a method is enough to make it automatically replay-safe under any durable engine — the team's own proof point is making the internal `SummarizingCompaction` logic replay-safe in just 3 lines. For teams integrating or maintaining third-party durable engines (AWS Lambda, Restate, Absurd), this release also ships a fully public backend API for the first time, with no need to touch any private internals.

## Key Changes

- **New `@durable_operation` decorator (`pydantic_ai.capabilities`)**: marking an async capability method with it makes normal calls automatically run as an activity/step/task whenever a durability engine is bound, and pass straight through when none is → developers no longer need two separate code paths for "durable" vs. "not durable," and don't need to learn any engine-specific API
- **Marking a base hook makes every subclass override durable via MRO scanning**: for example, marking the base `create_sandbox`/`destroy_sandbox` hooks once makes every provider's override automatically durable → subclasses repeat nothing
- **Public backend API for third-party engines (`pydantic_ai.durable_exec`)**: new public classes `BaseDurabilityCapability`, `DurabilityEngineSpec`, `CallableOperationBackend` (for flow/journal-style engines like Temporal/DBOS/Prefect), and `RegisteredOperationBackend` (for Temporal-style engines that need operations pre-registered) → engine authors just set one `engine_spec` and override `get_durable_operation_backend()`, without subclassing or calling any framework-private names
- **Future operation families need zero per-engine wiring**: registered-tier engines bind unknown future operation ids through a generic fallback, so upcoming additions (e.g. planned sandbox operations) won't require engine-specific code changes
- **Tool argument validation now runs in its own durable unit**: `args_validator` execution is split into an independent durable unit, and all `ValidationError`s — whether from argument validation or tool bodies — are journaled with full detail and reconstructed worker-side, so retry-prompt behavior under durability matches plain execution exactly

## Breaking Changes

- **MCP tools can no longer opt out of durable execution via tool metadata**: the old `{'<engine>': False}` pattern is no longer supported on any engine, since MCP tools perform I/O and are now considered to always require their own durable unit
  - Affected: projects that relied on this DBOS-specific behavior to skip durable wrapping for specific MCP tools
- **Prefect dynamic-tool cache key changed**: the cache identity for dynamic tools now includes the full `ToolDefinition`, fixing a bug where a changed tool definition previously replayed stale cached results
  - Affected: projects using the Prefect engine with dynamic-tool caching — expect one cache miss and recompute after upgrading, then normal behavior resumes
- Separately, `clai`'s `load_mcp_toolsets()` now rejects malformed `mcpServers` configuration at load time instead of failing later when connecting to the MCP server (the team notes this qualifies as a minor-release compatibility tightening rather than a breaking change, since such configs could never successfully call MCP anyway, and the raised error remains the documented `ValueError`)

## Migration Guide

### Upgrading from 2.35.x to 2.36.0

```bash
pip install --upgrade pydantic-ai==2.36.0
```

If you previously used tool metadata to disable durable execution for an MCP tool (DBOS users should check this):

```python
# Old (2.35.x and earlier — worked on DBOS)
# Tool metadata to skip durable wrapping for a specific MCP tool
mcp_tool_metadata = {"dbos": False}

# New (2.36.0+)
# No longer supported — MCP tools always run in their own durable unit.
# For custom behavior, wrap the tool in an outer, non-MCP capability method instead.
```

To make a custom capability durable, just add the new decorator:

```python
from pydantic_ai.capabilities import durable_operation

class MyCapability:
    @durable_operation(id="my_capability.summarize")
    async def summarize(self, messages: list[str]) -> str:
        ...  # automatically replay-safe under any bound durability engine
```

## Cross-Framework Observations

LangGraph's persistence approach serializes and stores entire graph execution state via checkpoints. Pydantic AI takes a different path here: it pushes "which code needs to be replay-safe" down to a fine-grained, developer-declared unit via a decorator, while standardizing "how to plug in a different durable engine" into one public interface. For teams already invested in Temporal/DBOS, or wanting to integrate an unofficial engine (AWS Lambda, Restate), this engine-agnostic design offers more flexibility than committing to a single persistence backend.

## Takeaway

I initially assumed "supporting multiple durable execution engines" was mostly an adapter-layer problem. Reading through this PR's description made clear that the real engineering difficulty is naming stability — an engine needs to know that the same logical unit maps to the same persisted name across replays and versions, or replay breaks. Pydantic AI's move here is to centralize naming, cache identity, and serialization in one framework base class instead of leaving each engine to decide independently — that's the part that actually solves multi-engine support, not just writing a few more adapters.

## References

- [Pydantic AI v2.36.0 — GitHub Release](https://github.com/pydantic/pydantic-ai/releases/tag/v2.36.0)
- [pydantic/pydantic-ai — GitHub](https://github.com/pydantic/pydantic-ai)
- [PR #6696 — Add `@durable_operation` for capabilities and a public backend API for third-party durable execution engines](https://github.com/pydantic/pydantic-ai/pull/6696)
- [PR #1374 — Add `--mcp-config` support and tool-call streaming to `clai`](https://github.com/pydantic/pydantic-ai/pull/1374)
- [Durable Execution — Pydantic AI official docs](https://ai.pydantic.dev/durable_execution/overview/)
