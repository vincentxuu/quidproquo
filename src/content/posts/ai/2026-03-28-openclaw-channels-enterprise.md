---
title: "OpenClaw 企業頻道：Slack 的三種傳輸模式，與「內建」這欄已經不存在了"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, slack, microsoft-teams, matrix, google-chat, feishu, enterprise]
lang: zh-TW
series:
  name: "OpenClaw 文件導讀"
  order: 15
tldr: "企業頻道全部改成 plugin 了，包含以前內建的 Slack 與 Google Chat。Slack 現在有三種傳輸模式——Socket Mode、HTTP Request URLs、Relay——而官方明說它們在功能上已經對等，要按部署形狀選，不是按功能選。"
description: "OpenClaw 企業通訊頻道指南：Slack 三種傳輸模式的選擇矩陣、Enterprise Grid 組織層級安裝、多 Gateway 共用 Slack app 的陷阱，以及 Teams、Matrix、Google Chat、Feishu 的 plugin 化現況。"
draft: false
---

企業頻道這批有一個結構性變化要先講：**「安裝方式：內建」這一欄已經不存在了**。Slack、Google Chat、Microsoft Teams、Matrix、Feishu、Mattermost、Nextcloud Talk 現在**全部都是 official plugin**——一行指令安裝，或在 onboarding 時按需安裝，裝完要重啟 Gateway。

```bash
openclaw plugins install @openclaw/<channel>
```

核心裡真正內建的聊天介面只剩 WebChat。

## Slack：三種傳輸模式

Slack 是這批裡文件最厚的一個，因為它有三條路可走。官方對選擇給了一個很乾脆的判準：

> Socket Mode 與 HTTP Request URLs 在訊息、slash command、App Home、互動性上**已達功能對等。按部署形狀選，不是按功能選。**

| 面向 | Socket Mode（預設）| HTTP Request URLs |
|---|---|---|
| 需要公開 Gateway URL | 不需要 | **需要**（DNS、TLS、反向代理或 tunnel）|
| 對外連線 | 需連得到 `wss-primary.slack.com` | 不需對外 WS，只要能收 HTTPS |
| 需要的憑證 | bot token + 具 `connections:write` 的 App-Level Token | bot token + Signing Secret |
| 開發筆電／防火牆後 | 直接可用 | 需要公開 tunnel（ngrok、Cloudflare Tunnel、Tailscale Funnel）|
| 水平擴展 | 每台主機每個 app 一條 Socket 連線，多 Gateway 需要**分開的 Slack app** | 無狀態 POST handler，多個 replica 可共用一個 app |
| 同 Gateway 多帳號 | 支援，各自開自己的 WS | 支援，但每個帳號要有**不同的 `webhookPath`**（預設 `/slack/events`）以免註冊衝突 |
| Slash command | 走 WS 送達，`slash_commands[].url` 被忽略 | Slack POST 到 `slash_commands[].url`，**這個欄位必填**否則指令不會派送 |
| 請求簽章 | 不使用（靠 App-Level Token）| Slack 簽每個請求，OpenClaw 用 `signingSecret` 驗 |

簡單版：**單一 Gateway、開發機、能對外但收不到 inbound HTTPS 的內網 → Socket Mode**；**多個 replica 掛在負載平衡後、對外 WSS 被擋但 inbound HTTPS 可以、或你本來就在反向代理終結 Slack webhook → HTTP**。

### 多 Gateway 共用一個 Slack app 的陷阱

這條值得單獨標出來，因為它會造成很難查的間歇性行為：**Slack 可以為同一個 app 維持多條 Socket Mode 連線，而且可能把任一則 payload 送到任一條連線上。**

所以兩個分開的 OpenClaw gateway 如果共用同一個 Slack app，它們必須有**等價的路由與授權設定**——否則同樣一則訊息，落到 A gateway 就被處理、落到 B 就被丟掉，看起來像隨機失敗。要避開就選一個：每個 gateway 一個 Slack app、單一 relay 入口、或用 HTTP 模式掛在負載平衡後面。

### Relay 模式

第三種模式是給受管部署用的：**把 Slack 的入口和 Gateway 分開**。一個受信任的 router 擁有那唯一一條 Slack Socket Mode 連線，決定目的地 gateway，再透過已認證的 websocket 轉發型別化的事件。Gateway 仍然用自己的 bot token 去呼叫 Slack Web API。

```json5
{
  channels: {
    slack: {
      mode: "relay",
      botToken: { source: "env", provider: "default", id: "SLACK_BOT_TOKEN" },
      relay: {
        url: "wss://router.example.com/gateway/ws",
        authToken: { source: "env", provider: "default", id: "SLACK_RELAY_AUTH_TOKEN" },
        gatewayId: "team-gateway",
      },
    },
  },
}
```

