---
title: "SPLADE: Smarter Sparse Vector Search Beyond BM25"
date: 2026-03-12
type: guide
category: ai
tags: [rag, splade, sparse-vector, bm25, retrieval, hybrid-search]
lang: en
tldr: "BM25 only recognizes words that appear in the query. SPLADE infers related terms and adds them to the search, gaining partial semantic capability while preserving the precision of keyword search."
description: "How SPLADE sparse vector search works: differences from BM25, complementary relationship with dense vectors, and its role in Hybrid Search."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-12-splade-sparse-vectors)

Vector search (Dense) captures semantics, BM25 (Sparse) captures keywords, and Hybrid Search uses both. But BM25 has a fundamental limitation: it only recognizes words that **actually appear** in the query.

Search for "rock climbing beginner," and BM25 looks for documents containing "rock climbing" and "beginner." But documents containing "getting started," "novice," "newbie," or "intro" are completely invisible to BM25. Vector search solves this problem through semantic space, but on the keyword side, it remains a gap.

SPLADE (Sparse Lexical and Expansion model) is a technique that sits between BM25 and dense vectors: **it uses a neural network to generate sparse vectors for queries and documents, where vector dimensions correspond to vocabulary terms, but the model infers related terms and assigns them non-zero weights**.

## How It Works

Traditional BM25 vector:
```
Query "rock climbing beginner" → [0, 0, ..., 1.2, 0, ..., 0.8, 0, ...]
                                              ↑ climbing        ↑ beginner
```
Only terms that appear have non-zero values.

SPLADE vector:
```
Query "rock climbing beginner" → [0, 0, ..., 1.2, 0, ..., 0.8, 0.6, 0.4, 0.3, ...]
                                              ↑ climbing   ↑ beginner ↑ novice ↑ intro ↑ starter
```
The model infers semantically related terms and assigns them lower but non-zero weights.

Such sparse vectors can be efficiently searched using traditional inverted indexes, without requiring ANN (Approximate Nearest Neighbor) search like dense vectors, but the query coverage is broader than BM25.

## SPLADE vs BM25 vs Dense

| | BM25 | SPLADE | Dense (BGE-M3) |
|---|------|--------|----------------|
| Vector type | Sparse | Sparse | Dense |
| Term expansion | No | Yes | N/A |
| Semantic understanding | No | Partial | Yes |
| Exact matching | Yes | Yes | Weak |
| Index size | Small | Small to Medium | Large |
| Search speed | Fast | Fast | Slow (ANN) |
| Multilingual | Requires tokenizer | Depends on training data | Yes |
| Platform support | Broad | Limited | Broad |

SPLADE is positioned as an "evolved BM25," not a "simplified dense search." It retains the speed advantage of sparse vectors while adding partial semantic expansion capability.

## Role in Hybrid Search

Currently, NobodyClimb's Hybrid Search uses two paths: Dense (BGE-M3) + BM25 (D1 FTS5). Adding SPLADE creates a three-path approach:

```
Dense (BGE-M3)  → Semantic relevance
SPLADE          → Keywords + term expansion
BM25            → Exact keywords

Three-path RRF fusion → More comprehensive recall
```

SPLADE fills the space between Dense and BM25: synonyms that BM25 can't find, but where Dense is sometimes too fuzzy -- SPLADE performs better in this middle ground.

## Practical Limitations

**Language support**: SPLADE's term expansion depends on training data. There aren't many SPLADE models trained on Traditional Chinese, so you either need to find a version trained on Traditional Chinese data or accept limited expansion effectiveness.

**Platform support**: Cloudflare Workers AI (as of 2026) doesn't offer SPLADE models. To use it on Workers, you'd need to call an external API (adding latency and cost) or wait for platform support.

**Complexity tradeoff**: The marginal benefit of adding a third search path needs to be weighed against what BM25 + Dense already covers. If dense search provides sufficient semantic coverage, SPLADE's improvement may be limited.

## When Is It Worth Adopting

**Worth trying when**:
- Queries heavily use abbreviations, aliases, or slang (climbing terminology has many such cases)
- Dense search performs inconsistently on domain-specific terms
- BM25's recall is noticeably insufficient

**Can wait when**:
- Contextual Retrieval is already enriching document semantics
- Multi-Query expansion is compensating for insufficient term coverage
- The platform doesn't natively support it, requiring additional network calls

## Overall

SPLADE is a strong evolution of BM25, but not every system needs it. The combination of Dense + BM25 + Multi-Query is already sufficient in many scenarios. SPLADE's value lies in filling a specific gap: expanding domain-specific synonyms and abbreviations, and it's fast because it uses sparse vectors.

If your RAG system repeatedly encounters the problem of "not finding documents that express the same concept with different wording," SPLADE is worth serious evaluation.

---

## References

- [SPLADE: Sparse Lexical and Expansion Model for First Stage Ranking (2021)](https://arxiv.org/abs/2109.10086)
- [NobodyClimb System Architecture: Cloudflare Full-Stack Climbing Community Platform](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [NobodyClimb AI Architecture: 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture)
