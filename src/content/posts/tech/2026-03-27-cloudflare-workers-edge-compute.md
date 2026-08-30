---
title: "Cloudflare Workers：不是 Lambda，不是容器，是 V8 Isolate"
date: 2026-03-27
updated: 2026-08-19
type: guide
category: tech
tags: [cloudflare-workers, edge-compute, hono, wrangler, serverless]
lang: zh-TW
tldr: "Cloudflare Workers 用 V8 Isolate 取代容器，沒有 cold start，全球邊緣部署，透過 Bindings 接 D1、R2、KV、AI。適合 API、SSR、輕量後端，不適合 CPU 密集的工作。"
description: "Cloudflare Workers 的核心原理、Bindings 系統、wrangler 工具、定價，以及什麼時候該用、什麼時候不該用的實際判斷。"
draft: false
series:
  name: "Cloudflare Edge Platform"
  order: 1
---

🌏 [English version](/posts/tech/2026-03-27-cloudflare-workers-edge-compute-en)

Cloudflare Workers 常被拿來跟 AWS Lambda 比，但兩者的底層架構完全不同。Lambda 是容器，Workers 是 V8 Isolate——這個差異決定了一切。

## V8 Isolate vs 容器

Lambda 的 cold start 問題本質上是**容器啟動的成本**：拉映像、分配資源、啟動 runtime，快則幾百毫秒，慢則幾秒。

