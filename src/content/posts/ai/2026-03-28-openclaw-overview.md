---
title: "OpenClaw 文件導讀：200+ 份文件，從哪讀起？"
date: 2026-03-28
category: ai
tags: [openclaw, ai-gateway, self-hosted, documentation, guide]
lang: zh-TW
tldr: "OpenClaw 有 200+ 份文件，這篇幫你搞懂全貌、知道每塊在講什麼、依你的角色決定從哪讀起。"
description: "OpenClaw 開源 AI 閘道器的完整文件導讀，涵蓋 16 個目錄、335 份文件的系列文章地圖。"
draft: false
---

OpenClaw 是一個開源、自架的 AI 閘道器——一個 Gateway 程式串接 WhatsApp、Telegram、Discord、iMessage 等 24+ 聊天平台到 AI agent。它的文件有 **16 個目錄、335 份檔案**，從安裝到威脅模型都有。這篇是整個系列的起點：先看全貌，再決定從哪讀起。

## OpenClaw 在做什麼

```
聊天 App (WhatsApp / Telegram / Discord / iMessage / Slack / ...)
       ↓
   Gateway（本地運行，port 18789）
       ↓
  ┌────┼────┬────────┬──────────┬──────────┐
  AI   CLI   Web UI   macOS App   手機 Node
Agent              (Control UI)   (iOS/Android)
```

你從手機傳一則訊息，Gateway 路由到 AI agent，agent 用工具做事（讀檔、跑指令、開瀏覽器、搜尋），再把結果送回你的聊天 app。Gateway 是唯一的控制平面，所有東西跑在你自己的機器上。

這不只是一個聊天機器人框架。它是一套完整的 AI agent 營運系統，涵蓋：多模型供應商切換、沙箱隔離、排程自動化、Plugin 生態、Mobile Node 整合、企業級存取控制。

## 文件全貌

| 目錄 | 檔案數 | 在講什麼 |
|---|---|---|
| `cli/` | 48 | 每個 CLI 指令的用法與參數 |
| `tools/` | 40 | 瀏覽器控制、8 種搜尋引擎、Sub-Agent、Skills、Exec、TTS、PDF... |
| `providers/` | 38 | 35+ 模型供應商各自的認證與設定（Anthropic、OpenAI、Google、DeepSeek、Ollama...）|
| `gateway/` | 34 | Gateway 設定、網路模型、Protocol、API、沙箱、Secrets、遠端存取 |
| `concepts/` | 29 | 核心架構概念：Agent Loop、Session、Memory、Streaming、Context Engine... |
| `channels/` | 29 | 24+ 頻道各自的設定：WhatsApp QR 配對、Telegram Bot、Discord、Slack、Signal... |
| `install/` | 27 | npm、Docker、K8s、Nix、Bun、9 個雲平台、Raspberry Pi、Ansible |
| `plugins/` | 17 | Plugin SDK、架構、Channel/Provider Plugin 開發、測試、發布 |
| `reference/` | 16 | AGENTS.md 模板、Token 計費、Prompt Caching、RPC、Release 流程 |
| `platforms/` | 10 | macOS、Linux、Windows/WSL2、iOS、Android 各自的注意事項 |
| `automation/` | 9 | Cron 排程、Webhook、Standing Orders、Gmail PubSub、Hooks |
| `nodes/` | 9 | iOS/Android Node 配對、Camera、Audio、Voice Wake、Location |
| `help/` | 7 | FAQ、疑難排解、Debug、環境問題 |
| `web/` | 5 | Control UI、Dashboard、WebChat、TUI |
| `security/` | 3 | MITRE ATLAS 威脅模型、Formal Verification |
| 根目錄 | ~12 | Pi 整合架構、Auth 語意、CI、VPS、網路拓撲 |

## 系列文章地圖

這個系列共 36 篇，分成 12 個區塊。以下是每個區塊的重點和適合的讀者。

### 入門篇（#1-3）

