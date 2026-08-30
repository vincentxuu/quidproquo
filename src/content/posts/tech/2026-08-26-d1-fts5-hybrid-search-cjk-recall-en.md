---
title: "When Search Returns Only 10 Results: Fixing CJK Recall in Cloudflare D1 FTS5 Hybrid Search"
date: 2026-08-26
category: tech
type: debug
tags: [hybrid-search, fts5, d1, bm25, vector-search, cloudflare, rag]
lang: en
tldr: "Querying “認證” returned only ~10 hits while 149 files (509 occurrences) matched; 41 posts and 76 chunks were found via LIKE, but D1 chunks_fts had 0 rows and unicode61/trigram both returned 0 for 2-char CJK terms. Fix: LIKE fallback with char-level OR first, then trigram migration + pnpm sync, then pagination beyond the hard limit of 12."
description: "Tracing quidproquo.cc search from Pagefind to D1+Vectorize Hybrid Search via git log, diagnosing why 2-char Chinese queries silently lost recall, and a three-layer fix you can copy."
draft: false
series:
  name: "Ask AI in Practice"
  order: 6
---

> 🌏 [中文版](/posts/tech/2026-08-26-d1-fts5-hybrid-search-cjk-recall)

> **Optional companion reading:** Beginners can read this article directly. For extra context, see [Hybrid Search](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf-en) and [RAG Common Failure Modes](/posts/ai/2026-03-12-rag-failure-modes-en).

## TL;DR

