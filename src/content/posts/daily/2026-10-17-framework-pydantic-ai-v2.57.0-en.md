---
title: "Framework Update: Pydantic AI v2.57.0"
date: 2026-10-17
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: en
description: "Pydantic AI v2.57.0 adds ApprovalReviewer, letting another model pre-screen low-risk tool calls before deciding whether a person needs to see them; it also ships MetaProvider and forwards MCP Apps tool results"
tldr: "Two things in Pydantic AI v2.57.0: (1) a new harness `ApprovalReviewer` lets a model review low-risk tool calls before a person ever sees them; (2) a new `MetaProvider` adds support for the Meta Muse model family. MCP Apps tool results now forward to AG-UI and Vercel AI front ends, and `MCPToolset` gains `read_resource_contents`/`call_tool_for_app`. Compatibility notes: `BackgroundTools` completions carry namespaced `origin`/`tool_call_id` metadata, Gemini Live and GPT-Live realtime history, usage, and reply-wait handling moved into the session core, and `Skills` now honors `disable-model-invocation`/`user-invocable` flags."
series:
  name: "AI Framework Changelog"
  order: 45
---

> 🌏 [繁體中文版](/posts/daily/2026-10-17-framework-pydantic-ai-v2.57.0)

## Version Info

| Item | Value |
|---|---|
| Framework | Pydantic AI |
| Version | v2.57.0 |
| Previous | v2.56.0 |
| Released | 2026-10-16 |
| Release Notes | [v2.57.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.57.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 20.7k |

## Why This Release Matters

The previous release filled in the execution environment (a microVM sandbox, PGTaskDurability); this one fills in the approval flow. `ApprovalReviewer` lets a model pre-screen low-risk tool calls, so only the ones that genuinely need a human get surfaced — it cuts the cost of "a human in the loop" from every tool call down to just the risky ones. For harness projects already doing human-in-the-loop approval, this directly removes a lot of unnecessary interruptions.

## Key Changes

- **Harness ApprovalReviewer**: a model reviews tool calls before a person sees them, approving low-risk ones automatically and escalating the suspicious ones → instead of every pending tool call needing a human glance, most get filtered out upfront
- **MetaProvider**: adds support for the Meta Muse model family via a `meta:` prefix over the Responses API → no need to wire up Meta's API format yourself
- **MCP Apps tool result forwarding**: MCP Apps tool results now forward to AG-UI and Vercel AI front ends, with `MCPToolset` gaining `read_resource_contents` and `call_tool_for_app` → front ends can render what MCP Apps returns directly, without translating it themselves
- **Request pricing**: requests are now priced at the service tier they actually report → billing matches the tier the model actually used
- **EvaluationReport field**: adds `dataset_name` → easier to trace an eval run back to its dataset
- **Notable fixes**: token-based compaction retains more recent history; `OpenAIResponsesModel` no longer sends `tool_choice` names that aren't in `allowed_tools`; Gemini tool-call thought signatures are sent back from `OpenAIChatModel`; a tool's `prepare` gets its own retry count under `.prefixed()`/`.renamed()`/`PrefixTools`

## Breaking Changes

The release notes don't label these as breaking, but the four "compatibility notes" amount to behavior changes in practice:

- `BackgroundTools` completions carry namespaced `origin`/`tool_call_id` metadata
  - Affected: code that parses `BackgroundTools` completion structures directly
- Gemini Live and GPT-Live realtime history, usage, and reply-wait handling both moved into the session core
  - Affected: integrations that touch these realtime sessions' internal state directly
- `Skills` now honors `disable-model-invocation`/`user-invocable` flags and skips stray paths outside the skill library
  - Affected: projects that relied on the old behavior where those flags were ignored

## Migration Guide

### Upgrading from v2.56.0 to v2.57.0

```bash
pip install --upgrade "pydantic-ai==2.57.0"
```

After upgrading, check two things: if you parse `BackgroundTools` completion metadata yourself, confirm the new `origin`/`tool_call_id` fields don't collide with existing ones; and if you touch Gemini Live or GPT-Live session internals directly, switch to the interfaces the session core now exposes. To use the new approval flow:

```python
from pydantic_ai.harness import ApprovalReviewer

reviewer = ApprovalReviewer(model="a model for low-risk review")
# Low-risk tool calls get approved automatically; everything else still goes to a human
```

## Compared With Other Frameworks

Today's batch also has Mastra 1.78.0 using agent scopes to guard "who can touch which run," and Agno v3.1.4 using sandboxes to guard "what the agent can touch." Pydantic AI's `ApprovalReviewer` fills in a third layer: "should a tool call be shown to a person at all." Put together, this week's updates across three frameworks form the three lines of defense a production agent actually needs — permissions, isolation, and approval.

## Today's Takeaway

I used to assume human-in-the-loop approval meant every tool call gets shown to a person. `ApprovalReviewer` made the cost of that assumption obvious: if low-risk calls can be filtered out by another model first, the human only sees the genuine exceptions, and the approval step stops being a bottleneck.

## References

- [Pydantic AI v2.57.0 release notes — GitHub](https://github.com/pydantic/pydantic-ai/releases/tag/v2.57.0)
- [pydantic/pydantic-ai — GitHub](https://github.com/pydantic/pydantic-ai)
- [ApprovalReviewer PR #10143 — GitHub](https://github.com/pydantic/pydantic-ai/pull/10143)
- [MetaProvider PR #10156 — GitHub](https://github.com/pydantic/pydantic-ai/pull/10156)
- [Framework Update: Pydantic AI v2.56.0](/posts/daily/2026-10-15-framework-pydantic-ai-v2.56.0-en)
