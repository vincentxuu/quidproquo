---
title: "How Ask AI Indexes Posts: Chunks, D1 FTS5, and Vectorize"
date: 2026-08-30
category: ai
type: guide
tags: [rag, indexing, chunking, d1, fts5, vectorize, cloudflare]
lang: en
tldr: "Ask AI indexing runs in two production stages: source-hash changes update D1, post chunks, and FTS5 first; embedding checkpoints and a delete queue then let Vectorize catch up asynchronously. The two stores do not share one transaction."
description: "Trace a Markdown post through chunking, D1 and FTS5 synchronization, Workers AI embeddings, Vectorize upserts, deletion queues, and freshness checks."
draft: false
series:
  name: "Ask AI in Practice"
  order: 1
---

> 🌏 [中文版](/posts/ai/2026-08-30-ask-ai-indexing-pipeline)

> **Optional companion reading:** Beginners can read this article directly. For background concepts, pair it with [Chunking Strategies: How You Split Text Determines Whether RAG Can Find the Answer](/posts/ai/2026-03-12-chunking-strategies-en) and [Vector Database Selection: How to Choose Between Pinecone, Weaviate, Qdrant, and Vectorize](/posts/ai/2026-03-12-vector-database-comparison-en).

Committing a Markdown post does not immediately make it usable Ask AI evidence. The post must pass publication filters, become chunks, enter D1 and FTS5, receive embeddings, and finally reach Vectorize. A partial run can leave BM25 and vector retrieval with different views of the corpus.

The production indexer deliberately uses two stages: **D1, `post_chunks`, and FTS5 move together in one D1 batch; Vectorize catches up asynchronously through checkpoints and a deletion queue.** There is no transaction spanning both stores. That boundary explains why “deployed,” “available to full-text search,” and “embedded” are three different states.

## Stage one starts with search-eligible posts

