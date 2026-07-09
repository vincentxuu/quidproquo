---
title: "PostgreSQL 就夠了？從島島的四個資料庫回頭看這個問題"
date: 2026-07-09
type: deep-dive
category: tech
tags: [postgresql, database, redis, clickhouse, architecture, pgvector]
lang: zh-TW
tldr: "大部分團隊不需要五種資料庫。PostgreSQL 的擴充生態已經能覆蓋快取、佇列、全文搜尋、向量搜尋，但真正的判斷標準不是「能不能做」，而是「維運成本 vs 效能需求」的交叉點在哪裡。"
description: "「Just Use Postgres」運動的實戰評估：逐一分析 PostgreSQL 替代 Redis、Elasticsearch、MongoDB、向量資料庫的可行性與取捨，以島島（DaoDao）從 PostgreSQL 出發、最終用了四個資料庫的經驗，提出什麼時候該繼續撐、什麼時候該上專用方案的判斷框架。"
draft: false
---

🌏 [English version](/posts/tech/deep-dive/2026-07-09-postgres-unified-database-en)

「Just Use Postgres」這個口號最近在技術社群很流行。論點很簡單：你的快取不需要 Redis，佇列不需要 RabbitMQ，搜尋不需要 Elasticsearch，向量不需要 Pinecone——PostgreSQL 一個就能扛。

這個說法對不對？看你的規模。

島島（DaoDao）現在用四個資料庫：PostgreSQL、Redis、ClickHouse、Qdrant。但如果重新開始，前六個月我只會用 PostgreSQL。不是因為其他資料庫不好，而是在真正碰到瓶頸之前，多管一套系統的維運成本，遠大於那點效能差距。

---

## 替換表：不是每個都等價

網路上流傳的替換表長這樣：

| 你以為需要的 | PostgreSQL 替代方案 |
|---|---|
| Redis（快取） | UNLOGGED table、物化視圖 |
| RabbitMQ（佇列） | SKIP LOCKED、pgmq |
| Elasticsearch（搜尋） | tsvector、pg_trgm |
| MongoDB（文件） | JSONB |
| Pinecone（向量） | pgvector |
| InfluxDB（時序） | TimescaleDB |
| Neo4j（圖） | Apache AGE、遞迴 CTE |

這張表本身沒問題，但它把「能做」和「好用」混在一起了。實際上這些替換方案可以分成三個等級：

### 幾乎無痛的替換

**JSONB 取代 MongoDB**——這個在多數場景下甚至更好。你拿到 JSONB 的 GIN 索引、`@>`containment 查詢、jsonpath，同時保留 ACID transaction 和 JOIN 的能力。MongoDB 的 document model 強迫你把相關資料塞在同一個 document 裡避免跨 collection 查詢，但現實世界的資料關係不總是能嵌套的。PostgreSQL 讓你混用關聯和文件兩種模型。

**pgvector 取代專用向量資料庫**——pgvectorscale 在 50M 向量的 benchmark 上做到比 Pinecone 低 28 倍的 p95 延遲。對大部分應用來說，把向量和業務資料放在同一個資料庫裡、用一條 SQL 做 JOIN，比維護兩個系統之間的同步管線省事太多了。

**SKIP LOCKED 取代簡單佇列**——`SELECT ... FOR UPDATE SKIP LOCKED` 是 PostgreSQL 原生的 concurrent job processing 機制。Graphile Worker（Node.js）、River（Go）、Oban（Elixir）都是建在這上面的生產級佇列。對每秒幾十到幾百個 job 的工作量，完全夠用。

### 堪用但有明確取捨

**UNLOGGED table 取代 Redis 快取**——UNLOGGED table 跳過 WAL，寫入快很多，但它重啟就沒了、沒有原生 TTL、沒有 Redis 的 sorted set 和 HyperLogLog。如果你的快取需求就是「存 API response，過期就重查」，用物化視圖加 `REFRESH MATERIALIZED VIEW CONCURRENTLY` 反而更穩。但如果你需要 sub-millisecond 的熱讀取，或是 BullMQ 這種重度依賴 Redis 資料結構的工具，PostgreSQL 就扛不了。

**tsvector + pg_trgm 取代 Elasticsearch**——PostgreSQL 的全文搜尋拿來做部落格的站內搜尋、幾十萬筆商品的搜尋，完全沒問題。ParadeDB 把 BM25 algorithm 搬進 PostgreSQL，更進一步。但 Elasticsearch 的巢狀聚合、叢集級別的水平擴展、Kibana 生態系——如果你在做 log analytics 或 petabyte 級的搜尋，PostgreSQL 不是對手。

