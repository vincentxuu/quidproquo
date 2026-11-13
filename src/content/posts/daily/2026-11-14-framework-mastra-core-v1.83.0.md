---
title: "框架更新｜Mastra @mastra/core v1.83.0"
date: 2026-11-14
category: daily
type: digest
tags: [ai-agent, framework, daily, mastra]
lang: zh-TW
description: "Mastra @mastra/core v1.83.0 讓每個 Agent 都能發出可重連的 resumable stream，並內建 MCP 伺服器在 /api/mcp，但也把 durable 選項拆成「串流重連」和「可崩潰復原的持久執行」兩件事"
tldr: "Mastra @mastra/core v1.83.0 三個重點：(1) 每個 Agent（不只是 durable agent）都能發出可重連的 resumable stream，agent.observe(runId) 讓另一個 reader 跟著看、也能中止；(2) @mastra/server 內建 MCP 伺服器在 /api/mcp，不用自己定義 MCPServer，支援 OAuth discovery；(3) Breaking：Agent 的 durable 選項現在只控制串流重連，不再等於可崩潰復原的持久執行，後者要改用 createDurableAgent()。"
series:
  name: "AI Framework Changelog"
  order: 66
---

> 🌏 [English version](/posts/daily/2026-11-14-framework-mastra-core-v1.83.0-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Mastra（`@mastra/core`） |
| 版本 | @mastra/core@1.83.0 |
| 前一版 | @mastra/core@1.80.0 |
| 發布日 | 2026-11-12 |
| Release Notes | [Release November 12, 2026](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.83.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 29.5k |

## 這個版本為什麼重要

這版把兩件原本綁在同一個開關上的事情拆開了。以前 `Agent` 的 `durable: true` 同時代表「串流可以斷線重連」和「執行狀態可以在 process 崩潰後從 checkpoint 復原」，這兩件事聽起來像同一回事,但其實是不同層級的保證。1.83.0 把「可重連的 resumable stream」做成所有 Agent 的預設能力,不管有沒有開 durable——`agent.observe(runId)` 讓任何一個 reader 都能跟著看一個正在跑的 run,也能用 `observe().abort()` 把它停掉。但「崩潰後從 checkpoint 復原」這件事被收回去,`durable` 選項現在不再保證這個,要復原執行狀態得改用 `createDurableAgent({ agent })`。另一個值得關注的變更是內建 MCP 伺服器:以前要把 agent 開放給 MCP client 呼叫,得自己定義一個 `MCPServer`;現在 `@mastra/server` 直接在 `/api/mcp` 開一個端點,只要設定 `server.auth` 就預設啟用,還支援 OAuth discovery 和 audience 檢查。對正在把 agent 接進 Claude、ChatGPT 或其他 MCP client 的團隊,這等於省掉一層手動接線。

```diagram
title: Mastra v1.83.0：MCP 曝露方式的前後對照
desc: 1.83.0 之前要手動定義 MCPServer 才能讓 agent 被 MCP client 呼叫；1.83.0 之後 @mastra/server 內建 /api/mcp 端點，設定 server.auth 就預設開啟。
caption: 簡化示意：省略既有的手動 MCPServer 路徑（1.83.0 之前就有，這版並非移除它，只是多了一個不用手動接線的選項）。
---
<svg viewBox="0 0 640 400">
  <path class="dg-line" d="M160 100V160" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M160 220V280" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M480 100V160" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M480 220V280" marker-end="url(#arrow)"/>

  <text class="dg-sub" x="160" y="30" text-anchor="middle" dominant-baseline="central">之前</text>
  <rect class="dg-box dg-box--ghost" x="20" y="44" width="280" height="56" rx="6"/>
  <text class="dg-label" x="160" y="64" text-anchor="middle" dominant-baseline="central">自己手動定義 MCPServer</text>
  <text class="dg-sub" x="160" y="84" text-anchor="middle" dominant-baseline="central">逐一註冊要曝露的 tools/agents</text>

  <rect class="dg-box dg-box--ghost" x="20" y="164" width="280" height="56" rx="6"/>
  <text class="dg-label" x="160" y="184" text-anchor="middle" dominant-baseline="central">自架 MCP 端點路由</text>
  <text class="dg-sub" x="160" y="204" text-anchor="middle" dominant-baseline="central">OAuth／權限檢查自己接</text>

  <rect class="dg-box dg-box--ghost" x="20" y="284" width="280" height="56" rx="6"/>
  <text class="dg-label" x="160" y="304" text-anchor="middle" dominant-baseline="central">MCP client 呼叫 agent/tool</text>

  <text class="dg-sub" x="480" y="30" text-anchor="middle" dominant-baseline="central">1.83.0 之後</text>
  <rect class="dg-box" x="340" y="44" width="280" height="56" rx="6"/>
  <text class="dg-label" x="480" y="64" text-anchor="middle" dominant-baseline="central">設定 server.auth</text>
  <text class="dg-sub" x="480" y="84" text-anchor="middle" dominant-baseline="central">內建 MCP 端點預設開啟</text>

  <rect class="dg-box" x="340" y="164" width="280" height="56" rx="6"/>
  <text class="dg-label" x="480" y="184" text-anchor="middle" dominant-baseline="central">GET /api/mcp</text>
  <text class="dg-sub" x="480" y="204" text-anchor="middle" dominant-baseline="central">server.mcp.oauth 處理 discovery／audience</text>

  <rect class="dg-box" x="340" y="284" width="280" height="56" rx="6"/>
  <text class="dg-label" x="480" y="304" text-anchor="middle" dominant-baseline="central">MCP client 呼叫 agent/tool</text>
</svg>
```

## 重要變更

- **Resumable Agent streams（所有 Agent 預設能力）**：每個 `Agent` 都能發出帶 replay cache 的可重連 run stream，`agent.observe(runId)`／`observe().abort()`／`agent.abortRunStream(runId)` 讓任何一個 reader 跨 instance 觀察或中止一個 run，並有 ownership／TTL 限制 → 客戶端斷線重連不會預設把整個 run 殺掉，多個前端或背景 worker 可以共同追蹤同一個 run
- **內建 MCP 伺服器（`/api/mcp`）**：`@mastra/server` 內建 MCP 端點，設定 `server.auth` 就預設啟用，不用自己定義 `MCPServer`，加上 `server.mcp.oauth`（`resource`／`requireAudience`／`authorizationServers`／`scopesSupported`）處理 OAuth discovery 和 token audience 檢查，還有新的自我檢查路由 `GET /api/mcp/builtin` → 把 agent／workflow／tool 開放給 MCP client 少一層手動接線
- **Workflow Storage Version 2 擴大支援範圍**：實驗性的 `storageVersion: 2`（只寫每一步的差異，不整個 run 重寫）現在支援 `@mastra/pg` 和 `@mastra/libsql`，查詢結果可以用非同步的 `steps()` 延遲載入步驟歷史 → 長流程 workflow 的儲存寫入量明顯降低,且不限於記憶體儲存
- **Resumable AI SDK chat routes**：`chatRoute({ resumable: true })` 會自動產生一組 POST + reconnect GET 端點,透過 `agent.observe(runId)` 重放／跟隨正在執行的 run,還支援 `server.apiRoutes: [routes]` 明確設定路由陣列 → 前端用 AI SDK 的 `useChat({ resume: true })` 可以直接接上,使用者重新整理頁面不會打斷正在跑的回覆
- **一次性與有界排程**：排程現在支援一次性執行（`runAt`）和有界的週期執行（`endAt`），`cron` 改為可選,橫跨 server／client／多個儲存後端都更新了型別 → 不用再自己寫「跑完一次就把 cron 關掉」的收尾邏輯

## Breaking Changes

有，一項：

- `Agent` 的 `durable` 選項現在只控制**串流重連**,不再等同於「可崩潰復原的持久執行（checkpoint-backed durable execution）」：
  - 舊：`new Agent({ ..., durable: true })` 同時拿到串流重連 + 崩潰後從 checkpoint 復原
  - 新：`new Agent({ ..., durable: true })` 只拿到串流重連；要崩潰復原要改用 `createDurableAgent({ agent })`
  - 影響範圍：所有依賴 plain `Agent` 的 `durable: true` 做崩潰後復原的專案，也要注意開了 resumable streams 之後，plain agent 在斷線時的行為跟以前不一樣

## 遷移指南

### 從 1.80.x 升級到 1.83.0

```bash
npm install @mastra/core@1.83.0
```

```ts
// 舊寫法（1.80.x 之前）：durable: true 同時給串流重連與崩潰復原
const agent = new Agent({
  name: 'support-agent',
  durable: true, // 以為兩種保證都有
  instructions: '...',
});

// 新寫法（1.83.0）：串流重連是預設能力，不用特別開
const agent = new Agent({
  name: 'support-agent',
  instructions: '...',
});
// 需要崩潰後從 checkpoint 復原，改用 createDurableAgent
const durableAgent = createDurableAgent({ agent });
```

升級後先確認專案裡所有 `durable: true` 的 `Agent` 是不是真的需要「崩潰復原」,如果只是想要客戶端斷線重連,其實已經不用設這個選項了;反過來,如果真的依賴崩潰復原（例如背景跑很久的任務）,沒有補上 `createDurableAgent()` 會在下次 process 重啟時悄悄失去復原能力。

## 與其他框架的對比觀察

巧的是,昨天（11/12）覆蓋過的 Agno v3.2.0 也在處理很像的問題:它把 sandboxed agent 的跨 replica 取消／復原邏輯從 Redis 改成「Postgres + 共享 checkpoint store」。兩個框架都在往「執行狀態要能跨 instance／跨重啟復原」這個方向補強,但切入點不同——Agno 解決的是 sandbox 執行環境本身的復原,Mastra 這版解決的是「誰可以觀察/中止一個正在跑的 run」加上「串流重連」這兩層,並且刻意把它跟「崩潰復原」拆開成兩個選項。對比起來,Mastra 這次的拆分某種程度上是把問題定義得更細,而不是直接做大一統的持久執行方案。

## 今日收穫

之前以為「resumable」是單一概念——能重連就是能重連,崩潰復原不過是重連的一種延伸情境。看到 Mastra 把 `durable` 選項拆成「串流重連」和「崩潰後從 checkpoint 復原」兩個獨立保證,才意識到這其實是兩層完全不同的問題：串流重連只要伺服器端還記得 run 的狀態就能做到,是連線層的事;崩潰復原則需要執行狀態本身被持久化到 checkpoint,是執行引擎層的事。把兩者綁在同一個布林值上,出事的時候反而讓人搞不清楚自己到底拿到了哪種保證——這也是為什麼這版願意為此犧牲向後相容,直接把 API 拆開。

## 參考資料

- [Mastra Release November 12, 2026（@mastra/core@1.83.0）](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.83.0)
- [mastra-ai/mastra GitHub](https://github.com/mastra-ai/mastra)
- [@mastra/core CHANGELOG.md](https://github.com/mastra-ai/mastra/blob/@mastra/core@1.83.0/packages/core/CHANGELOG.md)
- [框架更新｜Agno v3.2.0](/posts/daily/2026-11-13-framework-agno-v3.2.0)
