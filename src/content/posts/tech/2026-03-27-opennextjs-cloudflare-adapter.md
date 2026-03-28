---
title: "@opennextjs/cloudflare：把 Next.js 跑在 Cloudflare Workers 上"
date: 2026-03-27
category: tech
tags: [opennextjs, cloudflare-workers, nextjs, deployment]
lang: zh-TW
tldr: "@opennextjs/cloudflare 讓 Next.js 15 App Router 部署到 Cloudflare Workers，動態 SSR 走 Worker，靜態資源走 Cloudflare Assets。沒有 server 管理成本，但有明確的功能限制。"
description: "@opennextjs/cloudflare adapter 的工作原理：如何把 Next.js 的 SSR 和靜態資源拆開部署到 Cloudflare 的邊緣網路。以 NobodyClimb 為例說明實際限制與適用情境。"
draft: false
---

Cloudflare Workers 跑的是 V8 isolate，不是標準 Node.js 環境。Next.js 本身依賴不少 Node.js API（`fs`、`crypto`、`net`、`http`），所以直接部署到 Workers 行不通。`@opennextjs/cloudflare` 是一個 adapter，把 Next.js build 的輸出轉換成 Cloudflare Workers 能跑的格式。

## 為什麼需要這個 adapter

Vercel 的 Next.js 部署是量身定做的，功能最完整。但如果你想部署到 Cloudflare，有幾個選擇：

1. **純靜態輸出（`next export`）**：只能做靜態網站，沒有 SSR、API routes
2. **自架 Node.js server**：需要管 server，失去 serverless 的優勢
3. **`@opennextjs/cloudflare`**：在 Cloudflare Workers 環境上跑 Next.js 的 SSR

第三個選項是 NobodyClimb 用的方式。

## 它做了什麼

build 流程：

```bash
# 先跑 Next.js 標準 build
next build

# 再用 adapter 轉換輸出
npx @opennextjs/cloudflare build
```

轉換後，原本的 Next.js 輸出被拆成兩部分：

```
.open-next/
├── worker.js          # Cloudflare Worker：處理 SSR 和 API routes
└── assets/            # 靜態資源：上傳到 Cloudflare Assets
```

**Worker** 負責：
- 動態路由的 SSR（`page.tsx` 用到 `async` 資料的部分）
- API routes（`route.ts`）
- Middleware（`middleware.ts`）

**Cloudflare Assets** 負責：
- `_next/static/`（JS chunks、CSS）
- `public/` 目錄的靜態檔案
- 完全靜態的頁面（沒有動態資料的 `generateStaticParams`）

請求進來，Cloudflare 邊緣節點先判斷是靜態資源還是動態請求，靜態的直接從 Assets 回應（接近 CDN 速度），動態的才進 Worker 跑 SSR。

## 設定

`wrangler.jsonc`（Cloudflare 的設定檔）：

```jsonc
{
  "name": "my-nextjs-app",
  "main": ".open-next/worker.js",
  "compatibility_date": "2024-11-18",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  },
  "kv_namespaces": [
    {
      "binding": "CACHE",
      "id": "your-kv-namespace-id"
    }
  ]
}
```

`nodejs_compat` flag 讓 Workers 支援部分 Node.js API，這是讓 Next.js 能跑的關鍵。

`package.json` 的 scripts：

```json
{
  "scripts": {
    "build": "next build && npx @opennextjs/cloudflare build",
    "deploy": "npm run build && wrangler deploy",
    "preview": "npm run build && wrangler dev"
  }
}
```

## 存取 Cloudflare 綁定

在 Workers 環境，你可以透過 `getRequestContext()` 取得 Cloudflare 的 bindings（D1、KV、R2）：

```typescript
// app/api/posts/route.ts
import { getRequestContext } from "@cloudflare/next-on-pages";

export async function GET() {
  const { env } = getRequestContext();

  // 用 D1 做查詢
  const result = await env.DB.prepare(
    "SELECT * FROM posts ORDER BY created_at DESC LIMIT 10"
  ).all();

  return Response.json(result.results);
}
```