安全上要理解一件事：**把 bearer token 和 router 的路由表當成 Slack 授權邊界的一部分**——被路由進來的事件會以「已授權的啟動」身分進入正常的 Slack 訊息處理流程。relay URL 除非指向 localhost，否則必須是 `wss://`。

### Enterprise Grid 組織層級安裝

一個 Slack 帳號可以接收 Enterprise Grid 組織層級安裝所涵蓋的**每個 workspace** 的訊息與互動。這條路只支援 Socket Mode 或 HTTP，**relay 模式不支援企業帳號**。

流程上要注意的是它需要人：得由 Enterprise Grid 的 Org Admin 或 Org Owner 核准 app、在組織層級安裝、並選擇涵蓋哪些 workspace，而且**在啟動 OpenClaw 之前要先確認 app 真的出現在每個預期的 workspace 裡**。

官方給了最小權限的 manifest（Socket 與 HTTP 各一份），涵蓋訊息、mention、reaction、pin、頻道建立與改名的事件路徑，加上互動性與單一的 `/openclaw` slash command。要抄的話直接用官方那份，不要自己湊 scope。

### 一個容易忽略的路由行為

**Slack 的多人 DM（MPIM）會被當成群組聊天路由**——所以群組政策、mention 行為、群組 session 規則都會套用到多人 DM 上。如果你設了 `groupPolicy: "allowlist"` 卻發現多人 DM 沒反應，這就是原因。

## 其他企業頻道

這幾個的共同點是**都已經 plugin 化**，設定細節在各自的文件頁：

| 頻道 | 類別 | 官方文件重點 |
|---|---|---|
| Microsoft Teams | official plugin | 支援狀態、能力與設定 |
| Google Chat | official plugin | app 的支援狀態與能力 |
| Matrix | official plugin | 支援狀態、設定範例 |
| Feishu（飛書）| official plugin | bot 總覽、功能與設定 |
| Mattermost | official plugin | bot 設定（開源 Slack 替代品）|
| Nextcloud Talk | official plugin | 支援狀態與設定 |

群組行為在這些頻道之間是**共用同一套規則**的——官方明確列出 Discord、iMessage、Matrix、Teams、QQBot、Signal、Slack、Telegram、WhatsApp、Zalo 都套用相同的群組規則，所以 `groupPolicy`、mention gating、`contextVisibility` 這些設定不用逐個頻道重學。

Feishu、Matrix、Teams、Slack 都在「會抓取補充上下文」的頻道清單裡，這代表 `contextVisibility` 對它們是有意義的設定——預設 `"all"` 會把引用、thread 歷史、轉發中繼資料原樣注入模型，**不管來源在不在 allowlist 上**。企業場景通常該把它收緊。

## 整體來說

企業頻道的選擇其實不是在比功能表，而是在回答兩個部署問題：**你的 Gateway 能不能接受 inbound HTTPS**（決定 Slack 走 Socket 還是 HTTP），以及**入口該不該和 Gateway 分開**（決定要不要 relay）。

至於安全，這批頻道最該主動設的一格是 `contextVisibility`——在企業空間裡，「誰能觸發 agent」和「哪些人的文字會進到模型上下文」的差距，比在私人群組裡大得多。

## 更新紀錄

- 2026-08-18：對照官方文件現況大改。**修正整張比較表的「安裝」欄**：Slack 與 Google Chat 已不是內建，企業頻道全部改為 official plugin，核心內建的聊天介面只剩 WebChat。Slack 段大幅擴充為現況的三種傳輸模式（Socket／HTTP／Relay）與官方的選擇矩陣，並新增：多 Gateway 共用同一個 Slack app 會造成 payload 落到任一連線的陷阱、Relay 模式的授權邊界、Enterprise Grid 組織層級安裝（不支援 relay、需要 Org Admin 核准）、Slack 多人 DM 走群組規則的路由行為。移除未查證的各頻道能力比較細項（thread、E2EE、streaming 等欄位），改指向各自的官方頁面，並補上 `contextVisibility` 對這批頻道的意義。

## 參考資料

本篇整理自以下 OpenClaw 官方文件：

- [Slack](https://docs.openclaw.ai/channels/slack) — 三種傳輸模式、Enterprise Grid manifest、relay 設定
- [Chat channels](https://docs.openclaw.ai/channels/) — 頻道的 plugin 分類與投遞注意事項
- [Groups](https://docs.openclaw.ai/channels/groups) — 共用的群組規則與 `contextVisibility`
- [Microsoft Teams](https://docs.openclaw.ai/channels/msteams)、[Google Chat](https://docs.openclaw.ai/channels/googlechat)、[Matrix](https://docs.openclaw.ai/channels/matrix)、[Feishu](https://docs.openclaw.ai/channels/feishu) — 各頻道設定
