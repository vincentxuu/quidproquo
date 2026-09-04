---
title: "框架更新｜Mastra @mastra/core@1.64.0"
date: 2026-09-05
category: daily
type: digest
tags: [ai-agent, framework, daily, mastra]
lang: zh-TW
description: "Mastra 1.64 把 sandbox 從『每次冷開機』變成『可重用範本＋預熱 checkout』，統一了跨 provider 的工作目錄行為，也帶了兩個 breaking changes"
tldr: "Mastra @mastra/core@1.64.0 三個重點：(1) 新的 reusable sandbox template（`@mastra/platform-workspace`＋`@mastra/e2b`）讓 sandbox 從預先複製、預先建置好的 repo image 啟動，大幅降低 code session／workspace agent 的冷啟動時間；(2) `MastraSandboxOptions.workingDirectory` 統一了 Docker／E2B／Vercel／Railway 等所有 sandbox provider 的預設工作目錄行為；(3) breaking：`@mastra/factory` 的 `sandbox` 設定從物件改成 callback，`@mastra/playground-ui` 拿掉 `Chip`／`ChipsGroup`／`StatusBadge`，改用 `Badge`。"
series:
  name: "AI Framework Changelog"
  order: 14
---

> 🌏 [English version](/en/posts/daily/2026-09-05-framework-mastra-1.64.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Mastra |
| 版本 | `@mastra/core@1.64.0` |
| 前一版 | `@mastra/core@1.63.0` |
| 發布日 | 2026-09-04 |
| Release Notes | [GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.64.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 27.7k |

## 這個版本為什麼重要

[上一篇（1.63.0）](/posts/daily/2026-08-29-framework-mastra-1.63.0)修的是 trace 和原生 log 對不齊的問題，這次 1.64 處理的是另一個生產環境的常見痛點：**agent 跑 sandbox 的冷啟動有多貴**。過去不管是 code session 還是 workspace-backed agent，每次啟動 sandbox 都要重新 clone、重新建置一次 repo，等待時間直接算進使用者體感延遲裡。1.64 引入 reusable sandbox template，讓 sandbox 可以從一份「已經 clone 好、已經 build 好」的 repository image 啟動，範本可以背景重建、依需求調整資源大小——本質上是把「每次都重新蓋房子」換成「先蓋好樣品屋，直接搬進去住」。同一版還把 `workingDirectory` 這個原本各家 sandbox provider（Docker、E2B、Vercel、Railway……）各自定義的行為收斂成一個統一選項，減少跨 provider 遷移時要重新確認「預設目錄到底是哪裡」的心智負擔。

## 重要變更

- **Reusable Sandbox Templates + Warm Repo Checkouts（E2B & Platform）**：`@mastra/platform-workspace` 新增可重用範本 API，`@mastra/e2b` 提供 repo template，讓 sandbox 從預先複製、預先建置好的 repository image 啟動（支援背景重建與資源調整）→ code session 和 workspace-backed agent 的冷啟動時間大幅縮短
- **統一 `workingDirectory`**：`MastraSandboxOptions` 新增 `workingDirectory` 選項，所有 sandbox provider 一致遵守（並提供 `sandbox.workingDirectory` getter），單一指令仍可用 `cwd` 覆蓋 → Docker／E2B／Vercel／Railway 等 provider 的預設 CWD 行為終於一致，`workingDir`（docker／apple-container）與 `workdir`（modal）維持為指向同一欄位的相容別名
- **Client-Side Tools 支援 server 定義的 `toModelOutput`**：沒有 `execute` 的瀏覽器端工具，現在也能套用 server 端定義的 `toModelOutput`，把回傳的精簡 payload（例如 `{ fileId, dataUrl }`）轉成模型看得懂的內容（如 image content part）→ 不用再自己寫 input processor 做這層轉換，行為對齊 AI SDK
- **Observability Feedback Review Workflow**：feedback 記錄新增 `reviewStatus`（`needs-review`／`reviewed`），`listFeedback` 可以依此過濾，新增 `updateFeedbackReviewStatus` storage 方法與 `PATCH /api/observability/feedback/:feedbackId/review-status` endpoint（`@mastra/client-js` 已加入對應方法）→ 可以把「使用者回饋」納入正式的審核流程，而不是散落在 log 裡
- **`@mastra/evals/vitest` 測試整合**：`runEvals` 可以直接當 Vitest 測試跑，搭配 `expectEvals`／`expectEval` 與自訂 matcher，reporter 會印出逐測試分數 → eval 可以直接接進 CI 當作 gate，不用另外寫一套跑分腳本

## Breaking Changes

- `@mastra/factory` 的 `sandbox` 設定從物件改成 callback：
  - `{ sandbox: { provider: 'e2b', ... } }` → `{ sandbox: ctx => new E2BSandbox({ id: ctx.sessionId }) }`
  - 同時移除 `workdir`／`maxSandboxes` 與舊的 sandbox fleet／reattach 模型
  - 影響範圍：所有透過 `@mastra/factory` 設定 sandbox 的專案，需要把設定物件改寫成 callback
- `@mastra/playground-ui` 拿掉 `Chip`、`ChipsGroup`、`StatusBadge`，統一改用單一 `Badge` 元件（`<span>`，prop typing 有更新）：
  - 影響範圍：直接嵌入這幾個元件的自訂 playground UI

## 遷移指南

### 從 1.63.x 升級到 1.64.0

```bash
pnpm add @mastra/core@1.64.0
```

```ts
// @mastra/factory 的 sandbox 設定
// 舊寫法（1.63.x 及之前）
const factory = createFactory({
  sandbox: { provider: 'e2b', workdir: '/home/user', maxSandboxes: 10 },
});

// 新寫法（1.64.0）
const factory = createFactory({
  sandbox: ctx => new E2BSandbox({ id: ctx.sessionId, workingDirectory: '/home/user' }),
});
```

```tsx
// @mastra/playground-ui 的 MonoCell / Chip 系列元件
// 舊寫法（1.63.x 及之前）
<Chip>{label}</Chip>

// 新寫法（1.64.0）
<Badge>{label}</Badge>
```

只呼叫 `@mastra/core` API、沒有直接設定 `@mastra/factory` sandbox 或嵌入 `@mastra/playground-ui` 元件的專案，這版沒有 breaking change，直接升級即可。

## 與其他框架的對比觀察

Mastra 這幾版的節奏很清楚：1.63 補的是 observability（trace 對不上 log），1.64 補的是 execution infra（sandbox 冷啟動、跨 provider 一致性）——兩者都不是「新增 agent 能力」，而是把「把 agent 跑到生產環境」這條路上的既有摩擦一個一個磨平。這和 CrewAI、Agno 目前的重心（role-based API、Knowledge／RAG 資料完整性）方向不同：Mastra 作為目前 TypeScript 生態唯一首選，更早也更重地把「sandbox 是 agent 執行環境的一等公民」這件事做進框架核心，直接對照 E2B、Daytona 這類獨立 sandbox 服務，而不是把 sandbox 留給使用者自己接。

## 今日收穫

之前以為 sandbox 範本化只是「把 Docker image 建好放著」這種基礎設施細節，跟框架本身的設計關係不大。看到 Mastra 把「warm repo checkout」和「背景重建範本」直接做成 `@mastra/platform-workspace` 的一級 API 才意識到：對長跑、高頻建立 sandbox 的 agent 工作流來說，冷啟動時間本身就是使用者體感延遲的主要來源之一，範本化不是錦上添花，而是讓「每個 agent session 都跑在乾淨 sandbox 裡」這個安全模式在生產環境裡站得住腳的前提條件。

## 參考資料

- [Mastra @mastra/core@1.64.0 — GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.64.0)
- [mastra-ai/mastra — GitHub](https://github.com/mastra-ai/mastra)
- [Mastra @mastra/core@1.63.0 — 上一篇框架更新](/posts/daily/2026-08-29-framework-mastra-1.63.0)
