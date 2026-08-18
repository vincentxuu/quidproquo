---
title: "OpenClaw 頻道總覽：31 個頻道幾乎都是 plugin，以及「誰能觸發」與「模型看得到什麼」是兩回事"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, channels, pairing, group-policy, routing, access-control]
lang: zh-TW
series:
  name: "OpenClaw 文件導讀"
  order: 13
tldr: "OpenClaw 支援 31 個聊天頻道，但只有 WebChat 在核心裡——連 Slack 和 WhatsApp 都是要裝的 plugin。而群組安全其實有兩個獨立的軸：allowlist 管的是誰能觸發 agent，不管模型會看到哪些引用與歷史，後者要另外設 contextVisibility。"
description: "OpenClaw 頻道系統總覽：plugin 化的安裝模型、DM 與群組策略、mention gating、觸發授權與上下文可見性的區別、visibleReplies 與 ambient room events。"
draft: false
---

OpenClaw 能接上你已經在用的聊天軟體，每個頻道都透過 Gateway 連進來。這篇講**所有頻道共通的那層規則**，個別頻道的設定在後面三篇。

## 先搞懂安裝模型：幾乎都是 plugin

這是相對 3 月最大的變化，而且會影響你的部署預期。官方文件現在把頻道分成四類：

| 類別 | 意義 | 例子 |
|---|---|---|
| 核心內建 | 不用裝 | WebChat |
| Bundled plugin | 隨核心安裝一起來 | Telegram、Reef |
| Official plugin | 一行指令裝，或在 onboarding／`channels add` 時按需安裝 | Slack、Discord、WhatsApp、Signal、iMessage、Teams…… |
| External plugin | 在 OpenClaw repo 之外維護 | WeChat、WeCom、Yuanbao、Zalo ClawBot |

```bash
openclaw plugins install @openclaw/<channel>
```

**裝完要重啟 Gateway。** 另外一個實務差異：WhatsApp 是「按需安裝」——onboarding 可能在 plugin 還沒裝好之前就先顯示設定流程，Gateway 只有在頻道真正啟用時才載入那個外部 plugin。

所以「支援 31 個頻道」的正確理解是：核心提供的是頻道**框架**，不是 31 個內建實作。

## DM 策略

| Policy | 行為 |
|---|---|
| `pairing`（多數頻道預設）| 陌生人要配對碼 + 核准 |
| `allowlist` | 只允許 `allowFrom` 列表裡的人 |
| `open` | 任何人都能聊（需明確設 `allowFrom: ["*"]`）|
| `disabled` | 關閉 DM |

配對請求有兩個實際限制值得記住：**一小時後過期，每個帳號最多同時 3 筆待處理**。核准可以走 Control UI 的 **Settings → Channels → DM access requests**，或用 CLI：

```bash
openclaw pairing list whatsapp
openclaw pairing approve whatsapp <CODE>
```

要注意這個核准和頻道本身的登入是兩件事——例如 WhatsApp 的 QR 是用來連結帳號的，跟核准某個人能不能跟你的 agent 說話無關。

## 群組：預設是關的

群組訊息進來之後的判斷順序，官方文件寫得很清楚：

```text
groupPolicy? disabled       -> 丟棄
groupPolicy? allowlist      -> 這個群組被允許嗎？否 -> 丟棄
requireMention? yes         -> 有被 mention 嗎？否 -> 只存成上下文
mention / 回覆 / 指令 / DM  -> 當成使用者請求
always-on 群組閒聊          -> 使用者請求，或設定過就變成 room event
```

預設值是**保守的**：`groupPolicy: "allowlist"`（群組發言者在被加進 allowlist 前一律擋掉），而且回覆需要 mention。

這裡有個心智模型要調整：OpenClaw 是「活在你自己的帳號上」，不是一個獨立的 bot 使用者。**你在哪個群組裡，OpenClaw 就看得到那個群組**——所以預設把群組關起來不是保守，是必要。

| 想要 | 設定 |
|---|---|
| 開放所有群組但只在被 @ 時回 | `groups: { "*": { requireMention: true } }` |
| 只有特定群組 | `groups: { "<id>": { ... } }`（不要 `"*"` 這個鍵）|
| 只有你能在群組觸發 | `groupPolicy: "allowlist"` + `groupAllowFrom: ["+1555..."]` |
| 跨頻道共用一組信任名單 | `groupAllowFrom: ["accessGroup:operators"]` |

## 兩個獨立的軸：誰能觸發 vs 模型看得到什麼

這是這篇最值得帶走的一段，也是最容易誤解的設計。

**allowlist 管的是「誰能觸發 agent」，不管「模型會看到什麼」。** 預設情況下 OpenClaw 保留收到的上下文原樣——被引用的訊息、thread 歷史、轉發的中繼資料，都會照原樣注入模型，**即使那些內容來自不在 allowlist 上的人**。

要連上下文也一起過濾，得另外設 `contextVisibility`：