| # | 標題 | 你會知道 |
|---|---|---|
| 1 | 本篇 | 全貌、文件結構、從哪讀起 |
| 2 | 安裝指南（上）：本機部署 | npm / Docker / Nix / Bun / Podman / Raspberry Pi |
| 3 | 安裝指南（下）：雲平台與 K8s | Azure / GCP / DigitalOcean / Hetzner / Fly.io / Railway / K8s / Ansible |

**適合：** 所有人。先裝起來再說。

### 平台篇（#4-5）

| # | 標題 | 你會知道 |
|---|---|---|
| 4 | 桌面平台：macOS、Linux、Windows | 各 OS 的差異、WSL2 設定、macOS 選單列 app |
| 5 | 行動平台：iOS 與 Android | 手機 app 安裝、配對流程 |

**適合：** 多裝置使用者。

### 模型篇（#6-8）

| # | 標題 | 你會知道 |
|---|---|---|
| 6 | 模型需求與供應商生態 | 35+ 供應商總覽、Tool Use 需求、三大供應商設定 |
| 7 | 更多供應商：DeepSeek、Groq、Ollama、OpenRouter... | 其餘 30+ 供應商的認證與設定 |
| 8 | 模型進階：Failover、Prompt Caching 與 Token 計費 | Auth 輪替、冷卻機制、計費追蹤 |

**適合：** 想選模型、省錢、或確保高可用的人。

### Agent 核心篇（#9-12）

| # | 標題 | 你會知道 |
|---|---|---|
| 9 | 多 Agent 與 Delegate 架構 | 多 Agent 路由、Binding、Delegate 代理人 |
| 10 | Agent Runtime：Workspace、System Prompt 與 Bootstrap | Agent 的「家」長什麼樣、怎麼自訂人格 |
| 11 | Agent Loop：執行迴圈、Streaming 與 Queue | 一次 agent 執行的完整流程 |
| 12 | Session、Memory 與 Compaction | 對話怎麼存、怎麼壓縮、怎麼記住事情 |

**適合：** 想深入理解 agent 怎麼運作的人。這是 OpenClaw 的核心。

### 頻道篇（#13-16）

| # | 標題 | 你會知道 |
|---|---|---|
| 13 | 頻道總覽：配對、群組與路由 | DM/Node Pairing、群組策略、路由規則 |
| 14 | 主力頻道：WhatsApp、Telegram、Discord | 三大頻道的完整設定 |
| 15 | 企業頻道：Slack、Teams、Google Chat、Matrix | 企業通訊平台整合 |
| 16 | 其他頻道：Signal、iMessage、LINE、IRC、Nostr... | 小眾但有趣的頻道 |

**適合：** 想把 AI 接到特定聊天平台的人。

### 安全篇（#17-19）

| # | 標題 | 你會知道 |
|---|---|---|
| 17 | 沙箱機制：Docker、SSH 與 OpenShell | 三種沙箱後端、Tool Policy、Elevated 逃生艙 |
| 18 | 威脅模型：MITRE ATLAS 安全分析 | Prompt Injection、Token 竊取、Supply Chain 風險 |
| 19 | 存取控制：Auth、Secrets 與 OAuth | 認證機制、Secret 管理、Trusted Proxy |

**適合：** 在意安全的人。OpenClaw 讓 AI 執行系統指令，安全不是選配。

### 工具篇（#20-23）

| # | 標題 | 你會知道 |
|---|---|---|
| 20 | 瀏覽器控制與搜尋引擎整合 | Browser Tool、8 種搜尋、Firecrawl |
| 21 | Sub-Agent、Skills 與 ClawHub | 子代理、技能系統、社群市集 |
| 22 | 執行工具：Exec、Thinking、Diffs | 指令執行、深度推理、程式碼 Patch |
| 23 | 更多工具：TTS、PDF、Lobster、Reactions | 語音合成、PDF、Pipeline、表情回應 |

**適合：** 想知道 AI agent 能做哪些事的人。

### 自動化篇（#24-25）

| # | 標題 | 你會知道 |
|---|---|---|
| 24 | Cron、Webhook 與事件驅動自動化 | 排程、HTTP Hook、Gmail PubSub、Poll |
| 25 | Standing Orders：讓 Agent 自主行動 | 授權框架、Scope/Trigger/Escalation |

