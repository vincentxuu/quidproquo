---
title: "Framework Update: Agno v3.1.3"
date: 2026-10-12
category: daily
type: digest
tags: [ai-agent, framework, daily, agno]
lang: en
description: "Agno 3.1.3 brings external agents like the Claude Agent SDK and Codex nearly on par with native agents: durable sessions, background runs, retries, and structured output all land in one release"
tldr: "Agno v3.1.3 is all about bringing external agents (ClaudeAgent / CodexAgent) up to parity with native Agent capabilities: (1) SDK conversation history now persists to the database, so a session can resume on a different machine; (2) background execution, cancellation, and checkpoint-based step replay all land; (3) retries, token/cost metrics, compaction, structured output, and file attachments are added. No formal breaking changes, but \"one turn per session\" now returns a 409 up front instead of accepting a second turn and failing it later."
series:
  name: "AI Framework Changelog"
  order: 38
---

> 🌏 [中文版](/posts/daily/2026-10-12-framework-agno-3.1.3)

## Release Info

| Item | Value |
|---|---|
| Framework | Agno |
| Version | `v3.1.3` |
| Previous | `v3.1.2` |
| Released | 2026-10-12 |
| Release Notes | [GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.1.3) |
| GitHub | [agno-agi/agno](https://github.com/agno-agi/agno) |
| Stars | 42.6k |

## Why this release matters

Agno has wrapped the Claude Agent SDK and Codex as "external agents" for a while, but until now those wrappers were thin: once a run ended, it was gone — restart on a different machine and you couldn't pick it back up, there was no retry, no background execution, and no unified metrics. 3.1.3 closes almost all of that gap at once: SDK conversation history now mirrors into a new `agno_transcripts` table, and background execution, cancellation, checkpoint-based replay, retries, token/cost metrics, conversation compaction, structured output, and image attachments all land in the same release. In other words, `ClaudeAgent` and `CodexAgent` can now be treated as near first-class citizens alongside native `Agent`, rather than external agents that come with a feature discount. For teams already running Claude Code or Codex as production agents inside AgentOS, this means multi-replica deployment, retry-on-disconnect, and long-running task management are finally safe to rely on.

## What changed

- **Durable External Agent Sessions**: the Claude SDK session id is stored on the Agno session, and with a database that supports transcript storage (`PostgresDb`, `SqliteDb`, etc.), every transcript line mirrors into the new `agno_transcripts` table → a different replica picking up the same session restores conversation from the database instead of a local file, falling back to a fresh SDK session seeded with Agno history only when it can't be resumed
- **Background Runs & Cancellation**: `ClaudeAgent` / `CodexAgent` support `background=True`, resumable durable-queue run ids, and cancellation through `/agents/{id}/runs/{run_id}/cancel` → they share the same background-task and event-stream infrastructure as native agents, so a long-running task no longer has to hold an entire request open
- **Step Replay**: `ClaudeAgent.continue_run` accepts the same `continue_from` / `fork` / `input` arguments as native `Agent.continue_run`, with each tool result listed as a resumable checkpoint → replaying forks a new SDK transcript from that checkpoint; a finished run is never rewritten in place, and continuing it always produces a new sibling run
- **Retries for External Agents**: `retries`, `delay_between_retries`, and `exponential_backoff` match the defaults on native `Agent`, with a retry resuming the same run id and SDK session or Codex thread — but billing limits and permanent errors (auth, quota, context window) are never retried → tool-call results from failed attempts are kept exactly once, and streaming consumers get a `type: "retry"` event in between
- **Metrics / Compaction / Stored Events / Structured Output / Media**: every external-agent run can now report token/cache/cost metrics, resume from a database-backed compaction summary, persist events for later replay, return structured output via a Pydantic model or JSON Schema, and accept image or file attachments → capabilities that used to be exclusive to native `Agent` are now available to external agents in one go
- **Behavior change (not a formal breaking change)**: starting a second turn on a session while the first is still running now returns `SessionBusyError` (HTTP 409) immediately, instead of accepting the request and letting it fail later → callers need to check for 409 and queue a retry rather than assuming the request will always be accepted

## Breaking Changes

None formally in this release, but the semantic shift above — "one turn per session" — is worth flagging: concurrent requests that used to be accepted and then fail are now rejected outright.

## Migration Guide

Just upgrade — no code changes required:

```bash
pip install --upgrade agno==3.1.3
```

The new retry and background-execution options for external agents follow the same shape as native `Agent`:

```python
from agno.agent import ClaudeAgent

agent = ClaudeAgent(
    retries=3,
    delay_between_retries=2,
    exponential_backoff=True,
)

# Run in the background, then query or cancel by run_id later
run = agent.run(input="a long-running task...", background=True)
```

## How this compares to other frameworks

LangGraph and CrewAI treat external coding agents like Claude Code or Codex as "just another tool," or as a fully separate flow with a different API surface from their own native agents. This release continues Agno's usual approach: instead of building its own agent loop from scratch, it wraps already-mature SDKs so they share the same capabilities as native agents — background execution, retries, metrics, structured output. The cost is a compatibility layer that has to track two underlying execution models, but the payoff is that developers don't need a separate mental model just because an agent happens to run on the Claude SDK.

## Today's takeaway

I used to think wrapping an external SDK so it "looks like your own agent" was mostly an interface-unification problem. Reading through this release made it clear the real engineering effort is in porting reliability infrastructure that native agents already had — background execution, retries, checkpoint replay — onto an external SDK whose execution loop you don't fully control. A retry has to know which errors are safe to replay; a replay has to know how to insert a fork point into a transcript format that isn't yours. A unified API surface is just the visible result; the hard part is the compatibility engineering underneath it.

## References

- [Agno v3.1.3 — GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.1.3)
- [agno-agi/agno — GitHub](https://github.com/agno-agi/agno)
- [Agno v3.1.2 — previous framework update](/posts/daily/2026-10-10-framework-agno-3.1.2-en)
- [PR #10904: Durable External Agent Sessions](https://github.com/agno-agi/agno/pull/10904)
- [PR #10905: Background Runs & Cancellation for External Agents](https://github.com/agno-agi/agno/pull/10905)
- [PR #10917: Step Replay for ClaudeAgent](https://github.com/agno-agi/agno/pull/10917)
- [PR #10937: Retries for External Agents](https://github.com/agno-agi/agno/pull/10937)
- [PR #10958: One Turn Per Session (SessionBusyError)](https://github.com/agno-agi/agno/pull/10958)
