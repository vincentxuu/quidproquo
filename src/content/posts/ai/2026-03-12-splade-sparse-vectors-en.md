---
title: "SPLADE: Smarter Sparse Vector Search Beyond BM25"
date: 2026-03-12
updated: 2026-08-19
type: guide
category: ai
tags: [rag, splade, sparse-vector, bm25, retrieval, hybrid-search]
lang: en
tldr: "BM25 only recognizes words that appear in the query. SPLADE infers related terms and adds them to the search, gaining partial semantic capability while preserving the precision of keyword search."
description: "How SPLADE sparse vector search works: differences from BM25, complementary relationship with dense vectors, and its role in Hybrid Search."
draft: false
series:
  name: "The RAG Techniques Compendium"
  order: 12
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
| Search speed | Fast | Depends on the variant (the original is slower than BM25; only the efficiency-tuned versions close the gap) | Slow (ANN) |
| Multilingual | Requires tokenizer | Depends on training data | Yes |

SPLADE is positioned as an "evolved BM25," not a "simplified dense search." It retains the speed advantage of sparse vectors while adding partial semantic expansion capability.

The tooling has caught up in the last couple of years: Sentence Transformers has had a first-class `SparseEncoder` API since v5, which loads, trains, and evaluates SPLADE-family models directly, and most mainstream vector databases (Qdrant, OpenSearch, Elasticsearch, and others) now support sparse vector fields. Exactly how far each one goes changes fast, so check the current docs of whichever store you are considering rather than trusting any comparison table. A good starting point is the [Sentence Transformers Sparse Encoder docs](https://sbert.net/docs/sparse_encoder/usage/usage.html) and [Training Sparse Embedding Models](https://huggingface.co/blog/train-sparse-encoder).

## Licensing Is the First Gate

This blocks more projects than any technical detail: **Naver's official SPLADE checkpoints (`naver/splade-v3`, `naver/splade-cocondenser-ensembledistil`, and friends) are CC-BY-NC-SA 4.0 — non-commercial only**, and `splade-v3` is additionally gated on Hugging Face behind a terms acceptance. If you are shipping a commercial product, that is the end of the conversation for those weights.

For commercially usable sparse neural retrieval, the practical directions today are OpenSearch's neural sparse encoding series (Apache-2.0), or BGE-M3's sparse output (see below). When picking a model, **read the license field before you read the benchmark numbers**.

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

**Language support**: SPLADE's term expansion depends on training data, and Naver's official checkpoints are English-first — there is no Traditional Chinese version.

For CJK, the more pragmatic alternative is **BGE-M3's sparse (lexical weights) output**. M3-Embedding was designed so that a single forward pass can emit dense, sparse, and multi-vector representations at once, across 100+ languages, and the weights are MIT-licensed. In other words, you may not need "a Chinese SPLADE" at all — you can have the BGE-M3 you are already running emit a sparse leg as well. The cost is that you have to run the model yourself and maintain your own inverted index; that second half is where the real engineering cost lives.

**Platform support**: Cloudflare Workers AI's hosted model catalog has no SPLADE-family model (and the Workers AI BGE-M3 endpoint returns dense vectors only). To do sparse neural retrieval on Workers you have to call an external service, paying for the extra network round trip in latency and cost. The catalog changes; treat the [official model list](https://developers.cloudflare.com/workers-ai/models/) as the source of truth.

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

SPLADE is a strong evolution of BM25, but not every system needs it. The combination of Dense + BM25 + Multi-Query is already sufficient in many scenarios. SPLADE's value lies in filling a specific gap: expanding domain-specific synonyms and abbreviations, implemented over sparse vectors. Be careful with speed claims though: [the SPLADE efficiency paper](https://arxiv.org/abs/2207.03834) exists precisely to "reduce the latency gap between SPLADE and traditional retrieval" — it is the efficiency-tuned variants that catch up with BM25, not the original checkpoints.

If your RAG system repeatedly encounters the problem of "not finding documents that express the same concept with different wording," SPLADE is worth serious evaluation.

---

## Changelog

- 2026-08-19: Fact-checked against primary sources and refreshed; perishable details handed back to official docs. Added to the "RAG Techniques Compendium" series.

## References

- [SPLADE: Sparse Lexical and Expansion Model for First Stage Ranking (Formal et al., SIGIR 2021)](https://arxiv.org/abs/2107.05720)
- [SPLADE v2: Sparse Lexical and Expansion Model for Information Retrieval (2021)](https://arxiv.org/abs/2109.10086)
- [SPLADE-v3: New baselines for SPLADE (Lassance et al., 2024)](https://arxiv.org/abs/2403.06789)
- [M3-Embedding (BGE-M3): Multi-Linguality, Multi-Functionality, Multi-Granularity Text Embeddings](https://arxiv.org/abs/2402.03216)
- [Sentence Transformers: Sparse Encoder usage docs](https://sbert.net/docs/sparse_encoder/usage/usage.html)
- [NobodyClimb System Architecture: Cloudflare Full-Stack Climbing Community Platform](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture-en)
- [NobodyClimb AI Architecture: 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture-en)
