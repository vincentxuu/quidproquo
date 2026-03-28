---
title: "Cloudflare Workers：不是 Lambda，不是容器，是 V8 Isolate"
date: 2026-03-27
category: tech
tags: [cloudflare-workers, edge-compute, hono, wrangler, serverless]
lang: zh-TW
tldr: "Cloudflare Workers 用 V8 Isolate 取代容器，沒有 cold start，全球邊緣部署，透過 Bindings 接 D1、R2、KV、AI。適合 API、SSR、輕量後端，不適合長時間執行的任務。"
description: "Cloudflare Workers 的核心原理、Bindings 系統、wrangler 工具、定價，以及什麼時候該用、什麼時候不該用的實際判斷。"
draft: false
---

Cloudflare Workers 常被拿來跟 AWS Lambda 比，但兩者的底層架構完全不同。Lambda 是容器，Workers 是 V8 Isolate——這個差異決定了一切。

## V8 Isolate vs 容器

Lambda 的 cold start 問題本質上是**容器啟動的成本**：拉映像、分配資源、啟動 runtime，快則幾百毫秒，慢則幾秒。

Workers 用的是 V8 Isolate——Chrome 瀏覽器裡跑 JavaScript 的那個東西。Isolate 之間記憶體隔離，但共用同一個 V8 引擎，不需要啟動新的 process 或容器，啟動時間在 **0-5ms** 之間。實際上 Cloudflare 說的「no cold start」是真的，不是行銷話術。

另一個差異是**執行位置**。Lambda 跑在你選的 AWS region，Workers 自動部署到 Cloudflare 全球 300+ PoP。台灣使用者的請求在台灣或鄰近節點處理，不需要繞地球一圈。

## 限制先說清楚

Workers 不是萬能的，限制很硬：

- **CPU time**：免費版 10ms，付費版 30ms（可延長到 5 分鐘，但要用 `ctx.waitUntil()`）
- **記憶體**：128MB per Worker
- **執行時間**：單次請求最多 30 秒（Subrequest 有另外的限制）
- **沒有 native Node.js API**：`fs`、`net`、`child_process` 不能用，但大多數純 JS 套件可以
- **不能長時間跑**：不適合 batch job、定時爬蟲、影片轉檔

Workers runtime 是 Service Worker API + 部分 Web API，不是完整的 Node.js。`node:crypto`、`node:buffer` 這些有透過 compatibility flags 支援，但要特別開啟。

## 最基本的 Worker

```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      return new Response("Hello from the edge", { status: 200 });
    }

    return new Response("Not found", { status: 404 });
  },
};
```

`env` 是 Bindings 進來的地方，後面會解釋。

## 用 Hono 寫 API

直接用原始的 `fetch` handler 寫 API 很麻煩，路由要自己拆。[Hono](/posts/tech/2026-03-27-hono-web-framework) 是專門為 edge runtime 設計的 Web framework，bundle size 小，支援 Workers 原生 API。

```typescript
import { Hono } from "hono";
import { cors } from "hono/cors";

type Bindings = {
  DB: D1Database;
  KV: KVNamespace;
  AI: Ai;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", cors());

app.get("/api/posts", async (c) => {
  const posts = await c.env.DB.prepare(
    "SELECT id, title, created_at FROM posts ORDER BY created_at DESC LIMIT 20"
  ).all();

  return c.json(posts.results);
});

app.post("/api/posts", async (c) => {
  const body = await c.req.json<{ title: string; content: string }>();

  const result = await c.env.DB.prepare(
    "INSERT INTO posts (title, content) VALUES (?, ?)"
  )
    .bind(body.title, body.content)
    .run();

  return c.json({ id: result.meta.last_row_id }, 201);
});

export default app;
```

`c.env` 就是 Workers 的 Bindings，型別安全，IDE 補全都有。

## wrangler CLI

wrangler 是 Cloudflare 官方的開發工具，從初始化到部署都靠它。

```bash
# 安裝
npm install -g wrangler

# 登入
wrangler login

# 本地開發（模擬 Workers 環境）
wrangler dev

# 部署
wrangler deploy

# 查看 log（即時）
wrangler tail
```

`wrangler dev` 會在本地起一個模擬 Workers 環境的 server，Bindings（D1、KV、R2）也可以連到本地模擬或實際的 Cloudflare 資源，透過 `--remote` 切換。

