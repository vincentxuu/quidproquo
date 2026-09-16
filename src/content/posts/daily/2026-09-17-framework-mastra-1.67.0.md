---
title: "框架更新｜Mastra @mastra/core@1.67.0"
date: 2026-09-17
category: daily
type: digest
tags: [ai-agent, framework, daily, mastra]
lang: zh-TW
description: "Mastra 1.67 把 workflow 產生本身變成一個 agent 能力，新增平台整合轉 agent 工具的 @mastra/connect，並支援 thread 所有權轉移與更細的背景任務執行控制"
tldr: "Mastra @mastra/core@1.67.0 四個重點：(1) Studio Workflow Builder backend 讓一個編輯器專屬 agent 能直接產生並持久化 workflow 定義，開發者用自然語言描述、agent 寫出真正可執行的 workflow；(2) 新套件 `@mastra/connect` 把 Mastra Platform 的第三方整合連線包裝成 agent tools，憑證由平台代理注入，agent 程式碼完全碰不到 secret；(3) `Memory.updateThreadResourceId()` 支援把一個 thread 轉移給新的 `resourceId`，在主要 SQL adapter 上都是交易化實作；(4) breaking：`subscribeQueuedMessages` 改名為 `subscribeThreadEvents`，`ArchilFilesystem.grep()` 改名為 `diskGrep()`。"
series:
  name: "AI Framework Changelog"
  order: 21
---