Workers 用的是 V8 Isolate——Chrome 瀏覽器裡跑 JavaScript 的那個東西。Isolate 之間記憶體隔離，但共用同一個 V8 引擎，不需要啟動新的 process 或容器，Cloudflare 說的「no cold start」不是行銷話術，是架構決定的——[官方的說法](https://developers.cloudflare.com/workers/reference/how-workers-works/)是這個模型「消除了虛擬機模型的冷啟動」、比起啟動一個 Node process「快上約一百倍」。（常見的「0-5ms 啟動」這個數字在現行官方頁上查不到出處，這裡不引。另注意 limits 頁對 global scope 有 1 秒的 startup time 上限。）

另一個差異是**執行位置**。Lambda 跑在你選的 AWS region，Workers 自動部署到 [Cloudflare 全球網路](https://www.cloudflare.com/network/)（官方描述是分布在數百個地點的數千台機器）。台灣使用者的請求在台灣或鄰近節點處理，不需要繞地球一圈。

## 限制先說清楚

Workers 不是萬能的，但真正卡住你的是哪一條，跟很多人以為的不一樣。**限制是 CPU 時間，不是牆鐘時間。**

- **CPU time**：只算 CPU 真的在執行你程式碼的時間，等 `fetch()`、等 D1 查詢都不算。免費版 10ms；付費版預設 30 秒、可在設定裡調到 5 分鐘上限
- **牆鐘時間**：HTTP 請求沒有硬性上限，只要 client 還連著就繼續跑；`waitUntil()` 在回應送出後可再延長一段時間。Cron Trigger、Queue consumer、Durable Object alarm 才有分鐘級的牆鐘上限
- **記憶體**：128 MB per Worker，兩個方案都一樣
- **Worker 大小**：免費版與付費版上限不同，打包出來太肥會部署失敗
- **Subrequest**：每次呼叫能發幾個外部請求有上限，免費版緊得多；付費版可以在設定裡往上調
- **沒有完整 native Node.js API**：`fs`、`child_process` 這類不能用，但大多數純 JS 套件可以

確切數字會變，[Workers Limits](https://developers.cloudflare.com/workers/platform/limits/) 是唯一該相信的來源——這頁分開列了 CPU time 與 wall time 兩張表，值得整頁讀過一次。

Workers runtime 不是完整的 Node.js。`node:crypto`、`node:buffer` 這些走 [Node.js 相容層](https://developers.cloudflare.com/workers/runtime-apis/nodejs/)，要開 `nodejs_compat` compatibility flag 才有。

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

新專案直接用 `npm create cloudflare@latest` 起，它會把 wrangler 裝成專案的 devDependency 並產好設定檔；日常用 `npx wrangler <command>` 呼叫，不建議全域安裝（版本會跟專案脫鉤）。常用的幾個是 `wrangler login`、`wrangler dev`（本地跑）、`wrangler deploy`（部署）、`wrangler tail`（看即時 log）。完整清單見 [Wrangler commands](https://developers.cloudflare.com/workers/wrangler/commands/)。

`wrangler dev` 在本地起一個 Workers runtime，Bindings（D1、KV、R2）預設用本地模擬，也可以改連實際的 Cloudflare 資源。

設定檔現在有 JSON 與 TOML 兩種寫法，**官方建議新專案用 `wrangler.jsonc`**（部分較新的功能只支援 JSON 設定檔）：

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "my-api",
  "main": "src/index.ts",
  // 設成你開始寫這個 Worker 的日期
  "compatibility_date": "2026-08-18",
  "compatibility_flags": ["nodejs_compat"],
  "d1_databases": [
    { "binding": "DB", "database_name": "my-db", "database_id": "<DATABASE_ID>" }
  ],
  "kv_namespaces": [{ "binding": "KV", "id": "<NAMESPACE_ID>" }],
  "ai": { "binding": "AI" },
  "observability": { "enabled": true }
}
```

`wrangler.toml` 一樣能用，格式完全對應、只差語法。欄位一覽見 [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)。

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

## 計費模型

價目表會變，這裡只講形狀：Workers 按**請求數 + CPU 毫秒數**兩軸計費，等待網路 I/O 的時間不計費——這是它跟 Lambda（按 GB-秒、含等待時間）最大的成本結構差異。一個大量呼叫外部 API、自己幾乎不算的 Worker，在 Cloudflare 上便宜得不成比例。

免費方案有每日請求上限，付費方案有月度包含額度、超出按量。D1、KV、R2、Workers AI 各自另有免費額度與計費軸，要分開算。實際數字看 [Workers Pricing](https://developers.cloudflare.com/workers/platform/pricing/)。

對多數 side project 和中小型應用，免費方案就夠用。

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
- 大量 CPU 密集運算（機器學習訓練、影像轉檔）——這是最硬的一條，CPU 上限直接擋住
- 記憶體吃超過 128 MB 的工作
- 需要 native Node.js addon 的套件（某些資料庫 driver、`.node` binary）
- 需要本地檔案系統（`fs` 不能用）

有兩件事**不再**是不用 Workers 的理由：長連線的 WebSocket 有 [Durable Objects](https://developers.cloudflare.com/durable-objects/)（只要 caller 連著就沒有牆鐘上限），長流程有 Workflows。它們是不同的心智模型，但不是「Workers 做不到」。

跟傳統 VPS 或容器的比較：Workers 犧牲的是**單次請求能燒多少 CPU 與記憶體**，換來零 infra 管理、全球部署、以及只為實際運算付費的計費方式。你的工作單元夠小就選 Workers，不夠小就選容器。

## 更新紀錄

- 2026-08-19：對照官方文件逐篇查證翻新，移除易腐內容，並收進「Cloudflare 邊緣tech stack」系列

## 參考資料

- [Cloudflare Workers 官方文件](https://developers.cloudflare.com/workers/)
- [Cloudflare Workers Limits](https://developers.cloudflare.com/workers/platform/limits/)
- [Cloudflare Workers Pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- [Wrangler 設定檔參考](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [Workers 的 Node.js 相容性](https://developers.cloudflare.com/workers/runtime-apis/nodejs/)
- [NobodyClimb 系統架構](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
- [NobodyClimb RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture)
- [Hono Web Framework](/posts/tech/2026-03-27-hono-web-framework)
- [Cloudflare R2](/posts/tech/2026-03-27-cloudflare-r2-object-storage)
- [Cloudflare KV](/posts/tech/2026-03-27-cloudflare-kv-key-value-store)
- [@opennextjs/cloudflare](/posts/tech/2026-03-27-opennextjs-cloudflare-adapter)
