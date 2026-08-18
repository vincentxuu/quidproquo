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
series:
  name: "The RAG Techniques Compendium"
  order: 25
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

## Query Modes in GraphRAG

**Microsoft GraphRAG** (paper published April 2024) is best known for two query modes, Local Search and Global Search:

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

The official query engine has since grown two more: **DRIFT Search** (pulls community information into the starting point of a local search, then expands the query into follow-up questions) and **Basic Search** (plain vector RAG, bundled in so you can compare against the graph modes). For which one fits your question types and how to tune them, go to the [official Query Engine docs](https://microsoft.github.io/graphrag/query/overview/) rather than a blog post's snapshot.

## The State of microsoft/graphrag

One fact worth knowing before you pick this up: **the `microsoft/graphrag` repo is in maintenance mode.** The README says so plainly — since the first release in July 2024 frontier model capabilities have changed dramatically, so the project is "largely in maintenance mode," won't accept new PRs or implement new features, and will only get bug fixes and dependency updates (particularly for CVEs). It also states the code is a research demonstration, not an officially supported Microsoft offering.

If you were planning to build production infrastructure on it, plan accordingly: it works, but it isn't moving forward.

The other frequently cited follow-up is **LazyGraphRAG**. Microsoft Research's November 2024 blog post claims indexing costs identical to plain vector RAG and 0.1% of full GraphRAG's, plus answer quality comparable to GraphRAG Global Search on global queries at "more than 700 times lower query cost." The trick is skipping up-front LLM summarization and deferring LLM calls to query time.

Two caveats: **all of those numbers come from that blog post — there is no peer-reviewed paper — and LazyGraphRAG was never open-sourced in `microsoft/graphrag`** (community threads asking for a release timeline went unanswered, and the repo has since entered maintenance mode). Treat it as a direction of thinking, not something you can install.

## Do Graphs Actually Win?

Worth putting the counter-evidence on the table. GraphRAG-Bench (*When to use Graphs in RAG*, 2025) opens by noting that despite its conceptual promise, "recent studies report that GraphRAG frequently underperforms vanilla RAG on many real-world tasks" — which is exactly why they built a graded benchmark spanning fact retrieval, complex reasoning, contextual summarization, and creative generation, to pin down **the conditions under which graph structure actually helps**.

So "we have entity relationships, therefore we should use a graph" is not a safe default. Before committing, confirm your question shapes really are multi-hop relational reasoning rather than semantic retrieval wearing a different hat — the latter is what vector search is for, and it's far cheaper.

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

GraphRAG addresses one blind spot of vector search: relationship reasoning. For domains with well-defined entity relationships where the questions genuinely are multi-hop — climbing, healthcare, legal — a knowledge graph *can* improve query quality substantially. That's *can*, not *will*: GraphRAG-Bench's headline finding is that it frequently loses to vanilla RAG.

The cost, by contrast, is certain: a substantial increase in engineering complexity, on top of a reference implementation that has stopped evolving. For a climbing community platform, standard RAG is sufficient for now. GraphRAG is worth revisiting later, especially when recommendation systems and social graph queries become higher-priority needs — and when you do revisit, run your own multi-hop queries through both and decide on measurements, not intuition.

---

## References

- [From Local to Global: A Graph RAG Approach to Query-Focused Summarization (2024)](https://arxiv.org/abs/2404.16130) — Edge et al., the original GraphRAG paper
- [Microsoft GraphRAG - GitHub](https://github.com/microsoft/graphrag) — the official implementation; the README marks it as maintenance mode
- [GraphRAG Query Engine docs](https://microsoft.github.io/graphrag/query/overview/) — Local / Global / DRIFT / Basic search modes
- [LazyGraphRAG: Setting a new standard for quality and cost](https://www.microsoft.com/en-us/research/blog/lazygraphrag-setting-a-new-standard-for-quality-and-cost/) — Microsoft Research blog, source of the cost claims (not peer reviewed; code not released)
- [When to use Graphs in RAG: A Comprehensive Analysis for Graph Retrieval-Augmented Generation](https://arxiv.org/abs/2506.05690) — Zhang et al., GraphRAG-Bench; finds GraphRAG often underperforms vanilla RAG
- [NobodyClimb System Architecture: Full-Stack Climbing Platform on Cloudflare](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture-en) (zh-TW only)
- [NobodyClimb AI Architecture: 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture-en) (zh-TW only)
