---
title: "框架更新｜Mastra @mastra/core@1.62.0"
date: 2026-08-27
category: daily
type: digest
tags: [ai-agent, framework, daily, mastra]
lang: zh-TW
description: "Mastra 1.62 把桌面操作（screenshot／滑鼠／鍵盤）做成 workspace 的第 12 種工具，同時補上 Elasticsearch／Valkey storage backend，但也帶了 7 個 breaking changes"
tldr: "Mastra @mastra/core@1.62.0 三個重點：(1) 新增 Computer-Use Sandboxes，透過 Daytona／E2B Desktop provider 讓 agent 操作虛擬桌面（screenshot、點擊、打字、捲動等 11 個工具）；(2) 新增 `@mastra/elasticsearch` 和 `@mastra/valkey`／`@mastra/valkey-streams` storage backend，擴大生產環境儲存選項；(3) 7 個 breaking changes，包含 background task storage 拿掉 Cloudflare KV／ClickHouse 支援、`DaytonaSandbox` command 結果格式改變、`agent.stream()` 拿掉 `persistPartialOnAbort` 選項。"
series:
  name: "AI Framework Changelog"
  order: 7
---

> 🌏 [English version](/en/posts/daily/2026-08-27-framework-mastra-1.62.0)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | Mastra |
| 版本 | `@mastra/core@1.62.0` |
| 前一版 | `@mastra/core@1.61.0` |
| 發布日 | 2026-08-26 |
| Release Notes | [GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.62.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 27.5k |

## 這個版本為什麼重要

Mastra 1.62 最大的變化是把「桌面操作」變成 workspace 的原生能力。以前 Mastra 的 sandbox 只能執行 code 或 shell 指令，這版透過 Daytona 和新增的 E2B Desktop provider，讓 sandbox 可以額外宣告一個 `SandboxComputer` capability——agent 因此多出 screenshot、點擊、雙擊、右鍵、拖曳、打字、按鍵、捲動、讀取螢幕資訊、等待共 11 個工具，可以直接操作一個有畫面的虛擬桌面環境。這是目前 agent framework 圈子在補的一塊：光有 code sandbox 不夠用，很多任務（測試網頁 UI、操作沒有 API 的舊系統）還是得靠「看畫面、動滑鼠」。同一版也補上 `@mastra/elasticsearch` 和 `@mastra/valkey` 兩個新的 storage backend，讓 memory／workflow snapshot／semantic recall 在正式環境的儲存選項更多。但這版也是近期 breaking changes 數量最多的一次，尤其是 background task storage 直接拿掉 Cloudflare KV 和 ClickHouse 支援，用這兩種後端的專案升級前要先確認替代方案。

## 重要變更

- **Computer-Use Sandboxes（`SandboxComputer` capability）**：workspace sandbox 新增可選的桌面控制能力，經 Daytona 或新增的 `@mastra/e2b-desktop` provider 暴露 11 個 `mastra_workspace_computer_*` 工具（screenshot／click／double-click／right-click／move／drag／type／press key／scroll／get screen info／wait）→ agent 可以直接操作虛擬桌面，不再只能跑 code／shell；screenshot 會以原生 media 格式直接回傳給模型
- **新增 storage backend**：`@mastra/elasticsearch` 支援 memory、workflow snapshot、scores、semantic recall；`@mastra/valkey`／`@mastra/valkey-streams` 提供 GLIDE-backed storage，含 PubSub／lease 支援 → 正式環境的儲存選項再擴大一輪
- **Sandbox 生命週期管理**：新增 `getEnv()`／`setEnv()` 管理 sandbox 內的 runtime 環境變數；`Mastra.shutdown()` 改為 suspend 遠端 sandbox 而非直接 destroy；`Workspace.stop()` 支援 suspend／resume，不必整個 teardown 重建 → 減少長時間跑 agent 時因為誤殺 sandbox 而丟失狀態的風險
- **Observability／Scoring 強化**：Scorer 加入 declarative eligibility filters 和跟 trace 決策綁定的 deterministic sampling；`PostgresStoreVNext` 現在會在 Studio 顯示 in-progress traces；`span.endTree()` 可以強制關閉整個 span tree → 對長時間執行、trace 量大的 agent 更好除錯
- **Streaming／Session UX**：`@mastra/ai-sdk` 新增 `withSseHeartbeat()`，讓長推理過程中 SSE 連線不會被中間層 timeout 掐斷；`AgentController#generateThreadTitle()` 可以在不初始化整個 session 的情況下，直接生成 thread 標題 → 適合「先列標題、需要時才展開完整 session」的 UI 場景

## Breaking Changes

- Mastra Code LSP 現在改成 opt-in，需要在設定裡明確加 `"lsp": true`
  - 影響範圍：使用 Mastra Code 編輯器整合功能的專案
- `MarkdownRenderer` 不再逐字（word-by-word）呈現串流文字，改用 `useRevealedText`
  - 影響範圍：直接嵌入 `@mastra/playground-ui` markdown 渲染元件的專案
- CSS class `mastra-markdown-arriving` 改名為 `mastra-arriving`
  - 影響範圍：依賴該 class 名稱做自訂樣式的專案
- `SankeySignals` 現在要求受控的 `selectedFrameId` 與 `onFrameIdChange` props
  - 影響範圍：使用 playground-ui Sankey 視覺化元件的專案
- Background task storage 不再由 Cloudflare KV 或 ClickHouse 暴露
  - 影響範圍：用這兩種 storage 跑 background task 的專案
- `DaytonaSandbox` command 執行結果格式改變：拿掉 `args` 欄位，`command` 改成包含完整字串
  - 影響範圍：直接解析 Daytona sandbox command 輸出結構的程式碼
- `agent.stream()` 拿掉 `persistPartialOnAbort` 選項，中斷的執行現在會自動保留歷史
  - 影響範圍：曾經手動設定這個選項來控制中斷行為的程式碼

## 遷移指南

### 從 1.61.x 升級到 1.62.0

```bash
# Step 1: 更新依賴
pnpm add @mastra/core@1.62.0
```

```typescript
// Step 2a: 若使用 Mastra Code LSP，需要明確開啟
export default defineConfig({
  lsp: true, // 1.62.0 起改為 opt-in，不再預設啟用
})
```

```typescript
// Step 2b: DaytonaSandbox command 結果解析要跟著調整
// 舊寫法（1.61.x）
const { command, args } = result

// 新寫法（1.62.0）— args 已移除，command 是完整字串
const { command } = result
```

若專案用 Cloudflare KV 或 ClickHouse 存 background task，升級前要先換成其他支援的 storage backend；用了 `agent.stream()` 的 `persistPartialOnAbort` 選項可以直接刪掉，中斷行為現在預設保留歷史，行為不會變差。其餘 UI 相關的 breaking changes（LSP opt-in、`MarkdownRenderer`、CSS class 改名、`SankeySignals`）只影響直接嵌入 `@mastra/playground-ui` 元件的專案，一般只呼叫 `@mastra/core` API 的程式碼不受影響。

## 與其他框架的對比觀察

Computer-use 這塊，Mastra 選擇透過既有的 sandbox provider 抽象（Daytona、E2B Desktop）疊加 `SandboxComputer` capability，跟 Anthropic 自家的 Computer Use API、OpenAI 的 Operator 走的是不同層次——那兩者是模型直接支援螢幕操作，Mastra 則是在 agent framework 層把「桌面控制」變成第 12 種 workspace tool，好處是同一套 agent 定義能在有／沒有桌面能力的環境間切換，只要換 sandbox provider，approval／tracing／screenshot-after-action 這些治理機制都沿用既有的 workspace tool 框架，不用為 computer use 另開一套規則。搭配這版新增的 Elasticsearch／Valkey storage，Mastra 在「生產可部署的 TypeScript agent 框架」這個定位上，補齊速度明顯比同語言的競品快，但也代表接下來每次升級都得認真讀 breaking changes——這版一次七個，已經不算少。

## 今日收穫

之前以為「computer use」是模型層的能力——screenshot 進去、座標出來，模型自己學會操作螢幕。這次看到 Mastra 把它做成 workspace tool 層的 capability 才意識到，框架層其實可以用同一套 approval／tracing／screenshot-after-action 機制，把 computer use 和其他 workspace 工具（read_file、shell command）用同一套治理邏輯管起來——安全控制不必因為工具類型不同而重寫一遍，這是把「新能力」和「既有治理框架」解耦的好例子。

## 參考資料

- [Mastra @mastra/core@1.62.0 — GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.62.0)
- [mastra-ai/mastra — GitHub](https://github.com/mastra-ai/mastra)
- [Mastra Sandbox Overview — Computer-use tools](https://mastra.ai/docs/sandbox/overview)
- [Mastra @mastra/core@1.61.0 — GitHub Release（前一版）](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.61.0)
