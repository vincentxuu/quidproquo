---
title: "Prisma ORM：TypeScript 專案的型別安全資料庫存取"
date: 2026-03-27
type: guide
category: tech
tags: [prisma, orm, typescript, postgresql, database]
lang: zh-TW
tldr: "Prisma 用 schema-first 設計讓資料庫 migration 有版本控制、查詢有完整 TypeScript 型別、關聯查詢直覺。代價是學習曲線和 ORM 的固有限制，但對多數 TypeScript 專案是值得的換法。"
description: "介紹 Prisma ORM：schema 定義、migration 流程、型別安全查詢、關聯 include，以及島島（DaoDao）為何選它管理 PostgreSQL，還有什麼情境下 Prisma 會讓你痛苦。"
draft: false
---

:globe: [English version](/posts/tech/2026-03-27-prisma-orm-typescript-en)

「不用 ORM，直接寫 SQL」這個論點有道理，但有前提：你願意手動維護 migration、手動寫型別、手動處理關聯查詢。Prisma 把這些全部解決，代價是你要接受它的抽象層。對島島（DaoDao）這種 TypeScript 專案，這個換法是值得的。

## 它是什麼

Prisma 是一個 TypeScript-first 的 ORM，核心由三個部分組成：

- **Prisma Schema**：用 `.prisma` 格式定義資料模型，是整個系統的單一真實來源
- **Prisma Migrate**：根據 schema 變更自動生成 SQL migration 檔案，有版本管理
- **Prisma Client**：自動生成的型別安全查詢 client，型別從 schema 推斷

重點是「自動生成」——你不用手寫型別定義，也不用維護 migration SQL，Prisma 根據你的 schema 幫你生成。

## Schema 定義

Prisma schema 是宣告式的，語法比 SQL 直覺：

```prisma
// schema.prisma
generator client {
  provider = "prisma-client"            // Prisma 7 的 Rust-free client
  output   = "../src/generated/prisma"  // 7 起必填，不再產到 node_modules
}

datasource db {
  provider = "postgresql"  // 連線字串改放 prisma.config.ts
}

model User {
  id          Int      @id @default(autoincrement())
  externalId  String   @unique @default(uuid()) @map("external_id")
  email       String   @unique
  name        String
  createdAt   DateTime @default(now()) @map("created_at")

  posts       Post[]
  goals       Goal[]

  @@map("users")
}

model Post {
  id          Int      @id @default(autoincrement())
  externalId  String   @unique @default(uuid()) @map("external_id")
  title       String
  content     String
  authorId    Int      @map("author_id")
  createdAt   DateTime @default(now()) @map("created_at")

  author      User     @relation(fields: [authorId], references: [id])
  reactions   Reaction[]

  @@map("posts")
}

model Reaction {
  userId    Int    @map("user_id")
  postId    Int    @map("post_id")
  emoji     String

  user      User   @relation(fields: [userId], references: [id])
  post      Post   @relation(fields: [postId], references: [id])

  @@unique([userId, postId])  // 每個使用者對同一個貼文只能有一個 Reaction
  @@map("reactions")
}
```

Prisma 7 起，CLI 用的連線字串、schema 位置與 migration 路徑集中在專案根目錄的 `prisma.config.ts`，環境變數也不再自動載入，要自己用 `dotenv` 讀：

```typescript
// prisma.config.ts
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: env('DATABASE_URL') },
})
```

`@@unique([userId, postId])` 這個設計對應島島的 Reaction upsert 模式——資料庫層就保證不會有重複資料。

## Migration 流程

改 schema 之後：

```bash
# 生成 migration SQL 並套用（開發環境）
npx prisma migrate dev --name add-reactions-table

# 重新產生 Prisma Client（Prisma 7 起 migrate dev 不會自動跑）
npx prisma generate

# 套用 migration（生產環境，不生成新 migration）
npx prisma migrate deploy
```

生成的 migration 檔案放在 `prisma/migrations/`，commit 進版本控制。團隊協作時每個人都知道資料庫現在的狀態，不會有「你的資料庫跑了哪個 migration」的問題。

## 型別安全查詢

Prisma Client 的型別從 schema 自動推斷，IDE 補全完整：

```typescript
// lib/prisma.ts：Prisma 7 起每種資料庫都要傳 driver adapter
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
export const prisma = new PrismaClient({ adapter })

// 查詢：型別完全推斷，posts 是 Post[]
const user = await prisma.user.findUnique({
  where: { externalId: userId },
  include: {
    posts: {
      orderBy: { createdAt: 'desc' },
      take: 10,
    },
    goals: true,
  }
})

// user.posts 是 Post[]，user.goals 是 Goal[]
// 不需要手寫型別

// 建立：Prisma 推斷 data 的型別
const post = await prisma.post.create({
  data: {
    title: '學習 TypeScript',
    content: '...',
    author: { connect: { id: userId } }  // 用 connect 建立關聯
  }
})
```

## Upsert：Reaction 模式

島島的 Reaction 採用 upsert——同一個使用者對同一個貼文，重複操作是更新而不是新增：

```typescript
// services/ReactionService.ts
async upsertReaction(userId: number, postId: number, emoji: string) {
  return prisma.reaction.upsert({
    where: {
      userId_postId: { userId, postId }  // 複合唯一鍵
    },
    update: { emoji },       // 已存在：更新 emoji
    create: { userId, postId, emoji }  // 不存在：新增
  })
}
```

`@@unique([userId, postId])` 在 schema 層保證了這個操作的正確性，Prisma 的 `upsert` 對應到一個原子 SQL 操作。

## 在 Express 服務層的用法

島島的架構是 routes → controllers → services → Prisma，services 直接呼叫 Prisma client：

