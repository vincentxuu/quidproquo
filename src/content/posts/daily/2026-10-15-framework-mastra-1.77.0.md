---
title: "框架更新｜Mastra @mastra/core@1.77.0"
date: 2026-10-15
category: daily
type: digest
tags: [ai-agent, framework, daily, mastra]
lang: zh-TW
description: "Mastra 1.77.0 把 run fencing 擴到十幾種儲存後端，並讓 MCP client 與 server 的 trace 雙向互連；workflow HTTP 路由不再能啟動內部 workflow，是要先改的 breaking change"
tldr: "Mastra 1.77.0 三件事：Factory 多了正式的 sandbox provider 契約（Docker、E2B、Mastra Platform）與預先建置環境；上一版的 run fencing 擴到 Cloudflare DO/D1、DynamoDB、MongoDB、Redis 等十幾種儲存，失去所有權的 durable run 不能覆寫恢復後的狀態；span 支援 links，`@mastra/mcp` 會把 client 工具呼叫和 server 請求的 trace 雙向連起來。Breaking：`@mastra/server` 的 workflow 路由不再能啟動或恢復內部 workflow，durable agent 要改走 agent 路由。"
series:
  name: "AI Framework Changelog"
  order: 41
---

> 🌏 [English version](/posts/daily/2026-10-15-framework-mastra-1.77.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Mastra |
| 版本 | @mastra/core@1.77.0 |
| 前一版 | @mastra/core@1.76.0 |
| 發布日 | 2026-10-14 |
| Release Notes | [@mastra/core@1.77.0](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.77.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 28.8k |

## 這個版本為什麼重要

上一版 1.76.0 才加入 durable agent run 的所有權機制，這一版把它鋪到幾乎所有儲存後端，分散式部署時「當機恢復後兩個執行體寫同一個 run」的問題才算真正補齊。另一個重點是觀測：agent 的 trace 和 MCP server 的 trace 可以互相跳轉，排查工具呼叫出錯時不用再對時間戳手動拼。

## 重要變更

- **Factory sandbox provider 契約**：新增正式的 `FactorySandbox` 介面，支援可調設定 schema、repo 模板與預先建置環境，並附上 Docker（`@mastra/docker`）、E2B（`@mastra/e2b`）、Mastra Platform（`@mastra/platform-workspace`）三種實作 → 換沙箱供應商只要換一個 provider instance
- **環境預先建置與多 repo session**：sandbox 支援 builds 時，可以手動、排程或 push 觸發預先建置環境模板，降低第一次 session 的冷啟動；session 會啟動環境裡的每個 repo，並能用 `source_control_*` 工具對任一 repo 開變更請求 → coding agent 可以一次跨多個 repo 工作
- **跨儲存後端的 run fencing**：Cloudflare DO/D1、Convex、DynamoDB、DSQL、MongoDB、MSSQL、MySQL、OracleDB、Spanner、Redis／Upstash／Valkey 都支援 run fencing，失去所有權的 durable run 不能覆寫恢復後那個 run 的 thread、訊息與 workflow 狀態 → 多機部署的正確性不再依賴特定資料庫
- **Observational Memory 併發修正**：加入 generation 保護（`supersededBy`），寫入 API 改回傳是否成功與原因，例如 `commitActiveObservations({ applied, reason })` → 多個程序同時寫記憶時不會互相蓋掉
- **Trace links 與 MCP 雙向關聯**：span 支援 `links`（含 W3C `traceparent` helper），Datadog、Sentry、OTel exporter 會一起傳；`@mastra/mcp` 把 client 的工具呼叫 span 和 server 的請求 span 雙向連結 → 從 agent trace 一鍵跳到 MCP server trace

## Breaking Changes

- `@mastra/server` 的 workflow HTTP 路由不再允許啟動或恢復內部 workflow（回 404）→ durable agent 要改用 agent 路由，例如 `POST /agents/:agentId/stream`
  - 影響範圍：直接打 workflow 路由來觸發 durable agent 的服務
- AgentController 的 thread／session 行為調整，新增 suspension 位址認領 API，並淘汰 `SessionRecord.modeId/modelId/state/pending`、`HarnessStorage.appendPendingItem/updatePendingItem/removePendingItem`、`SessionSuspensions.resolveToolCallId()`
  - 影響範圍：自己實作 harness storage 或直接讀 session record 的專案
- `@mastra/playground-ui` 的 `Dialog`／`AlertDialog` 移除 handle／render 類 props，改由 `open`／`onOpenChange` 控制
  - 影響範圍：重用 playground UI 元件的前端
- `@mastra/client-js`／`@mastra/react` 比較實驗的 API 淘汰 `experimentIdA/experimentIdB`，改用 `experimentIds`（可選 `baselineId`）
  - 影響範圍：用 client SDK 做 A/B 實驗比較的程式
- Factory 專案支援 provider instance 形式的 sandbox（`MastraFactoryConfig.sandbox`）；舊的 callback 寫法仍可用，但拿不到 settings／builds 這些新能力

## 遷移指南

### 從 1.76.0 升級到 1.77.0

```bash
# Step 1: 更新依賴
npm install @mastra/core@1.77.0 @mastra/server@latest @mastra/mcp@latest
```

```ts
// Step 2: durable agent 改走 agent 路由
// 舊寫法：直接打 workflow 路由啟動 durable agent 背後的內部 workflow（1.77.0 起回 404）
// 新寫法：
await fetch(`${baseUrl}/agents/${agentId}/stream`, { method: "POST", body: JSON.stringify(input) });

// Step 3: 實驗比較 API
// 舊：{ experimentIdA, experimentIdB }
// 新：{ experimentIds: [idA, idB], baselineId: idA }
```

自己實作 harness storage 的專案，另外檢查有沒有用到上面列出的淘汰欄位與方法。

## 與其他框架的對比觀察

Mastra 這兩版都在補 durable 執行的正確性，方向跟同期的 [Pydantic AI v2.56.0](/posts/daily/2026-10-15-framework-pydantic-ai-v2.56.0)（新增 PGTaskDurability 與 microVM 沙箱）、Google ADK 2.12.0（workflow 節點可要求人工確認）一致：框架的競爭點從「能不能做出 agent」轉到「agent 跑在多台機器、跑很久、出錯要追查時，狀態會不會亂」。

## 今日收穫

之前以為 run fencing 這類機制只要做在一個主要資料庫就夠了，看到 Mastra 一次鋪到十幾種後端才意識到：使用者把 agent 部署在哪種儲存上是框架控制不了的，正確性保證要跟著每一種後端走，否則就只是某個 adapter 的功能。

## 參考資料

- [@mastra/core@1.77.0 release notes — GitHub](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.77.0)
- [mastra-ai/mastra — GitHub](https://github.com/mastra-ai/mastra)
- [框架更新｜Mastra @mastra/core@1.76.0](/posts/daily/2026-10-14-framework-mastra-1.76.0)
