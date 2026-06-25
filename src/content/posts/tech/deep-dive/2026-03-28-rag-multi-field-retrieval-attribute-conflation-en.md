---
title: "When Vector Search Matches by Name Instead of Grade: Attribute Conflation in RAG Systems"
date: 2026-03-28
category: tech
tags: [rag, vector-search, embedding, cloudflare-workers, recommendation-system]
lang: en
tldr: "Query: 'I just sent Beauty in the Mirror 5.11b — recommend routes of similar difficulty.' The results came back full of routes with similar-sounding names, not similar grades. Root cause: dense embeddings compress multiple attributes into a single vector, and the rarity of the route name drowns out the grade signal. The fix: three layers of defense — metadata pre-filtering, query rewriting, and score fusion."
description: "When embeddings conflate 'name similarity' with 'attribute similarity,' RAG recommendation systems return completely wrong results. This post covers the root cause analysis of attribute conflation, academic solutions (ColBERT, Field-Aware Embeddings, RAG-Fusion), and a layered retrieval architecture that's practical to deploy on Cloudflare Workers."
draft: false
type: deep-dive
---

🌏 [中文版](/posts/tech/deep-dive/2026-03-28-rag-multi-field-retrieval-attribute-conflation)

This post documents a retrieval bug I hit while building a climbing route recommendation system. The user said "I just sent Beauty in the Mirror 5.11b — recommend routes of similar difficulty," and the system returned a bunch of routes whose names resembled "Beauty in the Mirror," with grades all over the map.

By the end of this post, you'll understand why dense embeddings break down on multi-field entity search, what solutions the research community has proposed, and how to fix it with minimal overhead on a constrained runtime like Cloudflare Workers.

## What the Problem Looks Like

System setup: Hono running on Cloudflare Workers, `@cf/baai/bge-m3` for embeddings (1024 dimensions), Cloudflare Vectorize for vector search, plus BM25 for hybrid search.

A climbing route has several structured fields:

```
Route name:   Beauty in the Mirror
Grade:        5.11b
Crag:         Longdong
Route type:   Sport
Rock type:    Sandstone
```

These fields are concatenated into a text string and embedded into Vectorize. When a user queries "recommend routes similar in difficulty to 5.11b," they expect results in the 5.11a–5.11c range. What actually came back? The top-ranked results were all routes with names containing "mirror" or "beauty," with grades ranging from 5.8 to 5.12.

The core issue: **the embedding model has no way to know which attribute the user cares about**.

## Root Cause: Attribute Conflation

Dense embedding models (bge-m3, text-embedding-3-small, etc.) are designed to capture **overall semantic similarity**. When you pack multiple independent attributes into a single vector, the model decides for itself how to weight each attribute — and it usually gets it wrong.

Three reasons why:

**1. Lexical Rarity Bias**

"Beauty in the Mirror" is a proper noun with high discriminative power in the embedding space. "5.11b" is a semi-structured grade notation that appears far more frequently across climbing text than any individual route name. The model naturally allocates more attention to the rarer token.

**2. Single-Vector Bottleneck**

All attributes of a route are compressed into a single 1024-dimensional vector, with inevitable information loss. Name and grade cannot be operated on independently within the vector space — you cannot say "ignore the name dimensions, only compare the grade dimensions."

**3. Training Distribution Bias**

During pretraining on general corpora, "name → name" co-occurrence patterns vastly outnumber structured "grade → grade" comparisons. The model is inherently better at name matching.

BM25 doesn't rescue you here either. "Beauty in the Mirror" naturally gets a high TF-IDF score, and in hybrid search the two signals reinforce each other, making the bias worse.

## How the Research Community Addresses This

Here are the main approaches.

### Metadata Filtering

The most intuitive fix: don't send structured attributes through the embedding pipeline at all — use metadata filters instead.

```
Query → extract grade=5.11b
      → metadata filter: grade IN ['5.11a', '5.11b', '5.11c']
      → run vector search over the filtered subset
```

Pinecone's documentation states it directly: "For attributes with exact-match semantics (such as categories or grades), prefer metadata filters over relying on embedding similarity." Weaviate's hybrid search also follows a filter-first architecture. Cloudflare Vectorize supports this as well.