> 🌏 [English version](/en/posts/daily/2026-09-17-framework-mastra-1.67.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Mastra |
| 版本 | `@mastra/core@1.67.0` |
| 前一版 | `@mastra/core@1.66.0` |
| 發布日 | 2026-09-15 |
| Release Notes | [GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.67.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 28k |

## 這個版本為什麼重要

[上一篇（1.65.0）](/posts/daily/2026-09-10-framework-mastra-1.65.0)處理的是 trace 資料要能查、能刪、守 tenant 邊界；1.67 往前跨了一步，開始把「產生 workflow」與「串接第三方服務」這兩件過去要靠人手動做的事，變成 agent 自己能做的能力。Studio Workflow Builder backend 讓一個編輯器專屬的隱藏 agent 直接讀寫持久化的 workflow 定義——開發者用自然語言描述想要的流程，agent 產生真正可以跑的 workflow，不只是產生程式碼片段。`@mastra/connect` 則解決了「agent 要串第三方 API 就得自己管一堆 API key」的老問題：把 Mastra Platform 已經連好的整合連線包裝成 agent tools，憑證由平台的連線代理注入並自動 refresh，agent 的程式碼全程碰不到 secret 本身。加上 thread 所有權轉移、更細緻的背景任務執行控制，這版是把「多 agent／多 thread 協作」的基礎設施往前補了一大塊。

## 重要變更

- **Studio Workflow Builder backend（`workflowBuilder` 選項）**：`MastraEditor` 加上 `workflowBuilder` 設定後，會啟用一個隱藏、編輯器專屬的 agent 來產生並持久化 workflow 定義，新增 `GET /editor/workflow-builder/settings` 與 `POST /editor/workflow-builder/stream` 兩個 server endpoint，由 `stored-workflows:read`／`stored-workflows:write` 權限把關 → 開發者用自然語言描述流程需求，agent 直接產出可執行、可儲存的 workflow，不用再手刻節點與邊
- **`@mastra/connect`：平台整合連線變成 agent tools**：把 Mastra Platform 上已建立的第三方整合連線包裝成 agent 可呼叫的 tool，憑證由平台連線代理注入並自動 token refresh，支援連線的即時發現／刷新，也能用 `integrations` 白名單限制可用範圍 → agent 程式碼完全不需要碰觸 API key 或 OAuth token，串第三方服務不再是「先申請憑證、寫進環境變數」的手動流程
- **Thread Ownership Transfer**：新增 `Memory.updateThreadResourceId({ threadId, resourceId })`，搭配新 server route `POST /memory/threads/:threadId/transfer` 與 `client-js` 的 `MemoryThread.transfer()`，在主要 SQL adapter 上都是交易化／序列化實作（開啟 semantic recall 時連向量資料一起搬） → 使用者身分合併、多租戶帳號轉移這類場景，thread 歷史不用整批匯出再匯入，一個 API 呼叫就能安全轉移
- **更細緻的背景任務執行控制**：tool 現在支援逐次呼叫指定執行方式（`foreground`／`deferred`／`awaited`），`awaited` 用持久化背景執行但仍讓目前分支等到最終結果，並新增 `createBackgroundWorkSignalProcessor()` 讓呼叫端拿到範圍內的完成訊號 → 長時間任務（例如「幫我研究一個主題」）可以背景跑但呼叫端仍能同步等到權威結果，不用自己另外做輪詢
- **Workspace／Sandbox 大量檔案上傳與效能**：`WorkspaceSandbox.writeFiles` 支援逐檔 POSIX `mode` 與 `abortSignal` 取消，`DockerSandbox` 支援批次上傳與更完整的 Docker `mounts`（含 volume subpath），`grep`／`list_files` 可以用 provider 原生的 `walk()`／`grep()` 加速 → 遠端檔案系統操作不用再逐檔案來回一次 round trip

## Breaking Changes

- `subscribeQueuedMessages({ resourceId, threadId }, listener)` → `subscribeThreadEvents({ resourceId, threadId }, listener)`，listener 現在收到的是型別化事件（例如 `queue-count-changed`）而不是原本的訊息格式
  - 影響範圍：直接訂閱 queued messages 的整合程式碼
- `@mastra/archil`：`ArchilFilesystem.grep()` 改名為 `diskGrep()`
  - 影響範圍：直接呼叫 `ArchilFilesystem.grep()` 的程式碼

## 遷移指南

### 從 1.66.x 升級到 1.67.0

```bash
pnpm add @mastra/core@1.67.0
```

```ts
// 舊寫法（1.66.x 及之前）
mastra.subscribeQueuedMessages({ resourceId, threadId }, (message) => {
  console.log(message);
});

// 新寫法（1.67.0）
mastra.subscribeThreadEvents({ resourceId, threadId }, (event) => {
  if (event.tagName === 'queue-count-changed') {
    console.log(event.data);
  }
});
```

```ts
// 舊寫法（@mastra/archil，1.66.x 及之前）
await archilFilesystem.grep(pattern);

// 新寫法（1.67.0）
await archilFilesystem.diskGrep(pattern);
```

沒有用到 `subscribeQueuedMessages` 或 `@mastra/archil` 的專案，這版沒有 breaking change，直接升級即可。

## 與其他框架的對比觀察

`@mastra/connect` 把「串第三方服務」從開發者自己管憑證，變成平台代理注入、agent 完全碰不到 secret 的模式，這跟 Composio 主打的「200+ 整合聚合」思路接近，但 Mastra 把它做成框架原生能力而不是外部工具聚合層。Studio Workflow Builder 則是把 agent 的能力邊界又往「自己產生可執行流程」推了一步，跟 LangGraph／CrewAI 目前仍聚焦在「執行既有 graph／crew」的定位不同——Mastra 持續往「平台」而非單純「函式庫」的方向靠攏。

## 今日收穫

之前以為「agent 串第三方 API」的標準做法就是把 API key 放進環境變數再傳給 tool，看到 `@mastra/connect` 把憑證整段交給平台連線代理、agent 程式碼全程碰不到 secret 本身才意識到：憑證外洩的風險不只來自「有沒有加密儲存」，更常來自「agent 的執行環境本身有沒有機會接觸到明文憑證」——把憑證從 agent 的可視範圍徹底移除，比事後做稽核更根本。

## 參考資料

- [Mastra @mastra/core@1.67.0 — GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.67.0)
- [mastra-ai/mastra — GitHub](https://github.com/mastra-ai/mastra)
- [Mastra @mastra/core@1.65.0 — 上一篇框架更新](/posts/daily/2026-09-10-framework-mastra-1.65.0)
- [PR #23493：Studio Workflow Builder backend](https://github.com/mastra-ai/mastra/pull/23493)
- [PR #23026：per-call background execution dispositions](https://github.com/mastra-ai/mastra/pull/23026)
- [PR #21986：experimental cross-agent communication tools](https://github.com/mastra-ai/mastra/pull/21986)
- [PR #23554：hideSignals for live streams and memory recall](https://github.com/mastra-ai/mastra/pull/23554)