```typescript
// services/PostService.ts
import { prisma } from '../lib/prisma'

export class PostService {
  // 列出貼文（含作者資訊和 reaction 數）
  async list(page: number, limit: number) {
    const [posts, total] = await prisma.$transaction([
      prisma.post.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: { select: { externalId: true, name: true } },
          _count: { select: { reactions: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.post.count()
    ])

    return { posts, total, page, limit }
  }

  // 建立貼文（只對外暴露 externalId）
  async create(data: CreatePostInput, authorId: number) {
    const post = await prisma.post.create({
      data: { ...data, authorId }
    })
    return { ...post, id: undefined, externalId: post.externalId }
  }
}
```

`prisma.$transaction([...])` 讓多個查詢在同一個 transaction 裡執行，這裡用來保證 count 和 findMany 的資料一致。

## Prisma 7 改了什麼

Prisma 7.0（2025-11）是一次大改版，上面的範例都已照 7 的寫法：

- **移除 Rust query engine**：Prisma Client 改用 TypeScript 重寫，官方公布的數字是 bundle 小 90%、查詢快 3 倍。少了原生 binary，部署到 Cloudflare Workers、Vercel Edge 這類 edge runtime 不必再擔心 engine 檔案大小與平台相容性。
- **driver adapter 變成必要**：建立 `PrismaClient` 一律要傳 adapter（PostgreSQL 用 `@prisma/adapter-pg`，SQLite 用 `@prisma/adapter-better-sqlite3`）。連 edge 資料庫也是同一套：Neon serverless、PlanetScale serverless、Turso（`@libsql/client`）、Cloudflare D1 都有對應 adapter，直接從 Worker 連，不用再經過 Prisma Accelerate 代管的 proxy。
- **Accelerate 退場**：獨立版 Prisma Accelerate 與 `prisma+postgres://accelerate.prisma-data.net` 連線將在 2026-12-01 停用；還在用的專案要改成直連資料庫或 Prisma Postgres 的 serverless driver。
- **連線池行為跟著 driver 走**：pool 設定改由底層 driver 決定，例如 `pg` 預設沒有連線逾時，Prisma 6 則是 5 秒。升級後遇到卡住的連線，先看 adapter 的 pool 參數。SSL 憑證驗證也變嚴格，以前被忽略的無效憑證現在會連不上。
- **其他 breaking change**：改成 ESM 套件、最低 Node 20.19 與 TypeScript 5.4；`prisma migrate dev` 不再自動跑 `prisma generate` 與 seed；client middleware（`$use`）移除，改用 Client Extensions；Metrics preview 移除。

從 6 升上來照官方 [Upgrade to v7](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7) 逐項改。MongoDB 專案不要升 7（7 不支援 MongoDB），官方建議直接升 Prisma 8（目前是 release candidate）。

## 什麼時候 Prisma 會讓你痛苦

**複雜 SQL 查詢**：Prisma 的 query builder 在複雜的 JOIN、子查詢、視窗函數場景會讓你寫得很彆扭，這時候 `prisma.$queryRaw` 逃生口很重要：

```typescript
const result = await prisma.$queryRaw<RawResult[]>`
  SELECT u.id, COUNT(p.id) as post_count
  FROM users u
  LEFT JOIN posts p ON p.author_id = u.id
  GROUP BY u.id
  HAVING COUNT(p.id) > 5
`
```

**效能敏感查詢**：Prisma 生成的 SQL 有時候不是最優的，`include` 深層關聯可能生成多個 N+1 查詢，需要用 `select` 精確控制或改用 raw SQL。

**大量資料 migration**：修改有大量資料的表格結構時，Prisma 生成的 migration SQL 可能需要手動調整（加 concurrent index、分批 backfill 等），不能盲目執行。

## Tradeoffs 總結

| 面向 | Prisma | 直接寫 SQL（e.g. pg / kysely） |
|------|--------|------|
| TypeScript 型別 | 自動生成，完整 | 需手寫或用 codegen |
| Migration 管理 | 內建版本控制 | 需自己管或用 migrate 工具 |
| 複雜查詢 | 彆扭，需 raw SQL | 完全掌控 |
| 效能調校 | 較難 | 完全掌控 |
| 學習曲線 | 中（schema 語法、API） | 低（會 SQL 就行） |

如果你的專案是 TypeScript + PostgreSQL + 標準 CRUD 為主，Prisma 是正確的選擇。如果你的業務邏輯需要大量複雜查詢或極致效能調校，考慮 Drizzle ORM（型別安全且更接近 SQL 語法）或直接用 pg + 手寫型別。

## 更新紀錄

- 2026-11-23：範例改成 Prisma 7 寫法（`prisma-client` generator、`prisma.config.ts`、driver adapter、生成路徑 import），新增「Prisma 7 改了什麼」一節（移除 Rust engine、edge 資料庫改走 driver adapter、Accelerate 2026-12-01 停用）。

## 參考資料

- [Prisma ORM 官方文件](https://www.prisma.io/docs)
- [Prisma Schema 參考](https://www.prisma.io/docs/orm/reference/prisma-schema-reference)
- [Prisma Client API 參考](https://www.prisma.io/docs/orm/reference/prisma-client-reference)
- [Announcing Prisma 7](https://www.prisma.io/blog/announcing-prisma-orm-7-0-0)
- [Upgrade to Prisma ORM 7](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7)
- [Deploy to Cloudflare Workers & Pages](https://www.prisma.io/docs/orm/prisma-client/deployment/edge/deploy-to-cloudflare) — edge 相容的 driver 清單
- [Drizzle ORM](https://orm.drizzle.team/) — 更接近 SQL 語法的型別安全 ORM 替代方案
- [島島阿學技術架構全覽](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture) — Prisma 在生產專案的完整架構脈絡
