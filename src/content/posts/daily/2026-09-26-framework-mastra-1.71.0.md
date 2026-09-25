---
title: "框架更新｜Mastra @mastra/core@1.71.0"
date: 2026-09-26
category: daily
type: digest
tags: [ai-agent, framework, daily, mastra]
lang: zh-TW
description: "Mastra 1.71 讓多工具呼叫的串流步驟提前執行、同時讓 observability 層能跨儲存後端協商能力，兩個看似獨立的問題同時往前一步"
tldr: "Mastra @mastra/core@1.71.0 四個重點：(1) Eager Tool Execution 預設開啟，工具呼叫一 ready 就先跑，不必等模型講完整個 step；(2) Observability Capabilities Negotiation 讓 Studio／自訂 client 先探測儲存層支援哪些追蹤 API 再呼叫，修掉舊儲存層踩到不支援端點時硬回 500 的問題；(3) 新增 `@mastra/discord` 頻道整合與 sandbox 憑證 materialize、MongoDB Vector 伺服器端 embedding；(4) breaking：`@mastra/playground-ui` 的 `TaskList` 拿掉 `title`／`TaskListHeader`／`hideWhenEmpty`。"
series:
  name: "AI Framework Changelog"
  order: 27
---

> 🌏 [English version](/en/posts/daily/2026-09-26-framework-mastra-1.71.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Mastra |
| 版本 | `@mastra/core@1.71.0` |
| 前一版 | `@mastra/core@1.70.0` |
| 發布日 | 2026-09-25 |
| Release Notes | [GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra/core%401.71.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 28.3k |

## 這個版本為什麼重要

[上一篇（1.69.0）](/posts/daily/2026-09-25-framework-mastra-1.69.0)補的是「判斷」這個原語；1.71 同一天內接著往兩個方向推進，而且是兩個平常不會被放在同一篇 release note 裡討論的問題。第一個是體感延遲：多工具呼叫的 step 過去要等模型把整個回覆講完才開始執行任何工具，1.71 讓每個工具呼叫在自己的參數串流完成當下就先跑，不用等其他工具或後續文字。第二個是協定層的健壯性：Mastra 的 observability 儲存層本來就分好幾種（LibSQL、Postgres、ClickHouse、DuckDB、Spanner……），Studio 或自訂 client 過去只能用 try-and-fail 的方式試探某個儲存層支不支援某個 API，踩到不支援的功能就是一個 500。1.71 把這件事變成正式的能力協商協定——先問儲存層支援什麼，再決定呼叫哪個端點。一個是使用者看得到的效能改善，一個是開發者才會感受到的基礎設施成熟度，同一天一起交付。

## 重要變更

- **Eager Tool Execution（預設開啟）**：工具呼叫在自己的參數串流完成後就立即開始執行，不必等模型講完整個 step 才開跑 → 多工具呼叫的 step（例如「比較巴黎和羅馬的天氣」）明顯減少閒置等待時間；可用 `eagerToolExecution: false` 退回舊行為，也已支援寫進 stored agent 的預設選項
- **Observability Capabilities Negotiation**：`GET /system/packages` 與新增的 `GET /observability/capabilities` 回傳 `observabilityStorageCapabilities`（含 `traceQuery`／`threadQuery`／`deltaPolling` 等每端點旗標），儲存層也能透過 `getFeatures()` 宣告自己支援哪些 discovery（entity／service／environment／tag／metric） → 用 LibSQL 或預設 `PostgresStore` 等舊儲存層的專案，Studio 現在會自動改走 legacy 的 trace-light 端點，不會再對不支援的 discovery route 硬打出 500（修掉一個反覆出現的「does not support entity name discovery」錯誤）
- **Trace Aggregation Planning API（`planTraceAggregate()`）**：把 `aggregateTraces()` 的請求驗證與轉換成 `TrustedTraceAggregatePlan`，任何儲存後端拿到就能直接執行、不用重新驗證 → 自訂儲存後端要接 trace 聚合查詢，時間範圍上限 365 天、interval 最多 1000 bucket 這些規則只需要在一個地方寫一次
- **Discord 頻道整合 + Sandbox 憑證 materialize**：新增 `@mastra/discord`，讓 agent 直接接 Discord 的 slash command／DM／@mention（token 可加密靜態儲存）；`@mastra/connect` 新增 `environment()`，把 Platform 連線憑證轉成 sandbox provider（e2b／Modal／Daytona／Docker／subprocess）能吃的 `{ env, onStart }` → agent 跑在 sandbox 裡呼叫 `gh`／`git` 這類 CLI 工具，不用再自己手動塞 token 就能通過驗證
- **MongoDB Vector 伺服器端 Embedding（Automated Embeddings）**：建立帶 `autoEmbed`（例如 Voyage `voyage-4`）的 index 後，可以直接寫入純文字、用 `queryText` 搜尋，embedding 由 MongoDB 端產生 → 應用程式不用自己接 embedding provider、管理向量維度，目前是 MongoDB Atlas 的 Preview 功能
- **資料集 schema 的 ReDoS 防護**：dataset input／ground truth schema 裡的 regex `pattern`／`patternProperties` 改用線性時間（RE2）引擎執行，精心構造的 pattern 不會再讓伺服器整個凍結；改用 RE2 後，帶 lookaround（`(?=...)`）或 backreference（`\1`）的 pattern 在建立或更新 dataset 時會直接被拒絕（`DATASET_SCHEMA_PATTERN_UNSUPPORTED`） → 用 regex 做 dataset schema 驗證的專案要檢查有沒有用到這兩種語法，升級後得改寫

## Breaking Changes

- `@mastra/playground-ui` 的 `TaskList` API：`title`、`TaskListHeader`、`hideWhenEmpty` 三個 prop／元件整個移除，因為新版 `TaskList` 改成把進行中任務畫成自己的一條小圖形軌道，不再有獨立的清單標頭
  - 影響範圍：直接使用 `TaskList` 或 `TaskListHeader` 客製 Mastra Studio 任務列表 UI 的專案

## 遷移指南

### 從 1.70.x 升級到 1.71.0

```bash
pnpm add @mastra/core@1.71.0
```

```tsx
// 舊寫法（1.70.x 及之前）
<TaskList tasks={tasks} title="進行中任務" hideWhenEmpty={false} />
<TaskListHeader />

// 新寫法（1.71.0）
<TaskList tasks={tasks} />
```

沒有客製 Mastra Studio `TaskList` 元件的專案，這版沒有 breaking change，直接升級即可。

## 與其他框架的對比觀察

多數框架（LangGraph、CrewAI）把「平行工具呼叫」當成既有能力：模型一次回傳多個 `tool_call`，框架就把它們都排進去執行。Mastra 1.71 的 Eager Tool Execution 解的是更細的粒度問題——不是新增平行度，而是不等模型講完整個 step、單一工具的參數一 ready 就先跑。這版另一半心力放在 observability 協定本身的健壯性（capabilities negotiation），這點目前主流框架大多還沒有系統化處理，多半是「儲存層一換，前端呼叫就得手動跟著改」；Mastra 把它變成一個雙方都能先探測、再決定呼叫哪個 API 的正式協定。

## 今日收穫

之前以為 agent 框架的效能優化都是在講 token 用量或快取命中率，看到 Eager Tool Execution 才意識到：同一個 step 裡「等模型講完 vs. 等單一工具的參數就緒」這種微觀排程差異，才是使用者實際體感到的「卡頓」的來源之一——效能不是只有全域的延遲指標，還有這種介於模型輸出結構與工具呼叫時機之間、平常不會被拿出來單獨討論的細緻度問題。

## 參考資料

- [Mastra @mastra/core@1.71.0 — GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra/core%401.71.0)
- [mastra-ai/mastra — GitHub](https://github.com/mastra-ai/mastra)
- [Mastra @mastra/core@1.69.0 — 上一篇框架更新](/posts/daily/2026-09-25-framework-mastra-1.69.0)
- [PR #25008：Observability Capabilities Negotiation 與 discovery 能力宣告](https://github.com/mastra-ai/mastra/pull/25008)
- [PR #24868：Trace Aggregation Planning API（`planTraceAggregate()`）](https://github.com/mastra-ai/mastra/pull/24868)
- [PR #25005：Eager Tool Execution](https://github.com/mastra-ai/mastra/pull/25005)
- [PR #25002：`@mastra/discord` 頻道整合](https://github.com/mastra-ai/mastra/pull/25002)
- [PR #24912：`@mastra/connect environment()` sandbox 憑證 materialize](https://github.com/mastra-ai/mastra/pull/24912)
- [PR #24383：MongoDB Vector Automated Embeddings](https://github.com/mastra-ai/mastra/pull/24383)
- [PR #25044：資料集 schema 驗證的 ReDoS 防護](https://github.com/mastra-ai/mastra/pull/25044)
- [PR #24947：`TaskList` 重新設計（breaking change 來源）](https://github.com/mastra-ai/mastra/pull/24947)
