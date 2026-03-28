---
title: "Hono：為 Edge Runtime 而生的輕量 Web Framework"
date: 2026-03-27
category: tech
tags: [hono, cloudflare-workers, edge, web-framework]
lang: zh-TW
tldr: "Hono 是專為 Cloudflare Workers、Deno、Bun 等 edge runtime 設計的 Web framework，比 Express 輕一個數量級，原生支援 Web Standard API，是 edge 環境下的首選。"
description: "介紹 Hono 這個輕量 Web framework：為什麼它在 edge runtime 上比 Express 更合適、核心設計、程式碼範例，以及你什麼時候應該選它、什麼時候不應該。"
draft: false
---

Express 在 Node.js 上統治了超過十年，但在 Cloudflare Workers 上跑 Express 從一開始就是錯的。Workers 執行在 V8 Isolate 裡，不是 Node.js 環境，Express 的大量 Node.js API 依賴根本跑不動。Hono 就是為了解決這個問題而生的。

## 它是什麼

Hono 是一個超輕量的 Web framework，設計目標是在任何 JavaScript runtime 上跑：

- Cloudflare Workers
- Deno
- Bun
- Node.js（也支援，但不是主戰場）
- AWS Lambda

整個 core 大概 14KB，沒有任何 Node.js API 依賴，完全用 Web Standard API 寫（`Request`、`Response`、`URL`）。

NobodyClimb 的後端就是用 Hono，部署在 Cloudflare Workers 上。選它的原因很直接：沒有別的 framework 在 Cloudflare Workers 上有同樣的 DX 和完整度。

## 為什麼不用 Express

Express 的問題不是 API 設計不好，而是它預設 Node.js 存在：

- `req.socket`、`res.end()`、`Buffer` 都是 Node.js-only API
- Bundle size 在 Workers 的 1MB 限制裡佔比高
- 沒有原生的 async/await middleware 支援，錯誤處理容易漏

在 Cloudflare Workers 環境下，你需要：
1. 能直接操作 `env.DB`（D1）、`env.KV`（KV）、`env.R2`（R2）的 context
2. 支援 `ctx.waitUntil()` 做背景任務
3. Bundle size 盡量小

Hono 對這些都有原生支援。

## 核心特性

**Routing 語法跟 Express 幾乎一樣**，學習曲線幾乎是零：

```typescript
import { Hono } from 'hono'

const app = new Hono()

app.get('/posts/:id', (c) => {
  const id = c.req.param('id')
  return c.json({ id })
})

app.post('/posts', async (c) => {
  const body = await c.req.json()
  return c.json({ created: true }, 201)
})

export default app
```

**Middleware 是 async-first**，不會有 Express 裡 `next()` 忘記呼叫導致 hang 住的問題：

```typescript
import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import { cors } from 'hono/cors'

const app = new Hono<{ Bindings: Env }>()

app.use('*', cors())
app.use('/api/*', jwt({ secret: 'secret' }))

app.get('/api/me', (c) => {
  const payload = c.get('jwtPayload')
  return c.json({ userId: payload.sub })
})
```

**Cloudflare Workers bindings 透過 typed context 存取**：

```typescript
type Bindings = {
  DB: D1Database
  KV: KVNamespace
  AI: Ai
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/search', async (c) => {
  const query = c.req.query('q')
  // c.env.DB 是 D1，完全有型別
  const results = await c.env.DB
    .prepare('SELECT * FROM posts WHERE title LIKE ?')
    .bind(`%${query}%`)
    .all()
  return c.json(results)
})
```

**OpenAPI 整合（hono-openapi）**：

NobodyClimb 用 `hono-openapi` 自動生成 OpenAPI spec，API 文件和實作保持同步：

```typescript
import { describeRoute } from 'hono-openapi'
import { resolver } from 'hono-openapi/zod'

app.get(
  '/posts/:id',
  describeRoute({
    description: '取得單篇貼文',
    responses: {
      200: { content: { 'application/json': { schema: resolver(PostSchema) } } }
    }
  }),
  async (c) => {
    const id = c.req.param('id')
    // ...
  }
)
```

Scalar UI 掛在 `/api/v1/docs`，開發時直接在瀏覽器測 API。

## 架構分層

NobodyClimb 的 Hono 後端分三層：

```
routes → services → repositories
```

Routes 只管 OpenAPI 描述和 request validation，services 放業務邏輯，repositories 做 D1 查詢。這跟 Express 的分層方式一樣，Hono 沒有強制你用特定的架構風格。

## 什麼時候選 Hono

**適合的情境：**
- 部署在 Cloudflare Workers、Deno Deploy、Bun
- 需要小 bundle size（Workers 的限制）
- 想要 Web Standard API 相容的 codebase
- 從 Express 遷移，想要熟悉的 API 語法

**不適合的情境：**
- 已經在 Node.js 環境而且沒有遷移計畫
- 需要大量 Express 生態的 middleware（passport.js、multer 等）
- 團隊對 edge runtime 概念不熟，學習成本會轉移到其他地方

## Tradeoffs

Hono 很輕，但輕意味著你要自己組裝更多東西。Express 的生態有十幾年的 middleware 積累，很多需求有現成解法；Hono 的生態還在成長，遇到邊緣需求可能要自己寫。

另一個要注意的是：Workers 環境有很多限制（沒有檔案系統、沒有 TCP socket 直接存取、執行時間限制）。這些不是 Hono 的問題，是 Workers 的限制——但選了 Hono 通常意味著你也選了 Workers，所以要一起考慮。

## 參考資料

- [Hono 官方文件](https://hono.dev/)
- [Cloudflare Workers 官方文件](https://developers.cloudflare.com/workers/)
- [hono-openapi](https://github.com/rhinobase/hono-openapi)
- [NobodyClimb 系統架構](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture) — Hono 在實際 Cloudflare-first 專案的應用
- [NobodyClimb RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture) — 同個後端的 AI 問答系統設計
