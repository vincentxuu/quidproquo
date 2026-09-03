---
title: "Ask AI 的文章怎麼進知識庫：Chunk、D1 FTS5 與 Vectorize"
date: 2026-08-30
category: ai
type: guide
tags: [rag, indexing, chunking, d1, fts5, vectorize, cloudflare]
lang: zh-TW
tldr: "Ask AI 的 production 索引分兩階段：先用 source hash 增量更新 D1、post_chunks 與 FTS5，再以 embedding checkpoint 和 delete queue 讓 Vectorize 非同步追上；兩邊不是同一個 transaction。"
description: "追蹤 quidproquo Markdown 文章從 chunking、D1 與 FTS5 同步，到 Workers AI embedding、Vectorize upsert、刪除佇列與 freshness check 的完整索引流程。"
draft: true
series:
  name: "Ask AI 實戰"
  order: 1
---

> 🌏 [English version](/en/posts/ai/2026-08-30-ask-ai-indexing-pipeline-en)

> **搭配閱讀（選讀）**：零基礎可以直接讀本文。想先補概念，可搭配〈[Chunking 策略：切塊方式決定 RAG 能不能找到答案](/posts/ai/2026-03-12-chunking-strategies)〉與〈[Vector Database 選型：Pinecone、Weaviate、Qdrant、Vectorize 怎麼選](/posts/ai/2026-03-12-vector-database-comparison)〉。

一篇 Markdown 文章存進 repo，不會立刻變成 Ask AI 的可用證據。它還要通過發布資格、切成 chunk、寫入 D1、加入 FTS5，最後產生 embedding 並 upsert 到 Vectorize。這幾步若只完成一半，BM25 與向量搜尋看到的資料就可能不同步。

Ask AI 的 production indexing 刻意分成兩個階段：**D1、`post_chunks` 與 FTS5 在一個 D1 batch 內對齊；Vectorize 再透過 checkpoint 與 delete queue 非同步追上。** 這不是一個涵蓋兩種儲存的 transaction。理解這條界線，才知道「文章已部署」「全文找得到」和「向量已更新」為什麼是三件事。

## 第一步：只收進可被搜尋的文章

