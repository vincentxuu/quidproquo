---
title: "OpenClaw 主力頻道：WhatsApp、Telegram、Discord 各自會卡在哪一步"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, whatsapp, telegram, discord, channels, pairing]
lang: zh-TW
series:
  name: "OpenClaw 文件導讀"
  order: 14
tldr: "三個頻道各有一個「不知道就會卡住」的點：WhatsApp 是 QR 登入沒辦法遠端做、Telegram 是 bot 預設開著 Privacy Mode 收不到群組訊息（改完還要把 bot 退出再加回去）、Discord 是 Message Content Intent 沒開就收不到伺服器訊息。"
description: "OpenClaw 三大聊天頻道的實際設定坑：WhatsApp 的 plugin 按需安裝與 QR 登入、Telegram 的 Privacy Mode 與 token 解析順序、Discord 的 Gateway Intents 與配對前置條件。"
draft: false
---

這三個是最多人用的頻道。設定步驟官方文件都有，這篇挑出**每個頻道那個「不知道就會卡住」的點**——它們的共同特徵是：錯了不會報錯，只會安靜地不動作。

## WhatsApp

**安裝是按需的。** WhatsApp 的執行期活在核心 npm 套件之外，`openclaw onboard`、`channels add --channel whatsapp`、`channels login --channel whatsapp` 第一次選到它時會提示安裝。手動裝：

```bash
openclaw plugins install clawhub:@openclaw/whatsapp
```

穩定版／beta 會先從 ClawHub 裝 `@openclaw/whatsapp`，失敗才退回 npm。裸的 npm 套件名只用在 registry 退路。

**卡住的點：登入只有 QR，而且 QR 會過期。** 遠端或無頭主機上要特別規劃——官方明講：**開始登入之前，先確保你有一條可靠的路徑把即時 QR 送到手機**，因為終端機畫出來的 QR、截圖、聊天附件都可能在傳輸途中就失效了。

```bash
openclaw channels login --channel whatsapp
openclaw channels login --channel whatsapp --account work   # 指定帳號
```

要特別分清楚兩件事：**連結帳號的 QR** 和 **核准某人能不能跟你的 agent 說話** 是不同的機制。後者是 DM access request，一小時過期、每帳號上限 3 筆。

**運作模型裡值得知道的幾點：**

- Gateway 擁有 WhatsApp socket 與重連迴圈。看門狗獨立追蹤兩個訊號——**原始傳輸活動**與**應用訊息活動**。安靜但連線正常的 session 不會只因為最近沒訊息就被重啟；只有在傳輸幀停止一段固定內部時間、或應用訊息沉默超過正常逾時的 4 倍時才強制重連
- 送出訊息需要目標帳號有活躍的監聽器，否則**快速失敗**
- 狀態與廣播聊天（`@status`、`@broadcast`）一律忽略
- 群組送出時會為 `@+號碼` 這類 token 附上原生 mention 中繼資料，前提是 token 對得上當前的參與者資料
- WhatsApp Web 傳輸會遵守 Gateway 主機的標準 proxy 環境變數（`HTTPS_PROXY` 等），**建議用主機層 proxy 設定而不是頻道層設定**

官方建議用獨立門號（設定與中繼資料都為此最佳化），但個人號碼／自聊模式也完整支援——onboarding 有專門的個人號碼模式，會寫入 `selfChatMode: true` 這類自聊友善的基線設定。

**實驗性功能**：`whatsapp_call` 可以打語音電話給當前的請求者並播放 TTS 訊息。預設關閉，而且設計上**沒有目的地號碼參數**——所以 prompt 沒辦法把電話導到別的號碼去。這個限制是刻意的。

## Telegram

**Telegram 是唯一不用另外裝的聊天頻道**（bundled plugin），也不用 `openclaw channels login`——設好 token 直接啟動 Gateway 就好。

```json5
{
  channels: {
    telegram: {
      enabled: true,
      botToken: "123:abc",
      dmPolicy: "pairing",
      groups: { "*": { requireMention: true } },
    },
  },
}
```

**卡住的點：Telegram bot 預設開著 Privacy Mode。** 這會限制 bot 能收到哪些群組訊息——你的 agent 在群組裡看起來像沒反應，其實是根本沒收到訊息。

兩個解法擇一：跟 BotFather 用 `/setprivacy` 關掉，或把 bot 設成群組管理員。**關鍵在後面那句：切換之後，要把 bot 從每個群組移除再重新加入，Telegram 才會套用變更。** 這一步漏掉的話，前面白做。

**其他容易踩的：**

- **token 解析是帳號感知的**：`tokenFile` > `botToken` > 環境變數，而且 `TELEGRAM_BOT_TOKEN` **只對預設帳號生效**，具名帳號一定要用 `botToken` 或 `tokenFile`
- 啟動成功後 bot 身分會快取最多 24 小時（省一次 `getMe`），換掉或移除 token 才會清掉
- **`-100` 開頭的負數超級群組 ID 是群組聊天 ID**，要放在 `channels.telegram.groups` 底下，**不是** `groupAllowFrom`
- `allowFrom` 收的是數字型的 Telegram user ID（`telegram:` / `tg:` 前綴會被正規化）
- forum topic 每個都有獨立 session（session key 會多一段 `:topic:<id>`）

