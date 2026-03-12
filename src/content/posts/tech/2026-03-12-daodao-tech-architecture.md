---
title: "島島（DaoDAO）技術架構全覽：Monorepo、多語言後端與 AI 推薦系統"
date: 2026-03-12
category: tech
tags: [turborepo, nextjs, fastapi, postgresql, qdrant, monorepo, typescript]
lang: zh-TW
tldr: "Next.js + Expo 前端、Node.js + Python 雙後端、三資料庫架構，加上 LLM 推薦引擎，島島如何用現代技術棧打造學習平台。"
description: "深入介紹島島（DaoDAO）學習平台的技術架構：Turborepo monorepo、Node.js TypeScript 後端、Python FastAPI AI 服務，以及 PostgreSQL + MongoDB + Redis + Qdrant 的多資料庫策略。"
draft: false
---

島島（DaoDAO）是一個學習平台，讓使用者設定目標、追蹤每日實踐、建立學習社群。它的技術架構比大多數同規模的產品複雜：前端是 Turborepo monorepo 管三個 app，後端拆成 Node.js 和 Python 兩個服務，資料庫用了四種。這篇拆解各層的設計邏輯，以及這些選擇背後的取捨。

## Monorepo 架構設計

前端用 **Turborepo** 管理整個 monorepo，底層是 pnpm workspaces。

```
daodao-f2e/
├── apps/
│   ├── website/        # Next.js，port 3000（行銷 / 落地頁）
│   ├── product/        # Next.js，port 3001（主應用）
│   └── mobile/         # Expo / React Native
└── packages/
    ├── shared/         # 共用型別、utils
    ├── ui/             # shadcn/ui 元件庫
    ├── i18n/           # 多語言
    ├── api/            # OpenAPI client（自動生成）
    └── features/quiz/  # 測驗功能模組
```

`website` 和 `product` 分開是很常見的決策：行銷頁和應用程式的 deploy 頻率、快取策略、SEO 需求都不同，分開可以獨立優化，但共用 `packages/ui` 保持視覺一致。

Turborepo 的 `pipeline` 設定讓 `build`、`lint`、`type-check` 可以平行執行，只有真正有相依關係的 task 才會等待——`product` 的 build 不需要等 `website` 跑完，但都需要等 `packages/` 先 build。

## 前端技術選型

三個 app 的技術底層：

- **website / product**：Next.js 15 App Router + React 19，TypeScript 5.7+
- **mobile**：Expo + React Native（跨 iOS / Android）
- **UI**：shadcn/ui + TailwindCSS，元件放在 `packages/ui`，所有 app 共用
- **Linter / Formatter**：**Biome**，取代 ESLint + Prettier

Biome 這個選擇值得特別說一下。它用 Rust 寫的，lint + format 合一，速度比 ESLint + Prettier 的組合快 10-20 倍，設定也簡單很多。對 monorepo 來說，加速效果更明顯——原本三個 app 分別跑 ESLint 的時間可以減少到一個 Biome pass 完成。缺點是部分 ESLint plugin 生態還沒有對應的 Biome rule，但對多數專案來說這不是問題。

Next.js 15 + React 19 的組合帶來 Server Components 和 `use cache` directive，可以細粒度控制哪些資料在伺服器端快取、哪些需要 client-side fetch，比 Next.js 13/14 的 `fetch` cache 選項更直覺。

## 後端架構分層

Node.js 後端（`daodao-server`）用 Express.js + TypeScript，分層清楚：

```
routes → controllers → services → repositories（Prisma / Mongoose）
                ↕
           middleware（auth、rate limit、validation）
```

每一層職責分明：routes 只管路徑對應和 middleware 掛載，controllers 處理 HTTP request/response，services 放業務邏輯（不知道 HTTP 存在），repositories 負責資料庫操作。

所有 API 回應遵循統一格式：

```typescript
{
  success: boolean,
  data: T | null,
  timestamp: string,
  meta?: { page?: number, total?: number, ... }
}
```

這讓前端的 API client 可以統一處理錯誤，不需要每個 endpoint 各自判斷回應結構。

身份驗證走 **JWT + Passport.js**，支援 Google OAuth。設計上有一個細節：所有對外暴露的 ID 都使用 **External UUID**（而不是資料庫的自增 ID），防止攻擊者透過猜測 ID 枚舉資源——`/api/posts/1`、`/api/posts/2` 這種 URL 是資安漏洞，UUID 格式的 ID 讓猜測變得不可行。

資料驗證全面使用 **Zod**，schema 在 service 層定義，同時作為 TypeScript 型別來源和 runtime validation——型別推斷和驗證邏輯不需要寫兩份。

## 多資料庫策略

