---
title: "框架更新｜Mastra @mastra/core@1.79.0"
date: 2026-10-23
category: daily
type: digest
tags: [ai-agent, framework, daily, mastra]
lang: zh-TW
description: "Mastra 1.79.0 把 session 定址從 resourceId+scope 改成獨立 sessionId，並加入實驗性 MCP Events 讓 MCP server 可以主動推事件"
tldr: "Mastra 1.79.0 四件事：(1) Agent controller session 改用獨立 sessionId 定址，一個 resourceId 可以同時掛多個 session；(2) 實驗性 MCP Events（SEP-3415 draft）讓 MCP server 可以發事件流，client 用 poll／長連線／webhook 收；(3) 新增 span 層級 observability 聚合（`aggregateSpans()`），可以算 p95 延遲、token 成本；(4) sandbox 新增原生檔案系統 API，少掉逐步 shell command。Breaking：session 定址改版、`querySpans()` 拿掉部分 filter 跟欄位、channel resolver 要求 requestContext。"
series:
  name: "AI Framework Changelog"
  order: 50
---

> 🌏 [English version](/posts/daily/2026-10-23-framework-mastra-1.79.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Mastra |
| 版本 | @mastra/core@1.79.0 |
| 前一版 | @mastra/core@1.78.0 |
| 發布日 | 2026-10-21 |
| Release Notes | [@mastra/core@1.79.0](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.79.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 29k |

## 這個版本為什麼重要

上一版（1.78.0）把「誰能碰哪個 run」收進框架做 agent scopes；這一版處理的是另外兩個問題：「一個 resource 底下能不能同時跑多個獨立 session」，還有「agent 的 MCP server 要怎麼主動跟外部系統對話」。session 從「resourceId + scope」改成直接用 sessionId 定址，是個不小的 API 重排；MCP Events 則讓 Mastra 的 MCP server 不再只能被動答 call，還能推事件出去——對長時間跑的 agent 整合是補了一塊。對正在用 agent controller 多 session 功能、或自己接 observability 後端的團隊，這版的四個 breaking change 比新功能更需要先讀。

## 重要變更

- **MCP Events（實驗性，SEP-3415 draft）**：MCP server 可以發事件流，client 用 poll、保持連線收 stream，或走簽名 webhook 收事件；Studio 在 `mastra dev` 下可以列出事件類型、poll、串流、甚至手動觸發測試事件 → 做長跑 agent 整合時不用自己另外接一套事件系統
- **Span 層級的 observability 聚合**：新增 `aggregateSpans()` storage 合約，宣告 `span-aggregate` feature 的 adapter 可以回答「某個工具的 p95 延遲」「某個 agent 花多少 token」這類問題；`queryTraces()`/`querySpans()` 也加上 `timeToFirstChunkMs` 欄位 → 想做 agent 效能儀表板不用自己把每個 span 拉下來算
- **Sandbox 原生檔案系統 API**：`WorkspaceSandbox` 可以曝露 `filesystem` 屬性，一次 roundtrip 讀寫、列目錄，不用每個操作都另外開一個 shell command；E2B／PlatformSandbox 等 provider 已支援，`@mastra/code-sdk` 的 `SandboxFilesystem` 已改用 → 大量檔案操作的 code agent 少掉很多 round-trip
- **使用者層級 Connect 權限隔離**：`@mastra/connect` 新增 per-resource（端點使用者）層級的連線授權，避免一個使用者的連線被另一個使用者的請求拿去用；新增 `userConnectRoutes()` 讓已驗證使用者自己連自己的帳號；新增 Microsoft Teams channel → 多租戶 SaaS 接第三方整合時不用自己另外做隔離層

## Breaking Changes

- Agent controller session 改用 `sessionId` 定址（拿掉 `scope`）：`controller.getSessionByResource(resourceId, scope)` 移除，改用 `controller.getSession(sessionId)`；`createSession()` 拿掉 `scope`，改讓每個 session 自己帶 `id`（省略時預設等於 `resourceId`，單 session／resource 的舊程式碼不用改）；`deleteSession()` 改吃 `{ sessionId }`
  - 影響範圍：用 agent controller 做多 session 管理、或直接呼叫 `getSessionByResource` 的整合
- Thread-row 查詢改用 `timeRange.traces` / `timeRange.threads`，不是 `traces.timeRange`
  - 影響範圍：自己組 observability 查詢條件的程式碼
- `querySpans()` 拿掉 `model`／`provider` filter，回應不再帶 `cost`、`inputTruncated`、`outputTruncated`、`errorTruncated`（要 storage adapter 更新才能補回來）
  - 影響範圍：用 span 層級資料做成本或截斷判斷的儀表板、監控整合
- Channel 的 `resolveResourceId`／`resolveThreadId` context 現在一定要帶 `requestContext`
  - 影響範圍：自己手動呼叫這兩個 resolver（測試、腳本）的程式碼

## 遷移指南

### 從 1.78.0 升級到 1.79.0

```bash
npm install @mastra/core@1.79.0 @mastra/server@latest @mastra/client-js@latest
```

```ts
// 舊寫法（1.78.0）：session 用 resourceId + scope 定址
await controller.createSession({ resourceId: 'repo-1', scope: 'run-a' });
const session = await controller.getSessionByResource('repo-1', 'run-a');
await controller.deleteSession({ resourceId: 'repo-1', scope: 'run-a' });

// 新寫法（1.79.0）：session 直接用自己的 id 定址
await controller.createSession({ id: 'run-a', resourceId: 'repo-1' });
const session = await controller.getSession('run-a');
await controller.deleteSession({ sessionId: 'run-a' });
```

## 與其他框架的對比觀察

這週同時看到 Composio 加 session hooks（可以在工具呼叫前後擋下來）、Agno 加 MCP Tool Runner（讓工具可以單獨測試不用接 MCP client）。三家不約而同在補「agent 跑起來之後，外部系統怎麼跟它對話、怎麼看它在幹什麼」這塊——Mastra 用 MCP Events 讓 server 主動推事件，Composio 用 hooks 擋攔請求／結果，方向相反但解決的是同一層問題：agent 執行期的可觀測性和可控性，正在變成所有框架的下一個戰場。

## 今日收穫

之前以為 session 的定址方式（resourceId+scope vs sessionId）只是內部實作細節，看到 Mastra 把這個改動列成第一條 breaking change、還特別設計「省略 id 時預設等於 resourceId」的相容路徑，才意識到這類 API 重新定址在生產系統裡的風險主要不是程式碼要改，而是「舊資料怎麼對應到新定址方式」——這個相容設計本身就是遷移成本的一部分。

## 參考資料

- [@mastra/core@1.79.0 release notes — GitHub](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.79.0)
- [mastra-ai/mastra — GitHub](https://github.com/mastra-ai/mastra)
- [框架更新｜Mastra @mastra/core@1.78.0](/posts/daily/2026-10-17-framework-mastra-1.78.0)
