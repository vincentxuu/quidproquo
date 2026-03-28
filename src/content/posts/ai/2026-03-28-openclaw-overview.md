---
title: "OpenClaw 導讀：自架的多頻道 AI 閘道器"
date: 2026-03-28
category: ai
tags: [openclaw, ai-gateway, self-hosted, whatsapp, telegram, discord]
lang: zh-TW
tldr: "OpenClaw 是開源自架的 AI 閘道器，一個 Gateway 同時串接 WhatsApp、Telegram、Discord、iMessage 到 AI agent。"
description: "OpenClaw 開源專案導讀：架構、文件結構、核心特色與快速上手指南。"
draft: false
---

OpenClaw 是一個開源、自架的 AI 閘道器。一個 Gateway 程式，就能把 WhatsApp、Telegram、Discord、iMessage 等聊天平台串接到 AI coding agent。從手機的任何通訊 app 傳訊息，OpenClaw 路由到 AI agent 再送回回應。這篇整理它的架構、文件結構和上手方式。

## 核心架構

```
聊天 App (WhatsApp / Telegram / Discord / iMessage)
       ↓
   Gateway（本地運行，port 18789）
       ↓
   AI Agent / CLI / Web UI / macOS App / 手機 Node
```

Gateway 是唯一的控制平面，負責 session 管理、路由、頻道連接。所有東西都跑在你自己的機器上，資料不經第三方。

## 核心特色

**多頻道（Multi-channel）** — 一個 Gateway 同時服務 WhatsApp、Telegram、Discord、iMessage。外掛還能加 Mattermost、Matrix、Teams，總共支援 24+ 平台。

**多 Agent 路由** — 每個 agent、workspace、發送者可以有獨立的 session。不同頻道可以路由到不同模型和人格。

**自架（Self-hosted）** — 跑在你自己的硬體上，MIT 授權，社群驅動。

**媒體支援** — 圖片、音訊、文件的收發與轉錄都支援。

**35+ 模型供應商** — Anthropic、OpenAI、Google、Ollama、vLLM 等，本地模型也可以。

**Mobile Nodes** — iOS 和 Android 配對後可用 Canvas、相機、語音功能。

**自動化工具** — 瀏覽器操控、排程（cron）、Webhook、搜尋整合（Brave、Perplexity）。

## 文件結構

OpenClaw 的文件組織得很清楚，按用途分目錄：

| 目錄 | 內容 |
|---|---|
| `start/` | 入門指南、安裝精靈 |
| `install/` | 各平台安裝方式（npm、Docker、Nix、Bun）|
| `channels/` | 各通訊平台設定 |
| `gateway/` | Gateway 核心設定、安全性、遠端存取 |
| `concepts/` | 核心概念：功能清單、多 agent 路由、session 等 |
| `nodes/` | iOS / Android 節點配對 |
| `web/` | Web Control UI 瀏覽器儀表板 |
| `providers/` | 38 份 LLM 供應商文件 |
| `plugins/` | 擴充套件 |
| `tools/` | 工具整合 |
| `security/` | 安全性與沙箱 |
| `zh-CN/`、`ja-JP/` | 簡中、日文翻譯 |

## 快速上手

需求：Node.js 24（建議）或 22.14+，加上一組 LLM API key。

```bash
# 安裝
npm install -g openclaw@latest

# 引導設定 + 安裝背景服務
openclaw onboard --install-daemon

# 確認 Gateway 狀態
openclaw gateway status

# 開啟瀏覽器儀表板
openclaw dashboard
```

設定檔在 `~/.openclaw/openclaw.json`，JSON5 格式。不改的話 OpenClaw 會用內建的 Pi agent 以 RPC 模式運行。

基本設定長這樣：

```json5
{
  channels: {
    whatsapp: {
      allowFrom: ["+15555550123"],
      groups: { "*": { requireMention: true } },
    },
  },
  messages: { groupChat: { mentionPatterns: ["@openclaw"] } },
}
```

## 建議閱讀順序

如果要自己讀 OpenClaw 文件，建議這個順序：

1. `start/getting-started` — 安裝與初次執行
2. `channels/telegram` — 最快上手的頻道
3. `concepts/features` — 完整功能列表
4. `concepts/multi-agent` — 多 agent 路由概念
5. `gateway/configuration` — 深入設定
6. `gateway/security` — 安全性
7. `providers/` — 選擇 LLM 供應商

## 整體來說

OpenClaw 的定位很明確：給開發者和 power user 一個自架的 AI 助手入口，從任何聊天 app 都能存取。跟直接用各家 AI 的 app 相比，它的價值在於統一入口、資料自主、多 agent 隔離。適合想要一個「隨身 AI 助手但不想依賴第三方服務」的人。
