---
title: "Cloudflare D1：跑在邊緣的 SQLite 關聯式資料庫"
date: 2026-03-27
type: guide
category: tech
tags: [cloudflare-d1, sqlite, serverless, edge, cloudflare-workers, database]
lang: zh-TW
tldr: "D1 是 Cloudflare 的 serverless SQLite 資料庫，直接綁定 Workers，支援完整 SQL（JOIN、transaction）、自動備份。適合中小規模的關聯式資料需求，NobodyClimb 把它當主資料庫用。"
description: "Cloudflare D1 介紹：SQLite-based serverless 關聯式資料庫，Workers binding 基本 CRUD、wrangler migration 流程、與 PostgreSQL/MySQL 的比較，以及 D1 vs KV 的選擇邏輯。"
draft: false
---

🌏 [English version](/posts/tech/2026-03-27-cloudflare-d1-sqlite-database-en)

D1 是 Cloudflare 的 serverless 關聯式資料庫，底層是 SQLite。它和 Workers 跑在同一個邊緣節點，不需要連回另一個 region，查詢延遲低、設定成本低。如果你已經選 Cloudflare Workers，D1 是最自然的關聯式資料庫選項。

## 核心特性

- **完整 SQL 支援**：JOIN、subquery、transaction、FOREIGN KEY——SQLite 能做的 D1 都支援
- **Workers binding**：直接在 Worker 程式碼裡用 `env.DB` 操作，不需要管連線字串或連線池
- **自動複製與備份**：Cloudflare 負責底層複製，不用自己設 snapshot
- **Wrangler migration**：用 `wrangler d1 migrations apply` 管理 schema 版本
- **HTTP API**：除了 Workers binding，也可以用 REST API 從外部存取

## 基本 CRUD

**wrangler.toml 綁定**

```toml
[[d1_databases]]
binding = "DB"
database_name = "nobodyclimb"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**Worker 裡操作 D1**

```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // 查詢（帶參數）
    const user = await env.DB.prepare(
      'SELECT id, username, email FROM users WHERE id = ?'
    )
      .bind(userId)
      .first<User>();

    // 插入
    await env.DB.prepare(
      'INSERT INTO climbs (user_id, route_name, grade, notes) VALUES (?, ?, ?, ?)'
    )
      .bind(userId, routeName, grade, notes)
      .run();

    // 批次查詢（一次 round-trip）
    const [users, climbs] = await env.DB.batch([
      env.DB.prepare('SELECT * FROM users WHERE active = 1'),
      env.DB.prepare('SELECT * FROM climbs WHERE created_at > ?').bind(since),
    ]);

    return Response.json(user);
  },
};
```

**Transaction**

```typescript
const { success } = await env.DB.batch([
  env.DB.prepare('UPDATE users SET ai_quota_used = ai_quota_used + 1 WHERE id = ? AND ai_quota_used < ai_quota_limit').bind(userId),
  env.DB.prepare('INSERT INTO ai_usages (user_id, tokens_used, created_at) VALUES (?, ?, ?)').bind(userId, tokensUsed, now),
]);
```

`batch()` 在同一個 transaction 裡執行所有 statement，任一失敗就全部 rollback。

## Schema 和 Migration

D1 用 wrangler 管理 migration：

```bash
# 建立 migration 檔
wrangler d1 migrations create nobodyclimb "create users table"

# 套用到 local dev 環境
wrangler d1 migrations apply nobodyclimb --local

# 套用到 production
wrangler d1 migrations apply nobodyclimb --remote
```

Migration 檔放在 `migrations/` 目錄，純 SQL：

```sql
-- migrations/0001_create_users.sql
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  climber_rank TEXT NOT NULL DEFAULT 'foothill',
  ai_quota_used INTEGER NOT NULL DEFAULT 0,
  ai_quota_limit INTEGER NOT NULL DEFAULT 2,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
