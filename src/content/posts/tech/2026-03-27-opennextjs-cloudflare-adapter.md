---
title: "@opennextjs/cloudflare：把 Next.js 跑在 Cloudflare Workers 上"
date: 2026-03-27
updated: 2026-08-19
type: guide
category: tech
tags: [opennextjs, cloudflare-workers, nextjs, deployment]
lang: zh-TW
tldr: "@opennextjs/cloudflare 讓 Next.js App Router 部署到 Cloudflare Workers，動態 SSR 走 Worker，靜態資源走 Cloudflare Assets。沒有 server 管理成本，但有明確的功能限制。"
description: "@opennextjs/cloudflare adapter 的工作原理：如何把 Next.js 的 SSR 和靜態資源拆開部署到 Cloudflare 的邊緣網路。以 NobodyClimb 為例說明實際限制與適用情境。"
draft: false
series:
  name: "Cloudflare 邊緣tech stack"
  order: 6
---

🌏 [English version](/posts/tech/2026-03-27-opennextjs-cloudflare-adapter-en)

Cloudflare Workers 跑的是 V8 isolate，不是標準 Node.js 環境。Next.js 本身依賴不少 Node.js API（`fs`、`crypto`、`net`、`http`），所以直接部署到 Workers 行不通。`@opennextjs/cloudflare` 是一個 adapter，把 Next.js build 的輸出轉換成 Cloudflare Workers 能跑的格式。

## 為什麼需要這個 adapter

Vercel 的 Next.js 部署是量身定做的，功能最完整。但如果你想部署到 Cloudflare，有幾個選擇：

1. **純靜態輸出（`next export`）**：只能做靜態網站，沒有 SSR、API routes
2. **自架 Node.js server**：需要管 server，失去 serverless 的優勢
3. **`@opennextjs/cloudflare`**：在 Cloudflare Workers 環境上跑 Next.js 的 SSR

第三個選項是 NobodyClimb 用的方式。

另外要先釐清一件常見的混淆：`@opennextjs/cloudflare` 跑的是 Next.js 的 **Node.js runtime**，不是 Edge runtime。這跟已經被它取代的 `@cloudflare/next-on-pages` 正好相反（那個只支援 Edge runtime）。所以遷移過來時，程式碼裡所有 `export const runtime = "edge";` 都要拿掉——**留著會壞**。

支援的 Next.js 版本、以及哪些功能已經支援，官方 [Cloudflare 總覽頁](https://opennext.js.org/cloudflare) 有逐項清單，這是最該先讀的一頁。

## 它做了什麼

新專案直接用官方 scaffold：

```bash
npm create cloudflare@latest -- my-next-app --framework=next --platform=workers
```

既有專案有一鍵遷移指令：

```bash
npx @opennextjs/cloudflare migrate
```

它會裝好套件、產出 `wrangler.jsonc` 與 `open-next.config.ts`、改好 scripts。之後日常用的是 `opennextjs-cloudflare` 這支 CLI：`build`（會自己去呼叫你 `package.json` 裡的 `build` script 跑 `next build`）、`preview`（在本地的 Workers runtime 跑起來）、`deploy`、`upload`。

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

靜態資產的快取要自己補一個 `public/_headers`，把 `/_next/static/*` 設成 `immutable`，否則每次都會回源。

請求進來，Cloudflare 邊緣節點先判斷是靜態資源還是動態請求，靜態的直接從 Assets 回應（接近 CDN 速度），動態的才進 Worker 跑 SSR。

## 設定

`wrangler.jsonc`（Cloudflare 的設定檔）：

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "my-nextjs-app",
  "main": ".open-next/worker.js",
  // 必須是 2024-09-23 之後
  "compatibility_date": "2026-08-18",
  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  },
  "services": [
    // service 名稱要跟上面的 name 一致
    { "binding": "WORKER_SELF_REFERENCE", "service": "my-nextjs-app" }
  ],
  "images": {
    // 開啟 next/image 的圖片最佳化
    "binding": "IMAGES"
  }
}
```

三個容易漏掉的欄位：`nodejs_compat` 是 Next.js 能跑的前提；`WORKER_SELF_REFERENCE` 這個 service binding 是 adapter 內部要用的；`images` binding 開了才有圖片最佳化。`main` 與 `assets` 不要自己改。

`package.json` 的 scripts：

```json
{
  "scripts": {
    "build": "next build",
    "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
    "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy",
    "cf-typegen": "wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts"
  }
}
```

注意 `build` 就是純 `next build`——`opennextjs-cloudflare build` 會自己去叫它，兩個串在一起會跑兩次。

## 存取 Cloudflare 綁定

取 bindings（D1、KV、R2）的函式是 `getCloudflareContext()`，從 `@opennextjs/cloudflare` 匯入：

```typescript
// app/api/posts/route.ts
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET() {
  const { env, cf, ctx } = getCloudflareContext();

  // 用 D1 做查詢
  const result = await env.DB.prepare(
    "SELECT * FROM posts ORDER BY created_at DESC LIMIT 10"
  ).all();

  return Response.json(result.results);
}
```

> 舊教學裡的 `getRequestContext()`（來自 `@cloudflare/next-on-pages`）是**另一個 adapter** 的 API，在 `@opennextjs/cloudflare` 上不存在，照抄會直接壞掉。

在 SSG（build 階段預先產生）的 route 裡要用 async 模式：`await getCloudflareContext({ async: true })`。要注意這時候讀到的是**本地模擬的 binding 值與 `.dev.vars` 裡的 secret**，不是 production 資料——除非你開了 remote bindings。

`env` 之外，`cf`（請求的地理與連線資訊）和 `ctx`（`waitUntil` 等生命週期方法）也從同一個回傳值拿。型別用 `wrangler types --env-interface CloudflareEnv` 產生。

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

**真正不支援的：**
- **Edge runtime**：`export const runtime = "edge";` 必須全部移除
- Next.js 15.2 引進的 **Node Middleware** 目前還不支援

**已經支援、但舊文章常寫成不支援的：**
- `next/image` 的圖片最佳化——透過 `IMAGES` binding（背後是 Cloudflare Images）或自訂 loader 都行。有幾個相容性缺口要知道：只吃 PNG / JPEG / WEBP / AVIF / GIF / SVG，其他格式原樣回傳不做處理；`minimumCacheTTL` 設定無效；而且圖片最佳化本身[會另外計費](https://opennext.js.org/cloudflare/howtos/image)
- **ISR / `'use cache'` / PPR / `after`**：都在支援清單裡，但要接一個 incremental cache（官方預設走 R2），沒接就沒有跨請求的快取

**Workers 環境本身的限制：**
- CPU 時間：免費方案每次請求 10 ms；付費方案預設 30 秒、上限 5 分鐘。SSR 重的頁面在免費方案上很容易撞到
- 記憶體 128 MB（新專案不會再遇到 Bundled / Unbound 這兩個舊方案名稱，但[官方 limits 頁仍保留專節](https://developers.cloudflare.com/workers/platform/limits/)，既有 Worker 還適用——Bundled 是 CPU 50 ms、每請求 50 個 subrequest）
- 詳見 [Workers 的限制](/posts/tech/2026-03-27-cloudflare-workers-edge-compute)

**本地開發不需要放棄 `next dev`：**
在 `next.config.ts` 裡呼叫 `initOpenNextCloudflareForDev()`，`next dev` 底下也拿得到 bindings：

```typescript
// next.config.ts
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

