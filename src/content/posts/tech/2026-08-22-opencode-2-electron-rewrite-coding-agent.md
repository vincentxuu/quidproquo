---
title: "Opencode 2：Bun 換 Node、Tauri 換 Electron、API 全部打掉重練的代價"
date: 2026-08-22
category: tech
type: deep-dive
tags: [opencode, coding-agent, cli, open-source, ai-tools, harness-engineering, electron]
lang: zh-TW
series:
  name: "Agent CLI 選型指南"
  order: 25
tldr: "Opencode 2 是 Anomaly（Dax Raad）主導的大重寫。runtime 從 Bun 換成 Node.js（記憶體問題）、桌面從 Tauri 換成 Electron（WebKit 效能與 Node 整合）、v1 API 刻意不相容。新增多分頁並行 session、持久化後端服務、HTTP API 與 CLI 整合。目前 CLI 安裝套件為 @opencode/cli，執行指令仍是 opencode；可直接選用內建免費模型，另有 Console 與 Go 付費選項。"
description: "Opencode 2 從 Bun/Tauri 遷移到 Node.js/Electron 的技術原因、API 重新設計的三個斷裂點、多分頁並行 session 架構、跨工具 skill 可攜性，以及安裝、免費模型與遷移時的取捨。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-opencode-2-electron-rewrite-coding-agent-en)

[三月那篇](/posts/tech/2026-03-31-opencode-ai-terminal-coding-agent)寫 opencode 的結論是：它是用 TypeScript 做的全功能 coding agent，雙 agent 模式（Build / Plan），75+ 模型支援，MIT 授權。

OpenCode 2 改動的是 runtime、桌面外殼與後端架構，開源與多模型的方向則繼續保留。

這篇聚焦 OpenCode 2 從 Bun／Tauri 轉向 Node.js／Electron，以及持久化後端帶來的整合方式。實際安裝要使用現在的 V2 入口：npm 套件是 `@opencode/cli`，執行指令是 `opencode`。V1 與 V2 的預設指令名稱相同，不能再沿用早期 beta 的 `opencode2` 並存安裝方式。
## 為什麼要重寫

### Bun → Node.js

Opencode v1 用 Bun 做 runtime。Bun 的賣點是啟動快和內建的 bundler/test runner，但 v1 在生產環境碰到的問題是**記憶體**。

對長時間執行、持續讀檔與呼叫工具的 agent，runtime 的取捨不只在啟動速度，還包括記憶體回收、除錯方式與套件相容性。Node.js 的 V8 與既有 native addon 生態，讓這些維運選擇有一套不同於 Bun 的工具。

V2 又把服務留在背景，減少前端每次開啟時重新啟動後端的需求。因此，評估時更值得觀察長時間 session 的穩定性，而不是只比較一次冷啟動。

### Tauri → Electron

Opencode v1 的桌面版用 Tauri。Tauri 的賣點是小 binary 和 Rust 後端，但 v1 碰到的問題是 **WebKit**。

Tauri 在 Linux 上用 WebKitGTK，在 macOS 上用 WKWebView。這兩個引擎跟 Chromium 的 DevTools 支援不在同一個等級，而且 WebKitGTK 在 Linux 上的效能一直有問題——複雜 UI 的渲染和滾動常常卡頓。更實際的是 Node.js 整合：v2 的後端已經全部是 Node.js，Tauri 的 Rust 後端變成多餘的中間層。

Electron 的缺點是較大的下載與記憶體成本。是否值得，取決於你是否需要桌面介面和它的整合能力；只用 CLI 的讀者不必承擔整個桌面外殼。

## API 重新設計：三個斷裂點

v2 的 API 跟 v1 **刻意不相容**。不是「改了幾個方法名」那種不相容，是「整個模型重新設計」。

### 1. Session 模型

v1 的 session 是一條線性的訊息陣列。v2 支援 **multi-tab parallel sessions**——一個 opencode 實例可以同時跑多個 session，每個 session 在自己的 tab 裡，共享同一個 workspace context 但 agent state 獨立。

這解決的是 v1 最常被抱怨的問題：你在跟 agent 做一件事的時候，另一件事只能等。v2 讓你同時跟不同的 agent 對話，而且因為 workspace context 共享，一個 tab 裡改的檔案在另一個 tab 裡立刻可見。

### 2. 持久化後端服務

v1 是前端驅動的——每次開 opencode 就是一個新的程序，關掉就沒了。v2 有一個 **persistent backend service** 跑在背景：

- Agent loop 在後端跑，前端（TUI 或 Electron）只是 client
- 關掉 UI 再打開，session 還在
- 多個 client 可以同時連上同一個後端

這個架構跟 Pi v2 的方向類似（都在做 session 持久化和遠端存取），但實作路徑不同——Pi 用 CBOR + Unix socket，opencode 2 用 **HTTP API**。

### 3. HTTP API 與指令整合

持久化服務也讓 OpenCode 能被其他程式控制。V2 提供 `opencode run` 送出非互動任務，以及 `opencode api` 呼叫伺服器 API；不必為了整合就 fork 整個專案。

```bash
opencode run "整理目前專案的待辦事項"
opencode api GET /api/session
```

