---
title: "Cursor CLI 完整方案分析：從 IDE Agent 延伸到終端的全能選手"
date: 2026-04-02
category: ai
tags: [agent-cli, cursor, pricing, cli-agent, cloud-handoff, plan-mode, tui]
lang: zh-TW
tldr: "Cursor CLI 將 IDE 的 Agent 帶入終端，支援 interactive TUI 與 headless 模式、Plan/Ask/Agent 三種模式、Cloud Handoff 雲端接力、CI/CD 整合，$20-200/mo。"
description: "深入分析 Cursor CLI 2026 年的功能特色、三種模式（Plan/Ask/Agent）、Cloud Handoff、MCP 整合、CI/CD 自動化與定價方案。"
draft: false
---

Cursor 原本以 IDE 內建 Agent 聞名，2025 年底正式將同樣的 Agent 能力帶入終端機。Cursor CLI 的核心理念是：**你在 IDE 裡能做的事，在 terminal 也能做**。不管是互動式開發、CI/CD 自動化、還是把任務丟到雲端讓它自己跑，Cursor CLI 都有對應的解法。

這篇拆解 Cursor CLI 的功能特色、三種操作模式、Cloud Handoff 雲端接力、CI/CD 整合方式與定價方案。

## 產品定位

Cursor CLI 把 IDE 裡的 Agent 搬到了終端機，提供兩種執行方式：

- **Interactive TUI（互動式介面）**——在終端裡啟動一個完整的文字介面，像在 IDE 裡一樣跟 Agent 對話、審核變更、逐步確認。適合日常開發。
- **Non-interactive Print Mode（非互動模式）**——沒有 UI，直接輸出結果到 stdout。設計給腳本和 CI/CD pipeline 使用，可以用 `--print` 旗標啟動。

支援 Windows、macOS、Linux 三大平台。目標很明確：**讓 Agent 不再被綁在 IDE 裡**，SSH 連線、遠端伺服器、Docker 容器、CI runner——任何有終端機的地方都能跑。

## 核心功能

### 檔案與 Shell 存取

Cursor CLI 能讀寫檔案、搜尋整個 codebase、執行 shell 命令。所有有副作用的操作（寫入檔案、執行指令）預設需要使用者確認，除非你明確授權自動執行。

### Rules 與 MCP 支援

CLI 會讀取 `.cursor/rules` 目錄下的規則檔案，也支援 repo 根目錄的 `AGENTS.md` 和 `CLAUDE.md`。這意味著你在 IDE 裡設定好的 coding standards 和 agent 行為偏好，在 CLI 中同樣生效。

MCP（Model Context Protocol）server 整合也完整支援，agent 可以呼叫外部工具和資料來源。

### 多模型選擇

Cursor 不綁死單一模型供應商。訂閱方案內可以使用來自 Anthropic、OpenAI、Google Gemini、Cursor 自家模型等多個 frontier model。Auto 模式下系統自動選模型，也可以手動指定。

### 多 Agent 平行執行

你可以同時在多個終端機視窗啟動不同的 agent，或透過 Cloud Agent 在遠端平行跑多個任務。這在大型專案需要同時處理多個子任務時特別有用。

## 三種模式

Cursor CLI 提供三種操作模式，對應不同的使用情境：

| 模式 | 啟動方式 | 說明 | 對應 IDE 功能 |
|------|----------|------|---------------|
| **Plan Mode** | `/plan` 或 `--mode=plan` | 先規劃再動手。Agent 會提出方案、問釐清問題，確認後才開始實作 | IDE 的 Plan 模式 |
| **Ask Mode** | `/ask` 或 `--mode=ask` | 只讀模式。探索 codebase、回答問題，但**不做任何修改** | IDE 的 Ask 模式 |
| **Agent Mode** | 預設模式 | 完整 agentic 能力：編輯檔案、執行指令、搜尋程式碼、自主決策 | IDE 的 Agent 模式 |

**Plan Mode** 特別適合大型重構或不確定方向時使用。Agent 會先分析現有程式碼，提出具體的修改計劃，在你確認前不會動任何檔案。

**Ask Mode** 像是一個熟悉你 codebase 的顧問。它會讀取相關檔案來回答問題，但絕不會寫入任何東西。適合 code review、理解不熟悉的模組、或在動手前做研究。

**Agent Mode** 是預設值，也是功能最完整的模式。它能自主決定要讀哪些檔案、跑什麼命令、怎麼修改程式碼。

## Cloud Handoff（雲端接力）

這是 Cursor CLI 最有特色的功能之一。在對話中輸入 **`&` 前綴**的指令，就能把當前的對話上下文推送到 Cloud Agent：

```
& 幫我完成剩下的 migration 和測試
```

Cloud Agent 會接手本地的對話脈絡，在雲端繼續執行。你可以：

- 關掉終端機去做別的事
- 在 **cursor.com/agents** 的網頁介面追蹤進度
- 在手機上查看結果

這個設計橋接了 **CLI ↔ Cloud** 的邊界。本地開發到一半、需要離開？把任務 handoff 到雲端，它會繼續跑。回來後在任何裝置上接續。

## CI/CD 整合

