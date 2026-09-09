---
title: "框架更新｜Mastra @mastra/core@1.65.0"
date: 2026-09-10
category: daily
type: digest
tags: [ai-agent, framework, daily, mastra]
lang: zh-TW
description: "Mastra 1.65 開放跨儲存後端的進階 trace 查詢與租戶級批次刪除，同時把 Factory 自訂看板重構成型別化合約，帶來四項 breaking changes"
tldr: "Mastra @mastra/core@1.65.0 三個重點：(1) 新的 advanced trace query 合約在 ClickHouse／DuckDB／Postgres 三種儲存後端都有實作，支援 bounded time range、遞迴 predicate、cursor pagination；(2) 租戶範圍的批次刪除（最多 1,000 筆／次）會連動清掉 spans／scores／feedback／metrics／logs；(3) breaking：`@mastra/factory` 的 `defineBoard()` 改為型別化 phase 合約、移除全域 rules 物件，`@mastra/playground-ui` 兩個元件的 slot/prop 改名。"
series:
  name: "AI Framework Changelog"
  order: 17
---

> 🌏 [English version](/en/posts/daily/2026-09-10-framework-mastra-1.65.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Mastra |
| 版本 | `@mastra/core@1.65.0` |
| 前一版 | `@mastra/core@1.64.0` |
| 發布日 | 2026-09-09 |
| Release Notes | [GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.65.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 28k |

## 這個版本為什麼重要

[上一篇（1.64.0）](/posts/daily/2026-09-05-framework-mastra-1.64.0)處理的是 sandbox 冷啟動；這次 1.65 處理的是 observability 資料規模化之後的兩個現實問題：**trace 資料要能跨後端一致查詢**，以及**trace 資料要能安全刪除**。過去 trace 查詢的語意容易因為底層用 ClickHouse 還是 Postgres 而有微妙差異，1.65 把查詢邏輯收斂成一份嚴謹的合約（bounded time range、遞迴 predicate、thread grouping、deterministic cursor pagination），不合法或過度複雜的請求在進到 storage adapter 之前就會被拒絕。同一版也補上租戶範圍的批次刪除，讓刪除動作能連動清掉 spans、scores、feedback、metrics、logs——這對需要做資料保留或合規清理的生產部署是必要的一塊。另一條主線是 Factory：自訂看板（board）從「內建才能用」變成「型別化、可安裝」，但也因此帶來四項 breaking changes。

## 重要變更

- **Advanced Trace Querying（Core Contract + Server Endpoint + 三種儲存後端）**：新增嚴謹、可攜的 trace 查詢合約（bounded time range、遞迴 trace／span／score predicate、thread grouping、deterministic cursor pagination），並提供一個 authenticated server endpoint，在 ClickHouse、DuckDB、Postgres 都有實作 → 不用因為換了 observability 儲存後端就重寫查詢邏輯，不合法或過度複雜的請求在進 storage adapter 前就會被擋下
- **Tenant-Scoped Trace Deletion + Cascade Cleanup**：一次最多刪 1,000 筆 trace 並支援 tenant scoping，刪除會連動清掉 spans、scores、feedback、metrics、logs；新增 `mastra.datasets.deleteExperiment()`，連沒有 dataset 歸屬的孤兒 experiment 也能一併清掉它產生的 trace → 大規模 agent 部署做資料保留或合規清理時，不會留下「查不到但還占空間」的殘留資料
- **Workflow Graph Metadata for Control-Flow Blocks**：`.parallel()`／`.branch()`／`.dowhile()`／`.dountil()`／`.foreach()`／`.sleep()`／`.sleepUntil()`／`.map()` 這些 control-flow 節點現在也能加 `id`／`description`／`metadata`，並在序列化與反序列化後保留 → 視覺化編輯器和 review 工具可以用穩定 id 定位一個 parallel 區塊或 sleep 節點，不用再靠自動產生的 id 或圖上的相對位置
- **Agent Channel Actions API**：`handlers.onAction` 讓應用程式攔截 UI 卡片的互動（例如「retry」按鈕），同時仍可呼叫內建的 `defaultHandler` 做預設的 tool approval 處理，或用 `onAction: false` 整個關掉 → 客製化互動 UI 不用整套重寫審批流程
- **Factory Custom Boards 成為第一等公民**：`defineBoard()` 成為型別化合約，board 自己定義 phase 語意（`resting`／`working`／`terminal`），可安裝的自訂看板能完整渲染在 UI 裡並被 decision／tool 端對端定位，board 自己持有 transition policy 和 tool-result 規則 → 第三方開發者可以做出跟內建看板同等地位的自訂 Factory 看板
- **Observability 命名整併**：`skills`／`workspace`／`memory`／`signals` 這些內建 add-on 在 trace 上現在顯示自己真正的子系統名稱（例如 `skill:inject`、`memory: recall`），不再是含糊的「processor run」；新增 `SKILL_ACTION`、`AGENT_SIGNAL` 兩種 span type，自訂 processor 也能宣告自己要怎麼被追蹤

## Breaking Changes

- `@mastra/factory`：`defineBoard()` 的 phase 定義現在必須加 `kind`，working 型 phase 必須加 `role`，且 `initialPhase` 必須是 `resting`
  - 影響範圍：所有用 `@mastra/factory` 自訂看板的專案
- `@mastra/factory`：移除全域 rules 物件（`FactoryRules`、對應的 defaults／merge／assert helper、`new MastraFactory({ rules })`），tool-result 規則改掛在 `defineBoard({ tools })` 上，`configVersion` 取代 `rules.version`
  - 影響範圍：曾經透過 `MastraFactory({ rules })` 設定全域規則的專案
- `@mastra/factory`：`GET /web/factory/projects/:id/attention` 回應格式改變——拿掉 `tier`，counts／latest 欄位移到 `kinds[kind]...` 底下
  - 影響範圍：直接呼叫這支 attention API 的自訂前端或整合
- `@mastra/playground-ui`：`TraceDataPanelView` 用 `messagesPanelSlot` 取代 `partialThreadTabSlot`；`TracesLayout` 用 `sidePanelWidth: 'half' | 'wide' | 'full'` 取代 `sidePanelWide`
  - 影響範圍：直接嵌入這兩個 playground-ui 元件並客製化 slot／prop 的專案

## 遷移指南

### 從 1.64.x 升級到 1.65.0

```bash
pnpm add @mastra/core@1.65.0
```

```ts
// @mastra/factory 的 defineBoard()
// 舊寫法（1.64.x 及之前）
defineBoard({
  phases: { resting: {}, working: {} },
  initialPhase: 'resting',
});

// 新寫法（1.65.0）
defineBoard({
  phases: {
    resting: { kind: 'resting' },
    working: { kind: 'working', role: 'executor' },
  },
  initialPhase: 'resting',
  tools: { /* 原本掛在全域 rules 上的 tool-result 規則搬到這裡 */ },
});
```

```tsx
// @mastra/playground-ui 的 slot / prop 改名
// 舊寫法（1.64.x 及之前）
<TraceDataPanelView partialThreadTabSlot={<CustomTab />} />
<TracesLayout sidePanelWide />

// 新寫法（1.65.0）
<TraceDataPanelView messagesPanelSlot={<CustomTab />} />
<TracesLayout sidePanelWidth="wide" />
```

只呼叫 `@mastra/core` 一般 API、沒有自訂 `@mastra/factory` 看板或嵌入上述兩個 playground-ui 元件的專案，這版沒有 breaking change，直接升級即可。

## 與其他框架的對比觀察

Mastra 這幾版持續把「跑到生產環境要面對的基礎設施問題」一個個做進框架核心——1.63 是 trace／log 對齊，1.64 是 sandbox 冷啟動，1.65 是「trace 資料要能查、要能刪、要守 tenant 邊界」，是 observability 從「有記錄」進化到「可治理」的典型路徑。這和 LangGraph、CrewAI 目前把資源放在 agent 原語與角色編排上的方向不同；Factory 看板走向可安裝、型別化，也讓 Mastra 更像一個平台而不只是一個函式庫。

## 今日收穫

之前以為「trace 查詢」只是把記錄下來的資料撈出來顯示，看到 Mastra 把 bounded time range、遞迴 predicate、cursor pagination 都寫進一份合約，要求 ClickHouse、DuckDB、Postgres 三種完全不同的儲存後端都要遵守，才意識到：當 observability 資料量大到需要多種儲存後端支援時，「查詢語意跨後端一致」本身就是一個要刻意設計的工程問題，不是加幾個 SQL WHERE 條件就能解決。

## 參考資料

- [Mastra @mastra/core@1.65.0 — GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.65.0)
- [mastra-ai/mastra — GitHub](https://github.com/mastra-ai/mastra)
- [Mastra @mastra/core@1.64.0 — 上一篇框架更新](/posts/daily/2026-09-05-framework-mastra-1.64.0)
- [PR #22726：Advanced trace query contract](https://github.com/mastra-ai/mastra/pull/22726)
- [PR #22553：Tenant-scoped trace deletion](https://github.com/mastra-ai/mastra/pull/22553)
- [PR #22550：`deleteExperiment` 連帶清除 trace](https://github.com/mastra-ai/mastra/pull/22550)
- [PR #22633：Workflow control-flow 節點的 id／description／metadata](https://github.com/mastra-ai/mastra/pull/22633)
- [PR #22927：Agent Channel `handlers.onAction`](https://github.com/mastra-ai/mastra/pull/22927)
- [PR #22542：Observability span 命名整併](https://github.com/mastra-ai/mastra/pull/22542)