第一條會送出模型任務並消耗所選模型的用量；第二條讀取伺服器的 session 清單。HTTP API 目前標為實驗性介面；若要寫自己的 client，應依目前的 [V2 API 文件](https://opencode.ai/v2/docs/api)實作，不要直接沿用早期 beta 的 SDK 套件名稱或匯入範例。

## 跨工具 Skill 可攜性

Opencode 2 做了一個跟生態系有關的決定：**讀取 `.claude/skills/` 目錄**。

這意味著你為 Claude Code 寫的 skill 檔案，opencode 2 會自動載入並嘗試理解。不是完美相容——Claude Code 的 skill 格式有些 opencode 不支援的欄位——但核心的「一份 markdown 指引 agent 行為」部分是可攜的。

反過來，opencode 2 自己的 skill 也存在 `.opencode/skills/`，格式幾乎一樣。這等於在說：**skill 應該是跨工具的資產，不是某個 agent 的私有格式**。

在 2026 下半年各 coding agent 競爭白熱化的背景下，這個選擇很聰明——降低 switching cost，讓使用者不用因為換工具就重寫所有的 agent 指引。

## 安裝與免費模型

macOS／Linux 可使用官方 npm 套件：

```bash
npm install -g @opencode/cli
opencode --version
opencode
```

先確認顯示的是 `2.x`。V1 與 V2 都使用 `opencode`，舊的執行檔可能仍排在 PATH 前面；Windows 則從 [V2 官方入口](https://opencode.ai/v2/docs)下載對應架構的 CLI。

進入 OpenCode 後，輸入 `/models`，可以先選內建免費模型。以 Big Pickle 為例，完整 ID 是 `opencode/big-pickle`，官方模型表的 Input 與 Output 都列為 Free。選模型時要對照 [Console 模型表](https://opencode.ai/v2/docs/console/models)，不能把「工具開源」當成「所有模型都免費」。

免費模型有用量限制，部分只限時提供；不需要為了第一次試用先購買 Go 或儲值。想改接 OpenRouter 等供應商，再透過 `/connect` 設定；兩條路可以分開選。

## 風險

**介面與整合要對版本。** CLI、設定欄位與 API 應以目前 V2 文件為準。把早期 beta 的套件、指令和現在的設定混在一起，比單純升級版本更容易出問題。

**Electron 的取捨。** 桌面應用程式增加了下載與記憶體成本；只需要終端機的使用者可以選 CLI，不必為了使用免費模型安裝桌面版。

**歷史資料遷移要另外確認。** 更新執行檔、供應商設定與 session 歷史是不同的工作。升級前先保留舊資料，不要把「指令已能執行」當成歷史資料也已完整遷移。

**模型服務與資料政策。** OpenCode 本體開源，官方同時提供 Console 按用量計費與 Go 訂閱。內建免費模型也有各自的資料條款：例如 Big Pickle 免費期間收集的內容可能用於改善模型。涉及公司程式或私人資料時，先看模型的隱私條款，再決定是否送出。

## 跟其他 Coding Agent 的對照

| | Opencode 2 | Claude Code | Pi v2 | dsh |
|---|---|---|---|---|
| Runtime | Node.js | Node.js | Node.js | Node.js |
| 桌面 | Electron | 無（IDE 整合） | 無 | Web UI |
| 並行 session | Multi-tab | 單 session | 單 session | 單 session |
| 後端架構 | Persistent service + HTTP API | 程序內 | Unix socket | Web server |
| 整合入口 | HTTP API／CLI | Extension API | AgentHarness v2 | Cordis plugin |
| Skill 可攜 | 讀 .claude/skills/ | 原生 | Extensions | Plugin |

Opencode 2 跟其他 agent 最大的差異是**並行 session + 持久化後端**的組合。Claude Code 一次只能一個 session，Pi 也是；opencode 2 讓你同時開多個。

## 整體來說

OpenCode 2 的架構取捨可以分成三件事看：runtime 的維運方式、桌面渲染引擎，以及前端與後端之間的整合邊界。評估是否升級時，應把這些差異對應到自己的使用方式。

multi-tab 並行 session 和持久化後端是真正的功能跳躍——這讓 opencode 從「一個 CLI 工具」變成「一個可以跑在背景的 agent 服務」。跨工具 skill 可攜性則是一個生態系層面的聰明選擇。

如果你需要多個前端連接同一個後端，或想把 agent 接到自己的工作流程，持久化服務與 HTTP API 值得研究。如果只是想免費試用 AI，先用 CLI 選一個內建免費模型就夠了，再按需求增加桌面介面、外部供應商或程式整合。

從安裝、找免費模型到第一次生活提問，可以接著看[免費 LLM 入門教學：OpenCode 2 與 OpenRouter](/posts/ai/2026-11-01-free-llm-opencode2-openrouter)。

## 更新紀錄

- 2026-11-01：更新 V2 安裝套件與共用指令名稱，移除過期 beta／stable 時程與舊 SDK 匯入範例，補上內建免費模型、Console／Go 與資料政策。

## 參考資料

- [anomalyco/opencode（GitHub）](https://github.com/anomalyco/opencode)
- [opencode.ai 官方網站](https://opencode.ai)
- [Anomaly（Dax Raad 的公司）](https://anomaly.co/)
- [OpenCode 2 安裝與下載](https://opencode.ai/v2/docs)
- [OpenCode 2 CLI 與背景服務](https://opencode.ai/v2/docs/cli/)
- [OpenCode 2 CLI 指令](https://opencode.ai/v2/docs/cli/commands)
- [OpenCode 2 模型與隱私條款](https://opencode.ai/v2/docs/console/models)
- 站內：[Opencode：開源 AI Terminal Coding Agent](/posts/tech/2026-03-31-opencode-ai-terminal-coding-agent)
- 站內：[從 Prompt 到 Harness：AI 工程的三次演化](/posts/ai/2026-03-28-harness-engineering-evolution)
- 站內：[模型只是元件，harness 才是系統](/posts/ai/2026-08-10-model-component-harness-system)
