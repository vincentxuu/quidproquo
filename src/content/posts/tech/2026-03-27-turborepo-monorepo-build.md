---
title: "Turborepo + pnpm workspaces：Monorepo 的標準答案"
date: 2026-03-27
category: tech
tags: [turborepo, monorepo, pnpm, build-system]
lang: zh-TW
tldr: "Turborepo 解決 monorepo 的 build 速度問題，pnpm workspaces 解決依賴共用問題。兩者搭配是目前 JS/TS monorepo 的最佳選擇。"
description: "介紹 Turborepo 和 pnpm workspaces 的核心概念：pipeline 設定、任務快取、build 順序管理。以島島（DaoDAO）和 NobodyClimb 的實際使用方式說明何時值得導入。"
draft: false
---

Monorepo 的問題不是「多個專案放在一起」，而是「多個專案放在一起之後，build 變慢、依賴混亂」。Turborepo 解決 build 效率，pnpm workspaces 解決依賴管理，兩者搭配是目前 JS/TS monorepo 的標準答案。

## 什麼是 pnpm workspaces

pnpm 的 workspaces 功能讓你在一個 repo 裡管理多個 package，共用 node_modules，不需要重複安裝相同的依賴。

在 repo 根目錄放一個 `pnpm-workspace.yaml`：

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

然後 `pnpm install` 一次就能安裝所有 package 的依賴。package 之間互相引用：

```json
// apps/product/package.json
{
  "dependencies": {
    "@myproject/ui": "workspace:*",
    "@myproject/shared": "workspace:*"
  }
}
```

`workspace:*` 表示從 monorepo 本地的 `packages/ui` 和 `packages/shared` 解析，不是從 npm registry。

## 什麼是 Turborepo

Turborepo 是一個 monorepo 的 build 協調工具，做兩件事：

1. **任務依賴管理**：定義哪些任務要先完成，哪些可以平行跑
2. **結果快取**：如果輸入沒有改變，直接用上次的輸出，不重跑

在 `turbo.json` 設定 pipeline：

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "lint": {
      "dependsOn": []
    },
    "type-check": {
      "dependsOn": ["^build"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

`^build` 的 `^` 表示「先跑依賴 package 的 build」。`apps/product` 依賴 `packages/ui`，所以 `packages/ui` 的 build 必須先完成，`apps/product` 的 build 才能開始。

## 快取機制

Turborepo 的快取用輸入的 hash 作為 key：

- 輸入：source files、環境變數、`turbo.json` 設定
- 輸出：build artifacts（`.next/`、`dist/`）

第一次 build：

```
$ pnpm turbo build
• Packages in scope: website, product, ui, shared
• Running build in 4 packages
Tasks:    4 successful, 4 total
Cached:   0 cached, 4 total
Time:     45.2s
```

第二次（沒改任何檔案）：

```
$ pnpm turbo build
Tasks:    4 successful, 4 total
Cached:   4 cached, 4 total
Time:     312ms
```

45 秒變 312ms，因為全部都是 cache hit。在 CI 上，可以設定 Remote Cache（Turborepo 的雲端快取或自架），讓不同機器共享 build cache。

## 在 DaoDAO 和 NobodyClimb 的用法

兩個專案的 monorepo 結構相似：

**DaoDAO：**
```
apps/
  website/     # 行銷頁（Next.js）
  product/     # 主應用（Next.js）
  mobile/      # Expo / React Native
packages/
  shared/      # 共用型別、utils
  ui/          # shadcn/ui 元件庫
  i18n/        # 多語言
  api/         # OpenAPI client
```

**NobodyClimb：**
```
apps/
  web/         # Next.js 15
  mobile/      # React Native + Expo
packages/
  schemas/     # Zod schema（前後端共用）
  api-client/  # API client
```

共同點是 `packages/` 的東西必須先 build，`apps/` 才能 build。Turborepo 的 `^build` 自動處理這個順序，不需要手動協調。

NobodyClimb 還把 Hono 後端放在 `backend/`，同樣透過 pnpm workspaces 管理，型別從 `packages/schemas` 共用——前端送出的 request body 和後端驗證的 schema 是同一份 Zod 定義，不會出現前後端型別不一致的問題。

## 常用指令

```bash
# 對所有 package 跑 build
pnpm turbo build

# 只跑特定 app
pnpm turbo build --filter=product

# 只跑受影響的 package（比對 main branch）
pnpm turbo build --filter=...[main]

# 開發模式，同時啟動所有 app
pnpm turbo dev

# 在特定 workspace 跑指令
pnpm --filter product add react-query
```

`--filter` 是 monorepo 裡最常用的 flag，讓你只對需要的 package 執行任務。

## 什麼時候值得導入

Monorepo 不是默認選項，適合的情境：

- **多個 app 共享程式碼**：UI 元件庫、型別定義、utils、API client
- **前後端要共用型別**：Zod schema 同時當 request/response 的驗證和型別來源
- **需要統一 lint / type-check / test pipeline**：一個指令跑整個 repo

不適合的情境：

- 只有一個 app，沒有實際共享需求
- 團隊不熟悉 workspace 的 link 機制，debug 成本高
- 有大量不同技術棧的專案混在一起（比如同時有 Python 和 JS）

## 取捨

**優點：**
- 共用程式碼變簡單，型別安全可以跨 package
- Build 快取顯著減少 CI 時間
- 統一工具鏈（lint、format、type-check）

**缺點：**
- 初始設定有學習成本，workspace link 的 resolution 有時候 debug 不直覺
- Remote Cache 需要額外設定（Vercel 提供的是商業服務）
- 大型 monorepo 的 `pnpm install` 仍然不快

對像 DaoDAO 和 NobodyClimb 這樣的多 app 專案，Turborepo + pnpm workspaces 是值得的投資，開發體驗比多個獨立 repo 好很多。

## 參考資料

- [Turborepo 官方文件](https://turbo.build/repo/docs)
- [pnpm workspaces 官方文件](https://pnpm.io/workspaces)
- [Turborepo Pipeline 設定](https://turbo.build/repo/docs/crafting-your-repository/configuring-tasks)
- [島島（DaoDAO）技術架構全覽](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture) — DaoDAO 的 monorepo 結構與 Turborepo 使用方式
- [NobodyClimb：用 Cloudflare 全端打造攀岩社群平台](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture) — NobodyClimb 的 monorepo 結構與共用 schema 設計
