---
title: "Supabase：把整個後端建在 PostgreSQL 上的平台"
date: 2026-08-21
category: tech
type: deep-dive
tags: [supabase, postgresql, baas, pgvector, realtime, open-source, database]
lang: zh-TW
tldr: "Supabase 不只是 Firebase 的開源替代，它的核心設計是把 Auth、Storage、Realtime 全部建在 PostgreSQL 的 schema 和 WAL 上。結果是：你可以用一條 SQL 查所有東西，pgvector 直接用，agent 寫 SQL 就能操作整個平台。108k GitHub stars、Apache 2.0 授權、Free 方案 500 MB 資料庫。"
description: "Supabase 架構拆解：Auth 是 Postgres 表、Storage metadata 是 Postgres 表、Realtime 讀 WAL。為什麼「一切都是 SQL」對 AI agent 特別有利，以及它的定價、pgvector 整合、MCP server 的實際狀態。"
draft: false
series:
  name: "AI 時代的技術選擇"
  order: 20
glossary:
  - term: "BaaS"
    aliases: ["Backend-as-a-Service"]
    definition: "後端即服務，提供資料庫、驗證、儲存等後端功能的雲端平台，讓開發者不用自己架設伺服器。"
    definition_en: "Backend-as-a-Service — a cloud platform providing database, auth, storage and other backend capabilities so developers don't need to run their own servers."
  - term: "WAL"
    aliases: ["Write-Ahead Log"]
    definition: "PostgreSQL 的預寫日誌，所有資料變更先寫進 WAL 再落盤，用於保證交易安全和資料複寫。"
    definition_en: "Write-Ahead Log — PostgreSQL writes all changes to this log before committing to disk, ensuring transaction safety and enabling replication."
  - term: "RLS"
    aliases: ["Row Level Security"]
    definition: "PostgreSQL 的列層級安全性，透過 policy 控制每個使用者能看到和修改哪些資料列。"
    definition_en: "Row Level Security — PostgreSQL's mechanism for controlling which rows each user can see and modify through declarative policies."
---

> 🌏 [English version](/posts/tech/2026-08-21-supabase-postgres-platform-en)