export default { /* ... */ };
```

日常開發用 `next dev`（快、熱重載），要驗證真實 Workers runtime 行為時才 `npm run preview`。預設用的是本地模擬的 binding；要連真的 Cloudflare 資源，把該 binding 的 `remote` 設成 `true`（remote bindings 在 wrangler 4.36.0 之後穩定）。

## 什麼時候用，什麼時候不用

**適合：**
- 你想要零 infra 管理成本，接受 Cloudflare 生態的限制
- 專案的動態請求量中等，不需要長時間運算
- 已經在用 Cloudflare 的其他服務（D1、R2、KV、Workers AI）

**不適合：**
- 程式碼還大量依賴 Edge runtime，而且短期不打算改
- 有複雜的 native Node.js 依賴（不是所有 npm package 都能在 Workers 跑）
- CPU 密集的 SSR，而且不打算升到付費方案

對 NobodyClimb 這樣的社群平台，流量不大、全站用 Cloudflare 的 tradeoff 是值得的。

## 取捨總結

| | @opennextjs/cloudflare | Vercel | 自架 Node.js |
|--|--|--|--|
| Infra 管理 | 零 | 零 | 需要 |
| Next.js 功能完整度 | 部分限制 | 最完整 | 完整（取決於 Node.js 版本） |
| 定價模式 | 按請求計費 | 按用量/席位 | 按 server 小時 |
| 冷啟動 | 極低（邊緣） | 低 | 無（always-on） |
| 適合規模 | 小到中型 | 小到大型 | 中到大型 |

## 更新紀錄

- 2026-08-19：對照官方文件逐篇查證翻新，移除易腐內容，並收進「Cloudflare 邊緣tech stack」系列

## 參考資料

- [@opennextjs/cloudflare 官方文件](https://opennext.js.org/cloudflare) — 支援的 Next.js 版本與功能清單
- [Get Started（含 wrangler 設定範本）](https://opennext.js.org/cloudflare/get-started)
- [存取 bindings：`getCloudflareContext`](https://opennext.js.org/cloudflare/bindings)
- [圖片最佳化設定與相容性缺口](https://opennext.js.org/cloudflare/howtos/image)
- [OpenNext 專案](https://opennext.js.org/)
- [Cloudflare Workers 官方文件](https://developers.cloudflare.com/workers/)
- [從 Pages 遷移到 Workers](https://developers.cloudflare.com/workers/static-assets/migrate-from-pages/)
- [Workers AI 文件](https://developers.cloudflare.com/workers-ai/)
- [NobodyClimb：用 Cloudflare 全端打造攀岩社群平台](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture) — NobodyClimb 的完整 Cloudflare 架構與 @opennextjs/cloudflare 的實際使用
