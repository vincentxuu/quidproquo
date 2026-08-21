---
title: "Drizzle ORM：SQL-first 的 TypeScript 資料庫存取層"
date: 2026-08-21
category: tech
type: deep-dive
tags: [drizzle-orm, orm, typescript, sql, database, edge-computing]
lang: zh-TW
tldr: "Drizzle ORM 是一個 SQL-first 的 TypeScript ORM——query builder 長得像 SQL，agent 寫出來的查詢在 diff 裡讀得懂。零依賴、約 7.4 KB gzipped，原生支援 Cloudflare D1、Neon、Turso 等 edge database。版本至今仍是 0.45.2，但週下載量已達 1,690 萬，超過 Prisma 的 1,380 萬。"
description: "介紹 Drizzle ORM 的 SQL-first 設計哲學、query builder 與 relational queries 雙軌 API、edge runtime 原生支援（D1 / Neon / Turso）、遷移工具鏈，以及它在 AI agent 工作流中「可審查性」的優勢。"
series:
  name: "AI 時代的技術選擇"
  order: 17
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-21-drizzle-orm-sql-first-en)

這個系列反覆出現一個判準：**資料存取層的選型看可審查性**。agent 會幫你寫查詢，但你得能在 diff 裡讀懂它寫了什麼、審得動它改了什麼。Drizzle ORM 的核心賣點就壓在這條線上——它的 query builder 長得像 SQL，不是另一種 DSL。

## 它是什麼