`wrangler.toml` 是設定檔：

```toml
name = "my-api"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "my-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

[[kv_namespaces]]
binding = "KV"
id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

[ai]
binding = "AI"
```

## Bindings 系統

Bindings 是 Workers 連接 Cloudflare 服務的方式，透過 `env` 物件注入，不需要 API key、不需要網路連線（在 Workers 內部，Binding 是直接的 runtime 連接）。

主要的 Bindings：

| Binding | 用途 |
|---------|------|
| `D1Database` | SQLite 關聯式資料庫 |
| `KVNamespace` | Key-Value 儲存，適合快取 |
| `R2Bucket` | 物件儲存，S3 相容 |
| `Ai` | Workers AI，embedding + LLM |
| `Queue` | 訊息佇列，async job 處理 |
| `DurableObjectNamespace` | 有狀態的單點執行物件 |
| `Fetcher` | 呼叫其他 Worker 的 service binding |

[Cloudflare KV](/posts/tech/2026-03-27-cloudflare-kv-key-value-store) 是最終一致性，全球讀取快但寫入有延遲。[Cloudflare R2](/posts/tech/2026-03-27-cloudflare-r2-object-storage) 適合靜態資產、使用者上傳的圖片和影片，沒有 egress 費用。

## 定價

**免費版（Free）：**
- 每天 100,000 個請求
- CPU time：10ms per request
- KV、D1、R2 各有免費額度

**付費版（Workers Paid，$5/月）：**
- 每月 10,000,000 個請求（超過 $0.30 per 百萬）
- CPU time 提升到 30ms，可延長
- D1、KV、R2 額度大幅提升

對多數 side project 和中小型應用，免費版就夠。$5/月 的付費版幾乎是業界最便宜的 serverless 方案之一——同等規模的 Lambda + API Gateway 會貴很多。

## NobodyClimb 的用法

[NobodyClimb](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture) 的整個後端跑在 Workers 上，沒有傳統伺服器：

- **Web SSR**：Next.js 15 透過 [@opennextjs/cloudflare](/posts/tech/2026-03-27-opennextjs-cloudflare-adapter) 部署到 Workers，動態路由走 Worker，靜態資源走 Cloudflare Assets
- **API**：Hono Worker，接 D1（使用者資料、攀登紀錄）和 KV（快取、配額）
- **AI**：[RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture) 也在 Workers 裡，Embedding 和 LLM 透過 `env.AI` 呼叫 Workers AI

這個架構的核心邏輯：攀岩社群平台的流量不穩定，養一台長期運行的 server 不划算。Workers 按請求計費，平常沒流量就不花錢，有流量時在全球邊緣快速回應。

## 什麼時候用 Workers，什麼時候不用

**適合用 Workers：**
- REST API、GraphQL endpoint
- SSR（搭配 Next.js、Nuxt 的 adapter）
- Edge middleware（auth、redirect、A/B testing）
- Webhook handler
- 輕量排程任務（搭配 Cron Triggers）

**不適合用 Workers：**
- 需要超過 30 秒的任務（影片處理、大型 batch job）
- 大量 CPU 密集運算（機器學習訓練、影像處理）
- 需要 native Node.js API 的套件（某些資料庫 driver、native addon）
- 需要維持 WebSocket 長連線（可以用 Durable Objects，但複雜度不同）
- 需要本地檔案系統（`fs` 不能用）

跟傳統 VPS 或容器的比較：Workers 犧牲了執行彈性（時間、記憶體、API 限制），換來的是零 infra 管理、全球部署、和非常便宜的計費方式。如果你的應用符合這些限制，Workers 是很好的選擇；如果不符合，就用容器。

## 參考資料

- [Cloudflare Workers 官方文件](https://developers.cloudflare.com/workers/)
- [Cloudflare Workers Limits](https://developers.cloudflare.com/workers/platform/limits/)
- [Cloudflare Workers Pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- [NobodyClimb 系統架構](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [NobodyClimb RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture)
- [Hono Web Framework](/posts/tech/2026-03-27-hono-web-framework)
- [Cloudflare R2](/posts/tech/2026-03-27-cloudflare-r2-object-storage)
- [Cloudflare KV](/posts/tech/2026-03-27-cloudflare-kv-key-value-store)
- [@opennextjs/cloudflare](/posts/tech/2026-03-27-opennextjs-cloudflare-adapter)
