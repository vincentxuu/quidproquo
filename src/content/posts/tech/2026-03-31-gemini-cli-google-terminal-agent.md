---
title: "Antigravity CLI：Google 終端機 AI Agent 完整介紹（Gemini CLI 的接替者）"
date: 2026-03-31
type: project
category: tech
tags: [gemini, google, ai-tools, cli, coding-agent, antigravity]
lang: zh-TW
series:
  name: "Agent CLI 選型指南"
  order: 6
tldr: "Google 的終端 agent 現在是 Antigravity CLI：Go 打造，與 Antigravity 2.0 桌面版共用 server-side harness，支援非同步背景工作流，保留 Agent Skills、Hooks、Subagents，Extensions 改稱 plugins。前身 Gemini CLI 已於 2026/06/18 對個人帳號停止服務，repo 仍以 Apache-2.0 維護但只服務企業授權與付費 API key。"
description: "Antigravity CLI 的安裝、核心功能、與 Gemini CLI 的關係與遷移方式，以及 Gemini CLI 目前殘存的企業路徑。"
draft: false
---

🌏 [English version](/posts/tech/2026-03-31-gemini-cli-google-terminal-agent-en)

Google 在終端機這一格的產品是 **Antigravity CLI**。它接替的是 Gemini CLI——那個曾經每天送 1,000 次免費請求的開源終端 agent，已於 2026 年 6 月 18 日對所有個人帳號停止服務。

這篇介紹現在該裝什麼、它能做什麼，以及舊的 Gemini CLI 還剩哪些路徑。

## 安裝

```bash
# macOS / Linux
curl -fsSL https://antigravity.google/cli/install.sh | bash

# Windows PowerShell
irm https://antigravity.google/cli/install.ps1 | iex
```

安裝時會自動偵測本機的 Gemini CLI 目錄，把 skills、MCP server 設定與 agent profile 帶過去。

與 Gemini CLI 不同，Antigravity CLI **不是 Apache-2.0 開源專案**。這是社群對這次轉換反彈最大的一點。

## 核心功能

| 功能 | 說明 |
|---|---|
| Agent Skills | 從 Gemini CLI 完整延續，全域 skills 自動匯入 |
| Hooks | 行為一致，無需重新設定 |
| Subagents | 並行 agent 能力保留 |
| Plugins | 前身是 Gemini CLI 的 Extensions，需執行一次匯入指令 |
| MCP 支援 | 設定檔改為獨立的 `mcp_config.json` |
| 非同步背景工作流 | 官方主推的差異點，長時間任務可背景執行 |
| 專案記憶 | 完整相容既有的 `gemini.md` |

架構上最大的變化是**與 Antigravity 2.0 桌面版共用同一套 server-side harness**——CLI 不再是獨立實作，而是同一個 agent 平台的終端介面。Google 給的理由正是這個：與其維護兩套 CLI 加 IDE 擴充，不如集中在單一 agent-first 平台。

官方明講轉換當下**沒有 1:1 功能對等**，部分 Gemini CLI 能力沒有跟過去。

## 從 Gemini CLI 遷移

多數設定是自動的，Extensions 需要一道手動轉換：

```bash
agy plugin import gemini
```

MCP 設定的位置與欄位有變：

| | Gemini CLI | Antigravity CLI |
|---|---|---|
| 設定檔 | `settings.json` 裡的 `mcpServers` | 獨立的 `mcp_config.json` |
| 全域路徑 | `~/.gemini/settings.json` | `~/.gemini/antigravity-cli/mcp_config.json` |
| Workspace 路徑 | `.gemini/settings.json` | `.agents/mcp_config.json` |
| 遠端 server 欄位 | `url` | `serverUrl` |

## Gemini CLI 現在還剩什麼

專案沒有關閉，[repo](https://github.com/google-gemini/gemini-cli) 仍以 Apache-2.0 維護，Google 也承諾繼續跟上新模型與安全修補——但只服務企業：

- ✅ **仍可用**：Gemini Code Assist Standard / Enterprise 授權、透過 Google Cloud 存取、付費 Gemini 或 Gemini Enterprise Agent Platform API key
- ❌ **已終止**：個人免費層（Gemini Code Assist for Individuals）、Google AI Pro / Ultra 訂閱、個人版 Gemini Code Assist for GitHub（6/18 停止新安裝，7/17 完全關閉）

個人開發者已經沒有免費路徑。

## 典型使用場景

1. **修 bug + 跑測試**：描述問題，agent 定位、修正、執行測試驗證
2. **長時間任務背景跑**：非同步工作流是這代的主要賣點，適合大型重構或批次處理
3. **程式碼理解**：Gemini 模型的長 context 適合一次讀入大量檔案回答問題
4. **跨語言翻譯**：把一段 Python 改寫成 TypeScript

## 與其他工具的定位差異

Antigravity CLI 的優勢是與 Antigravity 桌面平台的整合、以及非同步背景 agent。代價是失去了 Gemini CLI 時代的兩個賣點：開源，以及那個近乎無上限的免費額度。

要深度推理，看 Claude Code；要不綁供應商，看 OpenCode。

## 參考資料

- [Google Antigravity Blog：Introducing Google Antigravity CLI](https://antigravity.google/blog/introducing-google-antigravity-cli)
- [Google Developers Blog：Transitioning Gemini CLI to Antigravity CLI（官方公告）](https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/)
- [Gemini CLI Discussion #28017：正式停止服務公告與安裝指令（2026/06/18）](https://github.com/google-gemini/gemini-cli/discussions/28017)
- [Gemini CLI GitHub：google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli)
- [Google 官方公告：Gemini CLI 開源終端機 AI agent 發布](https://blog.google/innovation-and-ai/technology/developers-tools/introducing-gemini-cli-open-source-ai-agent/)

## 更新紀錄

- 2026-08-18：停服已成事實，全文改寫為 Antigravity CLI 介紹。移除已失效的免費方案表與 Gemini 3 Pro 段落，改為 Antigravity CLI 的安裝與功能、遷移對照表、Gemini CLI 殘存路徑；修正安裝指令網址（官方為 `antigravity.google/cli/install.sh`，原文寫成 `antigravity.google/install.sh`）；標題與 tldr 一併調整
- 2026-05-21：補充 Gemini CLI 停用公告（2026/06/18）與 Antigravity CLI 遷移指引；更新 tldr、tags、參考資料