[Drizzle ORM](https://orm.drizzle.team/) 是一個 TypeScript ORM，2021 年在 GitHub 開源，Apache-2.0 授權。官方用一句話定位：「If you know SQL, you know Drizzle.」設計哲學是不發明新語法，而是把 SQL 操作映射成型別安全的 TypeScript API——你寫的程式碼跟最後送出的 SQL 幾乎一比一對應。

截至 2026-08-21，npm 週下載量 [1,690 萬](https://www.npmjs.com/package/drizzle-orm)，GitHub [35,500 星](https://github.com/drizzle-team/drizzle-orm)——已經超過 Prisma 的 1,380 萬週下載。但版本號至今還是 [0.45.2](https://www.npmjs.com/package/drizzle-orm)，沒有 1.0。這個反差後面會談。

## SQL-first 是什麼意思

看一組對照就清楚了。左邊是 Drizzle 的 TypeScript，右邊是它生成的 SQL：

```typescript
// Drizzle query builder
const result = await db
  .select({ age: users.age, count: sql<number>`cast(count(${users.id}) as int)` })
  .from(users)
  .innerJoin(posts, eq(users.id, posts.authorId))
  .where(gt(users.age, 18))
  .groupBy(users.age)
  .orderBy(desc(users.age))
  .limit(10);
```

```sql
-- 生成的 SQL
SELECT "age", cast(count("users"."id") as int)
FROM "users"
INNER JOIN "posts" ON "users"."id" = "posts"."author_id"
WHERE "users"."age" > 18
GROUP BY "users"."age"
ORDER BY "users"."age" DESC
LIMIT 10;
```

幾乎可以逐行對讀。`select`、`from`、`innerJoin`、`where`、`groupBy`、`orderBy`、`limit`——每個方法名就是 SQL 關鍵字。這跟 Prisma 的 `findMany({ where: { age: { gt: 18 } }, include: { posts: true } })` 是完全不同的思路：Prisma 發明了一套自己的查詢語言，Drizzle 選擇貼著 SQL 走。

**對 AI agent 工作流的意義**：coding agent 幫你寫一段查詢，你在 code review 時看到的是近似 SQL 的東西。你的 SQL 知識直接可用，不需要先把 ORM 語法翻譯回 SQL。這就是「可審查性」：**agent 產出的程式碼，人類能以最短路徑驗證**。

## 雙軌 API：query builder 與 relational queries

Drizzle 同時提供兩種查詢方式：

**SQL-like query builder**（上面看到的）適合你清楚知道要什麼 SQL 的場景——JOIN、子查詢、CTE、聚合，直接映射。

**Relational queries**（`db.query` API）適合撈巢狀關聯資料，語法比較像 Prisma 的 `include`：

```typescript
const users = await db.query.users.findMany({
  with: {
    posts: {
      with: { comments: true },
    },
  },
});
```

關鍵差異：Drizzle 的 relational queries 保證**輸出恰好一條 SQL**。不管你巢狀幾層 `with`，它會在 ORM 層把所有關聯收成一次查詢送出，不會像某些 ORM 打出 N+1 條 query。在 serverless 環境（每次 database round-trip 都有冷啟動成本），這個保證有實際意義。

兩種 API 不互斥——同一個專案裡可以混用。複雜查詢用 query builder 精確控制 SQL，簡單的 CRUD 關聯查詢用 relational queries 提高開發效率。

## Edge runtime 原生支援

Drizzle 零依賴、壓縮後約 7.4 KB，從設計上就瞄準 serverless 和 edge runtime。它原生支援的 database driver 涵蓋了主流 edge database：

| Database | Driver | 適用環境 |
|---|---|---|
| [Cloudflare D1](https://orm.drizzle.team/docs/get-started/d1-new) | `d1-http` | Cloudflare Workers / Pages |
| [Neon](https://orm.drizzle.team/docs/get-started/neon-new) | `neon-http` / `neon-websockets` | 任何 serverless 環境 |
| [Turso / libSQL](https://orm.drizzle.team/docs/get-started/turso-new) | `@libsql/client` | Node / Web / edge |
| PostgreSQL | `postgres` / `pg` | 傳統 server |
| MySQL | `mysql2` | 傳統 server |
| SQLite | `better-sqlite3` | 本地開發 |

對本站（跑在 Cloudflare Workers + D1 上）而言，Drizzle 是少數能直接用 Workers binding 連 D1 的 ORM——連線設定就是 `drizzle(env.DB)`，不需要繞 HTTP proxy。

Prisma 也支援 edge runtime（Prisma Accelerate），但需要經過 Prisma 的代理服務；Drizzle 直接走 binding，中間沒有額外一層。

## Schema 定義與遷移

Drizzle 的 schema 用 TypeScript 定義（不是 Prisma 那種 `.prisma` DSL）：

```typescript
import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  email: text().notNull().unique(),
});
```

遷移工具是 [drizzle-kit](https://www.npmjs.com/package/drizzle-kit)（週下載 1,410 萬），提供兩種工作流：

- **`drizzle-kit push`**：直接把 schema 變更推到資料庫，適合開發階段快速迭代
- **`drizzle-kit generate` + `drizzle-kit migrate`**：生成 SQL migration 檔案再套用，適合正式環境版本控制

對 D1 的遷移，`wrangler.toml` 裡指定 `migrations_dir = "drizzle"` 就能讓 Wrangler 和 drizzle-kit 共用同一組 migration 檔案。

## Drizzle Studio

[Drizzle Studio](https://local.drizzle.studio) 是內建的資料庫瀏覽器——跑 `drizzle-kit studio` 就會在本機啟動一個 web 介面，讓你直接瀏覽和編輯資料。官方承諾「free to use forever」。它還有一個 Chrome 擴充套件，可以在 Cloudflare、Vercel Postgres 的管理面板裡直接開 Drizzle Studio。

Turso、Neon、Replit 等平台已經把 Drizzle Studio 嵌入自家服務——這反過來也是一個生態訊號：edge database 廠商選擇 Drizzle 作為他們的 ORM 首選。

## 0.x 版本的誠實面

1,690 萬週下載、35,500 GitHub 星——但版本號還是 0.45.2，沒有 1.0。這不是一個可以忽略的事實。

**實務影響**：0.x 意味著 API 不保證向後相容。Drizzle 的 breaking change 紀錄確實存在——`drizzle-kit` 的版號甚至跟 `drizzle-orm` 脫鉤（目前 0.31.10），兩者的相容矩陣需要注意。在已上線的專案升級時，你得看 changelog。

**為什麼還沒到 1.0**：Drizzle 團隊還在持續擴充資料庫支援（MSSQL、SingleStore 是近期新增的），API 表面積還在長。這跟「不夠穩定」不完全是同一件事——核心 API（schema 定義、query builder、relational queries）已經相當穩定。但邊緣功能和新資料庫支援確實還在快速迭代。

合理的期待是：核心功能可以放心用在正式環境；但升級版本前要讀 release notes，不要無腦 `npm update`。

## 跟 Prisma 的定位差異

站上已有一篇 [Prisma 專文](/posts/tech/2026-03-27-prisma-orm-typescript)，這裡不做完整比較，只點出定位差異：

| 面向 | Drizzle | Prisma |
|---|---|---|
| 設計哲學 | SQL-first，貼著 SQL 走 | Schema-first，自有查詢語言 |
| Schema 定義 | TypeScript 檔案 | `.prisma` DSL |
| 型別安全 | 從 TypeScript schema 推斷 | 從 `.prisma` codegen |
| Edge 支援 | 直接 binding，零中間層 | 需 Prisma Accelerate 代理 |
| 套件大小 | 約 7.4 KB gzipped，零依賴 | 較大（含 Rust engine） |
| 版本狀態 | 0.45.2（無 1.0） | 6.x（穩定） |
| 週下載量 | 1,690 萬 | 1,380 萬 |

**怎麼選**：如果你的專案跑在 edge runtime、你在意套件大小、或者你希望 agent 寫出來的查詢你能直接用 SQL 知識審——Drizzle 比較適合。如果你需要成熟的 migration 工具鏈、穩定的版本承諾、或者你的團隊比較熟 Prisma 的心智模型——Prisma 仍然是好選擇。兩者不是取代關係，是不同取捨。

## Agent 友善度

最後回到這個系列的主軸。Drizzle 對 AI agent 工作流有幾個具體優勢：

**可審查性**：query builder 輸出近似 SQL，code review 時不需要心智翻譯。agent 幫你寫一段 JOIN，你直接用 SQL 知識判斷它對不對。

**llms.txt**：Drizzle 的文件站提供完整的 [llms.txt](https://orm.drizzle.team/llms.txt)，包含 50+ 個快速入門指南的索引。agent 可以直接抓到最新的 API 文件，不用靠過時的訓練語料硬寫。這跟[本系列 llms.txt 那篇](/posts/tech/2026-08-21-llms-txt)談的是同一件事。

**TypeScript schema**：schema 定義就是 TypeScript，不是另一種 DSL，agent 讀取和生成的摩擦更小。

**bundle size**：7.4 KB gzipped，在 edge function 的冷啟動和部署體積上幾乎零負擔。agent 幫你加一個 ORM 依賴，不會讓 Worker 的啟動時間爆掉。

## 整體來說

Drizzle 賭的是一個簡單的判斷：**SQL 是 50 年來最穩定的 API，不要在上面再蓋一層語言**。這個判斷在 AI 時代獲得了額外的紅利——當你的查詢是由 agent 寫的，「寫出來的東西跟 SQL 長一樣」就從開發者偏好變成了工程需求。加上零依賴、原生 edge 支援、1,690 萬週下載的生態驗證，Drizzle 是 TypeScript 專案在 2026 年選 ORM 時應該認真評估的選項。前提是你接受 0.x 的版本現實。

## 參考資料

- [Drizzle ORM 官方文件](https://orm.drizzle.team/)
- [Drizzle ORM GitHub](https://github.com/drizzle-team/drizzle-orm)
- [Drizzle ORM npm](https://www.npmjs.com/package/drizzle-orm)
- [Drizzle + Cloudflare D1 快速入門](https://orm.drizzle.team/docs/get-started/d1-new)
- [Drizzle + Neon 快速入門](https://orm.drizzle.team/docs/get-started/neon-new)
- [Drizzle + Turso 快速入門](https://orm.drizzle.team/docs/get-started/turso-new)
- [Drizzle Relational Queries 文件](https://orm.drizzle.team/docs/rqb)
- [Drizzle llms.txt](https://orm.drizzle.team/llms.txt)
- 站內相關：[Prisma ORM：TypeScript 專案的型別安全資料庫存取](/posts/tech/2026-03-27-prisma-orm-typescript)
- 站內相關：[llms.txt：把文件寫給機器讀的那一份](/posts/tech/2026-08-21-llms-txt)
