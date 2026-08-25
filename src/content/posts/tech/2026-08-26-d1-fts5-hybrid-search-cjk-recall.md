---
title: "搜尋只回 10 筆的解法：Cloudflare D1 FTS5 與 Hybrid Search 中文召回實戰"
date: 2026-08-26
category: tech
type: debug
tags: [hybrid-search, fts5, d1, bm25, vector-search, cloudflare, rag]
lang: zh-TW
tldr: "查「認證」只有 10 筆，149 篇裡 41 篇命中被漏掉：D1 FTS5 的 unicode61 對 2 字中文失效、本地 chunks_fts 0 筆、加上硬上限 12 的共同結果；用 LIKE fallback 與拆字 OR 先把召回補回來，再補 trigram 重建與分頁。"
description: "以 quidproquo.cc 從 Pagefind 到 D1+Vectorize Hybrid Search 的完整演進為線，拆解「認證」2 字中文召回失敗的現場、FTS5 tokenizer 與分頁疊加的成因，並給出可複製的三層修復。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-26-d1-fts5-hybrid-search-cjk-recall-en)

## TL;DR

在 [quidproquo.cc/search/?q=認證](https://quidproquo.cc/search/?q=%E8%AA%8D%E8%AD%89) 查「認證」只回 10 多筆，但 `grep` 顯示站上有 `149` 個檔案、`509` 次命中，以 `LIKE '%認證%'` 驗證 `posts` 表有 `41` 篇、`post_chunks` 有 `76` 個 chunk 命中。本地 D1 的 `chunks_fts` 卻是 `0` 筆——即使重建，`unicode61` 與 `trigram` 對 `2` 字詞仍會 `MATCH 0`。解法分三層：先在應用層做 `LIKE` fallback 與拆字 `OR` 把召回補回來，再用 migration 把 `chunks_fts` 重建為可支援中文的形態並跑 `pnpm sync`，最後把 API 與前端的硬上限 `12` 改為分頁。本文同時用 `git log` 回顧本站搜尋從第一版 `Pagefind` 到 `Hybrid Search` 的演進，說明每個階段為何留下今天的坑。

## 情境

本站搜尋不是一開始就做 `Hybrid Search`。跟著 `git log -- src/pages/search.astro src/pages/api/search.ts src/lib/rag/tools/search-posts.ts` 可以看到五次關鍵轉折，現在的 `src/pages/api/search.ts:14`、`src/lib/rag/tools/search-posts.ts:195`、`src/lib/rag/tools/hybrid-search.ts:59` 與 `src/components/Search/SearchWidget.tsx:105` 只是最後一版。

寫作期間驗證「認證」主題覆蓋度，直覺應有數十篇，實際搜尋頁卻只列 `10` 多筆。`curl /api/search?q=認證&mode=hybrid&limit=12` 同樣只有 `10`，代表是檢索層召回不足，而非前端截斷。底下先把演進攤開，再進現場。

## 演進：從第一版到現在

### v1 — Pagefind 純靜態（2026-03-13 `9687eb1f`）

第一版搜尋沒有後端。`feat: RSS feed, Pagefind search` 在 `src/pages/search.astro` 放入 `PagefindUI`，`npx pagefind --site dist` 在 `astro build` 後掃 `dist/**/*.html` 產生 `pagefind/` 索引，查詢在瀏覽器以 `WebAssembly` 完成。

這版零維運、零 `D1/Vectorize` 成本，如 [Pagefind 完整介紹](/posts/tech/2026-08-22-pagefind-static-search)所述，適合「公開、頁面為單位、跟著部署更新」的部落格。但缺點也固定：索引新鮮度跟部署綁定、無法做語意查詢如「那篇談 agent 為什麼會忘記的文章」、也沒有 `facet` 以外的 relevance 控制。站上至今保留：`404` 頁仍載入 `PagefindUI`，主搜尋頁則已遷走。

### v2 — RAG Phase 1A：純向量（2026-04-23 `c72a9b1f`）

`feat(p2): 實作 RAG chat 系統 Phase 1A` 新增 `migrations/0002_rag_phase1.sql:10` 的 `chunks_fts` 與 `post_chunks`，但 `src/lib/rag/tools/search-posts.ts` 當時僅走向量：

```ts
// 2026-04-23 版
const embResult = await AI.run('@cf/baai/bge-large-en-v1.5', { text: [query] })
const queryVector = embResult.data[0]
const filter = { type: { $eq: 'post' } }
```

`BM25` 表已建好但未被搜尋使用，`LIKE` 仍是 `keyword` 模式的後備。這版用 `bge-large-en-v1.5`（`512` 維、英文）對 `zh-TW` 知識庫與繁中查詢天生不利，也埋下後來換模型的動機。

### v3 — Hybrid Search 上線（2026-05-12 `104430c3`）

`feat(blog): RAG pipeline 升級` 新建 `src/lib/rag/tools/hybrid-search.ts:1`，定義 `RRF_K=60`、`buildFtsQuery()`、`reciprocalRankFuse()`，並把 `search-posts.ts` 改為 `searchVectorPosts() + searchBm25Posts()` 雙路 `topK` 後 `RRF` 融合。如 [Hybrid Search：BM25 + 向量搜尋](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf)所述，`BM25` 補精確詞（`龍洞 5.11a`）、向量補語意（`適合初學者`），`K=60` 避免名次極端。

此時 `chunks_fts` 建表語法仍是預設 `unicode61`：

```sql
CREATE VIRTUAL TABLE chunks_fts USING fts5(content, chunk_id UNINDEXED, source_type UNINDEXED);
```

對英文 `cloudflare d1` 正常，但對 `2` 字中文已埋雷，只是當時無人用 `2` 字詞驗收。

### v4 — 短路與召回的反覆修正（2026-07-25 `a14afa87` / 2026-08-16 `f1904014`）

`a14afa87 fix(search): hybrid/rag 模式停用 BM25 短路` 把 `src/pages/api/search.ts:36` 的 `searchBlogPosts({ shortCircuit:false })` 固定為 `false`，原因寫得很直白：`BM25 >=5 就跳過 Vectorize，導致語意相關永遠回空（結果被關鍵字去重吃掉）`。

`f1904014 fix(rag): 提升知識庫檢索與回答可靠性` 則一次修三事：`scripts/sync-to-d1.ts:55` 同步維護 `post_chunks` 與 `chunks_fts`（避免新文不同步）、把 `hybrid-search.ts:48` 從 `shouldShortCircuitBm25(count)` 改為 `shouldUseBm25ShortCircuit(query, count)`（僅 `isPrecisionQuery(query)` 才短路）、校正 `RRF` 正規化與 `isWeakRetrieval(threshold=0.4)`。此版已意識到「分數不可直接比較」與「弱召回需重試」，但仍未處理中文分詞。

### v5 — 多語向量與數量修正（2026-08-16 `d39cee31` / `d567c0ed`）

`d39cee31 fix(rag): 導入 Qwen3 0.6B` 把 `bge-large-en` 換為 `@cf/qwen/qwen3-embedding-0.6b`（`1024` 維、`QWEN3_QUERY_INSTRUCTION`），區分 `queries/documents/text`，結束英文模型對繁中查詢的劣勢。`d567c0ed fix(search,post): ...搜尋結果數量不足` 新增 `dedupeBySlug(limit)`，`RRF` 先取 `limit*3` 再按 `slug` 去重——修掉「`limit=12` 卻因同篇多 `chunk` 去重後只剩 `7`」的坑，但也把天花板從 `7` 鎖到 `12`。

### v6 — 現在：`41` 篇真相被壓成 `10` 多筆

經歷 `v1..v5` 後，架構已是 `FTS5 + Qwen3 Vectorize + RRF + dedupeBySlug(12)`，英文與 `3-4` 字中文表現穩定，卻在 `2` 字詞 `認證` 上同時踩中 `tokenizer` 與 `limit` 兩坑，進入本文的現場。

## 問題

把三個現場數字並排，問題就很清楚：

* 檔案層：`grep -rl "認證" src/content/posts --include="*.md" | wc -l` → `149` 個檔案
* 資料庫 lexical：`SELECT count(*) FROM posts WHERE content LIKE '%認證%'` → `41`；`SELECT count(*) FROM post_chunks WHERE content LIKE '%認證%'` → `76`
* 檢索層：`SELECT count(*) FROM chunks_fts` → `0`；`SELECT count(*) FROM chunks_fts WHERE chunks_fts MATCH '"認證"'` → `0`

`keyword` 模式的 `LIKE` 能找到 `41` 篇，但 `hybrid` 的 `BM25` 貢獻 `0`，只剩向量一路。向量 `topK = limit * 3 = 36`，再經 `dedupeBySlug(limit)` 壓到 `12`，最終去重後只剩 `10` 多個不同 `slug`。

更精確的說，`src/pages/api/search.ts:18` 把 `limit` 鉗在 `1..20`，`SearchWidget.tsx:105` 寫死 `limit=12`，沒有 `offset` 與總數，`149` 命中也只能看 `12`。

## 嘗試過程

### 1. 先確認是不是前端截斷

檢查 `SearchWidget.tsx:105` 的 `fetch(/api/search?q=...&mode=hybrid&limit=12)` 與 `src/pages/api/search.ts:36` 的 `searchBlogPosts({ query, limit, shortCircuit:false })`。`limit 12` 是天花板，但 `curl` 下同樣只回 `10`，排除純前端問題。也用 `git log -- src/components/Search/SearchWidget.tsx` 確認 `limit=12` 自 `d567c0ed` 後未再動過。

### 2. 對照 keyword 與 hybrid

`src/pages/api/search.ts:59` 的 `keyword` 分支是單純的 `LIKE '%認證%'`，實測可回 `41`。`hybrid` 分支走 `search-posts.ts:127` 的 `searchBm25Posts()` + `searchVectorPosts()`，`searchBm25Posts` 用 `buildFtsQuery()` 組 `MATCH`。以 `認證` 為例：

```ts
// src/lib/rag/tools/hybrid-search.ts:59
export function buildFtsQuery(query: string): string | null {
  const rawTokens = normalized.match(/[\p{L}\p{N}][\p{L}\p{N}-]*/gu) ?? []
  // "認證" -> ['認證'] -> '"認證"'
}
```

這組出來的 `'"認證"'` 丟進 `:memory:` 的 `FTS5` 驗證，三種 `tokenize` 皆 `0`：

```python
import sqlite3
con = sqlite3.connect(":memory:")
cur = con.cursor()
cur.execute("CREATE VIRTUAL TABLE t USING fts5(x);")
cur.execute("INSERT INTO t VALUES (?)", ("認證機制很重要",))
for q in ['"認證"', '認證', '"認" OR "證"', '認']:
    cur.execute("SELECT x FROM t WHERE t MATCH ?", (q,))
    print(q, len(cur.fetchall()))  # 皆 0
# trigram 對 2 字詞同樣 0，3-4 字詞才命中
```

對照站內文章風險完全一致：

> FTS5 預設的 `unicode61` 並不做中文斷詞——連續漢字會被當成**單一個 token**。結果就是「龍洞」查不到「龍洞岩場」，BM25 那一路等於形同虛設，而且不會報錯，只會安靜地少召回。[Hybrid Search：BM25 + 向量](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf)

該文也指出 `trigram` 可支援子字串，但官方是為 `LIKE '%term%'` 背書，非為 CJK 背書，且 `2` 字查詢在 `trigram` 下仍需特殊處理——與本次實測的 `2` 字失效、`4` 字 `認證機制` 才命中一致。

### 3. 為什麼本地 `chunks_fts` 是 0

`migrations/0002_rag_phase1.sql:10` 建立 `chunks_fts` 時未指定 `tokenize`，走預設 `unicode61`。`scripts/sync-to-d1.ts:55` 會對每個 `chunk` 同時 `INSERT INTO post_chunks` 與 `INSERT INTO chunks_fts`，但本地 `chunks_fts_content` 計數為 `0`，`post_chunks` 卻有 `4560` 筆，代表同步後未正確填入或曾被重建後未重跑 `pnpm sync`。即使填入，`unicode61` 對 `2` 字中文仍 `MATCH 0`，所以「表是空的」與「tokenizer 不支援」是兩個獨立問題——`f1904014` 修過同步，但未修分詞。

### 4. 檢查向量一路的天花板

`src/lib/rag/tools/search-posts.ts:105` 的 `VECTORIZE_INDEX.query(queryVector, { topK: limit * 3 })` 對 `limit=12` 僅取 `36` 個候選，再經 `reciprocalRankFuse()` 與 `dedupeBySlug(limit)` 壓到 `12`。中文 `2` 字短查詢的 embedding 語意泛化，對「認證」這類精確詞召回本就弱於 lexical，再被 `limit` 與去重壓縮，`41` 篇真相自然被截成 `10` 多筆。這段邏輯自 `d567c0ed` 去重修復後就固定如此。

## 解法

採三層修復，依風險與成本由低到高，呼應 `v1..v5` 每版留下的取捨：

### 第一層：不動 schema，當天可上線

**目標是先把召回從 10 補回 41**。

1. **為 `searchBm25Posts` / `searchBm25Docs` 補 `LIKE` fallback**：當 `buildFtsQuery()` 為空或 `bm25Results.length === 0` 且 query 含 `Han`（`/\p{Script=Han}/u`），改走 `LIKE '%認證%'` 取 `limit*3` 筆後同樣走 `RRF` 與 `dedupeBySlug`。這是 `f1904014` 的 `isWeakRetrieval` 反向應用：當時是向量弱時重試，這次是 lexical 為 `0` 時補位。

2. **修 `buildFtsQuery` 的中文拆字**：對 `2-4` 字純漢字 `token` 同時產生單字 `OR`，例如 `認證` → `'"認證" OR "認" OR "證"'`。讓 `unicode61` 以單字 `token` 命中，避免整串當單一 `token` 導致 `0`。已有測試 `buildFtsQuery('Context Engineering 跟 Prompt Engineering 差在哪')` 要保留，僅對 `^[\p{Script=Han}]{2,4}$` 加分支。

3. **讓 `hybrid` 合併 `keyword` 結果**：在 `src/pages/api/search.ts:36` 當 `isWeakRetrieval(posts)`（`hybrid-search.ts:48` 的 `maxScore < 0.4`）時，把 `keyword` 的 `LIKE` 結果以第三路 `RRF` 合併。

### 第二層：修 FTS 本體（需 migration，需先取得同意）

`unicode61` + 應用層拆字是止血，長期仍應讓索引本身支援中文子字串：

```sql
-- 新 migration，重建 chunks_fts
DROP TABLE IF EXISTS chunks_fts;
CREATE VIRTUAL TABLE chunks_fts USING fts5(
  content, chunk_id UNINDEXED, source_type UNINDEXED,
  tokenize='trigram'
);
INSERT INTO chunks_fts(content, chunk_id, source_type)
  SELECT content, id, 'post' FROM post_chunks;
```

`trigram` 對 `>=3` 字子字串有效，但 `2` 字仍需保留第一層 `LIKE`（[SQLite FTS5 trigram 文件](https://sqlite.org/fts5.html#the_trigram_tokenizer) 說明 `trigram` 以 `3` 字為單位）。重建後本地與正式皆重跑 `pnpm sync` / `pnpm sync:prod`，使 `chunks_fts` 從 `0` 回到 `4560`。

若要更精準的詞級斷詞，替代方案是應用層斷詞後以空白分隔存入 `chunks_fts`，如 [Typesense 站內搜尋](/posts/tech/2026-08-22-typesense-site-search) 的 `locale: zh` 與 `pre_segmented_query` 思路——兩邊必須共用同一套規則，否則永遠對不上。

### 第三層：把「看得到 41 篇」做完整

* API：`src/pages/api/search.ts:18` 放寬 `limit` 至 `50`、新增 `offset` 與 `total`/`hasMore`，並以 `posts` 表 `LIKE` 計數作為 `total` 來源之一（回應 `v5` 的 `limit=12` 天花板）。
* 前端：`SearchWidget.tsx` 加入「載入更多」與結果計數 `41`。
* 評測：為 `認證`、`認證機制`、`Blue UAS` 等 `10` 組代表查詢建立期望前 `3` 名清單，如 [Pagefind 完整介紹](/posts/tech/2026-08-22-pagefind-static-search) 與 [Algolia 站內搜尋](/posts/tech/2026-08-22-algolia-site-search) 強調的「先有查詢集，再調排名」。

## 為什麼會這樣

`v1..v6` 的疊加缺一不可：

1. **Tokenizer 選型沿用**：`v3` 的 `unicode61` 把連續漢字當單一 `token`，`2` 字詞永遠 `0`；`trigram` 雖支援子字串，但最小 `3` 字。站內文章已預警，官方未為 CJK 背書 `trigram`，需自行實測——`f1904014` 與 `d39cee31` 專注於多語向量與短路，未覆蓋此分支。

2. **缺少 lexical fallback**：`search-posts.ts:127` 在 `0` 結果時直接回空，未降級到 `LIKE`。`keyword` 的 `41` 篇因此永遠進不了 `hybrid`，`isWeakRetrieval` 雖已存在但未用於 `hybrid` 的第三路合併。

3. **產品層截斷固化**：`d567c0ed` 的 `dedupeBySlug(limit=12)` 修掉 `7` 筆的顯示坑，卻把天花板鎖在 `12`；無 `offset` 與總數，使用者對 `41` 的感知永遠是 `10` 多筆。

## 學到的事

* **中文查詢要單獨做召回測試**：`v3` 英文 `cloudflare d1` 的 `MATCH` 正常，不代表 `認證` 正常。`v5` 換 `Qwen3` 後更應對 `2` 字、`4` 字、中英混寫各 `10` 組實測 `MATCH`，比事後補 `LIKE` 便宜。
* **安靜的失敗最貴**：FTS `0` 不報錯，只少召回。`f1904014` 已在 `getSearchMetrics()` 暴露 `bm25_results=0`，應在 API 回傳 `metrics` 的同時告警，而非僅記錄。
* **Hybrid 的價值在互補**：向量對模糊查詢有效、BM25 對精確詞有效，兩路皆弱時（`2` 字中文 + 短查詢泛化），`RRF` 無法憑空生出召回，必須有第三路 `LIKE` baseline——這正是 `v4` 短路修正想解決但未對中文生效的同一問題。
* **先修召回，再調排序**：如 `Pagefind` 與 `Algolia` 強調，先有 `data-pagefind-body` / `searchableAttributes` 與查詢集，再談權重與 reranker。`v5` 先調 `dedupe` 能把 `7` 修到 `12`，但對 `MATCH 0` 毫無幫助。

## 參考資料

- [Hybrid Search：BM25 + 向量搜尋彌補彼此的盲區](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf)
- [Pagefind 完整介紹：Astro 靜態網站如何做到零後端全文搜尋](/posts/tech/2026-08-22-pagefind-static-search)
- [Typesense 站內搜尋：把全文檢索做成可控制的產品功能](/posts/tech/2026-08-22-typesense-site-search)
- [Algolia 站內搜尋深入介紹：託管索引、排名與 InstantSearch](/posts/tech/2026-08-22-algolia-site-search)
- [Elasticsearch 與 OpenSearch：從 Lucene 全文檢索到站內搜尋的選型](/posts/tech/2026-08-22-elasticsearch-opensearch-site-search)
- [自架搜尋堆疊：SearXNG + Crawl4AI 怎麼拼](/posts/ai/2026-08-21-self-hosted-search-stack)
- [SQLite FTS5 Trigram Tokenizer](https://sqlite.org/fts5.html#the_trigram_tokenizer)
- [Cloudflare D1 Best Practices: Use Indexes](https://developers.cloudflare.com/d1/best-practices/use-indexes/)
- [Cloudflare Vectorize](https://developers.cloudflare.com/vectorize/)
- [Cloudflare Workers AI - Embedding Models](https://developers.cloudflare.com/workers-ai/models/)
