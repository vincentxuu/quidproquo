---
title: "Cross-Encoder Reranking: Surfacing the Most Relevant Documents"
date: 2026-03-12
updated: 2026-09-03
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

## What's New in 2025: From Pointwise to Listwise (jina-reranker-v3 / v3.5)

The baseline paradigm remains the classic two-stage stack: a Bi-Encoder for large-scale recall (e.g., top-50) followed by a Cross-Encoder for precision reranking (e.g., top-5). The Top-100 → Top-10 and the 20–30 post-RRF setup described above is just this paradigm instantiated at this site's scale.

The notable 2025 branch is the **listwise reranker**. Jina released **jina-reranker-v3** on 2025-09-29 and **v3.5** on 2026-07-20, both **0.6B** listwise models: self-reported BEIR nDCG@10 rises from **61.94 to 63.20**, which the authors describe as comparable to 4B-class models, with about **+9.6** on semi-structured (tables, JSON) splits.

The architectural shift is in attention. A classic Cross-Encoder is pointwise — `[Query; Doc_i] → score`, each candidate scored in isolation. A listwise reranker places the **query and multiple candidates in the same context window** and uses **causal attention** so the model sees all candidates in one forward pass, emitting a per-candidate score that reflects its relevance *within that set* (read out from the final token). This enables **cross-document comparison** — judging which document answers the question more completely rather than scoring each in a vacuum — and is particularly useful for **semi-structured documents and queries that benefit from comparing candidates against each other**.

The v3.5 engineering change is **hybrid attention**: three sliding-window layers plus two global layers, preserving cross-document comparison while pushing latency down further — the paper reports roughly **1.56× lower latency** than v3, making it more practical for batched reranking of 20–150 candidates.

Trade-offs and adoption notes:

- **Do not copy leaderboard numbers at face value.** The 61.94 → 63.20 and "comparable to 4B" claims come from the authors' own BEIR/MIRACL/RTEB runs, without a side-by-side table against Cohere / Voyage / bge-reranker-v2 and without validation on your domain.
- **Validate on your own labelled set**: run a batch of your labelled queries, inspect the score distribution, then decide thresholds and whether to replace the current BGE reranker. A leaderboard lead does not imply a lead on your data.
- With few candidates (< 5) or a semantically clear query the listwise gain is limited; it is worth trying when you have many candidates and a good share of tabular or semi-structured content.

Reranking has the greatest impact on final output quality in the following scenarios:

**Highest benefit**:
- Multi-path retrieval (HyDE + Multi-Query + BM25) produces many candidates of uneven quality
- Complex query intent where simple cosine similarity ordering tends to drift off target
- **Structured documents (tables, financial reports)**: a 2026 financial-document benchmark found that across a full BM25 → hybrid → contextual → corrective pipeline, reranking was the single most impactful component, lifting MRR@3 by **+17.2 percentage points** — exceeding the individual gains from query expansion, hybrid search, and corrective retrieval

**Lower benefit**:
- Already few candidates (< 5)
- Simple queries with clear semantics where the first-round results are already decent

Overall, reranking is the most direct lever for improving precision in a RAG pipeline, and the cost is well within reason — running cross-attention over 30 candidates is much cheaper than a single LLM generation pass.

---

## Changelog

- 2026-09-03: Added financial-document benchmark data (arXiv:2604.01733) — reranking as single most impactful component at +17.2pp MRR@3 on table-heavy documents
- 2026-08-25: Added 2025 update (jina-reranker-v3 / v3.5, 0.6B listwise, BEIR 61.94→63.20, +9.6 on semi-structured, hybrid attention). Explained same-window causal attention and when it helps; noted that results must be validated on your own labelled set.
- 2026-08-19: Fact-checked against primary sources and refreshed; perishable details handed back to official docs. Added to the "RAG Techniques Compendium" series.

## References

- [Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks (2019)](https://arxiv.org/abs/1908.10084)
- [Cross-Encoders — Sentence Transformers Official Docs](https://www.sbert.net/examples/cross_encoder/applications/README.html)
- [BAAI/bge-reranker-base — Hugging Face](https://huggingface.co/BAAI/bge-reranker-base)
- [Workers AI model catalog (to check which rerankers exist today)](https://developers.cloudflare.com/workers-ai/models/)
- [Cohere Reranking Best Practices (on how to read reranker scores)](https://docs.cohere.com/docs/reranking-best-practices)
- [A Survey on RAG — Retrieval-Augmented Generation for Large Language Models (2023)](https://arxiv.org/abs/2312.10997)
- [jina-reranker-v3: Last but Not Late Interaction for Document Reranking (2025-09-29)](https://arxiv.org/abs/2509.25085)
- [jina-reranker-v3.5: Efficient Listwise Reranker with Hybrid Attention and Self-Distillation (2026-07-20)](https://arxiv.org/abs/2607.18152)
- [From BM25 to Corrective RAG: Benchmarking Retrieval Strategies for Financial RAG (2026)](https://arxiv.org/abs/2604.01733)
