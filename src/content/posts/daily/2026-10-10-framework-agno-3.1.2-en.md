---
title: "Framework Update: Agno v3.1.2"
date: 2026-10-10
category: daily
type: digest
tags: [ai-agent, framework, daily, agno]
lang: en
description: "Agno 3.1.2 adds native conversation-compaction memory, a Codex external-agent adapter, and a HyDE retrieval transform — three new capabilities, no breaking changes"
tldr: "Three things in Agno v3.1.2: (1) `Agent(compaction=True)` folds older turns into a summary stored in a new `agno_compactions` table without overwriting the original messages, so it can be triggered manually with `agent.compact()` or reverted at any time; (2) a new `CodexAgent` brings OpenAI Codex into Agno's external-agent family alongside the Claude Agent SDK, LangGraph, DSPy, and Antigravity adapters; (3) a new `HyDE` query transformer searches with a hypothetical answer instead of the raw question, while rerankers still score against the original query. No breaking changes in this release."
series:
  name: "AI Framework Changelog"
  order: 36
---

> 🌏 [中文版](/posts/daily/2026-10-10-framework-agno-3.1.2)

## Release Info

| Item | Value |
|---|---|
| Framework | Agno |
| Version | `v3.1.2` |
| Previous | `v3.1.1` |
| Released | 2026-10-08 |
| Release Notes | [GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.1.2) |
| GitHub | [agno-agi/agno](https://github.com/agno-agi/agno) |
| Stars | 42.6k |

## Why this release matters

The most common pain point for long-running agents is a conversation history that outgrows the context window — teams have usually had to bolt on Mem0, Zep, or hand-roll their own summarization. 3.1.2 builds this directly into the framework: `Agent(compaction=True)` folds older turns into a summary, and what gets fed to the model is a derived "summary plus recent messages" view, while the original messages stored in the database are never overwritten — which means compaction can be undone at any time instead of being a one-way, lossy operation. The same release also widens Agno's external-agent family to four: after the Claude Agent SDK, LangGraph, DSPy, and Antigravity adapters, it now adds Codex, which runs its own agent loop. For teams already orchestrating multiple agents with Agno who want to drop Codex into the mix, there's no need to write a translation layer by hand.

## What changed

- **Conversation Compaction**: `Agent(compaction=True)` folds older turns into a summary stored in a new `agno_compactions` table, deriving the compacted view that's actually sent to the model; the original messages are never overwritten, and deleting the compaction record restores the full conversation. Tune it with `Compaction(model=..., compact_at_tokens=..., uncompacted_runs=...)`, trigger it manually with `agent.compact()` / `acompact()`, and inspect the result via `run.compaction` → long-running agents finally get reversible, framework-native memory compaction instead of bolting on Mem0 or Zep
- **Codex External Agent (`CodexAgent`)**: wraps the `openai-codex` SDK, translating Codex's own notifications into Agno's run and tool-call events, mapping each Agno session to one Codex thread (persisted when a `db` is set), and exposing `sandbox`, `approval_mode`, `reasoning_effort`, `output_schema`, and MCP config → works standalone or through AgentOS, and Codex formally joins Agno's external-agent lineup
- **HyDE Query Transform**: adds `QueryTransformer` as a retrieval hook, with `HyDE` as its first implementation — `Knowledge(vector_db=..., query_transformer=HyDE())` searches using a generated hypothetical answer instead of the raw query, while rerankers still score against the original question → better semantic-retrieval recall without wiring up an external HyDE implementation yourself
- **Browser Origin Policy**: `AgentOS(cors=CORSConfig(...))` unifies origin policy across CORS preflights, public run/cancel admission, auth error headers, workflow WebSockets, and MCP aliases, with CORS moved to the outermost middleware so even error responses carry consistent headers
- **Configurable Follow-ups**: `followups` now accepts a `FollowupConfig` to set a count range, a dedicated model, and instructions that go only to the follow-up call; the default prompt no longer re-suggests a request the answer already declined

## Breaking Changes

None in this release.

## Migration Guide

Just upgrade — no code changes required:

```bash
pip install --upgrade agno==3.1.2
```

To use the new conversation compaction, add `compaction=True`:

```python
from agno.agent import Agent
from agno.compaction import Compaction

agent = Agent(
    compaction=Compaction(compact_at_tokens=8000, uncompacted_runs=2),
)
```

## How this compares to other frameworks

Designing compaction as a "derived summary, original messages untouched" mechanism rather than overwriting history in place echoes LangGraph 1.x folding memory into its checkpoint machinery — both are pulling long-term memory back into the framework core instead of leaving it to an external service, but Agno keeps a reversible path. The Codex adapter continues Agno's usual strategy: rather than building its own agent loop from scratch, it wraps already-mature agents on the market (Claude Agent SDK, LangGraph, DSPy, Codex) into interoperable external agents, trading that for flexibility in multi-agent orchestration.

## Today's takeaway

I used to assume that "compacting conversation history" necessarily meant throwing information away. Seeing Agno store compaction as an independent `agno_compactions` table that never touches the original messages made it clear that as long as the compacted output is a derived view rather than an in-place overwrite, you get the token savings without giving up the ability to roll back — it's really the old "read-only cache vs. source of truth" pattern from database design, applied to agent memory management.

## References

- [Agno v3.1.2 — GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.1.2)
- [agno-agi/agno — GitHub](https://github.com/agno-agi/agno)
- [Agno v3.1.0 — previous framework update](/en/posts/daily/2026-10-02-framework-agno-3.1.0-en)
- [PR #9873: feat auto compaction with a searchable archive](https://github.com/agno-agi/agno/pull/9873)
- [PR #10901: feat add support for codex harness external agent](https://github.com/agno-agi/agno/pull/10901)
- [PR #10527: feat add HyDE query transform](https://github.com/agno-agi/agno/pull/10527)
