---
title: "OpenCode：開源 AI 終端機 Coding Agent 完整介紹"
date: 2026-03-31
type: project
category: tech
tags: [opencode, ai-tools, cli, coding-agent, open-source, tui]
lang: zh-TW
tldr: "OpenCode 是用 Go 打造的開源 AI coding agent（95K+ GitHub stars），內建 TUI 介面、支援 75+ LLM、LSP 整合、Vim 風格編輯器、SQLite session 管理。免費、不需訂閱，可接本地或雲端模型。"
description: "OpenCode 的安裝、核心功能、雙 agent 模式、GitHub 整合、與 Aider 的比較，以及適用場景。"
draft: false
---

🌏 [English version](/posts/tech/2026-03-31-opencode-ai-terminal-coding-agent-en)

OpenCode 是由 SST/AnomalyCo 團隊用 Go 打造的開源 AI coding agent，跑在終端機裡。不需訂閱費，支援 75+ 個 LLM 供應商，2025 Q4 發布後迅速獲得 95K+ GitHub stars。

## 安裝

```bash
# curl 一鍵安裝
curl -fsSL https://opencode.ai/install | bash

# npm
npm install -g opencode

# Homebrew
brew install opencode

# 其他
# Scoop / Chocolatey（Windows）、pacman（Arch）、Nix
```

## 核心功能

| 功能 | 說明 |
|---|---|
| TUI 介面 | 用 Bubble Tea 打造的互動式終端機 UI，接近 IDE 體驗 |
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
| GitHub Stars | 95K+ | 39K+ |
| 語言 | Go | Python |
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

## 參考資源

- [GitHub - opencode-ai/opencode](https://github.com/opencode-ai/opencode)
- [OpenCode 官網](https://opencode.ai/)
- [OpenCode 文件](https://opencode.ai/docs/)
- [CLI 使用指南](https://opencode.ai/docs/cli/)
- [freeCodeCamp 教學](https://www.freecodecamp.org/news/integrate-ai-into-your-terminal-using-opencode/)

## 參考資料

- [OpenCode GitHub：sst/opencode 開源 AI 終端機 coding agent（95K+ stars）](https://github.com/sst/opencode)
- [OpenCode 官方網站：開源 AI 終端機 coding agent 介紹](https://opencode.ai/)
- [OpenCode 官方文件：opencode terminal coding agent CLI 使用說明](https://opencode.ai/docs/)
- [freeCodeCamp：使用 opencode 整合 AI 至終端機工作流程教學](https://www.freecodecamp.org/news/integrate-ai-into-your-terminal-using-opencode/)
