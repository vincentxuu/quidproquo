---
title: 這個部落格用了哪些工具
date: 2026-03-12
category: tech
tags: [astro, cloudflare, blog, tools]
lang: zh-TW
description: 介紹這個部落格的完整技術棧，從框架選擇、Cloudflare 生態系到整體架構設計
tldr: Astro + Cloudflare 全家桶，靜態優先、邊緣運算、零維運成本
draft: false
type: guide
pinned: true
---

這個部落格跑在 Astro + Cloudflare Workers 上，搭配 D1、R2、KV、Vectorize、Workers AI。選這套組合的核心邏輯是：內容網站不需要複雜的 server，但需要夠靈活的基礎設施在對的時候做對的事。

## 框架：Astro

Astro 是一個內容優先的靜態網站生成器，最核心的設計原則叫做 **Islands Architecture**——預設輸出純 HTML，只有明確標記需要互動的元件才會輸出 JavaScript。

這跟 Next.js 的思路相反。Next.js 預設是 JavaScript 驅動，你要特別用 `"use client"` / `"use server"` 來區分邊界。Astro 則是預設零 JS，需要互動才用 `client:load` 等指令啟用。對部落格這種以閱讀為主的內容網站，Astro 的方向更自然——文章頁面根本不需要任何客戶端邏輯。

Astro 6 支援 **Hybrid Mode**，讓靜態頁面和動態 API 可以在同一個專案裡共存。這個網站的文章頁面加上 `export const prerender = true`，在 build 時就產生好 HTML；搜尋和 API endpoint 則走 server-side rendering，按需處理。

### Content Collections

Astro 內建的 Content Collections 是管理 Markdown 的正確方式。用 Zod 定義 schema：

```typescript
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    tags: z.array(z.string()),
    lang: z.enum(['zh-TW', 'en']).default('zh-TW'),
    tldr: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});
```

frontmatter 的欄位在 TypeScript 裡有完整型別，打錯欄位名稱或填錯型別，build 時直接報錯。不用等到頁面渲染才發現資料異常。

### i18n

Astro 6 內建 i18n routing，這個網站設定中文為預設語系（根路徑），英文用 `/en/` 前綴。不需要第三方套件，設定幾行就完成多語言路由分離。

---

## 部署：Cloudflare Workers

Cloudflare Workers 是邊緣計算平台——程式碼不跑在單一機房，而是部署到全球 300+ 個節點，每個請求在離使用者最近的節點執行。

對比傳統的 serverless（Lambda、Cloud Functions），Workers 的優勢是**冷啟動幾乎為零**。Lambda 的冷啟動可能要幾百毫秒，Workers 是 V8 Isolate 架構，啟動時間在 5ms 以下。對需要快速回應的 API 來說差異明顯。

Workers 的限制在於執行環境。它不是完整的 Node.js，只有部分 Web API，某些 npm 套件不能直接用。bundle size 也有上限（壓縮後 1MB），邏輯複雜的應用要注意。

部署用 `wrangler deploy`，本地開發用 `wrangler dev`，可以模擬 D1、KV 等服務，不需要連到雲端。

---

## 資料庫：Cloudflare D1

D1 是 Cloudflare 的 serverless SQLite，跑在邊緣節點上。

這個網站的 Markdown 檔案是唯一的 source of truth，D1 是衍生副本。build 時透過 `scripts/sync-to-d1.ts` 把文章內容同步進去，目的是支援後續的 RAG 搜尋——讓 AI 可以查詢文章內容來回答問題。

D1 用起來就是 SQLite，熟悉 SQL 就能直接上手。`batch()` API 可以一次送多個 statement，但有每次 100 個的隱性上限，超過的部分會靜默丟棄（[詳見這篇](/posts/tech/2026-03-12-cloudflare-d1-batch-timeout)）。

跟 PlanetScale、Supabase 等獨立資料庫服務比，D1 的優勢是零配置——已經在 Cloudflare 生態裡，binding 設定好就能用，不需要管連線字串和憑證。

---

## 向量搜尋：Cloudflare Vectorize

Vectorize 是 Cloudflare 的向量資料庫，用來儲存文字的 embedding（語意向量）。

這個網站預計用它做 RAG 搜尋：使用者輸入問題 → 把問題轉成 embedding → 在 Vectorize 找最相近的文章段落 → 把段落交給 AI 生成回答。目前功能還沒啟用，但 index 和 binding 已經設定好了。

Vectorize 是托管服務，不需要自己維護向量資料庫（比如 Pinecone 或自架 Qdrant），對個人專案來說省去很多維運工作。

---

## AI 推理：Cloudflare Workers AI

Workers AI 讓你在 Cloudflare 上直接跑 AI 模型，不需要呼叫 OpenAI 或 Anthropic 等外部 API。

可用模型涵蓋 embedding（`@cf/baai/bge-base-en-v1.5`）、文字生成（Llama、Mistral 系列）、圖片生成（Stable Diffusion）等。對這個網站來說，主要用途是把文章內容轉成 embedding 存進 Vectorize，以及之後的 AI 問答。

跟呼叫外部 API 比，Workers AI 的優點是延遲低（同在 Cloudflare 網路內）、計費透明、不需要管理 API key。缺點是可用模型比 OpenAI 少，能力也有差距。

---

## 物件儲存：Cloudflare R2

R2 是 Cloudflare 的物件儲存，API 相容 AWS S3，用來存放圖片等靜態資源。

對比 S3，R2 最關鍵的差異是**沒有 egress fee**。S3 每 GB 流量要收費，R2 不收。對圖片多、讀取頻繁的內容網站，這個差異會隨時間累積成很可觀的費用差距。

---

## Session 管理：Cloudflare KV

KV 是 Cloudflare 的分散式 key-value store，讀取延遲極低，適合存需要快速存取的小型資料。

Workers 是無狀態的，每個請求都是獨立的執行環境。需要在請求之間保留狀態（例如 session）時，KV 是最直接的選擇。寫入會在幾秒內同步到全球節點，讀取走最近的快取。

---

## 套件管理：pnpm

用 pnpm 取代 npm，核心差異是 pnpm 用 hardlink 共享套件——所有專案共用同一份套件實體，不會每個專案各自複製一份到 `node_modules`。磁碟用量少很多，安裝速度也更快。

---

## 整體架構

```
Markdown 文章 (.md)
       │
       ├─ build time → Astro SSG → 靜態 HTML
       │
       └─ sync script → Cloudflare D1
                              │
                         Vectorize（embedding）
                              │
                         Workers AI（RAG 問答）

Cloudflare Workers（Edge）
       ├── 靜態資源（文章頁）
       ├── 動態 API（搜尋、問答）
       ├── R2（圖片）
       └── KV（session）
```

這套架構的核心原則是**靜態優先，動態按需**。能在 build time 處理的就提前處理，不依賴 runtime。只有真正需要動態能力的地方才用 Edge Functions。

Cloudflare 全家桶的整合成本很低——所有服務在同一個平台，binding 設定好就能互通，不需要管跨服務的認證和連線。免費方案的額度對個人專案也綽綽有餘。不足的地方是生態比 AWS 或 GCP 小，遇到比較進階的架構問題，文件和社群資源相對有限。