| 模式 | 行為 |
|---|---|
| `"all"`（預設）| 上下文照收 |
| `"allowlist"` | 只注入 allowlist 名單內發送者的歷史／thread／引用／轉發內容 |
| `"allowlist_quote"` | 同上，但保留明確被引用／回覆的那則訊息（不論誰發的）|

可以設在頻道層、帳號層或全域（`channels.defaults.contextVisibility`）。會抓取補充上下文的頻道（Discord、Feishu、iMessage、Matrix、Teams、QQBot、Signal、Slack、Telegram、WhatsApp）在組裝入站上下文時會套用這個政策，而且**未知的政策組合是 fail closed——直接省略上下文**。

如果你在意 prompt injection，這是要主動設的一格：預設值讓任何能在群組發言的人，都有機會把文字送進你的模型上下文。

## 誰決定 agent 要不要開口

`messages.groupChat.visibleReplies` 有兩種模式：

- **`"automatic"`（預設）** — 最終的助理文字自動貼到房間裡
- **`"message_tool"`** — 由模型自己決定何時開口，要呼叫 `message(action=send)` 才會發言

第二種適合共用房間，但有前提：**需要工具呼叫夠可靠的模型**。如果模型漏掉工具、直接回了一段實質文字，OpenClaw 會把那段文字留成私有的，不貼到房間——這是安全的失敗方向，但也意味著模型不夠好時它會看起來「不回話」。

還有一層保護：如果 message 工具在當前工具政策下不可用，OpenClaw 會退回 automatic，而不是靜默地把回應吞掉，`openclaw doctor` 也會對這種不一致提出警告。

這個設計取代了舊的做法——以前要靠強迫模型回傳 `NO_REPLY` 來表示「這輪不說話」，現在在 tool-only 模式下，不呼叫工具就是不說話。

**指令是例外**：原生 slash command 與經授權的文字 `/...` 指令一律可見回覆，不受 `message_tool` 限制。

## Ambient room events

給「常駐在某個房間」的場景用的新設定：

```json5
{ messages: { groupChat: { unmentionedInbound: "room_event" } } }
```

預設是 `"user_request"`。改成 `room_event` 之後，**沒有被 mention 的群組閒聊會變成安靜的房間上下文，而不是使用者請求**——agent 讀得到，但除非它主動呼叫 message 工具，否則不會出聲。被 mention 的訊息、指令、中止請求與 DM 仍然是使用者請求。

## Session key

- 群組預設 `agent:<agentId>:<channel>:group:<id>`，房間／頻道用 `channel:<id>`
- Telegram 的 forum topic 會再加 `:topic:<id>`，**每個 topic 有自己的 session**
- 直接對話走主 session（`session.dmScope` 預設 `main`，把 DM 收攏進 agent 主 session）

## 兩個共用機制

**Bot loop protection** — 接受 bot 發出的入站訊息的頻道，可以用共用的迴圈保護，避免兩個 bot 互相回覆到天荒地老。

**Access groups** — `accessGroup:<name>` 讓你把一組信任的發送者定義一次，在多個頻道的 allowlist 重複使用。

## 整體來說

頻道層的設計可以濃縮成三句話：**DM 存取由 `allowFrom` 管、群組存取由 `groupPolicy` 加 allowlist 管、要不要回覆由 mention gating 管**。

而最容易被忽略的第四句是：**這三個都只管「觸發」，不管「模型看到什麼」**。上下文可見性是獨立的 `contextVisibility`，預設全開。

## 更新紀錄

- 2026-08-18：對照官方文件現況大改。**修正安裝模型**：頻道現在幾乎都是 plugin，分成核心內建（只有 WebChat）、bundled plugin（Telegram、Reef）、official plugin（Slack、Discord、WhatsApp 等）、external plugin 四類，裝完需重啟 Gateway；原文的頻道清單改為 31 個頻道的分類說明。新增：DM 配對請求的一小時過期與每帳號 3 筆上限、Control UI 的核准位置、群組訊息的完整判斷流程、**觸發授權與上下文可見性是兩個獨立的軸**（`contextVisibility` 及其 fail-closed 行為）、`visibleReplies` 的 automatic 與 message_tool 之別（含取代舊 `NO_REPLY` 模式）、ambient room events、bot loop protection、access groups。

## 參考資料

本篇整理自以下 OpenClaw 官方文件：

- [Chat channels](https://docs.openclaw.ai/channels/) — 頻道清單與 plugin 分類
- [Groups](https://docs.openclaw.ai/channels/groups) — 群組策略、mention gating、contextVisibility、visibleReplies
- [Ambient room events](https://docs.openclaw.ai/channels/ambient-room-events) — 常駐房間的安靜上下文模式
- [Access groups](https://docs.openclaw.ai/channels/access-groups) — 可重用的發送者名單
- [Security](https://docs.openclaw.ai/gateway/security) — requester-scoped 控制與 prompt 上下文
