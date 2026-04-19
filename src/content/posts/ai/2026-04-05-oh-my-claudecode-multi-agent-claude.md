---
title: "oh-my-claudecode：把 Claude Code 變成多 Agent 協作平台的增強層"
date: 2026-04-05
category: ai
tags: [agent-cli, claude-code, oh-my-claudecode, multi-agent, tmux, orchestration, ultraworkers]
lang: zh-TW
tldr: "oh-my-claudecode（OMC）在 Claude Code 上加了 8 種協作模式、19 個專業 Agent、跨模型調度（Claude + Codex + Gemini），讓單人 CLI 工具變成多 Agent 開發平台。支援 Deep Interview 需求釐清、Smart Model Routing 省 30-50% token、rate limit 自動恢復。"
description: "介紹 oh-my-claudecode 的多 Agent 協作架構、8 種執行模式、跨 CLI 調度機制，以及它如何將 Claude Code 從單一 Agent 工具擴展為團隊級開發平台。"
draft: false
---

Claude Code 本身是一個強大的單 Agent CLI 工具。但當任務規模超過「一個 Agent 能處理的範圍」時，你需要協調多個 Agent、拆解任務、追蹤進度。oh-my-claudecode（OMC）就是為 Claude Code 加上這一層協調能力的增強工具。

## 產品定位

OMC 的口號是「Don't learn Claude Code. Just use OMC.」——它不是要取代 Claude Code，而是把 Claude Code 的操作抽象成自然語言指令和 magic keyword，讓開發者描述想要什麼，OMC 負責規劃、分派、執行、驗證和修復。

安裝方式有兩種：

```bash
# Claude Code marketplace 外掛（推薦）
/plugin marketplace add https://github.com/Yeachan-Heo/oh-my-claudecode
/plugin install oh-my-claudecode

# 或 npm 全域安裝
npm i -g oh-my-claude-sisyphus@latest
```

需要啟用 Claude Code 的實驗性 Agent Teams 功能：

```json
{ "env": { "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1" } }
```

## 八種執行模式

OMC 提供 8 種不同的執行模式，覆蓋從簡單任務到大型重構的各種場景：

| 模式 | 說明 | 適用場景 |
|------|------|---------|
| **Team** | 標準多 Agent 管線（plan → PRD → exec → verify → fix） | 中大型功能開發 |
| **CLI Team** | tmux 多 worker 並行 | 需要隔離環境的並行任務 |
| **CCG** | 三模型協作（Claude + Codex + Gemini） | 跨模型驗證 |
| **Autopilot** | 自動判斷模式和分派 | 不想手動選模式時 |
| **Ultrawork** | 最大化並行度 | 大型重構、多檔案變更 |
| **Ralph** | 持續 verify/fix 迴圈 | 需要反覆測試直到通過 |
| **Pipeline** | 嚴格循序執行 | 有嚴格依賴關係的任務 |
| **Ultrapilot** | 舊版模式（legacy） | 向後相容 |

最核心的是 **Team 模式**，它的執行管線是：

```
team-plan → team-prd → team-exec → team-verify → team-fix (loop)
```

這不是簡單的「把任務丟給多個 Agent」，而是有明確階段的工程流程：先做計畫、再寫需求文件、然後執行、執行完驗證、驗證失敗自動修復。

## 19 個專業 Agent

OMC 內建 19 個具名 Agent，每個有專屬的角色定義和 tier 變體：

- **Architecture Agent**：系統架構設計與技術決策
- **Research Agent**：技術調研和方案比較
- **Design Agent**：UI/UX 設計決策
- **Testing Agent**：測試策略和測試程式碼
- **Data Science Agent**：數據分析和 ML 相關任務
- ...以及更多專業角色

每個 Agent 可以有不同的 tier（例如 senior / junior），影響它被分配的模型等級和 token 預算。

## Smart Model Routing

OMC 不是所有任務都用最貴的模型。它實作了智慧路由：

| 任務複雜度 | 使用模型 | 效果 |
|-----------|---------|------|
| 簡單（查找、格式化） | Haiku | 快速、低成本 |
| 複雜（推理、架構） | Opus | 高品質輸出 |

根據專案文件，這個機制可以**節省 30-50% 的 token 消耗**。邏輯類似 Codex 的 GPT-5.4 / mini 自動路由，但 OMC 是在 Claude 模型家族內做分級。

## 跨 CLI 多模型協作

OMC 最野心的功能是**跨 CLI 調度**——它可以同時啟動 Claude Code、Codex CLI 和 Gemini CLI 的 worker：

```bash
# 啟動 3 個 Claude worker + 2 個 Codex worker
/team 3:claude 2:codex "review auth module for security issues"

# 或在 CLI 模式
omc team 2:codex "fix all TypeScript errors"
```