[`scripts/sync-to-d1.ts`](https://github.com/vincentxuu/quidproquo/blob/main/scripts/sync-to-d1.ts) recursively scans `src/content/posts/**/*.md` and parses frontmatter and body content. It excludes posts that are:

- marked `draft: true`;
- marked `search: false`; or
- future-dated unless the run explicitly uses `--include-future`.

For each eligible post, the script collects slug, title, category, language, description, TL;DR, tags, and body. It hashes those fields together with the sync schema version to produce `source_hash`. A production run first retrieves the remote slug/hash manifest from `/api/index/posts/sync`. It sends upserts only for changed hashes and deletions for remote slugs absent from the new eligible manifest.

Routine content updates are incremental. `--full` is an explicit maintenance path, not the default behavior of every push.

## Chunk IDs are reproducible but position-dependent

[`chunkMarkdown`](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/crawl/chunker.ts) splits at H1–H3 headings. When one section exceeds 1,500 characters, it accumulates paragraphs into smaller chunks. The chunk ID is:

```text
sha256(slug + "::" + chunk_index).slice(0, 16)
```

The deterministic formula lets D1 rows, FTS rows, and Vectorize vectors meet on `chunk_id`. It is not a content hash. Inserting a section near the start can shift later indexes and therefore change later IDs.

The sync script also builds contextual content with the post title, category, and date. It hashes the embedding version together with that contextual content into `desired_embedding_hash`. Even when the body stays the same, an embedding-version change can mark a chunk for re-embedding.

## D1, post chunks, and FTS5 move in one batch

The production [`/api/index/posts/sync`](https://github.com/vincentxuu/quidproquo/blob/main/src/pages/api/index/posts/sync.ts) endpoint requires a shared secret, bounds request size, and limits both operation count and D1 statement count. After validation, [`post-sync.ts`](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/indexing/post-sync.ts) sends the prepared statements through `DB.batch`.

An upsert performs these steps:

1. Add old `post_chunks.id` values to `vector_delete_queue`.
2. Delete old FTS rows and post chunks.
3. Upsert the post and its new `source_hash`.
4. Insert new chunks with `desired_embedding_hash` and a null `embedded_hash`.
5. Remove a new chunk ID from the delete queue if that ID still survives.
6. Insert the corresponding `chunks_fts` row.

A stale-post deletion also queues vector IDs before deleting FTS, chunks, and the post row. That order preserves enough information to clean Vectorize even after the D1 source rows disappear.

FTS5 currently comes from the [`0025_search_cjk_trigram.sql`](https://github.com/vincentxuu/quidproquo/blob/main/migrations/0025_search_cjk_trigram.sql) migration. Trigram tokenization improves CJK substring matching for three or more characters. Two-character queries still need the application-level LIKE fallback; trigram does not guarantee every short Chinese term will match.

## Vectorize catches up through checkpoints

After D1 synchronization, the second stage calls [`/api/embed/sync`](https://github.com/vincentxuu/quidproquo/blob/main/src/pages/api/embed/sync.ts). The endpoint requires an admin session or shared secret and bounds sources, batch size, and the `full` flag.

[`embedPosts`](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/indexing/pipeline.ts) uses a conservative order:

1. Drain `vector_delete_queue` in batches.
2. If queued deletions remain, perform no upserts and return `hasMore: true`.
3. Select chunks whose `embedded_hash` is null or differs from `desired_embedding_hash`.
4. Add title, category, and date context.
5. Generate Workers AI embeddings and upsert them into `VECTORIZE_INDEX`.
6. Only after a successful upsert, acknowledge the desired hash in D1.

If embedding or upsert fails, the result records errors and the checkpoint remains pending for a later batch. That makes the pipeline resumable. It does not make D1 and Vectorize synchronously consistent; temporary lag between stages is an allowed state.

## Deployment connects indexing only after relevant changes

[`deploy.yml`](https://github.com/vincentxuu/quidproquo/blob/main/.github/workflows/deploy.yml) completes the build, migrations, and Worker deployment first. Only when the content-index detector requests a sync and deployment succeeds does it invoke the reusable [`content-index.yml`](https://github.com/vincentxuu/quidproquo/blob/main/.github/workflows/content-index.yml).

That workflow runs production D1 sync, pending embedding sync, and finally a search-freshness check. The embedding driver repeats calls until `hasMore` becomes false or the configured maximum batch count is reached.

Workflow code establishes the intended order. It does not prove that the latest run succeeded or that production currently has no pending checkpoints. Current-state claims require the actual run and remote-store evidence.

## Reproduce the local contracts

```sh
pnpm exec vitest run \
  src/lib/indexing/post-sync.test.ts \
  src/lib/indexing/pipeline.test.ts \
  src/pages/api/index/posts/sync.test.ts \
  src/pages/api/embed/sync.test.ts
```

These tests lock down operation limits, D1 batch ordering, the deletion queue, checkpoint acknowledgement, and endpoint authorization. They do not inspect production stores.

With Cloudflare access, a read-only query can inspect pending D1 checkpoints:

```sh
npx wrangler d1 execute quidproquo-db --remote --command="
SELECT
  COUNT(*) AS chunks,
  SUM(embedded_hash = desired_embedding_hash) AS embedded,
  SUM(embedded_hash IS NULL OR embedded_hash != desired_embedding_hash) AS pending
FROM post_chunks;"
```

That query observes D1 checkpoint state. It cannot by itself prove that every Vectorize ID and value is correct. Vector counts, D1 checkpoints, and an actual retrieval observation remain separate evidence.

## Evidence boundary

The repository and unit tests establish the indexing contract: incremental hashes, chunk IDs, D1/FTS batching, the delete queue, embedding checkpoints, and workflow order. They do not establish that the current production index is complete, that the latest freshness check passed, or that a particular query will retrieve a particular post.

Also, the local `pnpm sync` path updates local D1 and FTS only. It does not prove the production Vectorize checkpoint path. The next article starts at the other end of the index and follows a user question through metadata, BM25, and vector retrieval.

## Known Limitations and Improvement Paths

The pipeline above handles incremental sync, FTS alignment, and vector consistency tracking. But the chunking stage has several known weaknesses worth documenting here.

### Table chunks lose their headers

`chunkMarkdown` splits at H1–H3 headings and paragraph boundaries. When a Markdown table crosses the 1,500-character boundary, only the first chunk retains the header row (`|...|` + `|---|`). Subsequent chunks become contextless `| cell | cell |` lines, and embedding quality drops — the vector cannot reflect which table or which column the data belongs to.

The smallest fix is **Header Propagation**: after the splitter finishes, scan each chunk for Markdown table rows missing a header, and prepend the original header. The open-source [Chonkie TableChunker](https://docs.chonkie.ai) implements this pattern: "splits markdown tables by row, always preserving the header." [arXiv:2605.00318](https://arxiv.org/abs/2605.00318) (STC framework) goes further, using rows as the minimum split unit for tables — on MAUD legal documents, Recall@1 improved from 0.347 to 0.539, and chunk count dropped by 40%.

Header Propagation adds roughly 50 tokens per chunk. Affected files need re-embedding.

### Metadata enrichment can go further

The current pipeline prepends post title, category, and date before embedding. This is already a lightweight form of metadata enrichment. [arXiv:2601.11863](https://arxiv.org/abs/2601.11863) (Utilizing Metadata for Better RAG) found that company name plus year provides the strongest discriminating signal; section header paths mainly help with chunk-level localization. [Microsoft Azure's RAG Enrichment Phase](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-enrichment-phase) recommends Title, Summary, Keywords, and Questions — the last two require LLM generation, but the first two add no extra cost.

For Ask AI, the next step is adding section header paths (H1 → H2 → H3) to contextual content. This needs no LLM, has a small change surface, and stacks with Header Propagation.

### Contextual Chunking is the main upgrade path

[Anthropic Contextual Retrieval](https://platform.claude.com/cookbook/capabilities-contextual-embeddings-guide) uses an LLM at ingestion time to generate a 50–100 token context description for each chunk, prepended before embedding. According to Anthropic's published data, combined with reranking, top-20 retrieval failure rate drops by 67%. Cost is approximately $1.02 per million document tokens (with prompt caching).

This improves all chunks, not just tables. Ask AI already uses Claude, and prompt caching keeps costs manageable. However, it requires a one-time reprocessing of all existing chunks.

### Late Chunking avoids LLM cost with a different approach

[Late Chunking](https://arxiv.org/abs/2409.04701) (Günther et al., EMNLP 2024 / SIGIR 2025) inverts the traditional "chunk first, embed second" order: feed the entire document into a long-context embedding model (8K+ tokens), let attention see the full text, then split. Each chunk's embedding naturally carries full-document context without extra LLM-generated descriptions.

The limitation is that it requires an embedding model supporting 8K+ context (e.g., jina-embeddings-v3), and large documents may exceed the context window. Ask AI currently uses Cloudflare Workers AI embeddings, so the context length is a prerequisite to verify.

Further improvement paths: [Hierarchical Chunking + Auto-Merge](/en/posts/ai/2026-09-03-hierarchical-chunking-auto-merge-en) uses multi-granularity indexing to resolve the "small chunks are precise but lack context" dilemma; [Table Serialization](/en/posts/ai/2026-09-03-table-serialization-rag-en) explores how table serialization format affects embedding quality.

## Update Log

- 2026-09-03: Added "Known Limitations and Improvement Paths" section with four new references

## References

- [Markdown to D1 sync script](https://github.com/vincentxuu/quidproquo/blob/main/scripts/sync-to-d1.ts)
- [Markdown chunker](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/crawl/chunker.ts)
- [Production post-sync transaction](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/indexing/post-sync.ts)
- [Embedding and Vectorize pipeline](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/indexing/pipeline.ts)
- [Post sync API](https://github.com/vincentxuu/quidproquo/blob/main/src/pages/api/index/posts/sync.ts)
- [Embedding sync API](https://github.com/vincentxuu/quidproquo/blob/main/src/pages/api/embed/sync.ts)
- [CJK trigram FTS5 migration](https://github.com/vincentxuu/quidproquo/blob/main/migrations/0025_search_cjk_trigram.sql)
- [Production content-index workflow](https://github.com/vincentxuu/quidproquo/blob/main/.github/workflows/content-index.yml)
- [arXiv:2605.00318 — Structure-Aware Chunking for Tabular Data in RAG](https://arxiv.org/abs/2605.00318) (2025)
- [arXiv:2601.11863 — Utilizing Metadata for Better RAG](https://arxiv.org/abs/2601.11863) (2025)
- [Anthropic — Contextual Retrieval (Claude Cookbook)](https://platform.claude.com/cookbook/capabilities-contextual-embeddings-guide)
- [arXiv:2409.04701 — Late Chunking: Contextual Chunk Embeddings Using Long-Context Embedding Models](https://arxiv.org/abs/2409.04701) (EMNLP 2024 / SIGIR 2025)
- [Microsoft Azure — RAG Enrichment Phase](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-enrichment-phase)
- [Chonkie TableChunker](https://docs.chonkie.ai)
