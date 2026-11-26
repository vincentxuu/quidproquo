---
title: "Neon vs Turso：別把兩種 Serverless Database 都叫託管 Postgres"
date: 2026-08-22
category: tech
type: deep-dive
tags: [neon, turso, postgresql, sqlite, serverless-database]
lang: zh-TW
tldr: "Neon 是 serverless PostgreSQL；Turso 是 SQLite 相容路線，Turso Cloud 同時跑 libSQL 與已經 production-ready 的 Turso Database。兩者都強調 scale-to-zero 與開發體驗，compatibility boundary 完全不同；Turso 的 Postgres frontend 仍是 experimental。"
description: "比較 Neon serverless Postgres 與 Turso Cloud 的 libSQL／SQLite 路線，說明 branching、scale-to-zero、embedded replicas、多資料庫與 2026 Turso Postgres 計畫。"
series:
  name: "AI 時代的技術選擇"
  order: 125
draft: false
---

> :globe: [English version](/posts/tech/2026-08-22-neon-vs-turso-managed-databases-en)

「託管 Postgres（Neon／Turso）」這個分類在 2026 年 8 月仍不精確。[Neon](https://neon.com/docs/introduction) 提供與 PostgreSQL 相容的 serverless platform；[Turso Cloud](https://docs.turso.tech/cloud) 則是 SQLite 相容路線：平台上多年來跑的是 libSQL（SQLite 的 fork），現在也能跑從頭重寫、SQLite 相容的 Turso Database。[官方文件](https://docs.turso.tech/libsql) 已把 Turso Database 標成 production-ready，並建議新專案用它，libSQL 留給需要久經考驗基礎的關鍵工作負載。Turso 另外在做 PostgreSQL-compatible frontend，但它在 [Turso 的 README](https://github.com/tursodatabase/turso) 仍列為 experimental，不是可以拿來替代 Postgres 的產品。

## Neon：Postgres compatibility 加上分離 compute/storage

Neon 把 compute 與 storage 分開，compute 可 autoscale、閒置後 scale to zero；branching 以 copy-on-write 建立隔離 database branch，適合 preview environment、migration test 與 agent-generated changes。它仍是 PostgreSQL 語意：既有 driver、SQL、migration 與多數 extension 習慣較容易延續。

代價是 cold start、connection churn、autoscaling threshold 與 compute/storage 分離造成的新效能模型。Serverless runtime 應使用 pooled connection；branch 不等於匿名化，從 production branch 複製出的 PII 仍受相同治理。先驗證使用的 extension、logical replication、region、backup/PITR 與 plan limits。

## Turso：SQLite lineage 與大量隔離 databases

Turso 的強項是 SQLite-compatible API、libSQL 生態、embedded replica/local-first 路徑與 database-per-tenant/agent 的高密度模型。這可減少讀取 latency，讓每個 tenant 或 agent 有獨立 database，也適合 intermittent/edge workloads。它不是把現有 PostgreSQL app 換 connection string 就完成 migration：SQL dialect、types、extensions、concurrency、transaction 與 ecosystem 都不同。

Turso Database 跟 libSQL 的差別在架構：libSQL 沿用 SQLite 的檔案格式與 API；Turso Database 用 Rust 重寫，為 concurrent write、async I/O 與高密度 database 設計，對 SQLite 向後相容。它已經在 production 跑（包括 Turso Cloud 本身），但專案還沒到 1.0，官方 README 也提醒部分功能標為 experimental、要自己保留獨立備份。

Turso 於 2026 年 7 月公布用 Rust 建 PostgreSQL-compatible frontend、編譯到共同 bytecode 的方向，2026-09 的 v0.8.0 開始出現 experimental 的 Postgres 支援（SQL dialect 與 wire protocol）。這是值得追蹤的工程計畫，不應在今天的 production 選型表標成成熟 Postgres 服務。決策紀錄要寫明評估的是 Turso Cloud 上的 libSQL、Turso Database，還是 experimental 的 Postgres frontend；三者的成熟度不同。

## 怎麼選

既有 PostgreSQL workload、需要 relational ecosystem、preview branches 與 scale-to-zero，先看 Neon。需要 embedded/local replicas、大量小型隔離 databases、SQLite compatibility，先看 Turso。兩邊都要以真實 schema、最大 concurrent writes、cold path、restore、region failure、出口流量與月費壓測；「serverless」只是資源與操作模型，不是無限容量或零維運。

## 更新紀錄

- 2026-11-23：Turso Database 已標成 production-ready、官方建議新專案使用，Turso Cloud 也能跑 Turso databases，改寫開頭與決策紀錄段；補上 Postgres frontend 在 v0.8.0 以 experimental 狀態釋出。

## 參考資料

- [Neon documentation overview](https://neon.com/docs/introduction)
- [Neon autoscaling](https://neon.com/docs/introduction/autoscaling)
- [Neon branching](https://neon.com/docs/introduction/branching)
- [Turso Cloud documentation](https://docs.turso.tech/cloud)
- [libSQL and Turso Database](https://docs.turso.tech/libsql)
- [Turso's PostgreSQL-compatible project announcement](https://turso.tech/blog/we-are-building-postgres-in-rust)
- [tursodatabase/turso README](https://github.com/tursodatabase/turso)
- [Turso v0.8.0 release notes](https://github.com/tursodatabase/turso/releases/tag/v0.8.0)
