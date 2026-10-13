---
title: "框架更新｜Mastra @mastra/core@1.76.0"
date: 2026-10-14
category: daily
type: digest
tags: [ai-agent, framework, daily, mastra]
lang: zh-TW
description: "Mastra 1.76 讓 durable agent 的 crash recovery 不再因為多個 process 搶同一個 run 而把訊息寫壞，但 Observational Memory 預設模型換掉也可能悄悄換了你的帳單供應商"
tldr: "Mastra @mastra/core@1.76.0 核心主題是多機部署的正確性：(1) 每個 run 由實際執行它的 process「claim」，crash recovery 不再對還在跑的 run 重新啟動第二次執行；(2) storage adapter 可以用 run fencing 擋下已失去 ownership 的寫入；(3) PostgreSQL 的 working memory 改成 row-locked 交易做原子合併。Breaking：`@mastra/playground-ui` 的舊 Metrics 卡片元件被拿掉，`MetricsCardGroup`／`MetricsLineChart` 掉了幾個 prop；Observational Memory 預設模型從固定的 Gemini 2.5 Flash 改成跟著主模型走的 `model: 'auto'`，沒顯式指定模型的人會悄悄換供應商。"
series:
  name: "AI Framework Changelog"
  order: 40
---

> 🌏 [English version](/posts/daily/2026-10-14-framework-mastra-1.76.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Mastra |
| 版本 | @mastra/core@1.76.0 |
| 前一版 | @mastra/core@1.75.0 |
| 發布日 | 2026-10-11 |
| Release Notes | [GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.76.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 28,000 |

## 這個版本為什麼重要

Durable agent（會把執行狀態存進資料庫、process 掛掉後能從斷點續跑的 agent）最怕的不是「跑到一半死掉」，而是「死掉後兩個 process 以為自己都該接手，結果同時寫同一個 thread」。1.76 直接把這個問題釘死：每個 run 現在有明確的 owner，owner 的 claim 會持續更新，只有 claim 真的過期（process 掛了約 30 秒後）才會被 crash recovery 接手；storage adapter 支援的話，失去 ownership 的 process 連寫入都會被擋下。對已經把 Mastra agent 跑在多副本（multi-replica）環境的團隊，這修的是一個真實會發生、但平常測試很難重現的資料損壞場景。代價是這版也動了兩個「看起來不像 breaking change 的」預設值——Metrics 面板元件改版、Observational Memory 預設模型從固定供應商換成跟著主模型走——不注意的話,升級後帳單或介面會有預期外的變化。

## 重要變更

- **Durable agent run ownership + storage-level run fencing**：run 由實際執行它的 `stream()`／`generate()`／`resume()`／`recover()` claim，claim 每次執行都會更新，process 死掉約 30 秒後才會過期；`recoverActiveRuns()` 會跳過 claim 仍有效的 run（回傳 `status: 'skipped'` 與下次可重試時間），`recover()` 對還活著的 run 拋 `DURABLE_AGENT_RUN_ACTIVE`，要 `force: true` 才能接管——但接管同一個 process 裡還在跑的 run 仍會拋 `DURABLE_AGENT_RECOVER_RUN_ACTIVE_LOCALLY`，避免同一個 run 被同一個 process 執行兩次 → 修掉了「crash recovery 把還在跑的 run 重啟一次，兩個執行同時寫同一個 thread、新寫入蓋掉舊訊息」這個真實回報過的 bug（#23734）
- **PostgreSQL working memory 原子合併**：`scope: 'resource'` 的 working memory 更新改成在 row-locked 交易裡做 deep merge，不同 process 改不同欄位不會互相蓋掉；也可以透過 `mode: 'merge'` 明確走合併模式，不支援原子合併的 adapter 會直接回 HTTP 400 而不是悄悄整筆覆寫
- **檔案處理不再卡死整個 thread**：provider 拒絕某個附加檔案時（例如 Gemini 的 502 或 OpenAI／Anthropic SDK 直接 refuse），新的預設 `UnsupportedFileHandler` 會把檔案從 prompt 移除重打一次，或換成 sandbox 路徑讓 agent 繼續用工具操作它 → 以前這類檔案留在 thread 裡會讓之後**所有**回合（包括純文字的）都跟著失敗
- **`nestUnderParent` / `nestUnderRun()`**：讓一個 run（例如 LLM judge）可以在 trace 裡被標成另一個 run 的子 span，同時保留原 run 的 trace 層級識別資訊，方便做評分／judge 類的巢狀追蹤
- **Gemini `MALFORMED_FUNCTION_CALL` 自動重試**：預設的 `stream-error-retry-processor` 遇到 Gemini 偶發的這個錯誤會原樣重送失敗的 step（最多兩次），該 step 沒有工具執行過，不會重複副作用；目前 durable agent 尚未納入這個自動重試

## Breaking Changes

- `@mastra/playground-ui` 移除舊版 Metrics 卡片元件，改用新的自帶狀態 Metrics 卡片／dashboard building blocks
  - `MetricsCardGroup` 不再接受 `variant`；`MetricsLineChart` 拿掉 `xAxisInterval`／`xAxisMinTickGap`
  - 影響範圍：自訂過 playground Metrics 面板的使用者
- `@mastra/memory` 的 Observational Memory 預設模型從固定的 `google/gemini-2.5-flash` 改成 `model: 'auto'`（跟著主模型／供應商走）
  - 影響範圍：靠固定選 Gemini Flash 壓觀察／反思模型成本的人，升級後若不顯式指定模型，供應商與費率會悄悄跟著主模型改變

## 遷移指南

### 從 1.75.0 升級到 1.76.0

```bash
npm install @mastra/core@1.76.0
```

```typescript
// 如果靠 Observational Memory 固定用 Gemini Flash 壓成本 —— 升級後要顯式指定
const memory = new Memory({
  observationalMemory: {
    model: "google/gemini-2.5-flash", // 不寫就會變成 model: 'auto' 跟著主模型走
  },
});
```

```typescript
// Metrics 面板自訂元件 —— 拿掉已移除的 prop
// 舊寫法（1.75.0）
<MetricsCardGroup variant="compact">
  <MetricsLineChart xAxisInterval={5} xAxisMinTickGap={20} />
</MetricsCardGroup>

// 新寫法（1.76.0）：改用新的自帶狀態 Metrics 卡片/dashboard building blocks，
// 這兩個 prop 已不存在，需照 playground-ui 新元件 API 重接
```

```typescript
// 多副本環境想接管一個卡住的 run
const stream = await durableAgent.recover(runId, { force: true });
// 接管會讓原本持有這個 run 的執行停止
```

## 與其他框架的對比觀察

LangGraph、CrewAI 這類框架的「容錯」多半還停在單機重試層級；Mastra 1.76 把 durable agent 的正確性問題往下挖到 storage adapter 這一層（run fencing、row-locked 原子合併），等於把「多副本部署下的資料一致性」當成框架該保證的事，而不是留給使用者自己拿分散式鎖解決。這跟 Mastra 一直主打 TypeScript 生產部署的定位一致——同一天發布的 DSPy 3.4.1 關心的是「怎麼讓模型自己優化」，Mastra 1.76 關心的是「怎麼讓已經跑起來的 agent 不要在多機環境下把自己的狀態寫壞」，兩者幾乎是互補但不重疊的問題。

## 今日收穫

之前以為 durable agent 的 crash recovery 只要「process 掛了就從存檔重新跑」就夠安全，看到 Mastra 1.76 把這拆成「claim 一個 run」「續約 claim」「claim 過期才能接手」「接手要過 force 才能搶線上還活著的 run」四層機制才意識到：真正難的不是「怎麼恢復一個掛掉的 run」，而是「怎麼確定一個 run 真的掛了，而不是看起來像掛了但其實還有另一個 process 在跑」——這個判斷錯一次,就是兩個執行同時寫同一筆訊息記錄。

## 參考資料

- [Mastra @mastra/core@1.76.0 Release Notes](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.76.0)
- [Mastra GitHub Repository](https://github.com/mastra-ai/mastra)
- [Mastra Durable Agents 文件](https://mastra.ai/docs/harness/durable-agents)
