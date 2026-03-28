---
title: "Docker 實務入門：從開發到部署的容器化"
date: 2026-03-27
category: tech
tags: [docker, container, devops, deployment]
lang: zh-TW
tldr: "Docker 讓你把應用程式和它的環境打包在一起，消除「在我電腦上可以跑」的問題。搭配 multi-stage build 和 Compose，是現代後端部署的基本配備。"
description: "Docker 核心概念、Dockerfile multi-stage build、Docker Compose 的實際用法。以島島（DaoDAO）的部署架構為例，說明 Docker 在真實專案中的角色。"
draft: false
---

Docker 解決一個根本問題：應用程式依賴的環境太多了——Node.js 版本、OS library、環境變數——而 Docker 把這些全部打包進 image，讓每個環境跑的都是同一個東西。

## 核心概念

**Image**：一個唯讀的模板，描述應用程式需要什麼環境和檔案。用 `Dockerfile` 定義。

**Container**：Image 的執行實例。一個 Image 可以同時跑多個 container。

**Dockerfile**：描述如何建立 Image 的指令集，從哪個 base image 開始、安裝什麼、複製什麼檔案、跑什麼指令。

**Registry**：存放 Image 的地方。Docker Hub 是公開的，私有部署通常用 GitHub Container Registry 或 AWS ECR。

## Dockerfile 基礎

一個 Node.js 應用的最簡 Dockerfile：

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000
CMD ["node", "dist/index.js"]
```

這樣寫能跑，但有個問題：最後的 image 包含了所有 `node_modules`，包括開發用的 devDependencies，image 會很大。

## Multi-stage Build

Multi-stage build 讓你在 build 階段安裝所有依賴、編譯，然後只把結果複製到乾淨的 image：

```dockerfile
# ---- Stage 1: Builder ----
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Stage 2: Production ----
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]
```

`--from=builder` 從第一個 stage 複製 `dist/`，production image 只有 runtime 需要的東西，可以比 build image 小一半以上。

## Docker Compose

單個 container 解決不了「多個服務要一起跑」的問題。開發環境通常需要 app + 資料庫 + Redis，這就是 Docker Compose 的用途：

```yaml
# docker-compose.yml
version: "3.9"

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/myapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

`depends_on` 確保 `db` 和 `redis` 先啟動，`api` 才啟動。`volumes` 讓資料在 container 重啟後不會消失。

常用指令：

```bash
# 啟動所有服務（背景執行）
docker compose up -d

# 只啟動某個服務
docker compose up -d db redis

# 查看 log
docker compose logs -f api

# 停止並移除 container
docker compose down

# 重建 image
docker compose build api
```

## DaoDAO 的 Docker 使用方式

島島的後端（`daodao-server`）和 AI 服務（`daodao-ai-backend`）都容器化，部署走 GitHub Actions 觸發 Docker build，然後推到 registry。

他們有一個值得學習的設計：**TypeScript 型別感知的 Docker layer 快取策略**。

一般的 Dockerfile 把 `npm install` 和 `tsc build` 分開成不同 layer，只有 `package.json` 改變才會重跑 install。但在 monorepo 裡，當 `packages/shared` 或 `packages/api` 的型別定義改變，相關 app 的 build 也需要重跑——單靠 `package.json` 的 cache key 不夠。

CI 的解法是：監控型別相關 package 的 hash，有改變時強制讓對應 app 的 Docker layer cache 失效。這確保型別變更不會被舊的 build cache 遮蓋。

```dockerfile
# 分開複製，讓 layer cache 更細粒度
COPY packages/shared/package.json ./packages/shared/
COPY packages/api/package.json ./packages/api/
COPY apps/product/package.json ./apps/product/
RUN pnpm install --frozen-lockfile

# 先 build 共用 packages
COPY packages/ ./packages/
RUN pnpm turbo build --filter=@myproject/shared --filter=@myproject/api

# 再 build app
COPY apps/product/ ./apps/product/
RUN pnpm turbo build --filter=product
```

## 層快取的心法

Docker 的 layer cache 是順序依賴的：某一層失效，後面所有層都要重跑。所以 `COPY` 的順序很重要：

1. 先 `COPY` 變動頻率低的（`package.json`、`package-lock.json`）
2. `RUN npm install`（依賴只在 package 改變時重跑）
3. 再 `COPY` 變動頻率高的（source code）
4. `RUN npm run build`

把 source code 的 `COPY` 放到 `npm install` 之後，每次 build 都只有 `npm run build` 那層重跑，`npm install` 用 cache。

## 什麼時候用 Docker，什麼時候不用

**適合：**
- 後端服務需要特定 Node.js 版本或 OS library
- 部署目標是 VM 或裸機（不是 serverless）
- 開發環境需要一致（尤其有資料庫、Redis 等依賴）

**不一定需要：**
- 部署到 Vercel、Cloudflare Workers 等 serverless 平台（他們有自己的打包機制）
- 只有前端的靜態網站
- 團隊很小、部署頻率低，複雜度帶來的成本高於收益

NobodyClimb 跑在 Cloudflare Workers，完全不需要 Docker——Cloudflare 負責 infra，你只需要上傳 Worker bundle。Docker 是給「你需要管理自己的 server」的情境。

## 取捨

**優點：**
- 環境一致性：開發、CI、production 跑同樣的 image
- 依賴隔離：不同專案不會互相干擾
- 部署可重複性：同一個 image tag 在任何機器跑都一樣

**缺點：**
- 學習曲線：Dockerfile、network、volume 的概念需要時間熟悉
- Image 管理：registry、tag、清理舊 image 需要額外的維護
- 不適合 serverless：Cloudflare Workers、Lambda 有自己的打包方式，Docker 用不上

## 參考資料

- [Docker 官方文件](https://docs.docker.com/)
- [Dockerfile best practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Docker Compose 官方文件](https://docs.docker.com/compose/)
- [島島（DaoDAO）技術架構全覽](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture) — DaoDAO 的 Docker 部署策略與型別感知快取設計
