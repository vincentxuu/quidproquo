---
title: "Framework Update: Agno v3.1.8"
date: 2026-10-22
category: daily
type: digest
tags: [ai-agent, framework, daily, agno]
lang: en
description: "Agno v3.1.8 adds PostgresCheckpointStore so sandbox checkpoints can be shared across replicas, while tightening the default checkpoint retention to 3"
tldr: "Three things in Agno v3.1.8: (1) `PostgresCheckpointStore` lets sandbox checkpoints live in Postgres, so multi-replica deployments can restore a session without S3 or a shared filesystem; (2) a behavior change: sandboxes now keep only the 3 newest checkpoints per session by default, set `retain_checkpoints=None` to keep them all; (3) `Claude()` now defaults to `claude-sonnet-5-5`, replacing the soon-to-retire `claude-sonnet-4-5-20250929`."
series:
  name: "AI Framework Changelog"
  order: 49
---

> 🌏 [中文版](/posts/daily/2026-10-22-framework-agno-3.1.8)

## Release Info

| Item | Value |
|---|---|
| Framework | Agno |
| Version | v3.1.8 |
| Previous | v3.1.7 |
| Released | 2026-10-21 |
| Release Notes | [v3.1.8](https://github.com/agno-agi/agno/releases/tag/v3.1.8) |
| GitHub | [agno-agi/agno](https://github.com/agno-agi/agno) |
| Stars | 42.9k |

## Why this version matters

Agno's sandbox checkpoints used to live only on a single machine or a shared filesystem, which made it hard for a multi-replica AgentOS deployment to restore another replica's session. This release adds `PostgresCheckpointStore`, writing checkpoints to the database in chunks, transactionally, deduplicated by SHA-256 and verified on read — turning "can a session survive across replicas" from an architectural limit into a configuration choice. The release also changes a default that's easy to overlook but has a real blast radius: sandbox checkpoints now keep only the 3 newest by default, and older ones get cleaned up — something any team that relies on long-term checkpoint retention for debugging or audits will hit immediately.

## Key changes

- **`PostgresCheckpointStore`**: sandbox checkpoints can now be written directly to PostgreSQL, chunked, transactional, SHA-256 deduplicated and verified on read → multi-replica deployments no longer need S3 or a shared filesystem to restore a session; this is opt-in and doesn't change existing default behavior
- **Framework managers as Company Routine executors**: Company Routines can now assign the internal Product Manager or OS Manager as an executor through declarations, the Routine API, or human-chat configuration → reserved manager IDs resolve only from the owning AgentOS and can't be overridden by custom components
- **Sandbox checkpoint retention (behavior change)**: sandboxes now keep only the 3 newest checkpoints per session by default; set `retain_checkpoints=None` to restore unlimited retention → unpublished or superseded checkpoints are cleaned up once the run outcome is safely stored
- **Claude default model upgrade**: `Claude()` now defaults to `claude-sonnet-5-5`, replacing the soon-to-retire `claude-sonnet-4-5-20250929`; newer Claude models that reject non-default `temperature`/`top_p`/`top_k` now warn instead of erroring → applied consistently across the Anthropic, Bedrock, Foundry, and Vertex providers

## Breaking Changes

- Checkpoint retention is tightened: only the 3 newest are kept, and opening a checkpoint from an older run can now raise `CheckpointObjectNotFound`
  - Affected: any deployment that relies on retaining every checkpoint long-term for debugging, auditing, or replay needs to explicitly set `retain_checkpoints=None` to keep the old behavior
- A durable-queue sandbox still using the host-local default checkpoint store now fails at AgentOS **startup**, instead of only on the first submission
  - Affected: multi-replica deployments that haven't switched to `PostgresCheckpointStore` or `S3CheckpointStore` will fail to start after upgrading, and need a shared checkpoint store in place first

## Migration guide

### Upgrading from 3.1.7 to 3.1.8

```bash
pip install --upgrade agno==3.1.8
```

```python
# Keep the old "retain every checkpoint" behavior explicitly
sandbox = Sandbox(..., retain_checkpoints=None)

# Multi-replica deployments must switch to a shared checkpoint store,
# or startup will fail
checkpoint_store = PostgresCheckpointStore(db_url="postgresql://...")
```

## Comparison with other frameworks

Pydantic AI shipped `v2.59.0` the same day with `DaytonaSandbox`, while Agno made its existing sandbox's checkpoint storage shareable across replicas — both frameworks are filling in the same gap: how an agent's execution environment scales safely across more than one machine. Sandboxed execution has clearly moved from an experimental feature in one framework to shared infrastructure this whole category of agent frameworks is now building out.

## Takeaway

I used to think checkpoint retention policy was just a storage-size tradeoff. Seeing it shipped together with a hard startup check on the checkpoint store configuration made it clear: multi-replica correctness problems often need to be caught by a startup failure, not just a line in the docs, to actually get stopped before production.

## References

- [Agno v3.1.8 Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.1.8)
- [agno-agi/agno on GitHub](https://github.com/agno-agi/agno)