Cursor CLI 原生支援 GitHub Actions 整合。典型的設定流程：

1. 在 CI 環境安裝 Cursor CLI
2. 設定 `CURSOR_API_KEY` 環境變數
3. 在 workflow step 中呼叫 agent

輸出格式支援三種：

| 格式 | 參數 | 說明 | 適用場景 |
|------|------|------|----------|
| **json** | `--format=json` | 單一 JSON 物件，包含最終結果 | 程式化解析 |
| **stream-json** | `--format=stream-json` | NDJSON 串流事件 | 即時監控 |
| **text** | `--format=text` | 人類可讀的純文字 | log 檢視 |

你可以選擇讓 agent 完全自主執行，或限制它只能做特定操作（例如只讀不寫）。對於關鍵的 production 環境操作，建議使用受限模式。

## 定價方案

| 方案 | 月費 | 主要額度 | 備註 |
|------|------|----------|------|
| **Hobby** | 免費 | 2,000 completions + 50 slow premium requests | 入門體驗 |
| **Pro** | $20/mo | Auto 模式無限 + $20 credit pool | 個人開發者首選 |
| **Pro+** | $60/mo | Auto 模式無限 + $60 credit pool | 中重度使用者 |
| **Ultra** | $200/mo | 20x 用量倍率（相當於 ~$4,000 容量） | 重度使用者 |
| **Teams** | $40/user/mo | 團隊管理 + 共享額度 | 團隊方案 |
| **Enterprise** | 洽談 | 客製化 | 大型企業 |

### Credit 計費邏輯

Cursor 採用 **credit pool** 機制。Auto 模式下系統自動選模型，不額外扣 credit（Pro 以上無限使用）。手動指定 premium model 時才會從 credit pool 扣款：

- **$20 credit pool** 大約可用 ~225 次 Sonnet 請求，或 ~550 次 Gemini 請求
- 不同模型消耗不同 credit 數量
- Credit 用完後降速，不會斷線

## 2026 年 1 月更新

Cursor CLI 在 2026 年初迎來一波重要更新：

- **Plan Mode**——新增規劃模式，先設計方案再實作
- **Ask Mode**——新增唯讀探索模式
- **Cloud Handoff**——本地對話推送至雲端 Agent 接力
- **MCP 整合強化**——支援 auto callback，`/mcp list` 互動式選單
- **Diff 高亮顯示**——word-level 精度的變更標示，更容易審核修改

## Background Agents

除了 Cloud Handoff，Cursor 還提供 **Background Agents**——完全在雲端執行的自主 agent：

- 自動 clone 你的 repo 到雲端環境
- 獨立完成任務後提交 **Pull Request**
- 最多同時跑 **8 個平行 agent**
- 獨立計費，需使用 **MAX mode**（加收 20% 附加費）

Background Agents 適合那些你不需要即時監看、但希望它自己跑完的任務，例如批量 refactor、自動化 bug fix、或大規模程式碼遷移。

## 市場地位

截至 2026 年 2 月，Cursor 的數字相當驚人：

- **$2B ARR**（年度經常性收入）
- **200 萬**總用戶
- **100 萬**付費用戶
- **100 萬** DAU（日活躍用戶）
- **半數 Fortune 500** 企業採用

這些數字讓 Cursor 成為 AI coding tool 市場中成長最快的產品之一。從 IDE 延伸到 CLI，再到 Cloud Agent，Cursor 正在建構一個完整的 AI 開發者平台。

## 適用場景

Cursor CLI 特別適合以下族群：

- **已經在用 Cursor IDE 的開發者**——CLI 延伸了你熟悉的 Agent 體驗到終端機，rules 和設定共享
- **需要 IDE + CLI 統一體驗的團隊**——同一套工具、同一套規則，在 IDE 和 terminal 之間無縫切換
- **CI/CD 自動化需求**——原生 GitHub Actions 支援，多種輸出格式，適合整合進現有 pipeline
- **長時間任務場景**——Cloud Handoff 讓你不必一直盯著 terminal，任務可以在背景或雲端繼續

如果你是純 terminal 使用者、不用 IDE，Claude Code 或 Gemini CLI 可能更貼合你的工作流。但如果你的工作橫跨 IDE 和終端機，Cursor CLI 提供了目前最完整的跨場景整合。

## 系列文章

這篇是 Agent CLI 系列的一部分。關於多模型路由和訂閱方案的跨工具比較，請參考：

**→ [Agent CLI 訂閱方案與多模型路由策略](/posts/ai/2026-04-02-agent-cli-subscription-multi-model-routing)**

## 參考資料

- [Cursor CLI Overview | Cursor Docs](https://cursor.com/docs/cli/overview)
- [Using Agent in CLI | Cursor Docs](https://cursor.com/docs/cli/using)
- [CLI Agent Modes and Cloud Handoff | Cursor Changelog](https://cursor.com/changelog/cli-jan-16-2026)
- [Cursor Agent CLI | Cursor Blog](https://cursor.com/blog/cli)
- [Models & Pricing | Cursor Docs](https://cursor.com/docs/models-and-pricing)
- [Cursor Pricing | Cursor](https://cursor.com/pricing)
