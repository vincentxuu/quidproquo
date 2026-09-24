---
title: "框架更新｜Mastra @mastra/core@1.69.0"
date: 2026-09-25
category: daily
type: digest
tags: [ai-agent, framework, daily, mastra]
lang: zh-TW
description: "Mastra 1.69 把「路由決策」與「安全把關」統一成一個型別化的 Classifier 原語，可同時當 workflow 分支條件與 agent 輸入/輸出防護閘，並帶來三組 breaking changes"
tldr: "Mastra @mastra/core@1.69.0 四個重點：(1) 新增 Classifier 原語，把固定選項的 LLM 判斷結構化成一等公民，可註冊在 `Mastra` 實例上並自動掛 tracing；(2) Classifier 可直接當 typed workflow step 做分支，也能用 `ClassifierProcessor` 套在 agent 輸入/輸出/串流上做安全把關，預設 fail-closed；(3) 新增 `context.background.adopt()` 讓 tool 立即回應同時交棒背景任務，`@mastra/connect@0.3.0` 一次補上 10 個 SaaS 整合；(4) breaking：`@mastra/playground-ui` 的 `PageLayout`／`FluidHoverHighlight` API 重構，trace 查詢的 `group` 選項標記棄用。"
series:
  name: "AI Framework Changelog"
  order: 26
---

