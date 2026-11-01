---
title: "框架更新｜Mastra @mastra/core v1.80.0"
date: 2026-10-30
category: daily
type: digest
tags: [ai-agent, framework, daily, mastra]
lang: zh-TW
description: "Mastra @mastra/core v1.80.0 讓每個終端使用者可以各自授權自己的第三方帳號給 agent 用，並新增缺連線時可渲染的 connect card；同時有四項 breaking changes 影響 trace 查詢、connect session、code-sdk 與 playground 排序"
tldr: "Mastra @mastra/core v1.80.0 三個重點：(1) `tools({ resourceId })` ＋ `userConnectRoutes()` 讓每個終端使用者各自綁自己的 OAuth 連線，伺服器端強制一個使用者的連線不能被另一個使用者的 agent 拿去用；(2) 新增 `request_connection` 工具，agent 缺某個整合時能直接回傳結構化卡片讓聊天介面渲染連線請求；(3) 四項 breaking changes：`queryTraceThreads()` 不再帶 `model`／`provider` 且 `page.limit` 上限收緊到 100、connect-session 建立 API 回傳欄位改名、`code-sdk` 不再預設註冊內建 subagent、`TracesExplorer` 排序 API 改成單一物件。"
series:
  name: "AI Framework Changelog"
  order: 57
---

