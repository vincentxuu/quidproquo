---
title: "OpenClaw 其他頻道：Signal、iMessage、LINE，以及讓兩個人的 agent 直接對話的 Reef"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, signal, imessage, line, irc, nostr, zalo, reef, channels]
lang: zh-TW
series:
  name: "OpenClaw 文件導讀"
  order: 16
tldr: "這批頻道裡最值得看的是 Reef——不同人的 OpenClaw agent 之間的端對端加密側頻道，訊息在你的機器上封裝、雙向都經過釘死模型的守衛審查，中繼站永遠讀不到內容。它是 bundled plugin，不用另外裝。"
description: "OpenClaw 其餘聊天頻道導覽：Reef 的 agent 對 agent 加密通道與守衛機制、Signal 的號碼模型、以及 iMessage、LINE、IRC、Nostr、Twitch、Zalo 等頻道的現況。"
draft: false
---

主力與企業頻道之外還有一長串。這篇不逐個講設定——**挑出其中兩個機制上真的不一樣的**，其餘給一張現況地圖。

## Reef：讓兩個人的 agent 直接說話

這是 3 月之後新加的，也是整個頻道清單裡唯一一個**收件人不是人類**的頻道。

Reef 是不同人擁有的 OpenClaw agent 之間，一條**有守衛的端對端加密側頻道**。三個設計決定值得看：

**一、中繼站讀不到內容。** 訊息在你自己的機器上封裝。公開中繼站是 `reefwire.ai`，協定與中繼站原始碼開源在 `openclaw/reef`。

**二、雙向都有模型守衛，而且模型必須釘死。** `pinnedModel` **必須是不可變的模型 id**——帶日期的快照，或文件列出的少數固定 id。**浮動別名會被拒絕，而且每次守衛回應都必須回應完全相同的那個 id**。守衛是 **fail closed** 的：金鑰缺漏或供應商出錯，訊息就是不放行。

這個設計很值得玩味：既然要讓外部 agent 的文字進到你的系統，審查那些文字的模型就不能是「今天可能被悄悄換掉」的東西。

**三、配對是身分、金鑰、撤銷綁定的一次性交接。** 一般的 OpenClaw 配對核准在這裡被強化了——Reef 會在接受中繼邊或寫入已驗證的對方公鑰之前消耗掉那次核准，而且**只有在那份對方金鑰快照仍然是最新的情況下**中繼才會啟動。所以**過期的核准無法授權已變更的金鑰，也無法撤銷你本地的移除操作**。移除朋友時是先清掉本地信任、再阻斷中繼邊。

設定長這樣：

```json5
{
  channels: {
    reef: {
      enabled: true,
      relayUrl: "https://reefwire.ai",
      handle: "myclaw",
      requestPolicy: "code-only", // code-only | friends-of-friends | open
      guard: {
        provider: "openai",
        pinnedModel: "gpt-5.6-terra",
        apiKeyEnv: "REEF_GUARD_OPENAI_KEY",
        policyVersion: "reef-v1",
        timeoutMs: 30000,
      },
    },
  },
}
```

私鑰、加密的重放守衛、審查狀態、投遞去重、稽核鏈與已核准對方的金鑰釘選，全部留在本機的 plugin 狀態裡，**不離開機器**。`channels.reef` 裡沒有朋友 allowlist 可以編輯——朋友關係由中繼站的狀態加上本機 SQLite 裡的金鑰釘選共同決定。

交朋友的流程刻意需要**帶外驗證**：接收方在已認證的聊天裡產生短期代碼、透過其他管道分享，而且雙方要比對安全指紋。改動朋友關係與審查決定，要求發送者符合明確的 `commands.ownerAllowFrom` 條目——**萬用字元可以放行指令，但不授予擁有者權限**。

## Signal：先搞懂號碼模型

Signal 的坑不在安裝，在號碼。官方把「先讀這段」放在最前面是有原因的：

- Gateway 連的是一個 **Signal 裝置**（`signal-cli` 帳號）
- **把 bot 跑在你自己的個人 Signal 帳號上，它會忽略你自己的訊息**——那是迴圈保護
- 想要「我傳訊給 bot、它回我」，就要用**獨立的 bot 號碼**

這個行為很容易被誤判成「壞掉了」。安裝是 `openclaw plugins install @openclaw/signal`，Gateway 透過 HTTP 跟 `signal-cli` 溝通（原生 daemon 走 JSON-RPC + SSE，或 bbernhard 的容器走 REST + WebSocket），**OpenClaw 本身不內嵌 libsignal**。

設定精靈會偵測 `signal-cli` 在不在 `PATH` 上，不在的話可以幫你裝（Linux x86-64 抓官方原生 GraalVM build，macOS 與其他架構走 Homebrew）。兩條設定路徑：用 `signal-cli link` 掃 QR 連結既有帳號，或替專用號碼跑 SMS 註冊。

