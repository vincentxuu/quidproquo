---
title: "Mem0 Complete Guide: Controlled Long-Term Memory for AI Agents"
date: 2026-08-22
category: ai
type: deep-dive
tags: [mem0, memory, ai-agent, personalization, vector-database]
lang: en
tldr: "Mem0 sits between an agent and storage: it extracts durable facts from interactions, scopes them by user, agent, or run, and searches them before a later generation. Its appeal is a small API; its risks are extraction errors, stale memories, and authorization boundaries."
description: "A practical guide to Mem0's extraction, scoping, retrieval, deletion, open-source and hosted variants, limitations, and fit."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-mem0-agent-memory)

[Mem0](https://docs.mem0.ai/platform/overview) is an external memory layer for AI applications. It does not run the agent, nor does it merely dump full transcripts into a vector database. It turns interactions into shorter, searchable, deletable memories and retrieves relevant items for later requests.

For the distinction between episodic, semantic, and procedural memory, start with [AI Agent Memory and Personalization](/posts/ai/2026-03-12-memory-personalization-en). This guide focuses on Mem0's own boundary.

## The write path is not transcript storage

```text
conversation / event
        │
        ▼
  fact extraction
        │
        ├── scope: user_id / agent_id / run_id
        ├── metadata
        ▼
 vector-backed memory store
        │ semantic / hybrid search
        ▼
 relevant memories → prompt → model response
```

`add` accepts text or message arrays. The layer extracts reusable facts such as “the user is vegetarian” instead of making every request reread the whole conversation. Every search needs a trusted identity scope; otherwise personalization becomes cross-user disclosure.

```python
from mem0 import MemoryClient

memory = MemoryClient(api_key="your-api-key")
memory.add(
    [{"role": "user", "content": "I am vegetarian and allergic to nuts."}],
    user_id="user-123",
)
result = memory.search(
    "What dietary restrictions does the user have?",
    filters={"user_id": "user-123"},
)
```

This uses the current Platform v2 filter shape. Hosted and open-source APIs are not identical, so older examples that put `user_id` at the top level of `search()` may hit a breaking change.

## Open source and Platform are different paths

**Mem0 Open Source** runs extraction and retrieval in your application process while you configure the LLM, embeddings, and vector store. It fits data-residency and backend-control requirements, but you operate upgrades, databases, monitoring, and deletion propagation.

**Mem0 Platform** supplies a hosted API, workspaces, advanced search, and governance. It reduces setup while adding another data processor. Feature parity is not guaranteed: the official migration guide notes that Platform does not expose the same `update()` path as OSS and may require delete plus add.

The architecture itself has changed. The current OSS memory algorithm uses ADD-only extraction, multi-signal retrieval, and entity linking while removing its former graph-store configuration. Lock the documentation version during evaluation; old graph-memory descriptions, current Platform, and current OSS are not one product surface.

## What Mem0 does and does not solve

Mem0 is a good fit for preferences, relationships, confirmed project facts, and interaction summaries that remain valuable across sessions. It packages extraction, scoping, search, history, and CRUD.

It cannot guarantee that an extracted fact is true, that a new memory correctly supersedes an old one, that retrieved memory is appropriate now, or that a client-supplied `user_id` is trustworthy. Preserve source events and extraction versions, require confirmation for sensitive categories, and test account deletion across memory, vectors, event history, and backups.

## Where the alternatives differ

- Choose Mem0 for a small memory API attached to an existing agent.
- Choose Zep/Graphiti when fact validity over time is central.
- Choose Cognee for document-to-knowledge-graph pipelines with replaceable stores.
- Choose Letta when you want a stateful agent runtime that manages editable in-context memory.

The decision is not a feature-count ranking. It is whether you need an API layer, temporal graph, knowledge pipeline, or entire agent runtime.

## A minimum launch test

Write three conflicting preferences for one test user and query after every change. Inspect whether stale facts remain, whether results retain time and provenance, and whether deletion removes them from search. Repeat under another `user_id` and require an empty result.

## References

- [Mem0 Platform Overview](https://docs.mem0.ai/platform/overview)
- [Mem0 Platform Quickstart](https://docs.mem0.ai/platform/quickstart)
- [Mem0 OSS REST API Server](https://docs.mem0.ai/open-source/features/rest-api)
- [Mem0 OSS New Memory Algorithm Migration](https://docs.mem0.ai/platform/features/graph-memory)
- [Mem0 OSS to Platform Migration](https://docs.mem0.ai/migration/oss-to-platform)
