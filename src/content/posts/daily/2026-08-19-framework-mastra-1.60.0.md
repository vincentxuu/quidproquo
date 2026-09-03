---
title: "框架更新｜Mastra @mastra/core 1.60.0"
date: 2026-08-19
category: daily
type: digest
tags: [ai-agent, framework, daily, mastra]
lang: zh-TW
description: "Mastra 1.60.0 讓已儲存的 Agent 可以直接以 durable: true 跑持久化執行，再加上 Cloudflare Sandbox provider 與 MCP 2026-07-28 協定支援，是把 Mastra 往「免部署也能長跑」推進的一版"
tldr: "Mastra 1.60.0 三個重點：(1) Stored Agent 新增 durable: true，不用重新部署就能跑持久化執行，並繼承伺服器的 cache/pubsub 支援多副本；(2) 新增 @mastra/cloudflare-sandbox provider，透過部署好的 Sandbox Bridge Worker 執行指令與檔案操作；(3) @mastra/mcp 支援 stateless 的 2026-07-28 MCP 協定修訂版與多輪 elicitation，本版無 breaking changes。"
series:
  name: "AI Framework Changelog"
  order: 3
---

> 🌏 [English version](/en/posts/daily/2026-08-19-framework-mastra-1.60.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Mastra |
| 版本 | @mastra/core@1.60.0 |
| 前一版 | @mastra/core@1.59.0 |
| 發布日 | 2026-08-19 |
| Release Notes | [GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.60.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 27.3k |

## 這個版本為什麼重要

這版把「Stored Agent（已儲存但未部署的 Agent 定義）」和「持久化執行」正式接起來。以前要讓 Agent 具備跨重啟、跨副本恢復的持久化執行能力，通常代表要走完整部署流程；1.60.0 讓 Stored Agent 只要加上 `durable: true`，就能繼承伺服器既有的 cache 和 pubsub 拿到多副本持久化，等於把「先建原型、後決定要不要上生產等級持久化」這條路徑打通，不用重新部署就能切換。同一版還補齊了兩塊基礎設施：Cloudflare Sandbox 讓 workspace 執行不再侷限於 Local/Docker，MCP 協定升級到 `2026-07-28` 修訂版則讓 Mastra 的工具互通性跟上最新規範。三個變更合起來，方向是同一個——降低「從原型到能長跑的生產環境」之間的落差。

## 重要變更

- **Stored Agent 持久化執行（Durable Execution for Agents API）**：已儲存的 Agent 加上 `durable: true` 即可啟用持久化執行，不需要額外程式碼部署，並繼承伺服器的 cache 與 pubsub 達成多副本持久化 → 原本只有部署後的 Agent 才有的跨重啟恢復能力，現在原型階段的 Stored Agent 也能拿到
- **Cloudflare Sandbox Provider**：新增 `@mastra/cloudflare-sandbox`，透過部署好的 Sandbox Bridge Worker 執行指令與檔案操作 → 為 Mastra workspace 多一個執行環境選項，不再只能用 Local 或 Docker
- **MCP 協定升級**：`@mastra/mcp` 支援 stateless 的 `2026-07-28` MCP 協定修訂版，並加入多輪 elicitation → 跟上最新 MCP 規範，和支援同一修訂版的其他 MCP client/server 互通性更好
- **Sandbox Checkpoints**：LocalSandbox 新增檔案系統層級的 checkpoint，可用 `checkpointName` 與 `seedCheckpointName` 指定 → 讓 workspace 能從已知快照快速「暖啟動」，不用每次都從頭初始化環境
- **RAG 圖譜序列化**：`@mastra/rag` 為 GraphRAG 新增 `serialize()` / `deserialize()` → 知識圖譜可以持久化保存，不必每次啟動都重新建構
- **ProcessHandle.closeStdin()**：可以對 Local、Docker 及支援的 sandbox provider 上的背景程序主動關閉 stdin 訊號 EOF；不支援關閉 stdin 的 provider 會拋出新的 `StdinCloseError`

## Breaking Changes

本版本無 breaking changes。

## 遷移指南

直接升級即可，無需修改程式碼：

```bash
npm install @mastra/core@1.60.0
```

若要啟用 Stored Agent 的持久化執行，需額外設定 `durable: true`：

```typescript
// 舊寫法（1.59.x 及之前）：Stored Agent 不具備持久化執行
const agent = await mastra.getStoredAgent('support-agent')

// 新寫法（1.60.0）：加上 durable 即可啟用跨重啟、多副本的持久化執行
const agent = await mastra.getStoredAgent('support-agent', {
  durable: true,
})
```

## 與其他框架的對比觀察

「不用重新部署就能升級到持久化執行」是 Mastra 這版比較特別的取徑——多數框架（例如 LangGraph）的持久化能力是綁在 checkpoint 機制上，開發者從一開始就要決定要不要接；Mastra 把這個決定延後到 Stored Agent 已經在跑之後才做，降低了原型驗證期的架構決策成本。

## 今日收穫

之前看到「durable execution」這種字眼，直覺會以為代表的是底層 checkpoint 或 workflow engine 的能力；這次才注意到 Mastra 是把它做成 Stored Agent 上的一個開關（`durable: true`），代表持久化本身被設計成一個可以「隨時加開」的執行時屬性，而不是建立 Agent 當下就要選定的架構分支——這讓「先驗證邏輯、後決定要不要長跑」變得可行。

## 參考資料

- [Mastra @mastra/core@1.60.0 — GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.60.0)
- [mastra-ai/mastra — GitHub](https://github.com/mastra-ai/mastra)
