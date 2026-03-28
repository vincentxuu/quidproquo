---
title: "OpenClaw 企業頻道：Slack、Teams、Google Chat 與 Matrix"
date: 2026-03-28
category: ai
tags: [openclaw, slack, microsoft-teams, google-chat, matrix, enterprise]
lang: zh-TW
tldr: "Slack 有最完整的企業功能（native streaming、slash commands），Teams 需 Azure Bot 設定，Matrix 支援 E2EE 加密。"
description: "OpenClaw 的企業通訊平台整合：Slack（Socket/HTTP Mode）、Microsoft Teams、Google Chat 與 Matrix（含 E2EE）。"
draft: false
---

企業環境通常用 Slack、Microsoft Teams、或自架的 Matrix。這篇講這些頻道的設定方式和各自的特點。

## Slack

OpenClaw 對 Slack 的支援最完整，有兩種連線模式。

### Socket Mode（預設）

1. 在 Slack App 設定裡啟用 Socket Mode
2. 建立 App Token（`xapp-...`，scope：`connections:write`）
3. 安裝 app，拿 Bot Token（`xoxb-...`）
4. 設定兩個 token + 訂閱 bot events
5. 啟動 Gateway

### HTTP Mode

1. 設 `mode: "http"`
2. 拿 Signing Secret
3. 設定 webhook path（預設 `/slack/events`）
4. 在 Slack 註冊 Events/Interactivity/Slash commands 的 URL

### 特色功能

**Native Streaming：** Slack 的 Agents and AI Apps 功能啟用後，支援原生 streaming（`partial`（預設）/ `block` / `progress` / `off`）。

**Native Slash Commands：** 設 `commands.native: true`，然後在 Slack 註冊對應的 command。注意：`/status` 被 Slack 保留，用 `/agentstatus`。

**Interactive Replies：** 啟用後 agent 可以用 Slack button 和 select menu。

### 存取控制

DM：pairing / allowlist / open / disabled。
Channel：open / allowlist / disabled，預設需要 mention。

### 疑難排解

頻道存取問題的檢查順序：policy → allowlist → mention → user restrictions。
DM 問題：`dm.enabled` → policy → pairing approvals。
診斷：`openclaw channels status --probe` + `openclaw doctor`。

## Microsoft Teams

Teams 是 **plugin**，需要另外安裝。

```bash
openclaw plugins install @openclaw/msteams
```

### 設定

需要三個 Azure Bot 憑證：App ID、App Password、Tenant ID。

流程：建 Azure Bot resource → 設 messaging endpoint → 啟用 Teams channel → 設定 OpenClaw。

### 功能

| 功能 | 支援 |
|---|---|
| DM | ✅ |
| Group chat | ✅ |
| Channel | ✅ |
| File 附件 | ✅（個人對話）|
| Adaptive Cards | ✅（poll、格式化內容）|
| 訊息歷史 | ✅（可設限制）|

### 存取控制

DM 預設 pairing。Group/Channel 預設 allowlist。建議用穩定的 Teams/Channel ID，不要用可變的顯示名稱。

### 限制

- Webhook timeout 限制
- Channel 和群組的檔案發送需要 SharePoint 整合 + Graph API 權限
- 下載 hosted image 需要額外的 Microsoft Graph 權限

## Google Chat

HTTP webhook 整合，設定相對簡單。設定細節在 `docs/channels/googlechat.md`。

## Matrix

Matrix 是 plugin，支援最完整的安全功能——包含端對端加密（E2EE）。

```bash
openclaw plugins install @openclaw/matrix
```

### 認證方式

**Token-based（推薦）：**

```json5
{
  channels: {
    matrix: {
      enabled: true,
      homeserver: "https://matrix.example.org",
      accessToken: "syt_xxx",
      dm: { policy: "pairing" }
    }
  }
}
```

**Password-based：** `homeserver` + `userId` + `password` + `deviceName`。

### E2EE 加密

```json5
{ encryption: true }
```

管理指令：

```bash
openclaw matrix verify status           # 檢查驗證狀態
openclaw matrix verify bootstrap        # 設定 cross-signing
openclaw matrix verify backup status    # 備份狀態
openclaw matrix verify backup restore   # 還原加密訊息
openclaw matrix devices list            # 列出裝置
openclaw matrix devices prune-stale     # 清除舊裝置
```

「Verified」需要 cross-signing（你的身份簽署），不只是本地 trust。

### Thread 支援

| 模式 | 行為 |
|---|---|
| `off` | 回覆在 top-level |
| `inbound` | 只在收到 threaded 訊息時才用 thread |
| `always` | 群組回覆一律用 thread |

### 多帳號

```json5
{
  matrix: {
    defaultAccount: "assistant",
    accounts: {
      assistant: { /* config */ },
      alerts: { /* config */ }
    }
  }
}
```

### Bot 間通訊

預設忽略其他 OpenClaw Matrix 帳號的訊息（防 self-reply loop）。設 `allowBots: "mentions"` 可以讓 agent 間透過 mention 互動。

### 其他功能

Reactions、Polls、Location sharing、媒體附件、DM 狀態修復（`openclaw matrix direct repair`）、私有/LAN homeserver 支援。

## Feishu（飛書）

Plugin 頻道，給中國企業環境用。設定在 `docs/channels/feishu.md`。

## 企業頻道比較

| | Slack | Teams | Matrix | Google Chat |
|---|---|---|---|---|
| 安裝 | 內建 | Plugin | Plugin | 內建 |
| 連線模式 | Socket / HTTP | Azure Bot | SDK | Webhook |
| DM | ✅ | ✅ | ✅ | ✅ |
| Group/Channel | ✅ | ✅ | ✅ (Room) | ✅ |
| Thread | ✅ | ✅ | ✅ | ❌ |
| E2EE | ❌ | ❌ | ✅ | ❌ |
| Native Streaming | ✅ | ❌ | ❌ | ❌ |
| Interactive | ✅ | Adaptive Cards | Reactions/Polls | ❌ |
| 多帳號 | ✅ | ✅ | ✅ | ✅ |

## 整體來說

Slack 是企業頻道裡功能最完整的——native streaming、slash commands、interactive replies 都有。Teams 設定較複雜但覆蓋 Microsoft 生態。Matrix 適合在意隱私和自架的團隊，E2EE 是獨家優勢。

## 參考資料

本篇整理自以下 OpenClaw 原始文件：

- [docs/channels/slack.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/slack.md) — Slack 設定
- [docs/channels/msteams.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/msteams.md) — Microsoft Teams 設定
- [docs/channels/googlechat.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/googlechat.md) — Google Chat 設定
- [docs/channels/matrix.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/matrix.md) — Matrix 設定
- [docs/channels/feishu.md](https://github.com/openclaw/openclaw/blob/main/docs/channels/feishu.md) — Feishu 設定
