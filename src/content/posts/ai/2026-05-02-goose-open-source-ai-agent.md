---
title: "goose：開源、跨平台、不鎖 LLM 的本地 AI Agent"
date: 2026-05-02
type: deep-dive
category: ai
tags: [goose, ai-agent, open-source, mcp, rust, linux-foundation, aaif, claude-code, cli, desktop-app]
lang: zh-TW
tldr: "goose 是由 Linux Foundation 旗下 AAIF 維護的開源 AI Agent，支援 15+ LLM 供應商、70+ MCP 擴充，用 Rust 打造桌面 App + CLI + API，定位是不鎖廠商、可自架的 Claude Code 替代方案。"
description: "介紹 goose 開源 AI Agent：從 Block 到 Linux Foundation AAIF 的遷移背景、技術架構（Rust + TypeScript）、多 LLM 支援、MCP 擴充機制、.goosehints 用法，以及與 Claude Code / Cursor 的差異。"
draft: false
---

AI Coding Agent 工具越來越多，但大多數要嘛綁定特定 IDE、要嘛只支援單一模型供應商。goose 選擇了一條不同的路：完全開源、跨平台、支援任何 LLM，且由 Linux Foundation 管轄——不屬於任何一家商業公司。

它最初是由 Block（Square 的母公司）開發，2025 年底正式捐給 **Agentic AI Foundation（AAIF）** 成為 Linux Foundation 的子基金會專案。這一步讓 goose 從企業內部工具，變成一個有中立治理的開放生態系。截至 2026 年 5 月，已有 43.7k stars、470+ contributors。

---

## 安裝與快速開始

