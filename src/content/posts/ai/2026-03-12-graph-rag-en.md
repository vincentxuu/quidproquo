---
title: "GraphRAG: Structuring Knowledge as a Graph for Relationship-Based Reasoning"
date: 2026-03-12
type: guide
category: ai
tags: [rag, graphrag, knowledge-graph, multi-hop, microsoft]
lang: en
tldr: "Vector search finds similarity; graph search traverses relationships. When a question requires reasoning across multiple entities — crag → route → sender → grade distribution — GraphRAG outperforms standard RAG."
description: "How GraphRAG works: knowledge graph construction, graph query patterns, comparison with standard RAG, and its potential applications in a climbing community context."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-12-graph-rag)

Standard RAG retrieves "semantically similar documents," but some questions don't need semantic similarity — they need **relationship traversal**.

"Which routes at Longdong have been sent by first-time outdoor climbers?" — answering this requires joining:
- Send records (who sent which route)
- User profiles (how many outdoor sessions they've had)
- Route attributes (grade, style)

Vector search can't navigate these connections. It can only surface "documents semantically related to beginner sends" — it has no way to walk the edges between entities.

GraphRAG searches over a knowledge graph, traversing relationships between entities. It's built exactly for this kind of multi-hop reasoning.

## Knowledge Graph Structure

A knowledge graph for a climbing platform might look like this:

```
[Region: Northern Taiwan]
    ↓ contains
[Area: Ruifang]
    ↓ contains
[Crag: Longdong]
    ↓ has_route
[Route: Longdong North Wall - Some Route]
    ↓ has_grade     ↓ has_type        ↓ completed_by
[Grade: 5.11a]  [Type: Sport]       [User: Alice]
                                          ↓ has_level
                                     [Level: Intermediate]
```

Each node is an entity; each edge is a relationship. Graph queries traverse edges and combine multiple conditions.

## Two Query Modes in GraphRAG

**Microsoft GraphRAG** (published 2024) proposes two query modes:

**Local Search**: start from a specific entity, expand along relationships, and answer questions about that entity.

```
Q: "Which routes at Longdong are suitable for intermediate climbers?"
→ Locate Crag: Longdong
→ Traverse has_route edges → retrieve all routes
→ Filter by grade in the intermediate range
→ Pull route descriptions → send to LLM to generate answer
```

**Global Search**: aggregate across the entire graph to answer "big picture" questions.

```
Q: "What are the most popular crags in Northern Taiwan?"
→ Aggregate all Crags under Region: Northern Taiwan
→ Count send records per Crag
→ Sort and take Top-K
→ Send to LLM to generate answer
```

## Building the Graph

There are two construction approaches:

**Manual definition**: define entities and relationships based on business logic, then populate from structured data (a database).

```typescript
// Build graph from database
const graph = new KnowledgeGraph();

for (const crag of crags) {
  graph.addNode({ id: crag.id, type: 'Crag', properties: crag });
  graph.addEdge({ from: crag.areaId, to: crag.id, relation: 'contains' });
}

for (const route of routes) {
  graph.addNode({ id: route.id, type: 'Route', properties: route });
  graph.addEdge({ from: route.cragId, to: route.id, relation: 'has_route' });
}
```

**LLM-based extraction**: extract entities and relationships from unstructured text. This is the approach Microsoft GraphRAG uses — pulling entities and relationships directly from documents.

For a climbing platform with a well-defined database schema, manual definition is more accurate and doesn't require inferring structure from raw text.

## Graph + Vector Hybrid

GraphRAG doesn't replace vector search — it complements it. A hybrid architecture:

```
Query
  ↓
[Query Classification]
  ├ Relational query  → [Graph search]         → Structured results → LLM generates
  ├ Semantic query    → [Vector search]         → Similar docs       → LLM generates
  └ Hybrid query      → [Graph + Vector search] → Combined results   → LLM generates
```

Graph search excels at "who sent what" and "which region does this crag belong to" — relational questions. Vector search excels at "find routes described similarly to X" — semantic questions.

## Potential in a Climbing Community

A few queries where GraphRAG would make a meaningful difference:

**Social recommendations**: "What routes are climbers at my level working on lately?"
- Graph query: find users at a similar grade → retrieve their recent sends → return routes

**Progression planning**: "I just sent a 5.10b at Longdong — what should I project next?"
- Graph query: find routes of similar style but slightly higher grade → factor in how other climbers progressed

**Nearby crag discovery**: "What other crags are near Longdong?"
- Graph query: find the Area containing Longdong → return other Crags in the same Area

These queries are difficult or impossible with vector search alone, but a few hops on a knowledge graph can resolve them cleanly.

## Engineering Cost

GraphRAG is significantly more complex to build and operate than standard RAG:
- Requires maintaining a graph database (Neo4j, or a D1-based simulation)
- Graph query languages (Cypher, Gremlin) have a learning curve
- Graph and vector indexes must stay in sync

In a Cloudflare Workers environment, there's no native graph database support. D1 can simulate a simple graph using an adjacency list, but complex graph traversals will hit performance limits.

## Bottom Line

GraphRAG addresses a fundamental blind spot of vector search: relationship reasoning. For domains with well-defined entity relationships — climbing, healthcare, legal — a knowledge graph can dramatically improve multi-hop query quality.

The tradeoff is a substantial increase in engineering complexity. For a climbing community platform, standard RAG is sufficient for now. GraphRAG is worth revisiting later, especially when recommendation systems and social graph queries become higher-priority needs.

---

## References

- [From Local to Global: A Graph RAG Approach to Query-Focused Summarization (2024)](https://arxiv.org/abs/2404.16130)
- [Microsoft GraphRAG - GitHub](https://github.com/microsoft/graphrag)
- [NobodyClimb System Architecture: Full-Stack Climbing Platform on Cloudflare](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture) (zh-TW only)
- [NobodyClimb AI Architecture: 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture) (zh-TW only)
