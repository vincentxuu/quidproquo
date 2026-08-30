---
title: "How to Use Cloudflare Vectorize: Taking Control of RAG Retrieval"
date: 2026-08-30
type: guide
category: ai
tags: [cloudflare, cloudflare-vectorize, rag, vector-database, embeddings, retrieval]
lang: en
tldr: "Vectorize is Cloudflare's vector database. AI Search is the right starting point for a managed RAG pipeline; Vectorize is the better fit when you need control over chunking, embeddings, metadata filters, hybrid retrieval, reindexing, and fallback behavior."
description: "A practical guide to Cloudflare Vectorize: indexes, Workers bindings, insert/upsert/query, metadata filtering, namespaces, limits, pricing, and where it belongs in a RAG application."
draft: false
series:
  name: "Cloudflare AI Stack"
  order: 6
additionalSeries:
  - name: "Cloudflare Edge Platform"
    order: 21
---

> 🌏 [中文版](/posts/ai/2026-08-30-cloudflare-vectorize-rag-control)

[Cloudflare AI Search](/posts/tech/2026-08-29-cloudflare-ai-search-guide-en) gives you a managed RAG pipeline: data sources, Markdown conversion, chunking, embeddings, Vectorize, BM25, reranking, and a Workers binding. So why use [Cloudflare Vectorize](https://developers.cloudflare.com/vectorize/) directly?

Usually because retrieval has become product logic. You need to decide how documents are chunked, which metadata is extracted, how tenants and permissions are filtered, how BM25 and vector results are fused, and what fallback path runs when recall is bad. At that point, Vectorize is the primitive you want to hold directly.

This post follows the AI Search guide. It is not a generic [vector database](/posts/ai/2026-03-12-vector-database-comparison-en) overview; it answers a practical Cloudflare AI Stack question: when should you own retrieval yourself?

## Where Vectorize Fits in the Cloudflare AI Stack

Vectorize is Cloudflare's vector database for storing embeddings and running similarity search. Because it sits beside [Workers](https://developers.cloudflare.com/workers/), [Workers AI](https://developers.cloudflare.com/workers-ai/), [R2](https://developers.cloudflare.com/r2/), and [D1](https://developers.cloudflare.com/d1/), most of a RAG request can stay inside the Cloudflare platform:

```txt
User query
   |
   v
Worker / Agent
   |
   +--> Workers AI embedding model
   |
   +--> Vectorize query
   |       |
   |       +--> vector id + score + metadata
   |
   +--> D1 / R2 / KV fetch source content
   |
   +--> AI Gateway / Workers AI generation
```

Keep the data roles separate. Vectorize stores embeddings and optional metadata; it should not become the full content store. A common split is:

- **Vectorize**: chunk vectors, chunk IDs, tenant, document version, source key.
- **R2**: original files, converted Markdown, large artifacts.
- **D1**: document tables, chunk tables, permissions, index versions, job state.
- **KV**: eventually consistent caches such as popular query results or settings.
- **Durable Objects**: coordination for each tenant, agent session, or indexing job.

AI Search is best when you want a managed search pipeline. Vectorize is best when your retrieval rules are known, important, and quality-sensitive.

## Decide the Index First: Dimensions and Metric Are Fixed

When creating a Vectorize index, you choose vector dimensions and the distance metric. The official example looks like this:

```sh
npx wrangler vectorize create docs-prod --dimensions=768 --metric=cosine
```

Those values are not decorative. `dimensions` must match the embedding model output; `metric` affects similarity scores. Cloudflare's docs state that this vector configuration cannot be changed later.

Do not create a throwaway production index and hope to sort it out later. Decide at least three things first:

- **Embedding model**: for example, Workers AI `@cf/baai/bge-base-en-v1.5` returns a `[1,768]` shape, so the index must use 768 dimensions.
- **Environment strategy**: separate `docs-dev`, `docs-staging`, and `docs-prod` so test data does not pollute production retrieval.
- **Rebuild path**: if the model, chunking, or metadata rules change, create a new index, reingest, move traffic, then delete the old index.

Wrangler prints the binding configuration. In `wrangler.jsonc`, it can look like this:

```jsonc
{
  "vectorize": [
    {
      "binding": "DOC_VECTORS",
      "index_name": "docs-prod"
    }
  ]
}
```

The Worker can then use `env.DOC_VECTORS`.

## Writes: Insert and Upsert Affect Reindexing

A Vectorize vector needs at least `id` and `values`. It can also include `namespace` and `metadata`.

```ts
type DocChunk = {
  id: string;
  text: string;
  tenantId: string;
  docId: string;
  sourceUrl: string;
};

export async function indexChunk(env: Env, chunk: DocChunk) {
  const embedding = await env.AI.run("@cf/baai/bge-base-en-v1.5", {
    text: [chunk.text],
  });

  await env.DOC_VECTORS.upsert([
    {
      id: chunk.id,
      namespace: chunk.tenantId,
      values: embedding.data[0],
      metadata: {
        docId: chunk.docId,
        sourceUrl: chunk.sourceUrl,
        indexedAt: Date.now(),
      },
    },
  ]);
}
```

`insert()` and `upsert()` behave differently:

- `insert()` keeps the first vector when the same ID already exists.
- `upsert()` fully replaces the existing vector, including values and metadata.
- `insert()`, `upsert()`, and `deleteByIds()` are asynchronous mutations; query results usually reflect them after a few seconds.

For production RAG ingestion, I default to `upsert()` because documents, chunking, embedding models, and metadata versions change. With `insert()`, a reindex job may quietly leave old embeddings in place.

Batch large writes. Cloudflare's best-practices page explains that Vectorize merges changes into background jobs; the current upsert batch limit is 1000 vectors from Workers and 5000 through the HTTP API. Do not call insert 250,000 times for 250,000 chunks.

## Queries: Return IDs, Then Fetch Content Yourself

At query time, embed the user query and pass the vector to Vectorize:

```ts
export async function retrieve(env: Env, query: string, tenantId: string) {
  const embedding = await env.AI.run("@cf/baai/bge-base-en-v1.5", {
    text: [query],
  });

  const matches = await env.DOC_VECTORS.query(embedding.data[0], {
    namespace: tenantId,
    topK: 8,
    returnMetadata: "indexed",
    filter: {
      status: "published",
    },
  });

  return matches.matches.map((match) => ({
    id: match.id,
    score: match.score,
    metadata: match.metadata,
  }));
}
```

Two details are easy to miss:

- A Workers AI embedding response is `{ shape, data }`; pass `data[0]` to `query()`, not the whole response and not `data`.
- Vectorize returns match IDs, scores, metadata, and optionally values. The actual chunk text you send to the model usually comes from D1, R2, or KV by ID.

`topK` defaults to 5. For V2 indexes, the current maximum is 100 when values and full metadata are not returned; it drops to 50 when `returnValues: true` or `returnMetadata: "all"`. In practice, I prefer retrieving 20 to 50 candidates, then applying BM25, reranking, permissions, and quality rules before building prompt context.

## Metadata Filters Are Retrieval Quality

Vectorize applies `filter` first, then takes `topK` from the filtered set. That order matters for RAG. If a user can only read one tenant's documents, or if the query should target one product line, scope and authorization should narrow the search before similarity ranking.

Supported operators include `$eq`, `$ne`, `$in`, `$nin`, `$lt`, `$lte`, `$gt`, and `$gte`:

```ts
const matches = await env.DOC_VECTORS.query(queryVector, {
  namespace: tenantId,
  topK: 12,
  returnMetadata: "indexed",
  filter: {
    product: { $in: ["billing", "analytics"] },
    updatedAtBucket: { $gte: 20260801 },
    visibility: "public",
  },
});
```

Filters are not free magic. Apart from namespace filtering, metadata fields need metadata indexes before you can filter on them:

```sh
npx wrangler vectorize create-metadata-index docs-prod \
  --property-name=product \
  --type=string

npx wrangler vectorize create-metadata-index docs-prod \
  --property-name=updatedAtBucket \
  --type=number
```

Design around these limits:

- Each Vectorize index supports up to 10 metadata indexes.
- Metadata is limited to 10 KiB per vector.
- String metadata indexes cover the first 64 bytes.
- Vectors written before a metadata index exists will not be included in that index until re-upserted.
- Large high-cardinality range queries may reduce performance and accuracy.

This is the main boundary between Vectorize and AI Search. AI Search reduces pipeline ownership. Vectorize lets you make scope, permissions, versions, time windows, and product boundaries first-class retrieval rules.

## How to Use Namespaces

A namespace is a single partition key for a vector. Cloudflare positions namespaces for boundaries such as customer, merchant, or store ID. When a query specifies a namespace, Vectorize searches only inside that namespace, and namespace filtering runs before vector search.

My default rule:

- **Namespace for hard isolation**: tenant, customer, workspace.
- **Metadata for composable conditions**: product, language, document type, visibility, indexed version.
- **Avoid encoding every dimension into namespace**: a vector belongs to one namespace; use metadata filters for combinations.

For a SaaS product where each workspace has its own knowledge base, `namespace = workspaceId` is natural. Role, product, and document-state filters then belong in metadata.

## Vectorize Does Not Build Hybrid Search for You

Pure vector search is strong for semantic queries, but it misses error codes, API names, short Chinese terms, version numbers, and function names. The site's [D1 FTS5 + Vectorize hybrid search debug](/posts/tech/2026-08-26-d1-fts5-hybrid-search-cjk-recall-en) reached a simple lesson: BM25 and vector search should complement each other, and one path should not short-circuit the other too early.

With AI Search, hybrid retrieval, BM25, RRF, and reranking are managed by the platform. With direct Vectorize usage, those pieces return to the application:

```txt
query
  |
  +--> embedding -> Vectorize topK
  |
  +--> keyword search -> D1 FTS5 / external search
  |
  +--> merge -> RRF / weighted score / reranker
  |
  +--> fetch chunks -> prompt context
```

That is not a downside by itself; it is work you must count. You gain control over Traditional Chinese tokenization, code symbols, proper nouns, document freshness, and authorization rules. The cost is owning ingestion, reindexing, evaluation, and observability.

## Cost Model: Dimensions, Not Index Count

Vectorize pricing is currently based on two metrics:

- **Queried vector dimensions**: vectors searched plus the query vector, multiplied by dimensions.
- **Stored vector dimensions**: stored vector count multiplied by dimensions.

The current official pricing page says Workers Free includes 30 million queried vector dimensions per month and 5 million stored vector dimensions. Workers Paid includes the first 50 million queried vector dimensions per month and 10 million stored vector dimensions, then usage-based billing. Cloudflare also states that Vectorize is not billed by CPU, memory, active index hours, or number of indexes, and empty indexes do not count as stored dimensions.

That keeps small RAG systems cheap, but it makes design choices concrete:

- Smaller chunks increase stored dimensions.
- Higher-dimensional embedding models increase both query and storage cost.
- `topK` is not the only cost driver; searched vector count and dimensions matter.
- Namespaces and filters can improve both quality and cost by narrowing search space.

Pricing and included allocations can change, so recheck the official pricing page before publication. The stable takeaway is the billing shape: stored dimensions and queried dimensions drive the cost.

## AI Search or Vectorize?

My split:

| Situation | Pick |
|---|---|
| You want to make documents searchable quickly | AI Search |
| Your source is R2, a website, or uploaded files, and platform defaults are acceptable | AI Search |
| You need custom chunking, overlap, or index versions | Vectorize |
| You need complex metadata filters, tenant authorization, or product scope | Vectorize |
| You want to build your own BM25 + Vectorize + reranker + fallback retrieval stack | Vectorize |
| You are building recommendations, similar-image search, deduplication, classification, or anomaly detection | Vectorize |
| You mainly want a knowledge-base search tool for an Agent | Start with AI Search, move to Vectorize if quality requires it |

The blunt test: if retrieval is just a feature, start with AI Search. If retrieval is a major source of product quality, design it directly with Vectorize.

## Production Checklist

Before launch, I would check:

- Index dimensions match the embedding model output.
- Index names are split by environment.
- Metadata indexes exist before production vectors are written.
- Vector IDs map back to source content in D1, R2, or KV.
- Ingestion uses batch upsert and can be replayed.
- Queries apply namespace and metadata filters before reranking or fusion.
- Prompt context keeps source ID, URL, version, and score.
- Offline evals compare chunking, embedding, filter, and reranker versions.
- AI Gateway metadata records `retrieval_version`, `index_name`, `topK`, and `tenant`.
- Cost estimates use queried and stored vector dimensions, not just request count.

Vectorize has a precise role: it is not the whole RAG system; it is the central vector index inside your retrieval stack. When low operations work matters most, AI Search wins first. When retrieval must be explainable, tunable, and measurable, Vectorize deserves to be the main primitive.

## References

- [Cloudflare Vectorize — Overview](https://developers.cloudflare.com/vectorize/)
- [Cloudflare Vectorize — Introduction](https://developers.cloudflare.com/vectorize/get-started/intro/)
- [Cloudflare Vectorize — API](https://developers.cloudflare.com/vectorize/reference/client-api/)
- [Cloudflare Vectorize — Metadata filtering](https://developers.cloudflare.com/vectorize/reference/metadata-filtering/)
- [Cloudflare Vectorize — Insert vectors](https://developers.cloudflare.com/vectorize/best-practices/insert-vectors/)
- [Cloudflare Vectorize — Query vectors](https://developers.cloudflare.com/vectorize/best-practices/query-vectors/)
- [Cloudflare Vectorize — Limits](https://developers.cloudflare.com/vectorize/platform/limits/)
- [Cloudflare Vectorize — Pricing](https://developers.cloudflare.com/vectorize/platform/pricing/)
- [How to Use Cloudflare AI Search: Data Sources, Hybrid Retrieval, and Workers Bindings](/posts/tech/2026-08-29-cloudflare-ai-search-guide-en)
