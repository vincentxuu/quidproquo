---
title: "Multi-Query Expansion: Search One Question from Multiple Angles"
date: 2026-03-12
type: guide
category: ai
tags: [rag, multi-query, query-expansion, recall, rrf]
lang: en
tldr: "A single vector search on a complex query often misses relevant documents. Let the LLM rewrite the query into 3-5 sub-queries, run them in parallel, and recall improves significantly."
description: "The design rationale behind Multi-Query Expansion: use an LLM to rewrite a query from multiple angles, search each independently, then merge results with RRF to fix the recall problem of single-path retrieval."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-12-multi-query-expansion)

Vector search results are constrained by how a query is phrased. The same underlying need expressed with different wording can produce embeddings that are far apart in vector space, causing relevant documents to be missed.

Take the query "beginner-friendly routes at Longdong." Vector search only explores from that exact angle — but the relevant documents in your database might use phrases like "Longdong intro routes," "Longdong 5.8–5.9," "Longdong newbie-friendly," or "Longdong dense protection." A single query vector only reaches a few of these directions; the rest get left behind.

Multi-Query Expansion takes a straightforward approach: **use an LLM to rewrite the original query into several sub-queries from different angles, search each one independently, then merge the results**.

## Rewriting Strategy

```
Original query: "Beginner-friendly route recommendations at Longdong"

Rewritten as:
  1. "Longdong sport climbing routes graded 5.8 to 5.9"          ← quantified difficulty
  2. "Longdong routes with dense protection, newbie-friendly"     ← safety characteristics
  3. "Longdong entry-level routes for first-time outdoor climbing" ← contextual description
  4. "龍洞 beginner-friendly sport climbing routes"               ← bilingual variant
```

Each sub-query starts from a different semantic angle, covering the various ways relevant documents might be described in the database.

## Prompt Design

```
You are a climbing knowledge assistant. Given the following query, generate 3-5 related sub-queries from different angles.
The sub-queries should use varied vocabulary and phrasing to improve search recall.
Output one sub-query per line. Output only the sub-queries, no additional explanation.

Original query: {query}
```

Output parsing: split by line, filter empty lines, cap at 5 sub-queries (to avoid over-expansion and excessive latency).

## Execution Flow

```
Original Query
     ↓
[LLM: Multi-Query Generator]
     ↓
[Q1, Q2, Q3, Q4] ← list of sub-queries
     ↓
[Embedding Q1] [Embedding Q2] [Embedding Q3] [Embedding Q4]  ← parallel
     ↓              ↓              ↓              ↓
[Search Q1]    [Search Q2]    [Search Q3]    [Search Q4]    ← parallel
     ↓              ↓              ↓              ↓
                  [RRF Fusion]
                     ↓
               Merged Candidates
```

Embedding and search both run in parallel. The LLM rewriting step is sequential (it has to complete before the rest can proceed), but it executes within the overall parallel pipeline framework — running concurrently with the HyDE LLM call.

## When It Triggers

Like HyDE, this only activates when `queryType === 'complex'`. Simple queries have clear semantics and don't need extra expansion; SQL queries take a different path entirely.

Characteristics of complex queries:
- Multiple conditions combined (difficulty + location + type)
- Semantically vague or ambiguous ("fun routes")
- Requires comparison or recommendation ("best for xxx")

## Comparison with HyDE

| | HyDE | Multi-Query |
|---|------|-------------|
| Rewriting strategy | Generate a hypothetical answer document | Generate multiple query angles |
| Semantic coverage | Bridge query → answer language patterns | Multi-dimensional expression of the same need |
| Best suited for | Large gap between query and document language style | Needs that can be described from multiple dimensions |
| Fusion method | RRF with original query results | RRF across multiple sub-query results |

In practice, both run simultaneously. At the RRF stage, each is treated as an independent search path:

```
RRF inputs = [
  queryVector results,      // original query
  hydeVector results,       // HyDE hypothetical document
  subQuery1 results,        // Multi-query sub-query 1
  subQuery2 results,        // Multi-query sub-query 2
  subQuery3 results,        // Multi-query sub-query 3
  bm25 results,             // keyword search
]
```

Six paths merge together, accumulating RRF scores per document. A document that ranks highly across more paths earns a higher fused score — which is exactly what we want.

## Cost Considerations

The main costs of Multi-Query Expansion are:
1. **LLM rewriting**: one extra LLM call (a lightweight model works fine — rewriting doesn't need a large model)
2. **Multiple embeddings**: N sub-queries each require one embedding call
3. **Multiple searches**: N parallel vector searches

In the context of a climbing community, complex queries are typically the ones where users need the highest quality results. The cost is worth it. Skipping this for simple queries also avoids unnecessary overhead.

## The Big Picture

Multi-Query Expansion is essentially using the LLM's language capabilities to compensate for the blind spots in vector search coverage. Single-query recall is bottlenecked by how the user happens to phrase their question; multi-angle rewriting breaks that constraint. Combined with RRF fusion, documents that get hits from multiple angles rank higher — and the overall result quality improves.

---

## References

- [RAG-Fusion: a New Take on Retrieval-Augmented Generation](https://arxiv.org/abs/2402.03367)
- [Reciprocal Rank Fusion outperforms Condorcet and Individual Rank Learning Methods (Cormack et al., 2009)](https://dl.acm.org/doi/10.1145/1571941.1572114)
- [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (Lewis et al., 2020)](https://arxiv.org/abs/2005.11401)
- [Multi-Query Retrieval with Query Expansion — LangChain docs](https://arxiv.org/abs/2305.14283)
- [A Survey on RAG — Multi-Query Expansion and Recall Improvement Strategies (2024)](https://arxiv.org/abs/2312.10997)
- [NobodyClimb System Architecture: Cloudflare Full-Stack Climbing Community Platform](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture) (zh-TW only)
- [NobodyClimb AI Architecture: 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture) (zh-TW only)
