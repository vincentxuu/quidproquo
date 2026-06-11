---
title: "BGE-M3: Why This Embedding Model Works Well for Traditional Chinese RAG"
date: 2026-03-12
type: guide
category: ai
tags: [rag, embedding, bge-m3, multilingual, vector-search, cloudflare-workers-ai]
lang: en
tldr: "Your choice of embedding model directly determines RAG search quality. BGE-M3's multilingual training, 1024-dimensional vectors, and matching Reranker make it a practical pick for Traditional Chinese RAG."
description: "A look at the key considerations for selecting BGE-M3 as an embedding model: multilingual capability, vector dimensions, the paired Reranker, and real-world constraints on Cloudflare Workers AI."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-12-bge-m3-embedding-model-selection)

Search quality in a RAG system is 50% determined by the embedding model you choose. A good model pulls semantically similar queries and documents close together in vector space; a bad one turns vector search into a lottery.

When picking an embedding model, a few questions matter: language support, vector dimensions, whether a matching Reranker exists, and availability on your target platform.

## What Is BGE-M3

BGE-M3 is a multilingual embedding model from the Beijing Academy of Artificial Intelligence (BAAI). The "M3" stands for **Multi-Linguality, Multi-Granularity, Multi-Functionality**:

- **Multi-Linguality**: supports 100+ languages, including Traditional Chinese
- **Multi-Granularity**: handles everything from short phrases to long documents (up to 8192 tokens)
- **Multi-Functionality**: supports Dense retrieval, Sparse retrieval, and Multi-vector retrieval simultaneously

On Cloudflare Workers AI, the available version uses the standard Dense retrieval mode (1024-dimensional vectors).

## Why Choose It

### Traditional Chinese Performance

Most embedding models are trained predominantly on Simplified Chinese data, which leads to weaker semantic understanding of Traditional Chinese. BGE-M3's multilingual training corpus includes substantial Traditional Chinese content, and it noticeably outperforms English-only or Simplified-Chinese-dominant models on Traditional Chinese semantic search.

Traditional Chinese climbing terminology ("先鋒攀登", "確保站", "岩壁", "抱石") clusters meaningfully in BGE-M3's vector space — searching related terms doesn't produce bizarre mismatches.

### 1024-Dimensional Vectors

Common options are 768 dimensions (BERT family), 1024 (BGE-M3), 1536 (OpenAI text-embedding-3-small), and 3072 (text-embedding-3-large).

Higher dimensions increase expressiveness, but come with trade-offs:
- Storage cost: each vector takes more space
- Compute cost: cosine similarity calculations scale with dimensionality
- Vectorize query speed: higher dimensions mean slower queries

For a focused vertical domain like climbing, 1024 dimensions is plenty to distinguish semantic differences — there's no practical reason to chase higher dimensionality.

### Paired Reranker

BAAI also provides `bge-reranker-base` (a Cross-Encoder), trained in the same family as BGE-M3 with a shared understanding of the vector space.

This matters more than it might seem: if your embedding model and Reranker come from different training pipelines, their definitions of "relevance" can subtly diverge, making post-rerank results unpredictable. Using matched models avoids that problem entirely.

### Native Cloudflare Workers AI Support

Deployed on Cloudflare Workers, using the platform's native Workers AI eliminates the latency and cost of external API calls:

```typescript
const embeddingResult = await env.AI.run(
  "@cf/baai/bge-m3",
  { text: [query] }
);
const vector = embeddingResult.data[0]; // number[], length=1024
```

Compared to calling the OpenAI Embedding API (a cross-region network hop), Workers AI stays within the same Cloudflare network, so latency is substantially lower.

## Real-World Limitations

### Batch Size

Workers AI enforces a batch size limit on bge-m3 — a single request can only include so many strings. When Multi-Query expansion generates 5 sub-queries, you need to either batch them carefully or embed each one separately:

```typescript
// Embed in parallel, one request each
const embeddings = await Promise.all(
  queries.map(q => embed(q, env))
);
```

### Indexing Throughput

When indexing large volumes of documents, Workers AI applies per-minute request limits. Your indexing service needs rate limiting:

```typescript
const EMBED_BATCH_SIZE = 10;
const EMBED_DELAY_MS = 100; // wait between batches

for (let i = 0; i < chunks.length; i += EMBED_BATCH_SIZE) {
  const batch = chunks.slice(i, i + EMBED_BATCH_SIZE);
  await Promise.all(batch.map(chunk => embedAndStore(chunk)));
  if (i + EMBED_BATCH_SIZE < chunks.length) {
    await sleep(EMBED_DELAY_MS);
  }
}
```

### 8192 Token Limit

BGE-M3 supports up to 8192 tokens, but the actual limit enforced by Workers AI may be lower. Long documents must be chunked before indexing to ensure each chunk stays within bounds.

## Comparison with Other Options

| Model | Dimensions | Multilingual | Platform | Reranker | Cost |
|-------|------------|--------------|----------|----------|------|
| BGE-M3 | 1024 | ✅ Strong | Workers AI | ✅ Matched | Workers AI billing |
| text-embedding-3-small | 1536 | 🟡 Moderate | OpenAI API | ❌ | API fees |
| text-embedding-3-large | 3072 | 🟡 Moderate | OpenAI API | ❌ | High API fees |
| multilingual-e5-large | 1024 | ✅ Strong | Self-hosted | ❌ | Self-hosting costs |
| nomic-embed-text | 768 | ❌ Primarily English | Workers AI | ❌ | Workers AI billing |

Within the constraints of Cloudflare Workers, BGE-M3 offers the best multilingual support while also providing a matched Reranker — making it the natural fit for this setup.

## Bottom Line

Choosing an embedding model isn't about finding "the most powerful one" — it's about finding the one that fits your use case and platform constraints. BGE-M3 hits the right combination for a Cloudflare Workers RAG system: strong Traditional Chinese semantic understanding, native platform support, and a matched toolchain with a Reranker.

If you're not on Cloudflare Workers, or you need stronger English performance, OpenAI's text-embedding-3-large is another common choice. The key is to select based on your language requirements, deployment platform, and cost constraints — not to blindly chase the highest dimensionality or the newest model.

---

## References

- [BGE M3-Embedding: Multi-Lingual, Multi-Functionality, Multi-Granularity Text Embeddings Through Self-Knowledge Distillation (2024)](https://arxiv.org/abs/2402.03216)
- [MTEB: Massive Text Embedding Benchmark (2022)](https://arxiv.org/abs/2210.07316)
- [NobodyClimb Architecture: A Full-Stack Climbing Community on Cloudflare](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture) (zh-TW only)
- [NobodyClimb AI Architecture: A 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture) (zh-TW only)
