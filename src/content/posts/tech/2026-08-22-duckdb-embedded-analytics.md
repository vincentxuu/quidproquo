---
title: "DuckDB：把 OLAP Query Engine 放進 Process 裡"
date: 2026-08-22
category: tech
type: deep-dive
tags: [duckdb, olap, analytics, parquet, sql]
lang: zh-TW
tldr: "DuckDB 是 in-process columnar OLAP database，擅長直接分析 Parquet、CSV 與 DataFrame；它不是一般 web app 的多使用者 OLTP server。"
description: "介紹 DuckDB 的 embedded、vectorized、columnar 設計，Parquet pushdown、資料匯入與 concurrency 邊界，並比較 SQLite 與資料倉儲。"
series:
  name: "AI 時代的技術選擇"
  order: 124
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-duckdb-embedded-analytics-en)

[DuckDB](https://duckdb.org/docs/stable/why_duckdb) 是 in-process analytical database。它像 library 一樣嵌入 Python、R、Node.js 或 CLI，不需另啟 database server；columnar execution 與 vectorized processing 則針對 scan、aggregation、join 等 OLAP workload。最實用的能力，是直接 query Parquet、CSV、JSON、DataFrame 與 object storage，不必先建一套 warehouse ingestion pipeline。

## Query files，而不是先搬資料

```sql
SELECT region, sum(amount) AS revenue
FROM read_parquet('s3://bucket/orders/*.parquet')
WHERE ordered_at >= DATE '2026-08-01'
GROUP BY region
ORDER BY revenue DESC;
```

Parquet column projection 與 filter pushdown 可少讀資料，但效能仍受 file size、partition layout、network、compression 與 row-group statistics 影響。先用 `EXPLAIN ANALYZE` 與實際檔案量測，不要把「能直接讀」誤認成「任何 layout 都快」。需要重複查詢時，可 materialize 成 DuckDB table。

## Embedded 的優勢也是 concurrency 邊界

In-process 省掉 network hop、服務維運與資料複製，適合 notebook、CI data checks、local analytics、ETL、feature engineering 與單機應用。官方 concurrency 文件的主要模型是單一 process 內多 threads；多 process 寫同一檔案不是通用 primary-server 架構。Web app 若有大量獨立 clients、細小 concurrent writes、HA 與權限隔離需求，應選 MySQL/PostgreSQL 或 managed warehouse。

SQLite 同樣 embedded，重點偏 transactional application storage；DuckDB 偏 analytical scans。BigQuery、Snowflake 等 warehouse 提供 central governance、elastic multi-user compute 與服務級維運，成本與資料搬移也更高。DuckDB 常是它們的前處理、local cache 或小中型替代，而非所有情境的取代品。

AI workflow 可用 DuckDB 掃 evaluation results、token logs、Parquet dataset 與 embeddings metadata。仍要限制不可信 SQL、extension 安裝與外部檔案/network access；embedded 不代表 sandbox。

## 參考資料

- [Why DuckDB](https://duckdb.org/docs/stable/why_duckdb)
- [Querying Parquet files](https://duckdb.org/docs/stable/data/parquet/overview)
- [Concurrency](https://duckdb.org/docs/stable/connect/concurrency)
- [Securing DuckDB](https://duckdb.org/docs/stable/operations_manual/securing_duckdb/overview)
