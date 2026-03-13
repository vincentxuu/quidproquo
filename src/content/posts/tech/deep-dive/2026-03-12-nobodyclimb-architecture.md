---
title: "NobodyClimb：用 Cloudflare 全端打造攀岩社群平台"
date: 2026-03-12
category: tech
tags: [cloudflare-workers, nextjs, hono, rag, react-native, monorepo]
lang: zh-TW
tldr: "一個攀岩社群平台，從 Web、Mobile 到 AI 問答全部跑在 Cloudflare 上，沒有獨立伺服器。"
description: "NobodyClimb 的技術架構解析：Next.js 15 + Hono + D1 + RAG，為什麼選 Cloudflare-first，以及 AI 問答系統怎麼設計。"
draft: false
type: deep-dive
---

NobodyClimb 是一個給攀岩者用的社群平台，讓大家記錄攀登紀錄、寫故事、分享一句話心得，也可以問 AI 攀岩相關的問題。整個系統從前端、後端到 AI，全部跑在 Cloudflare 的基礎設施上，沒有 EC2、沒有 RDS，也沒有獨立的 AI 推論伺服器。這篇記錄一下架構選擇背後的邏輯。

## 為什麼選 Cloudflare-first

最直接的原因：攀岩社群的流量不是電商，沒有大量的尖峰流量需要彈性擴容，但也沒有預算養一台長期開著的 server。Cloudflare Workers 的計費方式剛好適合這種「平常沒什麼人，偶爾有人進來逛逛」的使用情境——按請求計費，冷啟動在全球邊緣節點完成，台灣使用者延遲低。

選定 Cloudflare 之後，周邊的選擇就很自然地跟著走：
- **D1**（SQLite）：關聯式資料庫，跑在 Workers 旁邊，不需要連回另一個 region
- **R2**：存圖片、影片縮圖，S3 相容 API
- **KV**：快取、影片資料暫存
- **AI**：Cloudflare Workers AI，embedding 和 LLM 直接在同一個平台跑

不是說這套沒有缺點——D1 不適合高寫入、KV 是最終一致性、Workers AI 的模型選擇比不上獨立部署——但對這個專案的規模來說，tradeoff 是值得的。

## 架構概覽

```
nobodyclimb/
├── apps/web/          # Next.js 15 + React 19（Cloudflare Workers）
├── apps/mobile/       # React Native + Expo + Tamagui
├── backend/           # Hono API（Cloudflare Workers）
└── packages/          # 共用 types、schemas、hooks、utils
```

Monorepo 用 **pnpm workspaces + Turborepo** 管理，前後端共用同一套 Zod schema，型別從 `packages/schemas` 出來，API client 在 `packages/api-client`，不會出現前後端型別各寫一份的問題。

## Web 前端：Next.js 15 on Cloudflare

Next.js 15（App Router）+ React 19，透過 `@opennextjs/cloudflare` adapter 部署到 Cloudflare Workers。這個 adapter 把 Next.js 的 SSR 和靜態資源拆開，動態路由走 Worker，靜態資源走 Cloudflare Assets，延遲表現不錯。

狀態管理分兩層：
- **Zustand**：全域 client state（auth、UI 狀態、使用者資訊）
- **TanStack Query**：server state，處理 fetching、caching、背景更新

表單用 React Hook Form + Zod，Zod schema 直接從 `packages/schemas` 拉，不另外寫 validation 邏輯。

## 後端：Hono

Hono 是輕量 Web framework，設計給 edge runtime。跟 Express 相比，bundle size 小很多，也支援 Cloudflare Workers 的原生 API（`ctx.waitUntil()`、`env.DB`、`env.KV`）。

後端架構分三層：
```
routes → services → repositories
```

Routes 負責 OpenAPI 文件（用 `hono-openapi` 自動生成）和 request validation，services 放業務邏輯，repositories 做 D1 查詢。OpenAPI JSON 在 `/api/v1/openapi.json`，Scalar UI 在 `/api/v1/docs`。

## Mobile：React Native + Tamagui

Mobile 用 Expo 54 + React Native 0.81，導航走 Expo Router（file-based routing，跟 Next.js App Router 概念相同）。UI 用 Tamagui，跨 iOS/Android 的 style system，支援 theme token，不用針對平台個別寫樣式。

共用邏輯透過 `packages/` 拿，Mobile 和 Web 共用同一套 API client 和 Zustand hooks。

## AI 問答系統（RAG）

這是整個專案花最多時間設計的部分。使用者可以用自然語言問攀岩相關的問題，系統會從社群資料和攀登知識庫裡找答案。

### 模型選擇

全部跑在 Cloudflare Workers AI：
- **Embedding**：`@cf/baai/bge-m3`，1024 維，多語言，繁體中文效果好
- **LLM**：`@cf/google/gemma-3-12b-it`

不選 OpenAI 或其他外部 API 的原因：成本可預測，不需要管 API key 的 rate limit，延遲低（同一個平台）。

### Pipeline 設計

```
使用者問題
  ↓
QueryClassifier（分類：一般知識 / 社群資料 / SQL 查詢）
  ↓
Retriever（向量搜尋 + 關鍵字過濾）
  ↓
CorrectiveRAG（評估檢索品質，決定要不要補充搜尋）
  ↓
Generator（LLM 生成回答）
  ↓
LLM Judge（品質評估）
```

Query 端有三個 NLP 過濾器：`extractLocationFilter`（地點）、`extractGradeFilter`（難度）、`extractTypeFilter`（路線類型），在向量搜尋之前先縮小範圍。

### 串流回應

支援 SSE（Server-Sent Events）：`POST /api/v1/ai/ask?stream=true`，事件格式：

```
event: token
data: {"text": "..."}

event: done
data: {"usage": {...}}

event: error
data: {"message": "..."}
```

### 配額系統

每個使用者有每日 AI 問答次數和 token 用量限制，根據 **Climber Rank** 決定：

| 等級 | 門檻（積分） | 每日次數 | 每日 token |
|------|------------|---------|-----------|
| 麓（foothill） | 0 | 2 | 5,000 |
| 壁（wall） | 20 | 6 | 15,000 |
| 稜（ridge） | 70 | 12 | 30,000 |
| 巔（summit） | 100 | 24 | 60,000 |

積分從使用者的個人資料完整度、公開的故事和攀登紀錄累積而來——填得越多、分享得越多，AI 配額越高。這個設計讓社群活躍度和 AI 使用權互相連結。

配額扣除用原子 SQL UPDATE（雙條件），避免 race condition。斷線時退還配額，LLM 完成後做 token 差額校正。

## 整體來說

這套架構的核心取捨是：**用 Cloudflare 的生態系換掉所有的 infra 管理成本**。D1 不是最強的資料庫，Workers AI 不是最豐富的 AI 平台，但對一個 side project 來說，不需要管 VPC、不需要設 auto-scaling、不需要監控 server uptime，這個換法是值得的。

適合類似規模的專案：有一定的複雜度（monorepo、多平台、AI 功能），但還沒到需要獨立 infra 的量。如果 DAU 到了幾萬、寫入量變大，D1 和 Workers 的限制就會開始痛，那時候才是考慮換架構的時間點。