[Supabase](https://supabase.com/) 常被介紹成「開源的 Firebase 替代方案」。這個定位沒有錯，但它遮蔽了 Supabase 真正有意思的架構決策：**整個平台建立在 PostgreSQL 之上**，而不是另起一個資料模型。

Auth 的使用者資料存在 PostgreSQL 的 `auth` schema。Storage 的檔案 metadata 存在 PostgreSQL 的 `storage` schema。Realtime 讀的是 PostgreSQL 的 WAL（Write-Ahead Log）。這代表你可以用 SQL 查所有東西——而在 AI 時代，這件事的價值比看起來的大很多。

截至 2026 年 8 月，Supabase 在 [GitHub 有 108k stars](https://github.com/supabase/supabase)，Apache 2.0 授權，預設跑 PostgreSQL 17。

---

## 架構：七個服務，一個 PostgreSQL

Supabase 的架構可以這樣理解：**一個 PostgreSQL 資料庫實例，前面放了七個服務**，每個服務負責一件事，全部透過 Envoy API gateway 統一入口。

| 服務 | 功能 | 底層技術 | 授權 |
|---|---|---|---|
| [PostgREST](https://postgrest.org/) | 從 database schema 自動產生 REST API | Haskell | MIT |
| [GoTrue](https://github.com/supabase/auth) | JWT 驗證、使用者管理 | Go | MIT |
| [Realtime](https://github.com/supabase/realtime) | WebSocket 推播資料庫變更 | Elixir / Phoenix | Apache 2.0 |
| [Storage API](https://github.com/supabase/storage-api) | S3 相容的物件儲存 | TypeScript | Apache 2.0 |
| [pg_graphql](https://github.com/supabase/pg_graphql) | GraphQL API（PostgreSQL extension） | Rust | Apache 2.0 |
| [Supavisor](https://github.com/supabase/supavisor) | 連線池管理 | Elixir | Apache 2.0 |
| [Edge Functions](https://supabase.com/docs/guides/functions) | Serverless 函式 | Deno | MIT |

關鍵在於：這些服務不是「順便也存一份到 Postgres」，而是**把 PostgreSQL 當唯一的真實來源（single source of truth）**。PostgREST 直接反映你的 table schema，不需要額外定義 API route。GoTrue 的使用者資料和你的業務資料在同一個資料庫裡，可以用 foreign key 連接。Realtime 不靠 polling，而是讀 PostgreSQL 的 WAL。

這跟 Firebase 的架構完全不同。Firebase 的 Firestore 是自有的文件資料庫，Auth 是獨立的服務，Storage 有自己的權限模型——三套系統、三套規則、三套查詢語法。

---

## 「一切都是 SQL」為什麼重要

當一個平台的所有元件都能用 SQL 存取，幾件事情會變簡單：

**跨功能查詢變成一條 JOIN。** 想知道「過去七天註冊但還沒上傳頭像的使用者」？在 Firebase 你需要跨 Auth 和 Storage 兩個 API 各查一次再合併。在 Supabase，這是一條 SQL：

```sql
select u.id, u.email, u.created_at
from auth.users u
left join storage.objects o
  on o.owner = u.id
  and o.bucket_id = 'avatars'
where u.created_at > now() - interval '7 days'
  and o.id is null;
```

**權限模型統一。** Supabase 用 PostgreSQL 原生的 Row Level Security（RLS）做存取控制。Auth、Storage、你的業務表格——全部用同一套 policy 語法。不需要學三套權限模型。

**備份和還原是一體的。** 資料庫備份就把所有東西都包了——使用者、檔案 metadata、業務資料。不會出現「資料庫還原了但 Auth 裡的使用者沒有」的問題。

---

## AI 判準：agent 寫 SQL 比寫 SDK 準

這是 Supabase 在 AI 時代特別值得注意的地方。

LLM 生成 SQL 的正確率遠高於生成各家 BaaS 的 SDK 呼叫。SQL 是 1970 年代就定型的語言，訓練語料裡有幾十年的範例。各家 SDK 的 API surface 大、版本差異多，模型常常生成已過時的寫法。

Supabase 的底層就是 PostgreSQL，所以 agent 操作它的方式本質上就是寫 SQL。加上 Supabase 提供了 [MCP server](https://github.com/supabase-community/supabase-mcp)（2.9k GitHub stars，Apache 2.0），agent 可以直接透過 Model Context Protocol 操作專案——建表、查資料、管理 Auth。

這對[我們在 PostgreSQL 專文裡討論的「Just Use Postgres」運動](/posts/tech/deep-dive/2026-07-09-postgres-unified-database)是一個延伸：不只是工程師用 PostgreSQL 就夠了，**agent 也能用 PostgreSQL 做所有事**。

在 Supabase 的場景裡，這意味著：

- 建立和修改 schema → SQL DDL
- CRUD 操作 → SQL DML
- 權限控制 → SQL policy（RLS）
- 向量搜尋 → pgvector 的 SQL 函式
- 即時訂閱 → Realtime 訂閱 table 變更

整條鏈上沒有「只有 SDK 能做、SQL 做不到」的操作。

---

## pgvector 整合：不需要另一個向量資料庫

Supabase 內建 [pgvector](https://github.com/pgvector/pgvector) 擴充，因為底層就是 PostgreSQL，所以你不需要額外起一個 Pinecone 或 Qdrant——向量和業務資料在同一個資料庫裡。

啟用很簡單：

```sql
create extension vector with schema extensions;
```

建一個帶向量欄位的表：

```sql
create table documents (
  id serial primary key,
  title text not null,
  body text not null,
  embedding extensions.vector(384)
);
```

查詢用 pgvector 的距離運算子：

| 運算子 | 距離度量 |
|---|---|
| `<=>` | Cosine distance |
| `<->` | Euclidean distance（L2） |
| `<#>` | Negative inner product |

Supabase 建議用 [HNSW 索引](https://supabase.com/docs/guides/ai/vector-indexes)做為預設的向量索引方式，因為它對資料變動的容忍度比 IVFFlat 好。pgvector 0.7.0 以上支援最高 2,000 維的標準向量、4,000 維的 halfvec、64,000 維的 bit 向量。

因為 PostgREST 不直接支援 pgvector 的運算子，實務上會包成 PostgreSQL function 再透過 client 的 `rpc()` 呼叫：

```sql
create or replace function match_documents (
  query_embedding extensions.vector(384),
  match_threshold float,
  match_count int
) returns table (id bigint, title text, body text, similarity float)
language sql stable as $$
  select documents.id, documents.title, documents.body,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by (documents.embedding <=> query_embedding) asc
  limit match_count;
$$;
```

這跟[我們在 PostgreSQL 專文裡提到的 pgvector 方案](/posts/tech/deep-dive/2026-07-09-postgres-unified-database)一脈相承。對大部分應用來說，把向量和業務資料放在同一個資料庫裡，比維護兩套系統之間的同步管線省事太多了。

---

## Realtime：讀 WAL 而不是 polling

Supabase Realtime 是一個用 Elixir 寫的全球分散式叢集。它的即時推播不是定時去查資料庫有沒有變化，而是透過 PostgreSQL 的 logical replication 機制，直接讀 WAL：

1. 客戶端訂閱 `postgres_changes` 頻道
2. Realtime 對 PostgreSQL 建立 logical replication slot
3. WAL 記錄產生時即時串流到 Realtime 叢集
4. 叢集透過 WebSocket 將變更推送給對應的客戶端

這個設計的好處是**零額外寫入開銷**——不需要在 table 上加 trigger，變更直接從 WAL 讀取。Realtime 叢集會從離你的資料庫最近的區域連線，每個區域至少維持兩個節點做容錯。

除了資料庫變更，Realtime 還提供 Broadcast（客戶端間的低延遲訊息）和 Presence（追蹤誰在線上）。但要注意：[官方文件明確說 Realtime 不保證每一則訊息都會送達](https://github.com/supabase/realtime)。如果你的場景需要訊息不能丟（例如金流通知），不能只靠 Realtime，需要搭配其他機制。

---

## 定價（2026-08 實查）

| 方案 | 月費 | 資料庫容量 | 儲存空間 | 頻寬 | MAU |
|---|---|---|---|---|---|
| **Free** | $0 | 500 MB | 1 GB | 5 GB | 50,000 |
| **Pro** | $25 | 8 GB（超過 $0.125/GB） | 100 GB | 250 GB | 100,000 |
| **Team** | $599 | 8 GB（超過 $0.125/GB） | 100 GB | 250 GB | 100,000 |
| **Enterprise** | 報價制 | 客製 | 客製 | 客製 | 客製 |

資料來源：[Supabase Pricing](https://supabase.com/pricing)（2026-08 實查）。

幾個值得注意的細節：

- **Free 方案一週不活躍就暫停**，且限制 2 個 active project。適合 side project 和原型驗證，不適合跑真正的服務。
- **Pro 方案預設開啟消費上限**（spend cap），超額時功能會降級而不是直接收費。這對控制成本友善。
- **Team 方案**的主要差異是 SOC2 / ISO 27001 合規、14 天備份（Pro 是 7 天）、28 天 log retention。
- Pro 方案附 $10/月的 compute credit，可以用來升級資料庫的運算規格。

跟 Firebase 的 Blaze 方案相比，Supabase Pro 的 $25/月固定費用更好預測。Firebase 的 pay-as-you-go 模型在流量暴增時偶爾會產生意外帳單。

---

## 適合與不適合的場景

### 適合

- **需要關聯式資料的應用**——Supabase 的底層就是 PostgreSQL，JOIN、transaction、foreign key 都是原生的。Firebase 的 Firestore 在這方面先天不足。
- **AI / RAG 應用**——pgvector 內建，不需要額外的向量資料庫。
- **想要 SQL 存取權的團隊**——不只是用 SDK，而是可以直接連進 PostgreSQL 跑 SQL，用 pgAdmin、DBeaver 或任何 SQL 工具。
- **想保留遷移彈性的團隊**——底層是標準 PostgreSQL，如果之後要搬到自管的 RDS 或 Cloud SQL，資料和 schema 可以直接帶走。

### 不適合

- **極高寫入量的場景**——PostgreSQL 是單一寫入節點架構。如果你的寫入量持續超過每秒 1,500 筆且持續成長，需要考慮 CockroachDB 或 DynamoDB 這類水平擴展方案。
- **需要離線優先的行動應用**——Firebase 的 Firestore 有成熟的離線同步機制，Supabase 在這方面沒有對等的方案。
- **已經深度綁定 Google Cloud 生態的專案**——Firebase 跟 Cloud Functions、BigQuery、Analytics 的整合比 Supabase 跟任何雲端的整合都深。
- **需要 Realtime 訊息不能丟的場景**——如前面提到的，Supabase Realtime 不保證送達。

---

## 跟站上其他文章的關係

Supabase 的架構選擇直接呼應了[〈PostgreSQL 就夠了？別急著上專用資料庫〉](/posts/tech/deep-dive/2026-07-09-postgres-unified-database)的核心論點：**多管一套系統的隱藏成本被嚴重低估**。Supabase 把這個想法推到極致——不只是資料庫用 PostgreSQL，連 Auth、Storage、Realtime 都建在上面。

跟[本站使用的 Cloudflare D1](/posts/tech/2026-03-27-cloudflare-d1-sqlite-database) 相比，Supabase 和 D1 解決的是不同規模的問題。D1 是 SQLite-based 的邊緣資料庫，適合跑在 Workers 上的輕量應用；Supabase 是完整的後端平台，適合需要 Auth、Storage、Realtime 的應用。兩者不衝突——你可以用 Supabase 當主資料庫，D1 當邊緣快取。

---

## 參考資料

- [Supabase 官方文件](https://supabase.com/docs) — 架構、各服務 API 參考
- [Supabase GitHub 主倉庫](https://github.com/supabase/supabase) — 108k stars，Apache 2.0
- [Supabase 定價頁面](https://supabase.com/pricing) — Free / Pro / Team / Enterprise 方案明細（2026-08 實查）
- [Supabase Architecture](https://supabase.com/docs/guides/getting-started/architecture) — 七個服務與 PostgreSQL 的關係
- [Supabase Auth Architecture](https://supabase.com/docs/guides/auth/architecture) — GoTrue 如何在 `auth` schema 存使用者資料
- [Supabase Realtime Architecture](https://supabase.com/docs/guides/realtime/architecture) — WAL 讀取、replication slot、WebSocket 推播機制
- [Supabase Database Replication](https://supabase.com/docs/guides/database/replication) — logical replication、publication、WAL 設定
- [Supabase AI / Vector 文件](https://supabase.com/docs/guides/ai) — pgvector 整合、embedding 生成、語意搜尋
- [Supabase Vector Columns](https://supabase.com/docs/guides/ai/vector-columns) — pgvector 距離運算子、查詢函式範例
- [Supabase Vector Indexes](https://supabase.com/docs/guides/ai/vector-indexes) — HNSW vs IVFFlat 選擇、維度限制
- [Supabase Storage](https://supabase.com/docs/guides/storage) — S3 相容儲存，metadata 存在 PostgreSQL
- [Supabase Realtime GitHub](https://github.com/supabase/realtime) — Elixir/Phoenix 實作，含「不保證送達」聲明
- [Supabase MCP Server](https://github.com/supabase-community/supabase-mcp) — 2.9k stars，讓 AI agent 透過 MCP 操作 Supabase
- [PostgreSQL 就夠了？別急著上專用資料庫](/posts/tech/deep-dive/2026-07-09-postgres-unified-database) — 本站 PostgreSQL 專文
- [Cloudflare D1：跑在邊緣的 SQLite 關聯式資料庫](/posts/tech/2026-03-27-cloudflare-d1-sqlite-database) — 本站 D1 專文
