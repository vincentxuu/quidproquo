---
title: "Express.js：Node.js 後端的預設答案，以及它為什麼還值得選"
date: 2026-03-27
category: tech
tags: [expressjs, nodejs, backend, api]
lang: zh-TW
tldr: "Express 是 Node.js 最成熟的 Web framework，middleware 生態完整、學習資源豐富。搭配 TypeScript 和清楚的分層架構，在 2026 年仍然是有理由選的選項。"
description: "介紹 Express.js 的核心設計哲學、middleware pattern、TypeScript 整合，以及島島（DaoDAO）為何選它作為主後端框架——還有什麼時候你應該考慮其他選擇。"
draft: false
---

Express 在 2010 年發布，距今已經超過 15 年。每隔幾年就有人宣告它「死了」，換成 Fastify、Koa、NestJS，但 npm 下載數一直維持在前幾名。島島（DaoDAO）的主後端用的就是 Express + TypeScript，這個選擇有其道理。

## 它是什麼

Express 是一個極簡的 Node.js Web framework，只做三件事：

1. **Routing**：把 HTTP 請求對應到處理函式
2. **Middleware**：讓請求在到達處理函式前經過一系列處理器
3. **Response helpers**：`res.json()`、`res.send()`、`res.status()` 等

就這樣。Express 不管你的資料庫、不管你的 ORM、不管你的 auth，所有這些都靠生態系的 middleware 和你自己的架構決策補齊。

這個極簡設計是 Express 的最大優勢，也是最大弱點——彈性高，但沒有護欄。

## 為什麼島島選 Express

島島的後端需求：
- REST API 給前端（Next.js + Expo）
- JWT auth + Google OAuth
- BullMQ 通知系統整合
- Prisma ORM 存取 PostgreSQL
- Zod validation

Express 的成熟生態對這些需求都有現成解法。Passport.js 處理 OAuth、BullMQ 本身就是 Node.js package 直接引入、Prisma client 在 Node.js 環境裡開箱即用。

換成 Fastify 或 NestJS 也行，但遷移成本沒有對應的收益——Express 夠用，而且團隊熟悉。

## Middleware Pattern

Express 的核心是 middleware chain。每個 middleware 是一個函式，接收 `(req, res, next)`，做完事情後呼叫 `next()` 傳給下一個：

```typescript
import express, { Request, Response, NextFunction } from 'express'

const app = express()

// 全域 middleware
app.use(express.json())
app.use(cors())

// 自訂 middleware：請求日誌
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

// Auth middleware
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' })
  // verify token...
  next()
}

// 只在特定 route 掛 auth
app.get('/api/me', requireAuth, (req, res) => {
  res.json({ success: true, data: req.user })
})
```

## 分層架構

島島的 Express 後端分四層：

```
routes → controllers → services → Prisma ORM
              ↕
         middleware（auth、rate limit、validation）
```

**Routes**：只管路徑對應和 middleware 掛載

```typescript
// routes/posts.ts
import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
import { PostController } from '../controllers/PostController'

const router = Router()
const controller = new PostController()

router.get('/', controller.list)
router.post('/', requireAuth, controller.create)
router.get('/:id', controller.getById)

export default router
```

**Controllers**：處理 HTTP request/response，不放業務邏輯

```typescript
// controllers/PostController.ts
import { Request, Response } from 'express'
import { PostService } from '../services/PostService'
import { CreatePostSchema } from '../schemas/post'

export class PostController {
  private service = new PostService()

  list = async (req: Request, res: Response) => {
    const posts = await this.service.list()
    res.json({ success: true, data: posts, timestamp: new Date().toISOString() })
  }

  create = async (req: Request, res: Response) => {
    const parsed = CreatePostSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ success: false, data: null, errors: parsed.error.issues })
    }
    const post = await this.service.create(parsed.data)
    res.status(201).json({ success: true, data: post, timestamp: new Date().toISOString() })
  }
}
```

**Services**：業務邏輯，不知道 HTTP 存在

```typescript
// services/PostService.ts
import { prisma } from '../lib/prisma'
import { CreatePostInput } from '../schemas/post'
import { randomUUID } from 'crypto'

export class PostService {
  list() {
    return prisma.post.findMany({ orderBy: { createdAt: 'desc' } })
  }

  create(data: CreatePostInput) {
    return prisma.post.create({
      data: { ...data, externalId: randomUUID() }
    })
  }
}
```

這個分層讓每一層只做自己的事，service 完全可以獨立測試，不需要模擬 HTTP。

## 統一回應格式

島島所有 API 回應都遵循同一個結構：

```typescript
interface ApiResponse<T> {
  success: boolean
  data: T | null
  timestamp: string
  meta?: { page?: number; total?: number }
}
```

前端的 API client 統一處理錯誤，不需要每個 endpoint 各自判斷。

## External UUID 設計

所有對外暴露的 ID 都用 UUID 而不是自增 ID。`/api/posts/1`、`/api/posts/2` 這種 URL 讓攻擊者可以枚舉資源——UUID 格式讓猜測不可行。Prisma schema 裡的 `id` 用自增 int 做主鍵（效能好），另外有 `externalId` 欄位用 UUID，對外 API 只暴露 `externalId`。

## Tradeoffs

**Express 的問題：**

- **沒有結構**：你要自己決定分層、命名、組織方式。入門容易，但長期維護需要紀律
- **Callback 時代的遺產**：Express 的 error handling 用 `(err, req, res, next)` 四參數 middleware，async 錯誤要手動 try/catch 或用 wrapper
- **型別支援靠 @types/express**：比 Fastify 的原生 TypeScript 支援薄一些

**還是會選 Express 的理由：**

- 文件和教學資源是所有 Node.js framework 裡最多的
- 幾乎所有 Node.js 相容的 package 都有 Express 範例
- 招募時，找得到 Express 經驗的後端工程師比找 Fastify 或 Koa 容易
- 從零到 production-ready 的路徑清楚

如果你在 Node.js 環境、不需要 edge runtime、團隊對架構設計有經驗，Express + TypeScript 仍然是合理的選擇。如果你想要更多框架護欄，NestJS 是在 Express 之上的完整框架，如果你追求極致效能，Fastify 值得評估。

## 參考資料

- [Express.js 官方文件](https://expressjs.com/)
- [Passport.js 官方文件](https://www.passportjs.org/)
- [Zod 官方文件](https://zod.dev/)
- [BullMQ 官方文件](https://docs.bullmq.io/)
- [島島阿學技術架構全覽](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture) — Express 在實際生產專案的完整應用