> 🌏 [English version](/posts/daily/2026-10-30-framework-mastra-core-v1.80.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Mastra（`@mastra/core`） |
| 版本 | @mastra/core@1.80.0 |
| 前一版 | @mastra/core@1.79.0 |
| 發布日 | 2026-10-28 |
| Release Notes | [@mastra/core@1.80.0](https://github.com/mastra-ai/mastra/releases/tag/@mastra/core@1.80.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 29k |

## 這個版本為什麼重要

多租戶 agent 產品一直有個尷尬的折衷：要讓 agent 幫使用者操作 Gmail、Slack、GitHub 這類第三方服務，最簡單的做法是整個 app 共用一組服務帳號授權，但這樣每個使用者的 agent 做的事其實都算在同一個身分上，稽核和風險隔離都很粗。這版把「使用者自己授權自己的帳號」做成框架原生支援：`tools({ resourceId })` 讓同一個 agent 定義可以依呼叫者的身分解析出不同的工具集合，`userConnectRoutes()` 開出對應的連線路由，而且伺服器端會硬性擋掉「使用者 A 的連線被使用者 B 的 agent 拿去用」這種跨租戶誤用。配上新的 `request_connection` 工具，agent 甚至能在對話中途主動說「我需要你授權這個服務」，讓聊天介面即時渲染連線卡片——不用使用者事先知道要去哪裡設定。

```diagram
title: Mastra v1.80.0：per-resource 連線請求流程
desc: Agent 缺某個使用者尚未連線的整合時，用 request_connection 回傳結構化卡片；使用者自己完成授權後，這條連線被鎖定只服務這一位使用者。
caption: 簡化示意：省略既有的全域共用連線路徑（1.80.0 之前就有，這版並非取代它）。
---
<svg viewBox="0 0 640 440">
  <path class="dg-line" d="M320 96V136" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 204V240" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M320 300V340" marker-end="url(#arrow)"/>

  <rect class="dg-box" x="140" y="40" width="360" height="56" rx="6"/>
  <text class="dg-label" x="320" y="60" text-anchor="middle" dominant-baseline="central">Agent 呼叫整合工具</text>
  <text class="dg-sub" x="320" y="80" text-anchor="middle" dominant-baseline="central">但沒有這位使用者的連線</text>

  <rect class="dg-box" x="140" y="140" width="360" height="64" rx="6"/>
  <text class="dg-label" x="320" y="160" text-anchor="middle" dominant-baseline="central">request_connection</text>
  <text class="dg-sub" x="320" y="180" text-anchor="middle" dominant-baseline="central">回傳結構化 connect-prompt</text>

  <rect class="dg-box" x="140" y="244" width="360" height="56" rx="6"/>
  <text class="dg-label" x="320" y="264" text-anchor="middle" dominant-baseline="central">Chat UI</text>
  <text class="dg-sub" x="320" y="284" text-anchor="middle" dominant-baseline="central">渲染 connect card 給使用者看</text>

  <rect class="dg-box dg-box--ghost" x="140" y="344" width="360" height="56" rx="6"/>
  <text class="dg-label" x="320" y="364" text-anchor="middle" dominant-baseline="central">使用者本人</text>
  <text class="dg-sub" x="320" y="384" text-anchor="middle" dominant-baseline="central">用自己的帳號完成 OAuth 授權</text>
</svg>
```

## 重要變更

- **End-user（per-resource）連線**：`tools({ resourceId })` 讓工具解析依呼叫者身分而不同，`userConnectRoutes()` 開出使用者自己授權的連線路由，內建快取，伺服器端硬性擋掉一個使用者的連線被另一個使用者的 agent 拿走 → 多租戶 agent 產品不用自己接一層「誰可以用哪個連線」的檢查邏輯
- **In-chat「request connection」提示**：resource-scoped 工具解析內建 `request_connection` 工具，回傳結構化的 `connect-prompt`（provider 清單＋連線狀態），聊天介面可以直接渲染連線卡片 → agent 缺某個整合時可以當場請使用者授權，不用事先引導使用者去設定頁
- **Span 聚合 API**：新增 `POST /observability/spans/aggregate` 與 `aggregateSpans()`，ClickHouse／Postgres／DuckDB 都支援，一次查出 agent 執行次數、延遲、錯誤率、token、成本等分組統計 → 做 Metrics／observability 面板不用自己在應用層聚合
- **統一的 provider 錯誤分類**：`@mastra/core/error` 新增 `classifyProviderError` 等函式，一個 reader 判斷認證失敗、額度、rate limit、context 超長、模型或請求被拒、逾時、服務中斷等情境；串流錯誤現在會把 provider 狀態碼／requestId／model id／reason 一起送到前端，重連後讀取一樣能分類 → 不同 provider 的錯誤訊息終於有一致的使用者體驗
- **執行狀態與中斷控制**：thread 訂閱可以用 `withRunStatus: true` 收到有序的 `thread-run-status`；`agent.abortRun(runId)` 可以明確取消 durable run，中斷觀察者連線預設不再連帶中斷 durable／evented 執行 → 執行狀態的生命週期管理更精確

## Breaking Changes

有，四項：

- `queryTraceThreads()` 回傳的 thread 資料不再帶 `model`／`provider` 欄位，且 `page.limit` 上限收緊到 100（預設 25）：
  - 舊：`queryTraceThreads({ page: { limit: 500 } })` 並直接讀 `threads[0].model`
  - 新：`queryTraceThreads({ page: { limit: 100 } })`；`threads[0].model` 不再存在，要改讀 span 層級資料
  - 影響範圍：直接依賴 thread 列表裡 `model`／`provider` 欄位、或把 `limit` 設超過 100 的程式碼
- `@mastra/connect` 的連線建立 API 回傳欄位從 `connectUrl` 改成 `launchUrl`：
  - 舊：`const { connectUrl } = await createConnectSession(...)`
  - 新：`const { launchUrl } = await createConnectSession(...)`（經伺服器端驗證過的啟動路由）
  - 影響範圍：所有呼叫 connect-session 建立 API 並直接用回傳欄位名稱的程式碼
- `@mastra/code-sdk` 不再預設註冊內建 subagent：
  - 舊：`createCodeSdk({ ... })`（內建 subagent 自動掛上）
  - 新：`createCodeSdk({ subagents: [...builtinSubagents], ... })`（要保留舊行為得自己傳）
  - 影響範圍：依賴內建 subagent 自動存在的專案
- `@mastra/playground-ui` 的 `TracesExplorer` 排序 API 改成單一 `{ field, direction }` 物件：
  - 舊：`<TracesExplorer sortDirection={dir} onSortDirectionChange={setDir} />`
  - 新：`<TracesExplorer sort={{ field: 'startedAt', direction: dir }} onSortChange={setSort} />`
  - 影響範圍：自訂 playground UI 並直接呼叫這組排序 props 的專案

## 遷移指南

### 從 1.79.x 升級到 1.80.0

```bash
npm install @mastra/core@1.80.0
```

```ts
// 既有的全域共用連線路徑不受影響，1.80.0 之前的程式碼照常運作
const result = await agent.generate(prompt, { tools });

// 新增：讓每個終端使用者各自授權自己的帳號（非取代，是多一個選項）
const result = await agent.generate(prompt, {
  tools: tools({ resourceId: user.id }),
});

// 開出使用者自行連線的路由
app.use('/connect', userConnectRoutes());
```

四項 breaking changes 裡，`queryTraceThreads()` 和 `connectUrl → launchUrl` 的改動最容易在既有程式碼裡悄悄壞掉（型別不會報錯，執行期才會發現欄位是 `undefined`），升級後建議先全文搜尋這兩個呼叫點。

## 與其他框架的對比觀察

同一週（10/27–10/29）Agno 在 v3.1.12 把 Claude／Codex 的權限請求接進 AgentOS 的 Approval UI，做的是「每一次工具呼叫要不要執行」的同意機制；Mastra 這版做的是「這個連線要代表哪個使用者」的授權隔離，兩者解決的不是同一層問題，但方向一致：都是把原本靠應用層自己把關的授權邏輯，收進框架本身當一等公民處理。對照之下，同週 crewAI v1.15.33 仍停留在加 CLI 指令（技能搜尋、flow 參數傳遞）的層次,還沒碰到這類授權模型的問題。

## 今日收穫

之前以為多租戶 agent 產品的「使用者隔離」主要是資料庫層級的事（每個使用者的 session、記錄分開存），看到 Mastra 把這個隔離往上提到 OAuth 連線本身、而且是伺服器端硬性拒絕跨使用者誤用,才意識到：如果 agent 要代表使用者操作第三方服務,隔離如果只做在資料庫,拿到別人帳號授權的風險完全沒有被擋住——連線本身要跟使用者身分綁死,才是這類產品真正的安全邊界。

## 參考資料

- [Mastra @mastra/core@1.80.0 Release Notes](https://github.com/mastra-ai/mastra/releases/tag/@mastra/core@1.80.0)
- [mastra-ai/mastra GitHub](https://github.com/mastra-ai/mastra)
- [@mastra/core CHANGELOG.md](https://github.com/mastra-ai/mastra/blob/@mastra/core@1.80.0/packages/core/CHANGELOG.md)
- [AI Agent GitHub Digest 2026-10-30（候選列表）](/posts/daily/2026-10-30-ai-agent-github-digest)
