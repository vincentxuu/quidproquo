---
title: "Cloudflare D1：跑在邊緣的 SQLite 關聯式資料庫"
date: 2026-03-27
updated: 2026-08-19
type: guide
category: tech
tags: [cloudflare-d1, sqlite, serverless, edge, cloudflare-workers, database]
lang: zh-TW
tldr: "D1 是 Cloudflare 的 serverless SQLite 資料庫，直接綁定 Workers，支援完整 SQL（JOIN、transaction）、自動備份。適合中小規模的關聯式資料需求，NobodyClimb 把它當主資料庫用。"
description: "Cloudflare D1 介紹：SQLite-based serverless 關聯式資料庫，Workers binding 基本 CRUD、wrangler migration 流程、與 PostgreSQL/MySQL 的比較，以及 D1 vs KV 的選擇邏輯。"
draft: false
series:
  name: "Cloudflare 邊緣tech stack"
  order: 2
---

🌏 [English version](/posts/tech/2026-03-27-cloudflare-d1-sqlite-database-en)

D1 是 Cloudflare 的 serverless 關聯式資料庫，底層是 SQLite。它和 Workers 共用 Cloudflare 平台、設定成本低，但**別誤會成「資料庫跟著 Worker 跑在每個邊緣節點」**：沒開 read replication 時，[D1 會把讀寫都導到世界上單一位置的 primary instance](https://developers.cloudflare.com/d1/best-practices/read-replication/)，延遲取決於使用者離那個 instance 多遠。如果你已經選 Cloudflare Workers，D1 是最自然的關聯式資料庫選項。

## 核心特性

- **完整 SQL 支援**：JOIN、subquery、transaction、FOREIGN KEY——SQLite 能做的 D1 都支援
- **Workers binding**：直接在 Worker 程式碼裡用 `env.DB` 操作，不需要管連線字串或連線池
- **Time Travel**：D1 內建 point-in-time recovery，可以把資料庫倒回過去某個時間點，不用自己排 snapshot（保留天數依方案，見官方限額頁）
- **Wrangler migration**：用 `wrangler d1 migrations apply` 管理 schema 版本
- **Read replication**：可選的唯讀副本，把讀取分散到其他地點，[官方文件](https://developers.cloudflare.com/d1/best-practices/read-replication/)說明副本不額外計費，仍照 `rows_read` / `rows_written` 算
- **HTTP API**：除了 Workers binding，也可以用 REST API 從外部存取

## 基本 CRUD

**Wrangler 設定檔綁定**（官方建議新專案用 `wrangler.jsonc`）

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "nobodyclimb",
      "database_id": "<DATABASE_ID>"
    }
  ]
}
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

`batch()` 在同一個 transaction 裡依序執行所有 statement，任一失敗就全部 rollback。

