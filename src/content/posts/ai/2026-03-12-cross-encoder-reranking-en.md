---
title: "Cross-Encoder Reranking: Surfacing the Most Relevant Documents"
date: 2026-03-12
updated: 2026-08-19
type: guide
category: ai
tags: [rag, reranking, cross-encoder, bge-reranker, retrieval]
lang: en
tldr: "Vector search similarity scores don't equal relevance. Cross-Encoders use pairwise comparison to reorder results and push the truly relevant documents to the top."
description: "The design principles behind Cross-Encoder Reranking, how to use BGE Reranker, threshold configuration strategies, and how it complements Bi-Encoder vector search."
draft: false
series:
  name: "The RAG Techniques Compendium"
  order: 19
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

A Cross-Encoder runs a full Transformer forward pass for every (query, doc) pair, so cost grows linearly with the candidate count (O(n) inferences) and, unlike vectors, nothing can be precomputed and cached — which rules it out for scoring a large index. But once you've narrowed the field to a few dozen candidates, the compute is entirely manageable and the precision improvement is substantial.

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
- **Model**: the BGE reranker on Cloudflare Workers AI (`@cf/baai/bge-reranker-base`)
- **Output**: a relevance score per document

The scoring deserves a clear explanation, because it directly determines how you set the threshold. **A Cross-Encoder's raw output is a logit, not a probability, and in principle it is unbounded** — BAAI's own model card states that the reranker is "optimized based on cross-entropy loss, so the relevance score is not bounded to a specific range," and raw scores can be negative. Workers AI returns scores that have been mapped through a sigmoid into [0, 1], so on that platform you do get values in the 0–1 range.

But a sigmoid only squashes a logit into an interval; it does not make it a calibrated probability. A logit of 0 maps exactly to 0.5, which is why irrelevant documents often land near 0.5 rather than near 0. That is why the 0.5 threshold below is a starting point, not a law.

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

That `0.5` is not a universal constant, and **switching rerankers means recalibrating it**: some services return raw logits, some return sigmoid-mapped values, and some return scores softmaxed across the candidate set — the same number means very different things across models. Even Cohere's documentation warns that although its relevance scores are normalized to [0, 1], "it is not accurate to assume a score of 0.9 means the document is 2x more relevant than a document with a score of 0.45." The practical approach is to run a batch of your own labelled queries through the model, look at the score distribution, and cut where it actually separates.

`min_keep` is an important safety design: if all candidates score low and get filtered out, the LLM has no context to work with and falls back to general knowledge — which tends to hallucinate. Keeping a minimum number of documents lets the downstream LLM-as-Judge decide whether to add a disclaimer to the response.

## Skip Condition

Reranking is skipped when there is only one candidate or fewer — there's nothing to reorder, so we save an API call.

```typescript
skipWhen: (ctx) => ctx.candidateMatches.length <= 1
```

## Why BGE Reranker

Let's be honest about the reason. **The claim that "sharing a model family with the embedding model gives a more coherent vector space" does not hold up** — a Cross-Encoder produces no embedding at all. It takes a (query, doc) pair and emits a score directly, so there is no shared vector space between it and the Bi-Encoder. The real reasons are operational: it is the only reranker built into this platform, it runs through the same AI binding, it adds no second vendor and no second API key, and the latency stays inside the same network.

If you want a stronger model, the trade-off comes down to three paths:

- **Stay on the same platform**: at the time of writing, the Workers AI model catalog lists exactly one reranker (`bge-reranker-base`), so "move up a size" is not a one-string change — `bge-reranker-large` would have to be self-hosted. Note also that BAAI's v1 series (base / large) was trained for Chinese and English only; for multilingual content, BAAI now points users at its newer multilingual rerankers.
- **Use a hosted reranker API**: Cohere, Jina, Voyage, and Mixedbread all offer rerank endpoints. Version numbers, model names, and pricing in this space churn constantly (Cohere's rerank alone has gone 3.0 → 3.5 → 4.0, now split into fast / pro variants), so any model name or per-request price hard-coded into an article goes stale fast. Check the vendor's own docs for current specs.
- **Self-host a Cross-Encoder**: full control over precision and cost, at the price of running and scaling your own GPUs.

What actually deserves measuring is three things: whether the model supports your languages, how long a document a single request can take before truncation (truncation quietly wrecks relevance judgements on long documents), and how many extra milliseconds of latency you can absorb. All three are documented by the vendors, and all three change between versions — so re-checking at swap time beats memorizing a model name.

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

## Changelog

- 2026-08-19: Fact-checked against primary sources and refreshed; perishable details handed back to official docs. Added to the "RAG Techniques Compendium" series.

## References

- [Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks (2019)](https://arxiv.org/abs/1908.10084)
- [Cross-Encoders — Sentence Transformers Official Docs](https://www.sbert.net/examples/cross_encoder/applications/README.html)
- [BAAI/bge-reranker-base — Hugging Face](https://huggingface.co/BAAI/bge-reranker-base)
- [Workers AI model catalog (to check which rerankers exist today)](https://developers.cloudflare.com/workers-ai/models/)
- [Cohere Reranking Best Practices (on how to read reranker scores)](https://docs.cohere.com/docs/reranking-best-practices)
- [A Survey on RAG — Retrieval-Augmented Generation for Large Language Models (2023)](https://arxiv.org/abs/2312.10997)
