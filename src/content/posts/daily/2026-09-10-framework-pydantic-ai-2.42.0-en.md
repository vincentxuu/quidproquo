---
title: "Framework Update | Pydantic AI v2.42.0"
date: 2026-09-10
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: en
description: "Pydantic AI 2.42 adds a GitHubCopilotProvider to widen model access, and tightens validation on DeferredToolResults.approvals"
tldr: "Pydantic AI v2.42.0 highlights: (1) a new `GitHubCopilotProvider` lets Agents use GitHub Copilot's OpenAI-compatible API directly as a model backend; (2) `DeferredToolResults.approvals` now rejects invalid values outright — a compatibility change; (3) fixes for Bedrock Converse sampling settings, `$ref` resolution in code-mode function schemas, and lost Anthropic error-recovery state across normalized history."
series:
  name: "AI Framework Changelog"
  order: 18
---

> 🌏 [中文版](/posts/daily/2026-09-10-framework-pydantic-ai-2.42.0)

## Version Info

| Item | Value |
|---|---|
| Framework | Pydantic AI |
| Version | v2.42.0 |
| Previous | v2.41.0 |
| Released | 2026-09-08 |
| Release Notes | [GitHub Release](https://github.com/pydantic/pydantic-ai/releases/tag/v2.42.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 20k |

## Why This Version Matters

[The previous release (2.40.0)](/posts/daily/2026-09-06-framework-pydantic-ai-2.40.0) took a big step forward in realtime voice interaction; 2.42 is a much smaller "close the gaps, widen model access" release, but the direction is consistent. `GitHubCopilotProvider` means teams already on a Copilot subscription no longer need to hand-roll an OpenAI-compatible base_url workaround to use it as an Agent's model backend. The other notable change sits in the Compatibility Notes: `DeferredToolResults.approvals` now throws a validation error immediately on invalid values instead of letting them pass and failing later downstream. For teams building human-in-the-loop tool approval flows, that catches errors earlier — but it also means code that happened to work with previously-unchecked values may hit a hard error for the first time after upgrading.

## Key Changes

- **`GitHubCopilotProvider`**: A dedicated provider that lets Agents use GitHub Copilot's OpenAI-compatible API directly as a model backend → teams with an existing Copilot subscription no longer need a hand-rolled compatibility layer or an OpenAI-compatible base_url workaround
- **Tightened `DeferredToolResults.approvals` validation**: Invalid approvals values are now rejected immediately instead of passing through and failing later → format errors in human-in-the-loop approval flows get caught earlier, though existing code relying on the old permissive behavior may now hit a validation error for the first time
- **Bedrock Converse honors `anthropic_disallows_sampling_settings`**: Fixed `BedrockConverseModel` still sending unsupported sampling parameters for certain Anthropic models
- **Inline resolution of `$ref` in code-mode function schemas**: Non-object `$ref`/`$defs` references now resolve inline to their full type definitions → code-mode tool function signatures no longer degrade to untyped (`z.any`) or dangling references through indirection
- **Per-JSON-node validation for `ToolReturnContent`**: Return content is now validated node-by-node even without a corresponding Python call → format errors are caught earlier instead of surfacing only at execution time
- **Preserved Anthropic recovery state**: Fixed Anthropic's error-recovery state getting lost across normalized conversation history

## Breaking Changes

Nothing is formally listed as a breaking change in this release, but the Compatibility Notes flag one behavior change:

- `DeferredToolResults.approvals` now throws a validation error on invalid values instead of potentially letting them through
  - Impact: projects using deferred tool approval (human-in-the-loop) flows that previously passed approvals data not fully matching the expected shape

## Migration Guide

### Upgrading from 2.41.x to 2.42.0

```bash
pip install --upgrade pydantic-ai==2.42.0
```

Example using the new provider:

```python
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel
from pydantic_ai.providers.github_copilot import GitHubCopilotProvider

model = OpenAIModel("gpt-4o", provider=GitHubCopilotProvider())
agent = Agent(model)
```

If the data you pass to `DeferredToolResults.approvals` isn't perfectly shaped (e.g., a key that doesn't match a tool call id, or a wrong value type), this upgrade will now surface a validation error immediately instead of possibly passing silently as before — run your existing human-in-the-loop test cases first to confirm you're not affected.

## Cross-Framework Observations

Compared to the previous release's big move on voice interaction, 2.42 is a much smaller gap-filling release. `GitHubCopilotProvider` adds one more entry to Pydantic AI's list of supported model providers — an area where it consistently stays ahead of LangGraph and CrewAI, which typically wait on community or third-party packages for new providers. The tightened approvals validation echoes Pydantic AI's consistent "types are contracts" stance: reject invalid data at the boundary rather than letting it fail deep in execution.

## Takeaway

I used to think adding a new model provider was just a matter of "one more base_url." Seeing Pydantic AI build a dedicated `GitHubCopilotProvider` — rather than telling users to plug in an OpenAI-compatible endpoint themselves — made clear that different OpenAI-compatible APIs differ enough in authentication, model naming, and parameter support that it's worth a framework absorbing those differences behind a dedicated provider class, instead of leaving users to discover them the hard way.

## References

- [Pydantic AI v2.42.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.42.0)
- [Pydantic AI GitHub](https://github.com/pydantic/pydantic-ai)
- [Pydantic AI v2.40.0 — Previous framework update](/posts/daily/2026-09-06-framework-pydantic-ai-2.40.0)
- [PR #8081: Reject invalid `DeferredToolResults.approvals` values](https://github.com/pydantic/pydantic-ai/pull/8081)
- [PR #8059: Add a `GitHubCopilotProvider`](https://github.com/pydantic/pydantic-ai/pull/8059)
- [PR #7961: Honor `anthropic_disallows_sampling_settings` in `BedrockConverseModel`](https://github.com/pydantic/pydantic-ai/pull/7961)
- [PR #8056: Resolve non-object `$ref` definitions inline](https://github.com/pydantic/pydantic-ai/pull/8056)
- [PR #7823: Validate `ToolReturnContent` per JSON node](https://github.com/pydantic/pydantic-ai/pull/7823)
- [PR #8040: Preserve Anthropic recovery across normalized history](https://github.com/pydantic/pydantic-ai/pull/8040)
- [Full Changelog: v2.41.0...v2.42.0](https://github.com/pydantic/pydantic-ai/compare/v2.41.0...v2.42.0)