**Desktop App**：前往 [goose 官方安裝頁](https://goose-docs.ai/docs/getting-started/installation) 下載 macOS / Linux / Windows 版本，解壓縮後直接執行。

**CLI**：

```bash
curl -fsSL https://github.com/aaif-goose/goose/releases/download/stable/download_cli.sh | bash
```

安裝完成後，設定 LLM provider：

```bash
goose configure
```

互動式介面會引導你選擇供應商並輸入 API Key。設定完成後開始第一個 session：

```bash
goose session
```

接著就像跟開發者對話一樣下指令：

```
> 幫我寫一個讀取 CSV 並輸出統計摘要的 Python script
> 把剛才的 script 加上 argparse，讓檔案路徑可以從命令列傳入
> 執行看看，用 sample.csv 測試
```

goose 會自動規劃、寫程式、執行，並把結果回報給你。

---

## 架構與平台

goose 的核心用 **Rust** 寫成，UI 層用 **TypeScript（React）**，這個選擇保證了跨平台的一致性和效能。

它提供三種使用方式：

- **Desktop App**：macOS、Linux、Windows 原生應用程式，GUI 介面
- **CLI**：終端機工作流，`goose session` 開始一段對話
- **API**：可嵌入自己的應用程式

對開發者來說，CLI 是主力。對非技術使用者，Desktop App 降低了門檻。

```
goose 執行模型
┌──────────────────────────────────────────────────┐
│  Desktop App / CLI / API                         │
├──────────────────────────────────────────────────┤
│  Session 管理層（Rust）                           │
├────────────────┬─────────────────────────────────┤
│  LLM Provider  │  MCP Extension 層               │
│  （15+ 供應商） │  （70+ servers）                │
└────────────────┴─────────────────────────────────┘
```

---

## LLM 供應商：15+ 選擇，不鎖廠商

goose 支援幾乎所有主流 LLM 服務：

| 類型 | 選項 |
|------|------|
| API Key | Anthropic、OpenAI、Google Gemini、Azure OpenAI、AWS Bedrock |
| 本地推理 | Ollama（完全離線，不需 API Key） |
| 聚合平台 | OpenRouter（200+ 模型，pay-per-use）|
| 訂閱整合 | ChatGPT Plus/Pro、Claude 訂閱（透過 ACP 協議）|

**ACP（Agent Communication Protocol）** 是 goose 生態系的一個關鍵設計：它讓 goose 直接串接你已有的 Claude 或 ChatGPT 訂閱，不需要另外申請 API Key、也不需要另外付費。對已有訂閱的使用者，這是成本最低的入門方式。

---

## MCP 擴充：讓 goose 做更多事

goose 採用 **Model Context Protocol（MCP）** 標準，這是 Anthropic 提出、現在已成為業界共識的 AI 工具整合協議。

透過 MCP，goose 可以連接：

- **Computer Controller**：控制瀏覽器、自動化桌面操作、網頁爬取
- **資料庫**：直接查詢 PostgreSQL、SQLite
- **開發工具**：GitHub、GitLab、Jira
- **設計工具**：Figma
- **通訊**：Slack、Gmail
- 以及社群持續貢獻的 70+ 個 server

在 Desktop App 的側邊欄直接開關 Extension，不需要手動設定設定檔。

---

## `.goosehints`：讓 goose 理解你的專案

goose 支援在專案根目錄放 `.goosehints` 檔案，功能類似 Claude Code 的 `CLAUDE.md`——讓 agent 在每次 session 開始時載入專案慣例：

```
這是一個 Astro + Cloudflare Workers 專案
套件管理器用 pnpm，不要用 npm 或 yarn
commit message 用繁體中文，格式：type(scope): 描述
lint 指令：pnpm lint
```

有了這個，每次問 goose「幫我新增一個功能」，它就已經知道你的技術棧和慣例，不需要每次重新說明。

---

## Custom Distributions：打包自己的 goose

goose 支援打包「發行版」——預設好特定 provider、extensions、品牌的客製化版本。

這個設計主要面向企業場景：IT 部門可以打包一個「公司專屬 goose」，預設連接內部 LLM、開啟特定 MCP server、鎖定某些權限，再發給全公司員工使用，不需要每個人自己設定。

---

## 與 Claude Code、Cursor 的差異

| | **goose** | **Claude Code** | **Cursor** |
|--|-----------|-----------------|------------|
| 授權 | Apache 2.0 開源 | 商業（Anthropic） | 商業 |
| LLM | 15+ 供應商，可切換 | 僅 Claude | 多供應商，但 IDE 綁定 |
| 平台 | Desktop + CLI + API | CLI | IDE 插件 |
| 擴充 | MCP 標準，70+ servers | MCP（持續擴充中） | 插件市集 |
| 治理 | Linux Foundation AAIF | Anthropic | Anysphere |
| 自架 | 可以 | 不行 | 不行 |

Claude Code 的優勢在深度整合 Claude 模型和 Anthropic 生態；Cursor 則是 IDE 使用者最順手的選擇。goose 的核心價值是**不鎖廠商**——你可以今天用 Claude、明天換 Gemini、本地環境跑 Ollama，同一套工具不換。

---

## 適合的使用場景

- 想要開源、可審計程式碼的團隊
- 企業需要自架、管控 AI 工具存取的場景
- 已有 ChatGPT 或 Claude 訂閱、不想再另付 API 費用的個人開發者
- 需要在多個 LLM 供應商之間切換、比較效果的研究者
- 想要不依賴特定 IDE 的終端機工作流

不適合的場景：如果你本來就是 Claude Code 重度使用者，且不需要切換模型，goose 提供的額外彈性未必值得遷移成本。

---

## 整體來說

goose 的核心取捨很清楚：**以彈性換取深度**。它不試圖在任何一個 LLM 上做到最好，而是讓你能在任何 LLM 上都有一致的 agent 體驗。在 Linux Foundation 的治理下，它也是目前少數有中立開放治理的 AI Agent 專案。

對於重視廠商獨立性、需要企業部署控制，或是想在多模型之間靈活切換的使用者，goose 值得認真評估。

---

## 參考資料

- [goose GitHub 專案（aaif-goose/goose）](https://github.com/aaif-goose/goose)
- [goose 官方文件](https://goose-docs.ai/docs/quickstart)
- [Agentic AI Foundation（AAIF）](https://aaif.io/)
- [Model Context Protocol 官網](https://modelcontextprotocol.io/)
- [ACP（Agent Communication Protocol）說明](https://goose-docs.ai/docs/guides/acp-providers)