The upside is minimal implementation cost. The downside is that you need a way to extract structured conditions from natural language queries.

### Structured Query Decomposition

Use an LLM or a rule engine to decompose the query into structured intent:

```json
{
  "intent": "recommendation",
  "reference_route": "Beauty in the Mirror",
  "reference_grade": "5.11b",
  "criteria": "similar_grade",
  "grade_filter": ["5.11a", "5.11b", "5.11c", "5.11d"],
  "semantic_query": "recommend climbing routes"
}
```

LangChain's Self-Query Retriever, LlamaIndex's Query Pipeline, and Microsoft's GraphRAG all take this approach. On Cloudflare Workers, heavy frameworks aren't viable, but you can do a two-stage approach: a rule engine first (regex patterns like `5.\d+[a-d]` and `V\d+`), then fall back to an LLM for anything the rules miss.

### Multi-Field Embedding

Build separate embeddings for different fields, then select the appropriate one based on query intent:

```
route_vectors = {
  "name_vector":      embed("Beauty in the Mirror"),
  "desc_vector":      embed("Longdong classic route..."),
  "composite_vector": embed("Beauty in the Mirror 5.11b Sport Longdong Sandstone")
}
```

ColBERT uses a late interaction mechanism, retaining an independent vector per token and doing per-token comparison at query time — addressing the single-vector bottleneck at the architectural level. Qdrant and Milvus already support storing multiple named vectors per record in the same collection.

Another approach is **Field-Aware Embedding** — prepending field labels:

```
embed("grade: 5.11b")          // instead of embed("5.11b")
embed("route_name: Beauty in the Mirror")  // instead of embed("Beauty in the Mirror")
```

The instruction-tuned variants of E5 and the bge series natively support this pattern — the prefix signals to the model what semantic role the text is playing.

### Query Rewriting + Multi-Query

Rewrite the query before retrieval to strip out structured tokens that would distort the embedding:

```
Original: "I just sent Beauty in the Mirror 5.11b, recommend routes of similar difficulty"
Rewritten: "recommend climbing routes with similar style"  ← used for embedding
Extracted: { grade_range: ["5.11a", "5.11c"] }           ← used for filtering
```

A more advanced variant is **RAG-Fusion**: generate multiple query variants, retrieve independently for each, then merge results using Reciprocal Rank Fusion. Or **Query2Doc**: have the LLM generate a hypothetical document first, then use that document for retrieval.

### Learned Sparse Retrieval

bge-m3 itself supports three modes: dense, sparse (learned sparse), and ColBERT. The sparse mode lets the model learn to assign appropriate weights to tokens — for example, giving "5.11b" higher weight in a grade-focused search. On Cloudflare Workers, however, Workers AI only exposes the dense embedding interface; sparse and ColBERT modes are unavailable.

## The Deployed Solution: Layered Retrieval Architecture

Given Cloudflare Workers constraints, I implemented four layers of defense:

```
┌─────────────────────────────────────────────┐
│  Query Understanding                          │
│  extractGradeFilter / extractLocationFilter   │
│  + analyzeQueryIntent (intent weights)        │
├─────────────────────────────────────────────┤
│  Metadata Pre-filtering                       │
│  Vectorize filter: grade IN [5.11a..5.11c]   │
├─────────────────────────────────────────────┤
│  Query Rewriting                              │
│  Strip structured tokens → clean embedding   │
├─────────────────────────────────────────────┤
│  Score Fusion                                 │
│  α·vector + β·gradeProximity + γ·bm25        │
│  + δ·locationBoost                            │
└─────────────────────────────────────────────┘
```

### P0: Metadata Pre-filtering

The cheapest fix with the biggest impact. Add a grade filter to the Vectorize query:

```typescript
const results = await vectorize.query(queryVector, {
  topK: 20,
  filter: {
    grade: { $in: getGradeRange("5.11b", range = 2) }
    // ["5.11a", "5.11b", "5.11c"]
  }
});
```

As long as the route metadata includes a grade field, this single step immediately solves the core problem.

### P1: Query Rewriting

Strip structured tokens from the query before embedding:

```typescript
const cleanedQuery = removeStructuredTokens(query, {
  grade,
  routeName,
});
const queryVector = await embed(cleanedQuery);
// "recommend climbing routes" instead of "I sent Beauty in the Mirror 5.11b recommend similar difficulty routes"
```

