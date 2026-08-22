---
title: "Zep Complete Guide: Temporal Knowledge Graphs for Agent Memory"
date: 2026-08-22
category: ai
type: deep-dive
tags: [zep, graphiti, memory, ai-agent, knowledge-graph, temporal-data]
lang: en
tldr: "Zep does not merely vectorize chat history. It turns episodes into entities and facts with validity time, allowing new information to invalidate an old relationship without erasing history. Graphiti is the open-source framework; Zep adds managed scale and governance."
description: "A guide to Zep, Graphiti, bi-temporal graphs, episode ingestion, hybrid retrieval, deployment choices, and limitations."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-zep-agent-memory)

[Zep](https://help.getzep.com/graphiti/getting-started/overview) is an agent-memory service centered on temporal knowledge graphs. It cares not only that “Kendra likes Adidas,” but when the fact became valid, when later evidence invalidated it, and which interaction produced it.

That differs from chunking chat and applying semantic search. A temporal graph makes changing entities, relationships, and facts first-class; plain retrieval usually returns similar passages and leaves conflict resolution to the model.

## Zep and Graphiti are separate layers

**Graphiti** is the open-source temporal-graph framework. It handles entity and edge extraction, a bi-temporal model, fact invalidation, and hybrid vector, BM25, and graph retrieval over pluggable graph stores.

**Zep** is the managed service for users, threads, governance, multitenancy, and large collections of context graphs. Open-source Graphiti does not imply that the complete Zep service is open source.

## Episodes become facts that can expire

```text
chat / JSON / business event
          │
          ▼
       episode
          │ extract + resolve entities
          ▼
entity nodes ── fact edges ── entity nodes
                   │
        valid_at / invalid_at / provenance
                   │
          hybrid graph search
```

An episode is both input and provenance. New evidence can invalidate an old edge without deleting it, which fits CRM status, subscriptions, employment, and evolving preferences.

```python
from graphiti_core import Graphiti

graphiti = Graphiti(neo4j_uri, neo4j_user, neo4j_password)
await graphiti.build_indices_and_constraints()
results = await graphiti.search("Where does the user work now?")
for edge in results:
    print(edge.fact, edge.valid_at, edge.invalid_at)
```

Stable document libraries may not benefit enough to justify temporal extraction.

## Retrieval is more than vector similarity

Graphiti can fuse semantic similarity, BM25, and graph structure and return edges, nodes, or episodes. Zep's high-level `memory.get()` assembles a session-relevant context string, while `graph.search()` exposes lower-level graph results for applications that control ranking themselves.

## Ingestion carries the operational cost

Graphiti needs a graph database, LLM, and embedding provider. Episode ingestion performs extraction, entity resolution, and relationship updates, adding model calls, rate limits, retries, and failure modes beyond one embedding call.

Entity resolution must be evaluated directly. Namesakes may merge, aliases may split one company into several nodes, and negation may become a positive fact. A temporal model can represent conflict; it cannot guarantee correct extraction.

## Fit

Use Zep or Graphiti when state changes over time, queries ask “now” versus “then,” relationships matter more than passages, and the team can evaluate temporal and entity correctness. Prefer a smaller Mem0 layer for a few stable preferences, Cognee for general document-to-graph pipelines, or Letta for an agent runtime that edits its own in-context memory.

## A minimum launch test

Add “A works at Company One,” then a later “A moved to Company Two.” Query current employer, former employer, and transition time. Require the old edge to carry `invalid_at`, the new one the correct `valid_at`, and both to retain episode provenance. Then introduce a namesake to test entity resolution.

## References

- [Graphiti Overview](https://help.getzep.com/graphiti/getting-started/overview)
- [Graphiti Quick Start](https://help.getzep.com/graphiti/getting-started/quick-start)
- [Zep vs Graphiti](https://help.getzep.com/zep-vs-graphiti)
- [Zep Key Concepts](https://help.getzep.com/v2/concepts)
- [Zep: A Temporal Knowledge Graph Architecture for Agent Memory](https://arxiv.org/abs/2501.13956)
