---
title: "框架更新｜Mastra @mastra/core@1.74.0"
date: 2026-10-06
category: daily
type: digest
tags: [ai-agent, framework, daily, mastra]
lang: zh-TW
description: "Mastra 1.74 讓工具執行時能讀到完整對話狀態、記憶 recall 可以繞著命中結果往前後翻頁，playground-ui 同時拿掉一組舊的 trace 分頁 API"
tldr: "Mastra @mastra/core@1.74.0 三個重點：(1) `agent.getMessages()` 讓工具執行時能讀到目前完整對話狀態（含已記住的訊息與這次 run 中的回應），不改既有唯輸入的 `messages` 欄位；(2) `getObservationalMemoryHistory` 新增群組過濾、排序與依 `recordId` 直接查找，記憶 recall 也能繞著搜尋命中的觀察群組往前後翻頁；(3) breaking：`@mastra/playground-ui` 的 `ThreadViewByTrace`／`TraceThreadPanel`／`ThreadTrace` 拿掉 `anchorTraceId`，`ThreadTrace.LoadMoreSentinel` 整個移除，改用 `pageSize`／`onLoadOlder` 控制分頁。"
series:
  name: "AI Framework Changelog"
  order: 33
---

> 🌏 [English version](/en/posts/daily/2026-10-06-framework-mastra-1.74.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Mastra |
| 版本 | `@mastra/core@1.74.0` |
| 前一版 | `@mastra/core@1.73.0` |
| 發布日 | 2026-10-01 |
| Release Notes | [GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.74.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 28.6k |

## 這個版本為什麼重要

工具呼叫過去只能看到框架明確傳進來的 `messages` 參數——那是「這次呼叫」的輸入，不是「目前整段對話」的狀態。1.74 新增 `agent.getMessages()`，讓工具在執行當下能讀到完整對話，包括已經被記住（remembered）的訊息和同一個 run 裡其他已經產生的回應，而且不需要改動既有的 `messages` 輸入欄位，是純粹的能力疊加。這解決一類具體的痛點：工具需要知道「使用者前面問過什麼」或「同一輪裡其他工具已經回了什麼」才能做出正確判斷，過去得自己在工具外面另外傳一條 side channel，現在框架原生提供。另一個方向是記憶 recall 的可用性——`getObservationalMemoryHistory` 補上群組過濾、排序與依 ID 直接查找，recall 搜尋也能繞著命中的觀察群組往前後翻頁，包含被 reflection 壓縮掉的群組和還沒被啟用的緩衝群組，不必重新索引就能做更細緻的調查式查詢。這兩個方向合在一起，指向同一個主題：讓 agent（和開發者）在執行當下能更完整地看到「對話實際發生過什麼」，不是只看框架願意明確傳遞的那一小片段。

## 重要變更

- **`agent.getMessages()` 工具上下文**：標準與 durable agent loop 的工具執行 context 都新增 `context.agent.getMessages()`，回傳目前完整對話（含記住的訊息與這次 run 的回應），不改既有輸入唯讀的 `messages` 欄位 → getter 反映訊息列表的刪除，但不反映只套用在 provider prompt 上的暫時轉換；回傳值視為唯讀
- **Observational Memory History 查詢強化**：`getObservationalMemoryHistory` 新增群組過濾（`groupId`）、明確排序（`sortDirection`）、依 `recordId` 直接查找，透過 `supportsObservationalMemoryHistorySearch` 宣告各資料庫 adapter 是否支援 → Convex 使用者需要重新部署 server function 才能套用新的過濾條件；同時影響 `@mastra/convex`／`@mastra/libsql`／`@mastra/mongodb`／`@mastra/mysql`／`@mastra/oracledb`／`@mastra/pg`
- **Memory Recall 可繞命中結果往前後翻頁**：recall 支援從命中的 `groupId`往「之前／之後」翻頁，包含被 reflection 壓縮掉的群組與還沒被啟用的緩衝群組，不需要重新索引；搜尋結果也改成依時間排序、標示群組可能被隱藏在哪裡，已經在 agent context 裡的命中結果會用更短的引用呈現，讓更多新命中塞得進去
- **Playground UI：新的無障礙表單欄位元件**：新增 `Field`／`Fieldset`／`Form`／`SearchInput` 等元件，統一 label／description／error 的綁定，不用手動管理 `id`／`htmlFor`；逐步淘汰舊的 `*FieldBlock` 寫法
- **Vanta 資安修補升級**：為 2026-10-01 的 Vanta remediation pass 拉高 `dompurify`／`js-yaml`／`@ai-sdk/provider-utils` 等傳遞相依套件的最低版本，並順帶升級 `nodemailer`／`fastify`／`hono`／`ajv` 等巢狀相依

## Breaking Changes

- `@mastra/playground-ui` 的 trace 分頁 API 整個換掉：
  - `ThreadViewByTrace`、`TraceThreadPanel`、`ThreadTrace` 移除 `anchorTraceId` prop
  - `ThreadTrace.LoadMoreSentinel` 整個移除
  - 改用 `ThreadTrace` 上的 `pageSize` 與 `onLoadOlder` 控制分頁與載入更舊的回合
  - 影響範圍：直接使用這幾個元件客製 Mastra Studio／自建 UI 顯示 trace 對話串的專案

## 遷移指南

### 從 1.73.x 升級到 1.74.0

```bash
pnpm add @mastra/core@1.74.0
```

```tsx
// 舊寫法（1.73.x 及之前）
<ThreadTrace anchorTraceId={traceId} />
<ThreadTrace.LoadMoreSentinel />

// 新寫法（1.74.0）
<ThreadTrace pageSize={20} onLoadOlder={() => fetchOlderMessages()} />
```

```ts
// 新功能：工具內讀取完整對話
execute: async (input, context) => {
  const messages = context?.agent?.getMessages?.() ?? [];
  return { messageCount: messages.length };
};
```

沒有直接使用 `ThreadTrace`／`TraceThreadPanel`／`ThreadViewByTrace` 客製 trace UI 的專案，升級後沒有程式碼層的 breaking change；用到 Convex 當記憶儲存後端的專案，需要重新部署 server function 才能套用新的群組過濾條件。

## 與其他框架的對比觀察

「工具能讀到多少對話狀態」這件事，各框架的預設立場不太一樣：LangGraph 傾向把狀態明確建模進 graph 的 state schema，工具要讀什麼就宣告在 schema 裡；Mastra 1.74 走的是另一條路——工具執行 context 直接開一個 getter 把目前完整對話暴露出去，不用先在 schema 裡宣告。這對快速迭代的工具開發比較友善（不用改 schema 就能多讀一點上下文），但也把「工具該讀多少、該怎麼用這些資訊」的判斷整個下放給工具作者自己把關。記憶 recall 的翻頁能力則是延續上一版（1.71.0）Observability Capabilities Negotiation 的同一個思路：讓查詢這一層的能力探測與分頁機制變得更正式、更系統化，而不是每個呼叫端各自兜一套。

## 今日收穫

之前覺得「工具的輸入」和「agent 的對話歷史」是兩個分開管理、各自有清楚邊界的東西——工具就該只看框架餵給它的參數。看完 `agent.getMessages()` 才意識到，這個邊界其實是框架設計時的選擇，不是必然如此：讓工具能讀到目前完整對話狀態，换來的是工具可以做更聰明的判斷（例如「使用者剛剛已經問過類似問題，不用重新查」），代價是工具的行為變得更依賴對話歷史的細節，測試與除錯的範圍也跟著變大。能力擴大和可預測性之間的取捨，不是只存在於模型層，框架給工具開的介面一樣要做這個決定。

## 參考資料

- [Mastra @mastra/core@1.74.0 — GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.74.0)
- [mastra-ai/mastra — GitHub](https://github.com/mastra-ai/mastra)
- [Mastra @mastra/core@1.71.0 — 上一篇框架更新](/posts/daily/2026-09-26-framework-mastra-1.71.0)
- [PR #25525：`agent.getMessages()` 與 Observational Memory History 群組過濾／翻頁](https://github.com/mastra-ai/mastra/pull/25525)
- [PR #25317：Playground UI `Field`／`Fieldset`／`Form`／`SearchInput`](https://github.com/mastra-ai/mastra/pull/25317)
- [PR #25694：Vanta remediation pass 相依套件升級](https://github.com/mastra-ai/mastra/pull/25694)
- [@mastra/core — npm 版本紀錄](https://www.npmjs.com/package/@mastra/core?activeTab=versions)
