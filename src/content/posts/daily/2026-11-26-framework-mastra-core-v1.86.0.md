---
title: "框架更新｜Mastra @mastra/core v1.86.0"
date: 2026-11-26
category: daily
type: digest
tags: [ai-agent, framework, daily, mastra]
lang: zh-TW
description: "Mastra @mastra/core v1.86.0 讓資料實驗也能崩潰後復原，新增實驗性的 Knowledge importer，並要求 Knowledge 工具的呼叫身分必須來自 host，不能從 request 帶進來"
tldr: "Mastra @mastra/core v1.86.0 三個重點：(1) startExperimentAsync() 可以跑成 durable 的 evented workflow，worker 崩潰或重新部署不會讓實驗卡在 running；(2) 新增實驗性的 Knowledge importer 契約，讓外部來源可以用 batching／lease／replay protection 安全同步進 Knowledge；(3) principals／author 讓 host 在 agent run 之外呼叫 Knowledge 工具時，身分只能由 host 指定，不能從 request 帶進來，專門給 MCP／外部 agent 情境用。四項 breaking change 範圍都偏窄（prerelease 套件、MCP 欄位改名、playground UI）。"
series:
  name: "AI Framework Changelog"
  order: 74
---

> :globe: [English version](/posts/daily/2026-11-26-framework-mastra-core-v1.86.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Mastra（`@mastra/core`） |
| 版本 | @mastra/core@1.86.0 |
| 前一版 | [@mastra/core@1.85.0](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.85.0) |
| 發布日 | 2026-11-25 |
| Release Notes | [Release November 25, 2026](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.86.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 29.8k |

## 這個版本為什麼重要

這版把「崩潰後能不能復原」這件事，從 agent 對話之外的另一個場景也補上了：資料集實驗（dataset experiments）。以前 `startExperimentAsync()` 是一個普通的非同步呼叫，process 被重新部署或中途崩潰，整個實驗就卡在 `running`，沒人接手。1.86.0 加了 `durable: true`，讓實驗改成一個 per-item 的 evented workflow 跑，搭配 Redis Streams 這類會重送事件的 pubsub，另一個 worker 可以接手被中斷的項目繼續跑，每個項目仍然只記一筆結果。這說明 Mastra 把「crash-safe」當成跨場景的基礎設施,不是只為聊天型 agent 準備的特殊功能。另一個值得關注的補強是 Knowledge：新增實驗性的 importer 契約，讓外部來源用 batching、lease、replay protection 這些做法安全同步進 Knowledge,而不是自己手刻一套同步邏輯去碰 Knowledge 的底層儲存。最後，`principals`／`author` 這個設計值得多看一眼——host 要在 agent run 之外呼叫 Knowledge 工具（例如代表外部 agent 的 MCP 伺服器）時，身分只能由 host 自己指定，絕對不能從 request 帶進來，寫入也會記錄是誰做的。這是一個明確的「身分主張權」設計：呼叫者不能自己說自己是誰，必須由主控的一方（host）決定。

```diagram
title: Mastra v1.86.0：Knowledge 工具的呼叫身分來源
desc: host 在 agent run 之外代為呼叫 Knowledge 工具時，principals 只能由 host 程式碼指定，不能從外部 request 的參數帶進來。
caption: 簡化示意，只畫 principals 的決定路徑；一般 agent run 內部呼叫不受影響。
---
<svg viewBox="0 0 680 220">
  <path class="dg-line" d="M160 94V140" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M520 94V140" marker-end="url(#arrow)"/>

  <text class="dg-sub" x="160" y="24" text-anchor="middle" dominant-baseline="central">不允許</text>
  <rect class="dg-box dg-box--ghost" x="20" y="38" width="280" height="56" rx="6"/>
  <text class="dg-label" x="160" y="58" text-anchor="middle" dominant-baseline="central">外部 request 帶 principals</text>
  <text class="dg-sub" x="160" y="78" text-anchor="middle" dominant-baseline="central">MCP／外部 agent 自己宣稱身分</text>

  <rect class="dg-box dg-box--ghost" x="20" y="140" width="280" height="56" rx="6"/>
  <text class="dg-label" x="160" y="160" text-anchor="middle" dominant-baseline="central">直接套用到 Knowledge 工具</text>
  <text class="dg-sub" x="160" y="180" text-anchor="middle" dominant-baseline="central">request 說是誰就是誰</text>

  <text class="dg-sub" x="520" y="24" text-anchor="middle" dominant-baseline="central">1.86.0 之後</text>
  <rect class="dg-box" x="380" y="38" width="280" height="56" rx="6"/>
  <text class="dg-label" x="520" y="58" text-anchor="middle" dominant-baseline="central">host 程式碼固定 principals</text>
  <text class="dg-sub" x="520" y="78" text-anchor="middle" dominant-baseline="central">符合宣告的 scope 類型</text>

  <rect class="dg-box" x="380" y="140" width="280" height="56" rx="6"/>
  <text class="dg-label" x="520" y="160" text-anchor="middle" dominant-baseline="central">createTools({ principals })</text>
  <text class="dg-sub" x="520" y="180" text-anchor="middle" dominant-baseline="central">寫入記錄 author，規則與 agent 內呼叫一致</text>
</svg>
```

## 重要變更

- **Durable、崩潰安全的資料集實驗**：`startExperimentAsync()` 與伺服器／client 的觸發 API 加上 `durable: true`，實驗改以 per-item 的 evented workflow 執行，worker 崩潰或重新部署後，另一個 worker（搭配 Redis Streams 等會重送事件的 pubsub）能接手未確認的項目繼續跑 → 長時間跑的批次實驗不會因為一次重新部署就整批卡死
- **Knowledge importer 契約與執行基礎設施（實驗性）**：新增 `KnowledgeImporter` 契約與 `knowledge.importers.run()`，搭配 in-memory／LibSQL／Postgres 持久化的 importer bookkeeping（batching、lease、replay protection、settle/repair）→ 外部來源同步進 Knowledge 不用自己刻一套防重複、防中斷的同步邏輯
- **原生 durable Agent 執行引擎選擇**：`durable.executionEngine`（agent 層或 `Mastra.durable` 預設）可選 `default` 或 `evented`，既有的串流／輸出 API 不受影響；注意舊的 prerelease 值 `executionEngine: 'durable'` 已改名為 `'default'` → 選擇執行引擎不再需要換一整套 API，只是切一個設定值
- **Channels-first 聊天整合**：Core 新增 `createChannelTools()`，可在目前 run 所在的聊天串裡讀取／發送訊息（跨多種 channel adapter）；`@mastra/slack` 新增 `createSlackTools()`（搜尋、附件下載、使用者／頻道查詢），套用同一套存取範圍 → agent 要接進既有聊天管道不用每個整合各寫一套權限邏輯
- **Knowledge 活動查詢 + host 代為呼叫（`principals`／`author`）**：新增 `knowledge_activity` 工具，可查某段期間內 Knowledge 頁面與筆記的變更（含是誰改的），並可用 `from` 縮小到單一頁面或範圍；`knowledge.createTools({ principals })` 讓 host 在 agent run 之外呼叫 Knowledge 工具，身分只能由 host 指定、不能從 request 帶入，寫入記錄在 `author` → MCP 伺服器代外部 agent 操作 Knowledge 時，身分邊界由 host 把關，不是呼叫端自己說了算
- **`interrupted` thread run 狀態**：`mastra.shutdown()` 中途停掉的 durable agent run，不再被訂閱者看成 `failed`，之後恢復執行的結果會接在同一個訂閱上 → 滾動式重啟造成的中斷不會被誤判成真正的失敗

## Breaking Changes

有，四項，範圍都偏窄：

- `get_process_output` 不再支援 `wait: true`，改用 `waitSeconds`（1–300）；舊的 flag 現在會被忽略
  - 影響範圍：直接呼叫 `get_process_output` 並依賴 `wait: true` 的程式碼
- `@mastra/connect`（僅限 prerelease）：原本的事件匯出（`EventsClient`、`connectEvents()` 等）換成新的 `ConnectEvents` 迭代器 API
  - 影響範圍：只用過 prerelease 版 `@mastra/connect` 的專案
- `@mastra/mcp-apps-components`：MCP 邊界欄位改名，`projectId` → `project`
  - 影響範圍：直接讀寫這個欄位的 MCP apps 整合
- `@mastra/playground-ui` 的 trace 元件有重大 API 變動（改成 slot-based 的 `ThreadTrace`、資料直接傳入不自己 fetch 的 `TracesExplorer`、用 navigation callback 取代 href/Link props）
  - 影響範圍：直接客製過 playground trace UI 的專案

## 遷移指南

### 從 1.85.x 升級到 1.86.0

```bash
npm install @mastra/core@1.86.0
```

```ts
// 舊寫法：get_process_output 用 wait 等待完成
await getProcessOutput(processId, { wait: true });

// 新寫法：改用 waitSeconds 指定等待上限
await getProcessOutput(processId, { waitSeconds: 60 });
```

```ts
// 舊寫法（prerelease）：executionEngine 直接寫 'durable'
const agent = new Agent({
  name: 'support-agent',
  durable: { executionEngine: 'durable' },
});

// 新寫法：prerelease 的 'durable' 已改名為 'default'
const agent = new Agent({
  name: 'support-agent',
  durable: { executionEngine: 'default' }, // 或 'evented'
});
```

其餘像 `knowledge_activity`、`createChannelTools()`、Knowledge importer 都是加法，不主動使用不影響既有程式碼；只有用過 prerelease `@mastra/connect` 事件 API 或客製過 playground trace UI 的專案需要跟著改。

## 與其他框架的對比觀察

同一天（11/25）[Pydantic AI v2.75.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.75.0) 也在收緊類似性質的邊界，只是在不同的層：Pydantic AI 管的是「這段文字算不算指令」（workspace 檔案、MCP 伺服器的指令不再自動混進系統提示），Mastra 這版管的是「這次呼叫該算誰的身分」（Knowledge 工具的 `principals` 只能由 host 指定，不能從 request 帶進來）。兩家不約而同在 MCP／外部整合變多之後，往「誰能主張什麼權限」這個方向補強，只是一個收在提示層，一個收在工具呼叫層。另外在 durable 執行這條線上，Mastra 把崩潰復原從 agent 對話擴展到資料集實驗，而上個月 Agno v3.2.0 處理的是 sandbox 執行環境本身的跨 replica 復原——三者合起來看，「執行狀態要能在崩潰、重啟、跨 instance 之間存活」已經是幾個主流框架同時在補的基礎設施，不再只是某一家的差異化賣點。

## 今日收穫

之前以為「durable」只是 agent 對話或長任務才需要的保證——反正聊天型 run 本來就跑得久，才值得花力氣做崩潰復原。看到這版把同一套 evented workflow 機制套到資料集實驗上才意識到：任何「跑一段時間、過程中可能被重新部署打斷」的工作，不管是不是 agent 對話，都有一樣的復原需求。框架把 durable 執行做成可以掛在不同種類任務上的基礎能力，而不是綁死在 agent 執行引擎裡，才是真正把這件事做對的方式。

## 參考資料

- [Mastra @mastra/core@1.86.0 Release Notes](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.86.0)
- [mastra-ai/mastra GitHub](https://github.com/mastra-ai/mastra)
- [@mastra/core CHANGELOG.md](https://github.com/mastra-ai/mastra/blob/@mastra/core@1.86.0/packages/core/CHANGELOG.md)
- [PR #31204：Durable 資料集實驗](https://github.com/mastra-ai/mastra/pull/31204)
- [PR #31101：Knowledge importer 契約與執行基礎設施](https://github.com/mastra-ai/mastra/pull/31101)
- [PR #31200：knowledge_activity 工具](https://github.com/mastra-ai/mastra/pull/31200)
- [PR #30996：Knowledge 工具的 principals／author](https://github.com/mastra-ai/mastra/pull/30996)
- [PR #31113：interrupted thread run 狀態](https://github.com/mastra-ai/mastra/pull/31113)
- [Pydantic AI v2.75.0 Release Notes（同日發布，同樣收緊權限邊界）](https://github.com/pydantic/pydantic-ai/releases/tag/v2.75.0)
- [框架更新｜Mastra @mastra/core v1.83.0](/posts/daily/2026-11-14-framework-mastra-core-v1.83.0)
