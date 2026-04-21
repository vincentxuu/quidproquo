---
title: "oh-my-codex：在 OpenAI Codex CLI 上疊加結構化工作流的增強層"
date: 2026-04-05
category: ai
tags: [agent-cli, openai-codex, oh-my-codex, workflow, multi-agent, tmux, developer-tools]
lang: zh-TW
tldr: "oh-my-codex（OMX）不是取代 Codex CLI，而是在它上面加一層結構化工作流——從需求釐清、計畫產出到多 Agent 並行執行，用 4 個核心 Skill 把散亂的 prompt 對話變成可追蹤的開發流程。"
description: "介紹 oh-my-codex（OMX）的架構設計、核心工作流 Skill、多 Agent 協作機制，以及它如何補足 Codex CLI 原生缺乏的流程管理能力。"
draft: false
---

OpenAI Codex CLI 能力強，但用過的人都知道一個問題：**它沒有工作流概念**。你丟一段 prompt，它執行完就結束了——沒有任務拆解、沒有計畫追蹤、沒有跨 session 的狀態管理。oh-my-codex（OMX）就是為了解決這個問題而生的增強層。

## OMX 是什麼

OMX 不是另一個 Agent CLI，它是一個**建構在 Codex CLI 之上的工作流框架**。你仍然用 Codex 來跑模型、讀寫檔案、執行指令，OMX 負責的是 Codex 不管的部分：任務該怎麼拆、計畫該怎麼追蹤、多個 Agent 之間該怎麼協調。

簡單來說：

| 層級 | 負責 | 工具 |
|------|------|------|
| 模型推理 + 程式碼操作 | LLM 呼叫、檔案讀寫、指令執行 | OpenAI Codex CLI |
| 工作流管理 | 任務釐清、計畫產出、狀態持久化、多 Agent 協調 | oh-my-codex |

這個分層設計意味著 OMX 不需要重新發明 Codex 已經做好的事，只專注補足缺口。

## 四個核心 Skill

OMX 的工作流由四個 Skill 組成，每個 Skill 對應開發流程的一個階段：

### `$deep-interview`：需求釐清

當你的需求模糊時（「幫我重構這個模組」），直接丟給 Codex 容易得到偏離預期的結果。`$deep-interview` 會先啟動一輪結構化的需求訪談，確認範圍、邊界條件和預期產出，再進入下一階段。

### `$ralplan`：計畫產出

把釐清後的需求轉換成可執行的實作計畫。計畫包含任務拆解、依賴關係、預估複雜度，儲存在 `.omx/` 目錄中供後續階段引用。

### `$ralph`：單 Agent 執行

負責持久性的完成迴圈。一個 Agent 從頭到尾擁有一個任務，直到完成為止。跨 session 的狀態由 `.omx/` 目錄維護，即使中斷也能接續。

### `$team`：多 Agent 並行

當任務足夠大、可以拆成多條平行路徑時，`$team` 會透過 tmux（macOS / Linux）或 psmux（Windows）啟動多個 Codex Agent session，每個 Agent 負責一個子任務，互不干擾。

四個 Skill 的關係是線性推進的：

```
$deep-interview → $ralplan → $ralph（單一任務）
                           → $team（多條平行任務）
```

你不一定每次都要走完整流程——需求明確時可以跳過 `$deep-interview`，任務簡單時不需要 `$team`。但這個結構提供了一個**可預測的工作流骨架**。

## 狀態持久化

OMX 在專案根目錄建立 `.omx/` 資料夾，儲存：

- 訪談紀錄（需求釐清的產出）
- 實作計畫（任務拆解與依賴）
- 執行日誌（每個 Agent 的進度）
- Runtime memory（跨 session 的上下文）

這解決了 Codex CLI 最大的痛點之一：**session 之間沒有記憶**。有了 `.omx/`，你可以中斷工作、隔天回來，Agent 知道上次做到哪裡。

## 多 Agent 協作機制

`$team` 模式是 OMX 最有野心的功能。它的運作方式：

1. 從 `$ralplan` 的計畫中識別可並行化的子任務
2. 為每個子任務啟動獨立的 tmux session
3. 每個 session 內跑一個 Codex Agent，擁有獨立的工作空間
4. Agent 完成後回報結果，由協調者整合

這和 Codex 原生的 Parallel Agents 功能有部分重疊，但 OMX 的差異在於**它管理的是任務層級的協調**，不只是 Agent 層級的並行。

## 技術組成

| 組成 | 技術 |
|------|------|
| 主要語言 | TypeScript（91.7%） |
| 效能模組 | Rust（4.6%） |
| Prompt 管理 | `prompts/` 目錄下的模板 |
| 技能定義 | `skills/` 目錄下的可組合模組 |
| Agent 角色 | 可重用的 specialist role 定義 |

TypeScript + Rust 的組合在 CLI 工具中越來越常見——TS 負責邏輯和 prompt 處理，Rust 負責需要效能的底層操作。

## 安裝與使用

前置條件：Node.js 20+、已安裝並認證的 OpenAI Codex CLI。

```bash
npm install -g @openai/codex oh-my-codex
```

啟動建議：

```bash
omx --madmax --high
```

多 Agent 模式需要額外安裝 tmux（Linux / macOS）或 psmux（Windows）。

## 和其他工具的比較

OMX 的定位不是要和 Claude Code、Gemini CLI 或 Cursor 競爭——它只能搭配 Codex CLI 使用。更準確的比較對象是其他「Agent 增強層」：

| 工具 | 基底 | 核心差異 |
|------|------|---------|
| oh-my-codex | Codex CLI | 結構化工作流（釐清→計畫→執行）、多 Agent 協調 |
| Claude Code CLAUDE.md | Claude Code | 專案級指引，但沒有工作流引擎 |
| Codex 原生 Skills | Codex CLI | 可重用範本，但缺少計畫與協調層 |

OMX 的價值主張是：如果你已經在用 Codex CLI，而且常常遇到「任務太大、一個 prompt 搞不定」的情況，OMX 提供一個結構來管理這個複雜度。

## 適用場景

**適合的情境：**

- 已經在用 Codex CLI，想要更有結構的開發流程
- 任務複雜度高，需要任務拆解和多 Agent 並行
- 團隊中多人共用相同的工作流規範
- 需要跨 session 的狀態持久化

**不太適合的情境：**

- 不用 Codex CLI（OMX 綁定 Codex 生態系）
- 任務簡單到一個 prompt 就能解決
- 需要非 OpenAI 模型的場景

## 專案現況

| 指標 | 數值 |
|------|------|
| GitHub Stars | ~16.6k |
| Forks | ~1.6k |
| 最新版本 | v0.11.13（2026-04-04） |
| 授權 | MIT |
| 主要維護者 | Yeachan Heo、HaD0Yun |
| 貢獻者 | 35 人 |

從 star 數和更新頻率來看，OMX 是 Codex CLI 生態系中最活躍的社群增強工具之一。

## 參考資料

- [oh-my-codex GitHub Repository](https://github.com/Yeachan-Heo/oh-my-codex)
- [OpenAI Codex CLI — GitHub](https://github.com/openai/codex)
- [OpenAI 介紹 Codex：Agent CLI 工作流與多 Agent 協作](https://openai.com/index/introducing-codex/)
- [Codex CLI 完整方案分析](/posts/ai/2026-04-02-agent-cli-openai-codex)
