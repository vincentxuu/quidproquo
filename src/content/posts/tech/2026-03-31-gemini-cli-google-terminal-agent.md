---
title: "Gemini CLI：Google 開源終端機 AI Agent 完整介紹"
date: 2026-03-31
category: tech
tags: [gemini, google, ai-tools, cli, coding-agent, open-source]
lang: zh-TW
tldr: "Gemini CLI 是 Google 開源的終端機 AI agent（Apache 2.0），免費帳號每分鐘 60 次、每天 1,000 次請求。支援 1M token context window、Google Search grounding、MCP 擴充，並整合 Gemini Code Assist 與 VS Code。"
description: "Google Gemini CLI 的安裝、免費方案、核心功能、Gemini 3 Pro 整合、與 Code Assist 的關係，以及實際使用場景。"
draft: false
---

Gemini CLI 是 Google 推出的開源 AI agent，把 Gemini 的能力直接帶進終端機。採用 ReAct（Reason and Act）迴圈，結合內建工具和 MCP server 來完成複雜任務。

## 安裝

```bash
# 不安裝直接用
npx @google/gemini-cli

# 全域安裝
npm install -g @google/gemini-cli
```

開源授權：Apache 2.0。

## 免費方案

這是 Gemini CLI 最吸引人的地方之一：

| 項目 | 額度 |
|---|---|
| 每分鐘請求 | 60 次 |
| 每日請求 | 1,000 次 |
| 需要 | 個人 Google 帳號 |

不需要信用卡，不需要 API key（免費方案），直接用 Google 帳號登入即可。

## 核心功能

| 功能 | 說明 |
|---|---|
| Google Search grounding | 內建搜尋能力，讓回答有即時資料支撐 |
| 檔案操作 | 讀取、寫入、編輯本地檔案 |
| Shell 指令 | 在終端機中執行任意指令 |
| Web fetching | 抓取網頁內容 |
| MCP 支援 | 透過 Model Context Protocol 連接自訂工具 |
| 1M token context | Gemini 模型原生支援超長 context window |

## Gemini 3 Pro 整合

Gemini CLI 已整合 Gemini 3 Pro——Google 最強的推理模型：

- **更好的指令執行**：推理能力提升，指令判斷更精準
- **Agentic coding**：支援複雜工程任務的自主編碼
- **進階工具使用**：更聰明的工作流程組合

Gemini 3 Pro 在 Gemini CLI 中可供 Google AI Ultra 訂閱者使用，或透過付費 API key 存取。

## 與 Gemini Code Assist 的關係

| | Gemini CLI | Gemini Code Assist |
|---|---|---|
| 介面 | 終端機 | VS Code 擴充套件 |
| 底層 | 獨立 CLI | 由 Gemini CLI 驅動 |
| 方案 | 免費 / API key | Free / Standard / Enterprise |

VS Code 中的 Gemini Code Assist agent mode 實際上是 Gemini CLI 功能的子集。兩者共享核心能力。

## 不只是寫程式

Gemini CLI 的用途不限於 coding：

- **內容生成**：產生文件、翻譯、摘要
- **問題解決**：分析日誌、debug、資料處理
- **深度研究**：利用 Google Search grounding 做即時調研
- **任務管理**：組織工作流程、自動化日常作業

## 典型使用場景

1. **修 bug + 跑測試**：描述問題，Gemini 定位、修正、執行測試驗證
2. **新功能開發**：給規格，逐步產生程式碼
3. **程式碼理解**：利用 1M token context 一次讀入整個專案來回答問題
4. **跨語言翻譯**：把一段 Python 改寫成 TypeScript

## 與其他工具的定位差異

Gemini CLI 的核心優勢：免費額度慷慨、1M token 超長 context、Google Search grounding 即時搜尋、完全開源（Apache 2.0）。適合預算有限但想體驗 AI coding agent 的開發者，或需要處理超大型 codebase 的場景。

## 參考資源

- [GitHub - google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli)
- [Gemini CLI 官方文件](https://developers.google.com/gemini-code-assist/docs/gemini-cli)
- [geminicli.com](https://geminicli.com/)
- [Google 部落格公告](https://blog.google/innovation-and-ai/technology/developers-tools/introducing-gemini-cli-open-source-ai-agent/)
- [Hands-on Codelab](https://codelabs.developers.google.com/gemini-cli-hands-on)
