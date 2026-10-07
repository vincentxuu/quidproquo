---
title: "框架更新｜Mastra @mastra/core@1.75.0"
date: 2026-10-08
category: daily
type: digest
tags: [ai-agent, framework, daily, mastra]
lang: zh-TW
description: "Mastra 1.75 把 trace 查詢拆到單一 span 粒度、記憶可以交給向量庫自己做 embedding，@mastra/connect 同時升到 1.0 並改掉三組 API 的名字"
tldr: "Mastra @mastra/core@1.75.0 四個重點：(1) 新增 `storage.querySpans()` 可以直接查單一 span（含 filter／cursor／cost），不用先找到 trace 再往下挖；(2) `aggregateTraces()` 補上 token／cost 量測，ClickHouse／DuckDB／Postgres 三種 observability store 都支援；(3) Semantic Recall 支援 self-embedding 向量庫（如 MongoDBVector 的 `autoEmbed`），不用再設定 client 端 `embedder`；(4) `@mastra/connect` 正式進到 1.0，但 `integrations` 改名 `providers`、MCP 工具預設不再需要 approval、Slack channel id 從 `slack` 改成 `slack-channels`，都是 breaking。"
series:
  name: "AI Framework Changelog"
  order: 35
---

> 🌏 [English version](/en/posts/daily/2026-10-08-framework-mastra-1.75.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Mastra |
| 版本 | `@mastra/core@1.75.0` |
| 前一版 | `@mastra/core@1.74.0` |
| 發布日 | 2026-10-07 |
| Release Notes | [GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.75.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 28.6k |

## 這個版本為什麼重要

過去要查「過去一小時裡所有失敗的 tool_call」，得先把 trace 撈出來，再在 trace 內部逐一翻 span——trace 是查詢的最小單位。1.75 新增 `storage.querySpans()`，讓 span 本身變成一等公民：可以直接帶 filter、cursor、cost 條件去查，不必先定位 trace 再往下鑽。這跟同一版新增的 token／cost 量測（`aggregateTraces()` 支援 `tokens.*`／`cost.sum`／`cost.avg`）合在一起看，方向很清楚——Mastra 把 observability 從「給你一串 trace 列表」往「給你一個可以做儀表板查詢的資料層」推進一步，ClickHouse／DuckDB／Postgres 三種 store 都吃得到。另一個方向是記憶層的門檻下降：Semantic Recall 過去一定要設定 client 端的 `embedder`，1.75 開放向量庫自己宣告 `isSelfEmbedding`，像 `MongoDBVector` 開 `autoEmbed` 之後，語意記憶可以完全不碰 embedder 設定就跑起來。這對快速原型特別有感——少一個一定要正確設定、設錯會默默壞掉的環節。比較需要注意的是 `@mastra/connect` 這次正式進到 1.0：穩定版的代價是把 `integrations` 改名成 `providers`、MCP 工具預設不再要求 approval、Slack 的 channel id 從 `slack` 改成 `slack-channels`，三個改動都不向下相容。

## 重要變更

- **`storage.querySpans()` 單一 span 查詢**：新增 `storage.querySpans()` / `client.querySpans()` / `POST /api/observability/spans/query`，支援 filter、cursor、bounded preview 與 model cost，可以直接查「過去一小時所有失敗的 `tool_call`」而不必先找到 trace → 共用的 cursor／timeout／resource-limit 錯誤訊息也改成講「query」，錯誤碼不變（#25791）
- **`aggregateTraces()` 補 token／cost 量測**：新增 `tokens.input`／`tokens.output`／`tokens.total`／`tokens.reasoning`／`tokens.cached`（各自支援 `.sum`／`.avg`）與 `cost.sum`／`cost.avg`，可用於 `having`／`orderBy`，ClickHouse／DuckDB／Postgres 三種 observability store 都支援 → 用量先依 trace 加總再依群組加總，平均值只算有用量紀錄的 trace；混幣別的群組 `cost.sum`／`cost.avg` 回傳 `null`，`cost.unit` 顯示 `"mixed"`（#25735）
- **Semantic Recall 支援 self-embedding 向量庫**：`MastraVector` 新增 `isSelfEmbedding`，預設 `false` 不影響既有設定；向量庫自己宣告 `true`（例如 `MongoDBVector` 的 `autoEmbed: { model: 'voyage-4' }`）之後，語意記憶不需要再設定 client 端 `embedder` → 若同時設定了 `embedder`，仍以 client 端為準；自我 embedding 的訊息存在獨立的 `memory_messages_selfembed` 索引，兩者不會互相污染（#25009）
- **Sessions 改成每個 thread 只認一個當前 model**：`AgentController` 的 session 不再依 mode 各自記一個 model，切換 mode 不會自動換 model；`session.model.switch` 簽名改成 `switch(modelId, options?)`，可以一次設定 model 與 thinking level → 舊 thread 第一次被打開時會把舊的 per-mode 選擇自動搬到 `currentModelId`（#25997）；另外新增 `createSession({ createInitialThread: false })` + `session.thread.ensureId()`，session 建立時可以先不開 thread，真正送訊息才建立，減少用不到卻留下的空 thread（#22561）

## Breaking Changes

- `@mastra/connect@1.0.0` 發現的 MCP 工具預設不再需要 approval：
  - 要恢復舊行為需顯式設定 `requireApproval`（取代舊的 `autoApproveTools`）
  - 影響範圍：用 `@mastra/connect` 串接外部 MCP 工具、依賴預設 approval 流程把關的專案
- `@mastra/connect` API 改名 `integrations` → `providers`：
  - 移除 `connect()`（`tools()` 的別名）、`environment()` sandbox credential 介面與多個 resolver helper／export
  - 影響範圍：直接呼叫 `@mastra/connect` 底層 API 而非只用高階 agent 整合的專案
- `channels()` 的 Slack channel 整合 id 從 `slack` 改成 `slack-channels`（Slack 的工具本身仍在 `slack`）：
  - 影響範圍：用 `channels()` 設定 Slack channel 整合的專案，工具層設定不受影響
- `AgentController` model switching 拿掉 `modeId`／`scope`：
  - `session.model.switch({ modelId, modeId })` → `session.model.switch(modelId, options?)`
  - 切換 mode 不再自動換回該 mode 之前用的 model
  - 影響範圍：依賴「每個 mode 記自己的 model」這個行為的專案
- `@mastra/react` hooks 改成單一物件參數：
  - 位置參數整組換成物件參數，所有 hook 都接受 `queryOptions`（TanStack Query），且不再預設在 id 為空時自動略過
  - 影響範圍：直接使用 `@mastra/react` hooks 的前端專案

## 遷移指南

### 從 1.74.x 升級到 1.75.0

```bash
pnpm add @mastra/core@1.75.0
```

```ts
// 舊寫法（1.74.x 及之前）：依 mode 各自記一個 model
await session.model.switch({ modelId: 'openai/gpt-5.6', modeId: 'build' });
await session.mode.switch({ modeId: 'plan' }); // 自動換回 plan mode 之前的 model

// 新寫法（1.75.0）：session 只認一個當前 model
await session.model.switch('openai/gpt-5.6', { thinkingLevel: 'high' });
await session.mode.switch({ modeId: 'plan' }); // 仍保持 openai/gpt-5.6
```

```ts
// 新功能：向量庫自己做 embedding，不需要 client 端 embedder
const memory = new Memory({
  storage,
  vector: new MongoDBVector({ id: 'vec', uri, dbName, autoEmbed: { model: 'voyage-4' } }),
  options: { semanticRecall: true },
});
```

沒有用 `@mastra/connect`、也沒有自己呼叫 `session.model.switch` 或 `@mastra/react` hooks 的專案，升級後沒有程式碼層的 breaking change；用 `@mastra/connect` 串 Slack／MCP 工具的專案，需要照上面逐條檢查 approval 預設值與 channel id 是否受影響。

## 與其他框架的對比觀察

把 trace 查詢拆到 span 粒度、再補上 token／cost 量測，這條路線 LangGraph 和 CrewAI 目前都還停在「trace 列表 + 外接 observability 平台」這一層，沒有把 cost/tokens 當成框架原生可查詢的欄位。Mastra 這幾版（1.71 的 Observability Capabilities Negotiation、1.74 的翻頁能力、1.75 的 span 查詢與 cost 量測）一直在往同一個方向疊——把 observability 當成框架自己的資料層在經營，而不是丟給外部 APM 工具。self-embedding 向量庫則是記憶層的另一個趨勢：LlamaIndex／LangChain 生態也在朝「向量庫原生處理 embedding」靠攏（例如 MongoDB Atlas 自己的 auto-embedding），Mastra 用 `isSelfEmbedding` 一個 flag 把這件事標準化進框架介面，算是把既有生態的能力接進自己的記憶抽象，而不是重新發明一套。

## 今日收穫

之前以為「observability」和「記憶」是框架裡兩個分得很開的子系統——一個管 trace／debug，一個管 agent 記不記得事情。看 1.75 的變更才發現，這兩層其實共用同一組底層關切：都是「怎麼用最少設定拿到可靠的歷史資料」。Span 查詢和 cost 量測讓 trace 變成可以直接做分析查詢的資料，而不只是除錯用的日誌；self-embedding 向量庫讓記憶不再需要開發者自己對齊 embedder 設定。兩者的共同效果是把「原本要自己兜資料管線才能做到的事」收進框架預設行為——但 `@mastra/connect` 1.0 的三個 breaking change 也提醒一件事：穩定版不代表介面不會再變，只是變動的頻率換了個節奏。

## 參考資料

- [Mastra @mastra/core@1.75.0 — GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.75.0)
- [mastra-ai/mastra — GitHub](https://github.com/mastra-ai/mastra)
- [Mastra @mastra/core@1.74.0 — 上一篇框架更新](/posts/daily/2026-10-06-framework-mastra-1.74.0)
- [PR #25791：`storage.querySpans()` 單一 span 查詢 API](https://github.com/mastra-ai/mastra/pull/25791)
- [PR #25735：`aggregateTraces()` token／cost 量測](https://github.com/mastra-ai/mastra/pull/25735)
- [PR #25009：Semantic Recall self-embedding 向量庫支援](https://github.com/mastra-ai/mastra/pull/25009)
- [PR #25997：AgentController session 單一 model 持久化](https://github.com/mastra-ai/mastra/pull/25997)
- [@mastra/core — npm 版本紀錄](https://www.npmjs.com/package/@mastra/core?activeTab=versions)
