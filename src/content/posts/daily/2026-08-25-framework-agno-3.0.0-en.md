---
title: "Framework Update | Agno 3.0.0"
date: 2026-08-25
category: daily
tags: [ai-agent, framework, daily, agno]
lang: en
description: "Agno 3.0 is a database-breaking major release: runs move from session JSON blobs into dedicated typed tables, cutting write amplification from O(N²) to O(N) — but you must run migration before upgrading"
tldr: "Agno 3.0 in three points: (1) Runs table restructuring — runs move from session JSON blobs into a dedicated agno_runs table, reducing write amplification from O(N²) to O(N); you must run MigrationManager before upgrading or you'll hit MigrationRequiredError; (2) New Tool Result Offloading and Media Offloading — tool results over 16,000 characters and images/audio/video get moved to AgentFS or S3, leaving only a slim envelope in messages; (3) Breaking changes are extensive — multiple Agent parameter renames, reasoning=True removed, DuckDuckGoTools methods renamed, etc. This is an upgrade that requires going through the migration guide item by item."
series:
  name: "AI Framework Changelog"
  order: 5
---

> 🌏 [中文版](/posts/daily/2026-08-25-framework-agno-3.0.0)

## Version Info

| Item | Value |
|---|---|
| Framework | Agno |
| Version | v3.0.0 |
| Previous | v2.9.0 |
| Release Date | 2026-08-24 |
| Release Notes | [GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.0.0) |
| GitHub | [agno-agi/agno](https://github.com/agno-agi/agno) |
| Stars | 41.9k |

## Why This Release Matters

Agno 3.0's release note opens with an explicit warning: "this is a breaking release — you must run database migration before serving v3.0 in production." This is not a version you can just `pip install --upgrade` and move on. The core change moves Agent execution records (runs) from a JSON blob stuffed inside sessions into a dedicated typed table `agno_runs`, cutting write amplification from O(N²) to O(N). For production Agents that run long sessions with many accumulated run records, this is a structural improvement in both performance and maintainability — but the cost is that every existing deployment must run migration first, and old databases will throw `MigrationRequiredError` after the upgrade with no silent fallback.

## Key Changes

- **Runs Table Restructuring**: runs move from session JSON blobs into a dedicated `agno_runs` table with typed columns (session_id, run_type, agent_id, team_id, workflow_id, user_id, parent_run_id, status, run_index) → write amplification drops from O(N²) to O(N), plus new APIs: `db.get_run()`, `db.get_runs(session_id=..., status=..., limit=..., page=...)`, `db.upsert_run()`, `db.delete_run()`
- **Tool Result Offloading**: tool results exceeding 16,000 characters get moved to AgentFS, with only a slim envelope (preview, size, result ID) kept in messages → dramatically reduces context window bloat from tool outputs in long conversations
- **Media Offloading**: with `media_storage=S3MediaStorage(bucket=...)`, images/audio/video/files upload to a storage backend instead of being stuffed into message bodies; the official example shows a 113 KB JPEG going from ~151,000 base64-encoded characters down to 2,897 → directly impacts token cost and latency in long conversations
- **CodeMode**: adds a programmable IPython kernel where models can write Python and call tools' awaitable handles across sessions → lets models compose tool calls via code instead of round-tripping through tool-calling JSON every time
- **AgentOS Durable Background Execution**: `AgentOS(queue=QueueConfig(durable=True))` gives runs crash recovery with built-in bounded concurrency (default 32), cancellation, and idempotent deduplication → critical reliability improvement for long-running Agent workloads that may restart mid-execution
- **Per-User Isolation expanded**: isolation scope now covers metrics, schedules, evals, knowledge, components, entity memory, and 17 vector databases

## Breaking Changes

- **Database migration required**: `db.get_runs()` and related APIs throw `MigrationRequiredError` / `SchemaMismatchError` on old schemas; `db.get_runs()` without `limit` throws `ValueError`
  - Impact: all existing production deployments must run migration before upgrading
- **AgentOS JWT config changed**: `secret_key` removed, replaced by `verification_keys` list; MCP config consolidated into a single `mcp_server` parameter
  - Impact: deployments using AgentOS JWT auth or MCP integration
- **Agent parameter renames**:
  - `enable_user_memories` → `update_memory_on_run`
  - `search_session_history` → `search_past_sessions`
  - `num_history_sessions` → `num_past_sessions_to_search`
  - Impact: all Agent definitions that set these parameters directly
- **Feature removals**:
  - `reasoning=True` → use `reasoning_model` instead
  - Culture feature removed entirely
  - `MultiMCPTools` deleted
  - Impact: projects using these parameters/features need refactoring
- **Tool API changes**:
  - `DuckDuckGoTools.duckduckgo_search` → `web_search`
  - Google tools import path changed to `agno.tools.google.*`
  - `SQLTools` `enable_*` parameters removed
  - Flat HITL kwargs replaced by `HumanReview` object
  - Impact: integration code using these tools
- **Knowledge API**: `Knowledge.add_content` removed, use `insert()` / `ainsert()` instead; pre-v3 vector tables with `user_id` throw `ValueError`
- **Evals**: `eval_id` uniformly renamed to `run_id`

## Migration Guide

### Upgrading from 2.x to 3.0.0

```bash
pip install --upgrade agno==3.0.0
```

```python
import asyncio
from agno.db.migrations.manager import MigrationManager

# Step 1: Non-destructively copy old runs into the new table (supports 12 sync + 4 async backends)
asyncio.run(MigrationManager(db).up())

# Step 2: Verify the new table has data
assert len(db.get_runs(limit=5)) > 0

# Step 3: Only after confirming, clean up the legacy runs column
db.cleanup_legacy_runs_column(force=True)
```

For AgentOS deployments, you can also call `POST /databases/all/migrate` to trigger the same migration flow.

Agent parameter renames require checking your code one by one:

```python
# Old (2.x)
agent = Agent(
    enable_user_memories=True,
    search_session_history=True,
    num_history_sessions=5,
)

# New (3.0.0)
agent = Agent(
    update_memory_on_run=True,
    search_past_sessions=True,
    num_past_sessions_to_search=5,
)
```

## Cross-Framework Observations

Moving large tool results and media out of message bodies in long conversations addresses the same class of problem — context window bloat — that LangGraph 1.5 tackles by folding memory into its native checkpoint mechanism, just from a different angle: LangGraph optimizes "how memory is accessed," while Agno 3.0 optimizes "how to keep oversized content out of context." The runs table move from JSON blobs to typed columns with O(N) write amplification also echoes what Mastra has been doing in recent versions with workflow persistence and concurrency safety — both frameworks are treating "Agent execution state" as a first-class citizen that deserves proper database design, rather than dumping a JSON blob and calling it done.

## Takeaway

I used to assume that breaking releases in Agent frameworks were mostly surface-level adjustments like API renames. This time I noticed that Agno 3.0 changes the underlying data model — splitting runs out of session JSON blobs into a dedicated table, dropping write complexity from O(N²) to O(N). The lesson: when a framework's version number jumps from 2.x to 3.0, the first thing to check isn't what new features were added, but whether the storage model changed — because that's what actually determines whether existing deployments can upgrade in place.

## References

- [Agno v3.0.0 — GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.0.0)
- [agno-agi/agno — GitHub](https://github.com/agno-agi/agno)
- [Agno v2.9.0 — GitHub Release (previous stable)](https://github.com/agno-agi/agno/releases/tag/v2.9.0)
