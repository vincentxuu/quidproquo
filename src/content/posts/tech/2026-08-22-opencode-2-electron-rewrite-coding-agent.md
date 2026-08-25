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
tldr: "Opencode 2 是 Anomaly（Dax Raad）主導的大重寫。runtime 從 Bun 換成 Node.js（記憶體問題）、桌面從 Tauri 換成 Electron（WebKit 效能與 Node 整合）、v1 API 刻意不相容。新增多分頁並行 session、持久化後端服務、HTTP API + SDK。目前 beta，預估 2026 年 9 月 stable。約 200K stars。"
description: "Opencode 2 從 Bun/Tauri 遷移到 Node.js/Electron 的技術原因、API 重新設計的三個斷裂點、多分頁並行 session 架構、跨工具 skill 可攜性，以及 beta 階段的風險。"
draft: false
---

> 🌏 [English version](/posts/tech/2026-08-22-opencode-2-electron-rewrite-coding-agent-en)

[三月那篇](/posts/tech/2026-03-31-opencode-ai-terminal-coding-agent)寫 opencode 的結論是：它是用 TypeScript 做的全功能 coding agent，雙 agent 模式（Build / Plan），75+ 模型支援，MIT 授權。

Opencode 2 把那些技術選擇全部推翻了。

2026 年 8 月，[Anomaly](https://anomaly.co/)（Dax Raad 的公司）發布 opencode 2 beta。這不是 v1.x 的自然演進——它是一次刻意的 breaking change，三個基礎層同時替換。npm 安裝名改成 `@opencode-ai/cli@beta`，binary 名從 `opencode` 改成 `opencode2`。repo 在 [anomalyco/opencode](https://github.com/anomalyco/opencode)，約 200,000 stars，依然 MIT。

## 為什麼要重寫

### Bun → Node.js

Opencode v1 用 Bun 做 runtime。Bun 的賣點是啟動快和內建的 bundler/test runner，但 v1 在生產環境碰到的問題是**記憶體**。

Bun 的 GC 行為跟 V8 不同——在長跑的 agent session 裡，記憶體使用量會逐步攀升，而且 `Bun.gc()` 的時機不可預測。當一個 session 開了幾百輪工具呼叫之後，v1 的 RSS 可以飆到 2-3 GB。Node.js 的 V8 GC 在同樣的工作負載下表現更穩定，而且 Node.js 的生態系——特別是 native addon 和 debug 工具——成熟度高一個量級。

啟動速度的差距確實存在（Bun 大約快 100-200ms），但 opencode 的 v2 架構有 **persistent backend service**（下面會講），agent 不會頻繁冷啟動，所以啟動速度不再是瓶頸。

### Tauri → Electron

Opencode v1 的桌面版用 Tauri。Tauri 的賣點是小 binary 和 Rust 後端，但 v1 碰到的問題是 **WebKit**。

Tauri 在 Linux 上用 WebKitGTK，在 macOS 上用 WKWebView。這兩個引擎跟 Chromium 的 DevTools 支援不在同一個等級，而且 WebKitGTK 在 Linux 上的效能一直有問題——複雜 UI 的渲染和滾動常常卡頓。更實際的是 Node.js 整合：v2 的後端已經全部是 Node.js，Tauri 的 Rust 後端變成多餘的中間層。

Electron 的缺點（binary 大、記憶體佔用高）確實存在，但對一個本來就要跑 LLM client 的桌面應用來說，Electron 額外佔的 100-200 MB 相對於整個 session 的記憶體使用量不是主要問題。

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

### 3. HTTP API + SDK

v2 公開了一組 HTTP API，加上一個 TypeScript SDK。你可以用 SDK 從自己的程式控制 opencode——開 session、送指令、讀回傳。

這讓 opencode 可以被當成 building block 嵌進其他工具。之前你要整合 opencode，只能 fork 它或 shell out 到它的 CLI；現在你可以 `import { OpenCode } from '@opencode-ai/sdk'` 然後 programmatically 操作。

## 跨工具 Skill 可攜性

Opencode 2 做了一個跟生態系有關的決定：**讀取 `.claude/skills/` 目錄**。

這意味著你為 Claude Code 寫的 skill 檔案，opencode 2 會自動載入並嘗試理解。不是完美相容——Claude Code 的 skill 格式有些 opencode 不支援的欄位——但核心的「一份 markdown 指引 agent 行為」部分是可攜的。

反過來，opencode 2 自己的 skill 也存在 `.opencode/skills/`，格式幾乎一樣。這等於在說：**skill 應該是跨工具的資產，不是某個 agent 的私有格式**。

在 2026 下半年各 coding agent 競爭白熱化的背景下，這個選擇很聰明——降低 switching cost，讓使用者不用因為換工具就重寫所有的 agent 指引。

## 安裝與現狀

```bash
# npm 安裝 beta
npm install -g @opencode-ai/cli@beta

# 或直接下載 binary
# binary 名稱是 opencode2，跟 v1 的 opencode 不衝突
```

目前狀態：

- **beta**，不建議用在 production
- v1 和 v2 可以並存安裝（不同 binary 名、不同 npm package）
- 預估 stable 時程：**2026 年 9 月**
- 已知問題：Electron 桌面版在某些 Linux 發行版上有 GPU 加速衝突

## 風險

**beta 就是 beta**。API 還在變動，SDK 的型別定義可能改。如果你現在用 SDK 蓋東西，要有被 break 的心理準備。

**Electron 的包袱**。Electron 的 binary 大（~150 MB）和 idle 記憶體佔用（~200 MB）是已知問題。對「我只想要一個 CLI agent」的使用者來說，這些 overhead 沒有意義。v2 的 CLI 模式不需要 Electron，但如果你想用桌面版的 multi-tab，就得接受它。

**v1 → v2 沒有遷移路徑**。v2 的 session 格式跟 v1 不相容，沒有匯入工具。你在 v1 累積的 session 歷史不會自動帶進 v2。

**Anomaly 的商業模式**。Opencode 是 MIT 的，但 Anomaly 是一家公司。opencode 的可持續性取決於 Anomaly 能不能從 opencode 或相關產品賺到錢。目前沒有付費版或 cloud hosting 的跡象，但長期不能排除。

## 跟其他 Coding Agent 的對照

| | Opencode 2 | Claude Code | Pi v2 | dsh |
|---|---|---|---|---|
| Runtime | Node.js | Node.js | Node.js | Node.js |
| 桌面 | Electron | 無（IDE 整合） | 無 | Web UI |
| 並行 session | Multi-tab | 單 session | 單 session | 單 session |
| 後端架構 | Persistent service + HTTP API | 程序內 | Unix socket | Web server |
| SDK | TypeScript SDK | Extension API | AgentHarness v2 | Cordis plugin |
| Skill 可攜 | 讀 .claude/skills/ | 原生 | Extensions | Plugin |

Opencode 2 跟其他 agent 最大的差異是**並行 session + 持久化後端**的組合。Claude Code 一次只能一個 session，Pi 也是；opencode 2 讓你同時開多個。

## 整體來說

Opencode 2 的重寫不是技術追求，是解決 v1 的實際問題——Bun 的記憶體、Tauri 的 WebKit、不可程式化的 API。每個替換都有明確的原因，每個原因都可以驗證。

multi-tab 並行 session 和持久化後端是真正的功能跳躍——這讓 opencode 從「一個 CLI 工具」變成「一個可以跑在背景的 agent 服務」。跨工具 skill 可攜性則是一個生態系層面的聰明選擇。

但 beta 就是 beta。API 會變、Electron 有包袱、v1 session 帶不過來。如果你現在需要穩定的 coding agent，v1 或 Claude Code 仍然是更安全的選擇。如果你想要的是**多 session 並行、可程式化、有 SDK 可以整合的 coding agent**——而且願意承受 beta 的風險——opencode 2 是目前最接近這個方向的開源方案。

約 200,000 顆星和 Anomaly 的團隊規模說明它不是一個 side project。但星數和團隊不等於穩定度——等 9 月的 stable release 出來再看。

## 參考資料

- [anomalyco/opencode（GitHub）](https://github.com/anomalyco/opencode)
- [opencode.ai 官方網站](https://opencode.ai)
- [Anomaly（Dax Raad 的公司）](https://anomaly.co/)
- [@opencode-ai/cli（npm）](https://www.npmjs.com/package/@opencode-ai/cli)
- 站內：[Opencode：開源 AI Terminal Coding Agent](/posts/tech/2026-03-31-opencode-ai-terminal-coding-agent)
- 站內：[從 Prompt 到 Harness：AI 工程的三次演化](/posts/ai/2026-03-28-harness-engineering-evolution)
- 站內：[模型只是元件，harness 才是系統](/posts/ai/2026-08-10-model-component-harness-system)