有一條容易踩到的限額：**每次 Worker 呼叫能對 D1 下的查詢數有上限**（[limits 頁](https://developers.cloudflare.com/d1/platform/limits/)：付費 1,000、免費 50），免費方案緊很多。官方沒有說明 `batch()` 裡的多個 statement 是算一次還是逐一計數，保守假設是逐一。把 N+1 查詢改成 JOIN 不只是效能問題，也是會不會直接撞牆的問題。

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
| 延遲 | 取決於離 primary instance 多遠，可用 read replication 改善 | 連回獨立 region |
| SQL 支援 | SQLite 語法子集 | 完整 PostgreSQL / MySQL |
| 並發寫入 | 單點 SQLite，高並發寫入會 queue | 支援高並發 |
| 功能 | 無 stored procedures、no pg extensions | 豐富的擴充生態 |
| 成本 | 有免費額度，按 row 讀寫與儲存量計費 | EC2 + RDS 固定成本高 |

D1 的吞吐量有個很好算的心智模型，官方文件直接寫了：**每個 D1 資料庫底層是單一 Durable Object，一次處理一個查詢**，所以吞吐量等於「1 秒 ÷ 平均查詢時間」。平均 1 ms 的查詢大約每秒 1,000 次，平均 100 ms 就只剩每秒 10 次。優化慢查詢在 D1 上不是省成本，是直接買吞吐量。

**什麼時候 D1 合理：**
- 中小規模專案，寫入量不大（每秒幾百筆以內）
- 已選 Cloudflare Workers 作為運算平台
- 不需要 PostgreSQL 特有功能（JSONB index、pgvector、stored procedure）
- 想把 infra 管理成本壓到最低

**什麼時候要換掉：**
- 高並發寫入（每秒上千筆）——SQLite 單點寫入會成為瓶頸
- 需要複雜的 SQL 功能或 PostgreSQL extension
- 單一資料庫逼近容量上限——官方的答案是水平切成多個資料庫，而不是把單庫加大（[limits 頁](https://developers.cloudflare.com/d1/platform/limits/)寫 D1 的設計就是「橫向擴展成很多個較小的 10 GB 資料庫」，per-user / per-tenant 分庫是官方推薦的做法）。單庫上限能不能個案申請調高，官方目前沒有表述；[可以聯絡調高的是帳號總儲存量](https://developers.cloudflare.com/d1/observability/debug-d1/)，兩者不是同一件事

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
- 不必自己管資料庫主機，與 Workers 同平台、設定成本低
- 免費方案就能跑真的專案

**缺點**
- SQLite 單點寫入：高並發寫入場景會排隊，這是架構限制，不是 bug
- 無 stored procedures（注意 **trigger 是支援的**——SQLite 本身就有，D1 的 SQL 文件也同時出現 `CREATE TRIGGER` 與 `PRAGMA recursive_triggers`）
- 單一資料庫容量有上限，而官方給的路是分庫而非加大——資料會長大的話，一開始就要想好怎麼分庫
- 免費方案的**單一資料庫容量上限遠低於付費方案**（500 MB vs 10 GB，差 20 倍），開發時很容易誤判
- 大批次的 `UPDATE` / `DELETE` 會撞執行限制，官方建議切成每批一千列左右跑

## 計費的形狀

具體數字看 [D1 定價](https://developers.cloudflare.com/d1/platform/pricing/) 與 [D1 限額](https://developers.cloudflare.com/d1/platform/limits/)，這裡只講會影響設計決策的三件事：

1. **計價單位是「掃過的列數」，不是回傳的列數。** 一張五千列的表下 `SELECT *` 全表掃描，就是五千 rows read，即使你只用到一列。這是索引在 D1 上會直接反映在帳單上的原因。
2. **每百萬列的寫入單價比讀取貴三個數量級。** 而且建了索引之後，寫入含索引欄位時會多算一列（表一次、索引一次）——官方仍建議建索引，因為省下的 read 幾乎總是超過多付的 write。
3. **免費方案的每日讀寫額度是硬牆**，撞到就整個帳號的 D1 直接回錯誤，等 UTC 00:00 重置。上線前要有處理這個錯誤的路徑。

沒有 egress 或頻寬費用。

## 更新紀錄

- 2026-08-19：對照官方文件逐篇查證翻新，移除易腐內容，並收進「Cloudflare 邊緣tech stack」系列

## 參考資料

- [Cloudflare D1 官方文件](https://developers.cloudflare.com/d1/)
- [D1 定價](https://developers.cloudflare.com/d1/platform/pricing/)
- [D1 限額](https://developers.cloudflare.com/d1/platform/limits/) — 容量、每次呼叫查詢數、SQL 語句長度等硬限制
- [D1 read replication](https://developers.cloudflare.com/d1/best-practices/read-replication/)
- [NobodyClimb 系統架構](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [Cloudflare Workers：Edge Compute 入門](/posts/tech/2026-03-27-cloudflare-workers-edge-compute)
- [Cloudflare KV：全球邊緣的 Key-Value Store](/posts/tech/2026-03-27-cloudflare-kv-key-value-store)
- [Cloudflare R2：零 Egress 費用的物件儲存](/posts/tech/2026-03-27-cloudflare-r2-object-storage)