> 🌏 [English version](/en/posts/daily/2026-09-25-framework-mastra-1.69.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Mastra |
| 版本 | `@mastra/core@1.69.0` |
| 前一版 | `@mastra/core@1.68.0` |
| 發布日 | 2026-09-24 |
| Release Notes | [GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.69.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 28.3k |

## 這個版本為什麼重要

[上一篇（1.67.0）](/posts/daily/2026-09-17-framework-mastra-1.67.0)讓 agent 自己會產生 workflow、自己串第三方服務；1.69 補的是另一塊基礎設施：把「判斷」這件事本身變成一個型別化、可被追蹤、可被 workflow 直接消費的原語。過去要做安全把關或路由分支，多半是在 prompt 裡加一段指示、或自己寫一個呼叫 LLM 拿 JSON 的 helper function——這種做法沒有統一介面，也很難稽核「這次判斷到底評估了什麼、耗了多少 token」。Mastra 1.69 的 `Classifier` 把這件事收斂成一個正式元件：可以註冊在 `Mastra` 實例上集中管理，評估時自動起一個 `CLASSIFIER_EVALUATION` tracing span；同一個 Classifier 既能當 typed workflow step 做分支條件，也能透過 `ClassifierProcessor` 套在 agent 的輸入、輸出、串流內容上做安全閘門，而且新元件從第一版就是 fail-closed（判斷失敗就直接擋下，而不是放行）。這讓「路由邏輯」和「安全策略」第一次共用同一套基礎設施，而不是兩套各自維護的臨時方案。

## 重要變更

- **Classifier 原語（`@mastra/core/classifier`）**：新增 `Classifier` 類別做固定選項評估，可用 `new Mastra({ classifiers })` 註冊，並提供 `getClassifier`／`listClassifiers`／`addClassifier`／`removeClassifier` 管理 API，脫離既有 trace 時會自動起一個根 `CLASSIFIER_EVALUATION` span → 判斷邏輯從「agent 內部一段隱藏的 LLM 呼叫」變成一個可以獨立測試、獨立觀測的元件
- **Classifier 當 typed workflow step 做分支**：workflow 可以直接 `.classifier(router)` 接進 fluent／動態 graph，分支條件讀取 classifier 回傳的型別化答案與 token 用量 → 原本要手刻的條件分支邏輯，變成宣告式的 `.branch([...])` 搭配結構化判斷結果
- **`ClassifierProcessor`：agent 輸入/輸出/串流的安全閘門**：新增 `ClassifierProcessor`，可掛在 `inputProcessors`／`outputProcessors` 上，用 classifier 判斷內容並在 `onResult` 裡呼叫 `abort()` 擋下請求；新元件預設 **fail-closed**（classifier 呼叫失敗就直接擋，需要維持舊行為要手動設 `errorStrategy: 'warn'`） → 安全策略不再依賴「agent 有沒有乖乖照 prompt 指示」，而是一個獨立於主鏈路、有明確 abort 語意的把關層
- **`context.background.adopt()`：原生背景任務執行**：tool 可以先回應「已收到」，再透過 `context.background.adopt({ completion, cancel })` 把長時間執行的操作交給 Mastra 追蹤完成與取消，不用讓 `execute()` 一直卡著等結果 → 長任務（例如「幫我做一份研究」）可以立即確認收到，同時仍能被追蹤與取消，但要注意 adopt 的 handle 只存在記憶體，process 重啟不會恢復
- **`@mastra/connect@0.3.0`：一次補 10 個 SaaS 整合**：新增 Slack、GitHub、Google Mail、Google Calendar、Fireflies、PostHog、Stripe、Discord、Twitter/X、HubSpot 十個由 Nango template 產生的 tool provider，接上 Mastra Platform 連線後 `tools: connect()` 就能依請求自動解析對應工具 → agent 要串這些服務不用再自己寫 tool wrapper
- **Inngest 耐久執行更可靠**：workflow／durable agent 新增 `retries` 選項，讓 process 重啟或重新部署後可以從已完成的 step 繼續重試；`resumeStream()`、`approveToolCall()` 等 resume 方法修掉了「編輯器 override 後遺失 durable 執行」與「suspended run 找不到 snapshot」兩個問題 → 長時間執行的 durable agent 不會因為一次部署就整個失敗重來

## Breaking Changes

- `@mastra/playground-ui`：移除 `@mastra/playground-ui/lib/springs`，`FluidHoverHighlight` 只接受 `hover`、`className` 兩個 prop
  - 影響範圍：直接使用 `FluidHoverHighlight` 或 spring 動畫 API 客製 Mastra Studio UI 的專案
- `@mastra/playground-ui`：`PageLayout`／shell API 重構——移除 `PageLayoutRoot`、`MainContentLayout`、`MainContentContent`，以及多個 `AppShell` header 相關 props／context，需遷移到新版 `PageLayout`（用 `breadcrumbs`、`headerActions`、`actionRow`）
  - 影響範圍：直接使用這些 layout 元件客製 Mastra Studio 頁面的專案
- Trace 分組查詢標記棄用（Core／Server／Client 一致）：`queryTraces()` 與 trace-query 的 `group` 選項已棄用，改用 `queryTraceThreads()`／`queryThreads` contract（下個 major 版本前仍可用）
  - 影響範圍：用 `group: { by: ['threadId'] }` 查詢 trace 的程式碼

## 遷移指南

### 從 1.68.x 升級到 1.69.0

```bash
pnpm add @mastra/core@1.69.0
```

```tsx
// 舊寫法（1.68.x 及之前，playground-ui）
import { FluidHoverHighlight } from '@mastra/playground-ui/lib/springs';
<FluidHoverHighlight hover={hover} spring={mySpringConfig} className="rounded-lg" />;

// 新寫法（1.69.0）
import { FluidHoverHighlight } from '@mastra/playground-ui';
const hover = useFluidHover(containerRef);
<FluidHoverHighlight hover={hover} className="rounded-lg" />;
```

```ts
// 舊寫法：trace 分組查詢
await mastraClient.queryTraces({ timeRange, group: { by: ['threadId'] } });

// 新寫法：改用 thread 查詢
await mastraClient.queryTraceThreads({ traces: { timeRange } });
```

沒有客製 Mastra Studio playground-ui 元件、也沒有用 trace 分組查詢的專案，這版沒有 breaking change，直接升級即可。

## 與其他框架的對比觀察

LangGraph 的條件分支（`when()` 語法）是把使用者自己寫的 Python 判斷函式接進 graph，判斷邏輯本身不是框架的一等公民；Mastra 的 Classifier 反過來，把「LLM 判斷」結構化成一個有型別、有管理 API、自動掛 tracing 的元件，再讓 workflow 和 agent 的輸入/輸出防護共用同一個原語。這跟 Composio 用整合聚合解決「agent 要串很多工具」的思路不同，Mastra 這次解的是「agent 需要做判斷」這個更基礎的問題——安全把關和路由分支過去是兩套各自土砲的邏輯，現在變成同一個元件的兩種用法。

## 今日收穫

之前以為 agent 的安全把關就是在 system prompt 裡多寫一段「請拒絕不安全的請求」，看到 `ClassifierProcessor` 預設 fail-closed、而且是獨立於 agent 主鏈路的元件才意識到：安全策略的可靠性不該賭在「模型有沒有乖乖照 prompt 指示」上，而應該是一層有明確 abort 語意、判斷失敗就擋下而非放行的基礎設施——這跟「多寫幾句提示詞」是兩種完全不同等級的保證。

## 參考資料

- [Mastra @mastra/core@1.69.0 — GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.69.0)
- [mastra-ai/mastra — GitHub](https://github.com/mastra-ai/mastra)
- [Mastra @mastra/core@1.67.0 — 上一篇框架更新](/posts/daily/2026-09-17-framework-mastra-1.67.0)
- [PR #24738：Classifier 註冊 API](https://github.com/mastra-ai/mastra/pull/24738)
- [PR #24747：Classifier 作為 typed workflow step](https://github.com/mastra-ai/mastra/pull/24747)
- [PR #24768：`ClassifierProcessor`](https://github.com/mastra-ai/mastra/pull/24768)
- [PR #24793：`ClassifierProcessor` 預設 fail-closed](https://github.com/mastra-ai/mastra/pull/24793)
- [PR #24418：`context.background.adopt()`](https://github.com/mastra-ai/mastra/pull/24418)
- [PR #24606：`@mastra/connect` 十個新整合 provider](https://github.com/mastra-ai/mastra/pull/24606)
- [PR #24741：Inngest workflow／durable agent `retries` 選項](https://github.com/mastra-ai/mastra/pull/24741)
