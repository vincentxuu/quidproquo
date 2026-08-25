---
title: "Vector Database Selection: How to Choose Between Pinecone, Weaviate, Qdrant, and Vectorize"
date: 2026-03-12
updated: 2026-08-25
type: guide
category: ai
tags: [rag, vector-database, pinecone, weaviate, qdrant, cloudflare-vectorize]
lang: en
tldr: "Vector database selection is more constrained by deployment platform than LLM selection. Determine your platform and scale requirements first, then evaluate features — don't just look at benchmarks."
description: "A comparison of mainstream vector databases: Pinecone, Weaviate, Qdrant, Chroma, pgvector, and Cloudflare Vectorize — their strengths, limitations, and a decision framework for selection."
draft: false
series:
  name: "The RAG Techniques Compendium"
  order: 8
---

> 🌏 [中文版](/posts/ai/2026-03-12-vector-database-comparison)

A vector database is the core infrastructure of a RAG system. When making a selection, most people start by looking at benchmarks (ANN search speed, recall@K), but what actually determines the choice is usually: **deployment platform, scale requirements, and existing tech stack**.

## First: Ignore the Feature Matrix

This article used to carry a table of "who supports hybrid search, who supports sparse vectors, what it costs per month." I deleted it, because that kind of table has a shelf life of a few weeks.

