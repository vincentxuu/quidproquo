---
title: "OpenClaw 頻道總覽：配對、群組與路由"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, channels, pairing, groups, routing, broadcast]
lang: zh-TW
tldr: "OpenClaw 支援 24+ 頻道同時運行，用 Pairing 控制誰能聊、用 Group Policy 控制群組行為、用 Routing 決定訊息送到哪個 agent。"
description: "OpenClaw 的頻道總覽、DM/Node Pairing 機制、群組策略、路由規則與 Broadcast Groups。"
draft: false
---

OpenClaw 的頻道系統讓你用一個 Gateway 同時接多個聊天平台。這篇講跨頻道共通的機制：配對（Pairing）、群組策略（Groups）、路由（Routing）和廣播（Broadcast）。

## 支援的頻道

### 內建頻道

| 頻道 | 特點 |
|---|---|
| WhatsApp | 最多人用，Baileys 實作，QR 配對 |
| Telegram | 最快設定，Bot API，支援 forum topics |
| Discord | Bot API，支援 server/channel/DM |
| Slack | Workspace app，Bolt SDK，Socket Mode 或 HTTP |
| Signal | signal-cli，隱私導向 |
| Google Chat | HTTP webhook |
| IRC | 經典，有 pairing 控制 |
| WebChat | Gateway UI over WebSocket |

### Plugin 頻道

BlueBubbles (iMessage)、LINE、Matrix、Mattermost、Microsoft Teams、Feishu、Nextcloud Talk、Nostr、Synology Chat、Tlon、Twitch、Voice Call、WeChat、Zalo。

**所有頻道可以同時運行。** 設定多個，OpenClaw 按 chat 路由。

### 設定速度比較

Telegram 最快（拿 bot token 就好）。WhatsApp 需要 QR 配對且在磁碟上存更多狀態。iMessage 推薦走 BlueBubbles。

## DM Pairing（配對）

當頻道用 `pairing` policy，陌生發送者會收到一個短碼，訊息先不處理，等你核准。

### 配對碼規格

- 8 個大寫字母（排除 0、O、1、I 等容易混淆的）
- **1 小時過期**
- 每個頻道最多 3 個 pending request，多的忽略

### 核准

```bash
openclaw pairing list telegram
openclaw pairing approve telegram <CODE>
```

### 支援配對的頻道

所有內建 + plugin 頻道都支援：bluebubbles、discord、feishu、googlechat、imessage、irc、line、matrix、mattermost、msteams、nextcloud-talk、nostr、signal、slack、synology-chat、telegram、twitch、whatsapp、zalo、zalouser。

### 狀態存放

- Pending：`~/.openclaw/credentials/<channel>-pairing.json`
- 已核准：`~/.openclaw/credentials/<channel>-allowFrom.json`

## Node 配對

手機或其他裝置作為 Node 連接 Gateway 時，也需要配對。

```bash
openclaw devices list
openclaw devices approve <requestId>
```

Telegram 配對（推薦給 iOS）：對 bot 發 `/pair`，拿到 setup code 貼到 iOS app。

Node 狀態存在 `~/.openclaw/devices/`。

## DM Policy

每個頻道的 DM 存取由 `dmPolicy` 控制：

| Policy | 行為 |
|---|---|
| `pairing`（預設）| 陌生人要配對碼 + 核准 |
| `allowlist` | 只允許 `allowFrom` 列表裡的人 |
| `open` | 任何人都能聊（需設 `allowFrom: ["*"]`）|
| `disabled` | 關閉 DM |

## 群組策略

群組有兩層控制：群組本身的存取 + 群組內誰能觸發 agent。

### Group Policy

| Policy | 行為 |
|---|---|
| `open` | 不檢查 allowlist，但 mention gating 仍有效 |
| `allowlist`（預設）| 只允許設定的群組 |
| `disabled` | 封鎖所有群組 |

### Mention Gating

群組預設需要 @mention 才回覆。可以用自訂 mention pattern（如 `@openclaw`、電話號碼），也可以設 `requireMention: false` 關掉。

回覆 bot 訊息也算 implicit mention（在支援 reply metadata 的平台上）。

### 群組 Session 隔離

群組的 session key 格式：`agent:<agentId>:<channel>:group:<id>`。跟 DM session 完全分開，可以做差異化 sandboxing——DM 有完整工具權限，群組限制工具。

### Per-Group 覆寫

可以對特定群組設不同的 mention 規則、sender allowlist、工具限制。

## 路由（Channel Routing）

路由是**確定性的**——回覆一定送回訊息來源的頻道。模型不選頻道，設定控制一切。

### 路由優先順序

```
1. Exact peer match（精確 DM/群組）
2. Parent peer（thread 繼承）
3. Guild + roles（Discord）
4. Guild（Discord）
5. Team（Slack）
6. Account ID
7. Channel（any account）
8. Default agent fallback
```

多個條件是 AND——全部符合才 match。

### Session Key 結構

| 類型 | 格式 |
|---|---|
| Direct | `agent:<agentId>:main`（或 `direct:<peerId>`）|
| Group | `agent:<agentId>:<channel>:group:<id>` |
| Thread | 加 `:thread:<id>` 或 `:topic:<id>` |

## Broadcast Groups（實驗性）

讓多個 agent **同時處理同一則訊息**。目前只支援 WhatsApp，Telegram/Discord/Slack 計畫中。

### 用途

- **專業分工團隊** — code reviewer + doc generator + security auditor 同時處理
- **多語言** — 語言偵測 + 各語言 agent
- **QA** — 主 agent 回答 + QA agent 審查

### 設定

```json5
{
  broadcast: {
    "120363403215116621@g.us": ["alfred", "baerbel", "assistant3"]
  }
}
```

### 處理策略

| 策略 | 行為 |
|---|---|
| `parallel`（預設）| 所有 agent 同時處理 |
| `sequential` | 按順序，前一個完成才到下一個 |

每個 agent 有完全獨立的 session、workspace、sandbox、工具權限。建議限制在 5-10 個 agent，較簡單的任務用較輕的模型。

## 整體來說

OpenClaw 的頻道系統核心邏輯：

1. **Pairing** 控制「誰能跟 agent 聊」
2. **Group Policy + Mention Gating** 控制「群組裡怎麼互動」
3. **Routing** 控制「訊息送到哪個 agent」
4. **Broadcast** 讓「多個 agent 同時處理同一則訊息」

這些都是跨頻道通用的。下面三篇會講各頻道的具體設定。

## 參考資料

本篇整理自以下 OpenClaw 原始文件：

- [docs/channels/index.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/index.md) — 頻道總覽
- [docs/channels/pairing.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/pairing.md) — 配對機制
- [docs/channels/groups.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/groups.md) — 群組設定
- [docs/channels/group-messages.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/group-messages.md) — 群組訊息
- [docs/channels/channel-routing.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/channel-routing.md) — 路由機制
- [docs/channels/broadcast-groups.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/broadcast-groups.md) — Broadcast Groups
- [docs/channels/location.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/location.md) — Location 功能
- [docs/channels/troubleshooting.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/troubleshooting.md) — 頻道疑難排解
