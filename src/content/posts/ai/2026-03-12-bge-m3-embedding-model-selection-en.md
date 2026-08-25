---
title: "BGE-M3: Why This Embedding Model Works Well for Traditional Chinese RAG"
date: 2026-03-12
updated: 2026-08-25
type: guide
category: ai
tags: [rag, embedding, bge-m3, multilingual, vector-search, cloudflare-workers-ai]
lang: en
tldr: "Your choice of embedding model directly determines RAG search quality. BGE-M3's multilingual training, 1024-dimensional vectors, and matching Reranker make it a practical pick for Traditional Chinese RAG."
description: "A look at the key considerations for selecting BGE-M3 as an embedding model: multilingual capability, vector dimensions, the paired Reranker, and real-world constraints on Cloudflare Workers AI."
draft: false
series:
  name: "The RAG Techniques Compendium"
  order: 7
---

> 🌏 [中文版](/posts/ai/2026-03-12-bge-m3-embedding-model-selection)

Search quality in a RAG system depends heavily on the embedding model you choose. A good model pulls semantically similar queries and documents close together in vector space; a bad one turns vector search into a lottery.

When picking an embedding model, a few questions matter: language support, vector dimensions, whether a matching Reranker exists, and availability on your target platform.

## What Is BGE-M3

[BGE-M3](https://huggingface.co/BAAI/bge-m3) is a multilingual embedding model from the Beijing Academy of Artificial Intelligence (BAAI). The "M3" stands for **Multi-Linguality, Multi-Granularity, Multi-Functionality**:

- **Multi-Linguality**: officially 100+ languages (Traditional Chinese is not called out separately in that list)
- **Multi-Granularity**: handles everything from short phrases to long documents (up to 8192 tokens)
- **Multi-Functionality**: supports Dense retrieval, Sparse retrieval, and Multi-vector retrieval simultaneously

On Cloudflare Workers AI, the available version uses the standard Dense retrieval mode (1024-dimensional vectors).

## Why Choose It

### Traditional Chinese Performance

Most embedding models are trained predominantly on Simplified Chinese data. **That includes BGE-M3**: [the M3 paper](https://arxiv.org/abs/2402.03216) never uses the phrase Traditional Chinese, and the Chinese fine-tuning corpora it lists (DuReader, mMARCO-ZH, T²-Ranking, CMedQAv2 and so on) are all Simplified; the HuggingFace model card does not mention Traditional Chinese either. So "it is especially good at Traditional Chinese" has no basis. Shared characters and vocabulary may well make it serviceable, but that is something your own eval set has to establish.

On this system, Traditional Chinese climbing terminology ("先鋒攀登", "確保站", "岩壁", "抱石") behaved without obvious mismatches — but that is an impression from use, not a controlled measurement, so do not read it as a model comparison.

### 1024-Dimensional Vectors

Common embedding dimensions run from 384 to 3072; BGE-M3 sits at 1024.

Higher dimensions increase expressiveness, but come with trade-offs:
- Storage cost: each vector takes more space
- Compute cost: cosine similarity calculations scale with dimensionality
- Vectorize query speed: higher dimensions mean slower queries

Worth stressing: "higher dimensions" does not mean "better results." Dimensionality is a capacity ceiling; actual retrieval quality comes from training data and target-language coverage. To compare models, look at the multilingual tab of the [MTEB Leaderboard](https://huggingface.co/spaces/mteb/leaderboard) rather than comparing dimension counts — the rankings move month to month, which is why no snapshot of them appears here.

For a focused vertical domain like climbing, 1024 dimensions is plenty to distinguish semantic differences — there's no practical reason to chase higher dimensionality.

### Paired Reranker

A correction to a widespread misconception (and to the first version of this post): **`bge-reranker-base` is not BGE-M3's paired reranker.** It belongs to the earlier BGE v1 family and targets English and Chinese. The reranker actually derived from BGE-M3 is [`bge-reranker-v2-m3`](https://huggingface.co/BAAI/bge-reranker-v2-m3), explicitly documented as a multilingual Cross-Encoder based on bge-m3 — that's the one to reach for in Traditional Chinese work.

The practical gap: the reranker Cloudflare Workers AI currently offers is [`@cf/baai/bge-reranker-base`](https://developers.cloudflare.com/workers-ai/models/bge-reranker-base/), not v2-m3. Running on Workers AI therefore means pairing an M3 embedding model with a reranker from a different family.

Why same-family matters: if your embedding model and Reranker come from different training pipelines, their definitions of "relevance" can subtly diverge, and the reranked order isn't guaranteed to beat the original. Multilingual and Traditional Chinese corpora are especially prone to this — A/B the reranker against your own query set before shipping, rather than assuming it helps.

### Native Cloudflare Workers AI Support

Deployed on Cloudflare Workers, using the platform's native Workers AI eliminates the latency and cost of external API calls:

```typescript
const embeddingResult = await env.AI.run(
  "@cf/baai/bge-m3",
  { text: [query] }
);
const vector = embeddingResult.data[0]; // number[], length=1024
```

Compared to calling an external Embedding API (a cross-region network hop), Workers AI stays within the same Cloudflare network, so latency is substantially lower.

bge-m3 is not the only embedding model on Workers AI; the platform has since added options such as Qwen3-Embedding and EmbeddingGemma, with different input limits and pricing. For selection, go straight to the [Workers AI model catalog](https://developers.cloudflare.com/workers-ai/models/) — no snapshot of that list appears here, because it changes far faster than this article does.

## Real-World Limitations

### Batch Size

Workers AI caps how many strings one request can carry, and applies account-level rate limits on top of that; the current numbers live in the [Workers AI limits page](https://developers.cloudflare.com/workers-ai/platform/limits/) rather than here. When Multi-Query expansion generates 5 sub-queries, you need to either batch them carefully or embed each one separately:

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

### Input Length: Model Spec ≠ Platform Limit

BGE-M3 natively supports up to 8192 tokens, the number most often quoted as its selling point. But **hosted platforms usually enforce something far lower** — and the docs don't always agree with themselves:

- Cloudflare's [AI Search supported-models table](https://developers.cloudflare.com/ai-search/configuration/models/supported-models/) lists `@cf/baai/bge-m3` at 512 input tokens
- The [Workers AI bge-m3 model page](https://developers.cloudflare.com/workers-ai/models/bge-m3/) lists only a context window, with no per-request input ceiling

The two don't line up, so **don't copy either number — including from this post.** Measure it with a string of known length before you ship, and find out where truncation actually kicks in. The bge-m3 API takes a `truncate_inputs` parameter: it defaults to `false` (over-long input errors out), and setting it to `true` truncates silently. Keep it `false` while debugging, so an over-long input surfaces as an error instead of a vector that quietly encodes only the first half.

Whatever the limit turns out to be, long documents must be chunked before indexing. See [Chunking Strategies](/posts/ai/2026-03-12-chunking-strategies-en).

## How to Compare Against Other Options

This section used to hold a table of model dimensions, multilingual ratings, and prices. It's gone — model catalogs, dimensions, and unit prices shift every quarter, and freezing them into an article only misleads. Using [BAAI/bge-m3](https://huggingface.co/BAAI/bge-m3) as the baseline, three branches from 2025–2026 are worth comparing:

- **Small and efficient: [jina-embeddings-v5-text](https://arxiv.org/abs/2602.15547) (2026-02-17)** — sub-1B parameters, up to 32K context, trained with distillation plus task-targeted contrastive learning to reach best-in-class retrieval quality at this size, robust to truncation and binary quantization. Best when you need pure text retrieval on a budget or with tight latency.
- **Multimodal dual-mode: [jina-embeddings-v4](https://arxiv.org/abs/2506.18902) (2025-06-23)** — 3.8B parameters, single- and multi-vector dual modes that handle plain text and visually rich content (charts, tables, layouts) together, with SOTA on chart and table retrieval. Best when your corpus includes screenshots, scanned documents, charts, or you need cross-modal search.
- **Multi-vector: [Jina-ColBERT-v2](https://arxiv.org/abs/2408.16672)** — late-interaction multi-vector retrieval that ports single-vector training tricks to ColBERT, strong on multilingual retrieval. Best when you need token-level fine-grained matching, interpretability, or maximum recall, at higher storage and query cost than single-vector.

How to choose: pure text, cost or speed first → a small model like v5-text; charts, layouts, and multimodal content such as video stills or scans → v4 multimodal; maximum recall or explainable matching → ColBERT-v2 multi-vector. Whichever branch you consider, **leaderboards move fast — measure on your own data**: compare the MTEB multilingual tab and run A/B on your own query set and corpus, and measure before and after reranking and quantization rather than taking any article's conclusion as the answer.

What remains as decision criteria:

1. **Language coverage beats leaderboard scores.** Confirm the candidate's training data covers your target language. For Traditional Chinese specifically, "supports Chinese" usually means Simplified; check whether the model card explicitly documents multilingual training, then test with your own domain terms.
2. **Platform availability is a hard constraint.** A model you can only reach through an external API adds a cross-network hop to every query when you run on Workers. Start from what your target platform hosts natively.
3. **Dimensions tell you about cost, not quality.** Dimensionality drives storage and query cost, not retrieval quality. For quality, consult the [MTEB Leaderboard](https://huggingface.co/spaces/mteb/leaderboard).
4. **Pick the reranker at the same time.** Check whether a same-family Cross-Encoder is available; if not, accept that reranking gains need to be verified yourself.
5. **Measure the real input ceiling.** See the previous section.

For what each platform currently offers and at what price, go to the source: the [Workers AI model catalog](https://developers.cloudflare.com/workers-ai/models/) and the [MTEB Leaderboard](https://huggingface.co/spaces/mteb/leaderboard).

Within the constraints of Cloudflare Workers, BGE-M3 remains a reasonably safe default for Traditional Chinese — but that's a conclusion about this platform at this point in time, not a permanent answer.

## Bottom Line

Choosing an embedding model isn't about finding "the most powerful one" — it's about finding the one that fits your use case and platform constraints. BGE-M3 hits a workable combination for a Cloudflare Workers RAG system: strong Traditional Chinese semantic understanding, native platform support, and a reranker available on the same platform (even if it isn't the same-family one).

If you're not on Cloudflare Workers, or you need stronger English performance, commercial APIs and newer open multilingual models are both options — but go by the current MTEB multilingual leaderboard and measurements on your own corpus, not by any model name printed in an article (this one included). The key is to select based on your language requirements, deployment platform, and cost constraints — not to blindly chase the highest dimensionality or the newest model.

---

## Changelog

- 2026-08-25: Added 2025-2026 three-branch embedding comparison (jina-embeddings-v5-text / v4 / Jina-ColBERT-v2) with BGE-M3 as baseline, clarifying when to choose small/efficient vs multimodal/visual vs multi-vector
- 2026-08-19: Fact-checked against primary sources and refreshed; perishable details handed back to official docs. Added to the "RAG Techniques Compendium" series.

## References

- [BGE M3-Embedding: Multi-Lingual, Multi-Functionality, Multi-Granularity Text Embeddings Through Self-Knowledge Distillation (2024)](https://arxiv.org/abs/2402.03216)
- [MTEB: Massive Text Embedding Benchmark (arXiv:2210.07316)](https://arxiv.org/abs/2210.07316)
- [MTEB Leaderboard (Hugging Face, includes a multilingual tab)](https://huggingface.co/spaces/mteb/leaderboard)
- [BAAI/bge-m3 model card](https://huggingface.co/BAAI/bge-m3)
- [BAAI/bge-reranker-v2-m3 model card](https://huggingface.co/BAAI/bge-reranker-v2-m3)
- [jina-embeddings-v5-text: Task-Targeted Embedding Distillation (2026-02-17)](https://arxiv.org/abs/2602.15547)
- [jina-embeddings-v4: Universal Embeddings for Multimodal Multilingual Retrieval (2025-06-23)](https://arxiv.org/abs/2506.18902)
- [Jina-ColBERT-v2: A General-Purpose Multilingual Late Interaction Retriever (2024-08-29)](https://arxiv.org/abs/2408.16672)
- [Cloudflare Workers AI — bge-m3](https://developers.cloudflare.com/workers-ai/models/bge-m3/)
- [Cloudflare Workers AI — model catalog](https://developers.cloudflare.com/workers-ai/models/)
- [NobodyClimb Architecture: A Full-Stack Climbing Community on Cloudflare](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture-en)
- [NobodyClimb AI Architecture: A 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture-en)
