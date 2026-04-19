---
title: "oh-my-openagent：用多模型 Agent 團隊取代單一 LLM 的編碼框架"
date: 2026-04-05
category: ai
tags: [agent-cli, oh-my-openagent, opencode, multi-agent, multi-model, orchestration, ultraworkers]
lang: zh-TW
tldr: "oh-my-openagent（OmO）把 OpenCode 從單一 LLM 工具變成多模型 Agent 團隊——Opus 當主力、GPT-5.2 當架構師、Gemini 做前端、Sonnet 查文件，一個 ultrawork 關鍵字觸發全員並行。48K stars，UltraWorkers 生態系中最早建立多 Agent 編碼模式的專案。"
description: "介紹 oh-my-openagent 的多模型 Agent 團隊架構、角色分工、hook 系統、與 UltraWorkers 生態系的關係。"
draft: false
---

大多數 AI coding 工具的邏輯是：選一個模型，把所有任務都丟給它。oh-my-openagent（OmO，前身 oh-my-opencode）提出不同的思路：**不同任務用不同模型，組成一個 Agent 團隊**。

## 核心概念

OmO 是一個建構在 [OpenCode](https://github.com/sst/opencode)（SST 開發的終端 AI 編碼工具）上的外掛。作者用了一個比喻：如果 OpenCode 是 Debian，OmO 就是 Ubuntu——同一個核心，但加上了開箱即用的配置和協作機制。

它的核心信念是：**沒有一個模型在所有任務上都是最好的**。Claude Opus 擅長複雜推理，GPT-5.2 擅長架構設計，Gemini 3 Pro 擅長前端 UI，Claude Sonnet 擅長快速查找。與其強迫一個模型做所有事，不如讓每個模型做它最擅長的。

## Agent 團隊

OmO 預設了一組具名 Agent，每個有明確的角色和指定的模型：

| Agent 名稱 | 模型 | 職責 |
|------------|------|------|
| **Sisyphus** | Claude Opus 4.5 High | 主力開發 Agent，負責核心實作 |
| **Oracle** | GPT-5.2 Medium | 架構設計、除錯、技術決策 |
| **Frontend UI/UX** | Gemini 3 Pro | 前端界面、樣式、使用者體驗 |
| **Librarian** | Claude Sonnet 4.5 | 文件搜尋、codebase 探索 |
| **Explore** | Grok Code | 快速全域搜尋（contextual grep） |
| **Prometheus** | — | 規劃者 |
| **Metis** | — | 計畫顧問 |
| **Multimodal Looker** | — | 多模態分析 |

每個 Agent 的模型、溫度、prompt、權限都可以在設定檔中覆寫。這不是硬綁定——你可以把 Oracle 換成 Claude，把 Frontend 換成其他模型。重點是**角色分工的框架**，不是特定模型的鎖定。

## ultrawork 模式

OmO 最具代表性的功能是 `ultrawork`（簡寫 `ulw`）關鍵字。在任何 prompt 中加入這個關鍵字，就會觸發完整的多 Agent 協作管線：

```
ultrawork: build a REST API for task management
```

系統會自動：

1. 由 Prometheus 拆解任務、建立計畫
2. 由 Metis 審查計畫的合理性
3. 將子任務分派給對應的 Agent（Sisyphus 寫邏輯、Frontend 做 UI、Librarian 查文件）
4. 多個 Agent 在背景並行執行
5. Sisyphus 整合結果、驗證完整性

不用 `ultrawork` 關鍵字時，就是正常的單 Agent 模式——OmO 不強制你每次都用團隊模式。

## 技術架構

| 面向 | 內容 |
|------|------|
| 語言 | TypeScript |
| 形式 | OpenCode 外掛 |
| 安裝 | npm（`oh-my-opencode@latest`） |
| 設定格式 | JSONC |
| 設定位置 | `.opencode/oh-my-opencode.json`（專案）或 `~/.config/opencode/oh-my-opencode.json`（全域） |

### Hook 系統

OmO 內建 25+ 個 hook，對應 Agent 生命週期的各個階段，全部可透過 `disabled_hooks` 開關：

- `PreToolUse` / `PostToolUse`：工具呼叫前後
- `UserPromptSubmit`：使用者送出 prompt 時
- `Stop`：Agent 停止時

這套 hook 系統和 Claude Code 的 hook 模型相容，降低跨工具遷移的學習成本。

### 內建 MCP 服務

| MCP | 功能 |
|-----|------|
| **Exa** | Web 搜尋 |
| **Context7** | 官方文件查詢 |
| **Grep.app** | GitHub 程式碼搜尋 |

### LSP 與 AST-Grep

OmO 整合了完整的 Language Server Protocol 支援和 AST-Grep，讓 Agent 可以做確定性的程式碼重構（rename、extract、inline），而不是靠模型猜測字串替換。

### Todo Continuation Enforcer

一個有趣的機制：它會強制 Agent 完成 todo list 上的所有項目，不讓 Agent 半途而廢。專案文件稱之為「Sisyphus 持續推石頭」——命名來自希臘神話，刻意選了一個永不停歇的角色。

### Comment Checker

自動檢查並阻止 Agent 在程式碼中留下過多註解。這是對 AI coding 工具一個常見問題的直接回應——模型傾向於在每一行都加上解釋性註解。

## 安裝

OmO 建議的安裝方式很特別——讓 AI Agent 來幫你安裝：

```
# 貼這段到任何 LLM agent 裡
Install and configure oh-my-opencode by following the instructions here:
https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/docs/guide/installation.md
```

或手動：

```bash
# 需要先安裝 OpenCode
npm install -g oh-my-opencode@latest
```

使用時需要各模型的 API key（Claude、OpenAI、Google、xAI 等），按你實際使用的 Agent 配置。

## 專案現況

| 指標 | 數值 |
|------|------|
| GitHub Stars | ~48.5K |
| Forks | ~3.8K |
| Open Issues | 422 |
| 授權 | SUL-1.0（Sisyphus Use License） |
| 維護者 | code-yeongyu（Yeongyu Kim） |
| 官網 | ohmyopenagent.com |

值得注意的是授權：OmO 使用自訂的 SUL-1.0（Sisyphus Use License），不是常見的 MIT 或 Apache。使用前建議先了解授權條款。

## 在 UltraWorkers 生態系中的位置

OmO 是整個 UltraWorkers 多 Agent 編碼生態系的**起源專案**。它最早建立了「Agent 團隊」的架構模式——角色分工、模型路由、背景並行、hook 系統——後續的 oh-my-codex（OMX）和 oh-my-claudecode（OMC）都是把這套模式移植到不同的 Agent CLI 上。

| 專案 | 基底平台 | 維護者 |
|------|----------|--------|
| **oh-my-openagent** | OpenCode | code-yeongyu |
| **oh-my-codex** | OpenAI Codex CLI | Yeachan Heo |
| **oh-my-claudecode** | Claude Code | Yeachan Heo |

三者共享相同的設計哲學，但各自適配不同的 CLI 生態系。如果你用 OpenCode，選 OmO；用 Codex CLI，選 OMX；用 Claude Code，選 OMC。

## 參考資料

- [oh-my-openagent GitHub Repository](https://github.com/code-yeongyu/oh-my-openagent)
- [OpenCode by SST](https://github.com/sst/opencode)
- [oh-my-codex 工作流增強層介紹](/posts/ai/2026-04-05-oh-my-codex-workflow-layer)
- [Claw Code 開源 Rust 版 Claude Code 介紹](/posts/ai/2026-04-05-claw-code-rust-claude-code-reimplementation)
