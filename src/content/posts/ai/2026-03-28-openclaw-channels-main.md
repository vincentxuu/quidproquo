---
title: "OpenClaw 主力頻道：WhatsApp、Telegram、Discord"
date: 2026-03-28
category: ai
tags: [openclaw, whatsapp, telegram, discord, channels]
lang: zh-TW
tldr: "WhatsApp 用 QR 配對 + Baileys、Telegram 用 Bot Token 最快上手、Discord 支援 guild/thread/button 互動元件。"
description: "OpenClaw 三大主力頻道的完整設定指南：WhatsApp QR 配對、Telegram Bot API、Discord guild 與互動元件。"
draft: false
---

WhatsApp、Telegram、Discord 是 OpenClaw 用戶最常用的三個頻道。各有不同的設定方式和特色功能。

## WhatsApp

最多人用的頻道。用 WhatsApp Web (Baileys) 實作，需要 QR 配對。

### 安裝

WhatsApp 是 on-demand plugin，`openclaw onboard` 或 `openclaw channels add --channel whatsapp` 時會自動提示安裝。也可以手動：

```bash
openclaw plugins install @openclaw/whatsapp
```

### 設定

```json5
{
  channels: {
    whatsapp: {
      dmPolicy: "allowlist",
      allowFrom: ["+15551234567"]  // E.164 格式
    }
  }
}
```

### 連結帳號

```bash
openclaw channels login --channel whatsapp
# 掃 QR code

# 多帳號
openclaw channels login --channel whatsapp --account work
```

### 存取控制

**DM：** pairing（預設）/ allowlist / open / disabled。電話號碼自動正規化為 E.164。

**群組：** 兩層——群組 allowlist + sender 授權。可設 open / allowlist / disabled。

**Mention：** 群組回覆需要 bot mention 或回覆 bot 訊息。Session 內可用 `/activation mention` 或 `/activation always` 切換。

### 營運細節

| 項目 | 數值 |
|---|---|
| 訊息分塊 | 4000 字元 |
| 媒體上限 | 50 MB（可設定）|
| 群組歷史 buffer | 50 則（預設）|
| Read receipt | 預設開，可關 |
| 自聊保護 | 連結號碼在 allowlist 時自動啟用 |

憑證存在 `~/.openclaw/credentials/whatsapp/<accountId>/creds.json`。舊版路徑自動遷移。

### 登出

```bash
openclaw channels logout --channel whatsapp [--account <id>]
```

## Telegram

設定最快的頻道——拿個 bot token 就好。

### 設定步驟

1. 在 Telegram 找 @BotFather → `/newbot` → 拿 token
2. 設定 token：設定檔或 `TELEGRAM_BOT_TOKEN` 環境變數
3. `channels.telegram.enabled: true`
4. 啟動 Gateway

### 存取控制

DM policy 同樣四選一。群組可以設 `requireMention` 和 `groupAllowFrom`。

**Privacy Mode 注意：** Bot 預設只能看到對它的訊息。要看群組所有訊息，用 `/setprivacy` 關掉或給 bot admin 權限。

### 特色功能

| 功能 | 說明 |
|---|---|
| 即時串流 | 用 message editing 實現 live streaming |
| Inline keyboard | 可開啟按鈕互動 |
| Forum topics | 每個 topic 獨立 session |
| 自訂 command menu | 可設定 |
| Sticker | 支援 |
| Reactions | 可設定通知 |
| 裝置配對 | 支援 iOS app 配對 |

### 通訊模式

Long polling（預設）或 Webhook。

## Discord

最豐富的互動元件支援。

### 設定步驟

1. 在 Discord Developer Portal 建 Application + Bot
2. 啟用 **Message Content Intent**（必要）和 **Server Members Intent**（建議）
3. 產生 OAuth2 權限（基本 messaging + file + embed）
4. 拿 Bot token、Server ID、User ID
5. 設定 token（環境變數）
6. 啟動 Gateway

### Guild 設定

```json5
{
  channels: {
    discord: {
      guilds: {
        "<server-id>": {
          requireMention: true,
          historyLimit: 20
        }
      }
    }
  }
}
```

支援 per-guild、per-channel 覆寫。

### 互動元件

Discord 是唯一支援這些的頻道：

| 元件 | 說明 |
|---|---|
| Button | 可設 `allowedUsers` 限制誰能點 |
| Dropdown menu | 下拉選單 |
| Modal form | 最多 5 個欄位的表單 |
| File gallery | 媒體附件 |
| Reusable components | 多次互動到過期 |

### 存取控制

**DM：** pairing / allowlist / open / disabled。

**Guild：** open / allowlist / disabled。預設 allowlist。

**Role-based routing：** 可以根據 user role 路由到不同 agent。

### Reply 與 Streaming

| 設定 | 選項 |
|---|---|
| Reply mode | `off`（預設）/ `first` / `all` |
| Streaming | `off` / `partial` / `block` / `progress` |

Forum 和 thread 支援自動建立 thread + isolated session。

## 三者比較

| | WhatsApp | Telegram | Discord |
|---|---|---|---|
| 設定難度 | 中（QR 配對）| 低（bot token）| 中（Developer Portal）|
| DM 支援 | ✅ | ✅ | ✅ |
| 群組支援 | ✅ | ✅ | ✅ (Guild) |
| 互動元件 | ❌ | Inline keyboard | Button/Dropdown/Modal |
| 即時串流 | ❌ | ✅ (edit) | ✅ (edit) |
| Thread | ❌ | ✅ (Forum topics) | ✅ (Thread) |
| 媒體 | ✅ 50MB | ✅ | ✅ |
| 多帳號 | ✅ | ✅ | ✅ |
| Role routing | ❌ | ❌ | ✅ |

## 整體來說

快速上手選 Telegram。手機隨時聊選 WhatsApp。需要互動元件和 role routing 選 Discord。三個可以同時開，Gateway 自動路由。

## 參考資料

本篇整理自以下 OpenClaw 原始文件：

- [docs/channels/whatsapp.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/whatsapp.md) — WhatsApp 設定
- [docs/channels/telegram.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/telegram.md) — Telegram 設定
- [docs/channels/discord.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/discord.md) — Discord 設定