Real examples of it going stale: Pinecone now has native sparse indexes and a documented [hybrid search](https://docs.pinecone.io/guides/search/hybrid-search) path, so the old "Pinecone doesn't do sparse" line is simply wrong; Chroma went from "local PoC only" to a Rust-based distributed engine plus a managed Chroma Cloud; and Pinecone's pod-based indexes went from "the answer for scale" to a legacy architecture the docs explicitly [do not recommend for new projects](https://docs.pinecone.io/guides/indexes/pods/understanding-pod-based-indexes).

So what follows are the **decision axes that age more slowly**. For feature details, go straight to the vendor docs.

## Axis 1: Self-Host vs Managed

Decide this first, because it constrains everything else.

- **Data sovereignty, data can't leave your infrastructure, cost must sit on your own machines** → self-host. Qdrant, Weaviate, Milvus, Chroma, and pgvector can all be self-hosted.
- **You don't want to staff operations for it** → managed. Pinecone, Weaviate Cloud, Qdrant Cloud, Chroma Cloud, Cloudflare Vectorize.

The real cost of self-hosting isn't the server bill — it's who gets paged at 3am for an OOM. Vector indexes are memory hogs: the HNSW graph lives in RAM and rebuilds burn CPU, and all of that becomes your on-call rotation. If nobody on the team owns that, the managed price delta is usually worth paying.

## Axis 2: Filtering Semantics (The Most Underrated Axis)

RAG almost always needs filtered retrieval — one tenant, one crag, documents after a certain date. And here, **when the filter is applied** matters far more than raw ANN speed:

- **Post-filter (ANN first, then filter)**: fetch topK neighbours, then discard the ones that don't match. The stricter the filter, the fewer results survive — in the worst case, zero. This is over-filtering, and it's the single most common cause of "the data is definitely in there but the system can't find it."
- **Pre-filter / filter-aware index**: narrow the candidate set with a metadata index first, or encode the filter into the index structure itself.

Vendors differ genuinely here — this is a real architectural difference, not marketing:

- **Qdrant** uses a [filterable HNSW](https://qdrant.tech/articles/vector-search-filtering/): payload indexes add extra edges to the HNSW graph, and for low-cardinality filters the query planner drops HNSW and scans the payload index instead. The prerequisite is that **you create the payload index**.
- **Cloudflare Vectorize** applies the filter first and takes topK from the filtered set ([docs](https://developers.cloudflare.com/vectorize/reference/metadata-filtering/)).
- **pgvector** was a textbook post-filter victim before 0.8.0, which added [iterative index scans](https://github.com/pgvector/pgvector?tab=readme-ov-file#iterative-index-scans) (`hnsw.iterative_scan`) — keep scanning the index until enough rows match — to close the over-filtering gap.

Benchmark with **your actual filter conditions**. Never decide based on unfiltered query benchmarks.

## Axis 3: Where Hybrid / Sparse Retrieval Lives

There are three places to put a lexical signal like BM25 or SPLADE:

1. **Native in the database** (Weaviate's hybrid, Pinecone's sparse indexes, Qdrant's sparse vectors): one query returns fused results, least operational surface.
2. **Two indexes + your own RRF**: one vector index, one full-text index, fused in the application. Maximum flexibility and the easiest to tune, but you own the consistency of two indexes.
3. **A platform layer on top**: Vectorize itself is vector-only, but Cloudflare's [AI Search offers hybrid (keyword + vector) retrieval](https://developers.cloudflare.com/ai-search/configuration/indexing/hybrid-search/) — at the cost of running inside its pipeline.

None of these is universally right. What matters is **first confirming your corpus actually needs a lexical signal** (corpora full of proper nouns, part numbers, or route codes usually do) before you switch databases for it.

## Axis 4: Operational Burden and Growth Path

Three questions:

- If the corpus grows 10x, does this option require an architecture change?
- Do you need quantization to fit in memory? Qdrant, Weaviate, and pgvector (`halfvec`, binary) all have it, and they configure it very differently.
- How is multi-tenancy isolated — namespace, collection, or a metadata field? Changing your mind later is expensive.

## 2025-2026 Addendum: Quantization and Hybrid Search Are Now Defaults

The biggest shift since 2025 is not one more feature — "quantization" and "hybrid retrieval" moved from nice-to-have to default. You now need a reason *not* to use them.

**Qdrant 1.19 Turbo4 (2026-08-05)** introduced the [Turbo4 pure-quantization datatype](https://qdrant.tech/blog/qdrant-1.19.x/): 4-bit only with no full-precision copy, roughly 9× storage reduction versus the original footprint, suited to cost-sensitive workloads where a small recall trade-off is acceptable. The same release unified memory tiers into `pinned` / `cached` / `cold` so hot indexes stay in RAM while colder ones sit in disk cache or cold storage. It also added per-tenant IDF, which improves lexical weighting under multi-tenancy.

**Weaviate 1.30 (2025-04-08)** made [BlockMax WAND the default for lexical search](https://weaviate.io/blog/weaviate-1-30-release), with the release notes claiming up to 10× speed-up for keyword search; multi-vector (ColBERT-style late interaction) reached GA with quantization support, and BM25 gained a language-neutral mode. For selection, Weaviate's hybrid is no longer experimental — evaluate it as a primary path.

**Cost and payoff for hybrid now have measured numbers**: [Qdrant's hybrid study](https://qdrant.tech/articles/hybrid-search/) compared dense-only vs sparse-only across 5 datasets; dense+sparse fused with RRF / DBSF beat the single-path baseline in 4 out of 5 cases, with only 0.6–1.47 ms of extra latency under a single-container, single-concurrency benchmark. The practical decision flow is therefore: **measure the real gain from BM25 first, then decide whether to upgrade to SPLADE / learned sparse** — don't jump straight to learned sparse for the sake of looking advanced. The same applies to quantization: confirm whether you need it to fit in memory, then choose between a pure-quantization option like Turbo4 and a dual-copy setup that keeps full precision, trading recall for cost differently.

Pinecone and Cloudflare Vectorize are still retained as controls via their official docs ([Pinecone docs](https://docs.pinecone.io/) / [Vectorize docs](https://developers.cloudflare.com/vectorize/)), but no 2025 first-hand updates were captured for either in this pass (official blog paths returned 404), so no new feature details are asserted here — check the vendor docs for the current state.

## One Line Each

Check the docs for feature details; here's only "when is it the natural choice":

- **[Pinecone](https://docs.pinecone.io/)**: you don't want to touch infrastructure, scale will grow, the team is already on AWS. Use serverless indexes for new projects; add dedicated read nodes for heavy query rates. Closed source, data on their infrastructure — confirm compliance first.
- **[Weaviate](https://weaviate.io/developers/weaviate)**: you need native hybrid search, multi-tenancy, or multiple named vectors per object. Queries run over [GraphQL and gRPC](https://docs.weaviate.io/weaviate/api/graphql), with the official clients wrapping both in a collection-oriented API. Self-hosting means Docker/K8s.
- **[Qdrant](https://qdrant.tech/documentation/)**: self-host friendly, written in Rust, the most complete filtering semantics, with sparse and multi-vector (ColBERT-style late interaction) support. Good fit for "I want control, but I don't want to implement filtering logic myself."
- **[Chroma](https://docs.trychroma.com/)**: fastest path to a local dev setup or PoC — and with a distributed engine and [Chroma Cloud](https://docs.trychroma.com/cloud/getting-started) now available, the old "toy database" impression needs updating.
- **[pgvector](https://github.com/pgvector/pgvector)**: **if you already run Postgres, try this first.** Vectors and rows share a transaction, backups and permissions reuse what you already have, and the operational savings usually beat the performance gap. Revisit a dedicated database past a few million vectors.
- **[Cloudflare Vectorize](https://developers.cloudflare.com/vectorize/)**: the natural choice when you deploy on Workers — embed and search stay inside one network.

## A Few Vectorize Implementation Details

Since NobodyClimb runs on Vectorize, here are the things we hit or nearly hit (the docs are authoritative; the [limits page](https://developers.cloudflare.com/vectorize/platform/limits/) does change):

```typescript
// Call directly within Workers, no cross-service calls
const results = await env.VECTORIZE.query(queryVector, {
  topK: 20,
  filter: { crag_id: { $eq: "longtung" } },
  returnValues: false,
  returnMetadata: "all",
});
```

- **Create the metadata index before you insert.** Filtering on anything other than a namespace requires a metadata index, and **vectors written before that index existed are not in it** — you have to re-upsert them. The `crag_id` filter above returns nothing if you skip this step.
- **There's a cap on metadata indexes per index**, and string-typed indexes only cover the first 64 bytes of the value — don't filter on long strings.
- **Vector dimensions are capped at 1536 (float32)**, which rules out some higher-dimensional embedding models. Check this before you pick an embedding model.
- **The topK ceiling depends on whether you request values/metadata** — asking for them lowers it. If you need a bigger candidate set, split it into two queries (IDs first without metadata, then hydrate).

## Selection Decision Framework

```
Already running Postgres, under a few million vectors?
  → pgvector (skips an entire ops surface)

Deploying on Cloudflare Workers?
  → Vectorize (simplest architecture; check dimension and metadata-index limits first)

Need to self-host (data sovereignty, cost control)?
  → Complex filtering → Qdrant
  → Native hybrid / multi-tenancy → Weaviate

Don't want to run operations?
  → Pinecone serverless (add dedicated read nodes for heavy load)
  → or the managed cloud offering of your preferred engine

Need a lexical signal (BM25 / SPLADE)?
  → Confirm the corpus really needs it, then decide between native support and your own RRF
```

The reason NobodyClimb chose Cloudflare Vectorize is straightforward: the system is deployed on Cloudflare Workers, and using Vectorize keeps both embed and search within the same Cloudflare network — no cross-service network latency, and the simplest possible architecture.

## The Big Picture

Vector database selection is 70% determined by **deployment platform, existing stack, and available operations headcount**, with only 30% coming from feature comparisons. On Cloudflare Workers, Vectorize is the natural choice; if you already run Postgres, pgvector is usually the least painful starting point; for self-hosting with full control and complex filters, Qdrant is the most mature open-source option.

Don't spend too much time on "which benchmark is highest" — and don't trust any feature matrix, including the one this article deleted. Confirm your deployment environment, filtering needs, and scale, then check the current feature state in the vendor's own docs.

---

## Changelog

- 2026-08-25: Added Qdrant 1.19 Turbo4, Weaviate 1.30 BlockMax WAND, and Qdrant Hybrid RRF/DBSF measurements; clarified quantization and hybrid as defaults and the "measure BM25 before learned sparse" decision flow.
- 2026-08-19: Fact-checked against primary sources and refreshed; perishable details handed back to official docs. Added to the "RAG Techniques Compendium" series.

## References

- [ANN Benchmarks - Benchmarking Nearest Neighbor Search](https://ann-benchmarks.com/)
- [A Comprehensive Survey on Vector Database (arXiv:2310.11703)](https://arxiv.org/abs/2310.11703)
- [Pinecone Documentation](https://docs.pinecone.io/)
- [Pinecone - Hybrid search](https://docs.pinecone.io/guides/search/hybrid-search)
- [Pinecone - Understanding pod-based indexes (not recommended for new projects)](https://docs.pinecone.io/guides/indexes/pods/understanding-pod-based-indexes)
- [Weaviate Documentation](https://weaviate.io/developers/weaviate)
- [Weaviate - Search (GraphQL | gRPC)](https://docs.weaviate.io/weaviate/api/graphql)
- [Qdrant Documentation](https://qdrant.tech/documentation/)
- [Qdrant - A Complete Guide to Filtering in Vector Search](https://qdrant.tech/articles/vector-search-filtering/)
- [Chroma Documentation](https://docs.trychroma.com/)
- [Chroma Cloud](https://docs.trychroma.com/cloud/getting-started)
- [pgvector](https://github.com/pgvector/pgvector)
- [pgvector 0.8.0 Released (iterative index scans)](https://www.postgresql.org/about/news/pgvector-080-released-2952/)
- [Cloudflare Vectorize Documentation](https://developers.cloudflare.com/vectorize/)
- [Cloudflare Vectorize - Metadata filtering](https://developers.cloudflare.com/vectorize/reference/metadata-filtering/)
- [Cloudflare Vectorize - Limits](https://developers.cloudflare.com/vectorize/platform/limits/)
- [Cloudflare AI Search - Hybrid search](https://developers.cloudflare.com/ai-search/configuration/indexing/hybrid-search/)
- [Qdrant 1.19 — Turbo4 & Memory Tiers (2026-08-05)](https://qdrant.tech/blog/qdrant-1.19.x/)
- [Qdrant — Hybrid Search: RRF vs DBSF benchmark (2026-08-24)](https://qdrant.tech/articles/hybrid-search/)
- [Weaviate 1.30 Release — BlockMax WAND default, up to 10× lexical speed-up (2025-04-08)](https://weaviate.io/blog/weaviate-1-30-release)
- [NobodyClimb System Architecture: A Full-Stack Climbing Community on Cloudflare](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture-en)
- [NobodyClimb AI Architecture: A 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture-en)
