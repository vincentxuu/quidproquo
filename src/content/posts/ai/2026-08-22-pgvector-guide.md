---
title: "pgvector 深入介紹：把向量搜尋放回 PostgreSQL"
date: 2026-08-22
category: ai
type: deep-dive
tags: [pgvector, vector-database, postgresql, rag, embedding]
lang: zh-TW
tldr: "pgvector 是 PostgreSQL extension，不是獨立向量資料庫；它用同一份資料模型、交易與維運工具承接精確或近似向量搜尋，代價是索引調校與水平擴充仍屬 PostgreSQL 問題。"
description: "從 PostgreSQL 資料模型與交易出發，拆解 pgvector 的寫入、距離查詢、HNSW、IVFFlat、iterative scans、條件過濾與正式環境維運。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-pgvector-guide-en)

[pgvector](https://github.com/pgvector/pgvector) 是 PostgreSQL extension，不是另一套獨立向量資料庫。安裝後，你仍然連線到 PostgreSQL、建立一般資料表、寫 SQL，只是多了向量資料型別、距離運算子，以及 HNSW、IVFFlat 兩種近似最近鄰索引。

這個定位決定了它的價值：商品、租戶、權限、原文與 embedding 可以放在同一列，關聯資料和向量更新也能包在同一個交易裡。你不用另外同步一套 vector store，備份、複寫、權限與觀測也能沿用 PostgreSQL。

反過來說，pgvector 不會把 PostgreSQL 變成天生的分散式向量搜尋引擎。分片、容量規劃、vacuum、索引重建和高可用仍要由 PostgreSQL 架構承擔。若還在做初步選型，可先讀站內的[向量資料庫比較](/posts/ai/2026-03-12-vector-database-comparison)，再回來判斷「少一套系統」是否比專用資料庫的擴充能力更重要。

## 資料模型：向量就是交易資料的一部分

pgvector 目前提供 `vector`、半精度的 `halfvec`、二進位 `bit` 與稀疏向量 `sparsevec`。它們是 PostgreSQL 欄位型別，不是藏在外部服務裡的 opaque object，因此可以和外鍵、唯一限制、JSONB、列級安全性及一般索引一起建模。

```sql
CREATE EXTENSION vector;

CREATE TABLE documents (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tenant_id bigint NOT NULL,
  source_url text NOT NULL,
  content text NOT NULL,
  embedding vector(1536) NOT NULL,
  UNIQUE (tenant_id, source_url)
);

CREATE INDEX documents_tenant_id_idx ON documents (tenant_id);
```

PostgreSQL 的 [`CREATE EXTENSION`](https://www.postgresql.org/docs/current/extend-extensions.html) 會把 extension 的型別、函式與索引存取方法當成一組受管理的物件。pgvector [README](https://github.com/pgvector/pgvector/blob/master/README.md?plain=1) 目前以 0.8.6 示範安裝，支援 PostgreSQL 13 以上；部署時仍應鎖定實際使用的 extension 版本，不要在正式環境直接追 `master`。

真正的差別在交易邊界。新增文件時，可以把原文與 embedding 一起提交；任一步失敗，整筆回滾。這避免「主資料已更新，向量索引還沒同步」的雙寫狀態。

```sql
BEGIN;

INSERT INTO documents (tenant_id, source_url, content, embedding)
VALUES (42, 'https://example.com/a', '...', $1)
ON CONFLICT (tenant_id, source_url) DO UPDATE
SET content = EXCLUDED.content,
    embedding = EXCLUDED.embedding;

COMMIT;
```

## 寫入與查詢：先保留精確搜尋基準

大量初始載入可用 binary `COPY`，並在資料載入後再建索引；這也是官方 README 的建議。日常更新則是普通的 `INSERT`、`UPDATE`、`DELETE` 或 upsert，會走 PostgreSQL 的 write-ahead log。

沒有近似索引時，pgvector 預設做精確最近鄰搜尋。這很適合資料量不大、需要完整 recall，或建立測試基準：

```sql
SELECT id, content,
       embedding <=> $1::vector AS cosine_distance
FROM documents
WHERE tenant_id = 42
ORDER BY embedding <=> $1::vector
LIMIT 10;
```

`<->` 是 L2 distance、`<#>` 是 negative inner product、`<=>` 是 cosine distance。查詢要寫成「距離運算式升冪排序加 `LIMIT`」，planner 才有機會使用對應的向量索引。選哪個距離不是資料庫偏好，而是 embedding 模型與正規化方式的契約；上線前應拿真實查詢集同時測 latency 與 recall。

實際動作是先保留一組精確搜尋結果，再新增近似索引。之後每次改索引參數，都拿相同查詢集比較 top-k 重疊率，別只看單次查詢快了多少。

## HNSW、IVFFlat 與條件過濾

HNSW 建立多層圖，不需要先訓練；依官方說明，它通常有較好的速度／recall 取捨，但建置較慢、使用較多記憶體。IVFFlat 先把向量分到多個 lists，建置較快且較省記憶體，但需要資料先存在，並調整 `lists` 與查詢時的 `probes`。

```sql
CREATE INDEX CONCURRENTLY documents_embedding_hnsw_idx
ON documents USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- 記憶體受限、願意自行校準 recall 時的替代方案
CREATE INDEX CONCURRENTLY documents_embedding_ivfflat_idx
ON documents USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

兩種都屬 approximate nearest neighbor（ANN）索引：加上索引後，結果可能和精確掃描不同。HNSW 可用 `hnsw.ef_search` 調整查詢候選集；IVFFlat 可用 `ivfflat.probes` 增加搜尋的 lists。數值提高通常會多做工作，也可能提升 recall，不能把一組預設值套到所有資料。

最容易踩坑的是 filter。pgvector 的 approximate index 先掃向量索引，再套用 `WHERE`；若租戶條件只保留少量候選，`LIMIT 10` 可能拿不滿。pgvector [0.8.0 changelog](https://github.com/pgvector/pgvector/blob/master/CHANGELOG.md#080-2024-10-30) 加入 iterative index scans，讓索引在過濾後筆數不足時繼續掃，直到取得足夠結果或碰到上限。

```sql
BEGIN;
SET LOCAL hnsw.iterative_scan = relaxed_order;
SET LOCAL hnsw.ef_search = 100;

WITH candidates AS MATERIALIZED (
  SELECT id, content, embedding <=> $1::vector AS distance
  FROM documents
  WHERE tenant_id = 42
  ORDER BY distance
  LIMIT 10
)
SELECT * FROM candidates
ORDER BY distance + 0;
COMMIT;
```

`strict_order` 維持嚴格距離順序；`relaxed_order` 允許輕微亂序來換取較好的 recall，再以 materialized CTE 重排。高選擇性的固定條件也可考慮 partial index；條件種類很多時，則要測一般 B-tree filter、partitioning 與 iterative scan 的組合。不要假設建了 `tenant_id` B-tree，planner 就必然能先過濾再走 HNSW。

## 部署與維運：沿用 PostgreSQL，也承擔 PostgreSQL

pgvector 使用 WAL，因此可納入 PostgreSQL 複寫與 point-in-time recovery。這不等於「裝完 extension 就有高可用」：還是要驗證備份能還原、備援節點已安裝相同 extension，以及升級順序能讓 `CREATE EXTENSION`／`ALTER EXTENSION` 找到對應檔案。

正式環境初建索引用 `CREATE INDEX CONCURRENTLY`，避免一般建索引長時間阻擋寫入。批次載入先 `COPY`、後建索引；查詢變慢先跑：

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT id
FROM documents
WHERE tenant_id = 42
ORDER BY embedding <=> $1::vector
LIMIT 10;
```

監控至少分兩層：用 `pg_stat_statements` 看延遲與呼叫量，用「ANN 結果對精確掃描」的離線查詢集看 recall。HNSW vacuum 可能花較久，官方建議必要時先 concurrent reindex，再 vacuum。索引大小、dead tuples、WAL 量與記憶體工作集都要進容量規劃。

PostgreSQL 18 的[官方發佈說明](https://www.postgresql.org/about/news/postgresql-18-released-3142/)加入非同步 I/O，並強化 `EXPLAIN ANALYZE` 的 buffer、WAL 與讀取觀測資訊；這些是 PostgreSQL 整體能力，不代表任何 pgvector 查詢會自動得到固定倍數的加速。升級前仍要用自己的資料與查詢計畫驗證。

## 什麼時候適合，什麼時候不適合

適合 pgvector 的情境很明確：產品資料已在 PostgreSQL；向量必須和權限、租戶、庫存或文件版本一起交易；團隊想沿用 SQL、備份與監控；目前規模能在單一 PostgreSQL 叢集及其讀取副本內處理。這時少掉雙寫和第二套維運面，通常比追求紙面最高 ANN throughput 更有價值。

不適合的訊號也很清楚：向量是系統的主要資料而非附屬欄位；必須跨節點自動分片並持續擴張；需要專用引擎原生提供的分散式索引生命週期；或過濾與多向量查詢模式經實測無法在 PostgreSQL planner 與索引限制內達標。這時應評估專用向量資料庫，而不是用更大的 `work_mem` 延後架構決策。

最實際的選型方式：先用真實 schema、過濾比例與 embedding 建一個 pgvector 試驗；保存精確搜尋作為 recall 基準；對 HNSW、IVFFlat 分別量寫入、p95 latency、recall、索引大小與重建時間。若它達標，你得到的是一個欄位型別加索引，而不是另一個要照顧的資料平台。

## 參考資料

- [pgvector README](https://github.com/pgvector/pgvector/blob/master/README.md?plain=1)
- [pgvector changelog](https://github.com/pgvector/pgvector/blob/master/CHANGELOG.md)
- [PostgreSQL：Packaging Related Objects into an Extension](https://www.postgresql.org/docs/current/extend-extensions.html)
- [PostgreSQL：Transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html)
- [PostgreSQL：Backup and Restore](https://www.postgresql.org/docs/current/backup.html)
- [PostgreSQL 18 Released](https://www.postgresql.org/about/news/postgresql-18-released-3142/)
- [Vector Database 選型：Pinecone、Weaviate、Qdrant、Vectorize 怎麼選](/posts/ai/2026-03-12-vector-database-comparison)
