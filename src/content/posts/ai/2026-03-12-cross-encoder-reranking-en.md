---
title: "Cross-Encoder Reranking: Surfacing the Most Relevant Documents"
date: 2026-03-12
type: guide
category: ai
tags: [rag, reranking, cross-encoder, bge-reranker, retrieval]
lang: en
tldr: "Vector search similarity scores don't equal relevance. Cross-Encoders use pairwise comparison to reorder results and push the truly relevant documents to the top."
description: "The design principles behind Cross-Encoder Reranking, how to use BGE Reranker, threshold configuration strategies, and how it complements Bi-Encoder vector search."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-12-cross-encoder-reranking)

Vector search (Bi-Encoder) is fast and efficient, but it has a fundamental limitation: **queries and documents are encoded independently, with no cross-attention between them**.

A Bi-Encoder converts the query and each document into separate vectors, then measures distance with cosine similarity. During this process, the query tokens never see the document content, and document tokens never see the query. This architecture works well for large-scale ANN (approximate nearest neighbor) search, but it isn't precise enough for relevance scoring.

Cross-Encoders work differently: **they feed the query and document together into a Transformer, letting them attend to each other**, and output a relevance score that genuinely reflects "how well this document answers this query."

## Architecture Comparison

```
Bi-Encoder (vector search):
Query → [Encoder] → q_vector
Doc   → [Encoder] → d_vector
Score = cosine(q_vector, d_vector)

Cross-Encoder (reranking):
[Query; Doc] → [Transformer] → relevance_score
```

Cross-Encoder computation is O(n) — it scores each candidate document individually — so it's not suitable for searching across a large index. But once you've narrowed the field to a few dozen candidates, the compute is entirely manageable and the precision improvement is substantial.

## Two-Stage Architecture

This is the standard industry combination:

```
Phase 1: Recall (Bi-Encoder)
  Full index → Top-100 candidates (fast)

Phase 2: Precision (Cross-Encoder)
  Top-100 → Top-10 reranked (accurate)
```

The actual configuration used in this system:

- **Input**: Candidates after RRF fusion (typically 20–30)
- **Model**: `@cf/baai/bge-reranker-base`
- **Output**: A relevance score per document (0.0 – 1.0)

## Threshold Filtering

After reranking, rather than blindly taking Top-K, we first filter out low-relevance documents using a threshold:

```typescript
const threshold = config.reranker_relevance_threshold ?? 0.5;
const minKeep = config.reranker_min_keep ?? 3;

const filtered = reranked.filter(doc => doc.score >= threshold);

// Safety net: if everything falls below the threshold, keep at least minKeep
const final = filtered.length >= minKeep
  ? filtered
  : reranked.slice(0, minKeep);
```

`min_keep` is an important safety design: if all candidates score low and get filtered out, the LLM has no context to work with and falls back to general knowledge — which tends to hallucinate. Keeping a minimum number of documents lets the downstream LLM-as-Judge decide whether to add a disclaimer to the response.

## Skip Condition

Reranking is skipped when there is only one candidate or fewer — there's nothing to reorder, so we save an API call.

```typescript
skipWhen: (ctx) => ctx.candidateMatches.length <= 1
```

## Why BGE Reranker

`bge-reranker-base` is a Cross-Encoder from BAAI, the same family as BGE-M3, which is also the embedding model in this system. Using models from the same family ensures more coherent understanding of the vector space. It's also available as a first-party option on Cloudflare Workers AI.

For higher precision requirements, you can switch to `bge-reranker-large`, but latency and cost will increase accordingly.

## Impact on the Overall System

Reranking has the greatest impact on final output quality in the following scenarios:

**Highest benefit**:
- Multi-path retrieval (HyDE + Multi-Query + BM25) produces many candidates of uneven quality
- Complex query intent where simple cosine similarity ordering tends to drift off target

**Lower benefit**:
- Already few candidates (< 5)
- Simple queries with clear semantics where the first-round results are already decent

Overall, reranking is the most direct lever for improving precision in a RAG pipeline, and the cost is well within reason — running cross-attention over 30 candidates is much cheaper than a single LLM generation pass.

---

## References

- [Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks (2019)](https://arxiv.org/abs/1908.10084)
- [Cross-Encoder Reranking — SBERT.net Official Docs](https://www.sbert.net/examples/applications/cross-encoder/README.html)
- [BAAI/bge-reranker-base — Hugging Face](https://huggingface.co/BAAI/bge-reranker-base)
- [A Survey on RAG — Retrieval-Augmented Generation for Large Language Models (2024)](https://arxiv.org/abs/2312.10997)