**適合：** 想讓 AI 定時做事、接收外部事件的人。

### Gateway 篇（#26-29）

| # | 標題 | 你會知道 |
|---|---|---|
| 26 | Gateway 設定與 Hot Reload | 設定檔結構、即時重載、Config RPC |
| 27 | Gateway 網路：Protocol 與遠端存取 | 網路模型、Tailscale、Bridge Protocol |
| 28 | 多 Gateway 與背景程序 | 多實例部署、Profile 隔離、Rescue Bot |
| 29 | Gateway API：OpenAI 相容與工具呼叫 | HTTP API、OpenResponses、RPC |

**適合：** 維運人員、想遠端存取或開 API 給其他系統的人。

### Plugin 篇（#30-31）

| # | 標題 | 你會知道 |
|---|---|---|
| 30 | Plugin 架構與 SDK 總覽 | Plugin 系統設計、SDK 入口、Runtime |
| 31 | 打造自己的 Plugin | Channel/Provider Plugin 開發、測試、發布 |

**適合：** 想擴充 OpenClaw 功能的開發者。

### 介面篇（#32-33）

| # | 標題 | 你會知道 |
|---|---|---|
| 32 | Mobile Nodes：配對、Canvas、Camera、Voice Wake | 手機作為 AI 的感官延伸 |
| 33 | Web UI：Control UI、Dashboard、WebChat、TUI | 所有使用者介面的功能與設定 |

**適合：** 日常使用者、想從瀏覽器或手機操作的人。

### 營運與參考篇（#34-36）

| # | 標題 | 你會知道 |
|---|---|---|
| 34 | 維運與疑難排解 | Doctor、Health Check、Logging、常見問題 |
| 35 | Pi 整合架構與 Reference 速查 | Agent Runtime 引擎、各種參考資料 |
| 附錄 | CLI 指令速查手冊 | 48 個 CLI 指令的用法 |

**適合：** 遇到問題的人、想查特定指令的人。

## 你是哪種讀者？

**「我只想快速跑起來」** → #1 → #2 → #14（挑一個頻道）→ #6（選模型）。四篇搞定。

**「我想當日常使用者」** → 上面四篇 + #33（Web UI）+ #12（Session）+ #24（自動化排程）。

**「我想深入理解架構」** → #9-12（Agent 核心）→ #11（Agent Loop）→ #35（Pi 整合）→ #17-19（安全）。

**「我想部署到正式環境」** → #3（雲平台）→ #26-29（Gateway 營運）→ #17-19（安全）→ #34（疑難排解）。

**「我想開發 Plugin」** → #30-31 + #21（Skills）+ #22（Exec）+ #29（API）。

**「我想接企業通訊」** → #13（頻道總覽）→ #15（Slack/Teams）→ #19（存取控制）→ #9（多 Agent）。

## 整體來說

OpenClaw 的文件量反映了它的野心：不只是「聊天機器人框架」，而是一套完整的 AI agent 營運系統。從模型供應商管理、沙箱安全、到 MITRE ATLAS 威脅分析都有。335 份文件看起來嚇人，但組織結構清楚——知道自己要什麼，就能快速找到對應的區塊。

這個系列會把每塊都拆開來講。接下來從安裝開始。

## 參考資料

本篇整理自以下 OpenClaw 原始文件：

- [docs/index.md](https://github.com/openclaw/openclaw/blob/main/docs/index.md) — 首頁與專案總覽
- [docs/docs.json](https://github.com/openclaw/openclaw/blob/main/docs/docs.json) — 文件站導覽結構（Mintlify 設定）
- [docs/start/getting-started.md](https://github.com/openclaw/openclaw/blob/main/docs/start/getting-started.md) — 快速上手指南
- [docs/concepts/features.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/features.md) — 完整功能列表
- [docs/concepts/architecture.md](https://github.com/openclaw/openclaw/blob/main/docs/concepts/architecture.md) — 核心架構
- [README.md](https://github.com/openclaw/openclaw/blob/main/README.md) — 專案 README
