---
title: "Framework Update: Agno v3.2.1"
date: 2026-11-18
category: daily
type: digest
tags: [ai-agent, framework, daily, agno]
lang: en
description: "Agno v3.2.1 makes session compaction history and Company task files/notes readable through the API, alongside a batch of fixes to tools and the database layer"
tldr: "No breaking changes in Agno v3.2.1. Two new APIs worth noting: GET /sessions/{id}/compactions lets you query, for the first time, what memory compaction actually replaced; GET /company/tasks/{id}/files and /company/notes let external systems read Company output directly, without going through the chat interface."
series:
  name: "AI Framework Changelog"
  order: 68
---

> 🌏 [中文版](/posts/daily/2026-11-18-framework-agno-v3.2.1)

## Release Info

| Item | Value |
|---|---|
| Framework | Agno |
| Version | v3.2.1 |
| Previous version | v3.2.0 |
| Release date | 2026-11-17 |
| Release Notes | [v3.2.1](https://github.com/agno-agi/agno/releases/tag/v3.2.1) |
| GitHub | [agno-agi/agno](https://github.com/agno-agi/agno) |
| Stars | 43.2k |

## Why this release matters

The previous release (v3.2.0) pushed Agno's agent-to-agent protocol (A2A) to the official 1.0 spec. This one opens a hole in a different, long-standing black box: what actually happens to memory and output once an agent is running. When a session gets compacted, there was previously no way to know exactly which messages got replaced or how many tokens the compaction saved — you could only guess from logs. The new `GET /sessions/{session_id}/compactions` endpoint lists each compaction event for a session, newest first, with how many messages it replaced and the token count before and after. The other change in the same direction is that a Company task's files and shared notes can now be read directly via `GET /company/tasks/{task_id}/files` and `GET /company/notes`, instead of only being visible through the chat interface. Taken together, the throughline of this release is making agent-internal state auditable from the outside, rather than adding new agent capabilities per se.

## Key changes

- **Session Compactions API**: `GET /sessions/{session_id}/compactions` lists a session's compactions on `SqliteDb` and `PostgresDb`, newest first, with how many messages each replaced and the token count before and after → for the first time, you can query what memory compaction actually removed, instead of guessing why an agent "forgot" something
- **Company Files API**: a Task's files and the shared notes can now be read over the API with `GET /company/tasks/{task_id}/files` and `GET /company/notes`, each with a `/{path}` route to read one file → Company output is no longer locked behind the chat interface; external dashboards or audit tooling can pull file contents directly
- **Slack `default_role`**: a Slack member not in `users=` can now get the permissions of a managed role while still being recorded as themselves → fills a gap left by v3.2.0, which defaulted approval rights down to "only the person who started the run"
- **Batch of tool resilience fixes**: `LinearTools`, `DiscordTools` and `ModelsLabTools` now take a `timeout` (default 30s, 120s for ModelsLab); `ExaTools` gained `include_text`, `exclude_text`, `highlights` and `subpages`; `WebSearchTools`' `max_results=0` now actually returns no results; a `PostgresDb` instance that failed to create a table will retry on its next call once the cause is fixed → a batch of small, annoying rough edges cleared out in one pass instead of waiting for the next major release

## Breaking Changes

None in this release.

## Migration Guide

Upgrade directly — no code changes required:

```bash
pip install --upgrade agno==3.2.1
```

```python
# New: query a session's compaction history
# GET /sessions/{session_id}/compactions

# New: read a Company task's files or shared notes
# GET /company/tasks/{task_id}/files
# GET /company/notes
```

## Compared to other frameworks

Where memory goes once it's compacted away has long been a black box in most agent frameworks — LangGraph and Mastra treat memory as an external or bolted-on module, so tracking compaction details usually means adding your own logging at the application layer. Agno went the other way here, making compaction history a queryable API built into `AgentOS` itself, consistent with its general pattern of pulling platform capabilities (metrics, A2A task state) into the framework rather than leaving them for developers to build externally.

## Today's takeaway

I used to think session compaction was purely an internal token-saving optimization. Reading this release made it clear that without a queryable compaction history, developers genuinely couldn't answer "did the agent forget this because it got summarized away?" with any certainty — only guess. Turning compaction into a queryable API converts a long-standing black box into auditable data.

## References

- [Agno v3.2.1 Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.2.1)
- [agno-agi/agno on GitHub](https://github.com/agno-agi/agno)
- [Full Changelog: v3.2.0...v3.2.1](https://github.com/agno-agi/agno/compare/v3.2.0...v3.2.1)
- [Company File Tree cookbook example](https://github.com/agno-agi/agno/blob/main/cookbook/05_agent_os/30_company/16_company_file_tree.py)
- [Framework Update: Pydantic AI v2.69.0](/posts/daily/2026-11-18-framework-pydantic-ai-v2.69.0-en)