**TimescaleDB 取代 InfluxDB**——hypertable 加上連續聚合，對時序資料是很好的選擇，而且你保留完整 SQL 能力。但 TimescaleDB 本身就是一個需要維護的擴充，它不是「只用 PostgreSQL」，它是「用 PostgreSQL 的擴充生態」。

### 勉強替換，但你會後悔

**Apache AGE 取代 Neo4j**——簡單的圖查詢可以，但深層多跳遍歷在幾十億邊的圖上會很痛。遞迴 CTE 在超過 5-6 層深度時效能急劇下降。如果你的核心業務是社交圖譜或知識圖譜，PostgreSQL 不是正確的選擇。

**PostgreSQL 取代 Kafka**——LISTEN/NOTIFY 和 pgmq 能做簡單的訊息傳遞，但 Kafka 的 log-based 架構（有序、分區、可重播、多 consumer group）是根本上不同的東西。如果你需要高吞吐的事件串流，PostgreSQL 不行。

---

## 真正的論點是維運成本

「Just Use Postgres」的核心論點不是 PostgreSQL 什麼都比專用方案強——它不是。核心論點是：**多管一套系統的隱藏成本被嚴重低估了**。

每多一個資料庫，你就多了：

- 一套備份和還原流程要測試
- 一套監控和告警要設定
- 一套身份驗證和網路安全要管理
- 一套升級和版本相容性要追蹤
- 一個凌晨三點 on-call 工程師需要懂的系統
- 一個兩個系統之間資料一致性可能出錯的地方

對五人團隊來說，管 PostgreSQL + Redis + Elasticsearch + ClickHouse 四個資料庫，意味著每個工程師都需要對每個系統有基本的維運能力。這不是技術問題，是人力問題。

而且最常被忽略的成本是**資料同步**。當你的搜尋索引在 Elasticsearch、主資料在 PostgreSQL、快取在 Redis，你永遠在處理「為什麼搜到的資料和實際不一樣」的 bug。資料放在同一個資料庫裡，用一個 transaction 寫入，這類問題直接消失。

---

## 島島的經驗：為什麼最後用了四個

島島從 PostgreSQL 起步，後來加了 Redis、ClickHouse、Qdrant。每一個都是碰到具體瓶頸才加的：

**Redis**——不是因為 PostgreSQL 做不了快取，而是因為 BullMQ。島島的通知系統（email、push notification、in-app）用 BullMQ 做非同步任務佇列，BullMQ 底層綁定 Redis，沒有 PostgreSQL 的替代方案。同時 Redis 也順便扛了 API response 快取和 Session 儲存——既然已經跑了一個 Redis，讓它多做兩件事的邊際成本趨近零。

**ClickHouse**——使用者行為事件（瀏覽頁面、點擊、停留時間）每天寫入幾百萬筆，AI 推薦引擎需要對這些事件做聚合分析。PostgreSQL 跑 `GROUP BY event_type, date_trunc('hour', created_at)` 在幾千萬行上開始拖慢其他 OLTP 查詢。ClickHouse 的欄導向儲存對這種聚合查詢快 10-50 倍，而且跟 PostgreSQL 的 OLTP 工作負載完全隔離。

**Qdrant**——AI 推薦引擎需要在幾百萬個向量裡做 nearest neighbor 搜尋，同時支援多租戶的 metadata filtering。當時 pgvector 還不夠成熟（沒有 DiskANN 索引、filtering 效能不好），Qdrant 已經有穩定的 HNSW 實作和 payload filtering。

**如果是現在重新選**——pgvector + pgvectorscale 已經追上來了，我會認真考慮直接用 PostgreSQL 取代 Qdrant，少管一套系統。ClickHouse 和 Redis 的使用場景比較難替換——前者是真正的 OLAP 工作負載，後者是被生態綁定（BullMQ）。

---

## 判斷框架：什麼時候該繼續撐

做決策時我會問三個問題：

### 1. 瓶頸是真的還是想像的？

「我們以後可能需要處理大量搜尋」不是加 Elasticsearch 的理由。先用 PostgreSQL 的 tsvector 跑起來，等它真的變慢了、你有具體的 query plan 和延遲數字可以分析，再評估替代方案。

