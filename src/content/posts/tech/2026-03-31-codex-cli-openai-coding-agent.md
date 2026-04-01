---
title: "Codex CLI：OpenAI 開源終端機 Coding Agent 完整介紹"
date: 2026-03-31
category: tech
tags: [codex, openai, ai-tools, cli, coding-agent, open-source]
lang: zh-TW
tldr: "Codex CLI 是 OpenAI 的開源終端機 coding agent，用 Rust 打造，支援 MCP、subagents、圖片輸入、code review。搭配 codex-1（o3 優化版）或 GPT-5-Codex 模型，可在本地端直接讀寫、執行程式碼。"
description: "OpenAI Codex CLI 的安裝、核心功能、模型演進、與 Codex App 的關係，以及實際使用場景整理。"
draft: false
---

Codex CLI 是 OpenAI 推出的開源 coding agent，直接跑在你的終端機裡。它能讀取、修改、執行你機器上的程式碼，用 Rust 寫成，啟動快、效能好。

## 安裝

```bash
# npm
npm i -g @openai/codex

# Homebrew
brew install --cask codex
```

支援 macOS 和 Linux，Windows 透過 WSL 使用。ChatGPT Plus / Pro / Business / Edu / Enterprise 方案皆包含 Codex。

## 核心功能

| 功能 | 說明 |
|---|---|
| MCP 支援 | 在 `~/.codex/config.toml` 設定 STDIO 或 streaming HTTP server，也可將 Codex 自身當 MCP server |
| Subagents | 明確要求時才會啟動子代理，用於平行處理大型任務 |
| 圖片輸入 | 可貼上截圖或設計稿，Codex 會一併讀取圖片細節 |
| Code Review | 在 commit 或 push 前，由獨立的 Codex agent 審查程式碼 |
| 自動化 | 用 `exec` 指令腳本化重複性工作流程 |
| Skills | 將指令、資源、腳本打包，讓 Codex 能可靠地連接工具、跑工作流程 |

## 模型演進

### codex-1（2025 年初）

Codex 最早的雲端版本，以 o3 模型針對軟體工程最佳化。可平行處理多個任務，包含寫功能、回答 codebase 問題、修 bug、發 PR。

### GPT-5-Codex（2025 年底）

GPT-5 進一步針對 agentic coding 最佳化的版本。同時擅長快速互動式對話和獨立執行長時間複雜任務。OpenAI 根據社群回饋，以 agentic coding workflow 為核心重新打造 Codex CLI。

## Codex App vs Codex CLI

| | Codex CLI | Codex App |
|---|---|---|
| 介面 | 終端機 | 桌面應用（macOS / Windows） |
| 特色 | 輕量、可腳本化 | 多 agent 管理、平行作業、長期任務協作 |
| 開源 | ✅ | ❌ |

Codex App 於 2026 年 3 月支援 Windows，提供更視覺化的多 agent 管理介面。

## 典型使用場景

1. **修 bug**：描述問題，Codex 讀取相關檔案、定位問題、提出修正
2. **寫新功能**：給規格說明，逐步產生程式碼並讓你 review
3. **Codebase Q&A**：直接問「這個函式在做什麼？」，Codex 讀原始碼後回答
4. **自動化腳本**：用 `codex exec` 串接 CI/CD 或日常重複工作

## 與其他工具的定位差異

Codex CLI 的核心優勢在於 OpenAI 自家模型的深度整合（codex-1、GPT-5-Codex），以及從雲端 Codex App 到本地 CLI 的完整生態。如果你已經在用 OpenAI API，Codex CLI 是最無縫的選擇。

## 參考資源

- [GitHub - openai/codex](https://github.com/openai/codex)
- [Codex CLI 官方文件](https://developers.openai.com/codex/cli)
- [Codex CLI 功能頁](https://developers.openai.com/codex/cli/features)
- [Introducing Codex](https://openai.com/index/introducing-codex/)
- [Codex 產品頁](https://openai.com/codex/)
