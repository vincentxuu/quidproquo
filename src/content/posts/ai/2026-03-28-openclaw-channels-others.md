---
title: "OpenClaw 其他頻道：Signal、iMessage、LINE、IRC、Nostr 與更多"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, signal, imessage, bluebubbles, line, irc, nostr, twitch, zalo]
lang: zh-TW
tldr: "Signal 用 signal-cli 注重隱私、iMessage 推薦走 BlueBubbles、LINE 用 webhook、IRC/Nostr/Twitch 各有特色。"
description: "OpenClaw 的小眾頻道設定指南：Signal、iMessage/BlueBubbles、LINE、IRC、Nostr、Twitch、Zalo 等。"
draft: false
---

除了主力三大和企業四家，OpenClaw 還支援一堆其他頻道。有些注重隱私（Signal），有些是特定市場（LINE、Zalo），有些是去中心化協議（Nostr、Matrix）。這篇一次整理。

## Signal

隱私導向，透過 `signal-cli`（外部 CLI）整合，用 HTTP JSON-RPC + SSE 通訊。

### 兩種設定路徑

**Path A（QR Linking）：** 連結既有 Signal 帳號。
```bash
signal-cli link -n "OpenClaw"
# 用 Signal app 掃 QR
```

**Path B（SMS 註冊）：** 註冊專用號碼，需要 captcha + SMS 驗證。建議用這種——避免跟個人帳號衝突。

### 設定

最小設定：bot 電話號碼（E.164）、CLI 路徑、DM policy、allowFrom。

### 營運細節

| 項目 | 數值 |
|---|---|
| 訊息分塊 | 4000 字元 |
| 媒體上限 | 8 MB |
| 群組歷史 | 50 則 |
| Typing / Read receipt | ✅（DM）|
| Reactions | ✅ emoji |

### 自聊保護

用個人帳號時，bot 會忽略自己的訊息，防止 loop。

### Daemon 模式

可以讓 OpenClaw 自動 spawn signal-cli，或連接外部管理的 daemon。

## iMessage

### 舊版（imsg CLI）

Legacy 系統，用 `imsg` CLI + JSON-RPC。**新部署建議用 BlueBubbles。**

需求：macOS + Messages app 登入 + Full Disk Access + Automation 權限。

遠端部署可以把 `cliPath` 指向一個 SSH wrapper script，連到有 Messages 的 Mac。

### BlueBubbles（推薦）

用 BlueBubbles macOS server 的 REST API，功能完整，是 OpenClaw 推薦的 iMessage 路徑。

設定在 `docs/channels/bluebubbles.md`。

### iMessage 通用限制

- 只能在 macOS 上用（直接或遠端）
- Mention 沒有原生 metadata，用 regex pattern 偵測
- 多帳號支援 per-account 覆寫

## LINE

Plugin 頻道，走 Messaging API webhook。

```bash
openclaw plugins install @openclaw/line
```

### 設定

1. 建 LINE Developers 帳號
2. 建 Messaging API channel
3. 拿 Channel Access Token + Channel Secret
4. 啟用 webhook，URL 指向 `https://gateway-host/line/webhook`
5. 設定 OpenClaw

### 安全

LINE 的 signature 驗證是 body-dependent（HMAC over raw body），OpenClaw 會在驗證前先做 body 大小和 timeout 檢查。

### 功能

| 支援 | 不支援 |
|---|---|
| DM | Reactions |
| Group | Thread |
| 媒體（10 MB）| |
| Flex messages | |
| Template messages | |
| Quick replies | |
| Location | |

訊息分塊 5000 字元，Markdown 會轉成 Flex card。多帳號用獨立 webhook path。

## IRC

內建頻道，經典。有 pairing 控制。設定在 `docs/channels/irc.md`。

## Nostr

Plugin 頻道，去中心化協議。設定在 `docs/channels/nostr.md`。

## Twitch

Plugin 頻道，直播聊天室整合。設定在 `docs/channels/twitch.md`。

## Zalo

Plugin 頻道，越南最大的通訊平台。有兩個版本：
- `zalo` — Official Account API
- `zalouser` — 個人帳號 API

設定在 `docs/channels/zalo.md` 和 `docs/channels/zalouser.md`。

## 其他 Plugin 頻道

| 頻道 | 說明 |
|---|---|
| Mattermost | 開源 Slack 替代品 |
| Nextcloud Talk | Nextcloud 的通訊功能 |
| Synology Chat | Synology NAS 內建聊天 |
| Tlon | 基於 Urbit 的通訊 |
| Voice Call | 語音通話整合 |
| WeChat | 微信（社群維護）|

## 所有頻道功能比較

| 頻道 | 安裝 | DM | Group | 媒體 | Streaming | Thread | 加密 |
|---|---|---|---|---|---|---|---|
| WhatsApp | Plugin | ✅ | ✅ | 50MB | ❌ | ❌ | ✅ (E2EE) |
| Telegram | 內建 | ✅ | ✅ | ✅ | ✅ | Forum | ❌ |
| Discord | 內建 | ✅ | Guild | ✅ | ✅ | ✅ | ❌ |
| Slack | 內建 | ✅ | Channel | ✅ | ✅ Native | ✅ | ❌ |
| Signal | 內建 | ✅ | ✅ | 8MB | ❌ | ❌ | ✅ (E2EE) |
| iMessage | 內建/BB | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ (E2EE) |
| Matrix | Plugin | ✅ | Room | ✅ | ❌ | ✅ | ✅ (E2EE) |
| Teams | Plugin | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| LINE | Plugin | ✅ | ✅ | 10MB | ❌ | ❌ | ❌ |
| IRC | 內建 | ✅ | Channel | ❌ | ❌ | ❌ | ❌ |

## 整體來說

OpenClaw 的頻道選擇廣到不太合理——從最主流的 WhatsApp 到去中心化的 Nostr 都有。大部分人只需要 1-3 個頻道。選擇標準很簡單：你的朋友/同事在哪裡，就接哪個。

## 參考資料

本篇整理自以下 OpenClaw 原始文件：

- [docs/channels/signal.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/signal.md) — Signal 設定
- [docs/channels/imessage.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/imessage.md) — iMessage（legacy）
- [docs/channels/bluebubbles.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/bluebubbles.md) — BlueBubbles（推薦 iMessage）
- [docs/channels/line.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/line.md) — LINE
- [docs/channels/irc.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/irc.md) — IRC
- [docs/channels/nostr.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/nostr.md) — Nostr
- [docs/channels/twitch.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/twitch.md) — Twitch
- [docs/channels/zalo.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/zalo.md) — Zalo
- [docs/channels/zalouser.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/zalouser.md) — Zalo User
- [docs/channels/mattermost.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/mattermost.md) — Mattermost
- [docs/channels/nextcloud-talk.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/nextcloud-talk.md) — Nextcloud Talk
- [docs/channels/synology-chat.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/synology-chat.md) — Synology Chat
- [docs/channels/tlon.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/tlon.md) — Tlon
