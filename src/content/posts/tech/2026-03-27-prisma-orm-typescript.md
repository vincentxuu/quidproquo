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

🌏 [English version](/posts/tech/2026-03-27-prisma-orm-typescript-en)

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
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
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

`@@unique([userId, postId])` 這個設計對應島島的 Reaction upsert 模式——資料庫層就保證不會有重複資料。

## Migration 流程

改 schema 之後：

```bash
# 生成 migration SQL 並套用（開發環境）
npx prisma migrate dev --name add-reactions-table

# 套用 migration（生產環境，不生成新 migration）
npx prisma migrate deploy
```

生成的 migration 檔案放在 `prisma/migrations/`，commit 進版本控制。團隊協作時每個人都知道資料庫現在的狀態，不會有「你的資料庫跑了哪個 migration」的問題。

## 型別安全查詢

Prisma Client 的型別從 schema 自動推斷，IDE 補全完整：

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

## 參考資料

- [Prisma ORM 官方文件](https://www.prisma.io/docs)
- [Prisma Schema 參考](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API 參考](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Drizzle ORM](https://orm.drizzle.team/) — 更接近 SQL 語法的型別安全 ORM 替代方案
- [島島阿學技術架構全覽](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture) — Prisma 在生產專案的完整架構脈絡
