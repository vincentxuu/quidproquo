---
title: "HyDE: Boosting Vector Search Recall with Hypothetical Answers"
date: 2026-03-12
type: guide
category: ai
tags: [rag, hyde, embedding, vector-search, query-enhancement]
lang: en
tldr: "Have an LLM generate an 'ideal answer' first, then embed that hypothetical document for search — it outperforms searching with the raw query."
description: "The design rationale behind HyDE (Hypothetical Document Embeddings), when to use it, and its practical impact in real RAG systems."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-12-hyde-hypothetical-document-embeddings)

Vector search has a fundamental asymmetry problem: **the language patterns of a user's query and the documents in your database are very different**.

A user asks: "Which route at Longdong is good for a first outdoor climb?"
The document in the database reads: "Longdong North Wall, 5.9, sport climbing, well-protected, clean fall zones, suitable for beginners getting into outdoor climbing."

The query is a question; the document is a description. Their embeddings end up far apart in vector space, and search recall suffers.

HyDE (Hypothetical Document Embeddings) solves this by **using an LLM to transform the query into a "hypothetical ideal answer document," then searching with that document instead**. The hypothetical document shares much closer language patterns with real documents in the database, resulting in smaller embedding distances and better search quality.

## How It Works

```
User Query → LLM → Hypothetical Document → Embedding → Vector Search
                                                              ↓
                                                    Real Documents in DB
```

The LLM-generated hypothetical document doesn't need to be accurate — it's just a semantic bridge. Even if the content is wrong, as long as the language patterns (vocabulary, structure, tone) resemble the documents in the database, the embedding will surface more relevant results.

## Prompt Design

```
Based on the following climbing question, generate a hypothetical ideal answer document (under 100 words).
It doesn't need to be accurate — just written in a style similar to a climbing route description.

Question: {query}
Hypothetical answer document:
```

The 100-word limit matters — too long and unrelated semantics dilute the embedding; too short and there isn't enough semantic signal to capture.

## When to Trigger HyDE

HyDE doesn't run on every query — it only activates when `queryType === 'complex'`. The reasoning:

- **Simple queries** (e.g., "How many routes are at Longdong?"): semantics are clear, no hypothetical document needed
- **General knowledge queries** (e.g., "forearm training methods"): answered directly by the LLM, no RAG needed
- **SQL queries** (e.g., "How many routes did I complete this year?"): handled by structured queries, no embedding needed
- **Complex queries** (e.g., "Longdong route recommendations for intermediate climbers"): semantically ambiguous, multi-condition — this is where HyDE delivers the most value

## Parallel Execution

The HyDE LLM call and the embedding of the original query run **in parallel**, so there's no added serial latency:

```typescript
const [queryEmbedding, hydeEmbedding] = await Promise.all([
  embed(query),
  generateHyDEAndEmbed(query), // LLM generation + embed
]);

// Each embedding searches independently; results are merged with RRF
const [queryResults, hydeResults] = await Promise.all([
  searchVectorize(queryEmbedding, filter, topK),
  searchVectorize(hydeEmbedding, filter, topK),
]);
```

When fed into RRF, the HyDE search results are treated as a separate lane, merged alongside other search paths (BM25, Multi-Query).

## Why It Works

The original query vector represents the **semantics of the question**, while the hypothetical document vector represents the **semantics of an answer**. Documents in the database are much closer to "answer semantics," so searching with the hypothetical document naturally yields higher recall.

The original paper (Gao et al., 2022) replaced the query embedding entirely with the hypothetical document embedding. In practice, however, **combining both and merging results via RRF** outperforms either alone: the query embedding preserves original intent, while the HyDE embedding expands semantic coverage.

## Limitations

- One extra LLM call adds latency cost (even though it runs in parallel, it still consumes tokens)
- If the generated hypothetical document drifts too far from the domain, it can introduce noise
- Limited benefit for short queries (3–5 words) where the semantics are already clear

Overall, for complex or ambiguous natural language queries, HyDE is a low-cost, high-impact way to improve recall.

---

## References

- [Precise Zero-Shot Dense Retrieval without Relevance Labels (HyDE) (2022)](https://arxiv.org/abs/2212.10496)
- [NobodyClimb System Architecture: A Full-Stack Climbing Community on Cloudflare](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture) (zh-TW only)
- [NobodyClimb AI Architecture: A 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture) (zh-TW only)
