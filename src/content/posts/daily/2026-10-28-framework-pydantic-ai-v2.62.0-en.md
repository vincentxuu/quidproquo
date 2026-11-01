---
title: "Framework Update: Pydantic AI v2.62.0"
date: 2026-10-28
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: en
description: "Pydantic AI v2.62.0 lets you change thinking effort mid-conversation, turns compaction summaries into structured data, and flags that GraphBuilder's branch activation order changed, which can affect durable workflows resuming after the upgrade"
tldr: "Three things in Pydantic AI v2.62.0: (1) a new `ModelSettingsDeltaPart` lets you change thinking effort mid-conversation via OpenAI's `configuration_update` or Anthropic's per-message `output_config`, preserving the prompt cache on OpenRouter; (2) `SummarizingCompaction` now stores its summary as a `CompactionPart` instead of a system prompt, and sends it to every provider; (3) Breaking: `GraphBuilder` broadcast branches now start in `.to()` declaration order instead of reversed, which can change behavior for durable workflows that were paused before the upgrade and are resumed after it."
series:
  name: "AI Framework Changelog"
  order: 54
---

> 🌏 [中文版](/posts/daily/2026-10-28-framework-pydantic-ai-v2.62.0)

## Release Info

| Item | Value |
|---|---|
| Framework | Pydantic AI |
| Version | v2.62.0 |
| Previous | v2.61.0 |
| Released | 2026-10-26 |
| Release Notes | [v2.62.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.62.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 21k |

## Why this version matters

Long-running agents face a recurring tradeoff: start with high thinking effort to get solid reasoning, then burn tokens on it through later, repetitive steps that don't need it. This release lets thinking effort change mid-conversation instead of forcing you to tear down and restart the run — OpenAI goes through `configuration_update`, Anthropic through per-message `output_config`, both recorded as a new `ModelSettingsDeltaPart`, and on OpenRouter changing effort doesn't blow away the prompt cache. The other change worth flagging is quieter but riskier: `GraphBuilder`'s broadcast branches now fire in declaration order instead of reversed. Execution-order changes like this are easy to miss, but the maintainers call it out directly in the compatibility notes — if you have a durable workflow that was paused before the upgrade and resumes after it, the branch order it sees may no longer match what it saw when it paused.

## Key changes

- **Change thinking effort mid-conversation**: the new `ModelSettingsDeltaPart` lets you adjust thinking effort during a run via OpenAI's `configuration_update` or Anthropic's per-message `output_config`, and on OpenRouter the prompt cache survives the change → long-running tasks can scale reasoning cost to the complexity of each step instead of locking in one effort level for the whole conversation
- **New model error categories**: added `ModelRequestRejectedError`, `ModelAuthenticationError`, and `ModelNotFoundError` → retry logic can branch on "request rejected" vs. "auth failed" vs. "model not found" instead of guessing from an error string
- **Deferred capability instructions become visible**: instructions for lazily-loaded capabilities are now stated in the system's own voice, their changes get appended, and `before_model_request` can see them → writing a custom before-request hook now shows exactly which capability instructions are currently loaded
- **Hosted MCP tool names get a prefix by default**: hosted MCP capabilities' tool names are now prefixed with the service name by default, configurable via `tool_prefix` → fewer name collisions when multiple MCP services are attached to the same agent
- **Backgroundable, steerable sub-agents**: `task_control` lets `SubAgents` delegations run as background tasks the model can steer, answer, or cancel → paired with `Coder(task_control=)`, long-running delegations no longer block the main run
- **Provider batch API support**: a new `BatchModelRequests` capability plus a `get_wrapper_model` hook → route large volumes of requests through a provider's batch API for lower cost, without hand-rolling batching logic
- **Model-initiated compaction**: `CompactOnRequest` lets the model ask the harness to compact the conversation at a natural break in the task → compaction no longer depends solely on hitting a fixed token threshold

## Breaking Changes

- `GraphBuilder` broadcast branches now start in `.to()` declaration order instead of reversed
  - Affected: durable workflows that were paused before the upgrade and resume after it may see a different branch execution order than the one in effect when they paused
- `SummarizingCompaction` now stores its summary as a `CompactionPart` instead of a system prompt, and sends it to every provider — even ones without a matching provider-specific format
  - Affected: custom logic that relies on the compaction summary showing up as a system prompt (e.g. parsing system-prompt text for the summary) needs to read `CompactionPart` instead
- Hosted MCP capabilities' tool names now get a service prefix by default (disable or customize via `tool_prefix`)
  - Affected: code that hardcodes tool names for matching, routing, or allowlists will see different names after upgrading

## Migration guide

### Upgrading from 2.61.0 to 2.62.0

```bash
pip install --upgrade pydantic-ai==2.62.0
```

```python
# If you have GraphBuilder-based durable workflows with instances paused mid-run,
# confirm the branch-order change doesn't affect steps already scheduled but not yet resumed

# If custom logic reads the compaction summary, old approach (scanning system-prompt text)
summary = next(p.content for p in messages if is_system_prompt(p) and "summary" in p.content)
# New approach (read CompactionPart directly)
summary = next(p.summary for p in messages if isinstance(p, CompactionPart))

# If code depends on hosted MCP tools' original names, restore them with tool_prefix=None
mcp_toolset = MCPToolset(..., tool_prefix=None)
```

Everything else is additive — existing code keeps working without changes if you don't opt into the new capabilities.

## Comparison with other frameworks

This release pushes "adjustable at runtime" down to a finer grain: thinking effort can change mid-run, and compaction can now be requested by the model itself — both turning parameters that used to be fixed at startup into things you can tune while the run is in progress. Alongside crewAI promoting `AgentExecutor` out of experimental status in 1.15.29 (2026-10-23) and Mastra adding span-level observability in 1.79.0 (2026-10-21), all three frameworks are converging on the same direction — making execution more observable and more interruptible — just from different angles: Pydantic AI is tuning parameters at runtime, crewAI and Mastra are building out observability and tracing.

## Takeaway

I used to think thinking effort was something you set once at the start of a conversation and lived with for the whole run. Seeing it become adjustable mid-conversation through `configuration_update`/`output_config` made it clear that reasoning cost on a long task can actually track the task's own complexity curve, instead of applying one fixed effort setting to the entire conversation — turning "save tokens" from "pick one effort level that's good enough" into "tune it as you go."

## References

- [Pydantic AI v2.62.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.62.0)
- [pydantic/pydantic-ai on GitHub](https://github.com/pydantic/pydantic-ai)
- [Full Changelog: v2.61.0...v2.62.0](https://github.com/pydantic/pydantic-ai/compare/v2.61.0...v2.62.0)
