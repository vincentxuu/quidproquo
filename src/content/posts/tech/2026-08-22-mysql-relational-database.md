---
title: "MySQL：成熟關聯式資料庫，不只是『大家都會用』"
date: 2026-08-22
category: tech
type: deep-dive
tags: [mysql, innodb, sql, database, replication]
lang: zh-TW
tldr: "MySQL 的價值是成熟生態、InnoDB 交易與可預測維運；選它仍要理解索引、隔離級別、replication lag 與 schema migration。"
description: "介紹 MySQL、InnoDB、索引、交易、複寫與高可用邊界，並比較 PostgreSQL、MongoDB 與 DuckDB 的適用情境。"
series:
  name: "AI 時代的技術選擇"
  order: 122
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-mysql-relational-database-en)

[MySQL](https://dev.mysql.com/doc/refman/8.4/en/) 是成熟的 client-server 關聯式資料庫。多數一般部署以 InnoDB 儲存資料，取得 ACID transactions、row-level locking、crash recovery、foreign keys 與 clustered primary key。它不是因為「傳統」就只適合舊系統；大量 SaaS、電商與內容系統真正需要的，正是穩定 SQL、廣泛 driver/ORM 支援與容易找到維運經驗。

## 核心模型是 schema、constraint 與 transaction

把 business invariant 放進 `NOT NULL`、`UNIQUE`、foreign key 與 transaction，比期待每個 API handler 都不犯錯可靠。索引不是免費加速：secondary index 會增加儲存與 write amplification；複合索引是否可用，取決於欄位順序與 query shape。先用 production-like data 跑 `EXPLAIN ANALYZE`，再依讀寫路徑建索引。

InnoDB 預設 isolation level 是 `REPEATABLE READ`，應用仍須處理 deadlock、retry 與過長 transaction。Connection pool 也要設上限；serverless function 無限制擴張 connection，會先耗盡資料庫資源，而不是自動得到無限吞吐。

## Replication 不等於零資料損失

MySQL replication 預設是 asynchronous：source 的變更送到 replica，讀取可水平擴充，但 replica lag 會破壞 read-after-write。GTID 能簡化 failover 與拓撲管理，卻不會自動決定 promotion、DNS、connection draining、backup restore 或 RPO/RTO。Backup 必須實際還原演練；replica 不是備份，誤刪也會被複寫。

## 何時選，何時不選

既有團隊熟 MySQL、workload 以 OLTP 為主、schema 關係清楚，而且 hosted service/工具鏈成熟時，MySQL 是低風險預設。若高度依賴 PostgreSQL extensions、複雜型別與生態，直接選 PostgreSQL。Document shape 快速變動不代表一定選 MongoDB；先看 transaction 與查詢邊界。大量本機分析 Parquet/CSV 則是 DuckDB 的場景，不應把 production MySQL 當 ad-hoc analytics engine。

AI 可以生成 migration 與 query，不能替你承擔 locking、online DDL、replication lag 或 rollback。採用度帶來大量範例，也帶來大量過時設定；以目前使用版本的官方手冊與實測計畫為準。

## 參考資料

- [MySQL 8.4 Reference Manual](https://dev.mysql.com/doc/refman/8.4/en/)
- [InnoDB transaction model](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-model.html)
- [MySQL replication](https://dev.mysql.com/doc/refman/8.4/en/replication.html)
- [EXPLAIN ANALYZE](https://dev.mysql.com/doc/refman/8.4/en/explain.html#explain-analyze)
