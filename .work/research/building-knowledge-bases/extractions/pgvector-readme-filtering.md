# 抽取紀錄：pgvector README — Filtering、Multitenancy、Iterative Index Scans（後過濾的召回限制）

read_status=full（README 原始 Markdown 全文；Filtering 到 Iterative Scan Options、Performance、FAQ／Troubleshooting 逐行讀；Reference 型別表、各平台安裝筆記掃過標題與段落）

## 書目

- pgvector（Andrew Kane 維護），README.md，https://github.com/pgvector/pgvector （raw：https://raw.githubusercontent.com/pgvector/pgvector/master/README.md）
- 安裝範例指向 v0.8.7（README 行 26、43）；iterative index scans 自 0.8.0 起（行 480）。讀取日 2026-10-22（master 分支）。
- 全文檔：scratchpad/fulltext/o17-pgvector-readme.md（1,361 行、42,305 bytes）。已讀：1–945 全部（含 Filtering 行 424–466、Multitenancy 468–476、Iterative Index Scans 478–548、Monitoring 762–766、FAQ 817–889、Troubleshooting 890–945）；946–1361（Reference、Installation Notes、Docker/Homebrew 等安裝方法、Upgrading、History）掃過。原始檔 o17raw/pgvector-README.md。
- scratchpad 完整路徑：/private/tmp/claude-501/-Users-vincent-Work-study-quidproquo/970f061c-9dcb-4134-aaf8-624977a74263/scratchpad/fulltext/
- 下文「行」為 o17-pgvector-readme.md 行號。

## 性質

- 開源專案官方文件。行 450 的數字是依預設參數推得的期望值（10% × 40 = 4），不是實驗結果。本紀錄的角色是「後過濾造成結果不足／召回崩潰」的反證與限制來源。

## 可引用內容（原文）

1. **後過濾數字**（行 450）："With approximate indexes, filtering is applied *after* the index is scanned. If a condition matches 10% of rows, with HNSW and the default `hnsw.ef_search` of 40, only 4 rows will match on average. For more rows, enable iterative index scans, which will automatically scan more of the index when needed."
2. FAQ 同一問題（行 933–935）："Why are there less results for a query after adding an HNSW index? Results are limited by the size of the dynamic candidate list (`hnsw.ef_search`), which is 40 by default. There may be even less results due to dead tuples or filtering conditions in the query."
3. 精確索引適用低命中條件（行 432、444）：先在過濾欄位建一般索引 "can provide fast, exact nearest neighbor search in many cases"；"Exact indexes work well for conditions that match a low percentage of rows. Otherwise, approximate indexes can work better."
4. **多租戶**（行 470–472）："For applications with multiple tenants, sharing an approximate index between tenants means vectors from one tenant can affect recall (and speed) for other tenants." "For tenant isolation, use list partitioning or separate tables."
5. 少數值用部分索引、多值用分割（行 456–466）。
6. Iterative index scans（行 480–548）：0.8.0 起，掃到夠筆數或到上限（`hnsw.max_scan_tuples` 預設 20,000；`ivfflat.max_probes`）才停；strict_order 保證距離順序，relaxed_order 召回較好但順序可能略亂。
7. 預設行為（行 197–199）："By default, pgvector performs exact nearest neighbor search, which provides perfect recall. You can add an index to use approximate nearest neighbor search, which trades some recall for speed."
8. 監控（行 766）："Monitor recall by comparing results from approximate search with exact search."

## 沒寫的事

- 沒談權限或 ACL；過濾例子是 `category_id`。
- 行 450 的 4 筆是平均期望，沒實測分布。
- iterative scan 打開後召回能回到多少沒有數字。

## 與範圍卡說法的核對

- 支持「過濾會降低向量搜尋召回，要量過濾後召回」，並提供最具體的可教數字（行 450）。也提供解法與量法：開 iterative scan、低命中條件改精確索引、用精確搜尋比對近似結果量召回（行 766）。
- 把權限套進來是推論：若一位使用者只能看 10% 的文件、權限條件放在 WHERE 子句、用 HNSW 預設值，平均只會拿回約 4 筆而不是要求的筆數。文章可以這樣舉例，但要說明是依 README 的機制推算。
- 多租戶段（行 470–472）補一個 Pinecone 沒講的理由：共用近似索引時，**別的租戶的向量會影響你的召回**，不只是安全問題。

## 對 order 17 的用法

- 「檢索時過濾」不是只有一種：同樣寫在 WHERE 裡，有近似索引時是「先搜再刪」，結果可能不滿；這是讀者最可能踩到的坑。
- 測試題：用權限最窄的帳號查，檢查回傳筆數是否少於 LIMIT。