With the route name removed, the vector search focuses on semantic dimensions like style and route type rather than name similarity.

### P2: Score Fusion

Use a weighted score for final ranking:

```typescript
finalScore =
  α * vectorSimilarity +  // semantic similarity (style, description)
  β * gradeProximity +    // grade proximity (deterministic calculation)
  γ * bm25Score +         // lexical match
  δ * locationBoost;      // location bonus
```

`gradeProximity` is a deterministic function, entirely independent of embeddings:

```typescript
function gradeProximity(
  queryGrade: string,
  routeGrade: string
): number {
  const distance = Math.abs(
    gradeToNumeric(queryGrade) - gradeToNumeric(routeGrade)
  );
  return Math.max(0, 1 - distance * 0.2); // -0.2 per grade step
}
```

### P3: Intent Weight Analysis

Dynamically adjust the α/β/γ/δ weights based on query intent. "Recommend routes of similar difficulty" → raise β; "Recommend routes at Longdong" → raise δ. This layer depends on reasonably accurate intent classification and is the last to be implemented.

## The Core Trade-off

The fundamental question is: **which dimensions should go through embedding, and which should not**.

Dense embeddings excel at capturing fuzzy semantic similarity — "similar style," "comparable description," the kind of thing that's hard for humans to articulate precisely. But for fields with well-defined numeric or categorical values (grade, location, route type), routing them through an embedding is asking for trouble.

The right approach is to pull structured attributes out of the embedding entirely and handle them with deterministic logic. Metadata filtering is the cheapest first cut, query rewriting is the second, and score fusion is the safety net. These three layers together are sufficient for the constraints of a Cloudflare Workers deployment.

Longer term, field-aware embeddings (with field-label prefixes) and a multi-index strategy are cleaner architecturally — but only after the basic metadata filtering is solid.

---

## References

- [ColBERT: Efficient and Effective Passage Search via Contextualized Late Interaction over BERT](https://arxiv.org/abs/2004.12832) — Khattab & Zaharia, SIGIR 2020
- [BGE M3-Embedding: Multi-Lingual, Multi-Functionality, Multi-Granularity Text Embeddings Through Self-Knowledge Distillation](https://arxiv.org/abs/2402.03216) — Chen et al., ACL 2024
- [Text Embeddings by Weakly-Supervised Contrastive Pre-training (E5)](https://arxiv.org/abs/2212.03533) — Wang et al., 2023
- [Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks](https://arxiv.org/abs/1908.10084) — Reimers & Gurevych, EMNLP 2019
- [RAG-Fusion: a New Take on Retrieval-Augmented Generation](https://arxiv.org/abs/2402.03367) — Raudaschl, 2023
- [Active Retrieval Augmented Generation (FLARE)](https://arxiv.org/abs/2305.06983) — Jiang et al., EMNLP 2023
- [Query2Doc: Query Expansion with Large Language Models](https://arxiv.org/abs/2303.07678) — Wang et al., EMNLP 2023
- [Query Rewriting in Retrieval-Augmented Large Language Models](https://arxiv.org/abs/2305.14283) — Ma et al., EMNLP 2023
- [From Local to Global: A Graph RAG Approach to Query-Focused Summarization](https://arxiv.org/abs/2404.16130) — Edge et al. (Microsoft GraphRAG), 2024
- [Retrieval-Augmented Generation for Large Language Models: A Survey](https://arxiv.org/abs/2312.10997) — Gao et al., 2024
- [SPLADE: Sparse Lexical and Expansion Model for First Stage Ranking](https://arxiv.org/abs/2107.05720) — Formal et al., SIGIR 2021
- [Sparse, Dense, and Attentional Representations for Text Retrieval](https://arxiv.org/abs/2005.00181) — Luan et al., TACL 2021
- [Pinecone Metadata Filtering Best Practices](https://docs.pinecone.io/docs/metadata-filtering)
- [Weaviate Hybrid Search Architecture](https://weaviate.io/developers/weaviate/search/hybrid)
- [LangChain Self-Query Retriever](https://python.langchain.com/docs/modules/data_connection/retrievers/self_query/)