這讓 Next.js 的 API routes 可以直接用 Cloudflare 的基礎設施，不需要另外架資料庫連線。NobodyClimb 用的是獨立的 Hono API（也跑在 Workers），但前端的 Next.js 也是透過相同機制取得 KV 快取等資源。

## 在 NobodyClimb 的角色

NobodyClimb 的 Web 前端是 Next.js 15 App Router，透過 `@opennextjs/cloudflare` 部署到 Cloudflare Workers。整個系統都跑在 Cloudflare 的基礎設施上：

```
瀏覽器請求
    │
    ▼
Cloudflare 邊緣節點
    ├── 靜態資源 → Cloudflare Assets（直接回應）
    └── 動態請求 → Worker（Next.js SSR）
                    │
                    ├── D1（SQLite 資料庫）
                    ├── KV（快取）
                    └── HTTP → Hono API Worker
```

這套架構讓 NobodyClimb 完全不需要管理 server，沒有 EC2、沒有 RDS、沒有 load balancer 設定。

## 已知限制

這個 adapter 不是萬能的，有明確的限制：

**不支援的 Next.js 功能：**
- `next/image` 的圖片優化（需要 Node.js，Workers 環境不支援）
- 部分 `next/font` 的 server-side 功能
- Incremental Static Regeneration（ISR）的完整支援（有限制）

**Workers 環境本身的限制：**
- CPU 時間限制：Workers 免費方案每個請求最多 10ms CPU time，付費方案 30ms
- 記憶體限制：128MB（Bundled），更大的需要 Unbound pricing
- 不能跑長時間的任務（超過 30 秒的 request 會 timeout）

**`getRequestContext()` 只能在 Workers 環境下呼叫：**
- 本地開發用 `wrangler dev` 而不是 `next dev`，不然 `getRequestContext()` 會出錯

實際開發中，你的 `package.json` 可能需要：

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:worker": "npm run build && wrangler dev"
  }
}
```

本地開發用 `next dev`（速度快、熱重載），測試 Workers 特定行為用 `wrangler dev`。

## 什麼時候用，什麼時候不用

**適合：**
- 你想要零 infra 管理成本，接受 Cloudflare 生態的限制
- 專案的動態請求量中等，不需要長時間運算
- 已經在用 Cloudflare 的其他服務（D1、R2、KV、Workers AI）

**不適合：**
- 需要 `next/image` 的圖片優化（考慮 Vercel 或自架）
- 有複雜的 Node.js 依賴（不是所有 npm package 都能在 Workers 跑）
- CPU 密集的 SSR（Workers 的 CPU 時間限制很嚴格）
- 需要完整 ISR 支援的大型內容網站

對 NobodyClimb 這樣的社群平台，流量不大、沒有複雜的圖片處理需求、全站用 Cloudflare 的 tradeoff 是值得的。但如果你的 Next.js 重度依賴 `next/image` 或有長時間 SSR 的頁面，這個 adapter 會帶來額外的限制。

## 取捨總結

| | @opennextjs/cloudflare | Vercel | 自架 Node.js |
|--|--|--|--|
| Infra 管理 | 零 | 零 | 需要 |
| Next.js 功能完整度 | 部分限制 | 最完整 | 完整（取決於 Node.js 版本） |
| 定價模式 | 按請求計費 | 按用量/席位 | 按 server 小時 |
| 冷啟動 | 極低（邊緣） | 低 | 無（always-on） |
| 適合規模 | 小到中型 | 小到大型 | 中到大型 |

## 參考資料

- [@opennextjs/cloudflare 官方文件](https://opennext.js.org/cloudflare)
- [OpenNext 專案](https://opennext.js.org/)
- [Cloudflare Workers 官方文件](https://developers.cloudflare.com/workers/)
- [Cloudflare Pages 與 Workers 的差異](https://developers.cloudflare.com/workers/platform/deployments/)
- [Workers AI 文件](https://developers.cloudflare.com/workers-ai/)
- [NobodyClimb：用 Cloudflare 全端打造攀岩社群平台](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture) — NobodyClimb 的完整 Cloudflare 架構與 @opennextjs/cloudflare 的實際使用
