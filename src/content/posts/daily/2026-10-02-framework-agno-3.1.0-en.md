---
title: "Framework Update: Agno v3.1.0"
date: 2026-10-02
category: daily
type: digest
tags: [ai-agent, framework, daily, agno]
lang: en
description: "Agno 3.1 folds RBAC authorization and a filesystem into AgentOS core, turns MCP's bundled default tools into an opt-in, and requires a manual migration for existing filesystem tables"
tldr: "Three things in Agno v3.1.0: (1) a new `agno.os.authz` package gives AgentOS a native role store, scope policy, audit log, and user directory, with pluggable native and `fga` authorization engines; (2) a new `agno.fs`/`DbFileSystem` adds dedicated `/filesystem` routes to AgentOS, but existing `agno_fs` tables must be migrated offline or they raise `SchemaOutdatedError`; (3) Breaking: `MCPConfig`'s bundled default tools and lifecycle tools (`continue_run`/`cancel_run`) switch from automatically included to explicit opt-in."
series:
  name: "AI Framework Changelog"
  order: 30
---

> 🌏 [中文版](/posts/daily/2026-10-02-framework-agno-3.1.0)

## Release Info

| Item | Value |
|---|---|
| Framework | Agno |
| Version | `v3.1.0` |
| Previous | `v3.0.10` |
| Released | 2026-10-01 |
| Release Notes | [GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.1.0) |
| GitHub | [agno-agi/agno](https://github.com/agno-agi/agno) |
| Stars | 42.5k |

## Why this release matters

Agno's pitch has always been "batteries included": code execution, public MCP endpoints, and now user management and a filesystem, all shipped as built-in AgentOS components. 3.1 addresses the thing multi-tenant deployments actually get stuck on — who can call which agent, and who can read or write which files. The new `agno.os.authz` package pulls role storage, scope policy, and audit logging directly into the framework, so you don't need to bolt on your own authorization middleware; `agno.fs` gives agents a native file-management interface instead of wiring up S3 or a self-hosted file service. But this release also continues the same tightening-of-defaults direction as 3.0.10: MCP's bundled tools no longer ship automatically just because you configured the endpoint — you now have to list which ones you want. Existing filesystem tables are rejected outright by the new version, forcing a manual migration instead of silently continuing on the wrong schema.

## What changed

- **User management / RBAC (`agno.os.authz`)**: a new package adding a role store, scope policy, audit log, user directory, and an admin router, with pluggable native and fine-grained `fga` authorization engines → multi-tenant AgentOS deployments finally get a framework-native authorization layer, instead of bolting on Auth0 or hand-rolling RBAC middleware
- **AgentOS Filesystem (`agno.fs`/`DbFileSystem`)**: adds `DbFileSystem` with dedicated `/filesystem` routes for listing, reading, and managing files, backed by an `agno_fs` table → agents that need file I/O no longer have to integrate S3 or run their own file service; they use AgentOS's built-in database-backed filesystem directly
- **MCP config/auth updates**: refreshed MCP server configuration and built-in MCP authorization handling
- **`AIMLAPITools`**: a new toolkit for image, video, speech, and transcription via the AI/ML API → another provider-agnostic path for multimodal tooling

## Breaking Changes

- Filesystem table re-key (`agno_fs`):
  - v3.1 re-keys the table from its old structure to `(namespace, user_id, path)`, where `user_id` is empty (`""`) for the shared/no-user partition
  - A table built by an earlier release is now refused outright with `SchemaOutdatedError` — the re-key never runs automatically
  - Affected: only deployments actually using `DbFileSystem`; you must stop the application and run the matching migration script for your database before upgrading (this table is managed by `DbFileSystem`'s own schema and is deliberately excluded from `MigrationManager`)
- `MCPConfig`'s bundled default and lifecycle tools switch to opt-in:
  - Before: setting `tools=[...]` also automatically served the built-in `default_tools` and lifecycle tools (`continue_run`/`cancel_run`)
  - After: `default_tools` and `lifecycle_tools` both default to `False`; `tools=[...]` now publishes exactly the tools you list
  - Affected: MCP deployments relying on the old "configuring tools also gets you the built-in ones" behavior — those tools will simply disappear after upgrading

## Migration Guide

### Upgrading from 3.0.x to 3.1.0

```bash
pip install --upgrade agno==3.1.0
```

```bash
# Only needed for deployments using DbFileSystem: stop the app, then run
# the script matching your database
python libs/agno/migrations/migrate_filesystem_postgres.py   # PostgreSQL
python libs/agno/migrations/migrate_filesystem_sqlite.py     # SQLite
```

```python
# Before (3.0.x) — configuring tools also bundled in the built-in defaults and lifecycle tools
mcp_config = MCPConfig(tools=["my_custom_tool"])

# After (3.1.0) — opt back into the old behavior explicitly
mcp_config = MCPConfig(
    tools=["my_custom_tool"],
    default_tools=True,
    lifecycle_tools=True,
)
```

Everything else in this release (HITL resume duplicating history, `OpenAIResponses` losing its chained response, zero-value handling in CSV/shell tools, and similar fixes) is a bug fix that needs no code changes on upgrade.

## How this compares to other frameworks

Turning RBAC and a filesystem into native framework components widens Agno's gap with LangGraph and CrewAI, where authorization and storage are still mostly left to the integrator to wire up externally. But that "batteries included" approach has a recurring cost: once again, this release leads with tightening security and permission boundaries (MCP tools opt-in, mandatory filesystem migration) rather than stacking new features — the same pattern as 3.0.10 tightening `run_shell`'s default. Haystack 3.3, released the same day, took the opposite route: no new authorization layer, just security and correctness fixes (an `anyio` CVE) on existing pipeline components. That split reflects two different takes on "production-ready": Agno is building out platform-level governance, Haystack is hardening the correctness and performance of what it already has.

## Today's takeaway

I used to assume a failed schema migration usually meant "quietly keeps running on the wrong structure." Seeing Agno's new version flatly refuse to read or write an old filesystem table with `SchemaOutdatedError` made it clear that refusing to start is actually the safer design — rather than letting a mismatched key structure silently corrupt data, it's better to force a hard error and make the operator run the migration script, instead of leaving behind a system that looks like it's working while the data underneath has already drifted out of alignment.

## References

- [Agno v3.1.0 — GitHub Release](https://github.com/agno-agi/agno/releases/tag/v3.1.0)
- [agno-agi/agno — GitHub](https://github.com/agno-agi/agno)
- [Agno v3.0.10 — previous framework update](/en/posts/daily/2026-09-17-framework-agno-3.0.10-en)
- [PR #10530: feat v3.1 (RBAC authz, filesystem, filesystem table migration)](https://github.com/agno-agi/agno/pull/10530)
- [PR #10499: Make MCPConfig default and lifecycle tools opt-in](https://github.com/agno-agi/agno/pull/10499)