[`scripts/sync-to-d1.ts`](https://github.com/vincentxuu/quidproquo/blob/main/scripts/sync-to-d1.ts) 遞迴掃描 `src/content/posts/**/*.md`，解析 frontmatter 與正文。以下文章會被排除：

- `draft: true`。
- `search: false`。
- 日期尚未到，而且這次沒有明確使用 `--include-future`。

符合條件的文章會整理出 slug、title、category、language、description、tldr、tags 與正文。程式再把這些欄位連同 sync schema version 算成 `source_hash`。Production sync 先向 `/api/index/posts/sync` 取得遠端 slug/hash manifest，只有 hash 改變的文章才送 upsert；遠端存在、目前 manifest 不再出現的 slug 則送 delete。

因此一般內容更新是增量同步，不是每次 push 都重建所有文章。`--full` 是明確的 maintenance path，不能把它當成日常 deploy 的預設行為。

## Chunk ID 可重算，但跟文章內的位置有關

[`chunkMarkdown`](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/crawl/chunker.ts) 先依 H1–H3 標題切 section。單一 section 若超過 1,500 個字元，再依段落累積切開。每個 chunk 的 ID 是：

```text
sha256(slug + "::" + chunk_index).slice(0, 16)
```

固定公式讓同一個 slug 與位置能重算出同一個 ID，也讓 D1 row、FTS row 與 Vectorize vector 可以用 `chunk_id` 對接。但它不是內容雜湊：若文章前面新增一段，後續 chunk index 改變，後面的 ID 也可能一起改變。

同步程式還會替每個 chunk 建立 contextual content，加入文章標題、分類與日期，再以 embedding version 和 contextual content 計算 `desired_embedding_hash`。正文沒變但 embedding version 改變時，checkpoint 仍能把該 chunk 標成需要重新 embedding。

## D1、post_chunks 與 FTS5 在同一批寫入

Production endpoint [`/api/index/posts/sync`](https://github.com/vincentxuu/quidproquo/blob/main/src/pages/api/index/posts/sync.ts) 要求 shared secret，限制 request body，並對 operation 數量與 D1 statement 數設上限。解析完成後，[`post-sync.ts`](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/indexing/post-sync.ts) 把一批 operation 交給 `DB.batch`。

一篇文章 upsert 的順序是：

1. 把舊 `post_chunks.id` 放進 `vector_delete_queue`。
2. 刪除舊的 FTS rows 與 `post_chunks`。
3. upsert `posts` 主表與新的 `source_hash`。
4. 插入新的 chunks，寫入 `desired_embedding_hash`，並把 `embedded_hash` 設為空。
5. 若新 chunk ID 仍存活，從 delete queue 移除它。
6. 插入對應的 `chunks_fts` row。

刪除 stale post 時也先 queue 舊 vector ID，再移除 FTS、chunks 與 post。這個順序避免 D1 已刪掉來源後，Vectorize 裡的舊 ID 完全失去清理線索。

FTS5 目前由 [`0025_search_cjk_trigram.sql`](https://github.com/vincentxuu/quidproquo/blob/main/migrations/0025_search_cjk_trigram.sql) 建成 trigram index。它改善三個字以上的 CJK substring matching；兩個字的 query 仍需要應用層 LIKE fallback，不能把 trigram 寫成所有中文短詞都能直接命中。

## Vectorize 用 checkpoint 非同步追上

D1 同步完成後，第二階段才呼叫 [`/api/embed/sync`](https://github.com/vincentxuu/quidproquo/blob/main/src/pages/api/embed/sync.ts)。這個 endpoint 要求管理員 session 或 shared secret，並限制 sources、batch size 與 `full` 參數。

[`embedPosts`](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/indexing/pipeline.ts) 的順序很保守：

1. 先 drain `vector_delete_queue`，每批刪掉舊 Vectorize IDs。
2. Queue 尚未清空時，不做新 vector upsert，回傳 `hasMore: true`。
3. 查出 `embedded_hash` 為空或不同於 `desired_embedding_hash` 的 chunks。
4. 替正文加上 title、category、date context。
5. 用 Workers AI 產生 embedding，upsert 到 `VECTORIZE_INDEX`。
6. Vectorize 成功後，才把 D1 的 `embedded_hash` 更新成 desired value。

如果 embedding 或 upsert 失敗，錯誤會被記在結果裡，checkpoint 保持 pending，下一批可以重試。這能提供可恢復的增量流程，但不代表 D1 與 Vectorize 永遠零延遲同步；兩個階段之間的短暫 lag 是這個設計允許的狀態。

## Deploy workflow 只在相關內容改動後接上 indexing

[`deploy.yml`](https://github.com/vincentxuu/quidproquo/blob/main/.github/workflows/deploy.yml) 會先完成 build、migration 與 Worker deploy。只有 content-index detector 判定需要同步，而且 deploy job 成功後，才呼叫 reusable [`content-index.yml`](https://github.com/vincentxuu/quidproquo/blob/main/.github/workflows/content-index.yml)。

Reusable workflow 依序執行 production D1 sync、pending embedding sync，最後跑 search freshness check。Embedding driver 會反覆呼叫 endpoint，直到 `hasMore` 為 false或碰到設定的 max-batches 上限。

Workflow 的存在能證明預定執行順序，不能證明最近一次 workflow 已成功，也不能證明目前 production 沒有 pending checkpoint。要回答現況，仍要看該次 run 與遠端儲存。

## 重跑本機契約測試

```sh
pnpm exec vitest run \
  src/lib/indexing/post-sync.test.ts \
  src/lib/indexing/pipeline.test.ts \
  src/pages/api/index/posts/sync.test.ts \
  src/pages/api/embed/sync.test.ts
```

這組測試固定 operation 上限、D1 batch 順序、delete queue、checkpoint ack 與 endpoint authorization 等不變量。它不會查 production 儲存內容。

若你有 Cloudflare 權限，可以用唯讀 SQL 查 pending checkpoint：

```sh
npx wrangler d1 execute quidproquo-db --remote --command="
SELECT
  COUNT(*) AS chunks,
  SUM(embedded_hash = desired_embedding_hash) AS embedded,
  SUM(embedded_hash IS NULL OR embedded_hash != desired_embedding_hash) AS pending
FROM post_chunks;"
```

這個查詢能看到 D1 checkpoint，仍不能單獨證明 Vectorize 中每個 ID 與值都正確。Vector count、D1 checkpoint 與一次真實 retrieval observation 要分開保存。

## 證據邊界

Repo 與單元測試能證明索引流程的程式契約：增量 hash、chunk ID、D1/FTS batch、delete queue、embedding checkpoint 與 workflow 順序。它們不能證明 production 索引目前完整、freshness check 最近通過，或某篇文章一定能被某個 query 召回。

另外，`pnpm sync` 的 local path 只同步本機 D1 與 FTS，不能拿來證明 production Vectorize checkpoint 流程。下一篇會從索引的另一端出發，追 Planner 如何把使用者問題送進 metadata、BM25 與 vector lanes。

## 已知限制與改進方向

上面描述的 pipeline 能完成增量同步、FTS 與向量一致性追蹤，但 chunking 階段有幾個已知弱點，值得記在這裡。

### 表格切塊會丟失表頭

`chunkMarkdown` 依 H1–H3 和段落邊界切分。當一張 Markdown 表格跨越 1,500 字元邊界，只有第一個 chunk 保留表頭（`|...|` + `|---|`）。後續 chunk 變成一堆無上下文的 `| cell | cell |` 行，embedding 品質明顯下降——向量無法反映「這是哪張表、哪個欄位」。

最小改動的修補是 **Header Propagation**：splitter 切完後掃描每個 chunk，偵測到 Markdown 表格行但缺少表頭時，把原始表頭 prepend 回去。開源工具 [Chonkie TableChunker](https://docs.chonkie.ai) 已實作此模式：「splits markdown tables by row, always preserving the header」。[arXiv:2605.00318](https://arxiv.org/abs/2605.00318) 的 STC 框架更進一步，以 row 為最小單位切分表格，在 MAUD 法律文件上把 Recall@1 從 0.347 提升到 0.539，chunk 數量反而減少 40%。

Header Propagation 每個 chunk 多約 50 tokens，受影響的文件需要重新 embed。

### Metadata Enrichment 可以再做更多

目前 pipeline 在 embedding 前 prepend 文章標題、分類與日期。這已經是輕量版的 metadata enrichment。[arXiv:2601.11863](https://arxiv.org/abs/2601.11863)（Utilizing Metadata for Better RAG）發現公司名稱加年份提供最強的區分訊號；章節標題路徑主要幫助 chunk 級別的定位。[Microsoft Azure RAG Enrichment Phase](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-enrichment-phase) 建議的完整欄位是 Title、Summary、Keywords、Questions——後兩者需要 LLM 生成，但前兩者不需要額外成本。

對 Ask AI 來說，下一步是把章節標題路徑（H1 → H2 → H3）也加進 contextual content。這不需要 LLM，改動範圍小，可以跟 Header Propagation 疊加。

### Contextual Chunking 是主要升級路徑

[Anthropic Contextual Retrieval](https://platform.claude.com/cookbook/capabilities-contextual-embeddings-guide) 在 ingestion 時用 LLM 為每個 chunk 生成一段 50–100 tokens 的上下文描述，prepend 後再 embed。依 Anthropic 官方數據，搭配 reranking 後 top-20 retrieval failure rate 降低 67%。成本約 $1.02/百萬 document tokens（使用 prompt caching）。

這不只解決表格問題——所有 chunk 的 embedding 品質都會提升。目前 Ask AI 已使用 Claude，prompt caching 可控成本。但需要一次性重新處理所有 chunks。

### Late Chunking 用另一條路省掉 LLM

[Late Chunking](https://arxiv.org/abs/2409.04701)（Günther et al., EMNLP 2024 / SIGIR 2025）反轉傳統的「先切再 embed」順序：把整份文件丟進 long-context embedding model（8K+ tokens），讓 attention 看過全文後才切分。每個 chunk 的 embedding 天然帶有全文上下文，不需要額外 LLM 生成描述。

限制是需要支援 8K+ context 的 embedding model（如 jina-embeddings-v3），而且大文件可能超出 context window。目前 Ask AI 使用 Cloudflare Workers AI 的 embedding model，context 長度是一個需要確認的前提。

更多改進方向：[Hierarchical Chunking + Auto-Merge](/posts/ai/2026-09-03-hierarchical-chunking-auto-merge) 用多粒度索引解決「小 chunk 精準但上下文不足」的矛盾；[Table Serialization](/posts/ai/2026-09-03-table-serialization-rag) 探討表格序列化格式對 embedding 品質的影響。

## 更新紀錄

- 2026-09-03：補充「已知限制與改進方向」段落與四篇參考資料

## 參考資料

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