Searching for “認證” at [quidproquo.cc/search/?q=認證](https://quidproquo.cc/search/?q=%E8%AA%8D%E8%AD%89) returned only ~10 results, but `grep` shows `149` files and `509` hits. Validated via `LIKE '%認證%'`: `41` posts and `76` chunks match. Local D1 `chunks_fts` had `0` rows — and even after rebuilding, `unicode61` and `trigram` both return `0` for 2-character CJK queries. The fix comes in three layers: add a `LIKE` fallback with char-level `OR`, migrate `chunks_fts` to a CJK-capable form and re-run `pnpm sync`, then remove the hard `limit=12` ceiling with pagination. This article also traces the site's search evolution from the first `Pagefind` version to today's Hybrid Search via `git log`, showing why each stage left today's pitfall.

## Context

The site's search did not start as Hybrid Search. Following `git log -- src/pages/search.astro src/pages/api/search.ts src/lib/rag/tools/search-posts.ts` reveals five turning points; today's `src/pages/api/search.ts:14`, `src/lib/rag/tools/search-posts.ts:195`, `src/lib/rag/tools/hybrid-search.ts:59` and `src/components/Search/SearchWidget.tsx:105` are just the latest.

While checking topic coverage for “certification / 認證”, coverage should have been dozens of posts, but search returned ~10. Calling the API directly at `/api/search?q=認證&mode=hybrid&limit=12` gave the same count — the bottleneck was in retrieval, not rendering. The history below explains how it got here.

## Evolution: From v1 to Today

### v1 — Pagefind static (2026-03-13 `9687eb1f`)

The first search had no backend. `feat: RSS feed, Pagefind search` added `PagefindUI` to `src/pages/search.astro`; `npx pagefind --site dist` scanned `dist/**/*.html` after `astro build` and emitted a `pagefind/` index queried in the browser via `WebAssembly`.

Zero ops, zero `D1/Vectorize` cost, ideal for a public, page-shaped, deploy-coupled blog as described in [Pagefind Explained](/posts/tech/2026-08-22-pagefind-static-search-en). Downsides were fixed: freshness coupled to deploy, no semantic queries like “the article about why an agent forgets”, and limited relevance control beyond `facet`. The site still keeps it: the `404` page loads `PagefindUI`, while the main search has moved on.

### v2 — RAG Phase 1A: pure vector (2026-04-23 `c72a9b1f`)

`feat(p2): 實作 RAG chat 系統 Phase 1A` added `migrations/0002_rag_phase1.sql:10` (`chunks_fts` + `post_chunks`) but `src/lib/rag/tools/search-posts.ts` only used vectors:

```ts
// 2026-04-23
const embResult = await AI.run('@cf/baai/bge-large-en-v1.5', { text: [query] })
const queryVector = embResult.data[0]
```

The `BM25` table existed but search did not use it; `LIKE` remained as the `keyword` fallback. Using `bge-large-en-v1.5` (`512` dims, English) for a `zh-TW` knowledge base and Traditional Chinese queries was inherently weak — the motive for later model switches.

### v3 — Hybrid Search lands (2026-05-12 `104430c3`)

`feat(blog): RAG pipeline 升級` created `src/lib/rag/tools/hybrid-search.ts:1` with `RRF_K=60`, `buildFtsQuery()`, `reciprocalRankFuse()`, and rewrote `search-posts.ts` to run `searchVectorPosts() + searchBm25Posts()` in parallel then fuse via `RRF`. As [Hybrid Search: BM25 + Vector](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf-en) explains, `BM25` covers exact terms (`Longdong 5.11a`), vectors cover semantics (`beginner-friendly`), and `K=60` smooths extremes.

The `chunks_fts` schema was still default `unicode61`:

```sql
CREATE VIRTUAL TABLE chunks_fts USING fts5(content, chunk_id UNINDEXED, source_type UNINDEXED);
```

English `cloudflare d1` worked, but the `2`-char Chinese trap was already planted — nobody validated with a `2`-char query at the time.

### v4 — Short-circuit and recall fixes (2026-07-25 `a14afa87` / 2026-08-16 `f1904014`)

`a14afa87 fix(search): hybrid/rag 模式停用 BM25 短路` forced `searchBlogPosts({ shortCircuit:false })` in `src/pages/api/search.ts:36`, with the commit message: `BM25 >=5 skips Vectorize, causing semantic results to always be empty (deduplicated away)`.

`f1904014 fix(rag): 提升知識庫檢索與回答可靠性` fixed three things at once: `scripts/sync-to-d1.ts:55` now maintains `post_chunks` and `chunks_fts` together (avoiding stale FTS after new posts), `hybrid-search.ts:48` changed `shouldShortCircuitBm25(count)` to `shouldUseBm25ShortCircuit(query, count)` (only `isPrecisionQuery(query)` may short-circuit), and corrected `RRF` normalization plus `isWeakRetrieval(threshold=0.4)`. It recognized “scores are not comparable” and “weak retrieval needs retry”, but still not Chinese segmentation.

### v5 — Multilingual vectors and count fixes (2026-08-16 `d39cee31` / `d567c0ed`)

`d39cee31 fix(rag): 導入 Qwen3 0.6B` replaced `bge-large-en` with `@cf/qwen/qwen3-embedding-0.6b` (`1024` dims, `QWEN3_QUERY_INSTRUCTION`), separating `queries/documents/text` — ending the English-model penalty for Traditional Chinese. `d567c0ed fix(search,post): ...搜尋結果數量不足` added `dedupeBySlug(limit)` — `RRF` now takes `limit*3` then dedupes by `slug`, fixing “`limit=12` but only `7` after dedup”. That also locked the ceiling at `12`.

### v6 — Today: `41` truths compressed to ~10

After `v1..v5`, the stack is `FTS5 + Qwen3 Vectorize + RRF + dedupeBySlug(12)`. English and `3-4`-char Chinese are stable, but `2`-char `認證` hits both `tokenizer` and `limit` pitfalls at once.

## Problem

Three counts side by side make the bug obvious:

* File layer: `grep -rl "認證" src/content/posts --include="*.md" | wc -l` → `149`
* Lexical DB: `SELECT count(*) FROM posts WHERE content LIKE '%認證%'` → `41`; `SELECT count(*) FROM post_chunks WHERE content LIKE '%認證%'` → `76`
* Retrieval layer: `SELECT count(*) FROM chunks_fts` → `0`; `SELECT count(*) FROM chunks_fts WHERE chunks_fts MATCH '"認證"'` → `0`

The `keyword` path (`LIKE`) finds `41`, but `hybrid`'s `BM25` contributes `0` — only the vector channel remains. With `topK = limit * 3 = 36` then `dedupeBySlug(limit)` squeezed to `12`, only ~10 distinct slugs remain.

More precisely, `src/pages/api/search.ts:18` clamps `limit` to `1..20`, `SearchWidget.tsx:105` hard-codes `limit=12`, and there is no `offset` or total — `149` hits can only ever show `12`.

## Investigation

### 1. Is it just frontend truncation?

`SearchWidget.tsx:105` fetches `/api/search?q=...&mode=hybrid&limit=12` and `src/pages/api/search.ts:36` calls `searchBlogPosts({ query, limit, shortCircuit:false })`. `curl` against the API also returned ~10, ruling out a pure frontend issue. `git log -- src/components/Search/SearchWidget.tsx` confirmed `limit=12` has been frozen since `d567c0ed`.

### 2. Keyword vs. hybrid

`src/pages/api/search.ts:59` (`keyword` branch) is plain `LIKE '%認證%'` and returns `41`. The `hybrid` branch goes through `search-posts.ts:127` (`searchBm25Posts()` + `searchVectorPosts()`), where `searchBm25Posts` builds `MATCH` via `buildFtsQuery()`. For `認證`:

```ts
// src/lib/rag/tools/hybrid-search.ts:59
export function buildFtsQuery(query: string): string | null {
  const rawTokens = normalized.match(/[\p{L}\p{N}][\p{L}\p{N}-]*/gu) ?? []
  // "認證" -> ['認證'] -> '"認證"'
}
```

That `'"認證"'` was validated in an in-memory `FTS5` — all three tokenizers return `0`:

```python
import sqlite3
con = sqlite3.connect(":memory:")
cur = con.cursor()
cur.execute("CREATE VIRTUAL TABLE t USING fts5(x);")
cur.execute("INSERT INTO t VALUES (?)", ("認證機制很重要",))
for q in ['"認證"', '認證', '"認" OR "證"', '認']:
    cur.execute("SELECT x FROM t WHERE t MATCH ?", (q,))
    print(q, len(cur.fetchall()))  # all 0
# trigram also 0 for 2-char, only 3-4 char match
```

This matches the warning in the site's article:

> FTS5's default `unicode61` does not do Chinese word segmentation — a continuous Han string is treated as **a single token**. So “龍洞” cannot find “龍洞岩場”, the BM25 channel is effectively dead, and it fails silently without an error. [Hybrid Search: BM25 + Vector](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf-en)

That article also notes `trigram` supports substrings but Cloudflare endorses it for `LIKE '%term%'`, not specifically for CJK, and `2`-character queries still need special handling — exactly what we observed (`2`-char fails, `4`-char `認證機制` succeeds).

### 3. Why is local `chunks_fts` empty?

`migrations/0002_rag_phase1.sql:10` created `chunks_fts` without a `tokenize` argument (default `unicode61`). `scripts/sync-to-d1.ts:55` inserts into both `post_chunks` and `chunks_fts` per chunk, but locally `chunks_fts_content` was `0` while `post_chunks` had `4560` — the table had been recreated without re-running `pnpm sync`. Even when populated, `unicode61` still returns `0` for `2`-char Chinese, so “empty table” and “wrong tokenizer” are two independent failures — `f1904014` fixed sync but not segmentation.

### 4. The vector-side ceiling

`src/lib/rag/tools/search-posts.ts:105` queries `VECTORIZE_INDEX.query(queryVector, { topK: limit * 3 })` — for `limit=12` that's `36` candidates, then `reciprocalRankFuse()` and `dedupeBySlug(limit)` compress to `12`. A 2-character Chinese short query generalizes semantically, so lexical recall is weaker than exact terms; with `limit` and dedup, the `41`-post truth is truncated to ~10. This has been frozen since `d567c0ed`.

## Solution

Three layers, ordered by risk, echoing tradeoffs left by `v1..v5`:

### Layer 1: No schema change — ship today

**Goal: restore recall from 10 to 41.**

1. **Add `LIKE` fallback to `searchBm25Posts` / `searchBm25Docs`**: when `buildFtsQuery()` is empty or `bm25Results.length === 0` and the query contains Han (`/\p{Script=Han}/u`), run `LIKE '%認證%'` for `limit*3` rows and feed through the same `RRF` and `dedupeBySlug`. This is the inverse of `f1904014`'s `isWeakRetrieval` — that patch retries when vectors are weak; here we compensate when lexical is `0`.

2. **Fix `buildFtsQuery` for Chinese**: for pure Han tokens of length `2-4`, also emit char-level `OR`, e.g. `認證` → `'"認證" OR "認" OR "證"'`. This lets `unicode61` match on single-char tokens instead of failing on the whole string. Existing tests like `buildFtsQuery('Context Engineering 跟 Prompt Engineering 差在哪')` stay green; only `^[\p{Script=Han}]{2,4}$` gets the extra branch.

3. **Merge `keyword` results into `hybrid`**: in `src/pages/api/search.ts:36`, when `isWeakRetrieval(posts)` (`hybrid-search.ts:48`, `maxScore < 0.4`), fuse the `LIKE` results as a third `RRF` input.

### Layer 2: Fix FTS itself (requires migration — get approval)

`unicode61` + app-level splitting stops the bleeding, but the index should natively support Chinese substrings:

```sql
-- new migration, rebuild chunks_fts
DROP TABLE IF EXISTS chunks_fts;
CREATE VIRTUAL TABLE chunks_fts USING fts5(
  content, chunk_id UNINDEXED, source_type UNINDEXED,
  tokenize='trigram'
);
INSERT INTO chunks_fts(content, chunk_id, source_type)
  SELECT content, id, 'post' FROM post_chunks;
```

`trigram` handles `>=3`-char substrings, but `2`-char still needs Layer 1 `LIKE` ([SQLite FTS5 trigram docs](https://sqlite.org/fts5.html#the_trigram_tokenizer) — `trigram` is in units of 3). Re-run `pnpm sync` locally and `pnpm sync:prod` so `chunks_fts` goes from `0` back to `4560`.

For precise word-level matching, the alternative is app-layer segmentation with space-separated tokens in `chunks_fts`, as with [Typesense Site Search](/posts/tech/2026-08-22-typesense-site-search-en) (`locale: zh` + `pre_segmented_query`): both sides must share the same segmentation, or queries will never match.

### Layer 3: Make “41 results” visible

* API: relax `src/pages/api/search.ts:18` to `limit 50`, add `offset` and `total`/`hasMore`, using the `LIKE` count on `posts` as one `total` source (addressing the `limit=12` ceiling locked in `v5`).
* Frontend: add “Load more” and a count (`41`) in `SearchWidget.tsx`.
* Evaluation: create an expected top-3 list for `10` representative queries (`認證`, `認證機制`, `Blue UAS`, etc.) — the “query set first, ranking second” principle from [Pagefind Explained](/posts/tech/2026-08-22-pagefind-static-search-en) and [Algolia Site Search](/posts/tech/2026-08-22-algolia-site-search-en).

## Why This Happens

A stack of `v1..v6`, each necessary:

1. **Tokenizer choice carried over**: `v3`'s `unicode61` treats continuous Han as one token, so `2`-char never matches; `trigram` needs at least `3`. The site article warned this, Cloudflare docs do not endorse `trigram` for CJK — it must be validated — yet `f1904014` and `d39cee31` focused on multilingual vectors and short-circuit, not segmentation.

2. **No lexical fallback**: `search-posts.ts:127` returns empty on `0` instead of falling back to `LIKE`. The `41` posts from `keyword` never reach `hybrid`, and `isWeakRetrieval` existed but was not used for a third `RRF` merge.

3. **Product-layer truncation frozen**: `d567c0ed`'s `dedupeBySlug(limit=12)` fixed the `7`-result display bug but locked the ceiling at `12`; with no `offset` or total, `41` is forever perceived as ~10.

## Takeaways

* **Test Chinese recall separately**: `MATCH` working for `cloudflare d1` does not mean `認證` works. After `v5` switched to `Qwen3`, validate `MATCH` for `2`-char, `4`-char, and mixed CJK+English (10 each) before shipping — cheaper than patching `LIKE` later.
* **Silent failures are the most expensive**: FTS returning `0` throws no error — it just recalls less. `f1904014` already exposed `bm25_results=0` in `getSearchMetrics()`; return `metrics` from the API and alert on it, not just log it.
* **Hybrid value is complementarity**: vectors help vague queries, BM25 helps exact terms; when both are weak (2-char Chinese + short-query generalization), `RRF` cannot invent recall — a third `LIKE` baseline is required, the same problem `v4`'s short-circuit tried to solve but never for Chinese.
* **Fix recall before ranking**: as both `Pagefind` and `Algolia` articles stress, get `data-pagefind-body` / `searchableAttributes` and a query set right before tuning weights or rerankers. `v5`'s dedup fix moved `7` to `12`, but did nothing for `MATCH 0`.

## Update Log

- 2026-08-30: Added companion reading from the “RAG Techniques” series.
- 2026-08-30: Added to the “Ask AI in Practice” series as the first Chinese-retrieval incident.

## References

- [Hybrid Search: BM25 + Vector Search to Cover Each Other's Blind Spots](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf-en)
- [Pagefind Explained: Full-Text Search for Astro Without a Search Backend](/posts/tech/2026-08-22-pagefind-static-search-en)
- [Typesense Site Search: Turning Full-Text Search into a Controllable Feature](/posts/tech/2026-08-22-typesense-site-search-en)
- [Algolia Site Search: Hosted Index, Ranking, and InstantSearch](/posts/tech/2026-08-22-algolia-site-search-en)
- [Elasticsearch and OpenSearch: From Lucene to Site Search](/posts/tech/2026-08-22-elasticsearch-opensearch-site-search-en)
- [Self-Hosted Search Stack: How to Assemble SearXNG + Crawl4AI](/posts/ai/2026-08-21-self-hosted-search-stack-en)
- [SQLite FTS5 Trigram Tokenizer](https://sqlite.org/fts5.html#the_trigram_tokenizer)
- [Cloudflare D1 Best Practices: Use Indexes](https://developers.cloudflare.com/d1/best-practices/use-indexes/)
- [Cloudflare Vectorize](https://developers.cloudflare.com/vectorize/)
- [Cloudflare Workers AI - Embedding Models](https://developers.cloudflare.com/workers-ai/models/)
