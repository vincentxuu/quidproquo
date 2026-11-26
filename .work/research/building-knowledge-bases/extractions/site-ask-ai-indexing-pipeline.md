# 站內摘要：〈Ask AI 的文章怎麼進知識庫：Chunk、D1 FTS5 與 Vectorize〉增量索引要點

用途：order 18 的例子。只摘要點與行號，不是外部來源。

## 出處

- 文章：/Users/vincent/Work/study/quidproquo/src/content/posts/ai/2026-08-30-ask-ai-indexing-pipeline.md（170 行，13,644 bytes；全讀 1–170）。date 2026-08-30，系列「Ask AI 實戰」order 1，2026-09-03 補「已知限制」段。
- 站內連結：/posts/ai/2026-08-30-ask-ai-indexing-pipeline（英文版 …-en）。
- 為了確認兩點文章沒明講的行為，另讀程式碼（2026-10-22 工作樹）：
  - scripts/sync-to-d1.ts 行 120–145（manifest 比對）、180–186（hash 公式）、188–200（排除規則）
  - src/lib/indexing/post-sync.ts 行 85–170（刪除與 upsert 的 D1 statement 順序）

## 要點（文章行號）

1. 誰會進索引（行 26–30）：排除 `draft: true`、`search: false`、未到發布日（除非 `--include-future`）。→ 把文章改成 draft 或 `search: false`，下次同步它就不在 manifest 裡，會被當成刪除處理（見第 3 點）。
2. 用內容 hash 判斷變更（行 32）：slug、title、category、language、description、tldr、tags、正文，加上 sync schema version，算成 `source_hash`（程式：`sha256(JSON.stringify({ version: SYNC_SCHEMA_VERSION, ...post }))`，sync-to-d1.ts 行 180–182）。
3. 增量＋刪除都靠 manifest 比對（行 32–34）：先向 `/api/index/posts/sync` 取遠端 slug/hash 清單；hash 不同才 upsert；遠端有、本地 manifest 沒有的 slug 送 delete。`--full` 是維護用，不是日常路徑。
   - 程式防呆（sync-to-d1.ts 行 125–127）：本地合格文章清單為空時拋錯「Refusing to sync with an empty eligible post manifest」，避免一次刪光（對照 LangChain full 模式「清單不完整就誤刪」的風險）。
4. chunk ID 是位置不是內容（行 38–44）：`sha256(slug + "::" + chunk_index).slice(0, 16)`；前面插一段，後面 chunk 的 ID 都可能變。
5. embedding 另有自己的 hash（行 46）：`desired_embedding_hash` = embedding version＋contextual content（標題、分類、日期＋chunk 內容）；換 embedding version 時即使正文沒變也會標成要重算（sync-to-d1.ts 行 184–186）。
6. D1 單批對齊（行 50–61）：一篇文章 upsert 的順序——舊 chunk ID 先進 `vector_delete_queue` → 刪舊 FTS 與 chunks → upsert posts 與新 `source_hash` → 插新 chunks（`embedded_hash` 設空）→ 新 ID 若跟舊的一樣就從 delete queue 移除 → 插新 FTS row。刪除文章時也是先 queue 舊 vector ID，再刪 FTS、chunks、post（行 61）。理由：D1 刪掉來源後，Vectorize 的舊 ID 仍有清理線索。
7. 「刪除要清哪幾處」在本站就是這幾處（post-sync.ts 行 91–101）：`chunks_fts`、`posts_fts`、`post_chunks`、`posts`，再加 Vectorize（經 `vector_delete_queue` 非同步刪）。共 4 張 D1 表＋1 個向量索引。
8. Vectorize 非同步追上（行 67–78）：`/api/embed/sync` 先清 delete queue；queue 沒清空就不做新 upsert（回 `hasMore: true`）；再挑 `embedded_hash` 為空或不等於 desired 的 chunk 去 embed、upsert；Vectorize 成功後才把 `embedded_hash` 寫回。失敗就留在 pending，下一批重試。
9. 延遲是設計允許的（行 22、78）：D1／FTS 與 Vectorize 不是同一個 transaction；兩階段之間的短暫 lag 是允許狀態。「文章已部署」「全文找得到」「向量已更新」是三件事。
10. 觸發與監控（行 82–86、100–111）：deploy 成功且 content-index detector 判定有關內容改動才跑 content-index workflow：D1 sync → embedding sync（直到 `hasMore` false 或 max-batches）→ search freshness check。可用 SQL 數 pending checkpoint；但 D1 checkpoint 不能單獨證明 Vectorize 每個 ID 都對，vector count、checkpoint 與一次真實 retrieval 要分開保存。
11. 證據邊界（行 86、115–117）：workflow 存在不代表最近一次成功；本機 `pnpm sync` 只同步本機 D1 與 FTS，不碰 production Vectorize。

## 文章沒寫、但程式顯示的行為（寫進文章前可再確認）

- 只改 tags 或 description 也會重算整篇的 embedding：`source_hash` 含這些欄位 → 整篇走 upsert → 所有新 chunk 的 `embedded_hash` 設 NULL（post-sync.ts 行 154–160）→ embed sync 會全部重算，即使 contextual content（只含標題、分類、日期）沒變。這與 Bedrock「只改 metadata 不重算」相反，是本站可改進處，也是很好的對照例子。
- 同 ID 的舊向量不進刪除佇列（post-sync.ts 行 164），靠之後 upsert 覆蓋；所以在 embed sync 跑完前，Vectorize 裡那個 ID 仍是舊內容的向量——新舊並存窗（對照 LangChain 文件行 46–49）。

## 對 order 18 的用法

- 「設計增量同步流程」的完整例子：內容 hash → manifest 比對（新增／修改／刪除）→ 先登記要刪的 ID → 單批改全文索引 → 向量庫非同步追上 → checkpoint 與 freshness check。
- 「刪除要清哪幾處」：本站 4 張 D1 表＋Vectorize；外加快取等文章沒提的地方要讀者自己盤點。
- 自我檢查題的本站版本：只刪 Markdown、不跑 sync → D1 與 Vectorize 都還在，Ask AI 照樣能引用。