另外有個預設值得知道：Signal 預設**可以寫入設定**（由 `/config set|unset` 觸發，需要 `commands.config: true`），要關掉設 `channels.signal.configWrites: false`。

## 其餘頻道的現況地圖

這批的共同點是幾乎都已 plugin 化，設定在各自的官方頁面：

| 頻道 | 類別 | 一句話 |
|---|---|---|
| iMessage | official plugin | 透過 imsg（stdio 上的 JSON-RPC），私有 API 支援回覆、tapback、特效、投票、附件、群組管理。新設定建議用這條 |
| LINE | official plugin | LINE Messaging API |
| IRC | official plugin | 有存取控制與疑難排解文件 |
| Nostr | official plugin | 走 NIP-04 加密訊息的 DM 頻道 |
| Twitch | official plugin | 聊天 bot，含 token 更新 |
| Matrix | official plugin | 見上一篇企業頻道 |
| Mattermost | official plugin | 開源 Slack 替代品 |
| Nextcloud Talk | official plugin | Nextcloud 的通訊功能 |
| Synology Chat | official plugin | 走 webhook |
| Tlon | official plugin | 基於 Urbit |
| SMS | official plugin | Twilio SMS/MMS，含投遞狀態 |
| QQ bot | official plugin | |
| Feishu | official plugin | |
| Buzz、ClickClack、Raft | official plugin | 3 月之後新增 |
| Zalo / Zalo personal | official plugin | 個人帳號版走 zca-js 的 QR 登入 |
| WeChat、WeCom、Yuanbao、Zalo ClawBot | **external plugin** | 在 OpenClaw repo 之外維護 |
| WebChat | 核心內建 | 走 Gateway WebSocket |

另外還有一個不算頻道但相關的：**Voice Call** plugin，透過 Plivo、Telnyx 或 Twilio 做電話整合。

## 挑頻道的實際判準

除了「我本來就在用哪個」之外，有三個技術面的判準：

**是不是 external plugin。** external 表示在 OpenClaw repo 之外維護，更新節奏與品質保證跟核心不同步。

**它需要你交出什麼。** Signal 需要一個獨立號碼與一個 `signal-cli` 程序；WhatsApp 需要 QR 連結你的帳號；Telegram 只要一個 bot token。這個成本差距比功能差距大得多。

**群組規則是不是共用的。** 官方明確列出套用相同群組規則的頻道有 Discord、iMessage、Matrix、Teams、QQBot、Signal、Slack、Telegram、WhatsApp、Zalo——在這張清單上，代表 `groupPolicy`、mention gating、`contextVisibility` 的知識可以直接遷移；不在清單上的就要另外看它自己的文件。

## 整體來說

這批頻道裡，Reef 是唯一一個改變了「頻道是什麼」的定義的——其他頻道是把人接到你的 agent，Reef 是把**別人的 agent** 接到你的 agent，而它為此加的那三層（本機封裝、釘死模型的雙向守衛、金鑰綁定的一次性配對）正好說明了跨信任邊界的 agent 通訊該有多小心。

## 更新紀錄

- 2026-08-18：對照官方文件現況大改。**新增 Reef**（3 月之後才有的 bundled plugin）：不同人的 agent 之間的端對端加密側頻道，含釘死模型的雙向守衛與 fail-closed 行為、身分／金鑰／撤銷綁定的一次性配對、本機保存的金鑰與稽核鏈。Signal 段改以號碼模型為主（跑在個人帳號上會因迴圈保護而忽略自己的訊息），並補上 plugin 安裝、`signal-cli` 的兩種傳輸與精靈自動安裝、預設允許設定寫入的行為。**移除未查證的容量數值表**（訊息分塊、媒體上限、群組歷史則數）。現況地圖新增 3 月之後出現的頻道：Buzz、ClickClack、QQ bot、Raft、SMS（Twilio）、WeChat、WeCom、Yuanbao、Zalo ClawBot、Zalo personal，並標示哪些是 external plugin。

## 參考資料

本篇整理自以下 OpenClaw 官方文件：

- [Reef](https://docs.openclaw.ai/channels/reef) — agent 對 agent 的加密通道、守衛與配對綁定
- [Signal](https://docs.openclaw.ai/channels/signal) — 號碼模型、傳輸方式與設定路徑
- [Chat channels](https://docs.openclaw.ai/channels/) — 完整頻道清單與 plugin 分類
- [Groups](https://docs.openclaw.ai/channels/groups) — 套用共用群組規則的頻道清單
- [Voice Call](https://docs.openclaw.ai/plugins/voice-call) — 電話整合 plugin
