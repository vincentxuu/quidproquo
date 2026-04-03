---
title: "Claude Code Channels：讓 Telegram、Discord、iMessage 推送事件到你的 AI 開發環境"
date: 2026-03-28
category: tech
tags: [claude-code, channels, telegram, discord, imessage, webhooks, dx]
lang: zh-TW
tldr: "Channels 把外部事件推送到正在跑的 Claude Code session——從手機用 Telegram 問問題、CI webhook 通知失敗、Discord 接收指令。雙向溝通：Claude 讀取事件後直接在同一個 channel 回覆。目前是 Research Preview。"
description: "介紹 Claude Code Channels 功能：透過 MCP 協議把外部事件（Telegram、Discord、iMessage、自製 webhook）推送到本地 session，讓 Claude 在你離開鍵盤時也能即時回應。涵蓋安裝設定、安全機制、Enterprise 控制，以及與 Remote Control / Web / Slack 的比較。"
draft: true
series:
  name: "Claude Code 自動化指南"
  order: 18
---

<!-- TODO: 待撰寫 -->
<!-- 參考官方文件：https://code.claude.com/docs/en/channels.md -->
<!-- 參考官方文件：https://code.claude.com/docs/en/channels-reference.md -->

## 預計大綱

### Channels 是什麼
- 把外部事件推送到正在跑的 Claude Code session
- 基於 MCP server 協議
- 雙向溝通：Claude 讀取事件 + 在同一 channel 回覆
- Research Preview 狀態，需要 v2.1.80+

### 與其他功能的比較
| 功能 | 做什麼 | 適合 |
|---|---|---|
| Claude Code on the web | 在雲端 sandbox 跑任務 | 非同步自包含工作 |
| Claude in Slack | @Claude 啟動 web session | 從團隊對話開始任務 |
| MCP server | Claude 主動查詢 | 按需讀取外部系統 |
| Remote Control | 從手機驅動本地 session | 遠端操控進行中的工作 |
| **Channels** | 外部事件推送到 session | 即時接收和回應外部事件 |

### 支援的 Channels

#### Telegram
- 建立 BotFather bot
- 安裝 plugin：`/plugin install telegram@claude-plugins-official`
- 設定 token：`/telegram:configure <token>`
- 啟動：`claude --channels plugin:telegram@claude-plugins-official`
- 配對帳號與 allowlist

#### Discord
- 建立 Discord bot + 啟用 Message Content Intent
- 設定 bot 權限
- 安裝 plugin 與設定 token
- 配對與安全設定

#### iMessage（macOS only）
- 不需要 bot token，直接讀取 Messages 資料庫
- 需要 Full Disk Access 權限
- 自己傳訊息給自己即可開始

### 安全機制
- Sender allowlist：只有允許的 ID 可以推送訊息
- Pairing code 機制
- Permission relay：channel 可以轉發權限提示
- `--channels` flag 控制每個 session 啟用哪些 channel

### Enterprise 控制
- `channelsEnabled`：master switch（Team/Enterprise 預設關閉）
- `allowedChannelPlugins`：限制可用的 channel plugins
- Pro/Max 用戶不受限制

### 自製 Channel
- 建立自己的 Channel server
- Webhook receiver 模式：接收 CI、error tracker、deploy pipeline 事件
- 測試用 `--dangerously-load-development-channels`

### 實際案例
- 用手機 Telegram 問 Claude 問題，在本機檔案上操作
- CI 失敗時 webhook 推送到 session，Claude 自動分析修復
- Discord 接收團隊指令，Claude 執行後回覆結果

## 參考資料

- [Claude Code Overview — Platforms and Integrations](https://docs.anthropic.com/en/docs/claude-code/overview) — 官方平台整合概覽，介紹 Channels 在整體生態中的定位
- [Claude Code Remote Control](https://docs.anthropic.com/en/docs/claude-code/remote-control) — Remote Control 功能說明，與 Channels 互補的遠端操控機制
- [Telegram BotFather 文件](https://core.telegram.org/bots#botfather) — 建立 Telegram Bot 的官方指南，Channels Telegram 整合的前置步驟
- [Discord Developer Portal — Bot 設定](https://discord.com/developers/docs/intro) — Discord Bot 建立與 Message Content Intent 設定的官方文件
- [Claude Code MCP](https://docs.anthropic.com/en/docs/claude-code/mcp) — MCP server 協議說明，Channels 底層基於 MCP 實作
- [Claude Code Settings](https://docs.anthropic.com/en/docs/claude-code/settings) — channelsEnabled、allowedChannelPlugins 等 Channels 相關設定欄位
- [Model Context Protocol 規範](https://modelcontextprotocol.io/introduction) — MCP 協議官方規範，理解 Channels 底層通訊架構的基礎