這是架構裡最有趣的部分。島島同時跑 PostgreSQL、MongoDB、Redis 三種資料庫，各有明確職責：

**PostgreSQL（主資料庫，透過 Prisma ORM）**
用於有明確關聯關係的結構化資料：使用者、目標、實踐記錄、社群關係。Prisma 提供型別安全的查詢，schema migration 有版本管理，適合需要 ACID 保證的操作。

**MongoDB（文件型資料）**
用於結構彈性的內容，例如貼文、留言、學習筆記。這類資料的 schema 變動頻繁，文件模型比關聯式更自然——一篇貼文可能有不同的 metadata 欄位，不需要每次改 schema 就跑 migration。

**Redis（快取 + 任務隊列）**
做兩件事：一是 API 回應快取和 session 儲存，降低資料庫查詢壓力；二是 **BullMQ** 的底層 broker。BullMQ 是 Redis-based 的任務隊列，島島用它處理需要非同步執行的工作，例如每小時排程檢查到期實踐並自動標記完成。

這三層的組合讓每種資料都放在最適合它的儲存引擎，而不是強迫所有資料塞進同一個資料庫。代價是運維複雜度——需要同時管三個服務的連線、備份和監控。

## AI 後端

AI 服務獨立成 Python FastAPI 應用（`daodao-ai-backend`），與 Node.js 後端分開部署。這個決策很合理：Python 在 ML 生態的工具鏈遠優於 Node.js，獨立服務也讓 AI 功能可以單獨 scale。

架構：

- **LLM 整合**：推薦引擎，根據使用者的學習歷程和目標，推薦相關學習資源或社群成員
- **Qdrant**：向量資料庫，儲存學習內容的 embedding，支援語意搜尋——不是關鍵字搜尋「TypeScript 教學」，而是找到「跟你的學習目標語意相近的內容」
- **ClickHouse**：分析資料庫，記錄使用行為事件（頁面瀏覽、互動、學習進度），供推薦引擎的特徵工程使用
- **Redis**：LLM 回應和搜尋結果快取，避免重複推論相同的 query

Node.js 後端透過 HTTP 呼叫 FastAPI 服務，兩邊各自維護自己的資料來源。

## CI/CD 亮點

部署用 Docker + PM2 + GitHub Actions，有一個值得特別提的設計：**TypeScript 類型感知的 Docker 層快取策略**。

一般的 Dockerfile 把 `npm install` 和 `tsc build` 放在不同 layer，只有 `package.json` 改變才會重跑 install。但島島的 CI 還額外監控 TypeScript 型別變更：當 `packages/shared` 或 `packages/api` 的型別定義有異動時，自動觸發相關 app 的 Docker layer 重建，確保型別變更不會被舊的 build cache 遮蓋。

部署完成後透過 Webhook 送 Discord 通知，包含哪個服務部署了什麼版本、build 時間、測試結果。對小團隊來說，Discord 通知比 Slack 設置成本低，也足夠用。

## 整體架構

```
瀏覽器 / Mobile App
        │
        ├── website (Next.js :3000)
        └── product (Next.js :3001)
                │
                ▼
        daodao-server (Node.js / Express)
         │         │         │
         ▼         ▼         ▼
    PostgreSQL  MongoDB    Redis
    (Prisma)              │    │
                       BullMQ Cache
                          │
                          ▼
                  Scheduled Jobs
                  （到期實踐自動完成）

        daodao-server ──HTTP──▶ daodao-ai-backend
                                (Python FastAPI)
                                 │       │      │
                                 ▼       ▼      ▼
                              Qdrant  ClickHouse Redis
                           （語意搜尋）（分析）  （快取）
```

GitHub Actions 管 CI/CD，Discord 收通知。前端 monorepo 透過 Turborepo pipeline 管 build 相依順序。

## 整體來說

島島這套架構的核心取捨是：**用較高的技術複雜度換取每一層的最佳化空間**。四種資料庫、兩個後端服務、三個前端 app——對小團隊來說，這是有代價的選擇。

合理的前提是：
1. 團隊對這些技術都有足夠熟悉度，維護成本可控
2. 各資料庫的職責分界清楚，不會出現「這筆資料到底放哪」的混亂
3. AI 功能是核心差異點，值得獨立投資

如果是從零開始的早期 MVP，這套架構可能過重——PostgreSQL 單一資料庫加上簡單的 Node.js API 通常可以撐到相當規模。但對一個已經明確需要語意搜尋、行為分析和多平台支援的學習平台，這個架構選擇是合理的。

Turborepo + Biome 的開發體驗確實好——lint 快、型別共用方便、多 app 的 build pipeline 清楚。這個部分是值得借鑑的，無論後端架構怎麼選。
