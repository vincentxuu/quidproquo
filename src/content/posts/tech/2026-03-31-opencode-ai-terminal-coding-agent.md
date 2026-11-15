---
title: "OpenCode：開源 AI 終端機 Coding Agent 完整介紹"
date: 2026-03-31
type: project
category: tech
tags: [opencode, ai-tools, cli, coding-agent, open-source, tui]
lang: zh-TW
series:
  name: "Agent CLI 選型指南"
  order: 9
tldr: "OpenCode 是用 TypeScript 打造的開源 AI coding agent（MIT，repo 在 anomalyco/opencode），內建 TUI、支援 75+ LLM、LSP 整合、Vim 風格編輯器、SQLite session 管理，另有桌面版。工具免費，可選內建免費模型、付費供應商或本地模型。"
description: "OpenCode 的安裝、核心功能、雙 agent 模式、GitHub 整合、與 Aider 的比較，以及適用場景。"
draft: false
---

🌏 [English version](/posts/tech/2026-03-31-opencode-ai-terminal-coding-agent-en)

OpenCode 是用 **TypeScript** 打造的開源 AI coding agent（MIT 授權），跑在終端機裡。不需訂閱費，支援 75+ 個 LLM 供應商，repo 幾經搬遷，現在在 [anomalyco/opencode](https://github.com/anomalyco/opencode)（前身 `sst/opencode`）。

> **⚠️ 別跟同名的 Go 專案搞混**：早期有一個 `opencode-ai/opencode` 是 Go + Bubble Tea 寫的，跟這個不是同一份程式碼。網路上「OpenCode 是 Go 寫的」多半來自這個混淆。

## 安裝：先分清楚 V1 與 V2

新安裝 V2 時，使用 V2 套件，並確認實際版本：

```bash
npm install --global @opencode/cli
opencode --version
opencode
```

`npm install -g opencode-ai` 等 V1 教學屬於舊版入口。兩版都使用 `opencode` 指令，不能只看指令名稱判斷版本。Windows 請從 [V2 安裝頁](https://opencode.ai/v2/docs)下載獨立 CLI 執行檔；V2 目前不支援 Windows 套件管理器安裝。

下方功能介紹保留原本的 V1 介面脈絡。後端服務、桌面版與 API 的改動，可延伸看 [OpenCode 2 架構介紹](/posts/tech/2026-08-22-opencode-2-electron-rewrite-coding-agent)。

## 工具免費，也有可以直接試的免費模型

OpenCode 本體是開源工具，也提供內建免費模型，不必先接 OpenRouter 或購買訂閱才能開始。V2 輸入 `/models` 找免費項目，再到[官方模型表](https://opencode.ai/v2/docs/console/models)確認 Input、Output 都是 Free。例如 Big Pickle 的 ID 是 `opencode/big-pickle`，名稱不一定帶 Free；可用名單與額度仍可能調整。

OpenCode Console 同時提供付費模型，Go 則是選用的訂閱方案。外部供應商依自己的價格與額度計費；使用既有付費訂閱，也不能算成模型本身免費。

雲端免費模型仍會收到你的請求。各模型資料條款不同，例如 Big Pickle 免費期間的資料可能用來改善模型；要處理私人程式碼，先選符合需求的供應商或本地模型。

## 核心功能

| 功能 | 說明 |
|---|---|
| TUI 介面 | 互動式終端機 UI，接近 IDE 體驗；另有桌面版（beta）與 IDE 擴充 |
| 75+ LLM | OpenAI、Anthropic、Google、AWS Bedrock、Groq、Azure、OpenRouter、本地模型（Ollama、LM Studio） |
| LSP 整合 | 語言伺服器協定支援，提供智慧提示與語義分析 |
| Vim 風格編輯器 | 終端機內直接用 Vim 鍵位編輯 |
| SQLite session | 持久化對話記錄，跨 session 保留上下文 |
| GitHub 整合 | 在 PR 留言中用 `/opencode` 或 `/oc` 觸發任務 |

## 雙 Agent 模式

OpenCode 內建兩個 agent，按 `Tab` 切換：

| Agent | 權限 | 用途 |
|---|---|---|
| **Build**（預設） | 完整讀寫 | 開發工作：寫程式、修 bug、重構 |
| **Plan** | 唯讀 | 分析與探索：理解程式碼、規劃架構、code review |

這個設計讓你在「做事」和「想事」之間快速切換，Plan mode 不會意外修改任何檔案。

## 支援的模型供應商

OpenCode 的最大賣點之一是模型自由度：

**雲端：**
- OpenAI（GPT-4o、GPT-5、o3 等）
- Anthropic（Claude Sonnet、Opus 等）
- Google（Gemini Pro、Ultra）
- AWS Bedrock、Azure OpenAI
- Groq、OpenRouter、DeepSeek

**本地：**
- Ollama
- LM Studio
- 任何 OpenAI-compatible API

完全不綁定供應商，想換就換。

## GitHub Actions 整合

在 GitHub PR 或 Issue 留言中加上 `/opencode` 或 `/oc`，OpenCode 會在 GitHub Actions runner 中執行任務：

```
/opencode 幫我修這個 lint error 然後跑測試
```

適合自動化 code review 回饋和簡單修正。

## 與 Aider 的比較

| | OpenCode | Aider |
|---|---|---|
| 語言 | TypeScript | Python |
| 介面 | TUI（類 IDE） | CLI |
| 核心特色 | LSP 整合、平行 session、分享連結 | Git-first workflow，每次 AI 編輯自動 commit |
| 適合 | 互動式開發 session、探索性工作 | 系統性重構、整個 repo 範圍的修改 |

很多開發者兩者搭配使用：Aider 做系統性重構，OpenCode 做互動式開發。

## 典型使用場景

1. **互動式開發**：在 TUI 中對話式寫程式，即時看結果
2. **Code 探索**：用 Plan mode 唯讀分析不熟悉的 codebase
3. **多模型切換**：同一個 session 中切換不同供應商的模型比較效果
4. **本地模型開發**：接 Ollama 跑本地模型，完全離線作業
5. **GitHub 自動化**：在 PR 中直接觸發 AI 任務

## 與其他工具的定位差異

OpenCode 的核心優勢：完全免費開源、75+ 模型供應商不鎖定、TUI 帶來的類 IDE 體驗、LSP 整合提供語義級理解。適合想要最大模型自由度、不想被任何供應商綁定的開發者。

從安裝、找免費模型到第一次生活提問，可以接著看[免費 LLM 入門教學：OpenCode 2 與 OpenRouter](/posts/ai/2026-11-01-free-llm-opencode2-openrouter)。

## 更新紀錄

- 2026-11-01：區分 V1／V2 安裝，補上內建免費模型與價格查找，修正雲端資料邊界和 repo 連結，移除過期人氣數字。
- 2026-08-18：對照官方 repo 修正三處實質錯誤：語言是 TypeScript 不是 Go、授權是 MIT、repo 已移至 `anomalyco/opencode`；stars 95K → 約 198K；修正 npm 套件名（`opencode-ai`）與 Homebrew tap；補上桌面版；納入 Agent CLI 選型指南系列

## 參考資料

- [OpenCode GitHub](https://github.com/anomalyco/opencode)
- [OpenCode V2 installation](https://opencode.ai/v2/docs)
- [OpenCode V2 CLI commands](https://opencode.ai/v2/docs/cli/commands)
- [OpenCode Console models and privacy](https://opencode.ai/v2/docs/console/models)
- [OpenCode V2 models](https://opencode.ai/v2/docs/models/)
- [OpenCode V1 documentation](https://opencode.ai/docs/)