每個 worker 跑在獨立的 tmux pane 裡，互不干擾。這意味著你可以讓 Claude 寫核心邏輯、Codex 寫測試、Gemini 做前端，三個模型同時工作。

前提是你需要安裝對應的 CLI：

```bash
npm install -g @google/gemini-cli   # Gemini
npm install -g @openai/codex        # Codex
```

## Deep Interview

當需求模糊時，OMC 提供蘇格拉底式的需求訪談模式：

```
/deep-interview "I want to build a task management app"
```

它會用一系列結構化問題來釐清範圍、邊界條件、技術約束和預期產出，**在寫任何程式碼之前**確保方向正確。這個功能和 oh-my-codex 的 `$deep-interview` 同源，是 UltraWorkers 生態系共通的設計模式。

## Skills 系統

OMC 支援自訂 Skill——可攜式的 YAML / Markdown 檔案，當觸發條件匹配時自動注入 Agent 的 context：

```
.omc/skills/     # 專案級 Skill
~/.omc/skills/   # 全域 Skill
```

內建 Skill 包括 Playwright（瀏覽器自動化）和 Git Master（原子化 commit）。你可以根據團隊的工作流自訂更多 Skill。

## 通知與整合

| 管道 | 支援 |
|------|------|
| Telegram | 有 |
| Discord | 有 |
| Slack | 有 |
| Webhook | 有 |

通知支援 tag 和 session 摘要——一個 session 結束後，自動發送包含完成的任務、建立的 PR、花費的 token 等資訊的摘要。

### OpenClaw 整合

OMC 內建 OpenClaw bridge（`bridge.ts`），可以把 session 事件轉發到 OpenClaw gateway：

| Hook 事件 | 觸發時機 |
|-----------|----------|
| `session-start` | Session 啟動 |
| `session-stop` | Session 結束 |
| `keyword-detector` | 偵測到關鍵字 |
| `ask-user-question` | Agent 需要人類回答 |
| `pre-tool-use` | 工具呼叫前 |
| `post-tool-use` | 工具呼叫後 |

搭配 clawhip 使用，可以建立完整的多 Agent 監控與通知管線。

## Rate Limit 自動恢復

一個實用的小功能：OMC 內建 daemon 偵測 Claude API 的 rate limit，當觸發限速時**自動透過 tmux 恢復 session**，不需要人工介入。對長時間跑大型任務的場景來說，這避免了半夜 session 因為 rate limit 斷掉、隔天早上才發現的情況。

## Magic Keywords

OMC 的另一個設計特色是 magic keyword——在 prompt 中加入特定關鍵字就能觸發對應功能：

| 關鍵字 | 功能 |
|--------|------|
| `autopilot` | 自動模式 |
| `ralph` | 持續 verify/fix 迴圈 |
| `ulw` / `ultrawork` | 最大並行度 |
| `ralplan` | 產出實作計畫 |
| `deep-interview` | 需求訪談 |
| `deepsearch` | 深度搜尋 |
| `ultrathink` | 深度思考模式 |

這降低了記憶 slash command 的認知負擔——你可以用自然語言 + 關鍵字的方式操作。

## 專案現況

| 指標 | 數值 |
|------|------|
| GitHub Stars | ~11K |
| 授權 | MIT |
| npm 套件名 | oh-my-claude-sisyphus |
| 維護者 | Yeachan Heo |
| 協作者 | HaD0Yun、Sigrid Jin 等 |
| 官方文件 | yeachan-heo.github.io/oh-my-claudecode-website |

npm 套件名（`oh-my-claude-sisyphus`）和 repo 名（`oh-my-claudecode`）不一致，安裝時注意別搞混。

## 在 UltraWorkers 生態系中的位置

OMC 是 UltraWorkers 生態系中專門針對 Claude Code 的協調層。四個「oh-my-X」專案各自覆蓋一個 CLI 平台：

| 專案 | 平台 | Stars |
|------|------|-------|
| oh-my-openagent | OpenCode | ~48.5K |
| oh-my-codex | Codex CLI | ~16.6K |
| **oh-my-claudecode** | **Claude Code** | **~11K** |
| clawhip | 通知路由（跨平台） | ~543 |

如果你主要用 Claude Code，OMC 是這個生態系中最直接相關的工具。它不需要你換 CLI，而是在你已經熟悉的 Claude Code 上加一層協調能力。

## 參考資料

- [oh-my-claudecode GitHub Repository](https://github.com/Yeachan-Heo/oh-my-claudecode)
- [oh-my-claudecode Documentation](https://yeachan-heo.github.io/oh-my-claudecode-website)
- [Claude Code 完整方案分析](/posts/ai/2026-04-02-agent-cli-claude-code)
- [clawhip 事件通知路由器介紹](/posts/ai/2026-04-05-clawhip-event-notification-router)
- [oh-my-codex 工作流增強層介紹](/posts/ai/2026-04-05-oh-my-codex-workflow-layer)