你會驚訝 PostgreSQL 能撐多久。有人在 HN 分享用單台 PostgreSQL 撐 40 億筆記錄、適當的 partition 和 partial index——公司後來被收購了，所以他同意 PostgreSQL 確實夠了。

### 2. 新系統解決的是 PostgreSQL 的限制，還是你用 PostgreSQL 的方式有問題？

很多時候「PostgreSQL 太慢」的根因是：
- 缺少合適的索引
- query 寫法有問題（N+1、不必要的 JOIN）
- 沒用 connection pooling（PgBouncer）
- 沒有適當的 partition

在加新系統之前，先確認你已經用對了現有的。

### 3. 維運預算夠不夠？

如果你的團隊有專職 DBA 或 SRE，加一個專用資料庫的邊際成本比較低。但如果你是三個全端工程師的小團隊，多管一套系統意味著每個人要多學一套東西，on-call 複雜度直接翻倍。

---

## 0.3% 的陷阱

只有大約 0.3% 的專案會真正到 webscale。但技術選型的時候，團隊經常按照那 0.3% 的需求來設計架構。

這有個名字：**resume-driven development**。選 Kafka 不是因為你需要事件串流，是因為你想在履歷上寫 Kafka。選微服務不是因為你的團隊大到需要獨立部署，是因為微服務聽起來比較厲害。

Notion 用的是「無聊」的技術。Instagram 早期整個架構就是 PostgreSQL + Redis + Memcached。Netflix 的創新是在影片串流和推薦演算法，不是在資料庫選型。

把創新額度花在你的核心產品上，基礎設施用最無聊、最多人踩過坑的方案。

---

## PostgreSQL 真正扛不住的地方

公平起見，列出 PostgreSQL 的硬限制：

| 場景 | 為什麼 PostgreSQL 不夠 | 該用什麼 |
|---|---|---|
| 持續 >1,500 writes/sec 且持續成長 | 單一寫入節點架構，無法水平擴展寫入 | CockroachDB、Cassandra、DynamoDB |
| 幾十億行的聚合分析 | 缺乏跨節點的 intra-query 平行化 | ClickHouse、DuckDB、Snowflake |
| Sub-millisecond 熱讀取 | 磁碟 I/O 延遲無法跟純記憶體比 | Redis |
| 全球多區域 active-active | 不是為分散式設計的 | CockroachDB、Spanner |
| 高吞吐事件串流 | LISTEN/NOTIFY 不是 log-based 架構 | Kafka、Redpanda |

注意這些都是很具體的條件。如果你的寫入量是每秒幾十筆、資料量在幾千萬行、使用者在同一個區域，這些限制你一個都碰不到。

---

## 結論

「PostgreSQL 就夠了」這句話，對 95% 的團隊來說是正確的——但重點不是 PostgreSQL 有多強，而是你還不需要那些專用方案。

實戰的建議：

1. **從 PostgreSQL 開始**，把 JSONB、tsvector、pgvector 都先用上
2. **等到有具體的瓶頸數據**，而不是想像中的未來需求
3. **加專用方案時要有明確的隔離理由**——是工作負載衝突（OLTP vs OLAP）、還是生態綁定（BullMQ → Redis）、還是效能硬限制
4. **每加一個系統，問自己：誰來維運？凌晨三點它掛了誰會修？**

最後引用 POSETTE 2025 Postgres 大會的一句話：

> PostgreSQL is the best because it's good enough for the task you didn't know you had.

先用 PostgreSQL 撐住。等你真的需要別的東西時，你會知道的——因為你手上會有數據，不是猜測。

## 參考資料

- [Just Use Postgres for Everything](https://www.amazingcto.com/postgres-for-everything/) — Amazing CTO
- [You Don't Need All Those Databases](https://www.postgresql.org/about/news/posette-2025/) — POSETTE 2025 Postgres Conference
- [pgvectorscale: 28x lower p95 latency than Pinecone](https://www.timescale.com/blog/pgvector-is-now-as-fast-as-pinecone-at-75-less-cost/) — Timescale
- [Instacart: Migrating from Elasticsearch to PostgreSQL](https://tech.instacart.com/) — Instacart Engineering
- [島島（DaoDao）技術架構全覽](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture) — quidproquo
- [ClickHouse：當 PostgreSQL 的分析查詢開始變慢](/posts/tech/2026-03-27-clickhouse-analytics-database) — quidproquo
- [Redis 入門：快取、Session、Pub/Sub 一次搞懂](/posts/tech/2026-03-27-redis-cache-queue-overview) — quidproquo