```

Wrangler 在 D1 內部維護一張 `d1_migrations` 表追蹤版本，已套用的不會重複執行。

## D1 vs 傳統資料庫

| | D1 | PostgreSQL / MySQL |
|---|---|---|
| 部署複雜度 | 幾乎零（wrangler 搞定）| 需要 RDS、VPC、連線池 |
| 延遲 | 跑在 Worker 旁邊，極低 | 連回獨立 region，通常 10–50ms |
| SQL 支援 | SQLite 語法子集 | 完整 PostgreSQL / MySQL |
| 並發寫入 | 單點 SQLite，高並發寫入會 queue | 支援高並發 |
| 功能 | 無 stored procedures、no pg extensions | 豐富的擴充生態 |
| 成本 | 免費層大方，按 row 讀寫計費 | EC2 + RDS 固定成本高 |

**什麼時候 D1 合理：**
- 中小規模專案，寫入量不大（每秒幾百筆以內）
- 已選 Cloudflare Workers 作為運算平台
- 不需要 PostgreSQL 特有功能（JSONB index、pgvector、stored procedure）
- 想把 infra 管理成本壓到最低

**什麼時候要換掉：**
- 高並發寫入（每秒上千筆）——SQLite 單點寫入會成為瓶頸
- 需要複雜的 SQL 功能或 PostgreSQL extension
- 資料庫大小接近 10 GB 上限

## D1 vs KV

這兩個是 Cloudflare 生態裡最容易混淆的選擇：

| 場景 | 選擇 |
|------|------|
| 使用者資料、關聯資料、需要 JOIN | D1 |
| 快取、暫態資料、feature flag | KV |
| 需要 ACID transaction | D1 |
| 需要全球超低延遲讀取 | KV |
| 需要 range query / 複雜過濾 | D1 |
| 讀多寫少，可接受最終一致性 | KV |

KV 不是資料庫，只能精確 key 讀取，沒有 query 能力。需要「查所有某使用者的攀登紀錄」這類需求，必須用 D1。詳細比較見 [Cloudflare KV](/posts/tech/2026-03-27-cloudflare-kv-key-value-store)。

## NobodyClimb 怎麼用 D1

NobodyClimb 把 D1 當主資料庫，所有關聯式資料都在裡面：

- **users**：使用者基本資料、Climber Rank、AI 配額
- **climbs**：攀登紀錄（路線、難度、成果、日期）
- **stories**：社群故事和心得文章
- **ai_usages**：AI 問答的 token 用量紀錄（配額扣除用 atomic UPDATE）
- **embeddings metadata**：向量索引的 metadata（向量本身存在 Vectorize）

AI 配額的原子扣除是 D1 在 NobodyClimb 裡最關鍵的一個場景——雙條件 UPDATE 避免 race condition：

```sql
UPDATE users
SET ai_quota_used = ai_quota_used + 1
WHERE id = ? AND ai_quota_used < ai_quota_limit
```

這個 query 只有在配額還有剩的時候才會更新，`changes()` 為 0 就代表配額已滿，不需要額外的 SELECT + 判斷。

架構細節見 [NobodyClimb 系統架構](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)。

## 取捨和限制

**優點**
- Zero-config：wrangler 建好就能用，沒有 VPC、連線池、SSL 憑證
- 完整 SQL：JOIN、transaction、subquery，不是閹割版
- 跑在 Worker 旁邊，延遲極低
- 免費層很大方（5 GB 儲存、500 萬 row reads/天）

**缺點**
- SQLite 單點寫入：高並發寫入場景會排隊，這是架構限制，不是 bug
- 無 stored procedures、no triggers（SQLite 限制）
- 資料庫大小上限 10 GB（enterprise 可擴展，一般方案夠用）
- Open beta 考量：D1 已相當穩定，但 API 和計費偶爾有調整，production 使用要追蹤 changelog

## 定價

- **免費方案**：5 GB 儲存，每天 500 萬 row reads、10 萬 row writes
- **付費方案（Workers Paid $5/月起）**：50 GB 儲存，超出部分按 row 讀寫計費（$0.001 / 100 萬 row reads，$1.00 / 100 萬 row writes）

寫入費用比讀取高出許多——設計 schema 和 query 時要注意避免不必要的 write，批次操作盡量用 `batch()`。

## 參考資料

- [Cloudflare D1 官方文件](https://developers.cloudflare.com/d1/)
- [D1 定價](https://developers.cloudflare.com/d1/platform/pricing/)
- [NobodyClimb 系統架構](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [Cloudflare Workers：Edge Compute 入門](/posts/tech/2026-03-27-cloudflare-workers-edge-compute)
- [Cloudflare KV：全球邊緣的 Key-Value Store](/posts/tech/2026-03-27-cloudflare-kv-key-value-store)
- [Cloudflare R2：零 Egress 費用的物件儲存](/posts/tech/2026-03-27-cloudflare-r2-object-storage)