**Dashboard Mini App** 是後來加的：在 DM 裡打 `/dashboard`，可以把完整的 Control UI 當成 Telegram WebApp 打開。前提有兩個——`gateway.tailscale.mode` 要設 `serve` 或 `funnel`（需要已發布的 HTTPS URL），而且你的數字 user ID 要在該帳號的有效 `allowFrom` 或 `commands.ownerAllowFrom` 裡，**萬用字元和使用者名稱都不算數**。它會驗證 Telegram 簽章過的 `initData`，拒絕缺漏、無效、過期或重放的資料。

## Discord

**卡住的點：Privileged Gateway Intents。** 在 Developer Portal 的 Bot 頁面：

- **Message Content Intent** — **一般伺服器訊息必需**，沒開就收不到
- **Server Members Intent** — 建議開；角色 allowlist、名稱轉 ID、頻道對象存取群組都需要它
- **Presence Intent** — 選配

沒開 Message Content Intent 的話 OpenClaw 仍能在 DM 運作，所以症狀是「私訊有回、群組沒回」——很容易誤判成權限或 allowlist 問題。

**第二個坑在配對之前**：要讓配對流程跑得起來，Discord 必須允許 bot 私訊你。到伺服器圖示右鍵 →**Privacy Settings**→打開 **Direct Messages**。

**第三個是命名誤導**：Bot 頁面的 **Reset Token** 按鈕會產生你的第一組 token——雖然叫「Reset」，但沒有東西被重設。

OAuth2 的最低權限是 View Channels、Send Messages、Read Message History、Embed Links、Attach Files；bot 要在 thread（含 forum／media 頻道流程）發言的話還要 **Send Messages in Threads**。

**如果啟動時被 Discord 擋或限流**，可以設 `channels.discord.applicationId` 讓啟動跳過那次應用查詢的 REST 呼叫。多 bot 的話把 token 和 application ID 各自放在帳號底下——注意頂層的 `applicationId` 會被帳號繼承，所以只有在每個帳號都用同一個時才設在頂層。

## 三者的實際差異

| | WhatsApp | Telegram | Discord |
|---|---|---|---|
| 安裝 | official plugin（按需）| bundled，不用裝 | official plugin |
| 登入 | QR，只能互動式做 | 貼 token 即可 | 貼 token 即可 |
| 最容易卡住的地方 | QR 傳輸到手機 | Privacy Mode（且要退出重加）| Message Content Intent |
| 傳輸 | WhatsApp Web（Baileys）| 長輪詢（預設）／webhook | Discord gateway |
| 配對碼有效期 | 1 小時 | 1 小時 | 1 小時 |

## 整體來說

這三個頻道的坑有個共同形狀：**失敗是安靜的**。QR 過期、Privacy Mode 沒關、Intent 沒開，症狀都是「它就是不回話」，而不是任何一則錯誤訊息。所以設定完之後值得主動驗一次——在群組裡 @ 一下、看 `openclaw logs --follow` 有沒有收到那則訊息，比盯著設定檔看有效。

下一篇講企業頻道。

## 更新紀錄

- 2026-08-18：對照官方文件現況大改。**修正安裝模型**：WhatsApp 與 Discord 現在都是 official plugin（WhatsApp 更是按需安裝、執行期在核心套件之外），只有 Telegram 是 bundled。改寫體裁：移除未查證的容量數值表（訊息分塊字元數、媒體大小上限、群組歷史則數），改以每個頻道「安靜失敗」的實際卡點為主。新增：WhatsApp 的 QR 遠端傳輸警告、雙訊號看門狗、狀態／廣播忽略、proxy 環境變數、實驗性 `whatsapp_call`（無目的地參數的設計）；Telegram 的 Privacy Mode 與「改完要退出重加」、token 解析順序與環境變數只對預設帳號生效、`-100` 群組 ID 的歸屬、Dashboard Mini App 的 Tailscale 前提；Discord 的三個 Privileged Intent、配對前要開放 DM、Reset Token 的命名誤導、被限流時用 `applicationId` 跳過啟動查詢。

## 參考資料

本篇整理自以下 OpenClaw 官方文件：

- [WhatsApp](https://docs.openclaw.ai/channels/whatsapp) — plugin 安裝、QR 登入、執行期模型與 `whatsapp_call`
- [Telegram](https://docs.openclaw.ai/channels/telegram) — token 解析、Privacy Mode、Dashboard Mini App
- [Discord](https://docs.openclaw.ai/channels/discord) — Gateway Intents、OAuth2 權限與多帳號設定
- [Chat channels](https://docs.openclaw.ai/channels/) — 頻道的 plugin 分類
- [Groups](https://docs.openclaw.ai/channels/groups) — 群組策略與 session key
